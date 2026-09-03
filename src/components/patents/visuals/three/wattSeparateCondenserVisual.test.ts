import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import * as THREE from "three";
import { stepWattCondenser, WATT_DEFAULT_CONTROLS } from "@/physics/wattCondenserKernel";
import { wattSeparateCondenserCameraForViewport } from "./wattSeparateCondenserCamera";
import { buildWattSeparateCondenserModel, WATT_DIM } from "./wattSeparateCondenserModel";

function projectedBounds(
  object: THREE.Object3D,
  cameraView: ReturnType<typeof wattSeparateCondenserCameraForViewport>,
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

describe("GB 913 James Watt Separate Condenser visual & thermodynamics boundary", () => {
  const root = process.cwd();

  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      resolve(root, "src/components/patents/visuals/three/wattSeparateCondenserModel.ts"),
      "utf-8",
    );
    const vizSource = readFileSync(
      resolve(root, "src/components/patents/visuals/three/WattSeparateCondenser3D.tsx"),
      "utf-8",
    );
    expect(modelSource).not.toContain("GLTFLoader");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(vizSource).not.toContain("GLTFLoader");
    expect(vizSource).not.toContain(".glb");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const vizSource = readFileSync(
      resolve(root, "src/components/patents/visuals/three/WattSeparateCondenser3D.tsx"),
      "utf-8",
    );
    expect(vizSource).not.toContain("Math.random()");
    expect(vizSource).not.toContain("new THREE.Clock");
    expect(vizSource).not.toContain("performance.now()");
  });

  test("exposes authentic camera presets and cutaway mode for steam jacket inspection", () => {
    const vizSource = readFileSync(
      resolve(root, "src/components/patents/visuals/three/WattSeparateCondenser3D.tsx"),
      "utf-8",
    );
    const cameraSource = readFileSync(
      resolve(root, "src/components/patents/visuals/three/wattSeparateCondenserCamera.ts"),
      "utf-8",
    );
    expect(vizSource).toContain("activePreset");
    expect(vizSource).toContain("Steam Jacket (B)");
    expect(vizSource).toContain("Condenser (E)");
    expect(vizSource).toContain("Walking Beam (H)");
    expect(vizSource).toContain("Boiler (A)");
    expect(vizSource).toContain("setCutaway");
    expect(vizSource).toContain("controls.setView");
    expect(vizSource).toContain("wattSeparateCondenserCameraForViewport");
    expect(vizSource).toContain(
      'wattSeparateCondenserCameraForViewport("iso", container.clientWidth)',
    );
    expect(wattSeparateCondenserCameraForViewport("iso", 768)).toEqual({
      pos: [-9, 7, 12],
      target: [-0.5, 3.5, 0],
    });
    expect(cameraSource).toContain("Start from the open machinery side");
    expect(vizSource).toContain("useLiveSimParams");
    expect(vizSource).toContain("cycleOmegaRadPerS");
    expect(vizSource).not.toContain("spm / 60");
    const simSource = readFileSync(
      resolve(root, "src/components/patents/visuals/WattSeparateCondenserSim.tsx"),
      "utf-8",
    );
    expect(simSource).toContain("outputs.cycleOmegaRadPerS");
    expect(simSource).not.toContain("spm / 60");
  });

  test("keeps the complete condenser-engine assembly inside 320 px and 375 px phone overviews", () => {
    const model = buildWattSeparateCondenserModel();
    for (const viewportWidth of [288, 343]) {
      const frame = projectedBounds(
        model.root,
        wattSeparateCondenserCameraForViewport("iso", viewportWidth),
        viewportWidth,
        380,
      );

      // 0.90 leaves visual breathing room for the boiler, beam, cylinder,
      // wall, and condenser instead of letting a phone crop the claimed topology.
      expect(frame.minX).toBeGreaterThan(-0.9);
      expect(frame.maxX).toBeLessThan(0.9);
      expect(frame.minY).toBeGreaterThan(-0.9);
      expect(frame.maxY).toBeLessThan(0.9);
    }
    expect(wattSeparateCondenserCameraForViewport("iso", 288).pos).not.toEqual([-9, 7, 12]);
    model.dispose();
  });

  test("computes genuine Rankine cycle power, separate condenser vacuum, and coal economy in SI units", () => {
    const out = stepWattCondenser(WATT_DEFAULT_CONTROLS);
    expect(out.indicatedHorsepower).toBeGreaterThan(20);
    expect(out.vacuumDepthInchesHg).toBeGreaterThan(27);
    expect(out.thermalEfficiencyPct).toBeGreaterThan(2.5);
    expect(out.coalConsumptionKgPerHour).toBeGreaterThan(15);
    expect(out.coalSavedTonsPerYear).toBeGreaterThan(100);
  });

  test("builds and articulates procedural walking beam, steam jacket, piston, separate condenser, and air pump correctly", () => {
    const model = buildWattSeparateCondenserModel();
    expect(model.root).toBeDefined();
    expect(model.beamGroup).toBeDefined();
    expect(model.pistonGroup).toBeDefined();
    expect(model.airPumpRodGroup).toBeDefined();
    expect(model.condenserGroup).toBeDefined();
    expect(model.calloutGroup).toBeDefined();

    // Verify dimension table matches Soho archival plans
    expect(WATT_DIM.cylinderBoreM).toBe(0.965);
    expect(WATT_DIM.beamLengthM).toBe(7.315);
    expect(WATT_DIM.fulcrumHeightM).toBe(5.8);

    // Test cutaway toggle
    model.setCutaway(true);
    expect(model.jacketMesh.visible).toBe(false);
    model.setCutaway(false);
    expect(model.jacketMesh.visible).toBe(true);

    // Test callouts toggle
    model.setCalloutsVisible(false);
    expect(model.calloutGroup.visible).toBe(false);
    model.setCalloutsVisible(true);
    expect(model.calloutGroup.visible).toBe(true);

    model.dispose();
  });
});
