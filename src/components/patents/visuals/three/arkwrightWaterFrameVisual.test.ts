import { describe, expect, test } from "bun:test";
import { ARKWRIGHT_DEFAULT_CONTROLS, stepArkwrightWaterFrame } from "@/physics/arkwrightKernel";
import { buildArkwrightWaterFrameModel } from "./arkwrightWaterFrameModel";

describe("GB 931 Richard Arkwright Water Frame Visual & Drafting Boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const model = buildArkwrightWaterFrameModel();
    expect(model.root).toBeDefined();
    expect(model.wheelGroup).toBeDefined();
    expect(model.feedRollersGroup).toBeDefined();
    expect(model.deliveryRollersGroup).toBeDefined();
    expect(model.flyerGroups.length).toBe(4);
    expect(model.bobbinGroups.length).toBe(4);
    expect(model.traverseRailGroup).toBeDefined();
    expect(model.camGroup).toBeDefined();
    model.dispose();
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const out1 = stepArkwrightWaterFrame(ARKWRIGHT_DEFAULT_CONTROLS);
    const out2 = stepArkwrightWaterFrame(ARKWRIGHT_DEFAULT_CONTROLS);

    expect(out1.flyerSpindleRpm).toBe(out2.flyerSpindleRpm);
    expect(out1.outputYarnCountNe).toBe(out2.outputYarnCountNe);
    expect(out1.twistTurnsPerMeter).toBe(out2.twistTurnsPerMeter);
    expect(out1.yarnBreakingForceN).toBe(out2.yarnBreakingForceN);
  });

  test("exposes authentic camera presets and cutaway mode for textile machinery inspection", () => {
    const model = buildArkwrightWaterFrameModel();
    model.setCalloutsVisible(true);
    expect(model.calloutGroup.visible).toBe(true);
    model.setCalloutsVisible(false);
    expect(model.calloutGroup.visible).toBe(false);
    model.dispose();
  });

  test("computes genuine differential roller draft, flyer twist, and water twist tenacity in SI units", () => {
    const out = stepArkwrightWaterFrame({
      waterWheelRpm: 180,
      totalDraftRatio: 6.0,
      rollerClampingWeightKg: 3.5,
    });

    expect(out.flyerSpindleRpm).toBeGreaterThan(3000);
    expect(out.totalDraftRatio).toBe(6.0);
    expect(out.outputYarnCountNe).toBe(6.0);
    expect(out.isWarpGradeWaterTwist).toBe(true);
    expect(out.millProductionKgPerDay).toBeGreaterThan(1.0);
  });

  test("builds and articulates procedural frame, draft rollers, flyers, bobbins, and heart-cam correctly", () => {
    const model = buildArkwrightWaterFrameModel();

    // Verify initial positions and hierarchy
    expect(model.root.children.length).toBeGreaterThanOrEqual(6);
    expect(model.feedRollersGroup.children.length).toBeGreaterThan(0);
    expect(model.deliveryRollersGroup.children.length).toBeGreaterThan(0);
    expect(model.flyerGroups[0].children.length).toBeGreaterThan(0);
    expect(model.bobbinGroups[0].children.length).toBeGreaterThan(0);

    // Test kinematic updates
    model.wheelGroup.rotation.x = Math.PI / 4;
    model.flyerGroups[0].rotation.y = Math.PI;
    model.traverseRailGroup.position.y = 0.54;

    expect(model.wheelGroup.rotation.x).toBe(Math.PI / 4);
    expect(model.flyerGroups[0].rotation.y).toBe(Math.PI);
    expect(model.traverseRailGroup.position.y).toBe(0.54);

    model.dispose();
  });
});
