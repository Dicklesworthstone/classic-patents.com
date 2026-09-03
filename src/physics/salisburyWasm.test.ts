import { describe, expect, test } from "bun:test";
import { SALISBURY_HAND_DEFAULT_CONTROLS } from "./salisburyRobotHandKernel";
import { decodeSalisburyWasmStep, stepSalisburyTopology } from "./salisburyWasm";

const PASS_RECEIPT = JSON.stringify({
  ok: {
    scalar_joint_coordinates: 9,
    digit_count: 3,
    palm_root_present: true,
    joint_parent_coordinates: [-1, 0, 1, -1, 3, 4, -1, 6, 7],
    cable_end_count: 12,
    axis_1: [0, 1, 0],
    axis_2: [1, 0, 0],
    axis_3: [1, 0, 0],
    tendon_tensions_n: [20, 15, 5, 10],
    pulley_radii_m: [0.012, 0.01, 0.014],
    joint_torques_nm: [-0.16, 0.24, 0.1],
    claim_1_routing_present: true,
    claim_2_first_idler_fixed: true,
    historical_dynamics_available: false,
  },
});

describe("Salisbury fs-mbd WASM boundary", () => {
  test("admits only the nine-joint, 12-cable source topology and exact torque law", () => {
    const decoded = decodeSalisburyWasmStep(PASS_RECEIPT);
    expect(decoded?.scalar_joint_coordinates).toBe(9);
    expect(decoded?.digit_count).toBe(3);
    expect(decoded?.palm_root_present).toBe(true);
    expect(decoded?.joint_parent_coordinates).toEqual([-1, 0, 1, -1, 3, 4, -1, 6, 7]);
    expect(decoded?.cable_end_count).toBe(12);
    expect(decoded?.axis_1).toEqual([0, 1, 0]);
    expect(decoded?.joint_torques_nm).toEqual([-0.16, 0.24, 0.1]);
    expect(decoded?.historical_dynamics_available).toBe(false);
  });

  test("fails closed on malformed, topology-drifting, or equation-drifting receipts", () => {
    expect(decodeSalisburyWasmStep("not json")).toBeNull();
    expect(
      decodeSalisburyWasmStep(
        PASS_RECEIPT.replace('"scalar_joint_coordinates":9', '"scalar_joint_coordinates":8'),
      ),
    ).toBeNull();
    expect(
      decodeSalisburyWasmStep(
        PASS_RECEIPT.replace(
          '"joint_parent_coordinates":[-1,0,1,-1,3,4,-1,6,7]',
          '"joint_parent_coordinates":[-1,0,1,-1,3,4,-1,6,6]',
        ),
      ),
    ).toBeNull();
    expect(
      decodeSalisburyWasmStep(
        PASS_RECEIPT.replace('"joint_torques_nm":[-0.16', '"joint_torques_nm":[-0.15'),
      ),
    ).toBeNull();
    expect(
      decodeSalisburyWasmStep(
        PASS_RECEIPT.replace(
          '"historical_dynamics_available":false',
          '"historical_dynamics_available":true',
        ),
      ),
    ).toBeNull();
  });

  test("typed fallback preserves the same topology, source law, and no-dynamics boundary", () => {
    const state = stepSalisburyTopology(SALISBURY_HAND_DEFAULT_CONTROLS);
    expect(state.runtimeSource).toBe("ts-fallback");
    expect(state.scalarJointCoordinates).toBe(9);
    expect(state.digitCount).toBe(3);
    expect(state.palmRootPresent).toBe(true);
    expect(state.jointParentCoordinates).toEqual([-1, 0, 1, -1, 3, 4, -1, 6, 7]);
    expect(state.cableEndCount).toBe(12);
    expect(state.axis1).toEqual([0, 1, 0]);
    expect(state.jointTorquesNm[0]).toBeCloseTo(-0.064, 12);
    expect(state.jointTorquesNm[1]).toBeCloseTo(0.176, 12);
    expect(state.jointTorquesNm[2]).toBeCloseTo(0.12, 12);
    expect(state.historicalDynamicsAvailable).toBe(false);
    expect(state.historicalDynamicsRefusal).toContain("force closure");
  });

  test("does not call or label a source-law step when Claim 1 routing is withheld", () => {
    const state = stepSalisburyTopology({
      ...SALISBURY_HAND_DEFAULT_CONTROLS,
      claim1RoutingPresent: false,
    });
    expect(state.runtimeSource).toBe("ts-fallback");
    expect(state.claim1RoutingProbe).toBe(false);
    expect(state.sourceLawApplicable).toBe(false);
    expect(state.activeJointCoordinates).toBe(0);
    expect(state.activeCableEndCount).toBe(0);
    expect(state.jointTorquesNm).toEqual([0, 0, 0]);
  });
});
