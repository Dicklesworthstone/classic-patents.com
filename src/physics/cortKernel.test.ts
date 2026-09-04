import { describe, expect, test } from "bun:test";
import {
  CORT_ACTIVE_BILLET_HEIGHT_M,
  CORT_DEFAULT_CONTROLS,
  CORT_FRANKENSIM_BOUNDARY,
  CORT_KERNEL_SOURCE,
  CORT_ROLL_CENTER_SEPARATION_M,
  CORT_ROLL_PASS_RADII_M,
  CORT_SOURCE_BOUNDARY,
  createCortTransportUpdater,
  getCortTapeFrame,
  stepCortPuddlingRolling,
} from "./cortKernel";

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
    expect(outputs.productionSpeedupVsHammer).toBe(1.0);
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

  test("closes the declared first-pass nip without penetrating the billet", () => {
    const outputs = stepCortPuddlingRolling(CORT_DEFAULT_CONTROLS);
    const geometricGapM = CORT_ROLL_CENTER_SEPARATION_M - 2 * CORT_ROLL_PASS_RADII_M[0];

    expect(geometricGapM).toBeCloseTo(CORT_ACTIVE_BILLET_HEIGHT_M, 12);
    expect(outputs.workingRollRadiusMm).toBeCloseTo(CORT_ROLL_PASS_RADII_M[0] * 1000, 12);
    expect(outputs.rollNipGapMm).toBeCloseTo(CORT_ACTIVE_BILLET_HEIGHT_M * 1000, 12);
    expect(outputs.billetEntryHeightMm).toBe(outputs.rollNipGapMm);
    expect(outputs.nipInterferenceMm).toBe(0);
  });

  test("integrates counter-rotation, no-slip billet travel, pause, and reset on one tape", () => {
    const controls = {
      ...CORT_DEFAULT_CONTROLS,
      isRunning: true,
      resetEpoch: 0,
    };
    const updater = createCortTransportUpdater(() => controls);
    updater({} as never, 0.1);
    const moving = getCortTapeFrame();
    expect(moving).not.toBeNull();
    if (!moving) throw new Error("Cort tape did not publish its first fixed step.");

    expect(moving.phases.topRollRad).toBeCloseTo(-moving.phases.bottomRollRad, 12);
    expect(moving.phases.bottomRollRad).toBeCloseTo(moving.outputs.rollOmegaRadPerS * 0.1, 12);
    expect(moving.phases.billetTravelM).toBeCloseTo(
      moving.phases.bottomRollRad * (moving.outputs.workingRollRadiusMm / 1000),
      12,
    );

    controls.isRunning = false;
    updater({} as never, 0.25);
    const held = getCortTapeFrame();
    expect(held?.timeSec).toBe(moving.timeSec);
    expect(held?.phases).toEqual(moving.phases);

    controls.resetEpoch = 1;
    updater({} as never, 0.1);
    const reset = getCortTapeFrame();
    expect(reset?.timeSec).toBe(0);
    expect(reset?.phases).toEqual({
      topRollRad: 0,
      bottomRollRad: 0,
      rabbleCycleRad: 0,
      billetTravelM: 0,
    });
  });

  test("declares the generic FrankenSim composition refusal without a false WASM claim", () => {
    expect(CORT_KERNEL_SOURCE).toBe("source-bounded-ts");
    expect(CORT_FRANKENSIM_BOUNDARY).toContain("fs-mbd::revolute");
    expect(CORT_FRANKENSIM_BOUNDARY).toContain("fs-solid::contact");
    expect(CORT_FRANKENSIM_BOUNDARY).toContain("fs-conduction::transient");
    expect(CORT_SOURCE_BOUNDARY).toContain("1854 Patent Office abridgment");
    expect(CORT_SOURCE_BOUNDARY).toContain("No FrankenSim");
  });
});
