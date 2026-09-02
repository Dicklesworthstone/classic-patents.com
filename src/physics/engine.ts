/**
 * FrankenSim Multi-Domain Computational Physics Engine
 *
 * Implements Lie-group time integration, discrete electromagnetics,
 * semiconductor carrier transport, thermal absorption cycles, and point kinetics.
 */

import {
  stepBardeenTransistor as catalogStepBardeen,
  stepColtRevolver as catalogStepColt,
  stepHollerithTabulating as catalogStepHollerith,
  stepKevlarContinuum as catalogStepKevlar,
  stepLegacyDaimlerEngineUS349983 as catalogStepLegacyDaimlerEngineUS349983,
  stepLincolnBuoy as catalogStepLincolnBuoy,
  goddardSchematicStack,
  stepBellTelephone,
  stepCorlissEngine,
  stepDavenportMotor,
  stepDeLavalSeparator,
  stepEdisonBulb,
  stepEdisonPhonograph,
  stepEinsteinRefrigerator as stepEinsteinRefrigeratorCatalog,
  stepEngelbartMouse,
  stepEricssonPropeller,
  stepGatlingGun,
  stepGliddenBarbedWire,
  stepGoodyearRubber as stepGoodyearRubberCatalog,
  stepGrammeDynamo,
  stepHyattCelluloid,
  stepMarconiRadio as stepMarconiRadioCatalog,
  stepMaximMachineGun,
  stepMcCormickReaper,
  stepMorseTelegraph,
  stepNobelDynamite,
  stepNoyceIC,
  stepOttoEngine,
  stepParsonsTurbine,
  stepPasteurFermentation,
  stepPeltonWheel,
  stepSpencerMicrowave as stepSpencerMicrowaveCatalog,
  stepTeslaTeleautomaton,
  stepThomsonWelding,
  stepWhitneyCottonGin,
  stepWozniakApple,
  stepZeppelinAirship,
} from "./catalogKernels";
import { stepCrumpFdmSi } from "./crumpFdmKernel";
import { tryDaimlerMarineWasmStep } from "./daimlerWasm";
import {
  type DaVinciControls,
  type DaVinciState,
  stepDaVinci as stepDaVinciKernel,
} from "./daVinciKernel";
import { stepDieselEngine as kernelStepDieselEngine } from "./dieselEngineKernel";
import { stepFermiKinetics } from "./fermiKinetics";
import { tryGoddardApparatusWasmStep, tryGoddardWasmStep } from "./goddardWasm";
import { stepHullStereolithographySi } from "./hullStereolithographyKernel";
import {
  type KamenTransporterControls,
  type KamenTransporterTelemetry,
  stepKamenTransporterSi,
} from "./kamenTransporterKernel";
import {
  type LemelsonWarehouseControls,
  type LemelsonWarehousePose,
  stepLemelsonWarehouseTopology,
} from "./lemelsonWarehouseKernel";
import {
  stepCcdWells,
  stepEngelbartResolver,
  stepHoweLockstitch,
  stepHoweSewingMachine as stepHoweSewingMachineKernel,
  stepMergenthalerLinotype,
  stepOtisElevator,
  stepRenoEscalator,
  stepSholesTypewriter,
} from "./machineKernels";
import {
  type MestralVelcroControls,
  type MestralVelcroTelemetry,
  stepMestralVelcroSi,
} from "./mestralVelcroKernel";
import { stepMilacronRobotToolchangerSi } from "./milacronRobotToolchangerKernel";
import { stepRobotEndEffectorSi } from "./robotEndEffectorKernel";
import type { SalisburyRobotHandControls } from "./salisburyRobotHandKernel";
import { type SalisburyMechanismState, stepSalisburyTopology } from "./salisburyWasm";
import {
  type StackhouseSourceControls,
  type StackhouseSourcePose,
  stepStackhouseSourceTopology,
} from "./stackhouseSourceKernel";
import {
  type SundbackZipperControls,
  type SundbackZipperTelemetry,
  stepSundbackZipperSi,
} from "./sundbackZipperKernel";
import { stepTeslaMotorFig9, teslaBAt, teslaFig4Strobe } from "./teslaKernel";
import { goddardThermo } from "./thermochem";
import type {
  AerodynamicsState,
  NuclearKineticsState,
  SemiconductorState,
  ThermodynamicsState,
  UniversalPatentPhysicsTelemetry,
} from "./types";
import {
  stepWatsonRemoteCenterComplianceTopology,
  type WatsonRemoteCenterComplianceControls,
  type WatsonRemoteCenterCompliancePose,
} from "./watsonRemoteCenterComplianceKernel";
import { stepWrightFlyerSi } from "./wrightKernel";

/** US 2,292,387 illustrated record rows. Shared by the source diagrams. */
export const LAMARR_BAND_MIN_MHZ = 0;
export const LAMARR_BAND_MAX_MHZ = 0;
export const LAMARR_PIANO_KEYS = 7;
export const LAMARR_PIANO_ROLL_STEP = 1;
export const LAMARR_JAM_CHANNEL_FRACTION = 0;
export const LAMARR_SCHEMATIC_STAFF_COUNT = 11;
export const LAMARR_SCHEMATIC_STAFF_ORIGIN_Y = 75;

function canonicalAxisQuaternion(
  axis: "x" | "y",
  angleRadians: number,
): [number, number, number, number] {
  const halfAngle = angleRadians / 2;
  const sine = Math.sin(halfAngle);
  const quaternion: [number, number, number, number] = [
    Math.cos(halfAngle),
    axis === "x" ? sine : 0,
    axis === "y" ? sine : 0,
    0,
  ];
  const firstNonZero = quaternion.find((component) => component !== 0) ?? 1;
  return firstNonZero < 0
    ? (quaternion.map((component) => -component) as [number, number, number, number])
    : quaternion;
}
export const LAMARR_SCHEMATIC_STAFF_PITCH_Y = 13;
export const LAMARR_SCHEMATIC_HOP_ORIGIN_X = 80;
export const LAMARR_SCHEMATIC_HOP_PITCH_X = 30;
export const LAMARR_SCHEMATIC_HOP_SEQUENCE = [0, 3, 1, 7, 4, 9, 2, 6] as const;
export const LAMARR_SCHEMATIC_STAFF_X1 = 70;
export const LAMARR_SCHEMATIC_STAFF_X2 = 330;
export const LAMARR_SCHEMATIC_BOX_X = 50;
export const LAMARR_SCHEMATIC_BOX_Y = 60;
export const LAMARR_SCHEMATIC_BOX_W = 300;
export const LAMARR_SCHEMATIC_BOX_H = 160;
export const LAMARR_SCHEMATIC_HOP_W = 22;
export const LAMARR_SCHEMATIC_HOP_H = 11;

export function lamarrPianoRollChannel(
  step: number,
  keys = LAMARR_PIANO_KEYS,
  rollStep = LAMARR_PIANO_ROLL_STEP,
) {
  return ((Math.max(0, Math.floor(step)) * rollStep) % keys) + 1;
}

