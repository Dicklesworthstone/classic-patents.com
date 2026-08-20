import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { stepHallAluminium } from "@/physics/catalogKernels";
import { createHallAluminiumModel, updateHallAluminiumVisual } from "./hallAluminiumModel";

describe("US 400,766 Charles Martin Hall Aluminium Smelting Visual Boundary", () => {
  const rootDir = process.cwd();

  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      resolve(rootDir, "src/components/patents/visuals/three/hallAluminiumModel.ts"),
      "utf8",
    );
    const componentSource = readFileSync(
      resolve(rootDir, "src/components/patents/visuals/three/HallAluminium3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(modelSource).not.toContain("GLTFLoader");
    expect(componentSource).not.toContain(".gltf");
    expect(componentSource).not.toContain(".glb");
    expect(componentSource).not.toContain("GLTFLoader");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(
      resolve(rootDir, "src/components/patents/visuals/three/hallAluminiumModel.ts"),
      "utf8",
    );

    expect(modelSource).not.toContain("Date.now()");
    expect(modelSource).not.toContain("performance.now()");
  });

  test("computes genuine Faraday electrolysis, cell voltage, and production rate in SI units", () => {
    const nominal = stepHallAluminium({
      currentAmperes: 300000,
      bathTemperatureCelsius: 960,
      aluminaConcentrationPct: 5.5,
    });

    expect(nominal.currentAmperes).toBe(300000);
    expect(nominal.aluminiumProductionRateKgPerHour).toBeGreaterThan(90);
    expect(nominal.aluminiumProductionRateKgPerHour).toBeLessThan(110);
    expect(nominal.currentEfficiencyPct).toBeGreaterThanOrEqual(90);
    expect(nominal.totalCellVoltage).toBeGreaterThanOrEqual(4.0);
    expect(nominal.totalCellVoltage).toBeLessThanOrEqual(5.0);
    expect(nominal.liquidAluminiumDensityGPerCm3).toBeGreaterThan(nominal.moltenBathDensityGPerCm3);
  });

  test("builds and articulates procedural pot shell, cathode, cryolite bath, metal pad, and anodes", () => {
    const model = createHallAluminiumModel();
    expect(model.root.children.length).toBeGreaterThanOrEqual(8);
    expect(model.potShell).toBeDefined();
    expect(model.carbonCathode).toBeDefined();
    expect(model.cryoliteBath).toBeDefined();
    expect(model.aluminiumPad).toBeDefined();
    expect(model.anodeBlocks.length).toBe(4);
    expect(model.bubbleParticles).toBeDefined();

    // Verify initial positions
    expect(model.aluminiumPad.position.y).toBeLessThan(model.cryoliteBath.position.y);

    // Update with telemetry
    updateHallAluminiumVisual(
      model,
      {
        currentAmperes: 300000,
        bathTemperatureCelsius: 960,
        totalCellVoltage: 4.43,
        aluminiumProductionRateKgPerHour: 94.6,
      },
      1.5,
    );

    expect(model.anodeAssembly.position.y).toBeDefined();
  });
});
