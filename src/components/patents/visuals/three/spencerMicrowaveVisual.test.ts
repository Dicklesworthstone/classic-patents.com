import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FrankenSimEngine } from "@/physics/engine";
import {
  buildSpencerMicrowaveModel,
  updateSpencerMicrowaveKinematics,
} from "./spencerMicrowaveModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals");

describe("US 2,495,429 Percy Spencer Microwave Cavity Magnetron visual & RF physics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "spencerMicrowaveModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "SpencerMicrowave3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("useGLTF");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(modelSource).toContain("buildSpencerMicrowaveModel");
    expect(modelSource).toContain("updateSpencerMicrowaveKinematics");
    expect(threeSource).not.toContain("useGLTF");
    expect(modelSource).not.toContain("delta * 4.5");
    expect(modelSource).toContain("spokeDisplayOmegaRadPerS");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "spencerMicrowaveModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "SpencerMicrowave3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("performance.now()");
  });

  test("exposes authentic camera presets and UI overlay for microwave magnetron inspection", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "SpencerMicrowave3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "cavity_resonator",
      "electron_spokes",
      "waveguide_launch",
      "strapping_rings",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }
    expect(threeSource).toContain("isCutaway");
  });

  test("computes genuine Hull cutoff condition, microwave frequency, and dielectric loss in SI units", () => {
    const result = FrankenSimEngine.stepSpencerMicrowave(2.2, 1450, 800);
    expect(result.hullCutoffGauss).toBeGreaterThan(500);
    expect(result.isOscillating).toBe(true);
    expect(result.microwaveFreqMhz).toBeGreaterThan(2000);
    expect(result.dielectricLossWattsPerDm3).toBeGreaterThan(100);
    expect(result.anodeKv).toBe(2.2);
    expect(result.microwaveFreqHz).toBe(2450e6);
    expect(result.electricFieldVpm).toBeCloseTo(220000, 0);
  });

  test("builds and articulates procedural copper anode block, resonant cavities, cathode rod, and electron spokes correctly", () => {
    const model = buildSpencerMicrowaveModel();
    expect(model.root.children.length).toBeGreaterThan(0);
    expect(model.magnetronGroup).toBeDefined();
    expect(model.anodeOuter).toBeDefined();
    expect(model.cathodeMesh).toBeDefined();
    expect(model.spokePoints).toBeDefined();

    // Test kinematics update & cutaway
    updateSpencerMicrowaveKinematics(model, 1 / 60, true, 4.5, 0.547, true, true);
    expect(model.spokePoints.visible).toBe(true);
    expect(model.spokePoints.rotation.y).toBeGreaterThan(0);
    expect(model.materials.copperAnodeMat.opacity).toBe(0.35);

    model.dispose();
  });

  test("derives all 6 printed claims dynamically from edition without duplicate strings", () => {
    const { spencerMicrowavePatent } = require("@/data/patents/spencer-microwave");
    const { spencerMicrowaveArchivalEdition } = require("@/data/editions/spencerMicrowaveEdition");
    expect(spencerMicrowavePatent.claims.length).toBe(6);
    const editionClaims = spencerMicrowaveArchivalEdition.blocks.filter((b: any) => b.kind === "claim");
    expect(editionClaims.length).toBe(6);

    for (const claim of spencerMicrowavePatent.claims) {
      const editionBlock = editionClaims.find((c: any) => c.number === claim.number);
      expect(editionBlock).toBeDefined();
      const expectedText = editionBlock.inlines.map((inl: any) => inl.text).join("");
      expect(claim.originalText).toBe(expectedText);
    }
  });

  test("provides valid provenance classifications for all Spencer controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-2495429-spencer-microwave"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({ rfPowerSetting: 1 });
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("binds energy output to honest omission reason without synthetic wattage", () => {
    const { energyChannelsFor, ENERGY_CHANNEL_OMISSION_REASONS } = require("@/physics/energyChannels");
    expect(energyChannelsFor("us-2495429-spencer-microwave", {})).toEqual([]);
    expect(ENERGY_CHANNEL_OMISSION_REASONS["us-2495429-spencer-microwave"]).toContain(
      "supplies no continuous electrical power input",
    );
  });
});
