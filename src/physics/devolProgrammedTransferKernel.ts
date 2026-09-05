/**
 * US 2,988,237 — Devol, Programmed Article Transfer.
 *
 * The grant describes a programmed transfer head, a position encoder whose
 * code moves with the head, a magnetic program drum, coincidence detection,
 * and an anticipator that slows travel before the true coded stop. It does
 * not print a manipulator geometry, payload, cylinder bore, hydraulic pressure,
 * mass, or timing constants. This is therefore a deterministic code-and-state
 * exhibit, not a reconstruction of a later Unimate or an SI dynamics model.
 */

export interface DevolProgramControls {
  recordedSlot: number;
  sensedSlot: number;
  bitWidth: number;
  anticipationEnabled: boolean;
  recordingMode: boolean;
  gripperClosed: boolean;
}

export const DEVOL_DEFAULT_CONTROLS: DevolProgramControls = {
  recordedSlot: 11,
  sensedSlot: 3,
  bitWidth: 6,
  anticipationEnabled: true,
  recordingMode: false,
  gripperClosed: false,
};

export interface DevolProgramParams {
  recordedSlot?: number;
  sensedSlot?: number;
  bitWidth?: number;
  anticipationEnabled?: number;
  recordingMode?: number;
  gripperClosed?: number;
}

export interface DevolProgramState {
  recordedSlot: number;
  sensedSlot: number;
  bitWidth: number;
  recordedCode: readonly boolean[];
  sensedCode: readonly boolean[];
  matchingBits: number;
  hammingDistance: number;
  coincidence: boolean;
  traversalMode: "seek" | "progressive-rate-reduction" | "true-position-hold";
  sensingRelationship: "advance-sensing" | "true-position-sensing";
  programPhase: "record" | "replay";
  gripperState: "open" | "seizing";
  positionUnit: "coded positions (not a physical distance)";
  sourceClaims: readonly number[];
  refusal: {
    refused: true;
    reason: string;
  };
}

function finiteInteger(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? Math.round(value) : fallback;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}

function bits(value: number, width: number): readonly boolean[] {
  return Array.from({ length: width }, (_, bit) => Boolean(value & (1 << (width - bit - 1))));
}

export function readDevolProgramControls(params: DevolProgramParams): DevolProgramControls {
  const p = params as Record<string, number | undefined>;
  const rawBitWidth = p.bitWidth ?? p.bits ?? p.codeBits ?? p.resolutionBits ?? p.codeWidth;
  const bitWidth = clamp(finiteInteger(rawBitWidth, DEVOL_DEFAULT_CONTROLS.bitWidth), 2, 8);
  const maximumCode = 2 ** bitWidth - 1;
  const rawRecorded =
    p.recordedSlot ??
    p.recordedCode ??
    p.programSlot ??
    p.programCode ??
    p.recordedPosition ??
    p.recorded;
  const rawSensed =
    p.sensedSlot ?? p.sensedCode ?? p.encoderSlot ?? p.encoderCode ?? p.sensedPosition ?? p.sensed;
  const rawAnticipation =
    p.anticipationEnabled ??
    p.anticipation ??
    p.claim8 ??
    p.anticipatorySensing ??
    p.advanceSensing;
  const rawMode = p.recordingMode ?? p.recordMode ?? p.claim5 ?? p.teachMode ?? p.mode;
  const rawGripper =
    p.gripperClosed ?? p.gripper ?? p.claim6 ?? p.gripperState ?? p.jawClosed ?? p.seizing;

  return {
    bitWidth,
    recordedSlot: clamp(
      finiteInteger(rawRecorded, DEVOL_DEFAULT_CONTROLS.recordedSlot),
      0,
      maximumCode,
    ),
    sensedSlot: clamp(finiteInteger(rawSensed, DEVOL_DEFAULT_CONTROLS.sensedSlot), 0, maximumCode),
    anticipationEnabled:
      (rawAnticipation ?? Number(DEVOL_DEFAULT_CONTROLS.anticipationEnabled)) >= 0.5,
    recordingMode: (rawMode ?? Number(DEVOL_DEFAULT_CONTROLS.recordingMode)) >= 0.5,
    gripperClosed: (rawGripper ?? Number(DEVOL_DEFAULT_CONTROLS.gripperClosed)) >= 0.5,
  };
}

export function stepDevolProgrammedTransfer(params: DevolProgramParams): DevolProgramState {
  const controls = readDevolProgramControls(params);
  const recordedCode = bits(controls.recordedSlot, controls.bitWidth);
  const sensedCode = bits(controls.sensedSlot, controls.bitWidth);
  const hammingDistance = recordedCode.reduce(
    (total, bit, index) => total + Number(bit !== sensedCode[index]),
    0,
  );
  const coincidence = hammingDistance === 0;
  const traversalMode = coincidence
    ? "true-position-hold"
    : controls.anticipationEnabled && controls.bitWidth - hammingDistance > 0
      ? "progressive-rate-reduction"
      : "seek";

  return {
    recordedSlot: controls.recordedSlot,
    sensedSlot: controls.sensedSlot,
    bitWidth: controls.bitWidth,
    recordedCode,
    sensedCode,
    matchingBits: controls.bitWidth - hammingDistance,
    hammingDistance,
    coincidence,
    traversalMode,
    sensingRelationship:
      controls.anticipationEnabled && !coincidence ? "advance-sensing" : "true-position-sensing",
    programPhase: controls.recordingMode ? "record" : "replay",
    gripperState: controls.gripperClosed ? "seizing" : "open",
    positionUnit: "coded positions (not a physical distance)",
    sourceClaims: [1, 2, 3, 5, 6, 8, 9, 11, 12, 13, 14, 16, 19, 25, 27, 28],
    refusal: {
      refused: true,
      reason:
        "US 2,988,237 specifies coded position coincidence and a transfer sequence, but not arm geometry, hydraulic pressure, cylinder dimensions, payload, mass, velocity, or control gains. This exhibit reports code-state topology only and refuses SI kinematics, forces, rates, and contact claims.",
    },
  };
}
