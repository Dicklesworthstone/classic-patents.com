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
import { stepTeslaMotorFig9, teslaBAt, teslaCoilControls, teslaFig4Strobe } from "./teslaKernel";
import { tryTeslaWasmStep } from "./teslaWasm";
import { goddardThermo } from "./thermochem";
import type {
  AerodynamicsState,
  NuclearKineticsState,
  SemiconductorState,
  ThermodynamicsState,
  UniversalPatentPhysicsTelemetry,
} from "./types";

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
      chargeTransferEfficiencyPct: Number((wells.cte * 100).toFixed(4)),
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

  stepFarnsworthTv(anodeKv: number, magneticDeflectionGauss: number, incidentLux: number = 500) {
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
      electronDisplaySpeed: Number(((velocityMps / 2e7) * 45).toFixed(3)),
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
      return {
        resonantFreqKhz: wasmRes.resonant_freq_khz,
        secondaryPotentialMv: Number((wasmRes.secondary_potential_mv * scale).toFixed(2)),
        streamerLengthInches: Number((wasmRes.streamer_length_inches * scale).toFixed(1)),
        streamerLengthMeters: Number((wasmRes.streamer_length_meters * scale).toFixed(2)),
        secondaryPotentialKv: Math.round(wasmRes.secondary_potential_mv * scale * 1000),
        streamerScale: Number(
          Math.min(2.2, Math.max(0.35, (wasmRes.streamer_length_inches * scale) / 48)).toFixed(2),
        ),
      };
    }

    const primaryL = 0.012; // mH
    const secondaryL = 85.0; // mH
    const transformationRatio = Math.sqrt(secondaryL / primaryL) * nScale;
    // V₂ ≈ V₁ √(L₂/L₁) k √Q, then spark-gap loading. 28 in/MV air breakdown.
    const secondaryPotentialMv =
      ((inputKv * transformationRatio * k * Math.sqrt(qFactor)) / 1000) * (sparkGapMm / 15);
    const streamerLengthInches = secondaryPotentialMv * 28.0;

    return {
      resonantFreqKhz,
      secondaryPotentialMv: Number(secondaryPotentialMv.toFixed(2)),
      streamerLengthInches: Number(streamerLengthInches.toFixed(1)),
      streamerLengthMeters: Number(((streamerLengthInches * 2.54) / 100).toFixed(2)),
      secondaryPotentialKv: Math.round(secondaryPotentialMv * 1000),
      streamerScale: Number(Math.min(2.2, Math.max(0.35, streamerLengthInches / 48)).toFixed(2)),
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

  /**
   * Hedy Lamarr & George Antheil Secret Communication (US 2,292,387)
   * Slotted Frequency-Hopping Spread-Spectrum Anti-Jamming Dynamics
   */
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
      processingGainDb,
      antiJammingMarginDb,
      hopIntervalMs: Math.round(1000 / Math.max(1, hopRateHopsPerSec)),
      jamOccupancyPct: Number((100 / Math.max(1, channelsCount)).toFixed(2)),
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
    };
  },

  /**
   * Elisha Otis Safety Elevator (US 31,128)
   * Fail-Safe Spring Deceleration & Guide-Rail Ratchet Catch Dynamics
   */
  stepOtisElevator,

  /**
   * George Westinghouse Automatic Air Brake (US 124,404)
   * Differential Triple-Valve Pneumatics & Foundation Brake Clamping
   */
  stepWestinghouseAirBrake(params: {
    trainPipePressurePsi?: number; // 0 to 70 psi
    carMassTonnes?: number; // 20 to 60 tonnes
    approachSpeedMph?: number;
  }) {
    const pipePsi = params.trainPipePressurePsi ?? 70;
    const carMass = params.carMassTonnes ?? 35;
    const approachSpeedMph = params.approachSpeedMph ?? 45;
    const auxPsi = 70; // charged reservoir pressure
    const isEmergency = pipePsi < 10;
    const isService = pipePsi < 60 && !isEmergency;
    const _isRelease = pipePsi >= 65;

    // Cylinder pressure equalizes from aux reservoir as pipe pressure drops
    const cylPsi = Math.max(0, Math.min(55, Math.round((70 - pipePsi) * 1.1)));
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
    const clampRatio =
      pipePsi >= 65 ? 0 : Number(Math.min(1, Math.max(0, (65 - pipePsi) / 55)).toFixed(3));

    return {
      trainPipePressurePsi: pipePsi,
      auxReservoirPressurePsi: auxPsi,
      brakeCylinderPressurePsi: cylPsi,
      shoeClampingForceKn,
      stoppingDistanceM,
      stoppingDistanceFt: Math.round(stoppingDistanceM * 3.28084),
      pistonStrokeRatio: Number((cylPsi / 55).toFixed(2)),
      valveState: isEmergency ? "EMERGENCY" : isService ? "SERVICE" : "RELEASE",
      approachSpeedMph,
      approachSpeedMps,
      decelerationMps2,
      decelerationMphPerS: Number((decelerationMps2 / 0.44704).toFixed(2)),
      stoppingTimeS,
      wheelRadiusM,
      clampRatio,
      freeWheelOmegaRadPerS: Number((approachSpeedMps / wheelRadiusM).toFixed(3)),
      rollingOmegaRadPerS: Number(
        ((approachSpeedMps / wheelRadiusM) * (1 - clampRatio * 0.95)).toFixed(3),
      ),
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
      crankOmegaRadPerS: crank.omegaRadPerS,
      crankOmegaDegPerS: crank.omegaDegPerS,
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
   * Carl Linde Air Liquefaction (US 727,650)
   * Joule-Thomson Cryogenic Throttling & Counter-Current Recovery
   */
  stepLindeAirLiquefaction(params: {
    compressorPressureBar?: number;
    heatExchangerPasses?: number;
    throttleOrificeMm?: number;
  }) {
    const pComp = params.compressorPressureBar ?? 200;
    const passes = params.heatExchangerPasses ?? 45;
    const jtDeltaTPerPass = 0.215 * (pComp - 20);
    const coldEndTempK = Math.max(78, Math.round(293 - (passes / 50) * 215));
    const coldEndTempC = coldEndTempK - 273;
    const isLiquefying = coldEndTempK <= 80;
    const liquidYieldPct = isLiquefying
      ? Number((((80 - (coldEndTempK - 78)) / 80) * 8.5).toFixed(1))
      : 0;
    const liquidOutputLitersPerHr = Number(((pComp / 200) * liquidYieldPct * 0.45).toFixed(2));

    return {
      coldEndTempK,
      coldEndTempC,
      jtDeltaTPerPass: Number(jtDeltaTPerPass.toFixed(1)),
      isLiquefying,
      liquidYieldPct,
      liquidOutputLitersPerHr,
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
  }) {
    const tIn = params.inletTempC ?? 35;
    const rhIn = params.inletRhPct ?? 75;
    const tSpray = params.sprayWaterTempC ?? 8;
    const tReheat = params.reheatTempC ?? 22;
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

    return {
      dewPointInC,
      isDehumidifying,
      moistureRemovedGPerKg,
      finalAirTempC: tReheat,
      finalRhPct,
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
