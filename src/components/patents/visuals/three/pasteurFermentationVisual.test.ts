import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { stepPasteurFermentation } from "@/physics/catalogKernels";
import { pasteurFermentationCameraForViewport } from "./pasteurFermentationCamera";
import {
  buildPasteurFermentationModel,
  updatePasteurFermentationKinematics,
} from "./pasteurFermentationModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");
const PHYSICS_DIRECTORY = join(process.cwd(), "src/physics");

function projectedObjectBounds(root: THREE.Object3D, camera: THREE.PerspectiveCamera) {
  const projected: THREE.Vector3[] = [];
  root.traverse((node) => {
    const positions = (node as THREE.Mesh).geometry?.getAttribute("position");
    if (!positions) return;
    const point = new THREE.Vector3();
    for (let index = 0; index < positions.count; index += 1) {
      projected.push(
        point
          .fromBufferAttribute(positions, index)
          .applyMatrix4(node.matrixWorld)
          .project(camera)
          .clone(),
      );
    }
  });
  return {
    minX: Math.min(...projected.map((projectedPoint) => projectedPoint.x)),
    maxX: Math.max(...projected.map((projectedPoint) => projectedPoint.x)),
    minY: Math.min(...projected.map((projectedPoint) => projectedPoint.y)),
    maxY: Math.max(...projected.map((projectedPoint) => projectedPoint.y)),
  };
}

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

  test("frames Pipe E, Nozzle P, Generator M M, vessel A, and exit cup v in the default overview", () => {
    const { rootGroup, dispose } = buildPasteurFermentationModel();
    try {
      rootGroup.updateMatrixWorld(true);
      const desktop = pasteurFermentationCameraForViewport("iso", 1216);
      const phone375 = pasteurFermentationCameraForViewport("iso", 341);
      const phone = pasteurFermentationCameraForViewport("iso", 286);

      expect(desktop).toEqual({ pos: [11, 7.5, 12], target: [0, 0.8, 0] });
      expect(phone375).toEqual({ pos: [11.5, 7.8, 12.7], target: [0, 0.8, 0] });
      expect(phone).toEqual(phone375);

      for (const [layout, view, width, height] of [
        ["desktop", desktop, 1216, 460],
        // The visual audit's actual compact canvas dimensions, rather than its
        // browser viewport widths, keep the portrait envelope meaningful.
        ["phone375", phone375, 341, 380],
        ["phone", phone, 286, 380],
      ] as const) {
        const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
        camera.position.set(...view.pos);
        camera.lookAt(...view.target);
        camera.updateProjectionMatrix();
        camera.updateMatrixWorld();
        const frame = projectedObjectBounds(rootGroup, camera);

        // NDC +/-1 is the canvas edge. This meaningful margin catches the
        // reported desktop top crop instead of accepting a one-pixel move.
        expect(frame.minX, `${layout} apparatus left edge`).toBeGreaterThan(-0.85);
        expect(frame.maxX, `${layout} apparatus right edge`).toBeLessThan(0.85);
        expect(frame.minY, `${layout} apparatus lower edge`).toBeGreaterThan(-0.85);
        expect(frame.maxY, `${layout} apparatus upper edge`).toBeLessThan(0.85);
      }
    } finally {
      dispose();
    }
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
