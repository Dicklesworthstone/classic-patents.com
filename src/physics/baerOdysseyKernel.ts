/**
 * SI Physics & Electronic Timing Kernel for US 3,728,480:
 * Ralph H. Baer — Television Gaming and Training Apparatus
 *
 * Models:
 * 1. NTSC standard raster horizontal (15.75 kHz) and vertical (60 Hz) astable multivibrators.
 * 2. Monostable RC time-delay spot synthesis and coordinate translation.
 * 3. Diode AND-matrix spot slicing (pulse width & height).
 * 4. Diode coincidence detection and latched SCR extinction of a generated dot.
 * 5. Optical light gun photodetector coincidence and SCR crowbar target extinction.
 *
 * The later-game moving-dot tape remains available to the legacy 2D teaching
 * face, but is deliberately kept separate from the source Claim 1 topology.
 * No RF output power is inferred because the grant supplies neither terminal
 * voltage nor load impedance.
 */

import type { TapeUpdater } from "./useFrankenSimPhysics";

export interface BaerOdysseyControls {
  /** Shared transport run state; false freezes physical time and pose. */
  running: boolean;
  /** Claim 1 control-unit/synchronization/manipulation/coupling topology. */
  claim1Active: boolean;
  /** Player 1 Horizontal Potentiometer (0 to 1) */
  player1PotX: number;
  /** Player 1 Vertical Potentiometer (0 to 1) */
  player1PotY: number;
  /** Player 2 Horizontal Potentiometer (0 to 1) */
  player2PotX: number;
  /** Player 2 Vertical Potentiometer (0 to 1) */
  player2PotY: number;
  /** English / Spin potentiometer adjustment (-1 to 1) */
  englishControl: number;
  /** Ball horizontal velocity speed multiplier (0.5 to 2.5) */
  ballSpeedMultiplier: number;
  /** Active VHF Channel selection (3 or 4) */
  rfChannel: 3 | 4;
  /** Chroma phase angle in degrees for color background (0 to 180 deg) */
  chromaPhaseDeg: number;
  /** Light gun trigger depressed state */
  lightGunTrigger: boolean;
  /** Light gun aim azimuth X on CRT screen (0 to 1) */
  lightGunAimX: number;
  /** Light gun aim altitude Y on CRT screen (0 to 1) */
  lightGunAimY: number;
  /** Reset switch momentary trigger */
  resetButton: boolean;
}

export interface BaerOdysseyState {
  timeSeconds: number;
  ballX: number;
  ballY: number;
  ballVx: number;
  ballVy: number;
  scoreP1: number;
  scoreP2: number;
  targetHitCount: number;
  targetExtinct: boolean;
  targetExtinctTimer: number;
  lastCoincidenceTime: number;
}

export interface BaerOdysseyMetrics {
  /** Horizontal sync frequency (Hz) ~ 15,750 Hz */
  horizontalSyncFreqHz: number;
  /** Horizontal line sweep period (microsec) ~ 63.49 us */
  horizontalPeriodMicrosec: number;
  /** Vertical field frequency (Hz) ~ 60.0 Hz */
  verticalFreqHz: number;
  /** Vertical field period (ms) ~ 16.67 ms */
  verticalPeriodMs: number;
  /** Player 1 Horizontal RC delay (microsec) [9.0 to 57.0 us] */
  p1DelayHMicrosec: number;
  /** Player 1 Vertical RC delay (ms) [1.5 to 15.5 ms] */
  p1DelayVMs: number;
  /** Player 2 Horizontal RC delay (microsec) [9.0 to 57.0 us] */
  p2DelayHMicrosec: number;
  /** Player 2 Vertical RC delay (ms) [1.5 to 15.5 ms] */
  p2DelayVMs: number;
  /** Player 1 screen X coordinate [0 to 1] */
  p1X: number;
  /** Player 1 screen Y coordinate [0 to 1] */
  p1Y: number;
  /** Player 2 screen X coordinate [0 to 1] */
  p2X: number;
  /** Player 2 screen Y coordinate [0 to 1] */
  p2Y: number;
  /** Ball screen X coordinate [0 to 1] */
  ballX: number;
  /** Ball screen Y coordinate [0 to 1] */
  ballY: number;
  /** Ball horizontal velocity (screen units / s) */
  ballVx: number;
  /** Ball vertical velocity (screen units / s) */
  ballVy: number;
  /** Instantaneous source-dot coincidence active. */
  coincidenceActive: boolean;
  /** Instantaneous overlap of source dots 20 and 20-1. */
  dotCoincidenceActive: boolean;
  /** First source dot remains driven unless the SCR crowbar latch is set. */
  firstDotVisible: boolean;
  /** Second source dot remains driven while Claim 1 topology is present. */
  secondDotVisible: boolean;
  /** Whether Claim 1's complete local signal path is represented. */
  claim1TopologyActive: boolean;
  /** Whether generated signals remain coupled to receiver 10. */
  directCouplingActive: boolean;
  /** Light gun alignment optical coincidence active */
  lightGunCoincidence: boolean;
  /** Target dot active on CRT (false if extinguished by hit) */
  targetVisible: boolean;
  /** RF Carrier Frequency (MHz) ~ 61.25 MHz (Ch 3) or 67.25 MHz (Ch 4) */
  rfCarrierFreqMHz: number;
  /** Refused RF terminal-power slot; always zero because the grant omits its inputs. */
  rfAntennaPowerNanoWatts: number;
  /** Chroma Subcarrier Frequency (MHz) ~ 3.579545 MHz */
  chromaSubcarrierFreqMHz: number;
  /** Composite Video Amplitude (V_pp) ~ 1.0 V */
  compositeVideoVoltageV: number;
}

