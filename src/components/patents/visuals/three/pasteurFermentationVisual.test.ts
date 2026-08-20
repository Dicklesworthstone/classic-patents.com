import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepPasteurFermentation } from "@/physics/catalogKernels";
import {
  buildPasteurFermentationModel,
  updatePasteurFermentationKinematics,
} from "./pasteurFermentationModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 135,245 Louis Pasteur Brewing & Fermentation visual & biophysics boundary", () => {
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
    expect(modelSource).not.toContain("stepPasteurFermentation({})");
    expect(modelSource).toContain("wortTempC: fermentationTempC");
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

  test("exposes authentic camera presets and cutaway mode for fermentation vat inspection", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "PasteurFermentation3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "gooseneck_airlock",
      "cooling_coil",
      "sampling_valve",
      "cotton_filter",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Pasteur Fermentation Vat 3D");
  });

  test("computes genuine log reduction, yeast activity, and alcohol yield in SI units", () => {
    const result = stepPasteurFermentation({
      pasteurizationTempC: 58,
      holdTimeMin: 20,
      wortTempC: 22,
    });
    expect(result.logReduction).toBeGreaterThan(4);
    expect(result.yeastActivityPct).toBeGreaterThan(80);
    expect(result.alcoholAbvPct).toBeGreaterThan(3.5);
    expect(result.co2PressureBar).toBeGreaterThan(1.0);
    expect(result.bathGlowOpacity).toBeCloseTo(58 / 120, 3);
    expect(result.microbeCount).toBe(14);
    expect(result.microbeWobbleOmega).toBe(3);
  });

  test("builds and articulates procedural tripod, copper vat, gooseneck airlock, and cooling coils correctly", () => {
    const { rootGroup, nodes, materials, dispose } = buildPasteurFermentationModel();
    expect(rootGroup.children.length).toBeGreaterThan(0);
    expect(nodes.tripod).toBeDefined();
    expect(nodes.tank).toBeDefined();
    expect(nodes.domeLid).toBeDefined();
    expect(nodes.airlockMesh).toBeDefined();
    expect(nodes.cottonBulb).toBeDefined();

    updatePasteurFermentationKinematics(nodes, materials, 0.016, 0.5, 22, 95, true, true);
    expect(materials.tinnedCopper.transparent).toBe(true);
    expect(nodes.bubblePoints.visible).toBe(true);

    dispose();
  });
});
