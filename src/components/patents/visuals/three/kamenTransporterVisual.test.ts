import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import {
  KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M,
  KAMEN_TRANSPORTER_TOPOLOGY_STATES,
  kamenHorizontalSupportHeightM,
  kamenMinimumRiserClearanceM,
  readKamenTransporterControls,
  stepKamenTransporterTopology,
} from "@/physics/kamenTransporterKernel";
import {
  KAMEN_TRANSPORTER_CAMERA_PRESETS,
  kamenTransporterCameraForViewport,
} from "./kamenTransporterCamera";
import {
  buildKamenTransporterModel,
  updateKamenTransporterKinematics,
} from "./kamenTransporterModel";

function projectedObjectBounds(object: THREE.Object3D, camera: THREE.PerspectiveCamera) {
  object.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(object);
  const frame = {
    minX: Number.POSITIVE_INFINITY,
    maxX: Number.NEGATIVE_INFINITY,
    minY: Number.POSITIVE_INFINITY,
    maxY: Number.NEGATIVE_INFINITY,
  };

  for (const x of [bounds.min.x, bounds.max.x]) {
    for (const y of [bounds.min.y, bounds.max.y]) {
      for (const z of [bounds.min.z, bounds.max.z]) {
        const projected = new THREE.Vector3(x, y, z).project(camera);
        frame.minX = Math.min(frame.minX, projected.x);
        frame.maxX = Math.max(frame.maxX, projected.x);
        frame.minY = Math.min(frame.minY, projected.y);
        frame.maxY = Math.max(frame.maxY, projected.y);
      }
    }
  }
  return frame;
}

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
        if (telemetry.displayPose.stairActive) {
          expect(kamenMinimumRiserClearanceM(center.x, center.y)).toBeCloseTo(
            expected.signedRiserClearanceM ?? Number.NaN,
            12,
          );
          expect(expected.signedRiserClearanceM ?? -1).toBeGreaterThanOrEqual(-1e-8);
        } else {
          expect(expected.signedRiserClearanceM).toBeNull();
        }
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

  test("keeps the complete balance and transfer apparatus inside the exact 320px phone canvas", () => {
    const model = buildKamenTransporterModel();
    try {
      const desktop = kamenTransporterCameraForViewport("overview", 1216, 460);
      const tablet = kamenTransporterCameraForViewport("overview", 718, 460);
      expect(desktop).toEqual(KAMEN_TRANSPORTER_CAMERA_PRESETS.overview);
      expect(tablet).toEqual(desktop);

      // This component's min-h-[420px] makes the exact 320px reader canvas
      // 286 × 420px, even though its preferred aspect ratio is 16:9.
      // Sweep all published source poses and the Claim 16 topology-withheld
      // receipt; the high control mast and transfer terrain must remain in
      // frame in every visitor-facing comparison.
      const canvasWidth = 286;
      const canvasHeight = 420;
      const view = kamenTransporterCameraForViewport("overview", canvasWidth, canvasHeight);
      const camera = new THREE.PerspectiveCamera(42, canvasWidth / canvasHeight, 0.1, 1000);
      camera.position.set(...view.pos);
      camera.lookAt(...view.target);
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();

      const auditedStates = [
        ...KAMEN_TRANSPORTER_TOPOLOGY_STATES.map((state, topologyState) => ({
          label: state,
          controls: readKamenTransporterControls({ topologyState }),
        })),
        {
          label: "claim 16 cluster withheld",
          controls: readKamenTransporterControls({ topologyState: 4, claim16ClusterEnabled: 0 }),
        },
      ];

      for (const { label, controls } of auditedStates) {
        const telemetry = stepKamenTransporterTopology(controls);
        updateKamenTransporterKinematics(model, controls, telemetry, 0);
        model.root.updateMatrixWorld(true);

        const apparatus = projectedObjectBounds(model.root, camera);
        const chassis = projectedObjectBounds(model.chassis, camera);
        const controlMast = projectedObjectBounds(model.standingMast, camera);

        expect(apparatus.minX, `${label} left edge`).toBeGreaterThan(-0.8);
        expect(apparatus.maxX, `${label} right edge`).toBeLessThan(0.86);
        expect(apparatus.minY, `${label} lower edge`).toBeGreaterThan(-0.65);
        expect(apparatus.maxY, `${label} handle edge`).toBeLessThan(0.64);
        expect(
          ((apparatus.maxX - apparatus.minX) * canvasWidth) / 2,
          `${label} horizontal legibility`,
        ).toBeGreaterThan(190);
        expect(
          ((apparatus.maxY - apparatus.minY) * canvasHeight) / 2,
          `${label} vertical legibility`,
        ).toBeGreaterThan(180);

        for (const [name, part] of [
          ["chassis", chassis],
          ["control mast", controlMast],
        ] as const) {
          expect(part.minX, `${label} ${name} left`).toBeGreaterThan(-0.8);
          expect(part.maxX, `${label} ${name} right`).toBeLessThan(0.86);
          expect(part.minY, `${label} ${name} lower`).toBeGreaterThan(-0.65);
          expect(part.maxY, `${label} ${name} upper`).toBeLessThan(0.64);
        }
      }
    } finally {
      model.dispose();
    }
  });

  test("reselects only the overview for a desktop-to-phone resize", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/KamenTransporter3D.tsx"),
      "utf8",
    );
    expect(kamenTransporterCameraForViewport("overview", 1216, 460)).toEqual(
      KAMEN_TRANSPORTER_CAMERA_PRESETS.overview,
    );
    expect(kamenTransporterCameraForViewport("overview", 286, 420)).not.toEqual(
      KAMEN_TRANSPORTER_CAMERA_PRESETS.overview,
    );
    expect(kamenTransporterCameraForViewport("balance", 286, 420)).toEqual(
      KAMEN_TRANSPORTER_CAMERA_PRESETS.balance,
    );
    expect(source).toContain('if (cameraPreset !== "overview") return;');
    expect(source).toContain('window.addEventListener("resize", reselectResponsiveOverview)');
    expect(source).toContain(
      'window.addEventListener("orientationchange", reselectResponsiveOverview)',
    );
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
    expect(sceneSource).toContain("stepKamenTransporterPhysics");
    expect(sceneSource).not.toContain("stepKamenTransporterSi");
    expect(sceneSource).not.toMatch(/riderPitchLeanDeg|velocityCommandMs|MOTOR TORQUE|N·m|m\/s/i);
    expect(twoDimensionalSource).toContain("stepKamenTransporterPhysics");
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
