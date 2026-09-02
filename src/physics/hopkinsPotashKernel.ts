/**
 * Physics Kernel for US Patent No. 1 (X1) — Samuel Hopkins (1790)
 * Making Pot and Pearl Ashes by a New Apparatus and Process
 *
 * Governs:
 * 1. High-temperature ash calcination kinetics (Arrhenius organic oxidation).
 * 2. Counter-current aqueous lixiviation and dissolution equilibrium (K₂CO₃).
 * 3. Evaporative crystallization of pearl ash salts.
 * 4. High-temperature pot-ash fluxing and fusion enthalpy.
 */

export interface HopkinsPotashControls {
  roastTempC?: number; // Roasting furnace temperature (500 to 950 °C)
  roastTimeHours?: number; // Roasting residence time (0.5 to 6.0 hours)
  ashBatchKg?: number; // Mass of raw hardwood ashes (50 to 500 kg)
  waterVolumeLiters?: number; // Volume of leaching water (100 to 1000 L)
  waterTempC?: number; // Leaching water temperature (20 to 100 °C)
}

export interface HopkinsPotashOutputs {
  roastTempKelvin: number;
  decarbonizationPct: number; // Percentage of organic carbon oxidized
  residualCarbonPct: number; // Remaining unoxidized soot/tar
  dissolvedK2co3Kg: number; // Total potassium carbonate extracted into ley
  leyConcentrationGpl: number; // Ley concentration in grams per liter (g/L)
  leyDensityKgM3: number; // Solution density (kg/m³)
  pearlAshYieldKg: number; // Crystalline pearl ash produced
  pearlAshPurityPct: number; // Chemical purity of K₂CO₃ (%)
  potashFusedVolumeLiters: number; // Cast fused potash volume
  thermalEnergyJoules: number; // Total calcination and boiling energy
  extractionEfficiencyPct: number; // Leaching extraction yield vs theoretical max
  flameDisplayOmegaRadPerS: number;
  flameHarmonicOmegaRadPerS: number;
  boilDisplayOmegaRadPerS: number;
}

export const HOPKINS_DEFAULT_CONTROLS: Required<HopkinsPotashControls> = {
  roastTempC: 750,
  roastTimeHours: 2.5,
  ashBatchKg: 200,
  waterVolumeLiters: 400,
  waterTempC: 80,
};

/**
 * Step the thermochemical calcination, leaching, and crystallization cycle for Hopkins Potash.
 */
