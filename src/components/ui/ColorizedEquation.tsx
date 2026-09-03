/**
 * src/components/ui/ColorizedEquation.tsx
 *
 * Interactive Colorized Math Equation Component
 * Implements the BetterExplained dual-coding pedagogical approach with live FrankenSim SI telemetry bindings.
 */
"use client";

import { Activity, Info, Maximize2, Minimize2, RotateCcw, Sparkles, Zap } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LatexRenderer, TextWithLatex } from "@/components/ui/LatexRenderer";
import type { PhysicsMetric } from "@/physics/telemetryData";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import type {
  ColorizedEquation as ColorizedEquationModel,
  ColorVariant,
  EquationVariable,
  SentenceFragment,
} from "@/types/equation";
import { COLOR_STYLES, prepareInteractiveLatex } from "./colorPalette";
import { formatEquationTelemetryValue } from "./equationValueFormatting";

interface ColorizedEquationProps {
  equation: ColorizedEquationModel;
  initialActiveVariableId?: string;
  defaultExpanded?: boolean;
  className?: string;
  showLiveTelemetry?: boolean;
}

type SelectVariable = (id: string, pin?: boolean) => void;

const VARIABLE_DOT_CLASSES: Record<ColorVariant, string> = {
  crimson: "bg-red-500",
  sapphire: "bg-blue-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  amethyst: "bg-purple-500",
  cyan: "bg-cyan-500",
  coral: "bg-orange-500",
  rose: "bg-rose-500",
  teal: "bg-teal-500",
};

const FORMULA_KEY_MOVEMENTS: Readonly<Record<string, -1 | 1>> = {
  ArrowLeft: -1,
  ArrowUp: -1,
  ArrowRight: 1,
  ArrowDown: 1,
};

function withContentKeys<T>(
  items: readonly T[],
  describe: (item: T) => string,
): Array<{ item: T; key: string }> {
  const occurrences = new Map<string, number>();
  return items.map((item) => {
    const identity = describe(item);
    const occurrence = occurrences.get(identity) ?? 0;
    occurrences.set(identity, occurrence + 1);
    return { item, key: `${identity}#${occurrence}` };
  });
}

function liveTelemetryValueFor(
  activeVar: EquationVariable | undefined,
  params: Readonly<Record<string, number>>,
  metrics: readonly PhysicsMetric[],
): string | null {
  if (!activeVar) return null;

  const telemetryKey = activeVar.telemetryKey;
  if (telemetryKey && params[telemetryKey] !== undefined) {
    const rawValue = params[telemetryKey];
    return typeof rawValue === "number"
      ? formatEquationTelemetryValue(rawValue, activeVar)
      : String(rawValue);
  }

  const metricLabel = activeVar.telemetryMetricLabel;
  if (!metricLabel) return null;
  const matchingMetric = metrics.find(
    (metric) => metric.label.toLowerCase() === metricLabel.toLowerCase(),
  );
  return matchingMetric ? `${matchingMetric.value} ${matchingMetric.unit}` : null;
}

function formulaVariableIdFromTarget(target: EventTarget | null): string | null {
  const eventTarget = target as
    | { closest?: (selector: string) => Element | null }
    | null
    | undefined;
  const formulaTerm = eventTarget?.closest?.("[data-var], [class*='eq-term-']");
  if (!formulaTerm) return null;

  const directId = formulaTerm.getAttribute("data-var");
  if (directId) return directId;

  const className = (formulaTerm as HTMLElement).className;
  const classMatch =
    typeof className === "string" ? className.match(/\beq-term-([a-zA-Z0-9_-]+)\b/) : undefined;
  return classMatch?.[1] ?? null;
}

function equationVariableForFormulaTarget(
  variables: readonly EquationVariable[],
  target: EventTarget | null,
): EquationVariable | undefined {
  const variableId = formulaVariableIdFromTarget(target);
  if (!variableId) return undefined;

  const lowerCaseVariableId = variableId.toLowerCase();
  return variables.find(
    (variable) =>
      variable.id === variableId ||
      variable.id.toLowerCase() === lowerCaseVariableId ||
      variableId.startsWith(`var_${variable.id}`) ||
      variable.id.includes(variableId),
  );
}

