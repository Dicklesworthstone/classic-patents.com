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
  teslaCoilSiUnits,
  teslaCoilWindingSvg,
  teslaFieldDisplayOmegaDegPerS,
  teslaFieldDisplayOmegaRadPerS,
  teslaFig4Strobe,
  teslaPhaseVectors,
  teslaPoleCurrent,
  teslaSchematicStrobeOpacity,
  teslaStatorPole,
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
    expect(state60Hz.statorPoleSvgR).toBe(108);
    expect(state60Hz.twoPhaseVectorSvgR).toBe(52);
    expect(state60Hz.threePhaseVectorSvgR).toBe(42);
    expect(state60Hz.schematicStrobeOpacityBase).toBe(0.18);
    expect(teslaSchematicStrobeOpacity(0)).toBe(0.18);
    expect(teslaSchematicStrobeOpacity(7)).toBe(0.46);
    expect(state60Hz.statorRingOuterSvgR).toBe(110);
    expect(state60Hz.statorPoleSvgW).toBe(36);
    const coil0 = teslaPoleCurrent(0, 2, 0);
    expect(coil0.current).toBeCloseTo(0, 5);
    expect(teslaPoleCurrent(0, 2, Math.PI / 2).current).toBeCloseTo(1, 5);
    const pole0 = teslaStatorPole(0, 4);
    expect(pole0.cx).toBeCloseTo(200, 1);
    expect(pole0.cy).toBeCloseTo(42, 1);
    const twoPhase = teslaPhaseVectors(0, 2);
    expect(twoPhase[0].x).toBeCloseTo(52, 1);
    expect(twoPhase[1].y).toBeCloseTo(0, 5);
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
    const si = teslaCoilSiUnits(180, 15, 1.25);
    expect(si.resonantFreqHz).toBe(180000);
    expect(si.inputVoltageVolts).toBe(15000);
    expect(si.secondaryPotentialVolts).toBe(1250000);
    expect(si.secondaryTurnCount).toBe(18);
    expect(si.schematicToploadRx).toBe(50);
    expect(si.schematicToploadRy).toBe(18);
    expect(teslaCoilWindingSvg(0).x1).toBe(-25);
  });
});
