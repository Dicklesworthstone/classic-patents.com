import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepOttoEngine } from "@/physics/catalogKernels";
import { buildOttoEngineModel, updateOttoEngineKinematics } from "./ottoEngineModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 194,047 Nikolaus Otto Four-Stroke Engine visual & kinematics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "OttoEngine3D.tsx"), "utf8");
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "ottoEngineModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildOttoEngineModel");
    expect(modelSource).toContain("updateOttoEngineKinematics");
    expect(modelSource).toContain("stepOttoEngine({ engineRpm, compressionRatio })");
    expect(modelSource).not.toContain("stepOttoEngine({})");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "OttoEngine3D.tsx"), "utf8");

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for internal 4-stroke observation", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "OttoEngine3D.tsx"), "utf8");

    for (const preset of [
      "iso",
      "slide_valve",
      "cylinder_piston",
      "lay_shaft",
      "governor",
      "flywheels",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("cutawayMode");
    expect(threeSource).toContain("2:1 Lay Shaft");
  });

  test("computes genuine Otto thermodynamic air-standard cycle in reproducible SI units", () => {
    const otto = stepOttoEngine({
      engineRpm: 180,
      compressionRatio: 4.5,
    });

    expect(otto.brakeHorsepower).toBeGreaterThan(2);
    expect(otto.thermalEfficiencyPct).toBeGreaterThan(25);
    expect(otto.peakCompressionBar).toBeGreaterThan(4);
    expect(otto.peakFiringBar).toBeGreaterThan(15);
    expect(otto.govDisplayOmegaRadPerS).toBeCloseTo(9, 3);
    expect(otto.flyballRadius).toBeCloseTo(0.264, 3);
    expect(otto.pistonStrokePx).toBe(35);
    expect(otto.flywheelSvgR).toBe(80);
    expect(otto.spokeCount).toBe(6);
    expect(otto.spokePitchDeg).toBe(60);
    expect(otto.slideStroke).toBe(0.22);
    expect(otto.exhaustLiftAmp).toBe(0.12);
    expect(otto.sleeveHomeY).toBe(0.35);
    expect(otto.cylinderTdcX).toBe(-3.25);
    expect(otto.combustionLengthRef).toBe(1.8);
    expect(otto.expansionFade).toBe(0.7);

    const twoDSource = readFileSync(join(VISUALS_DIRECTORY, "OttoEngineSim.tsx"), "utf8");
    expect(twoDSource).toContain("otto.flywheelSvgR");
    expect(twoDSource).toContain("otto.spokePitchDeg");
    expect(twoDSource).not.toContain("* 80");
    expect(twoDSource).not.toContain("i * 60");
  });

  test("builds and articulates procedural 4-stroke kinematic hierarchy correctly", () => {
    const { root, nodes, materials } = buildOttoEngineModel();
    expect(root.children.length).toBeGreaterThan(5);

    // Initial pose at crankAngle = 0 (BDC)
    const otto = stepOttoEngine({ engineRpm: 180, compressionRatio: 4.5 });
    updateOttoEngineKinematics(
      nodes,
      materials,
      0,
      4.5,
      true,
      true,
      1 / 60,
      otto.govDisplayOmegaRadPerS,
      otto.flyballRadius,
    );
    const bdcPistonX = nodes.pistonGroup.position.x;

    // TDC pose at crankAngle = PI
    updateOttoEngineKinematics(
      nodes,
      materials,
      Math.PI,
      4.5,
      true,
      true,
      1 / 60,
      otto.govDisplayOmegaRadPerS,
      otto.flyballRadius,
    );
    const tdcPistonX = nodes.pistonGroup.position.x;

    expect(tdcPistonX).toBeLessThan(bdcPistonX); // Piston moves toward head (-X) at TDC
    expect(nodes.cylinderCutawayMesh.visible).toBe(true);
    expect(nodes.cylinderJacketMesh.visible).toBe(false);
  });
});
