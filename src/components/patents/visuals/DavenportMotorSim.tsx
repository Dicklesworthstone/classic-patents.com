"use client";

import { Pause, Play, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { davenportPolarityReversed, stepDavenportMotor } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { SimulationHeader } from "./SimulationHeader";
import { usePatentAudio } from "./three/usePatentAudio";
import { useOffscreenGate } from "./useOffscreenGate";

const UI_SNAPSHOT_INTERVAL_MS = 80;

export function DavenportMotorSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-132-davenport-electric-motor");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const batteryVoltageV = params.batteryVoltage ?? 12;
  const loadTorqueNm = params.loadTorque ?? 0.8;
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [rotorAngleDeg, setRotorAngleDeg] = useState<number>(0);
  const animRef = useRef<number | null>(null);
  const rotorAngleRef = useRef(0);
  const rotorGroupRef = useRef<SVGGElement>(null);
  const motorRef = useRef<ReturnType<typeof stepDavenportMotor> | null>(null);
  const { rootRef, onscreenRef } = useOffscreenGate<HTMLDivElement>();

  const motor = stepDavenportMotor({ batteryVoltage: batteryVoltageV, loadTorque: loadTorqueNm });
  const actualRpm = motor.shaftRpm;
  const mechanicalWatts = motor.shaftPowerW;
  const currentAmps = motor.armatureCurrentA;
  const efficiencyPct = motor.efficiencyPct;

  useEffect(() => {
    motorRef.current = motor;
  }, [motor]);

  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = performance.now();
    let lastUiSnapshot = 0;

    const loop = (time: number) => {
      animRef.current = requestAnimationFrame(loop);
      if (!onscreenRef.current) {
        lastTime = time;
        return;
      }
      const dt = Math.max(0, Math.min(0.1, (time - lastTime) / 1000));
      lastTime = time;
      const liveMotor = motorRef.current;
      if (!liveMotor) return;

      const nextAngle =
        (rotorAngleRef.current + liveMotor.shaftOmegaDegPerS * dt) % liveMotor.displayWrapDeg;
      rotorAngleRef.current = nextAngle;
      rotorGroupRef.current?.setAttribute("transform", `translate(300, 170) rotate(${nextAngle})`);

      // The SVG pose is projected imperatively each frame. React only receives an
      // accessible/readout snapshot at 12.5 Hz, avoiding a full card re-render per frame.
      if (time - lastUiSnapshot >= UI_SNAPSHOT_INTERVAL_MS) {
        lastUiSnapshot = time;
        setRotorAngleDeg(nextAngle);
      }
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, onscreenRef]);

  const isPolarityReversed = davenportPolarityReversed(
    rotorAngleDeg,
    motor.commutatorPoleDeg,
    motor.commutatorFlipDeg,
  );

  return (
    <div
      ref={rootRef}
      className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors"
    >
      <SimulationHeader
        icon={<Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
        title="Thomas Davenport DC Electric Motor & Commutator (US 132)"
        description="Rotating armature electromagnet, circular stator, and split-ring commutator."
        playbackAction={{
          label: isPlaying ? "Pause Simulation" : "Play Simulation",
          icon: isPlaying ? (
            <Pause className="h-4 w-4 text-amber-600" />
          ) : (
            <Play className="h-4 w-4" />
          ),
          onPress: () => {
            setIsPlaying(!isPlaying);
            soundEngine.playSwitchClick();
          },
        }}
        audioAction={{
          label: isAudioMuted ? "Unmute Audio" : "Mute Audio",
          icon: isAudioMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4 text-amber-600" />
          ),
          onPress: () => {
            toggleSound();
            soundEngine.playSwitchClick();
          },
        }}
        onReset={() => {
          resetParams();
          rotorAngleRef.current = 0;
          rotorGroupRef.current?.setAttribute("transform", "translate(300, 170) rotate(0)");
          setRotorAngleDeg(0);
          soundEngine.playSwitchClick();
        }}
      />

      {/* SVG Animation Stage */}
      <div className="relative w-full aspect-[16/9] max-h-[360px] bg-parchment-100 dark:bg-ink-900 rounded-xl overflow-hidden border border-parchment-200 dark:border-ink-800 flex items-center justify-center">
        <svg
          viewBox="0 0 600 340"
          role="img"
          aria-label={`Davenport electric motor simulation: ${isPlaying ? "rotor spinning" : "stopped"}, rotor angle ${Math.round(rotorAngleDeg)} degrees`}
          className="w-full h-full"
        >
          {/* Stationary Circular Stator Ring Magnets */}
          <circle cx="300" cy="170" r="140" fill="none" stroke="#2B2B2B" strokeWidth="12" />

          {/* Left Stator Pole (North) */}
          <path
            d="M 160 110 A 140 140 0 0 0 160 230"
            fill="none"
            stroke="#C83E2D"
            strokeWidth="22"
            strokeLinecap="round"
          />
          <text
            x="175"
            y="175"
            fill="#FFFFFF"
            fontWeight="bold"
            fontSize="16"
            fontFamily="sans-serif"
          >
            N
          </text>

          {/* Right Stator Pole (South) */}
          <path
            d="M 440 110 A 140 140 0 0 1 440 230"
            fill="none"
            stroke="#2B5B84"
            strokeWidth="22"
            strokeLinecap="round"
          />
          <text
            x="415"
            y="175"
            fill="#FFFFFF"
            fontWeight="bold"
            fontSize="16"
            fontFamily="sans-serif"
          >
            S
          </text>

          {/* Magnetic Flux Lines in Airgap */}
          <g opacity="0.35" strokeDasharray="5 5">
            <line x1="200" y1="140" x2="400" y2="140" stroke="#888" strokeWidth="1.5" />
            <line x1="200" y1="170" x2="400" y2="170" stroke="#888" strokeWidth="2" />
            <line x1="200" y1="200" x2="400" y2="200" stroke="#888" strokeWidth="1.5" />
          </g>

          {/* Rotating Rotor Armature with 4 Electromagnet Coils */}
          <g ref={rotorGroupRef} transform={`translate(300, 170) rotate(${rotorAngleDeg})`}>
            {/* Iron Cross Core */}
            <rect
              x="-85"
              y="-12"
              width="170"
              height="24"
              rx="4"
              fill="#3D3D3D"
              stroke="#111"
              strokeWidth="2"
            />
            <rect
              x="-12"
              y="-85"
              width="24"
              height="170"
              rx="4"
              fill="#3D3D3D"
              stroke="#111"
              strokeWidth="2"
            />

            {/* Copper Wire Windings */}
            <g fill="#D4AF37" stroke="#8B5A2B" strokeWidth="1.5">
              <rect x="-75" y="-18" width="40" height="36" rx="3" />
              <rect x="35" y="-18" width="40" height="36" rx="3" />
              <rect x="-18" y="-75" width="36" height="40" rx="3" />
              <rect x="-18" y="35" width="36" height="40" rx="3" />
            </g>

            {/* Armature Magnetic Polarity Labels (Dynamic) */}
            <text
              x="-65"
              y="5"
              fill="#FFFFFF"
              fontWeight="bold"
              fontSize="12"
              fontFamily="sans-serif"
            >
              {isPolarityReversed ? "S" : "N"}
            </text>
            <text
              x="50"
              y="5"
              fill="#FFFFFF"
              fontWeight="bold"
              fontSize="12"
              fontFamily="sans-serif"
            >
              {isPolarityReversed ? "N" : "S"}
            </text>

            {/* Center Hub & Commutator Segments */}
            <circle cx="0" cy="0" r="22" fill="#C5A059" stroke="#5C4033" strokeWidth="2" />
            <line x1="-22" y1="0" x2="22" y2="0" stroke="#111" strokeWidth="3" />
          </g>

          {/* Stationary Copper Leaf Brushes */}
          <line
            x1="300"
            y1="135"
            x2="300"
            y2="148"
            stroke="#B87333"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1="300"
            y1="192"
            x2="300"
            y2="205"
            stroke="#B87333"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <text
            x="310"
            y="142"
            fill="#B87333"
            fontSize="10"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            + Brush
          </text>
          <text
            x="310"
            y="205"
            fill="#B87333"
            fontSize="10"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            - Brush
          </text>
        </svg>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Motor Speed
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {actualRpm} RPM · {motor.shaftOmegaDegPerS} °/s
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Armature Current
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            {currentAmps} A
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Shaft Power
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            {mechanicalWatts} W / {motor.electricalWatts} W
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Efficiency
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {efficiencyPct}%
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-parchment-200 dark:border-ink-800">
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Voltaic Battery Voltage</span>
            <span className="font-mono">{batteryVoltageV} V</span>
          </div>
          <input
            type="range"
            aria-label="Voltaic battery voltage in volts"
            min="4"
            max="24"
            step="1"
            value={batteryVoltageV}
            onChange={(e) => updateParam("batteryVoltage", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Mechanical Load Torque</span>
            <span className="font-mono">{loadTorqueNm.toFixed(1)} N·m</span>
          </div>
          <input
            type="range"
            aria-label="Mechanical load torque in newton meters"
            min="0.2"
            max="2.5"
            step="0.1"
            value={loadTorqueNm}
            onChange={(e) => updateParam("loadTorque", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </div>
      </div>
    </div>
  );
}
