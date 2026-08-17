"use client";

import { RotateCcw, Sparkles, Thermometer, Waves } from "lucide-react";
import { useState } from "react";
import { FrankenSimEngine } from "@/physics/engine";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

export function EinsteinRefrigeratorSim() {
  const { params, updateParam } = usePatentPhysics("us-1781541-einstein-refrigerator");
  const heatInputWatts = params.heatInput ?? 220;
  const systemPressureAtm = params.totalPressure ?? 15.0;
  const [ammoniaRatio, setAmmoniaRatio] = useState<number>(0.65);

  // Thermodynamic absorption calculations via FrankenSimEngine
  const thermo = FrankenSimEngine.stepEinsteinRefrigerator(
    heatInputWatts,
    systemPressureAtm,
    ammoniaRatio,
  );

  const evaporatorTempC = thermo.temperatureCelsius;
  const coolingPowerWatts = thermo.coolingPowerWatts;
  const cop = thermo.coefficientOfPerformance;
  const partialPressureButaneAtm = thermo.partialPressureButaneAtm;

  const resetToStandardCycle = () => {
    updateParam("heatInput", 220);
    updateParam("totalPressure", 15.0);
    setAmmoniaRatio(0.65);
  };

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-amber-600 dark:text-amber-500 animate-pulse" />
            <h3 className="font-serif text-lg sm:text-xl font-bold text-ink-900 dark:text-parchment-100">
              Einstein-Szilard 3-Fluid Single-Pressure Absorption Cycle (US 1,781,541)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-1">
            Continuous refrigeration with{" "}
            <strong>no moving parts, no seals, and no toxic freon leaks</strong>. A thermal burner
            drives ammonia vapor to decrease butane's partial pressure, evoking rapid evaporation at
            sub-zero temperatures.
          </p>
        </div>

        <button
          type="button"
          onClick={resetToStandardCycle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 bg-white/80 dark:bg-ink-900/80 text-xs font-mono text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Cycle</span>
        </button>
      </div>

      {/* Grid: 2D Thermodynamic Schematic + Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Continuous Cycle Loop */}
        <div className="lg:col-span-2 relative bg-parchment-100/60 dark:bg-ink-900/60 rounded-xl border border-parchment-300 dark:border-ink-800 p-4 flex flex-col items-center justify-center min-h-[340px] overflow-hidden select-none">
          <div className="absolute top-3 left-3 text-[11px] font-mono text-ink-500 dark:text-ink-400 flex items-center gap-1.5">
            <Waves className="w-3.5 h-3.5 text-cyan-600" />
            <span>Hermetically Sealed Single-Pressure Loop (Butane / NH₃ / H₂O)</span>
          </div>

          <svg viewBox="0 0 420 280" className="w-full max-w-[500px] h-auto">
            {/* Generator / Thermal Boiler (Left) */}
            <g transform="translate(40, 140)">
              <rect
                x="0"
                y="0"
                width="70"
                height="90"
                rx="8"
                className="fill-amber-950/90 stroke-amber-500 stroke-2"
              />
              <text
                x="35"
                y="35"
                textAnchor="middle"
                className="text-xs font-mono font-bold fill-white"
              >
                Boiler
              </text>
              <text
                x="35"
                y="55"
                textAnchor="middle"
                className="text-[10px] font-mono fill-amber-400"
              >
                +115°C
              </text>
              {/* Flame burner underneath */}
              <g transform="translate(25, 95)">
                <circle cx="10" cy="8" r="8" className="fill-orange-500 animate-pulse" />
                <circle cx="10" cy="6" r="5" className="fill-yellow-400" />
              </g>
            </g>

            {/* Condenser (Top Center) */}
            <g transform="translate(160, 30)">
              <rect
                x="0"
                y="0"
                width="100"
                height="45"
                rx="6"
                className="fill-blue-950/80 stroke-blue-400 stroke-2"
              />
              <text
                x="50"
                y="24"
                textAnchor="middle"
                className="text-xs font-mono font-bold fill-white"
              >
                Condenser
              </text>
              <text
                x="50"
                y="38"
                textAnchor="middle"
                className="text-[9px] font-mono fill-blue-300"
              >
                Ammonia Liquefier
              </text>
            </g>

            {/* Evaporator / Freezing Chamber (Right) */}
            <g transform="translate(310, 80)">
              <rect
                x="0"
                y="0"
                width="80"
                height="100"
                rx="8"
                className="fill-cyan-950/90 stroke-cyan-400 stroke-2"
              />
              <text
                x="40"
                y="35"
                textAnchor="middle"
                className="text-xs font-mono font-bold fill-white"
              >
                Evaporator
              </text>
              <text
                x="40"
                y="60"
                textAnchor="middle"
                className="text-sm font-mono font-bold fill-cyan-300"
              >
                {evaporatorTempC}°C
              </text>
              <text
                x="40"
                y="80"
                textAnchor="middle"
                className="text-[9px] font-mono fill-cyan-400"
              >
                Butane Evap
              </text>
            </g>

            {/* Absorber (Bottom Center) */}
            <g transform="translate(170, 190)">
              <rect
                x="0"
                y="0"
                width="90"
                height="60"
                rx="6"
                className="fill-indigo-950/80 stroke-indigo-400 stroke-2"
              />
              <text
                x="45"
                y="28"
                textAnchor="middle"
                className="text-xs font-mono font-bold fill-white"
              >
                Absorber
              </text>
              <text
                x="45"
                y="46"
                textAnchor="middle"
                className="text-[9px] font-mono fill-indigo-300"
              >
                Water-Ammonia Mix
              </text>
            </g>

            {/* Piping Interconnects */}
            {/* Boiler Vapor Pipe to Condenser */}
            <path
              d="M 75 140 L 75 52 L 160 52"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeDasharray="4,2"
            />
            {/* Condenser Liquid Line to Evaporator */}
            <path d="M 260 52 L 350 52 L 350 80" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
            {/* Evaporator to Absorber */}
            <path
              d="M 350 180 L 350 220 L 260 220"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2.5"
            />
            {/* Absorber back to Boiler (Bubble Pump) */}
            <path d="M 170 220 L 110 220" fill="none" stroke="#818cf8" strokeWidth="2.5" />
          </svg>
        </div>

        {/* Telemetry and Controls */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white/90 dark:bg-ink-900/90 border border-parchment-300 dark:border-ink-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400">
                Thermodynamic State
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-parchment-100 dark:bg-ink-800/60 border border-parchment-200 dark:border-ink-700">
                <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
                  Evaporator Temp
                </span>
                <span
                  className={`text-sm font-bold ${
                    evaporatorTempC < 0
                      ? "text-cyan-600 dark:text-cyan-400"
                      : "text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {evaporatorTempC}°C
                </span>
                <span className="text-[10px] text-ink-500 block mt-0.5">
                  COP = {cop.toFixed(2)}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-parchment-100 dark:bg-ink-800/60 border border-parchment-200 dark:border-ink-700">
                <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
                  Cooling Output
                </span>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  {coolingPowerWatts} W
                </span>
                <span className="text-[10px] text-ink-500 block mt-0.5">
                  p(Butane) = {partialPressureButaneAtm} atm
                </span>
              </div>
            </div>
          </div>

          {/* Thermal Controls */}
          <div className="p-4 rounded-xl bg-white/90 dark:bg-ink-900/90 border border-parchment-300 dark:border-ink-800 shadow-sm space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400 block">
              Thermal Cycle Adjustment
            </span>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-ink-700 dark:text-ink-300">Burner Heat Input:</span>
                <span className="font-mono font-bold text-amber-600">{heatInputWatts} W</span>
              </div>
              <input
                type="range"
                aria-label="Burner Heat Input"
                min="100"
                max="350"
                step="5"
                value={heatInputWatts}
                onChange={(e) => updateParam("heatInput", Number(e.target.value))}
                className="w-full accent-amber-600"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-ink-700 dark:text-ink-300">Hermetic System Pressure:</span>
                <span className="font-mono font-bold text-amber-600">
                  {systemPressureAtm.toFixed(1)} atm
                </span>
              </div>
              <input
                type="range"
                aria-label="Hermetic System Pressure"
                min="8"
                max="22"
                step="0.5"
                value={systemPressureAtm}
                onChange={(e) => updateParam("totalPressure", Number(e.target.value))}
                className="w-full accent-amber-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
