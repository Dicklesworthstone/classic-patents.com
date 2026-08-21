/**
 * Shared step buffers for CCD wells, Howe lockstitch, Engelbart wheels,
 * Sholes typebasket, Mergenthaler slug cycle, Reno cleat deck, and Otis pawls.
 * Components must draw these values rather than inventing a second formula.
 */

import { otisCableTruss } from "./deepWasm";

export function stepCcdWells(
  phase: 1 | 2 | 3,
  lux: number,
  clockMhz: number,
  gateVoltageV: number = 8,
): {
  wells: [number, number, number];
  photoElectrons: number;
  fullWellElectrons: number;
  cte: number;
  ctePct: number;
  packetOpacity: number;
  wellSvgDepthBase: number;
  wellSvgDepthSpan: number;
  wellSvgDepthMax: number;
  wellSvgDepths: [number, number, number];
  outputSignalMv: number;
  phasePeriodNs: number;
  phaseDisplayMs: number;
  phaseDisplayS: number;
  gateSvgCount: number;
  gateSvgPitch: number;
  gateSvgWidth: number;
  gateSvgH: number;
  gateLabelDx: number;
  gatePhaseCount: number;
  schematicGateCount: number;
  schematicGateOriginX: number;
  schematicGatePitch: number;
  schematicGateWidth: number;
  schematicGateY: number;
  schematicGateH: number;
  schematicSubstrateX: number;
  schematicSubstrateY: number;
  schematicSubstrateW: number;
  schematicSubstrateH: number;
  schematicPolyY: number;
  schematicPolyH: number;
  schematicPacketD: string;
  packetCount: number;
  packetGateStride: number;
  packetSvgRx: number;
  packetSvgRy: number;
  packetSvgY: number;
} {
  const f = Math.max(0.1, clockMhz);
  const cte = Math.max(0.999, 0.99995 - clockMhz * 1e-5);
  const fullWellElectrons = Math.max(1, Math.round(12500 * Math.max(0, gateVoltageV)));
  const photoElectrons = Math.min(fullWellElectrons, Math.round((Math.max(0, lux) / 1000) * 45000));
  const wells: [number, number, number] = [0, 0, 0];
  const idx = phase - 1;
  wells[idx] = photoElectrons;
  const residual = photoElectrons * (1 - cte);
  wells[(idx + 2) % 3] += residual;
  const outputSignalMv = Number((((photoElectrons * 1.602e-19) / 10e-15) * 1000).toFixed(1));
  return {
    wells,
    photoElectrons,
    fullWellElectrons,
    cte,
    ctePct: Number((cte * 100).toFixed(4)),
    packetOpacity: Number((0.35 + cte * 0.55).toFixed(4)),
    wellSvgDepthBase: 12,
    wellSvgDepthSpan: 65,
    wellSvgDepthMax: 70,
    wellSvgDepths: [
      ccdWellSvgDepth(wells[0], fullWellElectrons),
      ccdWellSvgDepth(wells[1], fullWellElectrons),
      ccdWellSvgDepth(wells[2], fullWellElectrons),
    ] as [number, number, number],
    outputSignalMv,
    // Real 3-phase gate step: T = 1/(3f).
    phasePeriodNs: Number((1000 / (f * 3)).toFixed(1)),
    // Visible bucket-brigade step. 500 ms/MHz ≡ 1500/(3f), not a leftover 2-phase 1/(2f).
    phaseDisplayMs: Math.max(40, Math.round(500 / f)),
    phaseDisplayS: Number((Math.max(40, Math.round(500 / f)) / 1000).toFixed(4)),
    gateSvgCount: 9,
    gateSvgPitch: 50,
    gateSvgWidth: 45,
    gateSvgH: 18,
    gateLabelDx: 12,
    gatePhaseCount: 3,
    schematicGateCount: 6,
    schematicGateOriginX: 70,
    schematicGatePitch: 45,
    schematicGateWidth: 36,
    schematicGateY: 100,
    schematicGateH: 40,
    schematicSubstrateX: 60,
    schematicSubstrateY: 160,
    schematicSubstrateW: 280,
    schematicSubstrateH: 50,
    schematicPolyY: 140,
    schematicPolyH: 20,
    schematicPacketD: "M 88 180 Q 133 150 178 180",
    packetCount: 3,
    packetGateStride: 3,
    packetSvgRx: 16,
    packetSvgRy: 8,
    packetSvgY: 50,
  };
}

