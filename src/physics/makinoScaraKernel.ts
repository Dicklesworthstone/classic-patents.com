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
  tool: readonly [number, number];
  /** Claim 6's illustrative Y-link meeting point. */
  yLinkHub: readonly [number, number] | null;
  independentClaim: 1 | 3 | 6;
  positionLaw: string;
  refusal: {
    refused: true;
    reason: string;
  };
}

function finite(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function clampAngle(value: number): number {
  return Math.max(-180, Math.min(180, value));
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
 * `firstBase` and `fourthBase` are spaced only so a reader can see both
 * otherwise vertically concentric shaft axes in a planar museum projection.
 * They are a visualization convention, not a length recovered from the grant.
 */
export function stepMakinoScaraTopology(params: MakinoScaraControlParams): MakinoScaraPose {
  const controls = readMakinoScaraControls(params);
  const firstLinkAngleRad = (controls.firstLinkAngleDeg * Math.PI) / 180;
  const fourthLinkAngleRad = (controls.fourthLinkAngleDeg * Math.PI) / 180;
  const toolAttitudeRad = (controls.toolAttitudeDeg * Math.PI) / 180;

  const topology =
    controls.topologyVariant === 1
      ? "claim-1-concentric"
      : controls.topologyVariant === 2
        ? "claim-3-offset"
        : "claim-6-y-link";
  const independentClaim =
    controls.topologyVariant === 1 ? 1 : controls.topologyVariant === 2 ? 3 : 6;

  // A compact display separation lets two distinct shaft/link attachments be
  // legible in projection. The concentric embodiment remains labelled as
  // concentric; it is not treated as a physical lateral distance.
  const displaySpan =
    topology === "claim-1-concentric" ? MAKINO_EXHIBIT_BASE_SPAN * 0.28 : MAKINO_EXHIBIT_BASE_SPAN;
  const firstBase: readonly [number, number] = [-displaySpan / 2, 0];
  const fourthBase: readonly [number, number] = [displaySpan / 2, 0];
  const firstOuterJoint: readonly [number, number] = [
    firstBase[0] + MAKINO_EXHIBIT_LINK_LENGTH * Math.cos(firstLinkAngleRad),
    firstBase[1] + MAKINO_EXHIBIT_LINK_LENGTH * Math.sin(firstLinkAngleRad),
  ];
  const fourthOuterJoint: readonly [number, number] = [
    fourthBase[0] + MAKINO_EXHIBIT_LINK_LENGTH * Math.cos(fourthLinkAngleRad),
    fourthBase[1] + MAKINO_EXHIBIT_LINK_LENGTH * Math.sin(fourthLinkAngleRad),
  ];

  // This midpoint is an explanatory closure marker, not a claimed length
  // solution. The patent's drawing establishes link relations, while its
  // missing lengths prevent a source-faithful metre-valued FK solution.
  const tool: readonly [number, number] = [
    (firstOuterJoint[0] + fourthOuterJoint[0]) / 2,
    (firstOuterJoint[1] + fourthOuterJoint[1]) / 2,
  ];
  const yLinkHub: readonly [number, number] | null =
    topology === "claim-6-y-link"
      ? [
          (firstBase[0] + fourthOuterJoint[0] + tool[0]) / 3,
          (firstBase[1] + fourthOuterJoint[1] + tool[1]) / 3,
        ]
      : null;

  return {
    topology,
    firstLinkAngleRad,
    fourthLinkAngleRad,
    toolAttitudeRad,
    firstBase,
    fourthBase,
    firstOuterJoint,
    fourthOuterJoint,
    tool,
    yLinkHub,
    independentClaim,
    positionLaw: "p_tool = f(θ₁, θ₂; four-link topology), normalized exhibit coordinates only",
    refusal: {
      refused: true,
      reason:
        "US 4,341,502 does not state link lengths, payload, motor torque, stiffness, clearance, or controller gains. This shared kernel reports topology and normalized angular geometry only; it refuses SI dynamics and contact-force claims.",
    },
  };
}
