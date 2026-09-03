import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
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
    expect(threeSource).toContain('data-testid="bardeen-source-boundary"');
    expect(threeSource).toContain("quantitative transport and a closed energy balance are refused");
    expect(threeSource).toContain("isRefused: true");
    expect(threeSource).not.toContain("PortHamiltonianEnergyStrip");
    expect(modelSource).not.toContain("Adjustment Bridge");
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

  test("keeps both point contacts seated on layer 3 and connects them into the Fig. 1 circuit", () => {
    const model = buildBardeenTransistorModel();
    try {
      const step = stepBardeenPointContact({ pointSpacingMils: 10, claim1Active: true });
      updateBardeenTransistorKinematics(
        model.nodes,
        model.materials,
        1 / 60,
        1,
        step.gapStudioUnits,
        step.carrierDisplaySpeed,
        true,
        false,
      );
      model.rootGroup.updateMatrixWorld(true);

      const layerTop = new THREE.Box3().setFromObject(model.nodes.surfaceLayer).max.y;
      const contactEndpoints = (contact: THREE.Mesh) => [
        new THREE.Vector3(0, -0.5, 0).applyMatrix4(contact.matrixWorld),
        new THREE.Vector3(0, 0.5, 0).applyMatrix4(contact.matrixWorld),
      ];
      const emitterEnds = contactEndpoints(model.nodes.emitterContact).sort((a, b) => a.y - b.y);
      const collectorEnds = contactEndpoints(model.nodes.collectorContact).sort(
        (a, b) => a.y - b.y,
      );
      expect(emitterEnds[0].y).toBeCloseTo(layerTop, 8);
      expect(collectorEnds[0].y).toBeCloseTo(layerTop, 8);
      expect(emitterEnds[0].x).toBeCloseTo(-step.gapStudioUnits / 2, 8);
      expect(collectorEnds[0].x).toBeCloseTo(step.gapStudioUnits / 2, 8);

      expect(model.nodes.inputTransformer.name).toBe("Input transformer 10");
      expect(model.nodes.outputTransformer.name).toBe("Output transformer 9");
      expect(model.nodes.emitterBattery.name).toBe("Emitter battery 7");
      expect(model.nodes.collectorBattery.name).toBe("Collector battery 8");
      expect(model.nodes.circuitConductors.map((wire) => wire.name)).toEqual([
        "Input boundary to transformer 10",
        "Transformer 10 through emitter battery 7",
        "Collector 6 through battery 8 to transformer 9",
        "Output transformer 9 to external boundary",
        "Plated-base return to transformer 10",
        "Plated-base return to transformer 9",
      ]);

      const emitterLead = model.nodes.circuitConductors[1];
      const collectorLead = model.nodes.circuitConductors[2];
      const emitterLeadEnd = (emitterLead.geometry as THREE.TubeGeometry).parameters.path.getPoint(
        1,
      );
      const collectorLeadStart = (
        collectorLead.geometry as THREE.TubeGeometry
      ).parameters.path.getPoint(0);
      expect(emitterEnds[1].distanceTo(emitterLeadEnd)).toBeLessThan(1e-8);
      expect(collectorEnds[1].distanceTo(collectorLeadStart)).toBeLessThan(1e-8);

      const foundation = model.rootGroup.getObjectByName("Bardeen Fig. 1 apparatus foundation");
      expect(foundation).toBeDefined();
      if (!foundation) throw new Error("Bardeen apparatus foundation is missing.");
      const foundationTop = new THREE.Box3().setFromObject(foundation).max.y;
      expect(new THREE.Box3().setFromObject(model.nodes.emitterBattery).min.y).toBeCloseTo(
        foundationTop,
        7,
      );
      expect(new THREE.Box3().setFromObject(model.nodes.collectorBattery).min.y).toBeCloseTo(
        foundationTop,
        7,
      );
    } finally {
      model.dispose();
    }
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

  test("keeps registry telemetry on reported samples and refuses a synthetic energy balance", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-2524035-bardeen-transistor"];
    expect(entry.engineMethod).toContain("quantitative carrier transport refused");
    expect(entry.controls.map((control: { id: string }) => control.id)).toEqual([
      "operatingSample",
      "pointSpacingMils",
      "claim1Active",
    ]);
    const metrics = entry.computeMetrics({
      operatingSample: 2,
      pointSpacingMils: 7.5,
      claim1Active: 1,
    });
    expect(
      metrics.map((metric: { label: string; value: string }) => [metric.label, metric.value]),
    ).toEqual([
      ["Reported Voltage Gain", "50"],
      ["Reported Power Gain", "42"],
      ["Selected Contact Gap", "190.5"],
      ["Claim 1 Contact Path", "complete"],
    ]);
    for (const metric of metrics) expect(metric.provenance).not.toBe("scenario-modern");

    const {
      ENERGY_CHANNEL_OMISSION_REASONS,
      energyChannelsFor,
    } = require("@/physics/energyChannels");
    expect(energyChannelsFor("us-2524035-bardeen-transistor", {})).toEqual([]);
    expect(ENERGY_CHANNEL_OMISSION_REASONS["us-2524035-bardeen-transistor"]).toContain(
      "signal power gain alone is not a complete SI power-flow partition",
    );
  });
});
