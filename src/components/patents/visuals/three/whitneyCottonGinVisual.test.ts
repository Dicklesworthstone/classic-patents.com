import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepWhitneyCottonGin } from "@/physics/catalogKernels";
import {
  buildWhitneyCottonGinModel,
  updateWhitneyCottonGinKinematics,
} from "./whitneyCottonGinModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US X72 Eli Whitney Cotton Gin visual & kinematics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "WhitneyCottonGin3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "whitneyCottonGinModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildWhitneyCottonGinModel");
    expect(modelSource).toContain("updateWhitneyCottonGinKinematics");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "WhitneyCottonGin3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "whitneyCottonGinModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and UI overlay for cotton gin observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "WhitneyCottonGin3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "grate_saws", "brush_drum", "hopper", "crank_drive", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Whitney Cotton Gin 3D");
  });

  test("computes genuine mechanical output rate, labor multiplier, and kinematics in SI units", () => {
    const result = stepWhitneyCottonGin({ crankRpm: 180 });
    expect(result.outputLbsPerDay).toBeGreaterThan(40);
    expect(result.sawRpm).toBeGreaterThan(100);
    expect(result.brushRpm).toBeGreaterThan(result.sawRpm);
    expect(result.laborMultiplier).toBeGreaterThan(40);
  });

  test("builds and articulates procedural timber frame, breastwork grate, saw cylinder, and brush cylinder correctly", () => {
    const model = buildWhitneyCottonGinModel();

    expect(model.rootGroup.children.length).toBeGreaterThan(4);
    expect(model.frameGroup).toBeDefined();
    expect(model.grateGroup).toBeDefined();
    expect(model.sawCylinderGroup).toBeDefined();
    expect(model.brushCylinderGroup).toBeDefined();
    expect(model.crankGroup).toBeDefined();
    expect(model.drivePulleyGroup).toBeDefined();
    expect(model.fiberPoints).toBeDefined();
    expect(model.seedsGroup).toBeDefined();
    expect(model.materials.walnutWood).toBeDefined();
    expect(model.materials.ironSaw).toBeDefined();
    expect(model.materials.brassGrate).toBeDefined();

    updateWhitneyCottonGinKinematics(model, 0.016, 18.8, 18.8, 47.1, true, true);
    expect(model.materials.walnutWood.opacity).toBe(0.35);
    expect(model.fiberPoints.visible).toBe(true);

    model.dispose();
  });
});
