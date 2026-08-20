/**
 * src/physics/arkwrightKernel.ts
 *
 * SI Physics Kernel for Richard Arkwright's 1769 Water Frame Cotton Spinning Machine (GB 931).
 *
 * Implements genuine textile mechanics:
 * 1. Multi-stage differential roller draft: D = v_delivery / v_feed = ∏(r_i · ω_i)
 * 2. Staple fiber parallelization kinetics and roving linear density attenuation (English Count Ne & Tex)
 * 3. High-velocity flyer twist kinetics: TPM = RPM / (60 · v_delivery), TPI = TM · √Ne
 * 4. Fiber normal clamping friction and yarn tensile tenacity (warp-grade "water twist")
 * 5. Drag-retarded dead-spindle bobbin differential take-up and cardioid heart-cam traverse
 */

export interface ArkwrightWaterFrameControls {
  /** Water wheel / drum driving speed (RPM, default 180) */
  waterWheelRpm?: number;
  /** Total draft ratio across 4 roller pairs (D = v4 / v1, range 3.0 to 10.0, default 6.0) */
  totalDraftRatio?: number;
  /** Roller clamping deadweight on upper bearings (kg, range 1.0 to 6.0, default 3.5) */
  rollerClampingWeightKg?: number;
  /** Cotton staple fiber length (mm, range 20 to 38, default 28mm American/Levant cotton) */
  stapleLengthMm?: number;
  /** Input cotton roving count (Ne_in, range 0.5 to 2.0, default 1.0) */
  inputRovingCountNe?: number;
  /** Bobbin drag cord friction coefficient (0.1 to 0.5, default 0.25) */
  bobbinDragCoeff?: number;
}

export interface ArkwrightWaterFrameOutputs {
  /** Total draft ratio across all roller pairs */
  totalDraftRatio: number;
  /** Front delivery roller linear velocity (m/min) */
  deliveryVelocityMPerMin: number;
  /** Front delivery roller linear velocity (m/s) */
  deliveryVelocityMPerSec: number;
  /** High-speed flyer spindle rotational speed (RPM) */
  flyerSpindleRpm: number;
  /** Spindle angular velocity (rad/s) */
  spindleOmegaRadPerSec: number;
  /** Great-wheel angular velocity (rad/s) */
  wheelOmegaRadPerS: number;
  /** Feed-roller pair angular velocity (rad/s) */
  feedRollerOmegaRadPerS: number;
  /** Front delivery-roller angular velocity (rad/s) */
  deliveryRollerOmegaRadPerS: number;
  /** Bobbin take-up angular velocity (rad/s) */
  bobbinOmegaRadPerS: number;
  /** Resulting spun yarn English count (Ne = 840 yd/lb) */
  outputYarnCountNe: number;
  /** Yarn linear density in SI Tex (g/1000m) */
  yarnLinearDensityTex: number;
  /** Imparted twist in turns per meter (TPM) */
  twistTurnsPerMeter: number;
  /** Imparted twist in turns per inch (TPI) */
  twistTurnsPerInch: number;
  /** Twist Multiplier (TM = TPI / √Ne) */
  twistMultiplier: number;
  /** Fiber parallelization index (%) */
  fiberParallelizationPct: number;
  /** Single-yarn break tenacity (cN/tex) */
  yarnTenacityCnPerTex: number;
  /** Yarn breaking strength (Newtons, N) */
  yarnBreakingForceN: number;
  /** True "Water Twist" warp suitability (strength > 2.0 N threshold) */
  isWarpGradeWaterTwist: boolean;
  /** Bobbin take-up winding speed (RPM) */
  bobbinRpm: number;
  /** Differential slip speed (ΔRPM = Flyer - Bobbin) */
  bobbinSlipRpm: number;
  /** Heart-cam vertical traverse cycle frequency (Hz) */
  traverseFreqHz: number;
  /** Production rate per 4-spindle frame (grams/hour) */
  productionRateGramsPerHour: number;
  /** Production rate per 96-spindle Cromford Mill water frame (kg/day @ 12hr) */
  millProductionKgPerDay: number;
  /** Yarn delivery length produced per hour (meters/hour) */
  yarnLengthMetersPerHour: number;
}

