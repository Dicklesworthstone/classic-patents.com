"use client";

import { Mic, Volume2, VolumeX, Waves } from "lucide-react";
import { useEffect, useState } from "react";
import { formatSones, sonesFromDbSpl } from "@/physics/psycho";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";

export function BellTelephoneSim() {
  const { params, updateParam } = usePatentPhysics("us-174465-bell-telephone");
  const acousticFrequency = params.acousticFrequencyHz ?? 440;
  const voiceAmplitude = params.voiceAmplitude ?? 75;
  const loudnessSones = sonesFromDbSpl(voiceAmplitude);
  const [signalType, setSignalType] = useState<"continuous-undulating" | "intermittent-make-break">(
    "continuous-undulating",
  );
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((t) => t + 1);
    }, 40);
    return () => clearInterval(timer);
  }, []);

  // Update real-time Web Audio synthesis when playing
  useEffect(() => {
    if (isPlayingAudio) {
      if (signalType === "continuous-undulating") {
        soundEngine.playContinuousTone(acousticFrequency, "sine", (voiceAmplitude / 100) * 0.1);
      } else {
        soundEngine.playContinuousTone(acousticFrequency, "square", (voiceAmplitude / 100) * 0.06);
      }
    } else {
      soundEngine.stopContinuousTone();
    }
    return () => {
      soundEngine.stopContinuousTone();
    };
  }, [isPlayingAudio, signalType, acousticFrequency, voiceAmplitude]);

  // Generate oscilloscope waveform points — spatial frequency tracks the voice-frequency slider.
  const points = Array.from({ length: 60 })
    .map((_, i) => {
      const x = i * 5;
      const tVal = (i + time) * 0.2 * (acousticFrequency / 440);
      let y = 50;
      if (signalType === "continuous-undulating") {
        // Harmonic undulating wave
        y = 50 + Math.sin(tVal) * voiceAmplitude * 0.4 + Math.sin(tVal * 2) * voiceAmplitude * 0.15;
      } else {
        // Binary make-and-break square wave (Reis telegraph)
        y = Math.sin(tVal) > 0 ? 50 - voiceAmplitude * 0.5 : 50 + voiceAmplitude * 0.5;
      }
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-5 shadow-patent">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-blue-500" />
            <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
              Bell Undulating Current &amp; Acoustic Transducer Simulator
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-0.5">
            Compare Bell&apos;s continuous undulating analog current with prior-art binary
            make-and-break telegraph clicks.
          </p>
        </div>

        <button
          aria-label="Toggle test tone"
          type="button"
          onClick={() => setIsPlayingAudio(!isPlayingAudio)}
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
          <span>{isPlayingAudio ? "Synthesizing Audio (Live)" : "Play Audio Synth"}</span>
        </button>
      </div>

      <div className="my-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Transducer & Oscilloscope */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center rounded-xl bg-ink-950 p-5 border border-parchment-200 dark:border-ink-800 space-y-4">
          <div className="w-full flex items-center justify-between text-xs font-mono text-ink-400 px-2">
            <span className="flex items-center gap-1 text-amber-400">
              <Mic className="w-3.5 h-3.5" /> Vocal Sound Input (Air Pressure)
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Volume2 className="w-3.5 h-3.5" /> Receiver Diaphragm Output
            </span>
          </div>

          {/* Oscilloscope Waveform Screen */}
          <div className="w-full h-36 bg-ink-900 rounded-lg border border-ink-800 p-2 relative overflow-hidden flex items-center">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:15px_15px] opacity-30" />

            <svg viewBox="0 0 300 100" className="w-full h-full relative z-10">
              <polyline
                fill="none"
                stroke={signalType === "continuous-undulating" ? "#10b981" : "#ef4444"}
                strokeWidth="2.5"
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
                className="w-full accent-blue-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
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
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
