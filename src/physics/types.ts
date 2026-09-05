/**
 * FrankenSim Multi-Domain Computational Physics Engine Types
 *
 * Provides typed SI telemetry, state vectors, and refusal boundaries
 * across all 22 classic patent simulations.
 */

export type PhysicsDomain =
  | "aerodynamics_mbd"
  | "electromagnetics_flux"
  | "semiconductor_microarch"
  | "semiconductor_carrier"
  | "thermodynamics_transport"
  | "thermo_fluid"
  | "nuclear_kinetics"
  | "continuum_polymers"
  | "continuum_elasticity"
  | "materials_kinetics"
  | "optics_waves"
  | "solid_mechanics"
  /**
   * A deterministic, source-bounded command-decision topology. It carries no
   * inferred material, electrical, kinematic, or energy law.
   */
  | "source_bounded_command_classification";

export interface RefusalBoundary {
  isRefused: boolean;
  reason?: string;
  divergenceMetric?: number;
}

// 1. Aerodynamics & 6-DoF Multi-Body Dynamics
export interface AerodynamicsState {
  airspeedMps: number; // m/s
  altitudeMeters: number; // m
  angleOfAttackRad: number; // alpha (rad)
  sideslipRad: number; // beta (rad)
  pitchRateRps: number; // q (rad/s)
  rollRateRps: number; // p (rad/s)
  yawRateRps: number; // r (rad/s)
  liftNewtons: number; // N
  inducedDragNewtons: number; // N
  parasiticDragNewtons: number; // N
  thrustNewtons: number; // N
  elevatorDeflectionDeg: number;
  rudderDeflectionDeg: number;
  wingWarpDeflectionDeg: number;
}

// 2. Electromagnetics & Resonant LC Oscillators
export interface ElectromagneticsState {
  frequencyHz: number; // Hz
  magneticFluxDensityTesla: number; // T
  electricFieldVpm: number; // V/m
  phaseAngleRad: number; // rad
  inductanceHenry: number; // H
  capacitanceFarad: number; // F
  currentAmperes: number; // A
  voltageVolts: number; // V
  powerFactor: number; // cos(phi)
  efficiencyPct: number; // %
  synchronousRpm: number;
  slipFraction: number;
  rotorRpm: number;
  shaftPowerWatts: number;
  electricalInputWatts: number;
}

// 3. Solid-State, CMOS & Microarchitecture
export interface SemiconductorState {
  biasVoltageVolts: number; // V
  currentGainAlpha?: number; // alpha = dIc / dIe
  holeDiffusionCoefficientCm2ps: number; // cm^2/s
  chargeTransferEfficiencyPct: number; // % (CTE)
  clockPeriodNs: number; // ns
  busBandwidthMbps: number; // MB/s
  electronVelocityMps: number; // m/s
  relativisticFractionC: number; // % c
  voltageGain: number;
  powerGainDb: number;
  collectorCurrentMa: number;
  holeDriftSpeed?: number;
  gapStudioUnits?: number;
  pointGapSvgPx?: number;
}

// 4. Thermodynamics, Heat & Phase Transport
export interface ThermodynamicsState {
  temperatureCelsius: number; // °C
  temperatureKelvin: number; // K
  pressureAtm: number; // atm
  partialPressureButaneAtm: number; // atm
  heatInputWatts: number; // W
  coolingPowerWatts: number; // W
  coefficientOfPerformance: number; // COP
  blackbodyRadiantPowerWatts: number; // W (Stefan-Boltzmann)
  fluidFlowVelocityMps: number; // m/s
}

// 5. Nuclear Criticality & Delayed Neutron Kinetics
export interface NuclearKineticsState {
  kEffective: number; // k_eff
  reactivityDollars: number; // $, or 0 when the source boundary refuses it
  thermalNeutronFluxNPerCm2S: number; // n/(cm^2*s)
  delayedNeutronFractionBeta: number; // beta
  precursorConcentrationGroup1to6: number[]; // empty when no six-group fit is supported
  delayedNeutronMeanDelaySeconds: number;
  quantitativeTransientAvailable: boolean;
  reactorPeriodSeconds: number; // T (s), or 0 when unavailable
  thermalPowerWatts: number; // W
  controlRodInsertionFraction: number;
  geigerIntervalMs: number;
  geigerIntervalS: number;
  thermalFluxE7: number;
  neutronDisplaySpeed: number; // studio units/s, never physical neutron velocity
  rodStudioX: number;
  fuelGlowIntensity: number;
  schematicRodY: number;
  latticeRows: number;
  latticeCols: number;
  latticeOriginX: number;
  latticeOriginY: number;
  latticePitchX: number;
  latticePitchY: number;
  latticeCellPadX: number;
  latticeCellPadY: number;
  latticeCellW: number;
  latticeCellH: number;
  latticeSlugR: number;
  schematicSlugOriginX: number;
  schematicSlugOriginY: number;
  schematicSlugPitchX: number;
  schematicSlugPitchY: number;
  schematicSlugCols: number;
  schematicSlugRows: number;
  schematicSlugR: number;
  schematicGridXs: number[];
  schematicGridYs: number[];
  schematicCoreX0: number;
  schematicCoreX1: number;
  schematicCoreY0: number;
  schematicCoreY1: number;
  schematicCoreW: number;
  schematicCoreH: number;
  schematicRodX: number;
  schematicRodW: number;
  schematicRodH: number;
  /** Claim 1 graphite/natural-uranium geometric lattice is visibly present. */
  claim1PathActive: boolean;
  /** Fixed natural-uranium teaching reference; not an enrichment control. */
  naturalUraniumU235Percent: number;
  /** Visitor-declared qualitative purity input. */
  moderatorPurityPercent: number;
  /** Explicit limit on what the source licenses this state to predict. */
  sourceBoundary: string;
}