export const DEFAULT_BAER_CONTROLS: BaerOdysseyControls = {
  running: true,
  claim1Active: true,
  player1PotX: 0.25,
  player1PotY: 0.5,
  player2PotX: 0.75,
  player2PotY: 0.5,
  englishControl: 0.0,
  ballSpeedMultiplier: 1.0,
  rfChannel: 3,
  chromaPhaseDeg: 45.0,
  lightGunTrigger: false,
  lightGunAimX: 0.5,
  lightGunAimY: 0.5,
  resetButton: false,
};

export const INITIAL_BAER_STATE: BaerOdysseyState = {
  timeSeconds: 0,
  ballX: 0.5,
  ballY: 0.5,
  ballVx: 0.45,
  ballVy: 0.18,
  scoreP1: 0,
  scoreP2: 0,
  targetHitCount: 0,
  targetExtinct: false,
  targetExtinctTimer: 0,
  lastCoincidenceTime: -1,
};

// Physical / Electrical Constants
const F_H = 15750.0; // Hz
const T_H_US = (1.0 / F_H) * 1e6; // 63.492 microseconds
const F_V = 60.0; // Hz
const T_V_MS = (1.0 / F_V) * 1e3; // 16.667 ms
const CHROMA_F_MHZ = 3.579545; // MHz NTSC color burst
const DELAY_H_MIN_US = 9.0;
const DELAY_H_MAX_US = 57.0;
const DELAY_V_MIN_MS = 1.5;
const DELAY_V_MAX_MS = 15.5;

const PADDLE_HALF_WIDTH = 0.025;
const PADDLE_HALF_HEIGHT = 0.08;
const BALL_HALF_SIZE = 0.02;

/**
 * The original Odyssey has no stochastic game controller. The reader-facing
 * ball serve is therefore a deterministic display convention: it derives a
 * small vertical deflection from the post-score game state instead of taking
 * entropy from the browser. That keeps identical replay tapes bit-for-bit
 * repeatable while still avoiding an identical horizontal return after every
 * point.
 */
function deterministicServeVerticalVelocity(
  scoreP1: number,
  scoreP2: number,
  scoringPlayer: 1 | 2,
): number {
  const stateSeed =
    (Math.imul(scoreP1 + 1, 1103515245) ^
      Math.imul(scoreP2 + 1, 214013) ^
      Math.imul(scoringPlayer, 2531011) ^
      0x0372_8480) >>
    0;
  const nextSeed = (Math.imul(stateSeed, 1664525) + 1013904223) >>> 0;
  return (nextSeed / 0x1_0000_0000 - 0.5) * 0.3;
}

