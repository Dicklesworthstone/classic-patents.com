"use client";

import { useId, useMemo, useRef, useState } from "react";
import { PhysicsTelemetryBadge } from "@/components/patents/PhysicsTelemetryBadge";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { ALL_COLORIZED_EQUATIONS } from "@/data/colorizedEquations";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import {
  readKamenTransporterControls,
  stepKamenTransporterSi,
} from "@/physics/kamenTransporterKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

export function KamenTransporterSim({
  patentId = "us-5701965-kamen-transporter",
}: {
  patentId?: string;
}) {
  const { effectiveParams, claimStates, updateParam } = usePatentPhysics(patentId);
  const controls = useMemo(() => readKamenTransporterControls(effectiveParams), [effectiveParams]);
  const tel = useMemo(() => stepKamenTransporterSi(controls), [controls]);
  const equations = useMemo(() => ALL_COLORIZED_EQUATIONS[patentId] ?? [], [patentId]);

  const clipId = useId();
  const [isDraggingTilt, setIsDraggingTilt] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const width = 640;
  const height = 460;
  const groundY = 380;
  const centerX = width / 2;

  // Wheel and cluster dimensions in SVG coordinates
  const wheelRadius = 38;
  const clusterRadius = 46;

  // Calculate cluster center and orientation based on mode
  const isBalanceMode = controls.operatingMode === "balance_2wheel";
  const isStairMode = controls.operatingMode === "stair_climb";

  // Center of gravity height in SVG units
  const cgElevation = isBalanceMode ? 180 : 100;
  const chassisPitchDeg = tel.pitchAngleDeg;
  const pitchRad = (chassisPitchDeg * Math.PI) / 180;

  // Cluster rotation angle
  const clusterAngleRad = (tel.clusterAngleDeg * Math.PI) / 180;

  // Hub center position
  const hubX = centerX;
  const hubY = groundY - wheelRadius - (isBalanceMode ? clusterRadius : 0);

  // Calculate 2 cluster wheels coordinates
  const wheel1X = hubX - clusterRadius * Math.sin(clusterAngleRad);
  const wheel1Y = hubY + clusterRadius * Math.cos(clusterAngleRad);
  const wheel2X = hubX + clusterRadius * Math.sin(clusterAngleRad);
  const wheel2Y = hubY - clusterRadius * Math.cos(clusterAngleRad);

  // Chassis center of gravity point
  const cgX = hubX + cgElevation * Math.sin(pitchRad);
  const cgY = hubY - cgElevation * Math.cos(pitchRad);

  const handlePointerDown = () => {
    setIsDraggingTilt(true);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDraggingTilt || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const dx = x - centerX;
    // Map dx to rider pitch lean degrees [-15..15]
    const clampedLean = Math.max(-15, Math.min(15, Math.round(dx * 0.15)));
    updateParam("riderPitchLeanDeg", clampedLean);
  };

  const handlePointerUp = () => {
    setIsDraggingTilt(false);
  };

  return (
    <div className="w-full bg-parchment-50 dark:bg-ink-950 rounded-2xl border border-parchment-300 dark:border-ink-800 p-6 flex flex-col items-center space-y-6 shadow-patent">
      {/* Simulation Header */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-cyan-100 dark:bg-cyan-900/60 text-cyan-800 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-700">
              US 5,701,965
            </span>
            <span className="text-xs font-mono font-medium text-ink-500 dark:text-ink-400">
              DEAN L. KAMEN (1997)
            </span>
          </div>
          <h3 className="text-lg font-serif font-bold text-ink-900 dark:text-parchment-100 mt-1">
            Inverted Pendulum Dynamic Balance & Cluster Stair Climber
          </h3>
        </div>
        <PhysicsTelemetryBadge
          patentId={patentId}
          equations={ALL_COLORIZED_EQUATIONS[patentId] ?? []}
        />
      </div>

      {/* SVG Interactive Canvas */}
      <div className="relative w-full max-w-[640px] aspect-[4/3] bg-parchment-100 dark:bg-ink-900 rounded-xl border border-parchment-300 dark:border-ink-800 overflow-hidden select-none">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full cursor-crosshair touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
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

          {/* Background Grid */}
          <g
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-parchment-300 dark:text-ink-800"
            opacity="0.6"
          >
            {Array.from({ length: 15 }).map((_, i) => (
              <line key={`grid-h-${i}`} x1="0" y1={i * 30} x2={width} y2={i * 30} />
            ))}
            {Array.from({ length: 22 }).map((_, i) => (
              <line key={`grid-v-${i}`} x1={i * 30} y1="0" x2={i * 30} y2={height} />
            ))}
          </g>

          {/* Ground Plane or Stair Profile */}
          {isStairMode ? (
            <path
              d={`M 0,${groundY} L 240,${groundY} L 240,${groundY - 50} L 360,${groundY - 50} L 360,${groundY - 100} L ${width},${groundY - 100} L ${width},${height} L 0,${height} Z`}
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

          {/* Gravito-Inertial Plumbline from Hub */}
          <line
            x1={hubX}
            y1={hubY}
            x2={hubX}
            y2={hubY - 220}
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Inverted Pendulum Vector from Hub to CG */}
          <line
            x1={hubX}
            y1={hubY}
            x2={cgX}
            y2={cgY}
            stroke={tel.pitchRefusal ? "#ef4444" : "#0284c7"}
            strokeWidth="4"
          />

          {/* Cluster Carrier Arm */}
          <line
            x1={wheel1X}
            y1={wheel1Y}
            x2={wheel2X}
            y2={wheel2Y}
            stroke="#64748b"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Cluster Wheel 1 */}
          <circle
            cx={wheel1X}
            cy={wheel1Y}
            r={wheelRadius}
            fill="#1e293b"
            stroke="#38bdf8"
            strokeWidth="4"
          />
          <circle cx={wheel1X} cy={wheel1Y} r="6" fill="#94a3b8" />

          {/* Cluster Wheel 2 */}
          <circle
            cx={wheel2X}
            cy={wheel2Y}
            r={wheelRadius}
            fill="#1e293b"
            stroke="#38bdf8"
            strokeWidth="4"
          />
          <circle cx={wheel2X} cy={wheel2Y} r="6" fill="#94a3b8" />

          {/* Central Cluster Axle Hub */}
          <circle cx={hubX} cy={hubY} r="14" fill="#0f172a" stroke="#fbbf24" strokeWidth="3" />

          {/* Chassis / Chair Assembly Oriented along Pitch Vector */}
          <g transform={`translate(${cgX}, ${cgY}) rotate(${chassisPitchDeg})`}>
            {/* Passenger Seat Back & Base */}
            <rect
              x="-25"
              y="-15"
              width="50"
              height="30"
              rx="6"
              fill={`url(#chassis-grad-${clipId})`}
              stroke="#38bdf8"
              strokeWidth="2"
            />
            {/* Elevated Backrest */}
            <rect
              x="-20"
              y="-65"
              width="14"
              height="55"
              rx="4"
              fill="#0369a1"
              stroke="#38bdf8"
              strokeWidth="1.5"
            />
            {/* Handlebar / Joystick */}
            <line
              x1="15"
              y1="-5"
              x2="28"
              y2="-45"
              stroke="#f59e0b"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="28" cy="-45" r="4" fill="#f59e0b" />
          </g>

          {/* Center of Gravity (CG) Marker */}
          <circle
            cx={cgX}
            cy={cgY}
            r="9"
            fill={tel.pitchRefusal ? "#ef4444" : "#10b981"}
            stroke="#ffffff"
            strokeWidth="2"
          />

          {/* Motor Restoring Torque Arc */}
          {isBalanceMode && Math.abs(tel.balanceTorqueNm) > 5 && (
            <path
              d={`M ${hubX + (tel.balanceTorqueNm > 0 ? 30 : -30)},${hubY - 20} A 35 35 0 0 ${tel.balanceTorqueNm > 0 ? 1 : 0} ${hubX + (tel.balanceTorqueNm > 0 ? 10 : -10)},${hubY - 45}`}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3.5"
              strokeLinecap="round"
              markerEnd="url(#arrow)"
            />
          )}

          {/* HUD Annotations */}
          <text
            x="20"
            y="35"
            className="text-[11px] font-mono font-bold fill-ink-700 dark:fill-parchment-200"
          >
            PITCH TILT (θ): {tel.pitchAngleDeg.toFixed(1)}°
          </text>
          <text
            x="20"
            y="52"
            className="text-[11px] font-mono font-bold fill-ink-700 dark:fill-parchment-200"
          >
            RESTORING TORQUE: {tel.balanceTorqueNm.toFixed(1)} N·m
          </text>
          <text
            x="20"
            y="69"
            className="text-[11px] font-mono font-bold fill-ink-700 dark:fill-parchment-200"
          >
            SPEED: {tel.forwardVelocityMs.toFixed(2)} m/s
          </text>
        </svg>
      </div>

      {/* Interactive Controls Panel */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        <div className="p-3 bg-parchment-100 dark:bg-ink-900 rounded-lg border border-parchment-200 dark:border-ink-800 space-y-2">
          <div className="flex justify-between items-center text-ink-700 dark:text-parchment-200">
            <label htmlFor="rider-lean-range">Rider Body Lean</label>
            <span className="font-bold text-cyan-600 dark:text-cyan-400">
              {controls.riderPitchLeanDeg}°
            </span>
          </div>
          <input
            id="rider-lean-range"
            type="range"
            min="-15"
            max="15"
            step="1"
            value={controls.riderPitchLeanDeg}
            onChange={(e) => updateParam("riderPitchLeanDeg", Number(e.target.value))}
            className="w-full accent-cyan-600"
          />
        </div>

        <div className="p-3 bg-parchment-100 dark:bg-ink-900 rounded-lg border border-parchment-200 dark:border-ink-800 space-y-2">
          <div className="flex justify-between items-center text-ink-700 dark:text-parchment-200">
            <label htmlFor="vel-cmd-range">Velocity Command</label>
            <span className="font-bold text-cyan-600 dark:text-cyan-400">
              {controls.velocityCommandMs.toFixed(1)} m/s
            </span>
          </div>
          <input
            id="vel-cmd-range"
            type="range"
            min="-2.0"
            max="4.0"
            step="0.2"
            value={controls.velocityCommandMs}
            onChange={(e) => updateParam("velocityCommandMs", Number(e.target.value))}
            className="w-full accent-cyan-600"
          />
        </div>

        <div className="p-3 bg-parchment-100 dark:bg-ink-900 rounded-lg border border-parchment-200 dark:border-ink-800 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-bold text-ink-800 dark:text-parchment-100">Operating Mode</span>
            <span className="text-[10px] text-ink-500 dark:text-ink-400">
              {controls.operatingMode.toUpperCase().replace("_", " ")}
            </span>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => updateParam("operatingMode", "balance_2wheel" as unknown as number)}
              className={`px-2 py-1 rounded text-[10px] font-bold ${
                isBalanceMode
                  ? "bg-cyan-600 text-white"
                  : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300"
              }`}
            >
              2-WHEEL
            </button>
            <button
              type="button"
              onClick={() => updateParam("operatingMode", "standard_4wheel" as unknown as number)}
              className={`px-2 py-1 rounded text-[10px] font-bold ${
                controls.operatingMode === "standard_4wheel"
                  ? "bg-cyan-600 text-white"
                  : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300"
              }`}
            >
              4-WHEEL
            </button>
            <button
              type="button"
              onClick={() => updateParam("operatingMode", "stair_climb" as unknown as number)}
              className={`px-2 py-1 rounded text-[10px] font-bold ${
                isStairMode
                  ? "bg-amber-600 text-white"
                  : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300"
              }`}
            >
              STAIRS
            </button>
          </div>
        </div>

        <div className="col-span-full pt-2 border-t border-parchment-200 dark:border-ink-800">
          <ClaimConstraintToggle
            patentId={patentId}
            claimStates={claimStates}
            onClaimStateChange={(num, active) =>
              updateParam(claimConstraintStateParamId(num), active ? 1 : 0)
            }
          />
        </div>
      </div>

      <PhysicsTelemetryBadge patentId={patentId} equations={equations} />
    </div>
  );
}
