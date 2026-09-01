/**
 * US 4,098,001 — Paul C. Watson, Remote Center Compliance System.
 *
 * The grant supplies a topology: radial elements converge on remote center
 * 50, axial elements accommodate translation, and claim 2 adds an anti-twist
 * member. It does not give dimensions, flexure material, stiffness, mass,
 * contact friction, force, clearance, or timing. This is therefore a shared,
 * deterministic normalized geometry exhibit, not an SI contact simulation or
 * a FrankenSim/WASM step.
 */

export interface WatsonRemoteCenterComplianceControls {
  /** Source-illustrative position of the lateral chamfer contact, 0–1. */
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
 * Shared 2D/3D pose. The constants below are display extents only, so readers
 * can see the source's translation-then-rotation narrative. They are never
 * meters, degrees, forces, stiffnesses, or a prediction of insertion success.
 */
export function stepWatsonRemoteCenterComplianceTopology(
  params: Partial<WatsonRemoteCenterComplianceControls> | Record<string, number | undefined>,
): WatsonRemoteCenterCompliancePose {
  const controls = readWatsonRemoteCenterComplianceControls(params);
  const remoteCenterTopology = controls.remoteCenterTopology >= 0.5;
  const antiTwistConstraint = remoteCenterTopology && controls.antiTwistConstraint >= 0.5;
  const correctionGain = remoteCenterTopology ? 0.88 : 0.24;
  const translationGain = remoteCenterTopology ? 0.72 : 0.18;
  const rotationCorrection = controls.axisMismatchFraction * correctionGain;

  return {
    ...controls,
    remoteCenterTopology,
    antiTwistConstraint,
    translationOffset: controls.lateralContactFraction * translationGain,
    rotationCorrection,
    remainingAxisMismatch: Math.max(0, controls.axisMismatchFraction - rotationCorrection),
    remoteCenterProjection: remoteCenterTopology ? 1 : 0,
    activeClaim: remoteCenterTopology ? (antiTwistConstraint ? 2 : 1) : null,
    positionLaw:
      "normalized pose = f(lateral contact, axis mismatch, radial-plus-axial claim topology)",
    refusal: {
      refused: true,
      reason:
        "US 4,098,001 gives the remote-center and flexure topology but no dimensions, material, stiffness, force, clearance, friction, mass, or timing. The shared kernel therefore refuses SI contact dynamics and reports normalized exhibit geometry only.",
    },
  };
}
