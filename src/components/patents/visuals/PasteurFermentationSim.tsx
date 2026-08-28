"use client";

import { FlaskConical, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepPasteurFermentation } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";
import { useOffscreenGate } from "./useOffscreenGate";

const VESSEL_X = [145, 300, 455] as const;

export function PasteurFermentationSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-135245-pasteur-fermentation");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const co2SweepPct = params.co2SweepPct ?? 100;
  const sprayCoveragePct = params.sprayCoveragePct ?? 100;
  const wortTempC = params.wortTempC ?? 21.25;
  const [isPlaying, setIsPlaying] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const animRef = useRef<number | null>(null);
  const { rootRef, onscreenRef } = useOffscreenGate<HTMLDivElement>();

  const process = stepPasteurFermentation({ co2SweepPct, sprayCoveragePct, wortTempC });

  useEffect(() => {
    if (!isPlaying) return;
    let lastTime: number | undefined;
    const loop = (time: number) => {
      animRef.current = requestAnimationFrame(loop);
      if (!onscreenRef.current) return;
      const dt = lastTime === undefined ? 0 : Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;
      setTimerSeconds((previous) => (previous + dt) % 10);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, onscreenRef.current]);

  return (
    <div
      ref={rootRef}
      className="w-full rounded-2xl border border-parchment-300 bg-parchment-50 p-4 shadow-md transition-colors dark:border-ink-800 dark:bg-ink-950 sm:p-6"
    >
      <div className="mb-4 flex flex-col items-start justify-between gap-3 border-b border-parchment-200 pb-3 dark:border-ink-800 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-cyan-700 dark:text-cyan-400" />
            <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
              Pasteur Closed-Vessel Wort Process (US 135,245)
            </h3>
          </div>
          <p className="mt-0.5 font-sans text-xs text-ink-500 dark:text-ink-400">
            Carbonic-acid-gas air displacement followed by exterior water-spray cooling.
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setIsPlaying(!isPlaying);
              soundEngine.playSwitchClick();
            }}
            aria-label={isPlaying ? "Pause animation" : "Play animation"}
            className="rounded-lg bg-parchment-200 p-2 text-ink-800 transition-colors hover:bg-parchment-300 dark:bg-ink-800 dark:text-parchment-200 dark:hover:bg-ink-700"
          >
            {isPlaying ? <Pause className="h-4 w-4 text-cyan-700" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            aria-label={isAudioMuted ? "Unmute audio" : "Mute audio"}
            className="rounded-lg bg-parchment-200 p-2 text-ink-800 transition-colors hover:bg-parchment-300 dark:bg-ink-800 dark:text-parchment-200 dark:hover:bg-ink-700"
          >
            {isAudioMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              resetParams();
              setTimerSeconds(0);
              soundEngine.playSwitchClick();
            }}
            aria-label="Reset source-sequence controls"
            className="rounded-lg bg-parchment-200 p-2 text-ink-800 transition-colors hover:bg-parchment-300 dark:bg-ink-800 dark:text-parchment-200 dark:hover:bg-ink-700"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative flex aspect-[16/9] max-h-[360px] w-full items-center justify-center overflow-hidden rounded-xl border border-parchment-200 bg-parchment-100 dark:border-ink-800 dark:bg-ink-900">
        <svg
          viewBox="0 0 600 340"
          className="h-full w-full"
          aria-label="Source-based Fig. 1 process diagram"
        >
          <title>Three vessels A with pipe E, nozzles P, generator M M, and exit cups v</title>
          <path d="M70 45 H535" stroke="#475569" strokeWidth="8" />
          <text x="292" y="34" fill="currentColor" fontSize="14" fontWeight="700">
            E
          </text>

          <g transform="translate(42 78)">
            <rect
              x="0"
              y="0"
              width="74"
              height="58"
              rx="5"
              fill="#d6d3d1"
              stroke="#57534e"
              strokeWidth="2"
            />
            <text x="18" y="26" fill="#292524" fontSize="13" fontWeight="700">
              M M
            </text>
            <text x="6" y="45" fill="#57534e" fontSize="9">
              CO₂ generator
            </text>
            <path d="M74 30 H103 V106" fill="none" stroke="#2563eb" strokeWidth="4" />
            <text x="80" y="23" fill="#2563eb" fontSize="11">
              w
            </text>
          </g>

          {VESSEL_X.map((x, vesselIndex) => (
            <g key={x}>
              <path
                d={`M ${x - 48} 142 Q ${x} 105 ${x + 48} 142 V274 H ${x - 48} Z`}
                fill="#d6b98c"
                stroke="#57534e"
                strokeWidth="3"
              />
              <text x={x - 6} y="205" fill="#292524" fontSize="16" fontWeight="700">
                A
              </text>
              <path
                d={`M ${x - 52} 274 Q ${x} 292 ${x + 52} 274`}
                fill="none"
                stroke="#475569"
                strokeWidth="6"
              />
              <text x={x - 61} y="292" fill="#475569" fontSize="11">
                g
              </text>
              <path
                d={`M ${x - 35} 298 V318 M ${x + 35} 298 V318`}
                stroke="#57534e"
                strokeWidth="7"
              />
              <path d={`M ${x - 52} 286 H ${x + 52}`} stroke="#57534e" strokeWidth="4" />
              <text x={x + 35} y="285" fill="#57534e" fontSize="11">
                R
              </text>

              <path d={`M ${x} 45 V104`} stroke="#475569" strokeWidth="4" />
              <path
                d={`M ${x - 19} 116 L ${x + 19} 116 L ${x} 139 Z`}
                fill="#94a3b8"
                stroke="#475569"
                strokeWidth="2"
              />
              <text x={x + 23} y="123" fill="#475569" fontSize="11">
                P
              </text>

              {Array.from({ length: 7 }).map((_, dropIndex) => {
                const phase = (timerSeconds * 36 + dropIndex * 17 + vesselIndex * 9) % 75;
                const spread = (dropIndex - 3) * 10;
                return (
                  <circle
                    key={dropIndex}
                    cx={x + spread}
                    cy={142 + phase}
                    r="2.4"
                    fill="#0891b2"
                    opacity={0.01 * process.sprayCoveragePct}
                  />
                );
              })}

              {Array.from({ length: 5 }).map((_, markerIndex) => (
                <circle
                  key={markerIndex}
                  cx={x - 28 + markerIndex * 14}
                  cy={244 - ((timerSeconds * 14 + markerIndex * 19) % 80)}
                  r="3"
                  fill="#2563eb"
                  opacity={0.0092 * process.co2SweepPct}
                />
              ))}
            </g>
          ))}

          <path d="M95 184 H76 V235 H53" fill="none" stroke="#2563eb" strokeWidth="4" />
          <rect
            x="28"
            y="226"
            width="27"
            height="25"
            rx="3"
            fill="#bfdbfe"
            stroke="#2563eb"
            strokeWidth="2"
          />
          <text x="62" y="226" fill="#2563eb" fontSize="11">
            x
          </text>
          <text x="36" y="244" fill="#2563eb" fontSize="11">
            v
          </text>

          <text x="410" y="328" fill="#64748b" fontSize="10">
            Animated percentages are reader controls; the patent gives no flow rate or cooling time.
          </text>
        </svg>
      </div>

      <div className="my-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["CO₂ sweep", `${process.co2SweepPct}%`],
          ["Exterior spray", `${process.sprayCoveragePct}%`],
          ["Yeast-addition band", `${process.wortTempC} °C`],
          ["Source sequence", process.readyForYeast ? "Ready for yeast" : "Incomplete"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-parchment-200 bg-parchment-100 p-2.5 text-center dark:border-ink-800 dark:bg-ink-900"
          >
            <span className="block font-sans text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400">
              {label}
            </span>
            <span className="font-mono text-sm font-bold text-ink-900 dark:text-parchment-100 sm:text-base">
              {value}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 border-t border-parchment-200 pt-3 dark:border-ink-800 sm:grid-cols-3">
        {[
          {
            id: "co2SweepPct",
            label: "CO₂ Sweep Progress",
            value: co2SweepPct,
            min: 0,
            max: 100,
            step: 5,
            unit: "%",
          },
          {
            id: "sprayCoveragePct",
            label: "Exterior Spray Coverage",
            value: sprayCoveragePct,
            min: 0,
            max: 100,
            step: 5,
            unit: "%",
          },
          {
            id: "wortTempC",
            label: "Yeast-Addition Temperature",
            value: wortTempC,
            min: 20,
            max: 22.5,
            step: 0.25,
            unit: "°C",
          },
        ].map((control) => (
          <label
            key={control.id}
            className="font-sans text-xs font-medium text-ink-700 dark:text-parchment-300"
          >
            <span className="mb-1 flex justify-between">
              <span>{control.label}</span>
              <span className="font-mono">
                {control.value}
                {control.unit}
              </span>
            </span>
            <input
              type="range"
              min={control.min}
              max={control.max}
              step={control.step}
              value={control.value}
              onChange={(event) => updateParam(control.id, Number(event.target.value))}
              className="w-full cursor-pointer accent-cyan-700"
            />
          </label>
        ))}
      </div>
    </div>
  );
}
