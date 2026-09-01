import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { FrankenSimEngine } from "@/physics/engine";
import {
  buildDaimlerMarineInstallationModel,
  updateDaimlerMarineInstallationKinematics,
} from "./daimlerMarineInstallationModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

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
