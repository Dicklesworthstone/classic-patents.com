/**
 * US 3,212,649 — Machine for Performing Work (AMF Versatran).
 *
 * Claim 1 names six controlled motions: column rotation, carriage lift, arm
 * travel, wrist rotation about the arm's horizontal axis, wrist swing about a
 * central vertical axis, and work-manipulating-member operation. Claims 8–11
 * add teach/record/playback and position-signal comparison. The grant does not
 * publish calibrated geometry, actuator dimensions, pressure or flow, payload,
 * mass, inertia, gain, timing, or measured accuracy. This deterministic kernel
 * is consequently a normalized topology exhibit, never an SI robot model.
 */

export interface AmfVersatranControls {
  /** Unitless display coordinate for column rotation about a vertical axis. */
  columnRotation: number;
  /** Unitless display coordinate for carriage lift along the column. */
  carriageLift: number;
  /** Unitless display coordinate for arm travel along a horizontal axis. */
  armTravel: number;
  /** Unitless display coordinate for wrist rotation about the arm/horizontal axis. */
  wristRotation: number;
  /** Unitless display coordinate for wrist swing about the central vertical axis. */
  wristSwing: number;
  /** Unitless display coordinate for work-manipulating-member operation. */
  gripperOperation: number;
  /** 0 = manual teaching / recording; 1 = automatic playback of recorded signals. */
  teachReplayMode: number;
  /**
   * Deliberately injected unitless record-versus-feedback phase offset. It
   * exposes the sign of the source-described comparison without presenting a
   * historic voltage, shaft angle, rate, or tracking measurement.
   */
  resolverPhaseOffset: number;
}

export type AmfVersatranParams = Partial<AmfVersatranControls> & Record<string, number | undefined>;

export const AMF_VERSATRAN_DEFAULT_CONTROLS: AmfVersatranControls = {
  columnRotation: 0,
  carriageLift: 0.55,
  armTravel: 0.55,
  wristRotation: 0,
  wristSwing: 0,
  gripperOperation: 0.25,
  teachReplayMode: 0,
  resolverPhaseOffset: 0,
};

export const DEFAULT_VERSATRAN_CONTROLS = AMF_VERSATRAN_DEFAULT_CONTROLS;

export type AmfVersatranProgramMode =
  | "manual-teach-and-record"
  | "automatic-recorded-signal-playback";

export type AmfVersatranTrackingState =
  | "manual-teach-and-record"
  | "playback-in-correspondence"
  | "playback-with-illustrative-comparison-offset";

export type AmfVersatranMotionId =
  | "column-rotation"
  | "carriage-lift"
  | "arm-travel"
  | "wrist-rotation"
  | "wrist-swing"
  | "gripper-operation";

export interface AmfVersatranMotionChannel {
  readonly id: AmfVersatranMotionId;
  readonly control:
    | "columnRotation"
    | "carriageLift"
    | "armTravel"
    | "wristRotation"
    | "wristSwing"
    | "gripperOperation";
  readonly label: string;
  readonly sourceScope: string;
  readonly positionSignalKind: "resolver-associated" | "signal-generator-associated";
}

/**
 * The source lists these six hydraulic-actuator / servo-valve motions. The
 * wording intentionally preserves the two distinct wrist axes rather than
 * assigning a generic three-axis wrist vocabulary to the machine.
 */
export const AMF_VERSATRAN_MOTION_CHANNELS: readonly AmfVersatranMotionChannel[] = [
  {
    id: "column-rotation",
    control: "columnRotation",
    label: "Column rotation about a vertical axis",
    sourceScope: "Claim 1, first hydraulic actuator",
    positionSignalKind: "resolver-associated",
  },
  {
    id: "carriage-lift",
    control: "carriageLift",
    label: "Carriage lift along the column",
    sourceScope: "Claim 1, second hydraulic actuator",
    positionSignalKind: "resolver-associated",
  },
  {
    id: "arm-travel",
    control: "armTravel",
    label: "Arm travel along a horizontal axis",
    sourceScope: "Claim 1, third hydraulic actuator",
    positionSignalKind: "resolver-associated",
  },
  {
    id: "wrist-rotation",
    control: "wristRotation",
    label: "Wrist rotation about the arm/horizontal axis",
    sourceScope: "Claim 1, fourth hydraulic actuator",
    positionSignalKind: "signal-generator-associated",
  },
  {
    id: "wrist-swing",
    control: "wristSwing",
    label: "Wrist swing about a central vertical axis",
    sourceScope: "Claim 1, fifth hydraulic actuator",
    positionSignalKind: "signal-generator-associated",
  },
  {
    id: "gripper-operation",
    control: "gripperOperation",
    label: "Gripper operation",
    sourceScope: "Claim 1, sixth hydraulic actuator",
    positionSignalKind: "signal-generator-associated",
  },
] as const;

