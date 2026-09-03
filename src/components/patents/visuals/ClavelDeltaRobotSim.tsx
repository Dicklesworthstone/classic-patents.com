"use client";

import { RotateCcw } from "lucide-react";
import { useId, useMemo } from "react";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { applyClaimConstraintModifications } from "@/physics/claimConstraints";
import {
  CLAVEL_DELTA_ROBOT_CLAIM_PROBE_PARAMS,
  type ClavelDeltaVec3,
  readClavelDeltaRobotClaimStates,
  stepClavelDeltaRobotTopology,
} from "@/physics/clavelDeltaRobotKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

const PATENT_ID = "us-4976582-clavel-delta-robot";

function project([x, y, z]: ClavelDeltaVec3): readonly [number, number] {
  return [378 + x * 122 + z * 58, 350 - y * 126 + z * 30];
}

function points(values: readonly ClavelDeltaVec3[]): string {
  return values.map((value) => project(value).join(",")).join(" ");
}

function line(
  start: ClavelDeltaVec3,
  end: ClavelDeltaVec3,
): { x1: number; y1: number; x2: number; y2: number } {
  const [x1, y1] = project(start);
  const [x2, y2] = project(end);
  return { x1, y1, x2, y2 };
}

const ARM_CONTROLS = [
  { id: "armOneInput", label: "Arm 1 input", accent: "accent-cyan-400" },
  { id: "armTwoInput", label: "Arm 2 input", accent: "accent-amber-400" },
  { id: "armThreeInput", label: "Arm 3 input", accent: "accent-violet-400" },
] as const;

/**
 * Source-bounded two-dimensional companion to the Three.js studio. It is not
 * a backdrop: every displayed upper arm, lower pair, platform and probe state
 * is calculated by the same normalized kernel used by the telemetry and 3D face.
 */