export function readBaerControls(
  raw?: Partial<BaerOdysseyControls> | Readonly<Record<string, number>>,
): BaerOdysseyControls {
  const p = raw as Record<string, any> | undefined;
  return {
    running: p?.running === undefined ? DEFAULT_BAER_CONTROLS.running : Boolean(p.running),
    claim1Active:
      p?.claim1Active === undefined ? DEFAULT_BAER_CONTROLS.claim1Active : Boolean(p.claim1Active),
    player1PotX: Math.max(
      0.05,
      Math.min(
        0.95,
        p?.player1PotX ??
          p?.p1X ??
          p?.p1PotX ??
          p?.dot1X ??
          p?.knob17 ??
          p?.player1X ??
          DEFAULT_BAER_CONTROLS.player1PotX,
      ),
    ),
    player1PotY: Math.max(
      0.05,
      Math.min(
        0.95,
        p?.player1PotY ??
          p?.p1Y ??
          p?.p1PotY ??
          p?.dot1Y ??
          p?.knob16 ??
          p?.player1Y ??
          DEFAULT_BAER_CONTROLS.player1PotY,
      ),
    ),
    player2PotX: Math.max(
      0.05,
      Math.min(
        0.95,
        p?.player2PotX ??
          p?.p2X ??
          p?.p2PotX ??
          p?.dot2X ??
          p?.knob17Sub1 ??
          p?.player2X ??
          DEFAULT_BAER_CONTROLS.player2PotX,
      ),
    ),
    player2PotY: Math.max(
      0.05,
      Math.min(
        0.95,
        p?.player2PotY ??
          p?.p2Y ??
          p?.p2PotY ??
          p?.dot2Y ??
          p?.knob16Sub1 ??
          p?.player2Y ??
          DEFAULT_BAER_CONTROLS.player2PotY,
      ),
    ),
    englishControl: Math.max(
      -1.0,
      Math.min(
        1.0,
        p?.englishControl ??
          p?.english ??
          p?.spin ??
          p?.spinPot ??
          p?.englishSpin ??
          DEFAULT_BAER_CONTROLS.englishControl,
      ),
    ),
    ballSpeedMultiplier: Math.max(
      0.2,
      Math.min(
        3.0,
        p?.ballSpeedMultiplier ??
          p?.ballSpeed ??
          p?.speedMultiplier ??
          p?.speed ??
          DEFAULT_BAER_CONTROLS.ballSpeedMultiplier,
      ),
    ),
    rfChannel: (p?.rfChannel ?? p?.channel ?? p?.vhfChannel ?? p?.ch) === 4 ? 4 : 3,
    chromaPhaseDeg: Math.max(
      0,
      Math.min(
        180,
        p?.chromaPhaseDeg ??
          p?.chromaPhase ??
          p?.chroma ??
          p?.huePhase ??
          p?.colorPhase ??
          DEFAULT_BAER_CONTROLS.chromaPhaseDeg,
      ),
    ),
    lightGunTrigger: Boolean(p?.lightGunTrigger),
    lightGunAimX: Math.max(0, Math.min(1, p?.lightGunAimX ?? DEFAULT_BAER_CONTROLS.lightGunAimX)),
    lightGunAimY: Math.max(0, Math.min(1, p?.lightGunAimY ?? DEFAULT_BAER_CONTROLS.lightGunAimY)),
    resetButton: Boolean(p?.resetButton),
  };
}