export function lamarrChannelFrequencyMhz(
  channel: number,
  channelCount = LAMARR_PIANO_KEYS,
  minMhz = LAMARR_BAND_MIN_MHZ,
  maxMhz = LAMARR_BAND_MAX_MHZ,
) {
  // The grant specifies selectable tuning positions, not RF frequencies.
  void channelCount;
  void minMhz;
  void maxMhz;
  return Math.max(1, Math.round(channel));
}

export function lamarrDefaultJamChannel(
  channelCount: number,
  fraction = LAMARR_JAM_CHANNEL_FRACTION,
) {
  const n = Math.max(1, Math.round(channelCount));
  return Math.min(n, Math.max(1, Math.floor(n * fraction)));
}

export function lamarrRadioChannel(
  pianoKey: number,
  liveChannels: number,
  pianoKeys = LAMARR_PIANO_KEYS,
) {
  return Math.floor(((Math.max(1, pianoKey) - 1) / pianoKeys) * Math.max(1, liveChannels)) + 1;
}

export function lamarrPianoKeyHz(pianoKey: number, pianoKeys = LAMARR_PIANO_KEYS) {
  void pianoKey;
  void pianoKeys;
  return 0;
}

/** Piano-roll staff Y on the schematic. Shared by the schematic. */
export function lamarrSchematicStaffY(
  index: number,
  originY = LAMARR_SCHEMATIC_STAFF_ORIGIN_Y,
  pitchY = LAMARR_SCHEMATIC_STAFF_PITCH_Y,
) {
  return originY + index * pitchY;
}

/** Hop-slot seat on the schematic piano roll. Shared by the schematic. */
export function lamarrSchematicHop(
  index: number,
  row: number,
  originX = LAMARR_SCHEMATIC_HOP_ORIGIN_X,
  originY = LAMARR_SCHEMATIC_STAFF_ORIGIN_Y,
  pitchX = LAMARR_SCHEMATIC_HOP_PITCH_X,
  pitchY = LAMARR_SCHEMATIC_STAFF_PITCH_Y,
) {
  return {
    x: originX + index * pitchX,
    y: originY + row * pitchY,
  };
}

