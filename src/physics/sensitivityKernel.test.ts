import { describe, expect, test } from "bun:test";
import { allPatents } from "@/data/patents";
import {
  stepBaekelandBakelite,
  stepBellTelephone,
  stepCarlsonElectrophotography,
  stepCorlissEngine,
  stepDavenportMotor,
  stepDeForestAudion,
  stepDeLavalSeparator,
  stepEdisonPhonograph,
  stepEinsteinRefrigerator,
  stepEngelbartMouse,
  stepEricssonPropeller,
  stepFessendenWireless,
  stepGatlingGun,
  stepGliddenBarbedWire,
  stepGoodyearRubber,
  stepGrammeDynamo,
  stepHaberAmmonia,
  stepHallAluminium,
  stepHewittMercuryLamp,
  stepHollerithTabulating,
  stepLamarrRecordControl,
  stepLincolnBuoy,
  stepMorseTelegraph,
  stepOttoEngine,
  stepParsonsTurbine,
  stepTeslaTeleautomaton,
  stepThomsonWelding,
  stepWozniakApple,
  stepZeppelinAirship,
} from "./catalogKernels";
import { stepDieselEngine } from "./dieselEngineKernel";
import { FrankenSimEngine } from "./engine";
import { stepHoweSewingMachine } from "./machineKernels";

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

  test("Westinghouse air brake computes continuous braking clamping force gradient", () => {
    const sens = computeParameterSensitivity(
      "us-124404-westinghouse-air-brake",
      "trainPipePressure",
      {},
    );
    expect(sens).toBeDefined();
    expect(sens?.derivativeValue).toBeGreaterThan(0);
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

  test("Wozniak Apple II derives microprocessor clock and RAM sensitivities from master crystal", () => {
    const id = "us-4136359-wozniak-apple";

    for (const f of [10.0, 14.318, 20.0, 28.0]) {
      const sens = computeParameterSensitivity(id, "crystalFreq", { crystalFreq: f });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Microprocessor Clock Speed");
      expect(sens?.derivativeSymbol).toBe("∂f_cpu / ∂f_xtal");
      expect(sens?.derivativeUnit).toBe("MHz / MHz");
      const apple = stepWozniakApple({ crystalFreq: f });
      expect(sens?.derivativeValue).toBeCloseTo(apple.cpuClockSlopeMhzPerMhz, 4);
    }

    for (const ram of [4, 16, 32, 48]) {
      const sens = computeParameterSensitivity(id, "ramCapacityKb", { ramCapacityKb: ram });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Accessible Video & Program RAM");
      expect(sens?.derivativeSymbol).toBe("∂RAM / ∂Capacity");
      expect(sens?.derivativeValue).toBe(1.0);
      expect(sens?.derivativeUnit).toBe("KB / KB");
    }

    // Invalid parameters
    for (const invalid of [6.9, 28.1, Number.NaN]) {
      expect(computeParameterSensitivity(id, "crystalFreq", { crystalFreq: invalid })).toBeNull();
    }
    for (const invalid of [3, 49, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "ramCapacityKb", { ramCapacityKb: invalid }),
      ).toBeNull();
    }
  });

  test("Multi-Touch derives Claim 8 pinch scale and contact-count sensitivities", () => {
    const id = "us-7479949-multitouch";

    for (const sep of [15, 30, 50, 80, 120]) {
      const sens = computeParameterSensitivity(id, "fingerSeparationMm", {
        fingerSeparationMm: sep,
      });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Illustrative Pinch-to-Zoom Scale Ratio");
      expect(sens?.derivativeSymbol).toBe("∂S / ∂d_sep");
      expect(sens?.derivativeUnit).toBe("scale / mm");
      expect(sens?.derivativeValue).toBe(0.02);
    }

    for (const count of [0, 1, 2]) {
      const sens = computeParameterSensitivity(id, "fingerCount", { fingerCount: count });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Active Touch Contacts");
      expect(sens?.derivativeSymbol).toBe("∂Contacts / ∂Count");
      expect(sens?.derivativeUnit).toBe("pts / finger");
      expect(sens?.derivativeValue).toBe(1.0);
    }

    // Invalid parameters
    for (const invalid of [14, 121, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "fingerSeparationMm", { fingerSeparationMm: invalid }),
      ).toBeNull();
    }
    for (const invalid of [-1, 3, Number.NaN]) {
      expect(computeParameterSensitivity(id, "fingerCount", { fingerCount: invalid })).toBeNull();
    }
  });

  test("Corliss Steam Engine derives indicated power and thermal efficiency slopes", () => {
    const id = "us-6162-corliss-steam-engine";
    const h = 1e-5;

    // Steam pressure sensitivity vs finite differences
    for (const psi of [40, 60, 100, 140, 180]) {
      const sens = computeParameterSensitivity(id, "steamPressurePsi", {
        steamPressurePsi: psi,
        engineRpm: 65,
        cutoffPct: 25,
      });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Indicated Cylinder Power");
      expect(sens?.derivativeSymbol).toBe("∂IHP / ∂P_boiler");
      expect(sens?.derivativeUnit).toBe("HP / psi");
      const corliss = stepCorlissEngine({
        steamPressurePsi: psi,
        engineRpm: 65,
        cutoffPct: 25,
      });
      expect(sens?.derivativeValue).toBeCloseTo(corliss.ihpPressureSlopeHpPerPsiUnrounded, 2);

      const fPlus = stepCorlissEngine({
        steamPressurePsi: psi + h,
        engineRpm: 65,
        cutoffPct: 25,
      }).indicatedHpUnrounded;
      const fMinus = stepCorlissEngine({
        steamPressurePsi: psi - h,
        engineRpm: 65,
        cutoffPct: 25,
      }).indicatedHpUnrounded;
      const fd = (fPlus - fMinus) / (2 * h);
      expect(sens?.derivativeValue).toBeCloseTo(fd, 2);

      // Aliases
      for (const key of ["boilerPressurePsi", "boilerPressure", "pressure"]) {
        const aliasSens = computeParameterSensitivity(id, key, {
          [key]: psi,
          engineRpm: 65,
          cutoffPct: 25,
        });
        expect(aliasSens?.derivativeValue).toBe(sens?.derivativeValue);
      }
    }

    // Engine speed sensitivity vs finite differences
    for (const rpm of [30, 50, 65, 90, 120]) {
      const sens = computeParameterSensitivity(id, "engineRpm", {
        steamPressurePsi: 100,
        engineRpm: rpm,
        cutoffPct: 25,
      });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Flywheel Shaft Power");
      expect(sens?.derivativeSymbol).toBe("∂P / ∂RPM");
      expect(sens?.derivativeUnit).toBe("HP / RPM");
      const corliss = stepCorlissEngine({
        steamPressurePsi: 100,
        engineRpm: rpm,
        cutoffPct: 25,
      });
      expect(sens?.derivativeValue).toBeCloseTo(corliss.ihpRpmSlopeHpPerRpmUnrounded, 2);

      const fPlus = stepCorlissEngine({
        steamPressurePsi: 100,
        engineRpm: rpm + h,
        cutoffPct: 25,
      }).indicatedHpUnrounded;
      const fMinus = stepCorlissEngine({
        steamPressurePsi: 100,
        engineRpm: rpm - h,
        cutoffPct: 25,
      }).indicatedHpUnrounded;
      const fd = (fPlus - fMinus) / (2 * h);
      expect(sens?.derivativeValue).toBeCloseTo(fd, 2);

      // Alias rpm
      const aliasSens = computeParameterSensitivity(id, "rpm", {
        steamPressurePsi: 100,
        rpm,
        cutoffPct: 25,
      });
      expect(aliasSens?.derivativeValue).toBe(sens?.derivativeValue);
    }

    // Cut-off ratio sensitivity vs finite differences
    for (const cutoff of [10, 20, 25, 40, 60]) {
      const sens = computeParameterSensitivity(id, "cutoffPct", {
        steamPressurePsi: 100,
        engineRpm: 65,
        cutoffPct: cutoff,
      });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Expansion Thermal Efficiency");
      expect(sens?.derivativeSymbol).toBe("∂η_th / ∂Cutoff");
      expect(sens?.derivativeUnit).toBe("% / %");
      expect(sens?.derivativeValue).toBe(-0.12);

      const fPlus = stepCorlissEngine({
        steamPressurePsi: 100,
        engineRpm: 65,
        cutoffPct: cutoff + h,
      }).thermalEfficiencyPctUnrounded;
      const fMinus = stepCorlissEngine({
        steamPressurePsi: 100,
        engineRpm: 65,
        cutoffPct: cutoff - h,
      }).thermalEfficiencyPctUnrounded;
      const fd = (fPlus - fMinus) / (2 * h);
      expect(sens?.derivativeValue).toBeCloseTo(fd, 4);

      // Aliases
      for (const key of ["cutoff", "cutoffPercentage", "cutoffRatioPct"]) {
        const aliasSens = computeParameterSensitivity(id, key, {
          steamPressurePsi: 100,
          engineRpm: 65,
          [key]: cutoff,
        });
        expect(aliasSens?.derivativeValue).toBe(sens?.derivativeValue);
      }
    }

    // Defaults when omitted
    const defaultSens = computeParameterSensitivity(id, "steamPressurePsi", {});
    expect(defaultSens).toBeDefined();
    expect(defaultSens?.derivativeValue).toBe(
      Number(stepCorlissEngine({}).ihpPressureSlopeHpPerPsiUnrounded.toFixed(2)),
    );

    // Invalid / out-of-domain parameters
    for (const invalid of [39.9, 180.1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(
        computeParameterSensitivity(id, "steamPressurePsi", { steamPressurePsi: invalid }),
      ).toBeNull();
    }
    for (const invalid of [29.9, 120.1, Number.NaN, Number.NEGATIVE_INFINITY]) {
      expect(computeParameterSensitivity(id, "engineRpm", { engineRpm: invalid })).toBeNull();
    }
    for (const invalid of [9.9, 60.1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(computeParameterSensitivity(id, "cutoffPct", { cutoffPct: invalid })).toBeNull();
    }
  });

  test("Ericsson Propeller derives thrust and blade pitch angle sensitivities", () => {
    const id = "us-588-ericsson-propeller";

    for (const rpm of [60, 120, 180, 240]) {
      const sens = computeParameterSensitivity(id, "shaftRpm", {
        shaftRpm: rpm,
        bladePitchAngleDeg: 35,
      });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Submerged Propeller Hydrodynamic Thrust");
      expect(sens?.derivativeSymbol).toBe("∂T / ∂RPM");
      expect(sens?.derivativeUnit).toBe("kN / RPM");
      const ericsson = stepEricssonPropeller({ shaftRpm: rpm, bladePitchAngleDeg: 35 });
      expect(sens?.derivativeValue).toBeCloseTo(ericsson.thrustRpmSlopeKnPerRpm, 4);
    }

    for (const pitch of [25, 35, 45, 55]) {
      const sens = computeParameterSensitivity(id, "bladePitchAngleDeg", {
        shaftRpm: 120,
        bladePitchAngleDeg: pitch,
      });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Propeller Hydrodynamic Thrust Pitch Sensitivity");
      expect(sens?.derivativeSymbol).toBe("∂T / ∂θ_pitch");
      expect(sens?.derivativeUnit).toBe("kN / deg");
      expect(sens?.derivativeValue).toBeGreaterThan(0);
    }

    // Invalid parameters
    for (const invalid of [39, 241, Number.NaN]) {
      expect(computeParameterSensitivity(id, "shaftRpm", { shaftRpm: invalid })).toBeNull();
    }
    for (const invalid of [19, 56, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "bladePitchAngleDeg", { bladePitchAngleDeg: invalid }),
      ).toBeNull();
    }
  });

  test("Gatling Gun derives cyclic rate of fire scaling from barrel cluster and crank", () => {
    const id = "us-36836-gatling-gun";
    const h = 1e-4;

    for (const rpm of [30, 60, 100]) {
      for (const barrels of [4, 6, 8, 10]) {
        const sensRpm = computeParameterSensitivity(id, "crankRpm", {
          crankRpm: rpm,
          barrelCount: barrels,
        });
        expect(sensRpm).toBeDefined();
        expect(sensRpm?.metricName).toBe("Cluster Cyclic Fire Rate");
        expect(sensRpm?.derivativeSymbol).toBe("∂ROF / ∂CrankRPM");
        expect(sensRpm?.derivativeValue).toBe(barrels);
        expect(sensRpm?.derivativeUnit).toBe("RPM / RPM");

        // Central finite-difference verification
        const rofFwd = stepGatlingGun({
          crankRpm: rpm + h,
          barrelCount: barrels,
        }).roundsPerMinUnrounded;
        const rofBwd = stepGatlingGun({
          crankRpm: rpm - h,
          barrelCount: barrels,
        }).roundsPerMinUnrounded;
        const fdRpm = (rofFwd - rofBwd) / (2 * h);
        expect(sensRpm?.derivativeValue).toBeCloseTo(fdRpm, 4);

        const sensBarrels = computeParameterSensitivity(id, "barrelCount", {
          crankRpm: rpm,
          barrelCount: barrels,
        });
        expect(sensBarrels).toBeDefined();
        expect(sensBarrels?.metricName).toBe("Cluster Barrel Scaling");
        expect(sensBarrels?.derivativeSymbol).toBe("∂ROF / ∂N_barrels");
        expect(sensBarrels?.derivativeValue).toBe(rpm);
        expect(sensBarrels?.derivativeUnit).toBe("rounds/min / barrel");

        // Alias invariance
        const sensAliasRpm = computeParameterSensitivity(id, "speed", {
          speed: rpm,
          barrels,
        });
        expect(sensAliasRpm?.derivativeValue).toBe(sensRpm?.derivativeValue);

        const sensAliasBarrels = computeParameterSensitivity(id, "numBarrels", {
          crankRpm: rpm,
          numBarrels: barrels,
        });
        expect(sensAliasBarrels?.derivativeValue).toBe(sensBarrels?.derivativeValue);

        // Claim 1 co-rotating shaft refusal
        const sensClaimRefused = computeParameterSensitivity(id, "crankRpm", {
          crankRpm: rpm,
          barrelCount: barrels,
          claim1Active: false,
        });
        expect(sensClaimRefused?.derivativeValue).toBe(0);
      }
    }

    // Invalid parameters
    for (const invalid of [19, 121, Number.NaN]) {
      expect(computeParameterSensitivity(id, "crankRpm", { crankRpm: invalid })).toBeNull();
    }
    for (const invalid of [3, 11, Number.NaN]) {
      expect(computeParameterSensitivity(id, "barrelCount", { barrelCount: invalid })).toBeNull();
    }
  });

  test("Whitney Cotton Gin derives throughput and grate stroke sensitivities", () => {
    const id = "us-x72-whitney-cotton-gin";

    for (const rpm of [30, 60, 120]) {
      const sens = computeParameterSensitivity(id, "crankRpm", { crankRpm: rpm });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Clean Lint Extraction Throughput");
      expect(sens?.derivativeSymbol).toBe("∂m_lint / ∂RPM_crank");
      expect(sens?.derivativeUnit).toBe("lb/day / RPM");
      expect(sens?.derivativeValue).toBeCloseTo(50 / 60, 4);
    }

    for (const clr of [2.0, 3.2, 5.0]) {
      const sens = computeParameterSensitivity(id, "seedGridClearance", { seedGridClearance: clr });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Grate Stroke Pitch Clearance");
      expect(sens?.derivativeSymbol).toBe("∂Stroke / ∂Clearance");
      expect(sens?.derivativeUnit).toBe("px / mm");
      expect(sens?.derivativeValue).toBe(2.5);
    }

    // Invalid parameters
    for (const invalid of [19, 181, Number.NaN]) {
      expect(computeParameterSensitivity(id, "crankRpm", { crankRpm: invalid })).toBeNull();
    }
    for (const invalid of [0.9, 10.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "seedGridClearance", { seedGridClearance: invalid }),
      ).toBeNull();
    }
  });

  test("McCormick Reaper derives kinematic cutter reciprocation frequency scaling", () => {
    const id = "us-x8277-mccormick-reaper";

    for (const speed of [1.0, 2.5, 4.0, 5.0]) {
      const sens = computeParameterSensitivity(id, "forwardSpeedMph", { forwardSpeedMph: speed });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Cutter Reciprocation Frequency");
      expect(sens?.derivativeSymbol).toBe("∂f_cut / ∂v_ground");
      expect(sens?.derivativeUnit).toBe("Hz / MPH");
      expect(sens?.derivativeValue).toBe(2.33);
    }

    // Invalid parameters
    for (const invalid of [0.4, 6.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "forwardSpeedMph", { forwardSpeedMph: invalid }),
      ).toBeNull();
    }
  });

  test("Yale Lock derives pin tumbler shear alignment and plug rotational velocity", () => {
    const id = "us-48475-yale-lock";

    // Unlocked with fully inserted authorized key
    const unlockedAlign = computeParameterSensitivity(id, "keyInsertion", {
      keyInsertion: 1.0,
      appliedTorqueNm: 0.15,
    });
    expect(unlockedAlign).toBeDefined();
    expect(unlockedAlign?.metricName).toBe("Pin Tumbler Shear Line Alignment");
    expect(unlockedAlign?.derivativeValue).toBe(1.0);

    const unlockedTorque = computeParameterSensitivity(id, "appliedTorqueNm", {
      keyInsertion: 1.0,
      appliedTorqueNm: 0.15,
    });
    expect(unlockedTorque).toBeDefined();
    expect(unlockedTorque?.metricName).toBe("Plug Rotational Angular Velocity");
    expect(unlockedTorque?.derivativeSymbol).toBe("∂ω_plug / ∂τ");
    expect(unlockedTorque?.derivativeValue).toBe(18.0);
    expect(unlockedTorque?.derivativeUnit).toBe("(rad/s) / (N·m)");

    // Locked when key partially inserted
    const lockedAlign = computeParameterSensitivity(id, "keyInsertion", {
      keyInsertion: 0.5,
      appliedTorqueNm: 0.15,
    });
    expect(lockedAlign).toBeDefined();
    expect(lockedAlign?.derivativeValue).toBe(0.0);

    const lockedTorque = computeParameterSensitivity(id, "appliedTorqueNm", {
      keyInsertion: 0.5,
      appliedTorqueNm: 0.15,
    });
    expect(lockedTorque).toBeDefined();
    expect(lockedTorque?.derivativeValue).toBe(0.0);

    // Invalid parameters
    for (const invalid of [-0.1, 1.1, Number.NaN]) {
      expect(computeParameterSensitivity(id, "keyInsertion", { keyInsertion: invalid })).toBeNull();
    }
    for (const invalid of [-0.1, 0.6, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "appliedTorqueNm", { appliedTorqueNm: invalid }),
      ).toBeNull();
    }
  });

  test("Sholes Typewriter derives demonstration event cadence scaling", () => {
    const id = "us-79265-sholes-typewriter";

    for (const cadence of [20, 40, 80, 120]) {
      const sens = computeParameterSensitivity(id, "typingSpeedWpm", { typingSpeedWpm: cadence });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Demonstration Event Frequency");
      expect(sens?.derivativeSymbol).toBe("∂f_event / ∂Cadence");
      expect(sens?.derivativeUnit).toBe("strokes/s / (strokes/min)");
      expect(sens?.derivativeValue).toBeCloseTo(1 / 60, 4);
    }

    // Invalid parameters
    for (const invalid of [9, 121, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "typingSpeedWpm", { typingSpeedWpm: invalid }),
      ).toBeNull();
    }
  });

  test("Westinghouse Air Brake derives continuous clamping and reservoir energy sensitivities", () => {
    const id = "us-124404-westinghouse-air-brake";
    const h = 1e-4;

    for (const pipe of [10, 40, 70]) {
      const sens = computeParameterSensitivity(id, "trainPipePressure", {
        trainPipePressure: pipe,
        reservoirPipePressure: 90,
      });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Brake Clamping Force");
      expect(sens?.derivativeSymbol).toBe("∂F_clamp / ∂P");
      expect(sens?.derivativeUnit).toBe("N / psi");

      const wh = FrankenSimEngine.stepWestinghouseAirBrake({
        trainPipePressurePsi: pipe,
        reservoirPipePressurePsi: 90,
      });
      expect(sens?.derivativeValue).toBeCloseTo(wh.shoeClampingSlopeNPerPsi, 4);

      const fPlus = FrankenSimEngine.stepWestinghouseAirBrake({
        trainPipePressurePsi: pipe + h,
        reservoirPipePressurePsi: 90,
      }).shoeClampingForceNUnrounded;
      const fMinus = FrankenSimEngine.stepWestinghouseAirBrake({
        trainPipePressurePsi: pipe - h,
        reservoirPipePressurePsi: 90,
      }).shoeClampingForceNUnrounded;
      const fd = (fPlus - fMinus) / (2 * h);
      expect(sens?.derivativeValue).toBeCloseTo(fd, 3);

      // Aliases
      for (const key of [
        "trainPipePressurePsi",
        "brakePipePressure",
        "brakePressurePsi",
        "pipePressure",
      ]) {
        const aliasSens = computeParameterSensitivity(id, key, {
          [key]: pipe,
          reservoirPipePressure: 90,
        });
        expect(aliasSens?.derivativeValue).toBe(sens?.derivativeValue);
      }
    }

    for (const res of [20, 60, 90]) {
      const sens = computeParameterSensitivity(id, "reservoirPipePressure", {
        trainPipePressure: 0,
        reservoirPipePressure: res,
      });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Stored Pneumatic Work");
      expect(sens?.derivativeSymbol).toBe("∂E / ∂P");
      expect(sens?.derivativeUnit).toBe("J / psi");

      const wh = FrankenSimEngine.stepWestinghouseAirBrake({
        trainPipePressurePsi: 0,
        reservoirPipePressurePsi: res,
      });
      expect(sens?.derivativeValue).toBeCloseTo(wh.reservoirWorkSlopeJPerPsi, 4);

      const fPlus = FrankenSimEngine.stepWestinghouseAirBrake({
        trainPipePressurePsi: 0,
        reservoirPipePressurePsi: res + h,
      }).receiverWorkJoulesUnrounded;
      const fMinus = FrankenSimEngine.stepWestinghouseAirBrake({
        trainPipePressurePsi: 0,
        reservoirPipePressurePsi: res - h,
      }).receiverWorkJoulesUnrounded;
      const fd = (fPlus - fMinus) / (2 * h);
      expect(sens?.derivativeValue).toBeCloseTo(fd, 3);

      // Aliases
      for (const key of ["reservoirPipePressurePsi", "reservoirPressure"]) {
        const aliasSens = computeParameterSensitivity(id, key, {
          trainPipePressure: 0,
          [key]: res,
        });
        expect(aliasSens?.derivativeValue).toBe(sens?.derivativeValue);
      }
    }

    for (const signal of [0.5, 1.5, 2.0]) {
      const sens = computeParameterSensitivity(id, "signalPulsePressure", {
        signalPulsePressure: signal,
      });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Signalling Index Graduation Rate");
      expect(sens?.derivativeSymbol).toBe("∂Index / ∂P_signal");
      expect(sens?.derivativeUnit).toBe("step / psi");
      expect(sens?.derivativeValue).toBe(2.0);

      const aliasSens = computeParameterSensitivity(id, "signalPulsePressurePsi", {
        signalPulsePressurePsi: signal,
      });
      expect(aliasSens?.derivativeValue).toBe(sens?.derivativeValue);
    }

    // Claim 1 refusal gating
    const gatedPipe = computeParameterSensitivity(id, "trainPipePressure", {
      trainPipePressure: 40,
      claim1Active: false,
    });
    expect(gatedPipe?.derivativeValue).toBe(0);
    expect(gatedPipe?.interpretation).toContain("Claim 1");

    const gatedRes = computeParameterSensitivity(id, "reservoirPipePressure", {
      reservoirPipePressure: 90,
      claim1Active: false,
    });
    expect(gatedRes?.derivativeValue).toBe(0);
    expect(gatedRes?.interpretation).toContain("Claim 1");

    // Invalid parameters
    for (const invalid of [-1, 81, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "trainPipePressure", { trainPipePressure: invalid }),
      ).toBeNull();
    }
    for (const invalid of [-1, 101, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "reservoirPipePressure", {
          reservoirPipePressure: invalid,
        }),
      ).toBeNull();
    }
    for (const invalid of [-0.1, 2.6, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "signalPulsePressure", { signalPulsePressure: invalid }),
      ).toBeNull();
    }
  });

  test("Pasteur Fermentation derives identity reader state and temperature sensitivities", () => {
    const id = "us-135245-pasteur-fermentation";

    for (const co2 of [20, 60, 100]) {
      const sens = computeParameterSensitivity(id, "co2SweepPct", { co2SweepPct: co2 });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBe(1);
    }

    for (const spray of [20, 60, 100]) {
      const sens = computeParameterSensitivity(id, "sprayCoveragePct", {
        sprayCoveragePct: spray,
      });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBe(1);
    }

    for (const temp of [20.0, 21.25, 22.5]) {
      const sens = computeParameterSensitivity(id, "wortTempC", { wortTempC: temp });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBe(1);
      expect(sens?.derivativeUnit).toBe("°C displayed / °C reader control");
    }

    // Invalid parameters
    for (const invalid of [-1, 101, Number.NaN]) {
      expect(computeParameterSensitivity(id, "co2SweepPct", { co2SweepPct: invalid })).toBeNull();
      expect(
        computeParameterSensitivity(id, "sprayCoveragePct", { sprayCoveragePct: invalid }),
      ).toBeNull();
    }
    for (const invalid of [19.9, 22.6, Number.NaN]) {
      expect(computeParameterSensitivity(id, "wortTempC", { wortTempC: invalid })).toBeNull();
    }
  });

  test("DeLaval Separator derives centrifugal acceleration and cream yield sensitivities", () => {
    const id = "us-247804-delaval-separator";
    const h = 1e-4;

    // Centrifugal acceleration sensitivity vs finite differences
    for (const rpm of [2000, 3500, 5000, 6500, 8000, 9000]) {
      const sens = computeParameterSensitivity(id, "bowlRpm", {
        bowlRpm: rpm,
        rawMilkFlowLph: 300,
      });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Centrifugal Separation Force");
      expect(sens?.derivativeSymbol).toBe("∂G / ∂RPM");
      expect(sens?.derivativeUnit).toBe("G / RPM");

      const sep = stepDeLavalSeparator({ bowlRpm: rpm, rawMilkFlowLph: 300 });
      expect(sens?.derivativeValue).toBeCloseTo(sep.gForceSlopeGPerRpm, 4);

      const fPlus = stepDeLavalSeparator({
        bowlRpm: rpm + h,
        rawMilkFlowLph: 300,
      }).gForceUnrounded;
      const fMinus = stepDeLavalSeparator({
        bowlRpm: rpm - h,
        rawMilkFlowLph: 300,
      }).gForceUnrounded;
      const fd = (fPlus - fMinus) / (2 * h);
      expect(sens?.derivativeValue).toBeCloseTo(fd, 3);

      // Aliases
      for (const key of ["rotorRpm", "rpm", "speed"]) {
        const aliasSens = computeParameterSensitivity(id, key, {
          [key]: rpm,
          rawMilkFlowLph: 300,
        });
        expect(aliasSens?.derivativeValue).toBe(sens?.derivativeValue);
      }
    }

    // Cream yield sensitivity vs finite differences
    for (const flow of [100, 200, 300, 450, 600]) {
      const sens = computeParameterSensitivity(id, "rawMilkFlowLph", {
        bowlRpm: 6500,
        rawMilkFlowLph: flow,
      });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Continuous Cream Discharge Yield");
      expect(sens?.derivativeSymbol).toBe("∂Q_cream / ∂Q_milk");
      expect(sens?.derivativeUnit).toBe("(L/h) / (L/h)");
      expect(sens?.derivativeValue).toBe(0.12);

      const fPlus = stepDeLavalSeparator({
        bowlRpm: 6500,
        rawMilkFlowLph: flow + h,
      }).creamFlowLphUnrounded;
      const fMinus = stepDeLavalSeparator({
        bowlRpm: 6500,
        rawMilkFlowLph: flow - h,
      }).creamFlowLphUnrounded;
      const fd = (fPlus - fMinus) / (2 * h);
      expect(sens?.derivativeValue).toBeCloseTo(fd, 4);

      // Aliases
      for (const key of ["feedRateLph", "flow", "milkFlowLph", "feedFlow"]) {
        const aliasSens = computeParameterSensitivity(id, key, {
          bowlRpm: 6500,
          [key]: flow,
        });
        expect(aliasSens?.derivativeValue).toBe(sens?.derivativeValue);
      }
    }

    // Claim 1 refusal gating
    const gatedRpm = computeParameterSensitivity(id, "bowlRpm", {
      bowlRpm: 6500,
      claim1Active: false,
    });
    expect(gatedRpm?.derivativeValue).toBe(0);
    expect(gatedRpm?.interpretation).toContain("Claim 1");

    const gatedFlow = computeParameterSensitivity(id, "rawMilkFlowLph", {
      rawMilkFlowLph: 300,
      claim1Active: false,
    });
    expect(gatedFlow?.derivativeValue).toBe(0);
    expect(gatedFlow?.interpretation).toContain("Claim 1");

    // Defaults when omitted
    const defaultSens = computeParameterSensitivity(id, "bowlRpm", {});
    expect(defaultSens).toBeDefined();
    expect(defaultSens?.derivativeValue).toBe(stepDeLavalSeparator({}).gForceSlopeGPerRpm);

    // Invalid parameters / out-of-domain refusals
    for (const invalid of [1999.9, 9000.1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(computeParameterSensitivity(id, "bowlRpm", { bowlRpm: invalid })).toBeNull();
    }
    for (const invalid of [99.9, 600.1, Number.NaN, Number.NEGATIVE_INFINITY]) {
      expect(
        computeParameterSensitivity(id, "rawMilkFlowLph", { rawMilkFlowLph: invalid }),
      ).toBeNull();
    }
  });

  test("Mergenthaler Linotype derives justification width, distributor rate, and pot solidification sensitivities", () => {
    const id = "us-313224-mergenthaler-linotype";

    for (const wedge of [3.0, 6.5, 10.0]) {
      const sens = computeParameterSensitivity(id, "spacebandWedge", { spacebandWedge: wedge });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Line Justification Expansion");
      expect(sens?.derivativeSymbol).toBe("∂Width / ∂WedgeLift");
      expect(sens?.derivativeUnit).toBe("mm / mm");
      expect(sens?.derivativeValue).toBe(4.2);
    }

    for (const rate of [30, 60, 90]) {
      const sens = computeParameterSensitivity(id, "matrixRate", { matrixRate: rate });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Matrix Distributor Escapement Frequency");
      expect(sens?.derivativeSymbol).toBe("∂f_dist / ∂Rate");
      expect(sens?.derivativeUnit).toBe("Hz / (char/min)");
      expect(sens?.derivativeValue).toBeCloseTo(1 / 60, 4);
    }

    for (const temp of [230, 260, 290]) {
      const sens = computeParameterSensitivity(id, "potTemp", { potTemp: temp });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Lead-Tin-Antimony Solidification Duration");
      expect(sens?.derivativeSymbol).toBe("∂t_solid / ∂T_pot");
      expect(sens?.derivativeUnit).toBe("ms / °C");
      expect(sens?.derivativeValue).toBeCloseTo(450 / 260, 4);
    }

    // Invalid parameters
    for (const invalid of [1.9, 12.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "spacebandWedge", { spacebandWedge: invalid }),
      ).toBeNull();
    }
    for (const invalid of [9, 121, Number.NaN]) {
      expect(computeParameterSensitivity(id, "matrixRate", { matrixRate: invalid })).toBeNull();
    }
    for (const invalid of [219, 301, Number.NaN]) {
      expect(computeParameterSensitivity(id, "potTemp", { potTemp: invalid })).toBeNull();
    }
  });

  test("Maxim Machine Gun derives breech-block kinematics and gas impulse sensitivities", () => {
    const id = "us-319596-maxim-machine-gun";
    const h = 1e-4;

    for (const phase of [45, 90, 180, 270]) {
      const sens = computeParameterSensitivity(id, "cyclePhase", { cyclePhase: phase });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Breech-Block Linear Travel");
      expect(sens?.derivativeSymbol).toBe("∂x_breech / ∂θ_crank");
      expect(sens?.derivativeUnit).toBe("mm / deg");
      const expected = ((24 * Math.PI) / 180) * Math.sin((phase * Math.PI) / 180);
      expect(sens?.derivativeValue).toBeCloseTo(expected, 4);

      // Central difference verification for breech displacement x(theta) = 48 * sin^2(theta/2) = 24 * (1 - cos(theta))
      const xFwd = 24 * (1 - Math.cos(((phase + h) * Math.PI) / 180));
      const xBwd = 24 * (1 - Math.cos(((phase - h) * Math.PI) / 180));
      const fd = (xFwd - xBwd) / (2 * h);
      expect(sens?.derivativeValue).toBeCloseTo(fd, 4);

      // Claim 1 refusal
      const sensRefused = computeParameterSensitivity(id, "cyclePhase", {
        cyclePhase: phase,
        claim1Active: false,
      });
      expect(sensRefused?.derivativeValue).toBe(0);
    }

    for (const impulse of [20, 50, 80]) {
      const sens = computeParameterSensitivity(id, "gasImpulsePct", { gasImpulsePct: impulse });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Muzzle Sleeve Forward Impulse");
      expect(sens?.derivativeSymbol).toBe("∂p_sleeve / ∂P_gas");
      expect(sens?.derivativeUnit).toBe("mm / %");
      expect(sens?.derivativeValue).toBe(0.24);

      // Claim 1 refusal
      const sensImpulseRefused = computeParameterSensitivity(id, "gasImpulsePct", {
        gasImpulsePct: impulse,
        claim1Active: false,
      });
      expect(sensImpulseRefused?.derivativeValue).toBe(0);
    }

    // Invalid parameters
    for (const invalid of [-1, 361, Number.NaN]) {
      expect(computeParameterSensitivity(id, "cyclePhase", { cyclePhase: invalid })).toBeNull();
    }
    for (const invalid of [-1, 101, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "gasImpulsePct", { gasImpulsePct: invalid }),
      ).toBeNull();
    }
  });

  test("Reno Escalator derives belt speed conversion and vertical ascent sensitivity", () => {
    const id = "us-470918-reno-escalator";

    for (const speed of [0.5, 1.016, 1.2]) {
      const sens = computeParameterSensitivity(id, "beltSpeed", { beltSpeed: speed });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Belt Velocity Linear Conversion");
      expect(sens?.derivativeSymbol).toBe("∂v_fpm / ∂v_mps");
      expect(sens?.derivativeUnit).toBe("(ft/min) / (m/s)");
      expect(sens?.derivativeValue).toBeCloseTo(60 / 0.3048, 2);
    }

    for (const angle of [22, 25, 32]) {
      const sens = computeParameterSensitivity(id, "inclineAngle", {
        beltSpeed: 1.016,
        inclineAngle: angle,
      });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Vertical Ascent Rate");
      expect(sens?.derivativeSymbol).toBe("∂v_z / ∂θ_incline");
      expect(sens?.derivativeUnit).toBe("(m/s) / deg");
      const expected = Number(
        (1.016 * Math.cos((angle * Math.PI) / 180) * (Math.PI / 180)).toFixed(4),
      );
      expect(sens?.derivativeValue).toBeCloseTo(expected, 4);
    }

    // Invalid parameters
    for (const invalid of [0.39, 1.21, Number.NaN]) {
      expect(computeParameterSensitivity(id, "beltSpeed", { beltSpeed: invalid })).toBeNull();
    }
    for (const invalid of [19, 36, Number.NaN]) {
      expect(computeParameterSensitivity(id, "inclineAngle", { inclineAngle: invalid })).toBeNull();
    }
  });

  test("Carrier Air Conditioner derives dynamic pressure loss, spray capture, and turning face efficiency", () => {
    const id = "us-808897-carrier-air-conditioner";

    for (const cfm of [5000, 15000, 25000]) {
      const sens = computeParameterSensitivity(id, "airflowCfm", {
        airflowCfm: cfm,
        separatorFaces: 6,
      });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Separator Air Velocity & Pressure Loss");
      expect(sens?.derivativeSymbol).toBe("∂ΔP / ∂CFM");
      expect(sens?.derivativeUnit).toBe("Pa / cfm");

      // Central finite difference verification
      const h = 1e-4;
      const fPlus = FrankenSimEngine.stepCarrierAirConditioner({
        airflowCfm: cfm + h,
        separatorFaces: 6,
      }).pressureDropPaUnrounded;
      const fMinus = FrankenSimEngine.stepCarrierAirConditioner({
        airflowCfm: cfm - h,
        separatorFaces: 6,
      }).pressureDropPaUnrounded;
      const numDeriv = (fPlus - fMinus) / (2 * h);
      expect(sens?.derivativeValue).toBeCloseTo(numDeriv, 4);
    }

    for (const faces of [3, 6, 8]) {
      const sens = computeParameterSensitivity(id, "separatorFaces", {
        separatorFaces: faces,
        sprayRatePct: 20,
      });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Droplet Separation Efficiency");
      expect(sens?.derivativeSymbol).toBe("∂η / ∂Faces");
      expect(sens?.derivativeUnit).toBe("% / face");
      expect(sens?.derivativeValue).toBe(8.5);
    }

    for (const spray of [20, 40, 60]) {
      const sens = computeParameterSensitivity(id, "sprayRatePct", {
        sprayRatePct: spray,
        separatorFaces: 4,
      });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Droplet Elimination Wet Spray Sensitivity");
      expect(sens?.derivativeSymbol).toBe("∂η / ∂Spray");
      expect(sens?.derivativeUnit).toBe("% / %");
      expect(sens?.derivativeValue).toBe(0.18);
    }

    // Saturated regime (unclamped >= 99% cap gives 0 sensitivity)
    const satSpray = computeParameterSensitivity(id, "sprayRatePct", {
      separatorFaces: 12,
      sprayRatePct: 60,
    });
    expect(satSpray?.derivativeValue).toBe(0);
    expect(satSpray?.interpretation).toContain("saturated");

    const satFaces = computeParameterSensitivity(id, "separatorFaces", {
      separatorFaces: 12,
      sprayRatePct: 60,
    });
    expect(satFaces?.derivativeValue).toBe(0);
    expect(satFaces?.interpretation).toContain("saturated");

    // Claim 1 gating test
    const claim1Off = computeParameterSensitivity(id, "airflowCfm", {
      airflowCfm: 15000,
      separatorFaces: 6,
      claim1Active: false,
    });
    expect(claim1Off?.derivativeValue).toBe(0);
    expect(claim1Off?.interpretation).toContain("Claim 1");

    // Parameter alias checks
    const nominalSens = computeParameterSensitivity(id, "airflowCfm", {
      airflowCfm: 15000,
      separatorFaces: 6,
    })?.derivativeValue;
    expect(
      computeParameterSensitivity(id, "airFlowCfm", { airflowCfm: 15000, separatorFaces: 6 })
        ?.derivativeValue,
    ).toBe(nominalSens);
    expect(
      computeParameterSensitivity(id, "airflow", { airflowCfm: 15000, separatorFaces: 6 })
        ?.derivativeValue,
    ).toBe(nominalSens);
    expect(
      computeParameterSensitivity(id, "cfm", { airflowCfm: 15000, separatorFaces: 6 })
        ?.derivativeValue,
    ).toBe(nominalSens);

    // Invalid parameters
    for (const invalid of [1999, 30001, Number.NaN]) {
      expect(computeParameterSensitivity(id, "airflowCfm", { airflowCfm: invalid })).toBeNull();
    }
    for (const invalid of [1, 13, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "separatorFaces", { separatorFaces: invalid }),
      ).toBeNull();
    }
    for (const invalid of [9, 101, Number.NaN]) {
      expect(computeParameterSensitivity(id, "sprayRatePct", { sprayRatePct: invalid })).toBeNull();
    }
  });

  test("Sundback Zipper derives scoop engagement, cam wedge force, and cord strain sensitivities", () => {
    const id = "us-1219881-sundback-zipper";

    for (const pos of [20, 50, 80]) {
      const sens = computeParameterSensitivity(id, "sliderPositionPct", {
        sliderPositionPct: pos,
      });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Engaged Tooth Count");
      expect(sens?.derivativeSymbol).toBe("∂N_engaged / ∂x_slider");
      expect(sens?.derivativeUnit).toBe("teeth / %");
      expect(sens?.derivativeValue).toBe(0.65);
    }

    for (const pull of [10, 25, 45]) {
      const sens = computeParameterSensitivity(id, "pullForceN", { pullForceN: pull });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Cam Wedge Normal Force");
      expect(sens?.derivativeSymbol).toBe("∂F_n / ∂F_pull");
      expect(sens?.derivativeUnit).toBe("N / N");
      expect(sens?.derivativeValue).toBe(1.25);
    }

    for (const lat of [20, 80, 150]) {
      const sens = computeParameterSensitivity(id, "lateralTensionN", { lateralTensionN: lat });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Corded Tape Strain");
      expect(sens?.derivativeSymbol).toBe("∂ε / ∂F_lat");
      expect(sens?.derivativeUnit).toBe("% / N");
      expect(sens?.derivativeValue).toBeCloseTo(100 / 1700, 4);
    }

    // Invalid parameters
    for (const invalid of [-1, 101, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "sliderPositionPct", { sliderPositionPct: invalid }),
      ).toBeNull();
    }
    for (const invalid of [-1, 51, Number.NaN]) {
      expect(computeParameterSensitivity(id, "pullForceN", { pullForceN: invalid })).toBeNull();
    }
    for (const invalid of [-1, 201, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "lateralTensionN", { lateralTensionN: invalid }),
      ).toBeNull();
    }
    for (const invalid of [-1, 181, Number.NaN]) {
      expect(computeParameterSensitivity(id, "flexAngleDeg", { flexAngleDeg: invalid })).toBeNull();
    }
    for (const invalid of [7, 15, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "toothDensityTpi", { toothDensityTpi: invalid }),
      ).toBeNull();
    }
  });

  test("Einstein refrigerator derives total pressure and ammonia ratio saturation temperature sensitivities", () => {
    const id = "us-1781541-einstein-refrigerator";
    for (const press of [8, 12, 16, 20]) {
      const sens = computeParameterSensitivity(id, "totalPressure", { totalPressure: press });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Evaporator Saturation Temperature");
      expect(sens?.derivativeSymbol).toBe("∂T_evap / ∂P_total");
      expect(sens?.derivativeUnit).toBe("°C / atm");
      expect(sens?.derivativeValue).toBe(1.4);
    }

    for (const nh3 of [0.45, 0.65, 0.85]) {
      const sens = computeParameterSensitivity(id, "ammoniaRatio", { ammoniaRatio: nh3 });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Evaporator Saturation Temperature");
      expect(sens?.derivativeSymbol).toBe("∂T_evap / ∂x_NH3");
      expect(sens?.derivativeUnit).toBe("°C / (mole frac)");
      expect(sens?.derivativeValue).toBe(-18.0);
    }

    // Refusal when Claim 1 liquid-lift path is withheld
    const withheldPress = computeParameterSensitivity(id, "totalPressure", {
      claim1LiftPathPresent: false,
    });
    expect(withheldPress?.derivativeValue).toBe(0);
    expect(withheldPress?.interpretation).toContain("withheld");

    const withheldNh3 = computeParameterSensitivity(id, "ammoniaRatio", {
      claim1LiftPathPresent: false,
    });
    expect(withheldNh3?.derivativeValue).toBe(0);
    expect(withheldNh3?.interpretation).toContain("withheld");

    // Invalid bounds
    for (const invalid of [5.5, 22.5, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "totalPressure", { totalPressure: invalid }),
      ).toBeNull();
    }
    for (const invalid of [0.39, 0.91, Number.NaN]) {
      expect(computeParameterSensitivity(id, "ammoniaRatio", { ammoniaRatio: invalid })).toBeNull();
    }
  });

  test("Land Polaroid instant film derives development time, gap, exposure, viscosity, and pH sensitivities", () => {
    const id = "us-2543181-land-polaroid";

    // Development time sensitivity
    for (const t of [5, 20, 45, 55]) {
      const sens = computeParameterSensitivity(id, "developmentTimeSec", {
        developmentTimeSec: t,
      });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Scenario Positive-Image Density");
      expect(sens?.derivativeSymbol).toBe("∂OD / ∂t_dev");
      expect(sens?.derivativeUnit).toBe("OD / s");
      expect(sens?.derivativeValue).toBeGreaterThanOrEqual(0);
    }

    // Roller spread gap sensitivity
    for (const gap of [15, 25, 40, 55]) {
      const sens = computeParameterSensitivity(id, "rollerGapUm", { rollerGapUm: gap });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Scenario Diffusion Flux");
      expect(sens?.derivativeSymbol).toBe("∂J / ∂Gap");
      expect(sens?.derivativeUnit).toBe("(mol·m⁻²·s⁻¹) / µm");
      expect(sens?.derivativeValue).toBeLessThanOrEqual(0);
    }

    // Exposure fraction sensitivity
    for (const exp of [0.2, 0.5, 0.8]) {
      const sens = computeParameterSensitivity(id, "exposureFraction", { exposureFraction: exp });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Negative Silver Density");
      expect(sens?.derivativeSymbol).toBe("∂OD_neg / ∂E");
      expect(sens?.derivativeUnit).toBe("OD / fraction");
      expect(sens?.derivativeValue).toBeGreaterThan(0);
    }

    // Reagent viscosity sensitivity
    for (const visc of [5000, 25000, 60000]) {
      const sens = computeParameterSensitivity(id, "reagentViscosityCp", {
        reagentViscosityCp: visc,
      });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Reagent Diffusion Coefficient");
      expect(sens?.derivativeSymbol).toBe("∂D / ∂μ");
      expect(sens?.derivativeUnit).toBe("(m²·s⁻¹) / cP");
      expect(sens?.derivativeValue).toBeLessThan(0);
    }

    // Developer pH sensitivity
    for (const ph of [11.0, 12.0, 13.0]) {
      const sens = computeParameterSensitivity(id, "alkaliPh", { alkaliPh: ph });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Development Rate Constant");
      expect(sens?.derivativeSymbol).toBe("∂k_dev / ∂pH");
      expect(sens?.derivativeUnit).toBe("s⁻¹ / pH");
      expect(sens?.derivativeValue).toBeGreaterThan(0);
    }

    // Claim 1 withholding sets 0 slope
    expect(
      computeParameterSensitivity(id, "developmentTimeSec", { claim1Active: 0 })?.derivativeValue,
    ).toBe(0);
    expect(
      computeParameterSensitivity(id, "exposureFraction", { claim1Active: 0 })?.derivativeValue,
    ).toBe(0);

    // Invalid parameters
    for (const invalid of [-1, 61, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "developmentTimeSec", { developmentTimeSec: invalid }),
      ).toBeNull();
    }
    for (const invalid of [-0.1, 1.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "exposureFraction", { exposureFraction: invalid }),
      ).toBeNull();
    }
    for (const invalid of [999, 80001, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "reagentViscosityCp", { reagentViscosityCp: invalid }),
      ).toBeNull();
    }
    for (const invalid of [9, 61, Number.NaN]) {
      expect(computeParameterSensitivity(id, "rollerGapUm", { rollerGapUm: invalid })).toBeNull();
    }
    for (const invalid of [10.4, 13.9, Number.NaN]) {
      expect(computeParameterSensitivity(id, "alkaliPh", { alkaliPh: invalid })).toBeNull();
    }
  });

  test("Mestral Velcro derives filament geometry and pile density sensitivities", () => {
    const id = "us-2717437-mestral-velcro";

    for (const d of [0.15, 0.22, 0.32]) {
      const sens = computeParameterSensitivity(id, "filamentDiameterMm", { filamentDiameterMm: d });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Relative Bending Geometry");
      expect(sens?.derivativeSymbol).toBe("∂K_geometry,rel / ∂d");
      expect(sens?.derivativeUnit).toBe("index / mm");
      expect(sens?.derivativeValue).toBeGreaterThan(0);
    }

    for (const l of [1.2, 2.0, 2.8]) {
      const sens = computeParameterSensitivity(id, "hookLengthMm", { hookLengthMm: l });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Relative Bending Geometry");
      expect(sens?.derivativeSymbol).toBe("∂K_geometry,rel / ∂L");
      expect(sens?.derivativeUnit).toBe("index / mm");
      expect(sens?.derivativeValue).toBeLessThan(0);
    }

    for (const rho of [30, 60, 100]) {
      const sens = computeParameterSensitivity(id, "hookDensityPerCm2", { hookDensityPerCm2: rho });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Visible Pile Row Population");
      expect(sens?.derivativeSymbol).toBe("∂Rows / ∂ρ");
      expect(sens?.derivativeUnit).toBe("rows / cm⁻²");
      expect(sens?.derivativeValue).toBe(0.04);
    }

    // Invalid parameters
    for (const invalid of [0.09, 0.36, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "filamentDiameterMm", { filamentDiameterMm: invalid }),
      ).toBeNull();
    }
    for (const invalid of [0.9, 3.1, Number.NaN]) {
      expect(computeParameterSensitivity(id, "hookLengthMm", { hookLengthMm: invalid })).toBeNull();
    }
    for (const invalid of [19, 121, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "hookDensityPerCm2", { hookDensityPerCm2: invalid }),
      ).toBeNull();
    }
    for (const invalid of [14, 166, Number.NaN]) {
      expect(computeParameterSensitivity(id, "peelAngleDeg", { peelAngleDeg: invalid })).toBeNull();
    }
    for (const invalid of [0.04, 0.96, Number.NaN]) {
      expect(computeParameterSensitivity(id, "peelProgress", { peelProgress: invalid })).toBeNull();
    }
  });

  test("Kamen injection device derives counted stop coordinate and motor-off pause sensitivities", () => {
    const id = "us-3858581-kamen-medication-injection-device";

    for (const pulse of [5, 27, 80]) {
      const sens = computeParameterSensitivity(id, "selectedPulseCount", {
        selectedPulseCount: pulse,
      });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Counted Stop Coordinate");
      expect(sens?.derivativeSymbol).toBe("∂N_{stop} / ∂N_{selected}");
      expect(sens?.derivativeUnit).toBe("screw-turn events / selected event");
      expect(sens?.derivativeValue).toBe(1);
    }

    for (const speed of [2, 6, 11]) {
      const sens = computeParameterSensitivity(id, "displayTurnsPerSecond", {
        displayTurnsPerSecond: speed,
      });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Counted Stop Coordinate");
      expect(sens?.derivativeSymbol).toBe("∂N_{stop} / ∂ω_{display}");
      expect(sens?.derivativeUnit).toBe("screw-turn events / (display turns/s)");
      expect(sens?.derivativeValue).toBe(0);
    }

    for (const off of [1.0, 2.5, 6.0]) {
      const sens = computeParameterSensitivity(id, "offIntervalDisplaySeconds", {
        offIntervalDisplaySeconds: off,
      });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Motor-Off Display Pause Interval");
      expect(sens?.derivativeSymbol).toBe("∂t_off / ∂t_interval");
      expect(sens?.derivativeUnit).toBe("display s / display s");
      expect(sens?.derivativeValue).toBe(1.0);
    }

    // Claim 3 clutch disengagement stops transmission to lead screw
    const disengagedSens = computeParameterSensitivity(id, "selectedPulseCount", {
      clutchEngaged: 0,
    });
    expect(disengagedSens?.derivativeValue).toBe(0);
    expect(disengagedSens?.interpretation).toContain("disengaged");

    // Invalid parameters
    for (const invalid of [0, 100, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "selectedPulseCount", { selectedPulseCount: invalid }),
      ).toBeNull();
    }
    for (const invalid of [0.5, 13, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "displayTurnsPerSecond", {
          displayTurnsPerSecond: invalid,
        }),
      ).toBeNull();
    }
    for (const invalid of [0.4, 8.5, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "offIntervalDisplaySeconds", {
          offIntervalDisplaySeconds: invalid,
        }),
      ).toBeNull();
    }
  });

  test("Kamen Segway derives rider mass traction sensitivity and enforces control domain bounds", () => {
    const id = "us-6302230-kamen-segway";

    for (const mass of [50, 75, 100]) {
      for (const mu of [0.3, 0.6, 0.85]) {
        const sens = computeParameterSensitivity(id, "riderMassKg", {
          riderMassKg: mass,
          groundFrictionCoeff: mu,
        });
        expect(sens).toBeDefined();
        expect(sens?.metricName).toBe("Payload Traction Grip Force");
        expect(sens?.derivativeSymbol).toBe("∂F_traction / ∂M_rider");
        expect(sens?.derivativeUnit).toBe("N / kg");
        expect(sens?.derivativeValue).toBeCloseTo(mu * 9.80665, 3);
      }
    }

    // Invalid parameters
    for (const invalid of [-16, 16, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "riderPitchDeg", { riderPitchDeg: invalid }),
      ).toBeNull();
    }
    for (const invalid of [0.14, 0.96, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "groundFrictionCoeff", { groundFrictionCoeff: invalid }),
      ).toBeNull();
    }
    for (const invalid of [1.9, 6.1, Number.NaN]) {
      expect(computeParameterSensitivity(id, "speedLimitMS", { speedLimitMS: invalid })).toBeNull();
    }
    for (const invalid of [39, 121, Number.NaN]) {
      expect(computeParameterSensitivity(id, "riderMassKg", { riderMassKg: invalid })).toBeNull();
    }
    for (const invalid of [-1.1, 1.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "steeringInput", { steeringInput: invalid }),
      ).toBeNull();
    }
  });

  test("Davenport Electric Motor derives commutated speed and load droop sensitivities", () => {
    const id = "us-132-davenport-electric-motor";
    const h = 1e-4;

    for (const v of [6, 12, 24]) {
      for (const load of [0.5, 0.8, 2.0]) {
        const motor = stepDavenportMotor({ batteryVoltage: v, loadTorque: load });

        const sensV = computeParameterSensitivity(id, "batteryVoltage", {
          batteryVoltage: v,
          loadTorque: load,
        });
        expect(sensV).toBeDefined();
        expect(sensV?.metricName).toBe("Armature Commutated Rotational Speed");
        expect(sensV?.derivativeSymbol).toBe("∂RPM / ∂V_batt");
        expect(sensV?.derivativeUnit).toBe("RPM / V");
        expect(sensV?.derivativeValue).toBe(motor.rpmSlopePerVolt);

        // Finite difference verification against unrounded continuous model
        const rpmForward = stepDavenportMotor({
          batteryVoltage: v + h,
          loadTorque: load,
        }).shaftRpmUnrounded;
        const rpmBackward = stepDavenportMotor({
          batteryVoltage: v - h,
          loadTorque: load,
        }).shaftRpmUnrounded;
        expect(sensV?.derivativeValue).toBeCloseTo((rpmForward - rpmBackward) / (2 * h), 3);

        const sensLoad = computeParameterSensitivity(id, "loadTorque", {
          batteryVoltage: v,
          loadTorque: load,
        });
        expect(sensLoad).toBeDefined();
        expect(sensLoad?.metricName).toBe("Armature Speed Load Droop");
        expect(sensLoad?.derivativeSymbol).toBe("∂RPM / ∂τ_load");
        expect(sensLoad?.derivativeUnit).toBe("RPM / (N·m)");
        expect(sensLoad?.derivativeValue).toBe(motor.rpmSlopePerNm);

        if (load > 0.5) {
          const rpmLoadForward = stepDavenportMotor({
            batteryVoltage: v,
            loadTorque: load + h,
          }).shaftRpmUnrounded;
          const rpmLoadBackward = stepDavenportMotor({
            batteryVoltage: v,
            loadTorque: load - h,
          }).shaftRpmUnrounded;
          expect(sensLoad?.derivativeValue).toBeCloseTo(
            (rpmLoadForward - rpmLoadBackward) / (2 * h),
            3,
          );
        }

        // Alias preservation
        for (const alias of ["voltage", "batteryVolts", "v"]) {
          const sensAlias = computeParameterSensitivity(id, alias, {
            [alias]: v,
            loadTorque: load,
          });
          expect(sensAlias?.derivativeValue).toBe(sensV?.derivativeValue);
        }
        for (const alias of ["torque", "load", "torqueNm"]) {
          const sensAlias = computeParameterSensitivity(id, alias, {
            batteryVoltage: v,
            [alias]: load,
          });
          expect(sensAlias?.derivativeValue).toBe(sensLoad?.derivativeValue);
        }
      }
    }

    // Claim 1 refusal: when commutator switching is withheld, speed sensitivity drops to 0
    const sensRefusedV = computeParameterSensitivity(id, "batteryVoltage", {
      batteryVoltage: 12,
      loadTorque: 0.8,
      claim1Active: false,
    });
    expect(sensRefusedV?.derivativeValue).toBe(0);
    expect(sensRefusedV?.interpretation).toContain(
      "Claim 1 position-dependent contact switching is withheld",
    );

    const sensRefusedLoad = computeParameterSensitivity(id, "loadTorque", {
      batteryVoltage: 12,
      loadTorque: 0.8,
      claim1Active: false,
    });
    expect(sensRefusedLoad?.derivativeValue).toBe(0);
    expect(sensRefusedLoad?.interpretation).toContain(
      "Claim 1 position-dependent contact switching is withheld",
    );

    // Invalid parameters
    for (const invalid of [3.9, 24.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "batteryVoltage", { batteryVoltage: invalid }),
      ).toBeNull();
    }
    for (const invalid of [0.19, 2.51, Number.NaN]) {
      expect(computeParameterSensitivity(id, "loadTorque", { loadTorque: invalid })).toBeNull();
    }
  });

  test("Gramme Dynamo derives continuous generated DC voltage sensitivity", () => {
    const id = "us-120057-gramme-dynamo";
    const h = 1e-4;

    for (const rate of [0.5, 1.0, 1.5]) {
      const sens = computeParameterSensitivity(id, "shaftRate", { shaftRate: rate });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Induced e.m.f. (illustrative)");
      expect(sens?.derivativeSymbol).toBe("∂EMF / ∂ω_rel");
      expect(sens?.derivativeUnit).toBe("relative index / unit");
      expect(sens?.derivativeValue).toBe(100);

      // Compare against central difference of unrounded EMF index
      const emfForward = stepGrammeDynamo({ shaftRate: rate + h }).inducedEmfIndexUnrounded ?? 0;
      const emfBackward = stepGrammeDynamo({ shaftRate: rate - h }).inducedEmfIndexUnrounded ?? 0;
      const fd = (emfForward - emfBackward) / (2 * h);
      expect(sens?.derivativeValue).toBeCloseTo(fd, 4);

      // Alias preservation
      for (const alias of ["rate", "shaftRateFactor", "rotorRpm", "shaftRpm", "speed"]) {
        const sensAlias = computeParameterSensitivity(id, alias, { [alias]: rate });
        expect(sensAlias?.derivativeValue).toBe(sens?.derivativeValue);
      }
    }

    // Claim 1 refusal: when continuous closed ring is withheld, sensitivity is 0
    const sensRefused = computeParameterSensitivity(id, "shaftRate", {
      shaftRate: 1.0,
      claim1ClosedRingPresent: false,
    });
    expect(sensRefused?.derivativeValue).toBe(0);

    // Invalid parameters
    for (const invalid of [0.39, 1.61, Number.NaN]) {
      expect(computeParameterSensitivity(id, "shaftRate", { shaftRate: invalid })).toBeNull();
    }
  });

  test("Pelton Water Wheel derives source water-path visibility and enforces apparatus bounds", () => {
    const id = "us-233692-pelton-water-wheel";

    for (const flow of [0, 1]) {
      const sens = computeParameterSensitivity(id, "sourceFlowVisible", {
        sourceFlowVisible: flow,
      });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBe(1);
    }
    for (const claim of [0, 1]) {
      const sens = computeParameterSensitivity(id, "claim1Active", { claim1Active: claim });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBe(1);
    }

    // Invalid parameters
    for (const invalid of [-0.1, 1.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "sourceFlowVisible", { sourceFlowVisible: invalid }),
      ).toBeNull();
      expect(computeParameterSensitivity(id, "claim1Active", { claim1Active: invalid })).toBeNull();
    }
  });

  test("Edison Electrical Indicator derives circuit state display sensitivity and enforces polarity bounds", () => {
    const id = "us-307031-edison-indicator";

    for (const pol of [0, 1]) {
      const sens = computeParameterSensitivity(id, "plateBiasPolarity", {
        plateBiasPolarity: pol,
      });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("External-Connection Reader State");
      expect(sens?.derivativeSymbol).toBe("∂q_{circuit} / ∂u_{polarity}");
      expect(sens?.derivativeValue).toBe(1);
    }

    // Invalid parameters
    for (const invalid of [-0.1, 1.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "plateBiasPolarity", { plateBiasPolarity: invalid }),
      ).toBeNull();
    }
  });

  test("Tesla AC Motor derives generator pole-shift rotation sensitivity and validates line frequency bounds", () => {
    const id = "us-381968-tesla-motor";

    for (const freq of [30, 60, 120]) {
      const sens = computeParameterSensitivity(id, "frequency", { frequency: freq });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Generator Rotation");
      expect(sens?.derivativeSymbol).toBe("∂n_G / ∂f");
      expect(sens?.derivativeUnit).toBe("RPM / Hz");
      expect(sens?.derivativeValue).toBe(60);
    }

    // Invalid parameters
    for (const invalid of [19, 121, Number.NaN]) {
      expect(computeParameterSensitivity(id, "frequency", { frequency: invalid })).toBeNull();
    }
    for (const invalid of [-0.1, 1.1, Number.NaN]) {
      expect(computeParameterSensitivity(id, "frequency", { acHum: invalid })).toBeNull();
    }
  });

  test("Parsons Marine Steam Turbine derives routing, reversing, and throttle sensitivities", () => {
    const id = "us-608969-parsons-turbine";

    for (const route of [0, 1, 2]) {
      const sens = computeParameterSensitivity(id, "routing", { routing: route });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Steam Flow Path & Staged Expansion");
      expect(sens?.derivativeValue).toBe(1.0);
    }

    for (const rev of [0, 1]) {
      const sens = computeParameterSensitivity(id, "reversing", { reversing: rev });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Propulsion Direction");
      expect(sens?.derivativeValue).toBe(1.0);
    }

    for (const thr of [0.2, 0.5, 1.0]) {
      const sens = computeParameterSensitivity(id, "throttle", { throttle: thr });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Relative Steam Flow");
      expect(sens?.derivativeValue).toBe(1.0);
    }

    // Invalid parameters
    for (const invalid of [-1, 3, Number.NaN]) {
      expect(computeParameterSensitivity(id, "routing", { routing: invalid })).toBeNull();
    }
    for (const invalid of [-1, 2, Number.NaN]) {
      expect(computeParameterSensitivity(id, "reversing", { reversing: invalid })).toBeNull();
    }
    for (const invalid of [-0.1, 1.1, Number.NaN]) {
      expect(computeParameterSensitivity(id, "throttle", { throttle: invalid })).toBeNull();
    }
  });

  test("Parsons Reaction Steam Turbine derives shaft power and isentropic enthalpy drop sensitivities", () => {
    const id = "us-328710-parsons-turbine";

    for (const rpm of [1500, 3000, 4800]) {
      for (const psi of [100, 180, 260]) {
        const sensRpm = computeParameterSensitivity(id, "rotorRpm", {
          rotorRpm: rpm,
          inletPressurePsi: psi,
        });
        expect(sensRpm).toBeDefined();
        expect(sensRpm?.metricName).toBe("Shaft Reaction Power");
        expect(sensRpm?.derivativeSymbol).toBe("∂P / ∂N");
        expect(sensRpm?.derivativeUnit).toBe("kW / RPM");

        const parsons = stepParsonsTurbine({ rotorRpm: rpm, inletPressurePsi: psi });
        expect(sensRpm?.derivativeValue).toBe(
          Number(parsons.shaftPowerSlopeKwPerRpm.toPrecision(6)),
        );

        // Finite difference verification
        const hRpm = 1e-4;
        const pHi = stepParsonsTurbine({
          rotorRpm: rpm + hRpm,
          inletPressurePsi: psi,
        }).shaftPowerKwUnrounded;
        const pLo = stepParsonsTurbine({
          rotorRpm: rpm - hRpm,
          inletPressurePsi: psi,
        }).shaftPowerKwUnrounded;
        const fdRpm = (pHi - pLo) / (2 * hRpm);
        expect(sensRpm?.derivativeValue).toBeCloseTo(fdRpm, 4);

        // Alias equivalence
        const sensRpmAlias = computeParameterSensitivity(id, "rpm", {
          rpm,
          inletPressurePsi: psi,
        });
        expect(sensRpmAlias?.derivativeValue).toBe(sensRpm?.derivativeValue);
        const sensTurbineRpm = computeParameterSensitivity(id, "turbineRpm", {
          turbineRpm: rpm,
          inletPressurePsi: psi,
        });
        expect(sensTurbineRpm?.derivativeValue).toBe(sensRpm?.derivativeValue);

        // Enthalpy drop sensitivity
        const sensPsi = computeParameterSensitivity(id, "inletPressurePsi", {
          rotorRpm: rpm,
          inletPressurePsi: psi,
        });
        expect(sensPsi).toBeDefined();
        expect(sensPsi?.metricName).toBe("Isentropic Enthalpy Drop");
        expect(sensPsi?.derivativeSymbol).toBe("∂Δh / ∂P");
        expect(sensPsi?.derivativeUnit).toBe("kJ/kg / psi");
        expect(sensPsi?.derivativeValue).toBe(
          Number(parsons.enthalpySlopeKjKgPerPsi.toPrecision(6)),
        );

        const hPsi = 1e-4;
        const hHi = stepParsonsTurbine({
          rotorRpm: rpm,
          inletPressurePsi: psi + hPsi,
        }).enthalpyKjKgUnrounded;
        const hLo = stepParsonsTurbine({
          rotorRpm: rpm,
          inletPressurePsi: psi - hPsi,
        }).enthalpyKjKgUnrounded;
        const fdPsi = (hHi - hLo) / (2 * hPsi);
        expect(sensPsi?.derivativeValue).toBeCloseTo(fdPsi, 4);

        const sensPressureAlias = computeParameterSensitivity(id, "pressure", {
          rotorRpm: rpm,
          pressure: psi,
        });
        expect(sensPressureAlias?.derivativeValue).toBe(sensPsi?.derivativeValue);

        // Bar alias sensitivity
        const sensBar = computeParameterSensitivity(id, "steamPressureBar", {
          rotorRpm: rpm,
          inletPressurePsi: psi,
        });
        expect(sensBar).toBeDefined();
        expect(sensBar?.derivativeUnit).toBe("kJ/kg / bar");
        expect(sensBar?.derivativeValue).toBe(
          Number(parsons.enthalpySlopeKjKgPerBar.toPrecision(6)),
        );
      }
    }

    // Domain bounds checking
    for (const invalid of [999, 6001, Number.NaN]) {
      expect(computeParameterSensitivity(id, "rotorRpm", { rotorRpm: invalid })).toBeNull();
    }
    for (const invalid of [59, 301, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "inletPressurePsi", { inletPressurePsi: invalid }),
      ).toBeNull();
    }
  });

  test("Hewitt Mercury Vapor Lamp derives luminous flux, ballast quenching, and column field gradient sensitivities", () => {
    const id = "us-682690-hewitt-mercury-lamp";
    const h = 1e-4;

    for (const v of [80, 110, 180]) {
      const sensV = computeParameterSensitivity(id, "mainsVoltageV", { mainsVoltageV: v });
      expect(sensV).toBeDefined();
      expect(sensV?.metricName).toBe("Arc Luminous Flux Output");
      expect(sensV?.derivativeSymbol).toBe("∂Φ / ∂V_supply");
      expect(sensV?.derivativeUnit).toBe("lm / V");

      const fwd = stepHewittMercuryLamp({
        mainsVoltageV: v + h,
        ballastResistanceOhms: 12,
        tubeLengthCm: 100,
        tubeDiameterMm: 25,
      }).luminousFluxLumensUnrounded;
      const bwd = stepHewittMercuryLamp({
        mainsVoltageV: v - h,
        ballastResistanceOhms: 12,
        tubeLengthCm: 100,
        tubeDiameterMm: 25,
      }).luminousFluxLumensUnrounded;
      const fd = (fwd - bwd) / (2 * h);
      expect(sensV?.derivativeValue).toBeCloseTo(fd, 3);

      // Aliases
      for (const key of ["voltage", "vMains", "arcVoltage"]) {
        const aliasSens = computeParameterSensitivity(id, key, { [key]: v });
        expect(aliasSens?.derivativeValue).toBe(sensV?.derivativeValue);
      }
    }

    for (const r of [10, 20, 35]) {
      const sensR = computeParameterSensitivity(id, "ballastResistanceOhms", {
        ballastResistanceOhms: r,
      });
      expect(sensR).toBeDefined();
      expect(sensR?.metricName).toBe("Ballast Luminous Flux Quenching");
      expect(sensR?.derivativeSymbol).toBe("∂Φ / ∂R_ballast");
      expect(sensR?.derivativeUnit).toBe("lm / Ω");
      expect(sensR?.derivativeValue).toBeLessThanOrEqual(0);

      const fwd = stepHewittMercuryLamp({
        mainsVoltageV: 110,
        ballastResistanceOhms: r + h,
        tubeLengthCm: 100,
        tubeDiameterMm: 25,
      }).luminousFluxLumensUnrounded;
      const bwd = stepHewittMercuryLamp({
        mainsVoltageV: 110,
        ballastResistanceOhms: r - h,
        tubeLengthCm: 100,
        tubeDiameterMm: 25,
      }).luminousFluxLumensUnrounded;
      const fd = (fwd - bwd) / (2 * h);
      expect(sensR?.derivativeValue).toBeCloseTo(fd, 3);

      // Aliases
      for (const key of ["ballast", "ballastOhms", "rBallast"]) {
        const aliasSens = computeParameterSensitivity(id, key, { [key]: r });
        expect(aliasSens?.derivativeValue).toBe(sensR?.derivativeValue);
      }
    }

    for (const len of [50, 100, 140]) {
      const sensL = computeParameterSensitivity(id, "tubeLengthCm", { tubeLengthCm: len });
      expect(sensL).toBeDefined();
      expect(sensL?.metricName).toBe("Positive Column Voltage Gradient");
      expect(sensL?.derivativeSymbol).toBe("∂V_arc / ∂L_tube");
      expect(sensL?.derivativeUnit).toBe("V / cm");

      const base = stepHewittMercuryLamp({
        mainsVoltageV: 110,
        ballastResistanceOhms: 12,
        tubeLengthCm: len,
        tubeDiameterMm: 25,
      });
      expect(sensL?.derivativeValue).toBe(base.electricFieldVPerCm);

      // Aliases
      for (const key of ["tubeLength", "length"]) {
        const aliasSens = computeParameterSensitivity(id, key, { [key]: len });
        expect(aliasSens?.derivativeValue).toBe(sensL?.derivativeValue);
      }
    }

    // Claim 1 refusal gating
    const gatedV = computeParameterSensitivity(id, "mainsVoltageV", {
      mainsVoltageV: 110,
      claim1Active: false,
    });
    expect(gatedV?.derivativeValue).toBe(0);
    expect(gatedV?.interpretation).toContain("Claim 1");

    const gatedR = computeParameterSensitivity(id, "ballastResistanceOhms", {
      ballastResistanceOhms: 12,
      claim1Active: false,
    });
    expect(gatedR?.derivativeValue).toBe(0);
    expect(gatedR?.interpretation).toContain("Claim 1");

    // Invalid parameters
    for (const invalid of [59, 241, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "mainsVoltageV", { mainsVoltageV: invalid }),
      ).toBeNull();
    }
    for (const invalid of [4, 51, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "ballastResistanceOhms", {
          ballastResistanceOhms: invalid,
        }),
      ).toBeNull();
    }
    for (const invalid of [29, 151, Number.NaN]) {
      expect(computeParameterSensitivity(id, "tubeLengthCm", { tubeLengthCm: invalid })).toBeNull();
    }
    for (const invalid of [14, 51, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "tubeDiameterMm", { tubeDiameterMm: invalid }),
      ).toBeNull();
    }
  });

  test("Spencer Microwave Cavity Magnetron derives Hull cutoff field and waveguide path sensitivities", () => {
    const id = "us-2495429-spencer-microwave";

    for (const rf of [0, 1]) {
      const sens = computeParameterSensitivity(id, "rfPowerSetting", { rfPowerSetting: rf });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Waveguide Energy-Path Display");
      expect(sens?.derivativeValue).toBe(1);
    }

    for (const va of [1200, 2200, 3500]) {
      const sens = computeParameterSensitivity(id, "anodeVoltage", { anodeVoltage: va });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Hull Cutoff Field");
      expect(sens?.derivativeSymbol).toBe("∂B_c / ∂V_a");
      expect(sens?.derivativeUnit).toBe("Gauss / V");
      expect(sens?.derivativeValue).toBeGreaterThan(0);
    }

    // Invalid parameters
    for (const invalid of [-0.1, 1.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "rfPowerSetting", { rfPowerSetting: invalid }),
      ).toBeNull();
    }
    for (const invalid of [499, 5001, Number.NaN]) {
      expect(computeParameterSensitivity(id, "anodeVoltage", { anodeVoltage: invalid })).toBeNull();
    }
  });

  test("Fermi Reactor derives normalized multiplication lens sensitivity and enforces Claim 1 lattice gating", () => {
    const id = "us-2708656-fermi-reactor";

    for (const rod of [50, 83.5, 95]) {
      const sens = computeParameterSensitivity(id, "rodWithdrawal", {
        rodWithdrawal: rod,
        moderatorPurity: 99.5,
        claim1Active: 1,
      });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Normalized Multiplication Lens");
      expect(sens?.derivativeSymbol).toBe("∂k_eff / ∂x_absorber");
      expect(sens?.derivativeUnit).toBe("k / % normalized travel");
      expect(sens?.derivativeValue).toBeCloseTo(0.0003, 4);
    }

    // With Claim 1 lattice withheld, multiplication sensitivity must be zero
    const decoupledSens = computeParameterSensitivity(id, "rodWithdrawal", {
      rodWithdrawal: 83.5,
      moderatorPurity: 99.5,
      claim1Active: 0,
    });
    expect(decoupledSens).toBeDefined();
    expect(decoupledSens?.derivativeValue).toBe(0);
    expect(decoupledSens?.interpretation).toContain("zero neutron multiplication sensitivity");

    // Claim 1 visibility control
    for (const claim of [0, 1]) {
      const sensClaim = computeParameterSensitivity(id, "claim1Active", { claim1Active: claim });
      expect(sensClaim).toBeDefined();
      expect(sensClaim?.metricName).toBe("Claim 1 Lattice Geometry Visibility");
      expect(sensClaim?.derivativeValue).toBe(1);
    }

    // Invalid parameters
    for (const invalid of [-1, 101, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "rodWithdrawal", { rodWithdrawal: invalid }),
      ).toBeNull();
    }
    for (const invalid of [94.9, 100.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "moderatorPurity", { moderatorPurity: invalid }),
      ).toBeNull();
    }
    for (const invalid of [-0.1, 1.1, Number.NaN]) {
      expect(computeParameterSensitivity(id, "claim1Active", { claim1Active: invalid })).toBeNull();
    }
  });

  test("Arkwright Water Frame derives flyer spindle speed and draft attenuation sensitivities", () => {
    const id = "gb-931-arkwright-water-frame";

    // Flyer spindle speed sensitivity (18.5 RPM / RPM)
    for (const rpm of [60, 120, 180, 260]) {
      const sens = computeParameterSensitivity(id, "waterWheelRpm", { waterWheelRpm: rpm });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Flyer Spindle Rotation Speed");
      expect(sens?.derivativeSymbol).toBe("∂N_spindle / ∂RPM_wheel");
      expect(sens?.derivativeUnit).toBe("RPM / RPM");
      expect(sens?.derivativeValue).toBe(18.5);
    }

    // Draft ratio attenuation sensitivity
    for (const draft of [3.0, 6.0, 10.0]) {
      const sens = computeParameterSensitivity(id, "totalDraftRatio", {
        totalDraftRatio: draft,
        inputRovingCountNe: 1.5,
      });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Yarn Count Attenuation");
      expect(sens?.derivativeSymbol).toBe("∂Ne / ∂Draft");
      expect(sens?.derivativeUnit).toBe("count / ratio");
      expect(sens?.derivativeValue).toBe(1.5);
    }

    // Invalid bounds
    for (const invalid of [59, 261, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "waterWheelRpm", { waterWheelRpm: invalid }),
      ).toBeNull();
    }
    for (const invalid of [2.9, 10.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "totalDraftRatio", { totalDraftRatio: invalid }),
      ).toBeNull();
    }
    for (const invalid of [0.9, 6.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "rollerClampingWeightKg", {
          rollerClampingWeightKg: invalid,
        }),
      ).toBeNull();
    }
    for (const invalid of [19, 39, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "stapleLengthMm", { stapleLengthMm: invalid }),
      ).toBeNull();
    }
    for (const invalid of [0.4, 2.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "inputRovingCountNe", { inputRovingCountNe: invalid }),
      ).toBeNull();
    }
  });

  test("Watt Rotary Engine derives epicyclic speed multiplication and gear ratio sensitivities", () => {
    const id = "gb-1306-watt-rotary-engine";

    // Stroke rate sensitivity
    for (const ratio of [0.5, 1.0, 1.5, 2.0]) {
      const sens = computeParameterSensitivity(id, "strokeRateSpm", {
        strokeRateSpm: 20,
        gearRatioNpOverNs: ratio,
      });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Shaft Rotational Speed");
      expect(sens?.derivativeSymbol).toBe("∂RPM / ∂SPM");
      expect(sens?.derivativeUnit).toBe("RPM / SPM");
      expect(sens?.derivativeValue).toBeCloseTo(1.0 + ratio, 3);
    }

    // Gear ratio sensitivity
    const sensRatio = computeParameterSensitivity(id, "gearRatioNpOverNs", {
      gearRatioNpOverNs: 1.0,
    });
    expect(sensRatio).toBeDefined();
    expect(sensRatio?.metricName).toBe("Shaft Speed Multiplier");
    expect(sensRatio?.derivativeSymbol).toBe("∂Mult / ∂Ratio");
    expect(sensRatio?.derivativeUnit).toBe("multiplier / ratio");
    expect(sensRatio?.derivativeValue).toBe(1.0);

    // Invalid bounds
    for (const invalid of [9, 31, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "strokeRateSpm", { strokeRateSpm: invalid }),
      ).toBeNull();
    }
    for (const invalid of [39, 121, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "boilerPressureKpa", { boilerPressureKpa: invalid }),
      ).toBeNull();
    }
    for (const invalid of [0.4, 2.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "gearRatioNpOverNs", { gearRatioNpOverNs: invalid }),
      ).toBeNull();
    }
    for (const invalid of [999, 6001, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "flywheelMassKg", { flywheelMassKg: invalid }),
      ).toBeNull();
    }
  });

  test("Cort Puddling & Rolling derives decarburization rate and rabble stirring sensitivities", () => {
    const id = "gb-1420-cort-puddling-rolling";

    // Furnace temperature sensitivity
    const sensTemp = computeParameterSensitivity(id, "furnaceTemperatureCelsius", {
      furnaceTemperatureCelsius: 1350,
    });
    expect(sensTemp).toBeDefined();
    expect(sensTemp?.metricName).toBe("Decarburization Oxidation Rate");
    expect(sensTemp?.derivativeSymbol).toBe("∂Rate_decarb / ∂T");
    expect(sensTemp?.derivativeUnit).toBe("%/min / °C");
    expect(sensTemp?.derivativeValue).toBe(0.015);

    // Rabble stirring sensitivity
    const sensRabble = computeParameterSensitivity(id, "rabbleStirringRpm", {
      rabbleStirringRpm: 15,
    });
    expect(sensRabble).toBeDefined();
    expect(sensRabble?.metricName).toBe("Slag Contact Decarburization Enhancement");
    expect(sensRabble?.derivativeSymbol).toBe("∂Rate_decarb / ∂RPM_rabble");
    expect(sensRabble?.derivativeUnit).toBe("%/min / RPM");
    expect(sensRabble?.derivativeValue).toBe(0.022);

    // Invalid bounds
    for (const invalid of [1149, 1551, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "furnaceTemperatureCelsius", {
          furnaceTemperatureCelsius: invalid,
        }),
      ).toBeNull();
    }
    for (const invalid of [2.7, 4.6, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "initialCarbonPercent", { initialCarbonPercent: invalid }),
      ).toBeNull();
    }
    for (const invalid of [-1, 26, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "rabbleStirringRpm", { rabbleStirringRpm: invalid }),
      ).toBeNull();
    }
    for (const invalid of [29, 151, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "puddlingDurationMinutes", {
          puddlingDurationMinutes: invalid,
        }),
      ).toBeNull();
    }
    for (const invalid of [0, 9, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "rollerPassCount", { rollerPassCount: invalid }),
      ).toBeNull();
    }
  });

  test("Hopkins Potash derives calcination purity and leaching solubility sensitivities", () => {
    const id = "us-x1-hopkins-potash";

    // Roasting temperature sensitivity
    const sensRoast = computeParameterSensitivity(id, "roastTempC", { roastTempC: 750 });
    expect(sensRoast).toBeDefined();
    expect(sensRoast?.metricName).toBe("Potash Carbon Burnout Purity");
    expect(sensRoast?.derivativeSymbol).toBe("∂Purity / ∂T_roast");
    expect(sensRoast?.derivativeUnit).toBe("% / °C");
    expect(sensRoast?.derivativeValue).toBe(0.05);

    // Leaching water temperature sensitivity
    const sensWater = computeParameterSensitivity(id, "waterTempC", { waterTempC: 80 });
    expect(sensWater).toBeDefined();
    expect(sensWater?.metricName).toBe("Potassium Carbonate Leaching Solubility");
    expect(sensWater?.derivativeSymbol).toBe("∂C_sat / ∂T_water");
    expect(sensWater?.derivativeUnit).toBe("(g/L) / °C");
    expect(sensWater?.derivativeValue).toBe(4.4);

    // Invalid bounds
    for (const invalid of [499, 951, Number.NaN]) {
      expect(computeParameterSensitivity(id, "roastTempC", { roastTempC: invalid })).toBeNull();
    }
    for (const invalid of [0.4, 6.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "roastTimeHours", { roastTimeHours: invalid }),
      ).toBeNull();
    }
    for (const invalid of [49, 501, Number.NaN]) {
      expect(computeParameterSensitivity(id, "ashBatchKg", { ashBatchKg: invalid })).toBeNull();
    }
    for (const invalid of [19, 101, Number.NaN]) {
      expect(computeParameterSensitivity(id, "waterTempC", { waterTempC: invalid })).toBeNull();
    }
  });

  test("Rillieux Multi-Effect Evaporator derives steam economy and feed rate sensitivities", () => {
    const id = "us-3237-rillieux-evaporator";

    // Number of effects sensitivity
    const sensEffects = computeParameterSensitivity(id, "numberOfEffects", { numberOfEffects: 3 });
    expect(sensEffects).toBeDefined();
    expect(sensEffects?.metricName).toBe("Steam Enthalpy Economy");
    expect(sensEffects?.derivativeSymbol).toBe("∂Economy / ∂N_effects");
    expect(sensEffects?.derivativeUnit).toBe("(kg evaporated/kg steam) / effect");
    expect(sensEffects?.derivativeValue).toBe(0.88);

    // Juice feed rate mass flow sensitivity
    const sensFeed = computeParameterSensitivity(id, "juiceFeedRateKgPerH", {
      juiceFeedRateKgPerH: 10000,
      initialBrixDeg: 14,
      targetBrixDeg: 65,
    });
    expect(sensFeed).toBeDefined();
    expect(sensFeed?.metricName).toBe("Water Evaporation Mass Flow Rate");
    expect(sensFeed?.derivativeSymbol).toBe("∂m_evap / ∂m_feed");
    expect(sensFeed?.derivativeUnit).toBe("(kg/h) / (kg/h)");
    expect(sensFeed?.derivativeValue).toBeCloseTo(1.0 - 14 / 65, 4);

    // Invalid bounds
    for (const invalid of [1999, 25001, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "juiceFeedRateKgPerH", { juiceFeedRateKgPerH: invalid }),
      ).toBeNull();
    }
    for (const invalid of [9.9, 20.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "initialBrixDeg", { initialBrixDeg: invalid }),
      ).toBeNull();
    }
    for (const invalid of [49.9, 75.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "targetBrixDeg", { targetBrixDeg: invalid }),
      ).toBeNull();
    }
    for (const invalid of [1, 5, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "numberOfEffects", { numberOfEffects: invalid }),
      ).toBeNull();
    }
  });

  test("Lincoln Buoyancy Chambers derives draft reduction and displacement loading sensitivities", () => {
    const id = "us-6469-lincoln-buoy";
    const h = 1e-4;

    const buoy = stepLincolnBuoy({ inflationPct: 75, weightTons: 380, shoalDepth: 3.5 });

    // Inflation percent sensitivity
    const sensInfl = computeParameterSensitivity(id, "inflationPct", {
      inflationPct: 75,
      weightTons: 380,
      shoalDepth: 3.5,
    });
    expect(sensInfl).toBeDefined();
    expect(sensInfl?.metricName).toBe("Hull Draft Shoal Reduction");
    expect(sensInfl?.derivativeSymbol).toBe("∂Draft / ∂%_inflation");
    expect(sensInfl?.derivativeUnit).toBe("ft / %");
    expect(sensInfl?.derivativeValue).toBe(buoy.draftReductionSlopeFtPerPct);

    // Finite difference check for inflation
    const buoyFwdInfl = stepLincolnBuoy({ inflationPct: 75 + h, weightTons: 380, shoalDepth: 3.5 });
    const buoyBwdInfl = stepLincolnBuoy({ inflationPct: 75 - h, weightTons: 380, shoalDepth: 3.5 });
    const fdInfl =
      (buoyFwdInfl.draftReductionFtUnrounded - buoyBwdInfl.draftReductionFtUnrounded) / (2 * h);
    expect(sensInfl?.derivativeValue).toBeCloseTo(fdInfl, 5);

    // Steamboat weight loading sensitivity
    const sensWeight = computeParameterSensitivity(id, "weightTons", {
      inflationPct: 75,
      weightTons: 380,
      shoalDepth: 3.5,
    });
    expect(sensWeight).toBeDefined();
    expect(sensWeight?.metricName).toBe("Hull Draft Displacement Loading");
    expect(sensWeight?.derivativeSymbol).toBe("∂Draft / ∂W_steamboat");
    expect(sensWeight?.derivativeUnit).toBe("ft / ton");
    expect(sensWeight?.derivativeValue).toBe(buoy.hullDraftSlopeFtPerTon);

    // Finite difference check for weight loading
    const buoyFwdWeight = stepLincolnBuoy({
      inflationPct: 75,
      weightTons: 380 + h,
      shoalDepth: 3.5,
    });
    const buoyBwdWeight = stepLincolnBuoy({
      inflationPct: 75,
      weightTons: 380 - h,
      shoalDepth: 3.5,
    });
    const fdWeight =
      (buoyFwdWeight.hullDraftFtUnrounded - buoyBwdWeight.hullDraftFtUnrounded) / (2 * h);
    expect(sensWeight?.derivativeValue).toBeCloseTo(fdWeight, 5);

    // Alias preservation
    for (const alias of ["inflation", "expansionPct", "bellowsInflationPct"]) {
      const sensAlias = computeParameterSensitivity(id, alias, { [alias]: 75, weightTons: 380 });
      expect(sensAlias?.derivativeValue).toBe(sensInfl?.derivativeValue);
    }
    for (const alias of ["weight", "steamboatWeightTons"]) {
      const sensAlias = computeParameterSensitivity(id, alias, { inflationPct: 75, [alias]: 380 });
      expect(sensAlias?.derivativeValue).toBe(sensWeight?.derivativeValue);
    }

    // Claim 1 refusal: when expandable chamber attachment is withheld, draft reduction is 0
    const sensRefused = computeParameterSensitivity(id, "inflationPct", {
      inflationPct: 75,
      weightTons: 380,
      claim1Active: false,
    });
    expect(sensRefused?.derivativeValue).toBe(0);
    expect(sensRefused?.interpretation).toContain(
      "Claim 1 expandable buoyant chamber attachment is withheld",
    );

    // Invalid bounds
    for (const invalid of [-1, 101, Number.NaN]) {
      expect(computeParameterSensitivity(id, "inflationPct", { inflationPct: invalid })).toBeNull();
    }
    for (const invalid of [199, 601, Number.NaN]) {
      expect(computeParameterSensitivity(id, "weightTons", { weightTons: invalid })).toBeNull();
    }
    for (const invalid of [1.9, 12.1, Number.NaN]) {
      expect(computeParameterSensitivity(id, "shoalDepth", { shoalDepth: invalid })).toBeNull();
    }
  });

  test("Nobel Dynamite derives detonation shock front and cap initiation sensitivities", () => {
    const id = "us-78317-nobel-dynamite";

    // NG concentration sensitivity
    const sensNg = computeParameterSensitivity(id, "ngConcentrationPct", {
      ngConcentrationPct: 75,
      capEnergyJoules: 15,
    });
    expect(sensNg).toBeDefined();
    expect(sensNg?.metricName).toBe("Detonation Shock Front Velocity");
    expect(sensNg?.derivativeSymbol).toBe("∂v_det / ∂%_NG");
    expect(sensNg?.derivativeUnit).toBe("m/s / %");
    expect(sensNg?.derivativeValue).toBe(45.0);

    // Blasting cap energy sensitivity
    const sensCap = computeParameterSensitivity(id, "capEnergyJoules", {
      ngConcentrationPct: 75,
      capEnergyJoules: 15,
    });
    expect(sensCap).toBeDefined();
    expect(sensCap?.metricName).toBe("Blasting Cap Initiation Energy");
    expect(sensCap?.derivativeSymbol).toBe("∂E_det / ∂E_cap");
    expect(sensCap?.derivativeUnit).toBe("J / J");
    expect(sensCap?.derivativeValue).toBe(1.0);

    // Invalid bounds
    for (const invalid of [49, 81, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "ngConcentrationPct", { ngConcentrationPct: invalid }),
      ).toBeNull();
    }
    for (const invalid of [4, 51, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "capEnergyJoules", { capEnergyJoules: invalid }),
      ).toBeNull();
    }
  });

  test("Hyatt Celluloid derives thermoplastic molding and hydraulic consolidation sensitivities", () => {
    const id = "us-105338-hyatt-celluloid";

    // Steam temperature sensitivity
    const sensSteam = computeParameterSensitivity(id, "steamTempC", {
      steamTempC: 125,
      hydraulicPressureMpa: 18,
    });
    expect(sensSteam).toBeDefined();
    expect(sensSteam?.metricName).toBe("Thermoplastic Molding Plasticity");
    expect(sensSteam?.derivativeSymbol).toBe("∂Flow / ∂T_steam");
    expect(sensSteam?.derivativeUnit).toBe("mm/s / °C");
    expect(sensSteam?.derivativeValue).toBe(0.12);

    // Hydraulic pressure sensitivity
    const sensPress = computeParameterSensitivity(id, "hydraulicPressureMpa", {
      steamTempC: 125,
      hydraulicPressureMpa: 18,
    });
    expect(sensPress).toBeDefined();
    expect(sensPress?.metricName).toBe("Consolidation Density Gradient");
    expect(sensPress?.derivativeSymbol).toBe("∂Density / ∂P_hydraulic");
    expect(sensPress?.derivativeUnit).toBe("(g/cm³) / MPa");
    expect(sensPress?.derivativeValue).toBe(0.004);

    // Invalid bounds
    for (const invalid of [89, 151, Number.NaN]) {
      expect(computeParameterSensitivity(id, "steamTempC", { steamTempC: invalid })).toBeNull();
    }
    for (const invalid of [4, 36, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "hydraulicPressureMpa", { hydraulicPressureMpa: invalid }),
      ).toBeNull();
    }
  });

  test("Glidden Barbed Wire derives barb clamping, span sag stiffness, and contact stress sensitivities", () => {
    const id = "us-157124-glidden-barbed-wire";
    const h = 1e-4;

    const glidden = stepGliddenBarbedWire({
      wireTensionN: 1800,
      twistsPerFoot: 3.5,
      animalPushForceN: 450,
    });

    // Twists per foot sensitivity
    const sensTwist = computeParameterSensitivity(id, "twistsPerFoot", {
      wireTensionN: 1800,
      twistsPerFoot: 3.5,
      animalPushForceN: 450,
    });
    expect(sensTwist).toBeDefined();
    expect(sensTwist?.metricName).toBe("Spurred Barb Interlock Clamping Force");
    expect(sensTwist?.derivativeSymbol).toBe("∂F_clamp / ∂Twist");
    expect(sensTwist?.derivativeUnit).toBe("N / twist");
    expect(sensTwist?.derivativeValue).toBe(glidden.barbSlipThresholdSlopeNPerTwist);

    // Finite difference check for twist clamping
    const gFwdTwist = stepGliddenBarbedWire({
      wireTensionN: 1800,
      twistsPerFoot: 3.5 + h,
      animalPushForceN: 450,
    });
    const gBwdTwist = stepGliddenBarbedWire({
      wireTensionN: 1800,
      twistsPerFoot: 3.5 - h,
      animalPushForceN: 450,
    });
    const fdTwist = (gFwdTwist.barbSlipThresholdN - gBwdTwist.barbSlipThresholdN) / (2 * h);
    expect(sensTwist?.derivativeValue).toBeCloseTo(fdTwist, 5);

    // Wire tension sag stiffness sensitivity
    const sensTension = computeParameterSensitivity(id, "wireTensionN", {
      wireTensionN: 1800,
      twistsPerFoot: 3.5,
      animalPushForceN: 450,
    });
    expect(sensTension).toBeDefined();
    expect(sensTension?.metricName).toBe("Fence Span Elastic Sag Stiffness");
    expect(sensTension?.derivativeSymbol).toBe("∂δ_sag / ∂T_wire");
    expect(sensTension?.derivativeUnit).toBe("mm / N");
    expect(sensTension?.derivativeValue).toBe(glidden.sagSlopeMmPerN);

    // Finite difference check for tension sag
    const gFwdTension = stepGliddenBarbedWire({
      wireTensionN: 1800 + h,
      twistsPerFoot: 3.5,
      animalPushForceN: 450,
    });
    const gBwdTension = stepGliddenBarbedWire({
      wireTensionN: 1800 - h,
      twistsPerFoot: 3.5,
      animalPushForceN: 450,
    });
    const fdTension = (gFwdTension.sagMmUnrounded - gBwdTension.sagMmUnrounded) / (2 * h);
    expect(sensTension?.derivativeValue).toBeCloseTo(fdTension, 4);

    // Animal push force contact stress sensitivity
    const sensPush = computeParameterSensitivity(id, "animalPushForceN", {
      wireTensionN: 1800,
      twistsPerFoot: 3.5,
      animalPushForceN: 450,
    });
    expect(sensPush).toBeDefined();
    expect(sensPush?.metricName).toBe("Barb Contact Stress");
    expect(sensPush?.derivativeSymbol).toBe("∂σ_contact / ∂F_push");
    expect(sensPush?.derivativeUnit).toBe("MPa / N");
    expect(sensPush?.derivativeValue).toBe(glidden.contactStressSlopeMpaPerN);

    // Finite difference check for contact stress
    const gFwdPush = stepGliddenBarbedWire({
      wireTensionN: 1800,
      twistsPerFoot: 3.5,
      animalPushForceN: 450 + h,
    });
    const gBwdPush = stepGliddenBarbedWire({
      wireTensionN: 1800,
      twistsPerFoot: 3.5,
      animalPushForceN: 450 - h,
    });
    const fdPush =
      (gFwdPush.contactStressMpaUnrounded - gBwdPush.contactStressMpaUnrounded) / (2 * h);
    expect(sensPush?.derivativeValue).toBeCloseTo(fdPush, 4);

    // Alias preservation
    for (const alias of ["twists", "twistRate"]) {
      const sensAlias = computeParameterSensitivity(id, alias, {
        wireTensionN: 1800,
        [alias]: 3.5,
        animalPushForceN: 450,
      });
      expect(sensAlias?.derivativeValue).toBe(sensTwist?.derivativeValue);
    }
    for (const alias of ["tension", "tensionN", "lineTensionN"]) {
      const sensAlias = computeParameterSensitivity(id, alias, {
        [alias]: 1800,
        twistsPerFoot: 3.5,
        animalPushForceN: 450,
      });
      expect(sensAlias?.derivativeValue).toBe(sensTension?.derivativeValue);
    }
    for (const alias of ["pushForce", "pushForceN", "push"]) {
      const sensAlias = computeParameterSensitivity(id, alias, {
        wireTensionN: 1800,
        twistsPerFoot: 3.5,
        [alias]: 450,
      });
      expect(sensAlias?.derivativeValue).toBe(sensPush?.derivativeValue);
    }

    // Claim 1 refusal: when twisted wire locking is withheld, clamping force drops to 0
    const sensRefused = computeParameterSensitivity(id, "twistsPerFoot", {
      wireTensionN: 1800,
      twistsPerFoot: 3.5,
      animalPushForceN: 450,
      claim1Active: false,
    });
    expect(sensRefused?.derivativeValue).toBe(0);
    expect(sensRefused?.interpretation).toContain(
      "Claim 1 twisted dual-strand wire lock is withheld",
    );

    // Invalid bounds
    for (const invalid of [199, 3501, Number.NaN]) {
      expect(computeParameterSensitivity(id, "wireTensionN", { wireTensionN: invalid })).toBeNull();
    }
    for (const invalid of [0.9, 10.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "twistsPerFoot", { twistsPerFoot: invalid }),
      ).toBeNull();
    }
    for (const invalid of [19, 1201, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "animalPushForceN", { animalPushForceN: invalid }),
      ).toBeNull();
    }
  });

  test("Howe Sewing Machine derives stitch formation rate, cloth feed velocity, and shuttle clearance sensitivities", () => {
    const id = "us-4750-howe-sewing-machine";
    const h = 1e-4;

    const howe = stepHoweSewingMachine(240, 65, 3.5);

    // Crank RPM sensitivity
    const sensRpm = computeParameterSensitivity(id, "crankRpm", {
      crankRpm: 240,
      stitchPitchMm: 3.5,
      loopSlackPct: 65,
    });
    expect(sensRpm).toBeDefined();
    expect(sensRpm?.metricName).toBe("Lockstitch Formation Rate");
    expect(sensRpm?.derivativeSymbol).toBe("∂Stitches / ∂RPM_crank");
    expect(sensRpm?.derivativeUnit).toBe("stitches/min / RPM");
    expect(sensRpm?.derivativeValue).toBe(howe.formationRateSlopePerRpm);

    // Finite difference check for RPM
    const hFwdRpm = stepHoweSewingMachine(240 + h, 65, 3.5);
    const hBwdRpm = stepHoweSewingMachine(240 - h, 65, 3.5);
    const fdRpm =
      (hFwdRpm.stitchesPerMinuteUnrounded - hBwdRpm.stitchesPerMinuteUnrounded) / (2 * h);
    expect(sensRpm?.derivativeValue).toBeCloseTo(fdRpm, 4);

    // Stitch pitch sensitivity
    const sensPitch = computeParameterSensitivity(id, "stitchPitchMm", {
      crankRpm: 240,
      stitchPitchMm: 3.5,
      loopSlackPct: 65,
    });
    expect(sensPitch).toBeDefined();
    expect(sensPitch?.metricName).toBe("Cloth Feed Velocity");
    expect(sensPitch?.derivativeSymbol).toBe("∂v_{feed} / ∂pitch");
    expect(sensPitch?.derivativeUnit).toBe("(mm/s) / mm");
    expect(sensPitch?.derivativeValue).toBe(howe.feedSlopeMmPerSPerMm);

    // Finite difference check for pitch
    const hFwdPitch = stepHoweSewingMachine(240, 65, 3.5 + h);
    const hBwdPitch = stepHoweSewingMachine(240, 65, 3.5 - h);
    const fdPitch =
      (hFwdPitch.clothFeedMmPerSUnrounded - hBwdPitch.clothFeedMmPerSUnrounded) / (2 * h);
    expect(sensPitch?.derivativeValue).toBeCloseTo(fdPitch, 4);

    // Loop slack sensitivity
    const sensSlack = computeParameterSensitivity(id, "loopSlackPct", {
      crankRpm: 240,
      stitchPitchMm: 3.5,
      loopSlackPct: 65,
    });
    expect(sensSlack).toBeDefined();
    expect(sensSlack?.metricName).toBe("Needle Loop Shuttle Clearance");
    expect(sensSlack?.derivativeSymbol).toBe("∂Clearance / ∂Slack");
    expect(sensSlack?.derivativeUnit).toBe("% / %");
    expect(sensSlack?.derivativeValue).toBe(howe.loopClearanceSlopePctPerPct);

    // Alias preservation
    for (const alias of ["rpm", "speed", "sewingSpeedRpm", "stitchingSpeedRpm"]) {
      const sensAlias = computeParameterSensitivity(id, alias, {
        [alias]: 240,
        stitchPitchMm: 3.5,
        loopSlackPct: 65,
      });
      expect(sensAlias?.derivativeValue).toBe(sensRpm?.derivativeValue);
    }
    for (const alias of ["pitch", "feedPitch"]) {
      const sensAlias = computeParameterSensitivity(id, alias, {
        crankRpm: 240,
        [alias]: 3.5,
        loopSlackPct: 65,
      });
      expect(sensAlias?.derivativeValue).toBe(sensPitch?.derivativeValue);
    }
    for (const alias of ["slack", "slackPct"]) {
      const sensAlias = computeParameterSensitivity(id, alias, {
        crankRpm: 240,
        stitchPitchMm: 3.5,
        [alias]: 65,
      });
      expect(sensAlias?.derivativeValue).toBe(sensSlack?.derivativeValue);
    }

    // Claim 1 refusal: when eye-pointed needle & shuttle interlock is withheld
    const sensRefusedClaim = computeParameterSensitivity(id, "crankRpm", {
      crankRpm: 240,
      stitchPitchMm: 3.5,
      loopSlackPct: 65,
      claim1Active: false,
    });
    expect(sensRefusedClaim?.derivativeValue).toBe(0);
    expect(sensRefusedClaim?.interpretation).toContain(
      "Claim 1 eye-pointed needle and shuttle interlock is withheld",
    );

    // Interlock threshold refusal: loop slack < 40%
    const sensLowSlack = computeParameterSensitivity(id, "crankRpm", {
      crankRpm: 240,
      stitchPitchMm: 3.5,
      loopSlackPct: 35,
    });
    expect(sensLowSlack?.derivativeValue).toBe(0);
    expect(sensLowSlack?.interpretation).toContain(
      "Loop slack is below 40% threshold required for shuttle pass",
    );

    // Invalid bounds
    for (const invalid of [59, 421, Number.NaN]) {
      expect(computeParameterSensitivity(id, "crankRpm", { crankRpm: invalid })).toBeNull();
    }
    for (const invalid of [0.9, 6.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "stitchPitchMm", { stitchPitchMm: invalid }),
      ).toBeNull();
    }
    for (const invalid of [-1, 101, Number.NaN]) {
      expect(computeParameterSensitivity(id, "loopSlackPct", { loopSlackPct: invalid })).toBeNull();
    }
  });

  test("Hall differentiates the actual unrounded production at all public control regimes", () => {
    const id = "us-400766-hall-aluminium";
    const controls = [
      { key: "currentAmperes", min: 100000, max: 500000, h: 10, unit: "A" },
      { key: "bathTemperatureCelsius", min: 920, max: 1020, h: 0.001, unit: "°C" },
      { key: "aluminaConcentrationPct", min: 2, max: 8, h: 0.0001, unit: "wt% point" },
    ] as const;
    for (const currentAmperes of [100000, 300000, 410000, 500000]) {
      for (const bathTemperatureCelsius of [920, 950, 960, 990, 1020]) {
        for (const aluminaConcentrationPct of [2, 2.5, 4, 5.5, 8]) {
          const params = { currentAmperes, bathTemperatureCelsius, aluminaConcentrationPct };
          for (const control of controls) {
            const slope = computeParameterSensitivity(id, control.key, params);
            const atKnee =
              (control.key === "bathTemperatureCelsius" && bathTemperatureCelsius === 960) ||
              (control.key === "aluminaConcentrationPct" && aluminaConcentrationPct === 4);
            if (atKnee) {
              expect(slope).toBeNull();
              continue;
            }
            if (!slope)
              throw new Error(`Missing ${control.key} slope at ${JSON.stringify(params)}`);
            const low = Math.max(control.min, params[control.key] - control.h);
            const high = Math.min(control.max, params[control.key] + control.h);
            const production = (value: number) =>
              stepHallAluminium({ ...params, [control.key]: value })
                .aluminiumProductionKgPerHourUnrounded;
            const numerical = (production(high) - production(low)) / (high - low);
            expect(slope.derivativeValue).toBeCloseTo(numerical, 7);
            expect(slope.metricName).toBe("Aluminium Production (Model)");
            expect(slope.derivativeUnit).toBe(`kg / (h·${control.unit})`);
            expect(slope.interpretation).toContain("illustrative");
          }
        }
      }
    }
  });

  test("Hall current follows efficiency and all aliases preserve output identity", () => {
    const id = "us-400766-hall-aluminium";
    const hotLean = {
      currentAmperes: 410000,
      bathTemperatureCelsius: 990,
      aluminaConcentrationPct: 2.5,
    };
    const current = computeParameterSensitivity(id, "currentAmperes", hotLean);
    expect(current?.derivativeValue).toBeCloseTo(0.00029524, 10);
    expect(current?.derivativeValue).not.toBe(0.316 / 1000);
    expect(computeParameterSensitivity(id, "currentAmperes", {})?.derivativeValue).toBeCloseTo(
      0.00031537,
      10,
    );
    expect(
      computeParameterSensitivity(id, "bathTemperatureCelsius", hotLean)?.derivativeValue,
    ).toBeCloseTo(-0.137555, 8);
    expect(
      computeParameterSensitivity(id, "aluminaConcentrationPct", hotLean)?.derivativeValue,
    ).toBeCloseTo(2.7511, 8);
    const aliases = { current: 410000, tempC: 990, aluminaPct: 2.5 };
    for (const [canonical, alias] of [
      ["currentAmperes", "current"],
      ["bathTemperatureCelsius", "tempC"],
      ["aluminaConcentrationPct", "aluminaPct"],
    ]) {
      expect(computeParameterSensitivity(id, alias, aliases)).toEqual(
        computeParameterSensitivity(id, canonical, hotLean),
      );
    }
    expect(
      computeParameterSensitivity(id, "temperatureCelsius", {
        ...hotLean,
        bathTemperatureCelsius: undefined,
        temperatureCelsius: 990,
      }),
    ).toEqual(computeParameterSensitivity(id, "bathTemperatureCelsius", hotLean));
  });

  test("Hall refuses unsupported controls and inputs, including every public range violation", () => {
    const id = "us-400766-hall-aluminium";
    const invalidParams = [
      { currentAmperes: 99999 },
      { currentAmperes: 500001 },
      { bathTemperatureCelsius: 919 },
      { bathTemperatureCelsius: 1021 },
      { aluminaConcentrationPct: 1.9 },
      { aluminaConcentrationPct: 8.1 },
      { currentAmperes: Number.NaN },
      { bathTemperatureCelsius: Number.POSITIVE_INFINITY },
      { aluminaConcentrationPct: Number.NEGATIVE_INFINITY },
    ];
    for (const params of invalidParams) {
      for (const key of ["currentAmperes", "bathTemperatureCelsius", "aluminaConcentrationPct"]) {
        expect(computeParameterSensitivity(id, key, params)).toBeNull();
      }
    }
    expect(computeParameterSensitivity(id, "inventedConductivityControl", {})).toBeNull();
  });

  test("Diesel slopes follow unrounded temperature and displayed brake-efficiency model", () => {
    const id = "us-542846-diesel-engine";
    for (const compRatio of [12, 14.5, 18, 21.5, 22]) {
      for (const cutoffRatio of [1.2, 1.6, 2, 2.2]) {
        const params = { compRatio, cutoffRatio, blastAirPressure: 65, engineRpm: 150 };
        const temp = computeParameterSensitivity(id, "compRatio", params);
        const efficiency = computeParameterSensitivity(id, "cutoffRatio", params);
        if (!temp || !efficiency) throw new Error("Expected supported ideal-cycle derivatives");
        const lowR = Math.max(12, compRatio - 0.00001),
          highR = Math.min(22, compRatio + 0.00001);
        const lowC = Math.max(1.2, cutoffRatio - 0.00001),
          highC = Math.min(2.2, cutoffRatio + 0.00001);
        const probe = (r: number, rc: number) =>
          stepDieselEngine({ compressionRatio: r, cutoffRatio: rc });
        const tempDifference =
          (probe(highR, cutoffRatio).tCompressionKUnrounded -
            probe(lowR, cutoffRatio).tCompressionKUnrounded) /
          (highR - lowR);
        const efficiencyDifference =
          (probe(compRatio, highC).brakeEfficiencyPctUnrounded -
            probe(compRatio, lowC).brakeEfficiencyPctUnrounded) /
          (highC - lowC);
        expect(temp.derivativeValue).toBeCloseTo(tempDifference, 4);
        expect(efficiency.derivativeValue).toBeCloseTo(efficiencyDifference, 4);
        expect(temp.metricName).toBe("Compression Temperature (Model)");
        expect(temp.derivativeUnit).toBe("°C / ratio");
        expect(efficiency.metricName).toBe("Brake Efficiency (Model)");
        expect(efficiency.derivativeUnit).toBe("percentage points / ratio");
        expect(efficiency.interpretation).toContain("0.68");
        expect(
          computeParameterSensitivity(id, "compressionRatio", {
            compressionRatio: compRatio,
            cutoffRatio,
          }),
        ).toEqual(temp);
        expect(
          computeParameterSensitivity(id, "cutoff", {
            compressionRatio: compRatio,
            cutoff: cutoffRatio,
          }),
        ).toEqual(efficiency);
      }
    }
    expect(computeParameterSensitivity(id, "compRatio", {})).toEqual(
      computeParameterSensitivity(id, "compRatio", {
        compRatio: 18,
        cutoffRatio: 1.6,
        blastAirPressure: 65,
        engineRpm: 150,
      }),
    );
    expect(computeParameterSensitivity(id, "compRatio", {})?.derivativeValue).not.toBe(42);
    const small = computeParameterSensitivity(id, "cutoffRatio", { compRatio: 12 });
    const large = computeParameterSensitivity(id, "cutoffRatio", { compRatio: 22 });
    expect(small?.derivativeValue).not.toBe(large?.derivativeValue);
  });

  test("Diesel sensitivity domain follows every public control and declines unrelated quantities", () => {
    const id = "us-542846-diesel-engine";
    const invalid = [
      { compRatio: 11.9 },
      { compRatio: 22.1 },
      { blastAirPressure: 44 },
      { blastAirPressure: 86 },
      { cutoffRatio: 1.19 },
      { cutoffRatio: 2.21 },
      { engineRpm: 59 },
      { engineRpm: 301 },
      { compRatio: Number.NaN },
      { blastAirPressure: Number.POSITIVE_INFINITY },
    ];
    for (const params of invalid) {
      expect(computeParameterSensitivity(id, "compRatio", params)).toBeNull();
      expect(computeParameterSensitivity(id, "cutoffRatio", params)).toBeNull();
    }
    for (const blastAirPressure of [45, 85]) {
      for (const engineRpm of [60, 300]) {
        expect(
          computeParameterSensitivity(id, "compRatio", { blastAirPressure, engineRpm }),
        ).not.toBeNull();
      }
    }
    expect(computeParameterSensitivity(id, "blastAirPressure", {})).toBeNull();
    expect(computeParameterSensitivity(id, "engineRpm", {})).toBeNull();
  });

  test("Otto four-stroke slopes follow unrounded air-standard efficiency and brake horsepower", () => {
    const id = "us-194047-otto-engine";
    for (const cr of [3.0, 4.5, 6.0, 7.5, 8.0]) {
      for (const rpm of [60, 120, 180, 240, 320]) {
        const params = { compressionRatio: cr, engineRpm: rpm };
        const effSens = computeParameterSensitivity(id, "compressionRatio", params);
        const hpSens = computeParameterSensitivity(id, "engineRpm", params);
        expect(effSens).toBeDefined();
        expect(hpSens).toBeDefined();
        if (!effSens || !hpSens) throw new Error("Expected Otto sensitivities");

        const lowR = Math.max(3.0, cr - 0.000001);
        const highR = Math.min(8.0, cr + 0.000001);
        const lowN = Math.max(60, rpm - 0.01);
        const highN = Math.min(320, rpm + 0.01);

        const effDifference =
          (stepOttoEngine({ engineRpm: rpm, compressionRatio: highR })
            .thermalEfficiencyPctUnrounded -
            stepOttoEngine({ engineRpm: rpm, compressionRatio: lowR })
              .thermalEfficiencyPctUnrounded) /
          (highR - lowR);

        const hpDifference =
          (stepOttoEngine({ engineRpm: highN, compressionRatio: cr }).brakeHorsepowerUnrounded -
            stepOttoEngine({ engineRpm: lowN, compressionRatio: cr }).brakeHorsepowerUnrounded) /
          (highN - lowN);

        expect(effSens.derivativeValue).toBeCloseTo(effDifference, 4);
        expect(hpSens.derivativeValue).toBeCloseTo(hpDifference, 4);
        expect(effSens.metricName).toBe("Thermal Efficiency (Air-Standard)");
        expect(effSens.derivativeUnit).toBe("% / ratio");
        expect(hpSens.metricName).toBe("Brake Horsepower (Model)");
        expect(hpSens.derivativeUnit).toBe("hp / rpm");

        // Alias identity
        expect(computeParameterSensitivity(id, "cr", params)).toEqual(effSens);
        expect(computeParameterSensitivity(id, "rpm", params)).toEqual(hpSens);
      }
    }

    // Default params match nominal 4.5 / 180
    expect(computeParameterSensitivity(id, "compressionRatio", {})).toEqual(
      computeParameterSensitivity(id, "compressionRatio", {
        compressionRatio: 4.5,
        engineRpm: 180,
      }),
    );
    expect(computeParameterSensitivity(id, "engineRpm", {})).toEqual(
      computeParameterSensitivity(id, "engineRpm", { compressionRatio: 4.5, engineRpm: 180 }),
    );
  });

  test("Otto sensitivity domain enforces public control bounds and refuses invalid inputs", () => {
    const id = "us-194047-otto-engine";
    const invalid = [
      { compressionRatio: 2.9 },
      { compressionRatio: 8.1 },
      { engineRpm: 59 },
      { engineRpm: 321 },
      { compressionRatio: Number.NaN },
      { engineRpm: Number.POSITIVE_INFINITY },
    ];
    for (const params of invalid) {
      expect(computeParameterSensitivity(id, "compressionRatio", params)).toBeNull();
      expect(computeParameterSensitivity(id, "engineRpm", params)).toBeNull();
    }
    expect(computeParameterSensitivity(id, "unsupportedOttoControl", {})).toBeNull();
  });

  test("Linde Air Liquefaction derives Joule-Thomson throttling drop and cooler sensitivities", () => {
    const id = "us-727650-linde-air-liquefaction";
    const h = 1e-4;

    for (const p of [50, 75, 120, 180]) {
      const sensP = computeParameterSensitivity(id, "inletPressureAtm", {
        inletPressureAtm: p,
        coolerOutletC: 10,
      });
      expect(sensP).toBeDefined();
      expect(sensP?.metricName).toBe("Joule-Thomson Throttling Drop");
      expect(sensP?.derivativeSymbol).toBe("∂ΔT_JT / ∂P");
      expect(sensP?.derivativeUnit).toBe("K / atm");

      const linde = FrankenSimEngine.stepLindeAirLiquefaction({
        inletPressureAtm: p,
        coolerOutletC: 10,
      });
      expect(sensP?.derivativeValue).toBeCloseTo(linde.jtSlopeKPerAtm, 4);

      const fPlus = FrankenSimEngine.stepLindeAirLiquefaction({
        inletPressureAtm: p + h,
        coolerOutletC: 10,
      }).jouleThomsonDropKUnrounded;
      const fMinus = FrankenSimEngine.stepLindeAirLiquefaction({
        inletPressureAtm: p - h,
        coolerOutletC: 10,
      }).jouleThomsonDropKUnrounded;
      const fd = (fPlus - fMinus) / (2 * h);
      expect(sensP?.derivativeValue).toBeCloseTo(fd, 4);

      // Aliases
      for (const key of ["throttlePressureBar", "pressure", "inletPressure", "pHigh"]) {
        const aliasSens = computeParameterSensitivity(id, key, {
          [key]: p,
          coolerOutletC: 10,
        });
        expect(aliasSens?.derivativeValue).toBe(sensP?.derivativeValue);
      }
    }

    for (const t of [-5, 5, 15, 25]) {
      const sensCooler = computeParameterSensitivity(id, "coolerOutletC", {
        inletPressureAtm: 75,
        coolerOutletC: t,
      });
      expect(sensCooler).toBeDefined();
      expect(sensCooler?.metricName).toBe("Pre-Cooler Temperature Sensitivity");
      expect(sensCooler?.derivativeSymbol).toBe("∂T_exp / ∂T_cooler");
      expect(sensCooler?.derivativeUnit).toBe("°C / °C");

      const linde = FrankenSimEngine.stepLindeAirLiquefaction({
        inletPressureAtm: 75,
        coolerOutletC: t,
      });
      expect(sensCooler?.derivativeValue).toBeCloseTo(linde.jtSlopeKPerC, 4);

      const fPlus = FrankenSimEngine.stepLindeAirLiquefaction({
        inletPressureAtm: 75,
        coolerOutletC: t + h,
      }).jouleThomsonDropKUnrounded;
      const fMinus = FrankenSimEngine.stepLindeAirLiquefaction({
        inletPressureAtm: 75,
        coolerOutletC: t - h,
      }).jouleThomsonDropKUnrounded;
      const fd = (fPlus - fMinus) / (2 * h);
      expect(sensCooler?.derivativeValue).toBeCloseTo(fd, 4);

      // Aliases
      for (const key of ["coolerTempC", "temperature", "tCooler"]) {
        const aliasSens = computeParameterSensitivity(id, key, {
          inletPressureAtm: 75,
          [key]: t,
        });
        expect(aliasSens?.derivativeValue).toBe(sensCooler?.derivativeValue);
      }
    }

    // Claim 1 refusal gating
    const gatedP = computeParameterSensitivity(id, "inletPressureAtm", {
      inletPressureAtm: 75,
      coolerOutletC: 10,
      claim1Active: false,
    });
    expect(gatedP?.derivativeValue).toBe(0);
    expect(gatedP?.interpretation).toContain("Claim 1");

    const gatedT = computeParameterSensitivity(id, "coolerOutletC", {
      inletPressureAtm: 75,
      coolerOutletC: 10,
      claim1Active: false,
    });
    expect(gatedT?.derivativeValue).toBe(0);
    expect(gatedT?.interpretation).toContain("Claim 1");

    // Invalid bounds
    for (const invalid of [49, 201, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "inletPressureAtm", { inletPressureAtm: invalid }),
      ).toBeNull();
    }
    for (const invalid of [-11, 26, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "coolerOutletC", { coolerOutletC: invalid }),
      ).toBeNull();
    }
  });

  test("Baekeland Bakelite derives void suppression, crosslinking kinetics, and conversion sensitivities", () => {
    const id = "us-942699-baekeland-bakelite";

    // Autoclave pressure sensitivity
    const sensPress = computeParameterSensitivity(id, "autoclavePressurePsi", {
      curingTempC: 150,
      autoclavePressurePsi: 75,
      catalystPct: 1.5,
      curingTimeMin: 60,
    });
    expect(sensPress).toBeDefined();
    expect(sensPress?.metricName).toBe("Polymer Void Suppression");
    expect(sensPress?.derivativeSymbol).toBe("∂Density / ∂P");
    expect(sensPress?.derivativeUnit).toBe("(g/cm³) / psi");

    // Central finite difference verification for pressure
    const hP = 1e-4;
    const fPPlus = stepBaekelandBakelite(150, 75 + hP, 1.5, 60).densityGPerCm3Unrounded;
    const fPMinus = stepBaekelandBakelite(150, 75 - hP, 1.5, 60).densityGPerCm3Unrounded;
    const numDerivP = (fPPlus - fPMinus) / (2 * hP);
    expect(sensPress?.derivativeValue).toBeCloseTo(numDerivP, 5);

    // Curing temperature sensitivity
    const sensTemp = computeParameterSensitivity(id, "curingTempC", {
      curingTempC: 150,
      autoclavePressurePsi: 75,
      catalystPct: 1.5,
      curingTimeMin: 60,
    });
    expect(sensTemp).toBeDefined();
    expect(sensTemp?.metricName).toBe("Crosslinking Kinetics Rate");
    expect(sensTemp?.derivativeSymbol).toBe("∂k_crosslink / ∂T");
    expect(sensTemp?.derivativeUnit).toBe("min⁻¹ / °C");

    // Central finite difference verification for temperature
    const hT = 1e-4;
    const fTPlus = stepBaekelandBakelite(150 + hT, 75, 1.5, 60).kRateUnrounded;
    const fTMinus = stepBaekelandBakelite(150 - hT, 75, 1.5, 60).kRateUnrounded;
    const numDerivT = (fTPlus - fTMinus) / (2 * hT);
    expect(sensTemp?.derivativeValue).toBeCloseTo(numDerivT, 4);

    // Curing time conversion sensitivity
    const sensTime = computeParameterSensitivity(id, "curingTimeMin", {
      curingTempC: 150,
      autoclavePressurePsi: 75,
      catalystPct: 1.5,
      curingTimeMin: 60,
    });
    expect(sensTime).toBeDefined();
    expect(sensTime?.metricName).toBe("Polycondensation Conversion Rate");
    expect(sensTime?.derivativeSymbol).toBe("∂p / ∂t");
    expect(sensTime?.derivativeUnit).toBe("conversion / min");

    // Central finite difference verification for curing time
    const hTime = 1e-4;
    const fTimePlus = stepBaekelandBakelite(150, 75, 1.5, 60 + hTime).conversionPUnrounded;
    const fTimeMinus = stepBaekelandBakelite(150, 75, 1.5, 60 - hTime).conversionPUnrounded;
    const numDerivTime = (fTimePlus - fTimeMinus) / (2 * hTime);
    expect(sensTime?.derivativeValue).toBeCloseTo(numDerivTime, 4);

    // Claim 1 gating
    const claim1Off = computeParameterSensitivity(id, "autoclavePressurePsi", {
      curingTempC: 150,
      autoclavePressurePsi: 75,
      claim1Active: false,
    });
    expect(claim1Off?.derivativeValue).toBe(0);
    expect(claim1Off?.interpretation).toContain("Claim 1");

    // Parameter alias checks
    const nominalP = sensPress?.derivativeValue;
    expect(
      computeParameterSensitivity(id, "pressure", {
        curingTempC: 150,
        autoclavePressurePsi: 75,
        catalystPct: 1.5,
        curingTimeMin: 60,
      })?.derivativeValue,
    ).toBe(nominalP);
    expect(
      computeParameterSensitivity(id, "pressurePsi", {
        curingTempC: 150,
        autoclavePressurePsi: 75,
        catalystPct: 1.5,
        curingTimeMin: 60,
      })?.derivativeValue,
    ).toBe(nominalP);

    const nominalT = sensTemp?.derivativeValue;
    expect(
      computeParameterSensitivity(id, "autoclaveTempC", {
        curingTempC: 150,
        autoclavePressurePsi: 75,
        catalystPct: 1.5,
        curingTimeMin: 60,
      })?.derivativeValue,
    ).toBe(nominalT);
    expect(
      computeParameterSensitivity(id, "temp", {
        curingTempC: 150,
        autoclavePressurePsi: 75,
        catalystPct: 1.5,
        curingTimeMin: 60,
      })?.derivativeValue,
    ).toBe(nominalT);
    expect(
      computeParameterSensitivity(id, "temperature", {
        curingTempC: 150,
        autoclavePressurePsi: 75,
        catalystPct: 1.5,
        curingTimeMin: 60,
      })?.derivativeValue,
    ).toBe(nominalT);

    // Invalid bounds
    for (const invalid of [109, 201, Number.NaN]) {
      expect(computeParameterSensitivity(id, "curingTempC", { curingTempC: invalid })).toBeNull();
    }
    for (const invalid of [29, 151, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "autoclavePressurePsi", { autoclavePressurePsi: invalid }),
      ).toBeNull();
    }
    for (const invalid of [0.4, 5.1, Number.NaN]) {
      expect(computeParameterSensitivity(id, "catalystPct", { catalystPct: invalid })).toBeNull();
    }
    for (const invalid of [14, 121, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "curingTimeMin", { curingTimeMin: invalid }),
      ).toBeNull();
    }
  });

  test("Haber Ammonia derives equilibrium yield, reaction rate, residence time, and catalyst activity sensitivities", () => {
    const id = "us-971501-haber-ammonia";
    const nominal = {
      pressureAtm: 175,
      temperatureCelsius: 530,
      feedFlowRateMolesPerSec: 50,
      catalystActivity: 1.0,
    };
    const haberNominal = stepHaberAmmonia(nominal);

    // Pressure sensitivity (atm and bar)
    const sensP = computeParameterSensitivity(id, "pressureAtm", nominal);
    expect(sensP).toBeDefined();
    expect(sensP?.metricName).toBe("Equilibrium Ammonia Yield");
    expect(sensP?.derivativeSymbol).toBe("∂X_eq / ∂P");
    expect(sensP?.derivativeUnit).toBe("% / atm");
    expect(sensP?.derivativeValue).toBe(
      Number(haberNominal.equilibriumAmmoniaSlopePctPerAtm.toPrecision(6)),
    );

    // Pressure finite-difference check
    const hP = 1e-4;
    const xEqHi = stepHaberAmmonia({
      ...nominal,
      pressureAtm: nominal.pressureAtm + hP,
    }).equilibriumAmmoniaPctUnrounded;
    const xEqLo = stepHaberAmmonia({
      ...nominal,
      pressureAtm: nominal.pressureAtm - hP,
    }).equilibriumAmmoniaPctUnrounded;
    const fdP = (xEqHi - xEqLo) / (2 * hP);
    expect(sensP?.derivativeValue).toBeCloseTo(fdP, 4);

    // Pressure bar alias
    const sensBar = computeParameterSensitivity(id, "synthesisPressureBar", nominal);
    expect(sensBar).toBeDefined();
    expect(sensBar?.derivativeUnit).toBe("% / bar");
    expect(sensBar?.derivativeValue).toBe(
      Number(haberNominal.equilibriumAmmoniaSlopePctPerBar.toPrecision(6)),
    );

    // Temperature sensitivity
    const sensT = computeParameterSensitivity(id, "temperatureCelsius", nominal);
    expect(sensT).toBeDefined();
    expect(sensT?.metricName).toBe("Catalytic Reaction Rate");
    expect(sensT?.derivativeSymbol).toBe("∂k_cat / ∂T");
    expect(sensT?.derivativeUnit).toBe("s⁻¹ / °C");
    expect(sensT?.derivativeValue).toBe(Number(haberNominal.kRateSlopePerCelsius.toPrecision(6)));

    // Temperature finite-difference check
    const hT = 1e-4;
    const kHi = stepHaberAmmonia({
      ...nominal,
      temperatureCelsius: nominal.temperatureCelsius + hT,
    }).kRateUnrounded;
    const kLo = stepHaberAmmonia({
      ...nominal,
      temperatureCelsius: nominal.temperatureCelsius - hT,
    }).kRateUnrounded;
    const fdT = (kHi - kLo) / (2 * hT);
    expect(sensT?.derivativeValue).toBeCloseTo(fdT, 4);

    // Temperature alias checks
    expect(computeParameterSensitivity(id, "synthesisTempC", nominal)?.derivativeValue).toBe(
      sensT?.derivativeValue,
    );
    expect(computeParameterSensitivity(id, "temperature", nominal)?.derivativeValue).toBe(
      sensT?.derivativeValue,
    );

    // Feed flow sensitivity
    const sensFlow = computeParameterSensitivity(id, "feedFlowRateMolesPerSec", nominal);
    expect(sensFlow).toBeDefined();
    expect(sensFlow?.metricName).toBe("Space Velocity Residence Time");
    expect(sensFlow?.derivativeSymbol).toBe("∂τ_res / ∂F_feed");
    expect(sensFlow?.derivativeUnit).toBe("s / (mol/s)");
    expect(sensFlow?.derivativeValue).toBe(
      Number(haberNominal.spaceTimeSlopePerMolSec.toPrecision(6)),
    );

    // Feed flow finite-difference check
    const hFlow = 1e-4;
    const tauHi = stepHaberAmmonia({
      ...nominal,
      feedFlowRateMolesPerSec: nominal.feedFlowRateMolesPerSec + hFlow,
    }).spaceTimeSecUnrounded;
    const tauLo = stepHaberAmmonia({
      ...nominal,
      feedFlowRateMolesPerSec: nominal.feedFlowRateMolesPerSec - hFlow,
    }).spaceTimeSecUnrounded;
    const fdFlow = (tauHi - tauLo) / (2 * hFlow);
    expect(sensFlow?.derivativeValue).toBeCloseTo(fdFlow, 4);

    // Feed flow alias
    expect(computeParameterSensitivity(id, "feedFlow", nominal)?.derivativeValue).toBe(
      sensFlow?.derivativeValue,
    );

    // Catalyst activity sensitivity
    const sensAct = computeParameterSensitivity(id, "catalystActivity", nominal);
    expect(sensAct).toBeDefined();
    expect(sensAct?.metricName).toBe("Catalytic Turnover Frequency");
    expect(sensAct?.derivativeSymbol).toBe("∂TOF / ∂a_cat");
    expect(sensAct?.derivativeUnit).toBe("s⁻¹ / unit_activity");
    expect(sensAct?.derivativeValue).toBe(
      Number(haberNominal.kRateSlopePerActivity.toPrecision(6)),
    );

    // Catalyst activity finite-difference check
    const hAct = 1e-4;
    const kActHi = stepHaberAmmonia({
      ...nominal,
      catalystActivity: nominal.catalystActivity + hAct,
    }).kRateUnrounded;
    const kActLo = stepHaberAmmonia({
      ...nominal,
      catalystActivity: nominal.catalystActivity - hAct,
    }).kRateUnrounded;
    const fdAct = (kActHi - kActLo) / (2 * hAct);
    expect(sensAct?.derivativeValue).toBeCloseTo(fdAct, 4);

    // Catalyst activity alias
    expect(computeParameterSensitivity(id, "activity", nominal)?.derivativeValue).toBe(
      sensAct?.derivativeValue,
    );

    // Bounds checking
    for (const invalid of [49, 301, Number.NaN]) {
      expect(computeParameterSensitivity(id, "pressureAtm", { pressureAtm: invalid })).toBeNull();
    }
    for (const invalid of [349, 651, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "temperatureCelsius", { temperatureCelsius: invalid }),
      ).toBeNull();
    }
    for (const invalid of [9, 151, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "feedFlowRateMolesPerSec", {
          feedFlowRateMolesPerSec: invalid,
        }),
      ).toBeNull();
    }
    for (const invalid of [0.4, 2.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "catalystActivity", { catalystActivity: invalid }),
      ).toBeNull();
    }
  });

  test("Carlson Electrophotography derives surface potential, discharge, layer thickness, and fuser sensitivities", () => {
    const id = "us-2297691-carlson-electrophotography";

    // Corona voltage sensitivity
    const sensCorona = computeParameterSensitivity(id, "coronaVoltageKv", {
      coronaVoltageKv: 6.5,
      exposureLuxSec: 12,
      layerThicknessUm: 30,
      fuserTemperatureC: 185,
    });
    expect(sensCorona).toBeDefined();
    expect(sensCorona?.metricName).toBe("Surface Potential Build");
    expect(sensCorona?.derivativeSymbol).toBe("∂V_s / ∂V_corona");
    expect(sensCorona?.derivativeUnit).toBe("V / kV");
    expect(sensCorona?.derivativeValue).toBe(100);

    // Central finite difference for corona voltage
    const hCorona = 1e-4;
    const fCoronaPlus = stepCarlsonElectrophotography({
      coronaVoltageKv: 6.5 + hCorona,
      exposureLuxSec: 12,
      layerThicknessUm: 30,
      fuserTemperatureC: 185,
    }).initialSurfacePotentialVUnrounded;
    const fCoronaMinus = stepCarlsonElectrophotography({
      coronaVoltageKv: 6.5 - hCorona,
      exposureLuxSec: 12,
      layerThicknessUm: 30,
      fuserTemperatureC: 185,
    }).initialSurfacePotentialVUnrounded;
    const numDerivCorona = (fCoronaPlus - fCoronaMinus) / (2 * hCorona);
    expect(sensCorona?.derivativeValue).toBeCloseTo(numDerivCorona, 4);

    // Optical exposure sensitivity
    const sensExp = computeParameterSensitivity(id, "exposureLuxSec", {
      coronaVoltageKv: 6.5,
      exposureLuxSec: 12,
      layerThicknessUm: 30,
      fuserTemperatureC: 185,
    });
    expect(sensExp).toBeDefined();
    expect(sensExp?.metricName).toBe("Photoconductive Discharge Sensitivity");
    expect(sensExp?.derivativeSymbol).toBe("∂V_latent / ∂H_exp");
    expect(sensExp?.derivativeUnit).toBe("V / (lx·s)");

    // Central finite difference for exposure
    const hExp = 1e-4;
    const fExpPlus = stepCarlsonElectrophotography({
      coronaVoltageKv: 6.5,
      exposureLuxSec: 12 + hExp,
      layerThicknessUm: 30,
      fuserTemperatureC: 185,
    }).exposedSurfacePotentialVUnrounded;
    const fExpMinus = stepCarlsonElectrophotography({
      coronaVoltageKv: 6.5,
      exposureLuxSec: 12 - hExp,
      layerThicknessUm: 30,
      fuserTemperatureC: 185,
    }).exposedSurfacePotentialVUnrounded;
    const numDerivExp = (fExpPlus - fExpMinus) / (2 * hExp);
    expect(sensExp?.derivativeValue).toBeCloseTo(numDerivExp, 4);

    // Photoreceptor thickness sensitivity
    const sensThick = computeParameterSensitivity(id, "layerThicknessUm", {
      coronaVoltageKv: 6.5,
      exposureLuxSec: 12,
      layerThicknessUm: 30,
      fuserTemperatureC: 185,
    });
    expect(sensThick).toBeDefined();
    expect(sensThick?.metricName).toBe("Acceptance Potential Gradient");
    expect(sensThick?.derivativeSymbol).toBe("∂E_int / ∂d_layer");
    expect(sensThick?.derivativeUnit).toBe("(kV/mm) / µm");
    expect(sensThick?.derivativeValue).toBeCloseTo(-650 / 900, 4);

    // Fuser temperature sensitivity
    const sensFuser = computeParameterSensitivity(id, "fuserTemperatureC", {
      coronaVoltageKv: 6.5,
      exposureLuxSec: 12,
      layerThicknessUm: 30,
      fuserTemperatureC: 185,
    });
    expect(sensFuser).toBeDefined();
    expect(sensFuser?.metricName).toBe("Resin Toner Fixation Quality");
    expect(sensFuser?.derivativeSymbol).toBe("∂Bond / ∂T_fuser");
    expect(sensFuser?.derivativeUnit).toBe("% / °C");
    expect(sensFuser?.derivativeValue).toBeCloseTo(40 / 70, 4);

    // Claim 1 gating
    const claim1Off = computeParameterSensitivity(id, "exposureLuxSec", {
      coronaVoltageKv: 6.5,
      exposureLuxSec: 12,
      layerThicknessUm: 30,
      fuserTemperatureC: 185,
      claim1Active: false,
    });
    expect(claim1Off?.derivativeValue).toBe(0);
    expect(claim1Off?.interpretation).toContain("Claim 1");

    // Parameter alias checks
    const nominalCorona = sensCorona?.derivativeValue;
    expect(
      computeParameterSensitivity(id, "coronaVoltage", {
        coronaVoltageKv: 6.5,
        exposureLuxSec: 12,
      })?.derivativeValue,
    ).toBe(nominalCorona);
    expect(
      computeParameterSensitivity(id, "coronaKv", {
        coronaVoltageKv: 6.5,
        exposureLuxSec: 12,
      })?.derivativeValue,
    ).toBe(nominalCorona);

    const nominalExp = sensExp?.derivativeValue;
    expect(
      computeParameterSensitivity(id, "exposure", {
        coronaVoltageKv: 6.5,
        exposureLuxSec: 12,
      })?.derivativeValue,
    ).toBe(nominalExp);
    expect(
      computeParameterSensitivity(id, "exposureSec", {
        coronaVoltageKv: 6.5,
        exposureLuxSec: 12,
      })?.derivativeValue,
    ).toBe(nominalExp);

    const nominalThick = sensThick?.derivativeValue;
    expect(
      computeParameterSensitivity(id, "layerThickness", {
        coronaVoltageKv: 6.5,
        layerThicknessUm: 30,
      })?.derivativeValue,
    ).toBe(nominalThick);
    expect(
      computeParameterSensitivity(id, "thickness", {
        coronaVoltageKv: 6.5,
        layerThicknessUm: 30,
      })?.derivativeValue,
    ).toBe(nominalThick);

    const nominalFuser = sensFuser?.derivativeValue;
    expect(
      computeParameterSensitivity(id, "fuserTemp", {
        coronaVoltageKv: 6.5,
        fuserTemperatureC: 185,
      })?.derivativeValue,
    ).toBe(nominalFuser);
    expect(
      computeParameterSensitivity(id, "temperature", {
        coronaVoltageKv: 6.5,
        fuserTemperatureC: 185,
      })?.derivativeValue,
    ).toBe(nominalFuser);

    // Bounds checking
    for (const invalid of [3.9, 8.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "coronaVoltageKv", { coronaVoltageKv: invalid }),
      ).toBeNull();
    }
    for (const invalid of [-1, 31, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "exposureLuxSec", { exposureLuxSec: invalid }),
      ).toBeNull();
    }
    for (const invalid of [9, 61, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "layerThicknessUm", { layerThicknessUm: invalid }),
      ).toBeNull();
    }
    for (const invalid of [119, 221, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "fuserTemperatureC", { fuserTemperatureC: invalid }),
      ).toBeNull();
    }
  });

  test("Kwolek Kevlar returns null for withheld material-performance model", () => {
    const id = "us-3671542-kwolek-kevlar";
    expect(computeParameterSensitivity(id, "spinSpeed", {})).toBeNull();
    expect(computeParameterSensitivity(id, "tenacity", {})).toBeNull();
    expect(computeParameterSensitivity(id, "drawRatio", {})).toBeNull();
  });

  test("E-Ink derives electrophoretic particle velocity and fluid viscous drag damping sensitivities", () => {
    const id = "us-6120588-eink";

    // Voltage sensitivity
    const sensV = computeParameterSensitivity(id, "electrodeVoltageVolts", {
      electrodeVoltageVolts: 15,
      fluidViscosityCp: 2.0,
    });
    expect(sensV).toBeDefined();
    expect(sensV?.metricName).toBe("Electrophoretic Particle Velocity");
    expect(sensV?.derivativeSymbol).toBe("∂v_particle / ∂V_electrode");
    expect(sensV?.derivativeUnit).toBe("mm·s⁻¹ / V");
    expect(sensV?.derivativeValue).toBe(0.045);

    // Viscosity sensitivity
    const sensVisc = computeParameterSensitivity(id, "fluidViscosityCp", {
      electrodeVoltageVolts: 15,
      fluidViscosityCp: 2.0,
    });
    expect(sensVisc).toBeDefined();
    expect(sensVisc?.metricName).toBe("Hydrodynamic Viscous Drag Damping");
    expect(sensVisc?.derivativeSymbol).toBe("∂v_drift / ∂η_fluid");
    expect(sensVisc?.derivativeUnit).toBe("(mm/s) / cP");
    expect(sensVisc?.derivativeValue).toBe(-0.018);

    // Bounds checking
    for (const invalid of [-16, 16, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "electrodeVoltageVolts", {
          electrodeVoltageVolts: invalid,
        }),
      ).toBeNull();
    }
    for (const invalid of [0.4, 5.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "fluidViscosityCp", { fluidViscosityCp: invalid }),
      ).toBeNull();
    }
  });

  test("Eastman Kodak derives photochemical exposure, hyperfocal aperture, and depth-of-field sensitivities", () => {
    const id = "us-388850-eastman-kodak";

    // Shutter speed sensitivity
    const sensShutter = computeParameterSensitivity(id, "shutterSpeed", {
      shutterSpeed: 0.05,
      apertureStop: 9,
      subjectDist: 3.0,
    });
    expect(sensShutter).toBeDefined();
    expect(sensShutter?.metricName).toBe("Emulsion Photochemical Exposure Energy");
    expect(sensShutter?.derivativeSymbol).toBe("∂H / ∂t_exp");
    expect(sensShutter?.derivativeUnit).toBe("mJ / s");
    expect(sensShutter?.derivativeValue).toBe(1.0);

    // Aperture stop sensitivity (dH/dN = -108.3 / N^2)
    const sensAperture = computeParameterSensitivity(id, "apertureStop", {
      shutterSpeed: 0.05,
      apertureStop: 9,
      subjectDist: 3.0,
    });
    expect(sensAperture).toBeDefined();
    expect(sensAperture?.metricName).toBe("Hyperfocal Distance Aperture Sensitivity");
    expect(sensAperture?.derivativeSymbol).toBe("∂H / ∂N");
    expect(sensAperture?.derivativeUnit).toBe("m / (f/#)");
    expect(sensAperture?.derivativeValue).toBeCloseTo(-108.3 / 81, 3);

    // Subject distance sensitivity (dD_near/dd = (H / (H+d))^2)
    const sensDist = computeParameterSensitivity(id, "subjectDist", {
      shutterSpeed: 0.05,
      apertureStop: 9,
      subjectDist: 3.0,
    });
    expect(sensDist).toBeDefined();
    expect(sensDist?.metricName).toBe("Near Depth-of-Field Boundary Subject Sensitivity");
    expect(sensDist?.derivativeSymbol).toBe("∂D_near / ∂d");
    expect(sensDist?.derivativeUnit).toBe("m / m");
    const h = 0.057 ** 2 / (9 * 0.00003) + 0.057;
    const expectedDistSens = (h / (h + 3.0)) ** 2;
    expect(sensDist?.derivativeValue).toBeCloseTo(expectedDistSens, 3);

    // Bounds checking
    for (const invalid of [0.004, 0.51, Number.NaN]) {
      expect(computeParameterSensitivity(id, "shutterSpeed", { shutterSpeed: invalid })).toBeNull();
    }
    for (const invalid of [3.9, 33, Number.NaN]) {
      expect(computeParameterSensitivity(id, "apertureStop", { apertureStop: invalid })).toBeNull();
    }
    for (const invalid of [0.1, 51, Number.NaN]) {
      expect(computeParameterSensitivity(id, "subjectDist", { subjectDist: invalid })).toBeNull();
    }
  });

  test("Townes Maser/Laser computes exact geometry and reflectivity derivatives and refuses ungrounded optical outputs", () => {
    const id = "us-2929922-townes-laser";

    // Cavity length sensitivity: ∂(L/D) / ∂L = 1/D
    const sensL = computeParameterSensitivity(id, "cavityLengthCm", {
      cavityLengthCm: 10,
      chamberDiameterCm: 1,
      endReflectivityPct: 97,
    });
    expect(sensL).toBeDefined();
    expect(sensL?.metricName).toBe("Chamber Aspect Ratio");
    expect(sensL?.derivativeSymbol).toBe("∂(L/D) / ∂L");
    expect(sensL?.derivativeUnit).toBe("ratio / cm");
    expect(sensL?.derivativeValue).toBe(1.0);

    // Chamber diameter sensitivity: ∂(L/D) / ∂D = -L / D^2
    const sensD = computeParameterSensitivity(id, "chamberDiameterCm", {
      cavityLengthCm: 10,
      chamberDiameterCm: 1,
      endReflectivityPct: 97,
    });
    expect(sensD).toBeDefined();
    expect(sensD?.metricName).toBe("Chamber Aspect Ratio");
    expect(sensD?.derivativeSymbol).toBe("∂(L/D) / ∂D");
    expect(sensD?.derivativeUnit).toBe("ratio / cm");
    expect(sensD?.derivativeValue).toBe(-10.0);

    // End reflectivity sensitivity: ∂(R^2) / ∂R = 2R / 100
    const sensR = computeParameterSensitivity(id, "endReflectivityPct", {
      cavityLengthCm: 10,
      chamberDiameterCm: 1,
      endReflectivityPct: 97,
    });
    expect(sensR).toBeDefined();
    expect(sensR?.metricName).toBe("Two-End Round-Trip Reflectivity");
    expect(sensR?.derivativeSymbol).toBe("∂(R²) / ∂R");
    expect(sensR?.derivativeUnit).toBe("% round-trip / % end reflectivity");
    expect(sensR?.derivativeValue).toBeCloseTo(1.94, 2);

    // Refused quantitative optical outputs
    expect(
      computeParameterSensitivity(id, "pumpExcitationPct", { pumpExcitationPct: 70 }),
    ).toBeNull();
    expect(
      computeParameterSensitivity(id, "modeApertureOpenPct", { modeApertureOpenPct: 50 }),
    ).toBeNull();
    expect(
      computeParameterSensitivity(id, "modulationFieldPct", { modulationFieldPct: 35 }),
    ).toBeNull();

    // Bounds checking
    for (const invalid of [2.9, 41, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "cavityLengthCm", { cavityLengthCm: invalid }),
      ).toBeNull();
    }
    for (const invalid of [0.1, 5.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "chamberDiameterCm", { chamberDiameterCm: invalid }),
      ).toBeNull();
    }
    for (const invalid of [49, 101, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "endReflectivityPct", { endReflectivityPct: invalid }),
      ).toBeNull();
    }
  });

  test("Maiman Ruby Laser derives coherent emission slope, R1 wavelength thermal shift, mode spacing, and mirror coupling loss sensitivities", () => {
    const id = "us-3353115-maiman-ruby-laser";

    // Pump energy / power sensitivity
    const sensPump = computeParameterSensitivity(id, "pumpEnergyJoules", {
      pumpEnergyJoules: 150,
      flashDurationMs: 1.0,
      rodLengthCm: 5.0,
      outputMirrorReflectivity: 0.92,
      crystalTemperatureKelvin: 300,
    });
    expect(sensPump).toBeDefined();
    expect(sensPump?.metricName).toBe("Laser Coherent Emission");
    expect(sensPump?.derivativeSymbol).toBe("∂P_out / ∂P_pump");
    expect(sensPump?.derivativeUnit).toBe("mW / W");
    expect(sensPump?.derivativeValue).toBe(15.0);

    // Crystal temperature wavelength shift sensitivity
    const sensTemp = computeParameterSensitivity(id, "crystalTemperatureKelvin", {
      pumpEnergyJoules: 150,
      crystalTemperatureKelvin: 300,
    });
    expect(sensTemp).toBeDefined();
    expect(sensTemp?.metricName).toBe("R1 Line Emission Wavelength Shift");
    expect(sensTemp?.derivativeSymbol).toBe("∂λ_emission / ∂T");
    expect(sensTemp?.derivativeUnit).toBe("nm / K");
    expect(sensTemp?.derivativeValue).toBe(0.005);

    // Rod length longitudinal mode spacing sensitivity
    const sensRod = computeParameterSensitivity(id, "rodLengthCm", {
      rodLengthCm: 5.0,
    });
    expect(sensRod).toBeDefined();
    expect(sensRod?.metricName).toBe("Resonator Longitudinal Mode Spacing Length Sensitivity");
    expect(sensRod?.derivativeSymbol).toBe("∂Δν_mode / ∂L");
    expect(sensRod?.derivativeUnit).toBe("GHz / cm");
    expect(sensRod?.derivativeValue).toBeCloseTo(-8.523 / 25, 3);

    // Output mirror reflectivity cavity loss sensitivity
    const sensMirror = computeParameterSensitivity(id, "outputMirrorReflectivity", {
      rodLengthCm: 5.0,
      outputMirrorReflectivity: 0.92,
    });
    expect(sensMirror).toBeDefined();
    expect(sensMirror?.metricName).toBe("Resonator Threshold Cavity Loss Coupling Sensitivity");
    expect(sensMirror?.derivativeSymbol).toBe("∂γ_loss / ∂R_2");
    expect(sensMirror?.derivativeUnit).toBe("cm⁻¹ / R");
    expect(sensMirror?.derivativeValue).toBeCloseTo(-1 / (2 * 5.0 * 0.92), 3);

    // Alias id test
    const sensAlias = computeParameterSensitivity("us-3353115-maiman-laser", "pumpPowerWatts", {
      pumpPowerWatts: 150,
    });
    expect(sensAlias?.derivativeValue).toBe(15.0);

    // Bounds checking
    for (const invalid of [19, 1001, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "pumpEnergyJoules", { pumpEnergyJoules: invalid }),
      ).toBeNull();
    }
    for (const invalid of [0.1, 10.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "flashDurationMs", { flashDurationMs: invalid }),
      ).toBeNull();
    }
    for (const invalid of [0.9, 25.1, Number.NaN]) {
      expect(computeParameterSensitivity(id, "rodLengthCm", { rodLengthCm: invalid })).toBeNull();
    }
    for (const invalid of [0.49, 1.0, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "outputMirrorReflectivity", {
          outputMirrorReflectivity: invalid,
        }),
      ).toBeNull();
    }
    for (const invalid of [49, 451, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "crystalTemperatureKelvin", {
          crystalTemperatureKelvin: invalid,
        }),
      ).toBeNull();
    }
  });

  test("Morse telegraph derives magnetizing force, signal current, attenuation, and WPM timing sensitivities", () => {
    const id = "us-1647-morse-telegraph";
    const h = 1e-4;

    // Current sensitivity compared against central difference of live unrounded magnetic force
    const currentParams = {
      currentMa: 65,
      wireTurns: 1500,
      lineVoltageV: 24,
      lineLengthMiles: 44,
      wpmSpeed: 20,
    };
    const sensCurrent = computeParameterSensitivity(id, "currentMa", currentParams);
    expect(sensCurrent).toBeDefined();
    expect(sensCurrent?.metricName).toBe("Relay Magnetomotive Force");
    expect(sensCurrent?.derivativeSymbol).toBe("∂F / ∂I_line");
    expect(sensCurrent?.derivativeUnit).toBe("N / mA");

    const fForwardI = stepMorseTelegraph({
      ...currentParams,
      currentMa: 65 + h,
    }).magneticForceNUnrounded;
    const fBackwardI = stepMorseTelegraph({
      ...currentParams,
      currentMa: 65 - h,
    }).magneticForceNUnrounded;
    const fdCurrent = (fForwardI - fBackwardI) / (2 * h);
    expect(sensCurrent?.derivativeValue).toBeCloseTo(fdCurrent, 4);

    // Alias equivalence
    const sensCurrentAlias = computeParameterSensitivity(id, "lineCurrentMa", currentParams);
    expect(sensCurrentAlias?.derivativeValue).toBe(sensCurrent?.derivativeValue);

    // Turns sensitivity compared against central difference
    const sensTurns = computeParameterSensitivity(id, "wireTurns", currentParams);
    expect(sensTurns).toBeDefined();
    expect(sensTurns?.metricName).toBe("Relay Magnetomotive Force");
    expect(sensTurns?.derivativeSymbol).toBe("∂F / ∂N");
    expect(sensTurns?.derivativeUnit).toBe("N / turn");

    const fForwardN = stepMorseTelegraph({
      ...currentParams,
      wireTurns: 1500 + h,
    }).magneticForceNUnrounded;
    const fBackwardN = stepMorseTelegraph({
      ...currentParams,
      wireTurns: 1500 - h,
    }).magneticForceNUnrounded;
    const fdTurns = (fForwardN - fBackwardN) / (2 * h);
    expect(sensTurns?.derivativeValue).toBeCloseTo(fdTurns, 5);

    // Voltage sensitivity compared against central difference of loop current
    const sensVolt = computeParameterSensitivity(id, "lineVoltageV", currentParams);
    expect(sensVolt).toBeDefined();
    expect(sensVolt?.metricName).toBe("Loop Signal Current");
    expect(sensVolt?.derivativeSymbol).toBe("∂I / ∂V");
    expect(sensVolt?.derivativeUnit).toBe("mA / V");

    const iForwardV = stepMorseTelegraph({
      ...currentParams,
      lineVoltageV: 24 + h,
    }).ohmicCurrentMaUnrounded;
    const iBackwardV = stepMorseTelegraph({
      ...currentParams,
      lineVoltageV: 24 - h,
    }).ohmicCurrentMaUnrounded;
    const fdVolt = (iForwardV - iBackwardV) / (2 * h);
    expect(sensVolt?.derivativeValue).toBeCloseTo(fdVolt, 4);

    // Distance attenuation sensitivity
    const sensMiles = computeParameterSensitivity(id, "lineLengthMiles", currentParams);
    expect(sensMiles).toBeDefined();
    expect(sensMiles?.metricName).toBe("Signal Current Distance Attenuation");
    expect(sensMiles?.derivativeSymbol).toBe("∂I / ∂x_line");
    expect(sensMiles?.derivativeUnit).toBe("mA / mi");

    const iForwardMiles = stepMorseTelegraph({
      ...currentParams,
      lineLengthMiles: 44 + h,
    }).ohmicCurrentMaUnrounded;
    const iBackwardMiles = stepMorseTelegraph({
      ...currentParams,
      lineLengthMiles: 44 - h,
    }).ohmicCurrentMaUnrounded;
    const fdMiles = (iForwardMiles - iBackwardMiles) / (2 * h);
    expect(sensMiles?.derivativeValue).toBeCloseTo(fdMiles, 4);

    // Resistance attenuation sensitivity
    const sensResistance = computeParameterSensitivity(id, "lineResistance", currentParams);
    expect(sensResistance).toBeDefined();
    expect(sensResistance?.metricName).toBe("Signal Current Attenuation");
    expect(sensResistance?.derivativeSymbol).toBe("∂I / ∂R");
    expect(sensResistance?.derivativeUnit).toBe("mA / Ω");
    expect(sensResistance?.derivativeValue).toBeLessThan(0);

    // WPM duration sensitivity compared against central difference
    const sensWpm = computeParameterSensitivity(id, "wpmSpeed", currentParams);
    expect(sensWpm).toBeDefined();
    expect(sensWpm?.metricName).toBe("Code Element Unit Duration");
    expect(sensWpm?.derivativeSymbol).toBe("∂τ_unit / ∂WPM");
    expect(sensWpm?.derivativeUnit).toBe("ms / WPM");

    const tauForward = stepMorseTelegraph({
      ...currentParams,
      wpmSpeed: 20 + h,
    }).unitDurationMsUnrounded;
    const tauBackward = stepMorseTelegraph({
      ...currentParams,
      wpmSpeed: 20 - h,
    }).unitDurationMsUnrounded;
    const fdWpm = (tauForward - tauBackward) / (2 * h);
    expect(sensWpm?.derivativeValue).toBeCloseTo(fdWpm, 4);

    // Bounds checking
    for (const invalid of [4, 301, Number.NaN]) {
      expect(computeParameterSensitivity(id, "currentMa", { currentMa: invalid })).toBeNull();
    }
    for (const invalid of [199, 5001, Number.NaN]) {
      expect(computeParameterSensitivity(id, "wireTurns", { wireTurns: invalid })).toBeNull();
    }
    for (const invalid of [2, 101, Number.NaN]) {
      expect(computeParameterSensitivity(id, "lineVoltageV", { lineVoltageV: invalid })).toBeNull();
    }
    for (const invalid of [4, 301, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "lineLengthMiles", { lineLengthMiles: invalid }),
      ).toBeNull();
    }
    for (const invalid of [1, 61, Number.NaN]) {
      expect(computeParameterSensitivity(id, "wpmSpeed", { wpmSpeed: invalid })).toBeNull();
    }
  });

  test("Bell telephone derives acoustic frequency, air gap, and voice amplitude sensitivities", () => {
    const id = "us-174465-bell-telephone";

    const sensFreq = computeParameterSensitivity(id, "acousticFrequencyHz", {
      acousticFrequencyHz: 440,
    });
    expect(sensFreq).toBeDefined();
    expect(sensFreq?.metricName).toBe("Acoustic Angular Frequency");
    expect(sensFreq?.derivativeSymbol).toBe("∂ω / ∂f_acoustic");
    expect(sensFreq?.derivativeValue).toBe(6.283185);
    expect(sensFreq?.derivativeUnit).toBe("rad·s⁻¹ / Hz");

    const sensSpl = computeParameterSensitivity(id, "voiceAmplitude", {
      voiceAmplitude: 75,
    });
    expect(sensSpl).toBeDefined();
    expect(sensSpl?.metricName).toBe("Modulated Signal Current");
    expect(sensSpl?.derivativeSymbol).toBe("∂I_mod / ∂SPL");
    expect(sensSpl?.derivativeUnit).toBe("mA / dB");

    // Bounds checking
    for (const invalid of [39, 96, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "voiceAmplitude", { voiceAmplitude: invalid }),
      ).toBeNull();
    }
    for (const invalid of [199, 801, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "acousticFrequencyHz", { acousticFrequencyHz: invalid }),
      ).toBeNull();
    }
    for (const invalid of [0.09, 0.81, Number.NaN]) {
      expect(computeParameterSensitivity(id, "airGap", { airGap: invalid })).toBeNull();
    }
    for (const invalid of [0.9, 12.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "batteryVoltage", { batteryVoltage: invalid }),
      ).toBeNull();
    }
    for (const invalid of [0.19, 3.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "liquidConductivity", { liquidConductivity: invalid }),
      ).toBeNull();
    }
  });

  test("Edison phonograph derives mandrel RPM linear speed and voice volume displacement sensitivities", () => {
    const id = "us-200521-edison-phonograph";
    const h = 1e-4;

    const sensRpm = computeParameterSensitivity(id, "mandrelRpm", {
      mandrelRpm: 60,
    });
    expect(sensRpm).toBeDefined();
    expect(sensRpm?.metricName).toBe("Illustrative Helical Advance");
    expect(sensRpm?.derivativeSymbol).toBe("∂v_axial / ∂RPM");
    expect(sensRpm?.derivativeUnit).toBe("(mm/s) / RPM");

    // Central difference check for helical advance
    const vForward = stepEdisonPhonograph({ mandrelRpm: 60 + h }).axialTravelMmPerSUnrounded ?? 0;
    const vBackward = stepEdisonPhonograph({ mandrelRpm: 60 - h }).axialTravelMmPerSUnrounded ?? 0;
    const fdRpm = (vForward - vBackward) / (2 * h);
    expect(sensRpm?.derivativeValue).toBeCloseTo(fdRpm, 4);

    // Alias equivalence
    for (const alias of ["rpm", "cylinderRpm", "mandrelSpeed", "speed", "clockworkRpm"]) {
      const sensAlias = computeParameterSensitivity(id, alias, { [alias]: 60 });
      expect(sensAlias?.derivativeValue).toBe(sensRpm?.derivativeValue);
    }

    const sensVol = computeParameterSensitivity(id, "voiceVolumeDb", {
      voiceVolumeDb: 75,
    });
    expect(sensVol).toBeDefined();
    expect(sensVol?.metricName).toBe("Stylus Indentation Amplitude (Illustrative)");
    expect(sensVol?.derivativeSymbol).toBe("∂A_stylus / ∂SPL");
    expect(sensVol?.derivativeUnit).toBe("mm / unit");

    // Central difference check for stylus indentation
    const aForward = stepEdisonPhonograph({ voiceVolumeDb: 75 + h }).stylusAmpUnrounded ?? 0;
    const aBackward = stepEdisonPhonograph({ voiceVolumeDb: 75 - h }).stylusAmpUnrounded ?? 0;
    const fdVol = (aForward - aBackward) / (2 * h);
    expect(sensVol?.derivativeValue).toBeCloseTo(fdVol, 6);

    // Alias equivalence
    for (const alias of ["voiceVolume", "volumeDb", "volume", "diaphragmExcitation", "spl"]) {
      const sensAlias = computeParameterSensitivity(id, alias, { [alias]: 75 });
      expect(sensAlias?.derivativeValue).toBe(sensVol?.derivativeValue);
    }

    // Claim 1 refusal: when recording foil is withheld, indentation amplitude sensitivity is 0
    const sensRefused = computeParameterSensitivity(id, "voiceVolumeDb", {
      voiceVolumeDb: 75,
      claim1FoilPresent: false,
    });
    expect(sensRefused?.derivativeValue).toBe(0);

    // Bounds checking
    for (const invalid of [19, 201, Number.NaN]) {
      expect(computeParameterSensitivity(id, "mandrelRpm", { mandrelRpm: invalid })).toBeNull();
    }
    for (const invalid of [19, 131, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "voiceVolumeDb", { voiceVolumeDb: invalid }),
      ).toBeNull();
    }
  });

  test("Bell photophone derives solar irradiance and voice SPL beam divergence sensitivities", () => {
    const id = "us-235199-bell-photophone";

    const sensIrr = computeParameterSensitivity(id, "solarIrradianceWPerM2", {
      solarIrradianceWPerM2: 950,
    });
    expect(sensIrr).toBeDefined();
    expect(sensIrr?.metricName).toBe("Selenium Photocell Responsivity");
    expect(sensIrr?.derivativeSymbol).toBe("∂I_photo / ∂Φ");
    expect(sensIrr?.derivativeValue).toBe(4.5);
    expect(sensIrr?.derivativeUnit).toBe("µA / W");

    const sensSpl = computeParameterSensitivity(id, "voiceSplDb", {
      voiceSplDb: 75,
    });
    expect(sensSpl).toBeDefined();
    expect(sensSpl?.metricName).toBe("Diaphragm Optical Beam Divergence Modulation");
    expect(sensSpl?.derivativeSymbol).toBe("∂θ_beam / ∂SPL");
    expect(sensSpl?.derivativeValue).toBe(0.08);
    expect(sensSpl?.derivativeUnit).toBe("mrad / dB");

    // Bounds checking
    for (const invalid of [4, 1001, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "transmissionDistanceM", {
          transmissionDistanceM: invalid,
        }),
      ).toBeNull();
    }
    for (const invalid of [29, 121, Number.NaN]) {
      expect(computeParameterSensitivity(id, "voiceSplDb", { voiceSplDb: invalid })).toBeNull();
    }
    for (const invalid of [49, 2001, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "solarIrradianceWPerM2", {
          solarIrradianceWPerM2: invalid,
        }),
      ).toBeNull();
    }
    for (const invalid of [0.09, 2.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "collectorDiameterM", { collectorDiameterM: invalid }),
      ).toBeNull();
    }
  });

  test("Marconi radio returns null due to fixed-step causal tape architecture", () => {
    const id = "us-586193-marconi-radio";
    expect(computeParameterSensitivity(id, "sparkGapMm", { sparkGapMm: 2.5 })).toBeNull();
    expect(
      computeParameterSensitivity(id, "aerialHeightMeters", { aerialHeightMeters: 30 }),
    ).toBeNull();
  });

  test("Tesla teleautomaton derives rudder turning rate and propeller thrust sensitivities", () => {
    const id = "us-613809-tesla-teleautomaton";
    const h = 1e-4;

    for (const rudder of [10, 15, 25]) {
      const sensRudder = computeParameterSensitivity(id, "rudderAngle", {
        rudderAngle: rudder,
        rfFrequency: 150,
      });
      expect(sensRudder).toBeDefined();
      expect(sensRudder?.metricName).toBe("Vessel Turning Curvature");
      expect(sensRudder?.derivativeSymbol).toBe("∂κ_turn / ∂θ_rudder");
      expect(sensRudder?.derivativeUnit).toBe("m⁻¹ / deg");

      // Central difference verification for curvature kappa(theta) = sin(theta * pi / 180) / 12.5
      const kappaFwd = Math.sin(((rudder + h) * Math.PI) / 180) / 12.5;
      const kappaBwd = Math.sin(((rudder - h) * Math.PI) / 180) / 12.5;
      const fdCurv = (kappaFwd - kappaBwd) / (2 * h);
      expect(sensRudder?.derivativeValue).toBeCloseTo(fdCurv, 4);

      // Alias invariance
      const sensAliasRudder = computeParameterSensitivity(id, "rudderDeg", {
        rudderDeg: rudder,
        rfFrequency: 150,
      });
      expect(sensAliasRudder?.derivativeValue).toBe(sensRudder?.derivativeValue);

      // Claim 1 refusal
      const sensRefused = computeParameterSensitivity(id, "rudderAngle", {
        rudderAngle: rudder,
        claim1Active: false,
      });
      expect(sensRefused?.derivativeValue).toBe(0);
    }

    // Propeller thrust under tuned resonance (150 kHz)
    for (const throttle of [25, 50, 75, 90]) {
      const sensTuned = computeParameterSensitivity(id, "propellerThrottlePct", {
        propellerThrottlePct: throttle,
        rfFrequency: 150,
      });
      expect(sensTuned).toBeDefined();
      expect(sensTuned?.metricName).toBe("Electric Propulsion Motor Thrust");
      expect(sensTuned?.derivativeSymbol).toBe("∂T_thrust / ∂throttle");
      expect(sensTuned?.derivativeValue).toBe(0.85);
      expect(sensTuned?.derivativeUnit).toBe("N / %");

      // Central difference verification
      const tFwd = stepTeslaTeleautomaton({
        rfFrequency: 150,
        propellerThrottlePct: throttle + h,
      }).motorThrustNUnrounded;
      const tBwd = stepTeslaTeleautomaton({
        rfFrequency: 150,
        propellerThrottlePct: throttle - h,
      }).motorThrustNUnrounded;
      const fdThrust = (tFwd - tBwd) / (2 * h);
      expect(sensTuned?.derivativeValue).toBeCloseTo(fdThrust, 4);

      // Alias invariance
      const sensAliasThrottle = computeParameterSensitivity(id, "throttle", {
        throttle,
        rfFrequency: 150,
      });
      expect(sensAliasThrottle?.derivativeValue).toBe(sensTuned?.derivativeValue);

      // Claim 1 refusal
      const sensThrottleRefused = computeParameterSensitivity(id, "propellerThrottlePct", {
        propellerThrottlePct: throttle,
        claim1Active: false,
      });
      expect(sensThrottleRefused?.derivativeValue).toBe(0);
    }

    // Detuned carrier: when frequency is detuned from 150 kHz, coherer is open and thrust derivative is 0
    const sensDetuned = computeParameterSensitivity(id, "propellerThrottlePct", {
      propellerThrottlePct: 75,
      rfFrequency: 120,
    });
    expect(sensDetuned).toBeDefined();
    expect(sensDetuned?.derivativeValue).toBe(0);

    // Bounds checking
    for (const invalid of [-1, 51, Number.NaN]) {
      expect(computeParameterSensitivity(id, "pulseCount", { pulseCount: invalid })).toBeNull();
    }
    for (const invalid of [49, 501, Number.NaN]) {
      expect(computeParameterSensitivity(id, "rfFrequency", { rfFrequency: invalid })).toBeNull();
    }
    for (const invalid of [-46, 46, Number.NaN]) {
      expect(computeParameterSensitivity(id, "rudderAngle", { rudderAngle: invalid })).toBeNull();
    }
    for (const invalid of [-1, 101, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "propellerThrottlePct", { propellerThrottlePct: invalid }),
      ).toBeNull();
    }
  });

  test("Tesla coil derives quarter-wave length and electrical length distributed-wave sensitivities", () => {
    const id = "us-593138-tesla-coil";
    const h = 1e-4;

    for (const f of [700, 925, 1250]) {
      for (const l of [35, 50, 65]) {
        const baseParams = { disturbanceFrequencyHz: f, secondaryLengthMiles: l };

        // 1. Quarter-wave length derivative with respect to frequency
        const sensFreq = computeParameterSensitivity(id, "disturbanceFrequencyHz", baseParams);
        expect(sensFreq).toBeDefined();
        expect(sensFreq?.metricName).toBe("Required Quarter-Wave Length");
        expect(sensFreq?.derivativeSymbol).toBe("∂l_{1/4} / ∂f");
        expect(sensFreq?.derivativeUnit).toBe("mi / Hz");
        expect(sensFreq?.derivativeValue).toBeCloseTo(-46250 / f ** 2, 6);

        // Central finite difference verification: l_1/4 = 185000 / (4 * f) = 46250 / f
        const lFwd = 46250 / (f + h);
        const lBwd = 46250 / (f - h);
        const fdFreq = (lFwd - lBwd) / (2 * h);
        expect(sensFreq?.derivativeValue).toBeCloseTo(fdFreq, 4);

        // 2. Electrical length derivative with respect to secondary wire length
        const sensLen = computeParameterSensitivity(id, "secondaryLengthMiles", baseParams);
        expect(sensLen).toBeDefined();
        expect(sensLen?.metricName).toBe("Electrical Length");
        expect(sensLen?.derivativeSymbol).toBe("∂(βl) / ∂l");
        expect(sensLen?.derivativeUnit).toBe("deg / mi");
        expect(sensLen?.derivativeValue).toBeCloseTo((360 * f) / 185000, 6);

        // Central finite difference verification: beta*l = (360 * f * l) / 185000
        const betaFwd = (360 * f * (l + h)) / 185000;
        const betaBwd = (360 * f * (l - h)) / 185000;
        const fdLen = (betaFwd - betaBwd) / (2 * h);
        expect(sensLen?.derivativeValue).toBeCloseTo(fdLen, 4);

        // 3. Alias invariance
        const sensAliasFreq = computeParameterSensitivity(id, "freq", {
          freq: f,
          secondaryLength: l,
        });
        expect(sensAliasFreq?.derivativeValue).toBe(sensFreq?.derivativeValue);

        const sensAliasLen = computeParameterSensitivity(id, "wireLengthMiles", {
          frequency: f,
          wireLengthMiles: l,
        });
        expect(sensAliasLen?.derivativeValue).toBe(sensLen?.derivativeValue);

        // 4. Claim 1 common-node gating
        const sensFreqRefused = computeParameterSensitivity(id, "disturbanceFrequencyHz", {
          ...baseParams,
          claim1CommonNodeConnected: 0,
        });
        expect(sensFreqRefused?.derivativeValue).toBe(0);

        const sensLenRefused = computeParameterSensitivity(id, "secondaryLengthMiles", {
          ...baseParams,
          claim1Active: false,
        });
        expect(sensLenRefused?.derivativeValue).toBe(0);
      }
    }

    // Bounds checking
    for (const invalid of [499, 1501, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "disturbanceFrequencyHz", {
          disturbanceFrequencyHz: invalid,
        }),
      ).toBeNull();
    }
    for (const invalid of [24, 76, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "secondaryLengthMiles", { secondaryLengthMiles: invalid }),
      ).toBeNull();
    }
  });

  test("Fessenden wireless derives frequency scaling, modulation power, and path loss attenuation sensitivities", () => {
    const id = "us-706737-fessenden-wireless";
    const h = 1e-4;

    const baseParams = {
      carrierFrequencyKhz: 75,
      audioModulationPct: 65,
      antennaTuningUh: 450,
      transmissionDistanceKm: 25,
    };

    // 1. Carrier Frequency: Radiation Resistance
    const sensFreq = computeParameterSensitivity(id, "carrierFrequencyKhz", baseParams);
    expect(sensFreq).toBeDefined();
    expect(sensFreq?.metricName).toBe("Antenna Radiation Resistance");
    expect(sensFreq?.derivativeSymbol).toBe("∂R_rad / ∂f_carrier");
    expect(sensFreq?.derivativeUnit).toBe("Ω / kHz");

    const rForward =
      stepFessendenWireless({ ...baseParams, carrierFrequencyKhz: 75 + h })
        .radiationResistanceOhmsUnrounded ?? 0;
    const rBackward =
      stepFessendenWireless({ ...baseParams, carrierFrequencyKhz: 75 - h })
        .radiationResistanceOhmsUnrounded ?? 0;
    const fdFreq = (rForward - rBackward) / (2 * h);
    expect(sensFreq?.derivativeValue).toBeCloseTo(fdFreq, 4);

    // Alias equivalence
    for (const alias of ["carrierFreqKhz", "carrierFreq", "frequencyKhz", "frequency"]) {
      const sensAlias = computeParameterSensitivity(id, alias, baseParams);
      expect(sensAlias?.derivativeValue).toBe(sensFreq?.derivativeValue);
    }

    // 2. Audio Modulation: Barretter Audio Signal Current
    const sensMod = computeParameterSensitivity(id, "audioModulationPct", baseParams);
    expect(sensMod).toBeDefined();
    expect(sensMod?.metricName).toBe("Barretter Audio Signal Current");
    expect(sensMod?.derivativeSymbol).toBe("∂I_audio / ∂m");
    expect(sensMod?.derivativeUnit).toBe("µA / %");

    const iForward =
      stepFessendenWireless({ ...baseParams, audioModulationPct: 65 + h })
        .audioSignalCurrentMicroampsUnrounded ?? 0;
    const iBackward =
      stepFessendenWireless({ ...baseParams, audioModulationPct: 65 - h })
        .audioSignalCurrentMicroampsUnrounded ?? 0;
    const fdMod = (iForward - iBackward) / (2 * h);
    expect(sensMod?.derivativeValue).toBeCloseTo(fdMod, 4);

    // Alias equivalence
    for (const alias of ["modDepthPct", "modulationPct", "modulation", "modDepth"]) {
      const sensAlias = computeParameterSensitivity(id, alias, baseParams);
      expect(sensAlias?.derivativeValue).toBe(sensMod?.derivativeValue);
    }

    // 3. Transmission Distance: Received RF Power Attenuation
    const sensDist = computeParameterSensitivity(id, "transmissionDistanceKm", baseParams);
    expect(sensDist).toBeDefined();
    expect(sensDist?.metricName).toBe("Barretter Received RF Power Attenuation");
    expect(sensDist?.derivativeSymbol).toBe("∂P_rx / ∂d");
    expect(sensDist?.derivativeUnit).toBe("µW / km");

    const pForward =
      stepFessendenWireless({ ...baseParams, transmissionDistanceKm: 25 + h })
        .receivedPowerMicrowattsUnrounded ?? 0;
    const pBackward =
      stepFessendenWireless({ ...baseParams, transmissionDistanceKm: 25 - h })
        .receivedPowerMicrowattsUnrounded ?? 0;
    const fdDist = (pForward - pBackward) / (2 * h);
    expect(sensDist?.derivativeValue).toBeCloseTo(fdDist, 4);

    // Alias equivalence
    for (const alias of ["distanceKm", "distance", "rangeKm"]) {
      const sensAlias = computeParameterSensitivity(id, alias, baseParams);
      expect(sensAlias?.derivativeValue).toBe(sensDist?.derivativeValue);
    }

    // 4. Antenna Inductance: Resonant Frequency Sensitivity
    const sensTune = computeParameterSensitivity(id, "antennaTuningUh", baseParams);
    expect(sensTune).toBeDefined();
    expect(sensTune?.metricName).toBe("Antenna Resonant Frequency Sensitivity");
    expect(sensTune?.derivativeSymbol).toBe("∂f_res / ∂L");
    expect(sensTune?.derivativeUnit).toBe("kHz / µH");

    const fForward =
      stepFessendenWireless({ ...baseParams, antennaTuningUh: 450 + h })
        .antennaResonantFreqKhzUnrounded ?? 0;
    const fBackward =
      stepFessendenWireless({ ...baseParams, antennaTuningUh: 450 - h })
        .antennaResonantFreqKhzUnrounded ?? 0;
    const fdTune = (fForward - fBackward) / (2 * h);
    expect(sensTune?.derivativeValue).toBeCloseTo(fdTune, 4);

    // Alias equivalence
    for (const alias of ["tuningUh", "inductanceUh", "antennaInductanceUh", "tuningCoilUh"]) {
      const sensAlias = computeParameterSensitivity(id, alias, baseParams);
      expect(sensAlias?.derivativeValue).toBe(sensTune?.derivativeValue);
    }

    // Claim 1 refusal: when distributed capacity is withheld, audio modulation & received power sensitivity are 0
    const sensModRefused = computeParameterSensitivity(id, "audioModulationPct", {
      ...baseParams,
      claim1DistributedCapacityPresent: false,
    });
    expect(sensModRefused?.derivativeValue).toBe(0);

    const sensDistRefused = computeParameterSensitivity(id, "transmissionDistanceKm", {
      ...baseParams,
      claim1DistributedCapacityPresent: false,
    });
    expect(sensDistRefused?.derivativeValue).toBe(0);

    // Bounds checking
    for (const invalid of [9, 201, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "carrierFrequencyKhz", { carrierFrequencyKhz: invalid }),
      ).toBeNull();
    }
    for (const invalid of [-1, 101, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "audioModulationPct", { audioModulationPct: invalid }),
      ).toBeNull();
    }
    for (const invalid of [49, 1501, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "antennaTuningUh", { antennaTuningUh: invalid }),
      ).toBeNull();
    }
    for (const invalid of [0.9, 201, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "transmissionDistanceKm", {
          transmissionDistanceKm: invalid,
        }),
      ).toBeNull();
    }
  });

  test("De Forest Audion derives transconductance, amplification factor, and stage gain sensitivities", () => {
    const id = "us-879532-de-forest-audion";
    const h = 1e-4;

    const baseParams = {
      gridVoltageV: -1.5,
      plateVoltageV: 45,
      filamentCurrentA: 1.0,
      gridSignalAmplitudeMv: 50,
      loadResistanceKOhms: 20,
    };

    // Transconductance gm compared against central difference of plate current
    const sensGm = computeParameterSensitivity(id, "gridVoltageV", baseParams);
    expect(sensGm).toBeDefined();
    expect(sensGm?.metricName).toBe("Triode Transconductance (gm)");
    expect(sensGm?.derivativeSymbol).toBe("∂I_p / ∂V_g");
    expect(sensGm?.derivativeUnit).toBe("µS");

    const ipForwardVg =
      stepDeForestAudion({ ...baseParams, gridBiasVoltageV: -1.5 + h }).plateCurrentMaUnrounded ??
      0;
    const ipBackwardVg =
      stepDeForestAudion({ ...baseParams, gridBiasVoltageV: -1.5 - h }).plateCurrentMaUnrounded ??
      0;
    const fdGm = ((ipForwardVg - ipBackwardVg) / (2 * h)) * 1000; // mA/V -> µS
    expect(sensGm?.derivativeValue).toBeCloseTo(fdGm, 1);

    // Alias equivalence
    const sensGmAlias = computeParameterSensitivity(id, "gridBiasVoltageV", baseParams);
    expect(sensGmAlias?.derivativeValue).toBe(sensGm?.derivativeValue);

    // Claim 1 refusal: when grid is absent, gm is 0
    const sensGmRefused = computeParameterSensitivity(id, "gridVoltageV", {
      ...baseParams,
      claim1GridPresent: false,
    });
    expect(sensGmRefused?.derivativeValue).toBe(0);

    // Cutoff: when grid is sufficiently negative, gm is 0
    const sensGmCutoff = computeParameterSensitivity(id, "gridVoltageV", {
      ...baseParams,
      gridVoltageV: -4.5,
    });
    expect(sensGmCutoff?.derivativeValue).toBe(0);

    // Plate voltage sensitivity compared against central difference
    const sensPlate = computeParameterSensitivity(id, "plateVoltageV", baseParams);
    expect(sensPlate).toBeDefined();
    expect(sensPlate?.metricName).toBe("Plate Dynamic Conductance");
    expect(sensPlate?.derivativeSymbol).toBe("∂I_p / ∂V_p");
    expect(sensPlate?.derivativeUnit).toBe("mA / V");

    const ipForwardVp =
      stepDeForestAudion({ ...baseParams, plateVoltageV: 45 + h }).plateCurrentMaUnrounded ?? 0;
    const ipBackwardVp =
      stepDeForestAudion({ ...baseParams, plateVoltageV: 45 - h }).plateCurrentMaUnrounded ?? 0;
    const fdPlate = (ipForwardVp - ipBackwardVp) / (2 * h);
    expect(sensPlate?.derivativeValue).toBeCloseTo(fdPlate, 3);

    // Load resistance sensitivity compared against central difference of voltage gain
    const sensGain = computeParameterSensitivity(id, "loadResistanceKOhms", baseParams);
    expect(sensGain).toBeDefined();
    expect(sensGain?.metricName).toBe("Stage Voltage Gain Sensitivity");
    expect(sensGain?.derivativeSymbol).toBe("∂A_v / ∂R_L");
    expect(sensGain?.derivativeUnit).toBe("(V/V) / kΩ");

    const gForwardRl =
      stepDeForestAudion({ ...baseParams, loadResistanceKOhms: 20 + h }).voltageGainUnrounded ?? 0;
    const gBackwardRl =
      stepDeForestAudion({ ...baseParams, loadResistanceKOhms: 20 - h }).voltageGainUnrounded ?? 0;
    const fdGain = (gForwardRl - gBackwardRl) / (2 * h);
    expect(sensGain?.derivativeValue).toBeCloseTo(fdGain, 4);

    // Filament current sensitivity compared against central difference of filament power
    const sensFil = computeParameterSensitivity(id, "filamentCurrentA", baseParams);
    expect(sensFil).toBeDefined();
    expect(sensFil?.metricName).toBe("Filament Heating Power Rate");
    expect(sensFil?.derivativeSymbol).toBe("∂P_fil / ∂I_fil");
    expect(sensFil?.derivativeUnit).toBe("W / A");

    const pForwardFil =
      stepDeForestAudion({ ...baseParams, filamentCurrentA: 1.0 + h }).filamentPowerWUnrounded ?? 0;
    const pBackwardFil =
      stepDeForestAudion({ ...baseParams, filamentCurrentA: 1.0 - h }).filamentPowerWUnrounded ?? 0;
    const fdFil = (pForwardFil - pBackwardFil) / (2 * h);
    expect(sensFil?.derivativeValue).toBeCloseTo(fdFil, 4);

    // Bounds checking
    for (const invalid of [4, 201, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "plateVoltageV", { plateVoltageV: invalid }),
      ).toBeNull();
    }
    for (const invalid of [-10.1, 5.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "gridBiasVoltageV", { gridBiasVoltageV: invalid }),
      ).toBeNull();
    }
    for (const invalid of [0.19, 2.51, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "filamentCurrentA", { filamentCurrentA: invalid }),
      ).toBeNull();
    }
    for (const invalid of [0.9, 501, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "gridSignalAmplitudeMv", {
          gridSignalAmplitudeMv: invalid,
        }),
      ).toBeNull();
    }
    for (const invalid of [0.9, 101, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "loadResistanceKOhms", { loadResistanceKOhms: invalid }),
      ).toBeNull();
    }
  });

  test("Farnsworth image dissector TV derives video current, deflection field, and beam velocity sensitivities", () => {
    const id = "us-1773980-farnsworth-tv";
    const h = 1e-4;

    const baseParams = {
      anodeVoltage: 1500,
      coilCurrent: 0.42,
      lightIntensityLux: 500,
      horizontalFreqKhz: 15.75,
      verticalFreqHz: 60,
      scanLines: 60,
    };

    // Video current sensitivity compared against central difference
    const sensLux = computeParameterSensitivity(id, "lightIntensityLux", baseParams);
    expect(sensLux).toBeDefined();
    expect(sensLux?.metricName).toBe("Photo-Dissector Video Current");
    expect(sensLux?.derivativeSymbol).toBe("∂I_video / ∂L_scene");
    expect(sensLux?.derivativeUnit).toBe("µA / Lux");

    const iForwardLux = FrankenSimEngine.stepFarnsworthTv(
      1.5,
      120,
      500 + h,
    ).photocathodeCurrentUaUnrounded;
    const iBackwardLux = FrankenSimEngine.stepFarnsworthTv(
      1.5,
      120,
      500 - h,
    ).photocathodeCurrentUaUnrounded;
    const fdLux = (iForwardLux - iBackwardLux) / (2 * h);
    expect(sensLux?.derivativeValue).toBeCloseTo(fdLux, 4);

    // Deflection coil field sensitivity compared against central difference
    const sensCoil = computeParameterSensitivity(id, "coilCurrent", baseParams);
    expect(sensCoil).toBeDefined();
    expect(sensCoil?.metricName).toBe("Magnetic Deflection Field Sensitivity");
    expect(sensCoil?.derivativeSymbol).toBe("∂B / ∂I_coil");
    expect(sensCoil?.derivativeUnit).toBe("G / A");

    const bForwardCoil = FrankenSimEngine.farnsworthDeflectionGauss(0.42 + h);
    const bBackwardCoil = FrankenSimEngine.farnsworthDeflectionGauss(0.42 - h);
    const fdCoil = (bForwardCoil - bBackwardCoil) / (2 * h);
    expect(sensCoil?.derivativeValue).toBeCloseTo(fdCoil, 3);

    // Anode potential sensitivity compared against central difference of electron velocity
    const sensAnode = computeParameterSensitivity(id, "anodeVoltage", baseParams);
    expect(sensAnode).toBeDefined();
    expect(sensAnode?.metricName).toBe("Electron Beam Velocity Acceleration Sensitivity");
    expect(sensAnode?.derivativeSymbol).toBe("∂v / ∂V_anode");
    expect(sensAnode?.derivativeUnit).toBe("km·s⁻¹ / V");

    const vForwardAnode =
      FrankenSimEngine.stepFarnsworthTv((1500 + h) / 1000, 120).electronVelocityMpsUnrounded / 1000;
    const vBackwardAnode =
      FrankenSimEngine.stepFarnsworthTv((1500 - h) / 1000, 120).electronVelocityMpsUnrounded / 1000;
    const fdAnode = (vForwardAnode - vBackwardAnode) / (2 * h);
    expect(sensAnode?.derivativeValue).toBeCloseTo(fdAnode, 3);

    // Non-linear voltage dependence: higher anode voltage has lower marginal velocity gain
    const sensAnodeHigh = computeParameterSensitivity(id, "anodeVoltage", {
      ...baseParams,
      anodeVoltage: 3000,
    });
    expect(sensAnodeHigh?.derivativeValue).toBeLessThan(sensAnode?.derivativeValue ?? 0);

    // Claim 1 refusal: when raster traversal is withheld, derivatives are refused with 0
    const sensLuxRefused = computeParameterSensitivity(id, "lightIntensityLux", {
      ...baseParams,
      claim1ScanPathPresent: false,
    });
    expect(sensLuxRefused?.derivativeValue).toBe(0);
    expect(sensLuxRefused?.derivativeUnit).toBe("refused");

    // Bounds checking
    for (const invalid of [499, 6001, Number.NaN]) {
      expect(computeParameterSensitivity(id, "anodeVoltage", { anodeVoltage: invalid })).toBeNull();
    }
    for (const invalid of [0.09, 1.01, Number.NaN]) {
      expect(computeParameterSensitivity(id, "coilCurrent", { coilCurrent: invalid })).toBeNull();
    }
    for (const invalid of [-1, 2001, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "lightIntensityLux", { lightIntensityLux: invalid }),
      ).toBeNull();
    }
    for (const invalid of [4.9, 30.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "horizontalFreqKhz", { horizontalFreqKhz: invalid }),
      ).toBeNull();
    }
    for (const invalid of [29, 121, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "verticalFreqHz", { verticalFreqHz: invalid }),
      ).toBeNull();
    }
    for (const invalid of [0, 241, Number.NaN]) {
      expect(computeParameterSensitivity(id, "scanLines", { scanLines: invalid })).toBeNull();
    }
  });

  test("Lamarr frequency hopping derives jamming processing gain and filter discrimination sensitivities", () => {
    const id = "us-2292387-lamarr-frequency-hopping";

    // Record position discrete stepper advance sensitivity
    const sensPos = computeParameterSensitivity(id, "recordPosition", {
      recordPosition: 3,
    });
    expect(sensPos).toBeDefined();
    expect(sensPos?.metricName).toBe("Record Index Advance");
    expect(sensPos?.derivativeSymbol).toBe("∂Row / ∂Step");
    expect(sensPos?.derivativeValue).toBe(1.0);
    expect(sensPos?.derivativeUnit).toBe("row / step");

    // Spread-spectrum processing gain sensitivity
    const sensGain = computeParameterSensitivity(id, "activeChannels", {
      activeChannels: 88,
    });
    expect(sensGain).toBeDefined();
    expect(sensGain?.metricName).toBe("Jamming Processing Gain");
    expect(sensGain?.derivativeSymbol).toBe("∂G_p / ∂N");
    expect(sensGain?.derivativeUnit).toBe("dB / channel");

    // Central finite difference verification for processing gain
    const hCh = 1e-4;
    const fPlus = stepLamarrRecordControl({ activeChannels: 88 + hCh }).processingGainDbUnrounded;
    const fMinus = stepLamarrRecordControl({ activeChannels: 88 - hCh }).processingGainDbUnrounded;
    const numDeriv = (fPlus - fMinus) / (2 * hCh);
    expect(sensGain?.derivativeValue).toBeCloseTo(numDeriv, 4);

    // Command tone filter discrimination
    const sensTone = computeParameterSensitivity(id, "commandTone", {
      commandTone: 100,
    });
    expect(sensTone).toBeDefined();
    expect(sensTone?.metricName).toBe("Demodulated Filter Discrimination");
    expect(sensTone?.derivativeSymbol).toBe("∂Q / ∂f_tone");
    expect(sensTone?.derivativeValue).toBeCloseTo(0.02, 4);
    expect(sensTone?.derivativeUnit).toBe("1 / Hz");

    // Claim 1 gating
    const claim1Off = computeParameterSensitivity(id, "activeChannels", {
      activeChannels: 88,
      claim1Active: false,
    });
    expect(claim1Off?.derivativeValue).toBe(0);
    expect(claim1Off?.interpretation).toContain("Claim 1");

    const claim1OffPos = computeParameterSensitivity(id, "recordPosition", {
      recordPosition: 3,
      claim1Active: false,
    });
    expect(claim1OffPos?.derivativeValue).toBe(0);
    expect(claim1OffPos?.interpretation).toContain("Claim 1");

    // Parameter alias checks
    const nominalPos = sensPos?.derivativeValue;
    expect(
      computeParameterSensitivity(id, "position", { recordPosition: 3 })?.derivativeValue,
    ).toBe(nominalPos);
    expect(computeParameterSensitivity(id, "pos", { recordPosition: 3 })?.derivativeValue).toBe(
      nominalPos,
    );
    expect(
      computeParameterSensitivity(id, "recordIndex", { recordPosition: 3 })?.derivativeValue,
    ).toBe(nominalPos);

    const nominalGain = sensGain?.derivativeValue;
    expect(
      computeParameterSensitivity(id, "channels", { activeChannels: 88 })?.derivativeValue,
    ).toBe(nominalGain);
    expect(
      computeParameterSensitivity(id, "numChannels", { activeChannels: 88 })?.derivativeValue,
    ).toBe(nominalGain);
    expect(
      computeParameterSensitivity(id, "channelCount", { activeChannels: 88 })?.derivativeValue,
    ).toBe(nominalGain);

    const nominalTone = sensTone?.derivativeValue;
    expect(computeParameterSensitivity(id, "tone", { commandTone: 100 })?.derivativeValue).toBe(
      nominalTone,
    );
    expect(
      computeParameterSensitivity(id, "toneCycles", { commandTone: 100 })?.derivativeValue,
    ).toBe(nominalTone);

    // Bounds checking
    for (const invalid of [-1, 7, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "recordPosition", { recordPosition: invalid }),
      ).toBeNull();
    }
    for (const invalid of [0, 89, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "activeChannels", { activeChannels: invalid }),
      ).toBeNull();
    }
    for (const invalid of [49, 1001, Number.NaN]) {
      expect(computeParameterSensitivity(id, "commandTone", { commandTone: invalid })).toBeNull();
    }
  });

  test("Metcalfe Ethernet CSMA/CD derives propagation delay, bit period, and channel efficiency sensitivities", () => {
    const id = "us-4063220-metcalfe-ethernet";

    const sensDelay = computeParameterSensitivity(id, "cableLengthMeters", {
      cableLengthMeters: 500,
    });
    expect(sensDelay).toBeDefined();
    expect(sensDelay?.metricName).toBe("One-Way Propagation Delay");
    expect(sensDelay?.derivativeSymbol).toBe("∂τ_prop / ∂L");
    expect(sensDelay?.derivativeValue).toBe(5.0);
    expect(sensDelay?.derivativeUnit).toBe("ns / m");

    const sensBit = computeParameterSensitivity(id, "dataRateMbps", {
      dataRateMbps: 2.94,
    });
    expect(sensBit).toBeDefined();
    expect(sensBit?.metricName).toBe("Manchester Bit Period");
    expect(sensBit?.derivativeSymbol).toBe("∂T_bit / ∂R");
    expect(sensBit?.derivativeValue).toBe(-34.0);
    expect(sensBit?.derivativeUnit).toBe("ns / Mbps");

    const sensEff = computeParameterSensitivity(id, "offeredLoad", {
      offeredLoad: 0.5,
    });
    expect(sensEff).toBeDefined();
    expect(sensEff?.metricName).toBe("Channel Utilization Efficiency");
    expect(sensEff?.derivativeSymbol).toBe("∂η / ∂G");
    expect(sensEff?.derivativeValue).toBe(-28.5);
    expect(sensEff?.derivativeUnit).toBe("% / norm_load");

    // Bounds checking
    for (const invalid of [9, 1001, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "cableLengthMeters", { cableLengthMeters: invalid }),
      ).toBeNull();
    }
    for (const invalid of [0.9, 10.1, Number.NaN]) {
      expect(computeParameterSensitivity(id, "dataRateMbps", { dataRateMbps: invalid })).toBeNull();
    }
    for (const invalid of [1, 33, Number.NaN]) {
      expect(computeParameterSensitivity(id, "stationCount", { stationCount: invalid })).toBeNull();
    }
    for (const invalid of [0.04, 2.51, Number.NaN]) {
      expect(computeParameterSensitivity(id, "offeredLoad", { offeredLoad: invalid })).toBeNull();
    }
    for (const invalid of [63, 1519, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "packetSizeBytes", { packetSizeBytes: invalid }),
      ).toBeNull();
    }
  });
});
