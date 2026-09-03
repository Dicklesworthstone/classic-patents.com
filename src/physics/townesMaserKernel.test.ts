import { describe, expect, test } from "bun:test";
import {
  readTownesMaserControls,
  stepTownesMaserTopology,
  TOWNES_MASER_DEFAULT_CONTROLS,
  TOWNES_MASER_SOURCE_BOUNDARY,
} from "./townesMaserKernel";

describe("US 2,929,922 source-bounded maser topology", () => {
  test("pins the dimensions, material conditions, and end-assembly balance printed by the grant", () => {
    const state = stepTownesMaserTopology(TOWNES_MASER_DEFAULT_CONTROLS);

    expect(state.sourceChamberLengthCm).toBe(10);
    expect(state.sourceChamberDiameterCm).toBe(1);
    expect(state.sourcePotassiumTemperatureK).toBe(435);
    expect(state.sourcePotassiumPressureMmHg).toBe(0.001);
    expect(state.sourceGoldCoatingAngstrom).toBe(500);
    expect(
      state.sourceEndReflectivityPct +
        state.sourceEndAbsorptivityPct +
        state.sourceEndTransmissivityPct,
    ).toBe(100);
    expect(state.chamberAspectRatio).toBe(10);
    expect(state.readerRoundTripReflectivityFraction).toBeCloseTo(0.97 ** 2, 6);
  });

  test("requires the connected generator, mode selector, amplifier, and detector path", () => {
    const active = stepTownesMaserTopology(TOWNES_MASER_DEFAULT_CONTROLS);
    expect(active.signalPathComplete).toBe(true);
    expect(active.state).toBe("generator → modulated amplifier → detector");

    const apertureClosed = stepTownesMaserTopology({ modeApertureOpenPct: 0 });
    expect(apertureClosed.signalPathComplete).toBe(false);
    expect(apertureClosed.state).toBe("mode-selection aperture closed");

    const claimWithheld = stepTownesMaserTopology({ claim1PathPresent: 0 });
    expect(claimWithheld.pumpingPathPresent).toBe(false);
    expect(claimWithheld.modeSelectorOpen).toBe(false);
    expect(claimWithheld.zeemanModulationPathPresent).toBe(false);
    expect(claimWithheld.state).toBe("claim-1 communications path withheld");
  });

  test("clamps malformed reader controls without inventing quantitative performance", () => {
    const controls = readTownesMaserControls({
      pumpExcitationPct: Number.NaN,
      cavityLengthCm: Number.POSITIVE_INFINITY,
      chamberDiameterCm: -20,
      endReflectivityPct: 150,
      modeApertureOpenPct: -2,
      modulationFieldPct: 999,
    });
    expect(controls.pumpExcitationPct).toBe(TOWNES_MASER_DEFAULT_CONTROLS.pumpExcitationPct);
    expect(controls.cavityLengthCm).toBe(TOWNES_MASER_DEFAULT_CONTROLS.cavityLengthCm);
    expect(controls.chamberDiameterCm).toBe(0.5);
    expect(controls.endReflectivityPct).toBe(99);
    expect(controls.modeApertureOpenPct).toBe(0);
    expect(controls.modulationFieldPct).toBe(100);

    const state = stepTownesMaserTopology(controls);
    expect(state.quantitativeOpticalPerformanceAvailable).toBe(false);
    expect(state.quantitativeEnergyAvailable).toBe(false);
    expect(state.refusal.refused).toBe(true);
    expect(state.refusal.reason).toContain("refuses output watts");
    expect(TOWNES_MASER_SOURCE_BOUNDARY).toContain("lens focal lengths");
  });
});
