/**
 * Kamen Segway Personal Transporter Physics Kernel (US 6,302,230 B1)
 *
 * Mathematical and physical model of Dean Kamen's self-balancing inverted-pendulum
 * personal transporter. Models state-space pitch stabilization, balancing margin,
 * wheel traction limits, tactile ripple alarm modulation, and typed refusal boundaries.
 */

export interface KamenSegwayControls {
  /** User pitch lean angle in degrees (-15° aft to +15° fore) */
  riderPitchDeg: number;
  /** Commanded steering yaw rate (-1.0 full left to +1.0 full right) */
  steeringInput: number;
  /** Rider mass in kg (40 to 120 kg) */
  riderMassKg: number;
  /** Ground surface friction coefficient μ (0.15 ice to 0.9 dry pavement) */
  groundFrictionCoeff: number;
  /** Maximum speed governor limit in m/s (2.0 to 6.0 m/s) */
  speedLimitMS: number;
}

export interface KamenSegwayTelemetry {
  /** Forward velocity in m/s */
  velocityMS: number;
  /** Forward velocity in km/h */
  velocityKmh: number;
  /** Forward acceleration in m/s² */
  accelerationMS2: number;
  /** Net restoring motor torque in N·m */
  motorTorqueNm: number;
  /** Left wheel motor torque in N·m */
  leftMotorTorqueNm: number;
  /** Right wheel motor torque in N·m */
  rightMotorTorqueNm: number;
  /** Gravitational overturning torque in N·m */
  gravityOverturningTorqueNm: number;
  /** Ground drive thrust force in N */
  driveThrustForceN: number;
  /** Maximum available ground traction force in N */
  maxTractionForceN: number;
  /** Dimensionless balancing margin ratio (0.0 exhausted to 1.0 full reserve) */
  balancingMarginRatio: number;
  /** Pitch pushback angle in degrees applied by speed limiter */
  pitchPushbackDeg: number;
  /** Tactile ripple vibration amplitude in N·m */
  rippleAlarmAmplitudeNm: number;
  /** Audible alarm active flag */
  audibleAlarmActive: boolean;
  /** Tactile shake alarm active flag */
  tactileAlarmActive: boolean;
  /** Speed pushback active flag */
  speedPushbackActive: boolean;

  /** Typed Refusal: Wheel traction slip / loss of ground grip */
  tractionLossRefusal: boolean;
  /** Typed Refusal: Pitch angle exceeds physical motor torque recovery envelope */
  pitchOverturnRefusal: boolean;
  /** Typed Refusal: Motor current / thermal saturation */
  motorSaturationRefusal: boolean;
  /** Human-readable refusal reason or null */
  refusalReason: string | null;
}

export const KAMEN_SEGWAY_DEFAULT_CONTROLS: KamenSegwayControls = {
  riderPitchDeg: 4.5,
  steeringInput: 0.0,
  riderMassKg: 75.0,
  groundFrictionCoeff: 0.85,
  speedLimitMS: 5.5,
};

// Transporter physical constants (US 6,302,230)
const CHASSIS_MASS_KG = 43.0; // Empty Segway HT chassis mass
const WHEEL_RADIUS_M = 0.24; // 19-inch diameter pneumatic tire radius (0.241 m)
const CG_HEIGHT_M = 0.92; // Effective center of mass height above wheel axis
const GRAVITY_M_S2 = 9.80665;
const MAX_MOTOR_TORQUE_TOTAL_NM = 160.0; // Dual brushless DC servomotors through 24:1 planetary gearboxes (80 N·m per wheel)
const KV_SPEED = 12.0; // Velocity damping gain (N·m·s/m)

export function readKamenSegwayControls(params: Record<string, number>): KamenSegwayControls {
  return {
    riderPitchDeg:
      params.riderPitchDeg !== undefined
        ? params.riderPitchDeg
        : KAMEN_SEGWAY_DEFAULT_CONTROLS.riderPitchDeg,
    steeringInput:
      params.steeringInput !== undefined
        ? params.steeringInput
        : KAMEN_SEGWAY_DEFAULT_CONTROLS.steeringInput,
    riderMassKg:
      params.riderMassKg !== undefined
        ? params.riderMassKg
        : KAMEN_SEGWAY_DEFAULT_CONTROLS.riderMassKg,
    groundFrictionCoeff:
      params.groundFrictionCoeff !== undefined
        ? params.groundFrictionCoeff
        : KAMEN_SEGWAY_DEFAULT_CONTROLS.groundFrictionCoeff,
    speedLimitMS:
      params.speedLimitMS !== undefined
        ? params.speedLimitMS
        : KAMEN_SEGWAY_DEFAULT_CONTROLS.speedLimitMS,
  };
}