/** Charge-packet gate index on the 2D well face. Shared by 2D. */
export function ccdPacketGateIndex(packetIndex: number, clockPhase: 1 | 2 | 3, stride = 3) {
  return packetIndex * stride + (clockPhase - 1);
}

/** Schematic poly-silicon gate X on the CCD face. Shared by the schematic. */
export function ccdSchematicGateX(index: number, originX = 70, pitch = 45) {
  return originX + index * pitch;
}

/** Poly-silicon gate bar X on the 2D CCD face. Shared by 2D. */
export function ccdGateSvgX(index: number, pitch = 50) {
  return index * pitch;
}

/** 3-phase gate clock index (1, 2, 3) on the 2D CCD face. Shared by 2D. */
export function ccdGatePhase(index: number, phaseCount = 3): 1 | 2 | 3 {
  const count = Math.max(1, Math.floor(phaseCount));
  return ((((index % count) + count) % count) + 1) as 1 | 2 | 3;
}

/** Next 3-phase clock (1→2→3→1). Shared by 2D and 3D. */
export function ccdNextPhase(phase: 1 | 2 | 3, phaseCount = 3): 1 | 2 | 3 {
  return ccdGatePhase(phase, phaseCount);
}

/** Potential-well SVG depth from packet fill. Shared by 2D. */
export function ccdWellSvgDepth(
  charge: number,
  fullWellElectrons: number,
  base = 12,
  span = 65,
  maxDepth = 70,
) {
  return Number(
    (
      base + Math.min(maxDepth, (Math.max(0, charge) / Math.max(1, fullWellElectrons)) * span)
    ).toFixed(2),
  );
}

export function stepHoweSewingMachine(
  flywheelRpm: number,
  stitchTensionGrams: number,
  stitchPitchMm: number = 3.5,
) {
  const rpm = Math.max(0, flywheelRpm);
  const stitchFrequencyHz = Number((rpm / 60).toFixed(1));
  const pitch = Math.max(0.5, stitchPitchMm);
  return {
    stitchesPerMinute: rpm,
    stitchFrequencyHz,
    cycleTimeMs: Math.round(1000 / Math.max(0.01, stitchFrequencyHz)),
    lockstitchShearStrengthN: Math.round(stitchTensionGrams * 0.088),
    stitchPitchMm: pitch,
    clothFeedMmPerS: Number((stitchFrequencyHz * pitch).toFixed(1)),
    crankOmegaRadPerS: Number((stitchFrequencyHz * 2 * Math.PI).toFixed(3)),
    crankOmegaDegPerS: Number((stitchFrequencyHz * 360).toFixed(1)),
    crankDisplayTickMs: 30,
    crankDisplayTickS: 0.03,
    displayWrapDeg: 360,
    clothStudioAdvancePerS: Number((stitchFrequencyHz * pitch * 0.1).toFixed(3)),
    clothStudioWrap: 2,
    schematicShuttleCx: 300,
    schematicShuttleCy: 150,
    schematicShuttleR: 32,
    schematicNeedleX: 220,
    schematicNeedleY: 178,
    schematicNeedleR: 3,
    schematicBedX: 70,
    schematicBedY: 190,
    schematicBedW: 260,
    schematicBedH: 22,
    schematicArmD: "M 90 190 L 90 90 L 220 90 L 220 130",
    schematicShuttleArmDx: 22,
    schematicShuttleArmDy: -18,
    schematicNeedleY0: 130,
    schematicNeedleY1: 175,
    schematicFeedX: 200,
    schematicFeedY: 200,
    schematicFeedW: 40,
    schematicFeedH: 12,
    stitchXs: [100, 140, 180, 220],
    stitchLen: 40,
    stitchUpperY: 150,
    stitchLowerY: 168,
  };
}

