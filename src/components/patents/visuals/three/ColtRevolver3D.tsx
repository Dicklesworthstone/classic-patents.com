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
import { type FocusEvent, useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "@/components/patents/visuals/PortHamiltonianEnergyStrip";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { coltNextChamber } from "@/physics/catalogKernels";
import { FrankenSimEngine } from "@/physics/engine";
import { ensureGenericWasm } from "@/physics/genericWasm";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { type ColtRevolverCameraPreset, coltRevolverCameraForViewport } from "./coltRevolverCamera";
import {
  buildColtRevolverModel,
  type ColtRevolverModel,
  updateColtRevolverKinematics,
} from "./coltRevolverModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

/**
 * Keep a keyboard-focused phone control in the lower safe viewing lane.
 * Native range focus otherwise stops with the museum masthead across the
 * remaining visible strip of the canvas. This is Colt-local: it leaves the
 * shared sticky header and the action row's own sticky behavior alone.
 */
function keepFocusedPhoneControlClear(event: FocusEvent<HTMLElement>) {
  const target = event.target;
  const isRange = target instanceof HTMLInputElement && target.type === "range";
  const isClaimToggle =
    target instanceof HTMLButtonElement &&
    target.closest('[data-testid="claim-constraint-toggle"]') !== null;
  if (!isRange && !isClaimToggle) return;
  if (!window.matchMedia("(max-width: 639px)").matches) return;

  // Focusing a claim chip happens during pointer activation. Moving the page
  // in that focus phase can relocate the pointer before its click dispatches,
  // so wait for the next paint while retaining keyboard-focus clearance.
  window.requestAnimationFrame(() => {
    if (!target.isConnected || document.activeElement !== target) return;
    target.scrollIntoView({ block: "end", inline: "nearest", behavior: "instant" });
  });
}

export function ColtRevolver3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const { params, updateParam, resetParams } = usePatentPhysics("us-x9430-colt-revolver");

  // Reactive Physics & Mechanical Parameters
  const chamberPressureMpa = Number(params.chamberPressure ?? 85);
  const cockingAngleDeg = Number(params.cockingAngle ?? 45); // 0 (hammer down) to 45 (full cock)
  const rammerPositionPct = Number(params.rammerPosition ?? 0); // 0 (latched) to 100 (seated)
  const currentChamberIndex = Math.max(1, Math.round(Number(params.chamberIndex ?? 1)));

  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isFiring, setIsFiring] = useState<boolean>(false);
  const [showLockworkCutaway, setShowLockworkCutaway] = useState<boolean>(false);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<ColtRevolverCameraPreset>("iso");
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true, 2: true });
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  useEffect(() => {
    void ensureGenericWasm();
  }, []);

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
    showCalloutPins,
    isAudioMuted,
    muzzleVelocityMps,
    recoilKick: coltMech.recoilKick,
    recoilKickX: coltMech.recoilKickX,
    hoopStressMpa,
    isLocked: coltMech.isLocked ? 1 : 0,
  });

  const animRef = useRef({
    visualCockingAngle: cockingAngleDeg,
    visualCylinderAngle: -((currentChamberIndex - 1) * 2 * Math.PI) / 5,
    visualRammerPct: rammerPositionPct,
    isFiringSeq: false,
    firingProgress: 0,
    recoilZ: 0,
    recoilX: 0,
  });
  const firingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (firingTimeoutRef.current !== null) {
        window.clearTimeout(firingTimeoutRef.current);
        firingTimeoutRef.current = null;
      }
    };
  }, []);

  const applyCameraPreset = (preset: ColtRevolverCameraPreset) => {
    setActiveCamera(preset);
    const container = containerRef.current;
    const cfg = coltRevolverCameraForViewport(
      preset,
      container?.clientWidth ?? window.innerWidth,
      container?.clientHeight ?? window.innerHeight,
    );
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const handleCockHammer = useCallback(() => {
    updateParam("cockingAngle", 45);
    soundEngine.playMicroswitchClick();
  }, [updateParam]);

  const handleStepChamber = useCallback(() => {
    const nextIdx = coltNextChamber(currentChamberIndex, coltMech.chamberCount);
    updateParam("chamberIndex", nextIdx);
    animRef.current.visualCylinderAngle = -((nextIdx - 1) * 2 * Math.PI) / 5;
    soundEngine.playMicroswitchClick();
  }, [updateParam, currentChamberIndex, coltMech.chamberCount]);

  const handleRamChamber = useCallback(() => {
    updateParam("rammerPosition", rammerPositionPct > 50 ? 0 : 100);
    soundEngine.playSwitchClick();
  }, [updateParam, rammerPositionPct]);

  const handlePullTrigger = useCallback(() => {
    if (!isFullCock || isFiring) return;
    if (firingTimeoutRef.current !== null) {
      window.clearTimeout(firingTimeoutRef.current);
    }
    setIsFiring(true);
    animRef.current.isFiringSeq = true;
    animRef.current.firingProgress = 0;

    // Gunshot percussion blast & lockwork clack
    soundEngine.playLockstitchClack();

    // Trigger impulse
    const kick = coltMech.recoilKick;
    const kickX = coltMech.recoilKickX;
    animRef.current.recoilZ = Math.min(0.22, kick * 1.5);
    animRef.current.recoilX = Math.max(-0.4, -kickX * 1.8);

    firingTimeoutRef.current = window.setTimeout(() => {
      firingTimeoutRef.current = null;
      setIsFiring(false);
      animRef.current.isFiringSeq = false;
      const nextChamber = coltNextChamber(currentChamberIndex, coltMech.chamberCount);
      updateParam("cockingAngle", 0);
      updateParam("chamberIndex", nextChamber);
      animRef.current.visualCockingAngle = 0;
      animRef.current.visualCylinderAngle = -((nextChamber - 1) * 2 * Math.PI) / 5;
    }, 450);
  }, [
    isFullCock,
    isFiring,
    updateParam,
    currentChamberIndex,
    coltMech.chamberCount,
    coltMech.recoilKick,
    coltMech.recoilKickX,
  ]);

  // 3D Scene Initialization
  // The mounted scene reads the stable, layout-effect-synchronized live ref so toggling visual controls never destroys and flashes the WebGL canvas.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const iso = coltRevolverCameraForViewport("iso", container.clientWidth, container.clientHeight);
    const studio = createThreeStudioScene({
      container,
      cameraPos: iso.pos,
      targetPos: iso.target,
      fov: 38,
      enableFloorGrid: true,
      enableClouds: true,
    });
    studioRef.current = studio;

    const { scene, camera, renderer, controls } = studio;

    // Build Museum-Quality Procedural Colt Paterson 1836 Model
    const model: ColtRevolverModel = buildColtRevolverModel();
    scene.add(model.group);

    // Callout Pins & Historical Markers
    const pinGroup = new THREE.Group();
    pinGroup.visible = live.current.showCalloutPins;

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

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const p = live.current;
      const anim = animRef.current;

      // Smooth kinematic interpolation
      if (anim.isFiringSeq) {
        anim.firingProgress = Math.min(1.0, anim.firingProgress + 0.035);
        // Hammer strikes forward rapidly from 45° to 0°
        anim.visualCockingAngle = Math.max(0, 45 * (1.0 - anim.firingProgress * 2.5));
      } else {
        // Smoothly follow cocking slider
        const diff = p.cockingAngleDeg - anim.visualCockingAngle;
        anim.visualCockingAngle += diff * 0.22;

        // Smoothly track target cylinder angle
        const targetCyl = -((p.currentChamberIndex - 1) * 2 * Math.PI) / 5;
        const targetWithCock = targetCyl - (anim.visualCockingAngle / 45) * ((2 * Math.PI) / 5);
        const cylDiff = targetWithCock - anim.visualCylinderAngle;
        anim.visualCylinderAngle += cylDiff * 0.2;
      }

      // Smoothly track rammer
      const rammerDiff = p.rammerPositionPct - anim.visualRammerPct;
      anim.visualRammerPct += rammerDiff * 0.2;

      // Update Kinematics on Three.js Model
      updateColtRevolverKinematics(
        model,
        anim.visualCockingAngle,
        p.currentChamberIndex,
        anim.visualRammerPct,
        anim.isFiringSeq,
        p.showLockworkCutaway,
        anim.firingProgress,
        anim.visualCylinderAngle,
      );

      // Recoil Damping
      if (anim.isFiringSeq) {
        model.group.rotation.z = anim.recoilZ;
        model.group.position.x = anim.recoilX;
        anim.recoilZ *= 0.88;
        anim.recoilX *= 0.88;
      } else {
        model.group.rotation.z *= 0.82;
        model.group.position.x *= 0.82;
      }

      pinGroup.visible = p.showCalloutPins;

      controls.update();
      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
      studio.dispose();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-clip border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Samuel Colt Revolving Gun Paterson 3D</div>
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative min-h-[420px] sm:min-h-[500px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Camera Preset Toolbar (Top-Left) */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none gap-1 sm:gap-1.5 max-w-[calc(100%-14rem)] sm:max-w-[calc(100%-24rem)] p-1 sm:p-1.5 rounded-xl bg-white/85 dark:bg-ink-900/85 backdrop-blur-md border border-parchment-300 dark:border-ink-700 shadow-sm">
            {(
              [
                ["iso", "Profile 3D"],
                ["cylinder", "Cylinder"],
                ["lockwork", "Action"],
                ["sightline", "Sightline"],
                ["loading_lever", "Loading Lever"],
                ["top", "Top Plan"],
              ] as [ColtRevolverCameraPreset, string][]
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyCameraPreset(preset)}
                className={`min-h-9 px-2.5 py-1 text-xs font-mono rounded-lg shrink-0 whitespace-nowrap transition-colors border shadow-2xs ${
                  activeCamera === preset
                    ? "bg-amber-600 text-white font-bold border-amber-500 shadow-sm"
                    : "text-ink-700 dark:text-parchment-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Floating View Actions (Top-Right) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowLockworkCutaway(!showLockworkCutaway)}
            className={`p-2 rounded-xl backdrop-blur-md border transition-colors ${
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
            className={`p-2 rounded-xl backdrop-blur-md border transition-colors ${
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

        {/* Bottom SI Telemetry Chip Strip */}
        <StudioKernelChips
          side="right"
          visible={showUiOverlay}
          title="REVOLVING CYLINDER INTERNAL BALLISTICS"
          chips={[
            {
              label: "v_muzzle",
              value: `${muzzleVelocityMps.toFixed(0)}`,
              unit: "m/s",
              tone: "hot",
            },
            {
              label: "E_muzzle",
              value: `${muzzleEnergyJoules.toFixed(0)}`,
              unit: "J",
            },
            {
              label: "P_chamber",
              value: `${chamberPressureMpa.toFixed(0)}`,
              unit: "MPa",
            },
            {
              label: "Hoop Stress",
              value: `${hoopStressMpa.toFixed(0)}`,
              unit: "MPa",
            },
            {
              label: "Powder Charge",
              value: `${powderGrains.toFixed(0)}`,
              unit: "grains FFFg",
            },
            { label: "Cylinder", value: `Chamber ${currentChamberIndex} / 5` },
            {
              label: "Lockwork",
              value: isFullCock ? "Locked Full Cock" : `${cockingAngleDeg.toFixed(0)}° Rotating`,
            },
          ]}
        />
      </div>

      {/* Interactive Bottom Control Deck */}
      <div
        className="p-4 sm:p-5 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 space-y-4 max-sm:[&_input[type=range]]:scroll-mb-[calc(4rem+env(safe-area-inset-top))]"
        onFocusCapture={keepFocusedPhoneControlClear}
      >
        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-2.5 bg-parchment-100/95 dark:bg-ink-900/95 max-sm:sticky max-sm:top-[calc(4rem+env(safe-area-inset-top))] max-sm:z-20 max-sm:py-2">
          <button
            type="button"
            onClick={handleCockHammer}
            className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-mono text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-[background-color,transform] cursor-pointer"
          >
            <Activity className="w-4 h-4" />
            Cock Hammer (45°)
          </button>

          <button
            type="button"
            onClick={handlePullTrigger}
            disabled={!isFullCock || isFiring}
            className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 px-4 py-2.5 font-mono text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-[background-color,color,border-color,transform] cursor-pointer ${
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

          <button
            type="button"
            onClick={handleRamChamber}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 font-mono text-xs sm:text-sm font-medium rounded-xl border border-parchment-300 dark:border-ink-700 transition-colors cursor-pointer"
            title="Toggle Creeping Loading Lever Rammer"
          >
            <Target className="w-3.5 h-3.5" />
            Ram Chamber
          </button>
        </div>

        {/* Sensitivity Sliders Grid */}
        <div className="grid grid-cols-1 gap-4 pt-1 max-sm:[&_input[type=range]]:scroll-mt-72 md:grid-cols-3">
          <SensitivitySlider
            id="us-x9430-colt-revolver-chamberpressure"
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
            id="us-x9430-colt-revolver-cockingangle"
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
            id="us-x9430-colt-revolver-rammerposition"
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
          className="mt-2 max-sm:[&_button]:scroll-mt-72 max-sm:[&_button]:scroll-mb-[calc(4rem+env(safe-area-inset-top))]"
        />

        {/* Port-Hamiltonian Dirac Energy Strip */}
        <PortHamiltonianEnergyStrip
          patentId="us-x9430-colt-revolver"
          params={params}
          className="mt-3"
        />

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
