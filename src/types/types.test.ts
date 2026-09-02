import { describe, expect, test } from "bun:test";
import type { ColorizedEquation, ColorVariant, EquationVariable } from "./equation";
import type {
  CuratedSpecificationBlock,
  CuratedSpecificationInline,
  PatentCategory,
} from "./patent";

describe("Core Domain Types & Contracts", () => {
  test("satisfies PatentCategory union values", () => {
    const categories: PatentCategory[] = [
      "aviation",
      "aerospace",
      "electricity",
      "telecom",
      "computing",
      "consumer",
      "materials",
      "optics",
    ];

    expect(categories.length).toBe(8);
  });

  test("satisfies ColorVariant union values for mathematical dual-coding", () => {
    const variants: ColorVariant[] = [
      "crimson",
      "sapphire",
      "emerald",
      "amber",
      "amethyst",
      "cyan",
      "coral",
      "rose",
      "teal",
    ];

    expect(variants.length).toBe(9);
  });

  test("instantiates a typed EquationVariable and ColorizedEquation", () => {
    const variable: EquationVariable = {
      id: "v",
      symbol: "v",
      name: "Airspeed",
      color: "sapphire",
      role: "Freestream velocity",
      unit: "m/s",
      dimension: "L/T",
      explanation: "True airspeed relative to oncoming airflow",
      telemetryKey: "airspeed",
      valueFormat: { style: "fixed", fractionDigits: 1, suffix: " m/s" },
    };

    expect(variable.id).toBe("v");
    expect(variable.valueFormat).toEqual({ style: "fixed", fractionDigits: 1, suffix: " m/s" });

    const equation: ColorizedEquation = {
      id: "wright-lift",
      patentId: "us-821393-wright-flyer",
      title: "Wright Aerodynamic Lift Equation",
      category: "Aerodynamics",
      rawLatex: "L = \\frac{1}{2} \\rho v^2 S C_L",
      colorizedLatex: "L = \\frac{1}{2} \\rho v^2 S C_L",
      plainEnglishSentence: [{ text: "Lift depends on velocity squared." }],
      variables: [variable],
      pedagogicalNote: "Dynamic pressure scales quadratically with airspeed.",
    };

    expect(equation.patentId).toBe("us-821393-wright-flyer");
    expect(equation.variables.length).toBe(1);
  });

  test("instantiates typed CuratedSpecificationBlock and CuratedSpecificationInline", () => {
    const inlineText: CuratedSpecificationInline = {
      kind: "text",
      text: "The flying-machine comprises superposed flexible aeroplanes.",
    };

    const block: CuratedSpecificationBlock = {
      kind: "paragraph",
      inlines: [inlineText],
    };

    expect(block.kind).toBe("paragraph");
    expect(block.inlines[0].kind).toBe("text");
  });
});
