import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepMcCormickReaper } from "@/physics/catalogKernels";
import { buildMcCormickReaperModel, updateMcCormickReaperKinematics } from "./mccormickReaperModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US X8277 Cyrus McCormick Grain Reaper visual & kinematics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "McCormickReaper3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "mccormickReaperModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildMcCormickReaperModel");
    expect(modelSource).toContain("updateMcCormickReaperKinematics");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "McCormickReaper3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "mccormickReaperModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and UI overlay for grain reaper observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "McCormickReaper3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "sickle_guards", "grain_reel", "platform", "drive_wheel", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("McCormick Reaper 3D");
    expect(threeSource).toContain("isCutaway");
  });

  test("computes genuine ground drive ratio, reel speed, and cutter frequency in SI units", () => {
    const result = stepMcCormickReaper({ forwardSpeedMph: 2.5 });
    expect(result.groundWheelRpm).toBeGreaterThan(20);
    expect(result.cutterCrankRpm).toBeGreaterThan(100);
    expect(result.reelRpm).toBeGreaterThan(10);
    expect(result.cutterHz).toBeGreaterThan(5);
    expect(result.reelBarPct).toBeCloseTo(Math.min(100, (result.reelRpm / 80) * 100), 1);
    expect(result.cutterSvgAmp).toBe(18);
  });

  test("builds and articulates procedural platform, bull drive wheel, guard fingers, sickle bar, and reel correctly", () => {
    const model = buildMcCormickReaperModel();

    expect(model.rootGroup.children.length).toBeGreaterThan(2);
    expect(model.platformGroup).toBeDefined();
    expect(model.driveWheelGroup).toBeDefined();
    expect(model.cutterAssembly).toBeDefined();
    expect(model.sickleBarGroup).toBeDefined();
    expect(model.reelGroup).toBeDefined();
    expect(model.stalksInstanced).toBeDefined();
    expect(model.materials.weatheredWood).toBeDefined();
    expect(model.materials.castIron).toBeDefined();
    expect(model.materials.sickleSteel).toBeDefined();

    // Test kinematics update & cutaway
    updateMcCormickReaperKinematics(model, 3.5, 1.2, 10.0, 1.0, true, true);
    expect(model.driveWheelGroup.rotation.x).toBe(3.5);
    expect(model.materials.weatheredWood.opacity).toBe(0.35);

    model.dispose();
  });
});
