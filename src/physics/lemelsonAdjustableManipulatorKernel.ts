/**
 * US 3,260,375 — Adjustable Manipulator (Jerome H. Lemelson).
 *
 * Lemelson discloses an overhead carriage, a vertical telescoping column,
 * column azimuth rotation, an articulated wrist pivot joint, a two-jaw workpiece
 * gripper, and an electromechanical sequence controller driven by positionally
 * adjustable limit stops and bi-stable limit switches. The grant does not give
 * carriage mass, motor power or torque, gear modules, travel velocities,
 * clamping solenoid force, jaw gripping newtons, structural deflection, or
 * dynamic controller gains. This is therefore a deterministic *normalized
 * topology* kernel, which explicitly refuses SI position, velocity, force, and power inferences.
 */

export interface LemelsonManipulatorControls {
  /** Normalized overhead carriage longitudinal position [-1, 1]. */
  carriagePosition: number;
  /** Normalized vertical column extension [0, 1]. */
  columnElevation: number;
  /** Normalized column-rotation display coordinate [-1, 1]. */
  columnAzimuth: number;
  /** Normalized pivot-joint display coordinate [-1, 1]. */
  wristPivot: number;
  /** Normalized jaw closure [0 = open, 1 = fully closed]. */
  jawClosure: number;
  /** Active limit-stop sequencing phase [0..5]. */
  cyclePhase: number;
  /** Position of adjustable azimuth stop 1 [-1, 1]. */
  stop1Azimuth: number;
  /** Position of adjustable azimuth stop 2 [-1, 1]. */
  stop2Azimuth: number;
  /** Position of adjustable vertical stop 1 [0, 1]. */
  stop1Elevation: number;
  /** Position of adjustable vertical stop 2 [0, 1]. */
  stop2Elevation: number;
}

export const LEMELSON_DEFAULT_CONTROLS: LemelsonManipulatorControls = {
  carriagePosition: 0.15,
  columnElevation: 0.65,
  columnAzimuth: 0.25,
  wristPivot: -0.2,
  jawClosure: 0.45,
  cyclePhase: 2,
  stop1Azimuth: -0.75,
  stop2Azimuth: 0.75,
  stop1Elevation: 0.15,
  stop2Elevation: 0.85,
};

export const LEMELSON_MANIPULATOR_DEFAULT_CONTROLS = LEMELSON_DEFAULT_CONTROLS;

export type LemelsonManipulatorParams = Partial<Record<keyof LemelsonManipulatorControls, number>>;

export interface LemelsonDisplayPose {
  carriageNormalizedX: number;
  columnNormalizedZ: number;
  azimuthRad: number;
  /** Procedural scene-transform degrees, not a source-measured joint range. */
  azimuthDeg: number;
  pivotRad: number;
  /** Procedural scene-transform degrees, not a source-measured joint range. */
  pivotDeg: number;
  jawOpeningFraction: number;
  gripperState: "open" | "gripping" | "closed";
  toolTipX: number;
  toolTipY: number;
  toolTipZ: number;
}

export interface LemelsonSequencerState {
  phaseIndex: number;
  phaseName: string;
  activeMotor: "carriage" | "hoist" | "azimuth" | "pivot" | "jaw" | "idle";
  trippedLimitSwitches: readonly string[];
  stop1Tripped: boolean;
  stop2Tripped: boolean;
  nextScheduledAction: string;
}

export interface LemelsonManipulatorState {
  controls: LemelsonManipulatorControls;
  displayPose: LemelsonDisplayPose;
  sequencer: LemelsonSequencerState;
  activeClaim: number;
  activeClaimScope: string;
  refusal: {
    refused: true;
    reason: string;
  };
}

function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function sanitizeNumber(value: unknown, fallback: number, min: number, max: number): number {
  if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value)) {
    return fallback;
  }
  return clamp(value, min, max);
}

export function readLemelsonControls(
  params: LemelsonManipulatorParams | Record<string, number> = {},
): LemelsonManipulatorControls {
  return {
    carriagePosition: sanitizeNumber(
      params.carriagePosition,
      LEMELSON_DEFAULT_CONTROLS.carriagePosition,
      -1,
      1,
    ),
    columnElevation: sanitizeNumber(
      params.columnElevation,
      LEMELSON_DEFAULT_CONTROLS.columnElevation,
      0,
      1,
    ),
    columnAzimuth: sanitizeNumber(
      params.columnAzimuth,
      LEMELSON_DEFAULT_CONTROLS.columnAzimuth,
      -1,
      1,
    ),
    wristPivot: sanitizeNumber(params.wristPivot, LEMELSON_DEFAULT_CONTROLS.wristPivot, -1, 1),
    jawClosure: sanitizeNumber(params.jawClosure, LEMELSON_DEFAULT_CONTROLS.jawClosure, 0, 1),
    cyclePhase: Math.round(
      sanitizeNumber(params.cyclePhase, LEMELSON_DEFAULT_CONTROLS.cyclePhase, 0, 5),
    ),
    stop1Azimuth: sanitizeNumber(
      params.stop1Azimuth,
      LEMELSON_DEFAULT_CONTROLS.stop1Azimuth,
      -1,
      1,
    ),
    stop2Azimuth: sanitizeNumber(
      params.stop2Azimuth,
      LEMELSON_DEFAULT_CONTROLS.stop2Azimuth,
      -1,
      1,
    ),
    stop1Elevation: sanitizeNumber(
      params.stop1Elevation,
      LEMELSON_DEFAULT_CONTROLS.stop1Elevation,
      0,
      1,
    ),
    stop2Elevation: sanitizeNumber(
      params.stop2Elevation,
      LEMELSON_DEFAULT_CONTROLS.stop2Elevation,
      0,
      1,
    ),
  };
}

