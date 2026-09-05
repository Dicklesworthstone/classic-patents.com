/**
 * Source-bounded geometry exhibit for US 4,068,536 (Stackhouse, Manipulator).
 *
 * The grant discloses three serial rotary axes, two independently driven sets
 * of concentric shafts, bevel-gear transmission, and a preferred single point
 * of axis intersection. It says the two fixed oblique angles in the illustrated
 * embodiment are each greater than 45 degrees. It does not disclose their
 * exact values, gear ratios, dimensions, mass, speed, torque, efficiency, or a
 * motor-to-joint calibration. This kernel therefore composes a selected,
 * source-consistent drawing-space pose and explicitly refuses SI dynamics.
 */

export interface StackhouseSourceControls {
  /** Selected pose about source axis A-A', in degrees. */
  readonly forearmRollDeg: number;
  /** Selected pose about source axis B-B', in degrees. */
  readonly intermediateRollDeg: number;
  /** Selected pose about source axis C-C', in degrees. */
  readonly toolRollDeg: number;
  /** Exhibit geometry only. The source states >45 degrees, not an exact value. */
  readonly firstObliqueAngleDeg: number;
  /** Exhibit geometry only. The source states >45 degrees, not an exact value. */
  readonly secondObliqueAngleDeg: number;
  /** 1 shows preferred coincidence at P; 0 shows the source-permitted offset contrast. */
  readonly singleIntersection: number;
}

export const STACKHOUSE_SOURCE_DEFAULT_CONTROLS: StackhouseSourceControls = {
  forearmRollDeg: 0,
  intermediateRollDeg: 72,
  toolRollDeg: 0,
  firstObliqueAngleDeg: 55,
  secondObliqueAngleDeg: 55,
  singleIntersection: 1,
};

export interface StackhouseSourcePose extends StackhouseSourceControls {
  readonly thetaARad: number;
  readonly thetaBRad: number;
  readonly thetaCRad: number;
  readonly alphaABRad: number;
  readonly alphaBCRad: number;
  readonly toolDirection: readonly [number, number, number];
  readonly axisADirection: readonly [0, 0, 1];
  readonly axisBDirection: readonly [number, number, number];
  readonly axisCDirection: readonly [number, number, number];
  readonly bendAngleDeg: number;
  readonly azimuthAngleDeg: number;
  readonly rotationDeterminant: number;
  readonly rotationOrthonormalityError: number;
  /** Drawing-space contrast offset; never meters or a manufacturing tolerance. */
  readonly terminalAxisOffset: number;
  readonly intersectionState: "preferred single point P" | "offset-axis source contrast";
  readonly coverageState:
    | "source-consistent: both selected oblique angles exceed 45°"
    | "refused: selected geometry violates the printed >45° condition";
  readonly orientationHoleState:
    | "preferred point-P topology"
    | "source warns that deviations create orientation holes";
  readonly positionLaw: string;
  readonly jointOwner: "fs-mbd revolute-joint forward kinematics · typed browser mirror";
  readonly refusal: { readonly refused: true; readonly reason: string };
}

type Matrix3 = readonly [number, number, number, number, number, number, number, number, number];

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

function finite(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function clamp(value: number | undefined, fallback: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, finite(value, fallback)));
}

