/**
 * mestralVelcroKernel.ts
 *
 * SI computational physics kernel for George de Mestral's Velcro Hook-and-Loop Fastener (US 2,717,437).
 *
 * Models:
 * 1. Thermoplastic polyamide monofilament Euler-Bernoulli cantilever beam bending (EI, k_hook).
 * 2. Thermal setting shape-memory retention fraction as a function of lancet bar temperature.
 * 3. In-plane shear stress capacity across the 2D interlocking hook matrix.
 * 4. Progressive peeling fracture mechanics (Kendall peeling law) and extreme peel-to-shear force anisotropy.
 * 5. Dynamic peeling power dissipation.
 */

export interface MestralVelcroControls {
  filamentDiameterMm: number;
  hookLengthMm: number;
  hookDensityPerCm2: number;
  peelAngleDeg: number;
  heatSettingTempC: number;
  appliedShearForceN: number;
  appliedPeelRateMmS: number;
  engagementRatio: number;
}

export interface MestralVelcroTelemetry {
  flexuralRigidityN_M2: number;
  singleHookSpringRateN_M: number;
  singleHookReleaseForceN: number;
  thermalRetentionFraction: number;
  effectiveHookDensityPerCm2: number;
  shearStressCapacityN_Cm2: number;
  maxShearCapacity5cm2N: number;
  peelForcePerCmN: number;
  totalPeelForceN: number;
  forceAnisotropyRatio: number;
  peelDisengagementPowerWatts: number;
  hookDeflectionMm: number;
}

export const MESTRAL_VELCRO_DEFAULTS: MestralVelcroControls = {
  filamentDiameterMm: 0.2,
  hookLengthMm: 1.8,
  hookDensityPerCm2: 64,
  peelAngleDeg: 90,
  heatSettingTempC: 150,
  appliedShearForceN: 25.0,
  appliedPeelRateMmS: 10.0,
  engagementRatio: 0.85,
};

// Physical Constants for Drawn Polyamide-6,6 (Nylon)
const NYLON_MODULUS_PA = 2.8e9; // 2.8 GPa
const NOMINAL_TAPE_WIDTH_CM = 2.5; // Standard 1-inch (25 mm) tape
const STANDARD_SHEAR_AREA_CM2 = 12.5; // 5 cm overlap of 2.5 cm tape

export function readMestralVelcroControls(params: Record<string, number>): MestralVelcroControls {
  return {
    filamentDiameterMm: params.filamentDiameterMm ?? MESTRAL_VELCRO_DEFAULTS.filamentDiameterMm,
    hookLengthMm: params.hookLengthMm ?? MESTRAL_VELCRO_DEFAULTS.hookLengthMm,
    hookDensityPerCm2: params.hookDensityPerCm2 ?? MESTRAL_VELCRO_DEFAULTS.hookDensityPerCm2,
    peelAngleDeg: params.peelAngleDeg ?? MESTRAL_VELCRO_DEFAULTS.peelAngleDeg,
    heatSettingTempC: params.heatSettingTempC ?? MESTRAL_VELCRO_DEFAULTS.heatSettingTempC,
    appliedShearForceN: params.appliedShearForceN ?? MESTRAL_VELCRO_DEFAULTS.appliedShearForceN,
    appliedPeelRateMmS: params.appliedPeelRateMmS ?? MESTRAL_VELCRO_DEFAULTS.appliedPeelRateMmS,
    engagementRatio: params.engagementRatio ?? MESTRAL_VELCRO_DEFAULTS.engagementRatio,
  };
}

