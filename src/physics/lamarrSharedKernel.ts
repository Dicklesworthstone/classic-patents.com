import { stepLamarrRecordControl } from "./catalogKernels";
import type { TapeUpdater } from "./useFrankenSimPhysics";

export interface LamarrRuntimeControls {
  readonly recordPosition: number;
  readonly commandTone: 100 | 500;
}

export function readLamarrRuntimeControls(
  raw?: Partial<Record<keyof LamarrRuntimeControls, number>>,
): LamarrRuntimeControls {
  return {
    recordPosition: Math.max(0, Math.min(6, Math.round(raw?.recordPosition ?? 0))),
    commandTone: raw?.commandTone === 500 ? 500 : 100,
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
    tapeFrame.commandTone === controls.commandTone
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
      tapeFrame.commandTone === controls.commandTone
    ) {
      return null;
    }
    tapeFrame = stepLamarrRecordControl(controls);
    return {
      domain: "electromagnetics_flux",
      refusal: { isRefused: false },
      machine: {
        poseXMeters: tapeFrame.recordPosition,
        poseYMeters: 0,
        headingRad: 0,
        modeLabel: tapeFrame.receiverEffective
          ? `matched row ${tapeFrame.transmitterRow}`
          : `unmatched row ${tapeFrame.transmitterRow}`,
        wheelSpeedMps: 0,
      },
    };
  };
}
