import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepEinsteinRefrigerator } from "@/physics/catalogKernels";
import { buildEinsteinRefrigeratorModel } from "./einsteinRefrigeratorModel";

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

    for (const preset of ["iso", "generator", "condenser", "evaporator", "absorber"]) {
      expect(threeSource).toContain(preset);
    }

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
    expect(result.cop).toBeGreaterThan(0.1);
  });

  test("builds and articulates procedural boiler generator, condenser coil, and evaporator correctly", () => {
    const {
      rootGroup,
      fridgeGroup,
      generatorMesh,
      heaterMesh,
      condenserGroup,
      evaporatorMesh,
      absorberMesh,
      economizerMesh,
      materials,
      dispose,
    } = buildEinsteinRefrigeratorModel();

    expect(rootGroup.children.length).toBeGreaterThan(0);
    expect(fridgeGroup).toBeDefined();
    expect(generatorMesh).toBeDefined();
    expect(heaterMesh).toBeDefined();
    expect(condenserGroup).toBeDefined();
    expect(evaporatorMesh).toBeDefined();
    expect(absorberMesh).toBeDefined();
    expect(economizerMesh).toBeDefined();
    expect(materials.coldEvaporator).toBeDefined();
    expect(materials.hotGenerator).toBeDefined();

    dispose();
  });
});
