import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepZeppelinAirship } from "@/physics/catalogKernels";
import { buildZeppelinAirshipModel, updateZeppelinAirshipKinematics } from "./zeppelinAirshipModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 621,195 Ferdinand von Zeppelin Rigid Airship visual & aerostatics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "ZeppelinAirship3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "zeppelinAirshipModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildZeppelinAirshipModel");
    expect(modelSource).toContain("updateZeppelinAirshipKinematics");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "ZeppelinAirship3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "zeppelinAirshipModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for airship observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "ZeppelinAirship3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "girders_frame",
      "engine_gondola",
      "gas_cells",
      "control_fins",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Zeppelin LZ-1 Airship 3D");
  });

  test("computes genuine Zeppelin gross buoyancy and net lift in SI units", () => {
    const result = stepZeppelinAirship({
      gasInflation: 95,
      flightAlt: 300,
      flightSpeedKnots: 28,
      trimWeight: 5,
    });
    expect(result.grossBuoyancyKn).toBeGreaterThan(100);
    expect(result.netLiftKn).toBeGreaterThan(0);
    expect(result.hydrogenVolumeM3).toBeGreaterThan(10000);
    expect(result.propellerRpm).toBeGreaterThan(1000);
    expect(result.hullStudioY).toBeCloseTo((result.netLiftKn / 40) * 0.9, 3);
    expect(result.trimSvgX).toBeCloseTo((5 / 15) * 140 - 10, 2);
    expect(result.grossLiftTonnes).toBeCloseTo(result.grossLiftKg / 1000, 1);
  });

  test("builds and articulates procedural rigid hull, duralumin rings, gas cells, and gondolas correctly", () => {
    const { rootGroup, nodes, materials, dispose } = buildZeppelinAirshipModel();
    expect(rootGroup.children.length).toBeGreaterThan(0);
    expect(nodes.rings.length).toBe(15);
    expect(nodes.gasCells.length).toBe(14);
    expect(nodes.gondolas.length).toBe(2);
    expect(nodes.propellers.length).toBe(4);

    const zep = stepZeppelinAirship({
      gasInflation: 95,
      flightAlt: 300,
      flightSpeedKnots: 28,
      trimWeight: 5,
    });
    updateZeppelinAirshipKinematics(
      nodes,
      materials,
      0.016,
      0.5,
      zep.hullStudioY,
      zep.pitchTrimDeg,
      zep.propellerDisplayOmegaRadPerS,
      3.0,
      true,
    );
    expect(materials.fabricEnvelope.wireframe).toBe(true);
    expect(nodes.gasCells[0].visible).toBe(true);

    dispose();
  });
});
