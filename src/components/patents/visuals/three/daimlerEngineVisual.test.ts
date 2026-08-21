import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FrankenSimEngine } from "@/physics/engine";
import {
  buildDaimlerMarineEngineModel,
  updateDaimlerMarineEngineKinematics,
} from "./daimlerEngineModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 361,931 Gottlieb Daimler Boat Propulsion Engine visual & kinematics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "DaimlerEngine3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "daimlerEngineModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildDaimlerMarineEngineModel");
    expect(modelSource).toContain("updateDaimlerMarineEngineKinematics");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "DaimlerEngine3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "daimlerEngineModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and UI overlay for marine engine observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "DaimlerEngine3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "motor", "coupling", "reverse", "cooling", "reservoirs"]) {
      expect(threeSource).toContain(preset);
    }
  });

  test("computes genuine marine engine shaft and hot-tube mechanics in SI units", () => {
    const result = FrankenSimEngine.stepDaimlerEngine({
      engineRpm: 750,
      hotTubeTempC: 850,
      differentialSlipAngleDeg: 15,
    });
    expect(result.brakeHorsepower).toBeGreaterThan(0.5);
    expect(result.bmepBar).toBeGreaterThan(2.0);
    expect(result.isRunning).toBe(true);
    expect(result.hotTubeGlow).toBeCloseTo(2.8, 3);
    expect(result.pistonStrokePx).toBe(30);
  });

  test("builds and articulates procedural in-line motor, reversing disks, and cooling jacket correctly", () => {
    const model = buildDaimlerMarineEngineModel();

    expect(model.rootGroup.children.length).toBeGreaterThan(4);
    expect(model.motorGroup).toBeDefined();
    expect(model.propellerShaftGroup).toBeDefined();
    expect(model.couplingGroup).toBeDefined();
    expect(model.reverseGroup).toBeDefined();
    expect(model.thrustGroup).toBeDefined();
    expect(model.coolingGroup).toBeDefined();
    expect(model.reservoirGroup).toBeDefined();

    // Ahead engagement
    updateDaimlerMarineEngineKinematics(model, 1.0, 1.0);
    expect(model.propellerShaftGroup.position.x).toBeCloseTo(0.35, 2);
    expect(model.thrustGroup.scale.x).toBeCloseTo(1.0, 2);

    // Astern engagement
    updateDaimlerMarineEngineKinematics(model, -1.0, 0.0);
    expect(model.propellerShaftGroup.position.x).toBeCloseTo(-0.35, 2);
    expect(model.reverseGroup.scale.y).toBeCloseTo(1.0, 2);
    expect(model.coolingGroup.scale.x).toBeCloseTo(0.82, 2);

    model.dispose();
  });
});
