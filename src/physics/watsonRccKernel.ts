/**
 * US 4,098,001 — Paul C. Watson Remote Center Compliance (RCC) System
 *
 * Mathematical Kernel & Decoupled Compliance Physics
 *
 * Implements the spatial compliance matrix [C], focal-cone flexure geometry,
 * peg-in-hole contact mechanics, and anti-jamming boundary conditions.
 */

export interface WatsonRccControls {
  /** Lateral contact force at peg tip in Newtons (0 to 100 N). */
  lateralContactForceN: number;
  /** External moment applied at peg tip in N*m (-5 to 5 N*m). */
  appliedMomentNm: number;
  /** Forward axial insertion force in Newtons (0 to 500 N). */
  insertionForceN: number;
  /** Peg length from RCC mounting plate in meters (0.05 to 0.25 m). Default 0.15 m. */
  pegLengthM: number;
  /** Initial lateral positional misalignment in mm (0 to 3.0 mm). */
  initialMisalignmentMm: number;
  /** Torsional bellows engaged (boolean). */
  bellowsEngaged: boolean;
  /** Operating mode: 'focal_rcc' | 'uncompensated_wrist' | 'tension_mode'. */
  complianceMode: "focal_rcc" | "uncompensated_wrist" | "tension_mode";
}

export const WATSON_RCC_DEFAULT_CONTROLS: WatsonRccControls = {
  lateralContactForceN: 15.0,
  appliedMomentNm: 0.25,
  insertionForceN: 45.0,
  pegLengthM: 0.15,
  initialMisalignmentMm: 1.2,
  bellowsEngaged: true,
  complianceMode: "focal_rcc",
};

export interface WatsonRccTelemetry {
  /** Lateral tip displacement in mm. */
  tipLateralDisplacementMm: number;
  /** Angular tilt angle in degrees. */
  pegTiltAngleDeg: number;
  /** Effective remote center distance from mounting plate in meters. */
  remoteCenterDistanceM: number;
  /** Lateral compliance C_xx in mm/N. */
  lateralComplianceMmPerN: number;
  /** Angular compliance C_theta in rad/(N*m). */
  angularComplianceRadPerNm: number;
  /** Cross-coupling compliance C_x_theta in mm/(N*m) (0 for ideal RCC). */
  crossCouplingComplianceMmPerNm: number;
  /** Lateral spring stiffness in N/mm. */
  lateralStiffnessNPerMm: number;
  /** Angular spring stiffness in N*m/deg. */
  angularStiffnessNmPerDeg: number;
  /** Torsional stiffness about insertion axis in N*m/deg. */
  torsionalStiffnessNmPerDeg: number;
  /** Jamming index (0 to 1; values >= 1.0 indicate geometric wedging/jamming). */
  jammingIndex: number;
  /** Insertion status: 'smooth_insertion' | 'compliant_correction' | 'jammed_misaligned'. */
  insertionState: "smooth_insertion" | "compliant_correction" | "jammed_misaligned";
  /** Euler column buckling margin for flexures under axial load (ratio). */
  bucklingSafetyFactor: number;
  /** Refusal boundary state. */
  refusal: {
    refused: boolean;
    reason?: string;
  };
}

