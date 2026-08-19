import { describe, expect, test } from "bun:test";
import { fermiKeff, stepFermiKinetics } from "./fermiKinetics";

describe("Enrico Fermi Chicago Pile-1 Nuclear Kinetics Kernel", () => {
  test("fermiKeff computes delayed-critical point near 83.5% rod withdrawal with pure moderator", () => {
    // Critical state: ~83.5% withdrawal, 99.5% graphite purity, 0.72% natural uranium
    const keff = fermiKeff(83.5, 99.5, 0.72);
    expect(keff).toBeGreaterThanOrEqual(0.998);
    expect(keff).toBeLessThanOrEqual(1.002);
  });

  test("subcritical state produces low thermal power and positive period sentinel", () => {
    // Fully inserted control rods (0% withdrawal)
    const sub = stepFermiKinetics(0, 99.5, 0.72);
    expect(sub.kEffective).toBeLessThan(0.9);
    expect(sub.reactivityDollars).toBeLessThan(0);
    expect(sub.thermalPowerWatts).toBeLessThan(50);
    expect(sub.reactorPeriodSeconds).toBe(-999);
  });

  test("prompt supercritical state calculates positive reactivity and exponential period", () => {
    // 95% rod withdrawal
    const superCrit = stepFermiKinetics(95, 99.5, 0.72);
    expect(superCrit.kEffective).toBeGreaterThan(1.01);
    expect(superCrit.reactivityDollars).toBeGreaterThan(1.0);
    expect(superCrit.reactorPeriodSeconds).toBeGreaterThan(0);
    expect(superCrit.thermalPowerWatts).toBeGreaterThan(500);
  });

  test("precursor groups adhere to 6-group delayed neutron kinetics standard", () => {
    const res = stepFermiKinetics(83.5, 99.5, 0.72);
    expect(res.delayedNeutronFractionBeta).toBe(0.0065);
    expect(res.precursorConcentrationGroup1to6.length).toBe(6);
    const sumBeta = res.precursorConcentrationGroup1to6.reduce((a, b) => a + b, 0);
    expect(sumBeta).toBeCloseTo(1.0, 2);
  });
});
