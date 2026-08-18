import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepRenoEscalator } from "@/physics/machineKernels";
import { buildRenoEscalatorModel, updateRenoEscalatorKinematics } from "./renoEscalatorModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 470,918 Jesse Reno Inclined Elevator visual & mechanics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "RenoEscalator3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "renoEscalatorModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildRenoEscalatorModel");
    expect(modelSource).toContain("updateRenoEscalatorKinematics");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "RenoEscalator3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "renoEscalatorModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for escalator observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "RenoEscalator3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "comb_plates",
      "cleated_deck",
      "handrail",
      "drive_machinery",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("cutawayMode");
    expect(threeSource).toContain("Reno Endless Conveyor Dynamics");
  });

  test("computes genuine Reno inclined elevator transit dynamics in SI units", () => {
    const result = stepRenoEscalator({
      passengerCount: 30,
      inclineAngleDeg: 25,
      velocityMps: 0.45,
    });

    expect(result.speedFpm).toBeGreaterThan(80);
    expect(result.throughputPerHour).toBeGreaterThan(2000);
    expect(result.motorPowerKw).toBeGreaterThan(1.0);
  });

  test("builds and articulates procedural cleated deck and balustrades correctly", () => {
    const { root, nodes, materials } = buildRenoEscalatorModel(25);
    expect(root.children.length).toBeGreaterThan(4);
    expect(nodes.cleats.length).toBe(28);

    // Cleat progression under velocity
    const initialCleatX = nodes.cleats[0].position.x;
    updateRenoEscalatorKinematics(nodes, materials, 0.1, 0.5, 0.45, true);
    const updatedCleatX = nodes.cleats[0].position.x;

    expect(updatedCleatX).not.toBe(initialCleatX);
    expect(nodes.solidPanelMesh.visible).toBe(false);
    expect(nodes.cutawayPanelMesh.visible).toBe(true);
  });
});
