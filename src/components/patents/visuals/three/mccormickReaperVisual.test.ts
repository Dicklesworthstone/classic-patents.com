import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { stepMcCormickReaper } from "@/physics/catalogKernels";
import {
  MCCORMICK_DESKTOP_LOWER_CLEARANCE_PX,
  MCCORMICK_DESKTOP_SAFE_TOP_PX,
  MCCORMICK_REAPER_CAMERA_PRESETS,
  mccormickReaperCameraForViewport,
} from "./mccormickReaperCamera";
import { buildMcCormickReaperModel, updateMcCormickReaperKinematics } from "./mccormickReaperModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");
const DESKTOP_AUDIT_VIEWPORT = { width: 1214, height: 460 };

function projectedObjectBounds(root: THREE.Object3D, camera: THREE.PerspectiveCamera) {
  const bounds = {
    minX: Number.POSITIVE_INFINITY,
    maxX: Number.NEGATIVE_INFINITY,
    minY: Number.POSITIVE_INFINITY,
    maxY: Number.NEGATIVE_INFINITY,
  };
  root.traverse((node) => {
    const positions = (node as THREE.Mesh).geometry?.getAttribute("position");
    if (!positions) return;
    const point = new THREE.Vector3();
    for (let index = 0; index < positions.count; index += 1) {
      point.fromBufferAttribute(positions, index).applyMatrix4(node.matrixWorld).project(camera);
      bounds.minX = Math.min(bounds.minX, point.x);
      bounds.maxX = Math.max(bounds.maxX, point.x);
      bounds.minY = Math.min(bounds.minY, point.y);
      bounds.maxY = Math.max(bounds.maxY, point.y);
    }
  });
  return bounds;
}

