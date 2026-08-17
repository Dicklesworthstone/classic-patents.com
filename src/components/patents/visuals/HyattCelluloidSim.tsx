"use client";

import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { usePatentAudio } from "./three/usePatentAudio";

export function HyattCelluloidSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-105338-hyatt-celluloid");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const moldTempC = params.steamTempC ?? 95;
  const hydraulicPressureMpa = params.hydraulicPressureMpa ?? 10;

  // Polymer thermodynamics
  const glassTransitionTempC = 65;
  const isMelted = moldTempC >= glassTransitionTempC && hydraulicPressureMpa >= 4.0;
  const viscosityPoise = Math.max(
    100,
    Math.round(50000 / (1 + Math.exp((moldTempC - glassTransitionTempC) * 0.1))),
  );
  const consolidationDensityGPerCm3 = Number((1.2 + (hydraulicPressureMpa / 20) * 0.18).toFixed(2));
  const transparencyPct = isMelted ? Math.min(95, Math.round(50 + (moldTempC - 65) * 1.2)) : 10;

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
            Hyatt Celluloid Thermoplastic Synthesis (US 105,338)
          </h3>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400">
            Interactive 2D Polymer Model — Camphor Plasticization, Heated Hydraulic Consolidation,
            and Viscoelastic Flow
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
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
          {/* Hydraulic Press Cylinder & Steam Jackets */}
          <rect
            x="180"
            y="60"
            width="240"
            height="220"
            rx="8"
            fill="#4A5568"
            opacity="0.3"
            stroke="#2D3748"
            strokeWidth="2"
          />

          {/* Steam Jacket Heating Channels */}
          <rect
            x="150"
            y="90"
            width="30"
            height="160"
            rx="4"
            fill="#E53E3E"
            opacity={moldTempC / 150}
          />
          <rect
            x="420"
            y="90"
            width="30"
            height="160"
            rx="4"
            fill="#E53E3E"
            opacity={moldTempC / 150}
          />
          <text
            x="110"
            y="175"
            fill="#E53E3E"
            fontSize="10"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            Steam {moldTempC}°C
          </text>

          {/* Hydraulic Ram Piston */}
          <g transform={`translate(200, ${70 + hydraulicPressureMpa * 2})`}>
            <rect
              x="0"
              y="0"
              width="200"
              height="30"
              rx="4"
              fill="#718096"
              stroke="#2D3748"
              strokeWidth="2"
            />
            <rect x="85" y="-50" width="30" height="50" fill="#4A5568" />
            <text
              x="50"
              y="20"
              fill="#FFFFFF"
              fontWeight="bold"
              fontSize="11"
              fontFamily="sans-serif"
            >
              Hydraulic Ram: {hydraulicPressureMpa} MPa
            </text>
          </g>

          {/* Celluloid Polymer Billet inside mold */}
          <rect
            x="200"
            y="130"
            width="200"
            height="120"
            rx="4"
            fill={isMelted ? "#FEFCBF" : "#E2E8F0"}
            opacity={0.3 + (transparencyPct / 100) * 0.6}
            stroke="#D69E2E"
            strokeWidth="2"
          />

          {/* Molecular Polymer Chains / Camphor particles */}
          <g id="polymer-chains">
            {Array.from({ length: 16 }).map((_, i) => {
              const xPos = 220 + (i % 4) * 45;
              const yPos = 150 + Math.floor(i / 4) * 25;
              return (
                <g key={`polymer-node-${xPos}-${yPos}`}>
                  <circle cx={xPos} cy={yPos} r={isMelted ? 8 : 5} fill="#D69E2E" opacity="0.8" />
                  <circle cx={xPos + 12} cy={yPos - 6} r="4" fill="#3182CE" opacity="0.7" />
                  {isMelted && (
                    <line
                      x1={xPos}
                      y1={yPos}
                      x2={xPos + 25}
                      y2={yPos + 10}
                      stroke="#D69E2E"
                      strokeWidth="2"
                      opacity="0.6"
                    />
                  )}
                </g>
              );
            })}
          </g>

          <text
            x="240"
            y="275"
            fill="#3D3D3D"
            fontSize="11"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            {isMelted ? "Homogenous Viscoelastic Melt" : "Dry Unfused Powder Mixture"}
          </text>
        </svg>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Mold Temperature
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {moldTempC}°C
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Melt Viscosity
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            {viscosityPoise} Poise
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Optical Clarity
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            {transparencyPct}%
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Density
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {consolidationDensityGPerCm3} g/cm³
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-parchment-200 dark:border-ink-800">
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Steam Jacket Temperature</span>
            <span className="font-mono">{moldTempC}°C</span>
          </div>
          <input
            type="range"
            min="70"
            max="160"
            step="5"
            value={moldTempC}
            onChange={(e) => updateParam("steamTempC", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Hydraulic Consolidation Pressure</span>
            <span className="font-mono">{hydraulicPressureMpa} MPa</span>
          </div>
          <input
            type="range"
            min="4"
            max="25"
            step="1"
            value={hydraulicPressureMpa}
            onChange={(e) => updateParam("hydraulicPressureMpa", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
