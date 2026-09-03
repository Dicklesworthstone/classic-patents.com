"use client";

import { FlaskConical, Volume2, VolumeX } from "lucide-react";
import { hyattPolymerSvg, stepHyattCelluloid } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { SimulationHeader } from "./SimulationHeader";
import { usePatentAudio } from "./three/usePatentAudio";

export function HyattCelluloidSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-105338-hyatt-celluloid");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const moldTempC = params.steamTempC ?? 95;
  const hydraulicPressureMpa = params.hydraulicPressureMpa ?? 10;

  const hyatt = stepHyattCelluloid({ steamTempC: moldTempC, hydraulicPressureMpa });
  const isMelted = hyatt.isMelted;
  const viscosityPaS = hyatt.viscosityPaS;
  const consolidationDensityGPerCm3 = hyatt.consolidationDensityGPerCm3;
  const transparencyPct = hyatt.transparencyPct;

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
      <SimulationHeader
        icon={<FlaskConical className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
        title="John Wesley Hyatt Celluloid Thermoplastic Synthesis (US 105,338)"
        description="Camphor plasticization, heated hydraulic consolidation, and viscoelastic flow."
        audioAction={{
          label: isAudioMuted ? "Unmute Audio" : "Mute Audio",
          icon: isAudioMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4 text-amber-600" />
          ),
          onPress: () => {
            toggleSound();
            soundEngine.playSwitchClick();
          },
        }}
        onReset={() => {
          resetParams();
          soundEngine.playSwitchClick();
        }}
      />

      {/* SVG Animation Stage */}
      <div className="relative w-full aspect-[16/9] max-h-[360px] bg-parchment-100 dark:bg-ink-900 rounded-xl overflow-hidden border border-parchment-200 dark:border-ink-800 flex items-center justify-center">
        <svg
          viewBox="0 0 600 340"
          role="img"
          aria-label={`Hyatt celluloid simulation: mold at ${moldTempC} degrees Celsius under ${hydraulicPressureMpa} MPa of hydraulic pressure, material ${isMelted ? "melted and flowing" : "consolidated"}`}
          className="w-full h-full"
        >
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
            opacity={Math.min(1, hyatt.steamGlowOpacity * (0.75 + hyatt.meltCrateDensity))}
          />
          <rect
            x="420"
            y="90"
            width="30"
            height="160"
            rx="4"
            fill="#E53E3E"
            opacity={Math.min(1, hyatt.steamGlowOpacity * (0.75 + hyatt.meltCrateDensity))}
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
          <g transform={`translate(200, ${hyatt.ramStudioY})`}>
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
            opacity={hyatt.billetOpacity}
            stroke="#D69E2E"
            strokeWidth="2"
          />

          {/* Molecular Polymer Chains / Camphor particles */}
          <g id="polymer-chains">
            {Array.from({ length: hyatt.polymerCount }).map((_, i) => {
              const { xPos, yPos } = hyattPolymerSvg(
                i,
                hyatt.polymerOriginX,
                hyatt.polymerOriginY,
                hyatt.polymerPitchX,
                hyatt.polymerPitchY,
                hyatt.polymerCols,
              );
              return (
                <g key={`polymer-node-${xPos}-${yPos}`}>
                  <circle
                    cx={xPos}
                    cy={yPos}
                    r={isMelted ? hyatt.polymerMeltR : hyatt.polymerSolidR}
                    fill="#D69E2E"
                    opacity="0.8"
                  />
                  <circle
                    cx={xPos + hyatt.camphorDx}
                    cy={yPos + hyatt.camphorDy}
                    r={hyatt.camphorR}
                    fill="#3182CE"
                    opacity="0.7"
                  />
                  {isMelted && (
                    <line
                      x1={xPos}
                      y1={yPos}
                      x2={xPos + hyatt.meltLinkDx}
                      y2={yPos + hyatt.meltLinkDy}
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
            {viscosityPaS} Pa·s
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
            aria-label="Steam jacket temperature in degrees Celsius"
            min="70"
            max="160"
            step="5"
            value={moldTempC}
            onChange={(e) => updateParam("steamTempC", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Hydraulic Consolidation Pressure</span>
            <span className="font-mono">{hydraulicPressureMpa} MPa</span>
          </div>
          <input
            type="range"
            aria-label="Hydraulic consolidation pressure in megapascals"
            min="4"
            max="25"
            step="1"
            value={hydraulicPressureMpa}
            onChange={(e) => updateParam("hydraulicPressureMpa", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </div>
      </div>
    </div>
  );
}
