"use client";

import { Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gatlingBoltSvgX, gatlingMuzzleFlash, stepGatlingGun } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { usePatentAudio } from "./three/usePatentAudio";

export function GatlingGunSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-36836-gatling-gun");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const crankRpm = params.crankRpm ?? 60;
  const barrelCount = params.barrelCount ?? 6;
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [clusterAngleDeg, setClusterAngleDeg] = useState<number>(0);
  const animRef = useRef<number | null>(null);

  const gatling = stepGatlingGun({ crankRpm, barrelCount });
  const cadenceRpm = gatling.roundsPerMin;
  const cycleTimeMs = gatling.cycleTimeMs;
  const barrelCoolingTimeSec = gatling.barrelCoolingIntervalS;
  const muzzleEnergyJoules = gatling.muzzleEnergyJoules;

  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;

      setClusterAngleDeg(
        (prev) => (prev + gatling.crankOmegaDegPerS * dt) % gatling.displayWrapDeg,
      );
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, gatling.crankOmegaDegPerS, gatling.displayWrapDeg]);

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
            Gatling Rotary Battery-Gun (US 36,836)
          </h3>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400">
            Interactive 2D Kinematic Model — Rotating Barrel Cluster, Helical Cam Track, and
            Continuous Pipelined Cycling
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
          {/* Outer Gun Housing & Carriage Frame */}
          <path
            d="M 120 120 L 260 120 L 260 220 L 120 220 Z"
            fill="#8B5A2B"
            opacity="0.3"
            stroke="#5C4033"
            strokeWidth="2"
          />
          <text x="145" y="240" fill="#888" fontSize="11" fontFamily="sans-serif">
            Helical Cam Casing
          </text>

          {/* Overhead Gravity Feed Hopper */}
          <polygon
            points="170,40 210,40 195,120 185,120"
            fill="#B87333"
            stroke="#8B5A2B"
            strokeWidth="2"
          />
          <circle cx="190" cy="60" r="4.5" fill="#D4AF37" />
          <circle cx="190" cy="78" r="4.5" fill="#D4AF37" />
          <circle cx="190" cy="96" r="4.5" fill="#D4AF37" />
          <text
            x="140"
            y="35"
            fill="#B87333"
            fontSize="10"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            Gravity Hopper
          </text>

          {/* Central Mainshaft & Rotating Barrel Cluster */}
          <g transform={`translate(${gatling.clusterCx}, ${gatling.clusterCy})`}>
            {/* 6 Barrels in Longitudinal Profile */}
            {Array.from({ length: barrelCount }).map((_, i) => {
              const bAngle =
                (i * gatling.barrelSpacingDeg + clusterAngleDeg) % gatling.displayWrapDeg;
              const yPos = Math.sin((bAngle * Math.PI) / 180) * gatling.clusterRadiusPx;
              const isFiring = Math.abs(bAngle - gatling.firingBottomDeg) < gatling.firingWindowDeg;
              return (
                <g key={`barrel-${bAngle}`}>
                  {/* Gun Barrel Tube */}
                  <rect
                    x="0"
                    y={yPos - gatling.barrelSvgHalfH}
                    width={gatling.barrelSvgW}
                    height={gatling.barrelSvgH}
                    fill={isFiring ? "#E53E3E" : "#4A5568"}
                    stroke="#1A202C"
                    strokeWidth="1"
                  />
                  {/* Muzzle Flash if at firing bottom */}
                  {isFiring && (
                    <polygon
                      points={gatlingMuzzleFlash(
                        yPos,
                        gatling.muzzleFlashX0,
                        gatling.muzzleFlashTipX,
                        gatling.muzzleFlashFlare,
                      )}
                      fill="#ECC94B"
                      stroke="#DD6B20"
                      strokeWidth="1"
                    />
                  )}
                </g>
              );
            })}
            {/* Front & Rear Bronze Cluster Plates */}
            <line
              x1="0"
              y1={-gatling.clusterPlateSpan}
              x2="0"
              y2={gatling.clusterPlateSpan}
              stroke="#D4AF37"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <line
              x1="240"
              y1={-gatling.clusterPlateSpan}
              x2="240"
              y2={gatling.clusterPlateSpan}
              stroke="#D4AF37"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </g>

          {/* Internal Helical Cam Reciprocating Bolts */}
          <g transform={`translate(${gatling.boltOriginX}, ${gatling.boltOriginY})`}>
            {Array.from({ length: barrelCount }).map((_, i) => {
              const bAngle =
                (i * gatling.barrelSpacingDeg + clusterAngleDeg) % gatling.displayWrapDeg;
              const yPos = Math.sin((bAngle * Math.PI) / 180) * gatling.clusterRadiusPx;
              const xPos = gatlingBoltSvgX(bAngle, gatling.boltStrokePx);
              return (
                <g key={`bolt-${bAngle}`}>
                  <rect
                    x={xPos}
                    y={yPos - gatling.boltSvgHalfH}
                    width={gatling.boltSvgW}
                    height={gatling.boltSvgH}
                    rx="1.5"
                    fill="#E2E8F0"
                    stroke="#4A5568"
                    strokeWidth="1"
                  />
                </g>
              );
            })}
          </g>

          {/* Spent Shell Falling Out Bottom */}
          <g transform="translate(180, 250)">
            <rect
              x="0"
              y="0"
              width="12"
              height="6"
              rx="1"
              fill="#D4AF37"
              stroke="#8B5A2B"
              strokeWidth="1"
            />
            <rect
              x="6"
              y="20"
              width="12"
              height="6"
              rx="1"
              fill="#D4AF37"
              stroke="#8B5A2B"
              strokeWidth="1"
              transform="rotate(25)"
            />
            <text x="-40" y="45" fill="#888" fontSize="10" fontFamily="sans-serif">
              Spent Case Ejection
            </text>
          </g>

          {/* Rear Hand Crank */}
          <g transform="translate(60, 170)">
            <circle cx="0" cy="0" r="8" fill="#333" />
            <line
              x1="0"
              y1="0"
              x2={Math.cos((clusterAngleDeg * Math.PI) / 180) * gatling.crankPinRadiusPx}
              y2={Math.sin((clusterAngleDeg * Math.PI) / 180) * gatling.crankPinRadiusPx}
              stroke="#2D3748"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle
              cx={Math.cos((clusterAngleDeg * Math.PI) / 180) * gatling.crankPinRadiusPx}
              cy={Math.sin((clusterAngleDeg * Math.PI) / 180) * gatling.crankPinRadiusPx}
              r="6"
              fill="#8B5A2B"
            />
          </g>
        </svg>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Cadence
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {cadenceRpm} rounds/min
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Cycle Interval
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            {cycleTimeMs} ms
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Barrel Cool Time
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            {barrelCoolingTimeSec} s/shot
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Muzzle Energy
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {muzzleEnergyJoules} J
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-parchment-200 dark:border-ink-800">
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Hand Crank Speed</span>
            <span className="font-mono">{crankRpm} RPM</span>
          </div>
          <input
            type="range"
            min="20"
            max="120"
            step="5"
            value={crankRpm}
            onChange={(e) => updateParam("crankRpm", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Barrels in Cluster</span>
            <span className="font-mono">{barrelCount} Barrels</span>
          </div>
          <input
            type="range"
            min="4"
            max="10"
            step="2"
            value={barrelCount}
            onChange={(e) => updateParam("barrelCount", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
