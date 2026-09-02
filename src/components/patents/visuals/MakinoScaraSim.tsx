"use client";

import { RotateCcw } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { stepMakinoScaraTopology } from "@/physics/makinoScaraKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

const PATENT_ID = "us-4341502-makino-scara";
const SCALE = 116;
const ORIGIN_X = 320;
const ORIGIN_Y = 242;

function point([x, y]: readonly [number, number]): readonly [number, number] {
  return [ORIGIN_X + x * SCALE, ORIGIN_Y - y * SCALE];
}

function topologyTitle(variant: number): string {
  if (variant === 1) return "Claim 1 · concentric base shafts";
  if (variant === 2) return "Claim 3 · parallel offset shafts";
  return "Claim 6 · Y-link attitude preservation";
}

export function MakinoScaraSim() {
  const firstId = useId();
  const fourthId = useId();
  const toolId = useId();
  const topologyId = useId();
  const { params, updateParam, resetParams } = usePatentPhysics(PATENT_ID);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const pose = useMemo(() => stepMakinoScaraTopology(params), [params]);
  const firstAngle = params.firstLinkAngleDeg ?? 32;
  const fourthAngle = params.fourthLinkAngleDeg ?? -38;
  const toolAngle = params.toolAttitudeDeg ?? 0;
  const topology = params.topologyVariant ?? 1;
  const [baseA] = point(pose.firstBase);
  const [baseB] = point(pose.fourthBase);
  const [outerA] = point(pose.firstOuterJoint);
  const [, outerAY] = point(pose.firstOuterJoint);
  const [outerB, outerBY] = point(pose.fourthOuterJoint);
  const [toolX, toolY] = point(pose.tool);
  const yHub = pose.yLinkHub ? point(pose.yLinkHub) : null;
  const toolDirection = [
    toolX + Math.cos(pose.toolAttitudeRad) * 38,
    toolY - Math.sin(pose.toolAttitudeRad) * 38,
  ] as const;

  return (
    <section className="rounded-2xl overflow-hidden border border-cyan-800/50 bg-slate-950 text-slate-100 shadow-2xl">
      <header className="border-b border-cyan-900/70 bg-slate-900/80 px-4 py-3 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.16em] text-cyan-300">
          US 4,341,502 · FOUR-LINK ASSEMBLY-ROBOT CONFIGURATION
        </p>
        <h3 className="mt-1 font-serif text-xl text-white">Makino SCARA linkage instrument</h3>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">
          Move the two source-named link angles and inspect how the topology changes. The canvas
          uses normalized exhibit geometry: the patent does not print link lengths, payload, forces,
          stiffness, or controller gains.
        </p>
      </header>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 border-b border-cyan-900/70 p-3 lg:border-b-0 lg:border-r sm:p-5">
          <svg
            viewBox="0 0 640 420"
            role="img"
            aria-label="Interactive normalized four-link assembly robot configuration"
            className="h-auto w-full rounded-xl border border-slate-700 bg-[radial-gradient(circle_at_center,_#172554,_#020617_72%)]"
          >
            <defs>
              <pattern id="makino-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#1e3a5f" strokeWidth="1" />
              </pattern>
              <marker
                id="makino-tool-arrow"
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
            <rect width="640" height="420" fill="url(#makino-grid)" />
            <line
              x1="52"
              y1={ORIGIN_Y}
              x2="588"
              y2={ORIGIN_Y}
              stroke="#335a7e"
              strokeDasharray="5 7"
            />
            <line
              x1={ORIGIN_X}
              y1="44"
              x2={ORIGIN_X}
              y2="384"
              stroke="#335a7e"
              strokeDasharray="5 7"
            />
            <text x="22" y="30" fill="#67e8f9" fontSize="12" fontFamily="monospace">
              PLANAR EXHIBIT · θ₁ / θ₂ / φ
            </text>
            <text x="22" y="394" fill="#94a3b8" fontSize="10" fontFamily="monospace">
              normalized projection — not a dimensional reconstruction
            </text>

            <g opacity="0.4" stroke="#94a3b8" strokeDasharray="3 4">
              <line x1={baseA} y1={ORIGIN_Y} x2={baseA} y2="356" />
              <line x1={baseB} y1={ORIGIN_Y} x2={baseB} y2="356" />
            </g>
            <rect
              x={Math.min(baseA, baseB) - 34}
              y={ORIGIN_Y - 12}
              width={Math.abs(baseB - baseA) + 68}
              height="24"
              rx="5"
              fill="#1e293b"
              stroke="#60a5fa"
              strokeWidth="2"
            />
            <text
              x={ORIGIN_X}
              y={ORIGIN_Y + 40}
              textAnchor="middle"
              fill="#bae6fd"
              fontSize="10"
              fontFamily="monospace"
            >
              BASE ·{" "}
              {pose.topology === "claim-1-concentric"
                ? "coaxial display separation"
                : "offset shafts"}
            </text>

            <g strokeLinecap="round" strokeLinejoin="round">
              <line
                x1={baseA}
                y1={ORIGIN_Y}
                x2={outerA}
                y2={outerAY}
                stroke="#22d3ee"
                strokeWidth="16"
                opacity="0.2"
              />
              <line
                x1={baseA}
                y1={ORIGIN_Y}
                x2={outerA}
                y2={outerAY}
                stroke="#67e8f9"
                strokeWidth="6"
              />
              <line
                x1={baseB}
                y1={ORIGIN_Y}
                x2={outerB}
                y2={outerBY}
                stroke="#f59e0b"
                strokeWidth="16"
                opacity="0.2"
              />
              <line
                x1={baseB}
                y1={ORIGIN_Y}
                x2={outerB}
                y2={outerBY}
                stroke="#fbbf24"
                strokeWidth="6"
              />
              <line
                x1={outerA}
                y1={outerAY}
                x2={toolX}
                y2={toolY}
                stroke="#38bdf8"
                strokeWidth="5"
              />
              <line
                x1={outerB}
                y1={outerBY}
                x2={toolX}
                y2={toolY}
                stroke="#fcd34d"
                strokeWidth="5"
              />
              {yHub && (
                <>
                  <line
                    x1={baseA}
                    y1={ORIGIN_Y}
                    x2={yHub[0]}
                    y2={yHub[1]}
                    stroke="#c084fc"
                    strokeWidth="3"
                    strokeDasharray="7 5"
                  />
                  <line
                    x1={yHub[0]}
                    y1={yHub[1]}
                    x2={toolX}
                    y2={toolY}
                    stroke="#c084fc"
                    strokeWidth="3"
                    strokeDasharray="7 5"
                  />
                  <line
                    x1={yHub[0]}
                    y1={yHub[1]}
                    x2={baseB}
                    y2={ORIGIN_Y}
                    stroke="#c084fc"
                    strokeWidth="3"
                    strokeDasharray="7 5"
                  />
                  <circle
                    cx={yHub[0]}
                    cy={yHub[1]}
                    r="8"
                    fill="#581c87"
                    stroke="#e9d5ff"
                    strokeWidth="2"
                  />
                  <text
                    x={yHub[0] + 11}
                    y={yHub[1] - 9}
                    fill="#e9d5ff"
                    fontSize="11"
                    fontFamily="monospace"
                  >
                    Y-link 14
                  </text>
                </>
              )}
              <line
                x1={toolX}
                y1={toolY}
                x2={toolDirection[0]}
                y2={toolDirection[1]}
                stroke="#fbbf24"
                strokeWidth="3"
                markerEnd="url(#makino-tool-arrow)"
              />
            </g>

            {[
              { x: baseA, y: ORIGIN_Y, label: "1", color: "#67e8f9" },
              { x: baseB, y: ORIGIN_Y, label: "2", color: "#fbbf24" },
              { x: outerA, y: outerAY, label: "4", color: "#67e8f9" },
              { x: outerB, y: outerBY, label: "5", color: "#fbbf24" },
            ].map((node) => (
              <g key={`${node.label}-${node.x}-${node.y}`}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="10"
                  fill="#0f172a"
                  stroke={node.color}
                  strokeWidth="2"
                />
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  fill={node.color}
                  fontSize="11"
                  fontFamily="monospace"
                >
                  {node.label}
                </text>
              </g>
            ))}
            <rect
              x={toolX - 13}
              y={toolY - 13}
              width="26"
              height="26"
              rx="4"
              fill="#713f12"
              stroke="#fde68a"
              strokeWidth="2"
            />
            <text
              x={toolX}
              y={toolY + 4}
              textAnchor="middle"
              fill="#fef3c7"
              fontSize="11"
              fontFamily="monospace"
            >
              9
            </text>
            <text x={toolX + 18} y={toolY + 30} fill="#fde68a" fontSize="11" fontFamily="monospace">
              ASSEMBLY TOOL
            </text>
          </svg>

          <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
            <div className="rounded-lg border border-cyan-800/70 bg-cyan-950/40 p-2.5">
              <span className="text-cyan-300">θ₁</span>
              <span className="float-right font-mono">{firstAngle.toFixed(0)}°</span>
            </div>
            <div className="rounded-lg border border-amber-800/70 bg-amber-950/35 p-2.5">
              <span className="text-amber-300">θ₂</span>
              <span className="float-right font-mono">{fourthAngle.toFixed(0)}°</span>
            </div>
            <div className="rounded-lg border border-violet-800/70 bg-violet-950/35 p-2.5">
              <span className="text-violet-300">Claim</span>
              <span className="float-right font-mono">{pose.independentClaim}</span>
            </div>
          </div>
        </div>

        <aside className="space-y-4 bg-slate-950/70 p-4">
          <label className="block text-sm text-slate-200" htmlFor={firstId}>
            First-link angle θ₁{" "}
            <span className="float-right font-mono text-cyan-300">{firstAngle.toFixed(0)}°</span>
            <input
              id={firstId}
              className="mt-2 w-full accent-cyan-400"
              type="range"
              min="-180"
              max="180"
              step="1"
              value={firstAngle}
              onChange={(event) => updateParam("firstLinkAngleDeg", Number(event.target.value))}
            />
          </label>
          <label className="block text-sm text-slate-200" htmlFor={fourthId}>
            Fourth-link angle θ₂{" "}
            <span className="float-right font-mono text-amber-300">{fourthAngle.toFixed(0)}°</span>
            <input
              id={fourthId}
              className="mt-2 w-full accent-amber-400"
              type="range"
              min="-180"
              max="180"
              step="1"
              value={fourthAngle}
              onChange={(event) => updateParam("fourthLinkAngleDeg", Number(event.target.value))}
            />
          </label>
          <label className="block text-sm text-slate-200" htmlFor={toolId}>
            Tool attitude φ{" "}
            <span className="float-right font-mono text-yellow-200">{toolAngle.toFixed(0)}°</span>
            <input
              id={toolId}
              className="mt-2 w-full accent-yellow-300"
              type="range"
              min="-180"
              max="180"
              step="1"
              value={toolAngle}
              onChange={(event) => updateParam("toolAttitudeDeg", Number(event.target.value))}
            />
          </label>
          <label className="block text-sm text-slate-200" htmlFor={topologyId}>
            Claim topology
            <select
              id={topologyId}
              className="mt-2 w-full rounded-md border border-slate-600 bg-slate-900 p-2 text-sm"
              value={topology}
              onChange={(event) => updateParam("topologyVariant", Number(event.target.value))}
            >
              <option value="1">Claim 1 · concentric</option>
              <option value="2">Claim 3 · offset</option>
              <option value="3">Claim 6 · Y-link</option>
            </select>
          </label>
          <p className="rounded-lg border border-violet-800/70 bg-violet-950/30 p-3 text-xs leading-5 text-violet-100">
            {topologyTitle(topology)}
          </p>
          <p className="rounded-lg border border-rose-800/70 bg-rose-950/30 p-3 text-xs leading-5 text-rose-100">
            {pose.refusal.reason}
          </p>
          <button
            type="button"
            onClick={resetParams}
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-800 px-3 text-sm text-slate-100 hover:bg-slate-700"
          >
            <RotateCcw className="h-4 w-4" /> Reset source exhibit
          </button>

          <div className="pt-2 border-t border-slate-800">
            <ClaimConstraintToggle
              patentId={PATENT_ID}
              claimStates={claimStates}
              onClaimStateChange={(num, active) =>
                setClaimStates((prev) => ({ ...prev, [num]: active }))
              }
            />
          </div>
        </aside>
      </div>
    </section>
  );
}
