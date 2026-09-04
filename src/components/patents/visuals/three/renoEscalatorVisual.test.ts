import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { energyChannelsFor } from "@/physics/energyChannels";
import { stepRenoEscalator } from "@/physics/machineKernels";
import { PATENT_PHYSICS_REGISTRY } from "@/physics/telemetryData";
import { RENO_CAMERA_PRESETS, renoCameraForViewport } from "./renoEscalatorCamera";
import {
  buildRenoEscalatorModel,
  createRenoEscalatorLayout,
  RENO_CLEAT_COUNT,
  RENO_CLEAT_PITCH_M,
  RENO_CONVEYOR_LOOP_LENGTH_M,
  RENO_CONVEYOR_SHEAVE_RADIUS_M,
  RENO_INCLINED_RUN_LENGTH_M,
  RENO_SPROCKET_SEAT_COUNT,
  renoConveyorPose,
  renoHandrailPose,
  updateRenoEscalatorIncline,
  updateRenoEscalatorKinematics,
} from "./renoEscalatorModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

function projectedObjectBounds(object: THREE.Object3D, camera: THREE.PerspectiveCamera) {
  object.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(object);
  const frame = {
    minX: Number.POSITIVE_INFINITY,
    maxX: Number.NEGATIVE_INFINITY,
    minY: Number.POSITIVE_INFINITY,
    maxY: Number.NEGATIVE_INFINITY,
  };

  for (const x of [bounds.min.x, bounds.max.x]) {
    for (const y of [bounds.min.y, bounds.max.y]) {
      for (const z of [bounds.min.z, bounds.max.z]) {
        const projected = new THREE.Vector3(x, y, z).project(camera);
        frame.minX = Math.min(frame.minX, projected.x);
        frame.maxX = Math.max(frame.maxX, projected.x);
        frame.minY = Math.min(frame.minY, projected.y);
        frame.maxY = Math.max(frame.maxY, projected.y);
      }
    }
  }
  return frame;
}

