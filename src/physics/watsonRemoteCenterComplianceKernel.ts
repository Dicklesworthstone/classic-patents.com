/**
 * US 4,098,001 — Paul C. Watson, Remote Center Compliance System.
 *
 * The grant supplies a topology: radial elements converge on remote center
 * 50, axial elements accommodate translation, and claim 2 adds an anti-twist
 * member. It does not give dimensions, flexure material, stiffness, mass,
 * contact friction, force, clearance, or timing. This is therefore a shared,
 * deterministic normalized geometry exhibit. FrankenSim's `fs-solid::Rod`
 * owns the applicable geometrically exact flexure law, but the missing source
 * inputs prevent an honest material card, SI contact simulation, or WASM step.
 */

export interface WatsonRemoteCenterComplianceControls {
  /** Reader traversal of the Figure 4 then Figure 5 contact sequence, 0–1. */
  lateralContactFraction: number;
  /** Source-illustrative initial axis mismatch, 0–1. */
  axisMismatchFraction: number;
  /** Claim 1's remote radial-plus-axial topology, 1; local-wrist contrast, 0. */
  remoteCenterTopology: number;
  /** Claim 2's torque-resistant means, 1; omitted for comparison, 0. */
  antiTwistConstraint: number;
}

export const WATSON_REMOTE_CENTER_COMPLIANCE_DEFAULT_CONTROLS: WatsonRemoteCenterComplianceControls =
  {
    lateralContactFraction: 0.62,
    axisMismatchFraction: 0.44,
    remoteCenterTopology: 1,
    antiTwistConstraint: 1,
  };

export interface WatsonRemoteCenterCompliancePose {
  lateralContactFraction: number;
  axisMismatchFraction: number;
  remoteCenterTopology: boolean;
  antiTwistConstraint: boolean;
  /** Unitless drawing-space lateral accommodation. */
  translationOffset: number;
  /** First half of the illustrated contact sequence, normalized to 0–1. */
  translationPhase: number;
  /** Second half of the illustrated contact sequence, normalized to 0–1. */
  rotationPhase: number;
  /** Unitless drawing-space angular correction. */
  rotationCorrection: number;
  /** Unitless remaining mismatch after the illustrated contact sequence. */
  remainingAxisMismatch: number;
  /** 0 for a local-wrist contrast; 1 puts the center at the tool tip. */
  remoteCenterProjection: number;
  /** Which printed claim is actively made legible by the selected control. */
  /** Null when the local-wrist comparison deliberately omits Claim 1's topology. */
  activeClaim: 1 | 2 | null;
  positionLaw: string;
  refusal: {
    refused: true;
    reason: string;
  };
}

function finite(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function unit(value: number | undefined, fallback: number): number {
  return Math.max(0, Math.min(1, finite(value, fallback)));
}

export function readWatsonRemoteCenterComplianceControls(
  params: Partial<WatsonRemoteCenterComplianceControls> | Record<string, number | undefined>,
): WatsonRemoteCenterComplianceControls {
  return {
    lateralContactFraction: unit(
      params.lateralContactFraction,
      WATSON_REMOTE_CENTER_COMPLIANCE_DEFAULT_CONTROLS.lateralContactFraction,
    ),
    axisMismatchFraction: unit(
      params.axisMismatchFraction,
      WATSON_REMOTE_CENTER_COMPLIANCE_DEFAULT_CONTROLS.axisMismatchFraction,
    ),
    remoteCenterTopology: unit(
      params.remoteCenterTopology,
      WATSON_REMOTE_CENTER_COMPLIANCE_DEFAULT_CONTROLS.remoteCenterTopology,
    ),
    antiTwistConstraint: unit(
      params.antiTwistConstraint,
      WATSON_REMOTE_CENTER_COMPLIANCE_DEFAULT_CONTROLS.antiTwistConstraint,
    ),
  };
}

/**
 * Shared 2D/3D pose. `lateralContactFraction` is a reader-controlled traversal
 * of the source's two-part contact narrative: Figure 4 first accommodates the
 * lateral error, then Figure 5/5A rotates the operator about remote center 50.
 * The values are topology-normalized phase coordinates. They are never meters,
 * radians, forces, stiffnesses, or a prediction of insertion success.
 */
export function stepWatsonRemoteCenterComplianceTopology(
  params: Partial<WatsonRemoteCenterComplianceControls> | Record<string, number | undefined>,
): WatsonRemoteCenterCompliancePose {
  const controls = readWatsonRemoteCenterComplianceControls(params);
  const remoteCenterTopology = controls.remoteCenterTopology >= 0.5;
  const antiTwistConstraint = remoteCenterTopology && controls.antiTwistConstraint >= 0.5;
  const translationPhase = Math.min(1, controls.lateralContactFraction * 2);
  const rotationPhase = Math.max(0, controls.lateralContactFraction * 2 - 1);
  const rotationCorrection = controls.axisMismatchFraction * rotationPhase;

  return {
    ...controls,
    remoteCenterTopology,
    antiTwistConstraint,
    translationOffset: translationPhase,
    translationPhase,
    rotationPhase,
    rotationCorrection,
    remainingAxisMismatch: Math.max(0, controls.axisMismatchFraction - rotationCorrection),
    remoteCenterProjection: remoteCenterTopology ? 1 : 0,
    activeClaim: remoteCenterTopology ? (antiTwistConstraint ? 2 : 1) : null,
    positionLaw:
      "Figure 4 translation phase -> Figure 5 remote-center rotation phase; normalized source topology",
    refusal: {
      refused: true,
      reason:
        "US 4,098,001 gives the remote-center and flexure topology but no dimensions, section geometry, material, stiffness, force, clearance, friction, mass, or timing. fs-solid::Rod is the applicable law owner, but the shared kernel refuses an invented material/load card and reports normalized exhibit geometry only.",
    },
  };
}
