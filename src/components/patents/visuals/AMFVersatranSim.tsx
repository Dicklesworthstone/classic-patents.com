"use client";

import { RotateCcw } from "lucide-react";
import { useId, useMemo } from "react";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import {
  AMF_VERSATRAN_CLAIM_PROBE_PARAMS,
  readAmfVersatranClaimStates,
  stepAmfVersatranTopology,
} from "@/physics/amfVersatranKernel";
import { applyClaimConstraintModifications } from "@/physics/claimConstraints";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

const PATENT_ID = "us-3212649-amf-versatran";

const MOTION_CONTROLS = [
  {
    id: "columnRotation",
    label: "Column rotation",
    min: -1,
    max: 1,
    step: 0.05,
    defaultValue: 0,
    accent: "accent-cyan-400",
  },
  {
    id: "carriageLift",
    label: "Carriage lift",
    min: 0,
    max: 1,
    step: 0.05,
    defaultValue: 0.55,
    accent: "accent-violet-400",
  },
  {
    id: "armTravel",
    label: "Arm travel",
    min: 0,
    max: 1,
    step: 0.05,
    defaultValue: 0.55,
    accent: "accent-amber-400",
  },
  {
    id: "wristRotation",
    label: "Wrist rotation · arm axis",
    min: -1,
    max: 1,
    step: 0.05,
    defaultValue: 0,
    accent: "accent-purple-400",
  },
  {
    id: "wristSwing",
    label: "Wrist swing · vertical axis",
    min: -1,
    max: 1,
    step: 0.05,
    defaultValue: 0,
    accent: "accent-purple-400",
  },
  {
    id: "gripperOperation",
    label: "Gripper operation",
    min: 0,
    max: 1,
    step: 0.05,
    defaultValue: 0.25,
    accent: "accent-amber-400",
  },
] as const;

function normalized(value: number) {
  return value.toFixed(2);
}

function programModeLabel(mode: "manual-teach-and-record" | "automatic-recorded-signal-playback") {
  return mode === "manual-teach-and-record"
    ? "MANUAL TEACH / RECORD"
    : "AUTOMATIC RECORDED-SIGNAL PLAYBACK";
}

/**
 * Shared 2D face for the six motions disclosed by Claim 1. Every spatial
 * coordinate is a normalized drawing convention; the lower strip shows only
 * the source-described record-versus-feedback comparison relationship.
 */
