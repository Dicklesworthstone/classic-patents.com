import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FrankenSimEngine } from "./engine";
import {
  coupledRudderDeg,
  readWrightControls,
  stepWrightFlyerSi,
  WRIGHT_ALTITUDE_LIFT_COUPLING,
  WRIGHT_COUPLING,
  WRIGHT_GROSS_WEIGHT_N,
  WRIGHT_PATENT_ID,
  WRIGHT_PITCH_INERTIA_KG_M2,
  WRIGHT_YAW_INERTIA_KG_M2,
  wrightSchematicPose,
} from "./wrightKernel";

describe("Wright Flyer 3-Axis Aerodynamics Kernel", () => {
  test("Claim 18 rudder linkage coupling ratio equals 0.45", () => {
    expect(WRIGHT_PATENT_ID).toBe("us-821393-wright-flyer");
    expect(WRIGHT_COUPLING).toBe(0.45);
    expect(coupledRudderDeg(10)).toBe(4.5); // continuous Claim 18 linkage: 10 * 0.45
    expect(coupledRudderDeg(20)).toBe(9); // round(20 * 0.45) = 9
  });

  test("readWrightControls automatically derives rudder deflection when coupled is true", () => {
    const coupled = readWrightControls({ airspeed: 28, wingWarp: 12, coupled: 1 });
    expect(coupled.coupled).toBe(true);
    expect(coupled.wingWarpDeg).toBe(12);
    expect(coupled.rudderDeg).toBe(5.4); // coupledRudderDeg(12) = 12 * 0.45 (continuous)

    const uncoupled = readWrightControls({
      airspeed: 28,
      wingWarp: 12,
      rudder: 0,
      coupled: 0,
    });
    expect(uncoupled.coupled).toBe(false);
    expect(uncoupled.rudderDeg).toBe(0);
  });

  test("stepWrightFlyerSi computes aerodynamic lift, induced drag, and adverse yaw in SI units", () => {
    const controls = readWrightControls({ airspeed: 30, wingWarp: 0, elevator: 0, coupled: 1 });
    const si = stepWrightFlyerSi(controls);

    expect(si.airspeedMps).toBeCloseTo(30 * 0.44704, 2);
    expect(si.dynamicPressurePa).toBeGreaterThan(100);
    expect(si.liftNewtons).toBeGreaterThan(2000);
    expect(si.inducedDragNewtons).toBeGreaterThan(0);
    expect(si.parasiticDragNewtons).toBeGreaterThan(0);
    expect(si.liftToDrag).toBeGreaterThan(4);
    expect(si.cl).toBe(0.45);
    expect(si.yawAlphaRadPerS2).toBeCloseTo(si.netYawNm / WRIGHT_YAW_INERTIA_KG_M2, 5);
    expect(si.pitchAlphaRadPerS2).toBeCloseTo(si.pitchNm / WRIGHT_PITCH_INERTIA_KG_M2, 5);
    expect(si.altitudeRateMps).toBeCloseTo(
      (si.liftNewtons - WRIGHT_GROSS_WEIGHT_N) * WRIGHT_ALTITUDE_LIFT_COUPLING,
      6,
    );
  });

  test("differential wing warping creates differential lift and induced drag on each wingtip", () => {
    const warped = readWrightControls({ airspeed: 30, wingWarp: 10, coupled: 1 });
    const si = stepWrightFlyerSi(warped);

    expect(si.rightLiftN).toBeGreaterThan(si.leftLiftN);
    expect(si.rightInducedDragNewtons).toBeGreaterThan(si.leftInducedDragNewtons);
  });

  test("adverse yaw cancels with coupled rudder producing coordinated flight", () => {
    // Coupled case
    const coupled = readWrightControls({ airspeed: 30, wingWarp: 10, coupled: 1 });
    const siCoupled = stepWrightFlyerSi(coupled);
    expect(siCoupled.adverseYawNm).toBeLessThan(0);
    expect(siCoupled.rudderYawNm).toBeGreaterThan(0);
    expect(siCoupled.coordinated).toBe(true);
    expect(siCoupled.adverseYawDominant).toBe(false);

    // Uncoupled case (adverse yaw unchecked)
    const uncoupled = readWrightControls({ airspeed: 30, wingWarp: 10, rudder: 0, coupled: 0 });
    const siUncoupled = stepWrightFlyerSi(uncoupled);
    expect(siUncoupled.rudderYawNm).toBe(0);
    expect(siUncoupled.coordinated).toBe(false);
    expect(siUncoupled.adverseYawDominant).toBe(true);
  });

  test("wrightSchematicPose computes authentic Fig. 4 raster skew and strut deformation", () => {
    const pose = wrightSchematicPose({ wingWarp: 10, rudder: 5, coupled: 1 });
    expect(pose.wingWarpDeg).toBe(10);
    expect(pose.warpPx).toBeGreaterThan(0);
    expect(pose.rasterSkew).toBeGreaterThan(0);
    expect(pose.schematicRasterW).toBe(352);
    expect(pose.schematicCanardW).toBe(120);
    expect(pose.schematicStrutXs).toEqual([80, 160, 240, 320]);
    expect(pose.adverse).toBe(false);

    const adversePose = wrightSchematicPose({ wingWarp: 10, rudder: 0, coupled: 0 });
    expect(adversePose.adverse).toBe(true);
  });

  test("host 6-DoF integrator drains lift, drag, and yaw/pitch rates from stepWrightFlyerSi", () => {
    const engineSource = readFileSync(join(process.cwd(), "src/physics/engine.ts"), "utf8");
    expect(engineSource).not.toContain("wingWarpDeg * 0.08");
    expect(engineSource).not.toContain("rudderDeg * 0.12");
    expect(engineSource).not.toContain("elevatorDeg * 0.15");
    expect(engineSource).not.toContain("340 * 9.81");

    const dt = 0.016;
    const si = stepWrightFlyerSi({
      airspeedMph: 30,
      wingWarpDeg: 10,
      rudderDeg: 0,
      elevatorDeg: 2,
      coupled: false,
    });
    const next = FrankenSimEngine.stepWrightFlyer(
      {
        airspeedMps: 30 * 0.44704,
        altitudeMeters: 3.5,
        angleOfAttackRad: 0.073,
        sideslipRad: 0,
        wingWarpDeflectionDeg: 0,
        rudderDeflectionDeg: 0,
        elevatorDeflectionDeg: 0,
        liftNewtons: 3400,
        inducedDragNewtons: 480,
        parasiticDragNewtons: 120,
        thrustNewtons: 500,
        pitchRateRps: 0,
        rollRateRps: 0,
        yawRateRps: 0,
      },
      { wingWarpDeg: 10, rudderDeg: 0, elevatorDeg: 2, dt },
    );
    expect(next.liftNewtons).toBeCloseTo(si.liftNewtons, 5);
    expect(next.inducedDragNewtons).toBeCloseTo(si.inducedDragNewtons, 5);
    expect(next.yawRateRps).toBeCloseTo(si.yawAlphaRadPerS2 * dt, 5);
    expect(next.pitchRateRps).toBeCloseTo(si.pitchAlphaRadPerS2 * dt, 5);
  });
});
