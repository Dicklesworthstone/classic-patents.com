"use client";

import { Cpu } from "lucide-react";
import { useState } from "react";

export function NoycePlanarICSim() {
  const [activeLayer, setActiveLayer] = useState<"all" | "silicon" | "oxide" | "metal">("all");
  const [_showInterconnects, _setShowInterconnects] = useState<boolean>(true);
  const [wireTech, setWireTech] = useState<"noyce-deposited-planar" | "kilby-flying-wires">(
    "noyce-deposited-planar",
  );

  return (
    <div className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-5 shadow-patent">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-500" />
            <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
              Noyce Planar Monolithic Silicon & Aluminum Interconnect Explorer
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-0.5">
            Inspect the layer-by-layer architecture that eliminated flying hand-soldered wires to
            create the microchip.
          </p>
        </div>
      </div>

      <div className="my-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Layer Cross Section SVG View */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center rounded-xl bg-ink-950 p-6 border border-parchment-200 dark:border-ink-800 relative min-h-[300px]">
          <svg viewBox="0 0 400 220" className="w-full max-w-md h-auto select-none">
            {/* Base Monolithic Silicon Substrate (P-type) */}
            <rect
              x="30"
              y="120"
              width="340"
              height="70"
              rx="4"
              fill="#334155"
              stroke="#64748b"
              strokeWidth="1.5"
            />
            <text
              x="50"
              y="160"
              fontSize="11"
              fill="#94a3b8"
              fontFamily="monospace"
              fontWeight="bold"
            >
              P-type Monolithic Silicon Substrate (Base Die)
            </text>

            {/* Diffused N-wells (Transistors & Diodes) */}
            {(activeLayer === "all" || activeLayer === "silicon") && (
              <g>
                <rect
                  x="70"
                  y="120"
                  width="70"
                  height="35"
                  fill="#0369a1"
                  stroke="#38bdf8"
                  strokeWidth="1"
                  rx="2"
                />
                <text
                  x="105"
                  y="142"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#e0f2fe"
                  fontFamily="monospace"
                >
                  N-Collector
                </text>

                <rect
                  x="230"
                  y="120"
                  width="80"
                  height="35"
                  fill="#0369a1"
                  stroke="#38bdf8"
                  strokeWidth="1"
                  rx="2"
                />
                <text
                  x="270"
                  y="142"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#e0f2fe"
                  fontFamily="monospace"
                >
                  N-Emitter
                </text>
              </g>
            )}

            {/* Silicon Dioxide (SiO2) Protective Insulating Layer */}
            {(activeLayer === "all" || activeLayer === "oxide") && (
              <g>
                {/* Left Oxide Island */}
                <rect
                  x="30"
                  y="95"
                  width="55"
                  height="25"
                  fill="#0d9488"
                  opacity="0.8"
                  stroke="#14b8a6"
                  strokeWidth="1"
                />
                {/* Center Oxide Island */}
                <rect
                  x="125"
                  y="95"
                  width="120"
                  height="25"
                  fill="#0d9488"
                  opacity="0.8"
                  stroke="#14b8a6"
                  strokeWidth="1"
                />
                {/* Right Oxide Island */}
                <rect
                  x="295"
                  y="95"
                  width="75"
                  height="25"
                  fill="#0d9488"
                  opacity="0.8"
                  stroke="#14b8a6"
                  strokeWidth="1"
                />

                <text
                  x="185"
                  y="112"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#ccfbf1"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  SiO₂ Insulating Oxide Layer
                </text>
              </g>
            )}

            {/* Metallization Layer (Deposited Aluminum or Flying Wires) */}
            {(activeLayer === "all" || activeLayer === "metal") && (
              <g>
                {wireTech === "noyce-deposited-planar" ? (
                  /* Noyce Vapor-Deposited Planar Aluminum Traces */
                  <g>
                    {/* Aluminum Lead extending across oxide down into contact hole */}
                    <path
                      d="M 60,90 L 95,90 L 95,120 L 115,120 L 115,90 L 260,90 L 260,120 L 280,120 L 280,90 L 330,90"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 60,90 L 95,90 L 95,120 L 115,120 L 115,90 L 260,90 L 260,120 L 280,120 L 280,90 L 330,90"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2"
                    />
                    <text
                      x="185"
                      y="78"
                      textAnchor="middle"
                      fontSize="10"
                      fill="#38bdf8"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      Vapor-Deposited Aluminum Interconnect Trace (Noyce)
                    </text>
                  </g>
                ) : (
                  /* Kilby Hand-Soldered Flying Gold Wire */
                  <g>
                    <path
                      d="M 105,120 Q 185,15 270,120"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                    />
                    <circle cx="105" cy="120" r="4" fill="#d97706" />
                    <circle cx="270" cy="120" r="4" fill="#d97706" />
                    <text
                      x="185"
                      y="35"
                      textAnchor="middle"
                      fontSize="10"
                      fill="#fbbf24"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      Flying Gold Solder Wire (Fragile Prior Art)
                    </text>
                  </g>
                )}
              </g>
            )}
          </svg>

          <div className="text-xs font-mono text-ink-300 mt-2">
            {wireTech === "noyce-deposited-planar" ? (
              <span className="text-cyan-400 font-bold">
                ✓ Planar Mass Production: All transistors &amp; metal leads etched simultaneously
                via photolithography!
              </span>
            ) : (
              <span className="text-amber-400 font-bold">
                ✗ Hand-Assembly: Individual fragile wires must be soldered under a microscope one by
                one.
              </span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-parchment-100/60 dark:bg-ink-900/60 p-4 rounded-xl border border-parchment-200 dark:border-ink-800 space-y-3">
            <div>
              <span className="text-xs font-mono block text-ink-700 dark:text-ink-300 font-semibold mb-1">
                Interconnect Architecture
              </span>
              <div className="grid grid-cols-1 gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setWireTech("noyce-deposited-planar")}
                  className={`p-2 rounded border text-left transition-colors ${
                    wireTech === "noyce-deposited-planar"
                      ? "bg-cyan-700 text-white border-cyan-800 font-bold"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300"
                  }`}
                >
                  <div>Noyce Planar Deposited Metal</div>
                  <div className="text-[10px] opacity-80">
                    Evaporated aluminum over oxide windows (Scalable)
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setWireTech("kilby-flying-wires")}
                  className={`p-2 rounded border text-left transition-colors ${
                    wireTech === "kilby-flying-wires"
                      ? "bg-amber-700 text-white border-amber-800 font-bold"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300"
                  }`}
                >
                  <div>Kilby Flying Gold Wires</div>
                  <div className="text-[10px] opacity-80">
                    Hand-soldered individual wires (Unscalable)
                  </div>
                </button>
              </div>
            </div>

            <div>
              <span className="text-xs font-mono block text-ink-700 dark:text-ink-300 font-semibold mb-1">
                Layer Inspection Filter
              </span>
              <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
                {(["all", "silicon", "oxide", "metal"] as const).map((layer) => (
                  <button
                    key={layer}
                    type="button"
                    onClick={() => setActiveLayer(layer)}
                    className={`py-1 rounded text-center capitalize ${
                      activeLayer === layer
                        ? "bg-ink-800 text-white font-bold"
                        : "bg-parchment-200 dark:bg-ink-900 text-ink-600 dark:text-ink-400"
                    }`}
                  >
                    {layer}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
