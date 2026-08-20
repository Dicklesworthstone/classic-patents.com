/**
 * Shared SI steps for catalog machines advertised on the telemetry registry
 * but previously missing from engine.ts. Badge and 3D must call these.
 */

import {
  bellowsFluidCrate,
  bellWaveCrate,
  chainHeatCrate,
  cycleHeatCrate,
  cyclicFlex,
  delavalCreamCrate,
  edisonHeatCrate,
  gatlingClusterCrate,
  gatlingClusterKappa,
  grammeRingCrate,
  grooveWaveCrate,
  jacketHeatCrate,
  liftHeatCrate,
  lineWaveCrate,
  lintFluidCrate,
  marconiWaveCrate,
  meltFluidCrate,
  parsonsSteamCrate,
  peltonJetCrate,
  shockWaveCrate,
  wakeFluidCrate,
  wortHeatCrate,
} from "./genericWasm";
import { vulcanKinetics } from "./thermochem";

export function rpmToOmega(rpm: number) {
  return {
    omegaRadPerS: Number(((Math.max(0, rpm) * 2 * Math.PI) / 60).toFixed(3)),
    omegaDegPerS: Number((Math.max(0, rpm) * 6).toFixed(1)),
  };
}

/** Registry anode voltages are volts; magnetron / dissector kernels take kilovolts. */
export function voltsToKv(volts: number) {
  return Number((Math.max(0, volts) / 1000).toFixed(3));
}

export function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

/** Wrap a crank or cam angle onto one cycle. Shared by 2D and 3D. */
export function wrapCycleRad(angleRad: number, wrapRad = Math.PI * 4) {
  const wrap = wrapRad === 0 ? Math.PI * 4 : wrapRad;
  return ((angleRad % wrap) + wrap) % wrap;
}

/** 0-based four-stroke index on a wrapped cycle. Shared by 3D. */
export function fourStrokeIndexFromRad(
  cyclePhaseRad: number,
  strokeRad = Math.PI,
  strokeCount = 4,
) {
  return Math.floor(wrapCycleRad(cyclePhaseRad, strokeRad * strokeCount) / strokeRad) % strokeCount;
}

/** 720° crank cycle, 2:1 cam, and 0-based stroke. Shared by Otto / Daimler / Diesel 3D. */
export function fourStrokeCycle(
  crankAngleRad: number,
  cycleWrapRad = Math.PI * 4,
  strokeRad = Math.PI,
  camRatio = 0.5,
) {
  const cyclePhaseRad = wrapCycleRad(crankAngleRad, cycleWrapRad);
  return {
    cyclePhaseRad,
    strokeIndex: fourStrokeIndexFromRad(cyclePhaseRad, strokeRad),
    strokeRad,
    powerStartRad: strokeRad * 2,
    exhaustStartRad: strokeRad * 3,
    camAngleRad: crankAngleRad * camRatio,
    camEventAngleRad: wrapCycleRad(crankAngleRad * camRatio, cycleWrapRad * camRatio),
  };
}

/** Diesel 2:1 cam windows from the 720° crank seats. Shared by 3D. */
export function dieselCamWindows(
  injectionStartDeg = 355,
  injectionEndDeg = 390,
  cycleWrapDeg = 720,
  camRatio = 0.5,
) {
  return {
    camRatio,
    camWrapRad: degToRad(cycleWrapDeg * camRatio),
    intakeCamEndRad: degToRad(180 * camRatio),
    compressionCamEndRad: degToRad(360 * camRatio),
    injectionCamStartRad: degToRad(injectionStartDeg * camRatio),
    injectionCamEndRad: degToRad(injectionEndDeg * camRatio),
    exhaustCamStartRad: degToRad(540 * camRatio),
    intakeLiftAmp: 0.15,
    injectionLiftAmp: 0.12,
    exhaustLiftAmp: 0.15,
    intakeRockerCoupling: 1.5,
    injectorRockerCoupling: 1.8,
    exhaustRockerCoupling: 1.5,
    flameScale0: 0.7,
    flameScaleAmp: 0.6,
    flameEmissive0: 3,
    flameEmissiveAmp: 3,
    compressorSwingAmp: 0.18,
    flyballOmegaRatio: 2,
    fuelPumpStrokeAmp: 0.08,
    fuelPumpOmegaRatio: 2,
    gasTopY: 3.4,
    gasMinHeight: 0.18,
    pistonCrownOffset: 0.5,
    gasIntakeColor: 0x38bdf8,
    gasIntakeEmissive: 0x0284c7,
    gasCompressionCold: 0x38bdf8,
    gasCompressionHot: 0xf97316,
    gasInjectionColor: 0xfef08a,
    gasInjectionEmissive: 0xf97316,
    gasExhaustColor: 0x64748b,
    gasExhaustEmissive: 0x334155,
    compressionEmissive0: 0.2,
    compressionEmissiveAmp: 1.8,
    injectionEmissive: 2.5,
    exhaustEmissive: 0.1,
    intakeEmissive: 0.3,
    compressionBarAmp: 2.2,
    injectionBar: 45,
    idleBar: 1.5,
    crankR: 0.55,
    rodLen: 2.2,
    rodMin: 0.1,
    crankTdcPhase: Math.PI / 2,
    pinYHome: -1.65,
    pistonCrownLift: 1.5,
  };
}

/** Slider-crank studio displacement: 0 at TDC, 2×strokePx at BDC. */
export function pistonSvgDisplacement(crankAngleDeg: number, strokePx: number) {
  const crankRad = ((crankAngleDeg % 360) * Math.PI) / 180;
  return (1 - Math.cos(crankRad)) * strokePx;
}

/** Sinusoidal studio stroke used by the Corliss wrist-plate face. */
export function sliderStrokeSvg(crankAngleDeg: number, strokePx: number) {
  return Math.sin((crankAngleDeg * Math.PI) / 180) * strokePx;
}

/** Schematic glow for the Edison bulb drawing; not the 2D sim's power-based opacity. */
export function edisonSchematicGlowOpacity(filamentTempK: number) {
  return Number(Math.min(0.9, Math.max(0.2, (filamentTempK - 1800) / 1000)).toFixed(3));
}

export function edisonSchematicGlowFill(filamentTempK: number) {
  return Number((edisonSchematicGlowOpacity(filamentTempK) * 0.3).toFixed(3));
}

export function stepPeltonWheel(params: { headMeters?: number; runnerRpm?: number }) {
  const h = params.headMeters ?? 450;
  const rpm = params.runnerRpm ?? 600;
  const vJet = Math.round(Math.sqrt(2 * 9.81 * h));
  const uBucket = (rpm * 2 * Math.PI * 0.75) / 60;
  const speedRatio = uBucket / Math.max(1, vJet);
  const etaPct = Math.max(40, Math.round(93 - Math.abs(speedRatio - 0.5) * 160));
  const hydroKw = (45 * 9.81 * h) / 1000;
  const runner = rpmToOmega(rpm);
  const jetCrate = peltonJetCrate(h);
  return {
    jetVelocityMps: vJet,
    bucketSpeedMps: Number(uBucket.toFixed(2)),
    speedRatio: Number(speedRatio.toFixed(3)),
    etaPct,
    shaftPowerKw: Math.round(hydroKw * (etaPct / 100)),
    runnerOmegaRadPerS: runner.omegaRadPerS,
    runnerOmegaDegPerS: runner.omegaDegPerS,
    jetDisplaySpeed: Number(((vJet / 90) * 12).toFixed(3)),
    sprayDisplaySpeed: 8,
    pressureNeedleRad: Number(
      (-Math.PI * 0.75 + Math.min(Math.PI * 1.5, (h / 600) * Math.PI * 1.2)).toFixed(4),
    ),
    needleStudioX: Number((0.2 + (h / 1000) * 0.125).toFixed(4)),
    needleStudioY: Number((0.12 + (h / 1000) * 0.07).toFixed(4)),
    handwheelOmegaRadPerS: 0.5,
    jetOpacity: Number(
      ((0.55 + (etaPct / 93) * 0.4) * (0.85 + jetCrate.jetCrateDensity)).toFixed(3),
    ),
    ...jetCrate,
    runnerSvgR: 75,
    hubSvgR: 18,
    bucketCount: 12,
    bucketPitchDeg: 30,
    displayWrapDeg: 360,
    schematicRunnerCx: 200,
    schematicRunnerCy: 130,
    schematicRunnerR: 60,
    schematicBucketCount: 8,
    schematicBucketPitchDeg: 45,
    schematicBucketRx: 8,
    schematicBucketRy: 6,
    schematicSplitDx: 4,
    schematicNozzlePoints: "40,185 100,180 100,200 40,195",
    schematicJetX1: 100,
    schematicJetX2: 200,
    schematicJetY: 190,
    jetYOverX: 0.7,
    jetWrapX: 0,
    jetResetX: -3.2,
    jetResetY: -2.25,
    sprayFloorY: -3.8,
    sprayResetY: -1.0,
  };
}

/** Schematic split-bucket seat. Shared by the schematic. */
export function peltonSchematicBucket(deg: number, cx = 200, cy = 130, radius = 60) {
  const rad = (deg * Math.PI) / 180;
  return {
    x: Number((cx + Math.cos(rad) * radius).toFixed(2)),
    y: Number((cy + Math.sin(rad) * radius).toFixed(2)),
  };
}

/**
 * A normalized explanatory model for the first ring construction in US
 * 120,057. The specification states thirty-six joined bobbins and collecting
 * rubbers, but supplies no rotational speed, flux density, winding turns,
 * resistance, voltage, current, or power rating. Do not turn these relative
 * indicators into historical electrical measurements.
 */
export function stepGrammeDynamo(params: { shaftRate?: number }) {
  const shaftRate = Math.max(0.4, Math.min(1.6, params.shaftRate ?? 1));
  const printedJunctionCount = 36;
  const inducedEmfIndex = Math.round(100 * shaftRate);
  // Relative display only. 1.5°/frame ≡ 2π/240 rad/frame. Not a historical rpm.
  const displayDegPerFrame = Number((shaftRate * 1.5).toFixed(4));
  return {
    shaftRate,
    printedJunctionCount,
    junctionPitchDeg: 360 / printedJunctionCount,
    inducedEmfIndex,
    collectionContinuityPct: Number((100 - 100 / printedJunctionCount).toFixed(1)),
    ...grammeRingCrate(printedJunctionCount, shaftRate),
    displayDegPerFrame,
    displayRadPerFrame: Number(((displayDegPerFrame * Math.PI) / 180).toFixed(6)),
    fluxOpacity: Number(Math.min(0.95, 0.25 + (inducedEmfIndex / 160) * 0.7).toFixed(3)),
    torusSvgR: 100,
    torusCx: 300,
    torusCy: 170,
    displayWrapDeg: 360,
    coilPadX: 6,
    coilPadY: 16,
    coilSvgW: 12,
    coilSvgH: 32,
    brushSvgX: 294,
    brushSvgW: 12,
    brushSvgH: 15,
    brushSvgY0: 125,
    brushSvgY1: 200,
    junctionInnerSvgR: 35,
    junctionOuterSvgR: 48,
    schematicCenterX: 200,
    schematicCenterY: 150,
    schematicJunctionInnerR: 22,
    schematicJunctionOuterR: 32,
    schematicJunctionCount: 12,
    schematicJunctionPitchDeg: 30,
    schematicRingOuterR: 55,
    schematicRingInnerR: 48,
    schematicNorthPoleD: "M 60 100 Q 130 150 60 200",
    schematicSouthPoleD: "M 340 100 Q 270 150 340 200",
    schematicNorthLabelX: 90,
    schematicSouthLabelX: 300,
    schematicPoleLabelY: 155,
    schematicBrushX: 194,
    schematicBrushW: 12,
    schematicBrushH: 6,
    schematicBrushY0: 112,
    schematicBrushY1: 182,
    schematicBrushCount: 2,
    fluxOrbitCoupling: 0.3,
    fluxRadiusBase: 1.42,
    fluxRadiusPitch: 0.14,
    fluxRadiusWrap: 6,
    displayFps: 60,
  };
}

/** Toroidal flux-sample radius on the 3D ring. Shared by 3D. */
export function grammeFluxRadius(index: number, base = 1.42, pitch = 0.14, wrap = 6) {
  const w = Math.max(1, wrap);
  return base + (((index % w) + w) % w) * pitch;
}

/** Commutator-brush seat on the schematic. Shared by the schematic. */
export function grammeSchematicBrush(index: number, x = 194, y0 = 112, y1 = 182, w = 12, h = 6) {
  return { x, y: index === 0 ? y0 : y1, w, h };
}

/** 2D coil seat on the rotating ring. Shared by 2D. */
export function grammeCoil(
  index: number,
  torusR = 100,
  pitchDeg = 10,
  padX = 6,
  padY = 16,
  w = 12,
  h = 32,
) {
  const deg = index * pitchDeg;
  const rad = (deg * Math.PI) / 180;
  const cx = Math.cos(rad) * torusR;
  const cy = Math.sin(rad) * torusR;
  return { deg, cx, cy, x: cx - padX, y: cy - padY, w, h };
}

/** 2D junction-rod on the rotating ring. Shared by 2D. */
export function grammeJunctionRod(index: number, pitchDeg = 10, innerR = 35, outerR = 48) {
  const rad = (index * pitchDeg * Math.PI) / 180;
  return {
    x1: Math.cos(rad) * innerR,
    y1: Math.sin(rad) * innerR,
    x2: Math.cos(rad) * outerR,
    y2: Math.sin(rad) * outerR,
  };
}

/** Schematic junction-rod seat. Shared by the schematic. */
export function grammeSchematicJunction(deg: number, cx = 200, cy = 150, innerR = 22, outerR = 32) {
  const rad = (deg * Math.PI) / 180;
  return {
    x1: Number((cx + Math.cos(rad) * innerR).toFixed(2)),
    y1: Number((cy + Math.sin(rad) * innerR).toFixed(2)),
    x2: Number((cx + Math.cos(rad) * outerR).toFixed(2)),
    y2: Number((cy + Math.sin(rad) * outerR).toFixed(2)),
  };
}

export function stepOttoEngine(params: { engineRpm?: number; compressionRatio?: number }) {
  const rpm = params.engineRpm ?? 180;
  const cr = params.compressionRatio ?? 4.5;
  const peakCompressionBar = Number((1.0 * cr ** 1.35).toFixed(1));
  const crank = rpmToOmega(rpm);
  return {
    brakeHorsepower: Number(((rpm / 180) * (3.0 * (cr / 4.5) ** 0.5)).toFixed(1)),
    thermalEfficiencyPct: Math.round((1 - 1 / cr ** 0.4) * 100),
    peakCompressionBar,
    peakFiringBar: Number((peakCompressionBar * 3.8).toFixed(1)),
    ...cycleHeatCrate(cr),
    crankOmegaRadPerS: crank.omegaRadPerS,
    crankOmegaDegPerS: crank.omegaDegPerS,
    govDisplayOmegaRadPerS: Number(((rpm / 180) * 9).toFixed(3)),
    flyballRadius: Number((0.18 + Math.min(0.15, (rpm / 300) * 0.14)).toFixed(4)),
    pistonStrokePx: 35,
    cycleWrapDeg: 720,
    crankWrapDeg: 360,
    flywheelSvgR: 80,
    flywheelRimR: 90,
    flywheelHubR: 15,
    crankPinR: 7,
    crankCx: 460,
    crankCy: 170,
    rodOriginX: 167,
    pistonSvgX: 145,
    pistonSvgY: 170,
    gasChargeW0: 50,
    stroke1EndDeg: 180,
    stroke2EndDeg: 360,
    stroke3EndDeg: 540,
    sparkStartDeg: 350,
    sparkEndDeg: 370,
    firingStartDeg: 360,
    firingEndDeg: 450,
    cycleWrapRad: Math.PI * 4,
    strokeRad: Math.PI,
    camRatio: 0.5,
    exhaustLiftAmp: 0.12,
    slideStroke: 0.22,
    slideHomeX: -3.45,
    eccentricRodAmp: 0.25,
    exhaustValveHomeY: -0.35,
    exhaustRockerCoupling: 1.8,
    sleeveHomeY: 0.35,
    sleeveRadius0: 0.18,
    sleeveCoupling: 0.8,
    gasMinLength: 0.3,
    cylinderTdcX: -3.25,
    combustionLengthRef: 1.8,
    intakeGasColor: 0x38bdf8,
    intakeGasEmissive: 0x0284c7,
    intakeEmissive: 0.25,
    intakeOpacity: 0.35,
    compressionGasColor: 0xf59e0b,
    compressionGasEmissive: 0xd97706,
    compressionEmissive0: 0.3,
    compressionEmissiveAmp: 0.5,
    compressionOpacity0: 0.4,
    compressionOpacityAmp: 0.3,
    powerGasColor: 0xffffff,
    powerGasEmissive: 0xff5500,
    expansionMin: 0.1,
    expansionFade: 0.7,
    expansionEmissive0: 0.9,
    expansionOpacity0: 0.75,
    exhaustGasColor: 0x64748b,
    exhaustGasEmissive: 0x475569,
    exhaustEmissive: 0.15,
    exhaustOpacity: 0.28,
    spokeCount: 6,
    spokePitchDeg: 60,
    schematicFlywheelCx: 280,
    schematicFlywheelCy: 130,
    schematicFlywheelR: 45,
    schematicHubR: 6,
    schematicCylinderX: 80,
    schematicCylinderY: 70,
    schematicCylinderW: 160,
    schematicCylinderH: 120,
    schematicValveX: 50,
    schematicValveY: 90,
    schematicValveW: 30,
    schematicValveH: 40,
    schematicPistonX: 120,
    schematicPistonY: 95,
    schematicPistonW: 70,
    schematicPistonH: 70,
    schematicRodX1: 170,
    schematicRodX2: 280,
    schematicRodY: 130,
  };
}

/** Connecting-rod SVG endpoints on the 2D four-stroke bench. Shared by 2D. */
export function ottoConnectingRod(
  crankAngleDeg: number,
  pistonDisplacement: number,
  pistonStrokePx: number,
  crankCx = 460,
  crankCy = 170,
  rodOriginX = 167,
) {
  const rad = (crankAngleDeg * Math.PI) / 180;
  return {
    x1: rodOriginX + pistonDisplacement,
    y1: crankCy,
    x2: crankCx + Math.cos(rad) * pistonStrokePx,
    y2: crankCy + Math.sin(rad) * pistonStrokePx,
  };
}

/** Four-stroke window (1 intake … 4 exhaust) on the 720° cycle. Shared by 2D. */
export function ottoStrokePhase(
  cycleAngleDeg: number,
  stroke1EndDeg = 180,
  stroke2EndDeg = 360,
  stroke3EndDeg = 540,
) {
  if (cycleAngleDeg < stroke1EndDeg) return 1 as const;
  if (cycleAngleDeg < stroke2EndDeg) return 2 as const;
  if (cycleAngleDeg < stroke3EndDeg) return 3 as const;
  return 4 as const;
}

export function stepParsonsTurbine(params: { rotorRpm?: number; inletPressurePsi?: number }) {
  const rpm = params.rotorRpm ?? 3000;
  const psi = params.inletPressurePsi ?? 180;
  const enthalpyKjKg = Math.round(550 * (psi / 180));
  const meanRadiusM = 0.45;
  const bladeSpeedMps = (rpm * 2 * Math.PI * meanRadiusM) / 60;
  // Axial steam speed scales with the isentropic drop; 320 m/s is the 180 psi design.
  const steamSpeedMps = 320 * Math.sqrt(enthalpyKjKg / 550);
  const rotorOmegaRadPerS = (rpm * 2 * Math.PI) / 60;
  // 3000 rpm is a blur in the studio; 0.08 keeps u/c readable.
  const displaySlowdown = 0.08;
  const shaftPowerKw = Math.round(28 * enthalpyKjKg * 0.84 * (rpm / 3000));
  const steamCrate = parsonsSteamCrate(rpm);
  return {
    enthalpyKjKg,
    shaftPowerKw,
    inletMpa: Number((psi * 0.00689476).toFixed(2)),
    stageCount: 48,
    isentropicEfficiencyPct: 84,
    steamBladeSpeedRatio: Number((bladeSpeedMps / Math.max(1, steamSpeedMps)).toFixed(2)),
    bladeSpeedMps: Number(bladeSpeedMps.toFixed(1)),
    steamSpeedMps: Number(steamSpeedMps.toFixed(1)),
    rotorOmegaRadPerS: Number(rotorOmegaRadPerS.toFixed(2)),
    rotorOmegaDegPerS: Number((rpm * 6).toFixed(1)),
    displaySlowdown,
    displayOmegaRadPerS: Number((rotorOmegaRadPerS * displaySlowdown).toFixed(3)),
    displayOmegaDegPerS: Number((rpm * 6 * displaySlowdown).toFixed(1)),
    steamAdvancePerS: Number(
      ((enthalpyKjKg / 550) * (rpm / 3000) * 12 * (1 + steamCrate.steamCrateDensity)).toFixed(3),
    ),
    ...steamCrate,
    steamOpacity: Number(Math.min(0.95, 0.25 + (shaftPowerKw / 14000) * 0.7).toFixed(3)),
    steamSwirlOmegaRadPerS: Number((rotorOmegaRadPerS * displaySlowdown * 0.5).toFixed(3)),
    shaftPowerMw: Number((shaftPowerKw / 1000).toFixed(1)),
    inletBar: Number((psi / 14.5038).toFixed(3)),
    stageRingSvgCount: 22,
    stageSvgOriginX: 135,
    stageSvgPitch: 16,
    bladeMidY: 170,
    bladeGap: 10,
    bladeLean: 4,
    stageHeightNear: 30,
    stageHeightMid: 45,
    stageHeightFar: 65,
    stageSplitX0: 240,
    stageSplitX1: 380,
    rotorStageParity: 1,
    displayWrapDeg: 360,
    schematicStageXs: [100, 120, 140, 170, 190, 210, 230, 260, 280, 300],
    schematicRotorPoints:
      "80,120 150,120 150,110 240,110 240,95 320,95 320,185 240,185 240,170 150,170 150,160 80,160",
    schematicBladeY0: 85,
    schematicBladeY1: 195,
    schematicCasingX1: 60,
    schematicCasingX2: 340,
    schematicCasingY0: 80,
    schematicCasingY1: 65,
    schematicCasingY2: 200,
    schematicCasingY3: 215,
    schematicInletX1: 40,
    schematicInletX2: 75,
    schematicInletY: 140,
    steamWrapX: 5.0,
    steamResetX: -4.5,
    steamRadiusHp: 0.8,
    steamRadiusIpStart: -4.3,
    steamRadiusIpEnd: -1.3,
    steamRadiusIp: 1.25,
    steamRadiusMpEnd: 1.7,
    steamRadiusMp: 1.75,
    steamRadiusLp: 2.35,
    steamGrowPerS: 5.0,
    steamShrinkPerS: 10.0,
    steamShrinkSlack: 0.1,
  };
}

/** Alternating rotor ring on the 2D expansion face. Shared by 2D. */
export function parsonsIsRotor(index: number, rotorParity = 1) {
  return index % 2 === rotorParity;
}

/** Rotor/stator blade height on the 2D expansion face. Shared by 2D. */
export function parsonsStageHeight(
  xPos: number,
  splitX0 = 240,
  splitX1 = 380,
  near = 30,
  mid = 45,
  far = 65,
) {
  return xPos < splitX0 ? near : xPos < splitX1 ? mid : far;
}

