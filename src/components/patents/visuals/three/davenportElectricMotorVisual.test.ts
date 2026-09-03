import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { stepDavenportMotor } from "@/physics/catalogKernels";
import { davenportElectricMotorCameraForViewport } from "./davenportElectricMotorCamera";
import {
  buildDavenportMotorModel,
  updateDavenportMotorKinematics,
} from "./davenportElectricMotorModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

function projectedBounds(
  object: THREE.Object3D,
  cameraView: ReturnType<typeof davenportElectricMotorCameraForViewport>,
  viewportWidth: number,
  viewportHeight: number,
) {
  object.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(object);
  const camera = new THREE.PerspectiveCamera(42, viewportWidth / viewportHeight, 0.1, 1000);
  camera.position.set(...cameraView.pos);
  camera.lookAt(...cameraView.target);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);

  const values = [bounds.min.x, bounds.max.x].flatMap((x) =>
    [bounds.min.y, bounds.max.y].flatMap((y) =>
      [bounds.min.z, bounds.max.z].map((z) => new THREE.Vector3(x, y, z).project(camera)),
    ),
  );
  return {
    minX: Math.min(...values.map((value) => value.x)),
    maxX: Math.max(...values.map((value) => value.x)),
    minY: Math.min(...values.map((value) => value.y)),
    maxY: Math.max(...values.map((value) => value.y)),
  };
}

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
    const cameraSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "davenportElectricMotorCamera.ts"),
      "utf8",
    );

    for (const preset of ["iso", "commutator", "stator_magnets", "rotor", "brushes", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Davenport DC Motor 3D");
    expect(threeSource).toContain("davenportElectricMotorCameraForViewport");
    expect(threeSource).toContain(
      'davenportElectricMotorCameraForViewport("iso", container.clientWidth)',
    );
    expect(davenportElectricMotorCameraForViewport("iso", 768)).toEqual({
      pos: [9.5, 2.6, 10.5],
      target: [0, -0.25, 0],
    });
    expect(cameraSource).toContain("A high overview looks down through the brass bearing plate");
  });

  test("keeps the baseboard, magnetic cores, and elevated bridge inside 320 px and 375 px phone overviews", () => {
    const { rootGroup, dispose } = buildDavenportMotorModel();
    for (const viewportWidth of [288, 343]) {
      const frame = projectedBounds(
        rootGroup,
        davenportElectricMotorCameraForViewport("iso", viewportWidth),
        viewportWidth,
        380,
      );

      expect(frame.minX).toBeGreaterThan(-0.9);
      expect(frame.maxX).toBeLessThan(0.9);
      expect(frame.minY).toBeGreaterThan(-0.9);
      expect(frame.maxY).toBeLessThan(0.9);
    }
    expect(davenportElectricMotorCameraForViewport("iso", 288).pos).not.toEqual([9.5, 2.6, 10.5]);
    dispose();
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
