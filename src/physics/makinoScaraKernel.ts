/**
 * US 4,341,502 — Makino Assembly Robot
 *
 * The patent gives a four-link topology, the two driven link angles θ1 and
 * θ2, optional belt-driven tool attitude, and a Y-link variant. It gives no
 * link length, motor torque, payload, stiffness, clearance, or timing law.
 * This kernel therefore owns a deterministic *normalized configuration
 * exhibit*. Its coordinate values are deliberately unitless and cannot be
 * promoted to SI telemetry or a FrankenSim dynamic-body result.
 */

export const MAKINO_EXHIBIT_LINK_LENGTH = 1;
export const MAKINO_EXHIBIT_BASE_SPAN = 0.72;
/**
 * Declared display length for links 6 and 7 in the non-parallelogram Claim 3
 * exhibit. The larger radius keeps every permitted pair of display angles
 * inside the normalized five-bar workspace; it is not a recovered dimension.
 */
export const MAKINO_EXHIBIT_OFFSET_FOLLOWER_LENGTH = 1.4;
export const MAKINO_FRANKENSIM_OWNER = "fs-mbd::JointModel::revolute";
export const MAKINO_FRANKENSIM_BOUNDARY =
  "generic revolute-joint composition identified; closed-chain SI dynamics refused";

export interface MakinoScaraControls {
  firstLinkAngleDeg: number;
  fourthLinkAngleDeg: number;
  toolAttitudeDeg: number;
  /** 1 = claim 1 concentric, 2 = claim 3 offset, 3 = claim 6 Y-link. */
  topologyVariant: number;
}

export const MAKINO_SCARA_DEFAULT_CONTROLS: MakinoScaraControls = {
  firstLinkAngleDeg: 32,
  fourthLinkAngleDeg: -38,
  toolAttitudeDeg: 0,
  topologyVariant: 1,
};

export interface MakinoScaraControlParams {
  firstLinkAngleDeg?: number;
  fourthLinkAngleDeg?: number;
  toolAttitudeDeg?: number;
  topologyVariant?: number;
}

export type MakinoTopology = "claim-1-concentric" | "claim-3-offset" | "claim-6-y-link";

export interface MakinoScaraPose {
  topology: MakinoTopology;
  firstLinkAngleRad: number;
  fourthLinkAngleRad: number;
  toolAttitudeRad: number;
  /** Normalized exhibit anchors—never historical metres. */
  firstBase: readonly [number, number];
  fourthBase: readonly [number, number];
  firstOuterJoint: readonly [number, number];
  fourthOuterJoint: readonly [number, number];
  /** Claim 1/3 use one coincident axis; Claim 6 uses two axes on rigid tool 13. */
  toolJoints: readonly [readonly [number, number], readonly [number, number]];
  tool: readonly [number, number];
  /** Claim 6's illustrative Y-link meeting point. */
  yLinkHub: readonly [number, number] | null;
  independentClaim: 1 | 3 | 6;
  /** Claims 2/5 add this connected transmission; Claim 6 fixes attitude instead. */
  beltTransmissionAvailable: boolean;
  positionLaw: string;
  refusal: {
    refused: true;
    reason: string;
  };
}

export interface MakinoScaraInvariantMeasurements {
  baseAxisGap: number;
  firstDrivenLinkLength: number;
  fourthDrivenLinkLength: number;
  secondFollowerLength: number;
  thirdFollowerLength: number;
  toolPivotGap: number;
  fixedMemberError: number;
}

