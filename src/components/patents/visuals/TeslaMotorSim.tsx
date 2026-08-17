"use client";

import { Pause, Play, RotateCcw, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function TeslaMotorSim() {
  const [phaseMode, setPhaseMode] = useState<"2-phase" | "3-phase" | "1-phase">("2-phase");
  const [frequency, setFrequency] = useState<number>(30); // Hz
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [loadTorque, setLoadTorque] = useState<number>(20); // %
  const [time, setTime] = useState<number>(0);

  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      if (isPlaying) {
        setTime((prev) => prev + dt * (frequency / 10));
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, frequency]);

  // Phase angles & field vector calculation
  const omega = time * 2 * Math.PI;
  let bx = 0;
  let by = 0;
  let phaseA = 0;
  let phaseB = 0;
  let phaseC = 0;

  if (phaseMode === "2-phase") {
    // Tesla's original 2-phase quadrature
    phaseA = Math.cos(omega);
    phaseB = Math.sin(omega);
    bx = phaseA;
    by = phaseB;
  } else if (phaseMode === "3-phase") {
    // Modern 3-phase (120 deg apart)
    phaseA = Math.cos(omega);
    phaseB = Math.cos(omega - (2 * Math.PI) / 3);
    phaseC = Math.cos(omega - (4 * Math.PI) / 3);
    bx = phaseA - 0.5 * phaseB - 0.5 * phaseC;
    by = (Math.sqrt(3) / 2) * (phaseB - phaseC);
  } else {
    // 1-phase (pulsating field, zero starting torque)
    phaseA = Math.cos(omega);
    bx = 0;
    by = phaseA;
  }

  const bMag = Math.sqrt(bx * bx + by * by);
  const _bAngle = Math.atan2(by, bx); // radians
  const rotorSpeed = phaseMode === "1-phase" ? 0 : frequency * (1 - loadTorque * 0.005) * 60; // RPM

  return (
    <div className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-5 shadow-patent">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
            <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
              Tesla Polyphase AC Rotating Magnetic Field Simulator
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-0.5">
            Watch out-of-phase alternating currents synthesize a continuous rotating magnetic stator
            vector.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-amber-600 text-white hover:bg-amber-700 transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? "Pause Flux" : "Start AC"}
          </button>
          <button
            type="button"
            onClick={() => setTime(0)}
            className="p-1.5 rounded-lg border border-parchment-300 dark:border-ink-800 hover:bg-parchment-200 dark:hover:bg-ink-800 text-ink-700 dark:text-ink-300 transition-colors"
            title="Reset Phase"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="my-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visualizer Frame */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-xl bg-gradient-to-b from-amber-950/20 to-ink-950 p-6 border border-parchment-200 dark:border-ink-800 relative min-h-[340px]">
          {/* Phase Mode Pills */}
          <div className="flex items-center gap-2 mb-4">
            <button
              type="button"
              onClick={() => setPhaseMode("2-phase")}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all border ${
                phaseMode === "2-phase"
                  ? "bg-amber-500 text-ink-950 font-bold border-amber-400 shadow-glow"
                  : "bg-ink-900/60 text-ink-400 border-ink-700 hover:text-ink-200"
              }`}
            >
              2-Phase (Tesla 1888 90°)
            </button>
            <button
              type="button"
              onClick={() => setPhaseMode("3-phase")}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all border ${
                phaseMode === "3-phase"
                  ? "bg-amber-500 text-ink-950 font-bold border-amber-400 shadow-glow"
                  : "bg-ink-900/60 text-ink-400 border-ink-700 hover:text-ink-200"
              }`}
            >
              3-Phase (Modern 120°)
            </button>
            <button
              type="button"
              onClick={() => setPhaseMode("1-phase")}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all border ${
                phaseMode === "1-phase"
                  ? "bg-red-500 text-white font-bold border-red-400"
                  : "bg-ink-900/60 text-ink-400 border-ink-700 hover:text-ink-200"
              }`}
            >
              1-Phase (DC/Stalled)
            </button>
          </div>

          {/* Stator & Rotor Motor SVG */}
          <svg viewBox="0 0 400 300" className="w-full max-w-md h-auto select-none">
            <defs>
              <radialGradient id="rotorMetal" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="85%" stopColor="#475569" />
                <stop offset="100%" stopColor="#1e293b" />
              </radialGradient>
              <linearGradient id="statorIron" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#64748b" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>
            </defs>

            {/* Stator Outer Ring */}
            <circle
              cx="200"
              cy="150"
              r="120"
              fill="url(#statorIron)"
              stroke="#cbd5e1"
              strokeWidth="4"
            />
            <circle cx="200" cy="150" r="85" fill="#0f172a" stroke="#475569" strokeWidth="2" />

            {/* Stator Coils (4 Pole / Orthogonal) */}
            {/* North-South Coil Pair A */}
            <g>
              {/* North Coil A */}
              <rect
                x="180"
                y="35"
                width="40"
                height="30"
                rx="4"
                fill={phaseA > 0 ? "#f59e0b" : "#3b82f6"}
                fillOpacity={Math.abs(phaseA) * 0.8 + 0.2}
                stroke="#d97706"
                strokeWidth="2"
              />
              <text
                x="200"
                y="55"
                textAnchor="middle"
                fontSize="10"
                fill="#ffffff"
                fontFamily="monospace"
                fontWeight="bold"
              >
                A ({phaseA > 0 ? "+N" : "-S"})
              </text>

              {/* South Coil A */}
              <rect
                x="180"
                y="235"
                width="40"
                height="30"
                rx="4"
                fill={phaseA < 0 ? "#f59e0b" : "#3b82f6"}
                fillOpacity={Math.abs(phaseA) * 0.8 + 0.2}
                stroke="#d97706"
                strokeWidth="2"
              />
              <text
                x="200"
                y="255"
                textAnchor="middle"
                fontSize="10"
                fill="#ffffff"
                fontFamily="monospace"
                fontWeight="bold"
              >
                A&apos; ({phaseA < 0 ? "+N" : "-S"})
              </text>
            </g>

            {/* East-West Coil Pair B */}
            <g>
              {/* West Coil B */}
              <rect
                x="85"
                y="130"
                width="30"
                height="40"
                rx="4"
                fill={phaseB > 0 ? "#f59e0b" : "#3b82f6"}
                fillOpacity={Math.abs(phaseB) * 0.8 + 0.2}
                stroke="#d97706"
                strokeWidth="2"
              />
              <text
                x="100"
                y="154"
                textAnchor="middle"
                fontSize="10"
                fill="#ffffff"
                fontFamily="monospace"
                fontWeight="bold"
              >
                B
              </text>

              {/* East Coil B */}
              <rect
                x="285"
                y="130"
                width="30"
                height="40"
                rx="4"
                fill={phaseB < 0 ? "#f59e0b" : "#3b82f6"}
                fillOpacity={Math.abs(phaseB) * 0.8 + 0.2}
                stroke="#d97706"
                strokeWidth="2"
              />
              <text
                x="300"
                y="154"
                textAnchor="middle"
                fontSize="10"
                fill="#ffffff"
                fontFamily="monospace"
                fontWeight="bold"
              >
                B&apos;
              </text>
            </g>

            {/* Rotating Rotor Armature */}
            <g
              transform={`translate(200, 150) rotate(${phaseMode === "1-phase" ? 0 : ((time * 360 * frequency) / 10) * (1 - loadTorque * 0.005)})`}
            >
              {/* Rotor Disk */}
              <circle
                cx="0"
                cy="0"
                r="55"
                fill="url(#rotorMetal)"
                stroke="#94a3b8"
                strokeWidth="2"
              />

              {/* Squirrel Cage Copper Bars */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <g key={deg} transform={`rotate(${deg})`}>
                  <circle cx="0" cy="42" r="4" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="42"
                    stroke="#64748b"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                </g>
              ))}

              {/* Center Shaft */}
              <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
              <circle cx="0" cy="0" r="4" fill="#ef4444" />
            </g>

            {/* Net Magnetic Flux Vector Arrow (Rotating in Space) */}
            <g transform="translate(200, 150)">
              <line
                x1="0"
                y1="0"
                x2={bx * 75}
                y2={by * 75}
                stroke="#f59e0b"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx={bx * 75} cy={by * 75} r="5" fill="#f59e0b" />
              <text
                x={bx * 85}
                y={by * 85}
                textAnchor="middle"
                fontSize="11"
                fill="#fbbf24"
                fontFamily="monospace"
                fontWeight="bold"
              >
                B_net
              </text>
            </g>
          </svg>

          {/* Real-time Oscilloscope Mini-view */}
          <div className="w-full mt-3 bg-ink-900/90 border border-ink-800 rounded-lg p-2.5 flex items-center justify-between text-xs font-mono text-ink-300">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-amber-400">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
                Phase A: {phaseA.toFixed(2)}
              </span>
              <span className="flex items-center gap-1 text-blue-400">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-400" />
                Phase B: {phaseB.toFixed(2)}
              </span>
            </div>
            <div className="text-emerald-400 font-bold">
              |B_net| = {bMag.toFixed(2)} (Constant Vector)
            </div>
          </div>
        </div>

        {/* Controls & Metrics */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="space-y-4 bg-parchment-100/60 dark:bg-ink-900/60 p-4 rounded-xl border border-parchment-200 dark:border-ink-800">
            {/* Frequency Control */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  AC Frequency (Hz)
                </span>
                <span className="text-amber-700 dark:text-amber-400 font-bold">{frequency} Hz</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-ink-500 font-mono mt-0.5">
                <span>10 Hz (Slow)</span>
                <span>50 Hz (EU)</span>
                <span>60 Hz (US Standard)</span>
              </div>
            </div>

            {/* Mechanical Load Torque (Rotor Slip) */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Mechanical Shaft Load
                </span>
                <span className="text-blue-700 dark:text-blue-400 font-bold">{loadTorque}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={loadTorque}
                onChange={(e) => setLoadTorque(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-ink-500 font-mono mt-0.5">
                <span>0% (No Load)</span>
                <span>50% (Normal)</span>
                <span>100% (High Slip)</span>
              </div>
            </div>
          </div>

          {/* Motor Telemetry Readout */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-parchment-200/50 dark:bg-ink-900/80 p-3 rounded-lg border border-parchment-300 dark:border-ink-800">
            <div>
              <span className="text-ink-500 text-[10px] block">Synchronous Stator Speed</span>
              <span className="font-bold text-ink-900 dark:text-parchment-100">
                {(frequency * 60).toLocaleString()} RPM
              </span>
            </div>
            <div>
              <span className="text-ink-500 text-[10px] block">Actual Rotor Speed</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {Math.round(rotorSpeed).toLocaleString()} RPM
              </span>
            </div>
            <div>
              <span className="text-ink-500 text-[10px] block">Rotor Slip (s)</span>
              <span className="font-bold text-ink-900 dark:text-parchment-100">
                {(loadTorque * 0.5).toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-ink-500 text-[10px] block">Brushes / Commutator</span>
              <span className="font-bold text-emerald-600">ZERO (Brushless)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
