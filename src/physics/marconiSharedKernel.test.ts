import { beforeEach, describe, expect, test } from "bun:test";
import {
  createMarconiTransportUpdater,
  getMarconiTapeFrame,
  readMarconiRuntimeControls,
  readMarconiTapeFrame,
  resetMarconiTape,
} from "./marconiSharedKernel";
import type { UniversalPatentPhysicsTelemetry } from "./types";

const previous: UniversalPatentPhysicsTelemetry = {
  patentId: "us-586193-marconi-radio",
  domain: "electromagnetics_flux",
  timestampMs: 0,
  timeStepDt: 1 / 60,
  refusal: { isRefused: false },
};

describe("Marconi shared spark/receiver/reset tape", () => {
  beforeEach(resetMarconiTape);

  test("clamps non-finite controls and starts at a finite idle source state", () => {
    const controls = readMarconiRuntimeControls({
      aerialHeight: Number.NaN,
      sparkGapMm: 1e6,
      sparkVoltage: Number.NEGATIVE_INFINITY,
      sparkPulseSequence: -4,
    });
    expect(controls).toEqual({
      aerialHeightMeters: 88,
      sparkGapMm: 25,
      inductionCoilKv: 28,
      sparkPulseSequence: 0,
    });
    const frame = readMarconiTapeFrame(controls);
    expect(frame.receiverStage).toBe("idle");
    expect(frame.pulseAgeSec).toBeNull();
    expect(frame.display.mastStudioScale).toBeFinite();
    expect(frame.display.mastSvgY).toBeFinite();
    expect(frame.display.sparkGapStudioHalfSpan).toBeFinite();
    expect(frame.display.sparkGapSvgHalfSpan).toBeFinite();
    expect(frame.display.sourceBoundary).toContain("does not disclose");
  });

  test("publishes the causal stage while explicitly refusing unsupported RF quantities", () => {
    const controls = readMarconiRuntimeControls({});
    const update = createMarconiTransportUpdater(() => controls)(previous, 1 / 60);
    expect(update?.refusal).toMatchObject({ isRefused: true });
    expect(update?.refusal?.reason).toContain("frequency, power, range");
    expect(update?.em).toBeUndefined();
    expect(update?.machine?.modeLabel).toContain("reader display");
  });

  test("advances spark, propagation, coherer/relay, reset, and idle deterministically", () => {
    let controls = readMarconiRuntimeControls({});
    const updater = createMarconiTransportUpdater(() => controls);
    updater(previous, 1 / 60);
    expect(getMarconiTapeFrame()?.receiverStage).toBe("idle");

    controls = { ...controls, sparkPulseSequence: 1 };
    updater(previous, 1 / 60);
    expect(getMarconiTapeFrame()?.receiverStage).toBe("spark-discharge");
    expect(getMarconiTapeFrame()?.sparkActive).toBe(true);

    for (let index = 0; index < 10; index += 1) updater(previous, 1 / 60);
    expect(getMarconiTapeFrame()?.receiverStage).toBe("wave-propagation");
    for (let index = 0; index < 9; index += 1) updater(previous, 1 / 60);
    expect(getMarconiTapeFrame()?.receiverStage).toBe("receiver-conducting");
    expect(getMarconiTapeFrame()?.relayActive).toBe(true);
    for (let index = 0; index < 60; index += 1) updater(previous, 1 / 60);
    expect(getMarconiTapeFrame()?.receiverStage).toBe("automatic-reset");
    expect(getMarconiTapeFrame()?.resetPhase).toBeGreaterThan(0);
    for (let index = 0; index < 61; index += 1) updater(previous, 1 / 60);
    expect(getMarconiTapeFrame()?.receiverStage).toBe("idle");
    expect(getMarconiTapeFrame()?.pulseAgeSec).toBeNull();
  });

  test("replays exactly and reprojects a new pulse before the owner tick", () => {
    const run = () => {
      resetMarconiTape();
      let controls = readMarconiRuntimeControls({});
      const updater = createMarconiTransportUpdater(() => controls);
      updater(previous, 1 / 60);
      controls = { ...controls, sparkPulseSequence: 3 };
      const immediate = readMarconiTapeFrame(controls);
      updater(previous, 1 / 60);
      for (let index = 0; index < 21; index += 1) updater(previous, 1 / 60);
      return { immediate, terminal: getMarconiTapeFrame() };
    };
    const first = run();
    const second = run();
    expect(first).toEqual(second);
    expect(first.immediate.receiverStage).toBe("spark-discharge");
    expect(first.terminal?.receiverStage).toBe("receiver-conducting");
  });

  test("resetting a sequence counter cannot be mistaken for a new spark", () => {
    let controls = { ...readMarconiRuntimeControls({}), sparkPulseSequence: 4 };
    const updater = createMarconiTransportUpdater(() => controls);
    updater(previous, 1 / 60);
    expect(getMarconiTapeFrame()?.receiverStage).toBe("idle");

    controls = { ...controls, sparkPulseSequence: 5 };
    updater(previous, 1 / 60);
    expect(getMarconiTapeFrame()?.receiverStage).toBe("spark-discharge");

    controls = { ...controls, sparkPulseSequence: 0 };
    resetMarconiTape();
    updater(previous, 1 / 60);
    expect(getMarconiTapeFrame()?.receiverStage).toBe("idle");
    expect(getMarconiTapeFrame()?.pulseAgeSec).toBeNull();
  });
});
