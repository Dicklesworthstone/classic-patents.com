import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FrankenSimEngine } from "@/physics/engine";
import { buildGoodyearRubberModel, updateGoodyearRubberKinematics } from "./goodyearRubberModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 3,633 Charles Goodyear Vulcanized Rubber visual & polymer mechanics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "GoodyearRubber3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "goodyearRubberModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildGoodyearRubberModel");
    expect(modelSource).toContain("updateGoodyearRubberKinematics");
    expect(modelSource).not.toContain("stepGoodyearRubber()");
    expect(threeSource).toContain("p.vulcanizationTempC");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "GoodyearRubber3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "goodyearRubberModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for polymer network observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "GoodyearRubber3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "chains", "bridges", "clamps", "stress_vectors", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Vulcanized Rubber 3D");
  });

  test("computes genuine vulcanization tensile strength, crosslink density, and elastic return in SI units", () => {
    const result = FrankenSimEngine.stepGoodyearRubber(145, 8, 30, 1.8, 35);
    expect(result.tensileStrengthPsi).toBeGreaterThan(1500);
    expect(result.crossLinkDensity).toBeGreaterThan(1e-5);
    expect(result.elasticReturnPct).toBeGreaterThan(70);
    expect(result.isStickyOrBrittle).toBe(false);
    expect(result.stressScale).toBeGreaterThan(0.3);
    expect(result.clampStudioX).toBeCloseTo(8.1, 3);
    expect(result.chainStretchPx).toBeCloseTo(64, 2);
    expect(result.thermalWobbleOmega).toBe(4);
    expect(result.gaugeNeedleRadPerStretch).toBeCloseTo(Math.PI * 1.5, 5);
  });

  test("builds and articulates procedural grip clamps, 6 polyisoprene chains, and 14 sulfur crosslink bridges correctly", () => {
    const { rootGroup, nodes, materials, dispose } = buildGoodyearRubberModel();
    expect(rootGroup.children.length).toBeGreaterThan(2);
    expect(nodes.chains.length).toBe(6);
    expect(nodes.bridgeItems.length).toBe(14);
    expect(nodes.leftArrow).toBeDefined();
    expect(nodes.rightArrow).toBeDefined();

    const rubber = FrankenSimEngine.stepGoodyearRubber(145, 8, 30, 1.8, 35);
    updateGoodyearRubberKinematics(
      nodes,
      materials,
      0.016,
      0.5,
      1.8,
      rubber.clampStudioX,
      rubber.stressScale,
      rubber.thermalAmplitude,
      true,
      true,
      true,
      true,
      145,
      8,
      35,
    );
    expect(materials.polyisoprene.transparent).toBe(true);

    dispose();
  });
});
