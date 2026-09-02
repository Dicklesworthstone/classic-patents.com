"use client";

import { RotateCcw } from "lucide-react";
import { useId, useMemo } from "react";
import {
  LEMELSON_DEFAULT_CONTROLS,
  stepLemelsonManipulatorTopology,
} from "@/physics/lemelsonAdjustableManipulatorKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

const PATENT_ID = "us-3260375-lemelson-adjustable-manipulator";

const PRIMARY_CONTROLS = [
  {
    id: "carriagePosition",
    label: "Carriage Display Coordinate",
    min: -1,
    max: 1,
    step: 0.05,
    accent: "accent-cyan-400",
  },
  {
    id: "columnElevation",
    label: "Vertical-Member Display Coordinate",
    min: 0,
    max: 1,
    step: 0.05,
    accent: "accent-indigo-400",
  },
  {
    id: "columnAzimuth",
    label: "Rotary Display Coordinate",
    min: -1,
    max: 1,
    step: 0.05,
    accent: "accent-amber-400",
  },
  {
    id: "wristPivot",
    label: "Pivot-Joint Display Coordinate",
    min: -1,
    max: 1,
    step: 0.05,
    accent: "accent-emerald-400",
  },
  {
    id: "jawClosure",
    label: "Illustrated Jaw Closure",
    min: 0,
    max: 1,
    step: 0.05,
    accent: "accent-rose-400",
  },
  {
    id: "stop1Azimuth",
    label: "Rotary Actuator 1 Display Position",
    min: -1,
    max: 1,
    step: 0.05,
    accent: "accent-amber-400",
  },
  {
    id: "stop2Azimuth",
    label: "Rotary Actuator 2 Display Position",
    min: -1,
    max: 1,
    step: 0.05,
    accent: "accent-orange-400",
  },
  {
    id: "stop1Elevation",
    label: "Vertical Actuator 1 Display Position",
    min: 0,
    max: 1,
    step: 0.05,
    accent: "accent-indigo-400",
  },
  {
    id: "stop2Elevation",
    label: "Vertical Actuator 2 Display Position",
    min: 0,
    max: 1,
    step: 0.05,
    accent: "accent-violet-400",
  },
] as const;

