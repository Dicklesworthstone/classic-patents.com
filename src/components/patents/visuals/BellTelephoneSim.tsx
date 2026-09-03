"use client";

import { Mic, RotateCcw, Volume2, VolumeX, Waves } from "lucide-react";
import { useEffect, useState } from "react";
import { bellScopeSample, stepBellTelephone } from "@/physics/catalogKernels";
import { formatSones, sonesFromDbSpl } from "@/physics/psycho";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";
import { useOffscreenGate } from "./useOffscreenGate";

export function BellTelephoneSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-174465-bell-telephone");
  const acousticFrequency = params.acousticFrequencyHz ?? 440;
  const voiceAmplitude = params.voiceAmplitude ?? 75;
  const batteryVoltage = params.batteryVoltage ?? 6;
  const liquidConductivity = params.liquidConductivity ?? 1.2;
  const loudnessSones = sonesFromDbSpl(voiceAmplitude);
  const bell = stepBellTelephone({
    voiceAmplitude,
    airGap: params.airGap ?? 0.35,
    batteryVoltage,
    liquidConductivity,
    acousticFrequencyHz: acousticFrequency,
  });
  const [signalType, setSignalType] = useState<"continuous-undulating" | "intermittent-make-break">(
    "continuous-undulating",
  );
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  // Museum contract: silent until the visitor asks for sound. The hook remutes
  // the shared engine on mount, so landing directly on this face can never
  // inherit an unmuted singleton from a previous patent visit.
  const { isAudioMuted, setMuted } = usePatentAudio();
  const [time, setTime] = useState<number>(0);
  const { rootRef, onscreenRef } = useOffscreenGate<HTMLDivElement>();

  useEffect(() => {
    const timer = setInterval(() => {
      if (!onscreenRef.current) return;
      setTime((t) => t + 1);
    }, 40);
    return () => clearInterval(timer);
  }, [onscreenRef]);

  // Update real-time Web Audio synthesis when playing
  useEffect(() => {
    if (isPlayingAudio) {
      if (signalType === "continuous-undulating") {
        soundEngine.playContinuousTone(acousticFrequency, "sine", bell.toneGainSine);
      } else {
        soundEngine.playContinuousTone(acousticFrequency, "square", bell.toneGainSquare);
      }
    } else {
      soundEngine.stopContinuousTone();
    }
    return () => {
      soundEngine.stopContinuousTone();
    };
  }, [isPlayingAudio, signalType, acousticFrequency, bell.toneGainSine, bell.toneGainSquare]);

  // Generate oscilloscope waveform points — spatial frequency tracks the voice-frequency slider.
  const points = Array.from({ length: bell.scopeSampleCount })
    .map((_, i) => {
      const sample = bellScopeSample(
        i,
        time,
        bell.scopeNorm,
        bell.scopeSineAmp,
        bell.scopeHarmonicAmp,
        bell.scopeSquareAmp,
        signalType,
        bell.scopeSamplePitchPx,
        bell.scopeTScale,
        bell.scopeBaselineY,
      );
      return `${sample.x},${sample.y}`;
    })
    .join(" ");

  return (
    <div
      ref={rootRef}
      className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Waves className="w-5 h-5 text-blue-500" />
            <h3 className="font-serif text-lg sm:text-xl font-bold text-ink-900 dark:text-parchment-100">
              Alexander Graham Bell Telephone &amp; Undulating Current Transducer (US 174,465)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-0.5">
            Continuous undulating analog current vs prior-art intermittent make-and-break telegraph
            clicks.
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            aria-label="Toggle test tone"
            type="button"
            onClick={() => {
              const next = !isPlayingAudio;
              if (next && isAudioMuted) {
                setMuted(false);
              }
              setIsPlayingAudio(next);
              soundEngine.playSwitchClick();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors border shadow-sm ${
              isPlayingAudio
                ? "bg-emerald-600 text-white border-emerald-700 animate-pulse"
                : "bg-parchment-200 dark:bg-ink-800 text-ink-800 dark:text-parchment-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-300"
            }`}
          >
            {isPlayingAudio ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span>{isPlayingAudio ? "Live Tone: ON" : "Play Tone"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              resetParams();
              setIsPlayingAudio(false);
              setSignalType("continuous-undulating");
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

      <div className="my-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Transducer & Oscilloscope */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center rounded-xl bg-ink-950 p-5 border border-parchment-200 dark:border-ink-800 space-y-4">
          <div className="w-full flex items-center justify-between text-xs font-mono text-ink-400 px-2">
            <span className="flex items-center gap-1 text-amber-400">
              <Mic className="w-3.5 h-3.5" /> Vocal Sound Input (Air Pressure)
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Volume2 className="w-3.5 h-3.5" /> Receiver {bell.diaphragmUm} µm /{" "}
              {bell.modulatedMa} mA · R₀ {bell.baseResistanceOhms} Ω · I₀ {bell.currentBaselineMa}{" "}
              mA · ω {bell.acousticDisplayOmegaRadPerS.toFixed(0)} rad/s
            </span>
          </div>

          {/* Oscilloscope Waveform Screen */}
          <div className="w-full h-36 bg-ink-900 rounded-lg border border-ink-800 p-2 relative overflow-hidden flex items-center">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:15px_15px] opacity-30" />

            <svg
              viewBox="0 0 300 100"
              role="img"
              aria-label={`Bell telephone oscilloscope: ${signalType === "continuous-undulating" ? "continuous undulating current" : "intermittent make-and-break current"}, receiver diaphragm deflection ${bell.diaphragmUm} micrometers and modulated current ${bell.modulatedMa} milliamps${isPlayingAudio ? ", audio playing" : ""}`}
              className="w-full h-full relative z-10"
            >
              <polyline
                fill="none"
                stroke={signalType === "continuous-undulating" ? "#10b981" : "#ef4444"}
                strokeWidth={2 + bell.acousticWaveRms * 2}
                opacity={Math.min(1, 0.55 + bell.acousticWaveRms)}
                points={points}
              />
            </svg>
          </div>

          <div className="w-full text-center text-xs font-mono">
            {signalType === "continuous-undulating" ? (
              <span className="text-emerald-400 font-bold">
                ✓ Intelligible Vocal Speech: Smooth Fourier harmonic waveform preserved!
              </span>
            ) : (
              <span className="text-red-400 font-bold">
                ✗ Unintelligible Clicking: Binary square pulses destroy speech formants!
              </span>
            )}
          </div>
        </div>

        {/* Controls & Mode Selection */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-parchment-100/60 dark:bg-ink-900/60 p-4 rounded-xl border border-parchment-200 dark:border-ink-800 space-y-3">
            <div>
              <span className="text-xs font-mono block text-ink-700 dark:text-ink-300 font-semibold mb-1">
                Electrical Transmission Method
              </span>
              <div className="grid grid-cols-1 gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setSignalType("continuous-undulating")}
                  className={`p-2 rounded border text-left transition-colors ${
                    signalType === "continuous-undulating"
                      ? "bg-emerald-700 text-white border-emerald-800 font-bold"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300"
                  }`}
                >
                  <div>Bell Undulating Current (Analog)</div>
                  <div className="text-[10px] opacity-80">
                    Continuous variable resistance liquid transducer (Speech)
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setSignalType("intermittent-make-break")}
                  className={`p-2 rounded border text-left transition-colors ${
                    signalType === "intermittent-make-break"
                      ? "bg-red-700 text-white border-red-800 font-bold"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300"
                  }`}
                >
                  <div>Reis / Morse Make-and-Break</div>
                  <div className="text-[10px] opacity-80">
                    Intermittent binary contact pulses (Clicks only)
                  </div>
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Voice Acoustic Frequency
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {acousticFrequency} Hz
                </span>
              </div>
              <input
                type="range"
                aria-label="Voice Acoustic Frequency"
                min="200"
                max="1000"
                step="10"
                value={acousticFrequency}
                onChange={(e) => updateParam("acousticFrequencyHz", Number(e.target.value))}
                className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Voice Sound Pressure
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {voiceAmplitude} dB · {formatSones(loudnessSones)} sone
                </span>
              </div>
              <input
                type="range"
                aria-label="Voice Sound Pressure"
                min="40"
                max="95"
                step="1"
                value={voiceAmplitude}
                onChange={(e) => updateParam("voiceAmplitude", Number(e.target.value))}
                className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Battery Voltage
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {batteryVoltage} V
                </span>
              </div>
              <input
                type="range"
                aria-label="Battery Voltage"
                min="1"
                max="12"
                step="0.5"
                value={batteryVoltage}
                onChange={(e) => updateParam("batteryVoltage", Number(e.target.value))}
                className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Acidulated Water Conductivity
                </span>
                <span className="text-purple-600 dark:text-purple-400 font-bold">
                  {liquidConductivity.toFixed(1)} S
                </span>
              </div>
              <input
                type="range"
                aria-label="Acidulated Water Conductivity"
                min="0.2"
                max="3"
                step="0.1"
                value={liquidConductivity}
                onChange={(e) => updateParam("liquidConductivity", Number(e.target.value))}
                className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-purple-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
