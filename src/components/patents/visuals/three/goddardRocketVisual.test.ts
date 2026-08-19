import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FrankenSimEngine } from "@/physics/engine";
import { buildGoddardRocketModel, updateGoddardRocketKinematics } from "./goddardRocketModel";

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
    expect(modelSource).toContain("buildGoddardRocketModel");
    expect(modelSource).toContain("updateGoddardRocketKinematics");
    expect(modelSource).toContain("plumeAdvancePerS");
    expect(modelSource).not.toContain("/ 2000");
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
      "interstage",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }
    expect(threeSource).toContain("isCutaway");
  });

  test("computes genuine de Laval supersonic expansion and specific impulse in SI units", () => {
    const result = FrankenSimEngine.stepGoddardRocket(350, 1.8, 4.2, 3.5);
    expect(result.chamberPressurePa).toBeGreaterThan(1e6);
    expect(result.exhaustVelocityMps).toBeGreaterThan(1500);
    expect(result.machExit).toBeGreaterThan(1.0);
    expect(result.thrustNewtons).toBeGreaterThan(1000);
    expect(result.specificImpulseSec).toBeGreaterThan(150);
    expect(result.expansionRatio).toBe(3.5);
    expect(result.plumeAdvancePerS).toBeCloseTo((result.exhaustVelocityMps / 2000) * 35, 2);
    expect(result.chamberPressureAtm).toBeCloseTo(350 / 14.696, 1);
    const cold = FrankenSimEngine.stepGoddardRocket(50, 0.1, 4.2, 3.5);
    if (cold.exhaustVelocityMps < 800) {
      expect(cold.plumeAdvancePerS).toBe(0);
    }
  });

  test("builds and articulates procedural stage 1 booster, stabilizing fins, de Laval nozzle, and stage 2 sustainer correctly", () => {
    const model = buildGoddardRocketModel();
    expect(model.root.children.length).toBeGreaterThan(0);
    expect(model.stage1Group).toBeDefined();
    expect(model.stage2Group).toBeDefined();
    expect(model.nozzleGroup).toBeDefined();
    expect(model.deLavalMesh).toBeDefined();
    expect(model.plumePoints).toBeDefined();

    // Test kinematics update & cutaway
    const cruise = FrankenSimEngine.stepGoddardRocket(350, 1.8, 4.2, 3.5);
    updateGoddardRocketKinematics(
      model,
      1 / 60,
      1,
      5,
      cruise.expansionRatio,
      cruise.plumeAdvancePerS,
      true,
      true,
    );
    expect(model.nozzleGroup.rotation.z).toBeCloseTo((5 * Math.PI) / 180, 2);
    expect(model.materials.aluminumHullMat.opacity).toBe(0.35);

    const stage2 = FrankenSimEngine.stepGoddardRocket(350, 1.8, 4.2, 4.0);
    updateGoddardRocketKinematics(
      model,
      1 / 60,
      2,
      0,
      stage2.expansionRatio,
      stage2.plumeAdvancePerS,
      true,
      false,
    );
    expect(model.stage2Group.position.y).toBeGreaterThan(4.0);

    model.dispose();
  });
});
