"use client";

import { Activity, Flame, RotateCcw, Sparkles, Target, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { coltNextChamber } from "@/physics/catalogKernels";
import { FrankenSimEngine } from "@/physics/engine";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";

export function ColtRevolverSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-x9430-colt-revolver");
  const { isAudioMuted, toggleSound } = usePatentAudio();

  const chamberPressureMpa = params.chamberPressure ?? 85;
  const cockingAngleDeg = params.cockingAngle ?? 45; // 0 (hammer down) to 45 (full cock)

  const [currentChamberIndex, setCurrentChamberIndex] = useState<number>(1);
  const [isFiring, setIsFiring] = useState<boolean>(false);
  const [bulletFired, setBulletFired] = useState<boolean>(false);

  const colt = FrankenSimEngine.stepColtRevolver({
    chamberPressureMpa,
    cockingAngleDeg,
  });
  const isFullCock = colt.isLocked;
  const cylinderRotationAngle = colt.indexAngleDeg;
  const isBoltLocked = colt.isLocked || cockingAngleDeg <= 2;
  const boltRetractionY =
    cockingAngleDeg > colt.lockReleaseDeg && !colt.isLocked ? colt.boltRetractY : colt.boltHomeY;
  const hoopStressMpa = colt.hoopStressMpa.toFixed(1);
  const muzzleVelocityMps = colt.muzzleVelocityMps;
  const muzzleEnergyJoules = colt.muzzleEnergyJoules;

  const fireTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (fireTimerRef.current !== null) {
        window.clearTimeout(fireTimerRef.current);
      }
    };
  }, []);

  const handleCockHammer = () => {
    updateParam("cockingAngle", 45);
    soundEngine.playMicroswitchClick();
  };

  const handlePullTrigger = () => {
    if (!isFullCock || isFiring) return;
    setIsFiring(true);
    updateParam("cockingAngle", 0);

    // Hammer strike sound & muzzle blast
    soundEngine.playLockstitchClack();
    setBulletFired(true);

    fireTimerRef.current = window.setTimeout(() => {
      setIsFiring(false);
      setBulletFired(false);
      setCurrentChamberIndex((prev) => coltNextChamber(prev, colt.chamberCount));
    }, colt.cycleDisplayMs);
  };

  return (
    <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-600 dark:text-amber-500 animate-pulse" />
            <h3 className="font-serif text-lg sm:text-xl font-bold text-ink-900 dark:text-parchment-100">
              Colt Single-Action 5-Chamber Indexing & Lockwork (US X9430)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-1">
            Draw the hammer to full cock to observe the mechanical hand pawl advance the 5-chamber
            cylinder exactly 72° while the spring bolt locks positive chamber-to-bore alignment.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end lg:self-auto">
          <button
            type="button"
            onClick={handleCockHammer}
            disabled={isFullCock || isFiring}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 bg-white/80 dark:bg-ink-900/80 text-xs font-mono font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 disabled:opacity-40 transition-colors shadow-sm cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>1. Cock Hammer</span>
          </button>
          <button
            type="button"
            onClick={handlePullTrigger}
            disabled={!isFullCock || isFiring}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-40 transition-colors shadow-sm cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>2. Pull Trigger</span>
          </button>
          <button
            type="button"
            onClick={() => {
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            aria-label={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors cursor-pointer"
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              resetParams();
              setCurrentChamberIndex(1);
              soundEngine.playSwitchClick();
            }}
            aria-label="Reset Simulation"
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors cursor-pointer"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visual Canvas & Interactive Schematics */}
      <div className="relative bg-[#090d16] rounded-2xl border border-parchment-300 dark:border-ink-800 p-6 flex flex-col items-center justify-center min-h-[380px] overflow-hidden select-none">
        {/* Blueprint Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:20px_20px] opacity-35 pointer-events-none" />

        {/* Firing Status Banner */}
        {bulletFired && (
          <div className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-amber-950/90 border border-amber-500 rounded-lg text-amber-300 text-xs font-mono flex items-center gap-2 animate-pulse shadow-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>
              CHAMBER #{currentChamberIndex} FIRED: {muzzleVelocityMps} m/s | Energy:{" "}
              {muzzleEnergyJoules} J | Hoop Stress: {hoopStressMpa} MPa | Index:{" "}
              {cylinderRotationAngle}°
            </span>
          </div>
        )}

        <svg viewBox="0 0 600 320" className="w-full max-w-xl h-auto relative z-10">
          {/* Center Arbor Pin (Axis of Rotation Y = 135) */}
          <line x1="80" y1="135" x2="380" y2="135" stroke="#475569" strokeWidth="6" />
          <line
            x1="80"
            y1="135"
            x2="380"
            y2="135"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeDasharray="6,4"
          />
          <text x="210" y="148" fill="#64748b" fontSize="8" fontFamily="monospace">
            CENTER ARBOR AXIS PIN
          </text>

          {/* Octagonal Rifled Barrel (Aligned with Top Chamber at Y = 85) */}
          <g transform="translate(360, 65)">
            <rect
              x="0"
              y="0"
              width="220"
              height="40"
              fill="#1e293b"
              stroke="#64748b"
              strokeWidth="2"
              rx="3"
            />
            <line x1="0" y1="20" x2="220" y2="20" stroke="#94a3b8" strokeWidth="12" />
            <line x1="0" y1="20" x2="220" y2="20" stroke="#05070d" strokeWidth="8" />
            <text x="50" y="14" fill="#94a3b8" fontSize="9" fontFamily="monospace">
              OCTAGONAL RIFLED BARREL (.36 CAL)
            </text>

            {/* German Silver Front Sight Post */}
            <polygon points="190,0 194,-10 198,-10 202,0" fill="#f59e0b" />

            {/* Barrel Under-Lug Anchoring to Arbor Pin */}
            <path
              d="M 0 40 L 60 40 L 60 90 L 0 90 Z"
              fill="#334155"
              stroke="#475569"
              strokeWidth="2"
            />
            {/* Tapered Barrel Takedown Wedge Key */}
            <rect x="22" y="58" width="16" height="22" fill="#94a3b8" stroke="#cbd5e1" />
            <text x="5" y="102" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              BARREL WEDGE
            </text>

            {/* Muzzle Flash & Flame Blast */}
            {bulletFired && (
              <g transform="translate(220, 20)">
                <polygon
                  points="0,-18 50,-8 30,0 60,6 25,12 45,22 0,16"
                  fill="#f59e0b"
                  opacity="0.95"
                />
                <circle cx="15" cy="0" r="16" fill="#fef08a" opacity="0.9" />
                <circle cx="4" cy="0" r="8" fill="#ffffff" />
              </g>
            )}
          </g>

          {/* Receiver Frame & Curved Recoil Shield */}
          <path
            d="M 60 40 L 220 40 L 220 200 L 140 200 L 100 250 L 50 220 L 70 140 Z"
            fill="#1e2430"
            stroke="#64748b"
            strokeWidth="2.5"
          />
          <text x="80" y="32" fill="#94a3b8" fontSize="9" fontFamily="monospace">
            CASE-HARDENED FRAME & RECOIL SHIELD
          </text>

          {/* Revolving 5-Chamber Cylinder (Center Y = 135) */}
          <g transform="translate(210, 60)">
            {/* Cylinder Outer Boundary */}
            <rect
              x="0"
              y="0"
              width="145"
              height="150"
              rx="6"
              fill="#243040"
              stroke="#cbd5e1"
              strokeWidth="2"
            />

            {/* 1. Top Firing Chamber (Bore Y = 25, matching Barrel Y = 85) */}
            <rect
              x="0"
              y="13"
              width="140"
              height="24"
              fill="#090d16"
              stroke="#475569"
              strokeWidth="1.5"
            />
            <circle cx="125" cy="25" r="8" fill="#94a3b8" />
            <rect x="25" y="16" width="90" height="18" fill="#1e293b" />
            <text x="35" y="28" fill="#f59e0b" fontSize="8" fontFamily="monospace">
              POWDER CHARGE (28 GR)
            </text>

            {/* Top Percussion Nipple & Flash-Isolating Partition Wall (Claim 3) */}
            <rect x="-10" y="20" width="10" height="10" fill="#f59e0b" />
            <rect x="-14" y="5" width="4" height="40" fill="#cbd5e1" />
            <text x="-75" y="12" fill="#38bdf8" fontSize="8" fontFamily="monospace">
              FLASH WALL
            </text>

            {/* 2. Central Chamber Bore Silhouette */}
            <rect
              x="0"
              y="63"
              width="140"
              height="24"
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="1"
              strokeDasharray="4,4"
            />

            {/* 3. Bottom Loading Chamber (Bore Y = 125, matching Rammer) */}
            <rect
              x="0"
              y="113"
              width="140"
              height="24"
              fill="#090d16"
              stroke="#475569"
              strokeWidth="1.5"
            />
            <rect x="-10" y="120" width="10" height="10" fill="#f59e0b" />
            <rect x="-14" y="105" width="4" height="40" fill="#cbd5e1" />

            {/* Cylinder Perimeter Locking Notches (Top and Bottom) */}
            <rect
              x="70"
              y="144"
              width="16"
              height="6"
              fill="#090d16"
              stroke="#38bdf8"
              strokeWidth="1.5"
            />
            <rect
              x="70"
              y="0"
              width="16"
              height="6"
              fill="#090d16"
              stroke="#38bdf8"
              strokeWidth="1.5"
            />

            {/* 5-Tooth Ratchet Indexing Star on Rear Face */}
            <circle cx="-16" cy="75" r="14" fill="#334155" stroke="#f59e0b" strokeWidth="2" />
          </g>

          {/* Cylinder Stop Locking Bolt (Spring-Loaded beneath cylinder at Y = 212) */}
          <g transform={`translate(280, ${210 + boltRetractionY})`}>
            <rect
              x="0"
              y="0"
              width="14"
              height="22"
              fill={isBoltLocked ? "#10b981" : "#f59e0b"}
              stroke={isBoltLocked ? "#34d399" : "#fbbf24"}
              strokeWidth="1.5"
              rx="2"
            />
            <text
              x="-30"
              y="36"
              fill={isBoltLocked ? "#34d399" : "#fbbf24"}
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {isBoltLocked ? "BOLT: LOCKED" : "BOLT: TRIPPED"}
            </text>
          </g>

          {/* Cocking Single-Action Hammer with Hand Pawl (Pivoted at X = 130, Y = 135) */}
          <g transform={`translate(130, 135) rotate(${-cockingAngleDeg})`}>
            {/* Main Hammer Body */}
            <path
              d="M 0 0 L -20 -45 L 8 -80 L 26 -75 L 14 -40 L 18 0 Z"
              fill="#475569"
              stroke="#e2e8f0"
              strokeWidth="2"
            />
            {/* Checkered Thumb Spur */}
            <path d="M 8 -80 L -12 -92 L -6 -98 L 18 -82 Z" fill="#64748b" />
            {/* Striker Nose (Strikes top percussion cap at Y = 85 when angle = 0) */}
            <rect x="22" y="-56" width="22" height="12" fill="#94a3b8" stroke="#e2e8f0" />

            {/* Pivoted Hand Pawl on Hammer Body (Engaging Ratchet Star) */}
            <line x1="12" y1="-25" x2="65" y2="-20" stroke="#f59e0b" strokeWidth="4" />
            <circle cx="12" cy="-25" r="3" fill="#ffffff" />
            <text x="25" y="-30" fill="#f59e0b" fontSize="8" fontFamily="monospace">
              HAND PAWL (CLAIM 1)
            </text>
          </g>

          {/* Paterson Folding Trigger (Drops down when cocked) */}
          <g transform={`translate(160, 200)`}>
            <rect
              x="0"
              y={isFullCock ? 0 : -16}
              width="8"
              height={isFullCock ? 28 : 12}
              fill={isFullCock ? "#f59e0b" : "#475569"}
              stroke="#cbd5e1"
              strokeWidth="1.5"
              rx="2"
            />
            <text x="-40" y="42" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              {isFullCock ? "FOLDING TRIGGER EXTENDED" : "TRIGGER FOLDED"}
            </text>
          </g>

          {/* Creeping Loading Lever Rammer (Aligned with Bottom Chamber at Y = 185) */}
          <g transform="translate(360, 175)">
            <rect x="-15" y="5" width="45" height="16" fill="#64748b" stroke="#94a3b8" />
            <text x="35" y="16" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              LOADING RAMMER PLUNGER
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
