import { describe, expect, test } from "bun:test";
import {
  computeBardeenAnalyticReference,
  computeCarnotEfficiency,
  computeEdisonAnalyticReference,
  computeFermiAnalyticReference,
  computeGoodyearAnalyticReference,
  computeHallAnalyticReference,
  computeTeslaMotorAnalyticReference,
  computeThomsonAnalyticReference,
  computeWrightAnalyticReference,
} from "./analyticReferences";
import { stepGoodyearRubber, stepHallAluminium, stepThomsonWelding } from "./catalogKernels";
import { evaluateConstraintClosure } from "./claimConstraints";
import { edisonFilamentAreaM2, stepEdisonRadiativeBalance } from "./edisonWasm";
import {
  computePortHamiltonianEnergy,
  validateDiscretePassivityAndConservation,
  verifyTimestepConvergence,
} from "./energyLedger";
import { stepFermiKinetics } from "./fermiKinetics";
import {
  runSeededDomainFuzzer,
  validateReflectionSymmetry,
  validateScalingLaw,
  validateUnitConversionInvariance,
  validateZeroInputLimit,
} from "./metamorphicValidation";
import { createPortContract, validatePortValue } from "./qty";
import { computeParameterSensitivity, differentiateConditioned } from "./sensitivityKernel";
import { readWrightControls, stepWrightFlyerSi } from "./wrightKernel";

