/**
 * Source-bounded modern teaching scenario for US 2,318,259, Direct-Lift Aircraft.
 *
 * The grant supplies the mechanical relationships: collective pitch is positively
 * linked to engine power, a movable pitch-control member produces collective and
 * cyclic feathering, and a variable-pitch auxiliary rotor controls yaw. It does
 * not supply the dimensions, mass, rotor speeds, aerodynamic coefficients, force
 * calibration, inertia, or power data needed for historical SI reconstruction.
 * The dynamics below therefore apply real momentum/force/moment laws to one
 * explicitly normalized modern scenario; none of its numerical assumptions are
 * measurements printed by US 2,318,259.
 */

export interface SikorskyHelicopterControls {
  collectivePitchDeg: number; // 2..16 degrees (vertical ascent / descent)
  cyclicPitchForwardDeg: number; // -10..+10 degrees (fore/aft longitudinal tilt)
  cyclicRollRightDeg: number; // -10..+10 degrees (lateral roll tilt)
  tailRotorPedalPercent: number; // -100..+100% (yaw rudder pedals)
  engineThrottlePercent: number; // 0..100% (engine throttle setting)
  engineRunning: number; // 1 = running, 0 = engine off (autorotation)
  /** Claim-topology probe: 1 keeps the positive pitch/power linkage, 0 removes it. */
  collectiveThrottleLinked: number;
  /** Claim-topology probe: 1 drives the auxiliary rotor, 0 removes its anti-torque action. */
  auxiliaryRotorEnabled: number;
}

export interface SikorskyHelicopterState {
  timeSec: number;
  rotorRpm: number;
  rotorPhaseRad: number;
  tailRotorRpm: number;
  tailRotorPhaseRad: number;
  altitudeMeters: number;
  verticalVelocityMs: number;
  forwardVelocityMs: number;
  lateralVelocityMs: number;
  yawAngleDeg: number;
  yawRateDegPerSec: number;
  pitchAngleDeg: number;
  rollAngleDeg: number;
  clutchEngaged: boolean;
}

export interface SikorskyHelicopterMetrics {
  mainRotorThrustNewtons: number;
  mainRotorTorqueNm: number;
  mainRotorPowerWatts: number;
  tailRotorThrustNewtons: number;
  tailRotorTorqueNm: number;
  tailRotorPowerWatts: number;
  netYawMomentNm: number;
  effectiveThrottlePercent: number;
  inducedVelocityMs: number;
  tipSpeedMs: number;
  tipMachNumber: number;
  rotorAngularVelocityRadPerSec: number;
  totalLiftNewtons: number;
  aircraftWeightNewtons: number;
  climbRateMs: number;
  forwardSpeedKnots: number;
  isHovering: boolean;
  isInGroundEffect: boolean;
  autorotationState: boolean;
}

export const DEFAULT_SIKORSKY_CONTROLS: SikorskyHelicopterControls = {
  // Calibrated for a bounded multi-second hover in this explicitly modern
  // teaching scenario; it is not a historical VS-300 setting.
  collectivePitchDeg: 6.8,
  cyclicPitchForwardDeg: 0.0, // Level pitch
  cyclicRollRightDeg: 0.0, // Level roll
  tailRotorPedalPercent: 0.0, // Trim anti-torque pedals
  engineThrottlePercent: 85.0, // 85% nominal throttle
  engineRunning: 1, // Engine running
  collectiveThrottleLinked: 1,
  auxiliaryRotorEnabled: 1,
};

export const INITIAL_SIKORSKY_STATE: SikorskyHelicopterState = {
  timeSec: 0.0,
  rotorRpm: 260.0,
  rotorPhaseRad: 0.0,
  tailRotorRpm: 1300.0,
  tailRotorPhaseRad: 0.0,
  altitudeMeters: 5.0,
  verticalVelocityMs: 0.0,
  forwardVelocityMs: 0.0,
  lateralVelocityMs: 0.0,
  yawAngleDeg: 0.0,
  yawRateDegPerSec: 0.0,
  pitchAngleDeg: 0.0,
  rollAngleDeg: 0.0,
  clutchEngaged: true,
};

