import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildLindeLiquefactionModel } from "./lindeLiquefactionModel";
import { FrankenSimEngine } from "@/physics/engine";

const VISUALS_DIRECTORY = join(
  process.cwd(),
  "src",
  "components",
  "patents",
  "visuals",
);

describe("US 727,650 Carl von Linde Air Liquefaction visual & thermodynamics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "lindeLiquefactionModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "LindeAirLiquefaction3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("useGLTF");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(threeSource).not.toContain("useGLTF");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "lindeLiquefactionModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "LindeAirLiquefaction3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("performance.now()");
  });

  test("exposes authentic camera presets and UI overlay for cryogenics observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "LindeAirLiquefaction3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "jt_valve", "counter_heat_exchanger", "liquid_dewar", "spindle_handwheel", "top"]) {
      expect(threeSource).toContain(preset);
    }
  });

  test("computes genuine Joule-Thomson expansion and liquefaction yield in SI units", () => {
    const result = FrankenSimEngine.stepLindeAirLiquefaction({
      compressorPressureBar: 200,
      heatExchangerPasses: 50,
    });
    expect(result.coldEndTempK).toBeLessThan(100);
    expect(result.coldEndTempC).toBeLessThan(-170);
    expect(result.jtDeltaTPerPass).toBeGreaterThan(10);
    expect(result.isLiquefying).toBe(true);
    expect(result.liquidYieldPct).toBeGreaterThan(5);
  });

  test("builds and articulates procedural cryostat casing, counter-current triple concentric coil, JT valve, and liquid air dewar correctly", () => {
    const model = buildLindeLiquefactionModel();
    expect(model.root.children.length).toBeGreaterThan(0);
    expect(model.nodes.counterCurrentCoilGroup).toBeDefined();
    expect(model.nodes.jtValveGroup).toBeDefined();
    expect(model.nodes.dewarVessel).toBeDefined();
    expect(model.nodes.liquidAirVolume).toBeDefined();

    model.dispose();
  });
});
