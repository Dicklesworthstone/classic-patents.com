/**
 * FrankenSim Multi-Domain Computational Physics Engine
 *
 * Implements Lie-group time integration, discrete electromagnetics,
 * semiconductor carrier transport, thermal absorption cycles, and point kinetics.
 */

import {
  stepBardeenTransistor as catalogStepBardeen,
  stepColtRevolver as catalogStepColt,
  stepDaimlerEngine as catalogStepDaimlerEngine,
  stepHollerithTabulating as catalogStepHollerith,
  stepKevlarContinuum as catalogStepKevlar,
  stepLincolnBuoy as catalogStepLincolnBuoy,
  dieselCamWindows,
  goddardSchematicStack,
  rpmToOmega,
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
  stepThomsonWelding,
  stepWhitneyCottonGin,
  stepWozniakApple,
  stepZeppelinAirship,
} from "./catalogKernels";
import { stepFermiKinetics } from "./fermiKinetics";
import { cycleHeatCrate } from "./genericWasm";
import { tryGoddardWasmStep } from "./goddardWasm";
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
  stepTeslaMotorFig9,
  teslaBAt,
  teslaCoilControls,
  teslaCoilSiUnits,
  teslaFig4Strobe,
} from "./teslaKernel";
import { tryTeslaWasmStep } from "./teslaWasm";
import { goddardThermo } from "./thermochem";
import type {
  AerodynamicsState,
  NuclearKineticsState,
  SemiconductorState,
  ThermodynamicsState,
  UniversalPatentPhysicsTelemetry,
} from "./types";

