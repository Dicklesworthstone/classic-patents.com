/**
 * FrankenSim Multi-Domain Computational Physics Engine
 *
 * Implements Lie-group time integration, discrete electromagnetics,
 * semiconductor carrier transport, thermal absorption cycles, and point kinetics.
 */

import {
  stepDaimlerEngine as catalogStepDaimlerEngine,
  stepHollerithTabulating as catalogStepHollerith,
  stepBellTelephone,
  stepCorlissEngine,
  stepDavenportMotor,
  stepDeLavalSeparator,
  stepEdisonBulb,
  stepEdisonPhonograph,
  stepEngelbartMouse,
  stepEricssonPropeller,
  stepGatlingGun,
  stepGliddenBarbedWire,
  stepGoodyearRubber as stepGoodyearRubberCatalog,
  stepGrammeDynamo,
  stepHyattCelluloid,
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
import { teslaBAt, teslaFig4Strobe } from "./teslaKernel";
import { tryTeslaWasmStep } from "./teslaWasm";
import type {
  AerodynamicsState,
  ContinuumState,
  ElectromagneticsState,
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

  /**
   * Tesla Polyphase Induction Motor (US 381,968)
   */
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

  stepTeslaMotor(
    freqHz: number,
    poles: number,
    appliedLoadTorqueNm: number,
  ): ElectromagneticsState {
    const synchronousRpm = (120 * freqHz) / poles;
    const maxBreakdownTorqueNm = 45.0;
    const slipFraction = Math.min(
      0.95,
      Math.max(0.015, appliedLoadTorqueNm / maxBreakdownTorqueNm),
    );
    const rotorRpm = synchronousRpm * (1 - slipFraction);
    const shaftPowerWatts = (appliedLoadTorqueNm * (rotorRpm * 2 * Math.PI)) / 60;
    const electricalInputWatts = shaftPowerWatts * 1.15;
    const currentAmps = slipFraction * 65.0 * (freqHz / 60);

    return {
      frequencyHz: freqHz,
      magneticFluxDensityTesla: 1.2,
      electricFieldVpm: 220,
      phaseAngleRad: Math.acos(0.85),
      inductanceHenry: 0.045,
      capacitanceFarad: 0,
      currentAmperes: currentAmps,
      voltageVolts: 220,
      powerFactor: 0.85,
      efficiencyPct: Math.round((shaftPowerWatts / (electricalInputWatts + 1e-4)) * 100),
      synchronousRpm,
      slipFraction,
    };
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
    ammoniaRatio: number,
  ): ThermodynamicsState {
    const partialPressureButaneAtm = systemPressureAtm * (1 - ammoniaRatio);
    const evaporatorTempC = Math.round(-18 + partialPressureButaneAtm * 6.5);
    const cop = Number((0.35 * (1 - Math.abs(evaporatorTempC) / 100)).toFixed(2));
    const coolingPowerWatts = Math.round(heatInputWatts * cop);

    return {
      temperatureCelsius: evaporatorTempC,
      temperatureKelvin: evaporatorTempC + 273.15,
      pressureAtm: systemPressureAtm,
      partialPressureButaneAtm: Number(partialPressureButaneAtm.toFixed(2)),
      heatInputWatts,
      coolingPowerWatts,
      coefficientOfPerformance: cop,
      blackbodyRadiantPowerWatts: 0,
      fluidFlowVelocityMps: (heatInputWatts / 220) * 0.15,
    };
  },

  /**
   * Stephanie Kwolek Kevlar Aramid Polymers (US 3,671,542)
   */
  stepKevlarContinuum(drawRatio: number, impactVelocityMps: number): ContinuumState {
    const elasticModulusGpa = Math.min(145, 60 + drawRatio * 20);
    const sonicDispersionVelocityMps = Math.sqrt((elasticModulusGpa * 1e9) / 1440);
    const strainPct = (impactVelocityMps / sonicDispersionVelocityMps) * 100;
    const stressMpa = (strainPct / 100) * elasticModulusGpa * 1000;

    return {
      tensileStressMpa: Math.round(stressMpa),
      tensileStrainPct: Number(strainPct.toFixed(2)),
      elasticModulusGpa,
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
    if (wasmRes) {
      return {
        chamberPressurePsi: wasmRes.chamber_pressure_psi,
        chamberPressurePa: wasmRes.chamber_pressure_psi * 6894.76,
        exhaustVelocityMps: wasmRes.exhaust_velocity_mps,
        thrustNewtons: wasmRes.thrust_newtons,
        specificImpulseSec: wasmRes.exhaust_velocity_mps / 9.80665,
        machExit: wasmRes.mach_exit,
      };
    }

    const chamberPressurePa = chamberPressurePsi * 6894.76;
    const gamma = 1.24; // Combustion products heat capacity ratio
    const combustionTempK = 2850;
    const gasConstantR = 365; // J/(kg*K) for gasoline + liquid O2

    // Supersonic Mach number at exit via area-Mach relation
    const machExit = Math.sqrt((2 / (gamma - 1)) * (expansionRatio ** (2 / (gamma + 1)) - 1));
    const exhaustVelocityMps = Math.round(
      Math.sqrt(
        ((2 * gamma) / (gamma - 1)) *
          gasConstantR *
          combustionTempK *
          (1 - 1 / expansionRatio ** (gamma - 1)),
      ),
    );
    const thrustNewtons = Math.round(fuelFlowKgPerSec * exhaustVelocityMps);
    const specificImpulseSec = Number((exhaustVelocityMps / 9.80665).toFixed(1));

    return {
      chamberPressurePsi,
      chamberPressurePa,
      exhaustVelocityMps,
      thrustNewtons,
      specificImpulseSec,
      machExit: Number(machExit.toFixed(2)),
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
    const holeMobilityCm2Vs = 1900; // Germanium p-type hole mobility
    const holeDiffusionCoefficient = 0.0259 * holeMobilityCm2Vs; // Einstein relation at 300K
    const transitTimeNs =
      ((pointSpacingMicrons * 1e-4) ** 2 / (2 * holeDiffusionCoefficient)) * 1e9;
    const transportFactor = Math.max(0.1, 1 - transitTimeNs / 150);
    const emitterInjectionEfficiency = 0.95;
    const currentGainAlpha = Number(
      (emitterInjectionEfficiency * transportFactor * 1.8).toFixed(2),
    );
    const _collectorCurrentMa = Number(
      (Math.abs(collectorBiasVolts) * 0.8 + emitterCurrentMa * currentGainAlpha).toFixed(2),
    );

    return {
      biasVoltageVolts: collectorBiasVolts,
      currentGainAlpha,
      holeDiffusionCoefficientCm2ps: Number(holeDiffusionCoefficient.toFixed(1)),
      chargeTransferEfficiencyPct: 0,
      clockPeriodNs: Number(transitTimeNs.toFixed(2)),
      busBandwidthMbps: 0,
      electronVelocityMps: Number(
        (holeMobilityCm2Vs * (collectorBiasVolts / (pointSpacingMicrons * 1e-4))).toFixed(0),
      ),
      relativisticFractionC: 0,
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
      clockPeriodNs: Number((1000 / Math.max(0.1, clockMhz * 3)).toFixed(1)),
      busBandwidthMbps: 10,
      electronVelocityMps: wells.photoElectrons,
      relativisticFractionC: 0,
    };
  },

  /**
   * Philo T. Farnsworth Image Dissector (US 1,773,980)
   * Relativistic Photoelectron Beam & Magnetic Scan Deflection
   */
  stepFarnsworthTv(anodeKv: number, magneticDeflectionGauss: number) {
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
    };
  },

  /**
   * Percy L. Spencer Cavity Magnetron (US 2,495,429)
   * Hull Cutoff & Microwave Dipole Radiation
   */
  stepSpencerMicrowave(anodeKv: number, magneticGauss: number, rfWatts: number) {
    const hullCutoffGauss = Math.round(1180 * Math.sqrt(anodeKv / 4.2));
    const isOscillating = magneticGauss > hullCutoffGauss;
    const microwaveFreqMhz = 2450;
    const wavelengthCm = 12.24;
    const dielectricLossWattsPerDm3 = isOscillating ? Math.round(rfWatts * 1.8) : 0;

    return {
      hullCutoffGauss,
      isOscillating,
      microwaveFreqMhz,
      wavelengthCm,
      dielectricLossWattsPerDm3,
    };
  },

  /**
   * Nikola Tesla Resonant Transformer (US 512,340)
   * Coupled LC Resonance & Breakdown Breakdown Potentials
   */
  stepTeslaCoil(
    resonantFreqKhz: number,
    inputKv: number,
    sparkGapMm: number,
    qFactor: number = 145,
    couplingK: number = 0.18,
  ) {
    const k = Math.max(0.05, Math.min(0.5, couplingK));
    const wasmRes = tryTeslaWasmStep(resonantFreqKhz, inputKv, sparkGapMm, qFactor);
    if (wasmRes) {
      // tesla_coil_step has no k input; scale the native result from the registry default.
      const kScale = k / 0.18;
      return {
        resonantFreqKhz: wasmRes.resonant_freq_khz,
        secondaryPotentialMv: Number((wasmRes.secondary_potential_mv * kScale).toFixed(2)),
        streamerLengthInches: Number((wasmRes.streamer_length_inches * kScale).toFixed(1)),
        streamerLengthMeters: Number((wasmRes.streamer_length_meters * kScale).toFixed(2)),
      };
    }

    const primaryL = 0.012; // mH
    const secondaryL = 85.0; // mH
    const transformationRatio = Math.sqrt(secondaryL / primaryL);
    // V₂ ≈ V₁ √(L₂/L₁) k √Q, then spark-gap loading. 28 in/MV air breakdown.
    const secondaryPotentialMv =
      ((inputKv * transformationRatio * k * Math.sqrt(qFactor)) / 1000) * (sparkGapMm / 15);
    const streamerLengthInches = secondaryPotentialMv * 28.0;

    return {
      resonantFreqKhz,
      secondaryPotentialMv: Number(secondaryPotentialMv.toFixed(2)),
      streamerLengthInches: Number(streamerLengthInches.toFixed(1)),
      streamerLengthMeters: Number(((streamerLengthInches * 2.54) / 100).toFixed(2)),
    };
  },

  /**
   * Guglielmo Marconi Spark Transmitter (US 586,193)
   * Monopole Quarter-Wave Radiation & Range Proportionality
   */
  stepMarconiRadio(aerialHeightMeters: number, sparkGapMm: number, coilKv: number) {
    const wavelengthMeters = aerialHeightMeters * 4;
    const resonantFreqMhz = 300 / wavelengthMeters;
    const maxRangeMiles = 0.015 * aerialHeightMeters * aerialHeightMeters * (coilKv / 20);
    const peakRfPowerKw = (coilKv * coilKv) / (sparkGapMm * 1.5);
    const radiationResistanceOhms = 36.6;

    return {
      wavelengthMeters,
      resonantFreqMhz: Number(resonantFreqMhz.toFixed(2)),
      maxRangeMiles: Number(maxRangeMiles.toFixed(1)),
      peakRfPowerKw: Number(peakRfPowerKw.toFixed(1)),
      radiationResistanceOhms,
    };
  },

  /**
   * Abraham Lincoln Buoyancy Chambers (US 6,281)
   * Archimedes Hydrostatic Force & Vessel Draft Relief
   */
  stepLincolnBuoy(expansionPct: number, riverDepthFeet: number) {
    const chamberVolumeM3 = (expansionPct / 100) * 145.0; // Total bellows capacity
    const waterDensityKgM3 = 1000.0;
    const gravity = 9.80665;
    const buoyancyForceKn = (chamberVolumeM3 * waterDensityKgM3 * gravity) / 1000;
    const draftReductionInches = Number(((buoyancyForceKn / 65) * 12).toFixed(1));
    const isFloating = riverDepthFeet * 12 + draftReductionInches >= 60; // 5 ft draft baseline

    return {
      chamberVolumeM3: Number(chamberVolumeM3.toFixed(1)),
      buoyancyForceKn: Math.round(buoyancyForceKn),
      draftReductionInches,
      isFloating,
    };
  },

  /**
   * Elias Howe Sewing Machine (US 4,750)
   * 4-Bar Kinematic Linkage & Shuttle Lockstitch Interlock
   */
  stepHoweSewingMachine(flywheelRpm: number, stitchTensionGrams: number) {
    return stepHoweSewingMachineKernel(flywheelRpm, stitchTensionGrams);
  },

  /**
   * Charles Goodyear Vulcanized Rubber (US 3,633)
   * Polymer Disulfide Cross-Linking Kinetics
   */
  stepGoodyearRubber(vulcanizationTempC: number, sulfurPct: number, durationMin: number) {
    return stepGoodyearRubberCatalog(vulcanizationTempC, sulfurPct, durationMin);
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
    };
  },

  /**
   * Samuel Colt Revolving Gun (US 138)
   * Single-Action Pawl-Ratchet Indexing & Hoop Stress Mechanics
   */
  stepColtRevolver(params: { chamberPressureMpa?: number; cockingAngleDeg?: number }) {
    const pMpa = params.chamberPressureMpa ?? 85;
    const cockDeg = params.cockingAngleDeg ?? 45;
    const rInnerMm = 4.5; // .36 caliber chamber radius
    const tWallMm = 3.8;
    const hoopStressMpa = Number(((pMpa * rInnerMm) / tWallMm).toFixed(1));
    const indexAngleDeg = Number(((cockDeg / 45) * 72).toFixed(1));
    const isLocked = cockDeg >= 44;
    const muzzleVelocityMps = Math.round(180 + Math.sqrt(pMpa) * 13.5);

    return {
      chamberPressureMpa: pMpa,
      cockingAngleDeg: cockDeg,
      hoopStressMpa,
      indexAngleDeg,
      isLocked,
      muzzleVelocityMps,
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
  }) {
    const pipePsi = params.trainPipePressurePsi ?? 70;
    const carMass = params.carMassTonnes ?? 35;
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

    return {
      trainPipePressurePsi: pipePsi,
      auxReservoirPressurePsi: auxPsi,
      brakeCylinderPressurePsi: cylPsi,
      shoeClampingForceKn,
      stoppingDistanceM,
      valveState: isEmergency ? "EMERGENCY" : isService ? "SERVICE" : "RELEASE",
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
  stepMaximMachineGun(params: {
    firingRateRpm?: number;
    waterJacketLiters?: number;
    recoilStrokeMm?: number;
  }) {
    const rpm = params.firingRateRpm ?? 600;
    const water = params.waterJacketLiters ?? 4.0;
    const stroke = params.recoilStrokeMm ?? 19;
    const bulletMassKg = 0.014;
    const bulletVelMps = 740;
    const recoilMassKg = 3.2;
    const recoilVelocityMps = Number(((bulletMassKg * bulletVelMps) / recoilMassKg).toFixed(2));
    const recoilMomentumNs = Number((recoilMassKg * recoilVelocityMps).toFixed(2));
    const toggleUnlockForceN = Math.round(180 * (19 / Math.max(5, stroke)));
    const heatGeneratedWatts = Math.round((rpm / 60) * 45 * 1000 * 0.28);
    const waterEvapRateGs = Number(((heatGeneratedWatts / 2260) * (water > 0 ? 1 : 0)).toFixed(2));
    const barrelTempC = water > 0.5 ? 100 : Math.min(450, Math.round(100 + (rpm / 600) * 280));

    return {
      recoilVelocityMps,
      recoilMomentumNs,
      toggleUnlockForceN,
      waterEvapRateGs,
      barrelTempC,
    };
  },

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
      dist > hyperfocalM ? 999 : Number(((hyperfocalM * dist) / (hyperfocalM - dist)).toFixed(2));
    const ev = Number(Math.log2(n ** 2 / t).toFixed(2));

    return {
      hyperfocalM,
      dofNearM,
      dofFarM,
      exposureValueEv: ev,
      isInFocus: dist >= dofNearM && (dofFarM === 999 || dist <= dofFarM),
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
  }) {
    const r = params.compressionRatio ?? 18;
    const pBlast = params.blastAirPressureBar ?? 65;
    const rc = params.cutoffRatio ?? 1.6;
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

    return {
      tCompressionC,
      pCompBar,
      idealEfficiencyPct,
      brakeEfficiencyPct,
      isAutoIgnition,
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
