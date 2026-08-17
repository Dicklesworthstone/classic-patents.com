"use client";

import { Radio } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { TwoClocksStrip } from "@/components/patents/TwoClocksStrip";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";

export function SpencerMicrowaveSim() {
  const { params, updateParam } = usePatentPhysics("us-2495429-spencer-microwave");
  const powerWatts = params.rfPowerSetting ?? 800;
  const [foodType, setFoodType] = useState<"water-popcorn" | "dry-ice">("water-popcorn");
  const [isEmitting, setIsEmitting] = useState<boolean>(true);
  const [tempCelsius, setTempCelsius] = useState<number>(20);
  const [poppedCount, setPoppedCount] = useState<number>(0);
  const tempRef = useRef(tempCelsius);
  const poppedRef = useRef(poppedCount);
  useLayoutEffect(() => {
    tempRef.current = tempCelsius;
    poppedRef.current = poppedCount;
  });

  useEffect(() => {
    if (!isEmitting) return;
    const interval = setInterval(() => {
      if (foodType === "water-popcorn") {
        const nextTemp = Math.min(180, tempRef.current + (powerWatts / 1000) * 8);
        tempRef.current = nextTemp;
        setTempCelsius(nextTemp);
        if (nextTemp > 100 && poppedRef.current < 12) {
          poppedRef.current += 1;
          setPoppedCount(poppedRef.current);
          soundEngine.playPopcornPop();
        }
      } else {
        const nextTemp = Math.min(25, tempRef.current + 0.1);
        tempRef.current = nextTemp;
        setTempCelsius(nextTemp);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [isEmitting, powerWatts, foodType]);

  const resetHeating = () => {
    setTempCelsius(20);
    setPoppedCount(0);
    soundEngine.playSwitchClick();
  };

  return (
    <div className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-5 shadow-patent">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio
              className={`w-4 h-4 text-purple-500 ${isEmitting ? "animate-pulse" : "opacity-40"}`}
            />
            <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
              Spencer Cavity Magnetron &amp; Dielectric Microwave Simulator
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-0.5">
            Watch polar water molecules oscillate 2.45 billion times/second to generate rapid
            volumetric heat.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label={isEmitting ? "Stand by magnetron" : "Emit microwaves"}
            type="button"
            onClick={() => {
              setIsEmitting((e) => !e);
              soundEngine.playSwitchClick();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors ${
              isEmitting
                ? "bg-purple-700 text-white border-purple-800 font-bold"
                : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            {isEmitting ? "Magnetron: EMITTING" : "Magnetron: STANDBY"}
          </button>
          <button
            type="button"
            onClick={resetHeating}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium border border-parchment-300 dark:border-ink-700 bg-parchment-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 hover:bg-parchment-200"
          >
            Cool Down Food &amp; Reset
          </button>
        </div>
      </div>

      <div className="my-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Microwave Cavity Chamber */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center rounded-xl bg-ink-950 p-6 border border-parchment-200 dark:border-ink-800 relative min-h-[300px]">
          <svg viewBox="0 0 360 220" className="w-full max-w-md h-auto select-none">
            {/* Metallic Faraday Enclosure */}
            <rect
              x="20"
              y="20"
              width="320"
              height="180"
              rx="8"
              fill="#1e293b"
              stroke="#64748b"
              strokeWidth="4"
            />
            <rect
              x="30"
              y="30"
              width="300"
              height="160"
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="1"
            />

            {/* Cavity Magnetron Waveguide Horn (Top Left) */}
            <path
              d="M 50,30 L 70,30 L 90,60 L 30,60 Z"
              fill="#94a3b8"
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />
            <text
              x="60"
              y="22"
              textAnchor="middle"
              fontSize="9"
              fill="#94a3b8"
              fontFamily="monospace"
              fontWeight="bold"
            >
              Magnetron (2.45 GHz)
            </text>

            {/* Standing Microwave Radiation Lines */}
            {isEmitting && (
              <g stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7">
                <path d="M 60,60 Q 180,120 300,60" fill="none" />
                <path d="M 60,80 Q 180,150 300,100" fill="none" />
                <path d="M 80,100 Q 180,50 280,140" fill="none" />
              </g>
            )}

            {/* Turntable / Food Plate */}
            <ellipse
              cx="180"
              cy="170"
              rx="80"
              ry="14"
              fill="#334155"
              stroke="#475569"
              strokeWidth="2"
            />

            {/* Foodstuff (Popcorn Kernels or Water Vessel) */}
            <g transform="translate(180, 150)">
              {/* Thermal glow aura around food */}
              <circle
                cx="0"
                cy="-10"
                r="35"
                fill={tempCelsius > 80 ? "rgba(239, 68, 68, 0.4)" : "rgba(168, 85, 247, 0.2)"}
              />

              {/* Popcorn bowl */}
              <path
                d="M -30,0 Q 0,20 30,0 L 25,-20 L -25,-20 Z"
                fill="#e2e8f0"
                stroke="#94a3b8"
                strokeWidth="1.5"
              />

              {/* Kernels popping into fluffy popcorn */}
              {Array.from({ length: 12 }).map((_, i) => {
                const isPopped = i < poppedCount;
                const angle = (i / 12) * Math.PI * 2;
                const rad = isPopped ? 18 + (i % 3) * 6 : 8;
                const px = Math.cos(angle) * rad;
                const py = Math.sin(angle) * (rad * 0.6) - 15;
                return (
                  <circle
                    key={i}
                    cx={px}
                    cy={py}
                    r={isPopped ? 5 : 2.5}
                    fill={isPopped ? "#fef08a" : "#ca8a04"}
                    stroke={isPopped ? "#eab308" : "#854d0e"}
                    strokeWidth="1"
                  />
                );
              })}
            </g>
          </svg>

          <div className="text-xs font-mono text-ink-300 mt-2">
            Internal Food Temp:{" "}
            <span className="text-amber-400 font-bold">{Math.round(tempCelsius)}°C</span> · Popcorn
            Popped: <span className="text-purple-400 font-bold">{poppedCount} / 12</span>
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-parchment-100/60 dark:bg-ink-900/60 p-4 rounded-xl border border-parchment-200 dark:border-ink-800 space-y-3">
            <div>
              <span className="text-xs font-mono block text-ink-700 dark:text-ink-300 font-semibold mb-1">
                Target Substance
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setFoodType("water-popcorn");
                    resetHeating();
                  }}
                  className={`p-2 rounded border text-left transition-colors ${
                    foodType === "water-popcorn"
                      ? "bg-purple-700 text-white border-purple-800 font-bold"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300"
                  }`}
                >
                  <div>Popcorn (Water Polar)</div>
                  <div className="text-[10px] opacity-80">High dielectric loss (Heats fast)</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFoodType("dry-ice");
                    resetHeating();
                  }}
                  className={`p-2 rounded border text-left transition-colors ${
                    foodType === "dry-ice"
                      ? "bg-purple-700 text-white border-purple-800 font-bold"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300"
                  }`}
                >
                  <div>Dry Non-Polar Substrate</div>
                  <div className="text-[10px] opacity-80">Zero dipole oscillation (No heat)</div>
                </button>
              </div>
            </div>

            <TwoClocksStrip
              title="magnetron cycle vs water heat"
              fast={{
                name: "RF cycle",
                period: "408",
                scale: "ps",
                detail: "2.45 GHz: one oscillation of the cavity field, far too fast to feel.",
              }}
              slow={{
                name: "Thermal rise",
                period: ((4180 * 0.25) / Math.max(50, powerWatts)).toFixed(1),
                scale: "s / °C",
                detail: `Time for ${powerWatts} W to lift 250 g of water one kelvin. Dipoles follow the field; heat does not.`,
              }}
            />

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Magnetron RF Power
                </span>
                <span className="text-purple-600 dark:text-purple-400 font-bold">
                  {powerWatts} Watts
                </span>
              </div>
              <input
                type="range"
                aria-label="Magnetron RF Power"
                min="200"
                max="1200"
                step="50"
                value={powerWatts}
                onChange={(e) => updateParam("rfPowerSetting", Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
