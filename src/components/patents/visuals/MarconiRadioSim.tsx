"use client";

import { Radio, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { soundEngine } from "@/utils/soundEngine";

export function MarconiRadioSim() {
  const [antennaHeightMeters, setAntennaHeightMeters] = useState<number>(50); // 10 to 100 meters
  const [sparkPowerKv, setSparkPowerKv] = useState<number>(25); // 5 to 50 kV
  const [isSparking, setIsSparking] = useState<boolean>(false);
  const [waveRingRadius, setWaveRingRadius] = useState<number>(0);

  // Marconi Antenna Law: Range D proportional to H * sqrt(Power)
  const estimatedRangeMiles = Math.round(
    (antennaHeightMeters / 10) * Math.sqrt(sparkPowerKv) * 2.8,
  );

  useEffect(() => {
    let timer: any;
    if (isSparking) {
      timer = setInterval(() => {
        setWaveRingRadius((r) => (r + 4) % 120);
      }, 40);
    } else {
      setWaveRingRadius(0);
    }
    return () => clearInterval(timer);
  }, [isSparking]);

  const triggerSpark = () => {
    setIsSparking(true);
    soundEngine.playContinuousTone(800, "sawtooth", 0.08);
    setTimeout(() => {
      setIsSparking(false);
      soundEngine.stopContinuousTone();
    }, 1200);
  };

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-amber-500 animate-pulse" />
            <h3 className="font-serif text-xl font-bold text-ink-900 dark:text-parchment-100">
              Marconi Spark-Gap RF Transmitter &amp; Grounded Monopole Simulator (US 586,193)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-1">
            Observe how elevated aerial capacitance coupled with an earth ground plane propagates RF
            waves across the horizon.
          </p>
        </div>

        <button
          type="button"
          onClick={triggerSpark}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md transition-all active:scale-95"
        >
          <Zap className="w-4 h-4" />
          <span>Fire Spark Transmitter</span>
        </button>
      </div>

      {/* Visual Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-ink-950 p-6 border border-parchment-200 dark:border-ink-800 relative min-h-[360px] overflow-hidden">
          {/* Blueprint Drafting Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 pointer-events-none" />

          {/* SVG Transmitter & Radiating Electromagnetic Wavefronts */}
          <svg viewBox="0 0 460 260" className="w-full max-w-md h-auto select-none relative z-10">
            {/* Ground Plane (Conductive Earth) */}
            <line x1="20" y1="210" x2="440" y2="210" stroke="#10b981" strokeWidth="3" />
            <text x="50" y="230" fill="#34d399" fontSize="10" fontFamily="monospace">
              Conductive Earth Ground Plate
            </text>

            {/* Earth ground hatching */}
            {[40, 60, 80, 100, 120, 140, 160].map((x) => (
              <line
                key={x}
                x1={x}
                y1="210"
                x2={x - 10}
                y2="225"
                stroke="#059669"
                strokeWidth="1.5"
              />
            ))}

            {/* Vertical Antenna Mast */}
            <line
              x1="120"
              y1="210"
              x2="120"
              y2={210 - antennaHeightMeters * 1.6}
              stroke="#fbbf24"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Antenna Top Capacity Sphere */}
            <circle
              cx="120"
              cy={210 - antennaHeightMeters * 1.6}
              r="8"
              fill="#f59e0b"
              stroke="#fef08a"
              strokeWidth="2"
            />
            <text
              x="120"
              y={210 - antennaHeightMeters * 1.6 - 12}
              fill="#fde68a"
              fontSize="10"
              textAnchor="middle"
              fontFamily="monospace"
              fontWeight="bold"
            >
              Aerial ({antennaHeightMeters}m)
            </text>

            {/* Spark Gap Chamber & Induction Coil */}
            <rect
              x="70"
              y="170"
              width="35"
              height="30"
              rx="3"
              fill="#1e293b"
              stroke="#64748b"
              strokeWidth="1.5"
            />
            <circle cx="87" cy="185" r="4" fill={isSparking ? "#60a5fa" : "#94a3b8"} />
            <circle cx="103" cy="185" r="4" fill={isSparking ? "#60a5fa" : "#94a3b8"} />
            {isSparking && (
              <line
                x1="91"
                y1="185"
                x2="99"
                y2="185"
                stroke="#93c5fd"
                strokeWidth="3"
                strokeLinecap="round"
              />
            )}

            {/* Radiating Transverse Electromagnetic Wavefronts */}
            {isSparking && (
              <g fill="none" stroke="#f59e0b" strokeWidth="2.5" opacity="0.8">
                <circle cx="120" cy={210 - antennaHeightMeters * 1.6} r={waveRingRadius} />
                <circle
                  cx="120"
                  cy={210 - antennaHeightMeters * 1.6}
                  r={Math.max(0, waveRingRadius - 30)}
                />
                <circle
                  cx="120"
                  cy={210 - antennaHeightMeters * 1.6}
                  r={Math.max(0, waveRingRadius - 60)}
                />
                <circle
                  cx="120"
                  cy={210 - antennaHeightMeters * 1.6}
                  r={Math.max(0, waveRingRadius - 90)}
                />
              </g>
            )}

            {/* Distant Receiver Station with Coherer & Morse Tape */}
            <g transform="translate(360, 160)">
              <line x1="0" y1="50" x2="0" y2="0" stroke="#38bdf8" strokeWidth="2" />
              <rect
                x="-15"
                y="20"
                width="30"
                height="14"
                rx="2"
                fill="#0f172a"
                stroke="#0ea5e9"
                strokeWidth="1"
              />
              <text
                x="0"
                y="30"
                fill="#7dd3fc"
                fontSize="8"
                textAnchor="middle"
                fontFamily="monospace"
              >
                Coherer
              </text>
              <text
                x="0"
                y="-8"
                fill="#38bdf8"
                fontSize="9"
                textAnchor="middle"
                fontFamily="monospace"
                fontWeight="bold"
              >
                Receiver
              </text>
            </g>
          </svg>

          {/* Telemetry Footer */}
          <div className="w-full grid grid-cols-3 gap-2 text-center text-xs font-mono pt-3 border-t border-ink-800 text-ink-300">
            <div>
              <span className="text-ink-500 block text-[10px]">ANTENNA HEIGHT</span>
              <span className="text-amber-400 font-bold">{antennaHeightMeters} Meters</span>
            </div>
            <div>
              <span className="text-ink-500 block text-[10px]">SPARK VOLTAGE</span>
              <span className="text-blue-400 font-bold">{sparkPowerKv} kV</span>
            </div>
            <div>
              <span className="text-ink-500 block text-[10px]">PREDICTED RANGE</span>
              <span className="text-emerald-400 font-bold">{estimatedRangeMiles} Miles</span>
            </div>
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/70 dark:bg-ink-900/60 p-5 space-y-4">
            <span className="font-serif font-bold text-sm text-ink-900 dark:text-parchment-100 block">
              Transmitter Tuning Controls
            </span>

            {/* Antenna Height Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Aerial Mast Height
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {antennaHeightMeters} m
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={antennaHeightMeters}
                onChange={(e) => setAntennaHeightMeters(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-ink-500 font-mono">
                <span>10m (Short)</span>
                <span>100m (Transatlantic Mast)</span>
              </div>
            </div>

            {/* Spark Gap Voltage */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Induction Coil Potential
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {sparkPowerKv} kV
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={sparkPowerKv}
                onChange={(e) => setSparkPowerKv(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
