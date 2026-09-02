import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FrankenSimEngine } from "@/physics/engine";
import {
  buildTeslaTeleautomatonModel,
  updateTeslaTeleautomatonKinematics,
} from "./teslaTeleautomatonModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 613,809 Nikola Tesla Teleautomaton visual & RF logic boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "TeslaTeleautomaton3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "teslaTeleautomatonModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildTeslaTeleautomatonModel");
    expect(modelSource).toContain("updateTeslaTeleautomatonKinematics");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "TeslaTeleautomaton3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "teslaTeleautomatonModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for teleautomaton observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "TeslaTeleautomaton3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "coherer_switch",
      "stepping_disk",
      "propeller_rudder",
      "antenna_mast",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("cutawayMode");
    expect(threeSource).toContain("Tesla Wireless Teleautomation");
    expect(threeSource).toContain("controls.setView");
    expect(threeSource).not.toContain("camera.position.set");
    expect(threeSource).not.toContain("propellerRpm ?? 450");
  });

  test("computes genuine Tesla RF resonance, coherer demodulation, and steering radius in SI units", () => {
    // In-tune at 150 kHz
    const tuned = FrankenSimEngine.stepTeslaTeleautomaton({
      transmitterFreqKhz: 150,
      rudderAngleDeg: 15,
    });
    expect(tuned.isResonant).toBe(true);
    expect(tuned.cohererOhms).toBeLessThan(100);
    expect(tuned.relayEnergized).toBe(true);
    expect(tuned.motorThrustN).toBeGreaterThan(50);
    expect(tuned.turningRadiusM).toBeLessThan(100);

    // Off-frequency at 120 kHz
    expect(tuned.propellerOmegaRadPerS).toBeGreaterThan(40);
    expect(tuned.propellerRpm).toBeCloseTo(450, 0);

    const detuned = FrankenSimEngine.stepTeslaTeleautomaton({
      transmitterFreqKhz: 120,
      rudderAngleDeg: 0,
    });
    expect(detuned.isResonant).toBe(false);
    expect(detuned.cohererOhms).toBeGreaterThan(10000);
    expect(detuned.relayEnergized).toBe(false);
    expect(detuned.propellerOmegaRadPerS).toBe(0);
    expect(detuned.motorThrustN).toBe(0);
    expect(detuned.cohererDisplayOmegaRadPerS).toBe(0);
    const locked = FrankenSimEngine.stepTeslaTeleautomaton({
      transmitterFreqKhz: 150,
      propellerThrottlePct: 75,
    });
    expect(locked.cohererDisplayOmegaRadPerS).toBe(1.5);
  });

  test("builds and articulates procedural robotic boat hierarchy correctly", () => {
    const { root, nodes, materials } = buildTeslaTeleautomatonModel();
    expect(root.children.length).toBeGreaterThan(4);
    expect(nodes.rfWaveRings.length).toBe(4);

    // Rudder articulation at 20 deg
    const omega = FrankenSimEngine.stepTeslaTeleautomaton({
      transmitterFreqKhz: 150,
      propellerThrottlePct: 75,
    }).propellerOmegaRadPerS;
    updateTeslaTeleautomatonKinematics(nodes, materials, 0.1, 1.0, omega, 20, true, true, 3, 1.5);
    expect(nodes.rudderGroup.rotation.y).toBeCloseTo((20 * Math.PI) / 180, 2);
    expect(nodes.cutawayHullMesh.visible).toBe(true);
    expect(nodes.hullMesh.visible).toBe(false);
    expect(materials.rfEnergy.opacity).toBeGreaterThan(0);
    expect(nodes.steppingDiskLogic.rotation.z).toBeCloseTo(3 * (Math.PI / 4), 5);

    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "teslaTeleautomatonModel.ts"),
      "utf8",
    );
    expect(modelSource).not.toContain("(propellerRpm * 2 * Math.PI) / 60");
    expect(modelSource).not.toContain("timeSec * 0.8");
    expect(modelSource).not.toContain("dt * 1.5");
    expect(modelSource).toContain("cohererDisplayOmegaRadPerS");
  });

  test("derives all printed claims dynamically from edition without duplicate strings", () => {
    const { teslaTeleautomatonPatent } = require("@/data/patents/tesla-teleautomaton");
    const {
      teslaTeleautomatonArchivalEdition,
    } = require("@/data/editions/teslaTeleautomatonEdition");
    expect(teslaTeleautomatonPatent.claims.length).toBe(13);
    const editionClaims = teslaTeleautomatonArchivalEdition.blocks.filter(
      (b: any) => b.kind === "claim",
    );
    expect(editionClaims.length).toBe(13);
    for (let i = 0; i < 13; i++) {
      const editionBlock = editionClaims[i];
      expect(editionBlock).toBeDefined();
      const expectedText = editionBlock.inlines.map((inl: any) => inl.text).join("");
      expect(teslaTeleautomatonPatent.claims[i].originalText).toBe(expectedText);
    }
  });

  test("registers explicit energy channel omission reason", () => {
    const {
      energyChannelsFor,
      ENERGY_CHANNEL_OMISSION_REASONS,
    } = require("@/physics/energyChannels");
    expect(ENERGY_CHANNEL_OMISSION_REASONS["us-613809-tesla-teleautomaton"]).toBeDefined();
    expect(energyChannelsFor("us-613809-tesla-teleautomaton", {})).toEqual([]);
  });
});
