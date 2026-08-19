import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FrankenSimEngine } from "@/physics/engine";
import {
  buildWestinghouseAirBrakeModel,
  updateWestinghouseAirBrakeKinematics,
} from "./westinghouseAirBrakeModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 124,404 George Westinghouse Air Brake visual & kinematics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "WestinghouseAirBrake3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "westinghouseAirBrakeModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildWestinghouseAirBrakeModel");
    expect(modelSource).toContain("updateWestinghouseAirBrakeKinematics");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "WestinghouseAirBrake3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "westinghouseAirBrakeModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets for pneumatic and mechanical inspection", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "WestinghouseAirBrake3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "triple_valve",
      "brake_cylinder",
      "wheel_shoes",
      "reservoir",
      "track",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("Triple-Valve Armed");
  });

  test("computes fail-safe triple-valve pneumatic clamping dynamics in reproducible SI units", () => {
    // Normal charged state (70 psi) -> RELEASE
    const released = FrankenSimEngine.stepWestinghouseAirBrake({
      trainPipePressurePsi: 70,
      carMassTonnes: 35,
    });
    expect(released.valveState).toBe("RELEASE");
    expect(released.shoeClampingForceKn).toBe(0);
    expect(released.wheelDisplayDegPerMph).toBe(8);
    expect(released.flywheelSvgR).toBe(54);
    expect(released.spokeCount).toBe(6);
    expect(released.spokePitchDeg).toBe(60);
    expect(released.schematicWheelR).toBe(35);
    expect(released.schematicValveW).toBe(90);
    expect(released.schematicPipeY).toBe(230);
    expect(released.schematicShoeD).toContain("285 130");

    // Pressure drop (0 psi / pipe rupture) -> EMERGENCY clamping
    const emergency = FrankenSimEngine.stepWestinghouseAirBrake({
      trainPipePressurePsi: 0,
      carMassTonnes: 35,
    });
    expect(emergency.valveState).toBe("EMERGENCY");
    expect(emergency.shoeClampingForceKn).toBeGreaterThan(20);
    expect(emergency.stoppingDistanceFt).toBeLessThan(2000);
    expect(emergency.pistonStrokePx).toBe(18);
    expect(emergency.shoeDistancePx).toBe(0);
    expect(released.pistonStrokePx).toBe(0);
  });

  test("builds and articulates procedural brake rigging and beams correctly", () => {
    const { root, nodes, materials } = buildWestinghouseAirBrakeModel();
    expect(root.children.length).toBeGreaterThan(4);
    expect(nodes.wheelSets.length).toBe(2);
    expect(nodes.brakeShoes.length).toBe(4);

    // Initial released pose (clampingRatio = 0)
    updateWestinghouseAirBrakeKinematics(nodes, materials, 0, 0.0, 10);
    const releasedBeamX = nodes.frontBrakeBeam.position.x;
    const releasedRodX = nodes.pistonPushRod.position.x;

    // Full emergency clamped pose (clampingRatio = 1.0)
    updateWestinghouseAirBrakeKinematics(nodes, materials, Math.PI, 1.0, 10);
    const clampedBeamX = nodes.frontBrakeBeam.position.x;
    const clampedRodX = nodes.pistonPushRod.position.x;

    expect(clampedBeamX).toBeGreaterThan(releasedBeamX); // Front beam moves +X toward wheel
    expect(clampedRodX).toBeGreaterThan(releasedRodX); // Piston extends +X
    expect(materials.sparkParticle.opacity).toBeGreaterThan(0);
  });
});
