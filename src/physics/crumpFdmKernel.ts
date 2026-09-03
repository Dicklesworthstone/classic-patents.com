/**
 * S. Scott Crump — US 5,121,329
 * Apparatus and Method for Creating Three-Dimensional Objects
 * Fused Deposition Modeling (FDM) Computational Physics Kernel
 *
 * Implements a source-bounded Fig. 5 flexible-strand scenario. The two
 * quantitative laws are deliberately reduced screens: Newtonian circular-
 * capillary flow and fixed-boundary first-mode slab cooling. Neither is a
 * historic machine-performance or finished-part-strength claim.
 */

export interface CrumpFdmControls {
  /** Claim 1 apparatus/relative-motion topology probe (1 = present). */
  claim1ApparatusEnabled: number;
  /** Claim 2 heating-means probe for the thermoplastic Fig. 5 scenario. */
  claim2HeatingEnabled: number;
  /** Claim 39 substantially planar nozzle-bottom/gap probe. */
  claim39PlanarNozzleEnabled: number;
  /** Nozzle liquefier temperature in Celsius (T_nozzle) */
  nozzleTempC: number;
  /** Print toolpath velocity in mm/s (v_head) */
  printSpeedMmS: number;
  /** Nozzle orifice diameter in mm (d_nozzle) */
  nozzleDiameterMm: number;
  /** Layer height / thickness in mm (h) */
  layerHeightMm: number;
  /** Extruded road / bead width in mm (w) */
  roadWidthMm: number;
  /** Feedstock filament diameter in mm (D_filament) */
  filamentDiameterMm: number;
  /** Ambient build chamber temperature in Celsius (T_ambient) */
  ambientTempC: number;
  /** Polymer melt viscosity at reference 230 C in Pa·s (mu_0) */
  referenceViscosityPaS: number;
  /** Filament drive roller pinch normal force in N (F_pinch) */
  pinchRollerForceN: number;
  /** Build platform Z height in mm */
  buildHeightMm: number;
}

export interface CrumpFdmTelemetry {
  /** Volumetric extrusion flow rate in mm^3/s (Q) */
  volumetricFlowRateMm3S: number;
  /** Filament linear feed speed into liquefier in mm/s (v_feed) */
  filamentFeedSpeedMmS: number;
  /** Apparent melt viscosity at operating temperature in Pa·s (mu) */
  apparentViscosityPaS: number;
  /** Pressure drop across nozzle capillary in MPa (Delta P) */
  nozzlePressureDropMPa: number;
  /** Newtonian capillary wall shear-rate screen in reciprocal seconds. */
  wallShearRatePerS: number;
  /** Hydraulic pressure-flow product in watts; not heater input power. */
  hydraulicPowerW: number;
  /** Required mechanical axial feed force in N (F_drive) */
  feedDriveForceN: number;
  /** Maximum traction force available before filament stripping in N (F_traction) */
  maxTractionForceN: number;
  /** Extrusion road bead aspect ratio (w / h) */
  beadAspectRatio: number;
  /** Fixed-boundary first-mode thermal time constant in seconds (tau). */
  coolingTimeConstantSec: number;
  /** First-mode time to cross the illustrative ABS glass transition. */
  timeToGlassTransitionSec: number;
  /** Interlayer contact interface temperature in Celsius (T_interface) */
  interfaceTempC: number;
  /** Illustrative interface-temperature margin above ABS Tg in Celsius/Kelvin. */
  interfaceTemperatureMarginC: number;
  /** Whether that screening temperature lies above the illustrative ABS Tg. */
  interfaceAboveGlassTransition: boolean;
  /** Claim 1 topology is present in the comparison state. */
  claim1ApparatusPresent: boolean;
  /** Claim 2 heating means is present in the comparison state. */
  claim2HeatingMeansPresent: boolean;
  /** Claim 39 planar-bottom/gap relation is present in the comparison state. */
  claim39PlanarGapPresent: boolean;
  /** Whether the thermoplastic bead is actively extruding and adhering */
  isExtruding: boolean;
  /** Refusal boundaries */
  coldNozzleJamRefusal: boolean;
  filamentGrindingRefusal: boolean;
  poorAdhesionRefusal: boolean;
  refusalReason?: string;
  /** Generic FrankenSim owner mirrored by this synchronous TypeScript path. */
  capillaryOwner: "fs-flux::capillary::step_newtonian_circular_capillary";
  /** Generic FrankenSim owner mirrored by this synchronous TypeScript path. */
  thermalOwner: "fs-conduction::reduced_slab::step_first_mode_slab_cooling";
  /** Exact capillary applicability boundary. */
  capillaryBoundary: "newtonian-incompressible-fully-developed-laminar-no-slip-circular-land";
  /** Exact thermal applicability boundary. */
  thermalBoundary: "one-dimensional-fixed-boundary-first-mode-screen-no-phase-change";
}

