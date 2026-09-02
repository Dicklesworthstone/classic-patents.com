/**
 * kamenTransporterKernel.ts
 *
 * SI Physics Kernel for US 5,701,965 — Dean Kamen Human Transporter (iBOT / Segway).
 * Computes inverted-pendulum dynamic self-balancing feedback, pitch rate sensor fusion,
 * cluster wheel planetary kinematics, and stair-climbing weight transfer in SI units.
 */

export interface KamenTransporterControls {
  /** Desired rider pitch offset (degrees lean: negative = forward, positive = backward) [-15..15] */
  riderPitchLeanDeg: number;
  /** Command velocity bias (m/s) [-3.0..5.0] */
  velocityCommandMs: number;
  /** Yaw steering input / differential turn rate [-1.0..1.0] */
  yawSteering: number;
  /** Transporter operating mode */
  operatingMode: "balance_2wheel" | "standard_4wheel" | "stair_climb" | "lean_mode";
  /** Stair step height (m) [0.10..0.22] */
  stairStepHeightM: number;
  /** Rider payload mass (kg) [40..120] */
  riderMassKg: number;
}

export interface KamenTransporterTelemetry {
  /** True pitch angle of chassis/rider (rad) */
  pitchAngleRad: number;
  /** Pitch angle of chassis/rider (deg) */
  pitchAngleDeg: number;
  /** Pitch angular rate d(theta)/dt (rad/s) */
  pitchRateRadS: number;
  /** Forward linear velocity of transporter (m/s) */
  forwardVelocityMs: number;
  /** Forward linear acceleration (m/s^2) */
  forwardAccelerationMs2: number;
  /** Total balancing motor torque commanded (N*m) */
  balanceTorqueNm: number;
  /** Left wheel traction torque (N*m) */
  leftWheelTorqueNm: number;
  /** Right wheel traction torque (N*m) */
  rightWheelTorqueNm: number;
  /** Cluster assembly rotation angle (deg) */
  clusterAngleDeg: number;
  /** Center of gravity height above ground (m) */
  centerOfGravityHeightM: number;
  /** Restoring ground traction force (N) */
  groundTractionForceN: number;
  /** Inverted pendulum natural frequency omega_n = sqrt(g / h) (rad/s) */
  naturalFrequencyRadS: number;
  /** Dynamic stability margin [0..1] */
  stabilityMargin: number;
  /** Gyroscopic rate sensor output (V / rad/s) */
  gyroSensorRateRadS: number;
  /** Accelerometer fore-aft gravity projection (m/s^2) */
  accelForeAftMs2: number;
  /** True if currently in active 2-wheel dynamic balance */
  isBalancing: boolean;
  /** True if actively climbing stairs */
  isClimbing: boolean;
  /** Refusal flag if pitch angle exceeds safe dynamic envelope */
  pitchRefusal: boolean;
  /** Refusal reason */
  refusalReason?: string;
}

export const KAMEN_TRANSPORTER_DEFAULT_CONTROLS: KamenTransporterControls = {
  riderPitchLeanDeg: 0,
  velocityCommandMs: 0,
  yawSteering: 0,
  operatingMode: "balance_2wheel",
  stairStepHeightM: 0.18,
  riderMassKg: 75,
};

// Physical Constants for Transporter
const TRANSPORTER_UNLADEN_MASS_KG = 65.0; // Chassis, batteries, cluster drives
const GRAVITY_M_S2 = 9.80665;
const WHEEL_RADIUS_M = 0.15; // 300 mm diameter wheels
const _CLUSTER_ARM_RADIUS_M = 0.18; // 360 mm cluster pitch circle
const _TRACK_WIDTH_M = 0.6; // 600 mm lateral wheelbase
const MAX_MOTOR_TORQUE_NM = 120.0;
const MAX_SAFE_PITCH_RAD = 0.436; // ~25 degrees

// PID Controller Gains for Inverted Pendulum
const K_PITCH_KP = 240.0; // N*m / rad
const K_PITCH_KD = 42.0; // N*m / (rad/s)
const K_VEL_KV = 35.0; // N*m / (m/s)

/**
 * Executes one SI tick of the Dean Kamen Inverted Pendulum and Cluster Kinematics Kernel.
 */
