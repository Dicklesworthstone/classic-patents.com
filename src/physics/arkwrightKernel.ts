/**
 * src/physics/arkwrightKernel.ts
 *
 * SI Physics Kernel for Richard Arkwright's 1769 Water Frame Cotton Spinning Machine (GB 931).
 *
 * Implements a declared modern textile-mechanics teaching scenario:
 * 1. Multi-stage differential roller draft: D = v_delivery / v_feed = ∏(r_i · ω_i)
 * 2. Staple fiber parallelization kinetics and roving linear density attenuation (English Count Ne & Tex)
 * 3. High-velocity flyer twist kinetics: TPM = RPM / (60 · v_delivery), TPI = TM · √Ne
 * 4. Fiber normal clamping friction and yarn tensile tenacity (warp-grade "water twist")
 * 5. Drag-retarded dead-spindle bobbin differential take-up and cardioid heart-cam traverse
 */

import type { TapeUpdater } from "./useFrankenSimPhysics";

export const ARKWRIGHT_KERNEL_SOURCE = "source-bounded-ts" as const;
export const ARKWRIGHT_FRANKENSIM_BOUNDARY =
  "fs-mbd::articulated-revolute-and-prismatic-browser-step-unavailable" as const;
export const ARKWRIGHT_SOURCE_BOUNDARY =
  "The pinned GB 931 artifact is a modern reconstruction, not the original enrolled specification or drawing. This exhibit therefore owns only a declared normalized topology and internally consistent differential-speed kinematics. Historical dimensions, gear ratios, spindle speed, clamp mass, material law, yarn strength, output, power, and efficiency remain unavailable; every numeric input and output is a modern teaching scenario." as const;

export interface ArkwrightWaterFrameControls {
  /** Declared wheel / drum driving speed (RPM, default 180) */
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
  /** First intermediate roller-pair angular velocity (rad/s) */
  intermediateRollerOneOmegaRadPerS: number;
  /** Second intermediate roller-pair angular velocity (rad/s) */
  intermediateRollerTwoOmegaRadPerS: number;
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
  /** Whether the declared strength scenario clears its 1.8 N comparison threshold */
  isWarpGradeWaterTwist: boolean;
  /** Bobbin take-up winding speed (RPM) */
  bobbinRpm: number;
  /** Differential slip speed (ΔRPM = Flyer - Bobbin) */
  bobbinSlipRpm: number;
  /** Heart-cam vertical traverse cycle frequency (Hz) */
  traverseFreqHz: number;
  /** Production rate per 4-spindle frame (grams/hour) */
  productionRateGramsPerHour: number;
  /** Scenario output scaled to 96 lanes over 12 hours (kg/day) */
  millProductionKgPerDay: number;
  /** Yarn delivery length produced per hour (meters/hour) */
  yarnLengthMetersPerHour: number;
}

export interface ArkwrightRuntimeControls extends Required<ArkwrightWaterFrameControls> {
  isRunning: boolean;
  resetEpoch: number;
}

export interface ArkwrightKinematicPhases {
  wheelRad: number;
  shaftRad: number;
  feedRollerRad: number;
  intermediateRollerOneRad: number;
  intermediateRollerTwoRad: number;
  deliveryRollerRad: number;
  spindleRad: number;
  bobbinRad: number;
  traverseRad: number;
}

export interface ArkwrightTapeFrame {
  controls: ArkwrightRuntimeControls;
  outputs: ArkwrightWaterFrameOutputs;
  phases: ArkwrightKinematicPhases;
  timeSec: number;
}

export const ARKWRIGHT_DEFAULT_CONTROLS: Required<ArkwrightWaterFrameControls> = {
  waterWheelRpm: 180,
  totalDraftRatio: 6.0,
  rollerClampingWeightKg: 3.5,
  stapleLengthMm: 28,
  inputRovingCountNe: 1.0,
  bobbinDragCoeff: 0.25,
};

