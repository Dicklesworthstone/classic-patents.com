/**
 * intervals.ts
 *
 * Explicit parameter intervals and regime predicates.
 * Distinguishes source uncertainty (historical grants), scenario ranges
 * (declared modern simulation envelopes), and numerical tolerances.
 *
 * Enforces regime boundaries and refuses scalar answers when an interval
 * crosses a discontinuous or unsupported regime.
 */

export type UncertaintyKind =
  | "source-uncertainty" // Historic bounds documented in patent specification or primary source
  | "scenario-range" // Declared modern operating scenario bounds
  | "numerical-tolerance"; // Discretization, solver convergence, or floating-point rounding bound

export interface Interval {
  readonly min: number;
  readonly max: number;
  readonly unit: string;
  readonly kind: UncertaintyKind;
  readonly sourceNote?: string;
}

export class IntervalRefusalError extends Error {
  constructor(
    public readonly parameterKey: string,
    public readonly reason: string,
    public readonly interval?: Interval,
  ) {
    super(`Interval Refusal for parameter "${parameterKey}": ${reason}`);
    this.name = "IntervalRefusalError";
  }
}

/**
 * Creates an immutable parameter interval with strict bounds checking.
 */
export function createInterval(
  min: number,
  max: number,
  unit: string = "1",
  kind: UncertaintyKind = "scenario-range",
  sourceNote?: string,
): Interval {
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    throw new Error(`Interval bounds must be finite numbers; received [${min}, ${max}].`);
  }
  if (min > max) {
    throw new Error(`Interval min (${min}) cannot exceed max (${max}).`);
  }
  return Object.freeze({
    min,
    max,
    unit,
    kind,
    ...(sourceNote ? { sourceNote } : {}),
  });
}

/** Test whether a scalar value lies within an interval (inclusive). */
export function intervalContains(ivl: Interval, val: number): boolean {
  return Number.isFinite(val) && val >= ivl.min && val <= ivl.max;
}

/** Test whether two intervals overlap. */
export function intervalsOverlap(a: Interval, b: Interval): boolean {
  return a.max >= b.min && b.max >= a.min;
}

/** Compute the interval hull (bounding box containing both intervals). */
export function intervalHull(a: Interval, b: Interval): Interval {
  const kind: UncertaintyKind =
    a.kind === "source-uncertainty" || b.kind === "source-uncertainty"
      ? "source-uncertainty"
      : a.kind === "scenario-range" || b.kind === "scenario-range"
        ? "scenario-range"
        : "numerical-tolerance";

  return createInterval(
    Math.min(a.min, b.min),
    Math.max(a.max, b.max),
    a.unit,
    kind,
    [a.sourceNote, b.sourceNote].filter(Boolean).join("; ") || undefined,
  );
}

/** Compute the intersection of two intervals, or null if disjoint. */
export function intervalIntersect(a: Interval, b: Interval): Interval | null {
  const min = Math.max(a.min, b.min);
  const max = Math.min(a.max, b.max);
  if (min > max) return null;
  return createInterval(min, max, a.unit, a.kind);
}

/** Interval width (max - min). */
export function intervalWidth(ivl: Interval): number {
  return ivl.max - ivl.min;
}

/** Interval midpoint. */
export function intervalMid(ivl: Interval): number {
  return (ivl.min + ivl.max) / 2;
}

/** Outward rounded interval addition. */
export function addIntervals(a: Interval, b: Interval): Interval {
  return createInterval(a.min + b.min, a.max + b.max, a.unit, a.kind);
}

/** Outward rounded interval subtraction. */
export function subIntervals(a: Interval, b: Interval): Interval {
  return createInterval(a.min - b.max, a.max - b.min, a.unit, a.kind);
}

/** Outward rounded interval multiplication. */
export function mulIntervals(a: Interval, b: Interval): Interval {
  const p1 = a.min * b.min;
  const p2 = a.min * b.max;
  const p3 = a.max * b.min;
  const p4 = a.max * b.max;
  return createInterval(Math.min(p1, p2, p3, p4), Math.max(p1, p2, p3, p4), a.unit, a.kind);
}

/** Outward rounded interval division; returns null if divisor interval contains zero. */
export function divIntervals(a: Interval, b: Interval): Interval | null {
  if (b.min <= 0 && b.max >= 0) {
    return null; // Division by zero refusal
  }
  const q1 = a.min / b.min;
  const q2 = a.min / b.max;
  const q3 = a.max / b.min;
  const q4 = a.max / b.max;
  return createInterval(Math.min(q1, q2, q3, q4), Math.max(q1, q2, q3, q4), a.unit, a.kind);
}

