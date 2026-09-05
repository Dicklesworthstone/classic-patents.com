/**
 * energyLedger.ts
 *
 * Energy readouts with an explicit distinction between admitted kernel
 * outputs, legacy illustrative snapshots, and unavailable quantities.
 * A static snapshot cannot certify dH/dt = Pin - Pout. Only Edison's
 * shared steady radiative model currently provides a checked power balance.
 */

import { stepGoodyearRubber, stepHallAluminium, stepThomsonWelding } from "./catalogKernels";
import { hostStateDigest } from "./deepWasm";
import {
  EDISON_DECLARED_FILAMENT_LENGTH_CM,
  EDISON_DECLARED_HOT_RESISTANCE_OHM,
  EDISON_SOURCE_MAX_RESISTANCE_OHM,
  EDISON_SOURCE_MIN_RESISTANCE_OHM,
  stepEdisonRadiativeBalance,
} from "./edisonWasm";
import { ENERGY_CHANNEL_OMISSION_REASONS } from "./energyChannels";
import { areDimensionsEqual, DIM_POWER, parseUnitToDimension } from "./qty";
import {
  readWattCondenserControls,
  stepWattCondenser,
  WATT_SCENARIO_NOTE,
} from "./wattCondenserKernel";
import { readWrightControls, stepWrightFlyerSi } from "./wrightKernel";

export interface EnergyComponents {
  kineticJoules: number;
  potentialJoules: number;
  electromagneticJoules: number;
  thermalJoules: number;
  totalHamiltonianJoules: number;
}

export interface PortHamiltonianReport {
  availability: "kernel-partial" | "steady-power" | "illustrative-snapshot" | "unavailable";
  reason: string;
  runtimeSource: "host-estimate" | "ts-fallback" | "wasm" | "unavailable";
  storedEnergyAvailable: boolean;
  inputPowerAvailable: boolean;
  dissipatedPowerAvailable: boolean;
  energy: EnergyComponents;
  inputPowerWatts: number;
  dissipatedPowerWatts: number;
  /** Explicit useful output when the model supplies it; null means unavailable. */
  outputPowerWatts: number | null;
  /** Elastic energy per undeformed volume; does not imply a known specimen volume. */
  strainEnergyDensityJPerM3?: number;
  dissipationLabel?: string;
  /** Difference of available ports only; incomplete ports cannot determine dH/dt. */
  netPowerRateWatts: number;
  balance:
    | { kind: "unavailable"; reason: string }
    | { kind: "steady-state"; residualWatts: number; toleranceWatts: number; balanced: boolean };
  /** Host multiply-xor unless a WASM module actually hashed. Never fake `blake3:`. */
  stateDigest: string;
  digestKind: "host" | "blake3";
}

/**
 * Computes the live Port-Hamiltonian energy state for a given patent system.
 */
