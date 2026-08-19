"use client";

import { RotateCcw, Scissors, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepOtisElevator } from "@/physics/machineKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";

export function OtisElevatorSim() {
  const { params, updateParam } = usePatentPhysics("us-31128-otis-elevator");
  const cabPayloadKg = params.cabPayload ?? 650;
  const [isCableCut, setIsCableCut] = useState<boolean>(false);
  const [cabY, setCabY] = useState<number>(100); // 40 to 220 px
  const [isArrested, setIsArrested] = useState<boolean>(false);

  const otis = stepOtisElevator({
    cabPayloadKg,
    cableTensionPct: isCableCut ? 0 : (params.cableTension ?? 100),
  });
  const hangingMassKg = otis.hangingMassKg;
  const springBowedHeight = isCableCut ? 0 : 18;
  const pawlExtensionX = isCableCut ? 18 : 4;
  const arrestForceKn = otis.peakArrestForceKn.toFixed(1);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleCutCable = () => {
    if (isCableCut) return;
    setIsCableCut(true);
    updateParam("cableTension", 0);

    soundEngine.playElastomerSnap(1.5);

    const snapped = stepOtisElevator({ cabPayloadKg, cableTensionPct: 0 });
    setCabY((prev) => prev + snapped.cabFallPx);

    timerRef.current = window.setTimeout(
      () => {
        setIsArrested(true);
        soundEngine.playLockstitchClack();
      },
      Math.max(16, snapped.pawlEngagementMs),
    );
  };

  const handleResetCable = () => {
    setIsCableCut(false);
    setIsArrested(false);
    setCabY(100);
    updateParam("cableTension", 100);
    soundEngine.playSwitchClick();
  };

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-500 animate-pulse" />
            <h3 className="font-serif text-lg sm:text-xl font-bold text-ink-900 dark:text-parchment-100">
              Otis Inverted Fail-Safe Safety Catch (US 31,128)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-1">
            Simulate Elisha Otis&apos;s 1854 Crystal Palace demonstration: cut the hoisting cable to
            observe the transverse leaf spring snap flat and thrust safety pawls into the guide
            racks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isCableCut ? (
            <button
              type="button"
              onClick={handleCutCable}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-red-600 hover:bg-red-700 text-white shadow-md transition-colors active:scale-95"
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Sever Hoisting Rope (Demonstration)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleResetCable}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 bg-white/80 dark:bg-ink-900/80 text-xs font-mono font-bold text-ink-800 dark:text-parchment-200 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
              <span>Restore Hoisting Rope</span>
            </button>
          )}
        </div>
      </div>

      {/* Visual Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Hoistway Diagram */}
        <div className="lg:col-span-8 relative bg-[#090d16] rounded-2xl border border-parchment-300 dark:border-ink-800 p-6 flex flex-col items-center justify-center min-h-[420px] overflow-hidden select-none">
          {/* Blueprint Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 pointer-events-none" />

          {/* Demonstration Callout Banner */}
          {isArrested && (
            <div className="absolute top-4 left-4 z-20 px-3.5 py-1.5 bg-emerald-950/90 border border-emerald-600 rounded-xl text-emerald-300 text-xs font-mono flex items-center gap-2 animate-bounce">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>
                &quot;ALL SAFE, GENTLEMEN!&quot; — Arrested in {otis.pawlEngagementMs} ms ·{" "}
                {otis.stoppingDistanceCm} cm ({arrestForceKn} kN)
              </span>
            </div>
          )}

          <svg viewBox="0 0 460 340" className="w-full max-w-md h-auto relative z-10">
            {/* Hoistway Side Guide Posts with Saw-Tooth Ratchet Racks */}
            {/* Left Post & Ratchet */}
            <g transform="translate(60, 20)">
              <rect
                x="0"
                y="0"
                width="24"
                height="300"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="2"
              />
              {Array.from({ length: 15 }).map((_, i) => (
                <polygon
                  key={i}
                  points={`24,${i * 20} 34,${i * 20 + 8} 24,${i * 20 + 16}`}
                  fill="#94a3b8"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                />
              ))}
              <text
                x="-45"
                y="150"
                fill="#64748b"
                fontSize="9"
                fontFamily="monospace"
                transform="rotate(-90 -45 150)"
              >
                LEFT RATCHET RACK
              </text>
            </g>

            {/* Right Post & Ratchet */}
            <g transform="translate(376, 20)">
              <rect
                x="0"
                y="0"
                width="24"
                height="300"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="2"
              />
              {Array.from({ length: 15 }).map((_, i) => (
                <polygon
                  key={i}
                  points={`0,${i * 20} -10,${i * 20 + 8} 0,${i * 20 + 16}`}
                  fill="#94a3b8"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                />
              ))}
              <text
                x="35"
                y="150"
                fill="#64748b"
                fontSize="9"
                fontFamily="monospace"
                transform="rotate(90 35 150)"
              >
                RIGHT RATCHET RACK
              </text>
            </g>

            {/* Hoisting Cable */}
            {!isCableCut ? (
              <g>
                <line x1="230" y1="0" x2="230" y2={cabY - 15} stroke="#f59e0b" strokeWidth="4" />
                <line
                  x1="228"
                  y1="0"
                  x2="228"
                  y2={cabY - 15}
                  stroke="#d97706"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
                <text x="240" y="30" fill="#fbbf24" fontSize="9" fontFamily="monospace">
                  HOISTING ROPE UNDER TENSION (T = {otis.hoistTensionKn} kN, {hangingMassKg} kg)
                </text>
              </g>
            ) : (
              <g>
                {/* Snapped Cable Strand */}
                <path
                  d="M 230 0 L 225 25 L 235 40 L 220 50"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3"
                />
                <circle cx="220" cy="50" r="3" fill="#f87171" />
                <text
                  x="240"
                  y="45"
                  fill="#f87171"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  ⚡ CABLE SEVERED (T = 0)
                </text>
              </g>
            )}

            {/* Elevator Cab Frame */}
            <g transform={`translate(100, ${cabY})`}>
              {/* Main Structural Cab Box */}
              <rect
                x="0"
                y="0"
                width="260"
                height="150"
                fill="#1e293b"
                stroke="#64748b"
                strokeWidth="2.5"
                rx="4"
              />
              <rect
                x="15"
                y="15"
                width="230"
                height="120"
                fill="#0f172a"
                stroke="#334155"
                strokeWidth="1.5"
              />

              {/* Passenger Silhouette & Freight */}
              <g transform="translate(110, 50)">
                <circle cx="20" cy="15" r="10" fill="#94a3b8" />
                <path d="M 5 50 L 10 30 L 30 30 L 35 50 Z" fill="#94a3b8" />
                {/* Top Hat (Otis tribute) */}
                <rect x="12" y="2" width="16" height="10" fill="#475569" />
                <rect x="8" y="10" width="24" height="2" fill="#475569" />
              </g>

              {/* Transverse Multi-Leaf Spring across Cab Top Crossbeam */}
              {/* Base structural crossbeam */}
              <rect x="0" y="-8" width="260" height="8" fill="#334155" />

              {/* Spring Blade (Bowed vs Straight) */}
              <path
                d={`M 15 0 Q 130 ${-springBowedHeight} 245 0`}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <circle cx="130" cy={-springBowedHeight} r="5" fill="#f59e0b" />

              {/* Left Safety Pawl */}
              <g transform={`translate(0, 5)`}>
                <line
                  x1="15"
                  y1={-springBowedHeight * 0.4}
                  x2={-pawlExtensionX}
                  y2="10"
                  stroke={isArrested ? "#10b981" : "#38bdf8"}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <polygon
                  points={`${-pawlExtensionX},6 ${-pawlExtensionX - 8},10 ${-pawlExtensionX},14`}
                  fill={isArrested ? "#34d399" : "#38bdf8"}
                />
              </g>

              {/* Right Safety Pawl */}
              <g transform={`translate(260, 5)`}>
                <line
                  x1="-15"
                  y1={-springBowedHeight * 0.4}
                  x2={pawlExtensionX}
                  y2="10"
                  stroke={isArrested ? "#10b981" : "#38bdf8"}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <polygon
                  points={`${pawlExtensionX},6 ${pawlExtensionX + 8},10 ${pawlExtensionX},14`}
                  fill={isArrested ? "#34d399" : "#38bdf8"}
                />
              </g>

              <text
                x="130"
                y="-22"
                fill="#38bdf8"
                fontSize="8"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {!isCableCut ? "LEAF SPRING BOWED UNDER LOAD" : "SPRING RELAXED FLAT (PAWLS FIRED)"}
              </text>
            </g>
          </svg>
        </div>

        {/* Controls Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/70 dark:bg-ink-900/60 p-5 space-y-4 shadow-sm">
            <span className="font-serif font-bold text-sm text-ink-900 dark:text-parchment-100 block">
              Elevator Safety Dynamics
            </span>

            {/* Cab Payload Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Cab Passenger & Freight Load
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {cabPayloadKg} kg
                </span>
              </div>
              <input
                type="range"
                aria-label="Elevator Passenger & Freight Payload"
                min="200"
                max="1500"
                step="50"
                value={cabPayloadKg}
                onChange={(e) => updateParam("cabPayload", Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Telemetry Metrics */}
            <div className="space-y-2 pt-2 border-t border-parchment-300 dark:border-ink-800 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-ink-600 dark:text-ink-400">Suspension State:</span>
                <span className={`font-bold ${!isCableCut ? "text-emerald-500" : "text-red-500"}`}>
                  {!isCableCut ? "Normal Cable Hoist" : "Cable Severed"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600 dark:text-ink-400">Safety Brake Engagement:</span>
                <span className={`font-bold ${isArrested ? "text-emerald-500" : "text-amber-500"}`}>
                  {isArrested ? "Arrested in Ratchets" : "Retracted (Free Run)"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600 dark:text-ink-400">Spring Response Time:</span>
                <span className="font-bold text-cyan-600 dark:text-cyan-400">
                  {"38 ms (< 0.040 s)"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600 dark:text-ink-400">Peak Deceleration Force:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {isArrested ? `${arrestForceKn} kN` : "0.0 kN"}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-ink-900 dark:text-parchment-100 text-xs font-sans space-y-1">
              <span className="font-bold text-emerald-900 dark:text-emerald-300 block font-mono text-[11px] uppercase tracking-wider">
                Inverted Fail-Safe Logic:
              </span>
              <p className="leading-relaxed">
                Rather than requiring human intervention or complex triggers, Otis made cable
                tension pull the brakes <em>off</em>. Any loss of tension automatically unleashes
                the full elastic force of the leaf spring to lock the cab within inches.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
