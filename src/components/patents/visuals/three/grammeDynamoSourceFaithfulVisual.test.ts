import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepGrammeDynamo } from "@/physics/catalogKernels";
import {
  buildGrammeDynamoModel,
  updateGrammeDynamoKinematics,
} from "./grammeDynamoModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 120,057 Gramme source-faithful visual boundary", () => {
  test("uses printed joined bobbins and collecting rubbers instead of a fabricated rated machine", () => {
    const twoDimensional = readFileSync(join(VISUALS_DIRECTORY, "GrammeDynamoSim.tsx"), "utf8");
    const threeDimensional = readFileSync(
      join(VISUALS_DIRECTORY, "three", "GrammeDynamo3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "grammeDynamoModel.ts"),
      "utf8",
    );

    expect(twoDimensional).toContain("printedJunctionCount = 36");
    expect(twoDimensional).toContain("Collecting rubber S");
    expect(twoDimensional).not.toContain("Smooth DC Commutation");
    expect(twoDimensional).not.toContain("Generated DC Voltage");
    expect(twoDimensional).not.toContain("+ Brush");
    expect(threeDimensional).toContain("Gramme Ring Dynamo 3D");
    expect(modelSource).toContain("buildGrammeDynamoModel");
    expect(modelSource).toContain("updateGrammeDynamoKinematics");
  });

  test("does not seed the Gramme display from ambient randomness or a private clock", () => {
    const threeDimensional = readFileSync(
      join(VISUALS_DIRECTORY, "three", "GrammeDynamo3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "grammeDynamoModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeDimensional).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for dynamo inspection", () => {
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

    expect(threeSource).toContain("isCutaway");
  });

  test("returns reproducible relative indicators rather than fabricated volts, amps, or watts", () => {
    expect(stepGrammeDynamo({ shaftRate: 1 })).toMatchObject({
      shaftRate: 1,
      printedJunctionCount: 36,
      inducedEmfIndex: 100,
      collectionContinuityPct: 97.2,
    });
    expect(stepGrammeDynamo({ shaftRate: 1.6 }).inducedEmfIndex).toBe(160);
  });

  test("builds and articulates procedural bedplate, 36 coil bobbins, 36 junction rods, and flux points correctly", () => {
    const { rootGroup, nodes, materials, dispose } = buildGrammeDynamoModel();
    expect(rootGroup.children.length).toBeGreaterThan(0);
    expect(nodes.bedplate).toBeDefined();
    expect(nodes.ironRing).toBeDefined();
    expect(nodes.coilSectors.length).toBe(36);
    expect(nodes.junctionRods.length).toBe(36);
    expect(nodes.collectorRubbers.length).toBe(2);

    updateGrammeDynamoKinematics(
      nodes,
      materials,
      0.016,
      0.5,
      1.0,
      100,
      0.026,
      true,
      true,
    );
    expect(materials.castIron.transparent).toBe(true);
    expect(nodes.fluxPoints.visible).toBe(true);

    dispose();
  });
});