/** Scale interval by scalar. */
export function scaleInterval(ivl: Interval, s: number): Interval {
  if (!Number.isFinite(s)) throw new Error(`Scale factor must be finite, received ${s}.`);
  const a = ivl.min * s;
  const b = ivl.max * s;
  return createInterval(Math.min(a, b), Math.max(a, b), ivl.unit, ivl.kind);
}

/** Format interval for display. */
export function formatInterval(ivl: Interval, digits: number = 2): string {
  if (ivl.min === ivl.max) return `${ivl.min.toFixed(digits)} ${ivl.unit}`;
  return `[${ivl.min.toFixed(digits)}, ${ivl.max.toFixed(digits)}] ${ivl.unit} (${ivl.kind})`;
}

// ----------------------------------------------------------------------------
// Regime Predicates & Refusal Engine
// ----------------------------------------------------------------------------

export interface RegimeBoundary<TRegime extends string = string> {
  readonly regime: TRegime;
  readonly interval: Interval;
  readonly description: string;
}

export interface RegimeDefinition<TRegime extends string = string> {
  readonly id: string;
  readonly domainName: string;
  readonly parameterKey: string;
  readonly unit: string;
  readonly regimes: readonly RegimeBoundary<TRegime>[];
  readonly supportedRegimes: readonly TRegime[];
  readonly sourceCitation?: string;
}

export interface RegimeEvaluationResult<TRegime extends string = string> {
  readonly admitted: boolean;
  readonly activeRegimes: readonly TRegime[];
  readonly isSingleRegime: boolean;
  readonly primaryRegime: TRegime | null;
  readonly crossesBoundary: boolean;
  readonly refusalReason?: string;
}

/**
 * Evaluates whether an input scalar or interval falls cleanly within
 * supported physical regimes, refusing scalar evaluation when an interval
 * spans multiple regimes or crosses an unsupported boundary.
 */
export function evaluateRegime<TRegime extends string>(
  definition: RegimeDefinition<TRegime>,
  valueOrInterval: number | Interval,
): RegimeEvaluationResult<TRegime> {
  const ivl: Interval =
    typeof valueOrInterval === "number"
      ? createInterval(valueOrInterval, valueOrInterval, definition.unit, "numerical-tolerance")
      : valueOrInterval;

  if (!Number.isFinite(ivl.min) || !Number.isFinite(ivl.max)) {
    return {
      admitted: false,
      activeRegimes: [],
      isSingleRegime: false,
      primaryRegime: null,
      crossesBoundary: false,
      refusalReason: `Non-finite parameter range for "${definition.parameterKey}".`,
    };
  }

  const matchingRegimes: TRegime[] = [];
  for (const b of definition.regimes) {
    if (intervalsOverlap(ivl, b.interval)) {
      matchingRegimes.push(b.regime);
    }
  }

  if (matchingRegimes.length === 0) {
    return {
      admitted: false,
      activeRegimes: [],
      isSingleRegime: false,
      primaryRegime: null,
      crossesBoundary: false,
      refusalReason: `Parameter "${definition.parameterKey}" value ${formatInterval(ivl)} lies outside all declared physical regimes.`,
    };
  }

  // Check for any unsupported regimes
  const unsupportedFound = matchingRegimes.filter((r) => !definition.supportedRegimes.includes(r));
  if (unsupportedFound.length > 0) {
    return {
      admitted: false,
      activeRegimes: matchingRegimes,
      isSingleRegime: matchingRegimes.length === 1,
      primaryRegime: matchingRegimes[0],
      crossesBoundary: matchingRegimes.length > 1,
      refusalReason: `Parameter "${definition.parameterKey}" operates in unsupported regime(s): ${unsupportedFound.join(", ")}.`,
    };
  }

  const isSingleRegime = matchingRegimes.length === 1;
  const crossesBoundary = matchingRegimes.length > 1;

  return {
    admitted: true,
    activeRegimes: matchingRegimes,
    isSingleRegime,
    primaryRegime: matchingRegimes[0],
    crossesBoundary,
    ...(crossesBoundary
      ? {
          refusalReason: `Interval ${formatInterval(ivl)} spans multiple physical regimes (${matchingRegimes.join(", ")}); scalar evaluation refused across regime boundaries.`,
        }
      : {}),
  };
}

