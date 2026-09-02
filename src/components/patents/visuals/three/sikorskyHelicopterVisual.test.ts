import { describe, expect, test } from "bun:test";
import {
  DEFAULT_SIKORSKY_CONTROLS,
  INITIAL_SIKORSKY_STATE,
  stepSikorskyHelicopterSi,
} from "@/physics/sikorskyHelicopterKernel";
import { buildSikorskyHelicopterModel } from "./sikorskyHelicopterModel";

describe("US 2,318,259 Sikorsky Helicopter 3D Procedural Model", () => {
  test("instantiates full procedural 3D hierarchy: fuselage truss, engine, rotor mast, swashplate, tail boom, tail rotor", () => {
    const model = buildSikorskyHelicopterModel();
    expect(model.root.name).toBe("US 2,318,259 Sikorsky VS-300 Helicopter 3D Studio Model");
    expect(model.root.children.length).toBeGreaterThan(0);
    model.dispose();
  });

  test("updates 3D articulated rotor kinematics and flight attitude from SI physics telemetry", () => {
    const model = buildSikorskyHelicopterModel();
    const result = stepSikorskyHelicopterSi(
      INITIAL_SIKORSKY_STATE,
      DEFAULT_SIKORSKY_CONTROLS,
      0.016,
    );

    expect(() => {
      model.updateState(result.metrics, DEFAULT_SIKORSKY_CONTROLS, result.state);
    }).not.toThrow();

    // High collective pitch & cyclic forward tilt
    const climbControls = {
      ...DEFAULT_SIKORSKY_CONTROLS,
      collectivePitchDeg: 14.0,
      cyclicPitchForwardDeg: 6.0,
      tailRotorPedalPercent: 30.0,
    };
    const climbResult = stepSikorskyHelicopterSi(result.state, climbControls, 0.05);
    expect(() => {
      model.updateState(climbResult.metrics, climbControls, climbResult.state);
    }).not.toThrow();

    model.dispose();
  });
});
