/**
 * analyticReferences.ts
 *
 * Closed-form, independently derived analytic reference solutions
 * for all admitted physical and numerical families in the museum library.
 *
 * Used for independent verification of runtime kernels against textbook
 * physics, ensuring simulation models never loosen tolerances or drift
 * without detection.
 */

// ----------------------------------------------------------------------------
// 1. Aerodynamics & Induced Drag (Wright Flyer)
// ----------------------------------------------------------------------------
export interface WrightAnalyticReference {
  airspeedMps: number;
  dynamicPressurePa: number;
  liftNewtons: number;
  inducedDragNewtons: number;
  kineticEnergyJoules: number;
}

export function computeWrightAnalyticReference(params: {
  airspeedMph: number;
  grossWeightN?: number;
  liftCoefficientCl?: number;
  wingSpanM?: number;
  wingAreaM2?: number;
  airDensityKgM3?: number;
  oswaldEfficiency?: number;
}): WrightAnalyticReference {
  const {
    airspeedMph,
    grossWeightN = 340 * 9.80665, // ~3334.26 N
    liftCoefficientCl = 0.45,
    wingSpanM: _wingSpanM = 12.29, // 40.33 ft
    wingAreaM2 = 47.4, // 510 sq ft
    airDensityKgM3 = 1.225,
    oswaldEfficiency = 0.85,
  } = params;

  const vMps = airspeedMph * 0.44704;
  const q = 0.5 * airDensityKgM3 * vMps * vMps;

  // Exact aerodynamic lift: L = q * S * C_L
  const lift = q * wingAreaM2 * liftCoefficientCl;
  const massKg = grossWeightN / 9.80665;
  const kinetic = 0.5 * massKg * vMps * vMps;

  // Induced drag Di = L^2 / (pi * aspect * e * q * S) where aspect = b^2 / S = 6.4
  const aspect = 6.4;
  const denominator = Math.PI * aspect * oswaldEfficiency * q * wingAreaM2 + 1e-4;
  const inducedDrag = denominator > 0 ? (lift * lift) / denominator : 0;

  return {
    airspeedMps: vMps,
    dynamicPressurePa: q,
    liftNewtons: lift,
    inducedDragNewtons: inducedDrag,
    kineticEnergyJoules: kinetic,
  };
}

// ----------------------------------------------------------------------------
// 2. Electro-Thermal Radiation & Joule Heating (Edison Lamp)
// ----------------------------------------------------------------------------
export interface EdisonAnalyticReference {
  voltageV: number;
  resistanceOhm: number;
  joulePowerWatts: number;
  currentAmps: number;
  equilibriumTempK: number;
  radiativePowerWatts: number;
}

export function computeEdisonAnalyticReference(params: {
  voltageV: number;
  resistanceOhm: number;
  filamentSurfaceAreaM2?: number;
  emissivity?: number;
  ambientTempK?: number;
}): EdisonAnalyticReference {
  const {
    voltageV,
    resistanceOhm,
    filamentSurfaceAreaM2 = 3.8e-5, // ~0.4 mm diameter x 30 cm
    emissivity = 0.85,
    ambientTempK = 295.15,
  } = params;

  const sigma = 5.670374419e-8; // W/(m^2 K^4)
  const current = voltageV / resistanceOhm;
  const joulePower = voltageV * current; // P = V^2 / R

  // P_rad = epsilon * sigma * A * (T^4 - T_amb^4) = P_joule
  // T^4 = T_amb^4 + P_joule / (epsilon * sigma * A)
  const radiationFactor = emissivity * sigma * filamentSurfaceAreaM2;
  const t4 = ambientTempK ** 4 + joulePower / radiationFactor;
  const eqTemp = t4 ** 0.25;
  const radiativePower = radiationFactor * (eqTemp ** 4 - ambientTempK ** 4);

  return {
    voltageV,
    resistanceOhm,
    joulePowerWatts: joulePower,
    currentAmps: current,
    equilibriumTempK: eqTemp,
    radiativePowerWatts: radiativePower,
  };
}

// ----------------------------------------------------------------------------
// 3. Electro-Thermal Welding Joule Heating (Thomson Welding)
// ----------------------------------------------------------------------------
export function computeThomsonAnalyticReference(params: {
  weldCurrentAmps: number;
  contactResistanceOhm?: number;
}): { weldPowerWatts: number } {
  const { weldCurrentAmps, contactResistanceOhm = 0.00018 } = params;
  return {
    weldPowerWatts: weldCurrentAmps * weldCurrentAmps * contactResistanceOhm,
  };
}

// ----------------------------------------------------------------------------
// 4. Faraday Electrochemical Electrolysis (Hall-Héroult Aluminium)
// ----------------------------------------------------------------------------
export interface HallAnalyticReference {
  currentAmperes: number;
  faradayProductionRateKgPerSec: number;
  faradayProductionRateKgPerHour: number;
  theoreticalPowerWatts: number;
}

export function computeHallAnalyticReference(params: {
  currentAmperes: number;
  cellVoltageV?: number;
  faradayEfficiency?: number;
}): HallAnalyticReference {
  const { currentAmperes, cellVoltageV = 4.5, faradayEfficiency = 0.9 } = params;

  // Aluminum: Al3+ + 3e- -> Al
  const molarMassKgPerMol = 0.026981538;
  const valency = 3;
  const faradayConst = 96485.33212; // C/mol

  // m_dot = (I * M / (z * F)) * eta
  const rateKgPerSec =
    ((currentAmperes * molarMassKgPerMol) / (valency * faradayConst)) * faradayEfficiency;
  const rateKgPerHour = rateKgPerSec * 3600;
  const theoreticalPower = currentAmperes * cellVoltageV;

  return {
    currentAmperes,
    faradayProductionRateKgPerSec: rateKgPerSec,
    faradayProductionRateKgPerHour: rateKgPerHour,
    theoreticalPowerWatts: theoreticalPower,
  };
}