describe("US 470,918 Jesse Reno Inclined Elevator visual & mechanics boundary", () => {
  test("uses a procedural, pitch-locked drive rather than an elastic visual surrogate", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "RenoEscalator3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "renoEscalatorModel.ts"),
      "utf8",
    );
    const twoDSource = readFileSync(join(VISUALS_DIRECTORY, "RenoEscalatorSim.tsx"), "utf8");

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildRenoEscalatorModel");
    expect(modelSource).toContain("updateRenoEscalatorKinematics");
    expect(modelSource).toContain("createNotchedSprocketGeometry");
    expect(modelSource).toContain("renoHandrailPose");
    expect(modelSource).toContain("updateRenoEscalatorIncline");
    expect(modelSource).not.toContain("renoSheaveCrate");
    expect(modelSource).not.toContain("radialScale");
    expect(modelSource).not.toContain("motorDrive");
    expect(modelSource).not.toContain("cast-bronze");
    expect(modelSource).toContain("fixed-grooved-rail-7");
    expect(modelSource).toContain("terminal-casing-20-handrail-sprocket");
    expect(modelSource).toContain("shaft-13-top-handrail-linkage");
    expect(threeSource).toContain("updateRenoEscalatorIncline(escalatorModel.nodes");
    expect(threeSource).toContain("}, [live]);");
    expect(threeSource).not.toContain("}, [live, inclineAngleDeg]);");
    expect(threeSource).not.toContain("useGenericWasmSource");
    expect(threeSource).not.toContain("fs-solid");
    expect(threeSource).not.toContain("stepRenoEscalator");
    expect(threeSource).not.toContain("Motor Power");
    expect(threeSource).not.toContain("1.2mm");
    expect(threeSource).toContain("TS host kinematics");
    expect(threeSource).toContain("Top wheels; bottom permitted");
    expect(twoDSource).not.toContain("Motor Power");
    expect(twoDSource).not.toContain("Passenger Live Load");
    expect(twoDSource).toContain("cast-steel comb");
    expect(twoDSource).toContain("Traveling articulated handrail 10 / fixed rail 7");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "RenoEscalator3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "renoEscalatorModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for escalator observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "RenoEscalator3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "comb_plates", "cleated_deck", "handrail", "top_drive", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("cutawayMode");
    expect(threeSource).toContain("Reno Endless Conveyor Dynamics");
    expect(threeSource).toContain("controls.setView");
    expect(threeSource).not.toContain("cameraRef");
    expect(threeSource).toContain("renoCameraForViewport");

    for (const [name, preset] of Object.entries(RENO_CAMERA_PRESETS)) {
      const clearance = new THREE.Vector3(...preset.pos).distanceTo(
        new THREE.Vector3(...preset.target),
      );
      expect(clearance, `${name} camera must remain outside the apparatus`).toBeGreaterThan(6);
    }
  });

  test("keeps both terminal stations and the full cleated loop readable in the exact 320px canvas", () => {
    const model = buildRenoEscalatorModel();
    try {
      const desktop = renoCameraForViewport("iso", 1216, 460);
      const tablet = renoCameraForViewport("iso", 718, 460);
      expect(desktop).toEqual(RENO_CAMERA_PRESETS.iso);
      expect(tablet).toEqual(RENO_CAMERA_PRESETS.iso);

      // V26's 320px browser viewport produces a 286 × 380px studio canvas.
      // The 20° and 35° endpoints cover the incline control, and solid/cutaway
      // modes cover the two visual states visitors can inspect.
      const canvasWidth = 286;
      const canvasHeight = 380;
      const view = renoCameraForViewport("iso", canvasWidth, canvasHeight);
      const camera = new THREE.PerspectiveCamera(42, canvasWidth / canvasHeight, 0.1, 1000);
      camera.position.set(...view.pos);
      camera.lookAt(...view.target);
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();

      for (const inclineAngleDeg of [20, 35]) {
        for (const cutawayMode of [true, false]) {
          updateRenoEscalatorIncline(model.nodes, inclineAngleDeg);
          updateRenoEscalatorKinematics(model.nodes, model.materials, 0.7, cutawayMode);
          model.root.updateMatrixWorld(true);

          const apparatus = projectedObjectBounds(model.root, camera);
          const bottomTerminal = projectedObjectBounds(model.nodes.bottomCombPlate, camera);
          const topTerminal = projectedObjectBounds(model.nodes.topCombPlate, camera);
          const deckLoop = projectedObjectBounds(model.nodes.cleatDeckGroup, camera);

          expect(apparatus.minX, `${inclineAngleDeg}° ${cutawayMode} left edge`).toBeGreaterThan(
            -0.8,
          );
          expect(apparatus.maxX, `${inclineAngleDeg}° ${cutawayMode} right edge`).toBeLessThan(
            0.86,
          );
          expect(apparatus.minY, `${inclineAngleDeg}° ${cutawayMode} lower edge`).toBeGreaterThan(
            -0.72,
          );
          expect(apparatus.maxY, `${inclineAngleDeg}° ${cutawayMode} upper edge`).toBeLessThan(
            0.45,
          );
          expect(
            ((apparatus.maxX - apparatus.minX) * canvasWidth) / 2,
            `${inclineAngleDeg}° ${cutawayMode} horizontal readability`,
          ).toBeGreaterThan(215);
          expect(
            ((apparatus.maxY - apparatus.minY) * canvasHeight) / 2,
            `${inclineAngleDeg}° ${cutawayMode} vertical readability`,
          ).toBeGreaterThan(150);

          for (const [name, terminal] of [
            ["bottom terminal", bottomTerminal],
            ["top terminal", topTerminal],
            ["cleated loop", deckLoop],
          ] as const) {
            expect(
              terminal.minX,
              `${inclineAngleDeg}° ${cutawayMode} ${name} left`,
            ).toBeGreaterThan(-0.8);
            expect(terminal.maxX, `${inclineAngleDeg}° ${cutawayMode} ${name} right`).toBeLessThan(
              0.86,
            );
            expect(
              terminal.minY,
              `${inclineAngleDeg}° ${cutawayMode} ${name} lower`,
            ).toBeGreaterThan(-0.72);
            expect(terminal.maxY, `${inclineAngleDeg}° ${cutawayMode} ${name} upper`).toBeLessThan(
              0.45,
            );
          }
        }
      }
    } finally {
      model.dispose();
    }
  });

  test("reselects only the overview for a desktop-to-phone resize", () => {
    const source = readFileSync(join(VISUALS_DIRECTORY, "three", "RenoEscalator3D.tsx"), "utf8");
    expect(renoCameraForViewport("iso", 1216, 460)).toEqual(RENO_CAMERA_PRESETS.iso);
    expect(renoCameraForViewport("iso", 286, 380)).not.toEqual(RENO_CAMERA_PRESETS.iso);
    expect(renoCameraForViewport("top_drive", 286, 380)).toEqual(RENO_CAMERA_PRESETS.top_drive);
    expect(source).toContain('if (activeCamera !== "iso") return;');
    expect(source).toContain('window.addEventListener("resize", reselectResponsiveOverview)');
    expect(source).toContain(
      'window.addEventListener("orientationchange", reselectResponsiveOverview)',
    );
  });

  test("keeps the public Reno readout on disclosed speed, clearance, and capacity facts", () => {
    const result = stepRenoEscalator({
      inclineAngleDeg: 25,
      velocityMps: 1.016,
    });

    expect(result.speedFpm).toBe(200);
    expect(result.cleatSvgPitchPx).toBe(35);
    expect(result.cleatSvgXScale).toBeCloseTo(0.85, 2);
    expect(result.sheaveOmegaRadPerS * RENO_CONVEYOR_SHEAVE_RADIUS_M).toBeCloseTo(1.016, 4);

    const entry = PATENT_PHYSICS_REGISTRY["us-470918-reno-escalator"];
    expect(entry.engineMethod).toBe("TypeScript host kinematic readout (no Reno WASM step)");
    expect(entry.controls).toMatchObject([
      { id: "inclineAngle", defaultValue: 25 },
      { id: "beltSpeed", min: 0.4, max: 1.2, step: 0.001, defaultValue: 1.016 },
    ]);
    expect(entry.computeMetrics({ beltSpeed: 1.016 })).toMatchObject([
      { label: "Selected Belt Speed", value: "200 ft/min", unit: "1.016 m/s" },
      { label: "Patent Preferred Speed", value: "200 ft/min", unit: "≈ 1.016 m/s" },
      { label: "Patent Stated Maximum", value: "6,000", unit: "passengers/h, single file" },
      { label: "Preferred Comb Clearance", value: "≤ 1/8 in", unit: "≤ 3.175 mm" },
      { label: "Selected Incline", value: "25°", unit: "source-preference display" },
    ]);
    const publicCopy = JSON.stringify(entry).toLowerCase();
    for (const unsupported of ["drive motor torque", "motor power draw", "fs-solid", "1.2mm"]) {
      expect(publicCopy).not.toContain(unsupported);
    }
    expect(energyChannelsFor("us-470918-reno-escalator", {})).toEqual([]);
  });

  test("keeps a fixed-pitch closed chain while both comb stations remain on horizontal terminal runs", () => {
    expect(RENO_CLEAT_PITCH_M * RENO_SPROCKET_SEAT_COUNT).toBeCloseTo(
      Math.PI * 2 * RENO_CONVEYOR_SHEAVE_RADIUS_M,
      12,
    );
    expect(RENO_CLEAT_PITCH_M * RENO_CLEAT_COUNT).toBeCloseTo(RENO_CONVEYOR_LOOP_LENGTH_M, 12);

    for (const inclineAngleDeg of [20, 25, 35]) {
      const layout = createRenoEscalatorLayout(inclineAngleDeg);
      const transitionLengthM = RENO_CONVEYOR_SHEAVE_RADIUS_M * layout.inclineAngleRad;
      const bottomComb = renoConveyorPose(layout.bottomCombDistanceM, layout);
      const topComb = renoConveyorPose(layout.topCombDistanceM, layout);

      expect(layout.loopLengthM).toBeCloseTo(RENO_CONVEYOR_LOOP_LENGTH_M, 12);
      expect(layout.terminalRunLengthM).toBeGreaterThan(0);
      expect(bottomComb.phase).toBe("bottom-landing");
      expect(topComb.phase).toBe("top-landing");
      expect(bottomComb.tangentAngleRad).toBeCloseTo(0, 12);
      expect(topComb.tangentAngleRad).toBeCloseTo(0, 12);
      expect(renoConveyorPose(layout.bottomCombDistanceM + 0.03, layout).y).toBeCloseTo(
        bottomComb.y,
        12,
      );
      expect(renoConveyorPose(layout.topCombDistanceM + 0.03, layout).y).toBeCloseTo(topComb.y, 12);

      for (const boundary of [
        layout.terminalRunLengthM,
        layout.terminalRunLengthM + transitionLengthM,
        layout.terminalRunLengthM + transitionLengthM + RENO_INCLINED_RUN_LENGTH_M,
        layout.terminalRunLengthM + transitionLengthM * 2 + RENO_INCLINED_RUN_LENGTH_M,
        layout.headTurnStartM,
        layout.headTurnStartM + Math.PI * RENO_CONVEYOR_SHEAVE_RADIUS_M,
        layout.tailTurnStartM,
        layout.loopLengthM,
      ]) {
        const before = renoConveyorPose(boundary - 1e-6, layout);
        const after = renoConveyorPose(boundary + 1e-6, layout);
        expect(Math.hypot(after.x - before.x, after.y - before.y)).toBeLessThan(3e-6);
      }
    }
  });

  test("updates the common incline layout in place and keeps combs fixed over registered terminal travel", () => {
    const { root, nodes, materials } = buildRenoEscalatorModel(25);
    expect(root.children.length).toBeGreaterThan(4);
    expect(nodes.cleatCount).toBe(RENO_CLEAT_COUNT);
    expect(nodes.cleatCount).toBeGreaterThan(45);
    expect(nodes.cleatSlats.count).toBe(RENO_CLEAT_COUNT);
    expect(nodes.cleatRollers.count).toBe(RENO_CLEAT_COUNT);
    expect(nodes.cleatHinges.count).toBe(RENO_CLEAT_COUNT);
    expect(nodes.leftHandrail.count).toBe(RENO_CLEAT_COUNT);
    expect(nodes.rightHandrail.count).toBe(RENO_CLEAT_COUNT);
    expect(nodes.headSheaves.map((sheave) => sheave.position.z)).toEqual([-0.98, 0.98]);
    expect(nodes.tailSheaves.map((sheave) => sheave.position.z)).toEqual([-0.98, 0.98]);
    expect(nodes.trussGroup.children).toHaveLength(2);
    const trussBounds = new THREE.Box3().setFromObject(nodes.trussGroup);
    expect(trussBounds.min.z).toBeGreaterThanOrEqual(-1.53);
    expect(trussBounds.max.z).toBeLessThanOrEqual(1.53);
    expect(nodes.headHandrailSprockets).toHaveLength(2);
    expect(nodes.tailHandrailSprockets).toHaveLength(2);
    expect(nodes.inclinedHandrailChannels).toHaveLength(2);
    expect(
      nodes.inclinedHandrailChannels.every((channel) => channel.parent === nodes.inclineFrame),
    ).toBe(true);
    expect(nodes.headHandrailCasings).toHaveLength(2);
    expect(nodes.tailHandrailCasings).toHaveLength(2);
    expect(nodes.topCombPlate.children).toHaveLength(1);
    expect(nodes.bottomCombPlate.children).toHaveLength(1);

    const originalRoot = nodes.root;
    updateRenoEscalatorIncline(nodes, 35);
    expect(nodes.root).toBe(originalRoot);
    expect(nodes.inclineFrame.rotation.z).toBeCloseTo((35 * Math.PI) / 180, 12);
    expect(nodes.bottomCombPlate.rotation.z).toBe(0);
    expect(nodes.topCombPlate.rotation.z).toBe(0);

    const bottomCombPose = renoConveyorPose(nodes.layout.bottomCombDistanceM, nodes.layout);
    const topCombPose = renoConveyorPose(nodes.layout.topCombDistanceM, nodes.layout);
    expect(nodes.bottomCombPlate.position.x).toBeCloseTo(bottomCombPose.x - 0.2, 12);
    expect(nodes.bottomCombPlate.position.y).toBeCloseTo(bottomCombPose.y + 0.11, 12);
    expect(nodes.topCombPlate.position.x).toBeCloseTo(topCombPose.x + 0.2, 12);
    expect(nodes.topCombPlate.position.y).toBeCloseTo(topCombPose.y + 0.11, 12);
    expect(nodes.topHandrailDriveShaft.position.x).toBeCloseTo(
      nodes.headHandrailSprockets[0].position.x,
      12,
    );
    expect(nodes.topHandrailDriveShaft.position.y).toBeCloseTo(
      nodes.headHandrailSprockets[0].position.y,
      12,
    );
    expect(nodes.bottomHandrailSupportShaft.position.x).toBeCloseTo(
      nodes.tailHandrailSprockets[0].position.x,
      12,
    );
    expect(nodes.bottomHandrailSupportShaft.position.y).toBeCloseTo(
      nodes.tailHandrailSprockets[0].position.y,
      12,
    );
    expect(nodes.headHandrailCasings[0].position.toArray()).toEqual(
      nodes.headHandrailSprockets[0].position.toArray(),
    );
    expect(nodes.tailHandrailCasings[1].position.toArray()).toEqual(
      nodes.tailHandrailSprockets[1].position.toArray(),
    );

    const travelM = 0.45 * 0.5;
    updateRenoEscalatorKinematics(nodes, materials, travelM, true);

    const slatMatrix = new THREE.Matrix4();
    const rollerMatrix = new THREE.Matrix4();
    const hingeMatrix = new THREE.Matrix4();
    const leftRailMatrix = new THREE.Matrix4();
    const rightRailMatrix = new THREE.Matrix4();
    nodes.cleatSlats.getMatrixAt(0, slatMatrix);
    nodes.cleatRollers.getMatrixAt(0, rollerMatrix);
    nodes.cleatHinges.getMatrixAt(0, hingeMatrix);
    nodes.leftHandrail.getMatrixAt(0, leftRailMatrix);
    nodes.rightHandrail.getMatrixAt(0, rightRailMatrix);
    const movedPosition = new THREE.Vector3().setFromMatrixPosition(slatMatrix);
    const hingePosition = new THREE.Vector3().setFromMatrixPosition(hingeMatrix);
    const leftRailPosition = new THREE.Vector3().setFromMatrixPosition(leftRailMatrix);
    const rightRailPosition = new THREE.Vector3().setFromMatrixPosition(rightRailMatrix);
    const expectedSlat = renoConveyorPose(travelM + RENO_CLEAT_PITCH_M / 2, nodes.layout);
    const expectedHinge = renoConveyorPose(travelM, nodes.layout);
    const expectedRail = renoHandrailPose(travelM + RENO_CLEAT_PITCH_M / 2, nodes.layout);

    // InstancedMesh uploads its matrices as Float32 values; five places still
    // pins the physical path while respecting that GPU representation.
    expect(movedPosition.x).toBeCloseTo(expectedSlat.x, 5);
    expect(movedPosition.y).toBeCloseTo(expectedSlat.y, 5);
    expect(slatMatrix.toArray()).toEqual(rollerMatrix.toArray());
    expect(hingePosition.x).toBeCloseTo(expectedHinge.x, 5);
    expect(hingePosition.y).toBeCloseTo(expectedHinge.y, 5);
    expect(leftRailPosition.x).toBeCloseTo(expectedRail.x, 5);
    expect(leftRailPosition.y).toBeCloseTo(expectedRail.y, 5);
    expect(leftRailPosition.z).toBeCloseTo(-1.4, 5);
    expect(rightRailPosition.x).toBeCloseTo(expectedRail.x, 5);
    expect(rightRailPosition.y).toBeCloseTo(expectedRail.y, 5);
    expect(rightRailPosition.z).toBeCloseTo(1.4, 5);

    const expectedHeadAngle =
      nodes.layout.headSprocketPhaseRad - travelM / RENO_CONVEYOR_SHEAVE_RADIUS_M;
    const expectedTailAngle =
      nodes.layout.tailSprocketPhaseRad - travelM / RENO_CONVEYOR_SHEAVE_RADIUS_M;
    expect(nodes.headSheaves[0].rotation.z).toBeCloseTo(expectedHeadAngle, 10);
    expect(nodes.tailSheaves[0].rotation.z).toBeCloseTo(expectedTailAngle, 10);
    expect(nodes.headHandrailSprockets[0].rotation.z).toBeCloseTo(expectedHeadAngle, 10);
    expect(nodes.tailHandrailSprockets[0].rotation.z).toBeCloseTo(expectedTailAngle, 10);
    expect(nodes.topHandrailDriveShaft.rotation.z).toBeCloseTo(expectedHeadAngle, 10);
    expect(nodes.bottomHandrailSupportShaft.rotation.z).toBeCloseTo(expectedTailAngle, 10);
    expect(nodes.headSheaves[0].scale.x).toBeCloseTo(1, 12);
    expect(nodes.headSheaves[0].scale.y).toBeCloseTo(1, 12);
    expect(nodes.solidPanelMesh.visible).toBe(false);
    expect(nodes.cutawayPanelMesh.visible).toBe(true);

    const once = slatMatrix.toArray();
    updateRenoEscalatorKinematics(nodes, materials, travelM, true);
    nodes.cleatSlats.getMatrixAt(0, slatMatrix);
    expect(slatMatrix.toArray()).toEqual(once);

    updateRenoEscalatorKinematics(nodes, materials, travelM + RENO_CONVEYOR_LOOP_LENGTH_M, false);
    nodes.cleatSlats.getMatrixAt(0, slatMatrix);
    const wrappedPosition = new THREE.Vector3().setFromMatrixPosition(slatMatrix);
    expect(wrappedPosition.x).toBeCloseTo(movedPosition.x, 5);
    expect(wrappedPosition.y).toBeCloseTo(movedPosition.y, 5);
    expect(nodes.solidPanelMesh.visible).toBe(true);
    expect(nodes.cutawayPanelMesh.visible).toBe(false);
  });
});