export function stepEricssonPropeller(params: { shaftRpm?: number; bladePitchAngleDeg?: number }) {
  const rpm = params.shaftRpm ?? 120;
  const pitchDeg = params.bladePitchAngleDeg ?? 35;
  const pitchFactor = Math.tan((pitchDeg * Math.PI) / 180) / Math.tan((35 * Math.PI) / 180);
  const pitchMeters = Number((Math.PI * 1.6 * Math.tan((pitchDeg * Math.PI) / 180)).toFixed(2));
  const shipSpeedKnots = Number(((rpm / 120) * 8.5 * pitchFactor).toFixed(1));
  const theoreticalSpeedKnots = Number(((rpm * pitchMeters * 60) / 1852).toFixed(1));
  const slipFraction =
    theoreticalSpeedKnots > 0
      ? Number(
          Math.max(
            0,
            Math.min(0.9, (theoreticalSpeedKnots - shipSpeedKnots) / theoreticalSpeedKnots),
          ).toFixed(2),
        )
      : 0.15;
  const shaftOmegaRadPerS = (rpm * 2 * Math.PI) / 60;
  const thrustKn = Math.round((rpm / 120) ** 2 * 18 * pitchFactor);
  return {
    isIllustrativeDisplayModel: true,
    sourceSpiralAdvanceDiameters: 3,
    sourceCasingClearanceInches: 0.125,
    shipSpeedKnots,
    thrustKn,
    pitchMeters,
    theoreticalSpeedKnots,
    slipFraction,
    slipPct: Number((slipFraction * 100).toFixed(1)),
    propulsiveEfficiencyPct: Number(((1 - slipFraction) * 100).toFixed(1)),
    shaftOmegaRadPerS: Number(shaftOmegaRadPerS.toFixed(3)),
    shaftOmegaDegPerS: Number((rpm * 6).toFixed(1)),
    wakeSwirlScale: 0.4,
    wakeFlowSpeed: 6.5,
    wakeSwirlCoeff: 0.08,
    wakeOpacity: Number(Math.min(0.95, 0.3 + (thrustKn / 30) * 0.65).toFixed(3)),
    ...wakeFluidCrate(rpm),
    bladeSvgRx: 10,
    forwardBladeSvgRy: 50,
    aftBladeSvgRy: 45,
    bladeCount: 6,
    bladePitchDeg: 60,
    displayWrapDeg: 360,
    schematicForwardCx: 210,
    schematicForwardCy: 150,
    schematicForwardRx: 14,
    schematicForwardRy: 50,
    schematicAftCx: 280,
    schematicAftCy: 150,
    schematicAftRx: 14,
    schematicAftRy: 46,
    schematicSternD: "M 60 80 L 140 140 L 140 160 L 60 220",
    schematicShaftX1: 140,
    schematicShaftX2: 340,
    schematicShaftY: 150,
    schematicForwardHelixD: "M 196 100 Q 210 150 224 200",
    schematicAftHelixD: "M 294 104 Q 280 150 266 196",
    shroudSvgRx: 14,
    forwardShroudSvgRy: 60,
    aftShroudSvgRy: 55,
    hubSvgR: 10,
    aftHubSvgR: 8,
    bladeTipDx: 15,
    bladeTipDy: 6,
  };
}

export function stepDeLavalSeparator(params: { bowlRpm?: number; rawMilkFlowLph?: number }) {
  const rpm = params.bowlRpm ?? 6500;
  const flow = params.rawMilkFlowLph ?? 300;
  const bowlOmegaRadPerS = (rpm * 2 * Math.PI) / 60;
  const gForce = Math.round((bowlOmegaRadPerS ** 2 * 0.1) / 9.80665);
  // 6500 rpm is a blur; 0.15 keeps the nested discs readable.
  const displaySlowdown = 0.15;
  const creamFlowLph = Number((flow * 0.12).toFixed(1));
  const creamCrate = delavalCreamCrate(rpm);
  const creamDens = 1 + creamCrate.creamCrateDensity;
  return {
    gForce,
    fatYieldPct: Math.min(99.9, Number((95 + (gForce / 5000) * 4.5).toFixed(1))),
    creamFlowLph,
    skimFlowLph: Number((flow * 0.88).toFixed(1)),
    creamDropAdvancePerS: Number(((creamFlowLph / 300) * 1.6 * creamDens).toFixed(3)),
    ...creamCrate,
    bowlOmegaRadPerS: Number(bowlOmegaRadPerS.toFixed(2)),
    bowlOmegaDegPerS: Number((rpm * 6).toFixed(1)),
    displaySlowdown,
    displayOmegaRadPerS: Number((bowlOmegaRadPerS * displaySlowdown).toFixed(3)),
    displayOmegaDegPerS: Number((rpm * 6 * displaySlowdown).toFixed(1)),
    displayWrapDeg: 360,
    pulleyDisplayOmegaRadPerS: Number((bowlOmegaRadPerS * displaySlowdown * 0.25).toFixed(3)),
    skimDropAdvancePerS: Number(((creamFlowLph / 300) * 1.6 * 0.85 * creamDens).toFixed(3)),
    creamDropOriginY: 0.35,
    creamDropSpacing: 0.18,
    creamDropWrap: 1.8,
    skimDropOriginY: -0.15,
    skimDropSpacing: 0.2,
    skimDropWrap: 2.0,
    schematicDiscOriginY: 100,
    schematicDiscPitchY: 20,
    schematicDiscCount: 5,
    schematicBowlPoints: "140,80 260,80 230,200 170,200",
    schematicDiscX0: 180,
    schematicDiscCx: 200,
    schematicDiscX1: 220,
    schematicDiscLift: 10,
    schematicSpindleX: 200,
    schematicSpindleY0: 200,
    schematicSpindleY1: 250,
    schematicCreamX: 200,
    schematicCreamY0: 80,
    schematicCreamY1: 50,
    schematicSkimX0: 150,
    schematicSkimY0: 80,
    schematicSkimX1: 120,
    schematicSkimY1: 60,
  };
}

/** Conical disc-stack Y on the schematic. Shared by the schematic. */
export function delavalSchematicDiscY(index: number, originY = 100, pitchY = 20) {
  return originY + index * pitchY;
}

export function stepNobelDynamite(params: {
  ngConcentrationPct?: number;
  capEnergyJoules?: number;
}) {
  const ng = params.ngConcentrationPct ?? 75;
  const cap = params.capEnergyJoules ?? 1.2;
  const isInitiated = cap >= 0.4;
  const blastOverpressureMpa = isInitiated ? Math.round(4500 + (ng - 50) * 120) : 0;
  const detonationVelocityMps = isInitiated ? Math.round(5500 + (ng - 50) * 80) : 0;
  return {
    capEnergyJoules: cap,
    detonationVelocityMps,
    isInitiated,
    blastOverpressureMpa,
    blastOverpressureGpa: Number((blastOverpressureMpa / 1000).toFixed(1)),
    energyMjPerKg: Number(((ng / 100) * 6.3).toFixed(2)),
    // Free NG vs kieselguhr dough: more dry meal → higher drop-hammer margin.
    cushionFactor: Number((1 + (100 - ng) / 8.9).toFixed(1)),
    isSensitiveUnsafe: ng > 82,
    chargeLengthM: 0.2,
    chargeTransitUs: isInitiated ? Math.round((0.2 / Math.max(1, detonationVelocityMps)) * 1e6) : 0,
    // 27 µs transit is real; 200 ms is the visible flash floor both faces share.
    flashDisplayMs: isInitiated
      ? Math.max(200, Math.round((0.2 / Math.max(1, detonationVelocityMps)) * 1e6))
      : 0,
    ...shockWaveCrate(ng),
    shockwaveGlow: Number((1 + (detonationVelocityMps / 6000) * 1.5).toFixed(3)),
    stickDisplayOmegaRadPerS: 0.2,
    kieselguhrCount: 24,
    kieselguhrCols: 8,
    kieselguhrOriginX: 200,
    kieselguhrOriginY: 135,
    kieselguhrPitch: 32,
    kieselguhrR: 6,
    schematicKieselguhrOriginX: 90,
    schematicKieselguhrOriginY: 125,
    schematicKieselguhrPitchX: 30,
    schematicKieselguhrPitchY: 25,
    schematicKieselguhrCols: 7,
    schematicKieselguhrRows: 3,
    schematicCartridgeX: 70,
    schematicCartridgeY: 110,
    schematicCartridgeW: 220,
    schematicCartridgeH: 80,
    schematicGrainR: 4,
    schematicCapX: 260,
    schematicCapY: 138,
    schematicCapW: 45,
    schematicCapH: 24,
    schematicFuseD: "M 305 150 Q 330 130 350 150 T 380 140",
    sparkOpacity0: 0.7,
    sparkOpacityAmp: 0.3,
    sparkOmega: 25,
    shockwaveOmega: 8,
    matrixEmissive0: 0.4,
    matrixEmissiveAmp: 0.6,
    matrixEmissiveHex: 0xff3300,
    shockwaveScale0: 1.0,
    shockwaveScaleAmp: 1.5,
    shockwaveOpacity0: 0.4,
    shockwaveOpacityAmp: 0.35,
  };
}

/** Kieselguhr grain seat on the schematic cartridge. Shared by the schematic. */
export function nobelSchematicKieselguhr(
  col: number,
  row: number,
  originX = 90,
  originY = 125,
  pitchX = 30,
  pitchY = 25,
) {
  return {
    cx: originX + col * pitchX,
    cy: originY + row * pitchY,
  };
}

/** Kieselguhr grain seat on the 2D stick face. Shared by 2D. */
export function nobelKieselguhrSvg(
  index: number,
  originX = 200,
  originY = 135,
  pitch = 32,
  cols = 8,
) {
  return {
    cx: originX + (index % cols) * pitch,
    cy: originY + Math.floor(index / cols) * pitch,
  };
}

export function stepWhitneyCottonGin(params: { crankRpm?: number; seedGridClearance?: number }) {
  const rpm = params.crankRpm ?? 180;
  const grateClearanceMm = params.seedGridClearance ?? 3.2;
  const sawToCrankRatio = 3.5;
  const brushToCrankRatio = 12.0;
  const sawRpm = Math.round(rpm * sawToCrankRatio);
  const brushRpm = Math.round(rpm * brushToCrankRatio);
  const crank = rpmToOmega(rpm);
  const saw = rpmToOmega(sawRpm);
  const brush = rpmToOmega(brushRpm);
  return {
    sawRpm,
    brushRpm,
    sawToCrankRatio,
    brushToCrankRatio,
    grateClearanceMm,
    grateStrokePx: Number((grateClearanceMm * 2.5).toFixed(2)),
    outputLbsPerDay: Math.round((rpm / 180) * 50),
    sawTipSpeedMps: Number(((sawRpm * 2 * Math.PI * 0.125) / 60).toFixed(2)),
    laborMultiplier: Math.round((rpm / 180) * 50),
    ...lintFluidCrate(rpm),
    crankOmegaRadPerS: crank.omegaRadPerS,
    crankOmegaDegPerS: crank.omegaDegPerS,
    sawOmegaRadPerS: saw.omegaRadPerS,
    brushOmegaRadPerS: brush.omegaRadPerS,
    sawSvgR: 65,
    sawToothOuterSvgR: 78,
    brushSvgR: 55,
    bristleOuterSvgR: 78,
    sawToothCount: 16,
    sawToothPitchDeg: 22.5,
    bristleCount: 24,
    bristlePitchDeg: 15,
    displayWrapDeg: 360,
    schematicSawCx: 210,
    schematicSawCy: 145,
    schematicSawInnerR: 44,
    schematicSawOuterR: 52,
    schematicSawToothCount: 12,
    schematicSawToothPitchDeg: 30,
    schematicSawTwistRad: 0.15,
    schematicBrushCx: 300,
    schematicBrushCy: 145,
    schematicBrushInnerR: 15,
    schematicBrushOuterR: 38,
    schematicBrushRayCount: 8,
    schematicBrushRayPitchDeg: 45,
    schematicHopperPoints: "60,40 180,40 160,110 80,110",
    schematicGrateD0: "M 160 80 C 180 120, 180 170, 160 210",
    schematicGrateD1: "M 165 80 C 185 120, 185 170, 165 210",
    schematicSawR: 48,
    schematicBrushR: 36,
    fiberSawCoupling: 0.12,
    fiberCarrySpeed: 1.8,
    fiberGravity: 0.6,
    fiberWrapZ: 3.2,
    fiberResetZ: -0.6,
    fiberResetY: 0.8,
  };
}

/** Schematic saw-tooth or brush bristle. Shared by the schematic. */
export function whitneySchematicRay(
  deg: number,
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  twist = 0,
) {
  const rad = (deg * Math.PI) / 180;
  return {
    x1: Number((cx + Math.cos(rad) * innerR).toFixed(2)),
    y1: Number((cy + Math.sin(rad) * innerR).toFixed(2)),
    x2: Number((cx + Math.cos(rad + twist) * outerR).toFixed(2)),
    y2: Number((cy + Math.sin(rad + twist) * outerR).toFixed(2)),
  };
}

export function stepMcCormickReaper(params: { forwardSpeedMph?: number }) {
  const groundSpeedMph = params.forwardSpeedMph ?? 2.5;
  // US X8277 specifies a two-foot ground wheel, then 30:9 and 27:9 gear
  // engagements to its double crank. It also specifies a 13-inch pulley on
  // the ground-wheel axle and a 12-inch pulley on the reel. This is a no-slip
  // kinematic estimate from those printed dimensions, not a field model.
  const groundWheelRpm = (groundSpeedMph * 88) / (Math.PI * 2);
  const cutterCrankRpm = Number((groundWheelRpm * (30 / 9) * (27 / 9)).toFixed(1));
  const reelRpm = Number((groundWheelRpm * (13 / 12)).toFixed(1));
  const cutterHz = Number((cutterCrankRpm / 60).toFixed(2));
  const wheel = rpmToOmega(groundWheelRpm);
  const reel = rpmToOmega(reelRpm);
  const cutter = rpmToOmega(cutterCrankRpm);
  return {
    groundWheelRpm: Number(groundWheelRpm.toFixed(1)),
    cutterCrankRpm,
    reelRpm,
    groundSpeedMps: Number((groundSpeedMph * 0.44704).toFixed(2)),
    cutterHz,
    groundWheelOmegaRadPerS: wheel.omegaRadPerS,
    reelOmegaRadPerS: reel.omegaRadPerS,
    cutterOmegaRadPerS: cutter.omegaRadPerS,
    cutterOmegaDegPerS: cutter.omegaDegPerS,
    cutterDisplayRadPerFrame: Number((cutter.omegaRadPerS / 60).toFixed(6)),
    phaseWrapRad: Number((2 * Math.PI).toFixed(6)),
    reelBarPct: Number(Math.min(100, (reelRpm / 80) * 100).toFixed(1)),
    cutterSvgAmp: 18,
    reelArmCount: 4,
    reelArmSvgLen: 95,
    schematicReelCx: 210,
    schematicReelCy: 100,
    schematicReelR: 50,
    schematicReelArmPitchDeg: 90,
    schematicSickleOriginX: 170,
    schematicSicklePitchX: 20,
    schematicSickleCount: 8,
    schematicSickleY: 210,
    schematicSickleX1: 160,
    schematicSickleX2: 320,
    schematicSickleTipDx: 6,
    schematicSickleMidDx: 12,
    schematicSickleLift: 10,
    schematicBullCx: 100,
    schematicBullCy: 180,
    schematicBullR: 45,
    schematicBullHubR: 12,
    schematicArmW: 24,
    schematicArmH: 8,
    schematicArmOx: 12,
    schematicArmOy: 4,
    schematicPlatformPoints: "160,210 320,210 300,245 140,245",
    grainStemCount: 14,
    grainStemOriginX: 60,
    grainStemPitchX: 14,
    guardCount: 12,
    guardPitchX: 25,
    sickleToothCount: 11,
    sickleToothOriginX: 5,
    sickleToothPitchX: 25,
    crankPinHubX: -50,
    crankPinOrbitPx: 8,
    pitmanCutterPad: 50,
    grainStemY0: 280,
    grainStemQy: 200,
    grainStemY1: 120,
    grainStemQdx: 5,
    grainStemEndDx: -2,
    guardTipDx: 12,
    guardTipDy: -35,
    guardEndDx: 24,
    faceSickleTipDx: 11,
    faceSickleTipDy: -26,
    faceSickleEndDx: 22,
    reelSlatX: 85,
    reelSlatY: -12,
    reelSlatW: 22,
    reelSlatH: 24,
    reelToCutterRatio: Number((reel.omegaRadPerS / Math.max(1e-6, cutter.omegaRadPerS)).toFixed(5)),
  };
}

/** Reel pose from the cutter-phase studio clock. Shared by 2D. */
export function mccormickReelAngleDeg(cutterPhaseRad: number, reelToCutterRatio: number) {
  return Number((((cutterPhaseRad * reelToCutterRatio * 180) / Math.PI) % 360).toFixed(2));
}

/** Gathering-reel arm tip on the schematic. Shared by the schematic. */
export function mccormickSchematicReelArm(deg: number, cx = 210, cy = 100, radius = 50) {
  const rad = (deg * Math.PI) / 180;
  return {
    x: Number((cx + Math.cos(rad) * radius).toFixed(2)),
    y: Number((cy + Math.sin(rad) * radius).toFixed(2)),
  };
}

/** Reciprocating sickle tooth X on the schematic. Shared by the schematic. */
export function mccormickSchematicSickleX(index: number, originX = 170, pitchX = 20) {
  return originX + index * pitchX;
}

/** Standing-grain stem X on the 2D face. Shared by 2D. */
export function mccormickGrainStemX(index: number, originX = 60, pitchX = 14) {
  return originX + index * pitchX;
}

/** Knife-guard X on the 2D face. Shared by 2D. */
export function mccormickGuardX(index: number, pitchX = 25) {
  return index * pitchX;
}

/** Sickle-tooth X on the 2D face. Shared by 2D. */
export function mccormickFaceSickleX(index: number, originX = 5, pitchX = 25) {
  return originX + index * pitchX;
}

/** Pitman crank-pin seat on the 2D face. Shared by 2D. */
export function mccormickCrankPinSvg(phaseRad: number, hubX = -50, orbitPx = 8) {
  return {
    cx: Number((hubX + Math.cos(phaseRad) * orbitPx).toFixed(2)),
    cy: Number((Math.sin(phaseRad) * orbitPx).toFixed(2)),
  };
}

export function stepDavenportMotor(params: { batteryVoltage?: number; loadTorque?: number }) {
  const v = params.batteryVoltage ?? 12;
  const load = params.loadTorque ?? 0.8;
  const rpm = Math.round((v / 12) * (450 / Math.max(0.5, load)));
  const shaftPowerW = Math.round(((rpm * 2 * Math.PI) / 60) * load);
  const ktNmPerA = 0.12;
  const armatureCurrentA = Number((load / ktNmPerA).toFixed(2));
  const copperLossW = armatureCurrentA ** 2 * 1.8;
  const electricalWatts = Math.round(shaftPowerW + copperLossW);
  const shaft = rpmToOmega(rpm);
  return {
    shaftRpm: rpm,
    shaftPowerW,
    armatureCurrentA,
    electricalWatts,
    efficiencyPct: electricalWatts > 0 ? Math.round((shaftPowerW / electricalWatts) * 100) : 0,
    shaftOmegaRadPerS: shaft.omegaRadPerS,
    shaftOmegaDegPerS: shaft.omegaDegPerS,
    schematicCenterX: 200,
    schematicCenterY: 150,
    schematicArmatureX: 160,
    schematicArmatureY: 138,
    schematicArmatureW: 80,
    schematicArmatureH: 24,
    schematicCommutatorR: 14,
    schematicNorthD: "M 60 70 A 90 90 0 0 1 120 70 L 120 230 A 90 90 0 0 1 60 230 Z",
    schematicSouthD: "M 340 70 A 90 90 0 0 0 280 70 L 280 230 A 90 90 0 0 0 340 230 Z",
    schematicNorthLabelX: 90,
    schematicSouthLabelX: 310,
    schematicPoleLabelY: 155,
    schematicLeftBrushX1: 180,
    schematicLeftBrushX2: 150,
    schematicRightBrushX1: 220,
    schematicRightBrushX2: 250,
    schematicBrushY: 150,
    schematicArmatureLabelY: 120,
    schematicCommutatorLabelY: 190,
    commutatorPoleDeg: 180,
    commutatorFlipDeg: 90,
    displayWrapDeg: 360,
  };
}

/** Split-ring polarity flip on the 2D armature. Shared by 2D. */
export function davenportPolarityReversed(rotorAngleDeg: number, poleDeg = 180, flipDeg = 90) {
  return rotorAngleDeg % poleDeg > flipDeg;
}

/** Rotating armature seat on the schematic. Shared by the schematic. */
export function davenportSchematicArmature(x = 160, y = 138, w = 80, h = 24) {
  return { x, y, w, h };
}

export function stepCorlissEngine(params: {
  steamPressurePsi?: number;
  engineRpm?: number;
  cutoffPct?: number;
}) {
  const psi = params.steamPressurePsi ?? 100;
  const rpm = params.engineRpm ?? 65;
  const cutoff = (params.cutoffPct ?? 25) / 100;
  // Default 25% cutoff keeps the historical IHP; earlier cutoff admits less steam.
  const mepFactor = 0.75 + cutoff;
  const crank = rpmToOmega(rpm);
  return {
    indicatedHp: Math.round(psi * rpm * 0.25 * 1.8 * mepFactor),
    thermalEfficiencyPct: Number((24.5 + (0.25 - cutoff) * 12).toFixed(1)),
    boilerMpa: Number((psi * 0.00689476).toFixed(2)),
    expansionRatio: Number((1 / Math.max(0.05, cutoff)).toFixed(1)),
    crankOmegaRadPerS: crank.omegaRadPerS,
    crankOmegaDegPerS: crank.omegaDegPerS,
    governorOmegaRadPerS: Number((crank.omegaRadPerS * 1.5).toFixed(3)),
    govSpread: Number((0.35 + Math.min(0.35, (rpm / 100) * 0.25)).toFixed(4)),
    wristAmp: Number((0.18 + cutoff * 0.35).toFixed(4)),
    pistonStrokePx: 45,
    wristPlateAmpPx: 22,
    flywheelSvgR: 85,
    flywheelRimR: 95,
    flywheelHubR: 14,
    crankPinR: 7,
    crankCx: 480,
    crankCy: 170,
    rodOriginX: 358,
    pistonSvgX: 170,
    pistonSvgY: 170,
    wristPlateCx: 170,
    wristPlateCy: 170,
    wristLeadDeg: 90,
    intakeOpenWindowDeg: Number((cutoff * 180).toFixed(2)),
    intakeCycleDeg: 180,
    displayWrapDeg: 360,
    crankWrapRad: Math.PI * 2,
    govOmegaRatio: 2.5,
    wristLeadRad: Math.PI * 0.25,
    intakeValveCoupling: 0.9,
    exhaustValveCoupling: 0.7,
    dashpotDropAmp: 1.2,
    dashpotHomeY: 1.5,
    crankR: 0.65,
    pinHomeX: 3.8,
    rodLen: 4.4,
    rodMin: 0.1,
    spokeCount: 6,
    spokePitchDeg: 60,
    schematicValveR: 16,
    schematicValveXs: [100, 300, 100, 300],
    schematicValveYs: [85, 85, 215, 215],
    schematicWristCx: 200,
    schematicWristCy: 150,
    schematicWristR: 32,
    schematicCylinderX: 70,
    schematicCylinderY: 60,
    schematicCylinderW: 260,
    schematicCylinderH: 180,
    schematicLinkInnerX: 108,
    schematicLinkOuterX: 292,
    schematicLinkTopY: 130,
    schematicLinkBotY: 170,
    schematicLinkValveTopY: 92,
    schematicLinkValveBotY: 208,
  };
}

/** Connecting-rod SVG endpoints on the 2D Corliss bench. Shared by 2D. */
export function corlissConnectingRod(
  crankAngleDeg: number,
  pistonStroke: number,
  pistonStrokePx: number,
  crankCx = 480,
  crankCy = 170,
  rodOriginX = 358,
) {
  const rad = (crankAngleDeg * Math.PI) / 180;
  return {
    x1: rodOriginX + pistonStroke,
    y1: crankCy,
    x2: crankCx + Math.cos(rad) * pistonStrokePx,
    y2: crankCy + Math.sin(rad) * pistonStrokePx,
  };
}

/** Rotary-valve seat on the schematic. Shared by the schematic. */
export function corlissSchematicValve(
  index: number,
  xs = [100, 300, 100, 300],
  ys = [85, 85, 215, 215],
) {
  const i = ((index % xs.length) + xs.length) % xs.length;
  return { cx: xs[i], cy: ys[i] };
}

