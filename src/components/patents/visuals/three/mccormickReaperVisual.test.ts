import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { stepMcCormickReaper } from "@/physics/catalogKernels";
import {
  createMcCormickTransportUpdater,
  getMcCormickTapeFrame,
  MCCORMICK_FRANKENSIM_BOUNDARY,
  MCCORMICK_KERNEL_SOURCE,
  MCCORMICK_SOURCE_BOUNDARY,
  readMcCormickRuntimeControls,
} from "@/physics/mccormickReaperKernel";
import {
  MCCORMICK_DESKTOP_LOWER_CLEARANCE_PX,
  MCCORMICK_DESKTOP_SAFE_TOP_PX,
  MCCORMICK_REAPER_CAMERA_PRESETS,
  mccormickReaperCameraForViewport,
} from "./mccormickReaperCamera";
import {
  buildMcCormickReaperModel,
  MCCORMICK_FIRST_PINION_INDEXING_RAD,
  updateMcCormickReaperKinematics,
} from "./mccormickReaperModel";

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
    expect(modelSource).not.toContain("mccormickReelCrate");
    expect(modelSource).not.toContain("operator spring seat");
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
    expect(threeSource).not.toContain("TickScheduler");
    expect(threeSource).not.toContain("createStudioClock");
    expect(threeSource).not.toContain("globalTransportBus.registerUpdater");
    expect(threeSource).not.toContain("PortHamiltonianEnergyStrip");
  });

  test("exposes authentic camera presets and UI overlay for grain reaper observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "McCormickReaper3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "sickle_guards",
      "grain_reel",
      "platform",
      "drive_wheel",
      "gear_train",
      "reel_belt",
      "top",
    ]) {
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
      "gear_train",
      "reel_belt",
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
          const timeSec = frame / 60;
          const groundWheelRad = reaper.groundWheelOmegaRadPerS * timeSec;
          updateMcCormickReaperKinematics(
            model,
            {
              groundWheelRad,
              countershaftRad: -groundWheelRad * reaper.firstGearRatio,
              cutterCrankRad: groundWheelRad * reaper.cutterToWheelRatio,
              reelRad: groundWheelRad * reaper.reelToWheelRatio,
              travelM: reaper.groundSpeedMps * timeSec,
            },
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

  test("keeps the double crank and both connected pitmans visible in the phone inspection view", () => {
    const phoneCanvas = { width: 343, height: 380 };
    const view = mccormickReaperCameraForViewport("sickle_guards", phoneCanvas.width);
    const model = buildMcCormickReaperModel();
    try {
      updateMcCormickReaperKinematics(
        model,
        {
          groundWheelRad: 0.12,
          countershaftRad: -0.4,
          cutterCrankRad: 1.2,
          reelRad: 0.13,
          travelM: 0,
        },
        false,
        false,
        true,
      );
      model.rootGroup.updateMatrixWorld(true);

      const camera = new THREE.PerspectiveCamera(
        42,
        phoneCanvas.width / phoneCanvas.height,
        0.1,
        1000,
      );
      camera.position.set(...view.pos);
      camera.lookAt(...view.target);
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();

      for (const [name, member] of [
        ["double crank", model.cutterCrankGroup],
        ["lower pitman", model.lowerPitman],
        ["upper pitman", model.upperPitman],
      ] as const) {
        const bounds = projectedObjectBounds(member, camera);
        expect(bounds.minX, `${name} left`).toBeGreaterThan(-0.9);
        expect(bounds.maxX, `${name} right`).toBeLessThan(0.9);
        expect(bounds.minY, `${name} bottom`).toBeGreaterThan(-0.9);
        expect(bounds.maxY, `${name} top`).toBeLessThan(0.8);
      }
    } finally {
      model.dispose();
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
    expect(result.groundGearTeeth).toBe(30);
    expect(result.countershaftPinionTeeth).toBe(9);
    expect(result.countershaftGearTeeth).toBe(27);
    expect(result.crankPinionTeeth).toBe(9);
    expect(result.firstGearRatio).toBe(30 / 9);
    expect(result.secondGearRatio).toBe(27 / 9);
    expect(result.cutterToWheelRatio).toBe(10);
    expect(result.reelToWheelRatio).toBe(13 / 12);
    expect(result.upperCutterToothLengthIn).toBe(1.5);
  });

  test("indexes both external meshes tooth-to-valley and preserves that phase under motion", () => {
    // A contact phase sum of pi means one member presents a tooth center
    // while the other presents the center of a valley. This catches the
    // visually plausible but nonphysical tooth-on-tooth zero phase that the
    // old decorative transmission used.
    const contactPhase = (phase: number) => {
      const wrapped = phase % (2 * Math.PI);
      return wrapped < 0 ? wrapped + 2 * Math.PI : wrapped;
    };

    for (const groundWheelRad of [0, 0.17, 1.2, Math.PI * 3.4]) {
      const countershaftRad = -groundWheelRad * (30 / 9);
      const cutterCrankRad = groundWheelRad * 10;
      const stageOnePhase = contactPhase(
        30 * (Math.PI / 2 - groundWheelRad) +
          9 * (-Math.PI / 2 - countershaftRad - MCCORMICK_FIRST_PINION_INDEXING_RAD),
      );
      const stageTwoPhase = contactPhase(
        27 * (Math.PI / 2 - countershaftRad) + 9 * (-Math.PI / 2 - cutterCrankRad),
      );
      expect(stageOnePhase).toBeCloseTo(Math.PI, 10);
      expect(stageTwoPhase).toBeCloseTo(Math.PI, 10);
    }
  });

  test("builds and articulates procedural platform, bull drive wheel, guard fingers, sickle bar, and reel correctly", () => {
    const model = buildMcCormickReaperModel();

    expect(model.rootGroup.children.length).toBeGreaterThan(2);
    expect(model.platformGroup).toBeDefined();
    expect(model.driveWheelGroup).toBeDefined();
    expect(model.groundGear).toBeDefined();
    expect(model.countershaftGroup).toBeDefined();
    expect(model.firstPinion).toBeDefined();
    expect(model.firstPinion.rotation.x).toBe(MCCORMICK_FIRST_PINION_INDEXING_RAD);
    expect(model.countershaftGear).toBeDefined();
    expect(model.cutterCrankGroup).toBeDefined();
    expect(model.crankPinion).toBeDefined();
    expect(model.cutterAssembly).toBeDefined();
    expect(model.sickleBarGroup).toBeDefined();
    expect(model.reelGroup).toBeDefined();
    expect(model.reelBeltSegments).toHaveLength(4);
    expect(model.stalksInstanced).toBeDefined();
    expect(model.materials.weatheredWood).toBeDefined();
    expect(model.materials.castIron).toBeDefined();
    expect(model.materials.sickleSteel).toBeDefined();

    const phases = {
      groundWheelRad: 1.2,
      countershaftRad: -4,
      cutterCrankRad: 12,
      reelRad: 1.3,
      travelM: 0.5,
    };
    updateMcCormickReaperKinematics(model, phases, true, true);
    expect(model.driveWheelGroup.rotation.x).toBe(phases.groundWheelRad);
    expect(model.countershaftGroup.rotation.x).toBe(phases.countershaftRad);
    expect(model.cutterCrankGroup.rotation.x).toBe(phases.cutterCrankRad);
    expect(model.reelGroup.rotation.x).toBe(phases.reelRad);
    expect(model.sickleBarGroup.position.x).toBeCloseTo(-model.upperCutterGroup.position.x, 12);
    expect(model.materials.weatheredWood.opacity).toBe(0.35);

    model.rootGroup.updateMatrixWorld(true);
    const intersects = (a: THREE.Object3D, b: THREE.Object3D) =>
      new THREE.Box3().setFromObject(a).intersectsBox(new THREE.Box3().setFromObject(b));
    expect(intersects(model.groundGear, model.firstPinion)).toBe(true);
    expect(intersects(model.countershaftGear, model.crankPinion)).toBe(true);
    for (const span of model.reelBeltSegments.slice(0, 2)) {
      expect(intersects(span, model.axlePulley)).toBe(true);
      expect(intersects(span, model.reelPulley)).toBe(true);
      expect(intersects(span, model.reelBeltSegments[2])).toBe(true);
      expect(intersects(span, model.reelBeltSegments[3])).toBe(true);
    }
    expect(intersects(model.reelBeltSegments[2], model.axlePulley)).toBe(true);
    expect(intersects(model.reelBeltSegments[3], model.reelPulley)).toBe(true);
    expect(intersects(model.lowerPitman, model.lowerCrankPin)).toBe(true);
    expect(intersects(model.upperPitman, model.upperCrankPin)).toBe(true);

    updateMcCormickReaperKinematics(model, phases, true, false, false);
    expect(model.upperCutterGroup.visible).toBe(false);
    expect(model.upperPitman.visible).toBe(false);

    model.dispose();
  });

  test("shares exact gear, belt, pause, reset, and refusal state on the route-owned tape", () => {
    let raw: Record<string, number | boolean> = {
      forwardSpeedMph: 2.5,
      isRunning: true,
      resetEpoch: 0,
    };
    const updater = createMcCormickTransportUpdater(() => readMcCormickRuntimeControls(raw));
    for (let tick = 0; tick < 12; tick += 1) updater({} as never, 1 / 60);
    const moving = getMcCormickTapeFrame();
    expect(moving).not.toBeNull();
    expect(moving?.phases.countershaftRad).toBeCloseTo(
      -(moving?.phases.groundWheelRad ?? 0) * (30 / 9),
      12,
    );
    expect(moving?.phases.cutterCrankRad).toBeCloseTo(
      (moving?.phases.groundWheelRad ?? 0) * 10,
      12,
    );
    expect(moving?.phases.reelRad).toBeCloseTo(
      (moving?.phases.groundWheelRad ?? 0) * (13 / 12),
      12,
    );

    raw = { ...raw, isRunning: false };
    updater({} as never, 1 / 60);
    const held = getMcCormickTapeFrame();
    updater({} as never, 1 / 60);
    expect(getMcCormickTapeFrame()).toEqual(held);

    raw = { ...raw, resetEpoch: 1 };
    updater({} as never, 1 / 60);
    expect(getMcCormickTapeFrame()?.timeSec).toBe(0);
    expect(getMcCormickTapeFrame()?.phases).toMatchObject({
      groundWheelRad: 0,
      countershaftRad: 0,
      cutterCrankRad: 0,
      reelRad: 0,
      travelM: 0,
    });
    expect(MCCORMICK_KERNEL_SOURCE).toBe("source-bounded-ts");
    expect(MCCORMICK_FRANKENSIM_BOUNDARY).toContain("cutting-contact");
    expect(MCCORMICK_SOURCE_BOUNDARY).toContain("30:9 and 27:9");
  });
});
