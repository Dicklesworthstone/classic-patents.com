import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepMaimanRubyLaser } from "@/physics/catalogKernels";
import { createMaimanRubyLaserModel } from "./maimanRubyLaserModel";

describe("US 3,353,115 Theodore H. Maiman Ruby Laser Visual Boundary", () => {
  const root = process.cwd();

  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelPath = join(root, "src/components/patents/visuals/three/maimanRubyLaserModel.ts");
    const studioPath = join(root, "src/components/patents/visuals/three/MaimanRubyLaser3D.tsx");

    const modelCode = readFileSync(modelPath, "utf8");
    const studioCode = readFileSync(studioPath, "utf8");

    expect(modelCode).not.toContain("GLTFLoader");
    expect(modelCode).not.toContain(".gltf");
    expect(modelCode).not.toContain(".glb");

    expect(studioCode).not.toContain("GLTFLoader");
    expect(studioCode).not.toContain(".gltf");
    expect(studioCode).not.toContain(".glb");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelPath = join(root, "src/components/patents/visuals/three/maimanRubyLaserModel.ts");
    const modelCode = readFileSync(modelPath, "utf8");

    expect(modelCode).not.toContain("Math.random()");
    expect(modelCode).not.toContain("Date.now()");
    expect(modelCode).not.toContain("performance.now()");
  });

  test("computes genuine three-level population inversion, laser threshold, and peak power in SI units", () => {
    // Below threshold (pump = 50 J)
    const below = stepMaimanRubyLaser({ pumpEnergyJoules: 50 });
    expect(below.isLasing).toBe(false);
    expect(below.laserPulseEnergyJoules).toBe(0);
    expect(below.laserPeakPowerKw).toBe(0);

    // Above threshold (pump = 200 J)
    const above = stepMaimanRubyLaser({ pumpEnergyJoules: 200 });
    expect(above.isLasing).toBe(true);
    expect(above.populationInversionRatio).toBeGreaterThan(1.0);
    expect(above.laserPulseEnergyJoules).toBeGreaterThan(0);
    expect(above.laserPeakPowerKw).toBeGreaterThan(0);
    expect(above.emissionWavelengthNm).toBeCloseTo(694.3, 1);
  });

  test("builds and articulates procedural ruby rod, helical flashlamp, cavity mirrors, and laser beam", () => {
    const model = createMaimanRubyLaserModel();
    expect(model.nodes.rubyRod).toBeDefined();
    expect(model.nodes.helicalFlashTube).toBeDefined();
    expect(model.nodes.housingCylinder).toBeDefined();
    expect(model.nodes.rearMirror).toBeDefined();
    expect(model.nodes.outputMirror).toBeDefined();
    expect(model.nodes.laserBeam).toBeDefined();
    expect(model.nodes.targetDisc).toBeDefined();

    // Update with non-lasing condition
    model.update({ pumpEnergyJoules: 50 }, 0.0, false);
    expect((model.nodes.laserBeam.material as any).opacity).toBe(0.0);

    // Update with lasing flash condition
    model.update({ pumpEnergyJoules: 250 }, 0.1, true);
    expect((model.nodes.laserBeam.material as any).opacity).toBeGreaterThan(0.5);

    model.dispose();
  });
});
