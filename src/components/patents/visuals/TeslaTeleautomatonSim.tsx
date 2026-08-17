"use client";

import { RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useState } from "react";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { usePatentAudio } from "./three/usePatentAudio";

export function TeslaTeleautomatonSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-613809-tesla-teleautomaton");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const rudderAngleDeg = params.rudderAngle ?? 15;
  const propellerThrottlePct = params.propellerThrottlePct ?? 75;
  const pulseCount = params.pulseCount ?? 3;
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);

  // Radio & coherer kinematics
  const cohererSensitivityPct = 96;
  const rotarySteppingPosition = pulseCount % 8;
  const commandState =
    rotarySteppingPosition === 0
      ? "RUDDER NEUTRAL (AHEAD)"
      : rotarySteppingPosition === 1
        ? "RUDDER PORT 15°"
        : rotarySteppingPosition === 2
          ? "RUDDER PORT 30°"
          : rotarySteppingPosition === 3
            ? "RUDDER STARBOARD 15°"
            : rotarySteppingPosition === 4
              ? "RUDDER STARBOARD 30°"
              : rotarySteppingPosition === 5
                ? "LIGHTS ON"
                : rotarySteppingPosition === 6
                  ? "EXPLOSIVE ARM"
                  : "STOP MOTOR";

  const handleSendPulse = () => {
    setIsTransmitting(true);
    updateParam("pulseCount", (pulseCount + 1) % 20);
    setTimeout(() => setIsTransmitting(false), 400);
  };

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
            Tesla Teleautomaton & Radio Remote Control (US 613,809)
          </h3>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400">
            Interactive 2D Telecommunications Model — Wireless Hertzian Pulses, Rotating Coherer
            Detector, and Sequential Stepping Disc Logic
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleSendPulse}
            aria-label="Send RF Command Pulse"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-sans text-xs font-bold shadow transition-colors"
          >
            <Zap className="w-4 h-4" />
            <span>Send RF Pulse</span>
          </button>
          <button
            type="button"
            onClick={resetParams}
            aria-label="Reset Teleautomaton Logic"
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => toggleSound()}
            aria-label={isAudioMuted ? "Unmute Audio" : "Mute Audio"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
          >
            {isAudioMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-600" />
            )}
          </button>
        </div>
      </div>

      {/* SVG Animation Stage */}
      <div className="relative w-full aspect-[16/9] max-h-[360px] bg-parchment-100 dark:bg-ink-900 rounded-xl overflow-hidden border border-parchment-200 dark:border-ink-800 flex items-center justify-center">
        <svg viewBox="0 0 600 340" className="w-full h-full">
          {/* Water Lagoon Background */}
          <rect x="0" y="160" width="600" height="180" fill="#1A365D" opacity="0.15" />
          <path
            d="M 0 160 Q 300 155, 600 160"
            stroke="#3182CE"
            strokeWidth="1.5"
            fill="none"
            opacity="0.4"
          />

          {/* Submersible Torpedo Boat Hull */}
          <path
            d="M 120 180 L 140 150 L 460 150 L 500 180 L 460 210 L 140 210 Z"
            fill="#2D3748"
            stroke="#1A202C"
            strokeWidth="3"
          />

          {/* Vertical Aerial Antenna Rods & Mast */}
          <line x1="220" y1="150" x2="220" y2="40" stroke="#D4AF37" strokeWidth="3" />
          <line x1="380" y1="150" x2="380" y2="40" stroke="#D4AF37" strokeWidth="3" />
          <circle cx="220" cy="40" r="5" fill="#D4AF37" />
          <circle cx="380" cy="40" r="5" fill="#D4AF37" />

          {/* Hertzian RF Waves Radiating when transmitting */}
          {isTransmitting && (
            <g opacity="0.8">
              <path
                d="M 180 40 A 40 40 0 0 0 260 40"
                stroke="#ECC94B"
                strokeWidth="2.5"
                fill="none"
              />
              <path
                d="M 160 40 A 60 60 0 0 0 280 40"
                stroke="#ECC94B"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M 340 40 A 40 40 0 0 0 420 40"
                stroke="#ECC94B"
                strokeWidth="2.5"
                fill="none"
              />
              <path
                d="M 320 40 A 60 60 0 0 0 440 40"
                stroke="#ECC94B"
                strokeWidth="2"
                fill="none"
              />
            </g>
          )}

          {/* Rotating Coherer Cylinder (Center Interior) */}
          <g transform="translate(300, 180)">
            <circle cx="0" cy="0" r="18" fill="#B87333" stroke="#8B5A2B" strokeWidth="1.5" />
            <text
              x="-25"
              y="-24"
              fill="#B87333"
              fontSize="9"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Rotating Coherer
            </text>
          </g>

          {/* Rotary Stepping Disc & Contact Pawls */}
          <g transform="translate(360, 180)">
            <circle cx="0" cy="0" r="22" fill="#D4AF37" stroke="#744210" strokeWidth="2" />
            {Array.from({ length: 8 }).map((_, i) => (
              <circle
                key={`step-contact-${i * 45}`}
                cx={Math.cos((i * 45 * Math.PI) / 180) * 15}
                cy={Math.sin((i * 45 * Math.PI) / 180) * 15}
                r="3"
                fill={i === rotarySteppingPosition ? "#E53E3E" : "#1A202C"}
              />
            ))}
            <text
              x="-25"
              y="36"
              fill="#D4AF37"
              fontSize="9"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Stepping Disc
            </text>
          </g>

          {/* Stern Rudder and Screw Propeller */}
          <g transform="translate(110, 180)">
            {/* Rudder deflected */}
            <line
              x1="0"
              y1="0"
              x2="-25"
              y2={rudderAngleDeg > 0 ? 15 : -15}
              stroke="#E2E8F0"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Propeller */}
            <line x1="10" y1="-12" x2="10" y2="12" stroke="#B87333" strokeWidth="3" />
          </g>

          {/* Signal Indicator Lamps on Deck */}
          <circle
            cx="280"
            cy="142"
            r="6"
            fill={rotarySteppingPosition === 5 ? "#48BB78" : "#718096"}
            stroke="#1A202C"
            strokeWidth="1.5"
          />
          <circle
            cx="320"
            cy="142"
            r="6"
            fill={rotarySteppingPosition === 6 ? "#E53E3E" : "#718096"}
            stroke="#1A202C"
            strokeWidth="1.5"
          />

          {/* Status HUD Text */}
          <rect x="150" y="270" width="300" height="35" rx="6" fill="#1A202C" opacity="0.9" />
          <text
            x="300"
            y="292"
            fill="#ECC94B"
            fontWeight="bold"
            fontSize="12"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            COMMAND: {commandState}
          </text>
        </svg>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            RF Pulses Received
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {pulseCount} Pulses
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Disc Step
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            Position #{rotarySteppingPosition} / 8
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Coherer Sensitivity
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            {cohererSensitivityPct}%
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Logic Status
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {isTransmitting ? "Receiving Wave" : "Standby"}
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-parchment-200 dark:border-ink-800">
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Rudder Servo Deflection</span>
            <span className="font-mono">
              {rudderAngleDeg}° (
              {rudderAngleDeg > 0 ? "Starboard" : rudderAngleDeg < 0 ? "Port" : "Center"})
            </span>
          </div>
          <input
            type="range"
            min="-35"
            max="35"
            step="5"
            value={rudderAngleDeg}
            onChange={(e) => updateParam("rudderAngle", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Electric Motor Throttle</span>
            <span className="font-mono">{propellerThrottlePct}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={propellerThrottlePct}
            onChange={(e) => updateParam("propellerThrottlePct", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
