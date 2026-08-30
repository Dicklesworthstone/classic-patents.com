import { describe, expect, test } from "bun:test";
import { allPatents } from "@/data/patents";
import { applyClaimConstraintModifications, CATALOG_CLAIM_CONSTRAINTS } from "./claimConstraints";

describe("Catalog Claim Constraints & Prior-Art Inversions", () => {
  test("every patent in allPatents has at least one claim constraint definition", () => {
    for (const patent of allPatents) {
      const constraints = CATALOG_CLAIM_CONSTRAINTS[patent.id];
      expect(constraints).toBeDefined();
      expect(constraints.length).toBeGreaterThanOrEqual(1);

      for (const c of constraints) {
        expect(c.patentId).toBe(patent.id);
        expect(c.claimNumber).toBeGreaterThanOrEqual(1);
        expect(c.claimTitle.length).toBeGreaterThan(3);
        expect(c.activeDescription.length).toBeGreaterThan(10);
        expect(c.invertedDescription.length).toBeGreaterThan(10);
        expect(c.failureModeName.length).toBeGreaterThan(3);
        expect(c.historicalPriorArt.length).toBeGreaterThan(10);
      }
    }
  });

  test("Wright Flyer Claim 1 inversion triggers adverse yaw failure mode", () => {
    const res = applyClaimConstraintModifications(
      "us-821393-wright-flyer",
      { wingWarp: 6.0 },
      { 1: false },
    );
    expect(res.activeFailures.length).toBeGreaterThanOrEqual(1);
    expect(res.activeFailures[0]).toContain("Adverse Yaw");
    expect(res.refusalWarning).toContain("CRITICAL");
    expect(res.modifiedParams.adverseYawMultiplier).toBe(3.5);
  });

  test("Edison lightbulb Claim 1 inversion simulates atmospheric burnout", () => {
    const res = applyClaimConstraintModifications(
      "us-223898-edison-lightbulb",
      { vacuumTorr: 1e-4 },
      { 1: false },
    );
    expect(res.activeFailures.length).toBeGreaterThanOrEqual(1);
    expect(res.activeFailures[0]).toContain("Filament Burnout");
    expect(res.refusalWarning).toContain("MATERIAL REFUSAL");
    expect(res.modifiedParams.vacuumTorr).toBe(760.0);
  });

  test("Goodyear rubber Claim 1 inversion triggers plastic creep failure", () => {
    const res = applyClaimConstraintModifications(
      "us-3633-goodyear-rubber",
      { crossLinkDensity: 1.0 },
      { 1: false },
    );
    expect(res.activeFailures.length).toBeGreaterThanOrEqual(1);
    expect(res.activeFailures[0]).toContain("Plastic Flow & Creep");
    expect(res.refusalWarning).toContain("POLYMER INSTABILITY");
    expect(res.modifiedParams.crossLinkDensity).toBe(0.0);
  });

  test("Tesla motor Claim 1 inversion reports source-bound missing circuit condition", () => {
    const res = applyClaimConstraintModifications("us-381968-tesla-motor", {}, { 1: false });
    expect(res.activeFailures.length).toBeGreaterThanOrEqual(1);
    expect(res.activeFailures[0]).toContain("Source-bound Claim 1 condition absent");
    expect(res.refusalWarning).toContain("SOURCE-BOUND REFUSAL");
  });
});