/**
 * Asserts that an input lies strictly within a single supported physical regime.
 * Throws IntervalRefusalError if the input is unsupported or spans multiple regimes.
 */
export function assertSingleSupportedRegime<TRegime extends string>(
  definition: RegimeDefinition<TRegime>,
  valueOrInterval: number | Interval,
): TRegime {
  const result = evaluateRegime(definition, valueOrInterval);
  if (!result.admitted) {
    throw new IntervalRefusalError(
      definition.parameterKey,
      result.refusalReason ?? "Input lies in an unadmitted regime",
      typeof valueOrInterval === "number" ? undefined : valueOrInterval,
    );
  }
  if (result.crossesBoundary || !result.isSingleRegime || !result.primaryRegime) {
    throw new IntervalRefusalError(
      definition.parameterKey,
      result.refusalReason ?? "Scalar answer refused across regime boundaries",
      typeof valueOrInterval === "number" ? undefined : valueOrInterval,
    );
  }
  return result.primaryRegime;
}

// ----------------------------------------------------------------------------
// Canonical Catalogue Regime Definitions
// ----------------------------------------------------------------------------

export type GoodyearCureRegime = "too-cold" | "cure" | "scorch";
export const GOODYEAR_CURE_REGIMES: RegimeDefinition<GoodyearCureRegime> = {
  id: "goodyear-cure-temperature",
  domainName: "continuum_polymers",
  parameterKey: "vulcanTemp",
  unit: "°C",
  regimes: [
    {
      regime: "too-cold",
      interval: createInterval(
        0,
        109.99,
        "°C",
        "source-uncertainty",
        "US 3,633: rubber unreactive below vulcanization heat",
      ),
      description: "Insufficient thermal activation energy for sulfur-polyisoprene crosslinking.",
    },
    {
      regime: "cure",
      interval: createInterval(
        110,
        170,
        "°C",
        "source-uncertainty",
        "US 3,633: optimal heating at 270°F (132°C) to ~300°F",
      ),
      description: "Optimal Arrhenius crosslink kinetics forming stable disulfidic bridges.",
    },
    {
      regime: "scorch",
      interval: createInterval(
        170.01,
        300,
        "°C",
        "source-uncertainty",
        "US 3,633: excessive heat decomposes polymer matrix",
      ),
      description: "Thermal degradation and polymer chain scission (scorch / reversion).",
    },
  ],
  supportedRegimes: ["cure", "too-cold", "scorch"],
};

export type EdisonVacuumRegime = "high-vacuum" | "soft-vacuum" | "atmospheric-burnout";
export const EDISON_VACUUM_REGIMES: RegimeDefinition<EdisonVacuumRegime> = {
  id: "edison-lamp-vacuum",
  domainName: "thermo_fluid",
  parameterKey: "vacuumTorr",
  unit: "torr",
  regimes: [
    {
      regime: "high-vacuum",
      interval: createInterval(
        1e-6,
        1e-3,
        "torr",
        "source-uncertainty",
        "US 223,898: hermetic one-piece glass bulb exhausted to high vacuum",
      ),
      description:
        "Molecular mean free path exceeds bulb diameter; pure radiative heat transfer without convection.",
    },
    {
      regime: "soft-vacuum",
      interval: createInterval(
        1e-3,
        1.0,
        "torr",
        "source-uncertainty",
        "US 223,898: soft vacuum causes gas discharge and convection",
      ),
      description: "Transitional rarefied gas regime with severe convective filament cooling.",
    },
    {
      regime: "atmospheric-burnout",
      interval: createInterval(
        1.0,
        760.0,
        "torr",
        "source-uncertainty",
        "US 223,898: oxygen exposure causes instant carbon combustion",
      ),
      description: "Atmospheric oxygen causes rapid carbon filament oxidation and burnout.",
    },
  ],
  supportedRegimes: ["high-vacuum"],
};

