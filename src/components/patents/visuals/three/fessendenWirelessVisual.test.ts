import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import * as THREE from "three";
import { stepFessendenWireless } from "@/physics/catalogKernels";
import { fessendenWirelessCameraForViewport } from "./fessendenWirelessCamera";
import { articulateFessendenWireless, buildFessendenWirelessModel } from "./fessendenWirelessModel";

const DESKTOP_CANVAS = { width: 1216, height: 460 };
const TOP_OVERLAY_BOTTOM_PX = 66;
const BOTTOM_KERNEL_CHIPS_TOP_PX = 328;

function projectedApparatusBounds(
  root: THREE.Object3D,
  ignoredNodes: ReadonlySet<THREE.Object3D>,
  camera: THREE.PerspectiveCamera,
) {
  const projected: THREE.Vector3[] = [];
  root.traverse((node) => {
    if (ignoredNodes.has(node)) return;
    const positions = (node as THREE.Mesh).geometry?.getAttribute("position");
    if (!positions) return;
    const point = new THREE.Vector3();
    for (let index = 0; index < positions.count; index += 1) {
      projected.push(
        point
          .fromBufferAttribute(positions, index)
          .applyMatrix4(node.matrixWorld)
          .project(camera)
          .clone(),
      );
    }
  });
  return {
    minX: Math.min(...projected.map((projectedPoint) => projectedPoint.x)),
    maxX: Math.max(...projected.map((projectedPoint) => projectedPoint.x)),
    minY: Math.min(...projected.map((projectedPoint) => projectedPoint.y)),
    maxY: Math.max(...projected.map((projectedPoint) => projectedPoint.y)),
  };
}