export function readWatsonRccControls(
  params: Partial<WatsonRccControls> | Record<string, number | string | boolean | undefined> = {},
): WatsonRccControls {
  let mode: WatsonRccControls["complianceMode"] = WATSON_RCC_DEFAULT_CONTROLS.complianceMode;
  if (params.complianceMode === "uncompensated_wrist" || params.complianceMode === 1) {
    mode = "uncompensated_wrist";
  } else if (params.complianceMode === "tension_mode" || params.complianceMode === 2) {
    mode = "tension_mode";
  } else if (params.complianceMode === "focal_rcc" || params.complianceMode === 0) {
    mode = "focal_rcc";
  }

  return {
    lateralContactForceN: Number.isFinite(params.lateralContactForceN)
      ? Math.max(0, Math.min(100, Number(params.lateralContactForceN)))
      : WATSON_RCC_DEFAULT_CONTROLS.lateralContactForceN,
    appliedMomentNm: Number.isFinite(params.appliedMomentNm)
      ? Math.max(-5, Math.min(5, Number(params.appliedMomentNm)))
      : WATSON_RCC_DEFAULT_CONTROLS.appliedMomentNm,
    insertionForceN: Number.isFinite(params.insertionForceN)
      ? Math.max(0, Math.min(500, Number(params.insertionForceN)))
      : WATSON_RCC_DEFAULT_CONTROLS.insertionForceN,
    pegLengthM: Number.isFinite(params.pegLengthM)
      ? Math.max(0.05, Math.min(0.25, Number(params.pegLengthM)))
      : WATSON_RCC_DEFAULT_CONTROLS.pegLengthM,
    initialMisalignmentMm: Number.isFinite(params.initialMisalignmentMm)
      ? Math.max(0, Math.min(3.0, Number(params.initialMisalignmentMm)))
      : WATSON_RCC_DEFAULT_CONTROLS.initialMisalignmentMm,
    bellowsEngaged:
      params.bellowsEngaged !== undefined
        ? Boolean(params.bellowsEngaged)
        : WATSON_RCC_DEFAULT_CONTROLS.bellowsEngaged,
    complianceMode: mode,
  };
}

