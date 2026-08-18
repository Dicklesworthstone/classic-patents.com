/**
 * Shared SI steps for catalog machines advertised on the telemetry registry
 * but previously missing from engine.ts. Badge and 3D must call these.
 */

export function stepPeltonWheel(params: { headMeters?: number; runnerRpm?: number }) {
  const h = params.headMeters ?? 450;
  const rpm = params.runnerRpm ?? 600;
  const vJet = Math.round(Math.sqrt(2 * 9.81 * h));
  const uBucket = (rpm * 2 * Math.PI * 0.75) / 60;
  const speedRatio = uBucket / Math.max(1, vJet);
  const etaPct = Math.max(40, Math.round(93 - Math.abs(speedRatio - 0.5) * 160));
  const hydroKw = (45 * 9.81 * h) / 1000;
  return {
    jetVelocityMps: vJet,
    bucketSpeedMps: Number(uBucket.toFixed(2)),
    speedRatio: Number(speedRatio.toFixed(3)),
    etaPct,
    shaftPowerKw: Math.round(hydroKw * (etaPct / 100)),
  };
}

export function stepGrammeDynamo(params: { shaftRpm?: number; coilSegments?: number }) {
  const rpm = params.shaftRpm ?? 950;
  const segs = params.coilSegments ?? 32;
  const emfVolts = Math.round((rpm / 950) * 110 * (segs / 32));
  const powerWatts = Math.round(emfVolts ** 2 / 12);
  return {
    emfVolts,
    powerWatts,
    armatureCurrentA: Number((powerWatts / Math.max(1, emfVolts)).toFixed(1)),
    voltageRipplePct: Number(((Math.PI ** 2 / (2 * segs ** 2)) * 100).toFixed(2)),
  };
}

