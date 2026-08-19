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
export const TESLA_STATOR_POLE_SVG_R = 108;
export const TESLA_TWO_PHASE_VECTOR_SVG_R = 52;
export const TESLA_THREE_PHASE_VECTOR_SVG_R = 42;
export const TESLA_STATOR_CENTER_X = 200;
export const TESLA_STATOR_CENTER_Y = 150;
export const TESLA_SCHEMATIC_STROBE_LEN = 28;
export const TESLA_SCHEMATIC_LIVE_LEN = 44;
export const TESLA_SCHEMATIC_WHITNEY_POS = 70;
export const TESLA_SCHEMATIC_WHITNEY_B = 80;
export const TESLA_SCHEMATIC_STROBE_OPACITY_BASE = 0.18;
export const TESLA_SCHEMATIC_STROBE_OPACITY_STEP = 0.04;
export const TESLA_SCHEMATIC_STROBE_STROKE = 1.2;
export const TESLA_SCHEMATIC_LIVE_STROKE = 2.5;

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
  schematicStrobeOpacityBase: number;
  schematicStrobeOpacityStep: number;
  schematicStrobeStroke: number;
  schematicLiveStroke: number;
  statorRingOuterSvgR: number;
  statorRingInnerSvgR: number;
  statorPoleSvgW: number;
  statorPoleSvgH: number;
  twoPhaseVectorOpacity: number;
  threePhaseVectorOpacity: number;
  schematicStatorOuterR: number;
  schematicStatorInnerR: number;
  schematicRotorR: number;
  schematicHubR: number;
  statorPoleSvgR: number;
  twoPhaseVectorSvgR: number;
  threePhaseVectorSvgR: number;
  statorCenterX: number;
  statorCenterY: number;
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
    schematicStrobeOpacityBase: TESLA_SCHEMATIC_STROBE_OPACITY_BASE,
    schematicStrobeOpacityStep: TESLA_SCHEMATIC_STROBE_OPACITY_STEP,
    schematicStrobeStroke: TESLA_SCHEMATIC_STROBE_STROKE,
    schematicLiveStroke: TESLA_SCHEMATIC_LIVE_STROKE,
    statorRingOuterSvgR: 110,
    statorRingInnerSvgR: 95,
    statorPoleSvgW: 36,
    statorPoleSvgH: 24,
    twoPhaseVectorOpacity: 0.55,
    threePhaseVectorOpacity: 0.5,
    schematicStatorOuterR: 95,
    schematicStatorInnerR: 65,
    schematicRotorR: 42,
    schematicHubR: 8,
    statorPoleSvgR: TESLA_STATOR_POLE_SVG_R,
    twoPhaseVectorSvgR: TESLA_TWO_PHASE_VECTOR_SVG_R,
    threePhaseVectorSvgR: TESLA_THREE_PHASE_VECTOR_SVG_R,
    statorCenterX: TESLA_STATOR_CENTER_X,
    statorCenterY: TESLA_STATOR_CENTER_Y,
    usesGeneratorContactRings: true,
    usesMotorCommutator: false,
  };
}

/** Electrical phase offset of one stator pole. Shared by teslaBAt and 2D. */
export function teslaPolePhaseOff(poleIndex: number, phaseCount: 2 | 3) {
  return (poleIndex % phaseCount) * (phaseCount === 2 ? Math.PI / 2 : (2 * Math.PI) / 3);
}

/** Instantaneous pole current on the Fig. 9 ring. Shared by teslaBAt and 2D. */
export function teslaPoleCurrent(poleIndex: number, phaseCount: 2 | 3, omegaT: number) {
  const polarity = poleIndex >= phaseCount ? -1 : 1;
  const phaseOff = teslaPolePhaseOff(poleIndex, phaseCount);
  return {
    polarity,
    phaseOff,
    current: polarity * Math.sin(omegaT + phaseOff),
  };
}

/** Stator-coil SVG seat on the Fig. 9 ring. Shared by 2D. */
export function teslaStatorPole(
  poleIndex: number,
  coilCount: number,
  radius = TESLA_STATOR_POLE_SVG_R,
  cx = TESLA_STATOR_CENTER_X,
  cy = TESLA_STATOR_CENTER_Y,
) {
  const a = (poleIndex * 2 * Math.PI) / Math.max(1, coilCount) - Math.PI / 2;
  return {
    a,
    cx: Number((cx + Math.cos(a) * radius).toFixed(2)),
    cy: Number((cy + Math.sin(a) * radius).toFixed(2)),
    rotateDeg: Number(((a * 180) / Math.PI + 90).toFixed(2)),
  };
}

/** Phase-contribution vectors that sum to the rotating field. Shared by 2D. */
export function teslaPhaseVectors(omegaT: number, phaseCount: 2 | 3 = 2) {
  if (phaseCount === 2) {
    const r = TESLA_TWO_PHASE_VECTOR_SVG_R;
    return [
      { x: Number((Math.cos(omegaT) * r).toFixed(2)), y: 0, color: "#f59e0b" },
      { x: 0, y: Number((Math.sin(omegaT) * r).toFixed(2)), color: "#3b82f6" },
    ];
  }
  const r = TESLA_THREE_PHASE_VECTOR_SVG_R;
  return [0, 1, 2].map((ph) => {
    const mag = Math.sin(omegaT - (ph * 2 * Math.PI) / 3) * r;
    const ax = Math.cos((ph * 2 * Math.PI) / 3);
    const ay = Math.sin((ph * 2 * Math.PI) / 3);
    const colors = ["#f59e0b", "#3b82f6", "#10b981"];
    return {
      x: Number((ax * mag).toFixed(2)),
      y: Number((ay * mag).toFixed(2)),
      color: colors[ph],
    };
  });
}

/** kHz / kV / MV leftovers shared by WASM and host coil steps. */
export function teslaCoilSiUnits(
  resonantFreqKhz: number,
  inputKv: number,
  secondaryPotentialMv: number,
) {
  return {
    resonantFreqHz: Number((Math.max(0, resonantFreqKhz) * 1000).toFixed(0)),
    inputVoltageVolts: Number((Math.max(0, inputKv) * 1000).toFixed(0)),
    secondaryPotentialVolts: Number((Math.max(0, secondaryPotentialMv) * 1e6).toFixed(0)),
    secondaryTurnCount: 18,
    windingTaperPx: 0.55,
    windingPitchY: 7.5,
    windingHalfW: 25,
    schematicToploadCx: 200,
    schematicToploadCy: 70,
    schematicToploadRx: 50,
    schematicToploadRy: 18,
  };
}

/** Secondary helical turn on the 2D resonator. Shared by 2D. */
export function teslaCoilWindingSvg(index: number, taperPx = 0.55, pitchY = 7.5, halfW = 25) {
  return {
    x1: Number((-halfW + index * taperPx).toFixed(2)),
    y1: Number((-index * pitchY).toFixed(2)),
    x2: Number((halfW - index * taperPx).toFixed(2)),
    y2: Number((-index * pitchY - 3).toFixed(2)),
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
    const { current } = teslaPoleCurrent(i, phaseCount, omegaT);
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

/** Fig. 4 strobe fade on the schematic. Shared by the schematic. */
export function teslaSchematicStrobeOpacity(
  index: number,
  base = TESLA_SCHEMATIC_STROBE_OPACITY_BASE,
  step = TESLA_SCHEMATIC_STROBE_OPACITY_STEP,
) {
  return Number((base + index * step).toFixed(3));
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
