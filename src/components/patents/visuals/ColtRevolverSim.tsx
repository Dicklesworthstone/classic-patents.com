"use client";

import {
  Activity,
  CheckCircle2,
  Disc,
  Flame,
  Layers,
  RotateCcw,
  Sparkles,
  Target,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "@/components/patents/visuals/PortHamiltonianEnergyStrip";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { coltNextChamber } from "@/physics/catalogKernels";
import { FrankenSimEngine } from "@/physics/engine";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";

export function ColtRevolverSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-x9430-colt-revolver");
  const { isAudioMuted, toggleSound } = usePatentAudio();

  const chamberPressureMpa = Number(params.chamberPressure ?? 85);
  const cockingAngleDeg = Number(params.cockingAngle ?? 45); // 0 (hammer down) to 45 (full cock)
  const rammerPositionPct = Number(params.rammerPosition ?? 0); // 0 to 100%

  const [currentChamberIndex, setCurrentChamberIndex] = useState<number>(1);
  const [isFiring, setIsFiring] = useState<boolean>(false);
  const [bulletFlightPct, setBulletFlightPct] = useState<number>(0);
  const [chamberStatus, setChamberStatus] = useState<Record<number, "loaded" | "fired" | "empty">>({
    1: "loaded",
    2: "loaded",
    3: "loaded",
    4: "loaded",
    5: "loaded",
  });
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true, 2: true });
  const [activeDiagramTab, setActiveDiagramTab] = useState<"cutaway" | "cylinder-face" | "dual">(
    "dual",
  );

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
  const powderGrains = colt.powderGrains;

  const animFrameRef = useRef<number | null>(null);
  const fireTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (fireTimerRef.current !== null) {
        window.clearTimeout(fireTimerRef.current);
      }
      if (animFrameRef.current !== null) {
        window.cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const handleCockHammer = useCallback(() => {
    updateParam("cockingAngle", 45);
    soundEngine.playMicroswitchClick();
  }, [updateParam]);

  const handleStepChamber = useCallback(() => {
    setCurrentChamberIndex((prev) => coltNextChamber(prev, colt.chamberCount));
    soundEngine.playMicroswitchClick();
  }, [colt.chamberCount]);

  const handleReloadAll = useCallback(() => {
    setChamberStatus({
      1: "loaded",
      2: "loaded",
      3: "loaded",
      4: "loaded",
      5: "loaded",
    });
    soundEngine.playSwitchClick();
  }, []);

  const handleRamChamber = useCallback(() => {
    const nextPct = rammerPositionPct > 50 ? 0 : 100;
    updateParam("rammerPosition", nextPct);
    if (nextPct === 100) {
      // Ram bottom chamber (Chamber #4 or current bottom)
      soundEngine.playSwitchClick();
    }
  }, [updateParam, rammerPositionPct]);

  const handlePullTrigger = useCallback(() => {
    if (!isFullCock || isFiring) return;
    setIsFiring(true);
    updateParam("cockingAngle", 0);

    // Gunshot percussion blast & lockwork clack
    soundEngine.playLockstitchClack();

    // Mark current chamber as fired
    setChamberStatus((prev) => ({ ...prev, [currentChamberIndex]: "fired" }));

    // Animate bullet flight
    const startTime = Date.now();
    const flightDuration = 180; // ms

    const animateBullet = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1.0, elapsed / flightDuration);
      setBulletFlightPct(progress);
      if (progress < 1.0) {
        animFrameRef.current = window.requestAnimationFrame(animateBullet);
      }
    };
    animFrameRef.current = window.requestAnimationFrame(animateBullet);

    if (fireTimerRef.current !== null) {
      window.clearTimeout(fireTimerRef.current);
    }
    fireTimerRef.current = window.setTimeout(() => {
      setIsFiring(false);
      setBulletFlightPct(0);
      setCurrentChamberIndex((prev) => coltNextChamber(prev, colt.chamberCount));
    }, 450);
  }, [isFullCock, isFiring, updateParam, currentChamberIndex, colt.chamberCount]);

  // Cylinder End-On Angle: advances 72° per chamber
  const faceAngleDeg = -((currentChamberIndex - 1) * 72) - (cockingAngleDeg / 45) * 72;

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
            Draw the hammer to full cock (45°) to observe the mechanical hand pawl advance the
            5-chamber cylinder exactly 72° while the locking bolt engages positive alignment.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end lg:self-auto">
          {/* View Tab Selector */}
          <div className="flex items-center bg-parchment-200/80 dark:bg-ink-800/80 rounded-lg p-0.5 border border-parchment-300 dark:border-ink-700">
            <button
              type="button"
              onClick={() => setActiveDiagramTab("dual")}
              className={`px-2 py-1 text-xs font-mono rounded-md transition-colors ${
                activeDiagramTab === "dual"
                  ? "bg-white dark:bg-ink-900 text-amber-700 dark:text-amber-400 font-bold shadow-2xs"
                  : "text-ink-600 dark:text-parchment-300 hover:text-ink-900"
              }`}
            >
              Dual View
            </button>
            <button
              type="button"
              onClick={() => setActiveDiagramTab("cutaway")}
              className={`px-2 py-1 text-xs font-mono rounded-md transition-colors ${
                activeDiagramTab === "cutaway"
                  ? "bg-white dark:bg-ink-900 text-amber-700 dark:text-amber-400 font-bold shadow-2xs"
                  : "text-ink-600 dark:text-parchment-300 hover:text-ink-900"
              }`}
            >
              Cutaway
            </button>
            <button
              type="button"
              onClick={() => setActiveDiagramTab("cylinder-face")}
              className={`px-2 py-1 text-xs font-mono rounded-md transition-colors ${
                activeDiagramTab === "cylinder-face"
                  ? "bg-white dark:bg-ink-900 text-amber-700 dark:text-amber-400 font-bold shadow-2xs"
                  : "text-ink-600 dark:text-parchment-300 hover:text-ink-900"
              }`}
            >
              5-Chamber Face
            </button>
          </div>

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
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold text-white transition-all shadow-sm cursor-pointer ${
              isFullCock && !isFiring
                ? "bg-amber-600 hover:bg-amber-700 ring-2 ring-amber-400/50"
                : "bg-amber-800/40 text-amber-200/40 cursor-not-allowed"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>2. Pull Trigger</span>
          </button>
          <button
            type="button"
            onClick={handleReloadAll}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-xs font-mono text-ink-700 dark:text-parchment-300 transition-colors cursor-pointer"
            title="Reload All 5 Chambers with Powder & Ball"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Reload</span>
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
      <div className="relative bg-canvas rounded-2xl border border-parchment-300 dark:border-ink-800 p-4 sm:p-6 flex flex-col items-center justify-center min-h-[380px] overflow-hidden select-none">
        {/* Blueprint Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:20px_20px] opacity-35 pointer-events-none" />

        {/* Firing Status Banner */}
        {isFiring && (
          <div className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-amber-950/90 border border-amber-500 rounded-lg text-amber-300 text-xs font-mono flex items-center gap-2 animate-pulse shadow-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>
              CHAMBER #{currentChamberIndex} DISCHARGE: {muzzleVelocityMps} m/s | Energy:{" "}
              {muzzleEnergyJoules} J | Hoop Stress: {hoopStressMpa} MPa | Index:{" "}
              {cylinderRotationAngle}°
            </span>
          </div>
        )}

        {/* Main Diagrams Container */}
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 relative z-10">
          {/* 1. SIDE ELEVATION MECHANICAL CUTAWAY */}
          {(activeDiagramTab === "cutaway" || activeDiagramTab === "dual") && (
            <div className="flex-1 w-full max-w-xl">
              <div className="text-[11px] font-mono font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>FIG. 1: LONGITUDINAL ACTION & BARREL CUTAWAY</span>
              </div>
              <svg viewBox="0 0 600 320" className="w-full h-auto">
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

                  {/* 7-Groove Spiral Rifling Lands */}
                  <line
                    x1="20"
                    y1="16"
                    x2="70"
                    y2="24"
                    stroke="#38bdf8"
                    strokeWidth="1"
                    opacity="0.6"
                  />
                  <line
                    x1="80"
                    y1="16"
                    x2="130"
                    y2="24"
                    stroke="#38bdf8"
                    strokeWidth="1"
                    opacity="0.6"
                  />
                  <line
                    x1="140"
                    y1="16"
                    x2="190"
                    y2="24"
                    stroke="#38bdf8"
                    strokeWidth="1"
                    opacity="0.6"
                  />

                  <text x="45" y="14" fill="#94a3b8" fontSize="9" fontFamily="monospace">
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

                  {/* Animated Flying Bullet (.36 Lead Round Ball) */}
                  {bulletFlightPct > 0 && (
                    <g transform={`translate(${bulletFlightPct * 260}, 20)`}>
                      <circle cx="0" cy="0" r="7" fill="#e2e8f0" stroke="#94a3b8" />
                      <line x1="-15" y1="0" x2="-8" y2="0" stroke="#f59e0b" strokeWidth="2" />
                    </g>
                  )}

                  {/* Muzzle Flash & Flame Blast */}
                  {isFiring && (
                    <g transform="translate(220, 20)">
                      <polygon
                        points="0,-22 65,-10 38,0 80,8 32,16 60,26 0,18"
                        fill="#f59e0b"
                        opacity="0.95"
                      />
                      <circle cx="20" cy="0" r="20" fill="#fef08a" opacity="0.9" />
                      <circle cx="5" cy="0" r="10" fill="#ffffff" />
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

                {/* Revolving 5-Chamber Cylinder Body (Center Y = 135) */}
                <g transform="translate(210, 60)">
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
                    fill={isFiring ? "#7c2d12" : "#0a0f1d"}
                    stroke={isFiring ? "#ea580c" : "#475569"}
                    strokeWidth="1.5"
                  />
                  {/* Lead Round Ball (Seated at front) */}
                  {chamberStatus[currentChamberIndex] === "loaded" && !isFiring && (
                    <circle cx="125" cy="25" r="8" fill="#94a3b8" />
                  )}
                  {/* Black Powder Charge */}
                  {chamberStatus[currentChamberIndex] === "loaded" && (
                    <rect
                      x="25"
                      y="16"
                      width="90"
                      height="18"
                      fill={isFiring ? "#f97316" : "#1e293b"}
                    />
                  )}
                  <text x="35" y="28" fill="#f59e0b" fontSize="8" fontFamily="monospace">
                    {chamberStatus[currentChamberIndex] === "fired"
                      ? "SPENT CHAMBER"
                      : `POWDER (${powderGrains} GR FFFg)`}
                  </text>

                  {/* Top Percussion Nipple & Flash Partition Wall (Claim 3) */}
                  <rect
                    x="-10"
                    y="20"
                    width="10"
                    height="10"
                    fill={isFiring ? "#ffffff" : "#f59e0b"}
                  />
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
                    fill="#0a0f1d"
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
                    fill="#0a0f1d"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="70"
                    y="0"
                    width="16"
                    height="6"
                    fill="#0a0f1d"
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
                  <path
                    d="M 0 0 L -20 -45 L 8 -80 L 26 -75 L 14 -40 L 18 0 Z"
                    fill="#475569"
                    stroke="#e2e8f0"
                    strokeWidth="2"
                  />
                  <path d="M 8 -80 L -12 -92 L -6 -98 L 18 -82 Z" fill="#64748b" />
                  <rect x="22" y="-56" width="22" height="12" fill="#94a3b8" stroke="#e2e8f0" />

                  {/* Pivoted Hand Pawl on Hammer Body (Engaging Ratchet Star) */}
                  <line x1="12" y1="-25" x2="65" y2="-20" stroke="#f59e0b" strokeWidth="4" />
                  <circle cx="12" cy="-25" r="3" fill="#ffffff" />
                  <text x="25" y="-30" fill="#f59e0b" fontSize="8" fontFamily="monospace">
                    HAND PAWL (CLAIM 1)
                  </text>
                </g>

                {/* Paterson Folding Trigger (Drops down when cocked) */}
                <g transform="translate(160, 200)">
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
                  <rect
                    x={-15 - (rammerPositionPct / 100) * 45}
                    y="5"
                    width="45"
                    height="16"
                    fill="#64748b"
                    stroke="#94a3b8"
                  />
                  <text x="35" y="16" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                    CREEPING RAMMER PLUNGER
                  </text>
                </g>
              </svg>
            </div>
          )}

          {/* 2. ROTATING 5-CHAMBER CYLINDER FACE CROSS-SECTION */}
          {(activeDiagramTab === "cylinder-face" || activeDiagramTab === "dual") && (
            <div className="flex-initial w-full max-w-[280px] bg-slate-900/80 p-4 rounded-xl border border-slate-700/80 flex flex-col items-center">
              <div className="text-[11px] font-mono font-bold text-amber-400 mb-2 flex items-center gap-1.5 self-start">
                <Disc className="w-3.5 h-3.5" />
                <span>FIG. 2: 5-CHAMBER DRUM FACE (END VIEW)</span>
              </div>

              {/* Rotating Cylinder Wheel SVG */}
              <svg viewBox="0 0 240 240" className="w-48 h-48 sm:w-56 sm:h-56">
                <defs>
                  <radialGradient id="cylSteelGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="85%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </radialGradient>
                </defs>

                {/* Top Alignment Pointer Marker (12 o'clock Barrel Bore) */}
                <polygon points="120,4 125,18 115,18" fill="#f59e0b" />
                <text
                  x="120"
                  y="28"
                  fill="#f59e0b"
                  fontSize="8"
                  fontFamily="monospace"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  BARREL AXIS
                </text>

                {/* Rotating Cylinder Group */}
                <g transform={`translate(120, 120) rotate(${faceAngleDeg})`}>
                  {/* Outer Drum Rim */}
                  <circle
                    cx="0"
                    cy="0"
                    r="82"
                    fill="url(#cylSteelGrad)"
                    stroke="#cbd5e1"
                    strokeWidth="2.5"
                  />

                  {/* 5 Radial Flash-Barrier Partition Walls (Colt Claim 3) */}
                  {[0, 1, 2, 3, 4].map((i) => {
                    const angle = i * 72 + 36;
                    const rad = (angle * Math.PI) / 180;
                    const x1 = Math.sin(rad) * 25;
                    const y1 = -Math.cos(rad) * 25;
                    const x2 = Math.sin(rad) * 80;
                    const y2 = -Math.cos(rad) * 80;
                    return (
                      <line
                        key={`part-${i}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#94a3b8"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    );
                  })}

                  {/* 5 Powder Chambers (.36 Caliber Bores) */}
                  {[1, 2, 3, 4, 5].map((chNum) => {
                    const angle = (chNum - 1) * 72;
                    const rad = (angle * Math.PI) / 180;
                    const cx = Math.sin(rad) * 52;
                    const cy = -Math.cos(rad) * 52;
                    const status = chamberStatus[chNum];
                    const isBattery = chNum === currentChamberIndex;

                    return (
                      <g key={`chamber-${chNum}`} transform={`translate(${cx}, ${cy})`}>
                        {/* Outer Chamber Bore */}
                        <circle
                          cx="0"
                          cy="0"
                          r="18"
                          fill={
                            status === "fired"
                              ? "#1e293b"
                              : status === "loaded"
                                ? "#0f172a"
                                : "#0a0f1d"
                          }
                          stroke={
                            isBattery ? "#f59e0b" : status === "loaded" ? "#38bdf8" : "#64748b"
                          }
                          strokeWidth={isBattery ? 3 : 1.5}
                        />
                        {/* Seated Lead Ball */}
                        {status === "loaded" && (
                          <circle
                            cx="0"
                            cy="0"
                            r="10"
                            fill="#94a3b8"
                            stroke="#cbd5e1"
                            strokeWidth="1"
                          />
                        )}
                        {/* Threaded Percussion Nipple / Primer Core */}
                        <circle
                          cx="0"
                          cy="0"
                          r="4"
                          fill={status === "loaded" ? "#d97706" : "#475569"}
                        />

                        {/* Chamber Label */}
                        <text
                          x="0"
                          y="3"
                          fill={isBattery ? "#fef08a" : "#cbd5e1"}
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {chNum}
                        </text>
                      </g>
                    );
                  })}

                  {/* Central Arbor Pin Bore & 5-Tooth Ratchet Star */}
                  <circle cx="0" cy="0" r="22" fill="#0a0f1d" stroke="#475569" strokeWidth="2" />
                  <circle cx="0" cy="0" r="10" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
                </g>
              </svg>

              {/* Chamber Status Badges */}
              <div className="w-full grid grid-cols-5 gap-1 mt-2 text-[10px] font-mono text-center">
                {[1, 2, 3, 4, 5].map((num) => {
                  const status = chamberStatus[num];
                  const isCurrent = num === currentChamberIndex;
                  return (
                    <div
                      key={`badge-${num}`}
                      className={`p-1 rounded flex flex-col items-center ${
                        isCurrent
                          ? "bg-amber-500/20 border border-amber-400 text-amber-300 font-bold"
                          : status === "loaded"
                            ? "bg-emerald-950/40 border border-emerald-800 text-emerald-300"
                            : "bg-slate-800 border border-slate-700 text-slate-400"
                      }`}
                    >
                      <span>#{num}</span>
                      <span className="text-[8px] uppercase">{status}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Controls & Parameter Sliders */}
      <div className="p-4 sm:p-5 bg-parchment-100/90 dark:bg-ink-900/90 border border-parchment-300 dark:border-ink-800 rounded-xl space-y-4">
        {/* Buttons Row */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleCockHammer}
            className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-mono text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5" />
            1. Cock (45°)
          </button>
          <button
            type="button"
            onClick={handlePullTrigger}
            disabled={!isFullCock || isFiring}
            className={`flex-1 min-w-[140px] flex items-center justify-center gap-1.5 px-3.5 py-2 font-mono text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer ${
              isFullCock && !isFiring
                ? "bg-red-600 hover:bg-red-700 active:scale-98 text-white ring-2 ring-red-400/50"
                : "bg-parchment-300 dark:bg-ink-800 text-ink-400 dark:text-ink-600 cursor-not-allowed border border-parchment-400 dark:border-ink-700"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            2. Pull Trigger
          </button>
          <button
            type="button"
            onClick={handleStepChamber}
            className="flex items-center justify-center gap-1 px-3 py-2 bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 font-mono text-xs rounded-lg border border-parchment-300 dark:border-ink-700 transition-colors cursor-pointer"
            title="Step Cylinder 72°"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Rotate Cylinder
          </button>
          <button
            type="button"
            onClick={handleRamChamber}
            className="flex items-center justify-center gap-1 px-3 py-2 bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 font-mono text-xs rounded-lg border border-parchment-300 dark:border-ink-700 transition-colors cursor-pointer"
            title="Ram Lead Ball into Bottom Chamber"
          >
            <Target className="w-3.5 h-3.5" />
            Ram Chamber
          </button>
        </div>

        {/* Sensitivity Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <SensitivitySlider
            id="us-x9430-colt-revolver-sim-chamberpressure"
            patentId="us-x9430-colt-revolver"
            paramKey="chamberPressure"
            label="Chamber Pressure / Powder"
            value={chamberPressureMpa}
            min={40}
            max={140}
            step={5}
            unit="MPa"
            onChange={(val) => updateParam("chamberPressure", val)}
            allParams={params}
          />
          <SensitivitySlider
            id="us-x9430-colt-revolver-sim-cockingangle"
            patentId="us-x9430-colt-revolver"
            paramKey="cockingAngle"
            label="Hammer Cocking Angle"
            value={cockingAngleDeg}
            min={0}
            max={45}
            step={1}
            unit="deg"
            onChange={(val) => updateParam("cockingAngle", val)}
            allParams={params}
          />
          <SensitivitySlider
            id="us-x9430-colt-revolver-sim-rammerposition"
            patentId="us-x9430-colt-revolver"
            paramKey="rammerPosition"
            label="Loading Lever Rammer"
            value={rammerPositionPct}
            min={0}
            max={100}
            step={2}
            unit="%"
            onChange={(val) => updateParam("rammerPosition", val)}
            allParams={params}
          />
        </div>

        {/* Claim Inversion Failure Modes */}
        <ClaimConstraintToggle
          patentId="us-x9430-colt-revolver"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        {/* Port-Hamiltonian Dirac Energy Strip */}
        <PortHamiltonianEnergyStrip
          patentId="us-x9430-colt-revolver"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
}
