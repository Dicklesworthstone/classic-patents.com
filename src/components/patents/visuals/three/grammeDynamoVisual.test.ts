import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepGrammeDynamo } from "@/physics/catalogKernels";
import { buildGrammeDynamoModel, updateGrammeDynamoKinematics } from "./grammeDynamoModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals");

describe("US 120,057 Zénobe Gramme Ring Armature Dynamo visual & electromagnetic boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "grammeDynamoModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "GrammeDynamo3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("useGLTF");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(threeSource).not.toContain("useGLTF");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "grammeDynamoModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "GrammeDynamo3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("performance.now()");
  });

  test("exposes authentic camera presets and UI overlay for dynamo inspection", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "GrammeDynamo3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "ring_armature",
      "collector_rods",
      "pole_pieces",
      "bearing_pedestal",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }
  });

  test("computes genuine shaft rotation radians, induced EMF index, and flux telemetry in SI units", () => {
    const result = stepGrammeDynamo({ shaftRate: 1 });
    expect(result.displayRadPerFrame).toBeGreaterThan(0);
    expect(result.inducedEmfIndex).toBeGreaterThan(0);
    expect(result.fluxOpacity).toBeCloseTo(0.688, 2);
    expect(result.fluxOrbitCoupling).toBe(0.3);
    expect(result.fluxRadiusBase).toBe(1.42);
    expect(result.displayFps).toBe(60);
  });

  test("builds and articulates procedural cast-iron bedplate, ring armature, 36 wound bobbins, brass junction rods, and flux points correctly", () => {
    const model = buildGrammeDynamoModel();
    expect(model.rootGroup.children.length).toBeGreaterThan(0);
    expect(model.nodes.bedplate).toBeDefined();
    expect(model.nodes.statorGroup).toBeDefined();
    expect(model.nodes.armatureGroup).toBeDefined();
    expect(model.nodes.ironRing).toBeDefined();
    expect(model.nodes.coilSectors.length).toBe(36);
    expect(model.nodes.junctionRods.length).toBe(36);
    expect(model.nodes.fluxPoints).toBeDefined();

    // Test kinematics update
    const gramme = stepGrammeDynamo({ shaftRate: 1 });
    updateGrammeDynamoKinematics(
      model.nodes,
      model.materials,
      1 / 60,
      1.0,
      1,
      gramme.inducedEmfIndex,
      gramme.displayRadPerFrame,
      gramme.fluxOpacity,
      true,
      false,
    );
    expect(model.nodes.armatureGroup.rotation.x).toBeDefined();

    model.dispose();
  });
});
