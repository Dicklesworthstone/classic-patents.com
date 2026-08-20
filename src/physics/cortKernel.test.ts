import { describe, expect, test } from "bun:test";
import { stepCortPuddlingRolling } from "./cortKernel";

describe("Henry Cort SI Metallurgy & Rolling Physics Kernel", () => {
  test("computes baseline puddling and grooved rolling outputs", () => {
    const outputs = stepCortPuddlingRolling({
      furnaceTemperatureCelsius: 1350,
      initialCarbonPercent: 3.8,
      rabbleStirringRpm: 15,
      puddlingDurationMinutes: 90,
      rollerPassCount: 5,
    });

    // Residual carbon should drop substantially from 3.8%
    expect(outputs.residualCarbonPercent).toBeLessThan(0.5);
    expect(outputs.carbonRemovedPercent).toBeGreaterThan(3.3);

    // Iron melting point should rise above furnace temperature (1350°C) triggering coming to nature
    expect(outputs.ironMeltingPointCelsius).toBeGreaterThan(1500);
    expect(outputs.isPastyNatureState).toBe(true);

    // Slag should be progressively expelled
    expect(outputs.residualSlagVolumeFractionPercent).toBeLessThan(2.0);
    expect(outputs.slagExpelledKg).toBeGreaterThan(4.0);

    // Mechanical properties of finished wrought iron bar
    expect(outputs.tensileStrengthMpa).toBeGreaterThan(280);
    expect(outputs.yieldStrengthMpa).toBeGreaterThan(160);
    expect(outputs.ductilityElongationPercent).toBeGreaterThan(15);
    expect(outputs.productionSpeedupVsHammer).toBe(15.0);
    expect(outputs.rollSpeedRpm).toBe(30);
    expect(outputs.rollOmegaRadPerS).toBeCloseTo((30 * 2 * Math.PI) / 60, 8);
    expect(outputs.rabbleOmegaRadPerS).toBeCloseTo((15 * 2 * Math.PI) / 60, 8);
  });

  test("demonstrates rabble stirring accelerates decarburization rate", () => {
    const stagnant = stepCortPuddlingRolling({
      furnaceTemperatureCelsius: 1300,
      initialCarbonPercent: 3.8,
      rabbleStirringRpm: 0,
      puddlingDurationMinutes: 60,
      rollerPassCount: 4,
    });

    const active = stepCortPuddlingRolling({
      furnaceTemperatureCelsius: 1300,
      initialCarbonPercent: 3.8,
      rabbleStirringRpm: 25,
      puddlingDurationMinutes: 60,
      rollerPassCount: 4,
    });

    expect(active.residualCarbonPercent).toBeLessThan(stagnant.residualCarbonPercent);
    expect(active.carbonRemovedPercent).toBeGreaterThan(stagnant.carbonRemovedPercent);
  });

  test("confirms more rolling passes reduce slag and increase elongation", () => {
    const singlePass = stepCortPuddlingRolling({
      furnaceTemperatureCelsius: 1350,
      initialCarbonPercent: 3.8,
      rabbleStirringRpm: 15,
      puddlingDurationMinutes: 90,
      rollerPassCount: 1,
    });

    const sixPasses = stepCortPuddlingRolling({
      furnaceTemperatureCelsius: 1350,
      initialCarbonPercent: 3.8,
      rabbleStirringRpm: 15,
      puddlingDurationMinutes: 90,
      rollerPassCount: 6,
    });

    expect(sixPasses.residualSlagVolumeFractionPercent).toBeLessThan(
      singlePass.residualSlagVolumeFractionPercent,
    );
    expect(sixPasses.totalAreaReductionRatio).toBeGreaterThan(singlePass.totalAreaReductionRatio);
    expect(sixPasses.tensileStrengthMpa).toBeGreaterThan(singlePass.tensileStrengthMpa);
  });
});