export function stepGatlingGun(params: { crankRpm?: number; barrelCount?: number }) {
  const rpm = params.crankRpm ?? 60;
  const count = params.barrelCount ?? 6;
  const rof = Math.round(rpm * count);
  const crank = rpmToOmega(rpm);
  const cycleTimeMs = Math.round(60000 / Math.max(1, rof));
  return {
    roundsPerMin: rof,
    barrelCoolingIntervalS: Number(((60 / Math.max(1, rof)) * count).toFixed(2)),
    muzzleEnergyJoules: 1850,
    cycleTimeMs,
    crankOmegaRadPerS: crank.omegaRadPerS,
    crankOmegaDegPerS: crank.omegaDegPerS,
    barrelSpacingRad: Number(((2 * Math.PI) / count).toFixed(5)),
    barrelSpacingDeg: Number((360 / count).toFixed(3)),
    firingWindowDeg: Number((180 / count).toFixed(3)),
    camStrokeStudio: 0.38,
    boltHomeX: -0.6,
    boltFlexStudio: GATLING_BOLT_FLEX_STUDIO,
    fireIntervalS: Number((cycleTimeMs / 1000).toFixed(4)),
    muzzleFlashDecayPerS: 8,
    ...gatlingClusterCrate(count, rpm),
    clusterRadiusPx: 32,
    firingBottomDeg: 180,
    barrelSvgW: 260,
    barrelSvgH: 6,
    barrelSvgHalfH: 3,
    boltSvgW: 35,
    boltSvgH: 5,
    boltSvgHalfH: 2.5,
    clusterPlateSpan: 42,
    clusterCx: 260,
    clusterCy: 170,
    boltOriginX: 130,
    boltOriginY: 170,
    muzzleFlashX0: 260,
    muzzleFlashTipX: 300,
    muzzleFlashFlare: 10,
    displayWrapDeg: 360,
    boltStrokePx: 90,
    crankPinRadiusPx: 28,
    schematicBarrelAmpY: 28,
    schematicBarrelCenterY: 150,
    schematicBarrelCount: count,
    schematicBarrelX1: 180,
    schematicBarrelX2: 350,
    schematicBreechX: 70,
    schematicBreechY: 105,
    schematicBreechW: 110,
    schematicBreechH: 90,
    schematicCamD: "M 80 120 Q 120 160 170 120",
    schematicHopperPoints: "100,50 140,50 130,105 110,105",
    schematicCrankX0: 70,
    schematicCrankX1: 40,
    schematicCrankY: 150,
    schematicCrankY1: 190,
    schematicCrankR: 5,
  };
}

/** Schematic barrel Y on the cluster face. Shared by the schematic. */
export function gatlingSchematicBarrelY(angleDeg: number, centerY = 150, ampY = 28) {
  return Number((centerY + Math.sin((angleDeg * Math.PI) / 180) * ampY).toFixed(2));
}

/** Studio cam-flex amplitude on each bolt. Shared by 3D. */
export const GATLING_BOLT_FLEX_STUDIO = 0.04;

/** Peak-normalized cyclic flex at one barrel. Shared by 3D. */
export function gatlingBoltCamFlex(barrelIndex: number, barrelCount: number, crankRpm: number) {
  return cyclicFlex(barrelCount, gatlingClusterKappa(crankRpm), barrelIndex);
}

export function gatlingBoltStudioX(barrelAngleRad: number, homeX = -0.6, stroke = 0.38) {
  return homeX + Math.cos(barrelAngleRad) * stroke;
}

export function gatlingBoltSvgX(angleDeg: number, strokePx = 90) {
  return ((1 - Math.cos((angleDeg * Math.PI) / 180)) / 2) * strokePx;
}

/** Muzzle-flash polygon at the firing barrel. Shared by 2D. */
export function gatlingMuzzleFlash(yPos: number, x0 = 260, tipX = 300, flare = 10) {
  return `${x0},${yPos} ${x0 + 30},${yPos - flare} ${x0 + 15},${yPos} ${tipX},${yPos + 2} ${x0 + 15},${yPos + 5} ${x0 + 30},${yPos + flare}`;
}

export function stepHyattCelluloid(params: { steamTempC?: number; hydraulicPressureMpa?: number }) {
  const temp = params.steamTempC ?? 95;
  const press = params.hydraulicPressureMpa ?? 10;
  const isMelted = temp >= 80 && press >= 6;
  const extrusionRateCmPerMin = isMelted ? Number((temp * 0.15).toFixed(1)) : 0;
  const transparencyPct = isMelted ? Math.min(95, Math.round(50 + (temp - 80) * 1.2)) : 10;
  return {
    viscosityPaS: Math.round(1800 * Math.exp(-0.03 * (temp - 70))),
    isMelted,
    consolidationDensityGPerCm3: Number((1.2 + (press / 20) * 0.18).toFixed(2)),
    transparencyPct,
    extrusionRateCmPerMin,
    // Presentation ram: 14.25 cm/min → 0.75 Hz. Stroke is studio units.
    ramHz: isMelted ? Number(Math.max(0.08, extrusionRateCmPerMin / 19).toFixed(3)) : 0.08,
    ramStrokeStudio: isMelted ? Number((0.12 + press * 0.03).toFixed(3)) : 0.02,
    billetOpacity: Number((0.3 + (transparencyPct / 100) * 0.6).toFixed(3)),
    steamGlowOpacity: Number(Math.min(1, temp / 150).toFixed(3)),
    ...meltFluidCrate(temp),
    ramStudioY: Number((70 + press * 2).toFixed(2)),
    polymerCount: 16,
    polymerCols: 4,
    polymerOriginX: 220,
    polymerOriginY: 150,
    polymerPitchX: 45,
    polymerPitchY: 25,
    polymerSolidR: 5,
    polymerMeltR: 8,
    camphorDx: 12,
    camphorDy: -6,
    camphorR: 4,
    meltLinkDx: 25,
    meltLinkDy: 10,
    schematicJacketX: 70,
    schematicJacketY: 100,
    schematicJacketW: 180,
    schematicJacketH: 80,
    schematicCylinderX: 80,
    schematicCylinderY: 110,
    schematicCylinderW: 160,
    schematicCylinderH: 60,
    schematicRamX: 40,
    schematicRamY: 125,
    schematicRamW: 60,
    schematicRamH: 30,
    schematicMoldX: 295,
    schematicMoldY: 110,
    schematicMoldW: 60,
    schematicMoldH: 60,
    schematicNozzleX0: 250,
    schematicNozzleX1: 290,
    schematicNozzleY0: 120,
    schematicNozzleY1: 160,
    schematicNozzleMidY0: 135,
    schematicNozzleMidY1: 145,
    schematicJacketLabelX: 160,
    schematicJacketLabelY: 90,
    schematicRamLabelX: 70,
    schematicRamLabelY: 170,
    schematicMoldLabelX: 325,
    schematicMoldLabelY: 100,
    ramHomeX: 1.8,
    ramCycleTau: Math.PI * 2,
    flowMax: 1.4,
    flowViscosityRef: 1800,
    flowViscosityFloor: 80,
    solidFlow: 0.08,
    meltedOpacity: 0.88,
    solidOpacity: 0.22,
  };
}

/** Camphor/celluloid chain node on the 2D ram face. Shared by 2D. */
export function hyattPolymerSvg(
  index: number,
  originX = 220,
  originY = 150,
  pitchX = 45,
  pitchY = 25,
  cols = 4,
) {
  return {
    xPos: originX + (index % cols) * pitchX,
    yPos: originY + Math.floor(index / cols) * pitchY,
  };
}

/** Hydraulic ram seat on the schematic. Shared by the schematic. */
export function hyattSchematicRam(x = 40, y = 125, w = 60, h = 30) {
  return { x, y, w, h };
}

/** Split-mold seat on the schematic. Shared by the schematic. */
export function hyattSchematicMold(x = 295, y = 110, w = 60, h = 60) {
  return { x, y, w, h };
}

/** Printed-spec LOX–gasoline stack on the schematic. Shared by the schematic. */
export function goddardSchematicStack() {
  return {
    schematicNoseCx: 200,
    schematicNoseY0: 40,
    schematicNoseY1: 90,
    schematicNoseHalfW: 30,
    schematicChamberX: 170,
    schematicChamberY: 90,
    schematicChamberW: 60,
    schematicChamberH: 70,
    schematicInjectorX: 174,
    schematicInjectorY: 162,
    schematicInjectorW: 52,
    schematicInjectorH: 40,
    schematicNozzleY0: 202,
    schematicNozzleY1: 250,
    schematicNozzleX0: 160,
    schematicNozzleX1: 240,
    schematicNozzleInnerX0: 174,
    schematicNozzleInnerX1: 226,
    schematicFlameCx: 200,
    schematicFlameY: 275,
    schematicFlameHalfW: 10,
    expansionRebuildDelta: 0.04,
    stage2SepY: 7.5,
    stage1SepY: -6.0,
    sepLerp: 0.05,
    stage2HomeY: 4.2,
    stage1HomeY: 0,
    dockLerp: 0.1,
    plumeExitSpread0: 0.22,
    plumeMinAr: 2,
    plumeGimbalCoupling: 0.4,
    plumeWrapY: -8.5,
    plumeResetY: -4.2,
  };
}

export function stepPasteurFermentation(params: {
  pasteurizationTempC?: number;
  holdTimeMin?: number;
  wortTempC?: number;
}) {
  const pTemp = params.pasteurizationTempC ?? 58;
  const hold = params.holdTimeMin ?? 20;
  const temp = params.wortTempC ?? 22;
  const logReduction = Number(
    Math.max(0, Math.min(8.0, (hold / 20) * ((pTemp - 45) / 10) * 4.5)).toFixed(1),
  );
  const yeastActivityPct = Math.min(100, Math.round(100 * Math.exp(-0.02 * (temp - 24) ** 2)));
  return {
    logReduction,
    yeastActivityPct,
    survivorPct: logReduction >= 6 ? 0.0001 : Number((100 * 10 ** -logReduction).toFixed(2)),
    alcoholAbvPct: Number((5.2 * (yeastActivityPct / 100)).toFixed(1)),
    co2PressureBar: Number((1.8 * (yeastActivityPct / 100)).toFixed(2)),
    shelfLifeMonths: logReduction >= 6 ? 24 : 0.5,
    bathGlowOpacity: Number(Math.min(1, pTemp / 120).toFixed(3)),
    ...wortHeatCrate(temp),
    microbeWobbleOmega: 3,
    microbeWobbleAmpPx: 3,
    microbeSvgOriginX: 230,
    microbeSvgOriginY: 140,
    microbeSvgPitchX: 32,
    microbeSvgPitchY: 28,
    microbeCols: 5,
    microbeCount: 14,
    yeastSvgR: 5,
    rodDx: 10,
    rodDy: 3,
    rodSvgW: 10,
    rodSvgH: 4,
    timerWrapS: 60,
    schematicBubbleOriginX: 145,
    schematicBubblePitchX: 25,
    schematicBubbleCount: 5,
    schematicBubbleY: 160,
    schematicBubbleR: 4,
    schematicVesselD: "M 120 100 L 120 210 C 120 235 280 235 280 210 L 280 100 Z",
    schematicSwanD: "M 200 100 L 200 60 C 200 35 250 35 250 65 C 250 90 290 90 290 60",
    schematicYeastX: 130,
    schematicYeastY: 195,
    schematicYeastW: 140,
    schematicYeastH: 25,
    activityNormDivisor: 100,
    bubbleRise0: 0.15,
    bubbleRiseAmp: 1.4,
    bubbleWrapY: 2.0,
    bubbleResetY: -1.4,
    bubbleVisibleThreshold: 0.12,
    bubbleOpacity0: 0.2,
    bubbleOpacityAmp: 0.75,
    bubbleWarmC: 28,
    bubbleWarmHex: 0xf87171,
    bubbleCoolHex: 0xfef08a,
  };
}

/** Yeast-bed seat on the schematic. Shared by the schematic. */
export function pasteurSchematicYeast(x = 130, y = 195, w = 140, h = 25) {
  return { x, y, w, h };
}

/** Anaerobic CO₂ bubble X on the schematic. Shared by the schematic. */
export function pasteurSchematicBubbleX(index: number, originX = 145, pitchX = 25) {
  return originX + index * pitchX;
}

/** Vat-face yeast/microbe seat. Shared by 2D. */
export function pasteurMicrobeSvg(
  index: number,
  timerSeconds: number,
  omega = 3,
  ampPx = 3,
  originX = 230,
  originY = 140,
  pitchX = 32,
  pitchY = 28,
  cols = 5,
) {
  const xPos = originX + (index % cols) * pitchX;
  const yOffset = Math.sin(timerSeconds * omega + index) * ampPx;
  return {
    xPos,
    yPos: originY + Math.floor(index / cols) * pitchY + yOffset,
  };
}

export function stepGliddenBarbedWire(params: {
  wireTensionN?: number;
  twistsPerFoot?: number;
  animalPushForceN?: number;
  barbSpacingInches?: number;
}) {
  const t = params.wireTensionN ?? 650;
  const twists = params.twistsPerFoot ?? 5;
  const push = params.animalPushForceN ?? 120;
  const spacingIn = params.barbSpacingInches ?? 5.0;
  const barbSlipThresholdN = twists * 95;
  const contactAreaMm2 = 0.25;
  const machineRpm = twists * 24;
  const flyer = rpmToOmega(machineRpm);
  return {
    sagCm: Number((2800 / Math.max(100, t)).toFixed(1)),
    barbSlipThresholdN,
    isLocked: barbSlipThresholdN >= push,
    tensileStrengthLbs: 950,
    contactAreaMm2,
    contactStressMpa: Number((push / contactAreaMm2).toFixed(0)),
    machineRpm,
    productionRateFtPerMin: Number(((machineRpm * spacingIn) / 12).toFixed(1)),
    wireTensionLbs: Math.round(t / 4.44822),
    flyerOmegaRadPerS: flyer.omegaRadPerS,
    flyerOmegaDegPerS: flyer.omegaDegPerS,
    reelOmegaRadPerS: Number((flyer.omegaRadPerS * 0.2).toFixed(3)),
    twistWaveAmpPx: Number((twists * 2).toFixed(2)),
    schematicSpurOriginX: 110,
    schematicSpurPitchX: 90,
    schematicSpurCount: 3,
    schematicSpurY: 140,
    schematicWireD0: "M 40 140 Q 120 120 200 140 T 360 140",
    schematicWireD1: "M 40 160 Q 120 180 200 160 T 360 160",
    schematicSpurRx: 8,
    schematicSpurRy: 14,
    schematicBarbDx: 12,
    schematicBarbY0: 120,
    schematicBarbY1: 160,
  };
}

/** Locked spur X on the schematic. Shared by the schematic. */
export function gliddenSchematicSpurX(index: number, originX = 110, pitchX = 90) {
  return originX + index * pitchX;
}

export function stepEdisonPhonograph(params: { mandrelRpm?: number; voiceVolumeDb?: number }) {
  // US 200,521 specifies ten grooves and ten threads to the inch. It does not
  // specify mandrel diameter, rotation rate, indentation depth, or bandwidth.
  // The other quantities returned here are explicitly model-only display
  // assumptions, not measured attributes of Edison's patented apparatus.
  const rpm = params.mandrelRpm ?? 60;
  const vol = params.voiceVolumeDb ?? 75;
  const modelMandrelDiameterInches = 4.0;
  const trackSpeedInPerS = Number(((rpm / 60) * Math.PI * modelMandrelDiameterInches).toFixed(1));
  const surfaceSpeedMps = Number((trackSpeedInPerS * 0.0254).toFixed(2));
  const leadScrewPitchMm = 2.54;
  const axialTravelMmPerS = Number(((rpm / 60) * leadScrewPitchMm).toFixed(3));
  const mandrel = rpmToOmega(rpm);
  return {
    sourceGroovesPerInch: 10,
    sourceThreadsPerInch: 10,
    modelMandrelDiameterInches,
    trackSpeedInPerS,
    grooveDepthMicrons: Number(((vol / 75) * 25).toFixed(1)),
    leadScrewPitchMm,
    axialTravelMmPerS,
    surfaceSpeedMps,
    surfaceSpeedCmPerS: Number((surfaceSpeedMps * 100).toFixed(1)),
    audioBandwidthHz: Math.round(surfaceSpeedMps * 4500),
    mandrelOmegaRadPerS: mandrel.omegaRadPerS,
    mandrelOmegaDegPerS: mandrel.omegaDegPerS,
    stylusAmp: Number(((((vol / 75) * 25) / 1000) * 0.05).toFixed(5)),
    ...grooveWaveCrate(rpm),
    stylusOmegaRadPerS: 45,
    axialDisplayWrapMm: 40,
    axialSvgPxPerMm: 2,
    driveIndicatorSvgR: 45,
    schematicGrooveOriginX: 120,
    schematicGroovePitchX: 20,
    schematicGrooveCount: 8,
    schematicGrooveY0: 110,
    schematicGrooveY1: 180,
    schematicMandrelX: 100,
    schematicMandrelW: 180,
    schematicMandrelH: 70,
    schematicLeadX1: 60,
    schematicLeadX2: 320,
    schematicLeadY: 145,
    schematicDiaphragmCx: 190,
    schematicDiaphragmCy: 90,
    schematicDiaphragmR: 16,
    schematicStylusY: 114,
    schematicHornPoints: "190,80 150,30 230,30",
    stylusHomeY: -0.55,
    leadScrewThreadCount: 40,
    leadScrewThreadOriginX: 90,
    leadScrewThreadPitchX: 10,
    leadScrewThreadDx: 6,
    leadScrewThreadY0: 165,
    leadScrewThreadY1: 175,
    foilGrooveCount: 16,
    foilGrooveOriginX: 15,
    foilGroovePitchX: 11,
    cylinderSvgX: 160,
    cylinderSvgY: 130,
    cylinderSvgW: 200,
    cylinderSvgH: 80,
  };
}

/** Lead-screw thread X on the 2D bench. Shared by 2D. */
export function edisonLeadScrewThreadX(index: number, originX = 90, pitchX = 10) {
  return originX + index * pitchX;
}

/** Tinfoil groove X on the 2D cylinder. Shared by 2D. */
export function edisonFoilGrooveX(index: number, originX = 15, pitchX = 11) {
  return originX + index * pitchX;
}

/** Tinfoil groove X on the schematic cylinder. Shared by the schematic. */
export function edisonSchematicGrooveX(index: number, originX = 120, pitchX = 20) {
  return originX + index * pitchX;
}

/** Cylinder-angle display travel along the US 200,521 lead screw, wrapped to the studio track. */
export function phonographAxialTravelMm(
  cylinderAngleDeg: number,
  leadScrewPitchMm: number,
  wrapMm = 40,
) {
  return Number((((cylinderAngleDeg / 360) * leadScrewPitchMm) % wrapMm).toFixed(1));
}

export function stepThomsonWelding(params: {
  weldCurrentAmps?: number;
  clampPressureMpa?: number;
}) {
  const i = params.weldCurrentAmps ?? 4500;
  const press = params.clampPressureMpa ?? 35;
  const kw = Math.round((i ** 2 * 0.00018) / 1000);
  const tempC = Math.round(25 + (kw / 3.6) * 850);
  const upsetBurrWidthMm = Number(((press / 35) * 3.8).toFixed(1));
  return {
    jouleKw: kw,
    interfaceTempC: tempC,
    isForged: tempC >= 1150 && press >= 25,
    upsetBurrWidthMm,
    burrSvgRx: Number((upsetBurrWidthMm * 1.5).toFixed(2)),
    jouleWatts: kw * 1000,
    weldPulseMs: Math.round(Math.max(200, 5.4e6 / Math.max(500, i))),
    weldGlowIntensity: Number((Math.min(1.5, Math.max(0, tempC / 1300)) * 1.8).toFixed(3)),
    weldSeamScale: Number((1 + (press / 35) * 0.35).toFixed(4)),
    jawStudioOffset: Number(((press / 35) * 0.12).toFixed(4)),
    schematicJawCount: 2,
    schematicJawOriginX: 140,
    schematicJawPitchX: 80,
    schematicJawY: 70,
    schematicJawW: 40,
    schematicJawH: 35,
    schematicWeldCx: 200,
    schematicWeldCy: 87,
    schematicWeldR: 6,
    schematicBarD: "M 90 90 L 90 200 L 310 200 L 310 90",
    schematicCoreX: 170,
    schematicCoreY: 160,
    schematicCoreW: 60,
    schematicCoreH: 60,
    schematicWeldLineX: 200,
    schematicWeldLineY0: 72,
    schematicWeldLineY1: 102,
    schematicUpsetY: 87,
    schematicUpsetLeftX1: 120,
    schematicUpsetLeftX2: 135,
    schematicUpsetRightX1: 280,
    schematicUpsetRightX2: 265,
    sparkGoldenAngleRad: 2.399963229728653,
    sparkWrapRad: Math.PI * 2,
  };
}

/** Water-cooled jaw X on the schematic. Shared by the schematic. */
export function thomsonSchematicJawX(index: number, originX = 140, pitchX = 80) {
  return originX + index * pitchX;
}

export function stepZeppelinAirship(params: {
  gasInflation?: number;
  gasInflationPct?: number;
  flightAlt?: number;
  altitudeM?: number;
  flightSpeedKnots?: number;
  forwardSpeedKmh?: number;
  trimWeight?: number;
  trimWeightPosM?: number;
}) {
  const inflation = params.gasInflation ?? params.gasInflationPct ?? 95;
  const alt = params.flightAlt ?? params.altitudeM ?? 300;
  const speedKmh = params.forwardSpeedKmh ?? (params.flightSpeedKnots ?? 28) * 1.852;
  const trimM = params.trimWeight ?? params.trimWeightPosM ?? 5;
  const rhoAir = 1.225 * Math.exp(-alt / 8400);
  const rhoH2 = 0.089 * Math.exp(-alt / 8400);
  const totalVolumeM3 = 11300 * (inflation / 100);
  const grossBuoyancyKn = Number(((totalVolumeM3 * 9.81 * (rhoAir - rhoH2)) / 1000).toFixed(1));
  const netLiftKn = Number((grossBuoyancyKn - 98.0).toFixed(1));
  const propellerRpm = Math.round((speedKmh / 1.60934 / 17.5) * 1000);
  return {
    grossBuoyancyKn,
    netLiftKn,
    pitchTrimDeg: Number(((trimM * 300 * 9.81) / 15000).toFixed(1)),
    parasiteDragKn: Number(((0.5 * rhoAir * (speedKmh / 3.6) ** 2 * 85 * 0.025) / 1000).toFixed(2)),
    ambientAirDensityKgM3: Number(rhoAir.toFixed(3)),
    hydrogenVolumeM3: totalVolumeM3,
    ...liftHeatCrate(totalVolumeM3),
    grossLiftKg: Math.round((grossBuoyancyKn / 9.81) * 1000),
    usefulPayloadKg: Math.max(0, Math.round((netLiftKn / 9.81) * 1000)),
    flightSpeedKmh: Number(speedKmh.toFixed(1)),
    flightSpeedMph: Number((speedKmh / 1.60934).toFixed(1)),
    propellerRpm,
    propellerOmegaRadPerS: rpmToOmega(propellerRpm).omegaRadPerS,
    propellerDisplayOmegaRadPerS: Number(((propellerRpm / 60) * 8).toFixed(3)),
    hullStudioY: Number(((netLiftKn / 40) * 0.9).toFixed(4)),
    trimSvgX: Number(((trimM / 15) * 140 - 10).toFixed(2)),
    grossLiftTonnes: Number((Math.round((grossBuoyancyKn / 9.81) * 1000) / 1000).toFixed(1)),
    gasCellCount: 17,
    gasCellSvgOriginX: -215,
    gasCellSvgPitch: 27,
    schematicCellCount: 9,
    schematicCellOriginX: 70,
    schematicCellPitch: 32,
    schematicHullCx: 200,
    schematicHullCy: 140,
    schematicHullRx: 170,
    schematicHullRy: 50,
    schematicCellCy: 140,
    schematicCellRx: 12,
    schematicCellRy: 42,
    schematicKeelX1: 60,
    schematicKeelX2: 340,
    schematicKeelY: 180,
    schematicTrimX: 220,
    schematicTrimR: 5,
    schematicGondolaXs: [120, 250],
    schematicGondolaY: 190,
    schematicGondolaW: 30,
    schematicGondolaH: 12,
    swayOmega: 0.8,
    swayAmp: 0.08,
    pitchSwayOmega: 0.4,
    pitchSwayAmp: 0.01,
    trimMinX: -5.0,
    trimMaxX: 5.0,
  };
}

/** Gondola seat on the schematic. Shared by the schematic. */
export function zeppelinSchematicGondola(index: number, xs = [120, 250], y = 190) {
  const i = ((index % xs.length) + xs.length) % xs.length;
  return { x: xs[i], y };
}

/** Schematic gas-cell seat. Shared by the schematic. */
export function zeppelinSchematicCell(index: number, originX = 70, pitch = 32) {
  return { cx: originX + index * pitch };
}

