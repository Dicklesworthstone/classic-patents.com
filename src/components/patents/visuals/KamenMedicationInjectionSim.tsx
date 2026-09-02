"use client";

import { RotateCcw } from "lucide-react";
import { useId, useMemo } from "react";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import { stepKamenInjectionMechanism } from "@/physics/kamenInjectionKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

const PATENT_ID = "us-3858581-kamen-medication-injection-device";

function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function KamenMedicationInjectionSim() {
  const turnId = useId();
  const targetId = useId();
  const motorId = useId();
  const reliefId = useId();
  const { effectiveParams, claimStates, claimConstraintResult, updateParam, resetParams } =
    usePatentPhysics(PATENT_ID);
  const pose = useMemo(() => stepKamenInjectionMechanism(effectiveParams), [effectiveParams]);
  const turn = pose.leadScrewTurnFraction;
  const target = pose.counterTargetFraction;
  const motor = Number(pose.motorCircuitClosed);
  const relief = Number(pose.reliefPathShown);
  const plungerX = 232 + pose.plungerPosition * 188;
  return (
    <section className="overflow-hidden rounded-2xl border border-cyan-800/60 bg-slate-950 text-slate-100 shadow-2xl">
      <header className="border-b border-cyan-900/70 bg-slate-900/80 px-4 py-3 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.16em] text-cyan-300">
          US 3,858,581 · NONCLINICAL MECHANISM EXHIBIT
        </p>
        <h3 className="mt-1 font-serif text-xl text-white">
          Kamen lead-screw and pulse-counter mechanism
        </h3>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">
          The source connects motor rotation to a uniform-pitch lead screw, plunger follower,
          pulse-emitting switch, counter, and timing circuit. This is intentionally not a dose
          calculator, delivery-rate model, or medical instruction.
        </p>
      </header>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="min-w-0 border-b border-cyan-900/70 p-3 lg:border-b-0 lg:border-r sm:p-5">
          <svg
            viewBox="0 0 640 410"
            role="img"
            aria-label="Normalized Kamen medication injection device mechanism showing motor lead screw plunger pulse switch and counter"
            className="h-auto w-full rounded-xl border border-slate-700 bg-[radial-gradient(circle_at_36%_18%,_#12365b,_#020617_72%)]"
          >
            <defs>
              <pattern
                id="kamen-injection-grid"
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#173b5d" strokeWidth="1" />
              </pattern>
              <marker
                id="kamen-mechanism-arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
              </marker>
            </defs>
            <rect width="640" height="410" fill="url(#kamen-injection-grid)" />
            <text x="20" y="29" fill="#67e8f9" fontSize="12" fontFamily="monospace">
              FIGS. 2–6 · MOTOR / SCREW / COUNTER TOPOLOGY
            </text>
            <text x="20" y="393" fill="#fda4af" fontSize="10" fontFamily="monospace">
              nonclinical exhibit — no dose, volume, flow, pressure, concentration, or patient-state
              claim
            </text>
            <rect
              x="68"
              y="165"
              width="106"
              height="90"
              rx="12"
              fill="#172554"
              stroke="#22d3ee"
              strokeWidth="3"
            />
            <text
              x="121"
              y="201"
              textAnchor="middle"
              fill="#a5f3fc"
              fontSize="13"
              fontFamily="monospace"
            >
              MOTOR
            </text>
            <text
              x="121"
              y="220"
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="10"
              fontFamily="monospace"
            >
              timed circuit
            </text>
            <line
              x1="174"
              y1="210"
              x2="485"
              y2="210"
              stroke="#94a3b8"
              strokeWidth="18"
              strokeLinecap="round"
            />
            <line
              x1="174"
              y1="210"
              x2="485"
              y2="210"
              stroke="#e2e8f0"
              strokeWidth="5"
              strokeDasharray="9 6"
            />
            <text x="282" y="190" fill="#e2e8f0" fontSize="11" fontFamily="monospace">
              uniform-pitch lead screw
            </text>
            <rect
              x={plungerX - 12}
              y="155"
              width="24"
              height="110"
              rx="4"
              fill="#f59e0b"
              stroke="#fde68a"
              strokeWidth="3"
            />
            <text
              x={plungerX}
              y="285"
              textAnchor="middle"
              fill="#fde68a"
              fontSize="10"
              fontFamily="monospace"
            >
              follower / plunger
            </text>
            <rect
              x="486"
              y="143"
              width="95"
              height="134"
              rx="14"
              fill="#0f172a"
              stroke="#c084fc"
              strokeWidth="3"
            />
            <text
              x="533"
              y="182"
              textAnchor="middle"
              fill="#e9d5ff"
              fontSize="12"
              fontFamily="monospace"
            >
              PULSE
            </text>
            <text
              x="533"
              y="199"
              textAnchor="middle"
              fill="#e9d5ff"
              fontSize="12"
              fontFamily="monospace"
            >
              COUNTER
            </text>
            <text
              x="533"
              y="224"
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="10"
              fontFamily="monospace"
            >
              rotation-switch
            </text>
            <line
              x1="468"
              y1="140"
              x2="509"
              y2="141"
              stroke="#c084fc"
              strokeWidth="3"
              markerEnd="url(#kamen-mechanism-arrow)"
            />
            <circle cx="430" cy="210" r="14" fill="#0f172a" stroke="#fbbf24" strokeWidth="3" />
            <text
              x="430"
              y="215"
              textAnchor="middle"
              fill="#fde68a"
              fontSize="10"
              fontFamily="monospace"
            >
              S
            </text>
            <text x="409" y="244" fill="#fde68a" fontSize="10" fontFamily="monospace">
              striker / switch
            </text>
            {pose.reliefPathShown && (
              <g>
                <path
                  d="M 272 252 C 292 314, 383 314, 403 252"
                  fill="none"
                  stroke="#fb7185"
                  strokeWidth="6"
                  strokeDasharray="8 5"
                />
                <text
                  x="337"
                  y="337"
                  textAnchor="middle"
                  fill="#fecdd3"
                  fontSize="11"
                  fontFamily="monospace"
                >
                  relief / clutch path shown
                </text>
              </g>
            )}
            <g transform="translate(56 78)">
              <rect width="172" height="54" rx="7" fill="#0f172a" stroke="#38bdf8" />
              <text x="12" y="21" fill="#67e8f9" fontSize="11" fontFamily="monospace">
                SOURCE SEQUENCE
              </text>
              <text x="12" y="40" fill="#cbd5e1" fontSize="10" fontFamily="monospace">
                motor → screw → pulses → counter
              </text>
            </g>
          </svg>
          <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
            <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-2">
              <p className="font-mono text-cyan-300">MOTOR STATE</p>
              <p className="mt-1 text-slate-200">{pose.motorState}</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-2">
              <p className="font-mono text-amber-300">PULSE PROGRESS</p>
              <p className="mt-1 text-slate-200">{percent(pose.pulseProgress)} normalized</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-2">
              <p className="font-mono text-purple-300">ACTIVE PROBE</p>
              <p className="mt-1 text-slate-200">Claim {pose.activeClaim}</p>
            </div>
          </div>
        </div>
        <form className="space-y-4 p-4 sm:p-5" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor={turnId} className="block text-xs font-medium text-slate-200">
            Lead-screw rotation{" "}
            <span className="float-right font-mono text-cyan-300">{percent(turn)}</span>
            <input
              id={turnId}
              className="mt-1 w-full accent-cyan-400"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={turn}
              aria-label="Lead-screw rotation"
              onChange={(event) => updateParam("leadScrewTurnFraction", Number(event.target.value))}
            />
          </label>
          <label htmlFor={targetId} className="block text-xs font-medium text-slate-200">
            Counter target{" "}
            <span className="float-right font-mono text-purple-300">{percent(target)}</span>
            <input
              id={targetId}
              className="mt-1 w-full accent-purple-400"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={target}
              aria-label="Pulse counter target"
              onChange={(event) => updateParam("counterTargetFraction", Number(event.target.value))}
            />
          </label>
          <label htmlFor={motorId} className="block text-xs font-medium text-slate-200">
            Motor circuit
            <select
              id={motorId}
              className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 px-2 py-2 text-sm text-slate-100"
              value={motor}
              aria-label="Motor circuit state"
              onChange={(event) => updateParam("motorCircuitClosed", Number(event.target.value))}
            >
              <option value="1">Closed / pulse sequence shown</option>
              <option value="0">Open / stopped</option>
            </select>
          </label>
          <label htmlFor={reliefId} className="block text-xs font-medium text-slate-200">
            Relief arrangement
            <select
              id={reliefId}
              className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 px-2 py-2 text-sm text-slate-100"
              value={relief}
              aria-label="Relief arrangement"
              onChange={(event) => updateParam("reliefPathShown", Number(event.target.value))}
            >
              <option value="0">Mechanism path hidden</option>
              <option value="1">Relief / clutch path shown</option>
            </select>
          </label>
          <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-3">
            <p className="mb-2 font-mono text-[10px] tracking-[0.14em] text-cyan-300">
              CLAIM 1 MECHANISM PROBE
            </p>
            <ClaimConstraintToggle
              patentId={PATENT_ID}
              claimStates={claimStates}
              onToggleClaim={(claimNumber, active) =>
                updateParam(claimConstraintStateParamId(claimNumber), active ? 1 : 0)
              }
            />
          </div>
          {claimConstraintResult.activeFailures.length > 0 && (
            <div role="status" className="rounded-lg border border-rose-800 bg-rose-950/70 p-3">
              {claimConstraintResult.activeFailures.map((failure) => (
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
            {pose.refusal.reason}
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