describe("US X8277 Cyrus McCormick Grain Reaper visual & kinematics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "McCormickReaper3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "mccormickReaperModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildMcCormickReaperModel");
    expect(modelSource).toContain("updateMcCormickReaperKinematics");
    expect(modelSource).toContain("mccormickReelCrate");
    expect(modelSource).not.toContain("0.4 + Math.abs(reelRadPerSec)");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "McCormickReaper3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "mccormickReaperModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and UI overlay for grain reaper observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "McCormickReaper3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "sickle_guards", "grain_reel", "platform", "drive_wheel", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("McCormick Reaper 3D");
    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("controls.setView");
    expect(threeSource).not.toContain("cameraRef");
  });

  test("keeps the complete articulated reaper inside the actual desktop canvas in every audited state", () => {
    const { width, height } = DESKTOP_AUDIT_VIEWPORT;
    const desktopIso = mccormickReaperCameraForViewport("iso", width);
    const safeTopNdc = 1 - (2 * MCCORMICK_DESKTOP_SAFE_TOP_PX) / height;
    const safeBottomNdc = -1 + (2 * MCCORMICK_DESKTOP_LOWER_CLEARANCE_PX) / height;

    expect(desktopIso).toEqual({ pos: [11.7, 7.8, 12.3], target: [0, -0.5, 0] });
    // The desktop correction must not silently revise compact framing or any
    // source-oriented inspection view.
    expect(mccormickReaperCameraForViewport("iso", 718)).toEqual(
      MCCORMICK_REAPER_CAMERA_PRESETS.iso,
    );
    for (const preset of [
      "sickle_guards",
      "grain_reel",
      "platform",
      "drive_wheel",
      "top",
    ] as const) {
      expect(mccormickReaperCameraForViewport(preset, width)).toEqual(
        MCCORMICK_REAPER_CAMERA_PRESETS[preset],
      );
    }

    const auditedStates = [
      { name: "default", forwardSpeedMph: 2.5 },
      { name: "primary-control-max", forwardSpeedMph: 6.0 },
      // Claim inversion does not alter this source-bound geometry, but it is
      // a persisted desktop audit state and must retain the complete pose.
      { name: "claim-inverted", forwardSpeedMph: 6.0 },
    ] as const;

    for (const state of auditedStates) {
      const reaper = stepMcCormickReaper({ forwardSpeedMph: state.forwardSpeedMph });
      const model = buildMcCormickReaperModel();
      try {
        const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
        camera.position.set(...desktopIso.pos);
        camera.lookAt(...desktopIso.target);
        camera.updateProjectionMatrix();
        camera.updateMatrixWorld();

        const envelope = {
          minX: Number.POSITIVE_INFINITY,
          maxX: Number.NEGATIVE_INFINITY,
          minY: Number.POSITIVE_INFINITY,
          maxY: Number.NEGATIVE_INFINITY,
        };
        // Four seconds at the real 60 Hz studio cadence samples more than two
        // default reel rotations and six maximum-speed rotations. It catches
        // the reciprocating cutter and the higher reel slat envelope, not just
        // the still frame that happened to be captured by the audit.
        for (let frame = 0; frame <= 240; frame += 1) {
          updateMcCormickReaperKinematics(
            model,
            reaper.groundWheelOmegaRadPerS,
            reaper.reelOmegaRadPerS,
            reaper.cutterOmegaRadPerS,
            frame / 60,
            true,
            false,
          );
          model.rootGroup.updateMatrixWorld(true);
          const projection = projectedObjectBounds(model.rootGroup, camera);
          envelope.minX = Math.min(envelope.minX, projection.minX);
          envelope.maxX = Math.max(envelope.maxX, projection.maxX);
          envelope.minY = Math.min(envelope.minY, projection.minY);
          envelope.maxY = Math.max(envelope.maxY, projection.maxY);
        }

        expect(envelope.minX, `${state.name} reaper left edge`).toBeGreaterThan(-0.85);
        expect(envelope.maxX, `${state.name} reaper right edge`).toBeLessThan(0.85);
        expect(
          envelope.minY,
          `${state.name} forward cutter envelope above canvas floor`,
        ).toBeGreaterThan(safeBottomNdc);
        expect(envelope.maxY, `${state.name} reel clear of View rail`).toBeLessThan(safeTopNdc);
      } finally {
        model.dispose();
      }
    }
  });

  test("computes genuine ground drive ratio, reel speed, and cutter frequency in SI units", () => {
    const result = stepMcCormickReaper({ forwardSpeedMph: 2.5 });
    expect(result.groundWheelRpm).toBeGreaterThan(20);
    expect(result.cutterCrankRpm).toBeGreaterThan(100);
    expect(result.reelRpm).toBeGreaterThan(10);
    expect(result.cutterHz).toBeGreaterThan(5);
    expect(result.reelBarPct).toBeCloseTo(Math.min(100, (result.reelRpm / 80) * 100), 1);
    expect(result.cutterSvgAmp).toBe(18);
    expect(result.reelToCutterRatio).toBeCloseTo(
      result.reelOmegaRadPerS / result.cutterOmegaRadPerS,
      5,
    );
  });

  test("builds and articulates procedural platform, bull drive wheel, guard fingers, sickle bar, and reel correctly", () => {
    const model = buildMcCormickReaperModel();

    expect(model.rootGroup.children.length).toBeGreaterThan(2);
    expect(model.platformGroup).toBeDefined();
    expect(model.driveWheelGroup).toBeDefined();
    expect(model.cutterAssembly).toBeDefined();
    expect(model.sickleBarGroup).toBeDefined();
    expect(model.reelGroup).toBeDefined();
    expect(model.stalksInstanced).toBeDefined();
    expect(model.materials.weatheredWood).toBeDefined();
    expect(model.materials.castIron).toBeDefined();
    expect(model.materials.sickleSteel).toBeDefined();

    // Test kinematics update & cutaway
    updateMcCormickReaperKinematics(model, 3.5, 1.2, 10.0, 1.0, true, true);
    expect(model.driveWheelGroup.rotation.x).toBe(3.5);
    expect(model.materials.weatheredWood.opacity).toBe(0.35);

    model.dispose();
  });
});
