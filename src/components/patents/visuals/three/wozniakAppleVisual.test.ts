import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepWozniakApple } from "@/physics/catalogKernels";
import { buildWozniakAppleModel } from "./wozniakAppleModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

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