/** US 2,292,387 88-key player-piano hop set. Shared by 2D / 3D. */
export const LAMARR_BAND_MIN_MHZ = 302;
export const LAMARR_BAND_MAX_MHZ = 520;
export const LAMARR_PIANO_KEYS = 88;
export const LAMARR_PIANO_ROLL_STEP = 37;
export const LAMARR_JAM_CHANNEL_FRACTION = 0.3;
export const LAMARR_SCHEMATIC_STAFF_COUNT = 11;
export const LAMARR_SCHEMATIC_STAFF_ORIGIN_Y = 75;
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
  const denom = Math.max(1, channelCount - 1);
  return Number((minMhz + ((Math.max(1, channel) - 1) * (maxMhz - minMhz)) / denom).toFixed(3));
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
  return Number((220 + (Math.max(1, pianoKey) / pianoKeys) * 660).toFixed(1));
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

    // Wing Warping Lift differential
    const baseLift = 0.5 * 1.225 * current.airspeedMps ** 2 * 47.4 * 0.45;
    const deltaLift = wingWarpDeg * 18.5;
    const liftNewtons = Math.max(0, baseLift + deltaLift);

    // Induced Drag: C_Di = C_L^2 / (pi * AR * e)
    const inducedDrag =
      liftNewtons ** 2 /
      (Math.PI * 6.4 * 0.85 * 0.5 * 1.225 * current.airspeedMps ** 2 * 47.4 + 1e-4);
    const parasiticDrag = 0.5 * 1.225 * current.airspeedMps ** 2 * 4.2;

    // Adverse Yaw Coupling & Rudder Counter-Torque
    const adverseYawTorque = -wingWarpDeg * 0.08;
    const rudderRestoringTorque = rudderDeg * 0.12;
    const netYawRate = current.yawRateRps + (adverseYawTorque + rudderRestoringTorque) * dt;

    // Elevator Pitch Moment
    const pitchMoment = -elevatorDeg * 0.15;
    const netPitchRate = current.pitchRateRps + pitchMoment * dt;

    return {
      ...current,
      wingWarpDeflectionDeg: wingWarpDeg,
      rudderDeflectionDeg: rudderDeg,
      elevatorDeflectionDeg: elevatorDeg,
      liftNewtons,
      inducedDragNewtons: inducedDrag,
      parasiticDragNewtons: parasiticDrag,
      yawRateRps: netYawRate,
      pitchRateRps: netPitchRate,
      altitudeMeters: Math.max(
        0,
        current.altitudeMeters + (liftNewtons - 340 * 9.81) * 0.0005 * dt,
      ),
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

  stepTeslaMotorFig9,

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
   * Robert H. Goddard Liquid-Propellant Rocket (US 1,155,986 / US 1,102,653)
   * Supersonic de Laval Nozzle & Thermodynamic Expansion
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
        chamberPressurePsi: wasmRes.chamber_pressure_psi,
        chamberPressurePa: wasmRes.chamber_pressure_psi * 6894.76,
        exhaustVelocityMps: wasmRes.exhaust_velocity_mps,
        thrustNewtons: wasmRes.thrust_newtons,
        specificImpulseSec: wasmRes.exhaust_velocity_mps / 9.80665,
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
   * Generic coupled-LC and breakdown host fallback used by the interpretive
   * high-potential-transformer visualization. It is not a source-faithful
   * reconstruction of US 593,138.
   */
  stepTeslaCoil(
    resonantFreqKhz: number,
    inputKv: number,
    sparkGapMm: number,
    qFactor: number = 145,
    couplingK: number = 0.18,
    secondaryTurns: number = 850,
  ) {
    const k = Math.max(0.05, Math.min(0.5, couplingK));
    const nScale = Math.max(0.4, Math.min(2, secondaryTurns / 850));
    const wasmRes = tryTeslaWasmStep(resonantFreqKhz, inputKv, sparkGapMm, qFactor);
    if (wasmRes) {
      // tesla_coil_step has no k or N_s input; scale from registry defaults.
      const scale = (k / 0.18) * nScale;
      const secondaryPotentialMv = Number((wasmRes.secondary_potential_mv * scale).toFixed(2));
      return {
        resonantFreqKhz: wasmRes.resonant_freq_khz,
        secondaryPotentialMv,
        streamerLengthInches: Number((wasmRes.streamer_length_inches * scale).toFixed(1)),
        streamerLengthMeters: Number((wasmRes.streamer_length_meters * scale).toFixed(2)),
        secondaryPotentialKv: Math.round(wasmRes.secondary_potential_mv * scale * 1000),
        streamerScale: Number(
          Math.min(2.2, Math.max(0.35, (wasmRes.streamer_length_inches * scale) / 48)).toFixed(2),
        ),
        streamerStudioLength: Number(((wasmRes.streamer_length_meters * scale) / 1.5).toFixed(3)),
        toneEnergy: Number(
          Math.min(1, Math.round(wasmRes.secondary_potential_mv * scale * 1000) / 1500).toFixed(3),
        ),
        toneHz: Number((wasmRes.resonant_freq_khz * 2).toFixed(1)),
        ...teslaCoilSiUnits(wasmRes.resonant_freq_khz, inputKv, secondaryPotentialMv),
      };
    }

    const primaryL = 0.012; // mH
    const secondaryL = 85.0; // mH
    const transformationRatio = Math.sqrt(secondaryL / primaryL) * nScale;
    // V₂ ≈ V₁ √(L₂/L₁) k √Q, then spark-gap loading. 28 in/MV air breakdown.
    const secondaryPotentialMv =
      ((inputKv * transformationRatio * k * Math.sqrt(qFactor)) / 1000) * (sparkGapMm / 15);
    const streamerLengthInches = secondaryPotentialMv * 28.0;

    const secondaryPotentialMvRounded = Number(secondaryPotentialMv.toFixed(2));
    return {
      resonantFreqKhz,
      secondaryPotentialMv: secondaryPotentialMvRounded,
      streamerLengthInches: Number(streamerLengthInches.toFixed(1)),
      streamerLengthMeters: Number(((streamerLengthInches * 2.54) / 100).toFixed(2)),
      secondaryPotentialKv: Math.round(secondaryPotentialMv * 1000),
      streamerScale: Number(Math.min(2.2, Math.max(0.35, streamerLengthInches / 48)).toFixed(2)),
      streamerStudioLength: Number(((streamerLengthInches * 2.54) / 100 / 1.5).toFixed(3)),
      toneEnergy: Number(Math.min(1, Math.round(secondaryPotentialMv * 1000) / 1500).toFixed(3)),
      toneHz: Number((resonantFreqKhz * 2).toFixed(1)),
      ...teslaCoilSiUnits(resonantFreqKhz, inputKv, secondaryPotentialMvRounded),
    };
  },

  /**
   * Same interpretive coil step, but the resonant frequency is owned here
   * (teslaCoilResonantKhz) so 2D / 3D / badge / weave cannot drift.
   */
  stepTeslaCoilFromControls(params: {
    primaryCap?: number;
    toploadCapacitancePf?: number;
    inputVoltageKv?: number;
    sparkGapDistanceMm?: number;
    couplingK?: number;
    secondaryTurns?: number;
  }) {
    const c = teslaCoilControls(params);
    return FrankenSimEngine.stepTeslaCoil(
      c.resonantFreqKhz,
      c.inputKv,
      c.sparkGapMm,
      145,
      c.couplingK,
      c.secondaryTurns,
    );
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
  stepHoweSewingMachine(flywheelRpm: number, stitchTensionGrams: number, stitchPitchMm?: number) {
    return stepHoweSewingMachineKernel(flywheelRpm, stitchTensionGrams, stitchPitchMm);
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

  stepLamarrFrequencyHopping(channelsCount: number = 88, hopRateHopsPerSec: number = 4) {
    const spreadSpectrumBandwidthMhz = channelsCount * 0.1; // 100 kHz channels across 8.8 MHz
    const narrowbandSignalBandwidthKhz = 10.0;
    const processingGainDb = Number(
      (10 * Math.log10((spreadSpectrumBandwidthMhz * 1000) / narrowbandSignalBandwidthKhz)).toFixed(
        1,
      ),
    );
    const antiJammingMarginDb = processingGainDb - 3.0;

    return {
      channelsCount,
      hopRateHopsPerSec,
      spreadSpectrumBandwidthMhz,
      spreadSpectrumBandwidthHz: Number((spreadSpectrumBandwidthMhz * 1e6).toFixed(0)),
      processingGainDb,
      antiJammingMarginDb,
      hopIntervalMs: Math.round(1000 / Math.max(1, hopRateHopsPerSec)),
      hopSoundStride: 3,
      jamOccupancyPct: Number((100 / Math.max(1, channelsCount)).toFixed(2)),
      bandMinMhz: LAMARR_BAND_MIN_MHZ,
      bandMaxMhz: LAMARR_BAND_MAX_MHZ,
      pianoKeys: LAMARR_PIANO_KEYS,
      pianoRollStep: LAMARR_PIANO_ROLL_STEP,
      jamChannelFraction: LAMARR_JAM_CHANNEL_FRACTION,
      defaultJamChannel: lamarrDefaultJamChannel(channelsCount),
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
    const stoppingDistanceM =
      cylPsi > 10 ? Math.round((500 * (carMass / 35)) / (cylPsi / 50)) : 1200;
    const approachSpeedMps = Number((approachSpeedMph * 0.44704).toFixed(2));
    const decelerationMps2 =
      cylPsi > 10 && stoppingDistanceM > 0
        ? Number((approachSpeedMps ** 2 / (2 * stoppingDistanceM)).toFixed(3))
        : 0;
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

  /**
   * Gottlieb Daimler High-Speed Motor Carriage (US 361,931)
   * High-RPM ICE Powertrain & Bevel Gear Differential
   */
  stepDaimlerEngine(params: {
    engineRpm?: number;
    hotTubeTempC?: number;
    differentialSlipAngleDeg?: number;
  }) {
    return catalogStepDaimlerEngine(params);
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
   * Rudolf Diesel Compression-Ignition Engine (US 542,846)
   * Extreme Adiabatic Compression & Constant-Pressure Combustion
   */
  stepDieselEngine(params: {
    compressionRatio?: number;
    blastAirPressureBar?: number;
    cutoffRatio?: number;
    engineRpm?: number;
  }) {
    const r = params.compressionRatio ?? 18;
    const pBlast = params.blastAirPressureBar ?? 65;
    const rc = params.cutoffRatio ?? 1.6;
    const rpm = params.engineRpm ?? 150;
    const gamma = 1.4;
    const tIntakeK = 300;
    const tCompressionK = Math.round(tIntakeK * r ** (gamma - 1));
    const tCompressionC = tCompressionK - 273;
    const pCompBar = Number((1.0 * r ** gamma).toFixed(1));
    const idealEfficiencyPct = Number(
      ((1 - (1 / r ** (gamma - 1)) * ((rc ** gamma - 1) / (gamma * (rc - 1)))) * 100).toFixed(1),
    );
    const brakeEfficiencyPct = Number((idealEfficiencyPct * 0.68).toFixed(1));
    const isAutoIgnition = tCompressionC > 210 && pBlast > pCompBar;
    const crank = rpmToOmega(rpm);

    return {
      tCompressionC,
      pCompBar,
      idealEfficiencyPct,
      brakeEfficiencyPct,
      isAutoIgnition,
      engineRpm: rpm,
      ...cycleHeatCrate(r),
      crankOmegaRadPerS: crank.omegaRadPerS,
      crankOmegaDegPerS: crank.omegaDegPerS,
      governorBallSpread: Number(Math.min(1.4, Math.max(0.4, (rpm / 150) * 0.85)).toFixed(3)),
      pressureNeedleRadPerBar: Number(((Math.PI * 1.4) / 80).toFixed(5)),
      pistonStrokePx: 35,
      cycleWrapDeg: 720,
      crankWrapDeg: 360,
      cycleWrapRad: Math.PI * 4,
      injectionStartDeg: 355,
      injectionEndDeg: 390,
      ...dieselCamWindows(355, 390, 720, 0.5),
      compressionGlowStartDeg: 270,
      compressionGlowEndDeg: 450,
      crankCx: 300,
      crankCy: 260,
      rodOriginY0: 103,
      pistonSvgX: 235,
      pistonSvgY0: 75,
      gasChargeH0: 20,
      flywheelRimR: 65,
      flywheelHubR: 14,
      crankPinR: 7,
      schematicFlywheelCx: 200,
      schematicFlywheelCy: 240,
      schematicFlywheelR: 40,
      schematicCylinderX: 130,
      schematicCylinderY: 30,
      schematicCylinderW: 140,
      schematicCylinderH: 170,
      schematicInjectorX: 185,
      schematicInjectorY: 15,
      schematicInjectorW: 30,
      schematicInjectorH: 30,
      schematicPistonX: 140,
      schematicPistonY: 75,
      schematicPistonW: 120,
      schematicPistonH: 55,
      schematicRodX: 200,
      schematicRodY0: 130,
      schematicRodY1: 230,
    };
  },

  /**
   * Nikola Tesla Teleautomaton Radio-Controlled Boat (US 613,809)
   * Tuned RF Resonant Tank & Rotary Logic State Machine
   */
  stepTeslaTeleautomaton(params: {
    transmitterFreqKhz?: number;
    cohererTapped?: boolean;
    rudderAngleDeg?: number;
  }) {
    const fKhz = params.transmitterFreqKhz ?? 150;
    const isTapped = params.cohererTapped ?? false;
    const rudderDeg = params.rudderAngleDeg ?? 0;
    const targetFreqKhz = 150;
    const isResonant = Math.abs(fKhz - targetFreqKhz) <= 5;
    const cohererOhms = isResonant && !isTapped ? 45 : 100000;
    const relayEnergized = cohererOhms < 1000;
    const motorThrustN = relayEnergized ? 85 : 0;
    const turningRadiusM =
      Math.abs(rudderDeg) > 0
        ? Number((12.5 / Math.sin((Math.abs(rudderDeg) * Math.PI) / 180)).toFixed(1))
        : 999;

    return {
      isResonant,
      cohererOhms,
      relayEnergized,
      motorThrustN,
      turningRadiusM,
    };
  },

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
   * a flow rate, a liquefaction yield, nor a terminal temperature. Reporting
   * any of those as a computed output would fabricate a plant measurement.
   */
  stepLindeAirLiquefaction() {
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
        "The grant says this arrangement progressively reaches liquefaction; it does not supply a measured outlet temperature, yield, or production rate.",
    };
  },

  /**
   * Willis Carrier Psychrometric Air Conditioner (US 808,897)
   * Chilled Spray Dew-Point Dehumidification & Moist Air Enthalpy
   */
  stepCarrierAirConditioner(params: {
    inletTempC?: number;
    inletRhPct?: number;
    sprayWaterTempC?: number;
    reheatTempC?: number;
    airflowCfm?: number;
  }) {
    const tIn = params.inletTempC ?? 35;
    const rhIn = params.inletRhPct ?? 75;
    const tSpray = params.sprayWaterTempC ?? 8;
    const tReheat = params.reheatTempC ?? 22;
    const airflowCfm = Math.max(0, params.airflowCfm ?? 15000);
    // Psychrometric dew point approximation
    const a = 17.27;
    const b = 237.7;
    const alpha = (a * tIn) / (b + tIn) + Math.log(rhIn / 100);
    const dewPointInC = Number(((b * alpha) / (a - alpha)).toFixed(1));
    const isDehumidifying = tSpray < dewPointInC;
    const moistureRemovedGPerKg = isDehumidifying
      ? Number(((dewPointInC - tSpray) * 1.15).toFixed(1))
      : 0;
    const finalRhPct = Math.round(
      Math.min(
        100,
        Math.max(
          20,
          (100 * Math.exp((17.27 * tSpray) / (237.7 + tSpray))) /
            Math.exp((17.27 * tReheat) / (237.7 + tReheat)),
        ),
      ),
    );
    const airMassKgPerS = Number((airflowCfm * 0.00047194745 * 1.2).toFixed(4));
    const coolingWatts = Number(
      ((moistureRemovedGPerKg / 1000) * 2.45e6 * airMassKgPerS).toFixed(0),
    );

    return {
      dewPointInC,
      isDehumidifying,
      moistureRemovedGPerKg,
      finalAirTempC: tReheat,
      finalRhPct,
      airflowCfm,
      airMassKgPerS,
      coolingWatts,
    };
  },

  /**
   * Universal Telemetry Envelope Generator
   */
  createTelemetryEnvelope(
    patentId: string,
    data: Partial<UniversalPatentPhysicsTelemetry>,
  ): UniversalPatentPhysicsTelemetry {
    return {
      patentId,
      domain: data.domain || "aerodynamics_mbd",
      timestampMs: Date.now(),
      timeStepDt: 0.016,
      refusal: { isRefused: false },
      ...data,
    };
  },
};
