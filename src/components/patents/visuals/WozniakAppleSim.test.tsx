import { describe, expect, test } from "bun:test";
import { wozniakBusCycle } from "@/physics/catalogKernels";

describe("wozniakBusCycle", () => {
  test("replays the same address and bus owner for the same tick and controls", () => {
    expect(wozniakBusCycle(0, 0)).toEqual({
      phase: 0,
      advanceRaster: false,
      dramAddress: "0x0400",
    });
    expect(wozniakBusCycle(1, 0)).toEqual({
      phase: 1,
      advanceRaster: true,
      dramAddress: "0x0431",
    });
    expect(wozniakBusCycle(59, 0.35)).toEqual(wozniakBusCycle(59, 0.35));
  });

  test("uses a deterministic fractional schedule when a video phase is stolen", () => {
    expect(wozniakBusCycle(1, 0.5).phase).toBe(1);
    expect(wozniakBusCycle(3, 0.5)).toMatchObject({ phase: 0, advanceRaster: false });
    expect(wozniakBusCycle(5, 0.5).phase).toBe(1);
  });
});
