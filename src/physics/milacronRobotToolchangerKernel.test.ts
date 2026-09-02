import { describe, expect, test } from "bun:test";
import {
  MILACRON_TOOLCHANGER_DEFAULT_CONTROLS,
  readMilacronToolchangerControls,
  stepMilacronRobotToolchanger,
  stepMilacronRobotToolchangerSi,
} from "./milacronRobotToolchangerKernel";

describe("US 4,512,709 Cincinnati Milacron Robot Toolchanger SI Physics Kernel", () => {
  test("computes pneumatic actuator thrust and wedging normal clamping force", () => {
    const controls = { ...MILACRON_TOOLCHANGER_DEFAULT_CONTROLS };
    const tel = stepMilacronRobotToolchangerSi(controls);

    expect(tel.actuatorThrustN).toBeGreaterThan(400); // 0.6 MPa * pi/4 * (0.032)^2 ~ 482 N
    expect(tel.clampingForceN).toBeGreaterThan(tel.actuatorThrustN); // Mechanical advantage of wedge
    expect(tel.isLocked).toBe(true);
    expect(tel.isToolSeated).toBe(true);
    expect(tel.isSelfLocking).toBe(true);
    expect(tel.positionalRepeatabilityMm).toBeLessThanOrEqual(0.025);
  });

  test("verifies bistable self-locking retention in event of power failure", () => {
    const controls = { ...MILACRON_TOOLCHANGER_DEFAULT_CONTROLS, wedgeAngleDeg: 6.0, frictionCoeff: 0.18 };
    const tel = stepMilacronRobotToolchangerSi(controls);

    expect(tel.isSelfLocking).toBe(true);
    expect(tel.holdingForceWithoutPowerN).toBeGreaterThan(0);
  });

  test("triggers refusal when wedge angle exceeds friction cone (non-bistable condition)", () => {
    const controls = { ...MILACRON_TOOLCHANGER_DEFAULT_CONTROLS, wedgeAngleDeg: 18.0, frictionCoeff: 0.10 };
    const tel = stepMilacronRobotToolchangerSi(controls);

    expect(tel.isSelfLocking).toBe(false);
    expect(tel.wedgeBackdriveRefusal).toBe(true);
    expect(tel.refusalReason).toContain("Non-bistable wedge geometry");
  });

  test("triggers refusal when pneumatic pressure is insufficient for tool payload", () => {
    const controls = { ...MILACRON_TOOLCHANGER_DEFAULT_CONTROLS, airPressureMpa: 0.20 };
    const tel = stepMilacronRobotToolchangerSi(controls);

    expect(tel.insufficientPressureRefusal).toBe(true);
    expect(tel.refusalReason).toContain("Insufficient pneumatic pressure");
  });

  test("triggers tool unseated refusal when docking gap exceeds proximity threshold", () => {
    const controls = { ...MILACRON_TOOLCHANGER_DEFAULT_CONTROLS, dockingGapMm: 2.5, slideStrokeMm: 15.0 };
    const tel = stepMilacronRobotToolchangerSi(controls);

    expect(tel.isToolSeated).toBe(false);
    expect(tel.toolUnseatedRefusal).toBe(true);
    expect(tel.refusalReason).toContain("Tool unseated fault");
  });

  test("evaluates stepMilacronRobotToolchanger wrapper with parameter dictionary", () => {
    const tel = stepMilacronRobotToolchanger({ airPressureMpa: 0.8, toolMassKg: 20 });
    expect(tel.actuatorThrustN).toBeGreaterThan(500);
    expect(tel.isLocked).toBe(true);
  });
});
