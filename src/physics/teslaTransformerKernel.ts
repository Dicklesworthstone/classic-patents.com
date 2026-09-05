import {
  TESLA_TRANSFORMER_MAX_CONDUCTOR_LENGTH_M,
  TESLA_TRANSFORMER_MAX_FREQUENCY_HZ,
  tryTeslaTransformerWasmStep,
} from "./teslaWasm";

export const METERS_PER_MILE = 1609.344;
export const TESLA_SOURCE_FREQUENCY_HZ = 925;
export const TESLA_SOURCE_PROPAGATION_SPEED_MPS = 185_000 * METERS_PER_MILE;
export const TESLA_SOURCE_SECONDARY_LENGTH_M = 50 * METERS_PER_MILE;

export const TESLA_TRANSFORMER_SCHEMATIC = {
  baseX: 58,
  baseY: 240,
  baseWidth: 284,
  baseHeight: 16,
  coneSupportPath: "M 126 220 L 174 72 L 226 72 L 274 220 Z",
  highTerminalX: 200,
  highTerminalY: 58,
  highTerminalRadius: 8,
  primaryWindingPath:
    "M 82 220 C 82 196 318 196 318 220 C 318 242 96 242 96 220 C 96 202 304 202 304 220 C 304 236 110 236 110 220",
  primarySourceX: 58,
  commonNodeX: 330,
  commonNodeY: 220,
  earthX: 360,
  earthY: 278,
} as const;

export interface TeslaTransformerSchematicPoint {
  readonly x: number;
  readonly y: number;
}

function teslaTransformerSecondaryPoints(
  turnCount: number,
): readonly TeslaTransformerSchematicPoint[] {
  if (!Number.isInteger(turnCount) || turnCount < 2 || turnCount > 512) {
    throw new RangeError("Tesla schematic turn count must be an integer from 2 through 512");
  }
  const points: TeslaTransformerSchematicPoint[] = [];
  for (let index = 0; index <= turnCount; index++) {
    const fraction = index / turnCount;
    const halfWidth = 72 - fraction * 24;
    const y = 220 - fraction * 148;
    points.push({ x: 200 + (index % 2 === 0 ? -halfWidth : halfWidth), y });
  }
  return points;
}

/** Exact terminal coordinates of the connected secondary path below. */
export function teslaTransformerSecondaryTerminals(turnCount = 24): {
  readonly low: TeslaTransformerSchematicPoint;
  readonly high: TeslaTransformerSchematicPoint;
} {
  const points = teslaTransformerSecondaryPoints(turnCount);
  return { low: points[0], high: points[points.length - 1] };
}

/** Connected front-projection of the developed conical secondary winding. */
export function teslaTransformerSecondaryPath(turnCount = 24): string {
  return teslaTransformerSecondaryPoints(turnCount)
    .map(({ x, y }, index) => `${index === 0 ? "M" : "L"} ${x} ${y}`)
    .join(" ");
}

export interface TeslaTransformerControls {
  disturbanceFrequencyHz: number;
  secondaryLengthMiles: number;
}

export interface TeslaTransformerState {
  runtimeSource: "wasm" | "ts-fallback";
  frequencyHz: number;
  propagationSpeedMps: number;
  secondaryLengthM: number;
  secondaryLengthMiles: number;
  wavelengthM: number;
  wavelengthMiles: number;
  quarterWaveLengthM: number;
  quarterWaveLengthMiles: number;
  electricalLengthRad: number;
  electricalLengthDeg: number;
  quarterWaveErrorRad: number;
  quarterWaveErrorDeg: number;
  lengthErrorM: number;
  lengthErrorMiles: number;
  lengthRatio: number;
  remoteTerminalProfileFraction: number;
  quarterWaveSlopeMilesPerHz?: number;
  electricalLengthSlopeDegPerMile?: number;
  electricalLengthSlopeDegPerHz?: number;
  /** The 1897 grant supplies no excitation, impedance, loss, or load datum. */
  absolutePotentialKnown: false;
  /** The grant supplies no air-breakdown or discharge-length datum. */
  dischargeLengthKnown: false;
}

