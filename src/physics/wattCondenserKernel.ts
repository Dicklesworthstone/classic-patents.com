/**
 * Physics Kernel for British Patent No. 913 (1769) — James Watt
 * A New Invented Method of Lessening the Consumption of Steam and Fuel in Fire Engines
 *
 * Models authentic SI thermodynamics and mechanics:
 * 1. Rankine / Modified Watt thermodynamic power cycle vs Newcomen atmospheric cycle.
 * 2. Condenser saturation pressure and vacuum depth via Clausius-Clapeyron relation.
 * 3. In-cylinder cyclic thermal quench penalty (Newcomen) vs isothermal steam jacket heat retention (Watt Principle 1).
 * 4. Separate condenser heat rejection and air pump evacuation work (Watt Principles 2 & 3).
 * 5. Indicated mean effective pressure (IMEP), indicated power, and mine water pumping duty.
 * 6. Specific fuel consumption (SFC, kg coal / kWh) and coal economy comparison.
 */

export interface WattCondenserControls {
  boilerPressurePsi?: number; // Boiler steam pressure above atmospheric (0.5 to 10.0 psi, default: 3.0)
  condenserTempC?: number; // Cold water cistern / condenser temperature (10 to 60 °C, default: 35)
  cylinderBoreInches?: number; // Cylinder inner bore diameter (20 to 72 inches, default: 38)
  pistonStrokeFeet?: number; // Working stroke length (4 to 10 feet, default: 6)
  strokesPerMinute?: number; // Engine stroke cadence (6 to 24 strokes/min, default: 14)
  hasSteamJacket?: boolean; // Principle 1: Concentric steam jacket active (default: true)
  hasSeparateCondenser?: boolean; // Principle 2: Separate condenser vessel active (default: true)
}

export interface WattCondenserOutputs {
  // Thermodynamic Pressures (kPa & psi)
  boilerPressureAbsKpa: number;
  condenserPressureAbsKpa: number;
  vacuumDepthInchesHg: number;
  imepPsi: number;
  imepKpa: number;

  // Temperatures (Celsius & Kelvin)
  steamTempC: number;
  cylinderWallTempC: number;
  condenserTempC: number;

  // Power & Mechanics (SI)
  displacedVolumeM3: number;
  pistonAreaM2: number;
  pistonPistonForceKn: number;
  indicatedPowerKw: number;
  indicatedHorsepower: number;

  // Thermal & Fuel Economy
  heatInputRateKw: number;
  thermalEfficiencyPct: number;
  coalConsumptionKgPerHour: number;
  specificFuelConsumptionKgPerKwh: number;
  newcomenFuelMultiplier: number; // Ratio of coal needed by a Newcomen engine for same work
  coalSavedTonsPerYear: number;

  // Mine Pumping Performance (100 fathom / 183 m lift)
  waterPumpedM3PerHour: number;
  waterPumpedGallonsPerHour: number;

  // Air Pump Work
  airPumpPowerKw: number;

  // Cycle kinematics (shared by 2D / 3D — do not recompute spm/60 on the faces)
  frequencyHz: number;
  cycleOmegaRadPerS: number;
}

export const WATT_DEFAULT_CONTROLS: Required<WattCondenserControls> = {
  boilerPressurePsi: 3.0,
  condenserTempC: 35.0,
  cylinderBoreInches: 38.0,
  pistonStrokeFeet: 6.0,
  strokesPerMinute: 14.0,
  hasSteamJacket: true,
  hasSeparateCondenser: true,
};

const ATMOSPHERIC_PRESSURE_KPA = 101.325;
const COAL_LOWER_HEATING_VALUE_J_PER_KG = 29.3e6; // 29.3 MJ/kg standard Welsh/Scottish steam coal
const SPECIFIC_HEAT_CAST_IRON_J_KG_K = 460;
const DENSITY_CAST_IRON_KG_M3 = 7200;
const LATENT_HEAT_STEAM_J_KG = 2.26e6;
const WATER_DENSITY_KG_M3 = 1000;
const GRAVITY_M_S2 = 9.80665;
const STANDARD_MINE_HEAD_METERS = 183.0; // 100 fathoms Cornwall/Newcastle coal mine shaft

/**
 * Step the thermodynamic and mechanical state of the Watt separate condenser steam engine.
 */
