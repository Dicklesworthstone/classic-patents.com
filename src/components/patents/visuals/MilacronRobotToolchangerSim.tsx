"use client";

import { RotateCcw } from "lucide-react";
import { useMemo } from "react";
import { stepMilacronRobotToolchanger } from "@/physics/milacronRobotToolchangerKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

const PATENT_ID = "us-4512709-milacron-robot-toolchanger";

export function MilacronRobotToolchangerSim() {
  const { params, updateParam, resetParams } = usePatentPhysics(PATENT_ID);
  const state = useMemo(() => stepMilacronRobotToolchanger(params), [params]);
  const slide = state.lockingSlideFraction;
  const slideX = 270 + slide * 96;
  const baseY = state.toolBasePresent ? 220 - state.registrationFraction * 36 : 310;
  const tMemberVisible = state.toolBasePresent && state.registrationComplete;

  return (
    <section className="overflow-hidden rounded-2xl border border-cyan-800/50 bg-slate-950 text-slate-100 shadow-2xl">
      <header className="border-b border-cyan-900/70 bg-slate-900/80 px-4 py-3 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.16em] text-cyan-300">
          US 4,512,709 · REGISTRATION → ADMISSION → CAPTURE
        </p>
        <h3 className="mt-1 font-serif text-xl text-white">
          Milacron toolchanger engagement instrument
        </h3>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">
          Seat the common base on its locating pair, align the aperture, then shift the locking
          slide. This is a source-bound engagement topology: the grant gives no stroke, pressure,
          ramp angle, force, timing, or alignment tolerance.
        </p>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="min-w-0 border-b border-cyan-900/70 p-3 lg:border-b-0 lg:border-r sm:p-5">
          <svg
            viewBox="0 0 680 430"
            role="img"
            aria-label="Interactive source-bounded robot toolchanger engagement diagram"
            className="h-auto w-full rounded-xl border border-slate-700 bg-[radial-gradient(circle_at_50%_30%,_#164e63,_#020617_67%)]"
          >
            <defs>
              <pattern
                id="milacron-toolchanger-grid"
                width="28"
                height="28"
                patternUnits="userSpaceOnUse"
              >
                <path d="M28 0H0V28" fill="none" stroke="#164e63" strokeWidth="1" />
              </pattern>
              <marker
                id="milacron-toolchanger-arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto"
              >
                <path d="M0 0L10 5L0 10z" fill="#fbbf24" />
              </marker>
            </defs>
            <rect width="680" height="430" fill="url(#milacron-toolchanger-grid)" />
            <text x="24" y="30" fill="#a5f3fc" fontFamily="monospace" fontSize="12">
              NORMALIZED SOURCE TOPOLOGY · NOT A DIMENSIONED ADAPTER
            </text>

            <g transform="translate(95 68)">
              <rect
                x="105"
                y="34"
                width="310"
                height="168"
                rx="18"
                fill="#0f172a"
                stroke="#64748b"
                strokeWidth="5"
              />
              <rect
                x="123"
                y="52"
                width="274"
                height="132"
                rx="14"
                fill="#172554"
                stroke="#22d3ee"
                strokeWidth="2"
              />
              <circle cx="260" cy="118" r="48" fill="#020617" stroke="#67e8f9" strokeWidth="4" />
              <text
                x="260"
                y="124"
                textAnchor="middle"
                fill="#a5f3fc"
                fontFamily="monospace"
                fontSize="12"
              >
                OPENING 30
              </text>

              <path d="M112 78H408" stroke="#334155" strokeWidth="33" strokeLinecap="round" />
              <path d="M112 78H408" stroke="#475569" strokeWidth="4" strokeDasharray="8 8" />
              <g transform={`translate(${slideX - 270} 0)`}>
                <rect
                  x="215"
                  y="46"
                  width="92"
                  height="64"
                  rx="8"
                  fill="#0e7490"
                  stroke="#a5f3fc"
                  strokeWidth="3"
                />
                <rect
                  x="243"
                  y="62"
                  width="36"
                  height="32"
                  rx="3"
                  fill="#020617"
                  stroke="#f8fafc"
                  strokeWidth="2"
                />
                <path
                  d="M222 105L239 89M300 105L283 89"
                  stroke="#fbbf24"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <text
                  x="261"
                  y="38"
                  textAnchor="middle"
                  fill="#a5f3fc"
                  fontFamily="monospace"
                  fontSize="11"
                >
                  SLIDE 33
                </text>
              </g>

              <circle cx="206" cy="158" r="10" fill="#f59e0b" stroke="#fef3c7" strokeWidth="2" />
              <rect
                x="324"
                y="149"
                width="20"
                height="18"
                transform="rotate(45 334 158)"
                fill="#f59e0b"
                stroke="#fef3c7"
                strokeWidth="2"
              />
              <text x="190" y="184" fill="#fcd34d" fontFamily="monospace" fontSize="10">
                PIN 43
              </text>
              <text x="319" y="184" fill="#fcd34d" fontFamily="monospace" fontSize="10">
                PIN 44
              </text>
              <text
                x="260"
                y="222"
                textAnchor="middle"
                fill="#cbd5e1"
                fontFamily="monospace"
                fontSize="11"
              >
                ADAPTER 17 · FRONT PLATE 26
              </text>
            </g>

            {state.toolBasePresent && (
              <g transform={`translate(355 ${baseY})`}>
                <ellipse
                  cx="0"
                  cy="58"
                  rx="118"
                  ry="36"
                  fill="#713f12"
                  stroke="#fde68a"
                  strokeWidth="4"
                />
                <ellipse
                  cx="0"
                  cy="51"
                  rx="104"
                  ry="28"
                  fill="#a16207"
                  stroke="#fcd34d"
                  strokeWidth="2"
                />
                <circle cx="-55" cy="47" r="11" fill="#1e293b" stroke="#fef3c7" strokeWidth="3" />
                <rect
                  x="42"
                  y="36"
                  width="20"
                  height="20"
                  transform="rotate(45 52 46)"
                  fill="#1e293b"
                  stroke="#fef3c7"
                  strokeWidth="3"
                />
                {tMemberVisible && (
                  <g>
                    <rect
                      x="-12"
                      y="-17"
                      width="24"
                      height="54"
                      rx="4"
                      fill="#f43f5e"
                      stroke="#fecdd3"
                      strokeWidth="2"
                    />
                    <path d="M-56 -19H56V5H-56Z" fill="#e11d48" stroke="#fecdd3" strokeWidth="3" />
                    <path d="M-48 4L-28 -18M48 4L28 -18" stroke="#fbbf24" strokeWidth="4" />
                    <text
                      x="0"
                      y="-32"
                      textAnchor="middle"
                      fill="#fecdd3"
                      fontFamily="monospace"
                      fontSize="11"
                    >
                      T-MEMBER 35
                    </text>
                  </g>
                )}
                <text
                  x="0"
                  y="106"
                  textAnchor="middle"
                  fill="#fde68a"
                  fontFamily="monospace"
                  fontSize="12"
                >
                  COMMON TOOL BASE 18
                </text>
              </g>
            )}

            <path
              d="M594 82V166"
              stroke="#fbbf24"
              strokeWidth="3"
              markerEnd="url(#milacron-toolchanger-arrow)"
            />
            <text x="610" y="120" fill="#fde68a" fontFamily="monospace" fontSize="11">
              ACTUATOR 60
            </text>
            <text x="610" y="139" fill="#94a3b8" fontFamily="monospace" fontSize="10">
              state only
            </text>

            <g transform="translate(24 350)">
              <rect
                width="632"
                height="54"
                rx="10"
                fill="#020617"
                stroke={state.toolRetained ? "#34d399" : "#334155"}
                strokeWidth="2"
              />
              <text x="18" y="24" fill="#94a3b8" fontFamily="monospace" fontSize="11">
                ENGAGEMENT STATE
              </text>
              <text
                x="18"
                y="42"
                fill={state.claimFourRampCaptured ? "#6ee7b7" : "#fcd34d"}
                fontFamily="monospace"
                fontSize="16"
              >
                {state.phase.toUpperCase().replaceAll("-", " ")}
              </text>
              <text x="338" y="24" fill="#94a3b8" fontFamily="monospace" fontSize="11">
                SOURCE CONSTRAINT
              </text>
              <text x="338" y="42" fill="#fda4af" fontFamily="monospace" fontSize="12">
                NO FORCE / STROKE / TIME RESULT
              </text>
            </g>
          </svg>
          <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
            <div className="rounded-lg border border-cyan-800/70 bg-cyan-950/35 p-2.5">
              <span className="text-cyan-300">Registration</span>
              <span className="float-right font-mono">
                {state.registrationComplete ? "seated" : "not seated"}
              </span>
            </div>
            <div className="rounded-lg border border-amber-800/70 bg-amber-950/35 p-2.5">
              <span className="text-amber-300">Aperture</span>
              <span className="float-right font-mono">
                {state.apertureAligned ? "aligned" : "offset"}
              </span>
            </div>
            <div className="rounded-lg border border-emerald-800/70 bg-emerald-950/35 p-2.5">
              <span className="text-emerald-300">Claim 4</span>
              <span className="float-right font-mono">
                {state.claimFourRampCaptured ? "ramp captured" : "not selected"}
              </span>
            </div>
          </div>
        </div>

        <aside className="space-y-4 bg-slate-950/70 p-4">
          <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-slate-200">
            Tool base at adapter
            <input
              type="checkbox"
              checked={state.toolBasePresent}
              onChange={(event) => updateParam("toolBasePresent", event.target.checked ? 1 : 0)}
              className="h-5 w-5 accent-cyan-400"
            />
          </label>
          <label className="block text-sm text-slate-200">
            Pin / bushing registration{" "}
            <span className="float-right font-mono text-cyan-300">
              {Math.round((params.registrationFraction ?? 1) * 100)}%
            </span>
            <input
              className="mt-2 w-full accent-cyan-400"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={params.registrationFraction ?? 1}
              aria-label="Tool-base registration fraction"
              onChange={(event) => updateParam("registrationFraction", Number(event.target.value))}
            />
          </label>
          <label className="block text-sm text-slate-200">
            Locking-slide position{" "}
            <span className="float-right font-mono text-amber-300">
              {Math.round((params.lockingSlideFraction ?? 1) * 100)}%
            </span>
            <input
              className="mt-2 w-full accent-amber-400"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={params.lockingSlideFraction ?? 1}
              aria-label="Locking slide fraction"
              onChange={(event) => updateParam("lockingSlideFraction", Number(event.target.value))}
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-slate-200">
            Claim 4 T-member form
            <input
              type="checkbox"
              checked={(params.claimFourTMember ?? 1) >= 0.5}
              onChange={(event) => updateParam("claimFourTMember", event.target.checked ? 1 : 0)}
              className="h-5 w-5 accent-rose-400"
            />
          </label>
          <p className="rounded-lg border border-rose-900/70 bg-rose-950/35 p-3 text-xs leading-5 text-rose-100">
            {state.sourceBoundary.note}
          </p>
          <button
            type="button"
            onClick={resetParams}
            className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-900 px-3 text-sm text-slate-100 hover:bg-slate-800"
          >
            <RotateCcw className="h-4 w-4" />
            Reset source state
          </button>
        </aside>
      </div>
    </section>
  );
}
