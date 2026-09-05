/**
 * metamorphicValidation.ts
 *
 * Metamorphic testing laws and deterministic seeded fuzzing engine.
 * Validates fundamental physical laws:
 * 1. Unit conversion invariance (SI vs Imperial equivalence)
 * 2. Reflection and parity symmetry (even/odd mechanical response)
 * 3. Homogeneous physical scaling (quadratic, linear, quartic)
 * 4. Zero-input boundary limits (conservation at rest)
 * 5. Deterministic domain fuzzing (valid exploration & refusal on invalid/singular points)
 */

export interface MetamorphicTestResult {
  readonly law: "unit-conversion" | "symmetry" | "scaling" | "zero-limit";
  readonly passed: boolean;
  readonly maxRelativeError: number;
  readonly tolerance: number;
  readonly details: string;
}

/**
 * Deterministic 32-bit Mulberry32 Pseudo-Random Number Generator.
 * Guarantees cross-platform, deterministic replay without ambient PRNG state.
 */
export function createSeededPrng(seed: number = 19031217): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Validates unit conversion invariance.
 * Running the model with input in Unit A vs Unit B must produce identical
 * SI results within conversion rounding tolerance.
 */
export function validateUnitConversionInvariance<T>(
  modelA: () => T,
  modelB: () => T,
  extractor: (res: T) => number,
  tolerance: number = 1e-3,
  description: string = "Unit conversion invariance",
): MetamorphicTestResult {
  const valA = extractor(modelA());
  const valB = extractor(modelB());

  if (!Number.isFinite(valA) || !Number.isFinite(valB)) {
    return {
      law: "unit-conversion",
      passed: false,
      maxRelativeError: Number.POSITIVE_INFINITY,
      tolerance,
      details: `${description}: Produced non-finite outputs (valA=${valA}, valB=${valB}).`,
    };
  }

  const denom = Math.max(1.0, Math.abs(valA), Math.abs(valB));
  const relErr = Math.abs(valA - valB) / denom;
  const passed = relErr <= tolerance;

  return {
    law: "unit-conversion",
    passed,
    maxRelativeError: relErr,
    tolerance,
    details: `${description}: relErr = ${relErr.toExponential(3)} (tol = ${tolerance.toExponential(3)}).`,
  };
}

/**
 * Validates reflection symmetry or anti-symmetry under sign inversion.
 * - Even parity: f(-x) == f(x) (e.g. symmetric drag increase)
 * - Odd parity: f(-x) == -f(x) (e.g. aerodynamic roll/yaw moment)
 */
export function validateReflectionSymmetry<T>(
  modelPositive: () => T,
  modelNegative: () => T,
  extractor: (res: T) => number,
  parity: "even" | "odd",
  tolerance: number = 1e-3,
  description: string = "Reflection symmetry",
): MetamorphicTestResult {
  const posVal = extractor(modelPositive());
  const negVal = extractor(modelNegative());

  if (!Number.isFinite(posVal) || !Number.isFinite(negVal)) {
    return {
      law: "symmetry",
      passed: false,
      maxRelativeError: Number.POSITIVE_INFINITY,
      tolerance,
      details: `${description}: Produced non-finite outputs (posVal=${posVal}, negVal=${negVal}).`,
    };
  }

  const expectedNeg = parity === "even" ? posVal : -posVal;
  const denom = Math.max(1.0, Math.abs(posVal), Math.abs(negVal));
  const relErr = Math.abs(negVal - expectedNeg) / denom;
  const passed = relErr <= tolerance;

  return {
    law: "symmetry",
    passed,
    maxRelativeError: relErr,
    tolerance,
    details: `${description} (${parity} parity): relErr = ${relErr.toExponential(3)} (tol = ${tolerance.toExponential(3)}).`,
  };
}

/**
 * Validates physical scaling laws: f(alpha * x) == alpha^power * f(x).
 * - Quadratic (power = 2): aerodynamic lift/drag with velocity, Joule heat with current.
 * - Linear (power = 1): mass with volume, power with torque at constant rpm.
 * - Quartic (power = 4): Stefan-Boltzmann radiation with temperature.
 */
export function validateScalingLaw<T>(
  baseModel: () => T,
  scaledModel: () => T,
  extractor: (res: T) => number,
  scaleFactorAlpha: number,
  power: number,
  tolerance: number = 1e-2,
  description: string = "Physical scaling law",
): MetamorphicTestResult {
  const baseVal = extractor(baseModel());
  const scaledVal = extractor(scaledModel());

  if (!Number.isFinite(baseVal) || !Number.isFinite(scaledVal)) {
    return {
      law: "scaling",
      passed: false,
      maxRelativeError: Number.POSITIVE_INFINITY,
      tolerance,
      details: `${description}: Produced non-finite outputs.`,
    };
  }

  const expected = baseVal * scaleFactorAlpha ** power;
  const denom = Math.max(1.0, Math.abs(scaledVal), Math.abs(expected));
  const relErr = Math.abs(scaledVal - expected) / denom;
  const passed = relErr <= tolerance;

  return {
    law: "scaling",
    passed,
    maxRelativeError: relErr,
    tolerance,
    details: `${description} (alpha=${scaleFactorAlpha}, power=${power}): relErr = ${relErr.toExponential(3)}.`,
  };
}

