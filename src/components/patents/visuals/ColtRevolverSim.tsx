"use client";

import { Sparkles, Target, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";

export function ColtRevolverSim() {
  const { params, updateParam } = usePatentPhysics("us-138-colt-revolver");
  const chamberPressureMpa = params.chamberPressure ?? 85;
  const [cockingAngleDeg, setCockingAngleDeg] = useState<number>(45); // 0 (hammer down) to 45 (full cock)
  const [currentChamberIndex, setCurrentChamberIndex] = useState<number>(1);
  const [isFiring, setIsFiring] = useState<boolean>(false);
  const [bulletFired, setBulletFired] = useState<boolean>(false);

  const isFullCock = cockingAngleDeg >= 44;
  const cylinderRotationAngle = ((cockingAngleDeg / 45) * 60) % 360;
  const isBoltLocked = cockingAngleDeg >= 44 || cockingAngleDeg <= 2;
  const boltRetractionY = cockingAngleDeg > 2 && cockingAngleDeg < 44 ? 8 : 0;

  // Hoop stress calculation
  const rInnerMm = 5.5; // .36 caliber chamber radius
  const tWallMm = 3.8;
  const hoopStressMpa = ((chamberPressureMpa * rInnerMm) / tWallMm).toFixed(1);
  const muzzleVelocityMps = Math.round(180 + Math.sqrt(chamberPressureMpa) * 12.5);

  const fireTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (fireTimerRef.current !== null) {
        window.clearTimeout(fireTimerRef.current);
      }
    };
  }, []);

  const handleCockHammer = () => {
    setCockingAngleDeg(45);
    updateParam("cockingAngle", 45);
    soundEngine.playMicroswitchClick();
  };

  const handlePullTrigger = () => {
    if (!isFullCock || isFiring) return;
    setIsFiring(true);
    setCockingAngleDeg(0);
    updateParam("cockingAngle", 0);

    // Hammer strike sound & muzzle blast
    soundEngine.playLockstitchClack();
    setBulletFired(true);

    fireTimerRef.current = window.setTimeout(() => {
      setIsFiring(false);
      setBulletFired(false);
      setCurrentChamberIndex((prev) => (prev % 6) + 1);
    }, 1200);
  };

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-600 dark:text-amber-500 animate-pulse" />
            <h3 className="font-serif text-lg sm:text-xl font-bold text-ink-900 dark:text-parchment-100">
              Colt Single-Action Cylinder Indexing & Lockwork (US 138)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-1">
            Draw the hammer to full cock to observe the mechanical pawl advance the 6-chamber
            cylinder exactly 60° while the spring bolt locks chamber alignment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCockHammer}
            disabled={isFullCock || isFiring}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 bg-white/80 dark:bg-ink-900/80 text-xs font-mono font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 disabled:opacity-40 transition-colors shadow-sm"
          >
            <span>1. Cock Hammer</span>
          </button>
          <button
            type="button"
            onClick={handlePullTrigger}
            disabled={!isFullCock || isFiring}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-40 transition-colors shadow-sm"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>2. Pull Trigger</span>
          </button>
        </div>
      </div>

      {/* Visual Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Mechanism Diagram */}
        <div className="lg:col-span-8 relative bg-[#090d16] rounded-2xl border border-parchment-300 dark:border-ink-800 p-6 flex flex-col items-center justify-center min-h-[380px] overflow-hidden select-none">
          {/* Blueprint Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:20px_20px] opacity-30 pointer-events-none" />

          {/* Firing Status Banner */}
          {bulletFired && (
            <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-amber-950/90 border border-amber-600 rounded-lg text-amber-300 text-xs font-mono flex items-center gap-1.5 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                CHAMBER #{currentChamberIndex} FIRED: {muzzleVelocityMps} m/s (Hoop Stress:{" "}
                {hoopStressMpa} MPa)
              </span>
            </div>
          )}

          <svg viewBox="0 0 540 300" className="w-full max-w-lg h-auto relative z-10">
            {/* Stationary Barrel with Rifled Bore */}
            <g transform="translate(340, 100)">
              <rect
                x="0"
                y="0"
                width="180"
                height="40"
                fill="#334155"
                stroke="#64748b"
                strokeWidth="2"
                rx="2"
              />
              <line x1="0" y1="20" x2="180" y2="20" stroke="#94a3b8" strokeWidth="12" />
              <line x1="0" y1="20" x2="180" y2="20" stroke="#0f172a" strokeWidth="8" />
              <text x="70" y="55" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                RIFLED BARREL BORE
              </text>
              {/* Muzzle flash when fired */}
              {bulletFired && (
                <g transform="translate(180, 20)">
                  <polygon
                    points="0,-15 35,-5 20,0 45,5 20,10 35,20 0,15"
                    fill="#f59e0b"
                    opacity="0.9"
                  />
                  <circle cx="10" cy="0" r="12" fill="#fef08a" opacity="0.8" />
                </g>
              )}
            </g>

            {/* Frame & Recoil Shield */}
            <path
              d="M 120 70 L 340 70 L 340 180 L 150 180 L 120 220 L 80 200 L 100 130 Z"
              fill="#1e293b"
              stroke="#475569"
              strokeWidth="2.5"
            />
            <text x="130" y="60" fill="#64748b" fontSize="9" fontFamily="monospace">
              FORGED STEEL FRAME & RECOIL SHIELD
            </text>

            {/* Revolving Cylinder Face (Side Cutaway Profile) */}
            <g transform="translate(200, 85)">
              <rect
                x="0"
                y="0"
                width="135"
                height="70"
                rx="4"
                fill="#334155"
                stroke="#cbd5e1"
                strokeWidth="2"
              />
              {/* 6 Chambers internal bores */}
              <rect
                x="0"
                y="8"
                width="130"
                height="16"
                fill="#0f172a"
                stroke="#475569"
                strokeWidth="1"
              />
              <rect
                x="0"
                y="46"
                width="130"
                height="16"
                fill="#0f172a"
                stroke="#475569"
                strokeWidth="1"
              />

              {/* Lead Bullet in Aligned Chamber */}
              <circle cx="120" cy="16" r="6" fill="#94a3b8" />
              <rect x="30" y="10" width="85" height="12" fill="#1e293b" />
              <text x="40" y="19" fill="#f59e0b" fontSize="8" fontFamily="monospace">
                POWDER CHARGE
              </text>

              {/* Percussion Nipple & Flash Shield Partition */}
              <rect x="-8" y="13" width="8" height="6" fill="#f59e0b" />
              {/* Flash Partition Barrier */}
              <rect x="-10" y="2" width="4" height="28" fill="#cbd5e1" />
              <rect x="-10" y="40" width="4" height="28" fill="#cbd5e1" />
              <text x="-40" y="-5" fill="#38bdf8" fontSize="8" fontFamily="monospace">
                FLASH PARTITION
              </text>

              {/* Cylinder Perimeter Locking Notch */}
              <rect
                x="60"
                y="66"
                width="14"
                height="6"
                fill="#0f172a"
                stroke="#38bdf8"
                strokeWidth="1"
              />
            </g>

            {/* Cylinder Stop Locking Bolt (Spring-loaded beneath cylinder) */}
            <g transform={`translate(260, ${158 + boltRetractionY})`}>
              <rect
                x="0"
                y="0"
                width="12"
                height="18"
                fill={isBoltLocked ? "#10b981" : "#f59e0b"}
                rx="1"
              />
              <text
                x="-25"
                y="30"
                fill={isBoltLocked ? "#34d399" : "#fbbf24"}
                fontSize="9"
                fontFamily="monospace"
              >
                {isBoltLocked ? "BOLT: LOCKED" : "BOLT: TRIPPED"}
              </text>
            </g>

            {/* Cocking Hammer with Cam & Pawl Pin */}
            <g transform={`translate(150, 140) rotate(${-cockingAngleDeg})`}>
              {/* Main Hammer Body */}
              <path
                d="M 0 0 L -15 -45 L 5 -75 L 20 -70 L 10 -40 L 15 0 Z"
                fill="#475569"
                stroke="#e2e8f0"
                strokeWidth="2"
              />
              {/* Hammer Spur (Thumb Grip) */}
              <path d="M 5 -75 L -10 -85 L -5 -90 L 15 -75 Z" fill="#64748b" />
              {/* Hammer Striker Nose */}
              <rect x="18" y="-72" width="14" height="8" fill="#cbd5e1" rx="1" />

              {/* Pawl / Hand pivoted to breast of hammer */}
              <g transform="translate(10, -25)">
                <line
                  x1="0"
                  y1="0"
                  x2="35"
                  y2="-20"
                  stroke="#f59e0b"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="0" cy="0" r="3" fill="#cbd5e1" />
                <polygon points="35,-20 30,-28 40,-25" fill="#f59e0b" />
              </g>
              <text x="-70" y="-50" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                HAMMER CAM
              </text>
            </g>

            {/* Cylinder Rear Ratchet Teeth */}
            <g transform="translate(195, 120)">
              <circle cx="0" cy="0" r="14" fill="#1e293b" stroke="#e2e8f0" strokeWidth="2" />
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <line
                  key={deg}
                  x1="0"
                  y1="0"
                  x2={Math.cos(((deg + cylinderRotationAngle) * Math.PI) / 180) * 14}
                  y2={Math.sin(((deg + cylinderRotationAngle) * Math.PI) / 180) * 14}
                  stroke="#f59e0b"
                  strokeWidth="2"
                />
              ))}
              <text x="-35" y="32" fill="#fbbf24" fontSize="8" fontFamily="monospace">
                60° RATCHET
              </text>
            </g>

            {/* Trigger Lever */}
            <path
              d="M 170 180 Q 185 210 165 230"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Controls Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/70 dark:bg-ink-900/60 p-5 space-y-4 shadow-sm">
            <span className="font-serif font-bold text-sm text-ink-900 dark:text-parchment-100 block">
              Single-Action Lockwork Parameters
            </span>

            {/* Hammer Cocking Angle Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Hammer Cocking Arc
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {cockingAngleDeg}° / 45°
                </span>
              </div>
              <input
                type="range"
                aria-label="Hammer Cocking Arc Angle"
                min="0"
                max="45"
                step="1"
                value={cockingAngleDeg}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCockingAngleDeg(val);
                  updateParam("cockingAngle", val);
                }}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-ink-500 font-mono">
                <span>0° (Hammer Down)</span>
                <span>45° (Full Cock)</span>
              </div>
            </div>

            {/* Combustion Chamber Pressure Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Peak Propellant Pressure
                </span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                  {chamberPressureMpa} MPa
                </span>
              </div>
              <input
                type="range"
                aria-label="Black Powder Combustion Peak Pressure"
                min="40"
                max="140"
                step="5"
                value={chamberPressureMpa}
                onChange={(e) => updateParam("chamberPressure", Number(e.target.value))}
                className="w-full accent-cyan-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Telemetry Metrics */}
            <div className="space-y-2 pt-2 border-t border-parchment-300 dark:border-ink-800 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-ink-600 dark:text-ink-400">Cylinder Index:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {cylinderRotationAngle.toFixed(1)}° (Chamber #{currentChamberIndex})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600 dark:text-ink-400">Cylinder Bolt Detent:</span>
                <span
                  className={`font-bold ${isBoltLocked ? "text-emerald-500" : "text-amber-500"}`}
                >
                  {isBoltLocked ? "Positive Lockup (0.05 mm)" : "Tripped (Retracted)"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600 dark:text-ink-400">Chamber Hoop Stress:</span>
                <span className="font-bold text-cyan-600 dark:text-cyan-400">
                  {hoopStressMpa} MPa (Yield: 240 MPa)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600 dark:text-ink-400">Flash Barrier Protection:</span>
                <span className="font-bold text-emerald-500">100% Anti-Chain-Fire Isolation</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-ink-900 dark:text-parchment-100 text-xs font-sans space-y-1">
              <span className="font-bold text-amber-900 dark:text-amber-300 block font-mono text-[11px] uppercase tracking-wider">
                Colt&apos;s Kinematic Breakthrough:
              </span>
              <p className="leading-relaxed">
                Prior pepperbox guns required manually spinning multiple heavy barrels. Colt&apos;s
                single-action mechanism harnessed the single cocking motion of the hammer to advance
                the ratchet 60° and snap the locking bolt home, achieving rapid repeating fire with
                a single stationary barrel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
