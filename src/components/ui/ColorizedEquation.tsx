/**
 * src/components/ui/ColorizedEquation.tsx
 *
 * Interactive Colorized Math Equation Component
 * Implements the BetterExplained dual-coding pedagogical approach with live FrankenSim SI telemetry bindings.
 */
"use client";

import katex from "katex";
import { Activity, Info, Maximize2, Minimize2, RotateCcw, Sparkles, Zap } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import type {
  ColorizedEquation as ColorizedEquationModel,
  EquationVariable,
} from "@/types/equation";
import { COLOR_STYLES } from "./colorPalette";

interface ColorizedEquationProps {
  equation: ColorizedEquationModel;
  initialActiveVariableId?: string;
  defaultExpanded?: boolean;
  className?: string;
  showLiveTelemetry?: boolean;
}

export function ColorizedEquation({
  equation,
  initialActiveVariableId,
  defaultExpanded = true,
  className = "",
  showLiveTelemetry = true,
}: ColorizedEquationProps) {
  const compId = useId().replace(/:/g, "");
  const [activeVarId, setActiveVarId] = useState<string | null>(
    initialActiveVariableId ?? (equation.variables[0]?.id || null),
  );
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [colorBlindMode, setColorBlindMode] = useState<boolean>(false);

  // Bind to live FrankenSim physics bus
  const { params, metrics } = usePatentPhysics(equation.patentId);

  const formulaContainerRef = useRef<HTMLDivElement>(null);

  // Active variable object
  const activeVar: EquationVariable | undefined = useMemo(() => {
    return equation.variables.find((v) => v.id === activeVarId);
  }, [equation.variables, activeVarId]);

  // Compute live value for active variable from physics bus
  const liveTelemetryValue = useMemo(() => {
    if (!activeVar) return null;
    if (activeVar.telemetryKey && params[activeVar.telemetryKey] !== undefined) {
      const rawVal = params[activeVar.telemetryKey];
      if (typeof rawVal === "number") {
        return activeVar.formatValue
          ? activeVar.formatValue(rawVal)
          : `${rawVal.toFixed(2)} ${activeVar.unit}`;
      }
      return String(rawVal);
    }
    if (activeVar.telemetryMetricLabel) {
      const foundMetric = metrics.find(
        (m) => m.label.toLowerCase() === activeVar.telemetryMetricLabel?.toLowerCase(),
      );
      if (foundMetric) return `${foundMetric.value} ${foundMetric.unit}`;
    }
    return null;
  }, [activeVar, params, metrics]);

  // Render KaTeX HTML
  useEffect(() => {
    const el = formulaContainerRef.current;
    if (!el) return;

    try {
      katex.render(equation.colorizedLatex || equation.rawLatex, el, {
        displayMode: true,
        throwOnError: false,
        trust: true,
        output: "htmlAndMathml",
      });
    } catch {
      el.textContent = equation.rawLatex;
    }
  }, [equation.colorizedLatex, equation.rawLatex]);

  const handleSelectVar = useCallback((id: string, pin = false) => {
    setActiveVarId(id);
    if (pin) setIsPinned(true);
  }, []);

  const handleReset = useCallback(() => {
    setActiveVarId(equation.variables[0]?.id ?? null);
    setIsPinned(false);
  }, [equation.variables]);

  return (
    <div
      className={`rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50/90 dark:bg-ink-950/90 shadow-sm overflow-hidden transition-all text-xs font-sans text-ink-900 dark:text-parchment-100 ${className}`}
    >
      {/* 1. Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-parchment-200 dark:border-ink-800 bg-parchment-100/60 dark:bg-ink-900/60">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-2.5 w-2.5 relative shrink-0">
            <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-600 dark:bg-amber-400" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-serif font-bold text-sm sm:text-base text-ink-950 dark:text-parchment-50 truncate">
                {equation.title}
              </h4>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 shrink-0">
                {equation.category}
              </span>
              {equation.claimRef && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 shrink-0">
                  Claim {equation.claimRef}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setColorBlindMode((v) => !v)}
            aria-pressed={colorBlindMode}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-colors border ${
              colorBlindMode
                ? "bg-amber-700 text-white border-amber-800 dark:bg-amber-600"
                : "bg-parchment-200/80 dark:bg-ink-800/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700 hover:bg-parchment-300 dark:hover:bg-ink-700"
            }`}
            title="Toggle high-contrast / symbol markers for accessibility"
          >
            {colorBlindMode ? "Pattern Mode: On" : "Accessibility"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            aria-label="Reset highlight to initial term"
            className="p-1.5 rounded-lg bg-parchment-200/80 dark:bg-ink-800/80 text-ink-700 dark:text-ink-300 border border-parchment-300 dark:border-ink-700 hover:bg-parchment-300 dark:hover:bg-ink-700 transition-colors"
            title="Reset highlight to initial term"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded((v) => !v)}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse view" : "Expand view"}
            className="p-1.5 rounded-lg bg-parchment-200/80 dark:bg-ink-800/80 text-ink-700 dark:text-ink-300 border border-parchment-300 dark:border-ink-700 hover:bg-parchment-300 dark:hover:bg-ink-700 transition-colors"
            title={isExpanded ? "Collapse view" : "Expand view"}
          >
            {isExpanded ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* 2. Main Visual Canvas */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* Colorized Mathematical Formula */}
        <div className="relative py-4 px-6 rounded-2xl bg-parchment-100/70 dark:bg-ink-900/80 border border-parchment-200 dark:border-ink-800 flex flex-col items-center justify-center text-center shadow-inner overflow-x-auto">
          <div className="text-[11px] font-mono uppercase tracking-widest text-ink-500 dark:text-ink-400 mb-2 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Mathematical Governing Law</span>
          </div>

          <div
            ref={formulaContainerRef}
            className="text-lg sm:text-2xl font-serif py-2 tracking-wide text-ink-950 dark:text-parchment-50 select-text overflow-x-auto max-w-full"
          />

          {/* Quick variable jumper chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 pt-3 border-t border-parchment-200/80 dark:border-ink-800/80 w-full">
            <span className="text-[10px] font-mono uppercase text-ink-500 dark:text-ink-400 mr-1 font-semibold">
              Terms:
            </span>
            {equation.variables.map((v) => {
              const style = COLOR_STYLES[v.color];
              const isSelected = activeVarId === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => handleSelectVar(v.id, true)}
                  onMouseEnter={() => !isPinned && setActiveVarId(v.id)}
                  aria-pressed={isSelected}
                  aria-label={`Highlight ${v.name} (${v.symbol})`}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all border ${
                    isSelected
                      ? `${style.textClass} ${style.badgeBg} ${style.borderClass} ${style.glowClass} scale-105 ring-2 ring-amber-500/40`
                      : "bg-parchment-50 dark:bg-ink-950/80 text-ink-700 dark:text-parchment-300 border-parchment-300 dark:border-ink-700 hover:border-amber-500/50"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      v.color === "crimson"
                        ? "bg-red-500"
                        : v.color === "sapphire"
                          ? "bg-blue-500"
                          : v.color === "emerald"
                            ? "bg-emerald-500"
                            : v.color === "amber"
                              ? "bg-amber-500"
                              : v.color === "amethyst"
                                ? "bg-purple-500"
                                : v.color === "cyan"
                                  ? "bg-cyan-500"
                                  : v.color === "coral"
                                    ? "bg-orange-500"
                                    : v.color === "rose"
                                      ? "bg-rose-500"
                                      : "bg-teal-500"
                    }`}
                  />
                  <span>{v.symbol}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Synchronized Plain-English Natural Language Sentence */}
        <div className="rounded-2xl p-4 sm:p-5 bg-parchment-100/50 dark:bg-ink-900/50 border border-parchment-300 dark:border-ink-800 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-800 dark:text-amber-400 font-bold flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-amber-600" />
              <span>Plain English Decoder</span>
            </span>
            <span className="text-[10px] text-ink-500 dark:text-ink-400 font-sans italic">
              Hover or tap any highlighted phrase
            </span>
          </div>

          <p className="font-serif text-sm sm:text-base leading-relaxed text-ink-900 dark:text-parchment-100 select-text">
            {equation.plainEnglishSentence.map((fragment, idx) => {
              if (!fragment.variableId) {
                return <span key={`${compId}-txt-${idx}`}>{fragment.text}</span>;
              }

              const v = equation.variables.find((item) => item.id === fragment.variableId);
              if (!v) return <span key={`${compId}-txt-${idx}`}>{fragment.text}</span>;

              const style = COLOR_STYLES[v.color];
              const isActive = activeVarId === v.id;

              return (
                <button
                  key={`${compId}-frag-${v.id}-${idx}`}
                  type="button"
                  onClick={() => handleSelectVar(v.id, true)}
                  onMouseEnter={() => !isPinned && setActiveVarId(v.id)}
                  aria-pressed={isActive}
                  aria-label={`${v.name} (${v.symbol}): ${v.role}`}
                  className={`inline-block font-serif font-bold mx-0.5 px-1.5 py-0.5 rounded-md transition-all cursor-pointer border ${
                    isActive
                      ? `${style.textClass} ${style.badgeBg} ${style.borderClass} ${style.glowClass} scale-105 ring-2 ring-amber-500/40 underline ${style.underlineClass}`
                      : `${style.textClass} bg-transparent border-transparent hover:${style.badgeBg} hover:${style.borderClass}`
                  } ${colorBlindMode ? "border-dashed !border-ink-400 dark:!border-ink-500 font-sans tracking-wide uppercase text-xs" : ""}`}
                  title={`${v.name} (${v.symbol}): ${v.role}`}
                >
                  {fragment.text}
                </button>
              );
            })}
          </p>
        </div>

        {/* 4. Active Variable Deep Inspector Drawer */}
        {activeVar && (
          <div
            className={`rounded-2xl border p-4 sm:p-5 transition-all space-y-3 ${
              COLOR_STYLES[activeVar.color].badgeBg
            } ${COLOR_STYLES[activeVar.color].borderClass} shadow-md`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 dark:border-white/10 pb-2.5">
              <div className="flex items-center gap-2.5">
                <span
                  className={`inline-flex items-center justify-center font-mono font-bold text-sm px-2.5 py-1 rounded-lg border bg-white/80 dark:bg-ink-950/80 ${
                    COLOR_STYLES[activeVar.color].textClass
                  } ${COLOR_STYLES[activeVar.color].borderClass}`}
                >
                  {activeVar.symbol}
                </span>
                <div>
                  <h5 className="font-serif font-bold text-sm sm:text-base text-ink-950 dark:text-parchment-50">
                    {activeVar.name}
                  </h5>
                  <div className="text-[11px] font-sans text-ink-600 dark:text-ink-300">
                    {activeVar.role}
                  </div>
                </div>
              </div>

              {/* SI Unit & Dimension Badge */}
              <div className="flex items-center gap-2 text-right">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-white/80 dark:bg-ink-950/80 border border-black/10 dark:border-white/10 text-ink-800 dark:text-parchment-200">
                  {activeVar.unit}
                </span>
                {activeVar.dimension && (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono text-ink-500 dark:text-ink-400 bg-black/5 dark:bg-white/5">
                    {activeVar.dimension}
                  </span>
                )}
              </div>
            </div>

            {/* Explanation & First-Principles Physics */}
            <div className="space-y-2 text-xs sm:text-sm font-sans leading-relaxed text-ink-800 dark:text-parchment-200">
              <p>{activeVar.explanation}</p>
            </div>

            {/* Live Telemetry Value Readout */}
            {showLiveTelemetry && liveTelemetryValue !== null && (
              <div className="flex items-center justify-between pt-2 border-t border-black/10 dark:border-white/10 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-300 font-bold">
                  <Activity className="w-3.5 h-3.5 animate-pulse text-amber-600" />
                  <span>Live Physical Value:</span>
                </div>
                <div className="font-bold text-sm px-2 py-0.5 rounded bg-white/90 dark:bg-ink-950/90 border border-amber-300 dark:border-amber-700/60 text-amber-950 dark:text-amber-200 shadow-2xs">
                  {liveTelemetryValue}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. Pedagogical Insight Callout */}
        {isExpanded && equation.pedagogicalNote && (
          <div className="rounded-xl border border-amber-200/80 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 p-3.5 sm:p-4 text-xs font-sans text-ink-800 dark:text-parchment-200 leading-relaxed flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-serif font-bold text-ink-950 dark:text-parchment-100 block mb-0.5">
                Physical Principle &amp; Engineering Insight
              </span>
              <p>{equation.pedagogicalNote}</p>
              {equation.historicalSignificance && (
                <p className="mt-1.5 text-[11px] text-ink-600 dark:text-ink-400 italic">
                  <strong>Historical Context:</strong> {equation.historicalSignificance}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
