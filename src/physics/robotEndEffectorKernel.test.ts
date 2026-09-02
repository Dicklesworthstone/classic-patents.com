import { describe, expect, test } from "bun:test";
import {
  GEAR_RATIO,
  MAX_RATED_GRIP_FORCE_N,
  MAX_TRAVEL_SPEED_MM_S,
  ROBOT_END_EFFECTOR_DEFAULTS,
  SCREW_EFFICIENCY,
  SCREW_LEAD_M,
  readRobotEndEffectorControls,
  stepRobotEndEffectorSi,
} from "./robotEndEffectorKernel";

describe("US 4,765,668 Slocum Robot End Effector SI Physics Kernel", () => {
  test("computes symmetrical hand kinematics and center-point repeatability", () => {
    const controls = { ...ROBOT_END_EFFECTOR_DEFAULTS, jawSpanMm: 80.0 };
    const tel = stepRobotEndEffectorSi(controls);

    expect(tel.leftHandPositionMm).toBe(-40.0);
    expect(tel.rightHandPositionMm).toBe(40.0);
    expect(tel.leftHandPositionMm + tel.rightHandPositionMm).toBe(0.0);
    expect(tel.centerPointRepeatabilityMm).toBeLessThanOrEqual(0.05);
    expect(tel.centerPointRepeatabilityMm).toBeGreaterThan(0.0);
  });

  test("calculates ball-screw mechanical advantage and clamping force accurately", () => {
    const controls = { ...ROBOT_END_EFFECTOR_DEFAULTS, motorTorqueNm: 1.0 };
    const tel = stepRobotEndEffectorSi(controls);

    // Expected mechanical advantage = 2 * pi * 0.90 / 0.005 ≈ 1130.97 m^-1
    const expectedAdvantage = (2 * Math.PI * SCREW_EFFICIENCY) / SCREW_LEAD_M;
    expect(tel.mechanicalAdvantageM_1).toBeCloseTo(expectedAdvantage, 2);

    // Clamping force = tau_motor * N_gear * mechanicalAdvantage
    const expectedClampingForce = 1.0 * GEAR_RATIO * expectedAdvantage;
    expect(tel.clampingForceN).toBeCloseTo(expectedClampingForce, 1);
    expect(tel.clampingForceN).toBeLessThanOrEqual(MAX_RATED_GRIP_FORCE_N);
  });

  test("enforces physical speed limits and gear reduction", () => {
    const controls = { ...ROBOT_END_EFFECTOR_DEFAULTS, motorRpm: 1200 };
    const tel = stepRobotEndEffectorSi(controls);

    expect(tel.screwRpm).toBeCloseTo(1200 / GEAR_RATIO, 1);
    expect(tel.relativeClosingSpeedMmS).toBeLessThanOrEqual(MAX_TRAVEL_SPEED_MM_S);
  });

  test("verifies back-driving torque requirement for non-locking ball screw", () => {
    const controls = { ...ROBOT_END_EFFECTOR_DEFAULTS, motorTorqueNm: 1.2 };
    const tel = stepRobotEndEffectorSi(controls);

    expect(tel.backDriveHoldingTorqueNm).toBeGreaterThan(0.5);
    expect(tel.mechanicalPowerW).toBeGreaterThan(0);
  });
});
