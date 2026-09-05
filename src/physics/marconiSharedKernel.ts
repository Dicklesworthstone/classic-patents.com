import { stepMarconiRadio } from "./catalogKernels";
import type { TapeUpdater } from "./useFrankenSimPhysics";

export interface MarconiRuntimeControls {
  readonly aerialHeightMeters: number;
  readonly sparkGapMm: number;
  readonly inductionCoilKv: number;
  readonly sparkPulseSequence: number;
}

export type MarconiReceiverStage =
  | "idle"
  | "spark-discharge"
  | "wave-propagation"
  | "receiver-conducting"
  | "automatic-reset";

export interface MarconiTapeFrame {
  readonly controls: MarconiRuntimeControls;
  readonly display: ReturnType<typeof stepMarconiRadio>;
  readonly simTimeSec: number;
  readonly pulseAgeSec: number | null;
  readonly receiverStage: MarconiReceiverStage;
  readonly sparkActive: boolean;
  readonly waveActive: boolean;
  readonly receiverConducting: boolean;
  readonly relayActive: boolean;
  readonly resetActive: boolean;
  readonly resetPhase: number;
  readonly wavefrontProgress: number;
}

const SPARK_END_SEC = 0.12;
const RECEIVER_START_SEC = 0.28;
// These are deliberately slow display stages, not historical response-time
// claims. A full second per receiver action makes the mechanical cause/effect
// legible and keeps visual evidence capture deterministic on slower devices.
const RECEIVER_END_SEC = 1.25;
const RESET_END_SEC = 2.25;

function finiteClamp(value: number | undefined, fallback: number, min: number, max: number) {
  const finite = Number.isFinite(value) ? (value as number) : fallback;
  return Math.max(min, Math.min(max, finite));
}

export function readMarconiRuntimeControls(
  raw?: Partial<Record<string, number>>,
): MarconiRuntimeControls {
  const aerial =
    raw?.aerialHeight ??
    raw?.aerialHeightMeters ??
    raw?.mastHeightM ??
    raw?.mastHeight ??
    raw?.height ??
    raw?.aerial;
  const gap = raw?.sparkGapMm ?? raw?.gapMm ?? raw?.sparkGap ?? raw?.gap;
  const kv =
    raw?.sparkVoltage ??
    raw?.sparkVoltageKv ??
    raw?.inductionCoilKv ??
    raw?.voltage ??
    raw?.potentialKv;
  return {
    aerialHeightMeters: finiteClamp(aerial, 88, 10, 120),
    sparkGapMm: finiteClamp(gap, 10, 2, 25),
    inductionCoilKv: finiteClamp(kv, 28, 5, 50),
    sparkPulseSequence: Math.max(0, Math.round(finiteClamp(raw?.sparkPulseSequence, 0, 0, 1e9))),
  };
}

function sameControls(a: MarconiRuntimeControls, b: MarconiRuntimeControls): boolean {
  return (
    a.aerialHeightMeters === b.aerialHeightMeters &&
    a.sparkGapMm === b.sparkGapMm &&
    a.inductionCoilKv === b.inductionCoilKv &&
    a.sparkPulseSequence === b.sparkPulseSequence
  );
}

function projectFrame(
  controls: MarconiRuntimeControls,
  simTimeSec: number,
  pulseAgeSec: number | null,
): MarconiTapeFrame {
  const activeAge = pulseAgeSec !== null && pulseAgeSec < RESET_END_SEC ? pulseAgeSec : null;
  const sparkActive = activeAge !== null && activeAge < SPARK_END_SEC;
  const waveActive = activeAge !== null && activeAge < RECEIVER_END_SEC;
  const receiverConducting =
    activeAge !== null && activeAge >= RECEIVER_START_SEC && activeAge < RECEIVER_END_SEC;
  const relayActive = receiverConducting;
  const resetActive =
    activeAge !== null && activeAge >= RECEIVER_END_SEC && activeAge < RESET_END_SEC;
  const resetPhase = resetActive
    ? (activeAge - RECEIVER_END_SEC) / (RESET_END_SEC - RECEIVER_END_SEC)
    : 0;
  const receiverStage: MarconiReceiverStage = sparkActive
    ? "spark-discharge"
    : receiverConducting
      ? "receiver-conducting"
      : resetActive
        ? "automatic-reset"
        : waveActive
          ? "wave-propagation"
          : "idle";

  return {
    controls,
    display: stepMarconiRadio(
      controls.aerialHeightMeters,
      controls.sparkGapMm,
      controls.inductionCoilKv,
    ),
    simTimeSec,
    pulseAgeSec: activeAge,
    receiverStage,
    sparkActive,
    waveActive,
    receiverConducting,
    relayActive,
    resetActive,
    resetPhase,
    wavefrontProgress:
      activeAge === null ? 0 : Math.max(0, Math.min(1, activeAge / RECEIVER_START_SEC)),
  };
}

let tapeFrame: MarconiTapeFrame | undefined;

export function getMarconiTapeFrame(): MarconiTapeFrame | undefined {
  return tapeFrame;
}

/** Current shared frame, reprojected immediately when a control or pulse changes. */
export function readMarconiTapeFrame(controls: MarconiRuntimeControls): MarconiTapeFrame {
  if (!tapeFrame) return projectFrame(controls, 0, null);
  if (sameControls(tapeFrame.controls, controls)) return tapeFrame;
  const pulseAgeSec =
    controls.sparkPulseSequence > tapeFrame.controls.sparkPulseSequence ? 0 : tapeFrame.pulseAgeSec;
  return projectFrame(controls, tapeFrame.simTimeSec, pulseAgeSec);
}

export function resetMarconiTape(): void {
  tapeFrame = undefined;
}

/** One fixed-step source for the transmitter, receiver, reset, and telemetry faces. */
export function createMarconiTransportUpdater(
  getControls: () => MarconiRuntimeControls,
): TapeUpdater {
  return (_previous, dt) => {
    const controls = getControls();
    const controlsChanged = !tapeFrame || !sameControls(tapeFrame.controls, controls);
    const pulseChanged =
      tapeFrame !== undefined &&
      controls.sparkPulseSequence > tapeFrame.controls.sparkPulseSequence;
    const safeDt = Math.max(0, Math.min(0.1, Number.isFinite(dt) ? dt : 0));
    const nextAge = pulseChanged
      ? 0
      : tapeFrame?.pulseAgeSec === null || tapeFrame?.pulseAgeSec === undefined
        ? null
        : tapeFrame.pulseAgeSec + safeDt;
    const next = projectFrame(controls, (tapeFrame?.simTimeSec ?? 0) + safeDt, nextAge);

    if (!controlsChanged && tapeFrame?.pulseAgeSec === null && next.pulseAgeSec === null) {
      return null;
    }
    tapeFrame = next;
    return {
      domain: "electromagnetics_flux",
      refusal: {
        isRefused: true,
        reason: next.display.sourceBoundary,
      },
      machine: {
        poseXMeters: 0,
        poseYMeters: 0,
        headingRad: 0,
        modeLabel: `${next.receiverStage}; reader display ${controls.inductionCoilKv} kV / ${controls.aerialHeightMeters} m / ${controls.sparkGapMm} mm`,
        wheelSpeedMps: 0,
      },
    };
  };
}
