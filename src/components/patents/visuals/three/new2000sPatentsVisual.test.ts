import { describe, expect, test } from "bun:test";
import * as THREE from "three";
import { stepDaVinci } from "@/physics/daVinciKernel";
import { stepEInk } from "@/physics/eInkKernel";
import { stepMultiTouch } from "@/physics/multiTouchKernel";
import { stepPageRank } from "@/physics/pageRankKernel";
import {
  projectRoombaOutsidePart,
  ROOMBA_COLLIDERS,
  ROOMBA_ENVIRONMENT_PARTS,
  ROOMBA_ROOM,
  stepRoomba,
} from "@/physics/roombaKernel";
import { buildDaVinciModel } from "./DaVinciModel";
import { buildEInkModel } from "./EInkModel";
import { buildMultiTouchModel } from "./MultiTouchModel";
import { buildPageRankModel } from "./PageRankModel";
import { buildRoombaModel } from "./RoombaModel";

describe("2000s Breakthrough Patents 3D Visual & Physics Boundaries", () => {
  describe("US 6,285,999 Google PageRank", () => {
    test("computes deterministic Markov probability convergence", () => {
      const initial = [1 / 3, 1 / 3, 1 / 3];
      const step1 = stepPageRank({ dampingFactor: 0.85 }, initial);
      const step2 = stepPageRank({ dampingFactor: 0.85 }, step1.ranks);
      expect(step1.ranks.length).toBe(3);
      expect(step2.ranks.length).toBe(3);
      const sum = step2.ranks.reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1.0, 3);
    });

    test("builds procedural graph geometry without external GLTF models", () => {
      const model = buildPageRankModel();
      expect(model.root).toBeDefined();
      expect(model.nodes.length).toBe(3);
      expect(model.edges.length).toBe(4);
      expect(() => model.dispose()).not.toThrow();
    });

    test("display rate follows the link-follow probability", async () => {
      const atDefault = stepPageRank({ dampingFactor: 0.85 });
      const frozen = stepPageRank({ dampingFactor: 0 });
      expect(atDefault.displayRate).toBeCloseTo(0.68, 3);
      expect(frozen.displayRate).toBe(0);
      const modelSource = await Bun.file(new URL("./PageRankModel.ts", import.meta.url)).text();
      expect(modelSource).not.toContain("timeSec * 0.8");
      expect(modelSource).toContain("displayRate");
    });
  });

  describe("US 6,594,844 iRobot Roomba", () => {
    test("executes deterministic expanding spiral and collision deflection", () => {
      let state = stepRoomba({
        wheelSpeedMps: 0.3,
        turnRateRadSec: 1.5,
        roomWidth: ROOMBA_ROOM.width,
        roomHeight: ROOMBA_ROOM.height,
      });
      expect(state.mode).toBe("spiral");

      // Step forward 100 ticks
      for (let i = 0; i < 100; i++) {
        state = stepRoomba(
          {
            wheelSpeedMps: 0.3,
            turnRateRadSec: 1.5,
            roomWidth: ROOMBA_ROOM.width,
            roomHeight: ROOMBA_ROOM.height,
          },
          state,
          1 / 60,
        );
      }
      expect(Math.abs(state.x)).toBeGreaterThan(0);
      expect(state.displayX).toBe(state.x);
    });

    test("kernel owns furniture bumps so 2D cannot privately mutate mode", async () => {
      let state = stepRoomba({
        wheelSpeedMps: 0.4,
        turnRateRadSec: 1.5,
        roomWidth: ROOMBA_ROOM.width,
        roomHeight: ROOMBA_ROOM.height,
      });
      const tableLeg = ROOMBA_COLLIDERS[0];
      state = {
        ...state,
        x: tableLeg.x,
        y: tableLeg.y,
        mode: "straight",
        timeInMode: 0.2,
      };
      state = stepRoomba(
        {
          wheelSpeedMps: 0.4,
          turnRateRadSec: 1.5,
          roomWidth: ROOMBA_ROOM.width,
          roomHeight: ROOMBA_ROOM.height,
        },
        state,
        1 / 60,
      );
      expect(state.mode).toBe("backup");
      expect(state.contactPartId).toBe(tableLeg.id);

      const simSource = await Bun.file(new URL("../RoombaSim.tsx", import.meta.url)).text();
      expect(simSource).toContain("ROOMBA_ROOM");
      expect(simSource).toContain("ROOMBA_FURNITURE");
      expect(simSource).toContain("getRoombaTapeState");
      expect(simSource).toContain("globalTransportBus.registerUpdater");
      expect(simSource).toContain("running: liveControls.current.isPlaying");
      expect(simSource).toContain('updateParam("isRunning"');
      expect(simSource).not.toContain('state.mode = "backup"');
      expect(simSource).not.toContain("roomWidth: 5.0");
      expect(simSource).not.toContain("setCleanedAreaPct");

      const threeSource = await Bun.file(new URL("./Roomba3D.tsx", import.meta.url)).text();
      expect(threeSource).toContain("tape.contactPartId");
      expect(threeSource).toContain('updateParam("opticalSensorEnabled"');
      expect(threeSource).toContain('updateParam("isRunning"');
      expect(threeSource).not.toContain("Room Coverage");
      expect(threeSource).not.toContain("98.4%");
    });

    test("builds procedural Roomba chassis, arena, and path trail tracer", () => {
      const model = buildRoombaModel();
      expect(model.root).toBeDefined();
      expect(model.mainGroup).toBeDefined();
      expect(model.opticalSensorGroup.parent).toBe(model.mainGroup);
      expect(model.opticalFieldGroup.parent).toBe(model.opticalSensorGroup);
      expect(model.root.getObjectByName("Directed photon emitter")).toBeDefined();
      expect(model.root.getObjectByName("Photon detector field aperture")).toBeDefined();
      expect(model.root.getObjectByName("Side-brush hub-to-chassis drive shaft")).toBeDefined();
      model.root.updateMatrixWorld(true);
      const chassis = model.root.getObjectByName("Roomba chassis body");
      const trim = model.root.getObjectByName("Chassis-supported silver top trim");
      const cleanButton = model.root.getObjectByName("Chassis-supported CLEAN button");
      const ledRing = model.root.getObjectByName("Chassis-supported CLEAN LED ring");
      expect(chassis).toBeDefined();
      expect(trim).toBeDefined();
      expect(cleanButton).toBeDefined();
      expect(ledRing).toBeDefined();
      const chassisBounds = new THREE.Box3().setFromObject(chassis as THREE.Object3D);
      const trimBounds = new THREE.Box3().setFromObject(trim as THREE.Object3D);
      const cleanButtonBounds = new THREE.Box3().setFromObject(cleanButton as THREE.Object3D);
      const ledRingBounds = new THREE.Box3().setFromObject(ledRing as THREE.Object3D);
      expect(trimBounds.min.y).toBeLessThanOrEqual(chassisBounds.max.y + 1e-8);
      expect(cleanButtonBounds.min.y).toBeLessThanOrEqual(chassisBounds.max.y + 1e-8);
      expect(ledRingBounds.min.y - chassisBounds.max.y).toBeLessThanOrEqual(0.001);
      const roomFloor = model.root.getObjectByName(
        "Shared Roomba room floor seated on studio floor",
      );
      expect(roomFloor?.getWorldPosition(new THREE.Vector3()).y).toBeCloseTo(-4.5, 12);
      model.setOpticalSensorEnabled(false);
      expect(model.opticalSensorGroup.visible).toBe(false);
      expect(model.opticalFieldGroup.visible).toBe(false);
      model.setOpticalSensorEnabled(true);
      expect(model.opticalSensorGroup.visible).toBe(true);
      expect(model.opticalFieldGroup.visible).toBe(true);
      expect(() => model.updateTrail(0.5, 0.5)).not.toThrow();
      const state = stepRoomba({
        wheelSpeedMps: 0.3,
        turnRateRadSec: 1.5,
        roomWidth: ROOMBA_ROOM.width,
        roomHeight: ROOMBA_ROOM.height,
      });
      expect(() => model.updateKinematics(state)).not.toThrow();
      expect(() => model.dispose()).not.toThrow();
    });

    test("one room receipt owns supported furniture solids and low collision footprints", () => {
      expect(
        ROOMBA_ENVIRONMENT_PARTS.filter((part) => part.assemblyId === "coffee-table"),
      ).toHaveLength(5);
      expect(ROOMBA_COLLIDERS).toHaveLength(8);
      for (const part of ROOMBA_ENVIRONMENT_PARTS) {
        expect(part.centerHeight - part.height / 2).toBeGreaterThanOrEqual(0);
      }
      for (const collider of ROOMBA_COLLIDERS) {
        expect(collider.kind).toBe("leg");
      }
    });

    test("projects an embedded robot through the nearest furniture face with a unit normal", () => {
      const leg = ROOMBA_COLLIDERS[0];
      const projected = projectRoombaOutsidePart(leg.x, leg.y, leg);
      expect(projected.hit).toBe(true);
      expect(Math.hypot(projected.normalX, projected.normalY)).toBeCloseTo(1, 12);
      const secondPass = projectRoombaOutsidePart(projected.x, projected.y, leg);
      expect(secondPass.hit).toBe(false);
    });

    test("differential wheel joints reverse in backup and counter-rotate in place", () => {
      const controls = {
        wheelSpeedMps: 0.3,
        turnRateRadSec: 1.5,
        roomWidth: ROOMBA_ROOM.width,
        roomHeight: ROOMBA_ROOM.height,
      };
      const initial = stepRoomba(controls);
      const backing = stepRoomba(controls, { ...initial, mode: "backup", timeInMode: 0 }, 1 / 60);
      expect(backing.leftWheelSpeedMps).toBeLessThan(0);
      expect(backing.rightWheelSpeedMps).toBeLessThan(0);
      const turning = stepRoomba(controls, { ...initial, mode: "turn", timeInMode: 0 }, 1 / 60);
      expect(turning.leftWheelSpeedMps).toBeLessThan(0);
      expect(turning.rightWheelSpeedMps).toBeGreaterThan(0);
    });

    test("side-brush and wheel angles drain the fixed-step kernel instead of frame time", async () => {
      const modelSource = await Bun.file(new URL("./RoombaModel.ts", import.meta.url)).text();
      expect(modelSource).not.toContain("delta * 18.0");
      expect(modelSource).toContain("state.sideBrushAngleRad");
      expect(modelSource).toContain("state.leftWheelAngleRad");
      expect(modelSource).not.toContain("wheelRotDelta");
    });
  });

  describe("US 6,331,181 Da Vinci Surgical System", () => {
    test("applies motion scaling and exposes the illustrative filter switch honestly", () => {
      const withFilter = stepDaVinci(
        {
          motionScaleRatio: 5,
          tremorFilterEnabled: true,
          masterInputSpeedMps: 0.5,
          gripAngleDeg: 30,
        },
        1.0,
      );
      const withoutFilter = stepDaVinci(
        {
          motionScaleRatio: 5,
          tremorFilterEnabled: false,
          masterInputSpeedMps: 0.5,
          gripAngleDeg: 30,
        },
        1.0,
      );
      expect(withFilter.compatibilitySignalPercent).toBe(100);
      expect(withoutFilter.compatibilitySignalPercent).toBe(0);
      expect(withFilter.slaveX).toBeDefined();
      expect(withFilter.wristPitchRad).toBeDefined();
    });

    test("2D master-speed and grip sliders write the shared physics bus", async () => {
      const simSource = await Bun.file(new URL("../DaVinciSim.tsx", import.meta.url)).text();
      expect(simSource).not.toContain("setInputSpeed");
      expect(simSource).not.toContain("setGripAngleDeg");
      expect(simSource).toContain('updateParam("masterInputSpeedMps"');
      expect(simSource).toContain('updateParam("gripAngleDeg"');
      expect(simSource).toContain("projectPatientWorld(state.tipX, state.tipY)");
      expect(simSource).not.toContain("trocarX + state.slaveX");
    });

    test("articulates the wrist and aligns its visible tip to the resolved kernel tip", () => {
      const state = stepDaVinci(
        {
          motionScaleRatio: 3,
          tremorFilterEnabled: true,
          masterInputSpeedMps: 0.5,
          gripAngleDeg: 30,
        },
        0,
      );
      const model = buildDaVinciModel();
      model.updateArmPose(
        state.baseYawRad,
        state.shoulderPitchRad,
        state.elbowPitchRad,
        state.wristPitchRad,
        state.wristYawRad,
        state.wristRollRad,
        state.gripRad,
        [state.masterX, state.masterY + 0.8, state.masterZ],
        [state.tipX, state.tipY, state.tipZ],
      );

      const renderedTip = model.endEffectorTipAnchor.getWorldPosition(new THREE.Vector3());
      expect(renderedTip.x).toBeCloseTo(state.tipX, 8);
      expect(renderedTip.y).toBeCloseTo(state.tipY, 8);
      expect(renderedTip.z).toBeCloseTo(state.tipZ, 8);
      for (const connection of model.connectivityReceipt()) {
        expect(connection.gapMeters).toBeLessThanOrEqual(1e-8);
      }
      expect(() => model.dispose()).not.toThrow();
    });

    test("keeps every cart-to-jaw interface connected across the control envelope", () => {
      const model = buildDaVinciModel();
      for (const motionScaleRatio of [1, 3, 10]) {
        for (const tremorFilterEnabled of [false, true]) {
          let previous: ReturnType<typeof stepDaVinci> | undefined;
          for (let timeSec = 0; timeSec <= 12; timeSec += 0.25) {
            const state = stepDaVinci(
              {
                motionScaleRatio,
                tremorFilterEnabled,
                masterInputSpeedMps: 1.5,
                gripAngleDeg: 12,
              },
              timeSec,
              previous,
              0.25,
            );
            previous = state;
            expect(() =>
              model.updateArmPose(
                state.baseYawRad,
                state.shoulderPitchRad,
                state.elbowPitchRad,
                state.wristPitchRad,
                state.wristYawRad,
                state.wristRollRad,
                state.gripRad,
                [state.masterX, state.masterY + 0.8, state.masterZ],
                [state.tipX, state.tipY, state.tipZ],
              ),
            ).not.toThrow();
            for (const connection of model.connectivityReceipt()) {
              expect(connection.gapMeters).toBeLessThanOrEqual(1e-8);
            }
          }
        }
      }
      expect(() => model.dispose()).not.toThrow();
    });
  });

  describe("US 6,120,588 E-Ink Electrophoretic Display", () => {
    test("models electrophoretic particle drift and optical contrast switching", () => {
      const whiteState = stepEInk(
        { electrodeVoltageVolts: 15, fluidViscosityCp: 2.0, particleChargeCoupled: 1.0 },
        1.0,
      );
      const blackState = stepEInk(
        { electrodeVoltageVolts: -15, fluidViscosityCp: 2.0, particleChargeCoupled: 1.0 },
        1.0,
      );
      expect(whiteState.surfaceReflectancePercent).toBeGreaterThan(
        blackState.surfaceReflectancePercent,
      );
      expect(whiteState.electricFieldVperUm).toBe(0.3);
      expect(blackState.electricFieldVperUm).toBe(-0.3);
    });

    test("2D capsule particles drain kernel Y without Math.random in the frame loop", async () => {
      const simSource = await Bun.file(new URL("../EInkSim.tsx", import.meta.url)).text();
      expect(simSource).not.toContain("Math.random(");
      expect(simSource).toContain("whiteParticleNormY");
      expect(simSource).toContain("blackParticleNormY");
      expect(simSource).toContain("particleChargeCoupled");
      expect(simSource).toContain("brownianJitterOmegaYRadPerS");
      expect(simSource).not.toContain("timeSec * 2.3");
      expect(simSource).not.toContain("timeSec * 1.7");
      const modelSource = await Bun.file(new URL("./EInkModel.ts", import.meta.url)).text();
      expect(modelSource).not.toContain("timeSec * 2 +");
      expect(modelSource).toContain("jitterOmega");
    });

    test("Stokes-Einstein thermal jitter slows in thicker fluid", () => {
      const thin = stepEInk({ electrodeVoltageVolts: 15, fluidViscosityCp: 1.0 }, 0);
      const thick = stepEInk({ electrodeVoltageVolts: 15, fluidViscosityCp: 4.0 }, 0);
      expect(thin.brownianJitterOmegaYRadPerS).toBeCloseTo(4.6, 3);
      expect(thick.brownianJitterOmegaYRadPerS).toBeCloseTo(1.15, 3);
      expect(thin.brownianJitterOmegaXRadPerS).toBeCloseTo(3.4, 3);
    });

    test("builds transparent microcapsule, particle arrays, and ITO electrode plates", () => {
      const model = buildEInkModel();
      expect(model.root).toBeDefined();
      expect(model.whiteParticleMeshes.length).toBe(48);
      expect(model.blackParticleMeshes.length).toBe(48);
      expect(model.eFieldArrows.length).toBe(4);
      expect(() => model.dispose()).not.toThrow();
    });
  });

  describe("US 7,479,949 Apple Multi-Touch Heuristics", () => {
    test("calculates mutual capacitance shunt and pinch-to-zoom affine scale", () => {
      const pinchZoom = stepMultiTouch(
        {
          fingerCount: 2,
          fingerSeparationMm: 100,
          touchPressureGrams: 80,
          gestureVelocityMmS: 15,
        },
        1.0,
      );
      expect(pinchZoom.gestureMode).toBe("Pinch-to-Zoom");
      expect(pinchZoom.zoomScale).toBe(2.0); // 100mm / 50mm baseline = 2.0x
      expect(pinchZoom.sensorMatrix.length).toBe(4);
      expect(pinchZoom.sensorMatrix[0].length).toBe(4);
    });

    test("2D gesture velocity is the registry seat, not leftover 25 mm/s", async () => {
      const simSource = await Bun.file(new URL("../MultiTouchSim.tsx", import.meta.url)).text();
      expect(simSource).toContain("params.gestureVelocityMmS ?? 15");
      expect(simSource).not.toContain("gestureVelocityMmS: 25");
    });

    test("builds glass screen, ITO capacitive grid, dual touch rings, and document plane", () => {
      const model = buildMultiTouchModel();
      expect(model.root).toBeDefined();
      expect(model.docGroup).toBeDefined();
      expect(model.touch1).toBeDefined();
      expect(model.touch2).toBeDefined();
      expect(() => model.dispose()).not.toThrow();
    });
  });
});
