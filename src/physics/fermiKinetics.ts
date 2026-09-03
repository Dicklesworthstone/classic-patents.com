/**
 * Source-bounded US 2,708,656 lattice reader and normalized absorber lens.
 *
 * The grant owns the graphite/natural-uranium topology, Figure 3 K contours,
 * an illustrative bare operating ratio near 1.005, and the instruction to
 * insert absorber until the reproduction ratio is unity. It does not publish
 * the rod-worth curve, flux normalization, or full point-kinetics constants
 * needed to turn a UI rod position into a predictive reactor transient.
 */

import type { NuclearKineticsState } from "./types";

export const FERMI_KINETICS_SOURCE_BOUNDARY =
  "US 2,708,656 discloses the graphite and natural-uranium rod lattice, Figure 3 criticality contours, and absorber-control principle. It does not calibrate absorber worth against travel, neutron flux, detector count rate, or a complete transient model. The live rod position and k_eff are therefore an explicitly normalized teaching lens; quantitative power, flux, detector rate, and closed energy accounting are refused.";

export const NATURAL_URANIUM_U235_PERCENT = 0.72;

function finiteOr(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function fermiKeff(
  rodWithdrawalPct: number,
  _moderatorPurityPct: number,
  _fuelEnrichmentPct = NATURAL_URANIUM_U235_PERCENT,
): number {
  const rod = clamp(finiteOr(rodWithdrawalPct, 83.5), 0, 100);
  // Normalized, not a source calibration: the patent's illustrative 1.005
  // bare ratio is reduced by an explicitly declared 0.030 full-stroke
  // absorber span, placing the default 83.5% teaching position at unity.
  const normalizedFullStrokeWorth = 0.03;
  const bareIllustrativeRatio = 1.005;
  return Number((bareIllustrativeRatio - (1 - rod / 100) * normalizedFullStrokeWorth).toFixed(4));
}

export function stepFermiKinetics(
  rodWithdrawalPct: number,
  moderatorPurityPct: number,
  _fuelEnrichmentPct = NATURAL_URANIUM_U235_PERCENT,
  claim1Active = true,
): NuclearKineticsState {
  const rod = clamp(finiteOr(rodWithdrawalPct, 83.5), 0, 100);
  const moderatorPurity = clamp(finiteOr(moderatorPurityPct, 99.5), 0, 100);
  // Claim 1 is limited to natural uranium. A caller cannot silently turn this
  // patent exhibit into an enriched-fuel reactor by changing a UI parameter.
  const naturalUraniumPercent = NATURAL_URANIUM_U235_PERCENT;
  const kEffective = claim1Active ? fermiKeff(rod, moderatorPurity, naturalUraniumPercent) : 0;
  // Approximately one percent delayed neutrons and a mean delay near five
  // seconds are printed in the grant. A six-group fit is not printed, so the
  // source-bounded state retains one normalized delayed population only.
  const delayedNeutronFractionBeta = 0.01;
  // Rod worth is not calibrated, so dollar reactivity and reactor period are
  // unavailable too. Zero is the typed refusal value; the availability flag
  // prevents a caller from presenting it as a computed result.
  const reactivityDollars = 0;
  const reactorPeriodSeconds = 0;
  const thermalPowerWatts = 0;
  const thermalNeutronFluxNPerCm2S = 0;
  const geigerIntervalMs = 0;

  return {
    kEffective,
    reactivityDollars,
    thermalNeutronFluxNPerCm2S,
    delayedNeutronFractionBeta,
    precursorConcentrationGroup1to6: [],
    delayedNeutronMeanDelaySeconds: 5,
    quantitativeTransientAvailable: false,
    reactorPeriodSeconds,
    thermalPowerWatts,
    controlRodInsertionFraction: 1 - rod / 100,
    geigerIntervalMs,
    geigerIntervalS: 0,
    thermalFluxE7: 0,
    // Studio neutron scatter: 4 units/s at k=1. Not a physical v_thermal.
    neutronDisplaySpeed: claim1Active ? Number((Math.max(0, kEffective) * 4).toFixed(3)) : 0,
    // A 5.8-unit rod spans the modeled graphite core at zero withdrawal and
    // clears its right face at 100%. This coordinate is consumed directly by
    // the Three.js model rather than recomputed in the presentation layer.
    rodStudioX: Number(((rod / 100) * 5.8).toFixed(4)),
    fuelGlowIntensity: claim1Active ? Number(Math.max(0, (kEffective - 0.98) * 8).toFixed(3)) : 0,
    schematicRodY: 145,
    latticeRows: 5,
    latticeCols: 7,
    latticeOriginX: 80,
    latticeOriginY: 60,
    latticePitchX: 40,
    latticePitchY: 38,
    latticeCellPadX: 15,
    latticeCellPadY: 14,
    latticeCellW: 30,
    latticeCellH: 28,
    latticeSlugR: 5,
    schematicSlugOriginX: 110,
    schematicSlugOriginY: 90,
    schematicSlugPitchX: 60,
    schematicSlugPitchY: 80,
    schematicSlugCols: 4,
    schematicSlugRows: 2,
    schematicSlugR: 9,
    schematicGridXs: [140, 200, 260],
    schematicGridYs: [110, 150, 190],
    schematicCoreX0: 80,
    schematicCoreX1: 320,
    schematicCoreY0: 70,
    schematicCoreY1: 240,
    schematicCoreW: 240,
    schematicCoreH: 170,
    schematicRodX: Number((80 + (rod / 100) * 220).toFixed(2)),
    schematicRodW: 240,
    schematicRodH: 10,
    claim1PathActive: claim1Active,
    naturalUraniumU235Percent: naturalUraniumPercent,
    moderatorPurityPercent: moderatorPurity,
    sourceBoundary: FERMI_KINETICS_SOURCE_BOUNDARY,
  };
}

/** Fuel-slug seat on the schematic lattice. Shared by the schematic. */
export function fermiSchematicSlug(
  col: number,
  row: number,
  originX = 110,
  originY = 90,
  pitchX = 60,
  pitchY = 80,
) {
  return {
    cx: originX + col * pitchX,
    cy: originY + row * pitchY,
  };
}

/** Graphite-block SVG seat shared by the source-bounded 2D lattice view. */
export function fermiLatticeCell(
  row: number,
  col: number,
  originX = 80,
  originY = 60,
  pitchX = 40,
  pitchY = 38,
  padX = 15,
  padY = 14,
  w = 30,
  h = 28,
  slugR = 5,
) {
  const cx = originX + col * pitchX;
  const cy = originY + row * pitchY;
  return {
    cx,
    cy,
    x: cx - padX,
    y: cy - padY,
    w,
    h,
    slugR,
  };
}
