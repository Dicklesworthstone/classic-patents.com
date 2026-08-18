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
  return {
    emfVolts,
    powerWatts: Math.round(emfVolts ** 2 / 12),
  };
}

export function stepOttoEngine(params: { engineRpm?: number; compressionRatio?: number }) {
  const rpm = params.engineRpm ?? 180;
  const cr = params.compressionRatio ?? 4.5;
  return {
    brakeHorsepower: Number(((rpm / 180) * (3.0 * (cr / 4.5) ** 0.5)).toFixed(1)),
    thermalEfficiencyPct: Math.round((1 - 1 / cr ** 0.4) * 100),
  };
}

export function stepParsonsTurbine(params: { rotorRpm?: number; inletPressurePsi?: number }) {
  const rpm = params.rotorRpm ?? 3000;
  const psi = params.inletPressurePsi ?? 180;
  const enthalpyKjKg = Math.round(550 * (psi / 180));
  return {
    enthalpyKjKg,
    shaftPowerKw: Math.round(28 * enthalpyKjKg * 0.84 * (rpm / 3000)),
    inletMpa: Number((psi * 0.00689476).toFixed(2)),
  };
}

export function stepEricssonPropeller(params: { shaftRpm?: number; bladePitchAngleDeg?: number }) {
  const rpm = params.shaftRpm ?? 120;
  const pitchDeg = params.bladePitchAngleDeg ?? 35;
  const pitchFactor = Math.tan((pitchDeg * Math.PI) / 180) / Math.tan((35 * Math.PI) / 180);
  return {
    shipSpeedKnots: Number(((rpm / 120) * 8.5 * pitchFactor).toFixed(1)),
    thrustKn: Math.round((rpm / 120) ** 2 * 18 * pitchFactor),
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
  };
}

export function stepNobelDynamite(params: {
  ngConcentrationPct?: number;
  capEnergyJoules?: number;
}) {
  const ng = params.ngConcentrationPct ?? 75;
  const cap = params.capEnergyJoules ?? 1.2;
  const isInitiated = cap >= 0.4;
  return {
    detonationVelocityMps: isInitiated ? Math.round(5500 + (ng - 50) * 80) : 0,
    isInitiated,
  };
}

export function stepWhitneyCottonGin(params: { crankRpm?: number }) {
  const rpm = params.crankRpm ?? 180;
  return {
    sawRpm: Math.round(rpm * 3.5),
    brushRpm: Math.round(rpm * 12.0),
    outputLbsPerDay: Math.round((rpm / 180) * 50),
  };
}

export function stepMcCormickReaper(params: { forwardSpeedMph?: number }) {
  const v = params.forwardSpeedMph ?? 2.5;
  return {
    cutFrequencyHz: Math.round((v * 5280 * 12) / (3600 * 3.5)),
    reelRpm: Math.round(v * 12.5),
    harvestAcresPerDay: Number((v * 1.8).toFixed(1)),
  };
}

export function stepDavenportMotor(params: { batteryVoltage?: number; loadTorque?: number }) {
  const v = params.batteryVoltage ?? 12;
  const load = params.loadTorque ?? 0.8;
  const rpm = Math.round((v / 12) * (450 / Math.max(0.5, load)));
  return {
    shaftRpm: rpm,
    shaftPowerW: Math.round(((rpm * 2 * Math.PI) / 60) * load),
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
  };
}

export function stepGatlingGun(params: { crankRpm?: number; barrelCount?: number }) {
  const rpm = params.crankRpm ?? 60;
  const count = params.barrelCount ?? 6;
  const rof = Math.round(rpm * count);
  return {
    roundsPerMin: rof,
    barrelCoolingIntervalS: Number(((60 / Math.max(1, rof)) * count).toFixed(2)),
  };
}