export interface AmfVersatranComparisonChannel {
  readonly motion: "column-rotation" | "carriage-lift" | "arm-travel";
  readonly label: string;
  /** Unitless recorded-command display phase, [0, 1). */
  readonly recordedSignalPhase: number;
  /** Unitless feedback-position display phase, [0, 1). */
  readonly feedbackSignalPhase: number;
  /** wrap(phi_recorded - phi_feedback), a signed unitless display value. */
  readonly normalizedPhaseError: number;
}

export interface AmfVersatranDisplayPose {
  /**
   * Shared 2D / 3D drawing coordinates. They are normalized museum anchors,
   * not metres, recovered link dimensions, or a source-backed work envelope.
   */
  readonly normalizedToolPosition: readonly [number, number, number];
  readonly normalizedArmSpan: number;
  readonly columnRotationDisplayRad: number;
  readonly wristRotationDisplayRad: number;
  readonly wristSwingDisplayRad: number;
  readonly gripperOpenFraction: number;
}

export interface AmfVersatranTopologyState {
  readonly controls: AmfVersatranControls;
  readonly programMode: AmfVersatranProgramMode;
  readonly trackingState: AmfVersatranTrackingState;
  readonly disclosedMotions: readonly AmfVersatranMotionChannel[];
  /**
   * A conservative display of the source-described recorded-command /
   * position-feedback comparison for the three basic arm motions. It does not
   * claim six named tape tracks or calibrated feedback values.
   */
  readonly comparisonChannels: readonly AmfVersatranComparisonChannel[];
  readonly maximumNormalizedPhaseError: number;
  readonly displayPose: AmfVersatranDisplayPose;
  readonly activeClaim: 1 | 8 | 12;
  readonly phaseComparisonLaw: string;
  readonly positionLaw: string;
  readonly refusal: {
    readonly refused: true;
    readonly reason: string;
  };
}

const SOURCE_BOUNDARY_REASON =
  "US 3,212,649 supplies a six-motion manipulator topology, hydraulic/servo architecture, recorded-signal playback, and a position-signal comparison path, but not calibrated link dimensions, cylinder bore or stroke, pressure, flow, payload, mass, inertia, valve coefficients, gear ratios, controller gains, timing, or measured accuracy. This shared kernel reports unitless configuration and comparison topology only and refuses SI position, velocity, force, energy, pressure, and performance prediction.";

