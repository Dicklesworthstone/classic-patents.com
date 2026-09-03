/**
 * robotEndEffectorKernel.ts
 *
 * Source-bounded kinematic kernel for Alexander H. Slocum & Peter A. Jurgens'
 * Robot End Effector (US 4,765,668, granted Aug. 23, 1988).
 *
 * The grant prints a 5 mm opposed-thread lead, gear pitch diameters, eight
 * encoder pegs, a typical six-inch opening, and several prototype ratings.
 * Those facts close the helical displacement and encoder relationships. They
 * do not close a pneumatic, contact, compliance, payload, or cycle-time solve.
 * `fs-mbd::JointModel::helical` owns the generic screw law; this typed browser
 * kernel mirrors that one-coordinate constraint without claiming a WASM step.
 */

export const ROBOT_END_EFFECTOR_FRANKENSIM_HELICAL_OWNER = "fs-mbd::JointModel::helical" as const;
export const ROBOT_END_EFFECTOR_FRANKENSIM_REVOLUTE_OWNER = "fs-mbd::JointModel::revolute" as const;
export const ROBOT_END_EFFECTOR_FRANKENSIM_PRISMATIC_OWNER =
  "fs-mbd::JointModel::prismatic" as const;
export const ROBOT_END_EFFECTOR_FRANKENSIM_CONTACT_OWNER = "fs-contact::normal_patch" as const;

const SOURCE_BOUNDARY_NOTE = `US 4,765,668 closes opposed-helical hand displacement and eight-peg encoder phase, but it does not print the workpiece/finger contact geometry, material pair, friction, pneumatic flow, duty cycle, connector stroke, or full body dimensions needed for force, pressure, power, structural deflection, dynamics, or cycle-time telemetry. ${ROBOT_END_EFFECTOR_FRANKENSIM_HELICAL_OWNER} owns the screw constraint, ${ROBOT_END_EFFECTOR_FRANKENSIM_REVOLUTE_OWNER} owns connector roll, ${ROBOT_END_EFFECTOR_FRANKENSIM_PRISMATIC_OWNER} owns the transverse stage, and ${ROBOT_END_EFFECTOR_FRANKENSIM_CONTACT_OWNER} is the candidate contact owner; only the source-closed kinematics are admitted here.`;

export interface RobotEndEffectorControls {
  /** Visitor-declared motor speed, bounded by the printed 260 RPM rating. */
  motorRpm: number;
  /** Visitor-declared motor torque, bounded by the printed 10 N·m stall rating. */
  motorTorqueNm: number;
  /** Source-typical Side A jaw-opening scenario in mm. */
  jawSpanMm: number;
  /** Source-typical Side B jaw-opening scenario in mm. */
  sideBJawSpanMm: number;
  /** Claim 17 connector-roll inspection coordinate. */
  connectorRollDeg: number;
  /** Claim 16 transverse inspection coordinate; the grant prints no stroke. */
  transverseOffsetNormalized: number;
}

export const ROBOT_END_EFFECTOR_DEFAULTS: RobotEndEffectorControls = {
  motorRpm: 260,
  motorTorqueNm: 0,
  jawSpanMm: 65.0,
  sideBJawSpanMm: 80.0,
  connectorRollDeg: 0,
  transverseOffsetNormalized: 0,
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
  /** Visitor motor-torque request; never promoted to achieved grip force. */
  requestedMotorTorqueNm: number;
  /** Source-reported prototype maximum gripping force, not a solved output. */
  sourceReportedMaxGripForceN: number;
  /** Source-reported system repeatability, not a calculated error budget. */
  sourceReportedRepeatabilityMm: number;
  /** Left hand absolute position from frame midpoint in mm */
  leftHandPositionMm: number;
  /** Right hand absolute position from frame midpoint in mm */
  rightHandPositionMm: number;
  /** Primary hand pair A span in mm */
  sideASpanMm: number;
  /** Secondary hand pair B span in mm */
  sideBSpanMm: number;
  /** Normalized transverse inspection coordinate; the source prints no stroke. */
  transversePositionNormalized: number;
  /** Frame roll orientation in degrees */
  frameRollDeg: number;
  /** Source-reported prototype maximum travel figure. */
  sourceReportedMaxTravelMmS: number;
  /** Generic law ownership and typed refusal boundary. */
  owners: {
    helical: typeof ROBOT_END_EFFECTOR_FRANKENSIM_HELICAL_OWNER;
    roll: typeof ROBOT_END_EFFECTOR_FRANKENSIM_REVOLUTE_OWNER;
    transverse: typeof ROBOT_END_EFFECTOR_FRANKENSIM_PRISMATIC_OWNER;
    contactCandidate: typeof ROBOT_END_EFFECTOR_FRANKENSIM_CONTACT_OWNER;
  };
  sourceBoundary: { isRefused: true; note: string };
}

/** Gear reduction from driving pinion (35.6 mm) to screw gear (48.3 mm) */
export const GEAR_RATIO = 48.3 / 35.6; // ~1.35674

/** Screw lead: 5 mm / revolution */
export const SCREW_LEAD_M = 0.005; // 5 mm

/** Source says the ball screw can be efficient "up to 90%." */
export const SCREW_EFFICIENCY = 0.9;

/** Maximum reported gripping force in Newtons */
export const MAX_RATED_GRIP_FORCE_N = 2000.0;

/** Maximum reported travel speed in mm/s */
export const MAX_TRAVEL_SPEED_MM_S = 43.0;

