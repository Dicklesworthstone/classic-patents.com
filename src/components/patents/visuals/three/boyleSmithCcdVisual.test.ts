import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildBoyleSmithCcdModel } from "./boyleSmithCcdModel";
import { stepCcdWells } from "@/physics/machineKernels";
import { FrankenSimEngine } from "@/physics/engine";

const VISUALS_DIRECTORY = join(
  process.cwd(),
  "src",
  "components",
  "patents",
  "visuals",
);

describe("US 3,858,232 Boyle & Smith Charge-Coupled Device visual & carrier dynamics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "boyleSmithCcdModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "BoyleSmithCcd3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("useGLTF");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(threeSource).not.toContain("useGLTF");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "boyleSmithCcdModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "BoyleSmithCcd3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("performance.now()");
  });

  test("exposes authentic camera presets and UI overlay for CCD inspection", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "BoyleSmithCcd3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "potential_well", "sensing_node", "gate_electrodes", "top"]) {
      expect(threeSource).toContain(preset);
    }
  });

  test("computes genuine charge transfer efficiency (CTE), full well capacity, and photoelectrons in SI units", () => {
    const wells = stepCcdWells(1, 850, 2.5, 8);
    expect(wells.cte).toBeGreaterThan(0.99);
    expect(wells.fullWellElectrons).toBeGreaterThan(10000);
    expect(wells.photoElectrons).toBeGreaterThan(0);

    const result = FrankenSimEngine.stepBoyleSmithCcd(1, 8, 850, 2.5);
    expect(result.chargeTransferEfficiencyPct).toBeGreaterThan(99.0);
    expect(result.clockPeriodNs).toBeGreaterThan(0);
  });

  test("builds and articulates procedural p-silicon substrate, gate oxide, 9 MOS gates, and charge packets correctly", () => {
    const model = buildBoyleSmithCcdModel();
    expect(model.root.children.length).toBeGreaterThan(0);
    expect(model.substrate).toBeDefined();
    expect(model.oxide).toBeDefined();
    expect(model.outputNode).toBeDefined();
    expect(model.gates.length).toBe(9);
    expect(model.packetPoints).toBeDefined();

    // Test kinematics update
    const wells = stepCcdWells(2, 850, 2.5, 8);
    model.updateKinematics(1 / 60, 2, wells);
    expect(model.gates[1].mesh.position.y).toBe(0.38);

    model.dispose();
  });
});
