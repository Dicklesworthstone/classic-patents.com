"use client";

import { Cog, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { corlissConnectingRod, sliderStrokeSvg, stepCorlissEngine } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "./ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "./PortHamiltonianEnergyStrip";
import { SimulationHeader } from "./SimulationHeader";
import { SimulationTelemetryGrid } from "./SimulationTelemetryGrid";
import { usePatentAudio } from "./three/usePatentAudio";
import { useOffscreenGate } from "./useOffscreenGate";

const UI_SNAPSHOT_INTERVAL_MS = 80;

export function CorlissEngineSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-6162-corliss-steam-engine");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const boilerPressurePsi = params.steamPressurePsi ?? 100;
  const cutoffFractionPct = params.cutoffPct ?? 25;
  const engineRpm = params.engineRpm ?? 65;
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [crankAngleDeg, setCrankAngleDeg] = useState<number>(0);
  const animRef = useRef<number | null>(null);
  const crankAngleRef = useRef(0);
  const corlissRef = useRef<ReturnType<typeof stepCorlissEngine> | null>(null);
  const { rootRef, onscreenRef } = useOffscreenGate<HTMLDivElement>();

  const corliss = stepCorlissEngine({
    steamPressurePsi: boilerPressurePsi,
    engineRpm,
    cutoffPct: cutoffFractionPct,
  });
  const pBoilerMpa = corliss.boilerMpa;
  const expansionRatio = corliss.expansionRatio;
  const indicatedHorsepower = corliss.indicatedHp;
  const thermalEfficiencyPct = corliss.thermalEfficiencyPct;

  useEffect(() => {
    corlissRef.current = corliss;
  }, [corliss]);

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
      const liveCorliss = corlissRef.current;
      if (!liveCorliss) return;

      crankAngleRef.current =
        (crankAngleRef.current + liveCorliss.crankOmegaDegPerS * dt) % liveCorliss.displayWrapDeg;
      // Piston, wrist plate, rod, spokes, and valve windows share one crank angle.
      // Publish an intentionally bounded topology snapshot instead of forcing the
      // full diagram through React at display-frame rate.
      if (time - lastUiSnapshot >= UI_SNAPSHOT_INTERVAL_MS) {
        lastUiSnapshot = time;
        setCrankAngleDeg(crankAngleRef.current);
      }
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, onscreenRef]);

  // Kinematic calculations for piston & wrist-plate
  const pistonStroke = sliderStrokeSvg(crankAngleDeg, corliss.pistonStrokePx);
  const wristPlateAngle = sliderStrokeSvg(
    crankAngleDeg + corliss.wristLeadDeg,
    corliss.wristPlateAmpPx,
  );
  const connectingRod = corlissConnectingRod(
    crankAngleDeg,
    pistonStroke,
    corliss.pistonStrokePx,
    corliss.crankCx,
    corliss.crankCy,
    corliss.rodOriginX,
  );
  const isIntakeOpen = crankAngleDeg % corliss.intakeCycleDeg < corliss.intakeOpenWindowDeg;

  return (
    <div
      ref={rootRef}
      className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors"
    >
      <SimulationHeader
        icon={<Cog className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
        title="George Corliss Steam Engine & Oscillating Wrist-Plate (US 6,162)"
        description="Central oscillating wrist-plate, 4 independent rotary valves, and dashpot trip cut-off."
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
          crankAngleRef.current = 0;
          setCrankAngleDeg(0);
          soundEngine.playSwitchClick();
        }}
      />

      {/* SVG Animation Stage */}
      <div className="relative w-full aspect-[16/9] max-h-[360px] bg-parchment-100 dark:bg-ink-900 rounded-xl overflow-hidden border border-parchment-200 dark:border-ink-800 flex items-center justify-center">
        <svg
          viewBox="0 0 600 340"
          role="img"
          aria-label={`Corliss steam engine simulation: ${isPlaying ? "running" : "stopped"}, crank angle ${Math.round(crankAngleDeg)} degrees`}
          className="w-full h-full"
        >
          {/* Steam Cylinder Block */}
          <rect
            x="60"
            y="90"
            width="220"
            height="160"
            rx="8"
            fill="#3D3D3D"
            stroke="#222"
            strokeWidth="3"
          />
          <rect x="75" y="110" width="190" height="120" fill="#1A1A1A" />

          {/* 4 Rotary Corliss Valves at 4 Corners */}
          {/* Top Left: Steam Intake Left */}
          <g transform="translate(85, 100)">
            <circle cx="0" cy="0" r="16" fill="#8B5A2B" stroke="#D4AF37" strokeWidth="2" />
            <line
              x1="-14"
              y1="0"
              x2="14"
              y2="0"
              stroke={isIntakeOpen ? "#38A169" : "#E53E3E"}
              strokeWidth="4"
            />
          </g>
          {/* Top Right: Steam Intake Right */}
          <g transform="translate(255, 100)">
            <circle cx="0" cy="0" r="16" fill="#8B5A2B" stroke="#D4AF37" strokeWidth="2" />
            <line
              x1="-14"
              y1="0"
              x2="14"
              y2="0"
              stroke={!isIntakeOpen ? "#38A169" : "#E53E3E"}
              strokeWidth="4"
            />
          </g>
          {/* Bottom Left: Exhaust Left */}
          <g transform="translate(85, 240)">
            <circle cx="0" cy="0" r="16" fill="#5C4033" stroke="#888" strokeWidth="2" />
            <line
              x1="-14"
              y1="0"
              x2="14"
              y2="0"
              stroke={!isIntakeOpen ? "#38A169" : "#E53E3E"}
              strokeWidth="4"
            />
          </g>
          {/* Bottom Right: Exhaust Right */}
          <g transform="translate(255, 240)">
            <circle cx="0" cy="0" r="16" fill="#5C4033" stroke="#888" strokeWidth="2" />
            <line
              x1="-14"
              y1="0"
              x2="14"
              y2="0"
              stroke={isIntakeOpen ? "#38A169" : "#E53E3E"}
              strokeWidth="4"
            />
          </g>

          {/* Reciprocating Steam Piston & Rod */}
          <g transform={`translate(${corliss.pistonSvgX + pistonStroke}, ${corliss.pistonSvgY})`}>
            <rect
              x="-18"
              y="-55"
              width="36"
              height="110"
              rx="3"
              fill="#A0AEC0"
              stroke="#4A5568"
              strokeWidth="2"
            />
            <rect
              x="18"
              y="-6"
              width="170"
              height="12"
              fill="#CBD5E0"
              stroke="#718096"
              strokeWidth="1"
            />
          </g>

          {/* Central Oscillating Wrist-Plate (Corliss Valve Hub) */}
          <g
            transform={`translate(${corliss.wristPlateCx}, ${corliss.wristPlateCy}) rotate(${wristPlateAngle})`}
          >
            <circle cx="0" cy="0" r="32" fill="#C5A059" stroke="#5C4033" strokeWidth="2" />
            <circle cx="0" cy="0" r="8" fill="#222" />
            {/* 4 Connecting Valve Linkage Pins */}
            <circle cx="-18" cy="-18" r="4.5" fill="#3D3D3D" />
            <circle cx="18" cy="-18" r="4.5" fill="#3D3D3D" />
            <circle cx="-18" cy="18" r="4.5" fill="#3D3D3D" />
            <circle cx="18" cy="18" r="4.5" fill="#3D3D3D" />
          </g>
          <text
            x="135"
            y="174"
            fill="#1A1A1A"
            fontSize="9"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            Wrist-Plate
          </text>

          {/* Valve Linkage Rods from Wrist-Plate to Valves */}
          <line x1="152" y1="152" x2="85" y2="100" stroke="#8B5A2B" strokeWidth="2.5" />
          <line x1="188" y1="152" x2="255" y2="100" stroke="#8B5A2B" strokeWidth="2.5" />
          <line x1="152" y1="188" x2="85" y2="240" stroke="#8B5A2B" strokeWidth="2.5" />
          <line x1="188" y1="188" x2="255" y2="240" stroke="#8B5A2B" strokeWidth="2.5" />

          {/* Connecting Rod & Giant Flywheel */}
          <g transform={`translate(${corliss.crankCx}, ${corliss.crankCy})`}>
            <circle
              cx="0"
              cy="0"
              r={corliss.flywheelRimR}
              fill="none"
              stroke="#4A5568"
              strokeWidth="16"
            />
            <circle cx="0" cy="0" r={corliss.flywheelHubR} fill="#222" />
            {/* Flywheel Spokes */}
            {Array.from({ length: corliss.spokeCount }).map((_, i) => {
              const spkAngle = (i * corliss.spokePitchDeg + crankAngleDeg) % corliss.displayWrapDeg;
              return (
                <line
                  key={`spoke-${spkAngle}`}
                  x1="0"
                  y1="0"
                  x2={Math.cos((spkAngle * Math.PI) / 180) * corliss.flywheelSvgR}
                  y2={Math.sin((spkAngle * Math.PI) / 180) * corliss.flywheelSvgR}
                  stroke="#718096"
                  strokeWidth="4"
                />
              );
            })}
            {/* Crank Pin */}
            <circle
              cx={connectingRod.x2 - corliss.crankCx}
              cy={connectingRod.y2 - corliss.crankCy}
              r={corliss.crankPinR}
              fill="#D4AF37"
            />
          </g>

          {/* Main Connecting Rod */}
          <line
            x1={connectingRod.x1}
            y1={connectingRod.y1}
            x2={connectingRod.x2}
            y2={connectingRod.y2}
            stroke="#2D3748"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <SimulationTelemetryGrid
        cards={[
          {
            label: "Boiler Pressure",
            value: (
              <>
                {pBoilerMpa} MPa ({boilerPressurePsi} psi)
              </>
            ),
          },
          {
            label: "Expansion Ratio",
            value: (
              <>
                {expansionRatio}:1 ({cutoffFractionPct}% cut-off)
              </>
            ),
            valueClassName:
              "font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500",
          },
          {
            label: "Indicated Power",
            value: <>{indicatedHorsepower} hp</>,
            valueClassName:
              "font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500",
          },
          {
            label: "Thermal Efficiency",
            value: <>{thermalEfficiencyPct}%</>,
          },
        ]}
      />

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-parchment-200 dark:border-ink-800">
        <SensitivitySlider
          id="corlissSteamPressure2D"
          patentId="us-6162-corliss-steam-engine"
          paramKey="steamPressurePsi"
          label="Boiler Steam Pressure"
          value={boilerPressurePsi}
          min={40}
          max={180}
          step={5}
          unit="psi"
          onChange={(val) => updateParam("steamPressurePsi", val)}
          allParams={params}
        />
        <SensitivitySlider
          id="corlissEngineRpm2D"
          patentId="us-6162-corliss-steam-engine"
          paramKey="engineRpm"
          label="Engine Speed"
          value={engineRpm}
          min={30}
          max={120}
          step={5}
          unit="RPM"
          onChange={(val) => updateParam("engineRpm", val)}
          allParams={params}
        />
        <SensitivitySlider
          id="corlissCutoffPct2D"
          patentId="us-6162-corliss-steam-engine"
          paramKey="cutoffPct"
          label="Cut-Off Stroke Ratio"
          value={cutoffFractionPct}
          min={10}
          max={60}
          step={2}
          unit="%"
          onChange={(val) => updateParam("cutoffPct", val)}
          allParams={params}
        />
      </div>

      <div className="mt-4 pt-3 border-t border-parchment-200 dark:border-ink-800 space-y-3">
        <ClaimConstraintToggle
          patentId="us-6162-corliss-steam-engine"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
        />
        <PortHamiltonianEnergyStrip patentId="us-6162-corliss-steam-engine" params={params} />
      </div>
    </div>
  );
}
