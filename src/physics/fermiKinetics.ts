/**
 * Chicago Pile-1 (US 2,708,656) multiplication factor.
 * One formula for 2D, 3D, badge, schematic, and spec-clause highlight.
 *
 * Lattice is calibrated so ZIP ~83.5% withdrawn, 99.5% graphite, and
 * natural uranium (0.72%) sit at delayed-critical k_eff ≈ 1.000.
 * The old four-factor product in engine.ts ran ~1.3 at those settings
 * and disagreed with every other surface.
 */

import type { NuclearKineticsState } from "./types";

export function fermiKeff(
  rodWithdrawalPct: number,
  moderatorPurityPct: number,
  fuelEnrichmentPct = 0.72,
): number {
  const rod = Math.min(100, Math.max(0, rodWithdrawalPct));
  const mod = Math.min(100, Math.max(0, moderatorPurityPct));
  const enrich = Math.max(0.01, fuelEnrichmentPct);
  const lattice = 0.85 + (rod / 100) * 0.18 * (mod / 100);
  return Number((lattice * Math.sqrt(enrich / 0.72)).toFixed(4));
}

export function stepFermiKinetics(
  rodWithdrawalPct: number,
  moderatorPurityPct: number,
  fuelEnrichmentPct = 0.72,
): NuclearKineticsState {
  const kEffective = fermiKeff(rodWithdrawalPct, moderatorPurityPct, fuelEnrichmentPct);
  const isSupercritical = kEffective > 1.002;
  const isCritical = kEffective >= 0.998 && kEffective <= 1.002;
  const thermalPowerWatts = isSupercritical
    ? Math.round(500 * (kEffective / 1.002) ** 4)
    : isCritical
      ? 200
      : Math.max(1, Math.round(20 * (kEffective / 0.99)));
  const reactivityDollars = Number(((kEffective - 1.0) / (kEffective * 0.0065)).toFixed(2));
  const reactorPeriodSeconds = reactivityDollars > 0 ? 0.08 / (reactivityDollars * 0.0065) : -999;
  const thermalNeutronFluxNPerCm2S = thermalPowerWatts * 3.2e7;
  const geigerIntervalMs =
    reactorPeriodSeconds > 0
      ? Math.max(50, Math.min(800, Math.round(reactorPeriodSeconds * 20)))
      : 800;

  return {
    kEffective,
    reactivityDollars,
    thermalNeutronFluxNPerCm2S,
    delayedNeutronFractionBeta: 0.0065,
    precursorConcentrationGroup1to6: [0.033, 0.219, 0.196, 0.395, 0.115, 0.042],
    reactorPeriodSeconds,
    thermalPowerWatts,
    controlRodInsertionFraction: 1 - rodWithdrawalPct / 100,
    geigerIntervalMs,
    geigerIntervalS: Number(Math.max(0.05, geigerIntervalMs / 1000).toFixed(3)),
    thermalFluxE7: Number((thermalNeutronFluxNPerCm2S / 1e7).toFixed(1)),
    // Studio neutron scatter: 4 units/s at k=1. Not a physical v_thermal.
    neutronDisplaySpeed: Number((kEffective * 4).toFixed(3)),
    rodStudioY: Number(
      (-0.5 + (Math.min(100, Math.max(0, rodWithdrawalPct)) / 100) * 3.2).toFixed(4),
    ),
    fuelGlowIntensity: Number(Math.max(0, (kEffective - 0.98) * 8).toFixed(3)),
    rodSvgY: Number((30 - (Math.min(100, Math.max(0, rodWithdrawalPct)) / 100) * 120).toFixed(2)),
    schematicRodY: Number(
      (20 + ((100 - Math.min(100, Math.max(0, rodWithdrawalPct))) / 100) * 70).toFixed(2),
    ),
    latticeRows: 5,
    latticeCols: 7,
    latticeOriginX: 80,
    latticeOriginY: 60,
    latticePitchX: 40,
    latticePitchY: 38,
    schematicSlugOriginX: 110,
    schematicSlugOriginY: 90,
    schematicSlugPitchX: 60,
    schematicSlugPitchY: 80,
    schematicSlugCols: 4,
    schematicSlugRows: 2,
    schematicSlugR: 9,
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

/** CP-1 graphite-block SVG seat. Shared by 2D. */
export function fermiLatticeCell(
  row: number,
  col: number,
  originX = 80,
  originY = 60,
  pitchX = 40,
  pitchY = 38,
) {
  return {
    cx: originX + col * pitchX,
    cy: originY + row * pitchY,
  };
}
