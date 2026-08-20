import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { stepHewittMercuryLamp } from "@/physics/catalogKernels";
import {
  articulateHewittMercuryLampModel,
  buildHewittMercuryLampModel,
} from "./hewittMercuryLampModel";

describe("US 682,690 Peter Cooper Hewitt Mercury-Vapor Arc Lamp Visual Boundary", () => {
  const rootDir = process.cwd();
  const modelPath = join(rootDir, "src/components/patents/visuals/three/hewittMercuryLampModel.ts");
  const studioPath = join(rootDir, "src/components/patents/visuals/three/HewittMercuryLamp3D.tsx");

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
    expect(studioSource).toContain('usePatentPhysics("us-682690-hewitt-mercury-lamp")');
    expect(studioSource).toContain('updateParam("mainsVoltageV"');
    expect(studioSource).not.toContain("setMainsVoltageV");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(modelPath, "utf-8");
    const studioSource = readFileSync(studioPath, "utf-8");

    expect(modelSource).not.toContain("Math.random");
    expect(studioSource).not.toContain("Math.random");
    expect(studioSource).not.toContain("new THREE.Clock");
    expect(studioSource).not.toContain("performance.now");
  });

  test("computes genuine plasma breakdown, negative resistance, and luminous efficacy in SI units", () => {
    const res = stepHewittMercuryLamp({
      mainsVoltageV: 110,
      tubeLengthCm: 100,
      tubeDiameterMm: 25,
      condenserCoolingLevel: 1.0,
      ballastResistanceOhms: 12,
    });

    expect(res.mainsVoltageV).toBe(110);
    expect(res.tubeLengthCm).toBe(100);
    expect(res.breakdownStartingVoltageV).toBeGreaterThan(3000);
    expect(res.arcOperatingVoltageV).toBeGreaterThan(50);
    expect(res.arcOperatingVoltageV).toBeLessThan(100);
    expect(res.arcCurrentAmperes).toBeGreaterThan(2.0);
    expect(res.dynamicArcResistanceOhms).toBeLessThan(0); // True negative differential resistance!
    expect(res.isStable).toBe(true);
    expect(res.luminousEfficacyLmPerWatt).toBeGreaterThan(60);
    expect(res.luminousFluxLumens).toBeGreaterThan(10000);
    expect(res.equivalentCarbonBulbs).toBeGreaterThan(50);
  });

  test("builds and articulates procedural discharge tube, cathode pool, cathode spot, and condensing globe", () => {
    const nodes = buildHewittMercuryLampModel();
    expect(nodes.root).toBeDefined();
    expect(nodes.glassTube).toBeDefined();
    expect(nodes.plasmaColumn).toBeDefined();
    expect(nodes.plasmaLight).toBeDefined();
    expect(nodes.cathodeSpotMesh).toBeDefined();
    expect(nodes.mercuryPoolMesh).toBeDefined();
    expect(nodes.condensingGlobe).toBeDefined();
    expect(nodes.materials.length).toBeGreaterThan(4);

    articulateHewittMercuryLampModel(
      nodes,
      {
        arcCurrentAmperes: 3.5,
        luminousEfficacyLmPerWatt: 75,
        mercuryVaporPressureMmHg: 0.01,
        arcOperatingVoltageV: 68,
      },
      1.0,
    );

    expect(nodes.plasmaLight.intensity).toBeGreaterThan(2.0);
    expect(nodes.cathodeSpotMesh.position.x).toBeGreaterThan(0.05);
  });
});
