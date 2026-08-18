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
 * Takes a colorized equation and ensures all variables are wrapped with interactive HTML classes and data attributes for KaTeX rendering.
 */
export function prepareInteractiveLatex(equation: {
  colorizedLatex?: string;
  rawLatex: string;
  variables: Array<{ id: string; symbol: string; color: ColorVariant }>;
}): string {
  let latex = equation.colorizedLatex || equation.rawLatex;

  for (const v of equation.variables) {
    if (new RegExp(`\\beq-term-${v.id}\\b`).test(latex)) continue;

    const cfg = COLOR_STYLES[v.color];
    const hex = cfg.hexLight;
    const termClass = `eq-term eq-term-${v.id} eq-term-${v.color}`;

    let found = false;
    const colorTargetPrefix = "\\textcolor{";
    let searchIdx = latex.indexOf(colorTargetPrefix, 0);

    while (searchIdx !== -1) {
      const closeBraceColor = latex.indexOf("}", searchIdx + colorTargetPrefix.length);
      if (closeBraceColor === -1) break;

      const openBraceContent = latex.indexOf("{", closeBraceColor);
      if (openBraceContent !== closeBraceColor + 1) {
        searchIdx = latex.indexOf(colorTargetPrefix, closeBraceColor + 1);
        continue;
      }

      if (latex.startsWith(v.symbol, openBraceContent + 1)) {
        const afterSymbolIdx = openBraceContent + 1 + v.symbol.length;
        if (latex[afterSymbolIdx] === "}") {
          const fullColoredMatch = latex.slice(searchIdx, afterSymbolIdx + 1);
          const replacement = `\\htmlClass{${termClass}}{\\htmlData{var=${v.id}}{${fullColoredMatch}}}`;
          latex = latex.slice(0, searchIdx) + replacement + latex.slice(afterSymbolIdx + 1);
          found = true;
          searchIdx = searchIdx + replacement.length;
          continue;
        }
      }
      searchIdx = latex.indexOf(colorTargetPrefix, closeBraceColor + 1);
    }

    if (!found && latex.includes(v.symbol)) {
      const rawReplacement = `\\htmlClass{${termClass}}{\\htmlData{var=${v.id}}{\\textcolor{${hex}}{${v.symbol}}}}`;

      const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const isAlphaNumStart = /^[a-zA-Z0-9]/.test(v.symbol);
      const isAlphaNumEnd = /[a-zA-Z0-9]$/.test(v.symbol);

      const prefix = isAlphaNumStart ? "(?<![a-zA-Z0-9\\\\_])" : "";
      const suffix = isAlphaNumEnd ? "(?![a-zA-Z0-9])" : "";
      const regexStr = `${prefix}${escapeRegExp(v.symbol)}${suffix}`;

      try {
        const re = new RegExp(regexStr, "g");
        const parts = latex.split(/(\\text\{[^{}]*\})/g);
        for (let i = 0; i < parts.length; i++) {
          if (!parts[i].startsWith("\\text{")) {
            parts[i] = parts[i].replace(re, rawReplacement);
          }
        }
        latex = parts.join("");
      } catch (_e) {
        // Fallback to basic string replacement if regex fails on legacy browser
        latex = latex.replaceAll(v.symbol, rawReplacement);
      }
    }
  }

  return latex;
}
