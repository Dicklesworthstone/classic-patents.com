"use client";

import { Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function EdisonPhonographSim() {
  const [crankRpm, setCrankRpm] = useState<number>(60);
  const [voiceVolumeDb, setVoiceVolumeDb] = useState<number>(75);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [cylinderAngleDeg, setCylinderAngleDeg] = useState<number>(0);
  const animRef = useRef<number | null>(null);

  // Acoustic & Lead-Screw Kinematics
  const threadsPerInch = 10;
  const leadScrewPitchMm = 2.54;
  const surfaceSpeedMps = Number(((crankRpm * 2 * Math.PI * 0.05) / 60).toFixed(2));
  const axialTravelMm = Number((((cylinderAngleDeg / 360) * leadScrewPitchMm) % 40).toFixed(1));
  const indentationDepthMicrons = Number(((voiceVolumeDb / 75) * 25).toFixed(1));
  const audioBandwidthHz = Math.round(surfaceSpeedMps * 4500);

  useEffect(() => {
    if (!isPlaying) return;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      setCylinderAngleDeg((prev) => prev + crankRpm * 6 * dt);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, crankRpm]);

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
            Edison Tinfoil Cylinder Phonograph (US 200,521)
          </h3>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400">
            Interactive 2D Acoustic Model — Threaded Lead-Screw Mandrel, Tinfoil Micro-Indentations,
            and Diaphragm Playback
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
              setCrankRpm(60);
              setVoiceVolumeDb(75);
              setCylinderAngleDeg(0);
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
          {/* Wooden Baseboard Stand */}
          <rect
            x="40"
            y="270"
            width="520"
            height="30"
            rx="4"
            fill="#5C4033"
            stroke="#3D2817"
            strokeWidth="2"
          />

          {/* Threaded Lead-Screw Shaft running across */}
          <rect
            x="80"
            y="165"
            width="440"
            height="10"
            fill="#CBD5E0"
            stroke="#4A5568"
            strokeWidth="1"
          />
          {/* Screw Threads */}
          {Array.from({ length: 40 }).map((_, i) => (
            <line
              key={`thread-${i * 10}`}
              x1={90 + i * 10}
              y1="165"
              x2={96 + i * 10}
              y2="175"
              stroke="#718096"
              strokeWidth="1"
            />
          ))}

          {/* Grooved Brass Cylinder wrapped in Tinfoil (Translating Axially) */}
          <g transform={`translate(${160 + axialTravelMm * 2}, 130)`}>
            <rect
              x="0"
              y="0"
              width="200"
              height="80"
              rx="4"
              fill="#D4AF37"
              stroke="#744210"
              strokeWidth="2"
            />
            <rect x="10" y="5" width="180" height="70" rx="2" fill="#E2E8F0" opacity="0.9" />
            <text
              x="50"
              y="45"
              fill="#4A5568"
              fontWeight="bold"
              fontSize="13"
              fontFamily="sans-serif"
            >
              Tinfoil Cylinder
            </text>
            {/* Spiral Grooves on Tinfoil */}
            {Array.from({ length: 16 }).map((_, i) => (
              <line
                key={`groove-${i * 11}`}
                x1={15 + i * 11}
                y1="5"
                x2={15 + i * 11}
                y2="75"
                stroke="#A0AEC0"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            ))}
          </g>

          {/* Acoustic Recording Mouthpiece & Stylus */}
          <g transform="translate(260, 60)">
            {/* Conical Horn */}
            <polygon points="0,0 60,-35 60,35" fill="#C5A059" stroke="#8B5A2B" strokeWidth="2" />
            {/* Mica Diaphragm */}
            <line
              x1="0"
              y1="-20"
              x2="0"
              y2="20"
              stroke="#CBD5E0"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Indenting Steel Stylus */}
            <polygon points="0,20 -3,45 3,45" fill="#1A202C" />
            <text
              x="-60"
              y="-10"
              fill="#8B5A2B"
              fontSize="10"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Acoustic Horn
            </text>
          </g>

          {/* Heavy Flywheel & Hand Crank on Right */}
          <g transform="translate(520, 170)">
            <circle cx="0" cy="0" r="50" fill="none" stroke="#2D3748" strokeWidth="10" />
            <circle cx="0" cy="0" r="8" fill="#111" />
            <line
              x1="0"
              y1="0"
              x2={Math.cos((cylinderAngleDeg * Math.PI) / 180) * 45}
              y2={Math.sin((cylinderAngleDeg * Math.PI) / 180) * 45}
              stroke="#4A5568"
              strokeWidth="3"
            />
            <circle
              cx={Math.cos((cylinderAngleDeg * Math.PI) / 180) * 45}
              cy={Math.sin((cylinderAngleDeg * Math.PI) / 180) * 45}
              r="5"
              fill="#8B5A2B"
            />
          </g>
        </svg>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Surface Speed
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {surfaceSpeedMps} m/s ({crankRpm} RPM)
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Axial Travel
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            {axialTravelMm} mm (10 TPI)
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Indentation Depth
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            {indentationDepthMicrons} μm
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Audio Bandwidth
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {audioBandwidthHz} Hz
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
            onChange={(e) => setCrankRpm(Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Spoken Voice Intensity</span>
            <span className="font-mono">{voiceVolumeDb} dB</span>
          </div>
          <input
            type="range"
            min="40"
            max="100"
            step="5"
            value={voiceVolumeDb}
            onChange={(e) => setVoiceVolumeDb(Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
