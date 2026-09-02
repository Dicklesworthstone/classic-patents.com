import { describe, expect, test } from "bun:test";
import {
  readLemelsonMachineVisionControls,
  stepLemelsonMachineVisionSi,
} from "./lemelsonMachineVisionKernel";

describe("US 3,081,379 Lemelson Machine Vision Physics Kernel", () => {
  test("computes accurate video scanning and beam velocity in SI units", () => {
    const controls = readLemelsonMachineVisionControls({
      scanLineCount: 525,
      frameRateHz: 30,
      targetWidthM: 0.2,
      nominalPartWidthM: 0.08,
      actualPartWidthM: 0.08,
    });
    const state = stepLemelsonMachineVisionSi(controls, 0.00003);
    expect(state.metrics.horizontalScanFreqHz).toBe(15750);
    expect(state.metrics.linePeriodUs).toBeCloseTo(63.49, 1);
    expect(state.metrics.scanBeamVelocityMPerS).toBeGreaterThan(3000);
    expect(state.metrics.measuredPartWidthMm).toBeCloseTo(80.0, 1);
    expect(state.metrics.dimensionalErrorMm).toBeCloseTo(0.0, 1);
    expect(state.defectDetected).toBe(false);
  });

  test("detects surface flaw notch and activates diverter solenoid force", () => {
    const defectControls = readLemelsonMachineVisionControls({
      flawDepthM: 0.002, // 2 mm flaw
      thresholdVoltage: 0.45,
      actualPartWidthM: 0.08,
    });
    const defectState = stepLemelsonMachineVisionSi(defectControls, 0.5 / 15750); // At center of line scan

    expect(defectState.defectDetected).toBe(true);
    expect(defectState.metrics.solenoidForceN).toBeGreaterThan(4);
  });
});
