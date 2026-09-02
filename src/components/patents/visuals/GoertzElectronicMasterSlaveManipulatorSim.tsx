"use client";

import { RotateCcw } from "lucide-react";
import { useId, useMemo } from "react";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import { stepGoertzMasterSlaveTopology } from "@/physics/goertzElectronicMasterSlaveManipulatorKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

const PATENT_ID = "us-2846084-goertz-electronic-master-slave-manipulator";

function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function armPoints(
  originX: number,
  baseY: number,
  horizontalPivot: number,
  verticalPivot: number,
  toolAxis171: number,
  toolAxis172: number,
) {
  const shoulder = -Math.PI / 2 + horizontalPivot * 0.75;
  const elbow = shoulder + 0.72 + verticalPivot * 0.9;
  const wrist = elbow + toolAxis171 * 0.48;
  const upperLength = 92;
  const lowerLength = 84;
  const toolLength = 38;
  const elbowX = originX + Math.cos(shoulder) * upperLength;
  const elbowY = baseY + Math.sin(shoulder) * upperLength;
  const wristX = elbowX + Math.cos(elbow) * lowerLength;
  const wristY = elbowY + Math.sin(elbow) * lowerLength;
  return {
    elbowX,
    elbowY,
    wristX,
    wristY,
    toolX: wristX + Math.cos(wrist + toolAxis172 * 0.46) * toolLength,
    toolY: wristY + Math.sin(wrist + toolAxis172 * 0.46) * toolLength,
  };
}

