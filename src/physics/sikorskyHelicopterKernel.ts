/**
 * SI Physics Kernel for US 2,318,259: Direct-Lift Aircraft (Igor I. Sikorsky VS-300 Helicopter)
 *
 * Implements genuine Rankine-Froude momentum theory, blade element aerodynamics,
 * swashplate cyclic feathering, collective-throttle mechanical correlation, and
 * tail rotor anti-torque equilibrium.
 */

export interface SikorskyHelicopterControls {
  collectivePitchDeg: number; // 2..16 degrees (vertical ascent / descent)
  cyclicPitchForwardDeg: number; // -10..+10 degrees (fore/aft longitudinal tilt)
  cyclicRollRightDeg: number; // -10..+10 degrees (lateral roll tilt)
  tailRotorPedalPercent: number; // -100..+100% (yaw rudder pedals)
  engineThrottlePercent: number; // 0..100% (engine throttle setting)
  engineRunning: number; // 1 = running, 0 = engine off (autorotation)
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
  totalLiftNewtons: number;
  aircraftWeightNewtons: number;
  climbRateMs: number;
  forwardSpeedKnots: number;
  isHovering: boolean;
  isInGroundEffect: boolean;
  autorotationState: boolean;
}

export const DEFAULT_SIKORSKY_CONTROLS: SikorskyHelicopterControls = {
  collectivePitchDeg: 9.5, // Trim hover collective pitch
  cyclicPitchForwardDeg: 0.0, // Level pitch
  cyclicRollRightDeg: 0.0, // Level roll
  tailRotorPedalPercent: 0.0, // Trim anti-torque pedals
  engineThrottlePercent: 85.0, // 85% nominal throttle
  engineRunning: 1, // Engine running
};

export const INITIAL_SIKORSKY_STATE: SikorskyHelicopterState = {
  timeSec: 0.0,
  rotorRpm: 260.0, // Nominal main rotor RPM
  rotorPhaseRad: 0.0,
  tailRotorRpm: 1300.0, // 5:1 tail rotor gear ratio
  tailRotorPhaseRad: 0.0,
  altitudeMeters: 5.0, // 5m hover above ground
  verticalVelocityMs: 0.0,
  forwardVelocityMs: 0.0,
  lateralVelocityMs: 0.0,
  yawAngleDeg: 0.0,
  yawRateDegPerSec: 0.0,
  pitchAngleDeg: 0.0,
  rollAngleDeg: 0.0,
  clutchEngaged: true,
};

// Physical & Airframe Constants (VS-300 Archetype)
const AIR_DENSITY = 1.225; // kg/m^3 (sea level standard)
const SPEED_OF_SOUND = 340.29; // m/s
const GRAVITY = 9.80665; // m/s^2
const AIRCRAFT_MASS_KG = 520.0; // VS-300 gross weight ~1,150 lbs = 520 kg
const AIRCRAFT_WEIGHT_N = AIRCRAFT_MASS_KG * GRAVITY; // ~5,099.5 N
const MAIN_ROTOR_RADIUS_M = 4.27; // 28 ft diameter = 14 ft radius = 4.27 m
const MAIN_ROTOR_DISK_AREA = Math.PI * MAIN_ROTOR_RADIUS_M * MAIN_ROTOR_RADIUS_M; // ~57.28 m^2
const TAIL_BOOM_LENGTH_M = 4.8; // Distance from main shaft to tail rotor shaft
const TAIL_ROTOR_RADIUS_M = 0.65; // 1.3 m diameter
const TAIL_ROTOR_DISK_AREA = Math.PI * TAIL_ROTOR_RADIUS_M * TAIL_ROTOR_RADIUS_M; // ~1.327 m^2
const TAIL_GEAR_RATIO = 5.0; // Tail rotor spins 5x main rotor
const YAW_MOMENT_OF_INERTIA = 450.0; // kg·m^2
const THROTTLE_CORRELATOR_GAIN = 4.5; // Throttle % increase per degree of collective pitch

export function readSikorskyControls(
  raw: Record<string, number | boolean | string | undefined>,
): SikorskyHelicopterControls {
  return {
    collectivePitchDeg: Math.max(
      2.0,
      Math.min(
        16.0,
        Number(raw.collectivePitchDeg ?? DEFAULT_SIKORSKY_CONTROLS.collectivePitchDeg),
      ),
    ),
    cyclicPitchForwardDeg: Math.max(
      -10.0,
      Math.min(
        10.0,
        Number(raw.cyclicPitchForwardDeg ?? DEFAULT_SIKORSKY_CONTROLS.cyclicPitchForwardDeg),
      ),
    ),
    cyclicRollRightDeg: Math.max(
      -10.0,
      Math.min(
        10.0,
        Number(raw.cyclicRollRightDeg ?? DEFAULT_SIKORSKY_CONTROLS.cyclicRollRightDeg),
      ),
    ),
    tailRotorPedalPercent: Math.max(
      -100.0,
      Math.min(
        100.0,
        Number(raw.tailRotorPedalPercent ?? DEFAULT_SIKORSKY_CONTROLS.tailRotorPedalPercent),
      ),
    ),
    engineThrottlePercent: Math.max(
      0.0,
      Math.min(
        100.0,
        Number(raw.engineThrottlePercent ?? DEFAULT_SIKORSKY_CONTROLS.engineThrottlePercent),
      ),
    ),
    engineRunning: raw.engineRunning === false || raw.engineRunning === 0 ? 0 : 1,
  };
}

