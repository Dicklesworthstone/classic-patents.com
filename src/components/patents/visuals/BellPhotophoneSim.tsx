"use client";

import { RotateCcw, Sun } from "lucide-react";
import { useMemo } from "react";
import { stepBellPhotophone } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
export function BellPhotophoneSim() {
  const { params, updateParam } = usePatentPhysics("us-235199-bell-photophone");
  // Until the shared registry receives a typed boolean control, this existing
  // shared value is only a cross-face switch: zero means a static beam. It is
  // never shown as a real sound-pressure measurement.
  const beamVariationActive = (params.voiceSplDb ?? 1) > 0;

  const photoState = useMemo(() => {
    return stepBellPhotophone({
      beamVariationActive,
    });
  }, [beamVariationActive]);

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6 rounded-2xl bg-parchment-50 dark:bg-neutral-900/90 border border-parchment-300 dark:border-neutral-800 text-ink-900 dark:text-neutral-100 shadow-md backdrop-blur-md transition-colors">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-parchment-200 dark:border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-500 animate-spin-slow" />
            <h3 className="text-xl font-bold font-serif tracking-tight text-ink-950 dark:text-amber-400">
              Alexander Graham Bell Photophone Optical Wireless (US 235,199)
            </h3>
          </div>
          <p className="text-sm text-ink-600 dark:text-neutral-400">
            Voice-Modulated Sunbeam, Parabolic Flux Collector & Photoconductive Selenium Receiver
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-end lg:self-auto">
          <button
            type="button"
            onClick={() => {
              updateParam("voiceSplDb", beamVariationActive ? 0 : 1);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border ${
              beamVariationActive
                ? "bg-amber-100 dark:bg-cyan-500/20 text-amber-900 dark:text-cyan-300 border-amber-400 dark:border-cyan-500/40"
                : "bg-parchment-200 dark:bg-neutral-800 text-ink-600 dark:text-neutral-400 border-parchment-300 dark:border-neutral-700"
            }`}
          >
            {beamVariationActive ? "Beam Variation: On" : "Beam Variation: Off"}
          </button>
          <button
            type="button"
            onClick={() => {
              updateParam("voiceSplDb", 1);
            }}
            aria-label="Reset Simulation"
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive SVG Diagram */}
      <div className="relative w-full aspect-[16/9] min-h-[380px] bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800 flex items-center justify-center p-4">
        <svg
          viewBox="0 0 920 480"
          className="w-full h-full select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
            <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.85" />
              <stop offset="30%" stopColor="#fde047" stopOpacity="0.65" />
              <stop offset="70%" stopColor="#eab308" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.30" />
            </linearGradient>
            <linearGradient id="mirrorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <linearGradient id="brassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="50%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <radialGradient id="sunGlow">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
              <stop offset="40%" stopColor="#facc15" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
            </radialGradient>
            <filter id="photoglow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines */}
          <g stroke="#262626" strokeWidth="0.5" strokeDasharray="4,4">
            <line x1="40" y1="240" x2="880" y2="240" />
          </g>

          {/* 1. TRANSMITTING STATION (LEFT) */}
          {/* Natural Sun / Heliostat Source */}
          <g transform="translate(60, 80)">
            <circle cx="0" cy="0" r="38" fill="url(#sunGlow)" />
            <circle cx="0" cy="0" r="22" fill="url(#sunGrad)" filter="url(#photoglow)" />
            <text
              x="0"
              y="36"
              fill="#facc15"
              fontSize="10"
              textAnchor="middle"
              fontFamily="monospace"
              fontWeight="bold"
            >
              SUNLIGHT
            </text>
            {/* Sun rays pointing to heliostat mirror */}
            <path d="M 16 16 L 70 80" stroke="#fef08a" strokeWidth="2.5" strokeDasharray="4,2" />
            <path d="M 0 24 L 60 100" stroke="#fef08a" strokeWidth="2.5" strokeDasharray="4,2" />
          </g>

          {/* Heliostat Mirror (a) & Condenser Lens (b) */}
          <g transform="translate(130, 180)">
            <rect
              x="-6"
              y="-30"
              width="12"
              height="60"
              rx="3"
              fill="url(#mirrorGrad)"
              stroke="#cbd5e1"
              strokeWidth="1.5"
              transform="rotate(-30)"
            />
            <text x="-15" y="-35" fill="#cbd5e1" fontSize="11" fontFamily="serif" fontWeight="bold">
              a (Heliostat)
            </text>
          </g>

          {/* Condensing Lens (b) */}
          <g transform="translate(190, 240)">
            <ellipse
              cx="0"
              cy="0"
              rx="8"
              ry="40"
              fill="#38bdf8"
              fillOpacity="0.4"
              stroke="#38bdf8"
              strokeWidth="2"
            />
            <text
              x="0"
              y="-48"
              fill="#38bdf8"
              fontSize="11"
              textAnchor="middle"
              fontFamily="serif"
              fontWeight="bold"
            >
              b (Lens)
            </text>
          </g>

          {/* Voice Speaking Mouthpiece & Flexible Mirror Diaphragm (c) */}
          <g transform="translate(260, 240)">
            {/* Speaking Tube */}
            <path
              d="M -50 -50 L -20 -15 L -20 15 L -50 50 Z"
              fill="url(#brassGrad)"
              stroke="#f59e0b"
              strokeWidth="1.5"
            />
            <circle cx="-50" cy="0" r="26" fill="#171717" stroke="#b45309" strokeWidth="2" />
            <text
              x="-80"
              y="6"
              fill="#fbbf24"
              fontSize="10"
              textAnchor="end"
              fontFamily="sans-serif"
              fontWeight="bold"
            >
              VOICE
            </text>

            {/* Vocal Sound Waves (Concentric arcs) */}
            {beamVariationActive && (
              <g stroke="#38bdf8" strokeWidth="1.5" fill="none" opacity="0.8">
                <path d="M -35 -15 A 20 20 0 0 1 -35 15" />
                <path d="M -25 -10 A 12 12 0 0 1 -25 10" />
              </g>
            )}

            {/* Flexible Mirror Diaphragm */}
            {(() => {
              const flex = photoState.beamVariationActive ? 7 : 0;
              return (
                <g>
                  <path
                    d={`M 0 -35 Q ${flex} 0 0 35`}
                    stroke="#f8fafc"
                    strokeWidth="3"
                    fill="none"
                    filter="url(#photoglow)"
                  />
                  <text
                    x="10"
                    y="-42"
                    fill="#f8fafc"
                    fontSize="11"
                    fontFamily="serif"
                    fontWeight="bold"
                  >
                    c (Mirror)
                  </text>
                </g>
              );
            })()}
          </g>

          {/* Collimating Projection Lens (d) */}
          <g transform="translate(320, 240)">
            <ellipse
              cx="0"
              cy="0"
              rx="8"
              ry="48"
              fill="#38bdf8"
              fillOpacity="0.4"
              stroke="#38bdf8"
              strokeWidth="2"
            />
            <text
              x="0"
              y="-56"
              fill="#38bdf8"
              fontSize="11"
              textAnchor="middle"
              fontFamily="serif"
              fontWeight="bold"
            >
              d (Projector)
            </text>
          </g>

          {/* 2. FREE-SPACE MODULATED OPTICAL BEAM (CENTER) */}
          {(() => {
            const spread = 20 + (photoState.beamVariationActive ? 25 : 0);
            return (
              <g>
                <polygon
                  points={`328,${240 - 30} 700,${240 - spread - 45} 700,${240 + spread + 45} 328,${240 + 30}`}
                  fill="url(#beamGrad)"
                />
                {/* Ray center beam indicator */}
                <line
                  x1="328"
                  y1="240"
                  x2="700"
                  y2="240"
                  stroke="#fef08a"
                  strokeWidth="1.5"
                  strokeDasharray="6,4"
                />
                <text
                  x="510"
                  y="225"
                  fill="#fef08a"
                  fontSize="11"
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {photoState.beamVariationActive ? "VARYING RADIANT BEAM" : "STATIC RADIANT BEAM"}
                </text>
                <text
                  x="510"
                  y="255"
                  fill="#facc15"
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  Qualitative source schematic — not to scale and not a link-budget calculation
                </text>
              </g>
            );
          })()}

          {/* 3. RECEIVING STATION (RIGHT) */}
          {/* Parabolic Collector Mirror (C) */}
          <g transform="translate(730, 240)">
            {/* Parabolic arc */}
            <path
              d="M 0 -85 Q -70 0 0 85"
              fill="none"
              stroke="url(#mirrorGrad)"
              strokeWidth="6"
              filter="url(#photoglow)"
            />
            <text x="-40" y="-95" fill="#cbd5e1" fontSize="12" fontFamily="serif" fontWeight="bold">
              C (Parabolic Collector)
            </text>

            {/* Focused converging rays toward axial selenium cell */}
            <path
              d="M -5 -70 L -45 0"
              stroke="#fde047"
              strokeWidth="2"
              strokeDasharray="3,3"
              opacity="0.9"
            />
            <path
              d="M -5 70 L -45 0"
              stroke="#fde047"
              strokeWidth="2"
              strokeDasharray="3,3"
              opacity="0.9"
            />

            {/* Cylindrical Selenium Photoconductive Cell (S) at focus */}
            <g transform="translate(-45, 0)">
              {/* Stacked brass/mica discs visual */}
              <rect
                x="-12"
                y="-18"
                width="24"
                height="36"
                rx="4"
                fill="#047857"
                stroke="#34d399"
                strokeWidth="2"
                filter="url(#photoglow)"
              />
              <line x1="-12" y1="-9" x2="12" y2="-9" stroke="#fbbf24" strokeWidth="1.5" />
              <line x1="-12" y1="0" x2="12" y2="0" stroke="#fbbf24" strokeWidth="1.5" />
              <line x1="-12" y1="9" x2="12" y2="9" stroke="#fbbf24" strokeWidth="1.5" />
              <text
                x="0"
                y="32"
                fill="#34d399"
                fontSize="11"
                textAnchor="middle"
                fontFamily="sans-serif"
                fontWeight="bold"
              >
                S (Selenium Cell)
              </text>
            </g>

            {/* Electrical Circuit Loop: Battery (B) & Telephone (T) */}
            {/* Circuit wiring */}
            <path
              d="M -45 -18 L -45 -60 L 60 -60 L 60 -20"
              stroke="#38bdf8"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M -45 18 L -45 60 L 60 60 L 60 20"
              stroke="#38bdf8"
              strokeWidth="2"
              fill="none"
            />

            {/* Battery (B) */}
            <g transform="translate(60, -20)">
              <rect
                x="-15"
                y="-15"
                width="30"
                height="25"
                rx="3"
                fill="#1e293b"
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
              <text
                x="0"
                y="2"
                fill="#38bdf8"
                fontSize="10"
                textAnchor="middle"
                fontFamily="sans-serif"
                fontWeight="bold"
              >
                BATTERY
              </text>
            </g>

            {/* Telephone Receiver Earpiece (T) */}
            <g transform="translate(60, 20)">
              <path
                d="M -10 -5 L 15 -18 L 15 18 L -10 5 Z"
                fill="url(#brassGrad)"
                stroke="#f59e0b"
                strokeWidth="1.5"
              />
              <text
                x="30"
                y="4"
                fill="#fbbf24"
                fontSize="11"
                fontFamily="sans-serif"
                fontWeight="bold"
              >
                T (Telephone)
              </text>
              {/* Output sound waves */}
              {beamVariationActive && (
                <g stroke="#34d399" strokeWidth="2" fill="none" opacity="0.9">
                  <path d="M 22 -10 A 15 15 0 0 1 22 10" />
                  <path d="M 28 -16 A 24 24 0 0 1 28 16" />
                </g>
              )}
            </g>
          </g>
        </svg>
      </div>

      <aside className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-5 text-sm text-neutral-300">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Source boundary
        </h4>
        <p className="mt-2 leading-6">
          This is a qualitative reading aid for the arrangement Bell describes: a transmitter varies
          radiant energy; optics direct it; a sensitive body produces direct sound or changes a
          telephone circuit. The patent does not supply measured irradiance, range, optical efficiency,
          resistance, current, sound pressure, or a validated numerical transfer function. Those values
          are therefore intentionally withheld here.
        </p>
      </aside>
    </div>
  );
}
