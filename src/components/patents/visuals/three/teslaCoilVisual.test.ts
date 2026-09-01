import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  stepTeslaTransformerSi,
  TESLA_SOURCE_FREQUENCY_HZ,
  teslaTransformerSecondaryPath,
  teslaTransformerSecondaryTerminals,
} from "@/physics/teslaTransformerKernel";
import { decodeTeslaTransformerWasmStep } from "@/physics/teslaWasm";
import { buildTeslaCoilModel } from "./tesla593138TransformerModel";
import { buildTeslaCoilModel as buildTeslaCoilModelFromCompatibilityPath } from "./teslaCoilModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 593,138 Nikola Tesla High-Frequency Electrical Transformer visual & resonance boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "TeslaCoil3D.tsx"), "utf8");
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "tesla593138TransformerModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildTeslaCoilModel");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "TeslaCoil3D.tsx"), "utf8");
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "tesla593138TransformerModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and UI overlay for resonant coil observation", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "TeslaCoil3D.tsx"), "utf8");

    for (const preset of ["iso", "high_terminal", "primary_spiral", "earth_bond", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("Transformer Telemetry");
    expect(threeSource).toContain("controls.setView");
    expect(threeSource).not.toContain("cameraRef");
  });

  test("reproduces Tesla's printed 925 Hz, 200-mile wavelength, 50-mile quarter-wave example", () => {
    const result = stepTeslaTransformerSi({
      disturbanceFrequencyHz: TESLA_SOURCE_FREQUENCY_HZ,
      secondaryLengthMiles: 50,
    });
    expect(result.wavelengthMiles).toBeCloseTo(200, 12);
    expect(result.quarterWaveLengthMiles).toBeCloseTo(50, 12);
    expect(result.electricalLengthDeg).toBeCloseTo(90, 12);
    expect(result.lengthErrorMiles).toBeCloseTo(0, 12);
    expect(result.remoteTerminalProfileFraction).toBeCloseTo(1, 12);
    expect(result.absolutePotentialKnown).toBe(false);
    expect(result.dischargeLengthKnown).toBe(false);
  });

  test("rejects contradictory owner envelopes and invalid schematic topology requests", () => {
    const valid = {
      wavelength_m: 321868.8,
      quarter_wave_length_m: 80467.2,
      electrical_length_rad: Math.PI / 2,
      quarter_wave_error_rad: 0,
      length_error_m: 0,
      length_ratio: 1,
      remote_terminal_profile_fraction: 1,
    };
    expect(
      decodeTeslaTransformerWasmStep(
        JSON.stringify({ ok: valid, refusal: { code: "contradictory-envelope" } }),
      ),
    ).toBeNull();
    expect(() => teslaTransformerSecondaryPath(0)).toThrow(RangeError);
    expect(() => teslaTransformerSecondaryPath(2.5)).toThrow(RangeError);
    expect(() =>
      stepTeslaTransformerSi({ disturbanceFrequencyHz: Number.NaN, secondaryLengthMiles: 50 }),
    ).toThrow(RangeError);
    expect(() =>
      stepTeslaTransformerSi({ disturbanceFrequencyHz: 925, secondaryLengthMiles: 0 }),
    ).toThrow(RangeError);
    expect(
      decodeTeslaTransformerWasmStep(JSON.stringify({ ok: valid }), {
        frequencyHz: 1_000_000_001,
        propagationSpeedMps: 185_000 * 1609.344,
        conductorLengthM: 50 * 1609.344,
      }),
    ).toBeNull();
  });

  test("builds the connected Fig. 2 conical secondary, surrounding primary, earth bond, and remote terminal", () => {
    const model = buildTeslaCoilModel();
    expect(model.root.children.length).toBeGreaterThan(0);
    expect(model.tableBase).toBeDefined();
    expect(model.secondaryCylinder).toBeDefined();
    expect(model.spiralMesh).toBeDefined();
    expect(model.highTerminalMesh).toBeDefined();
    expect(model.terminalBoard).toBeDefined();
    expect(model.potentialMarkers).toHaveLength(9);
    expect(model.potentialMarkers.every((marker) => !marker.visible)).toBe(true);

    for (const connection of model.connectivityReceipt()) {
      expect(connection.gapMeters).toBeLessThanOrEqual(1e-8);
    }

    const transformer = stepTeslaTransformerSi({
      disturbanceFrequencyHz: TESLA_SOURCE_FREQUENCY_HZ,
      secondaryLengthMiles: 50,
    });
    model.updateElectricalProfile(transformer.electricalLengthRad);
    model.setProfileMarkersVisible(true);
    expect(model.potentialMarkers.every((marker) => marker.visible)).toBe(true);
    expect(model.potentialMarkers[0].scale.x).toBeCloseTo(0.7, 8);
    expect(model.potentialMarkers[8].scale.x).toBeCloseTo(1.35, 8);

    model.setClaimedCommonNodeConnected(false);
    expect(
      model.root.getObjectByName("Secondary low terminal to claimed common node")?.visible,
    ).toBe(false);
    expect(model.root.getObjectByName("Claim 1 open secondary-bond marker")?.visible).toBe(true);
    model.setClaimedCommonNodeConnected(true);
    expect(
      model.root.getObjectByName("Secondary low terminal to claimed common node")?.visible,
    ).toBe(true);

    model.dispose();
  });

  test("the former model import path resolves to the same connected source-bounded apparatus", () => {
    const model = buildTeslaCoilModelFromCompatibilityPath();
    expect("toroidMesh" in model).toBe(false);
    expect("streamerLines" in model).toBe(false);
    for (const connection of model.connectivityReceipt()) {
      expect(connection.gapMeters).toBeLessThanOrEqual(1e-8);
    }
    model.dispose();
  });

  test("renders one connected secondary conductor in both 2D faces without a fake discharge", () => {
    const path = teslaTransformerSecondaryPath();
    const terminals = teslaTransformerSecondaryTerminals();
    expect(path.startsWith("M ")).toBe(true);
    expect(path.match(/ M /g)).toBeNull();
    expect(path.match(/ L /g)?.length).toBe(24);
    expect(path.startsWith(`M ${terminals.low.x} ${terminals.low.y}`)).toBe(true);
    expect(path.endsWith(`L ${terminals.high.x} ${terminals.high.y}`)).toBe(true);

    const simSource = readFileSync(join(VISUALS_DIRECTORY, "TeslaCoilSim.tsx"), "utf8");
    const schematicSource = readFileSync(
      join(process.cwd(), "src/components/patents/InteractiveDiagramViewer.tsx"),
      "utf8",
    );
    expect(simSource).toContain("teslaTransformerSecondaryPath()");
    expect(schematicSource).toContain("teslaTransformerSecondaryPath()");
    expect(simSource).toContain("teslaTransformerSecondaryTerminals()");
    expect(schematicSource).toContain("teslaTransformerSecondaryTerminals()");
    expect(simSource).toContain('updateParam("claim1CommonNodeConnected"');
    expect(simSource).toContain("CLAIM 1 COMMON NODE OPEN — PROFILE REFUSED");
    expect(simSource).not.toContain("streamer");
    expect(schematicSource).not.toContain("schematicSparkX0");
  });
});
