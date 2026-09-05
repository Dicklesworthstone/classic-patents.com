import { describe, expect, test } from "bun:test";
import { allPatents } from "@/data/patents";
import { stepHallAluminium } from "./catalogKernels";
import {
  applyClaimConstraintModifications,
  applySharedClaimConstraintModifications,
  CATALOG_CLAIM_CONSTRAINTS,
  claimConstraintStateParamId,
  readSharedClaimConstraintStates,
} from "./claimConstraints";
import { stepDieselEngine } from "./dieselEngineKernel";

describe("Catalog Claim Constraints & Prior-Art Inversions", () => {
  test("every catalogue record has an explicit key in CATALOG_CLAIM_CONSTRAINTS", () => {
    expect(allPatents.length).toBe(103);
    for (const patent of allPatents) {
      expect(CATALOG_CLAIM_CONSTRAINTS[patent.id]).toBeDefined();
    }
  });

  test("every numbered constraint names a claim that actually exists in the catalogue record", () => {
    for (const patent of allPatents) {
      const constraints = CATALOG_CLAIM_CONSTRAINTS[patent.id] ?? [];
      const claimNumbers = new Set(patent.claims.map((claim) => claim.number));

      if (patent.claims.length === 0) {
        expect(constraints).toEqual([]);
        continue;
      }

      if (patent.id === "us-3671542-kwolek-kevlar") {
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

  test("Noyce Claim 1 inversion withholds only the printed oxide bridge", () => {
    const result = applyClaimConstraintModifications(
      "us-2981877-noyce-ic",
      { oxideThicknessUm: 1, leadStripWidthFraction: 0.12 },
      { 1: false },
    );
    expect(result.modifiedParams.claim1OxideBridgePresent).toBe(0);
    expect(result.modifiedParams.parasiticInductanceNh).toBeUndefined();
    expect(result.modifiedParams.propDelayPs).toBeUndefined();
    expect(result.activeFailures).toEqual([
      "Source-bound Claim 1 condition absent: the adherent conductor no longer crosses the junction on retained semiconductor oxide",
    ]);
    expect(result.refusalWarning).toContain("does not supply voltage");
  });

  test("Kilby Claim 1 inversion withholds conductive means without inventing performance", () => {
    const result = applyClaimConstraintModifications(
      "us-3138743-kilby-integrated-circuit",
      { sectionRevealFraction: 0, wireArchFraction: 0.55 },
      { 1: false },
    );
    expect(result.modifiedParams.claim1ConductiveMeansPresent).toBe(0);
    expect(result.modifiedParams.supplyVoltageV).toBeUndefined();
    expect(result.modifiedParams.collectorCurrentMa).toBeUndefined();
    expect(result.activeFailures[0]).toContain(
      "selected elongated resistor and transistor regions",
    );
    expect(result.refusalWarning).toContain("does not supply the operating point");
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

  test("Hall Aluminium Claim 1 inversion withholds fluoride flux without clobbering input controls", () => {
    const rawParams = {
      currentAmperes: 350000,
      bathTemperatureCelsius: 980,
      aluminaConcentrationPct: 6.0,
    };
    const res = applyClaimConstraintModifications("us-400766-hall-aluminium", rawParams, {
      1: false,
    });
    expect(res.activeFailures.length).toBeGreaterThanOrEqual(1);
    expect(res.activeFailures[0]).toContain("Absence of cryolite flux");
    expect(res.refusalWarning).toContain("ELECTROCHEMICAL REFUSAL");
    // Controls are preserved, not clobbered to 15 kA or 2050 °C
    expect(res.modifiedParams.currentAmperes).toBe(350000);
    expect(res.modifiedParams.bathTemperatureCelsius).toBe(980);
    expect(res.modifiedParams.aluminaConcentrationPct).toBe(6.0);
    expect(res.modifiedParams.claim1Active).toBe(0);

    const normalSim = stepHallAluminium(rawParams);
    expect(normalSim.aluminiumProductionRateKgPerHour).toBeGreaterThan(0);
    expect(normalSim.totalCellVoltage).toBeGreaterThan(0);
    expect(normalSim.productionSlopeKgPerHourPerAmpere).not.toBeNull();

    const invertedSim = stepHallAluminium(res.modifiedParams);
    expect(invertedSim.aluminiumProductionRateKgPerHour).toBe(0);
    expect(invertedSim.totalCellVoltage).toBe(0);
    expect(invertedSim.electricalPowerKw).toBe(0);
    expect(invertedSim.productionSlopeKgPerHourPerAmpere).toBeNull();
  });

  test("Diesel Engine Claim 1 inversion withholds compression ignition without clobbering controls", () => {
    const rawParams = {
      compressionRatio: 20,
      blastAirPressureBar: 70,
      cutoffRatio: 1.5,
      engineRpm: 180,
    };
    const res = applyClaimConstraintModifications("us-542846-diesel-engine", rawParams, {
      1: false,
    });
    expect(res.activeFailures.length).toBeGreaterThanOrEqual(1);
    expect(res.activeFailures[0]).toContain("Pre-Ignition Knock");
    expect(res.refusalWarning).toContain("CLAIM 1 INVERTED");
    // Controls are preserved, not clobbered to r=6, p=15
    expect(res.modifiedParams.compressionRatio).toBe(20);
    expect(res.modifiedParams.blastAirPressureBar).toBe(70);
    expect(res.modifiedParams.claim1Active).toBe(0);
    expect(res.modifiedParams.isAutoIgnition).toBe(0);

    const normalSim = stepDieselEngine(rawParams);
    expect(normalSim.isAutoIgnition).toBe(true);

    const invertedSim = stepDieselEngine(res.modifiedParams);
    expect(invertedSim.isAutoIgnition).toBe(false);
    expect(invertedSim.tCompressionC).toBe(normalSim.tCompressionC);
    expect(invertedSim.pCompBar).toBe(normalSim.pCompBar);
  });

  test("Einstein Claim 1 inversion opens only the source-described heated lift path", () => {
    const raw = { heatInput: 220, totalPressure: 15, ammoniaRatio: 0.65 };
    const result = applyClaimConstraintModifications("us-1781541-einstein-refrigerator", raw, {
      1: false,
    });

    expect(result.modifiedParams).toMatchObject({
      ...raw,
      claim1LiftPathPresent: 0,
    });
    expect(result.modifiedParams.shaftPumpEnabled).toBeUndefined();
    expect(result.modifiedParams.leakRate).toBeUndefined();
    expect(result.activeFailures[0]).toContain("conduit 32");
    expect(result.refusalWarning).toContain("supplies no operating pressure");
  });

  test("Kwolek Claim 1 has no live inversion until the complete source edition exists", () => {
    const params = { polymerConcentrationPct: 18, drawRatio: 6.5, impactVelocity: 450 };
    expect(CATALOG_CLAIM_CONSTRAINTS["us-3671542-kwolek-kevlar"]).toEqual([]);
    expect(
      applyClaimConstraintModifications("us-3671542-kwolek-kevlar", params, { 1: false }),
    ).toEqual({ modifiedParams: params, activeFailures: [], refusalWarning: null });
  });

  test("Lemelson Claim 1 inversion withholds topology rather than fabricating a performance result", () => {
    const res = applyClaimConstraintModifications(
      "us-3081379-lemelson-machine-vision",
      {
        scanPathEnabled: 1,
        synchronizedGateEnabled: 1,
        analyzingCircuitEnabled: 1,
        inspectionSignalPresent: 1,
        referenceSignalMatches: 1,
      },
      { 1: false },
    );

    expect(res.modifiedParams.scanPathEnabled).toBe(0);
    expect(res.modifiedParams.synchronizedGateEnabled).toBe(0);
    expect(res.modifiedParams.analyzingCircuitEnabled).toBe(0);
    expect(res.modifiedParams.inspectionSignalPresent).toBe(1);
    expect(res.activeFailures).toEqual([
      "Claim 1 signal path withheld: the exhibit no longer represents the source-described scan, synchronized gate, and analyzing-circuit combination.",
    ]);
    expect(res.refusalWarning).toContain("CLAIM 1 WITHHELD");
    expect("gateWindowWidthUs" in res.modifiedParams).toBe(false);
  });

  test("Tesla transformer Claim 1 inversion opens only the source-described common node", () => {
    const res = applyClaimConstraintModifications("us-593138-tesla-coil", {}, { 1: false });
    expect(res.modifiedParams.claim1CommonNodeConnected).toBe(0);
    expect(res.activeFailures[0]).toContain("secondary terminal is disconnected");
    expect(res.refusalWarning).toContain("SOURCE-BOUND REFUSAL");
    expect(res.modifiedParams.secondaryVoltageKv).toBeUndefined();
    expect(res.modifiedParams.resonantQ).toBeUndefined();
  });

  test("Hull claim inversions withhold surface-lamina topology without fabricating cure behavior", () => {
    const raw = {
      shutterRequestedOpen: 1,
      scanXFraction: 0.45,
      scanZFraction: -0.2,
      recoatExcursionFraction: 0.7,
      displayLaminaCount: 8,
    };
    const claimOne = applyClaimConstraintModifications("us-4575330-hull-stereolithography", raw, {
      1: false,
      2: true,
    });
    expect(claimOne.modifiedParams.displayLaminaCount).toBe(1);
    expect(claimOne.modifiedParams.recoatExcursionFraction).toBe(0);
    expect(claimOne.modifiedParams.shutterRequestedOpen).toBe(1);
    expect(claimOne.activeFailures[0]).toContain("Successive Lamina Buildup Withheld");
    expect(claimOne.refusalWarning).toContain("CLAIM 1 TOPOLOGY REMOVED");
    expect(claimOne.modifiedParams.cureDepthUm).toBeUndefined();
    expect(claimOne.modifiedParams.penetrationDepthUm).toBeUndefined();

    const claimTwo = applyClaimConstraintModifications("us-4575330-hull-stereolithography", raw, {
      1: true,
      2: false,
    });
    expect(claimTwo.modifiedParams.shutterRequestedOpen).toBe(0);
    expect(claimTwo.modifiedParams.displayLaminaCount).toBe(8);
    expect(claimTwo.activeFailures[0]).toContain("Claim 2 Reaction Means Withheld");
    expect(claimTwo.refusalWarning).toContain("CLAIM 2 TOPOLOGY REMOVED");
    expect(claimTwo.modifiedParams.cureDepthUm).toBeUndefined();
    expect(claimTwo.modifiedParams.penetrationDepthUm).toBeUndefined();
  });

  test("Boyle-Smith Claim 1 inversion withholds the storage medium without inventing CTE", () => {
    const result = applyClaimConstraintModifications(
      "us-3858232-boyle-smith-ccd",
      { pulseWidthToStepRatio: 0.5 },
      { 1: false },
    );
    expect(result.modifiedParams.claim1SingleConductivityPresent).toBe(0);
    expect(result.modifiedParams.pulseWidthToStepRatio).toBe(0.5);
    expect(result.modifiedParams.chargeTransferEfficiencyPct).toBeUndefined();
    expect(result.activeFailures).toEqual([
      "Claim 1 medium withheld: the display no longer represents a continuous single-conductivity semiconductor charge-storage path.",
    ]);
    expect(result.refusalWarning).toContain("not inferred");
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

  test("robot end-effector Claim 1 inversion withholds topology without corrupting controls", () => {
    const raw = {
      jawOpeningFraction: 0.64,
      fingerChangeFraction: 0.2,
      transverseOffsetFraction: -0.45,
    };
    const result = applyClaimConstraintModifications("us-4765668-robot-end-effector", raw, {
      1: false,
    });
    expect(result.modifiedParams.claim1TopologyEnabled).toBe(0);
    expect(result.modifiedParams.jawOpeningFraction).toBe(0.64);
    expect(result.modifiedParams.fingerChangeFraction).toBe(0.2);
    expect(result.modifiedParams.transverseOffsetFraction).toBe(-0.45);
    expect(result.activeFailures[0]).toContain("withholds the opposed-thread screw");
    expect(result.refusalWarning).toContain("no workpiece");
  });

  test("Kamen claim inversions withhold only fore-aft and cluster-wheel topology", () => {
    const result = applyClaimConstraintModifications(
      "us-5701965-kamen-transporter",
      { topologyState: 4 },
      { 1: false, 16: false },
    );

    expect(result.modifiedParams.balanceTopologyEnabled).toBe(0);
    expect(result.modifiedParams.clusterTopologyEnabled).toBe(0);
    expect(result.modifiedParams.riderPitchLeanDeg).toBeUndefined();
    expect(result.activeFailures).toEqual([
      "Claim 1 fore-aft control topology withheld: the display no longer represents the source-described support, motorized drive, ground-contacting module, and control-loop combination.",
      "Claim 16 cluster-wheel topology withheld: the display no longer represents the source-described paired cluster and independently driven wheel relationship.",
    ]);
    expect(result.refusalWarning).toContain("SOURCE-BOUND REFUSAL");
    expect(result.refusalWarning).toContain("not a public torque");
  });
});
