import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  ARKWRIGHT_DEFAULT_CONTROLS,
  ARKWRIGHT_SOURCE_BOUNDARY,
  stepArkwrightWaterFrame,
} from "@/physics/arkwrightKernel";
import { ENERGY_CHANNEL_OMISSION_REASONS, energyChannelsFor } from "@/physics/energyChannels";
import { buildArkwrightWaterFrameModel } from "./arkwrightWaterFrameModel";

describe("GB 931 Richard Arkwright Water Frame Visual & Drafting Boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const model = buildArkwrightWaterFrameModel();
    expect(model.root).toBeDefined();
    expect(model.wheelGroup).toBeDefined();
    expect(model.feedRollersGroup).toBeDefined();
    expect(model.deliveryRollersGroup).toBeDefined();
    expect(model.feedLowerRollers).toHaveLength(4);
    expect(model.feedUpperRollers).toHaveLength(4);
    expect(model.intermediateOneLowerRollers).toHaveLength(4);
    expect(model.intermediateOneUpperRollers).toHaveLength(4);
    expect(model.intermediateTwoLowerRollers).toHaveLength(4);
    expect(model.intermediateTwoUpperRollers).toHaveLength(4);
    expect(model.deliveryLowerRollers).toHaveLength(4);
    expect(model.deliveryUpperRollers).toHaveLength(4);
    expect(model.rollerDriveRotors).toHaveLength(4);
    expect(model.spindleDriveRotors).toHaveLength(4);
    expect(model.spindleWhorlRotors).toHaveLength(4);
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

  test("exposes source-bounded camera presets and cutaway mode for textile machinery inspection", () => {
    const studioSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/ArkwrightWaterFrame3D.tsx"),
      "utf-8",
    );
    expect(studioSource).toContain("useLiveSimParams");
    expect(studioSource).toContain("controls.setView");
    expect(studioSource).toContain("getArkwrightTapeFrame()?.phases");
    expect(studioSource).toContain("model.updateAnimation");
    expect(studioSource).not.toContain("globalTransportBus.registerUpdater");
    expect(studioSource).not.toContain("phasesRef");
    expect(studioSource).not.toContain("[cameraPreset");
    expect(studioSource).not.toContain("liveParams = useRef");
    expect(studioSource).not.toContain("0.75) / 4.0");

    const model = buildArkwrightWaterFrameModel();
    model.setCalloutsVisible(true);
    expect(model.calloutGroup.visible).toBe(true);
    model.setCalloutsVisible(false);
    expect(model.calloutGroup.visible).toBe(false);
    model.dispose();
  });

  test("2D wheel/draft/weight/staple sliders write the shared physics bus", () => {
    const simSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/ArkwrightWaterFrameSim.tsx"),
      "utf-8",
    );
    expect(simSource).toContain("usePatentPhysics(EXHIBIT_ID)");
    expect(simSource).toContain('"gb-931-arkwright-water-frame"');
    expect(simSource).toContain('updateParam("waterWheelRpm"');
    expect(simSource).toContain('updateParam("totalDraftRatio"');
    expect(simSource).toContain('updateParam("rollerClampingWeightKg"');
    expect(simSource).toContain('updateParam("stapleLengthMm"');
    expect(simSource).not.toContain("setControls");
    expect(simSource).toContain("phases.feedRollerRad");
    expect(simSource).not.toContain("0.75) / 4.0");
  });

  test("computes a deterministic declared differential-draft and flyer-twist scenario", () => {
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

    model.updateAnimation({
      wheelRad: 0.25,
      shaftRad: 0.5,
      feedRollerRad: 0.75,
      intermediateRollerOneRad: 0.833,
      intermediateRollerTwoRad: 0.916,
      deliveryRollerRad: 1,
      spindleLayshaftRad: -4.625,
      spindleRad: 1.25,
      bobbinRad: 1.5,
      traverseRad: Math.PI / 2,
    });

    expect(model.wheelGroup.rotation.z).toBe(0.25);
    expect(model.wheelGroup.rotation.x).toBe(0);
    expect(model.shaftGroup.rotation.x).toBe(0.5);
    expect(model.shaftGroup.rotation.z).toBe(0);
    expect(model.feedRollersGroup.rotation.x).toBe(0);
    expect(model.intermediateRollerOneGroup.rotation.x).toBe(0);
    expect(model.intermediateRollerTwoGroup.rotation.x).toBe(0);
    expect(model.deliveryRollersGroup.rotation.x).toBe(0);
    expect(model.feedLowerRollers.every((roller) => roller.rotation.x === 0.75)).toBe(true);
    expect(model.feedUpperRollers.every((roller) => roller.rotation.x === -0.75)).toBe(true);
    expect(model.intermediateOneLowerRollers.every((roller) => roller.rotation.x === 0.833)).toBe(
      true,
    );
    expect(model.intermediateOneUpperRollers.every((roller) => roller.rotation.x === -0.833)).toBe(
      true,
    );
    expect(model.intermediateTwoLowerRollers.every((roller) => roller.rotation.x === 0.916)).toBe(
      true,
    );
    expect(model.intermediateTwoUpperRollers.every((roller) => roller.rotation.x === -0.916)).toBe(
      true,
    );
    expect(model.deliveryLowerRollers.every((roller) => roller.rotation.x === 1)).toBe(true);
    expect(model.deliveryUpperRollers.every((roller) => roller.rotation.x === -1)).toBe(true);
    expect(model.wheelBevelRotor.rotation.z).toBe(0.25);
    expect(model.shaftBevelRotor.rotation.x).toBe(0.5);
    expect(model.rollerDriveRotors.map((rotor) => rotor.rotation.x)).toEqual([
      0.75, 0.833, 0.916, 1,
    ]);
    expect(model.spindleDriveRotors.every((rotor) => rotor.rotation.y === -4.625)).toBe(true);
    expect(model.spindleWhorlRotors.every((rotor) => rotor.rotation.y === 1.25)).toBe(true);
    expect(model.flyerGroups[0].rotation.y).toBe(1.25);
    expect(model.bobbinGroups[0].rotation.y).toBe(1.5);
    expect(model.traverseRailGroup.position.y).toBeCloseTo(0.56, 12);
    expect(model.root.getObjectByName("normalized-right-angle-drive-A-to-B")).toBeDefined();
    expect(
      model.root.children.filter((child) => child.name.startsWith("continuous-roving-path-")),
    ).toHaveLength(4);
    const transmissionHousing = model.root.getObjectByName(
      "normalized-drafting-transmission-housing",
    );
    expect(transmissionHousing).toBeDefined();
    model.setCutaway(true);
    expect(transmissionHousing?.visible).toBe(false);
    model.setCutaway(false);
    expect(transmissionHousing?.visible).toBe(true);
    expect(model.root.getObjectByName("feed-rollers-C1-continuous-lower-axle")).toBeDefined();
    expect(model.root.getObjectByName("delivery-rollers-C4-continuous-lower-axle")).toBeDefined();

    model.dispose();
  });

  test("shares one route-level tape across both faces and refuses unsupported power telemetry", () => {
    const dispatcherSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/index.tsx"),
      "utf8",
    );
    const ownerSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/PatentPhysicsRuntimeOwner.tsx"),
      "utf8",
    );
    const simSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/ArkwrightWaterFrameSim.tsx"),
      "utf8",
    );

    expect(dispatcherSource).toContain("<ArkwrightPhysicsRuntimeOwner patentId={patentId} />");
    expect(ownerSource).toContain("createArkwrightTransportUpdater");
    expect(simSource).toContain("getArkwrightTapeFrame()");
    expect(simSource).not.toContain("requestAnimationFrame");
    expect(simSource).not.toContain("performance.now");
    expect(simSource).toContain('aria-label={isRunning ? "Pause Motion" : "Resume Motion"}');
    expect(simSource).toContain("SCALED SCENARIO OUTPUT");
    expect(simSource).not.toContain("CROMFORD MILL CAPACITY");
    expect(energyChannelsFor("gb-931-arkwright-water-frame", {})).toEqual([]);
    expect(ENERGY_CHANNEL_OMISSION_REASONS["gb-931-arkwright-water-frame"]).toContain(
      "no authenticated water head",
    );
    expect(ARKWRIGHT_SOURCE_BOUNDARY).toContain("modern reconstruction");
  });
});
