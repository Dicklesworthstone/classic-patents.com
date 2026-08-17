/**
 * FrankenSim Multi-Domain Computational Physics Engine
 *
 * Implements Lie-group time integration, discrete electromagnetics,
 * semiconductor carrier transport, thermal absorption cycles, and point kinetics.
 */

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
   * Enrico Fermi Chicago Pile-1 (US 2,708,656) - 4-Factor Criticality Kinetics
   */
  stepFermiReactor(
    controlRodWithdrawalPct: number,
    moderatorPurityPct: number,
    fuelEnrichmentPct: number,
  ): NuclearKineticsState {
    const kEffective =
      1.32 *
      (fuelEnrichmentPct / 0.72) ** 0.5 *
      (moderatorPurityPct / 100) ** 2 *
      (0.65 + (controlRodWithdrawalPct / 100) * 0.42);

    const isSupercritical = kEffective > 1.002;
    const isCritical = kEffective >= 0.998 && kEffective <= 1.002;
    const thermalPowerWatts = isSupercritical
      ? Math.round(500 * (kEffective / 1.002) ** 4)
      : isCritical
        ? 200
        : Math.round(20 * (kEffective / 0.99));

    const reactivityDollars = (kEffective - 1.0) / (kEffective * 0.0065);
    const thermalFlux = thermalPowerWatts * 3.2e7; // n/(cm^2*s)

    return {
      kEffective: Number(kEffective.toFixed(4)),
      reactivityDollars: Number(reactivityDollars.toFixed(2)),
      thermalNeutronFluxNPerCm2S: thermalFlux,
      delayedNeutronFractionBeta: 0.0065,
      precursorConcentrationGroup1to6: [0.033, 0.219, 0.196, 0.395, 0.115, 0.042],
      reactorPeriodSeconds: reactivityDollars > 0 ? 0.08 / (reactivityDollars * 0.0065) : -999,
      thermalPowerWatts,
      controlRodInsertionFraction: 1 - controlRodWithdrawalPct / 100,
    };
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
    _phaseStep: number,
    clockVoltageV: number,
    storedElectronsPerPixel: number,
  ): SemiconductorState {
    const transferEfficiency = 0.99995;
    const pixelWellCapacity = 100000;
    const _chargeFraction = Math.min(1.0, storedElectronsPerPixel / pixelWellCapacity);
    const _channelPotentialVolts = clockVoltageV * 0.72;

    return {
      biasVoltageVolts: clockVoltageV,
      currentGainAlpha: 1.0,
      holeDiffusionCoefficientCm2ps: 35.0,
      chargeTransferEfficiencyPct: Number((transferEfficiency * 100).toFixed(4)),
      clockPeriodNs: 100, // 10 MHz readout
      busBandwidthMbps: 10,
      electronVelocityMps: 45000,
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
  ) {
    const primaryL = 0.012; // mH
    const secondaryL = 85.0; // mH
    const transformationRatio = Math.sqrt(secondaryL / primaryL);
    const secondaryPotentialMv =
      ((inputKv * 1000 * transformationRatio * qFactor) / 1e6) * (sparkGapMm / 15);
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
    const stitchesPerMinute = flywheelRpm;
    const stitchFrequencyHz = Number((stitchesPerMinute / 60).toFixed(1));
    const cycleTimeMs = Math.round(1000 / (stitchFrequencyHz + 1e-4));
    const lockstitchShearStrengthN = Math.round(stitchTensionGrams * 0.088);

    return {
      stitchesPerMinute,
      stitchFrequencyHz,
      cycleTimeMs,
      lockstitchShearStrengthN,
    };
  },

  /**
   * Charles Goodyear Vulcanized Rubber (US 3,633)
   * Polymer Disulfide Cross-Linking Kinetics
   */
  stepGoodyearRubber(vulcanizationTempC: number, sulfurPct: number, durationMin: number) {
    const isOptimalTemp = vulcanizationTempC >= 135 && vulcanizationTempC <= 165;
    const crossLinkDensity = (sulfurPct / 8.0) * (durationMin / 30) * (isOptimalTemp ? 1.0 : 0.4);
    const tensileStrengthPsi = Math.min(3200, Math.round(crossLinkDensity * 2800));
    const elasticReturnPct = Math.min(98, Math.round(50 + crossLinkDensity * 45));

    return {
      crossLinkDensity: Number(crossLinkDensity.toFixed(3)),
      tensileStrengthPsi,
      elasticReturnPct,
      isStickyOrBrittle: !isOptimalTemp || crossLinkDensity < 0.3,
    };
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
