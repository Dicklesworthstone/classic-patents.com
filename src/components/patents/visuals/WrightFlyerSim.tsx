"use client";

import { AlertTriangle, CheckCircle2, Compass, RotateCcw } from "lucide-react";
import { useState } from "react";

export function WrightFlyerSim() {
  const [wingWarp, setWingWarp] = useState<number>(15); // degrees (-25 to 25)
  const [rudder, setRudder] = useState<number>(12); // degrees (-30 to 30)
  const [elevator, setElevator] = useState<number>(5); // degrees (-20 to 20)
  const [coordinatedMode, setCoordinatedMode] = useState<boolean>(true);

  // Aerodynamic math calculations
  const baseLift = 400; // Newtons
  const deltaLift = wingWarp * 12.5;
  const leftLift = Math.max(50, baseLift - deltaLift);
  const rightLift = Math.max(50, baseLift + deltaLift);

  // Induced drag calculation
  const leftDrag = (leftLift * leftLift) / 5000;
  const rightDrag = (rightLift * rightLift) / 5000;
  const rawYawMoment = (rightDrag - leftDrag) * 2.8; // Induced adverse yaw
  const rudderCorrectiveMoment = rudder * 5.2;
  const netYawMoment = rawYawMoment - rudderCorrectiveMoment;

  // Adverse yaw detection
  const isAdverseYaw =
    Math.abs(wingWarp) > 5 &&
    Math.sign(wingWarp) !== Math.sign(rudder) &&
    Math.abs(netYawMoment) > 15;
  const isCoordinated = Math.abs(netYawMoment) < 8 && Math.abs(wingWarp) > 2;

  const handleWarpChange = (val: number) => {
    setWingWarp(val);
    if (coordinatedMode) {
      // Wright synchronization: coordinate rudder to counteract adverse yaw
      setRudder(Math.round(val * 0.8));
    }
  };

  const resetControls = () => {
    setWingWarp(0);
    setRudder(0);
    setElevator(0);
  };

  return (
    <div className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-5 shadow-patent">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
              Interactive Wright 3-Axis Aerodynamic Simulator
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-0.5">
            Manipulate wing-warping cables and rudder to experience the Wrights&apos; coordinated
            roll-yaw solution.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setCoordinatedMode(!coordinatedMode);
              if (!coordinatedMode) setRudder(Math.round(wingWarp * 0.8));
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors border ${
              coordinatedMode
                ? "bg-amber-600 text-white border-amber-700 dark:bg-amber-500 dark:border-amber-400"
                : "bg-parchment-100 text-ink-700 border-parchment-300 dark:bg-ink-900 dark:text-ink-300 dark:border-ink-700"
            }`}
          >
            {coordinatedMode ? "✓ Wright Coordinated Link Active" : "Manual Uncoupled Mode"}
          </button>
          <button
            type="button"
            onClick={resetControls}
            className="p-1.5 rounded-lg border border-parchment-300 dark:border-ink-800 hover:bg-parchment-200 dark:hover:bg-ink-800 text-ink-700 dark:text-ink-300 transition-colors"
            title="Reset flight controls"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Flight Canvas & Graphic */}
      <div className="my-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-xl bg-gradient-to-b from-sky-100/50 to-parchment-100 dark:from-ink-900 dark:to-ink-950 p-6 border border-parchment-200 dark:border-ink-800 relative overflow-hidden min-h-[300px]">
          {/* Status Overlay Banner */}
          <div className="absolute top-3 left-3 z-10">
            {isAdverseYaw ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-300 text-xs font-mono font-semibold animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                DANGER: ADVERSE YAW DETECTED (Tail-slide stall risk)
              </div>
            ) : isCoordinated ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                COORDINATED BANKING TURN (Clean Equilibrium)
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-parchment-200/80 dark:bg-ink-800/80 border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-ink-300 text-xs font-mono">
                <Compass className="w-3.5 h-3.5" />
                Level Flight Equilibrium
              </div>
            )}
          </div>

          {/* SVG Flight Vehicle Visualization */}
          <svg viewBox="0 0 500 240" className="w-full max-w-lg h-auto drop-shadow-md select-none">
            <defs>
              <linearGradient id="wingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#d9c8b0" />
                <stop offset="100%" stopColor="#b0906f" />
              </linearGradient>
              <linearGradient id="liftGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Ground grid / horizon */}
            <line
              x1="0"
              y1="210"
              x2="500"
              y2="210"
              stroke="#cbd5e1"
              strokeDasharray="4 4"
              strokeWidth="1"
            />

            {/* Aircraft Group with dynamic roll and pitch rotation */}
            <g
              transform={`translate(250, 120) rotate(${wingWarp * 0.7}) scale(${1 + elevator * 0.01})`}
              className="transition-transform duration-150 ease-out"
            >
              {/* Forward Canard Elevator (Pitch) */}
              <g transform={`translate(0, -50) rotate(${elevator * 1.5})`}>
                <rect
                  x="-45"
                  y="-3"
                  width="90"
                  height="6"
                  rx="2"
                  fill="#7d5f46"
                  stroke="#4f3c2f"
                  strokeWidth="1"
                />
                <line x1="-30" y1="-2" x2="30" y2="-2" stroke="#e2e8f0" strokeWidth="0.8" />
                <text
                  x="0"
                  y="-8"
                  textAnchor="middle"
                  fontSize="8"
                  fill="#64748b"
                  fontFamily="monospace"
                >
                  Canard (Elevator: {elevator}°)
                </text>
              </g>

              {/* Canard Struts */}
              <line x1="-20" y1="-50" x2="-10" y2="-10" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="20" y1="-50" x2="10" y2="-10" stroke="#94a3b8" strokeWidth="1.5" />

              {/* Left Wing (Warped) */}
              <path
                d={`M -180,${-wingWarp * 0.8} L 0,-15 L 0,15 L -180,${15 - wingWarp * 0.8} Z`}
                fill="url(#wingGrad)"
                stroke="#644c3a"
                strokeWidth="1.5"
              />
              {/* Right Wing (Warped Opposite) */}
              <path
                d={`M 180,${wingWarp * 0.8} L 0,-15 L 0,15 L 180,${15 + wingWarp * 0.8} Z`}
                fill="url(#wingGrad)"
                stroke="#644c3a"
                strokeWidth="1.5"
              />

              {/* Wing Ribs */}
              {[-140, -100, -60, -20, 20, 60, 100, 140].map((x) => (
                <line
                  key={x}
                  x1={x}
                  y1="-12"
                  x2={x}
                  y2="12"
                  stroke="#7d5f46"
                  strokeWidth="0.8"
                  strokeDasharray="1 2"
                />
              ))}

              {/* Biplane Upper Wing */}
              <path
                d={`M -170,${-35 - wingWarp * 0.7} L 0,-30 L 170,${-30 + wingWarp * 0.7} L 170,${-22 + wingWarp * 0.7} L 0,-22 L -170,${-27 - wingWarp * 0.7} Z`}
                fill="url(#wingGrad)"
                stroke="#644c3a"
                strokeWidth="1.2"
                opacity="0.85"
              />

              {/* Vertical Struts & Warping Wire Bracing */}
              {[-150, -100, -50, 50, 100, 150].map((x) => (
                <g key={`strut-${x}`}>
                  <line x1={x} y1="-26" x2={x} y2="10" stroke="#475569" strokeWidth="1.5" />
                  <line
                    x1={x}
                    y1="-26"
                    x2={x + 25}
                    y2="10"
                    stroke="#94a3b8"
                    strokeWidth="0.6"
                    strokeDasharray="2 2"
                  />
                </g>
              ))}

              {/* Pilot Cradle (Center) */}
              <rect x="-18" y="5" width="36" height="12" rx="4" fill="#334155" />
              <circle cx="0" cy="11" r="5" fill="#f59e0b" />

              {/* Rear Outriggers to Rudder */}
              <line x1="-15" y1="10" x2="-8" y2="55" stroke="#94a3b8" strokeWidth="1.2" />
              <line x1="15" y1="10" x2="8" y2="55" stroke="#94a3b8" strokeWidth="1.2" />

              {/* Vertical Rudder (Yaw Deflection) */}
              <g transform={`translate(0, 60) rotate(${-rudder})`}>
                <rect
                  x="-4"
                  y="-2"
                  width="8"
                  height="36"
                  rx="2"
                  fill="#b91c1c"
                  stroke="#7f1d1d"
                  strokeWidth="1"
                />
                <line x1="0" y1="0" x2="0" y2="34" stroke="#fca5a5" strokeWidth="1" />
                <text
                  x="0"
                  y="44"
                  textAnchor="middle"
                  fontSize="8"
                  fill="#b91c1c"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  Rudder ({rudder}°)
                </text>
              </g>

              {/* Aerodynamic Lift Vectors */}
              {/* Left Wing Lift Arrow */}
              <g transform={`translate(-120, ${-20 - wingWarp * 0.8})`}>
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2={-leftLift * 0.12}
                  stroke="#2563eb"
                  strokeWidth="3"
                  markerEnd="url(#arrow)"
                />
                <polygon
                  points={`0,${-leftLift * 0.12 - 6} -4,${-leftLift * 0.12} 4,${-leftLift * 0.12}`}
                  fill="#2563eb"
                />
                <text
                  x="0"
                  y={-leftLift * 0.12 - 9}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#1d4ed8"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  L_left: {Math.round(leftLift)} N
                </text>
              </g>

              {/* Right Wing Lift Arrow */}
              <g transform={`translate(120, ${-20 + wingWarp * 0.8})`}>
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2={-rightLift * 0.12}
                  stroke="#2563eb"
                  strokeWidth="3"
                />
                <polygon
                  points={`0,${-rightLift * 0.12 - 6} -4,${-rightLift * 0.12} 4,${-rightLift * 0.12}`}
                  fill="#2563eb"
                />
                <text
                  x="0"
                  y={-rightLift * 0.12 - 9}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#1d4ed8"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  L_right: {Math.round(rightLift)} N
                </text>
              </g>
            </g>
          </svg>

          {/* Quick Guidance */}
          <div className="text-[11px] text-ink-500 dark:text-ink-400 mt-2 font-mono text-center">
            {coordinatedMode
              ? "Notice: Wing-warping cables automatically coordinate with the vertical rudder to keep turn coordinated."
              : "Try banking without moving the rudder: adverse induced drag on the high wing will trigger adverse yaw!"}
          </div>
        </div>

        {/* Controls & Gauges */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="space-y-4 bg-parchment-100/60 dark:bg-ink-900/60 p-4 rounded-xl border border-parchment-200 dark:border-ink-800">
            {/* Wing Warping Control */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Wing Warping (Roll / Bank)
                </span>
                <span className="text-amber-700 dark:text-amber-400 font-bold">{wingWarp}°</span>
              </div>
              <input
                type="range"
                min="-25"
                max="25"
                value={wingWarp}
                onChange={(e) => handleWarpChange(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-ink-500 font-mono mt-0.5">
                <span>Left Bank (-25°)</span>
                <span>Neutral (0°)</span>
                <span>Right Bank (+25°)</span>
              </div>
            </div>

            {/* Vertical Rudder Control */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Vertical Rudder (Yaw Angle)
                </span>
                <span className="text-red-700 dark:text-red-400 font-bold">{rudder}°</span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                disabled={coordinatedMode}
                value={rudder}
                onChange={(e) => setRudder(Number(e.target.value))}
                className={`w-full accent-red-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg ${
                  coordinatedMode ? "opacity-60 cursor-not-allowed" : ""
                }`}
              />
              <div className="flex justify-between text-[10px] text-ink-500 font-mono mt-0.5">
                <span>Port (-30°)</span>
                <span>Center (0°)</span>
                <span>Starboard (+30°)</span>
              </div>
            </div>

            {/* Forward Canard Elevator Control */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Forward Elevator (Pitch)
                </span>
                <span className="text-blue-700 dark:text-blue-400 font-bold">{elevator}°</span>
              </div>
              <input
                type="range"
                min="-20"
                max="20"
                value={elevator}
                onChange={(e) => setElevator(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-ink-500 font-mono mt-0.5">
                <span>Nose Down (-20°)</span>
                <span>Level (0°)</span>
                <span>Climb (+20°)</span>
              </div>
            </div>
          </div>

          {/* Telemetry Panel */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-parchment-200/50 dark:bg-ink-900/80 p-3 rounded-lg border border-parchment-300 dark:border-ink-800">
            <div>
              <span className="text-ink-500 text-[10px] block">Net Roll Moment</span>
              <span className="font-bold text-ink-900 dark:text-parchment-100">
                {Math.round((rightLift - leftLift) * 1.5)} N·m
              </span>
            </div>
            <div>
              <span className="text-ink-500 text-[10px] block">Net Yaw Moment</span>
              <span
                className={`font-bold ${Math.abs(netYawMoment) > 12 ? "text-red-600" : "text-emerald-600"}`}
              >
                {Math.round(netYawMoment)} N·m
              </span>
            </div>
            <div>
              <span className="text-ink-500 text-[10px] block">Induced Drag Delta</span>
              <span className="font-bold text-ink-900 dark:text-parchment-100">
                {Math.abs(Math.round(rightDrag - leftDrag))} N
              </span>
            </div>
            <div>
              <span className="text-ink-500 text-[10px] block">Effective Cl / Cd</span>
              <span className="font-bold text-ink-900 dark:text-parchment-100">
                {(baseLift / Math.max(1, leftDrag + rightDrag)).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
