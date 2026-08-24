/**
 * src/components/ui/colorPalette.ts
 *
 * Semantic color palette engine for Colorized Math Equations.
 * Designed for museum aesthetics across Parchment (light), Blueprint (cyanotype), and Obsidian (dark) modes.
 */

import type { ColorVariant } from "@/types/equation";

export interface ColorStyleConfig {
  name: string;
  badgeLabel: string;
  // KaTeX hex codes
  hexLight: string;
  hexDark: string;
  // CSS styling classes
  textClass: string;
  badgeBg: string;
  borderClass: string;
  glowClass: string;
  activeRing: string;
  underlineClass: string;
}

export const COLOR_STYLES: Record<ColorVariant, ColorStyleConfig> = {
  crimson: {
    name: "Crimson",
    badgeLabel: "Penalty / Thermal / Flux Sink",
    hexLight: "#dc2626", // Red-600
    hexDark: "#f87171", // Red-400
    textClass: "text-red-700 dark:text-red-400",
    badgeBg: "bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800/80",
    borderClass: "border-red-400 dark:border-red-500",
    glowClass: "shadow-[0_0_16px_rgba(239,68,68,0.35)]",
    activeRing: "ring-2 ring-red-500/80 bg-red-100/90 dark:bg-red-950/80",
    underlineClass: "decoration-red-500 underline-offset-4",
  },
  sapphire: {
    name: "Sapphire",
    badgeLabel: "Core Velocity / Voltage / Wave",
    hexLight: "#2563eb", // Blue-600
    hexDark: "#60a5fa", // Blue-400
    textClass: "text-blue-700 dark:text-blue-400",
    badgeBg: "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800/80",
    borderClass: "border-blue-400 dark:border-blue-500",
    glowClass: "shadow-[0_0_16px_rgba(59,130,246,0.35)]",
    activeRing: "ring-2 ring-blue-500/80 bg-blue-100/90 dark:bg-blue-950/80",
    underlineClass: "decoration-blue-500 underline-offset-4",
  },
  emerald: {
    name: "Emerald",
    badgeLabel: "Output / Lift / Work / Power",
    hexLight: "#059669", // Emerald-600
    hexDark: "#34d399", // Emerald-400
    textClass: "text-emerald-700 dark:text-emerald-400",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/80",
    borderClass: "border-emerald-400 dark:border-emerald-500",
    glowClass: "shadow-[0_0_16px_rgba(16,185,129,0.35)]",
    activeRing: "ring-2 ring-emerald-500/80 bg-emerald-100/90 dark:bg-emerald-950/80",
    underlineClass: "decoration-emerald-500 underline-offset-4",
  },
  amber: {
    name: "Amber",
    badgeLabel: "Frequency / Geometry / Geometry Constant",
    hexLight: "#d97706", // Amber-600
    hexDark: "#fbbf24", // Amber-400
    textClass: "text-amber-700 dark:text-amber-400",
    badgeBg: "bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/80",
    borderClass: "border-amber-400 dark:border-amber-500",
    glowClass: "shadow-[0_0_16px_rgba(245,158,11,0.35)]",
    activeRing: "ring-2 ring-amber-500/80 bg-amber-100/90 dark:bg-amber-950/80",
    underlineClass: "decoration-amber-500 underline-offset-4",
  },
  amethyst: {
    name: "Amethyst",
    badgeLabel: "Energy / State Vector / Identity",
    hexLight: "#9333ea", // Purple-600
    hexDark: "#c084fc", // Purple-400
    textClass: "text-purple-700 dark:text-purple-400",
    badgeBg: "bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800/80",
    borderClass: "border-purple-400 dark:border-purple-500",
    glowClass: "shadow-[0_0_16px_rgba(168,85,247,0.35)]",
    activeRing: "ring-2 ring-purple-500/80 bg-purple-100/90 dark:bg-purple-950/80",
    underlineClass: "decoration-purple-500 underline-offset-4",
  },
  cyan: {
    name: "Cyan",
    badgeLabel: "Flux Density / Capacitance / Charge",
    hexLight: "#0891b2", // Cyan-600
    hexDark: "#22d3ee", // Cyan-400
    textClass: "text-cyan-700 dark:text-cyan-400",
    badgeBg: "bg-cyan-50 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-800/80",
    borderClass: "border-cyan-400 dark:border-cyan-500",
    glowClass: "shadow-[0_0_16px_rgba(6,182,212,0.35)]",
    activeRing: "ring-2 ring-cyan-500/80 bg-cyan-100/90 dark:bg-cyan-950/80",
    underlineClass: "decoration-cyan-500 underline-offset-4",
  },
  coral: {
    name: "Coral",
    badgeLabel: "Current / Resistance / Acceleration",
    hexLight: "#ea580c", // Orange-600
    hexDark: "#fb923c", // Orange-400
    textClass: "text-orange-700 dark:text-orange-400",
    badgeBg: "bg-orange-50 dark:bg-orange-950/50 border-orange-200 dark:border-orange-800/80",
    borderClass: "border-orange-400 dark:border-orange-500",
    glowClass: "shadow-[0_0_16px_rgba(249,115,22,0.35)]",
    activeRing: "ring-2 ring-orange-500/80 bg-orange-100/90 dark:bg-orange-950/80",
    underlineClass: "decoration-orange-500 underline-offset-4",
  },
  rose: {
    name: "Rose",
    badgeLabel: "Time Rate / Decay / Radiation",
    hexLight: "#e11d48", // Rose-600
    hexDark: "#fb7185", // Rose-400
    textClass: "text-rose-700 dark:text-rose-400",
    badgeBg: "bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800/80",
    borderClass: "border-rose-400 dark:border-rose-500",
    glowClass: "shadow-[0_0_16px_rgba(244,63,94,0.35)]",
    activeRing: "ring-2 ring-rose-500/80 bg-rose-100/90 dark:bg-rose-950/80",
    underlineClass: "decoration-rose-500 underline-offset-4",
  },
  teal: {
    name: "Teal",
    badgeLabel: "Material Constant / Permeability",
    hexLight: "#0d9488", // Teal-600
    hexDark: "#2dd4bf", // Teal-400
    textClass: "text-teal-700 dark:text-teal-400",
    badgeBg: "bg-teal-50 dark:bg-teal-950/50 border-teal-200 dark:border-teal-800/80",
    borderClass: "border-teal-400 dark:border-teal-500",
    glowClass: "shadow-[0_0_16px_rgba(20,184,166,0.35)]",
    activeRing: "ring-2 ring-teal-500/80 bg-teal-100/90 dark:bg-teal-950/80",
    underlineClass: "decoration-teal-500 underline-offset-4",
  },
};