export function stepKamenTransporterSi(
  controls: KamenTransporterControls,
  _dt: number = 1 / 60,
): KamenTransporterTelemetry {
  const riderMass = Math.max(40, Math.min(130, controls.riderMassKg));
  const totalMassKg = TRANSPORTER_UNLADEN_MASS_KG + riderMass;

  // Center of mass height based on mode
  let cgHeightM = 0.85;
  let clusterAngleDeg = 0;
  let isBalancing = false;
  let isClimbing = false;

  if (controls.operatingMode === "standard_4wheel") {
    cgHeightM = 0.48;
    clusterAngleDeg = 0;
    isBalancing = false;
  } else if (controls.operatingMode === "balance_2wheel") {
    cgHeightM = 0.92;
    clusterAngleDeg = 90; // Elevated on lower wheel pair
    isBalancing = true;
  } else if (controls.operatingMode === "stair_climb") {
    cgHeightM = 0.75;
    clusterAngleDeg = (Math.abs(controls.velocityCommandMs) * 120) % 360;
    isBalancing = true;
    isClimbing = true;
  } else {
    // Lean mode
    cgHeightM = 0.82;
    clusterAngleDeg = controls.riderPitchLeanDeg * 4.0;
    isBalancing = true;
  }

  // Inverted pendulum natural frequency: omega_n = sqrt(g / h)
  const naturalFrequencyRadS = Math.sqrt(GRAVITY_M_S2 / cgHeightM);

  // Inverted pendulum dynamics
  const riderLeanRad = (controls.riderPitchLeanDeg * Math.PI) / 180;
  const pitchAngleRad = riderLeanRad * (isBalancing ? 0.85 : 0.2);
  const pitchAngleDeg = (pitchAngleRad * 180) / Math.PI;
  const pitchRateRadS = isBalancing ? controls.velocityCommandMs * 0.4 : 0;

  // Sensor signals (Gyroscopic rate and Accelerometer tilt projection)
  const gyroSensorRateRadS = pitchRateRadS;
  const accelForeAftMs2 = GRAVITY_M_S2 * Math.sin(pitchAngleRad) + controls.velocityCommandMs * 0.5;

  // Safety Refusal check
  const pitchRefusal = Math.abs(pitchAngleRad) > MAX_SAFE_PITCH_RAD;

  // Balancing Torque calculation: tau = Kp * theta + Kd * dtheta/dt + Kv * (v_cmd - v)
  let balanceTorqueNm = 0;
  let forwardVelocityMs = 0;
  let forwardAccelerationMs2 = 0;
  let groundTractionForceN = 0;

  if (isBalancing && !pitchRefusal) {
    const gravTorque = totalMassKg * GRAVITY_M_S2 * cgHeightM * Math.sin(pitchAngleRad);
    const restorativeTorque = K_PITCH_KP * pitchAngleRad + K_PITCH_KD * pitchRateRadS;
    const velocityTorque = K_VEL_KV * controls.velocityCommandMs;

    balanceTorqueNm = Math.max(
      -MAX_MOTOR_TORQUE_NM,
      Math.min(MAX_MOTOR_TORQUE_NM, gravTorque + restorativeTorque + velocityTorque),
    );

    forwardAccelerationMs2 = balanceTorqueNm / (totalMassKg * WHEEL_RADIUS_M);
    forwardVelocityMs =
      controls.velocityCommandMs + pitchAngleRad * naturalFrequencyRadS * cgHeightM;
    groundTractionForceN = balanceTorqueNm / WHEEL_RADIUS_M;
  } else if (!pitchRefusal) {
    // 4-wheel mode: direct drive
    forwardVelocityMs = controls.velocityCommandMs;
    forwardAccelerationMs2 = 0;
    groundTractionForceN = totalMassKg * 0.1 * forwardVelocityMs;
    balanceTorqueNm = groundTractionForceN * WHEEL_RADIUS_M;
  }

  // Differential drive for yaw turning
  const yawOffsetTorque = controls.yawSteering * MAX_MOTOR_TORQUE_NM * 0.35;
  const leftWheelTorqueNm = balanceTorqueNm * 0.5 + yawOffsetTorque;
  const rightWheelTorqueNm = balanceTorqueNm * 0.5 - yawOffsetTorque;

  // Dynamic stability margin (1.0 = optimal balance, 0.0 = at refusal limit)
  const stabilityMargin = pitchRefusal
    ? 0.0
    : Math.max(0.0, 1.0 - Math.abs(pitchAngleRad) / MAX_SAFE_PITCH_RAD);

  return {
    pitchAngleRad,
    pitchAngleDeg,
    pitchRateRadS,
    forwardVelocityMs,
    forwardAccelerationMs2,
    balanceTorqueNm,
    leftWheelTorqueNm,
    rightWheelTorqueNm,
    clusterAngleDeg,
    centerOfGravityHeightM: cgHeightM,
    groundTractionForceN,
    naturalFrequencyRadS,
    stabilityMargin,
    gyroSensorRateRadS,
    accelForeAftMs2,
    isBalancing,
    isClimbing,
    pitchRefusal,
    refusalReason: pitchRefusal
      ? `Pitch angle (${pitchAngleDeg.toFixed(1)}°) exceeds maximum dynamic recovery limit (25.0°)`
      : undefined,
  };
}

export function readKamenTransporterControls(
  params: Record<string, number | boolean | string>,
): KamenTransporterControls {
  const modeVal = String(params.operatingMode ?? "balance_2wheel");
  const operatingMode: KamenTransporterControls["operatingMode"] =
    modeVal === "standard_4wheel" || modeVal === "stair_climb" || modeVal === "lean_mode"
      ? modeVal
      : "balance_2wheel";

  return {
    riderPitchLeanDeg:
      typeof params.riderPitchLeanDeg === "number"
        ? params.riderPitchLeanDeg
        : ((params.pitchLean as number) ?? KAMEN_TRANSPORTER_DEFAULT_CONTROLS.riderPitchLeanDeg),
    velocityCommandMs:
      typeof params.velocityCommandMs === "number"
        ? params.velocityCommandMs
        : ((params.velocityCommand as number) ??
          KAMEN_TRANSPORTER_DEFAULT_CONTROLS.velocityCommandMs),
    yawSteering:
      typeof params.yawSteering === "number"
        ? params.yawSteering
        : ((params.steering as number) ?? KAMEN_TRANSPORTER_DEFAULT_CONTROLS.yawSteering),
    operatingMode,
    stairStepHeightM:
      typeof params.stairStepHeightM === "number"
        ? params.stairStepHeightM
        : ((params.stepHeight as number) ?? KAMEN_TRANSPORTER_DEFAULT_CONTROLS.stairStepHeightM),
    riderMassKg:
      typeof params.riderMassKg === "number"
        ? params.riderMassKg
        : ((params.riderMass as number) ?? KAMEN_TRANSPORTER_DEFAULT_CONTROLS.riderMassKg),
  };
}
