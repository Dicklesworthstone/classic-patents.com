import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { FrankenSimEngine } from "@/physics/engine";
import {
  DAIMLER_ENGINE_CAMERA_PRESETS,
  daimlerEngineCameraForViewport,
} from "./daimlerEngineCamera";
import {
  buildDaimlerMarineInstallationModel,
  updateDaimlerMarineInstallationKinematics,
} from "./daimlerMarineInstallationModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");
const DESKTOP_AUDIT_VIEWPORT = { width: 1214, height: 460 };

function isEnvironmentMesh(candidate: THREE.Object3D): boolean {
  let current: THREE.Object3D | null = candidate;
  while (current) {
    if (current.userData.connectivityRole === "environment") return true;
    current = current.parent;
  }
  return false;
}

function projectedMeshBounds(root: THREE.Object3D, camera: THREE.PerspectiveCamera) {
  const bounds = {
    minX: Number.POSITIVE_INFINITY,
    maxX: Number.NEGATIVE_INFINITY,
    minY: Number.POSITIVE_INFINITY,
    maxY: Number.NEGATIVE_INFINITY,
  };

  root.traverse((candidate) => {
    if (!(candidate instanceof THREE.Mesh) || !candidate.visible || isEnvironmentMesh(candidate)) {
      return;
    }
    const positions = candidate.geometry.getAttribute("position");
    if (!positions) return;

    const point = new THREE.Vector3();
    for (let index = 0; index < positions.count; index += 1) {
      point
        .fromBufferAttribute(positions, index)
        .applyMatrix4(candidate.matrixWorld)
        .project(camera);
      bounds.minX = Math.min(bounds.minX, point.x);
      bounds.maxX = Math.max(bounds.maxX, point.x);
      bounds.minY = Math.min(bounds.minY, point.y);
      bounds.maxY = Math.max(bounds.maxY, point.y);
    }
  });

  return {
    ...bounds,
    widthPx: ((bounds.maxX - bounds.minX) * DESKTOP_AUDIT_VIEWPORT.width) / 2,
    heightPx: ((bounds.maxY - bounds.minY) * DESKTOP_AUDIT_VIEWPORT.height) / 2,
  };
}

