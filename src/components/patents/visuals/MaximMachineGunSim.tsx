"use client";

import { Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { wrapCycleRad } from "@/physics/catalogKernels";
import { FrankenSimEngine } from "@/physics/engine";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { usePatentAudio } from "./three/usePatentAudio";

export function MaximMachineGunSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-319596-maxim-machine-gun");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const cyclicRateRpm = params.firingRate ?? 600;
  const jacketWaterLiters = params.waterLevel ?? 4.0;
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [recoilPhase, setRecoilPhase] = useState<number>(0);
  const animRef = useRef<number | null>(null);

  const maxim = FrankenSimEngine.stepMaximMachineGun({
    firingRateRpm: cyclicRateRpm,
    waterJacketLiters: jacketWaterLiters,
    recoilStrokeMm: params.recoilStroke ?? 19,
  });
  const barrelTempC = maxim.barrelTempC;
  const muzzleEnergyJoules = maxim.muzzleEnergyJoules;
  const cycleTimeMs = maxim.cycleIntervalMs;

  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;

      setRecoilPhase((prev) =>
        wrapCycleRad(prev + maxim.fireOmegaRadPerS * dt, maxim.fireCycleWrapRad),
      );
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, maxim.fireOmegaRadPerS, maxim.fireCycleWrapRad]);

  // Recoil displacement of barrel & breech
  const recoilX = (Math.cos(recoilPhase) + 1) * maxim.recoilSvgAmp;
  const isMuzzleFiring = recoilPhase < maxim.firingWindowRad;

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
            Maxim Automatic Recoil Machine Gun (US 319,596)
          </h3>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400">
            Interactive 2D Weapon Mechanics — Short-Recoil Barrel Unlocking, Toggle-Joint Lock,
            Canvas Belt Feed, and Water Cooling Jacket
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
          {/* Rectangular Steel Breech Casing */}
          <rect
            x="60"
            y="110"
            width="220"
            height="90"
            rx="4"
            fill="#2D3748"
            stroke="#1A202C"
            strokeWidth="2"
          />

          {/* Brass/Bronze Water Jacket Cylinder surrounding barrel */}
          <rect
            x="280"
            y="125"
            width="220"
            height="60"
            rx="10"
            fill="#B87333"
            stroke="#8B5A2B"
            strokeWidth="2"
            opacity="0.85"
          />
          <text
            x="330"
            y="160"
            fill="#FFFFFF"
            fontWeight="bold"
            fontSize="11"
            fontFamily="sans-serif"
          >
            Water Jacket ({jacketWaterLiters} L)
          </text>

          {/* Recoiling Barrel Tube & Muzzle Booster */}
          <g transform={`translate(${-recoilX}, 0)`}>
            <rect
              x="180"
              y="150"
              width="340"
              height="12"
              fill="#718096"
              stroke="#1A202C"
              strokeWidth="1"
            />
            {/* Muzzle Booster Cap */}
            <rect x="520" y="146" width="25" height="20" rx="3" fill="#2D3748" />
          </g>

          {/* Muzzle Flash if firing */}
          {isMuzzleFiring && (
            <polygon
              points="545,156 590,140 570,156 600,158 570,162 590,175"
              fill="#ECC94B"
              stroke="#DD6B20"
              strokeWidth="1.5"
            />
          )}

          {/* Internal Toggle Joint Lock Linkage */}
          <g transform={`translate(${140 - recoilX}, 155)`}>
            {/* Toggle Joint Links */}
            <line
              x1="0"
              y1="0"
              x2="35"
              y2={recoilX > 6 ? -22 : 0}
              stroke="#D4AF37"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <line
              x1="35"
              y1={recoilX > 6 ? -22 : 0}
              x2="70"
              y2="0"
              stroke="#D4AF37"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle cx="35" cy={recoilX > 6 ? -22 : 0} r="4.5" fill="#1A202C" />
          </g>

          {/* Woven Fabric Ammo Belt Feeding from Side */}
          <g transform="translate(190, 80)">
            <rect
              x="0"
              y="0"
              width="18"
              height="60"
              fill="#C2B280"
              stroke="#8B5A2B"
              strokeWidth="1"
            />
            <circle cx="9" cy="15" r="4" fill="#D4AF37" />
            <circle cx="9" cy="35" r="4" fill="#D4AF37" />
            <circle cx="9" cy="55" r="4" fill="#D4AF37" />
            <text
              x="-45"
              y="25"
              fill="#8B5A2B"
              fontSize="9"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Fabric Belt
            </text>
          </g>
        </svg>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Cyclic Fire Rate
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {cyclicRateRpm} rounds/min
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
            Barrel Temperature
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            {barrelTempC}°C
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
            <span>Recoil Spring Tension (Fire Rate)</span>
            <span className="font-mono">{cyclicRateRpm} RPM</span>
          </div>
          <input
            type="range"
            min="300"
            max="750"
            step="25"
            value={cyclicRateRpm}
            onChange={(e) => updateParam("firingRate", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Water Cooling Jacket Reserve</span>
            <span className="font-mono">{jacketWaterLiters} Liters</span>
          </div>
          <input
            type="range"
            min="0"
            max="4.0"
            step="0.2"
            value={jacketWaterLiters}
            onChange={(e) => updateParam("waterLevel", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
