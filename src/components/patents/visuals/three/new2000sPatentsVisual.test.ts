import { describe, expect, test } from "bun:test";
import { stepDaVinci } from "@/physics/daVinciKernel";
import { stepEInk } from "@/physics/eInkKernel";
import { stepMultiTouch } from "@/physics/multiTouchKernel";
import { stepPageRank } from "@/physics/pageRankKernel";
import { ROOMBA_FURNITURE, ROOMBA_ROOM, stepRoomba } from "@/physics/roombaKernel";
import { buildDaVinciModel } from "./DaVinciModel";
import { buildEInkModel } from "./EInkModel";
import { buildMultiTouchModel } from "./MultiTouchModel";
import { buildPageRankModel } from "./PageRankModel";
import { buildRoombaModel } from "./RoombaModel";

describe("2000s Breakthrough Patents 3D Visual & Physics Boundaries", () => {
  describe("US 6,285,999 Google PageRank", () => {
    test("computes deterministic Markov probability convergence", () => {
      const initial = [0.2, 0.2, 0.2, 0.2, 0.2];
      const step1 = stepPageRank({ dampingFactor: 0.85 }, initial);
      const step2 = stepPageRank({ dampingFactor: 0.85 }, step1.ranks);
      expect(step1.ranks.length).toBe(5);
      expect(step2.ranks.length).toBe(5);
      const sum = step2.ranks.reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1.0, 3);
    });

    test("builds procedural graph geometry without external GLTF models", () => {
      const model = buildPageRankModel();
      expect(model.root).toBeDefined();
      expect(model.nodes.length).toBe(5);
      expect(model.edges.length).toBe(7);
      expect(() => model.dispose()).not.toThrow();
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
      const table = ROOMBA_FURNITURE[0];
      state = {
        ...state,
        x: table.x,
        y: table.y,
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

      const simSource = await Bun.file(new URL("../RoombaSim.tsx", import.meta.url)).text();
      expect(simSource).toContain("ROOMBA_ROOM");
      expect(simSource).toContain("ROOMBA_FURNITURE");
      expect(simSource).not.toContain('state.mode = "backup"');
      expect(simSource).not.toContain("roomWidth: 5.0");
    });

    test("builds procedural Roomba chassis, arena, and path trail tracer", () => {
      const model = buildRoombaModel();
      expect(model.root).toBeDefined();
      expect(model.mainGroup).toBeDefined();
      expect(() => model.updateTrail(0.5, 0.5)).not.toThrow();
      expect(() => model.dispose()).not.toThrow();
    });
  });

  describe("US 6,331,181 Da Vinci Surgical System", () => {
    test("applies motion scaling and digital tremor cancellation", () => {
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
      expect(withFilter.tremorAttenuationPercent).toBe(94.5);
      expect(withoutFilter.tremorAttenuationPercent).toBe(0.0);
      expect(withFilter.slaveX).toBeDefined();
      expect(withFilter.wristPitchRad).toBeDefined();
    });

    test("2D master-speed and grip sliders write the shared physics bus", async () => {
      const simSource = await Bun.file(new URL("../DaVinciSim.tsx", import.meta.url)).text();
      expect(simSource).not.toContain("setInputSpeed");
      expect(simSource).not.toContain("setGripAngleDeg");
      expect(simSource).toContain('updateParam("masterInputSpeedMps"');
      expect(simSource).toContain('updateParam("gripAngleDeg"');
    });

    test("articulates multi-axis EndoWrist and dual forceps jaws", () => {
      const model = buildDaVinciModel();
      expect(model.root).toBeDefined();
      expect(model.wristPitchGroup).toBeDefined();
      expect(model.leftJawGroup).toBeDefined();
      expect(model.rightJawGroup).toBeDefined();
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
