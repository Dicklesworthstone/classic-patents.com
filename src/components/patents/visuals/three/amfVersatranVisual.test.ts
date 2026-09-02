import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  AMF_VERSATRAN_DEFAULT_CONTROLS,
  stepAmfVersatranTopology,
} from "@/physics/amfVersatranKernel";
import { buildAmfVersatranModel } from "./amfVersatranModel";

const ROOT = process.cwd();
const source = (path: string) => readFileSync(join(ROOT, path), "utf8");

describe("US 3,212,649 AMF Versatran procedural visual boundary", () => {
  test("builds the source-named machine and keeps the two disclosed wrist motions separate", () => {
    const model = buildAmfVersatranModel();
    const column = model.root.getObjectByName("Rotating column B assembly");
    const carriage = model.root.getObjectByName("Elevating carriage C");
    const arm = model.root.getObjectByName("Horizontal arm A");
    const wristSwing = model.root.getObjectByName(
      "Wrist assembly G swing about central vertical axis",
    );
    const wristRotation = model.root.getObjectByName(
      "Wrist assembly G rotation about horizontal arm axis",
    );
    const teach = model.root.getObjectByName("Manual programming arm");
    const signalDisplay = model.root.getObjectByName(
      "Recorded-signal and feedback comparison display",
    );
    const finger = model.root.getObjectByName("Gripping finger 1");

    expect(model.root.name).toContain("US 3,212,649");
    expect(column).toBeDefined();
    expect(carriage).toBeDefined();
    expect(arm).toBeDefined();
    expect(wristSwing).toBeDefined();
    expect(wristRotation).toBeDefined();
    expect(teach).toBeDefined();
    expect(signalDisplay).toBeDefined();
    expect(finger).toBeDefined();

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
    const openFingerY = finger?.position.y ?? 0;
    expect(column?.rotation.y).toBeCloseTo(openState.displayPose.columnRotationDisplayRad, 12);
    expect(wristRotation?.rotation.x).toBeCloseTo(
      openState.displayPose.wristRotationDisplayRad,
      12,
    );
    expect(wristSwing?.rotation.y).toBeCloseTo(openState.displayPose.wristSwingDisplayRad, 12);

    const closedState = stepAmfVersatranTopology({
      ...AMF_VERSATRAN_DEFAULT_CONTROLS,
      teachReplayMode: 1,
      resolverPhaseOffset: 0.2,
      gripperOperation: 1,
    });
    model.updateState(closedState);
    expect(finger?.position.y ?? 0).toBeLessThan(openFingerY);
    expect(signalDisplay?.visible).toBe(true);
    model.dispose();
  });

  test("keeps both visual faces on the shared topology bus and records the typed refusal", () => {
    const kernel = source("src/physics/amfVersatranKernel.ts");
    const twoD = source("src/components/patents/visuals/AMFVersatranSim.tsx");
    const threeD = source("src/components/patents/visuals/three/AMFVersatran3D.tsx");
    const model = source("src/components/patents/visuals/three/amfVersatranModel.ts");

    expect(twoD).toContain("usePatentPhysics");
    expect(threeD).toContain("usePatentPhysics");
    expect(threeD).toContain("useFrankenSimPhysics");
    expect(threeD).toContain("createThreeStudioScene");
    expect(threeD).toContain("createStudioClock");
    expect(model).toContain("display proportions only");
    expect(model).not.toContain("Math.random");
    expect(model).not.toContain("GLTFLoader");
    expect(model).not.toContain(".gltf");
    expect(model).not.toContain(".glb");
    expect(model).not.toContain("Fig. 51");
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
