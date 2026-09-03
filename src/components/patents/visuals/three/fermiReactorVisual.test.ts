import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { FERMI_KINETICS_SOURCE_BOUNDARY, stepFermiKinetics } from "@/physics/fermiKinetics";
import { computeFermiNormalizedDisplayField } from "@/physics/fieldTextures";
import { fermiReactorViewForViewport } from "./fermiReactorCamera";
import { buildFermiReactorModel, updateFermiReactorKinematics } from "./fermiReactorModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals");

describe("US 2,708,656 source-bounded graphite and natural-uranium reactor visual", () => {
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
    expect(modelSource).not.toContain("Chicago Pile-1");
    expect(modelSource).not.toContain("BF3");
    expect(threeSource).not.toContain("PortHamiltonianEnergyStrip");
    expect(threeSource).not.toContain("Geiger Counter");
    expect(threeSource).not.toContain("fuelEnrichmentPct");
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
    const displayField = model.neutronDisplayField;

    updateFermiReactorKinematics(model, 1 / 60, 80, 0.99, 99.5, 1, 2, 0.2, true);
    expect(model.uraniumFuelMat.emissive).toBe(emissive);
    expect(model.uraniumFuelMat.emissive.getHex()).toBe(0x22c55e);
    expect(model.neutronDisplayField).toBe(displayField);

    updateFermiReactorKinematics(model, 1 / 60, 90, 1.01, 99.5, 1, 2.2, 0.8, true);
    expect(model.uraniumFuelMat.emissive).toBe(emissive);
    expect(model.uraniumFuelMat.emissive.getHex()).toBe(0xf97316);
    expect(model.neutronDisplayField).toBe(displayField);
    expect(computeFermiNormalizedDisplayField(1.01, 0.2, 16, displayField)).toBe(displayField);
    expect(updateSource).not.toContain("new THREE.Color");
    expect(updateSource).not.toContain("new Float32Array");

    model.dispose();
  });

  test("exposes source-specific camera presets and backs the phone camera away", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "FermiReactor3D.tsx"),
      "utf8",
    );
    const cameraSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "fermiReactorCamera.ts"),
      "utf8",
    );

    for (const preset of ["iso", "control_rods", "graphite_core", "enclosure", "detector", "top"]) {
      expect(cameraSource).toContain(preset);
    }
    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("controls.setView");
    expect(threeSource).not.toContain("camera.position.set");
    const desktop = fermiReactorViewForViewport("iso", 1200);
    const phone = fermiReactorViewForViewport("iso", 390);
    expect(
      new THREE.Vector3(...phone.pos).distanceTo(new THREE.Vector3(...phone.target)),
    ).toBeGreaterThan(
      new THREE.Vector3(...desktop.pos).distanceTo(new THREE.Vector3(...desktop.target)),
    );
  });

  test("publishes a quantitative refusal and only a normalized control lens", () => {
    const result = stepFermiKinetics(83.5, 99.5, 0.72);
    expect(FERMI_KINETICS_SOURCE_BOUNDARY).toContain("does not calibrate absorber worth");
    expect(FERMI_KINETICS_SOURCE_BOUNDARY).toContain("power, flux, detector rate");
    expect(result.kEffective).toBeGreaterThan(0.998);
    expect(result.kEffective).toBeLessThan(1.002);
    expect(result.thermalPowerWatts).toBe(0);
    expect(result.thermalNeutronFluxNPerCm2S).toBe(0);
    expect(result.geigerIntervalMs).toBe(0);
    expect(result.rodStudioX).toBeCloseTo(0.835 * 5.8, 3);
    expect(result.fuelGlowIntensity).toBeGreaterThan(0);
    expect(result.schematicRodY).toBe(145);
    expect(result.schematicRodX).toBeCloseTo(80 + 0.835 * 220, 2);
    expect(result.schematicCoreW).toBe(240);
    expect(result.latticeRows).toBe(5);
    expect(result.schematicSlugCols).toBe(4);
    expect(result.schematicSlugR).toBe(9);
    expect(result.latticeCols).toBe(7);
  });

  test("builds the Figures 7–8 enclosure, graphite pile, uranium rods, absorber guides, and supported detector", () => {
    const model = buildFermiReactorModel();
    expect(model.root.children.length).toBeGreaterThan(0);
    expect(model.foundation.name).toContain("foundation 10");
    expect(model.enclosureGroup.name).toContain("enclosure 11");
    expect(model.supportGroup.name).toContain("guide tables");
    expect(model.pileGroup).toBeDefined();
    expect(model.fuelGroup.name).toContain("natural-uranium rod lattice");
    expect(model.rodGroup).toBeDefined();
    expect(model.controlRods).toHaveLength(3);
    expect(model.controlRodCarriages).toHaveLength(3);
    const firstRod = model.controlRods[0];
    const firstCarriage = model.controlRodCarriages[0];
    expect(firstRod).toBeDefined();
    expect(firstCarriage).toBeDefined();
    if (!firstRod || !firstCarriage) throw new Error("Expected a complete absorber assembly.");
    expect((firstRod.material as THREE.MeshStandardMaterial).color.getHex()).toBe(0xb45309);
    expect((firstRod.material as THREE.Material).uuid).not.toBe(
      (firstCarriage.material as THREE.Material).uuid,
    );
    expect(model.ionizationChamber.name).toContain("ionization chamber 29a");
    expect(model.neutronPoints).toBeDefined();

    const kinetics = stepFermiKinetics(83.5, 99.5, 0.72);
    updateFermiReactorKinematics(
      model,
      1 / 60,
      83.5,
      kinetics.kEffective,
      99.5,
      kinetics.neutronDisplaySpeed,
      kinetics.rodStudioX,
      kinetics.fuelGlowIntensity,
      true,
      true,
    );
    expect(model.neutronPoints.visible).toBe(true);
    expect(model.graphiteMat.opacity).toBe(0.35);
    expect(model.enclosureMat.opacity).toBe(0.16);

    updateFermiReactorKinematics(
      model,
      1 / 60,
      83.5,
      0,
      99.5,
      0,
      kinetics.rodStudioX,
      0,
      true,
      true,
      false,
    );
    expect(model.fuelGroup.visible).toBe(false);
    expect(model.neutronPoints.visible).toBe(false);

    model.dispose();
  });

  test("keeps every moving absorber attached to its carriage and seated over supported rails", () => {
    const model = buildFermiReactorModel();
    const graphiteBounds = new THREE.Box3().setFromObject(model.graphiteBricks);
    for (const withdrawal of [0, 37.5, 83.5, 100]) {
      const kinetics = stepFermiKinetics(withdrawal, 99.5);
      updateFermiReactorKinematics(
        model,
        1 / 60,
        withdrawal,
        kinetics.kEffective,
        99.5,
        kinetics.neutronDisplaySpeed,
        kinetics.rodStudioX,
        kinetics.fuelGlowIntensity,
        false,
      );
      for (let index = 0; index < model.controlRods.length; index++) {
        const rod = model.controlRods[index];
        const carriage = model.controlRodCarriages[index];
        expect(rod).toBeDefined();
        expect(carriage).toBeDefined();
        expect((carriage?.position.x ?? 0) - (rod?.position.x ?? 0)).toBeCloseTo(2.9, 8);
        expect(rod?.position.y).toBeCloseTo(0.2, 8);
        expect(carriage?.position.y).toBeCloseTo(0.04, 8);
      }

      const firstRodBounds = new THREE.Box3().setFromObject(model.controlRods[0] as THREE.Mesh);
      if (withdrawal === 0) {
        expect(firstRodBounds.min.x).toBeLessThanOrEqual(graphiteBounds.min.x);
        expect(firstRodBounds.max.x).toBeGreaterThanOrEqual(graphiteBounds.max.x);
      }
      if (withdrawal === 100) {
        expect(firstRodBounds.min.x).toBeGreaterThan(graphiteBounds.max.x);
      }

      const railBounds = new THREE.Box3().setFromObject(model.supportGroup);
      for (const carriage of model.controlRodCarriages) {
        const carriageBounds = new THREE.Box3().setFromObject(carriage);
        expect(carriageBounds.min.x).toBeGreaterThanOrEqual(railBounds.min.x);
        expect(carriageBounds.max.x).toBeLessThanOrEqual(railBounds.max.x);
      }
    }

    const foundation = new THREE.Box3().setFromObject(model.foundation);
    for (const foot of model.supportGroup.children.filter((child) => child.name.includes("foot"))) {
      const box = new THREE.Box3().setFromObject(foot);
      expect(box.min.y).toBeCloseTo(foundation.max.y, 6);
    }
    const chamber = new THREE.Box3().setFromObject(model.ionizationChamber);
    const cradleObject = model.supportGroup.getObjectByName("ionization chamber cradle");
    expect(cradleObject).toBeDefined();
    const cradle = new THREE.Box3().setFromObject(cradleObject as THREE.Object3D);
    expect(chamber.min.y - cradle.max.y).toBeLessThanOrEqual(0.02);
    expect(chamber.max.x).toBeGreaterThan(cradle.min.x);
    expect(chamber.min.x).toBeLessThan(cradle.max.x);

    model.dispose();
  });

  test("instances the repeated graphite and uranium lattices instead of constructing thousands of draw objects", () => {
    const model = buildFermiReactorModel();
    const graphite = model.pileGroup.getObjectByName("Graphite moderator brick lattice");
    const fuel = model.fuelGroup.getObjectByName(
      "Natural uranium rods disposed in a geometric pattern",
    );
    let meshCount = 0;
    let instancedMeshCount = 0;

    model.root.traverse((object) => {
      if (object.type === "Mesh") meshCount += 1;
      if (object instanceof THREE.InstancedMesh) instancedMeshCount += 1;
    });

    expect(graphite).toBeInstanceOf(THREE.InstancedMesh);
    expect(fuel).toBeInstanceOf(THREE.InstancedMesh);
    expect((graphite as THREE.InstancedMesh).count).toBe(13 * 17 * 17);
    expect((fuel as THREE.InstancedMesh).count).toBe(16);
    expect(model.graphiteBricks.material).toBe(model.graphiteMat);
    expect(model.uraniumRods.material).toBe(model.uraniumFuelMat);

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
    expectInstancePosition(model.graphiteBricks, 0, [-2.72, -3.22, -2.72]);
    expectInstancePosition(
      model.graphiteBricks,
      Math.floor(model.graphiteBricks.count / 2),
      [0, -0.82, 0],
    );
    expectInstancePosition(
      model.graphiteBricks,
      model.graphiteBricks.count - 1,
      [2.72, 1.58, 2.72],
    );
    expectInstancePosition(model.uraniumRods, 0, [-2.1, -2.35, 0]);
    expectInstancePosition(model.uraniumRods, 8, [-2.1, 0.05, 0]);
    expectInstancePosition(model.uraniumRods, 15, [2.1, 1.25, 0]);
    expect(instancedMeshCount).toBe(2);
    expect(meshCount).toBeLessThan(64);

    model.dispose();
    expect(model.root.children).toHaveLength(0);
  });
});