export const CRUMP_FDM_DEFAULT_CONTROLS: CrumpFdmControls = {
  claim1ApparatusEnabled: 1,
  claim2HeatingEnabled: 1,
  claim39PlanarNozzleEnabled: 1,
  nozzleTempC: 225.0,
  printSpeedMmS: 45.0,
  nozzleDiameterMm: 0.4,
  layerHeightMm: 0.2,
  roadWidthMm: 0.45,
  // The specification calls the flexible strand "on the order of one-
  // sixteenth inch in diameter." 1/16 in = 1.5875 mm exactly.
  filamentDiameterMm: 1.5875,
  ambientTempC: 25.0,
  referenceViscosityPaS: 280.0,
  pinchRollerForceN: 45.0,
  buildHeightMm: 12.4,
};

// Illustrative modern ABS scenario values. The 1992 grant does not print a
// material card, nozzle land length, viscosity law, or roller friction.
export const CRUMP_FDM_SCENARIO_NOTE =
  "Illustrative modern ABS material/geometry screen; US 5,121,329 does not disclose these performance inputs.";
export const CRUMP_FDM_GLASS_TRANSITION_TEMP_C = 105.0;
const ACTIVATION_ENERGY_KJ_MOL = 48.0;
const GAS_CONSTANT_R = 8.314e-3; // kJ / (mol · K)
const REF_TEMP_K = 230.0 + 273.15; // 503.15 K
const THERMAL_DIFFUSIVITY_MM2_S = 0.082; // alpha for ABS polymer (8.2e-8 m^2/s)
export const CRUMP_FDM_ILLUSTRATIVE_NOZZLE_LAND_LENGTH_MM = 1.6;
const PINCH_FRICTION_COEFF = 0.35;

const CAPILLARY_OWNER = "fs-flux::capillary::step_newtonian_circular_capillary" as const;
const THERMAL_OWNER =
  "fs-conduction::reduced_slab::step_first_mode_slab_cooling" as const;
const CAPILLARY_BOUNDARY =
  "newtonian-incompressible-fully-developed-laminar-no-slip-circular-land" as const;
const THERMAL_BOUNDARY =
  "one-dimensional-fixed-boundary-first-mode-screen-no-phase-change" as const;

function binary(value: unknown, fallback: number): number {
  return typeof value === "number" ? (value >= 0.5 ? 1 : 0) : fallback;
}

export function readCrumpFdmClaimStates(
  params?: Record<string, number | boolean | string | undefined>,
): Record<1 | 2 | 39, boolean> {
  return {
    1: binary(params?.claim1ConstraintActive, 1) === 1,
    2: binary(params?.claim2ConstraintActive, 1) === 1,
    39: binary(params?.claim39ConstraintActive, 1) === 1,
  };
}