export function computePortHamiltonianEnergy(
  patentId: string,
  params: Record<string, number>,
  simTimeSec: number = 0,
): PortHamiltonianReport {
  let kinetic = 0;
  let potential = 0;
  let em = 0;
  let thermal = 0;
  let powerIn = 0;
  let dissipated = 0;
  let outputPower: number | null = null;
  let strainEnergyDensityJPerM3: number | undefined;
  let dissipationLabel: string | undefined;
  let availability: PortHamiltonianReport["availability"] = "illustrative-snapshot";
  let runtimeSource: PortHamiltonianReport["runtimeSource"] = "host-estimate";
  let reason =
    "Illustrative snapshot with assumed operating constants; not a measured energy balance or a historical performance claim.";
  let storedEnergyAvailable = true;
  let inputPowerAvailable = true;
  let dissipatedPowerAvailable = true;
  let balance: PortHamiltonianReport["balance"] = {
    kind: "unavailable",
    reason:
      "No accepted energy trajectory and integrated port work are available to measure a conservation residual.",
  };
  const omissionReason =
    ENERGY_CHANNEL_OMISSION_REASONS[patentId as keyof typeof ENERGY_CHANNEL_OMISSION_REASONS];
  // An unknown power partition does not erase Goodyear's modeled elastic
  // energy density. Its branch below admits that quantity alone.
  const hasElasticDensityModel = patentId === "us-3633-goodyear-rubber";
  if (
    (omissionReason && !hasElasticDensityModel) ||
    !Number.isFinite(simTimeSec) ||
    Object.values(params).some((value) => !Number.isFinite(value))
  ) {
    return unavailableEnergy(omissionReason ?? "Non-finite energy input.");
  }

  switch (patentId) {
    case "us-821393-wright-flyer": {
      const si = stepWrightFlyerSi(readWrightControls(params));
      kinetic = si.translationalKineticJoules;
      dissipated = si.aerodynamicDragPowerWatts;
      availability = "kernel-partial";
      runtimeSource = "ts-fallback";
      inputPowerAvailable = false;
      reason =
        "Translational kinetic energy and drag power from the shared Wright SI step at the prescribed mph airspeed and declared gross weight. Engine input, altitude energy, and a complete energy trajectory are not solved.";
      break;
    }

    case "us-381968-tesla-motor": {
      // US 381,968 supplies apparatus relations, not source values for
      // inertia, field strength, current, torque, power, or losses. Keep the
      // universal ledger empty rather than presenting later-motor estimates.
      break;
    }

    case "us-223898-edison-lightbulb":
    case "us-223898-edison-lamp": {
      const resistance = params.hotResistanceOhm ?? EDISON_DECLARED_HOT_RESISTANCE_OHM;
      if (
        resistance < EDISON_SOURCE_MIN_RESISTANCE_OHM ||
        resistance > EDISON_SOURCE_MAX_RESISTANCE_OHM
      )
        return unavailableEnergy("Hot resistance is outside the source's 100–500 Ω example range.");
      const voltage = params.voltage ?? params.mainsVoltageV ?? 110;
      if (!Number.isFinite(voltage) || voltage < 0 || voltage > 500) {
        return unavailableEnergy("Operating voltage is outside the supported 0–500 V range.");
      }
      const state = stepEdisonRadiativeBalance({
        voltageV: voltage,
        hotResistanceOhm: resistance,
        filamentLengthCm: params.filamentLength ?? EDISON_DECLARED_FILAMENT_LENGTH_CM,
      });
      if (!state)
        return unavailableEnergy("The shared Edison radiative kernel refused these inputs.");
      powerIn = state.joule_power_w;
      dissipated = state.radiative_power_w;
      availability = "steady-power";
      runtimeSource = state.runtimeSource;
      storedEnergyAvailable = false;
      reason =
        "Steady filament power only: Joule input minus net thermal radiation from the shared kernel. No filament mass or heat capacity is assumed, and no transient stored-energy claim is made.";
      balance = measureSteadyPowerBalance(powerIn, dissipated);
      break;
    }

    case "us-2495429-spencer-microwave": {
      // US 2,495,429 gives comparative cooking-energy observations, but it
      // does not specify the electrical input, cavity Q, conversion
      // efficiency, food mass, or a closed energy balance for the illustrated
      // apparatus. Refuse a numeric ledger instead of inventing those values.
      powerIn = 0;
      em = 0;
      thermal = 0;
      dissipated = 0;
      break;
    }

    case "us-3858232-boyle-smith-ccd": {
      // The grant prints topology and a pulse-overlap condition, not the
      // capacitance, operating voltage/frequency, die size, current, loss, or
      // thermal mass needed for a closed energy ledger.
      break;
    }

    case "us-2981877-noyce-ic": {
      // The grant provides no operating voltage, capacitance, clock, current,
      // or die thermal data. Preserve the unsupported zero ledger.
      break;
    }

    case "us-3633-goodyear-rubber": {
      const stretch = params.appliedTensileStretch ?? 1.8;
      const tempC = params.vulcanTemp ?? 145;
      const sulfur = params.sulfurPct ?? 8;
      const specimen = params.specimenTempC ?? 35;
      if (
        stretch < 1 ||
        stretch > 2.5 ||
        tempC < 110 ||
        tempC > 190 ||
        sulfur < 0 ||
        sulfur > 30 ||
        specimen < -20 ||
        specimen > 100
      )
        return unavailableEnergy("Controls are outside the Goodyear teaching model's range.");
      strainEnergyDensityJPerM3 = stepGoodyearRubber(
        tempC,
        sulfur,
        30,
        stretch,
        specimen,
      ).strainEnergyDensityJPerM3;
      availability = "kernel-partial";
      runtimeSource = "ts-fallback";
      storedEnergyAvailable = false;
      inputPowerAvailable = false;
      dissipatedPowerAvailable = false;
      reason =
        "Elastic strain energy per undeformed volume, from the displayed nominal-stress model at the current sulfur and cure settings (30 min). The coefficient is illustrative. Specimen volume, thermal energy, loading rate and hysteresis are not supplied, so total joules and power remain unknown.";
      break;
    }

    case "us-3671542-kwolek-kevlar": {
      // The checked claims identify a composition and selected liquid media,
      // not a spinning line, finished fiber, test specimen, or energy path.
      // Keep every ledger term at zero rather than manufacturing a tensile or
      // ballistic model from later material data.
      break;
    }

    case "us-1102653-goddard-rocket": {
      const mDotKgs = params.fuelFlowRateKgs ?? 1.8;
      const pcPsi = params.chamberPressure ?? 350.0;
      const vExhaustMps = 1800.0 + pcPsi * 1.2; // 2220 m/s isentropic exhaust velocity
      const rocketMassKg = 45.0; // Vehicle dry + residual mass
      const vehicleVelMps = 650.0;
      const altitudeM = 18000.0;

      kinetic = 0.5 * rocketMassKg * vehicleVelMps * vehicleVelMps; // Stored vehicle kinetic energy
      potential = rocketMassKg * 9.81 * altitudeM; // Stored gravitational potential energy
      powerIn = mDotKgs * 4.4e7; // Liquid oxygen / gasoline chemical combustion power (44 MJ/kg)
      const jetPower = 0.5 * mDotKgs * vExhaustMps * vExhaustMps; // Supersonic nozzle exhaust power
      dissipated = jetPower; // Kinetic energy carried away by exhaust plume
      thermal = 8.5e5; // Combustion chamber wall heat content
      break;
    }

    case "us-400766-hall-aluminium": {
      const current = params.currentAmperes ?? 300000;
      const temperature = params.bathTemperatureCelsius ?? 960;
      const concentration = params.aluminaConcentrationPct ?? 5.5;
      if (
        current < 100000 ||
        current > 500000 ||
        temperature < 920 ||
        temperature > 1020 ||
        concentration < 2 ||
        concentration > 8
      )
        return unavailableEnergy("Controls are outside the Hall teaching cell's operating range.");
      const hall = stepHallAluminium({
        currentAmperes: current,
        bathTemperatureCelsius: temperature,
        aluminaConcentrationPct: concentration,
      });
      powerIn = hall.electricalInputWatts;
      dissipated = hall.bathOhmicHeatingWatts;
      dissipationLabel = "Bath Joule heat";
      availability = "kernel-partial";
      runtimeSource = "ts-fallback";
      storedEnergyAvailable = false;
      reason =
        "Modern teaching cell: electrical input VI and bath Joule heating I²R come from the shared model (1.18 V reaction term, 0.55 V overpotential, 9 µΩ bath resistance). Bath heating is one internal dissipation term, not total heat rejection. Stored chemical/thermal energy and a complete transient balance are not solved; these are not operating values printed in US 400,766.";
      break;
    }

    case "gb-1306-watt-rotary-engine": {
      // The available GB 1306 artifact does not supply a source engine's
      // dimensions, pressure trace, mass flow, losses, or inertia. The live
      // visual can solve its declared kinematics, but a closed historical
      // power partition would be fabricated. Preserve the explicit zero state.
      break;
    }

    case "gb-913-watt-separate-condenser": {
      const controls = readWattCondenserControls(params);
      const watt = stepWattCondenser(controls);
      powerIn = watt.heatInputRateKw * 1000;
      outputPower = watt.netShaftPowerKw * 1000;
      dissipated = watt.airPumpPowerKw * 1000;
      dissipationLabel = "Air pump";
      availability = "kernel-partial";
      runtimeSource = "ts-fallback";
      storedEnergyAvailable = false;
      reason = `${WATT_SCENARIO_NOTE} Furnace input, net shaft output, and air-pump load come from the shared kernel. Stored energy and complete heat rejection are not supplied.`;
      break;
    }

    case "us-194047-otto-engine": {
      // The grant prints no mass, inertia, speed, pressure trace, fuel flow,
      // heating value, or loss datum for a closed SI energy ledger.
      break;
    }

    case "us-542846-diesel-engine":
      // The source face is held; no energy ledger is inferred from its
      // qualitative process description.
      break;

    case "us-1647-morse-telegraph": {
      const volt = params.lineVoltage ?? 24.0;
      const rLine = params.lineResistance ?? 120.0;
      const rRelay = 80.0;
      const rTotal = rLine + rRelay;
      const current = volt / rTotal; // Amperes

      powerIn = volt * current; // Primary chemical battery input power (Watts)
      const inductanceH = 0.45; // Relay coil inductance
      em = 0.5 * inductanceH * current * current; // Stored magnetic field energy
      potential = 0.05 * 9.80665 * 0.003; // Brass key return spring potential
      dissipated = current * current * rTotal; // Joule heat across copper wire & relay coil
      thermal = 15.0; // Coil thermal capacity
      break;
    }

    case "us-124404-westinghouse-air-brake": {
      const resPsi = params.reservoirPressure ?? 70.0;
      const brakePsi = params.brakePipePressure ?? 50.0;
      const compWork = resPsi * 6894.76 * 0.04; // Reservoir D (40 L) pneumatic pressure work (Joules)
      potential = compWork; // Stored compressed air energy
      powerIn = 3500.0; // Locomotive steam air-compressor pump power (Watts)
      kinetic = 0.5 * 18000.0 * 15.0 ** 2; // Moving train car kinetic energy (Joules)
      dissipated = (brakePsi / 70.0) * 12000.0 + 80.0; // Cast iron brake shoe frictional dissipation
      thermal = 8500.0; // Brake shoe thermal capacity
      break;
    }

    case "us-682690-hewitt-mercury-lamp": {
      const arcVolt = params.arcVoltage ?? 110.0;
      const arcCurr = params.arcCurrent ?? 3.5;
      powerIn = arcVolt * arcCurr; // DC arc discharge electrical power (Watts)
      em = 0.08 * arcCurr * arcCurr; // Ballast choke electromagnetic storage
      thermal = 450.0; // Mercury vapor pool & tube quartz heat capacity
      dissipated = powerIn * 0.82; // Thermal conduction + non-visible IR emission (18% luminous efficacy)
      break;
    }

    case "us-706737-fessenden-wireless": {
      // US 706,737 gives qualitative circuit relationships and source examples,
      // but no complete inertia, current, resistance, power, or loss data from
      // which to close an energy ledger. Leave every channel at zero.
      break;
    }

    case "us-233692-pelton-water-wheel":
    case "us-233692-pelton-wheel": {
      // The grant gives bucket geometry but no head, flow, runner inertia,
      // speed, tailrace elevation, loss fraction, or efficiency. Keep the
      // energy ledger at its zero/unsupported boundary.
      break;
    }

    case "us-235199-bell-photophone": {
      const solarIlluminanceLux = params.solarIlluminanceLux ?? 50000.0;
      const seleniumResistanceOhms = params.seleniumResistanceOhms ?? 1200.0;
      const biasVoltageV = params.biasVoltageV ?? 24.0;
      const beamWatts = params.beamPowerWatts ?? (solarIlluminanceLux / 100000.0) * 1.5;
      const modulation = params.modulationDepth ?? 0.35;
      powerIn = beamWatts + (biasVoltageV * biasVoltageV) / seleniumResistanceOhms;
      potential = 0.5 * 250.0 * 0.00008 ** 2; // Silvered glass diaphragm acoustic deflection strain
      em = (beamWatts / 3e8) * 100.0 + 0.5 * 15e-12 * biasVoltageV * biasVoltageV;
      dissipated = beamWatts * (1.0 - 0.08 * modulation) + powerIn * 0.99;
      thermal = 0.015 * 320.0 * 25.0; // Selenium cell thermal mass
      break;
    }

    case "us-247804-delaval-separator": {
      const rpm = params.bowlRpm ?? 6000.0;
      const _feedLph = params.feedRateLph ?? 250.0;
      const omega = (rpm * 2 * Math.PI) / 60.0;
      const bowlInertia = 0.085; // Forged steel centrifuge bowl
      kinetic = 0.5 * bowlInertia * omega * omega;
      powerIn = 350.0; // Belt drive electric motor input power (Watts)
      dissipated = powerIn * 0.82; // High-speed bearing friction + milk viscous shear
      potential = 0.5 * 1030.0 * (omega * 0.12) ** 2 * 0.001; // Centrifugal liquid head potential
      thermal = 2.5 * 460.0 * 25.0; // Bowl thermal mass
      break;
    }

    case "us-361931-daimler-engine": {
      // The grant does not print a motor speed, power, inertia, material heat
      // capacity, or loss budget. Preserve the zero/unsupported ledger instead
      // of manufacturing a closed balance for its marine installation.
      break;
    }

    case "us-608969-parsons-turbine": {
      const steamPressureBar = params.steamPressureBar ?? 12.0;
      const steamFlowKgS = params.steamFlowKgS ?? 4.5;
      const rpm = params.turbineRpm ?? 3000.0;
      const omega = (rpm * 2 * Math.PI) / 60;

      powerIn = steamFlowKgS * 2800e3 * (steamPressureBar / 12.0); // Enthalpy flux
      kinetic = 0.5 * 45.0 * omega * omega; // Multi-stage rotor kinetic energy
      thermal = 180000.0; // Casing and blade steel thermal capacity
      dissipated = powerIn * 0.28; // Exhaust steam enthalpy + blade friction
      break;
    }

    case "us-2929922-townes-laser": {
      // The grant does not supply pump power, transition wavelength, gain,
      // detector response, or an operating point. Preserve the unsupported
      // zero ledger rather than importing a modern ruby-laser efficiency.
      break;
    }

    case "us-3353115-maiman-ruby-laser":
    case "us-3353115-maiman-laser": {
      // The scenario kernel can close a pulse-power flow from its explicitly
      // labeled modern inputs, but neither the grant nor that stateless step
      // supplies a time-resolved optical-field state, thermal mass, or lattice
      // temperature field. A Port-Hamiltonian stored-energy claim would invent
      // all three. The Maiman faces therefore use energyChannelsFor() for the
      // pulse balance and keep this state ledger honestly empty.
      break;
    }

    case "us-174465-bell-telephone": {
      const lineCurrentMa = params.lineCurrentMa ?? 15.0;
      const soundDb = params.soundPressureDb ?? 75.0;
      const i = lineCurrentMa / 1000.0;
      const coilInductanceH = 0.12; // Horseshoe electromagnet coil inductance
      em = 0.5 * coilInductanceH * i * i; // Stored magnetic pole energy
      const diagMassKg = 0.003; // Iron diaphragm mass (3 grams)
      const diagVelMps = 0.02 * (soundDb / 75.0);
      kinetic = 0.5 * diagMassKg * diagVelMps * diagVelMps;
      potential = 0.5 * 1800.0 * 15e-6 ** 2; // Diaphragm flexural strain energy (15 um deflection)
      powerIn = 12.0 * i + 10 ** ((soundDb - 120) / 10) * 0.001; // Battery electrical input + acoustic wave work
      dissipated = i * i * 350.0; // 350 Ohm line loop resistance Joule heat
      thermal = 2.5; // Receiver coil thermal capacity
      break;
    }

    case "us-1773980-farnsworth-tv": {
      const anodeKv = params.anodeVoltageKv ?? 1.8;
      const beamUa = params.electronBeamCurrentUa ?? 80.0;
      const anodeV = anodeKv * 1000.0;
      const beamA = beamUa * 1e-6;
      powerIn = anodeV * beamA + 4.5; // Anode accelerator HV power + cathode heater wattage
      const coilCurrA = 0.45;
      const deflInductanceH = 0.035;
      em = 0.5 * deflInductanceH * coilCurrA * coilCurrA; // Magnetic focusing/deflection coil stored energy
      const electronMassKg = 9.1093837e-31;
      const electronCount = beamA / 1.60217663e-19;
      const vElectrons = Math.sqrt((2 * 1.60217663e-19 * anodeV) / electronMassKg);
      kinetic =
        electronCount * 0.5 * electronMassKg * vElectrons * vElectrons * (0.35 / vElectrons); // Flight-time beam kinetic energy
      dissipated = powerIn * 0.92; // Phosphor screen thermal dissipation (8% cathode luminescence)
      thermal = 18.0; // Dissector tube glass envelope heat capacity
      break;
    }

    case "us-1781541-einstein-refrigerator": {
      // The grant gives topology and the ordering h₂ < h₁, but no masses,
      // elevations, flow rates, temperatures, pressures, heat-source power,
      // cooling capacity, or loss model. A numeric energy ledger would be an
      // invented apparatus, so the source-bounded ledger remains zero.
      break;
    }

    case "us-2292387-lamarr-frequency-hopping": {
      // The grant specifies record, tuning, and control topology but no RF
      // power, carrier values, record speed, inertia, suction, or loss data.
      // Preserve the explicit zero ledger instead of backfilling folklore.
      break;
    }

    case "us-2524035-bardeen-transistor": {
      const vColl = params.collectorVoltageV ?? 40.0;
      const iEmitterMa = params.emitterCurrentMa ?? 2.0;
      const iBaseMa = params.baseCurrentMa ?? 0.4;
      const pSupply = vColl * ((iEmitterMa - iBaseMa) / 1000.0) + 1.5 * (iEmitterMa / 1000.0);
      powerIn = pSupply; // DC bias battery power input
      const cJunctionFarads = 5.0e-12; // 5 pF point contact depletion capacitance
      em = 0.5 * cJunctionFarads * vColl * vColl; // Point-contact barrier space-charge energy
      potential = 1.60217663e-19 * 0.67 * (iEmitterMa / 1000.0) * 6.242e18; // Germanium bandgap minority hole potential
      dissipated = powerIn; // Germanium crystal block Joule heating
      thermal = 0.01 * 320.0 * 25.0; // Germanium wafer heat capacity
      break;
    }

    case "us-3138743-kilby-integrated-circuit": {
      // The source omits an operating voltage/current and thermal point, so
      // this ledger intentionally preserves unsupported energy terms at zero.
      break;
    }

    case "us-3541541-engelbart-mouse": {
      // The grant prints neither mass, hand force, rolling resistance, supply
      // voltage/current, nor a thermal operating point. Preserve every energy
      // term at zero instead of inventing a modern mouse power budget.
      break;
    }

    case "us-4136359-wozniak-apple": {
      const clockMhz = params.clockMhz ?? 1.023;
      const dramBytes = 49152; // 48 KB RAM
      powerIn = 38.0; // 38 Watts switching power supply input
      em = 0.5 * 100e-6 * 5.0 * 5.0; // 100 uF main board decoupling capacitor energy
      const _dramDynPower = dramBytes * 1.5e-13 * 5.0 * 5.0 * (clockMhz * 1e6);
      dissipated = powerIn; // Motherboard and logic TTL chip Joule heat
      thermal = 0.85 * 840.0 * 25.0; // FR-4 PCB and ceramic IC heat capacity
      break;
    }

    case "us-x9430-colt-revolver": {
      // US X9430 supplies a linked lockwork sequence, not a mass, charge,
      // pressure, geometry, thermal, or timing card.  Keep the universal
      // energy ledger empty rather than presenting a fictitious firing cycle.
      break;
    }

    case "us-6120588-eink": {
      const vElectrophoretic = params.electrophoreticVoltageV ?? 15.0;
      const pixelCount = 600 * 800; // SVGA E-Ink display panel
      const cPixelPf = 2.0e-12; // 2 pF per microcapsule electrode
      em = 0.5 * pixelCount * cPixelPf * vElectrophoretic * vElectrophoretic; // Stored dielectric matrix energy
      powerIn = pixelCount * cPixelPf * (vElectrophoretic * vElectrophoretic) * 1.0; // Zero static power, active only on page turn
      dissipated = powerIn; // Microcapsule fluid viscous dissipation
      thermal = 0.05 * 1200.0 * 25.0;
      break;
    }

    case "us-6285999-pagerank": {
      const nodes = params.crawlNodes ?? 10000.0;
      const damping = params.dampingFactor ?? 0.85;
      powerIn = (nodes / 1000.0) * 150.0; // Server compute cluster CPU power (Watts)
      potential = nodes * Math.log2(nodes) * 1e-6; // Information-theoretic graph entropy potential (Joules)
      dissipated = powerIn * damping; // Server thermal dissipation
      thermal = 5000.0; // Rack server heat sink capacity
      break;
    }

    case "us-6331181-davinci": {
      // The grant contains no source data for a closed SI energy ledger.
      // Preserve the explicit zero state; the public 3D face omits the strip.
      break;
    }

    case "us-6594844-roomba": {
      // The grant contains no source data for a closed SI energy ledger.
      // Preserve the explicit zero state; the public 3D face omits the strip.
      break;
    }

    case "us-7479949-multitouch": {
      // The omission registry returns before this switch for US 7,479,949.
      // Retain an explicit empty branch as a second refusal boundary: the
      // grant's post-detection command rules do not establish sensor charge,
      // controller power, thermal capacity, or an SI energy trajectory.
      break;
    }

    case "us-808897-carrier-air-conditioner": {
      const airFlowCfm = params.airFlowCfm ?? 2500.0;
      const chillerHp = params.chillerHp ?? 15.0;
      powerIn = chillerHp * 745.7; // Compressor electric power in Watts
      const kgS = (airFlowCfm * 0.0283168 * 1.2) / 60.0;
      thermal = kgS * 1005.0 * 15.0; // Enthalpy drop across chilled spray chamber
      dissipated = powerIn * 0.22; // Spray pump viscous shear + motor losses
      break;
    }

    case "us-727650-linde-air-liquefaction": {
      const throttlePressureBar = params.throttlePressureBar ?? 200.0;
      const compressorKw = params.compressorKw ?? 45.0;
      powerIn = compressorKw * 1000.0;
      potential = (throttlePressureBar * 1e5 * 0.05) / 1.4; // High-pressure gas pneumatic potential
      thermal = 12000.0; // Cryogenic liquid air enthalpy reservoir (77 K)
      dissipated = powerIn * 0.75; // Heat exchanger thermal rejection + throttling entropy production
      break;
    }

    case "us-971501-haber-ammonia": {
      const synthesisPressureBar = params.synthesisPressureBar ?? 200.0;
      const spaceVelocity = params.spaceVelocity ?? 30000.0;
      powerIn = (synthesisPressureBar / 200.0) * 85000.0; // High-pressure circulation pump power
      potential = (synthesisPressureBar * 1e5 * 0.08) / 1.4;
      thermal = (spaceVelocity / 30000.0) * 45000.0; // Exothermic heat of formation (dH = -92.4 kJ/mol)
      dissipated = powerIn * 0.35; // Cooling jacket thermal rejection
      break;
    }

    case "us-2297691-carlson-electrophotography": {
      const coronaVoltageKv = params.coronaVoltageKv ?? 6.0;
      const drumSpeedRpm = params.drumSpeedRpm ?? 15.0;
      powerIn = coronaVoltageKv * 1000.0 * 0.002 + 800.0; // Corona wire + fusing lamp
      em = 0.5 * 2.5e-9 * (coronaVoltageKv * 1000.0) ** 2; // Photoconductive layer electrostatic energy
      kinetic = 0.5 * 0.45 * ((drumSpeedRpm * 2 * Math.PI) / 60) ** 2; // Rotating selenium drum
      thermal = 1800.0; // Thermal fuser roller heat (180°C)
      dissipated = powerIn * 0.92; // Fuser thermal conduction into paper
      break;
    }

    case "us-593138-tesla-coil": {
      // The grant contains no source data for a closed SI energy ledger.
      // Preserve the explicit zero state; the public 3D face omits the strip.
      break;
    }

    case "us-586193-marconi-radio": {
      const sparkVoltageKv = params.sparkVoltageKv ?? 25.0;
      const aerialCapPf = params.aerialCapPf ?? 220.0;
      const vSpark = sparkVoltageKv * 1000.0;
      const cAerial = aerialCapPf * 1e-12;
      em = 0.5 * cAerial * vSpark * vSpark;
      powerIn = em * 500.0; // 500 spark discharges per second (induction coil interrupter)
      dissipated = powerIn * 0.78; // Spark gap thermal resistance + ground return dissipation
      thermal = 120.0;
      break;
    }

    case "us-613809-tesla-teleautomaton": {
      const vesselVelocityKnots = params.vesselVelocityKnots ?? 6.0;
      const rudderAngleDeg = params.rudderAngleDeg ?? 0.0;
      const vMps = vesselVelocityKnots * 0.514444;
      const vesselMassKg = 120.0;
      kinetic = 0.5 * vesselMassKg * vMps * vMps;
      potential = 0.5 * 15.0 * (rudderAngleDeg * (Math.PI / 180)) ** 2; // Rudder steering return spring
      powerIn = 180.0; // 24V propulsion motor current (7.5 A)
      dissipated = 0.5 * 1025.0 * vMps ** 3 * 0.18 + 25.0; // Hull skin friction + steering solenoid heat
      thermal = 350.0;
      break;
    }

    case "us-879532-de-forest-audion": {
      const plateVoltageV = params.plateVoltageV ?? 90.0;
      const plateCurrentMa = params.plateCurrentMa ?? 4.5;
      const filamentVoltageV = params.filamentVoltageV ?? 6.0;
      const filamentCurrentA = params.filamentCurrentA ?? 1.1;
      powerIn = plateVoltageV * (plateCurrentMa / 1000.0) + filamentVoltageV * filamentCurrentA;
      em = 0.5 * 8.5e-12 * plateVoltageV * plateVoltageV; // Inter-electrode grid-plate capacitance
      thermal = 0.0015 * 130.0 * (2100.0 - 293.15); // Tantalum filament thermal heat capacity
      dissipated = powerIn * 0.98; // Thermionic plate dissipation + filament radiation
      break;
    }

    case "us-319596-maxim-machine-gun": {
      const recoilVelocityMps = params.recoilVelocityMps ?? 5.8;
      const rateOfFireRpm = params.rateOfFireRpm ?? 600.0;
      const movingPartsMassKg = 3.2;
      kinetic = 0.5 * movingPartsMassKg * recoilVelocityMps * recoilVelocityMps;
      potential = 0.5 * 450.0 * 0.025 * 0.025; // Mainspring strain energy in full battery
      powerIn = (rateOfFireRpm / 60.0) * 3200.0; // Chemical propellant combustion power (3.2 kJ/cartridge)
      dissipated = powerIn * 0.72; // Barrel water jacket cooling heat + muzzle gas expansion
      thermal = 4.2 * 4184.0 * 65.0; // 4.2 liters of cooling water in water jacket
      break;
    }

    case "us-347140-thomson-welding": {
      const current = params.weldCurrentAmps ?? 4500;
      if (current < 1000 || current > 6000)
        return unavailableEnergy("Welding current is outside the model's 1000–6000 A range.");
      powerIn = stepThomsonWelding({ ...params, weldCurrentAmps: current }).jouleWatts;
      availability = "kernel-partial";
      runtimeSource = "ts-fallback";
      storedEnergyAvailable = false;
      dissipatedPowerAvailable = false;
      reason =
        "Contact electrical power converted to heat by the shared I²R teaching model at a declared 0.18 mΩ resistance. Transformer losses, clamp work, cooling and stored heat are not solved; this is not a historical performance measurement.";
      break;
    }

    case "us-470918-reno-escalator": {
      const passengerCount = params.passengerCount ?? 8;
      const beltSpeedMps = params.beltSpeedMps ?? 0.45;
      const inclineAngleDeg = 25.0;
      const inclineHeightM = 4.5;
      const totalPassengerMassKg = passengerCount * 75.0;
      const palletChainMassKg = 420.0;
      kinetic = 0.5 * (totalPassengerMassKg + palletChainMassKg) * beltSpeedMps * beltSpeedMps;
      potential = totalPassengerMassKg * 9.80665 * (inclineHeightM / 2.0);
      powerIn =
        totalPassengerMassKg *
          9.80665 *
          beltSpeedMps *
          Math.sin((inclineAngleDeg * Math.PI) / 180) +
        1200.0;
      dissipated = 1200.0 + totalPassengerMassKg * 0.08 * 9.80665 * beltSpeedMps; // Drive sprocket friction
      thermal = 600.0;
      break;
    }

    case "us-307031-edison-indicator": {
      // The grant prints no operating voltage, current, capacitance,
      // temperature, material heat capacity, or radiative-loss measurement.
      // A quantitative energy ledger would therefore be invented.
      break;
    }

    case "us-36836-gatling-gun": {
      const crankRpm = params.crankRpm ?? 80.0;
      const barrelCount = params.barrelCount ?? 6.0;
      const rateOfFireRpm = crankRpm * barrelCount;
      const clusterMassKg = 18.5;
      const omega = (crankRpm * 2 * Math.PI) / 60.0;
      kinetic = 0.5 * clusterMassKg * (0.08 * omega) ** 2; // Rotating 6-barrel cluster inertia
      powerIn = 75.0 + (rateOfFireRpm / 60.0) * 2800.0; // Crank muscular work + powder combustion throughput
      dissipated = (rateOfFireRpm / 60.0) * 2800.0 * 0.7; // 6-barrel convective & muzzle gas dissipation
      thermal = barrelCount * 2.8 * 490.0 * (120.0 - 20.0); // Distributed thermal capacity of 6 steel barrels
      break;
    }

    case "us-157124-glidden-barbed-wire": {
      const twistRateTpi = params.twistRateTpi ?? 4.0;
      const lineTensionN = params.lineTensionN ?? 850.0;
      const wireLengthM = 100.0;
      const wireCrossSectionM2 = Math.PI * 0.00125 * 0.00125;
      const youngsModulusPa = 210e9;
      const shearModulusPa = 79e9;
      const thetaRad = twistRateTpi * ((2 * Math.PI) / 0.0254) * wireLengthM;
      potential =
        0.5 *
          ((youngsModulusPa * wireCrossSectionM2) / wireLengthM) *
          ((lineTensionN / (youngsModulusPa * wireCrossSectionM2)) * wireLengthM) ** 2 +
        0.5 * ((shearModulusPa * ((Math.PI * 0.00125 ** 4) / 2)) / wireLengthM) * thetaRad ** 2;
      powerIn = 450.0; // Twisting machine drive motor
      dissipated = 380.0; // Plastic torsion work + barb crimping friction
      thermal = 250.0;
      break;
    }

    case "us-200521-edison-phonograph": {
      const mandrelRpm = params.mandrelRpm ?? 120.0;
      const soundPressurePa = params.soundPressurePa ?? 2.0;
      const mandrelMassKg = 0.85;
      const omega = (mandrelRpm * 2 * Math.PI) / 60.0;
      kinetic = 0.5 * (0.5 * mandrelMassKg * 0.05 * 0.05) * omega * omega;
      potential = 0.5 * 120.0 * (0.00015 * (soundPressurePa / 2.0)) ** 2; // Diaphragm compliance strain
      powerIn = (0.5 * (soundPressurePa * soundPressurePa * 0.002)) / 415.0 + 8.5; // Acoustic acoustic wave power + crank work
      dissipated = 8.2; // Stylus drag in tinfoil/wax groove + bearing friction
      thermal = 45.0;
      break;
    }

    case "us-79265-sholes-typewriter":
    case "us-184-sholes-typewriter": {
      const typingSpeedWpm = params.typingSpeedWpm ?? 45.0;
      const keyStrokeForceN = params.keyStrokeForceN ?? 4.5;
      const strikesPerSecond = (typingSpeedWpm * 5.0) / 60.0;
      const typebarMassKg = 0.018;
      const typebarVelocityMps = 3.2;
      kinetic = 0.5 * typebarMassKg * typebarVelocityMps * typebarVelocityMps;
      potential = 0.5 * 85.0 * 0.015 * 0.015; // Typebar return spring potential
      powerIn = strikesPerSecond * keyStrokeForceN * 0.015; // Finger input power
      dissipated = powerIn * 0.95; // Ribbon inking impact dissipation + escapement friction
      thermal = 20.0;
      break;
    }

    case "us-4750-howe-sewing-machine": {
      // US 4,750 supplies mechanism topology, an approximate 1/8-inch eye
      // offset, and an approximate 3/4-inch baster-point pitch. It supplies no
      // mass, inertia, force, torque, speed, friction, or thermal datum from
      // which an honest SI energy ledger can be closed.
      break;
    }

    case "us-6162-corliss-steam-engine": {
      const boilerPressurePsi = params.boilerPressurePsi ?? 100.0;
      const engineRpm = params.engineRpm ?? 60.0;
      const pistonMassKg = 85.0;
      const strokeM = 0.914; // 3-foot stroke
      const omega = (engineRpm * 2 * Math.PI) / 60.0;
      const vPiston = strokeM * omega;
      kinetic = 0.5 * pistonMassKg * vPiston * vPiston + 0.5 * 450.0 * (1.8 * omega) ** 2; // Piston + giant flywheel
      potential = (boilerPressurePsi * 6894.76 * 0.08) / 1.3; // High-pressure steam cylinder expansion potential
      powerIn = 45000.0; // 60 HP Corliss steam engine
      dissipated = powerIn * 0.28; // Condenser thermal rejection + dashpot friction
      thermal = 28000.0;
      break;
    }

    case "us-132-davenport-electric-motor": {
      const batteryVoltageV = params.batteryVoltageV ?? 12.0;
      const motorCurrentA = params.motorCurrentA ?? 4.0;
      const rotorRpm = params.rotorRpm ?? 450.0;
      const rotorMassKg = 2.4;
      const omega = (rotorRpm * 2 * Math.PI) / 60.0;
      kinetic = 0.5 * (0.5 * rotorMassKg * 0.075 * 0.075) * omega * omega;
      em = 0.5 * 0.045 * motorCurrentA * motorCurrentA; // Armature electromagnet inductance
      powerIn = batteryVoltageV * motorCurrentA; // Grove battery galvanic power
      dissipated = motorCurrentA * motorCurrentA * 2.2 + 8.5; // Commutator brush resistance & arc dissipation
      thermal = 140.0;
      break;
    }

    case "us-120057-gramme-dynamo": {
      const driveRpm = params.driveRpm ?? 900.0;
      const fieldCurrentA = params.fieldCurrentA ?? 8.5;
      const _outputVoltageV = params.outputVoltageV ?? 110.0;
      const ringCoreMassKg = 14.0;
      const omega = (driveRpm * 2 * Math.PI) / 60.0;
      kinetic = 0.5 * (0.5 * ringCoreMassKg * 0.12 * 0.12) * omega * omega;
      em = 0.5 * 0.25 * fieldCurrentA * fieldCurrentA; // Ring armature toroidal magnetic field
      powerIn = 2500.0; // Steam engine belt drive mechanical input
      dissipated = fieldCurrentA * fieldCurrentA * 1.4 + 180.0; // Copper I^2*R losses + eddy current hysteresis
      thermal = 850.0;
      break;
    }

    case "us-942699-baekeland-bakelite": {
      const autoclavePressurePsi = params.autoclavePressurePsi ?? 100.0;
      const autoclaveTempC = params.autoclaveTempC ?? 160.0;
      const resinMassKg = 5.0;
      potential = (autoclavePressurePsi * 6894.76 * 0.05) / 1.4; // Autoclave gas pressure potential
      thermal = resinMassKg * 1800.0 * (autoclaveTempC - 20.0); // Phenol-formaldehyde resin thermal capacity
      powerIn = 3500.0; // Steam heating jacket input power
      dissipated = 2800.0; // Autoclave convective cooling loss
      break;
    }

    case "us-78317-nobel-dynamite": {
      const ngMassFraction = params.ngMassFraction ?? 0.75;
      const chargeMassGrams = params.chargeMassGrams ?? 100.0;
      potential = (chargeMassGrams / 1000.0) * ngMassFraction * 6.3e6; // Chemical explosive potential energy (6.3 MJ/kg)
      thermal = 450.0;
      powerIn = 0.0;
      dissipated = 0.0;
      break;
    }

    case "us-x1-hopkins-potash":
    case "us-1-hopkins-potash": {
      // The one-sheet letters patent supplies no quantitative thermal inputs,
      // so an energy ledger would be invented rather than source-derived.
      break;
    }

    case "us-31128-otis-elevator": {
      // US 31,128 provides connectivity and switching logic, but no mass,
      // speed, height, friction, torque, or power. Preserve an explicit zero
      // ledger rather than fabricating a quantitative Hamiltonian.
      break;
    }

    case "us-x72-whitney-cotton-gin": {
      // The source supplies neither inertia nor torque/load data. An energy
      // ledger would fabricate the very quantities it purports to audit.
      break;
    }

    case "us-x8277-mccormick-reaper": {
      // The source prints kinematic ratios but no mass, inertia, drawbar
      // force, cutting resistance, or loss data. A nonzero ledger would be a
      // fabricated power model rather than an auditable source projection.
      break;
    }

    case "us-621195-zeppelin-airship": {
      const airshipSpeedMps = params.speedMps ?? 8.0;
      const airshipMassKg = 12000.0;
      const gasVolumeM3 = 11300.0;
      kinetic = 0.5 * airshipMassKg * airshipSpeedMps ** 2; // Rigid dirigible kinetic energy
      potential = (1.225 - 0.089) * gasVolumeM3 * 9.80665 * 100.0; // Hydrogen aerostat buoyancy potential
      powerIn = 2.0 * 16.0 * 735.5; // Twin Daimler internal-combustion engines (2 x 16 HP)
      dissipated = 0.5 * 1.225 * airshipSpeedMps ** 3 * 0.08 * 140.0; // Aerodynamic drag dissipation
      break;
    }

    case "us-388850-eastman-kodak": {
      const _shutterTensionN = 12.0;
      potential = 0.5 * 450.0 * 0.008 ** 2; // Sector shutter spring elastic strain energy
      kinetic = 0.02; // Spool inertia
      powerIn = 0.5; // Manual film winding key rotation
      dissipated = 0.48; // Roll film friction and ratchet escapement loss
      break;
    }

    case "us-6469-lincoln-buoy": {
      const displacementM3 = params.displacementM3 ?? 12.0;
      potential = 1000.0 * 9.80665 * displacementM3 * 0.8; // Riverboat buoyancy lift potential
      kinetic = 15.0;
      powerIn = 1800.0; // Main steam engine air pump shaft work
      dissipated = 1750.0; // Bellows expansion aerodynamic drag and river current friction
      break;
    }

    case "us-3237-rillieux-evaporator":
    case "us-4879-rillieux-evaporator": {
      const steamRateKgPerS = 0.25;
      const latentHeatJPerKg = 2.257e6;
      thermal = 1500.0 * 4184.0 * (100.0 - 55.0); // Cane juice multiple-effect latent & sensible heat
      powerIn = steamRateKgPerS * latentHeatJPerKg; // Boiler exhaust steam enthalpy flux (~564 kW)
      dissipated = 0.96 * powerIn; // Triple-effect vapor condensation & vacuum heat rejection
      break;
    }

    case "us-105338-hyatt-celluloid": {
      const pressForceN = params.pressForceN ?? 45000.0;
      const moldTempC = params.moldTempC ?? 125.0;
      potential = 0.5 * (pressForceN ** 2 / 1.5e7); // Hydraulic mold plunger strain energy
      thermal = 2.5 * 1400.0 * (moldTempC - 20.0); // Celluloid pyroxyline billet thermal content
      powerIn = 2200.0; // Steam heating jacket & ram work
      dissipated = 2100.0; // Thermal dissipation and plastic viscous shear
      break;
    }

    case "us-395781-hollerith-tabulating": {
      const solenoidCount = 40;
      const currentA = 0.8;
      const inductanceH = 0.05;
      em = 0.5 * solenoidCount * inductanceH * currentA ** 2; // Mercury cup pin-contact magnetic energy
      kinetic = 0.5 * solenoidCount * 0.015 * 0.2 ** 2; // Dial register escapement ratchet kinetic energy
      powerIn = 12.0 * (solenoidCount * currentA * 0.25); // 12V battery power
      dissipated = 0.95 * powerIn; // Coil Joule heating and friction
      break;
    }

    case "us-588-ericsson-propeller": {
      const shaftRpm = params.shaftRpm ?? 120.0;
      const omega = (shaftRpm * 2 * Math.PI) / 60.0;
      kinetic = 0.5 * 85.0 * omega ** 2 * 2.0; // Contra-rotating twin coaxial screw propeller kinetic energy
      powerIn = 45000.0; // Marine steam engine shaft power (60 HP)
      dissipated = 0.35 * powerIn; // Hydrodynamic vortex swirl and skin friction dissipation
      break;
    }

    case "gb-931-arkwright-water-frame": {
      // The pinned reconstruction contains no authenticated water head, flow,
      // torque, inertia, or loss measurements. Kinematic scenario controls do
      // not close an energy balance, so leave every ledger channel at zero.
      break;
    }

    case "us-135245-pasteur-fermentation": {
      // US 135,245 specifies the process sequence and the 16-18 degree
      // Reaumur yeast-addition band, but it gives no wort volume, heat load,
      // cooling rate, or datum from which a closed energy ledger can be built.
      // Leave every ledger channel at its initialized zero rather than present
      // modern illustrative quantities as measurements from the grant.
      break;
    }

    case "gb-1420-cort-puddling-rolling": {
      // The later abridgment provides neither a closed thermal control volume
      // nor authenticated fuel, flow, charge, torque, or loss measurements.
      // Leave the ledger at zero instead of laundering scenario values into an
      // apparently measured Port-Hamiltonian balance.
      break;
    }

    case "us-48475-yale-lock": {
      const pinCount = 5;
      potential = pinCount * 0.5 * 180.0 * 0.003 ** 2; // 5 pin-tumbler phosphor bronze spring potential
      kinetic = 0.005; // Plug shear line rotation
      powerIn = 0.8; // Key insertion mechanical work
      dissipated = 0.78; // Key bitting friction
      break;
    }

    default: {
      return unavailableEnergy("No energy model is registered for this patent.");
    }
  }

  const totalH = kinetic + potential + em + thermal;
  const netPower = powerIn - dissipated - (outputPower ?? 0);
  if (
    ![
      kinetic,
      potential,
      em,
      thermal,
      powerIn,
      dissipated,
      totalH,
      netPower,
      strainEnergyDensityJPerM3 ?? 0,
    ].every(Number.isFinite)
  )
    return unavailableEnergy("The energy calculation produced a non-finite quantity.");
  if (availability === "illustrative-snapshot" && totalH === 0 && powerIn === 0 && dissipated === 0)
    return unavailableEnergy("This source-bounded model supplies no stored-energy or power data.");

  const stateDigest = hostStateDigest([
    kinetic,
    potential,
    em,
    thermal,
    powerIn,
    dissipated,
    netPower,
    simTimeSec,
    ...(outputPower === null ? [] : [outputPower]),
    ...(strainEnergyDensityJPerM3 === undefined ? [] : [strainEnergyDensityJPerM3]),
  ]);

  return {
    availability,
    reason,
    runtimeSource,
    storedEnergyAvailable,
    inputPowerAvailable,
    dissipatedPowerAvailable,
    balance,
    energy: {
      kineticJoules: Number(kinetic.toFixed(2)),
      potentialJoules: Number(potential.toFixed(2)),
      electromagneticJoules: Number(em.toFixed(2)),
      thermalJoules: Number(thermal.toFixed(2)),
      totalHamiltonianJoules: Number(totalH.toFixed(2)),
    },
    inputPowerWatts: Number(powerIn.toFixed(1)),
    dissipatedPowerWatts: Number(dissipated.toFixed(1)),
    outputPowerWatts: outputPower === null ? null : Number(outputPower.toFixed(1)),
    ...(strainEnergyDensityJPerM3 === undefined ? {} : { strainEnergyDensityJPerM3 }),
    ...(dissipationLabel ? { dissipationLabel } : {}),
    netPowerRateWatts: Number(netPower.toFixed(1)),
    stateDigest,
    digestKind: "host",
  };
}