export const ARKWRIGHT_ZERO_PHASES: Readonly<ArkwrightKinematicPhases> = Object.freeze({
  wheelRad: 0,
  shaftRad: 0,
  feedRollerRad: 0,
  intermediateRollerOneRad: 0,
  intermediateRollerTwoRad: 0,
  deliveryRollerRad: 0,
  spindleRad: 0,
  bobbinRad: 0,
  traverseRad: 0,
});

let latestArkwrightTapeFrame: ArkwrightTapeFrame | null = null;

export function readArkwrightControls(
  raw: Partial<ArkwrightWaterFrameControls> | Record<string, number | undefined>,
): Required<ArkwrightWaterFrameControls> {
  return {
    waterWheelRpm: Number(raw.waterWheelRpm ?? ARKWRIGHT_DEFAULT_CONTROLS.waterWheelRpm),
    totalDraftRatio: Number(raw.totalDraftRatio ?? ARKWRIGHT_DEFAULT_CONTROLS.totalDraftRatio),
    rollerClampingWeightKg: Number(
      raw.rollerClampingWeightKg ?? ARKWRIGHT_DEFAULT_CONTROLS.rollerClampingWeightKg,
    ),
    stapleLengthMm: Number(raw.stapleLengthMm ?? ARKWRIGHT_DEFAULT_CONTROLS.stapleLengthMm),
    inputRovingCountNe: Number(
      raw.inputRovingCountNe ?? ARKWRIGHT_DEFAULT_CONTROLS.inputRovingCountNe,
    ),
    bobbinDragCoeff: Number(raw.bobbinDragCoeff ?? ARKWRIGHT_DEFAULT_CONTROLS.bobbinDragCoeff),
  };
}

export function readArkwrightRuntimeControls(
  raw: Partial<ArkwrightRuntimeControls> | Record<string, number | boolean | undefined>,
): ArkwrightRuntimeControls {
  return {
    ...readArkwrightControls(raw as Record<string, number | undefined>),
    isRunning:
      typeof raw.isRunning === "boolean" ? raw.isRunning : Number(raw.isRunning ?? 1) > 0.5,
    resetEpoch: Number(raw.resetEpoch ?? 0),
  };
}

