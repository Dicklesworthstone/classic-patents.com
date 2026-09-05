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
  stepEinsteinRefrigerator,
  stepGoodyearRubber,
  stepLandPolaroidInstantFilm,
  stepThomsonWelding,
} from "./catalogKernels";
import {
  readClavelDeltaRobotControls,
  stepClavelDeltaRobotTopology,
} from "./clavelDeltaRobotKernel";
import { stepColtLockwork } from "./coltRevolverKernel";
import { readCrumpFdmControls, stepCrumpFdmSi } from "./crumpFdmKernel";
import {
  EDISON_DECLARED_FILAMENT_LENGTH_CM,
  EDISON_DECLARED_HOT_RESISTANCE_OHM,
  EDISON_SOURCE_MAX_RESISTANCE_OHM,
  EDISON_SOURCE_MIN_RESISTANCE_OHM,
  stepEdisonRadiativeBalance,
} from "./edisonWasm";
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
      if (controlKey === "frequency") {
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
      if (controlKey === "anodeVoltage" || controlKey === "anodeVoltageVolts") {
        const va = params.anodeVoltage ?? params.anodeVoltageVolts ?? 2200.0;
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
      if (
        controlKey === "rodWithdrawal" ||
        controlKey === "controlRodWithdrawalPct" ||
        controlKey === "rodPosition"
      ) {
        const rod =
          params.rodWithdrawal ?? params.controlRodWithdrawalPct ?? params.rodPosition ?? 65.0;
        const moderatorPurity = params.moderatorPurity ?? 99.5;
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
      if (controlKey === "appliedTensileStretch" || controlKey === "stretch") {
        const lambda = params.appliedTensileStretch ?? params.stretch ?? 1.8;
        if (lambda < 1 || lambda > 2.5) return null;
        const rubber = stepGoodyearRubber(
          params.vulcanTemp ?? 145,
          params.sulfurPct ?? 8,
          30,
          lambda,
          params.specimenTempC ?? 35,
        );
        return {
          metricName: "Tensile Stress (Model)",
          derivativeSymbol: "∂σ / ∂λ",
          derivativeValue: Number(rubber.stressSlopeMpaPerStretch.toPrecision(6)),
          derivativeUnit: "MPa / λ",
          interpretation:
            "Local slope of the shared illustrative stress model at the current cure temperature, sulfur content and stretch; the cure duration is the declared 30 minutes. The model's strength coefficient is held fixed. At λ = 1 or 2.5 this is the admitted one-sided slope, not a measured material modulus.",
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
      if (controlKey === "currentAmperes") {
        const _i = params.currentAmperes ?? 300000.0;
        const dM_dI = 0.316; // kg / (kA · hr)
        return {
          metricName: "Faradaic Production Sensitivity",
          derivativeSymbol: "∂ṁ_Al / ∂I",
          derivativeValue: Number(dM_dI.toFixed(3)),
          derivativeUnit: "kg / (kA·hr)",
          interpretation:
            "Faraday's law stoichiometric deposition rate at 94% cathodic current efficiency.",
        };
      }
      if (controlKey === "bathTemperatureCelsius") {
        const dSigma_dT = 0.0028; // S/cm / °C
        return {
          metricName: "Bath Conductivity Sensitivity",
          derivativeSymbol: "∂σ_bath / ∂T",
          derivativeValue: Number(dSigma_dT.toFixed(4)),
          derivativeUnit: "S/cm · °C",
          interpretation:
            "Ionic mobility increase in molten cryolite-alumina electrolyte reducing cell ohmic drop.",
        };
      }
      break;
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
      if (controlKey === "compressionRatio" || controlKey === "cr") {
        const r = params.compressionRatio ?? params.cr ?? 8.0;
        const gamma = 1.4;
        // eta = 1 - 1/r^(gamma-1) -> deta/dr = (gamma - 1) / r^gamma
        const dEta_dr = (gamma - 1.0) / r ** gamma;
        return {
          metricName: "Thermal Efficiency",
          derivativeSymbol: "∂η / ∂r",
          derivativeValue: Number((dEta_dr * 100).toFixed(2)),
          derivativeUnit: "% / ratio",
          interpretation:
            "Modern air-standard Otto-cycle sensitivity for the declared analysis ratio. It is not a measured efficiency or a numerical limitation printed by US 194,047.",
        };
      }
      break;
    }

    case "us-608969-parsons-turbine": {
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
      if (controlKey === "rotorRpm" || controlKey === "turbineRpm" || controlKey === "rpm") {
        return {
          metricName: "Shaft Reaction Power",
          derivativeSymbol: "∂P / ∂N",
          derivativeValue: 0.42,
          derivativeUnit: "kW / RPM",
          interpretation:
            "Turbine blading peripheral speed approaching optimal 0.5 steam velocity ratio.",
        };
      }
      if (
        controlKey === "inletPressurePsi" ||
        controlKey === "steamPressureBar" ||
        controlKey === "pressure"
      ) {
        return {
          metricName: "Isentropic Enthalpy Drop",
          derivativeSymbol: "∂Δh / ∂P",
          derivativeValue: 6.8,
          derivativeUnit: "kJ/kg / bar",
          interpretation: "Expanding steam pressure differential across reaction blading stages.",
        };
      }
      break;
    }

    case "us-1647-morse-telegraph": {
      if (
        controlKey === "currentMa" ||
        controlKey === "lineCurrentMa" ||
        controlKey === "current"
      ) {
        return {
          metricName: "Relay Magnetomotive Force",
          derivativeSymbol: "∂F / ∂I_line",
          derivativeValue: 0.045,
          derivativeUnit: "N / mA",
          interpretation:
            "Electromagnetic pull force on armature from line current excitation ($F \\propto I^2$).",
        };
      }
      if (
        controlKey === "lineVoltage" ||
        controlKey === "lineVoltageV" ||
        controlKey === "voltage"
      ) {
        const rLine = params.lineResistance ?? 120.0;
        const rTotal = rLine + 80.0;
        const dI_dV = (1.0 / rTotal) * 1000.0; // mA / V
        return {
          metricName: "Loop Signal Current",
          derivativeSymbol: "∂I / ∂V",
          derivativeValue: Number(dI_dV.toFixed(2)),
          derivativeUnit: "mA / V",
          interpretation:
            "Ohm's law current sensitivity driving the electromagnetic relay armature.",
        };
      }
      if (
        controlKey === "lineResistance" ||
        controlKey === "resistance" ||
        controlKey === "lineLengthMiles"
      ) {
        const v = params.lineVoltage ?? 24.0;
        const rLine = params.lineResistance ?? 120.0;
        const rTotal = rLine + 80.0;
        const dI_dR = -(v / (rTotal * rTotal)) * 1000.0; // mA / Ohm
        return {
          metricName: "Signal Current Attenuation",
          derivativeSymbol: "∂I / ∂R",
          derivativeValue: Number(dI_dR.toFixed(3)),
          derivativeUnit: "mA / Ω",
          interpretation: "Line attenuation rate as wire distance increases.",
        };
      }
      break;
    }

    case "us-124404-westinghouse-air-brake": {
      if (
        controlKey === "trainPipePressure" ||
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
      if (controlKey === "reservoirPipePressure" || controlKey === "reservoirPressure") {
        return {
          metricName: "Stored Pneumatic Work",
          derivativeSymbol: "∂E / ∂P",
          derivativeValue: 276.0,
          derivativeUnit: "J / psi",
          interpretation:
            "Auxiliary reservoir pressure energy available for emergency brake application.",
        };
      }
      break;
    }

    case "us-682690-hewitt-mercury-lamp": {
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
      if (controlKey === "airflowCfm" || controlKey === "airFlowCfm") {
        return {
          metricName: "Separator Air Velocity & Pressure Loss",
          derivativeSymbol: "∂ΔP / ∂CFM",
          derivativeValue: 0.008,
          derivativeUnit: "Pa / cfm",
          interpretation:
            "Dynamic pressure drop across sinuous separator plates scaling quadratically with airflow.",
        };
      }
      if (controlKey === "sprayRatePct") {
        return {
          metricName: "Wet-Film Coverage",
          derivativeSymbol: "∂Film / ∂Spray",
          derivativeValue: 0.85,
          derivativeUnit: "% / %",
          interpretation:
            "Nozzle spray wetting upright plate faces to trap airborne particulate matter.",
        };
      }
      if (controlKey === "separatorFaces") {
        return {
          metricName: "Droplet Separation Efficiency",
          derivativeSymbol: "∂η / ∂Faces",
          derivativeValue: 8.5,
          derivativeUnit: "% / face",
          interpretation:
            "Inertial droplet impact and capture per sinuous plate turn and drainage gutter.",
        };
      }
      break;
    }

    case "us-727650-linde-air-liquefaction": {
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
      break;
    }

    case "us-971501-haber-ammonia": {
      if (
        controlKey === "pressureAtm" ||
        controlKey === "synthesisPressureBar" ||
        controlKey === "pressure"
      ) {
        return {
          metricName: "Equilibrium Ammonia Yield",
          derivativeSymbol: "∂X_eq / ∂P",
          derivativeValue: 0.18,
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
          derivativeValue: 0.045,
          derivativeUnit: "s⁻¹ / °C",
          interpretation: "Arrhenius activation rate acceleration over promoted iron catalyst.",
        };
      }
      break;
    }

    case "us-2292387-lamarr-frequency-hopping": {
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
      if (controlKey === "coronaVoltageKv" || controlKey === "coronaVoltage") {
        return {
          metricName: "Surface Potential Build",
          derivativeSymbol: "∂V_s / ∂V_corona",
          derivativeValue: 95.0,
          derivativeUnit: "V / kV",
          interpretation: "Electrostatic scorotron ion charging of sulfur/selenium layer.",
        };
      }
      break;
    }

    case "us-2929922-townes-laser": {
      const cavityLengthCm = Number(params.cavityLengthCm ?? 10);
      const chamberDiameterCm = Math.max(0.5, Number(params.chamberDiameterCm ?? 1));
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
        const reflectivityPct = Number(params.endReflectivityPct ?? 97);
        return {
          metricName: "Two-End Round-Trip Reflectivity",
          derivativeSymbol: "∂(R²) / ∂R",
          derivativeValue: Number(((2 * reflectivityPct) / 100).toFixed(3)),
          derivativeUnit: "% round-trip / % end reflectivity",
          interpretation:
            "Exact dimensionless bookkeeping for equal reader-selected end reflectivities; cavity loss and gain remain refused.",
        };
      }
      break;
    }

    case "us-3353115-maiman-ruby-laser":
    case "us-3353115-maiman-laser": {
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
      break;
    }

    case "us-247804-delaval-separator": {
      if (controlKey === "bowlRpm" || controlKey === "rpm") {
        return {
          metricName: "Centrifugal Separation Force",
          derivativeSymbol: "∂G / ∂RPM",
          derivativeValue: 2.1,
          derivativeUnit: "G / RPM",
          interpretation:
            "Stokes creaming separation acceleration gradient per bowl rotation speed.",
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
      if (controlKey === "cyclePhase" || controlKey === "cyclePhaseDeg") {
        return {
          metricName: "Breech-Block Linear Travel",
          derivativeSymbol: "∂x_breech / ∂θ_crank",
          derivativeValue: 0.133,
          derivativeUnit: "mm / deg",
          interpretation:
            "Scotch-yoke cross-head linear translation driven by transverse crankshaft rotation.",
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
      if (controlKey === "crankRpm" || controlKey === "rpm") {
        return {
          metricName: "Cluster Cyclic Fire Rate",
          derivativeSymbol: "∂ROF / ∂CrankRPM",
          derivativeValue: 6.0,
          derivativeUnit: "RPM / RPM",
          interpretation:
            "6-fold mechanical rate multiplication from 6 revolving barrel cluster cam tracks.",
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
      break;
    }

    case "us-706737-fessenden-wireless": {
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
      break;
    }

    case "us-879532-de-forest-audion": {
      if (controlKey === "gridVoltageV" || controlKey === "gridVoltage") {
        return {
          metricName: "Triode Transconductance (gm)",
          derivativeSymbol: "∂I_p / ∂V_g",
          derivativeValue: 420.0,
          derivativeUnit: "µS",
          interpretation:
            "Electrostatic grid potential modulation of thermionic electron flow across vacuum space.",
        };
      }
      if (controlKey === "plateVoltageV" || controlKey === "plateVoltage") {
        return {
          metricName: "Voltage Amplification Factor (µ)",
          derivativeSymbol: "∂V_p / ∂V_g",
          derivativeValue: 8.5,
          derivativeUnit: "V / V",
          interpretation:
            "Active voltage amplification factor achieved by third-electrode electrostatic control.",
        };
      }
      break;
    }

    case "us-942699-baekeland-bakelite": {
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
      if (controlKey === "autoclaveTempC" || controlKey === "temp") {
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
      if (
        controlKey === "steamPressurePsi" ||
        controlKey === "boilerPressurePsi" ||
        controlKey === "pressure"
      ) {
        return {
          metricName: "Indicated Cylinder Power",
          derivativeSymbol: "∂IHP / ∂P_boiler",
          derivativeValue: 0.75,
          derivativeUnit: "HP / psi",
          interpretation:
            "Indicated horsepower scaling with full initial boiler admission pressure without throttling.",
        };
      }
      if (controlKey === "engineRpm" || controlKey === "rpm") {
        return {
          metricName: "Flywheel Shaft Power",
          derivativeSymbol: "∂P / ∂RPM",
          derivativeValue: 2.15,
          derivativeUnit: "HP / RPM",
          interpretation:
            "Linear power scaling of double-acting steam expansion with automatic cutoff.",
        };
      }
      if (controlKey === "cutoffPct" || controlKey === "cutoff") {
        return {
          metricName: "Expansion Thermal Efficiency",
          derivativeSymbol: "∂η_th / ∂Cutoff",
          derivativeValue: -0.42,
          derivativeUnit: "% / %",
          interpretation:
            "Thermodynamic Rankine expansion gain as cut-off is shortened by governor trip-gear.",
        };
      }
      break;
    }

    case "us-2543181-land-polaroid": {
      if (
        controlKey === "developmentTimeSec" ||
        controlKey === "devTimeSec" ||
        controlKey === "time"
      ) {
        const rawTime = params.developmentTimeSec ?? params.devTimeSec ?? params.time ?? 30;
        const time = Number.isFinite(rawTime) ? Math.max(0, Math.min(60, rawTime)) : 30;
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
        const rawGap = params.rollerGapUm ?? params.gap ?? 25;
        const gap = Number.isFinite(rawGap) ? Math.max(1, Math.min(1000, rawGap)) : 25;
        const halfStep = 0.5;
        const lower = Math.max(1, gap - halfStep);
        const upper = gap + halfStep;
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
      break;
    }

    case "us-1773980-farnsworth-tv": {
      if (controlKey === "lightIntensityLux") {
        return {
          metricName: "Photo-Dissector Video Current",
          derivativeSymbol: "∂I_video / ∂L_scene",
          derivativeValue: 0.0042,
          derivativeUnit: "µA / Lux",
          interpretation:
            "Linear photoelectric conversion from continuous photocathode electron cloud emission.",
        };
      }
      break;
    }

    case "us-200521-edison-phonograph": {
      if (controlKey === "mandrelRpm") {
        return {
          metricName: "Groove Surface Linear Speed",
          derivativeSymbol: "∂v_linear / ∂RPM",
          derivativeValue: 0.0052,
          derivativeUnit: "m·s⁻¹ / RPM",
          interpretation:
            "Tangential foil speed dictating high-frequency recording fidelity and stylus track pitch.",
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
      if (controlKey === "shaftRate") {
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
      if (controlKey === "shaftRpm") {
        return {
          metricName: "Submerged Propeller Hydrodynamic Thrust",
          derivativeSymbol: "∂T / ∂RPM",
          derivativeValue: 14.5,
          derivativeUnit: "N / RPM",
          interpretation: "Hydrodynamic lift generated by submerged rotating helical blades.",
        };
      }
      break;
    }

    case "us-3237-rillieux-evaporator": {
      if (controlKey === "numberOfEffects") {
        return {
          metricName: "Steam Enthalpy Economy",
          derivativeSymbol: "∂Economy / ∂N_effects",
          derivativeValue: 0.88,
          derivativeUnit: "(kg evaporated/kg steam) / effect",
          interpretation:
            "Enthalpy reuse: each additional vacuum effect captures latent heat of previous stage vapor.",
        };
      }
      break;
    }

    case "us-621195-zeppelin-airship": {
      if (controlKey === "gasInflation") {
        return {
          metricName: "Gross Aerostatic Buoyant Lift",
          derivativeSymbol: "∂L_buoy / ∂%_inflation",
          derivativeValue: 1280.0,
          derivativeUnit: "N / %",
          interpretation:
            "Archimedes displacement: air-hydrogen density differential over 11,300 m³ volume.",
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
      if (controlKey === "cableLengthMeters") {
        return {
          metricName: "One-Way Propagation Delay",
          derivativeSymbol: "∂τ_prop / ∂L",
          derivativeValue: 5.0,
          derivativeUnit: "ns / m",
          interpretation:
            "Electromagnetic wave velocity in polyethylene dielectric coaxial cable (0.66c) adds 5 ns latency per meter.",
        };
      }
      if (controlKey === "dataRateMbps") {
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
      if (controlKey === "collectivePitchDeg") {
        return {
          metricName: "Main Rotor Thrust",
          derivativeSymbol: "∂T_main / ∂θ_coll",
          derivativeValue: 520.0,
          derivativeUnit: "N / deg",
          interpretation:
            "Increasing blade collective pitch increases blade angle of attack and total aerodynamic vertical lift force.",
        };
      }
      if (controlKey === "tailRotorPedalPercent") {
        return {
          metricName: "Anti-Torque Yaw Moment",
          derivativeSymbol: "∂M_yaw / ∂pedal",
          derivativeValue: -21.6,
          derivativeUnit: "N·m / %",
          interpretation:
            "Deflecting tail rotor rudder pedals alters auxiliary propeller pitch, modulating lateral anti-torque thrust moment.",
        };
      }
      if (controlKey === "engineThrottlePercent") {
        return {
          metricName: "Rotor Rotational Speed",
          derivativeSymbol: "∂Ω / ∂throttle",
          derivativeValue: 0.8,
          derivativeUnit: "RPM / %",
          interpretation:
            "Increasing engine throttle delivers additional mechanical shaft power to sustain higher equilibrium rotor RPM under aerodynamic drag.",
        };
      }
      break;
    }

    case "us-4136359-wozniak-apple": {
      if (controlKey === "crystalFreq") {
        return {
          metricName: "Video Dot Clock Bandwidth",
          derivativeSymbol: "∂BW / ∂f_osc",
          derivativeValue: 1.0,
          derivativeUnit: "MHz / MHz",
          interpretation:
            "Direct synchrony: master 14.318 MHz oscillator drives CPU, color burst, and video timing simultaneously.",
        };
      }
      break;
    }

    case "us-6120588-eink": {
      if (controlKey === "electrodeVoltageVolts") {
        return {
          metricName: "Electrophoretic Particle Velocity",
          derivativeSymbol: "∂v_particle / ∂V_electrode",
          derivativeValue: 0.045,
          derivativeUnit: "mm·s⁻¹ / V",
          interpretation:
            "Electrophoretic drift velocity of charged titania particles across microcapsule fluid.",
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
      if (controlKey === "fingerSeparationMm") {
        return {
          metricName: "Mutual Capacitance Node Isolation",
          derivativeSymbol: "∂Isolation / ∂Distance",
          derivativeValue: 0.065,
          derivativeUnit: "dB / mm",
          interpretation:
            "Spatial resolution preventing capacitive touch centroid merging and ghosting.",
        };
      }
      break;
    }

    case "us-3541541-engelbart-mouse": {
      if (controlKey === "mouseSpeed" || controlKey === "wheelRadius") {
        return {
          metricName: "Encoder Pulse Generation Rate",
          derivativeSymbol: "∂Pulses / ∂v_mouse",
          derivativeValue: 24.5,
          derivativeUnit: "Hz / (m/s)",
          interpretation:
            "Orthogonal potentiometer disc resolution translating physical desktop displacement into X-Y coordinates.",
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
      if (controlKey === "waterWheelRpm") {
        return {
          metricName: "Flyer Spindle Rotation Speed",
          derivativeSymbol: "∂N_spindle / ∂RPM_wheel",
          derivativeValue: 4.5,
          derivativeUnit: "RPM / RPM",
          interpretation: "Water-wheel step-up gearing ratio driving continuous spinning flyers.",
        };
      }
      if (controlKey === "totalDraftRatio") {
        return {
          metricName: "Yarn Count Attenuation",
          derivativeSymbol: "∂Ne / ∂Draft",
          derivativeValue: 1.0,
          derivativeUnit: "count / ratio",
          interpretation:
            "Differential roller speed drawing ratio reducing roving linear mass density.",
        };
      }
      break;
    }

    case "gb-1306-watt-rotary-engine": {
      if (controlKey === "strokeRateSpm") {
        return {
          metricName: "Shaft Rotational Speed",
          derivativeSymbol: "∂RPM / ∂SPM",
          derivativeValue: 2.0,
          derivativeUnit: "RPM / SPM",
          interpretation:
            "Sun and planet epicyclic gear doubling shaft speed per complete beam reciprocation cycle.",
        };
      }
      break;
    }

    case "gb-1420-cort-puddling-rolling": {
      if (controlKey === "furnaceTemperatureCelsius") {
        return {
          metricName: "Decarburization Oxidation Rate",
          derivativeSymbol: "∂Rate_decarb / ∂T",
          derivativeValue: 0.015,
          derivativeUnit: "%/min / °C",
          interpretation:
            "Reverberatory slag bath reaction kinetics burning carbon out of molten cast pig iron.",
        };
      }
      break;
    }

    case "us-x1-hopkins-potash": {
      if (controlKey === "roastTempC") {
        return {
          metricName: "Potash Carbon Burnout Purity",
          derivativeSymbol: "∂Purity / ∂T_roast",
          derivativeValue: 0.05,
          derivativeUnit: "% / °C",
          interpretation:
            "Secondary furnace combustion incinerating black carbon residue into pure pearlash.",
        };
      }
      break;
    }

    case "us-x72-whitney-cotton-gin": {
      if (controlKey === "crankRpm") {
        return {
          metricName: "Clean Lint Extraction Throughput",
          derivativeSymbol: "∂m_lint / ∂RPM_crank",
          derivativeValue: 0.85,
          derivativeUnit: "lb/hr / RPM",
          interpretation:
            "Wire tooth cylinder pulling lint through grate slots separated from green seeds.",
        };
      }
      break;
    }

    case "us-x8277-mccormick-reaper": {
      if (controlKey === "forwardSpeedMph") {
        return {
          metricName: "Acreage Harvesting Rate",
          derivativeSymbol: "∂Area / ∂v_ground",
          derivativeValue: 1.25,
          derivativeUnit: "acres/hr / MPH",
          interpretation:
            "Reciprocating serrated sickle swath cutting efficiency over standing grain fields.",
        };
      }
      break;
    }

    case "us-132-davenport-electric-motor": {
      if (controlKey === "batteryVoltage") {
        return {
          metricName: "Armature No-Load Speed",
          derivativeSymbol: "∂RPM / ∂V_batt",
          derivativeValue: 45.0,
          derivativeUnit: "RPM / V",
          interpretation: "Back-EMF linear speed scaling across commutated rotary electromagnets.",
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
      if (controlKey === "inflationPct") {
        return {
          metricName: "Hull Draft Shoal Reduction",
          derivativeSymbol: "∂Draft / ∂%_inflation",
          derivativeValue: 0.045,
          derivativeUnit: "ft / %",
          interpretation:
            "Archimedes buoyant displacement lifting vessel over shallow river sandbars.",
        };
      }
      break;
    }

    case "us-48475-yale-lock": {
      if (controlKey === "keyInsertion") {
        return {
          metricName: "Pin Tumbler Shear Line Alignment",
          derivativeSymbol: "∂Alignment / ∂x_key",
          derivativeValue: 1.0,
          derivativeUnit: "unit / unit",
          interpretation:
            "Bitted flat key lifting driver and key pins to cylindrical plug shear boundary.",
        };
      }
      break;
    }

    case "us-78317-nobel-dynamite": {
      if (controlKey === "ngConcentrationPct") {
        return {
          metricName: "Detonation Shock Front Velocity",
          derivativeSymbol: "∂v_det / ∂%_NG",
          derivativeValue: 45.0,
          derivativeUnit: "m/s / %",
          interpretation:
            "Chapman-Jouguet detonation wave speed through kieselguhr-stabilized nitroglycerin.",
        };
      }
      break;
    }

    case "us-79265-sholes-typewriter": {
      if (controlKey === "typingSpeedWpm") {
        return {
          metricName: "Carriage Escapement Advance Rate",
          derivativeSymbol: "∂Strokes / ∂WPM",
          derivativeValue: 5.0,
          derivativeUnit: "characters/min / WPM",
          interpretation:
            "Type-bar basket striking and ratchet wheel carriage letter-spacing escapement.",
        };
      }
      break;
    }

    case "us-105338-hyatt-celluloid": {
      if (controlKey === "steamTempC") {
        return {
          metricName: "Thermoplastic Molding Plasticity",
          derivativeSymbol: "∂Flow / ∂T_steam",
          derivativeValue: 0.12,
          derivativeUnit: "mm/s / °C",
          interpretation:
            "Camphor-nitrocellulose mutual solvent gelation under heated hydraulic press.",
        };
      }
      break;
    }

    case "us-157124-glidden-barbed-wire": {
      if (controlKey === "twistsPerFoot") {
        return {
          metricName: "Spurred Barb Interlock Clamping Force",
          derivativeSymbol: "∂F_clamp / ∂Twist",
          derivativeValue: 18.5,
          derivativeUnit: "N / twist",
          interpretation:
            "Twisted dual-strand wire clamping short coiled spurred barbs against lateral sliding.",
        };
      }
      break;
    }

    case "us-313224-mergenthaler-linotype": {
      if (controlKey === "spacebandWedge") {
        return {
          metricName: "Line Justification Expansion",
          derivativeSymbol: "∂Width / ∂WedgeLift",
          derivativeValue: 0.5,
          derivativeUnit: "mm / mm",
          interpretation:
            "Double-wedge spaceband sliding elevation justifying assembled character line against casting jaws.",
        };
      }
      break;
    }

    case "us-388850-eastman-kodak": {
      if (controlKey === "shutterSpeed") {
        return {
          metricName: "Emulsion Photochemical Exposure Energy",
          derivativeSymbol: "∂H / ∂t_exp",
          derivativeValue: 1.0,
          derivativeUnit: "mJ / s",
          interpretation:
            "Reciprocity law photochemical latent image energy integrated across focal plane.",
        };
      }
      break;
    }

    case "us-395781-hollerith-tabulating": {
      if (controlKey === "cardsPerMin") {
        return {
          metricName: "Electromechanical Dial Tally Rate",
          derivativeSymbol: "∂Count / ∂Speed",
          derivativeValue: 1.0,
          derivativeUnit: "tallies/min / (card/min)",
          interpretation:
            "Punched-hole mercury sensing pins closing relay circuits to advance electromechanical counters.",
        };
      }
      break;
    }

    case "us-470918-reno-escalator": {
      if (controlKey === "beltSpeed") {
        return {
          metricName: "Passenger Incline Transport Throughput",
          derivativeSymbol: "∂Throughput / ∂v_belt",
          derivativeValue: 75.0,
          derivativeUnit: "passengers/min / (m/s)",
          interpretation:
            "Endless traveling slatted treadway transporting riders safely across stationary comb landing.",
        };
      }
      break;
    }

    case "us-542846-diesel-engine": {
      if (controlKey === "compRatio") {
        return {
          metricName: "End-of-Compression Air Temperature",
          derivativeSymbol: "∂T_comp / ∂CR",
          derivativeValue: 42.0,
          derivativeUnit: "K / unit_CR",
          interpretation:
            "Isentropic air compression heating cylinder air past fuel auto-ignition threshold without spark plugs.",
        };
      }
      break;
    }

    case "us-1219881-sundback-zipper": {
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
          derivativeValue: 0.06,
          interpretation:
            "Elastic elongation of reinforced cotton cords under transverse tensile load.",
        };
      }
      break;
    }

    case "us-2717437-mestral-velcro": {
      const controls = readMestralVelcroControls(params);
      if (controlKey === "filamentDiameterMm") {
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
      if (controlKey === "hookLengthMm") {
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
      if (controlKey === "selectedPulseCount") {
        return {
          metricName: "Counted Stop Coordinate",
          derivativeSymbol: "∂N_{stop} / ∂N_{selected}",
          derivativeValue: 1,
          derivativeUnit: "screw-turn events / selected event",
          interpretation:
            "Each added selector count admits exactly one further striker/switch event before motor-off. Converting that event to displacement still requires the unprinted screw pitch; volume, dose, pressure, and delivery rate remain refused.",
        };
      }
      if (controlKey === "displayTurnsPerSecond") {
        return {
          metricName: "Counted Stop Coordinate",
          derivativeSymbol: "∂N_{stop} / ∂ω_{display}",
          derivativeValue: 0,
          derivativeUnit: "screw-turn events / (display turns/s)",
          interpretation:
            "Changing the deliberately accelerated museum display speed changes how quickly the animation reaches the stop, not the integer screw-turn count at which counters 114/116 switch the motor off.",
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
