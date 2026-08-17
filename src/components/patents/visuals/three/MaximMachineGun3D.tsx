"use client";

import { Activity, Camera, Flame, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import {
  createGlowPointTexture,
  createThreeStudioScene,
  type StudioContext,
} from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "toggle_lock" | "water_jacket" | "belt_feed" | "top";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  fireRateRpm: number;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "maxim_1884_recoil",
    name: "1884 Maxim Automatic Recoil Gun",
    desc: "Hiram Maxim's historic breakthrough harnessing barrel recoil force to unlock the toggle, extract, eject, and chamber 600 rounds/min automatically (US 319,596).",
    fireRateRpm: 600,
  },
  {
    id: "sustained_water_cooled_fire",
    name: "Sustained Water-Cooled Barrage",
    desc: "Continuous 7.5-liter water-jacket boiling heat dissipation allowing 2,000 continuous rounds without barrel failure.",
    fireRateRpm: 650,
  },
  {
    id: "slow_toggle_kinematics",
    name: "Slow-Motion Toggle Lock Breakdown",
    desc: "120 RPM slow motion illustrating the knee-joint toggle lock over-center lockup and rearward cam unlocking.",
    fireRateRpm: 120,
  },
];

export function MaximMachineGun3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Automatic Recoil Ballistics Parameters
  const { params, updateParam } = usePatentPhysics("us-319596-maxim-machine-gun");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const fireRateRpm = params.fireRateRpm ?? 600;
  const muzzleVelocityMps = 740;
  const roundsPerSecond = (fireRateRpm / 60).toFixed(1);
  const [showMuzzleFlash, setShowMuzzleFlash] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    fireRateRpm,
    showMuzzleFlash,
    isAudioMuted,
  });

  const controlsRef = useRef<StudioContext["controls"] | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (preset) {
      case "iso":
        camera.position.set(9.5, 6.5, 10.5);
        controls.target.set(0, 0, 0);
        break;
      case "toggle_lock":
        camera.position.set(-1.2, 1.8, 3.2);
        controls.target.set(-0.8, 0.4, 0);
        break;
      case "water_jacket":
        camera.position.set(1.5, 1.5, 3.5);
        controls.target.set(1.0, 0.2, 0);
        break;
      case "belt_feed":
        camera.position.set(-0.8, 1.8, 3.0);
        controls.target.set(-0.6, 0.4, 0);
        break;
      case "top":
        camera.position.set(0, 11.5, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const applyScenario = (s: ScenarioPreset) => {
    updateParam("fireRateRpm", s.fireRateRpm);
    if (!isAudioMuted) {
      soundEngine.playSwitchClick();
    }
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
      cameraPos: [9.5, 6.5, 10.5],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Materials
    const gunmetalMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.35,
      metalness: 0.9,
    });

    const _brassCasingMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.22,
      metalness: 0.92,
    });

    const polishedSteelMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.1,
      metalness: 0.95,
    });

    const flashGlowTex = createGlowPointTexture();

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Heavy Tubular Steel Tripod Mount
    const tripod = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 1.6, 2.4, 3), gunmetalMat);
    tripod.position.y = -1.6;
    tripod.receiveShadow = true;
    rootGroup.add(tripod);

    // 2. Water-Cooled Barrel Jacket & Muzzle Booster (Claim 1)
    const gunGroup = new THREE.Group();
    gunGroup.position.set(0, 0.4, 0);
    rootGroup.add(gunGroup);

    // Cylindrical Water Jacket (Claim 1)
    const waterJacket = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.55, 4.2, 24),
      gunmetalMat,
    );
    waterJacket.rotation.z = Math.PI / 2;
    waterJacket.position.x = 1.4;
    waterJacket.castShadow = true;
    gunGroup.add(waterJacket);

    // Rifled Steel Barrel Extending Through Jacket
    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 5.2, 16),
      polishedSteelMat,
    );
    barrel.rotation.z = Math.PI / 2;
    barrel.position.x = 1.8;
    gunGroup.add(barrel);

    // Muzzle Flash Booster Cone
    const booster = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.5, 16), gunmetalMat);
    booster.rotation.z = -Math.PI / 2;
    booster.position.x = 4.4;
    gunGroup.add(booster);

    // 3. Rectangular Receiver Box & Knee-Joint Toggle Lock (Claim 1)
    const receiver = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.9, 0.7), gunmetalMat);
    receiver.position.x = -1.2;
    gunGroup.add(receiver);

    // Toggle-Lock Joint Arms
    const toggleGroup = new THREE.Group();
    toggleGroup.position.set(-1.2, 0.2, 0);
    gunGroup.add(toggleGroup);

    const rearArm = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.18, 0.2), polishedSteelMat);
    rearArm.position.x = -0.3;
    toggleGroup.add(rearArm);

    const frontArm = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.18, 0.2), polishedSteelMat);
    frontArm.position.x = 0.3;
    toggleGroup.add(frontArm);

    // Spade Grip Handles
    [-0.3, 0.3].forEach((gz) => {
      const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.8, 12), gunmetalMat);
      grip.position.set(-2.6, -0.1, gz);
      gunGroup.add(grip);
    });

    // 4. Muzzle Flash Burst Generator Particles
    const flashMat = new THREE.PointsMaterial({
      size: 1.2,
      map: flashGlowTex,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      color: 0xff6600,
    });
    const flashGeo = new THREE.BufferGeometry();
    flashGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([4.8, 0.4, 0]), 3),
    );
    const flashPoint = new THREE.Points(flashGeo, flashMat);
    rootGroup.add(flashPoint);

    // Animation Loop
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const _delta = clock.getDelta();
      const p = live.current;

      const fireFreq = (p.fireRateRpm / 60) * 2 * Math.PI;
      const recoilPhase = Math.sin(clock.getElapsedTime() * fireFreq);

      // Gun recoil stroke
      gunGroup.position.x = recoilPhase > 0 ? -recoilPhase * 0.15 : 0;

      // Toggle lock breaking upward on recoil
      toggleGroup.position.y = 0.2 + (recoilPhase > 0 ? recoilPhase * 0.25 : 0);

      // Muzzle flash sync
      flashMat.opacity = recoilPhase > 0.8 && p.showMuzzleFlash ? 0.95 : 0;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      studio.cleanup();
    };
  }, [live.current]);

  return (
    <div className="relative w-full h-[620px] bg-parchment-900 rounded-2xl overflow-hidden border border-parchment-700 shadow-2xl flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-parchment-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            Maxim Machine Gun 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 319,596 (1885)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["toggle_lock", "Toggle Lock"],
              ["water_jacket", "Water Jacket"],
              ["belt_feed", "Belt Feed"],
              ["top", "Top"],
            ] as [CameraPreset, string][]
          ).map(([preset, label]) => (
            <button
              key={preset}
              type="button"
              onClick={() => applyCameraPreset(preset)}
              className={`px-2.5 py-1 text-xs font-sans rounded-lg transition-colors ${
                activeCamera === preset
                  ? "bg-amber-600 text-white font-semibold shadow-sm"
                  : "text-parchment-300 hover:text-white hover:bg-parchment-800/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={() => setShowMuzzleFlash(!showMuzzleFlash)}
            title="Toggle Muzzle Flash"
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showMuzzleFlash
                ? "bg-amber-600/30 text-amber-300 border border-amber-500/40"
                : "text-parchment-400 hover:text-white"
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400" />
          </button>
          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            <Zap className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Bottom Telemetry Bar & Controls */}
      {showUiOverlay && (
        <div className="absolute bottom-4 left-4 right-4 bg-parchment-950/90 backdrop-blur-md rounded-2xl border border-parchment-700/70 p-4 shadow-2xl z-10 flex flex-col gap-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pb-2 border-b border-parchment-800/80 text-xs font-mono">
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Cyclic Rate</span>
              <span className="font-bold text-amber-400">{fireRateRpm} RPM</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Fire Cadence</span>
              <span className="font-bold text-blue-400">{roundsPerSecond} Rounds/Sec</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Muzzle Velocity</span>
              <span className="font-bold text-emerald-400">
                {muzzleVelocityMps} m/s (.303 British)
              </span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Mechanism</span>
              <span className="font-bold text-amber-300">Short Recoil Toggle Lock</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-mono text-parchment-400 flex items-center gap-1 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Presets:
              </span>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {SCENARIOS.map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => applyScenario(sc)}
                    className="px-2.5 py-1 text-xs font-sans rounded-lg bg-parchment-800/80 hover:bg-parchment-700 text-parchment-200 hover:text-white border border-parchment-600/50 transition-colors whitespace-nowrap"
                  >
                    {sc.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-72 shrink-0">
              <span className="text-xs font-sans text-parchment-300 shrink-0 font-medium">
                Fire Rate (RPM):
              </span>
              <input
                type="range"
                min="100"
                max="800"
                step="25"
                value={fireRateRpm}
                onChange={(e) => updateParam("fireRateRpm", Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-mono text-amber-400 w-12 text-right font-bold">
                {fireRateRpm}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
