import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepSholesTypewriter } from "@/physics/machineKernels";
import {
  buildSholesTypewriterModel,
  updateSholesTypewriterKinematics,
} from "./sholesTypewriterModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 79,265 source-faithful visual boundary", () => {
  test("uses the printed key, type-bar, ratchet, and ribbon relation without claiming an unprinted layout", () => {
    const twoDimensional = readFileSync(join(VISUALS_DIRECTORY, "SholesTypewriterSim.tsx"), "utf8");
    const threeDimensional = readFileSync(
      join(VISUALS_DIRECTORY, "three", "SholesTypewriter3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "sholesTypewriterModel.ts"),
      "utf8",
    );

    expect(twoDimensional).toContain("Ratchet I / lever H");
    expect(twoDimensional).toContain("Inking ribbon");
    expect(twoDimensional).toContain("Diagrammatic subset");
    expect(twoDimensional).toContain("Demonstration cadence");
    expect(twoDimensional).toContain('updateParam("typingSpeedWpm"');
    expect(threeDimensional).toContain("Sholes Type-Writer 3D");
    expect(modelSource).toContain("buildSholesTypewriterModel");
    expect(modelSource).toContain("updateSholesTypewriterKinematics");

    for (const prohibited of [
      "QWERTY",
      "THE QUICK BROWN FOX",
      "10-pitch",
      "2.54",
      "new THREE.Clock",
      "Ivory Keys",
      "Rubber Platen",
    ]) {
      expect(`${twoDimensional}\n${threeDimensional}\n${modelSource}`).not.toContain(prohibited);
    }
  });

  test("exposes authentic camera presets and cutaway mode for typewriter inspection", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "SholesTypewriter3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "type_basket",
      "platen_carriage",
      "keyboard",
      "escapement_ratchet",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
  });

  test("returns relative display phases rather than invented pitch, angle, or rate telemetry", () => {
    expect(stepSholesTypewriter(40, 0)).toMatchObject({
      eventsPerSecond: 40 / 60,
      completedSteps: 0,
      keyCyclePct: 0,
      ratchetReleasePct: 0,
      displayTypebarIndex: 0,
      columnPitchPx: 6,
      displayColumnWrap: 12,
    });
    expect(stepSholesTypewriter(40, 0.3)).toMatchObject({
      completedSteps: 0,
      displayTypebarIndex: 0,
    });
    expect(stepSholesTypewriter(40, 0.3).ratchetReleasePct).toBeGreaterThan(0);
    expect(stepSholesTypewriter(40, 0.3)).not.toHaveProperty("pitchMm");
    expect(stepSholesTypewriter(40, 0.3)).not.toHaveProperty("typebarStrikeAngleDeg");
  });

  test("builds and articulates procedural table, type basket, platen carriage, and keyboard correctly", () => {
    const { rootGroup, nodes, materials, dispose } = buildSholesTypewriterModel();
    expect(rootGroup.children.length).toBeGreaterThan(0);
    expect(nodes.table).toBeDefined();
    expect(nodes.basketRing).toBeDefined();
    expect(nodes.typeBars.length).toBe(12);
    expect(nodes.platen).toBeDefined();
    expect(nodes.keys.length).toBe(12);

    updateSholesTypewriterKinematics(nodes, materials, 0.5, 2, true);
    expect(materials.caseMat.transparent).toBe(true);
    expect(nodes.activeHammer.rotation.x).toBeCloseTo(-0.25, 2);

    dispose();
  });
});
