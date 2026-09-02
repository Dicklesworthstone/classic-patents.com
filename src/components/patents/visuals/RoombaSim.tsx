"use client";

import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import {
  createRoombaTransportUpdater,
  getRoombaTapeState,
  initialRoombaState,
  ROOMBA_ENVIRONMENT_PARTS,
  ROOMBA_FURNITURE,
  ROOMBA_ROOM,
  resetRoombaTapeState,
} from "@/physics/roombaKernel";
import { roombaPoseHudPresentation } from "@/physics/roombaWasm";
import { globalTransportBus, useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "./ClaimConstraintToggle";
import { usePatentAudio } from "./three/usePatentAudio";
import { useOffscreenGate } from "./useOffscreenGate";

interface RoombaSimProps {
  initialWheelSpeed?: number;
  initialTurnRate?: number;
}

export function RoombaSim({ initialWheelSpeed = 0.3, initialTurnRate = 1.5 }: RoombaSimProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { rootRef, onscreenRef } = useOffscreenGate<HTMLDivElement>();
  const speedId = useId();
  const turnId = useId();

  const { params, updateParam, resetParams } = usePatentPhysics("us-6594844-roomba");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const wheelSpeed = params.wheelSpeedMps ?? initialWheelSpeed;
  const turnRate = params.turnRateRadSec ?? initialTurnRate;
  const opticalSensorEnabled = (params.opticalSensorEnabled ?? 1) >= 0.5;
  const claimStates = { 1: opticalSensorEnabled };
  const isPlaying = (params.isRunning ?? 1) >= 0.5;
  const liveControls = useRef({ wheelSpeed, turnRate, isPlaying, opticalSensorEnabled });
  liveControls.current = { wheelSpeed, turnRate, isPlaying, opticalSensorEnabled };

  useFrankenSimPhysics("us-6594844-roomba", {
    domain: "solid_mechanics",
    refusal: {
      isRefused: !opticalSensorEnabled,
      reason: !opticalSensorEnabled
        ? "Claim 1 optical emitter/detector and surface-absence redirect circuit are disabled."
        : undefined,
    },
    machine: {
      poseXMeters: 0,
      poseYMeters: 0,
      headingRad: 0,
      modeLabel: "spiral",
      wheelSpeedMps: wheelSpeed,
    },
  });
  useEffect(() => {
    return globalTransportBus.registerUpdater(
      "us-6594844-roomba",
      createRoombaTransportUpdater(() => ({
        wheelSpeedMps: liveControls.current.wheelSpeed,
        turnRateRadSec: liveControls.current.turnRate,
        roomWidth: ROOMBA_ROOM.width,
        roomHeight: ROOMBA_ROOM.height,
        opticalSensorEnabled: liveControls.current.opticalSensorEnabled,
        running: liveControls.current.isPlaying && onscreenRef.current,
      })),
      "TS_FALLBACK",
    );
  }, [onscreenRef]);

  // Path history for breadcrumbs trail
  const trailRef = useRef<Array<{ x: number; y: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const transport = globalTransportBus.getTransport("us-6594844-roomba");

    let animId: number;
    const initialState = initialRoombaState();
    let lastTrailX = Number.NaN;
    let lastTrailY = Number.NaN;

    const render = () => {
      animId = requestAnimationFrame(render);
      if (!onscreenRef.current) return;
      const state = getRoombaTapeState() ?? initialState;
      if (
        isPlaying &&
        (!Number.isFinite(lastTrailX) ||
          !Number.isFinite(lastTrailY) ||
          Math.abs(state.x - lastTrailX) > 1e-5 ||
          Math.abs(state.y - lastTrailY) > 1e-5)
      ) {
        trailRef.current.push({ x: state.x, y: state.y });
        lastTrailX = state.x;
        lastTrailY = state.y;
        if (trailRef.current.length > 500) {
          trailRef.current.shift();
        }
      }

      const w = canvas.width;
      const h = canvas.height;

      // Dark background
      ctx.fillStyle = "#0a0f1d";
      ctx.fillRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = "rgba(30, 41, 59, 0.4)";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Title & Masthead
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
      ctx.fillText("IROBOT ROOMBA SENSOR-DRIVEN PATH & REDIRECT MODEL", 20, 26);
      ctx.font = "11px monospace";
      ctx.fillStyle = "#94a3b8";
      const owner = roombaPoseHudPresentation(transport.lastFrame.provenance);
      const chassisSpeed = (state.leftWheelSpeedMps + state.rightWheelSpeedMps) / 2;
      ctx.fillText(
        `US 6,594,844 • ${owner.value} • Mode: ${state.mode.toUpperCase()} • Chassis: ${chassisSpeed.toFixed(2)} m/s`,
        20,
        42,
      );

      // ========================================================
      // 1. ARENA FLOORPLAN (Left/Center: x: 40 to 520, y: 65 to 325)
      // ========================================================
      const aX = 40;
      const aY = 65;
      const aW = 480;
      const aH = 260;

      // Floor surface
      ctx.fillStyle = "#172033";
      ctx.fillRect(aX, aY, aW, aH);

      // Room Perimeter Walls
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 4;
      ctx.strokeRect(aX, aY, aW, aH);

      const halfW = ROOMBA_ROOM.width / 2;
      const halfH = ROOMBA_ROOM.height / 2;
      const toScreenX = (rx: number) => aX + aW / 2 + (rx / halfW) * (aW / 2 - 12);
      const toScreenY = (ry: number) => aY + aH / 2 - (ry / halfH) * (aH / 2 - 12);

      // Travel path ribbon (not a claimed coverage percentage).
      if (trailRef.current.length > 1) {
        ctx.strokeStyle = "rgba(56, 189, 248, 0.28)";
        ctx.lineWidth = 18;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(toScreenX(trailRef.current[0].x), toScreenY(trailRef.current[0].y));
        for (let i = 1; i < trailRef.current.length; i++) {
          ctx.lineTo(toScreenX(trailRef.current[i].x), toScreenY(trailRef.current[i].y));
        }
        ctx.stroke();
      }

      // Draw the same supported solids used by the 3D room and collision
      // kernel. Elevated tops/seats remain visually distinct from low legs.
      for (const part of ROOMBA_ENVIRONMENT_PARTS) {
        const ox = toScreenX(part.x);
        const oy = toScreenY(part.y);
        const ow = (part.w / ROOMBA_ROOM.width) * aW;
        const oh = (part.h / ROOMBA_ROOM.height) * aH;

        ctx.fillStyle = part.collidesWithRobot ? "#334155" : "rgba(120, 53, 15, 0.5)";
        ctx.fillRect(ox - ow / 2, oy - oh / 2, ow, oh);
        ctx.strokeStyle = part.collidesWithRobot ? "#f59e0b" : "#92400e";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(ox - ow / 2, oy - oh / 2, ow, oh);
      }

      for (const assembly of ROOMBA_FURNITURE) {
        const ox = toScreenX(assembly.x);
        const oy = toScreenY(assembly.y);
        ctx.fillStyle = "#fde68a";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(assembly.label, ox, oy + 3);
        ctx.textAlign = "left";
      }

      // Draw Roomba Robot
      const rx = toScreenX(state.x);
      const ry = toScreenY(state.y);
      const rRadius = 14;

      ctx.save();
      ctx.translate(rx, ry);
      ctx.rotate(-state.heading); // Canvas Y is inverted

      // Round Robot Chassis
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.arc(0, 0, rRadius, 0, Math.PI * 2);
      ctx.fill();

      // Front Spring Bumper (Arc on right / forward side)
      ctx.strokeStyle = state.mode === "backup" ? "#ef4444" : "#38bdf8";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, 0, rRadius + 1, -Math.PI / 2.5, Math.PI / 2.5);
      ctx.stroke();

      // Drive Wheels
      ctx.fillStyle = "#64748b";
      ctx.fillRect(-4, -rRadius - 2, 8, 4);
      ctx.fillRect(-4, rRadius - 2, 8, 4);

      // Center Power Button
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();

      // Heading indicator arrow
      ctx.strokeStyle = "#f8fafc";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(rRadius + 4, 0);
      ctx.stroke();

      // Claim 1 emitter and detector are mounted to the chassis; their two
      // directed fields meet at one finite region ahead of the sensor pair.
      const sensorTone = state.opticalSensorEnabled ? "#38bdf8" : "#64748b";
      ctx.fillStyle = sensorTone;
      ctx.fillRect(rRadius - 5, -6, 3, 3);
      ctx.fillStyle = state.opticalSensorEnabled ? "#a78bfa" : "#64748b";
      ctx.fillRect(rRadius - 5, 3, 3, 3);
      ctx.strokeStyle = sensorTone;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(rRadius - 2, -4.5);
      ctx.lineTo(rRadius + 7, 0);
      ctx.moveTo(rRadius - 2, 4.5);
      ctx.lineTo(rRadius + 7, 0);
      ctx.stroke();

      ctx.restore();

      // ========================================================
      // 2. SHARED KERNEL MOTION TELEMETRY (Right Pane: x: 540 to 740, y: 65 to 325)
      // ========================================================
      const tX = 540;
      const tY = 65;
      const tW = 200;
      const tH = 260;

      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(tX, tY, tW, tH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 11px system-ui, sans-serif";
      ctx.fillText("KERNEL MOTION STATE", tX + 12, tY + 22);

      // Mode Indicators
      const modes: Array<{ id: string; label: string; active: boolean; color: string }> = [
        {
          id: "spiral",
          label: "1. Spiral Clean",
          active: state.mode === "spiral",
          color: "#38bdf8",
        },
        {
          id: "straight",
          label: "2. Straight Cruise",
          active: state.mode === "straight",
          color: "#10b981",
        },
        {
          id: "backup",
          label: "3. Bumper Collision",
          active: state.mode === "backup",
          color: "#ef4444",
        },
        { id: "turn", label: "4. Random Bounce", active: state.mode === "turn", color: "#f59e0b" },
      ];

      for (let i = 0; i < modes.length; i++) {
        const m = modes[i];
        const curY = tY + 42 + i * 28;

        ctx.fillStyle = m.active ? `${m.color}33` : "rgba(30, 41, 59, 0.4)";
        ctx.fillRect(tX + 12, curY, tW - 24, 22);
        ctx.strokeStyle = m.active ? m.color : "#334155";
        ctx.lineWidth = 1;
        ctx.strokeRect(tX + 12, curY, tW - 24, 22);

        ctx.fillStyle = m.active ? m.color : "#64748b";
        ctx.font = `bold ${m.active ? "10px" : "9px"} monospace`;
        ctx.fillText(m.label, tX + 18, curY + 15);
      }

      // Live Telemetry
      const statY = tY + 168;
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px monospace";
      ctx.fillText("Arena Coordinates:", tX + 12, statY);
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "bold 10px monospace";
      ctx.fillText(`X: ${state.x.toFixed(2)}m  Y: ${state.y.toFixed(2)}m`, tX + 12, statY + 14);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px monospace";
      ctx.fillText("Heading Angle θ:", tX + 12, statY + 34);
      ctx.fillStyle = "#a78bfa";
      ctx.font = "bold 10px monospace";
      ctx.fillText(`${(((state.heading * 180) / Math.PI) % 360).toFixed(1)}°`, tX + 12, statY + 48);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px monospace";
      ctx.fillText("Optical Field Overlap:", tX + 12, statY + 68);
      ctx.fillStyle = state.opticalSensorEnabled ? "#38bdf8" : "#f87171";
      ctx.font = "bold 10px monospace";
      ctx.fillText(
        state.opticalSensorEnabled
          ? `${(state.surfaceOverlapFraction * 100).toFixed(0)}% • ${state.redirectReason}`
          : "CLAIM 1 SUBSYSTEM ABSENT",
        tX + 12,
        statY + 82,
      );
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, onscreenRef]);

  return (
    <div
      ref={rootRef}
      className="w-full flex flex-col gap-4 p-4 sm:p-6 rounded-2xl bg-parchment-50 dark:bg-ink-950 border border-parchment-300 dark:border-ink-800 text-ink-900 dark:text-parchment-100 shadow-md"
    >
      {/* Header with Title and Global Action Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
            Robotic Autonomous Vacuum Cleaner (US 6,594,844)
          </h3>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400">
            Patented optical cliff/wall response inside a contextual differential-drive cleaning
            path. The path is not presented as a coverage guarantee.
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
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
              updateParam("isRunning", isPlaying ? 0 : 1);
              soundEngine.playSwitchClick();
            }}
            aria-label={isPlaying ? "Pause Simulation" : "Play Simulation"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
            title={isPlaying ? "Pause Simulation" : "Play Simulation"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-amber-600" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              resetParams();
              resetRoombaTapeState();
              trailRef.current = [];
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

      {/* Canvas */}
      <div className="relative w-full overflow-hidden rounded-xl border border-parchment-300 dark:border-ink-800 bg-canvas">
        <canvas
          ref={canvasRef}
          width={760}
          height={340}
          className="w-full h-auto block aspect-[760/340]"
        />
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-parchment-100/80 dark:bg-ink-900/70 border border-parchment-200 dark:border-ink-800/80 text-xs">
        {/* Drive Wheel Speed */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between font-mono text-ink-700 dark:text-parchment-300">
            <label htmlFor={speedId}>Differential Wheel Speed:</label>
            <span className="text-amber-600 dark:text-amber-400 font-bold">
              {wheelSpeed.toFixed(2)} m/s
            </span>
          </div>
          <input
            id={speedId}
            type="range"
            min="0.1"
            max="1.0"
            step="0.1"
            value={wheelSpeed}
            onChange={(e) => updateParam("wheelSpeedMps", parseFloat(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-500">
            Linear velocity across floor driving Archimedean spiral and straight cruise modes
          </span>
        </div>

        {/* Turn Rate Rad/Sec */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between font-mono text-ink-700 dark:text-parchment-300">
            <label htmlFor={turnId}>Turn Angular Rate:</label>
            <span className="text-cyan-600 dark:text-cyan-400 font-bold">
              {turnRate.toFixed(1)} rad/s
            </span>
          </div>
          <input
            id={turnId}
            type="range"
            min="0.5"
            max="3.0"
            step="0.5"
            value={turnRate}
            onChange={(e) => updateParam("turnRateRadSec", parseFloat(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-500">
            Spin rate of differential drive wheels during obstacle collision deflection
          </span>
        </div>
      </div>

      <ClaimConstraintToggle
        patentId="us-6594844-roomba"
        claimStates={claimStates}
        onToggleClaim={(_claimNo, active) => updateParam("opticalSensorEnabled", active ? 1 : 0)}
      />

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              trailRef.current = [];
              soundEngine.playSwitchClick();
            }}
            className="px-3 py-1.5 rounded-lg font-mono text-xs font-semibold bg-parchment-100 dark:bg-ink-900 border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-200 hover:bg-parchment-200 dark:hover:bg-neutral-800 hover:text-ink-900 dark:hover:text-white transition-all"
          >
            Clear Path Ribbon
          </button>
        </div>

        <span className="text-[11px] font-mono text-ink-500 dark:text-ink-400">
          One shared fixed-step motion tape • runtime source shown in the instrument masthead
        </span>
      </div>
    </div>
  );
}
