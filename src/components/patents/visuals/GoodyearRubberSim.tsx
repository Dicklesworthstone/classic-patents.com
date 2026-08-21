"use client";

import { Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { goodyearChainPost, stepGoodyearRubber } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";

export function GoodyearRubberSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-3633-goodyear-rubber");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const sulfurPercent = params.sulfurPct ?? 8;
  const specimenTempC = params.specimenTempC ?? 35;
  const stretchLambda = params.appliedTensileStretch ?? 1.8;
  const vulcanTempC = params.vulcanTemp ?? 145;

  const rubber = stepGoodyearRubber(vulcanTempC, sulfurPercent, 30, stretchLambda, specimenTempC);
  const isRaw = sulfurPercent < 2;
  const isEbonite = sulfurPercent > 20;
  const isElastic = !isRaw && !isEbonite && !rubber.isStickyOrBrittle;
  const isMelted = rubber.isRawGumMelted;
  const isBrittle = rubber.isRawGumBrittle;

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-500" />
            <h3 className="font-serif text-xl font-bold text-ink-900 dark:text-parchment-100">
              Goodyear India-Rubber Fabric Process & Network Simulation (US 3,633)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-1">
            Illustrative molecular model demonstrating how sulfur and heat treatment stabilize raw
            India-rubber against temperature extremes and solvents.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end lg:self-auto">
          <span
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border shadow-sm ${
              isMelted
                ? "bg-red-100 dark:bg-red-950 border-red-400 dark:border-red-700 text-red-900 dark:text-red-300 animate-pulse"
                : isBrittle
                  ? "bg-blue-100 dark:bg-blue-950 border-blue-400 dark:border-blue-700 text-blue-900 dark:text-blue-300"
                  : isElastic
                    ? "bg-emerald-100 dark:bg-emerald-950 border-emerald-400 dark:border-emerald-700 text-emerald-900 dark:text-emerald-300"
                    : "bg-amber-100 dark:bg-amber-950 border-amber-400 dark:border-amber-700 text-amber-900 dark:text-amber-300"
            }`}
          >
            {isMelted
              ? "✗ RAW GUM: Softened / melted by heat"
              : isBrittle
                ? "✗ RAW GUM: Hardened / brittle in cold"
                : isElastic
                  ? "✓ HEAT-TREATED COMPOUND: Stable elastic fabric"
                  : "✓ HIGH-SULFUR: Hard ebonite resin"}
          </span>
          <button
            type="button"
            onClick={() => {
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            aria-label={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              resetParams();
              soundEngine.playSwitchClick();
            }}
            aria-label="Reset Simulation"
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visual Canvas & Molecular Chains */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-ink-950 p-6 border border-parchment-200 dark:border-ink-800 relative min-h-[360px] space-y-4">
          <svg viewBox="0 0 440 220" className="w-full max-w-md h-auto select-none">
            {/* Molecular Polyisoprene Chains */}
            {[-40, -15, 10, 35].map((yOffset, idx) => {
              const stretch = rubber.chainStretchPx;
              const yBase = 110 + yOffset;
              const sag = isMelted ? rubber.chainSagPx : 0;
              return (
                <g key={idx}>
                  <path
                    d={`M 40,${yBase + sag} Q ${220 + stretch},${yBase + sag * rubber.chainSagBezierScale} ${380 + (isElastic ? stretch : 0)},${yBase}`}
                    fill="none"
                    stroke={isMelted ? "#ef4444" : "#f59e0b"}
                    strokeWidth={3 + rubber.chainHeatSample * 3}
                    strokeLinecap="round"
                  />

                  {/* Sulfur Disulfide Cross-Links between chains */}
                  {!isRaw && idx < 3 && (
                    <g stroke="#eab308" strokeWidth="2.5">
                      {rubber.chainPostXs.map((_: number, i: number) => {
                        const post = goodyearChainPost(i, rubber.chainPostXs);
                        return (
                          <g key={post.x}>
                            <line
                              x1={post.x}
                              y1={yBase}
                              x2={post.x}
                              y2={yBase + rubber.chainPostH}
                            />
                            <circle
                              cx={post.x}
                              cy={yBase + rubber.chainAtomDy}
                              r={rubber.chainAtomR}
                              fill="#ca8a04"
                            />
                          </g>
                        );
                      })}
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Telemetry Footer */}
          <div className="w-full grid grid-cols-3 gap-2 text-center text-xs font-mono pt-3 border-t border-ink-800 text-ink-300">
            <div>
              <span className="text-ink-500 block text-[10px]">SULFUR RATIO</span>
              <span className="text-amber-400 font-bold">{sulfurPercent}% Sulfur</span>
            </div>
            <div>
              <span className="text-ink-500 block text-[10px]">TEMPERATURE</span>
              <span className="text-orange-400 font-bold">{specimenTempC}°C</span>
            </div>
            <div>
              <span className="text-ink-500 block text-[10px]">ELASTIC RETURN</span>
              <span className={isElastic ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                {rubber.elasticReturnPct}% / {rubber.tensileStrengthPsi} psi
              </span>
            </div>
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/70 dark:bg-ink-900/60 p-5 space-y-4">
            <span className="font-serif font-bold text-sm text-ink-900 dark:text-parchment-100 block">
              Compounding & Process Parameters (Educational Model)
            </span>
            <div className="rounded-lg border border-parchment-200 dark:border-ink-800 p-2.5 text-[11px] font-mono space-y-1">
              <div className="uppercase tracking-wider text-ink-500">Cure kinetics</div>
              <div className="flex justify-between">
                <span>regime</span>
                <span className="font-bold">{rubber.regime}</span>
              </div>
              <div className="flex justify-between">
                <span>relative rate</span>
                <span className="font-bold">{rubber.rateRel.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>cross-link</span>
                <span className="font-bold">{rubber.crossLinkDensity} mol/cm³</span>
              </div>
              <div className="flex justify-between">
                <span>Tg</span>
                <span className="font-bold">{rubber.glassTransitionTempC} °C</span>
              </div>
            </div>

            {/* Sulfur Percentage Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Sulfur Compounding Content
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {sulfurPercent}%
                </span>
              </div>
              <input
                type="range"
                aria-label="Sulfur Compounding Content"
                min="0"
                max="30"
                value={sulfurPercent}
                onChange={(e) => updateParam("sulfurPct", Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-ink-500 font-mono">
                <span>0% (Raw Gum)</span>
                <span>8% (Tire)</span>
                <span>30% (Ebonite)</span>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-amber-700 dark:text-amber-400 pt-1">
                <span>Crosslinks: {rubber.crossLinkDensity} mol/cm³</span>
                <span className="capitalize">State: {rubber.regime}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Vulcanization Temperature
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {vulcanTempC}°C
                </span>
              </div>
              <input
                type="range"
                aria-label="Vulcanization Temperature"
                min="110"
                max="190"
                step="2"
                value={vulcanTempC}
                onChange={(e) => updateParam("vulcanTemp", Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Specimen Temperature
                </span>
                <span className="text-orange-600 dark:text-orange-400 font-bold">
                  {specimenTempC}°C
                </span>
              </div>
              <input
                type="range"
                aria-label="Specimen Temperature"
                min="-20"
                max="100"
                value={specimenTempC}
                onChange={(e) => updateParam("specimenTempC", Number(e.target.value))}
                className="w-full accent-orange-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Tensile Stretch (λ)
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {stretchLambda.toFixed(2)}×
                </span>
              </div>
              <input
                type="range"
                aria-label="Tensile Stretch"
                min="1"
                max="2.5"
                step="0.05"
                value={stretchLambda}
                onChange={(e) => updateParam("appliedTensileStretch", Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
