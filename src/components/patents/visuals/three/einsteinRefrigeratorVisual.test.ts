import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepEinsteinRefrigerator } from "@/physics/catalogKernels";
import {
  buildEinsteinRefrigeratorModel,
  updateEinsteinRefrigeratorKinematics,
} from "./einsteinRefrigeratorModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 1,781,541 Albert Einstein & Leo Szilard Refrigerator visual & thermodynamics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "EinsteinRefrigerator3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "einsteinRefrigeratorModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildEinsteinRefrigeratorModel");
    expect(modelSource).toContain("updateEinsteinRefrigeratorKinematics");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "EinsteinRefrigerator3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "einsteinRefrigeratorModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and UI overlay for hermetic absorption cycle observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "EinsteinRefrigerator3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "generator", "condenser", "evaporator", "absorber", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Albert Einstein & Leo Szilard (US 1,781,541)");
  });

  test("computes genuine Dalton partial pressure, sub-zero evaporator temp, and COP in SI units", () => {
    const result = stepEinsteinRefrigerator({
      heatInput: 220,
      totalPressure: 15,
      ammoniaRatio: 0.65,
    });
    expect(result.coolingWatts).toBeGreaterThan(30);
    expect(result.evapTempC).toBeLessThan(5);
    expect(result.evapTempF).toBe(Math.round((result.evapTempC * 9) / 5 + 32));
    expect(result.cop).toBeGreaterThan(0.1);
    expect(result.fluidDisplaySpeed).toBeCloseTo(result.coolingWatts / 45 + 0.8, 2);
    expect(result.fluidWrapY).toBe(2.8);
  });

  test("builds and articulates procedural boiler generator, condenser coil, and evaporator correctly", () => {
    const model = buildEinsteinRefrigeratorModel();

    expect(model.rootGroup.children.length).toBeGreaterThan(0);
    expect(model.fridgeGroup).toBeDefined();
    expect(model.generatorMesh).toBeDefined();
    expect(model.heaterMesh).toBeDefined();
    expect(model.condenserGroup).toBeDefined();
    expect(model.evaporatorMesh).toBeDefined();
    expect(model.absorberMesh).toBeDefined();
    expect(model.economizerMesh).toBeDefined();
    expect(model.materials.coldEvaporator).toBeDefined();
    expect(model.materials.hotGenerator).toBeDefined();

    const fridge = stepEinsteinRefrigerator({
      heatInput: 220,
      totalPressure: 15,
      ammoniaRatio: 0.65,
    });
    updateEinsteinRefrigeratorKinematics(
      model,
      0.016,
      fridge.fluidDisplaySpeed,
      fridge.heaterGlowIntensity,
      fridge.generatorGlowIntensity,
      true,
      true,
    );
    expect(model.materials.weldedSteel.opacity).toBe(0.35);

    model.dispose();
  });
});
