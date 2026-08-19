import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FrankenSimEngine } from "@/physics/engine";
import { buildDaimlerEngineModel, updateDaimlerEngineKinematics } from "./daimlerEngineModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 361,931 Gottlieb Daimler High-Speed Four-Stroke Engine visual & kinematics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "DaimlerEngine3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "daimlerEngineModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildDaimlerEngineModel");
    expect(modelSource).toContain("updateDaimlerEngineKinematics");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "DaimlerEngine3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "daimlerEngineModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and UI overlay for four-stroke hot-tube observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "DaimlerEngine3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "cylinder", "crankcase", "hottube", "flywheel", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Daimler High-Speed Petrol Engine 3D");
  });

  test("computes genuine high-speed four-stroke BMEP and brake horsepower in SI units", () => {
    const result = FrankenSimEngine.stepDaimlerEngine({
      engineRpm: 750,
      hotTubeTempC: 850,
      differentialSlipAngleDeg: 15,
    });
    expect(result.brakeHorsepower).toBeGreaterThan(0.5);
    expect(result.bmepBar).toBeGreaterThan(2.0);
    expect(result.isRunning).toBe(true);
    expect(result.hotTubeGlow).toBeCloseTo(2.8, 3);
    expect(result.pistonStrokePx).toBe(30);
  });

  test("builds and articulates procedural enclosed flywheels, hot-tube igniter, and valve pushrod correctly", () => {
    const model = buildDaimlerEngineModel();

    expect(model.rootGroup.children.length).toBeGreaterThan(4);
    expect(model.crankshaftGroup).toBeDefined();
    expect(model.flywheelGroup).toBeDefined();
    expect(model.pistonGroup).toBeDefined();
    expect(model.conRodGroup).toBeDefined();
    expect(model.hotTubeMesh).toBeDefined();
    expect(model.materials.hotTubeMat).toBeDefined();

    // Test 4-stroke cycle kinematics
    // Power stroke (stroke 2)
    const daimler = FrankenSimEngine.stepDaimlerEngine({
      engineRpm: 750,
      hotTubeTempC: 850,
      differentialSlipAngleDeg: 15,
    });
    const power = updateDaimlerEngineKinematics(
      model,
      Math.PI * 0.1,
      Math.PI * 2.1,
      850,
      daimler.hotTubeGlow,
      true,
    );
    expect(power.strokeIndex).toBe(2);
    expect(model.combustionFlame.visible).toBe(true);
    expect(model.materials.castIron.opacity).toBe(0.35);

    // Exhaust stroke (stroke 3)
    const exhaust = updateDaimlerEngineKinematics(
      model,
      Math.PI * 1.5,
      Math.PI * 3.5,
      850,
      daimler.hotTubeGlow,
      false,
    );
    expect(exhaust.strokeIndex).toBe(3);
    expect(model.exhaustPushrod.position.y).toBeGreaterThan(0.2);

    model.dispose();
  });
});
