import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepMorseTelegraph } from "@/physics/catalogKernels";
import { buildMorseTelegraphModel, updateMorseTelegraphKinematics } from "./morseTelegraphModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 1,647 Samuel Morse Electro-Magnetic Telegraph visual & circuitry boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "MorseTelegraph3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "morseTelegraphModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildMorseTelegraphModel");
    expect(modelSource).toContain("updateMorseTelegraphKinematics");
    expect(modelSource).not.toContain("stepMorseTelegraph({})");
    expect(threeSource).toContain("p.lineVoltageV");
    expect(threeSource).toContain("p.lineLengthMiles");
    expect(threeSource).toContain("p.wpmSpeed");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "MorseTelegraph3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "morseTelegraphModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for telegraph observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "MorseTelegraph3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "key_lever",
      "electromagnet_relay",
      "paper_tape_register",
      "sounding_anvil",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Morse Telegraph 3D");
    expect(threeSource).toContain("controls.setView");
    expect(threeSource).not.toContain("cameraRef");
  });

  test("computes genuine line resistance, loop current, and electromagnetic holding force in SI units", () => {
    const result = stepMorseTelegraph({
      wireTurns: 1200,
      lineVoltageV: 24,
      lineLengthMiles: 44,
      wpmSpeed: 20,
    });
    expect(result.loopCurrentMa).toBeGreaterThan(10);
    expect(result.magneticForceN).toBeGreaterThan(0.1);
    expect(result.ampereTurns).toBeGreaterThan(20);
    expect(result.lineResistanceOhms).toBeGreaterThan(100);
    expect(result.loopResistanceOhms).toBeGreaterThan(200);
    expect(result.tapeAdvanceRadPerS).toBeGreaterThan(0);
    expect(result.keyOscillationRadPerS).toBeCloseTo(5 * Math.PI, 2);
    expect(result.electronDisplaySpeed).toBe(8);
    expect(result.electronLaneZ).toBe(0.3);
    expect(result.governorRatio).toBe(6);
    expect(result.gearRatio).toBe(2);
  });

  test("builds and articulates procedural baseboard, key lever, electromagnet sounder, and paper spool correctly", () => {
    const { rootGroup, nodes, materials, dispose } = buildMorseTelegraphModel();
    expect(rootGroup.children.length).toBeGreaterThan(2);
    expect(nodes.coils.length).toBe(2);
    expect(nodes.keyKnob).toBeDefined();
    expect(nodes.tapeSpool).toBeDefined();
    expect(nodes.electronPositions.length).toBe(50 * 3);

    const morse = stepMorseTelegraph({
      wireTurns: 1200,
      lineVoltageV: 24,
      lineLengthMiles: 44,
      wpmSpeed: 20,
    });
    updateMorseTelegraphKinematics(
      nodes,
      materials,
      0.016,
      0.5,
      morse.keyOscillationRadPerS,
      morse.armatureStrikeM,
      morse.tapeAdvanceRadPerS,
      morse.electronDisplaySpeed,
      true,
      true,
    );
    expect(materials.mahogany.transparent).toBe(true);

    dispose();
  });
});
