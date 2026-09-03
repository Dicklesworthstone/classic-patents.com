"use client";

import { useId, useMemo } from "react";
import { PhysicsTelemetryBadge } from "@/components/patents/PhysicsTelemetryBadge";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { ALL_COLORIZED_EQUATIONS } from "@/data/colorizedEquations";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import {
  KAMEN_TRANSPORTER_TOPOLOGY_LABELS,
  KAMEN_TRANSPORTER_TOPOLOGY_STATES,
  readKamenTransporterControls,
  stepKamenTransporterTopology,
} from "@/physics/kamenTransporterKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

export function KamenTransporterSim({
  patentId = "us-5701965-kamen-transporter",
}: {
  patentId?: string;
}) {
  const { effectiveParams, claimStates, updateParam } = usePatentPhysics(patentId);
  const controls = useMemo(() => readKamenTransporterControls(effectiveParams), [effectiveParams]);
  const topology = useMemo(() => stepKamenTransporterTopology(controls), [controls]);
  const equations = useMemo(() => ALL_COLORIZED_EQUATIONS[patentId] ?? [], [patentId]);
  const clipId = useId();

  const width = 640;
  const height = 460;
  const groundY = 380;
  const centerX = width / 2;
  const wheelRadius = 38;
  const carrierRadius = 46;
  const hubY = groundY - wheelRadius - (topology.balanceLoopActive ? carrierRadius : 0);
  const carrierAngle = topology.clusterDisplayPoseRad;
  const wheel1X = centerX - carrierRadius * Math.sin(carrierAngle);
  const wheel1Y = hubY + carrierRadius * Math.cos(carrierAngle);
  const wheel2X = centerX + carrierRadius * Math.sin(carrierAngle);
  const wheel2Y = hubY - carrierRadius * Math.cos(carrierAngle);
  const selectedStateIndex = KAMEN_TRANSPORTER_TOPOLOGY_STATES.indexOf(topology.topologyState);

  return (
    <div className="flex w-full flex-col items-center space-y-6 rounded-2xl border border-parchment-300 bg-parchment-50 p-6 shadow-patent dark:border-ink-800 dark:bg-ink-950">
      <div className="flex w-full flex-col justify-between gap-4 border-b border-parchment-200 pb-4 sm:flex-row sm:items-center dark:border-ink-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-cyan-300 bg-cyan-100 px-2.5 py-0.5 text-xs font-bold text-cyan-800 dark:border-cyan-700 dark:bg-cyan-900/60 dark:text-cyan-200">
              US 5,701,965
            </span>
            <span className="font-mono text-xs font-medium text-ink-500 dark:text-ink-400">
              DEAN L. KAMEN (1997)
            </span>
          </div>
          <h3 className="mt-1 font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
            Balance, Transfer &amp; Climb Claim Topology
          </h3>
        </div>
        <PhysicsTelemetryBadge patentId={patentId} equations={equations} />
      </div>

      <div className="relative aspect-[4/3] w-full max-w-[640px] select-none overflow-hidden rounded-xl border border-parchment-300 bg-parchment-100 dark:border-ink-800 dark:bg-ink-900">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" role="img">
          <title>Source-bound Kamen transporter claim topology</title>
          <defs>
            <linearGradient id={`ground-grad-${clipId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#78716c" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#44403c" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id={`chassis-grad-${clipId}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
          </defs>

          <g
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-parchment-300 dark:text-ink-800"
            opacity="0.6"
          >
            {Array.from({ length: 15 }).map((_, index) => (
              <line key={`grid-h-${index}`} x1="0" y1={index * 30} x2={width} y2={index * 30} />
            ))}
            {Array.from({ length: 22 }).map((_, index) => (
              <line key={`grid-v-${index}`} x1={index * 30} y1="0" x2={index * 30} y2={height} />
            ))}
          </g>

          {topology.stairSequenceActive ? (
            <path
              d={`M 0,${groundY} L 240,${groundY} L 240,${groundY - 50} L 360,${groundY - 50} L 360,${groundY - 100} L ${width},${groundY - 100} L ${width},${height} L 0,${height} Z`}
              fill={`url(#ground-grad-${clipId})`}
              stroke="#57534e"
              strokeWidth="2"
            />
          ) : (
            <rect
              x="0"
              y={groundY}
              width={width}
              height={height - groundY}
              fill={`url(#ground-grad-${clipId})`}
              stroke="#57534e"
              strokeWidth="2"
            />
          )}

          <line
            x1={centerX}
            y1={hubY}
            x2={centerX}
            y2={hubY - 175}
            stroke="#94a3b8"
            strokeDasharray="4 4"
            strokeWidth="1.5"
          />
          <text
            x={centerX + 10}
            y={hubY - 158}
            className="fill-ink-600 font-mono text-[10px] dark:fill-parchment-300"
          >
            CONTROL RELATIONSHIP
          </text>

          <g opacity={topology.clusterTopologyActive ? 1 : 0.28}>
            <line
              x1={wheel1X}
              y1={wheel1Y}
              x2={wheel2X}
              y2={wheel2Y}
              stroke="#64748b"
              strokeLinecap="round"
              strokeWidth="8"
            />
            <circle
              cx={wheel1X}
              cy={wheel1Y}
              r={wheelRadius}
              fill="#1e293b"
              stroke="#38bdf8"
              strokeWidth="4"
            />
            <circle cx={wheel1X} cy={wheel1Y} r="6" fill="#94a3b8" />
            <circle
              cx={wheel2X}
              cy={wheel2Y}
              r={wheelRadius}
              fill="#1e293b"
              stroke="#38bdf8"
              strokeWidth="4"
            />
            <circle cx={wheel2X} cy={wheel2Y} r="6" fill="#94a3b8" />
            <circle cx={centerX} cy={hubY} r="14" fill="#0f172a" stroke="#fbbf24" strokeWidth="3" />
          </g>

          <g transform={`translate(${centerX}, ${hubY - 142})`}>
            <rect
              x="-28"
              y="-15"
              width="56"
              height="30"
              rx="6"
              fill={`url(#chassis-grad-${clipId})`}
              stroke="#38bdf8"
              strokeWidth="2"
            />
            <rect x="-20" y="-67" width="14" height="55" rx="4" fill="#0369a1" stroke="#38bdf8" />
            <line
              x1="15"
              y1="-5"
              x2="28"
              y2="-45"
              stroke="#f59e0b"
              strokeLinecap="round"
              strokeWidth="3"
            />
            <circle cx="28" cy="-45" r="4" fill="#f59e0b" />
          </g>
          <circle
            cx={centerX}
            cy={hubY - 142}
            r="9"
            fill={topology.balanceLoopActive ? "#10b981" : "#f59e0b"}
            stroke="#ffffff"
            strokeWidth="2"
          />

          <text
            x="20"
            y="35"
            className="fill-ink-700 font-mono text-[11px] font-bold dark:fill-parchment-200"
          >
            STATE: {topology.stateLabel.toUpperCase()}
          </text>
          <text
            x="20"
            y="53"
            className="fill-ink-700 font-mono text-[11px] font-bold dark:fill-parchment-200"
          >
            WHEEL CONTROL: {topology.wheelControlMode.replaceAll("-", " ").toUpperCase()}
          </text>
          <text
            x="20"
            y="71"
            className="fill-ink-700 font-mono text-[11px] font-bold dark:fill-parchment-200"
          >
            CLAIMS: {topology.sourceClaimNumbers.join(", ")}
          </text>
          <text x="20" y="94" className="fill-ink-500 font-mono text-[9px] dark:fill-parchment-400">
            SCHEMATIC POSE ONLY — NO TORQUE, SPEED, ANGLE, OR STABILITY VALUE IS ASSERTED.
          </text>
        </svg>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 font-mono text-xs md:grid-cols-2">
        <div className="space-y-3 rounded-lg border border-parchment-200 bg-parchment-100 p-3 dark:border-ink-800 dark:bg-ink-900">
          <div className="flex items-center justify-between text-ink-700 dark:text-parchment-200">
            <label htmlFor="kamen-topology-state" className="font-bold">
              Claim-reading state
            </label>
            <span className="text-[10px] text-ink-500 dark:text-ink-400">QUALITATIVE</span>
          </div>
          <div id="kamen-topology-state" className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {KAMEN_TRANSPORTER_TOPOLOGY_STATES.map((state, index) => (
              <button
                key={state}
                type="button"
                data-audit-primary-control={index === 0 ? "true" : undefined}
                onClick={() => updateParam("topologyState", index)}
                className={`rounded px-2 py-1.5 text-left text-[10px] font-bold transition-colors ${
                  selectedStateIndex === index
                    ? "bg-cyan-600 text-white"
                    : "bg-parchment-200 text-ink-700 hover:bg-parchment-300 dark:bg-ink-800 dark:text-ink-300 dark:hover:bg-ink-700"
                }`}
              >
                {KAMEN_TRANSPORTER_TOPOLOGY_LABELS[state].toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-parchment-200 bg-parchment-100 p-3 text-ink-700 dark:border-ink-800 dark:bg-ink-900 dark:text-parchment-200">
          <p className="font-bold">Source boundary</p>
          <p className="mt-1 leading-relaxed text-[11px] text-ink-600 dark:text-ink-400">
            The checked claims describe a control loop, independently controlled ground-contacting
            wheels, cluster positioning, and a stair state sequence. They do not publish a drive
            rating, response law, operating speed, or stability margin.
          </p>
        </div>

        <div className="col-span-full border-t border-parchment-200 pt-2 dark:border-ink-800">
          <ClaimConstraintToggle
            patentId={patentId}
            claimStates={claimStates}
            onClaimStateChange={(number, active) =>
              updateParam(claimConstraintStateParamId(number), active ? 1 : 0)
            }
          />
        </div>
      </div>
    </div>
  );
}
