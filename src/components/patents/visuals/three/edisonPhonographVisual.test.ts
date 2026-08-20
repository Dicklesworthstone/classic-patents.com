import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepEdisonPhonograph } from "@/physics/catalogKernels";
import {
  buildEdisonPhonographModel,
  updateEdisonPhonographKinematics,
} from "./edisonPhonographModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 200,521 Thomas Edison Tinfoil Phonograph visual & acoustics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "EdisonPhonograph3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "edisonPhonographModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildEdisonPhonographModel");
    expect(modelSource).toContain("updateEdisonPhonographKinematics");
    expect(modelSource).not.toContain("stepEdisonPhonograph({})");
    expect(threeSource).toContain("p.cylinderRpm");
    expect(threeSource).toContain("p.voiceVolumeDb");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "EdisonPhonograph3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "edisonPhonographModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes source-linked views and an explicitly illustrative drive view", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "EdisonPhonograph3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "stylus_groove",
      "tinfoil_cylinder",
      "speaking_tube",
      "illustrative_drive",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Edison Phonograph 3D");
  });

  test("keeps source-specified pitch distinct from model-only display assumptions", () => {
    const result = stepEdisonPhonograph({
      mandrelRpm: 60,
      voiceVolumeDb: 75,
    });
    expect(result.sourceGroovesPerInch).toBe(10);
    expect(result.sourceThreadsPerInch).toBe(10);
    expect(result.leadScrewPitchMm).toBe(2.54);
    expect(result.modelMandrelDiameterInches).toBeGreaterThan(0);
    expect(result.stylusAmp).toBeGreaterThan(0);
    expect(result.stylusOmegaRadPerS).toBeGreaterThan(0);
    expect(result.axialDisplayWrapMm).toBeGreaterThan(0);
    expect(result.axialSvgPxPerMm).toBe(2);
    expect(result.driveIndicatorSvgR).toBe(45);
  });

  test("builds a source-linked cylinder and labels unsupported display geometry as illustrative", () => {
    const model = buildEdisonPhonographModel();
    expect(model.rootGroup.children.length).toBeGreaterThan(0);
    expect(model.cylinderGroup).toBeDefined();
    expect(model.soundBoxGroup).toBeDefined();
    expect(model.stylus).toBeDefined();
    expect(model.rotationReferenceWheel).toBeDefined();

    const phono = stepEdisonPhonograph({ mandrelRpm: 60, voiceVolumeDb: 75 });
    updateEdisonPhonographKinematics(
      model,
      0.016,
      0.5,
      phono.mandrelOmegaRadPerS,
      phono.stylusAmp,
      phono.stylusOmegaRadPerS,
      true,
    );
    expect(model.materials.illustrativeBase.transparent).toBe(true);

    model.dispose();
  });

  test("does not pass model-only material, drive, or acoustics assumptions off as printed facts", () => {
    const twoDimensionalSource = readFileSync(
      join(VISUALS_DIRECTORY, "EdisonPhonographSim.tsx"),
      "utf8",
    );
    const threeDimensionalSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "EdisonPhonograph3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "edisonPhonographModel.ts"),
      "utf8",
    );
    const kernelSource = readFileSync(
      join(process.cwd(), "src", "physics", "catalogKernels.ts"),
      "utf8",
    );

    expect(twoDimensionalSource).toContain("Illustrative clock-work rate");
    expect(twoDimensionalSource).toContain("Illustrative diaphragm-excitation level");
    expect(twoDimensionalSource).toContain("model-only reader aids");
    expect(twoDimensionalSource).toContain("additional patent claims");
    expect(threeDimensionalSource).toContain("model-only reader aids");
    expect(modelSource).toContain("not source claims");
    expect(kernelSource).toContain("model-only display");
    for (const unsupportedHistoricalLabel of ["Mica Diaphragm", "Brass Horn", "Flywheel"]) {
      expect(twoDimensionalSource).not.toContain(unsupportedHistoricalLabel);
      expect(threeDimensionalSource).not.toContain(unsupportedHistoricalLabel);
      expect(modelSource).not.toContain(unsupportedHistoricalLabel);
    }
  });

  test("uses request-animation-frame elapsed time rather than a fabricated fixed physics timestep", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "EdisonPhonograph3D.tsx"),
      "utf8",
    );

    expect(threeSource).toContain("const animate = (frameMs: number)");
    expect(threeSource).toContain("lastFrameMs");
    expect(threeSource).not.toContain("const dt = 1 / 60");
  });
});
