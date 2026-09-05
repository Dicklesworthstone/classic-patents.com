/**
 * sensitivityKernel.ts
 *
 * Parameter-sensitivity readouts for the live UI sliders (∂Metric/∂Control).
 *
 * Provenance, honestly stated: most entries are per-patent closed-form
 * derivatives authored alongside their kernels; the Wright Flyer entries are
 * central finite differences over the live stepWrightFlyerSi kernel, so they
 * cannot drift from the numbers the sims actually display. This file does NOT
 * use automatic differentiation; the unused Dual class was removed.
 */

import {
  stepBellTelephone,
  stepCorlissEngine,
  stepDeForestAudion,
  stepDeLavalSeparator,
  stepEinsteinRefrigerator,
  stepEngelbartMouse,
  stepEricssonPropeller,
  stepGoodyearRubber,
  stepHaberAmmonia,
  stepHallAluminium,
  stepHewittMercuryLamp,
  stepHollerithTabulating,
  stepLandPolaroidInstantFilm,
  stepMorseTelegraph,
  stepOttoEngine,
  stepParsonsTurbine,
  stepThomsonWelding,
  stepWozniakApple,
  stepYaleLock,
  stepZeppelinAirship,
  voltsToKv,
} from "./catalogKernels";
import {
  readClavelDeltaRobotControls,
  stepClavelDeltaRobotTopology,
} from "./clavelDeltaRobotKernel";
import { stepColtLockwork } from "./coltRevolverKernel";
import { readCrumpFdmControls, stepCrumpFdmSi } from "./crumpFdmKernel";
import { stepDieselEngine } from "./dieselEngineKernel";
import {
  EDISON_DECLARED_FILAMENT_LENGTH_CM,
  EDISON_DECLARED_HOT_RESISTANCE_OHM,
  EDISON_SOURCE_MAX_RESISTANCE_OHM,
  EDISON_SOURCE_MIN_RESISTANCE_OHM,
  stepEdisonRadiativeBalance,
} from "./edisonWasm";
import { FrankenSimEngine } from "./engine";
import { fermiKeff } from "./fermiKinetics";
import {
  readGoertzMasterSlaveControls,
  stepGoertzMasterSlaveTopology,
} from "./goertzElectronicMasterSlaveManipulatorKernel";
import {
  readHullStereolithographyControls,
  stepHullStereolithographySi,
} from "./hullStereolithographyKernel";
import { readKamenSegwayControls, stepKamenSegwaySi } from "./kamenSegwayKernel";
import { stepLemelsonWarehouseTopology } from "./lemelsonWarehouseKernel";
import { stepMakinoScaraTopology } from "./makinoScaraKernel";
import { readMestralVelcroControls, stepMestralVelcroSi } from "./mestralVelcroKernel";
import { stepMilacronRobotToolchanger } from "./milacronRobotToolchangerKernel";
import { readNoycePlanarLeadControls } from "./noycePlanarLeadKernel";
import { OTIS_DECLARED_MAX_DISPLAY_TRAVEL_PER_S } from "./otisKernel";
import { ROBOT_END_EFFECTOR_TYPICAL_JAW_OPENING_M } from "./robotEndEffectorKernel";
import { readSalisburyRobotHandControls } from "./salisburyRobotHandKernel";
import {
  INITIAL_SIKORSKY_STATE,
  readSikorskyControls,
  stepSikorskyHelicopterSi,
} from "./sikorskyHelicopterKernel";
import { stepStackhouseSourceTopology } from "./stackhouseSourceKernel";
import { stepWatsonRemoteCenterComplianceTopology } from "./watsonRemoteCenterComplianceKernel";
import {
  readWattCondenserControls,
  stepWattCondenser,
  WATT_CONTROL_RANGES,
} from "./wattCondenserKernel";
import { readWrightControls, stepWrightFlyerSi } from "./wrightKernel";

export interface SensitivityResult {
  metricName: string;
  derivativeSymbol: string;
  derivativeValue: number;
  derivativeUnit: string;
  interpretation: string;
}

/** Differentiate an admitted, unrounded kernel output. Refuse at a clamp,
 * discontinuity, or refused probe instead of displaying a fabricated slope. */
function kernelDerivative(
  value: number,
  minimum: number,
  maximum: number,
  probe: (value: number) => number | null,
): number | null {
  const h = Math.max(1, Math.abs(value)) * 1e-5;
  if (!Number.isFinite(value) || value - h < minimum || value + h > maximum) return null;
  const center = probe(value);
  const lower = probe(value - h);
  const upper = probe(value + h);
  if (center === null || lower === null || upper === null) return null;
  if (![center, lower, upper].every(Number.isFinite)) return null;
  const left = (center - lower) / h;
  const right = (upper - center) / h;
  if (Math.abs(left - right) > 1e-3 * Math.max(1e-6, Math.abs(left), Math.abs(right))) return null;
  return Number(((left + right) / 2).toPrecision(6));
}

