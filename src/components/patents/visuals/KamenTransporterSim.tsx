"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { PhysicsTelemetryBadge } from "@/components/patents/PhysicsTelemetryBadge";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { ALL_COLORIZED_EQUATIONS } from "@/data/colorizedEquations";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import { wasmSurfaceForPatent } from "@/physics/coverageManifest";
import {
  createKamenTransporterTransportUpdater,
  KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M,
  KAMEN_TRANSPORTER_TOPOLOGY_LABELS,
  KAMEN_TRANSPORTER_TOPOLOGY_STATES,
  readKamenTransporterControls,
} from "@/physics/kamenTransporterKernel";
import {
  ensureKamenTransporterWasm,
  type KamenTransporterKernelSource,
  kamenTransporterKernelSource,
  kamenTransporterRuntimeLabel,
  stepKamenTransporterPhysics,
} from "@/physics/kamenTransporterWasm";
import { globalTransportBus, useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { useLiveSimParams } from "./three/useLiveSimParams";

export function KamenTransporterSim({
  patentId = "us-5701965-kamen-transporter",
}: {
  patentId?: string;
}) {
  const { effectiveParams, claimStates, updateParam } = usePatentPhysics(patentId);
  const controls = useMemo(() => readKamenTransporterControls(effectiveParams), [effectiveParams]);
  const liveControls = useLiveSimParams(controls);
  const [kernelSource, setKernelSource] = useState<KamenTransporterKernelSource>(
    kamenTransporterKernelSource,
  );
  const topology = useMemo(
    () => stepKamenTransporterPhysics(controls, kernelSource),
    [controls, kernelSource],
  );
  const equations = useMemo(() => ALL_COLORIZED_EQUATIONS[patentId] ?? [], [patentId]);
  const clipId = useId();

  useFrankenSimPhysics(patentId);

  useEffect(() => {
    if (!wasmSurfaceForPatent(patentId)) return;
    let active = true;
    void ensureKamenTransporterWasm().then((nextSource) => {
      if (active) setKernelSource(nextSource);
    });
    return () => {
      active = false;
    };
  }, [patentId]);

  useEffect(() => {
    return globalTransportBus.registerUpdater(
      patentId,
      createKamenTransporterTransportUpdater(
        () => liveControls.current,
        stepKamenTransporterPhysics,
      ),
      kernelSource === "wasm" ? "WASM" : "TS_FALLBACK",
    );
  }, [kernelSource, liveControls, patentId]);

  const width = 640;
  const height = 460;
  const groundY = 400;
  const originX = 260;
  const pixelsPerMeter = 260;
  const worldX = (xM: number) => originX + xM * pixelsPerMeter;
  const worldY = (yM: number) => groundY - yM * pixelsPerMeter;
  const wheelRadiusPx = KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M.wheelRadiusM * pixelsPerMeter;
  const hubX = worldX(topology.displayPose.axleXM);
  const hubY = worldY(topology.displayPose.axleYM);
  const chassisPitchDeg = (-topology.displayPose.chassisPitchRad * 180) / Math.PI;
  const selectedStateIndex = KAMEN_TRANSPORTER_TOPOLOGY_STATES.indexOf(topology.topologyState);

  return (
    <div
      className="flex w-full flex-col items-center space-y-6 rounded-2xl border border-parchment-300 bg-parchment-50 p-6 shadow-patent dark:border-ink-800 dark:bg-ink-950"
      data-testid="kamen-transporter-two"
      data-kamen-state={topology.topologyState}
      data-kamen-contact-wheels={topology.displayPose.contactWheelIds.join(",")}
      data-kamen-contact-count={topology.displayPose.contactCount}
      data-kamen-minimum-gap-m={topology.displayPose.minimumGapM.toFixed(12)}
      data-kamen-runtime-source={topology.runtimeSource}
      data-kamen-owner={topology.genericOwner}
      data-kamen-boundary={topology.runtimeBoundary}
      data-kamen-source-figure={topology.displayPose.sourceFigure}
      data-kamen-cluster-topology={topology.clusterTopologyActive ? "present" : "withheld"}
      data-kamen-balance-loop={topology.balanceLoopActive ? "active" : "withheld"}
      data-kamen-wheel-count="three-per-lateral-cluster"
      data-kamen-wheel-radius-m={KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M.wheelRadiusM}
      data-kamen-cluster-radius-m={KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M.clusterRadiusM}
      data-kamen-stair-rise-m={KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M.stairRiseM}
      data-kamen-stair-tread-m={KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M.stairTreadM}
    >
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
            Source-Dimensioned Balance, Transfer &amp; Climb Contact Geometry
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

          {topology.displayPose.stairActive ? (
            <path
              d={`M 0,${groundY} L ${worldX(0)},${groundY} L ${worldX(0)},${worldY(KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M.stairRiseM)} L ${worldX(KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M.stairTreadM)},${worldY(KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M.stairRiseM)} L ${worldX(KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M.stairTreadM)},${worldY(2 * KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M.stairRiseM)} L ${width},${worldY(2 * KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M.stairRiseM)} L ${width},${height} L 0,${height} Z`}
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
            x1={hubX}
            y1={hubY}
            x2={worldX(
              topology.displayPose.axleXM -
                KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M.systemCentreOffsetM *
                  Math.sin(topology.displayPose.chassisPitchRad),
            )}
            y2={worldY(
              topology.displayPose.axleYM +
                KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M.systemCentreOffsetM *
                  Math.cos(topology.displayPose.chassisPitchRad),
            )}
            stroke="#94a3b8"
            strokeDasharray="4 4"
            strokeWidth="1.5"
          />
          <text
            x={hubX + 10}
            y={Math.max(116, hubY - 128)}
            className="fill-ink-600 font-mono text-[10px] dark:fill-parchment-300"
          >
            TABLE 1 CENTRE OFFSET: 21.0 IN
          </text>

          {topology.clusterTopologyActive ? (
            <g data-kamen-svg-cluster="three-equal-wheels">
              {topology.displayPose.wheelContacts.map((wheel) => (
                <line
                  key={`arm-${wheel.id}`}
                  x1={hubX}
                  y1={hubY}
                  x2={worldX(wheel.centerXM)}
                  y2={worldY(wheel.centerYM)}
                  stroke="#64748b"
                  strokeLinecap="round"
                  strokeWidth="8"
                />
              ))}
              {topology.displayPose.wheelContacts.map((wheel) => (
                <g key={`wheel-${wheel.id}`}>
                  <circle
                    cx={worldX(wheel.centerXM)}
                    cy={worldY(wheel.centerYM)}
                    r={wheelRadiusPx}
                    fill="#1e293b"
                    stroke={wheel.touching ? "#10b981" : "#38bdf8"}
                    strokeWidth="4"
                  />
                  <circle
                    cx={worldX(wheel.centerXM)}
                    cy={worldY(wheel.centerYM)}
                    r="5"
                    fill="#94a3b8"
                  />
                  <text
                    x={worldX(wheel.centerXM)}
                    y={worldY(wheel.centerYM) + 4}
                    textAnchor="middle"
                    className="fill-white font-mono text-[9px] font-bold"
                  >
                    {wheel.id.toUpperCase()}
                  </text>
                </g>
              ))}
              <circle cx={hubX} cy={hubY} r="13" fill="#0f172a" stroke="#fbbf24" strokeWidth="3" />
            </g>
          ) : (
            <g data-kamen-svg-direct-wheel="claim-16-withheld">
              <circle
                cx={hubX}
                cy={hubY}
                r={wheelRadiusPx}
                fill="#1e293b"
                stroke="#10b981"
                strokeWidth="4"
              />
              <circle cx={hubX} cy={hubY} r="6" fill="#fbbf24" />
            </g>
          )}

          <g transform={`translate(${hubX}, ${hubY}) rotate(${chassisPitchDeg})`}>
            <line x1="0" y1="0" x2="0" y2="-28" stroke="#64748b" strokeWidth="12" />
            <rect
              x="-45"
              y="-52"
              width="90"
              height="28"
              rx="6"
              fill={`url(#chassis-grad-${clipId})`}
              stroke="#38bdf8"
              strokeWidth="2"
            />
            <rect x="-35" y="-86" width="58" height="15" rx="4" fill="#0369a1" stroke="#38bdf8" />
            <rect x="-28" y="-75" width="13" height="26" rx="3" fill="#334155" />
            <line
              x1="18"
              y1="-40"
              x2="26"
              y2="-178"
              stroke="#f59e0b"
              strokeLinecap="round"
              strokeWidth="6"
            />
            <line x1="0" y1="-178" x2="52" y2="-178" stroke="#f59e0b" strokeWidth="6" />
            <circle
              cx="0"
              cy={-KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M.systemCentreOffsetM * pixelsPerMeter}
              r="9"
              fill={topology.balanceLoopActive ? "#10b981" : "#f59e0b"}
              stroke="#ffffff"
              strokeWidth="2"
            />
          </g>

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
            CONTACT: {topology.displayPose.contactWheelIds.join(" + ").toUpperCase()} —{" "}
            {topology.displayPose.sourceFigure.toUpperCase()}
          </text>
          <text
            x="20"
            y="108"
            className="fill-ink-500 font-mono text-[9px] dark:fill-parchment-400"
          >
            {kamenTransporterRuntimeLabel(topology.runtimeSource).toUpperCase()} — FORCE, FRICTION,
            IMPACT &amp; CONTROL RESPONSE WITHHELD.
          </text>
        </svg>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 font-mono text-xs md:grid-cols-2">
        <div className="space-y-3 rounded-lg border border-parchment-200 bg-parchment-100 p-3 dark:border-ink-800 dark:bg-ink-900">
          <div className="flex items-center justify-between text-ink-700 dark:text-parchment-200">
            <label htmlFor="kamen-topology-state" className="font-bold">
              Claim-reading state
            </label>
            <span className="text-[10px] text-ink-500 dark:text-ink-400">SOURCE POSES</span>
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
            Table 1 prints the nominal 3.81-inch wheel radius, 5.581-inch carrier radius, 6.85-inch
            rise, and 10.9-inch tread. The generic fs-mbd owner checks those rigid horizontal
            contacts; force, friction, impact, compliance, motor, sensor, and controller results
            remain withheld.
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
