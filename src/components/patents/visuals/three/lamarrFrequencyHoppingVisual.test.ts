import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FrankenSimEngine } from "@/physics/engine";
import { buildLamarrFrequencyHoppingModel } from "./lamarrFrequencyHoppingModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals");

describe("US 2,292,387 Hedy Lamarr & George Antheil Secret Communication System visual & spread spectrum boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "lamarrFrequencyHoppingModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "LamarrFrequencyHopping3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("useGLTF");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(threeSource).not.toContain("useGLTF");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "lamarrFrequencyHoppingModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "LamarrFrequencyHopping3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("performance.now()");
  });

  test("exposes authentic camera presets and UI overlay for frequency hopping observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "LamarrFrequencyHopping3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "roll", "waterfall", "escapement", "torpedo"]) {
      expect(threeSource).toContain(preset);
    }
  });

  test("computes genuine processing gain and anti-jamming margin in SI / dB units", () => {
    const result = FrankenSimEngine.stepLamarrFrequencyHopping(88, 4);
    expect(result.processingGainDb).toBeGreaterThan(15);
    expect(result.antiJammingMarginDb).toBeGreaterThan(10);
    expect(result.spreadSpectrumBandwidthMhz).toBeGreaterThan(5);
    expect(result.spreadSpectrumBandwidthMhz).toBeLessThan(50);
  });

  test("builds and articulates procedural torpedo bay, twin reels, paper roll web, sensing comb, and 88-bar waterfall correctly", () => {
    const model = buildLamarrFrequencyHoppingModel();
    expect(model.root.children.length).toBeGreaterThan(0);
    expect(model.apparatusGroup).toBeDefined();
    expect(model.drum1).toBeDefined();
    expect(model.drum2).toBeDefined();
    expect(model.paperWeb).toBeDefined();
    expect(model.comb).toBeDefined();
    expect(model.spectrumBarsGroup).toBeDefined();
    expect(model.barMeshes.length).toBe(88);
    expect(model.hopPoints).toBeDefined();

    // Test kinematics update
    model.updateKinematics(1 / 60, 44, 88, true, 26);
    expect(model.barMeshes[44].scale.y).toBeGreaterThan(1.0);

    model.dispose();
  });
});