function formulaVariableIdForKey(
  key: string,
  variables: readonly EquationVariable[],
  activeVarId: string | null,
): string | null {
  if (variables.length === 0) return null;
  if (key === "Home") return variables[0].id;
  if (key === "End") return variables[variables.length - 1].id;

  const movement = FORMULA_KEY_MOVEMENTS[key];
  if (movement === undefined) return null;

  const activeIndex = Math.max(
    0,
    variables.findIndex((variable) => variable.id === activeVarId),
  );
  const nextIndex = (activeIndex + movement + variables.length) % variables.length;
  return variables[nextIndex].id;
}

function synchronizeActiveFormulaTerms(
  container: HTMLButtonElement | null,
  activeVarId: string | null,
) {
  if (!container) return;

  const activeElements = container.querySelectorAll(".eq-term-active");
  for (let i = 0; i < activeElements.length; i++) {
    activeElements[i].classList.remove("eq-term-active");
  }

  if (!activeVarId) return;
  const targets = container.querySelectorAll(`.eq-term-${activeVarId}`);
  for (let i = 0; i < targets.length; i++) {
    targets[i].classList.add("eq-term-active");
  }
}

interface EquationHeaderProps {
  equation: ColorizedEquationModel;
  colorBlindMode: boolean;
  isExpanded: boolean;
  onToggleColorBlindMode: () => void;
  onReset: () => void;
  onToggleExpanded: () => void;
}

function EquationHeader({
  equation,
  colorBlindMode,
  isExpanded,
  onToggleColorBlindMode,
  onReset,
  onToggleExpanded,
}: EquationHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-parchment-200 dark:border-ink-800 bg-parchment-100/60 dark:bg-ink-900/60">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="flex h-2.5 w-2.5 relative shrink-0">
          <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-600 dark:bg-amber-400" />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-serif font-bold text-sm sm:text-base text-ink-950 dark:text-parchment-50 truncate">
              <TextWithLatex text={equation.title} />
            </h4>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 shrink-0">
              <TextWithLatex text={equation.category} />
            </span>
            {equation.claimRef && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 shrink-0">
                Claim {equation.claimRef}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onToggleColorBlindMode}
          aria-pressed={colorBlindMode}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-colors border ${
            colorBlindMode
              ? "bg-amber-700 text-white border-amber-800 dark:bg-amber-700"
              : "bg-parchment-200/80 dark:bg-ink-800/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700 hover:bg-parchment-300 dark:hover:bg-ink-700"
          }`}
          title="Toggle high-contrast / symbol markers for accessibility"
        >
          {colorBlindMode ? "Pattern Mode: On" : "Accessibility"}
        </button>

        <button
          type="button"
          onClick={onReset}
          aria-label="Reset highlight to initial term"
          className="p-1.5 rounded-lg bg-parchment-200/80 dark:bg-ink-800/80 text-ink-700 dark:text-ink-300 border border-parchment-300 dark:border-ink-700 hover:bg-parchment-300 dark:hover:bg-ink-700 transition-colors"
          title="Reset highlight to initial term"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={onToggleExpanded}
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
  );
}

interface FormulaVariableChipProps {
  variable: EquationVariable;
  isSelected: boolean;
  onSelectVariable: SelectVariable;
}

function FormulaVariableChip({ variable, isSelected, onSelectVariable }: FormulaVariableChipProps) {
  const style = COLOR_STYLES[variable.color];
  return (
    <button
      type="button"
      onClick={() => onSelectVariable(variable.id, true)}
      onMouseEnter={() => onSelectVariable(variable.id)}
      aria-pressed={isSelected}
      aria-label={`Highlight ${variable.name} (${variable.symbol})`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all border ${
        isSelected
          ? `${style.textClass} ${style.badgeBg} ${style.borderClass} ${style.glowClass} scale-105 ring-2 ring-amber-500/40`
          : "bg-parchment-50 dark:bg-ink-950/80 text-ink-700 dark:text-parchment-300 border-parchment-300 dark:border-ink-700 hover:border-amber-500/50"
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${VARIABLE_DOT_CLASSES[variable.color] ?? "bg-teal-500"}`}
      />
      <LatexRenderer math={variable.symbol} />
    </button>
  );
}

