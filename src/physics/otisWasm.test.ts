import { describe, expect, test } from "bun:test";
import { decodeOtisTopologyWasmStep, stepOtisTopology } from "./otisWasm";

const PASS = JSON.stringify({
  ok: {
    scalar_joint_coordinates: 12,
    independent_drive_dofs: 1,
    platform_axis: [0, 1, 0],
    safety_bar_axis: [0, 1, 0],
    safety_lever_axis: [0, 0, 1],
    winding_drum_axis: [0, 0, 1],
    shipper_axis: [1, 0, 0],
    brake_axis: [0, 0, 1],
    counterpoise_axis: [0, 1, 0],
    platform_position_normalized: 0.55,
    counterpoise_position_normalized: 0.45,
    drive_phase_rad: 0,
    requested_drive_direction: 1,
    platform_motion_direction: 1,
    shipper_position_normalized: -1,
    straight_belt_o_working: true,
    cross_belt_p_working: false,
    both_belts_idle: false,
    brake_z_engaged: false,
    stop_rope_geometry_active: false,
    lower_limit_stop_active: false,
    rope_g_taut: true,
    safety_bar_release_normalized: 0,
    safety_lever_rotation_normalized: 0,
    pawls_f_engaged: false,
    claim_1_hook_lock_satisfied: false,
    free_fall_counterfactual: false,
    claim_3_stop_interlock_satisfied: true,
    claim_4_counterpoise_topology_satisfied: true,
    mechanism_mode: "raise",
  },
});

describe("Otis fs-mbd WASM boundary", () => {
  test("admits only the complete expected source topology", () => {
    const decoded = decodeOtisTopologyWasmStep(PASS);
    expect(decoded?.scalar_joint_coordinates).toBe(12);
    expect(decoded?.platform_axis).toEqual([0, 1, 0]);
    expect(decoded?.straight_belt_o_working).toBe(true);
  });

  test("fails closed on malformed or contradictory output", () => {
    expect(decodeOtisTopologyWasmStep("not json")).toBeNull();
    expect(
      decodeOtisTopologyWasmStep(
        PASS.replace('"cross_belt_p_working":false', '"cross_belt_p_working":true'),
      ),
    ).toBeNull();
    expect(
      decodeOtisTopologyWasmStep(
        PASS.replace('"platform_axis":[0,1,0]', '"platform_axis":[1,0,0]'),
      ),
    ).toBeNull();
    expect(
      decodeOtisTopologyWasmStep(
        PASS.replace('"shipper_position_normalized":-1', '"shipper_position_normalized":0'),
      ),
    ).toBeNull();
    expect(
      decodeOtisTopologyWasmStep(
        PASS.replace(
          '"counterpoise_position_normalized":0.45',
          '"counterpoise_position_normalized":0.55',
        ),
      ),
    ).toBeNull();
    expect(
      decodeOtisTopologyWasmStep(
        PASS.replace('"mechanism_mode":"raise"', '"mechanism_mode":"lower"'),
      ),
    ).toBeNull();
  });

  test("typed fallback proves the rope-failure catch and Claim 1 counterfactual", () => {
    const caught = stepOtisTopology({
      platformPositionNormalized: 0.55,
      drivePhaseRad: 0,
      driveCommand: 1,
      ropeGIntact: false,
      stopRopePulled: false,
      claim1HookLockEnabled: true,
      claim3BrakeInterlockEnabled: true,
      claim4CounterpoiseEnabled: true,
    });
    expect(caught.runtimeSource).toBe("ts-fallback");
    expect(caught.pawlsFEngaged).toBe(true);
    expect(caught.platformMotionDirection).toBe(0);
  });
});
