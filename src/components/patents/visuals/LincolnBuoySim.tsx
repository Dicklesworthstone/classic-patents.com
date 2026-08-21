"use client";

import { RotateCcw, Ship, Volume2, VolumeX } from "lucide-react";
import { TextWithLatex } from "@/components/ui/LatexRenderer";
import { stepLincolnBuoy } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";

export function LincolnBuoySim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-6469-lincoln-buoy");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const bellowsExpansionPercent = params.inflationPct ?? 75;
  const vesselCargoTons = params.weightTons ?? 380;
  const riverDepthFeet = params.shoalDepth ?? 3.5;

  const lincoln = stepLincolnBuoy({
    inflationPct: bellowsExpansionPercent,
    weightTons: vesselCargoTons,
    shoalDepth: riverDepthFeet,
  });
  const effectiveDraftFeet = lincoln.hullDraftFt;
  const clearanceFeet = lincoln.shoalClearanceFt;
  const isGrounded = clearanceFeet < 0;

  const displacedVolumeCuFt = lincoln.displacedVolumeCuFt;
  const buoyantLiftTons = lincoln.liftTons;

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Ship className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-serif text-lg sm:text-xl font-bold text-ink-950 dark:text-parchment-50">
              Abraham Lincoln Steamboat Buoyancy Bellows (US 6,469)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-400 mt-1">
            Steam-driven expandable side bellows displacing water to lift riverboats over shallow
            Mississippi sandbars.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end lg:self-auto">
          <div
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border shadow-xs ${
              isGrounded
                ? "bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-800 animate-pulse"
                : "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
            }`}
          >
            {isGrounded
              ? `GROUNDED (${Math.abs(clearanceFeet).toFixed(1)} ft mud strike)`
              : `FLOATING (+${clearanceFeet.toFixed(1)} ft clearance)`}
          </div>
          <button
            type="button"
            onClick={() => {
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            aria-label={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              resetParams();
              soundEngine.playSwitchClick();
            }}
            aria-label="Reset Simulation"
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Visual Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-[#0a0f1d] border border-parchment-300 dark:border-ink-800 p-6 relative min-h-[380px] overflow-hidden">
          <svg viewBox="0 0 600 320" className="w-full h-auto max-h-[340px]">
            {/* Sky Background */}
            <rect width="600" height="150" fill="#0f172a" />

            {/* Riverbed / Sandbar */}
            <path
              d={`M 0 320 L 0 240 Q 200 ${lincoln.sandbarShoulderY} 300 ${lincoln.sandbarPeakY} Q 400 ${lincoln.sandbarShoulderY} 600 240 L 600 320 Z`}
              fill="#78350f"
              opacity="0.8"
            />
            <path
              d={`M 0 320 L 0 250 Q 300 ${lincoln.sandbarInnerY} 600 250 L 600 320 Z`}
              fill="#b45309"
              opacity="0.5"
            />

            {/* River Water Level */}
            <rect
              x="0"
              y="150"
              width="600"
              height="170"
              fill="#0284c7"
              opacity={Math.min(1, 0.3 + lincoln.bellowsCrateDensity)}
            />

            {/* Steamboat Hull */}
            <g transform={`translate(0, ${lincoln.hullStudioY})`}>
              {/* Main Wooden Steamboat Hull */}
              <path
                d="M 120 0 L 150 55 Q 300 65 450 55 L 480 0 Z"
                fill="#334155"
                stroke="#d97706"
                strokeWidth="3"
              />

              {/* Steamboat Cabins & Smokestacks */}
              <rect
                x="180"
                y="-35"
                width="240"
                height="35"
                fill="#f8fafc"
                stroke="#94a3b8"
                strokeWidth="2"
                rx="4"
              />
              <rect
                x="220"
                y="-60"
                width="160"
                height="25"
                fill="#f1f5f9"
                stroke="#94a3b8"
                strokeWidth="2"
                rx="4"
              />
              {/* Twin Smokestacks */}
              <line
                x1="250"
                y1="-60"
                x2="250"
                y2="-100"
                stroke="#1e293b"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <line
                x1="350"
                y1="-60"
                x2="350"
                y2="-100"
                stroke="#1e293b"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Paddlewheel Box */}
              <circle cx="160" cy="5" r="28" fill="#d97706" opacity="0.8" />

              {/* Lincoln's Expandable Buoyancy Bellows (Left & Right Hull Flanks) */}
              <g opacity="0.95">
                {/* Starboard Bellows (Left in 2D view) */}
                <path
                  d={`M 145 10 L ${145 - lincoln.bellowsFlarePx} 10 L ${150 - lincoln.bellowsMidPx} ${10 + lincoln.bellowsDropPx} L 150 50 Z`}
                  fill="#f59e0b"
                  stroke="#fbbf24"
                  strokeWidth="2"
                />
                {/* Port Bellows (Right in 2D view) */}
                <path
                  d={`M 455 10 L ${455 + lincoln.bellowsFlarePx} 10 L ${450 + lincoln.bellowsMidPx} ${10 + lincoln.bellowsDropPx} L 450 50 Z`}
                  fill="#f59e0b"
                  stroke="#fbbf24"
                  strokeWidth="2"
                />
              </g>

              {/* Vertical Guide Struts & Ropes */}
              <line
                x1="145"
                y1="-10"
                x2="145"
                y2="55"
                stroke="#ef4444"
                strokeWidth="2"
                strokeDasharray="3,3"
              />
              <line
                x1="455"
                y1="-10"
                x2="455"
                y2="55"
                stroke="#ef4444"
                strokeWidth="2"
                strokeDasharray="3,3"
              />
            </g>

            {/* Waterline Marker */}
            <line
              x1="0"
              y1="150"
              x2="600"
              y2="150"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="6,4"
            />
            <text
              x="15"
              y="142"
              fill="#38bdf8"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
            >
              RIVER WATERLINE
            </text>
          </svg>

          {/* Telemetry Strip */}
          <div className="w-full grid grid-cols-3 gap-2 text-center text-xs sm:text-sm font-mono pt-3 border-t border-ink-800 text-ink-300">
            <div>
              <span className="text-ink-400 block text-xs">EFFECTIVE DRAFT</span>
              <span className="text-amber-400 font-bold text-sm sm:text-base">
                {effectiveDraftFeet.toFixed(2)} ft
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs">BUOYANT LIFT</span>
              <span className="text-emerald-400 font-bold text-sm sm:text-base">
                +{buoyantLiftTons} tons
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs">BELLOWS DISPLACEMENT</span>
              <span className="text-blue-400 font-bold text-sm sm:text-base">
                {displacedVolumeCuFt} cu ft
              </span>
            </div>
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/80 dark:bg-ink-900/70 p-5 space-y-4 shadow-sm">
            <span className="font-serif font-bold text-base sm:text-lg text-ink-950 dark:text-parchment-50 block">
              Lincoln&apos;s Bellows Actuation
            </span>

            {/* Expansion Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  <TextWithLatex text="Bellows Expansion ($\\Delta V$)" />
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {bellowsExpansionPercent}%
                </span>
              </div>
              <input
                type="range"
                aria-label="Bellows Expansion (delta V)"
                min="0"
                max="100"
                step="5"
                value={bellowsExpansionPercent}
                onChange={(e) => updateParam("inflationPct", Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Cargo Load Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  <TextWithLatex text="Cargo Weight ($M_{cargo}$)" />
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {vesselCargoTons} tons
                </span>
              </div>
              <input
                type="range"
                aria-label="Cargo Weight"
                min="200"
                max="600"
                step="10"
                value={vesselCargoTons}
                onChange={(e) => updateParam("weightTons", Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* River Depth Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  <TextWithLatex text="Shoal Water Depth ($h_{river}$)" />
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {riverDepthFeet.toFixed(1)} ft
                </span>
              </div>
              <input
                type="range"
                aria-label="Shoal Water Depth"
                min="2.0"
                max="6.0"
                step="0.1"
                value={riverDepthFeet}
                onChange={(e) => updateParam("shoalDepth", Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-ink-950 dark:text-parchment-100 text-xs sm:text-sm font-sans">
              <span className="font-bold text-amber-900 dark:text-amber-300 block font-mono text-xs uppercase tracking-wider mb-1">
                Archimedean Lift:
              </span>
              <p className="leading-relaxed">
                By expanding the side bellows, the submerged volume increases by{" "}
                {displacedVolumeCuFt} cu ft, {lincoln.draftReductionFt.toFixed(2)} ft draft relief,
                generating {buoyantLiftTons} tons of immediate buoyant lift to safely clear the
                sandbar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
