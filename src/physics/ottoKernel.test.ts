import { describe, expect, test } from "bun:test";
import {
  OTTO_MODEL_CONNECTING_ROD_LENGTH,
  OTTO_MODEL_CRANK_RADIUS,
  stepOttoMechanism,
  stepOttoMechanismFallback,
} from "./ottoKernel";
import { decodeOttoTopologyStep, ottoPoseHudPresentation } from "./ottoWasm";

const INPUTS = {
  crankAngleRad: Math.PI / 2,
  crankRadius: OTTO_MODEL_CRANK_RADIUS,
  connectingRodLength: OTTO_MODEL_CONNECTING_ROD_LENGTH,
  engineRpm: 180,
} as const;

describe("US 194,047 shared Otto mechanism kernel", () => {
  test("closes the wrist-to-crank rod at every quadrant", () => {
    for (const crankAngleRad of [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, 3.5 * Math.PI]) {
      const pose = stepOttoMechanismFallback({ ...INPUTS, crankAngleRad });
      expect(pose.connectingRodSpan).toBeCloseTo(OTTO_MODEL_CONNECTING_ROD_LENGTH, 12);
      expect(
        Math.hypot(pose.crankPinX - pose.pistonPinX, pose.crankPinY - pose.pistonPinY),
      ).toBeCloseTo(OTTO_MODEL_CONNECTING_ROD_LENGTH, 12);
      expect(pose.pistonPinY).toBe(0);
    }
  });

  test("derives the half-speed shaft, slide, and exhaust lift from one crank coordinate", () => {
    const exhaust = stepOttoMechanismFallback({ ...INPUTS, crankAngleRad: 3.5 * Math.PI });
    expect(exhaust.cyclePhase).toBe("exhaust");
    expect(exhaust.sideShaftAngleRad).toBeCloseTo(1.75 * Math.PI, 12);
    expect(exhaust.exhaustLiftNormalized).toBeCloseTo(1, 12);
    expect(exhaust.scalarJointCoordinates).toBe(8);
    expect(exhaust.independentDriveDofs).toBe(1);
  });

  test("aligns four-stroke labels with the physical piston direction", () => {
    const intakeTdc = stepOttoMechanismFallback({ ...INPUTS, crankAngleRad: 0 });
    const intakeBdc = stepOttoMechanismFallback({ ...INPUTS, crankAngleRad: Math.PI });
    const compressionTdc = stepOttoMechanismFallback({ ...INPUTS, crankAngleRad: 2 * Math.PI });
    const powerBdc = stepOttoMechanismFallback({ ...INPUTS, crankAngleRad: 3 * Math.PI });

    expect(intakeTdc.cyclePhase).toBe("intake");
    expect(intakeBdc.cyclePhase).toBe("compression");
    expect(compressionTdc.cyclePhase).toBe("power");
    expect(powerBdc.cyclePhase).toBe("exhaust");
    expect(intakeTdc.pistonPinX).toBeLessThan(intakeBdc.pistonPinX);
    expect(compressionTdc.pistonPinX).toBeCloseTo(intakeTdc.pistonPinX, 12);
    expect(powerBdc.pistonPinX).toBeCloseTo(intakeBdc.pistonPinX, 12);
  });

  test("strictly rejects a plausible-looking WASM pose whose rod does not close", () => {
    const fallback = stepOttoMechanismFallback(INPUTS);
    const raw = JSON.stringify({
      ok: {
        scalar_joint_coordinates: fallback.scalarJointCoordinates,
        independent_drive_dofs: fallback.independentDriveDofs,
        crank_axis: fallback.crankAxis,
        piston_axis: fallback.pistonAxis,
        side_shaft_axis: fallback.sideShaftAxis,
        slide_valve_axis: fallback.slideValveAxis,
        exhaust_valve_axis: fallback.exhaustValveAxis,
        governor_axis: fallback.governorAxis,
        cycle_angle_rad: fallback.cycleAngleRad,
        crank_pin_x: fallback.crankPinX,
        crank_pin_y: fallback.crankPinY,
        piston_pin_x: fallback.pistonPinX + 0.05,
        piston_pin_y: fallback.pistonPinY,
        connecting_rod_angle_rad: fallback.connectingRodAngleRad,
        connecting_rod_span: fallback.connectingRodSpan,
        side_shaft_angle_rad: fallback.sideShaftAngleRad,
        slide_valve_normalized: fallback.slideValveNormalized,
        exhaust_lift_normalized: fallback.exhaustLiftNormalized,
        governor_spread_normalized: fallback.governorSpreadNormalized,
        cycle_phase: fallback.cyclePhase,
      },
    });
    expect(decodeOttoTopologyStep(raw, INPUTS)).toBeNull();
  });

  test("refuses impossible display geometry before calling either runtime", () => {
    expect(() =>
      stepOttoMechanism({
        ...INPUTS,
        connectingRodLength: OTTO_MODEL_CRANK_RADIUS,
      }),
    ).toThrow(RangeError);
  });

  test("does not describe the cold-start placeholder as a completed TypeScript step", () => {
    expect(ottoPoseHudPresentation("HONEST_PLACEHOLDER")).toEqual({
      value: "awaiting step",
      tone: "warn",
    });
    expect(ottoPoseHudPresentation("TS_FALLBACK").value).toBe("TS fallback");
    expect(ottoPoseHudPresentation("WASM").value).toBe("fs-mbd WASM");
  });
});
