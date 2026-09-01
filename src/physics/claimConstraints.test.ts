import { describe, expect, test } from "bun:test";
import { allPatents } from "@/data/patents";
import { applyClaimConstraintModifications, CATALOG_CLAIM_CONSTRAINTS } from "./claimConstraints";

describe("Catalog Claim Constraints & Prior-Art Inversions", () => {
  test("every numbered constraint names a claim that actually exists in the catalogue record", () => {
    for (const patent of allPatents) {
      const constraints = CATALOG_CLAIM_CONSTRAINTS[patent.id] ?? [];
      const claimNumbers = new Set(patent.claims.map((claim) => claim.number));

      if (patent.claims.length === 0) {
        expect(constraints).toEqual([]);
        continue;
      }

      expect(constraints.length).toBeGreaterThanOrEqual(1);

      for (const c of constraints) {
        expect(c.patentId).toBe(patent.id);
        expect(claimNumbers.has(c.claimNumber)).toBe(true);
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

  test("Tesla transformer Claim 1 inversion opens only the source-described common node", () => {
    const res = applyClaimConstraintModifications("us-593138-tesla-coil", {}, { 1: false });
    expect(res.modifiedParams.claim1CommonNodeConnected).toBe(0);
    expect(res.activeFailures[0]).toContain("secondary terminal is disconnected");
    expect(res.refusalWarning).toContain("SOURCE-BOUND REFUSAL");
    expect(res.modifiedParams.secondaryVoltageKv).toBeUndefined();
    expect(res.modifiedParams.resonantQ).toBeUndefined();
  });

  test("Otto Claim 1 inversion removes only the source-described charge grading", () => {
    const res = applyClaimConstraintModifications(
      "us-194047-otto-engine",
      { compressionRatio: 4.5 },
      { 1: false },
    );
    expect(res.modifiedParams.claim1ChargeGradingPresent).toBe(0);
    expect(res.modifiedParams.compressionRatio).toBe(4.5);
    expect(res.modifiedParams.thermalEfficiencyPct).toBeUndefined();
    expect(res.modifiedParams.indicatedPowerHp).toBeUndefined();
    expect(res.refusalWarning).toContain("no source-backed pressure");
  });

  test("Roomba Claim 1 inversion disables optical redirection without inventing a coverage failure", () => {
    const res = applyClaimConstraintModifications("us-6594844-roomba", {}, { 1: false });
    expect(res.modifiedParams.opticalSensorEnabled).toBe(0);
    expect(res.activeFailures[0]).toContain("intersecting emitter/detector field");
    expect(res.refusalWarning).toContain("mechanical bumper behavior is not a substitute");
    expect(res.modifiedParams.coveragePct).toBeUndefined();
  });
});
