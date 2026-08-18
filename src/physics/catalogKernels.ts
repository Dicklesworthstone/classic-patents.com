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
