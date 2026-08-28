"use client";

import { Camera, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { FrankenSimEngine } from "@/physics/engine";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";

export function EastmanKodakSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-388850-eastman-kodak");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const shutterSpeedSec = params.shutterSpeed ?? 0.05;
  const [exposureCount, setExposureCount] = useState<number>(0);
  const [isShutterTriggered, setIsShutterTriggered] = useState<boolean>(false);

  const fNumber = params.apertureStop ?? 9.0;
  const kodak = FrankenSimEngine.stepEastmanKodak({
    shutterSpeedSec,
    apertureFNumber: fNumber,
    subjectDistanceM: params.subjectDist ?? params.subjectDistance ?? 3.0,
  });
  const totalExposures = kodak.rollCapacity;
  const focalLengthMm = kodak.focalLengthMm;

  const handleTriggerShutter = () => {
    setIsShutterTriggered(true);
    soundEngine.playSwitchClick();
    if (exposureCount < totalExposures) {
      setExposureCount((prev) => prev + 1);
    }
    setTimeout(() => setIsShutterTriggered(false), kodak.flashDisplayMs);
  };

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
              George Eastman Kodak Box Camera &amp; Roll Film (US 388,850)
            </h3>
          </div>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400 mt-0.5">
            Cylindrical barrel shutter, 100-exposure flexible roll film, and key wind mechanism.
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleTriggerShutter}
            aria-label="Press Button / Snap Shutter"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-sans text-xs font-bold shadow transition-colors active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <span>Snap Shutter</span>
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
              setExposureCount(0);
              setIsShutterTriggered(false);
              soundEngine.playSwitchClick();
            }}
            aria-label="Reset Film Roll"
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
          aria-label={`Eastman Kodak camera simulation: ${isShutterTriggered ? "shutter open, exposing film" : "shutter closed"}, ${exposureCount} of ${totalExposures} exposures used`}
          className="w-full h-full"
        >
          {/* Black Leatherette Box Camera Body */}
          <rect
            x="100"
            y="60"
            width="400"
            height="220"
            rx="12"
            fill="#1A202C"
            stroke="#2D3748"
            strokeWidth="4"
          />
          <text
            x="230"
            y="90"
            fill="#718096"
            fontWeight="bold"
            fontSize="14"
            fontFamily="sans-serif"
          >
            THE KODAK CAMERA (1888)
          </text>

          {/* Front Barrel Shutter & Lens (Left) */}
          <g transform="translate(100, 170)">
            <rect
              x="-30"
              y="-35"
              width="30"
              height="70"
              rx="4"
              fill="#B87333"
              stroke="#8B5A2B"
              strokeWidth="2"
            />
            <circle cx="-15" cy="0" r="14" fill="#3182CE" opacity="0.8" />
            {/* Cylindrical Rotary Shutter Slit */}
            <line
              x1="-15"
              y1="-12"
              x2="-15"
              y2="12"
              stroke={isShutterTriggered ? "#FFFFFF" : "#1A202C"}
              strokeWidth="4"
            />
            <text
              x="-75"
              y="-45"
              fill="#B87333"
              fontSize="10"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              f/9 Fixed Lens
            </text>
          </g>

          {/* Light Rays entering dark chamber */}
          {isShutterTriggered && (
            <polygon points="100,170 420,95 420,245" fill="#ECC94B" opacity="0.35" />
          )}

          {/* Roll Film Carrier Spools & Focal Plane (Right) */}
          <g transform="translate(420, 95)">
            {/* Supply Spool (Top) */}
            <circle cx="0" cy="0" r="18" fill="#4A5568" stroke="#718096" strokeWidth="2" />
            <circle cx="0" cy="0" r="12" fill="#D69E2E" />

            {/* Film Plane along back */}
            <line x1="0" y1="18" x2="0" y2="132" stroke="#E2E8F0" strokeWidth="4" />
            <text
              x="15"
              y="75"
              fill="#E2E8F0"
              fontSize="10"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Film Plane ({exposureCount}/{kodak.rollCapacity})
            </text>

            {/* Take-Up Spool & Key Wind (Bottom) */}
            <circle cx="0" cy="150" r="18" fill="#4A5568" stroke="#718096" strokeWidth="2" />
            <circle cx="0" cy="150" r="14" fill="#D69E2E" />
            {/* Winding Key */}
            <rect x="-4" y="168" width="8" height="25" fill="#D4AF37" rx="2" />
            <ellipse cx="0" cy="195" rx="14" ry="6" fill="#D4AF37" />
          </g>

          {/* Circular Photographic Exposure Preview */}
          <g transform="translate(270, 170)">
            <circle cx="0" cy="0" r="55" fill="#000000" stroke="#718096" strokeWidth="3" />
            <circle cx="0" cy="0" r="50" fill="#2B6CB0" opacity="0.3" />
            <text
              x="-40"
              y="5"
              fill="#CBD5E0"
              fontSize="11"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              2.5" Circular Frame
            </text>
          </g>
        </svg>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Exposures Taken
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {exposureCount} / {totalExposures}
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Shutter Speed
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            1/{kodak.shutterReciprocal} s
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Optical Aperture
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            f/{fNumber} ({focalLengthMm}mm)
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            EV / Hyperfocal
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            EV {kodak.exposureValueEv} / {kodak.hyperfocalM} m
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-parchment-200 dark:border-ink-800">
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Barrel Shutter Exposure Duration</span>
            <span className="font-mono">1/{kodak.shutterReciprocal} sec</span>
          </div>
          <input
            type="range"
            min="0.01"
            max="0.1"
            step="0.01"
            value={shutterSpeedSec}
            onChange={(e) => updateParam("shutterSpeed", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Current Exposure on Roll</span>
            <span className="font-mono">
              {exposureCount} / {kodak.rollCapacity}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={kodak.rollCapacity}
            step="1"
            value={exposureCount}
            onChange={(e) => setExposureCount(Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </div>
      </div>
    </div>
  );
}
