import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepNobelDynamite } from "@/physics/catalogKernels";
import { buildNobelDynamiteModel, updateNobelDynamiteKinematics } from "./nobelDynamiteModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 78,317 Alfred Nobel Porous-Earth Explosive Dynamite visual & detonation boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "NobelDynamite3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "nobelDynamiteModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildNobelDynamiteModel");
    expect(modelSource).toContain("updateNobelDynamiteKinematics");
    expect(modelSource).not.toContain("stepNobelDynamite({})");
    expect(threeSource).toContain("p.ngPercentage");
    expect(threeSource).toContain("p.capEnergyJoules");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "NobelDynamite3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "nobelDynamiteModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for explosive compound observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "NobelDynamite3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "blasting_cap",
      "matrix_cutaway",
      "fuse",
      "detonation_wave",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Nobel Dynamite 3D");
  });

  test("computes genuine detonation velocity, blast overpressure, and energy in SI units", () => {
    const result = stepNobelDynamite({
      ngConcentrationPct: 75,
      capEnergyJoules: 1.2,
    });
    expect(result.detonationVelocityMps).toBeGreaterThan(6000);
    expect(result.blastOverpressureMpa).toBeGreaterThan(5000);
    expect(result.energyMjPerKg).toBeGreaterThan(4.0);
    expect(result.capEnergyJoules).toBe(1.2);
    expect(result.isInitiated).toBe(true);
    expect(result.kieselguhrCount).toBe(24);
    expect(result.kieselguhrPitch).toBe(32);
    expect(result.shockwaveGlow).toBeCloseTo(1 + (result.detonationVelocityMps / 6000) * 1.5, 2);
    expect(result.stickDisplayOmegaRadPerS).toBeCloseTo(0.2, 5);
  });

  test("builds and articulates procedural wax paper shell, kieselguhr core, diatom grains, and detonator cap correctly", () => {
    const { rootGroup, nodes, materials, dispose } = buildNobelDynamiteModel();
    expect(rootGroup.children.length).toBeGreaterThan(0);
    expect(nodes.paperShell).toBeDefined();
    expect(nodes.kieselguhrCore).toBeDefined();
    expect(nodes.copperCasing).toBeDefined();
    expect(nodes.fuseMesh).toBeDefined();
    expect(nodes.grainInst.count).toBe(35);

    const nobel = stepNobelDynamite({ ngConcentrationPct: 75, capEnergyJoules: 1.2 });
    updateNobelDynamiteKinematics(
      nodes,
      materials,
      0.016,
      0.5,
      true,
      nobel.shockwaveGlow,
      nobel.stickDisplayOmegaRadPerS,
      true,
    );
    expect(materials.waxPaper.transparent).toBe(true);
    expect(nodes.shockwaveMesh.visible).toBe(true);

    dispose();
  });
});
