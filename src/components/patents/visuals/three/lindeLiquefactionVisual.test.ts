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
    expect(threeSource).toContain("p.showFlowTracer");
    expect(threeSource).toContain("p.cutawayMode");
    expect(modelSource).toContain("timeSec * 0.4 * pressureNorm");
    expect(modelSource).toContain("timeSec * 3.0 * pressureNorm");
    expect(modelSource).not.toContain("Math.sin(timeSec * 0.4)");
    expect(modelSource).not.toContain("Math.sin(timeSec * 3.0)");
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

  test("exposes source-named camera presets and cutaway mode for apparatus inspection", () => {
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
    expect(threeSource).toContain("US 727,650 source conditions");
  });

  test("keeps the fallback inside values printed by the facsimile", () => {
    const result = FrankenSimEngine.stepLindeAirLiquefaction();

    expect(result.highPressureAtm).toBe(75);
    expect(result.lowPressureAtm).toBe(25);
    expect(result.coolerOutletC).toBe(10);
    expect(result.modelBoundary).toContain("does not supply");
    expect(result.handwheelDisplayOmegaRadPerS).toBeCloseTo(0.4, 3);
    const highP = FrankenSimEngine.stepLindeAirLiquefaction({ inletPressureAtm: 150 });
    expect(highP.highPressureAtm).toBe(150);
    expect(highP.handwheelDisplayOmegaRadPerS).toBeCloseTo(0.8, 3);
    expect(highP.liquidRippleOmegaRadPerS).toBeCloseTo(6.0, 3);
  });

  test("builds an apparatus diagram and labels the flow tracer as illustrative", () => {
    const { root, nodes, materials } = buildLindeLiquefactionModel();
    expect(root.children.length).toBeGreaterThan(4);
    expect(nodes.coilRings.length).toBe(18);

    // Initial state
    updateLindeLiquefactionKinematics(nodes, materials, 0.1, 1.0, 75, true, true);
    expect(nodes.cutawayCasingMesh.visible).toBe(true);
    expect(nodes.solidCasingMesh.visible).toBe(false);
    expect(materials.flowTracer.opacity).toBeGreaterThan(0);
  });
});