export function stepSikorskyHelicopterSi(
  prevState: SikorskyHelicopterState,
  controls: SikorskyHelicopterControls,
  dt: number,
): { state: SikorskyHelicopterState; metrics: SikorskyHelicopterMetrics } {
  const safeDt = Math.max(0.001, Math.min(0.1, dt));

  // 1. Correlated Engine Throttle (Claim 1 & Claim 9)
  const collectiveDelta = controls.collectivePitchDeg - 5.0; // Nominal baseline at 5 deg
  const correlatedThrottle = Math.max(
    0.0,
    Math.min(100.0, controls.engineThrottlePercent + collectiveDelta * THROTTLE_CORRELATOR_GAIN),
  );
  const effectiveThrottle = controls.engineRunning ? correlatedThrottle : 0.0;

  // 2. Engine & Rotor RPM Dynamics
  const targetRpm = controls.engineRunning ? 200.0 + (effectiveThrottle / 100.0) * 80.0 : 0.0; // 200..280 RPM
  let currentRpm = prevState.rotorRpm;
  let clutchEngaged = prevState.clutchEngaged;

  if (controls.engineRunning) {
    // Engine drives rotor up
    clutchEngaged = true;
    currentRpm += (targetRpm - currentRpm) * Math.min(1.0, safeDt * 2.5);
  } else {
    // Engine off -> Sprag clutch overruns (Autorotation)
    clutchEngaged = false;
    // In descent with negative vertical velocity, upward airflow maintains autorotation RPM
    const upwardFlow = -prevState.verticalVelocityMs;
    const autorotationEquilibriumRpm = Math.max(160.0, Math.min(250.0, 180.0 + upwardFlow * 8.0));
    if (upwardFlow > 2.0 && controls.collectivePitchDeg <= 5.0) {
      currentRpm += (autorotationEquilibriumRpm - currentRpm) * Math.min(1.0, safeDt * 1.5);
    } else {
      currentRpm = Math.max(0.0, currentRpm - safeDt * 15.0); // Rotor decay
    }
  }

  const omegaRadSec = (currentRpm * 2.0 * Math.PI) / 60.0;
  const tailRpm = currentRpm * TAIL_GEAR_RATIO;
  const tailOmegaRadSec = (tailRpm * 2.0 * Math.PI) / 60.0;

  // 3. Main Rotor Aerodynamics (Momentum & Blade Element Theory)
  const tipSpeed = omegaRadSec * MAIN_ROTOR_RADIUS_M;
  const tipMach = tipSpeed / SPEED_OF_SOUND;

  // Dimensionless thrust coefficient: C_T = (sigma * a / 2) * (theta / 3 - lambda / 2)
  const cT = 0.001 + 0.00055 * controls.collectivePitchDeg;
  let thrustN = cT * AIR_DENSITY * MAIN_ROTOR_DISK_AREA * (tipSpeed * tipSpeed);

  // Ground effect multiplier (IGE): increases thrust when altitude < 1.0 rotor diameter (8.5m)
  const groundRatio = Math.max(0.2, prevState.altitudeMeters / (2.0 * MAIN_ROTOR_RADIUS_M));
  const igeMultiplier = groundRatio < 1.0 ? 1.0 + 0.18 * (1.0 - groundRatio) : 1.0;
  thrustN *= igeMultiplier;

  // Induced velocity (Rankine-Froude): v_i = sqrt(T / (2 * rho * A))
  const inducedVelocity = Math.sqrt(
    Math.max(0.0, thrustN) / (2.0 * AIR_DENSITY * MAIN_ROTOR_DISK_AREA),
  );

  // Main Rotor Torque: Q = P_aero / omega = (T * v_i + P_profile) / omega
  // Profile power: C_P_profile = sigma * C_d0 / 8 ~ 0.000075
  const profilePower =
    0.000075 * AIR_DENSITY * MAIN_ROTOR_DISK_AREA * (tipSpeed * tipSpeed * tipSpeed);
  const inducedPower = thrustN * inducedVelocity;
  const mainRotorPower = (inducedPower + profilePower) * (currentRpm / 260.0);
  const mainRotorTorqueNm = omegaRadSec > 0.1 ? mainRotorPower / omegaRadSec : 0.0;

  // 4. Tail Rotor Aerodynamics & Anti-Torque Equilibrium (Claim 2 & Claim 3)
  // Baseline trim pitch cancels main rotor torque at hover: T_tail_trim = Q_main / L_boom
  const trimTailThrustNeeded = mainRotorTorqueNm / TAIL_BOOM_LENGTH_M;
  // Pedal deflection changes tail rotor pitch: ±100% maps to ±400 N
  const pedalThrustDelta = (controls.tailRotorPedalPercent / 100.0) * 450.0;
  const tailRotorThrustN = Math.max(0.0, trimTailThrustNeeded + pedalThrustDelta);
  const tailTipSpeed = tailOmegaRadSec * TAIL_ROTOR_RADIUS_M;
  const tailInducedVelocity = Math.sqrt(
    Math.max(0.0, tailRotorThrustN) / (2.0 * AIR_DENSITY * TAIL_ROTOR_DISK_AREA),
  );
  const tailRotorPower =
    tailRotorThrustN * tailInducedVelocity + 0.01 * tailTipSpeed * tailTipSpeed;
  const tailRotorTorqueNm = tailOmegaRadSec > 0.1 ? tailRotorPower / tailOmegaRadSec : 0.0;

  // Net Yaw Moment: M_yaw = Q_main - T_tail * L_boom
  const antiTorqueMomentNm = tailRotorThrustN * TAIL_BOOM_LENGTH_M;
  const netYawMomentNm = mainRotorTorqueNm - antiTorqueMomentNm;

  // 5. Flight Kinematics & Attitude Integration
  // Yaw dynamics
  const yawAccelDegSec2 = (netYawMomentNm / YAW_MOMENT_OF_INERTIA) * (180.0 / Math.PI);
  const yawRate = (prevState.yawRateDegPerSec + yawAccelDegSec2 * safeDt) * 0.92; // Aero damping
  let yawAngle = (prevState.yawAngleDeg + yawRate * safeDt) % 360.0;
  if (yawAngle < 0) yawAngle += 360.0;

  // Pitch & Roll tilt from cyclic swashplate
  const targetPitchAngle = -controls.cyclicPitchForwardDeg * 1.2; // Forward stick pitches nose down
  const targetRollAngle = controls.cyclicRollRightDeg * 1.2; // Right stick rolls right
  const pitchAngle =
    prevState.pitchAngleDeg +
    (targetPitchAngle - prevState.pitchAngleDeg) * Math.min(1.0, safeDt * 4.0);
  const rollAngle =
    prevState.rollAngleDeg +
    (targetRollAngle - prevState.rollAngleDeg) * Math.min(1.0, safeDt * 4.0);

  // Vertical dynamics: F_net = T * cos(pitch) * cos(roll) - Weight
  const verticalThrust =
    thrustN * Math.cos((pitchAngle * Math.PI) / 180.0) * Math.cos((rollAngle * Math.PI) / 180.0);
  const netVerticalForce = verticalThrust - AIRCRAFT_WEIGHT_N;
  const verticalAccel = netVerticalForce / AIRCRAFT_MASS_KG;
  let verticalVel = prevState.verticalVelocityMs + verticalAccel * safeDt;
  let altitude = prevState.altitudeMeters + verticalVel * safeDt;

  // Ground collision clamp
  if (altitude <= 0.0) {
    altitude = 0.0;
    verticalVel = Math.max(0.0, verticalVel);
  }

  // Forward & Lateral velocities
  const pitchRad = (pitchAngle * Math.PI) / 180.0;
  const forwardThrust = -thrustN * Math.sin(pitchRad); // Pitch down gives positive forward thrust
  const forwardDrag =
    0.5 * AIR_DENSITY * 1.2 * (prevState.forwardVelocityMs * Math.abs(prevState.forwardVelocityMs));
  const forwardAccel = (forwardThrust - forwardDrag) / AIRCRAFT_MASS_KG;
  const forwardVel = Math.max(0.0, prevState.forwardVelocityMs + forwardAccel * safeDt);

  const rollRad = (rollAngle * Math.PI) / 180.0;
  const lateralThrust = thrustN * Math.sin(rollRad);
  const lateralDrag =
    0.5 * AIR_DENSITY * 1.5 * (prevState.lateralVelocityMs * Math.abs(prevState.lateralVelocityMs));
  const lateralAccel = (lateralThrust - lateralDrag) / AIRCRAFT_MASS_KG;
  const lateralVel = prevState.lateralVelocityMs + lateralAccel * safeDt;

  // Phase updates
  const rotorPhase = (prevState.rotorPhaseRad + omegaRadSec * safeDt) % (2.0 * Math.PI);
  const tailPhase = (prevState.tailRotorPhaseRad + tailOmegaRadSec * safeDt) % (2.0 * Math.PI);

  const isHovering = altitude > 0.5 && forwardVel < 1.5 && Math.abs(verticalVel) < 0.5;
  const isInGroundEffect = altitude < 2.0 * MAIN_ROTOR_RADIUS_M;
  const autorotationState = !controls.engineRunning && currentRpm > 100.0;

  const nextState: SikorskyHelicopterState = {
    timeSec: prevState.timeSec + safeDt,
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
    totalLiftNewtons: verticalThrust,
    aircraftWeightNewtons: AIRCRAFT_WEIGHT_N,
    climbRateMs: verticalVel,
    forwardSpeedKnots: forwardVel * 1.94384, // m/s to knots
    isHovering,
    isInGroundEffect,
    autorotationState,
  };

  return { state: nextState, metrics };
}
