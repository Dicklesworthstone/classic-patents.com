import { stepFarnsworthRasterFrame, voltsToKv } from "./catalogKernels";
import { FrankenSimEngine } from "./engine";
import type { TapeUpdater } from "./useFrankenSimPhysics";

export interface FarnsworthTvControls {
  readonly running: boolean;
  readonly claim1ScanPathPresent: boolean;
  readonly anodeVoltage: number;
  readonly coilCurrent: number;
  readonly lightIntensityLux: number;
  readonly horizontalFreqKhz: number;
  readonly verticalFreqHz: number;
  readonly scanLines: number;
}

export const DEFAULT_FARNSWORTH_CONTROLS: FarnsworthTvControls = {
  running: true,
  claim1ScanPathPresent: true,
  anodeVoltage: 1500,
  coilCurrent: 0.42,
  lightIntensityLux: 500,
  horizontalFreqKhz: 15.75,
  verticalFreqHz: 60,
  scanLines: 60,
};

export function readFarnsworthTvControls(
  raw?: Partial<FarnsworthTvControls>,
): FarnsworthTvControls {
  return {
    running:
      raw?.running === undefined ? DEFAULT_FARNSWORTH_CONTROLS.running : Boolean(raw.running),
    claim1ScanPathPresent:
      raw?.claim1ScanPathPresent === undefined
        ? DEFAULT_FARNSWORTH_CONTROLS.claim1ScanPathPresent
        : Number(raw.claim1ScanPathPresent) >= 0.5,
    anodeVoltage: Math.max(500, Math.min(6000, raw?.anodeVoltage ?? 1500)),
    coilCurrent: Math.max(0.1, Math.min(1, raw?.coilCurrent ?? 0.42)),
    lightIntensityLux: Math.max(0, Math.min(2000, raw?.lightIntensityLux ?? 500)),
    horizontalFreqKhz: Math.max(5, Math.min(30, raw?.horizontalFreqKhz ?? 15.75)),
    verticalFreqHz: Math.max(30, Math.min(120, raw?.verticalFreqHz ?? 60)),
    scanLines: Math.max(1, Math.min(240, Math.round(raw?.scanLines ?? 60))),
  };
}

function sameFarnsworthTvControls(
  left: FarnsworthTvControls,
  right: FarnsworthTvControls,
): boolean {
  return (
    left.running === right.running &&
    left.claim1ScanPathPresent === right.claim1ScanPathPresent &&
    left.anodeVoltage === right.anodeVoltage &&
    left.coilCurrent === right.coilCurrent &&
    left.lightIntensityLux === right.lightIntensityLux &&
    left.horizontalFreqKhz === right.horizontalFreqKhz &&
    left.verticalFreqHz === right.verticalFreqHz &&
    left.scanLines === right.scanLines
  );
}

export interface FarnsworthTvTapeState {
  readonly simTimeSec: number;
}

export interface FarnsworthTvTapeFrame {
  readonly state: FarnsworthTvTapeState;
  readonly controls: FarnsworthTvControls;
  readonly beamState: ReturnType<typeof FrankenSimEngine.stepFarnsworthTv>;
  readonly scanFrame: ReturnType<typeof stepFarnsworthRasterFrame>;
}

let tapeFrame: FarnsworthTvTapeFrame | undefined;

function projectFarnsworthTvFrame(
  state: FarnsworthTvTapeState,
  controls: FarnsworthTvControls,
): FarnsworthTvTapeFrame {
  const deflectionGauss = FrankenSimEngine.farnsworthDeflectionGauss(controls.coilCurrent);
  const beamState = FrankenSimEngine.stepFarnsworthTv(
    voltsToKv(controls.anodeVoltage),
    deflectionGauss,
    controls.lightIntensityLux,
    controls.scanLines,
    controls.horizontalFreqKhz,
    controls.verticalFreqHz,
  );
  return {
    state,
    controls,
    beamState,
    scanFrame: stepFarnsworthRasterFrame(beamState, state.simTimeSec),
  };
}

export function getFarnsworthTvTapeFrame(): FarnsworthTvTapeFrame | undefined {
  return tapeFrame;
}

/** Read the authoritative frame, reprojecting frozen-time controls when paused. */
export function readFarnsworthTvTapeFrame(controls: FarnsworthTvControls): FarnsworthTvTapeFrame {
  if (!tapeFrame) return projectFarnsworthTvFrame({ simTimeSec: 0 }, controls);
  if (sameFarnsworthTvControls(tapeFrame.controls, controls)) {
    return tapeFrame;
  }
  return projectFarnsworthTvFrame(tapeFrame.state, controls);
}

export function resetFarnsworthTvTape(): void {
  tapeFrame = undefined;
}

/** One fixed-step raster owner shared by the 2D face, 3D face, and badge. */
export function createFarnsworthTvTransportUpdater(
  getControls: () => FarnsworthTvControls,
): TapeUpdater {
  return (_previous, dt) => {
    const controls = getControls();
    if (tapeFrame && !controls.running && sameFarnsworthTvControls(tapeFrame.controls, controls)) {
      return null;
    }
    const state = {
      simTimeSec: (tapeFrame?.state.simTimeSec ?? 0) + (controls.running ? dt : 0),
    };
    const result = projectFarnsworthTvFrame(state, controls);
    tapeFrame = result;

    return {
      domain: "semiconductor_microarch",
      refusal: controls.claim1ScanPathPresent
        ? { isRefused: false }
        : {
            isRefused: true,
            reason:
              "Claim 1 electrical-image traversal is withheld; no raster telemetry or substitute scanning mechanism is inferred.",
          },
      semi: {
        biasVoltageVolts: result.beamState.acceleratingVoltageVolts,
        currentGainAlpha: 0,
        holeDiffusionCoefficientCm2ps: 0,
        chargeTransferEfficiencyPct: 0,
        clockPeriodNs: 0,
        busBandwidthMbps: 0,
        electronVelocityMps: result.beamState.electronVelocityMps,
        relativisticFractionC: result.beamState.relativisticPct,
        voltageGain: 1,
        powerGainDb: 0,
        collectorCurrentMa: 0,
      },
      raster: controls.claim1ScanPathPresent
        ? {
            simTimeSec: result.state.simTimeSec,
            scanLines: result.beamState.scanLines,
            rasterLineIndex: result.scanFrame.rasterLineIndex,
            rasterXPercent: result.scanFrame.rasterXPercent,
            rasterYPercent: result.scanFrame.rasterYPercent,
            beamFraction: result.scanFrame.beamFraction,
            horizontalDeflectionUnits: result.scanFrame.horizontalDeflectionUnits,
            verticalDeflectionUnits: result.scanFrame.verticalDeflectionUnits,
            inHorizontalRetrace: result.scanFrame.inHorizontalRetrace,
          }
        : undefined,
    };
  };
}
