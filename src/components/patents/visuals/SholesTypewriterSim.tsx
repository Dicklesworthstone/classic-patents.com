"use client";

import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { usePatentAudio } from "./three/usePatentAudio";

export function SholesTypewriterSim() {
  const { resetParams } = usePatentPhysics("us-79265-sholes-typewriter");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const [typedText, setTypedText] = useState<string>("THE QUICK BROWN FOX");
  const [activeKey, setActiveKey] = useState<string>("T");

  // Escapement kinematics
  const characterPitchMm = 2.54; // Monospace 10-pitch
  const carriagePositionMm = Number((typedText.length * characterPitchMm).toFixed(2));
  const typebarStrikeAngleDeg = 90;
  const isJamDanger = activeKey === "T" || activeKey === "H"; // Illustrating digraph geometry

  const handleKeyPress = (char: string) => {
    setActiveKey(char);
    if (typedText.length < 28) {
      setTypedText((prev) => prev + char);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
            Sholes &amp; Glidden Typewriter &amp; Escapement (US 79,265)
          </h3>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400">
            Interactive 2D Mechanical Model — Circular Typebar Basket, Escapement Carriage Advance,
            and Inked Ribbon Strike
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setTypedText("");
              setActiveKey("A");
              resetParams();
            }}
            aria-label="Clear Typewriter Text"
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => toggleSound()}
            aria-label={isAudioMuted ? "Unmute Audio" : "Mute Audio"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
          >
            {isAudioMuted ? (
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
          {/* Paper Platen Roller & Escapement Carriage */}
          <g transform={`translate(${200 - carriagePositionMm * 2}, 40)`}>
            <rect
              x="0"
              y="0"
              width="340"
              height="40"
              rx="8"
              fill="#2D3748"
              stroke="#1A202C"
              strokeWidth="2"
            />
            <rect
              x="20"
              y="-15"
              width="300"
              height="25"
              fill="#FFFFFF"
              stroke="#CBD5E0"
              strokeWidth="1"
            />
            {/* Typed characters on paper */}
            <text
              x="30"
              y="2"
              fill="#1A202C"
              fontFamily="monospace"
              fontSize="13"
              fontWeight="bold"
            >
              {typedText}
            </text>
          </g>

          {/* Central Strike Point & Inked Ribbon Spools */}
          <g transform="translate(300, 75)">
            <circle cx="0" cy="0" r="6" fill="#E53E3E" opacity="0.8" />
            <line
              x1="-80"
              y1="0"
              x2="80"
              y2="0"
              stroke="#742A2A"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.6"
            />
            <circle cx="-90" cy="0" r="14" fill="#4A5568" stroke="#2D3748" strokeWidth="2" />
            <circle cx="90" cy="0" r="14" fill="#4A5568" stroke="#2D3748" strokeWidth="2" />
            <text
              x="-45"
              y="-10"
              fill="#742A2A"
              fontSize="9"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Inked Fabric Ribbon
            </text>
          </g>

          {/* Circular Radial Typebar Basket Ring */}
          <ellipse
            cx="300"
            cy="200"
            rx="140"
            ry="70"
            fill="none"
            stroke="#8B5A2B"
            strokeWidth="8"
            opacity="0.4"
          />

          {/* Radial Typebars Converging on Center */}
          <g id="typebar-basket">
            {Array.from({ length: 18 }).map((_, i) => {
              const bAngle = i * 20 + 10;
              const xStart = 300 + Math.cos((bAngle * Math.PI) / 180) * 140;
              const yStart = 200 + Math.sin((bAngle * Math.PI) / 180) * 70;
              const isCurrentActive = i === 9; // Striking bar
              return (
                <g key={`typebar-${bAngle}`}>
                  <line
                    x1={xStart}
                    y1={yStart}
                    x2={isCurrentActive ? 300 : 300 + Math.cos((bAngle * Math.PI) / 180) * 25}
                    y2={isCurrentActive ? 75 : 200 + Math.sin((bAngle * Math.PI) / 180) * 15}
                    stroke={isCurrentActive ? "#D69E2E" : "#718096"}
                    strokeWidth={isCurrentActive ? 3.5 : 2}
                  />
                  {isCurrentActive && (
                    <circle
                      cx="300"
                      cy="75"
                      r="5"
                      fill="#D69E2E"
                      stroke="#744210"
                      strokeWidth="1.5"
                    />
                  )}
                </g>
              );
            })}
          </g>

          {/* Escapement Wheel & Stepping Pawls */}
          <g transform="translate(140, 60)">
            <circle cx="0" cy="0" r="18" fill="#C5A059" stroke="#5C4033" strokeWidth="2" />
            {Array.from({ length: 12 }).map((_, i) => (
              <line
                key={`esc-tooth-${i * 30}`}
                x1="0"
                y1="0"
                x2={Math.cos((i * 30 * Math.PI) / 180) * 18}
                y2={Math.sin((i * 30 * Math.PI) / 180) * 18}
                stroke="#1A1A1A"
                strokeWidth="2"
              />
            ))}
            <text x="-40" y="-22" fill="#888" fontSize="10" fontFamily="sans-serif">
              Escapement Step
            </text>
          </g>
        </svg>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Carriage Position
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {carriagePositionMm} mm
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Character Pitch
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            {characterPitchMm} mm (10 CPI)
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Active Character
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            "{activeKey}"
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Strike Angle &amp; Jam State
          </span>
          <span
            className={`font-mono text-sm sm:text-base font-bold ${
              isJamDanger
                ? "text-amber-600 dark:text-amber-400"
                : "text-ink-900 dark:text-parchment-100"
            }`}
          >
            {typebarStrikeAngleDeg}° ({isJamDanger ? "Adjacent TH Digraph" : "Clear Stroke"})
          </span>
        </div>
      </div>

      {/* Interactive QWERTY Keyboard Row */}
      <div className="pt-2 border-t border-parchment-200 dark:border-ink-800">
        <div className="text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-2">
          Click Keys to Test Sholes Typebar Strike & Escapement Advance:
        </div>
        <div className="flex flex-wrap gap-1.5 justify-center">
          {[
            "Q",
            "W",
            "E",
            "R",
            "T",
            "Y",
            "U",
            "I",
            "O",
            "P",
            "A",
            "S",
            "D",
            "F",
            "G",
            "H",
            "J",
            "K",
            "L",
            "SPACE",
          ].map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => handleKeyPress(key === "SPACE" ? " " : key)}
              className="px-2.5 py-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-amber-600 hover:text-white dark:hover:bg-amber-600 font-mono text-xs font-bold text-ink-800 dark:text-parchment-200 transition-colors shadow-sm"
            >
              {key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
