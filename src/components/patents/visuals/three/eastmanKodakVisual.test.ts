import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FrankenSimEngine } from "@/physics/engine";
import { buildEastmanKodakModel, updateEastmanKodakKinematics } from "./eastmanKodakModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 388,850 George Eastman Roll-Film Box Camera visual & optics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "EastmanKodak3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "eastmanKodakModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildEastmanKodakModel");
    expect(modelSource).toContain("updateEastmanKodakKinematics");
    expect(modelSource).toContain("eastmanSprocketCrate");
    expect(modelSource).not.toContain("0.4 + Math.abs(filmAdvanceSpeedRadPerS)");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "EastmanKodak3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "eastmanKodakModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for camera observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "EastmanKodak3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "roll_film",
      "barrel_shutter",
      "lens_aperture",
      "winding_key",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Eastman Kodak Camera 3D");
  });

  test("computes genuine optical hyperfocal distance and exposure value in SI units", () => {
    const result = FrankenSimEngine.stepEastmanKodak({
      shutterSpeedSec: 0.05,
      apertureFNumber: 9,
      subjectDistanceM: 3,
    });
    expect(result.hyperfocalM).toBeGreaterThan(10);
    expect(result.exposureValueEv).toBeGreaterThan(5);
    expect(result.rollCapacity).toBe(100);
    expect(result.filmFormatInches).toBe(2.5);
    expect(result.filmAdvanceSpeedRadPerS).toBeCloseTo(0.8, 5);
    expect(result.supplySpoolOmegaRadPerS).toBeCloseTo(0.64, 5);
    expect(result.schematicSpoolR).toBe(22);
    expect(result.schematicShutterR).toBe(20);
    expect(result.schematicBodyW).toBe(240);
    expect(result.schematicFinderW).toBe(20);
  });

  test("builds and articulates procedural leather box, film spools, and brass shutter correctly", () => {
    const { rootGroup, nodes, materials, dispose } = buildEastmanKodakModel();
    expect(rootGroup.children.length).toBeGreaterThan(3);
    expect(nodes.boxBody).toBeDefined();
    expect(nodes.supplySpool).toBeDefined();
    expect(nodes.takeupSpool).toBeDefined();
    expect(nodes.barrel).toBeDefined();

    const kodak = FrankenSimEngine.stepEastmanKodak({
      shutterSpeedSec: 0.05,
      apertureFNumber: 9,
      subjectDistanceM: 3,
    });
    updateEastmanKodakKinematics(
      nodes,
      materials,
      0.016,
      0.5,
      kodak.barrelOmegaRadPerS,
      true,
      kodak.filmAdvanceSpeedRadPerS,
      kodak.supplySpoolOmegaRadPerS,
    );
    expect(materials.moroccoLeather.transparent).toBe(true);

    dispose();
  });
});
