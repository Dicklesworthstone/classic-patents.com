import { describe, expect, test } from "bun:test";
import {
  stepTeslaMotorFig9,
  TESLA_B_VECTOR_SVG_SCALE,
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
  teslaMotorPhaseHz,
  teslaPhaseVectors,
  teslaPoleCurrent,
  teslaSchematicPoleRect,
  teslaSchematicStrobeOpacity,
  teslaStatorPole,
} from "./teslaKernel";

describe("Tesla Fig. 9 generator circuits and progressive attraction", () => {
  test("Tesla source-face constants and display bounds remain stable", () => {
    expect(TESLA_PATENT_ID).toBe("us-381968-tesla-motor");
    expect(TESLA_STROBE_COUNT).toBe(8);
    expect(TESLA_B_VECTOR_SVG_SCALE).toBe(60);

    const omegaRad = teslaFieldDisplayOmegaRadPerS(60);
    expect(omegaRad).toBeCloseTo((2 * Math.PI * 60) / 20, 2);
    const omegaDeg = teslaFieldDisplayOmegaDegPerS(60);
    expect(omegaDeg).toBe((360 * 60) / 20);
  });

  test("teslaMotorPhaseHz reads the Fig. 9 generator rate and its registry alias", () => {
    expect(teslaMotorPhaseHz({})).toBe(60);
    expect(teslaMotorPhaseHz({ frequency: 40 })).toBe(40);
    expect(teslaMotorPhaseHz({ frequencyHz: 80 })).toBe(80);
    expect(teslaMotorPhaseHz({ frequency: 45, frequencyHz: 80 })).toBe(45);
  });

  test("stepTeslaMotorFig9 keeps the two-circuit generator relation source-bound", () => {
    const state60Hz = stepTeslaMotorFig9(60);
    expect(state60Hz.phaseCycleHz).toBe(60);
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
    expect(state60Hz.schematicStatorOuterR).toBe(95);
    expect(state60Hz.schematicHubR).toBe(8);
    expect(state60Hz.schematicPoleCount).toBe(4);
    expect(state60Hz.displayWrapDeg).toBe(360);
    expect(state60Hz.coilPhaseOffsetRad).toBeCloseTo(Math.PI / 2, 10);
    expect(state60Hz.coilEmissiveAmp).toBe(0.9);
    expect(teslaSchematicPoleRect(0).w).toBe(40);
    expect(teslaSchematicPoleRect(1).h).toBe(40);
    const coil0 = teslaPoleCurrent(0, 2, 0);
    expect(coil0.current).toBeCloseTo(0, 5);
    expect(teslaPoleCurrent(0, 2, Math.PI / 2).current).toBeCloseTo(1, 5);
    const pole0 = teslaStatorPole(0, 4);
    expect(pole0.cx).toBeCloseTo(200, 1);
    expect(pole0.cy).toBeCloseTo(42, 1);
    const circuitVectors = teslaPhaseVectors(0, 2);
    expect(circuitVectors[0].x).toBeCloseTo(52, 1);
    expect(circuitVectors[1].y).toBeCloseTo(0, 5);
  });

  test("teslaBAt shows two independent circuits shifting attraction by a quarter cycle", () => {
    const sourceAt0 = teslaBAt(0, 2);
    expect(sourceAt0.coilCount).toBe(4);
    expect(Math.hypot(sourceAt0.bx, sourceAt0.by)).toBeCloseTo(1.0, 3);

    const sourceAtQuarter = teslaBAt(Math.PI / 2, 2);
    expect(Math.hypot(sourceAtQuarter.bx, sourceAtQuarter.by)).toBeCloseTo(1.0, 3);
    const dotProduct = sourceAt0.bx * sourceAtQuarter.bx + sourceAt0.by * sourceAtQuarter.by;
    expect(Math.abs(dotProduct)).toBeLessThan(0.05);
  });

  test("teslaFig4Strobe generates eight successive positions for the source diagram", () => {
    const strobe = teslaFig4Strobe();
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
    expect(si.schematicSparkX0).toBe(160);
    expect(si.schematicSparkR).toBe(5);
    expect(si.schematicBaseW).toBe(260);
    expect(si.schematicSparkDx).toBe(5);
    expect(teslaCoilWindingSvg(0).x1).toBe(-25);
  });
});