export const ARKWRIGHT_DEFAULT_CONTROLS: Required<ArkwrightWaterFrameControls> = {
  waterWheelRpm: 180,
  totalDraftRatio: 6.0,
  rollerClampingWeightKg: 3.5,
  stapleLengthMm: 28,
  inputRovingCountNe: 1.0,
  bobbinDragCoeff: 0.25,
};

/**
 * Step the textile drafting, twist kinetics, and production dynamics of Arkwright's 1769 Water Frame.
 */
export function stepArkwrightWaterFrame(
  controls: ArkwrightWaterFrameControls = {},
): ArkwrightWaterFrameOutputs {
  const waterWheelRpm = Math.max(
    40,
    Math.min(300, controls.waterWheelRpm ?? ARKWRIGHT_DEFAULT_CONTROLS.waterWheelRpm),
  );
  const totalDraftRatio = Math.max(
    2.5,
    Math.min(12.0, controls.totalDraftRatio ?? ARKWRIGHT_DEFAULT_CONTROLS.totalDraftRatio),
  );
  const clampingWeightKg = Math.max(
    0.5,
    Math.min(
      8.0,
      controls.rollerClampingWeightKg ?? ARKWRIGHT_DEFAULT_CONTROLS.rollerClampingWeightKg,
    ),
  );
  const stapleLengthMm = Math.max(
    15,
    Math.min(45, controls.stapleLengthMm ?? ARKWRIGHT_DEFAULT_CONTROLS.stapleLengthMm),
  );
  const inputRovingNe = Math.max(
    0.2,
    Math.min(4.0, controls.inputRovingCountNe ?? ARKWRIGHT_DEFAULT_CONTROLS.inputRovingCountNe),
  );
  const dragCoeff = Math.max(
    0.05,
    Math.min(0.8, controls.bobbinDragCoeff ?? ARKWRIGHT_DEFAULT_CONTROLS.bobbinDragCoeff),
  );

  // 1. Transmission kinematics: Great wheel to iron shaft and flyer spindle whorls
  // Transmission gear ratio from main drum to spindle whorl: ~18.5:1
  const flyerSpindleRpm = waterWheelRpm * 18.5;
  const spindleOmegaRadPerSec = (flyerSpindleRpm * 2 * Math.PI) / 60;
  const wheelOmegaRadPerS = (waterWheelRpm * 2 * Math.PI) / 60;

  // 2. Front delivery roller speed (driven through intermediate worm gear and draft train)
  // Roller diameter d_roller = 1 inch = 0.0254 m
  const frontRollerDiameterM = 0.0254;
  // Feed pair is slow; front roller RPM is geared relative to water wheel and drafting train
  const feedRollerRpm = (waterWheelRpm * 0.75) / 4.0;
  const frontRollerRpm = (waterWheelRpm * 0.75 * totalDraftRatio) / 4.0;
  const feedRollerOmegaRadPerS = (feedRollerRpm * 2 * Math.PI) / 60;
  const deliveryRollerOmegaRadPerS = (frontRollerRpm * 2 * Math.PI) / 60;
  const deliveryVelocityMPerMin = Math.PI * frontRollerDiameterM * frontRollerRpm;
  const deliveryVelocityMPerSec = deliveryVelocityMPerMin / 60.0;

  // 3. Yarn count and linear density attenuation via differential drafting
  const outputYarnCountNe = inputRovingNe * totalDraftRatio;
  // Metric Tex = 590.54 / Ne
  const yarnLinearDensityTex = 590.54 / outputYarnCountNe;

  // 4. Imparted flyer twist kinetics
  const twistTurnsPerMeter = flyerSpindleRpm / 60.0 / Math.max(0.001, deliveryVelocityMPerSec);
  const twistTurnsPerInch = twistTurnsPerMeter / 39.3701;
  const twistMultiplier = twistTurnsPerInch / Math.sqrt(outputYarnCountNe);

  // 5. Fiber parallelization & slip-prevention via weighted roller normal clamping force
  // Normal clamping force N = m * g (typically 3.5 kg * 9.81 m/s² = 34.3 N)
  const clampingForceN = clampingWeightKg * 9.80665;
  const slipPenalty = Math.max(0, 1.0 - clampingForceN / 20.0);
  const fiberParallelizationPct = Math.min(
    98.5,
    100 * (1 - Math.exp(-0.48 * totalDraftRatio)) * (1.0 - 0.2 * slipPenalty),
  );

  // 6. Yarn tenacity and tensile breaking force (Water Twist strength law)
  // Fiber inherent tenacity for raw cotton: ~26 cN/tex
  // Imparted twist angle α = arctan(π * d_yarn * TPM)
  const yarnDiameterMm = (0.038 / Math.sqrt(outputYarnCountNe)) * 25.4;
  const twistAngleRad = Math.atan(Math.PI * (yarnDiameterMm / 1000) * twistTurnsPerMeter);
  const cos2Twist = Math.cos(twistAngleRad) ** 2;

  // Cohesion factor increases with Twist Multiplier up to optimal TM ~4.5
  const cohesionFactor = Math.min(1.0, (twistMultiplier / 4.2) ** 1.35);
  const stapleFactor = Math.min(1.15, stapleLengthMm / 28.0);
  const yarnTenacityCnPerTex =
    26.0 * cos2Twist * cohesionFactor * stapleFactor * (fiberParallelizationPct / 100);

  // Total breaking load F = Tenacity (cN/tex) * Tex / 100 (in Newtons)
  const yarnBreakingForceN = (yarnTenacityCnPerTex * yarnLinearDensityTex) / 100.0;
  // Threshold for warp-grade thread on 18th-century looms was ~1.8 N
  const isWarpGradeWaterTwist = yarnBreakingForceN >= 1.8;

  // 7. Bobbin take-up and dead-spindle drag differential
  // Bobbin core diameter = 20 mm = 0.020 m
  const bobbinCoreDiameterM = 0.02;
  const bobbinCircumferenceM = Math.PI * bobbinCoreDiameterM;
  const windingRpmNeeded = deliveryVelocityMPerMin / bobbinCircumferenceM;
  const bobbinRpm = Math.max(0, flyerSpindleRpm - windingRpmNeeded * (1.0 + dragCoeff * 0.1));
  const bobbinSlipRpm = flyerSpindleRpm - bobbinRpm;
  const bobbinOmegaRadPerS = (bobbinRpm * 2 * Math.PI) / 60;

  // 8. Heart-cam traverse motion
  // Worm gear from main shaft drives heart-cam at ~0.08 Hz (1 cycle per 12.5 seconds)
  const traverseFreqHz = (waterWheelRpm / 180.0) * 0.08;

  // 9. Production metrics
  // Mass per spindle per hour = v_delivery (m/hr) * (tex / 1000) g/m
  const singleSpindleGramsPerHour = deliveryVelocityMPerMin * 60 * (yarnLinearDensityTex / 1000);
  const productionRateGramsPerHour = singleSpindleGramsPerHour * 4; // 4-spindle model
  const millProductionKgPerDay = (singleSpindleGramsPerHour * 96 * 12) / 1000.0; // 96-spindle Cromford frame
  const yarnLengthMetersPerHour = deliveryVelocityMPerMin * 60 * 4;

  return {
    totalDraftRatio,
    deliveryVelocityMPerMin,
    deliveryVelocityMPerSec,
    flyerSpindleRpm,
    spindleOmegaRadPerSec,
    wheelOmegaRadPerS,
    feedRollerOmegaRadPerS,
    deliveryRollerOmegaRadPerS,
    bobbinOmegaRadPerS,
    outputYarnCountNe,
    yarnLinearDensityTex,
    twistTurnsPerMeter,
    twistTurnsPerInch,
    twistMultiplier,
    fiberParallelizationPct,
    yarnTenacityCnPerTex,
    yarnBreakingForceN,
    isWarpGradeWaterTwist,
    bobbinRpm,
    bobbinSlipRpm,
    traverseFreqHz,
    productionRateGramsPerHour,
    millProductionKgPerDay,
    yarnLengthMetersPerHour,
  };
}
