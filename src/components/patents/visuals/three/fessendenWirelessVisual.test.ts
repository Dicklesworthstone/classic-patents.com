import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { stepFessendenWireless } from "@/physics/catalogKernels";
import { articulateFessendenWireless, buildFessendenWirelessModel } from "./fessendenWirelessModel";

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