export function stepDaimlerEngine(params: {
  engineRpm?: number;
  hotTubeTempC?: number;
  differentialSlipAngleDeg?: number;
}) {
  const rpm = params.engineRpm ?? 750;
  const tubeTemp = params.hotTubeTempC ?? 850;
  const slipDeg = params.differentialSlipAngleDeg ?? 15;
  const bmepBar = tubeTemp >= 800 ? 4.5 : Number((4.5 * (tubeTemp / 800)).toFixed(2));
  const brakeHorsepower = Number(((bmepBar * 100 * 0.000462 * rpm) / (120 * 0.7457)).toFixed(2));
  const differentialCarrierRpm = Math.round(rpm / 4.5);
  const speedDeltaRpm = Math.round(
    differentialCarrierRpm * Math.sin((slipDeg * Math.PI) / 180) * 0.4,
  );
  const engineWeightKg = 40;
  const crank = rpmToOmega(rpm);
  const runningRpm = tubeTemp >= 600 ? rpm * (bmepBar / 4.5) : 0;
  const running = rpmToOmega(runningRpm);
  return {
    bmepBar,
    brakeHorsepower,
    differentialCarrierRpm,
    outerWheelRpm: differentialCarrierRpm + speedDeltaRpm,
    innerWheelRpm: differentialCarrierRpm - speedDeltaRpm,
    engineWeightKg,
    specificPowerHpPerKg: Number((brakeHorsepower / engineWeightKg).toFixed(3)),
    crankOmegaRadPerS: crank.omegaRadPerS,
    crankOmegaDegPerS: crank.omegaDegPerS,
    isRunning: tubeTemp >= 600,
    runningOmegaRadPerS: running.omegaRadPerS,
    hotTubeGlow: Number(
      (tubeTemp >= 800 ? 2.8 : Math.max(0.15, (tubeTemp / 800) * 2.2)).toFixed(3),
    ),
    ...jacketHeatCrate(tubeTemp),
    pistonStrokePx: 30,
    cycleWrapDeg: 720,
    crankWrapDeg: 360,
    cycleWrapRad: Math.PI * 4,
    crankWrapRad: Math.PI * 2,
    strokeRad: Math.PI,
    intakeLiftAmp: 0.08,
    exhaustLiftAmp: 0.12,
    powerFlashWindowRad: Math.PI * 0.4,
    crankCx: 300,
    crankCy: 250,
    rodOriginY0: 92,
    pistonSvgX: 245,
    pistonSvgY0: 70,
    flywheelRimR: 55,
    flywheelHubR: 12,
    crankPinR: 6,
    schematicFlywheelCx: 200,
    schematicFlywheelCy: 220,
    schematicFlywheelR: 50,
    schematicHubR: 6,
    schematicCylinderX: 140,
    schematicCylinderY: 30,
    schematicCylinderW: 120,
    schematicCylinderH: 140,
    schematicHotTubeX: 90,
    schematicHotTubeY: 45,
    schematicHotTubeW: 50,
    schematicHotTubeH: 14,
    schematicPistonX: 150,
    schematicPistonY: 70,
    schematicPistonW: 100,
    schematicPistonH: 45,
    schematicRodX: 200,
    schematicRodY0: 115,
    schematicRodY1: 210,
    valveHomeY: 2.5,
    exhaustPushrodHomeY: 0.2,
    exhaustRockerCoupling: 1.5,
    flamePistonOffset: 0.35,
    flameScale0: 0.6,
    flameScaleAmp: 0.4,
    hotTubeBrightC: 800,
    hotTubeWarmC: 600,
    hotTubeBrightHex: 0xf97316,
    hotTubeWarmHex: 0xb45309,
    hotTubeColdHex: 0x334155,
    crankR: 0.42,
    pinYHome: -0.65,
    rodLen: 1.7,
    rodMin: 0.1,
  };
}

/** Vertical connecting-rod SVG endpoints. Shared by Diesel and Daimler 2D. */
export function verticalConnectingRod(
  crankAngleDeg: number,
  pistonDisplacement: number,
  pistonStrokePx: number,
  crankCx: number,
  crankCy: number,
  rodOriginY0: number,
) {
  const rad = ((crankAngleDeg % 360) * Math.PI) / 180;
  return {
    x1: crankCx,
    y1: rodOriginY0 + pistonDisplacement,
    x2: crankCx + Math.cos(rad) * pistonStrokePx,
    y2: crankCy + Math.sin(rad) * pistonStrokePx,
  };
}

export function stepHollerithTabulating(params: {
  cardsPerMin?: number;
  supplyVoltageV?: number;
  activeRelays?: number;
}) {
  const cpm = Math.max(1, params.cardsPerMin ?? 60);
  const v = Math.max(0.5, params.supplyVoltageV ?? 12);
  const sensingPinCount = 16;
  const registerDialCount = 40;
  const relays = params.activeRelays ?? sensingPinCount;
  const press = rpmToOmega(cpm);
  const solenoidForceN = Number(
    (((relays * (v / 12) * 45) ** 2 * 1.256e-6 * 0.0004) / (2 * 0.002 ** 2)).toFixed(2),
  );
  return {
    cycleTimeMs: Math.round(60000 / cpm),
    solenoidForceN,
    inductiveTauMs: Number(((0.08 / (v / 2.4)) * 1000).toFixed(1)),
    contactResistanceOhms: 0.08,
    sensingPinCount,
    registerDialCount,
    sortingPocketCount: 24,
    cardsPerDay: Math.round(cpm * 60 * 7),
    cardsPerSec: Number((cpm / 60).toFixed(3)),
    pressOmegaRadPerS: press.omegaRadPerS,
    pressOmegaDegPerS: press.omegaDegPerS,
    plungeAmp: Number((0.2 + (solenoidForceN / 40) * 0.35).toFixed(4)),
    pocketSvgPitch: 18,
    pocketSvgOriginX: 15,
    dialNeedleRadiusPx: 14,
    dialUnitsPerRev: 100,
    cupSvgOriginX: 20,
    cupSvgOriginY: 100,
    cupSvgPitchX: 25,
    cupSvgPitchY: 30,
    cupCols: 8,
    cupSvgR: 7,
    schematicPinOriginX: 80,
    schematicPinPitchX: 30,
    schematicPinCount: 9,
    schematicDialCount: 3,
    schematicDialOriginX: 140,
    schematicDialPitchX: 60,
    schematicDialY: 215,
    schematicDialR: 18,
    schematicPinY0: 70,
    schematicPinY1: 105,
    schematicCupY: 142,
    schematicCupR: 5,
    schematicPressX: 60,
    schematicPressY: 40,
    schematicPressW: 280,
    schematicPressH: 30,
    schematicCardX: 70,
    schematicCardY: 105,
    schematicCardW: 260,
    schematicCardH: 15,
    schematicBedX: 60,
    schematicBedY: 125,
    schematicBedW: 280,
    schematicBedH: 35,
    schematicDialBoxX: 100,
    schematicDialBoxY: 180,
    schematicDialBoxW: 200,
    schematicDialBoxH: 70,
  };
}

/** Press-pin / mercury-cup X on the schematic. Shared by the schematic. */
export function hollerithSchematicPinX(index: number, originX = 80, pitchX = 30) {
  return originX + index * pitchX;
}

/** Accumulator-dial X on the schematic. Shared by the schematic. */
export function hollerithSchematicDialX(index: number, originX = 140, pitchX = 60) {
  return originX + index * pitchX;
}

/** Mercury-cup seat under the pin press. Shared by 2D. */
export function hollerithCupSvg(
  index: number,
  originX = 20,
  originY = 100,
  pitchX = 25,
  pitchY = 30,
  cols = 8,
) {
  return {
    cx: originX + (index % cols) * pitchX,
    cy: originY + Math.floor(index / cols) * pitchY,
  };
}

export function hollerithPocketSvgX(pocketIndex: number, originX = 15, pitch = 18) {
  return originX + pocketIndex * pitch;
}

export function hollerithDialNeedle(val: number, radiusPx = 14, unitsPerRev = 100) {
  const ang = (val / unitsPerRev) * 2 * Math.PI;
  return {
    x: Math.cos(ang) * radiusPx,
    y: Math.sin(ang) * radiusPx,
  };
}

export function stepNoyceIC(params: {
  reverseBias?: number;
  oxideThickness?: number;
  clockFrequencyMhz?: number;
}) {
  const vr = params.reverseBias ?? 5.0;
  const tox = Math.max(0.05, params.oxideThickness ?? 0.5);
  const wUm = Number((0.5 * Math.sqrt(0.7 + vr)).toFixed(2));
  const propDelayNs = Number((0.8 + (1 / tox) * 0.2 + vr * 0.02).toFixed(2));
  const propDelayPs = Math.round(propDelayNs * 1000);
  const clockMhz = params.clockFrequencyMhz ?? 10;
  return {
    depletionWidthUm: wUm,
    junctionCapPfPerMm2: Number((28 / wUm).toFixed(1)),
    propDelayNs,
    breakdownMarginV: Number((35 - vr).toFixed(1)),
    oxideThicknessNm: Math.round(tox * 1000),
    propDelayPs,
    maxClockGhz: Number((1000 / Math.max(1, propDelayPs * 4)).toFixed(2)),
    clockFrequencyMhz: clockMhz,
    clockPeriodNs: Number((1000 / Math.max(0.1, clockMhz)).toFixed(2)),
    signalDisplaySpeed: Number((clockMhz * 0.45).toFixed(3)),
    toneHz: Number((200 + clockMhz * 15).toFixed(1)),
    schematicJunctionCount: 3,
    schematicJunctionOriginX: 90,
    schematicJunctionPitchX: 80,
    schematicJunctionY: 150,
    schematicJunctionW: 50,
    schematicJunctionH: 50,
    schematicContactOriginX: 115,
    schematicContactPitchX: 80,
    schematicContactY0: 120,
    schematicContactY1: 150,
  };
}

/** Planar junction box on the schematic. Shared by the schematic. */
export function noyceSchematicJunction(index: number, originX = 90, pitchX = 80, y = 150) {
  return {
    x: originX + index * pitchX,
    y,
  };
}

/** Oxide-to-metal contact X on the schematic. Shared by the schematic. */
export function noyceSchematicContactX(index: number, originX = 115, pitchX = 80) {
  return originX + index * pitchX;
}

export function stepEdisonBulb(params: { voltage?: number; filamentLength?: number }) {
  const v = params.voltage ?? 110;
  const len = params.filamentLength ?? 22;
  const tempK = Math.round(1200 + (v / 130) * 1150);
  const resOhm = Math.round(90 + (tempK / 2350) * 60 * (len / 22));
  const powerWatts = Number((v ** 2 / resOhm).toFixed(1));
  const currentAmps = Number((v / resOhm).toFixed(3));
  // Carbon-filament life ≈ 1200 h at 110 V, Langmuir V^{-3.5} scaling.
  const designLifeHours = Math.round(1200 / (Math.max(v, 1) / 110) ** 3.5);
  // Swan/Maxim low-R counterfactual (1.5 Ω feeder hog) shares one formula.
  const lowResistanceOhm = 1.5;
  const lowResistanceWatts = Number((v ** 2 / lowResistanceOhm).toFixed(1));
  const lowResistanceAmps = Number((v / lowResistanceOhm).toFixed(3));
  return {
    filamentTempK: tempK,
    hotResistanceOhm: resOhm,
    radiantWatts: powerWatts,
    luminousLmPerW: Number(Math.max(0.1, ((tempK - 1400) / 1000) ** 2 * 2.8).toFixed(2)),
    feederResistanceOhm: 0.4,
    currentAmps,
    feederLossWatts: Number((currentAmps ** 2 * 0.4).toFixed(1)),
    designLifeHours,
    lowResistanceOhm,
    lowResistanceWatts,
    lowResistanceAmps,
    lowResistanceTempK: Math.round(300 + lowResistanceWatts ** 0.45 * 160),
    lowResistanceFeederLossWatts: Number((lowResistanceAmps ** 2 * 0.4).toFixed(1)),
    incandescenceIntensity: Number(Math.min(1, (v / 110) ** 2).toFixed(3)),
    ...edisonHeatCrate(v),
    thermalJitterPerS: Number(((tempK / 300) * 0.4).toFixed(3)),
    filamentEmissiveScale: 3.5,
    schematicGlowOpacity: edisonSchematicGlowOpacity(tempK),
    schematicGlowFill: Number((edisonSchematicGlowOpacity(tempK) * 0.3).toFixed(3)),
    glowOpacity: Number(Math.min(1, Math.max(0.1, powerWatts / 150)).toFixed(3)),
    glowStopInner: Number((Math.min(1, Math.max(0.1, powerWatts / 150)) * 0.8).toFixed(3)),
    glowStopOuter: Number((Math.min(1, Math.max(0.1, powerWatts / 150)) * 0.25).toFixed(3)),
    lowResistanceGlowOpacity: Number(
      Math.min(1, Math.max(0.1, lowResistanceWatts / 150)).toFixed(3),
    ),
    lowResistanceGlowStopInner: Number(
      (Math.min(1, Math.max(0.1, lowResistanceWatts / 150)) * 0.8).toFixed(3),
    ),
    lowResistanceGlowStopOuter: Number(
      (Math.min(1, Math.max(0.1, lowResistanceWatts / 150)) * 0.25).toFixed(3),
    ),
    bulbLightScale: 18,
    glowThreshold: 0.05,
    gasPhaseOmega: 2,
    gasYOmega: 1.3,
    gasZOmega: 0.7,
    schematicEnvelopeD:
      "M 150 190 C 120 160 120 100 160 70 C 200 40 240 70 280 100 C 280 160 250 190 230 210 L 170 210 Z",
    schematicBaseD: "M 170 210 L 170 235 L 230 235 L 230 210 Z",
    schematicFootX1: 160,
    schematicFootX2: 240,
    schematicFootY: 245,
    schematicFilamentD: "M 185 220 L 185 140 C 185 90 215 90 215 140 L 215 220",
    schematicTerminalXs: [185, 215],
    schematicTerminalY: 220,
    schematicTerminalR: 4,
  };
}

/** Carbon-filament terminal seat on the schematic. Shared by the schematic. */
export function edisonSchematicTerminal(index: number, xs = [185, 215], y = 220, r = 4) {
  const i = ((index % xs.length) + xs.length) % xs.length;
  return { cx: xs[i], cy: y, r };
}

export function stepBellTelephone(params: {
  voiceAmplitude?: number;
  airGap?: number;
  batteryVoltage?: number;
  liquidConductivity?: number;
  acousticFrequencyHz?: number;
}) {
  const db = params.voiceAmplitude ?? 75;
  const gap = Math.max(0.05, params.airGap ?? 0.35);
  const displUm = Number((10 ** ((db - 40) / 30) * 0.45).toFixed(2));
  const voiceNorm = Math.max(0, Math.min(1, (db - 40) / 55));
  const volts = params.batteryVoltage ?? 6;
  const sigma = Math.max(0.1, params.liquidConductivity ?? 1.2);
  const baseResistanceOhms = Number((40 / sigma).toFixed(1));
  const resistanceModulationOhms = Number((baseResistanceOhms * 0.45 * voiceNorm).toFixed(1));
  const currentBaselineAmps = Number((volts / baseResistanceOhms).toFixed(3));
  const freqHz = Math.max(1, params.acousticFrequencyHz ?? 440);
  return {
    diaphragmUm: displUm,
    modulatedMa: Number(((displUm / (gap * 1000)) * 18.5).toFixed(2)),
    sensitivityMvPerPa: Number((18.5 / (gap + 0.1)).toFixed(1)),
    baseResistanceOhms,
    resistanceModulationOhms,
    currentBaselineAmps,
    currentBaselineMa: Number((currentBaselineAmps * 1000).toFixed(1)),
    acousticFrequencyHz: freqHz,
    voiceNorm: Number(voiceNorm.toFixed(4)),
    // 440 Hz shown at 1/20 so the diaphragm is visible. HUD states f.
    acousticDisplayOmegaRadPerS: Number(((2 * Math.PI * freqHz) / 20).toFixed(3)),
    electronDisplaySpeed: Number((currentBaselineAmps * 12).toFixed(3)),
    electronStudioSpeed: Number((currentBaselineAmps * 6).toFixed(3)),
    toneGainSine: Number(((db / 100) * 0.1).toFixed(4)),
    toneGainSquare: Number(((db / 100) * 0.06).toFixed(4)),
    waveAdvancePerS: 3,
    diaphragmStudioScale: Number(((displUm / 10) * 0.08).toFixed(5)),
    scopeNorm: Number((freqHz / 440).toFixed(4)),
    scopeSineAmp: Number((db * 0.4).toFixed(2)),
    scopeHarmonicAmp: Number((db * 0.15).toFixed(2)),
    scopeSquareAmp: Number((db * 0.5).toFixed(2)),
    schematicElectrodeXs: [185, 215],
    schematicElectrodeY0: 140,
    schematicElectrodeY1: 200,
    schematicHornCx: 200,
    schematicHornCy: 70,
    schematicHornRx: 55,
    schematicHornRy: 16,
    schematicTransmitterX: 160,
    schematicTransmitterY: 70,
    schematicTransmitterW: 80,
    schematicTransmitterH: 70,
    schematicAcidX: 175,
    schematicAcidY: 145,
    schematicAcidW: 50,
    schematicAcidH: 28,
    schematicBaseX: 150,
    schematicBaseY: 200,
    schematicBaseW: 100,
    schematicBaseH: 18,
    scopeSampleCount: 60,
    scopeSamplePitchPx: 5,
    scopeTScale: 0.2,
    scopeBaselineY: 50,
    rodStudioCoupling: 0.6,
    waveProgressOmega: 3,
    waveProgressPitch: 0.33,
    waveProgressWrap: 1,
    waveOriginX: -5.0,
    waveTravelX: 3.4,
    waveScale0: 0.5,
    waveScaleAmp: 0.8,
    waveOpacity0: 0.65,
    electronWrapX: 2.0,
    electronResetX: -1.5,
    ...bellWaveCrate(freqHz),
  };
}

/** Acoustic-ring progress on the 3D horn. Shared by 3D. */
export function bellWaveProgress(
  timeSec: number,
  index: number,
  omega = 3,
  pitch = 0.33,
  wrap = 1,
) {
  const w = wrap === 0 ? 1 : wrap;
  return (((timeSec * omega + index * pitch) % w) + w) % w;
}

/** Oscilloscope sample for the liquid-transmitter face. Shared by 2D. */
export function bellScopeSample(
  index: number,
  time: number,
  scopeNorm: number,
  scopeSineAmp: number,
  scopeHarmonicAmp: number,
  scopeSquareAmp: number,
  signalType: string,
  pitchPx = 5,
  tScale = 0.2,
  baselineY = 50,
) {
  const x = index * pitchPx;
  const tVal = (index + time) * tScale * scopeNorm;
  let y = baselineY;
  if (signalType === "continuous-undulating") {
    y = baselineY + Math.sin(tVal) * scopeSineAmp + Math.sin(tVal * 2) * scopeHarmonicAmp;
  } else {
    y = Math.sin(tVal) > 0 ? baselineY - scopeSquareAmp : baselineY + scopeSquareAmp;
  }
  return { x, y };
}

export function stepMorseTelegraph(params: {
  currentMa?: number;
  wireTurns?: number;
  lineVoltageV?: number;
  lineLengthMiles?: number;
  wpmSpeed?: number;
}) {
  const n = params.wireTurns ?? 1200;
  const miles = params.lineLengthMiles ?? 44;
  const volts = params.lineVoltageV ?? 24;
  const ohmsPerMile = 12.5;
  const coilResistanceOhms = 150;
  const lineResistanceOhms = Math.round(miles * ohmsPerMile);
  const loopResistanceOhms = lineResistanceOhms + coilResistanceOhms;
  const ohmicCurrentMa = Number(((volts / Math.max(1, loopResistanceOhms)) * 1000).toFixed(1));
  const currentMa = params.currentMa ?? ohmicCurrentMa;
  const i = currentMa / 1000;
  const forceN = Number(((4e-7 * Math.PI * (n * i) ** 2 * 0.0004) / (2 * 0.0015 ** 2)).toFixed(2));
  const wpm = params.wpmSpeed ?? 20;
  const unitDurationMs = Math.round(1200 / Math.max(1, wpm));
  return {
    magneticForceN: forceN,
    timeConstantMs: Number((n * 0.00012 * 10).toFixed(1)),
    ampereTurns: Math.round(n * i),
    stylusKpa: Number((forceN * 28).toFixed(0)),
    loopCurrentMa: Number(currentMa.toFixed(1)),
    ohmicCurrentMa,
    lineResistanceOhms,
    loopResistanceOhms,
    wpmSpeed: wpm,
    unitDurationMs,
    ditMs: unitDurationMs,
    dahMs: unitDurationMs * 3,
    intraGapMs: unitDurationMs,
    letterGapMs: unitDurationMs * 3,
    wordGapMs: unitDurationMs * 7,
    tapeAdvanceRadPerS: Number((1.2 / Math.max(0.02, unitDurationMs / 1000)).toFixed(2)),
    keyOscillationRadPerS: Number(((wpm / 4) * Math.PI).toFixed(3)),
    armatureStrikeM: Number(Math.min(0.2, 0.08 + (forceN / 10) * 0.1).toFixed(4)),
    electronDisplaySpeed: 8,
    ...lineWaveCrate(currentMa),
    electronLaneZ: 0.3,
    electronOriginX: -3.6,
    electronWrapX: 3.6,
    electronSpanX: 7.2,
    keySinThreshold: 0.2,
    keyTiltRad: 0.08,
    armatureHomeY: 2.1,
    governorRatio: 6,
    gearRatio: 2,
    schematicKeyX: 50,
    schematicKeyY: 150,
    schematicKeyW: 70,
    schematicKeyH: 18,
    schematicRelayX: 160,
    schematicRelayY: 90,
    schematicRelayW: 80,
    schematicRelayH: 50,
    schematicSounderX: 280,
    schematicSounderY: 130,
    schematicSounderW: 70,
    schematicSounderH: 40,
    schematicLeverX1: 85,
    schematicLeverY1: 150,
    schematicLeverX2: 120,
    schematicLeverY2: 110,
    schematicKeyRelayX1: 120,
    schematicKeyRelayY1: 159,
    schematicKeyRelayX2: 160,
    schematicKeyRelayY2: 115,
    schematicRelaySounderX1: 240,
    schematicRelaySounderY1: 115,
    schematicRelaySounderX2: 280,
    schematicRelaySounderY2: 150,
  };
}

/** Key, relay, or sounder seat on the schematic. Shared by the schematic. */
export function morseSchematicInstrument(
  id: "key" | "relay" | "sounder",
  key = { x: 50, y: 150, w: 70, h: 18 },
  relay = { x: 160, y: 90, w: 80, h: 50 },
  sounder = { x: 280, y: 130, w: 70, h: 40 },
) {
  const seat = id === "key" ? key : id === "relay" ? relay : sounder;
  const labelLift = id === "sounder" ? 4 : 5;
  return {
    ...seat,
    labelX: seat.x + seat.w / 2,
    labelY: Math.round(seat.y + seat.h / 2 + labelLift),
  };
}

/** Twin-wire electron lane Z on the 3D circuit. Shared by 3D. */
export function morseElectronLaneZ(index: number, laneZ = 0.3) {
  return index % 2 === 0 ? laneZ : -laneZ;
}

/** Image-dissector beam path fraction from photocathode to anode. Shared by 3D. */
export function farnsworthBeamFrac(x: number, originX = -4.5, spanX = 8) {
  const span = spanX === 0 ? 8 : spanX;
  return Math.max(0, Math.min(1, (x - originX) / span));
}

/** Near/far spark X on a Westinghouse wheelset pair. Shared by 3D. */
export function westinghouseSparkWheelX(wheelIndex: number, near = -1.4, far = 1.4) {
  return wheelIndex < 2 ? near : far;
}

/** Near/far spark Z on a Westinghouse axle. Shared by 3D. */
export function westinghouseSparkWheelZ(wheelIndex: number, near = -1.02, far = 1.02) {
  return wheelIndex % 2 === 0 ? near : far;
}

