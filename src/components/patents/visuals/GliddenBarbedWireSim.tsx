"use client";

import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

export function GliddenBarbedWireSim() {
  const [wireTensionLbs, setWireTensionLbs] = useState<number>(250);
  const [twistsPerFoot, setTwistsPerFoot] = useState<number>(5);
  const [animalPushForceN, setAnimalPushForceN] = useState<number>(120);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  // Structural & contact mechanics
  const wireTensionNewtons = Math.round(wireTensionLbs * 4.44822);
  const contactAreaMm2 = 0.25; // Sharp chisel point
  const contactStressMpa = Number((animalPushForceN / contactAreaMm2).toFixed(0));
  const barbSlipForceN = Number((twistsPerFoot * 95).toFixed(0));
  const isBarbLocked = barbSlipForceN > animalPushForceN;
  const isCattleDeterred = contactStressMpa > 200;

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
            Glidden "The Winner" Twisted Barbed Wire (US 157,124)
          </h3>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400">
            Interactive 2D Structural Mechanics — Two-Strand Helical Interlock, Coiled Spur Barbs,
            and High-Contact Stress Deterrence
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setWireTensionLbs(250);
              setTwistsPerFoot(5);
              setAnimalPushForceN(120);
            }}
            aria-label="Reset Simulation"
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-600" />
            )}
          </button>
        </div>
      </div>

      {/* SVG Animation Stage */}
      <div className="relative w-full aspect-[16/9] max-h-[360px] bg-parchment-100 dark:bg-ink-900 rounded-xl overflow-hidden border border-parchment-200 dark:border-ink-800 flex items-center justify-center">
        <svg viewBox="0 0 600 340" className="w-full h-full">
          {/* Fence Posts */}
          <rect
            x="20"
            y="40"
            width="30"
            height="260"
            rx="3"
            fill="#5C4033"
            stroke="#3D2817"
            strokeWidth="2"
          />
          <rect
            x="550"
            y="40"
            width="30"
            height="260"
            rx="3"
            fill="#5C4033"
            stroke="#3D2817"
            strokeWidth="2"
          />

          {/* Double-Twisted Wire Strands with Helical Sine Wave */}
          <path
            d={`M 50 170 Q 100 ${170 - twistsPerFoot * 2}, 150 170 Q 200 ${170 + twistsPerFoot * 2}, 250 170 Q 300 ${170 - twistsPerFoot * 2}, 350 170 Q 400 ${170 + twistsPerFoot * 2}, 450 170 Q 500 ${170 - twistsPerFoot * 2}, 550 170`}
            stroke="#A0AEC0"
            strokeWidth="3.5"
            fill="none"
          />
          <path
            d={`M 50 170 Q 100 ${170 + twistsPerFoot * 2}, 150 170 Q 200 ${170 - twistsPerFoot * 2}, 250 170 Q 300 ${170 + twistsPerFoot * 2}, 350 170 Q 400 ${170 - twistsPerFoot * 2}, 450 170 Q 500 ${170 + twistsPerFoot * 2}, 550 170`}
            stroke="#718096"
            strokeWidth="3.5"
            fill="none"
          />

          {/* Coiled 2-Point Spur Barbs locked at fixed intervals */}
          {[150, 250, 350, 450].map((x) => (
            <g key={`barb-${x}`} transform={`translate(${x}, 170)`}>
              {/* Coiled wrap around primary strand */}
              <ellipse
                cx="0"
                cy="0"
                rx="7"
                ry="12"
                fill="#D69E2E"
                stroke="#744210"
                strokeWidth="2"
              />
              {/* Two sharp diagonal prongs */}
              <line
                x1="-16"
                y1="-28"
                x2="16"
                y2="28"
                stroke="#E2E8F0"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Sharp tips */}
              <polygon
                points="-16,-28 -22,-36 -12,-30"
                fill="#E2E8F0"
                stroke="#718096"
                strokeWidth="1"
              />
              <polygon points="16,28 22,36 12,30" fill="#E2E8F0" stroke="#718096" strokeWidth="1" />
            </g>
          ))}

          {/* Contact Force Vector Arrow */}
          <g transform="translate(350, 110)">
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="25"
              stroke="#E53E3E"
              strokeWidth="3"
              markerEnd="url(#arrow)"
            />
            <text
              x="10"
              y="15"
              fill="#E53E3E"
              fontSize="10"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Animal Contact: {contactStressMpa} MPa
            </text>
          </g>
        </svg>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Wire Tension
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {wireTensionNewtons} N ({wireTensionLbs} lbs)
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Contact Stress
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            {contactStressMpa} MPa
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Barb Slip Resistance
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            {barbSlipForceN} N
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Barb Lock &amp; Deterrence
          </span>
          <span
            className={`font-mono text-sm sm:text-base font-bold ${
              isBarbLocked && isCattleDeterred
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-amber-600 dark:text-amber-400"
            }`}
          >
            {isBarbLocked
              ? isCattleDeterred
                ? "Locked & Deterred"
                : "Locked (Low Pain)"
              : "Slipping Barb"}
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-parchment-200 dark:border-ink-800">
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Twists per Foot Pitch</span>
            <span className="font-mono">{twistsPerFoot} twists/ft</span>
          </div>
          <input
            type="range"
            min="2"
            max="8"
            step="1"
            value={twistsPerFoot}
            onChange={(e) => setTwistsPerFoot(Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Animal Push Force</span>
            <span className="font-mono">{animalPushForceN} N</span>
          </div>
          <input
            type="range"
            min="20"
            max="300"
            step="10"
            value={animalPushForceN}
            onChange={(e) => setAnimalPushForceN(Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