function unavailableEnergy(reason: string): PortHamiltonianReport {
  return {
    availability: "unavailable",
    reason,
    runtimeSource: "unavailable",
    storedEnergyAvailable: false,
    inputPowerAvailable: false,
    dissipatedPowerAvailable: false,
    // Legacy numeric slots are not evidence of zero energy. Consumers must use availability.
    energy: {
      kineticJoules: 0,
      potentialJoules: 0,
      electromagneticJoules: 0,
      thermalJoules: 0,
      totalHamiltonianJoules: 0,
    },
    inputPowerWatts: 0,
    dissipatedPowerWatts: 0,
    outputPowerWatts: null,
    netPowerRateWatts: 0,
    balance: { kind: "unavailable", reason },
    stateDigest: "unavailable",
    digestKind: "host",
  };
}

/** A steady power residual in watts, never a transient ΔH claim in joules.
 * Tolerance is 10 nW absolute plus the larger 1e-8 relative scale. */
export function measureSteadyPowerBalance(
  inputWatts: number,
  outputWatts: number,
): PortHamiltonianReport["balance"] {
  if (![inputWatts, outputWatts].every((value) => Number.isFinite(value) && value >= 0)) {
    return { kind: "unavailable", reason: "Steady power ports must be finite and nonnegative." };
  }
  const residualWatts = inputWatts - outputWatts;
  const toleranceWatts = 1e-8 * Math.max(1, inputWatts, outputWatts);
  return {
    kind: "steady-state",
    residualWatts,
    toleranceWatts,
    balanced: Math.abs(residualWatts) <= toleranceWatts,
  };
}

