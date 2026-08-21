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
  lamarrSchematicHop,
  lamarrSchematicStaffY,
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

  test("keeps telemetry bounded to the illustrated seven-row record system", () => {
    const result = FrankenSimEngine.stepLamarrFrequencyHopping(7, 0);
    expect(result.channelsCount).toBe(7);
    expect(result.processingGainDb).toBe(0);
    expect(result.antiJammingMarginDb).toBe(0);
    expect(result.spreadSpectrumBandwidthMhz).toBe(0);
    expect(result.spreadSpectrumBandwidthHz).toBe(0);
    expect(result.pianoKeys).toBe(7);
    expect(result.pianoRollStep).toBe(1);
    expect(result.hopSoundStride).toBe(1);
    expect(result.drumDisplayOmegaRadPerS).toBe(0);
    expect(result.spectrumBarOriginX).toBe(20);
    expect(result.spectrumBarPitchPx).toBe(4.5);
    expect(result.schematicStaffCount).toBe(11);
    expect(result.schematicHopW).toBe(22);
    expect(result.schematicBoxW).toBe(300);
    expect(result.schematicHopSequence).toEqual([0, 3, 1, 7, 4, 9, 2, 6]);
    expect(lamarrSchematicStaffY(0)).toBe(75);
    expect(lamarrSchematicStaffY(1)).toBe(88);
    expect(lamarrSchematicHop(0, 0).x).toBe(80);
    expect(lamarrSchematicHop(1, 3).y).toBe(114);
    expect(lamarrPianoRollChannel(0)).toBe(1);
    expect(lamarrChannelFrequencyMhz(1)).toBe(1);
    expect(lamarrChannelFrequencyMhz(7)).toBe(7);
    expect(lamarrDefaultJamChannel(7)).toBe(1);
    expect(lamarrRadioChannel(1, 7)).toBe(1);
    expect(lamarrPianoKeyHz(7)).toBe(0);

    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "LamarrFrequencyHopping3D.tsx"),
      "utf8",
    );
    expect(threeSource).toContain("recordPosition");
    expect(threeSource).toContain("elapsed");
    expect(threeSource).not.toContain("Date.now()");
    expect(threeSource).not.toContain("0.016");
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "lamarrFrequencyHoppingModel.ts"),
      "utf8",
    );
    expect(modelSource).not.toContain("delta * 1.5");

    const schematicSource = readFileSync(
      join(process.cwd(), "src", "components", "patents", "InteractiveDiagramViewer.tsx"),
      "utf8",
    );
    expect(schematicSource).toContain("lamarrSchematicStaffY");
    expect(schematicSource).toContain("lamarrSchematicHop");
    expect(schematicSource).not.toContain("75 + i * 13");
    expect(schematicSource).not.toContain("80 + i * 30");
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
    expect(model.barMeshes.length).toBe(7);
    expect(model.hopPoints).toBeDefined();

    // Test kinematics update & cutaway
    updateLamarrFrequencyHoppingKinematics(model, 1 / 60, 3, 7, true, false, true, 1.5);
    expect(model.barMeshes[3].scale.y).toBeGreaterThan(1.0);
    expect(model.drum1.rotation.y).toBeCloseTo(0.75, 5);
    expect(model.materials.torpedoBayMat.opacity).toBe(0.35);

    model.dispose();
  });
});
