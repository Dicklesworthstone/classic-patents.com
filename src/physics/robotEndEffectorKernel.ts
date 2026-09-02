/**
 * robotEndEffectorKernel.ts
 *
 * SI computational physics and kinematic kernel for Alexander H. Slocum & Peter A. Jurgens'
 * Robot End Effector (US 4,765,668, Granted Aug. 23, 1988).
 *
 * Physical models:
 * 1. Opposed-thread recirculating ball screw linear kinematics (p = 5 mm, N_gear = 48.3 / 35.6 ≈ 1.3567).
 * 2. Ball screw torque-to-thrust force transmission (F_grip = 2*pi*eta*tau_motor*N / p <= 2,000 N).
 * 3. Symmetrical center-point centering repeatability (|delta_center| <= 0.05 mm).
 * 4. Dual-hand independent actuation (Side A raw stock / Side B finished part).
 * 5. Transverse frame positioning and 180° roll reorientation cycle.
 */

export interface RobotEndEffectorControls {
  /** Motor rotational speed in RPM (-1000 to +1000 RPM) */
  motorRpm: number;
  /** Commanded motor torque in N·m (0 to 2.5 N·m) */
  motorTorqueNm: number;
  /** Current jaw opening target for Side A in mm (0 to 152.4 mm / 6 in) */
  jawSpanMm: number;
  /** Side B secondary hand jaw opening in mm (0 to 152.4 mm) */
  sideBJawSpanMm: number;
  /** Robot connector roll angle in degrees (-180° to +180°) */
  connectorRollDeg: number;
  /** Transverse frame translation stroke in mm (-50 to +50 mm) */
  transverseOffsetMm: number;
  /** Workpiece stiffness in N/mm (10 to 5000 N/mm) */
  workpieceStiffnessN_Mm: number;
}

export const ROBOT_END_EFFECTOR_DEFAULTS: RobotEndEffectorControls = {
  motorRpm: 350,
  motorTorqueNm: 0.85,
  jawSpanMm: 65.0,
  sideBJawSpanMm: 80.0,
  connectorRollDeg: 0,
  transverseOffsetMm: 0,
  workpieceStiffnessN_Mm: 500,
};

export interface RobotEndEffectorTelemetry {
  /** Screw rotational speed in RPM */
  screwRpm: number;
  /** Screw angular velocity in rad/s */
  screwOmegaRadS: number;
  /** Linear speed of each individual hand in mm/s */
  singleHandVelocityMmS: number;
  /** Relative closing speed between paired hands in mm/s (<= 43 mm/s) */
  relativeClosingSpeedMmS: number;
  /** Available mechanical clamping grip force in Newtons (<= 2000 N) */
  clampingForceN: number;
  /** Instantaneous screw drive torque in N·m */
  screwTorqueNm: number;
  /** Ball screw mechanical advantage (F_thrust / tau_screw) in m^-1 */
  mechanicalAdvantageM_1: number;
  /** Symmetrical center-point deviation in mm (<= 0.05 mm) */
  centerPointRepeatabilityMm: number;
  /** Left hand absolute position from frame midpoint in mm */
  leftHandPositionMm: number;
  /** Right hand absolute position from frame midpoint in mm */
  rightHandPositionMm: number;
  /** Total gripping power delivered by motor in Watts */
  mechanicalPowerW: number;
  /** Back-driving resistance threshold torque in N·m */
  backDriveHoldingTorqueNm: number;
  /** Primary hand pair A span in mm */
  sideASpanMm: number;
  /** Secondary hand pair B span in mm */
  sideBSpanMm: number;
  /** Transverse position offset in mm */
  transversePositionMm: number;
  /** Frame roll orientation in degrees */
  frameRollDeg: number;
  /** Cycle time for 50 mm stroke in seconds */
  stroke50mmTimeSec: number;
}

/** Gear reduction from driving pinion (35.6 mm) to screw gear (48.3 mm) */
export const GEAR_RATIO = 48.3 / 35.6; // ~1.35674

/** Screw lead: 5 mm / revolution */
export const SCREW_LEAD_M = 0.005; // 5 mm

/** Ball screw forward transmission efficiency (disclosed ~90%) */
export const SCREW_EFFICIENCY = 0.90;