function multiply(a: Matrix3, b: Matrix3): Matrix3 {
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

function rotateZ(angle: number): Matrix3 {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  return [cosine, -sine, 0, sine, cosine, 0, 0, 0, 1];
}

function rotateY(angle: number): Matrix3 {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  return [cosine, 0, sine, 0, 1, 0, -sine, 0, cosine];
}

function directionOfLocalZ(matrix: Matrix3): readonly [number, number, number] {
  return [matrix[2], matrix[5], matrix[8]];
}

function determinant(matrix: Matrix3): number {
  return (
    matrix[0] * (matrix[4] * matrix[8] - matrix[5] * matrix[7]) -
    matrix[1] * (matrix[3] * matrix[8] - matrix[5] * matrix[6]) +
    matrix[2] * (matrix[3] * matrix[7] - matrix[4] * matrix[6])
  );
}

function orthonormalityError(matrix: Matrix3): number {
  let maximum = 0;
  for (let row = 0; row < 3; row += 1) {
    for (let column = 0; column < 3; column += 1) {
      let dot = 0;
      for (let axis = 0; axis < 3; axis += 1) {
        dot += matrix[axis * 3 + row] * matrix[axis * 3 + column];
      }
      maximum = Math.max(maximum, Math.abs(dot - (row === column ? 1 : 0)));
    }
  }
  return maximum;
}

export function readStackhouseSourceControls(
  params: Partial<StackhouseSourceControls> | Record<string, number | undefined>,
): StackhouseSourceControls {
  const p = params as Record<string, number | undefined>;
  const forearm = p.forearmRollDeg ?? p.forearmRoll ?? p.theta1 ?? p.roll1;
  const intermediate = p.intermediateRollDeg ?? p.intermediateRoll ?? p.theta2 ?? p.roll2;
  const tool = p.toolRollDeg ?? p.toolRoll ?? p.theta3 ?? p.roll3;
  const oblique1 = p.firstObliqueAngleDeg ?? p.firstOblique ?? p.alphaAB ?? p.alpha1;
  const oblique2 = p.secondObliqueAngleDeg ?? p.secondOblique ?? p.alphaBC ?? p.alpha2;
  const intersection = p.singleIntersection ?? p.pointP ?? p.exactIntersection ?? p.preferredPointP;

  return {
    forearmRollDeg: clamp(forearm, STACKHOUSE_SOURCE_DEFAULT_CONTROLS.forearmRollDeg, -180, 180),
    intermediateRollDeg: clamp(
      intermediate,
      STACKHOUSE_SOURCE_DEFAULT_CONTROLS.intermediateRollDeg,
      -180,
      180,
    ),
    toolRollDeg: clamp(tool, STACKHOUSE_SOURCE_DEFAULT_CONTROLS.toolRollDeg, -180, 180),
    firstObliqueAngleDeg: clamp(
      oblique1,
      STACKHOUSE_SOURCE_DEFAULT_CONTROLS.firstObliqueAngleDeg,
      46,
      80,
    ),
    secondObliqueAngleDeg: clamp(
      oblique2,
      STACKHOUSE_SOURCE_DEFAULT_CONTROLS.secondObliqueAngleDeg,
      46,
      80,
    ),
    singleIntersection: clamp(
      intersection,
      STACKHOUSE_SOURCE_DEFAULT_CONTROLS.singleIntersection,
      0,
      1,
    ),
  };
}

/**
 * Compose a modern teaching pose for the nested A/B/C axes. This is not a
 * reconstruction of hydraulic-motor input angles or undisclosed gear ratios.
 */
export function stepStackhouseSourceTopology(
  params: Partial<StackhouseSourceControls> | Record<string, number | undefined>,
): StackhouseSourcePose {
  const controls = readStackhouseSourceControls(params);
  const thetaA = controls.forearmRollDeg * DEG_TO_RAD;
  const thetaB = controls.intermediateRollDeg * DEG_TO_RAD;
  const thetaC = controls.toolRollDeg * DEG_TO_RAD;
  const alphaAB = controls.firstObliqueAngleDeg * DEG_TO_RAD;
  const alphaBC = controls.secondObliqueAngleDeg * DEG_TO_RAD;
  const exactIntersection = controls.singleIntersection >= 0.5;

  // This is the equation-identical browser mirror of a root-fixed tree with
  // three fs-mbd `JointModel::revolute` links and fixed oblique transforms
  // between them. The generic articulated owner is not exported by the
  // current browser artifact, so this surface must not claim a WASM step.
  const axisBFrame = multiply(rotateZ(thetaA), rotateY(alphaAB));
  const axisCFrame = multiply(multiply(axisBFrame, rotateZ(thetaB)), rotateY(-alphaBC));
  const orientation = multiply(axisCFrame, rotateZ(thetaC));
  const direction = directionOfLocalZ(orientation);
  const bendAngleDeg = Math.acos(Math.max(-1, Math.min(1, direction[2]))) * RAD_TO_DEG;
  const azimuthAngleDeg = Math.atan2(direction[1], direction[0]) * RAD_TO_DEG;
  const sourceCondition = controls.firstObliqueAngleDeg > 45 && controls.secondObliqueAngleDeg > 45;

  return {
    ...controls,
    thetaARad: thetaA,
    thetaBRad: thetaB,
    thetaCRad: thetaC,
    alphaABRad: alphaAB,
    alphaBCRad: alphaBC,
    toolDirection: direction,
    axisADirection: [0, 0, 1],
    axisBDirection: directionOfLocalZ(axisBFrame),
    axisCDirection: directionOfLocalZ(axisCFrame),
    bendAngleDeg,
    azimuthAngleDeg,
    rotationDeterminant: determinant(orientation),
    rotationOrthonormalityError: orthonormalityError(orientation),
    terminalAxisOffset: exactIntersection ? 0 : 0.12,
    intersectionState: exactIntersection
      ? "preferred single point P"
      : "offset-axis source contrast",
    coverageState: sourceCondition
      ? "source-consistent: both selected oblique angles exceed 45°"
      : "refused: selected geometry violates the printed >45° condition",
    orientationHoleState: exactIntersection
      ? "preferred point-P topology"
      : "source warns that deviations create orientation holes",
    positionLaw: "R_display = R_z(q_A) · R_y(α_AB) · R_z(q_B) · R_y(−α_BC) · R_z(q_C)",
    jointOwner: "fs-mbd revolute-joint forward kinematics · typed browser mirror",
    refusal: {
      refused: true,
      reason:
        "US 4,068,536 prints the shaft/gear topology and only the inequality that both illustrated oblique angles exceed 45°. It omits exact angles, dimensions, ratios, torque, speed, mass, efficiency, and motor-to-joint calibration, so this kernel refuses SI dynamics, power, payload, precision, Jacobian, and singularity-performance claims.",
    },
  };
}
