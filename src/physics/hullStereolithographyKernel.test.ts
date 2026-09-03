import { describe, expect, test } from "bun:test";
import {
  HULL_FIBER_BUNDLE_DIAMETER_MM,
  HULL_FIBER_BUNDLE_LENGTH_M,
  HULL_FRANKENSIM_ELEVATOR_OWNER,
  HULL_FRANKENSIM_OPTICAL_ATTENUATION_OWNER,
  HULL_PREFERRED_LAMP_POWER_W,
  HULL_SLA_DEFAULT_CONTROLS,
  HULL_SPOT_DIAMETER_UPPER_BOUND_MM,
  HULL_SURFACE_IRRADIANCE_APPROX_W_CM2,
  readHullStereolithographyControls,
  stepHullStereolithographySi,
  stepHullStereolithographyTopology,
} from "./hullStereolithographyKernel";

describe("US 4,575,330 source-bounded stereolithography apparatus kernel", () => {
  test("publishes only measurements printed for Hull's preferred working embodiment", () => {
    const state = stepHullStereolithographyTopology();

    expect(state.printedSourceCard).toEqual({
      lampElectricalPowerW: HULL_PREFERRED_LAMP_POWER_W,
      fiberBundleDiameterMm: HULL_FIBER_BUNDLE_DIAMETER_MM,
      fiberBundleLengthM: HULL_FIBER_BUNDLE_LENGTH_M,
      spotDiameterUpperBoundMm: HULL_SPOT_DIAMETER_UPPER_BOUND_MM,
      surfaceIrradianceApproxWcm2: HULL_SURFACE_IRRADIANCE_APPROX_W_CM2,
    });
    expect(state.printedSourceCard).toEqual({
      lampElectricalPowerW: 350,
      fiberBundleDiameterMm: 1,
      fiberBundleLengthM: 1,
      spotDiameterUpperBoundMm: 1,
      surfaceIrradianceApproxWcm2: 1,
    });
  });

  test("keeps the shutter open only when the supported stack is at the working position", () => {
    const working = stepHullStereolithographyTopology({
      ...HULL_SLA_DEFAULT_CONTROLS,
      shutterRequestedOpen: 1,
      recoatExcursionFraction: 0,
    });
    expect(working.shutterRequestedOpen).toBe(true);
    expect(working.shutterOpen).toBe(true);
    expect(working.exposureAtWorkingSurface).toBe(true);
    expect(working.shutterInterlockActive).toBe(false);
    expect(working.apparatusState).toBe("working-position / shutter-open");

    const recoating = stepHullStereolithographyTopology({
      ...HULL_SLA_DEFAULT_CONTROLS,
      shutterRequestedOpen: 1,
      recoatExcursionFraction: 0.65,
    });
    expect(recoating.shutterRequestedOpen).toBe(true);
    expect(recoating.shutterOpen).toBe(false);
    expect(recoating.exposureAtWorkingSurface).toBe(false);
    expect(recoating.shutterInterlockActive).toBe(true);
    expect(recoating.apparatusState).toBe("recoating-excursion / shutter-interlocked");
  });

  test("clamps normalized apparatus controls and discretizes shutter and display laminae", () => {
    expect(
      readHullStereolithographyControls({
        shutterRequestedOpen: 0.49,
        scanXFraction: -9,
        scanZFraction: 9,
        recoatExcursionFraction: 3,
        displayLaminaCount: 7.6,
      }),
    ).toEqual({
      shutterRequestedOpen: 0,
      scanXFraction: -1,
      scanZFraction: 1,
      recoatExcursionFraction: 1,
      displayLaminaCount: 8,
    });
  });

  test("retains support and lamina topology through every reader state", () => {
    for (const recoatExcursionFraction of [0, 0.25, 0.5, 1]) {
      const state = stepHullStereolithographySi({
        ...HULL_SLA_DEFAULT_CONTROLS,
        recoatExcursionFraction,
        displayLaminaCount: 12,
      });
      expect(state.objectSupportedByPlatform).toBe(true);
      expect(state.laminaeRemainIntegrated).toBe(true);
      expect(state.workingSurfaceHeld).toBe(true);
      expect(state.visibleLaminaCount).toBe(12);
    }
  });

  test("identifies generic FrankenSim owners but refuses unparameterized performance claims", () => {
    const state = stepHullStereolithographyTopology();
    expect(state.owners.elevator).toBe(HULL_FRANKENSIM_ELEVATOR_OWNER);
    expect(state.owners.opticalAttenuationCandidate).toBe(
      HULL_FRANKENSIM_OPTICAL_ATTENUATION_OWNER,
    );
    expect(state.quantitativeCureAvailable).toBe(false);
    expect(state.quantitativeMotionAvailable).toBe(false);
    expect(state.refusal.refused).toBe(true);
    expect(state.refusal.reason).toContain("does not print");
    expect(state.refusal.reason).toContain("refuses cure depth");
    expect("peakExposureMJCm2" in state).toBe(false);
    expect("cureDepthUm" in state).toBe(false);
    expect("resinViscosityCp" in state.controls).toBe(false);
    expect("laserPowerMw" in state.controls).toBe(false);
  });
});
