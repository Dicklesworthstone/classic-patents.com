import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepHyattCelluloid } from "@/physics/catalogKernels";
import { buildHyattCelluloidModel, updateHyattCelluloidKinematics } from "./hyattCelluloidModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 105,338 John Wesley Hyatt Camphor-Pyroxyline Celluloid visual & polymer mechanics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "HyattCelluloid3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "hyattCelluloidModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildHyattCelluloidModel");
    expect(modelSource).toContain("updateHyattCelluloidKinematics");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "HyattCelluloid3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "hyattCelluloidModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for celluloid press inspection", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "HyattCelluloid3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "hydraulic_ram",
      "steam_jacket",
      "nozzle_die",
      "billiard_balls",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Hyatt Celluloid Press 3D");
  });

  test("computes genuine melt viscosity, consolidation density, and extrusion rate in SI units", () => {
    const result = stepHyattCelluloid({
      steamTempC: 95,
      hydraulicPressureMpa: 10,
    });
    expect(result.viscosityPaS).toBeGreaterThan(100);
    expect(result.consolidationDensityGPerCm3).toBeGreaterThan(1.2);
    expect(result.transparencyPct).toBeGreaterThan(50);
    expect(result.isMelted).toBe(true);
    expect(result.extrusionRateCmPerMin).toBeGreaterThan(5);
  });

  test("builds and articulates procedural bedplate, steam jacket, ram piston, extrusion nozzle, and billiard balls correctly", () => {
    const { rootGroup, nodes, materials, dispose } = buildHyattCelluloidModel();
    expect(rootGroup.children.length).toBeGreaterThan(0);
    expect(nodes.bedplate).toBeDefined();
    expect(nodes.jacket).toBeDefined();
    expect(nodes.ramPiston).toBeDefined();
    expect(nodes.rodMesh).toBeDefined();
    expect(nodes.billiardBalls.length).toBe(2);

    updateHyattCelluloidKinematics(nodes, materials, 0.016, 0.5, 95, 850, true, 0.75, 0.42, true);
    expect(materials.castIron.transparent).toBe(true);
    expect(nodes.rodMesh.visible).toBe(true);

    dispose();
  });
});
