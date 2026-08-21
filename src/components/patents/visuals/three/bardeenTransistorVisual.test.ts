import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  BARDEEN_REPORTED_SAMPLES,
  stepBardeenPointContact,
} from "@/physics/bardeenPointContactKernel";
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
    expect(modelSource).not.toContain("stepBardeenTransistor()");
    expect(modelSource).toContain("BARDEEN_CARRIER_WRAP_PAD");
  });

  test("exposes authentic camera presets and UI overlay for transistor inspection", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "BardeenTransistor3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "contacts", "layer", "base", "top"]) {
      expect(threeSource).toContain(preset);
    }
  });

  test("keeps the patent's three reported operating samples exact and qualified", () => {
    expect(BARDEEN_REPORTED_SAMPLES[1]).toMatchObject({
      inputResistanceOhms: 640,
      outputResistanceOhms: 30_000,
      inputVoltageVrms: 0.29,
      outputVoltageVrms: 18,
      inputPowerWatts: 1.3e-4,
      outputPowerWatts: 100e-4,
      voltageGainFactor: 62,
      powerGainFactor: 80,
      emitterBiasVolts: 0.2,
      collectorBiasVolts: -40,
      sourceStatedCurrentGain: 1.3,
    });
    expect(BARDEEN_REPORTED_SAMPLES[2]).toMatchObject({
      inputResistanceOhms: 500,
      outputResistanceOhms: 30_000,
      inputVoltageVrms: 0.3,
      outputVoltageVrms: 15,
      inputPowerWatts: 1.8e-4,
      outputPowerWatts: 75e-4,
      voltageGainFactor: 50,
      powerGainFactor: 42,
      emitterBiasVolts: 0.25,
      collectorBiasVolts: -20,
      sourceStatedCurrentGain: null,
    });
    expect(BARDEEN_REPORTED_SAMPLES[3]).toMatchObject({
      inputResistanceOhms: 1_000,
      outputResistanceOhms: 30_000,
      inputVoltageVrms: 0.1,
      outputVoltageVrms: 3.6,
      inputPowerWatts: 1.15e-5,
      outputPowerWatts: 42.5e-5,
      voltageGainFactor: 36,
      powerGainFactor: 36,
      emitterBiasVolts: 0.2,
      collectorBiasVolts: -10,
      sourceStatedCurrentGain: null,
    });

    const state = stepBardeenPointContact({
      operatingSample: 2,
      pointSpacingMils: 7.5,
      claim1Active: true,
    });
    expect(state.sample.number).toBe(2);
    expect(state.pointSpacingMils).toBe(7.5);
    expect(state.pointSpacingMicrometers).toBeCloseTo(190.5, 1);
    expect(state.fieldExampleVolts).toBe(10);
    expect(state.believedLayerBarrierThicknessCm).toBe(1e-4);
    expect(state.fieldOrderVoltsPerCm).toBe(1e5);
    expect(state.fieldEstimateQualified).toBe(true);
    expect(state.kernelSource).toBe("source-bounded-ts");
  });

  test("builds the patent's block, plated base, surface layer, barrier, and point contacts", () => {
    const model = buildBardeenTransistorModel();
    expect(model.rootGroup.children.length).toBeGreaterThan(0);
    expect(model.nodes.baseFilm).toBeDefined();
    expect(model.nodes.geBlock).toBeDefined();
    expect(model.nodes.surfaceLayer).toBeDefined();
    expect(model.nodes.barrierLayer).toBeDefined();
    expect(model.nodes.emitterContact).toBeDefined();
    expect(model.nodes.collectorContact).toBeDefined();
    expect(model.nodes.carrierPoints).toBeDefined();

    const step = stepBardeenPointContact({ pointSpacingMils: 2, claim1Active: true });
    updateBardeenTransistorKinematics(
      model.nodes,
      model.materials,
      1 / 60,
      1.0,
      step.gapStudioUnits,
      step.carrierDisplaySpeed,
      true,
      false,
    );
    expect(model.nodes.carrierPoints.visible).toBe(true);
    expect(model.nodes.collectorGroup.visible).toBe(true);

    updateBardeenTransistorKinematics(
      model.nodes,
      model.materials,
      1 / 60,
      2.0,
      step.gapStudioUnits,
      0,
      false,
      false,
    );
    expect(model.nodes.carrierPoints.visible).toBe(false);
    expect(model.nodes.collectorGroup.visible).toBe(false);

    model.dispose();
  });

  test("excludes the later prototype fixture and synthetic transport claims", () => {
    const sources = [
      readFileSync(join(VISUALS_DIRECTORY, "BardeenTransistorSim.tsx"), "utf8"),
      readFileSync(join(VISUALS_DIRECTORY, "three", "BardeenTransistor3D.tsx"), "utf8"),
      readFileSync(join(VISUALS_DIRECTORY, "three", "bardeenTransistorModel.ts"), "utf8"),
    ]
      .join("\n")
      .toLowerCase();

    for (const unsupported of [
      "polystyrene",
      "razor slit",
      "micrometer screw",
      "50 µm",
      "us 2,569,347",
      "us 2,524,191",
      "carriercurrentma",
      "currentgainalpha",
      "transittime",
      "holelifetime",
    ]) {
      expect(sources).not.toContain(unsupported);
    }
  });
});
