import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  readKamenTransporterControls,
  stepKamenTransporterTopology,
} from "@/physics/kamenTransporterKernel";
import {
  buildKamenTransporterModel,
  updateKamenTransporterKinematics,
} from "./kamenTransporterModel";

describe("US 5,701,965 Kamen Transporter source-bound Three.js topology", () => {
  test("uses a procedural Three.js model with named cluster-wheel topology and no external asset", () => {
    const model = buildKamenTransporterModel();
    expect(model.root.name).toBe("kamen-source-topology");
    expect(model.leftCluster.name).toBe("cluster-wheel-module");
    expect(model.rightCluster.name).toBe("cluster-wheel-module");
    expect(model.topologyLinkLine.name).toBe("control-relationship-link");
    expect(model.leftWheel1.name).toBe("cluster-wheel-a");
    expect(model.rightWheel2.name).toBe("cluster-wheel-b");
    expect(() => model.dispose()).not.toThrow();
  });

  test("resolves a deterministic qualitative climb relation without a numeric dynamics claim", () => {
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
  });

  test("projects discrete source-reading poses without wheel spin, translation, or chassis tilt", () => {
    const model = buildKamenTransporterModel();
    const balanceControls = readKamenTransporterControls({ topologyState: 1 });
    const balance = stepKamenTransporterTopology(balanceControls);
    updateKamenTransporterKinematics(model, balanceControls, balance, 9);

    expect(model.chassis.rotation.z).toBe(0);
    expect(model.leftWheel1.rotation.z).toBe(0);
    expect(model.rightWheel2.rotation.z).toBe(0);
    expect(model.stairTerrain.visible).toBe(false);

    const climbControls = readKamenTransporterControls({ topologyState: 4 });
    const climb = stepKamenTransporterTopology(climbControls);
    updateKamenTransporterKinematics(model, climbControls, climb, 0);
    expect(model.leftCluster.rotation.z).toBe(climb.clusterDisplayPoseRad);
    expect(model.rightCluster.rotation.z).toBe(climb.clusterDisplayPoseRad);
    expect(model.stairTerrain.visible).toBe(true);

    const withheldControls = readKamenTransporterControls({
      topologyState: 4,
      claim16ClusterEnabled: 0,
    });
    updateKamenTransporterKinematics(
      model,
      withheldControls,
      stepKamenTransporterTopology(withheldControls),
      0,
    );
    expect(model.leftCluster.visible).toBe(false);
    expect(model.rightCluster.visible).toBe(false);
    model.dispose();
  });

  test("keeps the public scenes on the shared tape while excluding false SI and gear-train language", () => {
    const sceneSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/KamenTransporter3D.tsx"),
      "utf8",
    );
    const twoDimensionalSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/KamenTransporterSim.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/kamenTransporterModel.ts"),
      "utf8",
    );

    expect(sceneSource).toContain("globalTransportBus.registerUpdater");
    expect(sceneSource).toContain("createKamenTransporterTransportUpdater");
    expect(sceneSource).toContain("stepKamenTransporterTopology");
    expect(sceneSource).not.toContain("stepKamenTransporterSi");
    expect(sceneSource).not.toMatch(/riderPitchLeanDeg|velocityCommandMs|MOTOR TORQUE|N·m|m\/s/i);
    expect(twoDimensionalSource).toContain("stepKamenTransporterTopology");
    expect(twoDimensionalSource).not.toMatch(/riderPitchLeanDeg|velocityCommandMs|N·m|m\/s/i);
    expect(twoDimensionalSource.match(/<PhysicsTelemetryBadge/g)?.length).toBe(1);
    expect(modelSource).toContain("cluster-wheel-carrier");
    expect(modelSource).toContain("clusterDisplayPoseRad");
    expect(modelSource).not.toMatch(/planetary|wheelSpinSpeed|SCENARIO_WHEEL_RADIUS/i);
  });

  test("places telemetry and claim-reading controls after the fixed canvas", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/KamenTransporter3D.tsx"),
      "utf8",
    );
    const canvasIndex = source.indexOf("ref={containerRef}");
    const telemetryIndex = source.indexOf('data-mobile-layout="telemetry-after-canvas"');
    const controlsIndex = source.indexOf('data-mobile-layout="controls-after-canvas"');

    expect(canvasIndex).toBeGreaterThan(-1);
    expect(telemetryIndex).toBeGreaterThan(canvasIndex);
    expect(controlsIndex).toBeGreaterThan(telemetryIndex);
    expect(source).toContain('id="kamen-transporter-camera-view"');
    expect(source).toContain("controls.setView");
    expect(source).not.toContain("camera.position.set");
    expect(source).toContain('updateParam("topologyState", index)');
    expect(source).toContain('data-audit-primary-control={index === 0 ? "true" : undefined}');
  });
});
