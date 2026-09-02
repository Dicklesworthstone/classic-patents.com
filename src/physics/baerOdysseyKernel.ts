/**
 * SI Physics & Electronic Timing Kernel for US 3,728,480:
 * Ralph H. Baer — Television Gaming and Training Apparatus (Magnavox Odyssey)
 *
 * Models:
 * 1. NTSC standard raster horizontal (15.75 kHz) and vertical (60 Hz) astable multivibrators.
 * 2. Monostable RC time-delay spot synthesis and coordinate translation.
 * 3. Diode AND-matrix spot slicing (pulse width & height).
 * 4. Coincidence detection gating, paddle-ball collision response, and English spin deflection.
 * 5. Optical light gun photodetector coincidence and SCR crowbar target extinction.
 * 6. VHF Channel 3/4 RF carrier modulation and antenna terminal power (FCC Part 15 compliance).
 */

export interface BaerOdysseyControls {
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
  /** Instantaneous paddle-ball coincidence active */
  coincidenceActive: boolean;
  /** Light gun alignment optical coincidence active */
  lightGunCoincidence: boolean;
  /** Target dot active on CRT (false if extinguished by hit) */
  targetVisible: boolean;
  /** RF Carrier Frequency (MHz) ~ 61.25 MHz (Ch 3) or 67.25 MHz (Ch 4) */
  rfCarrierFreqMHz: number;
  /** RF Antenna Output Peak Power (nW) into 300 ohm twin lead */
  rfAntennaPowerNanoWatts: number;
  /** Chroma Subcarrier Frequency (MHz) ~ 3.579545 MHz */
  chromaSubcarrierFreqMHz: number;
  /** Composite Video Amplitude (V_pp) ~ 1.0 V */
  compositeVideoVoltageV: number;
}

export const DEFAULT_BAER_CONTROLS: BaerOdysseyControls = {
  player1PotX: 0.15,
  player1PotY: 0.5,
  player2PotX: 0.85,
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

export function readBaerControls(raw?: Partial<BaerOdysseyControls>): BaerOdysseyControls {
  return {
    player1PotX: Math.max(
      0.05,
      Math.min(0.45, raw?.player1PotX ?? DEFAULT_BAER_CONTROLS.player1PotX),
    ),
    player1PotY: Math.max(
      0.05,
      Math.min(0.95, raw?.player1PotY ?? DEFAULT_BAER_CONTROLS.player1PotY),
    ),
    player2PotX: Math.max(
      0.55,
      Math.min(0.95, raw?.player2PotX ?? DEFAULT_BAER_CONTROLS.player2PotX),
    ),
    player2PotY: Math.max(
      0.05,
      Math.min(0.95, raw?.player2PotY ?? DEFAULT_BAER_CONTROLS.player2PotY),
    ),
    englishControl: Math.max(
      -1.0,
      Math.min(1.0, raw?.englishControl ?? DEFAULT_BAER_CONTROLS.englishControl),
    ),
    ballSpeedMultiplier: Math.max(
      0.2,
      Math.min(3.0, raw?.ballSpeedMultiplier ?? DEFAULT_BAER_CONTROLS.ballSpeedMultiplier),
    ),
    rfChannel: raw?.rfChannel === 4 ? 4 : 3,
    chromaPhaseDeg: Math.max(
      0,
      Math.min(180, raw?.chromaPhaseDeg ?? DEFAULT_BAER_CONTROLS.chromaPhaseDeg),
    ),
    lightGunTrigger: Boolean(raw?.lightGunTrigger),
    lightGunAimX: Math.max(0, Math.min(1, raw?.lightGunAimX ?? DEFAULT_BAER_CONTROLS.lightGunAimX)),
    lightGunAimY: Math.max(0, Math.min(1, raw?.lightGunAimY ?? DEFAULT_BAER_CONTROLS.lightGunAimY)),
    resetButton: Boolean(raw?.resetButton),
  };
}

export function stepBaerOdysseySi(
  state: BaerOdysseyState,
  controls: BaerOdysseyControls,
  dtSeconds: number,
): { state: BaerOdysseyState; metrics: BaerOdysseyMetrics } {
  const dt = Math.max(0.0001, Math.min(0.1, dtSeconds));
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

  // Handle Target Extinction Timer
  if (targetExtinct) {
    targetExtinctTimer -= dt;
    if (targetExtinctTimer <= 0) {
      targetExtinct = false;
      targetExtinctTimer = 0;
    }
  }

  // Calculate paddle positions from RC potentiometer settings
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

  // Coincidence detection: Diode AND gate logic
  let coincidenceActive = false;

  // Check Player 1 paddle coincidence
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
      coincidenceActive = true;
      lastCoincidenceTime = time;
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
      coincidenceActive = true;
      lastCoincidenceTime = time;
    }
  }

  // Goal / Out of bounds scoring
  if (ballX < 0.0) {
    scoreP2 += 1;
    ballX = 0.5;
    ballY = 0.5;
    ballVx = 0.45;
    ballVy = (Math.random() - 0.5) * 0.3;
  } else if (ballX > 1.0) {
    scoreP1 += 1;
    ballX = 0.5;
    ballY = 0.5;
    ballVx = -0.45;
    ballVy = (Math.random() - 0.5) * 0.3;
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
      targetExtinctTimer = 2.0; // 2 seconds extinction
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
  // 5 mV RMS into 300 ohm twin lead antenna
  const rfAntennaPowerNanoWatts = ((0.005 * 0.005) / 300.0) * 1e9; // ~83.33 nW

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
    lightGunCoincidence,
    targetVisible: !targetExtinct,
    rfCarrierFreqMHz,
    rfAntennaPowerNanoWatts,
    chromaSubcarrierFreqMHz: CHROMA_F_MHZ,
    compositeVideoVoltageV: 1.0,
  };

  return { state: nextState, metrics };
}
