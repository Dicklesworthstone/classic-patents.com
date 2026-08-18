import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FrankenSimEngine } from "@/physics/engine";
import { buildGoddardRocketModel } from "./goddardRocketModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals");

describe("US 1,102,653 Robert H. Goddard Rocket visual & propulsion boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "goddardRocketModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "GoddardRocket3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("useGLTF");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(threeSource).not.toContain("useGLTF");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "goddardRocketModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "GoddardRocket3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("performance.now()");
  });

  test("exposes authentic camera presets and UI overlay for rocket propulsion observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "GoddardRocket3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "de_laval_nozzle",
      "combustion_chamber",
      "gimbal_actuator",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }
  });

  test("computes genuine de Laval supersonic expansion and specific impulse in SI units", () => {
    const result = FrankenSimEngine.stepGoddardRocket(350, 1.8, 4.2, 3.5);
    expect(result.chamberPressurePa).toBeGreaterThan(1e6);
    expect(result.exhaustVelocityMps).toBeGreaterThan(1500);
    expect(result.machExit).toBeGreaterThan(1.0);
    expect(result.thrustNewtons).toBeGreaterThan(1000);
    expect(result.specificImpulseSec).toBeGreaterThan(150);
  });

  test("builds and articulates procedural stage 1 booster, stabilizing fins, de Laval nozzle, and stage 2 sustainer correctly", () => {
    const model = buildGoddardRocketModel();
    expect(model.root.children.length).toBeGreaterThan(0);
    expect(model.stage1Group).toBeDefined();
    expect(model.stage2Group).toBeDefined();
    expect(model.nozzleGroup).toBeDefined();
    expect(model.deLavalMesh).toBeDefined();
    expect(model.plumePoints).toBeDefined();

    // Test kinematics update across stages
    model.updateKinematics(1 / 60, 1, 5, 3.5, 2200, true);
    expect(model.nozzleGroup.rotation.z).toBeCloseTo((5 * Math.PI) / 180, 2);

    model.updateKinematics(1 / 60, 2, 0, 4.0, 2400, true);
    expect(model.stage2Group.position.y).toBeGreaterThan(4.0);

    model.dispose();
  });
});