export function readCrumpFdmControls(
  params?: Partial<CrumpFdmControls> | Record<string, number | boolean | string | undefined>,
): CrumpFdmControls {
  return {
    claim1ApparatusEnabled: binary(
      params?.claim1ApparatusEnabled ?? params?.claim1ConstraintActive,
      CRUMP_FDM_DEFAULT_CONTROLS.claim1ApparatusEnabled,
    ),
    claim2HeatingEnabled: binary(
      params?.claim2HeatingEnabled ?? params?.claim2ConstraintActive,
      CRUMP_FDM_DEFAULT_CONTROLS.claim2HeatingEnabled,
    ),
    claim39PlanarNozzleEnabled: binary(
      params?.claim39PlanarNozzleEnabled ?? params?.claim39ConstraintActive,
      CRUMP_FDM_DEFAULT_CONTROLS.claim39PlanarNozzleEnabled,
    ),
    nozzleTempC:
      typeof params?.nozzleTempC === "number"
        ? Math.max(100, Math.min(300, params.nozzleTempC))
        : CRUMP_FDM_DEFAULT_CONTROLS.nozzleTempC,
    printSpeedMmS:
      typeof params?.printSpeedMmS === "number"
        ? Math.max(5, Math.min(250, params.printSpeedMmS))
        : CRUMP_FDM_DEFAULT_CONTROLS.printSpeedMmS,
    nozzleDiameterMm:
      typeof params?.nozzleDiameterMm === "number"
        ? Math.max(0.15, Math.min(1.2, params.nozzleDiameterMm))
        : CRUMP_FDM_DEFAULT_CONTROLS.nozzleDiameterMm,
    layerHeightMm:
      typeof params?.layerHeightMm === "number"
        ? Math.max(0.05, Math.min(0.8, params.layerHeightMm))
        : CRUMP_FDM_DEFAULT_CONTROLS.layerHeightMm,
    roadWidthMm:
      typeof params?.roadWidthMm === "number"
        ? Math.max(0.15, Math.min(1.8, params.roadWidthMm))
        : CRUMP_FDM_DEFAULT_CONTROLS.roadWidthMm,
    filamentDiameterMm:
      typeof params?.filamentDiameterMm === "number"
        ? Math.max(1.0, Math.min(3.5, params.filamentDiameterMm))
        : CRUMP_FDM_DEFAULT_CONTROLS.filamentDiameterMm,
    ambientTempC:
      typeof params?.ambientTempC === "number"
        ? Math.max(15, Math.min(80, params.ambientTempC))
        : CRUMP_FDM_DEFAULT_CONTROLS.ambientTempC,
    referenceViscosityPaS:
      typeof params?.referenceViscosityPaS === "number"
        ? Math.max(50, Math.min(1000, params.referenceViscosityPaS))
        : CRUMP_FDM_DEFAULT_CONTROLS.referenceViscosityPaS,
    pinchRollerForceN:
      typeof params?.pinchRollerForceN === "number"
        ? Math.max(10, Math.min(120, params.pinchRollerForceN))
        : CRUMP_FDM_DEFAULT_CONTROLS.pinchRollerForceN,
    buildHeightMm:
      typeof params?.buildHeightMm === "number"
        ? Math.max(0, Math.min(300, params.buildHeightMm))
        : CRUMP_FDM_DEFAULT_CONTROLS.buildHeightMm,
  };
}

