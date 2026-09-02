import { describe, expect, test } from "bun:test";
import { CRUMP_FDM_DEFAULT_CONTROLS, readCrumpFdmControls, stepCrumpFdmSi } from "./crumpFdmKernel";

describe("US 5,121,329 S. Scott Crump FDM SI Physics Kernel", () => {
  test("computes accurate volumetric flow rate and filament feed speed for default parameters", () => {
    const controls = readCrumpFdmControls(CRUMP_FDM_DEFAULT_CONTROLS);
    const telemetry = stepCrumpFdmSi(controls);

    // Q = w * h * v_head = 0.45 * 0.20 * 45 = 4.05 mm^3/s
    expect(telemetry.volumetricFlowRateMm3S).toBeCloseTo(4.05, 2);

    // A_filament = pi * (1.75)^2 / 4 = 2.4053 mm^2
    // v_feed = 4.05 / 2.4053 = 1.6837 mm/s
    expect(telemetry.filamentFeedSpeedMmS).toBeCloseTo(1.68, 1);

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
    expect(telemetry.refusalReason).toContain("below polymer liquefaction point");
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
    expect(telemetry.refusalReason).toContain("exceeds roller traction limit");
  });

  test("computes thermal cooling time constant and bead aspect ratio", () => {
    const controls = readCrumpFdmControls(CRUMP_FDM_DEFAULT_CONTROLS);
    const telemetry = stepCrumpFdmSi(controls);

    // w/h = 0.45 / 0.20 = 2.25
    expect(telemetry.beadAspectRatio).toBeCloseTo(2.25, 2);
    expect(telemetry.coolingTimeConstantSec).toBeGreaterThan(0.01);
    expect(telemetry.coolingTimeConstantSec).toBeLessThan(1.0);
  });
});
