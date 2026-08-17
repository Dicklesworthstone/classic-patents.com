"use client";

import { Wind } from "lucide-react";
import { useState } from "react";

export function WrightFlyerSim() {
  // Flight control state
  const [wingWarpAngle, setWingWarpAngle] = useState<number>(15); // deg (-30 to +30)
  const [rudderAngle, setRudderAngle] = useState<number>(11); // deg (-30 to +30)
  const [canardAngle, setCanardAngle] = useState<number>(5); // deg (-20 to +20)
  const [isCoupled, setIsCoupled] = useState<boolean>(true); // Wright Claim 1: Coordinated wing-warping + rudder
  const [activeStep, setActiveStep] = useState<number>(3); // matches default coupled cruise

  // Positive warp = right bank = more lift (and induced drag) on the RIGHT wing.
  const leftWingLift = 100 - wingWarpAngle * 2.2;
  const rightWingLift = 100 + wingWarpAngle * 2.2;
  const leftInducedDrag = (leftWingLift / 100) ** 2 * 15;
  const rightInducedDrag = (rightWingLift / 100) ** 2 * 15;

  // Positive yaw moment = starboard (right). Extra right-wing drag yaws the nose left.
  const adverseYawTorque = (leftInducedDrag - rightInducedDrag) * 1.5;
  const rudderRestoringTorque = rudderAngle * 3.0;
  const netYawMoment = adverseYawTorque + rudderRestoringTorque;

  const isCoordinatedTurn = Math.abs(netYawMoment) < 10 && Math.abs(wingWarpAngle) > 8;
  const isAdverseYawCrash =
    Math.abs(netYawMoment) > 18 && Math.abs(wingWarpAngle) > 15 && !isCoupled;

  // Step presets for guided pedagogical walkthrough
  const applyPedagogyStep = (step: number) => {
    setActiveStep(step);
    if (step === 1) {
      // Step 1: The Adverse Yaw Trap (Prior Art Failure)
      setWingWarpAngle(22);
      setRudderAngle(0);
      setIsCoupled(false);
    } else if (step === 2) {
      // Step 2: Pure Wing Warping Roll
      setWingWarpAngle(18);
      setRudderAngle(0);
      setIsCoupled(false);
    } else if (step === 3) {
      // Step 3: Wright Master Breakthrough (Claim 1: Coordinated Rudder)
      setWingWarpAngle(18);
      setRudderAngle(13);
      setIsCoupled(true);
    }
  };

  const handleWarpChange = (val: number) => {
    setWingWarpAngle(val);
    if (isCoupled) {
      // Hip-cradle cables: right bank pulls starboard rudder to cancel leftward adverse yaw
      setRudderAngle(Math.round(val * 0.7));
    }
  };

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 shadow-patent space-y-6">
      {/* Simulation Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-serif text-xl font-bold text-ink-900 dark:text-parchment-100">
              Wright Flyer 3-Axis Flight Dynamics Simulator (US 821,393)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-1">
            Discover why the Wrights patented <strong>coordinated aerodynamic control</strong>{" "}
            rather than an engine or lifting airframe.
          </p>
        </div>

        {/* Guided Learning Stepper */}
        <div className="flex items-center gap-1.5 bg-parchment-200 dark:bg-ink-900 p-1 rounded-xl border border-parchment-300 dark:border-ink-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => applyPedagogyStep(1)}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              activeStep === 1
                ? "bg-red-600 text-white font-bold"
                : "text-ink-700 dark:text-ink-400 hover:text-ink-900"
            }`}
          >
            1. Adverse Yaw Trap
          </button>
          <button
            type="button"
            onClick={() => applyPedagogyStep(2)}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              activeStep === 2
                ? "bg-amber-600 text-white font-bold"
                : "text-ink-700 dark:text-ink-400 hover:text-ink-900"
            }`}
          >
            2. Wing Warping
          </button>
          <button
            type="button"
            onClick={() => applyPedagogyStep(3)}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              activeStep === 3
                ? "bg-emerald-600 text-white font-bold"
                : "text-ink-700 dark:text-ink-400 hover:text-ink-900"
            }`}
          >
            3. Wright Solution (Claim 1)
          </button>
        </div>
      </div>

      {/* Aerodynamic Visualizer Canvas & Flight Vehicle */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-ink-950 p-6 border border-parchment-200 dark:border-ink-800 relative min-h-[360px] overflow-hidden">
          {/* Blueprint drafting grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 pointer-events-none" />

          {/* Status Alert Banner */}
          <div className="w-full flex items-center justify-between z-10 mb-4 px-2">
            {isAdverseYawCrash && (
              <div className="px-3 py-1 bg-red-950/90 border border-red-700 text-red-300 text-xs font-mono rounded-lg flex items-center gap-1.5 animate-pulse">
                <span>
                  ⚠ ADVERSE YAW: The rising wing&apos;s extra induced drag yaws the nose opposite
                  the roll!
                </span>
              </div>
            )}
            {isCoordinatedTurn && (
              <div className="px-3 py-1 bg-emerald-950/90 border border-emerald-700 text-emerald-300 text-xs font-mono rounded-lg flex items-center gap-1.5">
                <span>✓ COORDINATED TURN: Rudder counter-torque neutralizes adverse yaw!</span>
              </div>
            )}
            {!isAdverseYawCrash && !isCoordinatedTurn && (
              <div className="px-3 py-1 bg-ink-900/90 border border-ink-800 text-ink-300 text-xs font-mono rounded-lg">
                Aerodynamic equilibrium (Level cruise)
              </div>
            )}

            <div className="text-xs font-mono text-amber-400">
              Net Yaw Torque: <span className="font-bold">{netYawMoment.toFixed(1)} N·m</span>
            </div>
          </div>

          {/* Dynamic Vector Biplane Illustration */}
          <svg viewBox="0 0 500 240" className="w-full max-w-lg h-auto select-none relative z-10">
            <defs>
              <linearGradient id="wingCanvasGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <marker
                id="wright-lift-arrow"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#10b981" />
              </marker>
            </defs>

            {/* Artificial Horizon Pitch Reference */}
            <line
              x1="20"
              y1="120"
              x2="480"
              y2="120"
              stroke="#334155"
              strokeWidth="1"
              strokeDasharray="6 4"
            />

            {/* Aircraft Group with 3-Axis Rotation */}
            <g
              transform={`translate(250, 120) rotate(${wingWarpAngle * 0.9}) translate(0, ${canardAngle * -1.2})`}
              className="transition-transform duration-150 ease-out"
            >
              {/* Forward Elevator / Canard */}
              <rect
                x="-35"
                y="-60"
                width="70"
                height="8"
                rx="2"
                fill="#d97706"
                stroke="#f59e0b"
                strokeWidth="1.5"
              />
              <text
                x="0"
                y="-70"
                fill="#fde68a"
                fontSize="9"
                textAnchor="middle"
                fontFamily="monospace"
              >
                Forward Canard ({canardAngle}°)
              </text>

              {/* Canard Struts */}
              <line x1="-20" y1="-52" x2="-25" y2="-10" stroke="#64748b" strokeWidth="1.5" />
              <line x1="20" y1="-52" x2="25" y2="-10" stroke="#64748b" strokeWidth="1.5" />

              {/* Top Biplane Wing */}
              <rect
                x="-190"
                y="-28"
                width="380"
                height="14"
                rx="4"
                fill="url(#wingCanvasGrad)"
                stroke="#b45309"
                strokeWidth="2"
              />

              {/* Interplane Struts and Diagonal Truss Wires */}
              <line x1="-160" y1="-14" x2="-160" y2="14" stroke="#475569" strokeWidth="2" />
              <line x1="-80" y1="-14" x2="-80" y2="14" stroke="#475569" strokeWidth="2" />
              <line x1="0" y1="-14" x2="0" y2="14" stroke="#475569" strokeWidth="2" />
              <line x1="80" y1="-14" x2="80" y2="14" stroke="#475569" strokeWidth="2" />
              <line x1="160" y1="-14" x2="160" y2="14" stroke="#475569" strokeWidth="2" />

              {/* Diagonal Warping Control Cables */}
              <line
                x1="-160"
                y1="-14"
                x2="-80"
                y2="14"
                stroke="#f59e0b"
                strokeWidth="1"
                strokeDasharray="3 2"
              />
              <line
                x1="160"
                y1="-14"
                x2="80"
                y2="14"
                stroke="#f59e0b"
                strokeWidth="1"
                strokeDasharray="3 2"
              />

              {/* Bottom Biplane Wing */}
              <rect
                x="-190"
                y="14"
                width="380"
                height="14"
                rx="4"
                fill="url(#wingCanvasGrad)"
                stroke="#b45309"
                strokeWidth="2"
              />

              {/* Pilot Cradle Position */}
              <rect
                x="-18"
                y="4"
                width="36"
                height="12"
                rx="3"
                fill="#78350f"
                stroke="#f59e0b"
                strokeWidth="1"
              />
              <text
                x="0"
                y="12"
                fill="#fff"
                fontSize="8"
                textAnchor="middle"
                fontFamily="monospace"
                fontWeight="bold"
              >
                PILOT
              </text>

              {/* Rear Double Vertical Rudder */}
              <g transform={`translate(0, 55) rotate(${rudderAngle * 1.2})`}>
                <rect
                  x="-12"
                  y="0"
                  width="6"
                  height="30"
                  rx="1"
                  fill="#ef4444"
                  stroke="#f87171"
                  strokeWidth="1.5"
                />
                <rect
                  x="6"
                  y="0"
                  width="6"
                  height="30"
                  rx="1"
                  fill="#ef4444"
                  stroke="#f87171"
                  strokeWidth="1.5"
                />
                <line x1="-12" y1="15" x2="12" y2="15" stroke="#991b1b" strokeWidth="2" />
                <text
                  x="0"
                  y="42"
                  fill="#fca5a5"
                  fontSize="9"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  Rudder ({rudderAngle}°)
                </text>
              </g>

              {/* Left Wing Dynamic Lift & Drag Vector Arrows */}
              <g transform="translate(-140, -32)">
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2={-leftWingLift * 0.4}
                  stroke="#10b981"
                  strokeWidth="3"
                  markerEnd="url(#wright-lift-arrow)"
                />
                <text
                  x="-8"
                  y={-leftWingLift * 0.4 - 6}
                  fill="#34d399"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  Lift: {Math.round(leftWingLift)}%
                </text>
                <line
                  x1="0"
                  y1="0"
                  x2={-leftInducedDrag * 2}
                  y2="0"
                  stroke="#f43f5e"
                  strokeWidth="2"
                />
                <text
                  x={-leftInducedDrag * 2 - 8}
                  y="14"
                  fill="#fb7185"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  Drag: {Math.round(leftInducedDrag)}
                </text>
              </g>

              {/* Right Wing Dynamic Lift & Drag Vector Arrows */}
              <g transform="translate(140, -32)">
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2={-rightWingLift * 0.4}
                  stroke="#10b981"
                  strokeWidth="3"
                  markerEnd="url(#wright-lift-arrow)"
                />
                <text
                  x="-8"
                  y={-rightWingLift * 0.4 - 6}
                  fill="#34d399"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  Lift: {Math.round(rightWingLift)}%
                </text>
                <line
                  x1="0"
                  y1="0"
                  x2={rightInducedDrag * 2}
                  y2="0"
                  stroke="#f43f5e"
                  strokeWidth="2"
                />
                <text
                  x={rightInducedDrag * 2 + 8}
                  y="14"
                  fill="#fb7185"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  Drag: {Math.round(rightInducedDrag)}
                </text>
              </g>
            </g>
          </svg>

          {/* Telemetry Footer */}
          <div className="w-full grid grid-cols-3 gap-2 text-center text-xs font-mono pt-3 border-t border-ink-800 text-ink-300">
            <div>
              <span className="text-ink-500 block text-[10px]">ROLL CONTROL</span>
              <span className="text-amber-400 font-bold">
                Δ Lift = {(leftWingLift - rightWingLift).toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-ink-500 block text-[10px]">YAW COUPLING</span>
              <span className={isCoupled ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                {isCoupled ? "Cable Linked (Claim 1)" : "Independent (Unlinked)"}
              </span>
            </div>
            <div>
              <span className="text-ink-500 block text-[10px]">PITCH ATTITUDE</span>
              <span className="text-blue-400 font-bold">Canard = {canardAngle}°</span>
            </div>
          </div>
        </div>

        {/* Flight Controls Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/70 dark:bg-ink-900/60 p-5 space-y-4">
            <span className="font-serif font-bold text-sm text-ink-900 dark:text-parchment-100 block">
              Pilot Flight Deck Controls
            </span>

            {/* Wing Warping Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Wing Warping (Hip Cradle)
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {wingWarpAngle}°
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                value={wingWarpAngle}
                onChange={(e) => handleWarpChange(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-ink-500 font-mono">
                <span>Left Bank (-30°)</span>
                <span>Neutral</span>
                <span>Right Bank (+30°)</span>
              </div>
            </div>

            {/* Rudder Control Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Vertical Rear Rudder
                </span>
                <span className="text-red-600 dark:text-red-400 font-bold">{rudderAngle}°</span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                value={rudderAngle}
                disabled={isCoupled}
                onChange={(e) => setRudderAngle(Number(e.target.value))}
                className={`w-full accent-red-600 h-2 rounded-lg ${
                  isCoupled
                    ? "opacity-50 cursor-not-allowed bg-ink-800"
                    : "cursor-pointer bg-parchment-300 dark:bg-ink-700"
                }`}
              />
              <div className="flex justify-between text-[10px] text-ink-500 font-mono">
                <span>Port (-30°)</span>
                <span>Centered</span>
                <span>Starboard (+30°)</span>
              </div>
            </div>

            {/* Forward Canard Pitch Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Forward Canard Elevator (Pitch)
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">{canardAngle}°</span>
              </div>
              <input
                type="range"
                min="-20"
                max="20"
                value={canardAngle}
                onChange={(e) => setCanardAngle(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Coupling Toggle (Wright Claim 1) */}
            <div className="pt-2 border-t border-parchment-300 dark:border-ink-800">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono">
                <input
                  type="checkbox"
                  checked={isCoupled}
                  onChange={(e) => {
                    setIsCoupled(e.target.checked);
                    if (e.target.checked) {
                      setRudderAngle(Math.round(wingWarpAngle * 0.7));
                    }
                  }}
                  className="rounded accent-emerald-600 w-4 h-4"
                />
                <span className="font-bold text-ink-900 dark:text-parchment-100">
                  Enable Wright Claim 1 Cable Coupling
                </span>
              </label>
              <p className="text-[11px] text-ink-600 dark:text-ink-400 font-sans mt-1">
                When enabled, the hip cradle automatically turns the rear rudder in synchrony with
                wing warping.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