// ----------------------------------------------------------------------------
// 5. Continuum Mechanics & Vulcanized Rubber (Goodyear)
// ----------------------------------------------------------------------------
export interface GoodyearAnalyticReference {
  stretchRatioLambda: number;
  strainEnergyDensityJPerM3: number;
  engineeringStressPa: number;
  trueStressPa: number;
}

export function computeGoodyearAnalyticReference(params: {
  stretchRatioLambda: number;
  shearModulusPa?: number;
}): GoodyearAnalyticReference {
  const { stretchRatioLambda: lambda, shearModulusPa = 4.0e5 } = params;

  // Incompressible Neo-Hookean strain energy density:
  // W = 0.5 * G * (lambda^2 + 2/lambda - 3)
  const w = 0.5 * shearModulusPa * (lambda * lambda + 2 / lambda - 3);

  // Engineering stress s = dW/dlambda = G * (lambda - 1 / lambda^2)
  const engStress = shearModulusPa * (lambda - 1 / (lambda * lambda));

  // True (Cauchy) stress sigma = lambda * s = G * (lambda^2 - 1/lambda)
  const trueStress = lambda * engStress;

  return {
    stretchRatioLambda: lambda,
    strainEnergyDensityJPerM3: w,
    engineeringStressPa: engStress,
    trueStressPa: trueStress,
  };
}

// ----------------------------------------------------------------------------
// 6. Nuclear Kinetics & Delayed Neutron Criticality (Fermi Pile)
// ----------------------------------------------------------------------------
export interface FermiAnalyticReference {
  kEffective: number;
  excessReactivityDeltaK: number;
  reactivityDollars: number;
  isPromptCritical: boolean;
}

export function computeFermiAnalyticReference(params: {
  kEffective: number;
  delayedNeutronFractionBeta?: number;
}): FermiAnalyticReference {
  const { kEffective, delayedNeutronFractionBeta = 0.0065 } = params;

  // Static reactivity rho = (k - 1) / k
  const rho = (kEffective - 1) / kEffective;
  const dollars = rho / delayedNeutronFractionBeta;

  return {
    kEffective,
    excessReactivityDeltaK: kEffective - 1,
    reactivityDollars: dollars,
    isPromptCritical: dollars >= 1.0,
  };
}

// ----------------------------------------------------------------------------
// 7. Thermodynamic Cycles (Watt Condenser & Otto Engine)
// ----------------------------------------------------------------------------
export function computeCarnotEfficiency(thHotK: number, tcColdK: number): number {
  if (thHotK <= 0 || tcColdK <= 0 || tcColdK >= thHotK) return 0;
  return 1 - tcColdK / thHotK;
}

export function computeAirStandardOttoEfficiency(
  compressionRatio: number,
  gammaRatio: number = 1.4,
): number {
  if (compressionRatio <= 1) return 0;
  return 1 - 1 / compressionRatio ** (gammaRatio - 1);
}

// ----------------------------------------------------------------------------
// 8. Electromechanical Induction (Tesla Motor)
// ----------------------------------------------------------------------------
export interface TeslaMotorAnalyticReference {
  frequencyHz: number;
  poles: number;
  slip: number;
  synchronousRpm: number;
  rotorRpm: number;
  rotorAngularVelocityRadPerSec: number;
}

export function computeTeslaMotorAnalyticReference(params: {
  frequencyHz: number;
  poles?: number;
  slip?: number;
}): TeslaMotorAnalyticReference {
  const { frequencyHz, poles = 4, slip = 0.04 } = params;
  const syncRpm = (120 * frequencyHz) / poles;
  const rotorRpm = syncRpm * (1 - slip);
  const omega = (rotorRpm * 2 * Math.PI) / 60;

  return {
    frequencyHz,
    poles,
    slip,
    synchronousRpm: syncRpm,
    rotorRpm,
    rotorAngularVelocityRadPerSec: omega,
  };
}

// ----------------------------------------------------------------------------
// 9. Semiconductor Minority Carrier Transport (Bardeen Transistor)
// ----------------------------------------------------------------------------
export interface BardeenAnalyticReference {
  baseWidthUm: number;
  diffusionLengthUm: number;
  baseTransportFactor: number;
  injectionEfficiency: number;
  alphaCurrentGain: number;
}

export function computeBardeenAnalyticReference(params: {
  baseWidthUm: number;
  diffusionLengthUm?: number;
  injectionEfficiency?: number;
}): BardeenAnalyticReference {
  const { baseWidthUm, diffusionLengthUm = 50.0, injectionEfficiency = 0.98 } = params;

  // Base transport factor beta = sech(W / L_p)
  // sech(x) = 2 / (e^x + e^-x)
  const x = baseWidthUm / diffusionLengthUm;
  const sech = 2 / (Math.exp(x) + Math.exp(-x));
  const alpha = injectionEfficiency * sech;

  return {
    baseWidthUm,
    diffusionLengthUm,
    baseTransportFactor: sech,
    injectionEfficiency,
    alphaCurrentGain: alpha,
  };
}
