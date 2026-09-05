import { describe, expect, test } from "bun:test";
import { stepGoodyearRubber } from "./catalogKernels";
import { coupleEdgesFor } from "./coupleGraph";
import { computePortHamiltonianEnergy, measureSteadyPowerBalance } from "./energyLedger";
import { readWattCondenserControls, stepWattCondenser } from "./wattCondenserKernel";
import { WRIGHT_GROSS_WEIGHT_N } from "./wrightKernel";

describe("Energy readouts distinguish partial, steady and unavailable evidence", () => {
  test("Goodyear reports the same elastic density as its instrument without fabricated volume or power", () => {
    for (const vulcanTemp of [110, 145, 180]) {
      for (const sulfurPct of [0, 4, 8, 30]) {
        for (const appliedTensileStretch of [1, 1.8, 2.5]) {
          const params = { vulcanTemp, sulfurPct, appliedTensileStretch, specimenTempC: 35 };
          const state = stepGoodyearRubber(vulcanTemp, sulfurPct, 30, appliedTensileStretch, 35);
          const report = computePortHamiltonianEnergy("us-3633-goodyear-rubber", params);
          expect(report.strainEnergyDensityJPerM3).toBe(state.strainEnergyDensityJPerM3);
          expect(report.availability).toBe("kernel-partial");
          expect(report.runtimeSource).toBe("ts-fallback");
          expect(report.storedEnergyAvailable).toBe(false);
          expect(report.inputPowerAvailable).toBe(false);
          expect(report.dissipatedPowerAvailable).toBe(false);
          expect(report.outputPowerWatts).toBeNull();
          expect(report.balance.kind).toBe("unavailable");
          expect(
            computePortHamiltonianEnergy("us-3633-goodyear-rubber", params, 30)
              .strainEnergyDensityJPerM3,
          ).toBe(report.strainEnergyDensityJPerM3);
        }
      }
    }
    const a = computePortHamiltonianEnergy("us-3633-goodyear-rubber", { sulfurPct: 4 });
    const b = computePortHamiltonianEnergy("us-3633-goodyear-rubber", { sulfurPct: 8 });
    expect(a.stateDigest).not.toBe(b.stateDigest);
  });

  test("Goodyear energy rejects invalid controls instead of clamping into plausible values", () => {
    for (const params of [
      { appliedTensileStretch: 0.99 },
      { appliedTensileStretch: 2.51 },
      { sulfurPct: -0.1 },
      { sulfurPct: 30.1 },
      { vulcanTemp: 109 },
      { vulcanTemp: 191 },
      { specimenTempC: -21 },
      { specimenTempC: 101 },
      { sulfurPct: Number.NaN },
    ] as Record<string, number>[]) {
      const report = computePortHamiltonianEnergy("us-3633-goodyear-rubber", params);
      expect(report.availability).toBe("unavailable");
      expect(report.strainEnergyDensityJPerM3).toBeUndefined();
    }
  });

  test("Goodyear sulfur coupling uses the canonical cure temperature, including zero sulfur", () => {
    for (const sulfurPct of [0, 4, 30]) {
      const warm = coupleEdgesFor("us-3633-goodyear-rubber", { sulfurPct, vulcanTemp: 145 })[0];
      const cold = coupleEdgesFor("us-3633-goodyear-rubber", { sulfurPct, vulcanTemp: 110 })[0];
      expect(warm.gain).toBe(1 / 8);
      expect(cold.gain).toBe(0.4 / 8);
      expect(cold.unit).toBe("relative / %");
    }
  });

  test("Thomson contact power follows I²R without inventing stored heat or cooling losses", () => {
    for (const current of [1000, 2000, 4500, 5800, 6000]) {
      for (const pressure of [10, 35, 60]) {
        for (const time of [0, 20]) {
          const report = computePortHamiltonianEnergy(
            "us-347140-thomson-welding",
            { weldCurrentAmps: current, clampPressureMpa: pressure },
            time,
          );
          expect(report.inputPowerWatts).toBeCloseTo(current ** 2 * 0.00018, 1);
          expect(report.inputPowerAvailable).toBe(true);
          expect(report.availability).toBe("kernel-partial");
          expect(report.runtimeSource).toBe("ts-fallback");
          expect(report.storedEnergyAvailable).toBe(false);
          expect(report.dissipatedPowerAvailable).toBe(false);
          expect(report.outputPowerWatts).toBeNull();
          expect(report.balance.kind).toBe("unavailable");
          expect(report.energy.totalHamiltonianJoules).toBe(0);
        }
      }
    }
    expect(computePortHamiltonianEnergy("us-347140-thomson-welding", {}).inputPowerWatts).toBe(
      3645,
    );
  });

  test("Thomson energy refuses a current outside the admitted instrument domain", () => {
    for (const current of [999, 6001, Number.NaN, Number.POSITIVE_INFINITY]) {
      const report = computePortHamiltonianEnergy("us-347140-thomson-welding", {
        weldCurrentAmps: current,
      });
      expect(report.availability).toBe("unavailable");
      expect(report.inputPowerAvailable).toBe(false);
      expect(report.balance.kind).toBe("unavailable");
    }
  });

  test("Watt power ports follow the shared model without invented stored energy or closure", () => {
    for (const hasSeparateCondenser of [0, 1]) {
      for (const hasSteamJacket of [0, 1]) {
        const params = {
          boilerPressurePsi: 6,
          condenserTempC: 50,
          cylinderBoreInches: 60,
          pistonStrokeFeet: 8,
          strokesPerMinute: 20,
          hasSeparateCondenser,
          hasSteamJacket,
        };
        const state = stepWattCondenser(readWattCondenserControls(params));
        const report = computePortHamiltonianEnergy("gb-913-watt-separate-condenser", params);
        // The public report rounds power ports to 0.1 W (at most 0.05 W error).
        expect(report.inputPowerWatts).toBeCloseTo(state.heatInputRateKw * 1000, 1);
        expect(report.dissipatedPowerWatts).toBeCloseTo(state.airPumpPowerKw * 1000, 1);
        expect(report.outputPowerWatts).toBeCloseTo(state.netShaftPowerKw * 1000, 1);
        expect(report.dissipationLabel).toBe("Air pump");
        expect(report.storedEnergyAvailable).toBe(false);
        expect(report.balance.kind).toBe("unavailable");
        expect(report.runtimeSource).toBe("ts-fallback");
        expect(report.reason).toContain("Illustrative teaching scenario");
        const later = computePortHamiltonianEnergy("gb-913-watt-separate-condenser", params, 20);
        expect(later.inputPowerWatts).toBe(report.inputPowerWatts);
        expect(later.outputPowerWatts).toBe(report.outputPowerWatts);
        expect(later.storedEnergyAvailable).toBe(false);
        expect(later.balance.kind).toBe("unavailable");
      }
    }
  });
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
