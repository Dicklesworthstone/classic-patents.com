import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepCorlissEngine } from "@/physics/catalogKernels";
import { buildCorlissEngineModel } from "./corlissSteamEngineModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 6,162 George Corliss Steam Engine visual & kinematics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "CorlissSteamEngine3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "corlissSteamEngineModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildCorlissEngineModel");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "CorlissSteamEngine3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "corlissSteamEngineModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and UI overlay for Corliss engine observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "CorlissSteamEngine3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "wrist_plate", "dashpots", "flywheel", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("Corliss Steam Engine 3D");
  });

  test("computes genuine Corliss variable cutoff expansion work in SI units", () => {
    const result = stepCorlissEngine({ steamPressurePsi: 100, engineRpm: 65, cutoffPct: 25 });
    expect(result.indicatedHp).toBeGreaterThan(50);
    expect(result.thermalEfficiencyPct).toBeGreaterThan(15);
    expect(result.crankOmegaRadPerS).toBeCloseTo((65 * 2 * Math.PI) / 60, 2);
  });

  test("builds and articulates procedural wrist plate, 4 rotary valves, dashpots, and governor correctly", () => {
    const { rootGroup, wristPlate, valveLevers, dashpotRods, governorBalls, materials, dispose } =
      buildCorlissEngineModel();

    expect(rootGroup.children.length).toBeGreaterThan(4);
    expect(wristPlate).toBeDefined();
    expect(valveLevers.length).toBe(4);
    expect(dashpotRods.length).toBe(2);
    expect(governorBalls.length).toBe(2);
    expect(materials.mahogany).toBeDefined();
    expect(materials.castIron).toBeDefined();

    dispose();
  });
});
