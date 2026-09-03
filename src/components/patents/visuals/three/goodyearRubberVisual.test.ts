import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { FrankenSimEngine } from "@/physics/engine";
import { goodyearRubberCameraForViewport } from "./goodyearRubberCamera";
import { buildGoodyearRubberModel, updateGoodyearRubberKinematics } from "./goodyearRubberModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

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

describe("US 3,633 Charles Goodyear Vulcanized Rubber visual & polymer mechanics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "GoodyearRubber3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "goodyearRubberModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildGoodyearRubberModel");
    expect(modelSource).toContain("updateGoodyearRubberKinematics");
    expect(modelSource).not.toContain("stepGoodyearRubber()");
    expect(threeSource).toContain("p.vulcanizationTempC");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "GoodyearRubber3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "goodyearRubberModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for polymer network observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "GoodyearRubber3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "chains", "bridges", "clamps", "stress_vectors", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Vulcanized Rubber 3D");
  });

  test("frames the complete supported tensile apparatus inside every audited overview", () => {
    const { rootGroup, nodes, materials, dispose } = buildGoodyearRubberModel();
    try {
      const desktop = goodyearRubberCameraForViewport("iso", 1216);
      const tablet = goodyearRubberCameraForViewport("iso", 718);
      const phone375 = goodyearRubberCameraForViewport("iso", 341);
      const phone = goodyearRubberCameraForViewport("iso", 286);

      // Desktop and tablet retain their independently audited compositions.
      // The phone overview is separately composed for the actual V21 286 px
      // and 341 px canvas widths, rather than the broader browser viewport.
      expect(desktop).toEqual({ pos: [2, 7, 18], target: [2, -1.7, 0] });
      expect(tablet).toEqual({ pos: [0, 10.5, 25], target: [0, -2.1, 0] });
      expect(phone375).toEqual({ pos: [30, 20, 35], target: [0, 8, 0] });
      expect(phone).toEqual({ pos: [30, 20, 35], target: [0, 8, 0] });

      // Test the relaxed, normal, and maximally stretched supported states;
      // the last pair includes the primary-control temperature maximum recorded
      // by the visual audit rather than only the relaxed network.
      for (const [cureTemperature, stretch] of [
        [110, 1],
        [145, 1.8],
        [190, 2.5],
      ]) {
        const rubber = FrankenSimEngine.stepGoodyearRubber(cureTemperature, 8, 30, stretch, 35);
        updateGoodyearRubberKinematics(
          nodes,
          materials,
          0.016,
          0.5,
          stretch,
          rubber.clampStudioX,
          rubber.stressScale,
          rubber.thermalAmplitude,
          true,
          true,
          true,
          false,
          cureTemperature,
          8,
          35,
        );
        rootGroup.updateMatrixWorld(true);
        for (const [layout, view, width, height] of [
          ["desktop", desktop, 1216, 460],
          ["tablet", tablet, 718, 460],
          // V21 receipts: 375px viewport → 341×380px canvas; 320px viewport
          // → 286×380px canvas. Test the rendered surface, not viewport width.
          ["phone375", phone375, 341, 380],
          ["phone", phone, 286, 380],
        ] as const) {
          const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
          camera.position.set(...view.pos);
          camera.lookAt(...view.target);
          camera.updateProjectionMatrix();
          camera.updateMatrixWorld();
          const frame = projectedObjectBounds(rootGroup, camera);

          // NDC ±1 is the canvas edge. A 0.15+ edge clearance catches the V17
          // desktop and V14 tablet crops without accepting a one-pixel "fix".
          const stateName = `${layout}: ${cureTemperature}°C, λ=${stretch}`;
          expect(frame.minX, `${stateName} left edge`).toBeGreaterThan(-0.85);
          expect(frame.maxX, `${stateName} right edge`).toBeLessThan(0.85);
          expect(frame.minY, `${stateName} lower edge`).toBeGreaterThan(-0.85);
          expect(frame.maxY, `${stateName} upper edge`).toBeLessThan(0.85);
        }
      }
    } finally {
      dispose();
    }
  });

  test("computes genuine vulcanization tensile strength, crosslink density, and elastic return in SI units", () => {
    const result = FrankenSimEngine.stepGoodyearRubber(145, 8, 30, 1.8, 35);
    expect(result.tensileStrengthPsi).toBeGreaterThan(1500);
    expect(result.crossLinkDensity).toBeGreaterThan(1e-5);
    expect(result.elasticReturnPct).toBeGreaterThan(70);
    expect(result.isStickyOrBrittle).toBe(false);
    expect(result.stressScale).toBeGreaterThan(0.3);
    expect(result.clampStudioX).toBeCloseTo(8.1, 3);
    expect(result.chainStretchPx).toBeCloseTo(64, 2);
    expect(result.thermalWobbleOmega).toBe(4);
    expect(result.gaugeNeedleRadPerStretch).toBeCloseTo(Math.PI * 1.5, 5);
  });

  test("builds and articulates procedural grip clamps, 6 polyisoprene chains, and 14 sulfur crosslink bridges correctly", () => {
    const { rootGroup, nodes, materials, dispose } = buildGoodyearRubberModel();
    expect(rootGroup.children.length).toBeGreaterThan(2);
    expect(nodes.chains.length).toBe(6);
    expect(nodes.bridgeItems.length).toBe(14);
    expect(nodes.leftArrow).toBeDefined();
    expect(nodes.rightArrow).toBeDefined();

    const rubber = FrankenSimEngine.stepGoodyearRubber(145, 8, 30, 1.8, 35);
    updateGoodyearRubberKinematics(
      nodes,
      materials,
      0.016,
      0.5,
      1.8,
      rubber.clampStudioX,
      rubber.stressScale,
      rubber.thermalAmplitude,
      true,
      true,
      true,
      true,
      145,
      8,
      35,
    );
    expect(materials.polyisoprene.transparent).toBe(true);

    dispose();
  });
});
