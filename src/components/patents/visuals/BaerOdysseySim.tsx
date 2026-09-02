"use client";

import { Crosshair, Play, RotateCcw, ShieldCheck, Sparkles, Tv, Zap } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import {
  type BaerOdysseyControls,
  type BaerOdysseyMetrics,
  type BaerOdysseyState,
  DEFAULT_BAER_CONTROLS,
  INITIAL_BAER_STATE,
  stepBaerOdysseySi,
} from "@/physics/baerOdysseyKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

const PATENT_ID = "us-3728480-baer-odyssey";

interface BaerOdysseySimProps {
  initialControls?: Partial<BaerOdysseyControls>;
}

type OverlayType = "none" | "tennis" | "target" | "roulette";

export function BaerOdysseySim({ initialControls }: BaerOdysseySimProps) {
  const { params, updateParam } = usePatentPhysics(PATENT_ID);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const controls = useMemo<BaerOdysseyControls>(
    () => ({
      ...DEFAULT_BAER_CONTROLS,
      ...initialControls,
      ...params,
    }),
    [initialControls, params],
  );

  const [simState, setSimState] = useState<BaerOdysseyState>(INITIAL_BAER_STATE);
  const [metrics, setMetrics] = useState<BaerOdysseyMetrics>(() => {
    return stepBaerOdysseySi(INITIAL_BAER_STATE, controls, 0.016).metrics;
  });
  const [overlay, setOverlay] = useState<OverlayType>("tennis");
  const [isPlaying, setIsPlaying] = useState(true);

  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const crtGlowId = useId();
  const phosphorGridId = useId();

  useEffect(() => {
    if (!isPlaying) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      lastTimeRef.current = null;
      return;
    }

    const animate = (timeNow: number) => {
      if (lastTimeRef.current !== null) {
        const dt = Math.min((timeNow - lastTimeRef.current) / 1000.0, 0.05);
        setSimState((prevState) => {
          const result = stepBaerOdysseySi(prevState, controls, dt);
          setMetrics(result.metrics);
          return result.state;
        });
      }
      lastTimeRef.current = timeNow;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [controls, isPlaying]);

  const handleResetGame = () => {
    setSimState(INITIAL_BAER_STATE);
    updateParam("resetButton", 1);
    setTimeout(() => {
      updateParam("resetButton", 0);
    }, 150);
  };

  const handleFireLightGun = () => {
    updateParam("lightGunTrigger", 1);
    setTimeout(() => {
      updateParam("lightGunTrigger", 0);
    }, 200);
  };

  // Screen pixel coordinate transformations (500x320 viewbox)
  const screenWidth = 460;
  const screenHeight = 280;
  const screenLeft = 20;
  const screenTop = 20;

  const p1ScreenX = screenLeft + metrics.p1X * screenWidth;
  const p1ScreenY = screenTop + metrics.p1Y * screenHeight;
  const p2ScreenX = screenLeft + metrics.p2X * screenWidth;
  const p2ScreenY = screenTop + metrics.p2Y * screenHeight;
  const ballScreenX = screenLeft + metrics.ballX * screenWidth;
  const ballScreenY = screenTop + metrics.ballY * screenHeight;

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-amber-900/60 bg-gradient-to-b from-stone-950 via-slate-950 to-neutral-950 p-6 text-slate-100 shadow-2xl">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Tv className="h-5 w-5 text-amber-500" />
            <h3 className="text-xl font-bold tracking-wide text-amber-400 font-serif">
              US 3,728,480 — Magnavox Odyssey Interactive CRT Simulator
            </h3>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            NTSC Astable Sync Multivibrators, Monostable RC Spot Positioning & Diode AND Coincidence
            Logic
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {metrics.coincidenceActive ? (
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/50 bg-emerald-950/80 px-3 py-1 text-xs font-semibold text-emerald-300 animate-pulse">
              <Zap className="h-3.5 w-3.5 text-emerald-400" />
              COINCIDENCE HIT (AND-GATE HIGH)
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full border border-stone-700 bg-stone-900/80 px-3 py-1 text-xs font-semibold text-stone-400">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-500/70" />
              VHF CH {controls.rfChannel} ({metrics.rfCarrierFreqMHz.toFixed(2)} MHz)
            </span>
          )}

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 rounded-lg border border-stone-700 bg-stone-900 px-3 py-1 text-xs font-medium text-amber-300 hover:bg-stone-800 transition"
          >
            <Play className={`h-3.5 w-3.5 ${isPlaying ? "text-emerald-400" : "text-amber-400"}`} />
            {isPlaying ? "Running (60 Hz)" : "Paused"}
          </button>

          <button
            type="button"
            onClick={handleResetGame}
            className="flex items-center gap-1.5 rounded-lg border border-stone-700 bg-stone-900 px-3 py-1 text-xs font-medium text-stone-300 hover:bg-stone-800 transition"
          >
            <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
            Reset Hit Latch
          </button>
        </div>
      </div>

      {/* Main Interactive Grid: Screen + Waveforms */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Simulated Vintage CRT Television (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="relative rounded-xl border-4 border-amber-950/80 bg-stone-900 p-3 shadow-inner">
            <div className="flex items-center justify-between pb-2 px-1 text-[11px] font-mono text-amber-400/80">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                VHF RASTER SCAN • 15,750 Hz LINE / 60 Hz FIELD
              </span>
              <span>
                SCORE: P1 [{simState.scoreP1}] — P2 [{simState.scoreP2}]
              </span>
            </div>

            {/* CRT Phosphor Screen SVG */}
            <svg
              viewBox="0 0 500 320"
              className="w-full h-auto rounded-lg border-2 border-stone-800 bg-black shadow-[inset_0_0_30px_rgba(0,0,0,0.9)]"
            >
              <defs>
                <radialGradient id={crtGlowId} cx="50%" cy="50%" r="60%">
                  <stop offset="0%" stopColor="#082f49" stopOpacity="0.4" />
                  <stop offset="80%" stopColor="#020617" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="1" />
                </radialGradient>
                <pattern id={phosphorGridId} width="4" height="4" patternUnits="userSpaceOnUse">
                  <line
                    x1="0"
                    y1="2"
                    x2="4"
                    y2="2"
                    stroke="#1e293b"
                    strokeWidth="0.5"
                    strokeOpacity="0.4"
                  />
                </pattern>
              </defs>

              {/* CRT Face Glow */}
              <rect x="10" y="10" width="480" height="300" rx="20" fill={`url(#${crtGlowId})`} />
              <rect
                x="10"
                y="10"
                width="480"
                height="300"
                rx="20"
                fill={`url(#${phosphorGridId})`}
              />

              {/* Removable Plastic Screen Overlays */}
              {overlay === "tennis" && (
                <g opacity="0.65">
                  {/* Green Court Overlay */}
                  <rect
                    x="25"
                    y="25"
                    width="450"
                    height="270"
                    rx="12"
                    fill="#064e3b"
                    fillOpacity="0.3"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                  />
                  {/* Center Net */}
                  <line
                    x1="250"
                    y1="25"
                    x2="250"
                    y2="295"
                    stroke="#fef08a"
                    strokeWidth="3"
                    strokeDasharray="8,6"
                  />
                  {/* Service Boxes */}
                  <rect
                    x="90"
                    y="65"
                    width="160"
                    height="190"
                    fill="none"
                    stroke="#6ee7b7"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="250"
                    y="65"
                    width="160"
                    height="190"
                    fill="none"
                    stroke="#6ee7b7"
                    strokeWidth="1.5"
                  />
                  <text
                    x="250"
                    y="45"
                    textAnchor="middle"
                    fill="#a7f3d0"
                    fontSize="10"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                  >
                    MAGNAVOX ODYSSEY TENNIS OVERLAY MASK
                  </text>
                </g>
              )}

              {overlay === "target" && (
                <g opacity="0.65">
                  {/* Target Shooting Overlay */}
                  <circle
                    cx="370"
                    cy="160"
                    r="85"
                    fill="#7f1d1d"
                    fillOpacity="0.25"
                    stroke="#ef4444"
                    strokeWidth="2"
                  />
                  <circle cx="370" cy="160" r="55" fill="none" stroke="#f87171" strokeWidth="2" />
                  <circle
                    cx="370"
                    cy="160"
                    r="25"
                    fill="#ef4444"
                    fillOpacity="0.4"
                    stroke="#fca5a5"
                    strokeWidth="2"
                  />
                  <line
                    x1="260"
                    y1="160"
                    x2="480"
                    y2="160"
                    stroke="#f87171"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                  />
                  <line
                    x1="370"
                    y1="50"
                    x2="370"
                    y2="270"
                    stroke="#f87171"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                  />
                  <text
                    x="370"
                    y="40"
                    textAnchor="middle"
                    fill="#fca5a5"
                    fontSize="10"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                  >
                    OPTICAL TARGET GALLERY MASK
                  </text>
                </g>
              )}

              {overlay === "roulette" && (
                <g opacity="0.65">
                  {/* Roulette Table Overlay */}
                  <circle
                    cx="250"
                    cy="160"
                    r="110"
                    fill="#1e1b4b"
                    fillOpacity="0.35"
                    stroke="#818cf8"
                    strokeWidth="2"
                  />
                  <circle cx="250" cy="160" r="75" fill="none" stroke="#a5b4fc" strokeWidth="1.5" />
                  <circle
                    cx="250"
                    cy="160"
                    r="35"
                    fill="#312e81"
                    fillOpacity="0.5"
                    stroke="#c7d2fe"
                    strokeWidth="2"
                  />
                  <text
                    x="250"
                    y="38"
                    textAnchor="middle"
                    fill="#c7d2fe"
                    fontSize="10"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                  >
                    ROULETTE WHEEL OVERLAY MASK
                  </text>
                </g>
              )}

              {/* Player 1 Paddle Spot (Square/Rectangle) */}
              <g>
                <rect
                  x={p1ScreenX - 6}
                  y={p1ScreenY - 24}
                  width="12"
                  height="48"
                  fill="#ffffff"
                  className="filter drop-shadow-[0_0_8px_#ffffff]"
                />
                <text
                  x={p1ScreenX}
                  y={p1ScreenY + 38}
                  fill="#38bdf8"
                  fontSize="9"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  P1 (Dot 20)
                </text>
              </g>

              {/* Player 2 Paddle / Target Spot */}
              {metrics.targetVisible && (
                <g>
                  <rect
                    x={p2ScreenX - 6}
                    y={p2ScreenY - 24}
                    width="12"
                    height="48"
                    fill="#ffffff"
                    className="filter drop-shadow-[0_0_8px_#ffffff]"
                  />
                  <text
                    x={p2ScreenX}
                    y={p2ScreenY + 38}
                    fill="#f472b6"
                    fontSize="9"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    P2 (Dot 20₁)
                  </text>
                </g>
              )}

              {/* Dynamic Ball Spot */}
              <rect
                x={ballScreenX - 5}
                y={ballScreenY - 5}
                width="10"
                height="10"
                fill="#fef08a"
                className="filter drop-shadow-[0_0_10px_#facc15]"
              />

              {/* Coincidence Flash Effect */}
              {metrics.coincidenceActive && (
                <circle
                  cx={ballScreenX}
                  cy={ballScreenY}
                  r="22"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3"
                  className="animate-ping"
                />
              )}

              {/* Light Gun Aim Reticle */}
              {controls.lightGunAimX !== undefined && (
                <g opacity="0.8">
                  <circle
                    cx={screenLeft + controls.lightGunAimX * screenWidth}
                    cy={screenTop + controls.lightGunAimY * screenHeight}
                    r="14"
                    fill="none"
                    stroke={metrics.lightGunCoincidence ? "#ef4444" : "#fbbf24"}
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                  />
                  <circle
                    cx={screenLeft + controls.lightGunAimX * screenWidth}
                    cy={screenTop + controls.lightGunAimY * screenHeight}
                    r="2"
                    fill={metrics.lightGunCoincidence ? "#ef4444" : "#fbbf24"}
                  />
                </g>
              )}
            </svg>

            {/* Overlay Selector Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 border-t border-stone-800 text-xs">
              <span className="text-stone-400 font-mono">Screen Overlay:</span>
              <div className="flex items-center gap-1.5">
                {(["tennis", "target", "roulette", "none"] as OverlayType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setOverlay(type)}
                    className={`rounded px-2.5 py-1 text-xs capitalize transition ${
                      overlay === type
                        ? "border border-amber-500 bg-amber-950/80 font-bold text-amber-300"
                        : "border border-stone-800 bg-stone-950 text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Oscilloscope Timing Waveforms & Light Gun (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* Oscilloscope Waveforms Card */}
          <div className="rounded-xl border border-stone-800 bg-stone-950 p-4">
            <div className="flex items-center gap-2 border-b border-stone-800 pb-2 mb-3 text-xs font-mono font-bold text-amber-400">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              FIGS. 6A–6F ELECTRONIC WAVEFORM OSCILLOGRAMS
            </div>

            <div className="flex flex-col gap-3 text-[11px] font-mono">
              {/* Horizontal Line Timing (Waveform 61/63) */}
              <div>
                <div className="flex justify-between text-stone-400 pb-1">
                  <span>Horizontal Sync & P1 Delay (τ_H)</span>
                  <span className="text-cyan-400">
                    {metrics.p1DelayHMicrosec.toFixed(1)} µs / 63.5 µs
                  </span>
                </div>
                <svg
                  viewBox="0 0 300 36"
                  className="w-full h-9 rounded bg-black border border-stone-800"
                >
                  {/* Sync pulse */}
                  <path
                    d="M 10 25 L 30 25 L 30 8 L 45 8 L 45 25 L 290 25"
                    fill="none"
                    stroke="#0ea5e9"
                    strokeWidth="1.5"
                  />
                  {/* Delayed dot pulse */}
                  <rect
                    x={45 + (metrics.p1DelayHMicrosec / 63.5) * 220}
                    y="8"
                    width="12"
                    height="17"
                    fill="#38bdf8"
                    fillOpacity="0.8"
                  />
                </svg>
              </div>

              {/* Vertical Field Timing (Waveform 64/67) */}
              <div>
                <div className="flex justify-between text-stone-400 pb-1">
                  <span>Vertical Sync & P1 Field Delay (τ_V)</span>
                  <span className="text-purple-400">
                    {metrics.p1DelayVMs.toFixed(2)} ms / 16.67 ms
                  </span>
                </div>
                <svg
                  viewBox="0 0 300 36"
                  className="w-full h-9 rounded bg-black border border-stone-800"
                >
                  {/* Vert sync pulse */}
                  <path
                    d="M 10 25 L 25 25 L 25 8 L 55 8 L 55 25 L 290 25"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="1.5"
                  />
                  {/* Delayed vertical gate */}
                  <rect
                    x={55 + (metrics.p1DelayVMs / 16.67) * 210}
                    y="8"
                    width="18"
                    height="17"
                    fill="#c084fc"
                    fillOpacity="0.8"
                  />
                </svg>
              </div>

              {/* Diode Coincidence Output (Waveform 69) */}
              <div>
                <div className="flex justify-between text-stone-400 pb-1">
                  <span>Coincidence Collision AND Gate (V_hit)</span>
                  <span
                    className={
                      metrics.coincidenceActive ? "text-emerald-400 font-bold" : "text-stone-500"
                    }
                  >
                    {metrics.coincidenceActive ? "TRIGGER HIGH (+8V)" : "LOW (0V)"}
                  </span>
                </div>
                <svg
                  viewBox="0 0 300 36"
                  className="w-full h-9 rounded bg-black border border-stone-800"
                >
                  {metrics.coincidenceActive ? (
                    <path
                      d="M 10 26 L 130 26 L 130 6 L 170 6 L 170 26 L 290 26"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                    />
                  ) : (
                    <line x1="10" y1="26" x2="290" y2="26" stroke="#475569" strokeWidth="1.5" />
                  )}
                </svg>
              </div>
            </div>
          </div>

          {/* Light Gun Target Controls */}
          <div className="rounded-xl border border-stone-800 bg-stone-950 p-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2 mb-3">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400">
                <Crosshair className="h-4 w-4 text-red-400" />
                FIG. 1C & FIG. 4 OPTICAL LIGHT GUN
              </div>
              <span className="text-[11px] font-mono text-stone-400">
                HITS: {simState.targetHitCount}
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="grid grid-cols-2 gap-2">
                <label className="text-[11px] text-stone-400">
                  Gun Aim X (Azimuth):
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.02"
                    value={controls.lightGunAimX}
                    onChange={(e) => updateParam("lightGunAimX", parseFloat(e.target.value))}
                    className="w-full accent-amber-500 mt-1"
                  />
                </label>
                <label className="text-[11px] text-stone-400">
                  Gun Aim Y (Elevation):
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.02"
                    value={controls.lightGunAimY}
                    onChange={(e) => updateParam("lightGunAimY", parseFloat(e.target.value))}
                    className="w-full accent-amber-500 mt-1"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={handleFireLightGun}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-red-500/60 bg-gradient-to-r from-red-950 to-amber-950 py-2 text-xs font-bold text-red-200 hover:from-red-900 hover:to-amber-900 transition active:scale-95 shadow-lg"
              >
                <Crosshair className="h-4 w-4 text-red-400" />
                PULL LIGHT GUN TRIGGER (FIRE)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hand-Held Controller Potentiometer Dials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Player 1 Controller Box (FIG. 1B Unit 22) */}
        <div className="rounded-xl border border-sky-900/60 bg-slate-950 p-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
            <span className="text-xs font-mono font-bold text-sky-400">
              PLAYER 1 CONTROLLER (UNIT 22)
            </span>
            <span className="text-[11px] font-mono text-stone-400">RC POTENTIOMETERS 86 & 92</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="text-xs text-stone-300">
              Knob 17 (Horizontal Pos):
              <input
                type="range"
                min="0.05"
                max="0.45"
                step="0.01"
                value={controls.player1PotX}
                onChange={(e) => updateParam("player1PotX", parseFloat(e.target.value))}
                className="w-full accent-sky-400 mt-1.5"
              />
              <span className="text-[10px] text-stone-500 font-mono">
                τ_H = {metrics.p1DelayHMicrosec.toFixed(1)} µs
              </span>
            </label>
            <label className="text-xs text-stone-300">
              Knob 16 (Vertical Pos):
              <input
                type="range"
                min="0.05"
                max="0.95"
                step="0.01"
                value={controls.player1PotY}
                onChange={(e) => updateParam("player1PotY", parseFloat(e.target.value))}
                className="w-full accent-sky-400 mt-1.5"
              />
              <span className="text-[10px] text-stone-500 font-mono">
                τ_V = {metrics.p1DelayVMs.toFixed(2)} ms
              </span>
            </label>
          </div>
        </div>

        {/* Player 2 Controller Box (FIG. 1B Unit 23) */}
        <div className="rounded-xl border border-pink-900/60 bg-slate-950 p-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
            <span className="text-xs font-mono font-bold text-pink-400">
              PLAYER 2 CONTROLLER (UNIT 23)
            </span>
            <span className="text-[11px] font-mono text-stone-400">RC POTENTIOMETERS 95 & 99</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="text-xs text-stone-300">
              Knob 17₁ (Horizontal Pos):
              <input
                type="range"
                min="0.55"
                max="0.95"
                step="0.01"
                value={controls.player2PotX}
                onChange={(e) => updateParam("player2PotX", parseFloat(e.target.value))}
                className="w-full accent-pink-400 mt-1.5"
              />
              <span className="text-[10px] text-stone-500 font-mono">
                τ_H = {metrics.p2DelayHMicrosec.toFixed(1)} µs
              </span>
            </label>
            <label className="text-xs text-stone-300">
              Knob 16₁ (Vertical Pos):
              <input
                type="range"
                min="0.05"
                max="0.95"
                step="0.01"
                value={controls.player2PotY}
                onChange={(e) => updateParam("player2PotY", parseFloat(e.target.value))}
                className="w-full accent-pink-400 mt-1.5"
              />
              <span className="text-[10px] text-stone-500 font-mono">
                τ_V = {metrics.p2DelayVMs.toFixed(2)} ms
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* English Spin & Master Console Dials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded-xl border border-stone-800 bg-stone-950 text-xs">
        <label className="text-stone-300">
          English / Spin Deflection Dial:
          <input
            type="range"
            min="-1"
            max="1"
            step="0.05"
            value={controls.englishControl}
            onChange={(e) => updateParam("englishControl", parseFloat(e.target.value))}
            className="w-full accent-amber-500 mt-1"
          />
          <span className="text-[10px] text-stone-500 font-mono">
            Spin Offset:{" "}
            {controls.englishControl > 0
              ? `+${controls.englishControl.toFixed(2)}`
              : controls.englishControl.toFixed(2)}
          </span>
        </label>

        <label className="text-stone-300">
          Ball Speed Multiplier:
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.1"
            value={controls.ballSpeedMultiplier}
            onChange={(e) => updateParam("ballSpeedMultiplier", parseFloat(e.target.value))}
            className="w-full accent-amber-500 mt-1"
          />
          <span className="text-[10px] text-stone-500 font-mono">
            Velocity: {(controls.ballSpeedMultiplier * 100).toFixed(0)}%
          </span>
        </label>

        <label className="text-stone-300">
          VHF Carrier RF Channel:
          <select
            value={controls.rfChannel}
            onChange={(e) => updateParam("rfChannel", parseInt(e.target.value, 10))}
            className="w-full rounded border border-stone-700 bg-stone-900 px-2 py-1 mt-1 text-xs text-amber-300"
          >
            <option value={3}>Channel 3 (61.25 MHz)</option>
            <option value={4}>Channel 4 (67.25 MHz)</option>
          </select>
          <span className="text-[10px] text-stone-500 font-mono">
            P_RF = {metrics.rfAntennaPowerNanoWatts.toFixed(1)} nW (300Ω)
          </span>
        </label>
      </div>

      <div className="p-4 bg-stone-900/60 rounded-lg border border-stone-800">
        <ClaimConstraintToggle
          patentId={PATENT_ID}
          claimStates={claimStates}
          onClaimStateChange={(num, active) =>
            setClaimStates((prev) => ({ ...prev, [num]: active }))
          }
        />
      </div>
    </div>
  );
}