/** Completed lockstitch seat on the 2D face. Shared by 2D. */
export function howeStitch(
  index: number,
  xs = [100, 140, 180, 220],
  len = 40,
  upperY = 150,
  lowerY = 168,
) {
  const i = ((index % xs.length) + xs.length) % xs.length;
  return { x: xs[i], x2: xs[i] + len, upperY, lowerY };
}

export function stepHoweLockstitch(crankDeg: number): {
  needleY: number;
  shuttleX: number;
  loopOpen: boolean;
  loopWidth: number;
  loopSvgControlX: number;
  needleStudioRotZ: number;
  needleStudioY: number;
  shuttleStudioZ: number;
} {
  const rad = (crankDeg * Math.PI) / 180;
  const loopOpen = crankDeg > 80 && crankDeg < 220;
  const sinR = Math.sin(rad);
  const cosR = Math.cos(rad);
  const loopWidth = loopOpen ? Math.sin((crankDeg - 80) * (Math.PI / 140)) * 24 : 0;
  return {
    needleY: sinR * 45,
    shuttleX: cosR * 60,
    loopOpen,
    loopWidth,
    loopSvgControlX: Number((loopWidth * 1.5).toFixed(2)),
    needleStudioRotZ: Number((sinR * 0.45).toFixed(4)),
    needleStudioY: Number((1.8 + sinR * 0.5).toFixed(4)),
    shuttleStudioZ: Number((cosR * 1.2).toFixed(4)),
  };
}

export function stepEngelbartResolver(
  dxSvg: number,
  dySvg: number,
  wheelRadiusMm: number,
  pulsesPerRev: number,
): { dThetaX: number; dThetaY: number; pulsesX: number; pulsesY: number } {
  const mmPerSvg = 0.25;
  const dxMm = dxSvg * mmPerSvg;
  const dyMm = dySvg * mmPerSvg;
  const circ = 2 * Math.PI * wheelRadiusMm;
  const dThetaX = circ > 0 ? (dxMm / circ) * 2 * Math.PI : 0;
  const dThetaY = circ > 0 ? (dyMm / circ) * 2 * Math.PI : 0;
  const pulsesX = Math.round((dThetaX / (2 * Math.PI)) * pulsesPerRev);
  const pulsesY = Math.round((dThetaY / (2 * Math.PI)) * pulsesPerRev);
  return { dThetaX, dThetaY, pulsesX, pulsesY };
}

export const LINOTYPE_CHARS_PER_LINE = 42;

/**
 * A source-constrained display cycle for US 79,265.
 *
 * The grant explains the causal order (key L raises bar T; forks on H release
 * ratchet I; the carriage moves one notch while the type-bar falls), but gives
 * no character pitch, type-bar count, throw angle, mass, or speed. This helper
 * therefore exposes only a visitor-selected demonstration cadence and relative
 * phase values. It must never be labelled as measured machine telemetry.
 */
