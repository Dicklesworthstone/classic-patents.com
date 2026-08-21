"use client";

import {
  AlertTriangle,
  Bell,
  Gauge,
  HelpCircle,
  Radio,
  RotateCcw,
  RotateCw,
  Sliders,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FrankenSimEngine } from "@/physics/engine";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";

export function WestinghouseAirBrakeSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-124404-westinghouse-air-brake");
  const { isAudioMuted, toggleSound } = usePatentAudio();

  const trainPipePressurePsi = params.trainPipePressure ?? 0;
  const reservoirPipePressurePsi = params.reservoirPipePressure ?? 90;
  const selectingCockPos = params.selectingCockPosition ?? 0;
  const accidentTripMode = params.accidentTrip ?? 0;
  const signalPulsePsi = params.signalPulsePressure ?? 0;

  const tripModes = ["running", "tripped_derailment", "tripped_parting"] as const;
  const tripCockState = tripModes[accidentTripMode] ?? "running";
  const selectingCockState = selectingCockPos === 1 ? "reversed" : "normal";

  const [activeClaimProbe, setActiveClaimProbe] = useState<number | null>(null);
  const [pulseAnim, setPulseAnim] = useState<number>(0);

  const wh = FrankenSimEngine.stepWestinghouseAirBrake({
    trainPipePressurePsi,
    reservoirPipePressurePsi,
    selectingCockState,
    tripCockState,
    signalPulsePressurePsi: signalPulsePsi,
  });

  const cylPressurePsi = wh.brakeCylinderPressurePsi;
  const isTripped = wh.isTripped;
  const isBraking = cylPressurePsi > 5;
  const isEmergency = wh.valveState === "EMERGENCY";

  // Animation pulse
  const animRef = useRef<number | null>(null);
  useEffect(() => {
    let frame = 0;
    const loop = () => {
      frame += 0.05;
      setPulseAnim(frame);
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const handleToggleSelectingCock = () => {
    const nextPos = selectingCockPos === 0 ? 1 : 0;
    updateParam("selectingCockPosition", nextPos);
    if (!isAudioMuted) soundEngine.playTone(320, 0.15, "triangle", 0.3);
  };

  const handleTripStem = () => {
    const next = accidentTripMode === 1 ? 0 : 1;
    updateParam("accidentTrip", next);
    if (!isAudioMuted) {
      if (next === 1) {
        soundEngine.playTone(140, 0.5, "sawtooth", 0.5);
      } else {
        soundEngine.playTone(440, 0.1, "sine", 0.2);
      }
    }
  };

  const handleTripCord = () => {
    const next = accidentTripMode === 2 ? 0 : 2;
    updateParam("accidentTrip", next);
    if (!isAudioMuted) {
      if (next === 2) {
        soundEngine.playTone(180, 0.4, "sawtooth", 0.45);
      } else {
        soundEngine.playTone(440, 0.1, "sine", 0.2);
      }
    }
  };

  const handleSignalStep = (step: number) => {
    const psi = (step - 1) * 0.5;
    updateParam("signalPulsePressure", psi);
    if (!isAudioMuted && step > 1) {
      soundEngine.playTone(580 + step * 80, 0.3, "sine", 0.35);
    }
  };

  const resetRunning = () => {
    resetParams();
    if (!isAudioMuted) soundEngine.playTone(520, 0.15, "sine", 0.2);
  };

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            <h3 className="font-serif text-lg sm:text-xl font-bold text-ink-900 dark:text-parchment-100">
              Westinghouse Double-Pipe Steam-Power Air Brake (US 124,404)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-1 max-w-2xl">
            Dual-pipe pneumatic network: selecting cock to swap pipe roles, tripping cock for
            emergency braking, and pneumatic signal loop.
          </p>
        </div>

        {/* Action Presets */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => {
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
            title={isAudioMuted ? "Unmute audio" : "Mute audio"}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={resetRunning}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Claim Probe Selector Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-parchment-200/70 dark:bg-ink-900 rounded-xl text-xs font-sans">
        <span className="text-ink-600 dark:text-ink-400 font-semibold px-2">Inspect Claims:</span>
        {[
          { num: 1, label: "Claim 1: Receiver D & Cylinder C" },
          { num: 2, label: "Claim 2: Dual Pipes B/B¹ & Branches" },
          { num: 3, label: "Claim 3: Selecting Cock d¹" },
          { num: 4, label: "Claim 4: Tripping Cock e (Accident)" },
          { num: 5, label: "Claim 5: Pneumatic Signalling" },
        ].map((claim) => (
          <button
            key={claim.num}
            type="button"
            onClick={() => setActiveClaimProbe(activeClaimProbe === claim.num ? null : claim.num)}
            className={`px-2.5 py-1 rounded-lg transition-all font-mono text-[11px] ${
              activeClaimProbe === claim.num
                ? "bg-amber-600 text-white font-bold shadow-xs"
                : "text-ink-700 dark:text-parchment-300 hover:bg-parchment-300/60 dark:hover:bg-ink-800"
            }`}
          >
            {claim.label}
          </button>
        ))}
      </div>

      {/* Visual Canvas & Pneumatic Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Schematic */}
        <div className="lg:col-span-8 relative bg-[#090d16] rounded-2xl border border-parchment-300 dark:border-ink-800 p-4 sm:p-6 flex flex-col items-center justify-center min-h-[440px] overflow-hidden select-none">
          {/* Blueprint Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-25 pointer-events-none" />

          {/* Status Overlay HUD */}
          <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-2 text-[11px] font-mono">
            <div className="px-2.5 py-1 bg-ink-900/90 border border-ink-700 rounded-lg text-ink-300 flex items-center gap-1.5">
              <span>Cock d¹:</span>
              <span className="text-amber-400 font-bold">
                {wh.isSelectingCockReversed ? "Position 2 (Swapped)" : "Position 1 (Normal)"}
              </span>
            </div>
            <div className="px-2.5 py-1 bg-ink-900/90 border border-ink-700 rounded-lg text-ink-300 flex items-center gap-1.5">
              <span>Braking:</span>
              <span
                className={`font-bold ${
                  isEmergency ? "text-rose-400" : isBraking ? "text-amber-400" : "text-emerald-400"
                }`}
              >
                {isEmergency
                  ? "EMERGENCY AUTO-APPLY"
                  : isBraking
                    ? "SERVICE BRAKING"
                    : "RELEASED / CHARGING"}
              </span>
            </div>
            {wh.alarmWhistleActive && (
              <div className="px-2.5 py-1 bg-amber-500/20 border border-amber-500 rounded-lg text-amber-300 font-bold flex items-center gap-1 animate-pulse">
                <Bell className="w-3.5 h-3.5" />
                <span>WHISTLE h BLASTING</span>
              </div>
            )}
          </div>

          <svg viewBox="0 0 760 480" className="w-full max-w-2xl h-auto relative z-10">
            <defs>
              {/* Radial gradient for air receiver D */}
              <linearGradient id="receiverGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="50%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#172554" />
              </linearGradient>
              {/* Radial gradient for brake cylinder C */}
              <linearGradient id="cylinderGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#374151" />
                <stop offset="50%" stopColor="#4b5563" />
                <stop offset="100%" stopColor="#1f2937" />
              </linearGradient>
            </defs>

            {/* Car Underframe Boundary (Fig. 1 Wood/Steel Chassis) */}
            <rect
              x="30"
              y="60"
              width="700"
              height="360"
              rx="12"
              fill="none"
              stroke="#334155"
              strokeWidth="3"
              strokeDasharray="8,6"
            />
            <text
              x="50"
              y="85"
              fill="#64748b"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
            >
              RAILCAR UNDERFRAME (US 124,404 FIG. 1)
            </text>

            {/* Wheelsets (Front and Rear Trucks) */}
            <g transform="translate(60, 200)">
              <rect
                x="0"
                y="-30"
                width="30"
                height="80"
                rx="4"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="2"
              />
              <rect
                x="0"
                y="190"
                width="30"
                height="80"
                rx="4"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="2"
              />
              <line x1="15" y1="50" x2="15" y2="190" stroke="#475569" strokeWidth="4" />
            </g>
            <g transform="translate(670, 200)">
              <rect
                x="0"
                y="-30"
                width="30"
                height="80"
                rx="4"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="2"
              />
              <rect
                x="0"
                y="190"
                width="30"
                height="80"
                rx="4"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="2"
              />
              <line x1="15" y1="50" x2="15" y2="190" stroke="#475569" strokeWidth="4" />
            </g>

            {/* 1. Continuous Paired Through-Pipes B and B¹ (Claim 2) */}
            {/* Pipe B (Operating Pipe) */}
            <g className={activeClaimProbe === 2 ? "opacity-100" : "opacity-90"}>
              <line
                x1="10"
                y1="140"
                x2="750"
                y2="140"
                stroke={wh.operatingPipePressurePsi > 20 ? "#ef4444" : "#3b82f6"}
                strokeWidth="8"
                strokeLinecap="round"
              />
              <line
                x1="10"
                y1="140"
                x2="750"
                y2="140"
                stroke="#0f172a"
                strokeWidth="2"
                strokeDasharray={`${6 + Math.sin(pulseAnim) * 2},4`}
              />
              <text
                x="80"
                y="132"
                fill="#93c5fd"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                PIPE B (OPERATING / BRAKE) — {wh.operatingPipePressurePsi} PSI
              </text>
            </g>

            {/* Pipe B¹ (Reservoir Pipe) */}
            <g className={activeClaimProbe === 2 ? "opacity-100" : "opacity-90"}>
              <line
                x1="10"
                y1="170"
                x2="750"
                y2="170"
                stroke="#059669"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <line
                x1="10"
                y1="170"
                x2="750"
                y2="170"
                stroke="#0f172a"
                strokeWidth="2"
                strokeDasharray="6,4"
              />
              <text
                x="80"
                y="188"
                fill="#6ee7b7"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                PIPE B¹ (RESERVOIR CHARGE) — {wh.reservoirPipePressurePsi} PSI
              </text>
            </g>

            {/* 2. Central Junction Case d & Selecting Cock d¹ (Claim 3) */}
            <g
              transform="translate(380, 155)"
              className={`transition-transform ${activeClaimProbe === 3 ? "scale-110" : ""}`}
            >
              {/* Highlight halo when Claim 3 is active */}
              {activeClaimProbe === 3 && (
                <circle
                  cx="0"
                  cy="0"
                  r="48"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeDasharray="4,4"
                  className="animate-spin"
                />
              )}
              <rect
                x="-35"
                y="-35"
                width="70"
                height="70"
                rx="10"
                fill="#1e293b"
                stroke="#d97706"
                strokeWidth="3"
              />
              <circle cx="0" cy="0" r="24" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
              {/* Selecting Cock d¹ Rotor showing ports a, a¹ */}
              <g transform={`rotate(${wh.cockD1AngleDeg})`}>
                <path
                  d="M -14 -8 Q 0 -18 14 -8"
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M -14 8 Q 0 18 14 8"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <line x1="-18" y1="0" x2="18" y2="0" stroke="#f59e0b" strokeWidth="3" />
              </g>
              <text
                x="0"
                y="48"
                fill="#fcd34d"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="middle"
                fontWeight="bold"
              >
                COCK d¹ (CASE d)
              </text>
              <text
                x="0"
                y="60"
                fill="#94a3b8"
                fontSize="8"
                fontFamily="monospace"
                textAnchor="middle"
              >
                [Click to Rotate 90°]
              </text>
            </g>

            {/* Branch pipe b (to Cylinder C) and branch pipe b¹ (to Receiver D) */}
            {/* Branch pipe b */}
            <path
              d="M 380 120 L 380 90 L 480 90 L 480 250"
              fill="none"
              stroke={cylPressurePsi > 10 ? "#ef4444" : "#64748b"}
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <text x="410" y="82" fill="#94a3b8" fontSize="9" fontFamily="monospace">
              BRANCH b → CYLINDER C
            </text>

            {/* Branch pipe b¹ */}
            <path
              d="M 380 190 L 380 220 L 260 220 L 260 250"
              fill="none"
              stroke="#059669"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <text x="210" y="214" fill="#6ee7b7" fontSize="9" fontFamily="monospace">
              BRANCH b¹ → RECEIVER D
            </text>

            {/* 3. Auxiliary Stored Air-Receiver D (Claim 1) */}
            <g
              transform="translate(180, 260)"
              className={activeClaimProbe === 1 ? "opacity-100 scale-105" : "opacity-95"}
            >
              {activeClaimProbe === 1 && (
                <rect
                  x="-10"
                  y="-10"
                  width="160"
                  height="90"
                  rx="14"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  strokeDasharray="4,4"
                />
              )}
              <rect
                x="0"
                y="0"
                width="140"
                height="70"
                rx="10"
                fill="url(#receiverGrad)"
                stroke="#60a5fa"
                strokeWidth="2.5"
              />
              <line x1="20" y1="0" x2="20" y2="70" stroke="#1d4ed8" strokeWidth="2" />
              <line x1="120" y1="0" x2="120" y2="70" stroke="#1d4ed8" strokeWidth="2" />
              <text
                x="70"
                y="32"
                fill="#ffffff"
                fontSize="11"
                fontFamily="serif"
                fontWeight="bold"
                textAnchor="middle"
              >
                AIR-RECEIVER D
              </text>
              <text
                x="70"
                y="48"
                fill="#93c5fd"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {wh.receiverPressurePsi} PSI STORED
              </text>
            </g>

            {/* 4. Brake Cylinder C & Rigging (Claim 1) */}
            <g
              transform="translate(420, 260)"
              className={activeClaimProbe === 1 ? "opacity-100 scale-105" : "opacity-95"}
            >
              {activeClaimProbe === 1 && (
                <rect
                  x="-10"
                  y="-10"
                  width="220"
                  height="90"
                  rx="14"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  strokeDasharray="4,4"
                />
              )}
              <rect
                x="0"
                y="0"
                width="120"
                height="60"
                rx="8"
                fill="url(#cylinderGrad)"
                stroke="#94a3b8"
                strokeWidth="2.5"
              />
              {/* Internal Piston and Push-Rod */}
              <rect
                x={20 + wh.clampRatio * 45}
                y="6"
                width="14"
                height="48"
                rx="2"
                fill="#f59e0b"
                stroke="#b45309"
                strokeWidth="1.5"
              />
              {/* Push-rod extending to foundation levers */}
              <line
                x1={34 + wh.clampRatio * 45}
                y1="30"
                x2={120 + wh.clampRatio * 50}
                y2="30"
                stroke="#cbd5e1"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <text
                x="60"
                y="28"
                fill="#ffffff"
                fontSize="10"
                fontFamily="serif"
                fontWeight="bold"
                textAnchor="middle"
              >
                CYLINDER C
              </text>
              <text
                x="60"
                y="44"
                fill="#fca5a5"
                fontSize="9"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {cylPressurePsi} PSI
              </text>
            </g>

            {/* Brake Shoes & Levers Clamping Wheels */}
            <g transform="translate(590, 290)">
              <line x1="0" y1="0" x2="40" y2="0" stroke="#f59e0b" strokeWidth="4" />
              <path
                d={`M ${50 - wh.clampRatio * 12} -20 Q ${55 - wh.clampRatio * 12} 0 ${50 - wh.clampRatio * 12} 20`}
                fill="none"
                stroke="#ef4444"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {isBraking && (
                <text
                  x="30"
                  y="-26"
                  fill="#f87171"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  CLAMPING: {wh.shoeClampingForceKn} kN
                </text>
              )}
            </g>

            {/* 5. Automatic Accident Tripping Cock e (Case e¹, Stem i¹, Cord y) (Claim 4) */}
            <g
              transform="translate(100, 360)"
              className={`transition-transform ${activeClaimProbe === 4 ? "scale-110" : ""}`}
            >
              {activeClaimProbe === 4 && (
                <circle
                  cx="0"
                  cy="0"
                  r="46"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  strokeDasharray="4,4"
                  className="animate-spin"
                />
              )}
              {/* Cock Case e¹ */}
              <rect
                x="-30"
                y="-30"
                width="60"
                height="60"
                rx="8"
                fill="#1e293b"
                stroke="#e11d48"
                strokeWidth="2.5"
              />
              <circle cx="0" cy="0" r="18" fill="#0f172a" stroke="#fb7185" strokeWidth="2" />
              {/* Cock e rotating plug */}
              <g transform={`rotate(${wh.cockEAngleDeg})`}>
                <line
                  x1="-12"
                  y1="0"
                  x2="12"
                  y2="0"
                  stroke="#f43f5e"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="-12"
                  stroke="#f43f5e"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </g>

              {/* Tripping Stem i¹ & Head i */}
              <g transform={`translate(0, ${wh.isDerailmentTripped ? 18 : 0})`}>
                <line
                  x1="0"
                  y1="30"
                  x2="0"
                  y2="65"
                  stroke="#cbd5e1"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="0" cy="65" r="8" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
                <text x="14" y="62" fill="#cbd5e1" fontSize="9" fontFamily="monospace">
                  STEM i¹ (TRIP HEAD i)
                </text>
              </g>

              {/* Separation Cord / Chain y to coupling */}
              <path
                d="M -30 0 C -60 -10 -90 -20 -110 -20"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2.5"
                strokeDasharray="4,2"
              />
              <text x="-95" y="-28" fill="#fbbf24" fontSize="8" fontFamily="monospace">
                CORD y (COUPLING)
              </text>

              <text
                x="0"
                y="-38"
                fill="#fb7185"
                fontSize="9"
                fontFamily="monospace"
                textAnchor="middle"
                fontWeight="bold"
              >
                TRIP COCK e (CASE e¹)
              </text>
            </g>

            {/* Tripping pipe connection from Reservoir D to Cylinder C */}
            {isTripped && (
              <path
                d="M 130 360 L 260 360 L 260 330 L 420 330 L 420 300"
                fill="none"
                stroke="#e11d48"
                strokeWidth="4"
                strokeDasharray="6,4"
                className="animate-pulse"
              />
            )}

            {/* 6. Pneumatic Signalling Loop n, n¹, Whistle h, Gauge g² (Claim 5) */}
            <g
              transform="translate(620, 90)"
              className={activeClaimProbe === 5 ? "opacity-100 scale-105" : "opacity-95"}
            >
              {activeClaimProbe === 5 && (
                <rect
                  x="-20"
                  y="-20"
                  width="130"
                  height="90"
                  rx="10"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />
              )}
              {/* Dial Gauge g² */}
              <circle cx="20" cy="20" r="24" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
              {/* Dial marks 1, 2, 3, 4, 5 */}
              {[1, 2, 3, 4, 5].map((num, i) => {
                const angle = -120 + i * 60;
                const rad = (angle * Math.PI) / 180;
                return (
                  <text
                    key={num}
                    x={20 + 16 * Math.cos(rad)}
                    y={23 + 16 * Math.sin(rad)}
                    fill={num === wh.signalIndexStep ? "#f59e0b" : "#94a3b8"}
                    fontSize="7"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {num}
                  </text>
                );
              })}
              {/* Gauge Needle */}
              <line
                x1="20"
                y1="20"
                x2={20 + 16 * Math.cos(((-120 + (wh.signalIndexStep - 1) * 60) * Math.PI) / 180)}
                y2={20 + 16 * Math.sin(((-120 + (wh.signalIndexStep - 1) * 60) * Math.PI) / 180)}
                stroke="#f59e0b"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Whistle h */}
              <path
                d="M 60 10 L 75 10 L 75 30 L 60 25 Z"
                fill="#eab308"
                stroke="#ca8a04"
                strokeWidth="1.5"
              />
              {wh.alarmWhistleActive && (
                <g transform="translate(80, 10)">
                  <path
                    d="M 0 0 Q 15 -10 25 -5 Q 15 5 0 0"
                    fill="#fef08a"
                    opacity="0.8"
                    className="animate-ping"
                  />
                </g>
              )}

              <text
                x="45"
                y="56"
                fill="#38bdf8"
                fontSize="8"
                fontFamily="monospace"
                textAnchor="middle"
                fontWeight="bold"
              >
                SIGNAL GAUGE g² / WHISTLE h
              </text>
            </g>
          </svg>
        </div>

        {/* Interactive Controls & Live Telemetry Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          {/* Controls Panel */}
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/70 dark:bg-ink-900/60 p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-sm text-ink-900 dark:text-parchment-100 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Pneumatic Actuators</span>
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-bold">
                US 124,404
              </span>
            </div>

            {/* Operating Pipe B Pressure Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Locomotive Brake Valve (Pipe B)
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {trainPipePressurePsi} PSI
                </span>
              </div>
              <input
                type="range"
                aria-label="Locomotive Brake Valve (Pipe B)"
                min="0"
                max="80"
                step="5"
                value={trainPipePressurePsi}
                onChange={(e) => updateParam("trainPipePressure", Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Selecting Cock d¹ Role Reversal Button (Claim 3) */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-mono font-semibold text-ink-800 dark:text-parchment-200 block">
                Selecting Cock d¹ (Case d)
              </span>
              <button
                type="button"
                onClick={handleToggleSelectingCock}
                className={`w-full py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 border transition-all ${
                  wh.isSelectingCockReversed
                    ? "bg-amber-600 text-white border-amber-700 shadow-sm"
                    : "bg-white/80 dark:bg-ink-900 border-parchment-300 dark:border-ink-700 text-ink-800 dark:text-parchment-200 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                <RotateCw
                  className={`w-3.5 h-3.5 ${wh.isSelectingCockReversed ? "rotate-90" : ""}`}
                />
                <span>
                  {wh.isSelectingCockReversed
                    ? "Position 2 (B¹ → Brake, B → Charge)"
                    : "Position 1 (B → Brake, B¹ → Charge)"}
                </span>
              </button>
            </div>

            {/* Automatic Accident Tripping Triggers (Claim 4) */}
            <div className="space-y-2 pt-2 border-t border-parchment-200 dark:border-ink-800">
              <span className="text-xs font-mono font-semibold text-ink-800 dark:text-parchment-200 block">
                Accident Tripping Cocks e (Claim 4)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleTripStem}
                  className={`py-2 px-2.5 rounded-xl text-[11px] font-mono font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    wh.isDerailmentTripped
                      ? "bg-rose-600 text-white border-rose-700 animate-pulse shadow-md"
                      : "bg-white/80 dark:bg-ink-900 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:text-rose-600"
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Trip Stem $i^1$</span>
                </button>
                <button
                  type="button"
                  onClick={handleTripCord}
                  className={`py-2 px-2.5 rounded-xl text-[11px] font-mono font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    wh.isUncouplingTripped
                      ? "bg-rose-600 text-white border-rose-700 animate-pulse shadow-md"
                      : "bg-white/80 dark:bg-ink-900 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:text-rose-600"
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Pull Cord y</span>
                </button>
              </div>
            </div>

            {/* Signalling Dial (Claim 5 & Fig. 4) */}
            <div className="space-y-2 pt-2 border-t border-parchment-200 dark:border-ink-800">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200 flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>Signal Code (Fig. 4 Dial g²)</span>
                </span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                  Step {wh.signalIndexStep}/5
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {[1, 2, 3, 4, 5].map((step) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => handleSignalStep(step)}
                    className={`py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                      wh.signalIndexStep === step
                        ? "bg-cyan-600 text-white border-cyan-700 shadow-xs"
                        : "bg-white/80 dark:bg-ink-900 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                    }`}
                  >
                    {step}
                  </button>
                ))}
              </div>
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-mono text-cyan-800 dark:text-cyan-300 text-center font-bold">
                {wh.signalMessage}
              </div>
            </div>

            {/* Live Telemetry Summary */}
            <div className="space-y-1.5 pt-2 border-t border-parchment-200 dark:border-ink-800 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-ink-600 dark:text-ink-400">Brake Cylinder C:</span>
                <span className="font-bold text-rose-500">{cylPressurePsi} PSI</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600 dark:text-ink-400">Auxiliary Receiver D:</span>
                <span className="font-bold text-cyan-600 dark:text-cyan-400">
                  {wh.receiverPressurePsi} PSI
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600 dark:text-ink-400">Piston Shoe Clamping:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {wh.shoeClampingForceKn} kN
                </span>
              </div>
            </div>
          </div>

          {/* Educational Note */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-ink-900 dark:text-parchment-100 text-xs font-sans space-y-1.5">
            <span className="font-bold text-amber-900 dark:text-amber-300 block font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>US 124,404 Dual-Pipe Mechanics:</span>
            </span>
            <p className="leading-relaxed text-ink-700 dark:text-ink-300">
              Unlike a single-pipe line, US 124,404 provides redundant pipe paths and automatic
              accident trip valves. If a train uncouples or a truck derails, cock e instantly
              dumps the local auxiliary receiver&apos;s stored charge into cylinder C by
              Boyle&apos;s law expansion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
