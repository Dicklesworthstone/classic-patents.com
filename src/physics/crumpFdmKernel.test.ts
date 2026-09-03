import { describe, expect, test } from "bun:test";
import { CRUMP_FDM_DEFAULT_CONTROLS, readCrumpFdmControls, stepCrumpFdmSi } from "./crumpFdmKernel";

describe("US 5,121,329 S. Scott Crump FDM SI Physics Kernel", () => {
  test("computes accurate volumetric flow rate and filament feed speed for default parameters", () => {
    const controls = readCrumpFdmControls(CRUMP_FDM_DEFAULT_CONTROLS);
    const telemetry = stepCrumpFdmSi(controls);

    // Q = w * h * v_head = 0.45 * 0.20 * 45 = 4.05 mm^3/s
    expect(telemetry.volumetricFlowRateMm3S).toBeCloseTo(4.05, 2);

    // The specification calls the flexible strand "on the order of one-sixteenth
    // inch": 1/16 in = 1.5875 mm, A_filament = 1.979 mm², and v_feed = 2.047 mm/s.
    expect(controls.filamentDiameterMm).toBe(1.5875);
    expect(telemetry.filamentFeedSpeedMmS).toBeCloseTo(2.046, 2);

    expect(telemetry.isExtruding).toBe(true);
    expect(telemetry.coldNozzleJamRefusal).toBe(false);
    expect(telemetry.filamentGrindingRefusal).toBe(false);
  });

  test("calculates Arrhenius melt viscosity and Poiseuille nozzle pressure drop", () => {
    const controls = readCrumpFdmControls(CRUMP_FDM_DEFAULT_CONTROLS);
    const telemetry = stepCrumpFdmSi(controls);

    expect(telemetry.apparentViscosityPaS).toBeGreaterThan(100);
    expect(telemetry.nozzlePressureDropMPa).toBeGreaterThan(0.01);
    expect(telemetry.feedDriveForceN).toBeGreaterThan(0.1);
    expect(telemetry.feedDriveForceN).toBeLessThan(telemetry.maxTractionForceN);
  });

  test("enforces cold nozzle jam refusal when temperature is below liquefaction threshold", () => {
    const coldControls = readCrumpFdmControls({
      ...CRUMP_FDM_DEFAULT_CONTROLS,
      nozzleTempC: 140, // Below 160 C
    });
    const telemetry = stepCrumpFdmSi(coldControls);

    expect(telemetry.isExtruding).toBe(false);
    expect(telemetry.coldNozzleJamRefusal).toBe(true);
    expect(telemetry.refusalReason).toContain("flow-admission threshold");
  });

  test("enforces filament grinding refusal when required drive force exceeds pinch roller traction", () => {
    const highSpeedControls = readCrumpFdmControls({
      ...CRUMP_FDM_DEFAULT_CONTROLS,
      nozzleTempC: 170, // High viscosity
      printSpeedMmS: 220, // Very high extrusion speed
      pinchRollerForceN: 15, // Low traction clamping
    });
    const telemetry = stepCrumpFdmSi(highSpeedControls);

    expect(telemetry.isExtruding).toBe(false);
    expect(telemetry.filamentGrindingRefusal).toBe(true);
    expect(telemetry.refusalReason).toContain("exceeds the declared roller traction limit");
  });

  test("computes thermal cooling time constant and bead aspect ratio", () => {
    const controls = readCrumpFdmControls(CRUMP_FDM_DEFAULT_CONTROLS);
    const telemetry = stepCrumpFdmSi(controls);

    // w/h = 0.45 / 0.20 = 2.25
    expect(telemetry.beadAspectRatio).toBeCloseTo(2.25, 2);
    expect(telemetry.coolingTimeConstantSec).toBeGreaterThan(0.01);
    expect(telemetry.coolingTimeConstantSec).toBeLessThan(1.0);
    expect(telemetry.timeToGlassTransitionSec).toBeCloseTo(
      telemetry.coolingTimeConstantSec * Math.log((225 - 25) / (105 - 25)),
      12,
    );
    expect(telemetry.timeToGlassTransitionSec).toBeLessThan(telemetry.coolingTimeConstantSec);
    expect(telemetry.interfaceTemperatureMarginC).toBeCloseTo(20, 12);
    expect(telemetry.interfaceAboveGlassTransition).toBe(true);
    expect("weldQualityRatio" in telemetry).toBe(false);
  });

  test("keeps Claim 1, Claim 2, and Claim 39 as distinct source predicates", () => {
    const withoutClaim1 = stepCrumpFdmSi({
      ...CRUMP_FDM_DEFAULT_CONTROLS,
      claim1ApparatusEnabled: 0,
    });
    expect(withoutClaim1.claim1ApparatusPresent).toBe(false);
    expect(withoutClaim1.claim2HeatingMeansPresent).toBe(false);
    expect(withoutClaim1.claim39PlanarGapPresent).toBe(false);
    expect(withoutClaim1.isExtruding).toBe(false);
    expect(withoutClaim1.refusalReason).toContain("Claim 1 topology withheld");

    const withoutClaim2 = stepCrumpFdmSi({
      ...CRUMP_FDM_DEFAULT_CONTROLS,
      claim2HeatingEnabled: 0,
    });
    expect(withoutClaim2.claim1ApparatusPresent).toBe(true);
    expect(withoutClaim2.claim2HeatingMeansPresent).toBe(false);
    expect(withoutClaim2.isExtruding).toBe(false);
    expect(withoutClaim2.refusalReason).toContain("Claim 2 heating means withheld");

    const withoutClaim39 = stepCrumpFdmSi({
      ...CRUMP_FDM_DEFAULT_CONTROLS,
      claim39PlanarNozzleEnabled: 0,
    });
    expect(withoutClaim39.claim1ApparatusPresent).toBe(true);
    expect(withoutClaim39.claim2HeatingMeansPresent).toBe(true);
    expect(withoutClaim39.claim39PlanarGapPresent).toBe(false);
    expect(withoutClaim39.isExtruding).toBe(true);
    expect(withoutClaim39.refusalReason).toBeUndefined();
  });

  test("states the exact generic-law owners and reduced-model boundaries", () => {
    const telemetry = stepCrumpFdmSi(CRUMP_FDM_DEFAULT_CONTROLS);
    expect(telemetry.capillaryOwner).toBe("fs-flux::capillary::step_newtonian_circular_capillary");
    expect(telemetry.thermalOwner).toBe(
      "fs-conduction::reduced_slab::step_first_mode_slab_cooling",
    );
    expect(telemetry.capillaryBoundary).toContain("newtonian");
    expect(telemetry.thermalBoundary).toContain("no-phase-change");
    expect(telemetry.hydraulicPowerW).toBeCloseTo(
      telemetry.nozzlePressureDropMPa * 1e6 * telemetry.volumetricFlowRateMm3S * 1e-9,
      12,
    );
  });
});
