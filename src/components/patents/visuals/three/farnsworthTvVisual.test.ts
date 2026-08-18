import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FrankenSimEngine } from "@/physics/engine";
import { buildFarnsworthTvModel } from "./farnsworthTvModel";

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

    for (const preset of ["iso", "photocathode", "aperture", "coils", "top"]) {
      expect(threeSource).toContain(preset);
    }
  });

  test("computes genuine electron velocity, relativistic beta, and photocathode current in SI units", () => {
    const deflectionGauss = FrankenSimEngine.farnsworthDeflectionGauss(0.42);
    const result = FrankenSimEngine.stepFarnsworthTv(1.5, deflectionGauss, 500);
    expect(result.electronVelocityMps).toBeGreaterThan(1e7);
    expect(result.relativisticBeta).toBeGreaterThan(0.05);
    expect(result.photocathodeCurrentUa).toBeGreaterThan(0);
    expect(result.gyroRadiusMm).toBeGreaterThan(0);
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

    // Test kinematics update
    model.updateKinematics(1 / 60, 60, 2.3e7, 15.75, 60, true);
    expect(model.beamPoints.visible).toBe(true);

    model.dispose();
  });
});
