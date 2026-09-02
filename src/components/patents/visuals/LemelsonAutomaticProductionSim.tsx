"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import {
  readLemelsonAutomaticProductionControls,
  stepLemelsonAutomaticProductionTopology,
} from "@/physics/lemelsonAutomaticProductionKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

const PATENT_ID = "us-3313014-lemelson-automatic-production";
const STATION_X = [245, 410, 575] as const;

function statusColor(active: boolean, enabled: boolean) {
  if (!enabled) return "#475569";
  return active ? "#34d399" : "#fbbf24";
}

export function LemelsonAutomaticProductionSim() {
  const { params, updateParam, resetParams } = usePatentPhysics(PATENT_ID);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true, 7: true });
  const controls = readLemelsonAutomaticProductionControls(params);
  const state = stepLemson(controls);
  const carrierX = 72 + controls.carrierAddressFraction * 545;
  const platformY = 199 + (1 - controls.liftFraction) * 72;
  const reach = 36 + controls.reachFraction * 68;

  return (
    <section className="space-y-4 rounded-xl border border-border/40 bg-card/60 p-4 backdrop-blur">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border/30 pb-3">
        <div>
          <p className="font-mono text-[10px] tracking-[0.14em] text-primary">
            US 3,313,014 · FIGS. 1–5, 13
          </p>
          <h3 className="mt-1 text-base font-semibold text-foreground">
            Carrier, marker, station-coupling, and release instrument
          </h3>
          <p className="mt-1 max-w-3xl text-xs leading-relaxed text-muted-foreground">
            A source-bounded topology of the overhead carrier, Mx/Mz/My positioning members, marker
            sensing, station contacts, and ordered controller cycle. Coordinates are display
            fractions because the grant does not print travel lengths, payloads, speeds, or forces.
          </p>
        </div>
        <button
          type="button"
          onClick={resetParams}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-border/60 bg-background px-3 text-xs font-medium text-foreground hover:bg-muted"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
      </header>

      <div className="overflow-hidden rounded-lg border border-border/30 bg-slate-950">
        <svg
          viewBox="0 0 690 410"
          className="aspect-[69/41] w-full"
          role="img"
          aria-label="Lemelson automatic production carrier and station coupling topology"
        >
          <defs>
            <linearGradient id="lemelson-rail" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#475569" />
              <stop offset="0.5" stopColor="#cbd5e1" />
              <stop offset="1" stopColor="#475569" />
            </linearGradient>
            <marker
              id="lemelson-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa" />
            </marker>
          </defs>

          <rect width="690" height="410" fill="#020617" />
          <text x="30" y="30" fill="#93c5fd" fontFamily="monospace" fontSize="11">
            DISPLAY-SPACE FIG. 2 / 3 CARRIER TOPOLOGY — NOT DIMENSIONAL RECONSTRUCTION
          </text>
          <rect x="50" y="76" width="585" height="18" rx="6" fill="url(#lemelson-rail)" />
          <path d="M50 103H635" stroke="#1e3a5f" strokeWidth="5" strokeDasharray="5 7" />
          <text x="56" y="68" fill="#cbd5e1" fontSize="10">
            overhead guideway 21
          </text>

          {STATION_X.map((x, index) => {
            const selected = Math.abs(carrierX - x) < 72;
            const operating = selected && state.machineCommandAuthorized;
            return (
              <g key={x}>
                <path
                  d={`M${x} 104 V 298`}
                  stroke="#334155"
                  strokeWidth="2"
                  strokeDasharray="4 5"
                />
                <rect
                  x={x - 48}
                  y="270"
                  width="96"
                  height="76"
                  rx="8"
                  fill="#172554"
                  stroke={statusColor(operating, state.markerMatched)}
                  strokeWidth="2"
                />
                <rect
                  x={x - 34}
                  y="292"
                  width="68"
                  height="16"
                  rx="3"
                  fill={operating ? "#34d399" : "#475569"}
                />
                <text x={x} y="332" textAnchor="middle" fill="#bfdbfe" fontSize="10">
                  station {index + 1}
                </text>
                <text x={x} y="347" textAnchor="middle" fill="#94a3b8" fontSize="9">
                  tool MT
                </text>
                <circle
                  cx={x}
                  cy="126"
                  r="7"
                  fill={selected && state.markerMatched ? "#fbbf24" : "#334155"}
                />
                <text x={x} y="146" textAnchor="middle" fill="#94a3b8" fontSize="9">
                  marker 61
                </text>
              </g>
            );
          })}

          <g transform={`translate(${carrierX} 0)`}>
            <rect
              x="-30"
              y="52"
              width="60"
              height="38"
              rx="7"
              fill="#0f766e"
              stroke="#5eead4"
              strokeWidth="2"
            />
            <circle cx="-17" cy="92" r="7" fill="#cbd5e1" />
            <circle cx="17" cy="92" r="7" fill="#cbd5e1" />
            <text x="0" y="75" textAnchor="middle" fill="#ccfbf1" fontSize="10">
              Mx / 22
            </text>
            <rect
              x="-11"
              y="90"
              width="22"
              height={platformY - 100}
              rx="5"
              fill="#0f766e"
              stroke="#99f6e4"
            />
            <rect
              x="-36"
              y={platformY - 10}
              width="72"
              height="20"
              rx="4"
              fill="#0e7490"
              stroke="#67e8f9"
            />
            <text x="0" y={platformY + 4} textAnchor="middle" fill="#ecfeff" fontSize="9">
              Mz / 35
            </text>
            <rect
              x="0"
              y={platformY - 6}
              width={reach}
              height="12"
              rx="4"
              fill="#7c3aed"
              stroke="#ddd6fe"
            />
            <rect
              x={reach - 5}
              y={platformY - 23}
              width="19"
              height="44"
              rx="4"
              fill={state.carrierLocked ? "#f59e0b" : "#64748b"}
              stroke="#fde68a"
            />
            <text x={reach + 18} y={platformY + 30} fill="#ddd6fe" fontSize="9">
              My / fixture
            </text>
            <rect x="-23" y="163" width="46" height="26" rx="4" fill="#1d4ed8" stroke="#93c5fd" />
            <text x="0" y="180" textAnchor="middle" fill="#dbeafe" fontSize="9">
              47
            </text>
          </g>

          <path
            d={`M${carrierX + reach + 15} ${platformY - 1} L${carrierX + reach + 15} 241`}
            stroke={state.controllerCoupled ? "#34d399" : "#fb7185"}
            strokeWidth="4"
            strokeDasharray={state.controllerCoupled ? "0" : "5 5"}
          />
          <text
            x={Math.min(605, carrierX + reach + 25)}
            y={platformY - 34}
            fill="#a7f3d0"
            fontSize="9"
          >
            85 / 86 / 87 coupling
          </text>

          <g transform="translate(28 364)">
            <rect width="634" height="28" rx="7" fill="#0f172a" stroke="#334155" />
            {[
              ["marker", state.markerMatched],
              ["retain", state.carrierLocked],
              ["position", state.carrierLocked],
              ["couple", state.controllerCoupled],
              ["operate", state.machineCommandAuthorized],
              ["release", state.releaseAuthorized],
            ].map(([label, isActive], index) => (
              <g key={String(label)} transform={`translate(${10 + index * 104} 0)`}>
                <circle cx="10" cy="14" r="6" fill={isActive ? "#34d399" : "#334155"} />
                <text x="22" y="18" fill={isActive ? "#d1fae5" : "#94a3b8"} fontSize="10">
                  {label}
                </text>
              </g>
            ))}
          </g>
          <path
            d="M84 238 H154"
            stroke="#60a5fa"
            strokeWidth="2"
            markerEnd="url(#lemelson-arrow)"
          />
          <text x="84" y="222" fill="#bfdbfe" fontSize="10">
            portable record/controller → station command only after coupling
          </text>
        </svg>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <FractionSlider
          id="lemelson-carrier-address"
          label="Carrier address"
          value={controls.carrierAddressFraction}
          onChange={(value) => updateParam("carrierAddressFraction", value)}
        />
        <FractionSlider
          id="lemelson-lift"
          label="Mz lift pose"
          value={controls.liftFraction}
          onChange={(value) => updateParam("liftFraction", value)}
        />
        <FractionSlider
          id="lemelson-reach"
          label="My platform reach"
          value={controls.reachFraction}
          onChange={(value) => updateParam("reachFraction", value)}
        />
        <FractionSlider
          id="lemelson-cycle"
          label="Ordered cycle"
          value={controls.cycleProgress}
          onChange={(value) => updateParam("cycleProgress", value)}
        />
        <Toggle
          label="Station marker sensed"
          checked={controls.stationDetected >= 0.5}
          onChange={(checked) => updateParam("stationDetected", checked ? 1 : 0)}
        />
        <Toggle
          label="Controller contacts coupled"
          checked={controls.stationCoupled >= 0.5}
          onChange={(checked) => updateParam("stationCoupled", checked ? 1 : 0)}
        />
      </div>

      <div className="grid gap-3 text-xs sm:grid-cols-2">
        <p className="rounded-lg border border-primary/25 bg-primary/10 p-3 text-foreground">
          <strong>Claim probe:</strong> {state.activeClaimProbe} · {state.phase}
        </p>
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 leading-relaxed text-amber-950 dark:text-amber-100">
          <strong>Quantitative refusal:</strong> {state.sourceBoundary.reason}
        </p>
      </div>

      <div className="rounded-lg border border-border/40 bg-background/55 p-3">
        <ClaimConstraintToggle
          patentId={PATENT_ID}
          claimStates={claimStates}
          onClaimStateChange={(num, active) => setClaimStates((prev) => ({ ...prev, [num]: active }))}
        />
      </div>
    </section>
  );
}

function stepLemson(params: Parameters<typeof stepLemelsonAutomaticProductionTopology>[0]) {
  return stepLemelsonAutomaticProductionTopology(params);
}

function FractionSlider({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label htmlFor={id} className="rounded-lg border border-border/40 bg-background/55 p-3 text-xs">
      <span className="mb-2 flex justify-between gap-3">
        <span className="font-medium text-foreground">{label}</span>
        <span className="font-mono text-primary">{(value * 100).toFixed(0)}% display</span>
      </span>
      <input
        id={id}
        className="h-1.5 w-full accent-primary"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex min-h-[72px] items-center justify-between gap-3 rounded-lg border border-border/40 bg-background/55 p-3 text-xs">
      <span className="font-medium text-foreground">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-primary"
      />
    </label>
  );
}
