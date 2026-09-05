import { describe, expect, test } from "bun:test";
import * as THREE from "three";
import { DA_VINCI_TABLE_SURFACE_Y_M, stepDaVinci } from "@/physics/daVinciKernel";
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
import { PATENT_PHYSICS_REGISTRY } from "@/physics/telemetryData";
import { buildDaVinciModel } from "./DaVinciModel";
import { buildEInkModel } from "./EInkModel";
import { buildMultiTouchModel } from "./MultiTouchModel";
import { buildPageRankModel } from "./PageRankModel";
import { pageRankCameraForViewport } from "./pageRankCamera";
import { buildRoombaModel } from "./RoombaModel";

describe("2000s Breakthrough Patents 3D Visual & Physics Boundaries", () => {
  describe("US 6,285,999 Google PageRank", () => {
    test("keeps the full rotating three-document topology in phone and desktop ISO frames", () => {
      const phone = pageRankCameraForViewport("iso", 320);
      expect(phone).toEqual({ pos: [0, 0.8, 17], target: [0, 0.8, 0] });
      expect(pageRankCameraForViewport("iso", 768)).toEqual({
        pos: [0, 0.5, 10.8],
        target: [0, 0.5, 0],
      });
      const desktop = pageRankCameraForViewport("iso", 1280);
      expect(desktop).toEqual({ pos: [0, 0.7, 12], target: [0, 0.7, 0] });
      expect(pageRankCameraForViewport("graph_network", 320)).toEqual({
        pos: [5.0, 3.5, 6.5],
        target: [0, 0, 0],
      });

      const model = buildPageRankModel();
      for (const node of model.nodes) node.scale.setScalar(1.53);

      const corners = (box: THREE.Box3) => {
        const points: THREE.Vector3[] = [];
        for (const x of [box.min.x, box.max.x]) {
          for (const y of [box.min.y, box.max.y]) {
            for (const z of [box.min.z, box.max.z]) points.push(new THREE.Vector3(x, y, z));
          }
        }
        return points;
      };

      for (const { view, aspect, horizontalLimit, verticalLimit } of [
        { view: phone, aspect: 320 / 380, horizontalLimit: 0.9, verticalLimit: 0.75 },
        { view: desktop, aspect: 1214 / 460, horizontalLimit: 0.4, verticalLimit: 0.75 },
      ]) {
        const camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 1000);
        camera.position.fromArray(view.pos);
        camera.lookAt(...view.target);
        camera.updateProjectionMatrix();

        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 12) {
          model.mainGroup.rotation.y = angle;
          model.root.updateMatrixWorld(true);
          camera.updateMatrixWorld(true);
          const projected: THREE.Vector3[] = [];
          model.mainGroup.traverse((object) => {
            if (
              !(
                object instanceof THREE.Mesh ||
                object instanceof THREE.Line ||
                object instanceof THREE.Points
              )
            ) {
              return;
            }
            object.geometry.computeBoundingBox();
            const bounds = object.geometry.boundingBox;
            if (!bounds) return;
            for (const point of corners(bounds)) {
              projected.push(point.applyMatrix4(object.matrixWorld).project(camera));
            }
          });
          expect(Math.min(...projected.map((point) => point.x))).toBeGreaterThanOrEqual(
            -horizontalLimit,
          );
          expect(Math.max(...projected.map((point) => point.x))).toBeLessThanOrEqual(
            horizontalLimit,
          );
          expect(Math.min(...projected.map((point) => point.y))).toBeGreaterThanOrEqual(
            -verticalLimit,
          );
          expect(Math.max(...projected.map((point) => point.y))).toBeLessThanOrEqual(verticalLimit);
        }
      }
      model.dispose();
    });

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

    test("seats the table, drape, abdomen, guide ring, cup, and pad in one world frame", () => {
      const model = buildDaVinciModel();
      try {
        model.root.updateMatrixWorld(true);
        const table = model.root.getObjectByName("Kernel-aligned surgical table");
        const drape = model.root.getObjectByName("Sterile drape at kernel table surface");
        const abdomen = model.root.getObjectByName("Convex patient abdomen training form");
        const guideRing = model.root.getObjectByName("Seated illustrative incision guide ring");
        const cup = model.root.getObjectByName("Cup body seated on kernel table surface");
        const pad = model.root.getObjectByName("Training pad seated on kernel table surface");
        for (const part of [table, drape, abdomen, guideRing, cup, pad]) {
          expect(part).toBeInstanceOf(THREE.Mesh);
        }
        const bounds = (part: THREE.Object3D | undefined) =>
          new THREE.Box3().setFromObject(part as THREE.Object3D);
        expect(bounds(table).max.y).toBeCloseTo(DA_VINCI_TABLE_SURFACE_Y_M, 8);
        expect(bounds(drape).max.y).toBeCloseTo(DA_VINCI_TABLE_SURFACE_Y_M, 8);
        expect(bounds(cup).min.y).toBeCloseTo(DA_VINCI_TABLE_SURFACE_Y_M, 8);
        expect(bounds(pad).min.y).toBeCloseTo(DA_VINCI_TABLE_SURFACE_Y_M - 0.0005, 8);
        expect(bounds(guideRing).intersectsBox(bounds(abdomen))).toBe(true);
        expect(guideRing?.userData.constraintMode).toBe("visual-guide-only");

        const tableBounds = bounds(table);
        for (let index = 1; index <= 4; index += 1) {
          const leg = model.root.getObjectByName(`Surgical table support leg ${index}`);
          expect(leg).toBeInstanceOf(THREE.Mesh);
          expect(bounds(leg).max.y).toBeCloseTo(tableBounds.min.y, 8);
        }
      } finally {
        model.dispose();
      }
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
      expect(simSource).not.toContain("createStudioClock");
      expect(simSource).not.toContain("requestAnimationFrame");
      expect(simSource).toContain("readEInkTapeFrame");
      expect(simSource).toContain("whiteParticleNormY");
      expect(simSource).toContain("blackParticleNormY");
      expect(simSource).toContain("particleChargeCoupled");
      expect(simSource).toContain("brownianJitterOmegaYRadPerS");
      expect(simSource).not.toContain("timeSec * 2.3");
      expect(simSource).not.toContain("timeSec * 1.7");
      const modelSource = await Bun.file(new URL("./EInkModel.ts", import.meta.url)).text();
      expect(modelSource).not.toContain("timeSec * 2 +");
      expect(modelSource).toContain("jitterOmega");
      expect(modelSource).toContain("THREE.InstancedMesh");
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
      expect(model.whiteParticleInstances).toBeInstanceOf(THREE.InstancedMesh);
      expect(model.blackParticleInstances).toBeInstanceOf(THREE.InstancedMesh);
      expect(model.whiteParticleInstances.count).toBe(48);
      expect(model.blackParticleInstances.count).toBe(48);
      expect(model.whiteParticleInstances.geometry).toBe(model.blackParticleInstances.geometry);
      expect(model.eFieldArrows.length).toBe(4);
      const whiteVersion = model.whiteParticleInstances.instanceMatrix.version;
      const blackVersion = model.blackParticleInstances.instanceMatrix.version;
      model.updateElectrophoresis(
        stepEInk({ electrodeVoltageVolts: -15, fluidViscosityCp: 2 }, 0.25),
        0.25,
      );
      expect(model.whiteParticleInstances.instanceMatrix.version).toBeGreaterThan(whiteVersion);
      expect(model.blackParticleInstances.instanceMatrix.version).toBeGreaterThan(blackVersion);
      expect(() => model.dispose()).not.toThrow();
    });
  });

  describe("US 7,479,949 Apple Multi-Touch Heuristics", () => {
    test("classifies the claimed initial-motion rule and the Claim 8 pinch illustration", () => {
      const pinchZoom = stepMultiTouch(
        {
          fingerCount: 2,
          fingerSeparationMm: 100,
        },
        1.0,
      );
      expect(pinchZoom.gestureMode).toBe("Pinch-to-Zoom");
      expect(pinchZoom.zoomScale).toBe(2.0); // 100mm / 50mm baseline = 2.0x
      expect(
        stepMultiTouch({ fingerCount: 1, fingerSeparationMm: 50, initialMotionAngleDeg: 15 }, 1.0)
          .gestureMode,
      ).toBe("Vertical Screen Scroll");
      expect(
        stepMultiTouch({ fingerCount: 1, fingerSeparationMm: 50, initialMotionAngleDeg: 45 }, 1.0)
          .gestureMode,
      ).toBe("Two-Dimensional Translation");
      expect(
        stepMultiTouch(
          {
            fingerCount: 1,
            fingerSeparationMm: 50,
            initialMotionAngleDeg: 15,
            claim1HeuristicActive: false,
          },
          1.0,
        ).gestureMode,
      ).toBe("Idle");
    });

    test("2D exhibit reads its source-bounded motion-angle control", async () => {
      const simSource = await Bun.file(new URL("../MultiTouchSim.tsx", import.meta.url)).text();
      const studioSource = await Bun.file(new URL("./MultiTouch3D.tsx", import.meta.url)).text();
      expect(simSource).toContain("params.initialMotionAngleDeg ?? 15");
      expect(simSource).not.toContain("mutualCapacitanceDeltaPf");
      expect(studioSource).toContain('domain: "source_bounded_command_classification"');
      expect(studioSource).not.toContain('domain: "aerodynamics_mbd"');
      expect(studioSource).toContain("claimConstraintStateParamId(claimNo)");
    });

    test("keeps the public telemetry at the post-detection command boundary", () => {
      const telemetry = PATENT_PHYSICS_REGISTRY["us-7479949-multitouch"];
      expect(telemetry.domain).toBe("hci_command_heuristics");
      expect(telemetry.engineMethod).toContain("no SI sensor, energy, or WASM model");
      expect(telemetry.governingEquation).toContain("reader illustration");
      expect(telemetry.governingEquation).not.toMatch(/capacitance|epsilon|sensor/i);
      expect(telemetry.controls.map((control) => control.id)).toEqual([
        "fingerSeparationMm",
        "fingerCount",
        "initialMotionAngleDeg",
      ]);
      expect(telemetry.pedagogicalInsight).toContain("does not claim a capacitive sensor stack");
    });

    test("builds a touch-screen command exhibit with source-bounded contact visibility", () => {
      const model = buildMultiTouchModel();
      expect(model.root).toBeDefined();
      expect(model.docGroup).toBeDefined();
      expect(model.touch1).toBeDefined();
      expect(model.touch2).toBeDefined();
      model.updateTouchContacts({ x: 0, y: 0 }, { x: 0.5, y: 0 }, 1);
      expect(model.touch1.visible).toBe(true);
      expect(model.touch2.visible).toBe(false);
      model.updateTouchContacts({ x: 0, y: 0 }, { x: 0.5, y: 0 }, 2);
      expect(model.touch2.visible).toBe(true);
      expect(() => model.dispose()).not.toThrow();
    });
  });
});
