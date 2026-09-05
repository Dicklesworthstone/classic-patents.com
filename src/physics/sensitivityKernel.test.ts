import { describe, expect, test } from "bun:test";
import { allPatents } from "@/data/patents";
import { stepBardeenPointContact } from "./bardeenPointContactKernel";
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
  stepNobelDynamite,
  stepOttoEngine,
  stepParsonsTurbine,
  stepRillieuxEvaporator,
  stepTeslaTeleautomaton,
  stepThomsonWelding,
  stepWozniakApple,
  stepZeppelinAirship,
} from "./catalogKernels";
import { stepDieselEngine } from "./dieselEngineKernel";
import { FrankenSimEngine } from "./engine";
import { stepHoweSewingMachine } from "./machineKernels";
import {
  INITIAL_SIKORSKY_STATE,
  readSikorskyControls,
  stepSikorskyHelicopterSi,
} from "./sikorskyHelicopterKernel";
import { stepSundbackZipperSi } from "./sundbackZipperKernel";

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

  test("Goodyear rubber derives Arrhenius cure rate, entropic elasticity, and Claim 1 gating", () => {
    const id = "us-3633-goodyear-rubber";
    // Vulcanization temperature sensitivity (Arrhenius rate)
    const sensCure = computeParameterSensitivity(id, "vulcanTemp", {
      vulcanTemp: 145,
      sulfurPct: 8,
      specimenTempC: 35,
      appliedTensileStretch: 1.8,
    });
    expect(sensCure).toBeDefined();
    expect(sensCure?.metricName).toBe("Thermal Vulcanization Reaction Rate");
    expect(sensCure?.derivativeSymbol).toBe("∂k_cure / ∂T_cure");
    expect(sensCure?.derivativeUnit).toBe("ratio / °C");
    expect(sensCure?.derivativeValue).toBeGreaterThan(0);

    // Analytical match against finite difference
    const eps = 1e-4;
    const rateHi = stepGoodyearRubber(145 + eps, 8, 30, 1.8, 35).rateRelUnrounded;
    const rateLo = stepGoodyearRubber(145 - eps, 8, 30, 1.8, 35).rateRelUnrounded;
    expect(sensCure?.derivativeValue).toBeCloseTo((rateHi - rateLo) / (2 * eps), 3);

    // Specimen temperature sensitivity (Entropic restoring stress: ∂P/∂T = P / T_K)
    const sensSpecimen = computeParameterSensitivity(id, "specimenTempC", {
      vulcanTemp: 145,
      sulfurPct: 8,
      specimenTempC: 35,
      appliedTensileStretch: 1.8,
    });
    expect(sensSpecimen).toBeDefined();
    expect(sensSpecimen?.metricName).toBe("Entropic Restoring Stress");
    expect(sensSpecimen?.derivativeSymbol).toBe("∂P_nom / ∂T_specimen");
    expect(sensSpecimen?.derivativeUnit).toBe("MPa / °C");
    expect(sensSpecimen?.derivativeValue).toBeGreaterThan(0);

    const rubberAt35 = stepGoodyearRubber(145, 8, 30, 1.8, 35);
    expect(sensSpecimen?.derivativeValue).toBeCloseTo(
      rubberAt35.stressMpaUnrounded / (35 + 273.15),
      4,
    );

    // Aliases
    expect(
      computeParameterSensitivity(id, "cureTemp", {
        cureTemp: 145,
        sulfurPct: 8,
        specimenTempC: 35,
        stretch: 1.8,
      }),
    ).toEqual(sensCure);
    expect(
      computeParameterSensitivity(id, "specimenTemp", {
        vulcanTemp: 145,
        sulfurPct: 8,
        specimenTemp: 35,
        appliedTensileStretch: 1.8,
      }),
    ).toEqual(sensSpecimen);

    // Claim 1 gating
    const gatedCure = computeParameterSensitivity(id, "vulcanTemp", {
      vulcanTemp: 145,
      claim1Active: 0,
    });
    expect(gatedCure?.derivativeValue).toBe(0);
    expect(gatedCure?.interpretation).toContain("Claim 1");

    const gatedSpecimen = computeParameterSensitivity(id, "specimenTempC", {
      specimenTempC: 35,
      claim1Active: 0,
    });
    expect(gatedSpecimen?.derivativeValue).toBe(0);

    const gatedStretch = computeParameterSensitivity(id, "appliedTensileStretch", {
      appliedTensileStretch: 1.8,
      claim1Active: false,
    });
    expect(gatedStretch?.derivativeValue).toBe(0);

    const gatedSulfur = computeParameterSensitivity(id, "sulfurPct", {
      sulfurPct: 8,
      claim1Active: false,
    });
    expect(gatedSulfur?.derivativeValue).toBe(0);

    // Discrete Claim 1 toggle
    const claimToggle = computeParameterSensitivity(id, "claim1Active", {});
    expect(claimToggle?.derivativeValue).toBe(1);
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
  test("Wright Flyer computes finite-difference sensitivity for all 3-axis controls and Claim 18 interlock", () => {
    const id = "us-821393-wright-flyer";

    // 1. Wing Warp (Adverse Yaw)
    const warpSensUncoupled = computeParameterSensitivity(id, "wingWarp", {
      wingWarp: 5.0,
      rudder: 0,
      coupled: 0,
      airspeed: 30.0,
    });
    expect(warpSensUncoupled).toBeDefined();
    expect(warpSensUncoupled?.metricName).toBe("Adverse Yaw Moment");
    expect(warpSensUncoupled?.derivativeSymbol).toBe("∂N / ∂δ_warp");
    expect(warpSensUncoupled?.derivativeUnit).toBe("N·m / deg");
    expect(warpSensUncoupled?.derivativeValue).toBeCloseTo(-1.7, 1);

    const warpSensCoupled = computeParameterSensitivity(id, "wingWarp", {
      wingWarp: 5.0,
      coupled: 1,
      airspeed: 30.0,
    });
    // With Claim 18 interlock engaged, adverse yaw is mechanically cancelled by slaved rudder:
    expect(Math.abs(warpSensCoupled?.derivativeValue ?? 99)).toBeLessThan(0.1);

    // Warp aliases
    for (const alias of ["warp", "wingWarpDeg"]) {
      expect(
        computeParameterSensitivity(id, alias, { [alias]: 5.0, coupled: 0, airspeed: 30 })
          ?.derivativeValue,
      ).toBeCloseTo(-1.7, 1);
    }

    // 2. Airspeed (Dynamic Pressure Lift Growth)
    const speedSens = computeParameterSensitivity(id, "airspeed", {
      airspeed: 30.0,
    });
    expect(speedSens).toBeDefined();
    expect(speedSens?.metricName).toBe("Aerodynamic Lift");
    expect(speedSens?.derivativeSymbol).toBe("∂L / ∂V");
    expect(speedSens?.derivativeUnit).toBe("N / mph");
    expect(speedSens?.derivativeValue).toBeGreaterThan(0);

    for (const alias of ["speed", "airspeedMph", "airspeedKts"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 30.0 })?.derivativeValue).toBe(
        speedSens?.derivativeValue,
      );
    }

    // 3. Rudder (Aerodynamic Yaw Restoring Moment)
    const rudderSensUncoupled = computeParameterSensitivity(id, "rudder", {
      rudder: 5.0,
      coupled: 0,
      airspeed: 30.0,
    });
    expect(rudderSensUncoupled).toBeDefined();
    expect(rudderSensUncoupled?.metricName).toBe("Rudder Aerodynamic Yaw Moment");
    expect(rudderSensUncoupled?.derivativeSymbol).toBe("∂N / ∂δ_rudder");
    expect(rudderSensUncoupled?.derivativeUnit).toBe("N·m / deg");
    expect(rudderSensUncoupled?.derivativeValue).toBeCloseTo(3.8, 1);

    const rudderSensCoupled = computeParameterSensitivity(id, "rudder", {
      rudder: 5.0,
      coupled: 1,
    });
    // With Claim 18 interlock engaged, manual rudder is slaved and has no independent sensitivity:
    expect(rudderSensCoupled).toBeNull();

    for (const alias of ["rudderDeg", "rudderAngle"]) {
      expect(
        computeParameterSensitivity(id, alias, { [alias]: 5.0, coupled: 0, airspeed: 30 })
          ?.derivativeValue,
      ).toBeCloseTo(3.8, 1);
    }

    // 4. Elevator / Canard (Pitching Moment)
    const elevSens = computeParameterSensitivity(id, "elevator", {
      elevator: 4.0,
      airspeed: 30.0,
    });
    expect(elevSens).toBeDefined();
    expect(elevSens?.metricName).toBe("Canard Pitch Moment");
    expect(elevSens?.derivativeSymbol).toBe("∂M / ∂δ_canard");
    expect(elevSens?.derivativeUnit).toBe("N·m / deg");
    expect(elevSens?.derivativeValue).toBeCloseTo(-2.2, 1);

    for (const alias of ["canard", "canardDeg", "elevatorDeg", "pitchAngle"]) {
      expect(
        computeParameterSensitivity(id, alias, { [alias]: 4.0, airspeed: 30 })?.derivativeValue,
      ).toBeCloseTo(-2.2, 1);
    }

    // 5. Coupled Mode Toggle
    const coupledSens = computeParameterSensitivity(id, "coupled", { coupled: 1 });
    expect(coupledSens).toBeDefined();
    expect(coupledSens?.metricName).toBe("Claim 18 Rudder Coordination Interlock");
    expect(coupledSens?.derivativeSymbol).toBe("ΔState / ΔCoupled");
    expect(coupledSens?.derivativeValue).toBe(0);
    expect(coupledSens?.derivativeUnit).toBe("state");

    for (const alias of ["coupling", "claim18Coupled", "rudderInterlock"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 1 })?.derivativeValue).toBe(0);
    }

    // Bounds checking
    for (const invalid of [9, 61, Number.NaN]) {
      expect(computeParameterSensitivity(id, "airspeed", { airspeed: invalid })).toBeNull();
    }
    for (const invalid of [-21, 21, Number.NaN]) {
      expect(computeParameterSensitivity(id, "wingWarp", { wingWarp: invalid })).toBeNull();
    }
    for (const invalid of [-31, 31, Number.NaN]) {
      expect(computeParameterSensitivity(id, "rudder", { rudder: invalid })).toBeNull();
    }
    for (const invalid of [-26, 26, Number.NaN]) {
      expect(computeParameterSensitivity(id, "elevator", { elevator: invalid })).toBeNull();
    }
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

  test("Bardeen derives exact point-contact spacing conversion and gates on Claim 1", () => {
    const id = "us-2524035-bardeen-transistor";
    const h = 1e-4;

    for (const spacing of [1.5, 2.0, 5.0, 9.0]) {
      const sens = computeParameterSensitivity(id, "pointSpacingMils", {
        pointSpacingMils: spacing,
        operatingSample: 1,
      });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Point Contact Spacing");
      expect(sens?.derivativeSymbol).toBe("∂d / ∂s");
      expect(sens?.derivativeUnit).toBe("µm / mil");
      expect(sens?.derivativeValue).toBe(25.4);

      // Finite difference verification
      const forward = stepBardeenPointContact({
        pointSpacingMils: spacing + h,
        operatingSample: 1,
      });
      const backward = stepBardeenPointContact({
        pointSpacingMils: spacing - h,
        operatingSample: 1,
      });
      const numSlope =
        (forward.pointSpacingMicrometersUnrounded - backward.pointSpacingMicrometersUnrounded) /
        (2 * h);
      expect(sens?.derivativeValue).toBeCloseTo(numSlope, 4);
    }

    // Aliases
    for (const alias of [
      "pointSpacing",
      "spacing",
      "spacingMils",
      "contactSpacing",
      "pointSpacingMicrons",
    ]) {
      const sens = computeParameterSensitivity(id, alias, { [alias]: 3.5 });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBe(25.4);
    }

    // Claim 1 gating
    const gated = computeParameterSensitivity(id, "pointSpacingMils", { claim1Active: false });
    expect(gated).toBeDefined();
    expect(gated?.derivativeValue).toBe(0);
    expect(gated?.interpretation).toContain("Claim 1 withheld");

    // Table I operating sample sensitivity
    const sensSample1 = computeParameterSensitivity(id, "operatingSample", {
      operatingSample: 1,
      pointSpacingMils: 2,
    });
    expect(sensSample1).toBeDefined();
    expect(sensSample1?.metricName).toBe("Reported Table I Voltage Gain");
    expect(sensSample1?.derivativeSymbol).toBe("ΔA_v / ΔSample");
    expect(sensSample1?.derivativeUnit).toBe("× / sample");
    expect(sensSample1?.derivativeValue).toBe(-12);

    const sensSample2 = computeParameterSensitivity(id, "operatingSample", {
      operatingSample: 2,
      pointSpacingMils: 2,
    });
    expect(sensSample2?.derivativeValue).toBe(-14);

    for (const alias of ["sample", "sampleNumber", "tableSample", "sampleIndex"]) {
      expect(
        computeParameterSensitivity(id, alias, { [alias]: 1, pointSpacingMils: 2 })
          ?.derivativeValue,
      ).toBe(-12);
    }

    const sensSampleGated = computeParameterSensitivity(id, "operatingSample", {
      operatingSample: 1,
      claim1Active: false,
    });
    expect(sensSampleGated?.derivativeValue).toBe(0);
    expect(sensSampleGated?.interpretation).toContain("Claim 1 withheld");

    // Claim 1 collector contact path state
    const sensClaim1On = computeParameterSensitivity(id, "claim1Active", {
      claim1Active: 1,
      pointSpacingMils: 2,
    });
    expect(sensClaim1On).toBeDefined();
    expect(sensClaim1On?.metricName).toBe("Claim 1 Point-Contact Collector Path");
    expect(sensClaim1On?.derivativeSymbol).toBe("ΔState / ΔContact");
    expect(sensClaim1On?.derivativeUnit).toBe("state");
    expect(sensClaim1On?.derivativeValue).toBe(0);
    expect(sensClaim1On?.interpretation).toContain("Claim 1 compliant");

    const sensClaim1Off = computeParameterSensitivity(id, "claim1Active", {
      claim1Active: 0,
      pointSpacingMils: 2,
    });
    expect(sensClaim1Off?.interpretation).toContain("Claim 1 collector path severed");

    for (const alias of ["claim1", "collectorActive", "collectorPresent", "claim1Collector"]) {
      expect(
        computeParameterSensitivity(id, alias, { [alias]: 1, pointSpacingMils: 2 })
          ?.derivativeValue,
      ).toBe(0);
    }

    // Unadmitted controls remain refused
    for (const refusedControl of ["emitterCurrent", "collectorVoltage", "carrierLifetime"]) {
      expect(computeParameterSensitivity(id, refusedControl, {})).toBeNull();
    }

    // Out of bounds
    for (const invalid of [0.5, 10.5, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "pointSpacingMils", { pointSpacingMils: invalid }),
      ).toBeNull();
    }
    for (const invalid of [0, 4, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "operatingSample", { operatingSample: invalid }),
      ).toBeNull();
    }
    for (const invalid of [-0.1, 1.1, Number.NaN]) {
      expect(computeParameterSensitivity(id, "claim1Active", { claim1Active: invalid })).toBeNull();
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

  test("Kilby exposes identity sensitivities for source-display geometry and Claim 1 conductive means", () => {
    const id = "us-3138743-kilby-integrated-circuit";

    // 1. Section reveal sensitivity & aliases
    const sensReveal = computeParameterSensitivity(id, "sectionRevealFraction", {
      sectionRevealFraction: 0.4,
    });
    expect(sensReveal).toBeDefined();
    expect(sensReveal?.metricName).toBe("Displayed Semiconductor Section Reveal");
    expect(sensReveal?.derivativeSymbol).toBe("∂s_{display} / ∂s_{reader}");
    expect(sensReveal?.derivativeValue).toBe(1);
    expect(sensReveal?.derivativeUnit).toBe("fraction / fraction");

    for (const alias of ["sectionReveal", "revealFraction", "reveal", "section"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 0.5 })?.derivativeValue).toBe(1);
    }

    // 2. Wire arch sensitivity & aliases
    const sensArch = computeParameterSensitivity(id, "wireArchFraction", { wireArchFraction: 0.6 });
    expect(sensArch).toBeDefined();
    expect(sensArch?.metricName).toBe("Displayed Wire 70 Arch");
    expect(sensArch?.derivativeSymbol).toBe("∂h_{display} / ∂h_{reader}");
    expect(sensArch?.derivativeValue).toBe(1);
    expect(sensArch?.derivativeUnit).toBe("fraction / fraction");

    for (const alias of ["wireArch", "archFraction", "wireHeight", "wire70Arch", "arch"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 0.7 })?.derivativeValue).toBe(1);
    }

    // 3. Claim 1 conductive means completion & aliases
    const sensClaim1 = computeParameterSensitivity(id, "claim1ConductiveMeansPresent", {
      claim1ConductiveMeansPresent: 1,
    });
    expect(sensClaim1).toBeDefined();
    expect(sensClaim1?.metricName).toBe("Claim 1 Conductive Means Completion");
    expect(sensClaim1?.derivativeSymbol).toBe("∂C_1 / ∂m_{conductive}");
    expect(sensClaim1?.derivativeValue).toBe(1);
    expect(sensClaim1?.derivativeUnit).toBe("complete / binary switch");

    for (const alias of [
      "conductiveMeans",
      "conductiveMeansPresent",
      "claim1",
      "claim1ConductiveMeans",
      "interconnections",
    ]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 1 })?.derivativeValue).toBe(1);
    }

    // 4. Refused unsupported electrical parameters
    expect(computeParameterSensitivity(id, "reverseBiasVoltageV", {})).toBeNull();
    expect(computeParameterSensitivity(id, "frequencyHz", {})).toBeNull();

    // 5. Parameter bounds
    for (const invalid of [-0.1, 1.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "sectionRevealFraction", {
          sectionRevealFraction: invalid,
        }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "claim1ConductiveMeansPresent", {
          claim1ConductiveMeansPresent: invalid,
        }),
      ).toBeNull();
    }
    for (const invalidArch of [0.1, 1.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "wireArchFraction", { wireArchFraction: invalidArch }),
      ).toBeNull();
    }
  });

  test("Otis Hoisting Apparatus derives display rate, drive command, rope failure, and claim-interlock sensitivities", () => {
    const id = "us-31128-otis-elevator";

    // 1. Display rate sensitivity
    const sensRate = computeParameterSensitivity(id, "displayRatePct", { displayRatePct: 60 });
    expect(sensRate).toBeDefined();
    expect(sensRate?.metricName).toBe("Declared Coordinate-Speed Magnitude");
    expect(sensRate?.derivativeSymbol).toBe("∂|dq_D/dt| / ∂r_display");
    expect(sensRate?.derivativeValue).toBe(0.0012);
    expect(sensRate?.derivativeUnit).toBe("normalized coordinate·s⁻¹ / %");

    for (const alias of ["displayRate", "ratePct"]) {
      const sensAlias = computeParameterSensitivity(id, alias, { [alias]: 60 });
      expect(sensAlias?.derivativeValue).toBe(0.0012);
    }

    // 2. Drive command direction sensitivity
    const sensDriveRaise = computeParameterSensitivity(id, "driveCommand", { driveCommand: 1 });
    expect(sensDriveRaise).toBeDefined();
    expect(sensDriveRaise?.metricName).toBe("Platform Travel Direction");
    expect(sensDriveRaise?.derivativeSymbol).toBe("ΔDirection / ΔCommand");
    expect(sensDriveRaise?.derivativeValue).toBe(1);

    const sensDriveLower = computeParameterSensitivity(id, "driveCommand", { driveCommand: -1 });
    expect(sensDriveLower?.derivativeValue).toBe(-1);

    const sensDriveIdle = computeParameterSensitivity(id, "driveCommand", { driveCommand: 0 });
    expect(sensDriveIdle?.derivativeValue).toBe(0);

    for (const alias of ["command", "direction"]) {
      const sensAlias = computeParameterSensitivity(id, alias, { [alias]: 1 });
      expect(sensAlias?.derivativeValue).toBe(1);
    }

    // 3. Rope integrity and safety pawl arrest
    const sensRopeFail = computeParameterSensitivity(id, "ropeGIntegrityPct", {
      ropeGIntegrityPct: 0,
      claim1HookLockEnabled: true,
    });
    expect(sensRopeFail).toBeDefined();
    expect(sensRopeFail?.metricName).toBe("Pawl Arrest Engagement Margin");
    expect(sensRopeFail?.derivativeSymbol).toBe("ΔArrest / ΔRopeIntegrity");
    expect(sensRopeFail?.derivativeValue).toBe(1.0);

    const sensRopeFailUnclaimed = computeParameterSensitivity(id, "ropeGIntegrityPct", {
      ropeGIntegrityPct: 0,
      claim1HookLockEnabled: false,
    });
    expect(sensRopeFailUnclaimed?.derivativeValue).toBe(0.0);

    for (const alias of ["ropeIntegrity", "ropeGIntegrity", "ropeIntegrityPct"]) {
      const sensAlias = computeParameterSensitivity(id, alias, { [alias]: 0 });
      expect(sensAlias?.derivativeValue).toBe(1.0);
    }

    // 4. Stop rope pulled and service brake engagement
    const sensStopRope = computeParameterSensitivity(id, "stopRopePulled", {
      stopRopePulled: 1,
      claim3BrakeInterlockEnabled: true,
    });
    expect(sensStopRope).toBeDefined();
    expect(sensStopRope?.metricName).toBe("Service Brake Engagement");
    expect(sensStopRope?.derivativeSymbol).toBe("ΔBrake / ΔStopRope");
    expect(sensStopRope?.derivativeValue).toBe(1.0);

    for (const alias of ["stopRope", "shipperStop"]) {
      const sensAlias = computeParameterSensitivity(id, alias, { [alias]: 1 });
      expect(sensAlias?.derivativeValue).toBe(1.0);
    }

    // 5. Claim discrete sensitivities
    const sensClaim1 = computeParameterSensitivity(id, "claim1HookLockEnabled", {
      ropeGIntegrityPct: 0,
    });
    expect(sensClaim1?.derivativeValue).toBe(1.0);

    const sensClaim4 = computeParameterSensitivity(id, "claim4CounterpoiseEnabled", {});
    expect(sensClaim4?.derivativeValue).toBe(-1.0);

    // Invalid parameters refused
    expect(computeParameterSensitivity(id, "cabPayload", {})).toBeNull();
    expect(computeParameterSensitivity(id, "counterweightMassKg", {})).toBeNull();
  });

  test("Salisbury differentiates the printed Figure 3 tendon-to-torque map", () => {
    const id = "us-4921293-salisbury-robot-hand";
    const sensT1 = computeParameterSensitivity(id, "tensionT1N", { radiusScaleMm: 10 });
    expect(sensT1).toMatchObject({
      metricName: "Figure 3 First-Joint Torque",
      derivativeSymbol: "∂τ₁ / ∂T₁",
      derivativeValue: -0.012,
      derivativeUnit: "N·m / N",
    });
    expect(sensT1?.interpretation).toContain("printed first-joint equation");

    const sensT2 = computeParameterSensitivity(id, "tensionT2N", { radiusScaleMm: 10 });
    expect(sensT2).toMatchObject({
      metricName: "Figure 3 Third-Joint Torque",
      derivativeSymbol: "∂τ₃ / ∂T₂",
      derivativeValue: 0.01,
      derivativeUnit: "N·m / N",
    });

    const sensT3 = computeParameterSensitivity(id, "tensionT3N", { radiusScaleMm: 10 });
    expect(sensT3).toMatchObject({
      metricName: "Figure 3 Third-Joint Torque",
      derivativeSymbol: "∂τ₃ / ∂T₃",
      derivativeValue: -0.01,
      derivativeUnit: "N·m / N",
    });

    const sensT4 = computeParameterSensitivity(id, "tensionT4N", { radiusScaleMm: 10 });
    expect(sensT4).toMatchObject({
      metricName: "Figure 3 First-Joint Torque",
      derivativeSymbol: "∂τ₁ / ∂T₄",
      derivativeValue: -0.012,
      derivativeUnit: "N·m / N",
    });

    const sensR = computeParameterSensitivity(id, "radiusScaleMm", {
      tensionT1N: 18,
      tensionT2N: 22,
      tensionT3N: 10,
      tensionT4N: 14,
    });
    expect(sensR).toMatchObject({
      metricName: "Figure 3 First-Joint Torque Scale",
      derivativeSymbol: "∂τ₁ / ∂R_scale",
      derivativeValue: -0.0064,
      derivativeUnit: "N·m / mm",
    });

    const sensIdler = computeParameterSensitivity(id, "firstIdlerFixed", {});
    expect(sensIdler).toMatchObject({
      metricName: "Claim 2 Idler Probe State",
      derivativeSymbol: "ΔProbe / ΔIdler",
      derivativeValue: 1.0,
      derivativeUnit: "state / state",
    });

    // Aliases
    expect(computeParameterSensitivity(id, "t1", { radiusScaleMm: 10 })?.derivativeValue).toBe(
      -0.012,
    );
    expect(computeParameterSensitivity(id, "t2", { radiusScaleMm: 10 })?.derivativeValue).toBe(
      0.01,
    );
    expect(computeParameterSensitivity(id, "t3", { radiusScaleMm: 10 })?.derivativeValue).toBe(
      -0.01,
    );
    expect(computeParameterSensitivity(id, "t4", { radiusScaleMm: 10 })?.derivativeValue).toBe(
      -0.012,
    );
    expect(computeParameterSensitivity(id, "radiusScale", {})?.derivativeValue).toBe(-0.0064);
    expect(computeParameterSensitivity(id, "idlerFixed", {})?.derivativeValue).toBe(1.0);

    // Bounds checking
    expect(computeParameterSensitivity(id, "tensionT1N", { tensionT1N: -1 })).toBeNull();
    expect(computeParameterSensitivity(id, "tensionT1N", { tensionT1N: 45 })).toBeNull();
    expect(computeParameterSensitivity(id, "radiusScaleMm", { radiusScaleMm: 2 })).toBeNull();
    expect(computeParameterSensitivity(id, "radiusScaleMm", { radiusScaleMm: 25 })).toBeNull();
    expect(computeParameterSensitivity(id, "graspForceN", {})).toBeNull();
  });

  test("all patents in registry with controls return non-null sensitivities", () => {
    const refused = new Set<string>();

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

  test("Marconi radio computes mast scale, spark gap, and coil potential sensitivities", () => {
    const mast = computeParameterSensitivity("us-586193-marconi-radio", "aerialHeight", {
      aerialHeight: 88,
    });
    expect(mast?.metricName).toBe("Mast Studio Scale");
    expect(mast?.derivativeValue).toBeCloseTo(1 / 88, 5);
    expect(mast?.derivativeUnit).toBe("scale / m");

    const gap = computeParameterSensitivity("us-586193-marconi-radio", "sparkGapMm", {
      sparkGapMm: 10,
    });
    expect(gap?.metricName).toBe("Spark Gap Studio Half-Span");
    expect(gap?.derivativeValue).toBeCloseTo(0.18 / 23, 5);

    const coil = computeParameterSensitivity("us-586193-marconi-radio", "sparkVoltage", {
      sparkVoltage: 28,
    });
    expect(coil?.metricName).toBe("Induction Coil Display Potential");
    expect(coil?.derivativeValue).toBe(1.0);

    // Unregistered/invented param returns null
    expect(computeParameterSensitivity("us-586193-marconi-radio", "antennaHeightM", {})).toBeNull();
  });

  test("Boyle–Smith CCD computes pulse overlap ratio, phase velocity, and well depth sensitivities", () => {
    const ratio = computeParameterSensitivity(
      "us-3858232-boyle-smith-ccd",
      "pulseWidthToStepRatio",
      { pulseWidthToStepRatio: 0.5 },
    );
    expect(ratio?.metricName).toBe("Pulse Overlap Ratio");
    expect(ratio?.derivativeValue).toBe(1.0);

    const hz = computeParameterSensitivity("us-3858232-boyle-smith-ccd", "clockStepRateHz", {
      clockStepRateHz: 1.2,
    });
    expect(hz?.metricName).toBe("Phase Coordinate Velocity");
    expect(hz?.derivativeValue).toBe(1.0);

    const depth = computeParameterSensitivity(
      "us-3858232-boyle-smith-ccd",
      "pulseDepthNormalized",
      { pulseDepthNormalized: 0.78 },
    );
    expect(depth?.metricName).toBe("Peak Potential-Well Depth");
    expect(depth?.derivativeValue).toBe(0.88);
  });

  test("Kamen transporter computes discrete claim topology state sensitivities", () => {
    const topo = computeParameterSensitivity("us-5701965-kamen-transporter", "topologyState", {
      topologyState: 1,
    });
    expect(topo?.metricName).toBe("Claim Topology State Index");
    expect(topo?.derivativeValue).toBe(1.0);
    expect(topo?.derivativeUnit).toBe("state / state");

    const balance = computeParameterSensitivity(
      "us-5701965-kamen-transporter",
      "claim1BalanceEnabled",
      { claim1BalanceEnabled: 1 },
    );
    expect(balance?.metricName).toBe("Claim 1 Balance Loop State");
    expect(balance?.derivativeValue).toBe(1.0);
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
    const id = "us-4976582-clavel-delta-robot";
    for (const params of [
      { armOneInput: 0, armTwoInput: 0, armThreeInput: 0 },
      { armOneInput: 0.2, armTwoInput: -0.15, armThreeInput: 0.1 },
    ]) {
      for (const key of ["armOneInput", "armTwoInput", "armThreeInput"] as const) {
        const result = computeParameterSensitivity(id, key, params);
        const expected = central(
          (value) => stepClavelDeltaRobotTopology({ ...params, [key]: value }).platformCenter[1],
          params[key],
          0.0001,
        );
        expect(result?.derivativeValue).toBeCloseTo(expected, 5);
        expect(result?.derivativeUnit).toBe("normalized / input fraction");
      }
    }

    // Working-member axis 10 rotation
    const toolSens = computeParameterSensitivity(id, "toolAxisInput", {});
    expect(toolSens).toMatchObject({
      metricName: "Working-Member Axis Rotation (Claim 8)",
      derivativeSymbol: "∂θ_tool / ∂u_tool",
      derivativeValue: Number(Math.PI.toFixed(6)),
      derivativeUnit: "rad / normalized input",
    });

    // Claims
    const claim1Sens = computeParameterSensitivity(id, "claim1TopologyEnabled", {});
    expect(claim1Sens).toMatchObject({
      metricName: "Claim 1 Spatial Parallel Architecture State",
      derivativeSymbol: "ΔTopology / ΔClaim1",
      derivativeValue: 1.0,
      derivativeUnit: "state / state",
    });

    const claim2Sens = computeParameterSensitivity(id, "claim2PairedBarsEnabled", {});
    expect(claim2Sens).toMatchObject({
      metricName: "Claim 2 Paired Parallel Bars Attitude State",
      derivativeSymbol: "ΔPairedBars / ΔClaim2",
      derivativeValue: 1.0,
      derivativeUnit: "state / state",
    });

    const claim8Sens = computeParameterSensitivity(id, "claim8BaseMotorEnabled", {});
    expect(claim8Sens).toMatchObject({
      metricName: "Claim 8 Base Motor Transmission State",
      derivativeSymbol: "ΔBaseMotor / ΔClaim8",
      derivativeValue: 1.0,
      derivativeUnit: "state / state",
    });

    // Aliases
    expect(computeParameterSensitivity(id, "arm1", {})).toBeDefined();
    expect(computeParameterSensitivity(id, "arm2", {})).toBeDefined();
    expect(computeParameterSensitivity(id, "arm3", {})).toBeDefined();
    expect(computeParameterSensitivity(id, "toolAxis", {})?.derivativeValue).toBe(
      Number(Math.PI.toFixed(6)),
    );
    expect(computeParameterSensitivity(id, "claim1", {})?.derivativeValue).toBe(1.0);
    expect(computeParameterSensitivity(id, "claim2", {})?.derivativeValue).toBe(1.0);
    expect(computeParameterSensitivity(id, "claim8", {})?.derivativeValue).toBe(1.0);

    // Refusals and bounds
    expect(
      computeParameterSensitivity(id, "armOneInput", {
        claim1TopologyEnabled: 0,
      }),
    ).toBeNull();
    expect(
      computeParameterSensitivity(id, "armOneInput", {
        armOneInput: 1,
      }),
    ).toBeNull();
    expect(computeParameterSensitivity(id, "armOneInput", { armOneInput: -1.5 })).toBeNull();
    expect(computeParameterSensitivity(id, "toolAxisInput", { toolAxisInput: 2.0 })).toBeNull();
    expect(
      computeParameterSensitivity(id, "claim1TopologyEnabled", { claim1TopologyEnabled: 3 }),
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

    // Steering input derivative
    const steerSens = computeParameterSensitivity("us-6302230-kamen-segway", "steeringInput", {});
    expect(steerSens).toMatchObject({
      metricName: "Differential Steering Motor Torque",
      derivativeSymbol: "∂Δτ_steer / ∂u_steer",
      derivativeValue: 36.0,
      derivativeUnit: "N·m / yaw",
    });
    const steerWithheld = computeParameterSensitivity("us-6302230-kamen-segway", "steeringInput", {
      claim1BalanceEnabled: 0,
    });
    expect(steerWithheld?.derivativeValue).toBe(0.0);

    // Aliases
    expect(computeParameterSensitivity("us-6302230-kamen-segway", "pitch", {})).toBeDefined();
    expect(computeParameterSensitivity("us-6302230-kamen-segway", "lean", {})).toBeDefined();
    expect(
      computeParameterSensitivity("us-6302230-kamen-segway", "steering", {})?.derivativeValue,
    ).toBe(36.0);
    expect(computeParameterSensitivity("us-6302230-kamen-segway", "yaw", {})?.derivativeValue).toBe(
      36.0,
    );
    expect(computeParameterSensitivity("us-6302230-kamen-segway", "friction", {})).toBeDefined();
    expect(computeParameterSensitivity("us-6302230-kamen-segway", "speedLimit", {})).toBeDefined();

    // Bounds checking
    expect(
      computeParameterSensitivity("us-6302230-kamen-segway", "riderPitchDeg", {
        riderPitchDeg: 20,
      }),
    ).toBeNull();
    expect(
      computeParameterSensitivity("us-6302230-kamen-segway", "riderPitchDeg", {
        riderPitchDeg: -20,
      }),
    ).toBeNull();
    expect(
      computeParameterSensitivity("us-6302230-kamen-segway", "steeringInput", {
        steeringInput: 1.5,
      }),
    ).toBeNull();
    expect(
      computeParameterSensitivity("us-6302230-kamen-segway", "groundFrictionCoeff", {
        groundFrictionCoeff: 0.1,
      }),
    ).toBeNull();
    expect(
      computeParameterSensitivity("us-6302230-kamen-segway", "speedLimitMS", { speedLimitMS: 1.0 }),
    ).toBeNull();
    expect(
      computeParameterSensitivity("us-6302230-kamen-segway", "riderPitchDeg", {
        claim1BalanceEnabled: 0,
      }),
    ).toBeNull();
  });

  test("Roomba derives straight advance rate, in-place turn rate, and optical redirect interlock", () => {
    const id = "us-6594844-roomba";
    const sensSpeed = computeParameterSensitivity(id, "wheelSpeedMps", { wheelSpeedMps: 0.3 });
    expect(sensSpeed).toMatchObject({
      metricName: "Contextual Chassis Advance Rate",
      derivativeSymbol: "∂v_chassis / ∂v_command",
      derivativeValue: 1,
      derivativeUnit: "(m/s) / (m/s)",
    });

    const sensTurn = computeParameterSensitivity(id, "turnRateRadSec", { turnRateRadSec: 1.5 });
    expect(sensTurn).toMatchObject({
      metricName: "Contextual In-Place Turn Rate",
      derivativeSymbol: "∂ω / ∂Rate",
      derivativeValue: 1.0,
      derivativeUnit: "rad·s⁻¹ / unit",
    });

    const sensOpt = computeParameterSensitivity(id, "opticalSensorEnabled", {
      opticalSensorEnabled: 1,
    });
    expect(sensOpt).toMatchObject({
      metricName: "Optical Redirect Interlock (Claim 1)",
      derivativeSymbol: "ΔInterlock / Δoptical",
      derivativeValue: 1.0,
      derivativeUnit: "state / state",
    });

    // Aliases
    expect(computeParameterSensitivity(id, "speed", {})?.derivativeValue).toBe(1);
    expect(computeParameterSensitivity(id, "driveSpeed", {})?.derivativeValue).toBe(1);
    expect(computeParameterSensitivity(id, "turnRate", {})?.derivativeValue).toBe(1.0);
    expect(computeParameterSensitivity(id, "deflectionRate", {})?.derivativeValue).toBe(1.0);
    expect(computeParameterSensitivity(id, "opticalSensor", {})?.derivativeValue).toBe(1.0);
    expect(computeParameterSensitivity(id, "optical", {})?.derivativeValue).toBe(1.0);
    expect(computeParameterSensitivity(id, "claim1Optical", {})?.derivativeValue).toBe(1.0);

    // Bounds checking
    expect(computeParameterSensitivity(id, "wheelSpeedMps", { wheelSpeedMps: 0.05 })).toBeNull();
    expect(computeParameterSensitivity(id, "wheelSpeedMps", { wheelSpeedMps: 1.5 })).toBeNull();
    expect(computeParameterSensitivity(id, "turnRateRadSec", { turnRateRadSec: 0.2 })).toBeNull();
    expect(computeParameterSensitivity(id, "turnRateRadSec", { turnRateRadSec: 4.0 })).toBeNull();
    expect(
      computeParameterSensitivity(id, "opticalSensorEnabled", { opticalSensorEnabled: 2 }),
    ).toBeNull();
  });

  test("Zeppelin airship derives buoyant lift, pitch trim, drag, and lapse from admitted model", () => {
    const id = "us-621195-zeppelin-airship";
    const h = 1e-4;

    // 1. Gas inflation sensitivity (Gross aerostatic buoyant lift)
    for (const alt of [0, 300, 1000, 2000]) {
      for (const inflation of [75, 85, 95, 100]) {
        const params = { flightAlt: alt, gasInflation: inflation };
        const sens = computeParameterSensitivity(id, "gasInflation", params);
        expect(sens).toBeDefined();
        expect(sens?.metricName).toBe("Gross Aerostatic Buoyant Lift");
        expect(sens?.derivativeSymbol).toBe("∂L_buoy / ∂%_inflation");
        expect(sens?.derivativeUnit).toBe("N / %");
        const zep = stepZeppelinAirship(params);
        expect(sens?.derivativeValue).toBeCloseTo(zep.buoyantSlopeNPerPct, 2);

        // Finite difference check against unrounded buoyancy
        const fwd = stepZeppelinAirship({ ...params, gasInflation: inflation + h });
        const bwd = stepZeppelinAirship({ ...params, gasInflation: inflation - h });
        const numSlope =
          ((fwd.grossBuoyancyKnUnrounded - bwd.grossBuoyancyKnUnrounded) * 1000) / (2 * h);
        expect(sens?.derivativeValue).toBeCloseTo(numSlope, 2);
      }
    }

    // Inflation aliases
    for (const alias of ["gasInflationPct", "inflation", "inflationPct"]) {
      const sens = computeParameterSensitivity(id, alias, { [alias]: 90 });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBeGreaterThan(0);
    }

    // 2. Trim weight sensitivity
    const trimSens = computeParameterSensitivity(id, "trimWeight", { trimWeight: 5 });
    expect(trimSens).toBeDefined();
    expect(trimSens?.metricName).toBe("Longitudinal Pitch Trim");
    expect(trimSens?.derivativeSymbol).toBe("∂θ_pitch / ∂x_trim");
    expect(trimSens?.derivativeUnit).toBe("deg / m");
    expect(trimSens?.derivativeValue).toBeCloseTo((300 * 9.81) / 15000, 4);

    // Trim aliases
    for (const alias of ["trimWeightPosM", "trim", "ballast"]) {
      const sens = computeParameterSensitivity(id, alias, { [alias]: 2 });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBeCloseTo((300 * 9.81) / 15000, 4);
    }

    // 3. Airspeed parasite drag sensitivity
    for (const speed of [15, 28, 40]) {
      const params = { flightSpeedKnots: speed, flightAlt: 500 };
      const sens = computeParameterSensitivity(id, "flightSpeedKnots", params);
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Parasite Aerodynamic Drag");
      expect(sens?.derivativeSymbol).toBe("∂D / ∂v_knot");
      expect(sens?.derivativeUnit).toBe("kN / knot");
      const zep = stepZeppelinAirship(params);
      expect(sens?.derivativeValue).toBeCloseTo(zep.dragSlopeKnPerKnot, 4);

      const fwd = stepZeppelinAirship({ ...params, flightSpeedKnots: speed + h });
      const bwd = stepZeppelinAirship({ ...params, flightSpeedKnots: speed - h });
      const numSlope = (fwd.parasiteDragKnUnrounded - bwd.parasiteDragKnUnrounded) / (2 * h);
      expect(sens?.derivativeValue).toBeCloseTo(numSlope, 4);
    }

    // Speed aliases
    for (const alias of ["speed", "speedKnots", "airspeedKnots", "flightSpeed", "airspeedMph"]) {
      const sens = computeParameterSensitivity(id, alias, { [alias]: 25 });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBeGreaterThan(0);
    }

    // 4. Flight altitude barometric decay sensitivity
    for (const alt of [100, 800, 1500]) {
      const params = { flightAlt: alt, gasInflation: 90 };
      const sens = computeParameterSensitivity(id, "flightAlt", params);
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Barometric Aerostatic Lift Decay");
      expect(sens?.derivativeSymbol).toBe("∂L_gross / ∂h");
      expect(sens?.derivativeUnit).toBe("kN / m");
      const zep = stepZeppelinAirship(params);
      expect(sens?.derivativeValue).toBeCloseTo(zep.altitudeLiftSlopeKnPerM, 4);

      const fwd = stepZeppelinAirship({ ...params, flightAlt: alt + h });
      const bwd = stepZeppelinAirship({ ...params, flightAlt: alt - h });
      const numSlope = (fwd.grossBuoyancyKnUnrounded - bwd.grossBuoyancyKnUnrounded) / (2 * h);
      expect(sens?.derivativeValue).toBeCloseTo(numSlope, 3);
    }

    // Altitude aliases
    for (const alias of ["altitude", "altitudeM", "alt"]) {
      const sens = computeParameterSensitivity(id, alias, { [alias]: 400 });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBeLessThan(0);
    }

    // Claim 1 gating: zero derivatives when rigid framework omitted
    for (const control of ["gasInflation", "trimWeight", "flightSpeedKnots", "flightAlt"]) {
      const gated = computeParameterSensitivity(id, control, { claim1Active: false });
      expect(gated).toBeDefined();
      expect(gated?.derivativeValue).toBe(0);
      expect(gated?.interpretation).toContain("Claim 1 withheld");
    }

    // Invalid parameters
    for (const invalid of [74, 101, Number.NaN]) {
      expect(computeParameterSensitivity(id, "gasInflation", { gasInflation: invalid })).toBeNull();
    }
    expect(computeParameterSensitivity(id, "gasInflation", { flightAlt: -1 })).toBeNull();
    expect(computeParameterSensitivity(id, "flightAlt", { flightAlt: 2100 })).toBeNull();
    expect(computeParameterSensitivity(id, "flightSpeedKnots", { flightSpeedKnots: 5 })).toBeNull();
    expect(computeParameterSensitivity(id, "trimWeight", { trimWeight: 20 })).toBeNull();
  });

  test("Sikorsky helicopter derives thrust, yaw, throttle, and cyclic sensitivity from scenario state", () => {
    const id = "us-2318259-sikorsky-helicopter";

    // 1. Collective pitch sensitivity
    for (const pitch of [3.0, 6.8, 12.0, 15.0]) {
      const params = { collectivePitchDeg: pitch };
      const collSens = computeParameterSensitivity(id, "collectivePitchDeg", params);
      expect(collSens).toBeDefined();
      expect(collSens?.metricName).toBe("Main Rotor Thrust");
      expect(collSens?.derivativeSymbol).toBe("∂T_main / ∂θ_coll");
      expect(collSens?.derivativeUnit).toBe("N / deg");
      expect(collSens?.derivativeValue).toBeGreaterThan(500);

      // Aerodynamic derivative check against model metrics
      const controls = readSikorskyControls(params);
      const stepped = stepSikorskyHelicopterSi(INITIAL_SIKORSKY_STATE, controls, 1 / 60);
      expect(collSens?.derivativeValue).toBeCloseTo(
        stepped.metrics.mainRotorThrustSlopeNPerDeg ?? 0,
        1,
      );
    }

    // Collective aliases
    for (const alias of ["collective", "collectivePitch", "pitchDeg"]) {
      const sens = computeParameterSensitivity(id, alias, { [alias]: 8.0 });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBeGreaterThan(500);
    }

    // 2. Tail rotor anti-torque sensitivity when enabled vs disabled
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

    // Pedal aliases
    for (const alias of ["pedal", "pedals", "tailPedal", "rudderPedals", "pedalPercent"]) {
      const sens = computeParameterSensitivity(id, alias, { [alias]: 10 });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBe(-21.6);
    }

    // 3. Engine throttle sensitivity when running vs autorotating
    const throttleRunning = computeParameterSensitivity(id, "engineThrottlePercent", {
      engineRunning: 1,
    });
    expect(throttleRunning).toBeDefined();
    expect(throttleRunning?.derivativeValue).toBe(0.8);
    expect(throttleRunning?.derivativeUnit).toBe("RPM / %");

    const throttleOff = computeParameterSensitivity(id, "engineThrottlePercent", {
      engineRunning: 0,
    });
    expect(throttleOff).toBeDefined();
    expect(throttleOff?.derivativeValue).toBe(0);
    expect(throttleOff?.interpretation).toContain("autorotation");

    // Throttle aliases
    for (const alias of ["throttle", "throttlePercent", "engineThrottle"]) {
      const sens = computeParameterSensitivity(id, alias, { [alias]: 80 });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBe(0.8);
    }

    // 4. Cyclic swashplate tilts
    const cyclicPitch = computeParameterSensitivity(id, "cyclicPitchForwardDeg", {
      cyclicPitchForwardDeg: 2,
    });
    expect(cyclicPitch).toBeDefined();
    expect(cyclicPitch?.derivativeValue).toBe(1.0);
    expect(cyclicPitch?.derivativeUnit).toBe("deg / deg");

    for (const alias of ["cyclicPitch", "cyclicPitchDeg"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 1 })?.derivativeValue).toBe(1.0);
    }

    const cyclicRoll = computeParameterSensitivity(id, "cyclicRollRightDeg", {
      cyclicRollRightDeg: 3,
    });
    expect(cyclicRoll).toBeDefined();
    expect(cyclicRoll?.derivativeValue).toBe(1.0);
    expect(cyclicRoll?.derivativeUnit).toBe("deg / deg");

    for (const alias of ["cyclicRoll", "cyclicRollDeg"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 1 })?.derivativeValue).toBe(1.0);
    }

    // 5. Claim 2 gating: auxiliary rotor withheld
    const claim2Withheld = computeParameterSensitivity(id, "tailRotorPedalPercent", {
      claim2Active: false,
    });
    expect(claim2Withheld).toBeDefined();
    expect(claim2Withheld?.derivativeValue).toBe(0);
    expect(claim2Withheld?.interpretation).toContain("Claim 2 withheld");

    // 6. Engine running drive state
    const engineOn = computeParameterSensitivity(id, "engineRunning", { engineRunning: 1 });
    expect(engineOn).toBeDefined();
    expect(engineOn?.metricName).toBe("Engine Drive & Governor State");
    expect(engineOn?.derivativeSymbol).toBe("ΔState / ΔEngine");
    expect(engineOn?.derivativeValue).toBe(0);
    expect(engineOn?.interpretation).toContain("geared to main and tail rotor drive shafts");

    const engineOff = computeParameterSensitivity(id, "engineRunning", { engineRunning: 0 });
    expect(engineOff?.interpretation).toContain("autorotation");

    for (const alias of ["running", "engine", "ignition"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 1 })?.derivativeValue).toBe(0);
    }

    // Invalid parameters
    for (const invalid of [1.9, 16.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "collectivePitchDeg", { collectivePitchDeg: invalid }),
      ).toBeNull();
    }
    expect(
      computeParameterSensitivity(id, "tailRotorPedalPercent", { tailRotorPedalPercent: 105 }),
    ).toBeNull();
    expect(
      computeParameterSensitivity(id, "engineThrottlePercent", { engineThrottlePercent: -5 }),
    ).toBeNull();
    expect(
      computeParameterSensitivity(id, "cyclicPitchForwardDeg", { cyclicPitchForwardDeg: 12 }),
    ).toBeNull();
    for (const invalid of [-0.1, 1.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "engineRunning", { engineRunning: invalid }),
      ).toBeNull();
    }
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

    // Initial motion angle
    for (const angle of [0, 15, 30, 45, 90]) {
      const sens = computeParameterSensitivity(id, "initialMotionAngleDeg", {
        initialMotionAngleDeg: angle,
      });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Initial Contact Motion Angle (Claim 1)");
      expect(sens?.derivativeSymbol).toBe("∂θ_motion / ∂θ_input");
      expect(sens?.derivativeUnit).toBe("° / °");
      expect(sens?.derivativeValue).toBe(1.0);
    }

    // Aliases
    expect(computeParameterSensitivity(id, "separation", {})?.derivativeValue).toBe(0.02);
    expect(computeParameterSensitivity(id, "count", {})?.derivativeValue).toBe(1.0);
    expect(computeParameterSensitivity(id, "initialMotionAngle", {})?.derivativeValue).toBe(1.0);
    expect(computeParameterSensitivity(id, "motionAngle", {})?.derivativeValue).toBe(1.0);
    expect(computeParameterSensitivity(id, "angleDeg", {})?.derivativeValue).toBe(1.0);

    // Invalid parameters
    for (const invalid of [14, 121, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "fingerSeparationMm", { fingerSeparationMm: invalid }),
      ).toBeNull();
    }
    for (const invalid of [-1, 3, Number.NaN]) {
      expect(computeParameterSensitivity(id, "fingerCount", { fingerCount: invalid })).toBeNull();
    }
    for (const invalid of [-1, 91, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "initialMotionAngleDeg", {
          initialMotionAngleDeg: invalid,
        }),
      ).toBeNull();
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

      for (const key of ["signalPulsePressurePsi", "signalPulse", "signalPressure"]) {
        const aliasSens = computeParameterSensitivity(id, key, {
          [key]: signal,
        });
        expect(aliasSens?.derivativeValue).toBe(sens?.derivativeValue);
      }
    }

    // Selecting Cock d¹ Role Reversal
    const cockSens = computeParameterSensitivity(id, "selectingCockPosition", {
      trainPipePressure: 60,
      reservoirPipePressure: 90,
      selectingCockPosition: 0,
    });
    expect(cockSens).toBeDefined();
    expect(cockSens?.metricName).toBe("Pneumatic Line Role Assignment");
    expect(cockSens?.derivativeSymbol).toBe("ΔF_clamp / ΔCock");
    expect(cockSens?.derivativeUnit).toBe("kN / pos");
    expect(cockSens?.derivativeValue).toBeGreaterThan(0);
    for (const key of ["selectingCock", "cockPosition", "cockD1"]) {
      const aliasSens = computeParameterSensitivity(id, key, {
        trainPipePressure: 60,
        reservoirPipePressure: 90,
        [key]: 0,
      });
      expect(aliasSens?.derivativeValue).toBe(cockSens?.derivativeValue);
    }

    // Accident Trip Cock e
    const tripSens = computeParameterSensitivity(id, "accidentTrip", {
      trainPipePressure: 0,
      reservoirPipePressure: 90,
      accidentTrip: 0,
    });
    expect(tripSens).toBeDefined();
    expect(tripSens?.metricName).toBe("Automatic Emergency Clamping Force");
    expect(tripSens?.derivativeSymbol).toBe("ΔF_clamp / ΔTrip");
    expect(tripSens?.derivativeUnit).toBe("kN / mode");
    expect(tripSens?.derivativeValue).toBeGreaterThan(0);
    for (const key of ["trip", "tripCock", "cockE"]) {
      const aliasSens = computeParameterSensitivity(id, key, {
        trainPipePressure: 0,
        reservoirPipePressure: 90,
        [key]: 0,
      });
      expect(aliasSens?.derivativeValue).toBe(tripSens?.derivativeValue);
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
    for (const invalid of [-1, 2, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "selectingCockPosition", {
          selectingCockPosition: invalid,
        }),
      ).toBeNull();
    }
    for (const invalid of [-1, 3, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "accidentTrip", {
          accidentTrip: invalid,
        }),
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

      for (const key of ["spacebandWedgeMm", "wedge", "wedgeMm"]) {
        const aliasSens = computeParameterSensitivity(id, key, { [key]: wedge });
        expect(aliasSens?.derivativeValue).toBe(sens?.derivativeValue);
      }
    }

    for (const rate of [30, 60, 90]) {
      const sens = computeParameterSensitivity(id, "matrixRate", { matrixRate: rate });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Matrix Distributor Escapement Frequency");
      expect(sens?.derivativeSymbol).toBe("∂f_dist / ∂Rate");
      expect(sens?.derivativeUnit).toBe("Hz / (char/min)");
      expect(sens?.derivativeValue).toBeCloseTo(1 / 60, 4);

      for (const key of ["matrixRatePerMin", "typesettingSpeed", "matrixSpeed"]) {
        const aliasSens = computeParameterSensitivity(id, key, { [key]: rate });
        expect(aliasSens?.derivativeValue).toBe(sens?.derivativeValue);
      }
    }

    for (const temp of [230, 260, 290]) {
      const sens = computeParameterSensitivity(id, "potTemp", { potTemp: temp });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Lead-Tin-Antimony Solidification Duration");
      expect(sens?.derivativeSymbol).toBe("∂t_solid / ∂T_pot");
      expect(sens?.derivativeUnit).toBe("ms / °C");
      expect(sens?.derivativeValue).toBeCloseTo(450 / 260, 4);

      for (const key of ["potTempC", "metalTemp", "temperatureC"]) {
        const aliasSens = computeParameterSensitivity(id, key, { [key]: temp });
        expect(aliasSens?.derivativeValue).toBe(sens?.derivativeValue);
      }
    }

    for (const picas of [10, 13, 20]) {
      const sens = computeParameterSensitivity(id, "lineLengthPicas", { lineLengthPicas: picas });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Column Measure Linotype Slug Length");
      expect(sens?.derivativeSymbol).toBe("∂Width / ∂Pica");
      expect(sens?.derivativeUnit).toBe("mm / pica");
      expect(sens?.derivativeValue).toBe(4.2333);

      for (const key of ["columnMeasurePicas", "lineLength", "measurePicas"]) {
        const aliasSens = computeParameterSensitivity(id, key, { [key]: picas });
        expect(aliasSens?.derivativeValue).toBe(sens?.derivativeValue);
      }
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
    for (const invalid of [7.9, 26.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "lineLengthPicas", { lineLengthPicas: invalid }),
      ).toBeNull();
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

  test("Sundback Zipper derives scoop engagement, cam wedge force, cord strain, flex burst, and density sensitivities", () => {
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

    for (const alias of ["sliderPosition", "posPct", "position", "sliderPos"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 50 })?.derivativeValue).toBe(0.65);
    }

    for (const pull of [10, 25, 45]) {
      const sens = computeParameterSensitivity(id, "pullForceN", { pullForceN: pull });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Cam Wedge Normal Force");
      expect(sens?.derivativeSymbol).toBe("∂F_n / ∂F_pull");
      expect(sens?.derivativeUnit).toBe("N / N");
      expect(sens?.derivativeValue).toBe(1.25);
    }

    for (const alias of ["pullForce", "pull", "pullN"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 25 })?.derivativeValue).toBe(1.25);
    }

    for (const lat of [20, 80, 150]) {
      const sens = computeParameterSensitivity(id, "lateralTensionN", { lateralTensionN: lat });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Corded Tape Strain");
      expect(sens?.derivativeSymbol).toBe("∂ε / ∂F_lat");
      expect(sens?.derivativeUnit).toBe("% / N");
      expect(sens?.derivativeValue).toBeCloseTo(100 / 1700, 4);
    }

    for (const alias of ["lateralTension", "tension", "tensionN", "transverseTension"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 80 })?.derivativeValue).toBeCloseTo(
        100 / 1700,
        4,
      );
    }

    // Tape flex angle burst resistance sensitivity
    const baseSundback = {
      sliderPositionPct: 65,
      pullForceN: 15,
      lateralTensionN: 40,
      flexAngleDeg: 25,
      toothDensityTpi: 11,
      staggerAligned: 1,
    };
    const sensFlex = computeParameterSensitivity(id, "flexAngleDeg", baseSundback);
    expect(sensFlex).toBeDefined();
    expect(sensFlex?.metricName).toBe("Bending Burst Resistance");
    expect(sensFlex?.derivativeSymbol).toBe("∂F_burst / ∂θ_flex");
    expect(sensFlex?.derivativeUnit).toBe("N / deg");

    const hFlex = 1e-3;
    const burstPlus = stepSundbackZipperSi({
      ...baseSundback,
      flexAngleDeg: 25 + hFlex,
      staggerAligned: true,
    }).burstResistanceN;
    const burstMinus = stepSundbackZipperSi({
      ...baseSundback,
      flexAngleDeg: 25 - hFlex,
      staggerAligned: true,
    }).burstResistanceN;
    const numDerivFlex = (burstPlus - burstMinus) / (2 * hFlex);
    expect(sensFlex?.derivativeValue).toBeCloseTo(numDerivFlex, 2);

    for (const alias of ["flexAngle", "flexDeg", "flexion", "bendingAngle"]) {
      expect(
        computeParameterSensitivity(id, alias, { ...baseSundback, [alias]: 25 })?.derivativeValue,
      ).toBe(sensFlex?.derivativeValue);
    }

    // Tooth density TPI sensitivity
    const sensTpi = computeParameterSensitivity(id, "toothDensityTpi", baseSundback);
    expect(sensTpi).toBeDefined();
    expect(sensTpi?.metricName).toBe("Tooth Density Capacity");
    expect(sensTpi?.derivativeSymbol).toBe("∂N_engaged / ∂TPI");
    expect(sensTpi?.derivativeUnit).toBe("teeth / TPI");

    const hTpi = 1e-3;
    const teethPlus = stepSundbackZipperSi({
      ...baseSundback,
      toothDensityTpi: 11 + hTpi,
      staggerAligned: true,
    }).engagedTeeth;
    const teethMinus = stepSundbackZipperSi({
      ...baseSundback,
      toothDensityTpi: 11 - hTpi,
      staggerAligned: true,
    }).engagedTeeth;
    const numDerivTpi = (teethPlus - teethMinus) / (2 * hTpi);
    expect(sensTpi?.derivativeValue).toBeCloseTo(numDerivTpi, 2);

    for (const alias of ["toothDensity", "tpi", "densityTpi"]) {
      expect(
        computeParameterSensitivity(id, alias, { ...baseSundback, [alias]: 11 })?.derivativeValue,
      ).toBe(sensTpi?.derivativeValue);
    }

    // Stagger aligned interlock state
    const sensStaggerOn = computeParameterSensitivity(id, "staggerAligned", baseSundback);
    expect(sensStaggerOn).toBeDefined();
    expect(sensStaggerOn?.metricName).toBe("Claim 1 Half-Pitch Stagger Interlock");
    expect(sensStaggerOn?.derivativeSymbol).toBe("ΔState / ΔStagger");
    expect(sensStaggerOn?.derivativeValue).toBe(0);
    expect(sensStaggerOn?.interpretation).toContain("Claim 1 compliant");

    const sensStaggerOff = computeParameterSensitivity(id, "staggerAligned", {
      ...baseSundback,
      staggerAligned: 0,
    });
    expect(sensStaggerOff?.interpretation).toContain("jamming the slider throat");

    for (const alias of ["stagger", "staggered", "claim1Stagger"]) {
      expect(
        computeParameterSensitivity(id, alias, { ...baseSundback, [alias]: 1 })?.derivativeValue,
      ).toBe(0);
    }

    // When stagger is violated, slider engagement derivative is 0 (jammed)
    const sensSliderJammed = computeParameterSensitivity(id, "sliderPositionPct", {
      ...baseSundback,
      staggerAligned: 0,
    });
    expect(sensSliderJammed?.derivativeValue).toBe(0);

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
    for (const invalid of [-0.1, 1.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "staggerAligned", { staggerAligned: invalid }),
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
    expect(
      computeParameterSensitivity(id, "reagentViscosityCp", { claim1Active: 0 })?.derivativeValue,
    ).toBe(0);
    expect(
      computeParameterSensitivity(id, "rollerGapUm", { claim1Active: 0 })?.derivativeValue,
    ).toBe(0);
    expect(computeParameterSensitivity(id, "alkaliPh", { claim1Active: 0 })?.derivativeValue).toBe(
      0,
    );

    // Claim 1 attached product path sensitivity
    const sensClaim1On = computeParameterSensitivity(id, "claim1Active", { claim1Active: 1 });
    expect(sensClaim1On).toBeDefined();
    expect(sensClaim1On?.metricName).toBe("Claim 1 Attached Product Path");
    expect(sensClaim1On?.derivativeSymbol).toBe("ΔState / ΔClaim1");
    expect(sensClaim1On?.derivativeUnit).toBe("state");
    expect(sensClaim1On?.derivativeValue).toBe(0);
    expect(sensClaim1On?.interpretation).toContain("Claim 1 compliant");

    const sensClaim1Off = computeParameterSensitivity(id, "claim1Active", { claim1Active: 0 });
    expect(sensClaim1Off?.interpretation).toContain("Claim 1 attached product path severed");

    for (const alias of ["claim1", "claim1Pod", "podPresent", "reagentPod"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 1 })?.derivativeValue).toBe(0);
    }

    // Aliases
    expect(
      computeParameterSensitivity(id, "devTimeSec", { devTimeSec: 30 })?.derivativeValue,
    ).toBeDefined();
    expect(
      computeParameterSensitivity(id, "exposure", { exposure: 0.5 })?.derivativeValue,
    ).toBeDefined();
    expect(
      computeParameterSensitivity(id, "viscosity", { viscosity: 25000 })?.derivativeValue,
    ).toBeDefined();
    expect(computeParameterSensitivity(id, "gap", { gap: 25 })?.derivativeValue).toBeDefined();
    expect(computeParameterSensitivity(id, "ph", { ph: 12.6 })?.derivativeValue).toBeDefined();

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
    for (const invalid of [-0.1, 1.1, Number.NaN]) {
      expect(computeParameterSensitivity(id, "claim1Active", { claim1Active: invalid })).toBeNull();
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

    // Applied clamp direction angle sensitivity
    for (const angle of [20, 90, 150]) {
      const sens = computeParameterSensitivity(id, "peelAngleDeg", { peelAngleDeg: angle });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Applied Clamp Direction Angle");
      expect(sens?.derivativeSymbol).toBe("∂θ_clamp / ∂θ_input");
      expect(sens?.derivativeUnit).toBe("deg / deg");
      expect(sens?.derivativeValue).toBe(1.0);
    }
    for (const alias of ["peelAngle", "angle", "clampAngle", "angleDeg"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 45 })?.derivativeValue).toBe(1.0);
    }

    // Peel front advance sensitivity
    for (const prog of [0.1, 0.5, 0.9]) {
      const sens = computeParameterSensitivity(id, "peelProgress", { peelProgress: prog });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Peel Front Advance");
      expect(sens?.derivativeSymbol).toBe("∂x_peel / ∂u_peel");
      expect(sens?.derivativeUnit).toBe("normalized / normalized");
      expect(sens?.derivativeValue).toBe(1.0);
    }
    for (const alias of ["progress", "peelFront", "advance", "peelAdvance"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 0.5 })?.derivativeValue).toBe(1.0);
    }

    // Aliases for geometry
    expect(
      computeParameterSensitivity(id, "diameter", { diameter: 0.2 })?.derivativeValue,
    ).toBeDefined();
    expect(
      computeParameterSensitivity(id, "length", { length: 2.0 })?.derivativeValue,
    ).toBeDefined();
    expect(computeParameterSensitivity(id, "density", { density: 60 })?.derivativeValue).toBe(0.04);

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

    // Claim 3 clutch coupling sensitivity
    const sensClutch = computeParameterSensitivity(id, "clutchEngaged", { clutchEngaged: 1 });
    expect(sensClutch).toBeDefined();
    expect(sensClutch?.metricName).toBe("Claim 3 Clutch Lead Screw Drive Coupling");
    expect(sensClutch?.derivativeSymbol).toBe("Δcoupling / Δclutch");
    expect(sensClutch?.derivativeValue).toBe(1.0);
    expect(sensClutch?.derivativeUnit).toBe("state / norm");

    // Mechanism run state sensitivity
    const sensRun = computeParameterSensitivity(id, "running", { running: 1 });
    expect(sensRun).toBeDefined();
    expect(sensRun?.metricName).toBe("Mechanism Run State");
    expect(sensRun?.derivativeSymbol).toBe("Δpower / Δrun");
    expect(sensRun?.derivativeValue).toBe(1.0);
    expect(sensRun?.derivativeUnit).toBe("state / norm");

    // Aliases
    expect(computeParameterSensitivity(id, "pulseCount", { pulseCount: 15 })?.derivativeValue).toBe(
      1,
    );
    expect(
      computeParameterSensitivity(id, "displaySpeed", { displaySpeed: 4 })?.derivativeValue,
    ).toBe(0);
    expect(
      computeParameterSensitivity(id, "offInterval", { offInterval: 3.0 })?.derivativeValue,
    ).toBe(1.0);
    expect(computeParameterSensitivity(id, "clutch", { clutch: 1 })?.derivativeValue).toBe(1.0);
    expect(computeParameterSensitivity(id, "run", { run: 1 })?.derivativeValue).toBe(1.0);

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
    for (const invalid of [-0.1, 1.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "clutchEngaged", { clutchEngaged: invalid }),
      ).toBeNull();
      expect(computeParameterSensitivity(id, "running", { running: invalid })).toBeNull();
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

      // Frequency alias invariance
      for (const alias of ["freq", "freqHz", "frequencyHz", "lineFrequency", "lineFreq"]) {
        const sensAlias = computeParameterSensitivity(id, alias, { [alias]: freq });
        expect(sensAlias?.derivativeValue).toBe(60);
      }
    }

    // AC Hum binary sonification toggle
    for (const humVal of [0, 1, false, true]) {
      const sensHum = computeParameterSensitivity(id, "acHum", { acHum: humVal });
      expect(sensHum).toBeDefined();
      expect(sensHum?.metricName).toBe("Acoustic Hum Modulation State");
      expect(sensHum?.derivativeSymbol).toBe("ΔState / ΔHum");
      expect(sensHum?.derivativeValue).toBe(0);
      expect(sensHum?.derivativeUnit).toBe("state");

      // AC Hum aliases
      for (const alias of ["hum", "audioHum", "audio"]) {
        const sensAlias = computeParameterSensitivity(id, alias, { [alias]: humVal });
        expect(sensAlias?.derivativeValue).toBe(0);
      }
    }

    // Refusal of unsupported parameters
    for (const unsupported of ["voltage", "current", "poles", "fieldStrength"]) {
      expect(computeParameterSensitivity(id, unsupported, { frequency: 60 })).toBeNull();
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

    for (const d of [20, 25, 35]) {
      const sensD = computeParameterSensitivity(id, "tubeDiameterMm", { tubeDiameterMm: d });
      expect(sensD).toBeDefined();
      expect(sensD?.metricName).toBe("Tube Confinement Luminous Flux");
      expect(sensD?.derivativeSymbol).toBe("∂Φ / ∂D_tube");
      expect(sensD?.derivativeUnit).toBe("lm / mm");

      const fwd = stepHewittMercuryLamp({
        mainsVoltageV: 110,
        ballastResistanceOhms: 12,
        tubeLengthCm: 100,
        tubeDiameterMm: d + h,
      }).luminousFluxLumensUnrounded;
      const bwd = stepHewittMercuryLamp({
        mainsVoltageV: 110,
        ballastResistanceOhms: 12,
        tubeLengthCm: 100,
        tubeDiameterMm: d - h,
      }).luminousFluxLumensUnrounded;
      const fd = (fwd - bwd) / (2 * h);
      expect(sensD?.derivativeValue).toBeCloseTo(fd, 3);

      // Aliases
      for (const key of ["diameter", "tubeDiameter", "tubeDiamMm", "diamMm"]) {
        const aliasSens = computeParameterSensitivity(id, key, { [key]: d });
        expect(aliasSens?.derivativeValue).toBe(sensD?.derivativeValue);
      }
    }

    // Claim 1 refusal gating
    const gatedV = computeParameterSensitivity(id, "mainsVoltageV", {
      mainsVoltageV: 110,
      claim1Active: false,
    });
    expect(gatedV?.derivativeValue).toBe(0);
    expect(gatedV?.interpretation).toContain("Claim 1");

    const gatedD = computeParameterSensitivity(id, "tubeDiameterMm", {
      tubeDiameterMm: 25,
      claim1Active: false,
    });
    expect(gatedD?.derivativeValue).toBe(0);
    expect(gatedD?.interpretation).toContain("Claim 1");

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

    for (const alias of [
      "controlRodWithdrawalPct",
      "rodPosition",
      "rod",
      "controlRod",
      "withdrawal",
    ]) {
      expect(
        computeParameterSensitivity(id, alias, {
          [alias]: 83.5,
          moderatorPurity: 99.5,
          claim1Active: 1,
        })?.derivativeValue,
      ).toBeCloseTo(0.0003, 4);
    }

    // Moderator graphite purity sensitivity
    for (const purity of [96, 98, 99.5]) {
      const sensMod = computeParameterSensitivity(id, "moderatorPurity", {
        rodWithdrawal: 83.5,
        moderatorPurity: purity,
        claim1Active: 1,
      });
      expect(sensMod).toBeDefined();
      expect(sensMod?.metricName).toBe("Moderator Graphite Purity Margin");
      expect(sensMod?.derivativeSymbol).toBe("∂k_eff / ∂p_graphite");
      expect(sensMod?.derivativeUnit).toBe("k / %");
      expect(sensMod?.derivativeValue).toBe(0);
      expect(sensMod?.interpretation).toContain("purity to minimize parasitic neutron capture");
    }

    for (const alias of ["purity", "graphitePurity", "moderatorPurityPct"]) {
      expect(
        computeParameterSensitivity(id, alias, {
          rodWithdrawal: 83.5,
          [alias]: 99.5,
          claim1Active: 1,
        })?.derivativeValue,
      ).toBe(0);
    }

    const sensModDecoupled = computeParameterSensitivity(id, "moderatorPurity", {
      rodWithdrawal: 83.5,
      moderatorPurity: 99.5,
      claim1Active: 0,
    });
    expect(sensModDecoupled?.interpretation).toContain("graphite moderator produces zero");

    // Claim 1 visibility control
    for (const claim of [0, 1]) {
      const sensClaim = computeParameterSensitivity(id, "claim1Active", { claim1Active: claim });
      expect(sensClaim).toBeDefined();
      expect(sensClaim?.metricName).toBe("Claim 1 Lattice Geometry Visibility");
      expect(sensClaim?.derivativeValue).toBe(1);
    }

    for (const alias of ["claim1", "lattice"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 1 })?.derivativeValue).toBe(1);
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

    // Flyer spindle speed sensitivity (18.5 RPM / RPM) & aliases
    for (const rpm of [60, 120, 180, 260]) {
      const sens = computeParameterSensitivity(id, "waterWheelRpm", { waterWheelRpm: rpm });
      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Flyer Spindle Rotation Speed");
      expect(sens?.derivativeSymbol).toBe("∂N_spindle / ∂RPM_wheel");
      expect(sens?.derivativeUnit).toBe("RPM / RPM");
      expect(sens?.derivativeValue).toBe(18.5);
    }
    for (const alias of ["rpm", "wheelRpm", "speedRpm", "wheelSpeed"]) {
      const sens = computeParameterSensitivity(id, alias, { [alias]: 160 });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBe(18.5);
    }

    // Draft ratio attenuation sensitivity & aliases
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
    for (const alias of ["draftRatio", "draft", "draftD"]) {
      const sens = computeParameterSensitivity(id, alias, {
        [alias]: 5.0,
        inputRovingCountNe: 1.2,
      });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBe(1.2);
    }

    // Roller clamping weight sensitivity (below and above grip slip threshold ~2.04 kg)
    const sensWeightSlip = computeParameterSensitivity(id, "rollerClampingWeightKg", {
      rollerClampingWeightKg: 1.5,
      totalDraftRatio: 6.0,
    });
    expect(sensWeightSlip).toBeDefined();
    expect(sensWeightSlip?.metricName).toBe("Fiber Parallelization");
    expect(sensWeightSlip?.derivativeSymbol).toBe("∂Parallelization / ∂M_clamp");
    expect(sensWeightSlip?.derivativeUnit).toBe("% / kg");
    expect(sensWeightSlip?.derivativeValue).toBeGreaterThan(0);

    const sensWeightGrip = computeParameterSensitivity(id, "rollerClampingWeightKg", {
      rollerClampingWeightKg: 3.5,
      totalDraftRatio: 6.0,
    });
    expect(sensWeightGrip).toBeDefined();
    expect(sensWeightGrip?.derivativeValue).toBe(0.0);

    for (const alias of ["clampingWeightKg", "clampingWeight", "weightKg", "rollerWeight"]) {
      const sens = computeParameterSensitivity(id, alias, { [alias]: 1.5, totalDraftRatio: 6.0 });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBeGreaterThan(0);
    }

    // Staple length sensitivity (tensile breaking load slope)
    const sensStapleNormal = computeParameterSensitivity(id, "stapleLengthMm", {
      stapleLengthMm: 28,
    });
    expect(sensStapleNormal).toBeDefined();
    expect(sensStapleNormal?.metricName).toBe("Yarn Breaking Strength");
    expect(sensStapleNormal?.derivativeSymbol).toBe("∂F_break / ∂L_staple");
    expect(sensStapleNormal?.derivativeUnit).toBe("N / mm");
    expect(sensStapleNormal?.derivativeValue).toBeGreaterThan(0);

    const sensStapleSat = computeParameterSensitivity(id, "stapleLengthMm", {
      stapleLengthMm: 35,
    });
    expect(sensStapleSat).toBeDefined();
    expect(sensStapleSat?.derivativeValue).toBe(0.0);

    for (const alias of ["stapleLength", "fiberLength", "staple"]) {
      const sens = computeParameterSensitivity(id, alias, { [alias]: 26 });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBeGreaterThan(0);
    }

    // Input roving count sensitivity
    const sensRoving = computeParameterSensitivity(id, "inputRovingCountNe", {
      inputRovingCountNe: 1.0,
      totalDraftRatio: 6.0,
    });
    expect(sensRoving).toBeDefined();
    expect(sensRoving?.metricName).toBe("Yarn Count Attenuation");
    expect(sensRoving?.derivativeSymbol).toBe("∂Ne_out / ∂Ne_in");
    expect(sensRoving?.derivativeUnit).toBe("count / count");
    expect(sensRoving?.derivativeValue).toBe(6.0);

    for (const alias of ["rovingCountNe", "rovingCount", "inputRoving"]) {
      const sens = computeParameterSensitivity(id, alias, { [alias]: 1.2, totalDraftRatio: 5.5 });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBe(5.5);
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

    // Stroke rate sensitivity & aliases
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
    for (const alias of ["spm", "strokeRate", "speedSpm", "beamSpm"]) {
      const sens = computeParameterSensitivity(id, alias, { [alias]: 24, gearRatioNpOverNs: 1.0 });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBe(2.0);
    }

    // Gear ratio sensitivity & aliases
    const sensRatio = computeParameterSensitivity(id, "gearRatioNpOverNs", {
      gearRatioNpOverNs: 1.0,
    });
    expect(sensRatio).toBeDefined();
    expect(sensRatio?.metricName).toBe("Shaft Speed Multiplier");
    expect(sensRatio?.derivativeSymbol).toBe("∂Mult / ∂Ratio");
    expect(sensRatio?.derivativeUnit).toBe("multiplier / ratio");
    expect(sensRatio?.derivativeValue).toBe(1.0);

    for (const alias of ["gearRatio", "ratio", "toothRatio", "gearRatioNpNs"]) {
      const sens = computeParameterSensitivity(id, alias, { [alias]: 1.5 });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBe(1.0);
    }

    // Boiler pressure power sensitivity & aliases
    const sensBoiler = computeParameterSensitivity(id, "boilerPressureKpa", {
      boilerPressureKpa: 70,
      strokeRateSpm: 20,
    });
    expect(sensBoiler).toBeDefined();
    expect(sensBoiler?.metricName).toBe("Scenario Ideal Shaft Power");
    expect(sensBoiler?.derivativeSymbol).toBe("∂P_mean / ∂P_boiler");
    expect(sensBoiler?.derivativeUnit).toBe("kW / kPa");
    expect(sensBoiler?.derivativeValue).toBeCloseTo((0.453646 * 1.8 * 20) / 60, 3);

    for (const alias of ["boilerPressure", "pressureKpa", "steamPressure", "pressure"]) {
      const sens = computeParameterSensitivity(id, alias, { [alias]: 80, strokeRateSpm: 25 });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBeCloseTo((0.453646 * 1.8 * 25) / 60, 3);
    }

    // Flywheel mass kinetic energy sensitivity & aliases
    const sensFlywheel = computeParameterSensitivity(id, "flywheelMassKg", {
      flywheelMassKg: 3500,
      strokeRateSpm: 20,
      gearRatioNpOverNs: 1.0,
    });
    expect(sensFlywheel).toBeDefined();
    expect(sensFlywheel?.metricName).toBe("Flywheel Kinetic Energy");
    expect(sensFlywheel?.derivativeSymbol).toBe("∂E_flywheel / ∂M_flywheel");
    expect(sensFlywheel?.derivativeUnit).toBe("kJ / kg");
    expect(sensFlywheel?.derivativeValue).toBeGreaterThan(0);

    for (const alias of ["flywheelMass", "massKg", "flywheelWeight"]) {
      const sens = computeParameterSensitivity(id, alias, {
        [alias]: 4000,
        strokeRateSpm: 20,
        gearRatioNpOverNs: 1.0,
      });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBeGreaterThan(0);
    }

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

    // Furnace temperature sensitivity & aliases
    const sensTemp = computeParameterSensitivity(id, "furnaceTemperatureCelsius", {
      furnaceTemperatureCelsius: 1350,
    });
    expect(sensTemp).toBeDefined();
    expect(sensTemp?.metricName).toBe("Decarburization Oxidation Rate");
    expect(sensTemp?.derivativeSymbol).toBe("∂Rate_decarb / ∂T");
    expect(sensTemp?.derivativeUnit).toBe("%/min / °C");
    expect(sensTemp?.derivativeValue).toBe(0.015);

    for (const alias of [
      "furnaceTemp",
      "temperatureCelsius",
      "temperatureC",
      "tempC",
      "furnaceTemperature",
      "temperature",
    ]) {
      const sens = computeParameterSensitivity(id, alias, { [alias]: 1400 });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBe(0.015);
    }

    // Rabble stirring sensitivity & aliases
    const sensRabble = computeParameterSensitivity(id, "rabbleStirringRpm", {
      rabbleStirringRpm: 15,
    });
    expect(sensRabble).toBeDefined();
    expect(sensRabble?.metricName).toBe("Slag Contact Decarburization Enhancement");
    expect(sensRabble?.derivativeSymbol).toBe("∂Rate_decarb / ∂RPM_rabble");
    expect(sensRabble?.derivativeUnit).toBe("%/min / RPM");
    expect(sensRabble?.derivativeValue).toBe(0.022);

    for (const alias of ["rabbleRpm", "stirringRpm", "rabbleSpeed"]) {
      const sens = computeParameterSensitivity(id, alias, { [alias]: 20 });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBe(0.022);
    }

    // Initial carbon percent sensitivity & aliases
    const sensInitialC = computeParameterSensitivity(id, "initialCarbonPercent", {
      initialCarbonPercent: 3.8,
      puddlingDurationMinutes: 90,
      furnaceTemperatureCelsius: 1350,
    });
    expect(sensInitialC).toBeDefined();
    expect(sensInitialC?.metricName).toBe("Residual Carbon");
    expect(sensInitialC?.derivativeSymbol).toBe("∂[%C_res] / ∂[%C_init]");
    expect(sensInitialC?.derivativeUnit).toBe("% C / % C");
    expect(sensInitialC?.derivativeValue).toBeGreaterThan(0);
    expect(sensInitialC?.derivativeValue).toBeLessThanOrEqual(1.0);

    for (const alias of ["initialCarbon", "carbonPercent", "pigIronCarbon", "c0"]) {
      const sens = computeParameterSensitivity(id, alias, { [alias]: 3.5 });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBeGreaterThan(0);
    }

    // Puddling duration sensitivity & aliases
    const sensDuration = computeParameterSensitivity(id, "puddlingDurationMinutes", {
      puddlingDurationMinutes: 90,
      initialCarbonPercent: 3.8,
      furnaceTemperatureCelsius: 1350,
    });
    expect(sensDuration).toBeDefined();
    expect(sensDuration?.metricName).toBe("Residual Carbon");
    expect(sensDuration?.derivativeSymbol).toBe("∂[%C_res] / ∂t_puddle");
    expect(sensDuration?.derivativeUnit).toBe("% C / min");
    expect(sensDuration?.derivativeValue).toBeLessThan(0);

    for (const alias of ["puddlingTime", "durationMinutes", "puddleDuration", "timeMinutes"]) {
      const sens = computeParameterSensitivity(id, alias, { [alias]: 75 });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBeLessThan(0);
    }

    // Roller passes sensitivity (discrete slag squeeze) & aliases
    const sensPasses = computeParameterSensitivity(id, "rollerPassCount", {
      rollerPassCount: 5,
    });
    expect(sensPasses).toBeDefined();
    expect(sensPasses?.metricName).toBe("Residual Slag Content");
    expect(sensPasses?.derivativeSymbol).toBe("ΔSlag / ΔPass");
    expect(sensPasses?.derivativeUnit).toBe("% / pass");
    expect(sensPasses?.derivativeValue).toBeLessThan(0);

    for (const alias of ["rollerPasses", "passes", "passCount"]) {
      const sens = computeParameterSensitivity(id, alias, { [alias]: 4 });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBeLessThan(0);
    }

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

    // Roasting temperature sensitivity & aliases
    const sensRoast = computeParameterSensitivity(id, "roastTempC", { roastTempC: 750 });
    expect(sensRoast).toBeDefined();
    expect(sensRoast?.metricName).toBe("Potash Carbon Burnout Purity");
    expect(sensRoast?.derivativeSymbol).toBe("∂Purity / ∂T_roast");
    expect(sensRoast?.derivativeUnit).toBe("% / °C");
    expect(sensRoast?.derivativeValue).toBe(0.05);

    for (const alias of [
      "tempC",
      "furnaceTemp",
      "furnaceTempC",
      "roastTemperature",
      "temperatureC",
    ]) {
      const sens = computeParameterSensitivity(id, alias, { [alias]: 800 });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBe(0.05);
    }

    // Leaching water temperature sensitivity & aliases
    const sensWater = computeParameterSensitivity(id, "waterTempC", { waterTempC: 80 });
    expect(sensWater).toBeDefined();
    expect(sensWater?.metricName).toBe("Potassium Carbonate Leaching Solubility");
    expect(sensWater?.derivativeSymbol).toBe("∂C_sat / ∂T_water");
    expect(sensWater?.derivativeUnit).toBe("(g/L) / °C");
    expect(sensWater?.derivativeValue).toBe(4.4);

    for (const alias of ["leachTempC", "leachWaterTemp", "leachWaterTempC", "waterTemperature"]) {
      const sens = computeParameterSensitivity(id, alias, { [alias]: 60 });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBe(4.4);
    }

    // Roasting time sensitivity (carbon combustion rate) & aliases
    const sensTime = computeParameterSensitivity(id, "roastTimeHours", {
      roastTimeHours: 2.5,
      roastTempC: 750,
    });
    expect(sensTime).toBeDefined();
    expect(sensTime?.metricName).toBe("Carbon Combustion");
    expect(sensTime?.derivativeSymbol).toBe("∂η_comb / ∂t_roast");
    expect(sensTime?.derivativeUnit).toBe("% / hr");
    expect(sensTime?.derivativeValue).toBeGreaterThan(0);

    for (const alias of ["roastingTime", "timeHours", "roastTime", "roastHours", "durationHours"]) {
      const sens = computeParameterSensitivity(id, alias, { [alias]: 2.0, roastTempC: 750 });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBeGreaterThan(0);
    }

    // Raw ash batch yield sensitivity & aliases
    const sensBatch = computeParameterSensitivity(id, "ashBatchKg", {
      ashBatchKg: 200,
      roastTempC: 750,
      waterTempC: 80,
    });
    expect(sensBatch).toBeDefined();
    expect(sensBatch?.metricName).toBe("Pearl Ash Yield");
    expect(sensBatch?.derivativeSymbol).toBe("∂m_yield / ∂m_ash");
    expect(sensBatch?.derivativeUnit).toBe("kg / kg");
    expect(sensBatch?.derivativeValue).toBeGreaterThan(0.05);
    expect(sensBatch?.derivativeValue).toBeLessThan(0.2);

    for (const alias of ["batchKg", "ashBatch", "ashMass", "rawAshKg"]) {
      const sens = computeParameterSensitivity(id, alias, { [alias]: 150 });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBeGreaterThan(0);
    }

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

  test("Rillieux Multi-Effect Evaporator derives initial and target Brix sensitivities and Claim 1 gating", () => {
    const id = "us-3237-rillieux-evaporator";

    // Initial Brix sensitivity (negative mass balance derivative: -m_feed / B_out)
    const sensInitialBrix = computeParameterSensitivity(id, "initialBrixDeg", {
      juiceFeedRateKgPerH: 10000,
      initialBrixDeg: 14,
      targetBrixDeg: 65,
    });
    expect(sensInitialBrix).toBeDefined();
    expect(sensInitialBrix?.metricName).toBe("Water Evaporation vs Initial Brix");
    expect(sensInitialBrix?.derivativeSymbol).toBe("∂m_evap / ∂B_in");
    expect(sensInitialBrix?.derivativeUnit).toBe("(kg/h) / °Bx");
    expect(sensInitialBrix?.derivativeValue).toBeCloseTo(-10000 / 65, 4);

    // Target Brix sensitivity (positive mass balance derivative: m_feed · B_in / B_out²)
    const sensTargetBrix = computeParameterSensitivity(id, "targetBrixDeg", {
      juiceFeedRateKgPerH: 10000,
      initialBrixDeg: 14,
      targetBrixDeg: 65,
    });
    expect(sensTargetBrix).toBeDefined();
    expect(sensTargetBrix?.metricName).toBe("Water Evaporation vs Target Syrup Brix");
    expect(sensTargetBrix?.derivativeSymbol).toBe("∂m_evap / ∂B_out");
    expect(sensTargetBrix?.derivativeUnit).toBe("(kg/h) / °Bx");
    expect(sensTargetBrix?.derivativeValue).toBeCloseTo((10000 * 14) / (65 * 65), 4);

    // Numerical finite difference comparison
    const eps = 1e-4;
    const rillEvap = (bin: number, bout: number) =>
      stepRillieuxEvaporator({
        juiceFeedRateKgPerH: 10000,
        initialBrixDeg: bin,
        targetBrixDeg: bout,
      }).totalEvaporationKgPerH;
    const numDiffBin = (rillEvap(14 + eps, 65) - rillEvap(14 - eps, 65)) / (2 * eps);
    const numDiffBout = (rillEvap(14, 65 + eps) - rillEvap(14, 65 - eps)) / (2 * eps);
    expect(sensInitialBrix?.derivativeValue).toBeCloseTo(numDiffBin, 1);
    expect(sensTargetBrix?.derivativeValue).toBeCloseTo(numDiffBout, 1);

    // Aliases
    expect(
      computeParameterSensitivity(id, "brixIn", { feedRate: 10000, brixIn: 14, brixOut: 65 }),
    ).toEqual(sensInitialBrix);
    expect(
      computeParameterSensitivity(id, "brixOut", { feedRate: 10000, brixIn: 14, brixOut: 65 }),
    ).toEqual(sensTargetBrix);

    // Claim 1 gating
    const gatedFeed = computeParameterSensitivity(id, "juiceFeedRateKgPerH", {
      juiceFeedRateKgPerH: 10000,
      claim1Active: 0,
    });
    expect(gatedFeed?.derivativeValue).toBe(0);

    const gatedEffects = computeParameterSensitivity(id, "numberOfEffects", {
      numberOfEffects: 3,
      claim1Active: false,
    });
    expect(gatedEffects?.derivativeValue).toBe(0);

    const gatedBrixIn = computeParameterSensitivity(id, "initialBrixDeg", {
      initialBrixDeg: 14,
      claim1Active: 0,
    });
    expect(gatedBrixIn?.derivativeValue).toBe(0);

    const gatedBrixOut = computeParameterSensitivity(id, "targetBrixDeg", {
      targetBrixDeg: 65,
      claim1Active: 0,
    });
    expect(gatedBrixOut?.derivativeValue).toBe(0);

    // Discrete Claim 1 toggle
    const claimToggle = computeParameterSensitivity(id, "claim1Active", {});
    expect(claimToggle?.derivativeValue).toBe(1);
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

    // Shoal water depth sensitivity
    const sensDepth = computeParameterSensitivity(id, "shoalDepth", {
      inflationPct: 75,
      weightTons: 380,
      shoalDepth: 3.5,
    });
    expect(sensDepth).toBeDefined();
    expect(sensDepth?.metricName).toBe("Shoal Keel Clearance Margin");
    expect(sensDepth?.derivativeSymbol).toBe("∂Clearance / ∂d_{shoal}");
    expect(sensDepth?.derivativeUnit).toBe("ft / ft");
    expect(sensDepth?.derivativeValue).toBe(1.0);

    for (const alias of ["depth", "depthFt", "riverShoalDepthFt", "riverDepthFeet"]) {
      const sensAlias = computeParameterSensitivity(id, alias, {
        inflationPct: 75,
        weightTons: 380,
        [alias]: 3.5,
      });
      expect(sensAlias?.derivativeValue).toBe(1.0);
    }

    // Discrete Claim 1 sensitivity
    const sensClaim1 = computeParameterSensitivity(id, "claim1Active", {
      inflationPct: 75,
      weightTons: 380,
      shoalDepth: 3.5,
    });
    expect(sensClaim1).toBeDefined();
    expect(sensClaim1?.metricName).toBe("Hull Draft Shoal Reduction");
    expect(sensClaim1?.derivativeSymbol).toBe("ΔDraft / ΔClaim1");
    expect(sensClaim1?.derivativeValue).toBe(buoy.draftReductionFt);

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
    const h = 1e-4;

    // 1. NG concentration sensitivity
    for (const ng of [55, 75, 80]) {
      const sensNg = computeParameterSensitivity(id, "ngConcentrationPct", {
        ngConcentrationPct: ng,
        capEnergyJoules: 1.2,
      });
      expect(sensNg).toBeDefined();
      expect(sensNg?.metricName).toBe("Detonation Shock Front Velocity");
      expect(sensNg?.derivativeSymbol).toBe("∂v_det / ∂%_NG");
      expect(sensNg?.derivativeUnit).toBe("m/s / %");
      expect(sensNg?.derivativeValue).toBe(80.0);

      // Finite difference check against unrounded detonation velocity
      const fwd = stepNobelDynamite({ ngConcentrationPct: ng + h, capEnergyJoules: 1.2 });
      const bwd = stepNobelDynamite({ ngConcentrationPct: ng - h, capEnergyJoules: 1.2 });
      const numSlope =
        (fwd.detonationVelocityMpsUnrounded - bwd.detonationVelocityMpsUnrounded) / (2 * h);
      expect(sensNg?.derivativeValue).toBeCloseTo(numSlope, 4);
    }

    // NG concentration aliases
    for (const alias of ["ngPercentage", "ngPct", "nitroglycerinRatioPct", "absorption"]) {
      const sens = computeParameterSensitivity(id, alias, { [alias]: 70 });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBe(80.0);
    }

    // Sub-threshold cap energy: no detonation shock wave initiates
    const subThreshold = computeParameterSensitivity(id, "ngConcentrationPct", {
      ngConcentrationPct: 75,
      capEnergyJoules: 0.3,
    });
    expect(subThreshold).toBeDefined();
    expect(subThreshold?.derivativeValue).toBe(0);
    expect(subThreshold?.interpretation).toContain("below the 0.4 J shock-initiation threshold");

    // 2. Blasting cap energy sensitivity
    for (const cap of [0.5, 1.2, 2.5]) {
      const sensCap = computeParameterSensitivity(id, "capEnergyJoules", {
        ngConcentrationPct: 75,
        capEnergyJoules: cap,
      });
      expect(sensCap).toBeDefined();
      expect(sensCap?.metricName).toBe("Blasting Cap Initiation Energy");
      expect(sensCap?.derivativeSymbol).toBe("∂E_det / ∂E_cap");
      expect(sensCap?.derivativeUnit).toBe("J / J");
      expect(sensCap?.derivativeValue).toBe(1.0);
    }

    // Cap energy aliases
    for (const alias of ["capEnergy", "capEnergyJ", "capJoules", "primerEnergy"]) {
      const sens = computeParameterSensitivity(id, alias, { [alias]: 1.5 });
      expect(sens).toBeDefined();
      expect(sens?.derivativeValue).toBe(1.0);
    }

    // Claim 1 gating
    const gatedNg = computeParameterSensitivity(id, "ngConcentrationPct", { claim1Active: false });
    expect(gatedNg).toBeDefined();
    expect(gatedNg?.derivativeValue).toBe(0);
    expect(gatedNg?.interpretation).toContain("Claim 1 withheld");

    const gatedCap = computeParameterSensitivity(id, "capEnergyJoules", { claim1Active: false });
    expect(gatedCap).toBeDefined();
    expect(gatedCap?.derivativeValue).toBe(0);
    expect(gatedCap?.interpretation).toContain("Claim 1 withheld");

    // Invalid bounds
    for (const invalid of [49, 86, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "ngConcentrationPct", { ngConcentrationPct: invalid }),
      ).toBeNull();
    }
    for (const invalid of [0.1, 3.1, Number.NaN]) {
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

    // Motion state sensitivity (isCranking)
    const sensCranking = computeParameterSensitivity(id, "isCranking", {
      crankRpm: 240,
      stitchPitchMm: 3.5,
      loopSlackPct: 65,
    });
    expect(sensCranking).toBeDefined();
    expect(sensCranking?.metricName).toBe("Lockstitch Formation State");
    expect(sensCranking?.derivativeSymbol).toBe("ΔStitches / Δcranking");
    expect(sensCranking?.derivativeValue).toBe(240);
    expect(sensCranking?.derivativeUnit).toBe("stitches/min / state");

    const sensCrankingAlias = computeParameterSensitivity(id, "cranking", {
      crankRpm: 240,
      stitchPitchMm: 3.5,
      loopSlackPct: 65,
    });
    expect(sensCrankingAlias?.derivativeValue).toBe(240);

    // Discrete Claim 1 sensitivity
    const sensHoweClaim1 = computeParameterSensitivity(id, "claim1Active", {
      crankRpm: 240,
      stitchPitchMm: 3.5,
      loopSlackPct: 65,
    });
    expect(sensHoweClaim1).toBeDefined();
    expect(sensHoweClaim1?.metricName).toBe("Lockstitch Formation Rate");
    expect(sensHoweClaim1?.derivativeSymbol).toBe("ΔStitches / ΔClaim1");
    expect(sensHoweClaim1?.derivativeValue).toBe(240);

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
    for (const [canonical, alias] of [
      ["currentAmperes", "current"],
      ["currentAmperes", "amperes"],
      ["currentAmperes", "currentA"],
      ["bathTemperatureCelsius", "tempC"],
      ["bathTemperatureCelsius", "bathTemp"],
      ["bathTemperatureCelsius", "bathTempC"],
      ["aluminaConcentrationPct", "aluminaPct"],
      ["aluminaConcentrationPct", "aluminaConcentration"],
      ["aluminaConcentrationPct", "alumina"],
    ]) {
      expect(
        computeParameterSensitivity(id, alias, {
          ...hotLean,
          [alias]: (hotLean as any)[canonical],
        }),
      ).toEqual(computeParameterSensitivity(id, canonical, hotLean));
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
    // blastAirPressure and engineRpm are now fully admitted continuous sensitivities
    expect(computeParameterSensitivity(id, "blastAirPressure", {})).not.toBeNull();
    expect(computeParameterSensitivity(id, "engineRpm", {})).not.toBeNull();
    expect(computeParameterSensitivity(id, "nonExistentControl", {})).toBeNull();
  });

  test("Diesel derives blast air pressure, engine RPM sensitivities, and Claim 1 gating", () => {
    const id = "us-542846-diesel-engine";

    // Blast air pressure sensitivity (1.0 bar/bar)
    const sensBlast = computeParameterSensitivity(id, "blastAirPressure", {
      compRatio: 18,
      blastAirPressure: 65,
      cutoffRatio: 1.6,
      engineRpm: 150,
    });
    expect(sensBlast).toBeDefined();
    expect(sensBlast?.metricName).toBe("Blast Injection Pressure Margin");
    expect(sensBlast?.derivativeSymbol).toBe("∂ΔP_inj / ∂P_blast");
    expect(sensBlast?.derivativeUnit).toBe("bar / bar");
    expect(sensBlast?.derivativeValue).toBe(1.0);

    // Engine RPM angular velocity sensitivity (π/30 rad·s⁻¹/rpm)
    const sensRpm = computeParameterSensitivity(id, "engineRpm", {
      compRatio: 18,
      blastAirPressure: 65,
      cutoffRatio: 1.6,
      engineRpm: 150,
    });
    expect(sensRpm).toBeDefined();
    expect(sensRpm?.metricName).toBe("Crankshaft Angular Velocity");
    expect(sensRpm?.derivativeSymbol).toBe("∂ω / ∂RPM");
    expect(sensRpm?.derivativeUnit).toBe("rad·s⁻¹ / rpm");
    expect(sensRpm?.derivativeValue).toBeCloseTo(Math.PI / 30, 5);

    // Aliases
    expect(computeParameterSensitivity(id, "blastPressure", { blastPressure: 65 })).toEqual(
      sensBlast,
    );
    expect(computeParameterSensitivity(id, "rpm", { rpm: 150 })).toEqual(sensRpm);

    // Claim 1 gating
    const gatedCr = computeParameterSensitivity(id, "compRatio", {
      compRatio: 18,
      claim1Active: 0,
    });
    expect(gatedCr?.derivativeValue).toBe(0);

    const gatedCutoff = computeParameterSensitivity(id, "cutoffRatio", {
      cutoffRatio: 1.6,
      claim1Active: false,
    });
    expect(gatedCutoff?.derivativeValue).toBe(0);

    const gatedBlast = computeParameterSensitivity(id, "blastAirPressure", {
      blastAirPressure: 65,
      claim1Active: 0,
    });
    expect(gatedBlast?.derivativeValue).toBe(0);

    const gatedRpm = computeParameterSensitivity(id, "engineRpm", {
      engineRpm: 150,
      claim1Active: 0,
    });
    expect(gatedRpm?.derivativeValue).toBe(0);

    // Discrete Claim 1 toggle
    const claimToggle = computeParameterSensitivity(id, "claim1Active", {});
    expect(claimToggle?.derivativeValue).toBe(1);
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
        expect(computeParameterSensitivity(id, "speedRpm", params)).toEqual(hpSens);
      }
    }

    // Claim 1 Stratified Charge Sensitivity
    const claimSens = computeParameterSensitivity(id, "claim1ChargeGradingPresent", {});
    expect(claimSens).toBeDefined();
    expect(claimSens?.metricName).toBe("Claim 1 Charge Stratification");
    expect(claimSens?.derivativeSymbol).toBe("Δη / ΔClaim1");
    expect(claimSens?.derivativeValue).toBe(0);
    expect(claimSens?.derivativeUnit).toBe("efficiency / state");
    expect(claimSens?.interpretation).toContain("Claim 1");
    for (const key of ["chargeGrading", "claim1", "claim1Active"]) {
      const aliasClaim = computeParameterSensitivity(id, key, {});
      expect(aliasClaim?.derivativeValue).toBe(claimSens?.derivativeValue);
    }

    // Claim 1 gating: withholding charge grading zeros efficiency and power sensitivities
    const gatedCr = computeParameterSensitivity(id, "compressionRatio", {
      claim1Active: false,
    });
    expect(gatedCr?.derivativeValue).toBe(0);
    expect(gatedCr?.interpretation).toContain("Claim 1");

    const gatedRpm = computeParameterSensitivity(id, "engineRpm", {
      claim1ChargeGradingPresent: false,
    });
    expect(gatedRpm?.derivativeValue).toBe(0);
    expect(gatedRpm?.interpretation).toContain("Claim 1");

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

    // Catalyst percentage sensitivity
    const sensCat = computeParameterSensitivity(id, "catalystPct", {
      curingTempC: 150,
      autoclavePressurePsi: 75,
      catalystPct: 1.5,
      curingTimeMin: 60,
    });
    expect(sensCat).toBeDefined();
    expect(sensCat?.metricName).toBe("Catalytic Condensation Acceleration");
    expect(sensCat?.derivativeSymbol).toBe("∂k_crosslink / ∂catalyst");
    expect(sensCat?.derivativeUnit).toBe("min⁻¹ / %");

    // Central finite difference verification for catalyst
    const hCat = 1e-4;
    const fCatPlus = stepBaekelandBakelite(150, 75, 1.5 + hCat, 60).kRateUnrounded;
    const fCatMinus = stepBaekelandBakelite(150, 75, 1.5 - hCat, 60).kRateUnrounded;
    const numDerivCat = (fCatPlus - fCatMinus) / (2 * hCat);
    expect(sensCat?.derivativeValue).toBeCloseTo(numDerivCat, 4);

    // Claim 1 gating
    const claim1Off = computeParameterSensitivity(id, "autoclavePressurePsi", {
      curingTempC: 150,
      autoclavePressurePsi: 75,
      claim1Active: false,
    });
    expect(claim1Off?.derivativeValue).toBe(0);
    expect(claim1Off?.interpretation).toContain("Claim 1");

    const claim1OffCat = computeParameterSensitivity(id, "catalystPct", {
      curingTempC: 150,
      autoclavePressurePsi: 75,
      catalystPct: 1.5,
      claim1Active: false,
    });
    expect(claim1OffCat?.derivativeValue).toBe(0);
    expect(claim1OffCat?.interpretation).toContain("Claim 1");

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

    const nominalCat = sensCat?.derivativeValue;
    for (const key of ["catalyst", "catPct", "catalystConcentration", "catalystPercent"]) {
      expect(
        computeParameterSensitivity(id, key, {
          curingTempC: 150,
          autoclavePressurePsi: 75,
          catalystPct: 1.5,
          curingTimeMin: 60,
        })?.derivativeValue,
      ).toBe(nominalCat);
    }

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

  test("Goddard Rocket derives L/D ratio margin, spin angular velocity, staging travel, and interlock sensitivities", () => {
    const id = "us-1102653-goddard-rocket";
    const nominal = {
      tubeLengthRatio: 4.5,
      primarySpinRpm: 120,
      gyroSpinRpm: 6000,
      auxiliaryReleaseFraction: 0.35,
      primaryChargeConsumed: 0.8,
      gyroEnabled: 1,
    };

    // 1. Tube length-to-diameter ratio
    const sensRatio = computeParameterSensitivity(id, "tubeLengthRatio", nominal);
    expect(sensRatio).toBeDefined();
    expect(sensRatio?.metricName).toBe("Claim 2 Ratio Margin");
    expect(sensRatio?.derivativeSymbol).toBe("∂(L/D - 3) / ∂(L/D)");
    expect(sensRatio?.derivativeUnit).toBe("ratio / ratio");
    expect(sensRatio?.derivativeValue).toBe(1);
    for (const alias of ["ratio", "ldRatio", "aspectRatio"]) {
      expect(computeParameterSensitivity(id, alias, nominal)?.derivativeValue).toBe(1);
    }

    // 2. Primary rocket spin angular velocity
    const sensSpin = computeParameterSensitivity(id, "primarySpinRpm", nominal);
    expect(sensSpin).toBeDefined();
    expect(sensSpin?.metricName).toBe("Primary Angular Velocity");
    expect(sensSpin?.derivativeSymbol).toBe("∂ω / ∂N");
    expect(sensSpin?.derivativeUnit).toBe("rad/s / rpm");
    expect(sensSpin?.derivativeValue).toBeCloseTo((2 * Math.PI) / 60, 5);
    for (const alias of ["primarySpin", "spinRpm", "primaryRpm"]) {
      expect(computeParameterSensitivity(id, alias, nominal)?.derivativeValue).toBe(
        sensSpin?.derivativeValue,
      );
    }

    // 3. Gyroscope spin angular velocity
    const sensGyroSpin = computeParameterSensitivity(id, "gyroSpinRpm", nominal);
    expect(sensGyroSpin).toBeDefined();
    expect(sensGyroSpin?.metricName).toBe("Gyroscope Angular Velocity");
    expect(sensGyroSpin?.derivativeSymbol).toBe("∂ω / ∂N");
    expect(sensGyroSpin?.derivativeUnit).toBe("rad/s / rpm");
    expect(sensGyroSpin?.derivativeValue).toBeCloseTo((2 * Math.PI) / 60, 5);
    for (const alias of ["gyroSpin", "gyroRpm"]) {
      expect(computeParameterSensitivity(id, alias, nominal)?.derivativeValue).toBe(
        sensGyroSpin?.derivativeValue,
      );
    }

    // 4. Auxiliary rocket staging travel
    const sensTravel = computeParameterSensitivity(id, "auxiliaryReleaseFraction", nominal);
    expect(sensTravel).toBeDefined();
    expect(sensTravel?.metricName).toBe("Auxiliary Rocket Staging Travel");
    expect(sensTravel?.derivativeSymbol).toBe("∂(s/L) / ∂f_release");
    expect(sensTravel?.derivativeUnit).toBe("fraction / fraction");
    expect(sensTravel?.derivativeValue).toBe(1.0);
    for (const alias of ["releaseFraction", "auxRelease", "stagingFraction"]) {
      expect(computeParameterSensitivity(id, alias, nominal)?.derivativeValue).toBe(1.0);
    }

    // 5. Primary charge consumption interlock
    const sensChargeConsumed = computeParameterSensitivity(id, "primaryChargeConsumed", nominal);
    expect(sensChargeConsumed).toBeDefined();
    expect(sensChargeConsumed?.metricName).toBe("Claim 1 Staging Firing Interlock");
    expect(sensChargeConsumed?.derivativeSymbol).toBe("ΔState / ΔCharge");
    expect(sensChargeConsumed?.derivativeValue).toBe(0);
    expect(sensChargeConsumed?.interpretation).toContain("unlocked");

    const sensChargeUnconsumed = computeParameterSensitivity(id, "primaryChargeConsumed", {
      ...nominal,
      primaryChargeConsumed: 0.2,
    });
    expect(sensChargeUnconsumed?.interpretation).toContain("locked out");
    for (const alias of ["chargeConsumed", "primaryConsumed"]) {
      expect(computeParameterSensitivity(id, alias, nominal)?.derivativeValue).toBe(0);
    }

    // 6. Gyroscopic stabilization state
    const sensGyroOn = computeParameterSensitivity(id, "gyroEnabled", nominal);
    expect(sensGyroOn).toBeDefined();
    expect(sensGyroOn?.metricName).toBe("Claim 7 Gyroscopic Stabilization State");
    expect(sensGyroOn?.derivativeSymbol).toBe("ΔState / ΔGyro");
    expect(sensGyroOn?.derivativeValue).toBe(0);
    expect(sensGyroOn?.interpretation).toContain("isolates instrument");

    const sensGyroOff = computeParameterSensitivity(id, "gyroEnabled", {
      ...nominal,
      gyroEnabled: 0,
    });
    expect(sensGyroOff?.interpretation).toContain("rotates with primary");
    for (const alias of ["gyro", "hasGyro", "gyroActive"]) {
      expect(computeParameterSensitivity(id, alias, nominal)?.derivativeValue).toBe(0);
    }

    // Bounds checking
    for (const invalid of [1.4, 6.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "tubeLengthRatio", { tubeLengthRatio: invalid }),
      ).toBeNull();
    }
    for (const invalid of [-1, 301, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "primarySpinRpm", { primarySpinRpm: invalid }),
      ).toBeNull();
    }
    for (const invalid of [-1, 12001, Number.NaN]) {
      expect(computeParameterSensitivity(id, "gyroSpinRpm", { gyroSpinRpm: invalid })).toBeNull();
    }
    for (const invalid of [-0.1, 1.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "auxiliaryReleaseFraction", {
          auxiliaryReleaseFraction: invalid,
        }),
      ).toBeNull();
    }
    for (const invalid of [-0.1, 1.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "primaryChargeConsumed", {
          primaryChargeConsumed: invalid,
        }),
      ).toBeNull();
    }
    for (const invalid of [-0.1, 1.1, Number.NaN]) {
      expect(computeParameterSensitivity(id, "gyroEnabled", { gyroEnabled: invalid })).toBeNull();
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

    // Normalized teaching controls
    const sensPump = computeParameterSensitivity(id, "pumpExcitationPct", {
      pumpExcitationPct: 70,
    });
    expect(sensPump).toBeDefined();
    expect(sensPump?.metricName).toBe("Illustrative Optical Pump Excitation");
    expect(sensPump?.derivativeSymbol).toBe("∂P_pump / ∂u_pump");
    expect(sensPump?.derivativeUnit).toBe("% displayed / % reader control");
    expect(sensPump?.derivativeValue).toBe(1.0);

    const sensAperture = computeParameterSensitivity(id, "modeApertureOpenPct", {
      modeApertureOpenPct: 50,
    });
    expect(sensAperture).toBeDefined();
    expect(sensAperture?.metricName).toBe("Illustrative Mode Selection Aperture");
    expect(sensAperture?.derivativeSymbol).toBe("∂A_mode / ∂u_aperture");
    expect(sensAperture?.derivativeUnit).toBe("% open / % reader control");
    expect(sensAperture?.derivativeValue).toBe(1.0);

    const sensField = computeParameterSensitivity(id, "modulationFieldPct", {
      modulationFieldPct: 35,
    });
    expect(sensField).toBeDefined();
    expect(sensField?.metricName).toBe("Illustrative Zeeman Modulation Field");
    expect(sensField?.derivativeSymbol).toBe("∂B_Zeeman / ∂u_field");
    expect(sensField?.derivativeUnit).toBe("% field / % reader control");
    expect(sensField?.derivativeValue).toBe(1.0);

    const sensClaim1 = computeParameterSensitivity(id, "claim1PathPresent", {
      claim1PathPresent: 1,
    });
    expect(sensClaim1).toBeDefined();
    expect(sensClaim1?.metricName).toBe("Claim 1 Maser Communications Path");
    expect(sensClaim1?.derivativeSymbol).toBe("ΔState / ΔClaim1");
    expect(sensClaim1?.derivativeValue).toBe(0);

    // Claim 1 gating
    const sensPumpGated = computeParameterSensitivity(id, "pumpExcitationPct", {
      pumpExcitationPct: 70,
      claim1PathPresent: 0,
    });
    expect(sensPumpGated?.derivativeValue).toBe(0);

    // Aliases
    for (const alias of [
      "cavityLength",
      "lengthCm",
      "chamberLengthCm",
      "length",
      "chamberLength",
    ]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 10 })?.derivativeValue).toBe(1.0);
    }
    for (const alias of [
      "chamberDiameter",
      "diameterCm",
      "diameter",
      "tubeDiameterCm",
      "boreDiameterCm",
    ]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 1 })?.derivativeValue).toBe(-10.0);
    }
    for (const alias of [
      "endReflectivity",
      "reflectivityPct",
      "reflectivity",
      "mirrorReflectivityPct",
      "endMirrorReflectivity",
    ]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 97 })?.derivativeValue).toBeCloseTo(
        1.94,
        2,
      );
    }
    for (const alias of ["pumpExcitation", "excitationPct", "pumpPowerPct", "pump", "excitation"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 70 })?.derivativeValue).toBe(1.0);
    }
    for (const alias of [
      "modeAperture",
      "apertureOpenPct",
      "aperturePct",
      "aperture",
      "modeSelector",
    ]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 50 })?.derivativeValue).toBe(1.0);
    }
    for (const alias of [
      "modulationField",
      "zeemanFieldPct",
      "zeemanField",
      "modulation",
      "fieldPct",
    ]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 35 })?.derivativeValue).toBe(1.0);
    }
    for (const alias of ["claim1", "claim1Path", "communicationsPath", "pathPresent"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 1 })?.derivativeValue).toBe(0);
    }

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
    for (const invalid of [-1, 101, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "pumpExcitationPct", { pumpExcitationPct: invalid }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "modeApertureOpenPct", { modeApertureOpenPct: invalid }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "modulationFieldPct", { modulationFieldPct: invalid }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "claim1PathPresent", { claim1PathPresent: invalid }),
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

    // Flash pulse duration threshold pumping energy sensitivity
    const sensFlash = computeParameterSensitivity(id, "flashDurationMs", {
      pumpEnergyJoules: 150,
      flashDurationMs: 1.0,
      rodLengthCm: 5.0,
      outputMirrorReflectivity: 0.92,
      crystalTemperatureKelvin: 300,
    });
    expect(sensFlash).toBeDefined();
    expect(sensFlash?.metricName).toBe("Optical Pumping Threshold Duration Sensitivity");
    expect(sensFlash?.derivativeSymbol).toBe("∂E_th / ∂t_flash");
    expect(sensFlash?.derivativeUnit).toBe("J / ms");
    expect(sensFlash?.derivativeValue).toBeCloseTo(-47.86, 1);

    // Flash duration alias test
    const sensFlashAlias = computeParameterSensitivity(id, "flashDuration", {
      flashDuration: 1.0,
    });
    expect(sensFlashAlias?.derivativeValue).toBeCloseTo(-47.86, 1);

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

  test("Baer Odyssey TV gaming derives spot delay, spin deflection, ball speed, and RF channel sensitivities", () => {
    const id = "us-3728480-baer-odyssey";

    // Player 1 and Player 2 Horizontal Delay
    const sensP1X = computeParameterSensitivity(id, "player1PotX", { player1PotX: 0.25 });
    expect(sensP1X).toBeDefined();
    expect(sensP1X?.metricName).toBe("Horizontal Spot Delay Time");
    expect(sensP1X?.derivativeSymbol).toBe("∂τ_H / ∂R_pot");
    expect(sensP1X?.derivativeValue).toBe(48.0);
    expect(sensP1X?.derivativeUnit).toBe("µs / norm_pot");

    const sensP2X = computeParameterSensitivity(id, "player2PotX", { player2PotX: 0.75 });
    expect(sensP2X?.derivativeValue).toBe(48.0);

    // Player 1 and Player 2 Vertical Delay
    const sensP1Y = computeParameterSensitivity(id, "player1PotY", { player1PotY: 0.5 });
    expect(sensP1Y).toBeDefined();
    expect(sensP1Y?.metricName).toBe("Vertical Field Delay Time");
    expect(sensP1Y?.derivativeSymbol).toBe("∂τ_V / ∂R_pot");
    expect(sensP1Y?.derivativeValue).toBe(14.0);
    expect(sensP1Y?.derivativeUnit).toBe("ms / norm_pot");

    const sensP2Y = computeParameterSensitivity(id, "player2PotY", { player2PotY: 0.5 });
    expect(sensP2Y?.derivativeValue).toBe(14.0);

    // English spin deflection
    const sensEnglish = computeParameterSensitivity(id, "englishControl", { englishControl: 0.0 });
    expect(sensEnglish).toBeDefined();
    expect(sensEnglish?.metricName).toBe("English Spin Deflection Velocity Sensitivity");
    expect(sensEnglish?.derivativeSymbol).toBe("∂v_y / ∂english");
    expect(sensEnglish?.derivativeValue).toBe(0.25);
    expect(sensEnglish?.derivativeUnit).toBe("(units/s) / spin");

    // Ball speed multiplier
    const sensSpeed = computeParameterSensitivity(id, "ballSpeedMultiplier", {
      ballSpeedMultiplier: 1.0,
    });
    expect(sensSpeed).toBeDefined();
    expect(sensSpeed?.metricName).toBe("Ball Horizontal Velocity Multiplier Sensitivity");
    expect(sensSpeed?.derivativeSymbol).toBe("∂v_ball / ∂multiplier");
    expect(sensSpeed?.derivativeValue).toBe(0.45);
    expect(sensSpeed?.derivativeUnit).toBe("(units/s) / x");

    // VHF RF Channel step
    const sensCh = computeParameterSensitivity(id, "rfChannel", { rfChannel: 3 });
    expect(sensCh).toBeDefined();
    expect(sensCh?.metricName).toBe("VHF RF Picture Carrier Channel Step");
    expect(sensCh?.derivativeSymbol).toBe("Δf_rf / Δch");
    expect(sensCh?.derivativeValue).toBe(6.0);
    expect(sensCh?.derivativeUnit).toBe("MHz / ch");

    // Chroma phase delay
    const sensChroma = computeParameterSensitivity(id, "chromaPhaseDeg", { chromaPhaseDeg: 45 });
    expect(sensChroma).toBeDefined();
    expect(sensChroma?.metricName).toBe("Chroma Subcarrier Phase Delay Sensitivity");
    expect(sensChroma?.derivativeSymbol).toBe("∂τ_chroma / ∂θ");
    expect(sensChroma?.derivativeValue).toBe(0.78);
    expect(sensChroma?.derivativeUnit).toBe("ns / deg");

    // Aliases
    expect(computeParameterSensitivity(id, "p1X", { p1X: 0.3 })?.derivativeValue).toBe(48.0);
    expect(computeParameterSensitivity(id, "knob17", { knob17: 0.3 })?.derivativeValue).toBe(48.0);
    expect(computeParameterSensitivity(id, "p1Y", { p1Y: 0.4 })?.derivativeValue).toBe(14.0);
    expect(computeParameterSensitivity(id, "knob16", { knob16: 0.4 })?.derivativeValue).toBe(14.0);
    expect(computeParameterSensitivity(id, "spin", { spin: 0.2 })?.derivativeValue).toBe(0.25);
    expect(computeParameterSensitivity(id, "ballSpeed", { ballSpeed: 1.5 })?.derivativeValue).toBe(
      0.45,
    );
    expect(computeParameterSensitivity(id, "channel", { channel: 4 })?.derivativeValue).toBe(6.0);
    expect(computeParameterSensitivity(id, "chroma", { chroma: 90 })?.derivativeValue).toBe(0.78);

    // Bounds checking
    for (const invalid of [0.04, 0.96, Number.NaN]) {
      expect(computeParameterSensitivity(id, "player1PotX", { player1PotX: invalid })).toBeNull();
      expect(computeParameterSensitivity(id, "player1PotY", { player1PotY: invalid })).toBeNull();
      expect(computeParameterSensitivity(id, "player2PotX", { player2PotX: invalid })).toBeNull();
      expect(computeParameterSensitivity(id, "player2PotY", { player2PotY: invalid })).toBeNull();
    }
    for (const invalid of [-1.01, 1.01, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "englishControl", { englishControl: invalid }),
      ).toBeNull();
    }
    for (const invalid of [0.19, 3.01, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "ballSpeedMultiplier", { ballSpeedMultiplier: invalid }),
      ).toBeNull();
    }
    for (const invalid of [2, 5, Number.NaN]) {
      expect(computeParameterSensitivity(id, "rfChannel", { rfChannel: invalid })).toBeNull();
    }
    for (const invalid of [-1, 181, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "chromaPhaseDeg", { chromaPhaseDeg: invalid }),
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

  test("Bell telephone derives battery voltage, liquid conductivity sensitivities, and Claim 1 gating", () => {
    const id = "us-174465-bell-telephone";

    // Battery voltage sensitivity (25 · σ mA/V)
    const sensVolt = computeParameterSensitivity(id, "batteryVoltage", {
      batteryVoltage: 6,
      liquidConductivity: 1.2,
    });
    expect(sensVolt).toBeDefined();
    expect(sensVolt?.metricName).toBe("Baseline Loop Current");
    expect(sensVolt?.derivativeSymbol).toBe("∂I_base / ∂V");
    expect(sensVolt?.derivativeUnit).toBe("mA / V");
    expect(sensVolt?.derivativeValue).toBeCloseTo(25 * 1.2, 4);

    // Liquid conductivity sensitivity (25 · V mA/(S/m))
    const sensCond = computeParameterSensitivity(id, "liquidConductivity", {
      batteryVoltage: 6,
      liquidConductivity: 1.2,
    });
    expect(sensCond).toBeDefined();
    expect(sensCond?.metricName).toBe("Baseline Loop Current vs Conductivity");
    expect(sensCond?.derivativeSymbol).toBe("∂I_base / ∂σ");
    expect(sensCond?.derivativeUnit).toBe("mA / (S/m)");
    expect(sensCond?.derivativeValue).toBeCloseTo(25 * 6, 4);

    // Aliases
    expect(computeParameterSensitivity(id, "volts", { volts: 6, sigma: 1.2 })).toEqual(sensVolt);
    expect(computeParameterSensitivity(id, "sigma", { volts: 6, sigma: 1.2 })).toEqual(sensCond);

    // Claim 1 gating
    const gatedSpl = computeParameterSensitivity(id, "voiceAmplitude", {
      voiceAmplitude: 75,
      claim1Active: 0,
    });
    expect(gatedSpl?.derivativeValue).toBe(0);

    const gatedFreq = computeParameterSensitivity(id, "acousticFrequencyHz", {
      acousticFrequencyHz: 440,
      claim1Active: false,
    });
    expect(gatedFreq?.derivativeValue).toBe(0);

    const gatedGap = computeParameterSensitivity(id, "airGap", {
      airGap: 0.35,
      claim1Active: 0,
    });
    expect(gatedGap?.derivativeValue).toBe(0);

    const gatedVolt = computeParameterSensitivity(id, "batteryVoltage", {
      batteryVoltage: 6,
      claim1Active: 0,
    });
    expect(gatedVolt?.derivativeValue).toBe(0);

    const gatedCond = computeParameterSensitivity(id, "liquidConductivity", {
      liquidConductivity: 1.2,
      claim1Active: 0,
    });
    expect(gatedCond?.derivativeValue).toBe(0);

    // Discrete Claim 1 toggle
    const claimToggle = computeParameterSensitivity(id, "claim1Active", {});
    expect(claimToggle?.derivativeValue).toBe(1);
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

    for (const key of ["solarIrradiance", "irradiance", "beamPowerWatts", "beamPower"]) {
      const aliasSens = computeParameterSensitivity(id, key, { [key]: 950 });
      expect(aliasSens?.derivativeValue).toBe(sensIrr?.derivativeValue);
    }

    const sensSpl = computeParameterSensitivity(id, "voiceSplDb", {
      voiceSplDb: 75,
    });
    expect(sensSpl).toBeDefined();
    expect(sensSpl?.metricName).toBe("Diaphragm Optical Beam Divergence Modulation");
    expect(sensSpl?.derivativeSymbol).toBe("∂θ_beam / ∂SPL");
    expect(sensSpl?.derivativeValue).toBe(0.08);
    expect(sensSpl?.derivativeUnit).toBe("mrad / dB");

    for (const key of ["splDb", "spl", "voiceVolume", "voiceLevelDb", "soundLevelDb"]) {
      const aliasSens = computeParameterSensitivity(id, key, { [key]: 75 });
      expect(aliasSens?.derivativeValue).toBe(sensSpl?.derivativeValue);
    }

    // Transmission distance geometric divergence
    const sensDist = computeParameterSensitivity(id, "transmissionDistanceM", {
      transmissionDistanceM: 213,
    });
    expect(sensDist).toBeDefined();
    expect(sensDist?.metricName).toBe("Optical Beam Geometric Divergence Spread");
    expect(sensDist?.derivativeSymbol).toBe("∂D_spot / ∂d");
    expect(sensDist?.derivativeValue).toBe(0.08);
    expect(sensDist?.derivativeUnit).toBe("mm / m");

    for (const key of ["distanceM", "distance", "rangeM", "transmissionDistance"]) {
      const aliasSens = computeParameterSensitivity(id, key, { [key]: 213 });
      expect(aliasSens?.derivativeValue).toBe(sensDist?.derivativeValue);
    }

    // Collector diameter aperture area scaling
    const sensDia = computeParameterSensitivity(id, "collectorDiameterM", {
      collectorDiameterM: 0.5,
    });
    expect(sensDia).toBeDefined();
    expect(sensDia?.metricName).toBe("Parabolic Collector Aperture Area Rate");
    expect(sensDia?.derivativeSymbol).toBe("∂A_col / ∂D_col");
    expect(sensDia?.derivativeValue).toBeCloseTo((Math.PI / 2) * 0.5, 3);
    expect(sensDia?.derivativeUnit).toBe("m² / m");

    for (const key of [
      "collectorDiameter",
      "apertureDiameterM",
      "apertureDiameter",
      "collectorDiam",
    ]) {
      const aliasSens = computeParameterSensitivity(id, key, { [key]: 0.5 });
      expect(aliasSens?.derivativeValue).toBe(sensDia?.derivativeValue);
    }

    // Claim 1 Beam Modulation State & gating
    const sensClaim = computeParameterSensitivity(id, "claim1Active", {});
    expect(sensClaim).toBeDefined();
    expect(sensClaim?.metricName).toBe("Claim 1 Beam Modulation State");
    expect(sensClaim?.derivativeSymbol).toBe("ΔState / ΔClaim1");
    expect(sensClaim?.derivativeValue).toBe(0);
    expect(sensClaim?.derivativeUnit).toBe("state");

    const aliasClaim = computeParameterSensitivity(id, "claim1", {});
    expect(aliasClaim?.derivativeValue).toBe(sensClaim?.derivativeValue);

    const gatedSpl = computeParameterSensitivity(id, "voiceSplDb", {
      voiceSplDb: 75,
      claim1Active: false,
    });
    expect(gatedSpl?.derivativeValue).toBe(0);
    expect(gatedSpl?.interpretation).toContain("Voice acoustic beam modulation is withheld");

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

  test("Marconi radio derives mast scale, spark gap, and voltage sensitivities with alias support", () => {
    const id = "us-586193-marconi-radio";
    const sensGap = computeParameterSensitivity(id, "sparkGapMm", { sparkGapMm: 10 });
    expect(sensGap).toBeDefined();
    expect(sensGap?.metricName).toBe("Spark Gap Studio Half-Span");
    expect(sensGap?.derivativeSymbol).toBe("∂s_{gap} / ∂d");
    expect(sensGap?.derivativeUnit).toBe("span / mm");
    expect(sensGap?.derivativeValue).toBeCloseTo(0.18 / 23, 5);

    // Alias test
    const sensGapAlias = computeParameterSensitivity(id, "gap", { gap: 10 });
    expect(sensGapAlias?.derivativeValue).toBeCloseTo(0.18 / 23, 5);

    const sensMast = computeParameterSensitivity(id, "aerialHeight", { aerialHeight: 88 });
    expect(sensMast).toBeDefined();
    expect(sensMast?.metricName).toBe("Mast Studio Scale");
    expect(sensMast?.derivativeSymbol).toBe("∂S_{mast} / ∂h");
    expect(sensMast?.derivativeUnit).toBe("scale / m");
    expect(sensMast?.derivativeValue).toBeCloseTo(1 / 88, 5);

    // Mast height alias
    const sensMastAlias = computeParameterSensitivity(id, "mastHeightM", { mastHeightM: 88 });
    expect(sensMastAlias?.derivativeValue).toBeCloseTo(1 / 88, 5);

    const sensKv = computeParameterSensitivity(id, "sparkVoltage", { sparkVoltage: 28 });
    expect(sensKv).toBeDefined();
    expect(sensKv?.metricName).toBe("Induction Coil Display Potential");
    expect(sensKv?.derivativeSymbol).toBe("∂V_{coil} / ∂V_{spark}");
    expect(sensKv?.derivativeUnit).toBe("kV / kV");
    expect(sensKv?.derivativeValue).toBe(1.0);

    // Bounds checking: refuse out-of-range values
    expect(computeParameterSensitivity(id, "aerialHeight", { aerialHeight: 5 })).toBeNull(); // min 10
    expect(computeParameterSensitivity(id, "aerialHeight", { aerialHeight: 150 })).toBeNull(); // max 120
    expect(computeParameterSensitivity(id, "sparkGapMm", { sparkGapMm: 1 })).toBeNull(); // min 2
    expect(computeParameterSensitivity(id, "sparkGapMm", { sparkGapMm: 30 })).toBeNull(); // max 25
    expect(computeParameterSensitivity(id, "sparkVoltage", { sparkVoltage: 2 })).toBeNull(); // min 5
    expect(computeParameterSensitivity(id, "sparkVoltage", { sparkVoltage: 60 })).toBeNull(); // max 50
    expect(
      computeParameterSensitivity(id, "aerialHeight", { aerialHeight: Number.NaN }),
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

    // Rudder steeringAngle alias
    const sensSteering = computeParameterSensitivity(id, "steeringAngle", {
      steeringAngle: 15,
      rfFrequency: 150,
    });
    expect(sensSteering?.derivativeValue).toBe(
      computeParameterSensitivity(id, "rudderAngle", { rudderAngle: 15, rfFrequency: 150 })
        ?.derivativeValue,
    );

    // Pulse count stepping sensitivity (1 pos / pulse)
    for (const pulses of [0, 3, 7, 15]) {
      const sensPulse = computeParameterSensitivity(id, "pulseCount", { pulseCount: pulses });
      expect(sensPulse).toBeDefined();
      expect(sensPulse?.metricName).toBe("Escapement Contact Disk Stepping");
      expect(sensPulse?.derivativeSymbol).toBe("ΔIndex / ΔPulse");
      expect(sensPulse?.derivativeValue).toBe(1);
      expect(sensPulse?.derivativeUnit).toBe("pos / pulse");

      // Pulse aliases
      for (const alias of ["pulses", "commandPulses", "pulsesCount", "steps"]) {
        const sensAlias = computeParameterSensitivity(id, alias, { [alias]: pulses });
        expect(sensAlias?.derivativeValue).toBe(1);
      }

      // Claim 1 refusal on pulse stepping
      const sensPulseRefused = computeParameterSensitivity(id, "pulseCount", {
        pulseCount: pulses,
        claim1Active: false,
      });
      expect(sensPulseRefused?.derivativeValue).toBe(0);
    }

    // RF carrier frequency resonance passband sensitivity (state / kHz)
    const sensRfTuned = computeParameterSensitivity(id, "rfFrequency", { rfFrequency: 150 });
    expect(sensRfTuned).toBeDefined();
    expect(sensRfTuned?.metricName).toBe("RF Resonance Reception State");
    expect(sensRfTuned?.derivativeSymbol).toBe("∂State / ∂f");
    expect(sensRfTuned?.derivativeValue).toBe(0);
    expect(sensRfTuned?.derivativeUnit).toBe("state / kHz");
    expect(sensRfTuned?.interpretation).toContain("tuned within the 150 ± 5 kHz resonant passband");

    const sensRfDetuned = computeParameterSensitivity(id, "rfFrequency", { rfFrequency: 120 });
    expect(sensRfDetuned?.interpretation).toContain("detuned outside the 150 ± 5 kHz passband");

    // RF frequency aliases
    for (const alias of [
      "transmitterFreqKhz",
      "carrierFreqKhz",
      "freq",
      "frequency",
      "rfFreqKhz",
      "carrierFrequency",
    ]) {
      const sensAlias = computeParameterSensitivity(id, alias, { [alias]: 150 });
      expect(sensAlias?.derivativeValue).toBe(0);
      expect(sensAlias?.metricName).toBe("RF Resonance Reception State");
    }

    // Claim 1 rotary commutator logic sensitivity
    for (const claimKey of [
      "claim1RotaryCommutatorPresent",
      "claim1",
      "claim1Active",
      "commutatorPresent",
      "rotaryCommutator",
    ]) {
      const sensClaim = computeParameterSensitivity(id, claimKey, { [claimKey]: 1 });
      expect(sensClaim).toBeDefined();
      expect(sensClaim?.metricName).toBe("Claim 1 Rotary Commutator Logic");
      expect(sensClaim?.derivativeSymbol).toBe("ΔState / ΔClaim1");
      expect(sensClaim?.derivativeValue).toBe(0);
      expect(sensClaim?.derivativeUnit).toBe("state");
    }

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

    // 5. Claim 1 Common Node Connection sensitivity and aliases
    for (const claimKey of [
      "claim1CommonNodeConnected",
      "claim1",
      "claim1Active",
      "commonNode",
      "earthNode",
      "groundNode",
      "nodeConnected",
    ]) {
      const sensClaim = computeParameterSensitivity(id, claimKey, {
        disturbanceFrequencyHz: 925,
        secondaryLengthMiles: 50,
        [claimKey]: 1,
      });
      expect(sensClaim).toBeDefined();
      expect(sensClaim?.metricName).toBe("Claim 1 Common Node Connection");
      expect(sensClaim?.derivativeSymbol).toBe("ΔState / ΔClaim1");
      expect(sensClaim?.derivativeValue).toBe(0);
      expect(sensClaim?.derivativeUnit).toBe("state");
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

    // Small-Signal Voltage Gain with respect to RF grid signal amplitude
    const sensSignal = computeParameterSensitivity(id, "gridSignalAmplitudeMv", baseParams);
    expect(sensSignal).toBeDefined();
    expect(sensSignal?.metricName).toBe("Small-Signal Voltage Gain");
    expect(sensSignal?.derivativeSymbol).toBe("∂v_out / ∂v_in");
    expect(sensSignal?.derivativeUnit).toBe("mV / mV");
    expect(sensSignal?.derivativeValue).toBe(stepDeForestAudion(baseParams).voltageGain);

    // Aliases
    for (const key of [
      "rfInputMv",
      "rfInput",
      "signalAmplitude",
      "signalAmplitudeMv",
      "inputSignalMv",
      "gridSignalMv",
    ]) {
      expect(computeParameterSensitivity(id, key, baseParams)?.derivativeValue).toBe(
        sensSignal?.derivativeValue,
      );
    }

    // Claim 1 refusal: when grid is absent, small-signal voltage gain is 0
    const sensSignalRefused = computeParameterSensitivity(id, "gridSignalAmplitudeMv", {
      ...baseParams,
      claim1GridPresent: false,
    });
    expect(sensSignalRefused?.derivativeValue).toBe(0);

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

    // Horizontal line sweep angular frequency sensitivity
    const sensHFreq = computeParameterSensitivity(id, "horizontalFreqKhz", baseParams);
    expect(sensHFreq).toBeDefined();
    expect(sensHFreq?.metricName).toBe("Horizontal Line Sweep Angular Frequency");
    expect(sensHFreq?.derivativeSymbol).toBe("∂ω_H / ∂f_H");
    expect(sensHFreq?.derivativeUnit).toBe("rad·s⁻¹ / kHz");
    expect(sensHFreq?.derivativeValue).toBeCloseTo(2000 * Math.PI, 4);

    for (const alias of ["hFreq", "horizontalFreq", "lineFreqKhz", "hScanFreq"]) {
      expect(computeParameterSensitivity(id, alias, baseParams)?.derivativeValue).toBe(
        sensHFreq?.derivativeValue,
      );
    }

    // Vertical frame sweep angular frequency sensitivity
    const sensVFreq = computeParameterSensitivity(id, "verticalFreqHz", baseParams);
    expect(sensVFreq).toBeDefined();
    expect(sensVFreq?.metricName).toBe("Vertical Frame Sweep Angular Frequency");
    expect(sensVFreq?.derivativeSymbol).toBe("∂ω_V / ∂f_V");
    expect(sensVFreq?.derivativeUnit).toBe("rad·s⁻¹ / Hz");
    expect(sensVFreq?.derivativeValue).toBeCloseTo(2 * Math.PI, 5);

    for (const alias of ["vFreq", "verticalFreq", "frameFreqHz", "vScanFreq"]) {
      expect(computeParameterSensitivity(id, alias, baseParams)?.derivativeValue).toBe(
        sensVFreq?.derivativeValue,
      );
    }

    // Raster line pitch fraction sensitivity
    const sensLines = computeParameterSensitivity(id, "scanLines", baseParams);
    expect(sensLines).toBeDefined();
    expect(sensLines?.metricName).toBe("Raster Line Pitch Fraction");
    expect(sensLines?.derivativeSymbol).toBe("∂(Δy/H) / ∂N_lines");
    expect(sensLines?.derivativeUnit).toBe("% / line");
    expect(sensLines?.derivativeValue).toBeCloseTo(-100 / (60 * 60), 5);

    for (const alias of ["lines", "rasterLines", "numLines"]) {
      expect(computeParameterSensitivity(id, alias, baseParams)?.derivativeValue).toBe(
        sensLines?.derivativeValue,
      );
    }

    // Claim 1 refusal: when raster traversal is withheld, derivatives are refused with 0
    const sensLuxRefused = computeParameterSensitivity(id, "lightIntensityLux", {
      ...baseParams,
      claim1ScanPathPresent: false,
    });
    expect(sensLuxRefused?.derivativeValue).toBe(0);
    expect(sensLuxRefused?.derivativeUnit).toBe("refused");

    const sensHRefused = computeParameterSensitivity(id, "horizontalFreqKhz", {
      ...baseParams,
      claim1ScanPathPresent: false,
    });
    expect(sensHRefused?.derivativeValue).toBe(0);
    expect(sensHRefused?.derivativeUnit).toBe("refused");

    const sensVRefused = computeParameterSensitivity(id, "verticalFreqHz", {
      ...baseParams,
      claim1ScanPathPresent: false,
    });
    expect(sensVRefused?.derivativeValue).toBe(0);
    expect(sensVRefused?.derivativeUnit).toBe("refused");

    const sensLinesRefused = computeParameterSensitivity(id, "scanLines", {
      ...baseParams,
      claim1ScanPathPresent: false,
    });
    expect(sensLinesRefused?.derivativeValue).toBe(0);
    expect(sensLinesRefused?.derivativeUnit).toBe("refused");

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

    const sensStations = computeParameterSensitivity(id, "stationCount", {
      stationCount: 8,
    });
    expect(sensStations).toBeDefined();
    expect(sensStations?.metricName).toBe("Contention Channel Efficiency Node Scaling");
    expect(sensStations?.derivativeSymbol).toBe("∂η / ∂N_station");
    expect(sensStations?.derivativeValue).toBe(-0.2);
    expect(sensStations?.derivativeUnit).toBe("% / node");

    const sensPacket = computeParameterSensitivity(id, "packetSizeBytes", {
      packetSizeBytes: 256,
    });
    expect(sensPacket).toBeDefined();
    expect(sensPacket?.metricName).toBe("Packet Frame Size Channel Efficiency");
    expect(sensPacket?.derivativeSymbol).toBe("∂η / ∂S_packet");
    expect(sensPacket?.derivativeValue).toBe(0.013);
    expect(sensPacket?.derivativeUnit).toBe("% / byte");

    const sensCol = computeParameterSensitivity(id, "triggerCollision", {
      triggerCollision: 0,
    });
    expect(sensCol).toBeDefined();
    expect(sensCol?.metricName).toBe("Transceiver Collision Voltage Threshold Superposition");
    expect(sensCol?.derivativeSymbol).toBe("ΔV_bus / Δcollision");
    expect(sensCol?.derivativeValue).toBe(1.0);
    expect(sensCol?.derivativeUnit).toBe("V / event");

    // Aliases
    expect(
      computeParameterSensitivity(id, "cableLength", { cableLength: 300 })?.derivativeValue,
    ).toBe(5.0);
    expect(computeParameterSensitivity(id, "dataRate", { dataRate: 10.0 })?.derivativeValue).toBe(
      -34.0,
    );
    expect(computeParameterSensitivity(id, "load", { load: 1.0 })?.derivativeValue).toBe(-28.5);
    expect(computeParameterSensitivity(id, "stations", { stations: 16 })?.derivativeValue).toBe(
      -0.2,
    );
    expect(
      computeParameterSensitivity(id, "packetSize", { packetSize: 1024 })?.derivativeValue,
    ).toBe(0.013);
    expect(computeParameterSensitivity(id, "collision", { collision: 1 })?.derivativeValue).toBe(
      1.0,
    );

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
    for (const invalid of [-0.1, 1.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "triggerCollision", { triggerCollision: invalid }),
      ).toBeNull();
    }
  });

  test("Colt Revolver derives cocking travel, ward orientation, and claim-coupling sensitivities", () => {
    const id = "us-x9430-colt-revolver";

    // 1. Cocking travel sensitivity
    const sensTravel = computeParameterSensitivity(id, "cockingTravelPct", {
      cockingTravelPct: 50,
      chamberIndex: 1,
    });
    expect(sensTravel).toBeDefined();
    expect(sensTravel?.metricName).toBe("Normalized Cylinder Advance");
    expect(sensTravel?.derivativeSymbol).toBe("∂q_{cylinder} / ∂u_{cock}");
    expect(sensTravel?.derivativeUnit).toBe("display-step / % display");

    for (const alias of ["cockingTravel", "cocking", "travelPct", "travel"]) {
      const sensAlias = computeParameterSensitivity(id, alias, {
        [alias]: 50,
        chamberIndex: 1,
      });
      expect(sensAlias?.derivativeValue).toBe(sensTravel?.derivativeValue);
    }

    // 2. Chamber index / ward orientation sensitivity
    const sensWard = computeParameterSensitivity(id, "chamberIndex", {
      cockingTravelPct: 0,
      chamberIndex: 1,
    });
    expect(sensWard).toBeDefined();
    expect(sensWard?.metricName).toBe("Base Cylinder Ward Orientation");
    expect(sensWard?.derivativeSymbol).toBe("Δθ_{cyl} / Δward");
    expect(sensWard?.derivativeUnit).toBe("rad/ward");
    expect(sensWard?.derivativeValue).toBeCloseTo(-(2 * Math.PI) / 5, 3);

    for (const alias of ["chamber", "ward", "wardIndex"]) {
      const sensAlias = computeParameterSensitivity(id, alias, {
        cockingTravelPct: 0,
        [alias]: 1,
      });
      expect(sensAlias?.derivativeValue).toBe(sensWard?.derivativeValue);
    }

    // 3. Claim 5 and Claim 6 sensitivities
    const sensClaim5 = computeParameterSensitivity(id, "claim5ShacklePresent", {
      cockingTravelPct: 50,
    });
    expect(sensClaim5).toBeDefined();
    expect(sensClaim5?.metricName).toBe("Cylinder-Ratchet Coupling State");
    expect(sensClaim5?.derivativeSymbol).toBe("Δq_{cyl} / ΔClaim5");

    const sensClaim6 = computeParameterSensitivity(id, "claim6LockingAndTurningPresent", {
      cockingTravelPct: 50,
    });
    expect(sensClaim6).toBeDefined();
    expect(sensClaim6?.metricName).toBe("Locking & Turning Sequence State");
    expect(sensClaim6?.derivativeSymbol).toBe("ΔKey / ΔClaim6");
  });

  test("Goertz Electronic Master-Slave Manipulator derives 7-channel correspondence, force reflection, and damping sensitivities", () => {
    const id = "us-2846084-goertz-electronic-master-slave-manipulator";

    // 1. Bilateral tracking channels
    const channels = [
      {
        key: "horizontalArmPivot",
        symbol: "∂q_s,113b / ∂q_m,113b",
        aliases: ["hPivot", "armPivot", "axis113b"],
      },
      {
        key: "horizontalArmRoll",
        symbol: "∂q_s,hroll / ∂q_m,hroll",
        aliases: ["hRoll", "armRoll", "horizontalRoll"],
      },
      {
        key: "verticalArmPivot",
        symbol: "∂q_s,126 / ∂q_m,126",
        aliases: ["vPivot", "vertPivot", "axis126"],
      },
      {
        key: "verticalArmRoll",
        symbol: "∂q_s,vroll / ∂q_m,vroll",
        aliases: ["vRoll", "vertRoll", "verticalRoll"],
      },
      {
        key: "toolAxis171",
        symbol: "∂q_s,171 / ∂q_m,171",
        aliases: ["axis171", "toolPivot171", "wrist171"],
      },
      {
        key: "toolAxis172",
        symbol: "∂q_s,172 / ∂q_m,172",
        aliases: ["axis172", "toolPivot172", "wrist172"],
      },
    ];

    for (const ch of channels) {
      const sens = computeParameterSensitivity(id, ch.key, { [ch.key]: 0.25 });
      expect(sens).toBeDefined();
      expect(sens?.derivativeSymbol).toBe(ch.symbol);
      expect(sens?.derivativeUnit).toBe("normalized slave / normalized master");
      expect(sens?.derivativeValue).toBe(1.0);

      for (const alias of ch.aliases) {
        expect(computeParameterSensitivity(id, alias, { [alias]: 0.25 })?.derivativeValue).toBe(
          1.0,
        );
      }
    }

    // 2. Gripper closure and contact resistance
    const sensClosure = computeParameterSensitivity(id, "gripperClosure", {
      gripperClosure: 0.5,
      contactResistance: 0.4,
    });
    expect(sensClosure).toBeDefined();
    expect(sensClosure?.metricName).toBe("Gripper-Closure Mismatch Display");
    expect(sensClosure?.derivativeSymbol).toBe("∂e_grip / ∂q_m,grip");
    expect(sensClosure?.derivativeValue).toBeCloseTo(0.4, 2);

    for (const alias of ["gripper", "closure", "grip", "jawClosure", "toolClosure"]) {
      expect(
        computeParameterSensitivity(id, alias, { [alias]: 0.5, contactResistance: 0.4 })
          ?.derivativeValue,
      ).toBeCloseTo(0.4, 2);
    }

    const sensContact = computeParameterSensitivity(id, "contactResistance", {
      gripperClosure: 0.6,
      contactResistance: 0.3,
      forceReflectionEnabled: 1,
    });
    expect(sensContact).toBeDefined();
    expect(sensContact?.metricName).toBe("Reflected-Resistance Display");
    expect(sensContact?.derivativeSymbol).toBe("∂r_display / ∂u_contact");
    expect(sensContact?.derivativeValue).toBeCloseTo(0.6, 2);

    for (const alias of ["contact", "resistance", "obstruction", "gripperObstruction"]) {
      expect(
        computeParameterSensitivity(id, alias, {
          gripperClosure: 0.6,
          [alias]: 0.3,
          forceReflectionEnabled: 1,
        })?.derivativeValue,
      ).toBeCloseTo(0.6, 2);
    }

    // 3. Topology interlocks
    const sensReflection = computeParameterSensitivity(id, "forceReflectionEnabled", {
      forceReflectionEnabled: 1,
    });
    expect(sensReflection?.metricName).toBe("Claim 9 Bilateral Force Reflection");
    expect(sensReflection?.derivativeValue).toBe(0);

    for (const alias of ["forceReflection", "reflection", "forceFeedback", "claim9"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 1 })?.derivativeValue).toBe(0);
    }

    const sensDamping = computeParameterSensitivity(id, "tachometerDampingEnabled", {
      tachometerDampingEnabled: 1,
    });
    expect(sensDamping?.metricName).toBe("Claim 11 Relative Velocity Damping");
    expect(sensDamping?.derivativeValue).toBe(0);

    for (const alias of ["tachometerDamping", "tachometer", "damping", "rateFeedback", "claim11"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 1 })?.derivativeValue).toBe(0);
    }

    const sensLimiter = computeParameterSensitivity(id, "limiterEnabled", { limiterEnabled: 1 });
    expect(sensLimiter?.metricName).toBe("Claims 10/12 Drive Signal Limiter");
    expect(sensLimiter?.derivativeValue).toBe(0);

    for (const alias of ["limiter", "saturationLimiter", "claim10", "claim12"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 1 })?.derivativeValue).toBe(0);
    }

    // 4. Bounds checking
    for (const invalid of [-1.1, 1.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "horizontalArmPivot", { horizontalArmPivot: invalid }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "verticalArmRoll", { verticalArmRoll: invalid }),
      ).toBeNull();
      expect(computeParameterSensitivity(id, "toolAxis171", { toolAxis171: invalid })).toBeNull();
    }
    for (const invalid of [-0.1, 1.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "gripperClosure", { gripperClosure: invalid }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "contactResistance", { contactResistance: invalid }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "forceReflectionEnabled", {
          forceReflectionEnabled: invalid,
        }),
      ).toBeNull();
    }
  });

  test("Devol Programmed Article Transfer derives slot code, bit width, and anticipatory sensing sensitivities", () => {
    const id = "us-2988237-devol-programmed-transfer";

    // 1. Position codes
    const sensRecorded = computeParameterSensitivity(id, "recordedSlot", { recordedSlot: 11 });
    expect(sensRecorded).toBeDefined();
    expect(sensRecorded?.metricName).toBe("Recorded Position Symbol");
    expect(sensRecorded?.derivativeValue).toBe(1);

    for (const alias of [
      "recordedCode",
      "programSlot",
      "programCode",
      "recordedPosition",
      "recorded",
    ]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 11 })?.derivativeValue).toBe(1);
    }

    const sensSensed = computeParameterSensitivity(id, "sensedSlot", { sensedSlot: 3 });
    expect(sensSensed).toBeDefined();
    expect(sensSensed?.metricName).toBe("Sensed Position Symbol");
    expect(sensSensed?.derivativeValue).toBe(1);

    for (const alias of ["sensedCode", "encoderSlot", "encoderCode", "sensedPosition", "sensed"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 3 })?.derivativeValue).toBe(1);
    }

    // 2. Bit width resolution expansion
    const sensBitWidth = computeParameterSensitivity(id, "bitWidth", { bitWidth: 6 });
    expect(sensBitWidth).toBeDefined();
    expect(sensBitWidth?.metricName).toBe("Encoder Address Resolution");
    expect(sensBitWidth?.derivativeSymbol).toBe("∂N_codes / ∂B");
    expect(sensBitWidth?.derivativeUnit).toBe("codes / bit");
    expect(sensBitWidth?.derivativeValue).toBeCloseTo(44.36, 1);

    for (const alias of ["bits", "codeBits", "resolutionBits", "codeWidth"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 6 })?.derivativeValue).toBeCloseTo(
        44.36,
        1,
      );
    }

    // 3. Claims 5, 6, 8 interlocks
    const sensAnticipation = computeParameterSensitivity(id, "anticipationEnabled", {
      anticipationEnabled: 1,
    });
    expect(sensAnticipation?.metricName).toBe("Claim 8 Anticipatory Sensing Interlock");
    expect(sensAnticipation?.derivativeValue).toBe(0);

    for (const alias of ["anticipation", "claim8", "anticipatorySensing", "advanceSensing"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 1 })?.derivativeValue).toBe(0);
    }

    const sensMode = computeParameterSensitivity(id, "recordingMode", { recordingMode: 1 });
    expect(sensMode?.metricName).toBe("Claim 5 Record / Replay Mode");
    expect(sensMode?.derivativeValue).toBe(0);

    for (const alias of ["recordMode", "claim5", "teachMode", "mode"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 1 })?.derivativeValue).toBe(0);
    }

    const sensGripper = computeParameterSensitivity(id, "gripperClosed", { gripperClosed: 1 });
    expect(sensGripper?.metricName).toBe("Claim 6 Article Gripper State");
    expect(sensGripper?.derivativeValue).toBe(0);

    for (const alias of ["gripper", "claim6", "gripperState", "jawClosed", "seizing"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 1 })?.derivativeValue).toBe(0);
    }

    // 4. Bounds checking
    for (const invalid of [-1, 256, Number.NaN]) {
      expect(computeParameterSensitivity(id, "recordedSlot", { recordedSlot: invalid })).toBeNull();
      expect(computeParameterSensitivity(id, "sensedSlot", { sensedSlot: invalid })).toBeNull();
    }
    for (const invalid of [1, 9, Number.NaN]) {
      expect(computeParameterSensitivity(id, "bitWidth", { bitWidth: invalid })).toBeNull();
    }
    for (const invalid of [-0.1, 1.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "anticipationEnabled", { anticipationEnabled: invalid }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "recordingMode", { recordingMode: invalid }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "gripperClosed", { gripperClosed: invalid }),
      ).toBeNull();
    }
  });

  test("Lemelson Automatic Warehousing derives rail, vertical level, shuttle extension, and preset addressing sensitivities", () => {
    const id = "us-3119501-lemelson-automatic-warehousing";

    // 1. Positional fractions
    const sensRail = computeParameterSensitivity(id, "railAddressFraction", {
      railAddressFraction: 0.6,
    });
    expect(sensRail).toBeDefined();
    expect(sensRail?.metricName).toBe("Normalized Rail Address");
    expect(sensRail?.derivativeValue).toBe(1);

    for (const alias of ["railAddress", "carrierX", "railFraction", "xAddress", "rail"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 0.6 })?.derivativeValue).toBe(1);
    }

    const sensLevel = computeParameterSensitivity(id, "levelAddressFraction", {
      levelAddressFraction: 0.4,
    });
    expect(sensLevel).toBeDefined();
    expect(sensLevel?.metricName).toBe("Normalized Vertical Address");
    expect(sensLevel?.derivativeValue).toBe(1);

    for (const alias of [
      "levelAddress",
      "carrierY",
      "levelFraction",
      "yAddress",
      "verticalAddress",
      "level",
      "vertical",
    ]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 0.4 })?.derivativeValue).toBe(1);
    }

    const sensShuttle = computeParameterSensitivity(id, "shuttleExtensionFraction", {
      shuttleExtensionFraction: 0.5,
    });
    expect(sensShuttle).toBeDefined();
    expect(sensShuttle?.metricName).toBe("Normalized Shuttle Extension");
    expect(sensShuttle?.derivativeValue).toBe(1);

    for (const alias of [
      "shuttleExtension",
      "shuttleZ",
      "extensionFraction",
      "zExtension",
      "shuttle",
      "extension",
    ]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 0.5 })?.derivativeValue).toBe(1);
    }

    // 2. Preset addressing interlock
    const sensAddressing = computeParameterSensitivity(id, "automaticAddressing", {
      automaticAddressing: 1,
    });
    expect(sensAddressing).toBeDefined();
    expect(sensAddressing?.metricName).toBe("Preset-Count Marker Addressing Interlock");
    expect(sensAddressing?.derivativeValue).toBe(0);

    for (const alias of [
      "autoAddressing",
      "presetAddressing",
      "claim1",
      "addressing",
      "automaticSequence",
    ]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 1 })?.derivativeValue).toBe(0);
    }

    // 3. Bounds checking
    for (const invalid of [-0.1, 1.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "railAddressFraction", { railAddressFraction: invalid }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "levelAddressFraction", { levelAddressFraction: invalid }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "shuttleExtensionFraction", {
          shuttleExtensionFraction: invalid,
        }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "automaticAddressing", { automaticAddressing: invalid }),
      ).toBeNull();
    }
  });

  test("AMF Versatran derives six-motion joints, mode transition, resolver phase error, and claim gating sensitivities", () => {
    const id = "us-3212649-amf-versatran";

    // 1. Motion channels with Claim 1 active
    const sensCol = computeParameterSensitivity(id, "columnRotation", { columnRotation: 0.2 });
    expect(sensCol).toBeDefined();
    expect(sensCol?.metricName).toBe("Normalized Motion Display Sensitivity");
    expect(sensCol?.derivativeValue).toBe(1.0);

    for (const alias of ["column", "rotation", "columnTurn", "turn"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 0.3 })?.derivativeValue).toBe(1.0);
    }

    const sensLift = computeParameterSensitivity(id, "carriageLift", { carriageLift: 0.6 });
    expect(sensLift).toBeDefined();
    expect(sensLift?.derivativeValue).toBe(1.0);
    for (const alias of ["lift", "carriage", "verticalLift", "verticalTravel"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 0.7 })?.derivativeValue).toBe(1.0);
    }

    const sensArm = computeParameterSensitivity(id, "armTravel", { armTravel: 0.5 });
    expect(sensArm).toBeDefined();
    expect(sensArm?.metricName).toBe("Horizontal Reach Sensitivity");
    expect(sensArm?.derivativeValue).toBe(0.72);
    for (const alias of ["reach", "arm", "horizontalTravel", "horizontalReach", "extension"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 0.4 })?.derivativeValue).toBe(0.72);
    }

    for (const alias of ["wristRotation", "wristTurn", "roll", "armAxisRotation"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 0.1 })?.derivativeValue).toBe(1.0);
    }
    for (const alias of ["wristSwing", "swing", "yaw", "wristAngle"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: -0.2 })?.derivativeValue).toBe(1.0);
    }

    // 2. Gripper with Claim 12 active
    const sensGrip = computeParameterSensitivity(id, "gripperOperation", { gripperOperation: 0.8 });
    expect(sensGrip).toBeDefined();
    expect(sensGrip?.metricName).toBe("Normalized Gripper Operation");
    expect(sensGrip?.derivativeValue).toBe(1.0);
    for (const alias of ["gripper", "jaw", "grip", "jawClosure"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 0.5 })?.derivativeValue).toBe(1.0);
    }

    // Gripper when Claim 12 disabled -> 0
    expect(
      computeParameterSensitivity(id, "gripperOperation", { claim12PinionGripperEnabled: 0 })
        ?.derivativeValue,
    ).toBe(0);

    // 3. Resolver phase offset with Claim 8 active
    const sensPhase = computeParameterSensitivity(id, "resolverPhaseOffset", {
      resolverPhaseOffset: 0.25,
    });
    expect(sensPhase).toBeDefined();
    expect(sensPhase?.metricName).toBe("Phase Error Sensitivity");
    expect(sensPhase?.derivativeValue).toBe(1.0);
    for (const alias of ["phaseOffset", "offset", "resolverOffset", "phaseError"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 0.15 })?.derivativeValue).toBe(1.0);
    }
    expect(
      computeParameterSensitivity(id, "resolverPhaseOffset", { claim8RecordPlaybackEnabled: 0 })
        ?.derivativeValue,
    ).toBe(0);

    // 4. Teach / replay mode transition
    const sensMode = computeParameterSensitivity(id, "teachReplayMode", { teachReplayMode: 1 });
    expect(sensMode).toBeDefined();
    expect(sensMode?.metricName).toBe("Recorded Playback Mode Transition");
    expect(sensMode?.derivativeValue).toBe(1.0);
    for (const alias of ["mode", "replayMode", "teachMode", "playbackMode", "recordReplay"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 1 })?.derivativeValue).toBe(1.0);
    }
    expect(
      computeParameterSensitivity(id, "teachReplayMode", { claim8RecordPlaybackEnabled: 0 })
        ?.derivativeValue,
    ).toBe(0);

    // 5. Claim probes
    expect(computeParameterSensitivity(id, "claim1TopologyEnabled", {})?.metricName).toBe(
      "Claim 1 Six-Motion Topology Gate",
    );
    expect(computeParameterSensitivity(id, "claim8RecordPlaybackEnabled", {})?.metricName).toBe(
      "Claim 8 Record/Playback Path Gate",
    );
    expect(computeParameterSensitivity(id, "claim12PinionGripperEnabled", {})?.metricName).toBe(
      "Claim 12 Pinion Gripper Gate",
    );

    // Motion when Claim 1 disabled -> 0
    expect(
      computeParameterSensitivity(id, "columnRotation", { claim1TopologyEnabled: 0 })
        ?.derivativeValue,
    ).toBe(0);
    expect(
      computeParameterSensitivity(id, "armTravel", { claim1TopologyEnabled: 0 })?.derivativeValue,
    ).toBe(0);

    // 6. Parameter bounds
    for (const invalid of [-1.1, 1.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "columnRotation", { columnRotation: invalid }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "wristRotation", { wristRotation: invalid }),
      ).toBeNull();
      expect(computeParameterSensitivity(id, "wristSwing", { wristSwing: invalid })).toBeNull();
      expect(
        computeParameterSensitivity(id, "resolverPhaseOffset", { resolverPhaseOffset: invalid }),
      ).toBeNull();
    }
    for (const invalidUnit of [-0.1, 1.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "carriageLift", { carriageLift: invalidUnit }),
      ).toBeNull();
      expect(computeParameterSensitivity(id, "armTravel", { armTravel: invalidUnit })).toBeNull();
      expect(
        computeParameterSensitivity(id, "gripperOperation", { gripperOperation: invalidUnit }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "teachReplayMode", { teachReplayMode: invalidUnit }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "claim1TopologyEnabled", {
          claim1TopologyEnabled: invalidUnit,
        }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "claim8RecordPlaybackEnabled", {
          claim8RecordPlaybackEnabled: invalidUnit,
        }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "claim12PinionGripperEnabled", {
          claim12PinionGripperEnabled: invalidUnit,
        }),
      ).toBeNull();
    }
  });

  test("Lemelson Adjustable Manipulator derives turntable azimuth, hoist, bevel wrist, jaw closure, phase, and stop limit sensitivities", () => {
    const id = "us-3260375-lemelson-adjustable-manipulator";

    // 1. Column azimuth & aliases
    const sensAz = computeParameterSensitivity(id, "columnAzimuth", { columnAzimuth: 0.3 });
    expect(sensAz).toBeDefined();
    expect(sensAz?.metricName).toBe("Azimuth Angle Sensitivity");
    expect(sensAz?.derivativeValue).toBe(Math.PI);
    for (const alias of ["azimuth", "turntable", "turntableAngle", "rotation"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 0.5 })?.derivativeValue).toBe(
        Math.PI,
      );
    }

    // 2. Wrist pivot & aliases
    const sensPivot = computeParameterSensitivity(id, "wristPivot", { wristPivot: -0.2 });
    expect(sensPivot).toBeDefined();
    expect(sensPivot?.metricName).toBe("Wrist Pivot Angle Sensitivity");
    expect(sensPivot?.derivativeValue).toBe(Math.PI / 2);
    for (const alias of ["pivot", "wrist", "wristAngle", "bevelPivot"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 0.1 })?.derivativeValue).toBe(
        Math.PI / 2,
      );
    }

    // 3. Carriage & column elevation
    const sensCarriage = computeParameterSensitivity(id, "carriagePosition", {
      carriagePosition: 0.4,
    });
    expect(sensCarriage).toBeDefined();
    expect(sensCarriage?.metricName).toBe("Normalized Axis Coordinate Sensitivity");
    expect(sensCarriage?.derivativeValue).toBe(1.0);
    for (const alias of ["carriage", "carriageX", "xPosition", "positionX"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 0.2 })?.derivativeValue).toBe(1.0);
    }

    const sensElevation = computeParameterSensitivity(id, "columnElevation", {
      columnElevation: 0.65,
    });
    expect(sensElevation).toBeDefined();
    expect(sensElevation?.derivativeValue).toBe(1.0);
    for (const alias of ["elevation", "columnZ", "lift", "hoist"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 0.8 })?.derivativeValue).toBe(1.0);
    }

    // 4. Jaw closure
    const sensJaw = computeParameterSensitivity(id, "jawClosure", { jawClosure: 0.5 });
    expect(sensJaw).toBeDefined();
    expect(sensJaw?.metricName).toBe("Jaw Closure Sensitivity");
    expect(sensJaw?.derivativeValue).toBe(-1.0);
    for (const alias of ["gripper", "jaw", "grip", "closure"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 0.7 })?.derivativeValue).toBe(-1.0);
    }

    // 5. Sequential cycle phase
    const sensPhase = computeParameterSensitivity(id, "cyclePhase", { cyclePhase: 2 });
    expect(sensPhase).toBeDefined();
    expect(sensPhase?.metricName).toBe("Sequential Phase Index Step");
    expect(sensPhase?.derivativeValue).toBe(1.0);
    for (const alias of ["phase", "stage", "sequencePhase", "step"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 3 })?.derivativeValue).toBe(1.0);
    }

    // 6. Stop limits
    const sensStop1Az = computeParameterSensitivity(id, "stop1Azimuth", { stop1Azimuth: -0.5 });
    expect(sensStop1Az).toBeDefined();
    expect(sensStop1Az?.metricName).toBe("Stop 1 Azimuth Limit Sensitivity");
    expect(sensStop1Az?.derivativeValue).toBe(Math.PI);
    for (const alias of ["stop1Rotary", "azimuthLimit1", "stop1Angle"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 0.1 })?.derivativeValue).toBe(
        Math.PI,
      );
    }

    const sensStop2Az = computeParameterSensitivity(id, "stop2Azimuth", { stop2Azimuth: 0.7 });
    expect(sensStop2Az).toBeDefined();
    expect(sensStop2Az?.metricName).toBe("Stop 2 Azimuth Limit Sensitivity");
    expect(sensStop2Az?.derivativeValue).toBe(Math.PI);
    for (const alias of ["stop2Rotary", "azimuthLimit2", "stop2Angle"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 0.4 })?.derivativeValue).toBe(
        Math.PI,
      );
    }

    const sensStop1El = computeParameterSensitivity(id, "stop1Elevation", { stop1Elevation: 0.2 });
    expect(sensStop1El).toBeDefined();
    expect(sensStop1El?.metricName).toBe("Stop 1 Vertical Limit Sensitivity");
    expect(sensStop1El?.derivativeValue).toBe(1.0);
    for (const alias of ["stop1Vertical", "verticalLimit1", "stop1Height"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 0.3 })?.derivativeValue).toBe(1.0);
    }

    const sensStop2El = computeParameterSensitivity(id, "stop2Elevation", { stop2Elevation: 0.9 });
    expect(sensStop2El).toBeDefined();
    expect(sensStop2El?.metricName).toBe("Stop 2 Vertical Limit Sensitivity");
    expect(sensStop2El?.derivativeValue).toBe(1.0);
    for (const alias of ["stop2Vertical", "verticalLimit2", "stop2Height"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 0.85 })?.derivativeValue).toBe(1.0);
    }

    // 7. Bounds checks
    for (const invalid of [-1.1, 1.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "carriagePosition", { carriagePosition: invalid }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "columnAzimuth", { columnAzimuth: invalid }),
      ).toBeNull();
      expect(computeParameterSensitivity(id, "wristPivot", { wristPivot: invalid })).toBeNull();
      expect(computeParameterSensitivity(id, "stop1Azimuth", { stop1Azimuth: invalid })).toBeNull();
      expect(computeParameterSensitivity(id, "stop2Azimuth", { stop2Azimuth: invalid })).toBeNull();
    }
    for (const invalidUnit of [-0.1, 1.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "columnElevation", { columnElevation: invalidUnit }),
      ).toBeNull();
      expect(computeParameterSensitivity(id, "jawClosure", { jawClosure: invalidUnit })).toBeNull();
      expect(
        computeParameterSensitivity(id, "stop1Elevation", { stop1Elevation: invalidUnit }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "stop2Elevation", { stop2Elevation: invalidUnit }),
      ).toBeNull();
    }
    for (const invalidPhase of [-1, 6, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "cyclePhase", { cyclePhase: invalidPhase }),
      ).toBeNull();
    }
  });

  test("Lemelson Automatic Production derives carrier address, lift, reach, marker detection, coupling, and cycle sensitivities", () => {
    const id = "us-3313014-lemelson-automatic-production";

    // 1. Carrier address & aliases
    const sensAddress = computeParameterSensitivity(id, "carrierAddressFraction", {
      carrierAddressFraction: 0.45,
    });
    expect(sensAddress).toBeDefined();
    expect(sensAddress?.metricName).toBe("Normalized Carrier Address Position");
    expect(sensAddress?.derivativeValue).toBe(1.0);
    for (const alias of ["carrierAddress", "carrierX", "addressFraction", "address"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 0.6 })?.derivativeValue).toBe(1.0);
    }

    // 2. Mz lift & aliases
    const sensLift = computeParameterSensitivity(id, "liftFraction", { liftFraction: 0.5 });
    expect(sensLift).toBeDefined();
    expect(sensLift?.metricName).toBe("Normalized Mz Lift Pose");
    expect(sensLift?.derivativeValue).toBe(1.0);
    for (const alias of ["lift", "verticalLift", "liftPose", "mzLift"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 0.7 })?.derivativeValue).toBe(1.0);
    }

    // 3. My platform reach & aliases
    const sensReach = computeParameterSensitivity(id, "reachFraction", { reachFraction: 0.35 });
    expect(sensReach).toBeDefined();
    expect(sensReach?.metricName).toBe("Normalized My Platform Reach");
    expect(sensReach?.derivativeValue).toBe(1.0);
    for (const alias of ["reach", "platformReach", "myReach", "extension"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 0.8 })?.derivativeValue).toBe(1.0);
    }

    // 4. Station marker detected & aliases
    const sensDetected = computeParameterSensitivity(id, "stationDetected", { stationDetected: 1 });
    expect(sensDetected).toBeDefined();
    expect(sensDetected?.metricName).toBe("Marker Recognition Interlock");
    expect(sensDetected?.derivativeValue).toBe(1.0);
    for (const alias of ["marker", "markerDetected", "markerSensed", "stationSensed"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 1 })?.derivativeValue).toBe(1.0);
    }

    // 5. Station coupled & aliases
    const sensCoupled = computeParameterSensitivity(id, "stationCoupled", { stationCoupled: 1 });
    expect(sensCoupled).toBeDefined();
    expect(sensCoupled?.metricName).toBe("Station Contacts Coupling Interlock");
    expect(sensCoupled?.derivativeValue).toBe(1.0);
    for (const alias of ["coupled", "contactsCoupled", "stationContact", "claim7"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 1 })?.derivativeValue).toBe(1.0);
    }

    // 6. Ordered cycle progress & aliases
    const sensProgress = computeParameterSensitivity(id, "cycleProgress", { cycleProgress: 0.65 });
    expect(sensProgress).toBeDefined();
    expect(sensProgress?.metricName).toBe("Production Sequence Cycle Progress");
    expect(sensProgress?.derivativeValue).toBe(1.0);
    for (const alias of ["progress", "cycle", "sequenceProgress", "cycleFraction"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 0.4 })?.derivativeValue).toBe(1.0);
    }

    // 7. Bounds checks
    for (const invalid of [-0.1, 1.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "carrierAddressFraction", {
          carrierAddressFraction: invalid,
        }),
      ).toBeNull();
      expect(computeParameterSensitivity(id, "liftFraction", { liftFraction: invalid })).toBeNull();
      expect(
        computeParameterSensitivity(id, "reachFraction", { reachFraction: invalid }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "stationDetected", { stationDetected: invalid }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "stationCoupled", { stationCoupled: invalid }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "cycleProgress", { cycleProgress: invalid }),
      ).toBeNull();
    }
  });

  test("Stackhouse Manipulator derives forearm azimuth, tool bend invariance, point-P coincidence, and oblique bend sensitivities", () => {
    const id = "us-4068536-stackhouse-manipulator";

    // 1. Forearm roll azimuth sensitivity & aliases
    const sensForearm = computeParameterSensitivity(id, "forearmRollDeg", { forearmRollDeg: 15 });
    expect(sensForearm).toBeDefined();
    expect(sensForearm?.metricName).toBe("Selected Display-Azimuth Sensitivity");
    expect(sensForearm?.derivativeSymbol).toBe("∂ψ_display / ∂θ_1");
    expect(sensForearm?.derivativeValue).toBe(1.0);
    expect(sensForearm?.derivativeUnit).toBe("display deg / deg");
    for (const alias of ["forearmRoll", "theta1", "roll1"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 20 })?.derivativeValue).toBe(1.0);
    }

    // 2. Tool spin roll bend invariance & aliases
    const sensTool = computeParameterSensitivity(id, "toolRollDeg", { toolRollDeg: 30 });
    expect(sensTool).toBeDefined();
    expect(sensTool?.metricName).toBe("Selected Display-Bend Sensitivity");
    expect(sensTool?.derivativeSymbol).toBe("∂β_display / ∂θ_3");
    expect(sensTool?.derivativeValue).toBe(0.0);
    expect(sensTool?.derivativeUnit).toBe("display deg / deg");
    for (const alias of ["toolRoll", "theta3", "roll3"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 45 })?.derivativeValue).toBe(0.0);
    }

    // 3. Preferred common point P coincidence & aliases
    const sensIntersection = computeParameterSensitivity(id, "singleIntersection", {
      singleIntersection: 1,
    });
    expect(sensIntersection).toBeDefined();
    expect(sensIntersection?.metricName).toBe("Axis Coincidence at Point P");
    expect(sensIntersection?.derivativeSymbol).toBe("Δcoincidence / ΔP");
    expect(sensIntersection?.derivativeValue).toBe(1.0);
    expect(sensIntersection?.derivativeUnit).toBe("coincidence / state");
    for (const alias of ["pointP", "exactIntersection", "preferredPointP"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 1 })?.derivativeValue).toBe(1.0);
    }

    // 4. Intermediate oblique roll & aliases
    const sensIntermediate = computeParameterSensitivity(id, "intermediateRollDeg", {
      intermediateRollDeg: 72,
    });
    expect(sensIntermediate).toBeDefined();
    expect(sensIntermediate?.metricName).toBe("Selected Display-Bend Sensitivity");
    expect(sensIntermediate?.derivativeSymbol).toBe("∂β_display / ∂q");
    for (const alias of ["intermediateRoll", "theta2", "roll2"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 72 })?.derivativeValue).toBe(
        sensIntermediate?.derivativeValue,
      );
    }

    // 5. First & second oblique angle display sensitivities & aliases
    const sensOblique1 = computeParameterSensitivity(id, "firstObliqueAngleDeg", {
      firstObliqueAngleDeg: 55,
    });
    expect(sensOblique1).toBeDefined();
    for (const alias of ["firstOblique", "alphaAB", "alpha1"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 55 })?.derivativeValue).toBe(
        sensOblique1?.derivativeValue,
      );
    }
    const sensOblique2 = computeParameterSensitivity(id, "secondObliqueAngleDeg", {
      secondObliqueAngleDeg: 55,
    });
    expect(sensOblique2).toBeDefined();
    for (const alias of ["secondOblique", "alphaBC", "alpha2"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 55 })?.derivativeValue).toBe(
        sensOblique2?.derivativeValue,
      );
    }

    // 6. Bounds checks
    for (const invalidRoll of [-181, 181, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "forearmRollDeg", { forearmRollDeg: invalidRoll }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "intermediateRollDeg", {
          intermediateRollDeg: invalidRoll,
        }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "toolRollDeg", { toolRollDeg: invalidRoll }),
      ).toBeNull();
    }
    for (const invalidOblique of [45, 81, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "firstObliqueAngleDeg", {
          firstObliqueAngleDeg: invalidOblique,
        }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "secondObliqueAngleDeg", {
          secondObliqueAngleDeg: invalidOblique,
        }),
      ).toBeNull();
    }
    for (const invalidIntersection of [-0.1, 1.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "singleIntersection", {
          singleIntersection: invalidIntersection,
        }),
      ).toBeNull();
    }
  });

  test("Watson RCC derives translation phase, axis mismatch, remote center projection, and anti-twist engagement sensitivities", () => {
    const id = "us-4098001-watson-rcc";

    // 1. Lateral contact translation phase & aliases
    const sensLateral = computeParameterSensitivity(id, "lateralContactFraction", {
      lateralContactFraction: 0.3,
    });
    expect(sensLateral).toBeDefined();
    expect(sensLateral?.metricName).toBe("Figure 4 Translation Phase");
    expect(sensLateral?.derivativeSymbol).toBe("∂q_t / ∂q_c");
    expect(sensLateral?.derivativeUnit).toBe("display fraction / contact fraction");
    for (const alias of ["lateralContact", "contactFraction", "contact"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 0.3 })?.derivativeValue).toBe(
        sensLateral?.derivativeValue,
      );
    }

    // 2. Axis mismatch & aliases
    const sensMismatch = computeParameterSensitivity(id, "axisMismatchFraction", {
      axisMismatchFraction: 0.44,
    });
    expect(sensMismatch).toBeDefined();
    expect(sensMismatch?.metricName).toBe("Remaining Axis Mismatch");
    expect(sensMismatch?.derivativeSymbol).toBe("∂q_e / ∂q_m");
    expect(sensMismatch?.derivativeUnit).toBe("normalized / normalized");
    for (const alias of ["axisMismatch", "mismatchFraction", "mismatch"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 0.44 })?.derivativeValue).toBe(
        sensMismatch?.derivativeValue,
      );
    }

    // 3. Remote center projection & aliases
    const sensRemote = computeParameterSensitivity(id, "remoteCenterTopology", {
      remoteCenterTopology: 1,
    });
    expect(sensRemote).toBeDefined();
    expect(sensRemote?.metricName).toBe("Remote Center Projection");
    expect(sensRemote?.derivativeSymbol).toBe("ΔP_remote / Δtopology");
    expect(sensRemote?.derivativeValue).toBe(1.0);
    expect(sensRemote?.derivativeUnit).toBe("projection / state");
    for (const alias of ["remoteCenter", "claim1Topology", "topology"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 1 })?.derivativeValue).toBe(1.0);
    }

    // 4. Anti-twist constraint engagement & aliases
    const sensTwist = computeParameterSensitivity(id, "antiTwistConstraint", {
      remoteCenterTopology: 1,
      antiTwistConstraint: 1,
    });
    expect(sensTwist).toBeDefined();
    expect(sensTwist?.metricName).toBe("Claim 2 Anti-Twist Engagement");
    expect(sensTwist?.derivativeSymbol).toBe("ΔC_twist / ΔantiTwist");
    expect(sensTwist?.derivativeValue).toBe(1.0);
    expect(sensTwist?.derivativeUnit).toBe("engagement / state");
    for (const alias of ["antiTwist", "claim2Constraint", "torqueConstraint"]) {
      expect(
        computeParameterSensitivity(id, alias, { remoteCenterTopology: 1, [alias]: 1 })
          ?.derivativeValue,
      ).toBe(1.0);
    }
    // Disabled remote center disables anti-twist effect
    const sensTwistNoRemote = computeParameterSensitivity(id, "antiTwistConstraint", {
      remoteCenterTopology: 0,
      antiTwistConstraint: 1,
    });
    expect(sensTwistNoRemote?.derivativeValue).toBe(0.0);

    // 5. Bounds checks
    for (const invalid of [-0.1, 1.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "lateralContactFraction", {
          lateralContactFraction: invalid,
        }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "axisMismatchFraction", {
          axisMismatchFraction: invalid,
        }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "remoteCenterTopology", {
          remoteCenterTopology: invalid,
        }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "antiTwistConstraint", {
          antiTwistConstraint: invalid,
        }),
      ).toBeNull();
    }
  });

  test("Makino SCARA derives link angles, tool attitude, and topology variant sensitivities with bounds and aliases", () => {
    const id = "us-4341502-makino-scara";

    // 1. First link angle & aliases
    const sensTheta1 = computeParameterSensitivity(id, "firstLinkAngleDeg", {
      firstLinkAngleDeg: 32,
    });
    expect(sensTheta1).toBeDefined();
    expect(sensTheta1?.metricName).toBe("End-Effector X Coordinate");
    expect(sensTheta1?.derivativeSymbol).toBe("∂X_tool / ∂θ_1");
    expect(sensTheta1?.derivativeUnit).toBe("norm / deg");
    for (const alias of ["firstLinkAngle", "theta1", "link1Angle"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 32 })?.derivativeValue).toBe(
        sensTheta1?.derivativeValue,
      );
    }

    // 2. Fourth link angle & aliases
    const sensTheta4 = computeParameterSensitivity(id, "fourthLinkAngleDeg", {
      fourthLinkAngleDeg: -38,
    });
    expect(sensTheta4).toBeDefined();
    expect(sensTheta4?.metricName).toBe("End-Effector Y Coordinate");
    expect(sensTheta4?.derivativeSymbol).toBe("∂Y_tool / ∂θ_4");
    expect(sensTheta4?.derivativeUnit).toBe("norm / deg");
    for (const alias of ["fourthLinkAngle", "theta2", "theta4", "link4Angle"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: -38 })?.derivativeValue).toBe(
        sensTheta4?.derivativeValue,
      );
    }

    // 3. Tool attitude & aliases
    const sensAttitude = computeParameterSensitivity(id, "toolAttitudeDeg", {
      topologyVariant: 1,
      toolAttitudeDeg: 10,
    });
    expect(sensAttitude).toBeDefined();
    expect(sensAttitude?.derivativeValue).toBe(1.0);
    for (const alias of ["toolAttitude", "phi", "attitude"]) {
      expect(
        computeParameterSensitivity(id, alias, { topologyVariant: 1, [alias]: 10 })
          ?.derivativeValue,
      ).toBe(1.0);
    }
    // Fixed attitude in Claim 6 Y-link
    expect(
      computeParameterSensitivity(id, "toolAttitudeDeg", {
        topologyVariant: 3,
        toolAttitudeDeg: 10,
      })?.derivativeValue,
    ).toBe(0.0);

    // 4. Topology variant & aliases
    const sensVariant = computeParameterSensitivity(id, "topologyVariant", {
      topologyVariant: 1,
    });
    expect(sensVariant).toBeDefined();
    expect(sensVariant?.metricName).toBe("Independent Claim Variant");
    expect(sensVariant?.derivativeSymbol).toBe("Δclaim / Δvariant");
    expect(sensVariant?.derivativeValue).toBe(1.0);
    expect(sensVariant?.derivativeUnit).toBe("claim mode / step");
    for (const alias of ["topology", "claimTopology", "variant", "claim"]) {
      expect(computeParameterSensitivity(id, alias, { [alias]: 1 })?.derivativeValue).toBe(1.0);
    }

    // 5. Bounds checks
    for (const invalidAngle of [-181, 181, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "firstLinkAngleDeg", { firstLinkAngleDeg: invalidAngle }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "fourthLinkAngleDeg", {
          fourthLinkAngleDeg: invalidAngle,
        }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "toolAttitudeDeg", { toolAttitudeDeg: invalidAngle }),
      ).toBeNull();
    }
    for (const invalidVariant of [0, 4, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "topologyVariant", { topologyVariant: invalidVariant }),
      ).toBeNull();
    }
  });

  test("Crump FDM derives road width flow sensitivity alongside nozzle temp, print speed, and layer height", () => {
    const id = "us-5121329-crump-fdm";
    const baseParams = {
      nozzleTempC: 225,
      printSpeedMmS: 45,
      layerHeightMm: 0.2,
      roadWidthMm: 0.45,
    };

    // 1. Road width volumetric flow rate derivative ∂Q / ∂w = h * v_head = 0.2 * 45 = 9.0
    const sensRoadWidth = computeParameterSensitivity(id, "roadWidthMm", baseParams);
    expect(sensRoadWidth).toBeDefined();
    expect(sensRoadWidth?.metricName).toBe("Volumetric Extrusion Flow Rate");
    expect(sensRoadWidth?.derivativeSymbol).toBe("∂Q / ∂w");
    expect(sensRoadWidth?.derivativeUnit).toBe("mm³/s / mm");
    expect(sensRoadWidth?.derivativeValue).toBeCloseTo(0.2 * 45, 4);
    for (const alias of ["roadWidth", "beadWidth", "extrusionWidth", "widthMm"]) {
      expect(
        computeParameterSensitivity(id, alias, { ...baseParams, [alias]: 0.45 })?.derivativeValue,
      ).toBeCloseTo(9.0, 4);
    }

    // 2. Print speed volumetric flow rate derivative ∂Q / ∂v_head = w * h = 0.45 * 0.2 = 0.09
    const sensSpeed = computeParameterSensitivity(id, "printSpeedMmS", baseParams);
    expect(sensSpeed).toBeDefined();
    expect(sensSpeed?.metricName).toBe("Volumetric Extrusion Flow Rate");
    expect(sensSpeed?.derivativeSymbol).toBe("∂Q / ∂v_head");
    expect(sensSpeed?.derivativeValue).toBeCloseTo(0.45 * 0.2, 4);
    for (const alias of ["printSpeed", "speedMmS", "feedSpeed"]) {
      expect(
        computeParameterSensitivity(id, alias, { ...baseParams, [alias]: 45 })?.derivativeValue,
      ).toBeCloseTo(0.09, 4);
    }

    // 3. Nozzle temp melt viscosity derivative ∂μ / ∂T
    const sensTemp = computeParameterSensitivity(id, "nozzleTempC", baseParams);
    expect(sensTemp).toBeDefined();
    expect(sensTemp?.metricName).toBe("Apparent Melt Viscosity");
    expect(sensTemp?.derivativeSymbol).toBe("∂μ / ∂T");
    expect(sensTemp?.derivativeUnit).toBe("Pa·s / °C");
    expect(sensTemp?.derivativeValue).toBeLessThan(0); // Heating lowers viscosity
    for (const alias of ["nozzleTemp", "tempC", "temperature"]) {
      expect(
        computeParameterSensitivity(id, alias, { ...baseParams, [alias]: 225 })?.derivativeValue,
      ).toBe(sensTemp?.derivativeValue);
    }

    // 4. Layer height cooling time constant derivative ∂τ / ∂h
    const sensHeight = computeParameterSensitivity(id, "layerHeightMm", baseParams);
    expect(sensHeight).toBeDefined();
    expect(sensHeight?.metricName).toBe("Road Thermal Cooling Time Constant");
    expect(sensHeight?.derivativeSymbol).toBe("∂τ / ∂h");
    expect(sensHeight?.derivativeUnit).toBe("s / mm");
    expect(sensHeight?.derivativeValue).toBeGreaterThan(0); // Thicker layer = slower cooling
    for (const alias of ["layerHeight", "sliceHeight", "heightMm"]) {
      expect(
        computeParameterSensitivity(id, alias, { ...baseParams, [alias]: 0.2 })?.derivativeValue,
      ).toBe(sensHeight?.derivativeValue);
    }

    // 5. Bounds checks
    for (const invalidTemp of [99, 301, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "nozzleTempC", { ...baseParams, nozzleTempC: invalidTemp }),
      ).toBeNull();
    }
    for (const invalidSpeed of [4, 251, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "printSpeedMmS", {
          ...baseParams,
          printSpeedMmS: invalidSpeed,
        }),
      ).toBeNull();
    }
    for (const invalidHeight of [0.04, 0.81, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "layerHeightMm", {
          ...baseParams,
          layerHeightMm: invalidHeight,
        }),
      ).toBeNull();
    }
    for (const invalidWidth of [0.14, 1.81, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "roadWidthMm", {
          ...baseParams,
          roadWidthMm: invalidWidth,
        }),
      ).toBeNull();
    }
  });

  test("Lemelson Machine Vision derives video signal gating & inspection topology sensitivities", () => {
    const id = "us-3081379-lemelson-machine-vision";
    const baseParams = {
      scanPathEnabled: 1,
      synchronizedGateEnabled: 1,
      analyzingCircuitEnabled: 1,
      inspectionSignalPresent: 1,
      referenceSignalMatches: 1,
    };

    // 1. Scan path
    const sensScan = computeParameterSensitivity(id, "scanPathEnabled", baseParams);
    expect(sensScan?.metricName).toBe("Claim 1 Scan-Path State");
    expect(sensScan?.derivativeSymbol).toBe("ΔScan / ΔscanPath");
    expect(sensScan?.derivativeValue).toBe(1.0);
    expect(sensScan?.derivativeUnit).toBe("state / state");
    for (const alias of ["scanPath", "scan", "scanEnabled", "beamScan"]) {
      expect(
        computeParameterSensitivity(id, alias, { ...baseParams, [alias]: 1 })?.derivativeValue,
      ).toBe(1.0);
    }

    // 2. Synchronized gate
    const sensGate = computeParameterSensitivity(id, "synchronizedGateEnabled", baseParams);
    expect(sensGate?.metricName).toBe("Claim 1 Synchronized Gate State");
    expect(sensGate?.derivativeSymbol).toBe("ΔGate / ΔsyncGate");
    expect(sensGate?.derivativeValue).toBe(1.0);
    for (const alias of ["synchronizedGate", "gate", "gateEnabled", "syncGate"]) {
      expect(
        computeParameterSensitivity(id, alias, { ...baseParams, [alias]: 1 })?.derivativeValue,
      ).toBe(1.0);
    }

    // 3. Analyzing circuit
    const sensCircuit = computeParameterSensitivity(id, "analyzingCircuitEnabled", baseParams);
    expect(sensCircuit?.metricName).toBe("Claim 1 Analyzing Circuit State");
    expect(sensCircuit?.derivativeSymbol).toBe("ΔCircuit / Δanalyzer");
    expect(sensCircuit?.derivativeValue).toBe(1.0);
    for (const alias of ["analyzingCircuit", "circuit", "analysis", "analyzerEnabled"]) {
      expect(
        computeParameterSensitivity(id, alias, { ...baseParams, [alias]: 1 })?.derivativeValue,
      ).toBe(1.0);
    }

    // 4. Inspection signal
    const sensInspection = computeParameterSensitivity(id, "inspectionSignalPresent", baseParams);
    expect(sensInspection?.metricName).toBe("Inspection Picture Signal Presence");
    expect(sensInspection?.derivativeSymbol).toBe("ΔSignal / Δinspection");
    expect(sensInspection?.derivativeValue).toBe(1.0);
    for (const alias of ["inspectionSignal", "pictureSignal", "signalPresent"]) {
      expect(
        computeParameterSensitivity(id, alias, { ...baseParams, [alias]: 1 })?.derivativeValue,
      ).toBe(1.0);
    }

    // 5. Reference signal match
    const sensRef = computeParameterSensitivity(id, "referenceSignalMatches", baseParams);
    expect(sensRef?.metricName).toBe("Reference Comparison Match State");
    expect(sensRef?.derivativeSymbol).toBe("ΔMatch / Δreference");
    expect(sensRef?.derivativeValue).toBe(1.0);
    for (const alias of ["referenceSignal", "referenceMatch", "referenceMatches", "reference"]) {
      expect(
        computeParameterSensitivity(id, alias, { ...baseParams, [alias]: 1 })?.derivativeValue,
      ).toBe(1.0);
    }

    // 6. Bounds checking
    for (const invalid of [-0.1, 1.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "scanPathEnabled", {
          ...baseParams,
          scanPathEnabled: invalid,
        }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "synchronizedGateEnabled", {
          ...baseParams,
          synchronizedGateEnabled: invalid,
        }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "analyzingCircuitEnabled", {
          ...baseParams,
          analyzingCircuitEnabled: invalid,
        }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "inspectionSignalPresent", {
          ...baseParams,
          inspectionSignalPresent: invalid,
        }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "referenceSignalMatches", {
          ...baseParams,
          referenceSignalMatches: invalid,
        }),
      ).toBeNull();
    }
  });

  test("Boyle–Smith CCD derives timing, frequency, and potential-well sensitivities with full alias support", () => {
    const id = "us-3858232-boyle-smith-ccd";
    const baseParams = {
      pulseWidthToStepRatio: 0.5,
      clockStepRateHz: 1.2,
      pulseDepthNormalized: 0.78,
      running: 1,
    };

    // 1. Pulse width ratio
    const sensRatio = computeParameterSensitivity(id, "pulseWidthToStepRatio", baseParams);
    expect(sensRatio?.metricName).toBe("Pulse Overlap Ratio");
    expect(sensRatio?.derivativeSymbol).toBe("∂(t_p/Δt) / ∂(t_p/Δt)");
    expect(sensRatio?.derivativeValue).toBe(1.0);
    expect(sensRatio?.derivativeUnit).toBe("ratio / ratio");
    for (const alias of ["pulseWidthRatio", "pulseWidth", "ratio", "overlapRatio", "overlap"]) {
      expect(
        computeParameterSensitivity(id, alias, { ...baseParams, [alias]: 0.5 })?.derivativeValue,
      ).toBe(1.0);
    }

    // 2. Clock step rate
    const sensHz = computeParameterSensitivity(id, "clockStepRateHz", baseParams);
    expect(sensHz?.metricName).toBe("Phase Coordinate Velocity");
    expect(sensHz?.derivativeSymbol).toBe("∂(dSteps/dt) / ∂f_{clock}");
    expect(sensHz?.derivativeValue).toBe(1.0);
    expect(sensHz?.derivativeUnit).toBe("steps/s / Hz");
    for (const alias of [
      "clockSpeedFactor",
      "clockRate",
      "stepRate",
      "clockHz",
      "clockSpeed",
      "frequency",
    ]) {
      expect(
        computeParameterSensitivity(id, alias, { ...baseParams, [alias]: 1.2 })?.derivativeValue,
      ).toBe(1.0);
    }

    // 3. Potential-well depth
    const sensDepth = computeParameterSensitivity(id, "pulseDepthNormalized", baseParams);
    expect(sensDepth?.metricName).toBe("Peak Potential-Well Depth");
    expect(sensDepth?.derivativeSymbol).toBe("∂Φ_{peak} / ∂d_{norm}");
    expect(sensDepth?.derivativeValue).toBe(0.88);
    expect(sensDepth?.derivativeUnit).toBe("normalized depth / depth");
    for (const alias of ["pulseDepth", "wellDepth", "depth", "depthNormalized"]) {
      expect(
        computeParameterSensitivity(id, alias, { ...baseParams, [alias]: 0.78 })?.derivativeValue,
      ).toBe(0.88);
    }

    // 4. Running state
    const sensRun = computeParameterSensitivity(id, "running", baseParams);
    expect(sensRun?.metricName).toBe("Clock Sequence Run State");
    expect(sensRun?.derivativeSymbol).toBe("ΔRun / Δrun");
    expect(sensRun?.derivativeValue).toBe(1.0);
    expect(sensRun?.derivativeUnit).toBe("state / state");
    for (const alias of ["run", "clockRunning", "active"]) {
      expect(
        computeParameterSensitivity(id, alias, { ...baseParams, [alias]: 1 })?.derivativeValue,
      ).toBe(1.0);
    }

    // 5. Bounds checking
    for (const invalidRatio of [0.19, 0.81, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "pulseWidthToStepRatio", {
          ...baseParams,
          pulseWidthToStepRatio: invalidRatio,
        }),
      ).toBeNull();
    }
    for (const invalidHz of [0.19, 2.51, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "clockStepRateHz", {
          ...baseParams,
          clockStepRateHz: invalidHz,
        }),
      ).toBeNull();
    }
    for (const invalidDepth of [0.24, 1.01, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "pulseDepthNormalized", {
          ...baseParams,
          pulseDepthNormalized: invalidDepth,
        }),
      ).toBeNull();
    }
    for (const invalidRun of [-0.1, 1.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "running", {
          ...baseParams,
          running: invalidRun,
        }),
      ).toBeNull();
    }
  });

  test("Kamen Transporter derives discrete claim-reading state machine sensitivities", () => {
    const id = "us-5701965-kamen-transporter";
    const baseParams = {
      topologyState: 1,
      claim1BalanceEnabled: 1,
      claim16ClusterEnabled: 1,
    };

    // 1. Topology state
    const sensState = computeParameterSensitivity(id, "topologyState", baseParams);
    expect(sensState?.metricName).toBe("Claim Topology State Index");
    expect(sensState?.derivativeSymbol).toBe("ΔState / Δtopology");
    expect(sensState?.derivativeValue).toBe(1.0);
    expect(sensState?.derivativeUnit).toBe("state / state");
    for (const alias of ["state", "topology", "mode", "operatingMode"]) {
      expect(
        computeParameterSensitivity(id, alias, { ...baseParams, [alias]: 1 })?.derivativeValue,
      ).toBe(1.0);
    }

    // 2. Balance loop
    const sensBalance = computeParameterSensitivity(id, "claim1BalanceEnabled", baseParams);
    expect(sensBalance?.metricName).toBe("Claim 1 Balance Loop State");
    expect(sensBalance?.derivativeSymbol).toBe("ΔBalance / Δloop");
    expect(sensBalance?.derivativeValue).toBe(1.0);
    for (const alias of [
      "claim1BalanceEnabled",
      "balanceTopologyEnabled",
      "balanceEnabled",
      "balanceLoop",
    ]) {
      expect(
        computeParameterSensitivity(id, alias, { ...baseParams, [alias]: 1 })?.derivativeValue,
      ).toBe(1.0);
    }

    // 3. Cluster topology
    const sensCluster = computeParameterSensitivity(id, "claim16ClusterEnabled", baseParams);
    expect(sensCluster?.metricName).toBe("Claim 16 Cluster Topology State");
    expect(sensCluster?.derivativeSymbol).toBe("ΔCluster / Δcluster");
    expect(sensCluster?.derivativeValue).toBe(1.0);
    for (const alias of [
      "claim16ClusterEnabled",
      "clusterTopologyEnabled",
      "clusterEnabled",
      "cluster",
    ]) {
      expect(
        computeParameterSensitivity(id, alias, { ...baseParams, [alias]: 1 })?.derivativeValue,
      ).toBe(1.0);
    }

    // 4. Bounds checking
    for (const invalidState of [-1, 6, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "topologyState", {
          ...baseParams,
          topologyState: invalidState,
        }),
      ).toBeNull();
    }
  });

  test("DaVinci robotic surgical interface derives compatibility, calibration, and engagement sensitivities", () => {
    const id = "us-6331181-davinci";
    const baseParams = {
      compatibilitySignalPresent: 1,
      calibrationRecordAvailable: 1,
      engagementSignalPresent: 1,
    };

    // 1. Compatibility
    const sensCompat = computeParameterSensitivity(id, "compatibilitySignalPresent", baseParams);
    expect(sensCompat?.metricName).toBe("Tool Interface Compatibility");
    expect(sensCompat?.derivativeSymbol).toBe("ΔReady / Δcompat");
    expect(sensCompat?.derivativeValue).toBe(1.0);
    expect(sensCompat?.derivativeUnit).toBe("state / state");
    for (const alias of [
      "compatibility",
      "compatible",
      "compatibilitySignal",
      "tremorFilterEnabled",
    ]) {
      expect(
        computeParameterSensitivity(id, alias, { ...baseParams, [alias]: 1 })?.derivativeValue,
      ).toBe(1.0);
    }

    // 2. Calibration
    const sensCalib = computeParameterSensitivity(id, "calibrationRecordAvailable", baseParams);
    expect(sensCalib?.metricName).toBe("Calibration Record Availability");
    expect(sensCalib?.derivativeSymbol).toBe("ΔReady / Δcalib");
    expect(sensCalib?.derivativeValue).toBe(1.0);
    for (const alias of ["calibration", "calibrationRecord", "calRecord", "calibrationAvailable"]) {
      expect(
        computeParameterSensitivity(id, alias, { ...baseParams, [alias]: 1 })?.derivativeValue,
      ).toBe(1.0);
    }

    // 3. Engagement
    const sensEngage = computeParameterSensitivity(id, "engagementSignalPresent", baseParams);
    expect(sensEngage?.metricName).toBe("Physical Engagement Confirmation");
    expect(sensEngage?.derivativeSymbol).toBe("ΔReady / Δengage");
    expect(sensEngage?.derivativeValue).toBe(1.0);
    for (const alias of ["engagement", "engagementSignal", "engaged", "engagementPresent"]) {
      expect(
        computeParameterSensitivity(id, alias, { ...baseParams, [alias]: 1 })?.derivativeValue,
      ).toBe(1.0);
    }

    // 4. Bounds checking
    for (const invalid of [-0.1, 1.1, Number.NaN]) {
      expect(
        computeParameterSensitivity(id, "compatibilitySignalPresent", {
          ...baseParams,
          compatibilitySignalPresent: invalid,
        }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "calibrationRecordAvailable", {
          ...baseParams,
          calibrationRecordAvailable: invalid,
        }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "engagementSignalPresent", {
          ...baseParams,
          engagementSignalPresent: invalid,
        }),
      ).toBeNull();
    }
  });
});