export function stepWattCondenser(controls: WattCondenserControls = {}): WattCondenserOutputs {
  const boilerPressurePsi = Math.max(
    0.5,
    Math.min(10.0, controls.boilerPressurePsi ?? WATT_DEFAULT_CONTROLS.boilerPressurePsi),
  );
  const condenserTempC = Math.max(
    10.0,
    Math.min(60.0, controls.condenserTempC ?? WATT_DEFAULT_CONTROLS.condenserTempC),
  );
  const cylinderBoreInches = Math.max(
    20.0,
    Math.min(72.0, controls.cylinderBoreInches ?? WATT_DEFAULT_CONTROLS.cylinderBoreInches),
  );
  const pistonStrokeFeet = Math.max(
    4.0,
    Math.min(10.0, controls.pistonStrokeFeet ?? WATT_DEFAULT_CONTROLS.pistonStrokeFeet),
  );
  const strokesPerMinute = Math.max(
    6.0,
    Math.min(24.0, controls.strokesPerMinute ?? WATT_DEFAULT_CONTROLS.strokesPerMinute),
  );
  const hasSteamJacket = controls.hasSteamJacket ?? WATT_DEFAULT_CONTROLS.hasSteamJacket;
  const hasSeparateCondenser =
    controls.hasSeparateCondenser ?? WATT_DEFAULT_CONTROLS.hasSeparateCondenser;

  // Conversions to SI
  const boreMeters = cylinderBoreInches * 0.0254;
  const strokeMeters = pistonStrokeFeet * 0.3048;
  const pistonAreaM2 = (Math.PI / 4) * boreMeters * boreMeters;
  const displacedVolumeM3 = pistonAreaM2 * strokeMeters;

  // Boiler absolute pressure & saturation temperature
  const boilerGaugeKpa = boilerPressurePsi * 6.89476;
  const boilerPressureAbsKpa = ATMOSPHERIC_PRESSURE_KPA + boilerGaugeKpa;
  // Saturation temperature approximation T_sat(P) in °C
  const steamTempC = 100.0 + (boilerGaugeKpa / 100.0) * 20.0;

  // Condenser saturation pressure via Antoine equation: log10(P_mmHg) = 8.07131 - 1730.63 / (233.426 + T)
  const pSatMmhg = 10 ** (8.07131 - 1730.63 / (233.426 + condenserTempC));
  const condenserPressureAbsKpa = hasSeparateCondenser
    ? Math.max(3.5, (pSatMmhg * 101.325) / 760.0)
    : Math.max(12.0, (pSatMmhg * 101.325) / 760.0 + 15.0); // Newcomen in-cylinder spray imperfect vacuum

  const vacuumKpa = ATMOSPHERIC_PRESSURE_KPA - condenserPressureAbsKpa;
  const vacuumDepthInchesHg = Math.max(0, (vacuumKpa / 101.325) * 29.92);

  // Cylinder wall thermal state
  const cylinderWallTempC = hasSeparateCondenser
    ? hasSteamJacket
      ? steamTempC
      : steamTempC - 8.0
    : (steamTempC + condenserTempC) / 2.0; // Severe temperature swing in Newcomen

  // Indicated Mean Effective Pressure (IMEP)
  // In single-acting engine, working stroke has boiler steam pressing down while condenser pulls below
  const netPressureDriveKpa = hasSeparateCondenser
    ? boilerPressureAbsKpa - condenserPressureAbsKpa - 6.0 // 6 kPa mechanical friction
    : ATMOSPHERIC_PRESSURE_KPA - condenserPressureAbsKpa - 12.0;

  const imepKpa = Math.max(5.0, netPressureDriveKpa);
  const imepPsi = imepKpa / 6.89476;

  // Mechanical Force and Indicated Power
  const pistonPistonForceKn = (imepKpa * 1000 * pistonAreaM2) / 1000;
  const workPerStrokeJoules = imepKpa * 1000 * displacedVolumeM3;
  const frequencyHz = strokesPerMinute / 60.0;
  const cycleOmegaRadPerS = 2 * Math.PI * frequencyHz;
  const indicatedPowerKw = (workPerStrokeJoules * frequencyHz) / 1000.0;
  const indicatedHorsepower = indicatedPowerKw * 1.34102;

  // Air pump work (Watt Principle 3)
  const airPumpDisplacementM3 = displacedVolumeM3 * 0.18;
  const airPumpWorkJoules =
    (ATMOSPHERIC_PRESSURE_KPA - condenserPressureAbsKpa) * 1000 * airPumpDisplacementM3 * 0.7;
  const airPumpPowerKw = (airPumpWorkJoules * frequencyHz) / 1000.0;

  // Thermal energy consumption & In-cylinder quench penalty
  // Mass of iron cylinder liner interacting thermally
  const wallThicknessMeters = 0.035; // 35 mm cast iron
  const linerThermalMassKg =
    Math.PI * boreMeters * strokeMeters * wallThicknessMeters * DENSITY_CAST_IRON_KG_M3 * 0.4;

  const cyclicQuenchHeatJoules = hasSeparateCondenser
    ? hasSteamJacket
      ? 0
      : linerThermalMassKg * SPECIFIC_HEAT_CAST_IRON_J_KG_K * 8.0
    : linerThermalMassKg * SPECIFIC_HEAT_CAST_IRON_J_KG_K * (steamTempC - condenserTempC);

  const steamDensityKgM3 = (boilerPressureAbsKpa * 1000) / (461.5 * (steamTempC + 273.15));
  const workingSteamMassKg = displacedVolumeM3 * steamDensityKgM3;
  const idealSteamEnthalpyJoules = workingSteamMassKg * LATENT_HEAT_STEAM_J_KG;
  const boilerFurnaceEfficiency = 0.65; // 18th-century brick-set waggon boiler thermal efficiency
  const standingRadiationLossWatts = 3200; // Convective/radiant heat from boiler, pipes, and cylinder casing

  const rawHeatPerStrokeJoules =
    (idealSteamEnthalpyJoules + cyclicQuenchHeatJoules) / boilerFurnaceEfficiency;
  const heatInputRateKw =
    (rawHeatPerStrokeJoules * frequencyHz + standingRadiationLossWatts) / 1000.0;
  const netShaftPowerKw = Math.max(0.1, indicatedPowerKw - airPumpPowerKw);
  const thermalEfficiencyPct = (netShaftPowerKw / heatInputRateKw) * 100.0;

  // Coal consumption calculations
  const coalPerSecondKg = (heatInputRateKw * 1000.0) / COAL_LOWER_HEATING_VALUE_J_PER_KG;
  const coalConsumptionKgPerHour = coalPerSecondKg * 3600.0;
  const specificFuelConsumptionKgPerKwh = coalConsumptionKgPerHour / Math.max(0.1, netShaftPowerKw);

  // Newcomen comparator: Newcomen burned 4x to 5x more coal for same shaft work
  const baseWattSfc = 2.4; // kg coal / kWh for well-jacketed separate condenser
  const newcomenFuelMultiplier = hasSeparateCondenser
    ? 1.0
    : specificFuelConsumptionKgPerKwh / baseWattSfc;

  const annualHours = 6000; // Continuous Cornish copper/tin pumping operation
  const coalSavedTonsPerYear = hasSeparateCondenser
    ? (coalConsumptionKgPerHour * (3.8 - 1.0) * annualHours) / 1000.0
    : 0;

  // Water pumping rate from 183m (100 fathom) mine shaft
  const pumpMechanicalEfficiency = 0.78;
  const hydraulicPowerWatts = netShaftPowerKw * 1000 * pumpMechanicalEfficiency;
  const waterFlowM3PerSec =
    hydraulicPowerWatts / (WATER_DENSITY_KG_M3 * GRAVITY_M_S2 * STANDARD_MINE_HEAD_METERS);
  const waterPumpedM3PerHour = Math.max(0, waterFlowM3PerSec * 3600.0);
  const waterPumpedGallonsPerHour = waterPumpedM3PerHour * 264.172;

  return {
    boilerPressureAbsKpa,
    condenserPressureAbsKpa,
    vacuumDepthInchesHg,
    imepPsi,
    imepKpa,
    steamTempC,
    cylinderWallTempC,
    condenserTempC,
    displacedVolumeM3,
    pistonAreaM2,
    pistonPistonForceKn,
    indicatedPowerKw,
    indicatedHorsepower,
    heatInputRateKw,
    thermalEfficiencyPct,
    coalConsumptionKgPerHour,
    specificFuelConsumptionKgPerKwh,
    newcomenFuelMultiplier,
    coalSavedTonsPerYear,
    waterPumpedM3PerHour,
    waterPumpedGallonsPerHour,
    airPumpPowerKw,
    frequencyHz: Number(frequencyHz.toFixed(6)),
    cycleOmegaRadPerS: Number(cycleOmegaRadPerS.toFixed(6)),
  };
}
