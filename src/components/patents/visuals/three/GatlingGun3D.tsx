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

type CameraPreset = "iso" | "barrels" | "breech_cam" | "hopper" | "top";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  crankRpm: number;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "gatling_1862_original",
    name: "1862 Gatling Original (6-Barrel)",
    desc: "Dr. Richard Gatling's original 6-barrel rotary battery gun firing 200 rounds/min with continuous spiral cam cycling (US 36,836).",
    crankRpm: 33,
  },
  {
    id: "rapid_barrage",
    name: "Rapid Barrage (400 Rounds/Min)",
    desc: "High-speed hand cranking delivering over 6 shots per second to break enemy infantry charges.",
    crankRpm: 66,
  },
  {
    id: "slow_demonstration",
    name: "Slow Kinematic Cam Demonstration",
    desc: "10 RPM slow crank illustrating the 6-stage bolt cycle: chambering, locking, firing pin release, primary extraction, and casing ejection.",
    crankRpm: 10,
  },
];

export function GatlingGun3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Ballistic Simulation Parameters
  const { params, updateParam } = usePatentPhysics("us-36836-gatling-gun");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const crankRpm = params.crankRpm ?? 33;
  const roundsPerMinute = crankRpm * 6; // 6 barrels fire per revolution
  const [showMuzzleFlash, setShowMuzzleFlash] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    crankRpm,
    roundsPerMinute,
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
        camera.position.set(10.0, 6.0, 11.0);
        controls.target.set(0, 0, 0);
        break;
      case "barrels":
        camera.position.set(3.5, 0.8, 4.2);
        controls.target.set(2.0, 0.5, 0);
        break;
      case "breech_cam":
        camera.position.set(-2.2, 1.8, 3.5);
        controls.target.set(-1.0, 0.5, 0);
        break;
      case "hopper":
        camera.position.set(-1.0, 4.2, 2.5);
        controls.target.set(-1.0, 1.8, 0);
        break;
      case "top":
        camera.position.set(0, 12.0, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const applyScenario = (s: ScenarioPreset) => {
    updateParam("crankRpm", s.crankRpm);
    if (!isAudioMuted) {
      soundEngine.playSwitchClick();
    }
  };

  const toggleSound = () => {
    toggleEngine(() => {
      soundEngine.playSwitchClick();
    });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: Three.js studio lifecycle
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [10.0, 6.0, 11.0],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Materials
    const bluedSteelMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.25,
      metalness: 0.92,
    });

    const brassReceiverMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.22,
      metalness: 0.9,
    });

    const woodCarriageMat = new THREE.MeshStandardMaterial({
      color: 0x5c381e,
      roughness: 0.7,
      metalness: 0.05,
    });

    const ironFittingsMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.45,
      metalness: 0.85,
    });

    const flashGlowTex = createGlowPointTexture();

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Oak Field Carriage with Spoked Wheels & Brass Elevation Screws
    const carriageGroup = new THREE.Group();
    rootGroup.add(carriageGroup);

    // Carriage Trail Legs
    const trailLeg = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 6.0), woodCarriageMat);
    trailLeg.position.set(0, -1.2, -2.4);
    trailLeg.rotation.x = Math.PI / 10;
    carriageGroup.add(trailLeg);

    // Wheels
    [-2.2, 2.2].forEach((wx) => {
      const wheel = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.12, 12, 32), woodCarriageMat);
      wheel.position.set(wx, -0.6, 0);
      wheel.rotation.y = Math.PI / 2;
      wheel.castShadow = true;
      carriageGroup.add(wheel);
    });

    // 2. Revolving Barrel Cluster (6 Barrels + Central Shaft) (Claim 1)
    const barrelClusterGroup = new THREE.Group();
    barrelClusterGroup.position.set(0, 0.6, 0);
    rootGroup.add(barrelClusterGroup);

    // Central Steel Axle
    const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 7.5, 16), bluedSteelMat);
    axle.rotation.z = Math.PI / 2;
    barrelClusterGroup.add(axle);

    // Front & Rear Barrel Alignment Plates (Spider Discs)
    [0.8, 3.8].forEach((px) => {
      const plate = new THREE.Mesh(
        new THREE.CylinderGeometry(0.85, 0.85, 0.15, 24),
        brassReceiverMat,
      );
      plate.rotation.z = Math.PI / 2;
      plate.position.x = px;
      barrelClusterGroup.add(plate);
    });

    // 6 Rifled Steel Barrels
    for (let b = 0; b < 6; b++) {
      const angle = (b * Math.PI) / 3;
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 4.8, 16), bluedSteelMat);
      barrel.rotation.z = Math.PI / 2;
      barrel.position.set(2.4, Math.cos(angle) * 0.62, Math.sin(angle) * 0.62);
      barrel.castShadow = true;
      barrelClusterGroup.add(barrel);
    }

    // 3. Brass Breech Casing & Cam Track Housing (Claim 2)
    const breechHousing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.95, 0.95, 2.8, 24),
      brassReceiverMat,
    );
    breechHousing.rotation.z = Math.PI / 2;
    breechHousing.position.set(-1.4, 0.6, 0);
    breechHousing.castShadow = true;
    rootGroup.add(breechHousing);

    // 4. Gravity Feed Ammunition Hopper Chute
    const hopper = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.8, 0.3), brassReceiverMat);
    hopper.position.set(-1.2, 2.0, 0);
    hopper.castShadow = true;
    rootGroup.add(hopper);

    // 5. Hand Crank Handle
    const crankGroup = new THREE.Group();
    crankGroup.position.set(-2.8, 0.6, 0.9);
    rootGroup.add(crankGroup);

    const crankArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.2, 0.12), ironFittingsMat);
    crankArm.position.y = 0.5;
    crankGroup.add(crankArm);

    const crankKnob = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.6, 12),
      woodCarriageMat,
    );
    crankKnob.rotation.x = Math.PI / 2;
    crankKnob.position.set(0, 1.0, 0.3);
    crankGroup.add(crankKnob);

    // 6. Muzzle Flash & Spark Particles
    const flashMat = new THREE.PointsMaterial({
      size: 0.9,
      map: flashGlowTex,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      color: 0xffaa22,
    });
    const flashGeo = new THREE.BufferGeometry();
    flashGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([4.9, 1.2, 0]), 3),
    );
    const flashPoints = new THREE.Points(flashGeo, flashMat);
    rootGroup.add(flashPoints);

    // Animation Loop
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;

      const omegaRadPerSec = (p.crankRpm * 2 * Math.PI) / 60;
      barrelClusterGroup.rotation.x += omegaRadPerSec * delta;
      crankGroup.rotation.z += omegaRadPerSec * delta;

      // Pulse Muzzle Flash at top barrel position
      const isFiring =
        p.showMuzzleFlash && Math.sin(clock.getElapsedTime() * p.roundsPerMinute * 0.5) > 0.6;
      flashMat.opacity = isFiring ? 0.95 : 0;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      studio.cleanup();
    };
  }, []);

  return (
    <div className="relative w-full h-[620px] bg-parchment-900 rounded-2xl overflow-hidden border border-parchment-700 shadow-2xl flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-parchment-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            Gatling Gun 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 36,836 (1862)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["barrels", "Barrels"],
              ["breech_cam", "Breech Cam"],
              ["hopper", "Hopper"],
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
            <Flame className="w-4 h-4 text-orange-400" />
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
              <span className="text-[10px] text-parchment-400 uppercase">Hand Crank Speed</span>
              <span className="font-bold text-amber-400">{crankRpm} RPM</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Rate of Fire</span>
              <span className="font-bold text-red-400">{roundsPerMinute} Rounds/Min</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Muzzle Velocity</span>
              <span className="font-bold text-blue-400">1,380 ft/s (420 m/s)</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Active Mechanism</span>
              <span className="font-bold text-amber-300">6-Bolt Rotary Cam Cycle</span>
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
                Crank RPM:
              </span>
              <input
                type="range"
                min="10"
                max="80"
                step="2"
                value={crankRpm}
                onChange={(e) => updateParam("crankRpm", Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-mono text-amber-400 w-12 text-right font-bold">
                {crankRpm}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