interface EquationFormulaSurfaceProps {
  equation: ColorizedEquationModel;
  activeVarId: string | null;
  onSelectVariable: SelectVariable;
  onFormulaMouseLeave: () => void;
  onFormulaFocus: () => void;
}

function EquationFormulaSurface({
  equation,
  activeVarId,
  onSelectVariable,
  onFormulaMouseLeave,
  onFormulaFocus,
}: EquationFormulaSurfaceProps) {
  const formulaRef = useRef<HTMLButtonElement>(null);
  const interactiveLatex = useMemo(() => prepareInteractiveLatex(equation), [equation]);

  const handleFormulaMouseOver = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const variable = equationVariableForFormulaTarget(equation.variables, event.target);
      if (variable) onSelectVariable(variable.id);
    },
    [equation.variables, onSelectVariable],
  );

  const handleFormulaClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const variable = equationVariableForFormulaTarget(equation.variables, event.target);
      if (variable) onSelectVariable(variable.id, true);
    },
    [equation.variables, onSelectVariable],
  );

  const handleFormulaKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      const variableId = formulaVariableIdForKey(event.key, equation.variables, activeVarId);
      if (!variableId) return;
      event.preventDefault();
      onSelectVariable(variableId, true);
    },
    [activeVarId, equation.variables, onSelectVariable],
  );

  useEffect(() => {
    synchronizeActiveFormulaTerms(formulaRef.current, activeVarId);
  }, [activeVarId]);

  return (
    <div className="relative py-6 px-6 sm:px-8 rounded-2xl bg-parchment-100/70 dark:bg-ink-900/80 border border-parchment-200 dark:border-ink-800 flex flex-col items-center justify-center text-center shadow-inner overflow-x-auto overflow-y-visible min-h-[110px]">
      <div className="text-[11px] font-mono uppercase tracking-widest text-ink-500 dark:text-ink-400 mb-2 font-semibold flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
        <span>Mathematical Governing Law</span>
      </div>

      <button
        type="button"
        ref={formulaRef}
        onMouseOver={handleFormulaMouseOver}
        onClick={handleFormulaClick}
        onMouseLeave={onFormulaMouseLeave}
        onBlur={onFormulaMouseLeave}
        onFocus={onFormulaFocus}
        onKeyDown={handleFormulaKeyDown}
        aria-label="Interactive governing formula. Use the arrow keys to inspect each term."
        className="max-w-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-lg font-serif tracking-wide text-ink-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700 dark:text-parchment-50 sm:text-2xl"
      >
        <span className="block overflow-x-auto overflow-y-visible py-3 select-text">
          <LatexRenderer math={interactiveLatex} block={true} className="text-center" />
        </span>
      </button>

      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 pt-3 border-t border-parchment-200/80 dark:border-ink-800/80 w-full">
        <span className="text-[10px] font-mono uppercase text-ink-500 dark:text-ink-400 mr-1 font-semibold">
          Terms:
        </span>
        {equation.variables.map((variable) => (
          <FormulaVariableChip
            key={variable.id}
            variable={variable}
            isSelected={activeVarId === variable.id}
            onSelectVariable={onSelectVariable}
          />
        ))}
      </div>
    </div>
  );
}

interface PlainEnglishFragmentProps {
  fragment: SentenceFragment;
  variables: readonly EquationVariable[];
  activeVarId: string | null;
  colorBlindMode: boolean;
  onSelectVariable: SelectVariable;
}

function PlainEnglishFragment({
  fragment,
  variables,
  activeVarId,
  colorBlindMode,
  onSelectVariable,
}: PlainEnglishFragmentProps) {
  const variable = fragment.variableId
    ? variables.find((candidate) => candidate.id === fragment.variableId)
    : undefined;
  if (!variable) return <TextWithLatex text={fragment.text} />;

  const style = COLOR_STYLES[variable.color];
  const isActive = activeVarId === variable.id;
  return (
    <button
      type="button"
      onClick={() => onSelectVariable(variable.id, true)}
      onMouseEnter={() => onSelectVariable(variable.id)}
      aria-pressed={isActive}
      aria-label={`${variable.name} (${variable.symbol}): ${variable.role}`}
      className={`inline-block font-serif font-bold mx-0.5 px-1.5 py-0.5 rounded-md transition-all cursor-pointer border ${
        isActive
          ? `${style.textClass} ${style.badgeBg} ${style.borderClass} ${style.glowClass} scale-105 ring-2 ring-amber-500/40 underline ${style.underlineClass}`
          : `${style.textClass} bg-transparent border-transparent hover:${style.badgeBg} hover:${style.borderClass}`
      } ${
        colorBlindMode
          ? "border-dashed !border-ink-400 dark:!border-ink-500 font-sans tracking-wide uppercase text-xs"
          : ""
      }`}
      title={`${variable.name} (${variable.symbol}): ${variable.role}`}
    >
      <TextWithLatex text={fragment.text} />
    </button>
  );
}

