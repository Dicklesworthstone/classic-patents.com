import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FrankenSimEngine } from "@/physics/engine";
import { buildFarnsworthTvModel, updateFarnsworthTvKinematics } from "./farnsworthTvModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals");

describe("US 1,773,980 Philo T. Farnsworth Television System visual & electron optics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "farnsworthTvModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "FarnsworthTV3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("useGLTF");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(modelSource).toContain("buildFarnsworthTvModel");
    expect(modelSource).toContain("updateFarnsworthTvKinematics");
    expect(modelSource).toContain("electronDisplaySpeed");
    expect(modelSource).not.toContain("20000000");
    expect(threeSource).not.toContain("useGLTF");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "farnsworthTvModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "FarnsworthTV3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("performance.now()");
  });

  test("exposes authentic camera presets and UI overlay for dissector tube inspection", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "FarnsworthTV3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "photocathode", "aperture", "coils", "electron_gun", "top"]) {
      expect(threeSource).toContain(preset);
    }
    expect(threeSource).toContain("isCutaway");
  });

  test("computes genuine electron velocity, relativistic beta, and photocathode current in SI units", () => {
    const deflectionGauss = FrankenSimEngine.farnsworthDeflectionGauss(0.42);
    const result = FrankenSimEngine.stepFarnsworthTv(1.5, deflectionGauss, 500);
    expect(result.electronVelocityMps).toBeGreaterThan(1e7);
    expect(result.relativisticBeta).toBeGreaterThan(0.05);
    expect(result.photocathodeCurrentUa).toBeGreaterThan(0);
    expect(result.gyroRadiusMm).toBeGreaterThan(0);
    expect(result.electronDisplaySpeed).toBeCloseTo((result.electronVelocityMps / 2e7) * 45, 1);
    expect(result.electronVelocityMegaMps).toBeCloseTo(result.electronVelocityMps / 1e6, 1);
    expect(result.relativisticPct).toBeCloseTo(result.relativisticBeta * 100, 1);
    expect(result.acceleratingVoltageVolts).toBe(1500);
  });

  test("builds and articulates procedural mahogany bench, borosilicate dissector envelope, photocathode disc, and anode aperture correctly", () => {
    const model = buildFarnsworthTvModel();
    expect(model.root.children.length).toBeGreaterThan(0);
    expect(model.tubeGroup).toBeDefined();
    expect(model.photocathode).toBeDefined();
    expect(model.lensBarrel).toBeDefined();
    expect(model.anodeFinger).toBeDefined();
    expect(model.apertureTip).toBeDefined();
    expect(model.focusCoil).toBeDefined();
    expect(model.beamPoints).toBeDefined();

    // Test kinematics update & cutaway mode
    const beam = FrankenSimEngine.stepFarnsworthTv(1.5, 120, 500);
    updateFarnsworthTvKinematics(
      model,
      1 / 60,
      60,
      beam.electronDisplaySpeed,
      15.75,
      60,
      true,
      true,
    );
    expect(model.beamPoints.visible).toBe(true);
    expect(model.materials.focusCoilMat.opacity).toBe(0.35);

    model.dispose();
  });
});
