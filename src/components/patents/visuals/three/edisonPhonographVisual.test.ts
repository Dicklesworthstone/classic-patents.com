import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { stepEdisonPhonograph } from "@/physics/catalogKernels";
import { edisonPhonographCameraForViewport } from "./edisonPhonographCamera";
import {
  buildEdisonPhonographModel,
  updateEdisonPhonographKinematics,
} from "./edisonPhonographModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

function projectedMeshBounds(mesh: THREE.Mesh, camera: THREE.PerspectiveCamera) {
  const positions = mesh.geometry.getAttribute("position");
  const projected: THREE.Vector3[] = [];
  const point = new THREE.Vector3();
  for (let index = 0; index < positions.count; index += 1) {
    projected.push(
      point
        .fromBufferAttribute(positions, index)
        .applyMatrix4(mesh.matrixWorld)
        .project(camera)
        .clone(),
    );
  }
  return {
    minX: Math.min(...projected.map((projectedPoint) => projectedPoint.x)),
    maxX: Math.max(...projected.map((projectedPoint) => projectedPoint.x)),
    minY: Math.min(...projected.map((projectedPoint) => projectedPoint.y)),
    maxY: Math.max(...projected.map((projectedPoint) => projectedPoint.y)),
  };
}

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

  test("keeps the complete illustrative speaking tube inside 320 and 375 px phone canvases", () => {
    const model = buildEdisonPhonographModel();
    try {
      model.rootGroup.updateMatrixWorld(true);
      const desktop = edisonPhonographCameraForViewport("iso", 1214);
      const tablet = edisonPhonographCameraForViewport("iso", 718);

      // Preserve the existing wider-screen overview exactly; the camera expands
      // only for the portrait phone canvas.
      expect(desktop).toEqual({ pos: [9.5, 7, 11], target: [0, 0, 0] });
      expect(tablet).toEqual(desktop);

      for (const [viewportWidth, canvasWidth] of [
        [320, 288],
        [375, 343],
      ]) {
        const view = edisonPhonographCameraForViewport("iso", canvasWidth);
        const camera = new THREE.PerspectiveCamera(42, canvasWidth / 380, 0.1, 1000);
        camera.position.set(...view.pos);
        camera.lookAt(...view.target);
        camera.updateProjectionMatrix();
        camera.updateMatrixWorld();

        const hornFrame = projectedMeshBounds(model.horn, camera);
        const fullFrame = projectedObjectBounds(model.rootGroup, camera);

        // NDC ±1 is the canvas edge. The horn keeps a deliberate 0.15+ horizontal
        // margin instead of merely moving its crop elsewhere. The full apparatus
        // also avoids a new right-edge collision on the narrowest card.
        expect(hornFrame.minX, `${viewportWidth}px horn left edge`).toBeGreaterThan(-0.85);
        expect(hornFrame.maxX, `${viewportWidth}px horn right edge`).toBeLessThan(0.05);
        expect(hornFrame.minY, `${viewportWidth}px horn lower edge`).toBeGreaterThan(-0.85);
        expect(hornFrame.maxY, `${viewportWidth}px horn upper edge`).toBeLessThan(0.85);
        expect(fullFrame.minX, `${viewportWidth}px apparatus left edge`).toBeGreaterThan(-0.93);
        expect(fullFrame.maxX, `${viewportWidth}px apparatus right edge`).toBeLessThan(0.93);
      }
    } finally {
      model.dispose();
    }
  });

  test("keeps source-specified pitch distinct from model-only display assumptions", () => {
    const result = stepEdisonPhonograph({
      mandrelRpm: 60,
      voiceVolumeDb: 75,
    });
    expect(result.sourceGroovesPerInch).toBe(10);
    expect(result.sourceThreadsPerInch).toBe(10);
    expect(result.leadScrewPitchMm).toBe(2.54);
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
    expect(threeDimensionalSource).toContain("Reader aid only");
    expect(threeDimensionalSource).toContain("Illustrative stylus motion");
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
