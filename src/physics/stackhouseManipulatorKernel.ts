/**
 * US 4,068,536 — Theodore H. Stackhouse / Cincinnati Milacron 3-Roll Spherical Wrist Manipulator
 *
 * Mathematical Physics & 3-Roll Kinematic Kernel
 *
 * Implements the forward & differential kinematics of the 3-roll intersecting-axis
 * spherical wrist: concentric tubular shaft transmission, dual 45-degree oblique
 * joint composition, spherical sector orientation envelope, and Jacobian determinism.
 */

export interface StackhouseManipulatorControls {
  /** Primary forearm roll angle in degrees (-180° to 180°). */
  readonly forearmRollDeg: number;
  /** Intermediate oblique roll angle in degrees (-180° to 180°). */
  readonly intermediateRollDeg: number;
  /** Terminal tool roll / spin angle in degrees (-180° to 180°). */
  readonly toolRollDeg: number;
  /** Tool standoff length from spherical intersection center in meters (0.05 to 0.40 m). */
  readonly toolLengthM: number;
  /** Payload mass at tool tip in kg (0 to 50 kg). */
  readonly payloadMassKg: number;
  /** Drive motor input angular velocity in rad/s (0 to 10 rad/s). */
  readonly motorVelocityRadS: number;
}

export const DEFAULT_STACKHOUSE_CONTROLS: StackhouseManipulatorControls = {
  forearmRollDeg: 0,
  intermediateRollDeg: 60,
  toolRollDeg: 0,
  toolLengthM: 0.2,
  payloadMassKg: 15.0,
  motorVelocityRadS: 2.0,
};

export interface StackhouseManipulatorTelemetry {
  /** Forearm roll angle in radians. */
  readonly theta1Rad: number;
  /** Intermediate roll angle in radians. */
  readonly theta2Rad: number;
  /** Terminal tool roll angle in radians. */
  readonly theta3Rad: number;
  /** Resultant tool pointing vector [ux, uy, uz] (unit vector). */
  readonly toolVector: readonly [number, number, number];
  /** Total deflection / bend angle from forearm longitudinal axis in degrees (0° to 90°). */
  readonly totalBendAngleDeg: number;
  /** Azimuth angle in transverse plane in degrees (-180° to 180°). */
  readonly azimuthAngleDeg: number;
  /** Tool tip 3D coordinates relative to intersection center point in meters. */
  readonly toolTipPositionM: readonly [number, number, number];
  /** Tool tip linear velocity in m/s. */
  readonly toolTipSpeedMps: number;
  /** Spherical orientation solid angle in steradians (0 to 2*pi sr). */
  readonly solidAngleSteradians: number;
  /** Wrist Jacobian determinant |det(J)| measuring dexterity and distance from singularity. */
  readonly jacobianDeterminant: number;
  /** Singularity margin percentage (0% at collinear alignment, 100% at optimal 90° bend). */
  readonly singularityMarginPct: number;
  /** Kinetic energy of payload and rotating wrist links in Joules. */
  readonly kineticEnergyJoules: number;
  /** Mechanical power transmitted across bevel gear trains in Watts. */
  readonly mechanicalPowerWatts: number;
  /** Gear ratio transmission matrix determinant (strictly 1.0 for invertible linear mapping). */
  readonly transmissionDeterminant: number;
}

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;
const ALPHA_1 = 45 * DEG_TO_RAD; // 45° first oblique angle
const ALPHA_2 = 45 * DEG_TO_RAD; // 45° second oblique angle
const WRIST_INERTIA_KG_M2 = 0.08;

export function readStackhouseManipulatorControls(
  params: Record<string, number | undefined>,
): StackhouseManipulatorControls {
  return {
    forearmRollDeg: params.forearmRollDeg ?? DEFAULT_STACKHOUSE_CONTROLS.forearmRollDeg,
    intermediateRollDeg:
      params.intermediateRollDeg ?? DEFAULT_STACKHOUSE_CONTROLS.intermediateRollDeg,
    toolRollDeg: params.toolRollDeg ?? DEFAULT_STACKHOUSE_CONTROLS.toolRollDeg,
    toolLengthM: Math.max(
      0.05,
      Math.min(0.5, params.toolLengthM ?? DEFAULT_STACKHOUSE_CONTROLS.toolLengthM),
    ),
    payloadMassKg: Math.max(
      0,
      Math.min(100, params.payloadMassKg ?? DEFAULT_STACKHOUSE_CONTROLS.payloadMassKg),
    ),
    motorVelocityRadS: Math.max(
      0,
      Math.min(20, params.motorVelocityRadS ?? DEFAULT_STACKHOUSE_CONTROLS.motorVelocityRadS),
    ),
  };
}

/**
 * 3x3 Matrix multiplication helper: C = A * B
 */
