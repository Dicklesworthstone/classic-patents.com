import { describe, expect, test } from "bun:test";
import {
  LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS,
  readLemelsonMachineVisionControls,
  stepLemelsonMachineVisionTopology,
} from "./lemelsonMachineVisionKernel";

describe("US 3,081,379 Lemelson Machine Vision source-bounded topology", () => {
  test("establishes the Claim 1 scan, gate, and analyzing path without calibrated telemetry", () => {
    const controls = readLemelsonMachineVisionControls(LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS);
    const state = stepLemelsonMachineVisionTopology(controls);

    expect(state.scanPathActive).toBe(true);
    expect(state.synchronizedGateActive).toBe(true);
    expect(state.gatedPictureSignal).toBe(true);
    expect(state.analyzingCircuitActive).toBe(true);
    expect(state.controlOutputReady).toBe(true);
    expect(state.referenceComparison).toBe("match");
    expect(state.claimOnePathEstablished).toBe(true);
    expect(state.sourceBoundary.isRefused).toBe(true);
    expect(state.sourceBoundary.reason).toContain("does not calibrate");
  });

  test("withholds the analyzer and control path when synchronized gating is absent", () => {
    const state = stepLemelsonMachineVisionTopology({
      ...LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS,
      synchronizedGateEnabled: 0,
    });

    expect(state.scanPathActive).toBe(true);
    expect(state.synchronizedGateActive).toBe(false);
    expect(state.gatedPictureSignal).toBe(false);
    expect(state.analyzingCircuitActive).toBe(false);
    expect(state.controlOutputReady).toBe(false);
    expect(state.claimOnePathEstablished).toBe(false);
  });

  test("marks a reference difference as a logical comparison without calling it a defect", () => {
    const state = stepLemelsonMachineVisionTopology({
      ...LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS,
      referenceSignalMatches: 0,
    });

    expect(state.referenceComparison).toBe("difference");
    expect(state.controlOutputReady).toBe(true);
    expect("metrics" in state).toBe(false);
  });
});
