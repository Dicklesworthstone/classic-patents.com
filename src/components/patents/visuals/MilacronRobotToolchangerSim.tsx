"use client";

import { useId, useState } from "react";
import {
  MILACRON_TOOLCHANGER_DEFAULT_CONTROLS,
  type MilacronToolchangerControls,
  readMilacronToolchangerControls,
  stepMilacronRobotToolchangerSi,
} from "@/physics/milacronRobotToolchangerKernel";

export function MilacronRobotToolchangerSim() {
  const [controls, setControls] = useState<MilacronToolchangerControls>(
    MILACRON_TOOLCHANGER_DEFAULT_CONTROLS,
  );
  const [activeTab, setActiveTab] = useState<"adapter" | "kinematics" | "rack">("adapter");
  const baseId = useId();

  const tel = stepMilacronRobotToolchangerSi(controls);

  const update = <K extends keyof MilacronToolchangerControls>(
    key: K,
    value: MilacronToolchangerControls[K],
  ) => {
    setControls((prev) =>
      readMilacronToolchangerControls({
        ...prev,
        [key]: value,
      }),
    );
  };

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-amber-900/30 bg-stone-950 p-6 text-stone-200 shadow-2xl backdrop-blur-md">
      {/* Masthead */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-900/40 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-amber-500/20 px-2.5 py-0.5 font-mono text-xs font-semibold text-amber-300">
              US 4,512,709
            </span>
            <span className="text-xs uppercase tracking-widest text-stone-400">
              Cincinnati Milacron Inc. • Robot Toolchanger System
            </span>
          </div>
          <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight text-amber-100">
            Bistable Radial Locking Slide & Kinematic Coupling
          </h2>
        </div>

        {/* View Mode Tabs */}
        <div className="flex rounded-lg bg-stone-900/90 p-1 border border-stone-800">
          <button
            type="button"
            onClick={() => setActiveTab("adapter")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === "adapter"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            Locking Wedge (Fig. 6)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("kinematics")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === "kinematics"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            Locating Pins (Figs. 7–8)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("rack")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === "rack"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            Tool Storage Rack (Fig. 1)
          </button>
        </div>
      </div>

      {/* Refusal Banner if physical constraint violated */}
      {(tel.insufficientPressureRefusal || tel.wedgeBackdriveRefusal || tel.toolUnseatedRefusal) && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-4 text-rose-200">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-rose-400">
            <span>⚠️ Physical Constraint Refusal</span>
          </div>
          <p className="mt-1 text-sm font-medium">{tel.refusalReason}</p>
        </div>
      )}

      {/* Main Visual SVG Simulation Canvas */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-stone-800 bg-stone-900/50 shadow-inner">
        <svg
          viewBox="0 0 800 450"
          className="h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Cincinnati Milacron Robot Toolchanger Simulation"
        >
          <defs>
            <linearGradient id={`${baseId}-metal-steel`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
            <linearGradient id={`${baseId}-slide-gold`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id={`${baseId}-piston-cyan`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
          </defs>

          {activeTab === "adapter" && (
            <g id="adapter-cross-section">
              {/* Adapter Master Housing (Plates 26 and 27) */}
              <rect x="80" y="80" width="30" height="280" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="2" />
              <text x="95" y="70" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
                REAR 27
              </text>

              <rect x="360" y="80" width="30" height="280" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="2" />
              <text x="375" y="70" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
                FRONT 26
              </text>

              {/* Spacer Blocks 28, 29 */}
              <rect x="110" y="80" width="250" height="30" fill="#334155" stroke="#64748b" strokeWidth="1" />
              <rect x="110" y="330" width="250" height="30" fill="#334155" stroke="#64748b" strokeWidth="1" />

              {/* Pneumatic Cylinder 47 */}
              <rect x="130" y="180" width="130" height="80" rx="4" fill={`url(#${baseId}-metal-steel)`} stroke="#94a3b8" strokeWidth="1.5" />
              <text x="195" y="225" fill="#f8fafc" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                CYLINDER 47
              </text>

              {/* Piston Rod 46 & Yoke 45 */}
              {(() => {
                const strokeOffset = (controls.slideStrokeMm / 25) * 40;
                const yokeX = 260 + strokeOffset;
                const slideY = 150 - (controls.slideStrokeMm / 25) * 35;
                const gapOffset = (controls.dockingGapMm / 5) * 60;
                const toolBaseX = 400 + gapOffset;

                return (
                  <g>
                    {/* Rod 46 */}
                    <rect x="260" y="212" width={strokeOffset + 10} height="16" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
                    {/* Yoke 45 */}
                    <rect x={yokeX} y="195" width="25" height="50" rx="3" fill="#64748b" stroke="#94a3b8" strokeWidth="1.5" />
                    <circle cx={yokeX + 12} cy="220" r="4" fill="#fbbf24" />

                    {/* Locking Slide 33 (Moving Vertically/Radially across Front Plate) */}
                    <rect x="362" y={slideY} width="26" height="140" rx="2" fill={`url(#${baseId}-slide-gold)`} stroke="#f59e0b" strokeWidth="1.5" />
                    <text x="375" y={slideY + 45} fill="#fef3c7" fontSize="9" fontFamily="monospace" textAnchor="middle">
                      33
                    </text>
                    {/* Slide Wedge Ramps 41 */}
                    <polygon
                      points={`370,${slideY + 70} 385,${slideY + 70} 385,${slideY + 85} 370,${slideY + 80}`}
                      fill="#b45309"
                      stroke="#fef08a"
                      strokeWidth="1"
                    />

                    {/* Universal Tool Base 18 */}
                    <rect x={toolBaseX} y="80" width="30" height="280" rx="4" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
                    <text x={toolBaseX + 15} y="70" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle">
                      TOOL BASE 18
                    </text>

                    {/* T-Member Retention Lug 35 */}
                    <g transform={`translate(${toolBaseX}, 200)`}>
                      {/* Stem 37 */}
                      <rect x="-35" y="10" width="35" height="20" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
                      {/* Crossbar 38 with Beveled Ramps 39 */}
                      <polygon points="-50,-10 -35,-10 -35,50 -50,50 -50,40 -40,30 -40,10 -50,0" fill="#e2e8f0" stroke="#f59e0b" strokeWidth="1.5" />
                      <text x="-43" y="24" fill="#1e293b" fontSize="8" fontFamily="monospace" fontWeight="bold">
                        35
                      </text>
                    </g>

                    {/* Attached Tool 19 (e.g. Welding Gun / Gripper) */}
                    <rect x={toolBaseX + 30} y="130" width="140" height="180" rx="6" fill="#1c1917" stroke="#78716c" strokeWidth="1.5" />
                    <path d={`M ${toolBaseX + 170},180 L ${toolBaseX + 260},140 L ${toolBaseX + 260},280 L ${toolBaseX + 170},240 Z`} fill="#292524" stroke="#d97706" strokeWidth="1.5" />
                    <text x={toolBaseX + 100} y="225" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                      TOOL HEAD 19
                    </text>

                    {/* Proximity Switch 58 */}
                    <rect x="335" y="120" width="25" height="14" rx="2" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                    <circle cx="360" cy="127" r="3" fill={tel.proximitySensorActive ? "#10b981" : "#ef4444"} />
                    <text x="325" y="115" fill="#7dd3fc" fontSize="9" fontFamily="monospace">
                      PROX 58 [{tel.proximitySensorActive ? "SEATED" : "OPEN"}]
                    </text>
                  </g>
                );
              })()}

              {/* Telemetry Callout Box */}
              <g transform="translate(560, 30)">
                <rect width="210" height="95" rx="6" fill="#0c0a09" stroke="#d97706" strokeWidth="1" opacity="0.9" />
                <text x="12" y="24" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  MILACRON CLAMP TELEMETRY
                </text>
                <text x="12" y="44" fill="#e7e5e4" fontSize="10" fontFamily="monospace">
                  Actuator Thrust: {tel.actuatorThrustN.toFixed(0)} N
                </text>
                <text x="12" y="62" fill="#e7e5e4" fontSize="10" fontFamily="monospace">
                  Clamp Force: {tel.clampingForceN.toFixed(0)} N
                </text>
                <text x="12" y="80" fill={tel.isSelfLocking ? "#34d399" : "#f87171"} fontSize="10" fontFamily="monospace">
                  Bistable Holding: {tel.holdingForceWithoutPowerN.toFixed(0)} N
                </text>
              </g>
            </g>
          )}

          {activeTab === "kinematics" && (
            <g id="kinematic-locating-pins">
              <rect x="60" y="40" width="680" height="360" rx="8" fill="#141210" stroke="#44403c" strokeWidth="1.5" />
              <text x="80" y="70" fill="#f59e0b" fontSize="14" fontFamily="serif" fontWeight="bold">
                Kinematic 3-2-1 Locating Pin Interface (Figures 7 & 8)
              </text>

              {/* Front Plate Face View */}
              <circle cx="260" cy="220" r="140" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
              <rect x="235" y="160" width="50" height="120" rx="4" fill="#0f172a" stroke="#fbbf24" strokeWidth="1.5" />
              <text x="260" y="150" fill="#fef08a" fontSize="10" fontFamily="monospace" textAnchor="middle">
                SLIDE OPENING 30
              </text>

              {/* Cylindrical Pin 43 (Fixes X and Y) */}
              <circle cx="260" cy="105" r="14" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
              <circle cx="260" cy="105" r="6" fill="#0f172a" />
              <text x="285" y="110" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                PIN 43 (CYLINDRICAL: FIXES X, Y)
              </text>

              {/* Diamond Pin 44 (Fixes Rotation Yaw θz) */}
              <polygon points="260,320 274,335 260,350 246,335" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
              <circle cx="260" cy="335" r="4" fill="#0f172a" />
              <text x="285" y="340" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">
                PIN 44 (DIAMOND: FIXES θz, PREVENTS BINDING)
              </text>

              {/* Fluid Pass-Through Port 50 */}
              <circle cx="160" cy="220" r="12" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="160" cy="220" r="18" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 2" />
              <text x="110" y="255" fill="#7dd3fc" fontSize="10" fontFamily="monospace">
                PORT 50 + O-RING 80
              </text>

              {/* Explanation Card */}
              <g transform="translate(480, 110)">
                <rect width="240" height="180" rx="6" fill="#0c0a09" stroke="#57534e" strokeWidth="1" />
                <text x="14" y="28" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  KINEMATIC RESOLUTION
                </text>
                <text x="14" y="52" fill="#e7e5e4" fontSize="10" fontFamily="monospace">
                  • 3 DOFs: Flat Face Contact (Z, Pitch, Roll)
                </text>
                <text x="14" y="74" fill="#e7e5e4" fontSize="10" fontFamily="monospace">
                  • 2 DOFs: Cylindrical Pin 43 (X, Y Origin)
                </text>
                <text x="14" y="96" fill="#e7e5e4" fontSize="10" fontFamily="monospace">
                  • 1 DOF: Diamond Pin 44 (Yaw Rotation)
                </text>
                <text x="14" y="122" fill="#34d399" fontSize="10" fontFamily="monospace">
                  Repeatability: {(tel.positionalRepeatabilityMm * 1000).toFixed(1)} µm
                </text>
                <text x="14" y="144" fill="#a8a29e" fontSize="9" fontFamily="monospace">
                  Relieved diamond flats prevent thermal over-constraint.
                </text>
              </g>
            </g>
          )}

          {activeTab === "rack" && (
            <g id="passive-tool-rack">
              <rect x="60" y="40" width="680" height="360" rx="8" fill="#141210" stroke="#44403c" strokeWidth="1.5" />
              <text x="80" y="70" fill="#f59e0b" fontSize="14" fontFamily="serif" fontWeight="bold">
                Automated Multi-Tool Storage Rack Sequence (Figure 1)
              </text>

              {/* Storage Rack Structure 20 */}
              <rect x="120" y="240" width="560" height="20" rx="3" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
              <rect x="140" y="260" width="20" height="120" fill="#334155" />
              <rect x="640" y="260" width="20" height="120" fill="#334155" />

              {/* Tool 1 (Spot Welder in Bay 1) */}
              <rect x="180" y="180" width="80" height="60" rx="4" fill="#292524" stroke="#d97706" strokeWidth="1.5" />
              <text x="220" y="215" fill="#fcd34d" fontSize="9" fontFamily="monospace" textAnchor="middle">
                SPOT WELD
              </text>

              {/* Tool 2 (Gripper in Bay 2) */}
              <rect x="360" y="180" width="80" height="60" rx="4" fill="#292524" stroke="#0284c7" strokeWidth="1.5" />
              <text x="400" y="215" fill="#7dd3fc" fontSize="9" fontFamily="monospace" textAnchor="middle">
                GRIPPER
              </text>

              {/* Tool 3 (Sealant Dispenser in Bay 3) */}
              <rect x="540" y="180" width="80" height="60" rx="4" fill="#292524" stroke="#10b981" strokeWidth="1.5" />
              <text x="580" y="215" fill="#6ee7b7" fontSize="9" fontFamily="monospace" textAnchor="middle">
                DISPENSER
              </text>

              {/* Robot Arm Docking Trajectory Vector */}
              <path d="M 120,90 Q 220,110 220,165" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="5 3" />
              <text x="235" y="130" fill="#fbbf24" fontSize="11" fontFamily="monospace">
                AUTONOMOUS DOCKING PATH
              </text>

              <rect x="120" y="300" width="560" height="70" rx="4" fill="#1c1917" stroke="#57534e" strokeWidth="1" />
              <text x="140" y="325" fill="#fbbf24" fontSize="11" fontFamily="monospace">
                CYCLE SEQUENCE: (1) Approach Rack → (2) Engage Locating Pins → (3) Actuate Slide → (4) Verify Proximity → (5) Extract Tool
              </text>
              <text x="140" y="350" fill="#cbd5e1" fontSize="10" fontFamily="monospace">
                Enables a single 6-axis robot to perform welding, sealant dispensing, and part transfer in one production cycle.
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Sliders Panel */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Column 1: Pneumatic Supply */}
        <div className="space-y-4 rounded-xl border border-stone-800 bg-stone-900/60 p-4">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
            Pneumatics & Actuator
          </h3>

          <div>
            <div className="flex justify-between text-xs text-stone-300">
              <label htmlFor={`${baseId}-air-pressure`}>Air Pressure (MPa)</label>
              <span className="font-mono text-amber-300">{controls.airPressureMpa.toFixed(2)} MPa</span>
            </div>
            <input
              id={`${baseId}-air-pressure`}
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={controls.airPressureMpa}
              onChange={(e) => update("airPressureMpa", Number(e.target.value))}
              className="mt-1 w-full accent-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-stone-300">
              <label htmlFor={`${baseId}-cyl-bore`}>Cylinder Bore D_cyl (mm)</label>
              <span className="font-mono text-amber-300">{controls.cylinderBoreMm} mm</span>
            </div>
            <input
              id={`${baseId}-cyl-bore`}
              type="range"
              min="20"
              max="50"
              step="2"
              value={controls.cylinderBoreMm}
              onChange={(e) => update("cylinderBoreMm", Number(e.target.value))}
              className="mt-1 w-full accent-amber-500"
            />
          </div>
        </div>

        {/* Column 2: Wedging & Friction Mechanics */}
        <div className="space-y-4 rounded-xl border border-stone-800 bg-stone-900/60 p-4">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
            Wedge Ramp Friction
          </h3>

          <div>
            <div className="flex justify-between text-xs text-stone-300">
              <label htmlFor={`${baseId}-wedge-angle`}>Ramp Taper Angle θ (°)</label>
              <span className="font-mono text-amber-300">{controls.wedgeAngleDeg}°</span>
            </div>
            <input
              id={`${baseId}-wedge-angle`}
              type="range"
              min="4"
              max="15"
              step="0.5"
              value={controls.wedgeAngleDeg}
              onChange={(e) => update("wedgeAngleDeg", Number(e.target.value))}
              className="mt-1 w-full accent-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-stone-300">
              <label htmlFor={`${baseId}-friction-coeff`}>Friction Coeff µ_s</label>
              <span className="font-mono text-amber-300">{controls.frictionCoeff.toFixed(2)}</span>
            </div>
            <input
              id={`${baseId}-friction-coeff`}
              type="range"
              min="0.08"
              max="0.30"
              step="0.01"
              value={controls.frictionCoeff}
              onChange={(e) => update("frictionCoeff", Number(e.target.value))}
              className="mt-1 w-full accent-amber-500"
            />
          </div>
        </div>

        {/* Column 3: Slide Stroke & Docking Gap */}
        <div className="space-y-4 rounded-xl border border-stone-800 bg-stone-900/60 p-4">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
            Stroke & Docking
          </h3>

          <div>
            <div className="flex justify-between text-xs text-stone-300">
              <label htmlFor={`${baseId}-slide-stroke`}>Slide Stroke (mm)</label>
              <span className="font-mono text-amber-300">{controls.slideStrokeMm} mm</span>
            </div>
            <input
              id={`${baseId}-slide-stroke`}
              type="range"
              min="0"
              max="25"
              step="1"
              value={controls.slideStrokeMm}
              onChange={(e) => update("slideStrokeMm", Number(e.target.value))}
              className="mt-1 w-full accent-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-stone-300">
              <label htmlFor={`${baseId}-docking-gap`}>Docking Clearance Gap (mm)</label>
              <span className="font-mono text-amber-300">{controls.dockingGapMm.toFixed(1)} mm</span>
            </div>
            <input
              id={`${baseId}-docking-gap`}
              type="range"
              min="0"
              max="5"
              step="0.2"
              value={controls.dockingGapMm}
              onChange={(e) => update("dockingGapMm", Number(e.target.value))}
              className="mt-1 w-full accent-amber-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
