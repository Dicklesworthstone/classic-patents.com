"use client";

import { Activity } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { computeParameterSensitivity } from "@/physics/sensitivityKernel";

interface SensitivitySliderProps {
  id: string;
  patentId?: string;
  paramKey: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  /** Thumb color. Explicit two-way choice: a raw class string here previously
   * fell back to amber silently whenever the hue wasn't "cyan". */
  thumb?: "amber" | "cyan";
  onChange: (value: number) => void;
  allParams?: Record<string, number>;
  auditPrimaryControl?: boolean;
}

export const SensitivitySlider: React.FC<SensitivitySliderProps> = ({
  id,
  patentId,
  paramKey,
  label,
  value,
  min,
  max,
  step,
  unit = "",
  thumb = "amber",
  onChange,
  allParams = {},
  auditPrimaryControl = false,
}) => {
  const [showDetail, setShowDetail] = useState(false);

  const sensitivity = patentId
    ? computeParameterSensitivity(patentId, paramKey, {
        ...allParams,
        [paramKey]: value,
      })
    : null;

  return (
    <div className="flex flex-col gap-1.5 group relative">
      <div className="flex justify-between items-center text-xs font-sans">
        <button
          type="button"
          onClick={() => sensitivity && setShowDetail(!showDetail)}
          className="text-ink-700 dark:text-ink-300 font-medium flex items-center gap-1 text-left cursor-pointer hover:text-ink-900 dark:hover:text-parchment-100"
          title={sensitivity ? "Tap to toggle derivative details" : undefined}
          aria-expanded={sensitivity ? showDetail : undefined}
          aria-controls={sensitivity ? `${id}-sensitivity-detail` : undefined}
        >
          <span>{label}</span>
          {sensitivity && (
            <Activity
              className={`w-3.5 h-3.5 transition-opacity ${
                showDetail
                  ? "text-amber-600 dark:text-amber-400 opacity-100"
                  : "text-amber-600 dark:text-amber-400 opacity-60 group-hover:opacity-100"
              }`}
            />
          )}
        </button>
        <span className="text-amber-700 dark:text-amber-400 font-mono font-bold shrink-0 ml-2">
          {value} {unit}
        </span>
      </div>

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        aria-valuetext={`${value} ${unit}`.trim()}
        data-audit-primary-control={auditPrimaryControl ? "true" : undefined}
        className={`w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950 ${
          thumb === "cyan"
            ? "[&::-webkit-slider-thumb]:bg-cyan-600 dark:[&::-webkit-slider-thumb]:bg-cyan-400 [&::-moz-range-thumb]:bg-cyan-600 dark:[&::-moz-range-thumb]:bg-cyan-400"
            : "[&::-webkit-slider-thumb]:bg-amber-600 dark:[&::-webkit-slider-thumb]:bg-amber-400 [&::-moz-range-thumb]:bg-amber-600 dark:[&::-moz-range-thumb]:bg-amber-400"
        }`}
      />

      {/* Live Automatic Differentiation Sensitivity Pill (Hover or Mobile Tap) */}
      {sensitivity && (
        <div
          id={`${id}-sensitivity-detail`}
          className={`flex items-center justify-between px-2 py-0.5 rounded-md bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-[10px] font-mono text-amber-800 dark:text-amber-300 transition-all ${
            showDetail
              ? "opacity-100 scale-100"
              : "opacity-0 group-hover:opacity-100 [@media(pointer:coarse)]:opacity-100 scale-95 group-hover:scale-100 [@media(pointer:coarse)]:scale-100 pointer-events-none group-hover:pointer-events-auto [@media(pointer:coarse)]:pointer-events-auto"
          }`}
          title={sensitivity.interpretation}
        >
          <span className="font-semibold">{sensitivity.derivativeSymbol}:</span>
          <span>
            {sensitivity.derivativeValue > 0 ? "+" : ""}
            {sensitivity.derivativeValue} {sensitivity.derivativeUnit}
          </span>
        </div>
      )}
    </div>
  );
};