export function stepKamenSegwaySi(controls: KamenSegwayControls): KamenSegwayTelemetry {
  const totalMassKg = controls.riderMassKg + CHASSIS_MASS_KG;
  const normalForceN = totalMassKg * GRAVITY_M_S2;
  const maxTractionForceN = controls.groundFrictionCoeff * normalForceN;

  // Pitch angle in radians
  const pitchRad = (controls.riderPitchDeg * Math.PI) / 180;

  // Overturning gravitational torque: tau_grav = M * g * L * sin(theta)
  const gravityOverturningTorqueNm = totalMassKg * GRAVITY_M_S2 * CG_HEIGHT_M * Math.sin(pitchRad);

  // Equilibrium forward velocity proportional to forward lean angle
  let nominalVelocityMS = (controls.riderPitchDeg / 15.0) * controls.speedLimitMS;

  // Speed limiting pushback: if nominal speed exceeds governor limit
  let pitchPushbackDeg = 0.0;
  let speedPushbackActive = false;
  if (Math.abs(nominalVelocityMS) > controls.speedLimitMS * 0.9) {
    speedPushbackActive = true;
    const overspeed = Math.abs(nominalVelocityMS) - controls.speedLimitMS * 0.9;
    pitchPushbackDeg = Math.sign(nominalVelocityMS) * Math.min(6.0, overspeed * 3.5);
    nominalVelocityMS =
      Math.sign(nominalVelocityMS) *
      Math.min(controls.speedLimitMS, Math.abs(nominalVelocityMS) * 0.95);
  }

  // Restoring torque required to balance the inverted pendulum
  // tau_motor = M*g*L*sin(theta) + K_v * v
  const motorTorqueNm = gravityOverturningTorqueNm + KV_SPEED * nominalVelocityMS;

  // Differential steering torque
  const steeringDeltaTorque = controls.steeringInput * 18.0;
  const leftMotorTorqueNm = motorTorqueNm / 2 - steeringDeltaTorque;
  const rightMotorTorqueNm = motorTorqueNm / 2 + steeringDeltaTorque;

  // Drive thrust force at the wheel contact patch: F = tau / R
  const driveThrustForceN = motorTorqueNm / WHEEL_RADIUS_M;

  // Forward acceleration: a = F_drive / totalMass
  const accelerationMS2 = driveThrustForceN / totalMassKg;

  // Balancing margin calculation (US 6,302,230 Col. 13-14)
  // Difference between maximum motor acceleration potential and currently demanded acceleration
  const torqueFraction = Math.min(1.0, Math.abs(motorTorqueNm) / MAX_MOTOR_TORQUE_TOTAL_NM);
  const velocityFraction = Math.min(1.0, Math.abs(nominalVelocityMS) / controls.speedLimitMS);
  const balancingMarginRatio = Math.max(0.0, 1.0 - 0.55 * torqueFraction - 0.45 * velocityFraction);

  // Alarms: low balancing margin triggers audible and tactile ripple shudder alarms
  const lowMargin = balancingMarginRatio < 0.22;
  const audibleAlarmActive = lowMargin || speedPushbackActive;
  const tactileAlarmActive = lowMargin || speedPushbackActive;
  const rippleAlarmAmplitudeNm = tactileAlarmActive ? 9.5 : 0.0;

  // Typed Refusal Boundaries
  let tractionLossRefusal = false;
  let pitchOverturnRefusal = false;
  let motorSaturationRefusal = false;
  let refusalReason: string | null = null;

  if (Math.abs(controls.riderPitchDeg) > 18.0) {
    pitchOverturnRefusal = true;
    refusalReason = `Pitch angle (${controls.riderPitchDeg.toFixed(1)}°) exceeds recovery envelope; gravitational torque (${Math.abs(gravityOverturningTorqueNm).toFixed(0)} N·m) overcomes motor balancing authority.`;
  } else if (Math.abs(driveThrustForceN) > maxTractionForceN) {
    tractionLossRefusal = true;
    refusalReason = `Wheel traction lost: demanded drive thrust (${Math.abs(driveThrustForceN).toFixed(0)} N) exceeds tire grip limit (${maxTractionForceN.toFixed(0)} N, μ=${controls.groundFrictionCoeff}).`;
  } else if (Math.abs(motorTorqueNm) > MAX_MOTOR_TORQUE_TOTAL_NM * 1.05) {
    motorSaturationRefusal = true;
    refusalReason = `Motor torque saturated: demanded torque (${Math.abs(motorTorqueNm).toFixed(1)} N·m) exceeds dual-motor peak rating (${MAX_MOTOR_TORQUE_TOTAL_NM} N·m).`;
  }

  return {
    velocityMS: nominalVelocityMS,
    velocityKmh: nominalVelocityMS * 3.6,
    accelerationMS2,
    motorTorqueNm,
    leftMotorTorqueNm,
    rightMotorTorqueNm,
    gravityOverturningTorqueNm,
    driveThrustForceN,
    maxTractionForceN,
    balancingMarginRatio,
    pitchPushbackDeg,
    rippleAlarmAmplitudeNm,
    audibleAlarmActive,
    tactileAlarmActive,
    speedPushbackActive,
    tractionLossRefusal,
    pitchOverturnRefusal,
    motorSaturationRefusal,
    refusalReason,
  };
}
