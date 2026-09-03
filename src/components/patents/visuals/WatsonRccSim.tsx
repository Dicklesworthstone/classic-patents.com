"use client";

import { AlertTriangle, CheckCircle2, RotateCcw, ShieldCheck } from "lucide-react";
import { useMemo } from "react";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import {
  readWatsonRccControls,
  stepWatsonRccSi,
  type WatsonRccControls,
  type WatsonRccTelemetry,
} from "@/physics/watsonRccKernel";

export function WatsonRccSim({ patentId = "us-4098001-watson-rcc" }: { patentId?: string }) {
  const { params, updateParam, resetParams } = usePatentPhysics(patentId);

  const controls: WatsonRccControls = useMemo(() => readWatsonRccControls(params), [params]);

  const tel: WatsonRccTelemetry = useMemo(() => stepWatsonRccSi(controls), [controls]);

  // SVG dimensions and visual scaling
  const svgWidth = 640;
  const svgHeight = 520;
  const centerX = 320;
  const topY = 60;

  // Visual offsets scaled from SI telemetry
  // 1 mm deflection = 25 px in SVG for clear pedagogical clarity
  const scalePxPerMm = 25;
  const lateralShiftPx = tel.tipLateralDisplacementMm * scalePxPerMm;
  const tiltRad = (tel.pegTiltAngleDeg * Math.PI) / 180;

  const isRCC = controls.complianceMode === "focal_rcc";
  const isTension = controls.complianceMode === "tension_mode";
  const isWrist = controls.complianceMode === "uncompensated_wrist";

  // Coordinates
  const basePlateY = topY;
  const intermediatePlateY = topY + 90;
  const toolPlateY = topY + 180;
  const pegTipY = toolPlateY + controls.pegLengthM * 1000;

  // In RCC mode, parallel rods shift intermediate plate, focal rods pivot lower plate
  const intPlateShiftX = lateralShiftPx;
  const lowerPlateShiftX = lateralShiftPx;
  const lowerPlateTiltRad = tiltRad;

  return (
    <div className="w-full bg-parchment-50 dark:bg-ink-950 rounded-2xl border border-parchment-300 dark:border-ink-800 p-6 flex flex-col items-center space-y-6 shadow-patent">
      {/* Simulation Header */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-parchment-200 dark:border-ink-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              US 4,098,001
            </span>
            <span className="text-xs font-mono text-ink-500 dark:text-parchment-400">
              Decoupled Spatial Compliance Matrix
            </span>
          </div>
          <h3 className="text-xl font-display font-bold text-ink-900 dark:text-parchment-100 mt-1">
            Remote Center Compliance (RCC) Instrument
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold border ${
              tel.insertionState === "smooth_insertion"
                ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
                : tel.insertionState === "compliant_correction"
                  ? "bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700"
                  : "bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700"
            }`}
          >
            {tel.insertionState === "smooth_insertion" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : tel.insertionState === "compliant_correction" ? (
              <ShieldCheck className="w-4 h-4 text-cyan-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            )}
            <span>
              {tel.insertionState === "smooth_insertion"
                ? "SMOOTH PASS"
                : tel.insertionState === "compliant_correction"
                  ? "COMPLIANT PASS"
                  : "JAMMED / WEDGED"}
            </span>
          </div>

          <button
            type="button"
            onClick={resetParams}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded-lg border border-parchment-300 dark:border-ink-700 bg-parchment-100 dark:bg-ink-800 text-ink-700 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-ink-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Main Interactive SVG Canvas */}
      <div className="relative w-full max-w-[640px] aspect-[640/520] bg-parchment-100 dark:bg-ink-900 rounded-xl border border-parchment-300 dark:border-ink-800 overflow-hidden shadow-inner flex items-center justify-center">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full select-none">
          <defs>
            {/* Grid background */}
            <pattern id="rcc-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-parchment-300/40 dark:text-ink-800/40"
              />
            </pattern>

            {/* Linear gradients */}
            <linearGradient id="peg-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>

            <linearGradient id="plate-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
          </defs>

          <rect width={svgWidth} height={svgHeight} fill="url(#rcc-grid)" />

          {/* Chamfered Hole Bore Block at bottom */}
          <g className="hole-block">
            {/* Left Block */}
            <path
              d="M 120 420 L 298 420 L 302 435 L 302 510 L 120 510 Z"
              className="fill-parchment-300 dark:fill-ink-800 stroke-parchment-400 dark:stroke-ink-700"
              strokeWidth="1.5"
            />
            {/* Right Block */}
            <path
              d="M 338 420 L 520 420 L 520 510 L 338 510 L 338 435 Z"
              className="fill-parchment-300 dark:fill-ink-800 stroke-parchment-400 dark:stroke-ink-700"
              strokeWidth="1.5"
            />
            {/* Chamfer guidelines */}
            <line
              x1="298"
              y1="420"
              x2="302"
              y2="435"
              stroke="#0ea5e9"
              strokeWidth="2"
              strokeDasharray="2 2"
            />
            <line
              x1="342"
              y1="420"
              x2="338"
              y2="435"
              stroke="#0ea5e9"
              strokeWidth="2"
              strokeDasharray="2 2"
            />
            <text
              x="210"
              y="470"
              className="fill-ink-400 dark:fill-parchment-500 text-[10px] font-mono"
            >
              CHAMFERED HOLE
            </text>
          </g>

          {/* Focal Convergence Ray Lines */}
          {isRCC && (
            <g className="focal-rays opacity-40">
              <line
                x1={centerX - 90}
                y1={intermediatePlateY}
                x2={centerX + lateralShiftPx}
                y2={pegTipY}
                stroke="#06b6d4"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <line
                x1={centerX + 90}
                y1={intermediatePlateY}
                x2={centerX + lateralShiftPx}
                y2={pegTipY}
                stroke="#06b6d4"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <circle
                cx={centerX + lateralShiftPx}
                cy={pegTipY}
                r="6"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
                strokeDasharray="2 2"
              />
              <text
                x={centerX + lateralShiftPx + 12}
                y={pegTipY + 4}
                className="fill-cyan-600 dark:fill-cyan-400 text-[10px] font-mono font-bold"
              >
                RCC Elastic Center (L_rcc)
              </text>
            </g>
          )}

          {/* Base Fixed Mounting Plate (Robot Wrist) */}
          <rect
            x={centerX - 130}
            y={basePlateY - 15}
            width="260"
            height="15"
            rx="3"
            fill="url(#plate-grad)"
            stroke="#334155"
            strokeWidth="1.5"
          />
          <text
            x={centerX}
            y={basePlateY - 4}
            textAnchor="middle"
            className="fill-parchment-200 text-[9px] font-mono font-bold uppercase tracking-wider"
          >
            Robot Head / Base Plate (54)
          </text>

          {/* Stage 1: Parallel Flexure Rods (Translational Stage) */}
          <g className="parallel-flexures">
            {/* Left parallel rod */}
            <path
              d={`M ${centerX - 90} ${basePlateY} C ${centerX - 90} ${basePlateY + 45}, ${
                centerX - 90 + intPlateShiftX
              } ${intermediatePlateY - 45}, ${centerX - 90 + intPlateShiftX} ${intermediatePlateY}`}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Center parallel rod */}
            <path
              d={`M ${centerX} ${basePlateY} C ${centerX} ${basePlateY + 45}, ${
                centerX + intPlateShiftX
              } ${intermediatePlateY - 45}, ${centerX + intPlateShiftX} ${intermediatePlateY}`}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Right parallel rod */}
            <path
              d={`M ${centerX + 90} ${basePlateY} C ${centerX + 90} ${basePlateY + 45}, ${
                centerX + 90 + intPlateShiftX
              } ${intermediatePlateY - 45}, ${centerX + 90 + intPlateShiftX} ${intermediatePlateY}`}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>

          {/* Intermediate Annular Plate (22) */}
          <rect
            x={centerX - 110 + intPlateShiftX}
            y={intermediatePlateY}
            width="220"
            height="12"
            rx="2"
            fill="url(#plate-grad)"
            stroke="#3b82f6"
            strokeWidth="1.5"
          />
          <text
            x={centerX + intPlateShiftX}
            y={intermediatePlateY + 9}
            textAnchor="middle"
            className="fill-cyan-300 text-[8px] font-mono font-semibold"
          >
            Intermediate Ring (22)
          </text>

          {/* Stage 2: Focal Flexure Rods (Rotational Stage) */}
          <g
            className="focal-flexures"
            transform={`translate(${centerX + lowerPlateShiftX}, ${toolPlateY}) rotate(${
              (lowerPlateTiltRad * 180) / Math.PI
            }) translate(-${centerX + lowerPlateShiftX}, -${toolPlateY})`}
          >
            {/* Left focal rod */}
            <line
              x1={centerX - 80 + intPlateShiftX}
              y1={intermediatePlateY + 12}
              x2={centerX - 50 + lowerPlateShiftX}
              y2={toolPlateY}
              stroke="#8b5cf6"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Right focal rod */}
            <line
              x1={centerX + 80 + intPlateShiftX}
              y1={intermediatePlateY + 12}
              x2={centerX + 50 + lowerPlateShiftX}
              y2={toolPlateY}
              stroke="#8b5cf6"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Lower Tool Plate (20) */}
            <rect
              x={centerX - 90 + lowerPlateShiftX}
              y={toolPlateY}
              width="180"
              height="14"
              rx="3"
              fill="url(#plate-grad)"
              stroke="#8b5cf6"
              strokeWidth="1.5"
            />
            <text
              x={centerX + lowerPlateShiftX}
              y={toolPlateY + 10}
              textAnchor="middle"
              className="fill-purple-300 text-[8px] font-mono font-semibold"
            >
              Tool Plate (20)
            </text>

            {/* Cylindrical Peg / Workpiece (16) */}
            <rect
              x={centerX - 16 + lowerPlateShiftX}
              y={toolPlateY + 14}
              width="32"
              height={controls.pegLengthM * 1000 - 14}
              rx="2"
              fill="url(#peg-grad)"
              stroke="#475569"
              strokeWidth="1.5"
            />
            {/* Peg Chamfer Tip */}
            <path
              d={`M ${centerX - 16 + lowerPlateShiftX} ${pegTipY - 4} L ${
                centerX - 12 + lowerPlateShiftX
              } ${pegTipY} L ${centerX + 12 + lowerPlateShiftX} ${pegTipY} L ${
                centerX + 16 + lowerPlateShiftX
              } ${pegTipY - 4} Z`}
              fill="#94a3b8"
              stroke="#475569"
              strokeWidth="1"
            />
          </g>

          {/* Force Vectors & Contact Annotations */}
          {controls.lateralContactForceN > 0 && (
            <g className="force-vectors">
              {/* Lateral Force Arrow at peg tip */}
              <line
                x1={centerX + lateralShiftPx - 45}
                y1={pegTipY - 10}
                x2={centerX + lateralShiftPx - 18}
                y2={pegTipY - 10}
                stroke="#10b981"
                strokeWidth="3"
                markerEnd="url(#arrow)"
              />
              <polygon
                points={`${centerX + lateralShiftPx - 18},${pegTipY - 10} ${
                  centerX + lateralShiftPx - 26
                },${pegTipY - 14} ${centerX + lateralShiftPx - 26},${pegTipY - 6}`}
                fill="#10b981"
              />
              <text
                x={centerX + lateralShiftPx - 50}
                y={pegTipY - 15}
                textAnchor="end"
                className="fill-emerald-600 dark:fill-emerald-400 text-[10px] font-mono font-bold"
              >
                F_lat = {controls.lateralContactForceN} N
              </text>
            </g>
          )}

          {/* Decoupling Vector Badges in Corner */}
          <g transform="translate(20, 20)">
            <rect
              width="180"
              height="70"
              rx="8"
              className="fill-parchment-50/90 dark:fill-ink-950/90 stroke-parchment-300 dark:stroke-ink-800"
              strokeWidth="1"
            />
            <text
              x="10"
              y="18"
              className="fill-ink-600 dark:fill-parchment-400 text-[9px] font-mono font-bold uppercase tracking-wider"
            >
              Tip Kinematics:
            </text>
            <text
              x="10"
              y="38"
              className="fill-cyan-600 dark:fill-cyan-400 text-[12px] font-mono font-bold"
            >
              δ_x = {tel.tipLateralDisplacementMm.toFixed(2)} mm (pure lat)
            </text>
            <text
              x="10"
              y="56"
              className="fill-amber-600 dark:fill-amber-400 text-[12px] font-mono font-bold"
            >
              θ_y = {tel.pegTiltAngleDeg.toFixed(2)}° (angular tilt)
            </text>
          </g>
        </svg>
      </div>

      {/* Control Sliders & Configuration Panel */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 bg-parchment-100 dark:bg-ink-900 p-4 rounded-xl border border-parchment-200 dark:border-ink-800">
        {/* Compliance Mode Toggle */}
        <div className="col-span-1 md:col-span-2 flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-parchment-200 dark:border-ink-800">
          <span className="text-xs font-mono font-bold text-ink-700 dark:text-parchment-300">
            COMPLIANCE ARCHITECTURE:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => updateParam("complianceMode", 0)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                isRCC
                  ? "bg-cyan-600 text-white shadow"
                  : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-parchment-400 hover:bg-parchment-300 dark:hover:bg-ink-700"
              }`}
            >
              Focal RCC (US 4,098,001)
            </button>
            <button
              type="button"
              onClick={() => updateParam("complianceMode", 1)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                isWrist
                  ? "bg-rose-600 text-white shadow"
                  : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-parchment-400 hover:bg-parchment-300 dark:hover:bg-ink-700"
              }`}
            >
              Uncompensated Wrist
            </button>
            <button
              type="button"
              onClick={() => updateParam("complianceMode", 2)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                isTension
                  ? "bg-purple-600 text-white shadow"
                  : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-parchment-400 hover:bg-parchment-300 dark:hover:bg-ink-700"
              }`}
            >
              Tension Mode (Fig. 9)
            </button>
          </div>
        </div>

        {/* Lateral Contact Force Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-ink-600 dark:text-parchment-400">
              Lateral Contact Force (F_x):
            </span>
            <span className="font-bold text-ink-900 dark:text-parchment-100">
              {controls.lateralContactForceN} N
            </span>
          </div>
          <input
            type="range"
            aria-label="Lateral contact force in newtons"
            min="0"
            max="80"
            step="1"
            value={controls.lateralContactForceN}
            onChange={(e) => updateParam("lateralContactForceN", Number(e.target.value))}
            className="w-full accent-cyan-600 dark:accent-cyan-400"
          />
        </div>

        {/* Tip Moment Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-ink-600 dark:text-parchment-400">Applied Tip Moment (M_y):</span>
            <span className="font-bold text-ink-900 dark:text-parchment-100">
              {controls.appliedMomentNm} N·m
            </span>
          </div>
          <input
            type="range"
            aria-label="Applied tip moment in newton meters"
            min="-3"
            max="3"
            step="0.1"
            value={controls.appliedMomentNm}
            onChange={(e) => updateParam("appliedMomentNm", Number(e.target.value))}
            className="w-full accent-purple-600 dark:accent-purple-400"
          />
        </div>

        {/* Initial Misalignment Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-ink-600 dark:text-parchment-400">Initial Misalignment (Δx):</span>
            <span className="font-bold text-ink-900 dark:text-parchment-100">
              {controls.initialMisalignmentMm} mm
            </span>
          </div>
          <input
            type="range"
            aria-label="Initial alignment offset in millimeters"
            min="0"
            max="2.5"
            step="0.1"
            value={controls.initialMisalignmentMm}
            onChange={(e) => updateParam("initialMisalignmentMm", Number(e.target.value))}
            className="w-full accent-amber-600 dark:accent-amber-400"
          />
        </div>

        {/* Axial Insertion Force Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-ink-600 dark:text-parchment-400">
              Axial Insertion Force (F_z):
            </span>
            <span className="font-bold text-ink-900 dark:text-parchment-100">
              {controls.insertionForceN} N
            </span>
          </div>
          <input
            type="range"
            aria-label="Axial insertion force in newtons"
            min="0"
            max="400"
            step="10"
            value={controls.insertionForceN}
            onChange={(e) => updateParam("insertionForceN", Number(e.target.value))}
            className="w-full accent-emerald-600 dark:accent-emerald-400"
          />
        </div>
      </div>
    </div>
  );
}