/** Maximum reported gripping force in Newtons */
export const MAX_RATED_GRIP_FORCE_N = 2000.0;

/** Maximum reported travel speed in mm/s */
export const MAX_TRAVEL_SPEED_MM_S = 43.0;

export function readRobotEndEffectorControls(
  raw: Record<string, number | undefined>,
): RobotEndEffectorControls {
  return {
    motorRpm: Number.isFinite(raw.motorRpm) ? (raw.motorRpm as number) : ROBOT_END_EFFECTOR_DEFAULTS.motorRpm,
    motorTorqueNm: Number.isFinite(raw.motorTorqueNm)
      ? Math.max(0, raw.motorTorqueNm as number)
      : ROBOT_END_EFFECTOR_DEFAULTS.motorTorqueNm,
    jawSpanMm: Number.isFinite(raw.jawSpanMm)
      ? Math.min(152.4, Math.max(0, raw.jawSpanMm as number))
      : ROBOT_END_EFFECTOR_DEFAULTS.jawSpanMm,
    sideBJawSpanMm: Number.isFinite(raw.sideBJawSpanMm)
      ? Math.min(152.4, Math.max(0, raw.sideBJawSpanMm as number))
      : ROBOT_END_EFFECTOR_DEFAULTS.sideBJawSpanMm,
    connectorRollDeg: Number.isFinite(raw.connectorRollDeg)
      ? (raw.connectorRollDeg as number)
      : ROBOT_END_EFFECTOR_DEFAULTS.connectorRollDeg,
    transverseOffsetMm: Number.isFinite(raw.transverseOffsetMm)
      ? (raw.transverseOffsetMm as number)
      : ROBOT_END_EFFECTOR_DEFAULTS.transverseOffsetMm,
    workpieceStiffnessN_Mm: Number.isFinite(raw.workpieceStiffnessN_Mm)
      ? Math.max(1, raw.workpieceStiffnessN_Mm as number)
      : ROBOT_END_EFFECTOR_DEFAULTS.workpieceStiffnessN_Mm,
  };
}

export function stepRobotEndEffectorSi(
  controls: RobotEndEffectorControls,
  _timeSec = 0,
): RobotEndEffectorTelemetry {
  const motorRpm = controls.motorRpm;
  const screwRpm = motorRpm / GEAR_RATIO;
  const screwOmegaRadS = (screwRpm * 2 * Math.PI) / 60;

  // Linear speed of each hand (mm/s)
  const singleHandVelocityMmS = (Math.abs(screwRpm) * (SCREW_LEAD_M * 1000)) / 60;
  // Relative closing/opening speed is 2x single hand speed
  const relativeClosingSpeedMmS = Math.min(
    MAX_TRAVEL_SPEED_MM_S,
    2 * singleHandVelocityMmS,
  );

  // Torque at screw shaft
  const tauMotor = Math.max(0, controls.motorTorqueNm);
  const tauScrew = tauMotor * GEAR_RATIO;

  // Mechanical advantage: F / tau_screw = 2 * pi * eta / lead
  const mechanicalAdvantageM_1 = (2 * Math.PI * SCREW_EFFICIENCY) / SCREW_LEAD_M;

  // Clamping thrust force F = 2 * pi * eta * tau_screw / lead
  const rawClampingForceN = tauScrew * mechanicalAdvantageM_1;
  const clampingForceN = Math.min(MAX_RATED_GRIP_FORCE_N, rawClampingForceN);

  // Symmetrical hand positions from midpoint
  const spanA = Math.min(152.4, Math.max(0, controls.jawSpanMm));
  const halfSpanA = spanA / 2;
  const leftHandPositionMm = -halfSpanA;
  const rightHandPositionMm = halfSpanA;

  // Center-point repeatability (governed by screw linearity and symmetric bearings)
  const loadDeflectionFactor = (clampingForceN / MAX_RATED_GRIP_FORCE_N) * 0.03;
  const centerPointRepeatabilityMm = Math.min(0.05, 0.01 + loadDeflectionFactor);

  // Mechanical power delivered: P = tau_motor * omega_motor
  const motorOmegaRadS = (motorRpm * 2 * Math.PI) / 60;
  const mechanicalPowerW = Math.abs(tauMotor * motorOmegaRadS);

  // Back-driving threshold holding torque
  // Since eta = 0.90 > 0.50, back-drive efficiency eta_back ~ 2 - 1/eta ~ 0.888
  const etaBack = Math.max(0.1, 2 - 1 / SCREW_EFFICIENCY);
  const backDriveHoldingTorqueNm = (clampingForceN * SCREW_LEAD_M) / (2 * Math.PI * etaBack * GEAR_RATIO);

  // 50 mm stroke travel time
  const stroke50mmTimeSec = relativeClosingSpeedMmS > 0 ? 50 / relativeClosingSpeedMmS : 999.0;

  return {
    screwRpm,
    screwOmegaRadS,
    singleHandVelocityMmS,
    relativeClosingSpeedMmS,
    clampingForceN,
    screwTorqueNm: tauScrew,
    mechanicalAdvantageM_1,
    centerPointRepeatabilityMm,
    leftHandPositionMm,
    rightHandPositionMm,
    mechanicalPowerW,
    backDriveHoldingTorqueNm,
    sideASpanMm: spanA,
    sideBSpanMm: controls.sideBJawSpanMm,
    transversePositionMm: controls.transverseOffsetMm,
    frameRollDeg: controls.connectorRollDeg,
    stroke50mmTimeSec,
  };
}

