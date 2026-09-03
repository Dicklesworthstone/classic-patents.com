"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import { wasmSurfaceForPatent } from "@/physics/coverageManifest";
import {
  CRUMP_FDM_GLASS_TRANSITION_TEMP_C,
  CRUMP_FDM_ILLUSTRATIVE_NOZZLE_LAND_LENGTH_MM,
  CRUMP_FDM_SCENARIO_NOTE,
  readCrumpFdmControls,
} from "@/physics/crumpFdmKernel";
import {
  type CrumpFdmKernelSource,
  crumpFdmKernelSource,
  crumpFdmRuntimeLabel,
  ensureCrumpFdmWasm,
  stepCrumpFdmPhysics,
} from "@/physics/crumpFdmWasm";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

const PATENT_ID = "us-5121329-crump-fdm";

export function CrumpFdmSim({ patentId = PATENT_ID }: { patentId?: string }) {
  const [activeTab, setActiveTab] = useState<"nozzle" | "thermal" | "kinetics">("nozzle");
  const baseId = useId();
  const { effectiveParams, claimStates, claimConstraintResult, updateParam } =
    usePatentPhysics(patentId);
  const controls = useMemo(() => readCrumpFdmControls(effectiveParams), [effectiveParams]);
  const [kernelSource, setKernelSource] = useState<CrumpFdmKernelSource>(crumpFdmKernelSource);
  // `ensureCrumpFdmWasm` updates the loader state below. Reading synchronously during render means
  // that update immediately re-steps the shared bus against the admitted generic-owner receipt,
  // rather than retaining telemetry from the pre-load typed mirror in a memo.
  const tel = stepCrumpFdmPhysics(controls);

  useEffect(() => {
    if (!wasmSurfaceForPatent(patentId)) return;
    let active = true;
    void ensureCrumpFdmWasm().then((nextSource) => {
      if (active) setKernelSource(nextSource);
    });
    return () => {
      active = false;
    };
  }, [patentId]);

  const thermalPlotDurationSec = Math.max(0.5, tel.timeToGlassTransitionSec * 1.25);
  const thermalPlotMinC = Math.min(controls.ambientTempC, 25);
  const thermalPlotMaxC = Math.max(controls.nozzleTempC, 300);
  const thermalX = (timeSec: number) => 80 + (timeSec / thermalPlotDurationSec) * 640;
  const thermalY = (temperatureC: number) =>
    380 - ((temperatureC - thermalPlotMinC) / (thermalPlotMaxC - thermalPlotMinC)) * 320;

  return (
    <div
      className="flex flex-col gap-4 rounded-2xl border border-stone-800 bg-stone-950/90 p-5 text-stone-100 shadow-2xl backdrop-blur"
      data-testid="crump-fdm-two"
      data-crump-claim1-topology={tel.claim1ApparatusPresent ? "present" : "withheld"}
      data-crump-claim2-heating={tel.claim2HeatingMeansPresent ? "present" : "withheld"}
      data-crump-claim39-tip={tel.claim39PlanarGapPresent ? "planar" : "rounded"}
      data-crump-extruding={tel.isExtruding ? "true" : "false"}
      data-crump-layer-gap-mm={controls.layerHeightMm.toFixed(3)}
      data-crump-flow-mm3-s={tel.volumetricFlowRateMm3S.toFixed(6)}
      data-crump-pressure-mpa={tel.nozzlePressureDropMPa.toFixed(6)}
      data-crump-wasm-loader-source={kernelSource}
      data-crump-runtime-source={tel.runtimeSource}
      data-crump-capillary-owner={tel.capillaryOwner}
      data-crump-thermal-owner={tel.thermalOwner}
      data-crump-capillary-boundary={tel.capillaryBoundary}
      data-crump-thermal-boundary={tel.thermalBoundary}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-3">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-amber-400">
            US 5,121,329 — Fused Deposition Modeling (FDM) Simulation Instrument
          </h3>
          <p className="text-xs text-stone-400">
            Pinch-roller solid filament drive, heated liquefier flow, & planar ironing road
            deposition
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="flex rounded-lg bg-stone-900 p-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("nozzle")}
            className={`rounded px-3 py-1.5 font-medium transition ${
              activeTab === "nozzle"
                ? "bg-amber-500 text-stone-950 font-semibold"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            Nozzle & Road Cross-Section
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("thermal")}
            className={`rounded px-3 py-1.5 font-medium transition ${
              activeTab === "thermal"
                ? "bg-amber-500 text-stone-950 font-semibold"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            Thermal Cooling Curve
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("kinetics")}
            className={`rounded px-3 py-1.5 font-medium transition ${
              activeTab === "kinetics"
                ? "bg-amber-500 text-stone-950 font-semibold"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            Flow & Pressure Dynamics
          </button>
        </div>
      </div>

      {/* Main Vector / Simulation Canvas */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-stone-800 bg-stone-900/80 p-4">
        {activeTab === "nozzle" && (
          <svg viewBox="0 0 800 450" className="h-full w-full">
            {/* Background Grid */}
            <defs>
              <pattern id="fdm-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#292524" strokeWidth="0.5" />
              </pattern>
              <linearGradient id="melt-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="40%" stopColor="#8b5cf6" />
                <stop offset="70%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              <linearGradient id="cooling-bead" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="30%" stopColor="#f59e0b" />
                <stop offset="70%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
              </marker>
            </defs>
            <rect width="800" height="450" fill="url(#fdm-grid)" />

            <g visibility={tel.claim1ApparatusPresent ? "visible" : "hidden"}>
              {/* Source article-receiving base plate 10; no heated-bed claim. */}
              <rect
                x="50"
                y="360"
                width="700"
                height="30"
                rx="4"
                fill="#1c1917"
                stroke="#44403c"
                strokeWidth="2"
              />
              <text x="60" y="380" fill="#a8a29e" fontSize="11" fontFamily="monospace">
                Article-receiving base plate 10
              </text>

              {/* Previously Solidified Layers (Layers 1 to 4) */}
              {Array.from({ length: 4 }).map((_, layerIdx) => {
                const yPos = 360 - (layerIdx + 1) * 22;
                return (
                  <g key={`layer-${layerIdx}`}>
                    <rect
                      x="120"
                      y={yPos}
                      width="420"
                      height="20"
                      rx="3"
                      fill="#1e293b"
                      stroke="#0284c7"
                      strokeWidth="1.5"
                    />
                    <text x="130" y={yPos + 14} fill="#38bdf8" fontSize="10" fontFamily="monospace">
                      Cooled Layer #{layerIdx + 1} (illustrative T &lt; ABS Tg)
                    </text>
                  </g>
                );
              })}

              {/* Active Layer 5 being Extruded (Bead in Progress) */}
              <rect
                x="120"
                y="250"
                width="240"
                height="22"
                rx={tel.claim39PlanarGapPresent ? 3 : 10}
                fill="url(#cooling-bead)"
                stroke="#f59e0b"
                strokeWidth="2"
                visibility={tel.isExtruding ? "visible" : "hidden"}
              />
              <text
                x="130"
                y="264"
                fill="#fef08a"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
                visibility={tel.isExtruding ? "visible" : "hidden"}
              >
                {tel.claim39PlanarGapPresent
                  ? `Active flattened road (w=${controls.roadWidthMm} mm, gap=${controls.layerHeightMm} mm)`
                  : "Unsheared round-bead comparison — no failure magnitude inferred"}
              </text>

              {/* Moving Dispensing Head Assembly */}
              <g transform="translate(360, 40)">
                {/* Cold End & Heat Sink Fins */}
                <rect
                  x="-35"
                  y="0"
                  width="70"
                  height="80"
                  rx="4"
                  fill="#334155"
                  stroke="#64748b"
                  strokeWidth="2"
                />
                <line x1="-42" y1="20" x2="42" y2="20" stroke="#94a3b8" strokeWidth="3" />
                <line x1="-42" y1="38" x2="42" y2="38" stroke="#94a3b8" strokeWidth="3" />
                <line x1="-42" y1="56" x2="42" y2="56" stroke="#94a3b8" strokeWidth="3" />

                {/* Flexible-strand drive/idler rollers (FIG. 5). */}
                <circle cx="-25" cy="40" r="18" fill="#475569" stroke="#f59e0b" strokeWidth="2" />
                <circle cx="25" cy="40" r="18" fill="#475569" stroke="#f59e0b" strokeWidth="2" />
                <circle cx="-25" cy="40" r="4" fill="#f59e0b" />
                <circle cx="25" cy="40" r="4" fill="#f59e0b" />
                <text x="-105" y="15" fill="#f59e0b" fontSize="9" fontFamily="monospace">
                  Drive Roller 134
                </text>
                <text x="35" y="15" fill="#f59e0b" fontSize="9" fontFamily="monospace">
                  Idler Roller 136
                </text>

                {/* Feedstock Filament Entering Liquefier */}
                <rect
                  x="-8"
                  y="-30"
                  width="16"
                  height="150"
                  fill="#38bdf8"
                  stroke="#0284c7"
                  strokeWidth="1"
                />

                {/* Thermal Heat Break */}
                <rect
                  x="-15"
                  y="80"
                  width="30"
                  height="20"
                  fill="#78716c"
                  stroke="#57534e"
                  strokeWidth="1.5"
                />

                {/* Claim 2 heating means near passage/outlet (FIG. 5 coil 130). */}
                <g visibility={tel.claim2HeatingMeansPresent ? "visible" : "hidden"}>
                  <rect
                    x="-45"
                    y="100"
                    width="90"
                    height="60"
                    rx="4"
                    fill="#b45309"
                    stroke="#f59e0b"
                    strokeWidth="2"
                  />
                  <rect
                    x="-25"
                    y="115"
                    width="50"
                    height="30"
                    rx="2"
                    fill="#7c2d12"
                    stroke="#ea580c"
                    strokeWidth="1"
                  />
                  <text
                    x="-20"
                    y="134"
                    fill="#ffedd5"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {controls.nozzleTempC.toFixed(0)} °C
                  </text>

                  {/* Molten Core inside Liquefier */}
                  <rect x="-6" y="100" width="12" height="70" fill="url(#melt-gradient)" />
                  <path
                    d="M -48 106 C -60 114 -60 124 -48 132 C -36 140 -36 150 -48 158"
                    fill="none"
                    stroke="#fb7185"
                    strokeWidth="3"
                  />
                  <text x="-128" y="154" fill="#fda4af" fontSize="9" fontFamily="monospace">
                    Heater coil 130
                  </text>
                </g>

                {/* Outlet nozzle 122; Claim 39 chooses planar or rounded comparison tip. */}
                <path
                  d={
                    tel.claim39PlanarGapPresent
                      ? "M -20 160 L 20 160 L 10 208 L -10 208 Z"
                      : "M -20 160 L 20 160 L 8 202 Q 0 218 -8 202 Z"
                  }
                  fill="#d97706"
                  stroke="#fbbf24"
                  strokeWidth="2"
                />
                {/* Claim 39 substantially planar bottom. */}
                {tel.claim39PlanarGapPresent && (
                  <line x1="-16" y1="210" x2="16" y2="210" stroke="#fef08a" strokeWidth="4" />
                )}
                <text x="25" y="212" fill="#fde047" fontSize="10" fontFamily="monospace">
                  {tel.claim39PlanarGapPresent
                    ? `Claim 39 planar bottom (gap = ${controls.layerHeightMm} mm)`
                    : "Claim 39 withheld: rounded outlet"}
                </text>

                {/* Velocity Arrow */}
                <line
                  x1="30"
                  y1="90"
                  x2="90"
                  y2="90"
                  stroke="#38bdf8"
                  strokeWidth="3"
                  markerEnd="url(#arrow)"
                />
                <text x="35" y="80" fill="#38bdf8" fontSize="10" fontFamily="monospace">
                  v_head = {controls.printSpeedMmS} mm/s →
                </text>
              </g>

              {/* Real-time Telemetry HUD Panel */}
              <g transform="translate(560, 30)">
                <rect
                  width="215"
                  height="150"
                  rx="6"
                  fill="#0f172a"
                  stroke="#334155"
                  strokeWidth="1.5"
                  opacity="0.9"
                />
                <text
                  x="12"
                  y="24"
                  fill="#f59e0b"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  SI Melt Telemetry (US 5,121,329)
                </text>
                <text x="12" y="46" fill="#e2e8f0" fontSize="10" fontFamily="monospace">
                  Flow Q:{" "}
                  <tspan fill="#38bdf8">{tel.volumetricFlowRateMm3S.toFixed(2)} mm³/s</tspan>
                </text>
                <text x="12" y="66" fill="#e2e8f0" fontSize="10" fontFamily="monospace">
                  Feed v_feed:{" "}
                  <tspan fill="#4ade80">{tel.filamentFeedSpeedMmS.toFixed(2)} mm/s</tspan>
                </text>
                <text x="12" y="86" fill="#e2e8f0" fontSize="10" fontFamily="monospace">
                  Pressure ΔP:{" "}
                  <tspan fill="#fbbf24">{tel.nozzlePressureDropMPa.toFixed(3)} MPa</tspan>
                </text>
                <text x="12" y="106" fill="#e2e8f0" fontSize="10" fontFamily="monospace">
                  Drive Force:{" "}
                  <tspan fill={tel.filamentGrindingRefusal ? "#f43f5e" : "#4ade80"}>
                    {tel.feedDriveForceN.toFixed(1)} N
                  </tspan>
                </text>
                <text x="12" y="126" fill="#e2e8f0" fontSize="10" fontFamily="monospace">
                  Interface ΔT vs Tg:{" "}
                  <tspan fill={tel.poorAdhesionRefusal ? "#f43f5e" : "#4ade80"}>
                    {tel.interfaceTemperatureMarginC.toFixed(1)} °C
                  </tspan>
                </text>
                <text x="12" y="142" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                  Cooling τ: {(tel.coolingTimeConstantSec * 1000).toFixed(0)} ms
                </text>
              </g>
            </g>

            {!tel.claim1ApparatusPresent && (
              <g>
                <rect
                  x="165"
                  y="145"
                  width="470"
                  height="130"
                  rx="12"
                  fill="#450a0a"
                  stroke="#fb7185"
                />
                <text
                  x="400"
                  y="190"
                  textAnchor="middle"
                  fill="#fecdd3"
                  fontSize="18"
                  fontWeight="bold"
                >
                  CLAIM 1 APPARATUS TOPOLOGY WITHHELD
                </text>
                <text x="400" y="225" textAnchor="middle" fill="#fda4af" fontSize="12">
                  Head · metered discharge · receiving base · relative X/Y/Z layer motion
                </text>
              </g>
            )}
          </svg>
        )}

        {activeTab === "thermal" && (
          <svg viewBox="0 0 800 450" className="h-full w-full">
            <rect width="800" height="450" fill="#09090b" />
            <line x1="80" y1="380" x2="740" y2="380" stroke="#52525b" strokeWidth="2" />
            <line x1="80" y1="40" x2="80" y2="380" stroke="#52525b" strokeWidth="2" />
            <text x="360" y="420" fill="#a1a1aa" fontSize="12" fontFamily="monospace">
              Elapsed Time after Extrusion t (milliseconds)
            </text>
            <text
              x="20"
              y="210"
              fill="#a1a1aa"
              fontSize="12"
              fontFamily="monospace"
              transform="rotate(-90 20 210)"
            >
              Road Temperature T (°C)
            </text>

            {/* Illustrative ABS glass-transition threshold; not solidification. */}
            <line
              x1="80"
              y1={thermalY(CRUMP_FDM_GLASS_TRANSITION_TEMP_C)}
              x2="740"
              y2={thermalY(CRUMP_FDM_GLASS_TRANSITION_TEMP_C)}
              stroke="#f43f5e"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
            <text
              x="520"
              y={thermalY(CRUMP_FDM_GLASS_TRANSITION_TEMP_C) - 8}
              fill="#f43f5e"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
            >
              Illustrative ABS glass transition (Tg = {CRUMP_FDM_GLASS_TRANSITION_TEMP_C} °C)
            </text>

            {/* Ambient Temperature Line T_ambient = 25 C */}
            <line
              x1="80"
              y1={thermalY(controls.ambientTempC)}
              x2="740"
              y2={thermalY(controls.ambientTempC)}
              stroke="#3b82f6"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <text
              x="560"
              y={thermalY(controls.ambientTempC) - 5}
              fill="#60a5fa"
              fontSize="10"
              fontFamily="monospace"
            >
              Declared boundary ({controls.ambientTempC} °C)
            </text>

            {/* Cooling Curve Plot */}
            {(() => {
              const points: string[] = [];
              const tau = tel.coolingTimeConstantSec;
              for (let i = 0; i <= 100; i++) {
                const t = (i / 100) * thermalPlotDurationSec;
                const T =
                  controls.ambientTempC +
                  (controls.nozzleTempC - controls.ambientTempC) *
                    Math.exp(-t / Math.max(0.001, tau));
                const x = thermalX(t);
                const y = thermalY(T);
                points.push(`${x},${y}`);
              }
              return (
                <polyline
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3.5"
                  points={points.join(" ")}
                />
              );
            })()}

            <circle
              cx={thermalX(tel.timeToGlassTransitionSec)}
              cy={thermalY(CRUMP_FDM_GLASS_TRANSITION_TEMP_C)}
              r="6"
              fill="#ef4444"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <text
              x={Math.min(555, thermalX(tel.timeToGlassTransitionSec) + 15)}
              y={thermalY(CRUMP_FDM_GLASS_TRANSITION_TEMP_C) - 12}
              fill="#fef08a"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
            >
              First-mode Tg crossing: {(tel.timeToGlassTransitionSec * 1000).toFixed(0)} ms (τ ={" "}
              {(tel.coolingTimeConstantSec * 1000).toFixed(0)} ms)
            </text>
          </svg>
        )}

        {activeTab === "kinetics" && (
          <div className="grid h-full grid-cols-1 gap-4 p-4 text-xs font-mono text-stone-300 md:grid-cols-2">
            <div className="flex flex-col justify-between rounded-lg border border-stone-800 bg-stone-950 p-4">
              <h4 className="text-sm font-bold text-cyan-400">
                1. Newtonian Circular-Capillary Screen
              </h4>
              <p className="mt-2 text-stone-400">
                Molten polymer is driven through nozzle orifice (d = {controls.nozzleDiameterMm} mm,
                illustrative L = {CRUMP_FDM_ILLUSTRATIVE_NOZZLE_LAND_LENGTH_MM} mm) at Newtonian
                wall shear-rate γ̇ = 4Q/(πR³) = {tel.wallShearRatePerS.toFixed(0)} s⁻¹.
              </p>
              <p className="mt-2 text-[10px] leading-4 text-rose-300">
                Screening boundary: fully developed laminar no-slip flow. Polymer shear thinning,
                entrance contraction, viscoelasticity, and wall slip are not solved.
              </p>
              <div className="mt-4 flex justify-between border-t border-stone-800 pt-2 text-amber-300">
                <span>Screened Pressure Drop (ΔP):</span>
                <span className="font-bold">{tel.nozzlePressureDropMPa.toFixed(3)} MPa</span>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-lg border border-stone-800 bg-stone-950 p-4">
              <h4 className="text-sm font-bold text-emerald-400">
                2. Motorized Filament Drive Traction
              </h4>
              <p className="mt-2 text-stone-400">
                Pinch normal force F_pinch = {controls.pinchRollerForceN} N yields maximum available
                traction force F_traction = {tel.maxTractionForceN.toFixed(1)} N in the declared
                illustrative friction scenario.
              </p>
              <div className="mt-4 flex justify-between border-t border-stone-800 pt-2 text-emerald-300">
                <span>Axial Drive Thrust (F_drive):</span>
                <span
                  className={`font-bold ${tel.filamentGrindingRefusal ? "text-rose-400" : "text-emerald-400"}`}
                >
                  {tel.feedDriveForceN.toFixed(1)} N (
                  {tel.filamentGrindingRefusal ? "GRINDING SLIP" : "ENGAGED"})
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Refusal Banner Overlay */}
        {tel.refusalReason && (
          <div className="absolute inset-x-4 top-4 rounded-lg border border-rose-600/80 bg-rose-950/90 p-3 text-xs font-mono text-rose-200 shadow-xl backdrop-blur">
            <span className="font-bold text-rose-400">TYPED KERNEL REFUSAL: </span>
            {tel.refusalReason}
          </div>
        )}
      </div>

      {/* Interactive Sliders Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Nozzle Temp */}
        <div className="flex flex-col gap-1 rounded-xl border border-stone-800 bg-stone-900/60 p-3">
          <div className="flex justify-between text-xs">
            <label htmlFor={`${baseId}-nozzle-temp`} className="text-stone-300">
              Liquefier Temperature (T_nozzle)
            </label>
            <span className="font-mono font-semibold text-amber-400">
              {controls.nozzleTempC.toFixed(0)} °C
            </span>
          </div>
          <input
            id={`${baseId}-nozzle-temp`}
            type="range"
            min={140}
            max={280}
            step={5}
            value={controls.nozzleTempC}
            onChange={(e) => updateParam("nozzleTempC", Number(e.target.value))}
            className="accent-amber-500"
          />
        </div>

        {/* Print Speed */}
        <div className="flex flex-col gap-1 rounded-xl border border-stone-800 bg-stone-900/60 p-3">
          <div className="flex justify-between text-xs">
            <label htmlFor={`${baseId}-print-speed`} className="text-stone-300">
              Toolhead Velocity (v_head)
            </label>
            <span className="font-mono font-semibold text-cyan-400">
              {controls.printSpeedMmS.toFixed(0)} mm/s
            </span>
          </div>
          <input
            id={`${baseId}-print-speed`}
            type="range"
            min={10}
            max={150}
            step={5}
            value={controls.printSpeedMmS}
            onChange={(e) => updateParam("printSpeedMmS", Number(e.target.value))}
            className="accent-cyan-500"
          />
        </div>

        {/* Layer Height */}
        <div className="flex flex-col gap-1 rounded-xl border border-stone-800 bg-stone-900/60 p-3">
          <div className="flex justify-between text-xs">
            <label htmlFor={`${baseId}-layer-height`} className="text-stone-300">
              Layer Height (h)
            </label>
            <span className="font-mono font-semibold text-emerald-400">
              {controls.layerHeightMm.toFixed(2)} mm
            </span>
          </div>
          <input
            id={`${baseId}-layer-height`}
            type="range"
            min={0.05}
            max={0.5}
            step={0.05}
            value={controls.layerHeightMm}
            onChange={(e) => updateParam("layerHeightMm", Number(e.target.value))}
            className="accent-emerald-500"
          />
        </div>

        {/* Road Width */}
        <div className="flex flex-col gap-1 rounded-xl border border-stone-800 bg-stone-900/60 p-3">
          <div className="flex justify-between text-xs">
            <label htmlFor={`${baseId}-road-width`} className="text-stone-300">
              Flattened Road Width (w)
            </label>
            <span className="font-mono font-semibold text-amber-400">
              {controls.roadWidthMm.toFixed(2)} mm
            </span>
          </div>
          <input
            id={`${baseId}-road-width`}
            type="range"
            min={0.2}
            max={1.0}
            step={0.05}
            value={controls.roadWidthMm}
            onChange={(e) => updateParam("roadWidthMm", Number(e.target.value))}
            className="accent-amber-500"
          />
        </div>
      </div>

      <div className="grid gap-2 text-[11px] leading-4 sm:grid-cols-2">
        <div className="rounded-lg border border-emerald-800/70 bg-emerald-950/30 p-3 text-emerald-100">
          <span className="font-mono font-bold text-emerald-300">GENERIC LAW OWNERS</span>
          <p className="mt-1">
            {crumpFdmRuntimeLabel(tel.runtimeSource)} · {tel.capillaryOwner} · {tel.thermalOwner}
          </p>
        </div>
        <div className="rounded-lg border border-rose-800/70 bg-rose-950/30 p-3 text-rose-100">
          <span className="font-mono font-bold text-rose-300">MODEL BOUNDARY</span>
          <p className="mt-1">
            {CRUMP_FDM_SCENARIO_NOTE} No shear-thinning, entrance loss, contact resistance, phase
            change, bond strength, or historic performance is inferred.
          </p>
        </div>
      </div>

      {claimConstraintResult.refusalWarning && (
        <div className="rounded-lg border border-rose-700/70 bg-rose-950/50 p-3 text-xs leading-5 text-rose-100">
          {claimConstraintResult.refusalWarning}
        </div>
      )}

      <ClaimConstraintToggle
        patentId={patentId}
        claimStates={claimStates}
        onClaimStateChange={(num, active) =>
          updateParam(claimConstraintStateParamId(num), active ? 1 : 0)
        }
      />
    </div>
  );
}

export default CrumpFdmSim;
