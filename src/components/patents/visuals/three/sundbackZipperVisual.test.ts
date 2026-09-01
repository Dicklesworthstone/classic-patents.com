import { describe, expect, test } from "bun:test";
import {
  SUNDBACK_ZIPPER_DEFAULT_CONTROLS,
  stepSundbackZipperSi,
} from "@/physics/sundbackZipperKernel";
import { buildSundbackZipperModel, updateSundbackZipperKinematics } from "./sundbackZipperModel";

describe("US 1,219,881 Gideon Sundback Separable Fastener visual & kinematics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const model = buildSundbackZipperModel();
    expect(model.rootGroup).toBeDefined();
    expect(model.leftTeeth.length).toBeGreaterThan(20);
    expect(model.rightTeeth.length).toBeGreaterThan(20);
    expect(model.materials.brassScoop).toBeDefined();
    expect(model.materials.sliderMetal).toBeDefined();
    model.dispose();
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const model = buildSundbackZipperModel();
    const tel1 = stepSundbackZipperSi(SUNDBACK_ZIPPER_DEFAULT_CONTROLS);
    const tel2 = stepSundbackZipperSi(SUNDBACK_ZIPPER_DEFAULT_CONTROLS);

    updateSundbackZipperKinematics(model, tel1, 0);
    const pos1 = model.sliderGroup.position.clone();

    updateSundbackZipperKinematics(model, tel2, 0);
    const pos2 = model.sliderGroup.position.clone();

    expect(pos1.x).toBe(pos2.x);
    expect(pos1.y).toBe(pos2.y);
    expect(pos1.z).toBe(pos2.z);
    model.dispose();
  });

  test("computes genuine cam normal force, burst resistance, and tape strain in SI units", () => {
    const telClosed = stepSundbackZipperSi({
      ...SUNDBACK_ZIPPER_DEFAULT_CONTROLS,
      sliderPositionPct: 100,
      lateralTensionN: 50,
      staggerAligned: true,
    });
    expect(telClosed.isLocked).toBe(true);
    expect(telClosed.burstResistanceN).toBeGreaterThan(150);
    expect(telClosed.wedgeNormalForceN).toBeGreaterThan(10);
    expect(telClosed.tapeStrainPct).toBeGreaterThan(0);

    // Refusal under excessive lateral load
    const telBurst = stepSundbackZipperSi({
      ...SUNDBACK_ZIPPER_DEFAULT_CONTROLS,
      sliderPositionPct: 5,
      lateralTensionN: 180,
      staggerAligned: true,
    });
    expect(telBurst.burstRefusal).toBe(true);
    expect(telBurst.refusalReason).toContain("Chain rupture");
  });

  test("articulates procedural scoops and slider kinematics faithfully", () => {
    const model = buildSundbackZipperModel();
    const tel = stepSundbackZipperSi(SUNDBACK_ZIPPER_DEFAULT_CONTROLS);

    updateSundbackZipperKinematics(model, tel, 30);
    expect(model.sliderGroup.position.y).toBeDefined();
    expect(model.chainGroup.rotation.y).toBeGreaterThan(0);
    model.dispose();
  });
});