function channelSlider({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label htmlFor={id} className="block text-xs text-slate-200">
      {label}
      <span className="float-right font-mono text-cyan-300">{value.toFixed(2)}</span>
      <input
        id={id}
        className="mt-1 w-full accent-cyan-400"
        type="range"
        min="-1"
        max="1"
        step="0.01"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export function GoertzElectronicMasterSlaveManipulatorSim() {
  const horizontalPivotId = useId();
  const verticalPivotId = useId();
  const axis171Id = useId();
  const axis172Id = useId();
  const gripperId = useId();
  const contactId = useId();
  const { params, effectiveParams, claimStates, claimConstraintResult, updateParam, resetParams } =
    usePatentPhysics(PATENT_ID);
  const pose = useMemo(() => stepGoertzMasterSlaveTopology(effectiveParams), [effectiveParams]);
  const master = armPoints(
    158,
    302,
    pose.masterChannels[0] ?? 0,
    pose.masterChannels[2] ?? 0,
    pose.masterChannels[4] ?? 0,
    pose.masterChannels[5] ?? 0,
  );
  const slave = armPoints(
    482,
    302,
    pose.slaveChannels[0] ?? 0,
    pose.slaveChannels[2] ?? 0,
    pose.slaveChannels[4] ?? 0,
    pose.slaveChannels[5] ?? 0,
  );
  const closure = pose.slaveChannels[6] ?? 0;
  const contact = params.contactResistance ?? 0;

  return (
    <section className="overflow-hidden rounded-2xl border border-cyan-800/70 bg-slate-950 text-slate-100 shadow-2xl">
      <header className="border-b border-cyan-900/70 bg-slate-900/90 px-4 py-3 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.16em] text-cyan-300">
          US 2,846,084 · SEVEN-CHANNEL BILATERAL TOPOLOGY
        </p>
        <h3 className="mt-1 font-serif text-xl text-white">Goertz master–slave correspondence</h3>
        <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-300">
          Move the master channels. The remote arm tracks unless an illustrative contact state
          introduces a source-shaped position mismatch; Claim 9’s force reflection returns that
          mismatch to the master display. Values are normalized because the grant does not state a
          physical arm scale, force calibration, or servo bandwidth.
        </p>
      </header>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="min-w-0 border-b border-cyan-900/70 p-3 lg:border-b-0 lg:border-r sm:p-5">
          <svg
            viewBox="0 0 640 390"
            role="img"
            aria-label="Normalized bilateral master slave manipulator with master handle, remote claw, and seven correspondence channels"
            className="h-auto w-full rounded-xl border border-slate-700 bg-[radial-gradient(circle_at_50%_15%,_#123b5e,_#020617_68%)]"
          >
            <defs>
              <pattern
                id="goertz-topology-grid"
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#153650" strokeWidth="1" />
              </pattern>
              <marker
                id="goertz-topology-arrow"
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
            <rect width="640" height="390" fill="url(#goertz-topology-grid)" />
            <line x1="320" y1="52" x2="320" y2="341" stroke="#475569" strokeDasharray="6 6" />
            <text x="115" y="32" fill="#67e8f9" fontSize="13" fontFamily="monospace">
              MASTER / OPERATOR
            </text>
            <text x="410" y="32" fill="#c4b5fd" fontSize="13" fontFamily="monospace">
              SLAVE / REMOTE CELL
            </text>
            <text
              x="320"
              y="372"
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="10"
              fontFamily="monospace"
            >
              normalized source topology — no scale, payload, force, speed, or bandwidth claim
            </text>

            <rect x="64" y="306" width="126" height="18" rx="5" fill="#0f172a" stroke="#64748b" />
            <rect x="442" y="306" width="126" height="18" rx="5" fill="#0f172a" stroke="#64748b" />
            <text
              x="127"
              y="347"
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="10"
              fontFamily="monospace"
            >
              support 50
            </text>
            <text
              x="505"
              y="347"
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="10"
              fontFamily="monospace"
            >
              sealed remote side
            </text>

            <line
              x1="158"
              y1="302"
              x2={master.elbowX}
              y2={master.elbowY}
              stroke="#22d3ee"
              strokeWidth="15"
              strokeLinecap="round"
            />
            <line
              x1={master.elbowX}
              y1={master.elbowY}
              x2={master.wristX}
              y2={master.wristY}
              stroke="#0ea5e9"
              strokeWidth="13"
              strokeLinecap="round"
            />
            <line
              x1={master.wristX}
              y1={master.wristY}
              x2={master.toolX}
              y2={master.toolY}
              stroke="#fbbf24"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <circle cx="158" cy="302" r="15" fill="#082f49" stroke="#67e8f9" strokeWidth="3" />
            <circle
              cx={master.elbowX}
              cy={master.elbowY}
              r="11"
              fill="#082f49"
              stroke="#67e8f9"
              strokeWidth="3"
            />
            <circle
              cx={master.wristX}
              cy={master.wristY}
              r="9"
              fill="#78350f"
              stroke="#fde68a"
              strokeWidth="2"
            />
            <circle cx={master.toolX} cy={master.toolY} r="8" fill="#fbbf24" />
            <text x="84" y="285" fill="#bae6fd" fontSize="10" fontFamily="monospace">
              handle 53
            </text>

            <line
              x1="482"
              y1="302"
              x2={slave.elbowX}
              y2={slave.elbowY}
              stroke="#a78bfa"
              strokeWidth="15"
              strokeLinecap="round"
            />
            <line
              x1={slave.elbowX}
              y1={slave.elbowY}
              x2={slave.wristX}
              y2={slave.wristY}
              stroke="#8b5cf6"
              strokeWidth="13"
              strokeLinecap="round"
            />
            <line
              x1={slave.wristX}
              y1={slave.wristY}
              x2={slave.toolX}
              y2={slave.toolY}
              stroke="#fbbf24"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <circle cx="482" cy="302" r="15" fill="#2e1065" stroke="#c4b5fd" strokeWidth="3" />
            <circle
              cx={slave.elbowX}
              cy={slave.elbowY}
              r="11"
              fill="#2e1065"
              stroke="#c4b5fd"
              strokeWidth="3"
            />
            <circle
              cx={slave.wristX}
              cy={slave.wristY}
              r="9"
              fill="#78350f"
              stroke="#fde68a"
              strokeWidth="2"
            />
            <path
              d={`M ${slave.toolX - 6} ${slave.toolY - 11 - closure * 7} L ${slave.toolX + 10} ${slave.toolY - 2} L ${slave.toolX - 6} ${slave.toolY + 7 + closure * 7}`}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text x="498" y="282" fill="#ddd6fe" fontSize="10" fontFamily="monospace">
              claw / grasper
            </text>

            {GOERTZ_CHANNEL_LABELS.map((label, index) => {
              const y = 64 + index * 28;
              const error = Math.abs(pose.positionErrors[index] ?? 0);
              return (
                <g key={label}>
                  <text
                    x="234"
                    y={y + 5}
                    fill="#94a3b8"
                    fontSize="9"
                    textAnchor="end"
                    fontFamily="monospace"
                  >
                    {label}
                  </text>
                  <line
                    x1="244"
                    y1={y}
                    x2="396"
                    y2={y}
                    stroke="#155e75"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="244"
                    y1={y}
                    x2={244 + (1 - error) * 152}
                    y2={y}
                    stroke="#22d3ee"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="244" cy={y} r="4" fill="#67e8f9" />
                  <circle cx="396" cy={y} r="4" fill="#c4b5fd" />
                </g>
              );
            })}

            {contact > 0.01 && (
              <g>
                <line
                  x1={slave.toolX + 13}
                  y1={slave.toolY}
                  x2={slave.toolX + 55}
                  y2={slave.toolY}
                  stroke="#fb7185"
                  strokeWidth="5"
                  markerEnd="url(#goertz-topology-arrow)"
                />
                <text
                  x={slave.toolX + 17}
                  y={slave.toolY - 12}
                  fill="#fda4af"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  remote resistance
                </text>
              </g>
            )}
            {pose.forceReflectionEnabled && pose.reflectedResistance > 0.01 && (
              <g>
                <path
                  d="M 450 350 C 410 324 232 324 190 350"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3"
                  strokeDasharray="7 5"
                  markerEnd="url(#goertz-topology-arrow)"
                />
                <text
                  x="320"
                  y="337"
                  textAnchor="middle"
                  fill="#fde68a"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  Claim 9 reflected resistance
                </text>
              </g>
            )}
          </svg>

          <div className="mt-3 grid gap-2 text-xs sm:grid-cols-4">
            <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-2">
              <p className="font-mono text-cyan-300">STATE</p>
              <p className="mt-1 text-slate-200">{pose.state}</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-2">
              <p className="font-mono text-amber-300">MAX ERROR</p>
              <p className="mt-1 text-slate-200">{percent(pose.errorMagnitude)} normalized</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-2">
              <p className="font-mono text-purple-300">CLAIM PROBE</p>
              <p className="mt-1 text-slate-200">Claim {pose.activeClaim}</p>
            </div>
            <div className="rounded-lg border border-rose-900/70 bg-rose-950/35 p-2">
              <p className="font-mono text-rose-300">SI PREDICTION</p>
              <p className="mt-1 text-slate-200">Refused</p>
            </div>
          </div>
        </div>

        <form className="space-y-4 p-4 sm:p-5" onSubmit={(event) => event.preventDefault()}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {channelSlider({
              id: horizontalPivotId,
              label: "Horizontal arm · axis 113b",
              value: params.horizontalArmPivot ?? 0,
              onChange: (value) => updateParam("horizontalArmPivot", value),
            })}
            {channelSlider({
              id: verticalPivotId,
              label: "Vertical arm · axis 126",
              value: params.verticalArmPivot ?? 0,
              onChange: (value) => updateParam("verticalArmPivot", value),
            })}
            {channelSlider({
              id: axis171Id,
              label: "Tool · axis 171",
              value: params.toolAxis171 ?? 0,
              onChange: (value) => updateParam("toolAxis171", value),
            })}
            {channelSlider({
              id: axis172Id,
              label: "Tool · axis 172",
              value: params.toolAxis172 ?? 0,
              onChange: (value) => updateParam("toolAxis172", value),
            })}
          </div>
          <label htmlFor={gripperId} className="block text-xs text-slate-200">
            Tool closure
            <span className="float-right font-mono text-amber-300">
              {percent(params.gripperClosure ?? 0)}
            </span>
            <input
              id={gripperId}
              className="mt-1 w-full accent-amber-400"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={params.gripperClosure ?? 0}
              onChange={(event) => updateParam("gripperClosure", Number(event.target.value))}
            />
          </label>
          <label htmlFor={contactId} className="block text-xs text-slate-200">
            Illustrative remote contact resistance
            <span className="float-right font-mono text-rose-300">{percent(contact)}</span>
            <input
              id={contactId}
              className="mt-1 w-full accent-rose-400"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={contact}
              onChange={(event) => updateParam("contactResistance", Number(event.target.value))}
            />
          </label>
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
          <button
            type="button"
            onClick={resetParams}
            className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-900 px-3 text-xs text-slate-200 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset source topology
          </button>
          <p className="rounded-lg border border-rose-900/70 bg-rose-950/30 p-2 text-[11px] leading-5 text-rose-100">
            {pose.refusal.reason}
          </p>
        </form>
      </div>
    </section>
  );
}

const GOERTZ_CHANNEL_LABELS = ["113b", "arm roll", "126", "arm roll", "171", "172", "grip"];
