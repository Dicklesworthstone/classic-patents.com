import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepPeltonWheel } from "@/physics/catalogKernels";
import { buildPeltonWheelModel, updatePeltonWheelKinematics } from "./peltonWheelModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 233,692 Lester Pelton Impulse Water Wheel visual & hydrodynamics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "PeltonWheel3D.tsx"), "utf8");
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "peltonWheelModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildPeltonWheelModel");
    expect(modelSource).toContain("updatePeltonWheelKinematics");
    expect(modelSource).toContain("jetDisplaySpeed");
    expect(modelSource).toContain("fluidFrames");
    expect(modelSource).toContain("sampleFluidAt");
    expect(modelSource).not.toContain("/ 90");
    expect(modelSource).not.toContain("stepPeltonWheel({})");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "PeltonWheel3D.tsx"), "utf8");
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "peltonWheelModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and UI overlay for impulse turbine observation", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "PeltonWheel3D.tsx"), "utf8");

    for (const preset of [
      "iso",
      "split_bucket",
      "needle_nozzle",
      "runner_wheel",
      "tailrace",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Pelton Water Wheel 3D");
    expect(threeSource).toContain("controls.setView");
    expect(threeSource).not.toContain("cameraRef");
  });

  test("computes genuine Torricelli jet velocity, impulse force, and hydraulic efficiency in SI units", () => {
    const result = stepPeltonWheel({ headMeters: 450, runnerRpm: 600 });
    expect(result.jetVelocityMps).toBeGreaterThan(90);
    expect(result.shaftPowerKw).toBeGreaterThan(150);
    expect(result.etaPct).toBeGreaterThan(85);
    expect(result.jetDisplaySpeed).toBeCloseTo((result.jetVelocityMps / 90) * 12, 2);
    expect(result.sprayDisplaySpeed).toBe(8);
    expect(result.jetYOverX).toBe(0.7);
    expect(result.jetResetX).toBe(-3.2);
    expect(result.sprayFloorY).toBe(-3.8);
  });

  test("builds and articulates procedural 18-bucket runner, needle nozzle, and spray particles correctly", () => {
    const model = buildPeltonWheelModel();

    expect(model.rootGroup.children.length).toBeGreaterThan(3);
    expect(model.runnerGroup).toBeDefined();
    expect(model.nozzleNeedle).toBeDefined();
    expect(model.needleHandwheel).toBeDefined();
    expect(model.casingGroup).toBeDefined();
    expect(model.materials.bronzeBucket).toBeDefined();
    expect(model.materials.waterJet).toBeDefined();

    const pelton = stepPeltonWheel({ headMeters: 450, runnerRpm: 600 });
    updatePeltonWheelKinematics(
      model,
      0.016,
      pelton.runnerOmegaRadPerS,
      pelton.jetDisplaySpeed,
      pelton.sprayDisplaySpeed,
      pelton.pressureNeedleRad,
      pelton.needleStudioX,
      pelton.needleStudioY,
      pelton.handwheelOmegaRadPerS,
      true,
      true,
    );
    expect(model.materials.castIron.opacity).toBe(0.35);
    expect(model.jetPoints.visible).toBe(true);

    model.dispose();
  });
});
