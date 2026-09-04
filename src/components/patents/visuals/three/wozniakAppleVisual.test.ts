import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { stepWozniakApple } from "@/physics/catalogKernels";
import { wozniakAppleCameraForViewport } from "./wozniakAppleCamera";
import { buildWozniakAppleModel } from "./wozniakAppleModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

function projectedObjectBounds(object: THREE.Object3D, camera: THREE.PerspectiveCamera) {
  object.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(object);
  const frame = {
    minX: Number.POSITIVE_INFINITY,
    maxX: Number.NEGATIVE_INFINITY,
    minY: Number.POSITIVE_INFINITY,
    maxY: Number.NEGATIVE_INFINITY,
  };

  for (const x of [bounds.min.x, bounds.max.x]) {
    for (const y of [bounds.min.y, bounds.max.y]) {
      for (const z of [bounds.min.z, bounds.max.z]) {
        const projected = new THREE.Vector3(x, y, z).project(camera);
        frame.minX = Math.min(frame.minX, projected.x);
        frame.maxX = Math.max(frame.maxX, projected.x);
        frame.minY = Math.min(frame.minY, projected.y);
        frame.maxY = Math.max(frame.maxY, projected.y);
      }
    }
  }
  return frame;
}

describe("US 4,136,359 Steve Wozniak Apple II Microcomputer visual & bus timing boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "WozniakApple3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "wozniakAppleModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildWozniakAppleModel");
    expect(modelSource).not.toContain("?? 4.0");
    expect(threeSource).not.toContain("cpuClockMhz * 4.0");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "WozniakApple3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "wozniakAppleModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and UI overlay for microcomputer observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "WozniakApple3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "cpu", "ram_matrix", "slots", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("Apple II Bus Telemetry");
    expect(threeSource).toContain("wozniakAppleCameraForViewport");
  });

  test("keeps the full motherboard and chassis relationship legible in the exact 320px phone canvas", () => {
    const model = buildWozniakAppleModel();
    try {
      expect(wozniakAppleCameraForViewport("iso", 1216, 460)).toEqual({
        pos: [0, 8, 9.5],
        target: [0, 0, 0],
      });
      expect(wozniakAppleCameraForViewport("iso", 718, 460)).toEqual(
        wozniakAppleCameraForViewport("iso", 1216, 460),
      );

      // V26's 320px browser viewport produces a 286 × 380px studio canvas.
      // The source-model footprint is fixed by the motherboard/chassis; test
      // both its active interleaved-bus maximum and the claim-inverted
      // comparison. The claim toggle changes the source-reading explanation,
      // not the board/chassis geometry, so both must keep this same envelope.
      const canvasWidth = 286;
      const canvasHeight = 380;
      const view = wozniakAppleCameraForViewport("iso", canvasWidth, canvasHeight);
      const camera = new THREE.PerspectiveCamera(42, canvasWidth / canvasHeight, 0.1, 1000);
      camera.position.set(...view.pos);
      camera.lookAt(...view.target);
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();

      const primaryMaximum = stepWozniakApple({ crystalFreq: 28, ramCapacityKb: 48 });
      for (const [stateName, busDisplaySpeed, isCpuActive] of [
        ["primary control maximum", primaryMaximum.busDisplaySpeed, true],
        ["claim-inverted comparison", primaryMaximum.busDisplaySpeed, true],
      ] as const) {
        for (const cutaway of [false, true]) {
          model.setCutaway?.(cutaway);
          model.updateKinematics(0.4, 12, busDisplaySpeed, isCpuActive);
          model.root.updateMatrixWorld(true);

          const apparatus = projectedObjectBounds(model.root, camera);
          const chassis = projectedObjectBounds(model.chassis, camera);
          const motherboard = projectedObjectBounds(model.motherboard, camera);

          expect(apparatus.minX, `${stateName} ${cutaway} left edge`).toBeGreaterThan(-0.8);
          expect(apparatus.maxX, `${stateName} ${cutaway} right edge`).toBeLessThan(0.8);
          expect(apparatus.minY, `${stateName} ${cutaway} lower edge`).toBeGreaterThan(-0.55);
          expect(apparatus.maxY, `${stateName} ${cutaway} upper edge`).toBeLessThan(0.35);
          expect(
            ((apparatus.maxX - apparatus.minX) * canvasWidth) / 2,
            `${stateName} ${cutaway} horizontal legibility`,
          ).toBeGreaterThan(205);
          expect(
            ((apparatus.maxY - apparatus.minY) * canvasHeight) / 2,
            `${stateName} ${cutaway} vertical legibility`,
          ).toBeGreaterThan(125);

          for (const [name, part] of [
            ["chassis", chassis],
            ["motherboard", motherboard],
          ] as const) {
            expect(part.minX, `${stateName} ${cutaway} ${name} left`).toBeGreaterThan(-0.8);
            expect(part.maxX, `${stateName} ${cutaway} ${name} right`).toBeLessThan(0.8);
            expect(part.minY, `${stateName} ${cutaway} ${name} lower`).toBeGreaterThan(-0.55);
            expect(part.maxY, `${stateName} ${cutaway} ${name} upper`).toBeLessThan(0.35);
          }
        }
      }
    } finally {
      model.dispose();
    }
  });

  test("computes genuine CPU clock rate, cycle time, DRAM window, and color subcarrier in SI units", () => {
    const result = stepWozniakApple({
      crystalFreq: 14.31818,
      ramCapacityKb: 48,
    });
    expect(result.cpuClockMhz).toBeCloseTo(1.02, 1);
    expect(result.cycleTimeNs).toBeCloseTo(978, 0);
    expect(result.dramWindowNs).toBeGreaterThan(0);
    expect(result.colorSubcarrierMhz).toBeCloseTo(3.5795, 2);
  });

  test("builds and articulates procedural chassis, motherboard, 6502 CPU, 24 RAM chips, 8 slots, crystal, and bus signals correctly", () => {
    const model = buildWozniakAppleModel();
    expect(model.root.children.length).toBeGreaterThan(0);
    expect(model.motherboard).toBeDefined();
    expect(model.cpuGroup).toBeDefined();
    expect(model.ramGroup.children.length).toBe(24);
    expect(model.slotsGroup.children.length).toBe(8);
    expect(model.crystal).toBeDefined();
    expect(model.rcaJack).toBeDefined();
    expect(model.busPoints).toBeDefined();

    model.updateKinematics(0.016, 10, 1.0, true);
    expect(model.busPoints.visible).toBe(true);

    model.dispose();
  });
});