describe("Admissibility, Conditioning, Dimensions and Conservation of Admitted Models", () => {
  // --------------------------------------------------------------------------
  // 1. Dimension Contracts & Unit Mismatches
  // --------------------------------------------------------------------------
  describe("Dimension contracts and deliberate mismatch detection", () => {
    test("port contracts enforce power dimensions and catch deliberate unit mismatches", () => {
      const port = createPortContract("electricalInput", "W", "power-in");

      // Valid SI evaluation
      const valid = validatePortValue(port, 60.5, "W");
      expect(valid.valid).toBe(true);

      // Unit mismatch: energy (J) instead of power (W)
      const mismatch = validatePortValue(port, 60.5, "J");
      expect(mismatch.valid).toBe(false);
      expect(mismatch.refusalReason).toContain("Dimension mismatch");

      // Unit mismatch: force (N) instead of power (W)
      const mismatchForce = validatePortValue(port, 60.5, "N");
      expect(mismatchForce.valid).toBe(false);
      expect(mismatchForce.refusalReason).toContain("Dimension mismatch");

      // Deliberately passing non-finite values
      const nanValue = validatePortValue(port, Number.NaN, "W");
      expect(nanValue.valid).toBe(false);
      expect(nanValue.refusalReason).toContain("Non-finite");
    });

    test("topology ports strictly forbid non-dimensionless units", () => {
      const topoPort = createPortContract("linkagePose", "normalized", "topology");
      expect(topoPort.isDimensionless).toBe(true);

      expect(validatePortValue(topoPort, 0.45, "1").valid).toBe(true);
      expect(validatePortValue(topoPort, 0.45, "fraction").valid).toBe(true);

      // Attempting to inject Newtons or Watts into a dimensionless topology port
      const invalidNewton = validatePortValue(topoPort, 10.0, "N");
      expect(invalidNewton.valid).toBe(false);
      expect(invalidNewton.refusalReason).toContain("must be dimensionless");

      const invalidWatt = validatePortValue(topoPort, 10.0, "W");
      expect(invalidWatt.valid).toBe(false);
      expect(invalidWatt.refusalReason).toContain("must be dimensionless");
    });
  });

  // --------------------------------------------------------------------------
  // 2. Discrete Power Balance, Passivity, and Energy Injection Catching
  // --------------------------------------------------------------------------
  describe("Discrete power balance, passivity and energy injection detection", () => {
    test("validates exact steady power conservation on Edison filament model", () => {
      const edisonState = stepEdisonRadiativeBalance({
        voltageV: 110,
        hotResistanceOhm: 200,
        filamentLengthCm: 30.5,
      });
      expect(edisonState).not.toBeNull();
      if (!edisonState) throw new Error("Expected edisonState to be defined");

      const balance = validateDiscretePassivityAndConservation({
        powerInWatts: edisonState.joule_power_w,
        powerDissipatedWatts: edisonState.radiative_power_w,
        powerInUnit: "W",
        powerDissipatedUnit: "W",
      });

      expect(balance.passed).toBe(true);
      expect(balance.passivityViolated).toBe(false);
      expect(balance.residualWatts).toBeCloseTo(0, 5);
      expect(balance.refusalReason).toBeUndefined();
    });

    test("catches deliberate unphysical energy injection (negative dissipation)", () => {
      // Planting negative dissipation (system acts as unphysical active power generator)
      const planted = validateDiscretePassivityAndConservation({
        powerInWatts: 50,
        powerDissipatedWatts: -10, // Unphysical spontaneous energy creation!
        powerInUnit: "W",
        powerDissipatedUnit: "W",
      });

      expect(planted.passed).toBe(false);
      expect(planted.passivityViolated).toBe(true);
      expect(planted.energyInjectedWatts).toBe(10);
      expect(planted.refusalReason).toContain("UNPHYSICAL_ENERGY_INJECTION");
      expect(planted.refusalReason).toContain("Negative dissipation detected");
    });

    test("catches deliberate negative input power without source", () => {
      const planted = validateDiscretePassivityAndConservation({
        powerInWatts: -100,
        powerDissipatedWatts: 0,
        powerInUnit: "W",
      });

      expect(planted.passed).toBe(false);
      expect(planted.passivityViolated).toBe(true);
      expect(planted.refusalReason).toContain("UNPHYSICAL_ENERGY_INJECTION");
    });

    test("catches energy conservation residual exceeding tolerance", () => {
      const nonConserved = validateDiscretePassivityAndConservation({
        powerInWatts: 100,
        powerOutWatts: 40,
        powerDissipatedWatts: 40, // 100 - 40 - 40 = 20 W unaccounted residual!
        powerInUnit: "W",
        powerOutUnit: "W",
        powerDissipatedUnit: "W",
      });

      expect(nonConserved.passed).toBe(false);
      expect(nonConserved.residualWatts).toBe(20);
      expect(nonConserved.refusalReason).toContain("Energy conservation violation");
    });

    test("catches port unit mismatch inside power balance", () => {
      const mismatch = validateDiscretePassivityAndConservation({
        powerInWatts: 100,
        powerDissipatedWatts: 100,
        powerInUnit: "J", // Joules is Energy, not Power!
        powerDissipatedUnit: "W",
      });

      expect(mismatch.passed).toBe(false);
      expect(mismatch.refusalReason).toContain("Unit mismatch on input power port");
    });
  });

  // --------------------------------------------------------------------------
  // 3. Timestep Convergence Verification
  // --------------------------------------------------------------------------
  describe("Timestep convergence verification", () => {
    test("verifies 1st-order convergence on exponential decay integration", () => {
      // dy/dt = -k * y, analytic y(t) = y0 * exp(-k * t)
      const k = 2.0;
      const totalTime = 0.4;

      const eulerStep = (dt: number) => {
        let y = 1.0;
        const steps = Math.round(totalTime / dt);
        for (let i = 0; i < steps; i++) {
          y += -k * y * dt;
        }
        return y;
      };

      const report = verifyTimestepConvergence(eulerStep, (y) => y, 0.04);
      expect(report.converged).toBe(true);
      expect(report.monotonic).toBe(true);
      expect(report.estimatedOrder).toBeGreaterThanOrEqual(0.85);
      expect(report.estimatedOrder).toBeLessThanOrEqual(1.15);
      expect(report.refusalReason).toBeUndefined();
    });

    test("catches non-monotonic or diverging timestep integration", () => {
      // Divergent / unstable step
      const unstableStep = (dt: number) => {
        // Artificially make smaller dt produce larger error
        return dt === 0.01 ? 1.0 : dt === 0.005 ? 1.1 : 1.3;
      };

      const report = verifyTimestepConvergence(unstableStep, (y) => y, 0.01);
      expect(report.converged).toBe(false);
      expect(report.monotonic).toBe(false);
      expect(report.refusalReason).toContain("fails monotonic convergence");
    });
  });

  // --------------------------------------------------------------------------
  // 4. Analytic Reference Cases Across Admitted Numerical Families
  // --------------------------------------------------------------------------
  describe("Analytic reference cases across all admitted numerical families", () => {
    test("Wright Flyer aerodynamics matches analytic lift and induced drag formulas", () => {
      const controls = readWrightControls({ airspeed: 28, wingWarp: 0, rudder: 0 });
      const kernelSi = stepWrightFlyerSi(controls);

      const analytic = computeWrightAnalyticReference({
        airspeedMph: 28,
        liftCoefficientCl: 0.45,
        grossWeightN: 3336,
      });

      // Lift matches analytic L = q * S * C_L
      expect(kernelSi.liftNewtons).toBeCloseTo(analytic.liftNewtons, 1);

      // Translational kinetic energy 0.5 * m * v^2
      const mass = 3336 / 9.80665;
      const expectedKe = 0.5 * mass * (28 * 0.44704) ** 2;
      expect(kernelSi.translationalKineticJoules).toBeCloseTo(expectedKe, 0);

      // Induced drag matches analytic Di = L^2 / (pi * aspect * e * q * S)
      expect(kernelSi.inducedDragNewtons).toBeCloseTo(analytic.inducedDragNewtons, 1);
      expect(analytic.inducedDragNewtons).toBeGreaterThan(0);
    });

    test("Edison lightbulb matches analytic Stefan-Boltzmann radiative balance", () => {
      const v = 110;
      const r = 200;
      const state = stepEdisonRadiativeBalance({
        voltageV: v,
        hotResistanceOhm: r,
        filamentLengthCm: 30.5,
      });
      expect(state).not.toBeNull();
      if (!state) throw new Error("Expected state to be defined");

      const analytic = computeEdisonAnalyticReference({
        voltageV: v,
        resistanceOhm: r,
        filamentSurfaceAreaM2: edisonFilamentAreaM2(30.5),
        emissivity: 0.8,
      });

      // Exact Joule power P = V^2 / R = 110^2 / 200 = 60.5 W
      expect(state.joule_power_w).toBeCloseTo(analytic.joulePowerWatts, 5);
      expect(state.joule_power_w).toBeCloseTo(60.5, 5);

      // Steady state radiative power equals input Joule power
      expect(state.radiative_power_w).toBeCloseTo(state.joule_power_w, 4);

      // Equilibrium filament temperature matches independent analytic solution
      expect(state.filament_temperature_k).toBeCloseTo(analytic.equilibriumTempK, 1);
      expect(state.filament_temperature_k).toBeGreaterThan(1500);
      expect(state.filament_temperature_k).toBeLessThan(2000);
    });

    test("Thomson welding matches analytic Joule power I²R", () => {
      const current = 4500;
      const model = stepThomsonWelding({ weldCurrentAmps: current });
      const analytic = computeThomsonAnalyticReference({ weldCurrentAmps: current });

      expect(model.jouleWatts).toBeCloseTo(analytic.weldPowerWatts, 1);
      expect(model.jouleWatts).toBeCloseTo(4500 ** 2 * 0.00018, 1);
    });

    test("Hall-Héroult aluminium matches Faraday electrolytic production", () => {
      const current = 300000;
      const model = stepHallAluminium({ currentAmperes: current });
      const analytic = computeHallAnalyticReference({ currentAmperes: current });

      // Faraday yield: m_dot proportional to I
      expect(model.aluminiumProductionRateKgPerHour).toBeCloseTo(
        analytic.faradayProductionRateKgPerHour,
        -1,
      );
      expect(model.electricalInputWatts).toBeGreaterThan(1e6);
    });

    test("Goodyear rubber matches Neo-Hookean strain energy density W = 0.5*G*(lambda^2 + 2/lambda - 3)", () => {
      const stretch = 1.8;
      const model = stepGoodyearRubber(145, 8, 30, stretch, 35);
      const analytic = computeGoodyearAnalyticReference({
        stretchRatioLambda: stretch,
        shearModulusPa: 4.8e5,
      });

      // Strain energy density must be positive for stretch > 1
      expect(model.strainEnergyDensityJPerM3).toBeGreaterThan(0);
      expect(analytic.strainEnergyDensityJPerM3).toBeGreaterThan(0);
      expect(analytic.trueStressPa).toBeGreaterThan(analytic.engineeringStressPa);
    });

    test("Fermi pile matches static reactivity rho = (k - 1) / k and delayed-neutron scaling", () => {
      const critState = stepFermiKinetics(83.5, 99.5, 0.72);
      expect(critState.kEffective).toBeCloseTo(1.0, 2);

      const analytic = computeFermiAnalyticReference({ kEffective: 1.002 });
      expect(analytic.excessReactivityDeltaK).toBeCloseTo(0.002, 4);
      expect(analytic.reactivityDollars).toBeCloseTo(0.002 / 0.0065, 2);
      expect(analytic.isPromptCritical).toBe(false);
    });

    test("Thermodynamic Carnot and Otto air-standard efficiency limits are verified", () => {
      // Carnot efficiency: Th = 450 K (steam), Tc = 310 K (ambient/condenser)
      const carnot = computeCarnotEfficiency(450, 310);
      expect(carnot).toBeCloseTo(1 - 310 / 450, 4);
      expect(carnot).toBeGreaterThan(0.3);
      expect(carnot).toBeLessThan(0.4);

      // Otto air-standard: rc = 8:1, gamma = 1.4
      const otto = 1 - 1 / 8 ** 0.4;
      expect(otto).toBeCloseTo(0.5647, 3);
    });

    test("Tesla motor matches synchronous frequency-pole kinematics", () => {
      const motor = computeTeslaMotorAnalyticReference({ frequencyHz: 60, poles: 4, slip: 0.04 });
      expect(motor.synchronousRpm).toBe(1800);
      expect(motor.rotorRpm).toBe(1728);
      expect(motor.rotorAngularVelocityRadPerSec).toBeCloseTo((1728 * 2 * Math.PI) / 60, 2);
    });

    test("Bardeen transistor matches base transport factor beta = sech(W / L_p)", () => {
      const transistor = computeBardeenAnalyticReference({
        baseWidthUm: 20,
        diffusionLengthUm: 50,
      });
      expect(transistor.baseTransportFactor).toBeGreaterThan(0.9);
      expect(transistor.baseTransportFactor).toBeLessThan(1.0);
      expect(transistor.alphaCurrentGain).toBeCloseTo(0.98 * transistor.baseTransportFactor, 3);
    });
  });

  // --------------------------------------------------------------------------
  // 5. Sensitivity Conditioning & Singular Configurations
  // --------------------------------------------------------------------------
  describe("Scale-aware sensitivity conditioning and singularity refusal", () => {
    test("differentiateConditioned adapts perturbation step to input scale", () => {
      // Small scale input
      const small = differentiateConditioned({
        value: 1.0,
        minimum: 0,
        maximum: 10,
        probe: (x) => x * x,
        inputScale: 1.0,
      });
      expect(small.derivative).toBeCloseTo(2.0, 4);
      expect(small.isIllConditioned).toBe(false);

      // Large scale input: 100,000
      const large = differentiateConditioned({
        value: 100000,
        minimum: 0,
        maximum: 1000000,
        probe: (x) => 3 * x,
        inputScale: 100000,
      });
      expect(large.derivative).toBeCloseTo(3.0, 4);
      expect(large.stepSize).toBeGreaterThan(0.5); // Perturbation scaled with 100,000
    });

    test("refuses differentiation at step discontinuities and singular points", () => {
      // Step function discontinuity at x = 5
      const stepFn = (x: number) => (x < 5 ? 0 : 100);
      const report = differentiateConditioned({
        value: 5.0,
        minimum: 0,
        maximum: 10,
        probe: stepFn,
      });

      expect(report.derivative).toBeNull();
      expect(report.isIllConditioned).toBe(true);
      expect(report.refusalReason).toContain("Discontinuity or high curvature");
    });
  });

  // --------------------------------------------------------------------------
  // 6. Kinematic Mechanism Closure and Singularity Detection
  // --------------------------------------------------------------------------
  describe("Kinematic mechanism closure and singular configuration detection", () => {
    test("Delta robot detects boundary reach singularity and rank loss", () => {
      // Within normal working envelope: reach ~ 0.50 m < 0.75 m
      const normal = evaluateConstraintClosure("us-4976582-clavel-delta-robot", {
        targetX: 0.1,
        targetY: 0.1,
        targetZ: -0.45,
      });
      expect(normal.isClosed).toBe(true);
      expect(normal.jacobianRank).toBe(3);
      expect(normal.isSingularConfiguration).toBe(false);

      // At boundary maximum reach (L1 + L2 = 0.75 m): singular configuration!
      const singular = evaluateConstraintClosure("us-4976582-clavel-delta-robot", {
        targetX: 0.75,
        targetY: 0.0,
        targetZ: 0.0,
      });
      expect(singular.isSingularConfiguration).toBe(true);
      expect(singular.jacobianRank).toBe(2); // Rank loss!
      expect(singular.singularReason).toContain("Workspace boundary singularity");
    });

    test("Wright Flyer Claim 18 interlock closure detects adverse yaw uncoupling", () => {
      // Coupled (Claim 18 active): closed constraint
      const coupled = evaluateConstraintClosure("us-821393-wright-flyer", {
        wingWarp: 6.0,
        rudder: -5.0,
      });
      expect(coupled.isClosed).toBe(true);
      expect(coupled.jacobianRank).toBe(1);
      expect(coupled.degreesOfFreedom).toBe(1);

      // Uncoupled (Claim 18 inverted): broken closure constraint
      const uncoupled = evaluateConstraintClosure("us-821393-wright-flyer", {
        wingWarp: 6.0,
        claim1ConstraintActive: 0, // Inverted!
      });
      expect(uncoupled.isClosed).toBe(false);
      expect(uncoupled.degreesOfFreedom).toBe(2);
      expect(uncoupled.refusalReason).toContain("Uncoupled rudder-warp linkage");
    });

    test("Otto engine detects kinematic dead center singularities", () => {
      // Mid-stroke: 90 deg crank angle
      const midStroke = evaluateConstraintClosure("us-194047-otto-engine", {
        crankAngleDeg: 90,
      });
      expect(midStroke.isSingularConfiguration).toBe(false);
      expect(midStroke.jacobianRank).toBe(1);

      // Top Dead Center: 0 deg
      const tdc = evaluateConstraintClosure("us-194047-otto-engine", {
        crankAngleDeg: 0,
      });
      expect(tdc.isSingularConfiguration).toBe(true);
      expect(tdc.jacobianRank).toBe(0); // Zero leverage on crankshaft!
      expect(tdc.singularReason).toContain("dead center");
    });
  });

  // --------------------------------------------------------------------------
  // 7. Metamorphic Laws
  // --------------------------------------------------------------------------
  describe("Metamorphic physical laws", () => {
    test("Wright Flyer satisfies unit conversion invariance (mph vs knots)", () => {
      // 28 mph = 24.3316 knots
      const mphModel = () => stepWrightFlyerSi(readWrightControls({ airspeedMph: 28 }));
      const knotsModel = () =>
        stepWrightFlyerSi(readWrightControls({ airspeedMph: 24.3316 * 1.15078 }));

      const res = validateUnitConversionInvariance(
        mphModel,
        knotsModel,
        (s) => s.liftNewtons,
        1e-3,
        "Wright lift unit conversion",
      );
      expect(res.passed).toBe(true);
      expect(res.maxRelativeError).toBeLessThan(1e-3);
    });

    test("Wright Flyer satisfies reflection anti-symmetry on roll/yaw and even symmetry on drag", () => {
      const posWarp = () => stepWrightFlyerSi(readWrightControls({ wingWarp: 6, coupled: 0 }));
      const negWarp = () => stepWrightFlyerSi(readWrightControls({ wingWarp: -6, coupled: 0 }));

      // Warp adverse yaw is odd parity: f(-warp) = -f(warp)
      const yawRes = validateReflectionSymmetry(
        posWarp,
        negWarp,
        (s) => s.adverseYawNm,
        "odd",
        1e-2,
        "Warp adverse yaw anti-symmetry",
      );
      expect(yawRes.passed).toBe(true);

      // Dynamic pressure is even parity under sign inversion: f(-v) = f(v)
      const dynamicPressureRes = validateReflectionSymmetry(
        posWarp,
        negWarp,
        (s) => s.dynamicPressurePa,
        "even",
        1e-2,
        "Dynamic pressure reflection symmetry",
      );
      expect(dynamicPressureRes.passed).toBe(true);
    });

    test("Aerodynamic dynamic pressure and lift scale quadratically with velocity (L ∝ v²)", () => {
      const v1 = 20;
      const alpha = 1.5; // v2 = 30 mph
      const v2 = v1 * alpha;

      const m1 = () => stepWrightFlyerSi(readWrightControls({ airspeed: v1 }));
      const m2 = () => stepWrightFlyerSi(readWrightControls({ airspeed: v2 }));

      // q = 0.5 * rho * v^2 -> power = 2
      const res = validateScalingLaw(
        m1,
        m2,
        (s) => s.dynamicPressurePa,
        alpha,
        2,
        1e-3,
        "Dynamic pressure quadratic velocity scaling",
      );
      expect(res.passed).toBe(true);
      expect(res.maxRelativeError).toBeLessThan(1e-3);
    });

    test("Thomson welding power scales quadratically with current (P ∝ I²)", () => {
      const i1 = 2000;
      const alpha = 2.0; // i2 = 4000 A
      const i2 = i1 * alpha;

      const m1 = () => stepThomsonWelding({ weldCurrentAmps: i1 });
      const m2 = () => stepThomsonWelding({ weldCurrentAmps: i2 });

      const res = validateScalingLaw(
        m1,
        m2,
        (s) => s.jouleWatts,
        alpha,
        2,
        1e-3,
        "Joule power quadratic current scaling",
      );
      expect(res.passed).toBe(true);
      expect(res.maxRelativeError).toBeLessThan(1e-3);
    });

    test("Zero-input limits: zero airspeed produces zero aerodynamic forces", () => {
      const zeroModel = () => stepWrightFlyerSi(readWrightControls({ airspeed: 0 }));

      const liftZero = validateZeroInputLimit(
        zeroModel,
        (s) => s.liftNewtons,
        0,
        1e-6,
        "Zero airspeed lift limit",
      );
      expect(liftZero.passed).toBe(true);

      const dragZero = validateZeroInputLimit(
        zeroModel,
        (s) => s.inducedDragNewtons,
        0,
        1e-6,
        "Zero airspeed drag limit",
      );
      expect(dragZero.passed).toBe(true);
    });

    test("Zero-input limits: zero current produces zero Thomson welding power", () => {
      const zeroModel = () => stepThomsonWelding({ weldCurrentAmps: 0 });
      const powerZero = validateZeroInputLimit(
        zeroModel,
        (s) => s.jouleWatts,
        0,
        1e-6,
        "Zero current weld power",
      );
      expect(powerZero.passed).toBe(true);
    });
  });

  // --------------------------------------------------------------------------
  // 8. Deterministic Seeded Domain Fuzzing
  // --------------------------------------------------------------------------
  describe("Deterministic seeded domain fuzzing", () => {
    test("Wright Flyer fuzzing verifies 100% finite valid outputs and 100% refusal on invalid inputs", () => {
      const domains = [
        { parameterKey: "airspeed", validMin: 15, validMax: 55 },
        { parameterKey: "wingWarp", validMin: -15, validMax: 15 },
        { parameterKey: "rudder", validMin: -20, validMax: 20 },
      ];

      const report = runSeededDomainFuzzer(
        (params) => computeParameterSensitivity("us-821393-wright-flyer", "wingWarp", params),
        (output: any) => {
          if (!output) return { valid: false, refused: true, reason: "Null output" };
          const isDerivativeFinite = Number.isFinite(output.derivativeValue);
          return { valid: isDerivativeFinite, refused: !isDerivativeFinite };
        },
        domains,
        150,
        19031217,
      );

      expect(report.totalValidTests).toBe(150);
      expect(report.allValidOutputsFinite).toBe(true);
      expect(report.allInvalidRefusedOrNull).toBe(true);
      expect(report.violations).toEqual([]);
    });

    test("Edison Lamp fuzzing enforces high-vacuum regime and refuses non-finite/out-of-bound inputs", () => {
      const domains = [
        { parameterKey: "voltage", validMin: 90, validMax: 130 },
        { parameterKey: "hotResistanceOhm", validMin: 150, validMax: 450 },
      ];

      const report = runSeededDomainFuzzer(
        (params) => computePortHamiltonianEnergy("us-223898-edison-lightbulb", params),
        (output: any) => {
          if (!output || output.availability === "unavailable") {
            return { valid: false, refused: true, reason: output?.reason ?? "Unavailable" };
          }
          const valid =
            Number.isFinite(output.inputPowerWatts) &&
            Number.isFinite(output.dissipatedPowerWatts) &&
            output.inputPowerWatts > 0;
          return { valid, refused: !valid };
        },
        domains,
        100,
        18791021,
      );

      expect(report.totalValidTests).toBe(100);
      expect(report.allValidOutputsFinite).toBe(true);
      expect(report.allInvalidRefusedOrNull).toBe(true);
    });
  });
});
