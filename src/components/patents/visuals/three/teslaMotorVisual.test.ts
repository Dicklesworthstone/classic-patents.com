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

  test("steps from host-fed studio-clock ticks without ambient randomness or a private clock", () => {
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
    expect(threeSource).toContain("createStudioClock");
    expect(threeSource).toContain(".pump(frameTimeMs)");
    expect(threeSource).not.toContain("lastFrameTimeMs");
    expect(threeSource).not.toContain("const delta = 1 / 60");
  });

  test("exposes source-specific camera presets and keeps Fig. 9 and Fig. 13 semantics separate", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "TeslaMotor3D.tsx"), "utf8");

    for (const preset of ["iso", "stator_coils", "disk", "shaft", "generator", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).not.toContain("isCutaway");
    expect(threeSource).toContain("US 381,968 Fig. 9 motor-generator");
    expect(threeSource).toContain("generatorRpm");
    expect(threeSource).toContain("apparatus.diskRpm");
    expect(threeSource).toMatch(/Fig\. 15[-–]16 is a\s+distinct\s+source variant/i);
    expect(threeSource).toMatch(/(?:intentionally|deliberately) Fig\. 9 only/i);
    expect(threeSource).not.toContain("squirrel_cage");
    expect(threeSource).not.toContain("Source Guide");
    expect(threeSource).not.toContain("pole count");
    expect(threeSource).toContain("controls.setView");
    expect(threeSource).not.toContain("camera.position.set");
  });

  test("keeps the Fig. 9 display relationship separate from an unprinted performance claim", () => {
    const result = FrankenSimEngine.stepTeslaMotorFig9(60);
    expect(result.usesGeneratorContactRings).toBe(true);
    expect(result.usesMotorCommutator).toBe(false);
    expect(result.fieldDisplayTickS).toBeCloseTo(0.03, 5);
    expect(result.bVectorSvgScale).toBe(60);
    expect(result.schematicFieldIntensity).toBe(1);
    expect(result.schematicFillOpacity).toBeCloseTo(0.1, 4);
    expect(result.schematicStrobeLen).toBe(28);
    expect(result.schematicLiveLen).toBe(44);
    expect(result.schematicStrobeOpacityBase).toBe(0.18);
    expect(result.schematicStrobeStroke).toBe(1.2);
    expect(result.statorRingOuterSvgR).toBe(110);
    expect(result.twoPhaseVectorOpacity).toBe(0.55);
    expect(result.coilPhaseOffsetRad).toBeCloseTo(Math.PI / 2, 10);
    expect(result.coilEmissiveAmp).toBe(0.9);
    expect(result.schematicStatorOuterR).toBe(95);
    expect(result.schematicRotorR).toBe(42);
    expect(result.schematicPoleCount).toBe(4);

    const twoDSource = readFileSync(join(VISUALS_DIRECTORY, "TeslaMotorSim.tsx"), "utf8");
    expect(twoDSource).toContain("teslaPoleCurrent");
    expect(twoDSource).not.toContain("Math.PI / 2");
  });

  test("builds only Fig. 9's printed annulus, disk, generator contacts, circuits, and field guide", () => {
    const model = buildTeslaMotorModel();

    expect(model.rootGroup.children.length).toBeGreaterThan(1);
    expect(model.statorGroup).toBeDefined();
    expect(model.rotorGroup).toBeDefined();
    expect(model.shaftMarker).toBeDefined();
    expect(model.generatorGroup).toBeDefined();
    expect(model.generatorCollectorRings).toHaveLength(4);
    expect(model.generatorBrushes).toHaveLength(4);
    expect(model.coilMeshes.length).toBe(4);
    expect(model.fluxPoints).toBeDefined();
    expect(model.materials.annulusIron).toBeDefined();
    expect(model.materials.insulatedWire).toBeDefined();
    expect(model.materials.magneticDisk).toBeDefined();

    updateTeslaMotorKinematics(model, 0.016, 18.8, 1.2, true);
    expect(model.fluxPoints.visible).toBe(true);

    model.dispose();
  });

  test("builds authentic procedural apparatus with stator, rotor, and generator contacts", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "teslaMotorModel.ts"),
      "utf8",
    ).toLowerCase();
    for (const required of [
      "statorgroup",
      "rotorgroup",
      "generatorgroup",
      "fluxpoints",
      "coilmeshes",
    ]) {
      expect(modelSource).toContain(required);
    }
  });
});
