import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  stepTownesMaserTopology,
  TOWNES_MASER_DEFAULT_CONTROLS,
} from "@/physics/townesMaserKernel";
import { buildTownesMaserSystemModel } from "./townesMaserSystemModel";

describe("US 2,929,922 Arthur L. Schawlow & Charles H. Townes Optical Maser / Laser Visual Boundary", () => {
  const rootDir = process.cwd();
  const modelFile = join(rootDir, "src/components/patents/visuals/three/townesMaserSystemModel.ts");
  const studioFile = join(rootDir, "src/components/patents/visuals/three/TownesMaserSystem3D.tsx");

  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(modelFile, "utf-8");
    const studioSource = readFileSync(studioFile, "utf-8");

    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(modelSource).not.toContain("GLTFLoader");
    expect(modelSource).toContain("generator 10");
    expect(modelSource).toContain("modulated amplifier 12");
    expect(modelSource).toContain("detector 13");
    expect(modelSource).toContain("absorptive sheet 25 with aperture 24");
    expect(modelSource).toContain("longitudinal-field coil 32");

    expect(studioSource).not.toContain(".gltf");
    expect(studioSource).not.toContain(".glb");
    expect(studioSource).not.toContain("GLTFLoader");
    expect(studioSource).toContain('usePatentPhysics("us-2929922-townes-laser")');
    expect(studioSource).toContain('from "./useLiveSimParams"');
    expect(studioSource).toContain("createThreeStudioScene");
    expect(studioSource).toContain("isRefused: true");
    expect(studioSource).toContain('value: "refused"');
    expect(studioSource).not.toContain("OrbitControls");
    expect(studioSource).not.toContain("laserOutputPowerWatts");
    expect(studioSource).not.toContain("thresholdGainPerCm");
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

  test("computes only source-supported geometry and exact reflectivity bookkeeping", () => {
    const state = stepTownesMaserTopology(TOWNES_MASER_DEFAULT_CONTROLS);
    expect(state.chamberAspectRatio).toBe(10);
    expect(state.readerRoundTripReflectivityFraction).toBeCloseTo(0.97 ** 2, 6);
    expect(state.signalPathComplete).toBe(true);
    expect(state.quantitativeOpticalPerformanceAvailable).toBe(false);
    expect(state.refusal.refused).toBe(true);
  });

  test("builds one grounded, connected generator-to-amplifier-to-detector apparatus", () => {
    const model = buildTownesMaserSystemModel();
    expect(model.root.name).toContain("connected maser communications system");
    expect(model.generator.name).toBe("generator 10");
    expect(model.amplifier.name).toBe("modulated amplifier 12");
    expect(model.detector.name).toContain("detector 13");
    expect(model.modeSelector.name).toContain("23–26");
    expect(model.generatorPumpLamps).toHaveLength(4);
    expect(model.modulationCoils).toHaveLength(5);

    const active = stepTownesMaserTopology(TOWNES_MASER_DEFAULT_CONTROLS);
    model.update(active, 1.5);
    expect(model.generatorBeam.visible).toBe(true);
    expect(model.amplifierBeam.visible).toBe(true);
    expect(model.detectorBeam.visible).toBe(true);

    const withheld = stepTownesMaserTopology({ claim1PathPresent: 0 });
    model.update(withheld, 2);
    expect(model.generatorBeam.visible).toBe(false);
    expect(model.amplifierBeam.visible).toBe(false);
    expect(model.detectorBeam.visible).toBe(false);
    model.dispose();
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
