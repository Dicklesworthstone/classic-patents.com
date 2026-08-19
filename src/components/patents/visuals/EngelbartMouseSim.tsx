"use client";

import { MousePointer, Move, RotateCcw, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { engelbartRadiusFromDiameterMm, stepEngelbartMouse } from "@/physics/catalogKernels";
import { stepEngelbartResolver } from "@/physics/machineKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

export function EngelbartMouseSim() {
  const { params, updateParam } = usePatentPhysics("us-3541541-engelbart-mouse");
  const [posX, setPosX] = useState<number>(180);
  const [posY, setPosY] = useState<number>(140);
  const isDraggingRef = useRef(false);
  const [pulseCountX, setPulseCountX] = useState<number>(0);
  const [pulseCountY, setPulseCountY] = useState<number>(0);
  const wheelRadius = params.wheelRadius ?? 10.0;
  const pulsesPerRev = params.pulsesPerRev ?? 200;
  const mouse = stepEngelbartMouse({
    mouseSpeed: params.mouseSpeed ?? 350,
    wheelRadius,
    pulsesPerRev,
  });
  const wheelDiameterMm = mouse.wheelDiameterMm;
  const resolutionMmPerPulse = mouse.mmPerPulse;

  const prevPosRef = useRef<{ x: number; y: number }>({ x: posX, y: posY });
  const containerRef = useRef<SVGSVGElement>(null);

  const handlePointerDown = () => {
    isDraggingRef.current = true;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const svgX = Math.max(30, Math.min(370, ((e.clientX - rect.left) / rect.width) * 400));
    const svgY = Math.max(30, Math.min(270, ((e.clientY - rect.top) / rect.height) * 300));

    const dx = svgX - prevPosRef.current.x;
    const dy = svgY - prevPosRef.current.y;

    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      const rolled = stepEngelbartResolver(dx, dy, wheelRadius, pulsesPerRev);
      setPosX(svgX);
      setPosY(svgY);
      setPulseCountX((prev) => prev + rolled.pulsesX);
      setPulseCountY((prev) => prev + rolled.pulsesY);
      prevPosRef.current = { x: svgX, y: svgY };
    }
  };

  const resetPosition = () => {
    setPosX(180);
    setPosY(140);
    setPulseCountX(0);
    setPulseCountY(0);
    prevPosRef.current = { x: 180, y: 140 };
  };

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <MousePointer className="w-5 h-5 text-amber-600 dark:text-amber-500 animate-pulse" />
            <h3 className="font-serif text-lg sm:text-xl font-bold text-ink-900 dark:text-parchment-100">
              Engelbart Orthogonal Wheel Position Indicator (US 3,541,541)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-1">
            Drag the mouse carriage below to observe the two perpendicular knife-edge wheels resolve
            2D planar motion into independent X and Y pulse trains.
          </p>
        </div>

        <button
          type="button"
          onClick={resetPosition}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 bg-white/80 dark:bg-ink-900/80 text-xs font-mono text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Origin</span>
        </button>
      </div>

      {/* Interactive 2D Vector Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Mechanical Viewport */}
        <div className="lg:col-span-2 relative bg-parchment-100/60 dark:bg-ink-900/60 rounded-xl border border-parchment-300 dark:border-ink-800 p-4 flex flex-col items-center justify-center min-h-[340px] overflow-hidden select-none">
          <div className="absolute top-3 left-3 text-[11px] font-mono text-ink-500 dark:text-ink-400 flex items-center gap-1.5">
            <Move className="w-3.5 h-3.5 text-amber-600" />
            <span>Interactive Table Surface (Drag wooden chassis)</span>
          </div>

          <svg
            ref={containerRef}
            viewBox="0 0 400 300"
            className="w-full max-w-[500px] h-auto cursor-grab active:cursor-grabbing touch-none"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onPointerMove={handlePointerMove}
          >
            {/* Grid Pattern */}
            <defs>
              <pattern id="mouseGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-parchment-300 dark:text-ink-800"
                />
              </pattern>
            </defs>
            <rect width="400" height="300" fill="url(#mouseGrid)" />

            {/* Mouse Tracking Trails */}
            <line
              x1="0"
              y1={posY}
              x2="400"
              y2={posY}
              stroke="rgba(217, 119, 6, 0.3)"
              strokeDasharray="4,4"
              strokeWidth="1"
            />
            <line
              x1={posX}
              y1="0"
              x2={posX}
              y2="300"
              stroke="rgba(217, 119, 6, 0.3)"
              strokeDasharray="4,4"
              strokeWidth="1"
            />

            {/* Wooden Chassis (Engelbart 1964 Design) */}
            <g transform={`translate(${posX - 60}, ${posY - 45})`}>
              {/* Outer Wood Block */}
              <rect
                x="0"
                y="0"
                width="120"
                height="90"
                rx="8"
                className="fill-amber-800/80 dark:fill-amber-950/90 stroke-amber-900 dark:stroke-amber-700"
                strokeWidth="2"
              />
              {/* Wood Grain Accent */}
              <path
                d="M 10 15 Q 60 25 110 15 M 10 45 Q 60 55 110 45 M 10 75 Q 60 85 110 75"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1"
              />

              {/* Red Microswitch Button */}
              <rect
                x="95"
                y="10"
                width="16"
                height="14"
                rx="3"
                className="fill-red-600 stroke-red-800"
                strokeWidth="1.5"
              />

              {/* Cord Leading Out */}
              <path
                d="M 60 90 Q 60 110 80 130"
                fill="none"
                stroke="#475569"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Internal Orthogonal Wheels (X-Wheel & Y-Wheel) */}
              {/* X-Wheel (Horizontal Motion) */}
              <g transform="translate(30, 20)">
                <rect
                  x="0"
                  y="0"
                  width="18"
                  height="45"
                  rx="2"
                  className="fill-slate-700 stroke-slate-900 dark:fill-slate-400 dark:stroke-slate-200"
                  strokeWidth="1.5"
                />
                <line x1="9" y1="-5" x2="9" y2="50" className="stroke-amber-400" strokeWidth="2" />
                <circle cx="9" cy="22.5" r="3" className="fill-amber-500" />
                <text x="22" y="26" className="text-[8px] fill-amber-300 font-mono font-bold">
                  X-Wheel
                </text>
              </g>

              {/* Y-Wheel (Perpendicular Knife-Edge Motion) */}
              <g transform="translate(55, 60)">
                <rect
                  x="0"
                  y="0"
                  width="45"
                  height="18"
                  rx="2"
                  className="fill-slate-700 stroke-slate-900 dark:fill-slate-400 dark:stroke-slate-200"
                  strokeWidth="1.5"
                />
                <line x1="-5" y1="9" x2="50" y2="9" className="stroke-cyan-400" strokeWidth="2" />
                <circle cx="22.5" cy="9" r="3" className="fill-cyan-500" />
                <text x="12" y="-4" className="text-[8px] fill-cyan-300 font-mono font-bold">
                  Y-Wheel
                </text>
              </g>
            </g>

            {/* Coordinate Overlay Marker */}
            <circle cx={posX} cy={posY} r="4" className="fill-amber-500 animate-ping" />
            <circle
              cx={posX}
              cy={posY}
              r="3"
              className="fill-amber-600 stroke-white"
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* Telemetry & Potentiometer Pulse Display */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white/90 dark:bg-ink-900/90 border border-parchment-300 dark:border-ink-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400">
                Orthogonal Telemetry
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-parchment-100 dark:bg-ink-800/60 border border-parchment-200 dark:border-ink-700">
                <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
                  X-Axis Position
                </span>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  {posX.toFixed(1)} px
                </span>
                <span className="text-[10px] text-ink-500 block mt-0.5">{pulseCountX} Pulses</span>
              </div>
              <div className="p-2.5 rounded-lg bg-parchment-100 dark:bg-ink-800/60 border border-parchment-200 dark:border-ink-700">
                <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
                  Y-Axis Position
                </span>
                <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
                  {posY.toFixed(1)} px
                </span>
                <span className="text-[10px] text-ink-500 block mt-0.5">{pulseCountY} Pulses</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-parchment-200 dark:border-ink-800 text-xs font-sans text-ink-700 dark:text-ink-300">
              <div className="flex justify-between">
                <span>Wheel Diameter:</span>
                <span className="font-mono font-bold">{wheelDiameterMm} mm</span>
              </div>
              <div className="flex justify-between">
                <span>Resolution / Pulse:</span>
                <span className="font-mono font-bold">{resolutionMmPerPulse.toFixed(2)} mm</span>
              </div>
              <div className="flex justify-between">
                <span>Counts / mm:</span>
                <span className="font-mono font-bold">{mouse.countsPerMm}</span>
              </div>
              <div className="flex justify-between">
                <span>Pulse train:</span>
                <span className="font-mono font-bold">{mouse.pulseRateHz} Hz</span>
              </div>
              <div className="flex justify-between">
                <span>Click dwell:</span>
                <span className="font-mono font-bold">{mouse.clickDisplayMs} ms</span>
              </div>
            </div>
          </div>

          {/* Mechanical Controls */}
          <div className="p-4 rounded-xl bg-white/90 dark:bg-ink-900/90 border border-parchment-300 dark:border-ink-800 shadow-sm space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400 block">
              Encoder Calibration
            </span>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-ink-700 dark:text-ink-300">Disc Pulses / Rev:</span>
                <span className="font-mono font-bold text-amber-600">{pulsesPerRev}</span>
              </div>
              <input
                type="range"
                aria-label="Disc Pulses / Rev"
                min="20"
                max="400"
                step="4"
                value={pulsesPerRev}
                onChange={(e) => updateParam("pulsesPerRev", Number(e.target.value))}
                className="w-full accent-amber-600"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-ink-700 dark:text-ink-300">Knife Wheel Dia:</span>
                <span className="font-mono font-bold text-amber-600">
                  {wheelDiameterMm.toFixed(1)} mm
                </span>
              </div>
              <input
                type="range"
                aria-label="Knife Wheel Dia"
                min="12"
                max="36"
                step="1"
                value={wheelDiameterMm}
                onChange={(e) =>
                  updateParam("wheelRadius", engelbartRadiusFromDiameterMm(Number(e.target.value)))
                }
                className="w-full accent-amber-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
