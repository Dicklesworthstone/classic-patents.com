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
      expect(phone375).toEqual({ pos: [24.5, 15, 29], target: [1, 5, 0] });
      expect(phone).toEqual({ pos: [26, 25, 25], target: [1, 5, 0] });

      // The phone audit's primary control is Vulcanization Temp, so its maximum
      // retains the default λ = 1.8. Keep the independent λ = 2.5 boundary as
      // well: it prevents the closer 375 px framing from regressing the complete
      // tensile apparatus at the largest supported extension.
      const testCases: readonly [string, number, number][] = [
        ["relaxed", 110, 1],
        ["phone375 default", 145, 1.8],
        ["phone375 primary-control maximum", 190, 1.8],
        ["maximum supported extension", 190, 2.5],
      ];
      for (const [state, cureTemperature, stretch] of testCases) {
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
          const stateName = `${layout} ${state}: ${cureTemperature}°C, λ=${stretch}`;
          expect(frame.minX, `${stateName} left edge`).toBeGreaterThan(-0.85);
          expect(frame.maxX, `${stateName} right edge`).toBeLessThan(0.85);
          expect(frame.minY, `${stateName} lower edge`).toBeGreaterThan(-0.85);
          expect(frame.maxY, `${stateName} upper edge`).toBeLessThan(0.85);

          if (state === "phone375 default" || state === "phone375 primary-control maximum") {
            const projectedWidthPx = ((frame.maxX - frame.minX) * width) / 2;
            const projectedHeightPx = ((frame.maxY - frame.minY) * height) / 2;
            const topPx = ((1 - frame.maxY) * height) / 2;
            const bottomEdgePx = ((1 - frame.minY) * height) / 2;

            if (layout === "phone375") {
              // V17's crop repair left only about 160 × 106 px of apparatus in
              // the 341 × 380 px phone375 canvas. These two real interaction
              // states must leave the polymer network legible while staying
              // clear of the top controls and the lower control boundary.
              expect(projectedWidthPx, `${stateName} phone375 coverage`).toBeGreaterThan(190);
              expect(projectedHeightPx, `${stateName} phone375 coverage`).toBeGreaterThan(120);
              expect(topPx, `${stateName} top control clearance`).toBeGreaterThan(120);
              expect(bottomEdgePx, `${stateName} lower control clearance`).toBeLessThan(340);
            }

            if (layout === "phone") {
              // The 286 px compact canvas uses a deliberately higher pose to
              // retain λ = 2.5 grip clearance. Its default and actual
              // primary-control maximum must nevertheless be larger than the
              // V17 tiny composition and remain outside the control zones.
              expect(projectedWidthPx, `${stateName} compact-phone coverage`).toBeGreaterThan(165);
              expect(projectedHeightPx, `${stateName} compact-phone coverage`).toBeGreaterThan(140);
              expect(topPx, `${stateName} top control clearance`).toBeGreaterThan(150);
              expect(bottomEdgePx, `${stateName} lower control clearance`).toBeLessThan(320);
            }
          }
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
