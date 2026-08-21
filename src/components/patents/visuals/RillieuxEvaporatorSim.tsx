"use client";

import { Gauge, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useId, useMemo } from "react";
import { stepRillieuxEvaporator } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";

interface RillieuxEvaporatorSimProps {
  initialJuiceRateKgH?: number;
  initialBrix?: number;
  initialTargetBrix?: number;
  initialEffects?: number;
}

export function RillieuxEvaporatorSim({
  initialJuiceRateKgH = 10000,
  initialBrix = 14,
  initialTargetBrix = 65,
  initialEffects = 3,
}: RillieuxEvaporatorSimProps) {
  const feedId = useId();
  const brixId = useId();
  const targetId = useId();
  const effectsId = useId();

  const { params, updateParam, resetParams } = usePatentPhysics("us-3237-rillieux-evaporator");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const juiceFeedRateKgPerH = params.juiceFeedRateKgPerH ?? initialJuiceRateKgH;
  const initialBrixDeg = params.initialBrixDeg ?? initialBrix;
  const targetBrixDeg = params.targetBrixDeg ?? initialTargetBrix;
  const numberOfEffects = params.numberOfEffects ?? initialEffects;

  const rillState = useMemo(() => {
    return stepRillieuxEvaporator({
      juiceFeedRateKgPerH,
      initialBrixDeg,
      targetBrixDeg,
      numberOfEffects,
    });
  }, [juiceFeedRateKgPerH, initialBrixDeg, targetBrixDeg, numberOfEffects]);

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6 rounded-2xl bg-parchment-50 dark:bg-neutral-900/90 border border-parchment-300 dark:border-neutral-800 text-ink-900 dark:text-neutral-100 shadow-md backdrop-blur-md transition-colors">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-parchment-200 dark:border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-xl font-bold font-serif tracking-tight text-ink-950 dark:text-amber-400">
              Norbert Rillieux Multiple-Effect Evaporator (US 3,237)
            </h3>
          </div>
          <p className="text-sm text-ink-600 dark:text-neutral-400">
            Latent Heat Cascading, Multi-Stage Vacuum Boiling & Steam Cogeneration
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-end lg:self-auto">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 border border-emerald-400 dark:border-emerald-500/30">
            Savings: {rillState.fuelSavingsPct.toFixed(1)}%
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-400 dark:border-amber-500/30">
            Economy: {rillState.steamEconomyRatio.toFixed(2)}×
          </span>
          <button
            type="button"
            onClick={() => {
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            aria-label={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              resetParams();
              soundEngine.playSwitchClick();
            }}
            aria-label="Reset Simulation"
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive SVG Diagram */}
      <div className="relative w-full aspect-[16/9] min-h-[400px] bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800 flex items-center justify-center p-4">
        <svg
          viewBox="0 0 960 520"
          className="w-full h-full select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Metal vessel gradients */}
            <linearGradient id="vesselGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="25%" stopColor="#475569" />
              <stop offset="75%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="steamPipeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="copperTubes" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ea580c" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>
            {/* Juice Brix gradients (light amber at 14°Bx to rich dark molasses at 65°Bx) */}
            <linearGradient id="juiceGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#eab308" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="juiceGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="juiceGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#b45309" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#78350f" stopOpacity="0.95" />
            </linearGradient>
            <radialGradient id="steamGlow">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
            <filter id="rillglow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Structural Flooring */}
          <line x1="40" y1="460" x2="920" y2="460" stroke="#334155" strokeWidth="4" />
          <line
            x1="40"
            y1="468"
            x2="920"
            y2="468"
            stroke="#1e293b"
            strokeWidth="2"
            strokeDasharray="6,4"
          />

          {/* 1. PRIMARY STEAM SUPPLY & ENGINE EXHAUST (LEFT) */}
          <g transform="translate(60, 260)">
            {/* Steam Boiler / Engine Icon */}
            <rect
              x="-35"
              y="-120"
              width="70"
              height="90"
              rx="8"
              fill="#1e293b"
              stroke="#f59e0b"
              strokeWidth="2"
            />
            <text
              x="0"
              y="-85"
              fill="#f59e0b"
              fontSize="10"
              textAnchor="middle"
              fontFamily="sans-serif"
              fontWeight="bold"
            >
              ENGINE
            </text>
            <text
              x="0"
              y="-70"
              fill="#f59e0b"
              fontSize="9"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              EXHAUST
            </text>
            <text
              x="0"
              y="-50"
              fill="#fbbf24"
              fontSize="10"
              textAnchor="middle"
              fontFamily="monospace"
              fontWeight="bold"
            >
              113°C
            </text>

            {/* Primary Steam Pipe to Effect 1 */}
            <path
              d="M 35 -75 L 110 -75 L 110 50 L 140 50"
              stroke="url(#steamPipeGrad)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
            />
            <text
              x="75"
              y="-85"
              fill="#fef08a"
              fontSize="10"
              textAnchor="middle"
              fontFamily="monospace"
            >
              Live Steam (160 kPa)
            </text>

            {/* Weighted Throttle Valve */}
            <circle cx="85" cy="-75" r="8" fill="#d97706" stroke="#fbbf24" strokeWidth="1.5" />
            <line x1="85" y1="-83" x2="100" y2="-98" stroke="#cbd5e1" strokeWidth="3" />
            <circle cx="100" cy="-98" r="5" fill="#64748b" />
          </g>

          {/* 2. CASCADING EVAPORATOR EFFECTS (N = 3) */}
          {rillState.effects.map((effect, idx) => {
            const posX = 240 + idx * 230;
            const juiceGradId =
              idx === 0 ? "url(#juiceGrad1)" : idx === 1 ? "url(#juiceGrad2)" : "url(#juiceGrad3)";

            return (
              <g key={effect.effectNumber} transform={`translate(${posX}, 260)`}>
                {/* Evaporator Shell Vessel */}
                <rect
                  x="-75"
                  y="-140"
                  width="150"
                  height="260"
                  rx="40"
                  fill="url(#vesselGrad)"
                  stroke="#64748b"
                  strokeWidth="2.5"
                />

                {/* Upper Vapor Dome Header */}
                <path
                  d="M -50 -130 Q 0 -165 50 -130 Z"
                  fill="#475569"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                />

                {/* Boiling Liquid Pool */}
                <rect x="-70" y="-20" width="140" height="130" rx="15" fill={juiceGradId} />

                {/* Boiling Bubbles Animation */}
                <g fill="#ffffff" opacity="0.6">
                  <circle cx="-35" cy="40" r="4" />
                  <circle cx="-15" cy="15" r="6" />
                  <circle cx="20" cy="50" r="3" />
                  <circle cx="35" cy="20" r="5" />
                  <circle cx="0" cy="65" r="4" />
                </g>

                {/* Submerged Horizontal Heating Tube Bundle */}
                <g transform="translate(0, 70)">
                  <rect
                    x="-65"
                    y="-30"
                    width="130"
                    height="45"
                    rx="6"
                    fill="#1e293b"
                    stroke="url(#copperTubes)"
                    strokeWidth="2"
                  />
                  {/* Tube passes */}
                  <line x1="-60" y1="-18" x2="60" y2="-18" stroke="#ea580c" strokeWidth="3.5" />
                  <line x1="-60" y1="-7" x2="60" y2="-7" stroke="#f97316" strokeWidth="3.5" />
                  <line x1="-60" y1="4" x2="60" y2="4" stroke="#ea580c" strokeWidth="3.5" />
                  <text
                    x="0"
                    y="22"
                    fill="#fed7aa"
                    fontSize="8"
                    textAnchor="middle"
                    fontFamily="sans-serif"
                  >
                    Copper Tube Bundle
                  </text>
                </g>

                {/* Effect Labels & Telemetry Overlay */}
                <text
                  x="0"
                  y="-115"
                  fill="#f8fafc"
                  fontSize="13"
                  textAnchor="middle"
                  fontFamily="serif"
                  fontWeight="bold"
                >
                  EFFECT {effect.effectNumber}
                </text>
                <text
                  x="0"
                  y="-95"
                  fill="#38bdf8"
                  fontSize="11"
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  P: {effect.operatingPressureKPa.toFixed(0)} kPa
                </text>
                <text
                  x="0"
                  y="-80"
                  fill="#fbbf24"
                  fontSize="11"
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  T: {effect.boilingTemperatureC.toFixed(1)}°C
                </text>
                <text
                  x="0"
                  y="-55"
                  fill="#34d399"
                  fontSize="12"
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {effect.juiceBrixDeg.toFixed(1)} °Bx
                </text>

                {/* Inter-Effect Vapor Transfer Trunk to Next Effect */}
                {idx < rillState.effects.length - 1 && (
                  <g>
                    <path
                      d="M 0 -145 L 0 -185 L 230 -185 L 230 70 L 165 70"
                      stroke="#facc15"
                      strokeWidth="10"
                      fill="none"
                      strokeLinecap="round"
                      opacity="0.85"
                    />
                    <text
                      x="115"
                      y="-195"
                      fill="#fef08a"
                      fontSize="10"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      Vapor {(effect.boilingTemperatureC - effect.bpeDegC).toFixed(0)}°C
                    </text>
                  </g>
                )}

                {/* Inter-Effect Juice Transfer Pipe */}
                {idx < rillState.effects.length - 1 && (
                  <path
                    d="M 70 85 L 160 85"
                    stroke="#38bdf8"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="4,2"
                  />
                )}
              </g>
            );
          })}

          {/* 3. FINAL BAROMETRIC CONDENSER & VACUUM PUMP (RIGHT) */}
          <g transform="translate(860, 260)">
            {/* Barometric Condenser Vessel */}
            <rect
              x="-30"
              y="-150"
              width="60"
              height="110"
              rx="10"
              fill="#1e293b"
              stroke="#38bdf8"
              strokeWidth="2"
            />
            <text
              x="0"
              y="-115"
              fill="#38bdf8"
              fontSize="10"
              textAnchor="middle"
              fontFamily="sans-serif"
              fontWeight="bold"
            >
              VACUUM
            </text>
            <text
              x="0"
              y="-100"
              fill="#38bdf8"
              fontSize="10"
              textAnchor="middle"
              fontFamily="sans-serif"
              fontWeight="bold"
            >
              CONDENSER
            </text>
            <text
              x="0"
              y="-75"
              fill="#34d399"
              fontSize="10"
              textAnchor="middle"
              fontFamily="monospace"
              fontWeight="bold"
            >
              16 kPa
            </text>

            {/* Vapor Line from Effect 3 into Condenser */}
            <path
              d="M -160 -145 L -160 -185 L 0 -185 L 0 -150"
              stroke="#facc15"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              opacity="0.7"
            />

            {/* Cold Water Spray Injection */}
            <path d="M 0 -150 L 0 -100" stroke="#38bdf8" strokeWidth="3" strokeDasharray="3,3" />

            {/* Barometric Water Leg Pipe */}
            <path d="M 0 -40 L 0 190" stroke="#0284c7" strokeWidth="8" fill="none" />
            <rect x="-25" y="180" width="50" height="25" rx="3" fill="#0369a1" />
            <text
              x="0"
              y="196"
              fill="#f8fafc"
              fontSize="8"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              Hot Well
            </text>

            {/* Final Heavy Syrup Discharge */}
            <path
              d="M -160 110 L -160 160 L -80 160"
              stroke="#78350f"
              strokeWidth="6"
              fill="none"
            />
            <rect
              x="-80"
              y="145"
              width="50"
              height="30"
              rx="4"
              fill="#451a03"
              stroke="#b45309"
              strokeWidth="1.5"
            />
            <text
              x="-55"
              y="164"
              fill="#fbbf24"
              fontSize="9"
              textAnchor="middle"
              fontFamily="sans-serif"
              fontWeight="bold"
            >
              SYRUP
            </text>
          </g>

          {/* Raw Juice Inflow Label (Left) */}
          <g transform="translate(170, 345)">
            <path d="M -60 0 L 0 0" stroke="#38bdf8" strokeWidth="6" fill="none" />
            <polygon points="0,-4 8,0 0,4" fill="#38bdf8" />
            <text
              x="-40"
              y="-12"
              fill="#38bdf8"
              fontSize="10"
              textAnchor="middle"
              fontFamily="monospace"
            >
              Raw Juice In ({initialBrixDeg}°Bx)
            </text>
          </g>
        </svg>
      </div>

      {/* Interactive Sliders & Live Telemetry HUD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-950/60 p-5 rounded-xl border border-neutral-800">
        {/* Left: Input Sliders */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Chemical Process Controllers
          </h4>

          {/* Juice Feed Rate Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-mono">
              <label htmlFor={feedId} className="text-neutral-300">
                Raw Cane Juice Feed Rate
              </label>
              <span className="text-cyan-400 font-bold">
                {juiceFeedRateKgPerH.toLocaleString()} kg/h
              </span>
            </div>
            <input
              id={feedId}
              type="range"
              min="2000"
              max="25000"
              step="500"
              value={juiceFeedRateKgPerH}
              onChange={(e) => updateParam("juiceFeedRateKgPerH", parseInt(e.target.value, 10))}
              className="w-full accent-cyan-500 bg-neutral-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          {/* Initial Brix Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-mono">
              <label htmlFor={brixId} className="text-neutral-300">
                Initial Clarified Juice Density
              </label>
              <span className="text-amber-400 font-bold">{initialBrixDeg.toFixed(1)} °Bx</span>
            </div>
            <input
              id={brixId}
              type="range"
              min="10"
              max="20"
              step="0.5"
              value={initialBrixDeg}
              onChange={(e) => updateParam("initialBrixDeg", parseFloat(e.target.value))}
              className="w-full accent-amber-500 bg-neutral-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          {/* Target Syrup Brix Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-mono">
              <label htmlFor={targetId} className="text-neutral-300">
                Target Crystallization Syrup Density
              </label>
              <span className="text-yellow-400 font-bold">{targetBrixDeg.toFixed(1)} °Bx</span>
            </div>
            <input
              id={targetId}
              type="range"
              min="50"
              max="75"
              step="1"
              value={targetBrixDeg}
              onChange={(e) => updateParam("targetBrixDeg", parseInt(e.target.value, 10))}
              className="w-full accent-yellow-500 bg-neutral-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          {/* Number of Effects */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-mono">
              <label htmlFor={effectsId} className="text-neutral-300">
                Evaporator Effects in Series
              </label>
              <span className="text-emerald-400 font-bold">
                {numberOfEffects} Effects (Cascade)
              </span>
            </div>
            <input
              id={effectsId}
              type="range"
              min="2"
              max="4"
              step="1"
              value={numberOfEffects}
              onChange={(e) => updateParam("numberOfEffects", parseInt(e.target.value, 10))}
              className="w-full accent-emerald-500 bg-neutral-800 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>

        {/* Right: Live SI Telemetry HUD */}
        <div className="flex flex-col gap-3 justify-center font-mono text-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Thermodynamics & Steam Economy Metrics
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
              <span className="text-neutral-500 text-[10px] block uppercase">Steam Economy</span>
              <span className="text-sm font-bold text-emerald-400">
                {rillState.steamEconomyRatio.toFixed(2)} kg/kg
              </span>
            </div>
            <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
              <span className="text-neutral-500 text-[10px] block uppercase">Water Evaporated</span>
              <span className="text-sm font-bold text-cyan-400">
                {(rillState.totalEvaporationKgPerH / 1000).toFixed(2)} t/h
              </span>
            </div>
            <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
              <span className="text-neutral-500 text-[10px] block uppercase">Primary Steam</span>
              <span className="text-sm font-bold text-amber-400">
                {(rillState.primarySteamConsumptionKgPerH / 1000).toFixed(2)} t/h
              </span>
            </div>
            <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
              <span className="text-neutral-500 text-[10px] block uppercase">Syrup Output</span>
              <span className="text-sm font-bold text-indigo-400">
                {(rillState.syrupOutputRateKgPerH / 1000).toFixed(2)} t/h
              </span>
            </div>
          </div>
          <div className="p-2.5 rounded bg-neutral-900/80 border border-neutral-800 text-[11px] text-neutral-400">
            <span className="text-amber-300 font-semibold">Rillieux Principle: </span>
            Reusing the latent heat of vaporization across cascading vacuum stages enables 1 pound
            of fuel to evaporate nearly 3 pounds of water.
          </div>
        </div>
      </div>
    </div>
  );
}
