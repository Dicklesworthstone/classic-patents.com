"use client";

import { Activity } from "lucide-react";
import type React from "react";
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
  const sensitivity = patentId
    ? computeParameterSensitivity(patentId, paramKey, {
        ...allParams,
        [paramKey]: value,
      })
    : null;

  return (
    <div className="flex flex-col gap-1.5 group relative">
      <div className="flex justify-between items-center text-xs font-sans">
        <span className="text-ink-700 dark:text-ink-300 font-medium flex items-center gap-1">
          {label}
          {sensitivity && (
            <Activity className="w-3 h-3 text-amber-600 dark:text-amber-400 opacity-60 group-hover:opacity-100 transition-opacity" />
          )}
        </span>
        <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
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
        className={`w-full ${colorClass} bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer transition-all`}
      />

      {/* Live Automatic Differentiation Sensitivity Pill */}
      {sensitivity && (
        <div
          className="flex items-center justify-between px-2 py-0.5 rounded-md bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-[10px] font-mono text-amber-800 dark:text-amber-300 transition-all opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 pointer-events-none group-hover:pointer-events-auto"
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
