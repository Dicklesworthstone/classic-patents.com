import { describe, expect, test } from "bun:test";
import {
  addIntervals,
  assertSingleSupportedRegime,
  createInterval,
  DIESEL_IGNITION_REGIMES,
  divIntervals,
  EDISON_VACUUM_REGIMES,
  evaluateRegime,
  FERMI_CRITICALITY_REGIMES,
  formatInterval,
  GOODYEAR_CURE_REGIMES,
  HALL_ELECTROLYSIS_REGIMES,
  IntervalRefusalError,
  intervalContains,
  intervalHull,
  intervalIntersect,
  intervalMid,
  intervalsOverlap,
  intervalWidth,
  mulIntervals,
  scaleInterval,
  subIntervals,
  WRIGHT_AERODYNAMIC_REGIMES,
} from "./intervals";

describe("Parameter Intervals, Uncertainty Kinds, and Regime Predicates", () => {
  test("creates immutable intervals and validates bounds", () => {
    const ivl = createInterval(10, 60, "mph", "scenario-range", "Wright flight speed");
    expect(ivl.min).toBe(10);
    expect(ivl.max).toBe(60);
    expect(ivl.unit).toBe("mph");
    expect(ivl.kind).toBe("scenario-range");
    expect(ivl.sourceNote).toBe("Wright flight speed");

    // Rejects inverted bounds
    expect(() => createInterval(60, 10)).toThrow("cannot exceed max");

    // Rejects non-finite bounds
    expect(() => createInterval(Number.NaN, 50)).toThrow("must be finite");
    expect(() => createInterval(10, Number.POSITIVE_INFINITY)).toThrow("must be finite");
  });

  test("distinguishes source uncertainty, scenario ranges, and numerical tolerances", () => {
    const sourceIvl = createInterval(100, 500, "Ω", "source-uncertainty", "US 223,898 patent text");
    const scenarioIvl = createInterval(
      10,
      60,
      "mph",
      "scenario-range",
      "Audited museum flight corridor",
    );
    const numericalIvl = createInterval(
      -1e-6,
      1e-6,
      "W",
      "numerical-tolerance",
      "Solver convergence residue",
    );

    expect(sourceIvl.kind).toBe("source-uncertainty");
    expect(scenarioIvl.kind).toBe("scenario-range");
    expect(numericalIvl.kind).toBe("numerical-tolerance");

    expect(formatInterval(sourceIvl)).toBe("[100.00, 500.00] Ω (source-uncertainty)");
    expect(formatInterval(scenarioIvl)).toBe("[10.00, 60.00] mph (scenario-range)");
  });

  test("computes correct interval arithmetic and outward enclosure", () => {
    const a = createInterval(2, 5, "m");
    const b = createInterval(1, 3, "m");

    // Addition: [2+1, 5+3] = [3, 8]
    const sum = addIntervals(a, b);
    expect(sum.min).toBe(3);
    expect(sum.max).toBe(8);

    // Subtraction: [2-3, 5-1] = [-1, 4]
    const diff = subIntervals(a, b);
    expect(diff.min).toBe(-1);
    expect(diff.max).toBe(4);

    // Multiplication: [2*1, 5*3] = [2, 15]
    const prod = mulIntervals(a, b);
    expect(prod.min).toBe(2);
    expect(prod.max).toBe(15);

    // Division: [2/3, 5/1]
    const quot = divIntervals(a, b);
    expect(quot).not.toBeNull();
    if (!quot) throw new Error("Expected quot to be defined");
    expect(quot.min).toBeCloseTo(2 / 3, 5);
    expect(quot.max).toBe(5);

    // Division by zero interval is cleanly refused (returns null)
    const zeroDivisor = createInterval(-1, 2, "m");
    expect(divIntervals(a, zeroDivisor)).toBeNull();

    // Scale
    const scaled = scaleInterval(a, 2.5);
    expect(scaled.min).toBe(5);
    expect(scaled.max).toBe(12.5);

    // Width and mid
    expect(intervalWidth(a)).toBe(3);
    expect(intervalMid(a)).toBe(3.5);

    // Containment and overlap
    expect(intervalContains(a, 2)).toBe(true);
    expect(intervalContains(a, 4)).toBe(true);
    expect(intervalContains(a, 5)).toBe(true);
    expect(intervalContains(a, 1.99)).toBe(false);
    expect(intervalsOverlap(a, b)).toBe(true);

    // Intersection
    const inter = intervalIntersect(a, b);
    expect(inter).not.toBeNull();
    if (!inter) throw new Error("Expected inter to be defined");
    expect(inter.min).toBe(2);
    expect(inter.max).toBe(3);

    // Hull
    const hull = intervalHull(a, b);
    expect(hull.min).toBe(1);
    expect(hull.max).toBe(5);
  });

  test("evaluates Goodyear vulcanization temperature regimes and refuses out-of-domain points", () => {
    // In-regime optimal cure: 145 C
    const cure = evaluateRegime(GOODYEAR_CURE_REGIMES, 145);
    expect(cure.admitted).toBe(true);
    expect(cure.isSingleRegime).toBe(true);
    expect(cure.primaryRegime).toBe("cure");
    expect(cure.crossesBoundary).toBe(false);

    // Cold regime: 80 C
    const cold = evaluateRegime(GOODYEAR_CURE_REGIMES, 80);
    expect(cold.admitted).toBe(true);
    expect(cold.primaryRegime).toBe("too-cold");

    // Scorch degradation regime: 190 C
    const scorch = evaluateRegime(GOODYEAR_CURE_REGIMES, 190);
    expect(scorch.admitted).toBe(true);
    expect(scorch.primaryRegime).toBe("scorch");

    // Out-of-bounds: 350 C
    const outOfBounds = evaluateRegime(GOODYEAR_CURE_REGIMES, 350);
    expect(outOfBounds.admitted).toBe(false);
    expect(outOfBounds.refusalReason).toContain("outside all declared");
  });

  test("refuses scalar answers when interval spans multiple physical regimes", () => {
    // Interval [100, 150] spans "too-cold" (< 110) and "cure" (110 - 170)
    const spanningIvl = createInterval(100, 150, "°C", "scenario-range");
    const evalSpanning = evaluateRegime(GOODYEAR_CURE_REGIMES, spanningIvl);

    expect(evalSpanning.admitted).toBe(true);
    expect(evalSpanning.isSingleRegime).toBe(false);
    expect(evalSpanning.crossesBoundary).toBe(true);
    expect(evalSpanning.activeRegimes).toEqual(["too-cold", "cure"]);
    expect(evalSpanning.refusalReason).toContain("spans multiple physical regimes");
    expect(evalSpanning.refusalReason).toContain("scalar evaluation refused");

    // assertSingleSupportedRegime must throw an explicit IntervalRefusalError
    expect(() => assertSingleSupportedRegime(GOODYEAR_CURE_REGIMES, spanningIvl)).toThrow(
      IntervalRefusalError,
    );
  });

  test("evaluates Edison lamp vacuum regimes and catches atmospheric burnout regime", () => {
    // High vacuum: 1e-4 Torr (admitted)
    const highVac = evaluateRegime(EDISON_VACUUM_REGIMES, 1e-4);
    expect(highVac.admitted).toBe(true);
    expect(highVac.primaryRegime).toBe("high-vacuum");

    // Atmospheric air intrusion: 760 Torr (unsupported, causes burnout)
    const atm = evaluateRegime(EDISON_VACUUM_REGIMES, 760);
    expect(atm.admitted).toBe(false);
    expect(atm.activeRegimes).toContain("atmospheric-burnout");
    expect(atm.refusalReason).toContain("unsupported regime");

    expect(() => assertSingleSupportedRegime(EDISON_VACUUM_REGIMES, 760)).toThrow(
      IntervalRefusalError,
    );
  });

  test("evaluates Fermi pile criticality and refuses prompt runaway", () => {
    // Delayed critical: k_eff = 1.0005
    const crit = evaluateRegime(FERMI_CRITICALITY_REGIMES, 1.0005);
    expect(crit.admitted).toBe(true);
    expect(crit.primaryRegime).toBe("delayed-critical");

    // Subcritical: k_eff = 0.95
    const sub = evaluateRegime(FERMI_CRITICALITY_REGIMES, 0.95);
    expect(sub.admitted).toBe(true);
    expect(sub.primaryRegime).toBe("subcritical");

    // Prompt supercritical: k_eff = 1.05 (unsupported runaway)
    const prompt = evaluateRegime(FERMI_CRITICALITY_REGIMES, 1.05);
    expect(prompt.admitted).toBe(false);
    expect(prompt.refusalReason).toContain("unsupported regime");
  });

  test("evaluates Wright aerodynamics AoA regimes and catches wing stall", () => {
    // Attached linear flow: 4 deg
    const attached = evaluateRegime(WRIGHT_AERODYNAMIC_REGIMES, 4);
    expect(attached.admitted).toBe(true);
    expect(attached.primaryRegime).toBe("attached-linear");

    // Severe wing stall: 22 deg
    const stall = evaluateRegime(WRIGHT_AERODYNAMIC_REGIMES, 22);
    expect(stall.admitted).toBe(false);
    expect(stall.refusalReason).toContain("unsupported regime");
  });

  test("evaluates Hall electrolysis and catches frozen electrolyte", () => {
    // Normal molten cryolite: 960 C
    const normal = evaluateRegime(HALL_ELECTROLYSIS_REGIMES, 960);
    expect(normal.admitted).toBe(true);
    expect(normal.primaryRegime).toBe("normal-electrolysis");

    // Frozen bath: 800 C
    const frozen = evaluateRegime(HALL_ELECTROLYSIS_REGIMES, 800);
    expect(frozen.admitted).toBe(false);
    expect(frozen.refusalReason).toContain("unsupported regime");
  });

  test("evaluates Diesel compression ignition and catches pre-ignition threshold", () => {
    // Self-ignition: 18:1
    const selfIgnition = evaluateRegime(DIESEL_IGNITION_REGIMES, 18);
    expect(selfIgnition.admitted).toBe(true);
    expect(selfIgnition.primaryRegime).toBe("self-ignition");

    // Pre-ignition insufficient compression: 8:1
    const pre = evaluateRegime(DIESEL_IGNITION_REGIMES, 8);
    expect(pre.admitted).toBe(false);
    expect(pre.refusalReason).toContain("unsupported regime");
  });
});
