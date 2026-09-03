/**
 * US 3,858,581 — Dean Kamen, Medication Injection Device.
 *
 * The source mechanism is a connected event-counted screw drive: motor 24
 * rotates uniform-pitch lead screw 22; follower 18/20/40 is constrained
 * against rotation and therefore advances the syringe plunger 14; striker 80
 * physically closes switch 84 once per screw turn; decade counters 114/116
 * stop the motor at the selected integer count. Claim 3 adds an axially
 * releasable spring/clutch coupling.
 *
 * `fs-mbd::articulated::JointModel::helical` owns the generic screw-joint law
 * in FrankenSim. The public generic WASM artifact does not currently export
 * that constructor, so this browser kernel is an honest typed, normalized
 * mirror of the same one-coordinate helical constraint. It never reports WASM
 * provenance and never invents the unprinted pitch, motor, fluid, or clinical
 * inputs needed for SI performance.
 */

import type { MachineState } from "./types";
import type { TapeUpdater } from "./useFrankenSimPhysics";

export const KAMEN_INJECTION_ID = "us-3858581-kamen-medication-injection-device";
export const KAMEN_SOURCE_EXAMPLE_PULSE_COUNT = 27;
export const KAMEN_DISPLAY_FULL_TRAVEL_TURNS = 81;

export interface KamenInjectionControls {
  /** Starts or pauses the museum mechanism. */
  running: boolean;
  /** Deliberately accelerated display rate; not a historical motor speed. */
  displayTurnsPerSecond: number;
  /** Integer units/tens selector result represented by counters 114 and 116. */
  selectedPulseCount: number;
  /** Museum-time stand-in for the uncalibrated oscillator/counter interval. */
  offIntervalDisplaySeconds: number;
  /** Claim 3's motor-to-screw clutch is transmitting rotation. */
  clutchEngaged: boolean;
  /** Claim 1's striker, switch, wiring, and pulse-counted motor loop are present. */
  claim1PulseLoopPresent: boolean;
}

export const KAMEN_INJECTION_DEFAULT_CONTROLS: KamenInjectionControls = {
  running: true,
  displayTurnsPerSecond: 6,
  selectedPulseCount: KAMEN_SOURCE_EXAMPLE_PULSE_COUNT,
  offIntervalDisplaySeconds: 2.5,
  clutchEngaged: true,
  claim1PulseLoopPresent: true,
};

export type KamenControlPhase = "motor-on" | "motor-off" | "end-stop";

export interface KamenInjectionState {
  timeSeconds: number;
  motorRotorTurns: number;
  leadScrewTurns: number;
  cycleTurnCoordinate: number;
  followerTravelTurns: number;
  offElapsedDisplaySeconds: number;
  completedCycles: number;
  controlPhase: KamenControlPhase;
  signalFlashRemainingSeconds: number;
}

export const INITIAL_KAMEN_INJECTION_STATE: KamenInjectionState = {
  timeSeconds: 0,
  motorRotorTurns: 0,
  leadScrewTurns: 0,
  cycleTurnCoordinate: 0,
  followerTravelTurns: 0,
  offElapsedDisplaySeconds: 0,
  completedCycles: 0,
  controlPhase: "motor-on",
  signalFlashRemainingSeconds: 0,
};

export type KamenDisplayedPhase =
  | "motor-on / counting screw turns"
  | "motor-off / oscillator interval"
  | "paused"
  | "clutch disengaged"
  | "pulse loop withheld"
  | "end-of-stroke limit";

