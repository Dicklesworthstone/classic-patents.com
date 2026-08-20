import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepBaekelandBakelite } from "@/physics/catalogKernels";
import { buildBaekelandBakeliteModel } from "./baekelandBakeliteModel";

describe("US 942,699 Leo Hendrik Baekeland Bakelite visual & polymer mechanics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/baekelandBakeliteModel.ts"),
      "utf8",
    );
    const studioSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/BaekelandBakelite3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(modelSource).not.toContain("GLTFLoader");
    expect(studioSource).not.toContain(".gltf");
    expect(studioSource).not.toContain(".glb");
    expect(modelSource).not.toContain("timeSec * 0.2");
    expect(modelSource).toContain("networkDisplayOmegaRadPerS");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/baekelandBakeliteModel.ts"),
      "utf8",
    );
    expect(modelSource).not.toContain("Math.random(");
    expect(modelSource).not.toContain("Date.now(");
  });

  test("exposes authentic camera presets and cutaway mode for autoclave inspection", () => {
    const studioSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/BaekelandBakelite3D.tsx"),
      "utf8",
    );
    expect(studioSource).toContain('"iso"');
    expect(studioSource).toContain('"autoclave"');
    expect(studioSource).toContain('"mold"');
    expect(studioSource).toContain('"molecular"');
    expect(studioSource).toContain('"gauges"');
    expect(studioSource).toContain("setCutaway");
    expect(studioSource).toContain("controls.setView");
    expect(studioSource).not.toContain("camera.position.set");
  });

  test("computes genuine step-growth polycondensation kinetics, gel point, and autoclave pressure in SI units", () => {
    // Unpressurized cure (foamy defect)
    const unpressurized = stepBaekelandBakelite(130, 10, 1.5, 60, 45);
    expect(unpressurized.isFoamingSuppressed).toBe(false);
    expect(unpressurized.voidPorosityPct).toBeGreaterThan(15);
    expect(unpressurized.tensileStrengthMpa).toBeLessThan(30);

    // Standard pressurized autoclave cure (dense C-stage Bakelite)
    const pressurized = stepBaekelandBakelite(130, 75, 1.5, 60, 45);
    expect(pressurized.isFoamingSuppressed).toBe(true);
    expect(pressurized.voidPorosityPct).toBeLessThan(2);
    expect(pressurized.conversionP).toBeGreaterThanOrEqual(0.85);
    expect(pressurized.resinStage).toBe("C-stage (Bakelite Thermoset)");
    expect(pressurized.tensileStrengthMpa).toBeGreaterThanOrEqual(55);
    expect(pressurized.dielectricBreakdownKvPerMm).toBeGreaterThanOrEqual(12);

    // Short/Low-temperature cure (A-stage resole liquid)
    const lowCure = stepBaekelandBakelite(60, 50, 0.5, 15, 0);
    expect(lowCure.conversionP).toBeLessThan(0.667);
    expect(lowCure.isGelled).toBe(false);
    expect(lowCure.resinStage).toBe("A-stage (Resole Liquid)");
    expect(pressurized.networkDisplayOmegaRadPerS).toBe(0);
    expect(lowCure.networkDisplayOmegaRadPerS).toBe(0.2);
  });

  test("builds and articulates procedural autoclave shell, steam jacket, mold ram, and molecular crosslinks correctly", () => {
    const model = buildBaekelandBakeliteModel();
    expect(model.rootGroup).toBeDefined();
    expect(model.nodes.autoclaveShell).toBeDefined();
    expect(model.nodes.ramGroup).toBeDefined();
    expect(model.nodes.bakeliteSpecimen).toBeDefined();
    expect(model.nodes.molecularNetworkGroup).toBeDefined();

    // Test cutaway toggle
    model.setCutaway(true);
    expect(model.nodes.autoclaveShell.visible).toBe(false);
    expect(model.nodes.cutawayShell.visible).toBe(true);

    model.setCutaway(false);
    expect(model.nodes.autoclaveShell.visible).toBe(true);
    expect(model.nodes.cutawayShell.visible).toBe(false);

    // Test dynamic update
    model.update(
      {
        curingTempC: 140,
        autoclavePressurePsi: 80,
        catalystPct: 2.0,
        curingTimeMin: 75,
        fillerPct: 50,
      },
      1.5,
    );
    expect(model.materials.bakeliteResin.color.getHex()).toBe(0x5c2b0e); // C-stage unfoamed color
    expect(model.nodes.molecularNetworkGroup.rotation.y).toBe(0);
  });
});
