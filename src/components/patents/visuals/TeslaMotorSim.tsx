"use client";

import { RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import {
  stepTeslaMotorFig9,
  TESLA_FIELD_DISPLAY_SLOWDOWN,
  teslaBAt,
  teslaMotorPhaseHz,
  teslaPhaseVectors,
  teslaPoleCurrent,
  teslaStatorPole,
} from "@/physics/teslaKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";
import { useOffscreenGate } from "./useOffscreenGate";

const UI_SNAPSHOT_INTERVAL_MS = 80;

export function TeslaMotorSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-381968-tesla-motor");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  // The visitor-facing instrument is the source Fig. 9 two-circuit path.
  // Fig. 13 is a separate source arrangement and is not synthesized here.
  const sourceCircuitCount = 2 as const;
  const frequencyHz = teslaMotorPhaseHz(params);
  const isPlayingAudio = !isAudioMuted && (params.acHum ?? 1) === 1;
  const [_activePedagogyStep, setActivePedagogyStep] = useState<number>(1);
  const [angle, setAngle] = useState<number>(0);
  const angleRef = useRef(0);
  const apparatusRef = useRef<ReturnType<typeof stepTeslaMotorFig9> | null>(null);
  const diskRef = useRef<SVGGElement>(null);
  const { rootRef, onscreenRef } = useOffscreenGate<HTMLDivElement>();

  const apparatus = stepTeslaMotorFig9(frequencyHz);

  useEffect(() => {
    apparatusRef.current = apparatus;
  }, [apparatus]);

  // Animation loop integrates the kernel's display angular velocity from the
  // browser-provided elapsed timestamp. The interval is not a physics clock.
  useEffect(() => {
    let frameId = 0;
    let lastTimestampMs: number | undefined;
    let lastUiSnapshot = 0;
    const animate = (timestampMs: number) => {
      frameId = requestAnimationFrame(animate);
      if (!onscreenRef.current) {
        lastTimestampMs = timestampMs;
        return;
      }
      const liveApparatus = apparatusRef.current;
      if (!liveApparatus) return;
      if (lastTimestampMs !== undefined) {
        const elapsedS = Math.min((timestampMs - lastTimestampMs) / 1000, 0.1);
        angleRef.current =
          (angleRef.current + liveApparatus.fieldDisplayOmegaDegPerS * elapsedS) %
          liveApparatus.displayWrapDeg;
        diskRef.current?.setAttribute(
          "transform",
          `translate(${liveApparatus.statorCenterX}, ${liveApparatus.statorCenterY}) rotate(${angleRef.current})`,
        );

        if (timestampMs - lastUiSnapshot >= UI_SNAPSHOT_INTERVAL_MS) {
          lastUiSnapshot = timestampMs;
          setAngle(angleRef.current);
        }
      }
      lastTimestampMs = timestampMs;
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [onscreenRef]);

  // Audio AC Hum feedback
  useEffect(() => {
    if (isPlayingAudio) {
      soundEngine.playTeslaGeneratorTone(frequencyHz, apparatus.generatorRpm);
    } else {
      soundEngine.stopContinuousTone();
    }
    return () => {
      soundEngine.stopContinuousTone();
    };
  }, [isPlayingAudio, frequencyHz, apparatus.generatorRpm]);

  const _applyPedagogyStep = (step: number) => {
    setActivePedagogyStep(step);
    soundEngine.playSwitchClick();
    if (step === 1) {
      // Step 1: Fig. 9's two-circuit arrangement
      updateParam("frequency", 30);
    } else if (step === 2) {
      // Step 2: Faster view of Fig. 9's two-circuit arrangement
      updateParam("frequency", 60);
    }
  };

  const rad = (angle * Math.PI) / 180;
  const field = teslaBAt(rad, sourceCircuitCount);
  const coilCount = field.coilCount;
  const bVectorX = field.bxSvg;
  const bVectorY = field.bySvg;

  return (
    <div
      ref={rootRef}
      className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-patent space-y-6"
    >
      {/* Simulation Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
            <h3 className="font-serif text-lg sm:text-xl font-bold text-ink-900 dark:text-parchment-100">
              Nikola Tesla Progressive Alternating-Current Motor (US 381,968)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-1">
            Independently connected generator circuits shift the magnetic attraction around ring R;
            disk D follows the moving region in the Fig. 9 teaching model.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end lg:self-auto">
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
              1. Fig. 9 · 30 Hz
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
              2. Fig. 9 · 60 Hz
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
              angleRef.current = 0;
              diskRef.current?.setAttribute(
                "transform",
                `translate(${apparatus.statorCenterX}, ${apparatus.statorCenterY}) rotate(0)`,
              );
              setAngle(0);
              setActivePedagogyStep(1);
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

      {/* Visual Canvas and Stator Vector Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-ink-950 p-6 border border-parchment-200 dark:border-ink-800 relative min-h-[360px]">
          {/* Circular Blueprint Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 pointer-events-none" />

          {/* Stator & Rotor SVG Visualizer */}
          <svg
            viewBox="0 0 400 300"
            role="img"
            aria-label={`Rotating magnetic field motor simulation: ${frequencyHz} hertz field spinning the rotor to ${Math.round(angle)} degrees with ${coilCount} stator coils`}
            className="w-full max-w-md h-auto select-none relative z-10"
          >
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

            {/* Fig. 9 stator poles: four coils at 90° */}
            {Array.from({ length: coilCount }, (_, i) => {
              const { current } = teslaPoleCurrent(i, sourceCircuitCount, rad);
              const pole = teslaStatorPole(i, coilCount);
              const labels = ["C", "C′", "C", "C′"];
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

            {/* Independent-circuit contribution vectors shown in the source arrangement */}
            {teslaPhaseVectors(rad, sourceCircuitCount).map((comp, i) => (
              <line
                key={i}
                x1={apparatus.statorCenterX}
                y1={apparatus.statorCenterY}
                x2={apparatus.statorCenterX + comp.x}
                y2={apparatus.statorCenterY + comp.y}
                stroke={comp.color}
                strokeWidth="2"
                strokeLinecap="round"
                opacity={apparatus.twoPhaseVectorOpacity}
              />
            ))}

            {/* Resultant magnetic-attraction direction from the two circuits */}
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
              ref={diskRef}
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
              <span className="text-ink-500 block text-[10px]">GENERATOR EXCITATION</span>
              <span className="text-amber-400 font-bold">
                {apparatus.phaseCycleHz} Hz · display /{TESLA_FIELD_DISPLAY_SLOWDOWN}{" "}
                {apparatus.fieldDisplayOmegaDegPerS.toFixed(0)} °/s
              </span>
            </div>
            <div>
              <span className="text-ink-500 block text-[10px]">PROGRESSIVE POLE SHIFT</span>
              <span className="text-emerald-400 font-bold">
                {apparatus.fieldDisplayOmegaDegPerS.toFixed(0)} °/s display
              </span>
            </div>
            <div>
              <span className="text-ink-500 block text-[10px]">FIG. 9 DISK D</span>
              <span className="text-blue-400 font-bold">follows synchronously</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sensitivity Controls */}
      <div className="pt-2 border-t border-parchment-200 dark:border-ink-800">
        <SensitivitySlider
          id="tesla-motor-frequency-2d"
          patentId="us-381968-tesla-motor"
          paramKey="frequency"
          label="Generator Phase-Cycle Rate"
          value={frequencyHz}
          min={20}
          max={120}
          step={1}
          unit="Hz"
          onChange={(val) => updateParam("frequency", val)}
          allParams={params}
        />
      </div>
    </div>
  );
}