export function stepSholesTypewriter(
  demonstrationCadencePerMin: number,
  elapsedS: number,
): {
  eventsPerSecond: number;
  completedSteps: number;
  keyCyclePct: number;
  ratchetReleasePct: number;
  displayTypebarIndex: number;
  displayColumnWrap: number;
  columnPitchPx: number;
  typebarOuterRx: number;
  typebarOuterRy: number;
  typebarRestRx: number;
  typebarRestRy: number;
  typebarHubX: number;
  typebarHubY: number;
  typebarPlatenY: number;
  ratchetSvgR: number;
  schematicTypebarHubX: number;
  schematicTypebarHubY: number;
  schematicTypebarR: number;
  schematicTypebarStartDeg: number;
  schematicTypebarPitchDeg: number;
  schematicTypebarCount: number;
  schematicBasketR: number;
  schematicHubR: number;
  schematicPlatenX: number;
  schematicPlatenY: number;
  schematicPlatenW: number;
  schematicPlatenH: number;
  ratchetToothCount: number;
  ratchetToothPitchDeg: number;
  typebarYawAmp: number;
  hammerPitchAmp: number;
  typebarPitchAmp: number;
  keyHomeY: number;
  keyRowPitch: number;
  keysPerRow: number;
  keyDip: number;
  spaceBarHomeY: number;
  spaceBarActiveY: number;
  spaceBarThreshold: number;
  escapementStepRad: number;
  ribbonStepRad: number;
  carriagePitchStudio: number;
} {
  const cadence = Math.min(120, Math.max(0, demonstrationCadencePerMin));
  const eventsPerSecond = cadence / 60;
  const cycleCount = Math.max(0, elapsedS) * eventsPerSecond;
  const keyCyclePct = eventsPerSecond > 0 ? cycleCount % 1 : 0;
  const completedSteps = Math.floor(cycleCount);
  return {
    eventsPerSecond,
    completedSteps,
    keyCyclePct,
    ratchetReleasePct: keyCyclePct < 0.35 ? keyCyclePct / 0.35 : 0,
    // This indexes only diagrammatic bars in the presentation, never a
    // claim about how many bars the source machine used.
    displayTypebarIndex: completedSteps % 12,
    displayColumnWrap: 12,
    columnPitchPx: 6,
    typebarOuterRx: 140,
    typebarOuterRy: 70,
    typebarRestRx: 25,
    typebarRestRy: 15,
    typebarHubX: 300,
    typebarHubY: 200,
    typebarPlatenY: 75,
    ratchetSvgR: 18,
    schematicTypebarHubX: 200,
    schematicTypebarHubY: 170,
    schematicTypebarR: 60,
    schematicTypebarStartDeg: 20,
    schematicTypebarPitchDeg: 25,
    schematicTypebarCount: 14,
    schematicBasketR: 65,
    schematicHubR: 10,
    schematicPlatenX: 130,
    schematicPlatenY: 60,
    schematicPlatenW: 140,
    schematicPlatenH: 30,
    ratchetToothCount: 12,
    ratchetToothPitchDeg: 30,
    typebarYawAmp: 0.12,
    hammerPitchAmp: 0.5,
    typebarPitchAmp: 0.65,
    keyHomeY: 0.25,
    keyRowPitch: 0.12,
    keysPerRow: 10,
    keyDip: 0.16,
    spaceBarHomeY: -0.32,
    spaceBarActiveY: -0.38,
    spaceBarThreshold: 0.8,
    escapementStepRad: 0.06,
    ribbonStepRad: 0.02,
    carriagePitchStudio: 0.18,
  };
}

/** Alternating type-bar yaw sign on the 3D basket. Shared by 3D. */
export function sholesTypebarYawSign(index: number) {
  return index % 2 === 0 ? 1 : -1;
}

/** Escapement carriage X on the 3D platen. Shared by 3D. */
export function sholesCarriageStudioX(index: number, wrap = 12, pitch = 0.18) {
  const w = Math.max(1, wrap);
  return 0 - (((index % w) + w) % w) * pitch;
}

/** Key-lever studio Y on the 3D keyboard. Shared by 3D. */
export function sholesKeyStudioY(
  kIndex: number,
  active: boolean,
  homeY = 0.25,
  rowPitch = 0.12,
  keysPerRow = 10,
  dip = 0.16,
) {
  return homeY - Math.floor(kIndex / Math.max(1, keysPerRow)) * rowPitch - (active ? dip : 0);
}

/** Diagrammatic type-bar throw on the US 79,265 2D face. Shared by 2D. */
export function sholesTypebarPose(
  barIndex: number,
  activeKeyIndex: number,
  outerRx = 140,
  outerRy = 70,
  restRx = 25,
  restRy = 15,
  hubX = 300,
  hubY = 200,
  platenY = 75,
) {
  const bAngle = barIndex * 30 + 15;
  const rad = (bAngle * Math.PI) / 180;
  const isActive = barIndex === activeKeyIndex;
  return {
    bAngle,
    isActive,
    xStart: Number((hubX + Math.cos(rad) * outerRx).toFixed(2)),
    yStart: Number((hubY + Math.sin(rad) * outerRy).toFixed(2)),
    xEnd: Number((isActive ? hubX : hubX + Math.cos(rad) * restRx).toFixed(2)),
    yEnd: Number((isActive ? platenY : hubY + Math.sin(rad) * restRy).toFixed(2)),
  };
}

