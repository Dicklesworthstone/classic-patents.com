import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { FrankenSimEngine } from "@/physics/engine";
import { computeFermiNeutronFluxField } from "@/physics/fieldTextures";
import { buildFermiReactorModel, updateFermiReactorKinematics } from "./fermiReactorModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals");

describe("US 2,708,656 Enrico Fermi Chicago Pile-1 Nuclear Reactor visual & kinetics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "fermiReactorModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "FermiReactor3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("useGLTF");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(modelSource).toContain("updateFermiReactorKinematics");
    expect(threeSource).not.toContain("useGLTF");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "fermiReactorModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "FermiReactor3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("performance.now()");
  });

  test("reuses color and field storage throughout the frame-update hot path", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "fermiReactorModel.ts"),
      "utf8",
    );
    const updateSource = modelSource.slice(
      modelSource.indexOf("export function updateFermiReactorKinematics"),
    );
    const model = buildFermiReactorModel();
    const emissive = model.uraniumFuelMat.emissive;
    const fluxField = model.neutronFluxField;

    updateFermiReactorKinematics(model, 1 / 60, 80, 0.99, 99.5, 1, 2, 0.2, true);
    expect(model.uraniumFuelMat.emissive).toBe(emissive);
    expect(model.uraniumFuelMat.emissive.getHex()).toBe(0x22c55e);
    expect(model.neutronFluxField).toBe(fluxField);

    updateFermiReactorKinematics(model, 1 / 60, 90, 1.01, 99.5, 1, 2.2, 0.8, true);
    expect(model.uraniumFuelMat.emissive).toBe(emissive);
    expect(model.uraniumFuelMat.emissive.getHex()).toBe(0xf97316);
    expect(model.neutronFluxField).toBe(fluxField);
    expect(computeFermiNeutronFluxField(1.01, 0.2, 16, fluxField)).toBe(fluxField);
    expect(updateSource).not.toContain("new THREE.Color");
    expect(updateSource).not.toContain("new Float32Array");

    model.dispose();
  });

  test("exposes authentic camera presets and UI overlay for nuclear pile observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "FermiReactor3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "control_rods", "graphite_core", "gantry", "detector", "top"]) {
      expect(threeSource).toContain(preset);
    }
    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("controls.setView");
    expect(threeSource).not.toContain("camera.position.set");
  });

  test("computes genuine four-factor formula, effective neutron multiplication (k_eff), and thermal power in SI units", () => {
    const result = FrankenSimEngine.stepFermiReactor(83.5, 99.5, 0.72);
    expect(result.kEffective).toBeGreaterThan(0.95);
    expect(result.kEffective).toBeLessThan(1.05);
    expect(result.thermalPowerWatts).toBeGreaterThan(0);
    expect(result.geigerIntervalMs).toBeGreaterThan(10);
    expect(result.geigerIntervalS).toBeCloseTo(Math.max(0.05, result.geigerIntervalMs / 1000), 3);
    expect(result.thermalFluxE7).toBeCloseTo(result.thermalNeutronFluxNPerCm2S / 1e7, 1);
    expect(result.rodStudioY).toBeCloseTo(-0.5 + 0.835 * 3.2, 3);
    expect(result.fuelGlowIntensity).toBeGreaterThan(0);
    expect(result.rodSvgY).toBeCloseTo(30 - 0.835 * 120, 2);
    expect(result.schematicRodY).toBeCloseTo(20 + ((100 - 83.5) / 100) * 70, 2);
    expect(result.schematicRodX).toBe(195);
    expect(result.schematicCoreW).toBe(240);
    expect(result.latticeRows).toBe(5);
    expect(result.schematicSlugCols).toBe(4);
    expect(result.schematicSlugR).toBe(9);
    expect(result.latticeCols).toBe(7);
  });

  test("builds and articulates procedural timber scaffold, graphite moderator pile, uranium fuel lattice, and cadmium control rods correctly", () => {
    const model = buildFermiReactorModel();
    expect(model.root.children.length).toBeGreaterThan(0);
    expect(model.timberGroup).toBeDefined();
    expect(model.pileGroup).toBeDefined();
    expect(model.fuelGroup).toBeDefined();
    expect(model.rodGroup).toBeDefined();
    expect(model.bf3Detector).toBeDefined();
    expect(model.neutronPoints).toBeDefined();

    // Test kinematics update & cutaway
    const kinetics = FrankenSimEngine.stepFermiReactor(83.5, 99.5, 0.72);
    updateFermiReactorKinematics(
      model,
      1 / 60,
      83.5,
      kinetics.kEffective,
      99.5,
      kinetics.neutronDisplaySpeed,
      kinetics.rodStudioY,
      kinetics.fuelGlowIntensity,
      true,
      true,
    );
    expect(model.neutronPoints.visible).toBe(true);
    expect(model.graphiteMat.opacity).toBe(0.35);

    model.dispose();
  });

  test("instances the repeated graphite and uranium lattices instead of constructing thousands of draw objects", () => {
    const model = buildFermiReactorModel();
    const graphite = model.pileGroup.getObjectByName("Graphite moderator brick lattice");
    const fuel = model.fuelGroup.getObjectByName("Natural uranium fuel slug lattice");
    let meshCount = 0;
    let instancedMeshCount = 0;

    model.root.traverse((object) => {
      if (object.type === "Mesh") meshCount += 1;
      if (object instanceof THREE.InstancedMesh) instancedMeshCount += 1;
    });

    expect(graphite).toBeInstanceOf(THREE.InstancedMesh);
    expect(fuel).toBeInstanceOf(THREE.InstancedMesh);
    expect((graphite as THREE.InstancedMesh).count).toBeGreaterThan(2_500);
    expect((fuel as THREE.InstancedMesh).count).toBeGreaterThan(50);
    expect(model.graphiteBricks.material).toBe(model.graphiteMat);
    expect(model.fuelSlugs.material).toBe(model.uraniumFuelMat);

    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const expectInstancePosition = (
      lattice: THREE.InstancedMesh,
      index: number,
      expected: readonly [number, number, number],
    ) => {
      lattice.getMatrixAt(index, matrix);
      position.setFromMatrixPosition(matrix);
      expect(position.x).toBeCloseTo(expected[0], 6);
      expect(position.y).toBeCloseTo(expected[1], 6);
      expect(position.z).toBeCloseTo(expected[2], 6);
    };
    expectInstancePosition(model.graphiteBricks, 0, [-1.05, -2.2, -0.7]);
    expectInstancePosition(
      model.graphiteBricks,
      Math.floor(model.graphiteBricks.count / 2),
      [-2.8, 0.04, -2.1],
    );
    expectInstancePosition(model.graphiteBricks, model.graphiteBricks.count - 1, [1.05, 1.96, 0.7]);
    expectInstancePosition(model.fuelSlugs, 0, [-1.4, -1.56, -1.4]);
    expectInstancePosition(model.fuelSlugs, Math.floor(model.fuelSlugs.count / 2), [0, -0.28, 0]);
    expectInstancePosition(model.fuelSlugs, model.fuelSlugs.count - 1, [1.4, 1, 1.4]);
    expect(instancedMeshCount).toBe(2);
    expect(meshCount).toBeLessThan(32);

    model.dispose();
    expect(model.root.children).toHaveLength(0);
  });
});
