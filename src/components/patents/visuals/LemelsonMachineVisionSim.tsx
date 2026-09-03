"use client";

import { RotateCcw } from "lucide-react";
import { useId, useMemo } from "react";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import {
  type LemelsonMachineVisionControls,
  stepLemelsonMachineVisionTopology,
} from "@/physics/lemelsonMachineVisionKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

const PATENT_ID = "us-3081379-lemelson-machine-vision";

const CONTROL_COPY: readonly {
  readonly id: keyof LemelsonMachineVisionControls;
  readonly label: string;
  readonly explanation: string;
}[] = [
  {
    id: "scanPathEnabled",
    label: "Electron-beam scan path",
    explanation: "Shows whether the claimed image-field scan path is available.",
  },
  {
    id: "synchronizedGateEnabled",
    label: "Synchronized programming gate",
    explanation: "Shows the time-related gate named by Claim 1, without a pulse-width model.",
  },
  {
    id: "analyzingCircuitEnabled",
    label: "Analyzing circuit",
    explanation: "Shows whether the selected picture-signal path reaches analysis.",
  },
  {
    id: "inspectionSignalPresent",
    label: "Picture signal present",
    explanation: "A normalized signal-presence state, not an amplitude or noise measurement.",
  },
  {
    id: "referenceSignalMatches",
    label: "Reference comparison",
    explanation:
      "Shows the logical relation of a test and reference signal; it does not label a part pass or reject.",
  },
];

function stateColor(active: boolean): string {
  return active ? "#34d399" : "#475569";
}

function stateLabel(active: boolean, activeLabel: string): string {
  return active ? activeLabel : "WITHHELD";
}

