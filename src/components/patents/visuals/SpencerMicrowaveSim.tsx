"use client";

import { RotateCcw, Waves } from "lucide-react";
import { stepSpencerMicrowaveSource } from "@/physics/spencerMicrowaveKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

const PATENT_ID = "us-2495429-spencer-microwave";

export function SpencerMicrowaveSim() {
  const { params, updateParam, resetParams } = usePatentPhysics(PATENT_ID);
  const sourceState = stepSpencerMicrowaveSource(params);
  const isEnergized = sourceState.energyPathActive;
  const toggleEnergy = () => updateParam("rfPowerSetting", isEnergized ? 0 : 1);

  return (
    <div
      className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-5 shadow-patent"
      data-testid="spencer-microwave-two"
      data-source-path={isEnergized ? "active" : "disabled"}
      data-source-path-continuous={String(sourceState.sourcePathContinuous)}
      data-source-wavelength-reference-m={sourceState.sourceWavelengthReferenceM}
      data-vacuum-frequency-at-ten-centimeters-hz={sourceState.vacuumFrequencyAtTenCentimetersHz}
      data-kernel-source={sourceState.kernelSource}
      data-quantitative-tube-model="refused"
      data-quantitative-cooking-model="refused"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Waves
              className={`w-4 h-4 text-cyan-500 ${isEnergized ? "animate-pulse" : "opacity-40"}`}
            />
            <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
              Source drawing reader — US 2,495,429
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-0.5">
            Two magnetron oscillators feed a common wave guide and a conveyor treatment region.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label={
              isEnergized ? "Stop illustrative energy path" : "Start illustrative energy path"
            }
            type="button"
            onClick={toggleEnergy}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors ${
              isEnergized
                ? "bg-cyan-700 text-white border-cyan-800 font-bold"
                : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            {isEnergized ? "ENERGY PATH ON" : "ENERGY PATH OFF"}
          </button>
          <button
            type="button"
            onClick={resetParams}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium border border-parchment-300 dark:border-ink-700 bg-parchment-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 hover:bg-parchment-200"
          >
            <RotateCcw className="inline-block w-3.5 h-3.5 mr-1" /> Reset source reader
          </button>
        </div>
      </div>

      <div className="my-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-xl bg-ink-950 p-4 sm:p-6 border border-parchment-200 dark:border-ink-800">
          <svg
            viewBox="0 0 760 300"
            className="w-full h-auto select-none"
            role="img"
            aria-label="Source-bounded schematic of the Spencer patent apparatus"
          >
            <rect
              x="18"
              y="18"
              width="724"
              height="264"
              rx="10"
              fill="#0f172a"
              stroke="#64748b"
              strokeWidth="3"
            />
            <g fill="#334155" stroke="#cbd5e1" strokeWidth="2">
              <rect x="42" y="72" width="110" height="58" rx="6" />
              <rect x="42" y="170" width="110" height="58" rx="6" />
              <rect x="210" y="72" width="110" height="156" rx="6" />
              <rect x="382" y="112" width="160" height="76" rx="5" />
              <rect x="594" y="88" width="112" height="124" rx="6" />
            </g>
            <g fill="none" stroke={isEnergized ? "#67e8f9" : "#94a3b8"} strokeWidth="3">
              <path d="M152 101 H210" />
              <path d="M152 199 H210" />
              <path d="M320 101 H382" />
              <path d="M320 199 H382" />
              <path d="M542 150 H594" />
              <path d="M190 101 H178 V50 H112" strokeDasharray="5 4" />
              <path d="M190 199 H178 V250 H112" strokeDasharray="5 4" />
            </g>
            <g
              fill={isEnergized ? "#67e8f9" : "#cbd5e1"}
              fontFamily="monospace"
              fontSize="13"
              textAnchor="middle"
            >
              <text x="97" y="97">
                MAGNETRON
              </text>
              <text x="97" y="114">
                OSCILLATOR 10
              </text>
              <text x="97" y="195">
                MAGNETRON
              </text>
              <text x="97" y="212">
                OSCILLATOR 11
              </text>
              <text x="265" y="141">
                TRANSFORMER 18
              </text>
              <text x="265" y="159">
                POWER LINES 19
              </text>
              <text x="265" y="177">
                COMMON INPUT
              </text>
              <text x="462" y="145">
                COMMON WAVE GUIDE 23
              </text>
              <text x="462" y="163">
                COAXIAL LINES 24 / 25
              </text>
              <text x="650" y="143">
                TREATMENT
              </text>
              <text x="650" y="161">
                REGION
              </text>
              <text x="650" y="179">
                CONVEYOR 28
              </text>
            </g>
            <g fill="none" stroke="#fbbf24" strokeWidth="3">
              <circle cx="382" cy="101" r="8" />
              <circle cx="382" cy="199" r="8" />
            </g>
            <g fill="#fbbf24" fontFamily="monospace" fontSize="12">
              <text x="365" y="86">
                LOOP 26
              </text>
              <text x="365" y="222">
                LOOP 27
              </text>
            </g>
            <g fill="#94a3b8" fontFamily="monospace" fontSize="11">
              <text x="35" y="42">
                PATENT FIGURE READING · NUMERALS PRESERVED
              </text>
              <text x="584" y="252">
                ARROW = ENERGY PATH ONLY
              </text>
            </g>
          </svg>
          <p className="mt-3 text-xs font-mono text-ink-300">
            Source-bounded labels: 10, 11, 18, 19, 23, 24, 25, 26, 27, 28. The treatment region is
            intentionally not assigned an unstated enclosure, frequency, or rating.
          </p>
        </div>

        <aside className="lg:col-span-4 bg-parchment-100/60 dark:bg-ink-900/60 p-4 rounded-xl border border-parchment-200 dark:border-ink-800 space-y-3 text-sm">
          <h4 className="font-semibold text-ink-900 dark:text-parchment-100">Reader controls</h4>
          <p className="text-ink-700 dark:text-ink-300">
            The shared patent state controls only whether the illustrated path is energized. This is
            a visual reader control, not a claimed electrical rating.
          </p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-xs font-mono">
            <dt className="text-ink-500">State</dt>
            <dd className="text-cyan-700 dark:text-cyan-300">
              {isEnergized ? "illustrative path active" : "standby"}
            </dd>
            <dt className="text-ink-500">Sources</dt>
            <dd className="text-ink-700 dark:text-ink-300">10 and 11</dd>
            <dt className="text-ink-500">Coupling</dt>
            <dd className="text-ink-700 dark:text-ink-300">loops 26 and 27</dd>
            <dt className="text-ink-500">Load motion</dt>
            <dd className="text-ink-700 dark:text-ink-300">conveyor 28</dd>
            <dt className="text-ink-500">Source λ region</dt>
            <dd className="text-ink-700 dark:text-ink-300">about 10 cm or less</dd>
            <dt className="text-ink-500">At λ = 10 cm</dt>
            <dd className="text-ink-700 dark:text-ink-300">
              f ≈ {(sourceState.vacuumFrequencyAtTenCentimetersHz / 1e9).toFixed(3)} GHz in vacuum
            </dd>
            <dt className="text-ink-500">Tube/cooking SI</dt>
            <dd className="font-semibold text-amber-700 dark:text-amber-300">refused</dd>
          </dl>
          <p className="text-xs leading-relaxed text-ink-600 dark:text-ink-400">
            The frequency line is only the universal c = λf conversion at the patent&apos;s
            ten-centimetre reference. Voltage, magnetic field, RF output, field magnitude,
            dielectric loss, temperature rise, cooking time, and efficiency remain unavailable.
          </p>
        </aside>
      </div>
    </div>
  );
}
