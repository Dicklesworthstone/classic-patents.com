"use client";

import { Pause, Play, RotateCcw, Scissors, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { TextWithLatex } from "@/components/ui/LatexRenderer";
import { ensureHoweWasm, stepHoweTopology } from "@/physics/howeWasm";
import { stepHoweSewingMachine } from "@/physics/machineKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";
import { useOffscreenGate } from "./useOffscreenGate";

const NEEDLE_PIVOT_X = 225;
const NEEDLE_PIVOT_Y = 76;
const NEEDLE_EYE_LOCAL_X = 122;
const NEEDLE_EYE_LOCAL_Y = 136;
const SHUTTLE_THROW_PX = 105;

function rotatePoint(
  originX: number,
  originY: number,
  localX: number,
  localY: number,
  angleRad: number,
): { x: number; y: number } {
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  return {
    x: originX + localX * cos - localY * sin,
    y: originY + localX * sin + localY * cos,
  };
}

export function HoweSewingMachineSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-4750-howe-sewing-machine");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const [crankAngleDeg, setCrankAngleDeg] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { rootRef, onscreenRef } = useOffscreenGate<HTMLDivElement>();
  const sewingSpeedRpm = params.crankRpm ?? 240;
  const loopSlackPct = params.loopSlackPct ?? 65;
  const stitchPitchMm = params.stitchPitchMm ?? 3.5;
  const machine = stepHoweSewingMachine(sewingSpeedRpm, loopSlackPct, stitchPitchMm);
  const state = stepHoweTopology(crankAngleDeg, loopSlackPct, true);
  const needleEye = rotatePoint(
    NEEDLE_PIVOT_X,
    NEEDLE_PIVOT_Y,
    NEEDLE_EYE_LOCAL_X,
    NEEDLE_EYE_LOCAL_Y,
    state.needleArmAngleRad,
  );
  const shuttleX = 350 + state.shuttleTravelNormalized * SHUTTLE_THROW_PX;
  const loopRadius = state.loopOpen ? 10 + state.loopWidth * 0.45 : 4;

  useEffect(() => {
    void ensureHoweWasm();
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      if (!onscreenRef.current) return;
      setCrankAngleDeg(
        (previous) =>
          (previous + machine.crankOmegaDegPerS * machine.crankDisplayTickS) %
          machine.displayWrapDeg,
      );
    }, machine.crankDisplayTickMs);
    return () => clearInterval(interval);
  }, [
    isPlaying,
    machine.crankDisplayTickMs,
    machine.crankOmegaDegPerS,
    machine.crankDisplayTickS,
    machine.displayWrapDeg,
    onscreenRef,
  ]);

  return (
    <div
      ref={rootRef}
      className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Scissors className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50">
              Howe&apos;s Source-Order Lockstitch (US 4,750)
            </h3>
          </div>
          <p className="text-sm sm:text-base text-ink-700 dark:text-ink-300 mt-1">
            One shaft drives the curved needle, loop-lifting rod, shuttle pickers, and pinned
            baster-plate feed in the order printed by the 1846 grant.
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setIsPlaying((value) => !value);
              soundEngine.playSwitchClick();
            }}
            className={`p-2 rounded-lg transition-colors border shadow-sm ${
              isPlaying
                ? "bg-amber-600 text-white border-amber-700"
                : "bg-parchment-200 dark:bg-ink-800 text-ink-800 dark:text-parchment-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-300"
            }`}
            aria-label={isPlaying ? "Pause mechanism" : "Run mechanism"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            aria-label={isAudioMuted ? "Unmute sound" : "Mute sound"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              resetParams();
              setCrankAngleDeg(0);
              setIsPlaying(false);
              soundEngine.playSwitchClick();
            }}
            aria-label="Reset simulation"
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-2xl bg-canvas border border-parchment-300 dark:border-ink-800 p-3 sm:p-5 min-h-[390px] overflow-hidden">
          <svg
            viewBox="0 0 600 340"
            role="img"
            aria-label={`Howe sewing machine source-order mechanism, ${state.cyclePhaseLabel}, crank ${Math.round(crankAngleDeg)} degrees`}
            className="w-full h-auto"
          >
            <rect width="600" height="340" fill="#0f172a" />

            {/* A bed and B standards physically support both shafts and working parts. */}
            <rect x="38" y="284" width="520" height="24" rx="4" fill="#334155" />
            <rect x="83" y="72" width="28" height="212" fill="#334155" />
            <rect x="208" y="62" width="28" height="222" fill="#334155" />
            <rect x="82" y="60" width="155" height="20" fill="#475569" />
            <text x="44" y="324" fill="#94a3b8" fontSize="11" fontFamily="monospace">
              A BED · B STANDARDS
            </text>

            {/* C carries D/Q/R: flywheel and cams rotate as one rigid rotor. */}
            <g transform={`translate(99 92) rotate(${-state.crankAngleDeg})`}>
              <circle r="46" fill="none" stroke="#94a3b8" strokeWidth="7" />
              {[0, 60, 120].map((angle) => (
                <line
                  key={angle}
                  x1="-42"
                  x2="42"
                  y1="0"
                  y2="0"
                  transform={`rotate(${angle})`}
                  stroke="#64748b"
                  strokeWidth="4"
                />
              ))}
              <circle r="13" fill="#d97706" stroke="#fbbf24" strokeWidth="2" />
              <circle cx="31" cy="0" r="7" fill="#fbbf24" />
            </g>
            <line x1="99" y1="92" x2="225" y2="92" stroke="#cbd5e1" strokeWidth="7" />
            <circle cx="174" cy="92" r="24" fill="#b45309" stroke="#f59e0b" strokeWidth="3" />
            <text x="60" y="31" fill="#e2e8f0" fontSize="11" fontFamily="monospace">
              D FLYWHEEL · C SHAFT · Q/R CAMS
            </text>

            {/* O/G/P/k rock as one body; the curved needle is not independently translated. */}
            <g
              transform={`translate(${NEEDLE_PIVOT_X} ${NEEDLE_PIVOT_Y}) rotate(${(state.needleArmAngleRad * 180) / Math.PI})`}
            >
              <line x1="-47" y1="0" x2="126" y2="0" stroke="#64748b" strokeWidth="13" />
              <circle cx="-47" cy="0" r="7" fill="#e2e8f0" />
              <path
                d="M 112 0 Q 145 54 122 143"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle
                cx={NEEDLE_EYE_LOCAL_X}
                cy={NEEDLE_EYE_LOCAL_Y}
                r="4"
                fill="#0f172a"
                stroke="#fbbf24"
                strokeWidth="2"
              />
              <text x="43" y="-10" fill="#fbbf24" fontSize="10" fontFamily="monospace">
                G + CURVED NEEDLE
              </text>
            </g>
            <circle cx={NEEDLE_PIVOT_X} cy={NEEDLE_PIVOT_Y} r="9" fill="#d97706" />
            <text x="239" y="74" fill="#fbbf24" fontSize="10" fontFamily="monospace">
              O
            </text>

            {/* H is a vertical cloth-carrying plate with printed 3/4-inch point pitch. */}
            <g transform={`translate(${state.feedAdvanceFraction * 8} 0)`}>
              <rect x="270" y="128" width="236" height="112" fill="#475569" opacity="0.72" />
              <rect x="276" y="136" width="224" height="96" fill="#d6c7a2" opacity="0.9" />
              {Array.from({ length: 9 }, (_, index) => (
                <g key={index} transform={`translate(${291 + index * 25} 232)`}>
                  <path d="M 0 0 l 0 12" stroke="#e2e8f0" strokeWidth="2" />
                  <circle cx="0" cy="17" r="3" fill="none" stroke="#f59e0b" />
                </g>
              ))}
              <text x="390" y="151" fill="#0f172a" fontSize="10" fontFamily="monospace">
                H BASTER PLATE + CLOTH
              </text>
            </g>

            {/* I fixes the shuttle axis; J staves remain attached to both ends of K. */}
            <line x1="218" y1="264" x2="523" y2="264" stroke="#64748b" strokeWidth="12" />
            <line x1="218" y1="250" x2="523" y2="250" stroke="#334155" strokeWidth="4" />
            <line x1="190" y1="226" x2={shuttleX - 31} y2="255" stroke="#94a3b8" strokeWidth="5" />
            <line x1="548" y1="226" x2={shuttleX + 31} y2="255" stroke="#94a3b8" strokeWidth="5" />
            <g transform={`translate(${shuttleX} 255)`}>
              <path
                d="M -33 0 L -18 -10 L 23 -10 L 34 0 L 23 10 L -18 10 Z"
                fill="#d97706"
                stroke="#fbbf24"
                strokeWidth="2"
              />
              <ellipse rx="12" ry="6" fill="#2563eb" />
              <text x="-8" y="4" fill="white" fontSize="9" fontFamily="monospace">
                K
              </text>
            </g>
            <text x="226" y="280" fill="#94a3b8" fontSize="10" fontFamily="monospace">
              I TROUGH · J PICKER-STAVES
            </text>

            {/* W supplies the explicit slack loop; both thread paths remain tethered. */}
            <circle cx="150" cy="40" r="15" fill="#92400e" stroke="#d97706" strokeWidth="3" />
            <circle cx="270" cy={67 - state.liftingRodNormalized * 13} r="6" fill="#fbbf24" />
            <path
              d={`M 150 25 L 270 ${67 - state.liftingRodNormalized * 13} L ${needleEye.x} ${needleEye.y} Q ${needleEye.x + loopRadius} 242 ${needleEye.x} 242 Q ${needleEye.x - loopRadius} 242 ${needleEye.x} ${needleEye.y}`}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3"
            />
            <path
              d={`M ${shuttleX} 255 Q ${(shuttleX + needleEye.x) / 2} 241 ${needleEye.x} 242 L ${needleEye.x - 55} 242`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3"
            />
            <text x="278" y="56" fill="#fbbf24" fontSize="10" fontFamily="monospace">
              W LIFTING ROD
            </text>

            <g transform="translate(402 44)">
              <rect width="178" height="66" fill="#1e293b" rx="8" stroke="#475569" />
              <text x="10" y="18" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                SOURCE-ORDER PHASE
              </text>
              <text x="10" y="37" fill="#f59e0b" fontSize="11" fontFamily="monospace">
                {state.cyclePhaseLabel.toUpperCase()}
              </text>
              <text
                x="10"
                y="55"
                fill={state.shuttlePassesLoop ? "#34d399" : "#cbd5e1"}
                fontSize="10"
                fontFamily="monospace"
              >
                {state.shuttlePassesLoop ? "K PASSES THROUGH LOOP" : "INTERLOCK NOT AT PASS"}
              </text>
            </g>
          </svg>

          <div className="grid grid-cols-3 gap-2 text-center font-mono pt-3 border-t border-ink-800 text-ink-300">
            <div>
              <span className="text-ink-400 block text-[10px]">NEEDLE</span>
              <span className="text-amber-400 font-bold text-xs sm:text-sm">
                {state.needleRetracting ? "RETRACTING" : "PENETRATING"}
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-[10px]">SHUTTLE / LOOP</span>
              <span className="text-emerald-400 font-bold text-xs sm:text-sm">
                {state.shuttlePassesLoop ? "PASS" : "CLEAR"}
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-[10px]">LOOP SLACK</span>
              <span className="text-blue-400 font-bold text-xs sm:text-sm">{loopSlackPct}%</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/80 dark:bg-ink-900/70 p-5 space-y-5 shadow-sm">
            <span className="font-serif font-bold text-base sm:text-lg text-ink-950 dark:text-parchment-50 block">
              Mechanism controls
            </span>

            <label className="space-y-1.5 block">
              <span className="flex justify-between text-xs sm:text-sm font-mono">
                <TextWithLatex text="Main-shaft angle ($\\theta_C$)" />
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {Math.round(crankAngleDeg)}°
                </span>
              </span>
              <input
                type="range"
                aria-label="Main-shaft angle"
                min="0"
                max="359"
                step="1"
                value={crankAngleDeg}
                onChange={(event) => setCrankAngleDeg(Number(event.target.value))}
                className="w-full h-11 accent-amber-600 cursor-pointer"
              />
            </label>

            <label className="space-y-1.5 block">
              <span className="flex justify-between text-xs sm:text-sm font-mono">
                <span>Declared display cadence</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {sewingSpeedRpm} RPM
                </span>
              </span>
              <input
                type="range"
                aria-label="Declared display cadence"
                min="60"
                max="420"
                step="10"
                value={sewingSpeedRpm}
                onChange={(event) => updateParam("crankRpm", Number(event.target.value))}
                className="w-full h-11 accent-blue-600 cursor-pointer"
              />
            </label>

            <label className="space-y-1.5 block">
              <span className="flex justify-between text-xs sm:text-sm font-mono">
                <span>Displayed loop slack</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {loopSlackPct}%
                </span>
              </span>
              <input
                type="range"
                aria-label="Displayed loop slack"
                min="0"
                max="100"
                step="1"
                value={loopSlackPct}
                onChange={(event) => updateParam("loopSlackPct", Number(event.target.value))}
                className="w-full h-11 accent-emerald-600 cursor-pointer"
              />
            </label>

            <div
              className={`p-3.5 rounded-xl border text-xs sm:text-sm ${
                machine.claim1InterlockPossible
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-red-500/10 border-red-500/30"
              }`}
            >
              <span className="font-bold block font-mono text-xs uppercase tracking-wider mb-1">
                Claim 1 topology
              </span>
              {machine.claim1InterlockPossible
                ? "The displayed loop clears the shuttle section, so the source-order interlock can occur during the pass phase."
                : "Refused: the displayed loop does not clear the shuttle section. The model will not report a lockstitch pass."}
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm">
              The 1846 grant prints the needle eye at about <strong>1/8 inch</strong> from the point
              and the baster points about <strong>3/4 inch</strong> apart. Cadence, pitch, and loop
              slack are declared display inputs—not historical operating measurements.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