export interface KamenInjectionMetrics {
  phase: KamenDisplayedPhase;
  motorPowered: boolean;
  leadScrewDriven: boolean;
  pulseLoopComplete: boolean;
  clutchEngaged: boolean;
  selectedPulseCount: number;
  cyclePulseCount: number;
  firstCounterDigit: number;
  secondCounterDigit: number;
  counterProgress: number;
  followerPositionNormalized: number;
  leadScrewAngleRad: number;
  motorRotorAngleRad: number;
  strikerContactsSwitch: boolean;
  indicatorOn: boolean;
  offIntervalProgress: number;
  completedCycles: number;
  clutchAxialOffsetNormalized: number;
  activeClaim: 1 | 2 | 3 | 4 | 5;
  positionLaw: "N_pulse = n_turns; x = n p (p remains symbolic)";
  jointOwner: "fs-mbd helical-joint law · typed browser mirror";
  performanceQuantification: "refused";
  refusal: { refused: true; reason: string };
}

export interface KamenInjectionTapeFrame {
  controls: KamenInjectionControls;
  state: KamenInjectionState;
  metrics: KamenInjectionMetrics;
}

const REFUSAL_REASON =
  "US 3,858,581 does not state a numerical screw pitch, dose calibration, fluid pressure, concentration, patient condition, safe delivery rate, or clinical outcome. This exhibit shows only source-described mechanical topology and counted events; quantitative delivery and therapeutic claims are refused.";

