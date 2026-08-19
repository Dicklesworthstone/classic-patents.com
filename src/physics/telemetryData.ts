/**
 * telemetryData.ts
 *
 * Domain-specific FrankenSim SI Physics Telemetry Registry with live reactive computational models.
 * Supplies authentic mathematical governing laws, real SI physical units,
 * interactive parameter controllers, and 60-FPS computed telemetry states for every classic patent.
 */

import {
  stepBellTelephone,
  stepCorlissEngine,
  stepDavenportMotor,
  stepDeLavalSeparator,
  stepEdisonBulb,
  stepEinsteinRefrigerator as stepEinsteinRefrigeratorSi,
  stepEngelbartMouse,
  stepGatlingGun,
  stepGliddenBarbedWire,
  stepGrammeDynamo,
  stepHyattCelluloid,
  stepLincolnBuoy as stepLincolnBuoySi,
  stepMcCormickReaper,
  stepMorseTelegraph,
  stepNobelDynamite,
  stepNoyceIC,
  stepOttoEngine,
  stepParsonsTurbine,
  stepPasteurFermentation,
  stepPeltonWheel,
  stepThomsonWelding,
  stepWhitneyCottonGin,
  stepWozniakApple,
  stepZeppelinAirship,
  voltsToKv,
} from "./catalogKernels";
import { FrankenSimEngine } from "./engine";
import { stepFermiKinetics } from "./fermiKinetics";
import {
  stepCcdWells,
  stepHoweSewingMachine,
  stepMergenthalerLinotype,
  stepRenoEscalator,
  stepSholesTypewriter,
} from "./machineKernels";

import { goddardNozzleMatch } from "./thermochem";
import { readWrightControls, stepWrightFlyerSi } from "./wrightKernel";

export interface PhysicsControl {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
}

export interface PhysicsMetric {
  label: string;
  value: string;
  unit: string;
  badgeColor: "cyan" | "emerald" | "amber" | "indigo" | "rose" | "purple";
  progressPct?: number; // 0 to 100 for live graphic meter
}

export function clampProgress(pct: number): number {
  return Math.min(100, Math.max(0, pct));
}

export interface PatentPhysicsMetadata {
  domain: string;
  domainTitle: string;
  equationName: string;
  governingEquation: string;
  engineMethod: string;
  controls: PhysicsControl[];
  computeMetrics: (params: Record<string, number>) => PhysicsMetric[];
  pedagogicalInsight: string;
  enforceConstraints?: (
    params: Record<string, number>,
    key: string,
    value: number,
  ) => Record<string, number>;
}

