import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { stepKilbyIntegratedCircuit } from "@/physics/catalogKernels";
import { createKilbyIntegratedCircuitModel } from "./kilbyIntegratedCircuitModel";

describe("US 3,138,743 Jack S. Kilby Monolithic Integrated Circuit Visual & Physics Boundary", () => {
  const rootDir = process.cwd();
  const modelFile = join(
    rootDir,
    "src/components/patents/visuals/three/kilbyIntegratedCircuitModel.ts",
  );
  const studioFile = join(
    rootDir,
    "src/components/patents/visuals/three/KilbyIntegratedCircuit3D.tsx",
  );

  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(modelFile, "utf-8");
    const studioSource = readFileSync(studioFile, "utf-8");

    expect(modelSource).not.toContain("GLTFLoader");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(modelSource).not.toContain("timeSec * 6.0");
    expect(modelSource).toContain("switchingDisplayOmegaRadPerS");
    expect(studioSource).not.toContain("GLTFLoader");
    expect(studioSource).toContain('from "./useLiveSimParams"');
    expect(studioSource).toContain("...live.current");
    const simSource = readFileSync(
      join(rootDir, "src/components/patents/visuals/KilbyIntegratedCircuitSim.tsx"),
      "utf-8",
    );
    expect(simSource).toContain("simState.switchingDisplayOmegaRadPerS");
    expect(simSource).not.toContain("Math.sin(time * 8)");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(modelFile, "utf-8");
    const studioSource = readFileSync(studioFile, "utf-8");

    expect(modelSource).not.toContain("performance.now()");
    expect(modelSource).not.toContain("Date.now()");
    expect(studioSource).not.toContain("performance.now()");
  });

  test("computes genuine semiconductor sheet resistance, p-n capacitance, and BJT amplification in SI units", () => {
    const defaultState = stepKilbyIntegratedCircuit({
      substrateMaterial: "germanium",
      supplyVoltageV: 6.0,
      resistorWidthUm: 50.0,
      resistorLengthUm: 500.0,
      reverseBiasVoltageV: 3.0,
      baseDriveCurrentUa: 40.0,
    });

    expect(defaultState.material).toBe("germanium");
    expect(defaultState.collectorLoadResistanceOhms).toBeGreaterThan(50);
    expect(defaultState.junctionCapacitancePf).toBeGreaterThan(0.1);
    expect(defaultState.collectorCurrentMa).toBeGreaterThan(0.5);
    expect(defaultState.depletionWidthUm).toBeGreaterThan(0.5);
    expect(defaultState.phaseShiftOscillatorFrequencyKhz).toBeGreaterThan(10);
    expect(defaultState.maxClockFrequencyMhz).toBeCloseTo(60.3, 1);
    expect(defaultState.switchingDisplayOmegaRadPerS).toBeCloseTo(6.0, 2);
    const silicon = stepKilbyIntegratedCircuit({ substrateMaterial: "silicon" });
    expect(silicon.switchingDisplayOmegaRadPerS).toBeLessThan(
      defaultState.switchingDisplayOmegaRadPerS,
    );
  });

  test("builds and articulates procedural germanium die, mesa transistors, bulk resistors, and gold wire bonds", () => {
    const model = createKilbyIntegratedCircuitModel();

    expect(model.group).toBeInstanceOf(THREE.Group);
    expect(model.dieGroup.children.length).toBeGreaterThan(0);
    expect(model.transistor1Group.children.length).toBeGreaterThan(0);
    expect(model.transistor2Group.children.length).toBeGreaterThan(0);
    expect(model.resistorGroup.children.length).toBeGreaterThan(0);
    expect(model.capacitorGroup.children.length).toBeGreaterThan(0);
    expect(model.wireBondsGroup.children.length).toBeGreaterThan(0);
    expect(model.materials.length).toBeGreaterThan(5);
    expect(model.geometries.length).toBeGreaterThan(5);

    // Verify deterministic update
    model.update(1.0);
    model.update(2.5);

    // Verify cleanup
    model.dispose();
  });
});