export function getArkwrightTapeFrame(): ArkwrightTapeFrame | null {
  return latestArkwrightTapeFrame;
}

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

  // 1. Declared transmission scenario: wheel to shaft and flyer spindle.
  // The 18.5:1 ratio is a teaching input, not a measurement from the pinned artifact.
  const flyerSpindleRpm = waterWheelRpm * 18.5;
  const spindleOmegaRadPerSec = (flyerSpindleRpm * 2 * Math.PI) / 60;
  const wheelOmegaRadPerS = (waterWheelRpm * 2 * Math.PI) / 60;

  // 2. Declared four-pair drafting train. Equal roller diameters and equal
  // geometric ratio increments make the intermediate speeds explicit while
  // preserving D = omega_delivery / omega_feed exactly.
  const frontRollerDiameterM = 0.0254;
  const feedRollerRpm = (waterWheelRpm * 0.75) / 4.0;
  const frontRollerRpm = (waterWheelRpm * 0.75 * totalDraftRatio) / 4.0;
  const feedRollerOmegaRadPerS = (feedRollerRpm * 2 * Math.PI) / 60;
  const draftStageRatio = totalDraftRatio ** (1 / 3);
  const intermediateRollerOneOmegaRadPerS = feedRollerOmegaRadPerS * draftStageRatio;
  const intermediateRollerTwoOmegaRadPerS =
    feedRollerOmegaRadPerS * draftStageRatio * draftStageRatio;
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
  // Declared comparison threshold; the pinned reconstruction supplies no
  // authenticated tensile test or loom-load datum.
  const isWarpGradeWaterTwist = yarnBreakingForceN >= 1.8;

  // 7. Bobbin take-up and dead-spindle drag differential
  // Bobbin core diameter = 20 mm = 0.020 m
  const bobbinCoreDiameterM = 0.02;
  const bobbinCircumferenceM = Math.PI * bobbinCoreDiameterM;
  const windingRpmNeeded = deliveryVelocityMPerMin / bobbinCircumferenceM;
  const bobbinRpm = Math.max(0, flyerSpindleRpm - windingRpmNeeded * (1.0 + dragCoeff * 0.1));
  const bobbinSlipRpm = flyerSpindleRpm - bobbinRpm;
  const bobbinOmegaRadPerS = (bobbinRpm * 2 * Math.PI) / 60;

  // 8. Declared traverse-motion cadence.
  const traverseFreqHz = (waterWheelRpm / 180.0) * 0.08;

  // 9. Production metrics
  // Mass per spindle per hour = v_delivery (m/hr) * (tex / 1000) g/m
  const singleSpindleGramsPerHour = deliveryVelocityMPerMin * 60 * (yarnLinearDensityTex / 1000);
  const productionRateGramsPerHour = singleSpindleGramsPerHour * 4;
  const millProductionKgPerDay = (singleSpindleGramsPerHour * 96 * 12) / 1000.0;
  const yarnLengthMetersPerHour = deliveryVelocityMPerMin * 60 * 4;

  return {
    totalDraftRatio,
    deliveryVelocityMPerMin,
    deliveryVelocityMPerSec,
    flyerSpindleRpm,
    spindleOmegaRadPerSec,
    wheelOmegaRadPerS,
    feedRollerOmegaRadPerS,
    intermediateRollerOneOmegaRadPerS,
    intermediateRollerTwoOmegaRadPerS,
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

/**
 * One fixed-step owner for both visual faces. This integrates prescribed
 * revolute coordinates and the bobbin-rail prismatic phase from the same
 * kinematic outputs; it does not claim an accepted FrankenSim WASM step.
 */
export function createArkwrightTransportUpdater(
  readControls: () => ArkwrightRuntimeControls,
): TapeUpdater {
  const phases: ArkwrightKinematicPhases = { ...ARKWRIGHT_ZERO_PHASES };
  let timeSec = 0;
  let lastResetEpoch: number | null = null;
  let ticksSincePublish = 4;

  return (_previous, dt) => {
    const controls = readControls();
    if (lastResetEpoch !== null && controls.resetEpoch !== lastResetEpoch) {
      Object.assign(phases, ARKWRIGHT_ZERO_PHASES);
      timeSec = 0;
    }
    lastResetEpoch = controls.resetEpoch;
    const outputs = stepArkwrightWaterFrame(controls);

    if (controls.isRunning) {
      timeSec += dt;
      phases.wheelRad += outputs.wheelOmegaRadPerS * dt;
      phases.shaftRad += outputs.wheelOmegaRadPerS * dt;
      phases.feedRollerRad += outputs.feedRollerOmegaRadPerS * dt;
      phases.intermediateRollerOneRad += outputs.intermediateRollerOneOmegaRadPerS * dt;
      phases.intermediateRollerTwoRad += outputs.intermediateRollerTwoOmegaRadPerS * dt;
      phases.deliveryRollerRad += outputs.deliveryRollerOmegaRadPerS * dt;
      phases.spindleRad += outputs.spindleOmegaRadPerSec * dt;
      phases.bobbinRad += outputs.bobbinOmegaRadPerS * dt;
      phases.traverseRad =
        (phases.traverseRad + outputs.traverseFreqHz * 2 * Math.PI * dt) % (2 * Math.PI);
    }

    latestArkwrightTapeFrame = {
      controls,
      outputs,
      phases: { ...phases },
      timeSec,
    };

    ticksSincePublish += 1;
    if (ticksSincePublish < 5) return null;
    ticksSincePublish = 0;
    return {
      machine: {
        poseXMeters: 0,
        poseYMeters: Math.sin(phases.traverseRad) * 0.04,
        headingRad: phases.spindleRad,
        modeLabel: controls.isRunning ? "water-frame prescribed drive" : "water-frame held",
        wheelSpeedMps: outputs.deliveryVelocityMPerSec,
      },
    };
  };
}
