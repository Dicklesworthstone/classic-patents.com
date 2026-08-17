"use client";

import { Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { soundEngine } from "@/utils/soundEngine";

export function TeslaMotorSim() {
  const [phaseCount, setPhaseCount] = useState<2 | 3>(2);
  const [frequencyHz, setFrequencyHz] = useState<number>(60);
  const [loadTorque, setLoadTorque] = useState<number>(20);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [_activePedagogyStep, setActivePedagogyStep] = useState<number>(1);
  const [angle, setAngle] = useState<number>(0);

  // Synchronous and Rotor Speed calculations
  const totalPoles = phaseCount === 2 ? 4 : 6;
  const syncSpeedRpm = (120 * frequencyHz) / totalPoles;
  const slip = Math.min(0.25, (loadTorque / 100) * 0.2 + 0.02);
  const rotorSpeedRpm = Math.round(syncSpeedRpm * (1 - slip));

  // Animation Loop for Stator Field & Rotor Rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((prev) => (prev + (frequencyHz / 60) * 8) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [frequencyHz]);

  // Audio AC Hum feedback
  useEffect(() => {
    if (isPlayingAudio) {
      soundEngine.playTeslaMotorHum(frequencyHz, rotorSpeedRpm);
    } else {
      soundEngine.stopContinuousTone();
    }
    return () => {
      soundEngine.stopContinuousTone();
    };
  }, [isPlayingAudio, frequencyHz, rotorSpeedRpm]);

  const _applyPedagogyStep = (step: number) => {
    setActivePedagogyStep(step);
    if (step === 1) {
      // Step 1: Low frequency 2-phase demonstration
      setFrequencyHz(30);
      setPhaseCount(2);
      setLoadTorque(10);
    } else if (step === 2) {
      // Step 2: Standard 60Hz 2-phase Polyphase Stator
      setFrequencyHz(60);
      setPhaseCount(2);
      setLoadTorque(25);
    } else if (step === 3) {
      // Step 3: High efficiency 3-phase AC Motor
      setFrequencyHz(60);
      setPhaseCount(3);
      setLoadTorque(50);
    }
  };

  const rad = (angle * Math.PI) / 180;
  const bVectorX = Math.cos(rad) * 60;
  const bVectorY = Math.sin(rad) * 60;

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 shadow-patent space-y-6">
      {/* Simulation Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
            <h3 className="font-serif text-xl font-bold text-ink-900 dark:text-parchment-100">
              Tesla Polyphase AC Rotating Magnetic Field Motor (US 381,968)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-1">
            Observe how out-of-phase AC currents generate a smooth, rotating magnetic stator vortex
            with <strong>zero mechanical brushes</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors border shadow-sm ${
              isPlayingAudio
                ? "bg-amber-600 text-white border-amber-700 animate-pulse"
                : "bg-parchment-200 dark:bg-ink-800 text-ink-800 dark:text-parchment-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-300"
            }`}
          >
            {isPlayingAudio ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span>{isPlayingAudio ? "AC Hum (Live)" : "Play AC Hum"}</span>
          </button>
        </div>
      </div>

      {/* Visual Canvas and Stator Vector Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-ink-950 p-6 border border-parchment-200 dark:border-ink-800 relative min-h-[360px]">
          {/* Circular Blueprint Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 pointer-events-none" />

          {/* Stator & Rotor SVG Visualizer */}
          <svg viewBox="0 0 400 300" className="w-full max-w-md h-auto select-none relative z-10">
            <defs>
              <radialGradient id="teslaRotorMetal" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="80%" stopColor="#475569" />
                <stop offset="100%" stopColor="#1e293b" />
              </radialGradient>
            </defs>

            {/* Outer Stator Ring */}
            <circle cx="200" cy="150" r="110" fill="#0f172a" stroke="#334155" strokeWidth="4" />
            <circle
              cx="200"
              cy="150"
              r="95"
              fill="none"
              stroke="#475569"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />

            {/* Stator poles: 4 coils at 90° (2-phase) or 6 coils at 60° (3-phase) */}
            {Array.from({ length: phaseCount === 2 ? 4 : 6 }, (_, i) => {
              const poles = phaseCount === 2 ? 4 : 6;
              const a = (i * 2 * Math.PI) / poles - Math.PI / 2;
              const phaseOff =
                (i % phaseCount) * (phaseCount === 2 ? Math.PI / 2 : (2 * Math.PI) / 3);
              const current = Math.sin(rad + phaseOff);
              const cx = 200 + Math.cos(a) * 108;
              const cy = 150 + Math.sin(a) * 108;
              const labels =
                phaseCount === 2 ? ["A", "B", "A'", "B'"] : ["A", "B", "C", "A'", "B'", "C'"];
              return (
                <g key={i}>
                  <rect
                    x={cx - 18}
                    y={cy - 12}
                    width="36"
                    height="24"
                    rx="4"
                    transform={`rotate(${(a * 180) / Math.PI + 90} ${cx} ${cy})`}
                    fill={current >= 0 ? "#f59e0b" : "#3b82f6"}
                    stroke="#fff"
                    strokeWidth="1"
                  />
                  <text
                    x={cx}
                    y={cy + 4}
                    fill="#fff"
                    fontSize="9"
                    textAnchor="middle"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {labels[i]}
                  </text>
                </g>
              );
            })}

            {/* Phase contribution vectors (the currents that sum to the rotating field) */}
            {phaseCount === 2
              ? [
                  { x: Math.cos(rad) * 52, y: 0, color: "#f59e0b" },
                  { x: 0, y: Math.sin(rad) * 52, color: "#3b82f6" },
                ].map((comp, i) => (
                  <line
                    key={i}
                    x1="200"
                    y1="150"
                    x2={200 + comp.x}
                    y2={150 + comp.y}
                    stroke={comp.color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.55"
                  />
                ))
              : [0, 1, 2].map((ph) => {
                  const mag = Math.sin(rad - (ph * 2 * Math.PI) / 3) * 42;
                  const ax = Math.cos((ph * 2 * Math.PI) / 3);
                  const ay = Math.sin((ph * 2 * Math.PI) / 3);
                  const colors = ["#f59e0b", "#3b82f6", "#10b981"];
                  return (
                    <line
                      key={ph}
                      x1="200"
                      y1="150"
                      x2={200 + ax * mag}
                      y2={150 + ay * mag}
                      stroke={colors[ph]}
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="0.5"
                    />
                  );
                })}

            {/* Resultant rotating B-field (constant magnitude for a balanced polyphase set) */}
            <line
              x1="200"
              y1="150"
              x2={200 + bVectorX}
              y2={150 + bVectorY}
              stroke="#fbbf24"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx={200 + bVectorX} cy={150 + bVectorY} r="5" fill="#f59e0b" />

            {/* Rotating Armature / Rotor Body */}
            <g transform={`translate(200, 150) rotate(${angle * (1 - slip)})`}>
              <circle
                cx="0"
                cy="0"
                r="50"
                fill="url(#teslaRotorMetal)"
                stroke="#cbd5e1"
                strokeWidth="2"
              />
              <circle cx="0" cy="0" r="8" fill="#0f172a" stroke="#94a3b8" strokeWidth="2" />
              {/* Squirrel Cage Copper Bars */}
              {Array.from({ length: 8 }).map((_, i) => {
                const barAngle = (i * 45 * Math.PI) / 180;
                return (
                  <circle
                    key={i}
                    cx={Math.cos(barAngle) * 36}
                    cy={Math.sin(barAngle) * 36}
                    r="4"
                    fill="#f59e0b"
                    stroke="#d97706"
                    strokeWidth="1"
                  />
                );
              })}
            </g>
          </svg>

          {/* Real-Time Telemetry Bar */}
          <div className="w-full grid grid-cols-3 gap-2 text-center text-xs font-mono pt-3 border-t border-ink-800 text-ink-300">
            <div>
              <span className="text-ink-500 block text-[10px]">SYNC SPEED</span>
              <span className="text-amber-400 font-bold">{syncSpeedRpm} RPM</span>
            </div>
            <div>
              <span className="text-ink-500 block text-[10px]">ROTOR SPEED</span>
              <span className="text-emerald-400 font-bold">{rotorSpeedRpm} RPM</span>
            </div>
            <div>
              <span className="text-ink-500 block text-[10px]">INDUCTION SLIP</span>
              <span className="text-blue-400 font-bold">{(slip * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/70 dark:bg-ink-900/60 p-5 space-y-4">
            <span className="font-serif font-bold text-sm text-ink-900 dark:text-parchment-100 block">
              AC Generator &amp; Motor Controls
            </span>

            {/* Polyphase Mode Selection */}
            <div>
              <span className="text-xs font-mono block text-ink-700 dark:text-ink-300 font-semibold mb-1">
                AC Phase Configuration
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setPhaseCount(2)}
                  className={`p-2 rounded-lg border text-center transition-colors ${
                    phaseCount === 2
                      ? "bg-amber-700 text-white border-amber-800 font-bold"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300"
                  }`}
                >
                  2-Phase (90° Quad)
                </button>
                <button
                  type="button"
                  onClick={() => setPhaseCount(3)}
                  className={`p-2 rounded-lg border text-center transition-colors ${
                    phaseCount === 3
                      ? "bg-amber-700 text-white border-amber-800 font-bold"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300"
                  }`}
                >
                  3-Phase (120° Poly)
                </button>
              </div>
            </div>

            {/* Frequency Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Stator AC Frequency
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {frequencyHz} Hz
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                value={frequencyHz}
                onChange={(e) => setFrequencyHz(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Mechanical Load Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Shaft Mechanical Load
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">{loadTorque}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="95"
                value={loadTorque}
                onChange={(e) => setLoadTorque(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
