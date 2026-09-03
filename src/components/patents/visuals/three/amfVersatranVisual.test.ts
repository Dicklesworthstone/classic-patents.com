import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import {
  AMF_VERSATRAN_CLAIM_PROBE_PARAMS,
  AMF_VERSATRAN_DEFAULT_CONTROLS,
  readAmfVersatranClaimStates,
  stepAmfVersatranTopology,
} from "@/physics/amfVersatranKernel";
import { amfVersatranViewForViewport } from "./amfVersatranCamera";
import { buildAmfVersatranModel } from "./amfVersatranModel";

const ROOT = process.cwd();
const source = (path: string) => readFileSync(join(ROOT, path), "utf8");

describe("US 3,212,649 AMF Versatran procedural visual boundary", () => {
  test("reserves a phone model viewport before reachable normal-flow controls", () => {
    const desktop = amfVersatranViewForViewport("overview", 1200);
    const phone = amfVersatranViewForViewport("overview", 320);
    const distance = (view: typeof desktop) =>
      Math.hypot(
        view.position[0] - view.target[0],
        view.position[1] - view.target[1],
        view.position[2] - view.target[2],
      );
    expect(distance(phone) / distance(desktop)).toBeCloseTo(1.3, 8);
    expect(phone.target).toEqual([0, 0.15, 0]);

    const threeD = source("src/components/patents/visuals/three/AMFVersatran3D.tsx");
    const modelViewport = threeD.indexOf('data-mobile-layout="dedicated-model-viewport"');
    const controls = threeD.indexOf('data-mobile-layout="controls-after-canvas"');
    expect(modelViewport).toBeGreaterThan(0);
    expect(controls).toBeGreaterThan(modelViewport);
    expect(threeD).toContain("pt-[432px]");
    expect(threeD).toContain("lg:pt-[642px]");
    expect(threeD).toContain("lg:h-[630px]");
    expect(threeD).not.toContain("lg:absolute lg:bottom-5");
    expect(threeD).toContain("sm:hidden");
    expect(threeD).not.toContain("mt-[432px]");
    expect(threeD).not.toContain("sm:absolute sm:bottom-5");
    expect(threeD).toContain("scroll-mt-24");
    expect(threeD).toContain("hidden items-start justify-between");
    expect(threeD).toContain("sm:flex");
    expect(threeD).toContain("top-24 hidden rounded-xl");
  });

  test("builds the source-named machine and keeps the two disclosed wrist motions separate", () => {
    const model = buildAmfVersatranModel();
    const column = model.root.getObjectByName("Rotating column B assembly");
    const columnPost = model.root.getObjectByName("Column B vertical post");
    const base = model.root.getObjectByName("Base assembly");
    const carriage = model.root.getObjectByName("Elevating carriage C");
    const arm = model.root.getObjectByName("Horizontal arm A");
    const boom = model.root.getObjectByName("Normalized horizontal arm travel display");
    const wristSwing = model.root.getObjectByName(
      "Wrist assembly G swing about central vertical axis",
    );
    const wristRotation = model.root.getObjectByName(
      "Wrist assembly G rotation about horizontal arm axis",
    );
    const wristHub = model.root.getObjectByName("Wrist G normalized hub");
    const teach = model.root.getObjectByName("Manual programming arm");
    const teachPivot = model.root.getObjectByName("Manual programming pivot anchored to column B");
    const signalDisplay = model.root.getObjectByName(
      "Recorded-signal and feedback comparison display",
    );
    const signalCabinet = model.root.getObjectByName(
      "Recorded-signal cabinet supported on museum floor",
    );
    const upperJawPivot = model.root.getObjectByName("Upper gripping-finger pivot");
    const finger = model.root.getObjectByName("Gripping finger 324");
    const upperPinion = model.root.getObjectByName("Gear 334 / Claim 12 engaging pinion");
    const lowerPinion = model.root.getObjectByName("Gear 346 / Claim 12 engaging pinion");
    const upperRack = model.root.getObjectByName("Claim 13 upper linearly movable rack");
    const lowerRack = model.root.getObjectByName("Claim 13 lower linearly movable rack");
    const pinionGripper = model.root.getObjectByName(
      "Claim 12 engaging pinions and Claim 13 rack topology",
    );
    const genericTool = model.root.getObjectByName(
      "Generic work tool when Claim 12 topology is withheld",
    );

    expect(model.root.name).toContain("US 3,212,649");
    expect(column).toBeDefined();
    expect(columnPost).toBeDefined();
    expect(base).toBeDefined();
    expect(carriage).toBeDefined();
    expect(arm).toBeDefined();
    expect(boom).toBeDefined();
    expect(wristSwing).toBeDefined();
    expect(wristRotation).toBeDefined();
    expect(wristHub).toBeDefined();
    expect(teach).toBeDefined();
    expect(teachPivot).toBeDefined();
    expect(teachPivot?.parent).toBe(column);
    expect(signalDisplay).toBeDefined();
    expect(signalCabinet).toBeDefined();
    expect(upperJawPivot).toBeDefined();
    expect(finger).toBeDefined();
    expect(upperPinion).toBeDefined();
    expect(lowerPinion).toBeDefined();
    expect(upperRack).toBeDefined();
    expect(lowerRack).toBeDefined();
    expect(pinionGripper).toBeDefined();
    expect(genericTool).toBeDefined();

    const openState = stepAmfVersatranTopology({
      ...AMF_VERSATRAN_DEFAULT_CONTROLS,
      columnRotation: 0.55,
      carriageLift: 0.8,
      armTravel: 0.7,
      wristRotation: -0.35,
      wristSwing: 0.3,
      gripperOperation: 0.1,
    });
    model.updateState(openState);
    model.root.updateMatrixWorld(true);
    // The programming linkage must originate inside the rotating column's
    // r=0.24 envelope instead of terminating in open air beside it.
    expect(teachPivot?.position.x).toBeCloseTo(-0.2, 12);
    expect(Math.hypot(teachPivot?.position.x ?? 1, teachPivot?.position.z ?? 1)).toBeLessThan(0.24);
    const openPivotZ = upperJawPivot?.rotation.z ?? 0;
    const openRackX = upperRack?.position.x ?? 0;
    expect(column?.rotation.y).toBeCloseTo(openState.displayPose.columnRotationDisplayRad, 12);
    expect(wristRotation?.rotation.x).toBeCloseTo(
      openState.displayPose.wristRotationDisplayRad,
      12,
    );
    expect(wristSwing?.rotation.y).toBeCloseTo(openState.displayPose.wristSwingDisplayRad, 12);

    for (const [supported, support, relationship] of [
      [columnPost, base, "column B must meet the base"],
      [carriage, columnPost, "carriage C must stay on column B"],
      [boom, carriage, "arm A must pass through carriage C"],
      [wristHub, boom, "wrist G must meet arm A"],
    ] as const) {
      if (!supported || !support) throw new Error(`Missing object: ${relationship}`);
      expect(
        new THREE.Box3()
          .setFromObject(supported)
          .intersectsBox(new THREE.Box3().setFromObject(support)),
        relationship,
      ).toBe(true);
    }
    if (!base || !signalCabinet) throw new Error("AMF support geometry is missing.");
    expect(new THREE.Box3().setFromObject(base).min.y).toBeCloseTo(-1.01, 6);
    expect(new THREE.Box3().setFromObject(signalCabinet).min.y).toBeCloseTo(-1.01, 6);

    const closedState = stepAmfVersatranTopology({
      ...AMF_VERSATRAN_DEFAULT_CONTROLS,
      teachReplayMode: 1,
      resolverPhaseOffset: 0.2,
      gripperOperation: 1,
    });
    model.updateState(closedState);
    expect(upperJawPivot?.rotation.z ?? 0).toBeLessThan(openPivotZ);
    expect(lowerPinion?.rotation.z ?? 0).toBeCloseTo(-(upperPinion?.rotation.z ?? 0), 12);
    expect(upperRack?.position.x ?? 0).not.toBe(openRackX);
    expect((upperRack?.position.x ?? 0) - (lowerRack?.position.x ?? 0)).not.toBe(0);
    expect(signalDisplay?.visible).toBe(true);

    const withoutClaim8 = stepAmfVersatranTopology({
      ...AMF_VERSATRAN_DEFAULT_CONTROLS,
      teachReplayMode: 1,
      claim8RecordPlaybackEnabled: 0,
    });
    model.updateState(withoutClaim8);
    expect(withoutClaim8.comparisonChannels).toEqual([]);
    expect(withoutClaim8.trackingState).toBe("record-playback-path-withheld");
    expect(signalDisplay?.visible).toBe(false);

    const withoutClaim12 = stepAmfVersatranTopology({
      ...AMF_VERSATRAN_DEFAULT_CONTROLS,
      claim12PinionGripperEnabled: 0,
    });
    model.updateState(withoutClaim12);
    expect(withoutClaim12.displayPose.pinionGripperTopologyEnabled).toBe(false);
    expect(pinionGripper?.visible).toBe(false);
    expect(genericTool?.visible).toBe(true);

    const withoutClaim1 = stepAmfVersatranTopology({
      ...AMF_VERSATRAN_DEFAULT_CONTROLS,
      teachReplayMode: 1,
      claim1TopologyEnabled: 0,
    });
    model.updateState(withoutClaim1);
    expect(withoutClaim1.disclosedMotions).toEqual([]);
    expect(withoutClaim1.trackingState).toBe("claim-1-topology-withheld");
    expect(model.root.visible).toBe(false);
    model.dispose();
  });

  test("uses shared claim-probe controls rather than a private visual state", () => {
    expect(AMF_VERSATRAN_CLAIM_PROBE_PARAMS).toEqual({
      1: "claim1TopologyEnabled",
      8: "claim8RecordPlaybackEnabled",
      12: "claim12PinionGripperEnabled",
    });
    expect(readAmfVersatranClaimStates({})).toEqual({ 1: true, 8: true, 12: true });
    expect(
      readAmfVersatranClaimStates({
        claim1TopologyEnabled: 0,
        claim8RecordPlaybackEnabled: 0,
        claim12PinionGripperEnabled: 0,
      }),
    ).toEqual({ 1: false, 8: false, 12: false });

    const twoD = source("src/components/patents/visuals/AMFVersatranSim.tsx");
    const threeD = source("src/components/patents/visuals/three/AMFVersatran3D.tsx");
    const schematic = source("src/components/patents/InteractiveDiagramViewer.tsx");
    for (const face of [twoD, threeD]) {
      expect(face).toContain("readAmfVersatranClaimStates(params)");
      expect(face).toContain("AMF_VERSATRAN_CLAIM_PROBE_PARAMS");
      expect(face).not.toContain("useState<Record<number, boolean>>");
    }
    expect(schematic).toContain(
      'data-amf-versatran-claim-1={state.claimProbeStates[1] ? "live" : "withheld"}',
    );
    expect(schematic).toContain(
      'data-amf-versatran-claim-8={state.claimProbeStates[8] ? "live" : "withheld"}',
    );
    expect(schematic).toContain(
      'data-amf-versatran-claim-12={state.claimProbeStates[12] ? "live" : "withheld"}',
    );
  });

  test("keeps both visual faces on the shared topology bus and records the typed refusal", () => {
    const kernel = source("src/physics/amfVersatranKernel.ts");
    const twoD = source("src/components/patents/visuals/AMFVersatranSim.tsx");
    const threeD = source("src/components/patents/visuals/three/AMFVersatran3D.tsx");
    const model = source("src/components/patents/visuals/three/amfVersatranModel.ts");

    expect(twoD).toContain("usePatentPhysics");
    expect(twoD).toContain("ClaimConstraintToggle");
    expect(twoD).toContain("applyClaimConstraintModifications");
    expect(twoD).toContain("Claim 12 paired pinions and Claim 13 racks");
    expect(threeD).toContain("usePatentPhysics");
    expect(threeD).toContain("ClaimConstraintToggle");
    expect(threeD).toContain("applyClaimConstraintModifications");
    expect(threeD).toContain("useFrankenSimPhysics");
    expect(threeD).toContain("createThreeStudioScene");
    expect(threeD).toContain("createStudioClock");
    expect(threeD).toContain('data-amf-versatran-webgl-fallback="true"');
    expect(threeD).toContain('data-amf-versatran-claim-1-withheld="true"');
    expect(threeD).toContain("CLAIM 1 TOPOLOGY WITHHELD");
    expect(threeD).toContain("This browser cannot create WebGL.");
    expect(model).toContain("display proportions only");
    expect(model).not.toContain("Math.random");
    expect(model).not.toContain("GLTFLoader");
    expect(model).not.toContain(".gltf");
    expect(model).not.toContain(".glb");
    expect(model).not.toContain("Fig. 51");
    expect(model).toContain("Claim 12 engaging pinions and Claim 13 rack topology");
    expect(model).toContain("signalDisplay.visible = state.claimProbeStates[8]");
    expect(kernel).toContain("refuses SI position, velocity, force");

    for (const legacyName of ["wrist" + "Roll", "wrist" + "Pitch", "wrist" + "Yaw"]) {
      expect(kernel).not.toContain(legacyName);
      expect(twoD).not.toContain(legacyName);
      expect(threeD).not.toContain(legacyName);
      expect(model).not.toContain(legacyName);
    }

    for (const unsupportedSiControl of [
      "hydraulic" + "PressureMpa",
      "vertical" + "ElevationMm",
      "horizontal" + "ReachMm",
    ]) {
      expect(kernel).not.toContain(unsupportedSiControl);
      expect(twoD).not.toContain(unsupportedSiControl);
      expect(threeD).not.toContain(unsupportedSiControl);
      expect(model).not.toContain(unsupportedSiControl);
    }
  });
});
