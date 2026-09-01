"use client";

import { RotateCcw } from "lucide-react";
import { stepDevolProgrammedTransfer } from "@/physics/devolProgrammedTransferKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

const PATENT_ID = "us-2988237-devol-programmed-transfer";

export function DevolProgrammedTransferSim() {
  const { params, updateParam, resetParams } = usePatentPhysics(PATENT_ID);
  const state = stepDevolProgrammedTransfer(params);
  const codeText = (bits: readonly boolean[]) => bits.map((bit) => (bit ? "1" : "0")).join("");

  return (
    <section className="overflow-hidden rounded-2xl border border-indigo-800/60 bg-slate-950 text-slate-100 shadow-2xl">
      <header className="border-b border-indigo-800/60 bg-slate-900/80 px-4 py-3 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.16em] text-indigo-300">
          US 2,988,237 · PROGRAMMED ARTICLE TRANSFER
        </p>
        <h3 className="mt-1 font-serif text-xl text-white">
          Code coincidence and anticipator instrument
        </h3>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">
          A museum-scale reading of the patent’s program drum, moving encoder, coincidence
          comparison, and gripper command. Slots are codes, not reconstructed machine distances or
          velocities.
        </p>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 border-b border-indigo-800/60 p-4 lg:border-b-0 lg:border-r sm:p-6">
          <svg
            viewBox="0 0 680 390"
            role="img"
            aria-label="Programmed article transfer code coincidence diagram"
            className="h-auto w-full rounded-xl border border-slate-700 bg-[radial-gradient(circle_at_center,_#172554,_#020617_70%)]"
          >
            <text x="28" y="32" fill="#a5b4fc" fontFamily="monospace" fontSize="12">
              MAGNETIC PROGRAM DRUM → COINCIDENCE DETECTORS → TRANSFER HEAD
            </text>
            <rect
              x="58"
              y="88"
              width="168"
              height="128"
              rx="18"
              fill="#312e81"
              stroke="#818cf8"
              strokeWidth="3"
            />
            <text
              x="142"
              y="121"
              textAnchor="middle"
              fill="#e0e7ff"
              fontSize="14"
              fontFamily="monospace"
            >
              PROGRAM DRUM 40
            </text>
            <text
              x="142"
              y="153"
              textAnchor="middle"
              fill="#c7d2fe"
              fontSize="27"
              fontFamily="monospace"
            >
              {codeText(state.recordedCode)}
            </text>
            <text
              x="142"
              y="186"
              textAnchor="middle"
              fill="#a5b4fc"
              fontSize="11"
              fontFamily="monospace"
            >
              recorded slot {state.recordedSlot}
            </text>

            <path
              d="M 230 152 H 326"
              stroke="#818cf8"
              strokeWidth="4"
              markerEnd="url(#devol-arrow)"
            />
            <rect
              x="332"
              y="88"
              width="146"
              height="128"
              rx="18"
              fill="#1e3a5f"
              stroke="#38bdf8"
              strokeWidth="3"
            />
            <text
              x="405"
              y="121"
              textAnchor="middle"
              fill="#e0f2fe"
              fontSize="13"
              fontFamily="monospace"
            >
              MATCH BANK
            </text>
            <text
              x="405"
              y="155"
              textAnchor="middle"
              fill={state.coincidence ? "#86efac" : "#fcd34d"}
              fontSize="28"
              fontFamily="monospace"
            >
              {state.matchingBits}/{state.bitWidth}
            </text>
            <text
              x="405"
              y="185"
              textAnchor="middle"
              fill="#bae6fd"
              fontSize="11"
              fontFamily="monospace"
            >
              {state.coincidence ? "true coincidence" : `${state.hammingDistance} bit difference`}
            </text>
            <path
              d="M 482 152 H 554"
              stroke="#38bdf8"
              strokeWidth="4"
              markerEnd="url(#devol-arrow)"
            />
            <rect
              x="558"
              y="76"
              width="82"
              height="162"
              rx="12"
              fill="#172554"
              stroke="#67e8f9"
              strokeWidth="3"
            />
            <rect
              x="575"
              y="113"
              width="48"
              height="42"
              rx="5"
              fill="#0f172a"
              stroke="#fbbf24"
              strokeWidth="2"
            />
            <path d="M 599 155 v48" stroke="#fbbf24" strokeWidth="5" />
            <path d="M 582 204 h34" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" />
            <text
              x="599"
              y="60"
              textAnchor="middle"
              fill="#e0f2fe"
              fontSize="11"
              fontFamily="monospace"
            >
              HEAD 10a
            </text>

            <rect x="66" y="276" width="548" height="64" rx="9" fill="#0f172a" stroke="#475569" />
            <text x="86" y="302" fill="#cbd5e1" fontFamily="monospace" fontSize="12">
              ENCODER 50
            </text>
            {state.sensedCode.map((bit, index) => (
              <g key={index}>
                <rect
                  x={220 + index * 48}
                  y="288"
                  width="32"
                  height="32"
                  rx="4"
                  fill={bit ? "#22d3ee" : "#1e293b"}
                  stroke={state.recordedCode[index] === bit ? "#86efac" : "#fb7185"}
                  strokeWidth="2"
                />
                <text
                  x={236 + index * 48}
                  y="310"
                  textAnchor="middle"
                  fill={bit ? "#082f49" : "#94a3b8"}
                  fontSize="12"
                  fontFamily="monospace"
                >
                  {bit ? "1" : "0"}
                </text>
              </g>
            ))}
            <text
              x="338"
              y="370"
              textAnchor="middle"
              fill="#fda4af"
              fontSize="10"
              fontFamily="monospace"
            >
              {state.refusal.reason}
            </text>
            <defs>
              <marker
                id="devol-arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#a5b4fc" />
              </marker>
            </defs>
          </svg>
        </div>

        <aside className="space-y-4 p-4 text-sm sm:p-5">
          <div className="rounded-xl border border-indigo-700/60 bg-indigo-950/50 p-3">
            <p className="font-mono text-[10px] tracking-[0.14em] text-indigo-300">STATE</p>
            <p className="mt-1 font-medium text-white">
              {state.traversalMode.replaceAll("-", " ")}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-300">
              {state.programPhase} · gripper {state.gripperState}
            </p>
          </div>
          <label className="block text-xs text-slate-200">
            Recorded drum slot{" "}
            <span className="float-right font-mono text-indigo-300">{state.recordedSlot}</span>
            <input
              className="mt-1 w-full accent-indigo-400"
              type="range"
              min="0"
              max={2 ** state.bitWidth - 1}
              value={state.recordedSlot}
              onChange={(event) => updateParam("recordedSlot", Number(event.target.value))}
            />
          </label>
          <label className="block text-xs text-slate-200">
            Sensed encoder slot{" "}
            <span className="float-right font-mono text-cyan-300">{state.sensedSlot}</span>
            <input
              className="mt-1 w-full accent-cyan-400"
              type="range"
              min="0"
              max={2 ** state.bitWidth - 1}
              value={state.sensedSlot}
              onChange={(event) => updateParam("sensedSlot", Number(event.target.value))}
            />
          </label>
          <label className="flex items-center justify-between gap-2 text-xs text-slate-200">
            Anticipator (Claims 2–4, 8, 19)
            <input
              type="checkbox"
              checked={
                state.traversalMode !== "fast-seek" || (params.anticipationEnabled ?? 1) >= 0.5
              }
              onChange={(event) => updateParam("anticipationEnabled", Number(event.target.checked))}
            />
          </label>
          <label className="flex items-center justify-between gap-2 text-xs text-slate-200">
            Record a sequence (Claims 5, 11, 18, 23, 26, 28)
            <input
              type="checkbox"
              checked={(params.recordingMode ?? 0) >= 0.5}
              onChange={(event) => updateParam("recordingMode", Number(event.target.checked))}
            />
          </label>
          <label className="flex items-center justify-between gap-2 text-xs text-slate-200">
            Article gripper
            <input
              type="checkbox"
              checked={(params.gripperClosed ?? 0) >= 0.5}
              onChange={(event) => updateParam("gripperClosed", Number(event.target.checked))}
            />
          </label>
          <button
            type="button"
            onClick={resetParams}
            className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-slate-600 bg-slate-900 px-3 text-xs text-slate-100 hover:bg-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </aside>
      </div>
    </section>
  );
}
