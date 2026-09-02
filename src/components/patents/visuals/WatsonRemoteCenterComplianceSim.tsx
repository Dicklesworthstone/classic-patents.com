"use client";

import { RotateCcw } from "lucide-react";
import { useId, useMemo } from "react";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { stepWatsonRemoteCenterComplianceTopology } from "@/physics/watsonRemoteCenterComplianceKernel";

const PATENT_ID = "us-4098001-watson-rcc";

function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function WatsonRemoteCenterComplianceSim() {
  const contactId = useId();
  const mismatchId = useId();
  const topologyId = useId();
  const twistId = useId();
  const { params, updateParam, resetParams } = usePatentPhysics(PATENT_ID);
  const pose = useMemo(() => stepWatsonRemoteCenterComplianceTopology(params), [params]);
  const contact = pose.lateralContactFraction;
  const mismatch = pose.axisMismatchFraction;
  const topology = Number(pose.remoteCenterTopology);
  const antiTwist = Number(pose.antiTwistConstraint);

  const toolX = 320 + pose.translationOffset * 105;
  const toolAngle = (pose.remainingAxisMismatch - 0.22) * 0.48;
  const toolEndX = toolX + Math.sin(toolAngle) * 88;
  const toolEndY = 220 + Math.cos(toolAngle) * 88;
  const remoteX = pose.remoteCenterTopology ? toolEndX : toolX;
  const remoteY = pose.remoteCenterTopology ? toolEndY : 145;

  return (
    <section className="overflow-hidden rounded-2xl border border-cyan-800/60 bg-slate-950 text-slate-100 shadow-2xl">
      <header className="border-b border-cyan-900/70 bg-slate-900/80 px-4 py-3 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.16em] text-cyan-300">
          US 4,098,001 · CLAIM-LINKED COMPLIANCE GEOMETRY
        </p>
        <h3 className="mt-1 font-serif text-xl text-white">Watson remote-center compliance</h3>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">
          Figure 4 supplies lateral accommodation before Figure 5 supplies an angular correction.
          This shared 2D/3D instrument shows only normalized source topology: the grant prints no
          force, stiffness, clearance, material, or timing values.
        </p>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="min-w-0 border-b border-cyan-900/70 p-3 lg:border-b-0 lg:border-r sm:p-5">
          <svg
            viewBox="0 0 640 410"
            role="img"
            aria-label="Normalized remote-center compliance geometry showing radial and axial flexures, tool axis, hole axis, and remote center"
            className="h-auto w-full rounded-xl border border-slate-700 bg-[radial-gradient(circle_at_50%_28%,_#12365b,_#020617_70%)]"
          >
            <defs>
              <pattern id="watson-rcc-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#173b5d" strokeWidth="1" />
              </pattern>
              <marker
                id="watson-rcc-arrow"
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
            <rect width="640" height="410" fill="url(#watson-rcc-grid)" />
            <text x="22" y="29" fill="#67e8f9" fontSize="12" fontFamily="monospace">
              FIGS. 4 / 5 · NORMALIZED EXHIBIT
            </text>
            <text x="22" y="393" fill="#94a3b8" fontSize="10" fontFamily="monospace">
              geometry only — no dimensional or contact-force reconstruction
            </text>

            <g opacity="0.48" stroke="#94a3b8" strokeDasharray="5 5">
              <line x1="320" y1="58" x2="320" y2="356" />
              <line x1="507" y1="72" x2="507" y2="356" />
            </g>
            <text x="511" y="91" fill="#94a3b8" fontSize="10" fontFamily="monospace">
              hole axis 78
            </text>

            <rect x="227" y="67" width="186" height="32" rx="7" fill="#172554" stroke="#38bdf8" />
            <text
              x="320"
              y="88"
              textAnchor="middle"
              fill="#bae6fd"
              fontSize="12"
              fontFamily="monospace"
            >
              MACHINE PORTION 18
            </text>
            <rect
              x={toolX - 73}
              y="120"
              width="146"
              height="16"
              rx="5"
              fill="#1e293b"
              stroke="#e2e8f0"
            />
            <text x={toolX + 82} y="133" fill="#cbd5e1" fontSize="10" fontFamily="monospace">
              ring 22
            </text>
            <rect
              x={toolX - 66}
              y="204"
              width="132"
              height="16"
              rx="5"
              fill="#1e293b"
              stroke="#fbbf24"
            />
            <text x={toolX + 74} y="217" fill="#fde68a" fontSize="10" fontFamily="monospace">
              plate 20
            </text>

            {[272, 320, 368].map((fixedX, index) => (
              <line
                key={fixedX}
                x1={fixedX}
                y1="99"
                x2={toolX + (index - 1) * 48}
                y2="120"
                stroke="#22d3ee"
                strokeWidth="5"
              />
            ))}
            <text x="54" y="152" fill="#67e8f9" fontSize="11" fontFamily="monospace">
              56 / 58 / 60
            </text>
            <text x="54" y="166" fill="#94a3b8" fontSize="10" fontFamily="monospace">
              axial translation flexures
            </text>

            {[0, 1, 2].map((index) => {
              const ringX = toolX + (index - 1) * 48;
              const plateX = toolX + (index - 1) * 36;
              return (
                <g key={index}>
                  <line
                    x1={remoteX}
                    y1={remoteY}
                    x2={ringX}
                    y2="136"
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                    strokeDasharray="4 5"
                    opacity="0.75"
                  />
                  <line x1={ringX} y1="136" x2={plateX} y2="204" stroke="#f59e0b" strokeWidth="5" />
                </g>
              );
            })}
            <text x={toolX - 135} y="166" fill="#fcd34d" fontSize="11" fontFamily="monospace">
              24 / 26 / 28
            </text>
            <text x={toolX - 150} y="180" fill="#94a3b8" fontSize="10" fontFamily="monospace">
              radial rotational elements
            </text>

            <line
              x1={toolX}
              y1="220"
              x2={toolEndX}
              y2={toolEndY}
              stroke="#e2e8f0"
              strokeWidth="18"
              strokeLinecap="round"
            />
            <line
              x1={toolX}
              y1="220"
              x2={toolEndX}
              y2={toolEndY}
              stroke="#f8fafc"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <text x={toolX + 13} y="280" fill="#e2e8f0" fontSize="11" fontFamily="monospace">
              rod 16
            </text>
            <line
              x1={toolX}
              y1="220"
              x2={toolEndX + 12}
              y2={toolEndY + 12}
              stroke="#a5f3fc"
              strokeWidth="2"
              strokeDasharray="6 5"
            />

            <g transform={`translate(507 302)`}>
              <path
                d="M -46 0 L -18 -23 L 18 -23 L 46 0 L 18 23 L -18 23 Z"
                fill="#334155"
                stroke="#7dd3fc"
                strokeWidth="2"
              />
              <circle cx="0" cy="0" r="13" fill="#020617" stroke="#f8fafc" strokeWidth="3" />
              <text
                x="0"
                y="52"
                textAnchor="middle"
                fill="#bae6fd"
                fontSize="10"
                fontFamily="monospace"
              >
                chamfer / hole 71
              </text>
            </g>

            <g>
              <circle cx={toolEndX} cy={toolEndY} r="7" fill="#fbbf24" />
              <line
                x1={toolEndX}
                y1={toolEndY}
                x2="492"
                y2="302"
                stroke="#fbbf24"
                strokeWidth="2"
                markerEnd="url(#watson-rcc-arrow)"
              />
              <text
                x={toolEndX + 14}
                y={toolEndY - 8}
                fill="#fde68a"
                fontSize="10"
                fontFamily="monospace"
              >
                contact cue
              </text>
            </g>

            <g>
              <circle
                cx={remoteX}
                cy={remoteY}
                r="8"
                fill={pose.remoteCenterTopology ? "#06b6d4" : "#64748b"}
                stroke="#ecfeff"
                strokeWidth="2"
              />
              <text
                x={remoteX + 14}
                y={remoteY - 10}
                fill="#cffafe"
                fontSize="11"
                fontFamily="monospace"
              >
                {pose.remoteCenterTopology ? "remote center 50" : "local-wrist contrast"}
              </text>
            </g>

            {pose.antiTwistConstraint && (
              <g>
                <ellipse
                  cx={toolX}
                  cy="205"
                  rx="29"
                  ry="8"
                  fill="none"
                  stroke="#c084fc"
                  strokeWidth="3"
                />
                <text x={toolX + 38} y="199" fill="#e9d5ff" fontSize="10" fontFamily="monospace">
                  bellows 90 · claim 2
                </text>
              </g>
            )}
          </svg>
          <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
            <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-2">
              <p className="font-mono text-cyan-300">TRANSLATION</p>
              <p className="mt-1 text-slate-200">
                {percent(pose.translationOffset)} display offset
              </p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-2">
              <p className="font-mono text-amber-300">REMAINING AXIS ERROR</p>
              <p className="mt-1 text-slate-200">
                {percent(pose.remainingAxisMismatch)} normalized
              </p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-2">
              <p className="font-mono text-purple-300">ACTIVE PROBE</p>
              <p className="mt-1 text-slate-200">
                {pose.activeClaim === null ? "Topology comparison" : `Claim ${pose.activeClaim}`}
              </p>
            </div>
          </div>
        </div>

        <form className="space-y-4 p-4 sm:p-5" onSubmit={(event) => event.preventDefault()}>
          <fieldset className="space-y-2">
            <label htmlFor={contactId} className="block text-xs font-medium text-slate-200">
              Chamfer contact position{" "}
              <span className="float-right font-mono text-cyan-300">{percent(contact)}</span>
            </label>
            <input
              id={contactId}
              className="w-full accent-cyan-400"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={contact}
              aria-label="Chamfer contact position"
              onChange={(event) =>
                updateParam("lateralContactFraction", Number(event.target.value))
              }
            />
          </fieldset>
          <fieldset className="space-y-2">
            <label htmlFor={mismatchId} className="block text-xs font-medium text-slate-200">
              Initial axis mismatch{" "}
              <span className="float-right font-mono text-amber-300">{percent(mismatch)}</span>
            </label>
            <input
              id={mismatchId}
              className="w-full accent-amber-400"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={mismatch}
              aria-label="Initial axis mismatch"
              onChange={(event) => updateParam("axisMismatchFraction", Number(event.target.value))}
            />
          </fieldset>
          <fieldset className="space-y-2">
            <legend className="text-xs font-medium text-slate-200">Claim 1 topology</legend>
            <select
              id={topologyId}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-2 py-2 text-sm text-slate-100"
              value={topology}
              aria-label="Remote-center topology"
              onChange={(event) => updateParam("remoteCenterTopology", Number(event.target.value))}
            >
              <option value="1">Radial + axial remote-center arrangement</option>
              <option value="0">Local-wrist comparison diagram</option>
            </select>
          </fieldset>
          <fieldset className="space-y-2">
            <legend className="text-xs font-medium text-slate-200">Claim 2 addition</legend>
            <select
              id={twistId}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-2 py-2 text-sm text-slate-100"
              value={antiTwist}
              aria-label="Anti-twist constraint"
              disabled={!pose.remoteCenterTopology}
              onChange={(event) => updateParam("antiTwistConstraint", Number(event.target.value))}
            >
              <option value="1">Torque-resistant means shown</option>
              <option value="0">Torque-resistant means omitted</option>
            </select>
          </fieldset>
          <p className="rounded-lg border border-rose-900/70 bg-rose-950/40 p-3 text-xs leading-5 text-rose-100">
            {pose.refusal.reason}
          </p>
          <button
            type="button"
            onClick={resetParams}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-600 bg-slate-900 px-3 text-sm text-slate-100 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
          >
            <RotateCcw className="h-4 w-4" /> Reset source exhibit
          </button>
        </form>
      </div>
    </section>
  );
}
