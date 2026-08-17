"use client";

import { useState } from "react";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

export function CarrierAirConditionerSim() {
  const { params, updateParam } = usePatentPhysics("us-808897-carrier-air-conditioner");
  const [activeTab, setActiveTab] = useState<"chamber" | "psychrometric">("chamber");

  const tIn = params.inletTemp ?? 35;
  const rhIn = params.inletRh ?? 75;
  const tSpray = params.sprayTemp ?? 8;
  const tReheat = params.reheatTemp ?? 22;

  // Psychrometric calculation
  const pSatIn = 0.61078 * Math.exp((17.27 * tIn) / (tIn + 237.3));
  const pVaporIn = (rhIn / 100) * pSatIn;
  const wIn = 622 * (pVaporIn / (101.325 - pVaporIn));

  const dewPoint = (
    (237.3 * Math.log(pVaporIn / 0.61078)) /
    (17.27 - Math.log(pVaporIn / 0.61078))
  ).toFixed(1);

  const pSatSpray = 0.61078 * Math.exp((17.27 * tSpray) / (tSpray + 237.3));
  const wSatSpray = 622 * (pSatSpray / (101.325 - pSatSpray));
  const wOut = Math.min(wIn, wSatSpray);
  const moistureRemoved = Math.max(0, wIn - wOut).toFixed(1);

  const pVaporOut = (wOut * 101.325) / (622 + wOut);
  const pSatReheat = 0.61078 * Math.exp((17.27 * tReheat) / (tReheat + 237.3));
  const finalRh = Math.min(100, Math.round((pVaporOut / pSatReheat) * 100));

  return (
    <div className="w-full rounded-2xl bg-neutral-950 border border-neutral-800 p-6 space-y-6 text-neutral-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="text-lg font-semibold tracking-wide text-neutral-100">
              Willis H. Carrier — Psychrometric Dew-Point Air Conditioning Apparatus
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            US Patent 808,897 · Chilled Water Spray Dehumidification, Inertial Baffles & Sensible
            Reheat
          </p>
        </div>
        <div className="flex rounded-lg bg-neutral-900 p-1 border border-neutral-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("chamber")}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === "chamber"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            1. Spray Conditioning Chamber
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("psychrometric")}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === "psychrometric"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            2. Psychrometric State Process
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="relative w-full aspect-[16/9] min-h-[320px] rounded-xl bg-neutral-900/90 border border-neutral-800 overflow-hidden flex items-center justify-center p-6">
        {activeTab === "chamber" && (
          <svg viewBox="0 0 700 340" className="w-full h-full">
            <defs>
              <linearGradient id="humidAirGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.6" />
                <stop offset="35%" stopColor="#0284c7" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Conditioning Tunnel Plenum */}
            <rect
              x="40"
              y="70"
              width="620"
              height="180"
              rx="10"
              fill="#18181b"
              stroke="#52525b"
              strokeWidth="2"
            />
            <rect
              x="42"
              y="72"
              width="616"
              height="176"
              rx="8"
              fill="url(#humidAirGrad)"
              opacity="0.3"
            />

            {/* Stage 1: Intake Air */}
            <g transform="translate(60, 110)">
              <text
                x="0"
                y="0"
                fill="#f97316"
                fontSize="12"
                fontFamily="monospace"
                fontWeight="bold"
              >
                1. INTAKE AIR
              </text>
              <text x="0" y="20" fill="#a1a1aa" fontSize="10" fontFamily="monospace">
                {tIn}°C · {rhIn}% RH
              </text>
              <text x="0" y="38" fill="#fbbf24" fontSize="10" fontFamily="monospace">
                Dew Point: {dewPoint}°C
              </text>
            </g>

            {/* Stage 2: Atomizing Chilled Water Spray Header */}
            <g transform="translate(240, 70)">
              <line x1="20" y1="0" x2="20" y2="180" stroke="#0284c7" strokeWidth="4" />
              {/* Nozzles Spraying Water Mist */}
              {[30, 60, 90, 120, 150].map((y, i) => (
                <g key={i} transform={`translate(20, ${y})`}>
                  <circle cx="0" cy="0" r="4" fill="#fbbf24" />
                  <polygon points="0,0 45,-15 45,15" fill="#38bdf8" opacity="0.6" />
                </g>
              ))}
              <text
                x="20"
                y="-10"
                textAnchor="middle"
                fill="#38bdf8"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
              >
                2. CHILLED SPRAY ({tSpray}°C)
              </text>
            </g>

            {/* Stage 3: Zigzag Inertial Mist Eliminator Baffles */}
            <g transform="translate(380, 80)">
              {[0, 15, 30, 45].map((x, i) => (
                <polyline
                  key={i}
                  points={`${x},10 ${x + 10},40 ${x},70 ${x + 10},100 ${x},130 ${x + 10},150`}
                  fill="none"
                  stroke="#a1a1aa"
                  strokeWidth="3"
                />
              ))}
              <text
                x="30"
                y="-20"
                textAnchor="middle"
                fill="#a1a1aa"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
              >
                3. ELIMINATORS
              </text>
            </g>

            {/* Stage 4: Sensible Reheat Steam Fin Coils */}
            <g transform="translate(500, 80)">
              <rect x="0" y="10" width="25" height="140" fill="#dc2626" opacity="0.4" rx="3" />
              {[20, 40, 60, 80, 100, 120, 140].map((y, i) => (
                <line key={i} x1="0" y1={y} x2="25" y2={y} stroke="#ef4444" strokeWidth="2" />
              ))}
              <text
                x="12"
                y="-20"
                textAnchor="middle"
                fill="#ef4444"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
              >
                4. REHEAT ({tReheat}°C)
              </text>
            </g>

            {/* Stage 5: Supply Air Output */}
            <g transform="translate(560, 110)">
              <text
                x="0"
                y="0"
                fill="#4ade80"
                fontSize="12"
                fontFamily="monospace"
                fontWeight="bold"
              >
                5. CONDITIONED
              </text>
              <text
                x="0"
                y="20"
                fill="#4ade80"
                fontSize="13"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {tReheat}°C · {finalRh}% RH
              </text>
              <text x="0" y="38" fill="#a1a1aa" fontSize="10" fontFamily="monospace">
                - {moistureRemoved} g/kg
              </text>
            </g>

            {/* Bottom Sump */}
            <rect
              x="200"
              y="250"
              width="160"
              height="40"
              rx="4"
              fill="#0c4a6e"
              stroke="#0284c7"
              strokeWidth="1.5"
            />
            <text
              x="280"
              y="275"
              textAnchor="middle"
              fill="#38bdf8"
              fontSize="10"
              fontFamily="monospace"
            >
              DRAIN SUMP (-{moistureRemoved} g/kg condensed)
            </text>
          </svg>
        )}

        {activeTab === "psychrometric" && (
          <svg viewBox="0 0 600 320" className="w-full h-full">
            {/* Psychrometric Axes */}
            <line x1="80" y1="260" x2="520" y2="260" stroke="#71717a" strokeWidth="2" />
            <line x1="80" y1="260" x2="80" y2="40" stroke="#71717a" strokeWidth="2" />
            <text x="530" y="265" fill="#a1a1aa" fontSize="11" fontFamily="monospace">
              Dry-Bulb Temp (°C)
            </text>
            <text x="70" y="35" fill="#a1a1aa" fontSize="11" fontFamily="monospace">
              Humidity Ratio (W)
            </text>

            {/* 100% Saturation Curve */}
            <path
              d="M 80 250 Q 200 240, 350 150 T 500 50"
              fill="none"
              stroke="#0284c7"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            <text x="440" y="45" fill="#0284c7" fontSize="10" fontFamily="monospace">
              100% Saturation Curve
            </text>

            {/* Psychrometric Process Line: Point A (Intake) -> Point B (Chilled Saturation at Spray Temp) -> Point C (Reheated Room Supply) */}
            {/* Point A: Intake */}
            <circle cx="420" cy="110" r="6" fill="#f97316" />
            <text
              x="430"
              y="105"
              fill="#f97316"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
            >
              A: Intake ({tIn}°C, {rhIn}%)
            </text>

            {/* Point B: Dew Point Condensation */}
            <circle cx="180" cy="200" r="6" fill="#0284c7" />
            <text
              x="110"
              y="195"
              fill="#0284c7"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
            >
              B: Spray Dew Point ({tSpray}°C)
            </text>

            {/* Point C: Sensible Reheat */}
            <circle cx="310" cy="200" r="6" fill="#22c55e" />
            <text
              x="320"
              y="215"
              fill="#22c55e"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
            >
              C: Reheat Supply ({tReheat}°C, {finalRh}%)
            </text>

            {/* Process Vectors */}
            <line x1="420" y1="110" x2="180" y2="200" stroke="#0284c7" strokeWidth="3" />
            <line x1="180" y1="200" x2="310" y2="200" stroke="#ef4444" strokeWidth="3" />

            <text
              x="300"
              y="300"
              textAnchor="middle"
              fill="#e4e4e7"
              fontSize="12"
              fontFamily="monospace"
            >
              Carrier Psychrometric Path: Cooling & Dehumidification (A → B) followed by Sensible
              Reheat (B → C)
            </text>
          </svg>
        )}
      </div>

      {/* Physics Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-neutral-900/50 p-4 rounded-xl border border-neutral-800">
        <div>
          <div className="flex justify-between text-xs font-mono text-neutral-300 mb-1.5">
            <span>Outdoor Summer Temp</span>
            <span className="text-orange-400 font-bold">{tIn}°C</span>
          </div>
          <input
            type="range"
            min={25}
            max={42}
            step={1}
            value={tIn}
            onChange={(e) => updateParam("inletTemp", Number(e.target.value))}
            className="w-full accent-orange-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono text-neutral-300 mb-1.5">
            <span>Outdoor Humidity</span>
            <span className="text-cyan-400 font-bold">{rhIn}%</span>
          </div>
          <input
            type="range"
            min={40}
            max={95}
            step={5}
            value={rhIn}
            onChange={(e) => updateParam("inletRh", Number(e.target.value))}
            className="w-full accent-cyan-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono text-neutral-300 mb-1.5">
            <span>Chilled Water Spray Temp</span>
            <span className="text-cyan-400 font-bold">{tSpray}°C</span>
          </div>
          <input
            type="range"
            min={4}
            max={18}
            step={1}
            value={tSpray}
            onChange={(e) => updateParam("sprayTemp", Number(e.target.value))}
            className="w-full accent-cyan-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono text-neutral-300 mb-1.5">
            <span>Reheat Supply Temp</span>
            <span className="text-emerald-400 font-bold">{tReheat}°C</span>
          </div>
          <input
            type="range"
            min={18}
            max={26}
            step={1}
            value={tReheat}
            onChange={(e) => updateParam("reheatTemp", Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </div>
      </div>
    </div>
  );
}