export function stepBaerOdysseySi(
  state: BaerOdysseyState,
  controls: BaerOdysseyControls,
  dtSeconds: number,
): { state: BaerOdysseyState; metrics: BaerOdysseyMetrics } {
  const dt = controls.running && controls.claim1Active ? Math.max(0, Math.min(0.1, dtSeconds)) : 0;
  const time = state.timeSeconds + dt;

  let ballX = state.ballX;
  let ballY = state.ballY;
  let ballVx = state.ballVx;
  let ballVy = state.ballVy;
  let scoreP1 = state.scoreP1;
  let scoreP2 = state.scoreP2;
  let targetHitCount = state.targetHitCount;
  let targetExtinct = state.targetExtinct;
  let targetExtinctTimer = state.targetExtinctTimer;
  let lastCoincidenceTime = state.lastCoincidenceTime;

  // Handle Reset button
  if (controls.resetButton) {
    targetExtinct = false;
    targetExtinctTimer = 0;
  }

  // Calculate generated-dot positions from the source RC controls.
  const p1X = controls.player1PotX;
  const p1Y = controls.player1PotY;
  const p2X = controls.player2PotX;
  const p2Y = controls.player2PotY;

  // Step ball position
  const currentSpeed = 0.5 * controls.ballSpeedMultiplier;
  ballX += ballVx * currentSpeed * dt * 2.0;
  ballY += ballVy * currentSpeed * dt * 2.0;

  // Top / Bottom wall bounces
  if (ballY <= 0.05) {
    ballY = 0.05;
    ballVy = Math.abs(ballVy);
  } else if (ballY >= 0.95) {
    ballY = 0.95;
    ballVy = -Math.abs(ballVy);
  }

  // Figure 5E coincidence is overlap of the two generated rectangular dots,
  // not a later Pong-style paddle/ball collision. The SCR crowbar latches the
  // first dot generator off until switch 26 is operated after separation.
  const dotCoincidenceActive =
    controls.claim1Active &&
    Math.abs(p1X - p2X) <= PADDLE_HALF_WIDTH * 2 &&
    Math.abs(p1Y - p2Y) <= PADDLE_HALF_HEIGHT * 2;
  const coincidenceActive = dotCoincidenceActive;
  if (dotCoincidenceActive && !targetExtinct) {
    targetExtinct = true;
    targetExtinctTimer = 0;
    lastCoincidenceTime = time;
  }

  // Preserve the optional moving-dot demonstration tape used by the 2D
  // teaching face, but do not call those bounces the patent's coincidence
  // detector. The source 3D apparatus projects only dots 20 and 20-1.
  const p1DistX = Math.abs(ballX - p1X);
  const p1DistY = Math.abs(ballY - p1Y);
  if (
    p1DistX <= PADDLE_HALF_WIDTH + BALL_HALF_SIZE &&
    p1DistY <= PADDLE_HALF_HEIGHT + BALL_HALF_SIZE
  ) {
    if (ballVx < 0) {
      ballVx = Math.abs(ballVx);
      // Add English spin deflection
      const offset = (ballY - p1Y) / PADDLE_HALF_HEIGHT;
      ballVy = offset * 0.4 + controls.englishControl * 0.25;
    }
  }

  // Check Player 2 paddle coincidence
  const p2DistX = Math.abs(ballX - p2X);
  const p2DistY = Math.abs(ballY - p2Y);
  if (
    p2DistX <= PADDLE_HALF_WIDTH + BALL_HALF_SIZE &&
    p2DistY <= PADDLE_HALF_HEIGHT + BALL_HALF_SIZE
  ) {
    if (ballVx > 0) {
      ballVx = -Math.abs(ballVx);
      const offset = (ballY - p2Y) / PADDLE_HALF_HEIGHT;
      ballVy = offset * 0.4 + controls.englishControl * 0.25;
    }
  }

  // Goal / Out of bounds scoring
  if (ballX < 0.0) {
    scoreP2 += 1;
    ballX = 0.5;
    ballY = 0.5;
    ballVx = 0.45;
    ballVy = deterministicServeVerticalVelocity(scoreP1, scoreP2, 2);
  } else if (ballX > 1.0) {
    scoreP1 += 1;
    ballX = 0.5;
    ballY = 0.5;
    ballVx = -0.45;
    ballVy = deterministicServeVerticalVelocity(scoreP1, scoreP2, 1);
  }

  // Light Gun Optical Target Coincidence
  let lightGunCoincidence = false;
  const targetX = p2X; // Target mode uses dot 2 as target
  const targetY = p2Y;
  const gunDistX = Math.abs(controls.lightGunAimX - targetX);
  const gunDistY = Math.abs(controls.lightGunAimY - targetY);
  if (gunDistX <= 0.08 && gunDistY <= 0.08) {
    lightGunCoincidence = true;
    if (controls.lightGunTrigger && !targetExtinct) {
      targetExtinct = true;
      targetExtinctTimer = 0;
      targetHitCount += 1;
      lastCoincidenceTime = time;
    }
  }

  // Calculate SI Telemetry Metrics
  const p1DelayHMicrosec = DELAY_H_MIN_US + p1X * (DELAY_H_MAX_US - DELAY_H_MIN_US);
  const p1DelayVMs = DELAY_V_MIN_MS + p1Y * (DELAY_V_MAX_MS - DELAY_V_MIN_MS);
  const p2DelayHMicrosec = DELAY_H_MIN_US + p2X * (DELAY_H_MAX_US - DELAY_H_MIN_US);
  const p2DelayVMs = DELAY_V_MIN_MS + p2Y * (DELAY_V_MAX_MS - DELAY_V_MIN_MS);

  const rfCarrierFreqMHz = controls.rfChannel === 4 ? 67.25 : 61.25;
  // The grant gives neither terminal voltage nor antenna impedance/power.
  // Preserve a numeric slot for legacy consumers but refuse the quantity.
  const rfAntennaPowerNanoWatts = 0;

  const nextState: BaerOdysseyState = {
    timeSeconds: time,
    ballX,
    ballY,
    ballVx,
    ballVy,
    scoreP1,
    scoreP2,
    targetHitCount,
    targetExtinct,
    targetExtinctTimer,
    lastCoincidenceTime,
  };

  const metrics: BaerOdysseyMetrics = {
    horizontalSyncFreqHz: F_H,
    horizontalPeriodMicrosec: T_H_US,
    verticalFreqHz: F_V,
    verticalPeriodMs: T_V_MS,
    p1DelayHMicrosec,
    p1DelayVMs,
    p2DelayHMicrosec,
    p2DelayVMs,
    p1X,
    p1Y,
    p2X,
    p2Y,
    ballX,
    ballY,
    ballVx,
    ballVy,
    coincidenceActive,
    dotCoincidenceActive,
    firstDotVisible: controls.claim1Active && !targetExtinct,
    secondDotVisible: controls.claim1Active,
    claim1TopologyActive: controls.claim1Active,
    directCouplingActive: controls.claim1Active,
    lightGunCoincidence,
    targetVisible: !targetExtinct,
    rfCarrierFreqMHz,
    rfAntennaPowerNanoWatts,
    chromaSubcarrierFreqMHz: CHROMA_F_MHZ,
    compositeVideoVoltageV: 1.0,
  };

  return { state: nextState, metrics };
}

