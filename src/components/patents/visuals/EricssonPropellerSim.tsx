"use client";

import { Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepEricssonPropeller } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { usePatentAudio } from "./three/usePatentAudio";

export function EricssonPropellerSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-588-ericsson-propeller");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const shaftRpm = params.shaftRpm ?? 120;
  const bladePitchAngleDeg = params.bladePitchAngleDeg ?? 35;
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [angleDeg, setAngleDeg] = useState<number>(0);
  const animRef = useRef<number | null>(null);

  const screw = stepEricssonPropeller({ shaftRpm, bladePitchAngleDeg });

  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;

      setAngleDeg((prev) => (prev + screw.shaftOmegaDegPerS * dt) % 360);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, screw.shaftOmegaDegPerS]);

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
            Ericsson Spiral-Plate Reader Aid (US 588)
          </h3>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400">
            Illustrative motion for the source's concentric shafts and opposed spiral plates. The
            grant does not print a shaft rate, vessel speed, thrust, or efficiency.
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
          {/* Submerged Waterline & Hull Stern */}
          <rect x="0" y="80" width="600" height="260" fill="#1A365D" opacity="0.12" />
          <path
            d="M 0 80 Q 300 75, 600 80"
            stroke="#3182CE"
            strokeWidth="2"
            fill="none"
            opacity="0.5"
          />
          <text x="20" y="70" fill="#3182CE" fontSize="10" fontFamily="sans-serif">
            Waterline
          </text>

          {/* Wooden Ship Stern Post and Rudder */}
          <path
            d="M 40 40 L 220 40 L 220 280 L 160 280 L 100 240 L 40 180 Z"
            fill="#5C4033"
            opacity="0.4"
            stroke="#3D2817"
            strokeWidth="2"
          />
          <path
            d="M 460 140 L 460 290 L 510 290 L 510 160 Z"
            fill="#8B5A2B"
            opacity="0.3"
            stroke="#5C4033"
            strokeWidth="2"
          />
          <text x="470" y="220" fill="#888" fontSize="11" fontFamily="sans-serif">
            Rudder
          </text>

          {/* Concentric Drive Shafts passing through Deadwood */}
          <rect
            x="180"
            y="193"
            width="130"
            height="14"
            fill="#4A4A4A"
            stroke="#222"
            strokeWidth="1"
          />
          <rect
            x="270"
            y="196"
            width="140"
            height="8"
            fill="#718096"
            stroke="#222"
            strokeWidth="1"
          />

          {/* Forward Propeller Wheel (Clockwise) */}
          <g transform={`translate(290, 200)`}>
            {/* Outer Shroud Ring */}
            <ellipse
              cx="0"
              cy="0"
              rx={screw.shroudSvgRx}
              ry={screw.forwardShroudSvgRy}
              fill="none"
              stroke="#B87333"
              strokeWidth="3"
              opacity="0.8"
            />
            {/* Helical Blades */}
            {Array.from({ length: screw.bladeCount }).map((_, i) => {
              const bladeAngle = (i * screw.bladePitchDeg + angleDeg) % 360;
              const yOffset = Math.sin((bladeAngle * Math.PI) / 180) * screw.forwardBladeSvgRy;
              const xOffset = Math.cos((bladeAngle * Math.PI) / 180) * screw.bladeSvgRx;
              return (
                <path
                  key={`fwd-blade-${bladeAngle}`}
                  d={`M 0 0 L ${xOffset} ${yOffset} L ${xOffset + screw.bladeTipDx} ${yOffset - screw.bladeTipDy} Z`}
                  fill="#D4AF37"
                  stroke="#8B5A2B"
                  strokeWidth="1.5"
                  opacity="0.9"
                />
              );
            })}
            <circle cx="0" cy="0" r={screw.hubSvgR} fill="#222" />
          </g>

          {/* Aft Propeller Wheel (Counter-Clockwise Contra-Rotating) */}
          <g transform={`translate(380, 200)`}>
            {/* Outer Shroud Ring */}
            <ellipse
              cx="0"
              cy="0"
              rx={screw.shroudSvgRx}
              ry={screw.aftShroudSvgRy}
              fill="none"
              stroke="#B87333"
              strokeWidth="3"
              opacity="0.8"
            />
            {/* Helical Blades Counter-Rotating */}
            {Array.from({ length: screw.bladeCount }).map((_, i) => {
              const bladeAngle = (i * screw.bladePitchDeg - angleDeg) % 360;
              const yOffset = Math.sin((bladeAngle * Math.PI) / 180) * screw.aftBladeSvgRy;
              const xOffset = Math.cos((bladeAngle * Math.PI) / 180) * screw.bladeSvgRx;
              return (
                <path
                  key={`aft-blade-${bladeAngle}`}
                  d={`M 0 0 L ${xOffset} ${yOffset} L ${xOffset - screw.bladeTipDx} ${yOffset + screw.bladeTipDy} Z`}
                  fill="#C5A059"
                  stroke="#8B5A2B"
                  strokeWidth="1.5"
                  opacity="0.9"
                />
              );
            })}
            <circle cx="0" cy="0" r={screw.aftHubSvgR} fill="#222" />
          </g>

          {/* Reader-aid water-motion lines, not a measured wake. */}
          <g opacity="0.5" stroke="#63B3ED" strokeWidth="2" strokeDasharray="6 4">
            <line x1="410" y1="170" x2="560" y2="150" />
            <line x1="410" y1="200" x2="570" y2="200" />
            <line x1="410" y1="230" x2="560" y2="250" />
          </g>
          <text
            x="440"
            y="275"
            fill="#3182CE"
            fontSize="10"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            Reader-aid water path
          </text>
        </svg>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Source spiral advance
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            one turn = 3 diameters
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Source shaft relation
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            b opposite a; b slower
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Source casing clearance
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            about 1/8 inch
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Reader-aid phase
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {angleDeg.toFixed(0)}°
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-parchment-200 dark:border-ink-800">
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Illustrative shaft motion</span>
            <span className="font-mono">{shaftRpm} model RPM</span>
          </div>
          <input
            type="range"
            min="20"
            max="150"
            step="5"
            value={shaftRpm}
            onChange={(e) => updateParam("shaftRpm", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Illustrative plate angle</span>
            <span className="font-mono">{bladePitchAngleDeg} model degrees</span>
          </div>
          <input
            type="range"
            min="20"
            max="50"
            step="1"
            value={bladePitchAngleDeg}
            onChange={(e) => updateParam("bladePitchAngleDeg", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