export function stepEngelbartMouse(params: {
  mouseSpeed?: number;
  wheelRadius?: number;
  pulsesPerRev?: number;
}) {
  const v = params.mouseSpeed ?? 350;
  const r = params.wheelRadius ?? 10.0;
  const ppr = params.pulsesPerRev ?? 200;
  const diameterMm = r * 2;
  const circumferenceMm = Math.PI * diameterMm;
  return {
    dpi: Math.round((ppr * 10) / r),
    omegaRadPerS: Number((v / r).toFixed(1)),
    slewPxPerS: Number((v * 3.8).toFixed(0)),
    wheelDiameterMm: diameterMm,
    wheelCircumferenceMm: Number(circumferenceMm.toFixed(2)),
    mmPerPulse: Number((circumferenceMm / ppr).toFixed(3)),
    countsPerMm: Number((ppr / circumferenceMm).toFixed(2)),
    pulseRateHz: Number(((v * ppr) / circumferenceMm).toFixed(1)),
    clickDisplayMs: Math.max(80, Math.round(180000 / Math.max(1, (v * ppr) / circumferenceMm))),
    pathDisplayOmega: Number((v * 0.018).toFixed(4)),
    resolverSvgScale: 40,
    diameterToRadius: 2,
    pointerSvgWidth: 400,
    pointerSvgHeight: 300,
    pointerSvgMinX: 30,
    pointerSvgMaxX: 370,
    pointerSvgMinY: 30,
    pointerSvgMaxY: 270,
    schematicXWheelX: 140,
    schematicXWheelY: 130,
    schematicXWheelW: 14,
    schematicXWheelH: 60,
    schematicYWheelX: 210,
    schematicYWheelY: 150,
    schematicYWheelW: 60,
    schematicYWheelH: 14,
    schematicButtonX: 180,
    schematicButtonY: 40,
    schematicButtonW: 40,
    schematicButtonH: 20,
    schematicBodyD:
      "M 120 220 L 120 100 C 120 60 160 50 200 50 C 240 50 280 60 280 100 L 280 220 Z",
  };
}

/** Orthogonal encoder wheel on the schematic. Shared by the schematic. */
export function engelbartSchematicWheel(
  axis: "x" | "y",
  xWheel = { x: 140, y: 130, w: 14, h: 60 },
  yWheel = { x: 210, y: 150, w: 60, h: 14 },
) {
  const seat = axis === "x" ? xWheel : yWheel;
  return {
    ...seat,
    labelX: seat.x + seat.w / 2,
    labelY: axis === "x" ? seat.y + seat.h + 15 : seat.y + seat.h + 16,
  };
}

/** Registry stores knife-edge radius; the 2D slider is labeled as diameter. */
export function engelbartRadiusFromDiameterMm(diameterMm: number) {
  return Number((Math.max(0, diameterMm) / 2).toFixed(3));
}

export function engelbartPointerSvg(
  clientX: number,
  clientY: number,
  rect: { left: number; top: number; width: number; height: number },
  width = 400,
  height = 300,
  minX = 30,
  maxX = 370,
  minY = 30,
  maxY = 270,
) {
  const svgX = Math.max(minX, Math.min(maxX, ((clientX - rect.left) / rect.width) * width));
  const svgY = Math.max(minY, Math.min(maxY, ((clientY - rect.top) / rect.height) * height));
  return { svgX, svgY };
}

export function stepWozniakApple(params: { crystalFreq?: number; ramCapacityKb?: number }) {
  const f = params.crystalFreq ?? 14.318;
  const cpuMhz = Number((f / 14).toFixed(3));
  return {
    cpuClockMhz: cpuMhz,
    colorSubcarrierMhz: Number((f / 4).toFixed(3)),
    dramWindowNs: Number(((1000 / cpuMhz) * 0.5).toFixed(1)),
    ramCapacityKb: params.ramCapacityKb ?? 48,
    // Φ1 is video refresh; the 6502 never DMA-halts on Φ2.
    cpuDutyPct: 100,
    cycleTimeNs: Math.round(1000 / cpuMhz),
    busTickIntervalMs: Math.max(50, Math.round(2100 / f)),
    // Visual Φ2 window. A 1.023 MHz sine aliases to noise on rAF.
    phi2DisplayHz: 4,
    busDisplaySpeed: Number((cpuMhz * 4).toFixed(2)),
    videoPhaseDivisor: 2,
    videoPacketParity: 0,
    dramBaseAddr: 0x0400,
    dramAddrSpan: 0x0400,
    dramAddrStride: 0x31,
    schematicChipSeats: {
      cpu: { x: 50, y: 60, w: 80, h: 60 },
      mux: { x: 170, y: 60, w: 60, h: 60 },
      ram: { x: 270, y: 60, w: 85, h: 150 },
      video: { x: 50, y: 150, w: 80, h: 60 },
    },
    schematicBusCpuMux: { x1: 130, y1: 90, x2: 170, y2: 90 },
    schematicBusVideoMux: { x1: 130, y1: 180, x2: 170, y2: 105 },
    schematicBusMuxRam: { x1: 230, y1: 90, x2: 270, y2: 90 },
    rasterLineWrap: 192,
  };
}

/** MOS 6502 / MUX / RAM / video-gen chip box on the schematic. Shared by the schematic. */
export function wozniakSchematicChip(
  id: "cpu" | "mux" | "ram" | "video",
  seats: Record<"cpu" | "mux" | "ram" | "video", { x: number; y: number; w: number; h: number }> = {
    cpu: { x: 50, y: 60, w: 80, h: 60 },
    mux: { x: 170, y: 60, w: 60, h: 60 },
    ram: { x: 270, y: 60, w: 85, h: 150 },
    video: { x: 50, y: 150, w: 80, h: 60 },
  },
) {
  const c = seats[id];
  return { ...c, labelX: c.x + c.w / 2, labelY: Math.round(c.y + c.h / 2 + 5) };
}

/** Φ1/Φ2 bus owner and DRAM address for one host tick. Shared by 2D. */
export function wozniakBusCycle(
  tick: number,
  phi2Steal: number,
  videoPhaseDivisor = 2,
  dramBaseAddr = 0x0400,
  dramAddrSpan = 0x0400,
  dramAddrStride = 0x31,
) {
  const normalizedTick = Math.max(0, Math.floor(tick));
  const normalizedSteal = Math.max(0, Math.min(0.9, phi2Steal));
  const nominalVideoPhase = normalizedTick % videoPhaseDivisor === 1;
  const videoSlot = Math.ceil(normalizedTick / videoPhaseDivisor);
  const stolenVideoSlot =
    nominalVideoPhase &&
    Math.floor(videoSlot * normalizedSteal) > Math.floor((videoSlot - 1) * normalizedSteal);

  return {
    phase: nominalVideoPhase && !stolenVideoSlot ? (1 as const) : (0 as const),
    advanceRaster: nominalVideoPhase && !stolenVideoSlot,
    dramAddress: `0x${(dramBaseAddr + ((normalizedTick * dramAddrStride) % dramAddrSpan))
      .toString(16)
      .toUpperCase()
      .padStart(4, "0")}`,
  };
}

/** Φ1 video packet vs Φ2 CPU packet on the 3D bus. Shared by 3D. */
export function wozniakIsVideoPacket(index: number, divisor = 2, videoParity = 0) {
  return index % Math.max(1, divisor) === videoParity;
}

export function stepSpencerMicrowave(anodeKv?: number, magneticGauss?: number, rfWatts?: number) {
  const kv = anodeKv ?? 2.2;
  const b = magneticGauss ?? 1450;
  const rf = rfWatts ?? 800;
  const hullCutoffGauss = Math.round(1180 * Math.sqrt(kv / 4.2));
  const isOscillating = b > hullCutoffGauss;
  return {
    hullCutoffGauss,
    isOscillating,
    microwaveFreqMhz: 2450,
    wavelengthCm: 12.24,
    rfCyclePs: 408,
    dielectricLossWattsPerDm3: isOscillating ? Math.round(rf * 1.8) : 0,
    popcornHeatStepC: isOscillating ? Number(((rf * 1.8) / 450).toFixed(3)) : 0,
    heatTickMs: 200,
    spokeDisplayOmegaRadPerS: isOscillating ? Number(((2450 / 2450) * 4.5).toFixed(3)) : 0,
    anodeKv: kv,
    microwaveFreqHz: 2450e6,
    magneticFluxDensityTesla: Number((b * 1e-4).toFixed(6)),
    electricFieldVpm: Number(((kv * 1000) / 0.01).toFixed(1)),
    voltageVolts: Number((kv * 1000).toFixed(1)),
    spokeOpacity: isOscillating
      ? Number(Math.min(0.95, 0.25 + (Math.round(rf * 1.8) / 2000) * 0.7).toFixed(3))
      : 0,
    // 250 g water, c = 4180 J/(kg·K): t = mcΔT / P for one kelvin.
    waterHeatSecondsPerK: isOscillating ? Number(((4180 * 0.25) / Math.max(1, rf)).toFixed(2)) : 0,
    popcornThresholdC: 100,
    popcornKernelCount: 12,
    initialTempC: 20,
    dryIceHeatStepC: 0,
    timeToPopS: isOscillating
      ? Number((((4180 * 0.25) / Math.max(1, rf)) * (100 - 20)).toFixed(1))
      : 0,
    popcornEllipseY: 0.6,
    popcornUnpoppedR: 8,
    popcornPoppedBaseR: 18,
    popcornPoppedStepR: 6,
    popcornOffsetY: -15,
    schematicCavityCount: 8,
    schematicAnodeCx: 110,
    schematicAnodeCy: 150,
    schematicCavityR: 26,
    schematicOvenX: 50,
    schematicOvenY: 55,
    schematicOvenW: 300,
    schematicOvenH: 190,
    schematicAnodeR: 42,
    schematicCavityDotR: 7,
    schematicWaveguideD: "M 152 150 L 200 130 L 330 130 L 330 170 L 200 170 Z",
    schematicLoadCx: 265,
    schematicLoadCy: 150,
    schematicLoadR: 16,
  };
}

/** Magnetron cavity seat on the schematic. Shared by the schematic. */
export function spencerSchematicCavity(index: number, count = 8, cx = 110, cy = 150, radius = 26) {
  const a = (index * 2 * Math.PI) / Math.max(1, count);
  return {
    cx: Number((cx + Math.cos(a) * radius).toFixed(2)),
    cy: Number((cy + Math.sin(a) * radius).toFixed(2)),
  };
}

/** Bowl-kernel seat on the 2D magnetron face. Shared by 2D. */
export function spencerPopcornSvg(
  index: number,
  isPopped: boolean,
  count = 12,
  ellipseY = 0.6,
  unpoppedR = 8,
  poppedBaseR = 18,
  poppedStepR = 6,
  offsetY = -15,
) {
  const angle = (index / Math.max(1, count)) * Math.PI * 2;
  const rad = isPopped ? poppedBaseR + (index % 3) * poppedStepR : unpoppedR;
  return {
    px: Number((Math.cos(angle) * rad).toFixed(2)),
    py: Number((Math.sin(angle) * (rad * ellipseY) + offsetY).toFixed(2)),
  };
}

export function stepKevlarContinuum(
  drawRatio?: number,
  impactVelocityMps?: number,
  appliedTension?: number,
  temperatureCelsius?: number,
) {
  const draw = drawRatio ?? 6.5;
  const v = impactVelocityMps ?? 450;
  const load = appliedTension ?? 30;
  const tempC = temperatureCelsius ?? 85;
  const elasticModulusGpa = Math.min(145, 60 + draw * 20);
  const sonic = Math.sqrt((elasticModulusGpa * 1e9) / 1440);
  const strainPct = (v / sonic) * 100;
  const tensileStrengthGpa = Number(Math.min(3.6, 0.5 + draw * 0.45).toFixed(2));
  const alignmentPct = Math.min(100, Math.round((draw / 8.0) * 100));
  const thermalDisorder = Number((Math.max(0, (tempC - 60) / 60) * 0.3).toFixed(3));
  const shearAlignment = Number(Math.min(1, (50 + ((draw - 2) / 7) * 950) / 600).toFixed(3));
  return {
    tensileStressMpa: Math.round((strainPct / 100) * elasticModulusGpa * 1000),
    tensileStrainPct: Number(strainPct.toFixed(2)),
    elasticModulusGpa,
    tensileStrengthGpa,
    sonicVelocityMps: Math.round(sonic),
    alignmentPct,
    residualStrengthGpa: Number((tensileStrengthGpa * (1 - load / 220)).toFixed(2)),
    impactDisplayMs: Math.round(Math.max(400, 1e6 / Math.max(50, v))),
    chainWiggleOmegaRadPerS: Number((draw >= 4 ? 2 : 1.5).toFixed(3)),
    thermalDisorder,
    shearRatePerS: Number((50 + ((draw - 2) / 7) * 950).toFixed(1)),
    shearAlignment,
    bulletDisplaySpeed: Number(((v / 400) * 15).toFixed(3)),
    chainWiggleAmp: Number((0.05 * (1 - shearAlignment) + thermalDisorder).toFixed(4)),
    chainWobbleAmp: Number((0.03 * thermalDisorder).toFixed(5)),
    chainWobbleOmega: 2,
    chainWaviness: Number(((100 - alignmentPct) * 0.25 * (1 - load / 180)).toFixed(3)),
    chainEndX: Number((350 + load * 0.28).toFixed(2)),
    schematicLatticeRows: 5,
    schematicLatticeCols: 7,
    schematicLatticeOriginX: 80,
    schematicLatticeOriginY: 80,
    schematicLatticePitchX: 40,
    schematicLatticePitchY: 30,
    schematicLatticeX1: 60,
    schematicLatticeX2: 340,
    schematicNodeR: 5,
    schematicBondXs: [120, 200, 280],
    schematicBondY0: 80,
    schematicBondY1: 200,
    chainBondXs: [80, 140, 200, 260, 320],
    chainBondH: 30,
    chainOffsetYs: [-60, -30, 0, 30, 60],
    chainMidY: 100,
    chainPathX0: 30,
    chainQuadX: 100,
    chainMidX: 200,
  };
}

/** Nematic H-bond lattice seat on the schematic. Shared by the schematic. */
export function kevlarSchematicLattice(
  row: number,
  col: number,
  originX = 80,
  originY = 80,
  pitchX = 40,
  pitchY = 30,
) {
  return {
    cx: originX + col * pitchX,
    cy: originY + row * pitchY,
  };
}

/** H-bond column on the schematic. Shared by the schematic. */
export function kevlarSchematicBond(index: number, xs = [120, 200, 280]) {
  const i = ((index % xs.length) + xs.length) % xs.length;
  return { x: xs[i] };
}

/** 2D inter-chain H-bond post. Shared by 2D. */
export function kevlarChainBond(index: number, xs = [80, 140, 200, 260, 320]) {
  const i = ((index % xs.length) + xs.length) % xs.length;
  return { x: xs[i] };
}

/** PPTA backbone path on the 2D face. Shared by 2D. */
export function kevlarChainPath(
  index: number,
  waviness: number,
  xEnd: number,
  offsets = [-60, -30, 0, 30, 60],
  midY = 100,
  x0 = 30,
  quadX = 100,
  midX = 200,
) {
  const i = ((index % offsets.length) + offsets.length) % offsets.length;
  const yBase = midY + offsets[i];
  const wave = i % 2 === 0 ? waviness : -waviness;
  return {
    yBase,
    d: `M ${x0},${yBase} Q ${quadX},${yBase + wave} ${midX},${yBase} T ${xEnd},${yBase}`,
  };
}

export function stepBardeenTransistor(
  emitterCurrentMa?: number,
  collectorBiasVolts?: number,
  pointSpacingMicrons?: number,
) {
  const _ie = emitterCurrentMa ?? 1.5;
  const _vc = collectorBiasVolts ?? -40;
  const gap = pointSpacingMicrons ?? 50;
  const holeMobilityCm2Vs = 1900;
  const holeDiffusionCoefficient = 0.0259 * holeMobilityCm2Vs;
  const transitTimeNs = ((gap * 1e-4) ** 2 / (2 * holeDiffusionCoefficient)) * 1e9;
  const transportFactor = Math.max(0.15, Math.exp(-transitTimeNs / 800));
  const currentGainAlpha = Number((0.95 * transportFactor * 2.4).toFixed(2));
  const loadLine = bardeenLoadLine(currentGainAlpha);
  return {
    currentGainAlpha,
    holeDiffusionCoefficientCm2ps: Number(holeDiffusionCoefficient.toFixed(1)),
    transitTimeNs: Number(transitTimeNs.toFixed(2)),
    voltageGain: loadLine.voltageGain,
    powerGainDb: loadLine.powerGainDb,
    collectorCurrentMa: Number((_ie * currentGainAlpha).toFixed(2)),
    holeDriftSpeed: Number(
      (currentGainAlpha * (_ie / 2.5) * (holeDiffusionCoefficient / 49) * 3.5).toFixed(3),
    ),
    gapStudioUnits: Number((gap * 0.012).toFixed(4)),
    pointGapSvgPx: Number((gap * 0.8).toFixed(2)),
    holeStreamCount: 12,
    holeStreamHubX: 130,
    holeStreamArcAmpPx: 10,
    holeStreamBaseY: 4,
    holeSvgR: 3,
    holeLabelDx: 2,
    holeLabelDy: 3,
    schematicDieX: 110,
    schematicDieY: 150,
    schematicDieW: 180,
    schematicDieH: 70,
    schematicContactR: 4,
    schematicEmitterX1: 160,
    schematicEmitterY1: 70,
    schematicEmitterX2: 175,
    schematicEmitterY2: 150,
    schematicCollectorX1: 240,
    schematicCollectorY1: 70,
    schematicCollectorX2: 225,
    schematicCollectorY2: 150,
    schematicEmitterLabelX: 150,
    schematicEmitterLabelY: 64,
    schematicCollectorLabelX: 250,
    schematicCollectorLabelY: 64,
    holeWrapPad: 0.1,
    holeResetPad: 0.05,
  };
}

/** n-Ge die seat on the schematic. Shared by the schematic. */
export function bardeenSchematicDie(x = 110, y = 150, w = 180, h = 70) {
  return { x, y, w, h, labelX: x + w / 2, labelY: y + h / 2 + 5 };
}

/** Minority-carrier path between the point contacts. Shared by 2D. */
export function bardeenHoleStream(
  index: number,
  pointGapSvgPx: number,
  count = 12,
  hubX = 130,
  baseY = 4,
  arcAmpPx = 10,
) {
  const frac = index / Math.max(1, count);
  return {
    cx: Number((hubX - pointGapSvgPx + frac * (2 * pointGapSvgPx)).toFixed(2)),
    cy: Number((baseY + Math.sin(frac * Math.PI) * arcAmpPx).toFixed(2)),
  };
}

/** Point-contact amp load line shared by 2D, 3D, and the badge. */
export function bardeenLoadLine(currentGainAlpha: number) {
  const voltageGain = Number(((currentGainAlpha * 20000) / 250).toFixed(1));
  return {
    voltageGain,
    powerGainDb: Number(
      (10 * Math.log10(Math.max(1e-6, voltageGain * currentGainAlpha))).toFixed(1),
    ),
  };
}

export function stepMarconiRadio(
  aerialHeightMeters?: number,
  sparkGapMm?: number,
  coilKv?: number,
) {
  const h = aerialHeightMeters ?? 88;
  const gap = Math.max(0.5, sparkGapMm ?? 10);
  const kv = coilKv ?? 28;
  const wavelengthMeters = h * 4;
  const resonantFreqMhz = Number((300 / wavelengthMeters).toFixed(2));
  const peakRfPowerKw = Number(((kv * kv) / (gap * 1.5)).toFixed(1));
  return {
    wavelengthMeters,
    resonantFreqMhz,
    resonantFreqKhz: Math.round(resonantFreqMhz * 1000),
    maxRangeMiles: Number((0.015 * h * h * (kv / 20)).toFixed(1)),
    peakRfPowerKw,
    // Thin quarter-wave monopole: R_rad ≈ 36.56 Ω independent of height.
    radiationResistanceOhms: 36.56,
    sparkDisplayMs: 1200,
    waveOpacityBase: Number((0.35 + (peakRfPowerKw / 80) * 0.5).toFixed(3)),
    wavePhaseRate: Number((Math.max(0.2, resonantFreqMhz) / 0.85).toFixed(3)),
    waveAdvancePx: Number(((Math.max(0.2, resonantFreqMhz) / 0.85) * 4).toFixed(3)),
    waveRingWrapPx: 120,
    mastStudioScale: Number(Math.max(0.25, h / 88).toFixed(4)),
    toneEnergy: Number(Math.min(1, peakRfPowerKw / 80).toFixed(3)),
    schematicGapX0: 230,
    schematicGapX1: 260,
    schematicGapY: 175,
    schematicGapR: 10,
    schematicMastX: 120,
    schematicMastY0: 50,
    schematicMastY1: 200,
    schematicAerialX1: 80,
    schematicAerialX2: 160,
    schematicAerialY: 55,
    schematicLeadX2: 200,
    schematicSparkDx: 10,
    schematicEarthX: 210,
    schematicEarthY: 210,
    schematicEarthW: 80,
    schematicEarthH: 20,
    mastSvgY: Number((210 - h * 1.6).toFixed(2)),
    fundamentalHz: Number((resonantFreqMhz * 1e6).toFixed(0)),
    ...marconiWaveCrate(resonantFreqMhz),
  };
}

/** Inverse of λ = 4h. Use the fundamental, never a harmonic, as freqHz. */
export function marconiMastHeightFromHz(fundamentalHz: number): number {
  return Math.round(3e8 / (4 * Math.max(1, fundamentalHz)));
}

export function stepColtRevolver(params: {
  chamberPressureMpa?: number;
  cockingAngleDeg?: number;
}) {
  const pMpa = params.chamberPressureMpa ?? 85;
  const cockDeg = params.cockingAngleDeg ?? 45;
  const muzzleVelocityMps = Math.round(180 + Math.sqrt(pMpa) * 13.5);
  return {
    hoopStressMpa: Number(((pMpa * 4.5) / 3.8).toFixed(1)),
    indexAngleDeg: Number(((cockDeg / 45) * 72).toFixed(1)),
    isLocked: cockDeg >= 44,
    schematicBoltRetractY: cockDeg > 2 && cockDeg < 44 ? 8 : 0,
    muzzleVelocityMps,
    muzzleEnergyJoules: Math.round(0.5 * 0.0052 * muzzleVelocityMps ** 2),
    powderGrains: Math.round((pMpa - 40) / 1.5 + 15),
    cycleDisplayMs: 800,
    chamberCount: 5,
    boltRetractY: 12,
    boltHomeY: 0,
    lockReleaseDeg: 2,
    recoilKick: Number((0.05 + (muzzleVelocityMps / 400) * 0.1).toFixed(4)),
    recoilKickX: Number(((0.05 + (muzzleVelocityMps / 400) * 0.1) * 0.8).toFixed(4)),
    schematicArborX1: 80,
    schematicArborX2: 340,
    schematicArborY: 110,
    schematicBarrelX: 210,
    schematicBarrelY: 68,
    schematicBarrelW: 150,
    schematicBarrelH: 28,
    schematicBoreY: 82,
    schematicBoreX2: 360,
    schematicLugD: "M 210 96 L 250 96 L 250 128 L 210 128 Z",
    schematicLugPinX: 224,
    schematicLugPinY: 104,
    schematicLugPinW: 12,
    schematicLugPinH: 16,
    schematicFrameD: "M 50 50 L 125 50 L 125 155 L 85 155 L 60 190 L 30 170 L 45 110 Z",
    schematicCylinderX: 125,
    schematicCylinderY: 60,
    schematicCylinderW: 85,
    schematicCylinderH: 100,
    schematicTopBoreY: 74,
    schematicBoreW: 80,
    schematicBoreH: 16,
    schematicBottomBoreY: 130,
    schematicBoreMouthX: 195,
    schematicBoreMouthR: 5,
    schematicFlashX: 120,
    schematicFlashY0: 65,
    schematicFlashY1: 100,
    schematicHammerPivotX: 80,
    schematicHammerPivotY: 110,
    schematicHammerD: "M 0 0 L -15 -35 L 6 -62 L 20 -58 L 10 -30 Z",
    schematicPawlX1: 8,
    schematicPawlY1: -20,
    schematicPawlX2: 48,
    schematicPawlY2: -16,
    schematicRatchetR: 10,
    schematicBoltX: 160,
    schematicBoltY: 158,
    schematicBoltW: 12,
    schematicBoltH: 14,
    schematicTriggerX: 95,
    schematicTriggerW: 6,
    schematicTriggerCockY: 155,
    schematicTriggerRestY: 145,
    schematicTriggerCockH: 20,
    schematicTriggerRestH: 8,
  };
}

