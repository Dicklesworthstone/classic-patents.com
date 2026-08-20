"use client";

import { useEffect, useId, useRef, useState } from "react";
import { stepRoomba } from "@/physics/roombaKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

interface RoombaSimProps {
  initialWheelSpeed?: number;
  initialTurnRate?: number;
}

// Furniture obstacles: [x, y, w, h] in room coordinates [-2.5 to 2.5, -1.5 to 1.5]
const ROOM_OBSTACLES = [
  { x: -1.2, y: -0.6, w: 0.8, h: 0.6, label: "Coffee Table" },
  { x: 1.0, y: 0.5, w: 0.6, h: 0.6, label: "Armchair" },
];

export function RoombaSim({ initialWheelSpeed = 0.28, initialTurnRate = 2.4 }: RoombaSimProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const speedId = useId();
  const turnId = useId();

  const { params, updateParam } = usePatentPhysics("us-6594844-roomba");
  const wheelSpeed = params.wheelSpeedMps ?? initialWheelSpeed;
  const turnRate = params.turnRateRadSec ?? initialTurnRate;

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [cleanedAreaPct, setCleanedAreaPct] = useState<number>(12);

  // Path history for breadcrumbs trail
  const trailRef = useRef<Array<{ x: number; y: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let state = stepRoomba({
      wheelSpeedMps: wheelSpeed,
      turnRateRadSec: turnRate,
      roomWidth: 5.0,
      roomHeight: 3.2,
    });

    const render = () => {
      if (isPlaying) {
        state = stepRoomba(
          {
            wheelSpeedMps: wheelSpeed,
            turnRateRadSec: turnRate,
            roomWidth: 5.0,
            roomHeight: 3.2,
          },
          state,
          0.02,
        );

        // Check obstacle collisions
        for (const obs of ROOM_OBSTACLES) {
          const halfW = obs.w / 2 + 0.17;
          const halfH = obs.h / 2 + 0.17;
          if (
            state.x > obs.x - halfW &&
            state.x < obs.x + halfW &&
            state.y > obs.y - halfH &&
            state.y < obs.y + halfH
          ) {
            if (state.mode !== "backup" && state.mode !== "turn") {
              state.mode = "backup";
              state.timeInMode = 0;
            }
          }
        }

        // Add trail point
        trailRef.current.push({ x: state.x, y: state.y });
        if (trailRef.current.length > 500) {
          trailRef.current.shift();
        }
      }

      const w = canvas.width;
      const h = canvas.height;

      // Dark background
      ctx.fillStyle = "#090d16";
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
      ctx.fillText("IROBOT ROOMBA AUTONOMOUS COVERAGE & ESCAPE SIMULATOR", 20, 26);
      ctx.font = "11px monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(
        `US 6,594,844 • Subsumption Architecture • Mode: ${state.mode.toUpperCase()} • Speed: ${wheelSpeed.toFixed(2)} m/s • Coverage: ~${cleanedAreaPct}%`,
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

      // Scale factors: 5.0m mapped to aW, 3.2m mapped to aH
      const toScreenX = (rx: number) => aX + aW / 2 + (rx / 2.5) * (aW / 2 - 12);
      const toScreenY = (ry: number) => aY + aH / 2 - (ry / 1.6) * (aH / 2 - 12);

      // Cleaned Vacuum Trail Ribbon (Light blue swath)
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

      // Draw Furniture Obstacles
      for (const obs of ROOM_OBSTACLES) {
        const ox = toScreenX(obs.x);
        const oy = toScreenY(obs.y);
        const ow = (obs.w / 5.0) * aW;
        const oh = (obs.h / 3.2) * aH;

        ctx.fillStyle = "#334155";
        ctx.fillRect(ox - ow / 2, oy - oh / 2, ow, oh);
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(ox - ow / 2, oy - oh / 2, ow, oh);

        ctx.fillStyle = "#fde68a";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(obs.label, ox, oy + 3);
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

      ctx.restore();

      // ========================================================
      // 2. SUBSUMPTION BEHAVIOR TELEMETRY (Right Pane: x: 540 to 740, y: 65 to 325)
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
      ctx.fillText("SUBSUMPTION STATE", tX + 12, tY + 22);

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
      ctx.fillText("Active Mode Time:", tX + 12, statY + 68);
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 10px monospace";
      ctx.fillText(`${state.timeInMode.toFixed(2)} sec`, tX + 12, statY + 82);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [wheelSpeed, turnRate, isPlaying, cleanedAreaPct]);

  // Increment cleaned area slowly while active
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCleanedAreaPct((p) => Math.min(96, p + 1));
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="w-full flex flex-col gap-4 p-5 rounded-2xl bg-neutral-950 border border-neutral-800 text-neutral-100 shadow-xl">
      {/* Canvas */}
      <div className="relative w-full overflow-hidden rounded-xl border border-neutral-800 bg-[#090d16]">
        <canvas
          ref={canvasRef}
          width={760}
          height={340}
          className="w-full h-auto block aspect-[760/340]"
        />
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-neutral-900/70 border border-neutral-800/80 text-xs">
        {/* Drive Wheel Speed */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between font-mono text-neutral-300">
            <label htmlFor={speedId}>Differential Wheel Speed:</label>
            <span className="text-amber-400 font-bold">{wheelSpeed.toFixed(2)} m/s</span>
          </div>
          <input
            id={speedId}
            type="range"
            min="0.15"
            max="0.60"
            step="0.02"
            value={wheelSpeed}
            onChange={(e) => updateParam("wheelSpeedMps", parseFloat(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <span className="text-[10px] text-neutral-500">
            Linear velocity across floor driving Archimedean spiral and straight cruise modes
          </span>
        </div>

        {/* Turn Rate Rad/Sec */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between font-mono text-neutral-300">
            <label htmlFor={turnId}>Turn Angular Rate:</label>
            <span className="text-cyan-400 font-bold">{turnRate.toFixed(1)} rad/s</span>
          </div>
          <input
            id={turnId}
            type="range"
            min="1.0"
            max="4.0"
            step="0.2"
            value={turnRate}
            onChange={(e) => updateParam("turnRateRadSec", parseFloat(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <span className="text-[10px] text-neutral-500">
            Spin rate of differential drive wheels during obstacle collision deflection
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              trailRef.current = [];
              setCleanedAreaPct(5);
            }}
            className="px-3 py-1.5 rounded-lg font-mono text-xs font-semibold bg-neutral-900 border border-neutral-700 text-neutral-200 hover:bg-neutral-800 hover:text-white transition-all"
          >
            🧹 Clear Trail Ribbon
          </button>
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 rounded-lg font-mono text-xs font-semibold bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            {isPlaying ? "⏸ Pause Cleaner" : "▶ Resume Cleaner"}
          </button>
        </div>

        <span className="text-[11px] font-mono text-neutral-400">
          Navigation: <span className="text-indigo-400">Brooks Subsumption Architecture</span>
        </span>
      </div>
    </div>
  );
}
