/**
 * Source-bounded teaching step for Bardeen and Brattain's US 2,524,035.
 *
 * The patent reports three operating samples and describes a preferred
 * emitter/collector separation of 1 to 10 mils. This module keeps those
 * reported measurements distinct from derived display geometry. It does not
 * invent carrier lifetime, transit time, universal current gain, or a later
 * Bell Labs prototype fixture.
 */

export const BARDEEN_CARRIER_WRAP_PAD = 0.1;
export const BARDEEN_CARRIER_RESET_PAD = 0.05;

export type BardeenOperatingSampleNumber = 1 | 2 | 3;

export interface BardeenOperatingSample {
  readonly number: BardeenOperatingSampleNumber;
  readonly inputResistanceOhms: number;
  readonly outputResistanceOhms: number;
  readonly inputVoltageVrms: number;
  readonly outputVoltageVrms: number;
  readonly inputPowerWatts: number;
  readonly outputPowerWatts: number;
  readonly voltageGainFactor: number;
  readonly powerGainFactor: number;
  readonly emitterBiasVolts: number;
  readonly collectorBiasVolts: number;
  readonly sourceStatedCurrentGain: number | null;
}

export const BARDEEN_REPORTED_SAMPLES: Readonly<
  Record<BardeenOperatingSampleNumber, BardeenOperatingSample>
> = {
  1: {
    number: 1,
    inputResistanceOhms: 640,
    outputResistanceOhms: 30_000,
    inputVoltageVrms: 0.29,
    outputVoltageVrms: 18,
    inputPowerWatts: 1.3e-4,
    outputPowerWatts: 100e-4,
    voltageGainFactor: 62,
    powerGainFactor: 80,
    emitterBiasVolts: 0.2,
    collectorBiasVolts: -40,
    // The specification explicitly calculates 80 / 62 as 1.3 for Sample 1.
    sourceStatedCurrentGain: 1.3,
  },
  2: {
    number: 2,
    inputResistanceOhms: 500,
    outputResistanceOhms: 30_000,
    inputVoltageVrms: 0.3,
    outputVoltageVrms: 15,
    inputPowerWatts: 1.8e-4,
    outputPowerWatts: 75e-4,
    voltageGainFactor: 50,
    powerGainFactor: 42,
    emitterBiasVolts: 0.25,
    collectorBiasVolts: -20,
    sourceStatedCurrentGain: null,
  },
  3: {
    number: 3,
    inputResistanceOhms: 1_000,
    outputResistanceOhms: 30_000,
    inputVoltageVrms: 0.1,
    outputVoltageVrms: 3.6,
    inputPowerWatts: 1.15e-5,
    outputPowerWatts: 42.5e-5,
    voltageGainFactor: 36,
    powerGainFactor: 36,
    emitterBiasVolts: 0.2,
    collectorBiasVolts: -10,
    sourceStatedCurrentGain: null,
  },
};

export interface BardeenPointContactControls {
  readonly operatingSample?: number;
  readonly pointSpacingMils?: number;
  readonly claim1Active?: boolean;
}

export interface BardeenPointContactState {
  readonly sample: BardeenOperatingSample;
  readonly pointSpacingMils: number;
  readonly pointSpacingMicrometers: number;
  readonly withinPreferredSpacing: boolean;
  readonly claim1Active: boolean;
  readonly collectorCollectionActive: boolean;
  readonly fieldExampleVolts: 10;
  readonly believedLayerBarrierThicknessCm: 0.0001;
  readonly fieldOrderVoltsPerCm: number;
  readonly fieldEstimateQualified: true;
  readonly gapStudioUnits: number;
  readonly pointGapSvgPx: number;
  readonly carrierDisplaySpeed: number;
  readonly carrierStreamCount: number;
  readonly kernelSource: "source-bounded-ts";
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function sampleNumber(value: number | undefined): BardeenOperatingSampleNumber {
  const rounded = Math.round(value ?? 1);
  if (rounded <= 1) return 1;
  if (rounded >= 3) return 3;
  return 2;
}

export function stepBardeenPointContact(
  controls: BardeenPointContactControls = {},
): BardeenPointContactState {
  const sample = BARDEEN_REPORTED_SAMPLES[sampleNumber(controls.operatingSample)];
  const pointSpacingMils = clamp(controls.pointSpacingMils ?? 2, 1, 10);
  const claim1Active = controls.claim1Active ?? true;

  return {
    sample,
    pointSpacingMils,
    pointSpacingMicrometers: Number((pointSpacingMils * 25.4).toFixed(1)),
    withinPreferredSpacing: pointSpacingMils >= 1 && pointSpacingMils <= 10,
    claim1Active,
    collectorCollectionActive: claim1Active,
    // Preserve the source's own qualified example instead of assuming that an
    // entire Table I bias falls across a known barrier thickness.
    fieldExampleVolts: 10,
    believedLayerBarrierThicknessCm: 1e-4,
    fieldOrderVoltsPerCm: 1e5,
    fieldEstimateQualified: true,
    // These two fields are presentation mappings, not physical scale claims.
    gapStudioUnits: Number((0.38 + pointSpacingMils * 0.115).toFixed(3)),
    pointGapSvgPx: Number((18 + pointSpacingMils * 4.2).toFixed(1)),
    // Constant illustrative phase rate. Varying this with collector bias would
    // imply a transport law that the facsimile does not report.
    carrierDisplaySpeed: claim1Active ? 0.55 : 0,
    carrierStreamCount: claim1Active ? 18 : 0,
    kernelSource: "source-bounded-ts",
  };
}

export function bardeenCarrierPath(
  index: number,
  pointGapSvgPx: number,
  count = 18,
  centerX = 300,
  baseY = 170,
  arcHeightPx = 24,
) {
  const fraction = index / Math.max(1, count - 1);
  return {
    cx: Number((centerX - pointGapSvgPx + fraction * pointGapSvgPx * 2).toFixed(2)),
    cy: Number((baseY + Math.sin(fraction * Math.PI) * arcHeightPx).toFixed(2)),
  };
}

export function bardeenSchematicGeometry(controls: BardeenPointContactControls = {}) {
  const state = stepBardeenPointContact(controls);
  const centerX = 200;
  const contactHalfGap = 18 + state.pointSpacingMils * 2.2;
  return {
    state,
    block: { x: 95, y: 145, width: 210, height: 78 },
    baseFilm: { x: 100, y: 218, width: 200, height: 7 },
    surfaceLayer: { x: 100, y: 145, width: 200, height: 6 },
    barrier: { x: 100, y: 151, width: 200, height: 5 },
    emitter: {
      x1: centerX - contactHalfGap - 24,
      y1: 70,
      x2: centerX - contactHalfGap,
      y2: 145,
    },
    collector: {
      x1: centerX + contactHalfGap + 24,
      y1: 70,
      x2: centerX + contactHalfGap,
      y2: 145,
    },
    contactRadius: 4,
  };
}