/** 1-based cylinder index after one ratchet step. Shared by 2D. */
export function coltNextChamber(prev: number, chamberCount = 5) {
  const count = Math.max(1, Math.floor(chamberCount));
  const current = Math.max(1, Math.floor(prev));
  return (current % count) + 1;
}

/** Folding-trigger seat on the schematic. Shared by the schematic. */
export function coltSchematicTrigger(
  isLocked: boolean,
  x = 95,
  w = 6,
  cockY = 155,
  restY = 145,
  cockH = 20,
  restH = 8,
) {
  return { x, y: isLocked ? cockY : restY, w, h: isLocked ? cockH : restH };
}

export function stepGoodyearRubber(
  vulcanizationTempC?: number,
  sulfurPct?: number,
  durationMin?: number,
  stretchLambda?: number,
  specimenTempC?: number,
) {
  const temp = vulcanizationTempC ?? 145;
  const sulfur = sulfurPct ?? 8;
  const duration = durationMin ?? 30;
  const lambda = Math.max(1.01, stretchLambda ?? 1.8);
  const specimen = specimenTempC ?? 35;
  const isOptimalTemp = temp >= 135 && temp <= 165;
  const crossLinkDensity = (sulfur / 8.0) * (duration / 30) * (isOptimalTemp ? 1.0 : 0.4);
  const tensileStrengthPsi = Math.min(3200, Math.round(crossLinkDensity * 2800));
  const tensileStrengthMpa = Number((tensileStrengthPsi * 0.00689476).toFixed(2));
  const glassTransitionTempC = Math.round(-70 + sulfur * 3.8);
  const cure = vulcanKinetics(temp, sulfur);
  const isGlassy = specimen < glassTransitionTempC;
  const isVulcanized = isOptimalTemp && crossLinkDensity >= 0.3;
  return {
    crossLinkDensity: Number(crossLinkDensity.toFixed(3)),
    tensileStrengthPsi,
    tensileStrengthMpa,
    elasticReturnPct: Math.min(98, Math.round(50 + crossLinkDensity * 45)),
    isStickyOrBrittle: !isOptimalTemp || crossLinkDensity < 0.3,
    glassTransitionTempC,
    rateRel: Number(cure.rateRel.toFixed(2)),
    regime: cure.regime,
    isGlassy,
    isRawGumMelted: sulfur < 2 && specimen > 35,
    isRawGumBrittle: sulfur < 2 && specimen < 0,
    trueStressMpa: Number((tensileStrengthMpa * (lambda - 1 / lambda ** 2)).toFixed(2)),
    entropicReductionJ: Number((0.5 * 1.38e-23 * 1e26 * (lambda ** 2 + 2 / lambda - 3)).toFixed(1)),
    glassyModulusMpa: 2400,
    stressScale: Number(
      Math.min(2.8, Math.max(0.35, (tensileStrengthPsi / 2800) * (lambda - 0.6))).toFixed(3),
    ),
    thermalAmplitude: isGlassy
      ? 0.005
      : Number(((temp / 140) * (isVulcanized ? 0.03 : 0.1)).toFixed(4)),
    clampStudioX: Number((4.5 * lambda).toFixed(4)),
    ...chainHeatCrate(temp),
    chainStretchPx: Number(((lambda - 1) * 80).toFixed(2)),
    chainSagPx: 25,
    chainSagBezierScale: 1.5,
    schematicStrandCount: 4,
    schematicCrosslinkCount: 3,
    schematicCrosslinkR: 5,
    chainPostXs: [100, 180, 260, 340],
    chainPostH: 25,
    chainAtomDy: 12,
    chainAtomR: 4,
    schematicLinkCount: 3,
    schematicLinkXs: [88, 155, 235, 315],
    schematicLinkY0s: [120, 170, 110],
    schematicLinkY1s: [125, 165, 120],
    thermalWobbleOmega: 4,
    thermalWobblePhasePitch: 1.5,
    gaugeNeedleRadPerStretch: Number((Math.PI * 1.5).toFixed(6)),
    uncoilMin: 0.12,
  };
}

/** Poisson thinning of a stretched polyisoprene chain. Shared by 3D. */
export function goodyearUncoilFactor(stretch: number, uncoilMin = 0.12) {
  return Math.max(uncoilMin, 1 / Math.sqrt(Math.max(1e-6, stretch)));
}

/** 2D sulfur-post seat between gum chains. Shared by 2D. */
export function goodyearChainPost(index: number, xs = [100, 180, 260, 340]) {
  const i = ((index % xs.length) + xs.length) % xs.length;
  return { x: xs[i] };
}

/** Sulfur S–S link on the schematic. Shared by the schematic. */
export function goodyearSchematicLink(
  index: number,
  xs = [88, 155, 235, 315],
  y0s = [120, 170, 110],
  y1s = [125, 165, 120],
) {
  const i = ((index % y0s.length) + y0s.length) % y0s.length;
  return { x1: xs[i], y1: y0s[i], x2: xs[i + 1], y2: y1s[i] };
}

/** Sulfur-strand path on the schematic. Shared by the schematic. */
export function goodyearSchematicStrand(index: number) {
  const strands = [
    { x: 70, y0: 80, qx: 120, qy: 140, y1: 200 },
    { x: 140, y0: 70, qx: 190, qy: 150, y1: 220 },
    { x: 220, y0: 75, qx: 260, qy: 145, y1: 215 },
    { x: 300, y0: 85, qx: 340, qy: 150, y1: 210 },
  ];
  return strands[((index % strands.length) + strands.length) % strands.length];
}

/** S–S crosslink node on the schematic. Shared by the schematic. */
export function goodyearSchematicCrosslink(index: number) {
  const nodes = [
    { cx: 122, cy: 123 },
    { cx: 195, cy: 167 },
    { cx: 275, cy: 115 },
  ];
  return nodes[((index % nodes.length) + nodes.length) % nodes.length];
}

/** Heat-frame count on the fs-sparse 12×16 tape. Shared by 3D. */
export const EINSTEIN_HEAT_FRAME_COUNT = 16;
/** Watts that map the leftover /80 × 8 index onto the 16-frame tape. */
export const EINSTEIN_HEAT_FRAME_WATTS_REF = 80;
export const EINSTEIN_HEAT_FRAME_SCALE = 8;

/** Tape frame for the thermosiphon heat sample. Shared by 3D. */
export function einsteinHeatFrameIndex(coolingWatts: number) {
  return Math.max(
    0,
    Math.min(
      EINSTEIN_HEAT_FRAME_COUNT - 1,
      Math.floor(
        (Math.max(0, coolingWatts) / EINSTEIN_HEAT_FRAME_WATTS_REF) * EINSTEIN_HEAT_FRAME_SCALE,
      ),
    ),
  );
}

export function stepEinsteinRefrigerator(params: {
  heatInput?: number;
  totalPressure?: number;
  ammoniaRatio?: number;
}) {
  const qIn = params.heatInput ?? 220;
  const press = params.totalPressure ?? 15.0;
  const nh3 = params.ammoniaRatio ?? 0.65;
  const evapTempC = -25 + (press - 10) * 1.4 - (nh3 - 0.65) * 18;
  const cop = Number((0.32 * (1 - Math.abs(evapTempC) / 120)).toFixed(2));
  const coolingWatts = Math.round(qIn * cop);
  return {
    evapTempC: Number(evapTempC.toFixed(1)),
    evapTempF: Math.round((evapTempC * 9) / 5 + 32),
    coolingWatts,
    cop,
    pressureAtm: press,
    partialPressureButaneAtm: Number((press * (1 - nh3)).toFixed(2)),
    fluidDisplaySpeed: Number((coolingWatts / 45 + 0.8).toFixed(3)),
    heaterGlowIntensity: Number(((qIn / 250) * 0.95).toFixed(3)),
    generatorGlowIntensity: Number(((qIn / 300) * 0.7).toFixed(3)),
    evaporatorGlowIntensity: Number(Math.min(1.3, Math.max(0.08, -evapTempC / 35)).toFixed(3)),
    schematicVesselLeftX: 70,
    schematicVesselRightX: 240,
    schematicVesselTopY: 50,
    schematicVesselBottomY: 170,
    schematicVesselW: 90,
    schematicVesselH: 60,
    schematicGenCondX1: 160,
    schematicGenCondX2: 240,
    schematicGenCondY: 80,
    schematicCondEvapX: 285,
    schematicCondEvapY1: 110,
    schematicCondEvapY2: 170,
    schematicEvapAbsX1: 240,
    schematicEvapAbsX2: 160,
    schematicEvapAbsY: 200,
    schematicAbsGenX: 115,
    schematicAbsGenY1: 170,
    schematicAbsGenY2: 110,
    fluidWrapY: 2.8,
    heatFrameCount: EINSTEIN_HEAT_FRAME_COUNT,
    heatFrameIndex: einsteinHeatFrameIndex(coolingWatts),
  };
}

/** Thermosyphon rise/fall sign on the 3D loop. Shared by 3D. */
export function einsteinFluidSign(index: number) {
  return index % 2 === 0 ? 1 : -1;
}

/** Generator / condenser / evaporator / absorber seat on the schematic. Shared by the schematic. */
export function einsteinSchematicVessel(
  id: "generator" | "condenser" | "evaporator" | "absorber",
  leftX = 70,
  rightX = 240,
  topY = 50,
  bottomY = 170,
  w = 90,
  h = 60,
) {
  const x = id === "generator" || id === "absorber" ? leftX : rightX;
  const y = id === "generator" || id === "condenser" ? topY : bottomY;
  return { x, y, w, h, labelX: x + w / 2, labelY: y + h / 2 + 5 };
}

export function stepLincolnBuoy(params: {
  inflationPct?: number;
  weightTons?: number;
  shoalDepth?: number;
}) {
  const infl = params.inflationPct ?? 75;
  const weight = params.weightTons ?? 380;
  const depth = params.shoalDepth ?? 3.5;
  const volM3 = Number(((infl / 100) * 42.5).toFixed(1));
  const liftKn = Math.round(volM3 * 9.81);
  const draftRedFt = Number((volM3 * 0.055).toFixed(2));
  const hullLengthFt = 160;
  const hullBeamFt = 32;
  const baseDraftFt = 5.0;
  const hullDraftFt = baseDraftFt + (weight - 380) / 190 - draftRedFt;
  return {
    displacedVolumeM3: volM3,
    displacedVolumeCuFt: Math.round(volM3 * 35.315),
    liftKn,
    liftTons: Number((liftKn / 9.81).toFixed(1)),
    draftReductionFt: draftRedFt,
    hullDraftFt: Number(hullDraftFt.toFixed(2)),
    shoalClearanceFt: Number((depth - hullDraftFt).toFixed(2)),
    hullLengthFt,
    hullBeamFt,
    waterDensityLbsPerCuFt: 62.4,
    baseDraftFt,
    waterplaneAreaSqFt: Math.round(hullLengthFt * hullBeamFt * 0.78),
    paddleDisplayOmegaRadPerS: 1.2,
    ...bellowsFluidCrate(infl),
    bellowsFlarePx: Number(((infl / 100) * 40).toFixed(2)),
    bellowsMidPx: Number(((infl / 100) * 35).toFixed(2)),
    bellowsDropPx: Number(((infl / 100) * 45).toFixed(2)),
    sandbarShoulderY: Number((240 - (8.0 - depth) * 12).toFixed(2)),
    sandbarPeakY: Number((230 - (8.0 - depth) * 14).toFixed(2)),
    sandbarInnerY: Number((245 - (8.0 - depth) * 14).toFixed(2)),
    hullStudioY: Number((150 - (6.0 - hullDraftFt) * 12).toFixed(2)),
    schematicChamberXs: [80, 250],
    schematicChamberY: 140,
    schematicChamberW: 70,
    schematicChamberH: 40,
    schematicTieXs: [115, 285],
    schematicHullD: "M 50 110 L 90 80 L 310 80 L 350 110 L 340 140 L 60 140 Z",
    schematicWaterX1: 50,
    schematicWaterX2: 350,
    schematicWaterY: 190,
    schematicTieY0: 80,
    schematicTieY1: 140,
    inflationNormDivisor: 100,
    bellowsScaleY0: 0.25,
    bellowsScaleYAmp: 0.95,
    bellowsScaleZ0: 0.35,
    bellowsScaleZAmp: 0.85,
    lowerFrameHomeY: -0.7,
    lowerFrameDropAmp: 0.65,
    boatLiftPerFt: 0.45,
    sandbarHomeY: -1.0,
    sandbarDepthPerFt: 0.45,
  };
}

/** Bellows inflation 0–1 from the percent control. Shared by 3D. */
export function lincolnInflationNorm(inflationPct: number, divisor = 100) {
  const d = divisor === 0 ? 100 : divisor;
  return Math.max(0, Math.min(1, inflationPct / d));
}

/** Air-chamber seat on the schematic. Shared by the schematic. */
export function lincolnSchematicChamber(index: number, xs = [80, 250], y = 140) {
  const i = ((index % xs.length) + xs.length) % xs.length;
  return { x: xs[i], y };
}

export function stepMaximMachineGun(params: {
  firingRateRpm?: number;
  waterJacketLiters?: number;
  recoilStrokeMm?: number;
}) {
  const rpm = params.firingRateRpm ?? 600;
  const water = params.waterJacketLiters ?? 4.0;
  const stroke = params.recoilStrokeMm ?? 19;
  const bulletMassKg = 0.014;
  const bulletVelMps = 740;
  const recoilMassKg = 3.2;
  const recoilVelocityMps = Number(((bulletMassKg * bulletVelMps) / recoilMassKg).toFixed(2));
  const recoilMomentumNs = Number((recoilMassKg * recoilVelocityMps).toFixed(2));
  const toggleUnlockForceN = Math.round(180 * (19 / Math.max(5, stroke)));
  const heatGeneratedWatts = Math.round((rpm / 60) * 45 * 1000 * 0.28);
  const waterEvapRateGs = Number(((heatGeneratedWatts / 2260) * (water > 0 ? 1 : 0)).toFixed(2));
  const barrelTempC = water > 0.5 ? 100 : Math.min(450, Math.round(100 + (rpm / 600) * 280));
  const muzzleEnergyJoules = Math.round(0.5 * bulletMassKg * bulletVelMps ** 2);
  const cycleIntervalMs = Math.round(60000 / Math.max(1, rpm));

  return {
    recoilVelocityMps,
    recoilMomentumNs,
    toggleUnlockForceN,
    heatGeneratedWatts,
    waterEvapRateGs,
    barrelTempC,
    muzzleEnergyJoules,
    cycleIntervalMs,
    recoilStrokeMm: stroke,
    recoilStrokeM: Number((stroke / 1000).toFixed(5)),
    recoilStudioStroke: Number(Math.max(0.06, (stroke / 1000) * 5.0).toFixed(4)),
    recoilSvgAmp: Number((stroke / 2).toFixed(2)),
    fireOmegaRadPerS: rpmToOmega(rpm).omegaRadPerS,
    fireOmegaDegPerS: rpmToOmega(rpm).omegaDegPerS,
    fireCycleWrapRad: Math.PI * 2,
    firingWindowRad: 0.6,
    muzzleFlashSinThreshold: 0.82,
    toggleLiftAmp: 0.32,
    toggleHomeY: 0.12,
    toggleHomeX: -0.8,
    toggleRecoilCoupling: 1.8,
    crankThrowAmp: 0.75,
    steamOpacity:
      barrelTempC >= 95 ? Number(Math.min(0.85, (waterEvapRateGs / 15) * 0.75).toFixed(3)) : 0,
    ...jacketHeatCrate(barrelTempC),
    schematicToggleCx: 280,
    schematicToggleCy: 105,
    schematicToggleR: 4,
    schematicJacketX: 40,
    schematicJacketY: 90,
    schematicJacketW: 180,
    schematicJacketH: 60,
    schematicBarrelX1: 20,
    schematicBarrelX2: 240,
    schematicBarrelY: 120,
    schematicBreechX: 220,
    schematicBreechY: 80,
    schematicBreechW: 140,
    schematicBreechH: 80,
    schematicToggleX0: 240,
    schematicToggleY0: 120,
    schematicToggleX1: 280,
    schematicToggleY1: 105,
    schematicToggleX2: 330,
    schematicToggleY2: 120,
    schematicFuseeD: "M 330 140 Q 350 150, 330 160 T 310 170",
  };
}

export function stepHallAluminium(params: {
  currentAmperes?: number;
  bathTemperatureCelsius?: number;
  aluminaConcentrationPct?: number;
}) {
  const I = params.currentAmperes ?? 300000;
  const T = params.bathTemperatureCelsius ?? 960;
  const cAl2O3 = params.aluminaConcentrationPct ?? 5.5;

  // Faraday's Constant F = 96485 C/mol, M(Al) = 26.9815 g/mol, z = 3
  // Theoretical Al yield = (I * 3600 * 26.9815) / (3 * 96485 * 1000) kg/hr = I * 0.0003355 kg/hr
  const currentEfficiency = Math.max(
    0.8,
    Math.min(0.96, 0.94 - Math.max(0, T - 960) * 0.001 - Math.max(0, 4.0 - cAl2O3) * 0.02),
  );
  const alRateKgPerHour = I * 0.0003355 * currentEfficiency;
  const co2RateKgPerHour = (alRateKgPerHour * (3 * 44.01)) / (4 * 26.9815);

  // E_rev = 1.18 V (with carbon oxidation at 960 °C), overpotential eta = 0.55 V, R_bath ~ 9.0 uOhm
  const rBathOhm = 0.000009;
  const cellVoltage = 1.18 + 0.55 + I * rBathOhm;
  const electricalPowerKw = (I * cellVoltage) / 1000;
  const specificEnergyKwhPerKg = electricalPowerKw / Math.max(1, alRateKgPerHour);

  return {
    currentAmperes: I,
    bathTemperatureCelsius: T,
    aluminaConcentrationPct: cAl2O3,
    currentEfficiencyPct: Number((currentEfficiency * 100).toFixed(1)),
    aluminiumProductionRateKgPerHour: Number(alRateKgPerHour.toFixed(1)),
    co2EmissionRateKgPerHour: Number(co2RateKgPerHour.toFixed(1)),
    totalCellVoltage: Number(cellVoltage.toFixed(2)),
    electricalPowerKw: Math.round(electricalPowerKw),
    specificEnergyKwhPerKg: Number(specificEnergyKwhPerKg.toFixed(2)),
    liquidAluminiumDensityGPerCm3: 2.28,
    moltenBathDensityGPerCm3: 2.1,
  };
}

export interface EdisonIndicatorKernelInput {
  mainsVoltageV?: number;
  plateBiasPolarity?: "positive" | "negative" | "neutral" | number;
  vacuumPressureTorr?: number;
  galvanometerTorsionNullV?: number;
}

export interface EdisonIndicatorKernelOutput {
  mainsVoltageV: number;
  filamentPowerW: number;
  filamentTemperatureK: number;
  filamentResistanceOhm: number;
  emissionCurrentMicroAmps: number;
  thermionicCurrentDensityA_m2: number;
  plateBiasPolarity: string;
  galvoDeflectionDeg: number;
  regulatorState: "nominal" | "high_voltage_trip" | "low_voltage_trip";
  spaceChargeFactor: number;
  rectificationRatio: number;
}

export function stepEdisonIndicator(
  params: EdisonIndicatorKernelInput,
): EdisonIndicatorKernelOutput {
  const vLine = params.mainsVoltageV ?? 110;
  const nullV = params.galvanometerTorsionNullV ?? 110;
  let bias: string;
  if (typeof params.plateBiasPolarity === "number") {
    bias =
      params.plateBiasPolarity > 0
        ? "positive"
        : params.plateBiasPolarity < 0
          ? "negative"
          : "neutral";
  } else {
    bias = params.plateBiasPolarity ?? "positive";
  }

  // Carbon filament hot resistance R(V) ~ 200 Ohm at 110 V with mild non-linear coefficient
  const rFilament = 200 * (1 + 0.0012 * (vLine - 110));
  const powerW = (vLine * vLine) / rFilament;

  // Stefan-Boltzmann radiation balance P = eps * sigma * A * T^4 -> T ~ T_nom * (P / P_nom)^0.25
  const tFilamentK = Math.round(2150 * (powerW / 60.5) ** 0.25);

  // Richardson-Dushman: J = A * T^2 * exp(-Phi / (k_B * T))
  // Carbon work function Phi = 4.60 eV, k_B = 8.617333e-5 eV/K
  const phiEv = 4.6;
  const kbEv = 8.617333e-5;
  const exponent = -phiEv / (kbEv * Math.max(1000, tFilamentK));
  const richardsonA = 1.2e6; // A/(m^2*K^2)
  const currentDensity = richardsonA * tFilamentK * tFilamentK * Math.exp(exponent);

  // Emitter effective surface area ~ 1.5 cm^2 = 1.5e-4 m^2
  const emitterAreaM2 = 0.00015;
  const saturatedEmissionUa = currentDensity * emitterAreaM2 * 1e6;

  // Plate collection factor depending on polarity
  let emissionCurrentMicroAmps: number;
  let rectificationRatio = 10000;
  if (bias === "positive") {
    // Unidirectional electron collection swept by positive potential
    emissionCurrentMicroAmps = saturatedEmissionUa;
  } else if (bias === "negative") {
    // Electrostatic repulsion yields near zero current (leakage only)
    emissionCurrentMicroAmps = saturatedEmissionUa * 0.000001;
    rectificationRatio = 100000;
  } else {
    // Neutral plate floating
    emissionCurrentMicroAmps = saturatedEmissionUa * 0.01;
  }

  // Torsional center-zero galvanometer deflection: 0 deg at nullV (110 V)
  // Scaled linearly around nominal with sensitivity ~ 0.5 deg / Volt
  const nominalEmissionUa =
    richardsonA * 2150 * 2150 * Math.exp(-phiEv / (kbEv * 2150)) * emitterAreaM2 * 1e6;
  const rawDeflection =
    bias === "positive"
      ? ((emissionCurrentMicroAmps - nominalEmissionUa) / nominalEmissionUa) * 15.0
      : -15.0;
  const galvoDeflectionDeg = Number(Math.max(-25.0, Math.min(25.0, rawDeflection)).toFixed(1));

  let regulatorState: "nominal" | "high_voltage_trip" | "low_voltage_trip" = "nominal";
  if (vLine > nullV + 2.5) {
    regulatorState = "high_voltage_trip";
  } else if (vLine < nullV - 2.5) {
    regulatorState = "low_voltage_trip";
  }

  return {
    mainsVoltageV: vLine,
    filamentPowerW: Number(powerW.toFixed(1)),
    filamentTemperatureK: tFilamentK,
    filamentResistanceOhm: Number(rFilament.toFixed(1)),
    emissionCurrentMicroAmps: Number(emissionCurrentMicroAmps.toFixed(2)),
    thermionicCurrentDensityA_m2: Number(currentDensity.toFixed(4)),
    plateBiasPolarity: bias,
    galvoDeflectionDeg,
    regulatorState,
    spaceChargeFactor: Number(
      Math.min(1.0, 0.4 + (emissionCurrentMicroAmps / 100) * 0.6).toFixed(2),
    ),
    rectificationRatio,
  };
}

export interface DeForestAudionKernelInput {
  filamentCurrentA?: number;
  gridBiasV?: number;
  gridBiasVoltageV?: number;
  rfInputMv?: number;
  gridSignalAmplitudeMv?: number;
  plateVoltageV?: number;
  loadResistanceKOhms?: number;
}

export interface DeForestAudionKernelOutput {
  filamentCurrentA: number;
  filamentPowerW: number;
  filamentGlowRadiusPx: number;
  filamentTemperatureK: number;
  gridBiasV: number;
  gridBiasVoltageV: number;
  gridCutoffVoltageV: number;
  plateVoltageV: number;
  plateCurrentMa: number;
  vEffective: number;
  effectiveDrivingPotentialV: number;
  amplificationFactorMu: number;
  dynamicTransconductanceMicromhos: number;
  transconductanceMicroMhos: number;
  plateResistanceKOhms: number;
  voltageGain: number;
  inputSignalMv: number;
  outputSignalMv: number;
  platePowerMw: number;
  powerGainDb: number;
  audioOutputMilliWatts: number;
  detectedRfAmplitudeMv: number;
  isConducting: boolean;
}

