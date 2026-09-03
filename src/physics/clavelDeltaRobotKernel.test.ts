import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  CLAVEL_DELTA_ROBOT_DEFAULT_CONTROLS,
  readClavelDeltaRobotClaimStates,
  readClavelDeltaRobotControls,
  stepClavelDeltaRobotTopology,
} from "./clavelDeltaRobotKernel";
import { FrankenSimEngine } from "./engine";

const ROOT = process.cwd();

function distance(
  a: readonly [number, number, number],
  b: readonly [number, number, number],
): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

describe("US 4,976,582 Clavel Delta source-bounded topology", () => {
  test("keeps three base inputs and two lower bars on every displayed leg", () => {
    const state = stepClavelDeltaRobotTopology(CLAVEL_DELTA_ROBOT_DEFAULT_CONTROLS);

    expect(state.legs).toHaveLength(3);
    expect(state.platformAttitudeDeviation).toBe(0);
    expect(state.platformNormal).toEqual([0, 1, 0]);
    expect(state.closureStatus).toBe("normalized-closed-chain-solved");
    expect(state.configurationRefusal).toEqual({ refused: false, reason: null });
    expect(state.closureResidual).toBeLessThan(1e-9);
    for (const leg of state.legs) {
      const barA = distance(leg.upperJointA, leg.lowerJointA);
      const barB = distance(leg.upperJointB, leg.lowerJointB);
      expect(barA).toBeCloseTo(leg.pairedBarLength, 12);
      expect(barB).toBeCloseTo(leg.pairedBarLength, 12);
      expect(leg.pairedBarLength).toBeCloseTo(state.normalizedBarLength, 12);
      expect(leg.pairedBarLengthError).toBeLessThan(1e-9);
      expect(leg.pairedBarVectorError).toBeCloseTo(0, 12);
      expect(distance(leg.upperJointA, leg.upperJointB)).toBeCloseTo(0.14, 12);
      expect(distance(leg.lowerJointA, leg.lowerJointB)).toBeCloseTo(0.14, 12);
    }
  });

  test("maps identical controls deterministically and different arm inputs change the platform", () => {
    const params = { armOneInput: 0.45, armTwoInput: -0.25, armThreeInput: 0.1 };
    expect(stepClavelDeltaRobotTopology(params)).toEqual(stepClavelDeltaRobotTopology(params));

    const baseline = stepClavelDeltaRobotTopology({
      armOneInput: 0,
      armTwoInput: 0,
      armThreeInput: 0,
    });
    const moved = stepClavelDeltaRobotTopology({
      armOneInput: 0.6,
      armTwoInput: 0,
      armThreeInput: 0,
    });
    expect(moved.platformCenter).not.toEqual(baseline.platformCenter);
    expect(moved.legs[0].controlArmEnd).not.toEqual(baseline.legs[0].controlArmEnd);
    moved.legs.forEach((leg, index) => {
      expect(leg.pairedBarLength).toBeCloseTo(baseline.legs[index].pairedBarLength, 12);
    });
    expect(moved.closureResidual).toBeLessThan(1e-9);
    expect(moved.positionLaw).toContain("normalized");
    expect(moved.positionLaw).toContain("||p*");
  });

  test("retains rigid paired links throughout declared normalized input space", () => {
    const declaredConfigurations = [
      { armOneInput: -1, armTwoInput: -1, armThreeInput: -1 },
      { armOneInput: -1, armTwoInput: 1, armThreeInput: -1 },
      { armOneInput: 0.35, armTwoInput: -0.65, armThreeInput: 0.8 },
      { armOneInput: 1, armTwoInput: 1, armThreeInput: 1 },
    ];

    for (const params of declaredConfigurations) {
      const state = stepClavelDeltaRobotTopology(params);
      expect(state.configurationRefusal.refused).toBe(false);
      expect(state.closureResidual).toBeLessThan(1e-9);
      expect(
        state.legs.every(
          (leg) =>
            Math.abs(leg.pairedBarLength - state.normalizedBarLength) < 1e-9 &&
            leg.pairedBarVectorError < 1e-9,
        ),
      ).toBe(true);
    }
  });

  test("keeps the engine wrapper exactly equal to the one shared topology kernel", () => {
    const params = { armOneInput: 0.31, armTwoInput: -0.22, armThreeInput: 0.47 };
    expect(FrankenSimEngine.stepClavelDeltaRobotTopology(params)).toEqual(
      stepClavelDeltaRobotTopology(params),
    );
  });

  test("clamps public controls and explicitly refuses fabricated physical telemetry", () => {
    expect(
      readClavelDeltaRobotControls({
        armOneInput: 9,
        armTwoInput: -9,
        armThreeInput: Number.NaN,
        toolAxisInput: -2,
        claim1TopologyEnabled: 0.49,
        claim2PairedBarsEnabled: 5,
        claim8BaseMotorEnabled: -5,
      }),
    ).toEqual({
      ...CLAVEL_DELTA_ROBOT_DEFAULT_CONTROLS,
      armOneInput: 1,
      armTwoInput: -1,
      toolAxisInput: -1,
      claim1TopologyEnabled: 0,
      claim2PairedBarsEnabled: 1,
      claim8BaseMotorEnabled: 0,
    });

    const state = stepClavelDeltaRobotTopology({});
    expect(state.refusal.refused).toBe(true);
    expect(state.refusal.reason).toContain("calibrated dimensions");
    expect(state.refusal.reason).toContain("payload");
    expect(state.refusal.reason).toContain("SI position, velocity, acceleration, force");
  });

  test("turns Claim 1, Claim 2, and Claim 8 topology probes into visible withdrawals", () => {
    expect(readClavelDeltaRobotClaimStates({ claim1TopologyEnabled: 0 })).toEqual({
      1: false,
      2: false,
      8: false,
    });
    const claimOneOff = stepClavelDeltaRobotTopology({ claim1TopologyEnabled: 0 });
    expect(claimOneOff.status).toBe("claim-1-topology-withheld");
    expect(claimOneOff.topologyVisible).toBe(false);
    expect(claimOneOff.activeClaim).toBe(1);

    const claimTwoOff = stepClavelDeltaRobotTopology({ claim2PairedBarsEnabled: 0 });
    expect(claimTwoOff.status).toBe("claim-2-paired-bars-withheld");
    expect(claimTwoOff.pairedBarsVisible).toBe(false);
    expect(claimTwoOff.pairedBarInvariant).toBe("claim-2 paired bars withheld");
    expect(claimTwoOff.activeClaim).toBe(2);

    const claimEightOff = stepClavelDeltaRobotTopology({ claim8BaseMotorEnabled: 0 });
    expect(claimEightOff.status).toBe("claim-8-base-tool-motor-withheld");
    expect(claimEightOff.toolAxisVisible).toBe(false);
    expect(claimEightOff.activeClaim).toBe(8);
  });

  test("does not smuggle in unsupported SI actuators or performance claims", () => {
    const source = readFileSync(join(ROOT, "src/physics/clavelDeltaRobotKernel.ts"), "utf8");
    expect(source).not.toContain("payloadKg");
    expect(source).not.toContain("motorTorqueNm");
    expect(source).not.toContain("cycleTimeMs");
    expect(source).not.toContain("positionAccuracyMm");
    expect(source).not.toContain("workspaceMeters");
    expect(source).not.toContain("Math.random");
    expect(source).toContain("fs-mbd articulated-tree contract");
  });
});
