"use client";

import { Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { stepZeppelinAirship } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { usePatentAudio } from "./three/usePatentAudio";

export function ZeppelinAirshipSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-621195-zeppelin-airship");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const flightSpeedKnots = params.flightSpeedKnots ?? 28;
  const gasCellPurityPct = params.gasInflation ?? 95;
  const trimWeight = params.trimWeight ?? 5;
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [pitchDeg, setPitchDeg] = useState<number>(0);

  const zep = stepZeppelinAirship({
    gasInflation: gasCellPurityPct,
    flightAlt: params.flightAlt ?? 300,
    flightSpeedKnots,
    trimWeight,
  });
  const grossLiftKg = zep.grossLiftKg;
  const usefulPayloadKg = zep.usefulPayloadKg;
  const pitchTrimDeg = zep.pitchTrimDeg;

  useEffect(() => {
    setPitchDeg(pitchTrimDeg);
  }, [pitchTrimDeg]);

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
            Zeppelin Rigid Airship & Structural Lattice (US 621,195)
          </h3>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400">
            Interactive 2D Aerostatic Model — Rigid Aluminum Polygonal Ring Framework, 17
            Partitioned Gas Cells, and Sliding Trim Weight
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause Simulation" : "Play Simulation"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
          >
            <Play className={`w-4 h-4 ${isPlaying ? "text-amber-600" : ""}`} />
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
          {/* Cloud layers in sky */}
          <g opacity="0.3" fill="#E2E8F0">
            <ellipse cx="100" cy="80" rx="60" ry="20" />
            <ellipse cx="500" cy="110" rx="80" ry="25" />
          </g>

          {/* Zeppelin Airship Body Rotated by Pitch Trim */}
          <g transform={`translate(300, 160) rotate(${pitchDeg})`}>
            {/* Outer Doped Fabric Envelope Profile */}
            <path
              d="M -240 0 C -220 -45, -120 -55, 0 -55 C 120 -55, 200 -45, 240 0 C 200 45, 120 55, 0 55 C -120 55, -220 45, -240 0 Z"
              fill="#CBD5E0"
              stroke="#4A5568"
              strokeWidth="2.5"
              opacity="0.85"
            />

            {/* Internal 17 Separate Gas Cell Partitions */}
            {Array.from({ length: 17 }).map((_, i) => {
              const xPos = -215 + i * 27;
              return (
                <line
                  key={`gas-cell-ring-${xPos}`}
                  x1={xPos}
                  y1="-48"
                  x2={xPos}
                  y2="48"
                  stroke="#718096"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
              );
            })}

            {/* Aluminum Longitudinal Lattice Girders */}
            <line x1="-230" y1="-25" x2="230" y2="-25" stroke="#A0AEC0" strokeWidth="1" />
            <line x1="-235" y1="0" x2="235" y2="0" stroke="#A0AEC0" strokeWidth="1.5" />
            <line x1="-230" y1="25" x2="230" y2="25" stroke="#A0AEC0" strokeWidth="1" />

            {/* Fore Gondola (Car) with Daimler Engine & Aluminum Propeller */}
            <g transform="translate(-110, 65)">
              <rect
                x="-25"
                y="0"
                width="50"
                height="18"
                rx="4"
                fill="#2D3748"
                stroke="#1A202C"
                strokeWidth="1.5"
              />
              <line x1="-20" y1="0" x2="-20" y2="-10" stroke="#718096" strokeWidth="1.5" />
              <line x1="20" y1="0" x2="20" y2="-10" stroke="#718096" strokeWidth="1.5" />
              {/* Propeller */}
              <line x1="25" y1="-10" x2="25" y2="28" stroke="#D4AF37" strokeWidth="2.5" />
            </g>

            {/* Aft Gondola (Car) with Daimler Engine & Aluminum Propeller */}
            <g transform="translate(110, 65)">
              <rect
                x="-25"
                y="0"
                width="50"
                height="18"
                rx="4"
                fill="#2D3748"
                stroke="#1A202C"
                strokeWidth="1.5"
              />
              <line x1="-20" y1="0" x2="-20" y2="-10" stroke="#718096" strokeWidth="1.5" />
              <line x1="20" y1="0" x2="20" y2="-10" stroke="#718096" strokeWidth="1.5" />
              {/* Propeller */}
              <line x1="25" y1="-10" x2="25" y2="28" stroke="#D4AF37" strokeWidth="2.5" />
            </g>

            {/* Triangular Aluminum Keel Beam & Sliding Trim Weight */}
            <line x1="-180" y1="58" x2="180" y2="58" stroke="#4A5568" strokeWidth="3" />
            {/* Sliding Trim Weight (Translates on Keel) */}
            <rect
              x={(trimWeight / 15) * 140 - 10}
              y="52"
              width="20"
              height="12"
              rx="2"
              fill="#E53E3E"
              stroke="#9B2C2C"
              strokeWidth="1.5"
            />
            <text
              x="-45"
              y="78"
              fill="#E53E3E"
              fontSize="9"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Keel trim ({trimWeight} · {pitchTrimDeg}°)
            </text>

            {/* Stern Control Fins & Rudders */}
            <g transform="translate(225, 0)">
              <polygon
                points="0,-15 25,-40 25,-15"
                fill="#A0AEC0"
                stroke="#4A5568"
                strokeWidth="1.5"
              />
              <polygon
                points="0,15 25,40 25,15"
                fill="#A0AEC0"
                stroke="#4A5568"
                strokeWidth="1.5"
              />
            </g>
          </g>
        </svg>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Gross Aerostatic Lift
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {(grossLiftKg / 1000).toFixed(1)} metric tons
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Useful Payload
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            {usefulPayloadKg.toLocaleString()} kg
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Airspeed
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            {flightSpeedKnots} knots ({zep.flightSpeedKmh} km/h)
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Pitch Angle
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {pitchDeg}°
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-parchment-200 dark:border-ink-800">
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Sliding Trim Weight Position (Keel)</span>
            <span className="font-mono">
              {trimWeight} ({pitchTrimDeg}°{" "}
              {trimWeight < 0 ? "bow" : trimWeight > 0 ? "stern" : "level"})
            </span>
          </div>
          <input
            type="range"
            min="-15"
            max="15"
            step="1"
            value={trimWeight}
            onChange={(e) => updateParam("trimWeight", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Gas Cell Hydrogen Purity / Inflation</span>
            <span className="font-mono">{gasCellPurityPct}%</span>
          </div>
          <input
            type="range"
            min="75"
            max="100"
            step="1"
            value={gasCellPurityPct}
            onChange={(e) => updateParam("gasInflation", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
