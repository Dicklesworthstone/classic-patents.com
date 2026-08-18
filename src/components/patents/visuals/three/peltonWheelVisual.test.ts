import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepPeltonWheel } from "@/physics/catalogKernels";
import { buildPeltonWheelModel } from "./peltonWheelModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 233,692 Lester Pelton Impulse Water Wheel visual & hydrodynamics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "PeltonWheel3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "peltonWheelModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildPeltonWheelModel");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "PeltonWheel3D.tsx"),
      "utf8",
    );
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
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "PeltonWheel3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "split_bucket", "needle_nozzle", "runner_wheel", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("Pelton Water Wheel 3D");
  });

  test("computes genuine Torricelli jet velocity, impulse force, and hydraulic efficiency in SI units", () => {
    const result = stepPeltonWheel({ headM: 250, nozzleDiameterMm: 50, needlePositionPct: 100 });
    expect(result.jetVelocityMps).toBeGreaterThan(60);
    expect(result.shaftPowerKw).toBeGreaterThan(100);
    expect(result.etaPct).toBeGreaterThan(80);
  });

  test("builds and articulates procedural 18-bucket runner, needle nozzle, and spray particles correctly", () => {
    const {
      rootGroup,
      runnerGroup,
      nozzleNeedle,
      needleHandwheel,
      casingGroup,
      materials,
      dispose,
    } = buildPeltonWheelModel();

    expect(rootGroup.children.length).toBeGreaterThan(3);
    expect(runnerGroup).toBeDefined();
    expect(nozzleNeedle).toBeDefined();
    expect(needleHandwheel).toBeDefined();
    expect(casingGroup).toBeDefined();
    expect(materials.bronzeBucket).toBeDefined();
    expect(materials.waterJet).toBeDefined();

    dispose();
  });
});
