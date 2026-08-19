import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepBardeenTransistor } from "@/physics/catalogKernels";
import { FrankenSimEngine } from "@/physics/engine";
import {
  buildBardeenTransistorModel,
  updateBardeenTransistorKinematics,
} from "./bardeenTransistorModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals");

describe("US 2,524,035 John Bardeen & Walter Brattain Point-Contact Transistor visual & minority transport boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "bardeenTransistorModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "BardeenTransistor3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("useGLTF");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(threeSource).not.toContain("useGLTF");
    expect(threeSource).toContain('usePatentPhysics("us-2524035-bardeen-transistor")');
    expect(threeSource).not.toContain("us-2569347-bardeen-transistor");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "bardeenTransistorModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "BardeenTransistor3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("performance.now()");
  });

  test("exposes authentic camera presets and UI overlay for transistor inspection", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "BardeenTransistor3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "apex", "band", "spring", "base", "top"]) {
      expect(threeSource).toContain(preset);
    }
  });

  test("computes genuine alpha current gain, collector current, and minority carrier transport in SI units", () => {
    const result = stepBardeenTransistor(1.5, -40, 50);
    expect(result.collectorCurrentMa).toBeGreaterThan(0);

    const semiState = FrankenSimEngine.stepBardeenTransistor(1.5, -40, 50);
    expect(semiState.currentGainAlpha).toBeGreaterThan(0.5);
    expect(semiState.holeDiffusionCoefficientCm2ps).toBeGreaterThan(0);
    expect(semiState.holeDriftSpeed).toBeGreaterThan(0);
    expect(semiState.gapStudioUnits).toBeCloseTo(0.6, 3);
    expect(semiState.pointGapSvgPx).toBeCloseTo(40, 2);
  });

  test("builds and articulates procedural copper platen, germanium crystal, polystyrene wedge, gold foil ribbons, and minority hole drift correctly", () => {
    const model = buildBardeenTransistorModel();
    expect(model.rootGroup.children.length).toBeGreaterThan(0);
    expect(model.nodes.basePlaten).toBeDefined();
    expect(model.nodes.geBlock).toBeDefined();
    expect(model.nodes.wedge).toBeDefined();
    expect(model.nodes.emitterFoil).toBeDefined();
    expect(model.nodes.collectorFoil).toBeDefined();
    expect(model.nodes.holePoints).toBeDefined();

    // Test kinematics update
    const step = FrankenSimEngine.stepBardeenTransistor(1.5, -40, 50);
    updateBardeenTransistorKinematics(
      model.nodes,
      model.materials,
      1 / 60,
      1.0,
      step.gapStudioUnits ?? 0.6,
      step.holeDriftSpeed ?? 0,
      true,
      false,
    );
    expect(model.nodes.holePoints.visible).toBe(true);

    model.dispose();
  });
});
