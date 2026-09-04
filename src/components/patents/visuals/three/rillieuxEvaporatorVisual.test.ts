import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { stepRillieuxEvaporator } from "@/physics/rillieuxEvaporatorKernel";
import {
  RILLIEUX_COMPACT_OVERVIEW_SAFE_ZONE,
  RILLIEUX_EVAPORATOR_CAMERA_PRESETS,
  rillieuxEvaporatorCameraForViewport,
} from "./rillieuxEvaporatorCamera";
import { createRillieuxEvaporatorModel } from "./rillieuxEvaporatorModel";

const COMPACT_AUDIT_VIEWPORT = { width: 286, height: 380 };

function projectedObjectBounds(root: THREE.Object3D, camera: THREE.PerspectiveCamera) {
  const bounds = {
    minX: Number.POSITIVE_INFINITY,
    maxX: Number.NEGATIVE_INFINITY,
    minY: Number.POSITIVE_INFINITY,
    maxY: Number.NEGATIVE_INFINITY,
  };
  const point = new THREE.Vector3();
  root.traverse((node) => {
    const positions = (node as THREE.Mesh).geometry?.getAttribute("position");
    if (!positions) return;
    for (let index = 0; index < positions.count; index += 1) {
      point.fromBufferAttribute(positions, index).applyMatrix4(node.matrixWorld).project(camera);
      bounds.minX = Math.min(bounds.minX, point.x);
      bounds.maxX = Math.max(bounds.maxX, point.x);
      bounds.minY = Math.min(bounds.minY, point.y);
      bounds.maxY = Math.max(bounds.maxY, point.y);
    }
  });
  return {
    ...bounds,
    widthPx: ((bounds.maxX - bounds.minX) * COMPACT_AUDIT_VIEWPORT.width) / 2,
  };
}

