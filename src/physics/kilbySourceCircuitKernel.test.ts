import { describe, expect, test } from "bun:test";
import {
  KILBY_FIGURE_7_VALUES,
  KILBY_PRINTED_WAFER,
  KILBY_SOURCE_CIRCUIT_DEFAULTS,
  readKilbySourceCircuitControls,
  stepKilbySourceCircuitTopology,
} from "./kilbySourceCircuitKernel";

describe("US 3,138,743 source-bounded monolithic circuit topology", () => {
  test("pins the construction dimensions and Figure 7 values printed by the grant", () => {
    expect(KILBY_PRINTED_WAFER).toMatchObject({
      lengthIn: 0.2,
      widthIn: 0.08,
      thicknessIn: 0.0025,
      resistivityOhmCm: 3,
      nLayerDepthMil: 0.7,
    });
    expect(KILBY_FIGURE_7_VALUES).toEqual({
      r1R2Ohms: 3000,
      r3R8Ohms: 1800,
      r4R5R6R7Ohms: 400,
      c1C2Microfarads: 50,
    });
  });

  test("keeps active and passive organs integral to one wafer while refusing performance", () => {
    const state = stepKilbySourceCircuitTopology(KILBY_SOURCE_CIRCUIT_DEFAULTS);
    expect(state.activeComponentsIntegralToWafer).toBe(true);
    expect(state.passiveComponentsIntegralToWafer).toBe(true);
    expect(state.etchedIsolationPresent).toBe(true);
    expect(state.claim1TopologyComplete).toBe(true);
    expect(state.quantitativeCircuitPerformanceAvailable).toBe(false);
    expect(state.refusal.reason).toContain("refuses transistor current");
  });

  test("Claim 1 inversion withholds only the conductive means", () => {
    const state = stepKilbySourceCircuitTopology({ claim1ConductiveMeansPresent: 0 });
    expect(state.conductiveMeansPresent).toBe(false);
    expect(state.claim1TopologyComplete).toBe(false);
    expect(state.activeComponentsIntegralToWafer).toBe(true);
    expect(state.passiveComponentsIntegralToWafer).toBe(true);
  });

  test("clamps malformed illustration controls deterministically", () => {
    expect(
      readKilbySourceCircuitControls({
        sectionRevealFraction: 4,
        wireArchFraction: Number.NaN,
        claim1ConductiveMeansPresent: -2,
      }),
    ).toEqual({
      sectionRevealFraction: 1,
      wireArchFraction: 0.55,
      claim1ConductiveMeansPresent: 0,
    });
  });
});
