"use client";

import {
  Activity,
  Eye,
  EyeOff,
  Flame,
  Layers,
  RotateCcw,
  Sparkles,
  Target,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FrankenSimEngine } from "@/physics/engine";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import {
  buildColtRevolverModel,
  type ColtRevolverModel,
  updateColtRevolverKinematics,
} from "./coltRevolverModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "cylinder" | "lockwork" | "sightline" | "loading_lever" | "top";

export function ColtRevolver3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { params, updateParam, resetParams } = usePatentPhysics("us-x9430-colt-revolver");

  // Reactive Physics & Mechanical Parameters
  const chamberPressureMpa = params.chamberPressure ?? 85;
  const cockingAngleDeg = params.cockingAngle ?? 45; // 0 (hammer down) to 45 (full cock)
  const rammerPositionPct = params.rammerPosition ?? 0; // 0 (latched under barrel) to 100 (fully rammed)

  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [currentChamberIndex, setCurrentChamberIndex] = useState<number>(1);
  const [isFiring, setIsFiring] = useState<boolean>(false);
  const [showLockworkCutaway, setShowLockworkCutaway] = useState<boolean>(false);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  // Solid Mechanics & Ballistics via FrankenSim Engine
  const coltMech = FrankenSimEngine.stepColtRevolver({
    chamberPressureMpa,
    cockingAngleDeg,
  });

  useFrankenSimPhysics("us-x9430-colt-revolver", {
    domain: "solid_mechanics",
    timestampMs: Date.now(),
    timeStepDt: 0.016,
    refusal: { isRefused: false },
    continuum: {
      tensileStressMpa: coltMech.hoopStressMpa,
      tensileStrainPct: 0,
      elasticModulusGpa: 200,
      crossLinkDensityMolesPerCm3: 0,
      stitchFrequencyHz: 0,
      feedVelocityMmPs: 0,
      buoyancyLiftForceKiloNewtons: 0,
    },
  });

  const hoopStressMpa = coltMech.hoopStressMpa;
  const muzzleVelocityMps = coltMech.muzzleVelocityMps;
  const muzzleEnergyJoules = coltMech.muzzleEnergyJoules;
  const powderGrains = coltMech.powderGrains;
  const isFullCock = coltMech.isLocked;

  const live = useLiveSimParams({
    chamberPressureMpa,
    powderGrains,
    cockingAngleDeg,
    rammerPositionPct,
    currentChamberIndex,
    isFiring,
    showLockworkCutaway,
    isAudioMuted,
    muzzleVelocityMps,
    recoilKick: coltMech.recoilKick,
    hoopStressMpa,
    isLocked: coltMech.isLocked ? 1 : 0,
  });

  const controlsRef = useRef<StudioContext["controls"] | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const fireTimerRef = useRef<number | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (preset) {
      case "iso":
        camera.position.set(4.5, 2.8, 9.5);
        controls.target.set(1.2, 0.0, 0);
        break;
      case "cylinder":
        camera.position.set(0.0, 1.8, 4.2);
        controls.target.set(0.0, 0.2, 0);
        break;
      case "lockwork":
        camera.position.set(-2.2, 0.8, 3.8);
        controls.target.set(-1.8, -0.4, 0);
        break;
      case "sightline":
        camera.position.set(-5.2, 1.38, 0.0);
        controls.target.set(6.0, 1.25, 0.0);
        break;
      case "loading_lever":
        camera.position.set(3.2, -1.8, 4.5);
        controls.target.set(2.0, -0.4, 0);
        break;
      case "top":
        camera.position.set(1.2, 9.5, 0.05);
        controls.target.set(1.2, 0.0, 0);
        break;
    }
    controls.update();
  };

  const handleCockHammer = useCallback(() => {
    updateParam("cockingAngle", 45);
    soundEngine.playMicroswitchClick();
  }, [updateParam]);

  const handleStepChamber = useCallback(() => {
    setCurrentChamberIndex((prev) => (prev % 5) + 1);
    soundEngine.playMicroswitchClick();
  }, []);

  const handlePullTrigger = useCallback(() => {
    if (!isFullCock || isFiring) return;
    setIsFiring(true);
    updateParam("cockingAngle", 0);

    // Gunshot percussion blast & lockwork clack
    soundEngine.playLockstitchClack();

    if (fireTimerRef.current !== null) {
      window.clearTimeout(fireTimerRef.current);
    }
    fireTimerRef.current = window.setTimeout(() => {
      setIsFiring(false);
      setCurrentChamberIndex((prev) => (prev % 5) + 1);
    }, coltMech.cycleDisplayMs);
  }, [isFullCock, isFiring, updateParam, coltMech.cycleDisplayMs]);

  useEffect(() => {
    return () => {
      if (fireTimerRef.current !== null) {
        window.clearTimeout(fireTimerRef.current);
      }
    };
  }, []);

  // 3D Scene Initialization
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [4.5, 2.8, 9.5],
      targetPos: [1.2, 0.0, 0],
      fov: 38,
      isDark: true,
      environmentStyle: "sky",
      enableFloorGrid: true,
      enableClouds: true,
      floorColor: 0x0a0f1d,
      gridColor: 0x1e293b,
      ambientIntensity: 1.5,
      sunIntensity: 2.5,
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Build Museum-Quality Procedural Colt Paterson 1836 Model
    const model: ColtRevolverModel = buildColtRevolverModel();
    scene.add(model.group);

    // Callout Pins & Historical Markers
    const pinGroup = new THREE.Group();
    pinGroup.visible = showCalloutPins;

    const callouts = [
      { pos: [4.8, 0.82, 0], text: "1. Octagonal Rifled Barrel (.36 Caliber)" },
      { pos: [0.0, 0.0, 0], text: "2. 5-Chamber Roll-Engraved Cylinder" },
      { pos: [-2.5, 0.8, 0], text: "3. Single-Action Spur Hammer" },
      { pos: [-2.1, -1.8, 0], text: "4. Paterson Folding Trigger" },
      { pos: [-3.0, -1.8, 0], text: "5. Black Walnut Plowhandle Grip" },
      { pos: [3.5, -0.4, 0], text: "6. Creeping Loading Lever & Rammer" },
      { pos: [2.35, 0.0, 0], text: "7. Transverse Takedown Wedge" },
      { pos: [-1.4, 0.0, 0], text: "8. Recoil Shield & Capping Channel" },
    ];

    for (const c of callouts) {
      const pinAnchor = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 16, 16),
        new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          emissive: 0xd97706,
          emissiveIntensity: 0.5,
          metalness: 0.8,
          roughness: 0.2,
        }),
      );
      pinAnchor.position.set(c.pos[0], c.pos[1], c.pos[2]);
      pinGroup.add(pinAnchor);
    }
    model.group.add(pinGroup);

    // Animation Loop
    let reqId = 0;
    let smokePuffScale = 1.0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const p = live.current;

      updateColtRevolverKinematics(
        model,
        p.cockingAngleDeg,
        p.currentChamberIndex,
        p.rammerPositionPct,
        p.isFiring,
        p.showLockworkCutaway,
      );

      if (p.isFiring) {
        smokePuffScale += 0.12;
        model.smokeMesh.scale.set(smokePuffScale, smokePuffScale, smokePuffScale);

        const kick = p.recoilKick;
        model.group.rotation.z = Math.min(0.24, model.group.rotation.z + kick);
        model.group.position.x = Math.max(-0.4, model.group.position.x - kick * 0.8);
      } else {
        smokePuffScale = 1.0;
        model.smokeMesh.scale.set(1, 1, 1);

        // Return to rest position
        model.group.rotation.z *= 0.85;
        model.group.position.x *= 0.85;
      }

      pinGroup.visible = showCalloutPins;

      controls.update();
      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
      studio.dispose();
    };
  }, [showCalloutPins, live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative min-h-[420px] sm:min-h-[500px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Camera Preset Toolbar (Top-Left) */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-wrap gap-1.5 max-w-[calc(100%-8rem)]">
          {(
            [
              ["iso", "Profile 3D"],
              ["cylinder", "Cylinder"],
              ["lockwork", "Action"],
              ["sightline", "Sightline"],
              ["loading_lever", "Loading Lever"],
              ["top", "Top Plan"],
            ] as [CameraPreset, string][]
          ).map(([preset, label]) => (
            <button
              key={preset}
              type="button"
              onClick={() => applyCameraPreset(preset)}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all border shadow-2xs ${
                activeCamera === preset
                  ? "bg-amber-600 text-white font-bold border-amber-500 shadow-sm"
                  : "bg-white/85 dark:bg-ink-900/85 backdrop-blur-md text-ink-700 dark:text-parchment-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 dark:hover:bg-ink-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Floating View Actions (Top-Right) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowLockworkCutaway(!showLockworkCutaway)}
            className={`p-2 rounded-xl backdrop-blur-md border transition-all ${
              showLockworkCutaway
                ? "bg-amber-600 text-white border-amber-500 shadow-sm"
                : "bg-white/85 dark:bg-ink-900/85 text-ink-700 dark:text-parchment-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 dark:hover:bg-ink-800"
            }`}
            title={
              showLockworkCutaway ? "Hide Internal Lockwork" : "Show Internal Lockwork Cutaway"
            }
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowCalloutPins(!showCalloutPins)}
            className={`p-2 rounded-xl backdrop-blur-md border transition-all ${
              showCalloutPins
                ? "bg-amber-600 text-white border-amber-500 shadow-sm"
                : "bg-white/85 dark:bg-ink-900/85 text-ink-700 dark:text-parchment-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 dark:hover:bg-ink-800"
            }`}
            title={showCalloutPins ? "Hide Part Annotations" : "Show Part Annotations"}
          >
            <Zap className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className="p-2 rounded-xl bg-white/85 dark:bg-ink-900/85 backdrop-blur-md text-ink-700 dark:text-parchment-200 border border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
          >
            {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={resetParams}
            className="p-2 rounded-xl bg-white/85 dark:bg-ink-900/85 backdrop-blur-md text-ink-700 dark:text-parchment-200 border border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Simulation Parameters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={toggleEngine}
            className="p-2 rounded-xl bg-white/85 dark:bg-ink-900/85 backdrop-blur-md text-ink-700 dark:text-parchment-200 border border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isAudioMuted ? "Enable Sound Synthesis" : "Mute Sound"}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Live Telemetry Overlay (Bottom-Left in Canvas) */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex flex-col gap-2 pointer-events-none max-w-xs sm:max-w-sm">
            <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  Chamber #{currentChamberIndex} Ballistics
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    isFullCock
                      ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
                      : cockingAngleDeg > 0
                        ? "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
                        : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300"
                  }`}
                >
                  {isFullCock
                    ? "Locked (Ready)"
                    : cockingAngleDeg > 0
                      ? "Half-Cock"
                      : "Hammer Down"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Hoop Stress:</span>{" "}
                  <span className="font-mono font-bold text-red-600 dark:text-red-400">
                    {hoopStressMpa} MPa
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Velocity:</span>{" "}
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    {muzzleVelocityMps} m/s
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Energy:</span>{" "}
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-300">
                    {muzzleEnergyJoules} J
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Powder:</span>{" "}
                  <span className="font-mono font-bold text-ink-800 dark:text-parchment-200">
                    {powderGrains} gr FFFg
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Bottom Control Deck */}
      <div className="p-4 sm:p-5 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 space-y-4">
        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleCockHammer}
            className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-mono text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Activity className="w-4 h-4" />
            Cock Hammer (45°)
          </button>

          <button
            type="button"
            onClick={handlePullTrigger}
            disabled={!isFullCock || isFiring}
            className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 px-4 py-2.5 font-mono text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer ${
              isFullCock && !isFiring
                ? "bg-red-600 hover:bg-red-700 active:scale-98 text-white ring-2 ring-red-400/50 animate-pulse"
                : "bg-parchment-300 dark:bg-ink-800 text-ink-400 dark:text-ink-600 cursor-not-allowed border border-parchment-400 dark:border-ink-700"
            }`}
          >
            <Flame className="w-4 h-4" />
            {isFiring ? "Discharging..." : "Pull Trigger (Fire)"}
          </button>

          <button
            type="button"
            onClick={handleStepChamber}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 font-mono text-xs sm:text-sm font-medium rounded-xl border border-parchment-300 dark:border-ink-700 transition-colors cursor-pointer"
            title="Step Cylinder 72° to Next Chamber"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Rotate Cylinder
          </button>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Chamber Pressure Slider */}
          <div className="space-y-1.5 bg-white/70 dark:bg-ink-950/60 p-3 rounded-xl border border-parchment-300 dark:border-ink-800">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-ink-700 dark:text-parchment-300 font-medium">
                Powder / Pressure
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {chamberPressureMpa} MPa ({powderGrains} gr)
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="140"
              step="5"
              value={chamberPressureMpa}
              onChange={(e) => updateParam("chamberPressure", Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer h-1.5 bg-parchment-200 dark:bg-ink-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-ink-500 font-mono">
              <span>15 gr (Light)</span>
              <span>45 gr (Proof)</span>
            </div>
          </div>

          {/* Hammer Cocking Angle Slider */}
          <div className="space-y-1.5 bg-white/70 dark:bg-ink-950/60 p-3 rounded-xl border border-parchment-300 dark:border-ink-800">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-ink-700 dark:text-parchment-300 font-medium">
                Hammer Cocking Angle
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {cockingAngleDeg}° / 45°
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="45"
              step="1"
              value={cockingAngleDeg}
              onChange={(e) => updateParam("cockingAngle", Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer h-1.5 bg-parchment-200 dark:bg-ink-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-ink-500 font-mono">
              <span>0° (At Rest)</span>
              <span>45° (Full Cock)</span>
            </div>
          </div>

          {/* Loading Lever Rammer Slider */}
          <div className="space-y-1.5 bg-white/70 dark:bg-ink-950/60 p-3 rounded-xl border border-parchment-300 dark:border-ink-800">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-ink-700 dark:text-parchment-300 font-medium">
                Loading Lever Rammer
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {rammerPositionPct}% Rammed
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="2"
              value={rammerPositionPct}
              onChange={(e) => updateParam("rammerPosition", Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer h-1.5 bg-parchment-200 dark:bg-ink-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-ink-500 font-mono">
              <span>Latched (0%)</span>
              <span>Seated (100%)</span>
            </div>
          </div>
        </div>

        {/* Footer Attribution Banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] font-sans text-ink-600 dark:text-ink-400 border-t border-parchment-200 dark:border-ink-800/80">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>
              Samuel Colt (US X9430 · 1836) — 5-Chamber Indexing Percussion Revolver Mechanism
            </span>
          </span>
          <span className="font-mono text-[10px] text-amber-700 dark:text-amber-400">
            FrankenSim Solid Mechanics Core
          </span>
        </div>
      </div>
    </div>
  );
}
