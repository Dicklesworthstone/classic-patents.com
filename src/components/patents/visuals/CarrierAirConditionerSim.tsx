"use client";

import { Droplets, RotateCcw, Volume2, VolumeX, Wind } from "lucide-react";
import { useState } from "react";
import { FrankenSimEngine } from "@/physics/engine";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";

export function CarrierAirConditionerSim() {
  const { params, updateParam, resetParams } = usePatentPhysics(
    "us-808897-carrier-air-conditioner",
  );
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const [activeTab, setActiveTab] = useState<"washer" | "separator">("washer");

  const airflowCfm = params.airflowCfm ?? 15000;
  const sprayRatePct = params.sprayRatePct ?? 60;
  const separatorFaces = params.separatorFaces ?? 6;
  const carrier = FrankenSimEngine.stepCarrierAirConditioner({
    airflowCfm,
    sprayRatePct,
    separatorFaces,
  });

  return (
    <div className="w-full rounded-2xl bg-parchment-50 dark:bg-ink-950 border border-parchment-300 dark:border-ink-800 p-6 space-y-6 text-ink-900 dark:text-parchment-200">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-lg font-bold font-serif tracking-wide text-ink-950 dark:text-parchment-100">
              Willis H. Carrier — Apparatus for Treating Air (US 808,897)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-0.5">
            Fine liquid spray, wet sinuous plates, and rear gutters for separating liquid and
            suspended impurities
          </p>
        </div>
        <div className="flex items-center gap-2 self-end lg:self-auto">
          <div className="flex rounded-lg bg-parchment-200 dark:bg-ink-900 p-1 border border-parchment-300 dark:border-ink-800 text-xs">
            <button
              type="button"
              onClick={() => {
                setActiveTab("washer");
                soundEngine.playSwitchClick();
              }}
              className={`px-3 py-1.5 rounded-md font-medium ${activeTab === "washer" ? "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-900 dark:text-cyan-300" : "text-ink-600 dark:text-ink-400"}`}
            >
              Washer path
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("separator");
                soundEngine.playSwitchClick();
              }}
              className={`px-3 py-1.5 rounded-md font-medium ${activeTab === "separator" ? "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-900 dark:text-cyan-300" : "text-ink-600 dark:text-ink-400"}`}
            >
              Separator geometry
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            aria-label={isAudioMuted ? "Unmute sound" : "Mute sound"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 text-ink-800 dark:text-parchment-200"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              resetParams();
              setActiveTab("washer");
              soundEngine.playSwitchClick();
            }}
            aria-label="Reset Carrier air-washer simulation"
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 text-ink-800 dark:text-parchment-200"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative w-full aspect-[16/9] min-h-[320px] rounded-xl bg-neutral-950 border border-neutral-800 overflow-hidden flex items-center justify-center p-5">
        {activeTab === "washer" ? (
          <svg
            viewBox="0 0 760 340"
            className="w-full h-full"
            role="img"
            aria-label="Source-faithful Carrier wet air washer path"
          >
            <defs>
              <linearGradient id="carrierAirWash" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.55" />
                <stop offset="45%" stopColor="#38bdf8" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0.35" />
              </linearGradient>
            </defs>
            <rect
              x="35"
              y="75"
              width="690"
              height="165"
              rx="8"
              fill="url(#carrierAirWash)"
              stroke="#64748b"
              strokeWidth="2"
            />
            <text x="45" y="55" fill="#f59e0b" fontSize="12" fontFamily="monospace">
              air current through casing m →
            </text>
            <g transform="translate(130 75)">
              <line x1="0" y1="15" x2="0" y2="150" stroke="#38bdf8" strokeWidth="4" />
              {[35, 65, 95, 125].map((y) => (
                <g key={y}>
                  <circle cx="0" cy={y} r="4" fill="#fbbf24" />
                  <path d={`M 5 ${y} l 48 -14 l 0 28 z`} fill="#38bdf8" opacity="0.55" />
                </g>
              ))}
              <text
                x="0"
                y="-10"
                textAnchor="middle"
                fill="#7dd3fc"
                fontSize="11"
                fontFamily="monospace"
              >
                spray h
              </text>
            </g>
            <g transform="translate(285 92)">
              {[0, 24, 48, 72, 96]
                .slice(0, Math.max(2, Math.min(5, Math.round(separatorFaces / 2))))
                .map((x, i) => (
                  <polyline
                    key={i}
                    points={`${x},0 ${x + 13},25 ${x},50 ${x + 13},75 ${x},100 ${x + 13},125`}
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="4"
                  />
                ))}
              <text
                x="50"
                y="-15"
                textAnchor="middle"
                fill="#e2e8f0"
                fontSize="11"
                fontFamily="monospace"
              >
                wet front faces i / bends j
              </text>
            </g>
            <g transform="translate(470 92)">
              {[0, 24, 48, 72]
                .slice(0, Math.max(2, Math.min(4, Math.round(separatorFaces / 3))))
                .map((x, i) => (
                  <g key={i}>
                    <polyline
                      points={`${x},0 ${x + 13},25 ${x},50 ${x + 13},75 ${x},100 ${x + 13},125`}
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="4"
                    />
                    <path
                      d={`M ${x + 13} 25 l 17 7 l -17 7 M ${x + 13} 75 l 17 7 l -17 7`}
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="3"
                    />
                  </g>
                ))}
              <text
                x="45"
                y="-15"
                textAnchor="middle"
                fill="#fbbf24"
                fontSize="11"
                fontFamily="monospace"
              >
                rear faces f / g, flanges b / c
              </text>
            </g>
            <g transform="translate(640 104)">
              <rect x="0" y="0" width="55" height="115" rx="4" fill="#164e63" stroke="#38bdf8" />
              <text
                x="27"
                y="136"
                textAnchor="middle"
                fill="#7dd3fc"
                fontSize="11"
                fontFamily="monospace"
              >
                trap j / filter l
              </text>
            </g>
            <text
              x="380"
              y="305"
              textAnchor="middle"
              fill="#e2e8f0"
              fontSize="12"
              fontFamily="monospace"
            >
              wet film catches dust; sinuous turns separate free droplets
            </text>
          </svg>
        ) : (
          <svg
            viewBox="0 0 680 340"
            className="w-full h-full"
            role="img"
            aria-label="Carrier sinuous separator plate geometry"
          >
            <path
              d="M 80 60 L 170 105 L 80 150 L 170 195 L 80 240"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="6"
            />
            <path d="M 170 105 l 25 12 M 170 195 l 25 12" stroke="#fbbf24" strokeWidth="4" />
            <path
              d="M 320 60 L 410 105 L 320 150 L 410 195 L 320 240"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="6"
            />
            <path d="M 410 105 l 25 12 M 410 195 l 25 12" stroke="#fbbf24" strokeWidth="4" />
            <path
              d="M 80 275 H 470"
              stroke="#38bdf8"
              strokeWidth="3"
              markerEnd="url(#carrierArrow)"
            />
            <text
              x="275"
              y="40"
              textAnchor="middle"
              fill="#e2e8f0"
              fontSize="13"
              fontFamily="monospace"
            >
              continuous sinuous air passages
            </text>
            <text x="120" y="315" fill="#cbd5e1" fontSize="11" fontFamily="monospace">
              front smooth / unobstructed
            </text>
            <text x="350" y="315" fill="#fbbf24" fontSize="11" fontFamily="monospace">
              rear projections form gutters
            </text>
            <text x="540" y="145" fill="#a7f3d0" fontSize="12" fontFamily="monospace">
              faces: {separatorFaces}
            </text>
            <text x="540" y="170" fill="#a7f3d0" fontSize="12" fontFamily="monospace">
              wet film: {carrier.wetFilmCoveragePct}%
            </text>
            <text x="540" y="195" fill="#a7f3d0" fontSize="12" fontFamily="monospace">
              dust capture: {carrier.particleCapturePct}%
            </text>
            <text x="540" y="220" fill="#a7f3d0" fontSize="12" fontFamily="monospace">
              droplet separation: {carrier.dropletSeparationPct}%
            </text>
            <defs>
              <marker
                id="carrierArrow"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L0,6 L8,3 z" fill="#38bdf8" />
              </marker>
            </defs>
          </svg>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-neutral-900/50 p-4 rounded-xl border border-neutral-800">
        <label className="text-xs font-mono text-neutral-300">
          <span className="flex justify-between mb-1.5">
            <span>Air current through casing</span>
            <span className="text-orange-400 font-bold">{airflowCfm} cfm</span>
          </span>
          <input
            aria-label="Air current through Carrier casing"
            type="range"
            min={2000}
            max={30000}
            step={500}
            value={airflowCfm}
            onChange={(e) => updateParam("airflowCfm", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-orange-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </label>
        <label className="text-xs font-mono text-neutral-300">
          <span className="flex justify-between mb-1.5">
            <span>Fine spray rate</span>
            <span className="text-cyan-400 font-bold">{sprayRatePct}%</span>
          </span>
          <input
            aria-label="Fine liquid spray rate"
            type="range"
            min={10}
            max={100}
            step={5}
            value={sprayRatePct}
            onChange={(e) => updateParam("sprayRatePct", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </label>
        <label className="text-xs font-mono text-neutral-300">
          <span className="flex justify-between mb-1.5">
            <span>Separator faces and flanges</span>
            <span className="text-amber-400 font-bold">{separatorFaces}</span>
          </span>
          <input
            aria-label="Number of sinuous separator faces"
            type="range"
            min={2}
            max={12}
            step={1}
            value={separatorFaces}
            onChange={(e) => updateParam("separatorFaces", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </label>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
        <div className="rounded-lg border border-cyan-900/50 bg-cyan-950/20 p-2">
          <Droplets className="w-4 h-4 text-cyan-400 mb-1" />
          <span className="block text-neutral-400">Wet film</span>
          <strong>{carrier.wetFilmCoveragePct}%</strong>
        </div>
        <div className="rounded-lg border border-amber-900/50 bg-amber-950/20 p-2">
          <span className="block text-neutral-400">Dust capture</span>
          <strong>{carrier.particleCapturePct}%</strong>
        </div>
        <div className="rounded-lg border border-sky-900/50 bg-sky-950/20 p-2">
          <span className="block text-neutral-400">Droplet separation</span>
          <strong>{carrier.dropletSeparationPct}%</strong>
        </div>
        <div className="rounded-lg border border-neutral-700 bg-neutral-900/30 p-2">
          <span className="block text-neutral-400">Air current</span>
          <strong>{carrier.airCurrentMps} m/s</strong>
        </div>
        <div className="rounded-lg border border-neutral-700 bg-neutral-900/30 p-2">
          <span className="block text-neutral-400">Flow resistance</span>
          <strong>{carrier.pressureDropPa} Pa</strong>
        </div>
      </div>
    </div>
  );
}
