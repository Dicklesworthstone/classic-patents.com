"use client";

import { Tv } from "lucide-react";
import { useEffect, useState } from "react";

export function FarnsworthTVSim() {
  const [scanLines, setScanLines] = useState<number>(60); // 30 to 240 lines
  const [mode, setMode] = useState<"electronic-farnsworth" | "mechanical-nipkow">(
    "electronic-farnsworth",
  );
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [beamPos, setBeamPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(() => {
      setBeamPos((pos) => {
        const nextX = (pos.x + 8) % 100;
        const nextY = nextX < pos.x ? (pos.y + 100 / scanLines) % 100 : pos.y;
        return { x: nextX, y: nextY };
      });
    }, 30);
    return () => clearInterval(interval);
  }, [isScanning, scanLines]);

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
            onClick={() => setIsScanning(!isScanning)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
          >
            {isScanning ? "Pause Beam" : "Resume Scan"}
          </button>
        </div>
      </div>

      <div className="my-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CRT / Image Screen */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center rounded-xl bg-ink-950 p-6 border border-parchment-200 dark:border-ink-800 relative min-h-[300px]">
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
              className="absolute w-3 h-3 rounded-full bg-emerald-300 shadow-[0_0_12px_#34d399] transition-all duration-75"
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
                Electron Optics: {scanLines} Progressive Scan Lines (Flicker-Free)
              </span>
            ) : (
              <span className="text-amber-400 font-bold">
                Mechanical Nipkow Disc: Severe 30-line Blur & Frame Shake
              </span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-parchment-100/60 dark:bg-ink-900/60 p-4 rounded-xl border border-parchment-200 dark:border-ink-800 space-y-3">
            <div>
              <span className="text-xs font-mono block text-ink-700 dark:text-ink-300 font-semibold mb-1">
                Dissection Technology
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setMode("electronic-farnsworth");
                    setScanLines(120);
                  }}
                  className={`p-2 rounded border text-left transition-colors ${
                    mode === "electronic-farnsworth"
                      ? "bg-emerald-700 text-white border-emerald-800 font-bold"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300"
                  }`}
                >
                  <div>Farnsworth All-Electronic</div>
                  <div className="text-[10px] opacity-80">Magnetic sweep yoke</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("mechanical-nipkow");
                    setScanLines(30);
                  }}
                  className={`p-2 rounded border text-left transition-colors ${
                    mode === "mechanical-nipkow"
                      ? "bg-amber-700 text-white border-amber-800 font-bold"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300"
                  }`}
                >
                  <div>Nipkow Mechanical</div>
                  <div className="text-[10px] opacity-80">Spinning hole disc</div>
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Scan Line Resolution
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {scanLines} lines/frame
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="240"
                step="10"
                value={scanLines}
                onChange={(e) => setScanLines(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
