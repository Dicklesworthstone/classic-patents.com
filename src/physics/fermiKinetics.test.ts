import { describe, expect, test } from "bun:test";
import {
  FERMI_KINETICS_SOURCE_BOUNDARY,
  fermiKeff,
  fermiLatticeCell,
  fermiSchematicSlug,
  NATURAL_URANIUM_U235_PERCENT,
  stepFermiKinetics,
} from "./fermiKinetics";

describe("US 2,708,656 source-bounded lattice and normalized absorber kernel", () => {
  test("places the declared default absorber lens near unity without claiming source calibration", () => {
    const keff = fermiKeff(83.5, 99.5, 0.72);
    expect(keff).toBeGreaterThanOrEqual(0.998);
    expect(keff).toBeLessThanOrEqual(1.002);
    expect(FERMI_KINETICS_SOURCE_BOUNDARY).toContain("does not calibrate absorber worth");
    expect(FERMI_KINETICS_SOURCE_BOUNDARY).toContain("closed energy accounting are refused");
  });

  test("keeps unsupported reactivity, power, flux, detector rate, and period explicitly unavailable", () => {
    const sub = stepFermiKinetics(0, 99.5, 0.72);
    expect(sub.kEffective).toBeLessThan(1);
    expect(sub.quantitativeTransientAvailable).toBe(false);
    expect(sub.reactivityDollars).toBe(0);
    expect(sub.thermalPowerWatts).toBe(0);
    expect(sub.thermalNeutronFluxNPerCm2S).toBe(0);
    expect(sub.geigerIntervalMs).toBe(0);
    expect(sub.geigerIntervalS).toBe(0);
    expect(sub.reactorPeriodSeconds).toBe(0);
  });

  test("moves the normalized multiplication lens monotonically without inventing a transient", () => {
    const superCrit = stepFermiKinetics(95, 99.5, 0.72);
    expect(superCrit.kEffective).toBeGreaterThan(1.002);
    expect(superCrit.reactivityDollars).toBe(0);
    expect(superCrit.reactorPeriodSeconds).toBe(0);
    expect(superCrit.thermalPowerWatts).toBe(0);
  });

  test("uses only the delayed-neutron fact printed by the grant and keeps schematic seats stable", () => {
    const res = stepFermiKinetics(83.5, 99.5, 0.72);
    expect(res.delayedNeutronFractionBeta).toBe(0.01);
    expect(res.precursorConcentrationGroup1to6).toEqual([]);
    expect(res.delayedNeutronMeanDelaySeconds).toBe(5);
    expect(res.quantitativeTransientAvailable).toBe(false);
    expect(res.naturalUraniumU235Percent).toBe(NATURAL_URANIUM_U235_PERCENT);
    expect(res.claim1PathActive).toBe(true);
    expect(res.latticeRows).toBe(5);
    expect(res.latticeCols).toBe(7);
    expect(fermiLatticeCell(0, 0).cx).toBe(80);
    expect(fermiLatticeCell(0, 1).cx).toBe(120);
    expect(res.latticeCellW).toBe(30);
    expect(res.latticeSlugR).toBe(5);
    expect(fermiLatticeCell(0, 0).x).toBe(65);
    expect(fermiLatticeCell(0, 0).y).toBe(46);
    expect(res.schematicSlugCols).toBe(4);
    expect(fermiSchematicSlug(0, 0).cx).toBe(110);
    expect(fermiSchematicSlug(1, 1).cy).toBe(170);
    expect(res.schematicGridXs).toEqual([140, 200, 260]);
    expect(res.schematicGridYs).toEqual([110, 150, 190]);
  });

  test("does not let an enrichment argument silently change Claim 1's natural-uranium basis", () => {
    expect(fermiKeff(83.5, 99.5, 0.72)).toBe(fermiKeff(83.5, 99.5, 20));
    expect(stepFermiKinetics(83.5, 99.5, 20).naturalUraniumU235Percent).toBe(0.72);
  });

  test("Claim 1 inversion removes the chain-reacting path instead of creating a power excursion", () => {
    const removed = stepFermiKinetics(99.5, 99.5, 0.72, false);
    expect(removed.claim1PathActive).toBe(false);
    expect(removed.kEffective).toBe(0);
    expect(removed.neutronDisplaySpeed).toBe(0);
    expect(removed.fuelGlowIntensity).toBe(0);
    expect(removed.thermalPowerWatts).toBe(0);
  });

  test("clamps out-of-range controls and falls back from non-finite input", () => {
    expect(stepFermiKinetics(Number.NaN, Number.POSITIVE_INFINITY).kEffective).toBe(
      stepFermiKinetics(83.5, 99.5).kEffective,
    );
    expect(stepFermiKinetics(-10, 120).controlRodInsertionFraction).toBe(1);
    expect(stepFermiKinetics(120, -10).controlRodInsertionFraction).toBe(0);
    expect(stepFermiKinetics(50, -10).moderatorPurityPercent).toBe(0);
  });
});