export const SIKORSKY_SOURCE_BOUNDARY = {
  kind: "normalized-modern-scenario",
  isRefused: true,
  reason:
    "US 2,318,259 discloses rotor, pitch-linkage, throttle-correlation, and auxiliary-rotor topology, but no aircraft mass, rotor or boom dimensions, operating RPM, gear ratio, aerodynamic coefficients, inertia, force calibration, or power budget. Quantitative outputs are a normalized modern teaching scenario, not historical VS-300 measurements.",
  sourceDiscloses: [
    "positive collective-pitch to engine-power linkage",
    "collective and cyclic motion of the main-rotor pitch-control member",
    "variable-pitch auxiliary rotor for directional control",
  ],
} as const;

/** Modern scenario constants. These values are not printed by US 2,318,259. */
export const SIKORSKY_SCENARIO = {
  airDensityKgM3: 1.225,
  speedOfSoundMs: 340.29,
  gravityMs2: 9.80665,
  aircraftMassKg: 520,
  mainRotorRadiusM: 4.27,
  tailBoomLengthM: 4.8,
  tailRotorRadiusM: 0.65,
  tailGearRatio: 5,
  yawMomentOfInertiaKgM2: 450,
  throttleCorrelatorGainPctPerDeg: 4.5,
  collectiveLoadRpmPerDeg: 3.6,
} as const;

const MAIN_ROTOR_DISK_AREA = Math.PI * SIKORSKY_SCENARIO.mainRotorRadiusM ** 2;
const TAIL_ROTOR_DISK_AREA = Math.PI * SIKORSKY_SCENARIO.tailRotorRadiusM ** 2;

function finiteNumber(value: unknown, fallback: number): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value: unknown, fallback: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, finiteNumber(value, fallback)));
}

function binaryFlag(value: unknown, fallback: number): number {
  if (value === false || value === 0 || value === "0" || value === "false") return 0;
  if (value === true || value === 1 || value === "1" || value === "true") return 1;
  return fallback;
}

export function readSikorskyControls(
  raw: Record<string, number | boolean | string | undefined>,
): SikorskyHelicopterControls {
  return {
    collectivePitchDeg: clamp(
      raw.collectivePitchDeg,
      DEFAULT_SIKORSKY_CONTROLS.collectivePitchDeg,
      2,
      16,
    ),
    cyclicPitchForwardDeg: clamp(
      raw.cyclicPitchForwardDeg,
      DEFAULT_SIKORSKY_CONTROLS.cyclicPitchForwardDeg,
      -10,
      10,
    ),
    cyclicRollRightDeg: clamp(
      raw.cyclicRollRightDeg,
      DEFAULT_SIKORSKY_CONTROLS.cyclicRollRightDeg,
      -10,
      10,
    ),
    tailRotorPedalPercent: clamp(
      raw.tailRotorPedalPercent,
      DEFAULT_SIKORSKY_CONTROLS.tailRotorPedalPercent,
      -100,
      100,
    ),
    engineThrottlePercent: clamp(
      raw.engineThrottlePercent,
      DEFAULT_SIKORSKY_CONTROLS.engineThrottlePercent,
      0,
      100,
    ),
    engineRunning: binaryFlag(raw.engineRunning, DEFAULT_SIKORSKY_CONTROLS.engineRunning),
    collectiveThrottleLinked: binaryFlag(
      raw.collectiveThrottleLinked,
      DEFAULT_SIKORSKY_CONTROLS.collectiveThrottleLinked,
    ),
    auxiliaryRotorEnabled: binaryFlag(
      raw.auxiliaryRotorEnabled,
      DEFAULT_SIKORSKY_CONTROLS.auxiliaryRotorEnabled,
    ),
  };
}

