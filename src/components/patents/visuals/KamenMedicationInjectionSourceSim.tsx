"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useId } from "react";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import {
  KAMEN_INJECTION_ID,
  readKamenInjectionControls,
  readKamenInjectionTapeFrame,
  resetKamenInjectionTape,
} from "@/physics/kamenInjectionKernel";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

export function KamenMedicationInjectionSourceSim() {
  const targetId = useId();
  const speedId = useId();
  const intervalId = useId();
  const clutchId = useId();
  const { effectiveParams, claimStates, claimConstraintResult, updateParam, resetParams } =
    usePatentPhysics(KAMEN_INJECTION_ID);
  useFrankenSimPhysics(KAMEN_INJECTION_ID);
  const controls = readKamenInjectionControls(effectiveParams);
  const frame = readKamenInjectionTapeFrame(controls);
  const { metrics } = frame;
  const followerX = 270 + metrics.followerPositionNormalized * 120;
  const screwOffset = metrics.clutchAxialOffsetNormalized * 9;

  return (
    <section className="overflow-hidden rounded-2xl border border-cyan-800/60 bg-slate-950 text-slate-100 shadow-2xl">
      <header className="border-b border-cyan-900/70 bg-slate-900/80 px-4 py-3 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.16em] text-cyan-300">
          US 3,858,581 · FIGS. 1–6 · NONCLINICAL SOURCE MECHANISM
        </p>
        <h3 className="mt-1 font-serif text-xl text-white">
          Counted lead-screw drive and intermittent control
        </h3>
        <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-300">
          This diagram keeps the mechanical and electrical paths together: the clamped syringe,
          guided follower, screw-mounted striker, physical switch, decade counters, motor-off timer,
          and spring clutch all terminate at source-described parts.
        </p>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 border-b border-cyan-900/70 p-3 sm:p-5 lg:border-r lg:border-b-0">
          <svg
            viewBox="0 0 760 450"
            role="img"
            aria-label="Kamen source apparatus with clamped syringe, motor, clutch, lead screw, guided follower, striker switch, wired decade counters, and motor-off timer"
            className="h-auto w-full rounded-xl border border-slate-700 bg-[radial-gradient(circle_at_38%_18%,_#12365b,_#020617_72%)]"
          >
            <defs>
              <pattern id="kamen-source-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#173b5d" strokeWidth="1" />
              </pattern>
              <marker
                id="kamen-source-arrow"
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
            <rect width="760" height="450" fill="url(#kamen-source-grid)" />
            <text x="22" y="28" fill="#67e8f9" fontSize="12" fontFamily="monospace">
              FIGS. 1–6 · CONNECTED SOURCE MECHANISM
            </text>

            {/* Case 32/34 and top-mounted syringe 12. */}
            <rect
              x="34"
              y="91"
              width="692"
              height="270"
              rx="17"
              fill="#102a43"
              stroke="#7dd3fc"
              strokeWidth="3"
            />
            <line x1="50" y1="331" x2="710" y2="331" stroke="#334155" strokeWidth="18" />
            <rect
              x="344"
              y="58"
              width="292"
              height="66"
              rx="22"
              fill="#164e63"
              fillOpacity="0.5"
              stroke="#a5f3fc"
              strokeWidth="3"
            />
            <rect x="374" y="67" width="18" height="48" fill="#cbd5e1" stroke="#f8fafc" />
            <line x1={followerX} y1="91" x2="382" y2="91" stroke="#e2e8f0" strokeWidth="7" />
            <rect x={followerX - 7} y="70" width="14" height="43" fill="#f59e0b" stroke="#fde68a" />
            <line
              x1="636"
              y1="91"
              x2="707"
              y2="61"
              stroke="#a5f3fc"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <text
              x="520"
              y="85"
              textAnchor="middle"
              fill="#cffafe"
              fontSize="10"
              fontFamily="monospace"
            >
              syringe barrel 12
            </text>
            <path
              d="M 465 58 Q 465 37 484 37 H 532 Q 551 37 551 58"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="4"
            />
            <text
              x="520"
              y="49"
              textAnchor="middle"
              fill="#cbd5e1"
              fontSize="9"
              fontFamily="monospace"
            >
              clamp 54 to plate 52
            </text>
            <text
              x="381"
              y="133"
              textAnchor="middle"
              fill="#e2e8f0"
              fontSize="9"
              fontFamily="monospace"
            >
              plunger 14
            </text>
            <text
              x="676"
              y="52"
              textAnchor="middle"
              fill="#a5f3fc"
              fontSize="9"
              fontFamily="monospace"
            >
              tube 15
            </text>
            <line x1="270" y1="106" x2="430" y2="106" stroke="#fbbf24" strokeWidth="2" />
            {Array.from({ length: 10 }, (_, index) => (
              <line
                key={`kamen-scale-${index}`}
                x1={270 + index * (160 / 9)}
                y1="101"
                x2={270 + index * (160 / 9)}
                y2="111"
                stroke="#fbbf24"
                strokeWidth="2"
              />
            ))}
            <path
              d={`M ${followerX - 5} 116 L ${followerX + 5} 116 L ${followerX} 109 z`}
              fill="#fde68a"
            />
            <text x="269" y="122" fill="#fde68a" fontSize="8" fontFamily="monospace">
              scale 62 / pointer 64
            </text>

            {/* Connected motor, clutch, screw, follower, and guide. */}
            <rect
              x="65"
              y="205"
              width="100"
              height="82"
              rx="13"
              fill="#172554"
              stroke="#22d3ee"
              strokeWidth="3"
            />
            <text
              x="115"
              y="236"
              textAnchor="middle"
              fill="#a5f3fc"
              fontSize="12"
              fontFamily="monospace"
            >
              MOTOR 24
            </text>
            <text
              x="115"
              y="258"
              textAnchor="middle"
              fill="#cbd5e1"
              fontSize="9"
              fontFamily="monospace"
            >
              {metrics.motorPowered ? "rotor turning" : "held"}
            </text>
            <line x1="165" y1="246" x2="195" y2="246" stroke="#e2e8f0" strokeWidth="8" />
            <circle cx="205" cy="246" r="18" fill="#78350f" stroke="#fbbf24" strokeWidth="3" />
            <circle
              cx={232 + screwOffset}
              cy="246"
              r="18"
              fill="#78350f"
              stroke="#fbbf24"
              strokeWidth="3"
            />
            <path
              d="M 206 222 Q 218 204 231 222 Q 244 240 257 222"
              fill="none"
              stroke="#fb7185"
              strokeWidth="3"
            />
            <text
              x="219"
              y="299"
              textAnchor="middle"
              fill="#fecdd3"
              fontSize="9"
              fontFamily="monospace"
            >
              clutch 136 · spring 138
            </text>
            {!metrics.clutchEngaged && (
              <text
                x="219"
                y="317"
                textAnchor="middle"
                fill="#fda4af"
                fontSize="9"
                fontFamily="monospace"
              >
                released: rotor turns; screw holds
              </text>
            )}
            <line
              x1={250 + screwOffset}
              y1="246"
              x2={534 + screwOffset}
              y2="246"
              stroke="#e2e8f0"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <line
              x1={250 + screwOffset}
              y1="246"
              x2={534 + screwOffset}
              y2="246"
              stroke="#b7791f"
              strokeWidth="2"
              strokeDasharray="7 5"
            />
            <text
              x="374"
              y="216"
              textAnchor="middle"
              fill="#f8fafc"
              fontSize="10"
              fontFamily="monospace"
            >
              screw 22 · uniform-pitch thread 26
            </text>
            <line x1="258" y1="286" x2="480" y2="286" stroke="#94a3b8" strokeWidth="5" />
            <rect
              x={followerX - 13}
              y="226"
              width="26"
              height="65"
              rx="4"
              fill="#e8872f"
              stroke="#fde68a"
              strokeWidth="2"
            />
            <line
              x1={followerX}
              y1="226"
              x2={followerX}
              y2="111"
              stroke="#f59e0b"
              strokeWidth="9"
            />
            <text
              x={followerX}
              y="308"
              textAnchor="middle"
              fill="#fde68a"
              fontSize="9"
              fontFamily="monospace"
            >
              guided follower 18
            </text>

            {/* Screw-mounted striker and adjacent physical switch. */}
            <g opacity={metrics.pulseLoopComplete ? 1 : 0.2}>
              <circle
                cx={552 + screwOffset}
                cy="246"
                r="13"
                fill="#0f172a"
                stroke="#fbbf24"
                strokeWidth="3"
              />
              <line
                x1={552 + screwOffset}
                y1="246"
                x2={552 + screwOffset + Math.sin(metrics.leadScrewAngleRad) * 31}
                y2={246 - Math.cos(metrics.leadScrewAngleRad) * 31}
                stroke="#fbbf24"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <rect
                x="539"
                y="193"
                width="37"
                height="25"
                rx="4"
                fill="#1e293b"
                stroke={metrics.strikerContactsSwitch ? "#fef08a" : "#c084fc"}
                strokeWidth="3"
              />
              <text
                x="552"
                y="181"
                textAnchor="middle"
                fill="#e9d5ff"
                fontSize="8"
                fontFamily="monospace"
              >
                80 → 84
              </text>
            </g>

            {/* Fig. 6 pulse-counting circuit is wired, not floating. */}
            <rect
              x="586"
              y="171"
              width="116"
              height="139"
              rx="10"
              fill="#052e2b"
              stroke="#a78bfa"
              strokeWidth="3"
              opacity={metrics.pulseLoopComplete ? 1 : 0.25}
            />
            <text
              x="644"
              y="191"
              textAnchor="middle"
              fill="#ddd6fe"
              fontSize="8"
              fontFamily="monospace"
            >
              COUNTER CIRCUIT 110
            </text>
            <circle cx="620" cy="228" r="20" fill="#0f172a" stroke="#c084fc" strokeWidth="2" />
            <circle cx="670" cy="228" r="20" fill="#0f172a" stroke="#c084fc" strokeWidth="2" />
            <text
              x="620"
              y="233"
              textAnchor="middle"
              fill="#f5d0fe"
              fontSize="15"
              fontFamily="monospace"
            >
              {metrics.firstCounterDigit}
            </text>
            <text
              x="670"
              y="233"
              textAnchor="middle"
              fill="#f5d0fe"
              fontSize="15"
              fontFamily="monospace"
            >
              {metrics.secondCounterDigit}
            </text>
            <text
              x="620"
              y="256"
              textAnchor="middle"
              fill="#c4b5fd"
              fontSize="8"
              fontFamily="monospace"
            >
              first 114
            </text>
            <text
              x="670"
              y="256"
              textAnchor="middle"
              fill="#c4b5fd"
              fontSize="8"
              fontFamily="monospace"
            >
              second 116
            </text>
            <path
              d="M 576 206 H 586"
              fill="none"
              stroke="#a78bfa"
              strokeWidth="3"
              markerEnd="url(#kamen-source-arrow)"
              opacity={metrics.pulseLoopComplete ? 1 : 0.25}
            />
            <path
              d="M 644 310 V 338 H 115 V 287"
              fill="none"
              stroke="#a78bfa"
              strokeWidth="3"
              markerEnd="url(#kamen-source-arrow)"
              opacity={metrics.pulseLoopComplete ? 1 : 0.25}
            />
            <text
              x="644"
              y="290"
              textAnchor="middle"
              fill="#ddd6fe"
              fontSize="8"
              fontFamily="monospace"
            >
              board 86 → motor-off 126
            </text>

            {/* Additional timer and visual signal from Claims 2 and 4. */}
            <rect x="60" y="116" width="174" height="57" rx="8" fill="#0f172a" stroke="#f59e0b" />
            <text x="75" y="137" fill="#fcd34d" fontSize="9" fontFamily="monospace">
              oscillator 112 → off timer 74
            </text>
            <rect x="75" y="149" width="126" height="7" rx="3" fill="#334155" />
            <rect
              x="75"
              y="149"
              width={126 * metrics.offIntervalProgress}
              height="7"
              rx="3"
              fill="#f59e0b"
            />
            <path
              d="M 234 144 H 605 V 171"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="5 4"
            />
            <circle
              cx="270"
              cy="144"
              r="9"
              fill={metrics.indicatorOn ? "#fef08a" : "#5b1f16"}
              stroke="#f59e0b"
              strokeWidth="2"
            />
            <text x="286" y="164" fill="#fde68a" fontSize="8" fontFamily="monospace">
              signal 100
            </text>

            <text x="51" y="387" fill="#67e8f9" fontSize="10" fontFamily="monospace">
              {metrics.phase.toUpperCase()} · count {metrics.cyclePulseCount}/
              {metrics.selectedPulseCount} · cycles {metrics.completedCycles}
            </text>
            <text x="51" y="410" fill="#cbd5e1" fontSize="10" fontFamily="monospace">
              Nₚᵤₗₛₑ = nₜᵤᵣₙₛ; x = np.
            </text>
            <text x="260" y="410" fill="#cbd5e1" fontSize="9" fontFamily="monospace">
              p stays symbolic: no numerical pitch is printed.
            </text>
            <text x="51" y="432" fill="#fda4af" fontSize="10" fontFamily="monospace">
              No dose, flow, pressure, concentration, safe-rate, or therapeutic prediction.
            </text>
          </svg>

          <div className="mt-3 grid gap-2 text-xs sm:grid-cols-4">
            <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-2">
              <p className="font-mono text-cyan-300">MECHANISM</p>
              <p className="mt-1 text-slate-200">{metrics.phase}</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-2">
              <p className="font-mono text-purple-300">COUNTER 116 / 114</p>
              <p className="mt-1 text-slate-200">
                {metrics.secondCounterDigit} / {metrics.firstCounterDigit}
              </p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-2">
              <p className="font-mono text-amber-300">FOLLOWER TRAVEL</p>
              <p className="mt-1 text-slate-200">
                {(metrics.followerPositionNormalized * 100).toFixed(0)}% normalized
              </p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-2">
              <p className="font-mono text-emerald-300">GENERIC OWNER</p>
              <p className="mt-1 text-slate-200">fs-mbd helical · typed mirror</p>
            </div>
          </div>
        </div>

        <form className="space-y-4 p-4 sm:p-5" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor={targetId} className="block text-xs font-medium text-slate-200">
            Selected screw-turn pulses
            <span className="float-right font-mono text-purple-300">
              {controls.selectedPulseCount}
            </span>
            <input
              id={targetId}
              className="mt-1 w-full accent-purple-400"
              type="range"
              min="1"
              max="99"
              step="1"
              value={controls.selectedPulseCount}
              onChange={(event) => updateParam("selectedPulseCount", Number(event.target.value))}
            />
          </label>
          <label htmlFor={speedId} className="block text-xs font-medium text-slate-200">
            Museum display speed
            <span className="float-right font-mono text-cyan-300">
              {controls.displayTurnsPerSecond.toFixed(0)} turns/s
            </span>
            <input
              id={speedId}
              className="mt-1 w-full accent-cyan-400"
              type="range"
              min="1"
              max="12"
              step="1"
              value={controls.displayTurnsPerSecond}
              onChange={(event) => updateParam("displayTurnsPerSecond", Number(event.target.value))}
            />
          </label>
          <label htmlFor={intervalId} className="block text-xs font-medium text-slate-200">
            Motor-off display interval
            <span className="float-right font-mono text-amber-300">
              {controls.offIntervalDisplaySeconds.toFixed(1)} s
            </span>
            <input
              id={intervalId}
              className="mt-1 w-full accent-amber-400"
              type="range"
              min="0.5"
              max="8"
              step="0.5"
              value={controls.offIntervalDisplaySeconds}
              onChange={(event) =>
                updateParam("offIntervalDisplaySeconds", Number(event.target.value))
              }
            />
          </label>
          <label htmlFor={clutchId} className="block text-xs font-medium text-slate-200">
            Claim 3 clutch state
            <select
              id={clutchId}
              className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 px-2 py-2 text-sm text-slate-100"
              value={Number(controls.clutchEngaged)}
              onChange={(event) => updateParam("clutchEngaged", Number(event.target.value))}
            >
              <option value="1">Engaged · screw driven</option>
              <option value="0">Released · rotor only</option>
            </select>
          </label>

          <button
            type="button"
            onClick={() => updateParam("running", controls.running ? 0 : 1)}
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-cyan-500 bg-cyan-500 px-3 text-sm font-semibold text-slate-950"
          >
            {controls.running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {controls.running ? "Pause connected mechanism" : "Run connected mechanism"}
          </button>

          <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-3">
            <p className="mb-2 font-mono text-[10px] tracking-[0.14em] text-cyan-300">
              CLAIM 1 COUNTED-CONTROL PROBE
            </p>
            <ClaimConstraintToggle
              patentId={KAMEN_INJECTION_ID}
              claimStates={claimStates}
              onToggleClaim={(claimNumber, active) =>
                updateParam(claimConstraintStateParamId(claimNumber), active ? 1 : 0)
              }
            />
          </div>
          {claimConstraintResult.activeFailures.length > 0 && (
            <div role="status" className="rounded-lg border border-rose-800 bg-rose-950/70 p-3">
              {claimConstraintResult.activeFailures.map((failure) => (
                <p key={failure} className="text-[11px] leading-5 text-rose-100">
                  {failure}
                </p>
              ))}
              {claimConstraintResult.refusalWarning && (
                <p className="mt-1 text-[10px] leading-4 text-rose-200">
                  {claimConstraintResult.refusalWarning}
                </p>
              )}
            </div>
          )}
          <p className="rounded-lg border border-rose-900/70 bg-rose-950/40 p-3 text-xs leading-5 text-rose-100">
            {metrics.refusal.reason}
          </p>
          <button
            type="button"
            onClick={() => {
              resetKamenInjectionTape();
              resetParams();
            }}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-600 bg-slate-900 px-3 text-sm text-slate-100 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
          >
            <RotateCcw className="h-4 w-4" />
            Reset source apparatus
          </button>
        </form>
      </div>
    </section>
  );
}
