import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildTeslaCoilModel } from "./teslaCoilModel";
import { FrankenSimEngine } from "@/physics/engine";

const VISUALS_DIRECTORY = join(
  process.cwd(),
  "src",
  "components",
  "patents",
  "visuals",
);

describe("US 593,138 Nikola Tesla Electrical Transformer visual & resonant circuit boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "teslaCoilModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "TeslaCoil3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("useGLTF");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(threeSource).not.toContain("useGLTF");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "teslaCoilModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "TeslaCoil3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("performance.now()");
  });

  test("exposes authentic camera presets and UI overlay for high-voltage transformer inspection", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "TeslaCoil3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "toroid_breakout", "primary_spiral", "spark_gap", "top"]) {
      expect(threeSource).toContain(preset);
    }
  });

  test("computes genuine secondary potential and streamer length in SI units", () => {
    const result = FrankenSimEngine.stepTeslaCoil(150, 15, 12, 145, 0.18, 850);
    expect(result.secondaryPotentialMv).toBeGreaterThan(0.1);
    expect(result.streamerLengthMeters).toBeGreaterThan(0.1);
    expect(result.streamerLengthInches).toBeGreaterThan(3);
  });

  test("builds and articulates procedural mahogany table, primary spiral, secondary resonator, and toroidal topload correctly", () => {
    const model = buildTeslaCoilModel();
    expect(model.root.children.length).toBeGreaterThan(0);
    expect(model.tableBase).toBeDefined();
    expect(model.secondaryCylinder).toBeDefined();
    expect(model.spiralMesh).toBeDefined();
    expect(model.toroidMesh).toBeDefined();
    expect(model.sparkGapBase).toBeDefined();
    expect(model.coronaPoints).toBeDefined();
    expect(model.streamerLines.length).toBe(6);

    // Test kinematics update
    model.updateKinematics(1 / 60, true, 0.85, 0.45);
    expect(model.coronaPoints.visible).toBe(true);

    model.dispose();
  });
});
