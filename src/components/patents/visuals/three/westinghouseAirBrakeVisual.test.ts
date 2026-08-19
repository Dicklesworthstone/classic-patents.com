import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FrankenSimEngine } from "@/physics/engine";
import {
  buildWestinghouseAirBrakeModel,
  updateWestinghouseAirBrakeKinematics,
} from "./westinghouseAirBrakeModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 124,404 George Westinghouse Double-Pipe Air Brake & Signal Visual Boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "WestinghouseAirBrake3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "westinghouseAirBrakeModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildWestinghouseAirBrakeModel");
    expect(modelSource).toContain("updateWestinghouseAirBrakeKinematics");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "WestinghouseAirBrake3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "westinghouseAirBrakeModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets for US 124,404 double-pipe inspection", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "WestinghouseAirBrake3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "selecting_cock",
      "trip_apparatus",
      "brake_cylinder",
      "reservoir",
      "signaling_gauge",
    ]) {
      expect(threeSource).toContain(preset);
    }
  });

  test("computes double-pipe pneumatics, selecting cock d¹, and automatic cock e trip dynamics", () => {
    // Normal released state
    const released = FrankenSimEngine.stepWestinghouseAirBrake({
      trainPipePressurePsi: 0,
      reservoirPipePressurePsi: 90,
      selectingCockState: "normal",
      tripCockState: "running",
    });
    expect(released.valveState).toBe("RELEASE");
    expect(released.shoeClampingForceKn).toBe(0);
    expect(released.isSelectingCockReversed).toBe(false);
    expect(released.cockD1AngleDeg).toBe(0);
    expect(released.cockEAngleDeg).toBe(0);
    expect(released.receiverPressurePsi).toBe(90);

    // Reversed selecting cock d1 (Position 2: 90° rotation)
    const reversed = FrankenSimEngine.stepWestinghouseAirBrake({
      trainPipePressurePsi: 40,
      reservoirPipePressurePsi: 90,
      selectingCockState: "reversed",
      tripCockState: "running",
    });
    expect(reversed.isSelectingCockReversed).toBe(true);
    expect(reversed.cockD1AngleDeg).toBe(90);
    expect(reversed.operatingPipePressurePsi).toBe(90);
    expect(reversed.reservoirPipePressurePsi).toBe(40);

    // Automatic Derailment Trip (Stem i¹ hits track)
    const derailment = FrankenSimEngine.stepWestinghouseAirBrake({
      trainPipePressurePsi: 0,
      reservoirPipePressurePsi: 90,
      tripCockState: "tripped_derailment",
    });
    expect(derailment.valveState).toBe("EMERGENCY");
    expect(derailment.isDerailmentTripped).toBe(true);
    expect(derailment.cockEAngleDeg).toBe(90);
    expect(derailment.brakeCylinderPressurePsi).toBeGreaterThan(60);
    expect(derailment.shoeClampingForceKn).toBeGreaterThan(20);

    // Coded Signalling Index Steps (1 to 5)
    const signalStep1 = FrankenSimEngine.stepWestinghouseAirBrake({ signalPulsePressurePsi: 0 });
    expect(signalStep1.signalIndexStep).toBe(1);
    expect(signalStep1.signalMessage).toContain("Normal Running");
    expect(signalStep1.alarmWhistleActive).toBe(false);

    const signalStep4 = FrankenSimEngine.stepWestinghouseAirBrake({ signalPulsePressurePsi: 1.6 });
    expect(signalStep4.signalIndexStep).toBe(4);
    expect(signalStep4.signalMessage).toContain("Danger — Run Slow");
    expect(signalStep4.alarmWhistleActive).toBe(true);
  });

  test("builds and articulates procedural US 124,404 model nodes correctly", () => {
    const model = buildWestinghouseAirBrakeModel();
    const { root, nodes, materials } = model;

    expect(root.children.length).toBeGreaterThan(5);
    expect(nodes.wheelSets.length).toBe(2);
    expect(nodes.brakeShoes.length).toBe(4);
    expect(nodes.pipeB).toBeDefined();
    expect(nodes.pipeB1).toBeDefined();
    expect(nodes.selectingCockCaseD).toBeDefined();
    expect(nodes.selectingCockD1).toBeDefined();
    expect(nodes.auxiliaryReceiverD).toBeDefined();
    expect(nodes.trippingCockE).toBeDefined();
    expect(nodes.derailmentStemI1).toBeDefined();
    expect(nodes.signalGaugeG2).toBeDefined();
    expect(nodes.alarmWhistleH).toBeDefined();

    // Initial released pose
    updateWestinghouseAirBrakeKinematics(
      model,
      {
        trainPipePressurePsi: 0,
        reservoirPipePressurePsi: 90,
        selectingCockState: "normal",
        tripCockState: "running",
        signalPulsePressurePsi: 0,
      },
      1 / 60,
    );

    const releasedBeamX = nodes.frontBrakeBeam.position.x;
    const releasedCockD1Angle = nodes.selectingCockD1.rotation.y;
    const releasedCockEAngle = nodes.trippingCockE.rotation.y;
    expect(releasedCockD1Angle).toBe(0);
    expect(releasedCockEAngle).toBe(0);

    // Emergency Tripped & Swapped Pose
    updateWestinghouseAirBrakeKinematics(
      model,
      {
        trainPipePressurePsi: 0,
        reservoirPipePressurePsi: 90,
        selectingCockState: "reversed",
        tripCockState: "tripped_derailment",
        signalPulsePressurePsi: 2.0,
      },
      1 / 60,
    );

    const clampedBeamX = nodes.frontBrakeBeam.position.x;
    const reversedCockD1Angle = nodes.selectingCockD1.rotation.y;
    const trippedCockEAngle = nodes.trippingCockE.rotation.y;

    expect(clampedBeamX).toBeGreaterThan(releasedBeamX);
    expect(reversedCockD1Angle).toBeGreaterThan(0);
    expect(trippedCockEAngle).toBeGreaterThan(0);
    expect(materials.sparkParticle.opacity).toBeGreaterThan(0);

    model.dispose();
  });
});