describe("Norbert Rillieux Multiple-Effect Evaporator 3D Visual & Thermodynamics Test Suite", () => {
  test("2D and 3D share the catalog physics bus for US 3,237", () => {
    const threeSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/RillieuxEvaporator3D.tsx"),
      "utf8",
    );
    const simSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/RillieuxEvaporatorSim.tsx"),
      "utf8",
    );
    expect(threeSource).toContain('usePatentPhysics("us-3237-rillieux-evaporator")');
    expect(simSource).toContain('usePatentPhysics("us-3237-rillieux-evaporator")');
    expect(threeSource).not.toContain("us-4879-rillieux-evaporator");
    expect(threeSource).not.toContain("US 4,879");
    expect(threeSource).toContain("juiceFeedRateKgPerH: p.juiceFeedRateKgPerH");
    expect(simSource).not.toContain("setJuiceFeedRateKgPerH");
    expect(threeSource).toContain("Modern SI teaching controls");
    expect(simSource).toContain("Modern SI teaching controls");
    const modelSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/rillieuxEvaporatorModel.ts"),
      "utf8",
    );
    expect(modelSource).not.toContain("const boilSpeed = 8.0");
    expect(modelSource).toContain("boilDisplayOmegaRadPerS");
  });

  test("keeps the studio animation loop alive after a visible frame", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/RillieuxEvaporator3D.tsx"),
      "utf8",
    );
    const loopStart = source.indexOf("const animate =");
    const loopEnd = source.indexOf("return () =>", loopStart);
    const loop = source.slice(loopStart, loopEnd);

    expect(loop).toMatch(
      /animFrameRef\.current = requestAnimationFrame\(animate\);\s*if \(!studio\.isVisible\(\)\) \{/,
    );
  });

  test("keeps all three effects and both vapor-reuse links legible in the compact overview", () => {
    const { width, height } = COMPACT_AUDIT_VIEWPORT;
    const compactOverview = rillieuxEvaporatorCameraForViewport("overview", width);
    expect(compactOverview).toEqual({
      label: "3-Effect Cascade Overview",
      pos: [0, 15.2, 30.8],
      target: [0, 2, 0],
    });
    expect(rillieuxEvaporatorCameraForViewport("overview", 718)).toEqual(
      RILLIEUX_EVAPORATOR_CAMERA_PRESETS.overview,
    );
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(...compactOverview.pos);
    camera.lookAt(...compactOverview.target);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();

    const model = createRillieuxEvaporatorModel();
    try {
      for (const [interaction, offsetSec] of [
        ["primary-control", 0],
        ["claim-inverted", 4],
      ] as const) {
        const envelope = {
          minX: Number.POSITIVE_INFINITY,
          maxX: Number.NEGATIVE_INFINITY,
          minY: Number.POSITIVE_INFINITY,
          maxY: Number.NEGATIVE_INFINITY,
        };
        for (const elapsedSec of [0, 2, 4]) {
          model.update(
            stepRillieuxEvaporator({
              juiceFeedRateKgPerH: 1000,
              initialBrixDeg: 14,
              targetBrixDeg: 65,
              numberOfEffects: 3,
            }),
            offsetSec + elapsedSec,
          );
          model.group.updateMatrixWorld(true);
          const projected = projectedObjectBounds(model.group, camera);
          envelope.minX = Math.min(envelope.minX, projected.minX);
          envelope.maxX = Math.max(envelope.maxX, projected.maxX);
          envelope.minY = Math.min(envelope.minY, projected.minY);
          envelope.maxY = Math.max(envelope.maxY, projected.maxY);
        }
        expect(envelope.minX, interaction).toBeGreaterThan(
          RILLIEUX_COMPACT_OVERVIEW_SAFE_ZONE.minX,
        );
        expect(envelope.maxX, interaction).toBeLessThan(RILLIEUX_COMPACT_OVERVIEW_SAFE_ZONE.maxX);
        expect(envelope.minY, interaction).toBeGreaterThan(
          RILLIEUX_COMPACT_OVERVIEW_SAFE_ZONE.minY,
        );
        expect(envelope.maxY, interaction).toBeLessThan(RILLIEUX_COMPACT_OVERVIEW_SAFE_ZONE.maxY);
        expect(
          Math.min(...model.vessels.map((vessel) => projectedObjectBounds(vessel, camera).widthPx)),
        ).toBeGreaterThan(RILLIEUX_COMPACT_OVERVIEW_SAFE_ZONE.minimumEffectWidthPx);
        expect(
          Math.min(
            ...model.vaporTrunks.map((trunk) => projectedObjectBounds(trunk, camera).widthPx),
          ),
        ).toBeGreaterThan(RILLIEUX_COMPACT_OVERVIEW_SAFE_ZONE.minimumVaporLinkWidthPx);
      }
    } finally {
      model.dispose();
    }
  });
  test("creates valid Three.js model hierarchy with 3 vessels, tube bundles, and condenser", () => {
    const model = createRillieuxEvaporatorModel();
    expect(model.group).toBeDefined();
    expect(model.vessels.length).toBe(3);
    expect(model.tubeBundles.length).toBe(3);
    expect(model.vaporTrunks.length).toBe(2);
    expect(model.condenserGroup).toBeDefined();
    expect(model.materials.length).toBeGreaterThan(5);
    expect(model.geometries.length).toBeGreaterThan(10);

    model.dispose();
  });

  test("physics step updates model without throwing across double, triple, and quadruple effects", () => {
    const model = createRillieuxEvaporatorModel();

    for (const n of [2, 3, 4]) {
      const state = stepRillieuxEvaporator({
        juiceFeedRateKgPerH: 12000,
        initialBrixDeg: 14,
        targetBrixDeg: 65,
        numberOfEffects: n,
      });
      expect(state.steamEconomyRatio).toBeGreaterThan(1.5);
      expect(state.fuelSavingsPct).toBeGreaterThan(50);
      expect(state.effects.length).toBe(n);
      expect(() => model.update(state, 0.5)).not.toThrow();
    }

    model.dispose();
  });

  test("calculates authentic chemical mass balance and cascading steam economy", () => {
    const state = stepRillieuxEvaporator({
      juiceFeedRateKgPerH: 10000,
      initialBrixDeg: 14,
      targetBrixDeg: 65,
      numberOfEffects: 3,
    });

    // Mass balance: Feed = Syrup + Evap
    expect(state.syrupOutputRateKgPerH + state.totalEvaporationKgPerH).toBeCloseTo(10000, 1);
    // Solute conservation: 10000 * 0.14 = Syrup * 0.65
    const solidsIn = 10000 * 0.14;
    const solidsOut = state.syrupOutputRateKgPerH * 0.65;
    expect(solidsOut).toBeCloseTo(solidsIn, 1);

    // Steam economy must exceed 2.5 in a triple effect
    expect(state.steamEconomyRatio).toBeGreaterThan(2.5);
    // Primary steam consumption must be less than half of total water evaporated
    expect(state.primarySteamConsumptionKgPerH).toBeLessThan(state.totalEvaporationKgPerH * 0.5);
    expect(state.boilDisplayOmegaRadPerS).toBeCloseTo(state.totalEvaporationKgPerH / 1000, 3);
    const halfFeed = stepRillieuxEvaporator({
      juiceFeedRateKgPerH: 5000,
      initialBrixDeg: 14,
      targetBrixDeg: 65,
      numberOfEffects: 3,
    });
    expect(halfFeed.boilDisplayOmegaRadPerS).toBeLessThan(state.boilDisplayOmegaRadPerS);
  });
});
