import { describe, expect, test } from "bun:test";
import {
  ARKWRIGHT_DEFAULT_CONTROLS,
  ARKWRIGHT_ZERO_PHASES,
  createArkwrightTransportUpdater,
  getArkwrightTapeFrame,
  readArkwrightRuntimeControls,
  stepArkwrightWaterFrame,
} from "./arkwrightKernel";

describe("Richard Arkwright Water Frame Physics Kernel (GB 931 / 1769)", () => {
  test("computes nominal textile drafting, flyer twist, and yarn tenacity with default controls", () => {
    const out = stepArkwrightWaterFrame(ARKWRIGHT_DEFAULT_CONTROLS);

    expect(out.flyerSpindleRpm).toBeGreaterThanOrEqual(3000);
    expect(out.spindleOmegaRadPerSec).toBeGreaterThan(300);
    expect(out.wheelOmegaRadPerS).toBeCloseTo((180 * 2 * Math.PI) / 60, 6);
    expect(out.feedRollerOmegaRadPerS).toBeCloseTo((((180 * 0.75) / 4.0) * 2 * Math.PI) / 60, 6);
    expect(out.deliveryRollerOmegaRadPerS).toBeCloseTo(
      (((180 * 0.75 * 6.0) / 4.0) * 2 * Math.PI) / 60,
      6,
    );
    expect(out.bobbinOmegaRadPerS).toBeCloseTo((out.bobbinRpm * 2 * Math.PI) / 60, 6);
    expect(out.totalDraftRatio).toBe(6.0);
    expect(out.outputYarnCountNe).toBe(6.0);
    expect(out.yarnLinearDensityTex).toBeCloseTo(98.42, 1);
    expect(out.twistTurnsPerMeter).toBeGreaterThan(200);
    expect(out.twistTurnsPerInch).toBeGreaterThan(5);
    expect(out.fiberParallelizationPct).toBeGreaterThan(90);
    expect(out.yarnBreakingForceN).toBeGreaterThan(1.8);
    expect(out.isWarpGradeWaterTwist).toBe(true);
    expect(out.bobbinSlipRpm).toBeGreaterThan(0);
    expect(out.millProductionKgPerDay).toBeGreaterThan(1.0);
  });

  test("attenuates yarn count and increases fiber parallelization with higher draft ratios", () => {
    const lowDraft = stepArkwrightWaterFrame({ totalDraftRatio: 3.5 });
    const highDraft = stepArkwrightWaterFrame({ totalDraftRatio: 8.0 });

    expect(highDraft.outputYarnCountNe).toBeGreaterThan(lowDraft.outputYarnCountNe);
    expect(highDraft.yarnLinearDensityTex).toBeLessThan(lowDraft.yarnLinearDensityTex);
    expect(highDraft.fiberParallelizationPct).toBeGreaterThan(lowDraft.fiberParallelizationPct);
  });

  test("verifies water wheel speed controls spindle RPM and delivery velocity", () => {
    const slow = stepArkwrightWaterFrame({ waterWheelRpm: 100 });
    const fast = stepArkwrightWaterFrame({ waterWheelRpm: 240 });

    expect(fast.flyerSpindleRpm).toBeGreaterThan(slow.flyerSpindleRpm);
    expect(fast.deliveryVelocityMPerMin).toBeGreaterThan(slow.deliveryVelocityMPerMin);
    expect(fast.productionRateGramsPerHour).toBeGreaterThan(slow.productionRateGramsPerHour);
  });

  test("integrates one deterministic transport tape and holds or resets every coordinate together", () => {
    let controls = readArkwrightRuntimeControls({
      ...ARKWRIGHT_DEFAULT_CONTROLS,
      isRunning: true,
      resetEpoch: 0,
    });
    const updater = createArkwrightTransportUpdater(() => controls);

    for (let tick = 0; tick < 12; tick += 1) updater({} as never, 1 / 60);
    const moving = getArkwrightTapeFrame();
    expect(moving).not.toBeNull();
    expect(moving?.timeSec).toBeCloseTo(12 / 60, 12);
    expect(moving?.phases.wheelRad).toBeGreaterThan(0);
    expect(moving?.phases.deliveryRollerRad).toBeGreaterThan(moving?.phases.feedRollerRad ?? 0);
    expect(moving?.phases.spindleRad).toBeGreaterThan(moving?.phases.wheelRad ?? 0);

    controls = readArkwrightRuntimeControls({
      ...ARKWRIGHT_DEFAULT_CONTROLS,
      isRunning: false,
      resetEpoch: 0,
    });
    const held = { ...(moving?.phases ?? ARKWRIGHT_ZERO_PHASES) };
    for (let tick = 0; tick < 8; tick += 1) updater({} as never, 1 / 60);
    expect(getArkwrightTapeFrame()?.phases).toEqual(held);

    controls = readArkwrightRuntimeControls({
      ...ARKWRIGHT_DEFAULT_CONTROLS,
      isRunning: false,
      resetEpoch: 1,
    });
    updater({} as never, 1 / 60);
    expect(getArkwrightTapeFrame()?.phases).toEqual(ARKWRIGHT_ZERO_PHASES);
    expect(getArkwrightTapeFrame()?.timeSec).toBe(0);
  });
});
