import { stepLamarrRecordControl } from "./catalogKernels";
import type { TapeUpdater } from "./useFrankenSimPhysics";

export interface LamarrRuntimeControls {
  readonly recordPosition: number;
  readonly commandTone: 100 | 500;
  readonly claim1SynchronizedRecordsPresent: boolean;
}

export function readLamarrRuntimeControls(
  raw?: Partial<Record<keyof LamarrRuntimeControls, number>>,
): LamarrRuntimeControls {
  return {
    recordPosition: Math.max(0, Math.min(6, Math.round(raw?.recordPosition ?? 0))),
    commandTone: raw?.commandTone === 500 ? 500 : 100,
    claim1SynchronizedRecordsPresent:
      raw?.claim1SynchronizedRecordsPresent === undefined
        ? true
        : Number(raw.claim1SynchronizedRecordsPresent) >= 0.5,
  };
}

export type LamarrTapeFrame = ReturnType<typeof stepLamarrRecordControl>;

let tapeFrame: LamarrTapeFrame | undefined;

export function getLamarrTapeFrame(): LamarrTapeFrame | undefined {
  return tapeFrame;
}

/** Reproject current controls without inventing continuous record motion. */
export function readLamarrTapeFrame(controls: LamarrRuntimeControls): LamarrTapeFrame {
  if (
    tapeFrame?.recordPosition === controls.recordPosition &&
    tapeFrame.commandTone === controls.commandTone &&
    tapeFrame.recordSynchronizationPresent === controls.claim1SynchronizedRecordsPresent
  ) {
    return tapeFrame;
  }
  return stepLamarrRecordControl(controls);
}

export function resetLamarrTape(): void {
  tapeFrame = undefined;
}

/** One stable owner publishes discrete A–G record state to every projection. */
export function createLamarrTransportUpdater(
  getControls: () => LamarrRuntimeControls,
): TapeUpdater {
  return () => {
    const controls = getControls();
    if (
      tapeFrame?.recordPosition === controls.recordPosition &&
      tapeFrame.commandTone === controls.commandTone &&
      tapeFrame.recordSynchronizationPresent === controls.claim1SynchronizedRecordsPresent
    ) {
      return null;
    }
    tapeFrame = stepLamarrRecordControl(controls);
    return {
      domain: "electromagnetics_flux",
      refusal: tapeFrame.recordSynchronizationPresent
        ? { isRefused: false }
        : {
            isRefused: true,
            reason: tapeFrame.refusalReason ?? "Claim 1 record synchronization is withheld.",
          },
      machine: {
        poseXMeters: tapeFrame.recordPosition,
        poseYMeters: 0,
        headingRad: 0,
        modeLabel: !tapeFrame.recordSynchronizationPresent
          ? `receiver record withheld; transmitter row ${tapeFrame.transmitterRow}`
          : tapeFrame.receiverEffective
            ? `matched row ${tapeFrame.transmitterRow}`
            : `transmitter-only row ${tapeFrame.transmitterRow}`,
        wheelSpeedMps: 0,
      },
    };
  };
}
