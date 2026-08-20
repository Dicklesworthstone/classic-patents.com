import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepGliddenBarbedWire } from "@/physics/catalogKernels";
import {
  buildGliddenBarbedWireModel,
  updateGliddenBarbedWireKinematics,
} from "./gliddenBarbedWireModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 157,124 Joseph Glidden Twisted Wire Barbed Fence visual & kinematics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "GliddenBarbedWire3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "gliddenBarbedWireModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildGliddenBarbedWireModel");
    expect(modelSource).toContain("updateGliddenBarbedWireKinematics");
    expect(modelSource).toContain("gliddenFlyerCrate");
    expect(modelSource).not.toContain("0.4 + Math.abs(flyerOmegaRadPerS)");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "GliddenBarbedWire3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "gliddenBarbedWireModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for barbed wire machine inspection", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "GliddenBarbedWire3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "barb_lock",
      "twisting_helix",
      "takeup_drum",
      "feed_spools",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Glidden Barbed Wire Machine 3D");
  });

  test("computes genuine catenary sag, barb slip threshold, and locked state in SI units", () => {
    const result = stepGliddenBarbedWire({
      wireTensionN: 650,
      twistsPerFoot: 5,
      animalPushForceN: 120,
      barbSpacingInches: 5.0,
    });
    expect(result.sagCm).toBeGreaterThan(0);
    expect(result.barbSlipThresholdN).toBeGreaterThan(50);
    expect(result.isLocked).toBe(true);
    expect(result.tensileStrengthLbs).toBeGreaterThan(500);
    expect(result.twistWaveAmpPx).toBeCloseTo(10, 2);
  });

  test("builds and articulates procedural bench, flyer arbor, twisted wire strands, coiled barbs, and take-up reel correctly", () => {
    const { rootGroup, nodes, materials, dispose } = buildGliddenBarbedWireModel();
    expect(rootGroup.children.length).toBeGreaterThan(0);
    expect(nodes.bench).toBeDefined();
    expect(nodes.flyerGroup).toBeDefined();
    expect(nodes.strand1Mesh).toBeDefined();
    expect(nodes.strand2Mesh).toBeDefined();
    expect(nodes.barbGroups.length).toBe(5);
    expect(nodes.reelGroup).toBeDefined();

    updateGliddenBarbedWireKinematics(nodes, materials, 0.016, 0.5, 31.4, 6.28, true, true);
    expect(materials.castIron.transparent).toBe(true);
    expect(materials.walnutWood.opacity).toBe(0.45);

    dispose();
  });
});
