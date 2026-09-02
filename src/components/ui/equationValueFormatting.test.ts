import { describe, expect, test } from "bun:test";
import type { EquationValueFormat } from "@/types/equation";
import {
  formatEquationTelemetryValue,
  validateEquationValueFormat,
} from "./equationValueFormatting";

describe("declarative equation telemetry formatting", () => {
  test("preserves the default fixed precision and authored unit", () => {
    expect(formatEquationTelemetryValue(12.345, { unit: "m/s" })).toBe("12.35 m/s");
    expect(formatEquationTelemetryValue(-0.004, { unit: "N" })).toBe("-0.00 N");
  });

  test("preserves scaled Ethernet and helicopter presentations", () => {
    expect(
      formatEquationTelemetryValue(199_861_638, {
        unit: "meters/second (m/s)",
        valueFormat: {
          style: "fixed",
          fractionDigits: 1,
          scale: 1e-6,
          suffix: " ×10⁶ m/s",
        },
      }),
    ).toBe("199.9 ×10⁶ m/s");
    expect(
      formatEquationTelemetryValue(87_650, {
        unit: "watts (W)",
        valueFormat: { style: "fixed", fractionDigits: 1, scale: 1e-3, suffix: " kW" },
      }),
    ).toBe("87.7 kW");
  });

  test("supports deterministic prefixes, suffixes, zero, negatives, and large finite values", () => {
    const valueFormat: EquationValueFormat = {
      style: "fixed",
      fractionDigits: 3,
      prefix: "Δ=",
      suffix: " V",
    };
    expect(formatEquationTelemetryValue(0, { unit: "V", valueFormat })).toBe("Δ=0.000 V");
    expect(formatEquationTelemetryValue(-12.5, { unit: "V", valueFormat })).toBe("Δ=-12.500 V");
    expect(formatEquationTelemetryValue(9e15, { unit: "V", valueFormat })).toBe(
      "Δ=9000000000000000.000 V",
    );
  });

  test("refuses non-finite raw or scaled telemetry instead of leaking NaN or Infinity", () => {
    expect(formatEquationTelemetryValue(Number.NaN, { unit: "N" })).toBe(
      "Unavailable — non-finite telemetry",
    );
    expect(
      formatEquationTelemetryValue(Number.MAX_VALUE, {
        unit: "N",
        valueFormat: { style: "fixed", fractionDigits: 1, scale: 2, suffix: " N" },
      }),
    ).toBe("Unavailable — non-finite telemetry");
  });

  test("validates malformed declarative formats and fails safely in the UI formatter", () => {
    const malformed = {
      style: "fixed",
      fractionDigits: 99,
      scale: Number.NaN,
      prefix: 7,
    } as unknown as EquationValueFormat;
    expect(validateEquationValueFormat(malformed)).toEqual([
      "fractionDigits must be an integer from 0 through 20",
      "scale must be finite when supplied",
      "prefix must be a string when supplied",
    ]);
    expect(formatEquationTelemetryValue(5, { unit: "N", valueFormat: malformed })).toBe(
      "Unavailable — invalid telemetry format",
    );
  });
});
