"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useId, useMemo, useState } from "react";
import {
  LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS,
  type LemelsonMachineVisionControls,
  stepLemelsonMachineVisionSi,
} from "@/physics/lemelsonMachineVisionKernel";

interface LemelsonMachineVisionSimProps {
  initialControls?: Partial<LemelsonMachineVisionControls>;
}

export function LemelsonMachineVisionSim({ initialControls }: LemelsonMachineVisionSimProps) {
  const [controls, setControls] = useState<LemelsonMachineVisionControls>({
    ...LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS,
    ...initialControls,
  });

  const state = useMemo(() => stepLemelsonMachineVisionSi(controls), [controls]);

  const clipId = useId();
  const screenGradientId = useId();
  const beamGlowId = useId();

  // Normalized visual positions
  const beamScanX = 200; // Center of field of view
  const partWidthPx = (controls.actualPartWidthM / controls.targetWidthM) * 180;
  const partLeft = beamScanX - partWidthPx / 2;
  const partRight = beamScanX + partWidthPx / 2;

  // Waveform plot generation
  const waveformPath = useMemo(() => {
    const baselineY = 85;
    const peakY = 85 - (state.metrics.videoPeakVoltageV / 1.2) * 55;
    const path = `M 30 ${baselineY} L ${partLeft} ${baselineY} L ${partLeft} ${peakY} L ${partRight} ${peakY} L ${partRight} ${baselineY} L 370 ${baselineY}`;
    return path;
  }, [partLeft, partRight, state.metrics.videoPeakVoltageV]);

  const thresholdY = 85 - (controls.thresholdVoltage / 1.2) * 55;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-700/80 bg-slate-900 p-5 text-slate-100 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-emerald-400">
            US 3,081,379 — Vidicon Line-Scan & Video Defect Slicer
          </h3>
          <p className="text-xs text-slate-400">
            Television Raster Scanning, Sliced Pulse Duration Gauging & Automated Solenoid Sortation
          </p>
        </div>
        <div className="flex items-center gap-2">
          {state.metrics.isDefective ? (
            <span className="flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-950/80 px-3 py-1 text-xs font-semibold text-red-400">
              <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
              DEFECT FLAGGED (REJECT)
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/80 px-3 py-1 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              DIMENSION ACCEPTED (PASS)
            </span>
          )}
        </div>
      </div>

      {/* SVG Pedagogical Instrument */}
      <div className="relative overflow-hidden rounded-lg border border-slate-800 bg-slate-950 p-2">
        <svg
          viewBox="0 0 600 320"
          className="w-full h-auto select-none"
          aria-label="Lemelson Machine Vision Inspection Station Diagram"
        >
          <defs>
            <linearGradient id={screenGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#064e3b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#022c22" stopOpacity="0.8" />
            </linearGradient>
            <filter id={beamGlowId} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <clipPath id={clipId}>
              <rect x="20" y="20" width="360" height="90" rx="4" />
            </clipPath>
          </defs>

          {/* BACKGROUND GRID */}
          <rect x="0" y="0" width="600" height="320" fill="#030712" />

          {/* LEFT PANEL: CRT OSCILLOSCOPE & VIDEO SIGNAL MONITOR */}
          <g transform="translate(10, 10)">
            {/* Monitor Bezel */}
            <rect
              x="10"
              y="10"
              width="380"
              height="110"
              rx="6"
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="2"
            />
            {/* Phosphor Screen */}
            <rect
              x="20"
              y="20"
              width="360"
              height="90"
              rx="4"
              fill={`url(#${screenGradientId})`}
              stroke="#10b981"
              strokeWidth="0.8"
            />

            {/* Oscilloscope Reticle Graticule */}
            <g opacity="0.3" stroke="#34d399" strokeWidth="0.5" strokeDasharray="2,2">
              <line x1="20" y1="35" x2="380" y2="35" />
              <line x1="20" y1="50" x2="380" y2="50" />
              <line x1="20" y1="65" x2="380" y2="65" />
              <line x1="20" y1="80" x2="380" y2="80" />
              <line x1="20" y1="95" x2="380" y2="95" />

              <line x1="80" y1="20" x2="80" y2="110" />
              <line x1="140" y1="20" x2="140" y2="110" />
              <line x1="200" y1="20" x2="200" y2="110" />
              <line x1="260" y1="20" x2="260" y2="110" />
              <line x1="320" y1="20" x2="320" y2="110" />
            </g>

            {/* Threshold Reference Line */}
            <line
              x1="20"
              y1={thresholdY}
              x2="380"
              y2={thresholdY}
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="4,3"
            />
            <text x="25" y={thresholdY - 4} fill="#f59e0b" fontSize="8" fontFamily="monospace">
              V_thresh = {controls.thresholdVoltage.toFixed(2)} V
            </text>

            {/* Sliced Pulse Indicator */}
            <rect
              x={partLeft}
              y={thresholdY}
              width={partWidthPx}
              height={85 - thresholdY}
              fill="#10b981"
              opacity="0.25"
            />

            {/* Live Video Waveform */}
            <path
              d={waveformPath}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              filter={`url(#${beamGlowId})`}
            />

            {/* Pulse Width Dimension Tag */}
            <line
              x1={partLeft}
              y1="28"
              x2={partRight}
              y2="28"
              stroke="#38bdf8"
              strokeWidth="1.2"
              markerEnd="url(#arrow)"
            />
            <line x1={partLeft} y1="24" x2={partLeft} y2="32" stroke="#38bdf8" strokeWidth="1.2" />
            <line
              x1={partRight}
              y1="24"
              x2={partRight}
              y2="32"
              stroke="#38bdf8"
              strokeWidth="1.2"
            />
            <text
              x={(partLeft + partRight) / 2}
              y="25"
              fill="#38bdf8"
              fontSize="8.5"
              fontFamily="monospace"
              textAnchor="middle"
              fontWeight="bold"
            >
              τ = {state.metrics.pulseWidthUs.toFixed(1)} µs → L ={" "}
              {state.metrics.measuredPartWidthMm.toFixed(1)} mm
            </text>
          </g>

          {/* RIGHT PANEL: TELEMETRY HUD & GATING STATUS */}
          <g transform="translate(405, 20)">
            <rect
              x="0"
              y="0"
              width="180"
              height="100"
              rx="6"
              fill="#0f172a"
              stroke="#1e293b"
              strokeWidth="1.5"
            />
            <text
              x="12"
              y="20"
              fill="#94a3b8"
              fontSize="9"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              SIGNAL METROLOGY HUD
            </text>
            <text x="12" y="38" fill="#cbd5e1" fontSize="9" fontFamily="monospace">
              f_H: {state.metrics.horizontalScanFreqHz} Hz
            </text>
            <text x="12" y="52" fill="#cbd5e1" fontSize="9" fontFamily="monospace">
              v_scan: {state.metrics.scanBeamVelocityMPerS.toFixed(0)} m/s
            </text>
            <text x="12" y="66" fill="#cbd5e1" fontSize="9" fontFamily="monospace">
              Dev: ΔL = {state.metrics.dimensionalErrorMm.toFixed(2)} mm
            </text>
            <text
              x="12"
              y="84"
              fill={state.metrics.isDefective ? "#ef4444" : "#10b981"}
              fontSize="10"
              fontWeight="bold"
              fontFamily="monospace"
            >
              GATE: {state.metrics.isDefective ? "REJECT (PULSE)" : "ALLOW (PASS)"}
            </text>
          </g>

          {/* LOWER SECTION: CONVEYOR, VIDICON SCANNER & REJECT SOLENOID */}
          <g transform="translate(20, 140)">
            {/* Vidicon Camera Housing */}
            <g transform="translate(180, 0)">
              {/* Mounting Bracket */}
              <rect x="15" y="-10" width="10" height="20" fill="#475569" />
              {/* Camera Body */}
              <rect
                x="0"
                y="10"
                width="40"
                height="50"
                rx="3"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="1.5"
              />
              {/* Lens Barrel */}
              <rect
                x="10"
                y="60"
                width="20"
                height="15"
                rx="1"
                fill="#334155"
                stroke="#64748b"
                strokeWidth="1"
              />
              {/* Lens Glass */}
              <ellipse cx="20" cy="75" rx="8" ry="2" fill="#0284c7" opacity="0.8" />
              <text x="20" y="38" fill="#94a3b8" fontSize="7" textAnchor="middle" fontWeight="bold">
                VIDICON
              </text>

              {/* Optical Scan Beam Cone */}
              <polygon
                points={`20,75 ${partLeft - 180 + 20},130 ${partRight - 180 + 20},130`}
                fill="#38bdf8"
                opacity="0.2"
              />
              <line
                x1="20"
                y1="75"
                x2={20}
                y2="130"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="2,2"
              />
            </g>

            {/* Inspection Illumination Lamps */}
            <g transform="translate(110, 20)">
              <circle cx="10" cy="10" r="8" fill="#f59e0b" opacity="0.8" />
              <polygon points="10,18 0,60 40,60" fill="#fef08a" opacity="0.15" />
            </g>
            <g transform="translate(260, 20)">
              <circle cx="10" cy="10" r="8" fill="#f59e0b" opacity="0.8" />
              <polygon points="10,18 -20,60 20,60" fill="#fef08a" opacity="0.15" />
            </g>

            {/* Conveyor Belt System */}
            <g transform="translate(0, 125)">
              {/* Belt Base */}
              <rect
                x="10"
                y="5"
                width="540"
                height="18"
                fill="#1e293b"
                stroke="#334155"
                strokeWidth="1.5"
              />
              {/* Rollers */}
              <circle cx="20" cy="14" r="9" fill="#475569" stroke="#64748b" strokeWidth="1" />
              <circle cx="540" cy="14" r="9" fill="#475569" stroke="#64748b" strokeWidth="1" />

              {/* Workpiece on Belt */}
              <g transform={`translate(${partLeft}, -16)`}>
                <rect
                  x="0"
                  y="0"
                  width={partWidthPx}
                  height="20"
                  rx="2"
                  fill={state.metrics.isDefective ? "#f87171" : "#34d399"}
                  stroke={state.metrics.isDefective ? "#b91c1c" : "#059669"}
                  strokeWidth="1.5"
                />
                <text
                  x={partWidthPx / 2}
                  y="13"
                  fill="#0f172a"
                  fontSize="8"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {state.metrics.measuredPartWidthMm.toFixed(1)}mm
                </text>
              </g>

              {/* Solenoid Rejection Diverter Gate */}
              <g transform="translate(380, -25)">
                {/* Solenoid Coil Body */}
                <rect
                  x="0"
                  y="0"
                  width="30"
                  height="35"
                  rx="3"
                  fill="#334155"
                  stroke="#64748b"
                  strokeWidth="1.5"
                />
                <rect
                  x="6"
                  y="6"
                  width="18"
                  height="23"
                  fill="#b45309"
                  stroke="#d97706"
                  strokeWidth="1"
                />
                <text
                  x="15"
                  y="20"
                  fill="#fef08a"
                  fontSize="7"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  SOL
                </text>

                {/* Plunger & Armature Paddle */}
                <g
                  transform={`translate(15, ${state.metrics.isDefective ? "28" : "15"})`}
                  className="transition-transform duration-200"
                >
                  <line x1="0" y1="0" x2="0" y2="25" stroke="#94a3b8" strokeWidth="3" />
                  <polygon
                    points="-12,25 12,25 0,35"
                    fill={state.metrics.isDefective ? "#ef4444" : "#64748b"}
                  />
                </g>

                {/* Reject Bin */}
                <path
                  d="M -15 65 L -10 95 L 40 95 L 45 65"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeDasharray="3,2"
                />
                <text
                  x="15"
                  y="85"
                  fill="#ef4444"
                  fontSize="7"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  REJECT BIN
                </text>
              </g>
            </g>
          </g>
        </svg>
      </div>

      {/* Interactive Controls Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 rounded-lg bg-slate-950/60 p-4 border border-slate-800">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Actual Part Width</span>
            <span className="font-mono text-emerald-400">
              {(controls.actualPartWidthM * 1000).toFixed(1)} mm
            </span>
          </div>
          <input
            type="range"
            min="60"
            max="100"
            step="0.5"
            value={controls.actualPartWidthM * 1000}
            onChange={(e) =>
              setControls((prev) => ({
                ...prev,
                actualPartWidthM: parseFloat(e.target.value) / 1000,
              }))
            }
            className="accent-emerald-500"
          />
          <span className="text-[10px] text-slate-400">
            Nominal is 80.0 mm (±2.0 mm tolerance threshold)
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Comparator Slicing Threshold</span>
            <span className="font-mono text-amber-400">
              {controls.thresholdVoltage.toFixed(2)} V
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="0.9"
            step="0.02"
            value={controls.thresholdVoltage}
            onChange={(e) =>
              setControls((prev) => ({
                ...prev,
                thresholdVoltage: parseFloat(e.target.value),
              }))
            }
            className="accent-amber-500"
          />
          <span className="text-[10px] text-slate-400">
            Voltage slicing level isolating workpiece edges
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Solenoid Actuator Current</span>
            <span className="font-mono text-cyan-400">
              {controls.gateSolenoidCurrentA.toFixed(1)} A
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="6.0"
            step="0.1"
            value={controls.gateSolenoidCurrentA}
            onChange={(e) =>
              setControls((prev) => ({
                ...prev,
                gateSolenoidCurrentA: parseFloat(e.target.value),
              }))
            }
            className="accent-cyan-500"
          />
          <span className="text-[10px] text-slate-400">
            Diverter force: {state.metrics.solenoidForceN.toFixed(2)} N (
            {state.metrics.gateResponseTimeMs.toFixed(1)} ms trip)
          </span>
        </div>
      </div>
    </div>
  );
}
