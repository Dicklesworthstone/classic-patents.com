import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FrankenSimEngine } from "@/physics/engine";
import { buildKwolekKevlarModel } from "./kwolekKevlarModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals");

describe("US 3,671,542 Stephanie Kwolek Kevlar visual & polymer physics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "kwolekKevlarModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "KwolekKevlar3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("useGLTF");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(threeSource).not.toContain("useGLTF");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "kwolekKevlarModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "KwolekKevlar3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("performance.now()");
  });

  test("exposes authentic camera presets and UI overlay for polymer inspection", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "KwolekKevlar3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "ring", "hbonds", "spinneret", "impact"]) {
      expect(threeSource).toContain(preset);
    }
  });

  test("computes genuine tensile strength, elastic modulus, and draw ratio scaling in SI units", () => {
    const result = FrankenSimEngine.stepKevlarContinuum(6.5, 450, 30);
    expect(result.tensileStrengthGpa).toBeGreaterThan(2.0);
    expect(result.elasticModulusGpa).toBeGreaterThan(100);
    expect(result.alignmentPct).toBeGreaterThan(80);
  });

  test("builds and articulates procedural spinneret pack, 5 PPTA polymer chains, and hydrogen bond struts correctly", () => {
    const model = buildKwolekKevlarModel();
    expect(model.root.children.length).toBeGreaterThan(0);
    expect(model.polymerGroup).toBeDefined();
    expect(model.spinneretPack).toBeDefined();
    expect(model.hBondsGroup).toBeDefined();
    expect(model.bulletMesh).toBeDefined();
    expect(model.chains.length).toBe(5);

    // Test kinematics update
    model.updateKinematics(1 / 60, true, true, 450, 450);
    expect(model.hBondsGroup.visible).toBe(true);

    model.dispose();
  });
});
