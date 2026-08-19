import { describe, expect, test } from "bun:test";
import type { Quat } from "./lie";
import { identityAeroBody, stepWrightAeroBody, wrightAeroTorque } from "./wrightAeroBody";
import { stepWrightFlyerSi } from "./wrightKernel";

function computeQuatNorm(q: Quat): number {
  return Math.sqrt(q[0] * q[0] + q[1] * q[1] + q[2] * q[2] + q[3] * q[3]);
}

describe("Wright Flyer 6-DOF Aerodynamic Body (wrightAeroBody)", () => {
  const defaultControls = {
    airspeedMph: 28,
    wingWarpDeg: 0,
    rudderDeg: 0,
    elevatorDeg: 0,
    coupled: true,
  };

  test("identityAeroBody returns unit orientation and zero angular velocity", () => {
    const state = identityAeroBody();
    expect(state.quaternion).toEqual([1, 0, 0, 0]);
    expect(state.omega).toEqual([0, 0, 0]);
    expect(computeQuatNorm(state.quaternion)).toBeCloseTo(1.0, 5);
  });

  test("wrightAeroTorque computes restoring roll torque from wing warp", () => {
    const state = identityAeroBody();
    const controls = { ...defaultControls, wingWarpDeg: 8 };
    const si = stepWrightFlyerSi(controls);
    const torque = wrightAeroTorque(state, si, controls);

    // Positive wing warp commands a positive roll angle -> positive roll torque
    expect(torque[0]).toBeGreaterThan(0);
  });

  test("wrightAeroTorque computes restoring pitch torque from canard elevator deflection", () => {
    const state = identityAeroBody();
    const controls = { ...defaultControls, elevatorDeg: 5 };
    const si = stepWrightFlyerSi(controls);
    const torque = wrightAeroTorque(state, si, controls);

    // Upward canard elevator produces negative pitch torque in body axes
    expect(torque[2]).toBeLessThan(0);
  });

  test("stepWrightAeroBody steps flyer orientation forward deterministically and preserves unit quaternion", () => {
    let state = identityAeroBody();
    const controls = {
      airspeedMph: 28,
      wingWarpDeg: 5,
      rudderDeg: -3,
      elevatorDeg: 2,
      coupled: true,
    };
    const si = stepWrightFlyerSi(controls);

    for (let i = 0; i < 60; i++) {
      state = stepWrightAeroBody(state, si, controls, 0.016);
      expect(Number.isFinite(state.quaternion[0])).toBe(true);
      expect(Number.isFinite(state.omega[0])).toBe(true);
      expect(computeQuatNorm(state.quaternion)).toBeCloseTo(1.0, 4);
    }

    // State should have evolved away from identity
    expect(state.quaternion[0]).not.toBe(1.0);
  });
});
