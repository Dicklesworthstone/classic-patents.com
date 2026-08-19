import { describe, expect, test } from "bun:test";
import type { ColorVariant } from "@/types/equation";
import {
  COLOR_STYLES,
  prepareInteractiveLatex,
  wrapInteractiveKatexTerm,
  wrapKatexColor,
} from "./colorPalette";

describe("Semantic Color Palette & KaTeX Preprocessor Engine", () => {
  const allVariants: ColorVariant[] = [
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

  test("COLOR_STYLES defines complete styling configurations for all 9 semantic color variants", () => {
    for (const variant of allVariants) {
      const cfg = COLOR_STYLES[variant];
      expect(cfg).toBeDefined();
      expect(cfg.name.length).toBeGreaterThan(0);
      expect(cfg.badgeLabel.length).toBeGreaterThan(0);
      expect(cfg.hexLight.startsWith("#")).toBe(true);
      expect(cfg.hexDark.startsWith("#")).toBe(true);
      expect(cfg.textClass).toContain("text-");
      expect(cfg.badgeBg).toContain("bg-");
      expect(cfg.borderClass).toContain("border-");
      expect(cfg.glowClass).toContain("shadow-");
      expect(cfg.activeRing).toContain("ring-");
      expect(cfg.underlineClass).toContain("decoration-");
    }
  });

  test("wrapKatexColor produces valid KaTeX textcolor directives for light and dark modes", () => {
    const light = wrapKatexColor("F", "crimson", false);
    expect(light).toBe(`\\textcolor{${COLOR_STYLES.crimson.hexLight}}{F}`);

    const dark = wrapKatexColor("F", "crimson", true);
    expect(dark).toBe(`\\textcolor{${COLOR_STYLES.crimson.hexDark}}{F}`);
  });

  test("wrapInteractiveKatexTerm wraps terms with htmlClass, htmlData, and textcolor", () => {
    const term = wrapInteractiveKatexTerm("force", "F", "sapphire", false);
    expect(term).toContain("\\htmlClass{eq-term eq-term-force eq-term-sapphire}");
    expect(term).toContain("\\htmlData{var=force}");
    expect(term).toContain(`\\textcolor{${COLOR_STYLES.sapphire.hexLight}}{F}`);
  });

  test("prepareInteractiveLatex augments already colorized LaTeX equations with interactive targets", () => {
    const equation = {
      colorizedLatex: "C_{Di} = \\frac{\\textcolor{#059669}{C_L}^2}{\\pi \\textcolor{#ea580c}{AR}}",
      rawLatex: "C_{Di} = \\frac{C_L^2}{\\pi AR}",
      variables: [
        { id: "cl", symbol: "C_L", color: "emerald" as const },
        { id: "ar", symbol: "AR", color: "coral" as const },
      ],
    };

    const prepared = prepareInteractiveLatex(equation);
    expect(prepared).toContain("eq-term-cl");
    expect(prepared).toContain("var=cl");
    expect(prepared).toContain("eq-term-ar");
    expect(prepared).toContain("var=ar");
  });

  test("prepareInteractiveLatex colors and wraps raw uncolored LaTeX without corrupting text blocks", () => {
    const rawEquation = {
      rawLatex: "P = V \\cdot I \\quad \\text{where } V \\text{ is voltage}",
      variables: [
        { id: "volt", symbol: "V", color: "sapphire" as const },
        { id: "curr", symbol: "I", color: "coral" as const },
      ],
    };

    const prepared = prepareInteractiveLatex(rawEquation);
    expect(prepared).toContain("eq-term-volt");
    expect(prepared).toContain("eq-term-curr");
    expect(prepared).toContain("\\text{where }");
    expect(prepared).toContain("\\text{ is voltage}");
  });

  test("prepareInteractiveLatex is idempotent and avoids duplicating existing term classes", () => {
    const alreadyPrepared = {
      rawLatex: "\\htmlClass{eq-term eq-term-v eq-term-sapphire}{\\htmlData{var=v}{V}}",
      variables: [{ id: "v", symbol: "V", color: "sapphire" as const }],
    };

    const result = prepareInteractiveLatex(alreadyPrepared);
    expect(result).toBe(alreadyPrepared.rawLatex);
  });
});
