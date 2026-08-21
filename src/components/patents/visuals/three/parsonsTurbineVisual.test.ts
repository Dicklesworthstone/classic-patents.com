import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepParsonsMarine } from "@/physics/parsonsMarineKernel";
import { buildParsonsTurbineModel, updateParsonsTurbineKinematics } from "./parsonsTurbineModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 608,969 Sir Charles Parsons marine routing visual boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "ParsonsTurbine3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "parsonsTurbineModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildParsonsTurbineModel");
    expect(modelSource).toContain("updateParsonsTurbineKinematics");
    expect(modelSource).toContain("stepParsonsMarine");
    expect(modelSource).toContain("routeEdges");
    expect(modelSource).not.toContain("dummyPiston");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "ParsonsTurbine3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "parsonsTurbineModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for turbine observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "ParsonsTurbine3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "figure_1_banks",
      "figure_2_reverse",
      "figure_3_network",
      "shaft_network",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Parsons Steam Turbine 3D");
    expect(threeSource).toContain("controls.setView");
    expect(threeSource).not.toContain("cameraRef");
  });

  test("changes the physical route topology and reversing flow", () => {
    const series = stepParsonsMarine({ routing: "series" });
    const parallel = stepParsonsMarine({ routing: "simple-parallel" });
    const astern = stepParsonsMarine({ reversing: true });
    expect(series.routeEdges).not.toEqual(parallel.routeEdges);
    expect(series.routeEdges.length).toBe(9);
    expect(astern.directionLabel).toBe("astern");
    expect(astern.activeTurbines).toEqual(["X", "Y"]);
  });

  test("builds and articulates procedural turbine banks, pipes, and steam flow correctly", () => {
    const { rootGroup, nodes, materials, dispose } = buildParsonsTurbineModel();
    expect(rootGroup.children.length).toBeGreaterThan(2);
    expect(nodes.casingShells.length).toBe(10);
    expect(nodes.turbineMeshes.length).toBe(10);
    expect(nodes.pipeMeshes.length).toBeGreaterThan(0);
    expect(nodes.steamPositions.length).toBe(300 * 3);

    updateParsonsTurbineKinematics(
      nodes,
      materials,
      0.016,
      0.5,
      0.3,
      1.2,
      0.72,
      0.2,
      true,
      true,
      "compound-parallel",
    );
    expect(materials.castIronCasing.transparent).toBe(true);

    dispose();
  });
});
