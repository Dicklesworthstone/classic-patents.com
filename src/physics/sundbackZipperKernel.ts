/**
 * sundbackZipperKernel.ts
 *
 * Authentic SI Computational Physics Kernel for Gideon Sundback's 1917 Separable Fastener (US Patent 1,219,881).
 *
 * Models:
 * 1. Y-slider cam wedge kinematics: normal force resolution on scoops during closing.
 * 2. Alternating scoop nesting mechanics with staggered half-pitch phase shift.
 * 3. Transverse flexibility & bending resistance without unmeshing.
 * 4. Lateral burst resistance and corded tape tensile retention under lateral load.
 * 5. Claim 1 alignment probe (staggered vs unstaggered tooth collision).
 */

export interface SundbackZipperControls {
  sliderPositionPct: number; // 0 (open) to 100 (closed)
  pullForceN: number; // 0 to 50 N pull force applied to slider pull tab
  lateralTensionN: number; // 0 to 200 N transverse load across closed stringers
  flexAngleDeg: number; // 0 to 180 degrees transverse bending / folding angle
  toothDensityTpi: number; // 8 to 14 teeth per inch (standard 11 TPI)
  staggerAligned: boolean; // Claim 1 probe: true for half-pitch stagger, false for collision
}

export interface SundbackZipperTelemetry {
  engagedTeeth: number;
  totalTeeth: number;
  engagementFraction: number; // 0 to 1
  sliderPosMm: number; // slider displacement in mm
  sliderVelocityMmS: number;
  wedgeNormalForceN: number;
  burstResistanceN: number;
  tapeStrainPct: number;
  toothPitchMm: number;
  camWedgeAngleDeg: number;
  isLocked: boolean;
  isStalled: boolean;
  burstRefusal: boolean;
  refusalReason?: string;
  provenance: "TS_FALLBACK" | "WASM";
}

export const SUNDBACK_ZIPPER_DEFAULT_CONTROLS: SundbackZipperControls = {
  sliderPositionPct: 65,
  pullForceN: 15,
  lateralTensionN: 40,
  flexAngleDeg: 25,
  toothDensityTpi: 11,
  staggerAligned: true,
};

export const ZIPPER_CHAIN_LENGTH_MM = 150; // 150 mm standard jacket/boot fastener
export const CAM_WEDGE_HALF_ANGLE_DEG = 18.0; // Y-channel convergence angle
export const TOOTH_SHEAR_AREA_MM2 = 1.45; // Contact shear shoulder area per scoop
export const BRASS_SHEAR_STRENGTH_MPA = 220; // Stamped cartridge brass shear limit
export const CORD_ELASTIC_MODULUS_N = 850; // Braided cotton cord longitudinal stiffness