export function readRobotEndEffectorControls(
  raw: Record<string, number | undefined>,
): RobotEndEffectorControls {
  return {
    motorRpm: Number.isFinite(raw.motorRpm)
      ? Math.max(-260, Math.min(260, raw.motorRpm as number))
      : ROBOT_END_EFFECTOR_DEFAULTS.motorRpm,
    motorTorqueNm: Number.isFinite(raw.motorTorqueNm)
      ? Math.max(0, Math.min(10, raw.motorTorqueNm as number))
      : ROBOT_END_EFFECTOR_DEFAULTS.motorTorqueNm,
    jawSpanMm: Number.isFinite(raw.jawSpanMm)
      ? Math.min(152.4, Math.max(0, raw.jawSpanMm as number))
      : ROBOT_END_EFFECTOR_DEFAULTS.jawSpanMm,
    sideBJawSpanMm: Number.isFinite(raw.sideBJawSpanMm)
      ? Math.min(152.4, Math.max(0, raw.sideBJawSpanMm as number))
      : ROBOT_END_EFFECTOR_DEFAULTS.sideBJawSpanMm,
    connectorRollDeg: Number.isFinite(raw.connectorRollDeg)
      ? Math.max(-180, Math.min(180, raw.connectorRollDeg as number))
      : ROBOT_END_EFFECTOR_DEFAULTS.connectorRollDeg,
    transverseOffsetNormalized: Number.isFinite(raw.transverseOffsetNormalized)
      ? Math.max(-1, Math.min(1, raw.transverseOffsetNormalized as number))
      : ROBOT_END_EFFECTOR_DEFAULTS.transverseOffsetNormalized,
  };
}

export function stepRobotEndEffectorSi(
  controls: RobotEndEffectorControls,
  _timeSec = 0,
): RobotEndEffectorTelemetry {
  const controlsRead = readRobotEndEffectorControls({ ...controls });
  const motorRpm = controlsRead.motorRpm;
  const screwRpm = motorRpm / GEAR_RATIO;
  const screwOmegaRadS = (screwRpm * 2 * Math.PI) / 60;

  // Linear speed of each hand (mm/s)
  const singleHandVelocityMmS = (Math.abs(screwRpm) * (SCREW_LEAD_M * 1000)) / 60;
  const relativeClosingSpeedMmS = 2 * singleHandVelocityMmS;

  // Symmetrical hand positions from midpoint
  const spanA = controlsRead.jawSpanMm;
  const halfSpanA = spanA / 2;
  const leftHandPositionMm = -halfSpanA;
  const rightHandPositionMm = halfSpanA;

  return {
    screwRpm,
    screwOmegaRadS,
    singleHandVelocityMmS,
    relativeClosingSpeedMmS,
    requestedMotorTorqueNm: controlsRead.motorTorqueNm,
    sourceReportedMaxGripForceN: MAX_RATED_GRIP_FORCE_N,
    sourceReportedRepeatabilityMm: 0.05,
    leftHandPositionMm,
    rightHandPositionMm,
    sideASpanMm: spanA,
    sideBSpanMm: controlsRead.sideBJawSpanMm,
    transversePositionNormalized: controlsRead.transverseOffsetNormalized,
    frameRollDeg: controlsRead.connectorRollDeg,
    sourceReportedMaxTravelMmS: MAX_TRAVEL_SPEED_MM_S,
    owners: {
      helical: ROBOT_END_EFFECTOR_FRANKENSIM_HELICAL_OWNER,
      roll: ROBOT_END_EFFECTOR_FRANKENSIM_REVOLUTE_OWNER,
      transverse: ROBOT_END_EFFECTOR_FRANKENSIM_PRISMATIC_OWNER,
      contactCandidate: ROBOT_END_EFFECTOR_FRANKENSIM_CONTACT_OWNER,
    },
    sourceBoundary: { isRefused: true, note: SOURCE_BOUNDARY_NOTE },
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
  transverseOffsetNormalized: number;
  symmetricMidpointM: number;
  claim1TopologyPresent: boolean;
  sourceReportedGripForceN: number;
  sourceRepeatabilityM: number;
  owners: {
    helical: typeof ROBOT_END_EFFECTOR_FRANKENSIM_HELICAL_OWNER;
    roll: typeof ROBOT_END_EFFECTOR_FRANKENSIM_REVOLUTE_OWNER;
    transverse: typeof ROBOT_END_EFFECTOR_FRANKENSIM_PRISMATIC_OWNER;
    contactCandidate: typeof ROBOT_END_EFFECTOR_FRANKENSIM_CONTACT_OWNER;
  };
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
    ? Math.min(180, Math.max(-180, rawParams.frameRotationDeg as number))
    : 0;
  const fingerChange = Number.isFinite(rawParams.fingerChangeFraction)
    ? Math.min(1, Math.max(0, rawParams.fingerChangeFraction as number))
    : 0;
  const transverseOffsetNormalized = Number.isFinite(rawParams.transverseOffsetFraction)
    ? Math.min(1, Math.max(-1, rawParams.transverseOffsetFraction as number))
    : 0;
  const claim1TopologyPresent = (rawParams.claim1TopologyEnabled ?? 1) >= 0.5;

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
    transverseOffsetNormalized,
    symmetricMidpointM: 0,
    claim1TopologyPresent,
    sourceReportedGripForceN: MAX_RATED_GRIP_FORCE_N,
    sourceRepeatabilityM: 0.00005, // 0.05 mm
    owners: {
      helical: ROBOT_END_EFFECTOR_FRANKENSIM_HELICAL_OWNER,
      roll: ROBOT_END_EFFECTOR_FRANKENSIM_REVOLUTE_OWNER,
      transverse: ROBOT_END_EFFECTOR_FRANKENSIM_PRISMATIC_OWNER,
      contactCandidate: ROBOT_END_EFFECTOR_FRANKENSIM_CONTACT_OWNER,
    },
    sourceBoundary: {
      note: SOURCE_BOUNDARY_NOTE,
      isRefused: true,
    },
  };
}
