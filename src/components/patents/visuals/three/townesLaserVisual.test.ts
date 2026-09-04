import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import {
  stepTownesMaserTopology,
  TOWNES_MASER_DEFAULT_CONTROLS,
} from "@/physics/townesMaserKernel";
import {
  TOWNES_COMPACT_SYSTEM_SAFE_ZONE,
  TOWNES_MASER_DESKTOP_CAMERA_PRESETS,
  townesMaserSystemCameraForViewport,
} from "./townesMaserSystemCamera";
import { buildTownesMaserSystemModel } from "./townesMaserSystemModel";

function projectedObjectBounds(root: THREE.Object3D, camera: THREE.PerspectiveCamera) {
  const bounds = {
    minX: Number.POSITIVE_INFINITY,
    maxX: Number.NEGATIVE_INFINITY,
    minY: Number.POSITIVE_INFINITY,
    maxY: Number.NEGATIVE_INFINITY,
  };
  const point = new THREE.Vector3();
  root.traverse((node) => {
    const positions = (node as THREE.Mesh).geometry?.getAttribute("position");
    if (!positions || !node.visible) return;
    for (let index = 0; index < positions.count; index += 1) {
      point.fromBufferAttribute(positions, index).applyMatrix4(node.matrixWorld).project(camera);
      bounds.minX = Math.min(bounds.minX, point.x);
      bounds.maxX = Math.max(bounds.maxX, point.x);
      bounds.minY = Math.min(bounds.minY, point.y);
      bounds.maxY = Math.max(bounds.maxY, point.y);
    }
  });
  return {
    ...bounds,
    widthPx: ((bounds.maxX - bounds.minX) * TOWNES_COMPACT_SYSTEM_SAFE_ZONE.viewportWidth) / 2,
  };
}

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

  test("keeps the resonator and beam assembly legible in both compact audit states", () => {
    const { viewportWidth: width, viewportHeight: height } = TOWNES_COMPACT_SYSTEM_SAFE_ZONE;
    const compactSystem = townesMaserSystemCameraForViewport("system", width);
    expect(compactSystem).toEqual({ pos: [11.6, 12, 14], target: [-0.4, 0, 0] });
    expect(townesMaserSystemCameraForViewport("system", 718)).toEqual(
      TOWNES_MASER_DESKTOP_CAMERA_PRESETS.system,
    );
    for (const preset of ["generator", "modeSelector", "amplifier", "detector"] as const) {
      expect(townesMaserSystemCameraForViewport(preset, width)).toEqual(
        TOWNES_MASER_DESKTOP_CAMERA_PRESETS[preset],
      );
    }

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(...compactSystem.pos);
    camera.lookAt(...compactSystem.target);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();

    const auditStates = [
      { name: "primary-control", claim1PathPresent: 1 },
      { name: "claim-inverted", claim1PathPresent: 0 },
    ] as const;
    for (const audit of auditStates) {
      const model = buildTownesMaserSystemModel();
      try {
        const state = stepTownesMaserTopology({
          ...TOWNES_MASER_DEFAULT_CONTROLS,
          pumpExcitationPct: 100,
          claim1PathPresent: audit.claim1PathPresent,
        });
        model.setCutaway(true);
        for (const timeSec of [0, 1, 2]) {
          model.update(state, timeSec);
          model.root.updateMatrixWorld(true);

          const envelope = projectedObjectBounds(model.root, camera);
          expect(envelope.minX, `${audit.name}: generator remains in frame`).toBeGreaterThan(
            TOWNES_COMPACT_SYSTEM_SAFE_ZONE.minX,
          );
          expect(envelope.maxX, `${audit.name}: detector remains in frame`).toBeLessThan(
            TOWNES_COMPACT_SYSTEM_SAFE_ZONE.maxX,
          );
          expect(envelope.minY, `${audit.name}: bench remains in frame`).toBeGreaterThan(
            TOWNES_COMPACT_SYSTEM_SAFE_ZONE.minY,
          );
          expect(envelope.maxY, `${audit.name}: source blocks clear the toolbar`).toBeLessThan(
            TOWNES_COMPACT_SYSTEM_SAFE_ZONE.maxY,
          );
          expect(projectedObjectBounds(model.generator, camera).widthPx).toBeGreaterThan(
            TOWNES_COMPACT_SYSTEM_SAFE_ZONE.minimumGeneratorWidthPx,
          );
          expect(projectedObjectBounds(model.amplifier, camera).widthPx).toBeGreaterThan(
            TOWNES_COMPACT_SYSTEM_SAFE_ZONE.minimumAmplifierWidthPx,
          );
          expect(projectedObjectBounds(model.detector, camera).widthPx).toBeGreaterThan(
            TOWNES_COMPACT_SYSTEM_SAFE_ZONE.minimumDetectorWidthPx,
          );
          expect(projectedObjectBounds(model.modeSelector, camera).widthPx).toBeGreaterThan(
            TOWNES_COMPACT_SYSTEM_SAFE_ZONE.minimumModeSelectorWidthPx,
          );

          if (audit.claim1PathPresent === 1) {
            expect(model.generatorBeam.visible).toBe(true);
            expect(model.amplifierBeam.visible).toBe(true);
            expect(model.detectorBeam.visible).toBe(true);
            const beamPath = [
              projectedObjectBounds(model.generatorBeam, camera),
              projectedObjectBounds(model.amplifierBeam, camera),
              projectedObjectBounds(model.detectorBeam, camera),
            ];
            const beamPathWidthPx =
              ((Math.max(...beamPath.map((bounds) => bounds.maxX)) -
                Math.min(...beamPath.map((bounds) => bounds.minX))) *
                width) /
              2;
            expect(beamPathWidthPx).toBeGreaterThan(
              TOWNES_COMPACT_SYSTEM_SAFE_ZONE.minimumActiveBeamPathWidthPx,
            );
          } else {
            expect(model.generatorBeam.visible).toBe(false);
            expect(model.amplifierBeam.visible).toBe(false);
            expect(model.detectorBeam.visible).toBe(false);
          }
        }
      } finally {
        model.dispose();
      }
    }
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
