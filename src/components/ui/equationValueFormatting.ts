import type { EquationValueFormat, EquationVariable } from "@/types/equation";

const MAX_FIXED_FRACTION_DIGITS = 20;
const NON_FINITE_TELEMETRY = "Unavailable — non-finite telemetry";
const INVALID_FORMAT = "Unavailable — invalid telemetry format";

export function validateEquationValueFormat(format: EquationValueFormat): readonly string[] {
  const errors: string[] = [];
  if (format.style !== "fixed") errors.push(`unsupported style ${String(format.style)}`);
  if (
    !Number.isInteger(format.fractionDigits) ||
    format.fractionDigits < 0 ||
    format.fractionDigits > MAX_FIXED_FRACTION_DIGITS
  ) {
    errors.push(`fractionDigits must be an integer from 0 through ${MAX_FIXED_FRACTION_DIGITS}`);
  }
  if (format.scale !== undefined && !Number.isFinite(format.scale)) {
    errors.push("scale must be finite when supplied");
  }
  if (format.prefix !== undefined && typeof format.prefix !== "string") {
    errors.push("prefix must be a string when supplied");
  }
  if (format.suffix !== undefined && typeof format.suffix !== "string") {
    errors.push("suffix must be a string when supplied");
  }
  return errors;
}

export function formatEquationTelemetryValue(
  rawValue: number,
  variable: Pick<EquationVariable, "unit" | "valueFormat">,
): string {
  if (!Number.isFinite(rawValue)) return NON_FINITE_TELEMETRY;
  if (!variable.valueFormat) return `${rawValue.toFixed(2)} ${variable.unit}`.trim();
  if (validateEquationValueFormat(variable.valueFormat).length > 0) return INVALID_FORMAT;

  const scaled = rawValue * (variable.valueFormat.scale ?? 1);
  if (!Number.isFinite(scaled)) return NON_FINITE_TELEMETRY;
  return `${variable.valueFormat.prefix ?? ""}${scaled.toFixed(variable.valueFormat.fractionDigits)}${variable.valueFormat.suffix ?? ""}`;
}