export function stepSundbackZipperSi(
  controls: SundbackZipperControls,
  _dt: number = 1 / 60,
): SundbackZipperTelemetry {
  const tpi = Math.max(8, Math.min(14, controls.toothDensityTpi));
  const toothPitchMm = 25.4 / tpi; // ~2.31 mm at 11 TPI
  const totalTeeth = Math.round(ZIPPER_CHAIN_LENGTH_MM / toothPitchMm);

  const posPct = Math.max(0, Math.min(100, controls.sliderPositionPct));
  const sliderPosMm = (posPct / 100) * ZIPPER_CHAIN_LENGTH_MM;
  const engagementFraction = posPct / 100;

  // If stagger alignment is broken (Claim 1 probe), teeth jam at slider throat
  let effectiveEngagement = engagementFraction;
  let isStalled = false;
  let burstRefusal = false;
  let refusalReason: string | undefined;

  if (!controls.staggerAligned) {
    // Teeth collide head-to-head rather than nesting
    effectiveEngagement = Math.min(0.15, engagementFraction);
    isStalled = true;
    refusalReason = "Tooth collision: opposing scoops lack half-pitch stagger (Claim 1 violation).";
  }

  const engagedTeeth = Math.round(effectiveEngagement * totalTeeth);

  // Wedge normal force resolution: F_n = F_pull / (2 * sin(theta_wedge))
  const thetaRad = (CAM_WEDGE_HALF_ANGLE_DEG * Math.PI) / 180;
  const pullForce = Math.max(0, Math.min(50, controls.pullForceN));
  const frictionCoeff = 0.18; // brass on brass dry friction
  const wedgeNormalForceN = pullForce / (2 * Math.sin(thetaRad) + frictionCoeff);

  // Slider velocity: v = F_pull / (damping + friction)
  const sliderVelocityMmS = isStalled ? 0 : (pullForce / (0.05 + frictionCoeff * 2)) * 0.8;

  // Burst resistance across engaged chain: F_burst = 2 * N_engaged * A_shear * tau_max * cos(flex_penalty)
  const flexPenalty = Math.max(0.65, Math.cos((controls.flexAngleDeg * Math.PI) / 360));
  const singleToothBurstN = TOOTH_SHEAR_AREA_MM2 * BRASS_SHEAR_STRENGTH_MPA * 0.08 * flexPenalty;
  const burstResistanceN = engagedTeeth > 0 ? engagedTeeth * singleToothBurstN : 0;

  // Check lateral tension against burst strength
  const lateralLoad = Math.max(0, controls.lateralTensionN);
  if (engagedTeeth > 0 && lateralLoad > burstResistanceN) {
    burstRefusal = true;
    refusalReason = `Chain rupture: lateral tension (${lateralLoad.toFixed(1)} N) exceeds burst limit (${burstResistanceN.toFixed(1)} N).`;
  }

  // Corded tape tensile strain
  const tapeStrainPct = Math.min(12, (lateralLoad / (CORD_ELASTIC_MODULUS_N * 2)) * 100);
  const isLocked = engagedTeeth > 2 && !isStalled && !burstRefusal;

  return {
    engagedTeeth,
    totalTeeth,
    engagementFraction,
    sliderPosMm,
    sliderVelocityMmS,
    wedgeNormalForceN,
    burstResistanceN,
    tapeStrainPct,
    toothPitchMm,
    camWedgeAngleDeg: CAM_WEDGE_HALF_ANGLE_DEG * 2,
    isLocked,
    isStalled,
    burstRefusal,
    refusalReason,
    provenance: "TS_FALLBACK",
  };
}

export function readSundbackZipperControls(
  params: Record<string, number | boolean>,
): SundbackZipperControls {
  return {
    sliderPositionPct:
      typeof params.sliderPositionPct === "number"
        ? params.sliderPositionPct
        : ((params.sliderPosition as number) ?? SUNDBACK_ZIPPER_DEFAULT_CONTROLS.sliderPositionPct),
    pullForceN:
      typeof params.pullForceN === "number"
        ? params.pullForceN
        : ((params.pullForce as number) ?? SUNDBACK_ZIPPER_DEFAULT_CONTROLS.pullForceN),
    lateralTensionN:
      typeof params.lateralTensionN === "number"
        ? params.lateralTensionN
        : ((params.lateralTension as number) ?? SUNDBACK_ZIPPER_DEFAULT_CONTROLS.lateralTensionN),
    flexAngleDeg:
      typeof params.flexAngleDeg === "number"
        ? params.flexAngleDeg
        : ((params.flexAngle as number) ?? SUNDBACK_ZIPPER_DEFAULT_CONTROLS.flexAngleDeg),
    toothDensityTpi:
      typeof params.toothDensityTpi === "number"
        ? params.toothDensityTpi
        : ((params.toothDensity as number) ?? SUNDBACK_ZIPPER_DEFAULT_CONTROLS.toothDensityTpi),
    staggerAligned:
      typeof params.staggerAligned === "boolean"
        ? params.staggerAligned
        : ((params.stagger as boolean) ?? SUNDBACK_ZIPPER_DEFAULT_CONTROLS.staggerAligned),
  };
}