describe("US 706,737 Reginald A. Fessenden Continuous-Wave Wireless visual & RF physics boundary", () => {
  const modelPath = resolve(
    process.cwd(),
    "src/components/patents/visuals/three/fessendenWirelessModel.ts",
  );
  const studioPath = resolve(
    process.cwd(),
    "src/components/patents/visuals/three/FessendenWireless3D.tsx",
  );
  const modelSource = readFileSync(modelPath, "utf8");
  const studioSource = readFileSync(studioPath, "utf8");

  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(studioSource).not.toContain("useGLTF");
    expect(studioSource).not.toContain("GLTFLoader");
    expect(studioSource).toContain('usePatentPhysics("us-706737-fessenden-wireless")');
    expect(studioSource).toContain("createThreeStudioScene");
    expect(studioSource).not.toContain("OrbitControls");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    expect(modelSource).not.toContain("Math.random()");
    expect(modelSource).not.toContain("Date.now()");
    expect(studioSource).not.toContain("Math.random()");
    expect(modelSource).not.toContain("timeSec * 1.5");
    expect(modelSource).not.toContain("timeSec * 30");
  });

  test("exposes authentic camera presets for continuous-wave radio inspection", () => {
    expect(studioSource).toContain('"isometric"');
    expect(studioSource).toContain('"alternator"');
    expect(studioSource).toContain('"cageAntenna"');
    expect(studioSource).toContain('"liquidBarretter"');
  });

  test("frames the complete claimed bench apparatus in the desktop overview without changing compact or inspection views", () => {
    const desktop = fessendenWirelessCameraForViewport("isometric", DESKTOP_CANVAS.width);
    expect(desktop).toEqual({ pos: [4.5, 5.5, 14.4], target: [0, -0.5, 0] });

    // The V24 tablet and phone canvases remain on their previously authored
    // composition. So do the deliberate close-inspection presets everywhere.
    expect(fessendenWirelessCameraForViewport("isometric", 718)).toEqual({
      pos: [3.5, 3.0, 4.5],
      target: [0, 1.2, 0],
    });
    expect(fessendenWirelessCameraForViewport("isometric", 341)).toEqual({
      pos: [3.5, 3.0, 4.5],
      target: [0, 1.2, 0],
    });
    expect(fessendenWirelessCameraForViewport("cageAntenna", DESKTOP_CANVAS.width)).toEqual({
      pos: [0.5, 2.2, 2.5],
      target: [0.5, 1.8, 0],
    });

    const nodes = buildFessendenWirelessModel();
    try {
      const camera = new THREE.PerspectiveCamera(
        42,
        DESKTOP_CANVAS.width / DESKTOP_CANVAS.height,
        0.1,
        1000,
      );
      camera.position.set(...desktop.pos);
      camera.lookAt(...desktop.target);
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();

      // The expanding cyan rings visualize radiated energy and deliberately
      // exceed the apparatus envelope. The claimed alternator, bench, cage,
      // conductor, detector, and receiver must all remain visible instead.
      const ignoredNodes = new Set<THREE.Object3D>(nodes.waveRings);
      for (const [state, carrierFrequencyKhz, directResponse] of [
        ["desktop default", 75, true],
        ["desktop primary-control maximum", 100, true],
        ["desktop claim-inverted", 75, false],
      ] as const) {
        articulateFessendenWireless(nodes, {
          timeSec: 1,
          carrierFrequencyKhz,
          radiatedPowerWatts: 650,
          audioModulationPct: 65,
          isResonant: carrierFrequencyKhz === 75,
          waveRingDisplayRate: 1.5,
          headsetDisplayOmegaRadPerS: 30,
          audioEnvelopeOmegaRadPerS: 6,
          directResponse,
        });
        nodes.root.updateMatrixWorld(true);
        const frame = projectedApparatusBounds(nodes.root, ignoredNodes, camera);
        const topPx = ((1 - frame.maxY) * DESKTOP_CANVAS.height) / 2;
        const bottomPx = ((1 - frame.minY) * DESKTOP_CANVAS.height) / 2;
        const widthPx = ((frame.maxX - frame.minX) * DESKTOP_CANVAS.width) / 2;
        const heightPx = ((frame.maxY - frame.minY) * DESKTOP_CANVAS.height) / 2;

        expect(frame.minX, `${state} left canvas edge`).toBeGreaterThan(-0.3);
        expect(frame.maxX, `${state} right canvas edge`).toBeLessThan(0.3);
        expect(topPx - TOP_OVERLAY_BOTTOM_PX, `${state} top UI clearance`).toBeGreaterThan(12);
        expect(
          BOTTOM_KERNEL_CHIPS_TOP_PX - bottomPx,
          `${state} lower telemetry clearance`,
        ).toBeGreaterThan(16);
        expect(widthPx, `${state} apparatus coverage`).toBeGreaterThan(260);
        expect(heightPx, `${state} apparatus coverage`).toBeGreaterThan(220);
      }
    } finally {
      nodes.materials.forEach((material) => {
        material.dispose();
      });
    }
  });

  test("keeps the registered claim probe outside optional responsive HUD chrome", () => {
    const probeIndex = studioSource.indexOf(
      '<ClaimConstraintToggle\n            patentId="us-706737-fessenden-wireless"',
    );
    const optionalHudIndex = studioSource.indexOf("{/* Top-Left Camera Preset Toolbar */}");
    expect(probeIndex).toBeGreaterThan(0);
    expect(optionalHudIndex).toBeGreaterThan(probeIndex);
  });

  test("computes genuine Thomson LC resonance, antenna efficiency, and thermal demodulation in SI units", () => {
    const simTuned = stepFessendenWireless({
      carrierFrequencyKhz: 75,
      antennaTuningUh: 450,
      antennaCageDiameterM: 2.4,
      transmissionDistanceKm: 25,
      audioModulationPct: 65,
    });

    expect(simTuned.carrierFrequencyKhz).toBe(75);
    expect(simTuned.antennaCapacitancePf).toBe(10000);
    expect(simTuned.antennaResonantFreqKhz).toBeCloseTo(75.03, 1);
    expect(simTuned.radiationEfficiencyPct).toBeGreaterThan(70);
    expect(simTuned.radiatedPowerWatts).toBeGreaterThan(100);
    expect(simTuned.receivedPowerMicrowatts).toBeGreaterThan(0.01);
    expect(simTuned.audioSnrDb).toBeGreaterThan(10);
    expect(simTuned.audioSoundLevelDbSpl).toBeGreaterThan(30);
    expect(simTuned.waveRingDisplayRate).toBeCloseTo(1.5, 3);
    expect(simTuned.headsetDisplayOmegaRadPerS).toBeCloseTo(30, 3);
    expect(simTuned.audioEnvelopeOmegaRadPerS).toBeCloseTo(6, 3);
    expect(simTuned.rfTraceDisplayOmegaRadPerS).toBeCloseTo(50, 3);
    expect(simTuned.barretterGlowOmegaRadPerS).toBeCloseTo(20, 3);
    expect(simTuned.telephoneRingDisplayOmegaRadPerS).toBeCloseTo(40, 3);
    const doubled = stepFessendenWireless({
      carrierFrequencyKhz: 150,
      audioFrequencyHz: 2000,
    });
    expect(doubled.waveRingDisplayRate).toBeCloseTo(3.0, 3);
    expect(doubled.headsetDisplayOmegaRadPerS).toBeCloseTo(60, 3);

    const simDetuned = stepFessendenWireless({
      carrierFrequencyKhz: 130,
      antennaTuningUh: 200,
    });
    expect(simDetuned.detuningKhz).toBeGreaterThan(5);
  });

  test("builds and articulates procedural alternator, cage antenna, and wave rings correctly", () => {
    const nodes = buildFessendenWirelessModel();
    expect(nodes.root.children.length).toBeGreaterThanOrEqual(4);
    expect(nodes.cageWires.length).toBeGreaterThanOrEqual(8);
    expect(nodes.waveRings.length).toBe(5);

    const tuned = stepFessendenWireless({
      carrierFrequencyKhz: 75,
      audioFrequencyHz: 1000,
    });
    articulateFessendenWireless(nodes, {
      timeSec: 1.0,
      carrierFrequencyKhz: 75,
      radiatedPowerWatts: 650,
      audioModulationPct: 65,
      isResonant: true,
      waveRingDisplayRate: tuned.waveRingDisplayRate,
      headsetDisplayOmegaRadPerS: tuned.headsetDisplayOmegaRadPerS,
      audioEnvelopeOmegaRadPerS: tuned.audioEnvelopeOmegaRadPerS,
    });

    expect(nodes.alternatorRotor.rotation.x).toBeDefined();
    expect(nodes.waveRings[0].scale.x).toBeGreaterThan(0);
    nodes.materials.forEach((material) => {
      material.dispose();
    });
  });
});
