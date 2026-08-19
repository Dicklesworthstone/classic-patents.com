import { describe, expect, test } from "bun:test";
import {
  coupledRudderDeg,
  readWrightControls,
  stepWrightFlyerSi,
  WRIGHT_COUPLING,
  WRIGHT_PATENT_ID,
  wrightSchematicPose,
} from "./wrightKernel";

describe("Wright Flyer 3-Axis Aerodynamics Kernel", () => {
  test("Claim 18 rudder linkage coupling ratio equals 0.45", () => {
    expect(WRIGHT_PATENT_ID).toBe("us-821393-wright-flyer");
    expect(WRIGHT_COUPLING).toBe(0.45);
    expect(coupledRudderDeg(10)).toBe(5); // round(10 * 0.45) = 5
    expect(coupledRudderDeg(20)).toBe(9); // round(20 * 0.45) = 9
  });

  test("readWrightControls automatically derives rudder deflection when coupled is true", () => {
    const coupled = readWrightControls({ airspeed: 28, wingWarp: 12, coupled: 1 });
    expect(coupled.coupled).toBe(true);
    expect(coupled.wingWarpDeg).toBe(12);
    expect(coupled.rudderDeg).toBe(5); // coupledRudderDeg(12) = 5

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
    expect(pose.adverse).toBe(false);

    const adversePose = wrightSchematicPose({ wingWarp: 10, rudder: 0, coupled: 0 });
    expect(adversePose.adverse).toBe(true);
  });
});
