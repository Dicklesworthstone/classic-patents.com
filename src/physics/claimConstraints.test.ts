import { describe, expect, test } from "bun:test";
import { allPatents } from "@/data/patents";
import {
  applyClaimConstraintModifications,
  applySharedClaimConstraintModifications,
  CATALOG_CLAIM_CONSTRAINTS,
  claimConstraintStateParamId,
  readSharedClaimConstraintStates,
} from "./claimConstraints";

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

  test("AMF Versatran claim inversions withhold only their source-described topology", () => {
    const claim1 = applyClaimConstraintModifications(
      "us-3212649-amf-versatran",
      { columnRotation: 0.4, teachReplayMode: 1 },
      { 1: false, 8: true },
    );
    expect(claim1.activeFailures).toEqual([
      "Claim 1 topology withheld: the display no longer represents the six-actuator hydraulic/servo-valve combination.",
    ]);
    expect(claim1.refusalWarning).toContain("supplies no pressure");
    expect(claim1.modifiedParams).toEqual({ columnRotation: 0.4, teachReplayMode: 1 });

    const claim8 = applyClaimConstraintModifications(
      "us-3212649-amf-versatran",
      { columnRotation: 0.4, teachReplayMode: 0 },
      { 1: true, 8: false },
    );
    expect(claim8.activeFailures).toEqual([
      "Claim 8 topology withheld: the display no longer represents the source-described programming-arm, recording, and repetitive-playback path.",
    ]);
    expect(claim8.modifiedParams).toEqual({ columnRotation: 0.4, teachReplayMode: 0 });
  });

  test("Clavel Delta Robot claim inversions withhold only source-described topology", () => {
    const claimOne = applyClaimConstraintModifications(
      "us-4976582-clavel-delta-robot",
      { armOneInput: 0.2, armTwoInput: -0.1, armThreeInput: 0.3 },
      { 1: false, 2: true, 8: true },
    );
    expect(claimOne.modifiedParams.claim1TopologyEnabled).toBe(0);
    expect(claimOne.activeFailures).toEqual([
      "Claim 1 topology withheld: the display no longer represents the three-actuator, attitude-preserving parallel device.",
    ]);
    expect(claimOne.refusalWarning).toContain("no dimensions");

    const narrowerClaims = applyClaimConstraintModifications(
      "us-4976582-clavel-delta-robot",
      { armOneInput: 0.2 },
      { 1: true, 2: false, 8: false },
    );
    expect(narrowerClaims.modifiedParams.claim2PairedBarsEnabled).toBe(0);
    expect(narrowerClaims.modifiedParams.claim8BaseMotorEnabled).toBe(0);
    expect(narrowerClaims.activeFailures).toEqual([
      "Claim 2 topology withheld: the display no longer represents the source-described paired parallel linking bars.",
      "Claim 8 topology withheld: the display no longer represents the base-mounted supplementary working-member motor form.",
    ]);
    expect(narrowerClaims.refusalWarning).toBeNull();
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

  test("reads missing shared claim keys as active and explicit hidden keys as inverted", () => {
    const patentId = "us-2846084-goertz-electronic-master-slave-manipulator";
    expect(readSharedClaimConstraintStates(patentId, {})).toEqual({
      9: true,
      10: true,
      11: true,
      12: true,
    });
    expect(
      readSharedClaimConstraintStates(patentId, {
        [claimConstraintStateParamId(9)]: 0,
        [claimConstraintStateParamId(10)]: 0.49,
        [claimConstraintStateParamId(11)]: 0.5,
      }),
    ).toEqual({ 9: false, 10: false, 11: true, 12: true });
  });

  test("derives Goertz claim predicates without overwriting raw component controls", () => {
    const raw = {
      forceReflectionEnabled: 1,
      limiterEnabled: 1,
      tachometerDampingEnabled: 1,
      [claimConstraintStateParamId(9)]: 0,
      [claimConstraintStateParamId(12)]: 0,
    };
    const result = applySharedClaimConstraintModifications(
      "us-2846084-goertz-electronic-master-slave-manipulator",
      raw,
    );

    expect(raw.forceReflectionEnabled).toBe(1);
    expect(raw.limiterEnabled).toBe(1);
    expect(result.modifiedParams.forceReflectionEnabled).toBe(0);
    expect(result.modifiedParams.limiterEnabled).toBe(0);
    expect(result.modifiedParams.tachometerDampingEnabled).toBe(0);
    expect(result.activeFailures).toHaveLength(2);
    expect(result.refusalWarning).toContain("no quantitative safety");
  });

  test("warehouse inversions withhold automatic addressing and Claim 1 bay transfer only", () => {
    const claimOne = applyClaimConstraintModifications(
      "us-3119501-lemelson-automatic-warehousing",
      { automaticAddressing: 1, shuttleExtensionFraction: 0.8, railAddressFraction: 0.4 },
      { 1: false, 3: true },
    );
    expect(claimOne.modifiedParams.automaticAddressing).toBe(0);
    expect(claimOne.modifiedParams.shuttleExtensionFraction).toBe(0);
    expect(claimOne.modifiedParams.railAddressFraction).toBe(0.4);
    expect(claimOne.refusalWarning).toContain("establishes no speed");

    const claimThree = applyClaimConstraintModifications(
      "us-3119501-lemelson-automatic-warehousing",
      { automaticAddressing: 1, shuttleExtensionFraction: 0.8 },
      { 1: true, 3: false },
    );
    expect(claimThree.modifiedParams.automaticAddressing).toBe(0);
    expect(claimThree.modifiedParams.shuttleExtensionFraction).toBe(0.8);
  });

  test("adjustable-manipulator inversions map every registered claim to a kernel predicate", () => {
    const result = applyClaimConstraintModifications(
      "us-3260375-lemelson-adjustable-manipulator",
      { cyclePhase: 2 },
      { 1: false, 8: false, 15: false },
    );
    expect(result.modifiedParams.claim1SelectedSwitchesEnabled).toBe(0);
    expect(result.modifiedParams.claim8BistableSwitchEnabled).toBe(0);
    expect(result.modifiedParams.claim15ServoHandoffEnabled).toBe(0);
    expect(result.activeFailures).toHaveLength(3);
    expect(result.refusalWarning).toContain("no travel limit");
  });
});
