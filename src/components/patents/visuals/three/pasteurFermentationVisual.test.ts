import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepPasteurFermentation } from "@/physics/catalogKernels";
import {
  buildPasteurFermentationModel,
  updatePasteurFermentationKinematics,
} from "./pasteurFermentationModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");
const PHYSICS_DIRECTORY = join(process.cwd(), "src/physics");

describe("US 135,245 Pasteur closed-vessel process visual boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "PasteurFermentation3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "pasteurFermentationModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildPasteurFermentationModel");
    expect(modelSource).toContain("updatePasteurFermentationKinematics");
    expect(modelSource).toContain("generatorM");
    expect(modelSource).toContain("supplyLineW");
    expect(modelSource).toContain("exitTubeX");
    expect(modelSource).toContain("waterCupV");
    for (const unsupported of [
      "gooseneck",
      "swan-neck",
      "cottonBulb",
      "coolingCoils",
      "samplingCock",
      "tinnedCopper",
      "heatFrames",
      "sampleHeatAt",
    ]) {
      expect(modelSource.toLowerCase()).not.toContain(unsupported.toLowerCase());
    }
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "PasteurFermentation3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "pasteurFermentationModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes source-apparatus camera presets and cutaway mode", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "PasteurFermentation3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "vessel", "nozzle", "generator", "exit_cup", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Pasteur closed-vessel process apparatus in three dimensions");
    expect(threeSource).toContain("controls.setView");
    expect(threeSource).not.toContain("camera.position.set");
    expect(threeSource).not.toContain("ensureGenericWasm");
    expect(threeSource).not.toContain("genericKernelSource");
  });

  test("computes only the source sequence and its explicitly labelled reader controls", () => {
    const result = stepPasteurFermentation({
      co2SweepPct: 100,
      sprayCoveragePct: 100,
      wortTempC: 21,
    });
    expect(result.co2SweepPct).toBe(100);
    expect(result.sprayCoveragePct).toBe(100);
    expect(result.wortTempC).toBe(21);
    expect(result.withinPrintedYeastBand).toBe(true);
    expect(result.readyForYeast).toBe(true);
    const serialized = JSON.stringify(result).toLowerCase();
    for (const unsupported of ["logreduction", "alcohol", "pressure", "shelflife", "microbe"])
      expect(serialized).not.toContain(unsupported);
  });

  test("builds and animates the source vessel, gas line, exterior spray, and exit cup", () => {
    const { rootGroup, nodes, materials, dispose } = buildPasteurFermentationModel();
    expect(rootGroup.children.length).toBeGreaterThan(0);
    expect(nodes.support).toBeDefined();
    expect(nodes.tank).toBeDefined();
    expect(nodes.domeLid).toBeDefined();
    expect(nodes.pipeE).toBeDefined();
    expect(nodes.nozzleP).toBeDefined();
    expect(nodes.generatorM).toBeDefined();
    expect(nodes.supplyLineW).toBeDefined();
    expect(nodes.exitTubeX).toBeDefined();
    expect(nodes.waterCupV).toBeDefined();

    updatePasteurFermentationKinematics(nodes, materials, 0.016, 100, 100, true);
    expect(materials.vessel.transparent).toBe(true);
    expect(nodes.gasPoints.visible).toBe(true);
    expect(nodes.sprayPoints.visible).toBe(true);

    dispose();
  });

  test("forbids the unrelated modern-pasteurization narrative in public Pasteur visuals", () => {
    const sources = [
      readFileSync(join(VISUALS_DIRECTORY, "PasteurFermentationSim.tsx"), "utf8"),
      readFileSync(join(VISUALS_DIRECTORY, "three", "PasteurFermentation3D.tsx"), "utf8"),
      readFileSync(join(VISUALS_DIRECTORY, "three", "pasteurFermentationModel.ts"), "utf8"),
    ]
      .join("\n")
      .toLowerCase();
    for (const unsupported of [
      "microbial kill",
      "log reduction",
      "alcohol yield",
      "co₂ overpressure",
      "shelf life",
      "pasteurization bath",
      "thermal hold",
      "swan-neck",
      "gooseneck",
      "cotton filter",
    ]) {
      expect(sources).not.toContain(unsupported);
    }
  });

  test("does not invent a quantified energy ledger or boil the wort inside vessel A", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "PasteurFermentation3D.tsx"),
      "utf8",
    );
    const ledgerSource = readFileSync(join(PHYSICS_DIRECTORY, "energyLedger.ts"), "utf8");
    const pasteurLedgerCase = ledgerSource.slice(
      ledgerSource.indexOf('case "us-135245-pasteur-fermentation"'),
      ledgerSource.indexOf('case "gb-1420-cort-puddling-rolling"'),
    );

    expect(threeSource).toContain("Introduce boiling-hot wort into closed vessel A");
    expect(threeSource).not.toContain("Boil wort in closed vessel A");
    expect(threeSource).not.toContain("PortHamiltonianEnergyStrip");
    for (const unsupported of ["500.0", "350.0", "340.0", "wortVolumeLiters"])
      expect(pasteurLedgerCase).not.toContain(unsupported);
  });

  test("makes zero-valued gas and spray controls visually inactive in the 2D face", () => {
    const twoDimensionalSource = readFileSync(
      join(VISUALS_DIRECTORY, "PasteurFermentationSim.tsx"),
      "utf8",
    );

    expect(twoDimensionalSource).toContain("opacity={0.01 * process.sprayCoveragePct}");
    expect(twoDimensionalSource).toContain("opacity={0.0092 * process.co2SweepPct}");
    expect(twoDimensionalSource).not.toContain("0.15 + 0.0085 * process.sprayCoveragePct");
    expect(twoDimensionalSource).not.toContain("0.12 + 0.008 * process.co2SweepPct");
  });
});
