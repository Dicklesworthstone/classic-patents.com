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
    const simSource = readFileSync(
      join(rootDir, "src/components/patents/visuals/HewittMercuryLampSim.tsx"),
      "utf-8",
    );
    expect(simSource).toContain("physics.plasmaFlickerOmegaRadPerS");
    expect(simSource).toContain("physics.cathodeSpotOmegaXRadPerS");
    expect(simSource).not.toContain("time * 15 +");
    expect(simSource).not.toContain("time * 8)");
    expect(simSource).toContain("physics.strikeJoltOmegaRadPerS");
    expect(simSource).not.toContain("time * 30");
    expect(simSource).not.toContain("time * 40");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(modelPath, "utf-8");
    const studioSource = readFileSync(studioPath, "utf-8");

    expect(modelSource).not.toContain("Math.random");
    expect(studioSource).not.toContain("Math.random");
    expect(studioSource).not.toContain("new THREE.Clock");
    expect(studioSource).not.toContain("performance.now");
  });

  test("keeps the registered claim probe outside optional responsive HUD chrome", () => {
    const studioSource = readFileSync(studioPath, "utf-8");
    const probeIndex = studioSource.indexOf(
      '<ClaimConstraintToggle\n            patentId="us-682690-hewitt-mercury-lamp"',
    );
    const optionalHudIndex = studioSource.indexOf("{/* Top-Left Camera Preset Toolbar */}");
    expect(probeIndex).toBeGreaterThan(0);
    expect(optionalHudIndex).toBeGreaterThan(probeIndex);
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
    expect(res.plasmaFlickerOmegaRadPerS).toBe(30);
    expect(res.cathodeSpotOmegaXRadPerS).toBeCloseTo((res.arcCurrentAmperes / 3.5) * 8, 2);
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

    const sim = stepHewittMercuryLamp({
      mainsVoltageV: 110,
      tubeLengthCm: 100,
      tubeDiameterMm: 25,
      condenserCoolingLevel: 1.0,
      ballastResistanceOhms: 12,
    });
    articulateHewittMercuryLampModel(
      nodes,
      {
        arcCurrentAmperes: sim.arcCurrentAmperes,
        luminousEfficacyLmPerWatt: sim.luminousEfficacyLmPerWatt,
        mercuryVaporPressureMmHg: sim.mercuryVaporPressureMmHg,
        arcOperatingVoltageV: sim.arcOperatingVoltageV,
        plasmaFlickerOmegaRadPerS: sim.plasmaFlickerOmegaRadPerS,
        cathodeSpotOmegaXRadPerS: sim.cathodeSpotOmegaXRadPerS,
        cathodeSpotOmegaYRadPerS: sim.cathodeSpotOmegaYRadPerS,
      },
      1.0,
    );

    expect(nodes.plasmaLight.intensity).toBeGreaterThan(2.0);
    expect(nodes.cathodeSpotMesh.position.x).toBeGreaterThan(0.05);
    const modelSource = readFileSync(modelPath, "utf-8");
    expect(modelSource).not.toContain("timeSec * 30");
    expect(modelSource).not.toContain("timeSec * 8");
  });
});
