import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepTownesLaser } from "@/physics/catalogKernels";
import { articulateTownesLaserModel, buildTownesLaserModel } from "./townesLaserModel";

describe("US 2,929,922 Arthur L. Schawlow & Charles H. Townes Optical Maser / Laser Visual Boundary", () => {
  const rootDir = process.cwd();
  const modelFile = join(rootDir, "src/components/patents/visuals/three/townesLaserModel.ts");
  const studioFile = join(rootDir, "src/components/patents/visuals/three/TownesLaser3D.tsx");

  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(modelFile, "utf-8");
    const studioSource = readFileSync(studioFile, "utf-8");

    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(modelSource).not.toContain("GLTFLoader");

    expect(studioSource).not.toContain(".gltf");
    expect(studioSource).not.toContain(".glb");
    expect(studioSource).not.toContain("GLTFLoader");
    expect(studioSource).toContain('usePatentPhysics("us-2929922-townes-laser")');
    expect(studioSource).toContain('from "./useLiveSimParams"');
    const simSource = readFileSync(
      join(rootDir, "src/components/patents/visuals/TownesLaserSim.tsx"),
      "utf-8",
    );
    expect(simSource).toContain('usePatentPhysics("us-2929922-townes-laser")');
    expect(simSource).not.toContain("setPumpPowerWatts");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const studioSource = readFileSync(studioFile, "utf-8");
    expect(studioSource).not.toContain("Math.random");
    expect(studioSource).not.toContain("Date.now");
    expect(studioSource).not.toContain("performance.now");
  });

  test("computes genuine Schawlow-Townes threshold gain, population inversion, and beam divergence in SI units", () => {
    // Below threshold (P = 80 W < 120 W)
    const below = stepTownesLaser({ pumpPowerWatts: 80 });
    expect(below.isLasing).toBe(false);
    expect(below.laserOutputPowerWatts).toBe(0);
    expect(below.thresholdGainPerCm).toBeGreaterThan(0.005);

    // Above threshold (P = 400 W)
    const above = stepTownesLaser({
      pumpPowerWatts: 400,
      cavityLengthCm: 25,
      mirror2ReflectivityPct: 94,
      beamDiameterMm: 8,
    });
    expect(above.isLasing).toBe(true);
    expect(above.laserOutputPowerWatts).toBeGreaterThan(15);
    expect(above.intraCavityPowerWatts).toBeGreaterThan(above.laserOutputPowerWatts);
    expect(above.beamDivergenceMrad).toBeGreaterThan(0.2);
    expect(above.beamDivergenceMrad).toBeLessThan(2.0);
    expect(above.fresnelNumber).toBeGreaterThan(0.1);
  });

  test("builds and articulates procedural base rail, mirror mounts, laser tube, helical flashlamp, and coherent beams", () => {
    const nodes = buildTownesLaserModel();
    expect(nodes.root).toBeDefined();
    expect(nodes.baseRail).toBeDefined();
    expect(nodes.rearMirrorMount).toBeDefined();
    expect(nodes.frontMirrorMount).toBeDefined();
    expect(nodes.laserTube).toBeDefined();
    expect(nodes.gainCore).toBeDefined();
    expect(nodes.helicalFlashlamp).toBeDefined();
    expect(nodes.intraCavityBeam).toBeDefined();
    expect(nodes.outputBeam).toBeDefined();
    expect(nodes.detectorHousing).toBeDefined();

    // Articulate above threshold
    articulateTownesLaserModel(
      nodes,
      {
        pumpPowerWatts: 500,
        laserOutputPowerWatts: 120,
        intraCavityPowerWatts: 1800,
        isLasing: true,
      },
      1.5,
    );

    // Materials should be valid and disposed cleanly
    expect(nodes.materials.length).toBeGreaterThan(6);
    for (const m of nodes.materials) {
      m.dispose();
    }
  });
});

describe("US 2,297,691 Carlson electrophotography 2D/3D bus", () => {
  test("2D sliders and 3D live loop share usePatentPhysics", () => {
    const rootDir = process.cwd();
    const simSource = readFileSync(
      join(rootDir, "src/components/patents/visuals/CarlsonElectrophotographySim.tsx"),
      "utf-8",
    );
    const studioSource = readFileSync(
      join(rootDir, "src/components/patents/visuals/three/CarlsonElectrophotography3D.tsx"),
      "utf-8",
    );
    expect(simSource).toContain('usePatentPhysics("us-2297691-carlson-electrophotography")');
    expect(studioSource).toContain('usePatentPhysics("us-2297691-carlson-electrophotography")');
    expect(simSource).not.toContain("setCoronaVoltageKv");
    expect(studioSource).toContain('from "./useLiveSimParams"');
  });
});
