/**
 * Tesla polyphase rotating-field samples.
 * Fig. 4 of US 381,968 is eight successive positions of the B-vector.
 */

export const TESLA_PATENT_ID = "us-381968-tesla-motor";
export const TESLA_STROBE_COUNT = 8;
/** US 381,968 Fig. 4 is a 2-pole field: ns = 120 f / P. */
export const TESLA_FIELD_POLES = 2;
/** Electrical ω shown at 1/20 so a 60 Hz field is visible. HUD states ns. */
export const TESLA_FIELD_DISPLAY_SLOWDOWN = 20;
/** 2D presentation tick that integrates the same display ω as 3D. */
export const TESLA_FIELD_DISPLAY_TICK_MS = 30;
export const TESLA_FIELD_DISPLAY_TICK_S = TESLA_FIELD_DISPLAY_TICK_MS / 1000;
/** SVG length of the unit B-vector on the 2D rotating-field face. */
export const TESLA_B_VECTOR_SVG_SCALE = 60;
export const TESLA_SCHEMATIC_STROBE_LEN = 28;
export const TESLA_SCHEMATIC_LIVE_LEN = 44;
export const TESLA_SCHEMATIC_WHITNEY_POS = 70;
export const TESLA_SCHEMATIC_WHITNEY_B = 80;

export function teslaFieldDisplayOmegaRadPerS(freqHz: number): number {
  return (2 * Math.PI * Math.max(0, freqHz)) / TESLA_FIELD_DISPLAY_SLOWDOWN;
}

export function teslaFieldDisplayOmegaDegPerS(freqHz: number): number {
  return (360 * Math.max(0, freqHz)) / TESLA_FIELD_DISPLAY_SLOWDOWN;
}

/**
 * Primary tank plus secondary topload. 180 kHz at the registry defaults
 * (45 nF primary, 35 pF topload over a 15 pF secondary). Shared by 2D, 3D, badge, weave.
 */
export function teslaCoilResonantKhz(primaryCapNf?: number, toploadCapacitancePf?: number): number {
  const cap = Math.max(10, primaryCapNf ?? 45);
  const cTop = Math.max(5, toploadCapacitancePf ?? 35);
  return Math.round(180 * Math.sqrt(45 / cap) * Math.sqrt(50 / (15 + cTop)));
}

/** Registry-shaped controls for the interpretive US 593,138 host model. */
export function teslaCoilControls(params: {
  primaryCap?: number;
  primaryCapNf?: number;
  toploadCapacitancePf?: number;
  inputVoltageKv?: number;
  sparkGapDistanceMm?: number;
  couplingK?: number;
  secondaryTurns?: number;
}) {
  return {
    resonantFreqKhz: teslaCoilResonantKhz(
      params.primaryCap ?? params.primaryCapNf,
      params.toploadCapacitancePf,
    ),
    inputKv: params.inputVoltageKv ?? 15,
    sparkGapMm: params.sparkGapDistanceMm ?? 12,
    couplingK: params.couplingK ?? 0.18,
    secondaryTurns: params.secondaryTurns ?? 850,
  };
}

export interface TeslaFieldSample {
  omegaT: number;
  bx: number;
  by: number;
}

/**
 * Source-bound state for the Fig. 9 apparatus in US 381,968.
 *
 * Tesla says that one revolution of the generator armature shifts the ring's
 * attractive region once around the ring and that, in this arrangement, disk
 * D follows synchronously. This is a teaching model of that illustrated
 * motor-generator pair, not a later squirrel-cage induction-motor model.
 */
export interface TeslaFig9State {
  phaseCycleHz: number;
  generatorRpm: number;
  poleShiftRpm: number;
  diskRpm: number;
  fieldDisplayOmegaRadPerS: number;
  fieldDisplayOmegaDegPerS: number;
  fieldDisplayTickS: number;
  bVectorSvgScale: number;
  schematicFieldIntensity: number;
  schematicFillOpacity: number;
  schematicStrobeLen: number;
  schematicLiveLen: number;
  schematicWhitneyPos: number;
  schematicWhitneyB: number;
  usesGeneratorContactRings: true;
  usesMotorCommutator: false;
}

export function stepTeslaMotorFig9(phaseCycleHz: number): TeslaFig9State {
  const boundedHz = Math.max(1, phaseCycleHz);
  const generatorRpm = Math.round(boundedHz * 60);
  return {
    phaseCycleHz: boundedHz,
    generatorRpm,
    poleShiftRpm: generatorRpm,
    diskRpm: generatorRpm,
    fieldDisplayOmegaRadPerS: teslaFieldDisplayOmegaRadPerS(boundedHz),
    fieldDisplayOmegaDegPerS: teslaFieldDisplayOmegaDegPerS(boundedHz),
    fieldDisplayTickS: TESLA_FIELD_DISPLAY_TICK_S,
    bVectorSvgScale: TESLA_B_VECTOR_SVG_SCALE,
    schematicFieldIntensity: Number(Math.min(1, Math.max(0.3, boundedHz / 60)).toFixed(3)),
    schematicFillOpacity: Number((0.1 * Math.min(1, Math.max(0.3, boundedHz / 60))).toFixed(4)),
    schematicStrobeLen: TESLA_SCHEMATIC_STROBE_LEN,
    schematicLiveLen: TESLA_SCHEMATIC_LIVE_LEN,
    schematicWhitneyPos: TESLA_SCHEMATIC_WHITNEY_POS,
    schematicWhitneyB: TESLA_SCHEMATIC_WHITNEY_B,
    usesGeneratorContactRings: true,
    usesMotorCommutator: false,
  };
}

export function teslaBAt(
  omegaT: number,
  phaseCount: 2 | 3 = 2,
): { bx: number; by: number; bxSvg: number; bySvg: number; coilCount: number } {
  const coilCount = phaseCount === 2 ? 4 : 6;
  let fieldX = 0;
  let fieldY = 0;
  for (let i = 0; i < coilCount; i++) {
    const a = (i * 2 * Math.PI) / coilCount - Math.PI / 2;
    const phaseOff = (i % phaseCount) * (phaseCount === 2 ? Math.PI / 2 : (2 * Math.PI) / 3);
    const polarity = i >= phaseCount ? -1 : 1;
    const current = polarity * Math.sin(omegaT + phaseOff);
    fieldX += current * Math.cos(a);
    fieldY += current * Math.sin(a);
  }
  const norm = Math.hypot(fieldX, fieldY) || 1;
  const bx = fieldX / norm;
  const by = fieldY / norm;
  return {
    bx,
    by,
    bxSvg: bx * TESLA_B_VECTOR_SVG_SCALE,
    bySvg: by * TESLA_B_VECTOR_SVG_SCALE,
    coilCount,
  };
}

/** Tesla Fig. 4: eight successive rotating-field positions. */
export function teslaFig4Strobe(phaseCount: 2 | 3 = 2): TeslaFieldSample[] {
  const samples: TeslaFieldSample[] = [];
  for (let n = 0; n < TESLA_STROBE_COUNT; n++) {
    const omegaT = (n * Math.PI) / 4;
    const { bx, by } = teslaBAt(omegaT, phaseCount);
    samples.push({ omegaT, bx, by });
  }
  return samples;
}
