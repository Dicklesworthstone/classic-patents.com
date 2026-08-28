"use client";

import { Radio, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";
import { useOffscreenGate } from "./useOffscreenGate";

const TRANSMITTER_ROWS = ["A", "B", "C", "D", "E", "F", "G"] as const;
const RECEIVER_ROWS = new Set(["D", "E", "F", "G"]);

export function LamarrFrequencyHoppingSim() {
  const { params, updateParam, resetParams } = usePatentPhysics(
    "us-2292387-lamarr-frequency-hopping",
  );
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const [isHoppingActive, setIsHoppingActive] = useState<boolean>(true);
  const [recordPosition, setRecordPosition] = useState(() =>
    Math.max(0, Math.min(6, Math.round(params.recordPosition ?? 0))),
  );
  const [rudderStep, setRudderStep] = useState(0);
  const [commandTone, setCommandTone] = useState<100 | 500>(100);
  const { rootRef, onscreenRef } = useOffscreenGate<HTMLDivElement>();

  // Shared player-piano roll — not Math.random. Transmitter and receiver share the same punched sequence.
  useEffect(() => {
    if (!isHoppingActive) return;

    const interval = setInterval(() => {
      if (!onscreenRef.current) return;
      setRecordPosition((position) => (position + 1) % 7);
    }, 700);

    return () => clearInterval(interval);
  }, [isHoppingActive, onscreenRef.current]);

  const txRow = TRANSMITTER_ROWS[recordPosition] ?? "A";
  const receiverTuned = RECEIVER_ROWS.has(txRow);
  const lampOn = !receiverTuned;
  const transmitCommand = () => {
    if (!receiverTuned) return;
    setRudderStep((step) => step + (commandTone === 100 ? -1 : 1));
    soundEngine.playSwitchClick();
  };

  return (
    <div
      ref={rootRef}
      className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 shadow-patent space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-purple-500 animate-pulse" />
            <h3 className="font-serif text-xl font-bold text-ink-900 dark:text-parchment-100">
              Lamarr–Antheil synchronized record simulator (US 2,292,387)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-1">
            Step matched perforated records through the seven illustrated transmitter channels and
            four receiver channels.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end lg:self-auto">
          <button
            type="button"
            onClick={() => {
              setIsHoppingActive((active) => !active);
              soundEngine.playSwitchClick();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors border shadow-sm ${
              isHoppingActive
                ? "bg-purple-700 text-white border-purple-800"
                : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300"
            }`}
          >
            {isHoppingActive ? "Piano Roll: Running" : "Piano Roll: Paused"}
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
              setIsHoppingActive(true);
              setRecordPosition(0);
              setRudderStep(0);
              setCommandTone(100);
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-2xl bg-ink-950 p-6 border border-ink-800 space-y-5">
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="rounded-xl border border-purple-700/50 bg-purple-950/40 p-4">
              <span className="text-purple-300 block mb-2">TRANSMITTER RECORD 37</span>
              <div className="flex gap-1.5">
                {TRANSMITTER_ROWS.map((row) => (
                  <span
                    key={row}
                    className={`w-8 h-8 rounded border flex items-center justify-center ${row === txRow ? "bg-purple-500 text-white border-purple-300" : "border-ink-600 text-ink-400"}`}
                  >
                    {row}
                  </span>
                ))}
              </div>
              <span className="text-ink-400 block mt-3">7 tuning condensers · 24a–24g</span>
            </div>
            <div className="rounded-xl border border-cyan-700/50 bg-cyan-950/30 p-4">
              <span className="text-cyan-300 block mb-2">RECEIVER RECORD 37′</span>
              <div className="flex gap-1.5">
                {TRANSMITTER_ROWS.map((row) => (
                  <span
                    key={row}
                    className={`w-8 h-8 rounded border flex items-center justify-center ${row === txRow && receiverTuned ? "bg-cyan-500 text-white border-cyan-300" : "border-ink-600 text-ink-400"}`}
                  >
                    {row}
                  </span>
                ))}
              </div>
              <span className="text-ink-400 block mt-3">4 effective channels · 24′d–24′g</span>
            </div>
          </div>
          <div
            className={`rounded-xl border p-4 flex items-center justify-between ${lampOn ? "border-amber-500 bg-amber-950/50" : "border-emerald-700 bg-emerald-950/30"}`}
          >
            <div>
              <span className="text-xs font-mono text-ink-400 block">ROW H / LAMP 43</span>
              <span className="text-sm text-parchment-100">
                {lampOn
                  ? "LAMP ON — transmitter-only false channel"
                  : "LAMP OFF — transmitter and receiver tuned alike"}
              </span>
            </div>
            <span
              className={`w-5 h-5 rounded-full ${lampOn ? "bg-amber-300 shadow-[0_0_18px_#fcd34d]" : "bg-ink-700"}`}
            />
          </div>
          <div className="rounded-xl border border-ink-700 p-4 text-sm text-parchment-100 flex items-center justify-between">
            <span>Discrete rudder position</span>
            <span className="font-mono text-cyan-300">
              {rudderStep > 0 ? `+${rudderStep}` : rudderStep} steps
            </span>
          </div>
        </div>
        <div className="lg:col-span-4 rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/70 dark:bg-ink-900/60 p-5 space-y-5">
          <label className="space-y-2 block text-xs font-mono">
            <span className="font-semibold text-ink-800 dark:text-parchment-200">
              Record position (matched strips)
            </span>
            <input
              type="range"
              min="0"
              max="6"
              step="1"
              value={recordPosition}
              onChange={(event) => {
                const next = Number(event.target.value);
                setRecordPosition(next);
                updateParam("recordPosition", next);
              }}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-purple-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
            <span className="text-ink-500">
              Row {txRow} · transmitter {receiverTuned ? "and receiver" : "only"}
            </span>
          </label>
          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold text-ink-800 dark:text-parchment-200">
              Command tone
            </span>
            <div className="grid grid-cols-2 gap-2">
              {([100, 500] as const).map((tone) => (
                <button
                  key={tone}
                  type="button"
                  onClick={() => setCommandTone(tone)}
                  className={`rounded-lg border px-3 py-2 text-xs font-mono ${commandTone === tone ? "bg-purple-700 text-white border-purple-800" : "bg-white/60 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"}`}
                >
                  {tone}-cycle → {tone === 100 ? "left" : "right"} rudder
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={transmitCommand}
            disabled={!receiverTuned}
            className="w-full rounded-lg border border-cyan-700 bg-cyan-700 px-3 py-2 text-xs font-mono font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Transmit one discrete command
          </button>
          <p className="text-xs leading-relaxed text-ink-700 dark:text-ink-300">
            A brief 100-cycle or 500-cycle modulation is detected at the receiver and advances the
            rudder by one ratchet increment. A, B, and C are deliberately unreceivable transmitter
            channels; the lamp warns the operator.
          </p>
        </div>
      </div>
    </div>
  );
}
