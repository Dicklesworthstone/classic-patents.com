import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepMorseTelegraph } from "@/physics/catalogKernels";
import { morseCameraPresetForViewport } from "./morseTelegraphCamera";
import { buildMorseTelegraphModel, updateMorseTelegraphKinematics } from "./morseTelegraphModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

function visualState(
  morse: ReturnType<typeof stepMorseTelegraph>,
  overrides: Partial<{ keyIsDown: boolean; isCutaway: boolean }> = {},
) {
  return {
    keyIsDown: false,
    isCutaway: false,
    armatureStrikeM: morse.armatureStrikeM,
    tapeAdvanceRadPerS: morse.tapeAdvanceRadPerS,
    electronDisplaySpeed: morse.electronDisplaySpeed,
    lineWaveRms: morse.lineWaveRms,
    electronOriginX: morse.electronOriginX,
    electronWrapX: morse.electronWrapX,
    keyTiltRad: morse.keyTiltRad,
    armatureHomeY: morse.armatureHomeY,
    governorRatio: morse.governorRatio,
    gearRatio: morse.gearRatio,
    ...overrides,
  };
}

describe("US 1,647 Samuel Morse Electro-Magnetic Telegraph visual & circuitry boundary", () => {
  test("widens the isometric overview to keep the full apparatus in a portrait viewport", () => {
    expect(morseCameraPresetForViewport("iso", 342)).toEqual({
      pos: [15, 11, 20],
      target: [0, -0.5, 0],
    });
    expect(morseCameraPresetForViewport("iso", 768)).toEqual({
      pos: [11, 8, 13],
      target: [0, 0, 0],
    });
  });

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
    expect(threeSource).toContain("lineVoltageV");
    expect(threeSource).toContain("lineLengthMiles");
    expect(threeSource).toContain("wpmSpeed");
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
    expect(threeSource).not.toContain("cycle >");
    expect(modelSource).not.toContain("Math.sin(timeSec");
    expect(modelSource).not.toContain("stepMorseTelegraph");
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
      visualState(morse, { keyIsDown: true, isCutaway: true }),
    );
    expect(materials.mahogany.transparent).toBe(true);

    dispose();
  });

  test("only energizes the mechanical and electrical chain while the shared key state is down", () => {
    const { nodes, materials, dispose } = buildMorseTelegraphModel();
    const morse = stepMorseTelegraph({ lineVoltageV: 24, lineLengthMiles: 44, wpmSpeed: 20 });
    const electronPositionsAtRest = [...nodes.electronPositions];

    updateMorseTelegraphKinematics(nodes, materials, 0.5, visualState(morse));
    expect(nodes.keyLeverGroup.rotation.z).toBe(0);
    expect(nodes.armatureGroup.position.y).toBe(morse.armatureHomeY);
    expect(nodes.tapeSpool.rotation.y).toBe(0);
    expect(nodes.electronPoints.visible).toBe(false);
    expect([...nodes.electronPositions]).toEqual(electronPositionsAtRest);

    updateMorseTelegraphKinematics(nodes, materials, 0.5, visualState(morse, { keyIsDown: true }));
    expect(nodes.keyLeverGroup.rotation.z).toBe(morse.keyTiltRad);
    expect(nodes.armatureGroup.position.y).toBeLessThan(morse.armatureHomeY);
    expect(nodes.tapeSpool.rotation.y).toBeGreaterThan(0);
    expect(nodes.electronPoints.visible).toBe(true);
    expect([...nodes.electronPositions]).not.toEqual(electronPositionsAtRest);
    dispose();
  });
});
