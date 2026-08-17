"use client";

import { Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { usePatentAudio } from "./three/usePatentAudio";

export function HollerithTabulatingSim() {
  const { params, resetParams } = usePatentPhysics("us-395781-hollerith-tabulating");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const circuitVoltageV = params.batteryVolts ?? 12.0;
  const cardsPerMinuteRate = params.cardsPerMin ?? 60;
  const [activeDemographic, setActiveDemographic] = useState<string>("Male, Age 20-30, Native");
  const [totalCardsProcessed, setTotalCardsProcessed] = useState<number>(450);
  const [isPressDown, setIsPressDown] = useState<boolean>(false);

  // Electrical Tabulation Physics
  const _mercuryPoolResistanceOhms = 0.5;
  const currentPerPinAmps = Number((circuitVoltageV / 24).toFixed(2)); // 24 ohm solenoid
  const sortingPocketOpen = activeDemographic.includes("Male") ? 3 : 7;

  const handleTabulateCard = () => {
    setIsPressDown(true);
    setTotalCardsProcessed((prev) => prev + 1);
    setTimeout(() => setIsPressDown(false), 500);
  };

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
            Hollerith Punched Card Tabulating System (US 395,781)
          </h3>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400">
            Interactive 2D Electromechanical Model — Spring-Loaded Sensing Pins, Mercury Cup Matrix,
            and Dial Dials / Sorting Box
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleTabulateCard}
            aria-label="Lower Press / Tabulate Card"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-sans text-xs font-bold shadow transition-colors"
          >
            <Play className="w-4 h-4" />
            <span>Tabulate Card</span>
          </button>
          <button
            type="button"
            onClick={() => {
              resetParams();
              setTotalCardsProcessed(0);
              setIsPressDown(false);
            }}
            aria-label="Reset Tabulator Counter"
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
          {/* Card Reading Press Bed (Left) */}
          <g transform="translate(60, 80)">
            <rect
              x="0"
              y="80"
              width="220"
              height="90"
              rx="4"
              fill="#2D3748"
              stroke="#1A202C"
              strokeWidth="2"
            />
            <text
              x="15"
              y="160"
              fill="#CBD5E0"
              fontSize="11"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Mercury Cup Grid (288 Wells)
            </text>

            {/* Mercury Cups (Liquid Metal Pools) */}
            {Array.from({ length: 16 }).map((_, i) => (
              <circle
                key={`mercury-cup-${i * 12}`}
                cx={20 + (i % 8) * 25}
                cy={100 + Math.floor(i / 8) * 30}
                r="7"
                fill="#CBD5E0"
                stroke="#718096"
                strokeWidth="1.5"
              />
            ))}

            {/* Non-Conducting Punched Card inserted between */}
            <rect
              x="10"
              y="70"
              width="200"
              height="30"
              rx="2"
              fill="#E2E8F0"
              stroke="#B87333"
              strokeWidth="1.5"
            />
            {/* Punch Holes allowing pins through */}
            <circle cx="45" cy="85" r="4" fill="#2D3748" />
            <circle cx="95" cy="85" r="4" fill="#2D3748" />
            <circle cx="145" cy="85" r="4" fill="#2D3748" />

            {/* Spring-Loaded Brass Sensing Pin Block (Overhead Press) */}
            <g transform={`translate(0, ${isPressDown ? 45 : 10})`}>
              <rect
                x="0"
                y="0"
                width="220"
                height="30"
                rx="4"
                fill="#B87333"
                stroke="#8B5A2B"
                strokeWidth="2"
              />
              {Array.from({ length: 8 }).map((_, i) => (
                <line
                  key={`pin-${i * 25}`}
                  x1={20 + i * 25}
                  y1="30"
                  x2={20 + i * 25}
                  y2="55"
                  stroke="#D4AF37"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              ))}
              <text
                x="45"
                y="20"
                fill="#FFFFFF"
                fontSize="10"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                {isPressDown ? "CIRCUITS CLOSED" : "PIN PRESS (UP)"}
              </text>
            </g>
          </g>

          {/* Electromagnetic Counting Dials (Right) */}
          <g transform="translate(340, 60)">
            <rect
              x="0"
              y="0"
              width="220"
              height="150"
              rx="8"
              fill="#5C4033"
              stroke="#3D2817"
              strokeWidth="3"
            />
            <text x="45" y="25" fill="#D4AF37" fontSize="12" fontWeight="bold" fontFamily="serif">
              DIAL REGISTER
            </text>

            {/* 4 Clock-Face Electromagnetic Dials */}
            {[
              { label: "MALE", val: 240, x: 45, y: 65 },
              { label: "FEMALE", val: 210, x: 135, y: 65 },
              { label: "AGE 20+", val: 315, x: 45, y: 115 },
              { label: "NATIVE", val: 390, x: 135, y: 115 },
            ].map((d) => (
              <g key={d.label} transform={`translate(${d.x}, ${d.y})`}>
                <circle cx="0" cy="0" r="20" fill="#FFFFFF" stroke="#1A202C" strokeWidth="2" />
                <line
                  x1="0"
                  y1="0"
                  x2={Math.cos((d.val / 100) * 2 * Math.PI) * 14}
                  y2={Math.sin((d.val / 100) * 2 * Math.PI) * 14}
                  stroke="#E53E3E"
                  strokeWidth="2"
                />
                <text
                  x="-15"
                  y="-24"
                  fill="#D4AF37"
                  fontSize="8"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {d.label}
                </text>
              </g>
            ))}
          </g>

          {/* Sorting Box Door Opening */}
          <g transform="translate(340, 230)">
            <rect
              x="0"
              y="0"
              width="220"
              height="60"
              rx="4"
              fill="#2D3748"
              stroke="#1A202C"
              strokeWidth="2"
            />
            <text x="15" y="25" fill="#CBD5E0" fontSize="10" fontFamily="sans-serif">
              Electromagnetic Sorting Box: Pocket #{sortingPocketOpen} OPEN
            </text>
            <rect
              x={15 + sortingPocketOpen * 18}
              y="35"
              width="16"
              height="15"
              fill="#38A169"
              rx="2"
            />
          </g>
        </svg>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Cards Processed
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {totalCardsProcessed.toLocaleString()}
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Tabulation Rate
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            {cardsPerMinuteRate} cards/min
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Pin Current
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            {currentPerPinAmps} A ({circuitVoltageV}V)
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Sorting Pocket
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            Pocket #{sortingPocketOpen}
          </span>
        </div>
      </div>

      {/* Interactive Demographic Selector */}
      <div className="pt-2 border-t border-parchment-200 dark:border-ink-800">
        <div className="text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-2">
          Select Census Card Punch Profile to Test Sensing Grid:
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            "Male, Age 20-30, Native",
            "Female, Age 30-40, Immigrant",
            "Male, Veteran, Farmer",
            "Female, Urban, Scholar",
          ].map((demo) => (
            <button
              key={demo}
              type="button"
              onClick={() => setActiveDemographic(demo)}
              className={`px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-colors ${
                activeDemographic === demo
                  ? "bg-amber-600 text-white"
                  : "bg-parchment-200 dark:bg-ink-800 text-ink-800 dark:text-parchment-200 hover:bg-parchment-300"
              }`}
            >
              {demo}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
