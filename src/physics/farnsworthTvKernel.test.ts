import { afterEach, describe, expect, test } from "bun:test";
import { stepFarnsworthRasterFrame } from "./catalogKernels";
import { FrankenSimEngine } from "./engine";
import {
  createFarnsworthTvTransportUpdater,
  DEFAULT_FARNSWORTH_CONTROLS,
  getFarnsworthTvTapeFrame,
  readFarnsworthTvControls,
  resetFarnsworthTvTape,
} from "./farnsworthTvKernel";

afterEach(() => resetFarnsworthTvTape());

describe("US 1,773,980 shared image-dissector raster tape", () => {
  test("advances each line left-to-right, blanks retrace, then advances exactly one row", () => {
    const beam = FrankenSimEngine.stepFarnsworthTv(1.5, 120, 500, 60, 15.75, 60);
    const lineDurationSec = 1 / (0.25 * beam.scanLines);
    const early = stepFarnsworthRasterFrame(beam, lineDurationSec * 0.2);
    const late = stepFarnsworthRasterFrame(beam, lineDurationSec * 0.8);
    const retrace = stepFarnsworthRasterFrame(beam, lineDurationSec * 0.96);
    const nextLine = stepFarnsworthRasterFrame(beam, lineDurationSec * 1.02);

    expect(early.rasterLineIndex).toBe(0);
    expect(late.rasterLineIndex).toBe(0);
    expect(late.rasterXPercent).toBeGreaterThan(early.rasterXPercent);
    expect(early.inHorizontalRetrace).toBe(false);
    expect(late.inHorizontalRetrace).toBe(false);
    expect(retrace.inHorizontalRetrace).toBe(true);
    expect(retrace.rasterXPercent).toBeLessThan(late.rasterXPercent);
    expect(nextLine.rasterLineIndex).toBe(1);
    expect(nextLine.rasterXPercent).toBeLessThan(10);
  });

  test("replays one authoritative tape across transport telemetry and frozen controls", () => {
    let controls = DEFAULT_FARNSWORTH_CONTROLS;
    const updater = createFarnsworthTvTransportUpdater(() => controls);
    const first = updater({} as never, 1 / 60);
    const firstFrame = structuredClone(getFarnsworthTvTapeFrame());
    const second = updater({} as never, 1 / 60);
    const secondFrame = structuredClone(getFarnsworthTvTapeFrame());

    expect(first?.raster?.rasterLineIndex).toBe(firstFrame?.scanFrame.rasterLineIndex);
    expect(second?.raster?.rasterXPercent).toBe(secondFrame?.scanFrame.rasterXPercent);
    expect(secondFrame?.state.simTimeSec).toBeCloseTo(2 / 60, 12);

    controls = { ...controls, running: false, anodeVoltage: 3000 };
    const paused = updater({} as never, 1 / 60);
    const pausedFrame = getFarnsworthTvTapeFrame();
    expect(pausedFrame?.state.simTimeSec).toBeCloseTo(2 / 60, 12);
    expect(pausedFrame?.beamState.acceleratingVoltageVolts).toBe(3000);
    expect(paused?.raster?.rasterXPercent).toBe(pausedFrame?.scanFrame.rasterXPercent);

    const pausedAgain = updater({} as never, 1 / 60);
    expect(pausedAgain).toBeNull();
    expect(getFarnsworthTvTapeFrame()).toEqual(pausedFrame);
  });

  test("normalizes numeric runtime flags to real booleans", () => {
    expect(readFarnsworthTvControls({ running: 0 as never }).running).toBe(false);
    expect(readFarnsworthTvControls({ running: 1 as never }).running).toBe(true);
  });

  test("identical fixed-step tapes are byte-stable and control rates remain effective", () => {
    const replay = () => {
      resetFarnsworthTvTape();
      const updater = createFarnsworthTvTransportUpdater(() => DEFAULT_FARNSWORTH_CONTROLS);
      return Array.from({ length: 12 }, () => {
        const telemetry = updater({} as never, 1 / 60);
        return { telemetry, frame: structuredClone(getFarnsworthTvTapeFrame()) };
      });
    };

    expect(replay()).toEqual(replay());

    const baseline = readFarnsworthTvControls(DEFAULT_FARNSWORTH_CONTROLS);
    const fasterHorizontal = readFarnsworthTvControls({ ...baseline, horizontalFreqKhz: 30 });
    const fasterVertical = readFarnsworthTvControls({ ...baseline, verticalFreqHz: 120 });
    const baselineBeam = FrankenSimEngine.stepFarnsworthTv(
      1.5,
      120,
      500,
      baseline.scanLines,
      baseline.horizontalFreqKhz,
      baseline.verticalFreqHz,
    );
    const horizontalBeam = FrankenSimEngine.stepFarnsworthTv(
      1.5,
      120,
      500,
      fasterHorizontal.scanLines,
      fasterHorizontal.horizontalFreqKhz,
      fasterHorizontal.verticalFreqHz,
    );
    const verticalBeam = FrankenSimEngine.stepFarnsworthTv(
      1.5,
      120,
      500,
      fasterVertical.scanLines,
      fasterVertical.horizontalFreqKhz,
      fasterVertical.verticalFreqHz,
    );
    expect(stepFarnsworthRasterFrame(horizontalBeam, 0.1)).not.toEqual(
      stepFarnsworthRasterFrame(baselineBeam, 0.1),
    );
    expect(stepFarnsworthRasterFrame(verticalBeam, 0.1)).not.toEqual(
      stepFarnsworthRasterFrame(baselineBeam, 0.1),
    );
  });
});