/** Typical disclosed prototype jaw opening: 6 inches (0.1524 m) */
export const ROBOT_END_EFFECTOR_TYPICAL_JAW_OPENING_M = 0.1524;

export interface RobotEndEffectorState {
  jawOpeningM: number;
  perHandOffsetM: number;
  screwRevolutions: number;
  screwAngleRad: number;
  motorRevolutions: number;
  encoderCountModulo: number;
  requestedGripForceN: number;
  fingerRetainedFraction: number;
  frameRotationRad: number;
  transverseOffsetM: number;
  symmetricMidpointM: number;
  sourceReportedGripForceN: number;
  sourceRepeatabilityM: number;
  sourceBoundary: {
    note: string;
    isRefused: boolean;
  };
}

export function stepRobotEndEffector(
  rawParams: Record<string, number | undefined>,
): RobotEndEffectorState {
  const fraction = Number.isFinite(rawParams.jawOpeningFraction)
    ? Math.min(1, Math.max(0, rawParams.jawOpeningFraction as number))
    : 0.52;
  const gripForce = Number.isFinite(rawParams.gripForceSetpointN)
    ? Math.min(2000, Math.max(0, rawParams.gripForceSetpointN as number))
    : 900;
  const rotationDeg = Number.isFinite(rawParams.frameRotationDeg)
    ? (rawParams.frameRotationDeg as number)
    : 0;
  const fingerChange = Number.isFinite(rawParams.fingerChangeFraction)
    ? Math.min(1, Math.max(0, rawParams.fingerChangeFraction as number))
    : 0;

  const jawOpeningM = fraction * ROBOT_END_EFFECTOR_TYPICAL_JAW_OPENING_M;
  const perHandOffsetM = jawOpeningM / 2;
  const screwRevolutions = perHandOffsetM / SCREW_LEAD_M;
  const screwAngleRad = screwRevolutions * 2 * Math.PI;
  const motorRevolutions = screwRevolutions * GEAR_RATIO;
  const encoderCountModulo = (motorRevolutions * 8) % 8;

  return {
    jawOpeningM,
    perHandOffsetM,
    screwRevolutions,
    screwAngleRad,
    motorRevolutions,
    encoderCountModulo,
    requestedGripForceN: gripForce,
    fingerRetainedFraction: 1 - fingerChange,
    frameRotationRad: (rotationDeg * Math.PI) / 180,
    transverseOffsetM: 0,
    symmetricMidpointM: 0,
    sourceReportedGripForceN: MAX_RATED_GRIP_FORCE_N,
    sourceRepeatabilityM: 0.00005, // 0.05 mm
    sourceBoundary: {
      note: "US 4,765,668 supplies 5 mm lead, 2000 N max force, and 0.05 mm repeatability. Refuses unprinted payload, contact pressure, and robot arm model.",
      isRefused: true,
    },
  };
}
