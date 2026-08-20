import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { stepCarlsonElectrophotography } from "@/physics/catalogKernels";
import {
  articulateCarlsonElectrophotographyModel,
  buildCarlsonElectrophotographyModel,
} from "./carlsonElectrophotographyModel";

describe("US 2,297,691 Chester F. Carlson Electrophotography Visual Boundary", () => {
  const rootDir = process.cwd();
  const modelPath = join(
    rootDir,
    "src/components/patents/visuals/three/carlsonElectrophotographyModel.ts",
  );
  const studioPath = join(
    rootDir,
    "src/components/patents/visuals/three/CarlsonElectrophotography3D.tsx",
  );

  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    expect(existsSync(modelPath)).toBe(true);
    expect(existsSync(studioPath)).toBe(true);

    const modelSource = readFileSync(modelPath, "utf-8");
    const studioSource = readFileSync(studioPath, "utf-8");

    expect(modelSource).not.toContain("GLTFLoader");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");

    expect(studioSource).not.toContain("GLTFLoader");
    expect(studioSource).not.toContain(".gltf");
    expect(studioSource).not.toContain(".glb");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(modelPath, "utf-8");
    const studioSource = readFileSync(studioPath, "utf-8");

    expect(modelSource).not.toContain("Math.random");
    expect(studioSource).not.toContain("Math.random");
    expect(studioSource).not.toContain("new THREE.Clock");
    expect(studioSource).not.toContain("performance.now");
  });

  test("computes genuine photoconductive latent imaging, contrast voltage, and optical density in SI units", () => {
    const res = stepCarlsonElectrophotography({
      coronaVoltageKv: 6.5,
      exposureLuxSec: 12,
      layerThicknessUm: 30,
      fuserTemperatureC: 185,
    });

    expect(res.initialSurfacePotentialV).toBe(650);
    expect(res.exposedSurfacePotentialV).toBeLessThan(200);
    expect(res.contrastPotentialV).toBeGreaterThan(450);
    expect(res.opticalDensity).toBeGreaterThan(1.0);
    expect(res.fuserBondQualityPct).toBeGreaterThan(80);
    expect(res.tonerMassDensityMgPerCm2).toBeGreaterThan(0.8);
  });

  test("builds and articulates procedural photoreceptor drum, corona wire, developer box, and fuser rolls", () => {
    const nodes = buildCarlsonElectrophotographyModel();
    expect(nodes.root).toBeDefined();
    expect(nodes.drumGroup).toBeDefined();
    expect(nodes.seleniumDrumMesh).toBeDefined();
    expect(nodes.aluminumCoreMesh).toBeDefined();
    expect(nodes.coronaAssembly).toBeDefined();
    expect(nodes.coronaWireMesh).toBeDefined();
    expect(nodes.fuserUpperRoll).toBeDefined();
    expect(nodes.materials.length).toBeGreaterThan(5);

    articulateCarlsonElectrophotographyModel(
      nodes,
      {
        coronaVoltageKv: 6.5,
        contrastPotentialV: 550,
        opticalDensity: 1.45,
        fuserTemperatureC: 185,
      },
      1.0,
    );

    expect(nodes.fuserHeatLight.intensity).toBeGreaterThan(1.5);
  });
});
