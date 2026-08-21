import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FrankenSimEngine } from "@/physics/engine";
import { buildLindeLiquefactionModel } from "./lindeLiquefactionModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals");

describe("US 727,650 Carl von Linde Air Liquefaction visual & thermodynamics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "lindeLiquefactionModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "LindeAirLiquefaction3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("useGLTF");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(threeSource).not.toContain("useGLTF");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "lindeLiquefactionModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "LindeAirLiquefaction3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("performance.now()");
    for (const forbidden of [
      "77 K",
      "Dewar",
      "tripod",
      "brass",
      "copper",
      "glass",
      "frost",
      "condensedGasVolume",
    ]) {
      expect(modelSource.toLowerCase()).not.toContain(forbidden.toLowerCase());
    }
  });

  test("exposes source-named camera presets and a bounded apparatus overlay", () => {
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
  });

  test("keeps the fallback inside the printed operating example and refuses invented outputs", () => {
    const result = FrankenSimEngine.stepLindeAirLiquefaction();
    expect(result.highPressureAtm).toBe(75);
    expect(result.lowPressureAtm).toBe(25);
    expect(result.pressureDifferenceAtm).toBe(50);
    expect(result.coolerOutletC).toBe(10);
    expect(result.modelBoundary).toContain("does not supply");
  });

  test("builds the source-named casing, G′, N/R′, and V′ diagram without a Dewar claim", () => {
    const model = buildLindeLiquefactionModel();
    expect(model.root.children.length).toBeGreaterThan(0);
    expect(model.nodes.counterCurrentCoilGroup).toBeDefined();
    expect(model.nodes.jtValveGroup).toBeDefined();
    expect(model.nodes.receiverVessel).toBeDefined();
    expect("condensedGasVolume" in model.nodes).toBe(false);

    model.dispose();
  });
});
