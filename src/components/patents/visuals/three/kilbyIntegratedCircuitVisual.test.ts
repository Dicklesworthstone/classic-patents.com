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
import {
  KILBY_SOURCE_CIRCUIT_CAMERA_PRESETS,
  kilbySourceCircuitCameraForViewport,
} from "./kilbySourceCircuitCamera";
import { buildKilbySourceCircuitModel } from "./kilbySourceCircuitModel";

function projectedObjectBounds(object: THREE.Object3D, camera: THREE.PerspectiveCamera) {
  object.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(object);
  const frame = {
    minX: Number.POSITIVE_INFINITY,
    maxX: Number.NEGATIVE_INFINITY,
    minY: Number.POSITIVE_INFINITY,
    maxY: Number.NEGATIVE_INFINITY,
  };

  for (const x of [bounds.min.x, bounds.max.x]) {
    for (const y of [bounds.min.y, bounds.max.y]) {
      for (const z of [bounds.min.z, bounds.max.z]) {
        const projected = new THREE.Vector3(x, y, z).project(camera);
        frame.minX = Math.min(frame.minX, projected.x);
        frame.maxX = Math.max(frame.maxX, projected.x);
        frame.minY = Math.min(frame.minY, projected.y);
        frame.maxY = Math.max(frame.maxY, projected.y);
      }
    }
  }

  return frame;
}

function projectedPixels(
  frame: ReturnType<typeof projectedObjectBounds>,
  canvasWidth: number,
  canvasHeight: number,
) {
  return {
    width: ((frame.maxX - frame.minX) * canvasWidth) / 2,
    height: ((frame.maxY - frame.minY) * canvasHeight) / 2,
  };
}

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
    expect(studioSource).toContain("kilbySourceCircuitCameraForViewport");
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

  test("keeps the semiconductor and interconnect envelope legible in the exact 286 by 380px phone canvas", () => {
    const model = buildKilbySourceCircuitModel();
    try {
      const canvasWidth = 286;
      const canvasHeight = 380;
      const desktop = kilbySourceCircuitCameraForViewport("figure6a", 1216, 460);
      expect(desktop).toEqual(KILBY_SOURCE_CIRCUIT_CAMERA_PRESETS.figure6a);
      expect(kilbySourceCircuitCameraForViewport("wires70", canvasWidth, canvasHeight)).toEqual(
        KILBY_SOURCE_CIRCUIT_CAMERA_PRESETS.wires70,
      );

      const phone = kilbySourceCircuitCameraForViewport("figure6a", canvasWidth, canvasHeight);
      expect(phone).not.toEqual(KILBY_SOURCE_CIRCUIT_CAMERA_PRESETS.figure6a);

      const camera = new THREE.PerspectiveCamera(42, canvasWidth / canvasHeight, 0.1, 1000);
      camera.position.set(...phone.pos);
      camera.lookAt(...phone.target);
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();

      for (const claim1ConductiveMeansPresent of [0, 1] as const) {
        model.update(stepKilbySourceCircuitTopology({ claim1ConductiveMeansPresent }));
        model.root.updateMatrixWorld(true);

        const apparatus = projectedObjectBounds(model.root, camera);
        const wafer = projectedPixels(
          projectedObjectBounds(model.wafer, camera),
          canvasWidth,
          canvasHeight,
        );
        const resistors = projectedPixels(
          projectedObjectBounds(model.resistorRegions, camera),
          canvasWidth,
          canvasHeight,
        );
        const leads = projectedPixels(
          projectedObjectBounds(model.kovarLeads, camera),
          canvasWidth,
          canvasHeight,
        );

        expect(
          apparatus.minX,
          `Claim 1 ${claim1ConductiveMeansPresent} left envelope`,
        ).toBeGreaterThan(-0.84);
        expect(
          apparatus.maxX,
          `Claim 1 ${claim1ConductiveMeansPresent} right envelope`,
        ).toBeLessThan(0.95);
        expect(
          apparatus.minY,
          `Claim 1 ${claim1ConductiveMeansPresent} lower envelope`,
        ).toBeGreaterThan(-0.62);
        expect(
          apparatus.maxY,
          `Claim 1 ${claim1ConductiveMeansPresent} upper envelope`,
        ).toBeLessThan(0.46);
        expect(
          projectedPixels(apparatus, canvasWidth, canvasHeight).height,
          `Claim 1 ${claim1ConductiveMeansPresent} projected apparatus height`,
        ).toBeGreaterThan(170);
        expect(wafer.width, "germanium wafer projected width").toBeGreaterThan(150);
        expect(wafer.height, "germanium wafer projected height").toBeGreaterThan(105);
        expect(resistors.width, "integral resistor projected width").toBeGreaterThan(135);
        expect(resistors.height, "integral resistor projected height").toBeGreaterThan(90);
        expect(leads.width, "Kovar lead projected width").toBeGreaterThan(205);
        expect(leads.height, "Kovar lead projected height").toBeGreaterThan(135);

        const claimProbe = claim1ConductiveMeansPresent
          ? projectedPixels(
              projectedObjectBounds(model.wireBonds, camera),
              canvasWidth,
              canvasHeight,
            )
          : projectedPixels(
              projectedObjectBounds(model.openCircuitMarkers, camera),
              canvasWidth,
              canvasHeight,
            );
        expect(
          claimProbe.width,
          `Claim 1 ${claim1ConductiveMeansPresent} probe width`,
        ).toBeGreaterThan(claim1ConductiveMeansPresent ? 155 : 60);
        expect(
          claimProbe.height,
          `Claim 1 ${claim1ConductiveMeansPresent} probe height`,
        ).toBeGreaterThan(claim1ConductiveMeansPresent ? 105 : 48);
      }
    } finally {
      model.dispose();
    }
  });
});