const PHASES = [
  {
    name: "Carriage Longitudinal Travel",
    motor: "carriage" as const,
    next: "Column Vertical Descend",
  },
  { name: "Column Vertical Stroke", motor: "hoist" as const, next: "Azimuth Turntable Swing" },
  { name: "Base Azimuth Rotation", motor: "azimuth" as const, next: "Wrist Articulation Pivot" },
  { name: "Wrist Bevel Joint Pivot", motor: "pivot" as const, next: "Workpiece Jaw Gripping" },
  { name: "Workpiece Gripper Actuation", motor: "jaw" as const, next: "Sequence Return to Origin" },
  { name: "Full Cycle Relay Reset", motor: "idle" as const, next: "Carriage Longitudinal Travel" },
] as const;

export function stepLemelsonManipulatorTopology(
  params: LemelsonManipulatorParams | Record<string, number> = {},
): LemelsonManipulatorState {
  const controls = readLemelsonControls(params);

  const azimuthRad = controls.columnAzimuth * Math.PI;
  const azimuthDeg = controls.columnAzimuth * 180;
  const pivotRad = controls.wristPivot * (Math.PI / 2);
  const pivotDeg = controls.wristPivot * 90;
  const jawOpeningFraction = 1 - controls.jawClosure;

  let gripperState: "open" | "gripping" | "closed" = "open";
  if (controls.jawClosure > 0.85) {
    gripperState = "closed";
  } else if (controls.jawClosure > 0.15) {
    gripperState = "gripping";
  }

  // Procedural forward projection for a normalized visual instrument. The fixed
  // display factors below are intentionally not passed off as patent dimensions.
  const armRadius = 0.85;
  const toolTipX =
    controls.carriagePosition * 1.5 + Math.cos(azimuthRad) * armRadius * Math.cos(pivotRad);
  const toolTipY = 1.8 - controls.columnElevation * 1.2 - Math.sin(pivotRad) * 0.45;
  const toolTipZ = Math.sin(azimuthRad) * armRadius * Math.cos(pivotRad);

  const displayPose: LemelsonDisplayPose = {
    carriageNormalizedX: controls.carriagePosition,
    columnNormalizedZ: controls.columnElevation,
    azimuthRad,
    azimuthDeg,
    pivotRad,
    pivotDeg,
    jawOpeningFraction,
    gripperState,
    toolTipX,
    toolTipY,
    toolTipZ,
  };

  const currentPhase = PHASES[controls.cyclePhase] ?? PHASES[0];

  // The document has several switch-actuator arrangements. The selected stage
  // chooses which relationship the exhibit makes visible; it does not merge
  // their unprinted contact tolerances into a physical controller.
  const isVerticalStopStage = controls.cyclePhase === 1;
  const isRotaryStopStage = controls.cyclePhase === 2;
  const stop1Tripped =
    (isVerticalStopStage && Math.abs(controls.columnElevation - controls.stop1Elevation) < 0.08) ||
    (isRotaryStopStage && Math.abs(controls.columnAzimuth - controls.stop1Azimuth) < 0.08);
  const stop2Tripped =
    (isVerticalStopStage && Math.abs(controls.columnElevation - controls.stop2Elevation) < 0.08) ||
    (isRotaryStopStage && Math.abs(controls.columnAzimuth - controls.stop2Azimuth) < 0.08);

  const trippedSwitches: string[] = [];
  if (stop1Tripped) trippedSwitches.push("Selected actuator/limit event 1");
  if (stop2Tripped) trippedSwitches.push("Selected actuator/limit event 2");

  const sequencer: LemelsonSequencerState = {
    phaseIndex: controls.cyclePhase,
    phaseName: currentPhase.name,
    activeMotor: currentPhase.motor,
    trippedLimitSwitches: trippedSwitches,
    stop1Tripped,
    stop2Tripped,
    nextScheduledAction: currentPhase.next,
  };

  // Claim determination
  let activeClaim = 1;
  let activeClaimScope = "Claim 1 (Guided carriage and selected-switch combination)";
  if (controls.cyclePhase === 2 && (stop1Tripped || stop2Tripped)) {
    activeClaim = 8;
    activeClaimScope = "Claim 8 (Rotatable assembly with a bi-stable limit switch)";
  } else if (controls.cyclePhase === 3) {
    activeClaim = 9;
    activeClaimScope = "Claim 9 (Pivoting joint with selectable arc limits)";
  } else if (controls.cyclePhase === 4) {
    activeClaim = 14;
    activeClaimScope = "Claim 14 (Linear, rotary, and article-seizing switch coordination)";
  } else if (controls.cyclePhase === 0) {
    activeClaim = 15;
    activeClaimScope = "Claim 15 (Selected-position conveying-cycle control)";
  }

  return {
    controls,
    displayPose,
    sequencer,
    activeClaim,
    activeClaimScope,
    refusal: {
      refused: true,
      reason:
        "US 3,260,375 provides kinematic, limit-stop, and relay topology without motor torque, speeds, payload mass, jaw clamping force, or structural elasticity data.",
    },
  };
}

export {
  type LemelsonManipulatorParams as LemelsonAdjustableManipulatorParams,
  stepLemelsonManipulatorTopology as stepLemelsonAdjustableManipulator,
};
