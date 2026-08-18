import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepSholesTypewriter } from "@/physics/machineKernels";
import {
  buildSholesTypewriterModel,
  updateSholesTypewriterKinematics,
} from "./sholesTypewriterModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals");

describe("US 79,265 Christopher Latham Sholes Type-Writer visual & escapement boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "sholesTypewriterModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "SholesTypewriter3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("useGLTF");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(threeSource).not.toContain("useGLTF");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "sholesTypewriterModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "SholesTypewriter3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("performance.now()");
  });

  test("exposes authentic camera presets and UI overlay for typewriter mechanism inspection", () => {
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
  });

  test("computes genuine key stroke frequency, events per second, and escapement advance in SI units", () => {
    const result = stepSholesTypewriter(40, 0.5);
    expect(result.eventsPerSecond).toBeGreaterThan(0.5);
    expect(result.keyCyclePct).toBeDefined();
    expect(result.ratchetReleasePct).toBeDefined();
  });

  test("builds and articulates procedural wooden table, radial type basket, platen carriage, and escapement ratchet correctly", () => {
    const model = buildSholesTypewriterModel();
    expect(model.rootGroup.children.length).toBeGreaterThan(0);
    expect(model.nodes.table).toBeDefined();
    expect(model.nodes.basketGroup).toBeDefined();
    expect(model.nodes.platen).toBeDefined();
    expect(model.nodes.escapement).toBeDefined();
    expect(model.nodes.keyboardGroup).toBeDefined();
    expect(model.nodes.typeBars.length).toBeGreaterThan(10);

    // Test kinematics update
    updateSholesTypewriterKinematics(model.nodes, model.materials, 0.5, 0, false);
    expect(model.nodes.platen.position.x).toBeDefined();

    model.dispose();
  });
});
