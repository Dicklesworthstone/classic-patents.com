"use client";

import { RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import {
  readTeslaTransformerControls,
  stepTeslaTransformerSi,
  TESLA_TRANSFORMER_SCHEMATIC,
  teslaTransformerSecondaryPath,
  teslaTransformerSecondaryTerminals,
} from "@/physics/teslaTransformerKernel";
import { ensureTeslaWasm, teslaKernelSource } from "@/physics/teslaWasm";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "./ClaimConstraintToggle";
import { usePatentAudio } from "./three/usePatentAudio";

export function TeslaCoilSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-593138-tesla-coil");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const [, setKernelSource] = useState(teslaKernelSource);
  const profileGradientId = `tesla-profile-${useId().replaceAll(":", "")}`;

  useEffect(() => {
    let active = true;
    void ensureTeslaWasm().then((nextSource) => {
      if (active) setKernelSource(nextSource);
    });
    return () => {
      active = false;
    };
  }, []);
  const controls = readTeslaTransformerControls({
    disturbanceFrequencyHz: params.disturbanceFrequencyHz,
    secondaryLengthMiles: params.secondaryLengthMiles,
  });
  const res = stepTeslaTransformerSi(controls);
  const secondaryTerminals = teslaTransformerSecondaryTerminals();
  const secondaryLow = {
    x: secondaryTerminals.low.x + 100,
    y: secondaryTerminals.low.y * 1.23 - 10,
  };
  const secondaryHigh = {
    x: secondaryTerminals.high.x + 100,
    y: secondaryTerminals.high.y * 1.23 - 10,
  };
  const claim1CommonNodeConnected = (params.claim1CommonNodeConnected ?? 1) >= 0.5;
  const claimStates = { 1: claim1CommonNodeConnected };

  useFrankenSimPhysics("us-593138-tesla-coil", {
    domain: "electromagnetics_flux",
    refusal: {
      isRefused: !claim1CommonNodeConnected,
      reason: !claim1CommonNodeConnected
        ? "Claim 1 topology absent: secondary low terminal is open from the primary / earth node."
        : undefined,
    },
  });

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Zap className="w-6 h-6 text-purple-500 animate-pulse" />
            <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50">
              Nikola Tesla&apos;s High-Potential Transformer (US 593,138)
            </h3>
          </div>
          <p className="text-sm sm:text-base text-ink-700 dark:text-ink-300 mt-1">
            Source-described graded transformer: a conical secondary, surrounding primary, claimed
            common earth terminal, and quarter-wave distributed-line example.
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="px-3.5 py-1.5 rounded-xl bg-parchment-100 dark:bg-ink-900 text-ink-700 dark:text-parchment-300 text-xs sm:text-sm font-mono font-bold border border-parchment-300 dark:border-ink-700 shadow-2xs">
            {res.runtimeSource === "wasm" ? "fs-flux WASM" : "TypeScript fallback"}
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300 text-xs sm:text-sm font-mono font-bold border border-purple-300 dark:border-purple-800 shadow-2xs">
            Absolute potential: source-underdetermined
          </div>
          <button
            type="button"
            onClick={() => {
              const nextMuted = toggleSound();
              if (!nextMuted) {
                soundEngine.playTeslaCoilDischarge(120, 1.0);
              } else {
                soundEngine.playSwitchClick();
              }
            }}
            aria-label={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
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
            viewBox="0 0 600 340"
            role="img"
            aria-label="US 593,138 Fig. 2 transformer: supported conical secondary, surrounding primary, common earth terminal, and normalized distributed-wave profile"
            className="w-full h-auto max-h-[340px]"
          >
            {/* Background Dark Lab */}
            <rect width="600" height="340" fill="#0a0f1d" />
            <defs>
              <linearGradient
                id={profileGradientId}
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="260"
                x2="0"
                y2="78"
              >
                {Array.from({ length: 9 }).map((_, index) => {
                  const fraction = index / 8;
                  const profile = Math.abs(Math.sin(res.electricalLengthRad * fraction));
                  return (
                    <stop
                      key={fraction}
                      offset={`${fraction * 100}%`}
                      stopColor={`hsl(${38 + profile * 220} 82% 55%)`}
                    />
                  );
                })}
              </linearGradient>
            </defs>

            {/* Ground plane and mechanically supported table */}
            <line x1="50" y1="300" x2="550" y2="300" stroke="#334155" strokeWidth="3" />
            <rect x="145" y="260" width="310" height="24" rx="5" fill="#5c2c16" />
            <rect x="175" y="284" width="22" height="16" fill="#5c2c16" />
            <rect x="403" y="284" width="22" height="16" fill="#5c2c16" />

            {/* Fig. 2 conical insulating support and graded secondary B */}
            <path
              d="M 242 260 L 275 78 L 325 78 L 358 260 Z"
              fill="rgba(241,228,199,0.22)"
              stroke="#e7d7b7"
              strokeWidth="2"
            />
            <path
              d={teslaTransformerSecondaryPath()}
              transform="translate(100 -10) scale(1 1.23)"
              fill="none"
              stroke={claim1CommonNodeConnected ? `url(#${profileGradientId})` : "#64748b"}
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <text x="326" y="110" fill="#fbbf24" fontSize="12" fontFamily="monospace">
              B — GRADED SECONDARY
            </text>

            {/* Primary C surrounds the adjacent broad secondary end. */}
            <path
              d={TESLA_TRANSFORMER_SCHEMATIC.primaryWindingPath}
              transform="translate(100 35)"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="5"
            />
            <text x="175" y="240" fill="#fbbf24" fontSize="12" fontFamily="monospace">
              C — PRIMARY
            </text>

            {/* Remote high-potential terminal; no source toroid. */}
            <path
              d={`M ${secondaryHigh.x} ${secondaryHigh.y} L 300 58`}
              stroke="#f59e0b"
              strokeWidth="4"
              fill="none"
            />
            <circle cx="300" cy="50" r="9" fill="#fbbf24" stroke="#fef3c7" strokeWidth="2" />
            <text x="318" y="53" fill="#fde68a" fontSize="10" fontFamily="monospace">
              REMOTE HIGH TERMINAL
            </text>

            {/* The claimed adjacent secondary / primary / earth bond. */}
            <rect x="452" y="235" width="12" height="35" rx="3" fill="#f59e0b" />
            <path d="M 210 255 Q 350 242 458 235" stroke="#f59e0b" strokeWidth="4" fill="none" />
            {claim1CommonNodeConnected ? (
              <path
                d={`M ${secondaryLow.x} ${secondaryLow.y} Q 355 258 458 245`}
                stroke="#fbbf24"
                strokeWidth="4"
                fill="none"
              />
            ) : (
              <>
                <path
                  d={`M ${secondaryLow.x} ${secondaryLow.y} Q 292 260 330 257`}
                  stroke="#fbbf24"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  d="M 370 254 Q 420 250 458 245"
                  stroke="#fbbf24"
                  strokeWidth="4"
                  fill="none"
                />
                <circle cx="330" cy="257" r="5" fill="#be123c" />
                <circle cx="370" cy="254" r="5" fill="#be123c" />
              </>
            )}
            <path d="M 458 235 L 480 300" stroke="#f59e0b" strokeWidth="4" fill="none" />
            <text x="394" y="216" fill="#6ee7b7" fontSize="10" fontFamily="monospace">
              {claim1CommonNodeConnected
                ? "PRIMARY + SECONDARY + EARTH"
                : "SECONDARY OPEN FROM PRIMARY + EARTH"}
            </text>

            {/* Other primary terminal and source lead. */}
            <rect x="136" y="235" width="12" height="35" rx="3" fill="#f59e0b" />
            <path d="M 142 235 Q 160 245 182 255" stroke="#f59e0b" strokeWidth="4" fill="none" />
            <text x="72" y="228" fill="#93c5fd" fontSize="10" fontFamily="monospace">
              PRIMARY SOURCE
            </text>

            {/* Ground symbol at the end of the actual common-node lead. */}
            <path
              d="M 480 300 L 480 315 M 465 315 L 495 315 M 470 321 L 490 321 M 475 327 L 485 327"
              stroke="#6ee7b7"
              strokeWidth="2"
            />

            <text
              x="300"
              y="22"
              textAnchor="middle"
              fill="#c4b5fd"
              fontSize="10"
              fontFamily="monospace"
            >
              {claim1CommonNodeConnected
                ? "NORMALIZED PROFILE ONLY — ABSOLUTE V UNKNOWN"
                : "CLAIM 1 COMMON NODE OPEN — PROFILE REFUSED"}
            </text>
          </svg>

          {/* Telemetry Strip */}
          <div className="w-full grid grid-cols-3 gap-2 text-center text-xs sm:text-sm font-mono pt-3 border-t border-ink-800 text-ink-300">
            <div>
              <span className="text-ink-400 block text-xs">SOURCE FORM</span>
              <span className="text-purple-400 font-bold text-sm sm:text-base">FIG. 2 CONICAL</span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs">ELECTRICAL LENGTH</span>
              <span className="text-amber-400 font-bold text-sm sm:text-base">
                {claim1CommonNodeConnected ? `${res.electricalLengthDeg.toFixed(1)}°` : "REFUSED"}
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs">QUARTER-WAVE TARGET</span>
              <span className="text-emerald-400 font-bold text-sm sm:text-base">
                {res.quarterWaveLengthMiles.toFixed(2)} mi
              </span>
            </div>
          </div>

          <ClaimConstraintToggle
            patentId="us-593138-tesla-coil"
            claimStates={claimStates}
            onToggleClaim={(_claimNo, active) =>
              updateParam("claim1CommonNodeConnected", active ? 1 : 0)
            }
          />
        </div>

        {/* Controls Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/80 dark:bg-ink-900/70 p-5 space-y-4 shadow-sm">
            <span className="font-serif font-bold text-base sm:text-lg text-ink-950 dark:text-parchment-50 block">
              Source Example &amp; Distributed-Wave Parameters
            </span>

            <SensitivitySlider
              id="tesla-coil-frequency"
              patentId="us-593138-tesla-coil"
              paramKey="disturbanceFrequencyHz"
              label="Disturbance frequency"
              value={controls.disturbanceFrequencyHz}
              min={500}
              max={1500}
              step={25}
              unit="Hz"
              onChange={(val) => updateParam("disturbanceFrequencyHz", val)}
              allParams={params}
            />

            <SensitivitySlider
              id="tesla-coil-secondary-length"
              patentId="us-593138-tesla-coil"
              paramKey="secondaryLengthMiles"
              label="Developed secondary wire length"
              value={controls.secondaryLengthMiles}
              min={25}
              max={75}
              step={1}
              unit="mi"
              onChange={(val) => updateParam("secondaryLengthMiles", val)}
              allParams={params}
            />

            <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-ink-950 dark:text-parchment-100 text-xs sm:text-sm font-sans">
              <span className="font-bold text-purple-900 dark:text-purple-300 block font-mono text-xs uppercase tracking-wider mb-1">
                Quarter-Wave Resonance:
              </span>
              <p className="leading-relaxed">
                Tesla&apos;s printed example uses 925 Hz, a propagation speed of 185,000 mi/s, and a
                50 mi secondary: exactly one quarter of a 200 mi wavelength. The current inputs
                produce {res.electricalLengthDeg.toFixed(1)}° electrical length and a{" "}
                {res.lengthErrorMiles.toFixed(2)} mi length error. Absolute voltage remains unknown
                because the grant does not supply the required excitation, impedance, loss, or load
                data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
