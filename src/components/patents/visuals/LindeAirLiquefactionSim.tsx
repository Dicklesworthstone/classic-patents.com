"use client";

import { useState } from "react";
import { FrankenSimEngine } from "@/physics/engine";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

/**
 * An annotated reading of the apparatus in US 727,650, not a plant-sizing
 * calculator. The grant gives one operating example but no terminal
 * temperature, flow, yield, or production-rate measurement.
 */
export function LindeAirLiquefactionSim() {
  usePatentPhysics("us-727650-linde-air-liquefaction");
  const [activeTab, setActiveTab] = useState<"liquefaction" | "separation">("liquefaction");
  const linde = FrankenSimEngine.stepLindeAirLiquefaction();

  return (
    <div className="flex w-full flex-col gap-6 rounded-2xl border border-neutral-800 bg-neutral-950 p-6 text-neutral-100 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
            <h3 className="text-lg font-semibold tracking-wide text-neutral-100">
              Carl Linde’s apparatus, read from US 727,650
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-neutral-400">
            Source-bounded guide to C, K, G′, R′, V′, V², G², and G³. It does not predict plant
            output.
          </p>
        </div>
        <div className="flex rounded-lg border border-neutral-800 bg-neutral-900 p-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("liquefaction")}
            className={`rounded-md px-3 py-1.5 font-medium transition-all ${
              activeTab === "liquefaction"
                ? "border border-cyan-500/30 bg-cyan-500/20 text-cyan-300"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Liquefaction circuit
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("separation")}
            className={`rounded-md px-3 py-1.5 font-medium transition-all ${
              activeTab === "separation"
                ? "border border-cyan-500/30 bg-cyan-500/20 text-cyan-300"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Fractionation extension
          </button>
        </div>
      </div>

      <div className="relative flex min-h-[320px] w-full items-center justify-center overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/90 p-6">
        {activeTab === "liquefaction" ? (
          <svg
            viewBox="0 0 760 360"
            className="h-full w-full"
            aria-label="Linde liquefaction circuit"
          >
            <path
              d="M 120 105 H 270 V 68 H 405 V 195"
              fill="none"
              stroke="#ef4444"
              strokeWidth="5"
            />
            <path
              d="M 405 235 V 288 H 270 V 105"
              fill="none"
              stroke="#38bdf8"
              strokeDasharray="7 4"
              strokeWidth="4"
            />
            <path d="M 405 230 V 298" fill="none" stroke="#fbbf24" strokeWidth="5" />

            <g transform="translate(28 62)">
              <rect width="96" height="88" rx="7" fill="#18181b" stroke="#71717a" strokeWidth="2" />
              <text
                x="48"
                y="30"
                fill="#e4e4e7"
                fontFamily="monospace"
                fontSize="14"
                textAnchor="middle"
              >
                C
              </text>
              <text
                x="48"
                y="50"
                fill="#a1a1aa"
                fontFamily="monospace"
                fontSize="10"
                textAnchor="middle"
              >
                COMPRESSOR
              </text>
              <text
                x="48"
                y="69"
                fill="#a1a1aa"
                fontFamily="monospace"
                fontSize="9"
                textAnchor="middle"
              >
                from T a′
              </text>
            </g>
            <g transform="translate(270 35)">
              <rect
                width="120"
                height="66"
                rx="7"
                fill="#18181b"
                stroke="#71717a"
                strokeWidth="2"
              />
              <text
                x="60"
                y="28"
                fill="#e4e4e7"
                fontFamily="monospace"
                fontSize="14"
                textAnchor="middle"
              >
                K
              </text>
              <text
                x="60"
                y="47"
                fill="#a1a1aa"
                fontFamily="monospace"
                fontSize="10"
                textAnchor="middle"
              >
                COOLER / REFRIGERATOR
              </text>
            </g>
            <g transform="translate(270 105)">
              <rect
                width="135"
                height="125"
                rx="9"
                fill="#18181b"
                stroke="#71717a"
                strokeWidth="2"
              />
              <rect
                x="28"
                y="10"
                width="30"
                height="104"
                rx="12"
                fill="#ef4444"
                fillOpacity="0.5"
              />
              <rect
                x="76"
                y="10"
                width="30"
                height="104"
                rx="12"
                fill="#38bdf8"
                fillOpacity="0.5"
              />
              <text
                x="67"
                y="50"
                fill="#e4e4e7"
                fontFamily="monospace"
                fontSize="14"
                textAnchor="middle"
              >
                G′
              </text>
              <text
                x="67"
                y="69"
                fill="#a1a1aa"
                fontFamily="monospace"
                fontSize="9"
                textAnchor="middle"
              >
                TWO COILED PIPES
              </text>
              <text
                x="67"
                y="85"
                fill="#a1a1aa"
                fontFamily="monospace"
                fontSize="9"
                textAnchor="middle"
              >
                inner / annular return
              </text>
            </g>
            <g transform="translate(370 224)">
              <path d="M 0 25 L 34 0 L 68 25 Z" fill="#fbbf24" stroke="#78350f" />
              <text x="85" y="17" fill="#fbbf24" fontFamily="monospace" fontSize="11">
                N + R′
              </text>
              <text x="85" y="33" fill="#a1a1aa" fontFamily="monospace" fontSize="9">
                nozzle and regulating valve
              </text>
            </g>
            <g transform="translate(360 298)">
              <rect width="95" height="45" rx="7" fill="#18181b" stroke="#38bdf8" strokeWidth="2" />
              <text
                x="47"
                y="20"
                fill="#e4e4e7"
                fontFamily="monospace"
                fontSize="14"
                textAnchor="middle"
              >
                V′
              </text>
              <text
                x="47"
                y="35"
                fill="#a1a1aa"
                fontFamily="monospace"
                fontSize="9"
                textAnchor="middle"
              >
                closed vessel
              </text>
            </g>
            <g transform="translate(485 70)">
              <rect width="240" height="138" rx="7" fill="#18181b" stroke="#3f3f46" />
              <text x="14" y="24" fill="#a1a1aa" fontFamily="monospace" fontSize="10">
                PRINTED OPERATING EXAMPLE
              </text>
              <text x="14" y="51" fill="#38bdf8" fontFamily="monospace" fontSize="13">
                p² high: {linde.highPressureAtm} atmospheres
              </text>
              <text x="14" y="74" fill="#818cf8" fontFamily="monospace" fontSize="13">
                p′ low: {linde.lowPressureAtm} atmospheres
              </text>
              <text x="14" y="97" fill="#fbbf24" fontFamily="monospace" fontSize="12">
                t³ after K: about {linde.coolerOutletC}°C or less
              </text>
              <text x="14" y="120" fill="#a1a1aa" fontFamily="monospace" fontSize="9">
                No terminal temperature, yield, or rate is printed.
              </text>
            </g>
            <text
              x="197"
              y="92"
              fill="#ef4444"
              fontFamily="monospace"
              fontSize="9"
              textAnchor="middle"
            >
              high-pressure path
            </text>
            <text
              x="202"
              y="305"
              fill="#38bdf8"
              fontFamily="monospace"
              fontSize="9"
              textAnchor="middle"
            >
              low-pressure return to C
            </text>
          </svg>
        ) : (
          <svg
            viewBox="0 0 760 360"
            className="h-full w-full"
            aria-label="Linde separation extension"
          >
            <path d="M 132 180 H 245" fill="none" stroke="#38bdf8" strokeWidth="5" />
            <path d="M 365 140 H 470 V 75" fill="none" stroke="#fbbf24" strokeWidth="4" />
            <path d="M 365 220 H 470 V 285" fill="none" stroke="#38bdf8" strokeWidth="4" />
            <g transform="translate(32 130)">
              <rect
                width="100"
                height="100"
                rx="8"
                fill="#18181b"
                stroke="#38bdf8"
                strokeWidth="2"
              />
              <text
                x="50"
                y="43"
                fill="#e4e4e7"
                fontFamily="monospace"
                fontSize="17"
                textAnchor="middle"
              >
                V′
              </text>
              <text
                x="50"
                y="64"
                fill="#a1a1aa"
                fontFamily="monospace"
                fontSize="10"
                textAnchor="middle"
              >
                liquefaction
              </text>
              <text
                x="50"
                y="79"
                fill="#a1a1aa"
                fontFamily="monospace"
                fontSize="10"
                textAnchor="middle"
              >
                vessel
              </text>
            </g>
            <g transform="translate(245 100)">
              <rect
                width="120"
                height="160"
                rx="8"
                fill="#18181b"
                stroke="#71717a"
                strokeWidth="2"
              />
              <text
                x="60"
                y="53"
                fill="#e4e4e7"
                fontFamily="monospace"
                fontSize="17"
                textAnchor="middle"
              >
                V²
              </text>
              <text
                x="60"
                y="76"
                fill="#a1a1aa"
                fontFamily="monospace"
                fontSize="10"
                textAnchor="middle"
              >
                evaporating vessel
              </text>
              <text
                x="60"
                y="100"
                fill="#fbbf24"
                fontFamily="monospace"
                fontSize="11"
                textAnchor="middle"
              >
                S: internal coil
              </text>
              <text
                x="60"
                y="124"
                fill="#a1a1aa"
                fontFamily="monospace"
                fontSize="9"
                textAnchor="middle"
              >
                connected by h h / R²
              </text>
            </g>
            <g transform="translate(470 28)">
              <rect
                width="130"
                height="94"
                rx="8"
                fill="#18181b"
                stroke="#fbbf24"
                strokeWidth="2"
              />
              <text
                x="65"
                y="36"
                fill="#e4e4e7"
                fontFamily="monospace"
                fontSize="16"
                textAnchor="middle"
              >
                G²
              </text>
              <text
                x="65"
                y="60"
                fill="#a1a1aa"
                fontFamily="monospace"
                fontSize="10"
                textAnchor="middle"
              >
                nitrogen outlet
              </text>
              <text
                x="65"
                y="78"
                fill="#a1a1aa"
                fontFamily="monospace"
                fontSize="9"
                textAnchor="middle"
              >
                outer tube
              </text>
            </g>
            <g transform="translate(470 238)">
              <rect
                width="130"
                height="94"
                rx="8"
                fill="#18181b"
                stroke="#38bdf8"
                strokeWidth="2"
              />
              <text
                x="65"
                y="36"
                fill="#e4e4e7"
                fontFamily="monospace"
                fontSize="16"
                textAnchor="middle"
              >
                G³
              </text>
              <text
                x="65"
                y="60"
                fill="#a1a1aa"
                fontFamily="monospace"
                fontSize="10"
                textAnchor="middle"
              >
                oxygen path
              </text>
              <text
                x="65"
                y="78"
                fill="#a1a1aa"
                fontFamily="monospace"
                fontSize="9"
                textAnchor="middle"
              >
                or draw liquid at n
              </text>
            </g>
            <text x="630" y="172" fill="#a1a1aa" fontFamily="monospace" fontSize="10">
              The grant describes routes and states,
            </text>
            <text x="630" y="191" fill="#a1a1aa" fontFamily="monospace" fontSize="10">
              not purity, flow, or production values.
            </text>
          </svg>
        )}
      </div>

      <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm leading-6 text-neutral-300">
        The moving paths are an explanatory map of the named apparatus. They are not a numerical
        simulation of a particular installation. The source says a portion condenses in V′ after the
        critical point is reached, but does not quantify how much or at what final temperature.
      </p>
    </div>
  );
}