export function readTeslaTransformerControls(
  params: Partial<Record<keyof TeslaTransformerControls, number>>,
): TeslaTransformerControls {
  const frequency = params.disturbanceFrequencyHz;
  const length = params.secondaryLengthMiles;
  return {
    disturbanceFrequencyHz:
      typeof frequency === "number" && Number.isFinite(frequency) && frequency > 0
        ? frequency
        : TESLA_SOURCE_FREQUENCY_HZ,
    secondaryLengthMiles:
      typeof length === "number" && Number.isFinite(length) && length > 0 ? length : 50,
  };
}

function fallbackQuarterWave(
  frequencyHz: number,
  propagationSpeedMps: number,
  secondaryLengthM: number,
) {
  const wavelength_m = propagationSpeedMps / frequencyHz;
  const quarter_wave_length_m = wavelength_m / 4;
  const electrical_length_rad = (2 * Math.PI * secondaryLengthM) / wavelength_m;
  return {
    wavelength_m,
    quarter_wave_length_m,
    electrical_length_rad,
    quarter_wave_error_rad: electrical_length_rad - Math.PI / 2,
    length_error_m: secondaryLengthM - quarter_wave_length_m,
    length_ratio: secondaryLengthM / quarter_wave_length_m,
    remote_terminal_profile_fraction: Math.abs(Math.sin(electrical_length_rad)),
  };
}

/**
 * One source-bounded SI kernel for the 2D face, 3D face, badge, equations, and
 * weave. It computes only the distributed-wave quantities supported by the
 * grant and refuses to invent absolute voltage or streamer length.
 */
export function stepTeslaTransformerSi(controls: TeslaTransformerControls): TeslaTransformerState {
  const frequencyHz = controls.disturbanceFrequencyHz;
  const secondaryLengthM = controls.secondaryLengthMiles * METERS_PER_MILE;
  if (
    !Number.isFinite(frequencyHz) ||
    !Number.isFinite(controls.secondaryLengthMiles) ||
    frequencyHz <= 0 ||
    frequencyHz > TESLA_TRANSFORMER_MAX_FREQUENCY_HZ ||
    secondaryLengthM <= 0 ||
    secondaryLengthM > TESLA_TRANSFORMER_MAX_CONDUCTOR_LENGTH_M
  ) {
    throw new RangeError("Tesla transformer controls are outside the admitted SI domain");
  }
  const wasm = tryTeslaTransformerWasmStep(
    frequencyHz,
    TESLA_SOURCE_PROPAGATION_SPEED_MPS,
    secondaryLengthM,
  );
  const result =
    wasm ?? fallbackQuarterWave(frequencyHz, TESLA_SOURCE_PROPAGATION_SPEED_MPS, secondaryLengthM);

  const quarterWaveSlopeMilesPerHz = -46250 / frequencyHz ** 2;
  const electricalLengthSlopeDegPerMile = (360 * frequencyHz) / 185000;
  const electricalLengthSlopeDegPerHz = (360 * controls.secondaryLengthMiles) / 185000;

  return {
    runtimeSource: wasm ? "wasm" : "ts-fallback",
    frequencyHz,
    propagationSpeedMps: TESLA_SOURCE_PROPAGATION_SPEED_MPS,
    secondaryLengthM,
    secondaryLengthMiles: controls.secondaryLengthMiles,
    wavelengthM: result.wavelength_m,
    wavelengthMiles: result.wavelength_m / METERS_PER_MILE,
    quarterWaveLengthM: result.quarter_wave_length_m,
    quarterWaveLengthMiles: result.quarter_wave_length_m / METERS_PER_MILE,
    electricalLengthRad: result.electrical_length_rad,
    electricalLengthDeg: (result.electrical_length_rad * 180) / Math.PI,
    quarterWaveErrorRad: result.quarter_wave_error_rad,
    quarterWaveErrorDeg: (result.quarter_wave_error_rad * 180) / Math.PI,
    lengthErrorM: result.length_error_m,
    lengthErrorMiles: result.length_error_m / METERS_PER_MILE,
    lengthRatio: result.length_ratio,
    remoteTerminalProfileFraction: result.remote_terminal_profile_fraction,
    quarterWaveSlopeMilesPerHz,
    electricalLengthSlopeDegPerMile,
    electricalLengthSlopeDegPerHz,
    absolutePotentialKnown: false,
    dischargeLengthKnown: false,
  };
}
