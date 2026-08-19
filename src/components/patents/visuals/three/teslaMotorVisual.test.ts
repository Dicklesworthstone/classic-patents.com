import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FrankenSimEngine } from "@/physics/engine";
import { buildTeslaMotorModel, updateTeslaMotorKinematics } from "./teslaMotorModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 381,968 Tesla Fig. 9 motor visual & electromagnetics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "TeslaMotor3D.tsx"), "utf8");
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "teslaMotorModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildTeslaMotorModel");
    expect(modelSource).toContain("updateTeslaMotorKinematics");
  });

  test("uses the actual animation-frame delta without ambient randomness or a private clock", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "TeslaMotor3D.tsx"), "utf8");
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "teslaMotorModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
    expect(threeSource).toContain("frameTimeMs");
    expect(threeSource).toContain("lastFrameTimeMs");
    expect(threeSource).not.toContain("const delta = 1 / 60");
  });

  test("exposes source-specific camera presets and keeps Fig. 9 and Fig. 13 semantics separate", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "TeslaMotor3D.tsx"), "utf8");

    for (const preset of ["iso", "stator_coils", "disk", "shaft", "generator", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("US 381,968 {sourceFigure} Teaching Model");
    expect(threeSource).toContain("Fig. 15–16 is the distinct source variant");
    expect(threeSource).toContain(
      "Fig. 13 compares three independent generator and motor circuits",
    );
    expect(threeSource).toContain("Fig. 9 disk-D synchronous-rate demonstration");
    expect(threeSource).not.toContain("squirrel_cage");
  });

  test("models the source-stated Fig. 9 synchronous disk relationship without inventing a slip curve", () => {
    const result = FrankenSimEngine.stepTeslaMotorFig9(60);
    expect(result.generatorRpm).toBe(3600);
    expect(result.poleShiftRpm).toBe(result.generatorRpm);
    expect(result.diskRpm).toBe(result.generatorRpm);
    expect(result.usesGeneratorContactRings).toBe(true);
    expect(result.usesMotorCommutator).toBe(false);
    expect(result.fieldDisplayTickS).toBeCloseTo(0.03, 5);
    expect(result.bVectorSvgScale).toBe(60);
    expect(result.schematicFieldIntensity).toBe(1);
    expect(result.schematicFillOpacity).toBeCloseTo(0.1, 4);
    expect(result.schematicStrobeLen).toBe(28);
    expect(result.schematicLiveLen).toBe(44);
  });

  test("builds Fig. 9's annular field, disk, generator collector rings, brushes, and flux field procedurally", () => {
    const model = buildTeslaMotorModel(2);

    expect(model.rootGroup.children.length).toBeGreaterThan(1);
    expect(model.statorGroup).toBeDefined();
    expect(model.rotorGroup).toBeDefined();
    expect(model.shaftMarker).toBeDefined();
    expect(model.generatorGroup).toBeDefined();
    expect(model.generatorCollectorRings).toHaveLength(4);
    expect(model.generatorBrushes).toHaveLength(4);
    expect(model.coilMeshes.length).toBe(4);
    expect(model.fluxPoints).toBeDefined();
    expect(model.materials.statorIron).toBeDefined();
    expect(model.materials.copperCoil).toBeDefined();
    expect(model.materials.diskSteel).toBeDefined();

    updateTeslaMotorKinematics(model, 0.016, 18.8, 1.2, 2, true, true);
    expect(model.materials.statorIron.opacity).toBe(0.35);

    model.dispose();
  });

  test("models the Fig. 13 comparison with three source circuits and six generator rings", () => {
    const fig13 = buildTeslaMotorModel(3);
    expect(fig13.coilMeshes).toHaveLength(6);
    expect(fig13.generatorCollectorRings).toHaveLength(6);
    expect(fig13.generatorBrushes).toHaveLength(6);
    fig13.dispose();
  });
});
