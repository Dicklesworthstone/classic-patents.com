"use client";

import { Cpu, RotateCcw } from "lucide-react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import {
  BARDEEN_REPORTED_SAMPLES,
  type BardeenOperatingSampleNumber,
  bardeenCarrierPath,
  stepBardeenPointContact,
} from "@/physics/bardeenPointContactKernel";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { ClaimConstraintToggle } from "./ClaimConstraintToggle";

export function BardeenTransistorSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-2524035-bardeen-transistor");
  const operatingSample = Math.min(3, Math.max(1, Math.round(params.operatingSample ?? 1)));
  const pointSpacingMils = params.pointSpacingMils ?? 2;
  const claim1Active = (params.claim1Active ?? 1) >= 0.5;
  const state = stepBardeenPointContact({
    operatingSample,
    pointSpacingMils,
    claim1Active,
  });
  const sample = state.sample;

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-emerald-500 animate-pulse" />
            <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50">
              US 2,524,035 Fig. 1 Teaching Model
            </h3>
          </div>
          <p className="text-sm sm:text-base text-ink-700 dark:text-ink-300 mt-1">
            Inspect the printed block, surface layer, barrier, contacts, and the three reported
            operating samples.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 text-xs sm:text-sm font-mono font-bold border border-emerald-300 dark:border-emerald-800 shadow-2xs">
            Reported Sample {sample.number}
          </div>
          <button
            type="button"
            onClick={resetParams}
            aria-label="Reset Simulation"
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Visual Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-canvas border border-parchment-300 dark:border-ink-800 p-6 relative min-h-[380px] overflow-hidden">
          <svg
            viewBox="0 0 600 320"
            role="img"
            aria-label={`Point-contact transistor simulation: operating sample ${sample.number}, gold point spacing ${pointSpacingMils} mils, claim 1 ${claim1Active ? "active" : "inactive"}`}
            className="w-full h-auto max-h-[340px]"
          >
            {/* Background Lab */}
            <rect width="600" height="320" fill="#0a0f1d" />

            {/* Germanium Crystal Block */}
            <g transform="translate(150, 160)">
              {/* Supporting block 1 */}
              <polygon
                points="0,0 300,0 270,100 30,100"
                fill="#334155"
                stroke="#64748b"
                strokeWidth="2"
              />
              <text
                x="100"
                y="55"
                fill="#94a3b8"
                fontSize="13"
                fontFamily="monospace"
                fontWeight="bold"
              >
                N-TYPE BLOCK 1
              </text>

              {/* Base Electrode (Bottom Metal Plate) */}
              <rect
                x="25"
                y="100"
                width="250"
                height="15"
                fill="#d97706"
                stroke="#fbbf24"
                strokeWidth="1.5"
              />
              <text
                x="95"
                y="112"
                fill="#0f172a"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                PLATED BASE 2
              </text>

              {/* Surface layer 3 and barrier 4, exaggerated for legibility. */}
              <rect x="20" y="0" width="260" height="7" fill="#38bdf8" opacity="0.7" />
              <rect x="20" y="7" width="260" height="5" fill="#a78bfa" opacity="0.65" />
            </g>

            {/* Pointed spring-wire emitter 5 */}
            <g transform={`translate(${300 - state.pointGapSvgPx}, 160)`}>
              <polygon
                points="-12,-100 0,-100 0,0 -8,-2"
                fill="#b7791f"
                stroke="#f59e0b"
                strokeWidth="1.5"
              />
              <circle cx="0" cy="0" r="3" fill="#ef4444" />
              <text
                x="-45"
                y="-110"
                fill="#ef4444"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
              >
                EMITTER 5
              </text>
              <text x="-45" y="-95" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                +{sample.emitterBiasVolts} V reported bias
              </text>
            </g>

            {/* Pointed spring-wire collector 6 */}
            <g
              transform={`translate(${300 + state.pointGapSvgPx}, 160)`}
              opacity={state.collectorCollectionActive ? 1 : 0.2}
            >
              <polygon
                points="0,-100 12,-100 8,-2 0,0"
                fill="#b7791f"
                stroke="#f59e0b"
                strokeWidth="1.5"
              />
              <circle cx="0" cy="0" r="3" fill="#38bdf8" />
              <text
                x="10"
                y="-110"
                fill="#38bdf8"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
              >
                COLLECTOR 6
              </text>
              <text x="10" y="-95" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                {sample.collectorBiasVolts} V reported bias
              </text>
            </g>

            {/* Schematic carrier path, visible only when Claim 1 topology is present. */}
            <g>
              {Array.from({ length: state.carrierStreamCount }).map((_, i) => {
                const { cx, cy } = bardeenCarrierPath(
                  i,
                  state.pointGapSvgPx,
                  state.carrierStreamCount,
                );
                return (
                  <g key={i}>
                    <circle cx={cx} cy={cy} r="3" fill="#ef4444" />
                  </g>
                );
              })}
            </g>

            {/* Point Spacing Dimension Line */}
            <g transform="translate(300, 130)">
              <line
                x1={-state.pointGapSvgPx}
                y1="0"
                x2={state.pointGapSvgPx}
                y2="0"
                stroke="#f59e0b"
                strokeWidth="1.5"
              />
              <line
                x1={-state.pointGapSvgPx}
                y1="-5"
                x2={-state.pointGapSvgPx}
                y2="5"
                stroke="#f59e0b"
                strokeWidth="1.5"
              />
              <line
                x1={state.pointGapSvgPx}
                y1="-5"
                x2={state.pointGapSvgPx}
                y2="5"
                stroke="#f59e0b"
                strokeWidth="1.5"
              />
              <text
                x="-18"
                y="-8"
                fill="#f59e0b"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {state.pointSpacingMils} mils
              </text>
            </g>
          </svg>

          {/* Telemetry Strip */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs sm:text-sm font-mono pt-3 border-t border-ink-800 text-ink-300">
            <div>
              <span className="text-ink-400 block text-xs">INPUT BIAS</span>
              <span className="text-emerald-400 font-bold text-sm sm:text-base">
                +{sample.emitterBiasVolts} V
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs">OUTPUT BIAS</span>
              <span className="text-amber-400 font-bold text-sm sm:text-base">
                {sample.collectorBiasVolts} V
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs">REPORTED VOLTAGE GAIN</span>
              <span className="text-blue-400 font-bold text-sm sm:text-base">
                {sample.voltageGainFactor}×
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs">REPORTED POWER GAIN</span>
              <span className="text-purple-400 font-bold text-sm sm:text-base">
                {sample.powerGainFactor}×
              </span>
            </div>
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/80 dark:bg-ink-900/70 p-5 space-y-4 shadow-sm">
            <span className="font-serif font-bold text-base sm:text-lg text-ink-950 dark:text-parchment-50 block">
              Source-Bounded Controls
            </span>

            {/* The patent's three measured operating samples. */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Table I operating sample
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  No. {sample.number}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {([1, 2, 3] as BardeenOperatingSampleNumber[]).map((number) => (
                  <button
                    key={number}
                    type="button"
                    aria-pressed={sample.number === number}
                    onClick={() => updateParam("operatingSample", number)}
                    className={`rounded-lg border px-3 py-2 font-mono text-xs transition-colors ${
                      sample.number === number
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-parchment-300 dark:border-ink-700 text-ink-800 dark:text-parchment-200"
                    }`}
                  >
                    Sample {BARDEEN_REPORTED_SAMPLES[number].number}
                  </button>
                ))}
              </div>
            </div>

            <SensitivitySlider
              id="bardeenSimPointSpacing"
              patentId="us-2524035-bardeen-transistor"
              paramKey="pointSpacingMils"
              label="Preferred Contact Spacing"
              value={state.pointSpacingMils}
              min={1}
              max={10}
              step={0.5}
              unit=" mils"
              onChange={(val) => updateParam("pointSpacingMils", val)}
              allParams={params}
            />

            <ClaimConstraintToggle
              patentId="us-2524035-bardeen-transistor"
              claimStates={{ 1: claim1Active }}
              onToggleClaim={(claimNo, active) => {
                updateParam(claimConstraintStateParamId(claimNo), active ? 1 : 0);
              }}
            />

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-ink-950 dark:text-parchment-100 text-xs sm:text-sm font-sans">
              <span className="font-bold text-emerald-900 dark:text-emerald-300 block font-mono text-xs uppercase tracking-wider mb-1">
                Measurement boundary
              </span>
              <p className="leading-relaxed">
                The gain, resistance, voltage, and power values above are the patent&apos;s reported
                Sample {sample.number} measurements. The moving points illustrate the described
                collection path; they do not assert carrier lifetime, transit time, or universal
                gain. The field example preserves the patent&apos;s own qualified comparison of 10 V
                across a believed 10⁻⁴ cm layer-plus-barrier thickness.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
