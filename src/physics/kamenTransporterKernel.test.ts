import { describe, expect, test } from "bun:test";
import {
  advanceKamenTransporterMotion,
  createKamenTransporterMotionState,
  KAMEN_TOPOLOGY_SOURCE_BOUNDARY,
  KAMEN_TRANSPORTER_DEFAULT_CONTROLS,
  readKamenTransporterControls,
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
    expect(run1.sourceClaimNumbers).toEqual([21, 22, 26]);
    expect(run1.sourceBoundary).toBe(KAMEN_TOPOLOGY_SOURCE_BOUNDARY);
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
