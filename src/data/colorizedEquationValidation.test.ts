import { describe, expect, test } from "bun:test";
import type { ColorizedEquation } from "@/types/equation";
import { ALL_COLORIZED_EQUATIONS } from "./colorizedEquations";
import {
  findNonSerializableValuePaths,
  validateColorizedEquationCatalogue,
} from "./colorizedEquationValidation";

describe("colorized-equation App Router transport contract", () => {
  test("accepts every live catalogue equation as plain serializable data", () => {
    const result = validateColorizedEquationCatalogue(ALL_COLORIZED_EQUATIONS);
    expect(result).toEqual({ valid: true, errors: [] });
    expect(JSON.stringify(ALL_COLORIZED_EQUATIONS).length).toBeGreaterThan(100_000);
  });

  test("rejects executable callbacks and non-finite values with exact paths", () => {
    expect(
      findNonSerializableValuePaths({
        equation: { formatValue: () => "unsafe", raw: Number.POSITIVE_INFINITY },
      }),
    ).toEqual([
      "equations.equation.formatValue: non-serializable function",
      "equations.equation.raw: non-finite number",
    ]);
  });

  test("rejects cyclic, symbol-keyed, bigint, undefined, and non-plain values", () => {
    const cyclic: Record<string, unknown> = {};
    cyclic.self = cyclic;
    const symbol = Symbol("hidden");
    const specimen: Record<PropertyKey, unknown> = {
      cyclic,
      bigint: 1n,
      missing: undefined,
      date: new Date("2026-09-01T00:00:00.000Z"),
      [symbol]: "not transported",
    };
    const errors = findNonSerializableValuePaths(specimen);
    expect(errors).toContain("equations[Symbol(hidden)]: symbol-keyed property");
    expect(errors).toContain("equations.cyclic.self: cyclic reference");
    expect(errors).toContain("equations.bigint: non-serializable bigint");
    expect(errors).toContain("equations.missing: undefined value");
    expect(errors).toContain("equations.date: non-plain Date");
  });

  test("rejects malformed format specifications even when their values are JSON-safe", () => {
    const equation = ALL_COLORIZED_EQUATIONS["us-4063220-metcalfe-ethernet"][0];
    const malformed = {
      "us-test": [
        {
          ...equation,
          variables: [
            {
              ...equation.variables[0],
              valueFormat: { style: "fixed", fractionDigits: -1 },
            },
          ],
        },
      ],
    } as unknown as Record<string, ColorizedEquation[]>;
    const result = validateColorizedEquationCatalogue(malformed);
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual([
      "us-test[0].variables[0].valueFormat: fractionDigits must be an integer from 0 through 20",
    ]);
  });
});
