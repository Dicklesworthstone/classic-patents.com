/**
 * Shared source-bounded kinematic tape for Cyrus McCormick's 1834 reaper.
 *
 * US X8277 prints enough dimensions to close the no-slip wheel, two-stage
 * gear train, and reel-belt ratios. It does not print the force, mass, slip,
 * inertia, crop resistance, or drawbar data required for a dynamics or power
 * solution. The route-owned tape therefore enforces only those disclosed
 * holonomic coordinates and carries an explicit FrankenSim composition
 * refusal for everything the source cannot close.
 */

import { stepMcCormickReaper } from "./catalogKernels";
import type { TapeUpdater } from "./useFrankenSimPhysics";

export const MCCORMICK_KERNEL_SOURCE = "source-bounded-ts" as const;
export const MCCORMICK_FRANKENSIM_BOUNDARY =
  "fs-mbd::revolute+gear+belt+fs-solid::cutting-contact-browser-composition-unavailable" as const;
export const MCCORMICK_SOURCE_BOUNDARY =
  "US X8277 prints a two-foot ground wheel, 30:9 and 27:9 gear engagements, a 13-inch axle pulley driving a 12-inch reel pulley, and the double-crank cutter alternatives. It supplies no horse speed, wheel slip, rotating inertia, draft force, stem-cutting resistance, belt loss, or field throughput. Ground speed is therefore a declared teaching scenario; the shared tape enforces only the printed no-slip ratios. No FrankenSim fs-mbd gear/belt plus fs-solid cutting-contact browser composition stepped this frame." as const;

export interface McCormickRuntimeControls {
  forwardSpeedMph: number;
  isRunning: boolean;
  resetEpoch: number;
}

export interface McCormickKinematicPhases {
  groundWheelRad: number;
  countershaftRad: number;
  cutterCrankRad: number;
  reelRad: number;
  travelM: number;
}

export interface McCormickTapeFrame {
  controls: McCormickRuntimeControls;
  outputs: ReturnType<typeof stepMcCormickReaper>;
  phases: McCormickKinematicPhases;
  timeSec: number;
}

export const MCCORMICK_ZERO_PHASES: Readonly<McCormickKinematicPhases> = Object.freeze({
  groundWheelRad: 0,
  countershaftRad: 0,
  cutterCrankRad: 0,
  reelRad: 0,
  travelM: 0,
});

let latestMcCormickTapeFrame: McCormickTapeFrame | null = null;

export function readMcCormickRuntimeControls(
  raw: Record<string, number | boolean | undefined>,
): McCormickRuntimeControls {
  return {
    forwardSpeedMph: Number(raw.forwardSpeedMph ?? 2.5),
    isRunning:
      typeof raw.isRunning === "boolean" ? raw.isRunning : Number(raw.isRunning ?? 1) > 0.5,
    resetEpoch: Number(raw.resetEpoch ?? 0),
  };
}

export function getMcCormickTapeFrame(): McCormickTapeFrame | null {
  return latestMcCormickTapeFrame;
}

export function createMcCormickTransportUpdater(
  readControls: () => McCormickRuntimeControls,
): TapeUpdater {
  const phases: McCormickKinematicPhases = { ...MCCORMICK_ZERO_PHASES };
  let timeSec = 0;
  let lastResetEpoch: number | null = null;
  let ticksSincePublish = 4;

  return (_previous, dt) => {
    const controls = readControls();
    if (lastResetEpoch !== null && controls.resetEpoch !== lastResetEpoch) {
      Object.assign(phases, MCCORMICK_ZERO_PHASES);
      timeSec = 0;
    }
    lastResetEpoch = controls.resetEpoch;
    const outputs = stepMcCormickReaper(controls);

    if (controls.isRunning) {
      timeSec += dt;
      const wheelStep = outputs.groundWheelOmegaRadPerS * dt;
      phases.groundWheelRad += wheelStep;
      // Each external gear mesh reverses direction. The second reversal puts
      // the upright double crank back in the ground wheel's direction.
      phases.countershaftRad -= wheelStep * outputs.firstGearRatio;
      phases.cutterCrankRad += wheelStep * outputs.cutterToWheelRatio;
      // The source says only "a belt"; an open belt is the non-reversing
      // source-minimal interpretation and closes the printed diameters.
      phases.reelRad += wheelStep * outputs.reelToWheelRatio;
      phases.travelM += outputs.groundSpeedMps * dt;
    }

    latestMcCormickTapeFrame = {
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
        poseXMeters: phases.travelM,
        poseYMeters: 0,
        headingRad: phases.groundWheelRad,
        modeLabel: controls.isRunning ? "source-bounded reaper" : "reaper held",
        wheelSpeedMps: outputs.groundSpeedMps,
      },
    };
  };
}