/** Radial type-bar seat on the schematic basket. Shared by the schematic. */
export function sholesSchematicTypebar(
  index: number,
  startDeg = 20,
  pitchDeg = 25,
  cx = 200,
  cy = 170,
  radius = 60,
) {
  const deg = startDeg + index * pitchDeg;
  const rad = (deg * Math.PI) / 180;
  return {
    deg,
    x: Number((cx + Math.cos(rad) * radius).toFixed(2)),
    y: Number((cy + Math.sin(rad) * radius).toFixed(2)),
  };
}

export function stepMergenthalerLinotype(params: {
  matrixRatePerMin?: number;
  spacebandWedgeMm?: number;
  potTempC?: number;
  elapsedS?: number;
}): {
  justificationWidthMm: number;
  solidificationTimeMs: number;
  brinellHardness: number;
  distributorFreqHz: number;
  isEutecticTemp: boolean;
  plungerY: number;
  moldAngle: number;
  slugOut: boolean;
  cycleS: number;
  phase: number;
  alloyMeltPointC: number;
  linesPerHour: number;
  solidificationTimeSec: number;
  charsPerHour: number;
  linesPerMin: number;
  wedgeLift: number;
  slugSvgWidth: number;
  matrixCount: number;
  matrixSvgPitch: number;
  matrixSvgOriginX: number;
  matrixSvgWidth: number;
  schematicChuteCount: number;
  schematicChuteOriginX: number;
  schematicChutePitchX: number;
  schematicChuteDx: number;
  schematicChuteY1: number;
  schematicChuteY2: number;
  schematicMoldCx: number;
  schematicMoldCy: number;
  schematicMoldR: number;
  schematicMagazinePoints: string;
  schematicAssemblerX: number;
  schematicAssemblerY: number;
  schematicAssemblerW: number;
  schematicAssemblerH: number;
  schematicPumpX: number;
  schematicPumpY: number;
  schematicPumpW: number;
  schematicPumpH: number;
  schematicDistributorX1: number;
  schematicDistributorX2: number;
  schematicDistributorY: number;
  spacebandSvgXs: number[];
  spacebandSvgTopW: number;
  spacebandSvgFlare: number;
  spacebandSvgY0: number;
  spacebandSvgY1: number;
  distributorArmHalf: number;
  distributorArmAmp: number;
  starWheelStepRad: number;
  distributorScrewStepRad: number;
} {
  const rate = params.matrixRatePerMin ?? 60;
  const wedge = params.spacebandWedgeMm ?? 6.5;
  const temp = params.potTempC ?? 260;
  const elapsedS = params.elapsedS ?? 0;
  const isEutecticTemp = temp >= 240 && temp <= 275;
  const linesPerMin = rate / LINOTYPE_CHARS_PER_LINE;
  const cycleS = 60 / Math.max(0.25, linesPerMin);
  const phase = (elapsedS / cycleS) % 1;
  const solidificationTimeMs = Math.round(450 * (temp / 260));
  const justificationWidthMm = Number((85 + wedge * 4.2).toFixed(1));
  return {
    justificationWidthMm,
    solidificationTimeMs,
    brinellHardness: isEutecticTemp ? 24 : Math.round(16 + (temp / 260) * 5),
    distributorFreqHz: Number((rate / 60).toFixed(2)),
    isEutecticTemp,
    plungerY: Math.sin(phase * Math.PI * 2) * 0.25,
    moldAngle: phase * Math.PI * 2,
    slugOut: phase > 0.72 && phase < 0.92,
    cycleS,
    phase,
    alloyMeltPointC: 240,
    linesPerHour: isEutecticTemp ? Math.round(3600 / Math.max(0.25, cycleS)) : 0,
    solidificationTimeSec: Number((solidificationTimeMs / 1000).toFixed(2)),
    charsPerHour: Math.round(rate * 60),
    linesPerMin: Number((rate / LINOTYPE_CHARS_PER_LINE).toFixed(2)),
    wedgeLift: Number(((wedge / 10) * 0.15).toFixed(4)),
    slugSvgWidth: Number((justificationWidthMm * 2.8).toFixed(2)),
    matrixCount: 8,
    matrixSvgPitch: 18,
    matrixSvgOriginX: 5,
    matrixSvgWidth: 12,
    schematicChuteCount: 3,
    schematicChuteOriginX: 140,
    schematicChutePitchX: 40,
    schematicChuteDx: -30,
    schematicChuteY1: 40,
    schematicChuteY2: 130,
    schematicMoldCx: 280,
    schematicMoldCy: 180,
    schematicMoldR: 45,
    schematicMagazinePoints: "120,40 240,40 210,130 90,130",
    schematicAssemblerX: 70,
    schematicAssemblerY: 145,
    schematicAssemblerW: 160,
    schematicAssemblerH: 25,
    schematicPumpX: 260,
    schematicPumpY: 172,
    schematicPumpW: 40,
    schematicPumpH: 16,
    schematicDistributorX1: 80,
    schematicDistributorX2: 320,
    schematicDistributorY: 20,
    spacebandSvgXs: [50, 105],
    spacebandSvgTopW: 6,
    spacebandSvgFlare: 2,
    spacebandSvgY0: 4,
    spacebandSvgY1: 46,
    distributorArmHalf: 0.5,
    distributorArmAmp: 0.15,
    starWheelStepRad: 0.05,
    distributorScrewStepRad: 0.08,
  };
}

