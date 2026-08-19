"use client";

import { Shield, ShieldAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { kevlarChainBond, stepKevlarContinuum } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

export function KwolekKevlarSim() {
  const { params, updateParam } = usePatentPhysics("us-3671542-kwolek-kevlar");
  const drawRatio = params.drawRatio ?? 6.5;
  const tensileTension = params.appliedTension ?? 30;
  const [bulletFired, setBulletFired] = useState<boolean>(false);

  const kevlar = stepKevlarContinuum(drawRatio, params.impactVelocity ?? 450, tensileTension);
  const polymerAlignment = kevlar.alignmentPct;
  const currentStrengthGPa = kevlar.tensileStrengthGpa;
  const residualCapacityGPa = kevlar.residualStrengthGpa;
  const isArmorPenetrated = bulletFired && residualCapacityGPa < 1.6;

  const impactTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (impactTimerRef.current !== null) {
        window.clearTimeout(impactTimerRef.current);
      }
    };
  }, []);

  const fireBulletTest = () => {
    if (impactTimerRef.current !== null) {
      window.clearTimeout(impactTimerRef.current);
    }
    setBulletFired(true);
    impactTimerRef.current = window.setTimeout(() => setBulletFired(false), kevlar.impactDisplayMs);
  };

  return (
    <div className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-5 shadow-patent">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-500" />
            <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
              Kwolek Liquid-Crystalline Aramid (Kevlar) Molecular Alignment Simulator
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-0.5">
            Discover how parallel alignment of rigid aromatic PPTA chains creates a fiber 5x
            stronger than steel.
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={fireBulletTest}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-sm"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Simulate Ballistic Impact
          </button>
        </div>
      </div>

      <div className="my-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Molecular Fibril Visualization */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center rounded-xl bg-ink-950 p-6 border border-parchment-200 dark:border-ink-800 relative min-h-[300px]">
          {bulletFired && (
            <div
              className={`absolute top-4 left-4 z-10 px-3 py-1 text-xs font-mono rounded flex items-center gap-1.5 ${
                isArmorPenetrated
                  ? "bg-red-950/90 border border-red-700 text-red-300 animate-bounce"
                  : "bg-emerald-950/90 border border-emerald-700 text-emerald-300"
              }`}
            >
              {isArmorPenetrated
                ? "✗ BALLISTIC PENETRATION: Tangled chains failed under shear!"
                : "✓ BULLET STOPPED: Crystalline hydrogen bonds dissipated impact energy!"}
            </div>
          )}

          <svg viewBox="0 0 380 200" className="w-full max-w-md h-auto select-none">
            {/* Molecular polymer chains */}
            {[-60, -30, 0, 30, 60].map((offsetY, idx) => {
              const waviness = kevlar.chainWaviness;
              const yBase = 100 + offsetY;
              const xEnd = kevlar.chainEndX;
              return (
                <g key={idx}>
                  {/* PPTA Polymer Backbone — tension lengthens and straightens the chain */}
                  <path
                    d={`M 30,${yBase} Q 100,${yBase + (idx % 2 === 0 ? waviness : -waviness)} 200,${yBase} T ${xEnd},${yBase}`}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Inter-Chain Hydrogen Bonds (when aligned) */}
                  {polymerAlignment > 60 && idx < 4 && (
                    <g stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3">
                      {kevlar.chainBondXs.map((_, i) => {
                        const bond = kevlarChainBond(i, kevlar.chainBondXs);
                        return (
                          <line
                            key={bond.x}
                            x1={bond.x}
                            y1={yBase}
                            x2={bond.x}
                            y2={yBase + kevlar.chainBondH}
                          />
                        );
                      })}
                    </g>
                  )}
                </g>
              );
            })}

            {/* Benzene Rings on Central Chain */}
            {polymerAlignment > 50 && (
              <g fill="#d97706" opacity="0.9">
                <polygon points="90,95 100,90 110,95 110,105 100,110 90,105" />
                <polygon points="190,95 200,90 210,95 210,105 200,110 190,105" />
                <polygon points="290,95 300,90 310,95 310,105 300,110 290,105" />
              </g>
            )}
          </svg>

          <div className="text-xs font-mono text-ink-300 mt-2">
            Tensile Strength:{" "}
            <span className="text-amber-400 font-bold">{currentStrengthGPa.toFixed(2)} GPa</span>{" "}
            (Steel = 0.5 GPa)
            {" · "}
            Residual ballistic capacity:{" "}
            <span className="text-emerald-400 font-bold">{residualCapacityGPa.toFixed(2)} GPa</span>
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-parchment-100/60 dark:bg-ink-900/60 p-4 rounded-xl border border-parchment-200 dark:border-ink-800 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Polymer Molecular Alignment (Nematicity)
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {polymerAlignment}% (Draw {drawRatio.toFixed(1)}:1)
                </span>
              </div>
              <input
                type="range"
                aria-label="Filament Draw Orientation Ratio"
                min="2.0"
                max="8.0"
                step="0.2"
                value={drawRatio}
                onChange={(e) => updateParam("drawRatio", Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-ink-500 font-mono mt-0.5">
                <span>Isotropic Tangled (Nylon)</span>
                <span>Oriented Nematic (Kevlar)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Applied Tensile Strain
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {tensileTension}%
                </span>
              </div>
              <input
                type="range"
                aria-label="Applied Tensile Strain"
                min="0"
                max="100"
                value={tensileTension}
                onChange={(e) => updateParam("appliedTension", Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
