import { describe, expect, test } from "bun:test";
import {
  DEFAULT_SIKORSKY_CONTROLS,
  INITIAL_SIKORSKY_STATE,
  readSikorskyControls,
  SIKORSKY_SOURCE_BOUNDARY,
  stepSikorskyHelicopterSi,
} from "./sikorskyHelicopterKernel";

describe("US 2,318,259 Igor Sikorsky Helicopter SI Physics Kernel", () => {
  test("keeps the labelled scenario trim inside a bounded multi-second hover envelope", () => {
    const { state: firstState, metrics } = stepSikorskyHelicopterSi(
      INITIAL_SIKORSKY_STATE,
      DEFAULT_SIKORSKY_CONTROLS,
      0.016,
    );

    expect(firstState.rotorRpm).toBeGreaterThan(240);
    expect(firstState.rotorRpm).toBeLessThan(280);
    expect(firstState.tailRotorRpm).toBeCloseTo(firstState.rotorRpm * 5.0, 1);
    expect(metrics.mainRotorThrustNewtons).toBeGreaterThan(4500); // VS-300 weight ~5100 N
    expect(metrics.mainRotorThrustNewtons).toBeLessThan(7000);
    expect(metrics.tailRotorThrustNewtons).toBeGreaterThan(100);
    expect(metrics.tipSpeedMs).toBeGreaterThan(100);
    expect(metrics.tipMachNumber).toBeGreaterThan(0.3);
    expect(metrics.tipMachNumber).toBeLessThan(0.4);
    expect(Math.abs(metrics.netYawMomentNm)).toBeLessThan(50); // Near yaw balance

    let state = INITIAL_SIKORSKY_STATE;
    for (let tick = 0; tick < 300; tick++) {
      state = stepSikorskyHelicopterSi(state, DEFAULT_SIKORSKY_CONTROLS, 1 / 60).state;
    }
    expect(state.altitudeMeters).toBeGreaterThan(4);
    expect(state.altitudeMeters).toBeLessThan(6);
    expect(Math.abs(state.verticalVelocityMs)).toBeLessThan(0.3);
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

  test("makes the Claim 1 linkage change the scenario rather than acting as a decorative toggle", () => {
    const linked = readSikorskyControls({
      collectivePitchDeg: 12,
      engineThrottlePercent: 50,
      collectiveThrottleLinked: 1,
    });
    const unlinked = readSikorskyControls({
      collectivePitchDeg: 12,
      engineThrottlePercent: 50,
      collectiveThrottleLinked: 0,
    });
    const linkedStep = stepSikorskyHelicopterSi(INITIAL_SIKORSKY_STATE, linked, 0.1);
    const unlinkedStep = stepSikorskyHelicopterSi(INITIAL_SIKORSKY_STATE, unlinked, 0.1);

    expect(linkedStep.metrics.effectiveThrottlePercent).toBeGreaterThan(
      unlinkedStep.metrics.effectiveThrottlePercent,
    );
    expect(linkedStep.state.rotorRpm).toBeGreaterThan(unlinkedStep.state.rotorRpm);
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

  test("makes the Claim 2 auxiliary-rotor inversion remove its drive and anti-torque action", () => {
    const disabled = readSikorskyControls({ auxiliaryRotorEnabled: 0 });
    const { state, metrics } = stepSikorskyHelicopterSi(INITIAL_SIKORSKY_STATE, disabled, 0.1);

    expect(state.tailRotorRpm).toBe(0);
    expect(metrics.tailRotorThrustNewtons).toBe(0);
    expect(metrics.netYawMomentNm).toBeCloseTo(metrics.mainRotorTorqueNm, 10);
  });

  test("permits physically signed fore and aft motion instead of clamping reverse flight to zero", () => {
    const forward = readSikorskyControls({ cyclicPitchForwardDeg: 10 });
    const aft = readSikorskyControls({ cyclicPitchForwardDeg: -10 });
    const forwardStep = stepSikorskyHelicopterSi(INITIAL_SIKORSKY_STATE, forward, 0.1);
    const aftStep = stepSikorskyHelicopterSi(INITIAL_SIKORSKY_STATE, aft, 0.1);

    expect(forwardStep.state.forwardVelocityMs).toBeGreaterThan(0);
    expect(aftStep.state.forwardVelocityMs).toBeLessThan(0);
  });

  test("source-disclosed one-way drive opens on engine shutdown in the autorotation scenario", () => {
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

  test("fails closed to finite bounded controls and deterministic state for malformed inputs", () => {
    const controls = readSikorskyControls({
      collectivePitchDeg: Number.NaN,
      cyclicPitchForwardDeg: Number.POSITIVE_INFINITY,
      cyclicRollRightDeg: "not-a-number",
      engineRunning: "0",
      collectiveThrottleLinked: "false",
    });
    expect(controls.collectivePitchDeg).toBe(DEFAULT_SIKORSKY_CONTROLS.collectivePitchDeg);
    expect(controls.cyclicPitchForwardDeg).toBe(DEFAULT_SIKORSKY_CONTROLS.cyclicPitchForwardDeg);
    expect(controls.cyclicRollRightDeg).toBe(DEFAULT_SIKORSKY_CONTROLS.cyclicRollRightDeg);
    expect(controls.engineRunning).toBe(0);
    expect(controls.collectiveThrottleLinked).toBe(0);

    const malformedState = {
      ...INITIAL_SIKORSKY_STATE,
      rotorPhaseRad: Number.NaN,
      tailRotorPhaseRad: Number.POSITIVE_INFINITY,
      altitudeMeters: Number.NaN,
    };
    const first = stepSikorskyHelicopterSi(malformedState, controls, Number.NaN);
    const replay = stepSikorskyHelicopterSi(malformedState, controls, Number.NaN);
    expect(first).toEqual(replay);
    for (const value of [...Object.values(first.state), ...Object.values(first.metrics)]) {
      if (typeof value === "number") expect(Number.isFinite(value)).toBe(true);
    }
  });

  test("publishes an explicit quantitative source boundary", () => {
    expect(SIKORSKY_SOURCE_BOUNDARY.isRefused).toBe(true);
    expect(SIKORSKY_SOURCE_BOUNDARY.reason).toContain("no aircraft mass");
    expect(SIKORSKY_SOURCE_BOUNDARY.reason).toContain("not historical VS-300 measurements");
  });
});
