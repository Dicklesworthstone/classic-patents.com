"use client";

import { Radio } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/** 88 piano-roll slots: 37 is coprime with 88, so one revolution visits every key once. */
const PIANO_KEYS = 88;
const PIANO_ROLL_STEP = 37;

function pianoRollChannel(step: number): number {
  return ((step * PIANO_ROLL_STEP) % PIANO_KEYS) + 1;
}

/** US 2,292,387 88-key span as labeled on the spectrum axis: 302–520 MHz. */
function channelFrequencyMhz(channel: number): number {
  return 302 + ((channel - 1) * (520 - 302)) / (PIANO_KEYS - 1);
}

export function LamarrFrequencyHoppingSim() {
  const [isHoppingActive, setIsHoppingActive] = useState<boolean>(true);
  // Store hops/sec so the slider polarity matches the label (right = faster).
  const [hopsPerSec, setHopsPerSec] = useState<number>(7);
  const [isEnemyJamming, setIsEnemyJamming] = useState<boolean>(true);
  const [jammingFrequencyChannel, setJammingFrequencyChannel] = useState<number>(44); // Spot jamming channel 1-88
  const [currentChannel, setCurrentChannel] = useState<number>(() => pianoRollChannel(0));
  const [historyChannels, setHistoryChannels] = useState<number[]>(() =>
    [0, 1, 2, 3, 4, 5].map(pianoRollChannel),
  );
  const rollStepRef = useRef(0);

  // Shared player-piano roll — not Math.random. Transmitter and receiver share the same punched sequence.
  useEffect(() => {
    if (!isHoppingActive) return;

    const intervalMs = Math.round(1000 / Math.max(1, hopsPerSec));
    const interval = setInterval(() => {
      rollStepRef.current += 1;
      const nextChannel = pianoRollChannel(rollStepRef.current);
      setCurrentChannel(nextChannel);
      setHistoryChannels((hist) => [nextChannel, ...hist.slice(0, 15)]);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isHoppingActive, hopsPerSec]);

  // Is current carrier jammed?
  const isJammedThisInstant = isEnemyJamming && currentChannel === jammingFrequencyChannel;
  const jammingInterferencePercent = isEnemyJamming ? (1 / 88) * 100 : 0; // Only 1.14% packet loss!

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-purple-500 animate-pulse" />
            <h3 className="font-serif text-xl font-bold text-ink-900 dark:text-parchment-100">
              Lamarr–Antheil 88-Channel Frequency-Hopping Spread Spectrum Simulator (US 2,292,387)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-1">
            Observe how pseudo-random piano-roll carrier hopping makes radio torpedo guidance immune
            to enemy spot jamming.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsHoppingActive((active) => !active)}
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
            onClick={() => setIsEnemyJamming(!isEnemyJamming)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors border shadow-sm ${
              isEnemyJamming
                ? "bg-red-600 text-white border-red-700 animate-pulse"
                : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300"
            }`}
          >
            {isEnemyJamming ? "⚠ Enemy Spot Jammer (Active)" : "Enemy Jammer: Off"}
          </button>
        </div>
      </div>

      {/* Visual Canvas: 88-Channel RF Spectrum Analyzer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-ink-950 p-6 border border-parchment-200 dark:border-ink-800 relative min-h-[360px] space-y-4">
          {/* Status Banner */}
          <div className="w-full flex items-center justify-between z-10 px-2 text-xs font-mono">
            {isJammedThisInstant ? (
              <span className="px-3 py-1 bg-red-950/90 border border-red-700 text-red-300 rounded-lg">
                ⚠ BLIP JAMMED: Single channel hit, but carrier hops immediately!
              </span>
            ) : (
              <span className="px-3 py-1 bg-emerald-950/90 border border-emerald-700 text-emerald-300 rounded-lg">
                ✓ SIGNAL CLEAR: Active on Carrier Channel #{currentChannel} (
                {channelFrequencyMhz(currentChannel).toFixed(1)} MHz)
              </span>
            )}

            <div className="text-purple-400 font-bold">
              Processing Gain: <span className="text-amber-400 font-bold">+19.4 dB</span>
            </div>
          </div>

          {/* 88 Piano Key RF Channel Spectrum Analyzer SVG */}
          <svg viewBox="0 0 440 180" className="w-full max-w-md h-auto select-none">
            {/* 88 Channel Frequency Bars */}
            {Array.from({ length: 88 }).map((_, i) => {
              const channelNum = i + 1;
              const xPos = 20 + i * 4.5;
              const isCurrent = channelNum === currentChannel;
              const isJammer = isEnemyJamming && channelNum === jammingFrequencyChannel;
              const wasRecent = historyChannels.includes(channelNum);

              let barHeight = 15;
              let barColor = "#334155";

              if (isCurrent) {
                barHeight = 110;
                barColor = isJammer ? "#ef4444" : "#10b981";
              } else if (isJammer) {
                barHeight = 90;
                barColor = "#ef4444";
              } else if (wasRecent) {
                barHeight = 45;
                barColor = "#a855f7";
              }

              return (
                <rect
                  key={i}
                  x={xPos}
                  y={140 - barHeight}
                  width="3.2"
                  height={barHeight}
                  rx="1"
                  fill={barColor}
                />
              );
            })}

            {/* Base Frequency Axis Line */}
            <line x1="15" y1="140" x2="425" y2="140" stroke="#475569" strokeWidth="1.5" />
            <text x="20" y="160" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              Channel 1 (302 MHz)
            </text>
            <text
              x="420"
              y="160"
              fill="#94a3b8"
              fontSize="8"
              textAnchor="end"
              fontFamily="monospace"
            >
              Channel 88 (520 MHz)
            </text>
          </svg>

          {/* Telemetry Footer */}
          <div className="w-full grid grid-cols-3 gap-2 text-center text-xs font-mono pt-3 border-t border-ink-800 text-ink-300">
            <div>
              <span className="text-ink-500 block text-[10px]">HOPPING CHANNELS</span>
              <span className="text-purple-400 font-bold">88 Piano Frequencies</span>
            </div>
            <div>
              <span className="text-ink-500 block text-[10px]">HOP RATE</span>
              <span className="text-amber-400 font-bold">{hopsPerSec} Hops/sec</span>
            </div>
            <div>
              <span className="text-ink-500 block text-[10px]">JAMMER IMPACT</span>
              <span className="text-emerald-400 font-bold">
                &lt; {jammingInterferencePercent.toFixed(1)}% Loss (Negligible)
              </span>
            </div>
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/70 dark:bg-ink-900/60 p-5 space-y-4">
            <span className="font-serif font-bold text-sm text-ink-900 dark:text-parchment-100 block">
              Piano Roll Coder &amp; Jammer
            </span>

            {/* Hop Speed Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Piano Roll Advance Speed
                </span>
                <span className="text-purple-600 dark:text-purple-400 font-bold">
                  {hopsPerSec} hops/sec
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="20"
                step="1"
                value={hopsPerSec}
                onChange={(e) => setHopsPerSec(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-ink-500 font-mono">
                <span>2 hops/sec</span>
                <span>20 hops/sec</span>
              </div>
            </div>

            {/* Enemy Jamming Spot Channel */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Enemy Jammer Target Channel
                </span>
                <span className="text-red-600 dark:text-red-400 font-bold">
                  Ch #{jammingFrequencyChannel}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="88"
                value={jammingFrequencyChannel}
                onChange={(e) => setJammingFrequencyChannel(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-ink-900 dark:text-parchment-100 text-xs font-sans space-y-1">
              <span className="font-bold text-purple-900 dark:text-purple-300 block font-mono text-[11px]">
                Why Frequency Hopping Conquered Jamming:
              </span>
              <p className="leading-relaxed">
                An enemy broadcasting high-power noise on Channel #{jammingFrequencyChannel} only
                blocks the torpedo signal when the carrier hits that exact channel (1 out of 88
                times). 98.9% of all command packets get through completely uninterrupted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
