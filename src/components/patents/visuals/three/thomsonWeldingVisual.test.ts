import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepThomsonWelding } from "@/physics/catalogKernels";
import { buildThomsonWeldingModel, updateThomsonWeldingKinematics } from "./thomsonWeldingModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 347,140 Elihu Thomson Electric Resistance Butt-Welding visual & electro-thermal boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "ThomsonWelding3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "thomsonWeldingModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildThomsonWeldingModel");
    expect(modelSource).toContain("updateThomsonWeldingKinematics");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "ThomsonWelding3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "thomsonWeldingModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for welder observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "ThomsonWelding3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "weld_junction",
      "transformer_core",
      "copper_clamps",
      "compression_screw",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Thomson Butt-Welder 3D");
  });

  test("computes genuine Thomson Joule heating and forged plastic upset state in SI units", () => {
    const result = stepThomsonWelding({ weldCurrentAmps: 4500, clampPressureMpa: 35 });
    expect(result.jouleKw).toBeGreaterThan(3.0);
    expect(result.interfaceTempC).toBeGreaterThan(800);
    expect(result.upsetBurrWidthMm).toBe(3.8);
    expect(result.weldPulseMs).toBeGreaterThan(200);
    expect(result.weldSeamScale).toBeCloseTo(1.35, 3);
    expect(result.jawStudioOffset).toBeCloseTo(0.12, 3);
  });

  test("builds and articulates procedural transformer, heavy copper clamps, and glowing weld seam correctly", () => {
    const { rootGroup, nodes, materials, dispose } = buildThomsonWeldingModel();
    expect(rootGroup.children.length).toBeGreaterThan(2);
    expect(nodes.leftJaw).toBeDefined();
    expect(nodes.rightJaw).toBeDefined();
    expect(nodes.weldSeam).toBeDefined();
    expect(nodes.sparkPoints).toBeDefined();

    const weld = stepThomsonWelding({ weldCurrentAmps: 4500, clampPressureMpa: 35 });
    updateThomsonWeldingKinematics(
      nodes,
      materials,
      0.016,
      0.5,
      weld.interfaceTempC,
      weld.weldGlowIntensity,
      weld.weldSeamScale,
      weld.jawStudioOffset,
      true,
      true,
    );
    expect(nodes.sparkPoints.visible).toBe(true);

    dispose();
  });
});
