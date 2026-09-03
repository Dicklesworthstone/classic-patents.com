"use client";

import { useMemo, useState } from "react";
import { PhysicsTelemetryBadge } from "@/components/patents/PhysicsTelemetryBadge";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { ALL_COLORIZED_EQUATIONS } from "@/data/colorizedEquations";
import {
  KAMEN_SEGWAY_DEFAULT_CONTROLS,
  type KamenSegwayControls,
  readKamenSegwayControls,
  stepKamenSegwaySi,
} from "@/physics/kamenSegwayKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

const PATENT_ID = "us-6302230-kamen-segway";

type ViewMode = "balance" | "margin" | "phase" | "traction";

export function KamenSegwaySim({ patentId = PATENT_ID }: { patentId?: string }) {
  const [controls, setControls] = useState<KamenSegwayControls>(KAMEN_SEGWAY_DEFAULT_CONTROLS);
  const [viewMode, setViewMode] = useState<ViewMode>("balance");

  // Shared SI physics bus
  const patentPhysics = usePatentPhysics(patentId);

  const effectiveControls = useMemo(() => {
    if (patentPhysics?.params) {
      return readKamenSegwayControls(patentPhysics.params);
    }
    return controls;
  }, [patentPhysics?.params, controls]);

  const tel = useMemo(() => {
    return stepKamenSegwaySi(effectiveControls);
  }, [effectiveControls]);
  const claimStates = useMemo(
    () => ({
      1: effectiveControls.claim1BalanceEnabled,
      2: effectiveControls.claim2RippleEnabled,
    }),
    [effectiveControls.claim1BalanceEnabled, effectiveControls.claim2RippleEnabled],
  );

  const updateControl = (key: keyof KamenSegwayControls, value: number) => {
    const updated = { ...effectiveControls, [key]: value };
    setControls(updated);
    patentPhysics?.updateParam?.(key, value);
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-xl border border-slate-800 p-4 shadow-2xl flex flex-col gap-4">
      {/* Header & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="font-mono text-sm font-semibold tracking-wider text-cyan-400 uppercase">
              US 6,302,230 • Inverted Pendulum Dynamic Balancing Simulator
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Source-disclosed automatic balance and ripple-alarm topology · modern illustrative SI
            scenario
          </p>
          <ClaimConstraintToggle
            patentId={PATENT_ID}
            claimStates={claimStates}
            onToggleClaim={(claimNumber, active) => {
              const key = claimNumber === 1 ? "claim1BalanceEnabled" : "claim2RippleEnabled";
              patentPhysics?.updateParam?.(key, active ? 1 : 0);
            }}
            className="mt-2"
          />
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setViewMode("balance")}
            className={`px-2.5 py-1 rounded transition-colors font-mono ${
              viewMode === "balance"
                ? "bg-cyan-600 text-white font-medium"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Dynamic Balance
          </button>
          <button
            type="button"
            onClick={() => setViewMode("margin")}
            className={`px-2.5 py-1 rounded transition-colors font-mono ${
              viewMode === "margin"
                ? "bg-cyan-600 text-white font-medium"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Balancing Margin
          </button>
          <button
            type="button"
            onClick={() => setViewMode("phase")}
            className={`px-2.5 py-1 rounded transition-colors font-mono ${
              viewMode === "phase"
                ? "bg-cyan-600 text-white font-medium"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Phase Portrait
          </button>
          <button
            type="button"
            onClick={() => setViewMode("traction")}
            className={`px-2.5 py-1 rounded transition-colors font-mono ${
              viewMode === "traction"
                ? "bg-cyan-600 text-white font-medium"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Traction Limit
          </button>
        </div>
      </div>

      {/* Main Visual Stage */}
      <div className="relative w-full h-80 bg-slate-900/80 rounded-lg border border-slate-800/80 overflow-hidden flex items-center justify-center">
        {/* Refusal Overlay */}
        {tel.refusalReason && (
          <div className="absolute inset-0 z-30 bg-rose-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center border border-rose-500/50">
            <span className="text-3xl mb-2">⚠️</span>
            <h4 className="text-sm font-bold text-rose-300 font-mono uppercase tracking-wider mb-1">
              Physical Refusal Boundary Encountered
            </h4>
            <p className="text-xs text-rose-200 max-w-md">{tel.refusalReason}</p>
            <button
              type="button"
              onClick={() => {
                setControls(KAMEN_SEGWAY_DEFAULT_CONTROLS);
                patentPhysics?.resetParams?.();
              }}
              className="mt-3 px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono rounded transition-colors"
            >
              Reset to Safe Equilibrium
            </button>
          </div>
        )}

        {/* Dynamic Balancing View */}
        {viewMode === "balance" && (
          <svg className="w-full h-full" viewBox="0 0 600 320">
            {/* Ground surface */}
            <line x1="40" y1="260" x2="560" y2="260" stroke="#334155" strokeWidth="3" />
            <pattern id="ground-hatch" width="12" height="12" patternUnits="userSpaceOnUse">
              <line x1="0" y1="12" x2="12" y2="0" stroke="#1e293b" strokeWidth="1.5" />
            </pattern>
            <rect x="40" y="260" width="520" height="40" fill="url(#ground-hatch)" />

            {/* Inverted Pendulum Pivot at (300, 240) */}
            <g transform="translate(300, 240)">
              {/* Ground wheel */}
              <circle cx="0" cy="0" r="32" fill="#0f172a" stroke="#0ea5e9" strokeWidth="3" />
              <circle cx="0" cy="0" r="12" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              {/* Wheel spokes */}
              <line
                x1="-30"
                y1="0"
                x2="30"
                y2="0"
                stroke="#38bdf8"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <line
                x1="0"
                y1="-30"
                x2="0"
                y2="30"
                stroke="#38bdf8"
                strokeWidth="1"
                strokeDasharray="3 3"
              />

              {/* Inverted Pendulum Mast tilted by pitch angle theta */}
              <g transform={`rotate(${effectiveControls.riderPitchDeg})`}>
                {/* Foot Platform */}
                <rect
                  x="-36"
                  y="-12"
                  width="72"
                  height="10"
                  rx="2"
                  fill="#334155"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                />

                {/* Vertical Handlebar Mast */}
                <line x1="0" y1="-12" x2="0" y2="-170" stroke="#64748b" strokeWidth="4" />
                <path
                  d="M-18 -170 L18 -170"
                  stroke="#38bdf8"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Rider Silhouette */}
                {/* Legs */}
                <line x1="-12" y1="-12" x2="-8" y2="-80" stroke="#cbd5e1" strokeWidth="3" />
                <line x1="12" y1="-12" x2="8" y2="-80" stroke="#cbd5e1" strokeWidth="3" />
                {/* Torso */}
                <line x1="0" y1="-80" x2="0" y2="-140" stroke="#cbd5e1" strokeWidth="5" />
                {/* Arms to handlebar */}
                <line x1="0" y1="-130" x2="0" y2="-170" stroke="#94a3b8" strokeWidth="2.5" />
                {/* Head */}
                <circle cx="0" cy="-155" r="12" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />

                {/* Center of Gravity (CG) indicator at y = -110 */}
                <circle cx="0" cy="-110" r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                <text
                  x="12"
                  y="-106"
                  fill="#f59e0b"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  CG
                </text>

                {/* Overturning Gravity Moment Arrow */}
                {Math.abs(effectiveControls.riderPitchDeg) > 0.5 && (
                  <path
                    d={`M 0 -110 A 60 60 0 0 ${effectiveControls.riderPitchDeg > 0 ? 1 : 0} ${effectiveControls.riderPitchDeg > 0 ? 35 : -35} -100`}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2.5"
                    markerEnd="url(#arrow-red)"
                  />
                )}
              </g>

              {/* Ground Reaction Force Vector at Contact Point */}
              <line
                x1="0"
                y1="24"
                x2={tel.driveThrustForceN * 0.15}
                y2="24"
                stroke="#10b981"
                strokeWidth="3.5"
              />
              <text
                x={tel.driveThrustForceN >= 0 ? 15 : -90}
                y="38"
                fill="#10b981"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
              >
                F_thrust = {tel.driveThrustForceN.toFixed(0)} N
              </text>
            </g>

            {/* Telemetry Annotation Badges */}
            <g transform="translate(60, 40)">
              <rect width="180" height="70" rx="6" fill="#0f172a" stroke="#1e293b" />
              <text x="12" y="22" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                PITCH LEAN (θ):
              </text>
              <text
                x="12"
                y="42"
                fill="#38bdf8"
                fontSize="16"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {effectiveControls.riderPitchDeg.toFixed(1)}°
              </text>
              <text x="12" y="58" fill="#64748b" fontSize="10" fontFamily="monospace">
                Overturn: {tel.gravityOverturningTorqueNm.toFixed(0)} N·m
              </text>
            </g>

            <g transform="translate(360, 40)">
              <rect width="180" height="70" rx="6" fill="#0f172a" stroke="#1e293b" />
              <text x="12" y="22" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                MOTOR RESTORING TORQUE:
              </text>
              <text
                x="12"
                y="42"
                fill="#818cf8"
                fontSize="16"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {tel.motorTorqueNm.toFixed(1)} N·m
              </text>
              <text x="12" y="58" fill="#64748b" fontSize="10" fontFamily="monospace">
                Speed: {tel.velocityKmh.toFixed(1)} km/h ({tel.velocityMS.toFixed(2)} m/s)
              </text>
            </g>
          </svg>
        )}

        {/* Balancing Margin Mode */}
        {viewMode === "margin" && (
          <div className="w-full h-full p-6 flex flex-col justify-between">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  Balancing Margin Ratio
                </span>
                <div className="text-2xl font-mono font-bold text-cyan-400 mt-1">
                  {(tel.balancingMarginRatio * 100).toFixed(0)}%
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full transition-[width,background-color] ${
                      tel.balancingMarginRatio > 0.45
                        ? "bg-emerald-500"
                        : tel.balancingMarginRatio > 0.22
                          ? "bg-amber-500"
                          : "bg-rose-500 animate-pulse"
                    }`}
                    style={{ width: `${Math.min(100, tel.balancingMarginRatio * 100)}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  Speed Pushback Tilt
                </span>
                <div className="text-2xl font-mono font-bold text-amber-400 mt-1">
                  +{tel.pitchPushbackDeg.toFixed(1)}°
                </div>
                <span className="text-xs text-slate-400">
                  {tel.speedPushbackActive ? "Active Governor Tiltback" : "Nominal Cruising"}
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  Haptic Ripple Alarm
                </span>
                <div
                  className={`text-2xl font-mono font-bold mt-1 ${
                    tel.tactileAlarmActive ? "text-rose-400 animate-bounce" : "text-slate-500"
                  }`}
                >
                  {tel.claim2RippleWithheld
                    ? "CLAIM 2 WITHHELD"
                    : tel.tactileAlarmActive
                      ? "RIPPLE ACTIVE"
                      : "STANDBY"}
                </div>
                <span className="text-xs text-slate-400">
                  {tel.claim2RippleWithheld
                    ? "No substitute alarm inferred"
                    : tel.tactileAlarmActive
                      ? "Ripple-modulation alarm active"
                      : "Modern model reserve OK"}
                </span>
              </div>
            </div>

            {/* Operating Envelope Curve */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-mono font-semibold text-slate-300">
                  Acceleration Headroom Boundary Equation (US 6,302,230 Col. 13)
                </span>
                <span className="text-[11px] font-mono text-slate-400 mt-0.5">
                  Margin = 1.0 - 0.55·(|τ| / 160 N·m) - 0.45·(|v| / {effectiveControls.speedLimitMS}{" "}
                  m/s)
                </span>
              </div>
              <span className="text-xs font-mono px-3 py-1 bg-slate-900 border border-slate-700 rounded text-cyan-300">
                Torque Demanded: {tel.motorTorqueNm.toFixed(1)} / 160 N·m
              </span>
            </div>
          </div>
        )}

        {/* Phase Portrait Mode */}
        {viewMode === "phase" && (
          <svg className="w-full h-full" viewBox="0 0 500 280">
            {/* Grid */}
            <line x1="50" y1="140" x2="450" y2="140" stroke="#334155" strokeWidth="1.5" />
            <line x1="250" y1="20" x2="250" y2="260" stroke="#334155" strokeWidth="1.5" />
            <text x="455" y="144" fill="#94a3b8" fontSize="10" fontFamily="monospace">
              θ (pitch)
            </text>
            <text x="255" y="30" fill="#94a3b8" fontSize="10" fontFamily="monospace">
              dθ/dt (rate)
            </text>

            {/* Stable Phase Trajectory Spiral */}
            <path
              d="M 250 140 C 290 80, 340 180, 250 200 C 180 210, 190 90, 240 120 C 260 130, 255 145, 250 140"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Current State Point */}
            <circle
              cx={250 + effectiveControls.riderPitchDeg * 10}
              cy={140 - tel.velocityMS * 12}
              r="6"
              fill="#f59e0b"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <text
              x={250 + effectiveControls.riderPitchDeg * 10 + 10}
              y={140 - tel.velocityMS * 12 - 8}
              fill="#f59e0b"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
            >
              State (θ={effectiveControls.riderPitchDeg.toFixed(1)}°, v={tel.velocityMS.toFixed(2)}{" "}
              m/s)
            </text>
          </svg>
        )}

        {/* Traction Mode */}
        {viewMode === "traction" && (
          <div className="w-full h-full p-6 flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <span className="text-xs font-mono text-slate-400">Available Coulomb Grip</span>
                <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">
                  {tel.maxTractionForceN.toFixed(0)} N
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  F_max = μ · (M_rider + M_chassis) · g ={" "}
                  {effectiveControls.groundFrictionCoeff.toFixed(2)} × 118 kg × 9.81 m/s²
                </span>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <span className="text-xs font-mono text-slate-400">Demanded Propulsive Thrust</span>
                <div className="text-2xl font-mono font-bold text-cyan-400 mt-1">
                  {Math.abs(tel.driveThrustForceN).toFixed(0)} N
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  F_thrust = τ_motor / R_wheel = {tel.motorTorqueNm.toFixed(1)} N·m / 0.24 m
                </span>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-300">
                Tire Grip Utilization:{" "}
                {((Math.abs(tel.driveThrustForceN) / tel.maxTractionForceN) * 100).toFixed(1)}%
              </span>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                {tel.tractionLossRefusal ? "SLIPPING (REFUSAL)" : "POSITIVE ADHESION"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800/80 text-xs">
        <div>
          <div className="flex justify-between font-mono mb-1">
            <span className="text-slate-400">Rider Pitch Lean (θ):</span>
            <span className="text-cyan-400 font-bold">
              {effectiveControls.riderPitchDeg.toFixed(1)}°
            </span>
          </div>
          <input
            type="range"
            min="-15"
            max="15"
            step="0.5"
            value={effectiveControls.riderPitchDeg}
            onChange={(e) => updateControl("riderPitchDeg", Number.parseFloat(e.target.value))}
            className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between font-mono mb-1">
            <span className="text-slate-400">Ground Traction (μ):</span>
            <span className="text-cyan-400 font-bold">
              {effectiveControls.groundFrictionCoeff.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0.15"
            max="0.95"
            step="0.05"
            value={effectiveControls.groundFrictionCoeff}
            onChange={(e) =>
              updateControl("groundFrictionCoeff", Number.parseFloat(e.target.value))
            }
            className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between font-mono mb-1">
            <span className="text-slate-400">Speed Governor Limit:</span>
            <span className="text-cyan-400 font-bold">
              {effectiveControls.speedLimitMS.toFixed(1)} m/s
            </span>
          </div>
          <input
            type="range"
            min="2.0"
            max="6.0"
            step="0.5"
            value={effectiveControls.speedLimitMS}
            onChange={(e) => updateControl("speedLimitMS", Number.parseFloat(e.target.value))}
            className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Telemetry Badge */}
      <PhysicsTelemetryBadge
        patentId={patentId}
        equations={ALL_COLORIZED_EQUATIONS[patentId] ?? []}
      />
    </div>
  );
}
