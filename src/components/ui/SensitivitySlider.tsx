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
  colorClass?: string;
  onChange: (value: number) => void;
  allParams?: Record<string, number>;
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
  colorClass = "accent-amber-600",
  onChange,
  allParams = {},
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
        className={`w-full ${colorClass} bg-parchment-300 dark:bg-ink-700 rounded-lg h-2.5 sm:h-2 cursor-pointer transition-all touch-none`}
      />

      {/* Live Automatic Differentiation Sensitivity Pill (Hover or Mobile Tap) */}
      {sensitivity && (
        <div
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
