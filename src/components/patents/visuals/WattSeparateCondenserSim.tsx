"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import {
  stepWattCondenser,
  WATT_DEFAULT_CONTROLS,
  type WattCondenserControls,
} from "@/physics/wattCondenserKernel";

export function WattSeparateCondenserSim() {
  const { params, updateParam } = usePatentPhysics("gb-913-watt-separate-condenser");
  const controls: WattCondenserControls = useMemo(
    () => ({
      boilerPressurePsi: params.boilerPressurePsi ?? WATT_DEFAULT_CONTROLS.boilerPressurePsi,
      condenserTempC: params.condenserTempC ?? WATT_DEFAULT_CONTROLS.condenserTempC,
      cylinderBoreInches: params.cylinderBoreInches ?? WATT_DEFAULT_CONTROLS.cylinderBoreInches,
      pistonStrokeFeet: params.pistonStrokeFeet ?? WATT_DEFAULT_CONTROLS.pistonStrokeFeet,
      strokesPerMinute: params.strokesPerMinute ?? WATT_DEFAULT_CONTROLS.strokesPerMinute,
      hasSeparateCondenser:
        (params.hasSeparateCondenser ?? 1) > 0.5
          ? true
          : (params.hasSeparateCondenser ?? 1) === 0
            ? false
            : WATT_DEFAULT_CONTROLS.hasSeparateCondenser,
    }),
    [params],
  );
  const [animTime, setAnimTime] = useState(0);

  const boilerId = useId();
  const condTempId = useId();
  const boreId = useId();
  const spmId = useId();

  // Run animation loop
  useEffect(() => {
    let frameId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      setAnimTime((prev) => prev + dt);
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const outputs = useMemo(() => stepWattCondenser(controls), [controls]);

  const cyclePhase = (animTime * outputs.cycleOmegaRadPerS) % (2 * Math.PI);
  // Piston stroke position [-1, 1]
  const pistonPos = Math.sin(cyclePhase);
  const isExhaustStroke = Math.cos(cyclePhase) > 0;
  const beamAngleDeg = -pistonPos * 12.0;

  return (
    <div className="w-full bg-stone-900/95 border border-stone-800 rounded-2xl p-6 text-stone-200 shadow-2xl backdrop-blur-xl">
      {/* Header & Mode Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-mono font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              GB 913 (1769)
            </span>
            <span className="text-xs font-mono text-stone-400">
              Rankine Power Cycle &amp; Condensation Dynamics
            </span>
          </div>
          <h3 className="text-xl font-bold text-stone-100 mt-1">
            Watt Separate Condenser Engine Simulator
          </h3>
        </div>

        <div className="flex items-center gap-2 bg-stone-950/80 p-1.5 rounded-xl border border-stone-800">
          <button
            type="button"
            onClick={() => updateParam("hasSeparateCondenser", 1)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              controls.hasSeparateCondenser
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            Watt Engine (1769)
          </button>
          <button
            type="button"
            onClick={() => updateParam("hasSeparateCondenser", 0)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              !controls.hasSeparateCondenser
                ? "bg-rose-600 text-white shadow-lg shadow-rose-900/30"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            Newcomen Engine (1712)
          </button>
        </div>
      </div>

      {/* Main Visual Stage & PV Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
        {/* Animated Machine Schematic SVG */}
        <div className="lg:col-span-8 bg-stone-950 rounded-xl p-4 border border-stone-800/80 relative overflow-hidden flex items-center justify-center min-h-[380px]">
          <svg viewBox="0 0 800 480" className="w-full h-auto max-h-[420px]">
            <defs>
              <linearGradient id="fireGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="steamGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={controls.hasSteamJacket ? "#f59e0b" : "#94a3b8"}
                  stopOpacity="0.7"
                />
                <stop
                  offset="100%"
                  stopColor={controls.hasSteamJacket ? "#ef4444" : "#64748b"}
                  stopOpacity="0.3"
                />
              </linearGradient>
              <linearGradient id="cisternGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0369a1" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Mason Wall */}
            <rect
              x="360"
              y="80"
              width="80"
              height="380"
              fill="#292524"
              stroke="#44403c"
              strokeWidth="2"
            />
            <path
              d="M360 120 h80 M360 160 h80 M360 200 h80 M360 240 h80 M360 280 h80 M360 320 h80 M360 360 h80 M360 400 h80 M360 440 h80"
              stroke="#57534e"
              strokeWidth="1"
            />

            {/* Walking Beam H */}
            <g transform={`rotate(${beamAngleDeg}, 400, 90)`}>
              {/* Oak Beam Body */}
              <polygon
                points="120,80 400,65 680,80 670,105 400,95 130,105"
                fill="#78350f"
                stroke="#451a03"
                strokeWidth="2"
              />
              {/* Center Fulcrum Gudgeon */}
              <circle cx="400" cy="90" r="14" fill="#a8a29e" stroke="#1c1917" strokeWidth="3" />
              {/* Arch Heads */}
              <path d="M 120 80 Q 80 130 90 180 L 105 175 Q 98 135 130 95 Z" fill="#92400e" />
              <path d="M 680 80 Q 720 130 710 180 L 695 175 Q 702 135 670 95 Z" fill="#92400e" />
              {/* Iron Straps */}
              <line x1="400" y1="40" x2="400" y2="90" stroke="#1c1917" strokeWidth="3" />
              <line x1="400" y1="40" x2="120" y2="85" stroke="#1c1917" strokeWidth="2" />
              <line x1="400" y1="40" x2="680" y2="85" stroke="#1c1917" strokeWidth="2" />
            </g>

            {/* Piston Rod & Chain */}
            <g transform={`translate(0, ${pistonPos * 25})`}>
              <rect x="215" y="160" width="10" height="110" fill="#a8a29e" stroke="#1c1917" />
              {/* Working Piston C */}
              <rect
                x="172"
                y="260"
                width="96"
                height="24"
                fill="#57534e"
                stroke="#1c1917"
                strokeWidth="2"
              />
              {/* Tallow seal ring */}
              <line x1="172" y1="272" x2="268" y2="272" stroke="#fef08a" strokeWidth="2" />
            </g>

            {/* Steam Cylinder B & Steam Jacket */}
            {/* Outer Lagging / Jacket */}
            <rect
              x="150"
              y="180"
              width="140"
              height="180"
              fill={controls.hasSteamJacket ? "url(#steamGrad)" : "#334155"}
              stroke="#78716c"
              strokeWidth="2"
              rx="4"
            />
            {/* Inner Cylinder Bore */}
            <rect
              x="170"
              y="190"
              width="100"
              height="160"
              fill="#1c1917"
              stroke="#44403c"
              strokeWidth="2"
            />
            {/* Cylinder Top Cover */}
            <rect x="145" y="175" width="150" height="12" fill="#44403c" stroke="#1c1917" />

            {/* Steam Boiler A */}
            <path
              d="M 40 340 L 40 430 L 130 430 L 130 340 Q 85 300 40 340 Z"
              fill="#b45309"
              stroke="#78350f"
              strokeWidth="2"
            />
            <text x="85" y="380" fill="#fef3c7" fontSize="12" fontWeight="bold" textAnchor="middle">
              BOILER
            </text>
            {/* Fire under boiler */}
            <rect x="45" y="430" width="80" height="40" fill="url(#fireGrad)" rx="2" />

            {/* Steam Pipe Boiler to Cylinder */}
            <path d="M 85 310 L 85 240 L 150 240" fill="none" stroke="#d97706" strokeWidth="6" />

            {/* Cold Water Cistern & Separate Condenser */}
            <rect
              x="160"
              y="380"
              width="180"
              height="90"
              fill="url(#cisternGrad)"
              stroke="#0284c7"
              strokeWidth="2"
              rx="4"
            />
            <text
              x="250"
              y="460"
              fill="#e0f2fe"
              fontSize="10"
              fontStyle="italic"
              textAnchor="middle"
            >
              Cold Cistern (Princ. 2)
            </text>

            {controls.hasSeparateCondenser ? (
              <>
                {/* Condenser Vessel E */}
                <rect
                  x="175"
                  y="395"
                  width="60"
                  height="65"
                  fill="#1e293b"
                  stroke="#0ea5e9"
                  strokeWidth="2"
                  rx="3"
                />
                <text
                  x="205"
                  y="430"
                  fill="#38bdf8"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  E (Cond.)
                </text>
                {/* Exhaust Pipe from Cylinder to Condenser */}
                <path d="M 220 350 L 220 395" fill="none" stroke="#94a3b8" strokeWidth="5" />
                {/* Cold water spray particles when exhausting */}
                {isExhaustStroke && (
                  <g fill="#38bdf8" opacity="0.8">
                    <circle cx="195" cy="410" r="2" />
                    <circle cx="215" cy="415" r="2" />
                    <circle cx="205" cy="425" r="2" />
                    <circle cx="200" cy="440" r="2" />
                  </g>
                )}

                {/* Air Pump G */}
                <rect
                  x="255"
                  y="395"
                  width="55"
                  height="65"
                  fill="#334155"
                  stroke="#64748b"
                  strokeWidth="2"
                  rx="3"
                />
                <text
                  x="282"
                  y="430"
                  fill="#cbd5e1"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  G (Air P.)
                </text>
                {/* Foot pipe from Condenser to Air Pump */}
                <line x1="235" y1="445" x2="255" y2="445" stroke="#64748b" strokeWidth="4" />
                {/* Air pump rod to beam */}
                <g transform={`translate(0, ${-pistonPos * 18})`}>
                  <rect x="278" y="160" width="6" height="235" fill="#94a3b8" />
                </g>
              </>
            ) : (
              /* Newcomen Mode: In-Cylinder Spray Direct Jet */
              <g>
                <line x1="160" y1="320" x2="210" y2="320" stroke="#0284c7" strokeWidth="4" />
                <text
                  x="220"
                  y="335"
                  fill="#f87171"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  In-Cylinder Quench
                </text>
              </g>
            )}

            {/* Mine Pitwork Pump Rod J */}
            <g transform={`translate(0, ${-pistonPos * 25})`}>
              <rect x="695" y="170" width="16" height="300" fill="#78350f" stroke="#1c1917" />
              <text x="730" y="320" fill="#d6d3d1" fontSize="11" fontWeight="bold">
                PUMP ROD (J)
              </text>
              <text x="730" y="336" fill="#a8a29e" fontSize="9" fontStyle="italic">
                To 183m Mine Shaft
              </text>
            </g>
          </svg>

          {/* Real-time State Badge Overlay */}
          <div className="absolute top-3 left-3 bg-stone-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-stone-700/80 text-xs font-mono flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${
                  controls.hasSeparateCondenser ? "bg-emerald-400" : "bg-rose-400"
                }`}
              />
              <span className="text-stone-300 font-semibold">
                {controls.hasSeparateCondenser ? "Watt Separate Condenser" : "Newcomen Quench"}
              </span>
            </div>
            <span className="text-stone-500">|</span>
            <span className="text-stone-400">
              Cylinder:{" "}
              <strong className={controls.hasSteamJacket ? "text-amber-400" : "text-cyan-400"}>
                {outputs.cylinderWallTempC.toFixed(0)}°C
              </strong>
            </span>
          </div>
        </div>

        {/* Live Indicator PV Diagram & Thermodynamic Comparison */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4 bg-stone-950 p-4 rounded-xl border border-stone-800">
          <div>
            <div className="text-xs font-mono text-stone-400 flex items-center justify-between pb-2 border-b border-stone-800">
              <span>INDICATOR P-V DIAGRAM</span>
              <span className="text-amber-400">Work Area = $\int P dV$</span>
            </div>

            {/* Mini SVG PV Curve */}
            <div className="my-3 bg-stone-900/80 p-2 rounded-lg border border-stone-800 flex items-center justify-center">
              <svg viewBox="0 0 240 160" className="w-full h-auto">
                {/* Axes */}
                <line x1="30" y1="135" x2="225" y2="135" stroke="#78716c" strokeWidth="1.5" />
                <line x1="30" y1="135" x2="30" y2="15" stroke="#78716c" strokeWidth="1.5" />
                <text x="220" y="150" fill="#a8a29e" fontSize="9" textAnchor="end">
                  Volume (V)
                </text>
                <text x="25" y="15" fill="#a8a29e" fontSize="9" textAnchor="end">
                  P
                </text>

                {/* Atmospheric line */}
                <line
                  x1="30"
                  y1="75"
                  x2="225"
                  y2="75"
                  stroke="#57534e"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <text x="35" y="72" fill="#78716c" fontSize="8">
                  1 atm (101 kPa)
                </text>

                {/* Watt Cycle Area (Amber) */}
                <path
                  d="M 50 45 L 180 55 Q 210 115 180 120 L 50 120 Z"
                  fill="rgba(245, 158, 11, 0.25)"
                  stroke="#f59e0b"
                  strokeWidth="2"
                />

                {/* Newcomen Curve overlay (dashed blue) */}
                <path
                  d="M 50 75 L 180 75 L 180 100 L 50 100 Z"
                  fill="rgba(56, 189, 248, 0.15)"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeDasharray="3 2"
                />

                <text
                  x="110"
                  y="100"
                  fill="#f59e0b"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  Watt (+300% Work)
                </text>
              </svg>
            </div>
          </div>

          {/* Efficiency & Fuel Ratio comparison card */}
          <div className="bg-stone-900/60 p-3 rounded-lg border border-stone-800 text-xs font-mono space-y-2">
            <div className="flex justify-between items-center text-stone-300">
              <span>Thermal Efficiency:</span>
              <strong className="text-emerald-400 text-sm">
                {outputs.thermalEfficiencyPct.toFixed(2)}%
              </strong>
            </div>
            <div className="flex justify-between items-center text-stone-300">
              <span>Coal Multiplier vs Watt:</span>
              <strong
                className={`text-sm ${
                  outputs.newcomenFuelMultiplier > 1.5 ? "text-rose-400" : "text-emerald-400"
                }`}
              >
                {outputs.newcomenFuelMultiplier.toFixed(1)}×
              </strong>
            </div>
            <div className="flex justify-between items-center text-stone-300">
              <span>Annual Coal Saved:</span>
              <strong className="text-amber-400 text-sm">
                {Math.round(outputs.coalSavedTonsPerYear).toLocaleString()} tons
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
          <div className="text-[11px] font-mono text-stone-400">INDICATED POWER</div>
          <div className="text-lg font-bold text-emerald-400 mt-0.5">
            {outputs.indicatedHorsepower.toFixed(1)} hp
          </div>
          <div className="text-[10px] font-mono text-stone-500">
            {outputs.indicatedPowerKw.toFixed(1)} kW
          </div>
        </div>

        <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
          <div className="text-[11px] font-mono text-stone-400">CONDENSER VACUUM</div>
          <div className="text-lg font-bold text-cyan-400 mt-0.5">
            {outputs.vacuumDepthInchesHg.toFixed(1)} inHg
          </div>
          <div className="text-[10px] font-mono text-stone-500">
            {outputs.condenserPressureAbsKpa.toFixed(1)} kPa abs
          </div>
        </div>

        <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
          <div className="text-[11px] font-mono text-stone-400">INDICATED MEP</div>
          <div className="text-lg font-bold text-amber-400 mt-0.5">
            {outputs.imepPsi.toFixed(1)} psi
          </div>
          <div className="text-[10px] font-mono text-stone-500">
            {outputs.imepKpa.toFixed(1)} kPa
          </div>
        </div>

        <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
          <div className="text-[11px] font-mono text-stone-400">COAL BURN RATE</div>
          <div className="text-lg font-bold text-rose-400 mt-0.5">
            {outputs.coalConsumptionKgPerHour.toFixed(1)} kg/h
          </div>
          <div className="text-[10px] font-mono text-stone-500">
            {outputs.specificFuelConsumptionKgPerKwh.toFixed(2)} kg/kWh
          </div>
        </div>

        <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
          <div className="text-[11px] font-mono text-stone-400">MINE WATER LIFT</div>
          <div className="text-lg font-bold text-blue-400 mt-0.5">
            {Math.round(outputs.waterPumpedGallonsPerHour).toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-stone-500">gal/hr @ 183m</div>
        </div>

        <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
          <div className="text-[11px] font-mono text-stone-400">PISTON FORCE</div>
          <div className="text-lg font-bold text-purple-400 mt-0.5">
            {outputs.pistonPistonForceKn.toFixed(1)} kN
          </div>
          <div className="text-[10px] font-mono text-stone-500">
            {Math.round(outputs.pistonPistonForceKn * 224.8).toLocaleString()} lbf
          </div>
        </div>
      </div>

      {/* Interactive Controls Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 bg-stone-950 p-4 rounded-xl border border-stone-800">
        <div>
          <div className="flex justify-between text-xs font-mono text-stone-300 mb-1.5">
            <label htmlFor={boilerId}>Boiler Pressure:</label>
            <span className="text-amber-400 font-semibold">
              {controls.boilerPressurePsi ?? 3} psi
            </span>
          </div>
          <input
            id={boilerId}
            type="range"
            min="0.5"
            max="10.0"
            step="0.5"
            value={controls.boilerPressurePsi ?? 3}
            onChange={(e) => updateParam("boilerPressurePsi", Number.parseFloat(e.target.value))}
            className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono text-stone-300 mb-1.5">
            <label htmlFor={condTempId}>Condenser Cistern Temp:</label>
            <span className="text-cyan-400 font-semibold">{controls.condenserTempC ?? 35} °C</span>
          </div>
          <input
            id={condTempId}
            type="range"
            min="10"
            max="60"
            step="1"
            value={controls.condenserTempC ?? 35}
            onChange={(e) => updateParam("condenserTempC", Number.parseFloat(e.target.value))}
            className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono text-stone-300 mb-1.5">
            <label htmlFor={boreId}>Cylinder Bore:</label>
            <span className="text-emerald-400 font-semibold">
              {controls.cylinderBoreInches ?? 38} in
            </span>
          </div>
          <input
            id={boreId}
            type="range"
            min="20"
            max="72"
            step="2"
            value={controls.cylinderBoreInches ?? 38}
            onChange={(e) => updateParam("cylinderBoreInches", Number.parseFloat(e.target.value))}
            className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono text-stone-300 mb-1.5">
            <label htmlFor={spmId}>Cadence (SPM):</label>
            <span className="text-purple-400 font-semibold">
              {controls.strokesPerMinute ?? 14} spm
            </span>
          </div>
          <input
            id={spmId}
            type="range"
            min="6"
            max="24"
            step="1"
            value={controls.strokesPerMinute ?? 14}
            onChange={(e) => updateParam("strokesPerMinute", Number.parseFloat(e.target.value))}
            className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>
      </div>
    </div>
  );
}
