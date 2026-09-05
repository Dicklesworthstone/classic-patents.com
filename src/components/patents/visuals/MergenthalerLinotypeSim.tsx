"use client";

import { Play, Printer, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import {
  mergenthalerMatrixSvgX,
  mergenthalerSpaceband,
  stepMergenthalerLinotype,
} from "@/physics/machineKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { SimulationTelemetryGrid } from "./SimulationTelemetryGrid";
import { usePatentAudio } from "./three/usePatentAudio";

export function MergenthalerLinotypeSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-313224-mergenthaler-linotype");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const lineLengthPicas = params.lineLengthPicas ?? 13;
  const potTempC = params.potTemp ?? 260;
  const matrixRate = params.matrixRate ?? 60;
  const [isCast, setIsCast] = useState<boolean>(false);

  const lino = stepMergenthalerLinotype({
    matrixRatePerMin: matrixRate,
    spacebandWedgeMm: params.spacebandWedge ?? 6.5,
    potTempC,
  });
  const lineLengthMm = lino.justificationWidthMm;
  const alloyMeltPointC = lino.alloyMeltPointC;
  const isMetalLiquid = lino.isEutecticTemp;
  const linesPerHour = lino.linesPerHour;
  const slugSolidificationTimeSec = lino.solidificationTimeSec;

  const handleCastLine = () => {
    if (isMetalLiquid) {
      setIsCast(true);
      soundEngine.playSwitchClick();
      setTimeout(() => setIsCast(false), lino.solidificationTimeMs);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
              Ottmar Mergenthaler Linotype Line-Casting Machine (US 313,224)
            </h3>
          </div>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400 mt-0.5">
            Brass matrix magazine escapement, expanding spaceband justification, and molten lead
            slug casting.
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleCastLine}
            aria-label="Cast Lead Slug"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-sans text-xs font-bold shadow transition-colors active:scale-95"
          >
            <Play className="w-4 h-4" />
            <span>Cast Slug</span>
          </button>
          <button
            type="button"
            onClick={() => {
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            aria-label={isAudioMuted ? "Unmute Audio" : "Mute Audio"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
          >
            {isAudioMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-600" />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              resetParams();
              setIsCast(false);
              soundEngine.playSwitchClick();
            }}
            aria-label="Reset Simulation"
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Animation Stage */}
      <div className="relative w-full aspect-[16/9] max-h-[360px] bg-parchment-100 dark:bg-ink-900 rounded-xl overflow-hidden border border-parchment-200 dark:border-ink-800 flex items-center justify-center">
        <svg
          viewBox="0 0 600 340"
          role="img"
          aria-label={`Linotype composing machine simulation: ${isCast ? "lead slug cast" : "matrices assembled in line"}, metal pot at ${Math.round(potTempC)} degrees Celsius${isMetalLiquid ? ", alloy molten" : ""}`}
          className="w-full h-full"
        >
          {/* Slanted Overhead Matrix Magazine */}
          <polygon
            points="40,20 220,50 180,120 20,90"
            fill="#4A5568"
            stroke="#2D3748"
            strokeWidth="2"
          />
          <text
            x="50"
            y="70"
            fill="#CBD5E0"
            fontSize="11"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            90-Channel Brass Magazine
          </text>

          {/* Assembled Line of Brass Matrices in Casting Stick */}
          <g transform="translate(140, 180)">
            <rect
              x="0"
              y="0"
              width={lino.slugSvgWidth}
              height="50"
              rx="3"
              fill="#8B5A2B"
              stroke="#5C4033"
              strokeWidth="2"
            />
            {/* Individual Brass Matrices */}
            {Array.from({ length: lino.matrixCount }).map((_, i) => (
              <rect
                key={`matrix-${i}`}
                x={mergenthalerMatrixSvgX(i, lino.matrixSvgOriginX, lino.matrixSvgPitch)}
                y="4"
                width={lino.matrixSvgWidth}
                height="42"
                rx="1"
                fill="#D4AF37"
                stroke="#744210"
                strokeWidth="1"
              />
            ))}
            {/* Wedge Spacebands Expanding Line */}
            {lino.spacebandSvgXs.map((_, i) => (
              <polygon
                key={`spaceband-${i}`}
                points={
                  mergenthalerSpaceband(
                    i,
                    lino.spacebandSvgXs,
                    lino.spacebandSvgTopW,
                    lino.spacebandSvgFlare,
                    lino.spacebandSvgY0,
                    lino.spacebandSvgY1,
                  ).points
                }
                fill="#CBD5E0"
                stroke="#718096"
                strokeWidth="1"
              />
            ))}
            <text
              x="15"
              y="-8"
              fill="#D4AF37"
              fontSize="10"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Assembled Line ({lineLengthPicas} picas / {lineLengthMm} mm)
            </text>
          </g>

          {/* Molten Metal Pot & Plunger Pump (Right) */}
          <g transform="translate(420, 140)">
            <rect
              x="0"
              y="0"
              width="140"
              height="110"
              rx="6"
              fill="#2D3748"
              stroke="#1A202C"
              strokeWidth="2"
            />
            <rect
              x="10"
              y="20"
              width="120"
              height="80"
              rx="4"
              fill={isMetalLiquid ? "#E53E3E" : "#718096"}
              opacity="0.8"
            />
            <text
              x="25"
              y="65"
              fill="#FFFFFF"
              fontWeight="bold"
              fontSize="12"
              fontFamily="sans-serif"
            >
              Molten Pot ({potTempC}°C)
            </text>

            {/* Plunger */}
            <rect
              x="35"
              y={isCast ? "30" : "5"}
              width="20"
              height="50"
              fill="#A0AEC0"
              stroke="#4A5568"
              strokeWidth="1"
            />
            {/* Injection Mouthpiece */}
            <polygon points="0,50 -30,55 -30,65 0,70" fill="#D4AF37" />
          </g>

          {/* Ejected Solid Lead Type Slug */}
          {isCast && (
            <g transform="translate(240, 270)">
              <rect
                x="0"
                y="0"
                width="120"
                height="24"
                rx="2"
                fill="#E2E8F0"
                stroke="#4A5568"
                strokeWidth="1.5"
              />
              <text x="15" y="16" fill="#1A202C" fontFamily="serif" fontSize="11" fontWeight="bold">
                CLASSIC PATENTS
              </text>
              <text
                x="145"
                y="16"
                fill="#38A169"
                fontSize="10"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                SLUG CAST!
              </text>
            </g>
          )}
        </svg>
      </div>

      <SimulationTelemetryGrid
        cards={[
          {
            label: "Metal Temperature",
            value: (
              <>
                {potTempC}°C (Melt: {alloyMeltPointC}°C)
              </>
            ),
          },
          {
            label: "Line Length",
            value: (
              <>
                {lineLengthPicas} picas ({lineLengthMm} mm)
              </>
            ),
            valueClassName:
              "font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500",
          },
          {
            label: "Casting Throughput",
            value: <>{linesPerHour} lines/hr</>,
            valueClassName:
              "font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500",
          },
          {
            label: "Solidification Time",
            value: <>{slugSolidificationTimeSec} s</>,
          },
        ]}
      />

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-parchment-200 dark:border-ink-800">
        <SensitivitySlider
          id="linotype-pot-temp-2d"
          patentId="us-313224-mergenthaler-linotype"
          paramKey="potTemp"
          label="Linotype Metal Pot Temperature"
          value={potTempC}
          min={220}
          max={300}
          step={2}
          unit="°C"
          onChange={(val) => updateParam("potTemp", val)}
          allParams={params}
        />
        <SensitivitySlider
          id="linotype-line-length-2d"
          patentId="us-313224-mergenthaler-linotype"
          paramKey="lineLengthPicas"
          label="Column Line Measure"
          value={lineLengthPicas}
          min={8}
          max={26}
          step={1}
          unit="picas"
          onChange={(val) => updateParam("lineLengthPicas", val)}
          allParams={params}
        />
      </div>
    </div>
  );
}
