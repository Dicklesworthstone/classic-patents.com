import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepEdisonBulb } from "@/physics/catalogKernels";
import { buildEdisonBulbModel, updateEdisonBulbKinematics } from "./edisonBulbModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 223,898 Thomas Edison Incandescent Lamp visual & physics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "EdisonBulb3D.tsx"), "utf8");
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "edisonBulbModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildEdisonBulbModel");
    expect(modelSource).toContain("updateEdisonBulbKinematics");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "EdisonBulb3D.tsx"), "utf8");
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "edisonBulbModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for electric lamp inspection", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "EdisonBulb3D.tsx"), "utf8");

    for (const preset of [
      "iso",
      "filament_horseshoe",
      "screw_base",
      "exhaust_tip",
      "glass_stem",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Edison Incandescent Bulb 3D");
  });

  test("computes genuine blackbody temperature, hot resistance, and radiant watts in SI units", () => {
    const result = stepEdisonBulb({
      voltage: 110,
      filamentLength: 22,
    });
    expect(result.filamentTempK).toBeGreaterThan(1500);
    expect(result.hotResistanceOhm).toBeGreaterThan(50);
    expect(result.radiantWatts).toBeGreaterThan(20);
    expect(result.luminousLmPerW).toBeGreaterThan(1.0);
    expect(result.incandescenceIntensity).toBeCloseTo(1, 3);
    expect(result.thermalJitterPerS).toBeGreaterThan(0);
    expect(result.glowOpacity).toBeCloseTo(
      Math.min(1, Math.max(0.1, result.radiantWatts / 150)),
      3,
    );
    expect(result.schematicGlowOpacity).toBeCloseTo(
      Math.min(0.9, Math.max(0.2, (result.filamentTempK - 1800) / 1000)),
      3,
    );
    expect(result.glowStopInner).toBeCloseTo(result.glowOpacity * 0.8, 3);
    expect(result.schematicGlowFill).toBeCloseTo(result.schematicGlowOpacity * 0.3, 3);
  });

  test("builds and articulates procedural pear glass bulb, screw base, platinum leads, and horseshoe filament correctly", () => {
    const model = buildEdisonBulbModel();
    expect(model.rootGroup.children.length).toBeGreaterThan(0);
    expect(model.glassMesh).toBeDefined();
    expect(model.filamentMesh).toBeDefined();
    expect(model.bulbLight).toBeDefined();

    const bulb = stepEdisonBulb({ voltage: 110, filamentLength: 22 });
    const { incandescenceIntensity, glowColor } = updateEdisonBulbKinematics(
      model,
      0.016,
      0.5,
      bulb.incandescenceIntensity,
      bulb.filamentTempK,
      bulb.thermalJitterPerS,
      bulb.filamentEmissiveScale,
      bulb.bulbLightScale,
      1e-6,
      true,
      true,
    );
    expect(incandescenceIntensity).toBeGreaterThan(0.9);
    expect(glowColor.r).toBeGreaterThan(0.5);
    expect(model.materials.glassMat.opacity).toBe(0.35);

    model.dispose();
  });
});
