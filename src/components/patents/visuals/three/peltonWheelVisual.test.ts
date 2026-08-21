import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
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
      "nozzle",
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

  test("does not invent operating values absent from the three-sheet grant", () => {
    const source = readFileSync(join(VISUALS_DIRECTORY, "three", "peltonWheelModel.ts"), "utf8");
    expect(source).not.toContain("165°");
    expect(source).not.toContain("needle spear");
    expect(source).not.toContain("pressure gauge");
    expect(source).not.toContain("bucketCount = 18");
  });

  test("builds and articulates the source bucket, nozzle, and spray particles correctly", () => {
    const model = buildPeltonWheelModel();

    expect(model.rootGroup.children.length).toBeGreaterThan(3);
    expect(model.runnerGroup).toBeDefined();
    expect(model.casingGroup).toBeDefined();
    expect(model.materials.bronzeBucket).toBeDefined();
    expect(model.materials.waterJet).toBeDefined();

    updatePeltonWheelKinematics(
      model,
      0.016,
      0,
      0.1,
      0.1,
      true,
      true,
    );
    expect(model.materials.castIron.opacity).toBe(0.35);
    expect(model.jetPoints.visible).toBe(true);

    model.dispose();
  });
});
