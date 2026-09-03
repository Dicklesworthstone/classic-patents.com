"use client";

import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { useState } from "react";
import {
  readDaVinciInterfaceControls,
  resolveDaVinciInterfaceTopology,
} from "@/physics/daVinciInterfaceTopology";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { ClaimConstraintToggle } from "./ClaimConstraintToggle";

const EXHIBIT_ID = "us-6331181-davinci";

function stateLabel(active: boolean) {
  return active ? "PRESENT" : "MISSING";
}

export function DaVinciInterfaceSim() {
  const { params, updateParam, resetParams } = usePatentPhysics(EXHIBIT_ID);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true, 17: true });
  const state = resolveDaVinciInterfaceTopology(readDaVinciInterfaceControls(params));
  const controls = [
    {
      id: "compatibilitySignalPresent",
      label: "Compatibility identifier",
      active: state.compatibilitySignalPresent,
      detail:
        "Tool circuitry presents an identifier the processor can compare with its compatible-tool table.",
    },
    {
      id: "calibrationRecordAvailable",
      label: "Measured calibration record",
      active: state.calibrationRecordAvailable,
      detail:
        "A tool-side record supplies nominal-to-measured offset information for controller configuration.",
    },
    {
      id: "engagementSignalPresent",
      label: "Engagement confirmation",
      active: state.engagementSignalPresent,
      detail: "The releasable holder/tool boundary reports its engagement condition to the system.",
    },
  ] as const;

  const ready = state.processorCanConfigureTool;

  return (
    <section className="rounded-2xl border border-parchment-300 bg-parchment-50 p-4 shadow-md dark:border-ink-800 dark:bg-ink-950 sm:p-6">
      <header className="border-b border-parchment-200 pb-3 dark:border-ink-800">
        <p className="font-mono text-[10px] uppercase tracking-[0.17em] text-cyan-700 dark:text-cyan-300">
          US 6,331,181 · source-bound topology
        </p>
        <h3 className="mt-1 font-serif text-xl font-bold text-ink-900 dark:text-parchment-100">
          Tool Interface, Memory, and Processor Boundary
        </h3>
        <p className="mt-1 max-w-3xl text-sm text-ink-600 dark:text-ink-300">
          The grant supports this logical path: a releasable tool reports compatibility, measured
          calibration, and engagement information to a processor. It does not supply a clinical
          trajectory, arm dimensions, material contact data, force, or speed.
        </p>
      </header>

      <div className="mt-5 overflow-x-auto rounded-xl border border-ink-800 bg-ink-950 p-3">
        <svg
          className="mx-auto block min-w-[620px] max-w-4xl"
          viewBox="0 0 860 330"
          role="img"
          aria-labelledby="davinci-interface-diagram-title davinci-interface-diagram-desc"
        >
          <title id="davinci-interface-diagram-title">
            Da Vinci surgical tool interface topology
          </title>
          <desc id="davinci-interface-diagram-desc">
            Processor, holder interface, tool-side memory, calibration record, engagement signal,
            and distal end effector in the information path described by the patent.
          </desc>
          <defs>
            <marker
              id="davinci-interface-arrow"
              markerWidth="9"
              markerHeight="9"
              refX="8"
              refY="4.5"
              orient="auto"
            >
              <path d="M 0 0 L 9 4.5 L 0 9 z" fill={ready ? "#22d3ee" : "#fb7185"} />
            </marker>
          </defs>
          <path
            d="M 222 154 C 292 74 370 74 448 122"
            fill="none"
            stroke={ready ? "#22d3ee" : "#fb7185"}
            strokeWidth="5"
            strokeDasharray={ready ? undefined : "10 8"}
            markerEnd="url(#davinci-interface-arrow)"
          />
          <text x="315" y="72" fill="#a5f3fc" fontSize="15" fontFamily="ui-monospace, monospace">
            tool data path
          </text>

          <rect
            x="45"
            y="112"
            width="178"
            height="112"
            rx="12"
            fill="#1d4ed8"
            stroke="#93c5fd"
            strokeWidth="2"
          />
          <text x="134" y="157" textAnchor="middle" fill="white" fontWeight="700" fontSize="18">
            PROCESSOR
          </text>
          <text x="134" y="182" textAnchor="middle" fill="#dbeafe" fontSize="13">
            compatible-tool table
          </text>

          <rect
            x="302"
            y="112"
            width="150"
            height="112"
            rx="12"
            fill="#475569"
            stroke="#cbd5e1"
            strokeWidth="2"
          />
          <text x="377" y="157" textAnchor="middle" fill="white" fontWeight="700" fontSize="18">
            HOLDER
          </text>
          <text x="377" y="182" textAnchor="middle" fill="#e2e8f0" fontSize="13">
            releasable interface
          </text>

          <rect
            x="530"
            y="112"
            width="184"
            height="112"
            rx="12"
            fill="#cbd5e1"
            stroke="#f8fafc"
            strokeWidth="2"
          />
          <text x="622" y="157" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="18">
            SURGICAL TOOL
          </text>
          <text x="622" y="182" textAnchor="middle" fill="#334155" fontSize="13">
            proximal interface → distal effector
          </text>

          <rect
            x="565"
            y="55"
            width="105"
            height="37"
            rx="6"
            fill={state.compatibilitySignalPresent ? "#059669" : "#be123c"}
          />
          <text x="617" y="79" textAnchor="middle" fill="white" fontWeight="700" fontSize="12">
            TOOL MEMORY
          </text>
          <rect
            x="684"
            y="55"
            width="122"
            height="37"
            rx="6"
            fill={state.calibrationRecordAvailable ? "#0284c7" : "#64748b"}
          />
          <text x="745" y="79" textAnchor="middle" fill="white" fontWeight="700" fontSize="12">
            OFFSET RECORD
          </text>
          <path d="M 617 92 L 617 112 M 745 92 L 690 112" stroke="#94a3b8" strokeWidth="2" />

          <path d="M 714 168 L 802 168" stroke="#e2e8f0" strokeWidth="14" strokeLinecap="round" />
          <path
            d="M 802 168 l 20 -15 M 802 168 l 20 15"
            stroke="#e2e8f0"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <text x="760" y="208" textAnchor="middle" fill="#cbd5e1" fontSize="13">
            qualitative distal end effector
          </text>

          <circle
            cx="377"
            cy="251"
            r="18"
            fill={state.engagementSignalPresent ? "#10b981" : "#f97316"}
          />
          <text x="407" y="257" fill="#e2e8f0" fontSize="14">
            engagement signal
          </text>
        </svg>
      </div>

      <div
        className={`mt-4 rounded-lg border p-3 text-sm ${
          ready
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100"
            : "border-rose-500/40 bg-rose-500/10 text-rose-900 dark:text-rose-100"
        }`}
      >
        {ready ? (
          <CheckCircle2 className="mr-2 inline h-4 w-4" aria-hidden="true" />
        ) : (
          <XCircle className="mr-2 inline h-4 w-4" aria-hidden="true" />
        )}
        {ready
          ? "All disclosed interface records are present: the processor can configure the loaded tool."
          : "The topology is incomplete, so the exhibit withholds a ready-to-configure state."}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {controls.map((control) => (
          <button
            key={control.id}
            type="button"
            aria-pressed={control.active}
            onClick={() => updateParam(control.id, control.active ? 0 : 1)}
            className={`rounded-lg border p-3 text-left transition-colors ${
              control.active
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100"
                : "border-rose-500/50 bg-rose-500/10 text-rose-950 dark:text-rose-100"
            }`}
          >
            <span className="font-mono text-[10px] tracking-wide">
              {stateLabel(control.active)}
            </span>
            <span className="mt-1 block text-sm font-semibold">{control.label}</span>
            <span className="mt-1 block text-xs leading-relaxed opacity-80">{control.detail}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <ClaimConstraintToggle
          patentId={EXHIBIT_ID}
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((previous) => ({ ...previous, [claimNo]: active }))
          }
        />
        <button
          type="button"
          onClick={resetParams}
          className="rounded-md border border-parchment-400 px-2 py-1 text-xs font-semibold text-ink-600 hover:border-cyan-600 hover:text-cyan-700 dark:border-ink-700 dark:text-ink-300 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
        >
          <RotateCcw className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
          Restore source topology
        </button>
      </div>
    </section>
  );
}