function finiteOr(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function booleanControl(value: number | boolean | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return typeof value === "boolean" ? value : value >= 0.5;
}

export function readKamenInjectionControls(
  raw?: Partial<KamenInjectionControls> | Readonly<Record<string, number>>,
): KamenInjectionControls {
  return {
    running: booleanControl(raw?.running, KAMEN_INJECTION_DEFAULT_CONTROLS.running),
    displayTurnsPerSecond: Math.max(
      1,
      Math.min(
        12,
        finiteOr(
          raw?.displayTurnsPerSecond,
          KAMEN_INJECTION_DEFAULT_CONTROLS.displayTurnsPerSecond,
        ),
      ),
    ),
    selectedPulseCount: Math.max(
      1,
      Math.min(
        99,
        Math.round(
          finiteOr(raw?.selectedPulseCount, KAMEN_INJECTION_DEFAULT_CONTROLS.selectedPulseCount),
        ),
      ),
    ),
    offIntervalDisplaySeconds: Math.max(
      0.5,
      Math.min(
        8,
        finiteOr(
          raw?.offIntervalDisplaySeconds,
          KAMEN_INJECTION_DEFAULT_CONTROLS.offIntervalDisplaySeconds,
        ),
      ),
    ),
    clutchEngaged: booleanControl(
      raw?.clutchEngaged,
      KAMEN_INJECTION_DEFAULT_CONTROLS.clutchEngaged,
    ),
    claim1PulseLoopPresent: booleanControl(
      raw?.claim1PulseLoopPresent,
      KAMEN_INJECTION_DEFAULT_CONTROLS.claim1PulseLoopPresent,
    ),
  };
}

function boundedDt(value: number): number {
  return Math.max(0, Math.min(0.1, finiteOr(value, 0)));
}

function angleForTurns(turns: number): number {
  const fractionalTurn = ((turns % 1) + 1) % 1;
  return fractionalTurn * Math.PI * 2;
}

function deriveMetrics(
  state: KamenInjectionState,
  controls: KamenInjectionControls,
): KamenInjectionMetrics {
  const pulseLoopComplete = controls.claim1PulseLoopPresent;
  const motorPowered = controls.running && state.controlPhase === "motor-on";
  const leadScrewDriven = motorPowered && controls.clutchEngaged;
  const cyclePulseCount = pulseLoopComplete
    ? Math.min(controls.selectedPulseCount, Math.floor(state.cycleTurnCoordinate + 1e-9))
    : 0;
  const offIntervalProgress =
    state.controlPhase === "motor-off"
      ? Math.min(1, state.offElapsedDisplaySeconds / controls.offIntervalDisplaySeconds)
      : 0;
  const offOscillatorDisplayPulse =
    state.controlPhase === "motor-off" && Math.floor(state.offElapsedDisplaySeconds * 4) % 2 === 0;
  const leadScrewAngleRad = angleForTurns(state.leadScrewTurns);
  const strikerAngularDistance = Math.min(leadScrewAngleRad, Math.PI * 2 - leadScrewAngleRad);
  const phase: KamenDisplayedPhase = !controls.running
    ? "paused"
    : state.controlPhase === "end-stop"
      ? "end-of-stroke limit"
      : !controls.clutchEngaged && state.controlPhase === "motor-on"
        ? "clutch disengaged"
        : !pulseLoopComplete && state.controlPhase === "motor-on"
          ? "pulse loop withheld"
          : state.controlPhase === "motor-off"
            ? "motor-off / oscillator interval"
            : "motor-on / counting screw turns";
  const activeClaim: 1 | 2 | 3 | 4 | 5 = !controls.clutchEngaged
    ? 3
    : state.controlPhase === "motor-off"
      ? offOscillatorDisplayPulse
        ? 4
        : 2
      : state.controlPhase === "end-stop"
        ? 5
        : 1;

  return {
    phase,
    motorPowered,
    leadScrewDriven,
    pulseLoopComplete,
    clutchEngaged: controls.clutchEngaged,
    selectedPulseCount: controls.selectedPulseCount,
    cyclePulseCount,
    firstCounterDigit: cyclePulseCount % 10,
    secondCounterDigit: Math.floor(cyclePulseCount / 10) % 10,
    counterProgress: pulseLoopComplete
      ? Math.min(1, state.cycleTurnCoordinate / controls.selectedPulseCount)
      : 0,
    followerPositionNormalized: Math.min(
      1,
      state.followerTravelTurns / KAMEN_DISPLAY_FULL_TRAVEL_TURNS,
    ),
    leadScrewAngleRad,
    motorRotorAngleRad: angleForTurns(state.motorRotorTurns),
    strikerContactsSwitch:
      pulseLoopComplete && state.signalFlashRemainingSeconds > 0 && strikerAngularDistance < 0.24,
    indicatorOn: state.signalFlashRemainingSeconds > 0 || offOscillatorDisplayPulse,
    offIntervalProgress,
    completedCycles: state.completedCycles,
    clutchAxialOffsetNormalized: controls.clutchEngaged ? 0 : 1,
    activeClaim,
    positionLaw: "N_pulse = n_turns; x = n p (p remains symbolic)",
    jointOwner: "fs-mbd helical-joint law · typed browser mirror",
    performanceQuantification: "refused",
    refusal: { refused: true, reason: REFUSAL_REASON },
  };
}

/**
 * Advance the source mechanism by one bounded fixed step.
 *
 * The screw stops exactly on the selected integer turn: a large host frame can
 * never overshoot the counter and silently advance the plunger past its
 * selected event. The motor rotor may keep turning when the Claim 3 clutch is
 * released, while the screw, striker, follower, and plunger remain stationary.
 */
export function stepKamenInjectionMechanism(
  previous: KamenInjectionState,
  controls: KamenInjectionControls,
  dtSeconds: number,
): KamenInjectionTapeFrame {
  const dt = controls.running ? boundedDt(dtSeconds) : 0;
  let state: KamenInjectionState = {
    ...previous,
    timeSeconds: previous.timeSeconds + dt,
    signalFlashRemainingSeconds: Math.max(0, previous.signalFlashRemainingSeconds - dt),
  };

  if (dt > 0 && state.controlPhase !== "end-stop") {
    if (state.controlPhase === "motor-off") {
      const offElapsedDisplaySeconds = Math.min(
        controls.offIntervalDisplaySeconds,
        state.offElapsedDisplaySeconds + dt,
      );
      state = { ...state, offElapsedDisplaySeconds };
      if (offElapsedDisplaySeconds >= controls.offIntervalDisplaySeconds - 1e-12) {
        state = {
          ...state,
          controlPhase: "motor-on",
          cycleTurnCoordinate: 0,
          offElapsedDisplaySeconds: 0,
        };
      }
    } else {
      const requestedTurnAdvance = controls.displayTurnsPerSecond * dt;
      state = {
        ...state,
        motorRotorTurns: state.motorRotorTurns + requestedTurnAdvance,
      };

      if (controls.clutchEngaged) {
        let turnAdvance = requestedTurnAdvance;
        if (controls.claim1PulseLoopPresent) {
          turnAdvance = Math.min(
            turnAdvance,
            Math.max(0, controls.selectedPulseCount - state.cycleTurnCoordinate),
          );
        }
        turnAdvance = Math.min(
          turnAdvance,
          Math.max(0, KAMEN_DISPLAY_FULL_TRAVEL_TURNS - state.followerTravelTurns),
        );
        const priorIntegerTurns = Math.floor(state.cycleTurnCoordinate + 1e-9);
        const cycleTurnCoordinate = controls.claim1PulseLoopPresent
          ? state.cycleTurnCoordinate + turnAdvance
          : state.cycleTurnCoordinate;
        const nextIntegerTurns = Math.floor(cycleTurnCoordinate + 1e-9);
        state = {
          ...state,
          leadScrewTurns: state.leadScrewTurns + turnAdvance,
          cycleTurnCoordinate,
          followerTravelTurns: state.followerTravelTurns + turnAdvance,
          signalFlashRemainingSeconds:
            nextIntegerTurns > priorIntegerTurns ? 0.12 : state.signalFlashRemainingSeconds,
        };

        if (state.followerTravelTurns >= KAMEN_DISPLAY_FULL_TRAVEL_TURNS - 1e-12) {
          state = {
            ...state,
            followerTravelTurns: KAMEN_DISPLAY_FULL_TRAVEL_TURNS,
            controlPhase: "end-stop",
          };
        } else if (
          controls.claim1PulseLoopPresent &&
          state.cycleTurnCoordinate >= controls.selectedPulseCount - 1e-12
        ) {
          state = {
            ...state,
            cycleTurnCoordinate: controls.selectedPulseCount,
            completedCycles: state.completedCycles + 1,
            controlPhase: "motor-off",
            offElapsedDisplaySeconds: 0,
            signalFlashRemainingSeconds: 0.12,
          };
        }
      }
    }
  }

  return { controls, state, metrics: deriveMetrics(state, controls) };
}

let tapeFrame: KamenInjectionTapeFrame | undefined;

export function getKamenInjectionTapeFrame(): KamenInjectionTapeFrame | undefined {
  return tapeFrame;
}

/** Reconcile the latest controls without advancing the fixed-step state. */
export function readKamenInjectionTapeFrame(
  controls: KamenInjectionControls,
): KamenInjectionTapeFrame {
  return stepKamenInjectionMechanism(
    tapeFrame?.state ?? INITIAL_KAMEN_INJECTION_STATE,
    controls,
    0,
  );
}

export function resetKamenInjectionTape(): void {
  tapeFrame = undefined;
}

export function createKamenInjectionTransportUpdater(
  getControls: () => KamenInjectionControls,
): TapeUpdater {
  return (_previous, dt) => {
    const controls = getControls();
    tapeFrame = stepKamenInjectionMechanism(
      tapeFrame?.state ?? INITIAL_KAMEN_INJECTION_STATE,
      controls,
      dt,
    );
    if (!controls.running) return null;

    const machine: MachineState = {
      poseXMeters: tapeFrame.metrics.followerPositionNormalized,
      poseYMeters: tapeFrame.metrics.offIntervalProgress,
      headingRad: tapeFrame.metrics.leadScrewAngleRad,
      modeLabel: tapeFrame.metrics.phase,
      wheelSpeedMps: 0,
    };
    return {
      machine,
      refusal: {
        isRefused: true,
        reason: tapeFrame.metrics.pulseLoopComplete
          ? tapeFrame.metrics.refusal.reason
          : "Claim 1's striker/switch/pulse-counting loop is withheld, so counted motor control is not represented. Quantitative and clinical outputs remain refused.",
      },
    };
  };
}
