import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepEdisonBulb } from "@/physics/catalogKernels";
import { buildEdison223898Model, updateEdison223898Model } from "./edison223898Model";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 223,898 Thomas Edison Incandescent Lamp visual & physics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "EdisonBulb3D.tsx"), "utf8");
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "edison223898Model.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildEdison223898Model");
    expect(modelSource).toContain("updateEdison223898Model");
    expect(modelSource).not.toContain("stepEdisonBulb");
    expect(threeSource).not.toContain("./edisonBulbModel");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "EdisonBulb3D.tsx"), "utf8");
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "edison223898Model.ts"),
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
      "sealed_feedthrough",
      "house_branch",
      "mounting_bracket",
      "exhaust_tip",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Edison Incandescent Bulb 3D");
    expect(threeSource).toContain("controls.setView");
    expect(threeSource).not.toContain("camera.position.set");
  });

  test("keeps the full desktop View rail out of the Claim 1 and utility-control lanes", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "EdisonBulb3D.tsx"), "utf8");

    // The View rail is bounded by the compact utility lane only. Claim 1 is
    // deliberately moved to a second desktop row, rather than being allowed
    // to squeeze or cover the final Plan View button.
    expect(threeSource).toContain("sm:right-56");
    expect(threeSource).toContain("sm:max-w-none");
    expect(threeSource).toContain("sm:absolute sm:top-full sm:right-0 sm:mt-3 sm:flex-nowrap");
    expect(threeSource).not.toContain("sm:max-w-[calc(100%-28rem)]");
    expect(threeSource).not.toContain("sm:right-auto");
  });

  test("computes finite interpretive temperature, hot resistance, and radiant watts in SI units", () => {
    const result = stepEdisonBulb({
      voltage: 110,
      hotResistanceOhm: 145,
      filamentLength: 22,
    });
    expect(result.filamentTempK).toBeGreaterThan(1500);
    expect(result.hotResistanceOhm).toBe(145);
    expect(result.radiantWatts).toBeGreaterThan(20);
    expect(result.radiativeEnergyClosure).toBeLessThan(1e-8);
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
    expect(result.glowThreshold).toBe(0.05);
    expect(result.gasPhaseOmega).toBe(2);
    expect(result.schematicGlowFill).toBeCloseTo(result.schematicGlowOpacity * 0.3, 3);
  });

  test("builds the source lamp and a physically supported, electrically continuous domestic branch", () => {
    const model = buildEdison223898Model();
    expect(model.rootGroup.children.length).toBeGreaterThan(0);
    expect(model.glassMesh).toBeDefined();
    expect(model.filamentMesh).toBeDefined();
    expect(model.bulbLight).toBeDefined();
    expect(model.rootGroup.getObjectByName("all-glass exhausted receiver")).toBeDefined();
    expect(model.rootGroup.getObjectByName("closed knife switch")).toBeDefined();
    expect(model.rootGroup.getObjectByName("floor-connected baseboard")).toBeDefined();
    expect(model.rootGroup.getObjectByName("Edison screw base")).toBeUndefined();

    for (const [interfaceName, interfaceGap] of Object.entries(model.connectivityReceipt())) {
      expect(interfaceGap, `${interfaceName} must be coincident`).toBeLessThanOrEqual(1e-8);
    }

    const bulb = stepEdisonBulb({ voltage: 110, hotResistanceOhm: 145, filamentLength: 22 });
    const { incandescenceIntensity, glowColor } = updateEdison223898Model(
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
    expect(model.materials.glass.opacity).toBe(0.18);

    model.dispose();
  });
});
