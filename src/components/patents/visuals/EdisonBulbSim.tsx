"use client";

import { AlertCircle, Lightbulb } from "lucide-react";
import { useState } from "react";
import { MaterialCard } from "@/components/patents/MaterialCard";
import { blackbodyRgb } from "@/physics/blackbody";
import { stepEdisonBulb } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";

export function EdisonBulbSim() {
  const { params, updateParam } = usePatentPhysics("us-223898-edison-lightbulb");
  const voltage = params.voltage ?? 110;
  const [resistanceMode, setResistanceMode] = useState<"high-resistance" | "low-resistance">(
    "high-resistance",
  );
  const [isVacuumIntact, setIsVacuumIntact] = useState<boolean>(true);

  const bulb = stepEdisonBulb({ voltage, filamentLength: params.filamentLength ?? 22 });
  // High-R path is the Edison kernel. Low-R is the Swan/Maxim counterfactual for feeder I²R.
  const resistanceOhms =
    resistanceMode === "high-resistance" ? bulb.hotResistanceOhm : bulb.lowResistanceOhm;
  const currentAmps =
    resistanceMode === "high-resistance" ? bulb.currentAmps : bulb.lowResistanceAmps;
  const powerWatts =
    resistanceMode === "high-resistance" ? bulb.radiantWatts : bulb.lowResistanceWatts;

  const feederResistance = bulb.feederResistanceOhm;
  const feederPowerLossWatts =
    resistanceMode === "high-resistance" ? bulb.feederLossWatts : bulb.lowResistanceFeederLossWatts;

  const isBurnedOut = !isVacuumIntact && voltage > 30;
  const tempKelvin = isBurnedOut
    ? 300
    : resistanceMode === "high-resistance"
      ? bulb.filamentTempK
      : bulb.lowResistanceTempK;

  const getFilamentColor = () => {
    if (isBurnedOut) return "#475569";
    return blackbodyRgb(tempKelvin);
  };

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h3 className="font-serif text-xl font-bold text-ink-900 dark:text-parchment-100">
              Edison High-Resistance Incandescent Lamp Simulator (US 223,898)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-1">
            Discover why increasing filament resistance from <strong>1.5 Ω to 100 Ω</strong>{" "}
            unlocked parallel electrical power distribution.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsVacuumIntact(!isVacuumIntact);
            soundEngine.playSwitchClick();
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors border shadow-sm ${
            isVacuumIntact
              ? "bg-emerald-600 text-white border-emerald-700"
              : "bg-red-600 text-white border-red-700 animate-bounce"
          }`}
        >
          {isVacuumIntact ? "✓ Sprengel Vacuum (10⁻⁶ atm)" : "✗ Air Leak (Atmospheric O₂)"}
        </button>
      </div>

      {/* Visual Canvas and Comparative Circuit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 flex flex-col items-center justify-center rounded-2xl bg-ink-950 p-6 border border-parchment-200 dark:border-ink-800 relative min-h-[340px]">
          {/* Burn-out Alert */}
          {isBurnedOut && (
            <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-red-950/90 border border-red-700 text-red-300 text-xs font-mono rounded-lg flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              Filament Oxidized! In atmosphere, carbon burns to CO₂ in &lt;1 second.
            </div>
          )}

          {/* Incandescent Glass Bulb SVG */}
          <svg viewBox="0 0 300 260" className="w-full max-w-xs h-auto select-none relative z-10">
            <defs>
              <radialGradient id="edisonGlassGlow" cx="50%" cy="40%" r="50%">
                <stop
                  offset="0%"
                  stopColor={getFilamentColor()}
                  stopOpacity={
                    isBurnedOut
                      ? 0
                      : resistanceMode === "high-resistance"
                        ? bulb.glowStopInner
                        : bulb.lowResistanceGlowStopInner
                  }
                />
                <stop
                  offset="60%"
                  stopColor={getFilamentColor()}
                  stopOpacity={
                    isBurnedOut
                      ? 0
                      : resistanceMode === "high-resistance"
                        ? bulb.glowStopOuter
                        : bulb.lowResistanceGlowStopOuter
                  }
                />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Glowing Light Aura */}
            <circle cx="150" cy="110" r="110" fill="url(#edisonGlassGlow)" />

            {/* Pear-Shaped Hand-Blown Glass Bulb Enclosure */}
            <path
              d="M 110,180 C 80,140 85,70 150,70 C 215,70 220,140 190,180 Z"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2.5"
              opacity="0.85"
            />

            {/* Copper Screw Base & Platinum Lead Wires */}
            <rect
              x="130"
              y="180"
              width="40"
              height="30"
              rx="3"
              fill="#b45309"
              stroke="#f59e0b"
              strokeWidth="1.5"
            />
            <line x1="140" y1="180" x2="140" y2="135" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="160" y1="180" x2="160" y2="135" stroke="#cbd5e1" strokeWidth="2" />

            {/* Carbonized Cotton Sewing Thread Horseshoe Filament */}
            <path
              d="M 140,135 C 140,95 160,95 160,135"
              fill="none"
              stroke={getFilamentColor()}
              strokeWidth={resistanceMode === "high-resistance" ? "2" : "5"}
              strokeLinecap="round"
            />
          </svg>

          {/* Telemetry Footer */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono pt-3 border-t border-ink-800 text-ink-300">
            <div>
              <span className="text-ink-500 block text-[10px]">CURRENT DRAW</span>
              <span className="text-amber-400 font-bold">{currentAmps.toFixed(2)} A</span>
            </div>
            <div>
              <span className="text-ink-500 block text-[10px]">POWER CONSUMED</span>
              <span className="text-emerald-400 font-bold">{Math.round(powerWatts)} W</span>
            </div>
            <div>
              <span className="text-ink-500 block text-[10px]">FILAMENT TEMP</span>
              <span className="text-orange-400 font-bold">{tempKelvin} K</span>
            </div>
            <div>
              <span className="text-ink-500 block text-[10px]">DESIGN LIFE</span>
              <span className="text-purple-400 font-bold">
                {resistanceMode === "high-resistance" ? `${bulb.designLifeHours} h` : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/70 dark:bg-ink-900/60 p-5 space-y-4">
            <span className="font-serif font-bold text-sm text-ink-900 dark:text-parchment-100 block">
              Circuit &amp; Resistance Configuration
            </span>

            {/* Resistance Toggle */}
            <div className="space-y-1">
              <span className="text-xs font-mono block text-ink-700 dark:text-ink-300 font-semibold mb-1">
                Filament Electrical Resistance
              </span>
              <div className="grid grid-cols-1 gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setResistanceMode("high-resistance")}
                  className={`p-2.5 rounded-lg border text-left transition-colors ${
                    resistanceMode === "high-resistance"
                      ? "bg-amber-700 text-white border-amber-800 font-bold shadow-sm"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>Edison High Resistance (100 Ω)</span>
                    <span className="text-amber-200">✓ Feasible</span>
                  </div>
                  <div className="text-[10px] opacity-80 mt-0.5">
                    Draws only 1.1 A; allows thin copper cables across a whole city block.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setResistanceMode("low-resistance")}
                  className={`p-2.5 rounded-lg border text-left transition-colors ${
                    resistanceMode === "low-resistance"
                      ? "bg-red-700 text-white border-red-800 font-bold shadow-sm"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>Swan / Prior Art ({bulb.lowResistanceOhm} Ω)</span>
                    <span className="text-red-200">✗ Impractical</span>
                  </div>
                  <div className="text-[10px] opacity-80 mt-0.5">
                    Draws {currentAmps.toFixed(1)} A; {feederResistance} Ω copper feeder wires
                    overheat ({Math.round(feederPowerLossWatts)} W lost).
                  </div>
                </button>
              </div>
            </div>

            <MaterialCard
              name={resistanceMode === "high-resistance" ? "Carbonized bamboo" : "Platinum wire"}
              formula={resistanceMode === "high-resistance" ? "C (bamboo)" : "Pt"}
              role={
                resistanceMode === "high-resistance"
                  ? "High-resistance carbon thread: enough ohms that a 110 V feeder can light many lamps in parallel."
                  : "Low-resistance metal: needs huge current. Feeder I²R eats the station."
              }
              numbers={[
                { label: "Hot T", value: `${tempKelvin} K` },
                { label: "R", value: `${resistanceOhms.toFixed(1)} Ω` },
                { label: "P_rad", value: `${powerWatts.toFixed(1)} W` },
                {
                  label: "lm/W",
                  value:
                    resistanceMode === "high-resistance"
                      ? `${bulb.luminousLmPerW}`
                      : "counterfactual",
                },
              ]}
            />

            {/* Voltage Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Generator Terminal Voltage
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {voltage} Volts
                </span>
              </div>
              <input
                type="range"
                aria-label="Generator Terminal Voltage"
                min="40"
                max="130"
                step="1"
                value={voltage}
                onChange={(e) => updateParam("voltage", Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
