import { type EInkControls, type EInkState, stepEInk } from "./eInkKernel";
import type { TapeUpdater } from "./useFrankenSimPhysics";

export interface EInkRuntimeControls extends EInkControls {
  readonly running: boolean;
  readonly particleChargeCoupled: number;
}

export const DEFAULT_EINK_RUNTIME_CONTROLS: EInkRuntimeControls = {
  running: true,
  electrodeVoltageVolts: 15,
  fluidViscosityCp: 2,
  particleChargeCoupled: 1,
};

export function readEInkRuntimeControls(raw?: Partial<EInkRuntimeControls>): EInkRuntimeControls {
  return {
    running:
      raw?.running === undefined ? DEFAULT_EINK_RUNTIME_CONTROLS.running : Boolean(raw.running),
    electrodeVoltageVolts: Math.max(
      -15,
      Math.min(
        15,
        raw?.electrodeVoltageVolts ?? DEFAULT_EINK_RUNTIME_CONTROLS.electrodeVoltageVolts,
      ),
    ),
    fluidViscosityCp: Math.max(
      0.5,
      Math.min(5, raw?.fluidViscosityCp ?? DEFAULT_EINK_RUNTIME_CONTROLS.fluidViscosityCp),
    ),
    particleChargeCoupled: Math.max(
      0.2,
      Math.min(
        2,
        raw?.particleChargeCoupled ?? DEFAULT_EINK_RUNTIME_CONTROLS.particleChargeCoupled,
      ),
    ),
  };
}

export interface EInkTapeFrame {
  readonly simTimeSec: number;
  readonly controls: EInkRuntimeControls;
  readonly state: EInkState;
}

let tapeFrame: EInkTapeFrame | undefined;

function sameControls(left: EInkRuntimeControls, right: EInkRuntimeControls): boolean {
  return (
    left.running === right.running &&
    left.electrodeVoltageVolts === right.electrodeVoltageVolts &&
    left.fluidViscosityCp === right.fluidViscosityCp &&
    left.particleChargeCoupled === right.particleChargeCoupled
  );
}

function projectFrame(
  controls: EInkRuntimeControls,
  dt: number,
  previous?: EInkTapeFrame,
): EInkTapeFrame {
  return {
    simTimeSec: (previous?.simTimeSec ?? 0) + (controls.running ? dt : 0),
    controls,
    state: stepEInk(controls, controls.running ? dt : 0, previous?.state),
  };
}

export function getEInkTapeFrame(): EInkTapeFrame | undefined {
  return tapeFrame;
}

/** Read the authoritative electrophoresis tape, reprojecting paused control changes at frozen time. */
export function readEInkTapeFrame(controls: EInkRuntimeControls): EInkTapeFrame {
  if (!tapeFrame) return projectFrame(controls, 0);
  return sameControls(tapeFrame.controls, controls)
    ? tapeFrame
    : projectFrame(controls, 0, tapeFrame);
}

export function resetEInkTape(): void {
  tapeFrame = undefined;
}

/** One fixed-step electrophoresis owner shared by 2D, 3D, and telemetry. */
export function createEInkTransportUpdater(getControls: () => EInkRuntimeControls): TapeUpdater {
  return (_previous, dt) => {
    const controls = getControls();
    if (tapeFrame && !controls.running && sameControls(tapeFrame.controls, controls)) return null;

    const result = projectFrame(controls, dt, tapeFrame);
    tapeFrame = result;
    return {
      domain: "electromagnetics_flux",
      refusal: { isRefused: false },
      em: {
        frequencyHz: 0,
        magneticFluxDensityTesla: 0,
        electricFieldVpm: result.state.electricFieldVperUm * 1e6,
        phaseAngleRad: 0,
        inductanceHenry: 0,
        capacitanceFarad: 0,
        currentAmperes: 0,
        voltageVolts: controls.electrodeVoltageVolts,
        powerFactor: 0,
        efficiencyPct: 0,
        synchronousRpm: 0,
        slipFraction: 0,
        rotorRpm: 0,
        shaftPowerWatts: 0,
        electricalInputWatts: 0,
      },
    };
  };
}
