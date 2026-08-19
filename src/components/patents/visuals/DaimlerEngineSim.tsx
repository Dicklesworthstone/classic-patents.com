"use client";

import { Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  pistonSvgDisplacement,
  stepDaimlerEngine,
  verticalConnectingRod,
} from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { usePatentAudio } from "./three/usePatentAudio";

export function DaimlerEngineSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-361931-daimler-engine");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const engineRpm = params.engineRpm ?? 750;
  const hotTubeTempC = params.hotTubeTemp ?? 850;
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [crankAngleDeg, setCrankAngleDeg] = useState<number>(0);
  const animRef = useRef<number | null>(null);

  const daimler = stepDaimlerEngine({
    engineRpm,
    hotTubeTempC,
    differentialSlipAngleDeg: params.turnAngle ?? 15,
  });
  const isHotTubeIgniting = hotTubeTempC >= 800;
  const powerOutputHp = daimler.brakeHorsepower;
  const specificPowerHpPerKg = daimler.specificPowerHpPerKg;

  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;

      setCrankAngleDeg((prev) => (prev + daimler.crankOmegaDegPerS * dt) % daimler.cycleWrapDeg);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, daimler.crankOmegaDegPerS, daimler.cycleWrapDeg]);

  const pistonDisplacement = pistonSvgDisplacement(crankAngleDeg, daimler.pistonStrokePx);
  const connectingRod = verticalConnectingRod(
    crankAngleDeg,
    pistonDisplacement,
    daimler.pistonStrokePx,
    daimler.crankCx,
    daimler.crankCy,
    daimler.rodOriginY0,
  );

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
            Daimler High-Speed Engine & Hot-Tube Ignition (US 361,931)
          </h3>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400">
            Interactive 2D Thermodynamic Model — High-Speed Rotation (750+ RPM), Incandescent
            Platinum Hot Tube, and Enclosed Crankcase
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
          {/* Vertical Cylinder Block */}
          <rect
            x="230"
            y="50"
            width="140"
            height="150"
            rx="6"
            fill="#4A5568"
            stroke="#1A202C"
            strokeWidth="2"
          />

          {/* Incandescent Hot-Tube Ignition Pipe (Top Right) */}
          <g transform="translate(370, 70)">
            <rect
              x="0"
              y="0"
              width="45"
              height="12"
              rx="3"
              fill={isHotTubeIgniting ? "#ECC94B" : "#718096"}
              stroke="#DD6B20"
              strokeWidth="1.5"
            />
            <text
              x="50"
              y="10"
              fill={isHotTubeIgniting ? "#DD6B20" : "#718096"}
              fontSize="10"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Hot-Tube ({hotTubeTempC}°C)
            </text>
          </g>

          {/* Reciprocating Piston Head */}
          <g
            transform={`translate(${daimler.pistonSvgX}, ${daimler.pistonSvgY0 + pistonDisplacement})`}
          >
            <rect
              x="0"
              y="0"
              width="110"
              height="45"
              rx="3"
              fill="#A0AEC0"
              stroke="#2D3748"
              strokeWidth="2"
            />
            <circle cx="55" cy="22" r="6" fill="#1A202C" />
          </g>

          {/* Enclosed Cast-Iron Crankcase (Bottom) */}
          <circle
            cx="300"
            cy="250"
            r="70"
            fill="#2D3748"
            stroke="#1A202C"
            strokeWidth="3"
            opacity={Math.min(1, 0.25 + daimler.jacketHeatSample)}
          />

          {/* Internal Twin Flywheels on Crankshaft */}
          <g transform={`translate(${daimler.crankCx}, ${daimler.crankCy})`}>
            <circle
              cx="0"
              cy="0"
              r={daimler.flywheelRimR}
              fill="#4A5568"
              stroke="#1A202C"
              strokeWidth="2"
            />
            <circle cx="0" cy="0" r={daimler.flywheelHubR} fill="#111" />
            {/* Crank Pin */}
            <circle
              cx={connectingRod.x2 - daimler.crankCx}
              cy={connectingRod.y2 - daimler.crankCy}
              r={daimler.crankPinR}
              fill="#D4AF37"
            />
          </g>

          {/* Connecting Rod */}
          <line
            x1={connectingRod.x1}
            y1={connectingRod.y1}
            x2={connectingRod.x2}
            y2={connectingRod.y2}
            stroke="#1A202C"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Engine Speed
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {engineRpm} RPM
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Power Output
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            {powerOutputHp} hp
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Power-to-Weight
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            {specificPowerHpPerKg} hp/kg
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Ignition Mode
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {isHotTubeIgniting ? "Hot-Tube Glow" : "Misfire"}
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-parchment-200 dark:border-ink-800">
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Rotational Speed (RPM)</span>
            <span className="font-mono">{engineRpm} RPM</span>
          </div>
          <input
            type="range"
            min="400"
            max="950"
            step="25"
            value={engineRpm}
            onChange={(e) => updateParam("engineRpm", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Platinum Hot-Tube Temperature</span>
            <span className="font-mono">{hotTubeTempC}°C</span>
          </div>
          <input
            type="range"
            min="650"
            max="950"
            step="10"
            value={hotTubeTempC}
            onChange={(e) => updateParam("hotTubeTemp", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
