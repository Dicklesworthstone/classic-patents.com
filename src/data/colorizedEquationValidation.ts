import { validateEquationValueFormat } from "@/components/ui/equationValueFormatting";
import type { ColorizedEquation } from "@/types/equation";

export interface ColorizedEquationValidationResult {
  valid: boolean;
  errors: readonly string[];
}

export function validateColorizedEquationCatalogue(
  catalogue: Readonly<Record<string, readonly ColorizedEquation[]>>,
): ColorizedEquationValidationResult {
  const errors = findNonSerializableValuePaths(catalogue);
  for (const [patentId, equations] of Object.entries(catalogue)) {
    for (const [equationIndex, equation] of equations.entries()) {
      for (const [variableIndex, variable] of equation.variables.entries()) {
        if (!variable.valueFormat) continue;
        for (const error of validateEquationValueFormat(variable.valueFormat)) {
          errors.push(
            `${patentId}[${equationIndex}].variables[${variableIndex}].valueFormat: ${error}`,
          );
        }
      }
    }
  }
  return { valid: errors.length === 0, errors };
}

export function findNonSerializableValuePaths(root: unknown): string[] {
  const errors: string[] = [];
  const ancestors = new Set<object>();

  const visit = (value: unknown, path: string): void => {
    if (value === null || typeof value === "string" || typeof value === "boolean") return;
    if (typeof value === "number") {
      if (!Number.isFinite(value)) errors.push(`${path}: non-finite number`);
      return;
    }
    if (typeof value === "undefined") {
      errors.push(`${path}: undefined value`);
      return;
    }
    if (typeof value === "function" || typeof value === "symbol" || typeof value === "bigint") {
      errors.push(`${path}: non-serializable ${typeof value}`);
      return;
    }
    if (typeof value !== "object") return;
    if (ancestors.has(value)) {
      errors.push(`${path}: cyclic reference`);
      return;
    }

    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== Array.prototype && prototype !== null) {
      errors.push(`${path}: non-plain ${prototype?.constructor?.name ?? "object"}`);
      return;
    }
    for (const symbol of Object.getOwnPropertySymbols(value)) {
      errors.push(`${path}[${String(symbol)}]: symbol-keyed property`);
    }

    ancestors.add(value);
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        visit(item, `${path}[${index}]`);
      });
    } else {
      for (const [key, item] of Object.entries(value)) visit(item, `${path}.${key}`);
    }
    ancestors.delete(value);
  };

  visit(root, "equations");
  return errors;
}
