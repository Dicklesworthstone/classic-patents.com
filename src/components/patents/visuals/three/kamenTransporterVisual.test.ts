import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import {
  KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M,
  KAMEN_TRANSPORTER_TOPOLOGY_STATES,
  kamenHorizontalSupportHeightM,
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
    expect(model.leftWheel3.name).toBe("cluster-wheel-c");
    expect(model.rightWheel3.name).toBe("cluster-wheel-c");
    expect(model.flatTerrain.name).toBe("level-ground-support");
    expect(model.stairTerrain.name).toBe("table-1-two-riser-support");
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
    expect(run1.sourceClaimNumbers).toEqual([20, 21, 22, 26]);
  });

  test("projects every source pose with the rendered wheel centers on the same support geometry", () => {
    const model = buildKamenTransporterModel();
    const renderedWheels = [model.leftWheel1, model.leftWheel2, model.leftWheel3];
    const center = new THREE.Vector3();

    for (const [stateIndex, state] of KAMEN_TRANSPORTER_TOPOLOGY_STATES.entries()) {
      const controls = readKamenTransporterControls({ topologyState: stateIndex });
      const telemetry = stepKamenTransporterTopology(controls);
      updateKamenTransporterKinematics(model, controls, telemetry, 9);
      model.root.updateMatrixWorld(true);

      expect(telemetry.topologyState).toBe(state);
      expect(model.chassis.position.x).toBeCloseTo(telemetry.displayPose.axleXM, 12);
      expect(model.chassis.position.y).toBeCloseTo(telemetry.displayPose.axleYM, 12);
      expect(model.chassis.rotation.z).toBeCloseTo(telemetry.displayPose.chassisPitchRad, 12);
      expect(model.leftCluster.rotation.z).toBeCloseTo(
        telemetry.displayPose.carrierRotationRad,
        12,
      );
      expect(model.stairTerrain.visible).toBe(telemetry.displayPose.stairActive);
      expect(model.flatTerrain.visible).toBe(!telemetry.displayPose.stairActive);

      for (const [wheelIndex, wheel] of renderedWheels.entries()) {
        wheel.getWorldPosition(center);
        const expected = telemetry.displayPose.wheelContacts[wheelIndex];
        expect(center.x).toBeCloseTo(expected.centerXM, 12);
        expect(center.y).toBeCloseTo(expected.centerYM, 12);
        expect(
          center.y -
            KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M.wheelRadiusM -
            kamenHorizontalSupportHeightM(center.x, telemetry.displayPose.stairActive),
        ).toBeCloseTo(expected.signedVerticalGapM, 12);
      }
    }

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
    expect(model.leftDirectWheel.visible).toBe(true);
    expect(model.rightDirectWheel.visible).toBe(true);
    expect(model.leftDirectWheel.position.y).toBe(KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M.wheelRadiusM);
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
    expect(modelSource).toContain("tel.displayPose");
    expect(modelSource).toContain("leftWheel3");
    expect(modelSource).toContain("table-1-two-riser-support");
    expect(modelSource).not.toContain("normalizedElevation");
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
