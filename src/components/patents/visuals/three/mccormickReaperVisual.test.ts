import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepMcCormickReaper } from "@/physics/catalogKernels";
import { buildMcCormickReaperModel } from "./mccormickReaperModel";

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

    for (const preset of ["iso", "sickle_guards", "grain_reel", "platform", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("McCormick Reaper 3D");
  });

  test("computes genuine ground drive ratio, reel speed, and cutter frequency in SI units", () => {
    const result = stepMcCormickReaper({ forwardSpeedMph: 2.5 });
    expect(result.groundWheelRpm).toBeGreaterThan(20);
    expect(result.cutterCrankRpm).toBeGreaterThan(100);
    expect(result.reelRpm).toBeGreaterThan(10);
    expect(result.cutterHz).toBeGreaterThan(5);
  });

  test("builds and articulates procedural platform, bull drive wheel, guard fingers, sickle bar, and reel correctly", () => {
    const {
      rootGroup,
      platformGroup,
      driveWheelGroup,
      cutterAssembly,
      sickleBarGroup,
      reelGroup,
      stalksInstanced,
      materials,
      dispose,
    } = buildMcCormickReaperModel();

    expect(rootGroup.children.length).toBeGreaterThan(2);
    expect(platformGroup).toBeDefined();
    expect(driveWheelGroup).toBeDefined();
    expect(cutterAssembly).toBeDefined();
    expect(sickleBarGroup).toBeDefined();
    expect(reelGroup).toBeDefined();
    expect(stalksInstanced).toBeDefined();
    expect(materials.weatheredWood).toBeDefined();
    expect(materials.castIron).toBeDefined();
    expect(materials.sickleSteel).toBeDefined();

    dispose();
  });
});
