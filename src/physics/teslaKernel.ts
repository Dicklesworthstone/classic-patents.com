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

export interface TeslaFieldSample {
  omegaT: number;
  bx: number;
  by: number;
}

export function teslaBAt(
  omegaT: number,
  phaseCount: 2 | 3 = 2,
): { bx: number; by: number; coilCount: number } {
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
  return { bx: fieldX / norm, by: fieldY / norm, coilCount };
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