export function stepDeForestAudion(
  params: DeForestAudionKernelInput = {},
): DeForestAudionKernelOutput {
  const filamentCurrentA = params.filamentCurrentA ?? 1.0;
  const gridBiasV = params.gridBiasVoltageV ?? params.gridBiasV ?? -1.5;
  const rfInputMv = params.gridSignalAmplitudeMv ?? params.rfInputMv ?? 50;
  const plateVoltageV = params.plateVoltageV ?? 45;
  const loadResistanceKOhms = params.loadResistanceKOhms ?? 20;

  const tFilamentK = Math.round(1600 + 600 * Math.min(1.5, Math.max(0.5, filamentCurrentA)));
  const filamentResistanceOhm = 5.5;
  const filamentPowerW = Number(
    (filamentCurrentA * filamentCurrentA * filamentResistanceOhm).toFixed(2),
  );
  const filamentGlowRadiusPx = Math.round(8 + (filamentCurrentA / 1.0) * 12);
  const emissionFactor = Math.max(0, Math.min(2.0, (filamentCurrentA / 1.0) ** 4.0));

  const mu = 12.0;
  const k = 0.00035; // Perveance constant

  const vEff = gridBiasV + plateVoltageV / mu;
  const gridCutoffVoltageV = Number((-plateVoltageV / mu).toFixed(2));
  const rawCurrentMa = vEff > 0 ? k * vEff ** 1.5 * 1000 * emissionFactor : 0.01 * emissionFactor;
  const plateCurrentMa = Number(Math.max(0, Math.min(15.0, rawCurrentMa)).toFixed(2));

  const gm_A_per_V = vEff > 0 ? 1.5 * k * Math.sqrt(vEff) * emissionFactor : 0.00005;
  const transconductanceMicroMhos = Math.round(gm_A_per_V * 1e6);

  const rpOhm = gm_A_per_V > 1e-6 ? mu / gm_A_per_V : 200000;
  const plateResistanceKOhms = Number((rpOhm / 1000).toFixed(1));

  const rLoadOhm = loadResistanceKOhms * 1000;
  const voltageGain = Number(((mu * rLoadOhm) / (rpOhm + rLoadOhm)).toFixed(2));

  const vInRms = rfInputMv / 1000 / Math.SQRT2;
  const vOutRms = vInRms * voltageGain;
  const audioOutputWatts = (vOutRms * vOutRms) / rLoadOhm;
  const audioOutputMilliWatts = Number((audioOutputWatts * 1000).toFixed(2));
  const outputSignalMv = Number((rfInputMv * voltageGain).toFixed(1));

  const platePowerMw = Number((plateVoltageV * plateCurrentMa).toFixed(1));
  const powerGainDb = Number((20 * Math.log10(Math.max(1, voltageGain * 3.5))).toFixed(1));

  return {
    filamentCurrentA,
    filamentPowerW,
    filamentGlowRadiusPx,
    filamentTemperatureK: tFilamentK,
    gridBiasV,
    gridBiasVoltageV: gridBiasV,
    gridCutoffVoltageV,
    plateVoltageV,
    plateCurrentMa,
    vEffective: Number(vEff.toFixed(2)),
    effectiveDrivingPotentialV: Number(vEff.toFixed(2)),
    amplificationFactorMu: mu,
    dynamicTransconductanceMicromhos: transconductanceMicroMhos,
    transconductanceMicroMhos,
    plateResistanceKOhms,
    voltageGain,
    inputSignalMv: rfInputMv,
    outputSignalMv,
    platePowerMw,
    powerGainDb,
    audioOutputMilliWatts,
    detectedRfAmplitudeMv: Number((rfInputMv * (voltageGain / 5.0)).toFixed(0)),
    isConducting: plateCurrentMa > 0.05,
  };
}

export type { ArkwrightWaterFrameControls, ArkwrightWaterFrameOutputs } from "./arkwrightKernel";
export { stepArkwrightWaterFrame } from "./arkwrightKernel";
export type { WattCondenserControls, WattCondenserOutputs } from "./wattCondenserKernel";
export { stepWattCondenser } from "./wattCondenserKernel";

export interface BaekelandBakeliteControls {
  curingTempC?: number;
  autoclavePressurePsi?: number;
  catalystPct?: number;
  curingTimeMin?: number;
  fillerPct?: number;
}

export function stepTownesLaser(params: {
  pumpPowerWatts?: number;
  cavityLengthCm?: number;
  mirror2ReflectivityPct?: number;
  activeMedium?: "potassium_vapor" | "ruby_solid" | "he_ne_gas" | "nd_yag";
  beamDiameterMm?: number;
}) {
  const pPumpW = params.pumpPowerWatts ?? 350;
  const lenCm = params.cavityLengthCm ?? 25;
  const r2Pct = params.mirror2ReflectivityPct ?? 94;
  const medium = params.activeMedium ?? "potassium_vapor";
  const diamMm = params.beamDiameterMm ?? 8;

  // Physical constants and medium properties
  let wavelengthNm = 3140; // 3.14 µm infrared
  let sigmaCm2 = 2.5e-18;
  let thresholdPumpW = 120;
  let slopeEfficiency = 0.32;
  let refractiveIndex = 1.0;

  if (medium === "ruby_solid") {
    wavelengthNm = 694.3; // 694.3 nm deep red
    sigmaCm2 = 2.5e-20;
    thresholdPumpW = 220;
    slopeEfficiency = 0.22;
    refractiveIndex = 1.76;
  } else if (medium === "he_ne_gas") {
    wavelengthNm = 632.8; // 632.8 nm bright red
    sigmaCm2 = 3.0e-19;
    thresholdPumpW = 45;
    slopeEfficiency = 0.15;
    refractiveIndex = 1.0;
  } else if (medium === "nd_yag") {
    wavelengthNm = 1064; // 1064 nm near infrared
    sigmaCm2 = 2.8e-19;
    thresholdPumpW = 85;
    slopeEfficiency = 0.48;
    refractiveIndex = 1.82;
  }

  const r1 = 0.998;
  const r2 = r2Pct / 100;
  const internalLossAlphaPerCm = 0.004;

  // Threshold gain criterion: g_th = alpha + 1/(2L) * ln(1 / (R1 * R2))
  const mirrorLossPerCm = (1 / (2 * lenCm)) * Math.log(1 / (r1 * r2));
  const thresholdGainPerCm = Number((internalLossAlphaPerCm + mirrorLossPerCm).toFixed(4));

  // Small-signal gain from optical pumping: g0 = sigma * N_inv
  const isAboveThreshold = pPumpW >= thresholdPumpW;
  const smallSignalGainPerCm = Number(
    (thresholdGainPerCm * (pPumpW / Math.max(1, thresholdPumpW))).toFixed(4),
  );
  const populationInversionPerCm3 = Number((smallSignalGainPerCm / sigmaCm2).toExponential(2));

  // Laser output power extraction (Watts)
  let laserOutputPowerWatts = 0;
  if (isAboveThreshold) {
    const extractionFactor =
      -Math.log(r2) / (-Math.log(r1 * r2) + 2 * internalLossAlphaPerCm * lenCm);
    laserOutputPowerWatts = Number(
      (slopeEfficiency * (pPumpW - thresholdPumpW) * Math.max(0.2, extractionFactor)).toFixed(2),
    );
  }

  // Intra-cavity circulating optical power (Watts)
  const intraCavityPowerWatts = Number((laserOutputPowerWatts / Math.max(0.01, 1 - r2)).toFixed(1));

  // Fresnel Number N_F = a^2 / (lambda * L)
  const radiusM = (diamMm / 2) * 1e-3;
  const wavelengthM = wavelengthNm * 1e-9;
  const lengthM = lenCm * 1e-2;
  const fresnelNumber = Number((radiusM ** 2 / (wavelengthM * lengthM)).toFixed(2));

  // Diffraction-limited beam divergence (mrad): theta = 1.22 * lambda / D
  const beamDivergenceMrad = Number((((1.22 * wavelengthM) / (diamMm * 1e-3)) * 1e3).toFixed(2));

  // Longitudinal mode frequency spacing (MHz): Delta_nu = c / (2 * n * L)
  const cSpeed = 2.99792458e8;
  const longitudinalModeSpacingMhz = Math.round(cSpeed / (2 * refractiveIndex * lengthM) / 1e6);

  // Cavity Quality Factor Q
  const opticalFrequencyHz = cSpeed / wavelengthM;
  const cavityPhotonLifetimeNs = Number(
    ((lengthM / (cSpeed * (internalLossAlphaPerCm * lengthM + 0.5 * (1 - r1 * r2)))) * 1e9).toFixed(
      2,
    ),
  );
  const cavityQFactor = Number(
    (2 * Math.PI * opticalFrequencyHz * cavityPhotonLifetimeNs * 1e-9).toExponential(2),
  );

  return {
    activeMedium: medium,
    wavelengthNm,
    pumpPowerWatts: pPumpW,
    cavityLengthCm: lenCm,
    mirror2ReflectivityPct: r2Pct,
    beamDiameterMm: diamMm,
    isLasing: isAboveThreshold,
    thresholdGainPerCm,
    smallSignalGainPerCm,
    populationInversionPerCm3,
    laserOutputPowerWatts,
    intraCavityPowerWatts,
    fresnelNumber,
    beamDivergenceMrad,
    longitudinalModeSpacingMhz,
    cavityPhotonLifetimeNs,
    cavityQFactor,
  };
}

export function stepCarlsonElectrophotography(params: {
  coronaVoltageKv?: number;
  exposureLuxSec?: number;
  layerThicknessUm?: number;
  photoconductorType?: "selenium" | "sulfur" | "anthracene" | "opc";
  fuserTemperatureC?: number;
}) {
  const vCoronaKv = params.coronaVoltageKv ?? 6.5;
  const expLuxSec = params.exposureLuxSec ?? 12.0;
  const thickUm = params.layerThicknessUm ?? 30;
  const pcType = params.photoconductorType ?? "selenium";
  const tFuserC = params.fuserTemperatureC ?? 185;

  // Material parameters (quantum efficiency, bandgap eV, dielectric constant)
  let eta = 0.85;
  let bandgapEv = 2.0;
  let _epsilonR = 6.0;
  let sensitivityFactor = 4.2;

  if (pcType === "sulfur") {
    eta = 0.35;
    bandgapEv = 2.6;
    _epsilonR = 4.0;
    sensitivityFactor = 12.0;
  } else if (pcType === "anthracene") {
    eta = 0.2;
    bandgapEv = 3.6;
    _epsilonR = 3.0;
    sensitivityFactor = 18.0;
  } else if (pcType === "opc") {
    eta = 0.95;
    bandgapEv = 1.8;
    _epsilonR = 3.2;
    sensitivityFactor = 3.0;
  }

  // Initial surface electrostatic charge potential (V)
  const initialSurfacePotentialV = Math.round(vCoronaKv * 100);
  const internalElectricFieldKvPerMm = Number(
    (initialSurfacePotentialV / (thickUm * 1e-3) / 1000).toFixed(2),
  );

  // Photo-induced discharge curve: V_exposed = V0 * exp(-eta * exp / sens) + V_res
  const residualPotentialV = 25;
  const decayExponent = (eta * expLuxSec) / sensitivityFactor;
  const exposedSurfacePotentialV = Math.round(
    residualPotentialV + (initialSurfacePotentialV - residualPotentialV) * Math.exp(-decayExponent),
  );

  // Electrostatic potential contrast voltage (V)
  const contrastPotentialV = initialSurfacePotentialV - exposedSurfacePotentialV;

  // Developed toner mass density (mg/cm^2)
  const tonerMassDensityMgPerCm2 = Number(
    Math.min(1.8, (contrastPotentialV / 500) * 1.25).toFixed(2),
  );

  // Optical Reflection Density (OD: 0 to 2.0)
  const opticalDensity = Number(Math.min(1.85, 0.05 + tonerMassDensityMgPerCm2 * 1.15).toFixed(2));

  // Thermal Fuser Fixation Quality (%)
  // Resin melts at ~140°C, optimal at 180-195°C, scorch risk > 215°C
  let fuserBondQualityPct = 0;
  if (tFuserC < 130) {
    fuserBondQualityPct = Math.max(5, Math.round(((tFuserC - 100) / 30) * 30));
  } else if (tFuserC <= 200) {
    fuserBondQualityPct = Math.min(100, Math.round(60 + ((tFuserC - 130) / 70) * 40));
  } else {
    fuserBondQualityPct = Math.max(70, Math.round(100 - (tFuserC - 200) * 2));
  }

  // Process speed (feet per minute / copies per minute)
  const copiesPerMin = pcType === "selenium" || pcType === "opc" ? 45 : 12;

  return {
    coronaVoltageKv: vCoronaKv,
    photoconductorType: pcType,
    photoconductorBandgapEv: bandgapEv,
    layerThicknessUm: thickUm,
    initialSurfacePotentialV,
    exposedSurfacePotentialV,
    contrastPotentialV,
    internalElectricFieldKvPerMm,
    exposureLuxSec: expLuxSec,
    tonerMassDensityMgPerCm2,
    opticalDensity,
    fuserTemperatureC: tFuserC,
    fuserBondQualityPct,
    copiesPerMin,
  };
}

export function stepBaekelandBakelite(
  curingTempC?: number,
  autoclavePressurePsi?: number,
  catalystPct?: number,
  curingTimeMin?: number,
  fillerPct?: number,
) {
  const tempC = Math.max(20, Math.min(220, curingTempC ?? 130));
  const tempK = tempC + 273.15;
  const pressPsi = Math.max(0, Math.min(150, autoclavePressurePsi ?? 75));
  const catPct = Math.max(0, Math.min(10, catalystPct ?? 1.5));
  const timeMin = Math.max(1, Math.min(240, curingTimeMin ?? 60));
  const filler = Math.max(0, Math.min(70, fillerPct ?? 45));

  // Vapor pressure of water at temperature (Antoine equation in bar / psi)
  // log10(P_mmHg) = 8.07131 - 1730.63 / (233.426 + T_C)
  const pMmHg = 10 ** (8.07131 - 1730.63 / (233.426 + tempC));
  const waterVaporPressurePsi = Number(((pMmHg / 760) * 14.6959).toFixed(1));
  const waterVaporPressureBar = Number(((pMmHg / 760) * 1.01325).toFixed(2));
  const appliedPressureBar = Number((pressPsi * 0.0689476).toFixed(2));

  // Boiling / foaming suppression: external pressure must exceed vapor pressure of volatile water/formaldehyde
  const isFoamingSuppressed = pressPsi >= waterVaporPressurePsi * 0.95;
  const voidPorosityPct = isFoamingSuppressed
    ? Number(Math.max(0.1, 0.8 - pressPsi * 0.008).toFixed(1))
    : Number(Math.min(45, (waterVaporPressurePsi - pressPsi) * 1.2 + 8).toFixed(1));

  // Step-growth condensation kinetics (Arrhenius)
  // k = A * exp(-Ea / RT) * (1 + 0.8 * catalyst)
  // Ea ≈ 75 kJ/mol, A ≈ 8.0e8 min^-1
  const R = 8.314; // J/(mol*K)
  const Ea = 75000; // J/mol
  const kRate = 8.0e8 * Math.exp(-Ea / (R * tempK)) * (1 + 0.8 * catPct);

  // Fractional conversion p (2nd-order polycondensation with t): p = (k*t) / (1 + k*t)
  const kt = kRate * timeMin;
  const conversionP = Number(Math.min(0.995, kt / (1 + kt)).toFixed(3));

  // Critical Carothers gel point for phenol (f=3) and formaldehyde (f=2): p_c = 2/f = 0.667
  const gelPointThreshold = 0.667;
  const isGelled = conversionP >= gelPointThreshold;

  // Resin stage classification
  let resinStage:
    | "A-stage (Resole Liquid)"
    | "B-stage (Resitol Gel)"
    | "C-stage (Bakelite Thermoset)" = "A-stage (Resole Liquid)";
  if (conversionP >= 0.85) {
    resinStage = "C-stage (Bakelite Thermoset)";
  } else if (conversionP >= gelPointThreshold) {
    resinStage = "B-stage (Resitol Gel)";
  }

  // Crosslink density (10^21 bonds/cm^3)
  const crosslinkDensity = isGelled
    ? Number((((conversionP - gelPointThreshold) / (1 - gelPointThreshold)) * 1.85).toFixed(2))
    : 0;

  // Mechanical properties (affected by cure conversion, filler ratio, and porosity)
  const baseTensileMpa = 25 + crosslinkDensity * 22;
  const fillerStrengthening = 1 + (filler / 45) * 0.4;
  const porosityPenalty = Math.max(0.1, 1 - (voidPorosityPct / 100) * 2.2);
  const tensileStrengthMpa = Number(
    (baseTensileMpa * fillerStrengthening * porosityPenalty).toFixed(1),
  );

  // Dielectric breakdown strength (kV/mm)
  const baseDielectric = isGelled ? 12.0 + (filler / 45) * 3.5 : 2.5;
  const dielectricBreakdownKvPerMm = Number((baseDielectric * porosityPenalty).toFixed(1));

  // Density (g/cm^3)
  const solidDensity = 1.25 + (filler / 100) * 0.35;
  const densityGPerCm3 = Number((solidDensity * (1 - voidPorosityPct / 100)).toFixed(2));

  // Heat deflection temperature (°C)
  const heatDeflectionTempC = Math.round(isGelled ? 90 + crosslinkDensity * 55 : 45);

  return {
    curingTempC: tempC,
    autoclavePressurePsi: pressPsi,
    appliedPressureBar,
    waterVaporPressurePsi,
    waterVaporPressureBar,
    catalystPct: catPct,
    curingTimeMin: timeMin,
    fillerPct: filler,
    conversionP,
    resinStage,
    isGelled,
    isFoamingSuppressed,
    voidPorosityPct,
    crosslinkDensity,
    tensileStrengthMpa,
    dielectricBreakdownKvPerMm,
    densityGPerCm3,
    heatDeflectionTempC,
  };
}

export interface FessendenWirelessControlParams {
  carrierFrequencyKhz?: number;
  audioModulationPct?: number;
  audioFrequencyHz?: number;
  antennaTuningUh?: number;
  antennaCageDiameterM?: number;
  acidConcentrationPct?: number;
  polarizingVoltageVolts?: number;
  transmissionDistanceKm?: number;
}

export function stepFessendenWireless(params: FessendenWirelessControlParams = {}) {
  const fCarrierKhz = params.carrierFrequencyKhz ?? 75;
  const modPct = params.audioModulationPct ?? 65;
  const fAudioHz = params.audioFrequencyHz ?? 1000;
  const lUh = params.antennaTuningUh ?? 450;
  const cageDiam = params.antennaCageDiameterM ?? 2.4;
  const acidPct = params.acidConcentrationPct ?? 20;
  const vPol = params.polarizingVoltageVolts ?? 1.5;
  const distKm = params.transmissionDistanceKm ?? 25;

  // Antenna capacitance from cage geometry with top-hat capacity (pF)
  const cPf = Number((10000 * (cageDiam / 2.4)).toFixed(1));

  // Natural resonant frequency of antenna LC circuit (kHz): f = 1 / (2*pi*sqrt(L*C))
  const lHenries = lUh * 1e-6;
  const cFarads = cPf * 1e-12;
  const fResonantKhz = Number(
    (1 / (2 * Math.PI * Math.sqrt(lHenries * cFarads)) / 1000).toFixed(2),
  );

  // Tuning offset and resonance alignment
  const detuningKhz = Number(Math.abs(fCarrierKhz - fResonantKhz).toFixed(2));
  const isResonant = detuningKhz < 2.0;

  // Radiation resistance & ohmic loss resistance (Ohms)
  const radiationResistanceOhms = Number((1.8 * (fCarrierKhz / 75) ** 2).toFixed(2));
  const ohmicLossOhms = Number((0.45 / (cageDiam / 2.4)).toFixed(2));
  const totalResistanceOhms = radiationResistanceOhms + ohmicLossOhms;

  // Antenna radiation efficiency (%)
  const radiationEfficiencyPct = Number(
    ((radiationResistanceOhms / totalResistanceOhms) * 100).toFixed(1),
  );

  // Loaded Q factor
  const omega = 2 * Math.PI * fResonantKhz * 1e3;
  const qFactor = Number(((omega * lHenries) / totalResistanceOhms).toFixed(1));

  // Resonance transfer factor: Lorentzian response curve
  const resonanceTransfer = 1 / (1 + ((2 * detuningKhz * qFactor) / fResonantKhz) ** 2);

  // Radiated RF Power (Watts) with 1 kW nominal input
  const nominalInputPowerWatts = 1000;
  const radiatedPowerWatts = Number(
    (nominalInputPowerWatts * (radiationEfficiencyPct / 100) * resonanceTransfer).toFixed(1),
  );

  // Free-space / Groundwave Path propagation to receiver (microwatts)
  const wavelengthM = 3e8 / (fCarrierKhz * 1e3);
  const pathLossFactor = (wavelengthM / (4 * Math.PI * distKm * 1e3)) ** 2 * 1.5;
  const receivedPowerMicrowatts = Number(
    Math.max(0.01, radiatedPowerWatts * pathLossFactor * 1e6).toFixed(3),
  );

  // Liquid Barretter / Electrolytic Detector physics
  // Dilute nitric acid conductivity and junction polarization resistance (Ohms)
  const baseJunctionResistanceOhms = 1200 * (20 / acidPct);
  // Microscopic RF thermal heating decreases polarization barrier resistance
  const deltaResistanceOhms = Number(
    Math.min(
      baseJunctionResistanceOhms * 0.85,
      receivedPowerMicrowatts * 4.5 * (modPct / 100),
    ).toFixed(2),
  );
  const activeDetectorResistanceOhms = Number(
    (baseJunctionResistanceOhms - deltaResistanceOhms).toFixed(1),
  );

  // Local audio receiver circuit (with 2000 Ohm telephone earpiece)
  const phoneImpedanceOhms = 2000;
  const totalAudioCircuitOhms = activeDetectorResistanceOhms + phoneImpedanceOhms;
  const dcPolarizingCurrentMicroamps = Number(((vPol / totalAudioCircuitOhms) * 1e6).toFixed(1));

  // Modulated audio signal current (microamps RMS)
  const audioSignalCurrentMicroamps = Number(
    (((vPol * deltaResistanceOhms) / totalAudioCircuitOhms ** 2) * 1e6 * (modPct / 100)).toFixed(2),
  );

  // Signal to Noise Ratio (dB)
  const thermalNoiseFloorMicrowatts = 0.005;
  const audioSnrDb = Number(
    (10 * Math.log10(Math.max(1, receivedPowerMicrowatts / thermalNoiseFloorMicrowatts))).toFixed(
      1,
    ),
  );

  // Audio acoustic volume (dB SPL in telephone earpiece)
  const audioSoundLevelDbSpl = Number(
    Math.max(
      20,
      Math.min(95, 35 + 20 * Math.log10(Math.max(0.1, audioSignalCurrentMicroamps))),
    ).toFixed(1),
  );

  return {
    carrierFrequencyKhz: fCarrierKhz,
    audioModulationPct: modPct,
    audioFrequencyHz: fAudioHz,
    antennaTuningUh: lUh,
    antennaCageDiameterM: cageDiam,
    antennaCapacitancePf: cPf,
    antennaResonantFreqKhz: fResonantKhz,
    detuningKhz,
    isResonant,
    qFactor,
    radiationResistanceOhms,
    ohmicLossOhms,
    radiationEfficiencyPct,
    radiatedPowerWatts,
    wavelengthM: Number(wavelengthM.toFixed(1)),
    transmissionDistanceKm: distKm,
    receivedPowerMicrowatts,
    acidConcentrationPct: acidPct,
    activeDetectorResistanceOhms,
    dcPolarizingCurrentMicroamps,
    audioSignalCurrentMicroamps,
    audioSnrDb,
    audioSoundLevelDbSpl,
  };
}