export interface BaerOdysseyTapeFrame {
  readonly state: BaerOdysseyState;
  readonly metrics: BaerOdysseyMetrics;
}

let tapeFrame: BaerOdysseyTapeFrame | undefined;
let targetResetRequested = false;
let lightGunTriggerRequested = false;

export function getBaerOdysseyTapeFrame(): BaerOdysseyTapeFrame | undefined {
  return tapeFrame;
}

/** Current shared frame, or a zero-time projection before the first owner tick. */
export function readBaerOdysseyTapeFrame(controls: BaerOdysseyControls): BaerOdysseyTapeFrame {
  return tapeFrame ?? stepBaerOdysseySi(INITIAL_BAER_STATE, controls, 0);
}

/** Restore the complete deterministic game tape to its documented initial state. */
export function resetBaerOdysseyTape(): void {
  tapeFrame = undefined;
  targetResetRequested = false;
  lightGunTriggerRequested = false;
}

/** Queue a one-tick reset input so pausing cannot swallow the visitor's command. */
export function requestBaerTargetReset(): void {
  targetResetRequested = true;
}

/** Queue a one-tick light-gun trigger; its duration is virtual, not wall-clock based. */
export function requestBaerLightGunTrigger(): void {
  lightGunTriggerRequested = true;
}

/** One fixed-step owner for the 2D face, 3D face, and telemetry projection. */
export function createBaerOdysseyTransportUpdater(
  getControls: () => BaerOdysseyControls,
): TapeUpdater {
  return (_previous, dt) => {
    const controls = getControls();
    const resetRequested = targetResetRequested;
    const triggerRequested = lightGunTriggerRequested;
    if (!controls.running && !resetRequested && !triggerRequested) return null;

    targetResetRequested = false;
    lightGunTriggerRequested = false;
    const result = stepBaerOdysseySi(
      tapeFrame?.state ?? INITIAL_BAER_STATE,
      {
        ...controls,
        resetButton: controls.resetButton || resetRequested,
        lightGunTrigger: controls.lightGunTrigger || triggerRequested,
      },
      dt,
    );
    tapeFrame = result;

    return {
      domain: "electromagnetics_flux",
      refusal: { isRefused: false },
      video: {
        ballX: result.metrics.ballX,
        ballY: result.metrics.ballY,
        ballVx: result.metrics.ballVx,
        ballVy: result.metrics.ballVy,
        player1X: result.metrics.p1X,
        player1Y: result.metrics.p1Y,
        player2X: result.metrics.p2X,
        player2Y: result.metrics.p2Y,
        scorePlayer1: result.state.scoreP1,
        scorePlayer2: result.state.scoreP2,
        targetHitCount: result.state.targetHitCount,
        targetVisible: result.metrics.targetVisible,
        coincidenceActive: result.metrics.coincidenceActive,
        lightGunCoincidence: result.metrics.lightGunCoincidence,
        horizontalSyncHz: result.metrics.horizontalSyncFreqHz,
        verticalFieldHz: result.metrics.verticalFreqHz,
        rfCarrierMHz: result.metrics.rfCarrierFreqMHz,
      },
    };
  };
}