/** Magazine-chute divider on the schematic. Shared by the schematic. */
export function mergenthalerSchematicChuteX(index: number, originX = 140, pitchX = 40) {
  return originX + index * pitchX;
}

/** Brass matrix seat on the 2D slug face. Shared by 2D. */
export function mergenthalerMatrixSvgX(index: number, originX = 5, pitch = 18) {
  return originX + index * pitch;
}

/** Expanding spaceband wedge on the 2D assembler. Shared by 2D. */
export function mergenthalerSpaceband(
  index: number,
  xs = [50, 105],
  topW = 6,
  flare = 2,
  y0 = 4,
  y1 = 46,
) {
  const i = ((index % xs.length) + xs.length) % xs.length;
  const x = xs[i];
  return {
    points: `${x},${y0} ${x + topW},${y0} ${x + topW + flare},${y1} ${x - flare},${y1}`,
  };
}

export function stepRenoEscalator(params: {
  passengerCount?: number;
  inclineAngleDeg?: number;
  velocityMps?: number;
  elapsedS?: number;
}): {
  throughputPerHour: number;
  motorTorqueNm: number;
  motorPowerKw: number;
  combPlateClearanceMm: number;
  speedFpm: number;
  cleatOffset: number;
  cleatPitch: number;
  sheaveOmegaRadPerS: number;
  treadSvgAdvancePerS: number;
  treadSvgWrapPx: number;
  cleatSvgPitchPx: number;
  cleatSvgWrapPx: number;
  cleatSvgOriginX: number;
  cleatSvgOriginY: number;
  cleatSvgXScale: number;
  cleatSvgYScale: number;
  cleatSvgRotateDeg: number;
  schematicCleatCount: number;
  schematicCleatOriginX: number;
  schematicCleatOriginY: number;
  schematicCleatPitchX: number;
  schematicCleatPitchY: number;
  schematicCleatW: number;
  schematicCleatH: number;
  schematicInclineX1: number;
  schematicInclineY1: number;
  schematicInclineX2: number;
  schematicInclineY2: number;
  schematicHandrailX1: number;
  schematicHandrailY1: number;
  schematicHandrailX2: number;
  schematicHandrailY2: number;
  schematicCombUpper: string;
  schematicCombLower: string;
} {
  const passengers = params.passengerCount ?? 30;
  const angleDeg = params.inclineAngleDeg ?? 25;
  const v = params.velocityMps ?? 0.45;
  const elapsedS = params.elapsedS ?? 0;
  const angleRad = (angleDeg * Math.PI) / 180;
  const gravityLoadN = passengers * 700 * Math.sin(angleRad);
  const frictionLoadN = passengers * 700 * Math.cos(angleRad) * 0.03 + 800;
  const motorTorqueNm = Math.round(((gravityLoadN + frictionLoadN) * 0.35) / 0.88);
  const cleatPitch = 0.42;
  return {
    throughputPerHour: Math.round((v * 2 * 3600) / 0.5),
    motorTorqueNm,
    motorPowerKw: Number(((motorTorqueNm * (v / 0.35)) / 1000).toFixed(2)),
    combPlateClearanceMm: 1.2,
    speedFpm: Math.round((v * 60) / 0.3048),
    cleatOffset: (((v * elapsedS) % cleatPitch) + cleatPitch) % cleatPitch,
    cleatPitch,
    sheaveOmegaRadPerS: Number((v / 0.45).toFixed(4)),
    treadSvgAdvancePerS: Number((v * 40).toFixed(3)),
    treadSvgWrapPx: 40,
    cleatSvgPitchPx: 35,
    cleatSvgWrapPx: 490,
    cleatSvgOriginX: 80,
    cleatSvgOriginY: 275,
    cleatSvgXScale: 0.85,
    cleatSvgYScale: 0.38,
    cleatSvgRotateDeg: -25,
    schematicCleatCount: 7,
    schematicCleatOriginX: 60,
    schematicCleatOriginY: 200,
    schematicCleatPitchX: 42,
    schematicCleatPitchY: 20,
    schematicCleatW: 22,
    schematicCleatH: 10,
    schematicInclineX1: 40,
    schematicInclineY1: 210,
    schematicInclineX2: 340,
    schematicInclineY2: 70,
    schematicHandrailX1: 40,
    schematicHandrailY1: 170,
    schematicHandrailX2: 340,
    schematicHandrailY2: 30,
    schematicCombUpper: "330,65 360,65 345,78",
    schematicCombLower: "30,205 60,205 45,218",
  };
}