/**
 * Validates zero-input conservation limits: f(0) == expectedZero.
 */
export function validateZeroInputLimit<T>(
  zeroInputModel: () => T,
  extractor: (res: T) => number,
  expectedZero: number = 0.0,
  absoluteTolerance: number = 1e-6,
  description: string = "Zero-input limit law",
): MetamorphicTestResult {
  const val = extractor(zeroInputModel());

  if (!Number.isFinite(val)) {
    return {
      law: "zero-limit",
      passed: false,
      maxRelativeError: Number.POSITIVE_INFINITY,
      tolerance: absoluteTolerance,
      details: `${description}: Produced non-finite output at zero input.`,
    };
  }

  const absErr = Math.abs(val - expectedZero);
  const passed = absErr <= absoluteTolerance;

  return {
    law: "zero-limit",
    passed,
    maxRelativeError: absErr,
    tolerance: absoluteTolerance,
    details: `${description}: absErr = ${absErr.toExponential(3)} (tol = ${absoluteTolerance.toExponential(3)}).`,
  };
}

// ----------------------------------------------------------------------------
// Seeded Fuzzing Engine
// ----------------------------------------------------------------------------

export interface FuzzingDomainConfig {
  readonly parameterKey: string;
  readonly validMin: number;
  readonly validMax: number;
}

export interface FuzzingReport {
  readonly totalValidTests: number;
  readonly totalInvalidTests: number;
  readonly allValidOutputsFinite: boolean;
  readonly allInvalidRefusedOrNull: boolean;
  readonly violations: readonly string[];
}

/**
 * Executes seeded pseudo-random fuzzing across both valid operating envelopes
 * and deliberately invalid/singular domains (NaN, Inf, negative Kelvin/Ohms, out-of-bounds).
 */
export function runSeededDomainFuzzer(
  kernelRunner: (params: Record<string, number>) => unknown,
  outputValidator: (output: unknown) => { valid: boolean; refused: boolean; reason?: string },
  domains: readonly FuzzingDomainConfig[],
  iterations: number = 100,
  seed: number = 42,
): FuzzingReport {
  const prng = createSeededPrng(seed);
  const violations: string[] = [];

  let validCount = 0;
  let invalidCount = 0;
  let allValidOutputsFinite = true;
  let allInvalidRefusedOrNull = true;

  // 1. Valid domain exploration
  for (let i = 0; i < iterations; i++) {
    const params: Record<string, number> = {};
    for (const d of domains) {
      const u = prng();
      params[d.parameterKey] = d.validMin + u * (d.validMax - d.validMin);
    }

    try {
      const out = kernelRunner(params);
      const check = outputValidator(out);
      validCount++;
      if (!check.valid) {
        allValidOutputsFinite = false;
        violations.push(`Valid input produced invalid output at iter ${i}: ${check.reason}`);
      }
    } catch (err: unknown) {
      allValidOutputsFinite = false;
      violations.push(`Valid input threw unhandled error at iter ${i}: ${String(err)}`);
    }
  }

  // 2. Invalid domain exploration (singularities, NaN, out-of-bounds, negative Kelvin)
  const invalidMutations = [
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    -1e9,
    1e9,
  ];

  for (let i = 0; i < iterations; i++) {
    const params: Record<string, number> = {};
    // Pick one parameter to mutate maliciously
    const mutatedParamIndex = Math.floor(prng() * domains.length);
    for (let j = 0; j < domains.length; j++) {
      const d = domains[j];
      if (j === mutatedParamIndex) {
        const mut = invalidMutations[Math.floor(prng() * invalidMutations.length)];
        params[d.parameterKey] = mut;
      } else {
        params[d.parameterKey] = d.validMin + prng() * (d.validMax - d.validMin);
      }
    }

    try {
      const out = kernelRunner(params);
      invalidCount++;
      const check = outputValidator(out);
      // For invalid inputs, the model MUST either refuse, return null, or mark unavailable
      if (!check.refused) {
        allInvalidRefusedOrNull = false;
        violations.push(
          `Invalid input was NOT refused at iter ${i} (mutated ${domains[mutatedParamIndex].parameterKey}): ${JSON.stringify(params)}`,
        );
      }
    } catch {
      // Throwing a typed refusal is also acceptable
      invalidCount++;
    }
  }

  return {
    totalValidTests: validCount,
    totalInvalidTests: invalidCount,
    allValidOutputsFinite,
    allInvalidRefusedOrNull,
    violations,
  };
}
