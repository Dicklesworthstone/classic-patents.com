import { describe, expect, test } from "bun:test";
import {
  NOYCE_PLANAR_LEAD_DEFAULT_CONTROLS,
  readNoycePlanarLeadControls,
  stepNoycePlanarLeadTopology,
} from "./noycePlanarLeadKernel";

describe("US 2,981,877 source-bounded planar lead topology", () => {
  test("keeps the oxide-supported crossing complete without inventing circuit performance", () => {
    const state = stepNoycePlanarLeadTopology(NOYCE_PLANAR_LEAD_DEFAULT_CONTROLS);
    expect(state.oxideCrossesJunction).toBe(true);
    expect(state.adherentMetalLeadPresent).toBe(true);
    expect(state.leadFitsContactGap).toBe(true);
    expect(state.contactsRemainSeparated).toBe(true);
    expect(state.quantitativeElectricalPerformanceAvailable).toBe(false);
    expect(state.refusal.reason).toContain("refuses depletion width");
  });

  test("claim inversion withholds the oxide bridge and contact separation", () => {
    const state = stepNoycePlanarLeadTopology({ claim1OxideBridgePresent: 0 });
    expect(state.claim1TopologyComplete).toBe(false);
    expect(state.contactsRemainSeparated).toBe(false);
    expect(state.state).toBe("claim-1 oxide bridge withheld");
  });

  test("clamps malformed reader geometry controls", () => {
    expect(
      readNoycePlanarLeadControls({
        oxideThicknessUm: Number.NaN,
        leadStripWidthFraction: 8,
        contactGapFraction: -1,
      }),
    ).toEqual({
      ...NOYCE_PLANAR_LEAD_DEFAULT_CONTROLS,
      leadStripWidthFraction: 0.28,
      contactGapFraction: 0.15,
    });
  });

  test("refuses a lead strip wider than the illustrated contact gap", () => {
    const state = stepNoycePlanarLeadTopology({
      leadStripWidthFraction: 0.28,
      contactGapFraction: 0.15,
    });
    expect(state.leadFitsContactGap).toBe(false);
    expect(state.contactsRemainSeparated).toBe(false);
    expect(state.claim1TopologyComplete).toBe(false);
  });
});
