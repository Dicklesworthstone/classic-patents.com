import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { linotypeCameraForViewport } from "./mergenthalerLinotypeCamera";
import {
  buildMergenthalerMatrixBarModel,
  updateMergenthalerMatrixBarModel,
} from "./mergenthalerMatrixBarModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 313,224 Mergenthaler matrix-bar visual and source boundary", () => {
  test("keeps the whole matrix-bar machine readable while retaining close-up cameras", () => {
    const desktop = linotypeCameraForViewport("iso", 1280);
    const tablet = linotypeCameraForViewport("iso", 768);
    const phone = linotypeCameraForViewport("iso", 390);

    expect(desktop).toEqual({ pos: [9.2, 7.1, 10.5], target: [0, 0.8, 0] });
    expect(tablet).toEqual({ pos: [9.2, 6.7, 10.6], target: [0, 1, 0] });
    expect(phone).toEqual({ pos: [10, 7.2, 11.5], target: [0, 1, 0] });
    expect(linotypeCameraForViewport("casting_pot", 390)).toEqual({
      pos: [-2.8, 0.5, 3.5],
      target: [-1.5, -0.4, 0],
    });

    const { rootGroup, dispose } = buildMergenthalerMatrixBarModel();
    try {
      rootGroup.updateMatrixWorld(true);
      const bounds = new THREE.Box3().setFromObject(rootGroup);
      const camera = new THREE.PerspectiveCamera(42, 1214 / 460, 0.1, 1000);
      camera.position.fromArray(desktop.pos);
      camera.lookAt(...desktop.target);
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld(true);

      const projected = [
        ...[bounds.min.x, bounds.max.x].flatMap((x) =>
          [bounds.min.y, bounds.max.y].flatMap((y) =>
            [bounds.min.z, bounds.max.z].map((z) => new THREE.Vector3(x, y, z).project(camera)),
          ),
        ),
      ];
      expect(Math.min(...projected.map((point) => point.x))).toBeGreaterThanOrEqual(-0.25);
      expect(Math.max(...projected.map((point) => point.x))).toBeLessThanOrEqual(0.26);
      expect(Math.min(...projected.map((point) => point.y))).toBeGreaterThanOrEqual(-0.85);
      expect(Math.max(...projected.map((point) => point.y))).toBeLessThanOrEqual(0.8);
    } finally {
      dispose();
    }
  });

  test("uses a source-bounded procedural model instead of the later commercial Linotype", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "MergenthalerLinotype3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "mergenthalerMatrixBarModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(threeSource).toContain("buildMergenthalerMatrixBarModel");
    expect(modelSource).toContain("ParallelContinuousMatrixBars");
    expect(modelSource).toContain("FingerKeyAndAdjustingPinDeck");
    expect(modelSource).toContain("SectionalMoldAndForcePump");
    for (const forbidden of ["90-Key", "binary distributor", "eutectic", "water-cooled"]) {
      expect(modelSource).not.toContain(forbidden);
    }
    expect(threeSource).toContain("typed refusal — no SI data");
    expect(threeSource).not.toContain("useGenericWasmSource");
    expect(threeSource).not.toContain("PortHamiltonianEnergyStrip");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "MergenthalerLinotype3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "mergenthalerMatrixBarModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes camera presets and cutaway mode for source-organ observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "MergenthalerLinotype3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "matrix_magazine",
      "casting_pot",
      "spaceband_justifier",
      "keyboard",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Mergenthaler US 313,224 matrix-bar machine 3D");
  });

  test("builds supported bars, stops, clamp, and sectional mold", () => {
    const { rootGroup, nodes, materials, dispose } = buildMergenthalerMatrixBarModel();
    expect(rootGroup.children.length).toBeGreaterThan(4);
    expect(nodes.continuousBars).toHaveLength(8);
    expect(nodes.stopPins).toHaveLength(8);
    expect(nodes.clampGroup.parent).toBe(nodes.matrixBarGroup);
    expect(nodes.moldUpper.parent).toBe(nodes.moldGroup);
    expect(nodes.moldLower.parent).toBe(nodes.moldGroup);

    updateMergenthalerMatrixBarModel(nodes, materials, {
      cycle01: 0.6,
      stopTravelDisplay: 12,
      moldClosurePct: 100,
      claim1Active: true,
      cutaway: false,
    });
    expect(nodes.continuousBars.every((bar) => bar.visible)).toBe(true);
    expect(nodes.excludedBandGroup.visible).toBe(false);
    expect(nodes.slug.visible).toBe(true);
    expect(nodes.moldUpper.position.y).toBeCloseTo(0.34, 6);
    expect(nodes.moldLower.position.y).toBeCloseTo(-0.34, 6);

    dispose();
  });

  test("makes Claim 1 inversion a visible, supported excluded-alternative comparison", () => {
    const { nodes, materials, dispose } = buildMergenthalerMatrixBarModel();

    updateMergenthalerMatrixBarModel(nodes, materials, {
      cycle01: 0.75,
      stopTravelDisplay: 8,
      moldClosurePct: 100,
      claim1Active: false,
      cutaway: true,
    });

    expect(nodes.continuousBars.every((bar) => !bar.visible)).toBe(true);
    expect(nodes.excludedBandGroup.visible).toBe(true);
    expect(nodes.excludedBandGroup.parent).toBe(nodes.matrixBarGroup);
    expect(nodes.slug.visible).toBe(false);
    expect(materials.castIron.transparent).toBe(true);
    expect(materials.castIron.opacity).toBeCloseTo(0.42, 6);

    dispose();
  });
});
