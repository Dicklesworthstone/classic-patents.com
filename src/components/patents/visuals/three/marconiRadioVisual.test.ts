import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { coupleEdgesFor } from "@/physics/coupleGraph";
import { ENERGY_CHANNEL_OMISSION_REASONS, energyChannelsFor } from "@/physics/energyChannels";
import { computeParameterSensitivity } from "@/physics/sensitivityKernel";
import { PATENT_PHYSICS_REGISTRY } from "@/physics/telemetryData";
import { spectralModes } from "@/physics/weaveSurfaces";
import { marconiViewForViewport } from "./MarconiRadio3D";
import {
  buildMarconiRadioModel,
  type MarconiRadioKinematicsState,
  updateMarconiRadioKinematics,
} from "./marconiRadioModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

function kinematics(
  overrides: Partial<MarconiRadioKinematicsState> = {},
): MarconiRadioKinematicsState {
  return {
    mastStudioScale: 1,
    sparkGapStudioHalfSpan: 0.44,
    wavefrontProgress: 0.75,
    sparkActive: true,
    waveActive: true,
    showEmWavefronts: true,
    receiverConducting: false,
    relayActive: false,
    resetActive: false,
    resetPhase: 0,
    isCutaway: false,
    ...overrides,
  };
}

describe("US 586,193 Guglielmo Marconi Wireless Radio Telegraphy visual & electromagnetics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "MarconiRadio3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "marconiRadioModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildMarconiRadioModel");
    expect(modelSource).toContain("updateMarconiRadioKinematics");
    expect(modelSource).toContain("wavefrontProgress");
    expect(modelSource).not.toContain("wave2dFrames");
    expect(modelSource).not.toContain("waveFrameRms");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "MarconiRadio3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "marconiRadioModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes transmitter, full-system, and receiver/reset camera presets with cutaway", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "MarconiRadio3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "full_system",
      "receiver",
      "spark_gap",
      "induction_coil",
      "aerial_monopole",
      "morse_key",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Marconi Wireless Radio 3D");
    expect(threeSource).toContain("controls.setView");
    expect(threeSource).not.toContain("camera.position.set");
  });

  test("keeps the complete apparatus legible without making it microscopic on desktop", () => {
    const desktop = marconiViewForViewport("iso", 1200);
    const tablet = marconiViewForViewport("iso", 768);
    const phone = marconiViewForViewport("iso", 320);
    const distance = (view: typeof desktop) =>
      Math.hypot(
        view.pos[0] - view.target[0],
        view.pos[1] - view.target[1],
        view.pos[2] - view.target[2],
      );
    expect(desktop.pos).toEqual([13, 8.5, 15.5]);
    expect(desktop.target).toEqual([1.8, 0.8, 0]);
    expect(distance(desktop)).toBeLessThan(21);
    expect(distance(tablet) / distance(desktop)).toBeCloseTo(1.08, 8);
    expect(distance(phone) / distance(desktop)).toBeCloseTo(1.35, 8);
  });

  test("routes both faces and the badge through one shared source-bounded runtime tape", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "MarconiRadio3D.tsx"),
      "utf8",
    );
    const twoSource = readFileSync(join(VISUALS_DIRECTORY, "MarconiRadioSim.tsx"), "utf8");
    const ownerSource = readFileSync(
      join(VISUALS_DIRECTORY, "PatentPhysicsRuntimeOwner.tsx"),
      "utf8",
    );
    const sharedKernelSource = readFileSync(
      join(process.cwd(), "src/physics/marconiSharedKernel.ts"),
      "utf8",
    );
    const dispatcherSource = readFileSync(join(VISUALS_DIRECTORY, "index.tsx"), "utf8");

    for (const source of [threeSource, twoSource]) {
      expect(source).toContain("readMarconiRuntimeControls");
      expect(source).toContain("readMarconiTapeFrame");
      expect(source).toContain("sparkPulseSequence");
      expect(source).not.toContain("Estimated Range");
      expect(source).not.toContain("PREDICTED RANGE");
      expect(source).not.toContain("Peak RF Power");
      expect(source).not.toContain("Radiation Resistance");
    }
    expect(twoSource).not.toContain("setInterval");
    expect(twoSource).not.toContain("useState<boolean>(false)");
    for (const forbidden of [
      "resonantFreq",
      "peakRfPower",
      "maxRangeMiles",
      "radiationResistanceOhms",
      "marconiSparkSpectrum",
    ]) {
      expect(sharedKernelSource).not.toContain(forbidden);
      expect(twoSource).not.toContain(forbidden);
      expect(threeSource).not.toContain(forbidden);
    }
    expect(sharedKernelSource).toContain("isRefused: true");
    expect(ownerSource).toContain("createMarconiTransportUpdater");
    expect(ownerSource).toContain("data-receiver-stage");
    expect(dispatcherSource).toContain("<MarconiPhysicsRuntimeOwner patentId={patentId} />");
  });

  test("replays the same spark geometry from a fresh model and disposes owned GPU resources", () => {
    const first = buildMarconiRadioModel();
    const second = buildMarconiRadioModel();
    expect([...first.nodes.sparkParticlePos]).toEqual([...second.nodes.sparkParticlePos]);

    for (const model of [first, second]) {
      updateMarconiRadioKinematics(
        model.nodes,
        model.materials,
        kinematics({ sparkActive: true, waveActive: true, isCutaway: true }),
      );
    }
    expect([...first.nodes.arcPositions]).toEqual([...second.nodes.arcPositions]);
    expect([...first.nodes.sparkParticlePos]).toEqual([...second.nodes.sparkParticlePos]);

    let materialDisposals = 0;
    let geometryDisposals = 0;
    first.materials.detector.addEventListener("dispose", () => materialDisposals++);
    first.nodes.coherer.geometry.addEventListener("dispose", () => geometryDisposals++);
    first.dispose();
    second.dispose();
    expect(materialDisposals).toBe(1);
    expect(geometryDisposals).toBe(1);
  });

  test("refuses unsupported RF frequency, power, range, spectrum, and energy outputs", () => {
    const metadata = PATENT_PHYSICS_REGISTRY["us-586193-marconi-radio"];
    const params = Object.fromEntries(
      metadata.controls.map((control) => [control.id, control.defaultValue]),
    );
    const metrics = metadata.computeMetrics(params);
    const labels = metrics.map((metric) => metric.label);

    expect(metadata.refreshFromRuntimeTape).toBe(true);
    expect(metadata.engineMethod).toContain("source-bounded fixed-step causal tape");
    expect(labels).toContain("Receiver Sequence");
    expect(labels).toContain("Sensitive-Tube Current Limit");
    expect(labels).toContain("Single-Cell EMF Limit");
    expect(labels).not.toContain("Resonant Frequency");
    expect(labels).not.toContain("Peak RF Power");
    expect(labels).not.toContain("Radiation Resistance");
    expect(labels).not.toContain("Estimated Range");
    expect(energyChannelsFor("us-586193-marconi-radio", params)).toEqual([]);
    expect(coupleEdgesFor("us-586193-marconi-radio", params)).toEqual([]);
    expect(spectralModes("us-586193-marconi-radio", params)).toEqual([]);
    expect(
      computeParameterSensitivity("us-586193-marconi-radio", "antennaHeightM", params),
    ).toBeNull();
    expect(
      computeParameterSensitivity("us-586193-marconi-radio", "sparkVoltageKv", params),
    ).toBeNull();
    expect(ENERGY_CHANNEL_OMISSION_REASONS["us-586193-marconi-radio"]).toContain(
      "no inductance, capacitance",
    );
  });

  test("builds a connected receiver causal chain and articulates it from the deterministic spark pulse", () => {
    const { rootGroup, nodes, materials, dispose } = buildMarconiRadioModel();
    expect(rootGroup.children.length).toBeGreaterThan(2);
    expect(nodes.sparkBalls.length).toBe(4);
    expect(nodes.sparkPillars.length).toBe(4);
    expect(nodes.waveRings.length).toBe(5);
    expect(nodes.mast).toBeDefined();
    expect(nodes.sparkArc).toBeDefined();
    expect(rootGroup.getObjectByName("Aerial-to-spark conductor")).toBeDefined();
    expect(rootGroup.getObjectByName("Spark-to-earth conductor")).toBeDefined();
    expect(rootGroup.getObjectByName("coherer_receiver_and_reset")).toBeDefined();
    expect(rootGroup.getObjectByName("metallic_powder_coherer_detector")).toBeDefined();
    expect(rootGroup.getObjectByName("local_circuit_relay_armature")).toBeDefined();
    expect(rootGroup.getObjectByName("coherer_trembler_reset")).toBeDefined();
    expect(rootGroup.getObjectByName("receiver_insulated_elevated_conductor")).toBeDefined();
    expect(rootGroup.getObjectByName("receiver_aerial_support_mast")).toBeDefined();
    expect(rootGroup.getObjectByName("receiver_earth_connection")).toBeDefined();
    expect(rootGroup.getObjectByName("receiver_aerial_choking_coil")).toBeDefined();
    expect(rootGroup.getObjectByName("receiver_earth_choking_coil")).toBeDefined();
    expect(rootGroup.getObjectByName("receiver_local_battery")).toBeDefined();
    expect(rootGroup.getObjectByName("receiver_aerial_to_coherer")).toBeDefined();
    expect(rootGroup.getObjectByName("coherer_to_receiver_earth")).toBeDefined();
    expect(rootGroup.getObjectByName("coherer_to_relay_local_circuit")).toBeDefined();
    expect(rootGroup.getObjectByName("relay_to_local_battery")).toBeDefined();
    expect(rootGroup.getObjectByName("local_battery_to_coherer")).toBeDefined();
    expect(rootGroup.getObjectByName("relay_to_trembler_reset")).toBeDefined();
    expect(rootGroup.getObjectByName("trembler_tapper_linkage")).toBeDefined();
    expect(rootGroup.getObjectByName("coherer_receiver_and_reset")?.position.x).toBe(6.5);

    updateMarconiRadioKinematics(nodes, materials, kinematics({ sparkGapStudioHalfSpan: 0.54 }));
    expect(nodes.sparkBalls[1].position.x).toBeCloseTo(-0.54, 8);
    expect(nodes.sparkBalls[2].position.x).toBeCloseTo(0.54, 8);
    expect(nodes.sparkPillars[1].position.x).toBe(nodes.sparkBalls[1].position.x);
    expect(nodes.sparkPillars[2].position.x).toBe(nodes.sparkBalls[2].position.x);
    expect(nodes.sparkBalls[2].position.x - nodes.sparkBalls[1].position.x).toBeGreaterThan(0.7);
    expect(nodes.arcPositions[0]).toBeCloseTo(-0.19, 6);
    expect(nodes.arcPositions[nodes.arcPositions.length - 3]).toBeCloseTo(0.19, 6);

    const endpoint = (name: string, fromStart: boolean) => {
      const line = rootGroup.getObjectByName(name) as THREE.Line;
      const positions = line.geometry.getAttribute("position");
      const offset = fromStart ? 0 : positions.count - 1;
      return new THREE.Vector3().fromBufferAttribute(positions, offset);
    };
    expect(
      endpoint("receiver_aerial_to_coherer", true).distanceTo(new THREE.Vector3(-1.55, 0, 0)),
    ).toBeLessThan(1e-6);
    expect(
      endpoint("receiver_aerial_to_coherer", false).distanceTo(new THREE.Vector3(-2.2, 0.95, 0)),
    ).toBeLessThan(1e-6);
    expect(
      endpoint("coherer_to_receiver_earth", true).distanceTo(new THREE.Vector3(-0.15, 0, 0)),
    ).toBeLessThan(1e-6);
    expect(
      endpoint("coherer_to_receiver_earth", false).distanceTo(new THREE.Vector3(-0.15, -1.185, 0)),
    ).toBeLessThan(1e-6);

    updateMarconiRadioKinematics(
      nodes,
      materials,
      kinematics({ receiverConducting: true, relayActive: true, isCutaway: true }),
    );
    expect(materials.mahoganyBase.transparent).toBe(true);
    expect(nodes.guyLinePositions[1]).toBeCloseTo(nodes.mastBaseY + 9.15, 5);
    expect(nodes.relayArmature.rotation.z).toBeCloseTo(-0.16, 5);
    expect(materials.detector.emissiveIntensity ?? 0).toBeGreaterThan(0);
    expect(materials.receiverLamp.emissiveIntensity ?? 0).toBeGreaterThan(1);

    updateMarconiRadioKinematics(
      nodes,
      materials,
      kinematics({
        mastStudioScale: 0.5,
        sparkActive: false,
        waveActive: false,
        resetActive: true,
        resetPhase: 0.125,
      }),
    );
    expect(nodes.guyLinePositions[1]).toBeCloseTo(nodes.mastBaseY + 9.15 * 0.5, 5);
    expect(nodes.relayArmature.rotation.z).toBe(0);
    expect(materials.detector.emissiveIntensity ?? 0).toBe(0);
    expect(Math.abs(nodes.tremblerArmature.rotation.z)).toBeGreaterThan(0);

    updateMarconiRadioKinematics(
      nodes,
      materials,
      kinematics({
        mastStudioScale: 0.5,
        sparkActive: false,
        waveActive: false,
      }),
    );
    expect(nodes.tremblerArmature.rotation.z).toBe(0);
    expect(materials.receiverLamp.emissiveIntensity).toBeCloseTo(0.15, 8);

    dispose();
  });
});
