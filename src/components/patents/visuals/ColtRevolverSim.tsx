"use client";

import { Activity, Disc, Layers, RotateCcw, Target, Volume2, VolumeX } from "lucide-react";
import { useCallback, useState } from "react";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import { COLT_SOURCE_BOUNDARY, stepColtLockwork } from "@/physics/coltRevolverKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";

type DiagramTab = "sequence" | "cylinder" | "dual";

function stageLabel(stage: ReturnType<typeof stepColtLockwork>["stage"]): string {
  return stage.replaceAll("-", " ");
}

export function ColtRevolverSim() {
  const { params, effectiveParams, claimStates, claimConstraintResult, updateParam, resetParams } =
    usePatentPhysics("us-x9430-colt-revolver");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const [activeDiagramTab, setActiveDiagramTab] = useState<DiagramTab>("dual");
  const lockwork = stepColtLockwork(effectiveParams);
  const cylinderRotationDeg = (lockwork.cylinderIndexAngleRad * 180) / Math.PI;
  const ratchetRotationDeg = (lockwork.ratchetIndexAngleRad * 180) / Math.PI;

  const handleCockHammer = useCallback(() => {
    updateParam("cockingTravelPct", 100);
    soundEngine.playMicroswitchClick();
  }, [updateParam]);

  const handleReleaseHammer = useCallback(() => {
    if (!lockwork.safeToReleaseHammer) return;
    updateParam("chamberIndex", lockwork.alignedChamberIndex);
    updateParam("cockingTravelPct", 0);
    soundEngine.playLockstitchClack();
  }, [lockwork, updateParam]);

  const handleReset = useCallback(() => {
    resetParams();
    updateParam("chamberIndex", 1);
    soundEngine.playSwitchClick();
  }, [resetParams, updateParam]);

  return (
    <div className="space-y-5 rounded-2xl border border-parchment-300 bg-parchment-50 p-4 shadow-patent dark:border-ink-800 dark:bg-ink-950 sm:p-6">
      <header className="flex flex-col gap-3 border-b border-parchment-200 pb-4 dark:border-ink-800 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-amber-600 dark:text-amber-500" />
            <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100 sm:text-xl">
              Colt Locking-and-Turning Sequence (US X9430)
            </h3>
          </div>
          <p className="mt-1 max-w-3xl text-xs text-ink-600 dark:text-ink-400">
            Scrub the source-described order: pin p withdraws key r, lifter d advances ratchet tooth
            s through the shackle, and spring m seats the key in the succeeding ward.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(["dual", "sequence", "cylinder"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveDiagramTab(tab)}
              className={`min-h-9 rounded-lg border px-2.5 py-1 text-xs font-mono transition-colors ${
                activeDiagramTab === tab
                  ? "border-amber-500 bg-amber-600 font-bold text-white"
                  : "border-parchment-300 text-ink-700 dark:border-ink-700 dark:text-parchment-200"
              }`}
            >
              {tab === "dual" ? "Dual View" : tab === "sequence" ? "Lockwork" : "Cylinder Face"}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            aria-label={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="rounded-lg border border-parchment-300 p-2 text-ink-700 dark:border-ink-700 dark:text-parchment-200"
          >
            {isAudioMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={handleReset}
            aria-label="Reset lockwork"
            className="rounded-lg border border-parchment-300 p-2 text-ink-700 dark:border-ink-700 dark:text-parchment-200"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 p-4">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:20px_20px] opacity-35" />
        <div className="relative z-10 flex flex-col items-center justify-center gap-5 md:flex-row">
          {(activeDiagramTab === "sequence" || activeDiagramTab === "dual") && (
            <div className="w-full flex-1">
              <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold font-mono text-amber-400">
                <Layers className="h-3.5 w-3.5" />
                SOURCE-ORDERED LOCKWORK
              </div>
              <svg
                viewBox="0 0 600 300"
                role="img"
                aria-label={`Colt lockwork: ${stageLabel(lockwork.stage)}, key ${
                  lockwork.keySeated ? "seated" : "withdrawn"
                }, cylinder ${(lockwork.cylinderAdvanceFraction * 100).toFixed(0)} percent through one display step`}
                className="h-auto w-full"
              >
                <line x1="78" y1="135" x2="385" y2="135" stroke="#94a3b8" strokeWidth="5" />
                <text x="260" y="151" fill="#94a3b8" fontSize="9" textAnchor="middle">
                  arbor g — one connected axis
                </text>

                <rect
                  x="330"
                  y="70"
                  width="230"
                  height="45"
                  rx="4"
                  fill="#1e3a8a"
                  stroke="#60a5fa"
                  strokeWidth="2"
                />
                <line x1="330" y1="92.5" x2="560" y2="92.5" stroke="#0ea5e9" strokeWidth="8" />
                <text x="445" y="63" fill="#93c5fd" fontSize="10" textAnchor="middle">
                  fixed barrel / chamber alignment axis
                </text>

                <rect
                  x="200"
                  y="50"
                  width="130"
                  height="170"
                  rx="8"
                  fill="#26384c"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                />
                <rect x="205" y="78" width="120" height="28" fill="#08111f" stroke="#f59e0b" />
                <rect
                  x="205"
                  y="164"
                  width="120"
                  height="28"
                  fill="#08111f"
                  stroke="#64748b"
                  strokeDasharray="4 3"
                />
                <text x="265" y="43" fill="#fbbf24" fontSize="10" textAnchor="middle">
                  revolving cylinder
                </text>

                <g transform={`translate(190 135) rotate(${ratchetRotationDeg})`}>
                  <circle r="23" fill="#334155" stroke="#f59e0b" strokeWidth="2" />
                  {[0, 1, 2, 3, 4].map((tooth) => (
                    <line
                      key={tooth}
                      x1="0"
                      y1="-20"
                      x2="0"
                      y2="-31"
                      stroke="#fbbf24"
                      strokeWidth="6"
                      transform={`rotate(${tooth * 72})`}
                    />
                  ))}
                </g>
                <text x="190" y="174" fill="#fbbf24" fontSize="9" textAnchor="middle">
                  ratchet e / tooth s
                </text>

                {lockwork.controls.claim5ShacklePresent && (
                  <g>
                    <line x1="195" y1="135" x2="218" y2="135" stroke="#34d399" strokeWidth="8" />
                    <text x="205" y="123" fill="#6ee7b7" fontSize="8" textAnchor="middle">
                      shackle
                    </text>
                  </g>
                )}

                <g transform={`translate(125 140) rotate(${-lockwork.displayHammerAngleDeg})`}>
                  <path
                    d="M 0 0 L -18 -45 L 7 -78 L 22 -72 L 12 -35 Z"
                    fill="#475569"
                    stroke="#e2e8f0"
                    strokeWidth="2"
                  />
                  <circle cx="8" cy="-20" r="4" fill="#f8fafc" />
                  <text x="-48" y="-83" fill="#cbd5e1" fontSize="9">
                    hammer / pin p
                  </text>
                </g>

                <line
                  x1={142 - lockwork.lifterStroke01 * 4}
                  y1={119 - lockwork.lifterStroke01 * 8}
                  x2={169}
                  y2={126 - lockwork.lifterStroke01 * 11}
                  stroke={lockwork.lifterEngaged ? "#f59e0b" : "#64748b"}
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <circle cx="142" cy="119" r="4" fill="#f8fafc" />
                <text x="137" y="101" fill="#fbbf24" fontSize="9" textAnchor="middle">
                  lifter d
                </text>

                {lockwork.controls.claim6LockingAndTurningPresent && (
                  <g transform={`translate(260 ${211 + lockwork.keyRetraction01 * 18})`}>
                    <rect
                      x="-9"
                      y="-5"
                      width="18"
                      height="22"
                      rx="2"
                      fill={lockwork.keySeated ? "#10b981" : "#f59e0b"}
                      stroke="#f8fafc"
                    />
                    <text
                      x="18"
                      y="10"
                      fill={lockwork.keySeated ? "#6ee7b7" : "#fbbf24"}
                      fontSize="9"
                    >
                      spring key r
                    </text>
                  </g>
                )}

                <line x1="125" y1="150" x2="150" y2="218" stroke="#a78bfa" strokeWidth="4" />
                <rect
                  x="145"
                  y="215"
                  width="12"
                  height={8 + lockwork.cockingProgress01 * 20}
                  fill="#a78bfa"
                />
                <text x="110" y="263" fill="#c4b5fd" fontSize="9">
                  connecting rod → trigger
                </text>

                <text x="20" y="287" fill="#94a3b8" fontSize="9">
                  Normalized display geometry; US X9430 prints event order, not force, timing,
                  angle, or ballistics.
                </text>
              </svg>
            </div>
          )}

          {(activeDiagramTab === "cylinder" || activeDiagramTab === "dual") && (
            <div className="w-full max-w-[285px] rounded-xl border border-slate-700 bg-slate-900/80 p-3">
              <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold font-mono text-amber-400">
                <Disc className="h-3.5 w-3.5" />
                FIVE-WARD DISPLAY FROM SOURCE DRAWING
              </div>
              <svg
                viewBox="0 0 240 240"
                role="img"
                aria-label={`Cylinder display rotated ${Math.abs(cylinderRotationDeg).toFixed(1)} degrees; source does not state chamber count as a claim dimension`}
                className="mx-auto h-56 w-56 max-w-full"
              >
                <polygon points="120,4 126,20 114,20" fill="#f59e0b" />
                <text x="120" y="31" fill="#fbbf24" fontSize="8" textAnchor="middle">
                  BARREL AXIS
                </text>
                <g transform={`translate(120 126) rotate(${cylinderRotationDeg})`}>
                  <circle r="84" fill="#26384c" stroke="#cbd5e1" strokeWidth="3" />
                  {lockwork.controls.claim2PartitionsPresent &&
                    [0, 1, 2, 3, 4].map((index) => (
                      <line
                        key={`partition-${index}`}
                        x1="0"
                        y1="-27"
                        x2="0"
                        y2="-80"
                        stroke="#94a3b8"
                        strokeWidth="4"
                        transform={`rotate(${index * 72 + 36})`}
                      />
                    ))}
                  {[0, 1, 2, 3, 4].map((index) => {
                    const radians = (index * 72 * Math.PI) / 180;
                    const x = Math.sin(radians) * 53;
                    const y = -Math.cos(radians) * 53;
                    return (
                      <g key={`ward-${index}`} transform={`translate(${x} ${y})`}>
                        <circle r="18" fill="#07101d" stroke="#38bdf8" strokeWidth="2" />
                        {lockwork.controls.claim1CapsPresent && (
                          <circle r="6" fill="#d97706" stroke="#fbbf24" />
                        )}
                        <text x="0" y="4" fill="#f8fafc" fontSize="9" textAnchor="middle">
                          {index + 1}
                        </text>
                      </g>
                    );
                  })}
                  <circle r="13" fill="#475569" stroke="#cbd5e1" />
                </g>
              </svg>
              <p className="text-[10px] leading-relaxed text-slate-400">
                The five-way geometry is traced from the facsimile drawing. The specification says
                “next chamber” and does not publish N, pitch, caliber, or a pressure card.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {[
          ["stage", stageLabel(lockwork.stage)],
          ["key r", lockwork.keySeated ? "seated" : "withdrawn"],
          ["ratchet", `${(lockwork.ratchetAdvanceFraction * 100).toFixed(0)}% step`],
          ["cylinder", `${(lockwork.cylinderAdvanceFraction * 100).toFixed(0)}% step`],
          ["ward", `${lockwork.alignedChamberIndex} of 5 display`],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg border border-parchment-300 bg-white/70 p-2 dark:border-ink-700 dark:bg-ink-900/70"
          >
            <div className="text-[9px] uppercase tracking-wide text-ink-500 dark:text-ink-400">
              {label}
            </div>
            <div className="text-xs font-bold font-mono text-ink-900 dark:text-parchment-100">
              {value}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 rounded-xl border border-parchment-300 bg-parchment-100/90 p-4 dark:border-ink-800 dark:bg-ink-900/90">
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={handleCockHammer}
            className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold font-mono text-white transition-[background-color,transform] hover:bg-amber-700 active:scale-98"
          >
            <Activity className="h-4 w-4" />
            Complete Cocking Sequence
          </button>
          <button
            type="button"
            onClick={handleReleaseHammer}
            disabled={!lockwork.safeToReleaseHammer}
            className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-parchment-400 bg-parchment-200 px-4 py-2.5 text-xs font-bold font-mono text-ink-800 disabled:cursor-not-allowed disabled:opacity-40 dark:border-ink-700 dark:bg-ink-800 dark:text-parchment-200"
          >
            <Target className="h-4 w-4" />
            Release Hammer (No Ballistics Model)
          </button>
        </div>

        <SensitivitySlider
          id="us-x9430-colt-revolver-sim-cockingtravel"
          patentId="us-x9430-colt-revolver"
          paramKey="cockingTravelPct"
          label="Normalized Cocking Travel"
          value={lockwork.controls.cockingTravelPct}
          min={0}
          max={100}
          step={1}
          unit="% display"
          onChange={(value) => updateParam("cockingTravelPct", value)}
          allParams={params}
        />

        <ClaimConstraintToggle
          patentId="us-x9430-colt-revolver"
          claimStates={claimStates}
          onToggleClaim={(claimNumber, active) =>
            updateParam(claimConstraintStateParamId(claimNumber), active ? 1 : 0)
          }
        />

        {claimConstraintResult.refusalWarning && (
          <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-2 text-xs text-rose-900 dark:text-rose-200">
            {claimConstraintResult.refusalWarning}
          </p>
        )}

        <p
          className="border-t border-parchment-300 pt-3 text-[11px] leading-relaxed text-ink-600 dark:border-ink-700 dark:text-ink-400"
          title={COLT_SOURCE_BOUNDARY}
        >
          Typed source host: connected kinematic order only. FrankenSim ratchet/contact dynamics and
          all ballistics are refused until the source-independent physical input card exists.
        </p>
      </div>
    </div>
  );
}
