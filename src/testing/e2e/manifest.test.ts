import { describe, expect, it } from "bun:test";
import { allPatents } from "@/data/patents";
import { buildPatentE2EScenario, getAllE2EScenarios } from "./manifest";

describe("E2E Scenario Manifest", () => {
  it("builds a valid scenario for every patent in the catalogue", () => {
    const scenarios = getAllE2EScenarios();
    expect(scenarios.length).toBe(allPatents.length);

    for (const scenario of scenarios) {
      expect(scenario.patentId).toBeDefined();
      expect(scenario.patentNumber).toBeDefined();
      expect(scenario.title).toBeDefined();
      expect(typeof scenario.isArchivalPublished).toBe("boolean");
      expect(typeof scenario.claimCount).toBe("number");
      expect(scenario.claimCount).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(scenario.primaryControls)).toBe(true);
      expect(Array.isArray(scenario.expectedTelemetryLabels)).toBe(true);
      expect(Array.isArray(scenario.claimProbeNumbers)).toBe(true);
    }
  });

  it("builds the Wright Flyer reference scenario accurately", () => {
    const wright = buildPatentE2EScenario("us-821393-wright-flyer");
    expect(wright.patentId).toBe("us-821393-wright-flyer");
    expect(wright.patentNumber).toBe("US 821,393");
    expect(wright.claimCount).toBe(18);
    expect(wright.isArchivalPublished).toBe(true);
    expect(wright.hasFigures).toBe(true);
    expect(wright.hasEnergyOmission).toBe(false);
  });

  it("builds source-bounded energy omission scenarios properly", () => {
    const pasteur = buildPatentE2EScenario("us-135245-pasteur-fermentation");
    expect(pasteur.hasEnergyOmission).toBe(true);
    expect(pasteur.energyOmissionReason).toContain("US 135,245");

    const nobel = buildPatentE2EScenario("us-78317-nobel-dynamite");
    expect(nobel.hasEnergyOmission).toBe(true);
    expect(nobel.energyOmissionReason).toContain("US 78,317");
  });

  it("throws for non-existent patent IDs", () => {
    expect(() => buildPatentE2EScenario("non-existent-patent")).toThrow();
  });
});
