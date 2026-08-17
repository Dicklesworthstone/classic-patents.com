"use client";

import { useState } from "react";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

export function LindeAirLiquefactionSim() {
  const { params, updateParam } = usePatentPhysics("us-727650-linde-air-liquefaction");
  const [activeTab, setActiveTab] = useState<"circuit" | "gradient">("circuit");

  const press = params.compressorPress ?? 200;
  const passes = params.regenPasses ?? 45;

  const coldK = Math.max(78, Math.round(293 - (passes / 50) * 215));
  const coldC = coldK - 273;
  const isLiq = coldK <= 80;
  const yieldPct = isLiq ? (((80 - (coldK - 78)) / 80) * 8.5).toFixed(1) : "0.0";
  const litersHr = ((press / 200) * Number(yieldPct) * 0.45).toFixed(2);

  return (
    <div className="w-full rounded-2xl bg-neutral-950 border border-neutral-800 p-6 text-neutral-100 shadow-2xl flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-500 animate-pulse" />
            <h3 className="text-lg font-semibold tracking-wide text-neutral-100">
              Carl Linde — Continuous Air Liquefaction Process
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            US Patent 727,650 · Isenthalpic Joule-Thomson Expansion & Counter-Current Heat Recovery
          </p>
        </div>
        <div className="flex rounded-lg bg-neutral-900 p-1 border border-neutral-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("circuit")}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === "circuit"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            1. Thermodynamic Liquefier Circuit
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("gradient")}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === "gradient"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            2. Heat Exchanger Gradient
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="relative w-full aspect-[16/9] min-h-[320px] rounded-xl bg-neutral-900/90 border border-neutral-800 overflow-hidden flex items-center justify-center p-6">
        {activeTab === "circuit" && (
          <svg viewBox="0 0 700 340" className="w-full h-full">
            <defs>
              <linearGradient id="exchangerGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>

            {/* 200-Bar Multi-Stage Compressor */}
            <g transform="translate(60, 60)">
              <rect
                x="0"
                y="0"
                width="120"
                height="90"
                rx="6"
                fill="#18181b"
                stroke="#71717a"
                strokeWidth="2"
              />
              <text
                x="10"
                y="25"
                fill="#38bdf8"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                COMPRESSOR
              </text>
              <text
                x="10"
                y="45"
                fill="#fbbf24"
                fontSize="13"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {press} bar
              </text>
              <text x="10" y="65" fill="#a1a1aa" fontSize="9" fontFamily="monospace">
                + Water Intercooler
              </text>
            </g>

            {/* High-Pressure Pipe to Heat Exchanger */}
            <line x1="180" y1="105" x2="300" y2="105" stroke="#ef4444" strokeWidth="4" />
            <text
              x="240"
              y="95"
              textAnchor="middle"
              fill="#ef4444"
              fontSize="9"
              fontFamily="monospace"
            >
              200 bar, 20°C
            </text>

            {/* Counter-Current Regenerative Coaxial Column */}
            <g transform="translate(300, 40)">
              <rect
                x="0"
                y="0"
                width="100"
                height="220"
                rx="8"
                fill="#18181b"
                stroke="#52525b"
                strokeWidth="2"
              />
              {/* Coaxial Heat Exchanger Helical Pipe */}
              <rect
                x="15"
                y="10"
                width="70"
                height="200"
                rx="4"
                fill="url(#exchangerGrad)"
                opacity="0.4"
              />
              <text
                x="50"
                y="115"
                textAnchor="middle"
                fill="#e4e4e7"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                COUNTER-
              </text>
              <text
                x="50"
                y="130"
                textAnchor="middle"
                fill="#e4e4e7"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                CURRENT
              </text>
              <text
                x="50"
                y="145"
                textAnchor="middle"
                fill="#e4e4e7"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                COLUMN
              </text>
            </g>

            {/* Joule-Thomson Expansion Needle Valve */}
            <g transform="translate(330, 255)">
              <polygon points="20,0 0,25 40,25" fill="#fbbf24" stroke="#78350f" />
              <text
                x="50"
                y="18"
                fill="#fbbf24"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                JT THROTTLE
              </text>
              <text x="50" y="32" fill="#38bdf8" fontSize="9" fontFamily="monospace">
                ΔP = {press - 20} bar
              </text>
            </g>

            {/* Cold Return Vapor Line */}
            <path
              d="M 385 240 L 440 240 L 440 60 L 385 60"
              fill="none"
              stroke="#0284c7"
              strokeWidth="3"
              strokeDasharray="6 3"
            />
            <text
              x="490"
              y="150"
              textAnchor="middle"
              fill="#0284c7"
              fontSize="9"
              fontFamily="monospace"
            >
              -190°C RETURN VAPOR
            </text>

            {/* Vacuum Dewar Flask Collecting Liquid Air */}
            <g transform="translate(300, 280)">
              <rect
                x="10"
                y="0"
                width="80"
                height="45"
                rx="6"
                fill="#18181b"
                stroke="#0284c7"
                strokeWidth="2"
              />
              {isLiq && (
                <rect
                  x="14"
                  y="15"
                  width="72"
                  height="26"
                  rx="4"
                  fill="#38bdf8"
                  fillOpacity="0.7"
                  className="animate-pulse"
                />
              )}
              <text
                x="50"
                y="30"
                textAnchor="middle"
                fill="#fff"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {isLiq ? "LIQUID AIR (80 K)" : "EMPTY"}
              </text>
            </g>

            {/* Thermodynamic State Readout HUD */}
            <g transform="translate(520, 40)">
              <rect x="0" y="0" width="160" height="85" rx="6" fill="#18181b" stroke="#3f3f46" />
              <text x="10" y="20" fill="#a1a1aa" fontSize="10" fontFamily="monospace">
                NOZZLE CRYOTEMP:
              </text>
              <text
                x="10"
                y="40"
                fill={isLiq ? "#4ade80" : "#38bdf8"}
                fontSize="14"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {coldC} °C ({coldK} K)
              </text>
              <text x="10" y="60" fill="#fbbf24" fontSize="10" fontFamily="monospace">
                YIELD: {yieldPct}% ({litersHr} L/hr)
              </text>
              <text
                x="10"
                y="75"
                fill={isLiq ? "#4ade80" : "#a1a1aa"}
                fontSize="9"
                fontFamily="monospace"
              >
                {isLiq ? "● CONDENSING LIQUID" : "○ PRECOOLING GAS"}
              </text>
            </g>
          </svg>
        )}

        {activeTab === "gradient" && (
          <svg viewBox="0 0 600 320" className="w-full h-full">
            {/* Temperature Gradient Chart */}
            <line x1="80" y1="260" x2="520" y2="260" stroke="#71717a" strokeWidth="2" />
            <line x1="80" y1="260" x2="80" y2="40" stroke="#71717a" strokeWidth="2" />
            <text x="530" y="265" fill="#a1a1aa" fontSize="11" fontFamily="monospace">
              Column Position (Top to Bottom)
            </text>
            <text x="70" y="35" fill="#a1a1aa" fontSize="11" fontFamily="monospace">
              Temperature (K)
            </text>

            {/* Incoming Gas Line (Red to Blue) */}
            <path
              d="M 100 80 C 200 120, 350 200, 500 245"
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
            />
            <text x="240" y="110" fill="#ef4444" fontSize="10" fontFamily="monospace">
              Incoming 200-bar Air (293 K → {coldK} K)
            </text>

            {/* Return Gas Line (Blue to Red) */}
            <path
              d="M 100 95 C 200 135, 350 215, 500 255"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3"
              strokeDasharray="4 2"
            />
            <text x="320" y="210" fill="#38bdf8" fontSize="10" fontFamily="monospace">
              Return Cold Vapor (78 K → 285 K)
            </text>

            {/* Condensation Line at 80 K */}
            <line
              x1="80"
              y1="245"
              x2="520"
              y2="245"
              stroke="#22c55e"
              strokeWidth="1.5"
              strokeDasharray="6 3"
            />
            <text
              x="440"
              y="235"
              fill="#22c55e"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
            >
              Air Condensation (80 K / -193°C)
            </text>
          </svg>
        )}
      </div>

      {/* Physics Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900/50 p-4 rounded-xl border border-neutral-800">
        <div>
          <div className="flex justify-between text-xs font-mono text-neutral-300 mb-1.5">
            <span>Compressor Pressure</span>
            <span className="text-cyan-400 font-bold">{press} bar (2,900 psi)</span>
          </div>
          <input
            type="range"
            min={100}
            max={220}
            step={5}
            value={press}
            onChange={(e) => updateParam("compressorPress", Number(e.target.value))}
            className="w-full accent-cyan-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono text-neutral-300 mb-1.5">
            <span>Regenerator Exchanger Cycles</span>
            <span className="text-amber-400 font-bold">
              {passes} passes ({coldC}°C)
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={50}
            step={2}
            value={passes}
            onChange={(e) => updateParam("regenPasses", Number(e.target.value))}
            className="w-full accent-amber-500"
          />
        </div>
      </div>
    </div>
  );
}
