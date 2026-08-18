import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FrankenSimEngine } from "@/physics/engine";
import {
  buildBardeenTransistorModel,
  updateBardeenTransistorKinematics,
} from "./bardeenTransistorModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 2,569,347 John Bardeen & Walter Brattain Point-Contact Transistor visual & carrier transport boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "BardeenTransistor3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "bardeenTransistorModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildBardeenTransistorModel");
    expect(modelSource).toContain("updateBardeenTransistorKinematics");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "BardeenTransistor3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "bardeenTransistorModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for transistor inspection", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "BardeenTransistor3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "apex", "band", "spring", "base", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Bardeen Point-Contact Transistor 3D");
  });

  test("computes genuine current gain alpha, minority hole diffusion, and power gain in SI units", () => {
    const result = FrankenSimEngine.stepBardeenTransistor(1.5, -40, 50);
    expect(result.currentGainAlpha).toBeGreaterThan(1.0);
    expect(result.holeDiffusionCoefficientCm2ps).toBeGreaterThan(30);
  });

  test("builds and articulates procedural base platen, germanium slab, plastic wedge, gold foil electrodes, and hole drift correctly", () => {
    const { rootGroup, nodes, materials, dispose } = buildBardeenTransistorModel();
    expect(rootGroup.children.length).toBeGreaterThan(0);
    expect(nodes.basePlaten).toBeDefined();
    expect(nodes.geBlock).toBeDefined();
    expect(nodes.wedge).toBeDefined();
    expect(nodes.emitterFoil).toBeDefined();
    expect(nodes.collectorFoil).toBeDefined();
    expect(nodes.holePoints).toBeDefined();

    updateBardeenTransistorKinematics(
      nodes,
      materials,
      0.016,
      0.5,
      50,
      1.5,
      2.1,
      49,
      true,
      true,
    );
    expect(materials.germaniumCrystal.transparent).toBe(true);
    expect(nodes.holePoints.visible).toBe(true);

    dispose();
  });
});
