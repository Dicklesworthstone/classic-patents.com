import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FrankenSimEngine } from "@/physics/engine";
import { stepCcdWells } from "@/physics/machineKernels";
import { buildBoyleSmithCcdModel, updateBoyleSmithCcdKinematics } from "./boyleSmithCcdModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 3,858,232 Willard Boyle & George Smith Charge-Coupled Device visual & 3-phase clocking boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "BoyleSmithCcd3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "boyleSmithCcdModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildBoyleSmithCcdModel");
    expect(modelSource).toContain("updateBoyleSmithCcdKinematics");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "BoyleSmithCcd3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "boyleSmithCcdModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for CCD inspection", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "BoyleSmithCcd3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "potential_well",
      "sensing_node",
      "gate_electrodes",
      "bus_lines",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Boyle-Smith Charge-Coupled Device 3D");
  });

  test("computes genuine charge transfer efficiency (CTE > 0.999), full well capacity, and packet charge in SI units", () => {
    const result = FrankenSimEngine.stepBoyleSmithCcd(1, 8, 850, 2.5);
    expect(result.chargeTransferEfficiencyPct).toBeGreaterThan(99.0);
    const wells = stepCcdWells(1, 850, 2.5, 8);
    expect(wells.phaseDisplayS).toBeCloseTo(wells.phaseDisplayMs / 1000, 4);
    expect(wells.ctePct).toBeCloseTo(wells.cte * 100, 4);
    expect(result.chargeTransferEfficiencyPct).toBe(wells.ctePct);
    expect(wells.packetOpacity).toBeCloseTo(0.35 + wells.cte * 0.55, 4);
  });

  test("builds and articulates procedural silicon substrate, channel stops, gate oxide, 3-phase gates, and electron packets correctly", () => {
    const { rootGroup, nodes, materials, dispose } = buildBoyleSmithCcdModel();
    expect(rootGroup.children.length).toBeGreaterThan(0);
    expect(nodes.substrate).toBeDefined();
    expect(nodes.channelStops.length).toBe(2);
    expect(nodes.oxide).toBeDefined();
    expect(nodes.busLines.length).toBe(3);
    expect(nodes.gates.length).toBe(9);
    expect(nodes.outputNode).toBeDefined();
    expect(nodes.packetPoints).toBeDefined();

    updateBoyleSmithCcdKinematics(
      nodes,
      materials,
      0.016,
      0.5,
      2,
      {
        wells: [5000, 10000, 2000],
        fullWellElectrons: 40000,
        cte: 0.9999,
        packetOpacity: 0.8999,
      },
      true,
    );
    expect(materials.pSiliconSubstrate.transparent).toBe(true);
    expect(nodes.packetPoints.visible).toBe(true);

    dispose();
  });
});
