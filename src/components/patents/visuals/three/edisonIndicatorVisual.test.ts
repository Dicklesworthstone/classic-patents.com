import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepEdisonIndicator } from "@/physics/catalogKernels";
import { buildEdisonIndicatorModel } from "./edisonIndicatorModel";

describe("US 307,031 Thomas Edison Electrical Indicator Visual Boundary", () => {
  const root = process.cwd();

  it("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      join(root, "src/components/patents/visuals/three/edisonIndicatorModel.ts"),
      "utf8",
    );
    const componentSource = readFileSync(
      join(root, "src/components/patents/visuals/three/EdisonIndicator3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(modelSource).not.toContain("GLTFLoader");
    expect(componentSource).not.toContain(".gltf");
    expect(componentSource).not.toContain(".glb");
    expect(componentSource).not.toContain("GLTFLoader");
    expect(componentSource).toContain('usePatentPhysics("us-307031-edison-indicator")');
    expect(componentSource).toContain('from "./useLiveSimParams"');
    const simSource = readFileSync(
      join(root, "src/components/patents/visuals/EdisonIndicatorSim.tsx"),
      "utf8",
    );
    expect(simSource).toContain('usePatentPhysics("us-307031-edison-indicator")');
    expect(simSource).not.toContain("setMainsVoltage");
  });

  it("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const componentSource = readFileSync(
      join(root, "src/components/patents/visuals/three/EdisonIndicator3D.tsx"),
      "utf8",
    );

    expect(componentSource).not.toContain("Math.random()");
    expect(componentSource).not.toContain("THREE.Clock");
    expect(componentSource).not.toContain("Date.now()");
  });

  it("computes genuine Richardson-Dushman emission, filament temperature, and galvo deflection in SI units", () => {
    // Nominal condition at 110 V
    const nominal = stepEdisonIndicator({
      mainsVoltageV: 110,
      plateBiasPolarity: 1,
      galvanometerTorsionNullV: 110,
    });

    expect(nominal.filamentTemperatureK).toBeGreaterThan(1900);
    expect(nominal.filamentTemperatureK).toBeLessThan(2400);
    expect(nominal.emissionCurrentMicroAmps).toBeGreaterThan(5);
    expect(nominal.galvoDeflectionDeg).toBeCloseTo(0.0, 1);
    expect(nominal.regulatorState).toBe("nominal");

    // Over-voltage condition at 125 V
    const overVoltage = stepEdisonIndicator({
      mainsVoltageV: 125,
      plateBiasPolarity: 1,
      galvanometerTorsionNullV: 110,
    });
    expect(overVoltage.filamentTemperatureK).toBeGreaterThan(nominal.filamentTemperatureK);
    expect(overVoltage.emissionCurrentMicroAmps).toBeGreaterThan(nominal.emissionCurrentMicroAmps);
    expect(overVoltage.galvoDeflectionDeg).toBeGreaterThan(0);
    expect(overVoltage.regulatorState).toBe("high_voltage_trip");

    // Reverse-bias condition (negative plate)
    const reverseBias = stepEdisonIndicator({
      mainsVoltageV: 110,
      plateBiasPolarity: -1,
      galvanometerTorsionNullV: 110,
    });
    expect(reverseBias.emissionCurrentMicroAmps).toBeLessThan(0.1);
    expect(reverseBias.rectificationRatio).toBeGreaterThanOrEqual(1000);
  });

  it("builds and articulates procedural baseboard, vacuum bulb, carbon loop, platinum plate, and galvanometer needle", () => {
    const model = buildEdisonIndicatorModel();
    expect(model.root).toBeDefined();
    expect(model.root.children.length).toBeGreaterThan(2);

    // Update with live values
    model.update({
      filamentTemperatureK: 2150,
      galvoDeflectionDeg: 12.5,
      plateBiasPolarity: "positive",
      mainsVoltageV: 120,
    });

    model.dispose();
  });
});
