/**
 * Shared SI steps for catalog machines advertised on the telemetry registry
 * but previously missing from engine.ts. Badge and 3D must call these.
 */

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

export function stepPeltonWheel(params: { headMeters?: number; runnerRpm?: number }) {
  const h = params.headMeters ?? 450;
  const rpm = params.runnerRpm ?? 600;
  const vJet = Math.round(Math.sqrt(2 * 9.81 * h));
  const uBucket = (rpm * 2 * Math.PI * 0.75) / 60;
  const speedRatio = uBucket / Math.max(1, vJet);
  const etaPct = Math.max(40, Math.round(93 - Math.abs(speedRatio - 0.5) * 160));
  const hydroKw = (45 * 9.81 * h) / 1000;
  const runner = rpmToOmega(rpm);
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
    jetOpacity: Number((0.55 + (etaPct / 93) * 0.4).toFixed(3)),
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
    inducedEmfIndex,
    collectionContinuityPct: Number((100 - 100 / printedJunctionCount).toFixed(1)),
    displayDegPerFrame,
    displayRadPerFrame: Number(((displayDegPerFrame * Math.PI) / 180).toFixed(6)),
    fluxOpacity: Number(Math.min(0.95, 0.25 + (inducedEmfIndex / 160) * 0.7).toFixed(3)),
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
    crankOmegaRadPerS: crank.omegaRadPerS,
    crankOmegaDegPerS: crank.omegaDegPerS,
    govDisplayOmegaRadPerS: Number(((rpm / 180) * 9).toFixed(3)),
    flyballRadius: Number((0.18 + Math.min(0.15, (rpm / 300) * 0.14)).toFixed(4)),
  };
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
    steamAdvancePerS: Number(((enthalpyKjKg / 550) * (rpm / 3000) * 12).toFixed(3)),
    steamOpacity: Number(Math.min(0.95, 0.25 + (shaftPowerKw / 14000) * 0.7).toFixed(3)),
    steamSwirlOmegaRadPerS: Number((rotorOmegaRadPerS * displaySlowdown * 0.5).toFixed(3)),
    shaftPowerMw: Number((shaftPowerKw / 1000).toFixed(1)),
    inletBar: Number((psi / 14.5038).toFixed(3)),
  };
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
    shipSpeedKnots,
    thrustKn,
    pitchMeters,
    theoreticalSpeedKnots,
    slipFraction,
    shaftOmegaRadPerS: Number(shaftOmegaRadPerS.toFixed(3)),
    shaftOmegaDegPerS: Number((rpm * 6).toFixed(1)),
    wakeSwirlScale: 0.4,
    wakeFlowSpeed: 6.5,
    wakeSwirlCoeff: 0.08,
    wakeOpacity: Number(Math.min(0.95, 0.3 + (thrustKn / 30) * 0.65).toFixed(3)),
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
  return {
    gForce,
    fatYieldPct: Math.min(99.9, Number((95 + (gForce / 5000) * 4.5).toFixed(1))),
    creamFlowLph,
    skimFlowLph: Number((flow * 0.88).toFixed(1)),
    creamDropAdvancePerS: Number(((creamFlowLph / 300) * 1.6).toFixed(3)),
    bowlOmegaRadPerS: Number(bowlOmegaRadPerS.toFixed(2)),
    bowlOmegaDegPerS: Number((rpm * 6).toFixed(1)),
    displaySlowdown,
    displayOmegaRadPerS: Number((bowlOmegaRadPerS * displaySlowdown).toFixed(3)),
    displayOmegaDegPerS: Number((rpm * 6 * displaySlowdown).toFixed(1)),
    pulleyDisplayOmegaRadPerS: Number((bowlOmegaRadPerS * displaySlowdown * 0.25).toFixed(3)),
    skimDropAdvancePerS: Number(((creamFlowLph / 300) * 1.6 * 0.85).toFixed(3)),
  };
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
    shockwaveGlow: Number((1 + (detonationVelocityMps / 6000) * 1.5).toFixed(3)),
    stickDisplayOmegaRadPerS: 0.2,
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
    crankOmegaRadPerS: crank.omegaRadPerS,
    crankOmegaDegPerS: crank.omegaDegPerS,
    sawOmegaRadPerS: saw.omegaRadPerS,
    brushOmegaRadPerS: brush.omegaRadPerS,
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
    reelBarPct: Number(Math.min(100, (reelRpm / 80) * 100).toFixed(1)),
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
  };
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
  };
}

