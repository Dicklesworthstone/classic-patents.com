import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepNoyceIC } from "@/physics/catalogKernels";
import { buildNoycePlanarICModel, updateNoycePlanarIcKinematics } from "./noycePlanarICModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 2,981,877 Robert N. Noyce Monolithic Planar IC visual & microelectronics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "NoycePlanarIC3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "noycePlanarICModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildNoycePlanarIcModel");
    expect(modelSource).toContain("updateNoycePlanarIcKinematics");
    expect(modelSource).toContain("signalDisplaySpeed");
    expect(modelSource).not.toContain("* 0.45 * dt");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "NoycePlanarIC3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "noycePlanarIcModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for IC inspection", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "NoycePlanarIC3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "metallization_layer",
      "oxide_dielectric",
      "pn_junctions",
      "leadframe",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Noyce Monolithic Planar IC 3D");
  });

  test("computes genuine junction capacitance, oxide thickness, propagation delay, and max clock in SI units", () => {
    const result = stepNoyceIC({
      reverseBias: 5,
      oxideThickness: 0.5,
      clockFrequencyMhz: 10,
    });
    expect(result.oxideThicknessNm).toBeCloseTo(500, 1);
    expect(result.junctionCapPfPerMm2).toBeGreaterThan(0);
    expect(result.maxClockGhz).toBeGreaterThan(0.1);
    expect(result.signalDisplaySpeed).toBeCloseTo(4.5, 3);
    expect(result.toneHz).toBeCloseTo(350, 1);
  });

  test("builds and articulates procedural ceramic package, gold leads, silicon substrate, 9 diffused wells, oxide layer, and metal interconnects correctly", () => {
    const { rootGroup, nodes, materials, dispose } = buildNoycePlanarICModel();
    expect(rootGroup.children.length).toBeGreaterThan(0);
    expect(nodes.ceramicBase).toBeDefined();
    expect(nodes.leads.length).toBe(14);
    expect(nodes.substrateMesh).toBeDefined();
    expect(nodes.nWellsGroup.children.length).toBe(9);
    expect(nodes.oxideLayer).toBeDefined();
    expect(nodes.metalGroup.children.length).toBeGreaterThan(3);
    expect(nodes.signalPoints).toBeDefined();

    const ic = stepNoyceIC({ reverseBias: 5, oxideThickness: 0.5, clockFrequencyMhz: 10 });
    updateNoycePlanarIcKinematics(nodes, materials, 0.016, 0.5, ic.signalDisplaySpeed, true, true);
    expect(materials.siliconDioxide.transparent).toBe(true);
    expect(nodes.signalPoints.visible).toBe(true);

    dispose();
  });
});
