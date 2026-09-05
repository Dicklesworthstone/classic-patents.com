/**
 * Private 3D slider names → registry control ids.
 * 3D files keep reverting to local keys; the bus stores the canonical id
 * and expands the alias on read so both faces stay on one number.
 */

export interface ParamAlias {
  canonical: string;
  toCanonical?: (aliasValue: number) => number;
  fromCanonical?: (canonicalValue: number) => number;
}

const same = (canonical: string): ParamAlias => ({ canonical });

/** Per-patent alias map. Linde remains peer-owned. */
export const PATENT_PARAM_ALIASES: Record<string, Record<string, ParamAlias>> = {
  "us-542846-diesel-engine": {
    compressionRatio: same("compRatio"),
    blastAirPressureBar: same("blastAirPressure"),
  },
  "us-194047-otto-engine": {
    cr: same("compressionRatio"),
    rpm: same("engineRpm"),
  },
  "us-319596-maxim-machine-gun": { fireRateRpm: same("firingRate") },
  "us-124404-westinghouse-air-brake": {
    trainPipePressurePsi: same("trainPipePressure"),
    brakePressurePsi: same("trainPipePressure"),
    brakePipePressure: same("trainPipePressure"),
    pipePressure: same("trainPipePressure"),
    reservoirPipePressurePsi: same("reservoirPipePressure"),
    reservoirPressure: same("reservoirPipePressure"),
    signalPulsePressurePsi: same("signalPulsePressure"),
  },
  "us-347140-thomson-welding": { currentAmperes: same("weldCurrentAmps") },
  "us-105338-hyatt-celluloid": {
    tempCelsius: same("steamTempC"),
    ramPressurePsi: {
      canonical: "hydraulicPressureMpa",
      // PSI → MPa
      toCanonical: (psi) => Number((psi / 145.038).toFixed(4)),
      fromCanonical: (mpa) => Number((mpa * 145.038).toFixed(1)),
    },
  },
  "us-78317-nobel-dynamite": {
    ngConcentration: same("ngConcentrationPct"),
    nitroglycerinRatioPct: same("ngConcentrationPct"),
  },
  "us-135245-pasteur-fermentation": { tempCelsius: same("wortTempC") },
  "us-247804-delaval-separator": {
    feedRateLph: same("rawMilkFlowLph"),
    flow: same("rawMilkFlowLph"),
    milkFlowLph: same("rawMilkFlowLph"),
    feedFlow: same("rawMilkFlowLph"),
    rotorRpm: same("bowlRpm"),
    rpm: same("bowlRpm"),
    speed: same("bowlRpm"),
  },
  "us-682690-hewitt-mercury-lamp": {
    voltage: same("mainsVoltageV"),
    vMains: same("mainsVoltageV"),
    arcVoltage: same("mainsVoltageV"),
    tubeLength: same("tubeLengthCm"),
    length: same("tubeLengthCm"),
    ballast: same("ballastResistanceOhms"),
    ballastOhms: same("ballastResistanceOhms"),
    rBallast: same("ballastResistanceOhms"),
    arcCurrent: same("ballastResistanceOhms"),
  },
  "us-727650-linde-air-liquefaction": {
    pressure: same("inletPressureAtm"),
    inletPressure: same("inletPressureAtm"),
    throttlePressureBar: same("inletPressureAtm"),
    pHigh: same("inletPressureAtm"),
    coolerTempC: same("coolerOutletC"),
    temperature: same("coolerOutletC"),
    tCooler: same("coolerOutletC"),
  },
  "us-200521-edison-phonograph": {
    cylinderRpm: same("mandrelRpm"),
    rpm: same("mandrelRpm"),
    mandrelSpeed: same("mandrelRpm"),
    speed: same("mandrelRpm"),
    clockworkRpm: same("mandrelRpm"),
    voiceVolume: same("voiceVolumeDb"),
    volumeDb: same("voiceVolumeDb"),
    volume: same("voiceVolumeDb"),
    diaphragmExcitation: same("voiceVolumeDb"),
    spl: same("voiceVolumeDb"),
  },
  "us-x8277-mccormick-reaper": {
    groundSpeedMph: same("forwardSpeedMph"),
    draftSpeedMph: same("forwardSpeedMph"),
  },
  "us-2524035-bardeen-transistor": { pointSpacingMicrons: same("pointSpacing") },
  "us-31128-otis-elevator": { cableTensionPct: same("cableTension") },
  "us-586193-marconi-radio": {
    mastHeightM: same("aerialHeight"),
    sparkVoltageKv: same("sparkVoltage"),
  },
  "us-120057-gramme-dynamo": {
    rotorRpm: same("shaftRate"),
    shaftRpm: same("shaftRate"),
    rate: same("shaftRate"),
    shaftRateFactor: same("shaftRate"),
    speed: same("shaftRate"),
  },
  "us-395781-hollerith-tabulating": { tabulatingSpeed: same("cardsPerMin") },
  "us-6162-corliss-steam-engine": {
    boilerPressure: same("steamPressurePsi"),
    boilerPressurePsi: same("steamPressurePsi"),
    cutoff: same("cutoffPct"),
    cutoffPercentage: same("cutoffPct"),
    cutoffRatioPct: same("cutoffPct"),
    pressure: same("steamPressurePsi"),
    rpm: same("engineRpm"),
  },
  "us-79265-sholes-typewriter": { typingWpm: same("typingSpeedWpm") },
  "us-132-davenport-electric-motor": {
    rotorRpm: {
      canonical: "batteryVoltage",
      toCanonical: (rpm) => (rpm / 450) * 12,
      fromCanonical: (volts) => (volts / 12) * 450,
    },
    voltage: same("batteryVoltage"),
    batteryVolts: same("batteryVoltage"),
    v: same("batteryVoltage"),
    torque: same("loadTorque"),
    load: same("loadTorque"),
    torqueNm: same("loadTorque"),
  },
  "us-157124-glidden-barbed-wire": {
    machineRpm: {
      canonical: "twistsPerFoot",
      toCanonical: (rpm) => Math.max(2, Math.min(10, rpm / 24)),
      fromCanonical: (twists) => twists * 24,
    },
    tension: same("wireTensionN"),
    tensionN: same("wireTensionN"),
    lineTensionN: same("wireTensionN"),
    twists: same("twistsPerFoot"),
    twistRate: same("twistsPerFoot"),
    pushForce: same("animalPushForceN"),
    pushForceN: same("animalPushForceN"),
    push: same("animalPushForceN"),
  },
  "us-621195-zeppelin-airship": {
    airspeedMph: {
      canonical: "flightSpeedKnots",
      toCanonical: (mph) => mph * 0.868976,
      fromCanonical: (kn) => kn * 1.15078,
    },
  },
  "us-470918-reno-escalator": {
    speedFpm: {
      canonical: "beltSpeed",
      toCanonical: (fpm) => (fpm * 0.3048) / 60,
      fromCanonical: (mps) => (mps * 60) / 0.3048,
    },
  },
  "us-388850-eastman-kodak": {
    shutterSpeed: {
      canonical: "shutterSpeed",
      toCanonical: (v) => (v > 1 ? 1 / v : v),
    },
    subjectDistance: same("subjectDist"),
  },
  "us-313224-mergenthaler-linotype": {
    castingLpm: {
      canonical: "matrixRate",
      toCanonical: (lpm) => lpm * 42,
      fromCanonical: (cpm) => cpm / 42,
    },
  },
  "us-328710-parsons-turbine": {
    steamPressureBar: {
      canonical: "inletPressurePsi",
      toCanonical: (bar) => bar * 14.5038,
      fromCanonical: (psi) => psi / 14.5038,
    },
    rpm: same("rotorRpm"),
    turbineRpm: same("rotorRpm"),
    pressure: same("inletPressurePsi"),
  },
  "us-971501-haber-ammonia": {
    synthesisPressureBar: {
      canonical: "pressureAtm",
      toCanonical: (bar) => bar / 1.01325,
      fromCanonical: (atm) => atm * 1.01325,
    },
    pressure: same("pressureAtm"),
    synthesisTempC: same("temperatureCelsius"),
    temp: same("temperatureCelsius"),
    temperature: same("temperatureCelsius"),
    feedFlow: same("feedFlowRateMolesPerSec"),
    activity: same("catalystActivity"),
  },
  "us-608969-parsons-turbine": {
    steamPressureBar: {
      canonical: "inletPressurePsi",
      toCanonical: (bar) => bar * 14.5038,
      fromCanonical: (psi) => psi / 14.5038,
    },
  },
  "us-3923554-boyle-smith-ccd": { clockSpeedFactor: same("clockStepRateHz") },
  "us-3858232-boyle-smith-ccd": { clockSpeedFactor: same("clockStepRateHz") },
  "us-1781541-einstein-refrigerator": { auxiliaryGasRatio: same("ammoniaRatio") },
  "us-808897-carrier-air-conditioner": {
    airflow: same("airflowCfm"),
    airFlowCfm: same("airflowCfm"),
    sprayRate: same("sprayRatePct"),
    plateFaces: same("separatorFaces"),
  },
  "us-2708656-fermi-reactor": { controlRodWithdrawalPct: same("rodWithdrawal") },
  "us-6469-lincoln-buoy": {
    bellowsInflationPct: same("inflationPct"),
    inflation: same("inflationPct"),
    expansionPct: same("inflationPct"),
    steamboatWeightTons: same("weightTons"),
    weight: same("weightTons"),
    riverShoalDepthFt: same("shoalDepth"),
    depth: same("shoalDepth"),
    depthFt: same("shoalDepth"),
  },
  "us-4750-howe-sewing-machine": {
    rpm: same("crankRpm"),
    speed: same("crankRpm"),
    sewingSpeedRpm: same("crankRpm"),
    stitchingSpeedRpm: same("crankRpm"),
    pitch: same("stitchPitchMm"),
    feedPitch: same("stitchPitchMm"),
    slack: same("loopSlackPct"),
    slackPct: same("loopSlackPct"),
  },
  "us-706737-fessenden-wireless": {
    carrierFreqKhz: same("carrierFrequencyKhz"),
    carrierFreq: same("carrierFrequencyKhz"),
    frequencyKhz: same("carrierFrequencyKhz"),
    frequency: same("carrierFrequencyKhz"),
    modDepthPct: same("audioModulationPct"),
    modulationPct: same("audioModulationPct"),
    modulation: same("audioModulationPct"),
    modDepth: same("audioModulationPct"),
    tuningUh: same("antennaTuningUh"),
    inductanceUh: same("antennaTuningUh"),
    antennaInductanceUh: same("antennaTuningUh"),
    tuningCoilUh: same("antennaTuningUh"),
    distanceKm: same("transmissionDistanceKm"),
    distance: same("transmissionDistanceKm"),
    rangeKm: same("transmissionDistanceKm"),
  },
  "us-2297691-carlson-electrophotography": {
    exposure: same("exposureLuxSec"),
    thickness: same("layerThicknessUm"),
    temperature: same("fuserTemperatureC"),
  },
  "us-588-ericsson-propeller": { pitchAngleDeg: same("bladePitchAngleDeg") },
  "us-593138-tesla-coil": {
    frequency: same("disturbanceFrequencyHz"),
    frequencyHz: same("disturbanceFrequencyHz"),
    freq: same("disturbanceFrequencyHz"),
    freqHz: same("disturbanceFrequencyHz"),
    secondaryLength: same("secondaryLengthMiles"),
    secondaryLengthMi: same("secondaryLengthMiles"),
    lengthMiles: same("secondaryLengthMiles"),
    wireLength: same("secondaryLengthMiles"),
    wireLengthMiles: same("secondaryLengthMiles"),
  },
  "us-36836-gatling-gun": {
    rpm: same("crankRpm"),
    speed: same("crankRpm"),
    crankSpeed: same("crankRpm"),
    handCrankRpm: same("crankRpm"),
    barrels: same("barrelCount"),
    numBarrels: same("barrelCount"),
    count: same("barrelCount"),
  },
  "us-613809-tesla-teleautomaton": {
    rudderAngleDeg: same("rudderAngle"),
    rudder: same("rudderAngle"),
    rudderDeg: same("rudderAngle"),
    transmitterFreqKhz: same("rfFrequency"),
    carrierFreqKhz: same("rfFrequency"),
    freq: same("rfFrequency"),
    frequency: same("rfFrequency"),
    throttle: same("propellerThrottlePct"),
    throttlePct: same("propellerThrottlePct"),
    motorThrottle: same("propellerThrottlePct"),
    propellerThrottle: same("propellerThrottlePct"),
    pulses: same("pulseCount"),
  },
  "us-1647-morse-telegraph": {
    lineVoltage: same("lineVoltageV"),
    voltage: same("lineVoltageV"),
    current: same("currentMa"),
    lineCurrentMa: same("currentMa"),
    lineResistance: same("lineLengthMiles"),
    lineDistance: same("lineLengthMiles"),
    distanceMiles: same("lineLengthMiles"),
    wpm: same("wpmSpeed"),
    speed: same("wpmSpeed"),
    turns: same("wireTurns"),
  },
  "us-1773980-farnsworth-tv": {
    anodeKv: {
      canonical: "anodeVoltage",
      toCanonical: (kv) => kv * 1000,
      fromCanonical: (v) => v / 1000,
    },
    deflectionCoilCurrent: same("coilCurrent"),
    lightIntensity: same("lightIntensityLux"),
    lux: same("lightIntensityLux"),
  },
  "us-879532-de-forest-audion": {
    gridVoltage: same("gridBiasVoltageV"),
    gridVoltageV: same("gridBiasVoltageV"),
    gridBiasV: same("gridBiasVoltageV"),
    plateVoltage: same("plateVoltageV"),
    filamentCurrent: same("filamentCurrentA"),
    rfInputMv: same("gridSignalAmplitudeMv"),
    rfInput: same("gridSignalAmplitudeMv"),
    loadResistance: same("loadResistanceKOhms"),
    loadResistanceKohm: same("loadResistanceKOhms"),
  },
};

export function canonicalizeParam(
  patentId: string,
  paramId: string,
  value: number,
): { id: string; value: number } {
  const spec = PATENT_PARAM_ALIASES[patentId]?.[paramId];
  if (!spec) return { id: paramId, value };
  return {
    id: spec.canonical,
    value: spec.toCanonical ? spec.toCanonical(value) : value,
  };
}

export function expandParamAliases(
  patentId: string,
  params: Record<string, number>,
): Record<string, number> {
  const aliases = PATENT_PARAM_ALIASES[patentId];
  if (!aliases) return params;
  const out = { ...params };
  for (const [alias, spec] of Object.entries(aliases)) {
    const canon = out[spec.canonical];
    if (typeof canon === "number") {
      out[alias] = spec.fromCanonical ? spec.fromCanonical(canon) : canon;
    }
  }
  return out;
}
