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

import { stepArkwrightWaterFrame } from "./arkwrightKernel";
import { stepBardeenPointContact } from "./bardeenPointContactKernel";
import {
  stepBaekelandBakelite,
  stepBellTelephone,
  stepCarlsonElectrophotography,
  stepCorlissEngine,
  stepDavenportMotor,
  stepDeForestAudion,
  stepDeLavalSeparator,
  stepEdisonPhonograph,
  stepEinsteinRefrigerator,
  stepEngelbartMouse,
  stepEricssonPropeller,
  stepFessendenWireless,
  stepGatlingGun,
  stepGliddenBarbedWire,
  stepGoodyearRubber,
  stepGrammeDynamo,
  stepHaberAmmonia,
  stepHallAluminium,
  stepHewittMercuryLamp,
  stepHollerithTabulating,
  stepLamarrRecordControl,
  stepLandPolaroidInstantFilm,
  stepLincolnBuoy,
  stepMorseTelegraph,
  stepNobelDynamite,
  stepOttoEngine,
  stepParsonsTurbine,
  stepTeslaTeleautomaton,
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
import {
  COLT_DISPLAY_CHAMBER_COUNT,
  readColtRuntimeControls,
  stepColtLockwork,
} from "./coltRevolverKernel";
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
import { stepHoweSewingMachine } from "./machineKernels";
import { stepMakinoScaraTopology } from "./makinoScaraKernel";
import { readMestralVelcroControls, stepMestralVelcroSi } from "./mestralVelcroKernel";
import { stepMilacronRobotToolchanger } from "./milacronRobotToolchangerKernel";
import { readNoycePlanarLeadControls } from "./noycePlanarLeadKernel";
import {
  OTIS_DECLARED_MAX_DISPLAY_TRAVEL_PER_S,
  readOtisTopologyControls,
  stepOtis1861Topology,
} from "./otisKernel";
import { ROBOT_END_EFFECTOR_TYPICAL_JAW_OPENING_M } from "./robotEndEffectorKernel";
import { readSalisburyRobotHandControls } from "./salisburyRobotHandKernel";
import {
  INITIAL_SIKORSKY_STATE,
  readSikorskyControls,
  stepSikorskyHelicopterSi,
} from "./sikorskyHelicopterKernel";
import { stepStackhouseSourceTopology } from "./stackhouseSourceKernel";
import { stepSundbackZipperSi, ZIPPER_CHAIN_LENGTH_MM } from "./sundbackZipperKernel";
import { stepTeslaTransformerSi } from "./teslaTransformerKernel";
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
      const airspeed =
        params.airspeed ?? params.speed ?? params.airspeedMph ?? params.airspeedKts ?? 28.0;
      const wingWarp = params.wingWarp ?? params.wingWarpDeg ?? params.warp ?? 0;
      const rudder = params.rudder ?? params.rudderDeg ?? params.rudderAngle ?? 0;
      const elevator =
        params.elevator ??
        params.elevatorDeg ??
        params.canard ??
        params.canardDeg ??
        params.pitchAngle ??
        0;
      const rawCoupled =
        params.coupled !== undefined
          ? params.coupled
          : params.coupling !== undefined
            ? params.coupling
            : params.claim18Coupled !== undefined
              ? params.claim18Coupled
              : params.rudderInterlock !== undefined
                ? params.rudderInterlock
                : 1;
      const isCoupled =
        rawCoupled === true ||
        rawCoupled === 1 ||
        rawCoupled === "1" ||
        String(rawCoupled).toLowerCase() === "true";

      if (
        !Number.isFinite(airspeed) ||
        airspeed < 10 ||
        airspeed > 60 ||
        !Number.isFinite(wingWarp) ||
        wingWarp < -20 ||
        wingWarp > 20 ||
        !Number.isFinite(rudder) ||
        rudder < -30 ||
        rudder > 30 ||
        !Number.isFinite(elevator) ||
        elevator < -25 ||
        elevator > 25
      ) {
        return null;
      }

      if (controlKey === "wingWarp" || controlKey === "wingWarpDeg" || controlKey === "warp") {
        const warpProbe = (warpDeg: number) =>
          stepWrightFlyerSi(readWrightControls({ ...params, wingWarp: warpDeg }));
        const dYawDwarp =
          (warpProbe(wingWarp + 0.5).netYawNm - warpProbe(wingWarp - 0.5).netYawNm) / 1.0;
        return {
          metricName: "Adverse Yaw Moment",
          derivativeSymbol: "∂N / ∂δ_warp",
          derivativeValue: Number(dYawDwarp.toFixed(2)),
          derivativeUnit: "N·m / deg",
          interpretation:
            "Central difference of the live kernel. With the Claim 18 rudder interlock engaged the residual gradient is ~0; uncoupled it shows the raw adverse-yaw gradient.",
        };
      }
      if (
        controlKey === "airspeed" ||
        controlKey === "airspeedKts" ||
        controlKey === "airspeedMph" ||
        controlKey === "speed"
      ) {
        const liftProbe = (vMph: number) =>
          stepWrightFlyerSi(readWrightControls({ ...params, airspeed: vMph }));
        const dLiftDv =
          (liftProbe(airspeed + 0.5).liftNewtons - liftProbe(airspeed - 0.5).liftNewtons) / 1.0;
        return {
          metricName: "Aerodynamic Lift",
          derivativeSymbol: "∂L / ∂V",
          derivativeValue: Number(dLiftDv.toFixed(1)),
          derivativeUnit: "N / mph",
          interpretation: "Dynamic pressure lift growth scaling with velocity squared.",
        };
      }
      if (controlKey === "rudder" || controlKey === "rudderDeg" || controlKey === "rudderAngle") {
        if (isCoupled) {
          return null;
        }
        const rudderProbe = (rDeg: number) =>
          stepWrightFlyerSi(readWrightControls({ ...params, coupled: 0, rudder: rDeg }));
        const dYawDrudder =
          (rudderProbe(rudder + 0.5).netYawNm - rudderProbe(rudder - 0.5).netYawNm) / 1.0;
        return {
          metricName: "Rudder Aerodynamic Yaw Moment",
          derivativeSymbol: "∂N / ∂δ_rudder",
          derivativeValue: Number(dYawDrudder.toFixed(2)),
          derivativeUnit: "N·m / deg",
          interpretation:
            "Vertical tail rudder aerodynamic restoring yaw moment counteracting differential wing warp adverse yaw.",
        };
      }
      if (
        controlKey === "elevator" ||
        controlKey === "elevatorDeg" ||
        controlKey === "canard" ||
        controlKey === "canardDeg" ||
        controlKey === "pitchAngle"
      ) {
        const elevProbe = (eDeg: number) =>
          stepWrightFlyerSi(readWrightControls({ ...params, elevator: eDeg }));
        const dPitchDelev =
          (elevProbe(elevator + 0.5).pitchNm - elevProbe(elevator - 0.5).pitchNm) / 1.0;
        return {
          metricName: "Canard Pitch Moment",
          derivativeSymbol: "∂M / ∂δ_canard",
          derivativeValue: Number(dPitchDelev.toFixed(2)),
          derivativeUnit: "N·m / deg",
          interpretation:
            "Forward horizontal canard aerodynamic pitching moment governing aircraft longitudinal trim and angle of attack.",
        };
      }
      if (
        controlKey === "coupled" ||
        controlKey === "coupling" ||
        controlKey === "claim18Coupled" ||
        controlKey === "rudderInterlock"
      ) {
        return {
          metricName: "Claim 18 Rudder Coordination Interlock",
          derivativeSymbol: "ΔState / ΔCoupled",
          derivativeValue: 0,
          derivativeUnit: "state",
          interpretation: isCoupled
            ? "Claim 18 interlock mechanically couples vertical rudder to the hip cradle (0.45° rudder per 1° warp), autonomously nulling adverse yaw."
            : "Claim 18 interlock is disengaged; adverse yaw is uncompensated and requires manual counter-rudder.",
        };
      }
      break;
    }

    case "us-381968-tesla-motor": {
      const freq =
        params.frequency ??
        params.frequencyHz ??
        params.freq ??
        params.freqHz ??
        params.lineFrequency ??
        params.lineFreq ??
        60;
      const rawHum = params.acHum ?? params.hum ?? params.audioHum ?? params.audio ?? 0;
      const acHum = typeof rawHum === "boolean" ? (rawHum ? 1 : 0) : Number(rawHum);

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

      if (
        controlKey === "frequency" ||
        controlKey === "frequencyHz" ||
        controlKey === "freq" ||
        controlKey === "freqHz" ||
        controlKey === "lineFrequency" ||
        controlKey === "lineFreq"
      ) {
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
      if (
        controlKey === "acHum" ||
        controlKey === "hum" ||
        controlKey === "audioHum" ||
        controlKey === "audio"
      ) {
        return {
          metricName: "Acoustic Hum Modulation State",
          derivativeSymbol: "ΔState / ΔHum",
          derivativeValue: 0,
          derivativeUnit: "state",
          interpretation:
            "Binary synthesized AC line-frequency hum audio monitor (Claim 1 generator rotation sonification); state toggle has no physical motor kinematics effect.",
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
      const rawReveal =
        params.sectionRevealFraction ??
        params.sectionReveal ??
        params.revealFraction ??
        params.reveal ??
        params.section;
      if (
        rawReveal !== undefined &&
        (!Number.isFinite(rawReveal) || rawReveal < 0 || rawReveal > 1)
      ) {
        return null;
      }
      const rawArch =
        params.wireArchFraction ??
        params.wireArch ??
        params.archFraction ??
        params.wireHeight ??
        params.wire70Arch ??
        params.arch;
      if (rawArch !== undefined && (!Number.isFinite(rawArch) || rawArch < 0.2 || rawArch > 1)) {
        return null;
      }
      const rawClaim1 =
        params.claim1ConductiveMeansPresent ??
        params.conductiveMeans ??
        params.conductiveMeansPresent ??
        params.claim1 ??
        params.claim1ConductiveMeans ??
        params.interconnections;
      if (
        rawClaim1 !== undefined &&
        (!Number.isFinite(Number(rawClaim1)) || Number(rawClaim1) < 0 || Number(rawClaim1) > 1)
      ) {
        return null;
      }

      if (
        controlKey === "sectionRevealFraction" ||
        controlKey === "sectionReveal" ||
        controlKey === "revealFraction" ||
        controlKey === "reveal" ||
        controlKey === "section"
      ) {
        return {
          metricName: "Displayed Semiconductor Section Reveal",
          derivativeSymbol: "∂s_{display} / ∂s_{reader}",
          derivativeValue: 1,
          derivativeUnit: "fraction / fraction",
          interpretation:
            "Identity slope for the normalized section-view control only; no electrical performance sensitivity is inferred.",
        };
      }
      if (
        controlKey === "wireArchFraction" ||
        controlKey === "wireArch" ||
        controlKey === "archFraction" ||
        controlKey === "wireHeight" ||
        controlKey === "wire70Arch" ||
        controlKey === "arch"
      ) {
        return {
          metricName: "Displayed Wire 70 Arch",
          derivativeSymbol: "∂h_{display} / ∂h_{reader}",
          derivativeValue: 1,
          derivativeUnit: "fraction / fraction",
          interpretation:
            "Identity slope for the normalized drawing geometry only; both bond endpoints remain fixed and no wire inductance or delay is inferred.",
        };
      }
      if (
        controlKey === "claim1ConductiveMeansPresent" ||
        controlKey === "conductiveMeans" ||
        controlKey === "conductiveMeansPresent" ||
        controlKey === "claim1" ||
        controlKey === "claim1ConductiveMeans" ||
        controlKey === "interconnections"
      ) {
        return {
          metricName: "Claim 1 Conductive Means Completion",
          derivativeSymbol: "∂C_1 / ∂m_{conductive}",
          derivativeValue: 1,
          derivativeUnit: "complete / binary switch",
          interpretation:
            "Binary state transition for Claim 1 conductive interconnection means; electrical continuity and oscillation frequency are refused without unprinted geometry.",
        };
      }
      break;
    }

    case "us-2708656-fermi-reactor": {
      const rod =
        params.rodWithdrawal ??
        params.controlRodWithdrawalPct ??
        params.rodPosition ??
        params.rod ??
        params.controlRod ??
        params.withdrawal ??
        83.5;
      const moderatorPurity =
        params.moderatorPurity ??
        params.purity ??
        params.graphitePurity ??
        params.moderatorPurityPct ??
        99.5;
      const claim1 = params.claim1Active ?? params.claim1 ?? params.lattice ?? 1;

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
        controlKey === "rodPosition" ||
        controlKey === "rod" ||
        controlKey === "controlRod" ||
        controlKey === "withdrawal"
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
      if (
        controlKey === "moderatorPurity" ||
        controlKey === "purity" ||
        controlKey === "graphitePurity" ||
        controlKey === "moderatorPurityPct"
      ) {
        return {
          metricName: "Moderator Graphite Purity Margin",
          derivativeSymbol: "∂k_eff / ∂p_graphite",
          derivativeValue: 0,
          derivativeUnit: "k / %",
          interpretation: isClaim1Active
            ? "The patent requires graphite of exceptional purity to minimize parasitic neutron capture, but supplies no calibrated impurity-to-reactivity curve; the admitted model maintains normalized criticality without fabricating ungrounded absorption data."
            : "Claim 1 natural-uranium lattice is withheld; graphite moderator produces zero neutron multiplying effect.",
        };
      }
      if (controlKey === "claim1Active" || controlKey === "claim1" || controlKey === "lattice") {
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
      const rawHz =
        params.clockStepRateHz ??
        params.clockSpeedFactor ??
        params.clockRate ??
        params.stepRate ??
        params.clockHz ??
        params.clockSpeed ??
        params.frequency;
      const rawRatio =
        params.pulseWidthToStepRatio ??
        params.pulseWidthRatio ??
        params.pulseWidth ??
        params.ratio ??
        params.overlapRatio ??
        params.overlap;
      const rawDepth =
        params.pulseDepthNormalized ??
        params.pulseDepth ??
        params.wellDepth ??
        params.depth ??
        params.depthNormalized;
      const rawRun = params.running ?? params.run ?? params.clockRunning ?? params.active;

      if (
        (rawHz !== undefined && (!Number.isFinite(rawHz) || rawHz < 0.2 || rawHz > 2.5)) ||
        (rawRatio !== undefined &&
          (!Number.isFinite(rawRatio) || rawRatio < 0.2 || rawRatio > 0.8)) ||
        (rawDepth !== undefined &&
          (!Number.isFinite(rawDepth) || rawDepth < 0.25 || rawDepth > 1.0)) ||
        (rawRun !== undefined &&
          (!Number.isFinite(Number(rawRun)) || Number(rawRun) < 0 || Number(rawRun) > 1))
      ) {
        return null;
      }

      if (
        controlKey === "pulseWidthToStepRatio" ||
        controlKey === "pulseWidthRatio" ||
        controlKey === "pulseWidth" ||
        controlKey === "ratio" ||
        controlKey === "overlapRatio" ||
        controlKey === "overlap"
      ) {
        return {
          metricName: "Pulse Overlap Ratio",
          derivativeSymbol: "∂(t_p/Δt) / ∂(t_p/Δt)",
          derivativeValue: 1.0,
          derivativeUnit: "ratio / ratio",
          interpretation:
            "Exact sensitivity of the sequential pulse-width-to-step ratio governing Figure 3 potential-well overlap condition (must exceed 1/3 for charge transfer).",
        };
      }

      if (
        controlKey === "clockStepRateHz" ||
        controlKey === "clockSpeedFactor" ||
        controlKey === "clockRate" ||
        controlKey === "stepRate" ||
        controlKey === "clockHz" ||
        controlKey === "clockSpeed" ||
        controlKey === "frequency"
      ) {
        return {
          metricName: "Phase Coordinate Velocity",
          derivativeSymbol: "∂(dSteps/dt) / ∂f_{clock}",
          derivativeValue: 1.0,
          derivativeUnit: "steps/s / Hz",
          interpretation:
            "Rate of change of clock coordinate progression rate with respect to visible phase-step frequency.",
        };
      }

      if (
        controlKey === "pulseDepthNormalized" ||
        controlKey === "pulseDepth" ||
        controlKey === "wellDepth" ||
        controlKey === "depth" ||
        controlKey === "depthNormalized"
      ) {
        return {
          metricName: "Peak Potential-Well Depth",
          derivativeSymbol: "∂Φ_{peak} / ∂d_{norm}",
          derivativeValue: 0.88,
          derivativeUnit: "normalized depth / depth",
          interpretation:
            "Derivative of the maximum potential-well depth with respect to normalized pulse amplitude (0.88 peak slope over the 0.12 baseline).",
        };
      }

      if (
        controlKey === "running" ||
        controlKey === "run" ||
        controlKey === "clockRunning" ||
        controlKey === "active"
      ) {
        return {
          metricName: "Clock Sequence Run State",
          derivativeSymbol: "ΔRun / Δrun",
          derivativeValue: 1.0,
          derivativeUnit: "state / state",
          interpretation:
            "Discrete sensitivity: clock stepping run state (1.0 when running, 0.0 when paused).",
        };
      }

      break;
    }

    case "us-3633-goodyear-rubber": {
      const claim1Active =
        params.claim1Active === undefined
          ? true
          : typeof params.claim1Active === "number"
            ? params.claim1Active >= 0.5
            : Boolean(params.claim1Active);
      const vulcanTemp = params.vulcanTemp ?? params.vulcanizationTempC ?? params.cureTemp ?? 145;
      const sulfurPct = params.sulfurPct ?? params.sulfur ?? 8;
      const specimenTempC = params.specimenTempC ?? params.specimenTemp ?? 35;
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
        if (!claim1Active) {
          return {
            metricName: "Nominal Stress (Model)",
            derivativeSymbol: "∂P_nom / ∂λ",
            derivativeValue: 0,
            derivativeUnit: "MPa / λ",
            interpretation:
              "Claim 1 vulcanization compounding (sulfur and heat) is inactive; unvulcanized gum rubber exhibits plastic flow without cross-linked entropic elasticity.",
          };
        }
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
        if (!claim1Active) {
          return {
            metricName: "Relative Cross-Link Density",
            derivativeSymbol: "∂X_link / ∂%_sulfur",
            derivativeValue: 0,
            derivativeUnit: "ratio / %",
            interpretation:
              "Claim 1 thermal vulcanization process is inactive; sulfur cannot form polysulfide cross-links without thermal activation.",
          };
        }
        return {
          metricName: "Relative Cross-Link Density",
          derivativeSymbol: "∂X_link / ∂%_sulfur",
          derivativeValue: Number(rubber.relativeCrossLinkSlopePerSulfurPct.toPrecision(6)),
          derivativeUnit: "ratio / %",
          interpretation:
            "Disulfide bridge density scaling with sulfur compounding fraction under 30-minute thermal cure kinetics.",
        };
      }
      if (
        controlKey === "vulcanTemp" ||
        controlKey === "vulcanizationTempC" ||
        controlKey === "cureTemp"
      ) {
        if (!claim1Active) {
          return {
            metricName: "Thermal Vulcanization Reaction Rate",
            derivativeSymbol: "∂k_cure / ∂T_cure",
            derivativeValue: 0,
            derivativeUnit: "ratio / °C",
            interpretation:
              "Claim 1 thermal vulcanization compounding is inactive; curing kinetic rate is nullified.",
          };
        }
        return {
          metricName: "Thermal Vulcanization Reaction Rate",
          derivativeSymbol: "∂k_cure / ∂T_cure",
          derivativeValue: Number(rubber.vulcanizationRateSlopePerDegreeC.toPrecision(6)),
          derivativeUnit: "ratio / °C",
          interpretation:
            "First derivative of Arrhenius curing reaction rate with respect to vulcanization temperature (activation energy ~6500 K).",
        };
      }
      if (controlKey === "specimenTempC" || controlKey === "specimenTemp") {
        if (!claim1Active) {
          return {
            metricName: "Entropic Restoring Stress",
            derivativeSymbol: "∂P_nom / ∂T_specimen",
            derivativeValue: 0,
            derivativeUnit: "MPa / °C",
            interpretation:
              "Claim 1 cross-linked elastomer structure is inactive; entropic elasticity scaling with absolute temperature is disabled.",
          };
        }
        return {
          metricName: "Entropic Restoring Stress",
          derivativeSymbol: "∂P_nom / ∂T_specimen",
          derivativeValue: Number(rubber.entropicStressSlopeMpaPerDegreeC.toPrecision(6)),
          derivativeUnit: "MPa / °C",
          interpretation:
            "Direct derivative of entropic restoring stress with absolute temperature ∂P/∂T = P / T_K according to the kinetic theory of rubber elasticity.",
        };
      }
      if (controlKey === "claim1Active" || controlKey === "claim1") {
        return {
          metricName: "Claim 1 Vulcanization Compounding State",
          derivativeSymbol: "∂X_cured / ∂u_claim",
          derivativeValue: 1,
          derivativeUnit: "cured state / claim fraction",
          interpretation:
            "Discrete activation of Claim 1 thermal sulfur-compounding vulcanization process transforming plastic gum into an elastic vulcanizate.",
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
      const tubeRatio =
        params.tubeLengthRatio ?? params.ratio ?? params.ldRatio ?? params.aspectRatio ?? 4.5;
      const pSpin =
        params.primarySpinRpm ?? params.primarySpin ?? params.spinRpm ?? params.primaryRpm ?? 120;
      const gSpin = params.gyroSpinRpm ?? params.gyroSpin ?? params.gyroRpm ?? 6000;
      const auxRelease =
        params.auxiliaryReleaseFraction ??
        params.releaseFraction ??
        params.auxRelease ??
        params.stagingFraction ??
        0;
      const chargeConsumed =
        params.primaryChargeConsumed ?? params.chargeConsumed ?? params.primaryConsumed ?? 0;
      const gyroActive =
        params.gyroEnabled ?? params.gyro ?? params.hasGyro ?? params.gyroActive ?? 1;

      if (
        !Number.isFinite(tubeRatio) ||
        tubeRatio < 1.5 ||
        tubeRatio > 6 ||
        !Number.isFinite(pSpin) ||
        pSpin < 0 ||
        pSpin > 300 ||
        !Number.isFinite(gSpin) ||
        gSpin < 0 ||
        gSpin > 12000 ||
        !Number.isFinite(auxRelease) ||
        auxRelease < 0 ||
        auxRelease > 1 ||
        !Number.isFinite(chargeConsumed) ||
        chargeConsumed < 0 ||
        chargeConsumed > 1 ||
        !Number.isFinite(gyroActive) ||
        gyroActive < 0 ||
        gyroActive > 1
      ) {
        return null;
      }

      if (
        controlKey === "tubeLengthRatio" ||
        controlKey === "ratio" ||
        controlKey === "ldRatio" ||
        controlKey === "aspectRatio"
      ) {
        return {
          metricName: "Claim 2 Ratio Margin",
          derivativeSymbol: "∂(L/D - 3) / ∂(L/D)",
          derivativeValue: 1,
          derivativeUnit: "ratio / ratio",
          interpretation:
            "The printed Claim 2 margin changes one-for-one with the declared tapered-tube length-to-diameter ratio.",
        };
      }
      if (
        controlKey === "primarySpinRpm" ||
        controlKey === "primarySpin" ||
        controlKey === "spinRpm" ||
        controlKey === "primaryRpm"
      ) {
        return {
          metricName: "Primary Angular Velocity",
          derivativeSymbol: "∂ω / ∂N",
          derivativeValue: Number(((2 * Math.PI) / 60).toFixed(6)),
          derivativeUnit: "rad/s / rpm",
          interpretation:
            "Exact revolutions-per-minute to radians-per-second conversion; the source prints no absolute spin rate.",
        };
      }
      if (controlKey === "gyroSpinRpm" || controlKey === "gyroSpin" || controlKey === "gyroRpm") {
        return {
          metricName: "Gyroscope Angular Velocity",
          derivativeSymbol: "∂ω / ∂N",
          derivativeValue: Number(((2 * Math.PI) / 60).toFixed(6)),
          derivativeUnit: "rad/s / rpm",
          interpretation:
            "Exact revolutions-per-minute to radians-per-second conversion; the source prints no absolute spin rate.",
        };
      }
      if (
        controlKey === "auxiliaryReleaseFraction" ||
        controlKey === "releaseFraction" ||
        controlKey === "auxRelease" ||
        controlKey === "stagingFraction"
      ) {
        return {
          metricName: "Auxiliary Rocket Staging Travel",
          derivativeSymbol: "∂(s/L) / ∂f_release",
          derivativeValue: 1.0,
          derivativeUnit: "fraction / fraction",
          interpretation:
            "Normalized axial travel of the secondary rocket along primary guide tube 24 prior to separation.",
        };
      }
      if (
        controlKey === "primaryChargeConsumed" ||
        controlKey === "chargeConsumed" ||
        controlKey === "primaryConsumed"
      ) {
        return {
          metricName: "Claim 1 Staging Firing Interlock",
          derivativeSymbol: "ΔState / ΔCharge",
          derivativeValue: 0,
          derivativeUnit: "state",
          interpretation:
            chargeConsumed >= 0.5
              ? "Primary propellant charge is substantially consumed; auxiliary rocket firing sequence is unlocked (Claim 1 compliant)."
              : "Primary charge is still burning; auxiliary charge firing is locked out to prevent premature staging.",
        };
      }
      if (
        controlKey === "gyroEnabled" ||
        controlKey === "gyro" ||
        controlKey === "hasGyro" ||
        controlKey === "gyroActive"
      ) {
        return {
          metricName: "Claim 7 Gyroscopic Stabilization State",
          derivativeSymbol: "ΔState / ΔGyro",
          derivativeValue: 0,
          derivativeUnit: "state",
          interpretation:
            gyroActive >= 0.5
              ? "Claim 7 gyroscopic apparatus isolates instrument and camera platform from rocket spin (ω_support = 0)."
              : "Gyroscope disengaged; camera platform rotates with primary rocket body.",
        };
      }
      break;
    }

    case "us-400766-hall-aluminium": {
      const current =
        params.currentAmperes ?? params.current ?? params.amperes ?? params.currentA ?? 300000.0;
      const tempC =
        params.bathTemperatureCelsius ??
        params.temperatureCelsius ??
        params.tempC ??
        params.bathTemp ??
        params.bathTempC ??
        960;
      const aluminaPct =
        params.aluminaConcentrationPct ??
        params.aluminaPct ??
        params.aluminaConcentration ??
        params.alumina ??
        5.5;

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
        controlKey === "current" || controlKey === "amperes" || controlKey === "currentA"
          ? "currentAmperes"
          : controlKey === "temperatureCelsius" ||
              controlKey === "tempC" ||
              controlKey === "bathTemp" ||
              controlKey === "bathTempC"
            ? "bathTemperatureCelsius"
            : controlKey === "aluminaPct" ||
                controlKey === "aluminaConcentration" ||
                controlKey === "alumina"
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
      const rpm = params.engineRpm ?? params.rpm ?? params.speedRpm ?? 180;
      const claim1 =
        params.claim1ChargeGradingPresent !== undefined
          ? Boolean(params.claim1ChargeGradingPresent)
          : params.claim1Active !== undefined
            ? Boolean(params.claim1Active)
            : params.chargeGrading !== undefined
              ? Boolean(params.chargeGrading)
              : true;

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
      if (
        controlKey === "claim1ChargeGradingPresent" ||
        controlKey === "chargeGrading" ||
        controlKey === "claim1" ||
        controlKey === "claim1Active"
      ) {
        return {
          metricName: "Claim 1 Charge Stratification",
          derivativeSymbol: "Δη / ΔClaim1",
          derivativeValue: 0,
          derivativeUnit: "efficiency / state",
          interpretation:
            "Claim 1 spatial charge grading condition: US 194,047 claims a stratified charge with air/incombustible gas buffering the combustible charge. The grant provides no numerical measurements for an ungraded replacement charge; no counterfactual efficiency jump is fabricated.",
        };
      }
      if (controlKey === "compressionRatio" || controlKey === "cr") {
        return {
          metricName: "Thermal Efficiency (Air-Standard)",
          derivativeSymbol: "∂η / ∂r",
          derivativeValue: claim1
            ? Number(otto.thermalEfficiencySlopePctPerRatio.toPrecision(6))
            : 0,
          derivativeUnit: "% / ratio",
          interpretation: claim1
            ? "Modern air-standard Otto-cycle sensitivity for the declared analysis ratio before display rounding, holding γ = 1.4 fixed. At public endpoints this is the admitted one-sided slope. It is an illustrative lens, not a measured efficiency or a numerical limitation printed by US 194,047."
            : "Claim 1 charge grading is withheld; no source-backed efficiency consequence is inferred for an ungraded replacement charge.",
        };
      }
      if (controlKey === "engineRpm" || controlKey === "rpm" || controlKey === "speedRpm") {
        return {
          metricName: "Brake Horsepower (Model)",
          derivativeSymbol: "∂P_brake / ∂N",
          derivativeValue: claim1 ? Number(otto.brakeHorsepowerSlopeHpPerRpm.toPrecision(6)) : 0,
          derivativeUnit: "hp / rpm",
          interpretation: claim1
            ? "Linear speed scaling of brake horsepower in this illustrative model at the declared compression ratio, before display rounding."
            : "Claim 1 charge grading is withheld; no source-backed power scaling is inferred without the claimed charge distribution.",
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
        params.brakePressurePsi ??
        params.pipePressure ??
        0;
      const res =
        params.reservoirPipePressure ??
        params.reservoirPipePressurePsi ??
        params.reservoirPressure ??
        90;
      const signal =
        params.signalPulsePressure ??
        params.signalPulsePressurePsi ??
        params.signalPulse ??
        params.signalPressure ??
        0;
      const cockPos = Number(
        params.selectingCockPosition ??
          params.selectingCock ??
          params.cockPosition ??
          params.cockD1 ??
          0,
      );
      const tripPos = Number(
        params.accidentTrip ?? params.trip ?? params.tripCock ?? params.cockE ?? 0,
      );
      const claim1Active = params.claim1Active !== undefined ? Boolean(params.claim1Active) : true;

      if (
        !Number.isFinite(pipe) ||
        pipe < 0 ||
        pipe > 80 ||
        !Number.isFinite(res) ||
        res < 0 ||
        res > 100 ||
        !Number.isFinite(signal) ||
        signal < 0 ||
        signal > 2.5 ||
        !Number.isFinite(cockPos) ||
        cockPos < 0 ||
        cockPos > 1 ||
        !Number.isFinite(tripPos) ||
        tripPos < 0 ||
        tripPos > 2
      ) {
        return null;
      }

      const selectingCockState =
        cockPos === 1 || params.selectingCockState === "reversed" ? "reversed" : "normal";
      const tripModes = ["running", "tripped_derailment", "tripped_parting"] as const;
      const tripCockState =
        typeof tripPos === "number"
          ? (tripModes[tripPos] ?? "running")
          : (params.tripCockState ?? "running");

      const wh = FrankenSimEngine.stepWestinghouseAirBrake({
        trainPipePressurePsi: pipe,
        reservoirPipePressurePsi: res,
        selectingCockState,
        tripCockState,
        signalPulsePressurePsi: signal,
      });

      if (
        controlKey === "trainPipePressure" ||
        controlKey === "trainPipePressurePsi" ||
        controlKey === "brakePipePressure" ||
        controlKey === "brakePressurePsi" ||
        controlKey === "pipePressure"
      ) {
        if (!claim1Active) {
          return {
            metricName: "Brake Clamping Force",
            derivativeSymbol: "∂F_clamp / ∂P",
            derivativeValue: 0,
            derivativeUnit: "N / psi",
            interpretation:
              "Claim 1 continuous dual-pipe and automatic valve arrangement is withheld; absence of trainline pneumatic pressure coupling halts brake cylinder actuation.",
          };
        }
        return {
          metricName: "Brake Clamping Force",
          derivativeSymbol: "∂F_clamp / ∂P",
          derivativeValue: wh.shoeClampingSlopeNPerPsi,
          derivativeUnit: "N / psi",
          interpretation:
            "Linear shoe clamping force increase per psi of brake pipe pressure across 10-inch cylinder and 5:1 brake rigging.",
        };
      }
      if (
        controlKey === "reservoirPipePressure" ||
        controlKey === "reservoirPipePressurePsi" ||
        controlKey === "reservoirPressure"
      ) {
        if (!claim1Active) {
          return {
            metricName: "Stored Pneumatic Work",
            derivativeSymbol: "∂E / ∂P",
            derivativeValue: 0,
            derivativeUnit: "J / psi",
            interpretation:
              "Claim 1 auxiliary reservoir charging line is withheld; auxiliary receiver lacks pneumatic storage for automatic emergency reserve.",
          };
        }
        return {
          metricName: "Stored Pneumatic Work",
          derivativeSymbol: "∂E / ∂P",
          derivativeValue: wh.reservoirWorkSlopeJPerPsi,
          derivativeUnit: "J / psi",
          interpretation:
            "Auxiliary reservoir (40 L) stored pneumatic energy available for emergency equalized brake application.",
        };
      }
      if (
        controlKey === "signalPulsePressure" ||
        controlKey === "signalPulsePressurePsi" ||
        controlKey === "signalPulse" ||
        controlKey === "signalPressure"
      ) {
        return {
          metricName: "Signalling Index Graduation Rate",
          derivativeSymbol: "∂Index / ∂P_signal",
          derivativeValue: wh.signalIndexSlopePerPsi,
          derivativeUnit: "step / psi",
          interpretation:
            "Pneumatic signalling line pressure pulses advancing the cab dial index indicator (0.5 psi per index step).",
        };
      }
      if (
        controlKey === "selectingCockPosition" ||
        controlKey === "selectingCock" ||
        controlKey === "cockPosition" ||
        controlKey === "cockD1"
      ) {
        const pNorm = Math.min(80, pipe);
        const pRev = Math.min(80, res);
        const forceNormKn = (pNorm * 78.5 * 5 * 4.44822) / 1000;
        const forceRevKn = (pRev * 78.5 * 5 * 4.44822) / 1000;
        const deltaForce = Math.abs(forceRevKn - forceNormKn);
        return {
          metricName: "Pneumatic Line Role Assignment",
          derivativeSymbol: "ΔF_clamp / ΔCock",
          derivativeValue: Number(deltaForce.toFixed(1)),
          derivativeUnit: "kN / pos",
          interpretation:
            "Discrete change in shoe clamping force when selecting cock d¹ reverses operating (Pipe B) and auxiliary reservoir (Pipe B¹) lines.",
        };
      }
      if (
        controlKey === "accidentTrip" ||
        controlKey === "trip" ||
        controlKey === "tripCock" ||
        controlKey === "cockE"
      ) {
        const boyleEqualizationPsi = Number(((res * 40) / (40 + 15)).toFixed(1));
        const boyleForceKn = (boyleEqualizationPsi * 78.5 * 5 * 4.44822) / 1000;
        const deltaTripForce = Math.abs(boyleForceKn - wh.shoeClampingForceKn);
        return {
          metricName: "Automatic Emergency Clamping Force",
          derivativeSymbol: "ΔF_clamp / ΔTrip",
          derivativeValue: Number(deltaTripForce.toFixed(1)),
          derivativeUnit: "kN / mode",
          interpretation:
            "Emergency brake shoe clamping force applied automatically when cock e trips upon car derailment or train parting, equalizing receiver D (40 L) into cylinder C (15 L) via Boyle's law.",
        };
      }
      break;
    }

    case "us-682690-hewitt-mercury-lamp": {
      const vMains =
        params.mainsVoltageV ?? params.voltage ?? params.vMains ?? params.arcVoltage ?? 110;
      const rBallast =
        params.ballastResistanceOhms ??
        params.ballast ??
        params.ballastOhms ??
        params.rBallast ??
        params.arcCurrent ??
        12;
      const lenCm = params.tubeLengthCm ?? params.tubeLength ?? params.length ?? 100;
      const diamMm =
        params.tubeDiameterMm ??
        params.diameter ??
        params.tubeDiameter ??
        params.tubeDiamMm ??
        params.diamMm ??
        25;
      const claim1Active = params.claim1Active !== undefined ? Boolean(params.claim1Active) : true;

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

      const h = 1e-4;
      const base = stepHewittMercuryLamp({
        mainsVoltageV: vMains,
        ballastResistanceOhms: rBallast,
        tubeLengthCm: lenCm,
        tubeDiameterMm: diamMm,
      });

      if (
        controlKey === "mainsVoltageV" ||
        controlKey === "voltage" ||
        controlKey === "vMains" ||
        controlKey === "arcVoltage"
      ) {
        if (!claim1Active) {
          return {
            metricName: "Arc Luminous Flux Output",
            derivativeSymbol: "∂Φ / ∂V_supply",
            derivativeValue: 0,
            derivativeUnit: "lm / V",
            interpretation:
              "Claim 1 enclosed evacuated mercury vapor gas discharge arc is withheld; mercury gas remains non-conductive with zero light emission.",
          };
        }
        const fwd = stepHewittMercuryLamp({
          mainsVoltageV: vMains + h,
          ballastResistanceOhms: rBallast,
          tubeLengthCm: lenCm,
          tubeDiameterMm: diamMm,
        });
        const bwd = stepHewittMercuryLamp({
          mainsVoltageV: vMains - h,
          ballastResistanceOhms: rBallast,
          tubeLengthCm: lenCm,
          tubeDiameterMm: diamMm,
        });
        const dPhi_dV =
          (fwd.luminousFluxLumensUnrounded - bwd.luminousFluxLumensUnrounded) / (2 * h);
        return {
          metricName: "Arc Luminous Flux Output",
          derivativeSymbol: "∂Φ / ∂V_supply",
          derivativeValue: dPhi_dV,
          derivativeUnit: "lm / V",
          interpretation:
            "Positive column gas discharge ionization and mercury spectral line excitation scaling with applied mains voltage.",
        };
      }
      if (
        controlKey === "ballastResistanceOhms" ||
        controlKey === "ballast" ||
        controlKey === "ballastOhms" ||
        controlKey === "rBallast" ||
        controlKey === "arcCurrent"
      ) {
        if (!claim1Active) {
          return {
            metricName: "Ballast Luminous Flux Quenching",
            derivativeSymbol: "∂Φ / ∂R_ballast",
            derivativeValue: 0,
            derivativeUnit: "lm / Ω",
            interpretation:
              "Claim 1 gas discharge arc is extinguished; zero arc current flows through ballast resistance.",
          };
        }
        const fwd = stepHewittMercuryLamp({
          mainsVoltageV: vMains,
          ballastResistanceOhms: rBallast + h,
          tubeLengthCm: lenCm,
          tubeDiameterMm: diamMm,
        });
        const bwd = stepHewittMercuryLamp({
          mainsVoltageV: vMains,
          ballastResistanceOhms: rBallast - h,
          tubeLengthCm: lenCm,
          tubeDiameterMm: diamMm,
        });
        const dPhi_dR =
          (fwd.luminousFluxLumensUnrounded - bwd.luminousFluxLumensUnrounded) / (2 * h);
        return {
          metricName: "Ballast Luminous Flux Quenching",
          derivativeSymbol: "∂Φ / ∂R_ballast",
          derivativeValue: dPhi_dR,
          derivativeUnit: "lm / Ω",
          interpretation:
            "Series ballast resistance limits runaway negative-differential arc current, lowering equilibrium luminous flux.",
        };
      }
      if (controlKey === "tubeLengthCm" || controlKey === "tubeLength" || controlKey === "length") {
        return {
          metricName: "Positive Column Voltage Gradient",
          derivativeSymbol: "∂V_arc / ∂L_tube",
          derivativeValue: base.electricFieldVPerCm,
          derivativeUnit: "V / cm",
          interpretation:
            "Uniform electric field gradient in the ionized positive column across tube elongation.",
        };
      }
      if (
        controlKey === "tubeDiameterMm" ||
        controlKey === "diameter" ||
        controlKey === "tubeDiameter" ||
        controlKey === "tubeDiamMm" ||
        controlKey === "diamMm"
      ) {
        if (!claim1Active) {
          return {
            metricName: "Tube Confinement Luminous Flux",
            derivativeSymbol: "∂Φ / ∂D_tube",
            derivativeValue: 0,
            derivativeUnit: "lm / mm",
            interpretation:
              "Claim 1 enclosed evacuated mercury vapor gas discharge arc is withheld; zero arc discharge.",
          };
        }
        const fwd = stepHewittMercuryLamp({
          mainsVoltageV: vMains,
          ballastResistanceOhms: rBallast,
          tubeLengthCm: lenCm,
          tubeDiameterMm: diamMm + h,
        });
        const bwd = stepHewittMercuryLamp({
          mainsVoltageV: vMains,
          ballastResistanceOhms: rBallast,
          tubeLengthCm: lenCm,
          tubeDiameterMm: diamMm - h,
        });
        const dPhi_dD =
          (fwd.luminousFluxLumensUnrounded - bwd.luminousFluxLumensUnrounded) / (2 * h);
        return {
          metricName: "Tube Confinement Luminous Flux",
          derivativeSymbol: "∂Φ / ∂D_tube",
          derivativeValue: dPhi_dD,
          derivativeUnit: "lm / mm",
          interpretation:
            "Plasma column wall-stabilization and surface recombination scaling with internal tube bore diameter.",
        };
      }
      break;
    }

    case "us-808897-carrier-air-conditioner": {
      const cfm = params.airflowCfm ?? params.airFlowCfm ?? params.airflow ?? params.cfm ?? 15000;
      const spray =
        params.sprayRatePct ?? params.sprayRate ?? params.spray ?? params.sprayPct ?? 60;
      const faces =
        params.separatorFaces ??
        params.plateFaces ??
        params.faces ??
        params.separatorFaceCount ??
        6;
      const claim1Active = params.claim1Active !== undefined ? Boolean(params.claim1Active) : true;

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

      const carrier = FrankenSimEngine.stepCarrierAirConditioner({
        airflowCfm: cfm,
        sprayRatePct: spray,
        separatorFaces: faces,
      });
      const isSaturated = (faces - 1) * 8.5 + spray * 0.18 >= 99;

      if (
        controlKey === "airflowCfm" ||
        controlKey === "airFlowCfm" ||
        controlKey === "airflow" ||
        controlKey === "cfm"
      ) {
        return {
          metricName: "Separator Air Velocity & Pressure Loss",
          derivativeSymbol: "∂ΔP / ∂CFM",
          derivativeValue: claim1Active ? carrier.pressureDropSlopePaPerCfm : 0,
          derivativeUnit: "Pa / cfm",
          interpretation: claim1Active
            ? "Dynamic pressure drop across sinuous separator plates scaling quadratically with airflow under the fluid impaction model."
            : "Claim 1's unobstructed front wetted faces and projected rear droplet-separating gutters are withheld; two-stage particle capture and mist elimination are not operative.",
        };
      }
      if (
        controlKey === "sprayRatePct" ||
        controlKey === "sprayRate" ||
        controlKey === "spray" ||
        controlKey === "sprayPct"
      ) {
        return {
          metricName: "Droplet Elimination Wet Spray Sensitivity",
          derivativeSymbol: "∂η / ∂Spray",
          derivativeValue: claim1Active ? carrier.dropletSeparationSlopePerSpray : 0,
          derivativeUnit: "% / %",
          interpretation: !claim1Active
            ? "Claim 1's unobstructed front wetted faces and projected rear droplet-separating gutters are withheld; two-stage particle capture and mist elimination are not operative."
            : isSaturated
              ? "Droplet separation is saturated at maximum 99% capture limit across current plate geometry."
              : "Nozzle spray rate sensitivity contributing to fine particle and droplet capture across wet plate surfaces.",
        };
      }
      if (
        controlKey === "separatorFaces" ||
        controlKey === "plateFaces" ||
        controlKey === "faces" ||
        controlKey === "separatorFaceCount"
      ) {
        return {
          metricName: "Droplet Separation Efficiency",
          derivativeSymbol: "∂η / ∂Faces",
          derivativeValue: claim1Active ? carrier.dropletSeparationSlopePerFace : 0,
          derivativeUnit: "% / face",
          interpretation: !claim1Active
            ? "Claim 1's unobstructed front wetted faces and projected rear droplet-separating gutters are withheld; two-stage particle capture and mist elimination are not operative."
            : isSaturated
              ? "Droplet separation is saturated at maximum 99% capture limit across current plate geometry."
              : "Inertial droplet impact and capture per sinuous plate turn and drainage gutter.",
        };
      }
      break;
    }

    case "us-727650-linde-air-liquefaction": {
      const inletP =
        params.inletPressureAtm ??
        params.throttlePressureBar ??
        params.pressure ??
        params.inletPressure ??
        params.pHigh ??
        75;
      const tCooler =
        params.coolerOutletC ?? params.coolerTempC ?? params.temperature ?? params.tCooler ?? 10;
      const claim1Active = params.claim1Active !== undefined ? Boolean(params.claim1Active) : true;

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

      const linde = FrankenSimEngine.stepLindeAirLiquefaction({
        inletPressureAtm: inletP,
        coolerOutletC: tCooler,
      });

      if (
        controlKey === "inletPressureAtm" ||
        controlKey === "throttlePressureBar" ||
        controlKey === "pressure" ||
        controlKey === "inletPressure" ||
        controlKey === "pHigh"
      ) {
        if (!claim1Active) {
          return {
            metricName: "Joule-Thomson Throttling Drop",
            derivativeSymbol: "∂ΔT_JT / ∂P",
            derivativeValue: 0,
            derivativeUnit: "K / atm",
            interpretation:
              "Claim 1 regenerative counter-current heat exchanger path is withheld; compressed air is expanded once without regenerative accumulation, preventing continuous temperature depression.",
          };
        }
        return {
          metricName: "Joule-Thomson Throttling Drop",
          derivativeSymbol: "∂ΔT_JT / ∂P",
          derivativeValue: linde.jtSlopeKPerAtm,
          derivativeUnit: "K / atm",
          interpretation:
            "Cryogenic isenthalpic expansion cooling gradient per atmosphere of inlet compressor discharge pressure.",
        };
      }
      if (
        controlKey === "coolerOutletC" ||
        controlKey === "coolerTempC" ||
        controlKey === "temperature" ||
        controlKey === "tCooler"
      ) {
        if (!claim1Active) {
          return {
            metricName: "Pre-Cooler Temperature Sensitivity",
            derivativeSymbol: "∂T_exp / ∂T_cooler",
            derivativeValue: 0,
            derivativeUnit: "°C / °C",
            interpretation:
              "Claim 1 regenerative counter-current path is withheld; lack of recirculation breaks thermal coupling to pre-cooler outlet.",
          };
        }
        return {
          metricName: "Pre-Cooler Temperature Sensitivity",
          derivativeSymbol: "∂T_exp / ∂T_cooler",
          derivativeValue: linde.jtSlopeKPerC,
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
      const pos = params.recordPosition ?? params.position ?? params.pos ?? params.recordIndex ?? 0;
      const tone = params.commandTone ?? params.tone ?? params.toneCycles ?? 100;
      const channels =
        params.activeChannels ?? params.channels ?? params.numChannels ?? params.channelCount ?? 88;
      const claim1Active =
        params.claim1Active !== undefined
          ? Boolean(params.claim1Active)
          : params.claim1SynchronizedRecordsPresent !== undefined
            ? Number(params.claim1SynchronizedRecordsPresent) >= 0.5
            : true;

      if (
        !Number.isFinite(pos) ||
        pos < 0 ||
        pos > 6 ||
        !Number.isFinite(tone) ||
        tone < 50 ||
        tone > 1000 ||
        !Number.isFinite(channels) ||
        channels < 1 ||
        channels > 88
      ) {
        return null;
      }

      const lamarr = stepLamarrRecordControl({
        recordPosition: pos,
        commandTone: tone === 500 ? 500 : 100,
        claim1SynchronizedRecordsPresent: claim1Active,
        activeChannels: channels,
      });

      if (
        controlKey === "recordPosition" ||
        controlKey === "position" ||
        controlKey === "pos" ||
        controlKey === "recordIndex" ||
        controlKey === "tapePosition" ||
        controlKey === "row"
      ) {
        return {
          metricName: "Record Index Advance",
          derivativeSymbol: "∂Row / ∂Step",
          derivativeValue: claim1Active ? lamarr.recordIndexSlopePerRow : 0,
          derivativeUnit: "row / step",
          interpretation: claim1Active
            ? "Discrete mechanical stepper advance across slotted paper tape rows."
            : "Claim 1's paired identically slotted records and synchronized receiver actuation are withheld; receiver tuning and command acceptance are not inferred.",
        };
      }
      if (
        controlKey === "activeChannels" ||
        controlKey === "channels" ||
        controlKey === "numChannels" ||
        controlKey === "channelCount"
      ) {
        return {
          metricName: "Jamming Processing Gain",
          derivativeSymbol: "∂G_p / ∂N",
          derivativeValue: claim1Active ? lamarr.processingGainSlopeDbPerChannel : 0,
          derivativeUnit: "dB / channel",
          interpretation: claim1Active
            ? "Spread-spectrum electronic counter-countermeasures processing gain scaling logarithmically with available carrier channels."
            : "Claim 1's paired identically slotted records and synchronized receiver actuation are withheld; spread-spectrum processing gain is not operative.",
        };
      }
      if (
        controlKey === "commandTone" ||
        controlKey === "tone" ||
        controlKey === "toneCycles" ||
        controlKey === "frequencyHz" ||
        controlKey === "toneHz"
      ) {
        return {
          metricName: "Demodulated Filter Discrimination",
          derivativeSymbol: "∂Q / ∂f_tone",
          derivativeValue: claim1Active ? lamarr.acousticFilterSelectivitySlope : 0,
          derivativeUnit: "1 / Hz",
          interpretation: claim1Active
            ? "Acoustic reed and resonant LC filter selectivity separating 100-cycle and 500-cycle guidance impulses."
            : "Claim 1's paired identically slotted records and synchronized receiver actuation are withheld; demodulated filter discrimination is not operative.",
        };
      }
      break;
    }

    case "us-2297691-carlson-electrophotography": {
      const corona =
        params.coronaVoltageKv ??
        params.coronaVoltage ??
        params.coronaKv ??
        params.voltageKv ??
        6.5;
      const exposure =
        params.exposureLuxSec ?? params.exposure ?? params.exposureSec ?? params.luxSec ?? 12;
      const thickness =
        params.layerThicknessUm ??
        params.layerThickness ??
        params.thickness ??
        params.thicknessUm ??
        30;
      const fuserTemp =
        params.fuserTemperatureC ??
        params.fuserTemperature ??
        params.fuserTemp ??
        params.fuserTempC ??
        params.temperature ??
        185;
      const claim1Active = params.claim1Active !== undefined ? Boolean(params.claim1Active) : true;

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

      const carlson = stepCarlsonElectrophotography({
        coronaVoltageKv: corona,
        exposureLuxSec: exposure,
        layerThicknessUm: thickness,
        fuserTemperatureC: fuserTemp,
      });

      if (
        controlKey === "coronaVoltageKv" ||
        controlKey === "coronaVoltage" ||
        controlKey === "coronaKv" ||
        controlKey === "voltageKv"
      ) {
        return {
          metricName: "Surface Potential Build",
          derivativeSymbol: "∂V_s / ∂V_corona",
          derivativeValue: claim1Active ? carlson.coronaSlopeVPerKv : 0,
          derivativeUnit: "V / kV",
          interpretation: claim1Active
            ? "Electrostatic scorotron ion charging of sulfur/selenium layer."
            : "Claim 1's photoconductive electrostatic latent image on a conductive backing is withheld; charge dissipates without latent pattern formation.",
        };
      }
      if (
        controlKey === "exposureLuxSec" ||
        controlKey === "exposure" ||
        controlKey === "exposureSec" ||
        controlKey === "luxSec"
      ) {
        return {
          metricName: "Photoconductive Discharge Sensitivity",
          derivativeSymbol: "∂V_latent / ∂H_exp",
          derivativeValue: claim1Active ? carlson.photoconductiveDischargeSlopeVPerLuxSec : 0,
          derivativeUnit: "V / (lx·s)",
          interpretation: claim1Active
            ? "Photocarrier generation and transit collapsing electrostatic surface charge in illuminated areas."
            : "Claim 1's photoconductive electrostatic latent image on a conductive backing is withheld; charge dissipates without latent pattern formation.",
        };
      }
      if (
        controlKey === "layerThicknessUm" ||
        controlKey === "layerThickness" ||
        controlKey === "thickness" ||
        controlKey === "thicknessUm"
      ) {
        return {
          metricName: "Acceptance Potential Gradient",
          derivativeSymbol: "∂E_int / ∂d_layer",
          derivativeValue: claim1Active ? carlson.internalElectricFieldSlopeKvPerMmPerUm : 0,
          derivativeUnit: "(kV/mm) / µm",
          interpretation: claim1Active
            ? "Dielectric internal electric field gradient scaling inversely with square of photoconductive layer thickness."
            : "Claim 1's photoconductive electrostatic latent image on a conductive backing is withheld; charge dissipates without latent pattern formation.",
        };
      }
      if (
        controlKey === "fuserTemperatureC" ||
        controlKey === "fuserTemperature" ||
        controlKey === "fuserTemp" ||
        controlKey === "fuserTempC" ||
        controlKey === "temperature"
      ) {
        return {
          metricName: "Resin Toner Fixation Quality",
          derivativeSymbol: "∂Bond / ∂T_fuser",
          derivativeValue: claim1Active ? carlson.fuserBondSlopePctPerC : 0,
          derivativeUnit: "% / °C",
          interpretation: claim1Active
            ? "Thermal softening and paper fiber penetration rate of resin toner under heated fuser roll contact."
            : "Claim 1's electrophotographic process is withheld; toner fixation is not operative.",
        };
      }
      break;
    }

    case "us-2929922-townes-laser": {
      const rawLength =
        params.cavityLengthCm ??
        params.cavityLength ??
        params.lengthCm ??
        params.chamberLengthCm ??
        params.length ??
        params.chamberLength;
      if (
        rawLength !== undefined &&
        (!Number.isFinite(rawLength) || rawLength < 3 || rawLength > 40)
      ) {
        return null;
      }
      const cavityLengthCm = Number(rawLength ?? 10);

      const rawDiameter =
        params.chamberDiameterCm ??
        params.chamberDiameter ??
        params.diameterCm ??
        params.diameter ??
        params.tubeDiameterCm ??
        params.boreDiameterCm;
      if (
        rawDiameter !== undefined &&
        (!Number.isFinite(rawDiameter) || rawDiameter < 0.2 || rawDiameter > 5.0)
      ) {
        return null;
      }
      const chamberDiameterCm = Number(rawDiameter ?? 1);

      const rawReflectivity =
        params.endReflectivityPct ??
        params.endReflectivity ??
        params.reflectivityPct ??
        params.reflectivity ??
        params.mirrorReflectivityPct ??
        params.endMirrorReflectivity;
      if (
        rawReflectivity !== undefined &&
        (!Number.isFinite(rawReflectivity) || rawReflectivity < 50 || rawReflectivity > 100)
      ) {
        return null;
      }
      const endReflectivityPct = Number(rawReflectivity ?? 97);

      const rawPump =
        params.pumpExcitationPct ??
        params.pumpExcitation ??
        params.excitationPct ??
        params.pumpPowerPct ??
        params.pump ??
        params.excitation;
      if (rawPump !== undefined && (!Number.isFinite(rawPump) || rawPump < 0 || rawPump > 100)) {
        return null;
      }

      const rawAperture =
        params.modeApertureOpenPct ??
        params.modeAperture ??
        params.apertureOpenPct ??
        params.aperturePct ??
        params.aperture ??
        params.modeSelector;
      if (
        rawAperture !== undefined &&
        (!Number.isFinite(rawAperture) || rawAperture < 0 || rawAperture > 100)
      ) {
        return null;
      }

      const rawModulation =
        params.modulationFieldPct ??
        params.modulationField ??
        params.zeemanFieldPct ??
        params.zeemanField ??
        params.modulation ??
        params.fieldPct;
      if (
        rawModulation !== undefined &&
        (!Number.isFinite(rawModulation) || rawModulation < 0 || rawModulation > 100)
      ) {
        return null;
      }

      const rawClaim1 =
        params.claim1PathPresent ??
        params.claim1 ??
        params.claim1Path ??
        params.communicationsPath ??
        params.pathPresent;
      if (
        rawClaim1 !== undefined &&
        (!Number.isFinite(Number(rawClaim1)) || Number(rawClaim1) < 0 || Number(rawClaim1) > 1)
      ) {
        return null;
      }
      const claim1PathPresent = rawClaim1 !== undefined ? Number(rawClaim1) >= 0.5 : true;

      if (
        controlKey === "cavityLengthCm" ||
        controlKey === "cavityLength" ||
        controlKey === "lengthCm" ||
        controlKey === "chamberLengthCm" ||
        controlKey === "length" ||
        controlKey === "chamberLength"
      ) {
        return {
          metricName: "Chamber Aspect Ratio",
          derivativeSymbol: "∂(L/D) / ∂L",
          derivativeValue: Number((1 / chamberDiameterCm).toFixed(3)),
          derivativeUnit: "ratio / cm",
          interpretation:
            "Exact geometry derivative for the reader-scaled chamber; the patent's illustrative chamber is about 10 cm long and 1 cm in diameter.",
        };
      }
      if (
        controlKey === "chamberDiameterCm" ||
        controlKey === "chamberDiameter" ||
        controlKey === "diameterCm" ||
        controlKey === "diameter" ||
        controlKey === "tubeDiameterCm" ||
        controlKey === "boreDiameterCm"
      ) {
        return {
          metricName: "Chamber Aspect Ratio",
          derivativeSymbol: "∂(L/D) / ∂D",
          derivativeValue: Number((-cavityLengthCm / chamberDiameterCm ** 2).toFixed(3)),
          derivativeUnit: "ratio / cm",
          interpretation:
            "Exact geometry derivative only; no optical gain or output-power sensitivity is inferred.",
        };
      }
      if (
        controlKey === "endReflectivityPct" ||
        controlKey === "endReflectivity" ||
        controlKey === "reflectivityPct" ||
        controlKey === "reflectivity" ||
        controlKey === "mirrorReflectivityPct" ||
        controlKey === "endMirrorReflectivity"
      ) {
        return {
          metricName: "Two-End Round-Trip Reflectivity",
          derivativeSymbol: "∂(R²) / ∂R",
          derivativeValue: Number(((2 * endReflectivityPct) / 100).toFixed(3)),
          derivativeUnit: "% round-trip / % end reflectivity",
          interpretation:
            "Exact dimensionless bookkeeping for equal reader-selected end reflectivities; cavity loss and gain remain refused.",
        };
      }
      if (
        controlKey === "pumpExcitationPct" ||
        controlKey === "pumpExcitation" ||
        controlKey === "excitationPct" ||
        controlKey === "pumpPowerPct" ||
        controlKey === "pump" ||
        controlKey === "excitation"
      ) {
        return {
          metricName: "Illustrative Optical Pump Excitation",
          derivativeSymbol: "∂P_pump / ∂u_pump",
          derivativeValue: claim1PathPresent ? 1.0 : 0,
          derivativeUnit: "% displayed / % reader control",
          interpretation: claim1PathPresent
            ? "Normalized teaching excitation command for potassium vapor optical pumping; US 2,929,922 describes potassium pumping lamps but provides no pump wattage or threshold curve."
            : "Claim 1 communications path withheld: pumping path is disconnected from communications chain (0 % / %).",
        };
      }
      if (
        controlKey === "modeApertureOpenPct" ||
        controlKey === "modeAperture" ||
        controlKey === "apertureOpenPct" ||
        controlKey === "aperturePct" ||
        controlKey === "aperture" ||
        controlKey === "modeSelector"
      ) {
        return {
          metricName: "Illustrative Mode Selection Aperture",
          derivativeSymbol: "∂A_mode / ∂u_aperture",
          derivativeValue: claim1PathPresent ? 1.0 : 0,
          derivativeUnit: "% open / % reader control",
          interpretation: claim1PathPresent
            ? "Normalized focal-plane spatial filter aperture; the patent describes focal-plane mode selection of the lowest-order propagation path without publishing an aperture diameter."
            : "Claim 1 communications path withheld: mode selector is isolated from detector chain (0 % / %).",
        };
      }
      if (
        controlKey === "modulationFieldPct" ||
        controlKey === "modulationField" ||
        controlKey === "zeemanFieldPct" ||
        controlKey === "zeemanField" ||
        controlKey === "modulation" ||
        controlKey === "fieldPct"
      ) {
        return {
          metricName: "Illustrative Zeeman Modulation Field",
          derivativeSymbol: "∂B_Zeeman / ∂u_field",
          derivativeValue: claim1PathPresent ? 1.0 : 0,
          derivativeUnit: "% field / % reader control",
          interpretation: claim1PathPresent
            ? "Normalized longitudinal Zeeman magnetic-field modulation command for amplifier 12; US 2,929,922 discloses Zeeman modulation of atomic line center without specifying field gauss or modulation depth."
            : "Claim 1 communications path withheld: modulation field does not couple to signal path (0 % / %).",
        };
      }
      if (
        controlKey === "claim1PathPresent" ||
        controlKey === "claim1" ||
        controlKey === "claim1Path" ||
        controlKey === "communicationsPath" ||
        controlKey === "pathPresent"
      ) {
        return {
          metricName: "Claim 1 Maser Communications Path",
          derivativeSymbol: "ΔState / ΔClaim1",
          derivativeValue: 0,
          derivativeUnit: "state",
          interpretation: claim1PathPresent
            ? "Claim 1 complete communications system path active: generator 10 → modulated amplifier 12 → detector 13."
            : "Claim 1 communications path interrupted: coherent signal does not traverse from generator to detector.",
        };
      }
      break;
    }

    case "us-3353115-maiman-ruby-laser":
    case "us-3353115-maiman-laser": {
      const pumpEnergy = Number(
        params.pumpEnergyJoules ??
          params.pumpPowerWatts ??
          params.pumpPower ??
          params.pumpEnergy ??
          params.flashEnergy ??
          150,
      );
      const flashDuration = Number(
        params.flashDurationMs ??
          params.flashDuration ??
          params.flashMs ??
          params.pulseDurationMs ??
          params.pulseDuration ??
          params.flashTimeMs ??
          params.durationMs ??
          1.0,
      );
      const rodLength = Number(
        params.rodLengthCm ??
          params.rodLength ??
          params.crystalLengthCm ??
          params.laserRodLength ??
          5.0,
      );
      const outputReflectivity = Number(
        params.outputMirrorReflectivity ??
          params.outputReflectivity ??
          params.mirrorReflectivity ??
          params.r2 ??
          params.couplerReflectivity ??
          0.92,
      );
      const crystalTemp = Number(
        params.crystalTemperatureKelvin ??
          params.crystalTemperature ??
          params.temperatureK ??
          params.temperature ??
          params.tempK ??
          300,
      );

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
        controlKey === "pumpEnergyJoules" ||
        controlKey === "pumpEnergy" ||
        controlKey === "flashEnergy"
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
      if (
        controlKey === "flashDurationMs" ||
        controlKey === "flashDuration" ||
        controlKey === "flashMs" ||
        controlKey === "pulseDurationMs" ||
        controlKey === "pulseDuration" ||
        controlKey === "flashTimeMs" ||
        controlKey === "durationMs"
      ) {
        const tauMetastableMs = 3.0 * (300 / Math.max(80, crystalTemp)) ** 0.35;
        const nTotal = 1.58e19;
        const sigma21 = 2.5e-20 * (300 / Math.max(80, crystalTemp));
        const rodRadiusCm = 0.25;
        const rodVolumeCm3 = Math.PI * rodRadiusCm ** 2 * rodLength;
        const photonEnergyPumpJoules = (6.626e-34 * 3e8) / 520e-9;
        const pumpCouplingEfficiency = 0.22;
        const r1 = 0.999;
        const internalLossAlpha = 0.03;
        const cavityLoss =
          internalLossAlpha + (1 / (2 * rodLength)) * Math.log(1 / (r1 * outputReflectivity));
        const deltaNThreshold = cavityLoss / sigma21;
        const numerator = (nTotal / 2 + deltaNThreshold) * rodVolumeCm3 * photonEnergyPumpJoules;
        const expTerm = Math.exp(-flashDuration / tauMetastableMs);
        const dEth_dt =
          -(numerator * expTerm) / (pumpCouplingEfficiency * tauMetastableMs * (1 - expTerm) ** 2);
        return {
          metricName: "Optical Pumping Threshold Duration Sensitivity",
          derivativeSymbol: "∂E_th / ∂t_flash",
          derivativeValue: Number(dEth_dt.toFixed(2)),
          derivativeUnit: "J / ms",
          interpretation:
            "Sensitivity of the required flash threshold energy to xenon pulse duration governed by metastable state decay kinetics.",
        };
      }
      if (
        controlKey === "crystalTemperatureKelvin" ||
        controlKey === "crystalTemperature" ||
        controlKey === "temperatureK" ||
        controlKey === "temperature" ||
        controlKey === "tempK"
      ) {
        return {
          metricName: "R1 Line Emission Wavelength Shift",
          derivativeSymbol: "∂λ_emission / ∂T",
          derivativeValue: 0.005,
          derivativeUnit: "nm / K",
          interpretation:
            "Thermal expansion and crystal field lattice perturbation shifting the ruby R1 fluorescence line toward shorter wavelengths at cryogenic temperatures.",
        };
      }
      if (
        controlKey === "rodLengthCm" ||
        controlKey === "rodLength" ||
        controlKey === "crystalLengthCm" ||
        controlKey === "laserRodLength"
      ) {
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
      if (
        controlKey === "outputMirrorReflectivity" ||
        controlKey === "outputReflectivity" ||
        controlKey === "mirrorReflectivity" ||
        controlKey === "r2" ||
        controlKey === "couplerReflectivity"
      ) {
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
      if (
        controlKey === "cockingTravelPct" ||
        controlKey === "cockingTravel" ||
        controlKey === "cocking" ||
        controlKey === "travelPct" ||
        controlKey === "travel"
      ) {
        const travel = Number(
          params.cockingTravelPct ??
            params.cockingTravel ??
            params.cocking ??
            params.travelPct ??
            params.travel ??
            0,
        );
        const lowerParams: Record<string, any> = { ...params, cockingTravelPct: travel - 0.5 };
        delete lowerParams.cockingTravel;
        delete lowerParams.cocking;
        delete lowerParams.travelPct;
        delete lowerParams.travel;
        const upperParams: Record<string, any> = { ...params, cockingTravelPct: travel + 0.5 };
        delete upperParams.cockingTravel;
        delete upperParams.cocking;
        delete upperParams.travelPct;
        delete upperParams.travel;
        const lower = stepColtLockwork(lowerParams);
        const upper = stepColtLockwork(upperParams);
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
      if (
        controlKey === "chamberIndex" ||
        controlKey === "chamber" ||
        controlKey === "ward" ||
        controlKey === "wardIndex"
      ) {
        const stepAngle = (2 * Math.PI) / COLT_DISPLAY_CHAMBER_COUNT;
        return {
          metricName: "Base Cylinder Ward Orientation",
          derivativeSymbol: "Δθ_{cyl} / Δward",
          derivativeValue: Number((-stepAngle).toFixed(3)),
          derivativeUnit: "rad/ward",
          interpretation:
            "Discrete step angle of the 5-ward cylinder per index position (–2π/5 rad = –72°/ward). Traced from facsimile Figure 1 display layout.",
        };
      }
      if (controlKey === "claim5ShacklePresent" || controlKey === "claim5Active") {
        const colt = stepColtLockwork(readColtRuntimeControls(params));
        return {
          metricName: "Cylinder-Ratchet Coupling State",
          derivativeSymbol: "Δq_{cyl} / ΔClaim5",
          derivativeValue: colt.ratchetAdvanceFraction,
          derivativeUnit: "fraction / claim",
          interpretation:
            "Discrete coupling of ratchet rotation to cylinder through the claimed shackle connection.",
        };
      }
      if (controlKey === "claim6LockingAndTurningPresent" || controlKey === "claim6Active") {
        const colt = stepColtLockwork(readColtRuntimeControls(params));
        return {
          metricName: "Locking & Turning Sequence State",
          derivativeSymbol: "ΔKey / ΔClaim6",
          derivativeValue: colt.keyRetraction01,
          derivativeUnit: "retraction / claim",
          interpretation:
            "Discrete key withdrawal and ratchet turning sequence coupled to the hammer cocking motion.",
        };
      }
      break;
    }

    case "us-235199-bell-photophone": {
      const dist =
        params.transmissionDistanceM ??
        params.distanceM ??
        params.distance ??
        params.rangeM ??
        params.transmissionDistance ??
        213;
      const spl =
        params.voiceSplDb ??
        params.splDb ??
        params.spl ??
        params.voiceVolume ??
        params.voiceLevelDb ??
        params.soundLevelDb ??
        75;
      const irr =
        params.solarIrradianceWPerM2 ??
        params.beamPowerWatts ??
        params.beamPower ??
        params.solarIrradiance ??
        params.irradiance ??
        950;
      const dia =
        params.collectorDiameterM ??
        params.collectorDiameter ??
        params.apertureDiameterM ??
        params.apertureDiameter ??
        params.collectorDiam ??
        0.5;
      const claim1Active =
        params.claim1Active !== undefined
          ? Boolean(params.claim1Active)
          : params.claim1 !== undefined
            ? Boolean(params.claim1)
            : true;

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
        controlKey === "beamPower" ||
        controlKey === "solarIrradiance" ||
        controlKey === "irradiance"
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
      if (
        controlKey === "voiceSplDb" ||
        controlKey === "splDb" ||
        controlKey === "spl" ||
        controlKey === "voiceVolume" ||
        controlKey === "voiceLevelDb" ||
        controlKey === "soundLevelDb"
      ) {
        return {
          metricName: "Diaphragm Optical Beam Divergence Modulation",
          derivativeSymbol: "∂θ_beam / ∂SPL",
          derivativeValue: claim1Active ? 0.08 : 0,
          derivativeUnit: "mrad / dB",
          interpretation: claim1Active
            ? "Acoustic mirror flexure altering specular light beam angular divergence and focus."
            : "Voice acoustic beam modulation is withheld; specular reflection remains static.",
        };
      }
      if (
        controlKey === "transmissionDistanceM" ||
        controlKey === "distanceM" ||
        controlKey === "distance" ||
        controlKey === "rangeM" ||
        controlKey === "transmissionDistance"
      ) {
        return {
          metricName: "Optical Beam Geometric Divergence Spread",
          derivativeSymbol: "∂D_spot / ∂d",
          derivativeValue: 0.08,
          derivativeUnit: "mm / m",
          interpretation:
            "Linear expansion rate of the projected light spot diameter across transmission distance under angular beam divergence.",
        };
      }
      if (
        controlKey === "collectorDiameterM" ||
        controlKey === "collectorDiameter" ||
        controlKey === "apertureDiameterM" ||
        controlKey === "apertureDiameter" ||
        controlKey === "collectorDiam"
      ) {
        const dArea = Number(((Math.PI / 2) * dia).toFixed(3));
        return {
          metricName: "Parabolic Collector Aperture Area Rate",
          derivativeSymbol: "∂A_col / ∂D_col",
          derivativeValue: dArea,
          derivativeUnit: "m² / m",
          interpretation:
            "Rate of aperture capture area expansion with parabolic collector diameter: ∂(π D² / 4) / ∂D = π D / 2.",
        };
      }
      if (controlKey === "claim1Active" || controlKey === "claim1") {
        return {
          metricName: "Claim 1 Beam Modulation State",
          derivativeSymbol: "ΔState / ΔClaim1",
          derivativeValue: 0,
          derivativeUnit: "state",
          interpretation:
            "Claim 1 protects the method of producing sound by varying the intensity of a ray and directing it upon a sensitive substance. No quantitative loss or gain is fabricated when the state is toggled.",
        };
      }
      break;
    }

    case "us-586193-marconi-radio": {
      const rawAerial =
        params.aerialHeight ??
        params.aerialHeightMeters ??
        params.mastHeightM ??
        params.mastHeight ??
        params.height ??
        params.aerial;
      const rawGap = params.sparkGapMm ?? params.gapMm ?? params.sparkGap ?? params.gap;
      const rawKv =
        params.sparkVoltage ??
        params.sparkVoltageKv ??
        params.inductionCoilKv ??
        params.voltage ??
        params.potentialKv;

      if (
        (rawAerial !== undefined &&
          (!Number.isFinite(rawAerial) || rawAerial < 10 || rawAerial > 120)) ||
        (rawGap !== undefined && (!Number.isFinite(rawGap) || rawGap < 2 || rawGap > 25)) ||
        (rawKv !== undefined && (!Number.isFinite(rawKv) || rawKv < 5 || rawKv > 50))
      ) {
        return null;
      }

      if (
        controlKey === "aerialHeight" ||
        controlKey === "aerialHeightMeters" ||
        controlKey === "mastHeightM" ||
        controlKey === "mastHeight" ||
        controlKey === "height" ||
        controlKey === "aerial"
      ) {
        return {
          metricName: "Mast Studio Scale",
          derivativeSymbol: "∂S_{mast} / ∂h",
          derivativeValue: Number((1 / 88).toFixed(6)),
          derivativeUnit: "scale / m",
          interpretation:
            "Linear scale factor of the vertical aerial mast in the studio projection relative to the 88-meter baseline model.",
        };
      }

      if (
        controlKey === "sparkGapMm" ||
        controlKey === "gapMm" ||
        controlKey === "sparkGap" ||
        controlKey === "gap"
      ) {
        return {
          metricName: "Spark Gap Studio Half-Span",
          derivativeSymbol: "∂s_{gap} / ∂d",
          derivativeValue: Number((0.18 / 23).toFixed(6)),
          derivativeUnit: "span / mm",
          interpretation:
            "Rate of change of the transmitter spark-ball visual separation half-span with respect to spark gap distance.",
        };
      }

      if (
        controlKey === "sparkVoltage" ||
        controlKey === "sparkVoltageKv" ||
        controlKey === "inductionCoilKv" ||
        controlKey === "voltage" ||
        controlKey === "potentialKv"
      ) {
        return {
          metricName: "Induction Coil Display Potential",
          derivativeSymbol: "∂V_{coil} / ∂V_{spark}",
          derivativeValue: 1.0,
          derivativeUnit: "kV / kV",
          interpretation:
            "Direct linear response of the induction coil secondary potential display to the apparatus voltage setting.",
        };
      }

      break;
    }

    case "us-247804-delaval-separator": {
      const rpm = params.bowlRpm ?? params.rotorRpm ?? params.rpm ?? params.speed ?? 6500;
      const flow =
        params.rawMilkFlowLph ??
        params.feedRateLph ??
        params.flow ??
        params.milkFlowLph ??
        params.feedFlow ??
        300;
      const claim1Active = params.claim1Active !== undefined ? Boolean(params.claim1Active) : true;

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

      if (
        controlKey === "bowlRpm" ||
        controlKey === "rotorRpm" ||
        controlKey === "rpm" ||
        controlKey === "speed"
      ) {
        if (!claim1Active) {
          return {
            metricName: "Centrifugal Separation Force",
            derivativeSymbol: "∂G / ∂RPM",
            derivativeValue: 0,
            derivativeUnit: "G / RPM",
            interpretation:
              "Claim 1 vertical rotating chamber and concentric delivery nozzles are withheld; absence of continuous concentric feed/discharge halts continuous centrifugal separation.",
          };
        }
        return {
          metricName: "Centrifugal Separation Force",
          derivativeSymbol: "∂G / ∂RPM",
          derivativeValue: sep.gForceSlopeGPerRpm,
          derivativeUnit: "G / RPM",
          interpretation:
            "Stokes creaming centrifugal acceleration gradient scaling with bowl rotation speed under the rotating disc stack model.",
        };
      }
      if (
        controlKey === "rawMilkFlowLph" ||
        controlKey === "feedRateLph" ||
        controlKey === "flow" ||
        controlKey === "milkFlowLph" ||
        controlKey === "feedFlow"
      ) {
        if (!claim1Active) {
          return {
            metricName: "Continuous Cream Discharge Yield",
            derivativeSymbol: "∂Q_cream / ∂Q_milk",
            derivativeValue: 0,
            derivativeUnit: "(L/h) / (L/h)",
            interpretation:
              "Claim 1 concentric delivery nozzles are withheld; whole milk does not partition into separated cream discharge without concentric collection paths.",
          };
        }
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
      const impulse = params.gasImpulsePct ?? params.muzzleGasPressure ?? 75;
      const claim1Active =
        params.claim1Active === undefined
          ? true
          : typeof params.claim1Active === "number"
            ? params.claim1Active >= 0.5
            : Boolean(params.claim1Active);

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
        if (!claim1Active) {
          return {
            metricName: "Breech-Block Linear Travel",
            derivativeSymbol: "∂x_breech / ∂θ_crank",
            derivativeValue: 0,
            derivativeUnit: "mm / deg",
            interpretation:
              "Claim 1 sliding muzzle sleeve is withheld; uncaptured muzzle gases vent freely without driving the breech mechanism.",
          };
        }
        const thetaRad = (phase * Math.PI) / 180;
        const dx_dDeg = ((24 * Math.PI) / 180) * Math.sin(thetaRad);
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
        if (!claim1Active) {
          return {
            metricName: "Muzzle Sleeve Forward Impulse",
            derivativeSymbol: "∂p_sleeve / ∂P_gas",
            derivativeValue: 0,
            derivativeUnit: "mm / %",
            interpretation:
              "Claim 1 sliding muzzle sleeve is withheld; muzzle expansion pressure cannot impart stroke without the sleeve.",
          };
        }
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
      const rpm =
        params.crankRpm ??
        params.rpm ??
        params.speed ??
        params.crankSpeed ??
        params.handCrankRpm ??
        60;
      const count = params.barrelCount ?? params.barrels ?? params.numBarrels ?? params.count ?? 6;
      const claim1CoRotating =
        params.isShaftCoRotating === undefined && params.claim1Active === undefined
          ? true
          : params.isShaftCoRotating !== undefined
            ? Number(params.isShaftCoRotating) >= 0.5
            : Boolean(params.claim1Active);

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

      const gatling = stepGatlingGun({ crankRpm: rpm, barrelCount: count });

      if (
        controlKey === "crankRpm" ||
        controlKey === "rpm" ||
        controlKey === "speed" ||
        controlKey === "crankSpeed" ||
        controlKey === "handCrankRpm"
      ) {
        if (!claim1CoRotating) {
          return {
            metricName: "Cluster Cyclic Fire Rate",
            derivativeSymbol: "∂ROF / ∂CrankRPM",
            derivativeValue: 0,
            derivativeUnit: "RPM / RPM",
            interpretation:
              "Claim 1 rigid shaft co-rotation is withheld; carrier and barrel cluster are decoupled from main shaft N, halting revolving firing.",
          };
        }
        return {
          metricName: "Cluster Cyclic Fire Rate",
          derivativeSymbol: "∂ROF / ∂CrankRPM",
          derivativeValue: gatling.fireRateSlopeRpmPerCrankRpm ?? count,
          derivativeUnit: "RPM / RPM",
          interpretation: `Mechanical rate multiplication from ${count} revolving barrels driven simultaneously by main shaft cam tracks.`,
        };
      }
      if (
        controlKey === "barrelCount" ||
        controlKey === "barrels" ||
        controlKey === "numBarrels" ||
        controlKey === "count"
      ) {
        if (!claim1CoRotating) {
          return {
            metricName: "Cluster Barrel Scaling",
            derivativeSymbol: "∂ROF / ∂N_barrels",
            derivativeValue: 0,
            derivativeUnit: "rounds/min / barrel",
            interpretation:
              "Claim 1 rigid shaft co-rotation is withheld; adding barrels to an uncoupled shaft produces no cyclic fire rate increase.",
          };
        }
        return {
          metricName: "Cluster Barrel Scaling",
          derivativeSymbol: "∂ROF / ∂N_barrels",
          derivativeValue: gatling.fireRateSlopeRpmPerBarrel ?? rpm,
          derivativeUnit: "rounds/min / barrel",
          interpretation: `Rate of fire increase per added revolving barrel at the current hand-crank rate of ${rpm} RPM.`,
        };
      }
      break;
    }

    case "us-593138-tesla-coil": {
      const fHz =
        params.disturbanceFrequencyHz ??
        params.frequency ??
        params.frequencyHz ??
        params.freq ??
        params.freqHz ??
        925;
      const lMiles =
        params.secondaryLengthMiles ??
        params.secondaryLength ??
        params.secondaryLengthMi ??
        params.lengthMiles ??
        params.wireLength ??
        params.wireLengthMiles ??
        50;
      const claim1Connected =
        params.claim1CommonNodeConnected === undefined && params.claim1Active === undefined
          ? true
          : params.claim1CommonNodeConnected !== undefined
            ? Number(params.claim1CommonNodeConnected) >= 0.5
            : Boolean(params.claim1Active);

      if (
        !Number.isFinite(fHz) ||
        fHz < 500 ||
        fHz > 1500 ||
        !Number.isFinite(lMiles) ||
        lMiles < 25 ||
        lMiles > 75
      ) {
        return null;
      }

      const tesla = stepTeslaTransformerSi({
        disturbanceFrequencyHz: fHz,
        secondaryLengthMiles: lMiles,
      });

      if (
        controlKey === "disturbanceFrequencyHz" ||
        controlKey === "frequency" ||
        controlKey === "frequencyHz" ||
        controlKey === "freq" ||
        controlKey === "freqHz"
      ) {
        if (!claim1Connected) {
          return {
            metricName: "Required Quarter-Wave Length",
            derivativeSymbol: "∂l_{1/4} / ∂f",
            derivativeValue: 0,
            derivativeUnit: "mi / Hz",
            interpretation:
              "Claim 1 primary/secondary/earth common node is withheld; distributed quarter-wave secondary resonance cannot establish.",
          };
        }
        return {
          metricName: "Required Quarter-Wave Length",
          derivativeSymbol: "∂l_{1/4} / ∂f",
          derivativeValue: tesla.quarterWaveSlopeMilesPerHz ?? -46250 / fHz ** 2,
          derivativeUnit: "mi / Hz",
          interpretation: `Derived from $l_{1/4} = v / (4 f)$ at $v = 185,000$ mi/s: marginal secondary wire length reduction ($-46250 / f^2$) at $f = ${fHz}$ Hz.`,
        };
      }
      if (
        controlKey === "secondaryLengthMiles" ||
        controlKey === "secondaryLength" ||
        controlKey === "secondaryLengthMi" ||
        controlKey === "lengthMiles" ||
        controlKey === "wireLength" ||
        controlKey === "wireLengthMiles"
      ) {
        if (!claim1Connected) {
          return {
            metricName: "Electrical Length",
            derivativeSymbol: "∂(βl) / ∂l",
            derivativeValue: 0,
            derivativeUnit: "deg / mi",
            interpretation:
              "Claim 1 primary/secondary/earth common node is withheld; distributed electrical length cannot establish.",
          };
        }
        return {
          metricName: "Electrical Length",
          derivativeSymbol: "∂(βl) / ∂l",
          derivativeValue: tesla.electricalLengthSlopeDegPerMile ?? (360 * fHz) / 185000,
          derivativeUnit: "deg / mi",
          interpretation: `Distributed-wave electrical phase angle gradient ($(360 f) / v$) at $f = ${fHz}$ Hz and $v = 185,000$ mi/s.`,
        };
      }
      if (
        controlKey === "claim1CommonNodeConnected" ||
        controlKey === "claim1" ||
        controlKey === "claim1Active" ||
        controlKey === "commonNode" ||
        controlKey === "earthNode" ||
        controlKey === "groundNode" ||
        controlKey === "nodeConnected"
      ) {
        return {
          metricName: "Claim 1 Common Node Connection",
          derivativeSymbol: "ΔState / ΔClaim1",
          derivativeValue: 0,
          derivativeUnit: "state",
          interpretation:
            "Claim 1 protects the electrical transformer having primary and secondary coils connected at one end to a common terminal and to earth. Withholding this connection prevents quarter-wave standing resonance.",
        };
      }
      break;
    }

    case "us-613809-tesla-teleautomaton": {
      const pulseCount =
        params.pulseCount ??
        params.pulses ??
        params.commandPulses ??
        params.pulsesCount ??
        params.steps ??
        0;
      const rfFreq =
        params.rfFrequency ??
        params.transmitterFreqKhz ??
        params.carrierFreqKhz ??
        params.freq ??
        params.frequency ??
        params.rfFreqKhz ??
        params.carrierFrequency ??
        150;
      const rudder =
        params.rudderAngle ??
        params.rudderAngleDeg ??
        params.rudder ??
        params.rudderDeg ??
        params.steeringAngle ??
        0;
      const throttle =
        params.propellerThrottlePct ??
        params.throttlePct ??
        params.throttle ??
        params.motorThrottle ??
        params.propellerThrottle ??
        75;
      const claim1 =
        params.claim1RotaryCommutatorPresent !== undefined
          ? params.claim1RotaryCommutatorPresent
          : params.claim1Active !== undefined
            ? params.claim1Active
            : params.claim1 !== undefined
              ? params.claim1
              : params.commutatorPresent !== undefined
                ? params.commutatorPresent
                : params.rotaryCommutator !== undefined
                  ? params.rotaryCommutator
                  : true;
      const claim1Active =
        claim1 === true ||
        claim1 === 1 ||
        claim1 === "1" ||
        String(claim1).toLowerCase() === "true";

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

      const tele = stepTeslaTeleautomaton({
        rfFrequency: rfFreq,
        rudderAngle: rudder,
        propellerThrottlePct: throttle,
        pulseCount,
      });

      if (
        controlKey === "rudderAngle" ||
        controlKey === "rudderAngleDeg" ||
        controlKey === "rudder" ||
        controlKey === "rudderDeg" ||
        controlKey === "steeringAngle"
      ) {
        if (!claim1Active) {
          return {
            metricName: "Vessel Turning Curvature",
            derivativeSymbol: "∂κ_turn / ∂θ_rudder",
            derivativeValue: 0,
            derivativeUnit: "m⁻¹ / deg",
            interpretation:
              "Claim 1 coded pulse commutator is withheld; ambient interference causes uncontrolled wild steering oscillations with 0 deterministic rudder sensitivity.",
          };
        }
        return {
          metricName: "Vessel Turning Curvature",
          derivativeSymbol: "∂κ_turn / ∂θ_rudder",
          derivativeValue:
            tele.turningCurvatureSlopePerDeg ??
            (Math.PI / 180 / 12.5) * Math.cos((Math.abs(rudder) * Math.PI) / 180),
          derivativeUnit: "m⁻¹ / deg",
          interpretation: `Hydrodynamic hull turning curvature gradient ($\\partial [\\sin(\\theta)/12.5] / \\partial \\theta$) from wireless servo at deflection $\\theta = ${rudder}°$.`,
        };
      }
      if (
        controlKey === "propellerThrottlePct" ||
        controlKey === "throttlePct" ||
        controlKey === "throttle" ||
        controlKey === "motorThrottle" ||
        controlKey === "propellerThrottle"
      ) {
        if (!claim1Active) {
          return {
            metricName: "Electric Propulsion Motor Thrust",
            derivativeSymbol: "∂T_thrust / ∂throttle",
            derivativeValue: 0,
            derivativeUnit: "N / %",
            interpretation:
              "Claim 1 coded pulse commutator is withheld; spurious RF noise desynchronizes propulsion contact cylinder.",
          };
        }
        return {
          metricName: "Electric Propulsion Motor Thrust",
          derivativeSymbol: "∂T_thrust / ∂throttle",
          derivativeValue: tele.motorThrustSlopeNPerPct ?? (tele.relayEnergized ? 0.85 : 0),
          derivativeUnit: "N / %",
          interpretation: tele.relayEnergized
            ? `Electric motor screw propeller thrust scaling ($85 \\text{ N} \\times \\text{throttle}/100$) under tuned carrier resonance (${rfFreq} kHz).`
            : `RF receiver is detuned from 150 kHz resonance ($f = ${rfFreq}$ kHz); coherer remains high-resistance (100 kΩ) and propulsion relay is de-energized (0 N/%).`,
        };
      }
      if (
        controlKey === "pulseCount" ||
        controlKey === "pulses" ||
        controlKey === "commandPulses" ||
        controlKey === "pulsesCount" ||
        controlKey === "steps"
      ) {
        if (!claim1Active) {
          return {
            metricName: "Escapement Contact Disk Stepping",
            derivativeSymbol: "ΔIndex / ΔPulse",
            derivativeValue: 0,
            derivativeUnit: "pos / pulse",
            interpretation:
              "Claim 1 rotary commutator logic is withheld; command pulses fail to step auxiliary circuits.",
          };
        }
        return {
          metricName: "Escapement Contact Disk Stepping",
          derivativeSymbol: "ΔIndex / ΔPulse",
          derivativeValue: 1,
          derivativeUnit: "pos / pulse",
          interpretation:
            "Each transmitted command pulse trips the sensitive relay and anchor escapement, advancing contact cylinder 8 by one 45° step (8-position sequence).",
        };
      }
      if (
        controlKey === "rfFrequency" ||
        controlKey === "transmitterFreqKhz" ||
        controlKey === "carrierFreqKhz" ||
        controlKey === "freq" ||
        controlKey === "frequency" ||
        controlKey === "rfFreqKhz" ||
        controlKey === "carrierFrequency"
      ) {
        return {
          metricName: "RF Resonance Reception State",
          derivativeSymbol: "∂State / ∂f",
          derivativeValue: 0,
          derivativeUnit: "state / kHz",
          interpretation: tele.isResonant
            ? `Carrier frequency (f = ${rfFreq} kHz) is tuned within the 150 ± 5 kHz resonant passband of receiver tank L-C; coherer conducts at 45 Ω.`
            : `Carrier frequency (f = ${rfFreq} kHz) is detuned outside the 150 ± 5 kHz passband; coherer remains de-energized at 100 kΩ.`,
        };
      }
      if (
        controlKey === "claim1RotaryCommutatorPresent" ||
        controlKey === "claim1" ||
        controlKey === "claim1Active" ||
        controlKey === "commutatorPresent" ||
        controlKey === "rotaryCommutator"
      ) {
        return {
          metricName: "Claim 1 Rotary Commutator Logic",
          derivativeSymbol: "ΔState / ΔClaim1",
          derivativeValue: 0,
          derivativeUnit: "state",
          interpretation:
            "Claim 1 protects the rotary contact cylinder stepping mechanism discriminating command pulses to selectively actuate steering, propulsion, and signaling.",
        };
      }
      break;
    }

    case "us-706737-fessenden-wireless": {
      const fCarrier =
        params.carrierFrequencyKhz ??
        params.carrierFreqKhz ??
        params.carrierFreq ??
        params.frequencyKhz ??
        params.frequency ??
        75;
      const modPct =
        params.audioModulationPct ??
        params.modDepthPct ??
        params.modulationPct ??
        params.modulation ??
        params.modDepth ??
        65;
      const lUh =
        params.antennaTuningUh ??
        params.tuningUh ??
        params.inductanceUh ??
        params.antennaInductanceUh ??
        params.tuningCoilUh ??
        450;
      const distKm =
        params.transmissionDistanceKm ??
        params.distanceKm ??
        params.distance ??
        params.rangeKm ??
        25;

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

      const claim1DistributedCapacityPresent =
        params.claim1DistributedCapacityPresent === undefined && params.claim1Active === undefined
          ? true
          : params.claim1DistributedCapacityPresent !== undefined
            ? Number(params.claim1DistributedCapacityPresent) >= 0.5
            : Boolean(params.claim1Active);

      const fessenden = stepFessendenWireless({
        carrierFrequencyKhz: fCarrier,
        audioModulationPct: modPct,
        antennaTuningUh: lUh,
        transmissionDistanceKm: distKm,
      });

      if (
        controlKey === "carrierFrequencyKhz" ||
        controlKey === "carrierFreqKhz" ||
        controlKey === "carrierFreq" ||
        controlKey === "frequencyKhz" ||
        controlKey === "frequency"
      ) {
        return {
          metricName: "Antenna Radiation Resistance",
          derivativeSymbol: "∂R_rad / ∂f_carrier",
          derivativeValue:
            fessenden.radiationResistanceSlopeOhmsPerKhz ?? (2 * 1.8 * fCarrier) / 75 ** 2,
          derivativeUnit: "Ω / kHz",
          interpretation: `Quadratic frequency dependence of antenna radiation resistance ($R_\\text{rad} = 1.8 (f/75)^2$) at $f = ${fCarrier}$ kHz.`,
        };
      }
      if (
        controlKey === "audioModulationPct" ||
        controlKey === "modDepthPct" ||
        controlKey === "modulationPct" ||
        controlKey === "modulation" ||
        controlKey === "modDepth"
      ) {
        if (!claim1DistributedCapacityPresent) {
          return {
            metricName: "Barretter Audio Signal Current",
            derivativeSymbol: "∂I_audio / ∂m",
            derivativeValue: 0,
            derivativeUnit: "µA / %",
            interpretation:
              "Claim 1 distributed-capacity radiating conductor is withheld; antenna radiation collapses.",
          };
        }
        return {
          metricName: "Barretter Audio Signal Current",
          derivativeSymbol: "∂I_audio / ∂m",
          derivativeValue: fessenden.audioSignalCurrentSlopeUaPerPct,
          derivativeUnit: "µA / %",
          interpretation: `Demodulated audio signal current rate of change with respect to voice modulation depth ($2 I_\\text{audio} / m$) at $m = ${modPct}%.`,
        };
      }
      if (
        controlKey === "transmissionDistanceKm" ||
        controlKey === "distanceKm" ||
        controlKey === "distance" ||
        controlKey === "rangeKm"
      ) {
        if (!claim1DistributedCapacityPresent) {
          return {
            metricName: "Barretter Received RF Power Attenuation",
            derivativeSymbol: "∂P_rx / ∂d",
            derivativeValue: 0,
            derivativeUnit: "µW / km",
            interpretation:
              "Claim 1 distributed-capacity radiating conductor is withheld; zero radiated power reaches receiver.",
          };
        }
        return {
          metricName: "Barretter Received RF Power Attenuation",
          derivativeSymbol: "∂P_rx / ∂d",
          derivativeValue: fessenden.receivedPowerSlopeUWattsPerKm,
          derivativeUnit: "µW / km",
          interpretation: `Inverse-square groundwave propagation path loss gradient ($-2 P_\\text{rx} / d$) at distance $d = ${distKm}$ km.`,
        };
      }
      if (
        controlKey === "antennaTuningUh" ||
        controlKey === "tuningUh" ||
        controlKey === "inductanceUh" ||
        controlKey === "antennaInductanceUh" ||
        controlKey === "tuningCoilUh"
      ) {
        return {
          metricName: "Antenna Resonant Frequency Sensitivity",
          derivativeSymbol: "∂f_res / ∂L",
          derivativeValue: fessenden.resonantFreqSlopeKhzPerUh,
          derivativeUnit: "kHz / µH",
          interpretation: `Antenna LC resonance sensitivity ($-0.5 f_\\text{res} / L$) for top-hat capacity cage at $L = ${lUh}$ µH.`,
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

      if (
        controlKey === "gridSignalAmplitudeMv" ||
        controlKey === "rfInputMv" ||
        controlKey === "rfInput" ||
        controlKey === "signalAmplitude" ||
        controlKey === "signalAmplitudeMv" ||
        controlKey === "inputSignalMv" ||
        controlKey === "gridSignalMv"
      ) {
        if (!claim1GridPresent) {
          return {
            metricName: "Small-Signal Voltage Gain",
            derivativeSymbol: "∂v_out / ∂v_in",
            derivativeValue: 0,
            derivativeUnit: "mV / mV",
            interpretation:
              "Claim 1 interposed conducting grid is withheld; operating as passive diode with zero active small-signal amplification.",
          };
        }
        return {
          metricName: "Small-Signal Voltage Gain",
          derivativeSymbol: "∂v_out / ∂v_in",
          derivativeValue: audion.voltageGain,
          derivativeUnit: "mV / mV",
          interpretation: `Linear small-signal voltage amplification ($A_v = \\mu R_L / (r_p + R_L) = ${audion.voltageGain}$) at input signal $v_\\text{in} = ${rfIn}$ mV.`,
        };
      }
      break;
    }

    case "us-942699-baekeland-bakelite": {
      const tempC =
        params.curingTempC ??
        params.autoclaveTempC ??
        params.temp ??
        params.temperature ??
        params.cureTemp ??
        params.autoclaveTemp ??
        150;
      const pressPsi =
        params.autoclavePressurePsi ??
        params.pressure ??
        params.pressurePsi ??
        params.autoclavePressure ??
        params.vesselPressure ??
        75;
      const catPct = params.catalystPct ?? params.catalyst ?? params.catPct ?? 1.5;
      const timeMin =
        params.curingTimeMin ??
        params.curingTime ??
        params.time ??
        params.timeMin ??
        params.durationMin ??
        60;
      const claim1Active = params.claim1Active !== undefined ? Boolean(params.claim1Active) : true;

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

      const bakelite = stepBaekelandBakelite(tempC, pressPsi, catPct, timeMin);

      if (
        controlKey === "autoclavePressurePsi" ||
        controlKey === "pressure" ||
        controlKey === "pressurePsi" ||
        controlKey === "autoclavePressure" ||
        controlKey === "vesselPressure"
      ) {
        return {
          metricName: "Polymer Void Suppression",
          derivativeSymbol: "∂Density / ∂P",
          derivativeValue: claim1Active ? bakelite.densitySlopeGPerCm3PerPsi : 0,
          derivativeUnit: "(g/cm³) / psi",
          interpretation: claim1Active
            ? "Bakelizer autoclave pressure preventing condensation bubble foaming during thermoset cure."
            : "Claim 1's reaction under heat and pressure in a closed vessel is withheld; boiling volatile water and formaldehyde form a porous spongy foam.",
        };
      }
      if (
        controlKey === "curingTempC" ||
        controlKey === "autoclaveTempC" ||
        controlKey === "temp" ||
        controlKey === "temperature" ||
        controlKey === "cureTemp" ||
        controlKey === "autoclaveTemp"
      ) {
        return {
          metricName: "Crosslinking Kinetics Rate",
          derivativeSymbol: "∂k_crosslink / ∂T",
          derivativeValue: claim1Active ? bakelite.kRateSlopePerC : 0,
          derivativeUnit: "min⁻¹ / °C",
          interpretation: claim1Active
            ? "Thermal activation accelerating phenol-formaldehyde 3D network resin solidification."
            : "Claim 1's closed-vessel condensation reaction is withheld; thermal kinetics do not form an insoluble, infusible compact body.",
        };
      }
      if (
        controlKey === "curingTimeMin" ||
        controlKey === "curingTime" ||
        controlKey === "time" ||
        controlKey === "timeMin" ||
        controlKey === "durationMin" ||
        controlKey === "cureTime"
      ) {
        return {
          metricName: "Polycondensation Conversion Rate",
          derivativeSymbol: "∂p / ∂t",
          derivativeValue: claim1Active ? bakelite.conversionSlopePerMin : 0,
          derivativeUnit: "conversion / min",
          interpretation: claim1Active
            ? "Fractional conversion progression per minute toward Carothers gel point and C-stage network formation."
            : "Claim 1's closed-vessel reaction is withheld; polycondensation progression without pressure produces a defective porous mass.",
        };
      }
      if (
        controlKey === "catalystPct" ||
        controlKey === "catalyst" ||
        controlKey === "catPct" ||
        controlKey === "catalystConcentration" ||
        controlKey === "catalystPercent"
      ) {
        const dK_dCat = (0.8 * bakelite.kRateUnrounded) / (1 + 0.8 * catPct);
        return {
          metricName: "Catalytic Condensation Acceleration",
          derivativeSymbol: "∂k_crosslink / ∂catalyst",
          derivativeValue: claim1Active ? Number(dK_dCat.toPrecision(6)) : 0,
          derivativeUnit: "min⁻¹ / %",
          interpretation: claim1Active
            ? "Basic/acidic condensing agent acceleration of phenol-formaldehyde methylene bridge condensation rate."
            : "Claim 1's closed-vessel reaction is withheld; condensation kinetics without pressure yield a defective porous mass.",
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

    case "us-2524035-bardeen-transistor": {
      const rawSpacing =
        params.pointSpacingMils ??
        params.pointSpacing ??
        params.spacing ??
        params.spacingMils ??
        params.contactSpacing ??
        params.pointSpacingMicrons;
      if (
        rawSpacing !== undefined &&
        (!Number.isFinite(rawSpacing) || rawSpacing < 1 || rawSpacing > 10)
      ) {
        return null;
      }
      const spacing = rawSpacing ?? 2;

      const rawSample =
        params.operatingSample ??
        params.sample ??
        params.sampleNumber ??
        params.tableSample ??
        params.sampleIndex;
      if (
        rawSample !== undefined &&
        (!Number.isFinite(rawSample) || rawSample < 1 || rawSample > 3)
      ) {
        return null;
      }
      const sample = rawSample ?? 1;

      const rawClaim1 =
        params.claim1Active ??
        params.claim1 ??
        params.collectorActive ??
        params.collectorPresent ??
        params.claim1Collector;
      if (
        rawClaim1 !== undefined &&
        (!Number.isFinite(Number(rawClaim1)) || Number(rawClaim1) < 0 || Number(rawClaim1) > 1)
      ) {
        return null;
      }
      const claim1Active =
        rawClaim1 !== undefined
          ? typeof rawClaim1 === "number"
            ? rawClaim1 >= 0.5
            : Boolean(rawClaim1)
          : true;

      const state = stepBardeenPointContact({
        operatingSample: sample,
        pointSpacingMils: spacing,
        claim1Active,
      });

      if (
        controlKey === "pointSpacingMils" ||
        controlKey === "pointSpacing" ||
        controlKey === "spacing" ||
        controlKey === "spacingMils" ||
        controlKey === "contactSpacing" ||
        controlKey === "pointSpacingMicrons"
      ) {
        return {
          metricName: "Point Contact Spacing",
          derivativeSymbol: "∂d / ∂s",
          derivativeValue: claim1Active ? state.pointSpacingSlopeUmPerMil : 0,
          derivativeUnit: "µm / mil",
          interpretation: claim1Active
            ? "Linear mechanical-to-metric conversion of gold point contact spacing on the germanium crystal surface (25.4 µm/mil)."
            : "Claim 1 withheld: collector electrode path removed; transistor action and minority carrier collection across the point contact gap are disabled (0 µm / mil).",
        };
      }
      if (
        controlKey === "operatingSample" ||
        controlKey === "sample" ||
        controlKey === "sampleNumber" ||
        controlKey === "tableSample" ||
        controlKey === "sampleIndex"
      ) {
        const stepDelta = sample === 1 ? -12 : -14;
        return {
          metricName: "Reported Table I Voltage Gain",
          derivativeSymbol: "ΔA_v / ΔSample",
          derivativeValue: claim1Active ? stepDelta : 0,
          derivativeUnit: "× / sample",
          interpretation: claim1Active
            ? `Discrete marginal change in source-reported small-signal voltage gain from Table I sample ${sample} to adjacent sample (${sample === 1 ? "Sample 1: 62× → Sample 2: 50×" : "Sample 2: 50× → Sample 3: 36×"}).`
            : "Claim 1 withheld: collector electrode path removed; transistor action and minority carrier collection are disabled (0× / sample).",
        };
      }
      if (
        controlKey === "claim1Active" ||
        controlKey === "claim1" ||
        controlKey === "collectorActive" ||
        controlKey === "collectorPresent" ||
        controlKey === "claim1Collector"
      ) {
        return {
          metricName: "Claim 1 Point-Contact Collector Path",
          derivativeSymbol: "ΔState / ΔContact",
          derivativeValue: 0,
          derivativeUnit: "state",
          interpretation: claim1Active
            ? "Collector electrode engaged in contact with germanium crystal within preferred 1–10 mil distance of emitter (Claim 1 compliant)."
            : "Claim 1 collector path severed: collector point disengaged; no minority carrier collection or transistor action.",
        };
      }
      break;
    }

    case "us-2543181-land-polaroid": {
      const rawTime =
        params.developmentTimeSec ??
        params.devTimeSec ??
        params.developmentTime ??
        params.devTime ??
        params.time ??
        params.processingTime;
      if (rawTime !== undefined && (!Number.isFinite(rawTime) || rawTime < 0 || rawTime > 60)) {
        return null;
      }
      const rawExposure =
        params.exposureFraction ?? params.exposure ?? params.exposureLevel ?? params.expFraction;
      if (
        rawExposure !== undefined &&
        (!Number.isFinite(rawExposure) || rawExposure < 0 || rawExposure > 1)
      ) {
        return null;
      }
      const rawVisc =
        params.reagentViscosityCp ?? params.viscosity ?? params.viscosityCp ?? params.gelViscosity;
      if (
        rawVisc !== undefined &&
        (!Number.isFinite(rawVisc) || rawVisc < 1000 || rawVisc > 80000)
      ) {
        return null;
      }
      const rawGap = params.rollerGapUm ?? params.gap ?? params.gapUm ?? params.spreadGap;
      if (rawGap !== undefined && (!Number.isFinite(rawGap) || rawGap < 10 || rawGap > 60)) {
        return null;
      }
      const rawPh = params.alkaliPh ?? params.ph ?? params.developerPh ?? params.developerAlkaliPh;
      if (rawPh !== undefined && (!Number.isFinite(rawPh) || rawPh < 10.5 || rawPh > 13.8)) {
        return null;
      }

      const rawClaim1 =
        params.claim1Active ??
        params.claim1 ??
        params.claim1Pod ??
        params.podPresent ??
        params.reagentPod;
      if (
        rawClaim1 !== undefined &&
        (!Number.isFinite(Number(rawClaim1)) || Number(rawClaim1) < 0 || Number(rawClaim1) > 1)
      ) {
        return null;
      }
      const claim1Active =
        rawClaim1 !== undefined
          ? typeof rawClaim1 === "number"
            ? rawClaim1 >= 0.5
            : Boolean(rawClaim1)
          : true;

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

      if (
        controlKey === "claim1Active" ||
        controlKey === "claim1" ||
        controlKey === "claim1Pod" ||
        controlKey === "podPresent" ||
        controlKey === "reagentPod"
      ) {
        return {
          metricName: "Claim 1 Attached Product Path",
          derivativeSymbol: "ΔState / ΔClaim1",
          derivativeValue: 0,
          derivativeUnit: "state",
          interpretation: claim1Active
            ? "Photosensitive layer, receiving sheet, and liquid reagent container form a unitary film assembly spread by pressure rollers (Claim 1 compliant)."
            : "Claim 1 attached product path severed: reagent container detached; no liquid reagent spread or diffusion transfer occurs.",
        };
      }
      break;
    }

    case "us-174465-bell-telephone": {
      const claim1Active =
        params.claim1Active === undefined
          ? true
          : typeof params.claim1Active === "number"
            ? params.claim1Active >= 0.5
            : Boolean(params.claim1Active);
      const db = params.voiceAmplitude ?? params.voiceLevelDb ?? params.spl ?? 75;
      const freq = params.acousticFrequencyHz ?? params.frequency ?? params.freq ?? 440;
      const gap = params.airGap ?? params.diaphragmGapMm ?? params.gap ?? 0.35;
      const volts = params.batteryVoltage ?? params.voltage ?? params.volts ?? 6;
      const cond = params.liquidConductivity ?? params.conductivity ?? params.sigma ?? 1.2;

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

      if (
        controlKey === "voiceAmplitude" ||
        controlKey === "voiceLevelDb" ||
        controlKey === "spl"
      ) {
        if (!claim1Active) {
          return {
            metricName: "Modulated Signal Current",
            derivativeSymbol: "∂I_mod / ∂SPL",
            derivativeValue: 0,
            derivativeUnit: "mA / dB",
            interpretation:
              "Claim 1 continuous electrical undulation is inactive; breaking the variable-resistance circuit prevents acoustic-to-electrical transduction.",
          };
        }
        return {
          metricName: "Modulated Signal Current",
          derivativeSymbol: "∂I_mod / ∂SPL",
          derivativeValue: Number(bell.voiceSlopeMaPerDb.toPrecision(6)),
          derivativeUnit: "mA / dB",
          interpretation:
            "Local slope of modulated signal current with respect to voice sound pressure level under the shared variable-resistance transmitter model at the current diaphragm air gap. At 40 or 95 dB this is the admitted one-sided slope.",
        };
      }
      if (
        controlKey === "acousticFrequencyHz" ||
        controlKey === "frequency" ||
        controlKey === "freq"
      ) {
        if (!claim1Active) {
          return {
            metricName: "Acoustic Angular Frequency",
            derivativeSymbol: "∂ω / ∂f_acoustic",
            derivativeValue: 0,
            derivativeUnit: "rad·s⁻¹ / Hz",
            interpretation: "Claim 1 undulatory acoustic transmission is inactive.",
          };
        }
        return {
          metricName: "Acoustic Angular Frequency",
          derivativeSymbol: "∂ω / ∂f_acoustic",
          derivativeValue: 6.283185,
          derivativeUnit: "rad·s⁻¹ / Hz",
          interpretation:
            "Exact derivative 2π relating cyclic acoustic frequency to angular frequency for the continuous undulatory sound wave.",
        };
      }
      if (controlKey === "airGap" || controlKey === "diaphragmGapMm" || controlKey === "gap") {
        if (!claim1Active) {
          return {
            metricName: "Modulated Signal Current",
            derivativeSymbol: "∂I_mod / ∂gap",
            derivativeValue: 0,
            derivativeUnit: "mA / mm",
            interpretation:
              "Claim 1 variable-resistance liquid electrode arrangement is inactive; electrode immersion has no effect on signal modulation.",
          };
        }
        return {
          metricName: "Modulated Signal Current",
          derivativeSymbol: "∂I_mod / ∂gap",
          derivativeValue: Number(bell.gapSlopeMaPerMm.toPrecision(6)),
          derivativeUnit: "mA / mm",
          interpretation:
            "Inverse-gap gradient of modulated transduction current across the liquid-electrode gap.",
        };
      }
      if (controlKey === "batteryVoltage" || controlKey === "voltage" || controlKey === "volts") {
        if (!claim1Active) {
          return {
            metricName: "Baseline Loop Current",
            derivativeSymbol: "∂I_base / ∂V",
            derivativeValue: 0,
            derivativeUnit: "mA / V",
            interpretation:
              "Claim 1 closed electrical transmission circuit is inactive; no galvanic current flows across open line.",
          };
        }
        return {
          metricName: "Baseline Loop Current",
          derivativeSymbol: "∂I_base / ∂V",
          derivativeValue: Number(bell.currentBaselineSlopeMaPerVolt.toPrecision(6)),
          derivativeUnit: "mA / V",
          interpretation:
            "Ohmic sensitivity of baseline galvanic transmitter current to battery electromotive force (25 · σ mA/V with nominal 40 Ω/S cell geometry).",
        };
      }
      if (
        controlKey === "liquidConductivity" ||
        controlKey === "conductivity" ||
        controlKey === "sigma"
      ) {
        if (!claim1Active) {
          return {
            metricName: "Baseline Loop Current vs Conductivity",
            derivativeSymbol: "∂I_base / ∂σ",
            derivativeValue: 0,
            derivativeUnit: "mA / (S/m)",
            interpretation: "Claim 1 variable-resistance electrolytic cell is inactive.",
          };
        }
        return {
          metricName: "Baseline Loop Current vs Conductivity",
          derivativeSymbol: "∂I_base / ∂σ",
          derivativeValue: Number(bell.currentBaselineSlopeMaPerSiemens.toPrecision(6)),
          derivativeUnit: "mA / (S/m)",
          interpretation:
            "Transconductance sensitivity of baseline galvanic loop current with respect to liquid electrolyte specific conductivity (25 · V mA/(S/m)).",
        };
      }
      if (controlKey === "claim1Active" || controlKey === "claim1") {
        return {
          metricName: "Claim 1 Continuous Electrical Undulation State",
          derivativeSymbol: "∂I_undulatory / ∂u_claim",
          derivativeValue: 1,
          derivativeUnit: "undulation state / claim fraction",
          interpretation:
            "Discrete activation of Claim 1 continuous undulatory electric current transmission representing vocal sounds, contrasting with intermittent make-and-break telegraphic circuits.",
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
        params.anodeVoltage ??
        (params.anodeKv !== undefined ? params.anodeKv * 1000 : undefined) ??
        (params.voltageKv !== undefined ? params.voltageKv * 1000 : undefined) ??
        1500;
      const coilI =
        params.coilCurrent ??
        params.deflectionCoilCurrent ??
        params.deflectionCurrent ??
        params.deflectionCurrentA ??
        0.42;
      const lux = params.lightIntensityLux ?? params.lightIntensity ?? params.lux ?? 500;
      const hFreq =
        params.horizontalFreqKhz ??
        params.hFreq ??
        params.horizontalFreq ??
        params.lineFreqKhz ??
        params.hScanFreq ??
        15.75;
      const vFreq =
        params.verticalFreqHz ??
        params.vFreq ??
        params.verticalFreq ??
        params.frameFreqHz ??
        params.vScanFreq ??
        60;
      const lines = params.scanLines ?? params.lines ?? params.rasterLines ?? params.numLines ?? 60;
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
          controlKey === "lux" ||
          controlKey === "coilCurrent" ||
          controlKey === "deflectionCoilCurrent" ||
          controlKey === "deflectionCurrent" ||
          controlKey === "deflectionCurrentA" ||
          controlKey === "anodeVoltage" ||
          controlKey === "anodeKv" ||
          controlKey === "voltageKv" ||
          controlKey === "horizontalFreqKhz" ||
          controlKey === "hFreq" ||
          controlKey === "horizontalFreq" ||
          controlKey === "lineFreqKhz" ||
          controlKey === "hScanFreq" ||
          controlKey === "verticalFreqHz" ||
          controlKey === "vFreq" ||
          controlKey === "verticalFreq" ||
          controlKey === "frameFreqHz" ||
          controlKey === "vScanFreq" ||
          controlKey === "scanLines" ||
          controlKey === "lines" ||
          controlKey === "rasterLines" ||
          controlKey === "numLines"
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

      if (
        controlKey === "lightIntensityLux" ||
        controlKey === "lightIntensity" ||
        controlKey === "lux"
      ) {
        return {
          metricName: "Photo-Dissector Video Current",
          derivativeSymbol: "∂I_video / ∂L_scene",
          derivativeValue: Number(beam.photocathodeCurrentSlopeUaPerLux.toPrecision(6)),
          derivativeUnit: "µA / Lux",
          interpretation:
            "Linear photoelectric conversion from continuous photocathode electron cloud emission under the admitted 0.045 µA/Lux quantum sensitivity model.",
        };
      }
      if (
        controlKey === "coilCurrent" ||
        controlKey === "deflectionCoilCurrent" ||
        controlKey === "deflectionCurrent" ||
        controlKey === "deflectionCurrentA"
      ) {
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
      if (controlKey === "anodeKv" || controlKey === "voltageKv") {
        return {
          metricName: "Electron Beam Velocity Acceleration Sensitivity",
          derivativeSymbol: "∂v / ∂V_anode_kV",
          derivativeValue: Number(beam.electronVelocitySlopeKmSPerKv.toPrecision(6)),
          derivativeUnit: "km·s⁻¹ / kV",
          interpretation: `Relativistic electron beam velocity scaling per kilovolt ($v = \\sqrt{2 q V / m}$, $\\partial v / \\partial V_\\text{kV} = 1000 \\cdot v / (2 V)$) at current anode potential ${(anodeV / 1000).toFixed(2)} kV.`,
        };
      }
      if (
        controlKey === "horizontalFreqKhz" ||
        controlKey === "hFreq" ||
        controlKey === "horizontalFreq" ||
        controlKey === "lineFreqKhz" ||
        controlKey === "hScanFreq"
      ) {
        return {
          metricName: "Horizontal Line Sweep Angular Frequency",
          derivativeSymbol: "∂ω_H / ∂f_H",
          derivativeValue: Number((2000 * Math.PI).toFixed(4)),
          derivativeUnit: "rad·s⁻¹ / kHz",
          interpretation:
            "Harmonic deflection frequency of the horizontal magnetic line-scanning coil driving electron image dissection.",
        };
      }
      if (
        controlKey === "verticalFreqHz" ||
        controlKey === "vFreq" ||
        controlKey === "verticalFreq" ||
        controlKey === "frameFreqHz" ||
        controlKey === "vScanFreq"
      ) {
        return {
          metricName: "Vertical Frame Sweep Angular Frequency",
          derivativeSymbol: "∂ω_V / ∂f_V",
          derivativeValue: Number((2 * Math.PI).toFixed(6)),
          derivativeUnit: "rad·s⁻¹ / Hz",
          interpretation:
            "Field repetition rate of the sawtooth magnetic vertical frame-scanning field.",
        };
      }
      if (
        controlKey === "scanLines" ||
        controlKey === "lines" ||
        controlKey === "rasterLines" ||
        controlKey === "numLines"
      ) {
        return {
          metricName: "Raster Line Pitch Fraction",
          derivativeSymbol: "∂(Δy/H) / ∂N_lines",
          derivativeValue: Number((-100 / (lines * lines)).toFixed(5)),
          derivativeUnit: "% / line",
          interpretation:
            "Line-to-line vertical aperture traversal spacing per scan line across the electrical image.",
        };
      }
      break;
    }

    case "us-200521-edison-phonograph": {
      const rpm =
        params.mandrelRpm ??
        params.rpm ??
        params.cylinderRpm ??
        params.mandrelSpeed ??
        params.speed ??
        params.clockworkRpm ??
        60;
      const vol =
        params.voiceVolumeDb ??
        params.voiceVolume ??
        params.volumeDb ??
        params.volume ??
        params.diaphragmExcitation ??
        params.spl ??
        75;

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

      const claim1FoilPresent =
        params.claim1FoilPresent === undefined && params.claim1Active === undefined
          ? true
          : params.claim1FoilPresent !== undefined
            ? Number(params.claim1FoilPresent) >= 0.5
            : Boolean(params.claim1Active);

      const phono = stepEdisonPhonograph({ mandrelRpm: rpm, voiceVolumeDb: vol });

      if (
        controlKey === "mandrelRpm" ||
        controlKey === "rpm" ||
        controlKey === "cylinderRpm" ||
        controlKey === "mandrelSpeed" ||
        controlKey === "speed" ||
        controlKey === "clockworkRpm"
      ) {
        return {
          metricName: "Illustrative Helical Advance",
          derivativeSymbol: "∂v_axial / ∂RPM",
          derivativeValue: Number(
            (phono.axialTravelSlopeMmPerSPerRpm ?? phono.leadScrewPitchMm / 60).toPrecision(6),
          ),
          derivativeUnit: "(mm/s) / RPM",
          interpretation: `Axial carriage travel velocity along the 10-thread-per-inch lead screw pitch (${phono.leadScrewPitchMm} mm/rev) at the current rotational speed.`,
        };
      }
      if (
        controlKey === "voiceVolumeDb" ||
        controlKey === "voiceVolume" ||
        controlKey === "volumeDb" ||
        controlKey === "volume" ||
        controlKey === "diaphragmExcitation" ||
        controlKey === "spl"
      ) {
        if (!claim1FoilPresent) {
          return {
            metricName: "Stylus Indentation Amplitude (Illustrative)",
            derivativeSymbol: "∂A_stylus / ∂SPL",
            derivativeValue: 0,
            derivativeUnit: "mm / unit",
            interpretation:
              "Claim 1 pliable recording foil is withheld; rigid stylus cannot emboss sound grooves without tearing.",
          };
        }
        return {
          metricName: "Stylus Indentation Amplitude (Illustrative)",
          derivativeSymbol: "∂A_stylus / ∂SPL",
          derivativeValue: Number((phono.stylusAmpSlopeMmPerDb ?? 0.00125 / 75).toPrecision(6)),
          derivativeUnit: "mm / unit",
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
      const otis = stepOtis1861Topology(readOtisTopologyControls(params));

      if (
        controlKey === "displayRatePct" ||
        controlKey === "displayRate" ||
        controlKey === "ratePct"
      ) {
        return {
          metricName: "Declared Coordinate-Speed Magnitude",
          derivativeSymbol: "∂|dq_D/dt| / ∂r_display",
          derivativeValue:
            otis.displayRateSlopePerPct ?? OTIS_DECLARED_MAX_DISPLAY_TRAVEL_PER_S / 100,
          derivativeUnit: "normalized coordinate·s⁻¹ / %",
          interpretation:
            "Sensitivity of the explicitly declared studio display rate. This is a normalized animation coordinate, not a historical speed, load, force, or stopping-distance claim.",
        };
      }

      if (controlKey === "driveCommand" || controlKey === "command" || controlKey === "direction") {
        return {
          metricName: "Platform Travel Direction",
          derivativeSymbol: "ΔDirection / ΔCommand",
          derivativeValue: otis.platformMotionDirection,
          derivativeUnit: "direction / state",
          interpretation:
            "Discrete platform direction response to drive belt command (-1=lower, 0=idle, 1=raise). Refused to 0 when stopped or pawls engage, counterfactually -1 on free fall.",
        };
      }

      if (
        controlKey === "ropeGIntegrityPct" ||
        controlKey === "ropeIntegrity" ||
        controlKey === "ropeGIntegrity" ||
        controlKey === "ropeIntegrityPct"
      ) {
        return {
          metricName: "Pawl Arrest Engagement Margin",
          derivativeSymbol: "ΔArrest / ΔRopeIntegrity",
          derivativeValue: otis.claim1HookLockSatisfied ? 1.0 : 0.0,
          derivativeUnit: "arrest state / failure",
          interpretation:
            "Discrete transition of safety pawls f engaging racks C upon severing hoisting rope G (<15% integrity). Gated by Claim 1 hook-form geometry.",
        };
      }

      if (
        controlKey === "stopRopePulled" ||
        controlKey === "stopRope" ||
        controlKey === "shipperStop"
      ) {
        return {
          metricName: "Service Brake Engagement",
          derivativeSymbol: "ΔBrake / ΔStopRope",
          derivativeValue: otis.claim3StopInterlockSatisfied ? 1.0 : 0.0,
          derivativeUnit: "brake state / pull",
          interpretation:
            "Discrete actuation of brake shoe Z against wheel L and shifting belts to idle pulleys upon pulling stop rope U.",
        };
      }

      if (controlKey === "claim1HookLockEnabled" || controlKey === "claim1Active") {
        return {
          metricName: "Claim 1 Platform Arrest Lock",
          derivativeSymbol: "ΔArrest / ΔClaim1",
          derivativeValue: !otis.ropeGTaut ? 1.0 : 0.0,
          derivativeUnit: "arrest / claim",
          interpretation:
            "Discrete contribution of Claim 1 complementary hook-form pawls f locking into racks C under platform weight upon rope failure.",
        };
      }

      if (controlKey === "claim3BrakeInterlockEnabled") {
        return {
          metricName: "Claim 3 Shipper-Brake Interlock",
          derivativeSymbol: "ΔBrake / ΔClaim3",
          derivativeValue: otis.stopRopeGeometryActive ? 1.0 : 0.0,
          derivativeUnit: "brake / claim",
          interpretation:
            "Discrete automatic engagement of brake shoe Z when the shipper moves drive belts to idle pulleys.",
        };
      }

      if (controlKey === "claim4CounterpoiseEnabled") {
        return {
          metricName: "Claim 4 Counterpoise Kinematics",
          derivativeSymbol: "∂q_R / ∂q_D",
          derivativeValue: -1.0,
          derivativeUnit: "coordinate / coordinate",
          interpretation:
            "Opposite counterpoise motion (dq_R = -dq_D) maintaining dynamic balance on hoisting drum.",
        };
      }
      break;
    }

    case "us-120057-gramme-dynamo": {
      const shaftRate =
        params.shaftRate ??
        params.rate ??
        params.shaftRateFactor ??
        params.rotorRpm ??
        params.shaftRpm ??
        params.speed ??
        1.0;
      if (!Number.isFinite(shaftRate) || shaftRate < 0.4 || shaftRate > 1.6) {
        return null;
      }

      const claim1ClosedRingPresent =
        params.claim1ClosedRingPresent === undefined && params.claim1Active === undefined
          ? true
          : params.claim1ClosedRingPresent !== undefined
            ? Number(params.claim1ClosedRingPresent) >= 0.5
            : Boolean(params.claim1Active);

      if (
        controlKey === "shaftRate" ||
        controlKey === "rate" ||
        controlKey === "shaftRateFactor" ||
        controlKey === "rotorRpm" ||
        controlKey === "shaftRpm" ||
        controlKey === "speed"
      ) {
        if (!claim1ClosedRingPresent) {
          return {
            metricName: "Induced e.m.f. (illustrative)",
            derivativeSymbol: "∂EMF / ∂ω_rel",
            derivativeValue: 0,
            derivativeUnit: "relative index / unit",
            interpretation:
              "Claim 1 continuous closed-ring toroidal armature is withheld; non-continuous winding produces arcing spikes with zero continuous DC induction.",
          };
        }
        const gramme = stepGrammeDynamo({ shaftRate });
        return {
          metricName: "Induced e.m.f. (illustrative)",
          derivativeSymbol: "∂EMF / ∂ω_rel",
          derivativeValue: gramme.inducedEmfSlopePerFactor ?? 100,
          derivativeUnit: "relative index / unit",
          interpretation:
            "Illustrative induced electromotive force index scaling proportionally with relative shaft rotation rate under the continuous ring winding model (US 120,057 prints no historical voltage or flux constants).",
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
      const claim1Active =
        params.claim1Active === undefined
          ? true
          : typeof params.claim1Active === "number"
            ? params.claim1Active >= 0.5
            : Boolean(params.claim1Active);
      const feedRate =
        params.juiceFeedRateKgPerH ?? params.juiceFeedRate ?? params.feedRate ?? 10000;
      const initialBrix = params.initialBrixDeg ?? params.initialBrix ?? params.brixIn ?? 14.0;
      const targetBrix = params.targetBrixDeg ?? params.targetBrix ?? params.brixOut ?? 65.0;
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
        if (!claim1Active) {
          return {
            metricName: "Steam Enthalpy Economy",
            derivativeSymbol: "∂Economy / ∂N_effects",
            derivativeValue: 0,
            derivativeUnit: "(kg evaporated/kg steam) / effect",
            interpretation:
              "Claim 1 multiple-effect vapor reuse is inactive; single-vessel atmospheric boiling provides no secondary vapor reuse across successive effects.",
          };
        }
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
        if (!claim1Active) {
          return {
            metricName: "Water Evaporation Mass Flow Rate",
            derivativeSymbol: "∂m_evap / ∂m_feed",
            derivativeValue: 0,
            derivativeUnit: "(kg/h) / (kg/h)",
            interpretation:
              "Claim 1 closed multiple-effect boiling apparatus is inactive; evaporation train is offline.",
          };
        }
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
      if (
        controlKey === "initialBrixDeg" ||
        controlKey === "initialBrix" ||
        controlKey === "brixIn"
      ) {
        if (!claim1Active) {
          return {
            metricName: "Water Evaporation vs Initial Brix",
            derivativeSymbol: "∂m_evap / ∂B_in",
            derivativeValue: 0,
            derivativeUnit: "(kg/h) / °Bx",
            interpretation: "Claim 1 multiple-effect evaporation train is inactive.",
          };
        }
        return {
          metricName: "Water Evaporation vs Initial Brix",
          derivativeSymbol: "∂m_evap / ∂B_in",
          derivativeValue: Number((-feedRate / targetBrix).toFixed(4)),
          derivativeUnit: "(kg/h) / °Bx",
          interpretation:
            "Mass balance derivative of water evaporation rate with respect to inlet juice sugar content (-m_feed / B_out).",
        };
      }
      if (
        controlKey === "targetBrixDeg" ||
        controlKey === "targetBrix" ||
        controlKey === "brixOut"
      ) {
        if (!claim1Active) {
          return {
            metricName: "Water Evaporation vs Target Syrup Brix",
            derivativeSymbol: "∂m_evap / ∂B_out",
            derivativeValue: 0,
            derivativeUnit: "(kg/h) / °Bx",
            interpretation: "Claim 1 multiple-effect evaporation train is inactive.",
          };
        }
        return {
          metricName: "Water Evaporation vs Target Syrup Brix",
          derivativeSymbol: "∂m_evap / ∂B_out",
          derivativeValue: Number(
            ((feedRate * initialBrix) / (targetBrix * targetBrix)).toFixed(4),
          ),
          derivativeUnit: "(kg/h) / °Bx",
          interpretation:
            "Mass balance derivative of water evaporation rate with respect to target concentrated syrup Brix (m_feed · B_in / B_out²).",
        };
      }
      if (controlKey === "claim1Active" || controlKey === "claim1") {
        return {
          metricName: "Claim 1 Multiple-Effect Vacuum Train State",
          derivativeSymbol: "∂State / ∂u_claim",
          derivativeValue: 1,
          derivativeUnit: "train state / claim fraction",
          interpretation:
            "Discrete activation of Claim 1 enclosed multiple-effect evaporation utilizing exhaust and generated vapor across successive vacuum stages.",
        };
      }
      break;
    }

    case "us-621195-zeppelin-airship": {
      const inflation =
        params.gasInflation ??
        params.gasInflationPct ??
        params.inflation ??
        params.inflationPct ??
        95;
      const alt = params.flightAlt ?? params.altitude ?? params.altitudeM ?? params.alt ?? 300;
      const speed =
        params.flightSpeedKnots ??
        params.speed ??
        params.speedKnots ??
        params.airspeedKnots ??
        params.flightSpeed ??
        28;
      const trimM =
        params.trimWeight ?? params.trimWeightPosM ?? params.trim ?? params.ballast ?? 5;
      const claim1Active =
        params.claim1Active !== undefined
          ? typeof params.claim1Active === "number"
            ? params.claim1Active >= 0.5
            : Boolean(params.claim1Active)
          : true;

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
        claim1Active,
      });

      if (
        controlKey === "gasInflation" ||
        controlKey === "gasInflationPct" ||
        controlKey === "inflation" ||
        controlKey === "inflationPct"
      ) {
        return {
          metricName: "Gross Aerostatic Buoyant Lift",
          derivativeSymbol: "∂L_buoy / ∂%_inflation",
          derivativeValue: claim1Active ? Number(zep.buoyantSlopeNPerPct.toPrecision(6)) : 0,
          derivativeUnit: "N / %",
          interpretation: claim1Active
            ? `Archimedes aerostatic displacement: local air-hydrogen density differential at altitude ${alt} m over 11,300 m³ nominal envelope. Endpoints use the admitted one-sided slope.`
            : "Claim 1 withheld: rigid structural framework omitted; flexible gas envelope deforms and loses aerostatic buoyancy displacement authority (0 N / %).",
        };
      }
      if (
        controlKey === "trimWeight" ||
        controlKey === "trimWeightPosM" ||
        controlKey === "trim" ||
        controlKey === "ballast"
      ) {
        return {
          metricName: "Longitudinal Pitch Trim",
          derivativeSymbol: "∂θ_pitch / ∂x_trim",
          derivativeValue: claim1Active ? Number(zep.pitchTrimSlopeDegPerM.toPrecision(6)) : 0,
          derivativeUnit: "deg / m",
          interpretation: claim1Active
            ? "Longitudinal trim angle variation per meter of keel running weight translation."
            : "Claim 1 withheld: unbraced flexible envelope deforms under running ballast weight, extinguishing longitudinal trim authority (0 deg / m).",
        };
      }
      if (
        controlKey === "flightSpeedKnots" ||
        controlKey === "speed" ||
        controlKey === "speedKnots" ||
        controlKey === "airspeedKnots" ||
        controlKey === "flightSpeed" ||
        controlKey === "airspeedMph"
      ) {
        return {
          metricName: "Parasite Aerodynamic Drag",
          derivativeSymbol: "∂D / ∂v_knot",
          derivativeValue: claim1Active ? Number(zep.dragSlopeKnPerKnot.toPrecision(6)) : 0,
          derivativeUnit: "kN / knot",
          interpretation: claim1Active
            ? "Quadratic hull aerodynamic drag gradient with airspeed at current atmospheric air density."
            : "Claim 1 withheld: unbraced flexible envelope suffers dynamic buckling under cruising aerodynamic loads (0 kN / knot).",
        };
      }
      if (
        controlKey === "flightAlt" ||
        controlKey === "altitude" ||
        controlKey === "altitudeM" ||
        controlKey === "alt"
      ) {
        return {
          metricName: "Barometric Aerostatic Lift Decay",
          derivativeSymbol: "∂L_gross / ∂h",
          derivativeValue: claim1Active ? Number(zep.altitudeLiftSlopeKnPerM.toPrecision(6)) : 0,
          derivativeUnit: "kN / m",
          interpretation: claim1Active
            ? "Barometric scale height (H = 8,400 m) exponential atmospheric density lapse reducing gross buoyant lift."
            : "Claim 1 withheld: rigid framework omitted; structural envelope collapse halts controlled altitude operation (0 kN / m).",
        };
      }
      break;
    }

    case "us-3728480-baer-odyssey": {
      const p1X = Number(
        params.player1PotX ??
          params.p1X ??
          params.p1PotX ??
          params.dot1X ??
          params.knob17 ??
          params.player1X ??
          0.25,
      );
      const p1Y = Number(
        params.player1PotY ??
          params.p1Y ??
          params.p1PotY ??
          params.dot1Y ??
          params.knob16 ??
          params.player1Y ??
          0.5,
      );
      const p2X = Number(
        params.player2PotX ??
          params.p2X ??
          params.p2PotX ??
          params.dot2X ??
          params.knob17Sub1 ??
          params.player2X ??
          0.75,
      );
      const p2Y = Number(
        params.player2PotY ??
          params.p2Y ??
          params.p2PotY ??
          params.dot2Y ??
          params.knob16Sub1 ??
          params.player2Y ??
          0.5,
      );
      const english = Number(
        params.englishControl ??
          params.english ??
          params.spin ??
          params.spinPot ??
          params.englishSpin ??
          0.0,
      );
      const speed = Number(
        params.ballSpeedMultiplier ??
          params.ballSpeed ??
          params.speedMultiplier ??
          params.speed ??
          1.0,
      );
      const channel = Number(
        params.rfChannel ?? params.channel ?? params.vhfChannel ?? params.ch ?? 3,
      );
      const chromaPhase = Number(
        params.chromaPhaseDeg ??
          params.chromaPhase ??
          params.chroma ??
          params.huePhase ??
          params.colorPhase ??
          45.0,
      );

      if (
        !Number.isFinite(p1X) ||
        p1X < 0.05 ||
        p1X > 0.95 ||
        !Number.isFinite(p1Y) ||
        p1Y < 0.05 ||
        p1Y > 0.95 ||
        !Number.isFinite(p2X) ||
        p2X < 0.05 ||
        p2X > 0.95 ||
        !Number.isFinite(p2Y) ||
        p2Y < 0.05 ||
        p2Y > 0.95 ||
        !Number.isFinite(english) ||
        english < -1.0 ||
        english > 1.0 ||
        !Number.isFinite(speed) ||
        speed < 0.2 ||
        speed > 3.0 ||
        !Number.isFinite(channel) ||
        (channel !== 3 && channel !== 4) ||
        !Number.isFinite(chromaPhase) ||
        chromaPhase < 0 ||
        chromaPhase > 180
      ) {
        return null;
      }

      if (
        controlKey === "player1PotX" ||
        controlKey === "p1X" ||
        controlKey === "p1PotX" ||
        controlKey === "dot1X" ||
        controlKey === "knob17" ||
        controlKey === "player1X" ||
        controlKey === "player2PotX" ||
        controlKey === "p2X" ||
        controlKey === "p2PotX" ||
        controlKey === "dot2X" ||
        controlKey === "knob17Sub1" ||
        controlKey === "player2X"
      ) {
        return {
          metricName: "Horizontal Spot Delay Time",
          derivativeSymbol: "∂τ_H / ∂R_pot",
          derivativeValue: 48.0,
          derivativeUnit: "µs / norm_pot",
          interpretation:
            "Monostable multivibrator RC charge timing shifts spot position across 53.5 µs active raster line.",
        };
      }
      if (
        controlKey === "player1PotY" ||
        controlKey === "p1Y" ||
        controlKey === "p1PotY" ||
        controlKey === "dot1Y" ||
        controlKey === "knob16" ||
        controlKey === "player1Y" ||
        controlKey === "player2PotY" ||
        controlKey === "p2Y" ||
        controlKey === "p2PotY" ||
        controlKey === "dot2Y" ||
        controlKey === "knob16Sub1" ||
        controlKey === "player2Y"
      ) {
        return {
          metricName: "Vertical Field Delay Time",
          derivativeSymbol: "∂τ_V / ∂R_pot",
          derivativeValue: 14.0,
          derivativeUnit: "ms / norm_pot",
          interpretation:
            "Vertical monostable RC time delay translates spot down 15.42 ms active cathode ray field.",
        };
      }
      if (
        controlKey === "englishControl" ||
        controlKey === "english" ||
        controlKey === "spin" ||
        controlKey === "spinPot" ||
        controlKey === "englishSpin"
      ) {
        return {
          metricName: "English Spin Deflection Velocity Sensitivity",
          derivativeSymbol: "∂v_y / ∂english",
          derivativeValue: 0.25,
          derivativeUnit: "(units/s) / spin",
          interpretation:
            "Differential English spin potentiometer modifies vertical rebound velocity on paddle contact by up to 0.25 screen units per second.",
        };
      }
      if (
        controlKey === "ballSpeedMultiplier" ||
        controlKey === "ballSpeed" ||
        controlKey === "speedMultiplier" ||
        controlKey === "speed"
      ) {
        return {
          metricName: "Ball Horizontal Velocity Multiplier Sensitivity",
          derivativeSymbol: "∂v_ball / ∂multiplier",
          derivativeValue: 0.45,
          derivativeUnit: "(units/s) / x",
          interpretation:
            "Clock rate and multivibrator speed scaling scales horizontal ball transit velocity across the raster.",
        };
      }
      if (
        controlKey === "rfChannel" ||
        controlKey === "channel" ||
        controlKey === "vhfChannel" ||
        controlKey === "ch"
      ) {
        return {
          metricName: "VHF RF Picture Carrier Channel Step",
          derivativeSymbol: "Δf_rf / Δch",
          derivativeValue: 6.0,
          derivativeUnit: "MHz / ch",
          interpretation:
            "VHF oscillator switch shifts RF picture carrier frequency by exactly 6.0 MHz between Channel 3 (61.25 MHz) and Channel 4 (67.25 MHz) standard broadcast allocations.",
        };
      }
      if (
        controlKey === "chromaPhaseDeg" ||
        controlKey === "chromaPhase" ||
        controlKey === "chroma" ||
        controlKey === "huePhase" ||
        controlKey === "colorPhase"
      ) {
        return {
          metricName: "Chroma Subcarrier Phase Delay Sensitivity",
          derivativeSymbol: "∂τ_chroma / ∂θ",
          derivativeValue: 0.78,
          derivativeUnit: "ns / deg",
          interpretation:
            "Subcarrier phase delay shifts NTSC color vector hue angle relative to color burst reference (0.78 ns delay per degree of phase).",
        };
      }
      break;
    }

    case "us-4063220-metcalfe-ethernet": {
      const length =
        params.cableLengthMeters ??
        params.cableLength ??
        params.length ??
        params.coaxLength ??
        params.busLength ??
        500;
      const rate =
        params.dataRateMbps ?? params.dataRate ?? params.bitRate ?? params.transmissionRate ?? 2.94;
      const stations =
        params.stationCount ?? params.stations ?? params.nodes ?? params.contenderCount ?? 2;
      const load = params.offeredLoad ?? params.load ?? params.trafficLoad ?? params.g ?? 0.5;
      const packetSize =
        params.packetSizeBytes ??
        params.packetSize ??
        params.frameSize ??
        params.packetBytes ??
        512;
      const rawTrigger =
        params.triggerCollision !== undefined
          ? params.triggerCollision
          : params.collision !== undefined
            ? params.collision
            : params.forceCollision;
      const trigger = rawTrigger !== undefined ? Number(rawTrigger) : undefined;

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
        packetSize > 1518 ||
        (trigger !== undefined && (!Number.isFinite(trigger) || trigger < 0 || trigger > 1))
      ) {
        return null;
      }

      if (
        controlKey === "cableLengthMeters" ||
        controlKey === "cableLength" ||
        controlKey === "length" ||
        controlKey === "coaxLength" ||
        controlKey === "busLength"
      ) {
        return {
          metricName: "One-Way Propagation Delay",
          derivativeSymbol: "∂τ_prop / ∂L",
          derivativeValue: 5.0,
          derivativeUnit: "ns / m",
          interpretation:
            "Electromagnetic wave velocity in polyethylene dielectric coaxial cable (0.66c) adds 5 ns latency per meter.",
        };
      }
      if (
        controlKey === "dataRateMbps" ||
        controlKey === "dataRate" ||
        controlKey === "bitRate" ||
        controlKey === "transmissionRate"
      ) {
        return {
          metricName: "Manchester Bit Period",
          derivativeSymbol: "∂T_bit / ∂R",
          derivativeValue: -34.0,
          derivativeUnit: "ns / Mbps",
          interpretation:
            "Higher transmission bit rate shortens Manchester self-clocking bit intervals (100 ns at 10 Mbps).",
        };
      }
      if (
        controlKey === "offeredLoad" ||
        controlKey === "load" ||
        controlKey === "trafficLoad" ||
        controlKey === "g"
      ) {
        return {
          metricName: "Channel Utilization Efficiency",
          derivativeSymbol: "∂η / ∂G",
          derivativeValue: -28.5,
          derivativeUnit: "% / norm_load",
          interpretation:
            "Increasing offered traffic load increases collision probability and backoff slot delays according to CSMA/CD contention dynamics.",
        };
      }
      if (
        controlKey === "stationCount" ||
        controlKey === "stations" ||
        controlKey === "nodes" ||
        controlKey === "contenderCount"
      ) {
        return {
          metricName: "Contention Channel Efficiency Node Scaling",
          derivativeSymbol: "∂η / ∂N_station",
          derivativeValue: -0.2,
          derivativeUnit: "% / node",
          interpretation:
            "Channel efficiency degradation as additional contender stations increase contention probability and collision backoff intervals.",
        };
      }
      if (
        controlKey === "packetSizeBytes" ||
        controlKey === "packetSize" ||
        controlKey === "frameSize" ||
        controlKey === "packetBytes"
      ) {
        return {
          metricName: "Packet Frame Size Channel Efficiency",
          derivativeSymbol: "∂η / ∂S_packet",
          derivativeValue: 0.013,
          derivativeUnit: "% / byte",
          interpretation:
            "Larger frame payload amortizes coaxial propagation latency over longer transmission duration, raising CSMA/CD channel efficiency.",
        };
      }
      if (
        controlKey === "triggerCollision" ||
        controlKey === "collision" ||
        controlKey === "forceCollision"
      ) {
        return {
          metricName: "Transceiver Collision Voltage Threshold Superposition",
          derivativeSymbol: "ΔV_bus / Δcollision",
          derivativeValue: 1.0,
          derivativeUnit: "V / event",
          interpretation:
            "Simultaneous transmission produces analog additive voltage pulse doubling baseline signal to 2.0 V, triggering transceiver collision detection.",
        };
      }
      break;
    }

    case "us-2318259-sikorsky-helicopter": {
      const coll =
        params.collectivePitchDeg ??
        params.collective ??
        params.collectivePitch ??
        params.pitchDeg ??
        6.8;
      const pitchStick =
        params.cyclicPitchForwardDeg ?? params.cyclicPitch ?? params.cyclicPitchDeg ?? 0;
      const rollStick = params.cyclicRollRightDeg ?? params.cyclicRoll ?? params.cyclicRollDeg ?? 0;
      const pedal =
        params.tailRotorPedalPercent ??
        params.pedal ??
        params.pedals ??
        params.tailPedal ??
        params.rudderPedals ??
        params.pedalPercent ??
        0;
      const throttle =
        params.engineThrottlePercent ??
        params.throttle ??
        params.throttlePercent ??
        params.engineThrottle ??
        85;
      const isRunning =
        params.engineRunning ?? params.running ?? params.engine ?? params.ignition ?? 1;
      const claim1Active =
        params.claim1Active !== undefined
          ? typeof params.claim1Active === "number"
            ? params.claim1Active >= 0.5
            : Boolean(params.claim1Active)
          : true;
      const claim2Active =
        params.claim2Active !== undefined
          ? typeof params.claim2Active === "number"
            ? params.claim2Active >= 0.5
            : Boolean(params.claim2Active)
          : true;

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
        throttle > 100 ||
        !Number.isFinite(isRunning) ||
        isRunning < 0 ||
        isRunning > 1
      ) {
        return null;
      }

      const controls = readSikorskyControls({
        ...params,
        collectivePitchDeg: coll,
        cyclicPitchForwardDeg: pitchStick,
        cyclicRollRightDeg: rollStick,
        tailRotorPedalPercent: pedal,
        engineThrottlePercent: throttle,
        engineRunning: isRunning >= 0.5,
        collectiveThrottleLinked: claim1Active ? (params.collectiveThrottleLinked ?? 1) : 0,
        auxiliaryRotorEnabled: claim2Active ? (params.auxiliaryRotorEnabled ?? 1) : 0,
      });

      const stepped = stepSikorskyHelicopterSi(INITIAL_SIKORSKY_STATE, controls, 1 / 60);

      if (
        controlKey === "collectivePitchDeg" ||
        controlKey === "collective" ||
        controlKey === "collectivePitch" ||
        controlKey === "pitchDeg"
      ) {
        const slope = stepped.metrics.mainRotorThrustSlopeNPerDeg ?? 0;
        return {
          metricName: "Main Rotor Thrust",
          derivativeSymbol: "∂T_main / ∂θ_coll",
          derivativeValue: Number(slope.toFixed(1)),
          derivativeUnit: "N / deg",
          interpretation:
            "Momentum and blade-element aerodynamic lift slope at current rotor speed and ground-effect proximity. Endpoints use the admitted one-sided slope.",
        };
      }
      if (
        controlKey === "tailRotorPedalPercent" ||
        controlKey === "pedal" ||
        controlKey === "pedals" ||
        controlKey === "tailPedal" ||
        controlKey === "rudderPedals" ||
        controlKey === "pedalPercent"
      ) {
        const dYaw =
          claim2Active && controls.auxiliaryRotorEnabled
            ? (stepped.metrics.antiTorqueYawMomentSlopeNmPerPct ?? -21.6)
            : 0;
        return {
          metricName: "Anti-Torque Yaw Moment",
          derivativeSymbol: "∂M_yaw / ∂pedal",
          derivativeValue: dYaw,
          derivativeUnit: "N·m / %",
          interpretation:
            claim2Active && controls.auxiliaryRotorEnabled
              ? "Deflecting tail rotor rudder pedals alters auxiliary propeller pitch, modulating lateral anti-torque thrust moment."
              : "Claim 2 withheld or auxiliary tail rotor is disabled; yaw anti-torque pedal modulation is 0 N·m / %.",
        };
      }
      if (
        controlKey === "engineThrottlePercent" ||
        controlKey === "throttle" ||
        controlKey === "throttlePercent" ||
        controlKey === "engineThrottle"
      ) {
        const dRpm = controls.engineRunning ? (stepped.metrics.engineThrottleRpmSlope ?? 0.8) : 0;
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
      if (
        controlKey === "cyclicPitchForwardDeg" ||
        controlKey === "cyclicPitch" ||
        controlKey === "cyclicPitchDeg"
      ) {
        return {
          metricName: "Cyclic Pitch Swashplate Tilt",
          derivativeSymbol: "∂θ_swash / ∂δ_pitch",
          derivativeValue: 1.0,
          derivativeUnit: "deg / deg",
          interpretation:
            "Direct 1:1 mechanical swashplate longitudinal tilt per degree of fore/aft cyclic control displacement.",
        };
      }
      if (
        controlKey === "cyclicRollRightDeg" ||
        controlKey === "cyclicRoll" ||
        controlKey === "cyclicRollDeg"
      ) {
        return {
          metricName: "Cyclic Roll Swashplate Tilt",
          derivativeSymbol: "∂φ_swash / ∂δ_roll",
          derivativeValue: 1.0,
          derivativeUnit: "deg / deg",
          interpretation:
            "Direct 1:1 mechanical swashplate lateral tilt per degree of left/right cyclic roll control displacement.",
        };
      }
      if (
        controlKey === "engineRunning" ||
        controlKey === "running" ||
        controlKey === "engine" ||
        controlKey === "ignition"
      ) {
        return {
          metricName: "Engine Drive & Governor State",
          derivativeSymbol: "ΔState / ΔEngine",
          derivativeValue: 0,
          derivativeUnit: "state",
          interpretation: controls.engineRunning
            ? "Engine is running and mechanically geared to main and tail rotor drive shafts under governing control."
            : "Engine is shut down; drive freewheeling clutch decouples rotor for autorotation descent.",
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
      const sep =
        params.fingerSeparationMm ??
        params.separation ??
        params.separationMm ??
        params.fingerSeparation ??
        50;
      const count = params.fingerCount ?? params.count ?? params.fingers ?? 1;
      const rawAngle =
        params.initialMotionAngleDeg ??
        params.initialMotionAngle ??
        params.motionAngle ??
        params.angleDeg ??
        params.angle;

      if (
        !Number.isFinite(sep) ||
        sep < 15 ||
        sep > 120 ||
        !Number.isFinite(count) ||
        count < 0 ||
        count > 2 ||
        (rawAngle !== undefined && (!Number.isFinite(rawAngle) || rawAngle < 0 || rawAngle > 90))
      ) {
        return null;
      }

      const key =
        controlKey === "separation" ||
        controlKey === "separationMm" ||
        controlKey === "fingerSeparation"
          ? "fingerSeparationMm"
          : controlKey === "count" || controlKey === "fingers"
            ? "fingerCount"
            : controlKey === "initialMotionAngle" ||
                controlKey === "motionAngle" ||
                controlKey === "angleDeg" ||
                controlKey === "angle"
              ? "initialMotionAngleDeg"
              : controlKey;

      if (key === "fingerSeparationMm") {
        return {
          metricName: "Illustrative Pinch-to-Zoom Scale Ratio",
          derivativeSymbol: "∂S / ∂d_sep",
          derivativeValue: 0.02,
          derivativeUnit: "scale / mm",
          interpretation:
            "Illustrative display scaling only: 50 mm separation defines a nominal 1.0× reference (S = d / 50 mm). Claim 8 names the zoom-in or zoom-out command but supplies neither this ratio nor any sensing law.",
        };
      }
      if (key === "fingerCount") {
        return {
          metricName: "Active Touch Contacts",
          derivativeSymbol: "∂Contacts / ∂Count",
          derivativeValue: 1.0,
          derivativeUnit: "pts / finger",
          interpretation:
            "Discrete contact count presented to the Claim 1 command heuristic; the claim does not specify the sensing matrix that detected it.",
        };
      }
      if (key === "initialMotionAngleDeg") {
        return {
          metricName: "Initial Contact Motion Angle (Claim 1)",
          derivativeSymbol: "∂θ_motion / ∂θ_input",
          derivativeValue: 1.0,
          derivativeUnit: "° / °",
          interpretation:
            "Claim 1 trajectory orientation angle relative to vertical used by the heuristic discriminator to bifurcate between vertical scrolling (θ ≤ threshold) and two-dimensional panning (θ > threshold). Conspicuously labeled reader illustration.",
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
      const rawSpeed = params.wheelSpeedMps ?? params.speed ?? params.driveSpeed;
      if (
        rawSpeed !== undefined &&
        (!Number.isFinite(rawSpeed) || rawSpeed < 0.1 || rawSpeed > 1.0)
      ) {
        return null;
      }
      const rawTurn = params.turnRateRadSec ?? params.turnRate ?? params.deflectionRate;
      if (rawTurn !== undefined && (!Number.isFinite(rawTurn) || rawTurn < 0.5 || rawTurn > 3.0)) {
        return null;
      }
      const rawOpt =
        params.opticalSensorEnabled ??
        params.opticalSensor ??
        params.optical ??
        params.claim1Optical;
      if (rawOpt !== undefined && (!Number.isFinite(rawOpt) || rawOpt < 0 || rawOpt > 1)) {
        return null;
      }

      const key =
        controlKey === "speed" || controlKey === "driveSpeed"
          ? "wheelSpeedMps"
          : controlKey === "turnRate" || controlKey === "deflectionRate"
            ? "turnRateRadSec"
            : controlKey === "opticalSensor" ||
                controlKey === "optical" ||
                controlKey === "claim1Optical"
              ? "opticalSensorEnabled"
              : controlKey;

      if (key === "wheelSpeedMps") {
        return {
          metricName: "Contextual Chassis Advance Rate",
          derivativeSymbol: "∂v_chassis / ∂v_command",
          derivativeValue: 1,
          derivativeUnit: "(m/s) / (m/s)",
          interpretation:
            "In the straight contextual differential-drive mode, chassis advance equals the shared wheel-speed command. This is not a claimed coverage rate.",
        };
      }
      if (key === "turnRateRadSec") {
        return {
          metricName: "Contextual In-Place Turn Rate",
          derivativeSymbol: "∂ω / ∂Rate",
          derivativeValue: 1.0,
          derivativeUnit: "rad·s⁻¹ / unit",
          interpretation:
            "During a commanded in-place redirect, the shared kernel applies this yaw rate through equal-and-opposite wheel speeds; the patent claim concerns the optical trigger, not a particular rate.",
        };
      }
      if (key === "opticalSensorEnabled") {
        return {
          metricName: "Optical Redirect Interlock (Claim 1)",
          derivativeSymbol: "ΔInterlock / Δoptical",
          derivativeValue: 1.0,
          derivativeUnit: "state / state",
          interpretation:
            "Discrete finite sensitivity: enabling Claim 1 optical emitter-detector field overlap arms autonomous surface-absence (cliff) and wall-detection redirection routines.",
        };
      }
      break;
    }

    case "gb-931-arkwright-water-frame": {
      const waterWheelRpm = Number(
        params.waterWheelRpm ??
          params.rpm ??
          params.wheelRpm ??
          params.speedRpm ??
          params.wheelSpeed ??
          180,
      );
      const totalDraftRatio = Number(
        params.totalDraftRatio ?? params.draftRatio ?? params.draft ?? params.draftD ?? 6.0,
      );
      const rollerClampingWeightKg = Number(
        params.rollerClampingWeightKg ??
          params.clampingWeightKg ??
          params.clampingWeight ??
          params.weightKg ??
          params.rollerWeight ??
          3.5,
      );
      const stapleLengthMm = Number(
        params.stapleLengthMm ?? params.stapleLength ?? params.fiberLength ?? params.staple ?? 28,
      );
      const inputRovingCountNe = Number(
        params.inputRovingCountNe ??
          params.rovingCountNe ??
          params.rovingCount ??
          params.inputRoving ??
          1.0,
      );

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

      if (
        controlKey === "waterWheelRpm" ||
        controlKey === "rpm" ||
        controlKey === "wheelRpm" ||
        controlKey === "speedRpm" ||
        controlKey === "wheelSpeed"
      ) {
        return {
          metricName: "Flyer Spindle Rotation Speed",
          derivativeSymbol: "∂N_spindle / ∂RPM_wheel",
          derivativeValue: 18.5,
          derivativeUnit: "RPM / RPM",
          interpretation:
            "Water-wheel step-up gearing ratio (18.5:1 declared teaching transmission) driving continuous spinning flyers.",
        };
      }
      if (
        controlKey === "totalDraftRatio" ||
        controlKey === "draftRatio" ||
        controlKey === "draft" ||
        controlKey === "draftD"
      ) {
        return {
          metricName: "Yarn Count Attenuation",
          derivativeSymbol: "∂Ne / ∂Draft",
          derivativeValue: Number(inputRovingCountNe.toFixed(3)),
          derivativeUnit: "count / ratio",
          interpretation:
            "Differential roller speed drawing ratio reducing roving linear mass density (Ne_out = Ne_in · Draft).",
        };
      }
      if (
        controlKey === "rollerClampingWeightKg" ||
        controlKey === "clampingWeightKg" ||
        controlKey === "clampingWeight" ||
        controlKey === "weightKg" ||
        controlKey === "rollerWeight"
      ) {
        const threshold = 20.0 / 9.80665;
        const slope =
          rollerClampingWeightKg < threshold
            ? (1 - Math.exp(-0.48 * totalDraftRatio)) * 9.80665
            : 0.0;
        return {
          metricName: "Fiber Parallelization",
          derivativeSymbol: "∂Parallelization / ∂M_clamp",
          derivativeValue: Number(slope.toFixed(2)),
          derivativeUnit: "% / kg",
          interpretation:
            "Sensitivity of fiber alignment to roller normal clamping weight. Below ~2.04 kg (20 N grip threshold) slip degrades drafting; above 2.04 kg full drafting grip is achieved.",
        };
      }
      if (
        controlKey === "stapleLengthMm" ||
        controlKey === "stapleLength" ||
        controlKey === "fiberLength" ||
        controlKey === "staple"
      ) {
        const baseOut = stepArkwrightWaterFrame({
          waterWheelRpm,
          totalDraftRatio,
          rollerClampingWeightKg,
          stapleLengthMm,
          inputRovingCountNe,
        });
        const dStrength =
          stapleLengthMm < 28.0 * 1.15 ? baseOut.yarnBreakingForceN / stapleLengthMm : 0.0;
        return {
          metricName: "Yarn Breaking Strength",
          derivativeSymbol: "∂F_break / ∂L_staple",
          derivativeValue: Number(dStrength.toFixed(3)),
          derivativeUnit: "N / mm",
          interpretation:
            "Sensitivity of yarn tensile breaking load to raw cotton staple length. Longer fibers increase inter-fiber frictional cohesion up to the 32.2 mm saturation ceiling.",
        };
      }
      if (
        controlKey === "inputRovingCountNe" ||
        controlKey === "rovingCountNe" ||
        controlKey === "rovingCount" ||
        controlKey === "inputRoving"
      ) {
        return {
          metricName: "Yarn Count Attenuation",
          derivativeSymbol: "∂Ne_out / ∂Ne_in",
          derivativeValue: Number(totalDraftRatio.toFixed(3)),
          derivativeUnit: "count / count",
          interpretation:
            "Proportional scaling of finished yarn count with input roving count at the current draft ratio (Ne_out = Ne_in · Draft).",
        };
      }
      break;
    }

    case "gb-1306-watt-rotary-engine": {
      const strokeRateSpm = Number(
        params.strokeRateSpm ??
          params.spm ??
          params.strokeRate ??
          params.speedSpm ??
          params.beamSpm ??
          20,
      );
      const boilerPressureKpa = Number(
        params.boilerPressureKpa ??
          params.boilerPressure ??
          params.pressureKpa ??
          params.steamPressure ??
          params.pressure ??
          70,
      );
      const gearRatioNpOverNs = Number(
        params.gearRatioNpOverNs ??
          params.gearRatio ??
          params.ratio ??
          params.toothRatio ??
          params.gearRatioNpNs ??
          1.0,
      );
      const flywheelMassKg = Number(
        params.flywheelMassKg ??
          params.flywheelMass ??
          params.massKg ??
          params.flywheelWeight ??
          3500,
      );

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

      if (
        controlKey === "strokeRateSpm" ||
        controlKey === "spm" ||
        controlKey === "strokeRate" ||
        controlKey === "speedSpm" ||
        controlKey === "beamSpm"
      ) {
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
      if (
        controlKey === "gearRatioNpOverNs" ||
        controlKey === "gearRatio" ||
        controlKey === "ratio" ||
        controlKey === "toothRatio" ||
        controlKey === "gearRatioNpNs"
      ) {
        return {
          metricName: "Shaft Speed Multiplier",
          derivativeSymbol: "∂Mult / ∂Ratio",
          derivativeValue: 1.0,
          derivativeUnit: "multiplier / ratio",
          interpretation:
            "Linear speed-multiplier increase per unit increase in planet-to-sun gear ratio.",
        };
      }
      if (
        controlKey === "boilerPressureKpa" ||
        controlKey === "boilerPressure" ||
        controlKey === "pressureKpa" ||
        controlKey === "steamPressure" ||
        controlKey === "pressure"
      ) {
        const dPowerDkpa = (0.453646 * 1.8 * strokeRateSpm) / 60;
        return {
          metricName: "Scenario Ideal Shaft Power",
          derivativeSymbol: "∂P_mean / ∂P_boiler",
          derivativeValue: Number(dPowerDkpa.toFixed(3)),
          derivativeUnit: "kW / kPa",
          interpretation:
            "Sensitivity of mean indicated shaft power to effective boiler steam pressure based on swept cylinder volume (0.817 m³) per stroke.",
        };
      }
      if (
        controlKey === "flywheelMassKg" ||
        controlKey === "flywheelMass" ||
        controlKey === "massKg" ||
        controlKey === "flywheelWeight"
      ) {
        const meanShaftRpm = strokeRateSpm * (1.0 + gearRatioNpOverNs);
        const omega = (meanShaftRpm * 2 * Math.PI) / 60;
        const dEdM = (0.5 * 2.89 * omega * omega) / 1000;
        return {
          metricName: "Flywheel Kinetic Energy",
          derivativeSymbol: "∂E_flywheel / ∂M_flywheel",
          derivativeValue: Number(dEdM.toFixed(4)),
          derivativeUnit: "kJ / kg",
          interpretation:
            "Sensitivity of stored flywheel rim kinetic energy to added mass at the current mean rotational speed.",
        };
      }
      break;
    }

    case "gb-1420-cort-puddling-rolling": {
      const tempC = Number(
        params.furnaceTemperatureCelsius ??
          params.furnaceTemp ??
          params.temperatureCelsius ??
          params.temperatureC ??
          params.tempC ??
          params.furnaceTemperature ??
          params.temperature ??
          1350,
      );
      const c0 = Number(
        params.initialCarbonPercent ??
          params.initialCarbon ??
          params.carbonPercent ??
          params.pigIronCarbon ??
          params.c0 ??
          3.8,
      );
      const rabbleRpm = Number(
        params.rabbleStirringRpm ??
          params.rabbleRpm ??
          params.stirringRpm ??
          params.rabbleSpeed ??
          15,
      );
      const durationMin = Number(
        params.puddlingDurationMinutes ??
          params.puddlingTime ??
          params.durationMinutes ??
          params.puddleDuration ??
          params.timeMinutes ??
          90,
      );
      const passes = Number(
        params.rollerPassCount ?? params.rollerPasses ?? params.passes ?? params.passCount ?? 5,
      );

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
        controlKey === "furnaceTemp" ||
        controlKey === "temperatureCelsius" ||
        controlKey === "temperatureC" ||
        controlKey === "tempC" ||
        controlKey === "furnaceTemperature" ||
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
      if (
        controlKey === "rabbleStirringRpm" ||
        controlKey === "rabbleRpm" ||
        controlKey === "stirringRpm" ||
        controlKey === "rabbleSpeed"
      ) {
        return {
          metricName: "Slag Contact Decarburization Enhancement",
          derivativeSymbol: "∂Rate_decarb / ∂RPM_rabble",
          derivativeValue: 0.022,
          derivativeUnit: "%/min / RPM",
          interpretation:
            "Manual rabbling stirring rate increasing fresh molten metal exposure to oxidizing fayalite slag.",
        };
      }
      if (
        controlKey === "initialCarbonPercent" ||
        controlKey === "initialCarbon" ||
        controlKey === "carbonPercent" ||
        controlKey === "pigIronCarbon" ||
        controlKey === "c0"
      ) {
        const tempK = tempC + 273.15;
        const activationEnergyJ = 115000;
        const gasConstR = 8.314;
        const preExpA = 12500;
        const stirFactor = 1 + (rabbleRpm / 15) * 1.6;
        const kDecarb = preExpA * Math.exp(-activationEnergyJ / (gasConstR * tempK)) * stirFactor;
        const dResidualDInit = Math.exp(-kDecarb * (durationMin / 60));
        return {
          metricName: "Residual Carbon",
          derivativeSymbol: "∂[%C_res] / ∂[%C_init]",
          derivativeValue: Number(dResidualDInit.toPrecision(6)),
          derivativeUnit: "% C / % C",
          interpretation:
            "Fraction of initial pig-iron carbon persisting in the puddle ball after the elapsed decarburization duration.",
        };
      }
      if (
        controlKey === "puddlingDurationMinutes" ||
        controlKey === "puddlingTime" ||
        controlKey === "durationMinutes" ||
        controlKey === "puddleDuration" ||
        controlKey === "timeMinutes"
      ) {
        const tempK = tempC + 273.15;
        const activationEnergyJ = 115000;
        const gasConstR = 8.314;
        const preExpA = 12500;
        const stirFactor = 1 + (rabbleRpm / 15) * 1.6;
        const kDecarb = preExpA * Math.exp(-activationEnergyJ / (gasConstR * tempK)) * stirFactor;
        const cInf = 0.035;
        const dResidualDTime =
          -(c0 - cInf) * (kDecarb / 60) * Math.exp(-kDecarb * (durationMin / 60));
        return {
          metricName: "Residual Carbon",
          derivativeSymbol: "∂[%C_res] / ∂t_puddle",
          derivativeValue: Number(dResidualDTime.toPrecision(6)),
          derivativeUnit: "% C / min",
          interpretation:
            "Decarburization rate of carbon removal per minute of puddling exposure to reverberatory flame and FeO slag.",
        };
      }
      if (
        controlKey === "rollerPassCount" ||
        controlKey === "rollerPasses" ||
        controlKey === "passes" ||
        controlKey === "passCount"
      ) {
        const initialSlagPct = 16.0;
        const squeezeEfficiencyPerPass = 0.42;
        const pRound = Math.round(passes);
        const prevPasses = Math.max(0, pRound - 1);
        const currentSlag = initialSlagPct * (1 - squeezeEfficiencyPerPass) ** pRound;
        const prevSlag = initialSlagPct * (1 - squeezeEfficiencyPerPass) ** prevPasses;
        const deltaSlag = currentSlag - prevSlag;
        return {
          metricName: "Residual Slag Content",
          derivativeSymbol: "ΔSlag / ΔPass",
          derivativeValue: Number(deltaSlag.toFixed(2)),
          derivativeUnit: "% / pass",
          interpretation:
            "Discrete slag percentage expelled per grooved roller compression pass (hydrostatic cinder squeeze).",
        };
      }
      break;
    }

    case "us-x1-hopkins-potash": {
      const roastTempC = Number(
        params.roastTempC ??
          params.roastTemp ??
          params.tempC ??
          params.furnaceTemp ??
          params.furnaceTempC ??
          params.roastTemperature ??
          params.temperatureC ??
          750,
      );
      const roastTimeHours = Number(
        params.roastTimeHours ??
          params.roastingTime ??
          params.timeHours ??
          params.roastTime ??
          params.roastHours ??
          params.durationHours ??
          2.5,
      );
      const ashBatchKg = Number(
        params.ashBatchKg ??
          params.batchKg ??
          params.ashBatch ??
          params.ashMass ??
          params.rawAshKg ??
          200,
      );
      const waterTempC = Number(
        params.waterTempC ??
          params.waterTemp ??
          params.leachTempC ??
          params.leachWaterTemp ??
          params.leachWaterTempC ??
          params.waterTemperature ??
          80,
      );

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

      if (
        controlKey === "roastTempC" ||
        controlKey === "roastTemp" ||
        controlKey === "tempC" ||
        controlKey === "furnaceTemp" ||
        controlKey === "furnaceTempC" ||
        controlKey === "roastTemperature" ||
        controlKey === "temperatureC"
      ) {
        return {
          metricName: "Potash Carbon Burnout Purity",
          derivativeSymbol: "∂Purity / ∂T_roast",
          derivativeValue: 0.05,
          derivativeUnit: "% / °C",
          interpretation:
            "Secondary furnace combustion incinerating black carbon residue into pure pearlash.",
        };
      }
      if (
        controlKey === "waterTempC" ||
        controlKey === "waterTemp" ||
        controlKey === "leachTempC" ||
        controlKey === "leachWaterTemp" ||
        controlKey === "leachWaterTempC" ||
        controlKey === "waterTemperature"
      ) {
        return {
          metricName: "Potassium Carbonate Leaching Solubility",
          derivativeSymbol: "∂C_sat / ∂T_water",
          derivativeValue: 4.4,
          derivativeUnit: "(g/L) / °C",
          interpretation:
            "Aqueous solubility temperature coefficient: K2CO3 dissolution rate in hot leaching vats.",
        };
      }
      if (
        controlKey === "roastTimeHours" ||
        controlKey === "roastingTime" ||
        controlKey === "timeHours" ||
        controlKey === "roastTime" ||
        controlKey === "roastHours" ||
        controlKey === "durationHours"
      ) {
        const T_roastK = roastTempC + 273.15;
        const R_GAS = 8.314;
        const E_A = 62000;
        const A_PRE = 2000;
        const k_ox = A_PRE * Math.exp(-E_A / (R_GAS * T_roastK));
        const decarbonizationFraction = 1 - Math.exp(-k_ox * roastTimeHours);
        const decarbonizationPct = decarbonizationFraction * 100;
        const dDecarb =
          decarbonizationPct < 99.8 ? 100 * k_ox * Math.exp(-k_ox * roastTimeHours) : 0.0;
        return {
          metricName: "Carbon Combustion",
          derivativeSymbol: "∂η_comb / ∂t_roast",
          derivativeValue: Number(dDecarb.toFixed(2)),
          derivativeUnit: "% / hr",
          interpretation:
            "Kinetic rate of carbon combustion and pore-unclogging per hour of furnace roasting.",
        };
      }
      if (
        controlKey === "ashBatchKg" ||
        controlKey === "batchKg" ||
        controlKey === "ashBatch" ||
        controlKey === "ashMass" ||
        controlKey === "rawAshKg"
      ) {
        const T_roastK = roastTempC + 273.15;
        const R_GAS = 8.314;
        const E_A = 62000;
        const A_PRE = 2000;
        const k_ox = A_PRE * Math.exp(-E_A / (R_GAS * T_roastK));
        const decarbonizationFraction = 1 - Math.exp(-k_ox * roastTimeHours);
        const decarbonizationPct = Math.min(99.8, Math.max(10, decarbonizationFraction * 100));
        const carbonPoreFactor = 0.45 + 0.55 * (decarbonizationPct / 100);
        const tempLeachFactor = 0.65 + 0.35 * (waterTempC / 100);
        const extractionEfficiency = Math.min(0.96, carbonPoreFactor * tempLeachFactor);
        const dYieldDmass = 0.125 * extractionEfficiency * 0.98;
        return {
          metricName: "Pearl Ash Yield",
          derivativeSymbol: "∂m_yield / ∂m_ash",
          derivativeValue: Number(dYieldDmass.toFixed(4)),
          derivativeUnit: "kg / kg",
          interpretation:
            "Marginal potash yield per kilogram of raw hardwood ash batch (0.125 K₂CO₃ mass fraction · extraction efficiency · crystallization factor).",
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
      const v = params.batteryVoltage ?? params.voltage ?? params.batteryVolts ?? params.v ?? 12;
      const load = params.loadTorque ?? params.torque ?? params.load ?? params.torqueNm ?? 0.8;
      const claim1Active =
        params.isCommutatorActive !== undefined
          ? Number(params.isCommutatorActive) >= 0.5
          : params.claim1Active !== undefined
            ? Boolean(params.claim1Active)
            : true;

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

      const motor = stepDavenportMotor({ batteryVoltage: v, loadTorque: load });

      if (
        controlKey === "batteryVoltage" ||
        controlKey === "voltage" ||
        controlKey === "batteryVolts" ||
        controlKey === "v"
      ) {
        if (!claim1Active) {
          return {
            metricName: "Armature Commutated Rotational Speed",
            derivativeSymbol: "∂RPM / ∂V_batt",
            derivativeValue: 0,
            derivativeUnit: "RPM / V",
            interpretation:
              "Claim 1 position-dependent contact switching is withheld; revolving electromagnets freeze against stationary poles, halting continuous rotation.",
          };
        }
        return {
          metricName: "Armature Commutated Rotational Speed",
          derivativeSymbol: "∂RPM / ∂V_batt",
          derivativeValue: motor.rpmSlopePerVolt,
          derivativeUnit: "RPM / V",
          interpretation:
            "Continuous commutated rotor speed scaling with applied galvanic battery voltage across the Lorentz electromagnetic torque loop.",
        };
      }
      if (
        controlKey === "loadTorque" ||
        controlKey === "torque" ||
        controlKey === "load" ||
        controlKey === "torqueNm"
      ) {
        if (!claim1Active) {
          return {
            metricName: "Armature Speed Load Droop",
            derivativeSymbol: "∂RPM / ∂τ_load",
            derivativeValue: 0,
            derivativeUnit: "RPM / (N·m)",
            interpretation:
              "Claim 1 position-dependent contact switching is withheld; armature is stationary and exhibits no dynamic speed droop.",
          };
        }
        return {
          metricName: "Armature Speed Load Droop",
          derivativeSymbol: "∂RPM / ∂τ_load",
          derivativeValue: motor.rpmSlopePerNm,
          derivativeUnit: "RPM / (N·m)",
          interpretation:
            "Inverse rotational speed droop under mechanical shaft resisting load torque.",
        };
      }
      break;
    }

    case "us-4750-howe-sewing-machine": {
      const rpm =
        params.crankRpm ??
        params.rpm ??
        params.speed ??
        params.sewingSpeedRpm ??
        params.stitchingSpeedRpm ??
        240;
      const pitch = params.stitchPitchMm ?? params.pitch ?? params.feedPitch ?? 3.5;
      const slack = params.loopSlackPct ?? params.slack ?? params.slackPct ?? 65;
      const claim1Active = params.claim1Active !== undefined ? Boolean(params.claim1Active) : true;

      if (
        !Number.isFinite(rpm) ||
        rpm < 60 ||
        rpm > 420 ||
        !Number.isFinite(pitch) ||
        pitch < 1.0 ||
        pitch > 6.0 ||
        !Number.isFinite(slack) ||
        slack < 0 ||
        slack > 100
      ) {
        return null;
      }

      const howe = stepHoweSewingMachine(rpm, slack, pitch);

      if (
        controlKey === "crankRpm" ||
        controlKey === "rpm" ||
        controlKey === "speed" ||
        controlKey === "sewingSpeedRpm" ||
        controlKey === "stitchingSpeedRpm"
      ) {
        if (!claim1Active || !howe.claim1InterlockPossible) {
          return {
            metricName: "Lockstitch Formation Rate",
            derivativeSymbol: "∂Stitches / ∂RPM_crank",
            derivativeValue: 0,
            derivativeUnit: "stitches/min / RPM",
            interpretation: !claim1Active
              ? "Claim 1 eye-pointed needle and shuttle interlock is withheld; thread loop is not captured, halting stitch formation."
              : "Loop slack is below 40% threshold required for shuttle pass; needle loop does not clear the shuttle section.",
          };
        }
        return {
          metricName: "Lockstitch Formation Rate",
          derivativeSymbol: "∂Stitches / ∂RPM_crank",
          derivativeValue: howe.formationRateSlopePerRpm,
          derivativeUnit: "stitches/min / RPM",
          interpretation:
            "Synchronized eye-pointed needle penetration and reciprocating shuttle loop pass.",
        };
      }

      if (controlKey === "stitchPitchMm" || controlKey === "pitch" || controlKey === "feedPitch") {
        if (!claim1Active || !howe.claim1InterlockPossible) {
          return {
            metricName: "Cloth Feed Velocity",
            derivativeSymbol: "∂v_{feed} / ∂pitch",
            derivativeValue: 0,
            derivativeUnit: "(mm/s) / mm",
            interpretation:
              "Interlock condition refused; cloth advancement without valid stitch formation halts regular feed progression.",
          };
        }
        return {
          metricName: "Cloth Feed Velocity",
          derivativeSymbol: "∂v_{feed} / ∂pitch",
          derivativeValue: howe.feedSlopeMmPerSPerMm,
          derivativeUnit: "(mm/s) / mm",
          interpretation:
            "Linear cloth advancement velocity per millimetre of baster plate point pitch.",
        };
      }

      if (controlKey === "loopSlackPct" || controlKey === "slack" || controlKey === "slackPct") {
        return {
          metricName: "Needle Loop Shuttle Clearance",
          derivativeSymbol: "∂Clearance / ∂Slack",
          derivativeValue: howe.loopClearanceSlopePctPerPct,
          derivativeUnit: "% / %",
          interpretation:
            "Proportional loop slack margin above 40% minimum required for shuttle bobbin pass.",
        };
      }

      if (controlKey === "isCranking" || controlKey === "cranking") {
        const activeCadence = !claim1Active || !howe.claim1InterlockPossible ? 0 : rpm;
        return {
          metricName: "Lockstitch Formation State",
          derivativeSymbol: "ΔStitches / Δcranking",
          derivativeValue: activeCadence,
          derivativeUnit: "stitches/min / state",
          interpretation:
            "Discrete transition from stationary rest to declared crank rotation cadence.",
        };
      }

      if (controlKey === "claim1Active" || controlKey === "claim1InterlockEnabled") {
        const deltaCadence = howe.claim1InterlockPossible ? rpm : 0;
        return {
          metricName: "Lockstitch Formation Rate",
          derivativeSymbol: "ΔStitches / ΔClaim1",
          derivativeValue: deltaCadence,
          derivativeUnit: "stitches/min / claim",
          interpretation:
            "Discrete contribution of Claim 1 eye-pointed needle and shuttle interlock to stitch formation.",
        };
      }
      break;
    }

    case "us-6469-lincoln-buoy": {
      const inflation =
        params.inflationPct ??
        params.inflation ??
        params.expansionPct ??
        params.bellowsInflationPct ??
        75;
      const weight =
        params.weightTons ??
        params.weight ??
        params.steamboatWeightTons ??
        params.vesselCargoTons ??
        380;
      const depth =
        params.shoalDepth ??
        params.depth ??
        params.depthFt ??
        params.riverShoalDepthFt ??
        params.riverDepthFeet ??
        3.5;
      const claim1Active = params.claim1Active !== undefined ? Boolean(params.claim1Active) : true;

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

      const buoy = stepLincolnBuoy({
        inflationPct: inflation,
        weightTons: weight,
        shoalDepth: depth,
        claim1Active,
      });

      if (
        controlKey === "inflationPct" ||
        controlKey === "inflation" ||
        controlKey === "expansionPct" ||
        controlKey === "bellowsInflationPct" ||
        controlKey === "bellowsExpansionPercent"
      ) {
        if (!claim1Active) {
          return {
            metricName: "Hull Draft Shoal Reduction",
            derivativeSymbol: "∂Draft / ∂%_inflation",
            derivativeValue: 0,
            derivativeUnit: "ft / %",
            interpretation:
              "Claim 1 expandable buoyant chamber attachment is withheld; bellows are decoupled from hull, producing zero draft reduction.",
          };
        }
        return {
          metricName: "Hull Draft Shoal Reduction",
          derivativeSymbol: "∂Draft / ∂%_inflation",
          derivativeValue: buoy.draftReductionSlopeFtPerPct,
          derivativeUnit: "ft / %",
          interpretation:
            "Archimedes buoyant displacement lifting vessel over shallow river sandbars.",
        };
      }
      if (
        controlKey === "weightTons" ||
        controlKey === "weight" ||
        controlKey === "steamboatWeightTons" ||
        controlKey === "vesselCargoTons"
      ) {
        return {
          metricName: "Hull Draft Displacement Loading",
          derivativeSymbol: "∂Draft / ∂W_steamboat",
          derivativeValue: buoy.hullDraftSlopeFtPerTon,
          derivativeUnit: "ft / ton",
          interpretation:
            "Hydrostatic sinkage slope: waterplane displacement loading per additional ton of cargo or vessel weight.",
        };
      }
      if (
        controlKey === "shoalDepth" ||
        controlKey === "depth" ||
        controlKey === "depthFt" ||
        controlKey === "riverShoalDepthFt" ||
        controlKey === "riverDepthFeet"
      ) {
        return {
          metricName: "Shoal Keel Clearance Margin",
          derivativeSymbol: "∂Clearance / ∂d_{shoal}",
          derivativeValue: buoy.shoalClearanceSlopeFtPerFt,
          derivativeUnit: "ft / ft",
          interpretation:
            "Linear hydrostatic keel clearance margin over the riverbed shoal per foot of available water depth.",
        };
      }
      if (controlKey === "claim1Active" || controlKey === "claim1ChambersPresent") {
        return {
          metricName: "Hull Draft Shoal Reduction",
          derivativeSymbol: "ΔDraft / ΔClaim1",
          derivativeValue: buoy.draftReductionFt,
          derivativeUnit: "ft / claim",
          interpretation:
            "Discrete draft reduction contributed by Claim 1 buoyant expandable chambers operating on the steamboat hull.",
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
      const ngPct =
        params.ngConcentrationPct ??
        params.ngPercentage ??
        params.ngPct ??
        params.nitroglycerinRatioPct ??
        params.absorption ??
        75;
      const capEnergy =
        params.capEnergyJoules ??
        params.capEnergy ??
        params.capEnergyJ ??
        params.capJoules ??
        params.primerEnergy ??
        1.2;
      const claim1Active =
        params.claim1Active !== undefined
          ? typeof params.claim1Active === "number"
            ? params.claim1Active >= 0.5
            : Boolean(params.claim1Active)
          : true;

      if (
        !Number.isFinite(ngPct) ||
        ngPct < 50 ||
        ngPct > 85 ||
        !Number.isFinite(capEnergy) ||
        capEnergy < 0.2 ||
        capEnergy > 3.0
      ) {
        return null;
      }

      const nobel = stepNobelDynamite({
        ngConcentrationPct: ngPct,
        capEnergyJoules: capEnergy,
        claim1Active,
      });

      if (
        controlKey === "ngConcentrationPct" ||
        controlKey === "ngPercentage" ||
        controlKey === "ngPct" ||
        controlKey === "nitroglycerinRatioPct" ||
        controlKey === "absorption"
      ) {
        return {
          metricName: "Detonation Shock Front Velocity",
          derivativeSymbol: "∂v_det / ∂%_NG",
          derivativeValue: claim1Active ? nobel.detonationVelocitySlopeMpsPerPct : 0,
          derivativeUnit: "m/s / %",
          interpretation: claim1Active
            ? nobel.isInitiated
              ? "Chapman-Jouguet detonation wave speed through kieselguhr-stabilized nitroglycerin."
              : "Blasting cap energy is below the 0.4 J shock-initiation threshold; detonation velocity is 0 m/s."
            : "Claim 1 withheld: unabsorbed liquid nitroglycerin is unconfined and leaks from borehole; solid powder detonation cannot propagate (0 m/s / %).",
        };
      }
      if (
        controlKey === "capEnergyJoules" ||
        controlKey === "capEnergy" ||
        controlKey === "capEnergyJ" ||
        controlKey === "capJoules" ||
        controlKey === "primerEnergy"
      ) {
        return {
          metricName: "Blasting Cap Initiation Energy",
          derivativeSymbol: "∂E_det / ∂E_cap",
          derivativeValue: claim1Active ? 1.0 : 0,
          derivativeUnit: "J / J",
          interpretation: claim1Active
            ? "Mercury fulminate detonator shock initiation wave energy coupling into stabilized porous absorbent."
            : "Claim 1 withheld: without porous silicious earth absorbent, detonator shock fails to couple into stabilized powder charge (0 J / J).",
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
      const tension =
        params.wireTensionN ?? params.tensionN ?? params.tension ?? params.lineTensionN ?? 650;
      const twists = params.twistsPerFoot ?? params.twists ?? params.twistRate ?? 5.0;
      const push =
        params.animalPushForceN ?? params.pushForceN ?? params.pushForce ?? params.push ?? 120;
      const claim1Active = params.claim1Active !== undefined ? Boolean(params.claim1Active) : true;

      if (
        !Number.isFinite(tension) ||
        tension < 200 ||
        tension > 3500 ||
        !Number.isFinite(twists) ||
        twists < 1.0 ||
        twists > 10.0 ||
        !Number.isFinite(push) ||
        push < 20 ||
        push > 1200
      ) {
        return null;
      }

      const glidden = stepGliddenBarbedWire({
        wireTensionN: tension,
        twistsPerFoot: twists,
        animalPushForceN: push,
      });

      if (controlKey === "twistsPerFoot" || controlKey === "twists" || controlKey === "twistRate") {
        if (!claim1Active) {
          return {
            metricName: "Spurred Barb Interlock Clamping Force",
            derivativeSymbol: "∂F_clamp / ∂Twist",
            derivativeValue: 0,
            derivativeUnit: "N / twist",
            interpretation:
              "Claim 1 twisted dual-strand wire lock is withheld; barbs slide freely along single uncoiled strand without torsional clamping.",
          };
        }
        return {
          metricName: "Spurred Barb Interlock Clamping Force",
          derivativeSymbol: "∂F_clamp / ∂Twist",
          derivativeValue: glidden.barbSlipThresholdSlopeNPerTwist,
          derivativeUnit: "N / twist",
          interpretation:
            "Twisted dual-strand wire clamping short coiled spurred barbs against lateral sliding.",
        };
      }
      if (
        controlKey === "wireTensionN" ||
        controlKey === "tensionN" ||
        controlKey === "tension" ||
        controlKey === "lineTensionN"
      ) {
        return {
          metricName: "Fence Span Elastic Sag Stiffness",
          derivativeSymbol: "∂δ_sag / ∂T_wire",
          derivativeValue: glidden.sagSlopeMmPerN,
          derivativeUnit: "mm / N",
          interpretation:
            "Longitudinal tensile pre-stress reducing catenary sag under transverse contact loads.",
        };
      }
      if (
        controlKey === "animalPushForceN" ||
        controlKey === "pushForceN" ||
        controlKey === "pushForce" ||
        controlKey === "push"
      ) {
        return {
          metricName: "Barb Contact Stress",
          derivativeSymbol: "∂σ_contact / ∂F_push",
          derivativeValue: glidden.contactStressSlopeMpaPerN,
          derivativeUnit: "MPa / N",
          interpretation:
            "Concentrated point-contact pressure scaling inversely with spur sharp cross-sectional area (0.25 mm²).",
        };
      }
      break;
    }

    case "us-313224-mergenthaler-linotype": {
      const rate =
        params.matrixRate ??
        params.matrixRatePerMin ??
        params.typesettingSpeed ??
        params.matrixSpeed ??
        60;
      const wedge =
        params.spacebandWedge ?? params.spacebandWedgeMm ?? params.wedge ?? params.wedgeMm ?? 6.5;
      const temp =
        params.potTemp ?? params.potTempC ?? params.metalTemp ?? params.temperatureC ?? 260;
      const picas =
        params.lineLengthPicas ??
        params.columnMeasurePicas ??
        params.lineLength ??
        params.measurePicas ??
        13;

      if (
        !Number.isFinite(rate) ||
        rate < 10 ||
        rate > 120 ||
        !Number.isFinite(wedge) ||
        wedge < 2.0 ||
        wedge > 12.0 ||
        !Number.isFinite(temp) ||
        temp < 220 ||
        temp > 300 ||
        !Number.isFinite(picas) ||
        picas < 8 ||
        picas > 26
      ) {
        return null;
      }

      if (
        controlKey === "spacebandWedge" ||
        controlKey === "spacebandWedgeMm" ||
        controlKey === "wedge" ||
        controlKey === "wedgeMm"
      ) {
        return {
          metricName: "Line Justification Expansion",
          derivativeSymbol: "∂Width / ∂WedgeLift",
          derivativeValue: 4.2,
          derivativeUnit: "mm / mm",
          interpretation:
            "Double-wedge spaceband sliding elevation justifying assembled character line against casting jaws.",
        };
      }
      if (
        controlKey === "matrixRate" ||
        controlKey === "matrixRatePerMin" ||
        controlKey === "typesettingSpeed" ||
        controlKey === "matrixSpeed"
      ) {
        return {
          metricName: "Matrix Distributor Escapement Frequency",
          derivativeSymbol: "∂f_dist / ∂Rate",
          derivativeValue: Number((1 / 60).toFixed(4)),
          derivativeUnit: "Hz / (char/min)",
          interpretation:
            "Distributor lift frequency scaling linearly with assembled matrix input rate.",
        };
      }
      if (
        controlKey === "potTemp" ||
        controlKey === "potTempC" ||
        controlKey === "metalTemp" ||
        controlKey === "temperatureC"
      ) {
        return {
          metricName: "Lead-Tin-Antimony Solidification Duration",
          derivativeSymbol: "∂t_solid / ∂T_pot",
          derivativeValue: Number((450 / 260).toFixed(4)),
          derivativeUnit: "ms / °C",
          interpretation:
            "Thermal casting quench duration scaling with lead pot melt temperature above eutectic point.",
        };
      }
      if (
        controlKey === "lineLengthPicas" ||
        controlKey === "columnMeasurePicas" ||
        controlKey === "lineLength" ||
        controlKey === "measurePicas"
      ) {
        return {
          metricName: "Column Measure Linotype Slug Length",
          derivativeSymbol: "∂Width / ∂Pica",
          derivativeValue: 4.2333,
          derivativeUnit: "mm / pica",
          interpretation:
            "Typographic measure scaling column line width: 1 pica = 12 points = 4.2333 mm.",
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
      const claim1Active =
        params.claim1Active === undefined
          ? true
          : typeof params.claim1Active === "number"
            ? params.claim1Active >= 0.5
            : Boolean(params.claim1Active);
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
        if (!claim1Active) {
          return {
            metricName: "Compression Temperature (Model)",
            derivativeSymbol: "∂T_comp / ∂CR",
            derivativeValue: 0,
            derivativeUnit: "°C / ratio",
            interpretation:
              "Claim 1 pure air pre-compression to self-ignition threshold is inactive; compression ignition requires adequate cylinder compression ratio.",
          };
        }
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
        if (!claim1Active) {
          return {
            metricName: "Brake Efficiency (Model)",
            derivativeSymbol: "∂η_brake / ∂r_c",
            derivativeValue: 0,
            derivativeUnit: "percentage points / ratio",
            interpretation:
              "Claim 1 gradual combustion during expansion is inactive; cycle cannot produce indicated work without fuel injection.",
          };
        }
        return {
          metricName: "Brake Efficiency (Model)",
          derivativeSymbol: "∂η_brake / ∂r_c",
          derivativeValue: Number(diesel.brakeEfficiencySlopePctPerCutoffRatio.toPrecision(6)),
          derivativeUnit: "percentage points / ratio",
          interpretation:
            "Derivative of the shared teaching model at the current compression and cutoff ratios, before display rounding. It includes the same illustrative 0.68 brake-efficiency factor as the readout; γ = 1.4 and the other inputs are held fixed. Public endpoints use the admitted one-sided slope, not historic performance measurements.",
        };
      }
      if (
        controlKey === "blastAirPressure" ||
        controlKey === "blastAirPressureBar" ||
        controlKey === "blastPressure"
      ) {
        if (!claim1Active) {
          return {
            metricName: "Blast Injection Pressure Margin",
            derivativeSymbol: "∂ΔP_inj / ∂P_blast",
            derivativeValue: 0,
            derivativeUnit: "bar / bar",
            interpretation: "Claim 1 blast air injection into high-pressure cylinder is inactive.",
          };
        }
        return {
          metricName: "Blast Injection Pressure Margin",
          derivativeSymbol: "∂ΔP_inj / ∂P_blast",
          derivativeValue: 1.0,
          derivativeUnit: "bar / bar",
          interpretation:
            "Direct linear margin of blast injection pressure over peak cylinder compression pressure (P_blast - P_comp) governing fuel atomization into the combustion chamber.",
        };
      }
      if (controlKey === "engineRpm" || controlKey === "rpm") {
        if (!claim1Active) {
          return {
            metricName: "Crankshaft Angular Velocity",
            derivativeSymbol: "∂ω / ∂RPM",
            derivativeValue: 0,
            derivativeUnit: "rad·s⁻¹ / rpm",
            interpretation:
              "Claim 1 diesel combustion cycle is inactive; engine crankshaft is stationary.",
          };
        }
        return {
          metricName: "Crankshaft Angular Velocity",
          derivativeSymbol: "∂ω / ∂RPM",
          derivativeValue: Number((Math.PI / 30).toPrecision(6)),
          derivativeUnit: "rad·s⁻¹ / rpm",
          interpretation:
            "Exact derivative 2π/60 relating cyclic engine crankshaft revolution rate to rotational angular velocity.",
        };
      }
      if (controlKey === "claim1Active" || controlKey === "claim1") {
        return {
          metricName: "Claim 1 Compression-Ignition Cycle State",
          derivativeSymbol: "∂Cycle / ∂u_claim",
          derivativeValue: 1,
          derivativeUnit: "cycle state / claim fraction",
          interpretation:
            "Discrete activation of Claim 1 method of compressing pure air beyond fuel ignition temperature and injecting fuel directly into heated air during initial expansion.",
        };
      }
      break;
    }

    case "us-1219881-sundback-zipper": {
      const pos =
        params.sliderPositionPct ??
        params.sliderPosition ??
        params.posPct ??
        params.position ??
        params.sliderPos ??
        65;
      const pull = params.pullForceN ?? params.pullForce ?? params.pull ?? params.pullN ?? 15;
      const lat =
        params.lateralTensionN ??
        params.lateralTension ??
        params.tension ??
        params.tensionN ??
        params.transverseTension ??
        40;
      const flex =
        params.flexAngleDeg ??
        params.flexAngle ??
        params.flexDeg ??
        params.flexion ??
        params.bendingAngle ??
        25;
      const tpi =
        params.toothDensityTpi ?? params.toothDensity ?? params.tpi ?? params.densityTpi ?? 11;
      const stagger =
        params.staggerAligned ?? params.stagger ?? params.staggered ?? params.claim1Stagger ?? 1;

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
        tpi > 14 ||
        !Number.isFinite(stagger) ||
        stagger < 0 ||
        stagger > 1
      ) {
        return null;
      }

      if (
        controlKey === "sliderPositionPct" ||
        controlKey === "sliderPosition" ||
        controlKey === "posPct" ||
        controlKey === "position" ||
        controlKey === "sliderPos"
      ) {
        const totalTeeth = Math.round(ZIPPER_CHAIN_LENGTH_MM / (25.4 / tpi));
        const rate = (stagger >= 0.5 ? 1 : 0) * (totalTeeth / 100);
        return {
          metricName: "Engaged Tooth Count",
          derivativeSymbol: "∂N_engaged / ∂x_slider",
          derivativeValue: Number(rate.toFixed(3)),
          derivativeUnit: "teeth / %",
          interpretation:
            "Linear progression of Y-slider cam engaging opposing staggered scoops sequentially.",
        };
      }
      if (
        controlKey === "pullForceN" ||
        controlKey === "pullForce" ||
        controlKey === "pull" ||
        controlKey === "pullN"
      ) {
        return {
          metricName: "Cam Wedge Normal Force",
          derivativeSymbol: "∂F_n / ∂F_pull",
          derivativeValue: 1.25,
          derivativeUnit: "N / N",
          interpretation:
            "Mechanical advantage of the converging slider guide channels converting axial pull into transverse scoop compression.",
        };
      }
      if (
        controlKey === "lateralTensionN" ||
        controlKey === "lateralTension" ||
        controlKey === "tension" ||
        controlKey === "tensionN" ||
        controlKey === "transverseTension"
      ) {
        return {
          metricName: "Corded Tape Strain",
          derivativeSymbol: "∂ε / ∂F_lat",
          derivativeUnit: "% / N",
          derivativeValue: Number((100 / (850 * 2)).toFixed(4)),
          interpretation:
            "Elastic elongation of reinforced cotton cords under transverse tensile load.",
        };
      }
      if (
        controlKey === "flexAngleDeg" ||
        controlKey === "flexAngle" ||
        controlKey === "flexDeg" ||
        controlKey === "flexion" ||
        controlKey === "bendingAngle"
      ) {
        const h = 1e-3;
        const fwd = stepSundbackZipperSi({
          sliderPositionPct: pos,
          pullForceN: pull,
          lateralTensionN: lat,
          flexAngleDeg: flex + h,
          toothDensityTpi: tpi,
          staggerAligned: stagger >= 0.5,
        }).burstResistanceN;
        const bwd = stepSundbackZipperSi({
          sliderPositionPct: pos,
          pullForceN: pull,
          lateralTensionN: lat,
          flexAngleDeg: flex - h,
          toothDensityTpi: tpi,
          staggerAligned: stagger >= 0.5,
        }).burstResistanceN;
        const dBurst_dFlex = (fwd - bwd) / (2 * h);
        return {
          metricName: "Bending Burst Resistance",
          derivativeSymbol: "∂F_burst / ∂θ_flex",
          derivativeValue: Number(dBurst_dFlex.toFixed(3)),
          derivativeUnit: "N / deg",
          interpretation:
            "Reduction in transverse interlocking burst resistance caused by angular scoop misalignment under tape flexing.",
        };
      }
      if (
        controlKey === "toothDensityTpi" ||
        controlKey === "toothDensity" ||
        controlKey === "tpi" ||
        controlKey === "densityTpi"
      ) {
        const h = 1e-3;
        const fwd = stepSundbackZipperSi({
          sliderPositionPct: pos,
          pullForceN: pull,
          lateralTensionN: lat,
          flexAngleDeg: flex,
          toothDensityTpi: tpi + h,
          staggerAligned: stagger >= 0.5,
        }).engagedTeeth;
        const bwd = stepSundbackZipperSi({
          sliderPositionPct: pos,
          pullForceN: pull,
          lateralTensionN: lat,
          flexAngleDeg: flex,
          toothDensityTpi: tpi - h,
          staggerAligned: stagger >= 0.5,
        }).engagedTeeth;
        const dTeeth_dTpi = (fwd - bwd) / (2 * h);
        return {
          metricName: "Tooth Density Capacity",
          derivativeSymbol: "∂N_engaged / ∂TPI",
          derivativeValue: Number(dTeeth_dTpi.toFixed(2)),
          derivativeUnit: "teeth / TPI",
          interpretation:
            "Increase in linear interlocking scoop packing and chain shear capacity with higher teeth-per-inch density.",
        };
      }
      if (
        controlKey === "staggerAligned" ||
        controlKey === "stagger" ||
        controlKey === "staggered" ||
        controlKey === "claim1Stagger"
      ) {
        return {
          metricName: "Claim 1 Half-Pitch Stagger Interlock",
          derivativeSymbol: "ΔState / ΔStagger",
          derivativeValue: 0,
          derivativeUnit: "state",
          interpretation:
            stagger >= 0.5
              ? "Opposing scoops staggered by one-half pitch nest smoothly into alternating sockets (Claim 1 compliant)."
              : "Claim 1 stagger violated: opposing scoops collide head-to-head, jamming the slider throat.",
        };
      }
      break;
    }

    case "us-2717437-mestral-velcro": {
      const rawD =
        params.filamentDiameterMm ??
        params.diameter ??
        params.filamentDiameter ??
        params.diameterMm;
      if (rawD !== undefined && (!Number.isFinite(rawD) || rawD < 0.1 || rawD > 0.35)) {
        return null;
      }
      const rawL =
        params.hookLengthMm ??
        params.length ??
        params.hookHeight ??
        params.hookLength ??
        params.heightMm;
      if (rawL !== undefined && (!Number.isFinite(rawL) || rawL < 1.0 || rawL > 3.0)) {
        return null;
      }
      const rawRho =
        params.hookDensityPerCm2 ??
        params.density ??
        params.pileDensity ??
        params.hookDensity ??
        params.densityPerCm2;
      if (rawRho !== undefined && (!Number.isFinite(rawRho) || rawRho < 20 || rawRho > 120)) {
        return null;
      }
      const rawAngle =
        params.peelAngleDeg ??
        params.angle ??
        params.peelAngle ??
        params.clampAngle ??
        params.angleDeg;
      if (
        rawAngle !== undefined &&
        (!Number.isFinite(rawAngle) || rawAngle < 20 || rawAngle > 160)
      ) {
        return null;
      }
      const rawProg =
        params.peelProgress ??
        params.progress ??
        params.peelFront ??
        params.advance ??
        params.peelAdvance;
      if (
        rawProg !== undefined &&
        (!Number.isFinite(rawProg) || rawProg < 0.05 || rawProg > 0.95)
      ) {
        return null;
      }

      const controls = readMestralVelcroControls(params);
      if (
        controlKey === "filamentDiameterMm" ||
        controlKey === "diameter" ||
        controlKey === "filamentDiameter" ||
        controlKey === "diameterMm"
      ) {
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
      if (
        controlKey === "hookLengthMm" ||
        controlKey === "length" ||
        controlKey === "hookHeight" ||
        controlKey === "hookLength" ||
        controlKey === "heightMm"
      ) {
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
      if (
        controlKey === "hookDensityPerCm2" ||
        controlKey === "density" ||
        controlKey === "pileDensity" ||
        controlKey === "hookDensity" ||
        controlKey === "densityPerCm2"
      ) {
        return {
          metricName: "Visible Pile Row Population",
          derivativeSymbol: "∂Rows / ∂ρ",
          derivativeValue: 0.04,
          derivativeUnit: "rows / cm⁻²",
          interpretation:
            "Quantized museum display row scaling per unit pile density over the illustrative 20-120 cm⁻² range.",
        };
      }
      if (
        controlKey === "peelAngleDeg" ||
        controlKey === "peelAngle" ||
        controlKey === "angle" ||
        controlKey === "clampAngle" ||
        controlKey === "angleDeg"
      ) {
        return {
          metricName: "Applied Clamp Direction Angle",
          derivativeSymbol: "∂θ_clamp / ∂θ_input",
          derivativeValue: 1.0,
          derivativeUnit: "deg / deg",
          interpretation:
            "Direct one-to-one angular orientation of the external peel clamp boundary vector relative to the horizontal hook foundation tape (15° to 165°).",
        };
      }
      if (
        controlKey === "peelProgress" ||
        controlKey === "progress" ||
        controlKey === "peelFront" ||
        controlKey === "advance" ||
        controlKey === "peelAdvance"
      ) {
        return {
          metricName: "Peel Front Advance",
          derivativeSymbol: "∂x_peel / ∂u_peel",
          derivativeValue: 1.0,
          derivativeUnit: "normalized / normalized",
          interpretation:
            "Linear progression of the normalized peel separation boundary dividing engaged opposing hooks from released tape along the longitudinal axis.",
        };
      }
      break;
    }

    case "us-2846084-goertz-electronic-master-slave-manipulator": {
      const rawHPivot =
        params.horizontalArmPivot ??
        params.hPivot ??
        params.armPivot ??
        params.horizontalPivot ??
        params.axis113b;
      if (
        rawHPivot !== undefined &&
        (!Number.isFinite(rawHPivot) || rawHPivot < -1 || rawHPivot > 1)
      ) {
        return null;
      }
      const rawHRoll =
        params.horizontalArmRoll ?? params.hRoll ?? params.armRoll ?? params.horizontalRoll;
      if (rawHRoll !== undefined && (!Number.isFinite(rawHRoll) || rawHRoll < -1 || rawHRoll > 1)) {
        return null;
      }
      const rawVPivot =
        params.verticalArmPivot ??
        params.vPivot ??
        params.vertPivot ??
        params.verticalPivot ??
        params.axis126;
      if (
        rawVPivot !== undefined &&
        (!Number.isFinite(rawVPivot) || rawVPivot < -1 || rawVPivot > 1)
      ) {
        return null;
      }
      const rawVRoll =
        params.verticalArmRoll ?? params.vRoll ?? params.vertRoll ?? params.verticalRoll;
      if (rawVRoll !== undefined && (!Number.isFinite(rawVRoll) || rawVRoll < -1 || rawVRoll > 1)) {
        return null;
      }
      const rawAxis171 =
        params.toolAxis171 ??
        params.axis171 ??
        params.toolPivot171 ??
        params.wrist171 ??
        params.pitch171;
      if (
        rawAxis171 !== undefined &&
        (!Number.isFinite(rawAxis171) || rawAxis171 < -1 || rawAxis171 > 1)
      ) {
        return null;
      }
      const rawAxis172 =
        params.toolAxis172 ??
        params.axis172 ??
        params.toolPivot172 ??
        params.wrist172 ??
        params.yaw172;
      if (
        rawAxis172 !== undefined &&
        (!Number.isFinite(rawAxis172) || rawAxis172 < -1 || rawAxis172 > 1)
      ) {
        return null;
      }
      const rawGrip =
        params.gripperClosure ??
        params.gripper ??
        params.closure ??
        params.grip ??
        params.jawClosure ??
        params.toolClosure;
      if (rawGrip !== undefined && (!Number.isFinite(rawGrip) || rawGrip < 0 || rawGrip > 1)) {
        return null;
      }
      const rawContact =
        params.contactResistance ??
        params.contact ??
        params.resistance ??
        params.obstruction ??
        params.gripperObstruction;
      if (
        rawContact !== undefined &&
        (!Number.isFinite(rawContact) || rawContact < 0 || rawContact > 1)
      ) {
        return null;
      }
      const rawReflection =
        params.forceReflectionEnabled ??
        params.forceReflection ??
        params.reflection ??
        params.forceFeedback ??
        params.claim9;
      if (
        rawReflection !== undefined &&
        (!Number.isFinite(Number(rawReflection)) ||
          Number(rawReflection) < 0 ||
          Number(rawReflection) > 1)
      ) {
        return null;
      }
      const rawDamping =
        params.tachometerDampingEnabled ??
        params.tachometerDamping ??
        params.tachometer ??
        params.damping ??
        params.rateFeedback ??
        params.claim11;
      if (
        rawDamping !== undefined &&
        (!Number.isFinite(Number(rawDamping)) || Number(rawDamping) < 0 || Number(rawDamping) > 1)
      ) {
        return null;
      }
      const rawLimiter =
        params.limiterEnabled ??
        params.limiter ??
        params.saturationLimiter ??
        params.claim10 ??
        params.claim12;
      if (
        rawLimiter !== undefined &&
        (!Number.isFinite(Number(rawLimiter)) || Number(rawLimiter) < 0 || Number(rawLimiter) > 1)
      ) {
        return null;
      }

      const controls = readGoertzMasterSlaveControls(params);
      const h = 0.01;

      if (
        controlKey === "horizontalArmPivot" ||
        controlKey === "hPivot" ||
        controlKey === "armPivot" ||
        controlKey === "horizontalPivot" ||
        controlKey === "axis113b"
      ) {
        return {
          metricName: "Horizontal Arm Pivot Master-Slave Tracking",
          derivativeSymbol: "∂q_s,113b / ∂q_m,113b",
          derivativeValue: 1.0,
          derivativeUnit: "normalized slave / normalized master",
          interpretation:
            "Direct 1:1 bilateral synchro electrical correspondence: slave shoulder azimuth tracks master handle azimuth.",
        };
      }
      if (
        controlKey === "horizontalArmRoll" ||
        controlKey === "hRoll" ||
        controlKey === "armRoll" ||
        controlKey === "horizontalRoll"
      ) {
        return {
          metricName: "Horizontal Arm Roll Master-Slave Tracking",
          derivativeSymbol: "∂q_s,hroll / ∂q_m,hroll",
          derivativeValue: 1.0,
          derivativeUnit: "normalized slave / normalized master",
          interpretation:
            "Direct 1:1 bilateral synchro electrical correspondence: slave horizontal arm roll tracks master handle roll.",
        };
      }
      if (
        controlKey === "verticalArmPivot" ||
        controlKey === "vPivot" ||
        controlKey === "vertPivot" ||
        controlKey === "verticalPivot" ||
        controlKey === "axis126"
      ) {
        return {
          metricName: "Vertical Arm Pivot Master-Slave Tracking",
          derivativeSymbol: "∂q_s,126 / ∂q_m,126",
          derivativeValue: 1.0,
          derivativeUnit: "normalized slave / normalized master",
          interpretation:
            "Direct 1:1 bilateral synchro electrical correspondence: slave elbow elevation tracks master elbow elevation.",
        };
      }
      if (
        controlKey === "verticalArmRoll" ||
        controlKey === "vRoll" ||
        controlKey === "vertRoll" ||
        controlKey === "verticalRoll"
      ) {
        return {
          metricName: "Vertical Arm Roll Master-Slave Tracking",
          derivativeSymbol: "∂q_s,vroll / ∂q_m,vroll",
          derivativeValue: 1.0,
          derivativeUnit: "normalized slave / normalized master",
          interpretation:
            "Direct 1:1 bilateral synchro electrical correspondence: slave vertical forearm roll tracks master forearm roll.",
        };
      }
      if (
        controlKey === "toolAxis171" ||
        controlKey === "axis171" ||
        controlKey === "toolPivot171" ||
        controlKey === "wrist171" ||
        controlKey === "pitch171"
      ) {
        return {
          metricName: "Tool Wrist Pitch Master-Slave Tracking",
          derivativeSymbol: "∂q_s,171 / ∂q_m,171",
          derivativeValue: 1.0,
          derivativeUnit: "normalized slave / normalized master",
          interpretation:
            "Direct 1:1 bilateral synchro electrical correspondence: slave wrist pitch tracks master handle pitch.",
        };
      }
      if (
        controlKey === "toolAxis172" ||
        controlKey === "axis172" ||
        controlKey === "toolPivot172" ||
        controlKey === "wrist172" ||
        controlKey === "yaw172"
      ) {
        return {
          metricName: "Tool Wrist Yaw Master-Slave Tracking",
          derivativeSymbol: "∂q_s,172 / ∂q_m,172",
          derivativeValue: 1.0,
          derivativeUnit: "normalized slave / normalized master",
          interpretation:
            "Direct 1:1 bilateral synchro electrical correspondence: slave wrist yaw tracks master handle yaw.",
        };
      }
      if (
        controlKey === "contactResistance" ||
        controlKey === "contact" ||
        controlKey === "resistance" ||
        controlKey === "obstruction" ||
        controlKey === "gripperObstruction"
      ) {
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
      if (
        controlKey === "gripperClosure" ||
        controlKey === "gripper" ||
        controlKey === "closure" ||
        controlKey === "grip" ||
        controlKey === "jawClosure" ||
        controlKey === "toolClosure"
      ) {
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
      if (
        controlKey === "forceReflectionEnabled" ||
        controlKey === "forceReflection" ||
        controlKey === "reflection" ||
        controlKey === "forceFeedback" ||
        controlKey === "claim9"
      ) {
        return {
          metricName: "Claim 9 Bilateral Force Reflection",
          derivativeSymbol: "ΔState / ΔReflection",
          derivativeValue: 0,
          derivativeUnit: "state",
          interpretation:
            controls.forceReflectionEnabled === 1
              ? "Claim 9 bilateral servo loop active: slave gripper obstruction generates proportional feedback torque onto operator handle."
              : "Claim 9 bilateral loop disabled: unilateral position tracking without tactile feedback.",
        };
      }
      if (
        controlKey === "tachometerDampingEnabled" ||
        controlKey === "tachometerDamping" ||
        controlKey === "tachometer" ||
        controlKey === "damping" ||
        controlKey === "rateFeedback" ||
        controlKey === "claim11"
      ) {
        return {
          metricName: "Claim 11 Relative Velocity Damping",
          derivativeSymbol: "ΔState / ΔDamping",
          derivativeValue: 0,
          derivativeUnit: "state",
          interpretation:
            controls.tachometerDampingEnabled === 1
              ? "Claim 11 tachometer rate circuit active: relative-speed voltage (V_t ∝ q̇_m − q̇_s) suppresses servo hunting and oscillation."
              : "Claim 11 damping loop disabled: undamped synchro position error drives servos directly.",
        };
      }
      if (
        controlKey === "limiterEnabled" ||
        controlKey === "limiter" ||
        controlKey === "saturationLimiter" ||
        controlKey === "claim10" ||
        controlKey === "claim12"
      ) {
        return {
          metricName: "Claims 10/12 Drive Signal Limiter",
          derivativeSymbol: "ΔState / ΔLimiter",
          derivativeValue: 0,
          derivativeUnit: "state",
          interpretation:
            controls.limiterEnabled === 1
              ? "Claims 10 and 12 limiter circuit active: clamps peak error signal to bound amplifier power and prevent actuator overdrive."
              : "Limiter disabled: unconstrained error signal can overdrive amplifiers during large step transitions.",
        };
      }
      break;
    }

    case "us-4341502-makino-scara": {
      const rawTheta1 =
        params.firstLinkAngleDeg ?? params.firstLinkAngle ?? params.theta1 ?? params.link1Angle;
      if (
        rawTheta1 !== undefined &&
        (!Number.isFinite(rawTheta1) || rawTheta1 < -180 || rawTheta1 > 180)
      ) {
        return null;
      }
      const rawTheta4 =
        params.fourthLinkAngleDeg ??
        params.fourthLinkAngle ??
        params.theta2 ??
        params.theta4 ??
        params.link4Angle;
      if (
        rawTheta4 !== undefined &&
        (!Number.isFinite(rawTheta4) || rawTheta4 < -180 || rawTheta4 > 180)
      ) {
        return null;
      }
      const rawAttitude =
        params.toolAttitudeDeg ?? params.toolAttitude ?? params.phi ?? params.attitude;
      if (
        rawAttitude !== undefined &&
        (!Number.isFinite(rawAttitude) || rawAttitude < -180 || rawAttitude > 180)
      ) {
        return null;
      }
      const rawTopology =
        params.topologyVariant ??
        params.topology ??
        params.claimTopology ??
        params.variant ??
        params.claim;
      if (
        rawTopology !== undefined &&
        (!Number.isFinite(rawTopology) || rawTopology < 1 || rawTopology > 3)
      ) {
        return null;
      }

      const centralDifference = (
        control: "firstLinkAngleDeg" | "fourthLinkAngleDeg",
        coordinate: 0 | 1,
      ) => {
        const center = control === "firstLinkAngleDeg" ? (rawTheta1 ?? 32) : (rawTheta4 ?? -38);
        const deltaDeg = 0.01;
        const high = stepMakinoScaraTopology({
          ...params,
          [control]: center + deltaDeg,
        });
        const low = stepMakinoScaraTopology({
          ...params,
          [control]: center - deltaDeg,
        });
        return (high.tool[coordinate] - low.tool[coordinate]) / (2 * deltaDeg);
      };

      if (
        controlKey === "firstLinkAngleDeg" ||
        controlKey === "firstLinkAngle" ||
        controlKey === "theta1" ||
        controlKey === "link1Angle"
      ) {
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

      if (
        controlKey === "fourthLinkAngleDeg" ||
        controlKey === "fourthLinkAngle" ||
        controlKey === "theta2" ||
        controlKey === "theta4" ||
        controlKey === "link4Angle"
      ) {
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

      if (
        controlKey === "toolAttitudeDeg" ||
        controlKey === "toolAttitude" ||
        controlKey === "phi" ||
        controlKey === "attitude"
      ) {
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

      if (
        controlKey === "topologyVariant" ||
        controlKey === "topology" ||
        controlKey === "claimTopology" ||
        controlKey === "variant" ||
        controlKey === "claim"
      ) {
        return {
          metricName: "Independent Claim Variant",
          derivativeSymbol: "Δclaim / Δvariant",
          derivativeValue: 1.0,
          derivativeUnit: "claim mode / step",
          interpretation:
            "Selects among Claim 1 (concentric coaxial drive), Claim 3 (offset base shafts), and Claim 6 (parallel Y-link constraint fixing tool orientation).",
        };
      }

      break;
    }

    case "us-3081379-lemelson-machine-vision": {
      const rawScan =
        params.scanPathEnabled ??
        params.scanPath ??
        params.scan ??
        params.scanEnabled ??
        params.beamScan;
      const rawGate =
        params.synchronizedGateEnabled ??
        params.synchronizedGate ??
        params.gate ??
        params.gateEnabled ??
        params.syncGate;
      const rawCircuit =
        params.analyzingCircuitEnabled ??
        params.analyzingCircuit ??
        params.circuit ??
        params.analysis ??
        params.analyzerEnabled;
      const rawInspection =
        params.inspectionSignalPresent ??
        params.inspectionSignal ??
        params.pictureSignal ??
        params.signalPresent;
      const rawReference =
        params.referenceSignalMatches ??
        params.referenceSignal ??
        params.referenceMatch ??
        params.referenceMatches ??
        params.reference;

      if (
        (rawScan !== undefined && (!Number.isFinite(rawScan) || rawScan < 0 || rawScan > 1)) ||
        (rawGate !== undefined && (!Number.isFinite(rawGate) || rawGate < 0 || rawGate > 1)) ||
        (rawCircuit !== undefined &&
          (!Number.isFinite(rawCircuit) || rawCircuit < 0 || rawCircuit > 1)) ||
        (rawInspection !== undefined &&
          (!Number.isFinite(rawInspection) || rawInspection < 0 || rawInspection > 1)) ||
        (rawReference !== undefined &&
          (!Number.isFinite(rawReference) || rawReference < 0 || rawReference > 1))
      ) {
        return null;
      }

      if (
        controlKey === "scanPathEnabled" ||
        controlKey === "scanPath" ||
        controlKey === "scan" ||
        controlKey === "scanEnabled" ||
        controlKey === "beamScan"
      ) {
        return {
          metricName: "Claim 1 Scan-Path State",
          derivativeSymbol: "ΔScan / ΔscanPath",
          derivativeValue: 1.0,
          derivativeUnit: "state / state",
          interpretation:
            "Discrete sensitivity: Claim 1 electron-beam scan path availability state (1.0 when active, 0.0 when withheld).",
        };
      }

      if (
        controlKey === "synchronizedGateEnabled" ||
        controlKey === "synchronizedGate" ||
        controlKey === "gate" ||
        controlKey === "gateEnabled" ||
        controlKey === "syncGate"
      ) {
        return {
          metricName: "Claim 1 Synchronized Gate State",
          derivativeSymbol: "ΔGate / ΔsyncGate",
          derivativeValue: 1.0,
          derivativeUnit: "state / state",
          interpretation:
            "Discrete sensitivity: Claim 1 synchronized gating signal path state (1.0 when active, 0.0 when withheld).",
        };
      }

      if (
        controlKey === "analyzingCircuitEnabled" ||
        controlKey === "analyzingCircuit" ||
        controlKey === "circuit" ||
        controlKey === "analysis" ||
        controlKey === "analyzerEnabled"
      ) {
        return {
          metricName: "Claim 1 Analyzing Circuit State",
          derivativeSymbol: "ΔCircuit / Δanalyzer",
          derivativeValue: 1.0,
          derivativeUnit: "state / state",
          interpretation:
            "Discrete sensitivity: Claim 1 video analyzing and comparator circuit state.",
        };
      }

      if (
        controlKey === "inspectionSignalPresent" ||
        controlKey === "inspectionSignal" ||
        controlKey === "pictureSignal" ||
        controlKey === "signalPresent"
      ) {
        return {
          metricName: "Inspection Picture Signal Presence",
          derivativeSymbol: "ΔSignal / Δinspection",
          derivativeValue: 1.0,
          derivativeUnit: "state / state",
          interpretation:
            "Discrete sensitivity: picture signal presence at the scanning aperture during object inspection.",
        };
      }

      if (
        controlKey === "referenceSignalMatches" ||
        controlKey === "referenceSignal" ||
        controlKey === "referenceMatch" ||
        controlKey === "referenceMatches" ||
        controlKey === "reference"
      ) {
        return {
          metricName: "Reference Comparison Match State",
          derivativeSymbol: "ΔMatch / Δreference",
          derivativeValue: 1.0,
          derivativeUnit: "state / state",
          interpretation:
            "Discrete sensitivity: comparison of inspected signal with preset standard (1.0 for match, 0.0 for difference).",
        };
      }

      break;
    }

    case "us-3119501-lemelson-automatic-warehousing": {
      const rawRail =
        params.railAddressFraction ??
        params.railAddress ??
        params.carrierX ??
        params.railFraction ??
        params.xAddress ??
        params.rail;
      if (rawRail !== undefined && (!Number.isFinite(rawRail) || rawRail < 0 || rawRail > 1)) {
        return null;
      }
      const rawLevel =
        params.levelAddressFraction ??
        params.levelAddress ??
        params.carrierY ??
        params.levelFraction ??
        params.yAddress ??
        params.verticalAddress ??
        params.level ??
        params.vertical;
      if (rawLevel !== undefined && (!Number.isFinite(rawLevel) || rawLevel < 0 || rawLevel > 1)) {
        return null;
      }
      const rawShuttle =
        params.shuttleExtensionFraction ??
        params.shuttleExtension ??
        params.shuttleZ ??
        params.extensionFraction ??
        params.zExtension ??
        params.shuttle ??
        params.extension;
      if (
        rawShuttle !== undefined &&
        (!Number.isFinite(rawShuttle) || rawShuttle < 0 || rawShuttle > 1)
      ) {
        return null;
      }
      const rawAddressing =
        params.automaticAddressing ??
        params.autoAddressing ??
        params.presetAddressing ??
        params.claim1 ??
        params.addressing ??
        params.automaticSequence;
      if (
        rawAddressing !== undefined &&
        (!Number.isFinite(Number(rawAddressing)) ||
          Number(rawAddressing) < 0 ||
          Number(rawAddressing) > 1)
      ) {
        return null;
      }
      const automaticAddressing = rawAddressing !== undefined ? Number(rawAddressing) >= 0.5 : true;

      if (
        controlKey === "railAddressFraction" ||
        controlKey === "railAddress" ||
        controlKey === "carrierX" ||
        controlKey === "railFraction" ||
        controlKey === "xAddress" ||
        controlKey === "rail"
      ) {
        const pose = stepLemelsonWarehouseTopology(params);
        return {
          metricName: "Normalized Rail Address",
          derivativeSymbol: "∂q_x / ∂a_x",
          derivativeValue: pose.carrierX === (rawRail ?? 0.55) ? 1 : 0,
          derivativeUnit: "display fraction / address fraction",
          interpretation:
            "The normalized exhibit maps its rail-address control directly to the carrier pose; the grant supplies no bay spacing in meters.",
        };
      }
      if (
        controlKey === "levelAddressFraction" ||
        controlKey === "levelAddress" ||
        controlKey === "carrierY" ||
        controlKey === "levelFraction" ||
        controlKey === "yAddress" ||
        controlKey === "verticalAddress" ||
        controlKey === "level" ||
        controlKey === "vertical"
      ) {
        return {
          metricName: "Normalized Vertical Address",
          derivativeSymbol: "∂q_z / ∂a_z",
          derivativeValue: 1,
          derivativeUnit: "display fraction / address fraction",
          interpretation:
            "The normalized exhibit maps its level-address control directly to the lift pose; no shelf height is asserted.",
        };
      }
      if (
        controlKey === "shuttleExtensionFraction" ||
        controlKey === "shuttleExtension" ||
        controlKey === "shuttleZ" ||
        controlKey === "extensionFraction" ||
        controlKey === "zExtension" ||
        controlKey === "shuttle" ||
        controlKey === "extension"
      ) {
        return {
          metricName: "Normalized Shuttle Extension",
          derivativeSymbol: "∂q_y / ∂a_y",
          derivativeValue: 1,
          derivativeUnit: "display fraction / extension fraction",
          interpretation:
            "The normalized exhibit maps the control directly to the transverse transfer pose; no reach, speed, or payload is asserted.",
        };
      }
      if (
        controlKey === "automaticAddressing" ||
        controlKey === "autoAddressing" ||
        controlKey === "presetAddressing" ||
        controlKey === "claim1" ||
        controlKey === "addressing" ||
        controlKey === "automaticSequence"
      ) {
        return {
          metricName: "Preset-Count Marker Addressing Interlock",
          derivativeSymbol: "ΔState / ΔAddressing",
          derivativeValue: 0,
          derivativeUnit: "state",
          interpretation: automaticAddressing
            ? "Preset-count marker addressing active: carrier automatically decrements bay and level count markers until zero coincidence stops the carriage at the target bin."
            : "Manual positioning mode: automatic marker counting and sequence progression disabled.",
        };
      }
      break;
    }

    case "us-2988237-devol-programmed-transfer": {
      const rawRecorded =
        params.recordedSlot ??
        params.recordedCode ??
        params.programSlot ??
        params.programCode ??
        params.recordedPosition ??
        params.recorded;
      if (
        rawRecorded !== undefined &&
        (!Number.isFinite(rawRecorded) || rawRecorded < 0 || rawRecorded > 255)
      ) {
        return null;
      }
      const rawSensed =
        params.sensedSlot ??
        params.sensedCode ??
        params.encoderSlot ??
        params.encoderCode ??
        params.sensedPosition ??
        params.sensed;
      if (
        rawSensed !== undefined &&
        (!Number.isFinite(rawSensed) || rawSensed < 0 || rawSensed > 255)
      ) {
        return null;
      }
      const rawBitWidth =
        params.bitWidth ??
        params.bits ??
        params.codeBits ??
        params.resolutionBits ??
        params.codeWidth;
      if (
        rawBitWidth !== undefined &&
        (!Number.isFinite(rawBitWidth) || rawBitWidth < 2 || rawBitWidth > 8)
      ) {
        return null;
      }
      const rawAnticipation =
        params.anticipationEnabled ??
        params.anticipation ??
        params.claim8 ??
        params.anticipatorySensing ??
        params.advanceSensing;
      if (
        rawAnticipation !== undefined &&
        (!Number.isFinite(Number(rawAnticipation)) ||
          Number(rawAnticipation) < 0 ||
          Number(rawAnticipation) > 1)
      ) {
        return null;
      }
      const rawMode =
        params.recordingMode ??
        params.recordMode ??
        params.claim5 ??
        params.teachMode ??
        params.mode;
      if (
        rawMode !== undefined &&
        (!Number.isFinite(Number(rawMode)) || Number(rawMode) < 0 || Number(rawMode) > 1)
      ) {
        return null;
      }
      const rawGripper =
        params.gripperClosed ??
        params.gripper ??
        params.claim6 ??
        params.gripperState ??
        params.jawClosed ??
        params.seizing;
      if (
        rawGripper !== undefined &&
        (!Number.isFinite(Number(rawGripper)) || Number(rawGripper) < 0 || Number(rawGripper) > 1)
      ) {
        return null;
      }

      const anticipationEnabled =
        rawAnticipation !== undefined ? Number(rawAnticipation) >= 0.5 : true;
      const recordingMode = rawMode !== undefined ? Number(rawMode) >= 0.5 : false;
      const gripperClosed = rawGripper !== undefined ? Number(rawGripper) >= 0.5 : false;

      if (
        controlKey === "recordedSlot" ||
        controlKey === "recordedCode" ||
        controlKey === "programSlot" ||
        controlKey === "programCode" ||
        controlKey === "recordedPosition" ||
        controlKey === "recorded"
      ) {
        return {
          metricName: "Recorded Position Symbol",
          derivativeSymbol: "∂c_prog / ∂u_slot",
          derivativeValue: 1,
          derivativeUnit: "code value / code value",
          interpretation:
            "Identity relation for the magnetic drum's recorded position code; it does not assert physical actuator travel or line speed.",
        };
      }
      if (
        controlKey === "sensedSlot" ||
        controlKey === "sensedCode" ||
        controlKey === "encoderSlot" ||
        controlKey === "encoderCode" ||
        controlKey === "sensedPosition" ||
        controlKey === "sensed"
      ) {
        return {
          metricName: "Sensed Position Symbol",
          derivativeSymbol: "∂c_enc / ∂u_slot",
          derivativeValue: 1,
          derivativeUnit: "code value / code value",
          interpretation:
            "Identity relation for the shaft-encoder position code; it does not assert physical joint angle or actuator displacement.",
        };
      }
      if (
        controlKey === "bitWidth" ||
        controlKey === "bits" ||
        controlKey === "codeBits" ||
        controlKey === "resolutionBits" ||
        controlKey === "codeWidth"
      ) {
        const bitWidth = Number(rawBitWidth ?? 6);
        return {
          metricName: "Encoder Address Resolution",
          derivativeSymbol: "∂N_codes / ∂B",
          derivativeValue: Number((2 ** bitWidth * Math.LN2).toFixed(2)),
          derivativeUnit: "codes / bit",
          interpretation:
            "Marginal rate of addressable program position expansion (2^B quantization states) with increasing binary track width.",
        };
      }
      if (
        controlKey === "anticipationEnabled" ||
        controlKey === "anticipation" ||
        controlKey === "claim8" ||
        controlKey === "anticipatorySensing" ||
        controlKey === "advanceSensing"
      ) {
        return {
          metricName: "Claim 8 Anticipatory Sensing Interlock",
          derivativeSymbol: "ΔState / ΔAnticipation",
          derivativeValue: 0,
          derivativeUnit: "state",
          interpretation: anticipationEnabled
            ? "Claim 8 anticipatory sensing active: advance brushes detect approach to target slot and progressively decelerate hydraulic servos prior to coincidence."
            : "Claim 8 anticipatory sensing disabled: servos operate at full slew until abrupt true-position dead stop.",
        };
      }
      if (
        controlKey === "recordingMode" ||
        controlKey === "recordMode" ||
        controlKey === "claim5" ||
        controlKey === "teachMode" ||
        controlKey === "mode"
      ) {
        return {
          metricName: "Claim 5 Record / Replay Mode",
          derivativeSymbol: "ΔState / ΔMode",
          derivativeValue: 0,
          derivativeUnit: "state",
          interpretation: recordingMode
            ? "Claim 5 teach-in registration: recording heads imprint operator-commanded joint positions onto magnetic drum tracks."
            : "Claim 5 playback mode: pickup heads read recorded positions and compare against shaft encoders for automated replay.",
        };
      }
      if (
        controlKey === "gripperClosed" ||
        controlKey === "gripper" ||
        controlKey === "claim6" ||
        controlKey === "gripperState" ||
        controlKey === "jawClosed" ||
        controlKey === "seizing"
      ) {
        return {
          metricName: "Claim 6 Article Gripper State",
          derivativeSymbol: "ΔState / ΔGripper",
          derivativeValue: 0,
          derivativeUnit: "state",
          interpretation: gripperClosed
            ? "Claim 6 terminal manipulator actuator: jaws closed in workpiece seizing state."
            : "Claim 6 article gripper: jaws open for approach and release transfer.",
        };
      }
      break;
    }

    case "us-3212649-amf-versatran": {
      const rawColumn =
        params.columnRotation ??
        params.column ??
        params.rotation ??
        params.columnTurn ??
        params.turn;
      if (
        rawColumn !== undefined &&
        (!Number.isFinite(rawColumn) || rawColumn < -1 || rawColumn > 1)
      ) {
        return null;
      }
      const rawLift =
        params.carriageLift ??
        params.lift ??
        params.carriage ??
        params.verticalLift ??
        params.verticalTravel;
      if (rawLift !== undefined && (!Number.isFinite(rawLift) || rawLift < 0 || rawLift > 1)) {
        return null;
      }
      const rawReach =
        params.armTravel ??
        params.reach ??
        params.arm ??
        params.horizontalTravel ??
        params.horizontalReach ??
        params.extension;
      if (rawReach !== undefined && (!Number.isFinite(rawReach) || rawReach < 0 || rawReach > 1)) {
        return null;
      }
      const rawWristRot =
        params.wristRotation ?? params.wristTurn ?? params.roll ?? params.armAxisRotation;
      if (
        rawWristRot !== undefined &&
        (!Number.isFinite(rawWristRot) || rawWristRot < -1 || rawWristRot > 1)
      ) {
        return null;
      }
      const rawWristSwing = params.wristSwing ?? params.swing ?? params.yaw ?? params.wristAngle;
      if (
        rawWristSwing !== undefined &&
        (!Number.isFinite(rawWristSwing) || rawWristSwing < -1 || rawWristSwing > 1)
      ) {
        return null;
      }
      const rawGripper =
        params.gripperOperation ?? params.gripper ?? params.jaw ?? params.grip ?? params.jawClosure;
      if (
        rawGripper !== undefined &&
        (!Number.isFinite(rawGripper) || rawGripper < 0 || rawGripper > 1)
      ) {
        return null;
      }
      const rawMode =
        params.teachReplayMode ??
        params.mode ??
        params.replayMode ??
        params.teachMode ??
        params.playbackMode ??
        params.recordReplay;
      if (
        rawMode !== undefined &&
        (!Number.isFinite(Number(rawMode)) || Number(rawMode) < 0 || Number(rawMode) > 1)
      ) {
        return null;
      }
      const rawOffset =
        params.resolverPhaseOffset ??
        params.phaseOffset ??
        params.offset ??
        params.resolverOffset ??
        params.phaseError;
      if (
        rawOffset !== undefined &&
        (!Number.isFinite(rawOffset) || rawOffset < -1 || rawOffset > 1)
      ) {
        return null;
      }
      const rawClaim1 =
        params.claim1TopologyEnabled ??
        params.claim1 ??
        params.claim1Topology ??
        params.sixMotionTopology ??
        params.topologyEnabled;
      if (
        rawClaim1 !== undefined &&
        (!Number.isFinite(Number(rawClaim1)) || Number(rawClaim1) < 0 || Number(rawClaim1) > 1)
      ) {
        return null;
      }
      const rawClaim8 =
        params.claim8RecordPlaybackEnabled ??
        params.claim8 ??
        params.claim8Playback ??
        params.recordPlaybackEnabled ??
        params.recordPlayback;
      if (
        rawClaim8 !== undefined &&
        (!Number.isFinite(Number(rawClaim8)) || Number(rawClaim8) < 0 || Number(rawClaim8) > 1)
      ) {
        return null;
      }
      const rawClaim12 =
        params.claim12PinionGripperEnabled ??
        params.claim12 ??
        params.claim12Gripper ??
        params.pinionGripperEnabled ??
        params.pinionGripper;
      if (
        rawClaim12 !== undefined &&
        (!Number.isFinite(Number(rawClaim12)) || Number(rawClaim12) < 0 || Number(rawClaim12) > 1)
      ) {
        return null;
      }

      const claim1TopologyEnabled = rawClaim1 !== undefined ? Number(rawClaim1) >= 0.5 : true;
      const claim8RecordPlaybackEnabled = rawClaim8 !== undefined ? Number(rawClaim8) >= 0.5 : true;
      const claim12PinionGripperEnabled =
        rawClaim12 !== undefined ? Number(rawClaim12) >= 0.5 : true;

      // Motion channels gated by Claim 1
      if (
        controlKey === "columnRotation" ||
        controlKey === "column" ||
        controlKey === "rotation" ||
        controlKey === "columnTurn" ||
        controlKey === "turn" ||
        controlKey === "carriageLift" ||
        controlKey === "lift" ||
        controlKey === "carriage" ||
        controlKey === "verticalLift" ||
        controlKey === "verticalTravel" ||
        controlKey === "armTravel" ||
        controlKey === "reach" ||
        controlKey === "arm" ||
        controlKey === "horizontalTravel" ||
        controlKey === "horizontalReach" ||
        controlKey === "extension" ||
        controlKey === "wristRotation" ||
        controlKey === "wristTurn" ||
        controlKey === "roll" ||
        controlKey === "armAxisRotation" ||
        controlKey === "wristSwing" ||
        controlKey === "swing" ||
        controlKey === "yaw" ||
        controlKey === "wristAngle"
      ) {
        if (!claim1TopologyEnabled) {
          return {
            metricName: "Normalized Motion Display Sensitivity",
            derivativeSymbol: "∂p_{display} / ∂q_{joint}",
            derivativeValue: 0,
            derivativeUnit: "display coordinate / command",
            interpretation:
              "Claim 1 six-motion topology withheld; motion commands are disengaged from the hydraulic manipulator.",
          };
        }
        if (
          controlKey === "armTravel" ||
          controlKey === "reach" ||
          controlKey === "arm" ||
          controlKey === "horizontalTravel" ||
          controlKey === "horizontalReach" ||
          controlKey === "extension"
        ) {
          return {
            metricName: "Horizontal Reach Sensitivity",
            derivativeSymbol: "∂r_{display} / ∂q_{arm}",
            derivativeValue: 0.72,
            derivativeUnit: "normalized radius / control increment",
            interpretation:
              "Display-only radial relationship used to make arm travel legible. It is not a recovered arm length, calibrated workspace, or speed relationship.",
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

      if (
        controlKey === "gripperOperation" ||
        controlKey === "gripper" ||
        controlKey === "jaw" ||
        controlKey === "grip" ||
        controlKey === "jawClosure"
      ) {
        return {
          metricName: "Normalized Gripper Operation",
          derivativeSymbol: "∂g_{display} / ∂q_{gripper}",
          derivativeValue: claim12PinionGripperEnabled ? 1.0 : 0,
          derivativeUnit: "display command / control increment",
          interpretation: claim12PinionGripperEnabled
            ? "Direct display relationship for the source-described work-manipulating-member operation. It does not predict jaw travel, grip force, contact, or payload."
            : "Claim 12 pinion gripper mechanism disengaged; gripper command does not actuate the jaws.",
        };
      }

      if (
        controlKey === "resolverPhaseOffset" ||
        controlKey === "phaseOffset" ||
        controlKey === "offset" ||
        controlKey === "resolverOffset" ||
        controlKey === "phaseError"
      ) {
        return {
          metricName: "Phase Error Sensitivity",
          derivativeSymbol: "∂(Δφ) / ∂(φ_offset)",
          derivativeValue: claim8RecordPlaybackEnabled ? 1.0 : 0,
          derivativeUnit: "normalized phase / normalized phase",
          interpretation: claim8RecordPlaybackEnabled
            ? "Direct display relationship between the deliberately injected normalized phase offset and the normalized resolver/tape phase difference."
            : "Claim 8 record/playback path disengaged; resolver phase comparison channels are not active.",
        };
      }

      if (
        controlKey === "teachReplayMode" ||
        controlKey === "mode" ||
        controlKey === "replayMode" ||
        controlKey === "teachMode" ||
        controlKey === "playbackMode" ||
        controlKey === "recordReplay"
      ) {
        return {
          metricName: "Recorded Playback Mode Transition",
          derivativeSymbol: "∂(mode) / ∂(teachReplay)",
          derivativeValue: claim8RecordPlaybackEnabled ? 1.0 : 0,
          derivativeUnit: "playback state / mode switch",
          interpretation: claim8RecordPlaybackEnabled
            ? "Binary state transition between manual teach/record and automatic recorded-signal playback (gated by Claim 8 record/playback path)."
            : "Claim 8 record/playback path disengaged; mode switch cannot activate automated tape playback.",
        };
      }

      if (
        controlKey === "claim1TopologyEnabled" ||
        controlKey === "claim1" ||
        controlKey === "claim1Topology" ||
        controlKey === "sixMotionTopology" ||
        controlKey === "topologyEnabled"
      ) {
        return {
          metricName: "Claim 1 Six-Motion Topology Gate",
          derivativeSymbol: "∂(topology) / ∂(claim1)",
          derivativeValue: 1.0,
          derivativeUnit: "active / claim probe",
          interpretation: "Claim 1 gating for the six-motion hydraulic manipulator topology.",
        };
      }

      if (
        controlKey === "claim8RecordPlaybackEnabled" ||
        controlKey === "claim8" ||
        controlKey === "claim8Playback" ||
        controlKey === "recordPlaybackEnabled" ||
        controlKey === "recordPlayback"
      ) {
        return {
          metricName: "Claim 8 Record/Playback Path Gate",
          derivativeSymbol: "∂(playback) / ∂(claim8)",
          derivativeValue: 1.0,
          derivativeUnit: "active / claim probe",
          interpretation:
            "Claim 8 gating for the continuous tape record and resolver playback comparison path.",
        };
      }

      if (
        controlKey === "claim12PinionGripperEnabled" ||
        controlKey === "claim12" ||
        controlKey === "claim12Gripper" ||
        controlKey === "pinionGripperEnabled" ||
        controlKey === "pinionGripper"
      ) {
        return {
          metricName: "Claim 12 Pinion Gripper Gate",
          derivativeSymbol: "∂(gripper) / ∂(claim12)",
          derivativeValue: 1.0,
          derivativeUnit: "active / claim probe",
          interpretation: "Claim 12 gating for the rack-and-pinion mechanical gripper mechanism.",
        };
      }
      break;
    }

    case "us-3260375-lemelson-adjustable-manipulator": {
      const rawCarriage =
        params.carriagePosition ??
        params.carriage ??
        params.carriageX ??
        params.xPosition ??
        params.positionX;
      if (
        rawCarriage !== undefined &&
        (!Number.isFinite(rawCarriage) || rawCarriage < -1 || rawCarriage > 1)
      ) {
        return null;
      }
      const rawElevation =
        params.columnElevation ?? params.elevation ?? params.columnZ ?? params.lift ?? params.hoist;
      if (
        rawElevation !== undefined &&
        (!Number.isFinite(rawElevation) || rawElevation < 0 || rawElevation > 1)
      ) {
        return null;
      }
      const rawAzimuth =
        params.columnAzimuth ??
        params.azimuth ??
        params.turntable ??
        params.turntableAngle ??
        params.rotation;
      if (
        rawAzimuth !== undefined &&
        (!Number.isFinite(rawAzimuth) || rawAzimuth < -1 || rawAzimuth > 1)
      ) {
        return null;
      }
      const rawPivot =
        params.wristPivot ?? params.pivot ?? params.wrist ?? params.wristAngle ?? params.bevelPivot;
      if (rawPivot !== undefined && (!Number.isFinite(rawPivot) || rawPivot < -1 || rawPivot > 1)) {
        return null;
      }
      const rawJaw =
        params.jawClosure ?? params.gripper ?? params.jaw ?? params.grip ?? params.closure;
      if (rawJaw !== undefined && (!Number.isFinite(rawJaw) || rawJaw < 0 || rawJaw > 1)) {
        return null;
      }
      const rawPhase =
        params.cyclePhase ?? params.phase ?? params.stage ?? params.sequencePhase ?? params.step;
      if (rawPhase !== undefined && (!Number.isFinite(rawPhase) || rawPhase < 0 || rawPhase > 5)) {
        return null;
      }
      const rawStop1Az =
        params.stop1Azimuth ?? params.stop1Rotary ?? params.azimuthLimit1 ?? params.stop1Angle;
      if (
        rawStop1Az !== undefined &&
        (!Number.isFinite(rawStop1Az) || rawStop1Az < -1 || rawStop1Az > 1)
      ) {
        return null;
      }
      const rawStop2Az =
        params.stop2Azimuth ?? params.stop2Rotary ?? params.azimuthLimit2 ?? params.stop2Angle;
      if (
        rawStop2Az !== undefined &&
        (!Number.isFinite(rawStop2Az) || rawStop2Az < -1 || rawStop2Az > 1)
      ) {
        return null;
      }
      const rawStop1El =
        params.stop1Elevation ??
        params.stop1Vertical ??
        params.verticalLimit1 ??
        params.stop1Height;
      if (
        rawStop1El !== undefined &&
        (!Number.isFinite(rawStop1El) || rawStop1El < 0 || rawStop1El > 1)
      ) {
        return null;
      }
      const rawStop2El =
        params.stop2Elevation ??
        params.stop2Vertical ??
        params.verticalLimit2 ??
        params.stop2Height;
      if (
        rawStop2El !== undefined &&
        (!Number.isFinite(rawStop2El) || rawStop2El < 0 || rawStop2El > 1)
      ) {
        return null;
      }

      if (
        controlKey === "columnAzimuth" ||
        controlKey === "azimuth" ||
        controlKey === "turntable" ||
        controlKey === "turntableAngle" ||
        controlKey === "rotation"
      ) {
        return {
          metricName: "Azimuth Angle Sensitivity",
          derivativeSymbol: "∂θ_{rad} / ∂q_{azimuth}",
          derivativeValue: Math.PI,
          derivativeUnit: "rad / control increment",
          interpretation:
            "Direct coordinate angular gradient for the rotating manipulator turntable.",
        };
      }
      if (
        controlKey === "wristPivot" ||
        controlKey === "pivot" ||
        controlKey === "wrist" ||
        controlKey === "wristAngle" ||
        controlKey === "bevelPivot"
      ) {
        return {
          metricName: "Wrist Pivot Angle Sensitivity",
          derivativeSymbol: "∂φ_{rad} / ∂q_{pivot}",
          derivativeValue: Math.PI / 2,
          derivativeUnit: "rad / control increment",
          interpretation: "Geometric rate of wrist bevel pivot rotation.",
        };
      }
      if (
        controlKey === "carriagePosition" ||
        controlKey === "carriage" ||
        controlKey === "carriageX" ||
        controlKey === "xPosition" ||
        controlKey === "positionX"
      ) {
        return {
          metricName: "Normalized Axis Coordinate Sensitivity",
          derivativeSymbol: "∂q_{display} / ∂q_{control}",
          derivativeValue: 1.0,
          derivativeUnit: "display coordinate / control unit",
          interpretation:
            "Linear coordinate mapping for the gantry and hoist motions without unprinted force or velocity assumptions.",
        };
      }
      if (
        controlKey === "columnElevation" ||
        controlKey === "elevation" ||
        controlKey === "columnZ" ||
        controlKey === "lift" ||
        controlKey === "hoist"
      ) {
        return {
          metricName: "Normalized Axis Coordinate Sensitivity",
          derivativeSymbol: "∂q_{display} / ∂q_{control}",
          derivativeValue: 1.0,
          derivativeUnit: "display coordinate / control unit",
          interpretation:
            "Linear coordinate mapping for the gantry and hoist motions without unprinted force or velocity assumptions.",
        };
      }
      if (
        controlKey === "jawClosure" ||
        controlKey === "gripper" ||
        controlKey === "jaw" ||
        controlKey === "grip" ||
        controlKey === "closure"
      ) {
        return {
          metricName: "Jaw Closure Sensitivity",
          derivativeSymbol: "∂g / ∂q_{jaw}",
          derivativeValue: -1.0,
          derivativeUnit: "opening fraction / control increment",
          interpretation:
            "Normalized jaw opening complement relationship without unprinted grip force or contact mechanics.",
        };
      }
      if (
        controlKey === "cyclePhase" ||
        controlKey === "phase" ||
        controlKey === "stage" ||
        controlKey === "sequencePhase" ||
        controlKey === "step"
      ) {
        return {
          metricName: "Sequential Phase Index Step",
          derivativeSymbol: "∂(phase) / ∂(cyclePhase)",
          derivativeValue: 1.0,
          derivativeUnit: "phase index / phase step",
          interpretation:
            "Discrete step advance through the source-described 6-stage sequential limit-switch cycle.",
        };
      }
      if (
        controlKey === "stop1Azimuth" ||
        controlKey === "stop1Rotary" ||
        controlKey === "azimuthLimit1" ||
        controlKey === "stop1Angle"
      ) {
        return {
          metricName: "Stop 1 Azimuth Limit Sensitivity",
          derivativeSymbol: "∂θ_{stop1} / ∂q_{stop1}",
          derivativeValue: Math.PI,
          derivativeUnit: "rad / control increment",
          interpretation: "Angular limit position for adjustable rotary stop 1.",
        };
      }
      if (
        controlKey === "stop2Azimuth" ||
        controlKey === "stop2Rotary" ||
        controlKey === "azimuthLimit2" ||
        controlKey === "stop2Angle"
      ) {
        return {
          metricName: "Stop 2 Azimuth Limit Sensitivity",
          derivativeSymbol: "∂θ_{stop2} / ∂q_{stop2}",
          derivativeValue: Math.PI,
          derivativeUnit: "rad / control increment",
          interpretation: "Angular limit position for adjustable rotary stop 2.",
        };
      }
      if (
        controlKey === "stop1Elevation" ||
        controlKey === "stop1Vertical" ||
        controlKey === "verticalLimit1" ||
        controlKey === "stop1Height"
      ) {
        return {
          metricName: "Stop 1 Vertical Limit Sensitivity",
          derivativeSymbol: "∂z_{stop1} / ∂q_{stop1}",
          derivativeValue: 1.0,
          derivativeUnit: "normalized stroke / control increment",
          interpretation: "Vertical limit position for adjustable hoist stop 1.",
        };
      }
      if (
        controlKey === "stop2Elevation" ||
        controlKey === "stop2Vertical" ||
        controlKey === "verticalLimit2" ||
        controlKey === "stop2Height"
      ) {
        return {
          metricName: "Stop 2 Vertical Limit Sensitivity",
          derivativeSymbol: "∂z_{stop2} / ∂q_{stop2}",
          derivativeValue: 1.0,
          derivativeUnit: "normalized stroke / control increment",
          interpretation: "Vertical limit position for adjustable hoist stop 2.",
        };
      }
      break;
    }

    case "us-3858581-kamen-medication-injection-device": {
      const rawPulse =
        params.selectedPulseCount ??
        params.pulseCount ??
        params.pulses ??
        params.turnsCount ??
        params.selectedPulses;
      if (rawPulse !== undefined && (!Number.isFinite(rawPulse) || rawPulse < 1 || rawPulse > 99)) {
        return null;
      }
      const rawSpeed =
        params.displayTurnsPerSecond ??
        params.displaySpeed ??
        params.turnsPerSecond ??
        params.motorSpeed ??
        params.speed;
      if (rawSpeed !== undefined && (!Number.isFinite(rawSpeed) || rawSpeed < 1 || rawSpeed > 12)) {
        return null;
      }
      const rawOff =
        params.offIntervalDisplaySeconds ??
        params.offInterval ??
        params.pauseInterval ??
        params.motorOffSeconds ??
        params.offSeconds;
      if (rawOff !== undefined && (!Number.isFinite(rawOff) || rawOff < 0.5 || rawOff > 8)) {
        return null;
      }
      const rawClutch =
        params.clutchEngaged ?? params.clutch ?? params.clutchCoupled ?? params.claim3Clutch;
      if (
        rawClutch !== undefined &&
        (!Number.isFinite(Number(rawClutch)) || Number(rawClutch) < 0 || Number(rawClutch) > 1)
      ) {
        return null;
      }
      const rawRunning = params.running ?? params.run ?? params.active ?? params.motorRunning;
      if (
        rawRunning !== undefined &&
        (!Number.isFinite(Number(rawRunning)) || Number(rawRunning) < 0 || Number(rawRunning) > 1)
      ) {
        return null;
      }

      const clutchEngaged = rawClutch !== undefined ? Number(rawClutch) >= 0.5 : true;

      if (
        controlKey === "selectedPulseCount" ||
        controlKey === "pulseCount" ||
        controlKey === "pulses" ||
        controlKey === "turnsCount" ||
        controlKey === "selectedPulses"
      ) {
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
      if (
        controlKey === "displayTurnsPerSecond" ||
        controlKey === "displaySpeed" ||
        controlKey === "turnsPerSecond" ||
        controlKey === "motorSpeed" ||
        controlKey === "speed"
      ) {
        return {
          metricName: "Counted Stop Coordinate",
          derivativeSymbol: "∂N_{stop} / ∂ω_{display}",
          derivativeValue: 0,
          derivativeUnit: "screw-turn events / (display turns/s)",
          interpretation:
            "Changing the deliberately accelerated museum display speed changes how quickly the animation reaches the stop, not the integer screw-turn count at which counters 114/116 switch the motor off.",
        };
      }
      if (
        controlKey === "offIntervalDisplaySeconds" ||
        controlKey === "offInterval" ||
        controlKey === "pauseInterval" ||
        controlKey === "motorOffSeconds" ||
        controlKey === "offSeconds"
      ) {
        return {
          metricName: "Motor-Off Display Pause Interval",
          derivativeSymbol: "∂t_off / ∂t_interval",
          derivativeValue: 1.0,
          derivativeUnit: "display s / display s",
          interpretation:
            "Linear pause duration scaling for the museum demonstration loop between sequential pulse delivery cycles.",
        };
      }
      if (
        controlKey === "clutchEngaged" ||
        controlKey === "clutch" ||
        controlKey === "clutchCoupled" ||
        controlKey === "claim3Clutch"
      ) {
        return {
          metricName: "Claim 3 Clutch Lead Screw Drive Coupling",
          derivativeSymbol: "Δcoupling / Δclutch",
          derivativeValue: 1.0,
          derivativeUnit: "state / norm",
          interpretation:
            "Operating the Claim 3 axial clutch physically couples motor drive to the lead screw and counter striker.",
        };
      }
      if (
        controlKey === "running" ||
        controlKey === "run" ||
        controlKey === "active" ||
        controlKey === "motorRunning"
      ) {
        return {
          metricName: "Mechanism Run State",
          derivativeSymbol: "Δpower / Δrun",
          derivativeValue: 1.0,
          derivativeUnit: "state / norm",
          interpretation:
            "Toggling running state gates motor excitation and real-time mechanism stepping.",
        };
      }
      break;
    }

    case "us-4098001-watson-rcc": {
      const rawLateral =
        params.lateralContactFraction ??
        params.lateralContact ??
        params.contactFraction ??
        params.contact;
      if (
        rawLateral !== undefined &&
        (!Number.isFinite(rawLateral) || rawLateral < 0 || rawLateral > 1)
      ) {
        return null;
      }
      const rawMismatch =
        params.axisMismatchFraction ??
        params.axisMismatch ??
        params.mismatchFraction ??
        params.mismatch;
      if (
        rawMismatch !== undefined &&
        (!Number.isFinite(rawMismatch) || rawMismatch < 0 || rawMismatch > 1)
      ) {
        return null;
      }
      const rawRemote =
        params.remoteCenterTopology ??
        params.remoteCenter ??
        params.claim1Topology ??
        params.topology;
      if (
        rawRemote !== undefined &&
        (!Number.isFinite(rawRemote) || rawRemote < 0 || rawRemote > 1)
      ) {
        return null;
      }
      const rawAntiTwist =
        params.antiTwistConstraint ??
        params.antiTwist ??
        params.claim2Constraint ??
        params.torqueConstraint;
      if (
        rawAntiTwist !== undefined &&
        (!Number.isFinite(rawAntiTwist) || rawAntiTwist < 0 || rawAntiTwist > 1)
      ) {
        return null;
      }

      const probe = (key: "lateralContactFraction" | "axisMismatchFraction", value: number) =>
        stepWatsonRemoteCenterComplianceTopology({ ...params, [key]: value });
      const h = 0.001;

      if (
        controlKey === "lateralContactFraction" ||
        controlKey === "lateralContact" ||
        controlKey === "contactFraction" ||
        controlKey === "contact"
      ) {
        const contact = rawLateral ?? 0.62;
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

      if (
        controlKey === "axisMismatchFraction" ||
        controlKey === "axisMismatch" ||
        controlKey === "mismatchFraction" ||
        controlKey === "mismatch"
      ) {
        const mismatch = rawMismatch ?? 0.44;
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

      if (
        controlKey === "remoteCenterTopology" ||
        controlKey === "remoteCenter" ||
        controlKey === "claim1Topology" ||
        controlKey === "topology"
      ) {
        return {
          metricName: "Remote Center Projection",
          derivativeSymbol: "ΔP_remote / Δtopology",
          derivativeValue: 1.0,
          derivativeUnit: "projection / state",
          interpretation:
            "Claim 1 projects the elastic compliance center forward to tool tip 52 rather than keeping it at the wrist.",
        };
      }

      if (
        controlKey === "antiTwistConstraint" ||
        controlKey === "antiTwist" ||
        controlKey === "claim2Constraint" ||
        controlKey === "torqueConstraint"
      ) {
        const remoteEnabled = (rawRemote ?? 1) >= 0.5;
        return {
          metricName: "Claim 2 Anti-Twist Engagement",
          derivativeSymbol: "ΔC_twist / ΔantiTwist",
          derivativeValue: remoteEnabled ? 1.0 : 0.0,
          derivativeUnit: "engagement / state",
          interpretation:
            "Claim 2 provides a torque-resistant member preventing rotational deflection about the insertion axis.",
        };
      }

      break;
    }

    case "us-5701965-kamen-transporter": {
      const rawState = params.topologyState ?? params.state ?? params.topology ?? params.mode;
      const rawBalance =
        params.claim1BalanceEnabled ??
        params.balanceTopologyEnabled ??
        params.balanceEnabled ??
        params.balanceLoop;
      const rawCluster =
        params.claim16ClusterEnabled ??
        params.clusterTopologyEnabled ??
        params.clusterEnabled ??
        params.cluster;

      if (
        rawState !== undefined &&
        typeof rawState === "number" &&
        (!Number.isFinite(rawState) || rawState < 0 || rawState > 5)
      ) {
        return null;
      }
      if (
        rawBalance !== undefined &&
        typeof rawBalance === "number" &&
        (!Number.isFinite(rawBalance) || rawBalance < 0 || rawBalance > 1)
      ) {
        return null;
      }
      if (
        rawCluster !== undefined &&
        typeof rawCluster === "number" &&
        (!Number.isFinite(rawCluster) || rawCluster < 0 || rawCluster > 1)
      ) {
        return null;
      }

      if (
        controlKey === "topologyState" ||
        controlKey === "state" ||
        controlKey === "topology" ||
        controlKey === "mode" ||
        controlKey === "operatingMode"
      ) {
        return {
          metricName: "Claim Topology State Index",
          derivativeSymbol: "ΔState / Δtopology",
          derivativeValue: 1.0,
          derivativeUnit: "state / state",
          interpretation:
            "Discrete sensitivity of the source-ordered operational state machine across ground-support, balance, stair-start, weight-transfer, climb, and transition topologies.",
        };
      }

      if (
        controlKey === "claim1BalanceEnabled" ||
        controlKey === "balanceTopologyEnabled" ||
        controlKey === "balanceEnabled" ||
        controlKey === "balanceLoop"
      ) {
        return {
          metricName: "Claim 1 Balance Loop State",
          derivativeSymbol: "ΔBalance / Δloop",
          derivativeValue: 1.0,
          derivativeUnit: "state / state",
          interpretation:
            "Discrete sensitivity: Claim 1 motorized fore-aft dynamic balance control loop admission state.",
        };
      }

      if (
        controlKey === "claim16ClusterEnabled" ||
        controlKey === "clusterTopologyEnabled" ||
        controlKey === "clusterEnabled" ||
        controlKey === "cluster"
      ) {
        return {
          metricName: "Claim 16 Cluster Topology State",
          derivativeSymbol: "ΔCluster / Δcluster",
          derivativeValue: 1.0,
          derivativeUnit: "state / state",
          interpretation:
            "Discrete sensitivity: Claims 16–21 independently driven cluster-wheel pairing configuration state.",
        };
      }

      break;
    }

    case "us-4976582-clavel-delta-robot": {
      const rawArm1 = params.armOneInput ?? params.arm1 ?? params.arm1Input ?? params.input1;
      const rawArm2 = params.armTwoInput ?? params.arm2 ?? params.arm2Input ?? params.input2;
      const rawArm3 = params.armThreeInput ?? params.arm3 ?? params.arm3Input ?? params.input3;
      const rawTool = params.toolAxisInput ?? params.toolAxis ?? params.toolInput ?? params.axis10;
      const rawClaim1 = params.claim1TopologyEnabled ?? params.claim1 ?? params.topologyEnabled;
      const rawClaim2 = params.claim2PairedBarsEnabled ?? params.claim2 ?? params.pairedBarsEnabled;
      const rawClaim8 =
        params.claim8BaseMotorEnabled ??
        params.claim8 ??
        params.baseMotorEnabled ??
        params.toolMotorEnabled;

      if (
        (rawArm1 !== undefined && (!Number.isFinite(rawArm1) || rawArm1 < -1 || rawArm1 > 1)) ||
        (rawArm2 !== undefined && (!Number.isFinite(rawArm2) || rawArm2 < -1 || rawArm2 > 1)) ||
        (rawArm3 !== undefined && (!Number.isFinite(rawArm3) || rawArm3 < -1 || rawArm3 > 1)) ||
        (rawTool !== undefined && (!Number.isFinite(rawTool) || rawTool < -1 || rawTool > 1)) ||
        (rawClaim1 !== undefined &&
          (!Number.isFinite(rawClaim1) || rawClaim1 < 0 || rawClaim1 > 1)) ||
        (rawClaim2 !== undefined &&
          (!Number.isFinite(rawClaim2) || rawClaim2 < 0 || rawClaim2 > 1)) ||
        (rawClaim8 !== undefined && (!Number.isFinite(rawClaim8) || rawClaim8 < 0 || rawClaim8 > 1))
      ) {
        return null;
      }

      const key =
        controlKey === "arm1" || controlKey === "arm1Input" || controlKey === "input1"
          ? "armOneInput"
          : controlKey === "arm2" || controlKey === "arm2Input" || controlKey === "input2"
            ? "armTwoInput"
            : controlKey === "arm3" || controlKey === "arm3Input" || controlKey === "input3"
              ? "armThreeInput"
              : controlKey === "toolAxis" || controlKey === "toolInput" || controlKey === "axis10"
                ? "toolAxisInput"
                : controlKey === "claim1" || controlKey === "topologyEnabled"
                  ? "claim1TopologyEnabled"
                  : controlKey === "claim2" || controlKey === "pairedBarsEnabled"
                    ? "claim2PairedBarsEnabled"
                    : controlKey === "claim8" ||
                        controlKey === "baseMotorEnabled" ||
                        controlKey === "toolMotorEnabled"
                      ? "claim8BaseMotorEnabled"
                      : controlKey;

      if (key === "armOneInput" || key === "armTwoInput" || key === "armThreeInput") {
        const controls = readClavelDeltaRobotControls(params);
        const derivative = kernelDerivative(controls[key] as number, -1, 1, (value) => {
          const state = stepClavelDeltaRobotTopology({ ...params, [key]: value });
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

      if (key === "toolAxisInput") {
        return {
          metricName: "Working-Member Axis Rotation (Claim 8)",
          derivativeSymbol: "∂θ_tool / ∂u_tool",
          derivativeValue: Number(Math.PI.toFixed(6)),
          derivativeUnit: "rad / normalized input",
          interpretation:
            "Linear rate of rotation of working-member axis 10: each normalized unit of base-mounted actuator input drives the traveling-plate tool shaft through π radians via the telescopic cardan shaft transmission.",
        };
      }

      if (key === "claim1TopologyEnabled") {
        return {
          metricName: "Claim 1 Spatial Parallel Architecture State",
          derivativeSymbol: "ΔTopology / ΔClaim1",
          derivativeValue: 1.0,
          derivativeUnit: "state / state",
          interpretation:
            "Discrete finite sensitivity: Claim 1 spatial parallel architecture constraint state (arms three closed kinematic chains preserving traveling-plate attitude).",
        };
      }

      if (key === "claim2PairedBarsEnabled") {
        return {
          metricName: "Claim 2 Paired Parallel Bars Attitude State",
          derivativeSymbol: "ΔPairedBars / ΔClaim2",
          derivativeValue: 1.0,
          derivativeUnit: "state / state",
          interpretation:
            "Discrete finite sensitivity: Claim 2 paired parallel bars constraint state (constrains each forearm to two rigid parallel bars maintaining pure spatial translation without plate rotation).",
        };
      }

      if (key === "claim8BaseMotorEnabled") {
        return {
          metricName: "Claim 8 Base Motor Transmission State",
          derivativeSymbol: "ΔBaseMotor / ΔClaim8",
          derivativeValue: 1.0,
          derivativeUnit: "state / state",
          interpretation:
            "Discrete finite sensitivity: Claim 8 base-mounted tool axis motor state (transmits rotation to the traveling plate via a telescopic cardan shaft).",
        };
      }

      break;
    }

    case "us-6302230-kamen-segway": {
      const rawPitch = params.riderPitchDeg ?? params.pitch ?? params.lean;
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
      const rawMass = params.riderMassKg ?? params.mass ?? params.riderMass;
      if (rawMass !== undefined && (!Number.isFinite(rawMass) || rawMass < 40 || rawMass > 120)) {
        return null;
      }
      const rawSteer = params.steeringInput ?? params.steering ?? params.yaw;
      if (
        rawSteer !== undefined &&
        (!Number.isFinite(rawSteer) || rawSteer < -1.0 || rawSteer > 1.0)
      ) {
        return null;
      }

      const controls = readKamenSegwayControls({
        ...params,
        riderPitchDeg: params.riderPitchDeg ?? params.pitch ?? params.lean ?? 4.5,
        groundFrictionCoeff: params.groundFrictionCoeff ?? params.friction ?? 0.85,
        speedLimitMS: params.speedLimitMS ?? params.speedLimit ?? 5.5,
        steeringInput: params.steeringInput ?? params.steering ?? params.yaw ?? 0.0,
      });
      const probe = (
        key: "riderPitchDeg" | "groundFrictionCoeff" | "speedLimitMS",
        value: number,
      ) => stepKamenSegwaySi({ ...controls, [key]: value });
      if (controlKey === "riderPitchDeg" || controlKey === "pitch" || controlKey === "lean") {
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
      if (controlKey === "riderMassKg" || controlKey === "mass" || controlKey === "riderMass") {
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
      if (controlKey === "steeringInput" || controlKey === "steering" || controlKey === "yaw") {
        return {
          metricName: "Differential Steering Motor Torque",
          derivativeSymbol: "∂Δτ_steer / ∂u_steer",
          derivativeValue: controls.claim1BalanceEnabled ? 36.0 : 0.0,
          derivativeUnit: "N·m / yaw",
          interpretation:
            "Differential motor torque between right and left wheels driven by the modern illustrative handlebar yaw input (18 N·m bias per side when dynamic balance is active). Not a numerical grant value.",
        };
      }
      break;
    }

    case "us-4068536-stackhouse-manipulator": {
      const rawForearm =
        params.forearmRollDeg ?? params.forearmRoll ?? params.theta1 ?? params.roll1;
      if (
        rawForearm !== undefined &&
        (!Number.isFinite(rawForearm) || rawForearm < -180 || rawForearm > 180)
      ) {
        return null;
      }
      const rawIntermediate =
        params.intermediateRollDeg ?? params.intermediateRoll ?? params.theta2 ?? params.roll2;
      if (
        rawIntermediate !== undefined &&
        (!Number.isFinite(rawIntermediate) || rawIntermediate < -180 || rawIntermediate > 180)
      ) {
        return null;
      }
      const rawTool = params.toolRollDeg ?? params.toolRoll ?? params.theta3 ?? params.roll3;
      if (rawTool !== undefined && (!Number.isFinite(rawTool) || rawTool < -180 || rawTool > 180)) {
        return null;
      }
      const rawOblique1 =
        params.firstObliqueAngleDeg ?? params.firstOblique ?? params.alphaAB ?? params.alpha1;
      if (
        rawOblique1 !== undefined &&
        (!Number.isFinite(rawOblique1) || rawOblique1 < 46 || rawOblique1 > 80)
      ) {
        return null;
      }
      const rawOblique2 =
        params.secondObliqueAngleDeg ?? params.secondOblique ?? params.alphaBC ?? params.alpha2;
      if (
        rawOblique2 !== undefined &&
        (!Number.isFinite(rawOblique2) || rawOblique2 < 46 || rawOblique2 > 80)
      ) {
        return null;
      }
      const rawIntersection =
        params.singleIntersection ??
        params.pointP ??
        params.exactIntersection ??
        params.preferredPointP;
      if (
        rawIntersection !== undefined &&
        (!Number.isFinite(rawIntersection) || rawIntersection < 0 || rawIntersection > 1)
      ) {
        return null;
      }

      if (
        controlKey === "forearmRollDeg" ||
        controlKey === "forearmRoll" ||
        controlKey === "theta1" ||
        controlKey === "roll1"
      ) {
        return {
          metricName: "Selected Display-Azimuth Sensitivity",
          derivativeSymbol: "∂ψ_display / ∂θ_1",
          derivativeValue: 1.0,
          derivativeUnit: "display deg / deg",
          interpretation:
            "Forearm roll rotates the entire wrist assembly azimuthally about base axis A-A' by exactly 1° per 1°.",
        };
      }

      if (
        controlKey === "toolRollDeg" ||
        controlKey === "toolRoll" ||
        controlKey === "theta3" ||
        controlKey === "roll3"
      ) {
        return {
          metricName: "Selected Display-Bend Sensitivity",
          derivativeSymbol: "∂β_display / ∂θ_3",
          derivativeValue: 0.0,
          derivativeUnit: "display deg / deg",
          interpretation:
            "Tool spin roll rotates the end-effector about its terminal axis without altering the overall display bend angle.",
        };
      }

      if (
        controlKey === "singleIntersection" ||
        controlKey === "pointP" ||
        controlKey === "exactIntersection" ||
        controlKey === "preferredPointP"
      ) {
        return {
          metricName: "Axis Coincidence at Point P",
          derivativeSymbol: "Δcoincidence / ΔP",
          derivativeValue: 1.0,
          derivativeUnit: "coincidence / state",
          interpretation:
            "Preferred Stackhouse topology aligns all three axes to intersect at common point P, eliminating the 0.12 offset contrast seen in non-intersecting wrist designs.",
        };
      }

      if (
        controlKey === "intermediateRollDeg" ||
        controlKey === "intermediateRoll" ||
        controlKey === "theta2" ||
        controlKey === "roll2" ||
        controlKey === "firstObliqueAngleDeg" ||
        controlKey === "firstOblique" ||
        controlKey === "alphaAB" ||
        controlKey === "alpha1" ||
        controlKey === "secondObliqueAngleDeg" ||
        controlKey === "secondOblique" ||
        controlKey === "alphaBC" ||
        controlKey === "alpha2"
      ) {
        const canonicalKey =
          controlKey === "intermediateRollDeg" ||
          controlKey === "intermediateRoll" ||
          controlKey === "theta2" ||
          controlKey === "roll2"
            ? "intermediateRollDeg"
            : controlKey === "firstObliqueAngleDeg" ||
                controlKey === "firstOblique" ||
                controlKey === "alphaAB" ||
                controlKey === "alpha1"
              ? "firstObliqueAngleDeg"
              : "secondObliqueAngleDeg";
        const baseline =
          params[canonicalKey] ??
          params[controlKey] ??
          (canonicalKey === "intermediateRollDeg" ? 72 : 55);
        const probe = (value: number) =>
          stepStackhouseSourceTopology({ ...params, [canonicalKey]: value }).bendAngleDeg;
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
      const rawAddress =
        params.carrierAddressFraction ??
        params.carrierAddress ??
        params.carrierX ??
        params.addressFraction ??
        params.address;
      if (
        rawAddress !== undefined &&
        (!Number.isFinite(rawAddress) || rawAddress < 0 || rawAddress > 1)
      ) {
        return null;
      }
      const rawLift =
        params.liftFraction ??
        params.lift ??
        params.verticalLift ??
        params.liftPose ??
        params.mzLift;
      if (rawLift !== undefined && (!Number.isFinite(rawLift) || rawLift < 0 || rawLift > 1)) {
        return null;
      }
      const rawReach =
        params.reachFraction ??
        params.reach ??
        params.platformReach ??
        params.myReach ??
        params.extension;
      if (rawReach !== undefined && (!Number.isFinite(rawReach) || rawReach < 0 || rawReach > 1)) {
        return null;
      }
      const rawDetected =
        params.stationDetected ??
        params.marker ??
        params.markerDetected ??
        params.markerSensed ??
        params.stationSensed;
      if (
        rawDetected !== undefined &&
        (!Number.isFinite(Number(rawDetected)) ||
          Number(rawDetected) < 0 ||
          Number(rawDetected) > 1)
      ) {
        return null;
      }
      const rawCoupled =
        params.stationCoupled ??
        params.coupled ??
        params.contactsCoupled ??
        params.stationContact ??
        params.claim7;
      if (
        rawCoupled !== undefined &&
        (!Number.isFinite(Number(rawCoupled)) || Number(rawCoupled) < 0 || Number(rawCoupled) > 1)
      ) {
        return null;
      }
      const rawProgress =
        params.cycleProgress ??
        params.progress ??
        params.cycle ??
        params.sequenceProgress ??
        params.cycleFraction;
      if (
        rawProgress !== undefined &&
        (!Number.isFinite(rawProgress) || rawProgress < 0 || rawProgress > 1)
      ) {
        return null;
      }

      if (
        controlKey === "carrierAddressFraction" ||
        controlKey === "carrierAddress" ||
        controlKey === "carrierX" ||
        controlKey === "addressFraction" ||
        controlKey === "address"
      ) {
        return {
          metricName: "Normalized Carrier Address Position",
          derivativeSymbol: "∂x_{carrier} / ∂a_{carrier}",
          derivativeValue: 1.0,
          derivativeUnit: "normalized position / address increment",
          interpretation:
            "Linear kinematic positioning of carrier along the guide rail in automatic production sequence.",
        };
      }
      if (
        controlKey === "liftFraction" ||
        controlKey === "lift" ||
        controlKey === "verticalLift" ||
        controlKey === "liftPose" ||
        controlKey === "mzLift"
      ) {
        return {
          metricName: "Normalized Mz Lift Pose",
          derivativeSymbol: "∂z_{lift} / ∂q_{lift}",
          derivativeValue: 1.0,
          derivativeUnit: "normalized position / lift increment",
          interpretation: "Vertical lift displacement of the production manipulator carrier.",
        };
      }
      if (
        controlKey === "reachFraction" ||
        controlKey === "reach" ||
        controlKey === "platformReach" ||
        controlKey === "myReach" ||
        controlKey === "extension"
      ) {
        return {
          metricName: "Normalized My Platform Reach",
          derivativeSymbol: "∂y_{reach} / ∂q_{reach}",
          derivativeValue: 1.0,
          derivativeUnit: "normalized position / reach increment",
          interpretation:
            "Horizontal reach displacement of the transfer platform into the machine work zone.",
        };
      }
      if (
        controlKey === "stationDetected" ||
        controlKey === "marker" ||
        controlKey === "markerDetected" ||
        controlKey === "markerSensed" ||
        controlKey === "stationSensed"
      ) {
        return {
          metricName: "Marker Recognition Interlock",
          derivativeSymbol: "∂(marker) / ∂(sensor)",
          derivativeValue: 1.0,
          derivativeUnit: "matched state / sensor toggle",
          interpretation:
            "Binary state transition for photoelectric or marker sensing at work station.",
        };
      }
      if (
        controlKey === "stationCoupled" ||
        controlKey === "coupled" ||
        controlKey === "contactsCoupled" ||
        controlKey === "stationContact" ||
        controlKey === "claim7"
      ) {
        return {
          metricName: "Station Contacts Coupling Interlock",
          derivativeSymbol: "∂(coupling) / ∂(contacts)",
          derivativeValue: 1.0,
          derivativeUnit: "coupled state / contact toggle",
          interpretation:
            "Binary state transition for carrier-to-station control circuit coupling (Claim 7).",
        };
      }
      if (
        controlKey === "cycleProgress" ||
        controlKey === "progress" ||
        controlKey === "cycle" ||
        controlKey === "sequenceProgress" ||
        controlKey === "cycleFraction"
      ) {
        return {
          metricName: "Production Sequence Cycle Progress",
          derivativeSymbol: "∂(phase) / ∂(cycleProgress)",
          derivativeValue: 1.0,
          derivativeUnit: "progress increment / input increment",
          interpretation:
            "Ordered progression through the automated production cycle (locate, retain, position, couple, operate, release).",
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
      const rawTemp = params.nozzleTempC ?? params.nozzleTemp ?? params.tempC ?? params.temperature;
      if (rawTemp !== undefined && (!Number.isFinite(rawTemp) || rawTemp < 100 || rawTemp > 300)) {
        return null;
      }
      const rawSpeed =
        params.printSpeedMmS ?? params.printSpeed ?? params.speedMmS ?? params.feedSpeed;
      if (
        rawSpeed !== undefined &&
        (!Number.isFinite(rawSpeed) || rawSpeed < 5 || rawSpeed > 250)
      ) {
        return null;
      }
      const rawHeight =
        params.layerHeightMm ?? params.layerHeight ?? params.sliceHeight ?? params.heightMm;
      if (
        rawHeight !== undefined &&
        (!Number.isFinite(rawHeight) || rawHeight < 0.05 || rawHeight > 0.8)
      ) {
        return null;
      }
      const rawWidth =
        params.roadWidthMm ??
        params.roadWidth ??
        params.beadWidth ??
        params.extrusionWidth ??
        params.widthMm;
      if (
        rawWidth !== undefined &&
        (!Number.isFinite(rawWidth) || rawWidth < 0.15 || rawWidth > 1.8)
      ) {
        return null;
      }

      const controls = readCrumpFdmControls(params);
      const probe = (
        key: "printSpeedMmS" | "nozzleTempC" | "layerHeightMm" | "roadWidthMm",
        value: number,
      ) => stepCrumpFdmSi({ ...controls, [key]: value });

      if (
        controlKey === "printSpeedMmS" ||
        controlKey === "printSpeed" ||
        controlKey === "speedMmS" ||
        controlKey === "feedSpeed"
      ) {
        const derivative = kernelDerivative(rawSpeed ?? controls.printSpeedMmS, 5, 250, (value) => {
          const state = probe("printSpeedMmS", value);
          return state.refusalReason ? null : state.volumetricFlowRateMm3S;
        });
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
      if (
        controlKey === "nozzleTempC" ||
        controlKey === "nozzleTemp" ||
        controlKey === "tempC" ||
        controlKey === "temperature"
      ) {
        const derivative = kernelDerivative(rawTemp ?? controls.nozzleTempC, 100, 300, (value) => {
          const state = probe("nozzleTempC", value);
          return state.refusalReason ? null : state.apparentViscosityPaS;
        });
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
      if (
        controlKey === "layerHeightMm" ||
        controlKey === "layerHeight" ||
        controlKey === "sliceHeight" ||
        controlKey === "heightMm"
      ) {
        const derivative = kernelDerivative(
          rawHeight ?? controls.layerHeightMm,
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
      if (
        controlKey === "roadWidthMm" ||
        controlKey === "roadWidth" ||
        controlKey === "beadWidth" ||
        controlKey === "extrusionWidth" ||
        controlKey === "widthMm"
      ) {
        const derivative = kernelDerivative(
          rawWidth ?? controls.roadWidthMm,
          0.15,
          1.8,
          (value) => {
            const state = probe("roadWidthMm", value);
            return state.refusalReason ? null : state.volumetricFlowRateMm3S;
          },
        );
        if (derivative === null) return null;
        return {
          metricName: "Volumetric Extrusion Flow Rate",
          derivativeSymbol: "∂Q / ∂w",
          derivativeValue: derivative,
          derivativeUnit: "mm³/s / mm",
          interpretation:
            "Volumetric extrusion demand scales linearly with extruded road width for a given layer slice height and toolhead velocity.",
        };
      }
      break;
    }

    case "us-4921293-salisbury-robot-hand": {
      const rawT1 = params.tensionT1N ?? params.t1 ?? params.tension1 ?? params.T1;
      const rawT2 = params.tensionT2N ?? params.t2 ?? params.tension2 ?? params.T2;
      const rawT3 = params.tensionT3N ?? params.t3 ?? params.tension3 ?? params.T3;
      const rawT4 = params.tensionT4N ?? params.t4 ?? params.tension4 ?? params.T4;
      const rawR = params.radiusScaleMm ?? params.radiusScale ?? params.rScale ?? params.r2Scale;
      const rawIdler = params.firstIdlerFixed ?? params.idlerFixed ?? params.claim2Idler;

      if (
        (rawT1 !== undefined && (!Number.isFinite(rawT1) || rawT1 < 0 || rawT1 > 40)) ||
        (rawT2 !== undefined && (!Number.isFinite(rawT2) || rawT2 < 0 || rawT2 > 40)) ||
        (rawT3 !== undefined && (!Number.isFinite(rawT3) || rawT3 < 0 || rawT3 > 40)) ||
        (rawT4 !== undefined && (!Number.isFinite(rawT4) || rawT4 < 0 || rawT4 > 40)) ||
        (rawR !== undefined && (!Number.isFinite(rawR) || rawR < 4 || rawR > 20)) ||
        (rawIdler !== undefined &&
          typeof rawIdler === "number" &&
          (!Number.isFinite(rawIdler) || rawIdler < 0 || rawIdler > 1))
      ) {
        return null;
      }

      const key =
        controlKey === "t1" || controlKey === "tension1" || controlKey === "T1"
          ? "tensionT1N"
          : controlKey === "t2" || controlKey === "tension2" || controlKey === "T2"
            ? "tensionT2N"
            : controlKey === "t3" || controlKey === "tension3" || controlKey === "T3"
              ? "tensionT3N"
              : controlKey === "t4" || controlKey === "tension4" || controlKey === "T4"
                ? "tensionT4N"
                : controlKey === "radiusScale" ||
                    controlKey === "rScale" ||
                    controlKey === "r2Scale"
                  ? "radiusScaleMm"
                  : controlKey === "idlerFixed" || controlKey === "claim2Idler"
                    ? "firstIdlerFixed"
                    : controlKey;

      const controls = readSalisburyRobotHandControls(params);
      const r2M = controls.radiusScaleMm / 1000;
      const r1M = r2M * 1.2;

      if (key === "tensionT1N") {
        return {
          metricName: "Figure 3 First-Joint Torque",
          derivativeSymbol: "∂τ₁ / ∂T₁",
          derivativeValue: Number((-r1M).toFixed(6)),
          derivativeUnit: "N·m / N",
          interpretation:
            "Exact static derivative of Figure 3’s printed first-joint equation, τ₁ = −T₁R₁ + T₂R₂ + T₃R₂ − T₄R₁, evaluated at the visitor-declared R₁ study scale. It is a tendon-to-torque relation only; the grant does not disclose dynamic finger motion, contact force, or grasp stability.",
        };
      }

      if (key === "tensionT2N") {
        return {
          metricName: "Figure 3 Third-Joint Torque",
          derivativeSymbol: "∂τ₃ / ∂T₂",
          derivativeValue: Number(r2M.toFixed(6)),
          derivativeUnit: "N·m / N",
          interpretation:
            "Exact static derivative of Figure 3’s printed third-joint equation, τ₃ = T₂R₂ − T₃R₂, evaluated at the visitor-declared R₂ study scale. Tendon-to-torque static relation only; the grant does not disclose dynamic finger motion.",
        };
      }

      if (key === "tensionT3N") {
        return {
          metricName: "Figure 3 Third-Joint Torque",
          derivativeSymbol: "∂τ₃ / ∂T₃",
          derivativeValue: Number((-r2M).toFixed(6)),
          derivativeUnit: "N·m / N",
          interpretation:
            "Exact static derivative of Figure 3’s printed third-joint equation, τ₃ = T₂R₂ − T₃R₂, evaluated at the visitor-declared R₂ study scale. Tendon-to-torque static relation only.",
        };
      }

      if (key === "tensionT4N") {
        return {
          metricName: "Figure 3 First-Joint Torque",
          derivativeSymbol: "∂τ₁ / ∂T₄",
          derivativeValue: Number((-r1M).toFixed(6)),
          derivativeUnit: "N·m / N",
          interpretation:
            "Exact static derivative of Figure 3’s printed first-joint equation, τ₁ = −T₁R₁ + T₂R₂ + T₃R₂ − T₄R₁, evaluated at the visitor-declared R₁ study scale.",
        };
      }

      if (key === "radiusScaleMm") {
        const dTau1_dR =
          (-1.2 * controls.tensionT1N +
            controls.tensionT2N +
            controls.tensionT3N -
            1.2 * controls.tensionT4N) /
          1000;
        return {
          metricName: "Figure 3 First-Joint Torque Scale",
          derivativeSymbol: "∂τ₁ / ∂R_scale",
          derivativeValue: Number(dTau1_dR.toFixed(6)),
          derivativeUnit: "N·m / mm",
          interpretation:
            "Rate of change of first-joint torque τ₁ with respect to the visitor-declared pulley radius scale R₂ under the current tendon tensions.",
        };
      }

      if (key === "firstIdlerFixed") {
        return {
          metricName: "Claim 2 Idler Probe State",
          derivativeSymbol: "ΔProbe / ΔIdler",
          derivativeValue: 1.0,
          derivativeUnit: "state / state",
          interpretation:
            "Discrete sensitivity: Claim 2 first-idler position constraint state (probe is active when first idler is fixed).",
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

    case "us-6331181-davinci": {
      const rawCompat =
        params.compatibilitySignalPresent ??
        params.compatibility ??
        params.compatible ??
        params.compatibilitySignal ??
        params.tremorFilterEnabled;
      const rawCalib =
        params.calibrationRecordAvailable ??
        params.calibration ??
        params.calibrationRecord ??
        params.calRecord ??
        params.calibrationAvailable;
      const rawEngage =
        params.engagementSignalPresent ??
        params.engagement ??
        params.engagementSignal ??
        params.engaged ??
        params.engagementPresent;

      if (
        (rawCompat !== undefined &&
          typeof rawCompat === "number" &&
          (!Number.isFinite(rawCompat) || rawCompat < 0 || rawCompat > 1)) ||
        (rawCalib !== undefined &&
          typeof rawCalib === "number" &&
          (!Number.isFinite(rawCalib) || rawCalib < 0 || rawCalib > 1)) ||
        (rawEngage !== undefined &&
          typeof rawEngage === "number" &&
          (!Number.isFinite(rawEngage) || rawEngage < 0 || rawEngage > 1))
      ) {
        return null;
      }

      if (
        controlKey === "compatibilitySignalPresent" ||
        controlKey === "compatibility" ||
        controlKey === "compatible" ||
        controlKey === "compatibilitySignal" ||
        controlKey === "tremorFilterEnabled"
      ) {
        return {
          metricName: "Tool Interface Compatibility",
          derivativeSymbol: "ΔReady / Δcompat",
          derivativeValue: 1.0,
          derivativeUnit: "state / state",
          interpretation:
            "Discrete sensitivity: tool memory compatibility token presence required for processor configuration admission.",
        };
      }

      if (
        controlKey === "calibrationRecordAvailable" ||
        controlKey === "calibration" ||
        controlKey === "calibrationRecord" ||
        controlKey === "calRecord" ||
        controlKey === "calibrationAvailable"
      ) {
        return {
          metricName: "Calibration Record Availability",
          derivativeSymbol: "ΔReady / Δcalib",
          derivativeValue: 1.0,
          derivativeUnit: "state / state",
          interpretation:
            "Discrete sensitivity: measured offset calibration record availability for robotic manipulator kinematic alignment.",
        };
      }

      if (
        controlKey === "engagementSignalPresent" ||
        controlKey === "engagement" ||
        controlKey === "engagementSignal" ||
        controlKey === "engaged" ||
        controlKey === "engagementPresent"
      ) {
        return {
          metricName: "Physical Engagement Confirmation",
          derivativeSymbol: "ΔReady / Δengage",
          derivativeValue: 1.0,
          derivativeUnit: "state / state",
          interpretation:
            "Discrete sensitivity: electrical/mechanical engagement latch signal confirming tool sterile mount lock.",
        };
      }

      break;
    }

    default:
      break;
  }

  return null;
}