export function stepGatlingGun(params: { crankRpm?: number; barrelCount?: number }) {
  const rpm = params.crankRpm ?? 60;
  const count = params.barrelCount ?? 6;
  const rof = Math.round(rpm * count);
  const crank = rpmToOmega(rpm);
  return {
    roundsPerMin: rof,
    barrelCoolingIntervalS: Number(((60 / Math.max(1, rof)) * count).toFixed(2)),
    muzzleEnergyJoules: 1850,
    cycleTimeMs: Math.round(60000 / Math.max(1, rof)),
    crankOmegaRadPerS: crank.omegaRadPerS,
    crankOmegaDegPerS: crank.omegaDegPerS,
  };
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
    ramStudioY: Number((70 + press * 2).toFixed(2)),
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
  };
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
    stylusOmegaRadPerS: 45,
    axialDisplayWrapMm: 40,
  };
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
  };
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
  };
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
  };
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
    thermalJitterPerS: Number(((tempK / 300) * 0.4).toFixed(3)),
    filamentEmissiveScale: 3.5,
    glowOpacity: Number(Math.min(1, Math.max(0.1, powerWatts / 150)).toFixed(3)),
    lowResistanceGlowOpacity: Number(
      Math.min(1, Math.max(0.1, lowResistanceWatts / 150)).toFixed(3),
    ),
    bulbLightScale: 18,
  };
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
    // 440 Hz shown at 1/20 so the diaphragm is visible. HUD states f.
    acousticDisplayOmegaRadPerS: Number(((2 * Math.PI * freqHz) / 20).toFixed(3)),
    electronDisplaySpeed: Number((currentBaselineAmps * 12).toFixed(3)),
    electronStudioSpeed: Number((currentBaselineAmps * 6).toFixed(3)),
    toneGainSine: Number(((db / 100) * 0.1).toFixed(4)),
    toneGainSquare: Number(((db / 100) * 0.06).toFixed(4)),
    waveAdvancePerS: 3,
    diaphragmStudioScale: Number(((displUm / 10) * 0.08).toFixed(5)),
  };
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
  };
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
  };
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
  };
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
    thermalDisorder: Number((Math.max(0, (tempC - 60) / 60) * 0.3).toFixed(3)),
    shearRatePerS: Number((50 + ((draw - 2) / 7) * 950).toFixed(1)),
    shearAlignment: Number(Math.min(1, (50 + ((draw - 2) / 7) * 950) / 600).toFixed(3)),
    bulletDisplaySpeed: Number(((v / 400) * 15).toFixed(3)),
    chainWaviness: Number(((100 - alignmentPct) * 0.25 * (1 - load / 180)).toFixed(3)),
    chainEndX: Number((350 + load * 0.28).toFixed(2)),
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
    mastStudioScale: Number(Math.max(0.25, h / 88).toFixed(4)),
    toneEnergy: Number(Math.min(1, peakRfPowerKw / 80).toFixed(3)),
    mastSvgY: Number((210 - h * 1.6).toFixed(2)),
    fundamentalHz: Number((resonantFreqMhz * 1e6).toFixed(0)),
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
    muzzleVelocityMps,
    muzzleEnergyJoules: Math.round(0.5 * 0.0052 * muzzleVelocityMps ** 2),
    powderGrains: Math.round((pMpa - 40) / 1.5 + 15),
    cycleDisplayMs: 800,
    recoilKick: Number((0.05 + (muzzleVelocityMps / 400) * 0.1).toFixed(4)),
    recoilKickX: Number(((0.05 + (muzzleVelocityMps / 400) * 0.1) * 0.8).toFixed(4)),
  };
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
    chainStretchPx: Number(((lambda - 1) * 80).toFixed(2)),
  };
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
  };
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
    bellowsFlarePx: Number(((infl / 100) * 40).toFixed(2)),
    bellowsMidPx: Number(((infl / 100) * 35).toFixed(2)),
    bellowsDropPx: Number(((infl / 100) * 45).toFixed(2)),
    sandbarShoulderY: Number((240 - (8.0 - depth) * 12).toFixed(2)),
    sandbarPeakY: Number((230 - (8.0 - depth) * 14).toFixed(2)),
    sandbarInnerY: Number((245 - (8.0 - depth) * 14).toFixed(2)),
    hullStudioY: Number((150 - (6.0 - hullDraftFt) * 12).toFixed(2)),
  };
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
    steamOpacity:
      barrelTempC >= 95 ? Number(Math.min(0.85, (waterEvapRateGs / 15) * 0.75).toFixed(3)) : 0,
  };
}
