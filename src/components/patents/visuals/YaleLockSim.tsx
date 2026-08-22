"use client";

import { Key, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { DEFAULT_LOCK_BITTINGS_MM, stepYaleLock } from "@/physics/yaleLockKernel";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";

interface YaleLockSimProps {
  initialKeyInsertion?: number;
  initialAppliedTorque?: number;
}

const WRONG_KEY_BITTINGS_MM: readonly number[] = [5.0, 3.0, 5.5, 2.5, 5.0];

export function YaleLockSim({
  initialKeyInsertion = 1.0,
  initialAppliedTorque = 0.15,
}: YaleLockSimProps) {
  const insertionId = useId();
  const torqueId = useId();
  const { params, updateParam, resetParams } = usePatentPhysics("us-48475-yale-lock");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const keyInsertion = params.keyInsertion ?? initialKeyInsertion;
  const appliedTorqueNm = params.appliedTorqueNm ?? initialAppliedTorque;
  const [useAuthorizedKey, setUseAuthorizedKey] = useState<boolean>(true);
  const [isRotating, setIsRotating] = useState<boolean>(false);

  const activeKeyBittings = useAuthorizedKey ? DEFAULT_LOCK_BITTINGS_MM : WRONG_KEY_BITTINGS_MM;

  const yaleState = useMemo(() => {
    return stepYaleLock({
      keyInsertion,
      appliedTorqueNm: isRotating ? appliedTorqueNm : 0.0,
      keyBittingsMm: activeKeyBittings,
      lockBittingsMm: DEFAULT_LOCK_BITTINGS_MM,
      currentPlugAngleRad: isRotating && keyInsertion >= 0.95 && useAuthorizedKey ? Math.PI / 2 : 0,
    });
  }, [keyInsertion, appliedTorqueNm, activeKeyBittings, isRotating, useAuthorizedKey]);

  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-parchment-50 dark:bg-neutral-900/90 border border-parchment-300 dark:border-neutral-800 text-ink-900 dark:text-neutral-100 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-parchment-200 dark:border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-xl font-bold font-serif tracking-tight text-ink-950 dark:text-amber-400">
              Linus Yale Jr. Pin-Tumbler Cylinder Lock (US 48,475)
            </h3>
          </div>
          <p className="text-sm text-ink-600 dark:text-neutral-400">
            5-Chamber Shear-Line Kinematics & Lost-Motion Cam Actuator
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-end lg:self-auto">
          <button
            type="button"
            onClick={() => {
              setUseAuthorizedKey(!useAuthorizedKey);
              soundEngine.playSwitchClick();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border ${
              useAuthorizedKey
                ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 border-emerald-400 dark:border-emerald-500/40 hover:bg-emerald-200 dark:hover:bg-emerald-500/30"
                : "bg-rose-100 dark:bg-rose-500/20 text-rose-900 dark:text-rose-300 border-rose-400 dark:border-rose-500/40 hover:bg-rose-200 dark:hover:bg-rose-500/30"
            }`}
          >
            {useAuthorizedKey ? "Authorized Key" : "Mismatched / Pick Key"}
          </button>
          <button
            type="button"
            disabled={!yaleState.isUnlocked}
            onClick={() => {
              setIsRotating(!isRotating);
              soundEngine.playSwitchClick();
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border ${
              yaleState.isUnlocked
                ? isRotating
                  ? "bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 border-amber-400 dark:border-amber-500/40 hover:bg-amber-200 dark:hover:bg-amber-500/30"
                  : "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-900 dark:text-cyan-300 border-cyan-400 dark:border-cyan-500/40 hover:bg-cyan-200 dark:hover:bg-cyan-500/30"
                : "bg-parchment-200 dark:bg-neutral-800 text-ink-400 dark:text-neutral-500 border-parchment-300 dark:border-neutral-700 cursor-not-allowed"
            }`}
          >
            {isRotating ? "Return Key (0°)" : "Turn Key (90°)"}
          </button>
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
              setUseAuthorizedKey(true);
              setIsRotating(false);
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

      {/* Main Interactive SVG Display */}
      <div className="relative w-full aspect-[16/9] min-h-[360px] bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800 flex items-center justify-center p-4">
        <svg
          viewBox="0 0 900 500"
          className="w-full h-full select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="housingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="30%" stopColor="#d97706" />
              <stop offset="70%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id="plugGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="50%" stopColor="#ca8a04" />
              <stop offset="100%" stopColor="#a16207" />
            </linearGradient>
            <linearGradient id="driverPinGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            <linearGradient id="keyPinGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="keyBladeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
            <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="50%" stopColor="#475569" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid Lines */}
          <g stroke="#262626" strokeWidth="0.5" strokeDasharray="4,4">
            <line x1="50" y1="250" x2="850" y2="250" />
            <line x1="450" y1="50" x2="450" y2="450" />
          </g>

          {/* Outer Cylinder Housing */}
          <rect
            x="140"
            y="60"
            width="420"
            height="320"
            rx="16"
            fill="url(#housingGrad)"
            stroke="#f59e0b"
            strokeWidth="2.5"
            opacity="0.85"
          />
          {/* External Thread ridges */}
          <g stroke="#78350f" strokeWidth="3" opacity="0.6">
            <line x1="140" y1="90" x2="560" y2="90" />
            <line x1="140" y1="120" x2="560" y2="120" />
            <line x1="140" y1="150" x2="560" y2="150" />
          </g>

          {/* Revolving Plug Cylinder (Lower Core) */}
          <rect
            x="160"
            y="230"
            width="380"
            height="130"
            rx="12"
            fill="url(#plugGrad)"
            stroke="#fde047"
            strokeWidth="2"
          />

          {/* CYLINDRICAL SHEAR LINE (Y = 230) */}
          <line
            x1="140"
            y1="230"
            x2="560"
            y2="230"
            stroke={yaleState.isUnlocked ? "#10b981" : "#ef4444"}
            strokeWidth={yaleState.isUnlocked ? "3" : "2"}
            strokeDasharray={yaleState.isUnlocked ? "none" : "6,4"}
            filter={yaleState.isUnlocked ? "url(#glow)" : undefined}
          />
          <text
            x="570"
            y="234"
            fill={yaleState.isUnlocked ? "#34d399" : "#f87171"}
            fontSize="12"
            fontWeight="bold"
            fontFamily="monospace"
          >
            SHEAR LINE {yaleState.isUnlocked ? "(CLEARED)" : "(BLOCKED)"}
          </text>

          {/* 5 PIN CHAMBERS */}
          {yaleState.pins.map((pin, i) => {
            const cx = 210 + i * 70;
            const chamberTopY = 80;
            const pinWidth = 24;

            const keyPinTopY = 230 - (pin.currentElevationMm - pin.targetShearElevationMm) * 8;
            const keyPinHeight = pin.keyPinLengthMm * 8;
            const keyPinBottomY = keyPinTopY + keyPinHeight;

            const driverPinHeight = pin.driverPinLengthMm * 8;
            const driverPinTopY = keyPinTopY - driverPinHeight;

            const springTopY = chamberTopY + 10;
            const springHeight = Math.max(15, driverPinTopY - springTopY);

            return (
              <g key={pin.index}>
                {/* Chamber Bore Cutout */}
                <rect
                  x={cx - pinWidth / 2 - 2}
                  y={chamberTopY}
                  width={pinWidth + 4}
                  height={270}
                  fill="#171717"
                  stroke="#404040"
                  strokeWidth="1"
                  rx="3"
                />

                {/* Compression Spring (Zigzag) */}
                <path
                  d={`M ${cx} ${springTopY} 
                      L ${cx - 6} ${springTopY + springHeight * 0.2}
                      L ${cx + 6} ${springTopY + springHeight * 0.4}
                      L ${cx - 6} ${springTopY + springHeight * 0.6}
                      L ${cx + 6} ${springTopY + springHeight * 0.8}
                      L ${cx} ${driverPinTopY}`}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Upper Driver Pin (I) */}
                <g>
                  <rect
                    x={cx - pinWidth / 2}
                    y={driverPinTopY}
                    width={pinWidth}
                    height={driverPinHeight}
                    rx="3"
                    fill="url(#driverPinGrad)"
                    stroke="#0284c7"
                    strokeWidth="1.5"
                  />
                  {/* Anti-pick serration notches */}
                  <line
                    x1={cx - pinWidth / 2}
                    y1={driverPinTopY + driverPinHeight * 0.35}
                    x2={cx + pinWidth / 2}
                    y2={driverPinTopY + driverPinHeight * 0.35}
                    stroke="#082f49"
                    strokeWidth="2"
                  />
                  <line
                    x1={cx - pinWidth / 2}
                    y1={driverPinTopY + driverPinHeight * 0.65}
                    x2={cx + pinWidth / 2}
                    y2={driverPinTopY + driverPinHeight * 0.65}
                    stroke="#082f49"
                    strokeWidth="2"
                  />
                </g>

                {/* Lower Key Pin (J) */}
                <g>
                  <rect
                    x={cx - pinWidth / 2}
                    y={keyPinTopY}
                    width={pinWidth}
                    height={keyPinHeight}
                    rx="3"
                    fill="url(#keyPinGrad)"
                    stroke="#059669"
                    strokeWidth="1.5"
                  />
                  {/* Rounded key contact tip */}
                  <path
                    d={`M ${cx - pinWidth / 2} ${keyPinBottomY - 4} Q ${cx} ${keyPinBottomY + 4} ${
                      cx + pinWidth / 2
                    } ${keyPinBottomY - 4}`}
                    fill="#047857"
                  />
                </g>

                {/* Pin Number Label */}
                <text
                  x={cx}
                  y={chamberTopY - 6}
                  fill="#a3a3a3"
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  #{i + 1}
                </text>
              </g>
            );
          })}

          {/* FLAT BITTED KEY BLADE */}
          {(() => {
            const keyX = -220 + keyInsertion * 340;
            return (
              <g transform={`translate(${keyX}, 280)`}>
                {/* Key Bow / Grip */}
                <path
                  d="M -60 -25 C -60 -50 -20 -50 0 -25 C 20 -50 60 -50 60 -25 C 60 25 20 25 0 25 C -20 25 -60 25 -60 -25 Z"
                  fill="url(#keyBladeGrad)"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                  transform="translate(-40, 0)"
                />
                <circle cx="-70" cy="-10" r="8" fill="#0f172a" />
                <circle cx="-40" cy="-10" r="8" fill="#0f172a" />
                <circle cx="-55" cy="10" r="8" fill="#0f172a" />

                {/* Key Shaft & Serrated Bitting Profile */}
                <path
                  d={`M 0 -8
                      L 440 -8
                      L 470 12
                      L 450 18
                      L 420 18
                      L 380 ${-activeKeyBittings[4] * 4 + 18}
                      L 340 ${-activeKeyBittings[4] * 4 + 18}
                      L 310 ${-activeKeyBittings[3] * 4 + 18}
                      L 270 ${-activeKeyBittings[3] * 4 + 18}
                      L 240 ${-activeKeyBittings[2] * 4 + 18}
                      L 200 ${-activeKeyBittings[2] * 4 + 18}
                      L 170 ${-activeKeyBittings[1] * 4 + 18}
                      L 130 ${-activeKeyBittings[1] * 4 + 18}
                      L 100 ${-activeKeyBittings[0] * 4 + 18}
                      L 60 ${-activeKeyBittings[0] * 4 + 18}
                      L 0 18 Z`}
                  fill="url(#keyBladeGrad)"
                  stroke="#f8fafc"
                  strokeWidth="1.5"
                />
                <text
                  x="-75"
                  y="36"
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                >
                  YALE 1865
                </text>
              </g>
            );
          })()}

          {/* LOST-MOTION LAZY-ARM & SLIDING DEADBOLT */}
          {(() => {
            const boltX = 640 + (yaleState.boltExtensionMm / 18) * 120;
            return (
              <g>
                {/* Mortise Deadbolt Body */}
                <rect
                  x={boltX}
                  y="180"
                  width="120"
                  height="70"
                  rx="6"
                  fill="url(#boltGrad)"
                  stroke="#94a3b8"
                  strokeWidth="2"
                />
                <text
                  x={boltX + 60}
                  y="220"
                  fill="#f1f5f9"
                  fontSize="13"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  DEADBOLT
                </text>
                {/* Bolt Talons */}
                <path
                  d={`M ${boltX - 30} 200 L ${boltX} 200 L ${boltX} 230 L ${boltX - 30} 230 Z`}
                  fill="#475569"
                  stroke="#64748b"
                  strokeWidth="1.5"
                />

                {/* Rotating Lazy-Arm Cam */}
                <g transform="translate(600, 240)">
                  <g transform={`rotate(${yaleState.lazyArmAngleDeg})`}>
                    <circle cx="0" cy="0" r="22" fill="#334155" stroke="#64748b" strokeWidth="2" />
                    <rect
                      x="-8"
                      y="-42"
                      width="16"
                      height="44"
                      rx="4"
                      fill="#38bdf8"
                      stroke="#0284c7"
                      strokeWidth="1.5"
                    />
                    <circle cx="0" cy="-35" r="5" fill="#f8fafc" />
                  </g>
                  <text
                    x="0"
                    y="40"
                    fill="#38bdf8"
                    fontSize="11"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    CAM: {yaleState.lazyArmAngleDeg.toFixed(0)}°
                  </text>
                </g>
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Real-Time Interactive Controls & Telemetry Readouts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-950/60 p-5 rounded-xl border border-neutral-800">
        {/* Left: Interactive Controls */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Interactive Manipulation Controls
          </h4>

          {/* Key Insertion Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-mono">
              <label htmlFor={insertionId} className="text-neutral-300">
                Key Blade Insertion Depth
              </label>
              <span className="text-amber-400 font-bold">{(keyInsertion * 100).toFixed(0)}%</span>
            </div>
            <input
              id={insertionId}
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={keyInsertion}
              onChange={(e) => updateParam("keyInsertion", parseFloat(e.target.value))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-neutral-800 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-neutral-800 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>0% (Withdrawn)</span>
              <span>50% (Half In)</span>
              <span>100% (Fully Seated)</span>
            </div>
          </div>

          {/* Turning Torque Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-mono">
              <label htmlFor={torqueId} className="text-neutral-300">
                Applied Rotational Torque
              </label>
              <span className="text-cyan-400 font-bold">{appliedTorqueNm.toFixed(2)} N·m</span>
            </div>
            <input
              id={torqueId}
              type="range"
              min="0"
              max="0.5"
              step="0.01"
              value={appliedTorqueNm}
              onChange={(e) => updateParam("appliedTorqueNm", parseFloat(e.target.value))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-neutral-800 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-neutral-800 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>0.0 N·m</span>
              <span>0.25 N·m (Standard)</span>
              <span>0.50 N·m (Forced)</span>
            </div>
          </div>
        </div>

        {/* Right: Live SI Telemetry HUD */}
        <div className="flex flex-col gap-3 justify-center">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Computed Telemetry & Shear Status
          </h4>
          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
              <span className="text-neutral-500 text-[10px] block uppercase">Shear Alignment</span>
              <span
                className={`text-sm font-bold ${
                  yaleState.isUnlocked ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {yaleState.isUnlocked ? "ALIGNED (CLEARED)" : "MISALIGNED"}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
              <span className="text-neutral-500 text-[10px] block uppercase">Max Shear Error</span>
              <span
                className={`text-sm font-bold ${
                  yaleState.maxShearErrorMm < 0.1 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {yaleState.maxShearErrorMm.toFixed(3)} mm
              </span>
            </div>
            <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
              <span className="text-neutral-500 text-[10px] block uppercase">
                Spring Restoration
              </span>
              <span className="text-sm font-bold text-amber-400">
                {yaleState.totalSpringForceN.toFixed(2)} N
              </span>
            </div>
            <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
              <span className="text-neutral-500 text-[10px] block uppercase">
                Deadbolt Extension
              </span>
              <span className="text-sm font-bold text-cyan-400">
                {yaleState.boltExtensionMm.toFixed(1)} mm {yaleState.isDeadlocked ? "(LOCKED)" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