export function stepCrumpFdmSi(controls: CrumpFdmControls): CrumpFdmTelemetry {
  const T_nozzle_K = controls.nozzleTempC + 273.15;

  // 1. Volumetric extrusion flow rate Q = w * h * v_head in mm^3/s
  const Q_mm3_s = controls.roadWidthMm * controls.layerHeightMm * controls.printSpeedMmS;
  const Q_m3_s = Q_mm3_s * 1e-9;

  // 2. Filament feed velocity v_feed = 4Q / (pi * D_filament^2) in mm/s
  const A_filament_mm2 = (Math.PI * controls.filamentDiameterMm ** 2) / 4.0;
  const v_feed_mm_s = Q_mm3_s / A_filament_mm2;

  // 3. Temperature-dependent Arrhenius melt viscosity mu(T)
  const tempDiff = 1.0 / T_nozzle_K - 1.0 / REF_TEMP_K;
  const mu_Pa_s =
    controls.referenceViscosityPaS *
    Math.exp((ACTIVATION_ENERGY_KJ_MOL / GAS_CONSTANT_R) * tempDiff);

  // 4. Poiseuille nozzle capillary pressure drop Delta P = 8 * mu * L * Q / (pi * R^4)
  const R_nozzle_m = (controls.nozzleDiameterMm * 1e-3) / 2.0;
  const L_nozzle_m = CRUMP_FDM_ILLUSTRATIVE_NOZZLE_LAND_LENGTH_MM * 1e-3;
  const DeltaP_Pa = (8.0 * mu_Pa_s * L_nozzle_m * Q_m3_s) / (Math.PI * R_nozzle_m ** 4);
  const DeltaP_MPa = DeltaP_Pa * 1e-6;
  const wallShearRatePerS = (4 * Q_m3_s) / (Math.PI * R_nozzle_m ** 3);
  const hydraulicPowerW = DeltaP_Pa * Q_m3_s;

  // 5. Mechanical drive force F_drive = Delta P * A_filament
  const A_filament_m2 = A_filament_mm2 * 1e-6;
  const F_drive_N = DeltaP_Pa * A_filament_m2;

  // 6. Max traction force from pinch rollers before filament grinding/slip
  const F_traction_N = PINCH_FRICTION_COEFF * controls.pinchRollerForceN;

  // 7. Bead aspect ratio w / h
  const beadAspectRatio = controls.roadWidthMm / controls.layerHeightMm;

  // 8. Cooling time constant tau = h^2 / (pi^2 * alpha)
  const coolingTimeConstantSec =
    controls.layerHeightMm ** 2 / (Math.PI * Math.PI * THERMAL_DIFFUSIVITY_MM2_S);
  const temperatureRatio =
    (controls.nozzleTempC - controls.ambientTempC) /
    (CRUMP_FDM_GLASS_TRANSITION_TEMP_C - controls.ambientTempC);
  const timeToGlassTransitionSec =
    temperatureRatio > 1 ? coolingTimeConstantSec * Math.log(temperatureRatio) : 0;

  // 9. Simple equal-effusivity interface-temperature screen. It is not a
  // bond-strength or weld-quality measurement.
  const interfaceTempC = (controls.nozzleTempC + controls.ambientTempC) / 2.0;
  const interfaceTemperatureMarginC = interfaceTempC - CRUMP_FDM_GLASS_TRANSITION_TEMP_C;
  const interfaceAboveGlassTransition = interfaceTemperatureMarginC >= 0;

  const claim1ApparatusPresent = controls.claim1ApparatusEnabled === 1;
  const claim2HeatingMeansPresent =
    claim1ApparatusPresent && controls.claim2HeatingEnabled === 1;
  const claim39PlanarGapPresent =
    claim1ApparatusPresent && controls.claim39PlanarNozzleEnabled === 1;

  // 10. Refusal boundaries
  const coldNozzleJamRefusal = claim2HeatingMeansPresent && controls.nozzleTempC < 160.0;
  const filamentGrindingRefusal = claim2HeatingMeansPresent && F_drive_N > F_traction_N;
  const poorAdhesionRefusal =
    claim39PlanarGapPresent &&
    (!interfaceAboveGlassTransition || controls.layerHeightMm > controls.nozzleDiameterMm * 0.85);

  let refusalReason: string | undefined;
  if (!claim1ApparatusPresent) {
    refusalReason =
      "Claim 1 topology withheld: head, metered discharge, receiving base, and relative X/Y/Z movement are removed from the comparison state.";
  } else if (!claim2HeatingMeansPresent) {
    refusalReason =
      "Claim 2 heating means withheld: this thermoplastic Fig. 5 scenario cannot attribute liquefaction to the patent, while Claim 1 remains the broader fluid-state apparatus combination.";
  } else if (coldNozzleJamRefusal) {
    refusalReason = `Illustrative ABS thermal refusal: nozzle temperature (${controls.nozzleTempC.toFixed(0)} °C) is below this scenario's 160 °C flow-admission threshold.`;
  } else if (filamentGrindingRefusal) {
    refusalReason = `Illustrative traction refusal: axial pressure-force screen (${F_drive_N.toFixed(1)} N) exceeds the declared roller traction limit (${F_traction_N.toFixed(1)} N).`;
  } else if (poorAdhesionRefusal) {
    refusalReason = `Thermal/contact screen refused: interface estimate is ${interfaceTemperatureMarginC.toFixed(0)} °C relative to illustrative ABS Tg or the declared gap exceeds 85% of nozzle diameter; no bond strength is inferred.`;
  }

  const isExtruding =
    claim1ApparatusPresent &&
    claim2HeatingMeansPresent &&
    !coldNozzleJamRefusal &&
    !filamentGrindingRefusal &&
    !poorAdhesionRefusal;

  return {
    volumetricFlowRateMm3S: Q_mm3_s,
    filamentFeedSpeedMmS: v_feed_mm_s,
    apparentViscosityPaS: mu_Pa_s,
    nozzlePressureDropMPa: DeltaP_MPa,
    wallShearRatePerS,
    hydraulicPowerW,
    feedDriveForceN: F_drive_N,
    maxTractionForceN: F_traction_N,
    beadAspectRatio,
    coolingTimeConstantSec,
    timeToGlassTransitionSec,
    interfaceTempC,
    interfaceTemperatureMarginC,
    interfaceAboveGlassTransition,
    claim1ApparatusPresent,
    claim2HeatingMeansPresent,
    claim39PlanarGapPresent,
    isExtruding,
    coldNozzleJamRefusal,
    filamentGrindingRefusal,
    poorAdhesionRefusal,
    refusalReason,
    capillaryOwner: CAPILLARY_OWNER,
    thermalOwner: THERMAL_OWNER,
    capillaryBoundary: CAPILLARY_BOUNDARY,
    thermalBoundary: THERMAL_BOUNDARY,
  };
}
