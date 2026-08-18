import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FrankenSimEngine } from "@/physics/engine";
import {
  buildHollerithTabulatingModel,
  updateHollerithTabulatingKinematics,
} from "./hollerithTabulatingModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 395,781 Herman Hollerith Electro-Mechanical Punched-Card Tabulator visual & logic boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "HollerithTabulating3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "hollerithTabulatingModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildHollerithTabulatingModel");
    expect(modelSource).toContain("updateHollerithTabulatingKinematics");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "HollerithTabulating3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "hollerithTabulatingModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for tabulator observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "HollerithTabulating3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "pin_press", "dials_board", "sorting_box", "press_lever", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Hollerith Tabulator 3D");
  });

  test("computes genuine electromechanical solenoid force and card throughput in SI units", () => {
    const result = FrankenSimEngine.stepHollerithTabulating({
      cardsPerMin: 60,
      supplyVoltageV: 12,
      activeRelays: 16,
    });
    expect(result.cycleTimeMs).toBe(1000);
    expect(result.solenoidForceN).toBeGreaterThan(5);
    expect(result.registerDialCount).toBe(40);
    expect(result.sortingPocketCount).toBe(24);
    expect(result.cardsPerDay).toBeGreaterThan(20000);
    expect(result.plungeAmp).toBeGreaterThan(0.2);
  });

  test("builds and articulates procedural 40 dials, pin press, and sorting box correctly", () => {
    const { rootGroup, nodes, materials, dispose } = buildHollerithTabulatingModel();
    expect(rootGroup.children.length).toBeGreaterThan(2);
    expect(nodes.dials.length).toBe(40);
    expect(nodes.dialHands.length).toBe(40);
    expect(nodes.sortLids.length).toBe(24);
    expect(nodes.pinPlate).toBeDefined();

    const hollerith = FrankenSimEngine.stepHollerithTabulating({
      cardsPerMin: 60,
      supplyVoltageV: 12,
      activeRelays: 16,
    });
    updateHollerithTabulatingKinematics(
      nodes,
      materials,
      0.016,
      0.5,
      hollerith.pressOmegaRadPerS,
      hollerith.plungeAmp,
      true,
    );
    expect(materials.oakWood.transparent).toBe(true);

    dispose();
  });
});