export function LemelsonAdjustableManipulatorSim() {
  const gridId = useId().replace(/:/g, "");
  const arrowId = useId().replace(/:/g, "");
  const { params, updateParam, resetParams } = usePatentPhysics(PATENT_ID);
  const state = useMemo(() => stepLemelsonManipulatorTopology(params), [params]);
  const { controls, displayPose, sequencer } = state;

  // Visual layout constants
  const trackY = 80;
  const carriageX = 420 + controls.carriagePosition * 180;
  const mastTopY = trackY + 25;
  const mastHeight = 120 + controls.columnElevation * 140;
  const mastBottomY = mastTopY + mastHeight;

  // Turntable and arm geometry
  const armLen = 110;
  const pivotAngleRad = displayPose.pivotRad;
  const wristX = carriageX + Math.cos(displayPose.azimuthRad) * armLen * Math.cos(pivotAngleRad);
  const wristY = mastBottomY + Math.sin(pivotAngleRad) * 50 + 20;

  // Jaw clamping geometry
  const jawSpread = 8 + displayPose.jawOpeningFraction * 18;

  return (
    <section className="overflow-hidden rounded-2xl border border-cyan-800/60 bg-slate-950 text-slate-100 shadow-2xl">
      <header className="border-b border-cyan-900/70 bg-slate-900/85 px-4 py-3 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.16em] text-cyan-300">
          US 3,260,375 · ADJUSTABLE MANIPULATOR & LIMIT-SWITCH TOPOLOGY
        </p>
        <h3 className="mt-1 font-serif text-xl text-white">
          Lemelson Adjustable Manipulator Simulator
        </h3>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">
          Explore a normalized reading of the illustrated carriage, column, rotary and pivoting
          members, jaws, and switch-actuator relationships (Figs. 1–7). The exhibit shows selected
          display events, not measured motion, force, timing, or production performance.
        </p>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_20rem]">
        {/* SVG Diagram Canvas */}
        <div className="min-w-0 border-b border-cyan-900/70 p-3 lg:border-b-0 lg:border-r sm:p-5">
          <svg
            viewBox="0 0 840 540"
            role="img"
            aria-label="Interactive Lemelson Adjustable Manipulator 2D Kinematics and Relay Logic Diagram"
            className="h-auto w-full rounded-xl border border-slate-700 bg-[radial-gradient(circle_at_50%_30%,_#0e2a47,_#020617_75%)]"
          >
            <defs>
              <pattern id={gridId} width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M28 0H0V28" fill="none" stroke="#164e63" strokeWidth="0.8" opacity="0.4" />
              </pattern>
              <marker
                id={arrowId}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
              </marker>
            </defs>

            <rect width="840" height="540" fill={`url(#${gridId})`} />

            {/* Overhead Support Rail 21 */}
            <g id="overhead-track">
              <rect
                x="80"
                y="60"
                width="680"
                height="20"
                rx="3"
                fill="#1e293b"
                stroke="#0ea5e9"
                strokeWidth="2"
              />
              <line
                x1="80"
                y1="80"
                x2="760"
                y2="80"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="6 3"
              />
              {/* Bus bars 28 */}
              <line x1="100" y1="52" x2="740" y2="52" stroke="#f59e0b" strokeWidth="2" />
              <text x="90" y="45" fill="#f59e0b" fontSize="10" fontFamily="monospace">
                BUS POWER WIRES (28)
              </text>
              <text x="630" y="45" fill="#38bdf8" fontSize="10" fontFamily="monospace">
                OVERHEAD TRACK (21)
              </text>
            </g>

            {/* Overhead Carriage 22 */}
            <g id="carriage-assembly">
              <rect
                x={carriageX - 45}
                y={trackY - 15}
                width="90"
                height="45"
                rx="5"
                fill="#334155"
                stroke="#38bdf8"
                strokeWidth="2"
              />
              {/* Carriage Wheels 24 */}
              <circle
                cx={carriageX - 30}
                cy={trackY + 5}
                r="7"
                fill="#64748b"
                stroke="#94a3b8"
                strokeWidth="1.5"
              />
              <circle
                cx={carriageX + 30}
                cy={trackY + 5}
                r="7"
                fill="#64748b"
                stroke="#94a3b8"
                strokeWidth="1.5"
              />
              {/* Drive motor Mx */}
              <rect
                x={carriageX - 35}
                y={trackY - 10}
                width="24"
                height="20"
                rx="2"
                fill="#0284c7"
              />
              <text x={carriageX - 31} y={trackY + 4} fill="#ffffff" fontSize="9" fontWeight="bold">
                Mx
              </text>
              {/* Power brushes 27 */}
              <line
                x1={carriageX + 15}
                y1={trackY - 15}
                x2={carriageX + 15}
                y2="52"
                stroke="#f59e0b"
                strokeWidth="3"
              />
              <text x={carriageX + 22} y={trackY - 2} fill="#94a3b8" fontSize="9">
                22
              </text>
            </g>

            {/* Vertical Outer Column 23 */}
            <g id="vertical-column-outer">
              <rect
                x={carriageX - 22}
                y={mastTopY}
                width="44"
                height="100"
                rx="3"
                fill="#1e293b"
                stroke="#64748b"
                strokeWidth="1.5"
              />
              {/* Vertical Drive Motor Mz */}
              <rect
                x={carriageX + 24}
                y={mastTopY + 15}
                width="22"
                height="28"
                rx="2"
                fill="#6366f1"
              />
              <text
                x={carriageX + 28}
                y={mastTopY + 33}
                fill="#ffffff"
                fontSize="9"
                fontWeight="bold"
              >
                Mz
              </text>
              {/* Chain drive 31 */}
              <line
                x1={carriageX + 20}
                y1={mastTopY + 20}
                x2={carriageX + 20}
                y2={mastBottomY - 10}
                stroke="#94a3b8"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
            </g>

            {/* Telescoping Inner Column 23' */}
            <g id="telescoping-mast-inner">
              <rect
                x={carriageX - 16}
                y={mastTopY + 20}
                width="32"
                height={mastHeight}
                rx="2"
                fill="#475569"
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
              {/* Longitudinal Slot 23S */}
              <line
                x1={carriageX - 6}
                y1={mastTopY + 30}
                x2={carriageX - 6}
                y2={mastBottomY - 15}
                stroke="#0f172a"
                strokeWidth="4"
              />
              {/* Adjustable Vertical Stop 59' */}
              <rect
                x={carriageX - 10}
                y={mastTopY + 30 + controls.stop2Elevation * (mastHeight - 50)}
                width="8"
                height="12"
                rx="1"
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth="1"
              />
              {/* Limit Switch 54 on Column Base */}
              <circle cx={carriageX - 14} cy={mastBottomY - 20} r="4" fill="#fbbf24" />
              <text
                x={carriageX - 35}
                y={mastBottomY - 16}
                fill="#fbbf24"
                fontSize="8"
                fontWeight="bold"
              >
                SWz
              </text>
            </g>

            {/* Turntable Base 43 & Motor MR */}
            <g id="turntable-base">
              <ellipse
                cx={carriageX}
                cy={mastBottomY}
                rx="35"
                ry="10"
                fill="#0f172a"
                stroke="#f59e0b"
                strokeWidth="2"
              />
              {/* Annular Stop Track 45 & Stop Pin 36 */}
              <ellipse
                cx={carriageX}
                cy={mastBottomY}
                rx="25"
                ry="7"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1"
                strokeDasharray="3 2"
              />
              <circle
                cx={carriageX + controls.stop2Azimuth * 20}
                cy={mastBottomY + 2}
                r="3"
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth="0.8"
              />
              {/* Turntable Motor MR */}
              <rect
                x={carriageX - 38}
                y={mastBottomY - 22}
                width="16"
                height="18"
                rx="2"
                fill="#d97706"
              />
              <text
                x={carriageX - 36}
                y={mastBottomY - 9}
                fill="#ffffff"
                fontSize="8"
                fontWeight="bold"
              >
                MR
              </text>
            </g>

            {/* Articulated Arm 35 & Bevel Joint 50 */}
            <g id="articulated-arm-joint">
              {/* Joint Yoke 52/53 */}
              <circle
                cx={carriageX}
                cy={mastBottomY + 15}
                r="12"
                fill="#334155"
                stroke="#94a3b8"
                strokeWidth="1.5"
              />
              {/* Bevel Sector Gear G2 (240°) */}
              <path
                d={`M ${carriageX - 8} ${mastBottomY + 15} A 10 10 0 1 1 ${carriageX + 8} ${mastBottomY + 15}`}
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
              />
              {/* Arm Tube 35' */}
              <line
                x1={carriageX}
                y1={mastBottomY + 15}
                x2={wristX}
                y2={wristY}
                stroke="#64748b"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <line
                x1={carriageX}
                y1={mastBottomY + 15}
                x2={wristX}
                y2={wristY}
                stroke="#38bdf8"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>

            {/* Two-Jaw Gripper Head 80 */}
            <g id="gripper-head" transform={`translate(${wristX}, ${wristY})`}>
              <circle cx="0" cy="0" r="7" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
              {/* Upper Jaw 87a */}
              <path
                d={`M 0 -3 L 15 ${-jawSpread} L 30 ${-jawSpread}`}
                fill="none"
                stroke="#f43f5e"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Lower Jaw 87b */}
              <path
                d={`M 0 3 L 15 ${jawSpread} L 30 ${jawSpread}`}
                fill="none"
                stroke="#f43f5e"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Clamped Workpiece when closing */}
              {controls.jawClosure > 0.6 && (
                <rect
                  x="18"
                  y="-10"
                  width="16"
                  height="20"
                  rx="2"
                  fill="#facc15"
                  stroke="#ca8a04"
                  strokeWidth="1"
                />
              )}
            </g>

            {/* Relay Status Box & Sequence Handoff Overlay */}
            <g id="relay-status-panel" transform="translate(60, 360)">
              <rect
                width="280"
                height="150"
                rx="8"
                fill="#0f172a"
                stroke="#0284c7"
                strokeWidth="1.5"
              />
              <rect x="0" y="0" width="280" height="26" rx="8" fill="#1e293b" />
              <text
                x="12"
                y="18"
                fill="#38bdf8"
                fontSize="11"
                fontWeight="bold"
                fontFamily="monospace"
              >
                FIG. 7 CONTROL-STATE DISPLAY
              </text>
              <text x="12" y="48" fill="#94a3b8" fontSize="11">
                Active Phase:{" "}
                <tspan fill="#38bdf8" fontWeight="bold">
                  {sequencer.phaseName}
                </tspan>
              </text>
              <text x="12" y="68" fill="#94a3b8" fontSize="11">
                Driving Motor:{" "}
                <tspan fill="#10b981" fontWeight="bold">
                  {sequencer.activeMotor.toUpperCase()}
                </tspan>
              </text>
              <text x="12" y="88" fill="#94a3b8" fontSize="11">
                Tripped Stops:{" "}
                <tspan
                  fill={sequencer.trippedLimitSwitches.length > 0 ? "#f43f5e" : "#64748b"}
                  fontWeight="bold"
                >
                  {sequencer.trippedLimitSwitches.length > 0
                    ? sequencer.trippedLimitSwitches.join(", ")
                    : "None (Scanning)"}
                </tspan>
              </text>
              <text x="12" y="108" fill="#94a3b8" fontSize="11">
                Gripper State:{" "}
                <tspan fill="#f59e0b" fontWeight="bold">
                  {displayPose.gripperState.toUpperCase()}
                </tspan>
              </text>
              <text x="12" y="128" fill="#94a3b8" fontSize="10">
                Next Display Stage: <tspan fill="#a855f7">{sequencer.nextScheduledAction}</tspan>
              </text>
            </g>

            {/* Ground Level Reference */}
            <line x1="60" y1="520" x2="780" y2="520" stroke="#334155" strokeWidth="2" />
            <text x="690" y="512" fill="#64748b" fontSize="10" fontFamily="monospace">
              ILLUSTRATIVE GROUND REFERENCE
            </text>
          </svg>
        </div>

        {/* Sidebar Controls & Step Sequencer */}
        <aside className="flex flex-col justify-between p-4 sm:p-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Normalized Display Controls
              </h4>
              <button
                type="button"
                onClick={resetParams}
                className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-xs text-slate-300 hover:bg-slate-700 hover:text-white"
                title="Reset to default settings"
              >
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            </div>

            {/* Sliders */}
            <div className="space-y-3">
              {PRIMARY_CONTROLS.map((ctrl) => {
                const val = (params[ctrl.id] ??
                  (LEMELSON_DEFAULT_CONTROLS as any)[ctrl.id]) as number;
                return (
                  <div key={ctrl.id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <label htmlFor={ctrl.id} className="text-slate-300">
                        {ctrl.label}
                      </label>
                      <span className="font-mono text-cyan-300">{val.toFixed(2)}</span>
                    </div>
                    <input
                      id={ctrl.id}
                      type="range"
                      min={ctrl.min}
                      max={ctrl.max}
                      step={ctrl.step}
                      value={val}
                      onChange={(e) => updateParam(ctrl.id, Number.parseFloat(e.target.value))}
                      className={`h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 ${ctrl.accent}`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Sequence Phase Stepper */}
            <div className="border-t border-slate-800 pt-3">
              <label
                htmlFor="cyclePhase"
                className="text-xs font-semibold uppercase tracking-wider text-amber-400"
              >
                Described Sequence Stage (0–5)
              </label>
              <div className="mt-2 grid grid-cols-6 gap-1">
                {[0, 1, 2, 3, 4, 5].map((phaseNum) => (
                  <button
                    key={phaseNum}
                    type="button"
                    onClick={() => updateParam("cyclePhase", phaseNum)}
                    className={`rounded py-1.5 font-mono text-xs font-bold transition-colors ${
                      controls.cyclePhase === phaseNum
                        ? "bg-amber-500 text-slate-950 shadow-md"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {phaseNum}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-cyan-900/50 bg-slate-900/60 p-3 text-[11px] text-slate-400">
            <span className="font-bold text-cyan-300">Archival Boundary Note:</span> In strict
            accordance with US 3,260,375, this display maps the described motion relationships to
            normalized coordinates and discrete switch events. It refuses unprinted dimensions,
            motor torque, force, speed, timing, inertia, and gripping performance.
          </div>
        </aside>
      </div>
    </section>
  );
}