export function ClavelDeltaRobotSim() {
  const patternId = useId().replace(/:/g, "");
  const arrowId = useId().replace(/:/g, "");
  const { params, updateParam, resetParams } = usePatentPhysics(PATENT_ID);
  const claimStates = useMemo(() => readClavelDeltaRobotClaimStates(params), [params]);
  const claimResult = useMemo(
    () => applyClaimConstraintModifications(PATENT_ID, params, claimStates),
    [params, claimStates],
  );
  const state = useMemo(
    () => stepClavelDeltaRobotTopology(claimResult.modifiedParams),
    [claimResult.modifiedParams],
  );
  const platformCorners = useMemo(() => {
    const [x, y, z] = state.platformCenter;
    return [
      [x - 0.28, y, z - 0.21],
      [x + 0.28, y, z - 0.21],
      [x + 0.28, y, z + 0.21],
      [x - 0.28, y, z + 0.21],
    ] as const;
  }, [state.platformCenter]);
  const closedPlatformCorners = [...platformCorners, platformCorners[0] ?? state.platformCenter];
  const toolTop = [
    state.platformCenter[0],
    state.platformCenter[1] - 0.44,
    state.platformCenter[2],
  ] as const;
  const baseTriangle = state.legs.map((leg) => leg.basePivot);
  const [toolCenterX, toolCenterY] = project(toolTop);
  const toolOrientationEnd = [
    toolCenterX + Math.cos(state.toolAxisRotationRad) * 26,
    toolCenterY + Math.sin(state.toolAxisRotationRad) * 15,
  ] as const;

  const setClaim = (number: number, active: boolean) => {
    const key =
      CLAVEL_DELTA_ROBOT_CLAIM_PROBE_PARAMS[
        number as keyof typeof CLAVEL_DELTA_ROBOT_CLAIM_PROBE_PARAMS
      ];
    if (key) updateParam(key, active ? 1 : 0);
  };

  return (
    <section
      className="overflow-hidden rounded-2xl border border-cyan-800/55 bg-slate-950 text-slate-100 shadow-2xl"
      data-testid="clavel-delta-robot-two"
      data-clavel-topology={state.topologyVisible ? "present" : "withheld"}
      data-clavel-paired-bars={state.pairedBarsVisible ? "two-per-leg" : "withheld"}
      data-clavel-tool-drive={state.toolAxisVisible ? "present" : "withheld"}
      data-clavel-bar-length={state.normalizedBarLength.toFixed(6)}
      data-clavel-closure-residual={state.closureResidual.toExponential(3)}
      data-clavel-platform-center={state.platformCenter.map((value) => value.toFixed(6)).join(",")}
      data-clavel-tool-angle-rad={state.toolAxisRotationRad.toFixed(6)}
      data-clavel-runtime-source={state.runtimeSource}
      data-clavel-topology-owner={state.topologyOwner}
      data-clavel-frankensim-boundary={state.frankenSimBoundary}
      data-clavel-world-support="fixed-boundary-symbol"
    >
      <header className="border-b border-cyan-900/70 bg-slate-900/85 px-4 py-3 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.16em] text-cyan-300">
          US 4,976,582 · THREE-LEG PARALLEL TOPOLOGY
        </p>
        <h3 className="mt-1 font-serif text-xl text-white">Clavel Delta linkage instrument</h3>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">
          Move the three source-backed actuator inputs. Each leg deliberately shows a control arm
          and both lower bars; a declared fixed normalized length plus their shared displacement
          vector makes the paired-bar invariant visible. All coordinates are normalized exhibit
          construction, not recovered machine dimensions, speed, force, payload, or accuracy.
        </p>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 border-b border-cyan-900/70 p-3 lg:border-b-0 lg:border-r sm:p-5">
          <svg
            viewBox="0 0 760 520"
            role="img"
            aria-label="Interactive Clavel Delta robot topology showing three base actuator arms, six paired lower bars, a fixed-attitude platform, and a tool axis"
            className="h-auto w-full rounded-xl border border-slate-700 bg-[radial-gradient(circle_at_50%_36%,_#164e63,_#020617_68%)]"
          >
            <defs>
              <pattern id={patternId} width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M28 0H0V28" fill="none" stroke="#164e63" strokeWidth="1" />
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
                <path d="M0 0L10 5L0 10z" fill="#fbbf24" />
              </marker>
            </defs>
            <rect width="760" height="520" fill={`url(#${patternId})`} />
            <text x="26" y="32" fill="#67e8f9" fontSize="12" fontFamily="monospace">
              FIG. 1 TOPOLOGY · NORMALIZED AXONOMETRIC PROJECTION
            </text>
            <text x="26" y="495" fill="#94a3b8" fontSize="10" fontFamily="monospace">
              rigid relation: |bar A| = |bar B| = L*; lower-bar A displacement = lower-bar B
              displacement
            </text>

            <g aria-label="Fixed-world exhibit support, not a patent part">
              <line x1="122" y1="62" x2="638" y2="62" stroke="#94a3b8" strokeWidth="5" />
              {[148, 196, 244, 292, 340, 388, 436, 484, 532, 580, 628].map((x) => (
                <line
                  key={`fixed-hatch-${x}`}
                  x1={x}
                  y1="62"
                  x2={x - 14}
                  y2="46"
                  stroke="#64748b"
                  strokeWidth="3"
                />
              ))}
              {baseTriangle.map((basePoint, index) => {
                const [baseX, baseY] = project(basePoint);
                return (
                  <line
                    key={`fixed-hanger-${index}`}
                    x1={baseX}
                    y1="64"
                    x2={baseX}
                    y2={baseY}
                    stroke="#64748b"
                    strokeWidth="4"
                    strokeDasharray="8 6"
                  />
                );
              })}
              <text
                x="730"
                y="82"
                textAnchor="end"
                fill="#cbd5e1"
                stroke="#020617"
                strokeWidth="4"
                paintOrder="stroke"
                fontSize="10"
                fontFamily="monospace"
              >
                FIXED-WORLD SUPPORT SYMBOL · EXHIBIT FRAME, NOT A PATENT PART
              </text>
            </g>

            <polygon
              points={points(baseTriangle)}
              fill="#0f172a"
              fillOpacity="0.9"
              stroke="#38bdf8"
              strokeWidth="3"
            />
            <text
              x="378"
              y="112"
              textAnchor="middle"
              fill="#bae6fd"
              fontSize="11"
              fontFamily="monospace"
            >
              BASE MEMBER 1 · THREE FIXED ACTUATOR PORTIONS 3
            </text>

            {state.legs.map((leg, index) => {
              const armLine = line(leg.basePivot, leg.controlArmEnd);
              const barA = line(leg.upperJointA, leg.lowerJointA);
              const barB = line(leg.upperJointB, leg.lowerJointB);
              const [baseX, baseY] = project(leg.basePivot);
              const [elbowX, elbowY] = project(leg.controlArmEnd);
              const color = ["#67e8f9", "#fbbf24", "#c4b5fd"][index] ?? "#67e8f9";
              return (
                <g key={`leg-${leg.index}`}>
                  <line
                    {...armLine}
                    stroke={color}
                    strokeWidth="16"
                    opacity={state.topologyVisible ? 0.17 : 0.05}
                    strokeLinecap="round"
                  />
                  <line
                    {...armLine}
                    stroke={color}
                    strokeWidth="6"
                    opacity={state.topologyVisible ? 1 : 0.25}
                    strokeLinecap="round"
                  />
                  <line
                    {...barA}
                    stroke={color}
                    strokeWidth="5"
                    opacity={state.topologyVisible ? 1 : 0.2}
                    strokeLinecap="round"
                  />
                  <line
                    {...barB}
                    stroke={color}
                    strokeWidth="5"
                    opacity={state.topologyVisible && state.pairedBarsVisible ? 0.92 : 0.12}
                    strokeLinecap="round"
                    strokeDasharray={state.pairedBarsVisible ? undefined : "7 6"}
                  />
                  <circle
                    cx={baseX}
                    cy={baseY}
                    r="12"
                    fill="#0f172a"
                    stroke={color}
                    strokeWidth="3"
                  />
                  <circle
                    cx={elbowX}
                    cy={elbowY}
                    r="8"
                    fill="#0f172a"
                    stroke={color}
                    strokeWidth="2"
                  />
                  <text
                    x={baseX}
                    y={baseY + 4}
                    textAnchor="middle"
                    fill={color}
                    fontSize="11"
                    fontFamily="monospace"
                  >
                    {index + 1}
                  </text>
                  <text
                    x={elbowX + 10}
                    y={elbowY - 10}
                    fill={color}
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    4 · {index + 1}
                  </text>
                </g>
              );
            })}

            <polygon
              points={points(closedPlatformCorners)}
              fill={state.topologyVisible ? "#164e63" : "#3f1d2e"}
              stroke={state.topologyVisible ? "#a5f3fc" : "#fb7185"}
              strokeWidth="3"
              opacity={state.topologyVisible ? 1 : 0.45}
            />
            <text
              x={project(state.platformCenter)[0]}
              y={project(state.platformCenter)[1] + 4}
              textAnchor="middle"
              fill="#ecfeff"
              fontSize="12"
              fontFamily="monospace"
            >
              8
            </text>
            <text
              x={project(state.platformCenter)[0]}
              y={project(state.platformCenter)[1] + 33}
              textAnchor="middle"
              fill="#a5f3fc"
              fontSize="10"
              fontFamily="monospace"
            >
              MOVABLE MEMBER · ATTITUDE FIXED
            </text>

            {state.toolAxisVisible ? (
              <g>
                <line
                  {...line(state.platformCenter, toolTop)}
                  stroke="#fbbf24"
                  strokeWidth="7"
                  strokeLinecap="round"
                  markerEnd={`url(#${arrowId})`}
                />
                <circle
                  cx={project(toolTop)[0]}
                  cy={project(toolTop)[1]}
                  r="13"
                  fill="#713f12"
                  stroke="#fde68a"
                  strokeWidth="3"
                />
                <text
                  x={project(toolTop)[0]}
                  y={project(toolTop)[1] + 4}
                  textAnchor="middle"
                  fill="#fef3c7"
                  fontSize="11"
                  fontFamily="monospace"
                >
                  9
                </text>
                <line
                  x1={toolCenterX}
                  y1={toolCenterY}
                  x2={toolOrientationEnd[0]}
                  y2={toolOrientationEnd[1]}
                  stroke="#67e8f9"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <circle
                  cx={toolOrientationEnd[0]}
                  cy={toolOrientationEnd[1]}
                  r="5"
                  fill="#67e8f9"
                />
                <text
                  x={project(toolTop)[0] + 20}
                  y={project(toolTop)[1] + 25}
                  fill="#fde68a"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  TOOL AXIS 10 · Claim 8
                </text>
              </g>
            ) : (
              <text
                x="378"
                y="448"
                textAnchor="middle"
                fill="#fda4af"
                fontSize="12"
                fontFamily="monospace"
              >
                CLAIM 8 BASE TOOL-AXIS DRIVE WITHHELD
              </text>
            )}

            {!state.topologyVisible && (
              <g>
                <rect
                  x="150"
                  y="206"
                  width="456"
                  height="82"
                  rx="10"
                  fill="#4c0519"
                  fillOpacity="0.89"
                />
                <text
                  x="378"
                  y="241"
                  textAnchor="middle"
                  fill="#fecdd3"
                  fontSize="15"
                  fontFamily="monospace"
                >
                  CLAIM 1 TOPOLOGY WITHHELD
                </text>
                <text
                  x="378"
                  y="265"
                  textAnchor="middle"
                  fill="#fda4af"
                  fontSize="11"
                  fontFamily="monospace"
                >
                  No source-backed orientation-preserving platform is asserted.
                </text>
              </g>
            )}
          </svg>

          <div className="mt-3 grid gap-2 text-xs sm:grid-cols-4">
            <div className="rounded-lg border border-cyan-800/70 bg-cyan-950/40 p-2.5">
              <span className="text-cyan-300">Claim 1</span>
              <span className="float-right font-mono">
                {state.topologyVisible ? "VISIBLE" : "WITHHELD"}
              </span>
            </div>
            <div className="rounded-lg border border-violet-800/70 bg-violet-950/35 p-2.5">
              <span className="text-violet-300">Claim 2</span>
              <span className="float-right font-mono">
                {state.pairedBarsVisible ? "TWO BARS / LEG" : "WITHHELD"}
              </span>
            </div>
            <div className="rounded-lg border border-amber-800/70 bg-amber-950/35 p-2.5">
              <span className="text-amber-300">Attitude</span>
              <span className="float-right font-mono">
                Δ = {state.platformAttitudeDeviation.toFixed(2)}
              </span>
            </div>
            <div className="rounded-lg border border-emerald-800/70 bg-emerald-950/35 p-2.5">
              <span className="text-emerald-300">Rigid closure</span>
              <span className="float-right font-mono">
                L* {state.normalizedBarLength.toFixed(3)} · ε{" "}
                {state.closureResidual.toExponential(1)}
              </span>
            </div>
          </div>
        </div>

        <aside className="space-y-4 bg-slate-950/70 p-4">
          {ARM_CONTROLS.map((control) => {
            const value = params[control.id] ?? 0;
            return (
              <label className="block text-sm text-slate-200" key={control.id}>
                {control.label}
                <span className="float-right font-mono text-cyan-300">{value.toFixed(2)}</span>
                <input
                  className={`mt-1 w-full ${control.accent}`}
                  type="range"
                  min="-1"
                  max="1"
                  step="0.02"
                  value={value}
                  aria-label={control.label}
                  onChange={(event) => updateParam(control.id, Number(event.target.value))}
                />
              </label>
            );
          })}
          <label className="block text-sm text-slate-200">
            Tool-axis input
            <span className="float-right font-mono text-amber-300">
              {(params.toolAxisInput ?? 0).toFixed(2)}
            </span>
            <input
              className="mt-1 w-full accent-amber-400"
              type="range"
              min="-1"
              max="1"
              step="0.02"
              value={params.toolAxisInput ?? 0}
              aria-label="Tool-axis normalized input"
              onChange={(event) => updateParam("toolAxisInput", Number(event.target.value))}
            />
          </label>
          <div className="rounded-lg border border-rose-900/70 bg-rose-950/30 p-3 text-xs leading-5 text-rose-100">
            <strong className="font-mono text-rose-300">SOURCE BOUNDARY</strong>
            <br />
            {state.refusal.reason}
          </div>
          <ClaimConstraintToggle
            patentId={PATENT_ID}
            claimStates={{ ...claimStates }}
            onToggleClaim={setClaim}
          />
          <button
            type="button"
            onClick={resetParams}
            className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-900 px-3 text-sm text-slate-200 hover:bg-slate-800"
          >
            <RotateCcw className="h-4 w-4" />
            Reset normalized topology
          </button>
        </aside>
      </div>
    </section>
  );
}
