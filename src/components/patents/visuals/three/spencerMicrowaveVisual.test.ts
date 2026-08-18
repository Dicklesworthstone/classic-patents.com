import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FrankenSimEngine } from "@/physics/engine";
import { buildSpencerMicrowaveModel } from "./spencerMicrowaveModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals");

describe("US 2,495,429 Percy Spencer Microwave Cavity Magnetron visual & RF physics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "spencerMicrowaveModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "SpencerMicrowave3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("useGLTF");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(threeSource).not.toContain("useGLTF");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "spencerMicrowaveModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "SpencerMicrowave3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("performance.now()");
  });

  test("exposes authentic camera presets and UI overlay for microwave magnetron inspection", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "SpencerMicrowave3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "cavity_resonator",
      "electron_spokes",
      "waveguide_launch",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }
  });

  test("computes genuine Hull cutoff condition, microwave frequency, and dielectric loss in SI units", () => {
    const result = FrankenSimEngine.stepSpencerMicrowave(2.2, 1450, 800);
    expect(result.hullCutoffGauss).toBeGreaterThan(500);
    expect(result.isOscillating).toBe(true);
    expect(result.microwaveFreqMhz).toBeGreaterThan(2000);
    expect(result.dielectricLossWattsPerDm3).toBeGreaterThan(100);
  });

  test("builds and articulates procedural copper anode block, resonant cavities, cathode rod, and electron spokes correctly", () => {
    const model = buildSpencerMicrowaveModel();
    expect(model.root.children.length).toBeGreaterThan(0);
    expect(model.magnetronGroup).toBeDefined();
    expect(model.anodeOuter).toBeDefined();
    expect(model.cathodeMesh).toBeDefined();
    expect(model.spokePoints).toBeDefined();

    // Test kinematics update
    model.updateKinematics(1 / 60, true, 2450, 850, true);
    expect(model.spokePoints.visible).toBe(true);
    expect(model.spokePoints.rotation.y).toBeGreaterThan(0);

    model.dispose();
  });
});
