import { describe, expect, test } from "bun:test";
import {
  advanceKamenTransporterMotion,
  createKamenTransporterMotionState,
  KAMEN_TOPOLOGY_SOURCE_BOUNDARY,
  KAMEN_TRANSPORTER_DEFAULT_CONTROLS,
  KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M,
  KAMEN_TRANSPORTER_TOPOLOGY_STATES,
  readKamenTransporterControls,
  resolveKamenTransporterDisplayPose,
  stepKamenTransporterTopology,
} from "./kamenTransporterKernel";

describe("Kamen transporter source-bound topology tape", () => {
  test("reads the published balance, transfer, climb, and transition relationships deterministically", () => {
    const controls = readKamenTransporterControls({ topologyState: 4 });
    const run1 = stepKamenTransporterTopology(controls);
    const run2 = stepKamenTransporterTopology(controls);

    expect(run1).toEqual(run2);
    expect(run1.topologyState).toBe("climb");
    expect(run1.balanceLoopActive).toBe(true);
    expect(run1.clusterTopologyActive).toBe(true);
    expect(run1.stairSequenceActive).toBe(true);
    expect(run1.wheelControlMode).toBe("balance-and-cluster-coordination");
    expect(run1.sourceClaimNumbers).toEqual([20, 21, 22, 26]);
    expect(run1.sourceBoundary).toBe(KAMEN_TOPOLOGY_SOURCE_BOUNDARY);
  });

  test("pins the nominal Table 1 dimensions in SI units", () => {
    expect(KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M).toEqual({
      systemCentreOffsetM: 0.5334,
      clusterRadiusM: 0.1417574,
      adjacentWheelCentreDistanceM: 0.2455418,
      stairTreadM: 0.27686,
      stairRiseM: 0.17399,
      riserToLowerContactM: 0.0764794,
      wheelRadiusM: 0.096774,
    });
    expect(
      Math.abs(
        KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M.adjacentWheelCentreDistanceM -
          Math.sqrt(3) * KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M.clusterRadiusM,
      ),
    ).toBeLessThan(2e-6);
  });

  test("keeps every source pose supported without horizontal-surface penetration", () => {
    const expectedContacts = {
      ground_support: ["a", "b"],
      balance: ["a"],
      stair_start: ["a", "b"],
      weight_transfer: ["a", "b"],
      climb: ["b", "c"],
      transition: ["c"],
    } as const;

    for (const state of KAMEN_TRANSPORTER_TOPOLOGY_STATES) {
      const pose = resolveKamenTransporterDisplayPose(state);
      expect(pose.contactWheelIds).toEqual(expectedContacts[state]);
      expect(pose.contactCount).toBe(expectedContacts[state].length);
      expect(pose.minimumGapM).toBeGreaterThanOrEqual(-1e-8);
      expect(pose.wheelContacts.every((wheel) => wheel.signedVerticalGapM >= -1e-8)).toBe(true);
    }

    const start = resolveKamenTransporterDisplayPose("stair_start");
    const transfer = resolveKamenTransporterDisplayPose("weight_transfer");
    expect(transfer.axleXM).toBe(start.axleXM);
    expect(transfer.axleYM).toBe(start.axleYM);
    expect(transfer.carrierRotationRad).toBe(start.carrierRotationRad);
    expect(transfer.chassisPitchRad).not.toBe(start.chassisPitchRad);
  });

  test("withholds a cluster-dependent topology when Claim 16 is withdrawn", () => {
    const controls = readKamenTransporterControls({
      topologyState: 3,
      claim16ClusterEnabled: 0,
    });
    const topology = stepKamenTransporterTopology(controls);

    expect(topology.clusterTopologyActive).toBe(false);
    expect(topology.topologyState).toBe("ground_support");
    expect(topology.wheelControlMode).toBe("topology-withheld");
    expect(topology.displayPose.contactWheelIds).toEqual(["direct"]);
    expect(topology.displayPose.minimumGapM).toBe(0);
  });

  test("maps old saved mode labels only to their nearest qualitative state", () => {
    expect(readKamenTransporterControls({ operatingMode: "standard_4wheel" }).topologyState).toBe(
      "ground_support",
    );
    expect(readKamenTransporterControls({ operatingMode: "stair_climb" }).topologyState).toBe(
      "climb",
    );
  });

  test("keeps the shared tape display-neutral rather than inventing travel or wheel speed", () => {
    const controls = { ...KAMEN_TRANSPORTER_DEFAULT_CONTROLS, topologyState: "climb" as const };
    const first = advanceKamenTransporterMotion(
      controls,
      createKamenTransporterMotionState(controls),
      1 / 60,
    );
    const second = advanceKamenTransporterMotion(controls, first, 1 / 60);

    expect(first.wheelRollAngleRad).toBe(0);
    expect(first.travelMeters).toBe(0);
    expect(second.wheelRollAngleRad).toBe(0);
    expect(second.travelMeters).toBe(0);
    expect(second.telemetry.forwardVelocityMs).toBe(0);
  });
});
