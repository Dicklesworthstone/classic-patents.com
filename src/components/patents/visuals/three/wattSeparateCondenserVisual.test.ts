import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { stepWattCondenser, WATT_DEFAULT_CONTROLS } from "@/physics/wattCondenserKernel";
import { buildWattSeparateCondenserModel, WATT_DIM } from "./wattSeparateCondenserModel";

describe("GB 913 James Watt Separate Condenser visual & thermodynamics boundary", () => {
  const root = process.cwd();

  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      resolve(root, "src/components/patents/visuals/three/wattSeparateCondenserModel.ts"),
      "utf-8",
    );
    const vizSource = readFileSync(
      resolve(root, "src/components/patents/visuals/three/WattSeparateCondenser3D.tsx"),
      "utf-8",
    );

    expect(modelSource).not.toContain("GLTFLoader");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(vizSource).not.toContain("GLTFLoader");
    expect(vizSource).not.toContain(".glb");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const vizSource = readFileSync(
      resolve(root, "src/components/patents/visuals/three/WattSeparateCondenser3D.tsx"),
      "utf-8",
    );
    expect(vizSource).not.toContain("Math.random()");
    expect(vizSource).not.toContain("new THREE.Clock");
    expect(vizSource).not.toContain("performance.now()");
  });

  test("exposes authentic camera presets and cutaway mode for steam jacket inspection", () => {
    const vizSource = readFileSync(
      resolve(root, "src/components/patents/visuals/three/WattSeparateCondenser3D.tsx"),
      "utf-8",
    );
    expect(vizSource).toContain("activePreset");
    expect(vizSource).toContain("Steam Jacket (B)");
    expect(vizSource).toContain("Condenser (E)");
    expect(vizSource).toContain("Walking Beam (H)");
    expect(vizSource).toContain("Boiler (A)");
    expect(vizSource).toContain("setCutaway");
  });

  test("computes genuine Rankine cycle power, separate condenser vacuum, and coal economy in SI units", () => {
    const out = stepWattCondenser(WATT_DEFAULT_CONTROLS);
    expect(out.indicatedHorsepower).toBeGreaterThan(20);
    expect(out.vacuumDepthInchesHg).toBeGreaterThan(27);
    expect(out.thermalEfficiencyPct).toBeGreaterThan(2.5);
    expect(out.coalConsumptionKgPerHour).toBeGreaterThan(15);
    expect(out.coalSavedTonsPerYear).toBeGreaterThan(100);
  });

  test("builds and articulates procedural walking beam, steam jacket, piston, separate condenser, and air pump correctly", () => {
    const model = buildWattSeparateCondenserModel();
    expect(model.root).toBeDefined();
    expect(model.beamGroup).toBeDefined();
    expect(model.pistonGroup).toBeDefined();
    expect(model.airPumpRodGroup).toBeDefined();
    expect(model.condenserGroup).toBeDefined();
    expect(model.calloutGroup).toBeDefined();

    // Verify dimension table matches Soho archival plans
    expect(WATT_DIM.cylinderBoreM).toBe(0.965);
    expect(WATT_DIM.beamLengthM).toBe(7.315);
    expect(WATT_DIM.fulcrumHeightM).toBe(5.8);

    // Test cutaway toggle
    model.setCutaway(true);
    expect(model.jacketMesh.visible).toBe(false);
    model.setCutaway(false);
    expect(model.jacketMesh.visible).toBe(true);

    // Test callouts toggle
    model.setCalloutsVisible(false);
    expect(model.calloutGroup.visible).toBe(false);
    model.setCalloutsVisible(true);
    expect(model.calloutGroup.visible).toBe(true);

    model.dispose();
  });
});