export function stepSikorskyHelicopterSi(
  prevState: SikorskyHelicopterState,
  controls: SikorskyHelicopterControls,
  dt: number,
): { state: SikorskyHelicopterState; metrics: SikorskyHelicopterMetrics } {
  const safeDt = clamp(dt, 1 / 60, 0.001, 0.1);
  const previousRotorRpm = Math.max(0, finiteNumber(prevState.rotorRpm, 260));
  const previousAltitude = Math.max(0, finiteNumber(prevState.altitudeMeters, 5));
  const previousVerticalVelocity = finiteNumber(prevState.verticalVelocityMs, 0);
  const previousForwardVelocity = finiteNumber(prevState.forwardVelocityMs, 0);
  const previousLateralVelocity = finiteNumber(prevState.lateralVelocityMs, 0);
  const previousYawRate = finiteNumber(prevState.yawRateDegPerSec, 0);
  const previousYawAngle = finiteNumber(prevState.yawAngleDeg, 0);
  const previousPitchAngle = finiteNumber(prevState.pitchAngleDeg, 0);
  const previousRollAngle = finiteNumber(prevState.rollAngleDeg, 0);
  const previousRotorPhase = finiteNumber(prevState.rotorPhaseRad, 0);
  const previousTailPhase = finiteNumber(prevState.tailRotorPhaseRad, 0);

  // 1. Correlated Engine Throttle (Claim 1 & Claim 9)
  const collectiveDelta = controls.collectivePitchDeg - 5.0; // Nominal baseline at 5 deg
  const correlatedThrottle = clamp(
    controls.engineThrottlePercent +
      (controls.collectiveThrottleLinked
        ? collectiveDelta * SIKORSKY_SCENARIO.throttleCorrelatorGainPctPerDeg
        : 0),
    controls.engineThrottlePercent,
    0,
    100,
  );
  const effectiveThrottle = controls.engineRunning ? correlatedThrottle : 0.0;

  // 2. Engine & Rotor RPM Dynamics
  const collectiveLoadPenaltyRpm =
    Math.max(0, collectiveDelta) * SIKORSKY_SCENARIO.collectiveLoadRpmPerDeg;
  const targetRpm = controls.engineRunning
    ? Math.max(0, 200 + (effectiveThrottle / 100) * 80 - collectiveLoadPenaltyRpm)
    : 0;
  let currentRpm = previousRotorRpm;
  let clutchEngaged = prevState.clutchEngaged !== false;

  if (controls.engineRunning) {
    // Engine drives rotor up
    clutchEngaged = true;
    currentRpm += (targetRpm - currentRpm) * Math.min(1.0, safeDt * 2.5);
  } else {
    // Engine off -> Sprag clutch overruns (Autorotation)
    clutchEngaged = false;
    // In descent with negative vertical velocity, upward airflow maintains autorotation RPM
    const upwardFlow = -previousVerticalVelocity;
    const autorotationEquilibriumRpm = Math.max(160.0, Math.min(250.0, 180.0 + upwardFlow * 8.0));
    if (upwardFlow > 2.0 && controls.collectivePitchDeg <= 5.0) {
      currentRpm += (autorotationEquilibriumRpm - currentRpm) * Math.min(1.0, safeDt * 1.5);
    } else {
      currentRpm = Math.max(0.0, currentRpm - safeDt * 15.0); // Rotor decay
    }
  }

  const omegaRadSec = (currentRpm * 2.0 * Math.PI) / 60.0;
  const tailRpm = controls.auxiliaryRotorEnabled ? currentRpm * SIKORSKY_SCENARIO.tailGearRatio : 0;
  const tailOmegaRadSec = (tailRpm * 2.0 * Math.PI) / 60.0;

  // 3. Main Rotor Aerodynamics (Momentum & Blade Element Theory)
  const tipSpeed = omegaRadSec * SIKORSKY_SCENARIO.mainRotorRadiusM;
  const tipMach = tipSpeed / SIKORSKY_SCENARIO.speedOfSoundMs;

  // Dimensionless thrust coefficient: C_T = (sigma * a / 2) * (theta / 3 - lambda / 2)
  const cT = 0.001 + 0.00055 * controls.collectivePitchDeg;
  let thrustN =
    cT * SIKORSKY_SCENARIO.airDensityKgM3 * MAIN_ROTOR_DISK_AREA * (tipSpeed * tipSpeed);

  // Ground effect multiplier (IGE): increases thrust when altitude < 1.0 rotor diameter (8.5m)
  const groundRatio = Math.max(0.2, previousAltitude / (2 * SIKORSKY_SCENARIO.mainRotorRadiusM));
  const igeMultiplier = groundRatio < 1.0 ? 1.0 + 0.18 * (1.0 - groundRatio) : 1.0;
  thrustN *= igeMultiplier;

  // Induced velocity (Rankine-Froude): v_i = sqrt(T / (2 * rho * A))
  const inducedVelocity = Math.sqrt(
    Math.max(0, thrustN) / (2 * SIKORSKY_SCENARIO.airDensityKgM3 * MAIN_ROTOR_DISK_AREA),
  );

  // Main Rotor Torque: Q = P_aero / omega = (T * v_i + P_profile) / omega
  // Profile power: C_P_profile = sigma * C_d0 / 8 ~ 0.000075
  const profilePower =
    0.000075 * SIKORSKY_SCENARIO.airDensityKgM3 * MAIN_ROTOR_DISK_AREA * tipSpeed ** 3;
  const inducedPower = thrustN * inducedVelocity;
  const mainRotorPower = (inducedPower + profilePower) * (currentRpm / 260.0);
  const mainRotorTorqueNm = omegaRadSec > 0.1 ? mainRotorPower / omegaRadSec : 0.0;

  // 4. Tail Rotor Aerodynamics & Anti-Torque Equilibrium (Claim 2 & Claim 3)
  // Baseline trim pitch cancels main rotor torque at hover: T_tail_trim = Q_main / L_boom
  const trimTailThrustNeeded = mainRotorTorqueNm / SIKORSKY_SCENARIO.tailBoomLengthM;
  // Pedal deflection changes tail rotor pitch: ±100% maps to ±400 N
  const pedalThrustDelta = (controls.tailRotorPedalPercent / 100.0) * 450.0;
  const tailRotorThrustN = controls.auxiliaryRotorEnabled
    ? Math.max(0, trimTailThrustNeeded + pedalThrustDelta)
    : 0;
  const tailTipSpeed = tailOmegaRadSec * SIKORSKY_SCENARIO.tailRotorRadiusM;
  const tailInducedVelocity = Math.sqrt(
    Math.max(0, tailRotorThrustN) / (2 * SIKORSKY_SCENARIO.airDensityKgM3 * TAIL_ROTOR_DISK_AREA),
  );
  const tailRotorPower =
    tailRotorThrustN * tailInducedVelocity + 0.01 * tailTipSpeed * tailTipSpeed;
  const tailRotorTorqueNm = tailOmegaRadSec > 0.1 ? tailRotorPower / tailOmegaRadSec : 0.0;

  // Net Yaw Moment: M_yaw = Q_main - T_tail * L_boom
  const antiTorqueMomentNm = tailRotorThrustN * SIKORSKY_SCENARIO.tailBoomLengthM;
  const netYawMomentNm = mainRotorTorqueNm - antiTorqueMomentNm;

  // 5. Flight Kinematics & Attitude Integration
  // Yaw dynamics
  const yawAccelDegSec2 =
    (netYawMomentNm / SIKORSKY_SCENARIO.yawMomentOfInertiaKgM2) * (180 / Math.PI);
  const yawRate = (previousYawRate + yawAccelDegSec2 * safeDt) * 0.92;
  let yawAngle = (previousYawAngle + yawRate * safeDt) % 360;
  if (yawAngle < 0) yawAngle += 360.0;

  // Pitch & Roll tilt from cyclic swashplate
  const targetPitchAngle = -controls.cyclicPitchForwardDeg * 1.2; // Forward stick pitches nose down
  const targetRollAngle = controls.cyclicRollRightDeg * 1.2; // Right stick rolls right
  const pitchAngle =
    previousPitchAngle + (targetPitchAngle - previousPitchAngle) * Math.min(1, safeDt * 4);
  const rollAngle =
    previousRollAngle + (targetRollAngle - previousRollAngle) * Math.min(1, safeDt * 4);

  // Vertical dynamics: F_net = T * cos(pitch) * cos(roll) - Weight
  const verticalThrust =
    thrustN * Math.cos((pitchAngle * Math.PI) / 180.0) * Math.cos((rollAngle * Math.PI) / 180.0);
  const aircraftWeightN = SIKORSKY_SCENARIO.aircraftMassKg * SIKORSKY_SCENARIO.gravityMs2;
  const verticalDrag =
    0.5 *
    SIKORSKY_SCENARIO.airDensityKgM3 *
    1.8 *
    previousVerticalVelocity *
    Math.abs(previousVerticalVelocity);
  const netVerticalForce = verticalThrust - aircraftWeightN - verticalDrag;
  const verticalAccel = netVerticalForce / SIKORSKY_SCENARIO.aircraftMassKg;
  let verticalVel = previousVerticalVelocity + verticalAccel * safeDt;
  let altitude = previousAltitude + verticalVel * safeDt;

  // Ground collision clamp
  if (altitude <= 0.0) {
    altitude = 0.0;
    verticalVel = Math.max(0.0, verticalVel);
  }

  // Forward & Lateral velocities
  const pitchRad = (pitchAngle * Math.PI) / 180.0;
  const forwardThrust = -thrustN * Math.sin(pitchRad); // Pitch down gives positive forward thrust
  const forwardDrag =
    0.5 *
    SIKORSKY_SCENARIO.airDensityKgM3 *
    1.2 *
    previousForwardVelocity *
    Math.abs(previousForwardVelocity);
  const forwardAccel = (forwardThrust - forwardDrag) / SIKORSKY_SCENARIO.aircraftMassKg;
  const forwardVel = Math.max(-80, Math.min(80, previousForwardVelocity + forwardAccel * safeDt));

  const rollRad = (rollAngle * Math.PI) / 180.0;
  const lateralThrust = thrustN * Math.sin(rollRad);
  const lateralDrag =
    0.5 *
    SIKORSKY_SCENARIO.airDensityKgM3 *
    1.5 *
    previousLateralVelocity *
    Math.abs(previousLateralVelocity);
  const lateralAccel = (lateralThrust - lateralDrag) / SIKORSKY_SCENARIO.aircraftMassKg;
  const lateralVel = Math.max(-60, Math.min(60, previousLateralVelocity + lateralAccel * safeDt));

  // Phase updates
  const rotorPhase = (previousRotorPhase + omegaRadSec * safeDt) % (2 * Math.PI);
  const tailPhase = (previousTailPhase + tailOmegaRadSec * safeDt) % (2 * Math.PI);

  const isHovering = altitude > 0.5 && Math.abs(forwardVel) < 1.5 && Math.abs(verticalVel) < 0.5;
  const isInGroundEffect = altitude < 2 * SIKORSKY_SCENARIO.mainRotorRadiusM;
  const autorotationState = !controls.engineRunning && currentRpm > 100.0;

  const nextState: SikorskyHelicopterState = {
    timeSec: Math.max(0, finiteNumber(prevState.timeSec, 0)) + safeDt,
    rotorRpm: currentRpm,
    rotorPhaseRad: rotorPhase,
    tailRotorRpm: tailRpm,
    tailRotorPhaseRad: tailPhase,
    altitudeMeters: altitude,
    verticalVelocityMs: verticalVel,
    forwardVelocityMs: forwardVel,
    lateralVelocityMs: lateralVel,
    yawAngleDeg: yawAngle,
    yawRateDegPerSec: yawRate,
    pitchAngleDeg: pitchAngle,
    rollAngleDeg: rollAngle,
    clutchEngaged,
  };

  const metrics: SikorskyHelicopterMetrics = {
    mainRotorThrustNewtons: thrustN,
    mainRotorTorqueNm,
    mainRotorPowerWatts: mainRotorPower,
    tailRotorThrustNewtons: tailRotorThrustN,
    tailRotorTorqueNm,
    tailRotorPowerWatts: tailRotorPower,
    netYawMomentNm,
    effectiveThrottlePercent: effectiveThrottle,
    inducedVelocityMs: inducedVelocity,
    tipSpeedMs: tipSpeed,
    tipMachNumber: tipMach,
    rotorAngularVelocityRadPerSec: omegaRadSec,
    totalLiftNewtons: verticalThrust,
    aircraftWeightNewtons: aircraftWeightN,
    climbRateMs: verticalVel,
    forwardSpeedKnots: forwardVel * 1.94384, // m/s to knots
    isHovering,
    isInGroundEffect,
    autorotationState,
  };

  return { state: nextState, metrics };
}