interface PlainEnglishDecoderProps {
  equation: ColorizedEquationModel;
  activeVarId: string | null;
  colorBlindMode: boolean;
  onSelectVariable: SelectVariable;
}

function PlainEnglishDecoder({
  equation,
  activeVarId,
  colorBlindMode,
  onSelectVariable,
}: PlainEnglishDecoderProps) {
  return (
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

      <div className="font-serif text-sm sm:text-base leading-relaxed text-ink-900 dark:text-parchment-100 select-text">
        {withContentKeys(
          equation.plainEnglishSentence,
          (fragment) => `${fragment.variableId ?? "text"}:${fragment.text}`,
        ).map(({ item: fragment, key }) => (
          <PlainEnglishFragment
            key={key}
            fragment={fragment}
            variables={equation.variables}
            activeVarId={activeVarId}
            colorBlindMode={colorBlindMode}
            onSelectVariable={onSelectVariable}
          />
        ))}
      </div>
    </div>
  );
}

interface ActiveVariableInspectorProps {
  activeVar: EquationVariable | undefined;
  showLiveTelemetry: boolean;
  liveTelemetryValue: string | null;
}

function ActiveVariableInspector({
  activeVar,
  showLiveTelemetry,
  liveTelemetryValue,
}: ActiveVariableInspectorProps) {
  if (!activeVar) return null;
  const style = COLOR_STYLES[activeVar.color];

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 transition-all space-y-3 ${style.badgeBg} ${style.borderClass} shadow-md`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 dark:border-white/10 pb-2.5">
        <div className="flex items-center gap-2.5">
          <span
            className={`inline-flex items-center justify-center font-mono font-bold text-sm px-2.5 py-1 rounded-lg border bg-white/80 dark:bg-ink-950/80 ${style.textClass} ${style.borderClass}`}
          >
            <LatexRenderer math={activeVar.symbol} />
          </span>
          <div>
            <h5 className="font-serif font-bold text-sm sm:text-base text-ink-950 dark:text-parchment-50">
              <TextWithLatex text={activeVar.name} />
            </h5>
            <div className="text-[11px] font-sans text-ink-600 dark:text-ink-300">
              <TextWithLatex text={activeVar.role} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-right">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-white/80 dark:bg-ink-950/80 border border-black/10 dark:border-white/10 text-ink-800 dark:text-parchment-200">
            <TextWithLatex text={activeVar.unit} />
          </span>
          {activeVar.dimension && (
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono text-ink-500 dark:text-ink-400 bg-black/5 dark:bg-white/5">
              <TextWithLatex text={activeVar.dimension} />
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 text-xs sm:text-sm font-sans leading-relaxed text-ink-800 dark:text-parchment-200">
        <p>
          <TextWithLatex text={activeVar.explanation} />
        </p>
      </div>

      {showLiveTelemetry && liveTelemetryValue !== null && (
        <div className="flex items-center justify-between pt-2 border-t border-black/10 dark:border-white/10 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-300 font-bold">
            <Activity className="w-3.5 h-3.5 motion-safe:animate-pulse text-amber-600" />
            <span>Live Physical Value:</span>
          </div>
          <div className="font-bold text-sm px-2 py-0.5 rounded bg-white/90 dark:bg-ink-950/90 border border-amber-300 dark:border-amber-700/60 text-amber-950 dark:text-amber-200 shadow-2xs">
            <TextWithLatex text={liveTelemetryValue} />
          </div>
        </div>
      )}
    </div>
  );
}

interface PedagogicalInsightProps {
  isExpanded: boolean;
  pedagogicalNote: string;
  historicalSignificance?: string;
}

function PedagogicalInsight({
  isExpanded,
  pedagogicalNote,
  historicalSignificance,
}: PedagogicalInsightProps) {
  if (!isExpanded || !pedagogicalNote) return null;

  return (
    <div className="rounded-xl border border-amber-200/80 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 p-3.5 sm:p-4 text-xs font-sans text-ink-800 dark:text-parchment-200 leading-relaxed flex items-start gap-2.5">
      <Info className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
      <div>
        <span className="font-serif font-bold text-ink-950 dark:text-parchment-100 block mb-0.5">
          Physical Principle &amp; Engineering Insight
        </span>
        <p>
          <TextWithLatex text={pedagogicalNote} />
        </p>
        {historicalSignificance && (
          <p className="mt-1.5 text-[11px] text-ink-600 dark:text-ink-400 italic">
            <strong>Historical Context:</strong> <TextWithLatex text={historicalSignificance} />
          </p>
        )}
      </div>
    </div>
  );
}

export function ColorizedEquation({
  equation,
  initialActiveVariableId,
  defaultExpanded = true,
  className = "",
  showLiveTelemetry = true,
}: ColorizedEquationProps) {
  const [activeVarId, setActiveVarId] = useState<string | null>(
    initialActiveVariableId ?? (equation.variables[0]?.id || null),
  );
  // Pinning only changes which identifier the mouse-leave handler restores;
  // the active variable remains the rendered source of truth. Store this
  // interaction-only value in a ref so a click does not schedule a second
  // render after selecting the variable.
  const pinnedVarIdRef = useRef<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [colorBlindMode, setColorBlindMode] = useState<boolean>(false);
  const { params, metrics } = usePatentPhysics(equation.patentId);

  const activeVar = useMemo(
    () => equation.variables.find((variable) => variable.id === activeVarId),
    [equation.variables, activeVarId],
  );
  const liveTelemetryValue = useMemo(
    () => liveTelemetryValueFor(activeVar, params, metrics),
    [activeVar, params, metrics],
  );

  const handleSelectVar = useCallback<SelectVariable>((id, pin = false) => {
    setActiveVarId(id);
    if (pin) pinnedVarIdRef.current = id;
  }, []);

  const handleReset = useCallback(() => {
    setActiveVarId(equation.variables[0]?.id ?? null);
    pinnedVarIdRef.current = null;
  }, [equation.variables]);

  const handleFormulaMouseLeave = useCallback(() => {
    if (pinnedVarIdRef.current) setActiveVarId(pinnedVarIdRef.current);
  }, []);

  const handleFormulaFocus = useCallback(() => {
    if (activeVarId !== null) return;
    setActiveVarId(equation.variables[0]?.id ?? null);
  }, [activeVarId, equation.variables]);

  return (
    <div
      data-testid="colorized-equation"
      data-equation-id={equation.id}
      data-patent-id={equation.patentId}
      className={`rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50/90 dark:bg-ink-950/90 shadow-sm overflow-hidden transition-all text-xs font-sans text-ink-900 dark:text-parchment-100 ${className}`}
    >
      <EquationHeader
        equation={equation}
        colorBlindMode={colorBlindMode}
        isExpanded={isExpanded}
        onToggleColorBlindMode={() => setColorBlindMode((value) => !value)}
        onReset={handleReset}
        onToggleExpanded={() => setIsExpanded((value) => !value)}
      />

      <div className="p-4 sm:p-6 space-y-6">
        <EquationFormulaSurface
          equation={equation}
          activeVarId={activeVarId}
          onSelectVariable={handleSelectVar}
          onFormulaMouseLeave={handleFormulaMouseLeave}
          onFormulaFocus={handleFormulaFocus}
        />
        <PlainEnglishDecoder
          equation={equation}
          activeVarId={activeVarId}
          colorBlindMode={colorBlindMode}
          onSelectVariable={handleSelectVar}
        />
        <ActiveVariableInspector
          activeVar={activeVar}
          showLiveTelemetry={showLiveTelemetry}
          liveTelemetryValue={liveTelemetryValue}
        />
        <PedagogicalInsight
          isExpanded={isExpanded}
          pedagogicalNote={equation.pedagogicalNote}
          historicalSignificance={equation.historicalSignificance}
        />
      </div>
    </div>
  );
}
