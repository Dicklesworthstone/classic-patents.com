"use client";

import { RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { stepRobotEndEffector } from "@/physics/robotEndEffectorKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

const PATENT_ID = "us-4765668-robot-end-effector";
const CENTER_X = 340;
const DISPLAY_METRES_TO_PX = 1200;

export function RobotEndEffectorSim() {
  const { params, updateParam, resetParams } = usePatentPhysics(PATENT_ID);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const state = useMemo(() => stepRobotEndEffector(params), [params]);
  const offset = state.perHandOffsetM * DISPLAY_METRES_TO_PX;
  const leftX = CENTER_X - offset;
  const rightX = CENTER_X + offset;
  const fingersPresent = state.fingerRetainedFraction > 0.03;

  return (
    <section className="overflow-hidden rounded-2xl border border-cyan-800/50 bg-slate-950 text-slate-100 shadow-2xl">
      <header className="border-b border-cyan-900/70 bg-slate-900/80 px-4 py-3 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.16em] text-cyan-300">
          US 4,765,668 · OPPOSED-THREAD KINEMATICS
        </p>
        <h3 className="mt-1 font-serif text-xl text-white">
          The fixed gripping midpoint instrument
        </h3>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">
          One screw moves the two hands equally and oppositely: live gap and encoder values come
          from the printed 5 mm lead, typical 6-inch opening, stated gear diameters, and eight
          encoder pegs. The frame drawing is explanatory rather than a dimensioned reconstruction.
        </p>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="min-w-0 border-b border-cyan-900/70 p-3 lg:border-b-0 lg:border-r sm:p-5">
          <svg
            viewBox="0 0 680 430"
            role="img"
            aria-label="Interactive double-handed robot end effector showing symmetric ball-screw motion"
            className="h-auto w-full rounded-xl border border-slate-700 bg-[radial-gradient(circle_at_center,_#172554,_#020617_72%)]"
          >
            <defs>
              <pattern id="end-effector-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#1e3a5f" strokeWidth="1" />
              </pattern>
              <linearGradient id="end-effector-screw" x1="0" x2="1">
                <stop offset="0" stopColor="#64748b" />
                <stop offset="0.45" stopColor="#e2e8f0" />
                <stop offset="1" stopColor="#64748b" />
              </linearGradient>
            </defs>
            <rect width="680" height="430" fill="url(#end-effector-grid)" />
            <text x="20" y="28" fill="#67e8f9" fontSize="12" fontFamily="monospace">
              FIG. 3 TEACHING PROJECTION · TWO OPPOSED THREAD HANDS
            </text>
            <text x="20" y="406" fill="#94a3b8" fontSize="10" fontFamily="monospace">
              source-bound displacement; illustrative rail and finger dimensions
            </text>

            <rect
              x="105"
              y="154"
              width="470"
              height="122"
              rx="14"
              fill="#0f172a"
              stroke="#475569"
              strokeWidth="3"
            />
            <rect x="105" y="206" width="470" height="18" rx="7" fill="#334155" stroke="#64748b" />
            <text
              x="340"
              y="198"
              textAnchor="middle"
              fill="#bae6fd"
              fontFamily="monospace"
              fontSize="11"
            >
              CENTRAL WEB 28 · IDEAL MIDPOINT
            </text>
            <line
              x1="340"
              x2="340"
              y1="86"
              y2="346"
              stroke="#34d399"
              strokeWidth="2"
              strokeDasharray="5 5"
            />
            <text x="347" y="99" fill="#6ee7b7" fontFamily="monospace" fontSize="11">
              m = 0
            </text>

            {[176, 254].map((y, index) => (
              <g key={y}>
                <rect
                  x="138"
                  y={y - 5}
                  width="404"
                  height="10"
                  rx="5"
                  fill="url(#end-effector-screw)"
                />
                {Array.from({ length: 17 }, (_, thread) => (
                  <line
                    key={thread}
                    x1={157 + thread * 22}
                    y1={y - 9}
                    x2={169 + thread * 22}
                    y2={y + 9}
                    stroke="#0f172a"
                    strokeWidth="2"
                  />
                ))}
                <text x="116" y={y + 4} fill="#cbd5e1" fontFamily="monospace" fontSize="10">
                  {index === 0 ? "UPPER" : "LOWER"}
                </text>
              </g>
            ))}

            {[
              { y: 176, label: "14 / 16" },
              { y: 254, label: "18 / 20" },
            ].map(({ y, label }) => (
              <g key={y}>
                <g transform={`translate(${leftX} ${y})`}>
                  <rect
                    x="-24"
                    y="-28"
                    width="48"
                    height="56"
                    rx="7"
                    fill="#0e7490"
                    stroke="#67e8f9"
                    strokeWidth="2"
                  />
                  <path
                    d="M -26 -18 L -42 -10 L -42 10 L -26 18"
                    fill="none"
                    stroke="#67e8f9"
                    strokeWidth="4"
                  />
                  {fingersPresent && (
                    <path
                      d="M -42 -8 L -61 -34 L -61 35 L -42 8"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="7"
                      strokeLinejoin="round"
                    />
                  )}
                </g>
                <g transform={`translate(${rightX} ${y})`}>
                  <rect
                    x="-24"
                    y="-28"
                    width="48"
                    height="56"
                    rx="7"
                    fill="#0e7490"
                    stroke="#67e8f9"
                    strokeWidth="2"
                  />
                  <path
                    d="M 26 -18 L 42 -10 L 42 10 L 26 18"
                    fill="none"
                    stroke="#67e8f9"
                    strokeWidth="4"
                  />
                  {fingersPresent && (
                    <path
                      d="M 42 -8 L 61 -34 L 61 35 L 42 8"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="7"
                      strokeLinejoin="round"
                    />
                  )}
                </g>
                <text
                  x="340"
                  y={y + 5}
                  textAnchor="middle"
                  fill="#f8fafc"
                  fontFamily="monospace"
                  fontSize="10"
                >
                  {label}
                </text>
              </g>
            ))}

            <line x1={leftX} x2={rightX} y1="326" y2="326" stroke="#fbbf24" strokeWidth="2" />
            <path
              d={`M ${leftX} 326 l 8 -5 v 10 z M ${rightX} 326 l -8 -5 v 10 z`}
              fill="#fbbf24"
            />
            <text
              x="340"
              y="344"
              textAnchor="middle"
              fill="#fde68a"
              fontFamily="monospace"
              fontSize="12"
            >
              g = {(state.jawOpeningM * 1000).toFixed(1)} mm
            </text>

            <g transform="translate(587 214)">
              <circle r="30" fill="#92400e" stroke="#fbbf24" strokeWidth="3" />
              {Array.from({ length: 8 }, (_, peg) => {
                const angle = (peg * Math.PI * 2) / 8 + state.encoderCountModulo * (Math.PI / 4);
                return (
                  <circle
                    key={peg}
                    cx={Math.cos(angle) * 23}
                    cy={Math.sin(angle) * 23}
                    r="3.5"
                    fill="#67e8f9"
                  />
                );
              })}
              <rect x="-7" y="-47" width="14" height="12" rx="2" fill="#22d3ee" />
              <text
                x="0"
                y="53"
                textAnchor="middle"
                fill="#bae6fd"
                fontFamily="monospace"
                fontSize="10"
              >
                8 COUNT
              </text>
            </g>
          </svg>
        </div>

        <aside className="space-y-4 p-4 sm:p-5">
          <div className="rounded-xl border border-cyan-800/70 bg-cyan-950/30 p-3">
            <p className="font-mono text-[10px] tracking-[0.14em] text-cyan-300">LIVE KINEMATICS</p>
            <dl className="mt-2 space-y-1.5 text-xs">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-400">Screw turns</dt>
                <dd className="font-mono text-slate-100">
                  {state.screwRevolutions.toFixed(2)} rev
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-400">Per-hand offset</dt>
                <dd className="font-mono text-slate-100">
                  {(state.perHandOffsetM * 1000).toFixed(1)} mm
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-400">Encoder phase</dt>
                <dd className="font-mono text-slate-100">
                  {state.encoderCountModulo.toFixed(2)} / 8
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-400">Reported repeatability</dt>
                <dd className="font-mono text-emerald-300">0.05 mm</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-xl border border-amber-800/70 bg-amber-950/30 p-3 text-xs leading-5 text-amber-100">
            Grip is a bounded source-labelled setpoint, not calculated contact force. The grant does
            not give the workpiece, finger dimensions, friction, air-flow/pressure transfer, or
            connector stroke.
          </div>
        </aside>
      </div>

      <footer className="grid gap-3 border-t border-cyan-900/70 bg-slate-900/75 p-4 sm:grid-cols-2 lg:grid-cols-5 sm:p-5">
        <label className="text-xs text-slate-200 lg:col-span-2">
          Jaw opening{" "}
          <span className="float-right font-mono text-cyan-300">
            {((params.jawOpeningFraction ?? 0.52) * 100).toFixed(0)}%
          </span>
          <input
            className="mt-1.5 w-full accent-cyan-400"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={params.jawOpeningFraction ?? 0.52}
            aria-label="Jaw opening"
            onChange={(event) => updateParam("jawOpeningFraction", Number(event.target.value))}
          />
        </label>
        <label className="text-xs text-slate-200">
          Requested grip command{" "}
          <span className="float-right font-mono text-amber-300">
            {(params.gripForceSetpointN ?? 900).toFixed(0)} N
          </span>
          <input
            className="mt-1.5 w-full accent-amber-400"
            type="range"
            min="0"
            max="2000"
            step="25"
            value={params.gripForceSetpointN ?? 900}
            aria-label="Requested grip command bounded by source maximum"
            onChange={(event) => updateParam("gripForceSetpointN", Number(event.target.value))}
          />
        </label>
        <label className="text-xs text-slate-200">
          Frame rotation{" "}
          <span className="float-right font-mono text-violet-300">
            {(params.frameRotationDeg ?? 0).toFixed(0)}°
          </span>
          <input
            className="mt-1.5 w-full accent-violet-400"
            type="range"
            min="-180"
            max="180"
            step="1"
            value={params.frameRotationDeg ?? 0}
            aria-label="Frame rotation"
            onChange={(event) => updateParam("frameRotationDeg", Number(event.target.value))}
          />
        </label>
        <div className="flex items-end">
          <button
            type="button"
            onClick={resetParams}
            className="min-h-10 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 text-xs text-slate-100 hover:bg-slate-700"
          >
            <RotateCcw className="mr-1.5 inline h-3.5 w-3.5" />
            Reset source controls
          </button>
        </div>

        <div className="col-span-full pt-2 border-t border-slate-800">
          <ClaimConstraintToggle
            patentId={PATENT_ID}
            claimStates={claimStates}
            onClaimStateChange={(num, active) =>
              setClaimStates((prev) => ({ ...prev, [num]: active }))
            }
          />
        </div>
      </footer>
    </section>
  );
}