describe("US 361,931 Gottlieb Daimler Boat Propulsion Engine visual & kinematics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "DaimlerEngine3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "daimlerMarineInstallationModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildDaimlerMarineInstallationModel");
    expect(modelSource).toContain("updateDaimlerMarineInstallationKinematics");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "DaimlerEngine3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "daimlerMarineInstallationModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and UI overlay for marine engine observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "DaimlerEngine3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "motor", "coupling", "reverse", "cooling", "reservoirs"]) {
      expect(threeSource).toContain(preset);
    }
    expect(threeSource).toContain("daimlerEngineCameraForViewport");
  });

  test("keeps the enlarged desktop overview and its coupled shaft/rudder clear of telemetry", () => {
    const { width, height } = DESKTOP_AUDIT_VIEWPORT;
    const desktopIso = daimlerEngineCameraForViewport("iso", width);

    expect(desktopIso).toEqual({ pos: [10.5, 4.25, 7.6], target: [4.25, 0, 0] });
    // The desktop repair must not revise source-oriented inspection views or
    // the compact/tablet overview that has no competing pair of full HUD cards.
    expect(daimlerEngineCameraForViewport("iso", 718)).toEqual(DAIMLER_ENGINE_CAMERA_PRESETS.iso);
    for (const preset of [
      "motor",
      "coupling",
      "reverse",
      "cooling",
      "reservoirs",
      "steering",
    ] as const) {
      expect(daimlerEngineCameraForViewport(preset, width)).toEqual(
        DAIMLER_ENGINE_CAMERA_PRESETS[preset],
      );
    }

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(...desktopIso.pos);
    camera.lookAt(...desktopIso.target);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();

    // The actual V25 desktop viewport put the lower left card through about
    // -0.56 NDC, the lower-right telemetry card from about +0.23 NDC, and the
    // view rail below +0.71 NDC. Exercise both audited UI states and a full
    // illustrative turn of the connected propeller rather than one lucky frame.
    const auditedStates = [
      { name: "primary-control-max", claimInverted: false },
      { name: "claim-inverted", claimInverted: true },
    ] as const;
    for (const state of auditedStates) {
      const model = buildDaimlerMarineInstallationModel();
      try {
        const envelope = {
          minX: Number.POSITIVE_INFINITY,
          maxX: Number.NEGATIVE_INFINITY,
          minY: Number.POSITIVE_INFINITY,
          maxY: Number.NEGATIVE_INFINITY,
          widthPx: 0,
          heightPx: 0,
        };
        for (let phaseStep = 0; phaseStep <= 12; phaseStep += 1) {
          updateDaimlerMarineInstallationKinematics(model, {
            ...FrankenSimEngine.stepDaimlerMarineApparatus(-1, false),
            illustrativePhaseRad: (Math.PI * 2 * phaseStep) / 12,
          });
          model.rootGroup.updateMatrixWorld(true);
          const installationBounds = projectedMeshBounds(model.rootGroup, camera);
          const shaftBounds = projectedMeshBounds(model.propellerShaftGroup, camera);
          const steeringBounds = projectedMeshBounds(model.steeringGroup, camera);

          envelope.minX = Math.min(envelope.minX, installationBounds.minX);
          envelope.maxX = Math.max(envelope.maxX, installationBounds.maxX);
          envelope.minY = Math.min(envelope.minY, installationBounds.minY);
          envelope.maxY = Math.max(envelope.maxY, installationBounds.maxY);
          envelope.widthPx = Math.max(envelope.widthPx, installationBounds.widthPx);
          envelope.heightPx = Math.max(envelope.heightPx, installationBounds.heightPx);

          expect(shaftBounds.maxX, `${state.name} shaft clears telemetry`).toBeLessThan(0.23);
          expect(steeringBounds.maxX, `${state.name} rudder clears telemetry`).toBeLessThan(0.23);
        }

        expect(envelope.minX, `${state.name} clears primary HUD`).toBeGreaterThan(-0.56);
        expect(envelope.maxX, `${state.name} clears telemetry HUD`).toBeLessThan(0.23);
        expect(envelope.maxY, `${state.name} clears View rail`).toBeLessThan(0.71);
        expect(envelope.minY, `${state.name} stays within canvas`).toBeGreaterThan(-0.7);
        expect(envelope.widthPx, `${state.name} legible installation width`).toBeGreaterThan(440);
        expect(envelope.heightPx, `${state.name} legible installation height`).toBeGreaterThan(270);
      } finally {
        model.dispose();
      }
    }
  });

  test("uses the generic prismatic owner for exact source drive topology", () => {
    const ahead = FrankenSimEngine.stepDaimlerMarineApparatus(1, false);
    expect(ahead.shaftTranslationAlongAxisNormalized).toBe(-1);
    expect(ahead.shaftAxis).toEqual([1, 0, 0]);
    expect(ahead.shaftJointDofs).toBe(1);
    expect(ahead.motorRotationSign).toBe(1);
    expect(ahead.propellerRotationSign).toBe(1);
    expect(ahead.aheadCouplingEngaged).toBe(true);
    expect(ahead.asternGearingEngaged).toBe(false);

    const astern = FrankenSimEngine.stepDaimlerMarineApparatus(-1, true);
    expect(astern.shaftTranslationAlongAxisNormalized).toBe(1);
    expect(astern.aheadCouplingEngaged).toBe(false);
    expect(astern.asternGearingEngaged).toBe(true);
    expect(astern.propellerRotationSign).toBe(-1);
    expect(astern.passiveForeAftCoolingPathPresent).toBe(true);
    expect(astern.coolingPumpActive).toBe(true);
  });

  test("builds and articulates the connected vessel installation correctly", () => {
    const model = buildDaimlerMarineInstallationModel();

    expect(model.rootGroup.children.length).toBeGreaterThan(8);
    expect(model.hullGroup).toBeDefined();
    expect(model.motorGroup).toBeDefined();
    expect(model.propellerShaftGroup).toBeDefined();
    expect(model.couplingGroup).toBeDefined();
    expect(model.reverseGroup).toBeDefined();
    expect(model.thrustGroup).toBeDefined();
    expect(model.coolingGroup).toBeDefined();
    expect(model.reservoirGroup).toBeDefined();
    expect(model.steeringGroup).toBeDefined();

    updateDaimlerMarineInstallationKinematics(model, {
      ...FrankenSimEngine.stepDaimlerMarineApparatus(1, true),
      illustrativePhaseRad: 0.4,
    });
    expect(model.propellerShaftGroup.position.x).toBeLessThan(0);
    expect(model.movingAheadCoupling.material).toBe(model.materials.engaged);

    updateDaimlerMarineInstallationKinematics(model, {
      ...FrankenSimEngine.stepDaimlerMarineApparatus(-1, false),
      illustrativePhaseRad: 0.8,
    });
    expect(model.propellerShaftGroup.position.x).toBeGreaterThan(0);
    expect(model.reverseRollers[0].material).toBe(model.materials.engaged);
    expect(model.passiveCoolingPipes.every((pipe) => pipe.visible)).toBe(true);

    model.dispose();
  });

  test("keeps every printed load/support/fluid interface in contact at ahead home", () => {
    const model = buildDaimlerMarineInstallationModel();
    updateDaimlerMarineInstallationKinematics(model, {
      ...FrankenSimEngine.stepDaimlerMarineApparatus(1, true),
      illustrativePhaseRad: 0,
    });
    model.rootGroup.updateMatrixWorld(true);

    const boxGap = (a: THREE.Object3D, b: THREE.Object3D) => {
      const first = new THREE.Box3().setFromObject(a);
      const second = new THREE.Box3().setFromObject(b);
      const dx = Math.max(0, first.min.x - second.max.x, second.min.x - first.max.x);
      const dy = Math.max(0, first.min.y - second.max.y, second.min.y - first.max.y);
      const dz = Math.max(0, first.min.z - second.max.z, second.min.z - first.max.z);
      return Math.hypot(dx, dy, dz);
    };

    expect(model.sourceInterfaces.length).toBeGreaterThanOrEqual(25);
    for (const sourceInterface of model.sourceInterfaces) {
      expect(
        boxGap(sourceInterface.a, sourceInterface.b),
        `${sourceInterface.elementNumbers} (${sourceInterface.id}) is detached`,
      ).toBeLessThanOrEqual(1e-6);
    }
    model.dispose();
  });

  test("keeps the 2D face on the same discrete compiled-kernel topology", () => {
    const source = readFileSync(join(VISUALS_DIRECTORY, "DaimlerEngineSim.tsx"), "utf8");

    expect(source).toContain("ensureDaimlerWasm");
    expect(source).toContain("stepDaimlerMarineApparatus");
    expect(source).toContain('step="1"');
    expect(source).toContain("s¹/s² always present");
    expect(source).toContain("longitudinally movable propeller shaft and attached members");
    expect(source).not.toContain("engineRpm");
    expect(source).not.toContain("hotTube");
    expect(source).not.toContain('step="0.05"');
  });
});
