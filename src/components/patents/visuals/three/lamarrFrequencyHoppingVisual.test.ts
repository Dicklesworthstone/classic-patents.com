import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  FrankenSimEngine,
  lamarrChannelFrequencyMhz,
  lamarrDefaultJamChannel,
  lamarrPianoKeyHz,
  lamarrPianoRollChannel,
  lamarrRadioChannel,
} from "@/physics/engine";
import {
  buildLamarrFrequencyHoppingModel,
  updateLamarrFrequencyHoppingKinematics,
} from "./lamarrFrequencyHoppingModel";

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
    expect(modelSource).toContain("buildLamarrFrequencyHoppingModel");
    expect(modelSource).toContain("updateLamarrFrequencyHoppingKinematics");
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

    for (const preset of ["iso", "roll", "waterfall", "escapement", "torpedo", "top"]) {
      expect(threeSource).toContain(preset);
    }
    expect(threeSource).toContain("isCutaway");
  });

  test("computes genuine processing gain and anti-jamming margin in SI / dB units", () => {
    const result = FrankenSimEngine.stepLamarrFrequencyHopping(88, 4);
    expect(result.processingGainDb).toBeGreaterThan(15);
    expect(result.antiJammingMarginDb).toBeGreaterThan(10);
    expect(result.spreadSpectrumBandwidthMhz).toBeGreaterThan(5);
    expect(result.spreadSpectrumBandwidthMhz).toBeLessThan(50);
    expect(result.spreadSpectrumBandwidthHz).toBe(result.spreadSpectrumBandwidthMhz * 1e6);
    expect(result.bandMinMhz).toBe(302);
    expect(result.bandMaxMhz).toBe(520);
    expect(result.defaultJamChannel).toBe(26);
    expect(result.pianoKeys).toBe(88);
    expect(result.pianoRollStep).toBe(37);
    expect(lamarrPianoRollChannel(0)).toBe(1);
    expect(lamarrChannelFrequencyMhz(1)).toBe(302);
    expect(lamarrChannelFrequencyMhz(88)).toBe(520);
    expect(lamarrDefaultJamChannel(88)).toBe(26);
    expect(lamarrRadioChannel(1, 88)).toBe(1);
    expect(lamarrPianoKeyHz(88)).toBeCloseTo(880, 5);

    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "LamarrFrequencyHopping3D.tsx"),
      "utf8",
    );
    expect(threeSource).toContain("spreadSpectrumBandwidthHz");
    expect(threeSource).not.toContain("* 1e6");
    expect(threeSource).not.toContain("liveChannels * 0.3");
  });

  test("builds and articulates procedural torpedo bay, twin reels, paper roll web, sensing comb, and waterfall correctly", () => {
    const model = buildLamarrFrequencyHoppingModel();
    expect(model.root.children.length).toBeGreaterThan(0);
    expect(model.apparatusGroup).toBeDefined();
    expect(model.drum1).toBeDefined();
    expect(model.drum2).toBeDefined();
    expect(model.paperWeb).toBeDefined();
    expect(model.comb).toBeDefined();
    expect(model.spectrumBarsGroup).toBeDefined();
    expect(model.barMeshes.length).toBe(44);
    expect(model.hopPoints).toBeDefined();

    // Test kinematics update & cutaway
    updateLamarrFrequencyHoppingKinematics(model, 1 / 60, 22, 44, true, 13, true);
    expect(model.barMeshes[22].scale.y).toBeGreaterThan(1.0);
    expect(model.materials.torpedoBayMat.opacity).toBe(0.35);

    model.dispose();
  });
});
