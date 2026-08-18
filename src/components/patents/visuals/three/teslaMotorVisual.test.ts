import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FrankenSimEngine } from "@/physics/engine";
import { buildTeslaMotorModel } from "./teslaMotorModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 381,968 Nikola Tesla Induction Motor visual & electromagnetics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "TeslaMotor3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "teslaMotorModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildTeslaMotorModel");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "TeslaMotor3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "teslaMotorModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and UI overlay for polyphase motor observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "TeslaMotor3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "stator_coils", "squirrel_cage", "shaft_drive", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("Polyphase Induction Telemetry");
  });

  test("computes genuine synchronous speed, electromagnetic slip, and electrical power in SI units", () => {
    const result = FrankenSimEngine.stepTeslaMotor(60, 2, 38.5);
    expect(result.synchronousRpm).toBe(3600);
    expect(result.slipFraction).toBeGreaterThan(0);
    expect(result.slipFraction).toBeLessThan(1);
    expect(result.rotorRpm).toBeLessThan(result.synchronousRpm);
    expect(result.electricalInputWatts).toBeGreaterThan(1000);
  });

  test("builds and articulates procedural stator ring, salient poles, copper coils, rotor bars, and flux particles correctly", () => {
    const {
      rootGroup,
      statorGroup,
      rotorGroup,
      drivePulley,
      coilMeshes,
      fluxPoints,
      materials,
      dispose,
    } = buildTeslaMotorModel(2);

    expect(rootGroup.children.length).toBeGreaterThan(1);
    expect(statorGroup).toBeDefined();
    expect(rotorGroup).toBeDefined();
    expect(drivePulley).toBeDefined();
    expect(coilMeshes.length).toBe(4);
    expect(fluxPoints).toBeDefined();
    expect(materials.statorIron).toBeDefined();
    expect(materials.copperCoil).toBeDefined();
    expect(materials.copperRotorBar).toBeDefined();

    dispose();
  });
});
