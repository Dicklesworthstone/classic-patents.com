"use client";

import { RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useState } from "react";
import { stepNobelDynamite } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { usePatentAudio } from "./three/usePatentAudio";

export function NobelDynamiteSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-78317-nobel-dynamite");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const nitroglycerinRatioPct = params.ngConcentrationPct ?? 75;
  const capEnergyJoules = params.capEnergyJoules ?? 1.2;
  const [isDetonated, setIsDetonated] = useState<boolean>(false);

  const nobel = stepNobelDynamite({
    ngConcentrationPct: nitroglycerinRatioPct,
    capEnergyJoules,
  });
  const detonationVelocityMps = nobel.detonationVelocityMps;
  const peakPressureGpa = nobel.blastOverpressureGpa;
  const isCapStrongEnough = nobel.isInitiated;
  const isSensitiveUnsafe = nitroglycerinRatioPct > 82;
  const explosiveEnergyMjPerKg = nobel.energyMjPerKg;

  const handleDetonate = () => {
    if (isCapStrongEnough) {
      setIsDetonated(true);
      setTimeout(() => setIsDetonated(false), 800);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
            Nobel Dynamite & Fulminate Detonation (US 78,317)
          </h3>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400">
            Interactive 2D Energetic Physics — Porous Kieselguhr Matrix, Nitroglycerin Adsorption,
            and Shock-Wave Initiation
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleDetonate}
            aria-label="Fire Blasting Cap"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-sans text-xs font-bold shadow transition-colors"
          >
            <Zap className="w-4 h-4" />
            <span>Fire Cap</span>
          </button>
          <button
            type="button"
            onClick={resetParams}
            aria-label="Reset Simulation"
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => toggleSound()}
            aria-label={isAudioMuted ? "Unmute Audio" : "Mute Audio"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
          >
            {isAudioMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-600" />
            )}
          </button>
        </div>
      </div>

      {/* SVG Animation Stage */}
      <div className="relative w-full aspect-[16/9] max-h-[360px] bg-parchment-100 dark:bg-ink-900 rounded-xl overflow-hidden border border-parchment-200 dark:border-ink-800 flex items-center justify-center">
        <svg viewBox="0 0 600 340" className="w-full h-full">
          {/* Granite Rock Tunnel Borehole */}
          <rect x="0" y="0" width="600" height="340" fill="#4A5568" opacity="0.35" />
          <rect x="140" y="90" width="360" height="160" rx="8" fill="#1A202C" />
          <text x="160" y="80" fill="#CBD5E0" fontSize="12" fontFamily="sans-serif">
            Drilled Rock Blast Hole
          </text>

          {/* Waxed Paper Dynamite Stick */}
          <rect
            x="180"
            y="120"
            width="280"
            height="100"
            rx="6"
            fill="#C5A059"
            stroke="#8B5A2B"
            strokeWidth="3"
          />
          <text x="260" y="175" fill="#3D2817" fontWeight="bold" fontSize="18" fontFamily="serif">
            NOBEL DYNAMITE
          </text>

          {/* Microscopic Kieselguhr Silica Sponges & Nitroglycerin Drops */}
          <g opacity="0.45">
            {Array.from({ length: 24 }).map((_, i) => (
              <circle
                key={`kieselguhr-${i * 15}`}
                cx={200 + (i % 8) * 32}
                cy={135 + Math.floor(i / 8) * 32}
                r="6"
                fill="#EDF2F7"
                stroke="#A0AEC0"
              />
            ))}
          </g>

          {/* Copper Blasting Cap inserted into end */}
          <rect
            x="145"
            y="155"
            width="55"
            height="30"
            rx="3"
            fill="#B87333"
            stroke="#8B5A2B"
            strokeWidth="2"
          />
          <text
            x="110"
            y="150"
            fill="#B87333"
            fontSize="10"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            Fulminate Cap
          </text>

          {/* Safety Fuse Wire */}
          <path d="M 60 170 Q 100 160, 145 170" stroke="#2D3748" strokeWidth="4" fill="none" />
          {/* Fuse Spark */}
          <circle cx="60" cy="170" r="4" fill="#ED8936" />

          {/* Detonation Flash Overlay */}
          {isDetonated && (
            <g>
              <circle cx="300" cy="170" r="180" fill="#ECC94B" opacity="0.85" />
              <circle cx="300" cy="170" r="120" fill="#ED8936" opacity="0.9" />
              <circle cx="300" cy="170" r="60" fill="#FFFFFF" opacity="0.95" />
              <text
                x="210"
                y="175"
                fill="#1A202C"
                fontWeight="bold"
                fontSize="24"
                fontFamily="sans-serif"
              >
                DETONATION: {detonationVelocityMps} m/s
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Detonation Velocity
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {detonationVelocityMps} m/s
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            C-J Shock Pressure
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            {peakPressureGpa} GPa
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Specific Energy
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            {explosiveEnergyMjPerKg} MJ/kg
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Safety State
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {isSensitiveUnsafe ? "Liquid Exudation" : "Stable Solid"}
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-parchment-200 dark:border-ink-800">
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Nitroglycerin Mass Ratio</span>
            <span className="font-mono">
              {nitroglycerinRatioPct}% GTN / {100 - nitroglycerinRatioPct}% Earth
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="85"
            step="1"
            value={nitroglycerinRatioPct}
            onChange={(e) => updateParam("nitroglycerinRatioPct", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Blasting Cap Primer Energy</span>
            <span className="font-mono">{capEnergyJoules} Joules</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="2.5"
            step="0.1"
            value={capEnergyJoules}
            onChange={(e) => updateParam("capEnergyJoules", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
