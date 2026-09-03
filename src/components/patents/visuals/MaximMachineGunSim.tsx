"use client";

import { Pause, Play, Target, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { wrapCycleRad } from "@/physics/catalogKernels";
import { FrankenSimEngine } from "@/physics/engine";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { SimulationHeader } from "./SimulationHeader";
import { usePatentAudio } from "./three/usePatentAudio";
import { useOffscreenGate } from "./useOffscreenGate";

const UI_SNAPSHOT_INTERVAL_MS = 80;

export function MaximMachineGunSim() {
  const { params, resetParams } = usePatentPhysics("us-319596-maxim-machine-gun");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [cyclePhase, setCyclePhase] = useState<number>(0);
  const animRef = useRef<number | null>(null);
  const cyclePhaseRef = useRef(0);
  const maximRef = useRef<ReturnType<typeof FrankenSimEngine.stepMaximMachineGun> | null>(null);
  const { rootRef, onscreenRef } = useOffscreenGate<HTMLDivElement>();

  const maxim = FrankenSimEngine.stepMaximMachineGun({
    cyclePhaseRad: cyclePhase,
    gasImpulsePct: params.gasImpulsePct ?? 75,
    cycleRpm: 60,
  });

  useEffect(() => {
    maximRef.current = maxim;
  }, [maxim]);

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
      const liveMaxim = maximRef.current;
      if (!liveMaxim) return;

      cyclePhaseRef.current = wrapCycleRad(
        cyclePhaseRef.current + liveMaxim.fireOmegaRadPerS * dt,
        liveMaxim.fireCycleWrapRad,
      );
      if (time - lastUiSnapshot >= UI_SNAPSHOT_INTERVAL_MS) {
        lastUiSnapshot = time;
        setCyclePhase(cyclePhaseRef.current);
      }
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, onscreenRef]);

  const strokePct = maxim.sleeveForwardMm / 24; // 0 to 1
  const sleeveX = 390 + 30 * strokePct;
  const rodX = 240 - 25 * strokePct;
  const breechX = 210 - 45 * strokePct;
  const crankAngle = strokePct * Math.PI;

  return (
    <div
      ref={rootRef}
      className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors"
    >
      <SimulationHeader
        icon={<Target className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
        title="Hiram Maxim Muzzle-Gas Machine Gun (US 319,596)"
        description="Direct forward muzzle-gas sleeve, direction-reversing rocker linkage, Scotch-yoke cross-head, and volute return spring."
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
          cyclePhaseRef.current = 0;
          setCyclePhase(0);
          soundEngine.playSwitchClick();
        }}
      />

      {/* SVG Animation Stage */}
      <div className="relative w-full aspect-[16/9] max-h-[360px] bg-parchment-100 dark:bg-ink-900 rounded-xl overflow-hidden border border-parchment-200 dark:border-ink-800 flex items-center justify-center">
        <svg
          viewBox="0 0 600 340"
          role="img"
          aria-label={`Maxim US 319,596 muzzle-gas machine gun simulation: ${isPlaying ? (maxim.isMuzzleFiring ? "firing" : "cycling") : "stopped"}`}
          className="w-full h-full"
        >
          {/* Main Structural Frame A */}
          <rect
            x="50"
            y="90"
            width="280"
            height="130"
            rx="4"
            fill="#2D3748"
            stroke="#1A202C"
            strokeWidth="2"
          />

          {/* Fixed Barrel B */}
          <rect
            x="240"
            y="135"
            width="200"
            height="20"
            fill="#4A5568"
            stroke="#2D3748"
            strokeWidth="2"
          />
          {/* Barrel bore centerline */}
          <line
            x1="240"
            y1="145"
            x2="440"
            y2="145"
            stroke="#718096"
            strokeDasharray="4 4"
            strokeWidth="1"
          />

          {/* Fixed Muzzle Socket Guide */}
          <rect
            x="370"
            y="130"
            width="30"
            height="30"
            fill="#319795"
            stroke="#234E52"
            strokeWidth="1.5"
            opacity="0.8"
          />

          {/* Sliding Muzzle Sleeve l & Socket l' (Moves Forward) */}
          <g transform={`translate(${sleeveX - 390}, 0)`}>
            <rect
              x="390"
              y="126"
              width="55"
              height="38"
              rx="4"
              fill="#D69E2E"
              stroke="#975A16"
              strokeWidth="2"
            />
            {/* Internal gas shoulder indicator */}
            <line x1="435" y1="128" x2="435" y2="162" stroke="#744210" strokeWidth="2" />
            <text x="400" y="150" fill="#1A202C" fontSize="10" fontWeight="bold">
              Sleeve l
            </text>
          </g>

          {/* Muzzle Gas Blast Cloud when firing */}
          {maxim.isMuzzleFiring && (
            <g transform={`translate(${sleeveX + 55}, 145)`}>
              <ellipse cx="15" cy="0" rx="20" ry="12" fill="#ECC94B" opacity="0.9" />
              <ellipse cx="25" cy="0" rx="14" ry="8" fill="#DD6B20" opacity="0.85" />
              <polygon points="0,-8 18,0 0,8" fill="#E53E3E" />
            </g>
          )}

          {/* Reversing Levers n (Pivots at x=340, y=180) */}
          <g>
            <circle cx="340" cy="180" r="4" fill="#E2E8F0" stroke="#1A202C" strokeWidth="1.5" />
            {/* Lever bar */}
            <line
              x1={390 + 30 * strokePct - 20}
              y1="145"
              x2={rodX + 70}
              y2="200"
              stroke="#D69E2E"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <text x="330" y="215" fill="#A0AEC0" fontSize="10">
              Lever n
            </text>
          </g>

          {/* Connecting Operating Rods c' (Pulls Rearward) */}
          <g>
            <line
              x1={rodX}
              y1="200"
              x2={rodX + 70}
              y2="200"
              stroke="#E2E8F0"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <text x={rodX + 15} y="195" fill="#CBD5E0" fontSize="9">
              Rod c′
            </text>
          </g>

          {/* Transverse Crankshaft e (Center at x=100, y=155) */}
          <g transform="translate(100, 155)">
            <circle cx="0" cy="0" r="24" fill="#1A202C" stroke="#4A5568" strokeWidth="2" />
            {/* Crank arm f & pin e² */}
            <line
              x1="0"
              y1="0"
              x2={20 * Math.cos(crankAngle)}
              y2={20 * Math.sin(crankAngle)}
              stroke="#ECC94B"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle
              cx={20 * Math.cos(crankAngle)}
              cy={20 * Math.sin(crankAngle)}
              r="4"
              fill="#E53E3E"
            />
            {/* Volute Spring k Indicator */}
            <circle
              cx="0"
              cy="0"
              r="16"
              fill="none"
              stroke="#ED8936"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            <text x="-18" y="-28" fill="#ECC94B" fontSize="10" fontWeight="bold">
              Crank e / Spring k
            </text>
          </g>

          {/* Scotch-Yoke Cross-Head d & Breech-Block C (Slides Rearward) */}
          <g transform={`translate(${breechX - 210}, 0)`}>
            {/* Breech block C */}
            <rect
              x="160"
              y="125"
              width="65"
              height="40"
              rx="2"
              fill="#4A5568"
              stroke="#CBD5E0"
              strokeWidth="1.5"
            />
            {/* Scotch-Yoke Vertical Slot */}
            <rect
              x="95"
              y="125"
              width="12"
              height="60"
              rx="3"
              fill="#2D3748"
              stroke="#E2E8F0"
              strokeWidth="1"
            />
            <text x="165" y="148" fill="#F7FAFC" fontSize="10" fontWeight="bold">
              Breech C
            </text>
            <text x="85" y="195" fill="#E2E8F0" fontSize="9">
              Cross-Head d
            </text>
          </g>

          {/* Cartridge Feed Starwheels Q, Q' */}
          <g transform="translate(190, 80)">
            <circle cx="0" cy="0" r="14" fill="#D69E2E" stroke="#744210" strokeWidth="1.5" />
            <circle cx="25" cy="0" r="14" fill="#D69E2E" stroke="#744210" strokeWidth="1.5" />
            <text x="-5" y="-18" fill="#ECC94B" fontSize="9">
              Feed Q, Q′
            </text>
          </g>

          {/* Explanatory Annotations */}
          <text x="60" y="320" fill="#718096" fontSize="10">
            Fixed Barrel B • Forward Sleeve l • Reversing Levers n • Operating Rods c′ • Crankshaft
            e • Volute Spring k
          </text>
        </svg>
      </div>

      {/* Live Readout Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        <div className="p-3 bg-parchment-100 dark:bg-ink-900 rounded-xl border border-parchment-200 dark:border-ink-800">
          <span className="text-[10px] uppercase font-bold tracking-wider text-ink-500 dark:text-ink-400 block">
            Muzzle Sleeve
          </span>
          <span className="font-mono text-sm sm:text-base font-semibold text-amber-600 dark:text-amber-400">
            {maxim.sleeveForwardMm > 1 ? `+${maxim.sleeveForwardMm.toFixed(1)} mm` : "IN BATTERY"}
          </span>
        </div>
        <div className="p-3 bg-parchment-100 dark:bg-ink-900 rounded-xl border border-parchment-200 dark:border-ink-800">
          <span className="text-[10px] uppercase font-bold tracking-wider text-ink-500 dark:text-ink-400 block">
            Breech Block C
          </span>
          <span className="font-mono text-sm sm:text-base font-semibold text-cyan-600 dark:text-cyan-400">
            {maxim.breechOpenMm > 2 ? `-${maxim.breechOpenMm.toFixed(1)} mm` : "CLOSED"}
          </span>
        </div>
        <div className="p-3 bg-parchment-100 dark:bg-ink-900 rounded-xl border border-parchment-200 dark:border-ink-800">
          <span className="text-[10px] uppercase font-bold tracking-wider text-ink-500 dark:text-ink-400 block">
            Reversing Levers
          </span>
          <span className="font-mono text-sm sm:text-base font-semibold text-purple-600 dark:text-purple-400">
            {maxim.leverAngleDeg.toFixed(1)}°
          </span>
        </div>
        <div className="p-3 bg-parchment-100 dark:bg-ink-900 rounded-xl border border-parchment-200 dark:border-ink-800">
          <span className="text-[10px] uppercase font-bold tracking-wider text-ink-500 dark:text-ink-400 block">
            Volute Spring k
          </span>
          <span className="font-mono text-sm sm:text-base font-semibold text-emerald-600 dark:text-emerald-400">
            {maxim.springWoundPct > 5 ? `WOUND (${maxim.springWoundPct.toFixed(0)}%)` : "UNWOUND"}
          </span>
        </div>
      </div>
    </div>
  );
}