export function stepHaberAmmonia(params: {
  pressureAtm?: number;
  temperatureCelsius?: number;
  feedFlowRateMolesPerSec?: number;
  catalystActivity?: number;
}) {
  const pAtm = params.pressureAtm ?? 175;
  const tempC = params.temperatureCelsius ?? 530;
  const flowMolS = params.feedFlowRateMolesPerSec ?? 50;
  const catActivity = params.catalystActivity ?? 1.0;

  // Temperature in Kelvin
  const tempK = tempC + 273.15;
  const pBar = pAtm * 1.01325;
  const pMpa = Number((pBar * 0.1).toFixed(2));

  // Authentic Haber-Larson Equilibrium Constant formula:
  // log10(Kp) = 2098 / T - 5.86 where Kp = P_NH3 / (P_N2^0.5 * P_H2^1.5) [atm^-1]
  const log10Kp = 2100 / tempK - 5.4;
  const kpAtm = 10 ** log10Kp;

  // Equilibrium conversion parameter:
  // For stoichiometric feed (1 N2 : 3 H2): y_eq / (1 - y_eq) = 0.32476 * Kp * P
  const bFactor = 0.32476 * kpAtm * pAtm;
  const eqFraction = bFactor / (1 + bFactor);

  // Kinetic rate constant (Arrhenius with activation energy over Osmium/Fe Ea ≈ 85 kJ/mol)
  const eaJ = 85000;
  const rGas = 8.31446;
  const k0 = 3.2e5;
  const kRate = k0 * Math.exp(-eaJ / (rGas * tempK)) * catActivity;

  // Catalyst bed contact residence time (seconds)
  const bedVolumeLiters = 300;
  const molarVolumeLitersPerMol = (0.08206 * tempK) / pAtm;
  const volumetricFlowLitersPerSec = (flowMolS * molarVolumeLitersPerMol) / 4;
  const spaceTimeSec = Math.max(0.1, bedVolumeLiters / Math.max(1, volumetricFlowLitersPerSec));

  // Approach to equilibrium fraction
  const approachToEquilibrium = Math.min(0.99, 1 - Math.exp(-kRate * spaceTimeSec * 0.15));

  // Actual single-pass ammonia mole fraction and percentage
  const ammoniaMoleFraction = eqFraction * approachToEquilibrium;
  const ammoniaYieldPct = Number((ammoniaMoleFraction * 100).toFixed(2));

  // Ammonia production rate (mol/s and kg/hr)
  // Synthesis: 1 N2 + 3 H2 -> 2 NH3
  const nh3ProducedMolesPerSec = Number(
    (flowMolS * (ammoniaMoleFraction / (1 + ammoniaMoleFraction))).toFixed(3),
  );
  const molarMassNh3KgPerMol = 0.017031;
  const ammoniaProductionKgPerHour = Number(
    (nh3ProducedMolesPerSec * molarMassNh3KgPerMol * 3600).toFixed(2),
  );

  // Exothermic Reaction Heat Release (kW)
  // Delta H_rxn = -46.2 kJ per mole of NH3 formed
  const heatOfFormationKjPerMol = 46.2;
  const reactionHeatGeneratedKw = Number(
    (nh3ProducedMolesPerSec * heatOfFormationKjPerMol).toFixed(2),
  );

  // Counter-current heat exchanger preheat temperature (°C)
  const heatExchangerEfficiency = 0.85;
  const gasHeatCapacityJPerMolK = 29.5;
  const deltaTPreheat =
    (reactionHeatGeneratedKw * 1000 * heatExchangerEfficiency) /
    (flowMolS * gasHeatCapacityJPerMolK);
  const feedPreheatTemperatureCelsius = Number(Math.min(tempC - 20, 25 + deltaTPreheat).toFixed(1));

  // Hydrogen and Nitrogen consumption rates
  const n2ConsumptionKgPerHour = Number(
    (nh3ProducedMolesPerSec * 0.5 * 0.028013 * 3600).toFixed(2),
  );
  const h2ConsumptionKgPerHour = Number(
    (nh3ProducedMolesPerSec * 1.5 * 0.002016 * 3600).toFixed(2),
  );

  // Recycle gas ratio (recirculated volume / fresh makeup volume)
  const singlePassConversion = Math.max(0.01, ammoniaMoleFraction);
  const recycleRatio = Number(((1 - singlePassConversion) / singlePassConversion).toFixed(1));

  return {
    pressureAtm: pAtm,
    pressureMpa: pMpa,
    catalystTemperatureCelsius: tempC,
    feedFlowRateMolesPerSec: flowMolS,
    catalystActivityMultiplier: catActivity,
    equilibriumAmmoniaPct: Number((eqFraction * 100).toFixed(2)),
    approachToEquilibriumPct: Number((approachToEquilibrium * 100).toFixed(1)),
    ammoniaYieldPct,
    nh3ProducedMolesPerSec,
    ammoniaProductionKgPerHour,
    reactionHeatGeneratedKw,
    feedPreheatTemperatureCelsius,
    n2ConsumptionKgPerHour,
    h2ConsumptionKgPerHour,
    recycleRatio,
  };
}

export function stepHewittMercuryLamp(params: {
  mainsVoltageV?: number;
  tubeLengthCm?: number;
  tubeDiameterMm?: number;
  condenserCoolingLevel?: number;
  ballastResistanceOhms?: number;
}) {
  const vMains = params.mainsVoltageV ?? 110;
  const lenCm = params.tubeLengthCm ?? 100;
  const diamMm = params.tubeDiameterMm ?? 25;
  const cooling = params.condenserCoolingLevel ?? 1.0;
  const rBallast = params.ballastResistanceOhms ?? 12;

  // Condenser temperature and equilibrium mercury vapor pressure (mmHg)
  const tCondenserK = 315 / Math.max(0.5, Math.min(2.0, cooling));
  const log10PHg = 8.118 - 3168 / tCondenserK;
  const pMercuryMmHg = Number((10 ** log10PHg).toFixed(4));
  const pMercuryPa = Number((pMercuryMmHg * 133.322).toFixed(2));

  // High-voltage starting breakdown potential (V)
  const breakdownStartingVoltageV = Math.round(1200 + 40 * lenCm);

  // Electrode fall voltages (Cathode pool ~10V, Anode ~4.5V)
  const vElectrodeFall = 14.5;

  // Solve operating arc current from load line:
  // V_mains = vElectrodeFall + (E_col * lenCm) + I * R_ballast
  // where E_col = (0.75 + 0.15 * sqrt(p_Hg)) / I^0.35
  let iArc = 3.5;
  for (let iter = 0; iter < 10; iter++) {
    const eColumn = (0.75 + 0.15 * Math.sqrt(pMercuryMmHg)) / Math.max(0.5, iArc) ** 0.35;
    const vArcEst = vElectrodeFall + eColumn * lenCm;
    const iNext = Math.max(0.2, (vMains - vArcEst) / rBallast);
    iArc = 0.5 * (iArc + iNext);
  }

  const arcCurrentAmperes = Number(iArc.toFixed(2));
  const electricFieldVPerCm = Number(
    ((0.75 + 0.15 * Math.sqrt(pMercuryMmHg)) / arcCurrentAmperes ** 0.35).toFixed(2),
  );
  const positiveColumnVoltageV = Number((electricFieldVPerCm * lenCm).toFixed(1));
  const arcOperatingVoltageV = Number((vElectrodeFall + positiveColumnVoltageV).toFixed(1));
  const ballastVoltageDropV = Number((arcCurrentAmperes * rBallast).toFixed(1));

  // Dynamic negative differential resistance of the arc (dV/dI < 0)
  const dynamicArcResistanceOhms = Number(
    (-0.35 * (positiveColumnVoltageV / arcCurrentAmperes)).toFixed(2),
  );
  const isStable = rBallast + dynamicArcResistanceOhms > 0;

  // Power metrics (W)
  const arcPowerWatts = Number((arcOperatingVoltageV * arcCurrentAmperes).toFixed(1));
  const totalPowerWatts = Number((vMains * arcCurrentAmperes).toFixed(1));
  const electricalEfficiencyPct = Number(((arcPowerWatts / totalPowerWatts) * 100).toFixed(1));

  // Luminous Efficacy & Output (lumens)
  const luminousEfficacyLmPerWatt = Number(
    (72 * (arcCurrentAmperes / 3.5) ** 0.2 * (25 / diamMm) ** 0.15).toFixed(1),
  );
  const luminousFluxLumens = Math.round(arcPowerWatts * luminousEfficacyLmPerWatt);
  const equivalentCarbonBulbs = Math.round(luminousFluxLumens / 200); // 16-cp carbon bulb ≈ 200 lm

  // Cathode spot current density (A/cm²)
  const cathodeSpotAreaMm2 = Number((arcCurrentAmperes / 500).toFixed(4));
  const cathodeCurrentDensityAperCm2 = 50000;

  return {
    mainsVoltageV: vMains,
    tubeLengthCm: lenCm,
    tubeDiameterMm: diamMm,
    mercuryVaporPressureMmHg: pMercuryMmHg,
    mercuryVaporPressurePa: pMercuryPa,
    breakdownStartingVoltageV,
    arcOperatingVoltageV,
    arcCurrentAmperes,
    ballastVoltageDropV,
    electricFieldVPerCm,
    dynamicArcResistanceOhms,
    isStable,
    arcPowerWatts,
    totalPowerWatts,
    electricalEfficiencyPct,
    luminousEfficacyLmPerWatt,
    luminousFluxLumens,
    equivalentCarbonBulbs,
    cathodeSpotAreaMm2,
    cathodeCurrentDensityAperCm2,
  };
}

export { stepBellPhotophone } from "./bellPhotophoneKernel";
export { stepCortPuddlingRolling } from "./cortKernel";
export { stepRillieuxEvaporator } from "./rillieuxEvaporatorKernel";
export { readWattRotaryControls, stepWattRotaryEngine } from "./wattRotaryKernel";
export { DEFAULT_LOCK_BITTINGS_MM, stepYaleLock } from "./yaleLockKernel";

/**
 * US 3,138,743 Jack S. Kilby Monolithic Integrated Circuit Physics Kernel
 *
 * Computes bulk semiconductor sheet resistance, reverse-biased p-n junction
 * depletion capacitance, mesa BJT amplification, and monolithic solid-circuit
 * switching dynamics.
 */
export function stepKilbyIntegratedCircuit(params: {
  substrateMaterial?: "germanium" | "silicon";
  supplyVoltageV?: number;
  resistorWidthUm?: number;
  resistorLengthUm?: number;
  dopingConcentrationCm3?: number;
  junctionAreaUm2?: number;
  reverseBiasVoltageV?: number;
  baseDriveCurrentUa?: number;
}) {
  const material = params.substrateMaterial ?? "germanium";
  const vcc = params.supplyVoltageV ?? 6.0;
  const wUm = params.resistorWidthUm ?? 50.0;
  const lUm = params.resistorLengthUm ?? 500.0;
  const ndCm3 = params.dopingConcentrationCm3 ?? 2.5e15;
  const areaUm2 = params.junctionAreaUm2 ?? 2500.0;
  const vrV = params.reverseBiasVoltageV ?? 3.0;
  const ibUa = params.baseDriveCurrentUa ?? 40.0;

  // Material physical constants
  // Germanium: eps_r = 16.0, mu_n = 3900 cm^2/V*s, V_bi = 0.35 V, E_g = 0.66 eV
  // Silicon:   eps_r = 11.7, mu_n = 1400 cm^2/V*s, V_bi = 0.70 V, E_g = 1.12 eV
  const q = 1.602e-19; // C
  const eps0 = 8.854e-14; // F/cm
  const isGe = material === "germanium";

  const epsR = isGe ? 16.0 : 11.7;
  const epsS = epsR * eps0;
  const muN = isGe ? 3900.0 : 1400.0; // cm^2 / V*s
  const vBi = isGe ? 0.35 : 0.7; // V

  // 1. Bulk Semiconductor Resistivity & Sheet Resistance (Ohm*cm & Ohm/sq)
  // Layer thickness t = 10 um = 1e-3 cm
  const thicknessCm = 1e-3;
  const bulkResistivityOhmCm = 1.0 / (q * muN * ndCm3);
  const sheetResistanceOhmSq = bulkResistivityOhmCm / thicknessCm;

  // Resistor geometry: aspect ratio = L / W
  const aspectSquares = lUm / wUm;
  const collectorLoadResistanceOhms = Math.round(sheetResistanceOhmSq * aspectSquares);
  const baseBiasResistanceOhms = Math.round(collectorLoadResistanceOhms * 4.5);

  // 2. P-N Junction Depletion Layer & Transition Capacitance
  // W_dep = sqrt(2 * eps_s * (V_bi + V_R) / (q * N_d)) in cm
  const totalPotentialV = vBi + vrV;
  const wDepCm = Math.sqrt((2.0 * epsS * totalPotentialV) / (q * ndCm3));
  const wDepUm = Number((wDepCm * 1e4).toFixed(3)); // um

  // C_j = eps_s * Area / W_dep in Farads (Area in cm^2)
  const areaCm2 = areaUm2 * 1e-8;
  const junctionCapacitancePf = Number((((epsS * areaCm2) / wDepCm) * 1e12).toFixed(2));

  // 3. Mesa Bipolar Transistor Switching & Gain
  const beta = isGe ? 65.0 : 85.0; // Common-emitter current gain
  const ibAmps = ibUa * 1e-6;
  const icActiveAmps = beta * ibAmps;
  const vceSat = isGe ? 0.15 : 0.25;
  const icSatAmps = (vcc - vceSat) / collectorLoadResistanceOhms;

  const isSaturated = icActiveAmps >= icSatAmps;
  const icActualAmps = Math.min(icActiveAmps, icSatAmps);
  const collectorCurrentMa = Number((icActualAmps * 1e3).toFixed(2));
  const collectorVoltageV = Number(
    Math.max(vceSat, vcc - icActualAmps * collectorLoadResistanceOhms).toFixed(2),
  );

  // 4. Circuit Dynamics & Propagation Delay
  // RC time constant tau = R_b * C_j
  const tauNs = Number((baseBiasResistanceOhms * (junctionCapacitancePf * 1e-12) * 1e9).toFixed(2));
  const maxClockFrequencyMhz = Number((1000.0 / (2.5 * Math.max(1.0, tauNs))).toFixed(1));

  // Phase-shift oscillator resonant frequency f_osc = 1 / (2 * pi * R * C * sqrt(6))
  const fOscKhz = Number(
    (
      1.0 /
      (2.0 *
        Math.PI *
        collectorLoadResistanceOhms *
        (junctionCapacitancePf * 1e-12) *
        Math.sqrt(6)) /
      1000.0
    ).toFixed(1),
  );

  // Component density (parts per cubic inch)
  const dieVolumeMm3 = 5.0 * 2.0 * 0.25; // 2.5 mm^3 = 0.000152 in^3
  const componentDensityPerCuFt = Math.round((12 / (dieVolumeMm3 * 1e-9)) * 0.0283);

  return {
    material,
    supplyVoltageV: vcc,
    resistorWidthUm: wUm,
    resistorLengthUm: lUm,
    dopingConcentrationCm3: ndCm3,
    junctionAreaUm2: areaUm2,
    reverseBiasVoltageV: vrV,
    baseDriveCurrentUa: ibUa,
    bulkResistivityOhmCm: Number(bulkResistivityOhmCm.toFixed(3)),
    sheetResistanceOhmSq: Math.round(sheetResistanceOhmSq),
    collectorLoadResistanceOhms,
    baseBiasResistanceOhms,
    depletionWidthUm: wDepUm,
    junctionCapacitancePf,
    transistorGainBeta: beta,
    collectorCurrentMa,
    collectorVoltageV,
    isTransistorSaturated: isSaturated,
    propagationDelayNs: tauNs,
    maxClockFrequencyMhz,
    phaseShiftOscillatorFrequencyKhz: fOscKhz,
    componentDensityPerCuFt,
  };
}

/**
 * Edwin Land US 2,543,181 — Polaroid Instant Photography & Diffusion Transfer Reversal
 */
export interface LandPolaroidInput {
  reagentViscosityCp?: number; // 1,000 to 100,000 cP
  rollerGapUm?: number; // 10 to 60 um
  hydroquinoneConcentrationM?: number; // 0.05 to 0.40 M
  thiosulfateConcentrationM?: number; // 0.10 to 0.80 M
  alkaliPh?: number; // 10.5 to 13.8
  exposureFraction?: number; // 0.0 to 1.0
  developmentTimeSec?: number; // 0 to 60 s
}

export interface LandPolaroidState {
  negativeSilverDensity: number;
  positiveSilverDensity: number;
  transferEfficiencyPercent: number;
  diffusionFluxMolPerM2S: number;
  meniscusSpreadUniformityPercent: number;
  printCompletionPercent: number;
  unexposedSilverComplexedRatio: number;
}

export function stepLandPolaroidInstantFilm(input: LandPolaroidInput): LandPolaroidState {
  const viscosity = input.reagentViscosityCp ?? 25000;
  const gap = input.rollerGapUm ?? 25;
  const hq = input.hydroquinoneConcentrationM ?? 0.2;
  const hypo = input.thiosulfateConcentrationM ?? 0.35;
  const ph = input.alkaliPh ?? 12.6;
  const exposure = Math.max(0, Math.min(1, input.exposureFraction ?? 0.6));
  const time = Math.max(0, Math.min(60, input.developmentTimeSec ?? 30));

  // pH-dependent development rate constant k_dev (hydroquinone dianion activity)
  const phFactor = 10 ** (ph - 11.5);
  const kDev = 0.08 * (hq / 0.2) * (phFactor / (1 + phFactor));

  // Hypo solubilization rate constant k_sol
  const kSol = 0.06 * (hypo / 0.35);

  // Negative silver development
  const negProgress = 1 - Math.exp(-kDev * time);
  const negativeSilverDensity = Number((2.8 * exposure * negProgress).toFixed(2));

  // Soluble silver thiosulfate complex formation from unexposed silver halide
  const unexposedFraction = 1 - exposure;
  const complexationProgress = 1 - Math.exp(-kSol * time);
  const unexposedSilverComplexedRatio = Number(
    (unexposedFraction * complexationProgress).toFixed(3),
  );

  // Fickian Diffusion coefficient D inversely proportional to polymer viscosity
  const dDiff = 1.2e-9 * (25000 / Math.max(1000, viscosity)); // m^2/s
  const gapMeters = gap * 1e-6;
  const diffusionTimeConst = (gapMeters * gapMeters) / (2 * dDiff);
  const transferProgress = 1 - Math.exp(-time / Math.max(0.5, diffusionTimeConst));

  // Positive reflection silver density (D_max = 2.10)
  const positiveSilverDensity = Number((2.1 * unexposedFraction * transferProgress).toFixed(2));

  // Transfer efficiency
  const transferEfficiencyPercent = Number((92 * (1 - Math.exp(-time / 15))).toFixed(1));

  // Diffusion flux
  const gradC = (hypo * unexposedFraction) / gapMeters;
  const diffusionFluxMolPerM2S = Number((dDiff * gradC * 1000).toFixed(4));

  // Meniscus spread uniformity (optimal at 10,000 - 50,000 cP)
  const viscPenalty = Math.abs(Math.log10(viscosity / 25000));
  const meniscusSpreadUniformityPercent = Number(Math.max(40, 98 - viscPenalty * 22).toFixed(1));

  // Overall print completion percentage
  const printCompletionPercent = Number(Math.min(100, (time / 60) * 100).toFixed(1));

  return {
    negativeSilverDensity,
    positiveSilverDensity,
    transferEfficiencyPercent,
    diffusionFluxMolPerM2S,
    meniscusSpreadUniformityPercent,
    printCompletionPercent,
    unexposedSilverComplexedRatio,
  };
}

export interface MaimanRubyLaserControls {
  pumpEnergyJoules?: number;
  flashDurationMs?: number;
  rodLengthCm?: number;
  outputMirrorReflectivity?: number;
  crystalTemperatureKelvin?: number;
}

export function stepMaimanRubyLaser(controls: MaimanRubyLaserControls = {}) {
  const pumpEnergy = controls.pumpEnergyJoules ?? 150; // 50 to 500 Joules
  const flashMs = controls.flashDurationMs ?? 1.0; // 0.5 to 3.0 ms
  const rodLength = controls.rodLengthCm ?? 5.0; // cm
  const r2 = controls.outputMirrorReflectivity ?? 0.92; // 0.70 to 0.98
  const tempK = controls.crystalTemperatureKelvin ?? 300; // 100 to 350 K

  // Cr3+ total doping density in 0.05% pink ruby
  const nTotal = 1.58e19; // ions/cm^3

  // Temperature-dependent stimulated emission cross-section (cm^2)
  // sigma = 2.5e-20 cm^2 at 300K, increases at lower temperatures
  const sigma21 = 2.5e-20 * (300 / Math.max(80, tempK));

  // Metastable 2E lifetime (ms): ~4.3 ms at 77K, ~3.0 ms at 300K
  const tauMetastableMs = 3.0 * (300 / Math.max(80, tempK)) ** 0.35;

  // Optical pumping efficiency and absorbed pump rate into level 3
  const pumpCouplingEfficiency = 0.22; // 22% electrical-to-absorbed optical in green/violet bands
  const rodRadiusCm = 0.25; // 5 mm diameter ruby cylinder (Maiman 1960 apparatus)
  const rodVolumeCm3 = Math.PI * rodRadiusCm ** 2 * rodLength;
  const photonEnergyPumpJoules = (6.626e-34 * 3e8) / 520e-9; // ~3.8e-19 J for ~520 nm green pump photon
  const totalPumpPhotons = (pumpEnergy * pumpCouplingEfficiency) / photonEnergyPumpJoules;
  const pumpRatePerCm3 = totalPumpPhotons / (rodVolumeCm3 * (flashMs * 1e-3));

  // Population inversion threshold (3-level: N2 must exceed N1 by deltaN_th)
  const r1 = 0.999;
  const internalLossAlpha = 0.03; // cm^-1 scattering/absorption loss
  const cavityLoss = internalLossAlpha + (1 / (2 * rodLength)) * Math.log(1 / (r1 * r2));
  const deltaNThreshold = cavityLoss / sigma21; // ions/cm^3

  // Required pump energy threshold
  const thresholdPumpEnergyJoules = Number(
    (
      ((nTotal / 2 + deltaNThreshold) * rodVolumeCm3 * photonEnergyPumpJoules) /
      (pumpCouplingEfficiency * (1 - Math.exp(-flashMs / tauMetastableMs)))
    ).toFixed(1),
  );

  // Excited state population N2
  const effectiveExcitation = (pumpEnergy / Math.max(1, thresholdPumpEnergyJoules)) * (nTotal / 2);
  const n2 = Math.min(nTotal * 0.95, Math.max(1e17, effectiveExcitation));
  const n1 = Math.max(0, nTotal - n2);
  const populationInversionDensity = Number((n2 - n1).toExponential(3));
  const populationInversionRatio = Number((n2 / Math.max(1, n1)).toFixed(2));

  // Lasing threshold state
  const isLasing = pumpEnergy >= thresholdPumpEnergyJoules;
  const netRoundTripGainDb = Number(
    (4.343 * 2 * (sigma21 * (n2 - n1) - cavityLoss) * rodLength).toFixed(2),
  );

  // Laser output pulse energy and peak power
  const slopeEfficiency = 0.012; // 1.2% slope efficiency
  const laserPulseEnergyJoules = isLasing
    ? Number((slopeEfficiency * (pumpEnergy - thresholdPumpEnergyJoules)).toFixed(3))
    : 0;
  const pulseDurationUs = 250; // typical spiked relaxation burst duration (us)
  const laserPeakPowerKw = isLasing
    ? Number((laserPulseEnergyJoules / (pulseDurationUs * 1e-6) / 1000).toFixed(2))
    : 0;

  // Wavelength at temperature: 694.3 nm at 300K, shifts to 693.4 nm at 77K
  const emissionWavelengthNm = Number((694.3 - 0.005 * (300 - tempK)).toFixed(2));

  // Cavity longitudinal mode spacing (GHz)
  const refractiveIndexRuby = 1.76;
  const modeSpacingGhz = Number(
    (3e8 / (2 * refractiveIndexRuby * (rodLength * 1e-2)) / 1e9).toFixed(2),
  );

  // Colidar ranging distance resolution (cm) for 20 ns pulse
  const colidarDistanceResolutionCm = 15; // c * 1ns = 30 cm roundtrip -> 15 cm

  return {
    isLasing,
    populationInversionRatio,
    populationInversionDensity,
    thresholdPumpEnergyJoules,
    laserPulseEnergyJoules,
    laserPeakPowerKw,
    netRoundTripGainDb,
    emissionWavelengthNm,
    modeSpacingGhz,
    colidarDistanceResolutionCm,
    metastableLifetimeMs: Number(tauMetastableMs.toFixed(2)),
    pumpRatePerCm3: Number(pumpRatePerCm3.toExponential(3)),
  };
}