export interface DiscretePassivityCheck {
  readonly passed: boolean;
  readonly powerInWatts: number;
  readonly powerOutWatts: number;
  readonly powerDissipatedWatts: number;
  readonly dHdtWatts: number;
  readonly residualWatts: number;
  readonly toleranceWatts: number;
  readonly passivityViolated: boolean;
  readonly energyInjectedWatts?: number;
  readonly refusalReason?: string;
}

/**
 * Validates discrete power balance and passivity across energetic ports.
 * For passive physical systems:
 * 1. Dissipation must be non-negative (no spontaneous energy generation / injection).
 * 2. Power balance residual: Pin - Pout - Pdiss - dH/dt must be zero within tolerance.
 * Deliberate energy injection (e.g. negative dissipation or ungrounded work) is caught.
 */
export function validateDiscretePassivityAndConservation(ports: {
  powerInWatts: number;
  powerOutWatts?: number;
  powerDissipatedWatts: number;
  dHdtWatts?: number;
  powerInUnit?: string;
  powerOutUnit?: string;
  powerDissipatedUnit?: string;
}): DiscretePassivityCheck {
  const pin = ports.powerInWatts;
  const pout = ports.powerOutWatts ?? 0;
  const pdiss = ports.powerDissipatedWatts;
  const dHdt = ports.dHdtWatts ?? 0;

  // Unit dimension checks if units are provided
  if (ports.powerInUnit) {
    const dim = parseUnitToDimension(ports.powerInUnit);
    if (!areDimensionsEqual(dim, DIM_POWER)) {
      return {
        passed: false,
        powerInWatts: pin,
        powerOutWatts: pout,
        powerDissipatedWatts: pdiss,
        dHdtWatts: dHdt,
        residualWatts: 0,
        toleranceWatts: 0,
        passivityViolated: false,
        refusalReason: `Unit mismatch on input power port: expected Power, received "${ports.powerInUnit}".`,
      };
    }
  }
  if (ports.powerOutUnit) {
    const dim = parseUnitToDimension(ports.powerOutUnit);
    if (!areDimensionsEqual(dim, DIM_POWER)) {
      return {
        passed: false,
        powerInWatts: pin,
        powerOutWatts: pout,
        powerDissipatedWatts: pdiss,
        dHdtWatts: dHdt,
        residualWatts: 0,
        toleranceWatts: 0,
        passivityViolated: false,
        refusalReason: `Unit mismatch on output power port: expected Power, received "${ports.powerOutUnit}".`,
      };
    }
  }
  if (ports.powerDissipatedUnit) {
    const dim = parseUnitToDimension(ports.powerDissipatedUnit);
    if (!areDimensionsEqual(dim, DIM_POWER)) {
      return {
        passed: false,
        powerInWatts: pin,
        powerOutWatts: pout,
        powerDissipatedWatts: pdiss,
        dHdtWatts: dHdt,
        residualWatts: 0,
        toleranceWatts: 0,
        passivityViolated: false,
        refusalReason: `Unit mismatch on dissipation port: expected Power, received "${ports.powerDissipatedUnit}".`,
      };
    }
  }

  // Non-finite check
  if (![pin, pout, pdiss, dHdt].every(Number.isFinite)) {
    return {
      passed: false,
      powerInWatts: pin,
      powerOutWatts: pout,
      powerDissipatedWatts: pdiss,
      dHdtWatts: dHdt,
      residualWatts: Number.NaN,
      toleranceWatts: 0,
      passivityViolated: false,
      refusalReason: "Non-finite port value in power balance evaluation.",
    };
  }

  // Passivity check: in passive systems, dissipation cannot be negative
  if (pdiss < -1e-9) {
    const injected = -pdiss;
    return {
      passed: false,
      powerInWatts: pin,
      powerOutWatts: pout,
      powerDissipatedWatts: pdiss,
      dHdtWatts: dHdt,
      residualWatts: pin - pout - pdiss - dHdt,
      toleranceWatts: 0,
      passivityViolated: true,
      energyInjectedWatts: injected,
      refusalReason: `UNPHYSICAL_ENERGY_INJECTION: Negative dissipation detected (${pdiss} W); system acts as an unphysical active source.`,
    };
  }

  if (pin < -1e-9) {
    return {
      passed: false,
      powerInWatts: pin,
      powerOutWatts: pout,
      powerDissipatedWatts: pdiss,
      dHdtWatts: dHdt,
      residualWatts: pin - pout - pdiss - dHdt,
      toleranceWatts: 0,
      passivityViolated: true,
      energyInjectedWatts: -pin,
      refusalReason: `UNPHYSICAL_ENERGY_INJECTION: Negative input power detected (${pin} W).`,
    };
  }

  const residualWatts = pin - pout - pdiss - dHdt;
  const toleranceWatts =
    1e-7 * Math.max(1, Math.abs(pin), Math.abs(pout), Math.abs(pdiss), Math.abs(dHdt));
  const passed = Math.abs(residualWatts) <= toleranceWatts;

  return {
    passed,
    powerInWatts: pin,
    powerOutWatts: pout,
    powerDissipatedWatts: pdiss,
    dHdtWatts: dHdt,
    residualWatts,
    toleranceWatts,
    passivityViolated: false,
    ...(!passed
      ? {
          refusalReason: `Energy conservation violation: power residual (${residualWatts.toPrecision(4)} W) exceeds tolerance (${toleranceWatts.toPrecision(4)} W).`,
        }
      : {}),
  };
}

