import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FrankenSimEngine } from "@/physics/engine";
import { buildFermiReactorModel, updateFermiReactorKinematics } from "./fermiReactorModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals");

describe("US 2,708,656 Enrico Fermi Chicago Pile-1 Nuclear Reactor visual & kinetics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "fermiReactorModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "FermiReactor3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("useGLTF");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(modelSource).toContain("updateFermiReactorKinematics");
    expect(threeSource).not.toContain("useGLTF");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "fermiReactorModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "FermiReactor3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("performance.now()");
  });

  test("exposes authentic camera presets and UI overlay for nuclear pile observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "FermiReactor3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "control_rods", "graphite_core", "gantry", "detector", "top"]) {
      expect(threeSource).toContain(preset);
    }
    expect(threeSource).toContain("isCutaway");
  });

  test("computes genuine four-factor formula, effective neutron multiplication (k_eff), and thermal power in SI units", () => {
    const result = FrankenSimEngine.stepFermiReactor(83.5, 99.5, 0.72);
    expect(result.kEffective).toBeGreaterThan(0.95);
    expect(result.kEffective).toBeLessThan(1.05);
    expect(result.thermalPowerWatts).toBeGreaterThan(0);
    expect(result.geigerIntervalMs).toBeGreaterThan(10);
    expect(result.rodStudioY).toBeCloseTo(-0.5 + 0.835 * 3.2, 3);
    expect(result.fuelGlowIntensity).toBeGreaterThan(0);
  });

  test("builds and articulates procedural timber scaffold, graphite moderator pile, uranium fuel lattice, and cadmium control rods correctly", () => {
    const model = buildFermiReactorModel();
    expect(model.root.children.length).toBeGreaterThan(0);
    expect(model.timberGroup).toBeDefined();
    expect(model.pileGroup).toBeDefined();
    expect(model.fuelGroup).toBeDefined();
    expect(model.rodGroup).toBeDefined();
    expect(model.bf3Detector).toBeDefined();
    expect(model.neutronPoints).toBeDefined();

    // Test kinematics update & cutaway
    const kinetics = FrankenSimEngine.stepFermiReactor(83.5, 99.5, 0.72);
    updateFermiReactorKinematics(
      model,
      1 / 60,
      83.5,
      kinetics.kEffective,
      99.5,
      kinetics.neutronDisplaySpeed,
      kinetics.rodStudioY,
      kinetics.fuelGlowIntensity,
      true,
      true,
    );
    expect(model.neutronPoints.visible).toBe(true);
    expect(model.graphiteMat.opacity).toBe(0.35);

    model.dispose();
  });
});
