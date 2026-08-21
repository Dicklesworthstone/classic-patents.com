"use client";

import { Pause, Play, RotateCcw, Volume2, VolumeX, Waves } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { stepPeltonWheelVisual } from "@/physics/peltonWheelKernel";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";

export function PeltonWheelSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-233692-pelton-water-wheel");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const waterHeadMeters = params.headMeters ?? 0;
  const wheelRpm = params.runnerRpm ?? 0;
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [wheelAngleDeg, setWheelAngleDeg] = useState<number>(0);
  const animRef = useRef<number | null>(null);

  const visualState = stepPeltonWheelVisual({ runnerRpm: wheelRpm, jetEnabled: waterHeadMeters > 0 });
  const runnerOmegaDegPerS = (visualState.runnerOmegaRadPerS * 180) / Math.PI;

  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;

      setWheelAngleDeg((prev) => (prev + runnerOmegaDegPerS * dt) % 360);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, runnerOmegaDegPerS]);

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Waves className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
              Lester Pelton Split-Bucket Impulse Water Wheel (US 233,692)
            </h3>
          </div>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400 mt-0.5">
            Source-bounded view of the wheel, nozzle, split apex, curved bottoms, and side discharge.
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setIsPlaying(!isPlaying);
              soundEngine.playSwitchClick();
            }}
            aria-label={isPlaying ? "Pause Simulation" : "Play Simulation"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4 text-cyan-600" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            aria-label={isAudioMuted ? "Unmute Audio" : "Mute Audio"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
          >
            {isAudioMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4 text-cyan-600" />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              resetParams();
              setWheelAngleDeg(0);
              soundEngine.playSwitchClick();
            }}
            aria-label="Reset Simulation"
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Animation Stage */}
      <div className="relative w-full aspect-[16/9] max-h-[360px] bg-parchment-100 dark:bg-ink-900 rounded-xl overflow-hidden border border-parchment-200 dark:border-ink-800 flex items-center justify-center">
        <svg viewBox="0 0 600 340" className="w-full h-full">
          {/* Source nozzle arrangement (left) */}
          <g transform="translate(60, 260)">
            <polygon
              points="0,-15 100,-8 100,8 0,15"
              fill="#4A5568"
              stroke="#2D3748"
              strokeWidth="2"
            />
            <polygon
              points="100,-8 130,-4 130,4 100,8"
              fill="#D4AF37"
              stroke="#8B5A2B"
              strokeWidth="1.5"
            />
            <text
              x="-40"
              y="5"
              fill="#4A5568"
              fontSize="10"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Penstock Nozzle
            </text>
          </g>

          {/* Source-described water stream */}
          <line
            x1="190"
            y1="260"
            x2="360"
            y2="260"
            stroke="#3182CE"
            strokeWidth={waterHeadMeters > 0 ? 7 : 3}
            strokeLinecap="round"
            opacity={waterHeadMeters > 0 ? 0.9 : 0.3}
          />

          {/* Pelton Turbine Runner Disk (Center) */}
          <g transform={`translate(360, 150) rotate(${wheelAngleDeg})`}>
            {/* Center Hub */}
            <circle
              cx="0"
              cy="0"
              r={75}
              fill="#2D3748"
              stroke="#1A202C"
              strokeWidth="4"
            />
            <circle cx="0" cy="0" r={18} fill="#1A1A1A" />

            {/* One enlarged source-faithful bucket; the grant gives no bucket count. */}
            <g transform="rotate(0) translate(0, -110)">
                  {/* Double-cup bucket profile */}
                <path
                    d="M -14 0 Q -18 22, -8 30 Q 0 15, 0 5 Q 0 15, 8 30 Q 18 22, 14 0 Z"
                    fill="#D4AF37"
                    stroke="#744210"
                    strokeWidth="1.5"
                />
                  {/* Knife edge splitter line */}
                <line x1="0" y1="5" x2="0" y2="28" stroke="#FFFFFF" strokeWidth="1.5" />
            </g>
          </g>

          {/* Two source-described discharge paths leaving at the wheel sides. */}
          <path
            d="M 360 260 Q 320 280, 270 310"
            stroke="#63B3ED"
            strokeWidth="4"
            fill="none"
            opacity={waterHeadMeters > 0 ? 0.8 : 0.25}
          />
          <path
            d="M 360 260 Q 400 280, 450 310"
            stroke="#63B3ED"
            strokeWidth="4"
            fill="none"
            opacity={waterHeadMeters > 0 ? 0.8 : 0.25}
          />
          <text
            x="320"
            y="325"
            fill="#3182CE"
            fontSize="10"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            Divided stream → curved bottoms → side discharge
          </text>
        </svg>
      </div>

      <div className="my-4 rounded-xl border border-parchment-200 dark:border-ink-800 bg-parchment-100 dark:bg-ink-900 p-3 text-sm text-ink-700 dark:text-parchment-300">
        The grant supplies no operating head, speed, bucket count, efficiency, or dimensions. Controls are visitor-set parameters; the drawing and source text establish the bucket geometry and nozzle arrangement only.
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-parchment-200 dark:border-ink-800">
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Visitor-set head parameter</span>
            <span className="font-mono">{waterHeadMeters}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={waterHeadMeters}
            onChange={(e) => updateParam("headMeters", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Visitor-set runner speed</span>
            <span className="font-mono">{wheelRpm}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={wheelRpm}
            onChange={(e) => updateParam("runnerRpm", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
