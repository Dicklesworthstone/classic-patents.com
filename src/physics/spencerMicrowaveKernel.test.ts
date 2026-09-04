import { describe, expect, test } from "bun:test";
import {
  readSpencerMicrowaveControls,
  SPENCER_NORMALIZED_CONVEYOR_SPEED,
  SPENCER_NORMALIZED_DISPLAY_PHASE_RATE_RAD_PER_S,
  SPENCER_SOURCE_MAINS_EXAMPLE_HZ,
  SPENCER_SOURCE_WAVELENGTH_REFERENCE_M,
  SPENCER_TEN_CM_VACUUM_FREQUENCY_HZ,
  stepSpencerMicrowaveSource,
  VACUUM_SPEED_OF_LIGHT_MPS,
} from "./spencerMicrowaveKernel";

describe("Spencer source-bounded microwave apparatus kernel", () => {
  test("preserves every numbered organ in one continuous printed path", () => {
    const state = stepSpencerMicrowaveSource({ rfPowerSetting: 1 });

    expect(state.energyPathActive).toBe(true);
    expect(state.sourcePathContinuous).toBe(true);
    expect(state.sourceNumerals).toEqual({
      oscillators: [10, 11],
      transformer: 18,
      supply: 19,
      waveGuide: 23,
      coaxialLines: [24, 25],
      couplingLoops: [26, 27],
      conveyor: 28,
    });
    for (const numeral of [10, 11, 18, 19, 23, 24, 25, 26, 27, 28]) {
      expect(state.sourcePath).toContain(String(numeral));
    }
  });

  test("derives only the vacuum frequency reference licensed by c = lambda f", () => {
    const state = stepSpencerMicrowaveSource({ rfPowerSetting: 1 });

    expect(state.sourceWavelengthReferenceM).toBe(SPENCER_SOURCE_WAVELENGTH_REFERENCE_M);
    expect(state.sourceMainsExampleHz).toBe(SPENCER_SOURCE_MAINS_EXAMPLE_HZ);
    expect(state.derivedRelation).toBe("c = lambda f");
    expect(state.vacuumFrequencyAtTenCentimetersHz).toBe(
      VACUUM_SPEED_OF_LIGHT_MPS / SPENCER_SOURCE_WAVELENGTH_REFERENCE_M,
    );
    expect(state.vacuumFrequencyAtTenCentimetersHz).toBe(SPENCER_TEN_CM_VACUUM_FREQUENCY_HZ);
    expect(state.vacuumFrequencyAtTenCentimetersHz / 1e9).toBeCloseTo(2.99792458, 8);
  });

  test("keeps all animation rates explicitly normalized and refuses missing SI performance", () => {
    const state = stepSpencerMicrowaveSource({ rfPowerSetting: 1 });

    expect(state.normalizedDisplayPhaseRateRadPerS).toBe(
      SPENCER_NORMALIZED_DISPLAY_PHASE_RATE_RAD_PER_S,
    );
    expect(state.normalizedConveyorSpeed).toBe(SPENCER_NORMALIZED_CONVEYOR_SPEED);
    expect(state.kernelSource).toBe("source-bounded-ts");
    expect(state.quantitativeTubeModelAvailable).toBe(false);
    expect(state.quantitativeCookingModelAvailable).toBe(false);
    expect(state.refusal.refused).toBe(true);
    for (const missingQuantity of [
      "voltage",
      "magnetic flux density",
      "RF watts",
      "Hull cutoff",
      "dielectric-loss density",
      "cooking time",
    ]) {
      expect(state.refusal.reason).toContain(missingQuantity);
    }
  });

  test("sanitizes the path toggle without changing the physical topology", () => {
    expect(readSpencerMicrowaveControls({ rfPowerSetting: Number.NaN }).rfPowerSetting).toBe(1);
    expect(readSpencerMicrowaveControls({ rfPowerSetting: -10 }).rfPowerSetting).toBe(0);
    expect(readSpencerMicrowaveControls({ rfPowerSetting: 10 }).rfPowerSetting).toBe(1);

    const disabled = stepSpencerMicrowaveSource({ rfPowerSetting: 0 });
    expect(disabled.energyPathActive).toBe(false);
    expect(disabled.sourcePathContinuous).toBe(true);
    expect(disabled.sourceNumerals.oscillators).toEqual([10, 11]);
  });
});
