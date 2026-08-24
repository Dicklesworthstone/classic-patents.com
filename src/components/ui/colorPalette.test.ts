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

  test("prepareInteractiveLatex wraps every colorized mention of a variable, including mentions written differently from the canonical symbol (GH#1)", () => {
    // Real shape from the Wright Flyer coordinated-turn equation: the
    // velocity variable's symbol is `V^2`, but its second mention is a bare
    // `V` colored with the same (unique) emerald hex. Both must be
    // interactive; `g` and `\tan(\phi)` each appear twice and must both be
    // wrapped as well.
    const equation = {
      colorizedLatex:
        "\\textcolor{#2563eb}{R_{\\text{turn}}} = \\frac{\\textcolor{#059669}{V^2}}{\\textcolor{#d97706}{g} \\cdot \\textcolor{#9333ea}{\\tan(\\phi)}}, \\quad \\textcolor{#ea580c}{\\dot{\\psi}} = \\frac{\\textcolor{#d97706}{g} \\textcolor{#9333ea}{\\tan(\\phi)}}{\\textcolor{#059669}{V}}",
      rawLatex:
        "R_{\\text{turn}} = \\frac{V^2}{g \\cdot \\tan(\\phi)}, \\quad \\dot{\\psi} = \\frac{g \\tan(\\phi)}{V}",
      variables: [
        { id: "r_turn", symbol: "R_{\\text{turn}}", color: "sapphire" as const },
        { id: "turn_vel", symbol: "V^2", color: "emerald" as const },
        { id: "grav", symbol: "g", color: "amber" as const },
        { id: "tan_phi", symbol: "\\tan(\\phi)", color: "amethyst" as const },
        { id: "psi_dot", symbol: "\\dot{\\psi}", color: "coral" as const },
      ],
    };

    const prepared = prepareInteractiveLatex(equation);
    const count = (needle: string) => prepared.split(needle).length - 1;

    // Both V^2 and the bare V mention are interactive.
    expect(count("var=turn_vel")).toBe(2);
    // Repeated identical mentions are each wrapped.
    expect(count("var=grav")).toBe(2);
    expect(count("var=tan_phi")).toBe(2);
    // Single-mention variables (with nested braces in their symbols) wrap once.
    expect(count("var=r_turn")).toBe(1);
    expect(count("var=psi_dot")).toBe(1);
    // No colored group is left unwrapped.
    expect(count("\\textcolor{")).toBe(count("\\htmlData{var="));
  });

  test("prepareInteractiveLatex falls back to exact-symbol matching when two variables share a palette color", () => {
    const equation = {
      colorizedLatex: "\\textcolor{#2563eb}{V} + \\textcolor{#2563eb}{I} + \\textcolor{#2563eb}{X}",
      rawLatex: "V + I + X",
      variables: [
        { id: "volt", symbol: "V", color: "sapphire" as const },
        { id: "curr", symbol: "I", color: "sapphire" as const },
      ],
    };

    const prepared = prepareInteractiveLatex(equation);
    const count = (needle: string) => prepared.split(needle).length - 1;

    // The shared hex must not let one variable claim the other's mention —
    // only exact symbol matches wrap.
    expect(count("var=volt")).toBe(1);
    expect(count("var=curr")).toBe(1);
    // The unclaimed X group stays untouched.
    expect(prepared).toContain("\\textcolor{#2563eb}{X}");
    expect(count("\\htmlData{var=")).toBe(2);
  });

  test("prepareInteractiveLatex never double-attributes a group when authored hexes drift from declared colors (GH#1 follow-up)", () => {
    // Real shape from davinci-calibration-offset before the data fix: every
    // authored hex belongs to a *different* variable's declared color. The
    // exact-symbol match must claim each group first, and the color-identity
    // rule must never re-wrap (nest inside) a group another variable owns.
    const equation = {
      colorizedLatex:
        "\\textcolor{#059669}{\\Delta q} = \\textcolor{#2563eb}{q_{m}} - \\textcolor{#d97706}{q_{n}}",
      rawLatex: "\\Delta q = q_{m} - q_{n}",
      variables: [
        { id: "measured", symbol: "q_{m}", color: "emerald" as const },
        { id: "nominal", symbol: "q_{n}", color: "sapphire" as const },
        { id: "offset", symbol: "\\Delta q", color: "crimson" as const },
      ],
    };

    const prepared = prepareInteractiveLatex(equation);
    const count = (needle: string) => prepared.split(needle).length - 1;

    // One wrapper per group, correctly attributed by content.
    expect(count("var=measured")).toBe(1);
    expect(count("var=nominal")).toBe(1);
    expect(count("var=offset")).toBe(1);
    // No wrapper may sit directly inside another (double attribution).
    expect(prepared).not.toMatch(/\\htmlData\{var=[^{}]*\}\{\\htmlClass\{/);
  });

  test("prepareInteractiveLatex exact-symbol claims beat color-identity claims for the same group", () => {
    // The cyan-unique variable must not steal the cyan-authored group whose
    // content names the teal variable (maiman R_2 shape); the teal variable
    // claims it by symbol and alpha still wraps via its own group.
    const equation = {
      colorizedLatex: "\\textcolor{#6b7280}{\\alpha} + \\textcolor{#0891b2}{R_2}",
      rawLatex: "\\alpha + R_2",
      variables: [
        { id: "alpha_loss", symbol: "\\alpha", color: "cyan" as const },
        { id: "r2_refl", symbol: "R_2", color: "teal" as const },
      ],
    };

    const prepared = prepareInteractiveLatex(equation);
    const count = (needle: string) => prepared.split(needle).length - 1;

    expect(count("var=alpha_loss")).toBe(1);
    expect(count("var=r2_refl")).toBe(1);
    expect(prepared).not.toMatch(/\\htmlData\{var=[^{}]*\}\{\\htmlClass\{/);
    // R_2's group is attributed to r2_refl, not alpha_loss.
    expect(prepared).toMatch(/var=r2_refl\}\{\\textcolor\{#0891b2\}\{R_2\}/);
  });

  test("prepareInteractiveLatex keeps the double-attribution guard for long variable ids", () => {
    // The already-claimed check must not depend on a fixed lookback window:
    // `\htmlData{var=<id>}{` grows with the id, so a long id must still be seen.
    const longId = "a_very_long_variable_identifier_that_exceeds_sixty_five_characters_in_total_x";
    expect(longId.length).toBeGreaterThanOrEqual(65);
    const prepared = prepareInteractiveLatex({
      colorizedLatex: "\\textcolor{#059669}{\\Delta q} = \\textcolor{#2563eb}{q_{m}}",
      rawLatex: "\\Delta q = q_{m}",
      variables: [
        { id: "measured", symbol: "q_{m}", color: "emerald" as const },
        { id: longId, symbol: "\\Delta q", color: "crimson" as const },
      ],
    });
    const count = (needle: string) => prepared.split(needle).length - 1;

    expect(count(`var=${longId}`)).toBe(1);
    expect(count("var=measured")).toBe(1);
    expect(prepared).not.toMatch(/\\htmlData\{var=[^{}]*\}\{\\htmlClass\{/);
  });

  test("prepareInteractiveLatex raw-text fallback never wraps inside a group another variable owns", () => {
    // Real shape from engelbart-coordinate-resolver: `N` is a substring of the
    // claimed `N_2` group (the suffix guard permits `_`), so the fallback must
    // skip the owned group body and only wrap the free-standing mention.
    const prepared = prepareInteractiveLatex({
      colorizedLatex: "\\textcolor{#2563eb}{N_2} - N",
      rawLatex: "N_2 - N",
      variables: [
        { id: "n2", symbol: "N_2", color: "sapphire" as const },
        { id: "n", symbol: "N", color: "crimson" as const },
      ],
    });
    const count = (needle: string) => prepared.split(needle).length - 1;

    expect(prepared).toMatch(/var=n2\}\{\\textcolor\{#2563eb\}\{N_2\}\}/);
    expect(count("var=n}")).toBe(1);
    expect(prepared).toContain(
      "- \\htmlClass{eq-term eq-term-n eq-term-crimson}{\\htmlData{var=n}{",
    );
  });

  test("prepareInteractiveLatex raw-text fallback never rewrites class names, var ids, hexes, or \\text prose", () => {
    const prepared = prepareInteractiveLatex({
      colorizedLatex:
        "\\htmlClass{eq-term eq-term-a eq-term-crimson}{\\htmlData{var=a}{\\textcolor{#dc2626}{A}}} + eq \\text{ eq } eq",
      rawLatex: "A + eq \\text{ eq } eq",
      variables: [
        { id: "a", symbol: "A", color: "crimson" as const },
        { id: "eq_var", symbol: "eq", color: "sapphire" as const },
      ],
    });
    const count = (needle: string) => prepared.split(needle).length - 1;

    // Exactly the two free-standing `eq` mentions are wrapped; the `eq-term`
    // class names, the `\text{ eq }` prose, and a's owned group are untouched.
    expect(count("var=eq_var}")).toBe(2);
    expect(count("var=a}")).toBe(1);
    expect(prepared).toContain("\\text{ eq }");
    expect(prepared).toContain(
      "\\htmlClass{eq-term eq-term-a eq-term-crimson}{\\htmlData{var=a}{\\textcolor{#dc2626}{A}}}",
    );
  });

  test("prepareInteractiveLatex still claims a group that follows an already-closed claim", () => {
    const prepared = prepareInteractiveLatex({
      colorizedLatex:
        "\\htmlClass{eq-term eq-term-a eq-term-crimson}{\\htmlData{var=a}{\\textcolor{#dc2626}{A}}} + \\textcolor{#2563eb}{B}",
      rawLatex: "A + B",
      variables: [
        { id: "a", symbol: "A", color: "crimson" as const },
        { id: "b", symbol: "B", color: "sapphire" as const },
      ],
    });
    const count = (needle: string) => prepared.split(needle).length - 1;

    expect(count("var=a}")).toBe(1);
    expect(count("var=b}")).toBe(1);
    expect(prepared).toMatch(/var=b\}\{\\textcolor\{#2563eb\}\{B\}/);
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