/**
 * Returns KaTeX formatted LaTeX wrapped in \textcolor{#hex}{symbol}
 */
export function wrapKatexColor(symbolLatex: string, color: ColorVariant, isDark = false): string {
  const cfg = COLOR_STYLES[color];
  const hex = isDark ? cfg.hexDark : cfg.hexLight;
  return `\\textcolor{${hex}}{${symbolLatex}}`;
}

/**
 * Returns KaTeX formatted LaTeX wrapped with interactive class, data attribute, and color
 */
export function wrapInteractiveKatexTerm(
  varId: string,
  symbolLatex: string,
  color: ColorVariant,
  isDark = false,
): string {
  const cfg = COLOR_STYLES[color];
  const hex = isDark ? cfg.hexDark : cfg.hexLight;
  return `\\htmlClass{eq-term eq-term-${varId} eq-term-${color}}{\\htmlData{var=${varId}}{\\textcolor{${hex}}{${symbolLatex}}}}`;
}

/**
 * Every hex an author may plausibly have used for a palette color family:
 * the registered light (Tailwind 600) and dark (400) hexes plus the 500-level
 * mid tone that several data entries were authored with. Families are
 * disjoint, so a hex identifies at most one ColorVariant.
 */
export const COLOR_HEX_ALIASES: Record<ColorVariant, readonly string[]> = {
  crimson: ["#dc2626", "#ef4444", "#f87171"],
  sapphire: ["#2563eb", "#3b82f6", "#60a5fa"],
  emerald: ["#059669", "#10b981", "#34d399"],
  amber: ["#d97706", "#f59e0b", "#fbbf24"],
  amethyst: ["#9333ea", "#a855f7", "#c084fc"],
  cyan: ["#0891b2", "#06b6d4", "#22d3ee"],
  coral: ["#ea580c", "#f97316", "#fb923c"],
  rose: ["#e11d48", "#f43f5e", "#fb7185"],
  teal: ["#0d9488", "#14b8a6", "#2dd4bf"],
};

/**
 * Finds the index of the `}` that closes the group opened at `openIdx`
 * (which must point at a `{`). Honors backslash escapes (`\{`, `\}`).
 * Returns -1 when the group never closes.
 */
