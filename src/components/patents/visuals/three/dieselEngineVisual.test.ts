import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FrankenSimEngine } from "@/physics/engine";
import { buildDieselEngineModel, updateDieselEngineKinematics } from "./dieselEngineModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 542,846 Rudolf Diesel Engine visual & thermodynamics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "DieselEngine3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "dieselEngineModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildDieselEngineModel");
    expect(modelSource).toContain("updateDieselEngineKinematics");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "DieselEngine3D.tsx"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for internal thermodynamic observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "DieselEngine3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "cylinder", "injector", "crosshead", "compressor", "flywheel"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("cutawayMode");
    expect(threeSource).toContain("Cutaway Active");
  });

  test("computes genuine Diesel adiabatic cycle thermodynamics in reproducible SI units", () => {
    const result = FrankenSimEngine.stepDieselEngine({
      compressionRatio: 18,
      blastAirPressureBar: 65,
      cutoffRatio: 1.6,
    });

    expect(result.pCompBar).toBeGreaterThan(40);
    expect(result.tCompressionC).toBeGreaterThan(500);
    expect(result.isAutoIgnition).toBe(true);
    expect(result.brakeEfficiencyPct).toBeGreaterThan(25);
    expect(result.governorBallSpread).toBeCloseTo(0.85, 3);
    expect(result.pressureNeedleRadPerBar).toBeCloseTo((Math.PI * 1.4) / 80, 4);
    expect(result.pistonStrokePx).toBe(35);
    expect(result.cycleWrapDeg).toBe(720);
    expect(result.injectionStartDeg).toBe(355);
    expect(result.compressionGlowStartDeg).toBe(270);
    expect(result.compressionGlowEndDeg).toBe(450);
    expect(result.crankCy).toBe(260);
    expect(result.schematicFlywheelR).toBe(40);
    expect(result.schematicCylinderW).toBe(140);
    expect(result.schematicInjectorW).toBe(30);
    expect(result.schematicPistonH).toBe(55);
  });

  test("builds and articulates procedural kinematic hierarchy correctly", () => {
    const { root, nodes, materials } = buildDieselEngineModel();
    expect(root.children.length).toBeGreaterThan(5);

    // Initial pose at crankAngle = 0
    const diesel = FrankenSimEngine.stepDieselEngine({
      compressionRatio: 18,
      blastAirPressureBar: 65,
      cutoffRatio: 1.6,
      engineRpm: 150,
    });
    updateDieselEngineKinematics(
      nodes,
      materials,
      0,
      18,
      true,
      true,
      diesel.governorBallSpread,
      diesel.pressureNeedleRadPerBar,
    );
    const initialPistonY = nodes.pistonGroup.position.y;

    // TDC pose at crankAngle = PI
    updateDieselEngineKinematics(
      nodes,
      materials,
      Math.PI,
      18,
      true,
      true,
      diesel.governorBallSpread,
      diesel.pressureNeedleRadPerBar,
    );
    const tdcPistonY = nodes.pistonGroup.position.y;

    expect(tdcPistonY).not.toBe(initialPistonY);
    expect(nodes.cylinderCutawayMesh.visible).toBe(true);
    expect(nodes.cylinderJacketMesh.visible).toBe(false);
  });
});