export function AmfVersatranSim() {
  const gridId = useId().replace(/:/g, "");
  const arrowId = useId().replace(/:/g, "");
  const { params, updateParam, resetParams } = usePatentPhysics(PATENT_ID);
  const claimStates = useMemo(() => readAmfVersatranClaimStates(params), [params]);
  const claimResult = useMemo(
    () => applyClaimConstraintModifications(PATENT_ID, params, claimStates),
    [params, claimStates],
  );
  const state = useMemo(
    () => stepAmfVersatranTopology(claimResult.modifiedParams),
    [claimResult.modifiedParams],
  );
  const claim8Active = claimStates[8] ?? true;
  const claim12Active = claimStates[12] ?? true;
  const { controls, displayPose } = state;

  const columnX = 206;
  const floorY = 399;
  const carriageY = 326 - controls.carriageLift * 184;
  const armLength = 106 + controls.armTravel * 152;
  const wristX = columnX + 30 + armLength;
  const jawGap = 12 + displayPose.gripperOpenFraction * 16;
  const wristIndexLength = 12;
  const wristIndexX = wristX + Math.cos(displayPose.wristRotationDisplayRad) * wristIndexLength;
  const wristIndexY = carriageY + Math.sin(displayPose.wristRotationDisplayRad) * wristIndexLength;
  const pinionAngleDeg = (displayPose.gripperPinionRotationDisplayRad * 180) / Math.PI;
  const rackOffset = (displayPose.gripperRackTravelFraction - 0.5) * 18;

  const planCenterX = 636;
  const planCenterY = 239;
  const planRadius = 58 + controls.armTravel * 87;
  const planToolX = planCenterX + Math.cos(displayPose.columnRotationDisplayRad) * planRadius;
  const planToolY = planCenterY - Math.sin(displayPose.columnRotationDisplayRad) * planRadius;
  const toolHeading = displayPose.columnRotationDisplayRad + displayPose.wristSwingDisplayRad;
  const toolIndicatorX = planToolX + Math.cos(toolHeading) * 34;
  const toolIndicatorY = planToolY - Math.sin(toolHeading) * 34;
  const gripperPath =
    "M" +
    (wristX + 47) +
    " " +
    (carriageY - jawGap) +
    "h22v11h-13M" +
    (wristX + 47) +
    " " +
    (carriageY + jawGap) +
    "h22v-11h-13";
  const liftArrow = `M${columnX - 58} 121V${carriageY - 30}`;
  const armArrow = `M${columnX + 39} ${carriageY - 42}H${wristX - 6}`;
  const teachPath = `M${columnX - 24} 112L${columnX - 88} 78L${columnX - 112} 102`;
  const wristArc =
    "M" +
    (wristX - 14) +
    " " +
    (carriageY - 15) +
    "A21 21 0 0 1 " +
    (wristX + 15) +
    " " +
    (carriageY - 13);

  return (
    <section className="overflow-hidden rounded-2xl border border-cyan-800/60 bg-slate-950 text-slate-100 shadow-2xl">
      <header className="border-b border-cyan-900/70 bg-slate-900/85 px-4 py-3 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.16em] text-cyan-300">
          US 3,212,649 · SIX-MOTION / TEACH–RECORD TOPOLOGY
        </p>
        <h3 className="mt-1 font-serif text-xl text-white">AMF Versatran programming instrument</h3>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">
          Claim 1 separates column rotation, carriage lift, arm travel, two distinct wrist motions,
          and gripper operation. The lower comparison is a normalized illustration of recorded and
          feedback signals—not a voltage, distance, speed, or force calculation.
        </p>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 border-b border-cyan-900/70 p-3 lg:border-b-0 lg:border-r sm:p-5">
          <svg
            viewBox="0 0 880 600"
            role="img"
            aria-label="Interactive AMF Versatran six-motion normalized topology with elevation, plan, and recorded-signal comparison"
            className="h-auto w-full rounded-xl border border-slate-700 bg-[radial-gradient(circle_at_60%_28%,_#164e63,_#020617_69%)]"
          >
            <defs>
              <pattern id={gridId} width="28" height="28" patternUnits="userSpaceOnUse">
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
                <path d="M0 0L10 5L0 10z" fill="#67e8f9" />
              </marker>
            </defs>
            <rect width="880" height="600" fill={`url(#${gridId})`} />
            <text x="34" y="35" fill="#67e8f9" fontFamily="monospace" fontSize="12">
              ELEVATION · B / C / A / G
            </text>
            <text x="520" y="35" fill="#fbbf24" fontFamily="monospace" fontSize="12">
              PLAN · COLUMN ROTATION + WRIST SWING
            </text>

            <g aria-label="Normalized Versatran elevation">
              <line x1="42" y1={floorY} x2="415" y2={floorY} stroke="#475569" strokeWidth="3" />
              <rect
                x="132"
                y="382"
                width="150"
                height="22"
                rx="5"
                fill="#1e293b"
                stroke="#94a3b8"
              />
              <ellipse cx={columnX} cy="382" rx="55" ry="12" fill="#334155" stroke="#67e8f9" />
              <rect
                x={columnX - 30}
                y="95"
                width="60"
                height="287"
                rx="14"
                fill="#475569"
                stroke="#94a3b8"
                strokeWidth="2"
              />
              <rect
                x={columnX - 38}
                y={carriageY - 24}
                width="76"
                height="48"
                rx="7"
                fill="#0e7490"
                stroke="#67e8f9"
                strokeWidth="2"
              />
              <rect
                x={columnX + 27}
                y={carriageY - 12}
                width={armLength}
                height="24"
                rx="6"
                fill="#0891b2"
                stroke="#67e8f9"
                strokeWidth="2"
              />
              <line
                x1={columnX + 38}
                y1={carriageY + 22}
                x2={wristX - 12}
                y2={carriageY + 22}
                stroke="#fbbf24"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <circle
                cx={wristX}
                cy={carriageY}
                r="21"
                fill="#5b21b6"
                stroke="#c4b5fd"
                strokeWidth="3"
              />
              <line
                x1={wristX}
                y1={carriageY}
                x2={wristIndexX}
                y2={wristIndexY}
                stroke="#f5f3ff"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d={wristArc}
                fill="none"
                stroke="#ddd6fe"
                strokeWidth="2"
                markerEnd={`url(#${arrowId})`}
              />
              {displayPose.pinionGripperTopologyEnabled ? (
                <g aria-label="Claim 12 paired pinions and Claim 13 racks">
                  <rect
                    x={wristX + 18}
                    y={carriageY - 10}
                    width="30"
                    height="20"
                    rx="4"
                    fill="#b45309"
                    stroke="#fde68a"
                    strokeWidth="2"
                  />
                  {[carriageY - 9, carriageY + 9].map((pinionY, index) => (
                    <g
                      key={pinionY}
                      transform={`rotate(${index === 0 ? pinionAngleDeg : -pinionAngleDeg} ${wristX + 49} ${pinionY})`}
                    >
                      <circle cx={wristX + 49} cy={pinionY} r="6" fill="#f59e0b" stroke="#fef3c7" />
                      <path
                        d={`M${wristX + 43} ${pinionY}H${wristX + 55}M${wristX + 49} ${pinionY - 6}V${pinionY + 6}`}
                        stroke="#451a03"
                        strokeWidth="1.5"
                      />
                    </g>
                  ))}
                  <path
                    d={gripperPath}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d={`M${wristX + 26 + rackOffset} ${carriageY - 20}H${wristX + 50 + rackOffset}M${wristX + 26 - rackOffset} ${carriageY + 20}H${wristX + 50 - rackOffset}`}
                    stroke="#fef3c7"
                    strokeWidth="2"
                    strokeDasharray="3 2"
                  />
                  <text
                    x={wristX + 55}
                    y={carriageY - 24}
                    fill="#fde68a"
                    fontFamily="monospace"
                    fontSize="8"
                  >
                    334 / 346 · racks
                  </text>
                </g>
              ) : (
                <g aria-label="Claim 12 pinion gripper topology withheld" opacity="0.75">
                  <rect
                    x={wristX + 18}
                    y={carriageY - 10}
                    width="40"
                    height="20"
                    rx="4"
                    fill="#334155"
                    stroke="#fb7185"
                    strokeDasharray="4 3"
                    strokeWidth="2"
                  />
                  <text
                    x={wristX + 22}
                    y={carriageY + 4}
                    fill="#fecdd3"
                    fontFamily="monospace"
                    fontSize="7"
                  >
                    C12 withheld
                  </text>
                </g>
              )}
              <path
                d={liftArrow}
                stroke="#a78bfa"
                strokeDasharray="5 5"
                strokeWidth="2"
                markerEnd={`url(#${arrowId})`}
              />
              <text
                x={columnX - 80}
                y={(121 + carriageY) / 2}
                fill="#c4b5fd"
                fontFamily="monospace"
                fontSize="11"
                transform={`rotate(-90 ${columnX - 80} ${(121 + carriageY) / 2})`}
              >
                carriage lift
              </text>
              <path
                d={armArrow}
                stroke="#fbbf24"
                strokeDasharray="5 5"
                strokeWidth="2"
                markerEnd={`url(#${arrowId})`}
              />
              <text
                x={(columnX + wristX) / 2}
                y={carriageY - 51}
                fill="#fde68a"
                fontFamily="monospace"
                fontSize="11"
                textAnchor="middle"
              >
                arm travel
              </text>
              <text
                x={columnX}
                y="78"
                textAnchor="middle"
                fill="#bae6fd"
                fontFamily="monospace"
                fontSize="12"
              >
                B · COLUMN
              </text>
              <text
                x={columnX}
                y={carriageY + 42}
                textAnchor="middle"
                fill="#a5f3fc"
                fontFamily="monospace"
                fontSize="11"
              >
                C
              </text>
              <text
                x={(columnX + wristX) / 2}
                y={carriageY + 52}
                textAnchor="middle"
                fill="#a5f3fc"
                fontFamily="monospace"
                fontSize="11"
              >
                A · HORIZONTAL ARM
              </text>
              <text
                x={wristX}
                y={carriageY - 31}
                textAnchor="middle"
                fill="#ddd6fe"
                fontFamily="monospace"
                fontSize="11"
              >
                G · WRIST
              </text>
              <text
                x={wristX + 28}
                y={carriageY + 49}
                fill="#ddd6fe"
                fontFamily="monospace"
                fontSize="10"
                textAnchor="middle"
              >
                rotation about arm axis
              </text>
              <text
                x={wristX + 74}
                y={carriageY + 4}
                fill="#fde68a"
                fontFamily="monospace"
                fontSize="11"
              >
                FINGERS
              </text>
              <path
                d={teachPath}
                fill="none"
                stroke="#c084fc"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <circle
                cx={columnX - 115}
                cy="104"
                r="9"
                fill="#7e22ce"
                stroke="#e9d5ff"
                strokeWidth="2"
              />
              <text x={columnX - 125} y="65" fill="#e9d5ff" fontFamily="monospace" fontSize="10">
                PROGRAMMING ARM
              </text>
            </g>

            <g aria-label="Normalized cylindrical plan view">
              <rect
                x="465"
                y="55"
                width="370"
                height="348"
                rx="14"
                fill="#020617"
                fillOpacity="0.38"
                stroke="#164e63"
              />
              <circle cx={planCenterX} cy={planCenterY} r="9" fill="#67e8f9" />
              <circle
                cx={planCenterX}
                cy={planCenterY}
                r={planRadius}
                fill="none"
                stroke="#164e63"
                strokeDasharray="5 6"
              />
              <line
                x1={planCenterX}
                y1={planCenterY}
                x2={planToolX}
                y2={planToolY}
                stroke="#67e8f9"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <line
                x1={planCenterX}
                y1={planCenterY}
                x2={planToolX}
                y2={planToolY}
                stroke="#fbbf24"
                strokeWidth="2"
                strokeDasharray="5 5"
              />
              <circle
                cx={planToolX}
                cy={planToolY}
                r="13"
                fill="#5b21b6"
                stroke="#c4b5fd"
                strokeWidth="2"
              />
              <line
                x1={planToolX}
                y1={planToolY}
                x2={toolIndicatorX}
                y2={toolIndicatorY}
                stroke="#c4b5fd"
                strokeWidth="5"
                strokeLinecap="round"
                markerEnd={`url(#${arrowId})`}
              />
              <path
                d={
                  "M" +
                  (planToolX - 17) +
                  " " +
                  (planToolY - 19) +
                  "A26 26 0 0 1 " +
                  (planToolX + 25) +
                  " " +
                  (planToolY - 3)
                }
                fill="none"
                stroke="#c4b5fd"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <text
                x={planCenterX}
                y={planCenterY + 29}
                textAnchor="middle"
                fill="#bae6fd"
                fontFamily="monospace"
                fontSize="11"
              >
                B · column rotation
              </text>
              <text
                x={planToolX}
                y={planToolY - 31}
                textAnchor="middle"
                fill="#ddd6fe"
                fontFamily="monospace"
                fontSize="10"
              >
                G · wrist swing
              </text>
              <text
                x={planToolX}
                y={planToolY + 45}
                textAnchor="middle"
                fill="#fde68a"
                fontFamily="monospace"
                fontSize="10"
              >
                central vertical axis
              </text>
              <text x="485" y="381" fill="#94a3b8" fontFamily="monospace" fontSize="10">
                column rotation changes arm bearing; wrist swing turns the end member about its
                central vertical axis
              </text>
            </g>

            <g aria-label="Recorded signal comparison">
              <rect
                x="28"
                y="431"
                width="824"
                height="142"
                rx="12"
                fill="#020617"
                fillOpacity="0.74"
                stroke="#0e7490"
              />
              <text x="48" y="456" fill="#67e8f9" fontFamily="monospace" fontSize="11">
                CLAIMS 8–11 · RECORDED COMMAND / POSITION-FEEDBACK COMPARISON (NORMALIZED)
              </text>
              {state.comparisonChannels.map((channel, index) => {
                const rowY = 479 + index * 28;
                const error = Math.abs(channel.normalizedPhaseError);
                return (
                  <g key={channel.motion}>
                    <text x="48" y={rowY + 10} fill="#cbd5e1" fontFamily="monospace" fontSize="10">
                      {channel.label}
                    </text>
                    <rect
                      x="282"
                      y={rowY}
                      width="196"
                      height="10"
                      rx="5"
                      fill="#0f172a"
                      stroke="#334155"
                    />
                    <rect
                      x="282"
                      y={rowY}
                      width={196 * channel.recordedSignalPhase}
                      height="10"
                      rx="5"
                      fill="#06b6d4"
                    />
                    <rect
                      x="501"
                      y={rowY}
                      width="196"
                      height="10"
                      rx="5"
                      fill="#0f172a"
                      stroke="#334155"
                    />
                    <rect
                      x="501"
                      y={rowY}
                      width={196 * channel.feedbackSignalPhase}
                      height="10"
                      rx="5"
                      fill="#a78bfa"
                    />
                    <text x="714" y={rowY + 10} fill="#fda4af" fontFamily="monospace" fontSize="10">
                      |e| {error.toFixed(2)}
                    </text>
                  </g>
                );
              })}
              {!state.claimProbeStates[8] && (
                <text x="48" y="505" fill="#fda4af" fontFamily="monospace" fontSize="11">
                  CLAIM 8 RECORD / PLAYBACK PATH WITHHELD ON THE SHARED BUS
                </text>
              )}
              <text x="282" y="566" fill="#67e8f9" fontFamily="monospace" fontSize="9">
                recorded command
              </text>
              <text x="501" y="566" fill="#c4b5fd" fontFamily="monospace" fontSize="9">
                feedback position signal
              </text>
            </g>
            {!state.claimProbeStates[1] && (
              <g aria-label="Claim 1 six-motion topology withheld">
                <rect
                  x="28"
                  y="84"
                  width="824"
                  height="325"
                  rx="16"
                  fill="#020617"
                  fillOpacity="0.82"
                  stroke="#fb7185"
                  strokeWidth="2"
                />
                <text
                  x="440"
                  y="230"
                  textAnchor="middle"
                  fill="#fecdd3"
                  fontFamily="monospace"
                  fontSize="16"
                >
                  CLAIM 1 SIX-MOTION TOPOLOGY WITHHELD
                </text>
                <text
                  x="440"
                  y="252"
                  textAnchor="middle"
                  fill="#fda4af"
                  fontFamily="monospace"
                  fontSize="10"
                >
                  No unsupported physical failure is inferred from the absent source combination.
                </text>
              </g>
            )}
          </svg>

          <div className="mt-3 grid gap-2 rounded-xl border border-cyan-950 bg-slate-900/70 p-3 sm:grid-cols-3">
            <div>
              <p className="font-mono text-[10px] text-cyan-300">MODE</p>
              <p className="mt-1 text-xs text-slate-100">{programModeLabel(state.programMode)}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-cyan-300">ACTIVE CLAIM</p>
              <p className="mt-1 text-xs text-slate-100">Claim {state.activeClaim}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-cyan-300">MAX |e|</p>
              <p className="mt-1 text-xs text-slate-100">
                {state.maximumNormalizedPhaseError.toFixed(2)} normalized
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-4 bg-slate-950/70 p-4">
          <ClaimConstraintToggle
            patentId={PATENT_ID}
            claimStates={claimStates}
            onToggleClaim={(claimNumber, active) => {
              const claimProbeParam =
                AMF_VERSATRAN_CLAIM_PROBE_PARAMS[
                  claimNumber as keyof typeof AMF_VERSATRAN_CLAIM_PROBE_PARAMS
                ];
              if (claimProbeParam) updateParam(claimProbeParam, active ? 1 : 0);
              if (claimNumber === 8 && !active) updateParam("teachReplayMode", 0);
            }}
          />
          {claimResult.activeFailures.length > 0 && (
            <div role="status" className="rounded-xl border border-rose-800 bg-rose-950/70 p-3">
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-rose-300">
                Source topology withheld
              </p>
              {claimResult.activeFailures.map((failure) => (
                <p key={failure} className="mt-1 text-xs leading-5 text-rose-100">
                  {failure}
                </p>
              ))}
              {claimResult.refusalWarning && (
                <p className="mt-2 text-[11px] leading-4 text-rose-200">
                  {claimResult.refusalWarning}
                </p>
              )}
            </div>
          )}
          <div>
            <p className="font-mono text-[10px] tracking-[0.12em] text-cyan-300">
              CLAIM 1 · SIX DISCLOSED MOTIONS
            </p>
            <ol className="mt-2 space-y-1 text-xs leading-5 text-slate-300">
              {state.disclosedMotions.map((motion) => (
                <li key={motion.id}>
                  <span className="font-mono text-cyan-300">{motion.sourceScope}</span>
                  <br />
                  {motion.label}
                </li>
              ))}
            </ol>
            {!state.claimProbeStates[1] && (
              <p className="mt-2 text-xs leading-5 text-rose-200">
                Claim 1 is withheld on the shared bus, so this face does not represent its
                six-actuator combination.
              </p>
            )}
          </div>

          {MOTION_CONTROLS.map((control) => {
            const value = params[control.id] ?? control.defaultValue;
            return (
              <label key={control.id} className="block text-sm text-slate-200">
                {control.label}
                <span className="float-right font-mono text-cyan-300">{normalized(value)}</span>
                <input
                  className={`mt-2 w-full ${control.accent}`}
                  type="range"
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  value={value}
                  aria-label={`${control.label} normalized display coordinate`}
                  onChange={(event) => updateParam(control.id, Number(event.target.value))}
                />
              </label>
            );
          })}
          <label
            className={`flex items-center justify-between gap-3 text-sm text-slate-200 ${
              claim8Active ? "cursor-pointer" : "cursor-not-allowed opacity-60"
            }`}
          >
            Recorded-signal playback
            <input
              type="checkbox"
              checked={(params.teachReplayMode ?? 0) >= 0.5}
              className="h-5 w-5 accent-emerald-400"
              disabled={!claim8Active}
              aria-label="Automatic recorded-signal playback"
              onChange={(event) => updateParam("teachReplayMode", event.target.checked ? 1 : 0)}
            />
          </label>
          <p className="rounded-lg border border-amber-900/70 bg-amber-950/25 p-3 text-xs leading-5 text-amber-100">
            Claim 12 probe: paired engaging pinions counter-rotate for finger opening/closing while
            their shared member can swing.{" "}
            {claim12Active
              ? "The normalized rack-and-pinion topology is live."
              : "That topology is withheld on the shared bus."}
          </p>
          <label
            className={`block text-sm text-slate-200 ${
              claim8Active ? "" : "cursor-not-allowed opacity-60"
            }`}
          >
            Illustrative record/feedback offset
            <span className="float-right font-mono text-rose-300">
              {normalized(params.resolverPhaseOffset ?? 0)}
            </span>
            <input
              className="mt-2 w-full accent-rose-400"
              type="range"
              min="-1"
              max="1"
              step="0.05"
              disabled={!claim8Active}
              value={params.resolverPhaseOffset ?? 0}
              aria-label="Illustrative normalized record and feedback phase offset"
              onChange={(event) => updateParam("resolverPhaseOffset", Number(event.target.value))}
            />
          </label>
          <p className="rounded-lg border border-rose-900/70 bg-rose-950/35 p-3 text-xs leading-5 text-rose-100">
            {state.refusal.reason}
          </p>
          <button
            type="button"
            onClick={resetParams}
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-800 px-3 text-sm text-slate-100 hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
          >
            <RotateCcw className="h-4 w-4" /> Reset source exhibit
          </button>
        </aside>
      </div>
    </section>
  );
}

export const AMFVersatranSim = AmfVersatranSim;
