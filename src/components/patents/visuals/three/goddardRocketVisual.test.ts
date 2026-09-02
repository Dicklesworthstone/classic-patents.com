import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import {
  buildGoddard1914ApparatusModel,
  updateGoddard1914ApparatusKinematics,
} from "./goddard1914ApparatusModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals");

describe("US 1,102,653 Robert H. Goddard Rocket visual simulation", () => {
  test("routes Goddard Rocket to its 3D WebGL simulator and 2D vector simulator", () => {
    const dispatcherSource = readFileSync(join(VISUALS_DIRECTORY, "index.tsx"), "utf8");

    expect(dispatcherSource).toContain('case "us-1102653-goddard-rocket":');
    expect(dispatcherSource).toContain("GoddardRocket3D");
    expect(dispatcherSource).toContain("GoddardRocketSim");
  });

  test("builds and updates the source-bounded connected apparatus model", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three/goddard1914ApparatusModel.ts"),
      "utf8",
    );

    expect(modelSource).toContain("buildGoddard1914ApparatusModel");
    expect(modelSource).toContain("updateGoddard1914ApparatusKinematics");
    expect(modelSource).toContain("GODDARD_1914_SOURCE_GEOMETRY");
    expect(modelSource).toContain("sourceInterfaces");
    for (const falseMechanism of [
      "liquid-propellant",
      "deLavalMeridian",
      "shock diamond",
      "aerodynamic stabilizing fins",
      "regenerative cooling",
    ]) {
      expect(modelSource.toLowerCase()).not.toContain(falseMechanism.toLowerCase());
    }
  });

  test("keeps every printed load-bearing interface in contact at the nested home state", () => {
    const model = buildGoddard1914ApparatusModel();
    updateGoddard1914ApparatusKinematics(model, {
      elapsedSeconds: 0,
      primaryQuaternion: [1, 0, 0, 0],
      gyroQuaternion: [1, 0, 0, 0],
      tubeLengthRatio: 4.5,
      auxiliaryReleaseFraction: 0,
      primaryChargeSubstantiallyConsumed: false,
      claim1SequenceSatisfied: true,
      claim2Satisfied: true,
      gyroEnabled: true,
      gyroOperational: true,
      claim1Present: true,
      claim3Present: true,
      claim7Present: true,
      showEfflux: false,
      showCalloutPins: false,
      isCutaway: true,
    });
    model.root.updateMatrixWorld(true);

    const boxGap = (a: THREE.Object3D, b: THREE.Object3D) => {
      const first = new THREE.Box3().setFromObject(a);
      const second = new THREE.Box3().setFromObject(b);
      const dx = Math.max(0, first.min.x - second.max.x, second.min.x - first.max.x);
      const dy = Math.max(0, first.min.y - second.max.y, second.min.y - first.max.y);
      const dz = Math.max(0, first.min.z - second.max.z, second.min.z - first.max.z);
      return Math.hypot(dx, dy, dz);
    };

    expect(model.sourceInterfaces.length).toBeGreaterThanOrEqual(12);
    for (const sourceInterface of model.sourceInterfaces) {
      expect(
        boxGap(sourceInterface.a, sourceInterface.b),
        `${sourceInterface.elementNumbers} (${sourceInterface.id}) is detached`,
      ).toBeLessThanOrEqual(1e-6);
    }
    model.dispose();
  });

  test("3D camera chips drain studio.controls.setView instead of a leftover camera ref", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three/Goddard1914Apparatus3D.tsx"),
      "utf8",
    );
    expect(threeSource).toContain("controls.setView");
    expect(threeSource).not.toContain("cameraRef");
    for (const preset of ["iso", "solid_charge", "spin_tubes", "auxiliary", "gyro", "frame"]) {
      expect(threeSource).toContain(preset);
    }
    expect(threeSource).toContain("stepGoddardApparatus");
    expect(threeSource).not.toContain("stepGoddardRocket");
  });
});
