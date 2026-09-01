import { describe, expect, test } from "bun:test";
import {
  readDevolProgramControls,
  stepDevolProgrammedTransfer,
} from "./devolProgrammedTransferKernel";

describe("US 2,988,237 source-bounded program controller", () => {
  test("replays a deterministic code-comparison state without invented arm dynamics", () => {
    const state = stepDevolProgrammedTransfer({
      recordedSlot: 11,
      sensedSlot: 3,
      bitWidth: 6,
      anticipationEnabled: 1,
    });
    expect(state).toEqual(
      stepDevolProgrammedTransfer({
        recordedSlot: 11,
        sensedSlot: 3,
        bitWidth: 6,
        anticipationEnabled: 1,
      }),
    );
    expect(state.hammingDistance).toBeGreaterThan(0);
    expect(state.traversalMode).toBe("anticipated-slow");
    expect(state.refusal.refused).toBe(true);
    expect(state.refusal.reason).toContain("not arm geometry");
  });

  test("exposes true coincidence and the anticipator boundary", () => {
    expect(stepDevolProgrammedTransfer({ recordedSlot: 8, sensedSlot: 8 }).traversalMode).toBe(
      "true-position-hold",
    );
    expect(
      stepDevolProgrammedTransfer({ recordedSlot: 8, sensedSlot: 9, bitWidth: 4 }).traversalMode,
    ).toBe("anticipated-slow");
    expect(readDevolProgramControls({ bitWidth: 50, recordedSlot: -2 }).bitWidth).toBe(8);
    expect(readDevolProgramControls({ bitWidth: 2, recordedSlot: -2 }).recordedSlot).toBe(0);
  });
});
