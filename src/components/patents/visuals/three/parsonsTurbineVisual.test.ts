import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepParsonsTurbine } from "@/physics/catalogKernels";
import { buildParsonsTurbineModel, updateParsonsTurbineKinematics } from "./parsonsTurbineModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 608,969 Sir Charles Parsons Steam Turbine visual & thermodynamics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "ParsonsTurbine3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "parsonsTurbineModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildParsonsTurbineModel");
    expect(modelSource).toContain("updateParsonsTurbineKinematics");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "ParsonsTurbine3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "parsonsTurbineModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for turbine observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "ParsonsTurbine3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "turbine_stages",
      "rotor_blades",
      "governor",
      "bearing_pedestal",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Parsons Steam Turbine 3D");
  });

  test("computes genuine steam enthalpy expansion and shaft power in SI units", () => {
    const result = stepParsonsTurbine({
      rotorRpm: 3000,
      inletPressurePsi: 180,
    });
    expect(result.shaftPowerKw).toBeGreaterThan(100);
    expect(result.enthalpyKjKg).toBeGreaterThan(300);
    expect(result.stageCount).toBe(48);
    expect(result.inletMpa).toBeGreaterThan(1.0);
    expect(result.bladeSpeedMps).toBeGreaterThan(40);
    expect(result.steamAdvancePerS).toBeCloseTo(12, 3);
    expect(result.steamOpacity).toBeGreaterThan(0.2);
    expect(result.steamSwirlOmegaRadPerS).toBeCloseTo(result.displayOmegaRadPerS * 0.5, 3);
  });

  test("builds and articulates procedural casing, rotor stages, dummy piston, and steam streamline flow correctly", () => {
    const { rootGroup, nodes, materials, dispose } = buildParsonsTurbineModel();
    expect(rootGroup.children.length).toBeGreaterThan(2);
    expect(nodes.casingShells.length).toBe(3);
    expect(nodes.dummyPiston).toBeDefined();
    expect(nodes.steamPositions.length).toBe(300 * 3);

    const parsons = stepParsonsTurbine({ rotorRpm: 3000, inletPressurePsi: 180 });
    updateParsonsTurbineKinematics(
      nodes,
      materials,
      0.016,
      0.5,
      parsons.displayOmegaRadPerS,
      parsons.steamAdvancePerS,
      parsons.steamOpacity,
      parsons.steamSwirlOmegaRadPerS ?? 0.8,
      true,
      true,
    );
    expect(materials.castIronCasing.transparent).toBe(true);

    dispose();
  });
});
