import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FrankenSimEngine } from "@/physics/engine";
import { buildMarconiRadioModel, updateMarconiRadioKinematics } from "./marconiRadioModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 586,193 Guglielmo Marconi Wireless Radio Telegraphy visual & electromagnetics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "MarconiRadio3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "marconiRadioModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildMarconiRadioModel");
    expect(modelSource).toContain("updateMarconiRadioKinematics");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "MarconiRadio3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "marconiRadioModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for wireless transmitter observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "MarconiRadio3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "spark_gap",
      "induction_coil",
      "aerial_monopole",
      "morse_key",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Marconi Wireless Radio 3D");
    expect(threeSource).toContain("controls.setView");
    expect(threeSource).not.toContain("camera.position.set");
  });

  test("computes genuine quarter-wave monopole RF resonant frequency and radiation resistance in SI units", () => {
    const result = FrankenSimEngine.stepMarconiRadio(88, 10, 28);
    expect(result.wavelengthMeters).toBeGreaterThan(300);
    expect(result.resonantFreqMhz).toBeGreaterThan(0.5);
    expect(result.radiationResistanceOhms).toBeGreaterThan(30);
    expect(result.peakRfPowerKw).toBeGreaterThan(1);
    expect(result.maxRangeMiles).toBeGreaterThan(10);
    expect(result.waveOpacityBase).toBeCloseTo(0.35 + (result.peakRfPowerKw / 80) * 0.5, 2);
    expect(result.mastStudioScale).toBeCloseTo(1, 3);
    expect(result.waveAdvancePx).toBeCloseTo(result.wavePhaseRate * 4, 2);
    expect(result.toneEnergy).toBeCloseTo(Math.min(1, result.peakRfPowerKw / 80), 3);
    expect(result.mastSvgY).toBeCloseTo(210 - 88 * 1.6, 2);
    expect(result.fundamentalHz).toBeCloseTo(result.resonantFreqMhz * 1e6, 0);
  });

  test("builds and articulates procedural mast, 4-sphere spark gap, Morse key, and wavefront rings correctly", () => {
    const { rootGroup, nodes, materials, dispose } = buildMarconiRadioModel();
    expect(rootGroup.children.length).toBeGreaterThan(2);
    expect(nodes.sparkBalls.length).toBe(4);
    expect(nodes.waveRings.length).toBe(5);
    expect(nodes.mast).toBeDefined();
    expect(nodes.sparkArc).toBeDefined();

    const radio = FrankenSimEngine.stepMarconiRadio(88, 10, 28);
    updateMarconiRadioKinematics(
      nodes,
      materials,
      0.016,
      0.5,
      88,
      radio.resonantFreqMhz,
      radio.waveOpacityBase,
      radio.wavePhaseRate,
      radio.mastStudioScale,
      true,
      true,
      true,
    );
    expect(materials.mahoganyBase.transparent).toBe(true);

    dispose();
  });
});
