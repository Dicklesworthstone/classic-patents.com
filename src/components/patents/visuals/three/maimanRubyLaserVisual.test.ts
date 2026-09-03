import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { stepMaimanRubyLaser } from "@/physics/catalogKernels";
import { applyClaimConstraintModifications } from "@/physics/claimConstraints";
import { energyChannelsFor } from "@/physics/energyChannels";
import { createMaimanRubyLaserModel } from "./maimanRubyLaserModel";

function named(root: THREE.Object3D, name: string) {
  const object = root.getObjectByName(name);
  expect(object, `missing ${name}`).toBeDefined();
  return object as THREE.Object3D;
}

function bounds(object: THREE.Object3D) {
  object.updateWorldMatrix(true, true);
  return new THREE.Box3().setFromObject(object);
}

function expectContact(a: THREE.Object3D, b: THREE.Object3D) {
  expect(bounds(a).intersectsBox(bounds(b))).toBe(true);
}

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
    expect(studioCode).toContain("createThreeStudioScene");
    expect(studioCode).toContain("useLiveSimParams");
    expect(studioCode).toContain("effectiveParams");
    expect(studioCode).toContain("claimConstraintStateParamId");
    expect(studioCode).toContain("energyChannelsFor");
    expect(studioCode).not.toContain("us-3353115-maiman-laser");
    expect(studioCode).not.toContain("pumpPowerWatts");
    expect(studioCode).not.toContain("setClaimStates");
    expect(studioCode.match(/<ClaimConstraintToggle/g)).toHaveLength(1);
    expect(studioCode).not.toContain("OrbitControls");
    expect(studioCode).not.toContain("new THREE.WebGLRenderer");
    expect(studioCode).not.toContain(
      "pumpEnergy, flashDuration, rodLength, outputReflectivity, temperature",
    );
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelPath = join(root, "src/components/patents/visuals/three/maimanRubyLaserModel.ts");
    const modelCode = readFileSync(modelPath, "utf8");

    expect(modelCode).not.toContain("Math.random()");
    expect(modelCode).not.toContain("Date.now()");
    expect(modelCode).not.toContain("performance.now()");
    expect(modelCode).toContain("depthWrite: false");
    expect(modelCode).not.toContain("timeSec * 80");
    expect(modelCode).toContain("beamShimmerOmegaRadPerS");
  });

  test("computes genuine three-level population inversion, laser threshold, and peak power in SI units", () => {
    // Below threshold (pump = 50 J)
    const below = stepMaimanRubyLaser({ pumpEnergyJoules: 50 });
    expect(below.isLasing).toBe(false);
    expect(below.laserPulseEnergyJoules).toBe(0);
    expect(below.laserPeakPowerKw).toBe(0);
    expect(below.beamShimmerOmegaRadPerS).toBe(0);

    // Above threshold (pump = 200 J)
    const above = stepMaimanRubyLaser({ pumpEnergyJoules: 200 });
    expect(above.isLasing).toBe(true);
    expect(above.populationInversionRatio).toBeGreaterThan(1.0);
    expect(above.laserPulseEnergyJoules).toBeGreaterThan(0);
    expect(above.laserPeakPowerKw).toBeGreaterThan(0);
    expect(above.emissionWavelengthNm).toBeCloseTo(694.3, 1);
    expect(above.beamShimmerOmegaRadPerS).toBe(80);
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
    expect((model.nodes.laserBeam.material as THREE.MeshBasicMaterial).opacity).toBe(0.0);

    // Update with lasing flash condition
    model.update({ pumpEnergyJoules: 250 }, 0.1, true);
    expect((model.nodes.laserBeam.material as THREE.MeshBasicMaterial).opacity).toBeGreaterThan(
      0.5,
    );

    model.dispose();
  });

  test("connects the complete optical and structural path instead of floating components", () => {
    const model = createMaimanRubyLaserModel();
    model.update({ rodLengthCm: 5, pumpEnergyJoules: 150 }, 0, false);
    const root = model.nodes.group;
    const bench = named(root, "Connected optical-bench foundation");
    const rearMount = named(root, "Rear reflector saddle support");
    const outputMount = named(root, "Output reflector saddle support");
    const housing = named(root, "Reflective outer cylinder 38");
    const rearFlange = named(root, "Rear reflector housing flange");
    const outputFlange = named(root, "Output reflector housing flange");
    const rod = named(root, "Chromium-doped ruby rod 26");
    const rearMirror = named(root, "Highly reflective end coating 30");
    const outputMirror = named(root, "Partially silvered output coating around aperture 32");
    const aperture = named(root, "Nonreflective output aperture 32");
    const beam = named(root, "Coherent output beam 34");
    const witness = named(root, "Beam witness disc (display context)");
    const witnessPost = named(root, "Beam witness support post");
    const witnessFoot = named(root, "Beam witness foundation foot");

    expectContact(bench, rearMount);
    expectContact(bench, outputMount);
    expectContact(rearMount, housing);
    expectContact(outputMount, housing);
    expectContact(housing, rearFlange);
    expectContact(housing, outputFlange);
    expectContact(rod, rearMirror);
    expectContact(rod, outputMirror);
    expect((outputMirror as THREE.Mesh).geometry).toBeInstanceOf(THREE.RingGeometry);
    expect(
      outputMirror
        .getWorldPosition(new THREE.Vector3())
        .distanceTo(aperture.getWorldPosition(new THREE.Vector3())),
    ).toBeLessThan(0.003);
    expectContact(aperture, beam);
    expectContact(beam, witness);
    expectContact(witness, witnessPost);
    expectContact(witnessPost, witnessFoot);
    expectContact(witnessFoot, bench);
    expectContact(
      named(root, "Anode lead from flash-tube end to feedthrough"),
      named(root, "Anode ceramic feedthrough"),
    );
    expectContact(
      named(root, "Cathode lead from flash-tube end to feedthrough"),
      named(root, "Cathode ceramic feedthrough"),
    );

    model.dispose();
  });

  test("moves the rod, resonator, lamp, supports, beam, and witness as one parametric assembly", () => {
    const model = createMaimanRubyLaserModel();
    model.update({ rodLengthCm: 2 }, 0, false);
    const shortRodWidth = bounds(model.nodes.rubyRod).getSize(new THREE.Vector3()).x;
    const shortHousingWidth = bounds(model.nodes.housingCylinder).getSize(new THREE.Vector3()).x;
    const shortTargetX = model.nodes.targetDisc.getWorldPosition(new THREE.Vector3()).x;

    model.update({ rodLengthCm: 10 }, 0, false);
    const longRodWidth = bounds(model.nodes.rubyRod).getSize(new THREE.Vector3()).x;
    const longHousingWidth = bounds(model.nodes.housingCylinder).getSize(new THREE.Vector3()).x;
    const longTargetX = model.nodes.targetDisc.getWorldPosition(new THREE.Vector3()).x;

    expect(longRodWidth).toBeGreaterThan(shortRodWidth);
    expect(longHousingWidth).toBeGreaterThan(shortHousingWidth);
    expect(longTargetX).toBeGreaterThan(shortTargetX);
    expectContact(model.nodes.outputMirror, model.nodes.laserBeam);
    expectContact(model.nodes.laserBeam, model.nodes.targetDisc);
    model.dispose();
  });

  test("replays cavity photons deterministically from phase instead of accumulating per frame", () => {
    const model = createMaimanRubyLaserModel();
    model.update({ pumpEnergyJoules: 200 }, 0.42, true);
    const positions = model.nodes.excitationPhotons.geometry.getAttribute("position");
    const first = [positions.getX(0), positions.getY(0), positions.getZ(0)];
    model.update({ pumpEnergyJoules: 200 }, 0.42, true);
    expect([positions.getX(0), positions.getY(0), positions.getZ(0)]).toEqual(first);
    model.dispose();
  });

  test("shares claim inversion and closes the scenario pulse-power balance", () => {
    const inverted = applyClaimConstraintModifications(
      "us-3353115-maiman-ruby-laser",
      { pumpEnergyJoules: 500, flashDurationMs: 1 },
      { 1: false },
    );
    expect(inverted.modifiedParams.pumpEnergyJoules).toBe(50);
    expect(stepMaimanRubyLaser(inverted.modifiedParams).isLasing).toBe(false);

    const channels = energyChannelsFor("us-3353115-maiman-ruby-laser", {
      pumpEnergyJoules: 150,
      flashDurationMs: 1,
    });
    const input = channels.find((channel) => channel.tone === "in")?.watts ?? 0;
    const useful = channels.find((channel) => channel.tone === "useful")?.watts ?? 0;
    const loss = channels.find((channel) => channel.tone === "loss")?.watts ?? 0;
    expect(input).toBe(150_000);
    expect(useful).toBeCloseTo(
      stepMaimanRubyLaser({ pumpEnergyJoules: 150, flashDurationMs: 1 }).laserPulseEnergyJoules /
        0.001,
      8,
    );
    expect(input).toBeCloseTo(useful + loss, 8);
  });
});
