"use client";

import { RotateCcw, Volume2, VolumeX, Wind } from "lucide-react";
import { useState } from "react";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import {
  coupledRudderDeg,
  readWrightControls,
  stepWrightFlyerSi,
  WRIGHT_PATENT_ID,
} from "@/physics/wrightKernel";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";

export function WrightFlyerSim() {
  const { params, updateParam, resetParams } = usePatentPhysics(WRIGHT_PATENT_ID);
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const controls = readWrightControls(params);
  const si = stepWrightFlyerSi(controls);
  const _wingWarpAngle = controls.wingWarpDeg;
  const rudderAngle = controls.rudderDeg;
  const canardAngle = controls.elevatorDeg;
  const isCoupled = controls.coupled;
  const [activeStep, setActiveStep] = useState<number>(0);

  const leftLiftN = si.leftLiftN;
  const rightLiftN = si.rightLiftN;
  const leftInducedDrag = si.leftInducedDragNewtons;
  const rightInducedDrag = si.rightInducedDragNewtons;
  const netYawMoment = si.netYawNm;
  const isCoordinatedTurn = si.coordinated;
  const isAdverseYawCrash = si.adverseYawDominant;

  // Step presets for guided pedagogical walkthrough
  const applyPedagogyStep = (step: number) => {
    setActiveStep(step);
    if (step === 0) {
      updateParam("coupled", 1);
      updateParam("wingWarp", 0);
      updateParam("rudder", 0);
      updateParam("elevator", 0);
    } else if (step === 1) {
      updateParam("coupled", 0);
      updateParam("wingWarp", 14);
      updateParam("rudder", 0);
    } else if (step === 2) {
      updateParam("coupled", 0);
      updateParam("wingWarp", 12);
      updateParam("rudder", 0);
    } else if (step === 3) {
      updateParam("coupled", 1);
      updateParam("wingWarp", 12);
      updateParam("rudder", coupledRudderDeg(12));
    }
  };

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 shadow-patent space-y-6">
      {/* Simulation Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
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

        <div className="flex flex-wrap items-center gap-2 self-end lg:self-auto">
          {/* Guided Learning Stepper */}
          <div className="flex flex-wrap items-center gap-1.5 bg-parchment-200 dark:bg-ink-900 p-1 rounded-xl border border-parchment-300 dark:border-ink-800 text-xs font-mono">
            <button
              type="button"
              aria-pressed={activeStep === 0}
              onClick={() => {
                applyPedagogyStep(0);
                soundEngine.playSwitchClick();
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeStep === 0
                  ? "bg-amber-700 text-white font-bold shadow-sm dark:bg-amber-700"
                  : "text-ink-700 dark:text-ink-400 hover:text-ink-900"
              }`}
            >
              Level Trim
            </button>
            <button
              type="button"
              aria-pressed={activeStep === 1}
              onClick={() => {
                applyPedagogyStep(1);
                soundEngine.playSwitchClick();
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeStep === 1
                  ? "bg-rose-700 text-white font-bold shadow-sm dark:bg-rose-600"
                  : "text-ink-700 dark:text-ink-400 hover:text-ink-900"
              }`}
            >
              1. Adverse Yaw Trap
            </button>
            <button
              type="button"
              aria-pressed={activeStep === 2}
              onClick={() => {
                applyPedagogyStep(2);
                soundEngine.playSwitchClick();
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeStep === 2
                  ? "bg-amber-700 text-white font-bold shadow-sm dark:bg-amber-700"
                  : "text-ink-700 dark:text-ink-400 hover:text-ink-900"
              }`}
            >
              2. Wing Warping
            </button>
            <button
              type="button"
              aria-pressed={activeStep === 3}
              onClick={() => {
                applyPedagogyStep(3);
                soundEngine.playSwitchClick();
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeStep === 3
                  ? "bg-emerald-700 text-white font-bold shadow-sm dark:bg-emerald-600"
                  : "text-ink-700 dark:text-ink-400 hover:text-ink-900"
              }`}
            >
              3. Wright Solution (Claim 18)
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            aria-label={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              resetParams();
              applyPedagogyStep(0);
              soundEngine.playSwitchClick();
            }}
            aria-label="Reset Simulation"
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Aerodynamic Visualizer Canvas & Flight Vehicle */}
      <div className="flex flex-col items-center justify-center rounded-2xl bg-ink-950 p-6 border border-parchment-200 dark:border-ink-800 relative min-h-[360px] overflow-hidden">
        {/* Blueprint drafting grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 pointer-events-none" />

        {/* Status Alert Banner */}
        <div className="w-full flex flex-wrap items-center justify-between gap-2 z-10 mb-4 px-2">
          {isAdverseYawCrash && (
            <div className="px-3 py-1 bg-red-950/90 border border-red-700 text-red-300 text-xs font-mono rounded-lg flex items-center gap-1.5 animate-pulse">
              <span className="text-left">
                ⚠ ADVERSE YAW: The rising wing&apos;s extra induced drag yaws the nose opposite the
                roll!
              </span>
            </div>
          )}
          {isCoordinatedTurn && (
            <div className="px-3 py-1 bg-emerald-950/90 border border-emerald-700 text-emerald-300 text-xs font-mono rounded-lg flex items-center gap-1.5">
              <span className="text-left">
                ✓ COORDINATED TURN: Rudder counter-torque neutralizes adverse yaw!
              </span>
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
        <svg
          viewBox="0 0 500 240"
          role="img"
          aria-label="Interactive side-view diagram of the 1903 Wright Flyer responding to wing warp, rudder, and canard inputs"
          className="w-full max-w-lg h-auto select-none relative z-10"
        >
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
            transform={`translate(250, 120) rotate(${si.airframeRollDeg}) translate(0, ${si.canardSvgY})`}
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
            <g transform={`translate(0, 55) rotate(${rudderAngle * si.rudderSvgScale})`}>
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
                y2={-si.leftLiftSvgY}
                stroke="#10b981"
                strokeWidth="3"
                markerEnd="url(#wright-lift-arrow)"
              />
              <text
                x="-8"
                y={-si.leftLiftSvgY - 6}
                fill="#34d399"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                Lift: {Math.round(leftLiftN)} N
              </text>
              <line x1="0" y1="0" x2={-si.leftDragSvgX} y2="0" stroke="#f43f5e" strokeWidth="2" />
              <text
                x={-si.leftDragSvgX - 8}
                y="14"
                fill="#fb7185"
                fontSize="8"
                fontFamily="monospace"
              >
                Drag: {Math.round(leftInducedDrag)} N
              </text>
            </g>

            {/* Right Wing Dynamic Lift & Drag Vector Arrows */}
            <g transform="translate(140, -32)">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2={-si.rightLiftSvgY}
                stroke="#10b981"
                strokeWidth="3"
                markerEnd="url(#wright-lift-arrow)"
              />
              <text
                x="-8"
                y={-si.rightLiftSvgY - 6}
                fill="#34d399"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                Lift: {Math.round(rightLiftN)} N
              </text>
              <line x1="0" y1="0" x2={si.rightDragSvgX} y2="0" stroke="#f43f5e" strokeWidth="2" />
              <text
                x={si.rightDragSvgX + 8}
                y="14"
                fill="#fb7185"
                fontSize="8"
                fontFamily="monospace"
              >
                Drag: {Math.round(rightInducedDrag)} N
              </text>
            </g>
          </g>
        </svg>

        {/* Telemetry Footer */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-2 text-center text-xs font-mono pt-3 border-t border-ink-800 text-ink-300 mt-2">
          <div>
            <span className="text-ink-500 block text-[10px]">ROLL CONTROL</span>
            <span className="text-amber-400 font-bold">
              Δ Lift = {(leftLiftN - rightLiftN).toFixed(0)} N
            </span>
          </div>
          <div>
            <span className="text-ink-500 block text-[10px]">YAW COUPLING</span>
            <span className={isCoupled ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
              {isCoupled ? "Cable Linked (Claim 18)" : "Independent (Unlinked)"}
            </span>
          </div>
          <div>
            <span className="text-ink-500 block text-[10px]">PITCH ATTITUDE</span>
            <span className="text-blue-400 font-bold">Canard = {canardAngle}°</span>
          </div>
        </div>
      </div>
    </div>
  );
}