export type FermiCriticalityRegime = "subcritical" | "delayed-critical" | "prompt-supercritical";
export const FERMI_CRITICALITY_REGIMES: RegimeDefinition<FermiCriticalityRegime> = {
  id: "fermi-pile-criticality",
  domainName: "nuclear_kinetics",
  parameterKey: "kEffective",
  unit: "1",
  regimes: [
    {
      regime: "subcritical",
      interval: createInterval(
        0.0,
        0.9979,
        "1",
        "source-uncertainty",
        "US 2,708,656: neutron reproduction factor below unity",
      ),
      description: "Neutron population decays exponentially following source removal.",
    },
    {
      regime: "delayed-critical",
      interval: createInterval(
        0.998,
        1.002,
        "1",
        "source-uncertainty",
        "US 2,708,656: controllable steady chain reaction using delayed neutrons",
      ),
      description:
        "Controlled critical balance governed by 6-group delayed neutron precursor kinetics.",
    },
    {
      regime: "prompt-supercritical",
      interval: createInterval(
        1.0101,
        2.0,
        "1",
        "source-uncertainty",
        "US 2,708,656: unmoderated prompt neutron runaway",
      ),
      description: "Prompt supercritical runaway governed by prompt neutron lifetime (~1 ms).",
    },
  ],
  supportedRegimes: ["subcritical", "delayed-critical"],
};

export type WrightAerodynamicRegime = "negative-stall" | "attached-linear" | "positive-stall";
export const WRIGHT_AERODYNAMIC_REGIMES: RegimeDefinition<WrightAerodynamicRegime> = {
  id: "wright-wing-aoa",
  domainName: "aerodynamics_mbd",
  parameterKey: "angleOfAttackDeg",
  unit: "deg",
  regimes: [
    {
      regime: "negative-stall",
      interval: createInterval(
        -30,
        -5.01,
        "deg",
        "scenario-range",
        "Flow detachment on lower camber",
      ),
      description: "Flow separation on lower wing surface.",
    },
    {
      regime: "attached-linear",
      interval: createInterval(
        -5.0,
        14.0,
        "deg",
        "source-uncertainty",
        "US 821,393: normal gliding and flight angle of incidence",
      ),
      description: "Fully attached aerodynamic flow with linear lift growth dCL/dalpha.",
    },
    {
      regime: "positive-stall",
      interval: createInterval(
        14.01,
        40,
        "deg",
        "scenario-range",
        "Upper camber boundary layer separation",
      ),
      description: "Upper wing boundary layer detachment with loss of lift and adverse drag rise.",
    },
  ],
  supportedRegimes: ["attached-linear"],
};

export type HallElectrolysisRegime = "frozen-bath" | "normal-electrolysis" | "bath-volatilization";
export const HALL_ELECTROLYSIS_REGIMES: RegimeDefinition<HallElectrolysisRegime> = {
  id: "hall-aluminium-bath-temp",
  domainName: "materials_kinetics",
  parameterKey: "bathTemperatureCelsius",
  unit: "°C",
  regimes: [
    {
      regime: "frozen-bath",
      interval: createInterval(
        20,
        919.99,
        "°C",
        "source-uncertainty",
        "US 400,766: cryolite-alumina bath must be molten",
      ),
      description: "Electrolyte solidifies; electrical conductivity collapses.",
    },
    {
      regime: "normal-electrolysis",
      interval: createInterval(
        920,
        1020,
        "°C",
        "source-uncertainty",
        "US 400,766: molten cryolite bath holding alumina in solution",
      ),
      description:
        "Stable Hall-Héroult electrolytic reduction with Faraday aluminum precipitation.",
    },
    {
      regime: "bath-volatilization",
      interval: createInterval(1020.01, 1300, "°C", "scenario-range", "Excess bath evaporation"),
      description: "Excessive fluoride vaporization and crucible degradation.",
    },
  ],
  supportedRegimes: ["normal-electrolysis"],
};

export type DieselIgnitionRegime = "pre-ignition" | "self-ignition" | "excess-knock";
export const DIESEL_IGNITION_REGIMES: RegimeDefinition<DieselIgnitionRegime> = {
  id: "diesel-compression-ignition",
  domainName: "thermodynamics_transport",
  parameterKey: "compressionRatio",
  unit: "1",
  regimes: [
    {
      regime: "pre-ignition",
      interval: createInterval(
        1,
        13.99,
        "1",
        "source-uncertainty",
        "US 608,845: compression must raise air above ignition point of fuel",
      ),
      description: "Compression temperature insufficient to auto-ignite injected heavy fuel.",
    },
    {
      regime: "self-ignition",
      interval: createInterval(
        14,
        22,
        "1",
        "source-uncertainty",
        "US 608,845: pure air compressed to self-igniting temperature",
      ),
      description: "Isentropic compression heats air past fuel auto-ignition threshold.",
    },
    {
      regime: "excess-knock",
      interval: createInterval(22.01, 35, "1", "scenario-range", "Excess mechanical peak pressure"),
      description: "Cylinder peak pressure exceeds mechanical containment limits.",
    },
  ],
  supportedRegimes: ["self-ignition"],
};
