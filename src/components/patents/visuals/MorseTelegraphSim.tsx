"use client";

import { Radio, Volume2 } from "lucide-react";
import { useState } from "react";
import { soundEngine } from "@/utils/soundEngine";

const MORSE_TABLE: Record<string, string> = {
  A: "·-",
  B: "-···",
  C: "-·-·",
  D: "-··",
  E: "·",
  F: "··-·",
  G: "--·",
  H: "····",
  I: "··",
  J: "·---",
  K: "-·-",
  L: "·-··",
  M: "--",
  N: "-·",
  O: "---",
  P: "·--·",
  Q: "--·-",
  R: "·-·",
  S: "···",
  T: "-",
  U: "··-",
  V: "···-",
  W: "·--",
  X: "-··-",
  Y: "-·--",
  Z: "--··",
};

export function MorseTelegraphSim() {
  const [inputMessage, setInputMessage] = useState<string>("WHAT HATH GOD WROUGHT");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeSymbolIndex, setActiveSymbolIndex] = useState<number>(-1);
  const [isKeyDepressed, setIsKeyDepressed] = useState<boolean>(false);
  const [lineLengthMiles, setLineLengthMiles] = useState<number>(40);
  const [isRelayEnabled, setIsRelayEnabled] = useState<boolean>(true);

  // Encode message to Morse
  const encodedSymbols = inputMessage
    .toUpperCase()
    .split("")
    .map((char) => MORSE_TABLE[char] || (char === " " ? "/" : ""))
    .join(" ");

  // Handle live manual Morse key
  const handleKeyDown = () => {
    setIsKeyDepressed(true);
    soundEngine.playContinuousTone(700, "sine", 0.1);
  };

  const handleKeyUp = () => {
    setIsKeyDepressed(false);
    soundEngine.stopContinuousTone();
  };

  // Play automated sequence
  const playMorseSequence = async () => {
    if (isPlaying) return;
    setIsPlaying(true);

    const chars = encodedSymbols.split("");
    for (let i = 0; i < chars.length; i++) {
      setActiveSymbolIndex(i);
      const sym = chars[i];
      if (sym === "·") {
        soundEngine.playContinuousTone(700, "sine", 0.1);
        await new Promise((r) => setTimeout(r, 80));
        soundEngine.stopContinuousTone();
        await new Promise((r) => setTimeout(r, 60));
      } else if (sym === "-") {
        soundEngine.playContinuousTone(700, "sine", 0.1);
        await new Promise((r) => setTimeout(r, 220));
        soundEngine.stopContinuousTone();
        await new Promise((r) => setTimeout(r, 60));
      } else if (sym === " " || sym === "/") {
        await new Promise((r) => setTimeout(r, 180));
      }
    }

    setIsPlaying(false);
    setActiveSymbolIndex(-1);
  };

  const isSignalReceived = isRelayEnabled || lineLengthMiles < 25;

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-amber-500" />
            <h3 className="font-serif text-xl font-bold text-ink-900 dark:text-parchment-100">
              Morse Electromagnetic Telegraph &amp; Relay Simulator (US 1,647)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-1">
            Experience the birth of digital telecommunications: variable-length binary encoding and
            regenerative relay amplifiers.
          </p>
        </div>

        <button
          type="button"
          onClick={playMorseSequence}
          disabled={isPlaying}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shadow-md ${
            isPlaying
              ? "bg-emerald-600 text-white animate-pulse"
              : "bg-amber-600 hover:bg-amber-700 text-white active:scale-95"
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>{isPlaying ? "Transmitting Message..." : "Transmit Morse Stream"}</span>
        </button>
      </div>

      {/* Visual Canvas & Telegraph Instruments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-ink-950 p-6 border border-parchment-200 dark:border-ink-800 relative min-h-[360px] space-y-4">
          {/* Signal Integrity Alert */}
          {!isSignalReceived && (
            <div className="w-full px-3 py-1.5 bg-red-950/90 border border-red-700 text-red-300 text-xs font-mono rounded-lg flex items-center justify-between">
              <span>
                ⚠ LINE EXTINCTION: Wire resistance extinguished signal over {lineLengthMiles} miles
                without relay!
              </span>
            </div>
          )}

          {/* Interactive Morse Key & Relay Sounder SVG */}
          <svg viewBox="0 0 440 200" className="w-full max-w-md h-auto select-none">
            {/* Transmitter Sending Key (Left) */}
            <g transform="translate(60, 100)">
              <rect
                x="-30"
                y="40"
                width="60"
                height="15"
                rx="2"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="1.5"
              />
              {/* Pivoting Brass Key Lever */}
              <g transform={`rotate(${isKeyDepressed || isPlaying ? 5 : 0})`}>
                <rect
                  x="-25"
                  y="15"
                  width="60"
                  height="10"
                  rx="2"
                  fill="#d97706"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                />
                <circle cx="30" cy="12" r="8" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
              </g>
              <text
                x="0"
                y="70"
                fill="#fde68a"
                fontSize="10"
                textAnchor="middle"
                fontFamily="monospace"
                fontWeight="bold"
              >
                Morse Key (Local)
              </text>
            </g>

            {/* Telegraph Line Wire spanning distance */}
            <line
              x1="95"
              y1="110"
              x2="220"
              y2="110"
              stroke={isKeyDepressed || isPlaying ? "#f59e0b" : "#475569"}
              strokeWidth="2.5"
              strokeDasharray="4 2"
            />
            <text
              x="155"
              y="100"
              fill="#94a3b8"
              fontSize="9"
              textAnchor="middle"
              fontFamily="monospace"
            >
              {lineLengthMiles} Miles Galvanized Wire
            </text>

            {/* Intermediate Regenerative Relay (Center) */}
            <g transform="translate(220, 100)">
              <rect
                x="-20"
                y="0"
                width="40"
                height="50"
                rx="3"
                fill="#0f172a"
                stroke={isRelayEnabled ? "#10b981" : "#ef4444"}
                strokeWidth="2"
              />
              <circle cx="0" cy="18" r="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <text
                x="0"
                y="38"
                fill="#a7f3d0"
                fontSize="8"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {isRelayEnabled ? "Relay: ON" : "Relay: OFF"}
              </text>
              <text
                x="0"
                y="65"
                fill="#38bdf8"
                fontSize="10"
                textAnchor="middle"
                fontFamily="monospace"
                fontWeight="bold"
              >
                Morse Relay
              </text>
            </g>

            {/* Distant Sounder Receiver (Right) */}
            <line
              x1="240"
              y1="110"
              x2="350"
              y2="110"
              stroke={isSignalReceived && (isKeyDepressed || isPlaying) ? "#f59e0b" : "#334155"}
              strokeWidth="2.5"
            />
            <g transform="translate(350, 100)">
              <rect
                x="-25"
                y="20"
                width="50"
                height="35"
                rx="3"
                fill="#1e293b"
                stroke="#64748b"
                strokeWidth="1.5"
              />
              <rect
                x="-15"
                y="25"
                width="30"
                height="15"
                fill={isSignalReceived && (isKeyDepressed || isPlaying) ? "#ef4444" : "#475569"}
              />
              <text
                x="0"
                y="70"
                fill="#fde68a"
                fontSize="10"
                textAnchor="middle"
                fontFamily="monospace"
                fontWeight="bold"
              >
                Sounder (Distant)
              </text>
            </g>
          </svg>

          {/* Encoded Morse Code Visual Ribbon */}
          <div className="w-full bg-ink-900/90 p-3 rounded-xl border border-ink-800 text-center space-y-1">
            <span className="text-[10px] font-mono text-ink-500 block uppercase">
              Morse Code Bitstream (Dots &amp; Dashes)
            </span>
            <div className="font-mono text-sm tracking-widest text-amber-300 font-bold overflow-x-auto whitespace-nowrap px-2">
              {encodedSymbols.split("").map((sym, idx) => (
                <span
                  key={idx}
                  className={`inline-block px-0.5 transition-colors ${
                    activeSymbolIndex === idx
                      ? "text-emerald-400 scale-125 font-black bg-emerald-950 rounded"
                      : ""
                  }`}
                >
                  {sym}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/70 dark:bg-ink-900/60 p-5 space-y-4">
            <span className="font-serif font-bold text-sm text-ink-900 dark:text-parchment-100 block">
              Telegraphic Controls
            </span>

            {/* Custom Message Input */}
            <div className="space-y-1">
              <label
                htmlFor="morse-msg-input"
                className="text-xs font-mono block text-ink-700 dark:text-ink-300 font-semibold"
              >
                Message to Encode:
              </label>
              <input
                id="morse-msg-input"
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value.toUpperCase())}
                className="w-full p-2 bg-parchment-50 dark:bg-ink-950 border border-parchment-300 dark:border-ink-700 rounded-lg text-xs font-mono font-bold text-amber-700 dark:text-amber-400"
              />
            </div>

            {/* Line Distance Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Line Wire Distance
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {lineLengthMiles} Miles
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={lineLengthMiles}
                onChange={(e) => setLineLengthMiles(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Relay Amplifier Toggle */}
            <div className="pt-2 border-t border-parchment-300 dark:border-ink-800">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono">
                <input
                  type="checkbox"
                  checked={isRelayEnabled}
                  onChange={(e) => setIsRelayEnabled(e.target.checked)}
                  className="rounded accent-emerald-600 w-4 h-4"
                />
                <span className="font-bold text-ink-900 dark:text-parchment-100">
                  Enable Regenerative Relay Repeaters
                </span>
              </label>
            </div>

            {/* Manual Morse Tapping Button */}
            <div className="pt-2">
              <button
                type="button"
                onMouseDown={handleKeyDown}
                onMouseUp={handleKeyUp}
                onTouchStart={handleKeyDown}
                onTouchEnd={handleKeyUp}
                className={`w-full py-4 rounded-xl border text-center font-mono font-bold text-xs shadow-md transition-all select-none ${
                  isKeyDepressed
                    ? "bg-amber-600 text-white border-amber-700 scale-95"
                    : "bg-parchment-200 dark:bg-ink-800 text-ink-900 dark:text-parchment-100 border-parchment-300 dark:border-ink-700"
                }`}
              >
                {isKeyDepressed ? "KEY CLOSED (MARK)" : "HOLD TO TAP MORSE KEY"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
