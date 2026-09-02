/**
 * S. Scott Crump — US 5,121,329
 * Apparatus and Method for Creating Three-Dimensional Objects
 * Fused Deposition Modeling (FDM) Computational Physics Kernel
 *
 * Implements genuine fluid flow, nozzle extrusion pressure, filament feed kinematics,
 * thermal cooling solidification, and interlayer weld diffusion.
 */

export interface CrumpFdmControls {
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
  /** Required mechanical axial feed force in N (F_drive) */
  feedDriveForceN: number;
  /** Maximum traction force available before filament stripping in N (F_traction) */
  maxTractionForceN: number;
  /** Extrusion road bead aspect ratio (w / h) */
  beadAspectRatio: number;
  /** Characteristic thermal cooling time constant in seconds (tau) */
  coolingTimeConstantSec: number;
  /** Interlayer contact interface temperature in Celsius (T_interface) */
  interfaceTempC: number;
  /** Interlayer thermal weld bonding quality ratio (T_interface / T_g) */
  weldQualityRatio: number;
  /** Whether the thermoplastic bead is actively extruding and adhering */
  isExtruding: boolean;
  /** Refusal boundaries */
  coldNozzleJamRefusal: boolean;
  filamentGrindingRefusal: boolean;
  poorAdhesionRefusal: boolean;
  refusalReason?: string;
}

export const CRUMP_FDM_DEFAULT_CONTROLS: CrumpFdmControls = {
  nozzleTempC: 225.0, // 225 C standard ABS / investment wax / PLA
  printSpeedMmS: 45.0, // 45 mm/s toolhead traverse speed
  nozzleDiameterMm: 0.4, // 0.4 mm orifice (0.016 inches)
  layerHeightMm: 0.2, // 0.20 mm (200 um) layer step
  roadWidthMm: 0.45, // 0.45 mm flattened road width
  filamentDiameterMm: 1.75, // 1.75 mm standard feedstock filament
  ambientTempC: 25.0, // 25 C room temperature
  referenceViscosityPaS: 280.0, // 280 Pa·s at 230 C
  pinchRollerForceN: 45.0, // 45 N drive roller spring clamping
  buildHeightMm: 12.4, // 12.4 mm current part height
};

// Material thermal constants (ABS thermoplastic)
const GLASS_TRANSITION_TEMP_C = 105.0; // T_g for ABS
const ACTIVATION_ENERGY_KJ_MOL = 48.0; // Arrhenius flow activation energy
const GAS_CONSTANT_R = 8.314e-3; // kJ / (mol · K)
const REF_TEMP_K = 230.0 + 273.15; // 503.15 K
const THERMAL_DIFFUSIVITY_MM2_S = 0.082; // alpha for ABS polymer (8.2e-8 m^2/s)
const NOZZLE_LAND_LENGTH_MM = 1.6; // Capillary length L
const PINCH_FRICTION_COEFF = 0.35; // Friction coefficient between drive roller and filament

export function readCrumpFdmControls(
  params?: Partial<CrumpFdmControls> | Record<string, number | boolean | string | undefined>,
): CrumpFdmControls {
  return {
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
  const L_nozzle_m = NOZZLE_LAND_LENGTH_MM * 1e-3;
  const DeltaP_Pa = (8.0 * mu_Pa_s * L_nozzle_m * Q_m3_s) / (Math.PI * R_nozzle_m ** 4);
  const DeltaP_MPa = DeltaP_Pa * 1e-6;

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

  // 9. Interlayer interface contact temperature
  const interfaceTempC = (controls.nozzleTempC + controls.ambientTempC) / 2.0;
  const weldQualityRatio = interfaceTempC / GLASS_TRANSITION_TEMP_C;

  // 10. Refusal boundaries
  const coldNozzleJamRefusal = controls.nozzleTempC < 160.0;
  const filamentGrindingRefusal = F_drive_N > F_traction_N;
  const poorAdhesionRefusal =
    weldQualityRatio < 0.95 || controls.layerHeightMm > controls.nozzleDiameterMm * 0.85;

  let refusalReason: string | undefined;
  if (coldNozzleJamRefusal) {
    refusalReason = `Thermal Refusal: Nozzle temperature (${controls.nozzleTempC.toFixed(0)} °C) below polymer liquefaction point (160 °C).`;
  } else if (filamentGrindingRefusal) {
    refusalReason = `Kinematic Refusal: Axial feed drive force (${F_drive_N.toFixed(1)} N) exceeds roller traction limit (${F_traction_N.toFixed(1)} N); filament stripping occurred.`;
  } else if (poorAdhesionRefusal) {
    refusalReason = `Interlayer Weld Refusal: Interface contact temperature (${interfaceTempC.toFixed(0)} °C) below Tg (${GLASS_TRANSITION_TEMP_C} °C) or layer height excessive for planar shear flattening.`;
  }

  const isExtruding = !coldNozzleJamRefusal && !filamentGrindingRefusal && !poorAdhesionRefusal;

  return {
    volumetricFlowRateMm3S: Q_mm3_s,
    filamentFeedSpeedMmS: v_feed_mm_s,
    apparentViscosityPaS: mu_Pa_s,
    nozzlePressureDropMPa: DeltaP_MPa,
    feedDriveForceN: F_drive_N,
    maxTractionForceN: F_traction_N,
    beadAspectRatio,
    coolingTimeConstantSec,
    interfaceTempC,
    weldQualityRatio,
    isExtruding,
    coldNozzleJamRefusal,
    filamentGrindingRefusal,
    poorAdhesionRefusal,
    refusalReason,
  };
}
