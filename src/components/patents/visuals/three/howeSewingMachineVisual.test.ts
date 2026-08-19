import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepHoweSewingMachine } from "@/physics/machineKernels";
import { buildHoweSewingMachineModel } from "./howeSewingMachineModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 4,750 Elias Howe Sewing Machine visual & kinematics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "HoweSewingMachine3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "howeSewingMachineModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildHoweSewingMachineModel");
    expect(threeSource).toContain("needleStudioRotZ");
    expect(threeSource).not.toContain("/ 45");
    expect(threeSource).not.toContain("/ 90");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "HoweSewingMachine3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "howeSewingMachineModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and UI overlay for lockstitch observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "HoweSewingMachine3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "needle", "shuttle", "flywheel", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("US 4,750");
  });

  test("computes genuine lockstitch stitching frequency and cloth feed rate in SI units", () => {
    const result = stepHoweSewingMachine(240, 45, 3.5);
    expect(result.stitchFrequencyHz).toBe(4.0);
    expect(result.clothFeedMmPerS).toBe(14.0);
    expect(result.crankOmegaRadPerS).toBeCloseTo(8 * Math.PI, 2);
    expect(result.clothStudioAdvancePerS).toBeCloseTo(1.4, 3);
    expect(result.crankDisplayTickS).toBeCloseTo(0.03, 5);
  });

  test("builds and articulates procedural eye-pointed needle, shuttle, and baster plate correctly", () => {
    const { rootGroup, curvedNeedle, shuttleMesh, clothMesh, materials, dispose } =
      buildHoweSewingMachineModel();
    expect(rootGroup.children.length).toBeGreaterThan(4);
    expect(curvedNeedle).toBeDefined();
    expect(shuttleMesh).toBeDefined();
    expect(clothMesh).toBeDefined();

    expect(materials.castIron.metalness).toBeGreaterThan(0.7);
    expect(materials.polishedSteel.roughness).toBeLessThan(0.2);

    dispose();
  });
});
