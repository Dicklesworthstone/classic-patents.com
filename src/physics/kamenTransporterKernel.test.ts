import { describe, expect, test } from "bun:test";
import {
  advanceKamenTransporterMotion,
  createKamenTransporterMotionState,
  KAMEN_TRANSPORTER_DEFAULT_CONTROLS,
  KAMEN_TRANSPORTER_SCENARIO_WHEEL_RADIUS_M,
} from "./kamenTransporterKernel";

describe("Kamen transporter fixed-step rolling state", () => {
  test("integrates the rolling phase exactly once from v / R", () => {
    const controls = {
      ...KAMEN_TRANSPORTER_DEFAULT_CONTROLS,
      operatingMode: "standard_4wheel" as const,
      velocityCommandMs: 2,
    };
    const dt = 1 / 60;
    const next = advanceKamenTransporterMotion(
      controls,
      createKamenTransporterMotionState(controls),
      dt,
    );

    expect(next.wheelRollAngleRad).toBeCloseTo(
      (next.telemetry.forwardVelocityMs / KAMEN_TRANSPORTER_SCENARIO_WHEEL_RADIUS_M) * dt,
      12,
    );
    expect(next.travelMeters).toBeCloseTo(next.telemetry.forwardVelocityMs * dt, 12);
  });

  test("preserves accumulated phase across a speed change instead of applying v squared", () => {
    const slow = {
      ...KAMEN_TRANSPORTER_DEFAULT_CONTROLS,
      operatingMode: "standard_4wheel" as const,
      velocityCommandMs: 1,
    };
    const fast = { ...slow, velocityCommandMs: 2 };
    const dt = 0.05;
    const first = advanceKamenTransporterMotion(slow, createKamenTransporterMotionState(slow), dt);
    const second = advanceKamenTransporterMotion(fast, first, dt);

    expect(second.wheelRollAngleRad - first.wheelRollAngleRad).toBeCloseTo(
      (second.telemetry.forwardVelocityMs / KAMEN_TRANSPORTER_SCENARIO_WHEEL_RADIUS_M) * dt,
      12,
    );
    expect(second.wheelRollAngleRad).toBeCloseTo(
      ((first.telemetry.forwardVelocityMs + second.telemetry.forwardVelocityMs) /
        KAMEN_TRANSPORTER_SCENARIO_WHEEL_RADIUS_M) *
        dt,
      12,
    );
  });

  test("holds the last legal rolling pose when the balance envelope refuses", () => {
    const legal = {
      ...KAMEN_TRANSPORTER_DEFAULT_CONTROLS,
      operatingMode: "balance_2wheel" as const,
      velocityCommandMs: 1,
    };
    const moving = advanceKamenTransporterMotion(
      legal,
      createKamenTransporterMotionState(legal),
      1 / 60,
    );
    const refused = advanceKamenTransporterMotion(
      { ...legal, riderPitchLeanDeg: -35 },
      moving,
      1 / 60,
    );

    expect(refused.telemetry.pitchRefusal).toBe(true);
    expect(refused.wheelRollAngleRad).toBe(moving.wheelRollAngleRad);
    expect(refused.travelMeters).toBe(moving.travelMeters);
  });
});