/** Computes a local sensitivity of the specified model and control. */
export function computeParameterSensitivity(
  patentId: string,
  controlKey: string,
  params: Record<string, any>,
): SensitivityResult | null {
  if (Object.values(params).some((value) => typeof value === "number" && !Number.isFinite(value))) {
    return null;
  }
  switch (patentId) {
    case "us-821393-wright-flyer": {
      // Central finite differences over the live kernel. Probing through
      // readWrightControls keeps the Claim 18 rudder interlock in the loop:
      // with coupling ON the warp-induced adverse yaw is cancelled and the
      // chip honestly reads ~0 — toggle the coupling to see the gradient.
      const warpProbe = (warpDeg: number) =>
        stepWrightFlyerSi(readWrightControls({ ...params, wingWarp: warpDeg }));
      if (controlKey === "wingWarp" || controlKey === "wingWarpDeg") {
        const warp = params.wingWarp ?? params.wingWarpDeg ?? 5.0;
        const dYawDwarp = (warpProbe(warp + 0.5).netYawNm - warpProbe(warp - 0.5).netYawNm) / 1.0;
        return {
          metricName: "Adverse Yaw Moment",
          derivativeSymbol: "∂N / ∂δ_warp",
          derivativeValue: Number(dYawDwarp.toFixed(2)),
          derivativeUnit: "N·m / deg",
          interpretation:
            "Central difference of the live kernel. With the Claim 18 rudder interlock engaged the residual gradient is ~0; uncoupled it shows the raw adverse-yaw gradient.",
        };
      }
      if (controlKey === "airspeed" || controlKey === "airspeedKts") {
        const mph = params.airspeed ?? 28.0;
        const liftProbe = (airspeedMph: number) =>
          stepWrightFlyerSi(readWrightControls({ ...params, airspeed: airspeedMph }));
        const dLiftDv = (liftProbe(mph + 0.5).liftNewtons - liftProbe(mph - 0.5).liftNewtons) / 1.0;
        return {
          metricName: "Aerodynamic Lift",
          derivativeSymbol: "∂L / ∂V",
          derivativeValue: Number(dLiftDv.toFixed(1)),
          derivativeUnit: "N / mph",
          interpretation: "Dynamic pressure lift growth scaling with velocity squared.",
        };
      }
      break;
    }

    case "us-381968-tesla-motor": {
      const freq = params.frequency ?? params.frequencyHz ?? 60;
      const acHum = params.acHum ?? 1;

      if (
        !Number.isFinite(freq) ||
        freq < 20 ||
        freq > 120 ||
        !Number.isFinite(acHum) ||
        acHum < 0 ||
        acHum > 1
      ) {
        return null;
      }

      if (controlKey === "frequency" || controlKey === "frequencyHz") {
        // Fig. 9's source relation: one generator revolution advances the
        // magnetic attraction once around ring R.
        const dGeneratorRpm_df = 60;
        return {
          metricName: "Generator Rotation",
          derivativeSymbol: "∂n_G / ∂f",
          derivativeValue: dGeneratorRpm_df,
          derivativeUnit: "RPM / Hz",
          interpretation: "Each generator cycle advances the Fig. 9 pole-shift relation once.",
        };
      }
      break;
    }

    case "us-223898-edison-lightbulb":
    case "us-223898-edison-lamp": {
      const v = params.voltage ?? params.mainsVoltageV ?? 110;
      const r = params.hotResistanceOhm ?? EDISON_DECLARED_HOT_RESISTANCE_OHM;
      if (r < EDISON_SOURCE_MIN_RESISTANCE_OHM || r > EDISON_SOURCE_MAX_RESISTANCE_OHM) return null;
      const state = stepEdisonRadiativeBalance({
        voltageV: v,
        hotResistanceOhm: r,
        filamentLengthCm: params.filamentLength ?? EDISON_DECLARED_FILAMENT_LENGTH_CM,
      });
      if (!state) return null;
      if (controlKey === "mainsVoltageV" || controlKey === "voltage") {
        return {
          metricName: "Filament Joule Heat",
          derivativeSymbol: "∂P / ∂V",
          derivativeValue: Number((2 * state.current_a).toPrecision(6)),
          derivativeUnit: "W / V",
          interpretation:
            "Analytic ∂P/∂V = 2V/R at the current hot resistance, from the shared steady radiative model. Resistance is held fixed; this is not a transient heating rate.",
        };
      }
      if (controlKey === "hotResistanceOhm") {
        return {
          metricName: "Filament Joule Heat",
          derivativeSymbol: "∂P / ∂R",
          derivativeValue: Number((-state.joule_power_w / r).toPrecision(6)),
          derivativeUnit: "W / Ω",
          interpretation:
            "Analytic ∂P/∂R = −V²/R² at the current voltage in the shared steady radiative model. At a source-range endpoint this is the admitted one-sided slope.",
        };
      }
      break;
    }

    case "us-2495429-spencer-microwave": {
      const rf = params.rfPowerSetting ?? 1;
      const va = params.anodeVoltage ?? params.anodeVoltageVolts ?? 2200.0;

      if (
        !Number.isFinite(rf) ||
        rf < 0 ||
        rf > 1 ||
        !Number.isFinite(va) ||
        va < 500 ||
        va > 5000
      ) {
        return null;
      }

      if (controlKey === "anodeVoltage" || controlKey === "anodeVoltageVolts") {
        // Hull cutoff field sensitivity: B_c ~ sqrt(V_a) -> dBc/dVa = B_c / (2 * V_a)
        const bc = 1350.0 * Math.sqrt(va / 2200.0);
        const dBc_dva = bc / (2 * va);
        return {
          metricName: "Hull Cutoff Field",
          derivativeSymbol: "∂B_c / ∂V_a",
          derivativeValue: Number(dBc_dva.toFixed(3)),
          derivativeUnit: "Gauss / V",
          interpretation:
            "Magnetic field threshold required to maintain magnetron electron wheel cutoff.",
        };
      }
      if (controlKey === "rfPowerSetting") {
        return {
          metricName: "Waveguide Energy-Path Display",
          derivativeSymbol: "∂q_{path} / ∂u_{reader}",
          derivativeValue: 1,
          derivativeUnit: "display fraction / reader-control fraction",
          interpretation:
            "This is only the source-diagram path visibility state for oscillators 10 and 11, common guide 23, and conveyor 28. US 2,495,429 prints no RF wattage, tube voltage, or food-heating rate.",
        };
      }
      break;
    }

    case "us-135245-pasteur-fermentation": {
      const co2 = params.co2SweepPct ?? 100;
      const spray = params.sprayCoveragePct ?? 100;
      const temp = params.wortTempC ?? 21.25;

      if (
        !Number.isFinite(co2) ||
        co2 < 0 ||
        co2 > 100 ||
        !Number.isFinite(spray) ||
        spray < 0 ||
        spray > 100 ||
        !Number.isFinite(temp) ||
        temp < 20 ||
        temp > 22.5
      ) {
        return null;
      }

      if (controlKey === "co2SweepPct" || controlKey === "sprayCoveragePct") {
        return {
          metricName:
            controlKey === "co2SweepPct" ? "CO₂ Sweep Reader State" : "Spray Reader State",
          derivativeSymbol: "∂q_{reader} / ∂u_{reader}",
          derivativeValue: 1,
          derivativeUnit: "% displayed / % reader control",
          interpretation:
            "Identity slope of the source-sequence reader aid. It is not a fermentation, heat-transfer, gas-flow, or cooling-rate derivative because US 135,245 does not print the needed operating quantities.",
        };
      }
      if (controlKey === "wortTempC") {
        return {
          metricName: "Printed Yeast-Addition Temperature",
          derivativeSymbol: "∂T_{display} / ∂T_{reader}",
          derivativeValue: 1,
          derivativeUnit: "°C displayed / °C reader control",
          interpretation:
            "Identity display relation over Pasteur's printed 20–22.5 °C yeast-addition band; it does not assert a process temperature trajectory.",
        };
      }
      break;
    }

    case "us-233692-pelton-water-wheel": {
      const flow = params.sourceFlowVisible ?? 1;
      const claim1 = params.claim1Active ?? 1;

      if (
        !Number.isFinite(flow) ||
        flow < 0 ||
        flow > 1 ||
        !Number.isFinite(claim1) ||
        claim1 < 0 ||
        claim1 > 1
      ) {
        return null;
      }

      if (controlKey === "sourceFlowVisible" || controlKey === "claim1Active") {
        return {
          metricName:
            controlKey === "sourceFlowVisible"
              ? "Source Water-Path Visibility"
              : "Claim 1 Geometry Visibility",
          derivativeSymbol: "∂q_{diagram} / ∂u_{reader}",
          derivativeValue: 1,
          derivativeUnit: "display fraction / reader-control fraction",
          interpretation:
            "Identity slope for a source-diagram state only. The grant prints no head, flow, speed, force, efficiency, or output from which turbine performance sensitivity could be derived.",
        };
      }
      break;
    }

    case "us-2981877-noyce-ic": {
      const controls = readNoycePlanarLeadControls(params);
      if (controlKey === "oxideThicknessUm") {
        return {
          metricName: "Displayed Oxide Thickness",
          derivativeSymbol: "∂t_{oxide,display} / ∂t_{oxide,reader}",
          derivativeValue: 1,
          derivativeUnit: "µm / µm",
          interpretation:
            "Identity slope for the source-example geometry control only; the grant does not license an electrical-performance derivative.",
        };
      }
      if (controlKey === "leadStripWidthFraction") {
        return {
          metricName: "Displayed Lead Width Fraction",
          derivativeSymbol: "∂w_{display} / ∂w_{reader}",
          derivativeValue: controls.leadStripWidthFraction > 0 ? 1 : 0,
          derivativeUnit: "fraction / fraction",
          interpretation:
            "Identity slope for the normalized drawing geometry only; no resistance, capacitance, delay, or power sensitivity is inferred.",
        };
      }
      break;
    }

    case "us-3138743-kilby-integrated-circuit": {
      if (controlKey === "sectionRevealFraction") {
        return {
          metricName: "Displayed Semiconductor Section Reveal",
          derivativeSymbol: "∂s_{display} / ∂s_{reader}",
          derivativeValue: 1,
          derivativeUnit: "fraction / fraction",
          interpretation:
            "Identity slope for the normalized section-view control only; no electrical performance sensitivity is inferred.",
        };
      }
      if (controlKey === "wireArchFraction") {
        return {
          metricName: "Displayed Wire 70 Arch",
          derivativeSymbol: "∂h_{display} / ∂h_{reader}",
          derivativeValue: 1,
          derivativeUnit: "fraction / fraction",
          interpretation:
            "Identity slope for the normalized drawing geometry only; both bond endpoints remain fixed and no wire inductance or delay is inferred.",
        };
      }
      break;
    }

    case "us-2708656-fermi-reactor": {
      const rod =
        params.rodWithdrawal ?? params.controlRodWithdrawalPct ?? params.rodPosition ?? 83.5;
      const moderatorPurity = params.moderatorPurity ?? 99.5;
      const claim1 = params.claim1Active ?? 1;

      if (
        !Number.isFinite(rod) ||
        rod < 0 ||
        rod > 100 ||
        !Number.isFinite(moderatorPurity) ||
        moderatorPurity < 95 ||
        moderatorPurity > 100 ||
        !Number.isFinite(claim1) ||
        claim1 < 0 ||
        claim1 > 1
      ) {
        return null;
      }

      const isClaim1Active = claim1 >= 0.5;

      if (
        controlKey === "rodWithdrawal" ||
        controlKey === "controlRodWithdrawalPct" ||
        controlKey === "rodPosition"
      ) {
        if (!isClaim1Active) {
          return {
            metricName: "Normalized Multiplication Lens",
            derivativeSymbol: "∂k_eff / ∂x_absorber",
            derivativeValue: 0,
            derivativeUnit: "k / % normalized travel",
            interpretation:
              "Absorber rod movement produces zero neutron multiplication sensitivity when the Claim 1 natural-uranium lattice is withheld.",
          };
        }
        const lower = Math.max(0, rod - 0.5);
        const upper = Math.min(100, rod + 0.5);
        const dKeffDx =
          upper > lower
            ? (fermiKeff(upper, moderatorPurity) - fermiKeff(lower, moderatorPurity)) /
              (upper - lower)
            : 0;
        return {
          metricName: "Normalized Multiplication Lens",
          derivativeSymbol: "∂k_eff / ∂x_absorber",
          derivativeValue: Number(dKeffDx.toFixed(6)),
          derivativeUnit: "k / % normalized travel",
          interpretation:
            "Central difference over the same explicitly normalized absorber lens used by the visual. It is not a source-calibrated cadmium worth curve.",
        };
      }
      if (controlKey === "claim1Active") {
        return {
          metricName: "Claim 1 Lattice Geometry Visibility",
          derivativeSymbol: "∂q_{lattice} / ∂u_{claim}",
          derivativeValue: 1,
          derivativeUnit: "topology fraction / claim fraction",
          interpretation:
            "Discrete topological gating of the natural-uranium and graphite multiplying structure under Claim 1.",
        };
      }
      break;
    }
    case "us-3858232-boyle-smith-ccd": {
      // The issued grant discloses a three-conductor sequence and the
      // Figure 3 overlap inequality, but not the geometry, doping,
      // capacitance, mobility, operating voltage, or clock frequency needed
      // for a physical derivative. A discontinuous topology/timing admission
      // boundary is not misrepresented as an SI sensitivity.
      break;
    }

    case "us-3633-goodyear-rubber": {
      const vulcanTemp = params.vulcanTemp ?? 145;
      const sulfurPct = params.sulfurPct ?? 8;
      const specimenTempC = params.specimenTempC ?? 35;
      const lambda = params.appliedTensileStretch ?? params.stretch ?? 1.8;

      if (
        !Number.isFinite(vulcanTemp) ||
        vulcanTemp < 90 ||
        vulcanTemp > 220 ||
        !Number.isFinite(sulfurPct) ||
        sulfurPct < 0 ||
        sulfurPct > 35 ||
        !Number.isFinite(specimenTempC) ||
        specimenTempC < -40 ||
        specimenTempC > 120 ||
        !Number.isFinite(lambda) ||
        lambda < 1.0 ||
        lambda > 2.5
      ) {
        return null;
      }

      const rubber = stepGoodyearRubber(vulcanTemp, sulfurPct, 30, lambda, specimenTempC);

      if (controlKey === "appliedTensileStretch" || controlKey === "stretch") {
        return {
          metricName: "Nominal Stress (Model)",
          derivativeSymbol: "∂P_nom / ∂λ",
          derivativeValue: Number(rubber.stressSlopeMpaPerStretch.toPrecision(6)),
          derivativeUnit: "MPa / λ",
          interpretation:
            "Local slope of the shared illustrative stress model at the current cure temperature, sulfur content and stretch; the cure duration is the declared 30 minutes. The model's strength coefficient is held fixed. At λ = 1 or 2.5 this is the admitted one-sided slope, not a measured material modulus.",
        };
      }
      if (controlKey === "sulfurPct" || controlKey === "sulfur") {
        return {
          metricName: "Relative Cross-Link Density",
          derivativeSymbol: "∂X_link / ∂%_sulfur",
          derivativeValue: Number(rubber.relativeCrossLinkSlopePerSulfurPct.toPrecision(6)),
          derivativeUnit: "ratio / %",
          interpretation:
            "Disulfide bridge density scaling with sulfur compounding fraction under 30-minute thermal cure kinetics.",
        };
      }
      break;
    }

    case "us-3671542-kwolek-kevlar":
      // The checked claims identify composition conditions, but not a
      // quantitative spinning or finished-fiber response. A derivative would
      // turn withheld source material into a performance assertion.
      return null;

    case "us-1102653-goddard-rocket": {
      if (controlKey === "tubeLengthRatio") {
        return {
          metricName: "Claim 2 Ratio Margin",
          derivativeSymbol: "∂(L/D - 3) / ∂(L/D)",
          derivativeValue: 1,
          derivativeUnit: "ratio / ratio",
          interpretation:
            "The printed Claim 2 margin changes one-for-one with the declared tapered-tube length-to-diameter ratio.",
        };
      }
      if (controlKey === "primarySpinRpm" || controlKey === "gyroSpinRpm") {
        return {
          metricName:
            controlKey === "primarySpinRpm"
              ? "Primary Angular Velocity"
              : "Gyroscope Angular Velocity",
          derivativeSymbol: "∂ω / ∂N",
          derivativeValue: Number(((2 * Math.PI) / 60).toFixed(6)),
          derivativeUnit: "rad/s / rpm",
          interpretation:
            "Exact revolutions-per-minute to radians-per-second conversion; the source prints no absolute spin rate.",
        };
      }
      break;
    }

    case "us-400766-hall-aluminium": {
      const current = params.currentAmperes ?? params.current ?? 300000.0;
      const tempC =
        params.bathTemperatureCelsius ?? params.temperatureCelsius ?? params.tempC ?? 960;
      const aluminaPct = params.aluminaConcentrationPct ?? params.aluminaPct ?? 5.5;

      if (
        !Number.isFinite(current) ||
        current < 100000 ||
        current > 500000 ||
        !Number.isFinite(tempC) ||
        tempC < 920 ||
        tempC > 1020 ||
        !Number.isFinite(aluminaPct) ||
        aluminaPct < 2 ||
        aluminaPct > 8.0
      ) {
        return null;
      }

      const hall = stepHallAluminium({
        currentAmperes: current,
        bathTemperatureCelsius: tempC,
        aluminaConcentrationPct: aluminaPct,
      });
      const key =
        controlKey === "current"
          ? "currentAmperes"
          : controlKey === "temperatureCelsius" || controlKey === "tempC"
            ? "bathTemperatureCelsius"
            : controlKey === "aluminaPct"
              ? "aluminaConcentrationPct"
              : controlKey;
      const slopes: Record<string, { value: number | null; symbol: string; unit: string }> = {
        currentAmperes: {
          value: hall.productionSlopeKgPerHourPerAmpere,
          symbol: "I",
          unit: "A",
        },
        bathTemperatureCelsius: {
          value: hall.productionSlopeKgPerHourPerCelsius,
          symbol: "T",
          unit: "°C",
        },
        aluminaConcentrationPct: {
          value: hall.productionSlopeKgPerHourPerAluminaPct,
          symbol: "c_Al₂O₃",
          unit: "wt% point",
        },
      };
      const slope = slopes[key];
      if (!slope || slope.value === null) return null;
      return {
        metricName: "Aluminium Production (Model)",
        derivativeSymbol: `∂ṁ_Al / ∂${slope.symbol}`,
        derivativeValue: Number(slope.value.toPrecision(6)),
        derivativeUnit: `kg / (h·${slope.unit})`,
        interpretation:
          "Local slope of the shared modern teaching cell's aluminium production before display rounding, holding the other controls fixed. Current efficiency follows the present temperature and alumina concentration; its coefficients are illustrative, not historic measurements. At a public range endpoint this is the admitted one-sided slope. No single slope is shown at the relevant efficiency knee (960 °C or 4 wt%).",
      };
    }

    case "gb-913-watt-separate-condenser": {
      const current: Record<string, number> = {
        ...params,
        boilerPressurePsi: params.boilerPressurePsi ?? params.boilerPressure ?? 3,
      };
      const controls = readWattCondenserControls(current);
      const key = controlKey === "boilerPressure" ? "boilerPressurePsi" : controlKey;
      if (key in WATT_CONTROL_RANGES) {
        const control = key as keyof typeof WATT_CONTROL_RANGES;
        const range = WATT_CONTROL_RANGES[control];
        const condenserPressure = control === "condenserTempC";
        const slope = kernelDerivative(
          current[control] ?? controls[control],
          range.min,
          range.max,
          (value) => {
            const state = stepWattCondenser({ ...controls, [control]: value });
            return condenserPressure ? state.condenserPressureAbsKpa : state.indicatedHorsepower;
          },
        );
        if (slope === null) return null;
        const units = {
          boilerPressurePsi: "psi",
          condenserTempC: "°C",
          cylinderBoreInches: "in",
          pistonStrokeFeet: "ft",
          strokesPerMinute: "spm",
        };
        const symbols = {
          boilerPressurePsi: "p_boiler",
          condenserTempC: "T",
          cylinderBoreInches: "bore",
          pistonStrokeFeet: "stroke",
          strokesPerMinute: "cadence",
        };
        return {
          metricName: condenserPressure
            ? "Condenser Saturation Pressure"
            : "Indicated Engine Power",
          derivativeSymbol: condenserPressure ? "∂p_condenser / ∂T" : `∂P / ∂${symbols[control]}`,
          derivativeValue: slope,
          derivativeUnit: `${condenserPressure ? "kPa" : "hp"} / ${units[control]}`,
          interpretation:
            "Local slope of the shared illustrative Watt/Newcomen model at the current dimensions, cadence, condenser and steam-jacket settings. Input clamps and nonsmooth boundaries have no displayed derivative.",
        };
      }
      if (key === "hasSeparateCondenser" || key === "hasSteamJacket") {
        const on = stepWattCondenser({ ...controls, [key]: true });
        const off = stepWattCondenser({ ...controls, [key]: false });
        const condenser = key === "hasSeparateCondenser";
        return {
          metricName: condenser
            ? "Condenser Indicated Power Change"
            : "Steam-Jacket Furnace Input Change",
          derivativeSymbol: condenser ? "ΔP_indicated (on − off)" : "ΔQ_furnace (on − off)",
          derivativeValue: Number(
            (condenser
              ? on.indicatedHorsepower - off.indicatedHorsepower
              : on.heatInputRateKw - off.heatInputRateKw
            ).toPrecision(6),
          ),
          derivativeUnit: condenser ? "hp" : "kW",
          interpretation:
            "Finite difference between enabled and disabled apparatus at the same declared operating point. This discrete comparison is not a continuous derivative or a historical measurement.",
        };
      }
      break;
    }

    case "us-194047-otto-engine": {
      const cr = params.compressionRatio ?? params.cr ?? 4.5;
      const rpm = params.engineRpm ?? params.rpm ?? 180;

      if (
        !Number.isFinite(cr) ||
        cr < 3.0 ||
        cr > 8.0 ||
        !Number.isFinite(rpm) ||
        rpm < 60 ||
        rpm > 320
      ) {
        return null;
      }

      const otto = stepOttoEngine({ engineRpm: rpm, compressionRatio: cr });
      if (controlKey === "compressionRatio" || controlKey === "cr") {
        return {
          metricName: "Thermal Efficiency (Air-Standard)",
          derivativeSymbol: "∂η / ∂r",
          derivativeValue: Number(otto.thermalEfficiencySlopePctPerRatio.toPrecision(6)),
          derivativeUnit: "% / ratio",
          interpretation:
            "Modern air-standard Otto-cycle sensitivity for the declared analysis ratio before display rounding, holding γ = 1.4 fixed. At public endpoints this is the admitted one-sided slope. It is an illustrative lens, not a measured efficiency or a numerical limitation printed by US 194,047.",
        };
      }
      if (controlKey === "engineRpm" || controlKey === "rpm") {
        return {
          metricName: "Brake Horsepower (Model)",
          derivativeSymbol: "∂P_brake / ∂N",
          derivativeValue: Number(otto.brakeHorsepowerSlopeHpPerRpm.toPrecision(6)),
          derivativeUnit: "hp / rpm",
          interpretation:
            "Linear speed scaling of brake horsepower in this illustrative model at the declared compression ratio, before display rounding.",
        };
      }
      break;
    }

    case "us-608969-parsons-turbine": {
      const routing = params.routing ?? params.pipingMode ?? 0;
      const reversing = params.reversing ?? params.astern ?? 0;
      const throttle = params.throttle ?? 0.8;

      if (
        !Number.isFinite(routing) ||
        routing < 0 ||
        routing > 2 ||
        !Number.isFinite(reversing) ||
        reversing < 0 ||
        reversing > 1 ||
        !Number.isFinite(throttle) ||
        throttle < 0 ||
        throttle > 1
      ) {
        return null;
      }

      if (controlKey === "routing" || controlKey === "pipingMode") {
        return {
          metricName: "Steam Flow Path & Staged Expansion",
          derivativeSymbol: "∂Route / ∂Piping",
          derivativeValue: 1.0,
          derivativeUnit: "topology",
          interpretation:
            "Selecting series routing extends the expansion train for cruising, while compound-parallel divides steam flow across multi-shaft turbines for full power.",
        };
      }
      if (controlKey === "reversing" || controlKey === "astern") {
        return {
          metricName: "Propulsion Direction",
          derivativeSymbol: "∂Dir / ∂Valve",
          derivativeValue: 1.0,
          derivativeUnit: "mode",
          interpretation:
            "Reversing valve routes steam to astern turbines X and Y while forward turbines turn in condenser vacuum.",
        };
      }
      if (controlKey === "throttle") {
        return {
          metricName: "Relative Steam Flow",
          derivativeSymbol: "∂m_dot / ∂Throttle",
          derivativeValue: 1.0,
          derivativeUnit: "% / throttle",
          interpretation:
            "Steam flow delivery scaling linearly with throttle setting across active turbine shafts.",
        };
      }
      break;
    }

    case "us-328710-parsons-turbine": {
      const rpm = params.rotorRpm ?? params.turbineRpm ?? params.rpm ?? 3000;
      const psi =
        params.inletPressurePsi ??
        (params.steamPressureBar !== undefined ? params.steamPressureBar * 14.5038 : undefined) ??
        params.pressure ??
        180;

      if (
        !Number.isFinite(rpm) ||
        rpm < 1000 ||
        rpm > 6000 ||
        !Number.isFinite(psi) ||
        psi < 60 ||
        psi > 300
      ) {
        return null;
      }

      const parsons = stepParsonsTurbine({
        rotorRpm: rpm,
        inletPressurePsi: psi,
      });

      if (controlKey === "rotorRpm" || controlKey === "turbineRpm" || controlKey === "rpm") {
        return {
          metricName: "Shaft Reaction Power",
          derivativeSymbol: "∂P / ∂N",
          derivativeValue: Number(parsons.shaftPowerSlopeKwPerRpm.toPrecision(6)),
          derivativeUnit: "kW / RPM",
          interpretation:
            "Turbine blading peripheral speed approaching optimal 0.5 steam velocity ratio.",
        };
      }
      if (controlKey === "inletPressurePsi" || controlKey === "pressure") {
        return {
          metricName: "Isentropic Enthalpy Drop",
          derivativeSymbol: "∂Δh / ∂P",
          derivativeValue: Number(parsons.enthalpySlopeKjKgPerPsi.toPrecision(6)),
          derivativeUnit: "kJ/kg / psi",
          interpretation: "Expanding steam pressure differential across reaction blading stages.",
        };
      }
      if (controlKey === "steamPressureBar") {
        return {
          metricName: "Isentropic Enthalpy Drop",
          derivativeSymbol: "∂Δh / ∂P",
          derivativeValue: Number(parsons.enthalpySlopeKjKgPerBar.toPrecision(6)),
          derivativeUnit: "kJ/kg / bar",
          interpretation: "Expanding steam pressure differential across reaction blading stages.",
        };
      }
      break;
    }

    case "us-1647-morse-telegraph": {
      const current = params.currentMa ?? params.lineCurrentMa ?? params.current ?? 65;
      const turns = params.wireTurns ?? 1200;
      const volts = params.lineVoltageV ?? params.lineVoltage ?? params.voltage ?? 24;
      const miles = params.lineLengthMiles ?? params.lineDistance ?? params.distanceMiles ?? 44;
      const wpm = params.wpmSpeed ?? params.wpm ?? 20;

      if (
        !Number.isFinite(current) ||
        current < 5 ||
        current > 300 ||
        !Number.isFinite(turns) ||
        turns < 200 ||
        turns > 5000 ||
        !Number.isFinite(volts) ||
        volts < 3 ||
        volts > 100 ||
        !Number.isFinite(miles) ||
        miles < 5 ||
        miles > 300 ||
        !Number.isFinite(wpm) ||
        wpm < 2 ||
        wpm > 60
      ) {
        return null;
      }

      const morse = stepMorseTelegraph({
        currentMa: current,
        wireTurns: turns,
        lineVoltageV: volts,
        lineLengthMiles: miles,
        wpmSpeed: wpm,
      });

      if (
        controlKey === "currentMa" ||
        controlKey === "lineCurrentMa" ||
        controlKey === "current"
      ) {
        return {
          metricName: "Relay Magnetomotive Force",
          derivativeSymbol: "∂F / ∂I_line",
          derivativeValue: Number(morse.magneticForceSlopeNPerMa.toPrecision(6)),
          derivativeUnit: "N / mA",
          interpretation: `Analytic derivative of electromagnetic pull force on armature ($F = \\mu_0 N^2 I^2 A / (2 g^2)$) at line excitation ${current} mA and ${turns} coil turns.`,
        };
      }
      if (controlKey === "wireTurns" || controlKey === "turns") {
        return {
          metricName: "Relay Magnetomotive Force",
          derivativeSymbol: "∂F / ∂N",
          derivativeValue: Number(morse.magneticForceSlopeNPerTurn.toPrecision(6)),
          derivativeUnit: "N / turn",
          interpretation: `Analytic derivative of electromagnetic pull force with respect to coil winding count at ${turns} turns and ${current} mA.`,
        };
      }
      if (
        controlKey === "lineVoltage" ||
        controlKey === "lineVoltageV" ||
        controlKey === "voltage"
      ) {
        return {
          metricName: "Loop Signal Current",
          derivativeSymbol: "∂I / ∂V",
          derivativeValue: Number(morse.ohmicCurrentSlopeMaPerV.toPrecision(6)),
          derivativeUnit: "mA / V",
          interpretation: `Ohm's law current sensitivity ($1 / R_\\text{total}$) driving the electromagnetic relay armature through ${miles} miles (${morse.loopResistanceOhms} Ω total loop).`,
        };
      }
      if (
        controlKey === "lineLengthMiles" ||
        controlKey === "lineDistance" ||
        controlKey === "distanceMiles"
      ) {
        return {
          metricName: "Signal Current Distance Attenuation",
          derivativeSymbol: "∂I / ∂x_line",
          derivativeValue: Number(morse.ohmicCurrentSlopeMaPerMile.toPrecision(6)),
          derivativeUnit: "mA / mi",
          interpretation: `Line attenuation rate with transmission distance (12.5 Ω/mi wire impedance) across ${miles} miles under ${volts} V supply.`,
        };
      }
      if (controlKey === "lineResistance" || controlKey === "resistance") {
        return {
          metricName: "Signal Current Attenuation",
          derivativeSymbol: "∂I / ∂R",
          derivativeValue: Number(morse.ohmicCurrentSlopeMaPerOhm.toPrecision(6)),
          derivativeUnit: "mA / Ω",
          interpretation: `Line attenuation rate as total circuit resistance increases (${morse.loopResistanceOhms} Ω total loop resistance).`,
        };
      }
      if (controlKey === "wpmSpeed" || controlKey === "wpm") {
        return {
          metricName: "Code Element Unit Duration",
          derivativeSymbol: "∂τ_unit / ∂WPM",
          derivativeValue: Number(morse.unitDurationSlopeMsPerWpm.toPrecision(6)),
          derivativeUnit: "ms / WPM",
          interpretation: `Morse timing element duration scaling inversely with words-per-minute transmission rate (τ = 1200 / WPM ms) at ${wpm} WPM.`,
        };
      }
      break;
    }

    case "us-124404-westinghouse-air-brake": {
      const pipe =
        params.trainPipePressure ??
        params.trainPipePressurePsi ??
        params.brakePipePressure ??
        params.pipePressure ??
        0;
      const res =
        params.reservoirPipePressure ??
        params.reservoirPipePressurePsi ??
        params.reservoirPressure ??
        90;
      const signal = params.signalPulsePressure ?? params.signalPulsePressurePsi ?? 0;

      if (
        !Number.isFinite(pipe) ||
        pipe < 0 ||
        pipe > 80 ||
        !Number.isFinite(res) ||
        res < 0 ||
        res > 100 ||
        !Number.isFinite(signal) ||
        signal < 0 ||
        signal > 2.5
      ) {
        return null;
      }

      if (
        controlKey === "trainPipePressure" ||
        controlKey === "trainPipePressurePsi" ||
        controlKey === "brakePipePressure" ||
        controlKey === "pipePressure"
      ) {
        return {
          metricName: "Brake Clamping Force",
          derivativeSymbol: "∂F_clamp / ∂P",
          derivativeValue: -125.0,
          derivativeUnit: "N / psi",
          interpretation:
            "Fail-safe negative gradient: dropping train pipe pressure vents auxiliary reservoir into brake cylinder.",
        };
      }
      if (
        controlKey === "reservoirPipePressure" ||
        controlKey === "reservoirPipePressurePsi" ||
        controlKey === "reservoirPressure"
      ) {
        return {
          metricName: "Stored Pneumatic Work",
          derivativeSymbol: "∂E / ∂P",
          derivativeValue: 276.0,
          derivativeUnit: "J / psi",
          interpretation:
            "Auxiliary reservoir pressure energy available for emergency brake application.",
        };
      }
      if (controlKey === "signalPulsePressure" || controlKey === "signalPulsePressurePsi") {
        return {
          metricName: "Signalling Index Graduation Rate",
          derivativeSymbol: "∂Index / ∂P_signal",
          derivativeValue: 2.0,
          derivativeUnit: "step / psi",
          interpretation:
            "Pneumatic signalling line pressure pulses advancing the cab dial index indicator.",
        };
      }
      break;
    }

    case "us-682690-hewitt-mercury-lamp": {
      const vMains = params.mainsVoltageV ?? params.voltage ?? 110;
      const rBallast = params.ballastResistanceOhms ?? params.ballast ?? 12;
      const lenCm = params.tubeLengthCm ?? params.tubeLength ?? 100;
      const diamMm = params.tubeDiameterMm ?? params.diameter ?? 25;

      if (
        !Number.isFinite(vMains) ||
        vMains < 60 ||
        vMains > 200 ||
        !Number.isFinite(rBallast) ||
        rBallast < 5 ||
        rBallast > 50 ||
        !Number.isFinite(lenCm) ||
        lenCm < 30 ||
        lenCm > 150 ||
        !Number.isFinite(diamMm) ||
        diamMm < 15 ||
        diamMm > 50
      ) {
        return null;
      }

      if (controlKey === "mainsVoltageV" || controlKey === "voltage") {
        return {
          metricName: "Arc Luminous Flux Output",
          derivativeSymbol: "∂Φ / ∂V_supply",
          derivativeValue: 18.5,
          derivativeUnit: "lm / V",
          interpretation:
            "Positive column gas discharge ionization and mercury spectral line excitation.",
        };
      }
      if (controlKey === "ballastResistanceOhms" || controlKey === "ballast") {
        const base = stepHewittMercuryLamp({
          mainsVoltageV: vMains,
          ballastResistanceOhms: rBallast,
          tubeLengthCm: lenCm,
          tubeDiameterMm: diamMm,
        });
        const delta = rBallast < 50 ? 1 : -1;
        const perturbed = stepHewittMercuryLamp({
          mainsVoltageV: vMains,
          ballastResistanceOhms: rBallast + delta,
          tubeLengthCm: lenCm,
          tubeDiameterMm: diamMm,
        });
        const dPhi_dR = Number(
          ((perturbed.luminousFluxLumens - base.luminousFluxLumens) / delta).toFixed(1),
        );
        return {
          metricName: "Ballast Luminous Flux Quenching",
          derivativeSymbol: "∂Φ / ∂R_ballast",
          derivativeValue: dPhi_dR,
          derivativeUnit: "lm / Ω",
          interpretation:
            "Series ballast resistance limits runaway negative-differential arc current, lowering equilibrium luminous flux.",
        };
      }
      if (controlKey === "tubeLengthCm" || controlKey === "tubeLength") {
        const base = stepHewittMercuryLamp({
          mainsVoltageV: vMains,
          ballastResistanceOhms: rBallast,
          tubeLengthCm: lenCm,
          tubeDiameterMm: diamMm,
        });
        return {
          metricName: "Positive Column Voltage Gradient",
          derivativeSymbol: "∂V_arc / ∂L_tube",
          derivativeValue: base.electricFieldVPerCm,
          derivativeUnit: "V / cm",
          interpretation:
            "Uniform electric field gradient in the ionized positive column across tube elongation.",
        };
      }
      if (controlKey === "arcCurrent" || controlKey === "current") {
        return {
          metricName: "Luminous Lobe Flux",
          derivativeSymbol: "∂Φ / ∂I",
          derivativeValue: 420.0,
          derivativeUnit: "lm / A",
          interpretation: "Plasma Townsend avalanche ionization photon generation per ampere.",
        };
      }
      break;
    }

    case "us-808897-carrier-air-conditioner": {
      const cfm = params.airflowCfm ?? params.airFlowCfm ?? 15000;
      const spray = params.sprayRatePct ?? 60;
      const faces = params.separatorFaces ?? 6;

      if (
        !Number.isFinite(cfm) ||
        cfm < 2000 ||
        cfm > 30000 ||
        !Number.isFinite(spray) ||
        spray < 10 ||
        spray > 100 ||
        !Number.isFinite(faces) ||
        faces < 2 ||
        faces > 12
      ) {
        return null;
      }

      if (controlKey === "airflowCfm" || controlKey === "airFlowCfm") {
        const dP_dCfm = Number((3.4212e-7 * cfm * faces).toFixed(5));
        return {
          metricName: "Separator Air Velocity & Pressure Loss",
          derivativeSymbol: "∂ΔP / ∂CFM",
          derivativeValue: dP_dCfm,
          derivativeUnit: "Pa / cfm",
          interpretation:
            "Dynamic pressure drop across sinuous separator plates scaling quadratically with airflow under the fluid impaction model.",
        };
      }
      const unclampedSeparation = (faces - 1) * 8.5 + spray * 0.18;
      const isSaturated = unclampedSeparation >= 99;

      if (controlKey === "sprayRatePct") {
        return {
          metricName: "Droplet Elimination Wet Spray Sensitivity",
          derivativeSymbol: "∂η / ∂Spray",
          derivativeValue: isSaturated ? 0 : 0.18,
          derivativeUnit: "% / %",
          interpretation: isSaturated
            ? "Droplet separation is saturated at maximum 99% capture limit across current plate geometry."
            : "Nozzle spray rate sensitivity contributing to fine particle and droplet capture across wet plate surfaces.",
        };
      }
      if (controlKey === "separatorFaces") {
        return {
          metricName: "Droplet Separation Efficiency",
          derivativeSymbol: "∂η / ∂Faces",
          derivativeValue: isSaturated ? 0 : 8.5,
          derivativeUnit: "% / face",
          interpretation: isSaturated
            ? "Droplet separation is saturated at maximum 99% capture limit across current plate geometry."
            : "Inertial droplet impact and capture per sinuous plate turn and drainage gutter.",
        };
      }
      break;
    }

    case "us-727650-linde-air-liquefaction": {
      const inletP = params.inletPressureAtm ?? params.throttlePressureBar ?? params.pressure ?? 75;
      const tCooler = params.coolerOutletC ?? params.coolerTempC ?? 10;

      if (
        !Number.isFinite(inletP) ||
        inletP < 50 ||
        inletP > 200 ||
        !Number.isFinite(tCooler) ||
        tCooler < -10 ||
        tCooler > 25
      ) {
        return null;
      }

      if (
        controlKey === "inletPressureAtm" ||
        controlKey === "throttlePressureBar" ||
        controlKey === "pressure"
      ) {
        return {
          metricName: "Joule-Thomson Throttling Drop",
          derivativeSymbol: "∂ΔT_JT / ∂P",
          derivativeValue: 0.23,
          derivativeUnit: "K / bar",
          interpretation: "Cryogenic isenthalpic expansion cooling gradient per bar pressure drop.",
        };
      }
      if (controlKey === "coolerOutletC" || controlKey === "coolerTempC") {
        return {
          metricName: "Pre-Cooler Temperature Sensitivity",
          derivativeSymbol: "∂T_exp / ∂T_cooler",
          derivativeValue: 0.85,
          derivativeUnit: "°C / °C",
          interpretation:
            "Regenerative counter-current approach temperature scaling with primary cooling water heat rejection.",
        };
      }
      break;
    }

    case "us-971501-haber-ammonia": {
      const pressure = params.pressureAtm ?? params.synthesisPressureBar ?? params.pressure ?? 175;
      const temp = params.temperatureCelsius ?? params.synthesisTempC ?? params.temperature ?? 530;
      const feedFlow = params.feedFlowRateMolesPerSec ?? params.feedFlow ?? 50;
      const activity = params.catalystActivity ?? params.activity ?? 1.0;

      if (
        !Number.isFinite(pressure) ||
        pressure < 50 ||
        pressure > 300 ||
        !Number.isFinite(temp) ||
        temp < 350 ||
        temp > 650 ||
        !Number.isFinite(feedFlow) ||
        feedFlow < 10 ||
        feedFlow > 150 ||
        !Number.isFinite(activity) ||
        activity < 0.5 ||
        activity > 2.0
      ) {
        return null;
      }

      const haber = stepHaberAmmonia({
        pressureAtm: pressure,
        temperatureCelsius: temp,
        feedFlowRateMolesPerSec: feedFlow,
        catalystActivity: activity,
      });

      if (controlKey === "pressureAtm" || controlKey === "pressure") {
        return {
          metricName: "Equilibrium Ammonia Yield",
          derivativeSymbol: "∂X_eq / ∂P",
          derivativeValue: Number(haber.equilibriumAmmoniaSlopePctPerAtm.toPrecision(6)),
          derivativeUnit: "% / atm",
          interpretation: "Le Chatelier pressure displacement toward 2NH₃ volume contraction.",
        };
      }
      if (controlKey === "synthesisPressureBar") {
        return {
          metricName: "Equilibrium Ammonia Yield",
          derivativeSymbol: "∂X_eq / ∂P",
          derivativeValue: Number(haber.equilibriumAmmoniaSlopePctPerBar.toPrecision(6)),
          derivativeUnit: "% / bar",
          interpretation: "Le Chatelier pressure displacement toward 2NH₃ volume contraction.",
        };
      }
      if (
        controlKey === "temperatureCelsius" ||
        controlKey === "synthesisTempC" ||
        controlKey === "temperature"
      ) {
        return {
          metricName: "Catalytic Reaction Rate",
          derivativeSymbol: "∂k_cat / ∂T",
          derivativeValue: Number(haber.kRateSlopePerCelsius.toPrecision(6)),
          derivativeUnit: "s⁻¹ / °C",
          interpretation: "Arrhenius activation rate acceleration over promoted iron catalyst.",
        };
      }
      if (controlKey === "feedFlowRateMolesPerSec" || controlKey === "feedFlow") {
        return {
          metricName: "Space Velocity Residence Time",
          derivativeSymbol: "∂τ_res / ∂F_feed",
          derivativeValue: Number(haber.spaceTimeSlopePerMolSec.toPrecision(6)),
          derivativeUnit: "s / (mol/s)",
          interpretation:
            "Increased feed flow shortens catalytic bed contact residence time, shifting reactor output toward kinetic limitation.",
        };
      }
      if (controlKey === "catalystActivity" || controlKey === "activity") {
        return {
          metricName: "Catalytic Turnover Frequency",
          derivativeSymbol: "∂TOF / ∂a_cat",
          derivativeValue: Number(haber.kRateSlopePerActivity.toPrecision(6)),
          derivativeUnit: "s⁻¹ / unit_activity",
          interpretation:
            "Linear scaling of active iron surface site turnover with promoter loading.",
        };
      }
      break;
    }

    case "us-2292387-lamarr-frequency-hopping": {
      const pos =
        params.recordPosition ?? params.position ?? params.activeChannels ?? params.channels ?? 0;
      const tone = params.commandTone ?? 100;

      if (
        !Number.isFinite(pos) ||
        pos < 0 ||
        pos > 88 ||
        !Number.isFinite(tone) ||
        tone < 50 ||
        tone > 1000
      ) {
        return null;
      }

      if (
        controlKey === "recordPosition" ||
        controlKey === "position" ||
        controlKey === "activeChannels" ||
        controlKey === "channels"
      ) {
        return {
          metricName: "Jamming Processing Gain",
          derivativeSymbol: "∂G_p / ∂N",
          derivativeValue: 0.22,
          derivativeUnit: "dB / channel",
          interpretation:
            "Spread-spectrum electronic counter-countermeasures immunity across 88 piano roll channels.",
        };
      }
      if (controlKey === "commandTone") {
        return {
          metricName: "Demodulated Filter Discrimination",
          derivativeSymbol: "∂Q / ∂f_tone",
          derivativeValue: 1.45,
          derivativeUnit: "dB / Hz",
          interpretation:
            "Acoustic filter selectivity separating steering and throttle guidance channels.",
        };
      }
      break;
    }

    case "us-2297691-carlson-electrophotography": {
      const corona = params.coronaVoltageKv ?? params.coronaVoltage ?? 6.5;
      const exposure = params.exposureLuxSec ?? params.exposure ?? 12;
      const thickness = params.layerThicknessUm ?? params.layerThickness ?? 30;
      const fuserTemp = params.fuserTemperatureC ?? params.fuserTemp ?? 185;

      if (
        !Number.isFinite(corona) ||
        corona < 4.0 ||
        corona > 8.0 ||
        !Number.isFinite(exposure) ||
        exposure < 0 ||
        exposure > 30 ||
        !Number.isFinite(thickness) ||
        thickness < 10 ||
        thickness > 60 ||
        !Number.isFinite(fuserTemp) ||
        fuserTemp < 120 ||
        fuserTemp > 220
      ) {
        return null;
      }

      if (controlKey === "coronaVoltageKv" || controlKey === "coronaVoltage") {
        return {
          metricName: "Surface Potential Build",
          derivativeSymbol: "∂V_s / ∂V_corona",
          derivativeValue: 95.0,
          derivativeUnit: "V / kV",
          interpretation: "Electrostatic scorotron ion charging of sulfur/selenium layer.",
        };
      }
      if (controlKey === "exposureLuxSec" || controlKey === "exposure") {
        return {
          metricName: "Photoconductive Discharge Sensitivity",
          derivativeSymbol: "∂V_latent / ∂H_exp",
          derivativeValue: -18.5,
          derivativeUnit: "V / (lx·s)",
          interpretation:
            "Photocarrier generation and transit collapsing electrostatic surface charge in illuminated areas.",
        };
      }
      if (controlKey === "layerThicknessUm" || controlKey === "layerThickness") {
        return {
          metricName: "Acceptance Potential Gradient",
          derivativeSymbol: "∂V_max / ∂d_layer",
          derivativeValue: 15.0,
          derivativeUnit: "V / µm",
          interpretation:
            "Dielectric layer breakdown voltage ceiling scaling with photoconductive sulfur/selenium film thickness.",
        };
      }
      if (controlKey === "fuserTemperatureC" || controlKey === "fuserTemp") {
        return {
          metricName: "Resin Toner Fixation Viscosity",
          derivativeSymbol: "∂η_melt / ∂T_fuser",
          derivativeValue: -0.025,
          derivativeUnit: "(Pa·s) / °C",
          interpretation:
            "Thermal softening and paper fiber penetration of resin toner under heated roller contact.",
        };
      }
      break;
    }

    case "us-2929922-townes-laser": {
      const cavityLengthCm = Number(params.cavityLengthCm ?? 10);
      const chamberDiameterCm = Number(params.chamberDiameterCm ?? 1);
      const endReflectivityPct = Number(params.endReflectivityPct ?? 97);
      const pumpExcitationPct = Number(params.pumpExcitationPct ?? 70);
      const modeApertureOpenPct = Number(params.modeApertureOpenPct ?? 55);
      const modulationFieldPct = Number(params.modulationFieldPct ?? 35);

      if (
        !Number.isFinite(cavityLengthCm) ||
        cavityLengthCm < 3 ||
        cavityLengthCm > 40 ||
        !Number.isFinite(chamberDiameterCm) ||
        chamberDiameterCm < 0.2 ||
        chamberDiameterCm > 5.0 ||
        !Number.isFinite(endReflectivityPct) ||
        endReflectivityPct < 50 ||
        endReflectivityPct > 100 ||
        !Number.isFinite(pumpExcitationPct) ||
        pumpExcitationPct < 0 ||
        pumpExcitationPct > 100 ||
        !Number.isFinite(modeApertureOpenPct) ||
        modeApertureOpenPct < 0 ||
        modeApertureOpenPct > 100 ||
        !Number.isFinite(modulationFieldPct) ||
        modulationFieldPct < 0 ||
        modulationFieldPct > 100
      ) {
        return null;
      }

      if (controlKey === "cavityLengthCm") {
        return {
          metricName: "Chamber Aspect Ratio",
          derivativeSymbol: "∂(L/D) / ∂L",
          derivativeValue: Number((1 / chamberDiameterCm).toFixed(3)),
          derivativeUnit: "ratio / cm",
          interpretation:
            "Exact geometry derivative for the reader-scaled chamber; the patent's illustrative chamber is about 10 cm long and 1 cm in diameter.",
        };
      }
      if (controlKey === "chamberDiameterCm") {
        return {
          metricName: "Chamber Aspect Ratio",
          derivativeSymbol: "∂(L/D) / ∂D",
          derivativeValue: Number((-cavityLengthCm / chamberDiameterCm ** 2).toFixed(3)),
          derivativeUnit: "ratio / cm",
          interpretation:
            "Exact geometry derivative only; no optical gain or output-power sensitivity is inferred.",
        };
      }
      if (controlKey === "endReflectivityPct") {
        return {
          metricName: "Two-End Round-Trip Reflectivity",
          derivativeSymbol: "∂(R²) / ∂R",
          derivativeValue: Number(((2 * endReflectivityPct) / 100).toFixed(3)),
          derivativeUnit: "% round-trip / % end reflectivity",
          interpretation:
            "Exact dimensionless bookkeeping for equal reader-selected end reflectivities; cavity loss and gain remain refused.",
        };
      }
      break;
    }

    case "us-3353115-maiman-ruby-laser":
    case "us-3353115-maiman-laser": {
      const pumpEnergy = Number(
        params.pumpEnergyJoules ?? params.pumpPowerWatts ?? params.pumpPower ?? 150,
      );
      const flashDuration = Number(params.flashDurationMs ?? 1.0);
      const rodLength = Number(params.rodLengthCm ?? 5.0);
      const outputReflectivity = Number(params.outputMirrorReflectivity ?? 0.92);
      const crystalTemp = Number(params.crystalTemperatureKelvin ?? params.temperatureK ?? 300);

      if (
        !Number.isFinite(pumpEnergy) ||
        pumpEnergy < 20 ||
        pumpEnergy > 1000 ||
        !Number.isFinite(flashDuration) ||
        flashDuration < 0.2 ||
        flashDuration > 10.0 ||
        !Number.isFinite(rodLength) ||
        rodLength < 1.0 ||
        rodLength > 25.0 ||
        !Number.isFinite(outputReflectivity) ||
        outputReflectivity < 0.5 ||
        outputReflectivity > 0.999 ||
        !Number.isFinite(crystalTemp) ||
        crystalTemp < 50 ||
        crystalTemp > 450
      ) {
        return null;
      }

      if (
        controlKey === "pumpPowerWatts" ||
        controlKey === "pumpPower" ||
        controlKey === "pumpEnergyJoules"
      ) {
        const slopeEfficiency = 0.015; // 1.5% optical slope efficiency
        return {
          metricName: "Laser Coherent Emission",
          derivativeSymbol: "∂P_out / ∂P_pump",
          derivativeValue: Number((slopeEfficiency * 1000).toFixed(1)),
          derivativeUnit: "mW / W",
          interpretation: "Stimulated emission quantum yield beyond lasing threshold.",
        };
      }
      if (controlKey === "crystalTemperatureKelvin" || controlKey === "temperatureK") {
        return {
          metricName: "R1 Line Emission Wavelength Shift",
          derivativeSymbol: "∂λ_emission / ∂T",
          derivativeValue: 0.005,
          derivativeUnit: "nm / K",
          interpretation:
            "Thermal expansion and crystal field lattice perturbation shifting the ruby R1 fluorescence line toward shorter wavelengths at cryogenic temperatures.",
        };
      }
      if (controlKey === "rodLengthCm") {
        const dMode_dL = Number((-8.523 / (rodLength * rodLength)).toFixed(3));
        return {
          metricName: "Resonator Longitudinal Mode Spacing Length Sensitivity",
          derivativeSymbol: "∂Δν_mode / ∂L",
          derivativeValue: dMode_dL,
          derivativeUnit: "GHz / cm",
          interpretation:
            "Fabry-Pérot longitudinal cavity mode frequency spacing variation with crystal rod resonator physical length.",
        };
      }
      if (controlKey === "outputMirrorReflectivity") {
        const dCavityLoss_dR = Number((-1 / (2 * rodLength * outputReflectivity)).toFixed(3));
        return {
          metricName: "Resonator Threshold Cavity Loss Coupling Sensitivity",
          derivativeSymbol: "∂γ_loss / ∂R_2",
          derivativeValue: dCavityLoss_dR,
          derivativeUnit: "cm⁻¹ / R",
          interpretation:
            "Sensitivity of threshold round-trip mirror coupling loss to output coupler reflectivity.",
        };
      }
      break;
    }

    case "us-x9430-colt-revolver": {
      if (controlKey === "cockingTravelPct") {
        const travel = Number(params.cockingTravelPct ?? 0);
        const lower = stepColtLockwork({ ...params, cockingTravelPct: travel - 0.5 });
        const upper = stepColtLockwork({ ...params, cockingTravelPct: travel + 0.5 });
        return {
          metricName: "Normalized Cylinder Advance",
          derivativeSymbol: "∂q_{cylinder} / ∂u_{cock}",
          derivativeValue: Number(
            (upper.cylinderAdvanceFraction - lower.cylinderAdvanceFraction).toFixed(3),
          ),
          derivativeUnit: "display-step / % display",
          interpretation:
            "Central difference of the shared source-order display coordinate; it is not a physical angle, time law, torque, or ballistic sensitivity.",
        };
      }
      break;
    }

    case "us-235199-bell-photophone": {
      const dist = params.transmissionDistanceM ?? 213;
      const spl = params.voiceSplDb ?? 75;
      const irr = params.solarIrradianceWPerM2 ?? params.beamPowerWatts ?? 950;
      const dia = params.collectorDiameterM ?? 0.5;

      if (
        !Number.isFinite(dist) ||
        dist < 5 ||
        dist > 1000 ||
        !Number.isFinite(spl) ||
        spl < 30 ||
        spl > 120 ||
        !Number.isFinite(irr) ||
        irr < 50 ||
        irr > 2000 ||
        !Number.isFinite(dia) ||
        dia < 0.1 ||
        dia > 2.0
      ) {
        return null;
      }

      if (
        controlKey === "solarIrradianceWPerM2" ||
        controlKey === "beamPowerWatts" ||
        controlKey === "beamPower"
      ) {
        return {
          metricName: "Selenium Photocell Responsivity",
          derivativeSymbol: "∂I_photo / ∂Φ",
          derivativeValue: 4.5,
          derivativeUnit: "µA / W",
          interpretation:
            "Photo-conductive modulation current generated across parabolic selenium receiver.",
        };
      }
      if (controlKey === "voiceSplDb") {
        return {
          metricName: "Diaphragm Optical Beam Divergence Modulation",
          derivativeSymbol: "∂θ_beam / ∂SPL",
          derivativeValue: 0.08,
          derivativeUnit: "mrad / dB",
          interpretation:
            "Acoustic mirror flexure altering specular light beam angular divergence and focus.",
        };
      }
      break;
    }

    case "us-586193-marconi-radio": {
      // Source-bounded fixed-step causal tape; quantitative RF link budget withheld.
      return null;
    }

    case "us-247804-delaval-separator": {
      const rpm = params.bowlRpm ?? params.rotorRpm ?? params.rpm ?? 6500;
      const flow = params.rawMilkFlowLph ?? params.feedRateLph ?? params.flow ?? 300;

      if (
        !Number.isFinite(rpm) ||
        rpm < 2000 ||
        rpm > 9000 ||
        !Number.isFinite(flow) ||
        flow < 100 ||
        flow > 600
      ) {
        return null;
      }

      const sep = stepDeLavalSeparator({ bowlRpm: rpm, rawMilkFlowLph: flow });

      if (controlKey === "bowlRpm" || controlKey === "rotorRpm" || controlKey === "rpm") {
        return {
          metricName: "Centrifugal Separation Force",
          derivativeSymbol: "∂G / ∂RPM",
          derivativeValue: Number(sep.gForceSlopeGPerRpm.toFixed(4)),
          derivativeUnit: "G / RPM",
          interpretation:
            "Stokes creaming centrifugal acceleration gradient scaling with bowl rotation speed under the rotating disc stack model.",
        };
      }
      if (
        controlKey === "rawMilkFlowLph" ||
        controlKey === "feedRateLph" ||
        controlKey === "flow"
      ) {
        return {
          metricName: "Continuous Cream Discharge Yield",
          derivativeSymbol: "∂Q_cream / ∂Q_milk",
          derivativeValue: sep.creamYieldSlopeLphPerLph,
          derivativeUnit: "(L/h) / (L/h)",
          interpretation:
            "Volumetric cream discharge partition fraction from incoming raw whole milk feed across inner annular weir.",
        };
      }
      break;
    }

    case "us-361931-daimler-engine": {
      if (controlKey === "shaftPosition") {
        return {
          metricName: "Sliding-Shaft Diagram Coordinate",
          derivativeSymbol: "∂q_{shaft} / ∂u_{selector}",
          derivativeValue: 1,
          derivativeUnit: "normalized display coordinate / selector unit",
          interpretation:
            "Identity slope for the source-described ahead/neutral/astern contact display. It is not a propeller speed, thrust, torque, or vessel-performance derivative.",
        };
      }
      if (controlKey === "coolingPumpEnabled") {
        return {
          metricName: "Cooling-Pump Path Visibility",
          derivativeSymbol: "∂q_{path} / ∂u_{selector}",
          derivativeValue: 1,
          derivativeUnit: "display fraction / selector fraction",
          interpretation:
            "Identity slope for the optional source-described pump path only. US 361,931 gives no cooling flow, temperature, hydraulic head, or heat-rejection data.",
        };
      }
      break;
    }

    case "us-307031-edison-indicator": {
      const polarity = params.plateBiasPolarity ?? 1;
      if (!Number.isFinite(polarity) || polarity < 0 || polarity > 1) {
        return null;
      }

      if (controlKey === "plateBiasPolarity") {
        return {
          metricName: "External-Connection Reader State",
          derivativeSymbol: "∂q_{circuit} / ∂u_{polarity}",
          derivativeValue: 1,
          derivativeUnit: "display selector / source-polarity selector",
          interpretation:
            "Identity relation for the historical circuit-side comparison. US 307,031 does not state voltage, current, temperature, vacuum pressure, or indicator sensitivity.",
        };
      }
      break;
    }

    case "us-319596-maxim-machine-gun": {
      const phase = params.cyclePhase ?? params.cyclePhaseDeg ?? 0;
      const impulse = params.gasImpulsePct ?? params.muzzleGasPressure ?? 50;

      if (
        !Number.isFinite(phase) ||
        phase < 0 ||
        phase > 360 ||
        !Number.isFinite(impulse) ||
        impulse < 0 ||
        impulse > 100
      ) {
        return null;
      }

      if (controlKey === "cyclePhase" || controlKey === "cyclePhaseDeg") {
        const thetaRad = (phase * Math.PI) / 180;
        const dx_dDeg = Number((((24 * Math.PI) / 180) * Math.sin(thetaRad)).toFixed(4));
        return {
          metricName: "Breech-Block Linear Travel",
          derivativeSymbol: "∂x_breech / ∂θ_crank",
          derivativeValue: dx_dDeg,
          derivativeUnit: "mm / deg",
          interpretation:
            "Scotch-yoke crankshaft kinematics driving breech-block translation throughout the recoil/re-cocking cycle.",
        };
      }
      if (controlKey === "gasImpulsePct" || controlKey === "muzzleGasPressure") {
        return {
          metricName: "Muzzle Sleeve Forward Impulse",
          derivativeSymbol: "∂p_sleeve / ∂P_gas",
          derivativeValue: 0.24,
          derivativeUnit: "mm / %",
          interpretation:
            "Forward thrust imparted to sliding sleeve l by expanding muzzle propellant gases.",
        };
      }
      break;
    }

    case "us-36836-gatling-gun": {
      const rpm = params.crankRpm ?? params.rpm ?? 60;
      const count = params.barrelCount ?? 6;

      if (
        !Number.isFinite(rpm) ||
        rpm < 20 ||
        rpm > 120 ||
        !Number.isFinite(count) ||
        count < 4 ||
        count > 10
      ) {
        return null;
      }

      if (controlKey === "crankRpm" || controlKey === "rpm") {
        return {
          metricName: "Cluster Cyclic Fire Rate",
          derivativeSymbol: "∂ROF / ∂CrankRPM",
          derivativeValue: count,
          derivativeUnit: "RPM / RPM",
          interpretation:
            "Mechanical rate multiplication from revolving barrel cluster cam tracks under the kinematic firing model.",
        };
      }
      if (controlKey === "barrelCount") {
        return {
          metricName: "Cluster Barrel Scaling",
          derivativeSymbol: "∂ROF / ∂N_barrels",
          derivativeValue: rpm,
          derivativeUnit: "rounds/min / barrel",
          interpretation:
            "Rate of fire increase per added barrel at the selected hand-crank rotation rate.",
        };
      }
      break;
    }

    case "us-593138-tesla-coil": {
      if (controlKey === "disturbanceFrequencyHz") {
        return {
          metricName: "Required Quarter-Wave Length",
          derivativeSymbol: "∂l_{1/4} / ∂f",
          derivativeValue: -50 / 925,
          derivativeUnit: "mi / Hz at 925 Hz",
          interpretation:
            "From l=v/(4f), increasing frequency shortens the required developed secondary length; this derivative uses Tesla's printed 185,000 mi/s example.",
        };
      }
      if (controlKey === "secondaryLengthMiles") {
        return {
          metricName: "Electrical Length",
          derivativeSymbol: "∂(βl) / ∂l",
          derivativeValue: 90 / 50,
          derivativeUnit: "deg / mi at 925 Hz",
          interpretation:
            "At the printed propagation speed and frequency, each additional mile adds 1.8 degrees of distributed-wave electrical length.",
        };
      }
      break;
    }

    case "us-613809-tesla-teleautomaton": {
      const pulseCount = params.pulseCount ?? 0;
      const rfFreq = params.rfFrequency ?? params.transmitterFreqKhz ?? 150;
      const rudder = params.rudderAngle ?? params.rudderAngleDeg ?? 0;
      const throttle = params.propellerThrottlePct ?? params.throttlePct ?? 75;

      if (
        !Number.isFinite(pulseCount) ||
        pulseCount < 0 ||
        pulseCount > 50 ||
        !Number.isFinite(rfFreq) ||
        rfFreq < 50 ||
        rfFreq > 500 ||
        !Number.isFinite(rudder) ||
        rudder < -45 ||
        rudder > 45 ||
        !Number.isFinite(throttle) ||
        throttle < 0 ||
        throttle > 100
      ) {
        return null;
      }

      if (controlKey === "rudderAngleDeg" || controlKey === "rudderAngle") {
        return {
          metricName: "Vessel Turning Rate",
          derivativeSymbol: "∂ω_turn / ∂θ_rudder",
          derivativeValue: 0.35,
          derivativeUnit: "deg/s / deg",
          interpretation:
            "Hydrodynamic rudder yaw turning moment from wireless pulse-stepped actuator.",
        };
      }
      if (
        controlKey === "propellerThrottlePct" ||
        controlKey === "throttlePct" ||
        controlKey === "throttle"
      ) {
        return {
          metricName: "Electric Propulsion Motor Thrust",
          derivativeSymbol: "∂T_thrust / ∂throttle",
          derivativeValue: 0.85,
          derivativeUnit: "N / %",
          interpretation:
            "Electric motor screw propeller thrust scaling with battery pulse throttle setting.",
        };
      }
      break;
    }

    case "us-706737-fessenden-wireless": {
      const fCarrier =
        params.carrierFrequencyKhz ?? params.carrierFreqKhz ?? params.carrierFreq ?? 75;
      const modPct = params.audioModulationPct ?? params.modDepthPct ?? params.modulation ?? 65;
      const lUh = params.antennaTuningUh ?? params.tuningUh ?? 450;
      const distKm = params.transmissionDistanceKm ?? params.distanceKm ?? 25;

      if (
        !Number.isFinite(fCarrier) ||
        fCarrier < 10 ||
        fCarrier > 200 ||
        !Number.isFinite(modPct) ||
        modPct < 0 ||
        modPct > 100 ||
        !Number.isFinite(lUh) ||
        lUh < 50 ||
        lUh > 1500 ||
        !Number.isFinite(distKm) ||
        distKm < 1 ||
        distKm > 200
      ) {
        return null;
      }

      if (
        controlKey === "carrierFrequencyKhz" ||
        controlKey === "carrierFreqKhz" ||
        controlKey === "carrierFreq"
      ) {
        return {
          metricName: "Alternator Frequency Scaling",
          derivativeSymbol: "∂f / ∂RPM",
          derivativeValue: 0.05,
          derivativeUnit: "kHz / RPM",
          interpretation:
            "High-frequency continuous wave generation via multi-pole Alexanderson alternator rotor.",
        };
      }
      if (
        controlKey === "audioModulationPct" ||
        controlKey === "modDepthPct" ||
        controlKey === "modulation"
      ) {
        return {
          metricName: "Audio Modulation Sideband Power",
          derivativeSymbol: "∂P_sideband / ∂m",
          derivativeValue: 12.5,
          derivativeUnit: "W / %",
          interpretation:
            "Voice amplitude modulation depth converting microphone acoustic signals to sideband energy.",
        };
      }
      if (
        controlKey === "transmissionDistanceKm" ||
        controlKey === "distanceKm" ||
        controlKey === "distance"
      ) {
        return {
          metricName: "Electrolytic Barretter Received RF Power Attenuation",
          derivativeSymbol: "∂P_rx / ∂d",
          derivativeValue: -0.048,
          derivativeUnit: "µW / km",
          interpretation:
            "Inverse-square path loss attenuation rate over transatlantic coastal transmission distances.",
        };
      }
      break;
    }

    case "us-879532-de-forest-audion": {
      const plateV = params.plateVoltageV ?? params.plateVoltage ?? 45;
      const gridV =
        params.gridBiasVoltageV ??
        params.gridBiasV ??
        params.gridVoltageV ??
        params.gridVoltage ??
        -1.5;
      const ifil = params.filamentCurrentA ?? params.filamentCurrent ?? 1.0;
      const rfIn = params.gridSignalAmplitudeMv ?? params.rfInputMv ?? 50;
      const rLoad = params.loadResistanceKOhms ?? params.loadResistance ?? 20;
      const claim1GridPresent =
        params.claim1GridPresent === undefined ? true : Number(params.claim1GridPresent) >= 0.5;

      if (
        !Number.isFinite(plateV) ||
        plateV < 5 ||
        plateV > 200 ||
        !Number.isFinite(gridV) ||
        gridV < -10.0 ||
        gridV > 5.0 ||
        !Number.isFinite(ifil) ||
        ifil < 0.2 ||
        ifil > 2.5 ||
        !Number.isFinite(rfIn) ||
        rfIn < 1 ||
        rfIn > 500 ||
        !Number.isFinite(rLoad) ||
        rLoad < 1 ||
        rLoad > 100
      ) {
        return null;
      }

      const audion = stepDeForestAudion({
        claim1GridPresent,
        plateVoltageV: plateV,
        gridBiasVoltageV: gridV,
        filamentCurrentA: ifil,
        gridSignalAmplitudeMv: rfIn,
        loadResistanceKOhms: rLoad,
      });

      if (
        controlKey === "gridVoltageV" ||
        controlKey === "gridVoltage" ||
        controlKey === "gridBiasVoltageV" ||
        controlKey === "gridBiasV"
      ) {
        if (!claim1GridPresent) {
          return {
            metricName: "Triode Transconductance (gm)",
            derivativeSymbol: "∂I_p / ∂V_g",
            derivativeValue: 0,
            derivativeUnit: "µS",
            interpretation:
              "Claim 1 interposed conducting grid is withheld; operating as two-electrode diode with zero grid control transconductance.",
          };
        }
        if (audion.vEffective <= 0) {
          return {
            metricName: "Triode Transconductance (gm)",
            derivativeSymbol: "∂I_p / ∂V_g",
            derivativeValue: 0,
            derivativeUnit: "µS",
            interpretation: `Tube is in cutoff ($V_\\text{eff} = ${audion.vEffective.toFixed(2)}$ V $\\le 0$); space charge cannot overcome negative grid barrier.`,
          };
        }
        return {
          metricName: "Triode Transconductance (gm)",
          derivativeSymbol: "∂I_p / ∂V_g",
          derivativeValue: Number(
            (
              audion.transconductanceSlopeMicroMhosPerV ?? audion.transconductanceMicroMhos
            ).toPrecision(6),
          ),
          derivativeUnit: "µS",
          interpretation: `Analytic transconductance ($1.5 k \\sqrt{V_\\text{eff}} \\cdot \\text{emissionFactor}$) at $V_g = ${gridV.toFixed(2)}$ V, $V_p = ${plateV}$ V, and $I_\\text{fil} = ${ifil.toFixed(2)}$ A.`,
        };
      }

      if (controlKey === "plateVoltageV" || controlKey === "plateVoltage") {
        if (!claim1GridPresent) {
          return {
            metricName: "Plate Dynamic Conductance",
            derivativeSymbol: "∂I_p / ∂V_p",
            derivativeValue: 0,
            derivativeUnit: "mA / V",
            interpretation:
              "Claim 1 interposed grid is withheld; no triode plate transconductance.",
          };
        }
        return {
          metricName: "Plate Dynamic Conductance",
          derivativeSymbol: "∂I_p / ∂V_p",
          derivativeValue: Number((audion.plateCurrentSlopeMaPerVPlate ?? 0).toPrecision(6)),
          derivativeUnit: "mA / V",
          interpretation: `Plate current sensitivity ($g_m / \\mu = 1 / r_p$) governed by perveance equation at current $V_p = ${plateV}$ V (amplification factor $\\mu = 12.0$).`,
        };
      }

      if (
        controlKey === "loadResistanceKOhms" ||
        controlKey === "loadResistance" ||
        controlKey === "loadResistanceKohm"
      ) {
        if (!claim1GridPresent) {
          return {
            metricName: "Stage Voltage Gain Sensitivity",
            derivativeSymbol: "∂A_v / ∂R_L",
            derivativeValue: 0,
            derivativeUnit: "(V/V) / kΩ",
            interpretation: "Claim 1 interposed grid is withheld; no voltage amplification gain.",
          };
        }
        return {
          metricName: "Stage Voltage Gain Sensitivity",
          derivativeSymbol: "∂A_v / ∂R_L",
          derivativeValue: Number((audion.stageGainSlopePerKohm ?? 0).toPrecision(6)),
          derivativeUnit: "(V/V) / kΩ",
          interpretation: `Analytic derivative of stage gain ($A_v = \\mu R_L / (r_p + R_L)$, $\\partial A_v / \\partial R_L = \\mu r_p / (r_p + R_L)^2$) with plate dynamic resistance $r_p = ${audion.plateResistanceKOhms}$ kΩ and load $R_L = ${rLoad}$ kΩ.`,
        };
      }

      if (controlKey === "filamentCurrentA" || controlKey === "filamentCurrent") {
        return {
          metricName: "Filament Heating Power Rate",
          derivativeSymbol: "∂P_fil / ∂I_fil",
          derivativeValue: Number((audion.filamentPowerSlopeWPerA ?? 0).toPrecision(6)),
          derivativeUnit: "W / A",
          interpretation: `Analytic Joule heating rate ($2 I_\\text{fil} R_\\text{fil}$) at current $I_\\text{fil} = ${ifil.toFixed(2)}$ A and declared 5.5 Ω filament cold/hot baseline.`,
        };
      }
      break;
    }

    case "us-942699-baekeland-bakelite": {
      const tempC = params.curingTempC ?? params.autoclaveTempC ?? params.temp ?? 150;
      const pressPsi = params.autoclavePressurePsi ?? params.pressure ?? 75;
      const catPct = params.catalystPct ?? params.catalyst ?? 1.5;
      const timeMin = params.curingTimeMin ?? params.curingTime ?? 60;

      if (
        !Number.isFinite(tempC) ||
        tempC < 110 ||
        tempC > 200 ||
        !Number.isFinite(pressPsi) ||
        pressPsi < 30 ||
        pressPsi > 150 ||
        !Number.isFinite(catPct) ||
        catPct < 0.5 ||
        catPct > 5.0 ||
        !Number.isFinite(timeMin) ||
        timeMin < 15 ||
        timeMin > 120
      ) {
        return null;
      }

      if (controlKey === "autoclavePressurePsi" || controlKey === "pressure") {
        return {
          metricName: "Polymer Void Suppression",
          derivativeSymbol: "∂Density / ∂P",
          derivativeValue: 0.0085,
          derivativeUnit: "(g/cm³) / psi",
          interpretation:
            "Bakelizer autoclave pressure preventing condensation bubble foaming during thermoset cure.",
        };
      }
      if (
        controlKey === "curingTempC" ||
        controlKey === "autoclaveTempC" ||
        controlKey === "temp"
      ) {
        return {
          metricName: "Crosslinking Kinetics Rate",
          derivativeSymbol: "∂k_crosslink / ∂T",
          derivativeValue: 0.065,
          derivativeUnit: "min⁻¹ / °C",
          interpretation:
            "Thermal activation accelerating phenol-formaldehyde 3D network resin solidification.",
        };
      }
      break;
    }

    case "us-6162-corliss-steam-engine": {
      const psi =
        params.steamPressurePsi ??
        params.boilerPressurePsi ??
        params.boilerPressure ??
        params.pressure ??
        100;
      const rpm = params.engineRpm ?? params.rpm ?? 65;
      const cutoff =
        params.cutoffPct ?? params.cutoff ?? params.cutoffPercentage ?? params.cutoffRatioPct ?? 25;

      if (
        !Number.isFinite(psi) ||
        psi < 40 ||
        psi > 180 ||
        !Number.isFinite(rpm) ||
        rpm < 30 ||
        rpm > 120 ||
        !Number.isFinite(cutoff) ||
        cutoff < 10 ||
        cutoff > 60
      ) {
        return null;
      }

      const corliss = stepCorlissEngine({
        steamPressurePsi: psi,
        engineRpm: rpm,
        cutoffPct: cutoff,
      });

      if (
        controlKey === "steamPressurePsi" ||
        controlKey === "boilerPressurePsi" ||
        controlKey === "boilerPressure" ||
        controlKey === "pressure"
      ) {
        return {
          metricName: "Indicated Cylinder Power",
          derivativeSymbol: "∂IHP / ∂P_boiler",
          derivativeValue: Number(corliss.ihpPressureSlopeHpPerPsiUnrounded.toFixed(2)),
          derivativeUnit: "HP / psi",
          interpretation:
            "Model-derived indicated power scaling with boiler admission pressure under the four-valve rotary cut-off expansion model. It is not a dynamometer reading printed in US 6,162.",
        };
      }
      if (controlKey === "engineRpm" || controlKey === "rpm") {
        return {
          metricName: "Flywheel Shaft Power",
          derivativeSymbol: "∂P / ∂RPM",
          derivativeValue: Number(corliss.ihpRpmSlopeHpPerRpmUnrounded.toFixed(2)),
          derivativeUnit: "HP / RPM",
          interpretation:
            "Model-derived power scaling of double-acting steam expansion with automatic trip cut-off. It is not a measured shop trial recorded in US 6,162.",
        };
      }
      if (
        controlKey === "cutoffPct" ||
        controlKey === "cutoff" ||
        controlKey === "cutoffPercentage" ||
        controlKey === "cutoffRatioPct"
      ) {
        return {
          metricName: "Expansion Thermal Efficiency",
          derivativeSymbol: "∂η_th / ∂Cutoff",
          derivativeValue: corliss.thermalEfficiencySlopePctPerPct,
          derivativeUnit: "% / %",
          interpretation:
            "Thermodynamic Rankine expansion sensitivity as cut-off stroke fraction varies under the modern teaching model. It is not a calibrated engine trial from US 6,162.",
        };
      }
      break;
    }

    case "us-2543181-land-polaroid": {
      const rawTime = params.developmentTimeSec ?? params.devTimeSec ?? params.time;
      if (rawTime !== undefined && (!Number.isFinite(rawTime) || rawTime < 0 || rawTime > 60)) {
        return null;
      }
      const rawExposure = params.exposureFraction ?? params.exposure;
      if (
        rawExposure !== undefined &&
        (!Number.isFinite(rawExposure) || rawExposure < 0 || rawExposure > 1)
      ) {
        return null;
      }
      const rawVisc = params.reagentViscosityCp ?? params.viscosity;
      if (
        rawVisc !== undefined &&
        (!Number.isFinite(rawVisc) || rawVisc < 1000 || rawVisc > 80000)
      ) {
        return null;
      }
      const rawGap = params.rollerGapUm ?? params.gap;
      if (rawGap !== undefined && (!Number.isFinite(rawGap) || rawGap < 10 || rawGap > 60)) {
        return null;
      }
      const rawPh = params.alkaliPh ?? params.ph;
      if (rawPh !== undefined && (!Number.isFinite(rawPh) || rawPh < 10.5 || rawPh > 13.8)) {
        return null;
      }

      const claim1Active =
        params.claim1Active !== undefined ? Number(params.claim1Active) >= 0.5 : true;

      if (
        controlKey === "developmentTimeSec" ||
        controlKey === "devTimeSec" ||
        controlKey === "time"
      ) {
        if (!claim1Active) {
          return {
            metricName: "Scenario Positive-Image Density",
            derivativeSymbol: "∂OD / ∂t_dev",
            derivativeValue: 0,
            derivativeUnit: "OD / s",
            interpretation: "Claim 1 attached product path is withheld; no image transfer occurs.",
          };
        }
        const time = rawTime ?? 30;
        const halfStep = 0.5;
        const lower = Math.max(0, time - halfStep);
        const upper = Math.min(60, time + halfStep);
        const lowState = stepLandPolaroidInstantFilm({
          ...params,
          developmentTimeSec: lower,
        });
        const highState = stepLandPolaroidInstantFilm({
          ...params,
          developmentTimeSec: upper,
        });
        return {
          metricName: "Scenario Positive-Image Density",
          derivativeSymbol: "∂OD / ∂t_dev",
          derivativeValue: Number(
            (
              (highState.positiveSilverDensity - lowState.positiveSilverDensity) /
              (upper - lower)
            ).toFixed(4),
          ),
          derivativeUnit: "OD / s",
          interpretation:
            "Finite difference over the declared modern diffusion-transfer teaching scenario; it is not a source-reported kinetic constant.",
        };
      }

      if (controlKey === "rollerGapUm" || controlKey === "gap") {
        if (!claim1Active) {
          return {
            metricName: "Scenario Diffusion Flux",
            derivativeSymbol: "∂J / ∂Gap",
            derivativeValue: 0,
            derivativeUnit: "(mol·m⁻²·s⁻¹) / µm",
            interpretation: "Claim 1 attached product path is withheld; no diffusion flux occurs.",
          };
        }
        const gap = rawGap ?? 25;
        const halfStep = 0.5;
        const lower = Math.max(10, gap - halfStep);
        const upper = Math.min(60, gap + halfStep);
        const lowState = stepLandPolaroidInstantFilm({ ...params, rollerGapUm: lower });
        const highState = stepLandPolaroidInstantFilm({ ...params, rollerGapUm: upper });
        return {
          metricName: "Scenario Diffusion Flux",
          derivativeSymbol: "∂J / ∂Gap",
          derivativeValue: Number(
            (
              (highState.diffusionFluxMolPerM2S - lowState.diffusionFluxMolPerM2S) /
              (upper - lower)
            ).toFixed(6),
          ),
          derivativeUnit: "(mol·m⁻²·s⁻¹) / µm",
          interpretation:
            "Finite difference of the declared Fickian teaching lens as its assumed layer gap changes; the patent supplies no calibrated gap.",
        };
      }

      if (controlKey === "exposureFraction" || controlKey === "exposure") {
        if (!claim1Active) {
          return {
            metricName: "Negative Silver Density",
            derivativeSymbol: "∂OD_neg / ∂E",
            derivativeValue: 0,
            derivativeUnit: "OD / fraction",
            interpretation:
              "Claim 1 attached product path is withheld; no negative development occurs.",
          };
        }
        const time = rawTime ?? 30;
        const ph = rawPh ?? 12.6;
        const phFactor = 10 ** (ph - 11.5);
        const kDev = 0.08 * (phFactor / (1 + phFactor));
        const negProgress = 1 - Math.exp(-kDev * time);
        return {
          metricName: "Negative Silver Density",
          derivativeSymbol: "∂OD_neg / ∂E",
          derivativeValue: Number((2.8 * negProgress).toFixed(4)),
          derivativeUnit: "OD / fraction",
          interpretation:
            "Linear rate of negative optical density generation with latent image exposure fraction under current development kinetics.",
        };
      }

      if (controlKey === "reagentViscosityCp" || controlKey === "viscosity") {
        if (!claim1Active) {
          return {
            metricName: "Reagent Diffusion Coefficient",
            derivativeSymbol: "∂D / ∂μ",
            derivativeValue: 0,
            derivativeUnit: "(m²·s⁻¹) / cP",
            interpretation:
              "Claim 1 attached product path is withheld; no reagent transport occurs.",
          };
        }
        const visc = rawVisc ?? 25000;
        const dD_dvisc = -3.0e-5 / (visc * visc);
        return {
          metricName: "Reagent Diffusion Coefficient",
          derivativeSymbol: "∂D / ∂μ",
          derivativeValue: Number(dD_dvisc.toExponential(4)),
          derivativeUnit: "(m²·s⁻¹) / cP",
          interpretation:
            "Stokes-Einstein reciprocal polymer viscosity derivative governing mobile silver-thiosulfate complex diffusion rate.",
        };
      }

      if (controlKey === "alkaliPh" || controlKey === "ph") {
        if (!claim1Active) {
          return {
            metricName: "Development Rate Constant",
            derivativeSymbol: "∂k_dev / ∂pH",
            derivativeValue: 0,
            derivativeUnit: "s⁻¹ / pH",
            interpretation:
              "Claim 1 attached product path is withheld; no active alkaline development occurs.",
          };
        }
        const ph = rawPh ?? 12.6;
        const u = 10 ** (ph - 11.5);
        const dk_dpH = (0.08 * u * Math.LN10) / (1 + u) ** 2;
        return {
          metricName: "Development Rate Constant",
          derivativeSymbol: "∂k_dev / ∂pH",
          derivativeValue: Number(dk_dpH.toFixed(5)),
          derivativeUnit: "s⁻¹ / pH",
          interpretation:
            "First derivative of hydroquinone dianion dissociation and redox activation rate with developer alkalinity.",
        };
      }
      break;
    }

    case "us-174465-bell-telephone": {
      const db = params.voiceAmplitude ?? 75;
      const freq = params.acousticFrequencyHz ?? 440;
      const gap = params.airGap ?? 0.35;
      const volts = params.batteryVoltage ?? 6;
      const cond = params.liquidConductivity ?? 1.2;

      if (
        !Number.isFinite(db) ||
        db < 40 ||
        db > 95 ||
        !Number.isFinite(freq) ||
        freq < 200 ||
        freq > 800 ||
        !Number.isFinite(gap) ||
        gap < 0.1 ||
        gap > 0.8 ||
        !Number.isFinite(volts) ||
        volts < 1 ||
        volts > 12 ||
        !Number.isFinite(cond) ||
        cond < 0.2 ||
        cond > 3
      ) {
        return null;
      }

      const bell = stepBellTelephone({
        voiceAmplitude: db,
        acousticFrequencyHz: freq,
        airGap: gap,
        batteryVoltage: volts,
        liquidConductivity: cond,
      });

      if (controlKey === "voiceAmplitude") {
        return {
          metricName: "Modulated Signal Current",
          derivativeSymbol: "∂I_mod / ∂SPL",
          derivativeValue: Number(bell.voiceSlopeMaPerDb.toPrecision(6)),
          derivativeUnit: "mA / dB",
          interpretation:
            "Local slope of modulated signal current with respect to voice sound pressure level under the shared variable-resistance transmitter model at the current diaphragm air gap. At 40 or 95 dB this is the admitted one-sided slope.",
        };
      }
      if (controlKey === "acousticFrequencyHz") {
        return {
          metricName: "Acoustic Angular Frequency",
          derivativeSymbol: "∂ω / ∂f_acoustic",
          derivativeValue: 6.283185,
          derivativeUnit: "rad·s⁻¹ / Hz",
          interpretation:
            "Exact derivative 2π relating cyclic acoustic frequency to angular frequency for the continuous undulatory sound wave.",
        };
      }
      if (controlKey === "airGap") {
        return {
          metricName: "Modulated Signal Current",
          derivativeSymbol: "∂I_mod / ∂gap",
          derivativeValue: Number(bell.gapSlopeMaPerMm.toPrecision(6)),
          derivativeUnit: "mA / mm",
          interpretation:
            "Inverse-gap gradient of modulated transduction current across the liquid-electrode gap.",
        };
      }
      break;
    }

    case "us-1781541-einstein-refrigerator": {
      const qIn = params.heatInput ?? 220;
      const press = params.totalPressure ?? 15.0;
      const nh3 = params.ammoniaRatio ?? params.auxiliaryGasRatio ?? 0.65;

      if (
        !Number.isFinite(qIn) ||
        qIn < 80 ||
        qIn > 500 ||
        !Number.isFinite(press) ||
        press < 6 ||
        press > 22 ||
        !Number.isFinite(nh3) ||
        nh3 < 0.4 ||
        nh3 > 0.9
      ) {
        return null;
      }

      const frige = stepEinsteinRefrigerator({
        heatInput: qIn,
        totalPressure: press,
        ammoniaRatio: nh3,
        claim1LiftPathPresent: params.claim1LiftPathPresent,
      });

      if (controlKey === "heatInput") {
        return {
          metricName: "Refrigeration Evaporator Duty",
          derivativeSymbol: "∂Q_evap / ∂Q_gen",
          derivativeValue: frige.cop,
          derivativeUnit: "W / W",
          interpretation: frige.operating
            ? `Evaporator cooling duty per unit generator heat input (effective cycle COP) under current admitted cycle state (P = ${frige.pressureAtm} atm, x_NH₃ = ${nh3}).`
            : "Cycle operation is refused because Claim 1 liquid-lift conduit is withheld; marginal cooling duty is 0 W / W.",
        };
      }

      if (controlKey === "totalPressure" || controlKey === "pressure") {
        return {
          metricName: "Evaporator Saturation Temperature",
          derivativeSymbol: "∂T_evap / ∂P_total",
          derivativeValue: frige.operating ? 1.4 : 0,
          derivativeUnit: "°C / atm",
          interpretation: frige.operating
            ? "Evaporator saturation temperature slope with system total pressure governed by Dalton partial pressure relations."
            : "Cycle operation is refused because Claim 1 liquid-lift conduit is withheld; marginal evaporator temperature slope is 0 °C / atm.",
        };
      }

      if (controlKey === "ammoniaRatio" || controlKey === "auxiliaryGasRatio") {
        return {
          metricName: "Evaporator Saturation Temperature",
          derivativeSymbol: "∂T_evap / ∂x_NH3",
          derivativeValue: frige.operating ? -18.0 : 0,
          derivativeUnit: "°C / (mole frac)",
          interpretation: frige.operating
            ? "Evaporator temperature depression gradient with ammonia mole fraction as refrigerant partial pressure increases."
            : "Cycle operation is refused because Claim 1 liquid-lift conduit is withheld; marginal temperature depression slope is 0 °C / (mole frac).",
        };
      }
      break;
    }

    case "us-1773980-farnsworth-tv": {
      const anodeV =
        params.anodeVoltage ?? (params.anodeKv !== undefined ? params.anodeKv * 1000 : 1500);
      const coilI = params.coilCurrent ?? params.deflectionCoilCurrent ?? 0.42;
      const lux = params.lightIntensityLux ?? params.lightIntensity ?? 500;
      const hFreq = params.horizontalFreqKhz ?? 15.75;
      const vFreq = params.verticalFreqHz ?? 60;
      const lines = params.scanLines ?? 60;
      const claim1ScanPathPresent =
        params.claim1ScanPathPresent === undefined
          ? true
          : Number(params.claim1ScanPathPresent) >= 0.5;

      if (
        !Number.isFinite(anodeV) ||
        anodeV < 500 ||
        anodeV > 6000 ||
        !Number.isFinite(coilI) ||
        coilI < 0.1 ||
        coilI > 1.0 ||
        !Number.isFinite(lux) ||
        lux < 0 ||
        lux > 2000 ||
        !Number.isFinite(hFreq) ||
        hFreq < 5 ||
        hFreq > 30 ||
        !Number.isFinite(vFreq) ||
        vFreq < 30 ||
        vFreq > 120 ||
        !Number.isFinite(lines) ||
        lines < 1 ||
        lines > 240
      ) {
        return null;
      }

      if (!claim1ScanPathPresent) {
        if (
          controlKey === "lightIntensityLux" ||
          controlKey === "lightIntensity" ||
          controlKey === "coilCurrent" ||
          controlKey === "deflectionCoilCurrent" ||
          controlKey === "anodeVoltage" ||
          controlKey === "anodeKv"
        ) {
          return {
            metricName: "Scanning Beam Telemetry",
            derivativeSymbol: "∂ / ∂c",
            derivativeValue: 0,
            derivativeUnit: "refused",
            interpretation:
              "Claim 1 electrical-image traversal is withheld; no raster telemetry or substitute scanning mechanism is inferred.",
          };
        }
      }

      const beam = FrankenSimEngine.stepFarnsworthTv(
        voltsToKv(anodeV),
        FrankenSimEngine.farnsworthDeflectionGauss(coilI),
        lux,
        lines,
        hFreq,
        vFreq,
      );

      if (controlKey === "lightIntensityLux" || controlKey === "lightIntensity") {
        return {
          metricName: "Photo-Dissector Video Current",
          derivativeSymbol: "∂I_video / ∂L_scene",
          derivativeValue: Number(beam.photocathodeCurrentSlopeUaPerLux.toPrecision(6)),
          derivativeUnit: "µA / Lux",
          interpretation:
            "Linear photoelectric conversion from continuous photocathode electron cloud emission under the admitted 0.045 µA/Lux quantum sensitivity model.",
        };
      }
      if (controlKey === "coilCurrent" || controlKey === "deflectionCoilCurrent") {
        return {
          metricName: "Magnetic Deflection Field Sensitivity",
          derivativeSymbol: "∂B / ∂I_coil",
          derivativeValue: Number(beam.magneticDeflectionSlopeGaussPerA.toPrecision(6)),
          derivativeUnit: "G / A",
          interpretation:
            "Deflection coil magnetic flux density scaling linearly with drive current (120 G at 0.42 A nominal; 285.71 G/A).",
        };
      }
      if (controlKey === "anodeVoltage") {
        return {
          metricName: "Electron Beam Velocity Acceleration Sensitivity",
          derivativeSymbol: "∂v / ∂V_anode",
          derivativeValue: Number(beam.electronVelocitySlopeKmSPerV.toPrecision(6)),
          derivativeUnit: "km·s⁻¹ / V",
          interpretation: `Relativistic electron beam velocity scaling with electrostatic anode accelerating potential ($v = \\sqrt{2 q V / m}$, $\\partial v / \\partial V = v / (2 V)$) at current $V_\\text{anode} = ${anodeV}$ V.`,
        };
      }
      if (controlKey === "anodeKv") {
        return {
          metricName: "Electron Beam Velocity Acceleration Sensitivity",
          derivativeSymbol: "∂v / ∂V_anode_kV",
          derivativeValue: Number(beam.electronVelocitySlopeKmSPerKv.toPrecision(6)),
          derivativeUnit: "km·s⁻¹ / kV",
          interpretation: `Relativistic electron beam velocity scaling per kilovolt ($v = \\sqrt{2 q V / m}$, $\\partial v / \\partial V_\\text{kV} = 1000 \\cdot v / (2 V)$) at current anode potential ${(anodeV / 1000).toFixed(2)} kV.`,
        };
      }
      break;
    }

    case "us-200521-edison-phonograph": {
      const rpm = params.mandrelRpm ?? params.rpm ?? 60;
      const vol = params.voiceVolumeDb ?? params.voiceVolume ?? 75;

      if (
        !Number.isFinite(rpm) ||
        rpm < 20 ||
        rpm > 200 ||
        !Number.isFinite(vol) ||
        vol < 20 ||
        vol > 130
      ) {
        return null;
      }

      if (controlKey === "mandrelRpm" || controlKey === "rpm") {
        return {
          metricName: "Groove Surface Linear Speed",
          derivativeSymbol: "∂v_linear / ∂RPM",
          derivativeValue: 0.0052,
          derivativeUnit: "m·s⁻¹ / RPM",
          interpretation:
            "Tangential foil speed dictating high-frequency recording fidelity and stylus track pitch.",
        };
      }
      if (controlKey === "voiceVolumeDb" || controlKey === "voiceVolume") {
        return {
          metricName: "Stylus Indentation Amplitude (Illustrative)",
          derivativeSymbol: "∂A_stylus / ∂SPL",
          derivativeValue: 0.000017,
          derivativeUnit: "mm / dB",
          interpretation:
            "Illustrative diaphragm acoustic deflection scaling with input sound pressure level.",
        };
      }
      break;
    }

    case "us-347140-thomson-welding": {
      if (controlKey === "weldCurrentAmps" || controlKey === "currentAmperes") {
        const current = params.weldCurrentAmps ?? params.currentAmperes ?? 4500;
        if (current < 1000 || current > 6000) return null;
        const weld = stepThomsonWelding({
          weldCurrentAmps: current,
          clampPressureMpa: params.clampPressureMpa,
        });
        return {
          metricName: "Interface Joule Heating Rate",
          derivativeSymbol: "∂P_joule / ∂I_weld",
          derivativeValue: Number(weld.jouleSlopeWattsPerAmp.toPrecision(6)),
          derivativeUnit: "W / A",
          interpretation:
            "Analytic slope 2IR of the shared illustrative Joule-heating model at the current amperage and declared 0.18 mΩ contact resistance. At 1,000 or 6,000 A this is the admitted one-sided slope. Pressure does not change resistance in this model.",
        };
      }
      if (controlKey === "clampPressureMpa") {
        const pressure = params.clampPressureMpa ?? 35;
        if (pressure < 10 || pressure > 60) return null;
        const weld = stepThomsonWelding({
          weldCurrentAmps: params.weldCurrentAmps ?? params.currentAmperes,
          clampPressureMpa: pressure,
        });
        return {
          metricName: "Upset Burr Width (Model)",
          derivativeSymbol: "∂w_burr / ∂p",
          derivativeValue: Number(weld.upsetSlopeMmPerMpa.toPrecision(6)),
          derivativeUnit: "mm / MPa",
          interpretation:
            "Local slope of the shared illustrative pressure-to-burr relation before display rounding. This is a declared geometry model, not a measured weld-strength or contact-resistance law; endpoints use the admitted one-sided slope.",
        };
      }
      break;
    }

    case "us-31128-otis-elevator": {
      if (controlKey === "displayRatePct") {
        return {
          metricName: "Declared Coordinate-Speed Magnitude",
          derivativeSymbol: "∂|dq_D/dt| / ∂r_display",
          derivativeValue: OTIS_DECLARED_MAX_DISPLAY_TRAVEL_PER_S / 100,
          derivativeUnit: "normalized coordinate·s⁻¹ / %",
          interpretation:
            "Sensitivity of the explicitly declared studio display rate. This is a normalized animation coordinate, not a historical speed, load, force, or stopping-distance claim.",
        };
      }
      break;
    }

    case "us-120057-gramme-dynamo": {
      const shaftRate = params.shaftRate ?? params.rate ?? 1.0;
      if (!Number.isFinite(shaftRate) || shaftRate < 0.4 || shaftRate > 1.6) {
        return null;
      }

      if (controlKey === "shaftRate" || controlKey === "rate") {
        return {
          metricName: "Continuous Generated DC Voltage",
          derivativeSymbol: "∂V_gen / ∂ω_shaft",
          derivativeValue: 1.25,
          derivativeUnit: "V / (rad·s⁻¹)",
          interpretation:
            "Linear Faraday induction voltage scaling across toroidal ring armature coils.",
        };
      }
      break;
    }

    case "us-588-ericsson-propeller": {
      const rpm = params.shaftRpm ?? params.rpm ?? 120;
      const pitchDeg = params.bladePitchAngleDeg ?? params.pitchDeg ?? 35;

      if (
        !Number.isFinite(rpm) ||
        rpm < 40 ||
        rpm > 240 ||
        !Number.isFinite(pitchDeg) ||
        pitchDeg < 20 ||
        pitchDeg > 55
      ) {
        return null;
      }

      const ericsson = stepEricssonPropeller({
        shaftRpm: rpm,
        bladePitchAngleDeg: pitchDeg,
      });

      if (controlKey === "shaftRpm" || controlKey === "rpm") {
        return {
          metricName: "Submerged Propeller Hydrodynamic Thrust",
          derivativeSymbol: "∂T / ∂RPM",
          derivativeValue: ericsson.thrustRpmSlopeKnPerRpm,
          derivativeUnit: "kN / RPM",
          interpretation:
            "Illustrative display model thrust sensitivity with shaft rotation speed. US 588 specifies contrary-turning shafts and 3-diameter spiral advance, not dynamometer thrust.",
        };
      }
      if (controlKey === "bladePitchAngleDeg" || controlKey === "pitchDeg") {
        const dPitchFactor_dDeg =
          (Math.cos((pitchDeg * Math.PI) / 180) * (Math.PI / 180)) / Math.sin((35 * Math.PI) / 180);
        const dThrust_dDeg = Number(((rpm / 120) ** 2 * 18 * dPitchFactor_dDeg).toFixed(4));
        return {
          metricName: "Propeller Hydrodynamic Thrust Pitch Sensitivity",
          derivativeSymbol: "∂T / ∂θ_pitch",
          derivativeValue: dThrust_dDeg,
          derivativeUnit: "kN / deg",
          interpretation:
            "Illustrative display model hydrodynamic thrust sensitivity to helical blade pitch angle. US 588 discloses spiral advance proportions rather than hydrofoil lift data.",
        };
      }
      break;
    }

    case "us-3237-rillieux-evaporator": {
      const feedRate =
        params.juiceFeedRateKgPerH ?? params.juiceFeedRate ?? params.feedRate ?? 10000;
      const initialBrix = params.initialBrixDeg ?? params.initialBrix ?? 14.0;
      const targetBrix = params.targetBrixDeg ?? params.targetBrix ?? 65.0;
      const nEffects = params.numberOfEffects ?? params.effects ?? 3;

      if (
        !Number.isFinite(feedRate) ||
        feedRate < 2000 ||
        feedRate > 25000 ||
        !Number.isFinite(initialBrix) ||
        initialBrix < 10 ||
        initialBrix > 20 ||
        !Number.isFinite(targetBrix) ||
        targetBrix < 50 ||
        targetBrix > 75 ||
        !Number.isFinite(nEffects) ||
        nEffects < 2 ||
        nEffects > 4
      ) {
        return null;
      }

      if (controlKey === "numberOfEffects" || controlKey === "effects") {
        return {
          metricName: "Steam Enthalpy Economy",
          derivativeSymbol: "∂Economy / ∂N_effects",
          derivativeValue: 0.88,
          derivativeUnit: "(kg evaporated/kg steam) / effect",
          interpretation:
            "Enthalpy reuse: each additional vacuum effect captures latent heat of previous stage vapor.",
        };
      }
      if (
        controlKey === "juiceFeedRateKgPerH" ||
        controlKey === "juiceFeedRate" ||
        controlKey === "feedRate"
      ) {
        const dEvap_dFeed = Number((1.0 - initialBrix / targetBrix).toFixed(4));
        return {
          metricName: "Water Evaporation Mass Flow Rate",
          derivativeSymbol: "∂m_evap / ∂m_feed",
          derivativeValue: dEvap_dFeed,
          derivativeUnit: "(kg/h) / (kg/h)",
          interpretation:
            "Linear mass conservation: dissolved sugar solids pass to syrup while water fraction is boiled off across stages.",
        };
      }
      break;
    }

    case "us-621195-zeppelin-airship": {
      const inflation = params.gasInflation ?? params.gasInflationPct ?? 95;
      const alt = params.flightAlt ?? params.altitudeM ?? 300;
      const speed = params.flightSpeedKnots ?? 28;
      const trimM = params.trimWeight ?? params.trimWeightPosM ?? 5;

      if (
        !Number.isFinite(inflation) ||
        inflation < 75 ||
        inflation > 100 ||
        !Number.isFinite(alt) ||
        alt < 0 ||
        alt > 2000 ||
        !Number.isFinite(speed) ||
        speed < 10 ||
        speed > 45 ||
        !Number.isFinite(trimM) ||
        trimM < -15 ||
        trimM > 15
      ) {
        return null;
      }

      const zep = stepZeppelinAirship({
        gasInflation: inflation,
        flightAlt: alt,
        flightSpeedKnots: speed,
        trimWeight: trimM,
      });

      if (controlKey === "gasInflation" || controlKey === "gasInflationPct") {
        return {
          metricName: "Gross Aerostatic Buoyant Lift",
          derivativeSymbol: "∂L_buoy / ∂%_inflation",
          derivativeValue: Number(zep.buoyantSlopeNPerPct.toPrecision(6)),
          derivativeUnit: "N / %",
          interpretation: `Archimedes aerostatic displacement: local air-hydrogen density differential at altitude ${alt} m over 11,300 m³ nominal envelope. Endpoints use the admitted one-sided slope.`,
        };
      }
      if (controlKey === "trimWeight" || controlKey === "trimWeightPosM") {
        return {
          metricName: "Longitudinal Pitch Trim",
          derivativeSymbol: "∂θ_pitch / ∂x_trim",
          derivativeValue: Number(zep.pitchTrimSlopeDegPerM.toPrecision(6)),
          derivativeUnit: "deg / m",
          interpretation:
            "Longitudinal trim angle variation per meter of keel running weight translation.",
        };
      }
      break;
    }

    case "us-3728480-baer-odyssey": {
      if (controlKey === "player1PotX" || controlKey === "player2PotX") {
        return {
          metricName: "Horizontal Spot Delay Time",
          derivativeSymbol: "∂τ_H / ∂R_pot",
          derivativeValue: 48.0,
          derivativeUnit: "µs / norm_pot",
          interpretation:
            "Monostable multivibrator RC charge timing shifts spot position across 53.5 µs active raster line.",
        };
      }
      if (controlKey === "player1PotY" || controlKey === "player2PotY") {
        return {
          metricName: "Vertical Field Delay Time",
          derivativeSymbol: "∂τ_V / ∂R_pot",
          derivativeValue: 14.0,
          derivativeUnit: "ms / norm_pot",
          interpretation:
            "Vertical monostable RC time delay translates spot down 15.42 ms active cathode ray field.",
        };
      }
      break;
    }

    case "us-4063220-metcalfe-ethernet": {
      const length = params.cableLengthMeters ?? params.cableLength ?? 500;
      const rate = params.dataRateMbps ?? params.dataRate ?? 2.94;
      const stations = params.stationCount ?? params.stations ?? 2;
      const load = params.offeredLoad ?? 0.5;
      const packetSize = params.packetSizeBytes ?? params.packetSize ?? 512;

      if (
        !Number.isFinite(length) ||
        length < 10 ||
        length > 1000 ||
        !Number.isFinite(rate) ||
        rate < 1.0 ||
        rate > 10.0 ||
        !Number.isFinite(stations) ||
        stations < 2 ||
        stations > 32 ||
        !Number.isFinite(load) ||
        load < 0.05 ||
        load > 2.5 ||
        !Number.isFinite(packetSize) ||
        packetSize < 64 ||
        packetSize > 1518
      ) {
        return null;
      }

      if (controlKey === "cableLengthMeters" || controlKey === "cableLength") {
        return {
          metricName: "One-Way Propagation Delay",
          derivativeSymbol: "∂τ_prop / ∂L",
          derivativeValue: 5.0,
          derivativeUnit: "ns / m",
          interpretation:
            "Electromagnetic wave velocity in polyethylene dielectric coaxial cable (0.66c) adds 5 ns latency per meter.",
        };
      }
      if (controlKey === "dataRateMbps" || controlKey === "dataRate") {
        return {
          metricName: "Manchester Bit Period",
          derivativeSymbol: "∂T_bit / ∂R",
          derivativeValue: -34.0,
          derivativeUnit: "ns / Mbps",
          interpretation:
            "Higher transmission bit rate shortens Manchester self-clocking bit intervals (100 ns at 10 Mbps).",
        };
      }
      if (controlKey === "offeredLoad") {
        return {
          metricName: "Channel Utilization Efficiency",
          derivativeSymbol: "∂η / ∂G",
          derivativeValue: -28.5,
          derivativeUnit: "% / norm_load",
          interpretation:
            "Increasing offered traffic load increases collision probability and backoff slot delays according to CSMA/CD contention dynamics.",
        };
      }
      break;
    }

    case "us-2318259-sikorsky-helicopter": {
      const coll = params.collectivePitchDeg ?? 6.8;
      const pitchStick = params.cyclicPitchForwardDeg ?? 0;
      const rollStick = params.cyclicRollRightDeg ?? 0;
      const pedal = params.tailRotorPedalPercent ?? 0;
      const throttle = params.engineThrottlePercent ?? 85;

      if (
        !Number.isFinite(coll) ||
        coll < 2 ||
        coll > 16 ||
        !Number.isFinite(pitchStick) ||
        pitchStick < -10 ||
        pitchStick > 10 ||
        !Number.isFinite(rollStick) ||
        rollStick < -10 ||
        rollStick > 10 ||
        !Number.isFinite(pedal) ||
        pedal < -100 ||
        pedal > 100 ||
        !Number.isFinite(throttle) ||
        throttle < 0 ||
        throttle > 100
      ) {
        return null;
      }

      const controls = readSikorskyControls(params);

      if (controlKey === "collectivePitchDeg") {
        const eps = 1e-3;
        const lo = Math.max(2, coll - eps);
        const hi = Math.min(16, coll + eps);
        const loThrust = stepSikorskyHelicopterSi(
          INITIAL_SIKORSKY_STATE,
          { ...controls, collectivePitchDeg: lo },
          1 / 60,
        ).metrics.mainRotorThrustNewtons;
        const hiThrust = stepSikorskyHelicopterSi(
          INITIAL_SIKORSKY_STATE,
          { ...controls, collectivePitchDeg: hi },
          1 / 60,
        ).metrics.mainRotorThrustNewtons;
        const slope = (hiThrust - loThrust) / (hi - lo);
        return {
          metricName: "Main Rotor Thrust",
          derivativeSymbol: "∂T_main / ∂θ_coll",
          derivativeValue: Number(slope.toFixed(1)),
          derivativeUnit: "N / deg",
          interpretation:
            "Momentum and blade-element aerodynamic lift slope at current rotor speed and ground-effect proximity. Endpoints use the admitted one-sided slope.",
        };
      }
      if (controlKey === "tailRotorPedalPercent") {
        const dYaw = controls.auxiliaryRotorEnabled ? -21.6 : 0;
        return {
          metricName: "Anti-Torque Yaw Moment",
          derivativeSymbol: "∂M_yaw / ∂pedal",
          derivativeValue: dYaw,
          derivativeUnit: "N·m / %",
          interpretation: controls.auxiliaryRotorEnabled
            ? "Deflecting tail rotor rudder pedals alters auxiliary propeller pitch, modulating lateral anti-torque thrust moment."
            : "Auxiliary tail rotor is disabled; yaw anti-torque pedal modulation is 0 N·m / %.",
        };
      }
      if (controlKey === "engineThrottlePercent") {
        const dRpm = controls.engineRunning ? 0.8 : 0;
        return {
          metricName: "Rotor Rotational Speed",
          derivativeSymbol: "∂Ω / ∂throttle",
          derivativeValue: dRpm,
          derivativeUnit: "RPM / %",
          interpretation: controls.engineRunning
            ? "Correlated target rotor RPM sensitivity with engine throttle under mechanical governor law."
            : "Engine is shut down (autorotation); engine throttle sensitivity is 0 RPM / %.",
        };
      }
      break;
    }

    case "us-4136359-wozniak-apple": {
      const f = params.crystalFreq ?? 14.318;
      const ram = params.ramCapacityKb ?? 48;

      if (
        !Number.isFinite(f) ||
        f < 7.0 ||
        f > 28.0 ||
        !Number.isFinite(ram) ||
        ram < 4 ||
        ram > 48
      ) {
        return null;
      }

      const apple = stepWozniakApple({
        crystalFreq: f,
        ramCapacityKb: ram,
      });

      if (controlKey === "crystalFreq") {
        return {
          metricName: "Microprocessor Clock Speed",
          derivativeSymbol: "∂f_cpu / ∂f_xtal",
          derivativeValue: apple.cpuClockSlopeMhzPerMhz,
          derivativeUnit: "MHz / MHz",
          interpretation:
            "Master crystal divider: 14.31818 MHz master oscillation divided by 14 yields the ~1.023 MHz 6502 microprocessor clock.",
        };
      }
      if (controlKey === "ramCapacityKb") {
        return {
          metricName: "Accessible Video & Program RAM",
          derivativeSymbol: "∂RAM / ∂Capacity",
          derivativeValue: 1.0,
          derivativeUnit: "KB / KB",
          interpretation:
            "Linear dynamic RAM capacity expansion without video refresh contention or processor DMA wait states.",
        };
      }
      break;
    }

    case "us-6120588-eink": {
      const voltage = params.electrodeVoltageVolts ?? params.voltage ?? 15;
      const viscosity = params.fluidViscosityCp ?? params.viscosityCp ?? params.viscosity ?? 2.0;

      if (
        !Number.isFinite(voltage) ||
        voltage < -15 ||
        voltage > 15 ||
        !Number.isFinite(viscosity) ||
        viscosity < 0.5 ||
        viscosity > 5.0
      ) {
        return null;
      }

      if (controlKey === "electrodeVoltageVolts" || controlKey === "voltage") {
        return {
          metricName: "Electrophoretic Particle Velocity",
          derivativeSymbol: "∂v_particle / ∂V_electrode",
          derivativeValue: 0.045,
          derivativeUnit: "mm·s⁻¹ / V",
          interpretation:
            "Electrophoretic drift velocity of charged titania particles across microcapsule fluid.",
        };
      }
      if (
        controlKey === "fluidViscosityCp" ||
        controlKey === "viscosityCp" ||
        controlKey === "viscosity"
      ) {
        return {
          metricName: "Hydrodynamic Viscous Drag Damping",
          derivativeSymbol: "∂v_drift / ∂η_fluid",
          derivativeValue: -0.018,
          derivativeUnit: "(mm/s) / cP",
          interpretation:
            "Stokes drag retardation reducing electrophoretic particle transit speed through suspending hydrocarbon fluid.",
        };
      }
      break;
    }

    case "us-6285999-pagerank": {
      if (controlKey === "dampingFactor") {
        return {
          metricName: "Random Surfer Transition Probability",
          derivativeSymbol: "∂P_trans / ∂d",
          derivativeValue: 1.0,
          derivativeUnit: "probability / unit",
          interpretation:
            "Damping weight governing power iteration transition matrix convergence rate.",
        };
      }
      break;
    }

    case "us-7479949-multitouch": {
      const sep = params.fingerSeparationMm ?? 50;
      const count = params.fingerCount ?? 1;

      if (
        !Number.isFinite(sep) ||
        sep < 15 ||
        sep > 120 ||
        !Number.isFinite(count) ||
        count < 0 ||
        count > 2
      ) {
        return null;
      }

      if (controlKey === "fingerSeparationMm") {
        return {
          metricName: "Illustrative Pinch-to-Zoom Scale Ratio",
          derivativeSymbol: "∂S / ∂d_sep",
          derivativeValue: 0.02,
          derivativeUnit: "scale / mm",
          interpretation:
            "Illustrative display scaling only: 50 mm separation defines a nominal 1.0× reference (S = d / 50 mm). Claim 8 names the zoom-in or zoom-out command but supplies neither this ratio nor any sensing law.",
        };
      }
      if (controlKey === "fingerCount") {
        return {
          metricName: "Active Touch Contacts",
          derivativeSymbol: "∂Contacts / ∂Count",
          derivativeValue: 1.0,
          derivativeUnit: "pts / finger",
          interpretation:
            "Discrete contact count presented to the Claim 1 command heuristic; the claim does not specify the sensing matrix that detected it.",
        };
      }
      break;
    }

    case "us-3541541-engelbart-mouse": {
      const v = params.mouseSpeed ?? 350;
      const r = params.wheelRadius ?? 10.0;
      const ppr = params.pulsesPerRev ?? 200;

      if (
        !Number.isFinite(v) ||
        v < 100 ||
        v > 800 ||
        !Number.isFinite(r) ||
        r < 6 ||
        r > 18 ||
        !Number.isFinite(ppr) ||
        ppr < 20 ||
        ppr > 400
      ) {
        return null;
      }

      const mouse = stepEngelbartMouse({
        mouseSpeed: v,
        wheelRadius: r,
        pulsesPerRev: ppr,
      });

      if (controlKey === "mouseSpeed") {
        return {
          metricName: "Wheel Angular Velocity",
          derivativeSymbol: "∂ω / ∂v_mouse",
          derivativeValue: mouse.omegaSpeedSlopeRadPerSPerMmPerS,
          derivativeUnit: "(rad/s) / (mm/s)",
          interpretation:
            "Direct rolling contact kinematics: position wheel angular velocity scales inversely with wheel radius (ω = v / R).",
        };
      }
      if (controlKey === "wheelRadius") {
        return {
          metricName: "Wheel Angular Velocity",
          derivativeSymbol: "∂ω / ∂R_wheel",
          derivativeValue: mouse.omegaRadiusSlopeRadPerSPerMm,
          derivativeUnit: "(rad/s) / mm",
          interpretation:
            "Inverse radius dependency of rolling wheel angular velocity: ∂ω/∂R = -v / R².",
        };
      }
      if (controlKey === "pulsesPerRev") {
        return {
          metricName: "Encoder Pulse Generation Rate",
          derivativeSymbol: "∂f_pulse / ∂N_ppr",
          derivativeValue: Number((v / (2 * Math.PI * r)).toFixed(3)),
          derivativeUnit: "Hz / (pulse/rev)",
          interpretation:
            "Incremental encoder pulse frequency rate per unit pulses per revolution at current translation speed.",
        };
      }
      break;
    }

    case "us-6594844-roomba": {
      if (controlKey === "wheelSpeedMps") {
        return {
          metricName: "Contextual Chassis Advance Rate",
          derivativeSymbol: "∂v_chassis / ∂v_command",
          derivativeValue: 1,
          derivativeUnit: "(m/s) / (m/s)",
          interpretation:
            "In the straight contextual differential-drive mode, chassis advance equals the shared wheel-speed command. This is not a claimed coverage rate.",
        };
      }
      if (controlKey === "turnRateRadSec") {
        return {
          metricName: "Contextual In-Place Turn Rate",
          derivativeSymbol: "∂ω / ∂Rate",
          derivativeValue: 1.0,
          derivativeUnit: "rad·s⁻¹ / unit",
          interpretation:
            "During a commanded in-place redirect, the shared kernel applies this yaw rate through equal-and-opposite wheel speeds; the patent claim concerns the optical trigger, not a particular rate.",
        };
      }
      break;
    }

    case "gb-931-arkwright-water-frame": {
      const waterWheelRpm = params.waterWheelRpm ?? params.rpm ?? 180;
      const totalDraftRatio = params.totalDraftRatio ?? params.draftRatio ?? 6.0;
      const rollerClampingWeightKg =
        params.rollerClampingWeightKg ?? params.clampingWeightKg ?? 3.5;
      const stapleLengthMm = params.stapleLengthMm ?? params.stapleLength ?? 28;
      const inputRovingCountNe = params.inputRovingCountNe ?? params.rovingCountNe ?? 1.0;

      if (
        !Number.isFinite(waterWheelRpm) ||
        waterWheelRpm < 60 ||
        waterWheelRpm > 260 ||
        !Number.isFinite(totalDraftRatio) ||
        totalDraftRatio < 3.0 ||
        totalDraftRatio > 10.0 ||
        !Number.isFinite(rollerClampingWeightKg) ||
        rollerClampingWeightKg < 1.0 ||
        rollerClampingWeightKg > 6.0 ||
        !Number.isFinite(stapleLengthMm) ||
        stapleLengthMm < 20 ||
        stapleLengthMm > 38 ||
        !Number.isFinite(inputRovingCountNe) ||
        inputRovingCountNe < 0.5 ||
        inputRovingCountNe > 2.0
      ) {
        return null;
      }

      if (controlKey === "waterWheelRpm" || controlKey === "rpm") {
        return {
          metricName: "Flyer Spindle Rotation Speed",
          derivativeSymbol: "∂N_spindle / ∂RPM_wheel",
          derivativeValue: 18.5,
          derivativeUnit: "RPM / RPM",
          interpretation:
            "Water-wheel step-up gearing ratio (18.5:1 declared teaching transmission) driving continuous spinning flyers.",
        };
      }
      if (controlKey === "totalDraftRatio" || controlKey === "draftRatio") {
        return {
          metricName: "Yarn Count Attenuation",
          derivativeSymbol: "∂Ne / ∂Draft",
          derivativeValue: Number(inputRovingCountNe.toFixed(3)),
          derivativeUnit: "count / ratio",
          interpretation:
            "Differential roller speed drawing ratio reducing roving linear mass density (Ne_out = Ne_in · Draft).",
        };
      }
      break;
    }

    case "gb-1306-watt-rotary-engine": {
      const strokeRateSpm = params.strokeRateSpm ?? params.spm ?? 20;
      const boilerPressureKpa = params.boilerPressureKpa ?? params.boilerPressure ?? 70;
      const gearRatioNpOverNs = params.gearRatioNpOverNs ?? params.gearRatio ?? 1.0;
      const flywheelMassKg = params.flywheelMassKg ?? params.flywheelMass ?? 3500;

      if (
        !Number.isFinite(strokeRateSpm) ||
        strokeRateSpm < 10 ||
        strokeRateSpm > 30 ||
        !Number.isFinite(boilerPressureKpa) ||
        boilerPressureKpa < 40 ||
        boilerPressureKpa > 120 ||
        !Number.isFinite(gearRatioNpOverNs) ||
        gearRatioNpOverNs < 0.5 ||
        gearRatioNpOverNs > 2.0 ||
        !Number.isFinite(flywheelMassKg) ||
        flywheelMassKg < 1000 ||
        flywheelMassKg > 6000
      ) {
        return null;
      }

      if (controlKey === "strokeRateSpm" || controlKey === "spm") {
        const mult = Number((1.0 + gearRatioNpOverNs).toFixed(3));
        return {
          metricName: "Shaft Rotational Speed",
          derivativeSymbol: "∂RPM / ∂SPM",
          derivativeValue: mult,
          derivativeUnit: "RPM / SPM",
          interpretation:
            "Sun and planet epicyclic gear doubling shaft speed per complete beam reciprocation cycle (1 + N_p/N_s multiplier).",
        };
      }
      if (controlKey === "gearRatioNpOverNs" || controlKey === "gearRatio") {
        return {
          metricName: "Shaft Speed Multiplier",
          derivativeSymbol: "∂Mult / ∂Ratio",
          derivativeValue: 1.0,
          derivativeUnit: "multiplier / ratio",
          interpretation:
            "Linear speed-multiplier increase per unit increase in planet-to-sun gear ratio.",
        };
      }
      break;
    }

    case "gb-1420-cort-puddling-rolling": {
      const tempC =
        params.furnaceTemperatureCelsius ?? params.temperatureCelsius ?? params.temperature ?? 1350;
      const c0 = params.initialCarbonPercent ?? params.carbonPercent ?? 3.8;
      const rabbleRpm = params.rabbleStirringRpm ?? params.rabbleRpm ?? 15;
      const durationMin = params.puddlingDurationMinutes ?? params.durationMinutes ?? 90;
      const passes = params.rollerPassCount ?? params.passCount ?? 5;

      if (
        !Number.isFinite(tempC) ||
        tempC < 1150 ||
        tempC > 1550 ||
        !Number.isFinite(c0) ||
        c0 < 2.8 ||
        c0 > 4.5 ||
        !Number.isFinite(rabbleRpm) ||
        rabbleRpm < 0 ||
        rabbleRpm > 25 ||
        !Number.isFinite(durationMin) ||
        durationMin < 30 ||
        durationMin > 150 ||
        !Number.isFinite(passes) ||
        passes < 1 ||
        passes > 8
      ) {
        return null;
      }

      if (
        controlKey === "furnaceTemperatureCelsius" ||
        controlKey === "temperatureCelsius" ||
        controlKey === "temperature"
      ) {
        return {
          metricName: "Decarburization Oxidation Rate",
          derivativeSymbol: "∂Rate_decarb / ∂T",
          derivativeValue: 0.015,
          derivativeUnit: "%/min / °C",
          interpretation:
            "Reverberatory slag bath reaction kinetics burning carbon out of molten cast pig iron.",
        };
      }
      if (controlKey === "rabbleStirringRpm" || controlKey === "rabbleRpm") {
        return {
          metricName: "Slag Contact Decarburization Enhancement",
          derivativeSymbol: "∂Rate_decarb / ∂RPM_rabble",
          derivativeValue: 0.022,
          derivativeUnit: "%/min / RPM",
          interpretation:
            "Manual rabbling stirring rate increasing fresh molten metal exposure to oxidizing fayalite slag.",
        };
      }
      break;
    }

    case "us-x1-hopkins-potash": {
      const roastTempC = params.roastTempC ?? params.tempC ?? 750;
      const roastTimeHours = params.roastTimeHours ?? params.timeHours ?? 2.5;
      const ashBatchKg = params.ashBatchKg ?? params.batchKg ?? 200;
      const waterTempC = params.waterTempC ?? params.leachTempC ?? 80;

      if (
        !Number.isFinite(roastTempC) ||
        roastTempC < 500 ||
        roastTempC > 950 ||
        !Number.isFinite(roastTimeHours) ||
        roastTimeHours < 0.5 ||
        roastTimeHours > 6.0 ||
        !Number.isFinite(ashBatchKg) ||
        ashBatchKg < 50 ||
        ashBatchKg > 500 ||
        !Number.isFinite(waterTempC) ||
        waterTempC < 20 ||
        waterTempC > 100
      ) {
        return null;
      }

      if (controlKey === "roastTempC" || controlKey === "tempC") {
        return {
          metricName: "Potash Carbon Burnout Purity",
          derivativeSymbol: "∂Purity / ∂T_roast",
          derivativeValue: 0.05,
          derivativeUnit: "% / °C",
          interpretation:
            "Secondary furnace combustion incinerating black carbon residue into pure pearlash.",
        };
      }
      if (controlKey === "waterTempC" || controlKey === "leachTempC") {
        return {
          metricName: "Potassium Carbonate Leaching Solubility",
          derivativeSymbol: "∂C_sat / ∂T_water",
          derivativeValue: 4.4,
          derivativeUnit: "(g/L) / °C",
          interpretation:
            "Aqueous solubility temperature coefficient: K2CO3 dissolution rate in hot leaching vats.",
        };
      }
      break;
    }

    case "us-x72-whitney-cotton-gin": {
      const rpm = params.crankRpm ?? params.rpm ?? 60;
      const clearance = params.seedGridClearance ?? params.grateClearanceMm ?? 3.2;

      if (
        !Number.isFinite(rpm) ||
        rpm < 20 ||
        rpm > 180 ||
        !Number.isFinite(clearance) ||
        clearance < 1.0 ||
        clearance > 10.0
      ) {
        return null;
      }

      if (controlKey === "crankRpm" || controlKey === "rpm") {
        return {
          metricName: "Clean Lint Extraction Throughput",
          derivativeSymbol: "∂m_lint / ∂RPM_crank",
          derivativeValue: Number((50 / 60).toFixed(4)),
          derivativeUnit: "lb/day / RPM",
          interpretation:
            "Modern illustrative scenario throughput scaling with crank rotation speed. US X72 records a 49/50 labor reduction rather than continuous calibrated mass flow.",
        };
      }
      if (controlKey === "seedGridClearance" || controlKey === "grateClearanceMm") {
        return {
          metricName: "Grate Stroke Pitch Clearance",
          derivativeSymbol: "∂Stroke / ∂Clearance",
          derivativeValue: 2.5,
          derivativeUnit: "px / mm",
          interpretation:
            "Illustrative display slot stroke scaling with seed grate clearance under the teaching model.",
        };
      }
      break;
    }

    case "us-x8277-mccormick-reaper": {
      const speed = params.forwardSpeedMph ?? params.speedMph ?? params.speed ?? 2.5;

      if (!Number.isFinite(speed) || speed < 0.5 || speed > 6.0) {
        return null;
      }

      if (controlKey === "forwardSpeedMph" || controlKey === "speedMph" || controlKey === "speed") {
        return {
          metricName: "Cutter Reciprocation Frequency",
          derivativeSymbol: "∂f_cut / ∂v_ground",
          derivativeValue: 2.33,
          derivativeUnit: "Hz / MPH",
          interpretation:
            "Kinematic cutter reciprocation frequency scaling derived from the two-foot ground wheel and 30:9 × 27:9 gear train printed in US X8277.",
        };
      }
      break;
    }

    case "us-132-davenport-electric-motor": {
      const v = params.batteryVoltage ?? params.voltage ?? 12;
      const load = params.loadTorque ?? params.torque ?? 0.8;

      if (
        !Number.isFinite(v) ||
        v < 4 ||
        v > 24 ||
        !Number.isFinite(load) ||
        load < 0.2 ||
        load > 2.5
      ) {
        return null;
      }

      if (controlKey === "batteryVoltage" || controlKey === "voltage") {
        const dRpm_dV = Number((37.5 / Math.max(0.5, load)).toFixed(3));
        return {
          metricName: "Armature Commutated Rotational Speed",
          derivativeSymbol: "∂RPM / ∂V_batt",
          derivativeValue: dRpm_dV,
          derivativeUnit: "RPM / V",
          interpretation:
            "Commutated rotor speed scaling with applied galvanic battery voltage across the Lorentz electromagnetic torque loop.",
        };
      }
      if (controlKey === "loadTorque" || controlKey === "torque") {
        const dRpm_dLoad = load > 0.5 ? Number((-(v * 37.5) / load ** 2).toFixed(3)) : 0;
        return {
          metricName: "Armature Speed Load Droop",
          derivativeSymbol: "∂RPM / ∂τ_load",
          derivativeValue: dRpm_dLoad,
          derivativeUnit: "RPM / (N·m)",
          interpretation:
            "Inverse rotational speed droop under mechanical shaft resisting load torque.",
        };
      }
      break;
    }

    case "us-4750-howe-sewing-machine": {
      if (controlKey === "crankRpm") {
        return {
          metricName: "Lockstitch Formation Rate",
          derivativeSymbol: "∂Stitches / ∂RPM_crank",
          derivativeValue: 1.0,
          derivativeUnit: "stitches/min / RPM",
          interpretation:
            "Synchronized eye-pointed needle penetration and reciprocating shuttle loop pass.",
        };
      }
      break;
    }

    case "us-6469-lincoln-buoy": {
      const inflation = params.inflationPct ?? params.inflation ?? params.expansionPct ?? 75;
      const weight = params.weightTons ?? params.weight ?? 380;
      const depth = params.shoalDepth ?? params.depthFt ?? 3.5;

      if (
        !Number.isFinite(inflation) ||
        inflation < 0 ||
        inflation > 100 ||
        !Number.isFinite(weight) ||
        weight < 200 ||
        weight > 600 ||
        !Number.isFinite(depth) ||
        depth < 2.0 ||
        depth > 12.0
      ) {
        return null;
      }

      if (
        controlKey === "inflationPct" ||
        controlKey === "inflation" ||
        controlKey === "expansionPct"
      ) {
        return {
          metricName: "Hull Draft Shoal Reduction",
          derivativeSymbol: "∂Draft / ∂%_inflation",
          derivativeValue: 0.045,
          derivativeUnit: "ft / %",
          interpretation:
            "Archimedes buoyant displacement lifting vessel over shallow river sandbars.",
        };
      }
      if (controlKey === "weightTons" || controlKey === "weight") {
        return {
          metricName: "Hull Draft Displacement Loading",
          derivativeSymbol: "∂Draft / ∂W_steamboat",
          derivativeValue: 0.0088,
          derivativeUnit: "ft / ton",
          interpretation:
            "Hydrostatic sinkage slope: waterplane displacement loading per additional ton of cargo or vessel weight.",
        };
      }
      break;
    }

    case "us-48475-yale-lock": {
      const insertion = params.keyInsertion ?? 1.0;
      const torque = params.appliedTorqueNm ?? 0.15;

      if (
        !Number.isFinite(insertion) ||
        insertion < 0.0 ||
        insertion > 1.0 ||
        !Number.isFinite(torque) ||
        torque < 0.0 ||
        torque > 0.5
      ) {
        return null;
      }

      const yale = stepYaleLock({
        keyInsertion: insertion,
        appliedTorqueNm: torque,
      });

      if (controlKey === "keyInsertion") {
        return {
          metricName: "Pin Tumbler Shear Line Alignment",
          derivativeSymbol: "∂Alignment / ∂x_key",
          derivativeValue: yale.isUnlocked ? 1.0 : 0.0,
          derivativeUnit: "unit / unit",
          interpretation:
            "Binary shear line clearing state as the bitted flat key lifts driver and key pins to cylindrical plug boundary. Returns 1.0 when fully aligned and 0.0 when blocked.",
        };
      }
      if (controlKey === "appliedTorqueNm" || controlKey === "torque") {
        return {
          metricName: "Plug Rotational Angular Velocity",
          derivativeSymbol: "∂ω_plug / ∂τ",
          derivativeValue: yale.isUnlocked ? 18.0 : 0.0,
          derivativeUnit: "(rad/s) / (N·m)",
          interpretation:
            "Plug rotational response to applied turning torque: freely accelerates when shear line is cleared (18 (rad/s)/(N·m)), or deadlocked by binding pins (0 (rad/s)/(N·m)).",
        };
      }
      break;
    }

    case "us-78317-nobel-dynamite": {
      const ngPct = params.ngConcentrationPct ?? params.ngPct ?? 75;
      const capEnergy = params.capEnergyJoules ?? params.capEnergy ?? 15;

      if (
        !Number.isFinite(ngPct) ||
        ngPct < 50 ||
        ngPct > 80 ||
        !Number.isFinite(capEnergy) ||
        capEnergy < 5 ||
        capEnergy > 50
      ) {
        return null;
      }

      if (controlKey === "ngConcentrationPct" || controlKey === "ngPct") {
        return {
          metricName: "Detonation Shock Front Velocity",
          derivativeSymbol: "∂v_det / ∂%_NG",
          derivativeValue: 45.0,
          derivativeUnit: "m/s / %",
          interpretation:
            "Chapman-Jouguet detonation wave speed through kieselguhr-stabilized nitroglycerin.",
        };
      }
      if (controlKey === "capEnergyJoules" || controlKey === "capEnergy") {
        return {
          metricName: "Blasting Cap Initiation Energy",
          derivativeSymbol: "∂E_det / ∂E_cap",
          derivativeValue: 1.0,
          derivativeUnit: "J / J",
          interpretation:
            "Mercury fulminate detonator shock initiation wave energy coupling into stabilized porous absorbent.",
        };
      }
      break;
    }

    case "us-79265-sholes-typewriter": {
      const cadence = params.typingSpeedWpm ?? params.cadence ?? 40;
      if (!Number.isFinite(cadence) || cadence < 10 || cadence > 120) {
        return null;
      }
      if (controlKey === "typingSpeedWpm" || controlKey === "cadence") {
        return {
          metricName: "Demonstration Event Frequency",
          derivativeSymbol: "∂f_event / ∂Cadence",
          derivativeValue: Number((1 / 60).toFixed(4)),
          derivativeUnit: "strokes/s / (strokes/min)",
          interpretation:
            "Linear scaling of demonstration stroke frequency with input typing cadence under the source-constrained display model.",
        };
      }
      break;
    }

    case "us-105338-hyatt-celluloid": {
      const steamTemp = params.steamTempC ?? params.tempC ?? 125;
      const pressure = params.hydraulicPressureMpa ?? params.pressureMpa ?? 18;

      if (
        !Number.isFinite(steamTemp) ||
        steamTemp < 90 ||
        steamTemp > 150 ||
        !Number.isFinite(pressure) ||
        pressure < 5 ||
        pressure > 35
      ) {
        return null;
      }

      if (controlKey === "steamTempC" || controlKey === "tempC") {
        return {
          metricName: "Thermoplastic Molding Plasticity",
          derivativeSymbol: "∂Flow / ∂T_steam",
          derivativeValue: 0.12,
          derivativeUnit: "mm/s / °C",
          interpretation:
            "Camphor-nitrocellulose mutual solvent gelation under heated hydraulic press.",
        };
      }
      if (controlKey === "hydraulicPressureMpa" || controlKey === "pressureMpa") {
        return {
          metricName: "Consolidation Density Gradient",
          derivativeSymbol: "∂Density / ∂P_hydraulic",
          derivativeValue: 0.004,
          derivativeUnit: "(g/cm³) / MPa",
          interpretation:
            "Hydraulic compaction forcing solvent into pyroxylin pulp voids for homogenous plastic cake formation.",
        };
      }
      break;
    }

    case "us-157124-glidden-barbed-wire": {
      const tension = params.wireTensionN ?? params.tensionN ?? 1800;
      const twists = params.twistsPerFoot ?? params.twists ?? 3.5;
      const push = params.animalPushForceN ?? params.pushForceN ?? 450;

      if (
        !Number.isFinite(tension) ||
        tension < 500 ||
        tension > 3500 ||
        !Number.isFinite(twists) ||
        twists < 1.0 ||
        twists > 6.0 ||
        !Number.isFinite(push) ||
        push < 100 ||
        push > 1200
      ) {
        return null;
      }

      if (controlKey === "twistsPerFoot" || controlKey === "twists") {
        return {
          metricName: "Spurred Barb Interlock Clamping Force",
          derivativeSymbol: "∂F_clamp / ∂Twist",
          derivativeValue: 18.5,
          derivativeUnit: "N / twist",
          interpretation:
            "Twisted dual-strand wire clamping short coiled spurred barbs against lateral sliding.",
        };
      }
      if (controlKey === "wireTensionN" || controlKey === "tensionN") {
        return {
          metricName: "Fence Span Elastic Sag Stiffness",
          derivativeSymbol: "∂δ_sag / ∂T_wire",
          derivativeValue: -0.012,
          derivativeUnit: "mm / N",
          interpretation:
            "Longitudinal tensile pre-stress reducing catenary sag under transverse contact loads.",
        };
      }
      break;
    }

    case "us-313224-mergenthaler-linotype": {
      const rate = params.matrixRate ?? params.matrixRatePerMin ?? 60;
      const wedge = params.spacebandWedge ?? params.spacebandWedgeMm ?? 6.5;
      const temp = params.potTemp ?? params.potTempC ?? 260;

      if (
        !Number.isFinite(rate) ||
        rate < 10 ||
        rate > 120 ||
        !Number.isFinite(wedge) ||
        wedge < 2.0 ||
        wedge > 12.0 ||
        !Number.isFinite(temp) ||
        temp < 220 ||
        temp > 300
      ) {
        return null;
      }

      if (controlKey === "spacebandWedge" || controlKey === "spacebandWedgeMm") {
        return {
          metricName: "Line Justification Expansion",
          derivativeSymbol: "∂Width / ∂WedgeLift",
          derivativeValue: 4.2,
          derivativeUnit: "mm / mm",
          interpretation:
            "Double-wedge spaceband sliding elevation justifying assembled character line against casting jaws.",
        };
      }
      if (controlKey === "matrixRate" || controlKey === "matrixRatePerMin") {
        return {
          metricName: "Matrix Distributor Escapement Frequency",
          derivativeSymbol: "∂f_dist / ∂Rate",
          derivativeValue: Number((1 / 60).toFixed(4)),
          derivativeUnit: "Hz / (char/min)",
          interpretation:
            "Distributor lift frequency scaling linearly with assembled matrix input rate.",
        };
      }
      if (controlKey === "potTemp" || controlKey === "potTempC") {
        return {
          metricName: "Lead-Tin-Antimony Solidification Duration",
          derivativeSymbol: "∂t_solid / ∂T_pot",
          derivativeValue: Number((450 / 260).toFixed(4)),
          derivativeUnit: "ms / °C",
          interpretation:
            "Thermal casting quench duration scaling with lead pot melt temperature above eutectic point.",
        };
      }
      break;
    }

    case "us-388850-eastman-kodak": {
      const t = params.shutterSpeed ?? params.shutterSpeedSec ?? 0.05;
      const n = params.apertureStop ?? params.apertureFNumber ?? 9;
      const dist = params.subjectDist ?? params.subjectDistanceM ?? 3.0;

      if (
        !Number.isFinite(t) ||
        t < 0.005 ||
        t > 0.5 ||
        !Number.isFinite(n) ||
        n < 4 ||
        n > 32 ||
        !Number.isFinite(dist) ||
        dist < 0.2 ||
        dist > 50
      ) {
        return null;
      }

      if (controlKey === "shutterSpeed" || controlKey === "shutterSpeedSec") {
        return {
          metricName: "Emulsion Photochemical Exposure Energy",
          derivativeSymbol: "∂H / ∂t_exp",
          derivativeValue: 1.0,
          derivativeUnit: "mJ / s",
          interpretation:
            "Reciprocity law photochemical latent image energy integrated across focal plane.",
        };
      }
      if (controlKey === "apertureStop" || controlKey === "apertureFNumber") {
        const dH_dN = Number((-108.3 / (n * n)).toFixed(3));
        return {
          metricName: "Hyperfocal Distance Aperture Sensitivity",
          derivativeSymbol: "∂H / ∂N",
          derivativeValue: dH_dN,
          derivativeUnit: "m / (f/#)",
          interpretation:
            "Rate of change of hyperfocal distance with relative aperture; stopping down reduces hyperfocal distance, expanding depth of field toward camera.",
        };
      }
      if (controlKey === "subjectDist" || controlKey === "subjectDistanceM") {
        const f = 0.057;
        const c = 0.00003;
        const hyperfocalM = f ** 2 / (n * c) + f;
        const dNear_dDist = Number(((hyperfocalM / (hyperfocalM + dist)) ** 2).toFixed(3));
        return {
          metricName: "Near Depth-of-Field Boundary Subject Sensitivity",
          derivativeSymbol: "∂D_near / ∂d",
          derivativeValue: dNear_dDist,
          derivativeUnit: "m / m",
          interpretation:
            "Sensitivity of the near focus boundary to subject distance under fixed-focus hyperfocal geometry.",
        };
      }
      break;
    }

    case "us-395781-hollerith-tabulating": {
      const cpm = params.cardsPerMin ?? 60;
      const v = params.batteryVolts ?? params.supplyVoltageV ?? 12;
      const relays = params.activeRelays ?? 16;

      if (
        !Number.isFinite(cpm) ||
        cpm < 20 ||
        cpm > 90 ||
        !Number.isFinite(v) ||
        v < 6 ||
        v > 24 ||
        !Number.isFinite(relays) ||
        relays < 1 ||
        relays > 40
      ) {
        return null;
      }

      const hol = stepHollerithTabulating({
        cardsPerMin: cpm,
        supplyVoltageV: v,
        activeRelays: relays,
      });

      if (controlKey === "cardsPerMin") {
        return {
          metricName: "Electromechanical Dial Tally Rate",
          derivativeSymbol: "∂Count / ∂Speed",
          derivativeValue: hol.tallyRateSlopePerCpm,
          derivativeUnit: "tallies/min / (card/min)",
          interpretation:
            "Punched-hole mercury sensing pins closing relay circuits to advance electromechanical counters.",
        };
      }
      if (controlKey === "batteryVolts" || controlKey === "supplyVoltageV") {
        return {
          metricName: "Solenoid Electromagnetic Tractive Force",
          derivativeSymbol: "∂F_mag / ∂V_supply",
          derivativeValue: hol.forceVoltageSlopeNPerV,
          derivativeUnit: "N / V",
          interpretation:
            "Quadratic solenoid tractive force gradient with supply voltage: F_mag ∝ V² across relay coils.",
        };
      }
      if (controlKey === "activeRelays") {
        return {
          metricName: "Solenoid Total Attraction Force",
          derivativeSymbol: "∂F_mag / ∂N_relays",
          derivativeValue: hol.forceRelaySlopeNPerRelay,
          derivativeUnit: "N / relay",
          interpretation:
            "Cumulative tractive force gradient with the number of concurrently engaged accumulator relay circuits.",
        };
      }
      break;
    }

    case "us-470918-reno-escalator": {
      const v = params.beltSpeed ?? 1.016;
      const angle = params.inclineAngle ?? 25;

      if (
        !Number.isFinite(v) ||
        v < 0.4 ||
        v > 1.2 ||
        !Number.isFinite(angle) ||
        angle < 20 ||
        angle > 35
      ) {
        return null;
      }

      if (controlKey === "beltSpeed") {
        return {
          metricName: "Belt Velocity Linear Conversion",
          derivativeSymbol: "∂v_fpm / ∂v_mps",
          derivativeValue: Number((60 / 0.3048).toFixed(2)),
          derivativeUnit: "(ft/min) / (m/s)",
          interpretation:
            "Linear unit scaling between SI belt velocity and historical US 470,918 stated 200 ft/min specification benchmark.",
        };
      }
      if (controlKey === "inclineAngle") {
        const thetaRad = (angle * Math.PI) / 180;
        const dvz_dDeg = Number((v * Math.cos(thetaRad) * (Math.PI / 180)).toFixed(4));
        return {
          metricName: "Vertical Ascent Rate",
          derivativeSymbol: "∂v_z / ∂θ_incline",
          derivativeValue: dvz_dDeg,
          derivativeUnit: "(m/s) / deg",
          interpretation:
            "Vertical rider elevation velocity sensitivity with incline angle along the inclined slatted treadway.",
        };
      }
      break;
    }

    case "us-542846-diesel-engine": {
      const cr = params.compRatio ?? params.compressionRatio ?? 18;
      const blast =
        params.blastAirPressure ?? params.blastAirPressureBar ?? params.blastPressure ?? 65;
      const cutoff = params.cutoffRatio ?? params.cutoff ?? 1.6;
      const rpm = params.engineRpm ?? params.rpm ?? 150;

      if (
        !Number.isFinite(cr) ||
        cr < 12 ||
        cr > 22 ||
        !Number.isFinite(blast) ||
        blast < 45 ||
        blast > 85 ||
        !Number.isFinite(cutoff) ||
        cutoff < 1.2 ||
        cutoff > 2.2 ||
        !Number.isFinite(rpm) ||
        rpm < 60 ||
        rpm > 300
      ) {
        return null;
      }

      const diesel = stepDieselEngine({
        compressionRatio: cr,
        blastAirPressureBar: blast,
        cutoffRatio: cutoff,
        engineRpm: rpm,
      });
      if (controlKey === "compRatio" || controlKey === "compressionRatio") {
        return {
          metricName: "Compression Temperature (Model)",
          derivativeSymbol: "∂T_comp / ∂CR",
          derivativeValue: Number(diesel.compressionTemperatureSlopeKPerRatio.toPrecision(6)),
          derivativeUnit: "°C / ratio",
          interpretation:
            "Local derivative of the shared ideal-gas compression temperature before display rounding, with a declared 300 K intake and γ = 1.4. The same temperature increment applies in Celsius and kelvin. Public endpoints use the admitted one-sided slope; this is a teaching scenario, not a measured historic engine.",
        };
      }
      if (controlKey === "cutoffRatio" || controlKey === "cutoff") {
        return {
          metricName: "Brake Efficiency (Model)",
          derivativeSymbol: "∂η_brake / ∂r_c",
          derivativeValue: Number(diesel.brakeEfficiencySlopePctPerCutoffRatio.toPrecision(6)),
          derivativeUnit: "percentage points / ratio",
          interpretation:
            "Derivative of the shared teaching model at the current compression and cutoff ratios, before display rounding. It includes the same illustrative 0.68 brake-efficiency factor as the readout; γ = 1.4 and the other inputs are held fixed. Public endpoints use the admitted one-sided slope, not historic performance measurements.",
        };
      }
      break;
    }

    case "us-1219881-sundback-zipper": {
      const pos = params.sliderPositionPct ?? 65;
      const pull = params.pullForceN ?? 15;
      const lat = params.lateralTensionN ?? 40;
      const flex = params.flexAngleDeg ?? 25;
      const tpi = params.toothDensityTpi ?? 11;

      if (
        !Number.isFinite(pos) ||
        pos < 0 ||
        pos > 100 ||
        !Number.isFinite(pull) ||
        pull < 0 ||
        pull > 50 ||
        !Number.isFinite(lat) ||
        lat < 0 ||
        lat > 200 ||
        !Number.isFinite(flex) ||
        flex < 0 ||
        flex > 180 ||
        !Number.isFinite(tpi) ||
        tpi < 8 ||
        tpi > 14
      ) {
        return null;
      }

      if (controlKey === "sliderPositionPct") {
        return {
          metricName: "Engaged Tooth Count",
          derivativeSymbol: "∂N_engaged / ∂x_slider",
          derivativeValue: 0.65,
          derivativeUnit: "teeth / %",
          interpretation:
            "Linear progression of Y-slider cam engaging opposing staggered scoops sequentially.",
        };
      }
      if (controlKey === "pullForceN") {
        return {
          metricName: "Cam Wedge Normal Force",
          derivativeSymbol: "∂F_n / ∂F_pull",
          derivativeValue: 1.25,
          derivativeUnit: "N / N",
          interpretation:
            "Mechanical advantage of the converging slider guide channels converting axial pull into transverse scoop compression.",
        };
      }
      if (controlKey === "lateralTensionN") {
        return {
          metricName: "Corded Tape Strain",
          derivativeSymbol: "∂ε / ∂F_lat",
          derivativeUnit: "% / N",
          derivativeValue: Number((100 / (850 * 2)).toFixed(4)),
          interpretation:
            "Elastic elongation of reinforced cotton cords under transverse tensile load.",
        };
      }
      break;
    }

    case "us-2717437-mestral-velcro": {
      const rawD = params.filamentDiameterMm ?? params.diameter;
      if (rawD !== undefined && (!Number.isFinite(rawD) || rawD < 0.1 || rawD > 0.35)) {
        return null;
      }
      const rawL = params.hookLengthMm ?? params.length;
      if (rawL !== undefined && (!Number.isFinite(rawL) || rawL < 1.0 || rawL > 3.0)) {
        return null;
      }
      const rawRho = params.hookDensityPerCm2 ?? params.density;
      if (rawRho !== undefined && (!Number.isFinite(rawRho) || rawRho < 20 || rawRho > 120)) {
        return null;
      }
      const rawAngle = params.peelAngleDeg ?? params.angle;
      if (
        rawAngle !== undefined &&
        (!Number.isFinite(rawAngle) || rawAngle < 15 || rawAngle > 165)
      ) {
        return null;
      }
      const rawProg = params.peelProgress ?? params.progress;
      if (
        rawProg !== undefined &&
        (!Number.isFinite(rawProg) || rawProg < 0.05 || rawProg > 0.95)
      ) {
        return null;
      }

      const controls = readMestralVelcroControls(params);
      if (controlKey === "filamentDiameterMm" || controlKey === "diameter") {
        const d0 = controls.filamentDiameterMm;
        const probePlus = stepMestralVelcroSi({ ...controls, filamentDiameterMm: d0 + 0.01 });
        const probeMinus = stepMestralVelcroSi({
          ...controls,
          filamentDiameterMm: Math.max(0.05, d0 - 0.01),
        });
        const derivative =
          (probePlus.relativeBendingGeometryIndex - probeMinus.relativeBendingGeometryIndex) / 0.02;
        return {
          metricName: "Relative Bending Geometry",
          derivativeSymbol: "∂K_geometry,rel / ∂d",
          derivativeValue: Number(derivative.toFixed(2)),
          derivativeUnit: "index / mm",
          interpretation:
            "Central difference of the exact circular-section d⁴/L³ geometry index. This is not a force derivative: the grant does not provide a material modulus or contact law.",
        };
      }
      if (controlKey === "hookLengthMm" || controlKey === "length") {
        const length = controls.hookLengthMm;
        const probePlus = stepMestralVelcroSi({
          ...controls,
          hookLengthMm: Math.min(3, length + 0.05),
        });
        const probeMinus = stepMestralVelcroSi({
          ...controls,
          hookLengthMm: Math.max(1, length - 0.05),
        });
        const derivative =
          (probePlus.relativeBendingGeometryIndex - probeMinus.relativeBendingGeometryIndex) / 0.1;
        return {
          metricName: "Relative Bending Geometry",
          derivativeSymbol: "∂K_geometry,rel / ∂L",
          derivativeValue: Number(derivative.toFixed(2)),
          derivativeUnit: "index / mm",
          interpretation:
            "Central difference of the exact L⁻³ geometry factor. This does not claim a physical spring rate without the missing material and boundary data.",
        };
      }
      if (controlKey === "hookDensityPerCm2" || controlKey === "density") {
        return {
          metricName: "Visible Pile Row Population",
          derivativeSymbol: "∂Rows / ∂ρ",
          derivativeValue: 0.04,
          derivativeUnit: "rows / cm⁻²",
          interpretation:
            "Quantized museum display row scaling per unit pile density over the illustrative 20-120 cm⁻² range.",
        };
      }
      break;
    }

    case "us-2846084-goertz-electronic-master-slave-manipulator": {
      const controls = readGoertzMasterSlaveControls(params);
      const h = 0.01;
      if (controlKey === "contactResistance") {
        const contact = controls.contactResistance;
        const plus = stepGoertzMasterSlaveTopology({
          ...controls,
          contactResistance: Math.min(1, contact + h),
        });
        const minus = stepGoertzMasterSlaveTopology({
          ...controls,
          contactResistance: Math.max(0, contact - h),
        });
        const derivative =
          (plus.reflectedResistance - minus.reflectedResistance) /
          (Math.min(1, contact + h) - Math.max(0, contact - h));
        return {
          metricName: "Reflected-Resistance Display",
          derivativeSymbol: "∂r_display / ∂u_contact",
          derivativeValue: Number(derivative.toFixed(3)),
          derivativeUnit: "normalized display / normalized scenario",
          interpretation:
            "Central difference of the shared source-topology kernel. It shows how the illustrative remote-obstruction selector affects the normalized Claim 9 reflection cue; it is not a contact force or a servo-performance measurement.",
        };
      }
      if (controlKey === "gripperClosure") {
        const closure = controls.gripperClosure;
        const plus = stepGoertzMasterSlaveTopology({
          ...controls,
          gripperClosure: Math.min(1, closure + h),
        });
        const minus = stepGoertzMasterSlaveTopology({
          ...controls,
          gripperClosure: Math.max(0, closure - h),
        });
        const derivative =
          (plus.positionErrors[6] - minus.positionErrors[6]) /
          (Math.min(1, closure + h) - Math.max(0, closure - h));
        return {
          metricName: "Gripper-Closure Mismatch Display",
          derivativeSymbol: "∂e_grip / ∂q_m,grip",
          derivativeValue: Number(derivative.toFixed(3)),
          derivativeUnit: "normalized mismatch / normalized master coordinate",
          interpretation:
            "Central difference of the explicitly illustrative gripper-obstruction display. The other six channels remain in correspondence; this is not an SI displacement, gain, contact-force, or servo-performance derivative.",
        };
      }
      break;
    }

    case "us-4341502-makino-scara": {
      const centralDifference = (
        control: "firstLinkAngleDeg" | "fourthLinkAngleDeg",
        coordinate: 0 | 1,
      ) => {
        const center = params[control] ?? (control === "firstLinkAngleDeg" ? 32 : -38);
        const deltaDeg = 0.01;
        const high = stepMakinoScaraTopology({ ...params, [control]: center + deltaDeg });
        const low = stepMakinoScaraTopology({ ...params, [control]: center - deltaDeg });
        return (high.tool[coordinate] - low.tool[coordinate]) / (2 * deltaDeg);
      };
      if (controlKey === "firstLinkAngleDeg" || controlKey === "theta1") {
        const derivative = centralDifference("firstLinkAngleDeg", 0);
        return {
          metricName: "End-Effector X Coordinate",
          derivativeSymbol: "∂X_tool / ∂θ_1",
          derivativeValue: Number(derivative.toFixed(6)),
          derivativeUnit: "norm / deg",
          interpretation:
            "Central difference through the selected normalized closed-chain branch; it is a display-coordinate derivative, not metres per degree.",
        };
      }
      if (controlKey === "fourthLinkAngleDeg" || controlKey === "theta4") {
        const derivative = centralDifference("fourthLinkAngleDeg", 1);
        return {
          metricName: "End-Effector Y Coordinate",
          derivativeSymbol: "∂Y_tool / ∂θ_4",
          derivativeValue: Number(derivative.toFixed(6)),
          derivativeUnit: "norm / deg",
          interpretation:
            "Central difference through the selected normalized closed-chain branch; it preserves fixed member lengths but makes no SI motion claim.",
        };
      }
      if (controlKey === "toolAttitudeDeg" || controlKey === "toolAttitude") {
        const pose = stepMakinoScaraTopology(params);
        return {
          metricName: "Tool Attitude",
          derivativeSymbol: "∂φ_tool / ∂φ_command",
          derivativeValue: pose.topology === "claim-6-y-link" ? 0 : 1,
          derivativeUnit: "deg / deg",
          interpretation:
            pose.topology === "claim-6-y-link"
              ? "Claim 6 fixes tool 13's relative attitude through Y-link 14, so the independent belt-attitude command is refused in this topology."
              : "Claims 2/5 add motor 10 and belts 11/12 as a distinct attitude coordinate; the normalized exhibit maps that source-named coordinate directly.",
        };
      }
      break;
    }

    case "us-3119501-lemelson-automatic-warehousing": {
      if (controlKey === "railAddressFraction") {
        const pose = stepLemelsonWarehouseTopology(params);
        return {
          metricName: "Normalized Rail Address",
          derivativeSymbol: "∂q_x / ∂a_x",
          derivativeValue: pose.carrierX === (params.railAddressFraction ?? 0.55) ? 1 : 0,
          derivativeUnit: "display fraction / address fraction",
          interpretation:
            "The normalized exhibit maps its rail-address control directly to the carrier pose; the grant supplies no bay spacing in meters.",
        };
      }
      if (controlKey === "levelAddressFraction") {
        return {
          metricName: "Normalized Vertical Address",
          derivativeSymbol: "∂q_z / ∂a_z",
          derivativeValue: 1,
          derivativeUnit: "display fraction / address fraction",
          interpretation:
            "The normalized exhibit maps its level-address control directly to the lift pose; no shelf height is asserted.",
        };
      }
      if (controlKey === "shuttleExtensionFraction") {
        return {
          metricName: "Normalized Shuttle Extension",
          derivativeSymbol: "∂q_y / ∂a_y",
          derivativeValue: 1,
          derivativeUnit: "display fraction / extension fraction",
          interpretation:
            "The normalized exhibit maps the control directly to the transverse transfer pose; no reach, speed, or payload is asserted.",
        };
      }
      break;
    }

    case "us-2988237-devol-programmed-transfer": {
      if (controlKey === "recordedSlot" || controlKey === "sensedSlot") {
        return {
          metricName:
            controlKey === "recordedSlot" ? "Recorded Position Symbol" : "Sensed Position Symbol",
          derivativeSymbol: "∂c_{display} / ∂c_{input}",
          derivativeValue: 1,
          derivativeUnit: "code value / code value",
          interpretation:
            "Identity relation for the patent's recorded-versus-sensed code comparison. It does not infer actuator travel, controller latency, hydraulic power, payload, or transfer throughput.",
        };
      }
      break;
    }

    case "us-3212649-amf-versatran": {
      if (
        controlKey === "columnRotation" ||
        controlKey === "carriageLift" ||
        controlKey === "armTravel" ||
        controlKey === "wristRotation" ||
        controlKey === "wristSwing" ||
        controlKey === "gripperOperation" ||
        controlKey === "resolverPhaseOffset"
      ) {
        if (controlKey === "resolverPhaseOffset") {
          return {
            metricName: "Phase Error Sensitivity",
            derivativeSymbol: "∂(Δφ) / ∂(φ_offset)",
            derivativeValue: 1.0,
            derivativeUnit: "normalized phase / normalized phase",
            interpretation:
              "Direct display relationship between the deliberately injected normalized phase offset and the normalized resolver/tape phase difference.",
          };
        }
        if (controlKey === "armTravel") {
          return {
            metricName: "Horizontal Reach Sensitivity",
            derivativeSymbol: "∂r_{display} / ∂q_{arm}",
            derivativeValue: 0.72,
            derivativeUnit: "normalized radius / control increment",
            interpretation:
              "Display-only radial relationship used to make arm travel legible. It is not a recovered arm length, calibrated workspace, or speed relationship.",
          };
        }
        if (controlKey === "gripperOperation") {
          return {
            metricName: "Normalized Gripper Operation",
            derivativeSymbol: "∂g_{display} / ∂q_{gripper}",
            derivativeValue: 1.0,
            derivativeUnit: "display command / control increment",
            interpretation:
              "Direct display relationship for the source-described work-manipulating-member operation. It does not predict jaw travel, grip force, contact, or payload.",
          };
        }
        return {
          metricName: "Normalized Motion Display Sensitivity",
          derivativeSymbol: "∂p_{display} / ∂q_{joint}",
          derivativeValue: 1.0,
          derivativeUnit: "display coordinate / command",
          interpretation:
            "Display relationship for one source-described motion channel. It retains topology without asserting unprinted dimensions, pressure, speed, payload, or dynamics.",
        };
      }
      break;
    }

    case "us-3260375-lemelson-adjustable-manipulator": {
      if (
        controlKey === "columnAzimuth" ||
        controlKey === "carriagePosition" ||
        controlKey === "columnElevation" ||
        controlKey === "wristPivot" ||
        controlKey === "jawClosure"
      ) {
        if (controlKey === "columnAzimuth") {
          return {
            metricName: "Azimuth Angle Sensitivity",
            derivativeSymbol: "∂θ_{rad} / ∂q_{azimuth}",
            derivativeValue: Math.PI,
            derivativeUnit: "rad / control increment",
            interpretation:
              "Direct coordinate angular gradient for the rotating manipulator turntable.",
          };
        }
        if (controlKey === "wristPivot") {
          return {
            metricName: "Wrist Pivot Angle Sensitivity",
            derivativeSymbol: "∂φ_{rad} / ∂q_{pivot}",
            derivativeValue: Math.PI / 2,
            derivativeUnit: "rad / control increment",
            interpretation: "Geometric rate of wrist bevel pivot rotation.",
          };
        }
        return {
          metricName: "Normalized Axis Coordinate Sensitivity",
          derivativeSymbol: "∂q_{display} / ∂q_{control}",
          derivativeValue: 1.0,
          derivativeUnit: "display coordinate / control unit",
          interpretation:
            "Linear coordinate mapping for the gantry and hoist motions without unprinted force or velocity assumptions.",
        };
      }
      break;
    }

    case "us-3858581-kamen-medication-injection-device": {
      const rawPulse = params.selectedPulseCount ?? params.pulseCount;
      if (rawPulse !== undefined && (!Number.isFinite(rawPulse) || rawPulse < 1 || rawPulse > 99)) {
        return null;
      }
      const rawSpeed = params.displayTurnsPerSecond ?? params.displaySpeed;
      if (rawSpeed !== undefined && (!Number.isFinite(rawSpeed) || rawSpeed < 1 || rawSpeed > 12)) {
        return null;
      }
      const rawOff = params.offIntervalDisplaySeconds ?? params.offInterval;
      if (rawOff !== undefined && (!Number.isFinite(rawOff) || rawOff < 0.5 || rawOff > 8)) {
        return null;
      }

      const clutchEngaged =
        params.clutchEngaged !== undefined ? Number(params.clutchEngaged) >= 0.5 : true;

      if (controlKey === "selectedPulseCount" || controlKey === "pulseCount") {
        return {
          metricName: "Counted Stop Coordinate",
          derivativeSymbol: "∂N_{stop} / ∂N_{selected}",
          derivativeValue: clutchEngaged ? 1 : 0,
          derivativeUnit: "screw-turn events / selected event",
          interpretation: clutchEngaged
            ? "Each added selector count admits exactly one further striker/switch event before motor-off. Converting that event to displacement still requires the unprinted screw pitch; volume, dose, pressure, and delivery rate remain refused."
            : "Claim 3 clutch coupling is disengaged; lead screw remains disconnected from the motor.",
        };
      }
      if (controlKey === "displayTurnsPerSecond" || controlKey === "displaySpeed") {
        return {
          metricName: "Counted Stop Coordinate",
          derivativeSymbol: "∂N_{stop} / ∂ω_{display}",
          derivativeValue: 0,
          derivativeUnit: "screw-turn events / (display turns/s)",
          interpretation:
            "Changing the deliberately accelerated museum display speed changes how quickly the animation reaches the stop, not the integer screw-turn count at which counters 114/116 switch the motor off.",
        };
      }
      if (controlKey === "offIntervalDisplaySeconds" || controlKey === "offInterval") {
        return {
          metricName: "Motor-Off Display Pause Interval",
          derivativeSymbol: "∂t_off / ∂t_interval",
          derivativeValue: 1.0,
          derivativeUnit: "display s / display s",
          interpretation:
            "Linear pause duration scaling for the museum demonstration loop between sequential pulse delivery cycles.",
        };
      }
      break;
    }

    case "us-4098001-watson-rcc": {
      const probe = (key: "lateralContactFraction" | "axisMismatchFraction", value: number) =>
        stepWatsonRemoteCenterComplianceTopology({ ...params, [key]: value });
      const h = 0.001;
      if (controlKey === "lateralContactFraction") {
        const contact = params.lateralContactFraction ?? 0.62;
        const derivative =
          (probe("lateralContactFraction", contact + h).translationOffset -
            probe("lateralContactFraction", contact - h).translationOffset) /
          (2 * h);
        return {
          metricName: "Figure 4 Translation Phase",
          derivativeSymbol: "∂q_t / ∂q_c",
          derivativeValue: Number(derivative.toFixed(3)),
          derivativeUnit: "display fraction / contact fraction",
          interpretation:
            "Slope of the normalized Figure 4 sequence coordinate. The phase reaches one before Figure 5 rotation begins; it is not a force-compliance or dimensional prediction.",
        };
      }
      if (controlKey === "axisMismatchFraction") {
        const mismatch = params.axisMismatchFraction ?? 0.44;
        const derivative =
          (probe("axisMismatchFraction", mismatch + h).remainingAxisMismatch -
            probe("axisMismatchFraction", mismatch - h).remainingAxisMismatch) /
          (2 * h);
        return {
          metricName: "Remaining Axis Mismatch",
          derivativeSymbol: "∂q_e / ∂q_m",
          derivativeValue: Number(derivative.toFixed(3)),
          derivativeUnit: "normalized / normalized",
          interpretation:
            "Slope of the source-illustrative alignment cue. The grant does not provide a convergence rate or controller gain.",
        };
      }
      break;
    }

    case "us-5701965-kamen-transporter": {
      // US 5,701,965 is presented here as a discrete claim-reading state
      // machine. It has no continuous public control whose derivative can be
      // calculated without replacing the source boundary with a scenario.
      return null;
    }

    case "us-4976582-clavel-delta-robot": {
      if (
        controlKey === "armOneInput" ||
        controlKey === "armTwoInput" ||
        controlKey === "armThreeInput"
      ) {
        const controls = readClavelDeltaRobotControls(params);
        const derivative = kernelDerivative(controls[controlKey] as number, -1, 1, (value) => {
          const state = stepClavelDeltaRobotTopology({ ...params, [controlKey]: value });
          return state.topologyVisible &&
            state.pairedBarsVisible &&
            state.closureStatus === "normalized-closed-chain-solved"
            ? state.platformCenter[1]
            : null;
        });
        if (derivative === null) return null;
        return {
          metricName: "Normalized Traveling Plate Height",
          derivativeSymbol: "∂y_plate / ∂u_arm",
          derivativeValue: derivative,
          derivativeUnit: "normalized / input fraction",
          interpretation:
            "Central difference of the shared rigid closed-chain display geometry at the current three arm inputs. The grant supplies no dimensions; this is not millimetres per degree or a machine-performance prediction.",
        };
      }
      break;
    }

    case "us-6302230-kamen-segway": {
      const rawPitch = params.riderPitchDeg ?? params.pitch;
      if (
        rawPitch !== undefined &&
        (!Number.isFinite(rawPitch) || rawPitch < -15 || rawPitch > 15)
      ) {
        return null;
      }
      const rawFriction = params.groundFrictionCoeff ?? params.friction;
      if (
        rawFriction !== undefined &&
        (!Number.isFinite(rawFriction) || rawFriction < 0.15 || rawFriction > 0.95)
      ) {
        return null;
      }
      const rawSpeedLimit = params.speedLimitMS ?? params.speedLimit;
      if (
        rawSpeedLimit !== undefined &&
        (!Number.isFinite(rawSpeedLimit) || rawSpeedLimit < 2.0 || rawSpeedLimit > 6.0)
      ) {
        return null;
      }
      const rawMass = params.riderMassKg ?? params.mass;
      if (rawMass !== undefined && (!Number.isFinite(rawMass) || rawMass < 40 || rawMass > 120)) {
        return null;
      }
      const rawSteer = params.steeringInput ?? params.steering;
      if (
        rawSteer !== undefined &&
        (!Number.isFinite(rawSteer) || rawSteer < -1.0 || rawSteer > 1.0)
      ) {
        return null;
      }

      const controls = readKamenSegwayControls({
        ...params,
        riderPitchDeg: params.riderPitchDeg ?? params.pitch ?? 4.5,
        groundFrictionCoeff: params.groundFrictionCoeff ?? params.friction ?? 0.85,
        speedLimitMS: params.speedLimitMS ?? params.speedLimit ?? 5.5,
      });
      const probe = (
        key: "riderPitchDeg" | "groundFrictionCoeff" | "speedLimitMS",
        value: number,
      ) => stepKamenSegwaySi({ ...controls, [key]: value });
      if (controlKey === "riderPitchDeg" || controlKey === "pitch") {
        const derivative = kernelDerivative(controls.riderPitchDeg, -15, 15, (value) => {
          const state = probe("riderPitchDeg", value);
          return state.refusalReason ? null : state.gravityOverturningTorqueNm;
        });
        if (derivative === null) return null;
        return {
          metricName: "Overturning Gravitational Moment",
          derivativeSymbol: "∂τ_grav / ∂θ",
          derivativeValue: derivative,
          derivativeUnit: "N·m / deg",
          interpretation:
            "Central difference of the shared modern illustrative SI scenario at the current rider mass and pitch. It is not a historical hardware measurement.",
        };
      }
      if (controlKey === "groundFrictionCoeff" || controlKey === "friction") {
        const derivative = kernelDerivative(controls.groundFrictionCoeff, 0.15, 0.9, (value) => {
          const state = probe("groundFrictionCoeff", value);
          return state.refusalReason ? null : state.maxTractionForceN;
        });
        if (derivative === null) return null;
        return {
          metricName: "Maximum Ground Grip Traction",
          derivativeSymbol: "∂F_traction / ∂μ",
          derivativeValue: derivative,
          derivativeUnit: "N / μ",
          interpretation:
            "Central difference of the shared illustrative traction limit at the current rider mass plus the declared 43 kg chassis. This is a modern scenario, not source-specified hardware.",
        };
      }
      if (controlKey === "speedLimitMS" || controlKey === "speedLimit") {
        const derivative = kernelDerivative(controls.speedLimitMS, 2, 6, (value) => {
          const state = probe("speedLimitMS", value);
          return state.refusalReason ? null : state.balancingMarginRatio;
        });
        if (derivative === null) return null;
        return {
          metricName: "Balancing Margin Velocity Ceiling",
          derivativeSymbol: "∂Margin / ∂v_max",
          derivativeValue: derivative,
          derivativeUnit: "1 / (m/s)",
          interpretation:
            "Central difference of the current illustrative balancing-margin model, including the active governor and torque branch. Refused or nonsmooth operating points have no displayed derivative.",
        };
      }
      if (controlKey === "riderMassKg" || controlKey === "mass") {
        const mu = controls.groundFrictionCoeff;
        return {
          metricName: "Payload Traction Grip Force",
          derivativeSymbol: "∂F_traction / ∂M_rider",
          derivativeValue: Number((mu * 9.80665).toFixed(4)),
          derivativeUnit: "N / kg",
          interpretation:
            "Linear increase in available ground traction envelope with rider payload under the current surface friction coefficient.",
        };
      }
      break;
    }

    case "us-4068536-stackhouse-manipulator": {
      if (
        controlKey === "intermediateRollDeg" ||
        controlKey === "firstObliqueAngleDeg" ||
        controlKey === "secondObliqueAngleDeg"
      ) {
        const baseline = params[controlKey] ?? 55;
        const probe = (value: number) =>
          stepStackhouseSourceTopology({ ...params, [controlKey]: value }).bendAngleDeg;
        const derivative = (probe(baseline + 0.25) - probe(baseline - 0.25)) / 0.5;
        return {
          metricName: "Selected Display-Bend Sensitivity",
          derivativeSymbol: "∂β_display / ∂q",
          derivativeValue: Number(derivative.toFixed(4)),
          derivativeUnit: "display deg / selected deg",
          interpretation:
            "Central difference of the same normalized display composition used by the 2D and 3D exhibits. It is not an SI dexterity, velocity, motor, or manufacturing-performance derivative.",
        };
      }
      break;
    }

    case "us-3313014-lemelson-automatic-production": {
      if (
        controlKey === "carrierAddressFraction" ||
        controlKey === "liftFraction" ||
        controlKey === "reachFraction"
      ) {
        return {
          metricName: "Normalized Stage Interlock Coordination",
          derivativeSymbol: "∂Pose / ∂q",
          derivativeValue: 1.0,
          derivativeUnit: "normalized / input",
          interpretation:
            "Linear kinematic positioning of carrier address, Mz vertical lift, and My platform reach in automatic production sequence.",
        };
      }
      break;
    }

    case "us-4512709-milacron-robot-toolchanger": {
      const state = stepMilacronRobotToolchanger(params);
      if (controlKey === "registrationFraction") {
        return {
          metricName: "Effective Registration Position",
          derivativeSymbol: "∂q_reg,eff / ∂q_reg,req",
          derivativeValue: state.apertureAligned && state.toolBasePresent ? 1 : 0,
          derivativeUnit: "normalized / normalized",
          interpretation:
            state.apertureAligned && state.toolBasePresent
              ? "The aligned aperture admits source-bounded registration motion one-for-one."
              : "The source sequence interlock blocks registration motion until a base is present and aperture 34 is aligned.",
        };
      }
      if (controlKey === "lockingSlideFraction") {
        return {
          metricName: "Normalized Slide Position",
          derivativeSymbol: "∂q_slide,eff / ∂q_slide,req",
          derivativeValue: 1,
          derivativeUnit: "normalized / normalized",
          interpretation:
            "The source-bounded prismatic display follows the requested slide coordinate; this is not an SI stroke or force derivative.",
        };
      }
      if (controlKey === "toolBasePresent" || controlKey === "claimFourTMember") {
        return {
          metricName: "Discrete Topology Selection",
          derivativeSymbol: "Δstate / Δtoggle",
          derivativeValue: controlKey === "toolBasePresent" ? 1 : state.toolRetained ? 1 : 0,
          derivativeUnit: "Boolean state / toggle",
          interpretation:
            "This is a finite Boolean topology change, not a continuous derivative or a quantitative mechanics result.",
        };
      }
      break;
    }

    case "us-4575330-hull-stereolithography": {
      const state = stepHullStereolithographySi(readHullStereolithographyControls(params));
      if (controlKey === "scanXFraction" || controlKey === "scanZFraction") {
        return {
          metricName: controlKey === "scanXFraction" ? "Normalized Spot X" : "Normalized Spot Z",
          derivativeSymbol:
            controlKey === "scanXFraction"
              ? "∂q_{x,\\mathrm{eff}} / ∂q_{x,\\mathrm{req}}"
              : "∂q_{z,\\mathrm{eff}} / ∂q_{z,\\mathrm{req}}",
          derivativeValue: 1,
          derivativeUnit: "normalized / normalized",
          interpretation:
            "The source-bounded plotter display follows the reader coordinate one-for-one. The grant supplies no physical carriage travel, scan velocity, or dwell, so this is not an SI motion derivative.",
        };
      }
      if (controlKey === "recoatExcursionFraction") {
        return {
          metricName: "Normalized Platform Excursion",
          derivativeSymbol: "∂q_{platform,eff} / ∂q_{platform,req}",
          derivativeValue: 1,
          derivativeUnit: "normalized / normalized",
          interpretation:
            "The supported platform follows the normalized reader excursion. No millimetre stroke, speed, load, or actuator force is inferred from the grant.",
        };
      }
      if (controlKey === "shutterRequestedOpen" || controlKey === "displayLaminaCount") {
        return {
          metricName:
            controlKey === "shutterRequestedOpen"
              ? "Discrete Shutter / Sequence State"
              : "Illustrative Lamina Topology",
          derivativeSymbol: "Δstate / Δreader control",
          derivativeValue:
            controlKey === "shutterRequestedOpen"
              ? state.platformDepthFraction <= 0.02
                ? 1
                : 0
              : 1,
          derivativeUnit: "discrete display state",
          interpretation:
            controlKey === "shutterRequestedOpen"
              ? state.platformDepthFraction <= 0.02
                ? "At the working position, the electronic shutter request changes the displayed source state. This finite toggle is not a radiometric sensitivity."
                : "During the recoating excursion, the sequence guard holds the effective shutter closed. This finite interlock is not a cure-kinetics result."
              : "The control changes how many touching illustrative cross-sections are shown; it does not claim a printed layer count, thickness, adhesion, or build time.",
        };
      }
      break;
    }

    case "us-5121329-crump-fdm": {
      const controls = readCrumpFdmControls(params);
      const probe = (key: "printSpeedMmS" | "nozzleTempC" | "layerHeightMm", value: number) =>
        stepCrumpFdmSi({ ...controls, [key]: value });
      if (controlKey === "printSpeedMmS") {
        const derivative = kernelDerivative(
          params.printSpeedMmS ?? controls.printSpeedMmS,
          5,
          250,
          (value) => {
            const state = probe("printSpeedMmS", value);
            return state.refusalReason ? null : state.volumetricFlowRateMm3S;
          },
        );
        if (derivative === null) return null;
        return {
          metricName: "Volumetric Extrusion Flow Rate",
          derivativeSymbol: "∂Q / ∂v_head",
          derivativeValue: derivative,
          derivativeUnit: "mm³/s / (mm/s)",
          interpretation:
            "Volumetric extrusion demand scales linearly with toolhead print velocity, requiring proportional filament feed motor stepping.",
        };
      }
      if (controlKey === "nozzleTempC") {
        const derivative = kernelDerivative(
          params.nozzleTempC ?? controls.nozzleTempC,
          100,
          300,
          (value) => {
            const state = probe("nozzleTempC", value);
            return state.refusalReason ? null : state.apparentViscosityPaS;
          },
        );
        if (derivative === null) return null;
        return {
          metricName: "Apparent Melt Viscosity",
          derivativeSymbol: "∂μ / ∂T",
          derivativeValue: derivative,
          derivativeUnit: "Pa·s / °C",
          interpretation:
            "Central difference of the shared illustrative modern ABS screen at the current temperature and reference viscosity. Heating lowers the apparent viscosity; this is not a historical material measurement.",
        };
      }
      if (controlKey === "layerHeightMm") {
        const derivative = kernelDerivative(
          params.layerHeightMm ?? controls.layerHeightMm,
          0.05,
          0.8,
          (value) => {
            const state = probe("layerHeightMm", value);
            return state.refusalReason ? null : state.coolingTimeConstantSec;
          },
        );
        if (derivative === null) return null;
        return {
          metricName: "Road Thermal Cooling Time Constant",
          derivativeSymbol: "∂τ / ∂h",
          derivativeValue: derivative,
          derivativeUnit: "s / mm",
          interpretation:
            "Cooling time scales quadratically with layer thickness: thicker slices retain thermal energy longer before freezing below Tg.",
        };
      }
      break;
    }

    case "us-4921293-salisbury-robot-hand": {
      if (controlKey === "tensionT1N") {
        const controls = readSalisburyRobotHandControls(params);
        const r1M = (controls.radiusScaleMm * 1.2) / 1000;
        return {
          metricName: "Figure 3 First-Joint Torque",
          derivativeSymbol: "∂τ₁ / ∂T₁",
          derivativeValue: Number((-r1M).toFixed(6)),
          derivativeUnit: "N·m / N",
          interpretation:
            "Exact static derivative of Figure 3’s printed first-joint equation, τ₁ = −T₁R₁ + T₂R₂ + T₃R₂ − T₄R₁, evaluated at the visitor-declared R₁ study scale. It is a tendon-to-torque relation only; the grant does not disclose dynamic finger motion, contact force, or grasp stability.",
        };
      }
      break;
    }

    case "us-4765668-robot-end-effector": {
      if (controlKey === "jawOpeningFraction") {
        return {
          metricName: "Symmetric Jaw Opening",
          derivativeSymbol: "∂g / ∂u_{jaw}",
          derivativeValue: ROBOT_END_EFFECTOR_TYPICAL_JAW_OPENING_M * 1000,
          derivativeUnit: "mm / opening fraction",
          interpretation:
            "Exact slope of the source's typical 152.4 mm opening under the shared opposed-thread kinematic relation. It is not a force, payload, contact, or stiffness sensitivity.",
        };
      }
      if (controlKey === "gripForceSetpointN") {
        return {
          metricName: "Requested Grip Command",
          derivativeSymbol: "∂F_{set} / ∂u_{set}",
          derivativeValue: 1,
          derivativeUnit: "N setpoint / N control",
          interpretation:
            "Identity of the visitor-requested command, bounded by the source's prototype maximum. The grant's incomplete pneumatic, finger, workpiece, and friction data prohibit treating it as a calculated contact force or payload result.",
        };
      }
      if (controlKey === "frameRotationDeg") {
        return {
          metricName: "Frame Orientation",
          derivativeSymbol: "∂θ / ∂u_{rot}",
          derivativeValue: Math.PI / 180,
          derivativeUnit: "rad / deg",
          interpretation:
            "Exact degree-to-radian conversion for Claim 17's source-described longitudinal-axis rotation; no connector stroke or robot-arm dynamics are inferred.",
        };
      }
      if (controlKey === "fingerChangeFraction") {
        return {
          metricName: "Illustrated Finger Retention",
          derivativeSymbol: "∂r_{finger} / ∂u_{change}",
          derivativeValue: -1,
          derivativeUnit: "retained fraction / fixture-change fraction",
          interpretation:
            "The shared reader state defines retained fraction as one minus the source-described finger-change fraction. It does not assert an automatic change time or gripping outcome.",
        };
      }
      if (controlKey === "transverseOffsetFraction") {
        return {
          metricName: "Claim 16 Transverse Coordinate",
          derivativeSymbol: "∂q_{trans}/∂u_{trans}",
          derivativeValue: 1,
          derivativeUnit: "normalized coordinate / control fraction",
          interpretation:
            "Identity slope for the source-described reciprocal transverse stage. US 4,765,668 prints no connector stroke, cylinder dimensions, pressure, load, or speed, so this remains a normalized topology sensitivity rather than SI travel or actuator performance.",
        };
      }
      break;
    }

    default:
      break;
  }

  return null;
}