export function LemelsonMachineVisionSim() {
  const arrowId = useId();
  const { effectiveParams, claimStates, claimConstraintResult, updateParam, resetParams } =
    usePatentPhysics(PATENT_ID);
  const state = useMemo(
    () => stepLemelsonMachineVisionTopology(effectiveParams),
    [effectiveParams],
  );
  const comparisonLabel =
    state.referenceComparison === "match"
      ? "MATCH"
      : state.referenceComparison === "difference"
        ? "DIFFERENCE"
        : "WITHHELD";

  return (
    <section className="overflow-hidden rounded-2xl border border-cyan-800/60 bg-slate-950 text-slate-100 shadow-2xl">
      <header className="border-b border-cyan-900/70 bg-slate-900/80 px-4 py-3 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.16em] text-cyan-300">
          US 3,081,379 · CLAIM 1 SIGNAL-PATH TOPOLOGY
        </p>
        <h3 className="mt-1 font-serif text-xl text-white">
          Lemelson scan, gate, and analysis exhibit
        </h3>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">
          The grant describes a scan path, a programmed gate, and an analyzing circuit that receives
          only the selected portion of a picture signal. This is a normalized signal topology: it
          deliberately makes no claim about beam velocity, optical response, signal scale, timing,
          force, or actuator response.
        </p>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 border-b border-cyan-900/70 p-3 lg:border-b-0 lg:border-r sm:p-5">
          <svg
            viewBox="0 0 760 430"
            role="img"
            aria-label="Normalized Claim 1 topology showing image-field scan, synchronized signal gate, analyzing circuit, reference comparison, and control output"
            className="h-auto w-full rounded-xl border border-slate-700 bg-[radial-gradient(circle_at_28%_18%,_#12365b,_#020617_68%)]"
          >
            <defs>
              <pattern
                id="lemelson-signal-grid"
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#173b5d" strokeWidth="1" />
              </pattern>
              <marker
                id={arrowId}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#67e8f9" />
              </marker>
            </defs>
            <rect width="760" height="430" fill="url(#lemelson-signal-grid)" />
            <text x="24" y="31" fill="#67e8f9" fontSize="12" fontFamily="monospace">
              FIGS. 1 / 3 · NORMALIZED VIDEO-SIGNAL RELATIONSHIP
            </text>
            <text x="24" y="411" fill="#fda4af" fontSize="10" fontFamily="monospace">
              source topology only — no recovered distance, rate, amplitude, force, or response time
            </text>

            <g transform="translate(38 83)">
              <rect
                width="184"
                height="132"
                rx="10"
                fill="#0f172a"
                stroke="#38bdf8"
                strokeWidth="2"
              />
              <text x="16" y="25" fill="#7dd3fc" fontSize="12" fontFamily="monospace">
                IMAGE FIELD
              </text>
              <rect x="18" y="42" width="148" height="62" rx="5" fill="#082f49" stroke="#0e7490" />
              <path
                d="M 35 57 H 149 M 35 73 H 149 M 35 89 H 149"
                fill="none"
                stroke={stateColor(state.scanPathActive)}
                strokeWidth="3"
                strokeDasharray="10 6"
              />
              <text
                x="18"
                y="121"
                fill={stateColor(state.scanPathActive)}
                fontSize="10"
                fontFamily="monospace"
              >
                {stateLabel(state.scanPathActive, "SCAN PATH ACTIVE")}
              </text>
            </g>

            <line
              x1="224"
              y1="149"
              x2="300"
              y2="149"
              stroke={stateColor(state.inspectionSignalPresent)}
              strokeWidth="4"
              markerEnd={`url(#${arrowId})`}
            />
            <text x="236" y="136" fill="#cbd5e1" fontSize="10" fontFamily="monospace">
              picture signal
            </text>

            <g transform="translate(304 96)">
              <rect
                width="154"
                height="106"
                rx="10"
                fill="#0f172a"
                stroke={stateColor(state.synchronizedGateActive)}
                strokeWidth="2"
              />
              <path
                d="M 28 72 V 46 H 63 V 72 H 99 V 46 H 126"
                fill="none"
                stroke={stateColor(state.synchronizedGateActive)}
                strokeWidth="4"
              />
              <text x="14" y="24" fill="#c4b5fd" fontSize="11" fontFamily="monospace">
                PROGRAMMING GATE
              </text>
              <text
                x="14"
                y="94"
                fill={stateColor(state.gatedPictureSignal)}
                fontSize="10"
                fontFamily="monospace"
              >
                {stateLabel(state.gatedPictureSignal, "SELECTED SIGNAL")}
              </text>
            </g>

            <line
              x1="460"
              y1="149"
              x2="536"
              y2="149"
              stroke={stateColor(state.gatedPictureSignal)}
              strokeWidth="4"
              markerEnd={`url(#${arrowId})`}
            />
            <g transform="translate(540 96)">
              <rect
                width="170"
                height="106"
                rx="10"
                fill="#0f172a"
                stroke={stateColor(state.analyzingCircuitActive)}
                strokeWidth="2"
              />
              <circle cx="48" cy="57" r="21" fill="#172554" stroke="#a78bfa" strokeWidth="2" />
              <path d="M 39 58 L 46 65 L 61 46" fill="none" stroke="#c4b5fd" strokeWidth="3" />
              <text x="82" y="54" fill="#e9d5ff" fontSize="11" fontFamily="monospace">
                ANALYZING
              </text>
              <text x="82" y="70" fill="#e9d5ff" fontSize="11" fontFamily="monospace">
                CIRCUIT
              </text>
              <text
                x="16"
                y="94"
                fill={stateColor(state.analyzingCircuitActive)}
                fontSize="10"
                fontFamily="monospace"
              >
                {stateLabel(state.analyzingCircuitActive, "ANALYSIS AVAILABLE")}
              </text>
            </g>

            <g transform="translate(95 268)">
              <rect
                width="191"
                height="88"
                rx="10"
                fill="#0f172a"
                stroke="#fbbf24"
                strokeWidth="2"
              />
              <text x="16" y="25" fill="#fde68a" fontSize="11" fontFamily="monospace">
                REFERENCE SIGNAL
              </text>
              <path
                d="M 18 51 H 60 L 74 39 L 88 62 L 105 44 L 121 55 L 137 48 L 168 48"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2"
              />
              <text x="16" y="76" fill="#cbd5e1" fontSize="10" fontFamily="monospace">
                comparison: {comparisonLabel}
              </text>
            </g>
            <line
              x1="286"
              y1="312"
              x2="538"
              y2="312"
              stroke={stateColor(state.inspectionSignalPresent)}
              strokeWidth="3"
              strokeDasharray="7 5"
              markerEnd={`url(#${arrowId})`}
            />
            <text x="340" y="300" fill="#cbd5e1" fontSize="10" fontFamily="monospace">
              logical comparison only
            </text>
            <g transform="translate(542 265)">
              <rect
                width="168"
                height="94"
                rx="10"
                fill="#0f172a"
                stroke={stateColor(state.controlOutputReady)}
                strokeWidth="2"
              />
              <path
                d="M 21 61 H 72 M 72 61 L 103 43 M 72 61 L 103 79"
                stroke="#cbd5e1"
                strokeWidth="3"
              />
              <circle cx="116" cy="43" r="9" fill={stateColor(state.controlOutputReady)} />
              <circle cx="116" cy="79" r="9" fill="#475569" />
              <text x="17" y="25" fill="#99f6e4" fontSize="11" fontFamily="monospace">
                CONTROL PATH
              </text>
              <text
                x="17"
                y="85"
                fill={stateColor(state.controlOutputReady)}
                fontSize="10"
                fontFamily="monospace"
              >
                {stateLabel(state.controlOutputReady, "READY")}
              </text>
            </g>

            <text x="304" y="237" fill="#e2e8f0" fontSize="13" fontFamily="monospace">
              S ∧ G ∧ A ∧ I → C
            </text>
            <text x="304" y="253" fill="#94a3b8" fontSize="9" fontFamily="monospace">
              scan · gate · analysis · picture signal → control path
            </text>
          </svg>

          <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
            <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-2">
              <p className="font-mono text-cyan-300">PICTURE SIGNAL</p>
              <p className="mt-1 text-slate-200">
                {stateLabel(state.gatedPictureSignal, "SELECTED")}
              </p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-2">
              <p className="font-mono text-purple-300">ANALYZER</p>
              <p className="mt-1 text-slate-200">
                {stateLabel(state.analyzingCircuitActive, "INSPECTING")}
              </p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-2">
              <p className="font-mono text-amber-300">COMPARISON</p>
              <p className="mt-1 text-slate-200">{comparisonLabel}</p>
            </div>
          </div>
        </div>

        <form className="space-y-4 p-4 sm:p-5" onSubmit={(event) => event.preventDefault()}>
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Normalized source states
            </h4>
            <p className="mt-1 text-[11px] leading-4 text-slate-400">
              These switches alter logical availability only. They are not engineering setpoints.
            </p>
          </div>
          <div className="space-y-2">
            {CONTROL_COPY.map((control) => {
              const checked = state.controls[control.id] >= 0.5;
              return (
                <label
                  key={control.id}
                  className="flex cursor-pointer items-start gap-2 rounded-lg border border-slate-700 bg-slate-900/60 p-2.5 text-xs"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    className="mt-0.5 h-4 w-4 accent-cyan-400"
                    onChange={(event) => updateParam(control.id, event.target.checked ? 1 : 0)}
                  />
                  <span>
                    <span className="block font-medium text-slate-100">{control.label}</span>
                    <span className="mt-0.5 block leading-4 text-slate-400">
                      {control.explanation}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
          <ClaimConstraintToggle
            patentId={PATENT_ID}
            claimStates={claimStates}
            onToggleClaim={(claimNumber, active) =>
              updateParam(claimConstraintStateParamId(claimNumber), active ? 1 : 0)
            }
          />
          {claimConstraintResult.activeFailures.length > 0 && (
            <div role="status" className="rounded-lg border border-rose-800 bg-rose-950/70 p-3">
              {claimConstraintResult.activeFailures.map((failure: string) => (
                <p key={failure} className="text-[11px] leading-5 text-rose-100">
                  {failure}
                </p>
              ))}
              {claimConstraintResult.refusalWarning && (
                <p className="mt-1 text-[10px] leading-4 text-rose-200">
                  {claimConstraintResult.refusalWarning}
                </p>
              )}
            </div>
          )}
          <p className="rounded-lg border border-rose-900/70 bg-rose-950/40 p-3 text-xs leading-5 text-rose-100">
            {state.sourceBoundary.reason}
          </p>
          <button
            type="button"
            onClick={resetParams}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-600 bg-slate-900 px-3 text-sm text-slate-100 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
          >
            <RotateCcw className="h-4 w-4" />
            Reset source exhibit
          </button>
        </form>
      </div>
    </section>
  );
}
