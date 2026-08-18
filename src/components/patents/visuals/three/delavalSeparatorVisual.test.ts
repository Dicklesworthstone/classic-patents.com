import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepDeLavalSeparator } from "@/physics/catalogKernels";
import { buildDeLavalSeparatorModel } from "./delavalSeparatorModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 247,804 Gustaf de Laval Centrifugal Cream Separator visual & fluid dynamics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "DeLavalSeparator3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "delavalSeparatorModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildDeLavalSeparatorModel");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "DeLavalSeparator3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "delavalSeparatorModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and UI overlay for centrifugal observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "DeLavalSeparator3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "centrifuge_bowl",
      "conical_discs",
      "outlet_spouts",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("De Laval Separator 3D");
  });

  test("computes genuine centrifugal acceleration and fat yield percentage in SI units", () => {
    const result = stepDeLavalSeparator({ bowlRpm: 6500, rawMilkFlowLph: 300 });
    expect(result.gForce).toBeGreaterThan(3000);
    expect(result.fatYieldPct).toBeGreaterThan(95);
    expect(result.creamFlowLph).toBeGreaterThan(20);
    expect(result.skimFlowLph).toBeGreaterThan(250);
  });

  test("builds and articulates procedural centrifuge bowl, spindle, and collecting pans correctly", () => {
    const { rootGroup, bowlGroup, spindleGroup, materials, dispose } = buildDeLavalSeparatorModel();
    expect(rootGroup.children.length).toBeGreaterThan(3);
    expect(bowlGroup).toBeDefined();
    expect(spindleGroup).toBeDefined();

    expect(materials.polishedSteel.metalness).toBeGreaterThan(0.9);
    expect(materials.tinnedBrass.roughness).toBeLessThan(0.3);

    dispose();
  });
});
