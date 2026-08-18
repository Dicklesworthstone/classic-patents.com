import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepDavenportMotor } from "@/physics/catalogKernels";
import {
  buildDavenportMotorModel,
  updateDavenportMotorKinematics,
} from "./davenportElectricMotorModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 132 Thomas Davenport Commutator DC Electric Motor visual & electromechanics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "DavenportElectricMotor3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "davenportElectricMotorModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildDavenportMotorModel");
    expect(modelSource).toContain("updateDavenportMotorKinematics");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "DavenportElectricMotor3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "davenportElectricMotorModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for DC motor observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "DavenportElectricMotor3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "commutator", "stator_magnets", "rotor", "brushes", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Davenport DC Motor 3D");
  });

  test("computes genuine DC motor torque, back EMF, and electrical efficiency in SI units", () => {
    const result = stepDavenportMotor({ batteryVoltage: 12, loadTorque: 0.8 });
    expect(result.shaftRpm).toBeGreaterThan(100);
    expect(result.shaftPowerW).toBeGreaterThan(10);
    expect(result.efficiencyPct).toBeGreaterThan(30);
    expect(result.armatureCurrentA).toBeGreaterThan(1);
    expect(result.electricalWatts).toBeGreaterThan(10);
  });

  test("builds and articulates procedural baseboard, stator electromagnets, 4-pole rotor, and commutator correctly", () => {
    const { rootGroup, nodes, materials, dispose } = buildDavenportMotorModel();
    expect(rootGroup.children.length).toBeGreaterThan(2);
    expect(nodes.statorCoils.length).toBe(4);
    expect(nodes.rotorPoles.length).toBe(4);
    expect(nodes.brushes.length).toBe(2);
    expect(nodes.commutator).toBeDefined();

    updateDavenportMotorKinematics(nodes, materials, 0.016, 0.5, 50.0, true, true);
    expect(materials.mahogany.transparent).toBe(true);

    dispose();
  });
});