// 6. Continuum Mechanics, Polymers & Mechanisms
export interface ContinuumState {
  tensileStressMpa: number; // MPa
  tensileStrainPct: number; // %
  elasticModulusGpa: number; // GPa
  crossLinkDensityMolesPerCm3: number | null; // mol/cm^3; null when not calibrated
  relativeCrossLinkDensity?: number; // dimensionless teaching-model factor
  tensileStressMeasure?: "nominal" | "cauchy";
  strainEnergyDensityJPerM3?: number; // per undeformed volume
  stitchFrequencyHz: number; // Hz
  feedVelocityMmPs: number; // mm/s
  buoyancyLiftForceKiloNewtons: number; // kN
}

// 7. Rigid Machines & Mechanisms (shared poses on the transport tape)
export interface MachineState {
  poseXMeters: number;
  poseYMeters: number;
  headingRad: number;
  modeLabel: string;
  wheelSpeedMps: number;
  /** Integrated wheel phase from the shared fixed-step tape (rad). */
  wheelRollAngleRad?: number;
  /** Integrated ground-path distance from the shared fixed-step tape (m). */
  travelMeters?: number;
}

/** Television-raster/game state carried by the shared fixed-step tape. */
export interface VideoElectronicsState {
  ballX: number;
  ballY: number;
  ballVx: number;
  ballVy: number;
  player1X: number;
  player1Y: number;
  player2X: number;
  player2Y: number;
  scorePlayer1: number;
  scorePlayer2: number;
  targetHitCount: number;
  targetVisible: boolean;
  coincidenceActive: boolean;
  lightGunCoincidence: boolean;
  horizontalSyncHz: number;
  verticalFieldHz: number;
  rfCarrierMHz: number;
}

/** Coaxial-network state carried by the shared fixed-step tape. */
export interface NetworkElectrodynamicsState {
  simTimeSec: number;
  rngSeed: number;
  rngCounter: number;
  station1State: string;
  station2State: string;
  station1BackoffSlot: number;
  station2BackoffSlot: number;
  station1BackoffRemainingSec: number;
  station2BackoffRemainingSec: number;
  station1JamRemainingSec: number;
  station2JamRemainingSec: number;
  station1InterframeGapRemainingSec: number;
  station2InterframeGapRemainingSec: number;
  station1CarrierTailRemainingSec: number;
  station2CarrierTailRemainingSec: number;
  station1PacketProgressSec: number;
  station2PacketProgressSec: number;
  packetSuccessCount: number;
  totalCollisionCount: number;
  lastCollisionTimeSec: number;
  triggerCollisionLatched: boolean;
  manchesterClockPhaseRad: number;
  busVoltageVolts: number;
  collisionDetected: boolean;
  collisionDisplayActive: boolean;
  carrierSensed: boolean;
  throughputMbps: number;
  channelEfficiencyPct: number;
}

/** Coherent electron-beam raster state carried by the shared fixed-step tape. */
export interface ElectronOpticsRasterState {
  simTimeSec: number;
  scanLines: number;
  rasterLineIndex: number;
  rasterXPercent: number;
  rasterYPercent: number;
  beamFraction: number;
  horizontalDeflectionUnits: number;
  verticalDeflectionUnits: number;
  inHorizontalRetrace: boolean;
}

export interface UniversalPatentPhysicsTelemetry {
  patentId: string;
  domain: PhysicsDomain;
  timestampMs: number;
  timeStepDt: number;
  refusal: RefusalBoundary;
  aero?: AerodynamicsState;
  em?: ElectromagneticsState;
  semi?: SemiconductorState;
  thermo?: ThermodynamicsState;
  nuclear?: NuclearKineticsState;
  continuum?: ContinuumState;
  machine?: MachineState;
  video?: VideoElectronicsState;
  network?: NetworkElectrodynamicsState;
  raster?: ElectronOpticsRasterState;
}
