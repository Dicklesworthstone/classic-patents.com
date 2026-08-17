"use client";

import { Flame, Lightbulb } from "lucide-react";
import { useState } from "react";

export function EdisonBulbSim() {
  const [voltage, setVoltage] = useState<number>(110); // Volts (0-150)
  const [filamentType, setFilamentType] = useState<"edison-carbon" | "low-resistance-platinum">(
    "edison-carbon",
  );
  const [vacuumLevel, setVacuumLevel] = useState<"high-vacuum" | "atmospheric-air">("high-vacuum");

  // Electrical physics
  const resistance = filamentType === "edison-carbon" ? 100 : 1.5; // Ohms
  const current = voltage / resistance; // Amperes (I = V/R)
  const powerWatts = (voltage * voltage) / resistance; // Watts (P = V^2 / R)

  // Power loss in 1 Ohm distribution feeder lines (P_loss = I^2 * R_line)
  const lineResistance = 0.5; // Ohms
  const linePowerLoss = current * current * lineResistance;

  // Filament temperature estimation
  const tempKelvin = Math.round(300 + Math.min(2700, powerWatts ** 0.75 * 65));
  const isBurnedOut = vacuumLevel === "atmospheric-air" && voltage > 20;

  // Blackbody color
  let glowColor = "rgba(0,0,0,0.1)";
  let glowIntensity = 0;
  if (!isBurnedOut && voltage > 10) {
    if (tempKelvin < 1000)
      glowColor = "#b91c1c"; // dull red
    else if (tempKelvin < 1800)
      glowColor = "#f97316"; // orange
    else if (tempKelvin < 2400)
      glowColor = "#fbbf24"; // warm yellow
    else glowColor = "#fef08a"; // bright white-yellow
    glowIntensity = Math.min(1, powerWatts / 100);
  }

  return (
    <div className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-5 shadow-patent">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
              Edison High-Resistance Incandescent & Vacuum Simulator
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-0.5">
            Discover why high electrical resistance (100 Ω vs 1.5 Ω) solved the &quot;subdivision of
            the electric light.&quot;
          </p>
        </div>
      </div>

      <div className="my-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bulb Graphic */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center rounded-xl bg-gradient-to-b from-ink-900 to-ink-950 p-6 border border-parchment-200 dark:border-ink-800 relative min-h-[300px]">
          {isBurnedOut && (
            <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-red-950/90 border border-red-700 text-red-300 text-xs font-mono rounded flex items-center gap-1.5 animate-bounce">
              <Flame className="w-3.5 h-3.5 text-red-500" />
              COMBUSTION! Filament oxidized in air in 0.2 seconds!
            </div>
          )}

          <svg viewBox="0 0 300 260" className="w-full max-w-xs h-auto select-none">
            <defs>
              <radialGradient id="bulbGlassGlow" cx="50%" cy="40%" r="50%">
                <stop offset="0%" stopColor={glowColor} stopOpacity={glowIntensity * 0.8} />
                <stop offset="60%" stopColor={glowColor} stopOpacity={glowIntensity * 0.25} />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Glowing Aura */}
            <circle cx="150" cy="110" r="100" fill="url(#bulbGlassGlow)" />

            {/* Glass Bulb Envelope */}
            <path
              d="M 110,170 C 80,140 80,70 150,50 C 220,70 220,140 190,170 L 190,210 L 110,210 Z"
              fill="rgba(255, 255, 255, 0.05)"
              stroke="#94a3b8"
              strokeWidth="2"
            />
            {/* Sealed Top Exhaust Tip */}
            <line x1="150" y1="50" x2="150" y2="40" stroke="#94a3b8" strokeWidth="3" />

            {/* Brass Screw Base */}
            <rect
              x="120"
              y="210"
              width="60"
              height="24"
              fill="#b45309"
              stroke="#78350f"
              strokeWidth="1"
              rx="2"
            />
            <line x1="120" y1="218" x2="180" y2="218" stroke="#d97706" strokeWidth="1.5" />
            <line x1="120" y1="226" x2="180" y2="226" stroke="#d97706" strokeWidth="1.5" />

            {/* Internal Glass Stem & Platinum Lead-in Wires */}
            <path
              d="M 135,210 L 138,150 L 142,120"
              stroke="#cbd5e1"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M 165,210 L 162,150 L 158,120"
              stroke="#cbd5e1"
              strokeWidth="1.5"
              fill="none"
            />

            {/* The Filament Loop */}
            {isBurnedOut ? (
              <g stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3">
                <line x1="142" y1="120" x2="145" y2="90" />
                <line x1="158" y1="120" x2="155" y2="90" />
              </g>
            ) : (
              <path
                d="M 142,120 C 140,80 160,80 158,120"
                fill="none"
                stroke={glowColor}
                strokeWidth={filamentType === "edison-carbon" ? "2.5" : "4.5"}
                strokeLinecap="round"
                filter={voltage > 20 ? "drop-shadow(0 0 6px rgba(251, 191, 36, 0.8))" : "none"}
              />
            )}
          </svg>

          <div className="text-xs font-mono text-ink-300 mt-2">
            Temperature:{" "}
            <span className="text-amber-400 font-bold">
              {isBurnedOut ? "0 K (Snapped)" : `${tempKelvin} K`}
            </span>
          </div>
        </div>

        {/* Controls & Math */}
        <div className="lg:col-span-5 space-y-4">
          {/* Voltage Control */}
          <div className="bg-parchment-100/60 dark:bg-ink-900/60 p-4 rounded-xl border border-parchment-200 dark:border-ink-800 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Grid Voltage
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {voltage} Volts
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="140"
                value={voltage}
                onChange={(e) => setVoltage(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Filament Type */}
            <div>
              <span className="text-xs font-mono block text-ink-700 dark:text-ink-300 font-semibold mb-1">
                Filament Material
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setFilamentType("edison-carbon")}
                  className={`p-2 rounded border text-left transition-colors ${
                    filamentType === "edison-carbon"
                      ? "bg-amber-600 text-white border-amber-700 font-bold"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300"
                  }`}
                >
                  <div>Edison Carbon</div>
                  <div className="text-[10px] opacity-80">100 Ω (High-Res)</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFilamentType("low-resistance-platinum")}
                  className={`p-2 rounded border text-left transition-colors ${
                    filamentType === "low-resistance-platinum"
                      ? "bg-amber-600 text-white border-amber-700 font-bold"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300"
                  }`}
                >
                  <div>Prior Art Platinum</div>
                  <div className="text-[10px] opacity-80">1.5 Ω (Low-Res)</div>
                </button>
              </div>
            </div>

            {/* Vacuum State */}
            <div>
              <span className="text-xs font-mono block text-ink-700 dark:text-ink-300 font-semibold mb-1">
                Atmosphere Inside Bulb
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setVacuumLevel("high-vacuum")}
                  className={`p-1.5 rounded border text-center ${
                    vacuumLevel === "high-vacuum"
                      ? "bg-emerald-700 text-white border-emerald-800 font-bold"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300"
                  }`}
                >
                  Sprengel Vacuum
                </button>
                <button
                  type="button"
                  onClick={() => setVacuumLevel("atmospheric-air")}
                  className={`p-1.5 rounded border text-center ${
                    vacuumLevel === "atmospheric-air"
                      ? "bg-red-700 text-white border-red-800 font-bold"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300"
                  }`}
                >
                  Air (With Oxygen)
                </button>
              </div>
            </div>
          </div>

          {/* Grid Loss Telemetry */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-parchment-200/60 dark:bg-ink-900/80 p-3 rounded-lg border border-parchment-300 dark:border-ink-800">
            <div>
              <span className="text-ink-500 text-[10px] block">Current (I = V/R)</span>
              <span className="font-bold text-ink-900 dark:text-parchment-100">
                {current.toFixed(2)} Amperes
              </span>
            </div>
            <div>
              <span className="text-ink-500 text-[10px] block">Lamp Power</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {Math.round(powerWatts)} Watts
              </span>
            </div>
            <div className="col-span-2 border-t border-parchment-300 dark:border-ink-700 pt-1.5">
              <span className="text-ink-500 text-[10px] block">
                Feeder Wire Heat Loss (I² R_wire)
              </span>
              <span
                className={`font-bold ${linePowerLoss > 100 ? "text-red-600" : "text-emerald-600"}`}
              >
                {Math.round(linePowerLoss)} Watts{" "}
                {linePowerLoss > 100 ? "(Cables Overheating!)" : "(Feasible Transmission)"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
