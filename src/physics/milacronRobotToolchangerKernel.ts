/**
 * Claim-topology kernel for Cincinnati Milacron's Robot Toolchanger System
 * (US 4,512,709, granted 1985-04-23).
 *
 * The grant identifies the parts and their sequence—locating pins and bushings,
 * an aligned aperture for admission/release, then a shifted locking slide whose
 * ramp captures a retention member. It prints no pressure, bore, stroke, ramp
 * angle, friction, load, or time value. This kernel therefore models only that
 * discrete source-supported topology and deliberately refuses quantitative
 * mechanics.
 */

export interface MilacronRobotToolchangerControls {
  /** Whether a common tool base is presented to the adapter. */
  toolBasePresent: number;
  /** Normalized display progress of the disclosed pin-and-bushing registration. */
  registrationFraction: number;
  /** Normalized display position of the disclosed locking slide. */
  lockingSlideFraction: number;
  /** Selects the dependent Claim 4 T-member/ramp form. */
  claimFourTMember: number;
  [key: string]: number | boolean | string | undefined;
}

export type MilacronToolchangerControls = MilacronRobotToolchangerControls;

export type MilacronToolchangerPhase =
  | "adapter-open"
  | "base-present"
  | "registered"
  | "locked"
  | "captured-t-member";

export interface MilacronRobotToolchangerState {
  phase: MilacronToolchangerPhase;
  toolBasePresent: boolean;
  registrationComplete: boolean;
  apertureAligned: boolean;
  admissionPermitted: boolean;
  lockingSlideEngaged: boolean;
  retentionMemberAdmitted: boolean;
  toolRetained: boolean;
  claimFourRampCaptured: boolean;
  releasePermitted: boolean;
  lockingSlideFraction: number;
  registrationFraction: number;
  quantitativeMechanicsRefused: true;
  sourceBoundary: {
    note: string;
    isRefused: true;
  };
}

export const MILACRON_ROBOT_TOOLCHANGER_DEFAULTS: MilacronRobotToolchangerControls = {
  toolBasePresent: 1,
  registrationFraction: 1,
  lockingSlideFraction: 1,
  claimFourTMember: 1,
};

const SOURCE_BOUNDARY_NOTE =
  "US 4,512,709 supplies registration-and-ramp-capture topology but no actuator pressure, cylinder bore, stroke, ramp angle, friction, preload, mass, holding load, cycle time, or positional tolerance. The shared kernel refuses force, energy, timing, and reliability results.";

function clampFraction(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(1, Math.max(0, value))
    : fallback;
}

/**
 * Converts visitor controls to bounded, unitless teaching states. Fractions are
 * display coordinates, not historic dimensions or distances.
 */
export function readMilacronRobotToolchangerControls(
  raw: Record<string, number | boolean | string | undefined>,
): MilacronRobotToolchangerControls {
  return {
    toolBasePresent: clampFraction(raw.toolBasePresent, 1),
    registrationFraction: clampFraction(raw.registrationFraction, 1),
    lockingSlideFraction: clampFraction(raw.lockingSlideFraction, 1),
    claimFourTMember: clampFraction(raw.claimFourTMember, 1),
  };
}

/**
 * Evaluates the single shared claim-topology state used by the badge, 2D
 * instrument, 3D studio, schematic, and specification-clause weave.
 */
export function stepMilacronRobotToolchanger(
  raw: Record<string, number | boolean | string | undefined> = MILACRON_ROBOT_TOOLCHANGER_DEFAULTS,
): MilacronRobotToolchangerState {
  const controls = readMilacronRobotToolchangerControls(raw);
  const toolBasePresent = controls.toolBasePresent >= 0.5;
  const registrationComplete = toolBasePresent && controls.registrationFraction === 1;
  const apertureAligned = controls.lockingSlideFraction === 0;
  const lockingSlideEngaged = controls.lockingSlideFraction === 1;
  const retentionMemberAdmitted = registrationComplete && apertureAligned;
  const toolRetained = registrationComplete && lockingSlideEngaged;
  const claimFourRampCaptured = toolRetained && controls.claimFourTMember >= 0.5;

  const phase: MilacronToolchangerPhase = !toolBasePresent
    ? "adapter-open"
    : claimFourRampCaptured
      ? "captured-t-member"
      : toolRetained
        ? "locked"
        : registrationComplete
          ? "registered"
          : "base-present";

  return {
    phase,
    toolBasePresent,
    registrationComplete,
    apertureAligned,
    admissionPermitted: retentionMemberAdmitted,
    lockingSlideEngaged,
    retentionMemberAdmitted,
    toolRetained,
    claimFourRampCaptured,
    releasePermitted: toolBasePresent && apertureAligned,
    lockingSlideFraction: controls.lockingSlideFraction,
    registrationFraction: controls.registrationFraction,
    quantitativeMechanicsRefused: true,
    sourceBoundary: { note: SOURCE_BOUNDARY_NOTE, isRefused: true },
  };
}
