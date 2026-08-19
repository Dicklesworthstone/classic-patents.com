"use client";

import { Zap } from "lucide-react";
import { useEffect, useState } from "react";
import {
  stepTeslaMotorFig9,
  TESLA_FIELD_DISPLAY_SLOWDOWN,
  TESLA_FIELD_DISPLAY_TICK_MS,
  teslaBAt,
  teslaPhaseVectors,
  teslaPoleCurrent,
  teslaStatorPole,
} from "@/physics/teslaKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";

export function TeslaMotorSim() {
  const { params, updateParam } = usePatentPhysics("us-381968-tesla-motor");
  const phaseCount = (params.phaseCount as 2 | 3) ?? 2;
  const frequencyHz = params.frequency ?? 60;
  const isPlayingAudio = (params.acHum ?? 0) === 1;
  const [_activePedagogyStep, setActivePedagogyStep] = useState<number>(1);
  const [angle, setAngle] = useState<number>(0);

  const apparatus = stepTeslaMotorFig9(frequencyHz);

  // Animation Loop for Stator Field & Rotor Rotation
  useEffect(() => {
    const degPerTick = apparatus.fieldDisplayOmegaDegPerS * apparatus.fieldDisplayTickS;
    const interval = setInterval(() => {
      setAngle((prev) => (prev + degPerTick) % apparatus.displayWrapDeg);
    }, TESLA_FIELD_DISPLAY_TICK_MS);
    return () => clearInterval(interval);
  }, [apparatus.fieldDisplayOmegaDegPerS, apparatus.fieldDisplayTickS, apparatus.displayWrapDeg]);

  // Audio AC Hum feedback
  useEffect(() => {
    if (isPlayingAudio) {
      soundEngine.playTeslaMotorHum(frequencyHz, apparatus.diskRpm);
    } else {
      soundEngine.stopContinuousTone();
    }
    return () => {
      soundEngine.stopContinuousTone();
    };
  }, [isPlayingAudio, frequencyHz, apparatus.diskRpm]);

  const _applyPedagogyStep = (step: number) => {
    setActivePedagogyStep(step);
    if (step === 1) {
      // Step 1: Low frequency 2-phase demonstration
      updateParam("frequency", 30);
      updateParam("phaseCount", 2);
    } else if (step === 2) {
      // Step 2: Standard 60Hz 2-phase Polyphase Stator
      updateParam("frequency", 60);
      updateParam("phaseCount", 2);
    } else if (step === 3) {
      // Step 3: High efficiency 3-phase AC Motor
      updateParam("frequency", 60);
      updateParam("phaseCount", 3);
    }
  };

  const rad = (angle * Math.PI) / 180;
  const field = teslaBAt(rad, phaseCount);
  const coilCount = field.coilCount;
  const bVectorX = field.bxSvg;
  const bVectorY = field.bySvg;

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 shadow-patent space-y-6">
      {/* Simulation Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
            <h3 className="font-serif text-xl font-bold text-ink-900 dark:text-parchment-100">
              Tesla Polyphase AC Rotating Magnetic Field Motor (US 381,968)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-1">
            Fig. 9 routes two generator circuits through{" "}
            <strong>collector rings and brushes</strong>
            to matching motor-coil pairs; the motor itself needs no commutator.
          </p>
        </div>

        {/* Guided Learning Stepper */}
        <div className="flex flex-wrap items-center gap-1.5 bg-parchment-200 dark:bg-ink-900 p-1 rounded-xl border border-parchment-300 dark:border-ink-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => _applyPedagogyStep(1)}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              _activePedagogyStep === 1
                ? "bg-amber-600 text-white font-bold"
                : "text-ink-700 dark:text-ink-400 hover:text-ink-900"
            }`}
          >
            1. Fig. 9 phase sequence
          </button>
          <button
            type="button"
            onClick={() => _applyPedagogyStep(2)}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              _activePedagogyStep === 2
                ? "bg-amber-600 text-white font-bold"
                : "text-ink-700 dark:text-ink-400 hover:text-ink-900"
            }`}
          >
            2. Faster generator sequence
          </button>
          <button
            type="button"
            onClick={() => _applyPedagogyStep(3)}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              _activePedagogyStep === 3
                ? "bg-emerald-600 text-white font-bold"
                : "text-ink-700 dark:text-ink-400 hover:text-ink-900"
            }`}
          >
            3. Fig. 13 three-circuit comparison
          </button>
        </div>
      </div>

      {/* Visual Canvas and Stator Vector Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-ink-950 p-6 border border-parchment-200 dark:border-ink-800 relative min-h-[360px]">
          {/* Circular Blueprint Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 pointer-events-none" />

          {/* Stator & Rotor SVG Visualizer */}
          <svg viewBox="0 0 400 300" className="w-full max-w-md h-auto select-none relative z-10">
            <defs>
              <radialGradient id="teslaRotorMetal" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="80%" stopColor="#475569" />
                <stop offset="100%" stopColor="#1e293b" />
              </radialGradient>
            </defs>

            {/* Outer Stator Ring */}
            <circle
              cx={apparatus.statorCenterX}
              cy={apparatus.statorCenterY}
              r={apparatus.statorRingOuterSvgR}
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="4"
            />
            <circle
              cx={apparatus.statorCenterX}
              cy={apparatus.statorCenterY}
              r={apparatus.statorRingInnerSvgR}
              fill="none"
              stroke="#475569"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />

            {/* Stator poles: 4 coils at 90° (2-phase) or 6 coils at 60° (3-phase) */}
            {Array.from({ length: coilCount }, (_, i) => {
              const { current } = teslaPoleCurrent(i, phaseCount, rad);
              const pole = teslaStatorPole(i, coilCount);
              const labels =
                phaseCount === 2 ? ["A", "B", "A'", "B'"] : ["A", "B", "C", "A'", "B'", "C'"];
              return (
                <g key={i}>
                  <rect
                    x={pole.cx - apparatus.statorPoleSvgW / 2}
                    y={pole.cy - apparatus.statorPoleSvgH / 2}
                    width={apparatus.statorPoleSvgW}
                    height={apparatus.statorPoleSvgH}
                    rx="4"
                    transform={`rotate(${pole.rotateDeg} ${pole.cx} ${pole.cy})`}
                    fill={current >= 0 ? "#f59e0b" : "#3b82f6"}
                    stroke="#fff"
                    strokeWidth="1"
                  />
                  <text
                    x={pole.cx}
                    y={pole.cy + 4}
                    fill="#fff"
                    fontSize="9"
                    textAnchor="middle"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {labels[i]}
                  </text>
                </g>
              );
            })}

            {/* Phase contribution vectors (the currents that sum to the rotating field) */}
            {teslaPhaseVectors(rad, phaseCount).map((comp, i) => (
              <line
                key={i}
                x1={apparatus.statorCenterX}
                y1={apparatus.statorCenterY}
                x2={apparatus.statorCenterX + comp.x}
                y2={apparatus.statorCenterY + comp.y}
                stroke={comp.color}
                strokeWidth="2"
                strokeLinecap="round"
                opacity={
                  phaseCount === 2
                    ? apparatus.twoPhaseVectorOpacity
                    : apparatus.threePhaseVectorOpacity
                }
              />
            ))}

            {/* Resultant rotating B-field (constant magnitude for a balanced polyphase set) */}
            <line
              x1={apparatus.statorCenterX}
              y1={apparatus.statorCenterY}
              x2={apparatus.statorCenterX + bVectorX}
              y2={apparatus.statorCenterY + bVectorY}
              stroke="#fbbf24"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle
              cx={apparatus.statorCenterX + bVectorX}
              cy={apparatus.statorCenterY + bVectorY}
              r="5"
              fill="#f59e0b"
            />

            {/* Fig. 9 magnetic disk D inside the annular ring R. */}
            <g
              transform={`translate(${apparatus.statorCenterX}, ${apparatus.statorCenterY}) rotate(${angle})`}
            >
              <circle
                cx="0"
                cy="0"
                r="50"
                fill="url(#teslaRotorMetal)"
                stroke="#cbd5e1"
                strokeWidth="2"
              />
              <circle cx="0" cy="0" r="8" fill="#0f172a" stroke="#94a3b8" strokeWidth="2" />
              <path d="M-42 -16h84v32H-42z" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="0" y="4" fill="#f8fafc" fontSize="13" textAnchor="middle" fontWeight="bold">
                D
              </text>
            </g>
          </svg>

          {/* Real-Time Telemetry Bar */}
          <div className="w-full grid grid-cols-3 gap-2 text-center text-xs font-mono pt-3 border-t border-ink-800 text-ink-300">
            <div>
              <span className="text-ink-500 block text-[10px]">GENERATOR REVOLUTION</span>
              <span className="text-amber-400 font-bold">
                {apparatus.generatorRpm} RPM · ω/{TESLA_FIELD_DISPLAY_SLOWDOWN}{" "}
                {apparatus.fieldDisplayOmegaDegPerS.toFixed(0)} °/s
              </span>
            </div>
            <div>
              <span className="text-ink-500 block text-[10px]">POLE SHIFT AROUND R</span>
              <span className="text-emerald-400 font-bold">{apparatus.poleShiftRpm} RPM</span>
            </div>
            <div>
              <span className="text-ink-500 block text-[10px]">FIG. 9 DISK D</span>
              <span className="text-blue-400 font-bold">follows synchronously</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
