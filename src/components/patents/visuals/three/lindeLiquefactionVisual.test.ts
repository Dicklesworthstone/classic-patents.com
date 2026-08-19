import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FrankenSimEngine } from "@/physics/engine";
import {
  buildLindeLiquefactionModel,
  updateLindeLiquefactionKinematics,
} from "./lindeLiquefactionModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 727,650 Carl von Linde Air Liquefaction visual & cryogenics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "LindeAirLiquefaction3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "lindeLiquefactionModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildLindeLiquefactionModel");
    expect(modelSource).toContain("updateLindeLiquefactionKinematics");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "LindeAirLiquefaction3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "lindeLiquefactionModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for cryostat observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "LindeAirLiquefaction3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "regulating_valve",
      "counter_current_apparatus",
      "vessel_v_prime",
      "regulator",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("cutawayMode");
    expect(threeSource).toContain("LindeAirLiquefaction3D");
  });

  test("computes genuine Linde Joule-Thomson liquefaction dynamics in SI units", () => {
    const result = FrankenSimEngine.stepLindeAirLiquefaction({
      compressorPressureBar: 200,
      heatExchangerPasses: 50,
    });

    expect(result.coldEndTempK).toBeLessThan(100);
    expect(result.coldEndTempC).toBeLessThan(-170);
    expect(result.jtDeltaTPerPass).toBeGreaterThan(30);
    expect(result.isLiquefying).toBe(true);
    expect(result.liquidYieldPct).toBeGreaterThan(0);
    expect(result.liquidOutputLitersPerHr).toBeGreaterThan(0);
  });

  test("builds and articulates procedural cryostat column and coils correctly", () => {
    const { root, nodes, materials } = buildLindeLiquefactionModel();
    expect(root.children.length).toBeGreaterThan(4);
    expect(nodes.coilRings.length).toBe(18);

    // Initial state
    updateLindeLiquefactionKinematics(nodes, materials, 0.1, 1.0, 200, true, true);
    expect(nodes.cutawayCasingMesh.visible).toBe(true);
    expect(nodes.solidCasingMesh.visible).toBe(false);
    expect(materials.flowTracer.opacity).toBeGreaterThan(0);
  });
});