/** Fig. schematic cleat seat on the 25° incline. Shared by the schematic. */
export function renoSchematicCleat(
  index: number,
  originX = 60,
  originY = 200,
  pitchX = 42,
  pitchY = 20,
) {
  return {
    x: originX + index * pitchX,
    y: originY - index * pitchY,
  };
}

export function renoCleatSvg(
  index: number,
  treadOffset: number,
  pitchPx = 35,
  wrapPx = 490,
  originX = 80,
  originY = 275,
  xScale = 0.85,
  yScale = 0.38,
) {
  const basePos = (index * pitchPx + treadOffset) % wrapPx;
  return {
    x: originX + basePos * xScale,
    y: originY - basePos * yScale,
  };
}

export function stepOtisElevator(params: { cabPayloadKg?: number; cableTensionPct?: number }): {
  cabPayloadKg: number;
  cableTensionPct: number;
  isSnapped: boolean;
  springDeflectionCm: number;
  isPawlEngaged: boolean;
  stoppingDistanceCm: number;
  peakArrestForceKn: number;
  pawlEngagementMs: number;
  hangingMassKg: number;
  hoistTensionKn: number;
  cabPayloadLbs: number;
  stoppingDistanceIn: number;
  springBowY: number;
  cabFallPx: number;
  schematicSpringBowPx: number;
  schematicPawlExtPx: number;
  springBowSvgH: number;
  pawlSvgX: number;
  pawlSvgY: number;
  railSvgPitch: number;
  schematicRailOriginY: number;
  schematicRailPitchY: number;
  schematicRailCount: number;
  schematicRailLeftX: number;
  schematicRailRightX: number;
  schematicRailY0: number;
  schematicRailY1: number;
  schematicFrameX: number;
  schematicFrameY: number;
  schematicFrameW: number;
  schematicFrameH: number;
  schematicRopeX: number;
  schematicRopeY0: number;
  schematicRopeAttachY: number;
  schematicToothIn: number;
  schematicToothMid: number;
  schematicToothH: number;
  schematicCutY1: number;
  schematicCutY2: number;
  schematicCutDx: number;
  schematicSpringX0: number;
  schematicSpringX1: number;
  schematicSpringY: number;
  schematicPawlInnerX0: number;
  schematicPawlInnerX1: number;
  schematicPawlOuterBase0: number;
  schematicPawlOuterBase1: number;
  schematicPawlY0: number;
  schematicPawlY1: number;
  leafSpringHomeY: number;
  shackleHomeY: number;
  shackleBowCoupling: number;
  pawlDisengagedRotZ: number;
  pawlLerpPerS: number;
  cabCaughtY: number;
  hoistOmega: number;
  hoistAmp: number;
  sheaveAmp: number;
  cableTrussForce: number;
  cableCertificate: "Certified" | "Estimated";
  cableRefused: boolean;
} {
  const massKg = 400 + (params.cabPayloadKg ?? 650);
  const tensionPct = params.cableTensionPct ?? 100;
  const isSnapped = tensionPct < 15;
  const cable = otisCableTruss(tensionPct);
  return {
    cabPayloadKg: params.cabPayloadKg ?? 650,
    cableTensionPct: tensionPct,
    isSnapped,
    hangingMassKg: massKg,
    springDeflectionCm: Number(((tensionPct / 100) * 10).toFixed(1)),
    isPawlEngaged: isSnapped,
    stoppingDistanceCm: isSnapped ? 4.5 : 0,
    peakArrestForceKn: isSnapped ? Number(((massKg * 9.81 * 1.8) / 1000).toFixed(1)) : 0,
    pawlEngagementMs: isSnapped ? 38 : 0,
    hoistTensionKn: Number(((massKg * 9.81) / 1000).toFixed(1)),
    cabPayloadLbs: Math.round((params.cabPayloadKg ?? 650) * 2.20462),
    stoppingDistanceIn: Number(((isSnapped ? 4.5 : 0) / 2.54).toFixed(1)),
    springBowY: isSnapped ? 0 : Number(((tensionPct / 100) * 0.22).toFixed(4)),
    cabFallPx: Number(((isSnapped ? 4.5 : 0) * (12 / 4.5)).toFixed(2)),
    schematicSpringBowPx: isSnapped ? 0 : 15,
    schematicPawlExtPx: isSnapped ? 15 : 4,
    springBowSvgH: isSnapped ? 0 : 18,
    pawlSvgX: isSnapped ? 18 : 4,
    pawlSvgY: isSnapped ? 0 : 7.2,
    railSvgPitch: 20,
    schematicRailOriginY: 50,
    schematicRailPitchY: 30,
    schematicRailCount: 6,
    schematicRailLeftX: 80,
    schematicRailRightX: 320,
    schematicRailY0: 30,
    schematicRailY1: 240,
    schematicFrameX: 100,
    schematicFrameY: 100,
    schematicFrameW: 200,
    schematicFrameH: 120,
    schematicRopeX: 200,
    schematicRopeY0: 20,
    schematicRopeAttachY: 90,
    schematicToothIn: 10,
    schematicToothMid: 6,
    schematicToothH: 12,
    schematicCutY1: 40,
    schematicCutY2: 55,
    schematicCutDx: 5,
    schematicSpringX0: 110,
    schematicSpringX1: 290,
    schematicSpringY: 100,
    schematicPawlInnerX0: 110,
    schematicPawlInnerX1: 290,
    schematicPawlOuterBase0: 100,
    schematicPawlOuterBase1: 300,
    schematicPawlY0: 100,
    schematicPawlY1: 105,
    leafSpringHomeY: 2.35,
    shackleHomeY: 0.35,
    shackleBowCoupling: 0.8,
    pawlDisengagedRotZ: 0.45,
    pawlLerpPerS: 25,
    cabCaughtY: -0.15,
    hoistOmega: 1.5,
    hoistAmp: 0.25,
    sheaveAmp: 0.3,
    cableTrussForce: cable.cableTrussForce,
    cableCertificate: cable.cableCertificate,
    cableRefused: cable.cableRefused,
  };
}

/** Safety-pawl seat on the schematic. Shared by the schematic. */
export function otisSchematicPawl(
  side: "left" | "right",
  pawlExt: number,
  innerX0 = 110,
  innerX1 = 290,
  outerBase0 = 100,
  outerBase1 = 300,
  y0 = 100,
  y1 = 105,
) {
  return side === "left"
    ? { x1: innerX0, y1: y0, x2: outerBase0 - pawlExt, y2: y1 }
    : { x1: innerX1, y1: y0, x2: outerBase1 + pawlExt, y2: y1 };
}

/** Guide-rail ratchet Y on the schematic. Shared by the schematic. */
export function otisSchematicRailY(index: number, originY = 50, pitchY = 30) {
  return originY + index * pitchY;
}
