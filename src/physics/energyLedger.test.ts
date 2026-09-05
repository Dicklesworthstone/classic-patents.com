import { describe, expect, test } from "bun:test";
import { computePortHamiltonianEnergy, measureSteadyPowerBalance } from "./energyLedger";
import { WRIGHT_GROSS_WEIGHT_N } from "./wrightKernel";

describe("Energy readouts distinguish partial, steady and unavailable evidence", () => {
  test("Wright kinetic energy follows the canonical mph control and declared mass", () => {
    const slow = computePortHamiltonianEnergy("us-821393-wright-flyer", { airspeed: 28 });
    const fast = computePortHamiltonianEnergy("us-821393-wright-flyer", { airspeed: 40 });
    for (const [report, mph] of [
      [slow, 28],
      [fast, 40],
    ] as const) {
      expect(report.availability).toBe("kernel-partial");
      expect(report.energy.kineticJoules).toBeCloseTo(
        0.5 * (WRIGHT_GROSS_WEIGHT_N / 9.80665) * (mph * 0.44704) ** 2,
        2,
      );
      expect(report.inputPowerAvailable).toBe(false);
      expect(report.balance.kind).toBe("unavailable");
      expect(report.dissipatedPowerWatts).toBeGreaterThan(0);
    }
    expect(fast.energy.kineticJoules).toBeGreaterThan(slow.energy.kineticJoules);
    expect(fast.dissipatedPowerWatts).toBeGreaterThan(slow.dissipatedPowerWatts);
    expect(fast.stateDigest).not.toBe(slow.stateDigest);
  });

  test("Edison reports 60.5 W at 110 V and 200 Ω, not a fabricated zero stored energy", () => {
    const report = computePortHamiltonianEnergy("us-223898-edison-lightbulb", {
      voltage: 110,
      hotResistanceOhm: 200,
    });
    expect(report.availability).toBe("steady-power");
    expect(report.inputPowerWatts).toBe(60.5);
    expect(report.dissipatedPowerWatts).toBe(60.5);
    expect(report.storedEnergyAvailable).toBe(false);
    expect(report.balance).toMatchObject({ kind: "steady-state", balanced: true });
    expect(report.runtimeSource).toBe("ts-fallback");
  });

  test("steady closure rejects a planted missing 2 W output and reports signed residual", () => {
    expect(measureSteadyPowerBalance(60.5, 58.5)).toEqual({
      kind: "steady-state",
      residualWatts: 2,
      toleranceWatts: 6.05e-7,
      balanced: false,
    });
    expect(measureSteadyPowerBalance(58.5, 60.5)).toMatchObject({
      residualWatts: -2,
      balanced: false,
    });
    for (const power of [0, 1e-4, 60.5, 1e6]) {
      expect(measureSteadyPowerBalance(power, power)).toMatchObject({
        residualWatts: 0,
        balanced: true,
      });
    }
  });

  test("invalid ports and inputs never produce a conservation certificate", () => {
    for (const invalid of [Number.NaN, Number.POSITIVE_INFINITY, -1]) {
      expect(measureSteadyPowerBalance(invalid, 0).kind).toBe("unavailable");
    }
    const invalidInputs: Record<string, number>[] = [
      { voltage: Number.NaN },
      { hotResistanceOhm: 99 },
      { hotResistanceOhm: 501 },
    ];
    for (const params of invalidInputs) {
      expect(computePortHamiltonianEnergy("us-223898-edison-lightbulb", params).availability).toBe(
        "unavailable",
      );
    }
  });

  test("unknown and source-bounded records have unavailable data rather than zero-energy proof", () => {
    for (const id of [
      "unknown",
      "us-381968-tesla-motor",
      "us-3671542-kwolek-kevlar",
      "us-1102653-goddard-rocket",
    ]) {
      const report = computePortHamiltonianEnergy(id, {});
      expect(report.availability).toBe("unavailable");
      expect(report.storedEnergyAvailable).toBe(false);
      expect(report.inputPowerAvailable).toBe(false);
      expect(report.dissipatedPowerAvailable).toBe(false);
      expect(report.balance.kind).toBe("unavailable");
      expect(report.reason.length).toBeGreaterThan(0);
    }
  });
});