export const PATENT_PHYSICS_REGISTRY: Record<string, PatentPhysicsMetadata> = {
  "us-821393-wright-flyer": {
    domain: "aerodynamics_mbd",
    domainTitle: "6-DoF Aerodynamics & Lie-Group Multibody Dynamics",
    equationName: "Prandtl Induced Drag & Wing Warping Differential",
    governingEquation:
      "C_{D_i} = \\frac{C_L^2}{\\pi \\cdot \\text{AR} \\cdot e} \\quad \\text{and} \\quad \\Delta L = \\frac{1}{2} \\rho v^2 S \\cdot \\Delta C_L",
    engineMethod: "FrankenSimEngine.stepWrightFlyer",
    controls: [
      {
        id: "airspeed",
        label: "Gross Airspeed",
        min: 15,
        max: 45,
        step: 0.5,
        defaultValue: 28,
        unit: "mph",
      },
      {
        id: "wingWarp",
        label: "Wing Warp Deflection",
        min: -15,
        max: 15,
        step: 0.5,
        defaultValue: 0,
        unit: "°",
      },
      {
        id: "rudder",
        label: "Rudder Deflection",
        min: -25,
        max: 25,
        step: 0.5,
        defaultValue: 0,
        unit: "°",
      },
      {
        id: "elevator",
        label: "Canard Elevator",
        min: -15,
        max: 15,
        step: 0.5,
        defaultValue: 0,
        unit: "°",
      },
      {
        id: "coupled",
        label: "Claim 18 rudder linkage",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "",
      },
    ],
    computeMetrics: (p) => {
      const si = stepWrightFlyerSi(readWrightControls(p));
      return [
        {
          label: "Gross Lift",
          value: Math.round(si.liftNewtons).toLocaleString(),
          unit: "N",
          badgeColor: "emerald",
          progressPct: Math.min(100, (si.liftNewtons / 2500) * 100),
        },
        {
          label: "Induced Drag",
          value: si.inducedDragNewtons.toFixed(1),
          unit: "N",
          badgeColor: "amber",
          progressPct: Math.min(100, (si.inducedDragNewtons / 150) * 100),
        },
        {
          label: "Lift-to-Drag (L/D)",
          value: si.liftToDrag.toFixed(2),
          unit: "ratio",
          badgeColor: "indigo",
          progressPct: Math.min(100, (si.liftToDrag / 10) * 100),
        },
        {
          label: "Net Yaw",
          value: si.netYawNm >= 0 ? `+${si.netYawNm.toFixed(1)}` : si.netYawNm.toFixed(1),
          unit: "N·m",
          badgeColor: si.adverseYawDominant ? "rose" : "cyan",
          progressPct: clampProgress(100 - Math.abs(si.netYawNm) * 4),
        },
      ];
    },
    pedagogicalInsight:
      "Helical wing warping creates differential lift across wing tips; the mechanical coupling to the vertical rudder counteracts adverse yaw induced by differential vortex drag.",
    enforceConstraints: (params, key, value) => {
      const updated = { ...params, [key]: value };
      if (updated.coupled === 1) {
        if (key === "wingWarp" || key === "coupled") {
          updated.rudder = Number((updated.wingWarp * 0.5).toFixed(1)); // Simple linear coupling equivalent
        }
      }
      return updated;
    },
  },
  "us-381968-tesla-motor": {
    domain: "electromagnetics_flux",
    domainTitle: "Progressive Magnetic Poles in Tesla's Fig. 9 Apparatus",
    equationName: "Resultant Magnetizing Forces",
    governingEquation: "\\mathbf{B}_{\\mathrm{net}} = \\mathbf{B}_{B} + \\mathbf{B}_{B'}",
    engineMethod: "FrankenSimEngine.stepTeslaMotorFig9",
    controls: [
      {
        id: "phaseCount",
        label: "Illustrated circuit families (2 or 3)",
        min: 2,
        max: 3,
        step: 1,
        defaultValue: 2,
        unit: "phases",
      },
      {
        id: "frequency",
        label: "Generator phase-cycle rate (teaching model)",
        min: 20,
        max: 120,
        step: 1,
        defaultValue: 60,
        unit: "Hz",
      },
      {
        id: "acHum",
        label: "Live AC Hum Audio",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 0,
        unit: "on/off",
      },
    ],
    computeMetrics: (p) => {
      const f = p.frequency ?? 60;
      const apparatus = FrankenSimEngine.stepTeslaMotorFig9(f);

      return [
        {
          label: "Generator rotation",
          value: apparatus.generatorRpm.toLocaleString(),
          unit: "RPM",
          badgeColor: "cyan",
          progressPct: Math.min(100, (apparatus.generatorRpm / 7200) * 100),
        },
        {
          label: "Pole shift around ring",
          value: apparatus.poleShiftRpm.toLocaleString(),
          unit: "RPM",
          badgeColor: "emerald",
          progressPct: Math.min(100, (apparatus.poleShiftRpm / 7200) * 100),
        },
        {
          label: "Fig. 9 disk relation",
          value: apparatus.diskRpm.toLocaleString(),
          unit: "RPM",
          badgeColor: "amber",
          progressPct: Math.min(100, (apparatus.diskRpm / 7200) * 100),
        },
        {
          label: "Generator collector rings",
          value: "present",
          unit: "Fig. 9",
          badgeColor: "indigo",
          progressPct: clampProgress(100),
        },
      ];
    },
    pedagogicalInsight:
      "The source's Fig. 9 model routes two generator circuits through collector rings and brushes to corresponding motor-coil pairs. Their changing magnetizing forces progressively shift the ring poles; Tesla says disk D follows the moving points of greatest attraction.",
  },
  // Preserved non-public model. The exact route is constrained to a
  // source-reading guide until its 58-page scholarly edition is accepted.
  "_legacy-unpublished-us-2708656-fermi-reactor": {
    domain: "nuclear_kinetics",
    domainTitle: "6-Group Delayed Neutron Point Kinetics & Criticality",
    equationName: "Point Kinetics Differential Equation",
    governingEquation:
      "\\frac{dn}{dt} = \\frac{\\rho - \\beta}{\\Lambda} n + \\sum_{i=1}^6 \\lambda_i C_i \\quad \\text{with} \\quad k_{\\text{eff}} = 1.0000",
    engineMethod: "FrankenSimEngine.stepFermiReactor",
    controls: [
      {
        id: "rodWithdrawal",
        label: "Cadmium Rod Withdrawal",
        min: 0,
        max: 100,
        step: 0.5,
        defaultValue: 83.5,
        unit: "%",
      },
      {
        id: "moderatorPurity",
        label: "Graphite Moderator Purity",
        min: 80,
        max: 100,
        step: 0.5,
        defaultValue: 99.5,
        unit: "%",
      },
      {
        id: "fuelEnrichmentPct",
        label: "Uranium-235 Enrichment",
        min: 0.5,
        max: 1.2,
        step: 0.01,
        defaultValue: 0.72,
        unit: "%",
      },
    ],
    computeMetrics: (p) => {
      const rod = p.rodWithdrawal ?? 83.5;
      const mod = p.moderatorPurity ?? 99.5;
      const enrich = p.fuelEnrichmentPct ?? 0.72;
      const kinetics = stepFermiKinetics(rod, mod, enrich);
      const keff = kinetics.kEffective;
      const rhoDollars = kinetics.reactivityDollars;
      const thermalPower = kinetics.thermalPowerWatts;
      const flux = (thermalPower * 3.2e7).toExponential(2);

      return [
        {
          label: "Multiplication (keff)",
          value: keff.toFixed(4),
          unit: "critical",
          badgeColor: keff > 1.005 ? "rose" : keff >= 0.998 ? "emerald" : "amber",
          progressPct: Math.min(100, (keff / 1.05) * 100),
        },
        {
          label: "Reactivity (ρ)",
          value: rhoDollars >= 0 ? `+${rhoDollars.toFixed(2)}` : rhoDollars.toFixed(2),
          unit: "$",
          badgeColor: rhoDollars > 1 ? "rose" : "amber",
          progressPct: Math.min(100, Math.max(0, (rhoDollars + 2) * 25)),
        },
        {
          label: "Reactor Period",
          value:
            kinetics.reactorPeriodSeconds > 0
              ? `${kinetics.reactorPeriodSeconds.toFixed(1)} s`
              : "subcritical",
          unit: "T",
          badgeColor: kinetics.reactorPeriodSeconds > 0 ? "amber" : "cyan",
          progressPct:
            kinetics.reactorPeriodSeconds > 0
              ? Math.min(100, 100 / kinetics.reactorPeriodSeconds)
              : 0,
        },
        {
          label: "Geiger Interval",
          value: `${kinetics.geigerIntervalMs} ms`,
          unit: "Δt",
          badgeColor: "purple",
          progressPct: clampProgress((kinetics.geigerIntervalMs / 800) * 100),
        },
        {
          label: "Neutron Display",
          value: `${kinetics.neutronDisplaySpeed}`,
          unit: "u/s",
          badgeColor: "cyan",
          progressPct: Math.min(100, (kinetics.neutronDisplaySpeed / 6) * 100),
        },
        {
          label: "Thermal Power",
          value: thermalPower.toLocaleString(),
          unit: "W",
          badgeColor: "purple",
          progressPct: Math.min(100, (thermalPower / 1000) * 100),
        },
        {
          label: "Thermal Flux",
          value: flux,
          unit: "n/(cm²·s)",
          badgeColor: "cyan",
          progressPct: Math.min(100, (thermalPower / 500) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Delayed neutron emission fractions (β = 0.0065) expand the reactor period from milliseconds to dozens of seconds, allowing cadmium control rods to maintain sub-prompt criticality safely.",
  },
  "us-1155986-goddard-rocket": {
    domain: "thermodynamics_transport",
    domainTitle: "Supersonic Isentropic de Laval Expansion & Thrust Kinetics",
    equationName: "Nozzle Exhaust Velocity & Specific Impulse",
    governingEquation:
      "v_e = \\sqrt{\\frac{2\\gamma}{\\gamma - 1} R T_c \\left[1 - \\left(\\frac{P_e}{P_c}\\right)^{\\frac{\\gamma - 1}{\\gamma}}\\right]} \\quad \\text{and} \\quad F = \\dot{m} v_e",
    engineMethod: "FrankenSimEngine.stepGoddardRocket",
    controls: [
      {
        id: "chamberPressure",
        label: "Chamber Pressure (Pc)",
        min: 100,
        max: 600,
        step: 10,
        defaultValue: 350,
        unit: "psi",
      },
      {
        id: "expansionRatio",
        label: "Nozzle Expansion Ratio (Ae/At)",
        min: 2.0,
        max: 8.0,
        step: 0.1,
        defaultValue: 3.5,
        unit: "ratio",
      },
      {
        id: "flightAltitudeMiles",
        label: "Flight Altitude",
        min: 0,
        max: 200,
        step: 1,
        defaultValue: 18,
        unit: "mi",
      },
    ],
    computeMetrics: (p) => {
      const pc = p.chamberPressure ?? 350;
      const ar = p.expansionRatio ?? 3.5;
      const flow = p.fuelFlowRateKgs ?? 1.8;
      const throat = p.throatAreaCm2 ?? 4.2;

      const res = FrankenSimEngine.stepGoddardRocket(pc, flow, throat, ar);
      const match = goddardNozzleMatch(p.flightAltitudeMiles ?? 18, ar);
      const mach = res.machExit;
      const ve = res.exhaustVelocityMps;
      const isp = res.specificImpulseSec.toFixed(1);
      const thrust = res.thrustNewtons;

      return [
        {
          label: "Exit Mach Number",
          value: mach.toFixed(2),
          unit: "Mach",
          badgeColor: "cyan",
          progressPct: Math.min(100, (mach / 4.0) * 100),
        },
        {
          label: "Exhaust Velocity",
          value: ve.toLocaleString(),
          unit: "m/s",
          badgeColor: "emerald",
          progressPct: Math.min(100, (ve / 3000) * 100),
        },
        {
          label: "Thrust",
          value: `${thrust} N (${res.thrustLbf} lbf)`,
          unit: "F",
          badgeColor: "amber",
          progressPct: Math.min(100, (thrust / 4000) * 100),
        },
        {
          label: "Specific Impulse (Isp)",
          value: isp,
          unit: "s",
          badgeColor: "amber",
          progressPct: Math.min(100, (Number(isp) / 300) * 100),
        },
        {
          label: "Thrust Force (F)",
          value: thrust.toLocaleString(),
          unit: "N",
          badgeColor: "indigo",
          progressPct: Math.min(100, (thrust / 800) * 100),
        },
        {
          label: "Nozzle Match",
          value: `${match.optimalEpsilon}:1`,
          unit: "ε*",
          badgeColor: "cyan",
          progressPct: clampProgress(match.expansionEfficiencyPct),
        },
        {
          label: "Optimum Ae/At",
          value: Math.min(
            25,
            Math.max(3, 3.5 * Math.exp((p.flightAltitudeMiles ?? 18) / 12)),
          ).toFixed(1),
          unit: "ε*",
          badgeColor: "purple",
          progressPct: Math.min(
            100,
            (Math.min(25, 3.5 * Math.exp((p.flightAltitudeMiles ?? 18) / 12)) / 25) * 100,
          ),
        },
      ];
    },
    pedagogicalInsight:
      "Converging-diverging de Laval nozzle geometry accelerates subsonic combustion gases past the sonic throat ($M=1$) into supersonic exhaust, transferring thermal enthalpy into axial kinetic momentum.",
  },
  "us-2524035-bardeen-transistor": {
    domain: "semiconductor_carrier",
    domainTitle: "Point-Contact Minority Carrier Injection & Hole Diffusion",
    equationName: "Einstein Diffusion & Current Gain Alpha",
    governingEquation:
      "D_p = \\frac{k_B T}{q} \\mu_p \\quad \\text{and} \\quad \\alpha = \\gamma \\cdot \\beta = \\frac{\\Delta I_c}{\\Delta I_e} \\approx 1.8",
    engineMethod: "FrankenSimEngine.stepBardeenTransistor",
    controls: [
      {
        id: "emitterCurrent",
        label: "Emitter Current (Ie)",
        min: 0.5,
        max: 8.0,
        step: 0.1,
        defaultValue: 1.5,
        unit: "mA",
      },
      {
        id: "collectorBias",
        label: "Collector Reverse Bias",
        min: -80,
        max: -10,
        step: 1,
        defaultValue: -40,
        unit: "V",
      },
      {
        id: "pointSpacing",
        label: "Whiskers Contact Spacing",
        min: 15,
        max: 150,
        step: 5,
        defaultValue: 50,
        unit: "µm",
      },
    ],
    computeMetrics: (p) => {
      const ie = p.emitterCurrent ?? 1.5;
      const spacing = p.pointSpacing ?? 50;
      const semi = FrankenSimEngine.stepBardeenTransistor(ie, p.collectorBias ?? -40, spacing);
      const transitTimeNs = semi.clockPeriodNs;
      const alpha = semi.currentGainAlpha;
      const powerGainDb = semi.powerGainDb.toFixed(1);
      const ic = semi.collectorCurrentMa.toFixed(2);

      return [
        {
          label: "Current Gain (α)",
          value: alpha.toFixed(2),
          unit: "ratio",
          badgeColor: alpha >= 1.0 ? "emerald" : "amber",
          progressPct: Math.min(100, (alpha / 2.5) * 100),
        },
        {
          label: "Hole Transit Time",
          value: transitTimeNs.toFixed(1),
          unit: "ns",
          badgeColor: "cyan",
          progressPct: Math.min(100, (transitTimeNs / 30) * 100),
        },
        {
          label: "Collector Current",
          value: ic,
          unit: "mA",
          badgeColor: "purple",
          progressPct: Math.min(100, (Number(ic) / 10) * 100),
        },
        {
          label: "Power Amplification",
          value: `${powerGainDb}`,
          unit: "dB",
          badgeColor: "indigo",
          progressPct: Math.min(100, (Number(powerGainDb) / 25) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Forward-biased emitter phosphor-bronze point injects minority carrier holes into n-type germanium base; reverse-biased collector placed 50 µm away sweeps them across the barrier for net power gain.",
  },
  "us-1781541-einstein-refrigerator": {
    domain: "thermodynamics_transport",
    domainTitle: "Dalton Partial Pressure Absorption Cycle & Bubble Pump",
    equationName: "Dalton Evaporative Vaporization & COP",
    governingEquation:
      "P_{\\text{total}} = P_{\\text{NH}_3} + P_{\\text{butane}} + P_{\\text{H}_2\\text{O}} \\quad \\text{and} \\quad \\text{COP} = \\frac{Q_{\\text{evap}}}{Q_{\\text{heat}}}",
    engineMethod: "FrankenSimEngine.stepEinsteinRefrigerator",
    controls: [
      {
        id: "heatInput",
        label: "Generator Heat Input",
        min: 80,
        max: 500,
        step: 5,
        defaultValue: 220,
        unit: "W",
      },
      {
        id: "totalPressure",
        label: "System Total Pressure",
        min: 6,
        max: 22,
        step: 0.5,
        defaultValue: 15.0,
        unit: "atm",
      },
      {
        id: "ammoniaRatio",
        label: "Ammonia Mole Fraction",
        min: 0.4,
        max: 0.9,
        step: 0.01,
        defaultValue: 0.65,
        unit: "x_NH₃",
      },
    ],
    computeMetrics: (p) => {
      const frige = stepEinsteinRefrigeratorSi({
        heatInput: p.heatInput,
        totalPressure: p.totalPressure,
        ammoniaRatio: p.ammoniaRatio ?? p.auxiliaryGasRatio,
      });
      const evapTemp = frige.evapTempC;
      const cop = frige.cop;
      const coolingWatts = frige.coolingWatts;
      const press = frige.pressureAtm;

      return [
        {
          label: "Evaporator Temp",
          value: evapTemp.toFixed(1),
          unit: "°C",
          badgeColor: evapTemp < 0 ? "cyan" : "amber",
          progressPct: Math.min(100, Math.max(0, (30 - evapTemp) * 2)),
        },
        {
          label: "Cooling Power (Qc)",
          value: coolingWatts.toString(),
          unit: "W",
          badgeColor: "emerald",
          progressPct: Math.min(100, (coolingWatts / 120) * 100),
        },
        {
          label: "Thermodynamic COP",
          value: cop.toFixed(2),
          unit: "ratio",
          badgeColor: "indigo",
          progressPct: Math.min(100, (cop / 0.5) * 100),
        },
        {
          label: "Total System Pressure",
          value: press.toFixed(1),
          unit: "atm",
          badgeColor: "purple",
          progressPct: clampProgress((press / 25) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "A sealed ternary mixture operates at uniform pressure with no moving mechanical parts: introduced butane gas lowers ammonia partial pressure, triggering endothermic evaporative cooling.",
  },
  "us-2495429-spencer-microwave": {
    domain: "thermodynamics_transport",
    domainTitle: "Cavity Magnetron Standing Waves & Dielectric Dipole Loss",
    equationName: "Dielectric Volumetric Microwave Heating Rate",
    governingEquation:
      "\\dot{q} = 2\\pi f \\cdot \\varepsilon_0 \\varepsilon'' |\\vec{E}|^2 \\quad (f = 2.45\\ \\text{GHz})",
    engineMethod: "FrankenSimEngine.stepSpencerMicrowave",
    controls: [
      {
        id: "anodeVoltage",
        label: "Magnetron Anode Voltage",
        min: 1200,
        max: 6000,
        step: 50,
        defaultValue: 2200,
        unit: "V",
      },
      {
        id: "rfPowerSetting",
        label: "RF Power Output",
        min: 200,
        max: 1200,
        step: 50,
        defaultValue: 800,
        unit: "W",
      },
      {
        id: "magneticFieldGauss",
        label: "Magnetic Field",
        min: 800,
        max: 2200,
        step: 10,
        defaultValue: 1450,
        unit: "G",
      },
    ],
    computeMetrics: (p) => {
      const v = p.anodeVoltage ?? 2200;
      const rfWatts = p.rfPowerSetting ?? 800;
      const rf = FrankenSimEngine.stepSpencerMicrowave(
        voltsToKv(v),
        p.magneticFieldGauss ?? 1450,
        rfWatts,
      );

      return [
        {
          label: "Resonant Frequency",
          value: rf.microwaveFreqMhz.toLocaleString(),
          unit: "MHz",
          badgeColor: "cyan",
          progressPct: clampProgress(80),
        },
        {
          label: "Hull Cutoff",
          value: rf.hullCutoffGauss.toString(),
          unit: "G",
          badgeColor: rf.isOscillating ? "emerald" : "rose",
          progressPct: Math.min(100, (rf.hullCutoffGauss / 2200) * 100),
        },
        {
          label: "Dielectric Loss",
          value: rf.dielectricLossWattsPerDm3.toString(),
          unit: "W/dm³",
          badgeColor: rf.isOscillating ? "emerald" : "amber",
          progressPct: Math.min(100, (rf.dielectricLossWattsPerDm3 / 2200) * 100),
        },
        {
          label: "Popcorn ΔT",
          value: `${rf.popcornHeatStepC} °C/tick`,
          unit: "dT",
          badgeColor: rf.isOscillating ? "amber" : "cyan",
          progressPct: Math.min(100, rf.popcornHeatStepC * 30),
        },
        {
          label: "Heat Tick",
          value: `${rf.heatTickMs}`,
          unit: "ms",
          badgeColor: "cyan",
          progressPct: clampProgress((rf.heatTickMs / 400) * 100),
        },
        {
          label: "Water Heat",
          value: `${rf.waterHeatSecondsPerK}`,
          unit: "s/K",
          badgeColor: rf.isOscillating ? "amber" : "cyan",
          progressPct: Math.min(100, (rf.waterHeatSecondsPerK / 3) * 100),
        },
        {
          label: "Time to Pop",
          value: `${rf.timeToPopS}`,
          unit: "s",
          badgeColor: rf.isOscillating ? "amber" : "cyan",
          progressPct: Math.min(100, (rf.timeToPopS / 200) * 100),
        },
        {
          label: "RF Output Power",
          value: rfWatts.toString(),
          unit: "W",
          badgeColor: "purple",
          progressPct: clampProgress((rfWatts / 1200) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Crossed electric and magnetic fields inside the cavity magnetron induce relativistic electron hub-and-spoke rotating clouds that excite 2.45 GHz standing microwaves, agitating water dipoles.",
  },
  "us-2981877-noyce-ic": {
    domain: "semiconductor_carrier",
    domainTitle: "Planar PN Barrier Depletion & Monolithic Silicon Interconnects",
    equationName: "Depletion Region Barrier Capacitance",
    governingEquation:
      "W = \\sqrt{\\frac{2\\varepsilon_s (V_{bi} + V_R)}{q}\\left(\\frac{1}{N_A} + \\frac{1}{N_D}\\right)}",
    engineMethod: "FrankenSimEngine.stepNoyceIC",
    controls: [
      {
        id: "reverseBias",
        label: "Reverse Bias Voltage (VR)",
        min: 1,
        max: 20,
        step: 0.5,
        defaultValue: 5.0,
        unit: "V",
      },
      {
        id: "oxideThickness",
        label: "SiO2 Oxide Thickness",
        min: 0.2,
        max: 1.2,
        step: 0.05,
        defaultValue: 0.5,
        unit: "µm",
      },
      {
        id: "clockFrequencyMhz",
        label: "Clock Frequency",
        min: 1,
        max: 50,
        step: 1,
        defaultValue: 10,
        unit: "MHz",
      },
    ],
    computeMetrics: (p) => {
      const ic = stepNoyceIC({
        reverseBias: p.reverseBias,
        oxideThickness: p.oxideThickness,
        clockFrequencyMhz: p.clockFrequencyMhz,
      });
      const w = ic.depletionWidthUm.toFixed(2);
      const propDelay = ic.propDelayNs.toFixed(2);
      const cap = ic.junctionCapPfPerMm2.toFixed(1);

      return [
        {
          label: "Depletion Barrier (W)",
          value: w,
          unit: "µm",
          badgeColor: "cyan",
          progressPct: (Number(w) / 2.5) * 100,
        },
        {
          label: "Junction Capacitance",
          value: cap,
          unit: "pF/mm²",
          badgeColor: "amber",
          progressPct: (Number(cap) / 60) * 100,
        },
        {
          label: "Propagation Delay (tpd)",
          value: propDelay,
          unit: "ns",
          badgeColor: "emerald",
          progressPct: (Number(propDelay) / 3.0) * 100,
        },
        {
          label: "Breakdown Margin",
          value: ic.breakdownMarginV.toFixed(1),
          unit: "V",
          badgeColor: "indigo",
          progressPct: (ic.breakdownMarginV / 35) * 100,
        },
      ];
    },
    pedagogicalInsight:
      "Surface oxide passivation electrically insulates individual diffused transistor regions while vapor-deposited aluminum film leads unite components directly on a single monolithic silicon crystal.",
  },
  "us-223898-edison-lightbulb": {
    domain: "thermodynamics_transport",
    domainTitle: "High-Vacuum Stefan-Boltzmann Radiative Blackbody Kinetics",
    equationName: "Stefan-Boltzmann Radiative Blackbody Law",
    governingEquation:
      "P_{\\text{rad}} = \\varepsilon \\sigma A (T^4 - T_0^4) \\quad \\text{with} \\quad R(T) = R_0(1 + \\alpha \\Delta T)",
    engineMethod: "FrankenSimEngine.stepEdisonBulb",
    controls: [
      {
        id: "voltage",
        label: "Applied Terminal Voltage",
        min: 40,
        max: 130,
        step: 1,
        defaultValue: 110,
        unit: "V",
      },
      {
        id: "filamentLength",
        label: "Carbon Filament Length",
        min: 10,
        max: 30,
        step: 1,
        defaultValue: 22,
        unit: "cm",
      },
    ],
    computeMetrics: (p) => {
      const bulb = stepEdisonBulb({ voltage: p.voltage, filamentLength: p.filamentLength });
      const tempK = bulb.filamentTempK;
      const res = bulb.hotResistanceOhm;
      const powerWatts = bulb.radiantWatts;
      const lumEff = bulb.luminousLmPerW.toFixed(2);

      return [
        {
          label: "Filament Temperature",
          value: tempK.toLocaleString(),
          unit: "K",
          badgeColor: "amber",
          progressPct: clampProgress((tempK / 2500) * 100),
        },
        {
          label: "Radiant Output Power",
          value: powerWatts.toFixed(1),
          unit: "W",
          badgeColor: "emerald",
          progressPct: clampProgress((powerWatts / 120) * 100),
        },
        {
          label: "Hot Resistance",
          value: res.toString(),
          unit: "Ω",
          badgeColor: "indigo",
          progressPct: clampProgress((res / 200) * 100),
        },
        {
          label: "Luminous Efficiency",
          value: lumEff,
          unit: "lm/W",
          badgeColor: "cyan",
          progressPct: clampProgress((Number(lumEff) / 4.0) * 100),
        },
        {
          label: "Filament Current",
          value: bulb.currentAmps.toFixed(2),
          unit: "A",
          badgeColor: "amber",
          progressPct: clampProgress((bulb.currentAmps / 2) * 100),
        },
        {
          label: "Design Life",
          value: String(bulb.designLifeHours),
          unit: "h",
          badgeColor: "purple",
          progressPct: Math.min(100, (bulb.designLifeHours / 2400) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Evacuating the glass globe to one-millionth of an atmosphere prevents oxygen combustion and dramatically suppresses convective heat transfer, enabling a high-resistance carbonized thread to glow incandescently.",
  },
  "us-174465-bell-telephone": {
    domain: "electromagnetics_flux",
    domainTitle: "Variable Resistance Acoustic Diaphragm Speech Undulation",
    equationName: "Diaphragm Acoustic Pressure to Resistance Transfer",
    governingEquation:
      "i(t) = \\frac{E}{R_0 + \\Delta R \\sin(\\omega t)} \\approx I_0 + \\Delta I \\sin(\\omega t)",
    engineMethod: "FrankenSimEngine.stepBellTelephone",
    controls: [
      {
        id: "voiceAmplitude",
        label: "Voice Sound Pressure",
        min: 40,
        max: 95,
        step: 1,
        defaultValue: 75,
        unit: "dB",
      },
      {
        id: "acousticFrequencyHz",
        label: "Voice Frequency",
        min: 200,
        max: 800,
        step: 10,
        defaultValue: 440,
        unit: "Hz",
      },
      {
        id: "airGap",
        label: "Diaphragm Magnetic Gap",
        min: 0.1,
        max: 0.8,
        step: 0.05,
        defaultValue: 0.35,
        unit: "mm",
      },
      {
        id: "batteryVoltage",
        label: "Battery Voltage",
        min: 1,
        max: 12,
        step: 0.5,
        defaultValue: 6,
        unit: "V",
      },
      {
        id: "liquidConductivity",
        label: "Acidulated Water Conductivity",
        min: 0.2,
        max: 3,
        step: 0.1,
        defaultValue: 1.2,
        unit: "S",
      },
    ],
    computeMetrics: (p) => {
      const bell = stepBellTelephone({
        voiceAmplitude: p.voiceAmplitude,
        airGap: p.airGap,
        batteryVoltage: p.batteryVoltage,
        liquidConductivity: p.liquidConductivity,
        acousticFrequencyHz: p.acousticFrequencyHz,
      });
      const displMicrons = bell.diaphragmUm.toFixed(2);
      const modCurrent = bell.modulatedMa.toFixed(2);
      const sens = bell.sensitivityMvPerPa.toFixed(1);

      return [
        {
          label: "Diaphragm Deflection",
          value: displMicrons,
          unit: "µm",
          badgeColor: "cyan",
          progressPct: clampProgress((Number(displMicrons) / 5) * 100),
        },
        {
          label: "Modulated Signal",
          value: modCurrent,
          unit: "mA",
          badgeColor: "emerald",
          progressPct: clampProgress((Number(modCurrent) / 20) * 100),
        },
        {
          label: "Transduction Sensitivity",
          value: sens,
          unit: "mV/Pa",
          badgeColor: "amber",
          progressPct: clampProgress((Number(sens) / 40) * 100),
        },
        {
          label: "Voice Tone",
          value: (p.acousticFrequencyHz ?? 440).toString(),
          unit: "Hz",
          badgeColor: "indigo",
          progressPct: clampProgress((((p.acousticFrequencyHz ?? 440) - 200) / 600) * 100),
        },
        {
          label: "Liquid R₀",
          value: `${bell.baseResistanceOhms}`,
          unit: "Ω",
          badgeColor: "purple",
          progressPct: Math.min(100, (bell.baseResistanceOhms / 80) * 100),
        },
        {
          label: "Bias Current",
          value: `${bell.currentBaselineMa}`,
          unit: "mA",
          badgeColor: "cyan",
          progressPct: Math.min(100, (bell.currentBaselineMa / 200) * 100),
        },
        {
          label: "Display ω",
          value: `${bell.acousticDisplayOmegaRadPerS}`,
          unit: "rad/s",
          badgeColor: "amber",
          progressPct: Math.min(100, (bell.acousticDisplayOmegaRadPerS / 200) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Vibrating iron diaphragm modulates the air gap of an electromagnet, producing an undulating continuous electrical current whose instantaneous voltage mimics human vocal acoustic waveforms.",
  },
  // Preserved, non-public legacy model. The source-reviewed US 586,193 route
  // is held below until an independently accepted visual can support it.
  "_legacy-unpublished-us-586193-marconi-radio": {
    domain: "electromagnetics_flux",
    domainTitle: "Spark-Gap Resonant Damped Wave Oscillations & Aerial Radiation",
    equationName: "Monopole Radiation Resistance & Resonant Frequency",
    governingEquation:
      "f_0 = \\frac{1}{2\\pi \\sqrt{L C}} \\quad \\text{and} \\quad R_{\\text{rad}} = 36.56\\ \\Omega \\quad (\\lambda = 4h)",
    engineMethod: "FrankenSimEngine.stepMarconiRadio",
    controls: [
      {
        id: "sparkVoltage",
        label: "Induction Coil Voltage",
        min: 5,
        max: 50,
        step: 1,
        defaultValue: 28,
        unit: "kV",
      },
      {
        id: "aerialHeight",
        label: "Vertical Aerial Height",
        min: 10,
        max: 120,
        step: 2,
        defaultValue: 88,
        unit: "m",
      },
      {
        id: "sparkGapMm",
        label: "Spark Gap Distance",
        min: 2,
        max: 25,
        step: 1,
        defaultValue: 10,
        unit: "mm",
      },
    ],
    computeMetrics: (p) => {
      const v = p.sparkVoltage ?? 28;
      const h = p.aerialHeight ?? 88;
      const radio = FrankenSimEngine.stepMarconiRadio(h, p.sparkGapMm ?? 10, v);
      const freqKhz = radio.resonantFreqKhz;

      return [
        {
          label: "Resonant Frequency",
          value: freqKhz.toString(),
          unit: "kHz",
          badgeColor: "cyan",
          progressPct: clampProgress((freqKhz / 2500) * 100),
        },
        {
          label: "Peak RF Power",
          value: radio.peakRfPowerKw.toString(),
          unit: "kW",
          badgeColor: "amber",
          progressPct: Math.min(100, (radio.peakRfPowerKw / 80) * 100),
        },
        {
          label: "Radiation Resistance",
          value: radio.radiationResistanceOhms.toFixed(1),
          unit: "Ω",
          badgeColor: "emerald",
          progressPct: clampProgress(75),
        },
        {
          label: "Estimated Range",
          value: radio.maxRangeMiles.toString(),
          unit: "mi",
          badgeColor: "indigo",
          progressPct: Math.min(100, (radio.maxRangeMiles / 200) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Connecting one terminal of an elevated vertical antenna to the spark gap and the other directly to the conductive earth turns the system into an asymmetric quarter-wave Hertzian radiator.",
  },
  "us-1647-morse-telegraph": {
    domain: "electromagnetics_flux",
    domainTitle: "Solenoid Core Inductance & Armature Magnetic Force",
    equationName: "Electromagnetic Solenoid Attraction Force",
    governingEquation:
      "F_{\\text{mag}} = \\frac{B^2 A}{2\\mu_0} = \\frac{\\mu_0 N^2 I^2 A}{2 g^2} \\quad \\text{and} \\quad \\tau = \\frac{L}{R}",
    engineMethod: "FrankenSimEngine.stepMorseTelegraph",
    controls: [
      {
        id: "currentMa",
        label: "Telegraph Line Current",
        min: 20,
        max: 120,
        step: 2,
        defaultValue: 65,
        unit: "mA",
      },
      {
        id: "wireTurns",
        label: "Electromagnet Coil Turns",
        min: 500,
        max: 2000,
        step: 50,
        defaultValue: 1200,
        unit: "turns",
      },
      {
        id: "lineVoltageV",
        label: "Line Voltage",
        min: 6,
        max: 48,
        step: 1,
        defaultValue: 24,
        unit: "V",
      },
      {
        id: "lineLengthMiles",
        label: "Line Distance",
        min: 10,
        max: 150,
        step: 5,
        defaultValue: 44,
        unit: "Mi",
      },
      {
        id: "wpmSpeed",
        label: "Words Per Minute",
        min: 5,
        max: 35,
        step: 1,
        defaultValue: 20,
        unit: "WPM",
      },
    ],
    computeMetrics: (p) => {
      const morse = stepMorseTelegraph({
        currentMa: p.currentMa,
        wireTurns: p.wireTurns,
        lineVoltageV: p.lineVoltageV,
        lineLengthMiles: p.lineLengthMiles,
        wpmSpeed: p.wpmSpeed,
      });
      const forceN = morse.magneticForceN.toFixed(2);
      const tauMs = morse.timeConstantMs.toFixed(1);

      return [
        {
          label: "Magnetic Pull Force",
          value: forceN,
          unit: "N",
          badgeColor: Number(forceN) >= 2 ? "emerald" : "amber",
          progressPct: clampProgress((Number(forceN) / 10) * 100),
        },
        {
          label: "Time Constant (τ)",
          value: tauMs,
          unit: "ms",
          badgeColor: "cyan",
          progressPct: clampProgress((Number(tauMs) / 30) * 100),
        },
        {
          label: "Ampere-Turns (NI)",
          value: morse.ampereTurns.toString(),
          unit: "A·turns",
          badgeColor: "indigo",
          progressPct: clampProgress((morse.ampereTurns / 200) * 100),
        },
        {
          label: "Stylus Emboss Pressure",
          value: `${morse.stylusKpa}`,
          unit: "kPa",
          badgeColor: "purple",
          progressPct: clampProgress((morse.stylusKpa / 250) * 100),
        },
        {
          label: "Ohmic Loop Current",
          value: `${morse.ohmicCurrentMa} mA`,
          unit: "I_ohm",
          badgeColor: "cyan",
          progressPct: clampProgress((morse.ohmicCurrentMa / 80) * 100),
        },
        {
          label: "PARIS Unit",
          value: `${morse.unitDurationMs} ms`,
          unit: "t_unit",
          badgeColor: "amber",
          progressPct: clampProgress((morse.unitDurationMs / 240) * 100),
        },
        {
          label: "Dit / Dah",
          value: `${morse.ditMs} / ${morse.dahMs}`,
          unit: "ms",
          badgeColor: "purple",
          progressPct: clampProgress((morse.ditMs / 240) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Direct electrical current passes through a soft iron horse-shoe electromagnet, overcoming mechanical spring tension to draw down the armature lever and press an embossed stylus into moving paper tape.",
  },
  // Preserved, non-public legacy model. US 3,671,542 is held below until its
  // 58-page source edition is manually authored; do not route this simulation
  // or its numerical material claims to the corrected public patent id.
  "_legacy-unpublished-us-3671542-kwolek-kevlar": {
    domain: "continuum_elasticity",
    domainTitle: "Liquid-Crystalline Poly-Aramid Hydrogen-Bonded Lattice",
    equationName: "Tensile Modulus & Sonic Dispersion Velocity",
    governingEquation:
      "v_{\\text{sound}} = \\sqrt{\\frac{E}{\\rho}} \\quad \\text{and} \\quad \\sigma_{\\text{max}} = E \\cdot \\varepsilon_{\\text{rupture}}",
    engineMethod: "FrankenSimEngine.stepKevlarContinuum",
    controls: [
      {
        id: "drawRatio",
        label: "Filament Draw Orientation Ratio",
        min: 2.0,
        max: 9.0,
        step: 0.2,
        defaultValue: 6.5,
        unit: "ratio",
      },
      {
        id: "polymerConcentrationPct",
        label: "Polymer Concentration",
        min: 5.0,
        max: 25.0,
        step: 0.5,
        defaultValue: 18.5,
        unit: "wt%",
      },
      {
        id: "temperatureCelsius",
        label: "Dope Temperature",
        min: 20,
        max: 120,
        step: 1,
        defaultValue: 85,
        unit: "°C",
      },
      {
        id: "showHydrogenBonds",
        label: "Show H-Bonds",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "",
      },
      {
        id: "isImpactTesting",
        label: "Trigger Impact Test",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 0,
        unit: "trigger",
      },
      {
        id: "impactVelocity",
        label: "Projectile Impact Velocity",
        min: 150,
        max: 900,
        step: 25,
        defaultValue: 450,
        unit: "m/s",
      },
      {
        id: "appliedTension",
        label: "Applied Tensile Strain",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 30,
        unit: "%",
      },
    ],
    computeMetrics: (p) => {
      const kevlar = FrankenSimEngine.stepKevlarContinuum(
        p.drawRatio ?? 6.5,
        p.impactVelocity ?? 450,
        p.appliedTension ?? 30,
      );
      const eGpa = kevlar.elasticModulusGpa;
      const vSonic = kevlar.sonicVelocityMps;
      const strainPct = kevlar.tensileStrainPct.toFixed(2);
      const stressMpa = kevlar.tensileStressMpa;

      return [
        {
          label: "Elastic Modulus (E)",
          value: Math.round(eGpa).toString(),
          unit: "GPa",
          badgeColor: "cyan",
          progressPct: clampProgress((eGpa / 150) * 100),
        },
        {
          label: "Sonic Shock Velocity",
          value: vSonic.toLocaleString(),
          unit: "m/s",
          badgeColor: "emerald",
          progressPct: clampProgress((vSonic / 12000) * 100),
        },
        {
          label: "Tensile Stress",
          value: stressMpa.toLocaleString(),
          unit: "MPa",
          badgeColor: stressMpa < 3600 ? "indigo" : "rose",
          progressPct: clampProgress((stressMpa / 4000) * 100),
        },
        {
          label: "Elastic Strain",
          value: strainPct,
          unit: "%",
          badgeColor: Number(strainPct) < 3.5 ? "amber" : "rose",
          progressPct: clampProgress((Number(strainPct) / 4.0) * 100),
        },
        {
          label: "Fiber Strength",
          value: `${kevlar.tensileStrengthGpa} GPa`,
          unit: "σ_ult",
          badgeColor: "emerald",
          progressPct: clampProgress((kevlar.tensileStrengthGpa / 3.6) * 100),
        },
        {
          label: "Residual Strength",
          value: `${kevlar.residualStrengthGpa} GPa`,
          unit: "σ_res",
          badgeColor: kevlar.residualStrengthGpa < 1.6 ? "rose" : "emerald",
          progressPct: clampProgress((kevlar.residualStrengthGpa / 3.6) * 100),
        },
        {
          label: "Chain Alignment",
          value: `${kevlar.alignmentPct}%`,
          unit: "align",
          badgeColor: "purple",
          progressPct: clampProgress(kevlar.alignmentPct),
        },
      ];
    },
    pedagogicalInsight:
      "All-trans rigid rod aromatic poly-p-phenylene terephthalamide chains align in parallel liquid-crystalline domains, transferring impact kinetic energy along transverse hydrogen-bonded sheets at Mach 28.",
  },
  "us-3633-goodyear-rubber": {
    domain: "continuum_elasticity",
    domainTitle: "Disulfide Polymer Cross-Linking & Entropic Elasticity",
    equationName: "Disulfide Cross-Link Kinetics & Entropic Restoring Force",
    governingEquation:
      "f = -T \\left(\\frac{\\partial S}{\\partial L}\\right)_T = n k_B T \\left(\\lambda - \\frac{1}{\\lambda^2}\\right)",
    engineMethod: "FrankenSimEngine.stepGoodyearRubber",
    controls: [
      {
        id: "vulcanTemp",
        label: "Vulcanization Temperature",
        min: 110,
        max: 190,
        step: 2,
        defaultValue: 145,
        unit: "°C",
      },
      {
        id: "sulfurPct",
        label: "Sulfur Content Fraction",
        min: 2,
        max: 14,
        step: 0.5,
        defaultValue: 8.0,
        unit: "%",
      },
      {
        id: "specimenTempC",
        label: "Specimen Temperature",
        min: -20,
        max: 100,
        step: 1,
        defaultValue: 35,
        unit: "°C",
      },
      {
        id: "appliedTensileStretch",
        label: "Tensile Stretch (λ)",
        min: 1.0,
        max: 2.5,
        step: 0.05,
        defaultValue: 1.8,
        unit: "λ",
      },
    ],
    computeMetrics: (p) => {
      const rubber = FrankenSimEngine.stepGoodyearRubber(
        p.vulcanTemp ?? 145,
        p.sulfurPct ?? 8.0,
        30,
        p.appliedTensileStretch ?? 1.8,
        p.specimenTempC ?? 35,
      );
      const crossLink = rubber.crossLinkDensity.toFixed(3);
      const tensilePsi = rubber.tensileStrengthPsi;
      const returnPct = rubber.elasticReturnPct;

      return [
        {
          label: "Cross-Link Density",
          value: crossLink,
          unit: "mol/cm³",
          badgeColor: "emerald",
          progressPct: clampProgress((Number(crossLink) / 1.5) * 100),
        },
        {
          label: "Tensile Strength",
          value: tensilePsi.toLocaleString(),
          unit: "psi",
          badgeColor: "cyan",
          progressPct: clampProgress((tensilePsi / 3500) * 100),
        },
        {
          label: "Elastic Return",
          value: returnPct.toString(),
          unit: "%",
          badgeColor: "indigo",
          progressPct: clampProgress(returnPct),
        },
        {
          label: "Thermal Stability",
          value: rubber.isStickyOrBrittle ? "Brittle / Plastic" : "Resilient",
          unit: "state",
          badgeColor: rubber.isStickyOrBrittle ? "rose" : "emerald",
          progressPct: clampProgress(rubber.isStickyOrBrittle ? 30 : 95),
        },
        {
          label: "Glass Transition",
          value: `${rubber.glassTransitionTempC} °C`,
          unit: "Tg",
          badgeColor: "amber",
          progressPct: clampProgress(((rubber.glassTransitionTempC + 80) / 50) * 100),
        },
        {
          label: "Cure Rate",
          value: `${rubber.rateRel}`,
          unit: rubber.regime,
          badgeColor: rubber.regime === "cure" ? "emerald" : "amber",
          progressPct: Math.min(100, rubber.rateRel * 50),
        },
        {
          label: "True Stress",
          value: `${rubber.trueStressMpa}`,
          unit: "MPa",
          badgeColor: "indigo",
          progressPct: Math.min(100, (rubber.trueStressMpa / 30) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Heating raw polyisoprene rubber with sulfur forms covalent disulfide bridges between entangled polymer chains, transforming thermally plastic gum into resilient, temperature-stable entropic elastomer.",
  },
  "us-6469-lincoln-buoy": {
    domain: "continuum_elasticity",
    domainTitle: "Pneumatic Expandable Buoyancy & Riverbed Shoal Navigation",
    equationName: "Archimedes Buoyant Lift & Hydrostatic Draft Reduction",
    governingEquation:
      "\\Delta F_b = \\rho_{\\text{water}} \\cdot g \\cdot \\Delta V_{\\text{air}} \\quad \\text{and} \\quad \\Delta d = \\frac{\\Delta F_b}{\\rho g A_{\\text{waterplane}}}",
    engineMethod: "FrankenSimEngine.stepLincolnBuoy",
    controls: [
      {
        id: "inflationPct",
        label: "Air Bellows Inflation",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 75,
        unit: "%",
      },
      {
        id: "weightTons",
        label: "Steamboat Weight",
        min: 200,
        max: 600,
        step: 10,
        defaultValue: 380,
        unit: "T",
      },
      {
        id: "shoalDepth",
        label: "Riverbed Shoal Water Depth",
        min: 2.0,
        max: 12.0,
        step: 0.1,
        defaultValue: 3.5,
        unit: "ft",
      },
    ],
    computeMetrics: (p) => {
      const buoy = stepLincolnBuoySi({
        inflationPct: p.inflationPct,
        weightTons: p.weightTons,
        shoalDepth: p.shoalDepth,
      });
      const volM3 = buoy.displacedVolumeM3.toFixed(1);
      const liftKn = buoy.liftKn;
      const draftRedFt = buoy.draftReductionFt.toFixed(2);
      const clearanceFt = buoy.shoalClearanceFt.toFixed(2);

      return [
        {
          label: "Buoyant Lift Force",
          value: liftKn.toString(),
          unit: "kN",
          badgeColor: "cyan",
          progressPct: clampProgress((liftKn / 450) * 100),
        },
        {
          label: "Draft Reduction",
          value: draftRedFt,
          unit: "ft",
          badgeColor: "emerald",
          progressPct: clampProgress((Number(draftRedFt) / 3.0) * 100),
        },
        {
          label: "Shoal Keel Clearance",
          value: `${clearanceFt}`,
          unit: "ft",
          badgeColor: Number(clearanceFt) > 0 ? "emerald" : "rose",
          progressPct: Math.min(100, Math.max(0, (Number(clearanceFt) + 1.5) * 35)),
        },
        {
          label: "Displaced Air Volume",
          value: volM3,
          unit: "m³",
          badgeColor: "indigo",
          progressPct: clampProgress((Number(volM3) / 45) * 100),
        },
        {
          label: "Hull Draft",
          value: `${buoy.hullDraftFt} ft`,
          unit: "d",
          badgeColor: "amber",
          progressPct: clampProgress((buoy.hullDraftFt / 8) * 100),
        },
        {
          label: "Waterplane",
          value: `${buoy.waterplaneAreaSqFt} ft²`,
          unit: "A_wp",
          badgeColor: "cyan",
          progressPct: clampProgress(100),
        },
      ];
    },
    pedagogicalInsight:
      "Waterproof bellows affixed to the steamboat hull expand downwards via geared shaft linkages, displacing hundreds of cubic feet of river water to float the grounded hull over shallow sandbars.",
  },
  // Preserved non-public model. The exact public route is a source guide below
  // until the scholarly edition's held publication review is complete.
  "_legacy-unpublished-us-2292387-lamarr-frequency-hopping": {
    domain: "semiconductor_carrier",
    domainTitle: "Slotted Carrier Spread-Spectrum & Processing Anti-Jamming Gain",
    equationName: "Processing Gain & Spread-Spectrum Bandwidth",
    governingEquation:
      "G_p = 10 \\log_{10}\\left(\\frac{\\text{BW}_{\\text{RF}}}{\\text{BW}_{\\text{signal}}}\\right) = 10 \\log_{10}\\left(\\frac{8.8\\ \\text{MHz}}{10\\ \\text{kHz}}\\right) \\approx 29.4\\ \\text{dB}",
    engineMethod: "FrankenSimEngine.stepLamarrFrequencyHopping",
    controls: [
      {
        id: "channels",
        label: "Piano Roll Active Channels",
        min: 12,
        max: 88,
        step: 1,
        defaultValue: 88,
        unit: "keys",
      },
      {
        id: "hopRate",
        label: "Tape Synchronous Hop Rate",
        min: 1,
        max: 30,
        step: 0.5,
        defaultValue: 4.0,
        unit: "hops/s",
      },
      {
        id: "isJammingActive",
        label: "Enable Jamming",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "",
      },
      {
        id: "jamChannel",
        label: "Spot-Jam Channel",
        min: 1,
        max: 88,
        step: 1,
        defaultValue: 26,
        unit: "ch",
      },
    ],
    computeMetrics: (p) => {
      const hops = p.hopRate ?? 4.0;
      const fh = FrankenSimEngine.stepLamarrFrequencyHopping(p.channels ?? 88, hops);
      const rfBwMhz = fh.spreadSpectrumBandwidthMhz.toFixed(1);
      const procGainDb = fh.processingGainDb.toFixed(1);
      const antiJamDb = fh.antiJammingMarginDb.toFixed(1);

      return [
        {
          label: "RF Spread Bandwidth",
          value: rfBwMhz,
          unit: "MHz",
          badgeColor: "indigo",
          progressPct: clampProgress((Number(rfBwMhz) / 10) * 100),
        },
        {
          label: "Processing Gain (Gp)",
          value: procGainDb,
          unit: "dB",
          badgeColor: "emerald",
          progressPct: clampProgress((Number(procGainDb) / 32) * 100),
        },
        {
          label: "Anti-Jamming Margin",
          value: antiJamDb,
          unit: "dB",
          badgeColor: "cyan",
          progressPct: clampProgress((Number(antiJamDb) / 30) * 100),
        },
        {
          label: "Hop Interval",
          value: `${fh.hopIntervalMs} ms`,
          unit: "Δt",
          badgeColor: "amber",
          progressPct: clampProgress((fh.hopIntervalMs / 500) * 100),
        },
        {
          label: "Jam Occupancy",
          value: `${fh.jamOccupancyPct}%`,
          unit: "1/N",
          badgeColor: "purple",
          progressPct: clampProgress(fh.jamOccupancyPct * 10),
        },
        {
          label: "Hop Dwell Period",
          value: `${fh.hopIntervalMs}`,
          unit: "ms",
          badgeColor: "purple",
          progressPct: clampProgress((hops / 10) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Synchronized 88-key slotted player-piano rolls rapidly steer the radio carrier across 88 distinct frequencies, making torpedo steering signals mathematically immune to continuous-wave narrowband jamming.",
  },
  "_legacy-unpublished-us-3541541-engelbart-mouse": {
    domain: "continuum_elasticity",
    domainTitle: "Orthogonal Coordinate Resolver Kinematics & Potentiometer D/A",
    equationName: "Dual Knife-Edge Orthogonal Coordinate Integration",
    governingEquation:
      "\\Delta X = R \\cdot \\Delta \\theta_x \\quad \\text{and} \\quad \\Delta Y = R \\cdot \\Delta \\theta_y \\quad (\\vec{v}_x \\perp \\vec{v}_y)",
    engineMethod: "FrankenSimEngine.stepEngelbartMouse",
    controls: [
      {
        id: "mouseSpeed",
        label: "Manual Tracking Speed",
        min: 100,
        max: 800,
        step: 25,
        defaultValue: 350,
        unit: "mm/s",
      },
      {
        id: "wheelRadius",
        label: "Knife-Edge Wheel Radius",
        min: 6,
        max: 18,
        step: 0.5,
        defaultValue: 10.0,
        unit: "mm",
      },
      {
        id: "pulsesPerRev",
        label: "Resolver Pulses per Revolution",
        min: 20,
        max: 400,
        step: 4,
        defaultValue: 200,
        unit: "ppr",
      },
    ],
    computeMetrics: (p) => {
      const mouse = stepEngelbartMouse({
        mouseSpeed: p.mouseSpeed,
        wheelRadius: p.wheelRadius,
        pulsesPerRev: p.pulsesPerRev,
      });
      const omegaRps = mouse.omegaRadPerS.toFixed(1);
      const dpi = mouse.dpi;

      return [
        {
          label: "Coordinate Resolution",
          value: dpi.toString(),
          unit: "DPI",
          badgeColor: "cyan",
          progressPct: clampProgress((dpi / 350) * 100),
        },
        {
          label: "Wheel Angular Velocity",
          value: omegaRps,
          unit: "rad/s",
          badgeColor: "emerald",
          progressPct: clampProgress((Number(omegaRps) / 80) * 100),
        },
        {
          label: "Resolver Orthogonality",
          value: "90.0",
          unit: "deg",
          badgeColor: "indigo",
          progressPct: clampProgress(100),
        },
        {
          label: "Tracking Slew Rate",
          value: mouse.slewPxPerS.toString(),
          unit: "px/s",
          badgeColor: "purple",
          progressPct: Math.min(100, (mouse.slewPxPerS / 3000) * 100),
        },
        {
          label: "Pulse Pitch",
          value: `${mouse.mmPerPulse} mm`,
          unit: "Δx",
          badgeColor: "amber",
          progressPct: clampProgress(100),
        },
        {
          label: "Counts / mm",
          value: String(mouse.countsPerMm),
          unit: "1/mm",
          badgeColor: "indigo",
          progressPct: Math.min(100, (mouse.countsPerMm / 10) * 100),
        },
        {
          label: "Pulse Rate",
          value: String(mouse.pulseRateHz),
          unit: "Hz",
          badgeColor: "cyan",
          progressPct: Math.min(100, (mouse.pulseRateHz / 2000) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Two sharp metal wheels mounted at right angles roll independently across the desk: each wheel turns a variable potentiometer wiper, decomposing continuous 2D planar motion into orthogonal $(X, Y)$ signals.",
  },
  "us-1773980-farnsworth-tv": {
    domain: "semiconductor_carrier",
    domainTitle: "Relativistic Photo-Cathode Lorentz Deflection Dissector Tube",
    equationName: "Lorentz Force Magnetic Scanline Deflection",
    governingEquation:
      "\\vec{F} = -e (\\vec{E} + \\vec{v} \\times \\vec{B}) \\quad \\text{and} \\quad r = \\frac{m_e v}{e B}",
    engineMethod: "FrankenSimEngine.stepFarnsworthTV",
    controls: [
      {
        id: "anodeVoltage",
        label: "Anode Accelerating Potential",
        min: 600,
        max: 6000,
        step: 50,
        defaultValue: 1500,
        unit: "V",
      },
      {
        id: "coilCurrent",
        label: "Deflection Coils Current",
        min: 0.1,
        max: 0.8,
        step: 0.02,
        defaultValue: 0.42,
        unit: "A",
      },
      {
        id: "lightIntensityLux",
        label: "Subject Light Intensity",
        min: 100,
        max: 2000,
        step: 50,
        defaultValue: 500,
        unit: "Lux",
      },
      {
        id: "horizontalFreqKhz",
        label: "Horizontal Sweep Rate",
        min: 5,
        max: 30,
        step: 0.25,
        defaultValue: 15.75,
        unit: "kHz",
      },
      {
        id: "verticalFreqHz",
        label: "Vertical Sweep Rate",
        min: 30,
        max: 120,
        step: 1,
        defaultValue: 60,
        unit: "Hz",
      },
      {
        id: "scanLines",
        label: "Raster Scan Lines",
        min: 30,
        max: 240,
        step: 10,
        defaultValue: 60,
        unit: "Lines",
      },
    ],
    computeMetrics: (p) => {
      const v = p.anodeVoltage ?? 1500;
      const i = p.coilCurrent ?? 0.42;
      const hFreq = p.horizontalFreqKhz ?? 15.75;
      const vFreq = p.verticalFreqHz ?? 60;
      const lux = p.lightIntensityLux ?? 500;
      const gauss = FrankenSimEngine.farnsworthDeflectionGauss(i);
      const beam = FrankenSimEngine.stepFarnsworthTv(voltsToKv(v), gauss, lux);
      const beamVelocity = beam.electronVelocityMegaMps.toFixed(1);
      const derivedScanLines = Math.round((hFreq * 1000) / vFreq);
      const photoUa = beam.photocathodeCurrentUa.toFixed(1);

      return [
        {
          label: "Electron Beam Speed",
          value: `${beamVelocity} × 10⁶`,
          unit: "m/s",
          badgeColor: "cyan",
          progressPct: clampProgress((Number(beamVelocity) / 35) * 100),
        },
        {
          label: "Gyro Radius",
          value: beam.gyroRadiusMm.toFixed(1),
          unit: "mm",
          badgeColor: "emerald",
          progressPct: Math.min(100, (beam.gyroRadiusMm / 40) * 100),
        },
        {
          label: "Derived Raster Lines",
          value: derivedScanLines.toString(),
          unit: "lines",
          badgeColor: "indigo",
          progressPct: clampProgress((derivedScanLines / 600) * 100),
        },
        {
          label: "Photocathode Current",
          value: photoUa,
          unit: "µA",
          badgeColor: "purple",
          progressPct: Math.min(100, (Number(photoUa) / 90) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "An optical image focused onto a potassium hydride photo-cathode emits a continuous electron image; orthogonal electromagnetic deflection coils sweep the entire electron cloud past an anode aperture.",
  },
  "us-3923554-boyle-smith-ccd": {
    domain: "semiconductor_carrier",
    domainTitle: "3-Phase MOS Potential Well Bucket-Brigade Charge Transport",
    equationName: "Charge Transfer Efficiency & Potential Well Depth",
    governingEquation:
      "Q_{\\text{final}} = Q_0 \\cdot (\\text{CTE})^N \\quad \\text{with} \\quad \\text{CTE} = 0.99995",
    engineMethod: "FrankenSimEngine.stepBoyleSmithCCD",
    controls: [
      {
        id: "clockFreq",
        label: "3-Phase Clock Frequency",
        min: 0.5,
        max: 8.0,
        step: 0.25,
        defaultValue: 2.5,
        unit: "MHz",
      },
      {
        id: "gateVoltage",
        label: "Gate Potential Well Voltage",
        min: 3.0,
        max: 15.0,
        step: 0.5,
        defaultValue: 8.0,
        unit: "V",
      },
      {
        id: "incidentLux",
        label: "Incident Illuminance",
        min: 100,
        max: 2000,
        step: 50,
        defaultValue: 850,
        unit: "lx",
      },
    ],
    computeMetrics: (p) => {
      const f = p.clockFreq ?? 2.5;
      const vGate = p.gateVoltage ?? 8.0;
      const lux = p.incidentLux ?? 850;
      const wells = stepCcdWells(1, lux, f, vGate);
      const wellCap = wells.fullWellElectrons;
      const cte = wells.ctePct.toFixed(4);

      return [
        {
          label: "Charge Transfer Eff",
          value: `${cte}%`,
          unit: "CTE",
          badgeColor: "emerald",
          progressPct: clampProgress(99),
        },
        {
          label: "Full Well Capacity",
          value: wellCap.toLocaleString(),
          unit: "e⁻",
          badgeColor: "cyan",
          progressPct: clampProgress((wellCap / 200000) * 100),
        },
        {
          label: "Output Signal",
          value: `${wells.outputSignalMv} mV`,
          unit: "V_out",
          badgeColor: "amber",
          progressPct: Math.min(100, wells.outputSignalMv / 10),
        },
        {
          label: "Gate Step Period",
          value: `${wells.phasePeriodNs}`,
          unit: "ns",
          badgeColor: "purple",
          progressPct: clampProgress((wells.phasePeriodNs / 500) * 100),
        },
        {
          label: "Visible φ Step",
          value: `${wells.phaseDisplayMs} ms`,
          unit: "t_φ",
          badgeColor: "amber",
          progressPct: Math.min(100, (wells.phaseDisplayMs / 1000) * 100),
        },
        {
          label: "Dynamic Range",
          value: (20 * Math.log10(wellCap / 15)).toFixed(1),
          unit: "dB",
          badgeColor: "indigo",
          progressPct: clampProgress(88),
        },
      ];
    },
    pedagogicalInsight:
      "Overlapping polysilicon gates pulsed in three phases create shifting potential energy wells in silicon, marching packets of photo-generated electrons across the substrate without wire interconnects.",
  },
  "us-4136359-wozniak-apple": {
    domain: "semiconductor_carrier",
    domainTitle: "Two-Phase Non-Conflicting DRAM Bus Arbitration & Video Sync",
    equationName: "Time-Multiplexed CPU vs. Video Scanline Bus Access",
    governingEquation:
      "\\text{Bus Access} = \\begin{cases} \\text{6502 CPU Read/Write} & \\phi_1 = 1 \\\\ \\text{Video Scanline Fetch} & \\phi_2 = 1 \\end{cases} \\quad (f_{\\text{master}} = 14.31818\\ \\text{MHz})",
    engineMethod: "FrankenSimEngine.stepWozniakApple",
    controls: [
      {
        id: "crystalFreq",
        label: "Master Quartz Crystal",
        min: 7.0,
        max: 28.0,
        step: 0.1,
        defaultValue: 14.318,
        unit: "MHz",
      },
      {
        id: "ramCapacityKb",
        label: "RAM Capacity",
        min: 4,
        max: 48,
        step: 4,
        defaultValue: 48,
        unit: "KB",
      },
    ],
    computeMetrics: (p) => {
      const apple = stepWozniakApple({
        crystalFreq: p.crystalFreq,
        ramCapacityKb: p.ramCapacityKb,
      });
      const cpuClock = apple.cpuClockMhz.toFixed(3);
      const colorSubcarrier = apple.colorSubcarrierMhz.toFixed(3);
      const dramWindow = apple.dramWindowNs.toFixed(1);

      return [
        {
          label: "Microprocessor Clock",
          value: cpuClock,
          unit: "MHz",
          badgeColor: "emerald",
          progressPct: clampProgress((Number(cpuClock) / 1.5) * 100),
        },
        {
          label: "NTSC Color Burst",
          value: colorSubcarrier,
          unit: "MHz",
          badgeColor: "purple",
          progressPct: clampProgress((Number(colorSubcarrier) / 4.5) * 100),
        },
        {
          label: "DRAM Access Window",
          value: dramWindow,
          unit: "ns",
          badgeColor: "cyan",
          progressPct: clampProgress((Number(dramWindow) / 600) * 100),
        },
        {
          label: "Bus Contention Wait",
          value: "0",
          unit: "cycles",
          badgeColor: "indigo",
          progressPct: clampProgress(100),
        },
        {
          label: "Demo Tick",
          value: `${apple.busTickIntervalMs} ms`,
          unit: "Δt",
          badgeColor: "amber",
          progressPct: clampProgress(100),
        },
        {
          label: "Visual Φ2",
          value: `${apple.phi2DisplayHz}`,
          unit: "Hz",
          badgeColor: "purple",
          progressPct: clampProgress((apple.phi2DisplayHz / 8) * 100),
        },
        {
          label: "Φ2 CPU Duty",
          value: `${apple.cpuDutyPct}%`,
          unit: "duty",
          badgeColor: "emerald",
          progressPct: clampProgress(apple.cpuDutyPct),
        },
      ];
    },
    pedagogicalInsight:
      "A master 14.318 MHz crystal divides down to interleave 6502 CPU memory access during clock phase $\\phi_1$ and video display fetch during phase $\\phi_2$, eliminating video flicker with zero wait-state contention.",
  },
  "us-4750-howe-sewing-machine": {
    domain: "continuum_elasticity",
    domainTitle: "Eye-Pointed Needle & Reciprocating Shuttle Lockstitch Kinematics",
    equationName: "Lockstitch Loop Interlocking Kinematics",
    governingEquation:
      "\\theta_{\\text{shuttle}}(t) = A \\sin(\\omega t + \\delta) \\quad \\text{with} \\quad \\text{Stitch Rate} = \\frac{\\omega}{2\\pi}",
    engineMethod: "FrankenSimEngine.stepHoweSewingMachine",
    controls: [
      {
        id: "crankRpm",
        label: "Flywheel Drive Velocity",
        min: 60,
        max: 420,
        step: 10,
        defaultValue: 240,
        unit: "RPM",
      },
      {
        id: "stitchPitchMm",
        label: "Stitch Pitch",
        min: 1.0,
        max: 6.0,
        step: 0.1,
        defaultValue: 3.5,
        unit: "mm",
      },
      {
        id: "threadTensionGrams",
        label: "Thread Tension",
        min: 20,
        max: 90,
        step: 1,
        defaultValue: 45,
        unit: "g",
      },
      {
        id: "isCranking",
        label: "Drive Power",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "",
      },
    ],
    computeMetrics: (p) => {
      const rpm = p.crankRpm ?? 240;
      const feed = p.stitchPitchMm ?? 3.5;
      const tension = p.threadTensionGrams ?? 45;
      const sew = stepHoweSewingMachine(rpm, tension, feed);
      const shuttleHz = sew.stitchFrequencyHz.toFixed(2);
      const stitchLen = feed.toFixed(1);

      return [
        {
          label: "Stitch Velocity",
          value: sew.stitchesPerMinute.toString(),
          unit: "SPM",
          badgeColor: "cyan",
          progressPct: clampProgress((sew.stitchesPerMinute / 350) * 100),
        },
        {
          label: "Shuttle Oscillations",
          value: shuttleHz,
          unit: "Hz",
          badgeColor: "emerald",
          progressPct: clampProgress((Number(shuttleHz) / 6) * 100),
        },
        {
          label: "Cloth Feed",
          value: `${sew.clothFeedMmPerS} mm/s`,
          unit: "v_feed",
          badgeColor: "amber",
          progressPct: clampProgress((sew.clothFeedMmPerS / 20) * 100),
        },
        {
          label: "Crank ω",
          value: `${sew.crankOmegaDegPerS}`,
          unit: "deg/s",
          badgeColor: "purple",
          progressPct: Math.min(100, (sew.crankOmegaDegPerS / 2160) * 100),
        },
        {
          label: "Stitch Length",
          value: stitchLen,
          unit: "mm",
          badgeColor: "amber",
          progressPct: clampProgress((Number(stitchLen) / 5) * 100),
        },
        {
          label: "Lockstitch Shear",
          value: sew.lockstitchShearStrengthN.toString(),
          unit: "N",
          badgeColor: "indigo",
          progressPct: Math.min(100, (sew.lockstitchShearStrengthN / 8) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "A curved eye-pointed needle pushes a thread loop through the cloth; an oscillating shuttle carrying a second bobbin thread passes through the loop, locking both threads inside the seam.",
  },
  "us-593138-tesla-coil": {
    domain: "electromagnetics_flux",
    domainTitle: "Interpretive High-Potential Transformer Visualization",
    equationName: "Source-Described Quarter-Wave Secondary",
    governingEquation: "l \\approx \\lambda / 4",
    engineMethod: "FrankenSimEngine.stepTeslaCoil (interpretive host fallback)",
    controls: [
      {
        id: "primaryCap",
        label: "Primary Tank Capacitance",
        min: 10,
        max: 90,
        step: 5,
        defaultValue: 45,
        unit: "nF",
      },
      {
        id: "couplingK",
        label: "Coil Magnetic Coupling (k)",
        min: 0.08,
        max: 0.35,
        step: 0.01,
        defaultValue: 0.18,
        unit: "ratio",
      },
      {
        id: "sparkGapDistanceMm",
        label: "Spark Gap Distance",
        min: 2,
        max: 30,
        step: 1,
        defaultValue: 12,
        unit: "mm",
      },
      {
        id: "inputVoltageKv",
        label: "Input Voltage",
        min: 5,
        max: 30,
        step: 1,
        defaultValue: 15,
        unit: "kV",
      },
      {
        id: "secondaryTurns",
        label: "Secondary Turns",
        min: 400,
        max: 1400,
        step: 50,
        defaultValue: 850,
        unit: "N_s",
      },
      {
        id: "sparkRateHz",
        label: "Rotary Spark Rate",
        min: 30,
        max: 400,
        step: 10,
        defaultValue: 120,
        unit: "Hz",
      },
      {
        id: "toploadCapacitancePf",
        label: "Topload Capacitance",
        min: 10,
        max: 80,
        step: 5,
        defaultValue: 35,
        unit: "pF",
      },
    ],
    computeMetrics: (p) => {
      const res = FrankenSimEngine.stepTeslaCoilFromControls({
        primaryCap: p.primaryCap,
        toploadCapacitancePf: p.toploadCapacitancePf,
        inputVoltageKv: p.inputVoltageKv,
        sparkGapDistanceMm: p.sparkGapDistanceMm,
        couplingK: p.couplingK,
        secondaryTurns: p.secondaryTurns,
      });
      const freqKhz = res.resonantFreqKhz;
      const peakKv = res.secondaryPotentialKv;
      const streamerM = res.streamerLengthMeters.toFixed(2);
      const k = p.couplingK ?? 0.15;

      return [
        {
          label: "Illustrative Peak Voltage",
          value: `${peakKv}`,
          unit: "kV",
          badgeColor: "purple",
          progressPct: clampProgress((peakKv / 800) * 100),
        },
        {
          label: "Illustrative Frequency",
          value: freqKhz.toString(),
          unit: "kHz",
          badgeColor: "cyan",
          progressPct: clampProgress((freqKhz / 350) * 100),
        },
        {
          label: "Illustrative Discharge Length",
          value: streamerM,
          unit: "m",
          badgeColor: "amber",
          progressPct: clampProgress((Number(streamerM) / 3.0) * 100),
        },
        {
          label: "Coupling Coefficient",
          value: k.toFixed(2),
          unit: "k",
          badgeColor: "emerald",
          progressPct: clampProgress((k / 0.35) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "US 593,138 describes a secondary approximately one-quarter of the electrical disturbance wavelength, with the remote terminal at maximum potential. The interactive numbers are an interpretive host model, not a reconstruction of a measured historic apparatus.",
  },
  "us-x9430-colt-revolver": {
    domain: "continuum_elasticity",
    domainTitle: "Pawl-Ratchet Angular Discretization & Internal Ballistic Hoop Stress",
    equationName: "Hoop Stress Limit & 72° Cylinder Indexing",
    governingEquation:
      "\\sigma_{\\text{hoop}} = \\frac{P_{\\text{combustion}} \\cdot r}{t} \\quad \\text{and} \\quad \\Delta \\theta = \\frac{360^\\circ}{N_{\\text{chambers}}} = 72^\\circ",
    engineMethod: "FrankenSimEngine.stepColtRevolver",
    controls: [
      {
        id: "chamberPressure",
        label: "Black Powder Combustion Peak Pressure",
        min: 40,
        max: 140,
        step: 5,
        defaultValue: 85,
        unit: "MPa",
      },
      {
        id: "cockingAngle",
        label: "Hammer Cocking Arc Angle",
        min: 0,
        max: 45,
        step: 1,
        defaultValue: 45,
        unit: "deg",
      },
    ],
    computeMetrics: (p) => {
      const colt = FrankenSimEngine.stepColtRevolver({
        chamberPressureMpa: p.chamberPressure ?? 85,
        cockingAngleDeg: p.cockingAngle ?? 45,
      });
      const hoopStressMpa = colt.hoopStressMpa.toFixed(1);
      const indexAngleDeg = colt.indexAngleDeg.toFixed(1);
      const isLocked = colt.isLocked;
      const muzzleVelocityMps = colt.muzzleVelocityMps;
      const powderGrains = colt.powderGrains;

      return [
        {
          label: "Cylinder Hoop Stress",
          value: hoopStressMpa,
          unit: "MPa",
          badgeColor: Number(hoopStressMpa) < 180 ? "emerald" : "amber",
          progressPct: clampProgress((Number(hoopStressMpa) / 250) * 100),
        },
        {
          label: "Cylinder Index Rotation",
          value: `${indexAngleDeg}°`,
          unit: "deg (72° step)",
          badgeColor: "cyan",
          progressPct: clampProgress((Number(indexAngleDeg) / 72) * 100),
        },
        {
          label: "Muzzle Exit Velocity",
          value: muzzleVelocityMps.toString(),
          unit: "m/s",
          badgeColor: "amber",
          progressPct: clampProgress((muzzleVelocityMps / 360) * 100),
        },
        {
          label: "Cylinder Bolt Lock",
          value: isLocked ? "LOCKED (0.02 mm)" : "INDEXING (72°)",
          unit: "detent",
          badgeColor: isLocked ? "emerald" : "amber",
          progressPct: clampProgress(isLocked ? 100 : 30),
        },
        {
          label: "Muzzle Energy",
          value: `${colt.muzzleEnergyJoules} J`,
          unit: "E_k",
          badgeColor: "purple",
          progressPct: clampProgress((colt.muzzleEnergyJoules / 400) * 100),
        },
        {
          label: "Powder Charge",
          value: `${powderGrains} gr`,
          unit: "grains",
          badgeColor: "amber",
          progressPct: clampProgress((powderGrains / 60) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Drawing back the hammer with the thumb lifts the pawl to advance the ratchet 72 degrees, while simultaneously withdrawing and re-engaging the perimeter bolt to lock the next chamber directly into concentric alignment with the stationary rifled barrel.",
  },
  "us-31128-otis-elevator": {
    domain: "continuum_elasticity",
    domainTitle: "Transverse Leaf Spring Deflection & Ratchet Catch Kinematics",
    equationName: "Elastic Release Time Constant & Deceleration Impulse",
    governingEquation:
      "t_{\\text{snap}} = \\frac{\\pi}{2} \\sqrt{\\frac{m_{\\text{pawl}}}{k_{\\text{spring}}}} \\quad \\text{and} \\quad F_{\\text{arrest}} = m_{\\text{cab}} (g + a_{\\text{stop}})",
    engineMethod: "FrankenSimEngine.stepOtisElevator",
    controls: [
      {
        id: "cabPayload",
        label: "Elevator Passenger & Freight Payload",
        min: 200,
        max: 1500,
        step: 50,
        defaultValue: 650,
        unit: "kg",
      },
      {
        id: "cableTension",
        label: "Hoisting Cable Tension",
        min: 0,
        max: 100,
        step: 5,
        defaultValue: 100,
        unit: "%",
      },
    ],
    computeMetrics: (p) => {
      const otis = FrankenSimEngine.stepOtisElevator({
        cabPayloadKg: p.cabPayload ?? 650,
        cableTensionPct: p.cableTension ?? 100,
      });
      const isSnapped = otis.isSnapped;
      const deflectionCm = otis.springDeflectionCm.toFixed(1);
      const snapTimeMs = otis.pawlEngagementMs || 38;
      const arrestForceKn = otis.peakArrestForceKn.toFixed(1);
      const stopDistCm = otis.stoppingDistanceCm;

      return [
        {
          label: "Spring Bow Deflection",
          value: `${deflectionCm} cm`,
          unit: "δ",
          badgeColor: Number(deflectionCm) > 5 ? "emerald" : "amber",
          progressPct: clampProgress((Number(deflectionCm) / 10) * 100),
        },
        {
          label: "Brake Release Speed",
          value: `${snapTimeMs} ms`,
          unit: "t_snap",
          badgeColor: "cyan",
          progressPct: clampProgress(95),
        },
        {
          label: "Arrest Catch Status",
          value: isSnapped ? "LOCKED (ARRESTED)" : "RUNNING (FREE)",
          unit: "state",
          badgeColor: isSnapped ? "emerald" : "purple",
          progressPct: clampProgress(isSnapped ? 100 : 0),
        },
        {
          label: "Arrest Dynamic Force",
          value: arrestForceKn,
          unit: "kN",
          badgeColor: isSnapped ? "amber" : "emerald",
          progressPct: clampProgress((Number(arrestForceKn) / 30) * 100),
        },
        {
          label: "Arrest Catch Distance",
          value: `${stopDistCm} cm`,
          unit: "Δy",
          badgeColor: isSnapped ? "emerald" : "cyan",
          progressPct: clampProgress(isSnapped ? 45 : 0),
        },
        {
          label: "Hanging Mass",
          value: `${otis.hangingMassKg} kg`,
          unit: "m",
          badgeColor: "amber",
          progressPct: clampProgress((otis.hangingMassKg / 1500) * 100),
        },
        {
          label: "Hoist Tension",
          value: `${otis.hoistTensionKn} kN`,
          unit: "T",
          badgeColor: "cyan",
          progressPct: clampProgress((otis.hoistTensionKn / 15) * 100),
        },
        {
          label: "Cab Payload",
          value: `${otis.cabPayloadLbs} lb`,
          unit: "lb",
          badgeColor: "purple",
          progressPct: clampProgress((otis.cabPayloadLbs / 2000) * 100),
        },
        {
          label: "Catch Distance",
          value: `${otis.stoppingDistanceIn} in`,
          unit: "in",
          badgeColor: isSnapped ? "emerald" : "cyan",
          progressPct: clampProgress(isSnapped ? 45 : 0),
        },
      ];
    },
    pedagogicalInsight:
      "Hoisting cable tension actively holds the safety pawls disengaged by bowing a heavy transverse leaf spring upward. If the cable snaps, the spring instantly straightens flat, firing pawls outward into the vertical guide-rail ratchets within 38 milliseconds.",
  },
  // Retained non-serving later-Linotype model. The exact US 313,224 route is
  // assigned a source-reading guide below until its full manual edition passes QA.
  "_legacy-unpublished-us-313224-mergenthaler-linotype": {
    domain: "materials_kinetics",
    domainTitle: "Binary Matrix Keyway Demultiplexing & Eutectic Solidification",
    equationName: "7-Bit Binary Matrix Address & Solidification Time",
    governingEquation:
      "B = \\sum_{i=0}^6 b_i 2^i \\quad \\text{and} \\quad t_{\\text{solid}} = C \\left(\\frac{V}{A}\\right)^2 \\left(T_{\\text{pour}} - T_{\\text{mold}}\\right)",
    engineMethod: "FrankenSimEngine.stepMergenthalerLinotype",
    controls: [
      {
        id: "matrixRate",
        label: "Keyboard Typesetting Speed",
        min: 20,
        max: 120,
        step: 5,
        defaultValue: 60,
        unit: "char/min",
      },
      {
        id: "spacebandWedge",
        label: "Spaceband Justification Wedge",
        min: 2.0,
        max: 12.0,
        step: 0.5,
        defaultValue: 6.5,
        unit: "mm",
      },
      {
        id: "potTemp",
        label: "Lead Pot Temperature",
        min: 220,
        max: 300,
        step: 2,
        defaultValue: 260,
        unit: "°C",
      },
      {
        id: "lineLengthPicas",
        label: "Column Measure Width",
        min: 8,
        max: 26,
        step: 1,
        defaultValue: 13,
        unit: "picas",
      },
    ],
    computeMetrics: (p) => {
      const rate = p.matrixRate ?? 60;
      const wedge = p.spacebandWedge ?? 6.5;
      const temp = p.potTemp ?? 260;
      const linotype = stepMergenthalerLinotype({
        matrixRatePerMin: rate,
        spacebandWedgeMm: wedge,
        potTempC: temp,
      });
      const justWidth = linotype.justificationWidthMm.toFixed(1);
      const solidMs = linotype.solidificationTimeMs;
      const hardness = linotype.isEutecticTemp ? "24 HB (Optimal)" : "18 HB (Sub-optimal)";

      return [
        {
          label: "Justified Line Width",
          value: `${justWidth} mm`,
          unit: "width",
          badgeColor: "emerald",
          progressPct: clampProgress((Number(justWidth) / 140) * 100),
        },
        {
          label: "Lines per Hour",
          value: `${linotype.linesPerHour}`,
          unit: "lph",
          badgeColor: "cyan",
          progressPct: clampProgress((linotype.linesPerHour / 120) * 100),
        },
        {
          label: "Matrices per Hour",
          value: `${linotype.charsPerHour}`,
          unit: "cph",
          badgeColor: "purple",
          progressPct: clampProgress((linotype.charsPerHour / 4000) * 100),
        },
        {
          label: "Slug Solidification",
          value: `${solidMs} ms`,
          unit: "t_solid",
          badgeColor: "cyan",
          progressPct: Math.min(100, (solidMs / 600) * 100),
        },
        {
          label: "Lead-Alloy Hardness",
          value: hardness,
          unit: "HB",
          badgeColor: temp >= linotype.alloyMeltPointC && temp <= 275 ? "emerald" : "amber",
          progressPct: clampProgress(temp >= linotype.alloyMeltPointC && temp <= 275 ? 95 : 60),
        },
        {
          label: "Distributor Sorting",
          value: (rate / 60).toFixed(2),
          unit: "Hz",
          badgeColor: "indigo",
          progressPct: clampProgress((rate / 120) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Wedge-shaped two-part spacebands expand between words until the composed line locks tightly against fixed column jaws, while a binary keyway rail sorts recirculating brass matrices back into 90 magazine channels.",
  },
  "us-319596-maxim-machine-gun": {
    domain: "continuum_elasticity",
    domainTitle: "Short-Recoil Momentum Conservation & Toggle-Lock Kinematics",
    equationName: "Conservation of Linear Recoil Momentum",
    governingEquation:
      "m_{\\text{recoil}} v_{\\text{recoil}} = m_{\\text{bullet}} v_{\\text{bullet}} + m_{\\text{gas}} v_{\\text{gas}} \\quad \\text{and} \\quad F_{\\text{breech}} = \\frac{F_{\\text{toggle}}}{\\tan\\theta} \\to \\infty",
    engineMethod: "FrankenSimEngine.stepMaximMachineGun",
    controls: [
      {
        id: "firingRate",
        label: "Cyclic Firing Rate",
        min: 300,
        max: 750,
        step: 25,
        defaultValue: 600,
        unit: "RPM",
      },
      {
        id: "waterLevel",
        label: "Water Jacket Fill",
        min: 0,
        max: 4.0,
        step: 0.2,
        defaultValue: 4.0,
        unit: "liters",
      },
      {
        id: "recoilStroke",
        label: "Short-Recoil Stroke",
        min: 12,
        max: 25,
        step: 1,
        defaultValue: 19,
        unit: "mm",
      },
    ],
    computeMetrics: (p) => {
      const maxim = FrankenSimEngine.stepMaximMachineGun({
        firingRateRpm: p.firingRate ?? 600,
        waterJacketLiters: p.waterLevel ?? 4.0,
        recoilStrokeMm: p.recoilStroke ?? 19,
      });
      const barrelTemp = maxim.barrelTempC;
      const boilRate = maxim.waterEvapRateGs.toFixed(1);

      return [
        {
          label: "Toggle Unlock",
          value: `${maxim.toggleUnlockForceN}`,
          unit: "N",
          badgeColor: "emerald",
          progressPct: clampProgress((maxim.toggleUnlockForceN / 280) * 100),
        },
        {
          label: "Recoil Momentum",
          value: `${maxim.recoilMomentumNs} N·s`,
          unit: "p_rec",
          badgeColor: "cyan",
          progressPct: clampProgress((maxim.recoilMomentumNs / 15) * 100),
        },
        {
          label: "Barrel Temperature",
          value: `${barrelTemp} °C`,
          unit: "T_barrel",
          badgeColor: barrelTemp <= 100 ? "emerald" : "rose",
          progressPct: clampProgress((barrelTemp / 450) * 100),
        },
        {
          label: "Muzzle Energy",
          value: `${maxim.muzzleEnergyJoules} J`,
          unit: "E_k",
          badgeColor: "amber",
          progressPct: clampProgress((maxim.muzzleEnergyJoules / 4000) * 100),
        },
        {
          label: "Steam Vaporization",
          value: `${boilRate} g/s`,
          unit: "dm/dt",
          badgeColor: "purple",
          progressPct: clampProgress((Number(boilRate) / 80) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "The exploding cartridge drives the barrel and breech block rearward; breaking the collinear toggle linkage unlocks the breech, ejects the casing, indexes a fresh cartridge from the cloth belt, and returns under spring tension.",
  },
  "us-361931-daimler-engine": {
    domain: "thermodynamics_transport",
    domainTitle: "High-RPM Internal Combustion & Epicyclic Bevel Differential",
    equationName: "Engine Specific Power & Differential Kinematics",
    governingEquation:
      "P = \\frac{\\text{BMEP} \\cdot V_d \\cdot N}{120} \\quad \\text{and} \\quad \\omega_{\\text{left}} + \\omega_{\\text{right}} = 2\\omega_{\\text{carrier}}",
    engineMethod: "FrankenSimEngine.stepDaimlerEngine",
    controls: [
      {
        id: "engineRpm",
        label: "Crankshaft Speed",
        min: 400,
        max: 950,
        step: 25,
        defaultValue: 750,
        unit: "RPM",
      },
      {
        id: "hotTubeTemp",
        label: "Hot-Tube Igniter Temp",
        min: 650,
        max: 950,
        step: 10,
        defaultValue: 850,
        unit: "°C",
      },
      {
        id: "turnAngle",
        label: "Steering Wheel Turn Angle",
        min: 0,
        max: 35,
        step: 1,
        defaultValue: 15,
        unit: "°",
      },
    ],
    computeMetrics: (p) => {
      const daimler = FrankenSimEngine.stepDaimlerEngine({
        engineRpm: p.engineRpm ?? 750,
        hotTubeTempC: p.hotTubeTemp ?? 850,
        differentialSlipAngleDeg: p.turnAngle ?? 15,
      });
      const bmep = daimler.bmepBar;
      const hp = daimler.brakeHorsepower.toFixed(2);

      return [
        {
          label: "Brake Horsepower",
          value: `${hp} hp`,
          unit: "P_brake",
          badgeColor: "emerald",
          progressPct: clampProgress((Number(hp) / 2.5) * 100),
        },
        {
          label: "BMEP Pressure",
          value: `${bmep} bar`,
          unit: "BMEP",
          badgeColor: "cyan",
          progressPct: clampProgress((bmep / 6.0) * 100),
        },
        {
          label: "Outer Wheel Speed",
          value: `${daimler.outerWheelRpm} RPM`,
          unit: "ω_outer",
          badgeColor: "indigo",
          progressPct: clampProgress((daimler.outerWheelRpm / 250) * 100),
        },
        {
          label: "Inner Wheel Speed",
          value: `${daimler.innerWheelRpm} RPM`,
          unit: "ω_inner",
          badgeColor: "amber",
          progressPct: clampProgress((daimler.innerWheelRpm / 250) * 100),
        },
        {
          label: "Specific Power",
          value: `${daimler.specificPowerHpPerKg} hp/kg`,
          unit: "P/m",
          badgeColor: "purple",
          progressPct: clampProgress((daimler.specificPowerHpPerKg / 0.04) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Raising engine RPM by a factor of 4 using incandescent glow-tube ignition slashed weight per horsepower by 80%, while the bevel differential split torque across drive wheels during cornering.",
  },
  "us-388850-eastman-kodak": {
    domain: "optics_waves",
    domainTitle: "Hyperfocal Fixed-Focus Optics & Logarithmic Exposure Law",
    equationName: "Hyperfocal Distance & Exposure Value (EV)",
    governingEquation:
      "H = \\frac{f^2}{N \\cdot c} + f \\quad \\text{and} \\quad \\text{EV} = \\log_2\\left(\\frac{N^2}{t}\\right)",
    engineMethod: "FrankenSimEngine.stepEastmanKodak",
    controls: [
      {
        id: "shutterSpeed",
        label: "Barrel Shutter Speed",
        min: 0.01,
        max: 0.1,
        step: 0.01,
        defaultValue: 0.05,
        unit: "s",
      },
      {
        id: "apertureStop",
        label: "Lens Aperture (f-number)",
        min: 8,
        max: 16,
        step: 1,
        defaultValue: 9,
        unit: "f/#",
      },
      {
        id: "subjectDist",
        label: "Subject Distance",
        min: 0.5,
        max: 8.0,
        step: 0.2,
        defaultValue: 3.0,
        unit: "m",
      },
    ],
    computeMetrics: (p) => {
      const raw = p.shutterSpeed ?? 0.05;
      const t = raw > 1 ? 1 / raw : raw;
      const kodak = FrankenSimEngine.stepEastmanKodak({
        shutterSpeedSec: t,
        apertureFNumber: p.apertureStop ?? 9,
        subjectDistanceM: p.subjectDist ?? 3.0,
      });

      return [
        {
          label: "Hyperfocal Point",
          value: `${kodak.hyperfocalM.toFixed(2)} m`,
          unit: "H",
          badgeColor: "emerald",
          progressPct: clampProgress((kodak.hyperfocalM / 15) * 100),
        },
        {
          label: "Near Focus Limit",
          value: `${kodak.dofNearM.toFixed(2)} m`,
          unit: "D_near",
          badgeColor: "cyan",
          progressPct: clampProgress((kodak.dofNearM / 5) * 100),
        },
        {
          label: "Exposure Value (EV)",
          value: `EV ${kodak.exposureValueEv.toFixed(2)}`,
          unit: "EV",
          badgeColor: "indigo",
          progressPct: clampProgress((kodak.exposureValueEv / 15) * 100),
        },
        {
          label: "Focus Status",
          value: kodak.isInFocus ? "SHARP (IN FOCUS)" : "BLURRED (TOO CLOSE)",
          unit: "status",
          badgeColor: kodak.isInFocus ? "emerald" : "rose",
          progressPct: clampProgress(kodak.isInFocus ? 100 : 25),
        },
        {
          label: "Fixed Doublet",
          value: `${kodak.focalLengthMm} mm`,
          unit: "f",
          badgeColor: "amber",
          progressPct: clampProgress(100),
        },
        {
          label: "Circular Frame",
          value: `${kodak.filmFormatInches} in`,
          unit: "format",
          badgeColor: "cyan",
          progressPct: clampProgress(100),
        },
        {
          label: "Shutter Flash",
          value: `${kodak.flashDisplayMs} ms`,
          unit: "t_shut",
          badgeColor: "amber",
          progressPct: Math.min(100, (kodak.flashDisplayMs / 200) * 100),
        },
        {
          label: "Barrel ω",
          value: `${kodak.barrelOmegaRadPerS}`,
          unit: "rad/s",
          badgeColor: "cyan",
          progressPct: Math.min(100, (kodak.barrelOmegaRadPerS / 700) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "A fixed 57mm f/9 doublet set at its hyperfocal distance renders everything from 1.2 meters to optical infinity in sharp focus, eliminating viewfinders and focusing bellows.",
  },
  // Retained non-serving tabulator performance model. The exact US 395,781
  // route receives the source-reading guide below pending full editorial QA.
  "_legacy-unpublished-us-395781-hollerith-tabulating": {
    domain: "electromagnetics_flux",
    domainTitle: "Punched Card Matrix Logic & Electromagnetic Solenoid Accumulators",
    equationName: "Electromagnetic Solenoid Force & Inductive Time Constant",
    governingEquation:
      "F_{\\text{mag}} = \\frac{(N I)^2 \\mu_0 A}{2 g^2} \\quad \\text{and} \\quad \\tau = \\frac{L}{R}",
    engineMethod: "FrankenSimEngine.stepHollerithTabulating",
    controls: [
      {
        id: "cardsPerMin",
        label: "Tabulating Feed Speed",
        min: 20,
        max: 90,
        step: 5,
        defaultValue: 60,
        unit: "cards/min",
      },
      {
        id: "batteryVolts",
        label: "Battery Bank Potential",
        min: 6,
        max: 24,
        step: 1,
        defaultValue: 12,
        unit: "V",
      },
      {
        id: "activeRelays",
        label: "Parallel Accumulator Relays",
        min: 1,
        max: 40,
        step: 1,
        defaultValue: 16,
        unit: "relays",
      },
    ],
    computeMetrics: (p) => {
      const hol = FrankenSimEngine.stepHollerithTabulating({
        cardsPerMin: p.cardsPerMin ?? 60,
        supplyVoltageV: p.batteryVolts ?? 12,
        activeRelays: p.activeRelays ?? 16,
      });
      const cycleMs = hol.cycleTimeMs;
      const forceN = hol.solenoidForceN.toFixed(2);
      const tauMs = hol.inductiveTauMs.toFixed(1);
      const relays = p.activeRelays ?? 16;

      return [
        {
          label: "Reading Cycle Time",
          value: `${cycleMs} ms`,
          unit: "t_cycle",
          badgeColor: "cyan",
          progressPct: clampProgress((cycleMs / 3000) * 100),
        },
        {
          label: "Solenoid Pull Force",
          value: `${forceN} N`,
          unit: "F_mag",
          badgeColor: "emerald",
          progressPct: Math.min(100, (Number(forceN) / 5) * 100),
        },
        {
          label: "Circuit Time Constant",
          value: `${tauMs} ms`,
          unit: "τ",
          badgeColor: "amber",
          progressPct: clampProgress((Number(tauMs) / 30) * 100),
        },
        {
          label: "Active Relays",
          value: `${relays}`,
          unit: "relays",
          badgeColor: "purple",
          progressPct: clampProgress((relays / hol.registerDialCount) * 100),
        },
        {
          label: "Sensing Pins",
          value: `${hol.sensingPinCount}`,
          unit: "pins",
          badgeColor: "indigo",
          progressPct: clampProgress(100),
        },
        {
          label: "Census Register Bank",
          value: `${hol.registerDialCount} dials`,
          unit: "dials",
          badgeColor: "cyan",
          progressPct: clampProgress(100),
        },
        {
          label: "7-hour Day",
          value: hol.cardsPerDay.toLocaleString(),
          unit: "cards",
          badgeColor: "amber",
          progressPct: clampProgress((hol.cardsPerDay / 30000) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Spring-loaded brass pins pass through card perforations into mercury pools, completing 12V circuits that advance dial accumulators and trigger sorting box lids in parallel.",
  },
  "us-470918-reno-escalator": {
    domain: "continuum_elasticity",
    domainTitle: "Inclined Passenger Throughput & Comb-Plate Safety Extraction",
    equationName: "Continuous Transit Throughput & Motor Drive Torque",
    governingEquation:
      "\\dot{N}_{\\text{pass}} = \\frac{v \\cdot w_{\\text{step}}}{L_{\\text{pass}}} \\quad \\text{and} \\quad \\tau = \\frac{R}{\\eta} \\sum m_i g (\\sin\\theta + \\mu \\cos\\theta)",
    engineMethod: "FrankenSimEngine.stepRenoEscalator",
    controls: [
      {
        id: "passengerCount",
        label: "Live Passenger Load",
        min: 0,
        max: 60,
        step: 2,
        defaultValue: 30,
        unit: "riders",
      },
      {
        id: "inclineAngle",
        label: "Truss Incline Angle",
        min: 20,
        max: 35,
        step: 1,
        defaultValue: 25,
        unit: "°",
      },
      {
        id: "beltSpeed",
        label: "Linear Tread Velocity",
        min: 0.3,
        max: 0.75,
        step: 0.05,
        defaultValue: 0.45,
        unit: "m/s",
      },
    ],
    computeMetrics: (p) => {
      const count = p.passengerCount ?? 30;
      const angle = p.inclineAngle ?? 25;
      const v = p.beltSpeed ?? 0.45;
      const reno = stepRenoEscalator({
        passengerCount: count,
        inclineAngleDeg: angle,
        velocityMps: v,
      });
      const throughput = reno.throughputPerHour;
      const torque = reno.motorTorqueNm;
      const powerKw = reno.motorPowerKw.toFixed(2);

      return [
        {
          label: "Hourly Throughput",
          value: `${throughput.toLocaleString()}/hr`,
          unit: "passengers",
          badgeColor: "emerald",
          progressPct: clampProgress((throughput / 10000) * 100),
        },
        {
          label: "Drive Motor Torque",
          value: `${torque} N·m`,
          unit: "τ_motor",
          badgeColor: "indigo",
          progressPct: clampProgress((torque / 6000) * 100),
        },
        {
          label: "Motor Power Draw",
          value: `${powerKw} kW`,
          unit: "P_elec",
          badgeColor: "amber",
          progressPct: clampProgress((Number(powerKw) / 10) * 100),
        },
        {
          label: "Comb-Plate Clearance",
          value: `${reno.combPlateClearanceMm} mm`,
          unit: "δ_gap",
          badgeColor: "cyan",
          progressPct: clampProgress(80),
        },
      ];
    },
    pedagogicalInsight:
      "Longitudinally grooved treads pass smoothly under stationary comb-plate fingers with sub-millimeter clearance, lifting footwear off the incline without danger of pinching.",
  },
  "_legacy-unpublished-us-542846-diesel-engine": {
    domain: "thermodynamics_transport",
    domainTitle: "Adiabatic Compression Auto-Ignition & Constant-Pressure Expansion",
    equationName: "Adiabatic Temperature Rise & Diesel Cycle Efficiency",
    governingEquation:
      "T_2 = T_1 r^{\\gamma - 1} \\quad \\text{and} \\quad \\eta = 1 - \\frac{1}{r^{\\gamma - 1}} \\left[\\frac{r_c^\\gamma - 1}{\\gamma (r_c - 1)}\\right]",
    engineMethod: "FrankenSimEngine.stepDieselEngine",
    controls: [
      {
        id: "compRatio",
        label: "Compression Ratio (r)",
        min: 12,
        max: 22,
        step: 0.5,
        defaultValue: 18,
        unit: ":1",
      },
      {
        id: "blastAirPressure",
        label: "Blast-Air Injector Pressure",
        min: 45,
        max: 85,
        step: 2,
        defaultValue: 65,
        unit: "bar",
      },
      {
        id: "cutoffRatio",
        label: "Fuel Cutoff Ratio (rc)",
        min: 1.2,
        max: 2.2,
        step: 0.1,
        defaultValue: 1.6,
        unit: "ratio",
      },
      {
        id: "engineRpm",
        label: "Engine Shaft Speed",
        min: 60,
        max: 300,
        step: 10,
        defaultValue: 150,
        unit: "RPM",
      },
    ],
    computeMetrics: (p) => {
      const diesel = FrankenSimEngine.stepDieselEngine({
        compressionRatio: p.compRatio ?? 18,
        blastAirPressureBar: p.blastAirPressure ?? 65,
        cutoffRatio: p.cutoffRatio ?? 1.6,
        engineRpm: p.engineRpm ?? 150,
      });
      const tCompC = diesel.tCompressionC;
      const pComp = diesel.pCompBar.toFixed(1);
      const brakeEff = diesel.brakeEfficiencyPct.toFixed(1);

      return [
        {
          label: "Compression Temperature",
          value: `${tCompC} °C`,
          unit: "T_comp",
          badgeColor: tCompC > 210 ? "emerald" : "amber",
          progressPct: clampProgress((tCompC / 800) * 100),
        },
        {
          label: "Peak Cylinder Pressure",
          value: `${pComp} bar`,
          unit: "P_comp",
          badgeColor: "cyan",
          progressPct: clampProgress((Number(pComp) / 80) * 100),
        },
        {
          label: "Brake Thermal Efficiency",
          value: `${brakeEff}%`,
          unit: "η_brake",
          badgeColor: "emerald",
          progressPct: clampProgress((Number(brakeEff) / 50) * 100),
        },
        {
          label: "Auto-Ignition State",
          value: diesel.isAutoIgnition ? "SELF-IGNITING" : "NO IGNITION",
          unit: "state",
          badgeColor: diesel.isAutoIgnition ? "emerald" : "rose",
          progressPct: clampProgress(diesel.isAutoIgnition ? 100 : 0),
        },
        {
          label: "Crank ω",
          value: `${diesel.crankOmegaRadPerS}`,
          unit: "rad/s",
          badgeColor: "cyan",
          progressPct: Math.min(100, (diesel.crankOmegaRadPerS / 30) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Compressing pure air to 18:1 generates 680°C heat, causing atomized fuel droplets injected under high pressure to self-ignite instantaneously and expand at constant pressure.",
  },
  "us-613809-tesla-teleautomaton": {
    domain: "electromagnetics_flux",
    domainTitle: "Tuned RF Resonant Tank & Coherer Logic State Machine",
    equationName: "LC Resonant Frequency & Coherer Demodulation",
    governingEquation:
      "f_0 = \\frac{1}{2\\pi \\sqrt{L C}} \\quad \\text{and} \\quad R_{\\text{coherer}} \\xrightarrow{E_{\\text{RF}}} 50\\,\\Omega",
    engineMethod: "FrankenSimEngine.stepTeslaTeleautomaton",
    controls: [
      {
        id: "rfFrequency",
        label: "RF Transmitter Frequency",
        min: 120,
        max: 180,
        step: 2,
        defaultValue: 150,
        unit: "kHz",
      },
      {
        id: "rudderAngle",
        label: "Rudder Steering Angle",
        min: -35,
        max: 35,
        step: 5,
        defaultValue: 15,
        unit: "°",
      },
      {
        id: "pulseCount",
        label: "RF Pulse Count",
        min: 0,
        max: 20,
        step: 1,
        defaultValue: 3,
        unit: "pulses",
      },
      {
        id: "propellerThrottlePct",
        label: "Electric Motor Throttle",
        min: 0,
        max: 100,
        step: 5,
        defaultValue: 75,
        unit: "%",
      },
    ],
    computeMetrics: (p) => {
      const f = p.rfFrequency ?? 150;
      const rudder = p.rudderAngle ?? 15;
      const isRes = Math.abs(f - 150) <= 4;
      const cohererR = isRes ? "50 Ω (Conducting)" : "100 kΩ (Open)";
      const thrustN = isRes ? "85 N" : "0 N";
      const turnRadiusM =
        Math.abs(rudder) > 0
          ? (12.5 / Math.sin((Math.abs(rudder) * Math.PI) / 180)).toFixed(1)
          : "Straight";

      return [
        {
          label: "Coherer Resistance",
          value: cohererR,
          unit: "R_det",
          badgeColor: isRes ? "emerald" : "amber",
          progressPct: clampProgress(isRes ? 95 : 10),
        },
        {
          label: "Propulsion Motor",
          value: thrustN,
          unit: "Thrust",
          badgeColor: isRes ? "cyan" : "purple",
          progressPct: clampProgress(isRes ? 85 : 0),
        },
        {
          label: "Turning Radius",
          value: `${turnRadiusM} m`,
          unit: "R_turn",
          badgeColor: "indigo",
          progressPct: clampProgress(Math.abs(rudder) > 0 ? 70 : 100),
        },
        {
          label: "Carrier Resonance",
          value: isRes ? "LOCKED (150 kHz)" : "DETUNED",
          unit: "resonance",
          badgeColor: isRes ? "emerald" : "rose",
          progressPct: clampProgress(isRes ? 100 : 20),
        },
      ];
    },
    pedagogicalInsight:
      "Tuned RF waves trigger metal filings in the coherer to fuse and drop resistance, stepping a motorized rotary commutator drum that decodes commands into propulsion and steering.",
  },
  "us-621195-zeppelin-airship": {
    domain: "aerodynamics_mbd",
    domainTitle: "Multi-Cell Archimedean Buoyancy & Space-Frame Bending",
    equationName: "Net Aerostatic Buoyant Lift & Pitch Trim",
    governingEquation:
      "L_{\\text{buoyant}} = V_{\\text{gas}} g (\\rho_{\\text{air}} - \\rho_{\\text{H}_2}) - W_{\\text{struct}}",
    engineMethod: "FrankenSimEngine.stepZeppelinAirship",
    controls: [
      {
        id: "gasInflation",
        label: "Hydrogen Cell Inflation",
        min: 75,
        max: 100,
        step: 1,
        defaultValue: 95,
        unit: "%",
      },
      {
        id: "flightAlt",
        label: "Flight Altitude",
        min: 0,
        max: 2000,
        step: 50,
        defaultValue: 300,
        unit: "m",
      },
      {
        id: "trimWeight",
        label: "Keel Sliding Ballast Position",
        min: -15,
        max: 15,
        step: 1,
        defaultValue: 5,
        unit: "m",
      },
      {
        id: "flightSpeedKnots",
        label: "Cruising Airspeed",
        min: 10,
        max: 45,
        step: 1,
        defaultValue: 28,
        unit: "knots",
      },
    ],
    computeMetrics: (p) => {
      const zep = stepZeppelinAirship({
        gasInflation: p.gasInflation,
        flightAlt: p.flightAlt,
        flightSpeedKnots: p.flightSpeedKnots,
        trimWeight: p.trimWeight,
      });
      const grossKn = zep.grossBuoyancyKn.toFixed(1);
      const netKn = zep.netLiftKn.toFixed(1);
      const pitchDeg = zep.pitchTrimDeg.toFixed(1);

      return [
        {
          label: "Net Aerostatic Lift",
          value: `${netKn} kN`,
          unit: "L_net",
          badgeColor: Number(netKn) > 0 ? "emerald" : "rose",
          progressPct: clampProgress((Number(netKn) / 40) * 100),
        },
        {
          label: "Gross Buoyancy",
          value: `${grossKn} kN`,
          unit: "L_gross",
          badgeColor: "cyan",
          progressPct: clampProgress((Number(grossKn) / 140) * 100),
        },
        {
          label: "Airspeed",
          value: `${zep.flightSpeedMph} mph`,
          unit: "v",
          badgeColor: "amber",
          progressPct: clampProgress((zep.flightSpeedMph / 80) * 100),
        },
        {
          label: "Pitch Trim Angle",
          value: `${pitchDeg}°`,
          unit: "α_trim",
          badgeColor: "indigo",
          progressPct: clampProgress((Math.abs(Number(pitchDeg)) / 10) * 100),
        },
        {
          label: "Useful Payload",
          value: `${zep.usefulPayloadKg} kg`,
          unit: "m_pay",
          badgeColor: "amber",
          progressPct: clampProgress((zep.usefulPayloadKg / 5000) * 100),
        },
        {
          label: "Air Density",
          value: `${zep.ambientAirDensityKgM3.toFixed(3)} kg/m³`,
          unit: "ρ_air",
          badgeColor: "purple",
          progressPct: clampProgress((zep.ambientAirDensityKgM3 / 1.225) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Seventeen independent hydrogen gas cells enclosed inside a rigid duralumin space-frame provide 125 kN of aerostatic lift, protected from solar radiation and wind deformation.",
  },
  "us-727650-linde-air-liquefaction": {
    domain: "thermodynamics_transport",
    domainTitle: "Linde’s counter-current low-temperature apparatus",
    equationName: "Printed temperature-drop relation and regenerative flow path",
    governingEquation: "T - T' = \\frac{(p^2 - p'^2)(289)}{4T^2}",
    engineMethod: "FrankenSimEngine.stepLindeAirLiquefaction",
    controls: [
      {
        id: "inletPressureAtm",
        label: "Compressor Discharge Pressure (p)",
        min: 50,
        max: 200,
        step: 5,
        defaultValue: 75,
        unit: "atm",
      },
      {
        id: "coolerOutletC",
        label: "Pre-Cooler Temperature (t³)",
        min: -10,
        max: 25,
        step: 1,
        defaultValue: 10,
        unit: "°C",
      },
    ],
    computeMetrics: (p) => {
      const pHigh = p.inletPressureAtm ?? 75;
      const pLow = 25;
      const tCooler = p.coolerOutletC ?? 10;
      const deltaP = pHigh - pLow;
      return [
        {
          label: "High-pressure p",
          value: `${pHigh} atm`,
          unit: "p",
          badgeColor: "cyan",
          progressPct: clampProgress(((pHigh - 50) / 150) * 100),
        },
        {
          label: "Low-pressure p′",
          value: `${pLow} atm`,
          unit: "p′",
          badgeColor: "indigo",
          progressPct: clampProgress((pLow / 50) * 100),
        },
        {
          label: "Pre-cooler Outlet t³",
          value: `${tCooler} °C`,
          unit: "t³",
          badgeColor: "amber",
          progressPct: clampProgress(((tCooler + 10) / 35) * 100),
        },
        {
          label: "Expansion Drop Δp",
          value: `${deltaP} atm`,
          unit: "Δp",
          badgeColor: "emerald",
          progressPct: clampProgress((deltaP / 150) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "The grant sends compressed air from C through cooler K and the inner tube of G′ to regulating valve R′ in vessel V′. The returning low-pressure gas travels through the outer annular channel of G′ to the compressor suction, so it cools the incoming stream. The stated 75-atmosphere and 25-atmosphere example is historical source data, not a visitor-adjustable plant model.",
  },
  "us-808897-carrier-air-conditioner": {
    domain: "thermodynamics_transport",
    domainTitle: "Wet-Spray Dew-Point Separation and Sensible Reheat",
    equationName: "Magnus dew point and spray-limited humidity ratio",
    governingEquation:
      "T_{dp} = \\frac{b\\,\\alpha}{a-\\alpha},\\quad \\alpha=\\frac{a T}{b+T}+\\ln(\\mathrm{RH})",
    engineMethod: "FrankenSimEngine.stepCarrierAirConditioner",
    controls: [
      {
        id: "inletTempC",
        label: "Inlet dry-bulb",
        min: 25,
        max: 42,
        step: 1,
        defaultValue: 35,
        unit: "°C",
      },
      {
        id: "inletRhPct",
        label: "Inlet relative humidity",
        min: 40,
        max: 95,
        step: 5,
        defaultValue: 75,
        unit: "%",
      },
      {
        id: "sprayWaterTempC",
        label: "Spray-water temperature",
        min: 4,
        max: 18,
        step: 1,
        defaultValue: 8,
        unit: "°C",
      },
      {
        id: "reheatTempC",
        label: "Reheat supply temperature",
        min: 18,
        max: 26,
        step: 1,
        defaultValue: 22,
        unit: "°C",
      },
      {
        id: "airflowCfm",
        label: "Treated airflow",
        min: 2000,
        max: 30000,
        step: 500,
        defaultValue: 15000,
        unit: "cfm",
      },
    ],
    computeMetrics: (p) => {
      const carrier = FrankenSimEngine.stepCarrierAirConditioner({
        inletTempC: p.inletTempC,
        inletRhPct: p.inletRhPct,
        sprayWaterTempC: p.sprayWaterTempC,
        reheatTempC: p.reheatTempC,
        airflowCfm: p.airflowCfm,
      });
      return [
        {
          label: "Inlet dew point",
          value: carrier.dewPointInC.toFixed(1),
          unit: "°C",
          badgeColor: "cyan",
          progressPct: clampProgress((carrier.dewPointInC / 30) * 100),
        },
        {
          label: "Moisture extracted",
          value: carrier.moistureRemovedGPerKg.toFixed(1),
          unit: "g/kg",
          badgeColor: "amber",
          progressPct: clampProgress((carrier.moistureRemovedGPerKg / 20) * 100),
        },
        {
          label: "Leaving RH",
          value: `${carrier.finalRhPct}`,
          unit: "%",
          badgeColor: "emerald",
          progressPct: carrier.finalRhPct,
        },
        {
          label: "Latent sink",
          value: carrier.coolingWatts.toLocaleString(),
          unit: "W",
          badgeColor: "indigo",
          progressPct: clampProgress((carrier.coolingWatts / 200000) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "A spray colder than the inlet dew point condenses water on the wet plate faces; rear gutters keep that liquid out of the leaving stream. Reheat then sets the dry-bulb without adding moisture, so leaving RH is spray saturation referred to the reheat temperature.",
  },
  "us-124404-westinghouse-air-brake": {
    domain: "thermo_fluid",
    domainTitle: "Continuous Pneumatic Train Line & Triple-Valve Differential Pressure Dynamics",
    equationName: "Boyle's Equalization & Train Line Rarefaction Wave Speed",
    governingEquation:
      "c = \\sqrt{\\gamma R T} \\approx 340\\text{ m/s} \\quad \\text{and} \\quad P_{\\text{final}}(V_{\\text{aux}} + V_{\\text{cyl}}) = P_{\\text{aux}} V_{\\text{aux}}",
    engineMethod: "FrankenSimEngine.stepWestinghouseAirBrake",
    controls: [
      {
        id: "trainPipePressure",
        label: "Brake Pipe Pressure (Locomotive Engineer Valve)",
        min: 0,
        max: 70,
        step: 5,
        defaultValue: 70,
        unit: "psi",
      },
      {
        id: "carMass",
        label: "Railcar Gross Mass",
        min: 20,
        max: 80,
        step: 5,
        defaultValue: 35,
        unit: "tonnes",
      },
    ],
    computeMetrics: (p) => {
      const wh = FrankenSimEngine.stepWestinghouseAirBrake({
        trainPipePressurePsi: p.trainPipePressure ?? 70,
        carMassTonnes: p.carMass ?? 35,
      });
      const cylPsi = wh.brakeCylinderPressurePsi;
      const pistonThrustKn = wh.shoeClampingForceKn.toFixed(1);
      const isEmergency = wh.valveState === "EMERGENCY";
      const isService = wh.valveState === "SERVICE";
      const stopDistM = wh.stoppingDistanceM;

      return [
        {
          label: "Brake Cylinder Pressure",
          value: `${cylPsi} psi`,
          unit: "P_cyl",
          badgeColor: cylPsi > 30 ? "amber" : "emerald",
          progressPct: clampProgress((cylPsi / 55) * 100),
        },
        {
          label: "Shoe Clamping Force",
          value: `${pistonThrustKn} kN`,
          unit: "F_clamp",
          badgeColor: Number(pistonThrustKn) > 40 ? "rose" : "cyan",
          progressPct: clampProgress((Number(pistonThrustKn) / 85) * 100),
        },
        {
          label: "Stopping Distance",
          value: `${wh.stoppingDistanceFt} ft`,
          unit: "ft",
          badgeColor: "amber",
          progressPct: Math.min(100, (wh.stoppingDistanceFt / 4000) * 100),
        },
        {
          label: "Approach Speed",
          value: `${wh.approachSpeedMph}`,
          unit: "mph",
          badgeColor: "cyan",
          progressPct: clampProgress((wh.approachSpeedMph / 60) * 100),
        },
        {
          label: "Stop Time",
          value: wh.stoppingTimeS > 0 ? `${wh.stoppingTimeS}` : "—",
          unit: "s",
          badgeColor: "indigo",
          progressPct: wh.stoppingTimeS > 0 ? Math.min(100, (wh.stoppingTimeS / 60) * 100) : 0,
        },
        {
          label: "Wheel ω",
          value: `${wh.rollingOmegaRadPerS}`,
          unit: "rad/s",
          badgeColor: "cyan",
          progressPct: Math.min(100, (wh.rollingOmegaRadPerS / 60) * 100),
        },
        {
          label: "Triple Valve State",
          value: isEmergency
            ? "EMERGENCY DUMP"
            : isService
              ? "SERVICE APPLICATION"
              : "RUNNING / CHARGE",
          unit: "mode",
          badgeColor: isEmergency ? "rose" : isService ? "amber" : "emerald",
          progressPct: clampProgress(isEmergency ? 100 : isService ? 60 : 10),
        },
        {
          label: "Estimated Stop Distance",
          value: `${stopDistM} m`,
          unit: "d_stop",
          badgeColor: stopDistM < 400 ? "emerald" : "amber",
          progressPct: Math.min(100, (stopDistM / 1200) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "The triple valve inverts brake control: maintaining 70 psi in the continuous train pipe keeps the brakes released. When line pressure is dropped, higher pressure in the car's local auxiliary reservoir shifts the piston to dump air directly into the brake cylinder, stopping the train.",
  },
  "us-x72-whitney-cotton-gin": {
    domain: "aerodynamics_mbd",
    domainTitle: "Rotary Kinematics & Solid-State Fiber Separation",
    equationName: "Centrifugal Separation & Circular Shear Kinematics",
    governingEquation:
      "v_t = \\omega \\cdot r \\quad \\text{and} \\quad \\dot{m} = \\rho \\cdot A \\cdot v",
    engineMethod: "FrankenSimEngine.stepWhitneyCottonGin",
    controls: [
      {
        id: "crankRpm",
        label: "Hand Crank Speed",
        min: 60,
        max: 360,
        step: 10,
        defaultValue: 180,
        unit: "RPM",
      },
    ],
    computeMetrics: (p) => {
      const gin = stepWhitneyCottonGin({ crankRpm: p.crankRpm });
      const sawRpm = gin.sawRpm;
      const brushRpm = gin.brushRpm;
      const outputLbs = gin.outputLbsPerDay;
      return [
        {
          label: "Saw Cylinder Speed",
          value: `${sawRpm} RPM`,
          unit: "omega_saw",
          badgeColor: "amber",
          progressPct: clampProgress((sawRpm / 1260) * 100),
        },
        {
          label: "Brush Speed",
          value: `${brushRpm} RPM`,
          unit: "omega_brush",
          badgeColor: "cyan",
          progressPct: clampProgress((brushRpm / 4320) * 100),
        },
        {
          label: "Daily Clean Fiber Yield",
          value: `${outputLbs} lbs/day`,
          unit: "m_dot",
          badgeColor: "emerald",
          progressPct: clampProgress((outputLbs / 100) * 100),
        },
        {
          label: "Saw Tip Speed",
          value: `${gin.sawTipSpeedMps} m/s`,
          unit: "v_tip",
          badgeColor: "purple",
          progressPct: clampProgress((gin.sawTipSpeedMps / 12) * 100),
        },
        {
          label: "vs Hand Ginning",
          value: `${gin.laborMultiplier}×`,
          unit: "labor",
          badgeColor: "amber",
          progressPct: Math.min(100, gin.laborMultiplier),
        },
      ];
    },
    pedagogicalInsight:
      "Whitney's saw teeth hook fiber through narrow 2.8mm grate slots that block green seeds. The high-speed counter-rotating brush cylinder removes lint continuously via centrifugal airflow.",
  },
  "us-x8277-mccormick-reaper": {
    domain: "mechanical_kinematics",
    domainTitle: "Ground-Wheel Gear-Train Kinematics",
    equationName: "Printed Wheel, Gear, and Pulley Ratios",
    governingEquation:
      "n_{\\mathrm{wheel}} = \\frac{v}{\\pi(2\\,\\mathrm{ft})},\\quad n_{\\mathrm{crank}} = n_{\\mathrm{wheel}}\\left(\\frac{30}{9}\\right)\\left(\\frac{27}{9}\\right),\\quad n_{\\mathrm{reel}} = n_{\\mathrm{wheel}}\\left(\\frac{13}{12}\\right)",
    engineMethod:
      "Host no-slip estimate from dimensions printed in US X8277; no WASM kernel is loaded.",
    controls: [
      {
        id: "forwardSpeedMph",
        label: "Horse Ground Speed",
        min: 1.0,
        max: 5.0,
        step: 0.2,
        defaultValue: 2.5,
        unit: "MPH",
      },
    ],
    computeMetrics: (p) => {
      const reaper = stepMcCormickReaper({ forwardSpeedMph: p.forwardSpeedMph });
      return [
        {
          label: "24-inch Ground Wheel",
          value: `${reaper.groundWheelRpm} RPM`,
          unit: "n_wheel",
          badgeColor: "amber",
        },
        {
          label: "30:9 × 27:9 Crank",
          value: `${reaper.cutterCrankRpm} RPM`,
          unit: "n_crank",
          badgeColor: "cyan",
        },
        {
          label: "13-inch to 12-inch Reel Belt",
          value: `${reaper.reelRpm} RPM`,
          unit: "n_reel",
          badgeColor: "emerald",
        },
        {
          label: "Ground Speed",
          value: `${reaper.groundSpeedMps} m/s`,
          unit: "v",
          badgeColor: "cyan",
        },
        {
          label: "Cutter Frequency",
          value: `${reaper.cutterHz} Hz`,
          unit: "f_cut",
          badgeColor: "purple",
        },
      ];
    },
    pedagogicalInsight:
      "At the selected ground speed, the readout follows the wheel diameter, tooth counts, and pulley diameters stated in the specification. It illustrates motion transmission only; the patent does not establish a crop yield, a field capacity, or a measured cutting rate.",
  },
  "us-132-davenport-electric-motor": {
    domain: "electromagnetics_flux",
    domainTitle: "Permanent Magnet Stator & Commutated Rotor Torque",
    equationName: "Lorentz Force & Commutated Armature Torque",
    governingEquation:
      "\\tau = 2 \\cdot N \\cdot I \\cdot B \\cdot r \\cdot l \\cdot \\sin(\\theta)",
    engineMethod: "FrankenSimEngine.stepDavenportMotor",
    controls: [
      {
        id: "batteryVoltage",
        label: "Galvanic Battery Voltage",
        min: 4,
        max: 24,
        step: 1,
        defaultValue: 12,
        unit: "V",
      },
      {
        id: "loadTorque",
        label: "Mechanical Load Torque",
        min: 0.2,
        max: 2.5,
        step: 0.1,
        defaultValue: 0.8,
        unit: "N·m",
      },
    ],
    computeMetrics: (p) => {
      const motor = stepDavenportMotor({
        batteryVoltage: p.batteryVoltage,
        loadTorque: p.loadTorque,
      });
      const rpm = motor.shaftRpm;
      const powerW = motor.shaftPowerW;
      return [
        {
          label: "Motor Speed",
          value: `${rpm} RPM`,
          unit: "omega",
          badgeColor: "cyan",
          progressPct: clampProgress((rpm / 900) * 100),
        },
        {
          label: "Shaft Power Output",
          value: `${powerW} W`,
          unit: "P_out",
          badgeColor: "amber",
          progressPct: clampProgress((powerW / 120) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Davenport's split-ring commutator reverses the polarity of the cross-arm electromagnets every half revolution, producing continuous rotation against permanent stator shoes.",
  },
  "us-588-ericsson-propeller": {
    domain: "aerodynamics_mbd",
    domainTitle: "Source-Bounded Spiral-Plate and Gear Arrangement",
    equationName: "Printed Helical Development and Opposed Motion",
    governingEquation: "P = 3D; shaft b turns contrary to shaft a and at a lower speed",
    engineMethod: "FrankenSimEngine.stepEricssonPropeller (illustrative display motion only)",
    controls: [
      {
        id: "shaftRpm",
        label: "Illustrative Shaft Motion",
        min: 40,
        max: 240,
        step: 10,
        defaultValue: 120,
        unit: "model RPM",
      },
      {
        id: "bladePitchAngleDeg",
        label: "Illustrative Plate Angle",
        min: 20,
        max: 55,
        step: 1,
        defaultValue: 35,
        unit: "model degrees",
      },
    ],
    computeMetrics: (_p) => {
      return [
        {
          label: "Source Spiral Advance",
          value: "3",
          unit: "diameters per turn",
          badgeColor: "emerald",
          progressPct: clampProgress(100),
        },
        {
          label: "Source Shaft Relation",
          value: "b opposite a",
          unit: "lower stated speed",
          badgeColor: "purple",
          progressPct: clampProgress(100),
        },
        {
          label: "Source Casing Clearance",
          value: "about 1/8",
          unit: "inch",
          badgeColor: "amber",
          progressPct: clampProgress(100),
        },
      ];
    },
    pedagogicalInsight:
      "US 588 supplies a plate-development rule, the opposed direction and unequal speeds of its concentric shafts, and about one eighth of an inch of clearance in the three-part gear drum. The controls animate reader-aid motion only; the grant prints no shaft rate, propeller dimensions, vessel speed, thrust, slip, efficiency, or torque balance.",
  },
  "us-6162-corliss-steam-engine": {
    domain: "aerodynamics_mbd",
    domainTitle: "Thermodynamics & Variable Cut-Off Steam Valve Gear",
    equationName: "Rankine Thermodynamic Expansion & Indicated Power",
    governingEquation:
      "P_{\\text{IHP}} = \\frac{p_{\\text{mep}} \\cdot L \\cdot A \\cdot N}{33000}",
    engineMethod: "FrankenSimEngine.stepCorlissEngine",
    controls: [
      {
        id: "steamPressurePsi",
        label: "Boiler Steam Pressure",
        min: 40,
        max: 180,
        step: 5,
        defaultValue: 100,
        unit: "PSI",
      },
      {
        id: "engineRpm",
        label: "Engine Speed",
        min: 30,
        max: 120,
        step: 5,
        defaultValue: 65,
        unit: "RPM",
      },
    ],
    computeMetrics: (p) => {
      const corliss = stepCorlissEngine({
        steamPressurePsi: p.steamPressurePsi,
        engineRpm: p.engineRpm,
        cutoffPct: p.cutoffPct,
      });
      const ihp = corliss.indicatedHp;
      return [
        {
          label: "Indicated Horsepower",
          value: `${ihp} IHP`,
          unit: "P_ind",
          badgeColor: "amber",
          progressPct: clampProgress((ihp / 500) * 100),
        },
        {
          label: "Thermal Efficiency",
          value: `${corliss.thermalEfficiencyPct}%`,
          unit: "eta_th",
          badgeColor: "emerald",
          progressPct: clampProgress((corliss.thermalEfficiencyPct / 40) * 100),
        },
        {
          label: "Boiler Pressure",
          value: `${corliss.boilerMpa} MPa`,
          unit: "P",
          badgeColor: "amber",
          progressPct: clampProgress((corliss.boilerMpa / 1.4) * 100),
        },
        {
          label: "Expansion Ratio",
          value: `${corliss.expansionRatio}`,
          unit: "r_exp",
          badgeColor: "cyan",
          progressPct: clampProgress((corliss.expansionRatio / 8) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "The central oscillating wrist-plate trips the admission valves closed instantaneously via pneumatic dashpots, allowing steam to expand adiabatically without throttling loss.",
  },
  "us-36836-gatling-gun": {
    domain: "aerodynamics_mbd",
    domainTitle: "Kinematics & Rotary Cam-Driven Cyclic Action",
    equationName: "Cyclic Fire Rate & Spiral Cam Kinematics",
    governingEquation:
      "\\text{RPM}_{\\text{fire}} = N_{\\text{barrels}} \\cdot \\text{RPM}_{\\text{crank}}",
    engineMethod: "FrankenSimEngine.stepGatlingGun",
    controls: [
      {
        id: "crankRpm",
        label: "Hand Crank Rotation Rate",
        min: 20,
        max: 120,
        step: 5,
        defaultValue: 60,
        unit: "RPM",
      },
      {
        id: "barrelCount",
        label: "Revolving Barrel Cluster Count",
        min: 4,
        max: 10,
        step: 2,
        defaultValue: 6,
        unit: "barrels",
      },
    ],
    computeMetrics: (p) => {
      const gatling = stepGatlingGun({ crankRpm: p.crankRpm, barrelCount: p.barrelCount });
      const rof = gatling.roundsPerMin;
      return [
        {
          label: "Rate of Fire",
          value: `${rof} rounds/min`,
          unit: "ROF",
          badgeColor: "rose",
          progressPct: clampProgress((rof / 1200) * 100),
        },
        {
          label: "Barrel Cooling Interval",
          value: `${gatling.barrelCoolingIntervalS.toFixed(2)} s`,
          unit: "t_cool",
          badgeColor: "cyan",
          progressPct: clampProgress(80),
        },
        {
          label: "Muzzle Energy",
          value: `${gatling.muzzleEnergyJoules} J`,
          unit: "E_k",
          badgeColor: "amber",
          progressPct: clampProgress((gatling.muzzleEnergyJoules / 2000) * 100),
        },
        {
          label: "Cycle Interval",
          value: `${gatling.cycleTimeMs} ms`,
          unit: "t_cyc",
          badgeColor: "cyan",
          progressPct: clampProgress((gatling.cycleTimeMs / 400) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Six revolving barrels rotate around a stationary central cylinder containing spiral cam grooves that load, cock, lock, fire, and extract cartridges during one continuous turn.",
  },
  "us-78317-nobel-dynamite": {
    domain: "solid_mechanics",
    domainTitle: "Explosive Detonation & Porous Matrix Stabilization",
    equationName: "Chapman-Jouguet Detonation Velocity",
    governingEquation: "D = \\sqrt{2 \\cdot (\\gamma^2 - 1) \\cdot q}",
    engineMethod: "FrankenSimEngine.stepNobelDynamite",
    controls: [
      {
        id: "ngConcentrationPct",
        label: "Nitroglycerin Matrix Absorption",
        min: 50,
        max: 85,
        step: 5,
        defaultValue: 75,
        unit: "%",
      },
      {
        id: "capEnergyJoules",
        label: "Blasting Cap Shock Energy",
        min: 0.2,
        max: 3.0,
        step: 0.2,
        defaultValue: 1.2,
        unit: "J",
      },
    ],
    computeMetrics: (p) => {
      const nobel = stepNobelDynamite({
        ngConcentrationPct: p.ngConcentrationPct,
        capEnergyJoules: p.capEnergyJoules,
      });
      const vDet = nobel.detonationVelocityMps;
      const isInitiated = nobel.isInitiated;
      return [
        {
          label: "Detonation Velocity",
          value: isInitiated ? `${vDet} m/s` : "0 m/s (Sub-threshold)",
          unit: "D_CJ",
          badgeColor: isInitiated ? "rose" : "amber",
          progressPct: clampProgress(isInitiated ? (vDet / 8500) * 100 : 0),
        },
        {
          label: "Kieselguhr Cushion",
          value: `${nobel.cushionFactor}×`,
          unit: "vs free NG",
          badgeColor: "emerald",
          progressPct: Math.min(100, (nobel.cushionFactor / 7) * 100),
        },
        {
          label: "Blast Overpressure",
          value: `${nobel.blastOverpressureGpa} GPa`,
          unit: "P_CJ",
          badgeColor: "rose",
          progressPct: clampProgress((nobel.blastOverpressureGpa / 8) * 100),
        },
        {
          label: "Specific Energy",
          value: `${nobel.energyMjPerKg} MJ/kg`,
          unit: "Q",
          badgeColor: "amber",
          progressPct: clampProgress((nobel.energyMjPerKg / 6.3) * 100),
        },
        {
          label: "Dough State",
          value: nobel.isSensitiveUnsafe ? "EXUDING" : "STABLE",
          unit: "state",
          badgeColor: nobel.isSensitiveUnsafe ? "rose" : "emerald",
          progressPct: clampProgress(nobel.isSensitiveUnsafe ? 20 : 90),
        },
        {
          label: "20 cm Transit",
          value: `${nobel.chargeTransitUs} µs`,
          unit: "t_CJ",
          badgeColor: "cyan",
          progressPct: Math.min(100, (nobel.chargeTransitUs / 40) * 100),
        },
        {
          label: "Visible Flash",
          value: `${nobel.flashDisplayMs} ms`,
          unit: "t_flash",
          badgeColor: "amber",
          progressPct: clampProgress((nobel.flashDisplayMs / 400) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Inert porous kieselguhr absorbs liquid nitroglycerin like a sponge, rendering the explosive insensitive to shock while the fulminate of mercury cap delivers the shockwave necessary for full detonation.",
  },
  "us-79265-sholes-typewriter": {
    domain: "mechanism_kinematics",
    domainTitle: "Source-Constrained Type-Bar and Carriage Demonstration",
    equationName: "Key, Ratchet, and Carriage Sequence",
    governingEquation:
      "A key raises bar T; lever H alternately releases ratchet I; the weighted carriage advances one serration while the type-bar returns to cushion q.",
    engineMethod: "Source-constrained TypeScript display cycle; no measured rate or pitch",
    controls: [
      {
        id: "typingSpeedWpm",
        label: "Demonstration Cadence",
        min: 10,
        max: 120,
        step: 5,
        defaultValue: 40,
        unit: "strokes/min",
      },
    ],
    computeMetrics: (p) => {
      const sholes = stepSholesTypewriter(p.typingSpeedWpm ?? 40, 0);
      return [
        {
          label: "Demonstration Events",
          value: sholes.eventsPerSecond.toFixed(1),
          unit: "strokes/s",
          badgeColor: "amber",
          progressPct: clampProgress((sholes.eventsPerSecond / 2) * 100),
        },
        {
          label: "Key Cycle",
          value: `${Math.round(sholes.keyCyclePct * 100)}%`,
          unit: "relative",
          badgeColor: "emerald",
          progressPct: clampProgress(sholes.keyCyclePct * 100),
        },
        {
          label: "Ratchet State",
          value: sholes.ratchetReleasePct > 0 ? "releasing" : "held",
          unit: "state",
          badgeColor: "cyan",
          progressPct: clampProgress(sholes.ratchetReleasePct * 100),
        },
      ];
    },
    pedagogicalInsight:
      "US 79,265 describes direct key action under radial type-bars, a self-adjusting platen, an alternating-fork ratchet, separate transverse line motion, and a ribbon feed. It does not state a keyboard arrangement, pitch, bar count, throw angle, or collision model.",
  },
  "us-105338-hyatt-celluloid": {
    domain: "solid_mechanics",
    domainTitle: "Thermoplastic Rheology & Hydraulic Injection",
    equationName: "Arrhenius Viscosity & Hydraulic Ram Extrusion",
    governingEquation: "\\eta(T) = \\eta_0 \\cdot \\exp\\left(\\frac{E_a}{R \\cdot T}\\right)",
    engineMethod: "FrankenSimEngine.stepHyattCelluloid",
    controls: [
      {
        id: "steamTempC",
        label: "Steam Jacket Temperature",
        min: 70,
        max: 160,
        step: 5,
        defaultValue: 95,
        unit: "°C",
      },
      {
        id: "hydraulicPressureMpa",
        label: "Hydraulic Ram Pressure",
        min: 4,
        max: 25,
        step: 1,
        defaultValue: 10,
        unit: "MPa",
      },
    ],
    computeMetrics: (p) => {
      const hyatt = stepHyattCelluloid({
        steamTempC: p.steamTempC,
        hydraulicPressureMpa: p.hydraulicPressureMpa,
      });
      const visc = hyatt.viscosityPaS;
      const isMelted = hyatt.isMelted;
      return [
        {
          label: "Melt Viscosity",
          value: `${visc} Pa·s`,
          unit: "eta",
          badgeColor: "amber",
          progressPct: Math.min(100, (visc / 2000) * 100),
        },
        {
          label: "Plasticity State",
          value: isMelted ? "FLUID INJECTION" : "RIGID SOLID",
          unit: "phase",
          badgeColor: isMelted ? "emerald" : "rose",
          progressPct: clampProgress(isMelted ? 100 : 20),
        },
        {
          label: "Consolidation Density",
          value: `${hyatt.consolidationDensityGPerCm3} g/cm³`,
          unit: "rho",
          badgeColor: "cyan",
          progressPct: clampProgress(((hyatt.consolidationDensityGPerCm3 - 1.2) / 0.2) * 100),
        },
        {
          label: "Transparency",
          value: `${hyatt.transparencyPct}%`,
          unit: "clear",
          badgeColor: "purple",
          progressPct: clampProgress(hyatt.transparencyPct),
        },
      ];
    },
    pedagogicalInsight:
      "Camphor plasticizes nitrocellulose into the first synthetic thermoplastic. The steam-jacketed cylinder heats the mass to $120^\\circ\\text{C}$ where hydraulic pressure forces it into precision split molds.",
  },
  "us-120057-gramme-dynamo": {
    domain: "electromagnetics_flux",
    domainTitle: "Continuous-current collection from an endless ring winding",
    equationName: "Faraday induction with sequential junction collection",
    governingEquation:
      "For a fixed construction, induced e.m.f. scales with angular speed: E is proportional to omega. The patent does not state the values needed to calculate volts.",
    engineMethod:
      "Normalized source-faithful collection model; not a measured or WASM electrical rating",
    controls: [
      {
        id: "shaftRate",
        label: "Illustrative shaft-rate factor",
        min: 0.4,
        max: 1.6,
        step: 0.1,
        defaultValue: 1,
        unit: "relative",
      },
    ],
    computeMetrics: (p) => {
      const gramme = stepGrammeDynamo({ shaftRate: p.shaftRate });
      return [
        {
          label: "Induced e.m.f. (illustrative)",
          value: `${gramme.inducedEmfIndex}`,
          unit: "relative index",
          badgeColor: "cyan",
          progressPct: clampProgress((gramme.inducedEmfIndex / 160) * 100),
        },
        {
          label: "Printed joined bobbins",
          value: `${gramme.printedJunctionCount}`,
          unit: "junctions",
          badgeColor: "amber",
          progressPct: clampProgress(100),
        },
        {
          label: "Collection continuity (idealized)",
          value: `${gramme.collectionContinuityPct}%`,
          unit: "overlap",
          badgeColor: "emerald",
          progressPct: clampProgress(gramme.collectionContinuityPct),
        },
      ];
    },
    pedagogicalInsight:
      "The continuous ring joins many small bobbins end to end. As rotation changes which junctions meet the collecting rubbers, contributions hand off in sequence. The patent describes that continuity but does not give a voltage, resistance, load, or speed from which to calculate a historical output.",
  },
  "us-135245-pasteur-fermentation": {
    domain: "thermal_transport",
    domainTitle: "Biochemical Kinetics & Sterile Barrier Thermodynamics",
    equationName: "Thermal Sterilization & Biological Inactivation",
    governingEquation: "k = A \\cdot \\exp\\left(-\\frac{E_a}{R \\cdot T}\\right)",
    engineMethod: "FrankenSimEngine.stepPasteurFermentation",
    controls: [
      {
        id: "pasteurizationTempC",
        label: "Pasteurization Bath Temperature",
        min: 45,
        max: 75,
        step: 1,
        defaultValue: 58,
        unit: "°C",
      },
      {
        id: "holdTimeMin",
        label: "Thermal Hold Time",
        min: 5,
        max: 40,
        step: 5,
        defaultValue: 20,
        unit: "min",
      },
      {
        id: "wortTempC",
        label: "Fermentation Wort Temperature",
        min: 10,
        max: 45,
        step: 1,
        defaultValue: 22,
        unit: "°C",
      },
    ],
    computeMetrics: (p) => {
      const pasteur = stepPasteurFermentation({
        pasteurizationTempC: p.pasteurizationTempC,
        holdTimeMin: p.holdTimeMin,
        wortTempC: p.wortTempC,
      });
      const logRed = pasteur.logReduction;
      const activity = pasteur.yeastActivityPct;
      return [
        {
          label: "Bacterial Inactivation",
          value: `${logRed.toFixed(1)} log reduction`,
          unit: "log_N",
          badgeColor: logRed >= 5 ? "emerald" : "amber",
          progressPct: Math.min(100, (logRed / 6) * 100),
        },
        {
          label: "Yeast Culture Activity",
          value: `${activity}%`,
          unit: "rate",
          badgeColor: activity > 70 ? "emerald" : "amber",
          progressPct: clampProgress(activity),
        },
        {
          label: "ABV",
          value: `${pasteur.alcoholAbvPct}%`,
          unit: "abv",
          badgeColor: "purple",
          progressPct: clampProgress((pasteur.alcoholAbvPct / 5.2) * 100),
        },
        {
          label: "Head CO₂",
          value: `${pasteur.co2PressureBar} bar`,
          unit: "P_CO2",
          badgeColor: "cyan",
          progressPct: clampProgress((pasteur.co2PressureBar / 1.8) * 100),
        },
        {
          label: "Surviving Fraction",
          value: `${pasteur.survivorPct}%`,
          unit: "N/N0",
          badgeColor: pasteur.survivorPct < 0.01 ? "emerald" : "amber",
          progressPct: Math.min(100, pasteur.survivorPct * 10),
        },
        {
          label: "Shelf Life",
          value: `${pasteur.shelfLifeMonths} mo`,
          unit: "t_shelf",
          badgeColor: pasteur.shelfLifeMonths > 1 ? "emerald" : "amber",
          progressPct: clampProgress(pasteur.shelfLifeMonths > 1 ? 100 : 10),
        },
      ];
    },
    pedagogicalInsight:
      "Pasteur's narrow S-curved swan-neck pipe lets air enter freely while atmospheric dust and wild airborne bacteria settle in the lower bend, preserving pure yeast strains.",
  },
  "us-157124-glidden-barbed-wire": {
    domain: "solid_mechanics",
    domainTitle: "Elastic Continuum Mechanics & Torsional Wire Locking",
    equationName: "Hooke Tensile Stress & Helical Wire Twist",
    governingEquation:
      "\\sigma = E \\cdot \\epsilon = \\frac{F}{A} \\quad \\text{and} \\quad \\theta_{\\text{twist}} = \\frac{T \\cdot L}{J \\cdot G}",
    engineMethod: "FrankenSimEngine.stepGliddenBarbedWire",
    controls: [
      {
        id: "wireTensionN",
        label: "Line Wire Tension",
        min: 200,
        max: 1200,
        step: 50,
        defaultValue: 650,
        unit: "N",
      },
      {
        id: "twistsPerFoot",
        label: "Helical Twist Rate",
        min: 2,
        max: 10,
        step: 1,
        defaultValue: 5,
        unit: "twists/ft",
      },
      {
        id: "animalPushForceN",
        label: "Livestock Push Force",
        min: 20,
        max: 300,
        step: 10,
        defaultValue: 120,
        unit: "N",
      },
    ],
    computeMetrics: (p) => {
      const wire = stepGliddenBarbedWire({
        wireTensionN: p.wireTensionN,
        twistsPerFoot: p.twistsPerFoot,
        animalPushForceN: p.animalPushForceN,
      });
      const sagCm = wire.sagCm;
      const isLocked = wire.isLocked;
      return [
        {
          label: "Span Sag",
          value: `${sagCm} cm`,
          unit: "delta_y",
          badgeColor: sagCm < 5 ? "emerald" : "amber",
          progressPct: Math.min(100, (sagCm / 15) * 100),
        },
        {
          label: "Barb Longitudinal Lock",
          value: isLocked ? "LOCKED (No Slip)" : "SLIPPING (Insufficient Twist)",
          unit: "lock",
          badgeColor: isLocked ? "emerald" : "rose",
          progressPct: clampProgress(isLocked ? 100 : 25),
        },
        {
          label: "Bessemer Rating",
          value: `${wire.tensileStrengthLbs} lb`,
          unit: "UTS",
          badgeColor: "amber",
          progressPct: clampProgress(100),
        },
        {
          label: "Line Output",
          value: `${wire.productionRateFtPerMin} ft/min`,
          unit: "v_line",
          badgeColor: "cyan",
          progressPct: clampProgress((wire.productionRateFtPerMin / 60) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Coiling the short spur wire around a single core strand and twisting a second line wire around it locks the barb permanently in place against longitudinal slipping or livestock pressure.",
  },
  "us-194047-otto-engine": {
    domain: "aerodynamics_mbd",
    domainTitle: "Internal Combustion & 4-Stroke Otto Thermodynamic Cycle",
    equationName: "Air-Standard Otto Cycle Efficiency",
    governingEquation:
      "\\eta_{\\text{Otto}} = 1 - \\frac{1}{r_c^{\\gamma - 1}} \\quad (\\gamma = 1.4)",
    engineMethod: "FrankenSimEngine.stepOttoEngine",
    controls: [
      {
        id: "engineRpm",
        label: "Crankshaft Speed",
        min: 60,
        max: 320,
        step: 10,
        defaultValue: 180,
        unit: "RPM",
      },
      {
        id: "compressionRatio",
        label: "Geometric Compression Ratio",
        min: 3.0,
        max: 8.0,
        step: 0.5,
        defaultValue: 4.5,
        unit: ":1",
      },
    ],
    computeMetrics: (p) => {
      const otto = stepOttoEngine({ engineRpm: p.engineRpm, compressionRatio: p.compressionRatio });
      const hp = otto.brakeHorsepower.toFixed(1);
      const etaPct = otto.thermalEfficiencyPct;
      return [
        {
          label: "Brake Horsepower",
          value: `${hp} BHP`,
          unit: "P_bhp",
          badgeColor: "amber",
          progressPct: clampProgress((Number(hp) / 6) * 100),
        },
        {
          label: "Cycle Efficiency",
          value: `${etaPct}%`,
          unit: "eta_otto",
          badgeColor: "emerald",
          progressPct: clampProgress(etaPct),
        },
        {
          label: "Peak Compression",
          value: `${otto.peakCompressionBar} bar`,
          unit: "P2",
          badgeColor: "cyan",
          progressPct: clampProgress((otto.peakCompressionBar / 20) * 100),
        },
        {
          label: "Peak Firing",
          value: `${otto.peakFiringBar} bar`,
          unit: "P3",
          badgeColor: "rose",
          progressPct: clampProgress((otto.peakFiringBar / 50) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "The four distinct strokes (Intake, Compression, Power, Exhaust) compress the fuel-air charge prior to flame ignition, raising peak thermodynamic combustion temperature and work output.",
  },
  "us-200521-edison-phonograph": {
    domain: "solid_mechanics",
    domainTitle: "Source-Bounded Diaphragm Recording and Helical Advance",
    equationName: "Source-Specified Recording Chain",
    governingEquation:
      "sound vibration → diaphragm and hard point → marks on yielding material → recovered diaphragm motion",
    engineMethod: "FrankenSimEngine.stepEdisonPhonograph (illustrative display motion only)",
    controls: [
      {
        id: "mandrelRpm",
        label: "Illustrative Clock-Work Rate",
        min: 40,
        max: 140,
        step: 5,
        defaultValue: 60,
        unit: "model RPM",
      },
      {
        id: "voiceVolumeDb",
        label: "Illustrative Diaphragm-Excitation Level",
        min: 40,
        max: 100,
        step: 5,
        defaultValue: 75,
        unit: "model dB",
      },
    ],
    computeMetrics: () => {
      return [
        {
          label: "Source Helical Groove Pitch",
          value: "10",
          unit: "grooves/in",
          badgeColor: "amber",
          progressPct: clampProgress(100),
        },
        {
          label: "Source Shaft Thread Pitch",
          value: "10",
          unit: "threads/in",
          badgeColor: "cyan",
          progressPct: clampProgress(100),
        },
        {
          label: "Named Drive",
          value: "Clock-work M or other power",
          unit: "source text",
          badgeColor: "emerald",
          progressPct: clampProgress(100),
        },
      ];
    },
    pedagogicalInsight:
      "The source describes a diaphragm with a hard indenting point marking metallic foil, paper, or another yielding material on a cylinder. Its ten-groove-per-inch helix and matching ten-thread-per-inch shaft move the cylinder endwise while it turns. The controls animate reader-aid motion only; the grant prints no rate, dimension, diaphragm material, or audio bandwidth.",
  },
  "us-233692-pelton-water-wheel": {
    domain: "aerodynamics_mbd",
    domainTitle: "Impulse Hydrodynamics & Momentum Transfer",
    equationName: "Euler Turbine Equation & Dual-Cup Jet Deflection",
    governingEquation:
      "P = \\rho \\cdot Q \\cdot v_{\\text{jet}} \\cdot u \\cdot (1 - \\cos \\beta) \\quad (\\beta = 165^\\circ)",
    engineMethod: "FrankenSimEngine.stepPeltonWheel",
    controls: [
      {
        id: "headMeters",
        label: "Hydraulic Water Head",
        min: 50,
        max: 600,
        step: 25,
        defaultValue: 450,
        unit: "m",
      },
      {
        id: "runnerRpm",
        label: "Runner Rotational Speed",
        min: 100,
        max: 900,
        step: 25,
        defaultValue: 600,
        unit: "RPM",
      },
    ],
    computeMetrics: (p) => {
      const pelton = stepPeltonWheel({ headMeters: p.headMeters, runnerRpm: p.runnerRpm });
      const vJet = pelton.jetVelocityMps;
      const eta = pelton.etaPct;
      const kw = pelton.shaftPowerKw;
      return [
        {
          label: "Jet Velocity",
          value: `${vJet} m/s`,
          unit: "v_jet",
          badgeColor: "cyan",
          progressPct: clampProgress((vJet / 110) * 100),
        },
        {
          label: "Turbine Efficiency",
          value: `${eta}%`,
          unit: "eta",
          badgeColor: eta >= 85 ? "emerald" : "amber",
          progressPct: clampProgress(eta),
        },
        {
          label: "Turbine Shaft Power",
          value: `${kw} kW`,
          unit: "P_hydro",
          badgeColor: "emerald",
          progressPct: clampProgress((kw / 250) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "The knife-edge splitter divides the jet into two equal halves deflected backward at $165^\\circ$, extracting nearly 90% of kinetic energy while avoiding jet interference.",
  },
  "us-247804-delaval-separator": {
    domain: "aerodynamics_mbd",
    domainTitle: "Centrifugal Dynamics & Multi-Phase Fluid Separation",
    equationName: "Centrifugal Acceleration & Stokes Separation Velocity",
    governingEquation:
      "a_c = \\omega^2 \\cdot r \\quad \\text{and} \\quad v_r = \\frac{d^2 \\cdot (\\rho_{\\text{skim}} - \\rho_{\\text{fat}}) \\cdot \\omega^2 \\cdot r}{18 \\cdot \\mu}",
    engineMethod: "FrankenSimEngine.stepDeLavalSeparator",
    controls: [
      {
        id: "bowlRpm",
        label: "Centrifuge Bowl Speed",
        min: 2000,
        max: 9000,
        step: 250,
        defaultValue: 6500,
        unit: "RPM",
      },
      {
        id: "rawMilkFlowLph",
        label: "Raw Milk Feed Rate",
        min: 100,
        max: 600,
        step: 25,
        defaultValue: 300,
        unit: "L/h",
      },
    ],
    computeMetrics: (p) => {
      const sep = stepDeLavalSeparator({ bowlRpm: p.bowlRpm, rawMilkFlowLph: p.rawMilkFlowLph });
      const g = sep.gForce;
      const yieldFat = sep.fatYieldPct;
      const creamFlow = sep.creamFlowLph;
      return [
        {
          label: "Centrifugal G-Force",
          value: `${g.toLocaleString()} g`,
          unit: "a_c",
          badgeColor: "rose",
          progressPct: clampProgress((g / 11000) * 100),
        },
        {
          label: "Fat Separation Yield",
          value: `${yieldFat}%`,
          unit: "yield",
          badgeColor: "emerald",
          progressPct: clampProgress(Number(yieldFat)),
        },
        {
          label: "Bowl ω",
          value: `${sep.bowlOmegaRadPerS}`,
          unit: "rad/s",
          badgeColor: "amber",
          progressPct: Math.min(100, (sep.bowlOmegaRadPerS / 1000) * 100),
        },
        {
          label: "Display ω",
          value: `${sep.displayOmegaDegPerS} °/s`,
          unit: "ω×0.15",
          badgeColor: "cyan",
          progressPct: Math.min(100, (sep.displaySlowdown / 0.2) * 100),
        },
        {
          label: "Cream Discharge Rate",
          value: `${creamFlow} L/h`,
          unit: "Q_cream",
          badgeColor: "cyan",
          progressPct: clampProgress((creamFlow / 75) * 100),
        },
        {
          label: "Skim Discharge Rate",
          value: `${sep.skimFlowLph} L/h`,
          unit: "Q_skim",
          badgeColor: "purple",
          progressPct: clampProgress((sep.skimFlowLph / 300) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Rotating at 6,000 RPM on a self-centering flexible spindle, the conical disc stack forces dense skim milk to the bowl perimeter while light butterfat concentrates along the central axis.",
  },
  "us-347140-thomson-welding": {
    domain: "electromagnetics_flux",
    domainTitle: "Electric Resistance Joule Heating & Solid-State Fusion",
    equationName: "Joule Heating & Upset Forge Welding",
    governingEquation: "Q = I^2 \\cdot R_{\\text{contact}} \\cdot t",
    engineMethod: "FrankenSimEngine.stepThomsonWelding",
    controls: [
      {
        id: "weldCurrentAmps",
        label: "Secondary Welding Current",
        min: 1000,
        max: 6000,
        step: 100,
        defaultValue: 4500,
        unit: "A",
      },
      {
        id: "clampPressureMpa",
        label: "Mechanical Upset Pressure",
        min: 10,
        max: 60,
        step: 5,
        defaultValue: 35,
        unit: "MPa",
      },
    ],
    computeMetrics: (p) => {
      const weld = stepThomsonWelding({
        weldCurrentAmps: p.weldCurrentAmps,
        clampPressureMpa: p.clampPressureMpa,
      });
      const kw = weld.jouleKw;
      const tempC = weld.interfaceTempC;
      const isForged = weld.isForged;
      return [
        {
          label: "Joule Heat Rate",
          value: `${kw} kW`,
          unit: "P_joule",
          badgeColor: "rose",
          progressPct: clampProgress((kw / 8) * 100),
        },
        {
          label: "Interface Temperature",
          value: `${tempC}°C`,
          unit: "T_weld",
          badgeColor: tempC >= 1150 ? "amber" : "cyan",
          progressPct: Math.min(100, (tempC / 1500) * 100),
        },
        {
          label: "Solid-State Weld Quality",
          value: isForged ? "SOLID FORGE WELD" : "COLD / UNFORGED",
          unit: "fusion",
          badgeColor: isForged ? "emerald" : "rose",
          progressPct: clampProgress(isForged ? 100 : 30),
        },
        {
          label: "Upset Burr",
          value: `${weld.upsetBurrWidthMm} mm`,
          unit: "w_burr",
          badgeColor: "amber",
          progressPct: clampProgress((weld.upsetBurrWidthMm / 6) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "A massive single-turn copper secondary bar steps AC down to 1.5V at 2,500A. Localized resistance at the abutted joint heats steel to plastic fusion temperature where an upset screw welds the bond.",
  },
  "us-328710-parsons-turbine": {
    domain: "aerodynamics_mbd",
    domainTitle: "Multi-Stage Axial Steam Expansion & Reaction Blading",
    equationName: "Reaction Turbine Enthalpy Drop & Stage Expansion",
    governingEquation:
      "\\Delta h_{\\text{stage}} = \\frac{1}{2} \\cdot (v_1^2 - v_2^2) + \\frac{1}{2} \\cdot (w_2^2 - w_1^2)",
    engineMethod: "FrankenSimEngine.stepParsonsTurbine",
    controls: [
      {
        id: "rotorRpm",
        label: "Turbine Rotor Speed",
        min: 1000,
        max: 6000,
        step: 100,
        defaultValue: 3000,
        unit: "RPM",
      },
      {
        id: "inletPressurePsi",
        label: "Boiler Inlet Steam Pressure",
        min: 60,
        max: 300,
        step: 10,
        defaultValue: 180,
        unit: "psi",
      },
    ],
    computeMetrics: (p) => {
      const parsons = stepParsonsTurbine({
        rotorRpm: p.rotorRpm,
        inletPressurePsi: p.inletPressurePsi,
      });
      const kw = parsons.shaftPowerKw;
      return [
        {
          label: "Shaft Power Output",
          value: `${kw.toLocaleString()} kW`,
          unit: "P_shaft",
          badgeColor: "emerald",
          progressPct: clampProgress((kw / 25000) * 100),
        },
        {
          label: "Inlet Pressure",
          value: `${parsons.inletMpa.toFixed(2)} MPa`,
          unit: "P_inlet",
          badgeColor: "amber",
          progressPct: clampProgress(((p.inletPressurePsi ?? 180) / 300) * 100),
        },
        {
          label: "Reaction Expansion",
          value: `${parsons.stageCount} Compound Stages`,
          unit: "stages",
          badgeColor: "cyan",
          progressPct: clampProgress(100),
        },
        {
          label: "Blade Speed Ratio",
          value: `${parsons.steamBladeSpeedRatio} u/c`,
          unit: "u/c",
          badgeColor: "purple",
          progressPct: clampProgress((parsons.steamBladeSpeedRatio / 0.8) * 100),
        },
        {
          label: "Blade u",
          value: `${parsons.bladeSpeedMps} m/s`,
          unit: "u",
          badgeColor: "amber",
          progressPct: Math.min(100, (parsons.bladeSpeedMps / 200) * 100),
        },
        {
          label: "Display ω",
          value: `${parsons.displayOmegaDegPerS} °/s`,
          unit: "ω×0.08",
          badgeColor: "cyan",
          progressPct: Math.min(100, (parsons.displaySlowdown / 0.2) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Parsons divided high-pressure steam expansion across multiple expanding annular rows of reaction blades, keeping tip velocity manageable while directly driving high-speed electrical alternators.",
  },
};

// Catalog page ids share the same kernel seats as their leftover/legacy keys.
// The 3D/2D instruments write these ids; the badge must not stay on sourceFocus.
PATENT_PHYSICS_REGISTRY["us-608969-parsons-turbine"] =
  PATENT_PHYSICS_REGISTRY["us-328710-parsons-turbine"];
PATENT_PHYSICS_REGISTRY["us-1102653-goddard-rocket"] =
  PATENT_PHYSICS_REGISTRY["us-1155986-goddard-rocket"];
PATENT_PHYSICS_REGISTRY["us-3858232-boyle-smith-ccd"] =
  PATENT_PHYSICS_REGISTRY["us-3923554-boyle-smith-ccd"];
PATENT_PHYSICS_REGISTRY["us-3671542-kwolek-kevlar"] =
  PATENT_PHYSICS_REGISTRY["_legacy-unpublished-us-3671542-kwolek-kevlar"];
PATENT_PHYSICS_REGISTRY["us-586193-marconi-radio"] =
  PATENT_PHYSICS_REGISTRY["_legacy-unpublished-us-586193-marconi-radio"];
PATENT_PHYSICS_REGISTRY["us-2292387-lamarr-frequency-hopping"] =
  PATENT_PHYSICS_REGISTRY["_legacy-unpublished-us-2292387-lamarr-frequency-hopping"];
PATENT_PHYSICS_REGISTRY["us-2708656-fermi-reactor"] =
  PATENT_PHYSICS_REGISTRY["_legacy-unpublished-us-2708656-fermi-reactor"];
PATENT_PHYSICS_REGISTRY["us-3541541-engelbart-mouse"] =
  PATENT_PHYSICS_REGISTRY["_legacy-unpublished-us-3541541-engelbart-mouse"];
PATENT_PHYSICS_REGISTRY["us-313224-mergenthaler-linotype"] =
  PATENT_PHYSICS_REGISTRY["_legacy-unpublished-us-313224-mergenthaler-linotype"];
PATENT_PHYSICS_REGISTRY["us-395781-hollerith-tabulating"] =
  PATENT_PHYSICS_REGISTRY["_legacy-unpublished-us-395781-hollerith-tabulating"];
PATENT_PHYSICS_REGISTRY["us-542846-diesel-engine"] =
  PATENT_PHYSICS_REGISTRY["_legacy-unpublished-us-542846-diesel-engine"];
