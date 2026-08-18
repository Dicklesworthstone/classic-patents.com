import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepOtisElevator } from "@/physics/machineKernels";
import { buildOtisElevatorModel, updateOtisElevatorKinematics } from "./otisElevatorModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 31,128 Elisha Otis Safety Hoisting Apparatus visual & mechanics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "OtisElevator3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "otisElevatorModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildOtisElevatorModel");
    expect(modelSource).toContain("updateOtisElevatorKinematics");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "OtisElevator3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "otisElevatorModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for hoistway observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "OtisElevator3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "safety_pawls", "leaf_spring", "cab", "crown_sheave", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Otis Safety Elevator 3D");
  });

  test("computes genuine Otis wagon-spring safety dynamics in SI units", () => {
    const intact = stepOtisElevator({ cabPayloadKg: 650, cableTensionPct: 100 });
    expect(intact.isSnapped).toBe(false);
    expect(intact.isPawlEngaged).toBe(false);
    expect(intact.springDeflectionCm).toBe(10);
    expect(intact.hoistTensionKn).toBeGreaterThan(9.0);
    expect(intact.springBowY).toBeCloseTo(0.22, 4);

    const severed = stepOtisElevator({ cabPayloadKg: 650, cableTensionPct: 0 });
    expect(severed.isSnapped).toBe(true);
    expect(severed.isPawlEngaged).toBe(true);
    expect(severed.pawlEngagementMs).toBe(38);
    expect(severed.peakArrestForceKn).toBeGreaterThan(15.0);
    expect(severed.stoppingDistanceCm).toBe(4.5);
  });

  test("builds and articulates procedural hoistway frame and safety pawls correctly", () => {
    const { root, nodes, materials, dispose } = buildOtisElevatorModel();
    expect(root.children.length).toBeGreaterThan(2);
    expect(nodes.leftRackTeeth.length).toBe(32);
    expect(nodes.rightRackTeeth.length).toBe(32);
    expect(nodes.springLeaves.length).toBe(4);

    // Initial intact state
    const intact = stepOtisElevator({ cabPayloadKg: 650, cableTensionPct: 100 });
    updateOtisElevatorKinematics(nodes, materials, 0.016, 0, false, intact.springBowY, false);
    expect(nodes.tautCable.visible).toBe(true);
    expect(nodes.severedCableTop.visible).toBe(false);

    // Severed state
    updateOtisElevatorKinematics(nodes, materials, 0.016, 0.5, true, 0, true);
    expect(nodes.tautCable.visible).toBe(false);
    expect(nodes.severedCableTop.visible).toBe(true);
    expect(nodes.severedCableBottom.visible).toBe(true);

    dispose();
  });
});
