/**
 * src/physics/rillieuxEvaporatorKernel.ts
 *
 * Audited SI chemical thermodynamics kernel for Norbert Rillieux's
 * Multiple-Effect Vacuum Evaporation Process (US 3,237, 1843).
 *
 * Simulates:
 * 1. Cane juice mass balance & dissolved sugar Brix concentration
 * 2. Cascading saturation pressures, boiling point elevation (BPE), and inter-effect temperature drops
 * 3. Latent heat transfer across submerged horizontal tube bundles Q = U * A * dT
 * 4. Multi-effect steam economy ratio S = m_evap / m_steam
 * 5. Fuel consumption savings vs open-kettle 'Jamaica train' boiling
 */

export interface RillieuxEvaporatorInput {
  /** Raw juice feed rate in kg/hour (2,000 to 30,000 kg/h) */
  juiceFeedRateKgPerH?: number;
  /** Initial dissolved solids in raw cane juice in degrees Brix (10 to 20 °Bx) */
  initialBrixDeg?: number;
  /** Target final syrup concentration in degrees Brix (50 to 75 °Bx) */
  targetBrixDeg?: number;
  /** Number of evaporating effects in series (2 = double effect, 3 = triple effect, 4 = quadruple effect) */
  numberOfEffects?: number;
  /** Primary steam supply pressure to Effect 1 in kPa absolute (110 to 250 kPa) */
  steamSupplyPressureKPa?: number;
  /** Final effect condenser vacuum in kPa absolute (10 to 30 kPa) */
  condenserPressureKPa?: number;
}

export interface RillieuxEffectState {
  effectNumber: number;
  operatingPressureKPa: number;
  boilingTemperatureC: number;
  bpeDegC: number;
  juiceBrixDeg: number;
  evaporatedWaterKgPerH: number;
  heatTransferKw: number;
}

export interface RillieuxEvaporatorState {
  /** Raw juice feed rate (kg/h) */
  juiceFeedRateKgPerH: number;
  /** Concentrated syrup output rate (kg/h) */
  syrupOutputRateKgPerH: number;
  /** Total water evaporated across all effects (kg/h) */
  totalEvaporationKgPerH: number;
  /** Primary steam consumption rate from boiler / engine exhaust (kg/h) */
  primarySteamConsumptionKgPerH: number;
  /** Steam Economy: kg water evaporated per kg live steam (kg/kg) */
  steamEconomyRatio: number;
  /** Overall thermal efficiency (%) */
  thermalEfficiencyPct: number;
  /** Percentage fuel saved compared to single-stage open kettle boiling (%) */
  fuelSavingsPct: number;
  /** Per-effect state array */
  effects: RillieuxEffectState[];
  /** Tube-bundle boil display ω; leftover 8 rad/s at ~8000 kg/h total evaporation */
  boilDisplayOmegaRadPerS: number;
}

export function stepRillieuxEvaporator(
  input: RillieuxEvaporatorInput = {},
): RillieuxEvaporatorState {
  const {
    juiceFeedRateKgPerH = 10000,
    initialBrixDeg = 14.0,
    targetBrixDeg = 65.0,
    numberOfEffects = 3,
    steamSupplyPressureKPa = 160.0, // ~1.6 bar (113°C)
    condenserPressureKPa = 16.0, // ~0.16 bar (55°C)
  } = input;

  const N = Math.max(2, Math.min(4, Math.round(numberOfEffects)));

  // 1. Overall Mass Balance
  const solidsMassRate = juiceFeedRateKgPerH * (initialBrixDeg / 100);
  const syrupOutputRateKgPerH = solidsMassRate / (targetBrixDeg / 100);
  const totalEvaporationKgPerH = juiceFeedRateKgPerH - syrupOutputRateKgPerH;

  // Approximate saturation temperature from pressure: Antoine equation for water
  const getSatTempC = (p_kPa: number) => {
    const p_mmHg = p_kPa * 7.50062;
    // Antoine: log10(P) = A - B / (C + T) -> T = B / (A - log10(P)) - C
    const A = 8.07131;
    const B = 1730.63;
    const C = 233.426;
    return B / (A - Math.log10(p_mmHg)) - C;
  };

  const steamTempC = getSatTempC(steamSupplyPressureKPa);
  const condTempC = getSatTempC(condenserPressureKPa);

  // 2. Multi-Effect Temperature and Brix Distribution
  const effects: RillieuxEffectState[] = [];
  const totalAvailableTempDrop = Math.max(15, steamTempC - condTempC);
  const baseTempDropPerEffect = totalAvailableTempDrop / N;

  let currentJuiceBrix = initialBrixDeg;
  const brixStep = (targetBrixDeg - initialBrixDeg) / N;
  const evapPerEffect = totalEvaporationKgPerH / N;

  for (let i = 1; i <= N; i++) {
    currentJuiceBrix += brixStep;
    // Boiling Point Elevation (BPE): empirical correlation for sucrose solution
    const bpe = 0.07 * currentJuiceBrix + 0.0022 * currentJuiceBrix ** 2;
    const effectVaporTempC = steamTempC - i * baseTempDropPerEffect;
    const boilingTempC = effectVaporTempC + bpe;

    // Saturation pressure of vapor space
    const p_approx = Math.max(
      12,
      condenserPressureKPa +
        (steamSupplyPressureKPa - condenserPressureKPa) * ((N - i + 0.5) / N) ** 1.4,
    );

    // Latent heat of vaporization ~ 2260 kJ/kg
    const latentHeatKjPerKg = 2501 - 2.37 * boilingTempC;
    const heatTransferKw = (evapPerEffect * latentHeatKjPerKg) / 3600;

    effects.push({
      effectNumber: i,
      operatingPressureKPa: p_approx,
      boilingTemperatureC: boilingTempC,
      bpeDegC: bpe,
      juiceBrixDeg: currentJuiceBrix,
      evaporatedWaterKgPerH: evapPerEffect,
      heatTransferKw,
    });
  }

  // 3. Steam Economy and Primary Steam Consumption
  // Rillieux rule of thumb: 1 lb steam in an N-effect evaporator evaporates ~0.85 * N lbs of water
  const thermalEfficiencyFactor = 0.92 - (N - 2) * 0.03; // Accounting for radiation and venting losses
  const steamEconomyRatio = N * thermalEfficiencyFactor;
  const primarySteamConsumptionKgPerH = totalEvaporationKgPerH / steamEconomyRatio;

  // Single-stage open boiling requires ~1.25 kg steam per kg water evaporated (Economy ≈ 0.80)
  const singleStageSteamKgPerH = totalEvaporationKgPerH / 0.8;
  const fuelSavingsPct = Math.min(
    85.0,
    ((singleStageSteamKgPerH - primarySteamConsumptionKgPerH) / singleStageSteamKgPerH) * 100,
  );

  const thermalEfficiencyPct = (steamEconomyRatio / N) * 100;
  const boilDisplayOmegaRadPerS = Number(Math.max(0.5, totalEvaporationKgPerH / 1000).toFixed(3));

  return {
    juiceFeedRateKgPerH,
    syrupOutputRateKgPerH,
    totalEvaporationKgPerH,
    primarySteamConsumptionKgPerH,
    steamEconomyRatio,
    thermalEfficiencyPct,
    fuelSavingsPct,
    effects,
    boilDisplayOmegaRadPerS,
  };
}
