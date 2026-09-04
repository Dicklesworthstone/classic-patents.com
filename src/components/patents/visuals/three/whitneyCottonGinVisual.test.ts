import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { stepWhitneyCottonGin } from "@/physics/catalogKernels";
import {
  createWhitneyTransportUpdater,
  getWhitneyTapeFrame,
  readWhitneyRuntimeControls,
  WHITNEY_FRANKENSIM_BOUNDARY,
  WHITNEY_KERNEL_SOURCE,
  WHITNEY_SOURCE_BOUNDARY,
} from "@/physics/whitneyCottonGinKernel";
import {
  buildWhitneyCottonGinModel,
  updateWhitneyCottonGinKinematics,
} from "./whitneyCottonGinModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US X72 Eli Whitney Cotton Gin visual & kinematics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "WhitneyCottonGin3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "whitneyCottonGinModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildWhitneyCottonGinModel");
    expect(modelSource).toContain("updateWhitneyCottonGinKinematics");
    expect(modelSource).not.toContain("stepWhitneyCottonGin({})");
    expect(threeSource).toContain("getWhitneyTapeFrame");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "WhitneyCottonGin3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "whitneyCottonGinModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
    expect(threeSource).not.toContain("createStudioClock");
    expect(threeSource).not.toContain("globalTransportBus.registerUpdater");
    expect(threeSource).not.toContain("PortHamiltonianEnergyStrip");
  });

  test("exposes authentic camera presets and UI overlay for cotton gin observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "WhitneyCottonGin3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "grate_teeth",
      "brush_drum",
      "hopper",
      "direct_winch",
      "whirl_drive",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Whitney Cotton Gin 3D");
    expect(threeSource).toContain("controls.setView");
    expect(threeSource).not.toContain("cameraRef");
  });

  test("closes the source-disclosed direct drive and declared crossed-band ratio", () => {
    const result = stepWhitneyCottonGin({ crankRpm: 180 });
    expect(result.outputLbsPerDay).toBeGreaterThan(40);
    expect(result.sawRpm).toBeGreaterThan(100);
    expect(result.brushRpm).toBeGreaterThan(result.sawRpm);
    expect(result.laborMultiplier).toBeGreaterThan(40);
    expect(result.sawToCrankRatio).toBe(1);
    expect(result.brushToCrankRatio).toBe(3);
    expect(result.sourceLaborReductionFraction).toBe(49 / 50);
    expect(result.toothInclinationDeg).toBe(57.5);
    expect(result.annularRowMinimumPitchMm).toBeCloseTo((7 * 25.4) / 16, 4);
    expect(result.toothPreferredPitchMm).toBeCloseTo(25.4 / 16, 4);
    expect(result.grateStrokePx).toBeCloseTo(3.2 * 2.5, 2);
    expect(result.sawSvgR).toBe(65);
    expect(result.sawToothOuterSvgR).toBe(78);
    expect(result.brushSvgR).toBe(55);
    expect(result.bristleOuterSvgR).toBe(78);
    expect(result.sawToothCount).toBe(16);
    expect(result.bristleCount).toBe(24);
    expect(result.fiberSawCoupling).toBe(0.12);
    expect(result.fiberCarrySpeed).toBe(1.8);
    expect(result.fiberWrapZ).toBe(3.2);
  });

  test("builds connected wire teeth, four brush rows, crowned whirls, and crossed band", () => {
    const model = buildWhitneyCottonGinModel();

    expect(model.rootGroup.children.length).toBeGreaterThan(4);
    expect(model.frameGroup).toBeDefined();
    expect(model.grateGroup).toBeDefined();
    expect(model.sawCylinderGroup).toBeDefined();
    expect(model.brushCylinderGroup).toBeDefined();
    expect(model.crankGroup).toBeDefined();
    expect(model.drivePulleyGroup).toBeDefined();
    expect(model.brushPulleyGroup).toBeDefined();
    expect(model.wireTeeth.count).toBe(27 * 16);
    expect(model.brushBristles.count).toBe(4 * 29);
    expect(model.beltSpans).toHaveLength(2);
    expect(model.beltWraps).toHaveLength(2);
    expect(model.fiberPoints).toBeDefined();
    expect(model.seedsGroup).toBeDefined();
    expect(model.materials.walnutWood).toBeDefined();
    expect(model.materials.ironSaw).toBeDefined();
    expect(model.materials.brassGrate).toBeDefined();

    const phases = { crankRad: 0.75, cylinderRad: 0.75, clearerRad: -2.25, lintCycle01: 0.4 };
    updateWhitneyCottonGinKinematics(model, phases, true, true);
    expect(model.crankGroup.rotation.x).toBe(phases.cylinderRad);
    expect(model.sawCylinderGroup.rotation.x).toBe(phases.cylinderRad);
    expect(model.drivePulleyGroup.rotation.x).toBe(phases.cylinderRad);
    expect(model.brushCylinderGroup.rotation.x).toBe(phases.clearerRad);
    expect(model.brushPulleyGroup.rotation.x).toBe(phases.clearerRad);
    expect(model.materials.walnutWood.opacity).toBe(0.35);
    expect(model.fiberPoints.visible).toBe(true);

    model.rootGroup.updateMatrixWorld(true);
    const intersects = (a: THREE.Object3D, b: THREE.Object3D) =>
      new THREE.Box3().setFromObject(a).intersectsBox(new THREE.Box3().setFromObject(b));
    for (const span of model.beltSpans) {
      expect(intersects(span, model.drivePulleyGroup)).toBe(true);
      expect(intersects(span, model.brushPulleyGroup)).toBe(true);
    }
    for (const span of model.beltSpans) {
      expect(intersects(span, model.beltWraps[0])).toBe(true);
      expect(intersects(span, model.beltWraps[1])).toBe(true);
    }
    expect(intersects(model.beltWraps[0], model.drivePulleyGroup)).toBe(true);
    expect(intersects(model.beltWraps[1], model.brushPulleyGroup)).toBe(true);

    // The brush bristles must actually reach the wire teeth to doff cotton;
    // a visible air gap here would make the central mechanism non-physical.
    expect(intersects(model.wireTeeth, model.brushBristles)).toBe(true);

    model.dispose();
  });

  test("shares advance, exact pause, and reset on the route-owned tape", () => {
    let raw: Record<string, number | boolean> = {
      crankRpm: 60,
      seedGridClearance: 3.2,
      isRunning: true,
      resetEpoch: 0,
    };
    const updater = createWhitneyTransportUpdater(() => readWhitneyRuntimeControls(raw));
    for (let tick = 0; tick < 12; tick++) updater({} as never, 1 / 60);
    const moving = getWhitneyTapeFrame();
    expect(moving?.phases.crankRad).toBeCloseTo(moving?.phases.cylinderRad ?? 1, 12);
    expect(moving?.phases.clearerRad).toBeCloseTo(-(moving?.phases.cylinderRad ?? 0) * 3, 12);

    raw = { ...raw, isRunning: false };
    updater({} as never, 1 / 60);
    const held = getWhitneyTapeFrame();
    updater({} as never, 1 / 60);
    expect(getWhitneyTapeFrame()).toEqual(held);

    raw = { ...raw, resetEpoch: 1 };
    updater({} as never, 1 / 60);
    expect(getWhitneyTapeFrame()?.timeSec).toBe(0);
    expect(getWhitneyTapeFrame()?.phases.cylinderRad).toBe(0);
    expect(WHITNEY_KERNEL_SOURCE).toContain("source-bounded-ts");
    expect(WHITNEY_FRANKENSIM_BOUNDARY).toContain("belt-contact-browser-composition-unavailable");
    expect(WHITNEY_SOURCE_BOUNDARY).toContain("directly couples the winch");
  });
});
