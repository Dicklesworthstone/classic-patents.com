import { describe, expect, test } from "bun:test";
import {
  stepTeslaMotorFig9,
  TESLA_B_VECTOR_SVG_SCALE,
  TESLA_FIELD_POLES,
  TESLA_PATENT_ID,
  TESLA_STROBE_COUNT,
  teslaBAt,
  teslaCoilControls,
  teslaCoilResonantKhz,
  teslaFieldDisplayOmegaDegPerS,
  teslaFieldDisplayOmegaRadPerS,
  teslaFig4Strobe,
} from "./teslaKernel";

describe("Tesla Polyphase AC & Resonant Induction Kernels", () => {
  test("Tesla motor constants and display speed bounds match archival spec", () => {
    expect(TESLA_PATENT_ID).toBe("us-381968-tesla-motor");
    expect(TESLA_STROBE_COUNT).toBe(8);
    expect(TESLA_FIELD_POLES).toBe(2);
    expect(TESLA_B_VECTOR_SVG_SCALE).toBe(60);

    const omegaRad = teslaFieldDisplayOmegaRadPerS(60);
    expect(omegaRad).toBeCloseTo((2 * Math.PI * 60) / 20, 2);
    const omegaDeg = teslaFieldDisplayOmegaDegPerS(60);
    expect(omegaDeg).toBe((360 * 60) / 20);
  });

  test("stepTeslaMotorFig9 computes authentic motor-generator pair synchronization without commutators", () => {
    const state60Hz = stepTeslaMotorFig9(60);
    expect(state60Hz.generatorRpm).toBe(3600);
    expect(state60Hz.poleShiftRpm).toBe(3600);
    expect(state60Hz.diskRpm).toBe(3600);
    expect(state60Hz.usesGeneratorContactRings).toBe(true);
    expect(state60Hz.usesMotorCommutator).toBe(false);
  });

  test("teslaBAt computes pure rotating magnetic field vector for 2-phase and 3-phase systems", () => {
    // 2-phase quadrature system (4 stator poles)
    const b2Phase0 = teslaBAt(0, 2);
    expect(b2Phase0.coilCount).toBe(4);
    expect(Math.hypot(b2Phase0.bx, b2Phase0.by)).toBeCloseTo(1.0, 3);

    const b2Phase90 = teslaBAt(Math.PI / 2, 2);
    expect(Math.hypot(b2Phase90.bx, b2Phase90.by)).toBeCloseTo(1.0, 3);
    // 90 degree phase shift results in orthogonal field vector
    const dotProduct = b2Phase0.bx * b2Phase90.bx + b2Phase0.by * b2Phase90.by;
    expect(Math.abs(dotProduct)).toBeLessThan(0.05);

    // 3-phase 120-degree system (6 stator poles)
    const b3Phase0 = teslaBAt(0, 3);
    expect(b3Phase0.coilCount).toBe(6);
    expect(Math.hypot(b3Phase0.bx, b3Phase0.by)).toBeCloseTo(1.0, 3);
  });

  test("teslaFig4Strobe generates 8 discrete positions matching the 1888 patent diagram", () => {
    const strobe = teslaFig4Strobe(2);
    expect(strobe.length).toBe(8);
    for (let i = 0; i < 8; i++) {
      expect(strobe[i].omegaT).toBeCloseTo((i * Math.PI) / 4, 3);
      expect(Math.hypot(strobe[i].bx, strobe[i].by)).toBeCloseTo(1.0, 3);
    }
  });

  test("teslaCoilResonantKhz and teslaCoilControls compute dual-tank resonance", () => {
    const fRes = teslaCoilResonantKhz(45, 35);
    expect(fRes).toBe(180);

    const controls = teslaCoilControls({
      primaryCapNf: 45,
      toploadCapacitancePf: 35,
      inputVoltageKv: 20,
      sparkGapDistanceMm: 15,
    });
    expect(controls.resonantFreqKhz).toBe(180);
    expect(controls.inputKv).toBe(20);
    expect(controls.sparkGapMm).toBe(15);
  });
});
