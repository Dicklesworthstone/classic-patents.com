"use client";

import type { PhysicsControl } from "@/physics/telemetryData";
import type { ParamChange } from "@/physics/usePatentPhysics";

interface PhysicsTelemetryControlsProps {
  controls: PhysicsControl[];
  lastChange: ParamChange | null;
  onUpdateParam: (id: string, value: number) => void;
  params: Record<string, number>;
  patentId: string;
}

interface PhysicsTelemetryControlCardProps {
  control: PhysicsControl;
  onUpdateParam: (id: string, value: number) => void;
  params: Record<string, number>;
  patentId: string;
}

function PhysicsTelemetryControlCard({
  control,
  onUpdateParam,
  params,
  patentId,
}: PhysicsTelemetryControlCardProps) {
  const value = params[control.id] ?? control.defaultValue;
  const isCheckbox = control.min === 0 && control.max === 1 && control.step === 1 && !control.unit;
  // Claim 18 interlock: while coupling is engaged the kernel derives the
  // rudder from wing warp, so a free rudder slider would be a dead control.
  const rudderInterlocked =
    patentId === "us-821393-wright-flyer" &&
    control.id === "rudder" &&
    (params.coupled ?? 1) >= 0.5;
  const displayValue = value > 0 && control.min < 0 ? `+${value}` : value;

  return (
    <div className="p-3 rounded-xl border border-parchment-200 dark:border-ink-800 bg-white/50 dark:bg-ink-950/50 shadow-2xs space-y-1.5 flex flex-col justify-center">
      {isCheckbox ? (
        <label className="flex items-center gap-2 cursor-pointer text-xs font-mono">
          <input
            type="checkbox"
            checked={value > 0.5}
            onChange={(event) => onUpdateParam(control.id, event.target.checked ? 1 : 0)}
            data-physics-control-id={control.id}
            className="rounded accent-emerald-600 w-4 h-4"
          />
          <span className="font-bold text-ink-900 dark:text-parchment-100 truncate">
            {control.label}
          </span>
        </label>
      ) : (
        <>
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span className="font-semibold text-ink-800 dark:text-parchment-200 truncate pr-2">
              {control.label}
            </span>
            <span className="text-amber-700 dark:text-amber-400 font-bold whitespace-nowrap">
              {displayValue} {control.unit}
            </span>
          </div>
          <input
            type="range"
            min={control.min}
            max={control.max}
            step={control.step}
            value={value}
            onChange={(event) => onUpdateParam(control.id, Number(event.target.value))}
            disabled={rudderInterlocked}
            data-physics-control-id={control.id}
            className={`${rudderInterlocked ? "opacity-50 cursor-not-allowed" : ""} w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 dark:[&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 dark:[&::-moz-range-thumb]:bg-amber-400 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950`}
            aria-label={control.label}
            aria-valuetext={`${displayValue} ${control.unit || ""}`.trim()}
          />
          {rudderInterlocked ? (
            <p className="text-[10px] font-mono text-ink-500 dark:text-ink-400">
              Claim 18 interlock: rudder follows wing warp. Uncouple to command it directly.
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}

export function PhysicsTelemetryControls({
  controls,
  lastChange: _lastChange,
  onUpdateParam,
  params,
  patentId,
}: PhysicsTelemetryControlsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4 border-t border-parchment-200 dark:border-ink-800">
      {controls.map((control) => (
        <PhysicsTelemetryControlCard
          key={control.id}
          control={control}
          onUpdateParam={onUpdateParam}
          params={params}
          patentId={patentId}
        />
      ))}
    </div>
  );
}
