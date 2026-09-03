import { beforeEach, describe, expect, test } from "bun:test";
import {
  createKamenInjectionTransportUpdater,
  getKamenInjectionTapeFrame,
  INITIAL_KAMEN_INJECTION_STATE,
  KAMEN_DISPLAY_FULL_TRAVEL_TURNS,
  KAMEN_INJECTION_DEFAULT_CONTROLS,
  readKamenInjectionControls,
  resetKamenInjectionTape,
  stepKamenInjectionMechanism,
} from "./kamenInjectionKernel";

describe("US 3,858,581 source-bounded counted screw kernel", () => {
  beforeEach(() => resetKamenInjectionTape());

  test("sanitizes the visitor controls without creating medical parameters", () => {
    const controls = readKamenInjectionControls({
      running: 0,
      displayTurnsPerSecond: 1_000,
      selectedPulseCount: 26.7,
      offIntervalDisplaySeconds: Number.NaN,
      clutchEngaged: 0,
      claim1PulseLoopPresent: 0,
    });
    expect(controls).toEqual({
      running: false,
      displayTurnsPerSecond: 12,
      selectedPulseCount: 27,
      offIntervalDisplaySeconds: 2.5,
      clutchEngaged: false,
      claim1PulseLoopPresent: false,
    });
    expect(Object.keys(controls)).not.toContain("dose");
    expect(Object.keys(controls)).not.toContain("pressure");
    expect(Object.keys(controls)).not.toContain("flowRate");
  });

  test("maps one complete driven screw turn to one pulse and uniform symbolic advance", () => {
    const controls = readKamenInjectionControls({
      ...KAMEN_INJECTION_DEFAULT_CONTROLS,
      displayTurnsPerSecond: 10,
    });
    const frame = stepKamenInjectionMechanism(INITIAL_KAMEN_INJECTION_STATE, controls, 0.1);
    expect(frame.state.motorRotorTurns).toBe(1);
    expect(frame.state.leadScrewTurns).toBe(1);
    expect(frame.state.followerTravelTurns).toBe(1);
    expect(frame.metrics.cyclePulseCount).toBe(1);
    expect(frame.metrics.strikerContactsSwitch).toBe(true);
    expect(frame.metrics.positionLaw).toContain("p remains symbolic");
    expect(frame.metrics.jointOwner).toContain("fs-mbd helical-joint");
  });

  test("stops on the selected pulse without a frame-rate overshoot", () => {
    const controls = readKamenInjectionControls({
      ...KAMEN_INJECTION_DEFAULT_CONTROLS,
      displayTurnsPerSecond: 12,
      selectedPulseCount: 3,
    });
    const almost = {
      ...INITIAL_KAMEN_INJECTION_STATE,
      motorRotorTurns: 2.9,
      leadScrewTurns: 2.9,
      cycleTurnCoordinate: 2.9,
      followerTravelTurns: 2.9,
    };
    const frame = stepKamenInjectionMechanism(almost, controls, 0.1);
    expect(frame.state.leadScrewTurns).toBe(3);
    expect(frame.state.followerTravelTurns).toBe(3);
    expect(frame.state.cycleTurnCoordinate).toBe(3);
    expect(frame.metrics.cyclePulseCount).toBe(3);
    expect(frame.state.controlPhase).toBe("motor-off");
    expect(frame.state.completedCycles).toBe(1);
  });

  test("holds the screw, striker, follower, and plunger while a released clutch lets the motor turn", () => {
    const controls = readKamenInjectionControls({
      ...KAMEN_INJECTION_DEFAULT_CONTROLS,
      clutchEngaged: false,
      displayTurnsPerSecond: 8,
    });
    const frame = stepKamenInjectionMechanism(INITIAL_KAMEN_INJECTION_STATE, controls, 0.1);
    expect(frame.state.motorRotorTurns).toBeCloseTo(0.8, 12);
    expect(frame.state.leadScrewTurns).toBe(0);
    expect(frame.state.followerTravelTurns).toBe(0);
    expect(frame.metrics.phase).toBe("clutch disengaged");
    expect(frame.metrics.leadScrewDriven).toBe(false);
  });

  test("does not pretend that an open-loop drive still produces counted control", () => {
    const controls = readKamenInjectionControls({
      ...KAMEN_INJECTION_DEFAULT_CONTROLS,
      claim1PulseLoopPresent: false,
      displayTurnsPerSecond: 8,
    });
    let frame = stepKamenInjectionMechanism(INITIAL_KAMEN_INJECTION_STATE, controls, 0.1);
    for (let index = 0; index < 80; index += 1) {
      frame = stepKamenInjectionMechanism(frame.state, controls, 0.1);
    }
    expect(frame.state.leadScrewTurns).toBeGreaterThan(60);
    expect(frame.metrics.cyclePulseCount).toBe(0);
    expect(frame.metrics.counterProgress).toBe(0);
    expect(frame.state.controlPhase).toBe("motor-on");
    expect(frame.metrics.phase).toBe("pulse loop withheld");
  });

  test("runs the separate oscillator interval and restarts at counter zero", () => {
    const controls = readKamenInjectionControls({
      ...KAMEN_INJECTION_DEFAULT_CONTROLS,
      displayTurnsPerSecond: 10,
      selectedPulseCount: 1,
      offIntervalDisplaySeconds: 0.5,
    });
    const stopped = stepKamenInjectionMechanism(INITIAL_KAMEN_INJECTION_STATE, controls, 0.1);
    expect(stopped.state.controlPhase).toBe("motor-off");
    expect(stopped.metrics.cyclePulseCount).toBe(1);
    let waiting = stopped;
    for (let index = 0; index < 4; index += 1) {
      waiting = stepKamenInjectionMechanism(waiting.state, controls, 0.1);
    }
    expect(waiting.state.controlPhase).toBe("motor-off");
    expect(waiting.state.leadScrewTurns).toBe(1);
    const restarted = stepKamenInjectionMechanism(waiting.state, controls, 0.1);
    expect(restarted.state.controlPhase).toBe("motor-on");
    expect(restarted.state.cycleTurnCoordinate).toBe(0);
    expect(restarted.metrics.cyclePulseCount).toBe(0);
  });

  test("halts at the normalized end-of-stroke boundary instead of wrapping the syringe", () => {
    const controls = readKamenInjectionControls({
      ...KAMEN_INJECTION_DEFAULT_CONTROLS,
      selectedPulseCount: 99,
      displayTurnsPerSecond: 12,
    });
    const almostFull = {
      ...INITIAL_KAMEN_INJECTION_STATE,
      motorRotorTurns: 80.9,
      leadScrewTurns: 80.9,
      cycleTurnCoordinate: 80.9,
      followerTravelTurns: 80.9,
    };
    const frame = stepKamenInjectionMechanism(almostFull, controls, 0.1);
    expect(frame.state.followerTravelTurns).toBe(KAMEN_DISPLAY_FULL_TRAVEL_TURNS);
    expect(frame.metrics.followerPositionNormalized).toBe(1);
    expect(frame.state.controlPhase).toBe("end-stop");
    const held = stepKamenInjectionMechanism(frame.state, controls, 0.1);
    expect(held.state.leadScrewTurns).toBe(frame.state.leadScrewTurns);
    expect(held.state.followerTravelTurns).toBe(frame.state.followerTravelTurns);
    expect(held.state.motorRotorTurns).toBe(frame.state.motorRotorTurns);
    expect(held.state.signalFlashRemainingSeconds).toBeLessThan(
      frame.state.signalFlashRemainingSeconds,
    );
  });

  test("publishes one shared fixed-step tape with host provenance and a refusal boundary", () => {
    const controls = readKamenInjectionControls(KAMEN_INJECTION_DEFAULT_CONTROLS);
    const updater = createKamenInjectionTransportUpdater(() => controls);
    const telemetry = updater({} as never, 1 / 60);
    const first = getKamenInjectionTapeFrame();
    expect(first?.state.leadScrewTurns).toBeGreaterThan(0);
    expect(telemetry?.machine?.modeLabel).toBe("motor-on / counting screw turns");
    expect(telemetry?.refusal).toMatchObject({ isRefused: true });
    updater({} as never, 1 / 60);
    expect(getKamenInjectionTapeFrame()?.state.leadScrewTurns).toBeGreaterThan(
      first?.state.leadScrewTurns ?? 0,
    );
  });
});
