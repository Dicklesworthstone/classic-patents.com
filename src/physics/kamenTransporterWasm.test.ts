import { describe, expect, test } from "bun:test";
import {
  KAMEN_TRANSPORTER_DEFAULT_CONTROLS,
  KAMEN_TRANSPORTER_GENERIC_OWNER,
} from "./kamenTransporterKernel";
import {
  decodeKamenTransporterWasmStep,
  stepKamenTransporterPhysics,
} from "./kamenTransporterWasm";

const VALID_RECEIPT = JSON.stringify({
  ok: {
    owner: KAMEN_TRANSPORTER_GENERIC_OWNER,
    boundary:
      "rigid-planar-three-equal-wheels-horizontal-tread-contact-no-force-friction-compliance-impact-or-riser-side-contact",
    source_receipt: "us-5701965-table-1-figures-39-through-42",
    state: "balance",
    source_figure: "figure-39a",
    system_centre_offset_m: 0.5334,
    cluster_radius_m: 0.1417574,
    adjacent_wheel_centre_distance_m: 0.2455418,
    wheel_radius_m: 0.096774,
    stair_rise_m: 0.17399,
    stair_tread_m: 0.27686,
    riser_to_lower_contact_m: 0.0764794,
    axle_x_m: 0,
    axle_y_m: 0.2385314,
    carrier_rotation_rad: 0,
    chassis_pitch_rad: 0,
    stair_active: false,
    wheel_centres_m: [
      [0, 0.096774],
      [0.12276550957443219, 0.3094101],
      [-0.12276550957443219, 0.3094101],
    ],
    signed_vertical_gaps_m: [0, 0.2126361, 0.2126361],
    contact_mask: [true, false, false],
    contact_count: 1,
    minimum_gap_m: 0,
  },
});

describe("Kamen transporter generic FrankenSim browser boundary", () => {
  test("admits the complete source-dimensioned support receipt", () => {
    const decoded = decodeKamenTransporterWasmStep(VALID_RECEIPT);
    expect(decoded?.owner).toBe(KAMEN_TRANSPORTER_GENERIC_OWNER);
    expect(decoded?.contact_mask).toEqual([true, false, false]);
    expect(decoded?.wheel_centres_m).toHaveLength(3);
  });

  test("rejects missing ownership, geometry drift, penetration, and unsupported poses", () => {
    const parsed = JSON.parse(VALID_RECEIPT).ok;
    expect(
      decodeKamenTransporterWasmStep(JSON.stringify({ ok: { ...parsed, owner: "fake" } })),
    ).toBeNull();
    expect(
      decodeKamenTransporterWasmStep(
        JSON.stringify({ ok: { ...parsed, wheel_radius_m: parsed.wheel_radius_m + 0.01 } }),
      ),
    ).toBeNull();
    expect(
      decodeKamenTransporterWasmStep(JSON.stringify({ ok: { ...parsed, minimum_gap_m: -0.01 } })),
    ).toBeNull();
    expect(
      decodeKamenTransporterWasmStep(
        JSON.stringify({
          ok: { ...parsed, contact_mask: [false, false, false], contact_count: 0 },
        }),
      ),
    ).toBeNull();
  });

  test("cold-start fallback preserves exact contacts and states its provenance", () => {
    const telemetry = stepKamenTransporterPhysics(KAMEN_TRANSPORTER_DEFAULT_CONTROLS);
    expect(telemetry.runtimeSource).toBe("ts-fallback");
    expect(telemetry.genericOwner).toBe(KAMEN_TRANSPORTER_GENERIC_OWNER);
    expect(telemetry.displayPose.contactWheelIds).toEqual(["a"]);
    expect(telemetry.displayPose.minimumGapM).toBeCloseTo(0, 12);
  });
});