function finite(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function unit(value: number | undefined, fallback: number): number {
  return clamp(finite(value, fallback), 0, 1);
}

function signedUnit(value: number | undefined, fallback: number): number {
  return clamp(finite(value, fallback), -1, 1);
}

function binary(value: number | undefined, fallback: number): number {
  return unit(value, fallback) >= 0.5 ? 1 : 0;
}

/** Wrap an exhibit phase into [0, 1) without assigning it an SI unit. */
export function wrapAmfVersatranPhase(phase: number): number {
  const wrapped = ((phase % 1) + 1) % 1;
  return Math.round(wrapped * 1e12) / 1e12;
}

/** Shortest signed display path from feedback position signal to recorded command. */
export function signedAmfVersatranPhaseDifference(recorded: number, feedback: number): number {
  const difference = recorded - feedback;
  const wrapped = wrapAmfVersatranPhase(difference + 0.5) - 0.5;
  const rounded = Math.round(wrapped * 1e10) / 1e10;
  return rounded === -0.5 && difference > 0 ? 0.5 : rounded;
}

export function readAmfVersatranControls(params: AmfVersatranParams = {}): AmfVersatranControls {
  return {
    columnRotation: signedUnit(
      params.columnRotation,
      AMF_VERSATRAN_DEFAULT_CONTROLS.columnRotation,
    ),
    carriageLift: unit(params.carriageLift, AMF_VERSATRAN_DEFAULT_CONTROLS.carriageLift),
    armTravel: unit(params.armTravel, AMF_VERSATRAN_DEFAULT_CONTROLS.armTravel),
    wristRotation: signedUnit(params.wristRotation, AMF_VERSATRAN_DEFAULT_CONTROLS.wristRotation),
    wristSwing: signedUnit(params.wristSwing, AMF_VERSATRAN_DEFAULT_CONTROLS.wristSwing),
    gripperOperation: unit(
      params.gripperOperation,
      AMF_VERSATRAN_DEFAULT_CONTROLS.gripperOperation,
    ),
    teachReplayMode: binary(params.teachReplayMode, AMF_VERSATRAN_DEFAULT_CONTROLS.teachReplayMode),
    resolverPhaseOffset: signedUnit(
      params.resolverPhaseOffset,
      AMF_VERSATRAN_DEFAULT_CONTROLS.resolverPhaseOffset,
    ),
  };
}

export const readAMFVersatranControls = readAmfVersatranControls;

/**
 * One deterministic source-bound state for every Versatran face. In manual
 * mode the display shows recorded and feedback signals in correspondence. In
 * playback, the optional phase offset makes the source-described comparator
 * relationship inspectable; it is not a machine measurement.
 */
export function stepAmfVersatranTopology(
  params: AmfVersatranParams = {},
): AmfVersatranTopologyState {
  const controls = readAmfVersatranControls(params);
  const programMode: AmfVersatranProgramMode =
    controls.teachReplayMode === 1
      ? "automatic-recorded-signal-playback"
      : "manual-teach-and-record";
  const basicMotionInputs = [
    {
      motion: "column-rotation" as const,
      label: "Column rotation position signal",
      normalizedValue: (controls.columnRotation + 1) / 2,
    },
    {
      motion: "carriage-lift" as const,
      label: "Carriage lift position signal",
      normalizedValue: controls.carriageLift,
    },
    {
      motion: "arm-travel" as const,
      label: "Arm travel position signal",
      normalizedValue: controls.armTravel,
    },
  ] as const;
  const comparisonChannels = basicMotionInputs.map((input) => {
    const recordedSignalPhase = wrapAmfVersatranPhase(input.normalizedValue);
    const feedbackSignalPhase =
      programMode === "automatic-recorded-signal-playback"
        ? wrapAmfVersatranPhase(recordedSignalPhase - controls.resolverPhaseOffset)
        : recordedSignalPhase;
    return {
      motion: input.motion,
      label: input.label,
      recordedSignalPhase,
      feedbackSignalPhase,
      normalizedPhaseError: signedAmfVersatranPhaseDifference(
        recordedSignalPhase,
        feedbackSignalPhase,
      ),
    };
  }) as readonly AmfVersatranComparisonChannel[];
  const maximumNormalizedPhaseError = Math.max(
    0,
    ...comparisonChannels.map((channel) => Math.abs(channel.normalizedPhaseError)),
  );
  const trackingState: AmfVersatranTrackingState =
    programMode === "manual-teach-and-record"
      ? "manual-teach-and-record"
      : maximumNormalizedPhaseError === 0
        ? "playback-in-correspondence"
        : "playback-with-illustrative-comparison-offset";

  // These anchors are a shared drawing convention only. They make the three
  // basic movements legible without presenting a historical dimension table.
  const normalizedArmSpan = 0.54 + controls.armTravel * 0.72;
  const columnRotationDisplayRad = controls.columnRotation * Math.PI;
  const normalizedToolPosition: readonly [number, number, number] = [
    normalizedArmSpan * Math.cos(columnRotationDisplayRad),
    0.36 + controls.carriageLift * 1.02,
    normalizedArmSpan * Math.sin(columnRotationDisplayRad),
  ];
  const displayPose: AmfVersatranDisplayPose = {
    normalizedToolPosition,
    normalizedArmSpan,
    columnRotationDisplayRad,
    wristRotationDisplayRad: controls.wristRotation * Math.PI * 0.72,
    wristSwingDisplayRad: controls.wristSwing * Math.PI * 0.58,
    gripperOpenFraction: 1 - controls.gripperOperation,
  };

  return {
    controls,
    programMode,
    trackingState,
    disclosedMotions: AMF_VERSATRAN_MOTION_CHANNELS,
    comparisonChannels,
    maximumNormalizedPhaseError,
    displayPose,
    activeClaim:
      controls.gripperOperation >= 0.5
        ? 12
        : programMode === "automatic-recorded-signal-playback"
          ? 8
          : 1,
    phaseComparisonLaw:
      "e_display = wrap(phi_recorded - phi_feedback), unitless comparison display",
    positionLaw:
      "p_display = cylindrical(column rotation, carriage lift, arm travel) plus the two disclosed normalized wrist motions",
    refusal: { refused: true, reason: SOURCE_BOUNDARY_REASON },
  };
}

export const stepAMFVersatranTopology = stepAmfVersatranTopology;
export const stepAmfVersatran = stepAmfVersatranTopology;
export type AMFVersatranControls = AmfVersatranControls;
export type AMFVersatranState = AmfVersatranTopologyState;

export function computeAmfVersatranMetrics(
  params: AmfVersatranParams = {},
): Record<string, number> {
  const state = stepAmfVersatranTopology(params);
  return {
    normalizedArmSpan: state.displayPose.normalizedArmSpan,
    normalizedToolX: state.displayPose.normalizedToolPosition[0],
    normalizedToolY: state.displayPose.normalizedToolPosition[1],
    normalizedToolZ: state.displayPose.normalizedToolPosition[2],
    normalizedComparisonErrorColumn: state.comparisonChannels[0]?.normalizedPhaseError ?? 0,
    normalizedComparisonErrorCarriage: state.comparisonChannels[1]?.normalizedPhaseError ?? 0,
    normalizedComparisonErrorArm: state.comparisonChannels[2]?.normalizedPhaseError ?? 0,
    maximumNormalizedPhaseError: state.maximumNormalizedPhaseError,
    normalizedGripperOpenFraction: state.displayPose.gripperOpenFraction,
  };
}
