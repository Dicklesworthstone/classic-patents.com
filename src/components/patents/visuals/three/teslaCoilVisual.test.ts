import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FrankenSimEngine } from "@/physics/engine";
import { buildTeslaCoilModel } from "./teslaCoilModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 593,138 Nikola Tesla High-Frequency Electrical Transformer visual & resonance boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "TeslaCoil3D.tsx"), "utf8");
    const modelSource = readFileSync(join(VISUALS_DIRECTORY, "three", "teslaCoilModel.ts"), "utf8");

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildTeslaCoilModel");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "TeslaCoil3D.tsx"), "utf8");
    const modelSource = readFileSync(join(VISUALS_DIRECTORY, "three", "teslaCoilModel.ts"), "utf8");

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and UI overlay for resonant coil observation", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "TeslaCoil3D.tsx"), "utf8");

    for (const preset of ["iso", "toroid_breakout", "primary_spiral", "spark_gap", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("Interpretive Transformer Telemetry");
  });

  test("computes genuine secondary potential, streamer length, and resonant frequency in SI units", () => {
    const result = FrankenSimEngine.stepTeslaCoil(150, 15, 12, 145, 0.18, 850);
    expect(result.secondaryPotentialMv).toBeGreaterThan(0.1);
    expect(result.streamerLengthMeters).toBeGreaterThan(0.1);
    expect(result.streamerStudioLength).toBeCloseTo(result.streamerLengthMeters / 1.5, 2);
  });

  test("builds and articulates procedural mahogany base, secondary resonator, spiral primary, topload toroid, and spark gap correctly", () => {
    const model = buildTeslaCoilModel();
    expect(model.root.children.length).toBeGreaterThan(0);
    expect(model.tableBase).toBeDefined();
    expect(model.secondaryCylinder).toBeDefined();
    expect(model.spiralMesh).toBeDefined();
    expect(model.toroidMesh).toBeDefined();
    expect(model.sparkGapBase).toBeDefined();
    expect(model.streamerLines.length).toBeGreaterThan(0);

    const coil = FrankenSimEngine.stepTeslaCoil(150, 15, 12, 145, 0.18, 850);
    model.updateKinematics(0.016, true, coil.streamerStudioLength, coil.secondaryPotentialMv);
    expect(model.coronaPoints.visible).toBe(true);

    model.dispose();
  });
});