export function stepHopkinsPotash(controls: HopkinsPotashControls = {}): HopkinsPotashOutputs {
  const roastTempC = Math.max(
    400,
    Math.min(1000, controls.roastTempC ?? HOPKINS_DEFAULT_CONTROLS.roastTempC),
  );
  const roastTimeHours = Math.max(
    0.2,
    Math.min(8.0, controls.roastTimeHours ?? HOPKINS_DEFAULT_CONTROLS.roastTimeHours),
  );
  const ashBatchKg = Math.max(
    10,
    Math.min(1000, controls.ashBatchKg ?? HOPKINS_DEFAULT_CONTROLS.ashBatchKg),
  );
  const waterVolumeLiters = Math.max(
    50,
    Math.min(2000, controls.waterVolumeLiters ?? HOPKINS_DEFAULT_CONTROLS.waterVolumeLiters),
  );
  const waterTempC = Math.max(
    10,
    Math.min(100, controls.waterTempC ?? HOPKINS_DEFAULT_CONTROLS.waterTempC),
  );

  const T_roastK = roastTempC + 273.15;

  // 1. Raw hardwood ash baseline composition:
  // Typical American hardwood (oak/maple/beech) ashes contain ~12% K₂CO₃, 25% organic carbon/tar, 63% inert oxides/carbonates (CaO, SiO₂).
  const theoreticalK2co3Kg = ashBatchKg * 0.125;

  // 2. Arrhenius decarbonization kinetics:
  // k_ox = A * exp(-E_a / (R * T)), with activation energy ~ 65 kJ/mol for wood char oxidation
  const R_GAS = 8.314; // J/(mol*K)
  const E_A = 62000; // J/mol
  const A_PRE = 2000; // 1/hr
  const k_ox = A_PRE * Math.exp(-E_A / (R_GAS * T_roastK));
  const decarbonizationFraction = 1 - Math.exp(-k_ox * roastTimeHours);
  const decarbonizationPct = Math.min(99.8, Math.max(10, decarbonizationFraction * 100));
  const residualCarbonPct = Math.max(0.2, 100 - decarbonizationPct);

  // 3. Aqueous Lixiviation (Leaching) & Solubility Equilibrium:
  // K₂CO₃ solubility in water: C_sat(T) = 1120 + 4.4 * T_c (g/L)
  const cSatGpl = 1120 + 4.4 * waterTempC;
  const maxDissolvableKg = (cSatGpl * waterVolumeLiters) / 1000;

  // Leaching efficiency is strongly enhanced when carbon is removed (pores unclogged):
  const carbonPoreFactor = 0.45 + 0.55 * (decarbonizationPct / 100);
  const tempLeachFactor = 0.65 + 0.35 * (waterTempC / 100);
  const extractionEfficiency = Math.min(0.96, carbonPoreFactor * tempLeachFactor);
  const extractionEfficiencyPct = Number((extractionEfficiency * 100).toFixed(1));

  const extractedK2co3Kg = Math.min(maxDissolvableKg, theoreticalK2co3Kg * extractionEfficiency);
  const dissolvedK2co3Kg = Number(extractedK2co3Kg.toFixed(2));

  // Ley concentration and density
  const leyConcentrationGpl = Number(((dissolvedK2co3Kg * 1000) / waterVolumeLiters).toFixed(1));
  const leyDensityKgM3 = Number((1000 + 0.78 * leyConcentrationGpl).toFixed(1));

  // 4. Pearl Ash Crystallization & Purity:
  // Calcined ash produces exceptionally white, crystalline pearl ash with purity proportional to decarbonization
  const pearlAshYieldKg = Number((dissolvedK2co3Kg * 0.98).toFixed(2));
  const pearlAshPurityPct = Number((82 + 0.16 * decarbonizationPct).toFixed(1));

  // 5. Fluxing to Dense Cast Potash:
  // Pure fused K₂CO₃ density = 2430 kg/m³
  const potashFusedVolumeLiters = Number(((pearlAshYieldKg / 2.43) * 0.95).toFixed(2));

  // 6. Energy balance:
  // Roasting heat: m * Cp * ΔT + carbon combustion enthalpy (-393 kJ/mol C)
  // Boiling heat: m_water * Lv (2.26 MJ/kg)
  const cP_ash = 840; // J/(kg*K)
  const q_roastSensible = ashBatchKg * cP_ash * (roastTempC - 20);
  const lv_water = 2.26e6; // J/kg
  const q_evap = waterVolumeLiters * 1.0 * lv_water;
  const thermalEnergyJoules = Math.round(q_roastSensible + q_evap);
  const flameDisplayOmegaRadPerS = Number(((roastTempC / 750) * 12).toFixed(3));
  const flameHarmonicOmegaRadPerS = Number(((roastTempC / 750) * 24).toFixed(3));
  const boilDisplayOmegaRadPerS = Number(((waterTempC / 100) * 8).toFixed(3));

  return {
    roastTempKelvin: Number(T_roastK.toFixed(1)),
    decarbonizationPct: Number(decarbonizationPct.toFixed(1)),
    residualCarbonPct: Number(residualCarbonPct.toFixed(1)),
    dissolvedK2co3Kg,
    leyConcentrationGpl,
    leyDensityKgM3,
    pearlAshYieldKg,
    pearlAshPurityPct,
    potashFusedVolumeLiters,
    thermalEnergyJoules,
    extractionEfficiencyPct,
    flameDisplayOmegaRadPerS,
    flameHarmonicOmegaRadPerS,
    boilDisplayOmegaRadPerS,
  };
}
