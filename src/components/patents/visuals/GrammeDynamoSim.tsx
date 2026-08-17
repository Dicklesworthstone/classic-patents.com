"use client";

import { Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function GrammeDynamoSim() {
  const [rotorRpm, setRotorRpm] = useState<number>(800);
  const [coilSections, setCoilSections] = useState<number>(32);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [angleDeg, setAngleDeg] = useState<number>(0);
  const animRef = useRef<number | null>(null);

  // Electrical physics
  const magneticFluxTesla = 1.35;
  const generatedDcVolts = Number(
    (rotorRpm * magneticFluxTesla * (coilSections / 32) * 0.12).toFixed(1),
  );
  const outputAmperes = Number((generatedDcVolts / 2.5).toFixed(1));
  const electricalPowerWatts = Math.round(generatedDcVolts * outputAmperes);
  const voltageRipplePct = Number(((Math.PI ** 2 / (2 * coilSections ** 2)) * 100).toFixed(2));

  useEffect(() => {
    if (!isPlaying) return;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      setAngleDeg((prev) => (prev + (rotorRpm / 60) * 360 * dt) % 360);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, rotorRpm]);

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
            Gramme Continuous DC Ring Dynamo (US 120,057)
          </h3>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400">
            Interactive 2D Electromagnetic Model — Toroidal Iron Ring Armature, Endless Multitap
            Coils, and Smooth DC Commutation
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
              setRotorRpm(800);
              setCoilSections(32);
              setAngleDeg(0);
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
          {/* Stator Magnetic Field Pole Shoes */}
          <path
            d="M 80 70 Q 180 70, 180 170 Q 180 270, 80 270 Z"
            fill="#C53030"
            stroke="#9B2C2C"
            strokeWidth="3"
          />
          <text
            x="110"
            y="175"
            fill="#FFFFFF"
            fontWeight="bold"
            fontSize="22"
            fontFamily="sans-serif"
          >
            N
          </text>

          <path
            d="M 520 70 Q 420 70, 420 170 Q 420 270, 520 270 Z"
            fill="#2B6CB0"
            stroke="#2C5282"
            strokeWidth="3"
          />
          <text
            x="475"
            y="175"
            fill="#FFFFFF"
            fontWeight="bold"
            fontSize="22"
            fontFamily="sans-serif"
          >
            S
          </text>

          {/* Toroidal Soft-Iron Ring Armature */}
          <g transform={`translate(300, 170) rotate(${angleDeg})`}>
            {/* Laminated Soft-Iron Torus */}
            <circle cx="0" cy="0" r="100" fill="none" stroke="#4A5568" strokeWidth="30" />

            {/* Distributed Endless Helical Coils around Ring */}
            {Array.from({ length: coilSections }).map((_, i) => {
              const cAngle = (i * 360) / coilSections;
              const rad = (cAngle * Math.PI) / 180;
              const xPos = Math.cos(rad) * 100;
              const yPos = Math.sin(rad) * 100;
              return (
                <rect
                  key={`gramme-coil-${cAngle}`}
                  x={xPos - 6}
                  y={yPos - 16}
                  width="12"
                  height="32"
                  rx="3"
                  fill="#D4AF37"
                  stroke="#8B5A2B"
                  strokeWidth="1"
                  transform={`rotate(${cAngle}, ${xPos}, ${yPos})`}
                />
              );
            })}

            {/* Central Commutator Drum */}
            <circle cx="0" cy="0" r="35" fill="#C5A059" stroke="#744210" strokeWidth="2" />
            {Array.from({ length: 16 }).map((_, i) => (
              <line
                key={`comm-seg-${i * 22.5}`}
                x1="0"
                y1="0"
                x2={Math.cos((i * 22.5 * Math.PI) / 180) * 35}
                y2={Math.sin((i * 22.5 * Math.PI) / 180) * 35}
                stroke="#1A202C"
                strokeWidth="1.5"
              />
            ))}
          </g>

          {/* Stationary DC Carbon / Copper Gauze Brushes (Vertical Neutral Plane) */}
          <rect
            x="294"
            y="125"
            width="12"
            height="15"
            fill="#B87333"
            stroke="#2D3748"
            strokeWidth="1.5"
          />
          <rect
            x="294"
            y="200"
            width="12"
            height="15"
            fill="#B87333"
            stroke="#2D3748"
            strokeWidth="1.5"
          />
          <text
            x="315"
            y="135"
            fill="#B87333"
            fontSize="11"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            + Brush ({generatedDcVolts} V DC)
          </text>
          <text
            x="315"
            y="215"
            fill="#B87333"
            fontSize="11"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            - Brush (Ground)
          </text>
        </svg>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Generated DC Voltage
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {generatedDcVolts} V
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Output Current
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            {outputAmperes} A
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Electrical Power
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            {electricalPowerWatts} W
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Voltage Ripple
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {voltageRipplePct}%
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-parchment-200 dark:border-ink-800">
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Dynamo Armature Speed</span>
            <span className="font-mono">{rotorRpm} RPM</span>
          </div>
          <input
            type="range"
            min="200"
            max="1800"
            step="50"
            value={rotorRpm}
            onChange={(e) => setRotorRpm(Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Ring Winding Coil Sections</span>
            <span className="font-mono">{coilSections} Sections</span>
          </div>
          <input
            type="range"
            min="16"
            max="64"
            step="8"
            value={coilSections}
            onChange={(e) => setCoilSections(Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
