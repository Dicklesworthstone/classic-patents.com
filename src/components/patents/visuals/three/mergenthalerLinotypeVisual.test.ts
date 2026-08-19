import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepMergenthalerLinotype } from "@/physics/machineKernels";
import {
  buildMergenthalerLinotypeModel,
  updateMergenthalerLinotypeKinematics,
} from "./mergenthalerLinotypeModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 313,224 Ottmar Mergenthaler Linotype visual & mechanics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "MergenthalerLinotype3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "mergenthalerLinotypeModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildMergenthalerLinotypeModel");
    expect(modelSource).toContain("updateMergenthalerLinotypeKinematics");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "MergenthalerLinotype3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "mergenthalerLinotypeModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for linecaster observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "MergenthalerLinotype3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "matrix_magazine",
      "casting_pot",
      "spaceband_justifier",
      "keyboard",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Mergenthaler Linotype 3D");
  });

  test("computes genuine Linotype justification width and eutectic pot properties in SI units", () => {
    const result = stepMergenthalerLinotype({
      matrixRatePerMin: 60,
      spacebandWedgeMm: 6.5,
      potTempC: 260,
    });
    expect(result.justificationWidthMm).toBeGreaterThan(100);
    expect(result.solidificationTimeMs).toBe(450);
    expect(result.brinellHardness).toBe(24);
    expect(result.isEutecticTemp).toBe(true);
    expect(result.wedgeLift).toBeCloseTo(0.0975, 3);
    expect(result.slugSvgWidth).toBeCloseTo(result.justificationWidthMm * 2.8, 2);
  });

  test("builds and articulates procedural magazine, spacebands, casting pot, and mold disk correctly", () => {
    const { rootGroup, nodes, materials, dispose } = buildMergenthalerLinotypeModel();
    expect(rootGroup.children.length).toBeGreaterThan(4);
    expect(nodes.matrices.length).toBe(8);
    expect(nodes.spacebands.length).toBe(3);
    expect(nodes.potBody).toBeDefined();
    expect(nodes.moldDisk).toBeDefined();

    const line = stepMergenthalerLinotype({
      matrixRatePerMin: 60,
      spacebandWedgeMm: 6.5,
      potTempC: 260,
    });
    updateMergenthalerLinotypeKinematics(
      nodes,
      materials,
      0.016,
      0,
      0.2,
      Math.PI / 4,
      true,
      line.wedgeLift,
    );
    expect(nodes.slugMesh.visible).toBe(true);

    dispose();
  });
});
