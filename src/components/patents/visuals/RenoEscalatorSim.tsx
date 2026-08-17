"use client";

import { Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function RenoEscalatorSim() {
  const [beltSpeedFpm, setBeltSpeedFpm] = useState<number>(75);
  const [passengerLoad, setPassengerLoad] = useState<number>(24);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [treadOffset, setTreadOffset] = useState<number>(0);
  const animRef = useRef<number | null>(null);

  // Escalator kinematics
  const inclineAngleDeg = 25; // Reno 25-degree incline
  const beltSpeedMps = Number(((beltSpeedFpm * 0.3048) / 60).toFixed(2));
  const passengersPerHour = Math.round((beltSpeedFpm / 75) * 3000);
  const driveMotorPowerKw = Number(
    (
      2.2 +
      (passengerLoad * 75 * 9.80665 * Math.sin((inclineAngleDeg * Math.PI) / 180) * beltSpeedMps) /
        1000
    ).toFixed(1),
  );

  useEffect(() => {
    if (!isPlaying) return;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      setTreadOffset((prev) => (prev + beltSpeedMps * 40 * dt) % 40);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, beltSpeedMps]);

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
            Reno Endless Inclined Elevator & Comb Landing (US 470,918)
          </h3>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400">
            Interactive 2D Escalator Kinematics — 25° Slotted Hardwood Cleats, Intermeshing
            Stationary Comb Plate, and Moving Handrail
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
            onClick={() => {
              setBeltSpeedFpm(75);
              setPassengerLoad(24);
              setTreadOffset(0);
            }}
            aria-label="Reset Simulation"
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
          >
            {isMuted ? (
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
          {/* Structural Truss Frame */}
          <polygon
            points="40,280 180,280 480,100 560,100 560,140 460,140 160,320 40,320"
            fill="#2D3748"
            opacity="0.3"
            stroke="#1A202C"
            strokeWidth="2"
          />

          {/* Lower Landing Comb Plate (Left) */}
          <g transform="translate(60, 275)">
            <polygon
              points="0,0 40,0 35,15 0,15"
              fill="#D4AF37"
              stroke="#744210"
              strokeWidth="1.5"
            />
            <text
              x="-40"
              y="28"
              fill="#744210"
              fontSize="9"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Lower Comb
            </text>
          </g>

          {/* Upper Landing Comb Plate (Right) */}
          <g transform="translate(480, 95)">
            <polygon
              points="0,0 40,0 40,15 5,15"
              fill="#D4AF37"
              stroke="#744210"
              strokeWidth="1.5"
            />
            <text
              x="45"
              y="10"
              fill="#744210"
              fontSize="9"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Comb Landing
            </text>
          </g>

          {/* Moving 25-degree Incline Endless Cleated Belt */}
          <g id="moving-cleats">
            {Array.from({ length: 14 }).map((_, i) => {
              const basePos = (i * 35 + treadOffset) % 490;
              const xPos = 80 + basePos * 0.85;
              const yPos = 275 - basePos * 0.38;
              return (
                <g key={`cleat-${i * 35}`} transform={`translate(${xPos}, ${yPos}) rotate(-25)`}>
                  {/* Longitudinal wooden ridge cleats */}
                  <rect
                    x="0"
                    y="0"
                    width="30"
                    height="8"
                    rx="1.5"
                    fill="#8B5A2B"
                    stroke="#5C4033"
                    strokeWidth="1"
                  />
                  <line x1="0" y1="4" x2="30" y2="4" stroke="#D4AF37" strokeWidth="1.5" />
                </g>
              );
            })}
          </g>

          {/* Synchronized Moving Rubber Handrail */}
          <path
            d="M 70 230 L 170 230 L 470 55 L 540 55"
            stroke="#1A202C"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          <text
            x="260"
            y="120"
            fill="#718096"
            fontSize="11"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            25° Inclined Moving Handrail
          </text>
        </svg>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Belt Linear Speed
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {beltSpeedMps} m/s ({beltSpeedFpm} FPM)
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Capacity
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            {passengersPerHour.toLocaleString()} riders/hr
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Motor Power
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            {driveMotorPowerKw} kW
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Incline Geometry
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {inclineAngleDeg}° Incline
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-parchment-200 dark:border-ink-800">
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Escalator Linear Speed</span>
            <span className="font-mono">{beltSpeedFpm} Feet/Min</span>
          </div>
          <input
            type="range"
            min="40"
            max="120"
            step="5"
            value={beltSpeedFpm}
            onChange={(e) => setBeltSpeedFpm(Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Passenger Live Load</span>
            <span className="font-mono">{passengerLoad} Passengers</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="2"
            value={passengerLoad}
            onChange={(e) => setPassengerLoad(Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