export function stepHyattCelluloid(params: { steamTempC?: number; hydraulicPressureMpa?: number }) {
  const temp = params.steamTempC ?? 95;
  const press = params.hydraulicPressureMpa ?? 10;
  return {
    viscosityPaS: Math.round(1800 * Math.exp(-0.03 * (temp - 70))),
    isMelted: temp >= 80 && press >= 6,
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
  return {
    logReduction: Number(
      Math.max(0, Math.min(8.0, (hold / 20) * ((pTemp - 45) / 10) * 4.5)).toFixed(1),
    ),
    yeastActivityPct: Math.min(100, Math.round(100 * Math.exp(-0.02 * (temp - 24) ** 2))),
  };
}

export function stepGliddenBarbedWire(params: {
  wireTensionN?: number;
  twistsPerFoot?: number;
  animalPushForceN?: number;
}) {
  const t = params.wireTensionN ?? 650;
  const twists = params.twistsPerFoot ?? 5;
  const push = params.animalPushForceN ?? 120;
  const barbSlipThresholdN = twists * 95;
  return {
    sagCm: Number((2800 / Math.max(100, t)).toFixed(1)),
    barbSlipThresholdN,
    isLocked: barbSlipThresholdN >= push,
  };
}

export function stepEdisonPhonograph(params: { mandrelRpm?: number; voiceVolumeDb?: number }) {
  const rpm = params.mandrelRpm ?? 60;
  const vol = params.voiceVolumeDb ?? 75;
  return {
    trackSpeedInPerS: Number(((rpm / 60) * Math.PI * 4.0).toFixed(1)),
    grooveDepthMicrons: Number(((vol / 75) * 25).toFixed(1)),
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
  return {
    bmepBar,
    brakeHorsepower,
    differentialCarrierRpm,
    outerWheelRpm: differentialCarrierRpm + speedDeltaRpm,
    innerWheelRpm: differentialCarrierRpm - speedDeltaRpm,
  };
}

export function stepHollerithTabulating(params: {
  cardsPerMin?: number;
  supplyVoltageV?: number;
  activeRelays?: number;
}) {
  const cpm = Math.max(1, params.cardsPerMin ?? 60);
  const v = Math.max(0.5, params.supplyVoltageV ?? 12);
  const relays = params.activeRelays ?? 8;
  return {
    cycleTimeMs: Math.round(60000 / cpm),
    solenoidForceN: Number(
      (((relays * (v / 12) * 45) ** 2 * 1.256e-6 * 0.0004) / (2 * 0.002 ** 2)).toFixed(2),
    ),
    inductiveTauMs: Number(((0.08 / (v / 2.4)) * 1000).toFixed(1)),
    contactResistanceOhms: 0.08,
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

export function stepMorseTelegraph(params: { currentMa?: number; wireTurns?: number }) {
  const i = (params.currentMa ?? 65) / 1000;
  const n = params.wireTurns ?? 1200;
  const forceN = Number(((4e-7 * Math.PI * (n * i) ** 2 * 0.0004) / (2 * 0.0015 ** 2)).toFixed(2));
  return {
    magneticForceN: forceN,
    timeConstantMs: Number((n * 0.00012 * 10).toFixed(1)),
    ampereTurns: Math.round(n * i),
    stylusKpa: Number((forceN * 28).toFixed(0)),
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
  };
}

export function stepSpencerMicrowave(anodeKv?: number, magneticGauss?: number, rfWatts?: number) {
  const kv = anodeKv ?? 2.2;
  const b = magneticGauss ?? 1400;
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

export function stepKevlarContinuum(drawRatio?: number, impactVelocityMps?: number) {
  const draw = drawRatio ?? 6.5;
  const v = impactVelocityMps ?? 200;
  const elasticModulusGpa = Math.min(145, 60 + draw * 20);
  const sonic = Math.sqrt((elasticModulusGpa * 1e9) / 1440);
  const strainPct = (v / sonic) * 100;
  return {
    tensileStressMpa: Math.round((strainPct / 100) * elasticModulusGpa * 1000),
    tensileStrainPct: Number(strainPct.toFixed(2)),
    elasticModulusGpa,
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
  const transportFactor = Math.max(0.1, 1 - transitTimeNs / 150);
  const currentGainAlpha = Number((0.95 * transportFactor * 1.8).toFixed(2));
  return {
    currentGainAlpha,
    holeDiffusionCoefficientCm2ps: Number(holeDiffusionCoefficient.toFixed(1)),
    transitTimeNs: Number(transitTimeNs.toFixed(2)),
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
  return {
    hoopStressMpa: Number(((pMpa * 4.5) / 3.8).toFixed(1)),
    indexAngleDeg: Number(((cockDeg / 45) * 72).toFixed(1)),
    isLocked: cockDeg >= 44,
    muzzleVelocityMps: Math.round(180 + Math.sqrt(pMpa) * 13.5),
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
  return {
    crossLinkDensity: Number(crossLinkDensity.toFixed(3)),
    tensileStrengthPsi: Math.min(3200, Math.round(crossLinkDensity * 2800)),
    elasticReturnPct: Math.min(98, Math.round(50 + crossLinkDensity * 45)),
    isStickyOrBrittle: !isOptimalTemp || crossLinkDensity < 0.3,
  };
}

export function stepEinsteinRefrigerator(params: { heatInput?: number; totalPressure?: number }) {
  const qIn = params.heatInput ?? 220;
  const press = params.totalPressure ?? 15.0;
  const evapTempC = -25 + (press - 10) * 1.4;
  const cop = Number((0.32 * (1 - Math.abs(evapTempC) / 120)).toFixed(2));
  return {
    evapTempC: Number(evapTempC.toFixed(1)),
    coolingWatts: Math.round(qIn * cop),
    cop,
    pressureAtm: press,
  };
}

export function stepLincolnBuoy(params: {
  inflationPct?: number;
  weightTons?: number;
  shoalDepth?: number;
}) {
  const infl = params.inflationPct ?? 75;
  const depth = params.shoalDepth ?? 3.5;
  const volM3 = Number(((infl / 100) * 42.5).toFixed(1));
  const liftKn = Math.round(volM3 * 9.81);
  const draftRedFt = Number((volM3 * 0.055).toFixed(2));
  const hullDraftFt = 5.0 - draftRedFt;
  return {
    displacedVolumeM3: volM3,
    liftKn,
    draftReductionFt: draftRedFt,
    shoalClearanceFt: Number((depth - hullDraftFt).toFixed(2)),
  };
}
