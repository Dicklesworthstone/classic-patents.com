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
} {
  const cte = Math.max(0.999, 0.99995 - clockMhz * 1e-5);
  const fullWellElectrons = Math.max(1, Math.round(12500 * Math.max(0, gateVoltageV)));
  const photoElectrons = Math.min(fullWellElectrons, Math.round((Math.max(0, lux) / 1000) * 45000));
  const wells: [number, number, number] = [0, 0, 0];
  const idx = phase - 1;
  wells[idx] = photoElectrons;
  const residual = photoElectrons * (1 - cte);
  wells[(idx + 2) % 3] += residual;
  return { wells, photoElectrons, fullWellElectrons, cte };
}

export function stepHoweSewingMachine(flywheelRpm: number, stitchTensionGrams: number) {
  const rpm = Math.max(0, flywheelRpm);
  const stitchFrequencyHz = Number((rpm / 60).toFixed(1));
  return {
    stitchesPerMinute: rpm,
    stitchFrequencyHz,
    cycleTimeMs: Math.round(1000 / Math.max(0.01, stitchFrequencyHz)),
    lockstitchShearStrengthN: Math.round(stitchTensionGrams * 0.088),
  };
}

export function stepHoweLockstitch(crankDeg: number): {
  needleY: number;
  shuttleX: number;
  loopOpen: boolean;
  loopWidth: number;
} {
  const rad = (crankDeg * Math.PI) / 180;
  const loopOpen = crankDeg > 80 && crankDeg < 220;
  return {
    needleY: Math.sin(rad) * 45,
    shuttleX: Math.cos(rad) * 60,
    loopOpen,
    loopWidth: loopOpen ? Math.sin((crankDeg - 80) * (Math.PI / 140)) * 24 : 0,
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

/** 10-pitch Remington / Sholes platen: 1/10 inch per character. */
export const SHOLES_PITCH_MM = 2.54;
export const LINOTYPE_CHARS_PER_LINE = 42;

export function stepSholesTypewriter(
  typingSpeedWpm: number,
  elapsedS: number,
): {
  cps: number;
  pitchMm: number;
  carriageXMm: number;
  typebarStrikeAngleDeg: number;
  hammerAngleRad: number;
  barIndex: number;
  strikePhase: number;
} {
  const wpm = Math.max(0, typingSpeedWpm);
  const cps = (wpm * 5) / 60;
  const charsTyped = Math.max(0, elapsedS) * cps;
  const col = charsTyped % 70;
  const strikePhase = cps > 0 ? (elapsedS * cps) % 1 : 0;
  const typebarStrikeAngleDeg = 90;
  return {
    cps,
    pitchMm: SHOLES_PITCH_MM,
    carriageXMm: col * SHOLES_PITCH_MM,
    typebarStrikeAngleDeg,
    hammerAngleRad:
      strikePhase < 0.22 ? (strikePhase / 0.22) * ((-typebarStrikeAngleDeg * Math.PI) / 180) : 0,
    barIndex: Math.floor(charsTyped) % 24,
    strikePhase,
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
} {
  const rate = params.matrixRatePerMin ?? 60;
  const wedge = params.spacebandWedgeMm ?? 6.5;
  const temp = params.potTempC ?? 260;
  const elapsedS = params.elapsedS ?? 0;
  const isEutecticTemp = temp >= 240 && temp <= 275;
  const linesPerMin = rate / LINOTYPE_CHARS_PER_LINE;
  const cycleS = 60 / Math.max(0.25, linesPerMin);
  const phase = (elapsedS / cycleS) % 1;
  return {
    justificationWidthMm: Number((85 + wedge * 4.2).toFixed(1)),
    solidificationTimeMs: Math.round(450 * (temp / 260)),
    brinellHardness: isEutecticTemp ? 24 : Math.round(16 + (temp / 260) * 5),
    distributorFreqHz: Number((rate / 60).toFixed(2)),
    isEutecticTemp,
    plungerY: Math.sin(phase * Math.PI * 2) * 0.25,
    moldAngle: phase * Math.PI * 2,
    slugOut: phase > 0.72 && phase < 0.92,
    cycleS,
    phase,
    alloyMeltPointC: 240,
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
} {
  const massKg = 400 + (params.cabPayloadKg ?? 650);
  const tensionPct = params.cableTensionPct ?? 100;
  const isSnapped = tensionPct < 15;
  return {
    cabPayloadKg: params.cabPayloadKg ?? 650,
    cableTensionPct: tensionPct,
    isSnapped,
    springDeflectionCm: Number(((tensionPct / 100) * 10).toFixed(1)),
    isPawlEngaged: isSnapped,
    stoppingDistanceCm: isSnapped ? 4.5 : 0,
    peakArrestForceKn: isSnapped ? Number(((massKg * 9.81 * 1.8) / 1000).toFixed(1)) : 0,
    pawlEngagementMs: isSnapped ? 38 : 0,
  };
}
