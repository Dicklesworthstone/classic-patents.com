/**
 * Shared source-bounded kinematic tape for Eli Whitney's restored cotton-gin
 * specification (US X72). The source fixes the cylinder/winch connection and
 * the contrary, faster clearer motion, but not a numerical whirl ratio or a
 * torque/load curve. A declared 3:1 crossed-belt scenario closes those missing
 * coordinates without pretending that they were printed in 1793.
 */

import { stepWhitneyCottonGin } from "./catalogKernels";
import type { TapeUpdater } from "./useFrankenSimPhysics";

export const WHITNEY_KERNEL_SOURCE = "source-bounded-ts+fs-lbm-lint-field" as const;
export const WHITNEY_FRANKENSIM_BOUNDARY =
  "fs-mbd::revolute+belt-contact-browser-composition-unavailable" as const;
export const WHITNEY_SOURCE_BOUNDARY =
  "The restored US X72 specification directly couples the winch to the toothed cylinder axle and requires the clearer to counter-rotate faster through a band and crowned whirls. It gives cylinder, tooth, breastwork, and brush dimensions, but no whirl diameters, input torque, inertia, cotton feed mass, or measured throughput. The 3:1 clearer ratio and output values are declared modern teaching scenarios. The optional fs-lbm field only shapes lint display; no FrankenSim multibody belt/contact composition stepped this frame." as const;

export interface WhitneyRuntimeControls {
  crankRpm: number;
  seedGridClearance: number;
  isRunning: boolean;
  resetEpoch: number;
}

export interface WhitneyKinematicPhases {
  crankRad: number;
  cylinderRad: number;
  clearerRad: number;
  lintCycle01: number;
}

export interface WhitneyTapeFrame {
  controls: WhitneyRuntimeControls;
  outputs: ReturnType<typeof stepWhitneyCottonGin>;
  phases: WhitneyKinematicPhases;
  timeSec: number;
}

export const WHITNEY_ZERO_PHASES: Readonly<WhitneyKinematicPhases> = Object.freeze({
  crankRad: 0,
  cylinderRad: 0,
  clearerRad: 0,
  lintCycle01: 0,
});

let latestWhitneyTapeFrame: WhitneyTapeFrame | null = null;

export function readWhitneyRuntimeControls(
  raw: Record<string, number | boolean | undefined>,
): WhitneyRuntimeControls {
  return {
    crankRpm: Number(raw.crankRpm ?? 60),
    seedGridClearance: Number(raw.seedGridClearance ?? 3.2),
    isRunning:
      typeof raw.isRunning === "boolean" ? raw.isRunning : Number(raw.isRunning ?? 1) > 0.5,
    resetEpoch: Number(raw.resetEpoch ?? 0),
  };
}

export function getWhitneyTapeFrame(): WhitneyTapeFrame | null {
  return latestWhitneyTapeFrame;
}

export function createWhitneyTransportUpdater(
  readControls: () => WhitneyRuntimeControls,
): TapeUpdater {
  const phases: WhitneyKinematicPhases = { ...WHITNEY_ZERO_PHASES };
  let timeSec = 0;
  let lastResetEpoch: number | null = null;
  let ticksSincePublish = 4;

  return (_previous, dt) => {
    const controls = readControls();
    if (lastResetEpoch !== null && controls.resetEpoch !== lastResetEpoch) {
      Object.assign(phases, WHITNEY_ZERO_PHASES);
      timeSec = 0;
    }
    lastResetEpoch = controls.resetEpoch;
    const outputs = stepWhitneyCottonGin(controls);

    if (controls.isRunning) {
      timeSec += dt;
      phases.crankRad += outputs.crankOmegaRadPerS * dt;
      // These are holonomic drive constraints, not three independent display
      // oscillators. US X72 directly joins the winch and toothed-cylinder
      // axle; the declared teaching whirls reverse the clearer's rotation at
      // a 3:1 speed ratio. Deriving both driven phases from the sole input
      // coordinate preserves their no-slip closure exactly, including after a
      // speed change, instead of allowing rounded angular-rate integrations
      // to accumulate a fictitious belt slip.
      phases.cylinderRad = phases.crankRad * outputs.sawToCrankRatio;
      phases.clearerRad = -phases.crankRad * outputs.brushToCrankRatio;
      phases.lintCycle01 = (phases.lintCycle01 + dt * outputs.lintDisplayCyclesPerSecond) % 1;
    }

    latestWhitneyTapeFrame = {
      controls,
      outputs,
      phases: { ...phases },
      timeSec,
    };

    ticksSincePublish += 1;
    if (ticksSincePublish < 5) return null;
    ticksSincePublish = 0;
    return {
      machine: {
        poseXMeters: phases.lintCycle01,
        poseYMeters: 0,
        headingRad: phases.cylinderRad,
        modeLabel: controls.isRunning ? "source-bounded cotton gin" : "cotton gin held",
        wheelSpeedMps: outputs.sawTipSpeedMps,
      },
    };
  };
}