function matMul3x3(
  a: readonly [number, number, number, number, number, number, number, number, number],
  b: readonly [number, number, number, number, number, number, number, number, number],
): [number, number, number, number, number, number, number, number, number] {
  return [
    a[0] * b[0] + a[1] * b[3] + a[2] * b[6],
    a[0] * b[1] + a[1] * b[4] + a[2] * b[7],
    a[0] * b[2] + a[1] * b[5] + a[2] * b[8],

    a[3] * b[0] + a[4] * b[3] + a[5] * b[6],
    a[3] * b[1] + a[4] * b[4] + a[5] * b[7],
    a[3] * b[2] + a[4] * b[5] + a[5] * b[8],

    a[6] * b[0] + a[7] * b[3] + a[8] * b[6],
    a[6] * b[1] + a[7] * b[4] + a[8] * b[7],
    a[6] * b[2] + a[7] * b[5] + a[8] * b[8],
  ];
}

/**
 * Rotation about Z axis by angle theta
 */
function rotZ(
  theta: number,
): [number, number, number, number, number, number, number, number, number] {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  return [c, -s, 0, s, c, 0, 0, 0, 1];
}

/**
 * Rotation about Y axis by angle alpha
 */
function rotY(
  alpha: number,
): [number, number, number, number, number, number, number, number, number] {
  const c = Math.cos(alpha);
  const s = Math.sin(alpha);
  return [c, 0, s, 0, 1, 0, -s, 0, c];
}

export function stepStackhouseManipulatorSi(
  controls: StackhouseManipulatorControls,
  timeSec = 0,
): StackhouseManipulatorTelemetry {
  const t1 =
    (controls.forearmRollDeg + (timeSec > 0 ? Math.sin(timeSec * 0.8) * 15 : 0)) * DEG_TO_RAD;
  const t2 =
    (controls.intermediateRollDeg + (timeSec > 0 ? Math.cos(timeSec * 0.6) * 20 : 0)) * DEG_TO_RAD;
  const t3 = (controls.toolRollDeg + (timeSec > 0 ? Math.sin(timeSec * 1.2) * 25 : 0)) * DEG_TO_RAD;

  // Compute 3-roll forward orientation matrix:
  // R = Rz(t1) * Ry(alpha1) * Rz(t2) * Ry(-alpha2) * Rz(t3)
  // At t2=0, Ry(45°) * Ry(-45°) = I (collinear straight 0° bend).
  // At t2=180°, the two 45° bends add constructively to 90° bend.
  const r1 = rotZ(t1);
  const tilt1 = rotY(ALPHA_1);
  const r2 = rotZ(t2);
  const tilt2 = rotY(-ALPHA_2);
  const r3 = rotZ(t3);

  const m1 = matMul3x3(r1, tilt1);
  const m2 = matMul3x3(m1, r2);
  const m3 = matMul3x3(m2, tilt2);
  const rTotal = matMul3x3(m3, r3);

  // Initial tool direction in tool frame is along Z axis: [0, 0, 1]
  const ux = rTotal[2];
  const uy = rTotal[5];
  const uz = rTotal[8];

  // Tool tip position relative to center intersection point 36
  const tipX = ux * controls.toolLengthM;
  const tipY = uy * controls.toolLengthM;
  const tipZ = uz * controls.toolLengthM;

  // Total bend angle relative to forearm longitudinal Z axis
  const clampedUz = Math.max(-1, Math.min(1, uz));
  const totalBendRad = Math.acos(clampedUz);
  const totalBendAngleDeg = totalBendRad * RAD_TO_DEG;

  // Azimuth in XY plane
  const azimuthRad = Math.atan2(uy, ux);
  const azimuthAngleDeg = azimuthRad * RAD_TO_DEG;

  // Spherical solid angle for apex cone 2*theta_bend:
  // Omega = 2*pi * (1 - cos(totalBendRad))
  const solidAngleSteradians = 2 * Math.PI * (1 - Math.cos(totalBendRad));

  // Kinematic Jacobian determinant for 3-roll wrist:
  // |det(J)| = sin(alpha1) * sin(alpha2) * |sin(t2)|
  // With alpha1 = 45°, alpha2 = 45°: sin(45°)*sin(45°) = 0.5
  // det(J) = 0.5 * |sin(t2)|
  const jacobianDeterminant = 0.5 * Math.abs(Math.sin(t2));
  const singularityMarginPct = Math.min(100, (jacobianDeterminant / 0.5) * 100);

  // Angular velocity vector magnitude & tip speed
  const omega = controls.motorVelocityRadS;
  const toolTipSpeedMps = omega * controls.toolLengthM * Math.sin(totalBendRad);

  // Dynamics: kinetic energy and mechanical power
  const payloadInertia = controls.payloadMassKg * controls.toolLengthM * controls.toolLengthM;
  const kineticEnergyJoules = 0.5 * (WRIST_INERTIA_KG_M2 + payloadInertia) * (omega * omega);
  const mechanicalPowerWatts =
    (WRIST_INERTIA_KG_M2 + payloadInertia) * (omega * omega * omega) * 0.15 +
    controls.payloadMassKg * 9.81 * toolTipSpeedMps * 0.1;

  return {
    theta1Rad: t1,
    theta2Rad: t2,
    theta3Rad: t3,
    toolVector: [ux, uy, uz],
    totalBendAngleDeg,
    azimuthAngleDeg,
    toolTipPositionM: [tipX, tipY, tipZ],
    toolTipSpeedMps,
    solidAngleSteradians,
    jacobianDeterminant,
    singularityMarginPct,
    kineticEnergyJoules,
    mechanicalPowerWatts,
    transmissionDeterminant: 1.0,
  };
}
