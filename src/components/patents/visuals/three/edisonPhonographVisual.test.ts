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

  test("exposes authentic camera presets and cutaway mode for phonograph observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "EdisonPhonograph3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "stylus_groove",
      "tinfoil_cylinder",
      "brass_horn",
      "flywheel",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Edison Phonograph 3D");
  });

  test("computes genuine cylinder surface velocity, groove depth, and axial lead-screw pitch in SI units", () => {
    const result = stepEdisonPhonograph({
      mandrelRpm: 60,
      voiceVolumeDb: 75,
    });
    expect(result.surfaceSpeedCmPerS).toBeGreaterThan(15);
    expect(result.grooveDepthMicrons).toBeGreaterThan(5);
    expect(result.axialTravelMmPerS).toBeGreaterThan(1);
    expect(result.audioBandwidthHz).toBeGreaterThan(1000);
  });

  test("builds and articulates procedural mahogany plinth, tinfoil cylinder, diaphragm, stylus, and horn correctly", () => {
    const model = buildEdisonPhonographModel();
    expect(model.rootGroup.children.length).toBeGreaterThan(0);
    expect(model.cylinderGroup).toBeDefined();
    expect(model.soundBoxGroup).toBeDefined();
    expect(model.stylus).toBeDefined();
    expect(model.flywheel).toBeDefined();

    updateEdisonPhonographKinematics(model, 0.016, 0.5, 60, 25, true);
    expect(model.materials.mahogany.transparent).toBe(true);

    model.dispose();
  });
});
