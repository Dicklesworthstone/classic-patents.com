"use client";

import { RotateCcw } from "lucide-react";
import { useId, useMemo } from "react";
import { stepLemelsonWarehouseTopology } from "@/physics/lemelsonWarehouseKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

const PATENT_ID = "us-3119501-lemelson-automatic-warehousing";

function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function LemelsonAutomaticWarehousingSim() {
  const railId = useId();
  const levelId = useId();
  const shuttleId = useId();
  const autoId = useId();
  const { params, updateParam, resetParams } = usePatentPhysics(PATENT_ID);
  const pose = useMemo(() => stepLemelsonWarehouseTopology(params), [params]);
  const rail = pose.railAddressFraction;
  const level = pose.levelAddressFraction;
  const shuttle = pose.shuttleExtensionFraction;
  const automatic = Number(pose.automaticAddressing);
  const carrierX = 150 + pose.carrierX * 290;
  const carrierY = 310 - pose.carrierY * 192;
  const shuttleX = carrierX + pose.shuttleZ * 58;
  const shuttleY = carrierY - pose.shuttleZ * 24;

  return (
    <section className="overflow-hidden rounded-2xl border border-cyan-800/60 bg-slate-950 text-slate-100 shadow-2xl">
      <header className="border-b border-cyan-900/70 bg-slate-900/80 px-4 py-3 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.16em] text-cyan-300">
          US 3,119,501 · AUTOMATIC WAREHOUSING TOPOLOGY
        </p>
        <h3 className="mt-1 font-serif text-xl text-white">
          Lemelson warehouse address instrument
        </h3>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">
          The grant's carrier travels on a rail, changes level, and projects a shuttle into a
          storage bay. Its controls describe photoelectric/marker and preset-counting logic, not a
          source-backed warehouse speed, payload, or throughput.
        </p>
      </header>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="min-w-0 border-b border-cyan-900/70 p-3 lg:border-b-0 lg:border-r sm:p-5">
          <svg
            viewBox="0 0 640 410"
            role="img"
            aria-label="Normalized automatic warehouse system with rail carrier vertical elevator shuttle and storage bay"
            className="h-auto w-full rounded-xl border border-slate-700 bg-[radial-gradient(circle_at_35%_20%,_#12365b,_#020617_72%)]"
          >
            <defs>
              <pattern id="lemelson-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#173b5d" strokeWidth="1" />
              </pattern>
              <marker
                id="lemelson-arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
              </marker>
            </defs>
            <rect width="640" height="410" fill="url(#lemelson-grid)" />
            <text x="20" y="29" fill="#67e8f9" fontSize="12" fontFamily="monospace">
              FIGS. 1–3 · NORMALIZED STORAGE/RETRIEVAL EXHIBIT
            </text>
            <text x="20" y="393" fill="#94a3b8" fontSize="10" fontFamily="monospace">
              source topology only — no scale, payload, velocity, motor, or throughput claim
            </text>

            <line
              x1="115"
              y1="336"
              x2="475"
              y2="336"
              stroke="#94a3b8"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <line
              x1="115"
              y1="336"
              x2="475"
              y2="336"
              stroke="#22d3ee"
              strokeWidth="3"
              strokeDasharray="12 7"
            />
            <text x="96" y="358" fill="#bae6fd" fontSize="11" fontFamily="monospace">
              guide rail / conveying path
            </text>
            <line x1={carrierX} y1="322" x2={carrierX} y2="90" stroke="#67e8f9" strokeWidth="12" />
            <line
              x1={carrierX - 20}
              y1="322"
              x2={carrierX - 20}
              y2="90"
              stroke="#0e7490"
              strokeWidth="4"
            />
            <rect
              x={carrierX - 35}
              y={carrierY - 18}
              width="70"
              height="36"
              rx="6"
              fill="#1e293b"
              stroke="#fbbf24"
              strokeWidth="3"
            />
            <text
              x={carrierX}
              y={carrierY + 5}
              textAnchor="middle"
              fill="#fde68a"
              fontSize="11"
              fontFamily="monospace"
            >
              CARRIER
            </text>
            <line
              x1={carrierX + 36}
              y1={carrierY}
              x2={shuttleX}
              y2={shuttleY}
              stroke="#c084fc"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <circle
              cx={shuttleX}
              cy={shuttleY}
              r="11"
              fill="#c084fc"
              stroke="#f3e8ff"
              strokeWidth="2"
            />
            <text
              x={carrierX - 52}
              y={carrierY - 28}
              fill="#e9d5ff"
              fontSize="10"
              fontFamily="monospace"
            >
              shuttle
            </text>

            {Array.from({ length: 9 }, (_, index) => index).map((index) => {
              const row = Math.floor(index / 3);
              const col = index % 3;
              const x = 105 + col * 145;
              const y = 103 + row * 73;
              const active =
                Math.abs(x + 45 - carrierX) < 55 &&
                Math.abs(y + 23 - carrierY) < 36 &&
                pose.shuttleExtensionFraction > 0.15;
              return (
                <g key={`${row}-${col}`}>
                  <rect
                    x={x}
                    y={y}
                    width="90"
                    height="46"
                    rx="4"
                    fill={active ? "#164e63" : "#172554"}
                    stroke={active ? "#67e8f9" : "#475569"}
                    strokeWidth={active ? "3" : "1"}
                  />
                  <text
                    x={x + 45}
                    y={y + 29}
                    textAnchor="middle"
                    fill="#cbd5e1"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    BAY
                  </text>
                </g>
              );
            })}
            <text x="105" y="82" fill="#bae6fd" fontSize="11" fontFamily="monospace">
              STORAGE VOLUMES / BAYS
            </text>
            <line
              x1={carrierX}
              y1={carrierY - 30}
              x2={carrierX}
              y2="94"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeDasharray="5 5"
              markerEnd="url(#lemelson-arrow)"
            />
            <text x={carrierX + 8} y="106" fill="#fde68a" fontSize="10" fontFamily="monospace">
              vertical address
            </text>
            <line
              x1="110"
              y1="369"
              x2={carrierX - 9}
              y2="369"
              stroke="#fbbf24"
              strokeWidth="2"
              markerEnd="url(#lemelson-arrow)"
            />
            <text x="110" y="383" fill="#fde68a" fontSize="10" fontFamily="monospace">
              rail address
            </text>

            <g transform="translate(30 72)">
              <rect width="150" height="70" rx="7" fill="#0f172a" stroke="#38bdf8" />
              <text x="12" y="22" fill="#67e8f9" fontSize="11" fontFamily="monospace">
                SCANNING RELAY
              </text>
              <text x="12" y="42" fill="#cbd5e1" fontSize="10" fontFamily="monospace">
                marker / photoelectric cue
              </text>
              <text x="12" y="57" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                source-described logic
              </text>
            </g>
            <g transform="translate(30 162)">
              <rect width="150" height="70" rx="7" fill="#0f172a" stroke="#a78bfa" />
              <text x="12" y="22" fill="#c4b5fd" fontSize="11" fontFamily="monospace">
                PRESET COUNTER
              </text>
              <text x="12" y="42" fill="#cbd5e1" fontSize="10" fontFamily="monospace">
                address / uncount sequence
              </text>
              <text x="12" y="57" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                not a timing calibration
              </text>
            </g>
          </svg>
          <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
            <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-2">
              <p className="font-mono text-cyan-300">STATE</p>
              <p className="mt-1 text-slate-200">{pose.addressState}</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-2">
              <p className="font-mono text-amber-300">ACTIVE PROBE</p>
              <p className="mt-1 text-slate-200">Claim {pose.activeClaim}</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-2">
              <p className="font-mono text-purple-300">SHUTTLE</p>
              <p className="mt-1 text-slate-200">{percent(pose.shuttleZ)} normalized</p>
            </div>
          </div>
        </div>
        <form className="space-y-4 p-4 sm:p-5" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor={railId} className="block text-xs font-medium text-slate-200">
            Rail address{" "}
            <span className="float-right font-mono text-cyan-300">{percent(rail)}</span>
            <input
              id={railId}
              className="mt-1 w-full accent-cyan-400"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={rail}
              aria-label="Rail address"
              onChange={(event) => updateParam("railAddressFraction", Number(event.target.value))}
            />
          </label>
          <label htmlFor={levelId} className="block text-xs font-medium text-slate-200">
            Vertical address{" "}
            <span className="float-right font-mono text-amber-300">{percent(level)}</span>
            <input
              id={levelId}
              className="mt-1 w-full accent-amber-400"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={level}
              aria-label="Vertical address"
              onChange={(event) => updateParam("levelAddressFraction", Number(event.target.value))}
            />
          </label>
          <label htmlFor={shuttleId} className="block text-xs font-medium text-slate-200">
            Shuttle extension{" "}
            <span className="float-right font-mono text-purple-300">{percent(shuttle)}</span>
            <input
              id={shuttleId}
              className="mt-1 w-full accent-purple-400"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={shuttle}
              aria-label="Shuttle extension"
              onChange={(event) =>
                updateParam("shuttleExtensionFraction", Number(event.target.value))
              }
            />
          </label>
          <label htmlFor={autoId} className="block text-xs font-medium text-slate-200">
            Addressing logic
            <select
              id={autoId}
              className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 px-2 py-2 text-sm text-slate-100"
              value={automatic}
              aria-label="Automatic addressing"
              onChange={(event) => updateParam("automaticAddressing", Number(event.target.value))}
            >
              <option value="1">Claim sequence shown</option>
              <option value="0">Manual display comparison</option>
            </select>
          </label>
          <p className="rounded-lg border border-rose-900/70 bg-rose-950/40 p-3 text-xs leading-5 text-rose-100">
            {pose.refusal.reason}
          </p>
          <button
            type="button"
            onClick={resetParams}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-600 bg-slate-900 px-3 text-sm text-slate-100 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
          >
            <RotateCcw className="h-4 w-4" />
            Reset source exhibit
          </button>
        </form>
      </div>
    </section>
  );
}