export const FrankenSimEngine = {
  /**
   * Wright Flyer (US 821,393) - 6-DoF Aerodynamics & Coupled Yaw/Roll
   */
  stepWrightFlyer(
    current: AerodynamicsState,
    params: {
      wingWarpDeg: number;
      rudderDeg: number;
      elevatorDeg: number;
      dt: number;
    },
  ): AerodynamicsState {
    const { wingWarpDeg, rudderDeg, elevatorDeg, dt } = params;
    const si = stepWrightFlyerSi({
      airspeedMph: current.airspeedMps / 0.44704,
      wingWarpDeg,
      rudderDeg,
      elevatorDeg,
      coupled: false,
    });

    return {
      ...current,
      wingWarpDeflectionDeg: wingWarpDeg,
      rudderDeflectionDeg: rudderDeg,
      elevatorDeflectionDeg: elevatorDeg,
      liftNewtons: si.liftNewtons,
      inducedDragNewtons: si.inducedDragNewtons,
      parasiticDragNewtons: si.parasiticDragNewtons,
      yawRateRps: current.yawRateRps + si.yawAlphaRadPerS2 * dt,
      pitchRateRps: current.pitchRateRps + si.pitchAlphaRadPerS2 * dt,
      altitudeMeters: Math.max(0, current.altitudeMeters + si.altitudeRateMps * dt),
    };
  },

  /** Tesla's source-specific Fig. 9 motor-generator apparatus (US 381,968). */
  teslaBAt,
  teslaFig4Strobe,
  stepCcdWells,
  stepHoweLockstitch,
  stepEngelbartResolver,
  stepSholesTypewriter,
  stepPeltonWheel,
  stepGrammeDynamo,
  stepOttoEngine,
  stepParsonsTurbine,
  stepEricssonPropeller,
  stepDeLavalSeparator,
  stepNobelDynamite,
  stepWhitneyCottonGin,
  stepMcCormickReaper,
  stepDavenportMotor,
  stepCorlissEngine,
  stepGatlingGun,
  stepHyattCelluloid,
  stepPasteurFermentation,
  stepGliddenBarbedWire,
  stepEdisonPhonograph,
  stepThomsonWelding,
  stepNoyceIC,
  stepEdisonBulb,
  stepBellTelephone,
  stepMorseTelegraph,
  stepEngelbartMouse,
  stepWozniakApple,
  stepMilacronRobotToolchanger: stepMilacronRobotToolchangerSi,
  stepRobotEndEffector: stepRobotEndEffectorSi,
  stepHullStereolithography: stepHullStereolithographySi,
  stepCrumpFdm: stepCrumpFdmSi,

  stepTeslaMotorFig9,

  /** US 6,331,181 illustrative tool-interface and contact model. */
  stepDaVinci(
    controls: DaVinciControls,
    timeSec: number,
    previousState?: DaVinciState,
    dtSec = 1 / 60,
  ): DaVinciState {
    return stepDaVinciKernel(controls, timeSec, previousState, dtSec);
  },

  /**
   * Enrico Fermi Chicago Pile-1 (US 2,708,656).
   * Delegates to fermiKinetics — same k_eff as the badge, schematic, and 3D HUD.
   */
  stepFermiReactor(
    controlRodWithdrawalPct: number,
    moderatorPurityPct: number,
    fuelEnrichmentPct: number = 0.72,
  ): NuclearKineticsState {
    return stepFermiKinetics(controlRodWithdrawalPct, moderatorPurityPct, fuelEnrichmentPct);
  },

  /**
   * Einstein-Szilard Absorption Refrigerator (US 1,781,541)
   */
  stepEinsteinRefrigerator(
    heatInputWatts: number,
    systemPressureAtm: number,
    ammoniaRatio: number = 0.65,
  ): ThermodynamicsState {
    const cat = stepEinsteinRefrigeratorCatalog({
      heatInput: heatInputWatts,
      totalPressure: systemPressureAtm,
      ammoniaRatio,
    });
    return {
      ...cat,
      temperatureCelsius: cat.evapTempC,
      temperatureKelvin: cat.evapTempC + 273.15,
      pressureAtm: systemPressureAtm,
      partialPressureButaneAtm: cat.partialPressureButaneAtm,
      heatInputWatts,
      coolingPowerWatts: cat.coolingWatts,
      coefficientOfPerformance: cat.cop,
      blackbodyRadiantPowerWatts: 0,
      fluidFlowVelocityMps: Number(((heatInputWatts / 220) * 0.15).toFixed(3)),
    };
  },

  /**
   * Stephanie Kwolek Kevlar Aramid Polymers (US 3,671,542)
   */
  stepKevlarContinuum(drawRatio: number, impactVelocityMps: number, appliedTension?: number) {
    const cat = catalogStepKevlar(drawRatio, impactVelocityMps, appliedTension);
    return {
      ...cat,
      crossLinkDensityMolesPerCm3: 0.085,
      stitchFrequencyHz: 0,
      feedVelocityMmPs: 0,
      buoyancyLiftForceKiloNewtons: 0,
    };
  },

  /**
   * Source-bounded US 1,102,653 apparatus state.
   *
   * Primary and gyroscope speeds are declared visitor inputs because the
   * facsimile prints no numerical rates. The owner returns torque-free
   * rigid-body poses and exact claim predicates, never fabricated thrust,
   * Mach, liquid-propellant, or trajectory telemetry.
   */
  stepGoddardApparatus(
    elapsedSeconds: number,
    primarySpinRpm: number,
    gyroSpinRpm: number,
    tubeLengthRatio: number,
    auxiliaryReleaseFraction: number,
    primaryChargeSubstantiallyConsumed: boolean,
    gyroEnabled: boolean,
  ) {
    const wasmResult = tryGoddardApparatusWasmStep(
      elapsedSeconds,
      primarySpinRpm,
      gyroSpinRpm,
      tubeLengthRatio,
      auxiliaryReleaseFraction,
      primaryChargeSubstantiallyConsumed,
      gyroEnabled,
    );
    if (wasmResult) {
      return {
        runtimeSource: "wasm" as const,
        primaryQuaternion: wasmResult.primary_quaternion,
        gyroQuaternion: wasmResult.gyro_quaternion,
        primaryAngularVelocityRadPerSec: wasmResult.primary_angular_velocity_rad_per_sec,
        gyroAngularVelocityRadPerSec: wasmResult.gyro_angular_velocity_rad_per_sec,
        cameraSupportAngularVelocityRadPerSec:
          wasmResult.camera_support_angular_velocity_rad_per_sec,
        primaryRimSpeedPerRadiusMpsPerM: wasmResult.primary_rim_speed_per_radius_mps_per_m,
        tubeLengthRatio: wasmResult.tube_length_ratio,
        claim2RatioMargin: wasmResult.claim_2_ratio_margin,
        claim2Satisfied: wasmResult.claim_2_satisfied,
        claim1SequenceSatisfied: wasmResult.claim_1_sequence_satisfied,
        auxiliaryNested: wasmResult.auxiliary_nested,
        gyroEnabled: wasmResult.gyro_enabled,
      };
    }

    const primaryAngularVelocityRadPerSec = (primarySpinRpm * Math.PI * 2) / 60;
    const gyroAngularVelocityRadPerSec = (gyroSpinRpm * Math.PI * 2) / 60;
    const auxiliaryNested = auxiliaryReleaseFraction === 0;
    return {
      runtimeSource: "ts-fallback" as const,
      primaryQuaternion: canonicalAxisQuaternion(
        "y",
        primaryAngularVelocityRadPerSec * elapsedSeconds,
      ),
      gyroQuaternion: canonicalAxisQuaternion("x", gyroAngularVelocityRadPerSec * elapsedSeconds),
      primaryAngularVelocityRadPerSec,
      gyroAngularVelocityRadPerSec,
      cameraSupportAngularVelocityRadPerSec:
        gyroEnabled && gyroSpinRpm > 0 ? 0 : primaryAngularVelocityRadPerSec,
      primaryRimSpeedPerRadiusMpsPerM: primaryAngularVelocityRadPerSec,
      tubeLengthRatio,
      claim2RatioMargin: tubeLengthRatio - 3,
      claim2Satisfied: tubeLengthRatio >= 3,
      claim1SequenceSatisfied: auxiliaryNested || primaryChargeSubstantiallyConsumed,
      auxiliaryNested,
      gyroEnabled,
    };
  },

  /**
   * Liquid-propellant de Laval model for the separately catalogued 1926
   * US 1,155,986 record. It is not a model of the solid-charge apparatus
   * claimed in US 1,102,653.
   */
  stepGoddardRocket(
    chamberPressurePsi: number,
    fuelFlowKgPerSec: number,
    _throatAreaCm2: number = 4.2,
    expansionRatio: number = 3.5,
  ) {
    const wasmRes = tryGoddardWasmStep(
      chamberPressurePsi,
      fuelFlowKgPerSec,
      _throatAreaCm2,
      expansionRatio,
    );
    const thermo = goddardThermo(chamberPressurePsi, expansionRatio);
    const chemicalEnthalpyWatts = Number(
      (
        fuelFlowKgPerSec *
        ((thermo.gamma / (thermo.gamma - 1)) * 365 * thermo.chamberTempK)
      ).toFixed(0),
    );
    if (wasmRes) {
      const exhaustKineticWatts = Number(
        (0.5 * fuelFlowKgPerSec * wasmRes.exhaust_velocity_mps ** 2).toFixed(0),
      );
      return {
        runtimeSource: "wasm" as const,
        chamberPressurePsi: wasmRes.chamber_pressure_psi,
        chamberPressurePa: wasmRes.chamber_pressure_pa,
        exhaustVelocityMps: wasmRes.exhaust_velocity_mps,
        thrustNewtons: wasmRes.thrust_newtons,
        specificImpulseSec: wasmRes.specific_impulse_sec,
        machExit: wasmRes.mach_exit,
        thrustLbf: Math.round(wasmRes.thrust_newtons * 0.224809),
        exhaustTempK: thermo.exhaustTempK,
        chamberTempK: thermo.chamberTempK,
        gamma: thermo.gamma,
        chemicalEnthalpyWatts,
        exhaustKineticWatts,
        expansionRatio,
        plumeAdvancePerS:
          wasmRes.exhaust_velocity_mps >= 800
            ? Number(((wasmRes.exhaust_velocity_mps / 2000) * 35).toFixed(3))
            : 0,
        chamberPressureAtm: Number((wasmRes.chamber_pressure_psi / 14.696).toFixed(1)),
        ...goddardSchematicStack(),
      };
    }

    const chamberPressurePa = chamberPressurePsi * 6894.76;
    const gamma = 1.24;
    const machExit = Math.sqrt((2 / (gamma - 1)) * (expansionRatio ** (2 / (gamma + 1)) - 1));
    const exhaustVelocityMps = thermo.veMps;
    const thrustNewtons = Math.round(fuelFlowKgPerSec * exhaustVelocityMps);
    const specificImpulseSec = thermo.ispSec;
    const exhaustKineticWatts = Number(
      (0.5 * fuelFlowKgPerSec * exhaustVelocityMps ** 2).toFixed(0),
    );

    return {
      runtimeSource: "ts-fallback" as const,
      chamberPressurePsi,
      chamberPressurePa,
      exhaustVelocityMps,
      thrustNewtons,
      specificImpulseSec,
      machExit: Number(machExit.toFixed(2)),
      thrustLbf: Math.round(thrustNewtons * 0.224809),
      exhaustTempK: thermo.exhaustTempK,
      chamberTempK: thermo.chamberTempK,
      gamma: thermo.gamma,
      chemicalEnthalpyWatts,
      exhaustKineticWatts,
      expansionRatio,
      plumeAdvancePerS:
        exhaustVelocityMps >= 800 ? Number(((exhaustVelocityMps / 2000) * 35).toFixed(3)) : 0,
      chamberPressureAtm: Number((chamberPressurePsi / 14.696).toFixed(1)),
      ...goddardSchematicStack(),
    };
  },

  /**
   * John Bardeen & Walter Brattain Point-Contact Transistor (US 2,569,347 / US 2,524,191)
   * Minority Carrier Hole Injection & Germanium Base Transport
   */
  stepBardeenTransistor(
    emitterCurrentMa: number,
    collectorBiasVolts: number,
    pointSpacingMicrons: number = 50,
  ): SemiconductorState {
    const cat = catalogStepBardeen(emitterCurrentMa, collectorBiasVolts, pointSpacingMicrons);
    const holeMobilityCm2Vs = 1900;
    return {
      biasVoltageVolts: collectorBiasVolts,
      currentGainAlpha: cat.currentGainAlpha,
      holeDiffusionCoefficientCm2ps: cat.holeDiffusionCoefficientCm2ps,
      chargeTransferEfficiencyPct: 0,
      clockPeriodNs: cat.transitTimeNs,
      busBandwidthMbps: 0,
      electronVelocityMps: Number(
        (holeMobilityCm2Vs * (collectorBiasVolts / (pointSpacingMicrons * 1e-4))).toFixed(0),
      ),
      relativisticFractionC: 0,
      voltageGain: cat.voltageGain,
      powerGainDb: cat.powerGainDb,
      collectorCurrentMa: cat.collectorCurrentMa,
      holeDriftSpeed: cat.holeDriftSpeed,
      gapStudioUnits: cat.gapStudioUnits,
      pointGapSvgPx: cat.pointGapSvgPx,
    };
  },

  /**
   * Willard Boyle & George E. Smith Charge-Coupled Device (US 3,923,554 / US 3,792,322)
   * 3-Phase Potential Well Charge Packet Transfer
   */
  stepBoyleSmithCcd(
    phaseStep: number,
    clockVoltageV: number,
    incidentLux: number,
    clockMhz: number = 2.5,
  ): SemiconductorState {
    const phase = (Math.max(1, Math.min(3, Math.round(phaseStep))) || 1) as 1 | 2 | 3;
    const wells = stepCcdWells(phase, incidentLux, clockMhz, clockVoltageV);
    return {
      biasVoltageVolts: clockVoltageV,
      currentGainAlpha: 1.0,
      holeDiffusionCoefficientCm2ps: 35.0,
      chargeTransferEfficiencyPct: wells.ctePct,
      clockPeriodNs: wells.phasePeriodNs,
      busBandwidthMbps: 10,
      electronVelocityMps: wells.photoElectrons,
      relativisticFractionC: 0,
      voltageGain: 1.0,
      powerGainDb: 0,
      collectorCurrentMa: 0,
    };
  },

  /**
   * Philo T. Farnsworth Image Dissector (US 1,773,980)
   * Relativistic Photoelectron Beam & Magnetic Scan Deflection
   */
  /** 120 G at the registry 0.42 A coil. Shared by 2D, 3D, badge, weave. */
  farnsworthDeflectionGauss(coilCurrentA?: number) {
    return (coilCurrentA ?? 0.42) * (120 / 0.42);
  },

  stepFarnsworthTv(
    anodeKv: number,
    magneticDeflectionGauss: number,
    incidentLux: number = 500,
    scanLines: number = 60,
  ) {
    const electronMassKg = 9.1093837e-31;
    const electronChargeC = 1.60217663e-19;
    const speedOfLightMps = 299792458;

    const kineticEnergyJoules = anodeKv * 1000 * electronChargeC;
    const velocityMps = Math.min(
      speedOfLightMps * 0.99,
      Math.sqrt((2 * kineticEnergyJoules) / electronMassKg),
    );
    const relativisticBeta = velocityMps / speedOfLightMps;

    // Lorentz Magnetic Deflection Radius: r = (m * v) / (q * B)
    const bTesla = magneticDeflectionGauss * 1e-4;
    const gyroRadiusMm =
      bTesla > 1e-6 ? ((electronMassKg * velocityMps) / (electronChargeC * bTesla)) * 1000 : 9999;

    return {
      anodeKv,
      electronVelocityMps: Math.round(velocityMps),
      relativisticBeta: Number(relativisticBeta.toFixed(3)),
      gyroRadiusMm: Number(gyroRadiusMm.toFixed(1)),
      photocathodeCurrentUa: Number((Math.max(0, incidentLux) * 0.045).toFixed(1)),
      rasterAdvance: Number(Math.max(1, velocityMps / 2.1e7).toFixed(2)),
      rasterLinePct: 100 / Math.max(1, scanLines),
      rasterLineWrapPct: 100,
      electronDisplaySpeed: Number(((velocityMps / 2e7) * 45).toFixed(3)),
      electronVelocityMegaMps: Number((velocityMps / 1e6).toFixed(1)),
      relativisticPct: Number((relativisticBeta * 100).toFixed(1)),
      acceleratingVoltageVolts: Number((anodeKv * 1000).toFixed(0)),
      schematicCathodeCx: 95,
      schematicCathodeCy: 150,
      schematicCathodeR: 28,
      schematicCollectorX: 300,
      schematicCollectorY: 132,
      schematicCollectorW: 22,
      schematicCollectorH: 36,
      schematicDeflectorX: 150,
      schematicDeflectorY0: 78,
      schematicDeflectorY1: 208,
      schematicDeflectorW: 70,
      schematicDeflectorH: 14,
      schematicEnvelopeX: 55,
      schematicEnvelopeY: 95,
      schematicEnvelopeW: 290,
      schematicEnvelopeH: 110,
      schematicEnvelopeRx: 48,
      schematicCathodeLabelDy: 4,
      scanHCoupling: 0.4,
      scanVCoupling: 0.2,
      scanAmp: 0.9,
      beamPathOriginX: -4.5,
      beamPathSpanX: 8.0,
      beamJitterAmp: 0.05,
      beamWrapX: 4.2,
    };
  },

  /**
   * Percy L. Spencer Cavity Magnetron (US 2,495,429)
   * Hull Cutoff & Microwave Dipole Radiation
   */
  stepSpencerMicrowave(anodeKv: number, magneticGauss: number, rfWatts: number) {
    return stepSpencerMicrowaveCatalog(anodeKv, magneticGauss, rfWatts);
  },

  /**
   * Guglielmo Marconi Spark Transmitter (US 586,193)
   * Monopole Quarter-Wave Radiation & Range Proportionality
   */
  stepMarconiRadio(aerialHeightMeters: number, sparkGapMm: number, coilKv: number) {
    return stepMarconiRadioCatalog(aerialHeightMeters, sparkGapMm, coilKv);
  },

  /**
   * Abraham Lincoln Buoyancy Chambers (US 6,469)
   * Archimedes Hydrostatic Force & Vessel Draft Relief
   */
  stepLincolnBuoy(expansionPct: number, riverDepthFeet: number) {
    const cat = catalogStepLincolnBuoy({
      inflationPct: expansionPct,
      shoalDepth: riverDepthFeet,
    });
    return {
      ...cat,
      chamberVolumeM3: cat.displacedVolumeM3,
      buoyancyForceKn: cat.liftKn,
      draftReductionInches: Number((cat.draftReductionFt * 12).toFixed(1)),
      isFloating: cat.shoalClearanceFt >= 0,
    };
  },

  /**
   * Elias Howe Sewing Machine (US 4,750)
   * 4-Bar Kinematic Linkage & Shuttle Lockstitch Interlock
   */
  stepHoweSewingMachine(crankRpm: number, loopSlackPct: number, stitchPitchMm?: number) {
    return stepHoweSewingMachineKernel(crankRpm, loopSlackPct, stitchPitchMm);
  },

  /**
   * Charles Goodyear Vulcanized Rubber (US 3,633)
   * Polymer Disulfide Cross-Linking Kinetics
   */
  stepGoodyearRubber(
    vulcanizationTempC: number,
    sulfurPct: number,
    durationMin: number,
    stretchLambda?: number,
    specimenTempC?: number,
  ) {
    return stepGoodyearRubberCatalog(
      vulcanizationTempC,
      sulfurPct,
      durationMin,
      stretchLambda,
      specimenTempC,
    );
  },

  stepLamarrFrequencyHopping(channelsCount: number = 7, _hopRateHopsPerSec: number = 0) {
    const illustratedChannels = Math.max(1, Math.min(7, Math.round(channelsCount)));
    return {
      channelsCount: illustratedChannels,
      hopRateHopsPerSec: 0,
      spreadSpectrumBandwidthMhz: 0,
      spreadSpectrumBandwidthHz: 0,
      processingGainDb: 0,
      antiJammingMarginDb: 0,
      hopIntervalMs: 0,
      drumDisplayOmegaRadPerS: 0,
      hopSoundStride: 1,
      jamOccupancyPct: 0,
      bandMinMhz: LAMARR_BAND_MIN_MHZ,
      bandMaxMhz: LAMARR_BAND_MAX_MHZ,
      pianoKeys: illustratedChannels,
      pianoRollStep: LAMARR_PIANO_ROLL_STEP,
      jamChannelFraction: 0,
      defaultJamChannel: 0,
      spectrumBarOriginX: 20,
      spectrumBarPitchPx: 4.5,
      schematicStaffCount: LAMARR_SCHEMATIC_STAFF_COUNT,
      schematicStaffOriginY: LAMARR_SCHEMATIC_STAFF_ORIGIN_Y,
      schematicStaffPitchY: LAMARR_SCHEMATIC_STAFF_PITCH_Y,
      schematicHopOriginX: LAMARR_SCHEMATIC_HOP_ORIGIN_X,
      schematicHopPitchX: LAMARR_SCHEMATIC_HOP_PITCH_X,
      schematicHopSequence: LAMARR_SCHEMATIC_HOP_SEQUENCE,
      schematicStaffX1: LAMARR_SCHEMATIC_STAFF_X1,
      schematicStaffX2: LAMARR_SCHEMATIC_STAFF_X2,
      schematicBoxX: LAMARR_SCHEMATIC_BOX_X,
      schematicBoxY: LAMARR_SCHEMATIC_BOX_Y,
      schematicBoxW: LAMARR_SCHEMATIC_BOX_W,
      schematicBoxH: LAMARR_SCHEMATIC_BOX_H,
      schematicHopW: LAMARR_SCHEMATIC_HOP_W,
      schematicHopH: LAMARR_SCHEMATIC_HOP_H,
    };
  },

  /**
   * Samuel Colt Revolving Gun (US X9430)
   * Single-Action Pawl-Ratchet Indexing & Hoop Stress Mechanics
   */
  stepColtRevolver(params: { chamberPressureMpa?: number; cockingAngleDeg?: number }) {
    const cat = catalogStepColt(params);
    return {
      chamberPressureMpa: params.chamberPressureMpa ?? 85,
      cockingAngleDeg: params.cockingAngleDeg ?? 45,
      hoopStressMpa: cat.hoopStressMpa,
      indexAngleDeg: cat.indexAngleDeg,
      isLocked: cat.isLocked,
      muzzleVelocityMps: cat.muzzleVelocityMps,
      muzzleEnergyJoules: cat.muzzleEnergyJoules,
      powderGrains: cat.powderGrains,
      cycleDisplayMs: cat.cycleDisplayMs,
      recoilKick: cat.recoilKick,
      recoilKickX: cat.recoilKickX,
      schematicBoltRetractY: cat.schematicBoltRetractY,
      chamberCount: cat.chamberCount,
      boltRetractY: cat.boltRetractY,
      boltHomeY: cat.boltHomeY,
      lockReleaseDeg: cat.lockReleaseDeg,
    };
  },

  /**
   * Elisha Otis Safety Elevator (US 31,128)
   * Fail-Safe Spring Deceleration & Guide-Rail Ratchet Catch Dynamics
   */
  stepOtisElevator,

  /**
   * George Westinghouse Automatic Air Brake (US 124,404)
   * US 124,404 Double-Pipe Steam-Power Air Brake, Tripping Cocks, and Pneumatic Signalling
   */
  stepWestinghouseAirBrake(params: {
    trainPipePressurePsi?: number; // operating line pressure (0 to 80 psi)
    reservoirPipePressurePsi?: number; // reservoir charging line pressure (0 to 100 psi)
    selectingCockState?: "normal" | "reversed"; // cock d1 position
    tripCockState?: "running" | "tripped_derailment" | "tripped_parting"; // cock e automatic trip
    signalPulsePressurePsi?: number; // pneumatic signalling differential (0 to 2.5 psi)
    conductorCockOpen?: boolean; // conductor emergency cock n2
    carMassTonnes?: number; // 20 to 60 tonnes
    approachSpeedMph?: number;
  }) {
    const pipePsi = params.trainPipePressurePsi ?? 70;
    const resPipePsi = params.reservoirPipePressurePsi ?? 90;
    const carMass = params.carMassTonnes ?? 35;
    const approachSpeedMph = params.approachSpeedMph ?? 45;
    const isReversed = params.selectingCockState === "reversed";
    const tripState = params.tripCockState ?? "running";
    const isTripped = tripState !== "running";
    const signalPsi = params.signalPulsePressurePsi ?? 0;
    const isConductorOpen = params.conductorCockOpen ?? false;

    // Stored air receiver D nominal volume = 40L, brake cylinder C volume = 15L
    const receiverStoredPsi = resPipePsi;
    const boyleEqualizationPsi = Number(((receiverStoredPsi * 40) / (40 + 15)).toFixed(1));

    // Cylinder pressure: from operating pipe under normal operation,
    // or equalized from receiver D when cock e trips (derailment/parting) or conductor opens n2
    let cylPsi: number;
    if (isTripped || isConductorOpen) {
      cylPsi = boyleEqualizationPsi;
    } else {
      cylPsi = Math.max(0, Math.min(80, pipePsi));
    }

    const isEmergency = isTripped || isConductorOpen || cylPsi >= 50;
    const isService = cylPsi > 10 && !isEmergency;
    const _isRelease = cylPsi <= 5;

    const cylAreaSqIn = 78.5; // 10-inch cylinder
    const pistonThrustLbf = cylPsi * cylAreaSqIn;
    const shoeClampingForceKn = Number(((pistonThrustLbf * 5 * 4.44822) / 1000).toFixed(1));
    // Constant shoe force => constant deceleration at fixed mass and cylinder
    // pressure: a = a0 * (psi/50) / (mass/35), anchored so 45 mph at the
    // 50 psi / 35 t design point gives the historical 500 m stop. Distance
    // then follows v^2/(2a) instead of ignoring approach speed entirely.
    const approachSpeedMps = Number((approachSpeedMph * 0.44704).toFixed(2));
    const designDecelerationMps2 = 0.405;
    const brakeDecelerationMps2 = (designDecelerationMps2 * (cylPsi / 50)) / (carMass / 35);
    const stoppingDistanceM =
      cylPsi > 10 ? Math.round(approachSpeedMps ** 2 / (2 * brakeDecelerationMps2)) : 1200;
    const decelerationMps2 = cylPsi > 10 ? Number(brakeDecelerationMps2.toFixed(3)) : 0;
    const stoppingTimeS =
      decelerationMps2 > 0 ? Number((approachSpeedMps / decelerationMps2).toFixed(1)) : 0;
    const wheelRadiusM = 0.42;
    const clampRatio = Number(Math.min(1, Math.max(0, cylPsi / 55)).toFixed(3));

    // Signalling index dial graduation (Fig. 4: 1 = normal running, 2 = flag station, 3 = stop for orders, 4 = danger run slow, 5 = danger stop)
    const signalIndexStep = Math.min(5, Math.max(1, 1 + Math.floor(signalPsi / 0.5)));
    const signalMessages = [
      "1: Normal Running / Clear",
      "2: Flag Station",
      "3: Stop for Orders",
      "4: Danger — Run Slow",
      "5: Danger — Stop",
    ] as const;
    const signalMessage = signalMessages[signalIndexStep - 1] ?? signalMessages[0];
    const alarmWhistleActive = signalPsi > 0.2;

    return {
      trainPipePressurePsi: pipePsi,
      operatingPipePressurePsi: isReversed ? resPipePsi : pipePsi,
      reservoirPipePressurePsi: isReversed ? pipePsi : resPipePsi,
      auxReservoirPressurePsi: receiverStoredPsi,
      receiverPressurePsi: receiverStoredPsi,
      brakeCylinderPressurePsi: cylPsi,
      shoeClampingForceKn,
      stoppingDistanceM,
      stoppingDistanceFt: Math.round(stoppingDistanceM * 3.28084),
      pistonStrokeRatio: Number((cylPsi / 55).toFixed(2)),
      pistonStrokePx: Math.round((cylPsi / 55) * 18),
      shoeDistancePx: Math.max(0, 18 - Math.round((cylPsi / 55) * 18)),
      valveState: isEmergency ? "EMERGENCY" : isService ? "SERVICE" : "RELEASE",
      selectingCockState: isReversed ? "reversed" : "normal",
      isSelectingCockReversed: isReversed,
      cockD1AngleDeg: isReversed ? 90 : 0,
      tripCockState: tripState,
      isTripped,
      isDerailmentTripped: tripState === "tripped_derailment",
      isUncouplingTripped: tripState === "tripped_parting",
      cockEAngleDeg: isTripped ? 90 : 0,
      tripCatchReleased: isTripped,
      conductorCockOpen: isConductorOpen,
      signalPulsePressurePsi: signalPsi,
      signalIndexStep,
      signalMessage,
      alarmWhistleActive,
      boyleEqualizationPsi,
      approachSpeedMph,
      approachSpeedMps,
      decelerationMps2,
      decelerationMphPerS: Number((decelerationMps2 / 0.44704).toFixed(2)),
      accelMphPerS: 10,
      stoppingTimeS,
      wheelRadiusM,
      clampRatio,
      freeWheelOmegaRadPerS: Number((approachSpeedMps / wheelRadiusM).toFixed(3)),
      rollingOmegaRadPerS: Number(
        ((approachSpeedMps / wheelRadiusM) * (1 - clampRatio * 0.95)).toFixed(3),
      ),
      wheelDisplayDegPerMph: 8,
      displayWrapDeg: 360,
      flywheelSvgR: 54,
      wheelRimSvgR: 68,
      wheelHubSvgR: 16,
      spokeCount: 6,
      spokePitchDeg: 60,
      schematicWheelCx: 330,
      schematicWheelCy: 152,
      schematicWheelR: 35,
      schematicPipeX1: 40,
      schematicPipeX2: 360,
      schematicPipeY: 230,
      schematicValveX: 60,
      schematicValveY: 70,
      schematicValveW: 90,
      schematicValveH: 110,
      schematicPistonX: 70,
      schematicPistonW: 70,
      schematicPistonH: 14,
      schematicPistonReleaseY: 85,
      schematicPistonApplyY: 125,
      schematicReservoirX: 180,
      schematicReservoirY: 50,
      schematicReservoirW: 100,
      schematicReservoirH: 55,
      schematicCylinderX: 180,
      schematicCylinderY: 130,
      schematicCylinderW: 80,
      schematicCylinderH: 45,
      schematicPistonBarX: 190,
      schematicPistonBarY: 138,
      schematicPistonBarW: 8,
      schematicPistonBarH: 28,
      schematicRodX1: 200,
      schematicRodY: 152,
      schematicRodX2: 280,
      schematicShoeD: "M 285 130 Q 292 152 285 174",
      tripleValveHomeY: 0.1,
      tripleValveStroke: 0.18,
      pistonHomeX: 0.9,
      maxPushStroke: 0.35,
      leverAngleAmp: 0.18,
      frontBeamHomeX: -1.4,
      rearBeamHomeX: 1.4,
      beamClampTravel: 0.08,
      sparkClampThreshold: 0.4,
      sparkWheelSpeedThreshold: 0.5,
      sparkOpacityScale: 0.9,
      sparkWheelCount: 4,
      sparkWheelXNear: -1.4,
      sparkWheelXFar: 1.4,
      sparkWheelZNear: -1.02,
      sparkWheelZFar: 1.02,
      sparkY: -1.05,
      sparkJitterXY: 0.12,
      sparkJitterZ: 0.08,
    };
  },

  /**
   * Ottmar Mergenthaler Linotype Machine (US 313,224)
   * Binary Matrix Keyway Sorting & Spaceband Justification
   */
  stepMergenthalerLinotype,

  /**
   * Hiram Maxim Automatic Machine Gun (US 319,596)
   * Short-Recoil Conservation of Momentum & Toggle-Lock Dynamics
   */
  stepMaximMachineGun,

  /** Source-bounded US 361,931 prismatic shaft and contact topology. */
  stepDaimlerMarineApparatus(shaftSelection: number, coolingPumpEnabled: boolean) {
    const normalizedSelection = Math.max(-1, Math.min(1, Math.round(shaftSelection)));
    const wasmResult = tryDaimlerMarineWasmStep(normalizedSelection, coolingPumpEnabled);
    if (wasmResult) {
      return {
        runtimeSource: "wasm" as const,
        shaftTranslationAlongAxisNormalized: wasmResult.shaft_translation_along_axis_normalized,
        shaftAxis: wasmResult.shaft_axis,
        shaftJointDofs: wasmResult.shaft_joint_dofs,
        motorRotationSign: wasmResult.motor_rotation_sign,
        propellerRotationSign: wasmResult.propeller_rotation_sign,
        aheadCouplingEngaged: wasmResult.ahead_coupling_engaged,
        asternGearingEngaged: wasmResult.astern_gearing_engaged,
        neutral: wasmResult.neutral,
        thrustCanMaintainAheadContact: wasmResult.thrust_can_maintain_ahead_contact,
        passiveForeAftCoolingPathPresent: wasmResult.passive_fore_aft_cooling_path_present,
        coolingPumpActive: wasmResult.cooling_pump_active,
      };
    }

    const ahead = normalizedSelection === 1;
    const astern = normalizedSelection === -1;
    return {
      runtimeSource: "ts-fallback" as const,
      shaftTranslationAlongAxisNormalized: -normalizedSelection,
      shaftAxis: [1, 0, 0] as [number, number, number],
      shaftJointDofs: 1,
      motorRotationSign: 1,
      propellerRotationSign: normalizedSelection,
      aheadCouplingEngaged: ahead,
      asternGearingEngaged: astern,
      neutral: normalizedSelection === 0,
      thrustCanMaintainAheadContact: ahead,
      passiveForeAftCoolingPathPresent: true,
      coolingPumpActive: coolingPumpEnabled,
    };
  },

  /**
   * Legacy illustrative motor calculation associated with the separately
   * referenced US 349,983 engine. It is not the active US 361,931 marine
   * installation model and must not supply that page's telemetry.
   */
  stepLegacyDaimlerEngineUS349983(params: {
    engineRpm?: number;
    hotTubeTempC?: number;
    differentialSlipAngleDeg?: number;
  }) {
    return catalogStepLegacyDaimlerEngineUS349983(params);
  },

  /**
   * George Eastman Kodak Box Camera (US 388,850)
   * Hyperfocal Fixed-Focus Optics & Rotary Barrel Shutter
   */
  stepEastmanKodak(params: {
    shutterSpeedSec?: number;
    apertureFNumber?: number;
    subjectDistanceM?: number;
  }) {
    const t = params.shutterSpeedSec ?? 0.05;
    const n = params.apertureFNumber ?? 9;
    const dist = params.subjectDistanceM ?? 3.0;
    const f = 0.057; // 57mm focal length
    const c = 0.00003; // 30 micron circle of confusion
    const hyperfocalM = Number((f ** 2 / (n * c) + f).toFixed(2));
    const dofNearM = Number(((hyperfocalM * dist) / (hyperfocalM + dist)).toFixed(2));
    const dofFarM =
      dist >= hyperfocalM ? 999 : Number(((hyperfocalM * dist) / (hyperfocalM - dist)).toFixed(2));
    const ev = Number(Math.log2(n ** 2 / t).toFixed(2));

    return {
      hyperfocalM,
      dofNearM,
      dofFarM,
      exposureValueEv: ev,
      isInFocus: dist >= dofNearM && (dofFarM === 999 || dist <= dofFarM),
      focalLengthMm: Math.round(f * 1000),
      rollCapacity: 100,
      filmFormatInches: 2.5,
      shutterReciprocal: Math.round(1 / Math.max(1e-4, t)),
      // Barrel flash is the shutter interval, floored so 1/100 s is still visible.
      flashDisplayMs: Math.max(80, Math.round(t * 1000)),
      // One barrel revolution per open time (US 388,850 rotary shutter).
      barrelOmegaRadPerS: Number(((2 * Math.PI) / Math.max(0.01, t)).toFixed(3)),
      filmAdvanceSpeedRadPerS: 0.8,
      supplySpoolOmegaRadPerS: 0.64,
      schematicSpoolCx: 110,
      schematicSpoolR: 22,
      schematicSpoolY0: 90,
      schematicSpoolY1: 190,
      schematicShutterCx: 280,
      schematicShutterCy: 140,
      schematicShutterR: 20,
      schematicBodyX: 80,
      schematicBodyY: 50,
      schematicBodyW: 240,
      schematicBodyH: 180,
      schematicConePoints: "150,140 260,100 260,180",
      schematicFinderX: 270,
      schematicFinderY: 130,
      schematicFinderW: 20,
      schematicFinderH: 20,
    };
  },

  /**
   * Herman Hollerith Punched Card Tabulator (US 395,781)
   * Mercury Contact Relays & Solenoid Counter Matrices
   */
  stepHollerithTabulating(params: {
    cardsPerMin?: number;
    supplyVoltageV?: number;
    activeRelays?: number;
  }) {
    return catalogStepHollerith(params);
  },

  /**
   * Jesse Reno Inclined Elevator / Escalator (US 470,918)
   * Continuous Moving Slats & Comb-Plate Safety Extraction
   */
  stepRenoEscalator,

  /**
   * Nikola Tesla Teleautomaton Radio-Controlled Boat (US 613,809)
   * Tuned RF Resonant Tank & Rotary Logic State Machine
   */
  stepTeslaTeleautomaton,

  /**
   * Ferdinand von Zeppelin Rigid Airship (US 621,195)
   * Archimedes Multi-Cell Hydrogen Buoyancy & Space-Frame Stress
   */
  stepZeppelinAirship,

  /**
   * Carl Linde, US 727,650 (filed July 9, 1895).
   *
   * This is deliberately a source-bounded apparatus reading, not a property
   * package for air. The five-page grant gives one effective operating example
   * (75 atmospheres high, 25 atmospheres low, t³ about 10 °C or less) and
   * describes the progressive counter-current cooling path. It gives neither
   * a flow rate, a product amount, nor a terminal temperature. Reporting
   * any of those as a computed output would fabricate a plant measurement.
   */
  stepLindeAirLiquefaction() {
    // These are the one operating example printed by the grant, not visitor
    // controls or a plant-sizing range.
    const highPressureAtm = 75;
    const lowPressureAtm = 25;
    const coolerOutletC = 10;

    return {
      highPressureAtm,
      lowPressureAtm,
      pressureDifferenceAtm: highPressureAtm - lowPressureAtm,
      coolerOutletC,
      counterCurrentLengthM: 100,
      liquefactionClaimed: true,
      modelBoundary:
        "The grant says this arrangement progressively reaches liquefaction; it does not supply a measured outlet temperature or production rate.",
    };
  },

  /**
   * Willis Carrier air-purifying apparatus (US 808,897).
   *
   * The grant describes a fine liquid spray followed by upright sinuous
   * separator plates. This step deliberately reports only the source-named
   * wet-film, particle-capture, droplet-separation, and flow-resistance
   * relationships. It is not a thermal-conditioning model.
   */
  stepCarrierAirConditioner(params: {
    inletTempC?: number;
    inletRhPct?: number;
    sprayWaterTempC?: number;
    reheatTempC?: number;
    airflowCfm?: number;
    sprayRatePct?: number;
    separatorFaces?: number;
  }) {
    const airflowCfm = Math.max(0, params.airflowCfm ?? 15000);
    const sprayRatePct = Math.min(100, Math.max(0, params.sprayRatePct ?? 60));
    const separatorFaces = Math.min(12, Math.max(2, Math.round(params.separatorFaces ?? 6)));
    const airCurrentMps = Number(((airflowCfm * 0.00047194745) / 0.25).toFixed(3));
    const wetFilmCoveragePct = Number(
      Math.min(100, sprayRatePct * (0.55 + 0.45 * Math.min(1, separatorFaces / 8))).toFixed(1),
    );
    const particleCapturePct = Number(
      Math.min(99, wetFilmCoveragePct * (0.35 + 0.055 * separatorFaces)).toFixed(1),
    );
    const dropletSeparationPct = Number(
      Math.min(99, (separatorFaces - 1) * 8.5 + sprayRatePct * 0.18).toFixed(1),
    );
    const pressureDropPa = Number(
      (0.5 * 1.2 * airCurrentMps ** 2 * (0.08 * separatorFaces)).toFixed(2),
    );
    const airMovementWatts = Number((pressureDropPa * airflowCfm * 0.00047194745).toFixed(2));

    const hasThermal =
      params.inletTempC !== undefined ||
      params.inletRhPct !== undefined ||
      params.sprayWaterTempC !== undefined ||
      params.reheatTempC !== undefined;

    if (!hasThermal) {
      return {
        sprayRatePct,
        separatorFaces,
        airCurrentMps,
        wetFilmCoveragePct,
        particleCapturePct,
        dropletSeparationPct,
        pressureDropPa,
        airMovementWatts,
        airflowCfm,
        modelBoundary:
          "The source gives no thermal setpoint, secondary heating stage, or measured efficiency; those quantities are intentionally not modeled.",
      };
    }

    // Psychrometric Magnus dew point and latent extraction
    const tIn = params.inletTempC ?? 35;
    const rhIn = Math.min(100, Math.max(1, params.inletRhPct ?? 75)) / 100;
    const tSpray = params.sprayWaterTempC ?? 8;
    const tReheat = params.reheatTempC ?? 22;

    const a = 17.27;
    const b = 237.7;
    const alpha = (a * tIn) / (b + tIn) + Math.log(rhIn);
    const dewPointInC = Number(((b * alpha) / (a - alpha)).toFixed(2));

    // Saturation vapor pressure at dew point vs spray temperature (Tetens formula)
    const pSatIn = 0.61078 * Math.exp((17.27 * dewPointInC) / (dewPointInC + 237.3));
    const pSatSpray = 0.61078 * Math.exp((17.27 * tSpray) / (tSpray + 237.3));
    const pAtm = 101.325; // kPa

    const wIn = (0.62198 * pSatIn) / (pAtm - pSatIn); // kg water / kg dry air
    const wOut = Math.min(wIn, (0.62198 * pSatSpray) / (pAtm - pSatSpray));
    const moistureRemovedGPerKg = Number((Math.max(0, wIn - wOut) * 1000).toFixed(2));

    // Relative humidity after sensible reheat to tReheat
    const pSatReheat = 0.61078 * Math.exp((17.27 * tReheat) / (tReheat + 237.3));
    const pVaporOut = (wOut * pAtm) / (0.62198 + wOut);
    const finalRhPct = Number(
      Math.min(100, Math.max(0, (pVaporOut / pSatReheat) * 100)).toFixed(1),
    );

    // Air mass flow rate (kg/s)
    const airMassFlowKgPerS = airflowCfm * 0.00047194745 * 1.204;
    const hVap = 2501000; // Latent heat of vaporization of water (J/kg)
    const coolingWatts = Number((airMassFlowKgPerS * Math.max(0, wIn - wOut) * hVap).toFixed(0));

    return {
      sprayRatePct,
      separatorFaces,
      airCurrentMps,
      wetFilmCoveragePct,
      particleCapturePct,
      dropletSeparationPct,
      pressureDropPa,
      airMovementWatts,
      airflowCfm,
      dewPointInC,
      moistureRemovedGPerKg,
      finalRhPct,
      coolingWatts,
      modelBoundary:
        "Psychrometric dew-point saturation, wet-plate film condensation, and post-demister sensible reheat.",
    };
  },

  /**
   * Universal Telemetry Envelope Generator
   */
  stepDieselEngine(params: {
    compressionRatio?: number;
    blastAirPressureBar?: number;
    cutoffRatio?: number;
    engineRpm?: number;
  }) {
    return kernelStepDieselEngine(params);
  },

  stepSundbackZipper(
    controls: SundbackZipperControls,
    dt: number = 1 / 60,
  ): SundbackZipperTelemetry {
    return stepSundbackZipperSi(controls, dt);
  },

  stepKamenTransporter(
    controls: KamenTransporterControls,
    dt: number = 1 / 60,
  ): KamenTransporterTelemetry {
    return stepKamenTransporterSi(controls, dt);
  },

  stepWatsonRcc(controls: WatsonRemoteCenterComplianceControls): WatsonRemoteCenterCompliancePose {
    return stepWatsonRemoteCenterComplianceTopology(controls);
  },

  stepLemelsonWarehousing(controls: LemelsonWarehouseControls): LemelsonWarehousePose {
    return stepLemelsonWarehouseTopology(controls);
  },

  stepStackhouseManipulator(controls: StackhouseSourceControls): StackhouseSourcePose {
    return stepStackhouseSourceTopology(controls);
  },

  stepMestralVelcro(controls: MestralVelcroControls, timeSec = 0): MestralVelcroTelemetry {
    return stepMestralVelcroSi(controls, timeSec);
  },

  /** US 4,921,293 nine-joint/12-cable topology and source-printed static torque law. */
  stepSalisburyRobotHand(controls: SalisburyRobotHandControls): SalisburyMechanismState {
    return stepSalisburyTopology(controls);
  },

  createTelemetryEnvelope(
    patentId: string,
    data: Partial<UniversalPatentPhysicsTelemetry>,
  ): UniversalPatentPhysicsTelemetry {
    return {
      patentId,
      domain: data.domain || "aerodynamics_mbd",
      // Tape timestamps are virtual replay coordinates. UI wall clocks never
      // enter the physics envelope unless a caller explicitly supplies one.
      timestampMs: data.timestampMs ?? 0,
      timeStepDt: 0.016,
      refusal: { isRefused: false },
      ...data,
    };
  },
};
