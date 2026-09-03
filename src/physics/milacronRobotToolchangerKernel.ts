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

export const MILACRON_FRANKENSIM_JOINT_OWNER = "fs-mbd::JointModel::prismatic";
export const MILACRON_FRANKENSIM_CONTACT_OWNER =
  "fs-contact::normal_patch + fs-tribo::partial_slip";
export const MILACRON_FRANKENSIM_BOUNDARY =
  "generic prismatic-joint, normal-contact, and friction owners identified; SI actuation and wedge retention refused";

export type MilacronToolchangerPhase =
  | "adapter-empty"
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
  claimFourTMemberSelected: boolean;
  claimFourRampCaptured: boolean;
  releasePermitted: boolean;
  /** Requested display positions remain visible so an interlock is inspectable. */
  requestedLockingSlideFraction: number;
  requestedRegistrationFraction: number;
  /** Effective positions are the physically admissible state rendered on both faces. */
  lockingSlideFraction: number;
  registrationFraction: number;
  registrationMotionBlocked: boolean;
  sequenceValid: boolean;
  sequenceNote: string;
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

const SOURCE_BOUNDARY_NOTE = `US 4,512,709 supplies registration-and-ramp-capture topology but no actuator pressure, cylinder bore, stroke, ramp angle, friction, preload, mass, holding load, cycle time, or positional tolerance. ${MILACRON_FRANKENSIM_JOINT_OWNER} owns slide translation and ${MILACRON_FRANKENSIM_CONTACT_OWNER} owns an eventual wedge-contact solve, but the source card cannot parameterize either SI model. The shared kernel refuses force, energy, timing, and reliability results.`;

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
  const requestedRegistrationFraction = controls.registrationFraction;
  const requestedLockingSlideFraction = controls.lockingSlideFraction;
  const registrationMotionBlocked =
    toolBasePresent && requestedLockingSlideFraction > 0 && requestedRegistrationFraction < 1;
  // The locked slide bears on the retention head and cannot coexist with a
  // withdrawn or partly admitted member. The slide therefore wins an invalid
  // stateless control combination and holds the base seated. UI interlocks
  // prevent visitors from entering this combination during normal operation.
  const registrationFraction = !toolBasePresent
    ? 0
    : registrationMotionBlocked
      ? 1
      : requestedRegistrationFraction;
  const lockingSlideFraction = requestedLockingSlideFraction;
  const registrationComplete = toolBasePresent && registrationFraction === 1;
  const apertureAligned = lockingSlideFraction === 0;
  const lockingSlideEngaged = lockingSlideFraction === 1;
  const retentionMemberAdmitted = registrationComplete;
  const toolRetained = registrationComplete && lockingSlideEngaged;
  const claimFourTMemberSelected = controls.claimFourTMember >= 0.5;
  const claimFourRampCaptured = toolRetained && claimFourTMemberSelected;
  const sequenceValid = !registrationMotionBlocked;
  const sequenceNote = registrationMotionBlocked
    ? "Withdrawal or admission is blocked until slide aperture 34 is fully aligned."
    : !toolBasePresent
      ? "The adapter is empty; present a common tool base while aperture 34 is aligned."
      : !registrationComplete
        ? "Move the common base onto locating pins 43 and 44 before closing slide 33."
        : apertureAligned
          ? "The base is registered and released; slide 33 may now move to its locking position."
          : lockingSlideEngaged
            ? "The base is registered and retained; align aperture 34 before withdrawal."
            : "Slide 33 is moving between its source-described terminal positions; no withdrawal is permitted.";

  const phase: MilacronToolchangerPhase = !toolBasePresent
    ? "adapter-empty"
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
    admissionPermitted: toolBasePresent && apertureAligned,
    lockingSlideEngaged,
    retentionMemberAdmitted,
    toolRetained,
    claimFourTMemberSelected,
    claimFourRampCaptured,
    releasePermitted: registrationComplete && apertureAligned,
    requestedLockingSlideFraction,
    requestedRegistrationFraction,
    lockingSlideFraction,
    registrationFraction,
    registrationMotionBlocked,
    sequenceValid,
    sequenceNote,
    quantitativeMechanicsRefused: true,
    sourceBoundary: { note: SOURCE_BOUNDARY_NOTE, isRefused: true },
  };
}
