/**
 * Tesla polyphase rotating-field samples.
 * Fig. 4 of US 381,968 is eight successive positions of the B-vector.
 */

export const TESLA_PATENT_ID = "us-381968-tesla-motor";
export const TESLA_STROBE_COUNT = 8;

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
