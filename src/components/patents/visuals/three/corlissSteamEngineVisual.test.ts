import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepCorlissEngine } from "@/physics/catalogKernels";
import { buildCorlissEngineModel, updateCorlissEngineKinematics } from "./corlissSteamEngineModel";

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
    expect(modelSource).toContain("updateCorlissEngineKinematics");
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

    for (const preset of ["iso", "wrist_plate", "dashpots", "flywheel", "governor", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Corliss Steam Engine 3D");
  });

  test("computes genuine Corliss variable cutoff expansion work in SI units", () => {
    const result = stepCorlissEngine({ steamPressurePsi: 100, engineRpm: 65, cutoffPct: 25 });
    expect(result.indicatedHp).toBeGreaterThan(50);
    expect(result.thermalEfficiencyPct).toBeGreaterThan(15);
    expect(result.crankOmegaRadPerS).toBeCloseTo((65 * 2 * Math.PI) / 60, 2);
    expect(result.govSpread).toBeCloseTo(0.5125, 3);
    expect(result.wristAmp).toBeCloseTo(0.2675, 3);
    expect(result.pistonStrokePx).toBe(45);
    expect(result.wristPlateAmpPx).toBe(22);
    expect(result.intakeOpenWindowDeg).toBeCloseTo(45, 2);
    expect(result.flywheelSvgR).toBe(85);
    expect(result.spokeCount).toBe(6);
    expect(result.spokePitchDeg).toBe(60);
  });

  test("builds and articulates procedural wrist plate, 4 rotary valves, dashpots, and governor correctly", () => {
    const model = buildCorlissEngineModel();

    expect(model.rootGroup.children.length).toBeGreaterThan(4);
    expect(model.wristPlate).toBeDefined();
    expect(model.valveLevers.length).toBe(4);
    expect(model.dashpotRods.length).toBe(2);
    expect(model.governorBalls.length).toBe(2);
    expect(model.materials.mahogany).toBeDefined();
    expect(model.materials.castIron).toBeDefined();

    const corliss = stepCorlissEngine({ steamPressurePsi: 100, engineRpm: 65, cutoffPct: 25 });
    const { strokeX, wristAngle } = updateCorlissEngineKinematics(
      model,
      Math.PI / 4,
      corliss.govSpread,
      corliss.wristAmp,
      true,
    );

    expect(strokeX).toBeDefined();
    expect(wristAngle).toBeDefined();
    expect(model.materials.mahogany.opacity).toBe(0.35);

    model.dispose();
  });
});
