import { describe, expect, test } from "bun:test";
import {
  DEFAULT_SIKORSKY_CONTROLS,
  INITIAL_SIKORSKY_STATE,
  readSikorskyControls,
  stepSikorskyHelicopterSi,
} from "./sikorskyHelicopterKernel";

describe("US 2,318,259 Igor Sikorsky Helicopter SI Physics Kernel", () => {
  test("maintains trim hover equilibrium at default controls", () => {
    const { state, metrics } = stepSikorskyHelicopterSi(
      INITIAL_SIKORSKY_STATE,
      DEFAULT_SIKORSKY_CONTROLS,
      0.016,
    );

    expect(state.rotorRpm).toBeGreaterThan(240);
    expect(state.rotorRpm).toBeLessThan(280);
    expect(state.tailRotorRpm).toBeCloseTo(state.rotorRpm * 5.0, 1);
    expect(metrics.mainRotorThrustNewtons).toBeGreaterThan(4500); // VS-300 weight ~5100 N
    expect(metrics.mainRotorThrustNewtons).toBeLessThan(7000);
    expect(metrics.tailRotorThrustNewtons).toBeGreaterThan(100);
    expect(metrics.tipSpeedMs).toBeGreaterThan(100);
    expect(metrics.tipMachNumber).toBeGreaterThan(0.3);
    expect(metrics.tipMachNumber).toBeLessThan(0.4);
    expect(Math.abs(metrics.netYawMomentNm)).toBeLessThan(50); // Near yaw balance
  });

  test("demonstrates collective-throttle mechanical correlation (Claim 1 & 9)", () => {
    // Low collective (5 deg) vs High collective (12 deg)
    const lowColl = readSikorskyControls({ collectivePitchDeg: 5.0, engineThrottlePercent: 70.0 });
    const highColl = readSikorskyControls({
      collectivePitchDeg: 12.0,
      engineThrottlePercent: 70.0,
    });

    const resLow = stepSikorskyHelicopterSi(INITIAL_SIKORSKY_STATE, lowColl, 0.05);
    const resHigh = stepSikorskyHelicopterSi(INITIAL_SIKORSKY_STATE, highColl, 0.05);

    expect(resHigh.metrics.effectiveThrottlePercent).toBeGreaterThan(
      resLow.metrics.effectiveThrottlePercent,
    );
    expect(resHigh.metrics.mainRotorThrustNewtons).toBeGreaterThan(
      resLow.metrics.mainRotorThrustNewtons,
    );
    expect(resHigh.metrics.mainRotorTorqueNm).toBeGreaterThan(resLow.metrics.mainRotorTorqueNm);
  });

  test("tail rotor rudder pedal modulates yaw acceleration and anti-torque (Claim 2 & 3)", () => {
    const leftPedal = readSikorskyControls({ tailRotorPedalPercent: -50.0 });
    const rightPedal = readSikorskyControls({ tailRotorPedalPercent: 50.0 });

    const resLeft = stepSikorskyHelicopterSi(INITIAL_SIKORSKY_STATE, leftPedal, 0.1);
    const resRight = stepSikorskyHelicopterSi(INITIAL_SIKORSKY_STATE, rightPedal, 0.1);

    expect(resRight.metrics.tailRotorThrustNewtons).toBeGreaterThan(
      resLeft.metrics.tailRotorThrustNewtons,
    );
    expect(resLeft.metrics.netYawMomentNm).toBeGreaterThan(resRight.metrics.netYawMomentNm);
  });

  test("sprag overrunning clutch disengages on engine shutdown for autorotation (Fig. 8)", () => {
    const engineOff = readSikorskyControls({ engineRunning: 0, collectivePitchDeg: 3.0 });
    const descendingState = {
      ...INITIAL_SIKORSKY_STATE,
      verticalVelocityMs: -8.0, // 8 m/s autorotative descent
      altitudeMeters: 100.0,
    };

    const { state, metrics } = stepSikorskyHelicopterSi(descendingState, engineOff, 0.1);

    expect(state.clutchEngaged).toBe(false);
    expect(metrics.autorotationState).toBe(true);
    expect(state.rotorRpm).toBeGreaterThan(150); // Airflow sustains rotor
  });
});
