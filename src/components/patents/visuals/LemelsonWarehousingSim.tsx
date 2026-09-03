"use client";

import { Cpu, Gauge, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import {
  readLemelsonWarehousingControls,
  stepLemelsonWarehousingSi,
} from "@/physics/lemelsonWarehousingKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

/** @deprecated The dispatcher uses the source-bounded normalized exhibit instead. */
export default function LemelsonWarehousingSim() {
  const { params, updateParam } = usePatentPhysics("us-3119501-lemelson-automatic-warehousing");

  const [isRunning] = useState(true);
  const [simTime, setSimTime] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSimTime((t) => t + 0.033);
    }, 33);
    return () => clearInterval(interval);
  }, [isRunning]);

  const kernelControls = readLemelsonWarehousingControls(params);
  const tel = stepLemelsonWarehousingSi(kernelControls, simTime);

  // SVG grid dimensions
  const svgWidth = 800;
  const svgHeight = 460;
  const originX = 70;
  const originY = 380;
  const colSpacing = 65;
  const rowSpacing = 50;
  const totalCols = 10;
  const totalRows = 6;

  // Carriage and elevator pixel coordinates
  const carriagePixelX =
    originX + (tel.carriageX / (kernelControls.bayWidth * 10)) * (totalCols * colSpacing);
  const elevatorPixelY =
    originY - (tel.elevatorZ / (kernelControls.shelfHeight * 6)) * (totalRows * rowSpacing);
  const forkPixelWidth = 25 + (tel.forkY / 0.85) * 45;

  return (
    <div className="flex flex-col w-full bg-stone-950 text-stone-100 rounded-xl border border-stone-800 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
              ASRS Kinematic Instrument • US 3,119,501
            </span>
          </div>
          <h3 className="text-xl font-serif font-bold text-stone-100 mt-1">
            Lemelson 3-Axis Automated Storage & Retrieval Machine
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSimTime(0)}
            className="flex items-center gap-1 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 border border-stone-700 rounded text-xs font-mono text-stone-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Time
          </button>
        </div>
      </div>

      {/* Main SVG Schematic Visual */}
      <div className="relative w-full aspect-[16/9] bg-stone-900/60 rounded-lg border border-stone-800/80 overflow-hidden flex items-center justify-center p-2">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full select-none">
          <defs>
            {/* Background Grid Pattern */}
            <pattern id="aisleGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#292524" strokeWidth="0.5" />
            </pattern>
            {/* Retroreflective Marker Glow */}
            <filter id="markerGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Optical Scanner Beam Gradient */}
            <linearGradient id="scannerBeam" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Background Grid */}
          <rect width={svgWidth} height={svgHeight} fill="url(#aisleGrid)" />

          {/* Overhead I-Beam Guide Track 21 */}
          <rect
            x="50"
            y="45"
            width="700"
            height="14"
            fill="#44403c"
            stroke="#78716c"
            strokeWidth="1.5"
            rx="2"
          />
          <line
            x1="50"
            y1="52"
            x2="750"
            y2="52"
            stroke="#a8a29e"
            strokeWidth="1"
            strokeDasharray="6 4"
          />
          <text x="60" y="38" fill="#a8a29e" fontSize="10" fontFamily="monospace">
            OVERHEAD GUIDE TRACK 21 & CONDUCTOR RAILS 40, 41
          </text>

          {/* Warehouse Floor Foundation */}
          <rect
            x="50"
            y="385"
            width="700"
            height="8"
            fill="#292524"
            stroke="#44403c"
            strokeWidth="1"
          />
          <line x1="50" y1="385" x2="750" y2="385" stroke="#78716c" strokeWidth="2" />

          {/* Multi-Tier Storage Rack Grid 50 */}
          {Array.from({ length: totalCols + 1 }).map((_, c) => {
            const bx = originX + c * colSpacing;
            return (
              <g key={`col-${c}`}>
                {/* Vertical Upright Beams 51 */}
                <line x1={bx} y1="60" x2={bx} y2="385" stroke="#57534e" strokeWidth="2.5" />
                {/* Retroreflective Scotch-Lite Marker 56 */}
                <rect
                  x={bx - 4}
                  y="55"
                  width="8"
                  height="5"
                  fill={Math.abs(carriagePixelX - bx) < 18 ? "#fbbf24" : "#78716c"}
                  filter={Math.abs(carriagePixelX - bx) < 18 ? "url(#markerGlow)" : undefined}
                />
                <text x={bx - 8} y="405" fill="#78716c" fontSize="9" fontFamily="monospace">
                  C{c + 1}
                </text>
              </g>
            );
          })}

          {/* Horizontal Shelf Beams 52 */}
          {Array.from({ length: totalRows + 1 }).map((_, r) => {
            const by = originY - r * rowSpacing;
            return (
              <g key={`row-${r}`}>
                <line
                  x1={originX}
                  y1={by}
                  x2={originX + totalCols * colSpacing}
                  y2={by}
                  stroke="#44403c"
                  strokeWidth="2"
                />
                {/* Level Marker */}
                <rect
                  x={originX - 12}
                  y={by - 3}
                  width="6"
                  height="6"
                  fill={Math.abs(elevatorPixelY - by) < 14 ? "#38bdf8" : "#57534e"}
                  filter={Math.abs(elevatorPixelY - by) < 14 ? "url(#markerGlow)" : undefined}
                />
                <text
                  x={originX - 30}
                  y={by + 3}
                  fill="#78716c"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  L{r + 1}
                </text>
              </g>
            );
          })}

          {/* Pallets in Shelves */}
          {Array.from({ length: totalCols }).map((_, c) =>
            Array.from({ length: totalRows }).map((_, r) => {
              // Draw some static pallets
              if (
                (c * 3 + r * 7) % 5 === 0 &&
                !(c + 1 === kernelControls.targetBayX && r + 1 === kernelControls.targetShelfZ)
              ) {
                const px = originX + c * colSpacing + 12;
                const py = originY - r * rowSpacing - 22;
                return (
                  <g key={`pallet-${c}-${r}`}>
                    <rect
                      x={px}
                      y={py}
                      width="40"
                      height="20"
                      fill="#78350f"
                      stroke="#b45309"
                      strokeWidth="1"
                      rx="2"
                    />
                    <line
                      x1={px}
                      y1={py + 15}
                      x2={px + 40}
                      y2={py + 15}
                      stroke="#d97706"
                      strokeWidth="1"
                    />
                    <circle cx={px + 20} cy={py + 8} r="3" fill="#d97706" />
                  </g>
                );
              }
              return null;
            }),
          )}

          {/* Target Bay Highlighting */}
          <rect
            x={originX + (kernelControls.targetBayX - 1) * colSpacing + 2}
            y={originY - kernelControls.targetShelfZ * rowSpacing + 2}
            width={colSpacing - 4}
            height={rowSpacing - 4}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            rx="3"
          />

          {/* Stacker Crane Mast Assembly 20 */}
          {/* Overhead Carriage 22 */}
          <g transform={`translate(${carriagePixelX}, 0)`}>
            <rect
              x="-24"
              y="40"
              width="48"
              height="20"
              fill="#1c1917"
              stroke="#fbbf24"
              strokeWidth="1.5"
              rx="3"
            />
            {/* Wheels 35 riding on track */}
            <circle cx="-14" cy="42" r="5" fill="#a8a29e" stroke="#292524" strokeWidth="1.5" />
            <circle cx="14" cy="42" r="5" fill="#a8a29e" stroke="#292524" strokeWidth="1.5" />
            {/* Motor Mx */}
            <rect
              x="-10"
              y="26"
              width="20"
              height="14"
              fill="#0284c7"
              stroke="#38bdf8"
              strokeWidth="1"
              rx="2"
            />
            <text
              x="-7"
              y="36"
              fill="#f0f9ff"
              fontSize="7"
              fontFamily="monospace"
              fontWeight="bold"
            >
              Mx
            </text>

            {/* Photoelectric Scanner 37' on Track */}
            <rect
              x="18"
              y="44"
              width="8"
              height="10"
              fill="#ef4444"
              stroke="#fca5a5"
              strokeWidth="1"
            />
            {tel.markerPulseActive && (
              <line
                x1="22"
                y1="44"
                x2="22"
                y2="58"
                stroke="#facc15"
                strokeWidth="2"
                filter="url(#markerGlow)"
              />
            )}

            {/* Vertical Subtending Mast Column 23 */}
            <line x1="-8" y1="60" x2="-8" y2="385" stroke="#78716c" strokeWidth="3.5" />
            <line x1="8" y1="60" x2="8" y2="385" stroke="#78716c" strokeWidth="3.5" />
            {/* Mast Truss Bracing */}
            {Array.from({ length: 12 }).map((_, i) => (
              <line
                key={`truss-${i}`}
                x1={i % 2 === 0 ? -8 : 8}
                y1={70 + i * 25}
                x2={i % 2 === 0 ? 8 : -8}
                y2={95 + i * 25}
                stroke="#57534e"
                strokeWidth="1.5"
              />
            ))}
            {/* Drive Chain 29 */}
            <line
              x1="0"
              y1="60"
              x2="0"
              y2="380"
              stroke="#d6d3d1"
              strokeWidth="1"
              strokeDasharray="3 2"
            />

            {/* Hoist Motor Mz at Mast Base */}
            <rect
              x="-14"
              y="360"
              width="28"
              height="22"
              fill="#0284c7"
              stroke="#38bdf8"
              strokeWidth="1"
              rx="2"
            />
            <text
              x="-9"
              y="374"
              fill="#f0f9ff"
              fontSize="8"
              fontFamily="monospace"
              fontWeight="bold"
            >
              Mz
            </text>
          </g>

          {/* Elevator Carriage 25 & Telescopic Fork 27 */}
          <g transform={`translate(${carriagePixelX}, ${elevatorPixelY})`}>
            {/* Elevator Body 25 */}
            <rect
              x="-20"
              y="-18"
              width="40"
              height="36"
              fill="#292524"
              stroke="#38bdf8"
              strokeWidth="1.5"
              rx="3"
            />
            {/* Guide Rollers */}
            <circle cx="-16" cy="-12" r="3.5" fill="#78716c" />
            <circle cx="-16" cy="12" r="3.5" fill="#78716c" />
            <circle cx="16" cy="-12" r="3.5" fill="#78716c" />
            <circle cx="16" cy="12" r="3.5" fill="#78716c" />

            {/* Transfer Motor My */}
            <rect
              x="-14"
              y="-12"
              width="16"
              height="14"
              fill="#16a34a"
              stroke="#4ade80"
              strokeWidth="1"
              rx="2"
            />
            <text
              x="-12"
              y="-2"
              fill="#f0fdf4"
              fontSize="7"
              fontFamily="monospace"
              fontWeight="bold"
            >
              My
            </text>

            {/* Photoelectric Scanner 37 (Vertical Mast Scanning) */}
            <circle cx="-18" cy="0" r="4" fill="#ef4444" stroke="#fca5a5" strokeWidth="1" />
            {tel.markerPulseActive && (
              <line
                x1="-18"
                y1="0"
                x2="-35"
                y2="0"
                stroke="#38bdf8"
                strokeWidth="2"
                filter="url(#markerGlow)"
              />
            )}

            {/* Extendable Lateral Fork Assembly 27 */}
            <rect
              x="12"
              y="2"
              width={forkPixelWidth}
              height="6"
              fill="#fbbf24"
              stroke="#d97706"
              strokeWidth="1"
              rx="1"
            />
            <rect
              x={12 + forkPixelWidth - 6}
              y="-10"
              width="6"
              height="14"
              fill="#d97706"
              stroke="#b45309"
              strokeWidth="1"
            />

            {/* Carried Pallet Load 54 */}
            {(tel.cyclePhase === 3 || tel.cyclePhase === 4 || tel.cyclePhase === 5) && (
              <g transform={`translate(${14 + forkPixelWidth * 0.4}, -22)`}>
                <rect
                  x="-18"
                  y="0"
                  width="36"
                  height="20"
                  fill="#b45309"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  rx="2"
                />
                <line x1="-18" y1="14" x2="18" y2="14" stroke="#d97706" strokeWidth="1" />
                <text x="-12" y="11" fill="#fef3c7" fontSize="7" fontFamily="monospace">
                  PALLET
                </text>
              </g>
            )}
          </g>

          {/* HUD Overlay in SVG */}
          <g transform="translate(560, 75)">
            <rect
              width="215"
              height="120"
              fill="#1c1917"
              stroke="#44403c"
              strokeWidth="1.5"
              rx="6"
              opacity="0.92"
            />
            <text
              x="12"
              y="20"
              fill="#fbbf24"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
            >
              PREDETERMINING COUNTER RELAYS
            </text>
            <line x1="12" y1="26" x2="203" y2="26" stroke="#44403c" strokeWidth="1" />

            <text x="12" y="44" fill="#a8a29e" fontSize="9" fontFamily="monospace">
              PrCx (Aisle Col):
            </text>
            <text
              x="135"
              y="44"
              fill="#38bdf8"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {tel.counterPrCx} counts
            </text>

            <text x="12" y="62" fill="#a8a29e" fontSize="9" fontFamily="monospace">
              PrCz (Shelf Tier):
            </text>
            <text
              x="135"
              y="62"
              fill="#4ade80"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {tel.counterPrCz} counts
            </text>

            <text x="12" y="80" fill="#a8a29e" fontSize="9" fontFamily="monospace">
              Optical Relay:
            </text>
            <text
              x="135"
              y="80"
              fill={tel.markerPulseActive ? "#fbbf24" : "#78716c"}
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {tel.markerPulseActive ? "TRIGGERED (38')" : "SCANNING"}
            </text>

            <text x="12" y="98" fill="#a8a29e" fontSize="9" fontFamily="monospace">
              Sequential CD:
            </text>
            <text
              x="110"
              y="98"
              fill="#f43f5e"
              fontSize="8.5"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {tel.activeMotor}
            </text>
          </g>
        </svg>
      </div>

      {/* Real-Time Telemetry Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-stone-900/90 border border-stone-800 p-3 rounded-lg flex flex-col justify-between">
          <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider">
            Carriage Position X
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-mono font-bold text-cyan-400">
              {tel.carriageX.toFixed(2)} m
            </span>
            <span className="text-xs font-mono text-stone-500">
              Bay {Math.round(tel.carriageX / kernelControls.bayWidth)}
            </span>
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-3 rounded-lg flex flex-col justify-between">
          <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider">
            Elevator Height Z
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-mono font-bold text-emerald-400">
              {tel.elevatorZ.toFixed(2)} m
            </span>
            <span className="text-xs font-mono text-stone-500">
              Tier {Math.round(tel.elevatorZ / kernelControls.shelfHeight)}
            </span>
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-3 rounded-lg flex flex-col justify-between">
          <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider">
            Fork Reach Y
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-mono font-bold text-amber-400">
              {(tel.forkY * 1000).toFixed(0)} mm
            </span>
            <span className="text-xs font-mono text-stone-500">
              {tel.forkY > 0.1 ? "EXTENDED" : "RETRACTED"}
            </span>
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-3 rounded-lg flex flex-col justify-between">
          <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider">
            Mechanical Drive Power
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-mono font-bold text-rose-400">
              {tel.mechanicalPowerWatts.toFixed(0)} W
            </span>
            <span className="text-xs font-mono text-stone-500">
              {tel.totalPalletsHandled} pallets
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="bg-stone-900/60 border border-stone-800/80 rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
          <Gauge className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono uppercase tracking-wider text-stone-300 font-bold">
            Dial Programmer & Kinematic Controls (FIG. 6)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Target Column X */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-stone-400">Target Bay (Col X):</span>
              <span className="text-amber-400 font-bold">Bay {kernelControls.targetBayX}</span>
            </div>
            <input
              type="range"
              aria-label="Target warehouse bay column"
              min="1"
              max="10"
              step="1"
              value={kernelControls.targetBayX}
              onChange={(e) => updateParam("targetBayX", Number(e.target.value))}
              className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Target Shelf Level Z */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-stone-400">Target Level (Tier Z):</span>
              <span className="text-amber-400 font-bold">Tier {kernelControls.targetShelfZ}</span>
            </div>
            <input
              type="range"
              aria-label="Target warehouse shelf tier"
              min="1"
              max="6"
              step="1"
              value={kernelControls.targetShelfZ}
              onChange={(e) => updateParam("targetShelfZ", Number(e.target.value))}
              className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Traverse Speed */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-stone-400">Traverse Speed (Mx):</span>
              <span className="text-cyan-400 font-bold">
                {kernelControls.traverseSpeed.toFixed(1)} m/s
              </span>
            </div>
            <input
              type="range"
              aria-label="Warehouse traverse speed in meters per second"
              min="0.4"
              max="2.5"
              step="0.1"
              value={kernelControls.traverseSpeed}
              onChange={(e) => updateParam("traverseSpeed", Number(e.target.value))}
              className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Payload Mass */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-stone-400">Pallet Load Mass:</span>
              <span className="text-emerald-400 font-bold">{kernelControls.payloadMass} kg</span>
            </div>
            <input
              type="range"
              aria-label="Pallet load mass in kilograms"
              min="50"
              max="800"
              step="25"
              value={kernelControls.payloadMass}
              onChange={(e) => updateParam("payloadMass", Number(e.target.value))}
              className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
