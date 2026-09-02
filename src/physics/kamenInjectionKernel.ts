/**
 * US 3,858,581 — Dean Kamen, Medication Injection Device.
 *
 * The patent describes a motor, uniform-pitch lead screw, follower/plunger,
 * rotation-pulse switch, pulse counter, timing control, and relief/clutch
 * arrangements. It does not supply a dosage, concentration, patient state,
 * clinical protocol, safe delivery rate, pressure, or therapeutic outcome.
 * This shared kernel is a nonclinical normalized mechanism exhibit only.
 */

export interface KamenInjectionControls {
  leadScrewTurnFraction: number;
  counterTargetFraction: number;
  motorCircuitClosed: number;
  reliefPathShown: number;
}

export const KAMEN_INJECTION_DEFAULT_CONTROLS: KamenInjectionControls = {
  leadScrewTurnFraction: 0.32,
  counterTargetFraction: 0.68,
  motorCircuitClosed: 1,
  reliefPathShown: 0,
};

export interface KamenInjectionPose {
  leadScrewTurnFraction: number;
  counterTargetFraction: number;
  motorCircuitClosed: boolean;
  reliefPathShown: boolean;
  plungerPosition: number;
  pulseProgress: number;
  motorState: "open" | "counting pulses" | "counter reached" | "relief path shown";
  activeClaim: 1 | 2 | 3 | 4 | 5;
  positionLaw: string;
  refusal: { refused: true; reason: string };
}

function normalized(value: number | undefined, fallback: number): number {
  const number = typeof value === "number" && Number.isFinite(value) ? value : fallback;
  return Math.max(0, Math.min(1, number));
}

export function readKamenInjectionControls(
  params: Partial<KamenInjectionControls> | Record<string, number | undefined>,
): KamenInjectionControls {
  return {
    leadScrewTurnFraction: normalized(
      params.leadScrewTurnFraction,
      KAMEN_INJECTION_DEFAULT_CONTROLS.leadScrewTurnFraction,
    ),
    counterTargetFraction: normalized(
      params.counterTargetFraction,
      KAMEN_INJECTION_DEFAULT_CONTROLS.counterTargetFraction,
    ),
    motorCircuitClosed: normalized(
      params.motorCircuitClosed,
      KAMEN_INJECTION_DEFAULT_CONTROLS.motorCircuitClosed,
    ),
    reliefPathShown: normalized(
      params.reliefPathShown,
      KAMEN_INJECTION_DEFAULT_CONTROLS.reliefPathShown,
    ),
  };
}

export function stepKamenInjectionMechanism(
  params: Partial<KamenInjectionControls> | Record<string, number | undefined>,
): KamenInjectionPose {
  const controls = readKamenInjectionControls(params);
  const motorCircuitClosed = controls.motorCircuitClosed >= 0.5;
  const reliefPathShown = controls.reliefPathShown >= 0.5;
  // The circuit state controls whether the selected pose is being driven; it
  // does not mechanically unwind the screw, erase the counter, or retract the
  // follower. Keeping these coordinates tied to the selected screw pose avoids
  // an unphysical teleport when the circuit is opened.
  const pulseProgress = Math.min(controls.leadScrewTurnFraction, controls.counterTargetFraction);
  const motorState = reliefPathShown
    ? "relief path shown"
    : !motorCircuitClosed
      ? "open"
      : controls.leadScrewTurnFraction >= controls.counterTargetFraction
        ? "counter reached"
        : "counting pulses";
  return {
    ...controls,
    motorCircuitClosed,
    reliefPathShown,
    plungerPosition: controls.leadScrewTurnFraction,
    pulseProgress,
    motorState,
    activeClaim: reliefPathShown ? 5 : motorState === "counter reached" ? 4 : 1,
    positionLaw:
      "normalized plunger pose = f(lead-screw rotation, pulse-counter target, motor circuit state)",
    refusal: {
      refused: true,
      reason:
        "US 3,858,581 does not state a dose, volume-per-pulse calibration, fluid pressure, concentration, patient condition, safe delivery rate, or clinical outcome. This exhibit is a nonclinical mechanism diagram and refuses all therapeutic and quantitative delivery claims.",
    },
  };
}