function finite(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function clampAngle(value: number): number {
  return Math.max(-180, Math.min(180, value));
}

function add(
  left: readonly [number, number],
  right: readonly [number, number],
): readonly [number, number] {
  return [left[0] + right[0], left[1] + right[1]];
}

function subtract(
  end: readonly [number, number],
  start: readonly [number, number],
): readonly [number, number] {
  return [end[0] - start[0], end[1] - start[1]];
}

function vectorLength(value: readonly [number, number]): number {
  return Math.hypot(value[0], value[1]);
}

/**
 * Solve the shared distal joint of the offset-axis four-link form using two
 * fixed-length followers. The lower source-sheet assembly branch matches
 * Figure 4 and, unlike an endpoint average, never stretches either bar while
 * the base motors move.
 */
function solveOffsetToolJoint(
  firstOuterJoint: readonly [number, number],
  fourthOuterJoint: readonly [number, number],
): readonly [number, number] {
  const chord = subtract(fourthOuterJoint, firstOuterJoint);
  const chordLength = Math.hypot(chord[0], chord[1]);
  if (chordLength <= Number.EPSILON) {
    return [firstOuterJoint[0], firstOuterJoint[1] - MAKINO_EXHIBIT_OFFSET_FOLLOWER_LENGTH];
  }
  const safeLength = Math.max(chordLength, Number.EPSILON);
  const midpoint: readonly [number, number] = [
    (firstOuterJoint[0] + fourthOuterJoint[0]) / 2,
    (firstOuterJoint[1] + fourthOuterJoint[1]) / 2,
  ];
  const halfChord = Math.min(chordLength / 2, MAKINO_EXHIBIT_OFFSET_FOLLOWER_LENGTH);
  const height = Math.sqrt(
    Math.max(0, MAKINO_EXHIBIT_OFFSET_FOLLOWER_LENGTH ** 2 - halfChord ** 2),
  );
  const perpendicular: readonly [number, number] = [-chord[1] / safeLength, chord[0] / safeLength];
  const firstCandidate: readonly [number, number] = [
    midpoint[0] + perpendicular[0] * height,
    midpoint[1] + perpendicular[1] * height,
  ];
  const secondCandidate: readonly [number, number] = [
    midpoint[0] - perpendicular[0] * height,
    midpoint[1] - perpendicular[1] * height,
  ];
  if (firstCandidate[1] !== secondCandidate[1]) {
    return firstCandidate[1] < secondCandidate[1] ? firstCandidate : secondCandidate;
  }
  return firstCandidate[0] < secondCandidate[0] ? firstCandidate : secondCandidate;
}

export function readMakinoScaraControls(params: MakinoScaraControlParams): MakinoScaraControls {
  return {
    firstLinkAngleDeg: clampAngle(
      finite(params.firstLinkAngleDeg, MAKINO_SCARA_DEFAULT_CONTROLS.firstLinkAngleDeg),
    ),
    fourthLinkAngleDeg: clampAngle(
      finite(params.fourthLinkAngleDeg, MAKINO_SCARA_DEFAULT_CONTROLS.fourthLinkAngleDeg),
    ),
    toolAttitudeDeg: clampAngle(
      finite(params.toolAttitudeDeg, MAKINO_SCARA_DEFAULT_CONTROLS.toolAttitudeDeg),
    ),
    topologyVariant: Math.max(
      1,
      Math.min(
        3,
        Math.round(finite(params.topologyVariant, MAKINO_SCARA_DEFAULT_CONTROLS.topologyVariant)),
      ),
    ),
  };
}

/**
 * Deterministic drawing/kinematic pose shared by 2D and Three.js faces.
 *
 * The Claim 1 base anchors are exactly coincident because the printed form is
 * coaxial. Claim 3 and Claim 6 use a declared display span to distinguish the
 * source-described offset alternatives; that span is not a recovered length.
 */
export function stepMakinoScaraTopology(params: MakinoScaraControlParams): MakinoScaraPose {
  const controls = readMakinoScaraControls(params);
  const firstLinkAngleRad = (controls.firstLinkAngleDeg * Math.PI) / 180;
  const fourthLinkAngleRad = (controls.fourthLinkAngleDeg * Math.PI) / 180;
  const requestedToolAttitudeRad = (controls.toolAttitudeDeg * Math.PI) / 180;

  const topology =
    controls.topologyVariant === 1
      ? "claim-1-concentric"
      : controls.topologyVariant === 2
        ? "claim-3-offset"
        : "claim-6-y-link";
  const independentClaim =
    controls.topologyVariant === 1 ? 1 : controls.topologyVariant === 2 ? 3 : 6;

  const displaySpan = topology === "claim-1-concentric" ? 0 : MAKINO_EXHIBIT_BASE_SPAN;
  const firstBase: readonly [number, number] = displaySpan === 0 ? [0, 0] : [-displaySpan / 2, 0];
  const fourthBase: readonly [number, number] = displaySpan === 0 ? [0, 0] : [displaySpan / 2, 0];
  const firstOuterJoint: readonly [number, number] = [
    firstBase[0] + MAKINO_EXHIBIT_LINK_LENGTH * Math.cos(firstLinkAngleRad),
    firstBase[1] + MAKINO_EXHIBIT_LINK_LENGTH * Math.sin(firstLinkAngleRad),
  ];
  const fourthOuterJoint: readonly [number, number] = [
    fourthBase[0] + MAKINO_EXHIBIT_LINK_LENGTH * Math.cos(fourthLinkAngleRad),
    fourthBase[1] + MAKINO_EXHIBIT_LINK_LENGTH * Math.sin(fourthLinkAngleRad),
  ];

  const firstVector = subtract(firstOuterJoint, firstBase);
  const fourthVector = subtract(fourthOuterJoint, fourthBase);

  // Figure 1 expressly makes links 6/5 and 7/4 equal and parallel. Figure 6
  // repeats that closure around a rigid two-pivot tool and the three arms of
  // Y-link 14. Figure 4 is not a parallelogram, so its two fixed follower bars
  // meet at the lower branch of a circle-circle closure instead.
  const concentricTool = add(firstOuterJoint, fourthVector);
  const offsetTool = solveOffsetToolJoint(firstOuterJoint, fourthOuterJoint);
  const yToolLeft = add(firstOuterJoint, fourthVector);
  const yToolRight = add(fourthOuterJoint, firstVector);
  const toolJoints: readonly [readonly [number, number], readonly [number, number]] =
    topology === "claim-6-y-link"
      ? [yToolLeft, yToolRight]
      : topology === "claim-1-concentric"
        ? [concentricTool, concentricTool]
        : [offsetTool, offsetTool];
  const tool: readonly [number, number] = [
    (toolJoints[0][0] + toolJoints[1][0]) / 2,
    (toolJoints[0][1] + toolJoints[1][1]) / 2,
  ];
  // Claim 6 connects Y-link 14 to the first outer axis, the second motor
  // shaft, and the tool's third axis. The first two points form a
  // parallelogram with the base span, fixing this hub exactly.
  const yLinkHub: readonly [number, number] | null =
    topology === "claim-6-y-link" ? add(fourthBase, firstVector) : null;
  // Claims 2 and 5 add a belt-driven attitude coordinate. Independent Claim
  // 6 instead requires tool 13 to move without altering its attitude.
  const toolAttitudeRad = topology === "claim-6-y-link" ? 0 : requestedToolAttitudeRad;

  return {
    topology,
    firstLinkAngleRad,
    fourthLinkAngleRad,
    toolAttitudeRad,
    firstBase,
    fourthBase,
    firstOuterJoint,
    fourthOuterJoint,
    toolJoints,
    tool,
    yLinkHub,
    independentClaim,
    beltTransmissionAvailable: topology !== "claim-6-y-link",
    positionLaw:
      topology === "claim-1-concentric"
        ? "p_tool = p_base + u₁(θ₁) + u₄(θ₂), exact normalized parallelogram closure; normalized exhibit coordinates only"
        : topology === "claim-3-offset"
          ? "||p_tool - p₆|| = ||p_tool - p₇|| = 1.4 display units, fixed-link circle-intersection closure; normalized exhibit coordinates only"
          : "p_left = p₄ + u₅, p_right = p₅ + u₄, with tool 13 parallel to the base through three normalized parallelogram closures",
    refusal: {
      refused: true,
      reason: `US 4,341,502 does not state link lengths, mass properties, payload, motor torque, stiffness, clearance, or controller gains. ${MAKINO_FRANKENSIM_OWNER} owns each source-described vertical pivot, but FrankenSim's articulated-body lane is a tree and the grant cannot parameterize a closed-chain SI solve. This shared kernel therefore reports exact normalized topology only and refuses SI dynamics and contact-force claims.`,
    },
  };
}

/** Quantifies the source topology without promoting display lengths to metres. */
export function measureMakinoScaraInvariants(
  pose: MakinoScaraPose,
): MakinoScaraInvariantMeasurements {
  const firstDrivenLinkLength = vectorLength(subtract(pose.firstOuterJoint, pose.firstBase));
  const fourthDrivenLinkLength = vectorLength(subtract(pose.fourthOuterJoint, pose.fourthBase));
  const secondFollowerLength = vectorLength(subtract(pose.toolJoints[0], pose.firstOuterJoint));
  const thirdFollowerLength = vectorLength(subtract(pose.toolJoints[1], pose.fourthOuterJoint));
  const baseAxisGap = vectorLength(subtract(pose.fourthBase, pose.firstBase));
  const toolPivotGap = vectorLength(subtract(pose.toolJoints[1], pose.toolJoints[0]));
  const expectedFollowerLength =
    pose.topology === "claim-3-offset"
      ? MAKINO_EXHIBIT_OFFSET_FOLLOWER_LENGTH
      : MAKINO_EXHIBIT_LINK_LENGTH;
  const expectedAxisGap = pose.topology === "claim-1-concentric" ? 0 : MAKINO_EXHIBIT_BASE_SPAN;
  const expectedToolPivotGap = pose.topology === "claim-6-y-link" ? MAKINO_EXHIBIT_BASE_SPAN : 0;
  const fixedMemberError = Math.max(
    Math.abs(firstDrivenLinkLength - MAKINO_EXHIBIT_LINK_LENGTH),
    Math.abs(fourthDrivenLinkLength - MAKINO_EXHIBIT_LINK_LENGTH),
    Math.abs(secondFollowerLength - expectedFollowerLength),
    Math.abs(thirdFollowerLength - expectedFollowerLength),
    Math.abs(baseAxisGap - expectedAxisGap),
    Math.abs(toolPivotGap - expectedToolPivotGap),
  );

  return {
    baseAxisGap,
    firstDrivenLinkLength,
    fourthDrivenLinkLength,
    secondFollowerLength,
    thirdFollowerLength,
    toolPivotGap,
    fixedMemberError,
  };
}
