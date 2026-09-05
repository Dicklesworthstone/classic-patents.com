"use client";

import { AlertCircle, Lightbulb, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { MaterialCard } from "@/components/patents/MaterialCard";
import { blackbodyRgb } from "@/physics/blackbody";
import { stepEdisonBulb } from "@/physics/catalogKernels";
import {
  EDISON_DECLARED_FILAMENT_LENGTH_CM,
  EDISON_DECLARED_HOT_RESISTANCE_OHM,
  edisonKernelSource,
  ensureEdisonWasm,
  stepEdisonRadiativeBalance,
  subscribeEdisonKernelSource,
} from "@/physics/edisonWasm";
import { computeEdisonFilamentThermalField } from "@/physics/fieldTextures";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { useWasmKernelSource } from "@/physics/useWasmKernelSource";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";

export function EdisonBulbSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-223898-edison-lightbulb");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const voltage = params.voltage ?? 110;
  const hotResistanceOhm = params.hotResistanceOhm ?? EDISON_DECLARED_HOT_RESISTANCE_OHM;
  const filamentLengthCm = EDISON_DECLARED_FILAMENT_LENGTH_CM;
  const [resistanceMode, setResistanceMode] = useState<
    "source-high-resistance" | "reported-prior-art"
  >("source-high-resistance");
  const [isVacuumIntact, setIsVacuumIntact] = useState<boolean>(true);
  const kernelSource = useWasmKernelSource(
    edisonKernelSource,
    subscribeEdisonKernelSource,
    ensureEdisonWasm,
  );

  const bulb = stepEdisonBulb({ voltage, hotResistanceOhm, filamentLength: filamentLengthCm });
  const radiative = stepEdisonRadiativeBalance({
    voltageV: voltage,
    hotResistanceOhm: bulb.hotResistanceOhm,
    filamentLengthCm,
  });
  if (!radiative) {
    throw new Error("Edison radiative balance refused admitted UI inputs");
  }
  // The 1.5 Ω path sits inside the source's reported one-to-four-ohm prior
  // practice. Applying this exhibit's branch voltage is a feeder-loss
  // counterfactual, not an admitted thermal operating point.
  const resistanceOhms =
    resistanceMode === "source-high-resistance" ? bulb.hotResistanceOhm : bulb.lowResistanceOhm;
  const currentAmps =
    resistanceMode === "source-high-resistance" ? radiative.current_a : bulb.lowResistanceAmps;
  const powerWatts =
    resistanceMode === "source-high-resistance"
      ? radiative.radiative_power_w
      : bulb.lowResistanceWatts;

  const feederResistance = bulb.feederResistanceOhm;

  const isBurnedOut = !isVacuumIntact && voltage > 30;
  const priorArtOverload = resistanceMode === "reported-prior-art";
  const tempKelvin = isBurnedOut || priorArtOverload ? 300 : radiative.filament_temperature_k;

  // Shared spatial sampled thermal & radiation field matching 3D studio
  const thermalField = computeEdisonFilamentThermalField(
    tempKelvin,
    voltage,
    isVacuumIntact ? 1e-4 : 760,
    32,
  );
  const thermalHaloPeak = thermalField.reduce((max, val) => Math.max(max, val), 0);

  const getFilamentColor = () => {
    if (isBurnedOut || priorArtOverload) return "#475569";
    return blackbodyRgb(tempKelvin);
  };

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h3 className="font-serif text-xl font-bold text-ink-900 dark:text-parchment-100">
              Thomas Edison High-Resistance Incandescent Lamp (US 223,898)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-1">
            Compare the source&apos;s 100–500 Ω filament range with its reported 1–4 Ω prior
            practice and see why high resistance made “multiple arc” distribution practical.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setIsVacuumIntact(!isVacuumIntact);
              soundEngine.playSwitchClick();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors border shadow-sm ${
              isVacuumIntact
                ? "bg-emerald-600 text-white border-emerald-700"
                : "bg-red-600 text-white border-red-700 animate-bounce"
            }`}
          >
            {isVacuumIntact ? "✓ Vacuum Intact" : "✗ Vacuum Leak"}
          </button>
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
              setIsVacuumIntact(true);
              setResistanceMode("source-high-resistance");
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

      {/* Visual Canvas and Comparative Circuit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 flex flex-col items-center justify-center rounded-2xl bg-ink-950 p-6 border border-parchment-200 dark:border-ink-800 relative min-h-[340px]">
          {/* Burn-out Alert */}
          {isBurnedOut && (
            <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-red-950/90 border border-red-700 text-red-300 text-xs font-mono rounded-lg flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              Vacuum boundary broken: the hot carbon path oxidizes instead of remaining stable.
            </div>
          )}

          {/* Incandescent Glass Bulb SVG */}
          <svg
            viewBox="0 0 300 260"
            role="img"
            aria-label={`Source-bounded Edison lamp and interpretive parallel house branch: ${voltage} volts applied, ${isBurnedOut ? "vacuum boundary broken" : "vacuum intact"}, ${resistanceMode === "source-high-resistance" ? "source high-resistance filament" : "reported prior-practice resistance counterfactual"}`}
            className="w-full max-w-xs h-auto select-none relative z-10"
          >
            <defs>
              <radialGradient id="edisonGlassGlow" cx="50%" cy="40%" r="50%">
                <stop
                  offset="0%"
                  stopColor={getFilamentColor()}
                  stopOpacity={
                    isBurnedOut || priorArtOverload
                      ? 0
                      : resistanceMode === "source-high-resistance"
                        ? Math.min(
                            1,
                            bulb.glowStopInner *
                              (1 + Math.abs(bulb.filamentHeatSample)) *
                              Math.max(0.2, thermalHaloPeak),
                          )
                        : bulb.lowResistanceGlowStopInner * Math.max(0.2, thermalHaloPeak)
                  }
                />
                <stop
                  offset="60%"
                  stopColor={getFilamentColor()}
                  stopOpacity={
                    isBurnedOut || priorArtOverload
                      ? 0
                      : resistanceMode === "source-high-resistance"
                        ? bulb.glowStopOuter * Math.min(1, thermalHaloPeak)
                        : bulb.lowResistanceGlowStopOuter * Math.min(1, thermalHaloPeak)
                  }
                />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Interpretive domestic wall and mounting board reach the frame floor. */}
            <rect x="20" y="20" width="260" height="225" rx="4" fill="#1e293b" />
            <rect x="20" y="230" width="260" height="15" fill="#3f2a1f" />
            <rect x="62" y="208" width="176" height="35" rx="4" fill="#5b3825" />

            <circle cx="150" cy="105" r="100" fill="url(#edisonGlassGlow)" />

            {/* Fig. 1 all-glass exhausted receiver: no later screw base. */}
            <path
              d="M 130,176 C 94,156 88,92 112,58 C 131,31 169,31 188,58 C 212,92 206,156 170,176 L 170,194 L 130,194 Z"
              fill="#0f172a"
              fillOpacity="0.35"
              stroke="#94a3b8"
              strokeWidth="2.5"
              opacity="0.85"
            />
            <path d="M 147,39 L 150,29 L 153,39" fill="none" stroke="#94a3b8" strokeWidth="2" />
            <rect x="138" y="144" width="24" height="49" rx="8" fill="#cbd5e1" fillOpacity="0.18" />

            {/* Continuous source path: a → c/c′ → d/d′ → h/h′ → x/x′ → e/e′. */}
            <path
              d="M 140,117 C 133,88 139,70 150,66 C 161,70 167,88 160,117"
              fill="none"
              stroke={getFilamentColor()}
              strokeWidth={resistanceMode === "source-high-resistance" ? "3" : "6"}
              strokeLinecap="round"
            />
            <path d="M 140,117 L 137,128" stroke="#402820" strokeWidth="7" strokeLinecap="round" />
            <path d="M 160,117 L 163,128" stroke="#402820" strokeWidth="7" strokeLinecap="round" />
            <path d="M 137,128 L 141,143" stroke="#dbe4ea" strokeWidth="2.5" />
            <path d="M 163,128 L 159,143" stroke="#dbe4ea" strokeWidth="2.5" />
            <circle cx="141" cy="146" r="5" fill="#dbe4ea" />
            <circle cx="159" cy="146" r="5" fill="#dbe4ea" />
            <path d="M 141,151 L 141,204" stroke="#b86132" strokeWidth="3" />
            <path d="M 159,151 L 159,204" stroke="#b86132" strokeWidth="3" />

            {/* Collar plus brackets physically carry the receiver. */}
            <path d="M 126,181 Q 105,198 88,213" fill="none" stroke="#b88635" strokeWidth="5" />
            <path d="M 174,181 Q 195,198 212,213" fill="none" stroke="#b88635" strokeWidth="5" />
            <path d="M 126,181 Q 150,190 174,181" fill="none" stroke="#d0a34e" strokeWidth="5" />

            {/* External leads land on posts, then enter one closed house branch. */}
            <path d="M 141,204 Q 125,218 106,225" fill="none" stroke="#2b211b" strokeWidth="5" />
            <path d="M 159,204 Q 178,218 194,225" fill="none" stroke="#2b211b" strokeWidth="5" />
            <circle cx="106" cy="225" r="7" fill="#e8e1cf" stroke="#b88635" strokeWidth="3" />
            <circle cx="194" cy="225" r="7" fill="#e8e1cf" stroke="#b88635" strokeWidth="3" />
            <path d="M 106,225 L 42,225 L 42,45" fill="none" stroke="#29231d" strokeWidth="4" />
            <path d="M 194,225 L 230,225 L 230,190" fill="none" stroke="#29231d" strokeWidth="4" />
            <circle cx="230" cy="190" r="5" fill="#b88635" />
            <circle cx="230" cy="165" r="5" fill="#b88635" />
            <path d="M 230,190 L 230,165" stroke="#d0a34e" strokeWidth="5" />
            <path d="M 230,165 L 258,165 L 258,45" fill="none" stroke="#29231d" strokeWidth="4" />
            <text x="28" y="256" fill="#94a3b8" fontSize="9">
              INTERPRETIVE DOMESTIC PARALLEL BRANCH · CLOSED SWITCH
            </text>
          </svg>

          {/* Telemetry Footer */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono pt-3 border-t border-ink-800 text-ink-300">
            <div>
              <span className="text-ink-500 block text-[10px]">CURRENT DRAW</span>
              <span className="text-amber-400 font-bold">{currentAmps.toFixed(2)} A</span>
            </div>
            <div>
              <span className="text-ink-500 block text-[10px]">ELECTRICAL INPUT</span>
              <span className="text-emerald-400 font-bold">{Math.round(powerWatts)} W</span>
            </div>
            <div>
              <span className="text-ink-500 block text-[10px]">FILAMENT TEMP</span>
              <span className="text-orange-400 font-bold">
                {priorArtOverload ? "REFUSED" : `${Math.round(tempKelvin)} K`}
              </span>
            </div>
            <div>
              <span className="text-ink-500 block text-[10px]">THERMAL OWNER</span>
              <span className="text-purple-400 font-bold">
                {resistanceMode === "source-high-resistance"
                  ? kernelSource === "wasm" && radiative.runtimeSource === "wasm"
                    ? "FS WASM"
                    : "TS FALLBACK"
                  : "OUT OF DOMAIN"}
              </span>
            </div>
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/70 dark:bg-ink-900/60 p-5 space-y-4">
            <span className="font-serif font-bold text-sm text-ink-900 dark:text-parchment-100 block">
              Circuit &amp; Resistance Configuration
            </span>

            {/* Resistance Toggle */}
            <div className="space-y-1">
              <span className="text-xs font-mono block text-ink-700 dark:text-ink-300 font-semibold mb-1">
                Filament Electrical Resistance
              </span>
              <div className="grid grid-cols-1 gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setResistanceMode("source-high-resistance")}
                  className={`p-2.5 rounded-lg border text-left transition-colors ${
                    resistanceMode === "source-high-resistance"
                      ? "bg-amber-700 text-white border-amber-800 font-bold shadow-sm"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>Source high resistance ({bulb.hotResistanceOhm.toFixed(0)} Ω)</span>
                    <span className="text-amber-200">✓ Feasible</span>
                  </div>
                  <div className="text-[10px] opacity-80 mt-0.5">
                    Within the source&apos;s 100–500 Ω example range; supports multiple-arc
                    subdivision without enormous mains.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setResistanceMode("reported-prior-art")}
                  className={`p-2.5 rounded-lg border text-left transition-colors ${
                    resistanceMode === "reported-prior-art"
                      ? "bg-red-700 text-white border-red-800 font-bold shadow-sm"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>Reported prior practice ({bulb.lowResistanceOhm} Ω)</span>
                    <span className="text-red-200">✗ Branch overload</span>
                  </div>
                  <div className="text-[10px] opacity-80 mt-0.5">
                    The same illustrative branch voltage would draw{" "}
                    {bulb.lowResistanceAmps.toFixed(1)} A; the thermal state is refused while{" "}
                    {feederResistance} Ω feeder loss reaches{" "}
                    {Math.round(bulb.lowResistanceFeederLossWatts)} W.
                  </div>
                </button>
              </div>
            </div>

            <MaterialCard
              name={
                resistanceMode === "source-high-resistance"
                  ? "Carbonized fibrous filament"
                  : "Reported prior-practice carbon rod"
              }
              formula="C"
              role={
                resistanceMode === "source-high-resistance"
                  ? "High-resistance carbon thread secured to platina contacts inside an all-glass exhausted receiver."
                  : "The specification reports one-to-four-ohm carbon rods as prior practice; this branch-voltage comparison is explicitly counterfactual."
              }
              numbers={[
                {
                  label: "Hot T",
                  value: priorArtOverload ? "refused" : `${Math.round(tempKelvin)} K`,
                },
                { label: "R", value: `${resistanceOhms.toFixed(1)} Ω` },
                {
                  label: resistanceMode === "source-high-resistance" ? "P_rad" : "P_in",
                  value: `${powerWatts.toFixed(1)} W`,
                },
                {
                  label: "closure",
                  value:
                    resistanceMode === "source-high-resistance"
                      ? radiative.relative_energy_closure.toExponential(1)
                      : "n/a",
                },
              ]}
            />

            {/* Voltage Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Illustrative Branch Voltage
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {voltage} Volts
                </span>
              </div>
              <input
                type="range"
                aria-label="Illustrative Branch Voltage"
                min="40"
                max="130"
                step="1"
                value={voltage}
                onChange={(e) => updateParam("voltage", Number(e.target.value))}
                className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
              />
            </div>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400">
            Lamp geometry follows Fig. 1. The supported wall bracket, closed switch, and house
            branch are interpretive context for the patent&apos;s “multiple arc” distribution
            argument; voltage, hot resistance, emissivity 0.8, ambient temperature, and the 22 cm
            thermal-area length are declared model inputs, not printed source constants.
          </p>
        </div>
      </div>
    </div>
  );
}
