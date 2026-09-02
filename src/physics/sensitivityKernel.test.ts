import { describe, expect, test } from "bun:test";
import { allPatents } from "@/data/patents";
import { computeParameterSensitivity } from "./sensitivityKernel";
import { PATENT_PHYSICS_REGISTRY } from "./telemetryData";

describe("Parameter Sensitivity Kernel & Analytical Derivatives", () => {
  test("Wright Flyer computes finite-difference sensitivity for wing warp and airspeed", () => {
    const warpSens = computeParameterSensitivity("us-821393-wright-flyer", "wingWarp", {
      wingWarp: 5.0,
      rudder: 0,
      coupled: 0,
    });
    expect(warpSens).toBeDefined();
    expect(warpSens?.metricName).toBe("Adverse Yaw Moment");
    expect(warpSens?.derivativeSymbol).toBe("∂N / ∂δ_warp");
    expect(warpSens?.derivativeUnit).toBe("N·m / deg");

    const speedSens = computeParameterSensitivity("us-821393-wright-flyer", "airspeed", {
      airspeed: 28.0,
    });
    expect(speedSens).toBeDefined();
    expect(speedSens?.metricName).toBe("Aerodynamic Lift");
  });

  test("Edison lightbulb computes Stefan-Boltzmann thermal radiation sensitivity", () => {
    const sens = computeParameterSensitivity("us-223898-edison-lightbulb", "voltage", {
      voltage: 110.0,
    });
    expect(sens).toBeDefined();
    expect(sens?.metricName).toBe("Filament Joule Heat");
    expect(sens?.derivativeSymbol).toBe("∂P / ∂V");
  });

  test("Bell telephone computes Faraday induction acoustic sensitivity", () => {
    const sens = computeParameterSensitivity("us-174465-bell-telephone", "voiceAmplitude", {});
    expect(sens).toBeDefined();
    expect(sens?.metricName).toBe("Induced Electromagnetic Potential");
    expect(sens?.derivativeValue).toBeGreaterThan(0);
  });

  test("Morse telegraph computes relay electromagnetic force sensitivity", () => {
    const sens = computeParameterSensitivity("us-1647-morse-telegraph", "currentMa", {});
    expect(sens).toBeDefined();
    expect(sens?.metricName).toBe("Relay Magnetomotive Force");
  });

  test("Westinghouse air brake computes fail-safe negative clamping force gradient", () => {
    const sens = computeParameterSensitivity(
      "us-124404-westinghouse-air-brake",
      "trainPipePressure",
      {},
    );
    expect(sens).toBeDefined();
    expect(sens?.derivativeValue).toBeLessThan(0);
  });

  test("Bardeen transistor computes point-contact alpha current gain sensitivity", () => {
    const sens = computeParameterSensitivity("us-2524035-bardeen-transistor", "emitterCurrent", {});
    expect(sens).toBeDefined();
    expect(sens?.derivativeValue).toBeGreaterThan(1.0); // Alpha > 1
  });

  test("Otis exposes only its declared normalized display-rate sensitivity", () => {
    const sens = computeParameterSensitivity("us-31128-otis-elevator", "displayRatePct", {});
    expect(sens).toBeDefined();
    expect(sens?.metricName).toBe("Declared Coordinate-Speed Magnitude");
    expect(sens?.derivativeValue).toBe(0.0012);
    expect(sens?.interpretation).toContain("not a historical speed");
    expect(computeParameterSensitivity("us-31128-otis-elevator", "cabPayload", {})).toBeNull();
  });

  test("Salisbury differentiates the printed Figure 3 tendon-to-torque map", () => {
    const sens = computeParameterSensitivity("us-4921293-salisbury-robot-hand", "tensionT1N", {
      radiusScaleMm: 10,
    });
    expect(sens).toMatchObject({
      metricName: "Figure 3 First-Joint Torque",
      derivativeSymbol: "∂τ₁ / ∂T₁",
      derivativeValue: -0.012,
      derivativeUnit: "N·m / N",
    });
    expect(sens?.interpretation).toContain("printed first-joint equation");
    expect(
      computeParameterSensitivity("us-4921293-salisbury-robot-hand", "graspForceN", {}),
    ).toBeNull();
  });

  test("all non-refused patents in registry with valid controls return non-null sensitivities", () => {
    const refused = new Set([
      "us-135245-pasteur-fermentation",
      "us-233692-pelton-water-wheel",
      "us-307031-edison-indicator",
      "us-361931-daimler-engine",
      "us-2495429-spencer-microwave",
      "us-2988237-devol-programmed-transfer",
      "us-3313014-lemelson-automatic-production",
      "us-3858581-kamen-medication-injection-device",
      "us-4098001-watson-remote-center-compliance",
      "us-4098001-watson-rcc",
      "us-4512709-milacron-robot-toolchanger",
    ]);

    for (const patent of allPatents) {
      if (refused.has(patent.id)) continue;
      const reg = PATENT_PHYSICS_REGISTRY[patent.id];
      if (!reg || reg.controls.length === 0) continue;

      const recognized = reg.controls.filter(
        (c) => computeParameterSensitivity(patent.id, c.id, {}) !== null,
      );
      expect(recognized.length).toBeGreaterThanOrEqual(1);
    }
  });

  test("unknown patent returns null cleanly without throwing", () => {
    const res = computeParameterSensitivity("us-unknown-id", "someControl", {});
    expect(res).toBeNull();
  });
});
