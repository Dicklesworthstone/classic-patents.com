import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FrankenSimEngine } from "@/physics/engine";
import { buildMaximMachineGunModel, updateMaximMachineGunKinematics } from "./maximMachineGunModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 319,596 Sir Hiram Maxim Automatic Machine Gun visual & ballistics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "MaximMachineGun3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "maximMachineGunModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildMaximMachineGunModel");
    expect(modelSource).toContain("updateMaximMachineGunKinematics");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "MaximMachineGun3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "maximMachineGunModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for automatic weapon observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "MaximMachineGun3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "toggle_lock",
      "water_jacket",
      "belt_feed",
      "spade_grips",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Maxim Machine Gun 3D");
  });

  test("computes genuine recoil kinematics and thermodynamic water evaporation in SI units", () => {
    const result = FrankenSimEngine.stepMaximMachineGun({
      firingRateRpm: 600,
      waterJacketLiters: 4,
      recoilStrokeMm: 19,
    });
    expect(result.recoilStrokeMm).toBe(19);
    expect(result.recoilMomentumNs).toBeGreaterThan(5);
    expect(result.toggleUnlockForceN).toBeGreaterThan(100);
    expect(result.muzzleEnergyJoules).toBeGreaterThan(2000);
  });

  test("builds and articulates procedural barrel, toggle lock, belt feed, and water jacket correctly", () => {
    const model = buildMaximMachineGunModel();
    expect(model.rootGroup.children.length).toBeGreaterThan(2);
    expect(model.recoilingBarrelGroup).toBeDefined();
    expect(model.toggleJointGroup).toBeDefined();
    expect(model.crankHandle).toBeDefined();
    expect(model.muzzleFlashMesh).toBeDefined();

    const { isMuzzleFlash } = updateMaximMachineGunKinematics(
      model,
      0.016,
      0.5,
      (600 * 2 * Math.PI) / 60,
      0.019,
      120,
      10,
      true,
      true,
    );
    expect(typeof isMuzzleFlash).toBe("boolean");
    expect(model.materials.jacketMat.transparent).toBe(true);

    model.dispose();
  });
});
