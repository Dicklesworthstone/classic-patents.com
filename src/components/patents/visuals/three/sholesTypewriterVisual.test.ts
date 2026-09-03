import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import {
  advanceSholesTypewriterCycle,
  stepSholesTypewriter,
  stepSholesTypewriterAtCycle,
} from "@/physics/machineKernels";
import {
  buildSholesTypewriterModel,
  updateSholesTypewriterKinematics,
} from "./sholesTypewriterModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals");

describe("US 79,265 Christopher Latham Sholes Type-Writer visual & escapement boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "sholesTypewriterModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "SholesTypewriter3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("useGLTF");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(threeSource).not.toContain("useGLTF");
    expect(threeSource).toContain("demonstrationCadence"); // live object is live.current since the bus refactor
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "sholesTypewriterModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "SholesTypewriter3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("performance.now()");
  });

  test("exposes authentic camera presets and UI overlay for typewriter mechanism inspection", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "SholesTypewriter3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "type_basket",
      "platen_carriage",
      "keyboard",
      "escapement_ratchet",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }
  });

  test("computes genuine key stroke frequency, events per second, and escapement advance in SI units", () => {
    const result = stepSholesTypewriter(40, 0.5);
    expect(result.eventsPerSecond).toBeGreaterThan(0.5);
    expect(result.keyCyclePct).toBeDefined();
    expect(result.ratchetReleasePct).toBeDefined();
    expect(result.displayColumnWrap).toBe(12);
    expect(result.columnPitchPx).toBe(6);
    expect(result.typebarOuterRx).toBe(140);
    expect(result.ratchetSvgR).toBe(18);
    expect(result.typebarYawAmp).toBe(0.12);
    expect(result.carriagePitchStudio).toBe(0.18);
    expect(result.keysPerRow).toBe(10);
  });

  test("carries the animation pose through cadence changes and returns explicitly at the display line end", () => {
    const accumulatedCycles = advanceSholesTypewriterCycle(0, 40, 10);
    const slowPose = stepSholesTypewriterAtCycle(40, accumulatedCycles);
    const fastPose = stepSholesTypewriterAtCycle(120, accumulatedCycles);
    const lineEndPose = stepSholesTypewriterAtCycle(40, 12.2);

    expect(fastPose.totalEscapementSteps).toBeCloseTo(slowPose.totalEscapementSteps, 10);
    expect(lineEndPose.requiresManualCarriageReturn).toBe(true);
    expect(lineEndPose.displayCarriageSteps).toBe(12);
    expect(lineEndPose.typebarStrokePct).toBe(0);
  });

  test("builds and articulates procedural wooden table, radial type basket, platen carriage, and escapement ratchet correctly", () => {
    const model = buildSholesTypewriterModel();
    expect(model.rootGroup.children.length).toBeGreaterThan(0);
    expect(model.nodes.table).toBeDefined();
    expect(model.nodes.basketGroup).toBeDefined();
    expect(model.nodes.platen).toBeDefined();
    expect(model.nodes.escapement).toBeDefined();
    expect(model.nodes.keyboardGroup).toBeDefined();
    expect(model.nodes.typeBars.length).toBeGreaterThan(10);

    // Test kinematics update
    updateSholesTypewriterKinematics(model.nodes, model.materials, 0.5, 0, false, 40, 7.5, 7.5);
    expect(model.nodes.platen.position.x).toBeDefined();
    expect(model.nodes.keyCapsMesh.count).toBe(40);
    expect(model.nodes.keyBezelsMesh.count).toBe(40);
    expect(model.nodes.pullWires?.count).toBe(24);
    expect(model.nodes.escapement.rotation.x).toBeCloseTo(7.5 * 0.06, 8);
    expect(model.nodes.ribbonSpoolLeft?.rotation.y).toBeCloseTo(-7.5 * 0.02, 8);
    expect(model.nodes.ribbonSpoolRight?.rotation.y).toBeCloseTo(7.5 * 0.02, 8);

    const keyCapMatrix = new THREE.Matrix4();
    const keyCapPosition = new THREE.Vector3();
    model.nodes.keyCapsMesh.getMatrixAt(0, keyCapMatrix);
    keyCapMatrix.decompose(keyCapPosition, new THREE.Quaternion(), new THREE.Vector3());
    expect(keyCapPosition.y).toBeCloseTo(0.25 - 0.16 * 0.5, 8);

    const keyBezelMatrix = new THREE.Matrix4();
    const keyBezelPosition = new THREE.Vector3();
    model.nodes.keyBezelsMesh.getMatrixAt(0, keyBezelMatrix);
    keyBezelMatrix.decompose(keyBezelPosition, new THREE.Quaternion(), new THREE.Vector3());
    expect(keyBezelPosition.y).toBeCloseTo(0.25 - 0.16 * 0.5 + 0.08, 8);

    const escapementAngle = model.nodes.escapement.rotation.x;
    const ribbonAngle = model.nodes.ribbonSpoolLeft?.rotation.y;
    updateSholesTypewriterKinematics(model.nodes, model.materials, 0.5, 0, false, 40, 7.5, 7.5);
    expect(model.nodes.escapement.rotation.x).toBe(escapementAngle);
    expect(model.nodes.ribbonSpoolLeft?.rotation.y).toBe(ribbonAngle);

    updateSholesTypewriterKinematics(model.nodes, model.materials, 0, 0, false, 40, 20, 12);
    expect(model.nodes.carriageGroup.position.x).toBeCloseTo(-2.16, 8);

    model.dispose();
  });

  test("uses the transport registration disposer so a stale visual cannot unregister a replacement updater", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "SholesTypewriter3D.tsx"),
      "utf8",
    );

    expect(threeSource).toContain("return globalTransportBus.registerUpdater(");
    expect(threeSource).not.toContain(
      'return () => globalTransportBus.unregisterUpdater("us-79265-sholes-typewriter")',
    );
  });
});
