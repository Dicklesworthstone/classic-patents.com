"use client";

import { useId, useMemo, useState } from "react";
import { stepBellPhotophone } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

interface BellPhotophoneSimProps {
  initialVoiceSplDb?: number;
  initialDistanceM?: number;
  initialSolarWPerM2?: number;
}

export function BellPhotophoneSim({
  initialVoiceSplDb = 75,
  initialDistanceM = 213,
  initialSolarWPerM2 = 950,
}: BellPhotophoneSimProps) {
  const voiceId = useId();
  const distId = useId();
  const solarId = useId();

  const { params, updateParam } = usePatentPhysics("us-235199-bell-photophone");
  const voiceSplDb = params.voiceSplDb ?? initialVoiceSplDb;
  const transmissionDistanceM = params.transmissionDistanceM ?? initialDistanceM;
  const solarIrradianceWPerM2 = params.solarIrradianceWPerM2 ?? initialSolarWPerM2;
  const [isAudioActive, setIsAudioActive] = useState<boolean>(true);

  const photoState = useMemo(() => {
    return stepBellPhotophone({
      voiceSplDb: isAudioActive ? voiceSplDb : 40,
      transmissionDistanceM,
      solarIrradianceWPerM2,
    });
  }, [voiceSplDb, transmissionDistanceM, solarIrradianceWPerM2, isAudioActive]);

  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-neutral-100 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-amber-400">
            Alexander Graham Bell Photophone Optical Wireless Simulation
          </h3>
          <p className="text-sm text-neutral-400">
            US Patent 235,199 (1880) • Voice-Modulated Sunbeam, Parabolic Flux Collector &
            Photoconductive Selenium
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAudioActive(!isAudioActive)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border ${
              isAudioActive
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30"
                : "bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700"
            }`}
          >
            {isAudioActive ? "Voice Modulating ON" : "Quiet Beam (Unmodulated)"}
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
            {isAudioActive && (
              <g stroke="#38bdf8" strokeWidth="1.5" fill="none" opacity="0.8">
                <path d="M -35 -15 A 20 20 0 0 1 -35 15" />
                <path d="M -25 -10 A 12 12 0 0 1 -25 10" />
              </g>
            )}

            {/* Flexible Mirror Diaphragm */}
            {(() => {
              const flex = (photoState.diaphragmDisplacementUm / 25.0) * 8;
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
            const spread = 20 + photoState.modulationDepth * 25;
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
                  MODULATED LIGHT BEAM ({transmissionDistanceM} METERS)
                </text>
                <text
                  x="510"
                  y="255"
                  fill="#facc15"
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  Divergence: {photoState.beamDivergenceMrad.toFixed(1)} mrad • Mod:{" "}
                  {(photoState.modulationDepth * 100).toFixed(0)}%
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
              {isAudioActive && (
                <g stroke="#34d399" strokeWidth="2" fill="none" opacity="0.9">
                  <path d="M 22 -10 A 15 15 0 0 1 22 10" />
                  <path d="M 28 -16 A 24 24 0 0 1 28 16" />
                </g>
              )}
            </g>
          </g>
        </svg>
      </div>

      {/* Interactive Controls & Telemetry Readouts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-950/60 p-5 rounded-xl border border-neutral-800">
        {/* Left: Input Sliders */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Real-Time Optical Link Controllers
          </h4>

          {/* Voice SPL Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-mono">
              <label htmlFor={voiceId} className="text-neutral-300">
                Speaker Vocal Sound Pressure Level
              </label>
              <span className="text-amber-400 font-bold">{voiceSplDb} dB SPL</span>
            </div>
            <input
              id={voiceId}
              type="range"
              min="50"
              max="95"
              step="1"
              value={voiceSplDb}
              onChange={(e) => updateParam("voiceSplDb", parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 bg-neutral-800 rounded-lg h-2 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>50 dB (Whisper)</span>
              <span>75 dB (Conversation)</span>
              <span>95 dB (Shout)</span>
            </div>
          </div>

          {/* Transmission Distance Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-mono">
              <label htmlFor={distId} className="text-neutral-300">
                Free-Space Wireless Distance
              </label>
              <span className="text-cyan-400 font-bold">{transmissionDistanceM} meters</span>
            </div>
            <input
              id={distId}
              type="range"
              min="10"
              max="500"
              step="5"
              value={transmissionDistanceM}
              onChange={(e) => updateParam("transmissionDistanceM", parseInt(e.target.value, 10))}
              className="w-full accent-cyan-500 bg-neutral-800 rounded-lg h-2 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>10 m (Lab)</span>
              <span>213 m (Franklin School 1880)</span>
              <span>500 m (Long Range)</span>
            </div>
          </div>

          {/* Solar Irradiance Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-mono">
              <label htmlFor={solarId} className="text-neutral-300">
                Source Solar Radiant Flux
              </label>
              <span className="text-yellow-400 font-bold">{solarIrradianceWPerM2} W/m²</span>
            </div>
            <input
              id={solarId}
              type="range"
              min="200"
              max="1200"
              step="50"
              value={solarIrradianceWPerM2}
              onChange={(e) => updateParam("solarIrradianceWPerM2", parseInt(e.target.value, 10))}
              className="w-full accent-yellow-500 bg-neutral-800 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>

        {/* Right: Live SI Telemetry HUD */}
        <div className="flex flex-col gap-3 justify-center font-mono text-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Computed Telemetry & Semiconductor State
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
              <span className="text-neutral-500 text-[10px] block uppercase">
                Concentrated Power
              </span>
              <span className="text-sm font-bold text-amber-400">
                {photoState.concentratedPowerMw.toFixed(2)} mW
              </span>
            </div>
            <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
              <span className="text-neutral-500 text-[10px] block uppercase">
                Selenium Resistance
              </span>
              <span className="text-sm font-bold text-emerald-400">
                {photoState.seleniumOperatingResistanceKOhms.toFixed(1)} kΩ
              </span>
            </div>
            <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
              <span className="text-neutral-500 text-[10px] block uppercase">
                Audio Signal Current
              </span>
              <span className="text-sm font-bold text-cyan-400">
                {photoState.audioSignalCurrentUa.toFixed(2)} µA
              </span>
            </div>
            <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
              <span className="text-neutral-500 text-[10px] block uppercase">Reproduced Audio</span>
              <span className="text-sm font-bold text-indigo-400">
                {photoState.reproducedAudioSplDb.toFixed(1)} dB SPL
              </span>
            </div>
          </div>
          <div className="p-2.5 rounded bg-neutral-900/80 border border-neutral-800 text-[11px] text-neutral-400">
            <span className="text-amber-300 font-semibold">Historic Note: </span>
            On June 3, 1880, Bell and Tainter transmitted articulate speech 213 meters from the roof
            of Franklin School to 1325 L Street NW, Washington, D.C.
          </div>
        </div>
      </div>
    </div>
  );
}
