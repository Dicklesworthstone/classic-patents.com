"use client";

import React, { useId, useMemo, useState } from "react";
import {
  readStackhouseManipulatorControls,
  stepStackhouseManipulatorSi,
} from "@/physics/stackhouseManipulatorKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

interface StackhouseManipulatorSimProps {
  readonly patentId?: string;
}

export function StackhouseManipulatorSim({
  patentId = "us-4068536-stackhouse-manipulator",
}: StackhouseManipulatorSimProps) {
  const maskId = useId();
  const { params, updateParam, resetParams } = usePatentPhysics(patentId);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animTime, setAnimTime] = useState(0);

  React.useEffect(() => {
    if (!isPlaying) return;
    let animFrame: number;
    let lastT = performance.now();

    const loop = (now: number) => {
      const dt = (now - lastT) / 1000;
      lastT = now;
      setAnimTime((t) => t + dt);
      animFrame = requestAnimationFrame(loop);
    };
    animFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrame);
  }, [isPlaying]);

  const controls = useMemo(() => {
    const raw = readStackhouseManipulatorControls(params);
    if (!isPlaying) return raw;
    return {
      ...raw,
      forearmRollDeg: raw.forearmRollDeg + Math.sin(animTime * 1.0) * 35,
      intermediateRollDeg: 60 + Math.cos(animTime * 0.8) * 30,
      toolRollDeg: raw.toolRollDeg + Math.sin(animTime * 1.5) * 45,
    };
  }, [params, isPlaying, animTime]);

  const telemetry = useMemo(
    () => stepStackhouseManipulatorSi(controls, isPlaying ? animTime : 0),
    [controls, isPlaying, animTime],
  );

  // SVG Kinematic Coordinates (2D projection):
  // Center of spherical wrist intersection (Point 36) at (320, 240)
  const cx = 320;
  const cy = 240;
  const forearmLength = 150;

  // Forearm base at (cx - forearmLength, cy)
  const basePoint = { x: cx - forearmLength, y: cy };

  // Intermediate link 28 length & angle
  const linkLength = 80;
  const t1 = controls.forearmRollDeg * (Math.PI / 180);

  // Intermediate link endpoint
  const alpha1 = Math.PI / 4; // 45°
  const intermediateAngle = alpha1 * Math.cos(t1);
  const interX = cx + linkLength * Math.cos(intermediateAngle);
  const interY = cy - linkLength * Math.sin(intermediateAngle);

  // Tool flange endpoint based on total bend
  const totalBendRad = telemetry.totalBendAngleDeg * (Math.PI / 180);
  const toolLengthPx = controls.toolLengthM * 350;
  const toolX =
    cx + (linkLength + toolLengthPx) * Math.cos(totalBendRad * Math.sin(t1 + Math.PI / 2));
  const toolY = cy - (linkLength + toolLengthPx) * Math.sin(totalBendRad);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border/40 bg-card/60 p-4 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/30 pb-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            3-Roll Spherical Wrist Kinematic Simulator
          </h3>
          <p className="text-xs text-muted-foreground">
            US 4,068,536 • Theodore H. Stackhouse (Cincinnati Milacron T3 Spherical Wrist)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            {isPlaying ? "Pause Continuous Sweep" : "Continuous Trajectory"}
          </button>
          <button
            type="button"
            onClick={() => resetParams()}
            className="rounded-md border border-border/60 bg-background px-3 py-1 text-xs font-medium text-foreground hover:bg-muted"
          >
            Reset
          </button>
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-border/30 bg-slate-950/80">
        <svg viewBox="0 0 640 400" className="h-full w-full select-none">
          <defs>
            <radialGradient id={`sphere-grad-${maskId}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="70%" stopColor="#0284c7" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`shaft-grad-${maskId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
            <linearGradient id={`housing-grad-${maskId}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>

          {/* Spherical Sector Reach Arc */}
          <circle
            cx={cx}
            cy={cy}
            r={linkLength + toolLengthPx}
            fill={`url(#sphere-grad-${maskId})`}
            stroke="#0ea5e9"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.4"
          />

          {/* Coordinate axes */}
          <line
            x1={cx - 180}
            y1={cy}
            x2={cx + 200}
            y2={cy}
            stroke="#475569"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          <line
            x1={cx}
            y1={cy - 180}
            x2={cx}
            y2={cy + 180}
            stroke="#475569"
            strokeWidth="1"
            strokeDasharray="2 2"
          />

          {/* Robot Forearm Tube 12 */}
          <rect
            x={basePoint.x}
            y={cy - 24}
            width={forearmLength}
            height={48}
            rx="6"
            fill="url(#shaft-grad-1)"
            stroke="#334155"
            strokeWidth="2"
          />
          <text
            x={basePoint.x + 20}
            y={cy - 30}
            fill="#94a3b8"
            fontSize="10"
            fontFamily="monospace"
          >
            Forearm Housing (12)
          </text>

          {/* Concentric Inner/Outer Shafts */}
          <line
            x1={basePoint.x + 10}
            y1={cy}
            x2={cx}
            y2={cy}
            stroke="#38bdf8"
            strokeWidth="8"
            strokeDasharray="12 4"
          />
          <text
            x={basePoint.x + 25}
            y={cy + 5}
            fill="#0284c7"
            fontSize="9"
            fontFamily="monospace"
            fontWeight="bold"
          >
            Concentric Shafts (18, 20)
          </text>

          {/* First Bevel Gear Pair 38/40 at Center Point 36 */}
          <polygon
            points={`${cx - 15},${cy - 12} ${cx + 5},${cy - 22} ${cx + 5},${cy + 22} ${cx - 15},${cy + 12}`}
            fill="#f59e0b"
            stroke="#b45309"
            strokeWidth="1.5"
          />

          {/* 45° Oblique Intermediate Link 28 */}
          <line
            x1={cx}
            y1={cy}
            x2={interX}
            y2={interY}
            stroke="#2563eb"
            strokeWidth="22"
            strokeLinecap="round"
          />
          <line
            x1={cx}
            y1={cy}
            x2={interX}
            y2={interY}
            stroke="#60a5fa"
            strokeWidth="6"
            strokeDasharray="6 3"
          />
          <text
            x={(cx + interX) / 2 - 25}
            y={(cy + interY) / 2 - 16}
            fill="#60a5fa"
            fontSize="10"
            fontFamily="monospace"
          >
            Link 28 (α₁=45°)
          </text>

          {/* Second Bevel Gear Set 54/56 at Intermediate Joint */}
          <circle cx={interX} cy={interY} r="12" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />

          {/* Terminal Tool Flange 46 and Tool Standoff */}
          <line
            x1={interX}
            y1={interY}
            x2={toolX}
            y2={toolY}
            stroke="#a855f7"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <line x1={interX} y1={interY} x2={toolX} y2={toolY} stroke="#c084fc" strokeWidth="4" />

          {/* Tool Tip / End Effector Nozzle */}
          <circle cx={toolX} cy={toolY} r="8" fill="#ec4899" stroke="#be185d" strokeWidth="2" />
          <line
            x1={toolX}
            y1={toolY}
            x2={toolX + telemetry.toolVector[0] * 35}
            y2={toolY - telemetry.toolVector[2] * 35}
            stroke="#ec4899"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Common Intersection Center Point 36 Indicator */}
          <circle cx={cx} cy={cy} r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
          <text
            x={cx - 40}
            y={cy + 25}
            fill="#ef4444"
            fontSize="11"
            fontFamily="monospace"
            fontWeight="bold"
          >
            Center Point 36
          </text>

          {/* Legend / Overlay */}
          <g transform="translate(16, 20)">
            <rect
              width="210"
              height="115"
              rx="6"
              fill="#0f172a"
              fillOpacity="0.85"
              stroke="#334155"
              strokeWidth="1"
            />
            <text x="12" y="20" fill="#f8fafc" fontSize="11" fontWeight="bold">
              3-Roll Kinematic Telemetry
            </text>
            <text x="12" y="40" fill="#38bdf8" fontSize="10" fontFamily="monospace">
              Forearm Roll (θ₁): {controls.forearmRollDeg.toFixed(1)}°
            </text>
            <text x="12" y="56" fill="#60a5fa" fontSize="10" fontFamily="monospace">
              Intermediate (θ₂): {controls.intermediateRollDeg.toFixed(1)}°
            </text>
            <text x="12" y="72" fill="#c084fc" fontSize="10" fontFamily="monospace">
              Tool Spin (θ₃): {controls.toolRollDeg.toFixed(1)}°
            </text>
            <text x="12" y="88" fill="#34d399" fontSize="10" fontFamily="monospace">
              Total Bend Angle: {telemetry.totalBendAngleDeg.toFixed(1)}°
            </text>
            <text x="12" y="104" fill="#fbbf24" fontSize="10" fontFamily="monospace">
              |det(J)|: {telemetry.jacobianDeterminant.toFixed(3)} (
              {telemetry.singularityMarginPct.toFixed(0)}% margin)
            </text>
          </g>
        </svg>
      </div>

      {/* Interactive Parameter Controls */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5 rounded-lg border border-border/30 bg-muted/20 p-3">
          <div className="flex items-center justify-between">
            <label htmlFor="forearm-roll-input" className="text-xs font-medium text-foreground">
              Forearm Roll (θ₁)
            </label>
            <span className="font-mono text-xs text-primary">
              {controls.forearmRollDeg.toFixed(0)}°
            </span>
          </div>
          <input
            id="forearm-roll-input"
            type="range"
            min="-180"
            max="180"
            step="1"
            value={controls.forearmRollDeg}
            onChange={(e) => updateParam("forearmRollDeg", Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-border accent-primary"
          />
        </div>

        <div className="flex flex-col gap-1.5 rounded-lg border border-border/30 bg-muted/20 p-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor="intermediate-roll-input"
              className="text-xs font-medium text-foreground"
            >
              Intermediate Roll (θ₂)
            </label>
            <span className="font-mono text-xs text-primary">
              {controls.intermediateRollDeg.toFixed(0)}°
            </span>
          </div>
          <input
            id="intermediate-roll-input"
            type="range"
            min="-180"
            max="180"
            step="1"
            value={controls.intermediateRollDeg}
            onChange={(e) => updateParam("intermediateRollDeg", Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-border accent-primary"
          />
        </div>

        <div className="flex flex-col gap-1.5 rounded-lg border border-border/30 bg-muted/20 p-3">
          <div className="flex items-center justify-between">
            <label htmlFor="tool-spin-input" className="text-xs font-medium text-foreground">
              Tool Spin Roll (θ₃)
            </label>
            <span className="font-mono text-xs text-primary">
              {controls.toolRollDeg.toFixed(0)}°
            </span>
          </div>
          <input
            id="tool-spin-input"
            type="range"
            min="-180"
            max="180"
            step="1"
            value={controls.toolRollDeg}
            onChange={(e) => updateParam("toolRollDeg", Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-border accent-primary"
          />
        </div>
      </div>
    </div>
  );
}
