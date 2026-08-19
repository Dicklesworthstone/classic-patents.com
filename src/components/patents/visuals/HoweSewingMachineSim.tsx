"use client";

import { Play, Scissors } from "lucide-react";
import { useEffect, useState } from "react";
import { TextWithLatex } from "@/components/ui/LatexRenderer";
import { howeStitch, stepHoweLockstitch, stepHoweSewingMachine } from "@/physics/machineKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

export function HoweSewingMachineSim() {
  const { params, updateParam } = usePatentPhysics("us-4750-howe-sewing-machine");
  const [crankAngleDeg, setCrankAngleDeg] = useState<number>(120); // 0 to 360 degrees
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const sewingSpeedRpm = params.crankRpm ?? 240;
  const sew = stepHoweSewingMachine(
    sewingSpeedRpm,
    params.threadTensionGrams ?? 45,
    params.stitchPitchMm ?? 3.5,
  );

  useEffect(() => {
    if (!isPlaying) return;
    const tickMs = sew.crankDisplayTickMs;
    const degPerTick = sew.crankOmegaDegPerS * sew.crankDisplayTickS;
    const interval = setInterval(() => {
      setCrankAngleDeg((prev) => (prev + degPerTick) % 360);
    }, tickMs);
    return () => clearInterval(interval);
  }, [isPlaying, sew.crankDisplayTickMs, sew.crankOmegaDegPerS, sew.crankDisplayTickS]);

  const {
    needleY,
    shuttleX,
    loopOpen: isLoopFormed,
    loopWidth,
    loopSvgControlX,
  } = stepHoweLockstitch(crankAngleDeg);

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Scissors className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50">
              Elias Howe&apos;s Lockstitch Sewing Simulator (US 4,750)
            </h3>
          </div>
          <p className="text-sm sm:text-base text-ink-700 dark:text-ink-300 mt-1">
            Kinematic simulation of the <strong>eye-pointed needle</strong> and{" "}
            <strong>flying shuttle</strong> creating the two-thread locked seam.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold transition-colors border shadow-sm ${
              isPlaying
                ? "bg-amber-600 text-white border-amber-700 animate-pulse"
                : "bg-parchment-200 dark:bg-ink-800 text-ink-800 dark:text-parchment-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-300"
            }`}
          >
            <Play className="w-4 h-4" />
            <span>{isPlaying ? "Pause Mechanism" : "Run Mechanism"}</span>
          </button>
        </div>
      </div>

      {/* Interactive Visual Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-[#0a0f1d] border border-parchment-300 dark:border-ink-800 p-6 relative min-h-[380px] overflow-hidden">
          <svg viewBox="0 0 600 320" className="w-full h-auto max-h-[340px]">
            {/* Background Plate */}
            <rect width="600" height="320" fill="#0f172a" />

            {/* Fabric Layers (Horizontal Workpiece) */}
            <rect x="50" y="150" width="500" height="18" fill="#475569" rx="2" />
            <rect x="50" y="156" width="500" height="2" fill="#64748b" />
            <text x="60" y="142" fill="#94a3b8" fontSize="11" fontFamily="monospace">
              FABRIC WORKPIECE (TWO LAYERS)
            </text>

            {/* Existing Stitches on Left */}
            {sew.stitchXs.map((_, i) => {
              const stitch = howeStitch(
                i,
                sew.stitchXs,
                sew.stitchLen,
                sew.stitchUpperY,
                sew.stitchLowerY,
              );
              return (
                <g key={stitch.x}>
                  <line
                    x1={stitch.x}
                    y1={stitch.upperY}
                    x2={stitch.x2}
                    y2={stitch.upperY}
                    stroke="#f59e0b"
                    strokeWidth="3"
                  />
                  <line
                    x1={stitch.x}
                    y1={stitch.upperY}
                    x2={stitch.x}
                    y2={stitch.lowerY}
                    stroke="#10b981"
                    strokeWidth="2.5"
                  />
                  <line
                    x1={stitch.x}
                    y1={stitch.lowerY}
                    x2={stitch.x2}
                    y2={stitch.lowerY}
                    stroke="#38bdf8"
                    strokeWidth="3"
                  />
                </g>
              );
            })}

            {/* Sewing Machine Arm Casting */}
            <path d="M 260 20 L 320 20 L 320 100 L 280 100 L 280 40 L 260 40 Z" fill="#334155" />

            {/* Eye-Pointed Needle & Bar */}
            <g transform={`translate(280, ${100 + needleY})`}>
              {/* Needle Bar */}
              <rect x="-3" y="-80" width="6" height="80" fill="#cbd5e1" />
              {/* Curved Steel Needle */}
              <path
                d="M 0 0 C 4 20 8 45 0 70"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Eye in Needle Point */}
              <circle cx="0" cy="62" r="2.5" fill="#0f172a" stroke="#e2e8f0" strokeWidth="1" />

              {/* Upper Thread (Yellow) Through Eye */}
              <path
                d={`M -50 -70 Q -20 -30 0 62 Q ${loopSvgControlX} 85 0 ${95 + needleY > 150 ? 95 : 62}`}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
              />
            </g>

            {/* Lower Shuttle Race & Reciprocating Shuttle (Below Fabric) */}
            <g transform={`translate(${280 + shuttleX}, 200)`}>
              {/* Shuttle Boat Body */}
              <path
                d="M -35 0 L 25 -10 Q 38 0 25 10 L -35 0 Z"
                fill="#d97706"
                stroke="#fbbf24"
                strokeWidth="2"
              />
              {/* Internal Lower Bobbin */}
              <ellipse cx="-5" cy="0" rx="14" ry="6" fill="#0284c7" />
              {/* Lower Bobbin Thread (Cyan) */}
              <path
                d="M -5 0 Q 0 -20 0 -40"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeDasharray="3,3"
              />
            </g>

            {/* Status Annotations */}
            <g transform="translate(420, 50)">
              <rect width="160" height="70" fill="#1e293b" rx="8" stroke="#334155" />
              <text x="10" y="22" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                CYCLE PHASE:
              </text>
              <text
                x="10"
                y="42"
                fill="#f59e0b"
                fontSize="12"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {isLoopFormed ? "SHUTTLE PASSING LOOP" : "NEEDLE PENETRATING"}
              </text>
              <text x="10" y="60" fill="#10b981" fontSize="10" fontFamily="monospace">
                CRANK: {Math.round(crankAngleDeg)}°
              </text>
            </g>
          </svg>

          {/* Telemetry Strip */}
          <div className="w-full grid grid-cols-3 gap-2 text-center text-xs sm:text-sm font-mono pt-3 border-t border-ink-800 text-ink-300">
            <div>
              <span className="text-ink-400 block text-xs">NEEDLE STROKE</span>
              <span className="text-amber-400 font-bold text-sm sm:text-base">
                {needleY > 0 ? "PENETRATING" : "RETRACTING"}
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs">SHUTTLE SPEED</span>
              <span className="text-emerald-400 font-bold text-sm sm:text-base">
                {sewingSpeedRpm} stitches/min
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs">LOOP DILATION</span>
              <span className="text-blue-400 font-bold text-sm sm:text-base">
                {loopWidth.toFixed(1)} mm
              </span>
            </div>
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/80 dark:bg-ink-900/70 p-5 space-y-4 shadow-sm">
            <span className="font-serif font-bold text-base sm:text-lg text-ink-950 dark:text-parchment-50 block">
              Kinematic Cycle Controls
            </span>

            {/* Crank Angle Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  <TextWithLatex text="Manual Flywheel Crank Angle ($\\theta$)" />
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {Math.round(crankAngleDeg)}°
                </span>
              </div>
              <input
                type="range"
                aria-label="Manual Flywheel Crank Angle (theta)"
                min="0"
                max="360"
                step="2"
                value={crankAngleDeg}
                onChange={(e) => setCrankAngleDeg(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Sewing Speed Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  <TextWithLatex text="Machine Speed ($f_{sew}$)" />
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {sewingSpeedRpm} RPM · {sew.stitchFrequencyHz} Hz · {sew.crankOmegaDegPerS} °/s ·{" "}
                  {sew.clothFeedMmPerS} mm/s · {sew.lockstitchShearStrengthN} N
                </span>
              </div>
              <input
                type="range"
                aria-label="Flywheel Drive Velocity"
                min="60"
                max="320"
                step="10"
                value={sewingSpeedRpm}
                onChange={(e) => updateParam("crankRpm", Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-ink-950 dark:text-parchment-100 text-xs sm:text-sm font-sans">
              <span className="font-bold text-amber-900 dark:text-amber-300 block font-mono text-xs uppercase tracking-wider mb-1">
                The Lockstitch Secret:
              </span>
              <p className="leading-relaxed">
                As the needle begins pulling upward, friction against the fabric bows the thread out
                into a loop. The bullet shuttle carries the second thread straight through this
                loop, locking both threads tight within the seam.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
