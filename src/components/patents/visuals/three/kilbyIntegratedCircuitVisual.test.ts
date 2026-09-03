import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import {
  KILBY_FIGURE_7_VALUES,
  KILBY_PRINTED_WAFER,
  KILBY_SOURCE_CIRCUIT_DEFAULTS,
  stepKilbySourceCircuitTopology,
} from "@/physics/kilbySourceCircuitKernel";
import { buildKilbySourceCircuitModel } from "./kilbySourceCircuitModel";

describe("US 3,138,743 Jack S. Kilby Monolithic Integrated Circuit Visual & Physics Boundary", () => {
  const rootDir = process.cwd();
  const modelFile = join(
    rootDir,
    "src/components/patents/visuals/three/kilbySourceCircuitModel.ts",
  );
  const studioFile = join(rootDir, "src/components/patents/visuals/three/KilbySourceCircuit3D.tsx");

  test("routes the public Three.js exhibit to the source-bounded procedural reconstruction", () => {
    const modelSource = readFileSync(modelFile, "utf-8");
    const studioSource = readFileSync(studioFile, "utf-8");
    const dispatcherSource = readFileSync(
      join(rootDir, "src/components/patents/visuals/index.tsx"),
      "utf-8",
    );

    expect(modelSource).not.toContain("GLTFLoader");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(modelSource).not.toContain("Math.random");
    expect(modelSource).not.toContain("carrier particle");
    expect(studioSource).not.toContain("GLTFLoader");
    expect(studioSource).toContain('from "./useLiveSimParams"');
    expect(studioSource).toContain("model.update(live.current.state)");
    expect(studioSource).toContain("isRefused: true");
    expect(dispatcherSource).toContain('import("./three/KilbySourceCircuit3D")');
  });

  test("does not animate invented switching, free carriers, or unmeasured performance", () => {
    const modelSource = readFileSync(modelFile, "utf-8");
    const studioSource = readFileSync(studioFile, "utf-8");

    expect(modelSource).not.toContain("performance.now()");
    expect(modelSource).not.toContain("Date.now()");
    expect(modelSource).not.toContain("Math.sin");
    expect(studioSource).not.toContain("performance.now()");
    expect(studioSource).not.toContain("supplyVoltageV");
    expect(studioSource).not.toContain("reverseBiasVoltageV");
    expect(studioSource).not.toContain("collectorCurrentMa");
    expect(studioSource).not.toContain("maxClockFrequencyMhz");
    expect(studioSource).not.toContain("PortHamiltonianEnergyStrip");
  });

  test("pins only the construction dimensions and circuit values printed in the grant", () => {
    expect(KILBY_PRINTED_WAFER).toMatchObject({
      lengthIn: 0.2,
      widthIn: 0.08,
      thicknessIn: 0.0025,
      resistivityOhmCm: 3,
      nLayerDepthMil: 0.7,
    });
    expect(KILBY_FIGURE_7_VALUES).toEqual({
      r1R2Ohms: 3000,
      r3R8Ohms: 1800,
      r4R5R6R7Ohms: 400,
      c1C2Microfarads: 50,
    });
    const state = stepKilbySourceCircuitTopology(KILBY_SOURCE_CIRCUIT_DEFAULTS);
    expect(state.quantitativeCircuitPerformanceAvailable).toBe(false);
    expect(state.quantitativeEnergyAvailable).toBe(false);
    expect(state.refusal.reason).toContain("does not print a supply voltage");
  });

  test("builds one supported wafer with integral regions and physically attached Kovar leads", () => {
    const model = buildKilbySourceCircuitModel();
    model.root.updateMatrixWorld(true);
    const waferBounds = new THREE.Box3().setFromObject(model.wafer);

    expect(model.root).toBeInstanceOf(THREE.Group);
    expect(model.wafer.name).toContain("p-type germanium wafer");
    expect(model.transistorGroups).toHaveLength(2);
    expect(model.resistorRegions.children).toHaveLength(8);
    expect(model.capacitorRegions.children).toHaveLength(2);
    expect(model.kovarLeads.children).toHaveLength(7);

    for (const group of [
      model.nTypeRegions,
      model.resistorRegions,
      model.capacitorRegions,
      ...model.transistorGroups,
    ]) {
      for (const part of group.children) {
        expect(
          waferBounds.intersectsBox(new THREE.Box3().setFromObject(part)),
          `${part.name} must meet the single wafer body`,
        ).toBe(true);
      }
    }
    for (const lead of model.kovarLeads.children) {
      expect(
        waferBounds.intersectsBox(new THREE.Box3().setFromObject(lead)),
        `${lead.name} must touch the wafer edge`,
      ).toBe(true);
    }

    const foundation = model.root.getObjectByName("museum foundation supporting the source wafer");
    const supports = model.root.children.filter((part) =>
      part.name.includes("insulating museum support"),
    );
    expect(foundation).toBeDefined();
    if (!foundation) throw new Error("Kilby model is missing its supporting foundation.");
    expect(supports).toHaveLength(4);
    for (const support of supports) {
      const supportBounds = new THREE.Box3().setFromObject(support);
      expect(supportBounds.intersectsBox(waferBounds)).toBe(true);
      expect(supportBounds.intersectsBox(new THREE.Box3().setFromObject(foundation))).toBe(true);
    }

    model.dispose();
  });

  test("anchors both ends of every wire 70 and makes Claim 1 inversion visibly open the circuit", () => {
    const model = buildKilbySourceCircuitModel();
    model.root.updateMatrixWorld(true);
    const wires = model.wireBonds.children.filter(
      (part): part is THREE.Mesh =>
        part instanceof THREE.Mesh && !part.name.endsWith("thermal bond"),
    );

    expect(wires.length).toBeGreaterThanOrEqual(12);
    for (const wire of wires) {
      const anchors = model.wireBonds.children.filter(
        (part) => part.name === `${wire.name} thermal bond`,
      );
      expect(anchors, `${wire.name} must have two named endpoint bonds`).toHaveLength(2);
      const wireBounds = new THREE.Box3().setFromObject(wire);
      for (const anchor of anchors) {
        expect(wireBounds.intersectsBox(new THREE.Box3().setFromObject(anchor))).toBe(true);
      }
    }

    model.update(stepKilbySourceCircuitTopology({ claim1ConductiveMeansPresent: 0 }));
    expect(model.wireBonds.visible).toBe(false);
    expect(model.openCircuitMarkers.visible).toBe(true);
    model.update(stepKilbySourceCircuitTopology({ claim1ConductiveMeansPresent: 1 }));
    expect(model.wireBonds.visible).toBe(true);
    expect(model.openCircuitMarkers.visible).toBe(false);
    model.dispose();
  });
});
