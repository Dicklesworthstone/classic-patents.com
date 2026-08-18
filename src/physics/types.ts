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
  | "solid_mechanics";

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
  currentGainAlpha: number; // alpha = dIc / dIe
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
  reactivityDollars: number; // $
  thermalNeutronFluxNPerCm2S: number; // n/(cm^2*s)
  delayedNeutronFractionBeta: number; // beta = 0.0065
  precursorConcentrationGroup1to6: number[];
  reactorPeriodSeconds: number; // T (s)
  thermalPowerWatts: number; // W
  controlRodInsertionFraction: number;
  geigerIntervalMs: number;
  neutronDisplaySpeed: number;
  rodStudioY: number;
  fuelGlowIntensity: number;
}

// 6. Continuum Mechanics, Polymers & Mechanisms
export interface ContinuumState {
  tensileStressMpa: number; // MPa
  tensileStrainPct: number; // %
  elasticModulusGpa: number; // GPa
  crossLinkDensityMolesPerCm3: number; // mol/cm^3
  stitchFrequencyHz: number; // Hz
  feedVelocityMmPs: number; // mm/s
  buoyancyLiftForceKiloNewtons: number; // kN
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
}
