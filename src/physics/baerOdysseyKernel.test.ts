import { describe, expect, test } from "bun:test";
import {
  DEFAULT_BAER_CONTROLS,
  INITIAL_BAER_STATE,
  readBaerControls,
  stepBaerOdysseySi,
} from "./baerOdysseyKernel";

describe("Ralph H. Baer US 3,728,480 Magnavox Odyssey SI Physics Kernel", () => {
  test("initializes default controls and clamps input boundaries", () => {
    const defaultControls = readBaerControls();
    expect(defaultControls.player1PotX).toBeCloseTo(0.15, 2);
    expect(defaultControls.player1PotY).toBeCloseTo(0.5, 2);
    expect(defaultControls.rfChannel).toBe(3);

    const clamped = readBaerControls({
      player1PotX: -5.0,
      player2PotX: 10.0,
      englishControl: 99.0,
      ballSpeedMultiplier: -1.0,
    });
    expect(clamped.player1PotX).toBe(0.05);
    expect(clamped.player2PotX).toBe(0.95);
    expect(clamped.englishControl).toBe(1.0);
    expect(clamped.ballSpeedMultiplier).toBe(0.2);
  });

  test("calculates NTSC raster timing and RC spot delay metrics in SI units", () => {
    const { metrics } = stepBaerOdysseySi(INITIAL_BAER_STATE, DEFAULT_BAER_CONTROLS, 0.016);
    expect(metrics.horizontalSyncFreqHz).toBe(15750);
    expect(metrics.horizontalPeriodMicrosec).toBeCloseTo(63.49, 1);
    expect(metrics.verticalFreqHz).toBe(60.0);
    expect(metrics.verticalPeriodMs).toBeCloseTo(16.67, 1);
    expect(metrics.chromaSubcarrierFreqMHz).toBeCloseTo(3.579545, 4);
    expect(metrics.rfCarrierFreqMHz).toBe(61.25); // Ch 3
    expect(metrics.rfAntennaPowerNanoWatts).toBeGreaterThan(50);
    expect(metrics.p1DelayHMicrosec).toBeGreaterThan(9.0);
    expect(metrics.p1DelayHMicrosec).toBeLessThan(57.0);
    expect(metrics.p1DelayVMs).toBeGreaterThan(1.5);
    expect(metrics.p1DelayVMs).toBeLessThan(15.5);
  });

  test("detects paddle collision coincidence and reflects ball horizontal velocity", () => {
    // Position ball right on Player 1 paddle moving left
    const testState = {
      ...INITIAL_BAER_STATE,
      ballX: 0.15,
      ballY: 0.5,
      ballVx: -0.5,
      ballVy: 0.0,
    };
    const controls = {
      ...DEFAULT_BAER_CONTROLS,
      player1PotX: 0.15,
      player1PotY: 0.5,
    };

    const result = stepBaerOdysseySi(testState, controls, 0.016);
    expect(result.metrics.coincidenceActive).toBe(true);
    expect(result.state.ballVx).toBeGreaterThan(0); // Bounced right
  });

  test("detects light gun alignment and triggers target extinction on trigger pull", () => {
    const testState = {
      ...INITIAL_BAER_STATE,
      targetExtinct: false,
      targetHitCount: 0,
    };
    const controls = {
      ...DEFAULT_BAER_CONTROLS,
      player2PotX: 0.8,
      player2PotY: 0.4,
      lightGunAimX: 0.8,
      lightGunAimY: 0.4,
      lightGunTrigger: true,
    };

    const result = stepBaerOdysseySi(testState, controls, 0.016);
    expect(result.metrics.lightGunCoincidence).toBe(true);
    expect(result.state.targetExtinct).toBe(true);
    expect(result.state.targetHitCount).toBe(1);
    expect(result.metrics.targetVisible).toBe(false);

    // Reset button restores target
    const resetControls = {
      ...controls,
      lightGunTrigger: false,
      resetButton: true,
    };
    const resetResult = stepBaerOdysseySi(result.state, resetControls, 0.016);
    expect(resetResult.state.targetExtinct).toBe(false);
    expect(resetResult.metrics.targetVisible).toBe(true);
  });

  test("replays every post-score serve from the scored game state without ambient randomness", () => {
    const pointForPlayerOne = {
      ...INITIAL_BAER_STATE,
      ballX: 1.02,
      ballY: 0.5,
      ballVx: 0.45,
      ballVy: 0.18,
    };
    const pointForPlayerTwo = {
      ...INITIAL_BAER_STATE,
      ballX: -0.02,
      ballY: 0.5,
      ballVx: -0.45,
      ballVy: 0.18,
    };

    const firstReplay = stepBaerOdysseySi(pointForPlayerOne, DEFAULT_BAER_CONTROLS, 0.016);
    const secondReplay = stepBaerOdysseySi(pointForPlayerOne, DEFAULT_BAER_CONTROLS, 0.016);
    const oppositePoint = stepBaerOdysseySi(pointForPlayerTwo, DEFAULT_BAER_CONTROLS, 0.016);

    expect(firstReplay).toEqual(secondReplay);
    expect(firstReplay.state.scoreP1).toBe(1);
    expect(firstReplay.state.ballVx).toBeLessThan(0);
    expect(firstReplay.state.ballVy).toBeGreaterThanOrEqual(-0.15);
    expect(firstReplay.state.ballVy).toBeLessThanOrEqual(0.15);
    expect(oppositePoint.state.scoreP2).toBe(1);
    expect(oppositePoint.state.ballVx).toBeGreaterThan(0);
    expect(oppositePoint.state.ballVy).not.toBe(firstReplay.state.ballVy);
  });
});
