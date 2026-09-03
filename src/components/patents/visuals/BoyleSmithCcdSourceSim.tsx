"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import {
  BOYLE_SMITH_CCD_GATE_COUNT,
  BOYLE_SMITH_CCD_ID,
  readBoyleSmithCcdSourceControls,
  readBoyleSmithCcdTapeFrame,
  resetBoyleSmithCcdTape,
} from "@/physics/boyleSmithCcdKernel";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

const PHASE_COLORS = ["#38bdf8", "#34d399", "#fb7185"] as const;

export function BoyleSmithCcdSourceSim() {
  const { params, effectiveParams, claimStates, claimConstraintResult, updateParam, resetParams } =
    usePatentPhysics(BOYLE_SMITH_CCD_ID);
  useFrankenSimPhysics(BOYLE_SMITH_CCD_ID);
  const controls = readBoyleSmithCcdSourceControls(effectiveParams);
  const frame = readBoyleSmithCcdTapeFrame(controls);
  const gatePitch = 55;
  const gateStartX = 105;

  return (
    <div className="overflow-hidden rounded-2xl border border-parchment-300 bg-slate-950 shadow-md dark:border-ink-800">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-700 bg-slate-900 px-4 py-3 text-slate-100">
        <div>
          <h3 className="font-display text-lg font-semibold">
            Figure 2 charge-transfer shift register
          </h3>
          <p className="max-w-3xl text-xs leading-relaxed text-slate-300">
            Issued electrode groups 22/23/24, their three connected conductors, insulating layer 21,
            and continuous N-type storage medium 20. The visible clock is deliberately slowed;
            carrier count and efficiency are not inferred.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => updateParam("running", controls.running ? 0 : 1)}
            className="rounded-lg border border-amber-500 bg-amber-700 px-3 py-2 text-xs font-semibold text-white"
          >
            {controls.running ? (
              <Pause className="mr-1 inline h-4 w-4" />
            ) : (
              <Play className="mr-1 inline h-4 w-4" />
            )}
            {controls.running ? "Pause" : "Run"}
          </button>
          <button
            type="button"
            onClick={() => {
              resetBoyleSmithCcdTape();
              resetParams();
            }}
            className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-xs font-semibold"
          >
            <RotateCcw className="mr-1 inline h-4 w-4" /> Reset
          </button>
        </div>
      </div>

      <div className="overflow-x-auto p-3">
        <svg
          viewBox="0 0 900 440"
          role="img"
          aria-label="Source-bounded Figure 2 and Figure 3 charge-transfer topology"
          className="min-w-[720px]"
        >
          <rect width="900" height="440" fill="#07111f" />

          <rect x="360" y="10" width="180" height="32" rx="4" fill="#1e293b" stroke="#cbd5e1" />
          <text
            x="450"
            y="31"
            textAnchor="middle"
            fill="#e2e8f0"
            fontFamily="monospace"
            fontSize="13"
          >
            REGENERATION CIRCUIT 33
          </text>
          <path
            d="M 813 128 L 855 128 L 855 26 L 540 26 M 360 26 L 50 26 L 50 139 L 73 139"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="2"
            strokeDasharray="8 6"
          />

          {PHASE_COLORS.map((color, phaseIndex) => {
            const railY = 54 + phaseIndex * 24;
            const phaseGateIndices = Array.from(
              {
                length: Math.max(
                  0,
                  Math.ceil((BOYLE_SMITH_CCD_GATE_COUNT - phaseIndex) / PHASE_COLORS.length),
                ),
              },
              (_, railIndex) => phaseIndex + railIndex * PHASE_COLORS.length,
            );
            return (
              <g key={color}>
                <line x1="92" y1={railY} x2="806" y2={railY} stroke={color} strokeWidth="5" />
                <text x="35" y={railY + 5} fill={color} fontSize="15" fontFamily="monospace">
                  {22 + phaseIndex}′
                </text>
                {phaseGateIndices.map((index) => {
                  const x = gateStartX + index * gatePitch;
                  return (
                    <line
                      key={index}
                      x1={x + 21}
                      y1={railY}
                      x2={x + 21}
                      y2="145"
                      stroke={color}
                      strokeWidth="3"
                    />
                  );
                })}
              </g>
            );
          })}

          <rect x="70" y="180" width="760" height="180" rx="4" fill="#334155" />
          <text x="92" y="342" fill="#cbd5e1" fontFamily="monospace" fontSize="16">
            20 · N-TYPE SINGLE-CONDUCTIVITY STORAGE MEDIUM
          </text>
          <rect x="70" y="162" width="760" height="18" fill="#7dd3fc" opacity="0.62" />
          <text x="365" y="176" fill="#0f172a" fontFamily="monospace" fontSize="12">
            INSULATING LAYER 21
          </text>

          {Array.from({ length: BOYLE_SMITH_CCD_GATE_COUNT }, (_, index) => {
            const phaseIndex = index % 3;
            const x = gateStartX + index * gatePitch;
            const depth = frame.metrics.phaseDepths[phaseIndex];
            return (
              <g key={index}>
                <rect x={x} y="142" width="42" height="20" fill={PHASE_COLORS[phaseIndex]} />
                <text x={x + 8} y="137" fill="#e2e8f0" fontFamily="monospace" fontSize="11">
                  {22 + phaseIndex}
                  {String.fromCharCode(97 + Math.floor(index / 3))}
                </text>
                {frame.metrics.claim1TopologyComplete && (
                  <path
                    d={`M ${x + 2} 181 Q ${x + 21} ${190 + depth * 72} ${x + 40} 181`}
                    fill="none"
                    stroke={PHASE_COLORS[phaseIndex]}
                    strokeWidth="3"
                    opacity={0.35 + depth * 0.6}
                  />
                )}
              </g>
            );
          })}

          <rect x="73" y="139" width="28" height="44" fill="#f59e0b" />
          <text x="70" y="118" fill="#fbbf24" fontFamily="monospace" fontSize="13">
            INPUT 25
          </text>
          <rect x="799" y="128" width="28" height="55" fill="#ef4444" />
          <text x="630" y="118" fill="#fb7185" fontFamily="monospace" fontSize="11">
            DEPLETION 28 / P-N JUNCTION 29
          </text>
          <line x1="827" y1="155" x2="850" y2="155" stroke="#cbd5e1" strokeWidth="3" />
          <path
            d="M 850 155 l -7 8 l 14 8 l -14 8 l 14 8 l -7 8"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="2"
          />
          <text
            x="840"
            y="180"
            textAnchor="end"
            fill="#cbd5e1"
            fontFamily="monospace"
            fontSize="12"
          >
            LOAD 30
          </text>
          <line x1="850" y1="195" x2="850" y2="207" stroke="#f59e0b" strokeWidth="3" />
          <circle cx="850" cy="218" r="11" fill="none" stroke="#f59e0b" strokeWidth="2" />
          <text x="849" y="222" textAnchor="middle" fill="#f59e0b" fontSize="12">
            +
          </text>
          <text
            x="832"
            y="222"
            textAnchor="end"
            fill="#f59e0b"
            fontFamily="monospace"
            fontSize="11"
          >
            BIAS 31 / ELECTRODE 32
          </text>

          {frame.metrics.claim1TopologyComplete &&
            frame.metrics.packetGatePositions.map((gatePosition, index) => (
              <g
                key={index}
                transform={`translate(${gateStartX + gatePosition * gatePitch + 21} 226)`}
              >
                <ellipse rx="18" ry="10" fill="#f59e0b" opacity="0.3" />
                <circle cx="-8" r="4" fill="#fef3c7" />
                <circle r="4" fill="#fef3c7" />
                <circle cx="8" r="4" fill="#fef3c7" />
                <text x="-4" y="5" fill="#78350f" fontFamily="monospace" fontSize="10">
                  +
                </text>
              </g>
            ))}

          {!frame.metrics.claim1TopologyComplete && (
            <g>
              <rect x="70" y="180" width="760" height="180" fill="#881337" opacity="0.48" />
              <text
                x="450"
                y="270"
                textAnchor="middle"
                fill="#fecdd3"
                fontSize="18"
                fontFamily="monospace"
              >
                CLAIM 1 SINGLE-CONDUCTIVITY MEDIUM WITHHELD
              </text>
            </g>
          )}

          <text x="70" y="397" fill="#94a3b8" fontFamily="monospace" fontSize="14">
            FIG. 3 INPUT: 1101 · ACTIVE PHASE: Φ{frame.metrics.activePhase} · tₚ/Δt ={" "}
            {controls.pulseWidthToStepRatio.toFixed(2)}{" "}
            {frame.metrics.pulseOverlapConditionMet
              ? "> 1/3 · HANDOFF ADMITTED"
              : "≤ 1/3 · HANDOFF REFUSED"}
          </text>
          <text x="70" y="422" fill="#64748b" fontFamily="monospace" fontSize="12">
            DISPLAY GEOMETRY NORMALIZED · CTE / CARRIER COUNT / OUTPUT VOLTAGE / POWER REFUSED
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-1 gap-4 border-t border-slate-700 bg-slate-900 p-4 font-mono text-xs text-slate-100 sm:grid-cols-3">
        <label className="grid gap-1.5" htmlFor="ccd-2d-visible-rate">
          <span className="flex justify-between gap-3">
            Visible phase-step rate
            <span className="text-cyan-400">{controls.clockStepRateHz.toFixed(1)} Hz</span>
          </span>
          <input
            id="ccd-2d-visible-rate"
            type="range"
            min="0.2"
            max="2.5"
            step="0.1"
            value={params.clockStepRateHz ?? 1.2}
            onChange={(event) => updateParam("clockStepRateHz", Number(event.target.value))}
            className="w-full accent-cyan-400"
          />
        </label>
        <label className="grid gap-1.5" htmlFor="ccd-2d-overlap">
          <span className="flex justify-between gap-3">
            Pulse ratio tₚ / Δt
            <span className="text-emerald-400">{controls.pulseWidthToStepRatio.toFixed(2)}</span>
          </span>
          <input
            id="ccd-2d-overlap"
            type="range"
            min="0.2"
            max="0.8"
            step="0.01"
            value={params.pulseWidthToStepRatio ?? 0.5}
            onChange={(event) => updateParam("pulseWidthToStepRatio", Number(event.target.value))}
            className="w-full accent-emerald-400"
          />
        </label>
        <label className="grid gap-1.5" htmlFor="ccd-2d-depth">
          <span className="flex justify-between gap-3">
            Relative pulse depth
            <span className="text-amber-400">{controls.pulseDepthNormalized.toFixed(2)}</span>
          </span>
          <input
            id="ccd-2d-depth"
            type="range"
            min="0.25"
            max="1"
            step="0.01"
            value={params.pulseDepthNormalized ?? 0.78}
            onChange={(event) => updateParam("pulseDepthNormalized", Number(event.target.value))}
            className="w-full accent-amber-400"
          />
        </label>
      </div>

      <div className="border-t border-slate-700 bg-black p-4">
        <ClaimConstraintToggle
          patentId={BOYLE_SMITH_CCD_ID}
          claimStates={claimStates}
          onClaimStateChange={(claimNumber, active) =>
            updateParam(claimConstraintStateParamId(claimNumber), active ? 1 : 0)
          }
        />
        {claimConstraintResult.refusalWarning && (
          <p className="mt-3 rounded-lg border border-rose-400/50 bg-rose-950/55 px-3 py-2 text-xs leading-relaxed text-rose-100">
            {claimConstraintResult.refusalWarning}
          </p>
        )}
      </div>
    </div>
  );
}
