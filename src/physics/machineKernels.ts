/**
 * Shared step buffers for CCD wells, Howe lockstitch, Engelbart wheels,
 * Sholes typebasket, Mergenthaler slug cycle, Reno cleat deck, and Otis pawls.
 * Components must draw these values rather than inventing a second formula.
 */

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
  };
}

/** Poly-silicon gate bar X on the 2D CCD face. Shared by 2D. */
export function ccdGateSvgX(index: number, pitch = 50) {
  return index * pitch;
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
    clothStudioAdvancePerS: Number((stitchFrequencyHz * pitch * 0.1).toFixed(3)),
  };
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
  };
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
  };
}

/** Brass matrix seat on the 2D slug face. Shared by 2D. */
export function mergenthalerMatrixSvgX(index: number, originX = 5, pitch = 18) {
  return originX + index * pitch;
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
} {
  const massKg = 400 + (params.cabPayloadKg ?? 650);
  const tensionPct = params.cableTensionPct ?? 100;
  const isSnapped = tensionPct < 15;
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
  };
}
