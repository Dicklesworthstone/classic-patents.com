import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { stepPasteurFermentation } from "@/physics/catalogKernels";
import {
  PASTEUR_DESKTOP_SAFE_TOP_PX,
  pasteurFermentationCameraForViewport,
} from "./pasteurFermentationCamera";
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

  test("keeps the complete source apparatus clear of the desktop View rail in every audited pose", () => {
    // These are the three persisted V23 desktop screenshots: the initial
    // state, the audit's primary CO2 control state, and the subsequent claim
    // inversion. The rail remains visible in all three, so a canvas-only NDC
    // edge check is insufficient.
    const desktopAuditPoses = [
      { name: "default", co2SweepPct: 100, sprayCoveragePct: 100, isCutaway: false },
      { name: "primary-control-max", co2SweepPct: 0, sprayCoveragePct: 100, isCutaway: false },
      { name: "claim-inverted", co2SweepPct: 0, sprayCoveragePct: 100, isCutaway: false },
    ] as const;
    const width = 1214;
    const height = 460;
    const desktop = pasteurFermentationCameraForViewport("iso", width);
    const safeTopNdc = 1 - (2 * PASTEUR_DESKTOP_SAFE_TOP_PX) / height;

    expect(desktop).toEqual({ pos: [12.5, 8.6, 13.5], target: [0, 2, 0] });

    for (const pose of desktopAuditPoses) {
      const { rootGroup, nodes, materials, dispose } = buildPasteurFermentationModel();
      try {
        updatePasteurFermentationKinematics(
          nodes,
          materials,
          0.016,
          pose.co2SweepPct,
          pose.sprayCoveragePct,
          pose.isCutaway,
        );
        rootGroup.updateMatrixWorld(true);
        const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
        camera.position.set(...desktop.pos);
        camera.lookAt(...desktop.target);
        camera.updateProjectionMatrix();
        camera.updateMatrixWorld();
        const frame = projectedObjectBounds(rootGroup, camera);

        expect(frame.minX, `${pose.name} apparatus left edge`).toBeGreaterThan(-0.85);
        expect(frame.maxX, `${pose.name} apparatus right edge`).toBeLessThan(0.85);
        expect(frame.minY, `${pose.name} apparatus lower edge`).toBeGreaterThan(-0.85);
        expect(frame.maxY, `${pose.name} Pipe E hanger envelope below View rail`).toBeLessThan(
          safeTopNdc,
        );
      } finally {
        dispose();
      }
    }
  });

  test("retains a wider overview for the compact phone canvases", () => {
    const phone375 = pasteurFermentationCameraForViewport("iso", 341);
    const phone = pasteurFermentationCameraForViewport("iso", 286);

    expect(phone375).toEqual({ pos: [11.5, 7.8, 12.7], target: [0, 0.8, 0] });
    expect(phone).toEqual(phone375);

    const { rootGroup, dispose } = buildPasteurFermentationModel();
    try {
      rootGroup.updateMatrixWorld(true);
      for (const [layout, view, width] of [
        ["phone375", phone375, 341],
        ["phone", phone, 286],
      ] as const) {
        const camera = new THREE.PerspectiveCamera(42, width / 380, 0.1, 1000);
        camera.position.set(...view.pos);
        camera.lookAt(...view.target);
        camera.updateProjectionMatrix();
        camera.updateMatrixWorld();
        const frame = projectedObjectBounds(rootGroup, camera);

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