export function stepMestralVelcroSi(
  controls: MestralVelcroControls,
  _timeSec = 0,
): MestralVelcroTelemetry {
  const d_m = Math.max(0.05, controls.filamentDiameterMm) * 1e-3;
  const L_m = Math.max(0.5, controls.hookLengthMm) * 1e-3;
  const n_cm2 = Math.max(5, controls.hookDensityPerCm2);
  const eta = Math.min(1.0, Math.max(0.05, controls.engagementRatio));
  const T_c = controls.heatSettingTempC;
  const theta_rad = (Math.max(5, Math.min(175, controls.peelAngleDeg)) * Math.PI) / 180;
  const v_peel_m_s = Math.max(0.1, controls.appliedPeelRateMmS) * 1e-3;

  // 1. Second moment of area and flexural rigidity
  // I = pi * d^4 / 64
  const I_m4 = (Math.PI * d_m ** 4) / 64;
  const flexuralRigidityN_M2 = NYLON_MODULUS_PA * I_m4;

  // 2. Single hook spring rate (cantilever beam: k = 3EI / L^3)
  const singleHookSpringRateN_M = (3 * flexuralRigidityN_M2) / L_m ** 3;

  // 3. Thermal setting shape-memory retention fraction
  // Sigmoidal transition centered around 140°C
  const thermalRetentionFraction = 1 / (1 + Math.exp(-0.08 * (T_c - 135)));

  // 4. Single hook critical release force (elastic tip clearance delta_crit ~ 0.35 * L)
  const delta_crit_m = 0.35 * L_m;
  const singleHookReleaseForceN = singleHookSpringRateN_M * delta_crit_m * thermalRetentionFraction;

  // 5. Interlocking hook density and in-plane shear capacity
  const effectiveHookDensityPerCm2 = n_cm2 * eta * thermalRetentionFraction;
  // In shear, hooks act in parallel along axial tension / hook bend resistance
  const shearPerHookN = singleHookReleaseForceN * 1.8; // Axial shear multiplier
  const shearStressCapacityN_Cm2 = effectiveHookDensityPerCm2 * shearPerHookN;
  const maxShearCapacity5cm2N = shearStressCapacityN_Cm2 * STANDARD_SHEAR_AREA_CM2;

  // 6. Progressive peeling fracture mechanics (Kendall peeling law)
  // Linear hook density along peel wavefront: n_line = sqrt(n_cm2 * 10000) / 100 (hooks/cm)
  const n_line_per_cm = Math.sqrt(effectiveHookDensityPerCm2);
  // Strain energy to trip one hook: W_hook = 0.5 * k * delta^2
  const hookEnergyJ = 0.5 * singleHookSpringRateN_M * delta_crit_m ** 2;
  const criticalAdhesionEnergyG_c = n_line_per_cm * 100 * hookEnergyJ; // J/m^2 = N/m

  // F_peel = w * G_c / (1 - cos(theta))
  const peelDenominator = Math.max(0.08, 1 - Math.cos(theta_rad));
  const peelForcePerCmN = criticalAdhesionEnergyG_c / 100 / peelDenominator;
  const totalPeelForceN = peelForcePerCmN * NOMINAL_TAPE_WIDTH_CM;

  // 7. Force Anisotropy Ratio (Shear to Peel)
  const forceAnisotropyRatio = totalPeelForceN > 0 ? maxShearCapacity5cm2N / totalPeelForceN : 20.0;

  // 8. Peeling disengagement power (P = F * v)
  const peelDisengagementPowerWatts = totalPeelForceN * v_peel_m_s;

  // 9. Live dynamic hook deflection under applied shear load
  const totalEngagedHooks = effectiveHookDensityPerCm2 * STANDARD_SHEAR_AREA_CM2;
  const forcePerHookN = totalEngagedHooks > 0 ? controls.appliedShearForceN / totalEngagedHooks : 0;
  const hookDeflectionMm =
    singleHookSpringRateN_M > 0
      ? Math.min(delta_crit_m * 1000, (forcePerHookN / singleHookSpringRateN_M) * 1000)
      : 0;

  return {
    flexuralRigidityN_M2,
    singleHookSpringRateN_M,
    singleHookReleaseForceN,
    thermalRetentionFraction,
    effectiveHookDensityPerCm2,
    shearStressCapacityN_Cm2,
    maxShearCapacity5cm2N,
    peelForcePerCmN,
    totalPeelForceN,
    forceAnisotropyRatio,
    peelDisengagementPowerWatts,
    hookDeflectionMm,
  };
}
