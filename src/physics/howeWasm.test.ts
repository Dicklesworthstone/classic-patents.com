import { describe, expect, test } from "bun:test";
import { decodeHoweTopologyWasmStep, stepHoweTopology } from "./howeWasm";

const PASS_STATE = JSON.stringify({
  ok: {
    scalar_joint_coordinates: 7,
    independent_drive_dofs: 1,
    main_shaft_axis: [0, 0, 1],
    needle_arm_axis: [0, 0, 1],
    shuttle_axis: [1, 0, 0],
    lifting_rod_axis: [0, 1, 0],
    baster_feed_axis: [1, 0, 0],
    crank_angle_rad: 1.5 * Math.PI,
    needle_penetration_normalized: 0.5,
    needle_arm_angle_rad: 0,
    needle_retracting: true,
    shuttle_travel_normalized: 0,
    loop_open_fraction: 0.618,
    loop_open: true,
    shuttle_passes_loop: true,
    shuttle_track_offset_normalized: 0,
    picker_left_normalized: 0,
    picker_right_normalized: 0,
    lifting_rod_normalized: 0.618,
    feed_advance_fraction: 0,
    thread_clamp_engaged: false,
    claim_1_interlock_satisfied: true,
    cycle_phase: "shuttle-pass",
    needle_eye_offset_in: 0.125,
    baster_point_pitch_in: 0.75,
  },
});

describe("Howe fs-mbd WASM boundary", () => {
  test("admits only the expected generic joint axes and source-order state", () => {
    const decoded = decodeHoweTopologyWasmStep(PASS_STATE);
    expect(decoded?.scalar_joint_coordinates).toBe(7);
    expect(decoded?.independent_drive_dofs).toBe(1);
    expect(decoded?.shuttle_axis).toEqual([1, 0, 0]);
    expect(decoded?.shuttle_passes_loop).toBe(true);
  });

  test("fails closed on malformed, contradictory, or dimension-drifting output", () => {
    expect(decodeHoweTopologyWasmStep("not json")).toBeNull();
    expect(
      decodeHoweTopologyWasmStep(PASS_STATE.replace('"loop_open":true', '"loop_open":false')),
    ).toBeNull();
    expect(
      decodeHoweTopologyWasmStep(
        PASS_STATE.replace('"needle_eye_offset_in":0.125', '"needle_eye_offset_in":0.25'),
      ),
    ).toBeNull();
  });

  test("typed fallback preserves Claim 1 refusal and one-drive topology", () => {
    const state = stepHoweTopology(270, 65, false);
    expect(state.runtimeSource).toBe("ts-fallback");
    expect(state.independentDriveDofs).toBe(1);
    expect(state.shuttleAxis).toEqual([1, 0, 0]);
    expect(state.shuttlePassesLoop).toBe(false);
    expect(state.shuttleTrackOffsetZ).toBe(0.55);
  });
});
