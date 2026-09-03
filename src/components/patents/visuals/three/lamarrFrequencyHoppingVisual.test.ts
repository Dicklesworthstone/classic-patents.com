import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { stepLamarrRecordControl } from "@/physics/catalogKernels";
import {
  FrankenSimEngine,
  lamarrChannelFrequencyMhz,
  lamarrDefaultJamChannel,
  lamarrPianoKeyHz,
  lamarrPianoRollChannel,
  lamarrRadioChannel,
  lamarrSchematicHop,
  lamarrSchematicStaffY,
} from "@/physics/engine";
import {
  createLamarrTransportUpdater,
  readLamarrRuntimeControls,
  resetLamarrTape,
} from "@/physics/lamarrSharedKernel";
import { lamarrViewForViewport } from "./LamarrFrequencyHopping3D";
import {
  buildLamarrFrequencyHoppingModel,
  updateLamarrFrequencyHoppingKinematics,
} from "./lamarrFrequencyHoppingModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals");

describe("US 2,292,387 Hedy Lamarr & George Antheil Secret Communication System visual & spread spectrum boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "lamarrFrequencyHoppingModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "LamarrFrequencyHopping3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("useGLTF");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(modelSource).toContain("buildLamarrFrequencyHoppingModel");
    expect(modelSource).toContain("updateLamarrFrequencyHoppingKinematics");
    expect(threeSource).not.toContain("useGLTF");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "lamarrFrequencyHoppingModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "LamarrFrequencyHopping3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("performance.now()");
  });

  test("exposes authentic camera presets and UI overlay for frequency hopping observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "LamarrFrequencyHopping3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "roll", "waterfall", "escapement", "torpedo", "top"]) {
      expect(threeSource).toContain(preset);
    }
    expect(threeSource).toContain("isCutaway");

    const desktop = lamarrViewForViewport("iso", 1200);
    const tablet = lamarrViewForViewport("iso", 768);
    const phone = lamarrViewForViewport("iso", 320);
    const distance = (view: typeof desktop) => Math.hypot(...view.pos);
    expect(distance(tablet) / distance(desktop)).toBeCloseTo(1.15, 8);
    expect(distance(phone) / distance(desktop)).toBeCloseTo(1.55, 8);
  });

  test("keeps telemetry bounded to the illustrated seven-row record system", () => {
    const result = FrankenSimEngine.stepLamarrFrequencyHopping(7, 0);
    expect(result.channelsCount).toBe(7);
    expect(result.processingGainDb).toBe(0);
    expect(result.antiJammingMarginDb).toBe(0);
    expect(result.spreadSpectrumBandwidthMhz).toBe(0);
    expect(result.spreadSpectrumBandwidthHz).toBe(0);
    expect(result.pianoKeys).toBe(7);
    expect(result.pianoRollStep).toBe(1);
    expect(result.hopSoundStride).toBe(1);
    expect(result.drumDisplayOmegaRadPerS).toBe(0);
    expect(result.spectrumBarOriginX).toBe(20);
    expect(result.spectrumBarPitchPx).toBe(4.5);
    expect(result.schematicStaffCount).toBe(11);
    expect(result.schematicHopW).toBe(22);
    expect(result.schematicBoxW).toBe(300);
    expect(result.schematicHopSequence).toEqual([0, 3, 1, 7, 4, 9, 2, 6]);
    expect(lamarrSchematicStaffY(0)).toBe(75);
    expect(lamarrSchematicStaffY(1)).toBe(88);
    expect(lamarrSchematicHop(0, 0).x).toBe(80);
    expect(lamarrSchematicHop(1, 3).y).toBe(114);
    expect(lamarrPianoRollChannel(0)).toBe(1);
    expect(lamarrChannelFrequencyMhz(1)).toBe(1);
    expect(lamarrChannelFrequencyMhz(7)).toBe(7);
    expect(lamarrDefaultJamChannel(7)).toBe(1);
    expect(lamarrRadioChannel(1, 7)).toBe(1);
    expect(lamarrPianoKeyHz(7)).toBe(0);

    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "LamarrFrequencyHopping3D.tsx"),
      "utf8",
    );
    expect(threeSource).toContain("recordPosition");
    expect(threeSource).toContain("readLamarrTapeFrame");
    expect(threeSource).not.toContain("useState(() =>");
    expect(threeSource).not.toContain("Date.now()");
    expect(threeSource).not.toContain("0.016");
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "lamarrFrequencyHoppingModel.ts"),
      "utf8",
    );
    expect(modelSource).not.toContain("delta * 1.5");

    const schematicSource = readFileSync(
      join(process.cwd(), "src", "components", "patents", "InteractiveDiagramViewer.tsx"),
      "utf8",
    );
    expect(schematicSource).toContain("lamarrSchematicStaffY");
    expect(schematicSource).toContain("lamarrSchematicHop");
    expect(schematicSource).not.toContain("75 + i * 13");
    expect(schematicSource).not.toContain("80 + i * 30");
  });

  test("owns A–G matching and accepted commands in one source-bounded deterministic kernel", () => {
    const falseRow = stepLamarrRecordControl({
      recordPosition: 2,
      commandTone: 100,
      issueCommand: true,
    });
    const matchedRow = stepLamarrRecordControl({
      recordPosition: 3,
      commandTone: 500,
      issueCommand: true,
    });
    expect(falseRow).toMatchObject({
      transmitterRow: "C",
      receiverRow: null,
      receiverEffective: false,
      warningLampOn: true,
      commandAccepted: false,
    });
    expect(matchedRow).toMatchObject({
      transmitterRow: "D",
      receiverRow: "D",
      receiverEffective: true,
      warningLampOn: false,
      commandAccepted: true,
      rudderStep: 1,
    });
    expect(matchedRow.recordIndexAngleRad).toBeCloseTo((3 * Math.PI * 2) / 7, 10);

    resetLamarrTape();
    const updater = createLamarrTransportUpdater(() =>
      readLamarrRuntimeControls({ recordPosition: 3, commandTone: 500 }),
    );
    const firstTapeUpdate = updater({} as never, 1 / 60);
    expect(firstTapeUpdate?.machine?.poseXMeters).toBe(3);
    expect(firstTapeUpdate?.machine?.modeLabel).toBe("matched row D");
    expect(updater({} as never, 1 / 60)).toBeNull();
    resetLamarrTape();
  });

  test("builds two supported record trains and indexes both from the shared record state", () => {
    const model = buildLamarrFrequencyHoppingModel();
    expect(model.root.children.length).toBeGreaterThan(0);
    expect(model.apparatusGroup).toBeDefined();
    expect(model.drum1).toBeDefined();
    expect(model.drum2).toBeDefined();
    expect(model.paperWeb).toBeDefined();
    expect(model.comb).toBeDefined();
    expect(model.receiverDrum1).toBeDefined();
    expect(model.receiverDrum2).toBeDefined();
    expect(model.receiverPaperWeb).toBeDefined();
    expect(model.receiverComb).toBeDefined();
    expect(model.root.getObjectByName("receiver_record_train_37_prime")).toBeDefined();
    const timingOverlay = model.root.getObjectByName("matched_record_timing_link") as THREE.Line;
    expect(timingOverlay).toBeDefined();
    expect(timingOverlay.material).toBeInstanceOf(THREE.LineDashedMaterial);
    expect(timingOverlay.userData.pedagogicalOverlay).toContain("not a physical conductor");
    expect(model.root.getObjectsByProperty("name", "receiver_drum_bearing_collar")).toHaveLength(4);
    for (const row of "ABCDEFG") {
      expect(model.root.getObjectByName(`transmitter_record_contact_${row}`)).toBeDefined();
    }
    for (const row of "DEFG") {
      expect(model.root.getObjectByName(`receiver_record_contact_${row}`)).toBeDefined();
    }
    expect(model.bulkheadRings).toHaveLength(2);
    expect(model.sidePlates).toHaveLength(2);
    expect(model.frontDrumFlanges).toHaveLength(2);
    expect(model.spectrumBarsGroup).toBeDefined();
    expect(model.barMeshes.length).toBe(7);
    expect(model.hopPoints).toBeDefined();

    // Test kinematics update & cutaway
    updateLamarrFrequencyHoppingKinematics(model, 3, true, false, true);
    expect(model.barMeshes[3].scale.y).toBeGreaterThan(1.0);
    expect(model.drum1.rotation.y).toBeCloseTo((-3 * Math.PI * 2) / 7, 5);
    expect(model.drum2.rotation.y).toBeCloseTo(model.drum1.rotation.y, 10);
    expect(model.receiverDrum1.rotation.y).toBeCloseTo(model.drum1.rotation.y, 10);
    expect(model.receiverDrum2.rotation.y).toBeCloseTo(model.drum2.rotation.y, 10);
    expect(model.materials.torpedoBayMat.opacity).toBe(0.16);
    expect(model.bulkheadRings.every((ring) => !ring.visible)).toBe(true);
    expect(model.sidePlates.map((plate) => plate.visible)).toEqual([true, false]);
    expect(model.frontDrumFlanges.every((flange) => !flange.visible)).toBe(true);

    model.dispose();
  });
});