function findBalancedGroupEnd(latex: string, openIdx: number): number {
  let depth = 0;
  for (let i = openIdx; i < latex.length; i++) {
    const ch = latex[i];
    if (ch === "\\") {
      i++; // skip the escaped character
      continue;
    }
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/**
 * Inclusive `[start, end]` index ranges of `latex` that the raw-text fallback
 * must never rewrite:
 * - `\text{...}` groups (prose, not math);
 * - the argument of every `\textcolor{...}`, `\htmlClass{...}` and
 *   `\htmlData{...}` (hexes, class names, `var=` ids);
 * - the body of every `\htmlData{...}{...}` — a group an interactive wrapper
 *   already owns; injecting a second wrapper inside it would attribute the
 *   same glyphs to two variables.
 */
function collectProtectedRanges(latex: string): Array<[number, number]> {
  const ranges: Array<[number, number]> = [];
  const markers: Array<{ text: string; protectBody: boolean; wholeCommand: boolean }> = [
    { text: "\\text{", protectBody: false, wholeCommand: true },
    { text: "\\textcolor{", protectBody: false, wholeCommand: false },
    { text: "\\htmlClass{", protectBody: false, wholeCommand: false },
    { text: "\\htmlData{", protectBody: true, wholeCommand: false },
  ];
  for (const marker of markers) {
    let idx = latex.indexOf(marker.text);
    while (idx !== -1) {
      const argOpen = idx + marker.text.length - 1;
      const argEnd = findBalancedGroupEnd(latex, argOpen);
      if (argEnd === -1) break;
      ranges.push([marker.wholeCommand ? idx : argOpen, argEnd]);
      if (marker.protectBody && latex[argEnd + 1] === "{") {
        const bodyEnd = findBalancedGroupEnd(latex, argEnd + 1);
        if (bodyEnd !== -1) ranges.push([argEnd + 1, bodyEnd]);
      }
      idx = latex.indexOf(marker.text, argEnd + 1);
    }
  }
  return ranges;
}

/**
 * Replaces every match of `re` (which must carry the `g` flag) in `latex`
 * with the literal `replacement`, skipping matches that start inside a
 * protected range. The replacement is inserted verbatim — no `$&`-style
 * pattern expansion — and the ranges are computed once, against the input,
 * so a replacement can never be re-scanned.
 */
function replaceOutsideProtected(latex: string, re: RegExp, replacement: string): string {
  const ranges = collectProtectedRanges(latex);
  const isProtected = (pos: number): boolean =>
    ranges.some(([start, end]) => pos >= start && pos <= end);

  let out = "";
  let last = 0;
  re.lastIndex = 0;
  let m: RegExpExecArray | null = re.exec(latex);
  while (m !== null) {
    if (m[0].length === 0) {
      re.lastIndex++;
    } else if (!isProtected(m.index)) {
      out += latex.slice(last, m.index) + replacement;
      last = m.index + m[0].length;
    }
    m = re.exec(latex);
  }
  return out + latex.slice(last);
}

/**
 * Takes a colorized equation and ensures all variables are wrapped with interactive HTML classes and data attributes for KaTeX rendering.
 *
 * Matching strategy for pre-colorized LaTeX: an authored `\textcolor{hex}{...}`
 * group belongs to a variable when its content equals the variable's symbol
 * exactly, OR when the hex is one of that variable's color-family aliases
 * (COLOR_HEX_ALIASES) and no other variable in the equation declares the same
 * color. The hex rule is what keeps *every*
 * mention interactive even when later mentions are written differently from
 * the canonical symbol (e.g. symbol `V^2` with a later bare `V` mention) — see
 * GH#1 (classic-patents.com).
 */
export function prepareInteractiveLatex(equation: {
  colorizedLatex?: string;
  rawLatex: string;
  variables: Array<{ id: string; symbol: string; color: ColorVariant }>;
}): string {
  let latex = equation.colorizedLatex || equation.rawLatex;

  // Count how many variables use each palette color; a color (and thus any
  // of its hex aliases) identifies a variable only when it is unique within
  // this equation.
  const colorOwnerCount = new Map<ColorVariant, number>();
  for (const v of equation.variables) {
    colorOwnerCount.set(v.color, (colorOwnerCount.get(v.color) ?? 0) + 1);
  }

  /**
   * True when the `\textcolor` group starting at `idx` is already claimed by
   * an interactive wrapper (it sits directly inside `\htmlData{var=...}{`).
   * Guards against a second variable re-wrapping — and thereby
   * double-attributing — a group another variable already owns.
   */
  const isAlreadyClaimed = (s: string, idx: number): boolean =>
    // Cheap pre-check (`}{` immediately before the group) before the anchored
    // regex over the whole prefix; no fixed lookback window, so the guard can
    // never be defeated by a long variable id.
    idx >= 2 &&
    s[idx - 1] === "{" &&
    s[idx - 2] === "}" &&
    /\\htmlData\{var=[^{}]*\}\{$/.test(s.slice(0, idx));

  /**
   * Wraps every unclaimed `\textcolor{...}{...}` group accepted by `accept`.
   * Returns the rewritten latex and whether any group was wrapped.
   */
  const wrapMatchingColorGroups = (
    input: string,
    v: { id: string; color: ColorVariant },
    accept: (colorSpec: string, content: string) => boolean,
  ): { latex: string; found: boolean } => {
    let out = input;
    let found = false;
    const colorTargetPrefix = "\\textcolor{";
    let searchIdx = out.indexOf(colorTargetPrefix, 0);

    while (searchIdx !== -1) {
      const closeBraceColor = out.indexOf("}", searchIdx + colorTargetPrefix.length);
      if (closeBraceColor === -1) break;

      const openBraceContent = out.indexOf("{", closeBraceColor);
      if (openBraceContent !== closeBraceColor + 1) {
        searchIdx = out.indexOf(colorTargetPrefix, closeBraceColor + 1);
        continue;
      }

      const colorSpec = out.slice(searchIdx + colorTargetPrefix.length, closeBraceColor);
      const contentEnd = findBalancedGroupEnd(out, openBraceContent);
      if (contentEnd === -1) break;

      const content = out.slice(openBraceContent + 1, contentEnd);
      if (!isAlreadyClaimed(out, searchIdx) && accept(colorSpec, content)) {
        const termClass = `eq-term eq-term-${v.id} eq-term-${v.color}`;
        const fullColoredMatch = out.slice(searchIdx, contentEnd + 1);
        const replacement = `\\htmlClass{${termClass}}{\\htmlData{var=${v.id}}{${fullColoredMatch}}}`;
        out = out.slice(0, searchIdx) + replacement + out.slice(contentEnd + 1);
        found = true;
        searchIdx = out.indexOf(colorTargetPrefix, searchIdx + replacement.length);
        continue;
      }
      searchIdx = out.indexOf(colorTargetPrefix, closeBraceColor + 1);
    }
    return { latex: out, found };
  };

  const alreadyPrepared = (v: { id: string }): boolean =>
    new RegExp(`\\beq-term-${v.id}\\b`).test(latex);
  const wrappedByGroup = new Set<string>();

  // Phase 1 — exact-symbol claims. Content identity is the strongest evidence
  // of which variable a group denotes, so it always wins over color identity
  // (an equation whose authored hexes drifted from the declared palette must
  // not let the hex rule steal a group whose content names another variable).
  for (const v of equation.variables) {
    if (alreadyPrepared(v)) continue;
    const res = wrapMatchingColorGroups(latex, v, (_spec, content) => content === v.symbol);
    latex = res.latex;
    if (res.found) wrappedByGroup.add(v.id);
  }

  // Phase 2 — color-identity claims for the groups no symbol matched.
  // A hex identifies a variable only when that variable is the sole owner of
  // the palette color within this equation.
  for (const v of equation.variables) {
    if (alreadyPrepared(v) && !wrappedByGroup.has(v.id)) continue;
    if (colorOwnerCount.get(v.color) !== 1) continue;
    const hexAliases = new Set(COLOR_HEX_ALIASES[v.color].map((h) => h.toLowerCase()));
    const res = wrapMatchingColorGroups(latex, v, (spec) => hexAliases.has(spec.toLowerCase()));
    latex = res.latex;
    if (res.found) wrappedByGroup.add(v.id);
  }

  // Phase 3 — raw-text fallback for variables no colored group matched.
  for (const v of equation.variables) {
    if (wrappedByGroup.has(v.id) || alreadyPrepared(v)) continue;

    const cfg = COLOR_STYLES[v.color];
    const hex = cfg.hexLight;
    const termClass = `eq-term eq-term-${v.id} eq-term-${v.color}`;

    if (latex.includes(v.symbol)) {
      const rawReplacement = `\\htmlClass{${termClass}}{\\htmlData{var=${v.id}}{\\textcolor{${hex}}{${v.symbol}}}}`;

      const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const isAlphaNumStart = /^[a-zA-Z0-9]/.test(v.symbol);
      const isAlphaNumEnd = /[a-zA-Z0-9]$/.test(v.symbol);

      const prefix = isAlphaNumStart ? "(?<![a-zA-Z0-9\\\\_])" : "";
      const suffix = isAlphaNumEnd ? "(?![a-zA-Z0-9])" : "";
      const escapedSymbol = escapeRegExp(v.symbol);

      let re: RegExp;
      try {
        re = new RegExp(`${prefix}${escapedSymbol}${suffix}`, "g");
      } catch (_e) {
        // Engines without lookbehind support: keep the lookahead-only guard.
        re = new RegExp(`${escapedSymbol}${suffix}`, "g");
      }
      // Never rewrite inside prose, command arguments, or a group another
      // variable's wrapper already owns (see collectProtectedRanges).
      latex = replaceOutsideProtected(latex, re, rawReplacement);
    }
  }

  return latex;
}