export function stepOttoEngine(params: { engineRpm?: number; compressionRatio?: number }) {
  const rpm = params.engineRpm ?? 180;
  const cr = params.compressionRatio ?? 4.5;
  const peakCompressionBar = Number((1.0 * cr ** 1.35).toFixed(1));
  return {
    brakeHorsepower: Number(((rpm / 180) * (3.0 * (cr / 4.5) ** 0.5)).toFixed(1)),
    thermalEfficiencyPct: Math.round((1 - 1 / cr ** 0.4) * 100),
    peakCompressionBar,
    peakFiringBar: Number((peakCompressionBar * 3.8).toFixed(1)),
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
  return {
    enthalpyKjKg,
    shaftPowerKw: Math.round(28 * enthalpyKjKg * 0.84 * (rpm / 3000)),
    inletMpa: Number((psi * 0.00689476).toFixed(2)),
    stageCount: 48,
    isentropicEfficiencyPct: 84,
    steamBladeSpeedRatio: Number((bladeSpeedMps / Math.max(1, steamSpeedMps)).toFixed(2)),
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
  return {
    shipSpeedKnots,
    thrustKn: Math.round((rpm / 120) ** 2 * 18 * pitchFactor),
    pitchMeters,
    theoreticalSpeedKnots,
    slipFraction,
  };
}

export function stepDeLavalSeparator(params: { bowlRpm?: number; rawMilkFlowLph?: number }) {
  const rpm = params.bowlRpm ?? 6500;
  const flow = params.rawMilkFlowLph ?? 300;
  const gForce = Math.round((((rpm * 2 * Math.PI) / 60) ** 2 * 0.1) / 9.80665);
  return {
    gForce,
    fatYieldPct: Math.min(99.9, Number((95 + (gForce / 5000) * 4.5).toFixed(1))),
    creamFlowLph: Number((flow * 0.12).toFixed(1)),
    skimFlowLph: Number((flow * 0.88).toFixed(1)),
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
  return {
    detonationVelocityMps: isInitiated ? Math.round(5500 + (ng - 50) * 80) : 0,
    isInitiated,
    blastOverpressureMpa,
    blastOverpressureGpa: Number((blastOverpressureMpa / 1000).toFixed(1)),
    energyMjPerKg: Number(((ng / 100) * 6.3).toFixed(2)),
    // Free NG vs kieselguhr dough: more dry meal → higher drop-hammer margin.
    cushionFactor: Number((1 + (100 - ng) / 8.9).toFixed(1)),
  };
}

export function stepWhitneyCottonGin(params: { crankRpm?: number }) {
  const rpm = params.crankRpm ?? 180;
  const sawRpm = Math.round(rpm * 3.5);
  return {
    sawRpm,
    brushRpm: Math.round(rpm * 12.0),
    outputLbsPerDay: Math.round((rpm / 180) * 50),
    sawTipSpeedMps: Number(((sawRpm * 2 * Math.PI * 0.125) / 60).toFixed(2)),
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
  return {
    groundWheelRpm: Number(groundWheelRpm.toFixed(1)),
    cutterCrankRpm,
    reelRpm: Number((groundWheelRpm * (13 / 12)).toFixed(1)),
    groundSpeedMps: Number((groundSpeedMph * 0.44704).toFixed(2)),
    cutterHz: Number((cutterCrankRpm / 60).toFixed(2)),
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
  return {
    shaftRpm: rpm,
    shaftPowerW,
    armatureCurrentA,
    electricalWatts,
    efficiencyPct: electricalWatts > 0 ? Math.round((shaftPowerW / electricalWatts) * 100) : 0,
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
  return {
    indicatedHp: Math.round(psi * rpm * 0.25 * 1.8 * mepFactor),
    thermalEfficiencyPct: Number((24.5 + (0.25 - cutoff) * 12).toFixed(1)),
    boilerMpa: Number((psi * 0.00689476).toFixed(2)),
    expansionRatio: Number((1 / Math.max(0.05, cutoff)).toFixed(1)),
  };
}

export function stepGatlingGun(params: { crankRpm?: number; barrelCount?: number }) {
  const rpm = params.crankRpm ?? 60;
  const count = params.barrelCount ?? 6;
  const rof = Math.round(rpm * count);
  return {
    roundsPerMin: rof,
    barrelCoolingIntervalS: Number(((60 / Math.max(1, rof)) * count).toFixed(2)),
    muzzleEnergyJoules: 1850,
    cycleTimeMs: Math.round(60000 / Math.max(1, rof)),
  };
}

export function stepHyattCelluloid(params: { steamTempC?: number; hydraulicPressureMpa?: number }) {
  const temp = params.steamTempC ?? 95;
  const press = params.hydraulicPressureMpa ?? 10;
  const isMelted = temp >= 80 && press >= 6;
  return {
    viscosityPaS: Math.round(1800 * Math.exp(-0.03 * (temp - 70))),
    isMelted,
    consolidationDensityGPerCm3: Number((1.2 + (press / 20) * 0.18).toFixed(2)),
    transparencyPct: isMelted ? Math.min(95, Math.round(50 + (temp - 80) * 1.2)) : 10,
    extrusionRateCmPerMin: isMelted ? Number((temp * 0.15).toFixed(1)) : 0,
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
  return {
    logReduction,
    yeastActivityPct: Math.min(100, Math.round(100 * Math.exp(-0.02 * (temp - 24) ** 2))),
    survivorPct: logReduction >= 6 ? 0.0001 : Number((100 * 10 ** -logReduction).toFixed(2)),
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
  };
}

export function stepEdisonPhonograph(params: { mandrelRpm?: number; voiceVolumeDb?: number }) {
  const rpm = params.mandrelRpm ?? 60;
  const vol = params.voiceVolumeDb ?? 75;
  const trackSpeedInPerS = Number(((rpm / 60) * Math.PI * 4.0).toFixed(1));
  const surfaceSpeedMps = Number((trackSpeedInPerS * 0.0254).toFixed(2));
  const leadScrewPitchMm = 2.54;
  return {
    trackSpeedInPerS,
    grooveDepthMicrons: Number(((vol / 75) * 25).toFixed(1)),
    leadScrewPitchMm,
    surfaceSpeedMps,
    audioBandwidthHz: Math.round(surfaceSpeedMps * 4500),
  };
}

export function stepThomsonWelding(params: {
  weldCurrentAmps?: number;
  clampPressureMpa?: number;
}) {
  const i = params.weldCurrentAmps ?? 4500;
  const press = params.clampPressureMpa ?? 35;
  const kw = Math.round((i ** 2 * 0.00018) / 1000);
  const tempC = Math.round(25 + (kw / 3.6) * 850);
  return {
    jouleKw: kw,
    interfaceTempC: tempC,
    isForged: tempC >= 1150 && press >= 25,
    upsetBurrWidthMm: Number(((press / 35) * 3.8).toFixed(1)),
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
  return {
    bmepBar,
    brakeHorsepower,
    differentialCarrierRpm,
    outerWheelRpm: differentialCarrierRpm + speedDeltaRpm,
    innerWheelRpm: differentialCarrierRpm - speedDeltaRpm,
    engineWeightKg,
    specificPowerHpPerKg: Number((brakeHorsepower / engineWeightKg).toFixed(3)),
  };
}

export function stepHollerithTabulating(params: {
  cardsPerMin?: number;
  supplyVoltageV?: number;
  activeRelays?: number;
}) {
  const cpm = Math.max(1, params.cardsPerMin ?? 60);
  const v = Math.max(0.5, params.supplyVoltageV ?? 12);
  const relays = params.activeRelays ?? 16;
  return {
    cycleTimeMs: Math.round(60000 / cpm),
    solenoidForceN: Number(
      (((relays * (v / 12) * 45) ** 2 * 1.256e-6 * 0.0004) / (2 * 0.002 ** 2)).toFixed(2),
    ),
    inductiveTauMs: Number(((0.08 / (v / 2.4)) * 1000).toFixed(1)),
    contactResistanceOhms: 0.08,
    registerDialCount: 40,
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
  return {
    depletionWidthUm: wUm,
    junctionCapPfPerMm2: Number((28 / wUm).toFixed(1)),
    propDelayNs: Number((0.8 + (1 / tox) * 0.2 + vr * 0.02).toFixed(2)),
    breakdownMarginV: Number((35 - vr).toFixed(1)),
  };
}

export function stepEdisonBulb(params: { voltage?: number; filamentLength?: number }) {
  const v = params.voltage ?? 110;
  const len = params.filamentLength ?? 22;
  const tempK = Math.round(1200 + (v / 130) * 1150);
  const resOhm = Math.round(90 + (tempK / 2350) * 60 * (len / 22));
  const powerWatts = Number((v ** 2 / resOhm).toFixed(1));
  return {
    filamentTempK: tempK,
    hotResistanceOhm: resOhm,
    radiantWatts: powerWatts,
    luminousLmPerW: Number(Math.max(0.1, ((tempK - 1400) / 1000) ** 2 * 2.8).toFixed(2)),
    feederResistanceOhm: 0.4,
  };
}

export function stepBellTelephone(params: { voiceAmplitude?: number; airGap?: number }) {
  const db = params.voiceAmplitude ?? 75;
  const gap = Math.max(0.05, params.airGap ?? 0.35);
  const displUm = Number((10 ** ((db - 40) / 30) * 0.45).toFixed(2));
  return {
    diaphragmUm: displUm,
    modulatedMa: Number(((displUm / (gap * 1000)) * 18.5).toFixed(2)),
    sensitivityMvPerPa: Number((18.5 / (gap + 0.1)).toFixed(1)),
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
    unitDurationMs: Math.round(1200 / Math.max(1, wpm)),
  };
}

export function stepEngelbartMouse(params: { mouseSpeed?: number; wheelRadius?: number }) {
  const v = params.mouseSpeed ?? 350;
  const r = params.wheelRadius ?? 10.0;
  return {
    dpi: Math.round((200 * 10) / r),
    omegaRadPerS: Number((v / r).toFixed(1)),
    slewPxPerS: Number((v * 3.8).toFixed(0)),
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
    dielectricLossWattsPerDm3: isOscillating ? Math.round(rf * 1.8) : 0,
  };
}

export function stepKevlarContinuum(
  drawRatio?: number,
  impactVelocityMps?: number,
  appliedTension?: number,
) {
  const draw = drawRatio ?? 6.5;
  const v = impactVelocityMps ?? 450;
  const load = appliedTension ?? 30;
  const elasticModulusGpa = Math.min(145, 60 + draw * 20);
  const sonic = Math.sqrt((elasticModulusGpa * 1e9) / 1440);
  const strainPct = (v / sonic) * 100;
  const tensileStrengthGpa = Number(Math.min(3.6, 0.5 + draw * 0.45).toFixed(2));
  return {
    tensileStressMpa: Math.round((strainPct / 100) * elasticModulusGpa * 1000),
    tensileStrainPct: Number(strainPct.toFixed(2)),
    elasticModulusGpa,
    tensileStrengthGpa,
    sonicVelocityMps: Math.round(sonic),
    alignmentPct: Math.min(100, Math.round((draw / 8.0) * 100)),
    residualStrengthGpa: Number((tensileStrengthGpa * (1 - load / 220)).toFixed(2)),
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
  return {
    wavelengthMeters,
    resonantFreqMhz: Number((300 / wavelengthMeters).toFixed(2)),
    maxRangeMiles: Number((0.015 * h * h * (kv / 20)).toFixed(1)),
    peakRfPowerKw: Number(((kv * kv) / (gap * 1.5)).toFixed(1)),
  };
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
  };
}

export function stepGoodyearRubber(
  vulcanizationTempC?: number,
  sulfurPct?: number,
  durationMin?: number,
) {
  const temp = vulcanizationTempC ?? 145;
  const sulfur = sulfurPct ?? 8;
  const duration = durationMin ?? 30;
  const isOptimalTemp = temp >= 135 && temp <= 165;
  const crossLinkDensity = (sulfur / 8.0) * (duration / 30) * (isOptimalTemp ? 1.0 : 0.4);
  const tensileStrengthPsi = Math.min(3200, Math.round(crossLinkDensity * 2800));
  return {
    crossLinkDensity: Number(crossLinkDensity.toFixed(3)),
    tensileStrengthPsi,
    tensileStrengthMpa: Number((tensileStrengthPsi * 0.00689476).toFixed(2)),
    elasticReturnPct: Math.min(98, Math.round(50 + crossLinkDensity * 45)),
    isStickyOrBrittle: !isOptimalTemp || crossLinkDensity < 0.3,
    glassTransitionTempC: Math.round(-70 + sulfur * 3.8),
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
  return {
    evapTempC: Number(evapTempC.toFixed(1)),
    coolingWatts: Math.round(qIn * cop),
    cop,
    pressureAtm: press,
    partialPressureButaneAtm: Number((press * (1 - nh3)).toFixed(2)),
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
  };
}
