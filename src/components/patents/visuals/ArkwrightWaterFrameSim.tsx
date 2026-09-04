"use client";

import { Cog, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useId } from "react";
import {
  ARKWRIGHT_DEFAULT_CONTROLS,
  ARKWRIGHT_FRANKENSIM_BOUNDARY,
  ARKWRIGHT_KERNEL_SOURCE,
  ARKWRIGHT_SOURCE_BOUNDARY,
  ARKWRIGHT_ZERO_PHASES,
  getArkwrightTapeFrame,
  stepArkwrightWaterFrame,
} from "@/physics/arkwrightKernel";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";

const EXHIBIT_ID = "gb-931-arkwright-water-frame";

export function ArkwrightWaterFrameSim() {
  const { params, updateParam, resetParams } = usePatentPhysics(EXHIBIT_ID);
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const waterWheelRpm = params.waterWheelRpm ?? ARKWRIGHT_DEFAULT_CONTROLS.waterWheelRpm;
  const totalDraftRatio = params.totalDraftRatio ?? ARKWRIGHT_DEFAULT_CONTROLS.totalDraftRatio;
  const rollerClampingWeightKg =
    params.rollerClampingWeightKg ?? ARKWRIGHT_DEFAULT_CONTROLS.rollerClampingWeightKg;
  const stapleLengthMm = params.stapleLengthMm ?? ARKWRIGHT_DEFAULT_CONTROLS.stapleLengthMm;
  const inputRovingCountNe =
    params.inputRovingCountNe ?? ARKWRIGHT_DEFAULT_CONTROLS.inputRovingCountNe;
  const isRunning = (params.isRunning ?? 1) > 0.5;
  const controls = {
    waterWheelRpm,
    totalDraftRatio,
    rollerClampingWeightKg,
    stapleLengthMm,
    inputRovingCountNe,
  };
  const { frame } = useFrankenSimPhysics(EXHIBIT_ID, {
    domain: "continuum_elasticity",
    refusal: { isRefused: true, reason: ARKWRIGHT_SOURCE_BOUNDARY },
  });

  const speedId = useId();
  const draftId = useId();
  const weightId = useId();
  const stapleId = useId();

  const tape = getArkwrightTapeFrame();
  const outputs = tape?.outputs ?? stepArkwrightWaterFrame(controls);
  const phases = tape?.phases ?? ARKWRIGHT_ZERO_PHASES;

  const wheelRpm = waterWheelRpm;
  const draftRatio = totalDraftRatio;

  // Roller angles: feed is slow, intermediate faster, front is fastest
  const feedRollerAngle = phases.feedRollerRad;
  const intermediateOneAngle = phases.intermediateRollerOneRad;
  const intermediateTwoAngle = phases.intermediateRollerTwoRad;
  const deliveryRollerAngle = phases.deliveryRollerRad;
  const flyerAngle = phases.spindleRad;
  const wheelAngle = phases.wheelRad;

  // Heart-cam vertical oscillation [-18px, +18px]
  const traversePhase = phases.traverseRad;
  // Cardioid / triangular continuous lift
  const traverseOffset = Math.sin(traversePhase) * 18;

  return (
    <div
      className="w-full bg-parchment-50 dark:bg-ink-900/95 border border-parchment-300 dark:border-ink-800 rounded-2xl p-4 sm:p-6 text-ink-900 dark:text-parchment-200 shadow-md backdrop-blur-xl transition-colors"
      data-arkwright-face="two"
      data-arkwright-runtime-tick={frame.tick}
      data-arkwright-runtime-provenance={frame.provenance}
      data-arkwright-kernel-source={ARKWRIGHT_KERNEL_SOURCE}
      data-arkwright-frankensim-boundary={ARKWRIGHT_FRANKENSIM_BOUNDARY}
      data-arkwright-running={isRunning}
      data-arkwright-wheel-phase-rad={phases.wheelRad}
      data-arkwright-feed-phase-rad={phases.feedRollerRad}
      data-arkwright-intermediate-one-phase-rad={phases.intermediateRollerOneRad}
      data-arkwright-intermediate-two-phase-rad={phases.intermediateRollerTwoRad}
      data-arkwright-delivery-phase-rad={phases.deliveryRollerRad}
      data-arkwright-spindle-layshaft-phase-rad={phases.spindleLayshaftRad}
      data-arkwright-spindle-phase-rad={phases.spindleRad}
      data-arkwright-traverse-phase-rad={phases.traverseRad}
    >
      {/* Header & Mode Badge */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-parchment-200 dark:border-ink-800">
        <div>
          <div className="flex items-center gap-2">
            <Cog className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-xl font-bold font-serif text-ink-950 dark:text-parchment-100">
              Richard Arkwright Water Frame Spinning Simulator (GB 931)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-1">
            Differential roller drafting (draw zones), weighted top-roller clamping, and high-speed
            flyer twisting.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end lg:self-auto">
          <div className="flex items-center gap-1.5 bg-parchment-200 dark:bg-ink-950/80 p-1.5 rounded-xl border border-parchment-300 dark:border-ink-800 text-xs">
            <button
              type="button"
              onClick={() => {
                updateParam("totalDraftRatio", 6.0);
                updateParam("rollerClampingWeightKg", 3.5);
                soundEngine.playSwitchClick();
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                (controls.totalDraftRatio ?? 6.0) >= 4.0
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-stone-200"
              }`}
            >
              Nominal Teaching Scenario
            </button>
            <button
              type="button"
              onClick={() => {
                updateParam("totalDraftRatio", 3);
                updateParam("rollerClampingWeightKg", 1);
                soundEngine.playSwitchClick();
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                (controls.totalDraftRatio ?? 6.0) < 4.0
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-stone-200"
              }`}
            >
              Low-Draft Comparison
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              updateParam("isRunning", isRunning ? 0 : 1);
              soundEngine.playSwitchClick();
            }}
            aria-label={isRunning ? "Pause Motion" : "Resume Motion"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
            title={isRunning ? "Pause Motion" : "Resume Motion"}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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
              updateParam("resetEpoch", (params.resetEpoch ?? 0) + 1);
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

      {/* Main Grid: Visual Simulation & Technical Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* SVG Kinematic Diagram & Live Organ Render */}
        <div className="lg:col-span-7 bg-stone-950/80 rounded-xl p-4 border border-stone-800/80 flex flex-col items-center justify-center min-h-[420px] relative overflow-hidden">
          <svg
            viewBox="0 0 600 480"
            role="img"
            aria-label={`Arkwright water frame simulation: water wheel driving the spinning frame at ${Math.round(waterWheelRpm)} rpm, drawing roving through a total draft ratio of ${totalDraftRatio.toFixed(1)} to 1`}
            className="w-full h-full max-h-[440px]"
          >
            <defs>
              <linearGradient id="woodPost" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#78350f" />
                <stop offset="50%" stopColor="#92400e" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
              <linearGradient id="brassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fde68a" />
                <stop offset="50%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
              <linearGradient id="leatherGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#d4a373" />
                <stop offset="100%" stopColor="#a97142" />
              </linearGradient>
              <linearGradient id="steelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="50%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
            </defs>

            {/* Timber Frame Posts */}
            <rect x="40" y="30" width="22" height="420" fill="url(#woodPost)" rx="2" />
            <rect x="538" y="30" width="22" height="420" fill="url(#woodPost)" rx="2" />
            <rect x="40" y="430" width="520" height="25" fill="url(#woodPost)" rx="3" />
            <rect x="40" y="30" width="520" height="20" fill="url(#woodPost)" rx="3" />
            <rect x="40" y="145" width="520" height="15" fill="url(#woodPost)" />
            <rect x="40" y="350" width="520" height="15" fill="url(#woodPost)" />

            {/* Supply Creel Bobbin (Top Supply) */}
            <g transform="translate(180, 75)">
              <rect x="-15" y="-20" width="30" height="35" fill="#ca8a04" rx="3" />
              <line x1="0" y1="-25" x2="0" y2="20" stroke="#f8fafc" strokeWidth="2" />
              {/* Soft carded roving passing down to Pair 1 */}
              <line
                x1="0"
                y1="15"
                x2="0"
                y2="60"
                stroke="#fef08a"
                strokeWidth="4.5"
                opacity="0.85"
              />
            </g>

            {/* Differential Drafting Roller Cascade (Station at x=180, y=145) */}
            <g transform="translate(180, 145)">
              {/* Pair 1: Feed Rollers (Slow Speed) */}
              <g transform="translate(-60, 0)">
                {/* Lower Fluted Brass Roller */}
                <circle cx="0" cy="12" r="10" fill="url(#brassGrad)" />
                <line
                  x1="0"
                  y1="12"
                  x2={10 * Math.cos(feedRollerAngle)}
                  y2={12 + 10 * Math.sin(feedRollerAngle)}
                  stroke="#451a03"
                  strokeWidth="1.5"
                />
                {/* Upper Leather Roller */}
                <circle cx="0" cy="-10" r="10" fill="url(#leatherGrad)" />
                <line
                  x1="0"
                  y1="-10"
                  x2={10 * Math.cos(-feedRollerAngle)}
                  y2={-10 + 10 * Math.sin(-feedRollerAngle)}
                  stroke="#451a03"
                  strokeWidth="1.5"
                />
                {/* Weighted Saddle (D) */}
                <line x1="0" y1="-10" x2="0" y2="45" stroke="#475569" strokeWidth="2" />
                <rect x="-6" y="45" width="12" height="16" fill="#334155" rx="2" />
              </g>

              {/* Attenuating Roving between Pair 1 and Pair 4 */}
              <line
                x1="-60"
                y1="1"
                x2="60"
                y2="1"
                stroke="#fef08a"
                strokeWidth={Math.max(1.5, 4.5 / (draftRatio * 0.5))}
              />

              {/* Pair 2: Intermediate Slow */}
              <g transform="translate(-20, 0)">
                <circle cx="0" cy="12" r="10" fill="url(#brassGrad)" />
                <line
                  x1="0"
                  y1="12"
                  x2={10 * Math.cos(intermediateOneAngle)}
                  y2={12 + 10 * Math.sin(intermediateOneAngle)}
                  stroke="#451a03"
                  strokeWidth="1.5"
                />
                <circle cx="0" cy="-10" r="10" fill="url(#leatherGrad)" />
                <line
                  x1="0"
                  y1="-10"
                  x2={10 * Math.cos(-intermediateOneAngle)}
                  y2={-10 + 10 * Math.sin(-intermediateOneAngle)}
                  stroke="#451a03"
                  strokeWidth="1.5"
                />
              </g>

              {/* Pair 3: Intermediate Fast */}
              <g transform="translate(20, 0)">
                <circle cx="0" cy="12" r="10" fill="url(#brassGrad)" />
                <line
                  x1="0"
                  y1="12"
                  x2={10 * Math.cos(intermediateTwoAngle)}
                  y2={12 + 10 * Math.sin(intermediateTwoAngle)}
                  stroke="#451a03"
                  strokeWidth="1.5"
                />
                <circle cx="0" cy="-10" r="10" fill="url(#leatherGrad)" />
                <line
                  x1="0"
                  y1="-10"
                  x2={10 * Math.cos(-intermediateTwoAngle)}
                  y2={-10 + 10 * Math.sin(-intermediateTwoAngle)}
                  stroke="#451a03"
                  strokeWidth="1.5"
                />
              </g>

              {/* Pair 4: Front Delivery Rollers (High Speed v4 = D * v1) */}
              <g transform="translate(60, 0)">
                <circle cx="0" cy="12" r="10" fill="url(#brassGrad)" />
                <line
                  x1="0"
                  y1="12"
                  x2={10 * Math.cos(deliveryRollerAngle)}
                  y2={12 + 10 * Math.sin(deliveryRollerAngle)}
                  stroke="#451a03"
                  strokeWidth="1.5"
                />
                <circle cx="0" cy="-10" r="10" fill="url(#leatherGrad)" />
                <line
                  x1="0"
                  y1="-10"
                  x2={10 * Math.cos(-deliveryRollerAngle)}
                  y2={-10 + 10 * Math.sin(-deliveryRollerAngle)}
                  stroke="#451a03"
                  strokeWidth="1.5"
                />
                <line x1="0" y1="-10" x2="0" y2="45" stroke="#475569" strokeWidth="2" />
                <rect x="-6" y="45" width="12" height="16" fill="#334155" rx="2" />
              </g>
            </g>

            {/* Spindle & Flyer Assembly (x=240, y=240) */}
            <g transform="translate(240, 260)">
              {/* Vertical Steel Spindle Shaft */}
              <line x1="0" y1="-60" x2="0" y2="140" stroke="url(#steelGrad)" strokeWidth="3.5" />

              {/* High-Speed Flyer (E) */}
              <g transform={`rotate(${((flyerAngle * 180) / Math.PI) % 360})`}>
                <path
                  d="M 0 -60 C -32 -30, -32 40, -32 55"
                  fill="none"
                  stroke="url(#steelGrad)"
                  strokeWidth="3"
                />
                <path
                  d="M 0 -60 C 32 -30, 32 40, 32 55"
                  fill="none"
                  stroke="url(#steelGrad)"
                  strokeWidth="3"
                />
                <circle cx="-32" cy="55" r="3" fill="#cbd5e1" />
                <circle cx="32" cy="55" r="3" fill="#cbd5e1" />
              </g>

              {/* Traversing Bobbin (F) oscillating with heart-cam */}
              <g transform={`translate(0, ${traverseOffset})`}>
                {/* Bobbin Flanges & Core */}
                <rect x="-16" y="10" width="32" height="40" fill="#78350f" rx="3" />
                <ellipse cx="0" cy="10" rx="18" ry="5" fill="#b45309" />
                <ellipse cx="0" cy="50" rx="18" ry="5" fill="#b45309" />
                {/* Wound Yarn Package */}
                <rect x="-13" y="14" width="26" height="32" fill="#d97706" rx="2" />
                {/* Drag cord friction band */}
                <line
                  x1="-18"
                  y1="50"
                  x2="50"
                  y2="52"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeDasharray="3,2"
                />
              </g>

              {/* Spindle Whorl (Pulley) at base */}
              <ellipse cx="0" cy="105" rx="15" ry="5" fill="url(#brassGrad)" />
              {/* Driving belt to drum */}
              <line
                x1="-15"
                y1="105"
                x2="160"
                y2="125"
                stroke="#ca8a04"
                strokeWidth="2"
                strokeDasharray="4,2"
              />
              <line
                x1="15"
                y1="105"
                x2="160"
                y2="127"
                stroke="#ca8a04"
                strokeWidth="2"
                strokeDasharray="4,2"
              />

              {/* Live Yarn Thread path from delivery roller -> flyer neck -> guide eye -> bobbin */}
              <path
                d={`M 0 -115 L 0 -60 L 32 55 L 13 ${30 + traverseOffset}`}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.8"
              />
            </g>

            {/* Central Driving Drum (A) on right */}
            <g transform="translate(420, 380)">
              <circle cx="0" cy="0" r="48" fill="url(#woodPost)" stroke="#451a03" strokeWidth="3" />
              <circle cx="0" cy="0" r="10" fill="#475569" />
              <line
                x1="0"
                y1="0"
                x2={42 * Math.cos(wheelAngle)}
                y2={42 * Math.sin(wheelAngle)}
                stroke="#d6b27a"
                strokeWidth="4"
              />
            </g>

            {/* Heart-Cam & Traverse Mechanism (G) */}
            <g transform="translate(420, 240)">
              {/* Cardioid cam rotating slowly */}
              <g transform={`rotate(${((traversePhase * 180) / Math.PI) % 360})`}>
                <path
                  d="M 0 -20 C 18 -30, 28 -8, 0 28 C -28 -8, -18 -30, 0 -20 Z"
                  fill="#475569"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                />
              </g>
              {/* Cam follower lever connected to traverse rail */}
              <line
                x1="0"
                y1="12"
                x2="-180"
                y2={65 + traverseOffset}
                stroke="#cbd5e1"
                strokeWidth="3"
              />
              <circle cx="0" cy="12" r="5" fill="#f59e0b" />
            </g>

            {/* Callouts Overlaid */}
            <g transform="translate(180, 145)">
              <circle cx="0" cy="-28" r="10" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
              <text
                x="0"
                y="-24"
                fontSize="10"
                fontWeight="bold"
                fill="#78350f"
                textAnchor="middle"
              >
                C
              </text>
            </g>
            <g transform="translate(240, 200)">
              <circle cx="-38" cy="0" r="10" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
              <text
                x="-38"
                y="4"
                fontSize="10"
                fontWeight="bold"
                fill="#78350f"
                textAnchor="middle"
              >
                E
              </text>
            </g>
            <g transform="translate(240, 290)">
              <circle cx="32" cy="0" r="10" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
              <text x="32" y="4" fontSize="10" fontWeight="bold" fill="#78350f" textAnchor="middle">
                F
              </text>
            </g>
            <g transform="translate(420, 380)">
              <circle cx="0" cy="-30" r="10" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
              <text
                x="0"
                y="-26"
                fontSize="10"
                fontWeight="bold"
                fill="#78350f"
                textAnchor="middle"
              >
                A
              </text>
            </g>
            <g transform="translate(420, 240)">
              <circle cx="32" cy="0" r="10" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
              <text x="32" y="4" fontSize="10" fontWeight="bold" fill="#78350f" textAnchor="middle">
                G
              </text>
            </g>
          </svg>

          {/* Declared comparison-threshold badge */}
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <span
              className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border ${
                outputs.isWarpGradeWaterTwist
                  ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/50"
                  : "bg-rose-950/80 text-rose-300 border-rose-500/50"
              }`}
            >
              {outputs.isWarpGradeWaterTwist
                ? "SCENARIO ≥ 1.8 N COMPARISON THRESHOLD"
                : "SCENARIO < 1.8 N COMPARISON THRESHOLD"}
            </span>
          </div>
        </div>

        {/* Live Controls & Telemetry Column */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* SI Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800">
              <span className="text-[11px] font-mono text-stone-400 block">
                Flyer Spindle Speed
              </span>
              <span className="text-lg font-mono font-bold text-cyan-400">
                {Math.round(outputs.flyerSpindleRpm).toLocaleString()} RPM
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5">
                {outputs.spindleOmegaRadPerSec.toFixed(0)} rad/s continuous
              </span>
            </div>

            <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800">
              <span className="text-[11px] font-mono text-stone-400 block">
                Yarn Count (English Ne)
              </span>
              <span className="text-lg font-mono font-bold text-amber-400">
                {outputs.outputYarnCountNe.toFixed(1)} Ne
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5">
                {outputs.yarnLinearDensityTex.toFixed(1)} Tex (g/1000m)
              </span>
            </div>

            <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800">
              <span className="text-[11px] font-mono text-stone-400 block">
                Imparted Twist (TPM)
              </span>
              <span className="text-lg font-mono font-bold text-indigo-400">
                {Math.round(outputs.twistTurnsPerMeter).toLocaleString()} TPM
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5">
                {outputs.twistTurnsPerInch.toFixed(1)} TPI (TM {outputs.twistMultiplier.toFixed(1)})
              </span>
            </div>

            <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800">
              <span className="text-[11px] font-mono text-stone-400 block">
                Scenario Break Load
              </span>
              <span
                className={`text-lg font-mono font-bold ${
                  outputs.isWarpGradeWaterTwist ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {outputs.yarnBreakingForceN.toFixed(2)} N
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5">
                {outputs.yarnTenacityCnPerTex.toFixed(1)} cN/tex
              </span>
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="bg-stone-950/70 p-4 rounded-xl border border-stone-800 space-y-3.5">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <label htmlFor={speedId} className="text-stone-300">
                  Water Wheel Speed
                </label>
                <span className="text-amber-400 font-bold">{wheelRpm} RPM</span>
              </div>
              <input
                id={speedId}
                type="range"
                min="60"
                max="260"
                step="10"
                value={wheelRpm}
                onChange={(e) => updateParam("waterWheelRpm", Number(e.target.value))}
                className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <label htmlFor={draftId} className="text-stone-300">
                  Differential Draft Ratio (D = v4 / v1)
                </label>
                <span className="text-cyan-400 font-bold">{draftRatio.toFixed(1)}×</span>
              </div>
              <input
                id={draftId}
                type="range"
                min="3.0"
                max="10.0"
                step="0.5"
                value={draftRatio}
                onChange={(e) => updateParam("totalDraftRatio", Number(e.target.value))}
                className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <label htmlFor={weightId} className="text-stone-300">
                  Roller Clamping Weight (Lead Saddles)
                </label>
                <span className="text-emerald-400 font-bold">
                  {(controls.rollerClampingWeightKg ?? 3.5).toFixed(1)} kg
                </span>
              </div>
              <input
                id={weightId}
                type="range"
                min="1.0"
                max="6.0"
                step="0.5"
                value={controls.rollerClampingWeightKg ?? 3.5}
                onChange={(e) => updateParam("rollerClampingWeightKg", Number(e.target.value))}
                className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <label htmlFor={stapleId} className="text-stone-300">
                  Cotton Staple Fiber Length
                </label>
                <span className="text-purple-400 font-bold">
                  {controls.stapleLengthMm ?? 28} mm
                </span>
              </div>
              <input
                id={stapleId}
                type="range"
                min="20"
                max="38"
                step="1"
                value={controls.stapleLengthMm ?? 28}
                onChange={(e) => updateParam("stapleLengthMm", Number(e.target.value))}
                className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
          </div>

          {/* Explicitly scaled teaching-scenario output */}
          <div className="bg-stone-950/90 p-3 rounded-xl border border-amber-500/20 text-xs flex items-center justify-between">
            <div>
              <span className="text-stone-400 block text-[10px] font-mono">
                SCALED SCENARIO OUTPUT (96 lanes × 12 h)
              </span>
              <span className="text-amber-300 font-bold font-mono text-sm">
                {outputs.millProductionKgPerDay.toFixed(1)} kg / 12 h
              </span>
            </div>
            <span className="px-2 py-1 bg-amber-500/10 text-amber-300 rounded font-mono text-[10px] border border-amber-500/30">
              Declared inputs
            </span>
          </div>

          <p className="rounded-xl border border-amber-500/25 bg-amber-950/10 px-3 py-2 text-xs leading-relaxed text-stone-300">
            <strong className="text-stone-100">Source boundary.</strong> {ARKWRIGHT_SOURCE_BOUNDARY}
          </p>
        </div>
      </div>
    </div>
  );
}
