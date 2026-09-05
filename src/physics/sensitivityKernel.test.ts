import { describe, expect, test } from "bun:test";
import { allPatents } from "@/data/patents";
import {
  stepBellTelephone,
  stepEinsteinRefrigerator,
  stepEngelbartMouse,
  stepGoodyearRubber,
  stepHollerithTabulating,
  stepThomsonWelding,
  stepZeppelinAirship,
} from "./catalogKernels";

describe("Thomson and Goodyear sensitivities use the displayed model", () => {
  test("welding current uses the current I²R derivative, including one-sided endpoints", () => {
    const id = "us-347140-thomson-welding";
    for (const current of [1000, 2000, 4500, 5800, 6000]) {
      const params = { weldCurrentAmps: current, clampPressureMpa: 50 };
      const slope = computeParameterSensitivity(id, "weldCurrentAmps", params);
      expect(slope).toBeDefined();
      if (!slope) throw new Error("Expected slope");
      expect(slope.derivativeValue).toBeCloseTo(2 * current * 0.00018, 6);
      expect(slope.derivativeUnit).toBe("W / A");
      const lo = Math.max(1000, current - 0.01),
        hi = Math.min(6000, current + 0.01);
      const numerical =
        (stepThomsonWelding({ ...params, weldCurrentAmps: hi }).jouleWatts -
          stepThomsonWelding({ ...params, weldCurrentAmps: lo }).jouleWatts) /
        (hi - lo);
      expect(slope.derivativeValue).toBeCloseTo(numerical, 5);
      expect(
        computeParameterSensitivity(id, "currentAmperes", {
          currentAmperes: current,
          clampPressureMpa: 50,
        }),
      ).toEqual(slope);
    }
    expect(
      computeParameterSensitivity(id, "weldCurrentAmps", { weldCurrentAmps: 4500 })
        ?.derivativeValue,
    ).toBe(1.62);
  });

  test("welding pressure differentiates burr width before 0.1 mm display rounding", () => {
    for (const pressure of [10, 35, 60]) {
      const slope = computeParameterSensitivity("us-347140-thomson-welding", "clampPressureMpa", {
        clampPressureMpa: pressure,
        weldCurrentAmps: 5800,
      });
      expect(slope).toBeDefined();
      if (!slope) throw new Error("Expected slope");
      expect(slope.derivativeUnit).toBe("mm / MPa");
      const lo = Math.max(10, pressure - 0.01),
        hi = Math.min(60, pressure + 0.01);
      const numerical =
        (stepThomsonWelding({ clampPressureMpa: hi }).upsetBurrWidthMmUnrounded -
          stepThomsonWelding({ clampPressureMpa: lo }).upsetBurrWidthMmUnrounded) /
        (hi - lo);
      expect(slope.derivativeValue).toBeCloseTo(numerical, 6);
    }
  });

  test("rubber stretch slope follows sulfur and cure state instead of a fixed modulus", () => {
    const id = "us-3633-goodyear-rubber";
    for (const vulcanTemp of [110, 145, 190]) {
      for (const sulfurPct of [0, 4, 8, 30]) {
        for (const stretch of [1, 1.8, 2.1, 2.5]) {
          const params = {
            vulcanTemp,
            sulfurPct,
            appliedTensileStretch: stretch,
            specimenTempC: 20,
          };
          const slope = computeParameterSensitivity(id, "appliedTensileStretch", params);
          expect(slope).toBeDefined();
          if (!slope) throw new Error("Expected slope");
          const lo = Math.max(1, stretch - 1e-5),
            hi = Math.min(2.5, stretch + 1e-5);
          const probe = (lambda: number) =>
            stepGoodyearRubber(vulcanTemp, sulfurPct, 30, lambda, 20).stressMpaUnrounded;
          expect(slope.derivativeValue).toBeCloseTo((probe(hi) - probe(lo)) / (hi - lo), 2);
          expect(slope.derivativeUnit).toBe("MPa / λ");
          expect(slope.interpretation).toContain("illustrative");
        }
      }
    }
    const common = { vulcanTemp: 145, appliedTensileStretch: 2.1 };
    const low = computeParameterSensitivity(id, "appliedTensileStretch", {
      ...common,
      sulfurPct: 4,
    });
    expect(low).toBeDefined();
    if (!low) throw new Error("Expected low");
    const high = computeParameterSensitivity(id, "appliedTensileStretch", {
      ...common,
      sulfurPct: 8,
    });
    expect(high).toBeDefined();
    if (!high) throw new Error("Expected high");
    expect(low.derivativeValue).toBeCloseTo(11.734, 4);
    expect(high.derivativeValue).toBeCloseTo(23.4802, 4);
    expect(high.derivativeValue).toBeGreaterThan(low.derivativeValue * 1.99);
    expect(
      computeParameterSensitivity(id, "stretch", { vulcanTemp: 145, sulfurPct: 8, stretch: 2.1 }),
    ).toEqual(high);
  });

  test("out-of-range and non-finite controls do not produce plausible-looking slopes", () => {
    for (const invalid of [0, 999, 6001, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(
        computeParameterSensitivity("us-347140-thomson-welding", "weldCurrentAmps", {
          weldCurrentAmps: invalid,
        }),
      ).toBeNull();
    }
    for (const invalid of [9, 61])
      expect(
        computeParameterSensitivity("us-347140-thomson-welding", "clampPressureMpa", {
          clampPressureMpa: invalid,
        }),
      ).toBeNull();
    for (const invalid of [0.99, 2.51, Number.NaN])
      expect(
        computeParameterSensitivity("us-3633-goodyear-rubber", "appliedTensileStretch", {
          appliedTensileStretch: invalid,
        }),
      ).toBeNull();
  });
});

import { stepClavelDeltaRobotTopology } from "./clavelDeltaRobotKernel";
import { readCrumpFdmControls, stepCrumpFdmSi } from "./crumpFdmKernel";
import { EDISON_DECLARED_FILAMENT_LENGTH_CM, stepEdisonRadiativeBalance } from "./edisonWasm";
import { readKamenSegwayControls, stepKamenSegwaySi } from "./kamenSegwayKernel";
import { computeParameterSensitivity } from "./sensitivityKernel";
import { PATENT_PHYSICS_REGISTRY } from "./telemetryData";
import {
  readWattCondenserControls,
  stepWattCondenser,
  WATT_CONTROL_RANGES,
} from "./wattCondenserKernel";

describe("Watt current-state sensitivities", () => {
  const id = "gb-913-watt-separate-condenser";
  const params = {
    boilerPressurePsi: 6,
    condenserTempC: 50,
    cylinderBoreInches: 60,
    pistonStrokeFeet: 8,
    strokesPerMinute: 20,
    hasSeparateCondenser: 1,
    hasSteamJacket: 1,
  };

  test("continuous slopes match dimensional power and saturation-pressure derivatives", () => {
    const volume = (Math.PI / 4) * (60 * 0.0254) ** 2 * (8 * 0.3048);
    const sat = (10 ** (8.07131 - 1730.63 / (233.426 + 50)) * 101.325) / 760;
    const hp = (((101.325 + 6 * 6.89476 - sat - 6) * volume * 20) / 60) * 1.34102;
    const expected: Record<string, [number, string]> = {
      boilerPressurePsi: [((6.89476 * volume * 20) / 60) * 1.34102, "hp / psi"],
      cylinderBoreInches: [(2 * hp) / 60, "hp / in"],
      pistonStrokeFeet: [hp / 8, "hp / ft"],
      strokesPerMinute: [hp / 20, "hp / spm"],
      condenserTempC: [(sat * Math.LN10 * 1730.63) / (233.426 + 50) ** 2, "kPa / °C"],
    };
    for (const [key, [value, unit]] of Object.entries(expected)) {
      const sensitivity = computeParameterSensitivity(id, key, params);
      expect(sensitivity).not.toBeNull();
      if (!sensitivity) throw new Error(`Missing sensitivity for ${key}`);
      expect(sensitivity.derivativeUnit).toBe(unit);
      expect(Math.abs(sensitivity.derivativeValue - value) / value).toBeLessThan(5e-6);
    }
    expect(computeParameterSensitivity(id, "boilerPressure", params)).toEqual(
      computeParameterSensitivity(id, "boilerPressurePsi", params),
    );
  });

  test("Newcomen power is pressure-independent and the cold condenser floor is locally flat", () => {
    expect(
      computeParameterSensitivity(id, "boilerPressurePsi", { ...params, hasSeparateCondenser: 0 })
        ?.derivativeValue,
    ).toBe(0);
    expect(
      computeParameterSensitivity(id, "condenserTempC", { ...params, condenserTempC: 20 })
        ?.derivativeValue,
    ).toBe(0);
    const kink = 1730.63 / (8.07131 - Math.log10((3.5 * 760) / 101.325)) - 233.426;
    expect(
      computeParameterSensitivity(id, "condenserTempC", { ...params, condenserTempC: kink }),
    ).toBeNull();
  });

  test("discrete apparatus effects use the current operating point and explicit units", () => {
    const controls = readWattCondenserControls(params);
    const on = stepWattCondenser(controls);
    const noCondenser = stepWattCondenser({ ...controls, hasSeparateCondenser: false });
    const noJacket = stepWattCondenser({ ...controls, hasSteamJacket: false });
    const condenser = computeParameterSensitivity(id, "hasSeparateCondenser", params);
    const jacket = computeParameterSensitivity(id, "hasSteamJacket", params);
    if (!condenser || !jacket) throw new Error("Missing discrete sensitivity result");
    expect(condenser.derivativeValue).toBeCloseTo(
      on.indicatedHorsepower - noCondenser.indicatedHorsepower,
      3,
    );
    expect(condenser.derivativeUnit).toBe("hp");
    expect(jacket.derivativeValue).toBeCloseTo(on.heatInputRateKw - noJacket.heatInputRateKw, 2);
    expect(jacket.derivativeValue).toBeLessThan(0);
    expect(jacket.derivativeUnit).toBe("kW");
    expect(jacket.interpretation).toContain("not a continuous derivative");
    expect(
      computeParameterSensitivity(id, "hasSteamJacket", { ...params, hasSeparateCondenser: 0 })
        ?.derivativeValue,
    ).toBe(0);
  });

  test("clamped inputs and supported endpoints have no displayed continuous derivative", () => {
    for (const [key, range] of Object.entries(WATT_CONTROL_RANGES)) {
      for (const value of [range.min - 1, range.min, range.max, range.max + 1]) {
        expect(computeParameterSensitivity(id, key, { ...params, [key]: value })).toBeNull();
      }
    }
  });
});

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

  test("Bell telephone computes modulated signal current sensitivity and matches numerical difference", () => {
    const id = "us-174465-bell-telephone";
    for (const voiceAmplitude of [40, 60, 75, 90, 95]) {
      for (const airGap of [0.1, 0.35, 0.8]) {
        const params = { voiceAmplitude, airGap };
        const sens = computeParameterSensitivity(id, "voiceAmplitude", params);
        expect(sens).toBeDefined();
        expect(sens?.metricName).toBe("Modulated Signal Current");
        expect(sens?.derivativeSymbol).toBe("∂I_mod / ∂SPL");
        expect(sens?.derivativeUnit).toBe("mA / dB");
        expect(sens?.derivativeValue).toBeGreaterThan(0);

        const eps = 1e-4;
        const lo = Math.max(40, voiceAmplitude - eps);
        const hi = Math.min(95, voiceAmplitude + eps);
        const numDiff =
          (stepBellTelephone({ ...params, voiceAmplitude: hi }).modulatedMaUnrounded -
            stepBellTelephone({ ...params, voiceAmplitude: lo }).modulatedMaUnrounded) /
          (hi - lo);
        expect(sens?.derivativeValue).toBeCloseTo(numDiff, 4);
      }
    }

    // Invalid parameters
    for (const invalid of [39, 96, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "voiceAmplitude", { voiceAmplitude: invalid }),
      ).toBeNull();
    }
  });

  test("Einstein refrigerator computes evaporator duty from current cycle COP and state", () => {
    const id = "us-1781541-einstein-refrigerator";
    // Default operating point
    const defaultSens = computeParameterSensitivity(id, "heatInput", {});
    expect(defaultSens).toBeDefined();
    expect(defaultSens?.metricName).toBe("Refrigeration Evaporator Duty");
    expect(defaultSens?.derivativeSymbol).toBe("∂Q_evap / ∂Q_gen");
    expect(defaultSens?.derivativeUnit).toBe("W / W");
    const defaultState = stepEinsteinRefrigerator({});
    expect(defaultSens?.derivativeValue).toBe(defaultState.cop);

    // Varied pressure and ammonia ratio
    for (const totalPressure of [8, 15, 20]) {
      for (const ammoniaRatio of [0.45, 0.65, 0.85]) {
        const params = { heatInput: 250, totalPressure, ammoniaRatio };
        const sens = computeParameterSensitivity(id, "heatInput", params);
        expect(sens).toBeDefined();
        const state = stepEinsteinRefrigerator(params);
        expect(sens?.derivativeValue).toBe(state.cop);
      }
    }

    // Refusal when Claim 1 liquid-lift path is withheld
    const withheldSens = computeParameterSensitivity(id, "heatInput", {
      claim1LiftPathPresent: false,
    });
    expect(withheldSens).toBeDefined();
    expect(withheldSens?.derivativeValue).toBe(0);
    expect(withheldSens?.interpretation).toContain("withheld");

    // Invalid heat input or pressure
    for (const invalid of [79, 501, Number.NaN]) {
      expect(computeParameterSensitivity(id, "heatInput", { heatInput: invalid })).toBeNull();
    }
    expect(computeParameterSensitivity(id, "heatInput", { totalPressure: 5 })).toBeNull();
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

  test("Bardeen refuses derivatives absent from the source-reported samples", () => {
    for (const control of [
      "operatingSample",
      "pointSpacingMils",
      "claim1Active",
      "emitterCurrent",
      "pointSpacing",
    ]) {
      expect(computeParameterSensitivity("us-2524035-bardeen-transistor", control, {})).toBeNull();
    }
  });

  test("Noyce exposes only identity sensitivities for source-display geometry", () => {
    expect(
      computeParameterSensitivity("us-2981877-noyce-ic", "oxideThicknessUm", {
        oxideThicknessUm: 1,
      }),
    ).toMatchObject({
      metricName: "Displayed Oxide Thickness",
      derivativeValue: 1,
      derivativeUnit: "µm / µm",
    });
    expect(
      computeParameterSensitivity("us-2981877-noyce-ic", "leadStripWidthFraction", {
        leadStripWidthFraction: 0.12,
      }),
    ).toMatchObject({
      metricName: "Displayed Lead Width Fraction",
      derivativeValue: 1,
    });
    expect(computeParameterSensitivity("us-2981877-noyce-ic", "reverseBias", {})).toBeNull();
  });

  test("Kilby exposes only identity sensitivities for source-display geometry", () => {
    expect(
      computeParameterSensitivity(
        "us-3138743-kilby-integrated-circuit",
        "sectionRevealFraction",
        {},
      ),
    ).toMatchObject({
      metricName: "Displayed Semiconductor Section Reveal",
      derivativeValue: 1,
      derivativeUnit: "fraction / fraction",
    });
    expect(
      computeParameterSensitivity("us-3138743-kilby-integrated-circuit", "wireArchFraction", {}),
    ).toMatchObject({ metricName: "Displayed Wire 70 Arch", derivativeValue: 1 });
    expect(
      computeParameterSensitivity("us-3138743-kilby-integrated-circuit", "reverseBiasVoltageV", {}),
    ).toBeNull();
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
      "us-2524035-bardeen-transistor",
      "us-2988237-devol-programmed-transfer",
      "us-3081379-lemelson-machine-vision",
      "us-3313014-lemelson-automatic-production",
      "us-3858232-boyle-smith-ccd",
      "us-3858581-kamen-medication-injection-device",
      "us-4098001-watson-remote-center-compliance",
      "us-4098001-watson-rcc",
      "us-4512709-milacron-robot-toolchanger",
      "us-5701965-kamen-transporter",
      "us-586193-marconi-radio",
      "us-6331181-davinci",
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

  test("reports Milacron's exact source-sequence sensitivity without inventing SI mechanics", () => {
    const openRegistration = computeParameterSensitivity(
      "us-4512709-milacron-robot-toolchanger",
      "registrationFraction",
      { toolBasePresent: 1, registrationFraction: 0.5, lockingSlideFraction: 0 },
    );
    expect(openRegistration?.derivativeValue).toBe(1);
    expect(openRegistration?.derivativeUnit).toBe("normalized / normalized");

    const blockedRegistration = computeParameterSensitivity(
      "us-4512709-milacron-robot-toolchanger",
      "registrationFraction",
      { toolBasePresent: 1, registrationFraction: 0.5, lockingSlideFraction: 1 },
    );
    expect(blockedRegistration?.derivativeValue).toBe(0);
    expect(blockedRegistration?.interpretation).toContain("interlock blocks");

    const topologyToggle = computeParameterSensitivity(
      "us-4512709-milacron-robot-toolchanger",
      "claimFourTMember",
      { toolBasePresent: 1, registrationFraction: 1, lockingSlideFraction: 1 },
    );
    expect(topologyToggle?.derivativeSymbol).toBe("Δstate / Δtoggle");
    expect(topologyToggle?.interpretation).toContain("not a continuous derivative");
  });

  test("Marconi refuses derivatives for illustrative dimensions absent from US 586,193", () => {
    expect(computeParameterSensitivity("us-586193-marconi-radio", "antennaHeightM", {})).toBeNull();
    expect(computeParameterSensitivity("us-586193-marconi-radio", "sparkVoltageKv", {})).toBeNull();
  });

  test("Boyle–Smith refuses derivatives absent from the source-disclosed CCD timing relation", () => {
    expect(
      computeParameterSensitivity("us-3858232-boyle-smith-ccd", "clockStepRateHz", {}),
    ).toBeNull();
    expect(
      computeParameterSensitivity("us-3858232-boyle-smith-ccd", "pulseDepthNormalized", {}),
    ).toBeNull();
  });

  test("Kamen transporter refuses a continuous derivative for its discrete source topology", () => {
    expect(
      computeParameterSensitivity("us-5701965-kamen-transporter", "topologyState", {}),
    ).toBeNull();
  });

  test("Makino differentiates the selected closure branch and fixes Claim 6 attitude", () => {
    const params = {
      firstLinkAngleDeg: 32,
      fourthLinkAngleDeg: -38,
      topologyVariant: 1,
    };
    const first = computeParameterSensitivity(
      "us-4341502-makino-scara",
      "firstLinkAngleDeg",
      params,
    );
    const fourth = computeParameterSensitivity(
      "us-4341502-makino-scara",
      "fourthLinkAngleDeg",
      params,
    );
    expect(first).toMatchObject({
      metricName: "End-Effector X Coordinate",
      derivativeUnit: "norm / deg",
    });
    expect(first?.derivativeValue).toBeCloseTo(
      -Math.sin((32 * Math.PI) / 180) * (Math.PI / 180),
      5,
    );
    expect(fourth?.derivativeValue).toBeCloseTo(
      Math.cos((-38 * Math.PI) / 180) * (Math.PI / 180),
      5,
    );
    expect(
      computeParameterSensitivity("us-4341502-makino-scara", "toolAttitudeDeg", params),
    ).toMatchObject({ derivativeValue: 1, derivativeUnit: "deg / deg" });
    expect(
      computeParameterSensitivity("us-4341502-makino-scara", "toolAttitudeDeg", {
        ...params,
        topologyVariant: 3,
      }),
    ).toMatchObject({ derivativeValue: 0, derivativeUnit: "deg / deg" });
  });

  test("unknown patent returns null cleanly without throwing", () => {
    const res = computeParameterSensitivity("us-unknown-id", "someControl", {});
    expect(res).toBeNull();
  });
});

describe("Sensitivities follow the current admitted operating point", () => {
  function central(probe: (value: number) => number, value: number, h: number) {
    return (probe(value + h) - probe(value - h)) / (2 * h);
  }

  test("Edison uses the selected resistance and canonical voltage, including 110 V / 200 Ω", () => {
    for (const resistance of [100, 145, 200, 350, 500]) {
      for (const voltage of [0, 55, 110, 150]) {
        const params = { voltage, hotResistanceOhm: resistance };
        const result = computeParameterSensitivity("us-223898-edison-lightbulb", "voltage", params);
        expect(result?.derivativeValue).toBeCloseTo((2 * voltage) / resistance, 5);
        expect(result?.derivativeUnit).toBe("W / V");
        if (voltage > 0) {
          const probe = (voltageV: number) => {
            const state = stepEdisonRadiativeBalance({
              voltageV,
              hotResistanceOhm: resistance,
              filamentLengthCm: EDISON_DECLARED_FILAMENT_LENGTH_CM,
            });
            expect(state).not.toBeNull();
            return state?.joule_power_w ?? 0;
          };
          expect(result?.derivativeValue).toBeCloseTo(central(probe, voltage, 0.01), 5);
        }
      }
    }
    expect(
      computeParameterSensitivity("us-223898-edison-lightbulb", "voltage", {
        voltage: 110,
        mainsVoltageV: 220,
        hotResistanceOhm: 200,
      })?.derivativeValue,
    ).toBe(1.1);
  });

  test("Edison adds the negative resistance sensitivity without leaving the source range", () => {
    for (const resistance of [100, 200, 500]) {
      const result = computeParameterSensitivity("us-223898-edison-lightbulb", "hotResistanceOhm", {
        voltage: 110,
        hotResistanceOhm: resistance,
      });
      expect(result?.derivativeValue).toBeCloseTo(-(110 ** 2) / resistance ** 2, 5);
      expect(result?.derivativeUnit).toBe("W / Ω");
    }
    for (const resistance of [0, 99, 501, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(
        computeParameterSensitivity("us-223898-edison-lightbulb", "voltage", {
          voltage: 110,
          hotResistanceOhm: resistance,
        }),
      ).toBeNull();
    }
  });

  test("Crump temperature slope scales with the actual Arrhenius viscosity", () => {
    for (const referenceViscosityPaS of [100, 280, 650]) {
      for (const nozzleTempC of [205, 230, 260]) {
        const params = {
          referenceViscosityPaS,
          nozzleTempC,
          printSpeedMmS: 20,
          pinchRollerForceN: 120,
        };
        const result = computeParameterSensitivity("us-5121329-crump-fdm", "nozzleTempC", params);
        const state = stepCrumpFdmSi(readCrumpFdmControls(params));
        expect(state.refusalReason).toBeUndefined();
        const exact = (-48 / (8.314e-3 * (nozzleTempC + 273.15) ** 2)) * state.apparentViscosityPaS;
        expect(result?.derivativeValue).toBeCloseTo(exact, 4);
        expect(result?.derivativeValue).toBeCloseTo(
          central(
            (temperature) =>
              stepCrumpFdmSi(readCrumpFdmControls({ ...params, nozzleTempC: temperature }))
                .apparentViscosityPaS,
            nozzleTempC,
            0.01,
          ),
          4,
        );
      }
    }
  });

  test("Crump flow and cooling derivatives follow nondefault road geometry", () => {
    const params = {
      roadWidthMm: 0.6,
      layerHeightMm: 0.25,
      printSpeedMmS: 15,
      pinchRollerForceN: 120,
    };
    expect(
      computeParameterSensitivity("us-5121329-crump-fdm", "printSpeedMmS", params)?.derivativeValue,
    ).toBeCloseTo(0.6 * 0.25, 6);
    expect(
      computeParameterSensitivity("us-5121329-crump-fdm", "layerHeightMm", params)?.derivativeValue,
    ).toBeCloseTo(
      central(
        (height) =>
          stepCrumpFdmSi(readCrumpFdmControls({ ...params, layerHeightMm: height }))
            .coolingTimeConstantSec,
        0.25,
        0.001,
      ),
      5,
    );
  });

  test("Crump does not differentiate across input clamps or a refused extrusion state", () => {
    const invalidStates: Record<string, number>[] = [
      { nozzleTempC: 150 },
      { nozzleTempC: 300 },
      { nozzleTempC: 310 },
      { nozzleTempC: Number.NaN },
      { claim1ApparatusEnabled: 0 },
      { claim2HeatingEnabled: 0 },
    ];
    for (const params of invalidStates) {
      expect(computeParameterSensitivity("us-5121329-crump-fdm", "nozzleTempC", params)).toBeNull();
    }
    expect(
      computeParameterSensitivity("us-5121329-crump-fdm", "printSpeedMmS", { printSpeedMmS: 5 }),
    ).toBeNull();
  });

  test("Clavel follows normalized closed-chain height with all three current inputs", () => {
    for (const params of [
      { armOneInput: 0, armTwoInput: 0, armThreeInput: 0 },
      { armOneInput: 0.2, armTwoInput: -0.15, armThreeInput: 0.1 },
    ]) {
      for (const key of ["armOneInput", "armTwoInput", "armThreeInput"] as const) {
        const result = computeParameterSensitivity("us-4976582-clavel-delta-robot", key, params);
        const expected = central(
          (value) => stepClavelDeltaRobotTopology({ ...params, [key]: value }).platformCenter[1],
          params[key],
          0.0001,
        );
        expect(result?.derivativeValue).toBeCloseTo(expected, 5);
        expect(result?.derivativeUnit).toBe("normalized / input fraction");
      }
    }
    expect(
      computeParameterSensitivity("us-4976582-clavel-delta-robot", "armOneInput", {
        claim1TopologyEnabled: 0,
      }),
    ).toBeNull();
    expect(
      computeParameterSensitivity("us-4976582-clavel-delta-robot", "armOneInput", {
        armOneInput: 1,
      }),
    ).toBeNull();
  });

  test("Segway gradients change with rider mass and the live balancing-margin model", () => {
    for (const riderMassKg of [45, 75, 110]) {
      const params = { riderMassKg, riderPitchDeg: 3, groundFrictionCoeff: 0.85, speedLimitMS: 4 };
      for (const [key, output] of [
        ["riderPitchDeg", "gravityOverturningTorqueNm"],
        ["groundFrictionCoeff", "maxTractionForceN"],
        ["speedLimitMS", "balancingMarginRatio"],
      ] as const) {
        const result = computeParameterSensitivity("us-6302230-kamen-segway", key, params);
        const expected = central(
          (value) =>
            stepKamenSegwaySi(readKamenSegwayControls({ ...params, [key]: value }))[output],
          params[key],
          0.0001,
        );
        expect(result?.derivativeValue).toBeCloseTo(
          expected,
          key === "groundFrictionCoeff" ? 2 : 4,
        );
      }
      expect(
        computeParameterSensitivity("us-6302230-kamen-segway", "groundFrictionCoeff", params)
          ?.derivativeValue,
      ).toBeCloseTo((riderMassKg + 43) * 9.80665, 2);
      expect(
        computeParameterSensitivity("us-6302230-kamen-segway", "speedLimitMS", params)
          ?.derivativeValue,
      ).toBeLessThan(0);
    }
    expect(
      computeParameterSensitivity("us-6302230-kamen-segway", "riderPitchDeg", {
        claim1BalanceEnabled: 0,
      }),
    ).toBeNull();
  });

  test("Zeppelin airship derives buoyant lift and pitch trim from admitted model", () => {
    const id = "us-621195-zeppelin-airship";
    for (const alt of [0, 300, 1000, 2000]) {
      for (const inflation of [75, 85, 95, 100]) {
        const params = { flightAlt: alt, gasInflation: inflation };
        const sens = computeParameterSensitivity(id, "gasInflation", params);
        expect(sens).toBeDefined();
        expect(sens?.metricName).toBe("Gross Aerostatic Buoyant Lift");
        expect(sens?.derivativeSymbol).toBe("∂L_buoy / ∂%_inflation");
        expect(sens?.derivativeUnit).toBe("N / %");
        const zep = stepZeppelinAirship(params);
        expect(sens?.derivativeValue).toBeCloseTo(zep.buoyantSlopeNPerPct, 1);
      }
    }

    // Trim weight sensitivity
    const trimSens = computeParameterSensitivity(id, "trimWeight", { trimWeight: 5 });
    expect(trimSens).toBeDefined();
    expect(trimSens?.metricName).toBe("Longitudinal Pitch Trim");
    expect(trimSens?.derivativeSymbol).toBe("∂θ_pitch / ∂x_trim");
    expect(trimSens?.derivativeUnit).toBe("deg / m");
    expect(trimSens?.derivativeValue).toBeCloseTo((300 * 9.81) / 15000, 4);

    // Invalid parameters
    for (const invalid of [74, 101, Number.NaN]) {
      expect(computeParameterSensitivity(id, "gasInflation", { gasInflation: invalid })).toBeNull();
    }
    expect(computeParameterSensitivity(id, "gasInflation", { flightAlt: -1 })).toBeNull();
    expect(computeParameterSensitivity(id, "trimWeight", { trimWeight: 20 })).toBeNull();
  });

  test("Sikorsky helicopter derives thrust and yaw sensitivity from scenario state", () => {
    const id = "us-2318259-sikorsky-helicopter";
    // Baseline collective pitch sensitivity
    const collSens = computeParameterSensitivity(id, "collectivePitchDeg", {});
    expect(collSens).toBeDefined();
    expect(collSens?.metricName).toBe("Main Rotor Thrust");
    expect(collSens?.derivativeSymbol).toBe("∂T_main / ∂θ_coll");
    expect(collSens?.derivativeUnit).toBe("N / deg");
    expect(collSens?.derivativeValue).toBeGreaterThan(500);

    // Tail rotor anti-torque sensitivity when enabled vs disabled
    const pedalEnabled = computeParameterSensitivity(id, "tailRotorPedalPercent", {
      auxiliaryRotorEnabled: 1,
    });
    expect(pedalEnabled).toBeDefined();
    expect(pedalEnabled?.derivativeValue).toBe(-21.6);
    expect(pedalEnabled?.derivativeUnit).toBe("N·m / %");

    const pedalDisabled = computeParameterSensitivity(id, "tailRotorPedalPercent", {
      auxiliaryRotorEnabled: 0,
    });
    expect(pedalDisabled).toBeDefined();
    expect(pedalDisabled?.derivativeValue).toBe(0);
    expect(pedalDisabled?.interpretation).toContain("disabled");

    // Engine throttle sensitivity when running vs autorotating
    const throttleRunning = computeParameterSensitivity(id, "engineThrottlePercent", {
      engineRunning: 1,
    });
    expect(throttleRunning).toBeDefined();
    expect(throttleRunning?.derivativeValue).toBe(0.8);

    const throttleOff = computeParameterSensitivity(id, "engineThrottlePercent", {
      engineRunning: 0,
    });
    expect(throttleOff).toBeDefined();
    expect(throttleOff?.derivativeValue).toBe(0);
    expect(throttleOff?.interpretation).toContain("autorotation");

    // Invalid parameters
    for (const invalid of [1.9, 16.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "collectivePitchDeg", { collectivePitchDeg: invalid }),
      ).toBeNull();
    }
    expect(
      computeParameterSensitivity(id, "tailRotorPedalPercent", { tailRotorPedalPercent: 105 }),
    ).toBeNull();
  });

  test("Hollerith tabulator derives tally rate, solenoid force, and voltage sensitivities", () => {
    const id = "us-395781-hollerith-tabulating";

    for (const cpm of [20, 40, 60, 90]) {
      const sens = computeParameterSensitivity(id, "cardsPerMin", { cardsPerMin: cpm });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Electromechanical Dial Tally Rate");
      expect(sens?.derivativeValue).toBe(1.0);
      expect(sens?.derivativeUnit).toBe("tallies/min / (card/min)");
    }

    for (const v of [6, 12, 18, 24]) {
      const sens = computeParameterSensitivity(id, "batteryVolts", { batteryVolts: v });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Solenoid Electromagnetic Tractive Force");
      expect(sens?.derivativeUnit).toBe("N / V");
      const hol = stepHollerithTabulating({ supplyVoltageV: v });
      expect(sens?.derivativeValue).toBeCloseTo(hol.forceVoltageSlopeNPerV, 2);
    }

    for (const relays of [1, 10, 16, 32, 40]) {
      const sens = computeParameterSensitivity(id, "activeRelays", { activeRelays: relays });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Solenoid Total Attraction Force");
      expect(sens?.derivativeUnit).toBe("N / relay");
      const hol = stepHollerithTabulating({ activeRelays: relays });
      expect(sens?.derivativeValue).toBeCloseTo(hol.forceRelaySlopeNPerRelay, 2);
    }

    // Invalid parameters
    for (const invalid of [19, 91, Number.NaN]) {
      expect(computeParameterSensitivity(id, "cardsPerMin", { cardsPerMin: invalid })).toBeNull();
    }
    for (const invalid of [5, 25, Number.NaN]) {
      expect(computeParameterSensitivity(id, "batteryVolts", { batteryVolts: invalid })).toBeNull();
    }
    for (const invalid of [0, 41, Number.NaN]) {
      expect(computeParameterSensitivity(id, "activeRelays", { activeRelays: invalid })).toBeNull();
    }
  });

  test("Engelbart mouse derives angular velocity and pulse rate sensitivities from rolling model", () => {
    const id = "us-3541541-engelbart-mouse";

    for (const v of [100, 250, 350, 800]) {
      const sens = computeParameterSensitivity(id, "mouseSpeed", {
        mouseSpeed: v,
        wheelRadius: 10,
      });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Wheel Angular Velocity");
      expect(sens?.derivativeSymbol).toBe("∂ω / ∂v_mouse");
      expect(sens?.derivativeUnit).toBe("(rad/s) / (mm/s)");
      const mouse = stepEngelbartMouse({ mouseSpeed: v, wheelRadius: 10 });
      expect(sens?.derivativeValue).toBeCloseTo(mouse.omegaSpeedSlopeRadPerSPerMmPerS, 4);
    }

    for (const r of [6, 10, 14, 18]) {
      const sens = computeParameterSensitivity(id, "wheelRadius", {
        mouseSpeed: 350,
        wheelRadius: r,
      });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Wheel Angular Velocity");
      expect(sens?.derivativeSymbol).toBe("∂ω / ∂R_wheel");
      expect(sens?.derivativeUnit).toBe("(rad/s) / mm");
      const mouse = stepEngelbartMouse({ mouseSpeed: 350, wheelRadius: r });
      expect(sens?.derivativeValue).toBeCloseTo(mouse.omegaRadiusSlopeRadPerSPerMm, 3);
    }

    for (const ppr of [50, 100, 200, 400]) {
      const sens = computeParameterSensitivity(id, "pulsesPerRev", {
        mouseSpeed: 350,
        wheelRadius: 10,
        pulsesPerRev: ppr,
      });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Encoder Pulse Generation Rate");
      expect(sens?.derivativeSymbol).toBe("∂f_pulse / ∂N_ppr");
      expect(sens?.derivativeUnit).toBe("Hz / (pulse/rev)");
      expect(sens?.derivativeValue).toBeCloseTo(350 / (2 * Math.PI * 10), 2);
    }

    // Invalid parameters
    for (const invalid of [99, 801, Number.NaN]) {
      expect(computeParameterSensitivity(id, "mouseSpeed", { mouseSpeed: invalid })).toBeNull();
    }
    for (const invalid of [5, 19, Number.NaN]) {
      expect(computeParameterSensitivity(id, "wheelRadius", { wheelRadius: invalid })).toBeNull();
    }
    for (const invalid of [19, 401, Number.NaN]) {
      expect(computeParameterSensitivity(id, "pulsesPerRev", { pulsesPerRev: invalid })).toBeNull();
    }
  });
});