export function stepWatsonRccSi(controls: WatsonRccControls): WatsonRccTelemetry {
  const {
    lateralContactForceN,
    appliedMomentNm,
    insertionForceN,
    pegLengthM,
    initialMisalignmentMm,
    bellowsEngaged,
    complianceMode,
  } = controls;

  // Refusal limits
  if (lateralContactForceN > 90 || insertionForceN > 450) {
    return {
      tipLateralDisplacementMm: 0,
      pegTiltAngleDeg: 0,
      remoteCenterDistanceM: pegLengthM,
      lateralComplianceMmPerN: 0.4,
      angularComplianceRadPerNm: 0.022,
      crossCouplingComplianceMmPerNm: 0,
      lateralStiffnessNPerMm: 2.5,
      angularStiffnessNmPerDeg: 0.785,
      torsionalStiffnessNmPerDeg: bellowsEngaged ? 6.1 : 0.08,
      jammingIndex: 1.5,
      insertionState: "jammed_misaligned",
      bucklingSafetyFactor: 0.5,
      refusal: {
        refused: true,
        reason:
          "Contact forces exceed flexural yield strength of beryllium copper rods (>90 N lateral or >450 N axial).",
      },
    };
  }

  // Base physical parameters
  // Nominal focal geometry: 3 focal rods at radius R=0.04m, angled toward focal point L_rcc
  const _R_plate = 0.04; // 40 mm radius
  const L_rcc = pegLengthM; // Designed focal length matches held peg length
  const lateralStiffness = 2.5; // N/mm (2500 N/m)
  const lateralCompliance = 1.0 / lateralStiffness; // 0.40 mm/N

  const angularStiffness = 45.0; // N*m/rad
  const angularCompliance = 1.0 / angularStiffness; // 0.0222 rad/(N*m)
  const angularStiffnessDeg = (angularStiffness * Math.PI) / 180; // ~0.785 N*m/deg

  const torsionalStiffnessNmPerDeg = bellowsEngaged ? 6.1 : 0.08; // N*m/deg

  let crossCouplingCompliance = 0; // mm/(N*m)
  let effectiveL_rcc = L_rcc;

  if (complianceMode === "uncompensated_wrist") {
    // Uncompensated flexible wrist: elastic center is at the wrist plate (z=0)
    // Cross-coupling: a lateral force at tip z=L produces moment M = F * L, causing tilt
    crossCouplingCompliance = pegLengthM * 1000 * angularCompliance; // ~3.33 mm/(N*m)
    effectiveL_rcc = 0.0;
  } else if (complianceMode === "tension_mode") {
    // Tension mode RCC: focal rods under tension, slight geometric stiffening
    effectiveL_rcc = L_rcc * 1.02;
    crossCouplingCompliance = 0.01;
  } else {
    // Ideal Focal RCC
    crossCouplingCompliance = 0.0;
    effectiveL_rcc = L_rcc;
  }

  // Compliance matrix deflection at the tip:
  // delta_x = C_xx * F_x + C_x_theta * M_y
  // theta_y = C_theta_x * F_x + C_theta_theta * M_y
  let tipLateralDisplacementMm = 0;
  let pegTiltRad = 0;

  if (complianceMode === "uncompensated_wrist") {
    // Lateral force at tip produces wrist rotation that moves tip FURTHER laterally
    const wristTiltRad = (lateralContactForceN * pegLengthM + appliedMomentNm) * angularCompliance;
    pegTiltRad = wristTiltRad;
    tipLateralDisplacementMm =
      lateralContactForceN * lateralCompliance + wristTiltRad * pegLengthM * 1000;
  } else {
    // Decoupled RCC: pure translation from force, pure tilt from moment
    tipLateralDisplacementMm =
      lateralContactForceN * lateralCompliance + appliedMomentNm * crossCouplingCompliance;
    pegTiltRad = appliedMomentNm * angularCompliance;
  }

  const pegTiltAngleDeg = (pegTiltRad * 180) / Math.PI;

  // Jamming Index computation:
  // Clearance c = 25 microns (0.025 mm), peg diameter d = 12 mm, friction mu = 0.15
  // Wedging occurs if tilt angle exceeds 2c / d = 0.05 / 12 = 0.00417 rad = 0.239 deg
  const clearanceMm = 0.025;
  const pegDiameterMm = 12.0;
  const criticalTiltDeg = ((2 * clearanceMm) / pegDiameterMm) * (180 / Math.PI); // ~0.24 deg

  // In uncompensated wrist mode, lateral force immediately creates fatal tilt
  let jammingIndex = 0;
  if (complianceMode === "uncompensated_wrist") {
    jammingIndex = (pegTiltAngleDeg / criticalTiltDeg) * 1.8 + initialMisalignmentMm * 0.5;
  } else {
    // In RCC mode, tip translates into alignment without tilting, so jamming is avoided!
    jammingIndex =
      (Math.abs(pegTiltAngleDeg) / criticalTiltDeg) * 0.15 +
      Math.max(0, initialMisalignmentMm - tipLateralDisplacementMm) * 0.2;
  }

  let insertionState: WatsonRccTelemetry["insertionState"] = "smooth_insertion";
  if (jammingIndex >= 1.0) {
    insertionState = "jammed_misaligned";
  } else if (jammingIndex > 0.35 || initialMisalignmentMm > 0.5) {
    insertionState = "compliant_correction";
  } else {
    insertionState = "smooth_insertion";
  }

  // Euler column buckling safety factor under axial insertion force
  // P_crit = pi^2 * E * I / (K * L)^2 for 3 flexure rods in parallel
  const P_crit_rod = complianceMode === "tension_mode" ? 1200 : 280; // N per rod
  const P_crit_total = 3 * P_crit_rod;
  const bucklingSafetyFactor = P_crit_total / Math.max(1, insertionForceN);

  return {
    tipLateralDisplacementMm,
    pegTiltAngleDeg,
    remoteCenterDistanceM: effectiveL_rcc,
    lateralComplianceMmPerN: lateralCompliance,
    angularComplianceRadPerNm: angularCompliance,
    crossCouplingComplianceMmPerNm: crossCouplingCompliance,
    lateralStiffnessNPerMm: lateralStiffness,
    angularStiffnessNmPerDeg: angularStiffnessDeg,
    torsionalStiffnessNmPerDeg,
    jammingIndex: Math.min(2.0, Math.max(0, jammingIndex)),
    insertionState,
    bucklingSafetyFactor: Math.min(20, bucklingSafetyFactor),
    refusal: {
      refused: false,
    },
  };
}
