"use client";

import { Flame, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FrankenSimEngine } from "@/physics/engine";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildMaximMachineGunModel, type MaximMachineGunModel } from "./maximMachineGunModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "toggle_lock" | "water_jacket" | "belt_feed" | "spade_grips" | "top";

export function MaximMachineGun3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Automatic Recoil Ballistics Parameters
  const { params } = usePatentPhysics("us-319596-maxim-machine-gun");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const fireRateRpm = params.firingRate ?? params.fireRateRpm ?? 600;
  const waterLevelLiters = params.waterLevel ?? 4;
  const recoilStrokeMm = params.recoilStroke ?? 19;

  const maxim = FrankenSimEngine.stepMaximMachineGun({
    firingRateRpm: fireRateRpm,
    waterJacketLiters: waterLevelLiters,
    recoilStrokeMm,
  });
  const recoilStrokeM = maxim.recoilStrokeMm / 1000;
  const [showMuzzleFlash, _setShowMuzzleFlash] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    fireRateRpm,
    showMuzzleFlash,
    isAudioMuted,
    recoilStrokeM,
    barrelTempC: maxim.barrelTempC,
    waterEvapRateGs: maxim.waterEvapRateGs,
    recoilMomentumNs: maxim.recoilMomentumNs,
    fireOmegaRadPerS: maxim.fireOmegaRadPerS,
  });

  const controlsRef = useRef<StudioContext["controls"] | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef = useRef<MaximMachineGunModel | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (preset) {
      case "iso":
        camera.position.set(8.5, 5.5, 9.5);
        controls.target.set(0.5, 0.2, 0);
        break;
      case "toggle_lock":
        camera.position.set(-0.8, 1.8, 2.6);
        controls.target.set(-0.6, 0.4, 0);
        break;
      case "water_jacket":
        camera.position.set(2.2, 1.8, 3.2);
        controls.target.set(1.8, 0.4, 0);
        break;
      case "belt_feed":
        camera.position.set(-0.3, 1.6, 2.4);
        controls.target.set(-0.3, 0.5, 0);
        break;
      case "spade_grips":
        camera.position.set(-3.5, 1.2, 1.8);
        controls.target.set(-1.8, 0.4, 0);
        break;
      case "top":
        camera.position.set(0.5, 11.5, 0.1);
        controls.target.set(0.5, 0.2, 0);
        break;
    }
    controls.update();
  };

  const toggleSound = () => {
    toggleEngine(() => {
      soundEngine.playSwitchClick();
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [8.5, 5.5, 9.5],
      targetPos: [0.5, 0.2, 0],
      fov: 38,
      environmentStyle: "studio",
      enableFloorGrid: true,
      floorColor: 0x090d16,
      gridColor: 0x1e293b,
      ambientIntensity: 0.9,
      sunIntensity: 1.6,
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Build procedural 3D model
    const model = buildMaximMachineGunModel();
    modelRef.current = model;
    scene.add(model.rootGroup);

    // Dynamic Muzzle Flash PointLight
    const flashLight = new THREE.PointLight(0xf97316, 0, 7.0);
    flashLight.position.set(4.65, 0.45, 0);
    scene.add(flashLight);

    // Animation Loop
    let reqId: number;
    let renderedSteps = 0;
    let lastAudioShot = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      renderedSteps += 1;
      const p = live.current;

      const fireFreq = p.fireOmegaRadPerS ?? (p.fireRateRpm / 60) * 2 * Math.PI;
      const cycleTime = (renderedSteps * (1 / 60) * fireFreq) % (Math.PI * 2);
      const isFiring = Math.sin(cycleTime);

      // --- KINEMATIC RECOIL CYCLE ---
      // 1. Barrel and barrel extension recoil rearward 19 mm
      const strokeScene = Math.max(0.06, p.recoilStrokeM * 5.0);
      const recoilDist = isFiring > 0 ? isFiring * strokeScene : 0;
      model.recoilingBarrelGroup.position.x = -recoilDist;

      // 2. Toggle lock joint breaks upward out of battery
      const toggleLift = isFiring > 0 ? Math.sin(isFiring * Math.PI) * 0.32 : 0;
      model.toggleJointGroup.position.y = 0.12 + toggleLift;
      model.toggleJointGroup.position.x = -0.8 - recoilDist * 1.8;

      // 3. External crank handle rotates downward on cam impact
      model.crankHandle.rotation.z = isFiring > 0 ? isFiring * 0.75 : 0;

      // 4. Muzzle flash & dynamic light synchronization
      const isMuzzleFlash = isFiring > 0.82 && p.showMuzzleFlash;
      model.muzzleFlashMesh.visible = isMuzzleFlash;
      flashLight.intensity = isMuzzleFlash ? 4.8 : 0;

      // Sound transducer trigger
      if (isMuzzleFlash && Math.floor(renderedSteps / 6) !== lastAudioShot) {
        lastAudioShot = Math.floor(renderedSteps / 6);
        if (!p.isAudioMuted) {
          soundEngine.playGunshot();
        }
      }

      // 5. Water jacket thermal heating & steam emission ($T \ge 100^\circ\text{C}$)
      const isBoiling = p.barrelTempC >= 95;
      const steamMat = model.steamPoints.material as THREE.PointsMaterial;
      steamMat.opacity = isBoiling ? Math.min(0.85, (p.waterEvapRateGs / 15) * 0.75) : 0;

      // Water jacket color thermal shift
      model.materials.jacketMat.color.setHex(
        p.barrelTempC > 200 ? 0x991b1b : p.barrelTempC > 100 ? 0xd97706 : 0x273549,
      );

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
      studio.dispose();
    };
  }, [live]);

  return (
    <div className="relative w-full h-[540px] sm:h-[640px] bg-slate-950 rounded-2xl overflow-hidden border border-amber-900/30 dark:border-ink-800 shadow-2xl flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl px-4 py-2.5 shadow-xl pointer-events-auto">
          <div className="flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
            <div>
              <h3 className="font-serif text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                Maxim Automatic Recoil Machine Gun 3D
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  US 319,596
                </span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400 block">
                Knee-Joint Toggle Lock · Water-Cooled Barrel Jacket · Canvas Belt Feed
              </span>
            </div>
          </div>
        </div>

        {/* Camera Views & Audio */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="hidden sm:flex items-center bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-1.5 shadow-xl">
            <button
              type="button"
              onClick={() => applyCameraPreset("iso")}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-colors ${
                activeCamera === "iso"
                  ? "bg-amber-600 text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => applyCameraPreset("toggle_lock")}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-colors ${
                activeCamera === "toggle_lock"
                  ? "bg-amber-600 text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              Toggle Lock
            </button>
            <button
              type="button"
              onClick={() => applyCameraPreset("water_jacket")}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-colors ${
                activeCamera === "water_jacket"
                  ? "bg-amber-600 text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              Water Jacket
            </button>
            <button
              type="button"
              onClick={() => applyCameraPreset("belt_feed")}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-colors ${
                activeCamera === "belt_feed"
                  ? "bg-amber-600 text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              Belt Feed
            </button>
            <button
              type="button"
              onClick={() => applyCameraPreset("spade_grips")}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-colors ${
                activeCamera === "spade_grips"
                  ? "bg-amber-600 text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              Spade Grips
            </button>
          </div>

          <button
            type="button"
            onClick={toggleSound}
            className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-200 hover:text-white transition-colors shadow-lg"
            title={isAudioMuted ? "Unmute gunshot sound" : "Mute gunshot sound"}
          >
            {isAudioMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-200 hover:text-white text-xs font-mono font-bold transition-colors shadow-lg"
          >
            {showUiOverlay ? "Hide HUD" : "Show HUD"}
          </button>
        </div>
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
        title="MAXIM RECOIL BALLISTICS"
        chips={[
          { label: "Cyclic Rate", value: String(Math.round(fireRateRpm)), unit: "rds/min" },
          { label: "Recoil Stroke", value: String(Math.round(recoilStrokeM * 1000)), unit: "mm" },
          { label: "Toggle Unlock", value: String(maxim.toggleUnlockForceN), unit: "N" },
          { label: "Recoil p", value: String(maxim.recoilMomentumNs), unit: "N·s" },
          {
            label: "Barrel Temp",
            value: String(maxim.barrelTempC),
            unit: "°C",
            tone: maxim.barrelTempC > 200 ? "warn" : "ok",
          },
          { label: "Steam Evap", value: String(maxim.waterEvapRateGs), unit: "g/s" },
          { label: "Muzzle Energy", value: String(maxim.muzzleEnergyJoules), unit: "J" },
          { label: "ω_fire", value: maxim.fireOmegaRadPerS.toFixed(1), unit: "rad/s" },
        ]}
      />
    </div>
  );
}
