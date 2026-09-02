import { describe, expect, test } from "bun:test";
import {
  KAMEN_SEGWAY_DEFAULT_CONTROLS,
  readKamenSegwayControls,
  stepKamenSegwaySi,
} from "./kamenSegwayKernel";

describe("US 6,302,230 Dean Kamen Segway Self-Balancing Transporter Physics Kernel", () => {
  test("computes genuine inverted-pendulum restoring torque and forward speed for default controls", () => {
    const controls = KAMEN_SEGWAY_DEFAULT_CONTROLS;
    const tel = stepKamenSegwaySi(controls);

    expect(tel.velocityMS).toBeGreaterThan(1.0);
    expect(tel.velocityKmh).toBeGreaterThan(3.6);
    expect(tel.gravityOverturningTorqueNm).toBeGreaterThan(50.0);
    expect(tel.motorTorqueNm).toBeGreaterThan(60.0);
    expect(tel.balancingMarginRatio).toBeGreaterThan(0.3);
    expect(tel.balancingMarginRatio).toBeLessThan(1.0);
    expect(tel.tractionLossRefusal).toBe(false);
    expect(tel.pitchOverturnRefusal).toBe(false);
    expect(tel.refusalReason).toBeNull();
  });

  test("triggers speed pushback and ripple alarm when approaching maximum operating velocity", () => {
    const highPitchControls = {
      ...KAMEN_SEGWAY_DEFAULT_CONTROLS,
      riderPitchDeg: 14.5,
    };
    const tel = stepKamenSegwaySi(highPitchControls);

    expect(tel.speedPushbackActive).toBe(true);
    expect(tel.pitchPushbackDeg).toBeGreaterThan(0.0);
    expect(tel.tactileAlarmActive).toBe(true);
    expect(tel.rippleAlarmAmplitudeNm).toBeGreaterThan(5.0);
  });

  test("refuses computation when wheel traction limit is exceeded on low-friction surface", () => {
    const icyGroundControls = {
      ...KAMEN_SEGWAY_DEFAULT_CONTROLS,
      riderPitchDeg: 12.0,
      groundFrictionCoeff: 0.1, // Icy surface
    };
    const tel = stepKamenSegwaySi(icyGroundControls);

    expect(tel.tractionLossRefusal).toBe(true);
    expect(tel.refusalReason).toContain("Wheel traction lost");
  });

  test("refuses computation when pitch lean angle exceeds recovery envelope", () => {
    const overturnControls = {
      ...KAMEN_SEGWAY_DEFAULT_CONTROLS,
      riderPitchDeg: 22.0, // Excessive lean
    };
    const tel = stepKamenSegwaySi(overturnControls);

    expect(tel.pitchOverturnRefusal).toBe(true);
    expect(tel.refusalReason).toContain("Pitch angle");
    expect(tel.refusalReason).toContain("exceeds recovery envelope");
  });

  test("reads and validates control overrides correctly", () => {
    const params = {
      riderPitchDeg: -3.5,
      steeringInput: 0.75,
      riderMassKg: 90,
      groundFrictionCoeff: 0.7,
      speedLimitMS: 4.8,
    };
    const controls = readKamenSegwayControls(params);

    expect(controls.riderPitchDeg).toBe(-3.5);
    expect(controls.steeringInput).toBe(0.75);
    expect(controls.riderMassKg).toBe(90);
    expect(controls.groundFrictionCoeff).toBe(0.7);
    expect(controls.speedLimitMS).toBe(4.8);

    const tel = stepKamenSegwaySi(controls);
    expect(tel.velocityMS).toBeLessThan(0); // Reversing
    expect(tel.leftMotorTorqueNm).toBeLessThan(tel.rightMotorTorqueNm); // Yaw steering differential
  });
});