export interface TimestepConvergenceReport {
  readonly converged: boolean;
  readonly estimatedOrder: number;
  readonly timesteps: readonly number[];
  readonly values: readonly number[];
  readonly errors: readonly number[];
  readonly monotonic: boolean;
  readonly refusalReason?: string;
}

/**
 * Validates timestep convergence of an energetic ODE / physical integration step
 * across 3 nested timesteps (dt, dt/2, dt/4).
 * Enforces monotonic error reduction and estimates order of convergence p.
 */
export function verifyTimestepConvergence<T>(
  stepper: (dt: number) => T,
  extractor: (result: T) => number,
  baseDt: number = 0.01,
): TimestepConvergenceReport {
  const dt1 = baseDt;
  const dt2 = baseDt / 2;
  const dt3 = baseDt / 4;

  const y1 = extractor(stepper(dt1));
  const y2 = extractor(stepper(dt2));
  const y3 = extractor(stepper(dt3));

  if (![y1, y2, y3].every(Number.isFinite)) {
    return {
      converged: false,
      estimatedOrder: 0,
      timesteps: [dt1, dt2, dt3],
      values: [y1, y2, y3],
      errors: [],
      monotonic: false,
      refusalReason: "Non-finite output encountered during timestep convergence test.",
    };
  }

  const diff1 = y1 - y2;
  const diff2 = y2 - y3;

  const err1 = Math.abs(diff1);
  const err2 = Math.abs(diff2);

  const monotonic = err2 < err1;
  const ratio = Math.abs(diff1) / Math.max(1e-15, Math.abs(diff2));
  const estimatedOrder = ratio > 1 ? Math.log2(ratio) : 0;

  // For convergence, errors must diminish monotonically as timestep shrinks (ratio > 1)
  const converged = monotonic && ratio > 1.05 && err2 < 0.05 * Math.max(1, Math.abs(y3));

  return {
    converged,
    estimatedOrder: Number(estimatedOrder.toFixed(2)),
    timesteps: [dt1, dt2, dt3],
    values: [y1, y2, y3],
    errors: [err1, err2],
    monotonic,
    ...(!converged
      ? {
          refusalReason: !monotonic
            ? `Timestep error increased as dt shrank from ${dt2} to ${dt3} (err1=${err1}, err2=${err2}); solver fails monotonic convergence.`
            : `Discretization error reduction ratio (${ratio.toFixed(2)}) is insufficient for convergence.`,
        }
      : {}),
  };
}
