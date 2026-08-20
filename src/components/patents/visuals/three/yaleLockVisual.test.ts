import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DEFAULT_LOCK_BITTINGS_MM, stepYaleLock } from "@/physics/yaleLockKernel";
import { createYaleLockModel } from "./yaleLockModel";

describe("Linus Yale Jr. Lock 3D Model & Physics Visual Test Suite", () => {
  test("2D and 3D sliders share the patent physics bus", () => {
    const threeSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/YaleLock3D.tsx"),
      "utf8",
    );
    const simSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/YaleLockSim.tsx"),
      "utf8",
    );
    expect(threeSource).toContain('usePatentPhysics("us-48475-yale-lock")');
    expect(simSource).toContain('usePatentPhysics("us-48475-yale-lock")');
    expect(threeSource).toContain('updateParam("keyInsertion"');
    expect(simSource).toContain('updateParam("appliedTorqueNm"');
    expect(threeSource).not.toContain("setKeyInsertion");
    expect(threeSource).not.toContain("[cameraPreset, live]");
    expect(threeSource).toContain("controls.setView");
  });

  test("creates valid Three.js model hierarchy with 5 pin stacks", () => {
    const model = createYaleLockModel();
    expect(model.group).toBeDefined();
    expect(model.housingGroup).toBeDefined();
    expect(model.plugGroup).toBeDefined();
    expect(model.keyGroup).toBeDefined();
    expect(model.camGroup).toBeDefined();
    expect(model.boltMesh).toBeDefined();
    expect(model.pinStacks.length).toBe(5);
    expect(model.materials.length).toBeGreaterThan(5);
    expect(model.geometries.length).toBeGreaterThan(10);

    model.dispose();
  });

  test("physics step updates model without throwing in locked and unlocked states", () => {
    const model = createYaleLockModel();

    // 1. Fully inserted authorized key (unlocked)
    const unlockedState = stepYaleLock({
      keyInsertion: 1.0,
      appliedTorqueNm: 0.15,
      keyBittingsMm: DEFAULT_LOCK_BITTINGS_MM,
      lockBittingsMm: DEFAULT_LOCK_BITTINGS_MM,
      currentPlugAngleRad: Math.PI / 4,
    });
    expect(unlockedState.isUnlocked).toBe(true);
    expect(unlockedState.maxShearErrorMm).toBeLessThan(0.09);
    expect(() => model.update(unlockedState, 1.0)).not.toThrow();

    // 2. Half inserted key (misaligned / locked)
    const lockedState = stepYaleLock({
      keyInsertion: 0.4,
      appliedTorqueNm: 0.15,
      keyBittingsMm: DEFAULT_LOCK_BITTINGS_MM,
      lockBittingsMm: DEFAULT_LOCK_BITTINGS_MM,
    });
    expect(lockedState.isUnlocked).toBe(false);
    expect(lockedState.maxShearErrorMm).toBeGreaterThan(0.5);
    expect(() => model.update(lockedState, 0.4)).not.toThrow();

    model.dispose();
  });

  test("calculates authentic physical spring forces and key permutations", () => {
    const state = stepYaleLock({
      keyInsertion: 1.0,
      appliedTorqueNm: 0.2,
    });
    expect(state.totalSpringForceN).toBeGreaterThan(1.0);
    expect(state.theoreticalCombinations).toBe(7776);
    expect(state.pickResistanceScore).toBeGreaterThan(80);
  });
});
