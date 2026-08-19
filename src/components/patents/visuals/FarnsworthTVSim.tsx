"use client";

import { Tv } from "lucide-react";
import { useEffect, useState } from "react";
import { voltsToKv } from "@/physics/catalogKernels";
import { FrankenSimEngine } from "@/physics/engine";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

export function FarnsworthTVSim() {
  const { params, updateParam } = usePatentPhysics("us-1773980-farnsworth-tv");
  const anodeVoltage = params.anodeVoltage ?? 1500;
  const coilCurrent = params.coilCurrent ?? 0.42;
  const scanLines = params.scanLines ?? 60;
  const [mode, setMode] = useState<"electronic-farnsworth" | "mechanical-nipkow">(
    "electronic-farnsworth",
  );
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [beamPos, setBeamPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const deflectionGauss = FrankenSimEngine.farnsworthDeflectionGauss(coilCurrent);
  const beam = FrankenSimEngine.stepFarnsworthTv(
    voltsToKv(anodeVoltage),
    deflectionGauss,
    params.lightIntensityLux ?? 500,
    scanLines,
  );
  const speedMultiplier = beam.rasterAdvance;

  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(() => {
      setBeamPos((pos) => {
        const nextX = (pos.x + speedMultiplier) % beam.rasterLineWrapPct;
        const nextY = nextX < pos.x ? (pos.y + beam.rasterLinePct) % beam.rasterLineWrapPct : pos.y;
        return { x: nextX, y: nextY };
      });
    }, 30);
    return () => clearInterval(interval);
  }, [isScanning, speedMultiplier, beam.rasterLinePct, beam.rasterLineWrapPct]);

  return (
    <div className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-5 shadow-patent">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Tv className="w-4 h-4 text-emerald-500" />
            <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
              Farnsworth Electronic Electron-Beam Raster Scanning Simulator
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-0.5">
            See how steering electron beams magnetically eliminated spinning mechanical Nipkow
            discs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const newMode =
                mode === "electronic-farnsworth" ? "mechanical-nipkow" : "electronic-farnsworth";
              setMode(newMode);
              updateParam("scanLines", newMode === "mechanical-nipkow" ? 30 : 120);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300 hover:bg-parchment-300 dark:hover:bg-ink-700 transition-colors"
          >
            {mode === "electronic-farnsworth" ? "Compare to Nipkow Disc" : "Return to Farnsworth"}
          </button>
          <button
            type="button"
            onClick={() => setIsScanning(!isScanning)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
          >
            {isScanning ? "Pause Beam" : "Resume Scan"}
          </button>
        </div>
      </div>

      <div className="my-5">
        {/* CRT / Image Screen */}
        <div className="flex flex-col items-center justify-center rounded-xl bg-ink-950 p-6 border border-parchment-200 dark:border-ink-800 relative min-h-[300px]">
          <div className="w-64 h-56 rounded-2xl bg-zinc-900 border-4 border-zinc-700 shadow-2xl relative overflow-hidden flex items-center justify-center">
            {/* CRT Phosphor Scan Lines Effect */}
            <div
              className={`absolute inset-0 bg-contain bg-center opacity-80 ${
                mode === "mechanical-nipkow" ? "blur-sm contrast-75" : ""
              }`}
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.9) 0%, rgba(6, 78, 59, 0.4) 70%, transparent 100%)",
              }}
            >
              {/* Raster Scanline Overlay */}
              <div
                className="w-full h-full"
                style={{
                  background: `repeating-linear-gradient(0deg, transparent, transparent ${240 / scanLines}px, rgba(0,0,0,0.6) ${240 / scanLines}px, rgba(0,0,0,0.6) ${480 / scanLines}px)`,
                }}
              />
            </div>

            {/* Moving Electron Beam Spot */}
            <div
              className="absolute w-3 h-3 rounded-full bg-emerald-300 shadow-[0_0_12px_#34d399] transition-colors duration-75"
              style={{
                left: `${beamPos.x}%`,
                top: `${beamPos.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            />

            {/* Test Pattern Overlay (Farnsworth Historic Triangle or Dollar Sign) */}
            <div className="relative z-10 text-emerald-400 font-mono font-black text-4xl opacity-75 tracking-widest">
              $ 1927
            </div>
          </div>

          <div className="text-xs font-mono text-ink-300 mt-3">
            {mode === "electronic-farnsworth" ? (
              <span className="text-emerald-400 font-bold">
                Electron Optics: {scanLines} lines · {beam.electronVelocityMegaMps} Mm/s · r=
                {beam.gyroRadiusMm} mm · {beam.photocathodeCurrentUa} µA
              </span>
            ) : (
              <span className="text-amber-400 font-bold">
                Mechanical Nipkow Disc: Severe 30-line Blur & Frame Shake
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
