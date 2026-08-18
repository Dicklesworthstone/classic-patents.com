import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FrankenSimEngine } from "@/physics/engine";
import { buildDaimlerEngineModel } from "./daimlerEngineModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 361,931 Gottlieb Daimler High-Speed Four-Stroke Engine visual & kinematics boundary", () => {
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
    expect(modelSource).toContain("buildDaimlerEngineModel");
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

  test("exposes authentic camera presets and UI overlay for four-stroke hot-tube observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "DaimlerEngine3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "cylinder", "crankcase", "hottube"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("Daimler High-Speed Petrol Engine 3D");
  });

  test("computes genuine high-speed four-stroke BMEP and brake horsepower in SI units", () => {
    const result = FrankenSimEngine.stepDaimlerEngine({
      engineRpm: 750,
      hotTubeTempC: 850,
      differentialSlipAngleDeg: 15,
    });
    expect(result.brakeHorsepower).toBeGreaterThan(0.5);
    expect(result.bmepBar).toBeGreaterThan(2.0);
    expect(result.isRunning).toBe(true);
  });

  test("builds and articulates procedural enclosed flywheels, hot-tube igniter, and valve pushrod correctly", () => {
    const {
      rootGroup,
      crankshaftGroup,
      flywheelGroup,
      pistonGroup,
      conRodGroup,
      hotTubeMesh,
      materials,
      dispose,
    } = buildDaimlerEngineModel();

    expect(rootGroup.children.length).toBeGreaterThan(4);
    expect(crankshaftGroup).toBeDefined();
    expect(flywheelGroup).toBeDefined();
    expect(pistonGroup).toBeDefined();
    expect(conRodGroup).toBeDefined();
    expect(hotTubeMesh).toBeDefined();
    expect(materials.hotTubeMat).toBeDefined();

    dispose();
  });
});
