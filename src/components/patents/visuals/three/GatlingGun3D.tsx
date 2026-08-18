"use client";

import { Activity, Camera, Flame, Sparkles, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildGatlingGunModel } from "./gatlingGunModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
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
  const [_showUiOverlay, _setShowUiOverlay] = useState<boolean>(true);
  const crankRpm = params.crankRpm ?? 33;
  const roundsPerMinute = crankRpm * 6; // 6 barrels fire per revolution
  const [showMuzzleFlash, _setShowMuzzleFlash] = useState<boolean>(true);
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
        camera.position.set(9.0, 5.0, 10.0);
        controls.target.set(0, 0, 0);
        break;
      case "barrels":
        camera.position.set(4.5, 1.2, 3.8);
        controls.target.set(2.4, 0.4, 0);
        break;
      case "breech_cam":
        camera.position.set(-2.0, 1.8, 3.2);
        controls.target.set(-0.8, 0.4, 0);
        break;
      case "hopper":
        camera.position.set(-0.8, 3.8, 2.2);
        controls.target.set(-0.6, 1.4, 0);
        break;
      case "top":
        camera.position.set(0, 11.0, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const applyScenario = (s: ScenarioPreset) => {
    updateParam("crankRpm", s.crankRpm);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const studio = createThreeStudioScene({
      container: containerRef.current,
      cameraPos: [3, 2, 8],
      targetPos: [0, -0.5, 0],
      fov: 38,
    });
    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Load High-Fidelity Gatling Gun Model
    const model = buildGatlingGunModel();
    scene.add(model.rootGroup);

    // Animation Loop
    let reqId: number;
    const clock = new THREE.Clock();
    let lastFireTime = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;

      const omegaRadPerSec = (p.crankRpm * 2 * Math.PI) / 60;
      model.barrelClusterGroup.rotation.x += omegaRadPerSec * delta;
      model.crankGroup.rotation.x += omegaRadPerSec * delta;

      // Kinematic Cam Track Bolt Reciprocation
      const currentAngle = model.barrelClusterGroup.rotation.x;
      model.bolts.forEach((bolt, idx) => {
        const barrelAngle = currentAngle + (idx * Math.PI) / 3;
        // Cam profile: forward stroke between 0 and PI, extraction stroke between PI and 2PI
        const camDisplacement = Math.cos(barrelAngle) * 0.38;
        bolt.position.x = -0.6 + camDisplacement;
      });

      // Muzzle Flash & Acoustic Pulse at 12 o'clock firing position
      const fireIntervalSec = 60 / (p.crankRpm * 6);
      const now = clock.getElapsedTime();
      if (now - lastFireTime > fireIntervalSec) {
        lastFireTime = now;
        if (p.showMuzzleFlash) {
          (model.muzzleFlashPoints.material as THREE.PointsMaterial).opacity = 0.95;
        }
        if (!p.isAudioMuted && typeof window !== "undefined") {
          soundEngine.playSparks();
        }
      } else {
        const mat = model.muzzleFlashPoints.material as THREE.PointsMaterial;
        mat.opacity = Math.max(0, mat.opacity - delta * 8.0);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
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
            Gatling Gun 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 36,836 (1862)
          </span>
        </div>

        {/* Camera Views */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              { id: "iso", label: "Overview" },
              { id: "barrels", label: "6 Barrels" },
              { id: "breech_cam", label: "Cam Breech" },
              { id: "hopper", label: "Hopper Feed" },
              { id: "top", label: "Top View" },
            ] as const
          ).map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => applyCameraPreset(c.id)}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all ${
                activeCamera === c.id
                  ? "bg-amber-600 text-white font-bold shadow-xs"
                  : "text-parchment-300 hover:text-white hover:bg-parchment-800/60"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pointer-events-none z-10">
        {/* Scenario Presets */}
        <div className="flex flex-wrap items-center gap-1.5 bg-parchment-950/85 backdrop-blur-md p-2 rounded-2xl border border-parchment-700/60 shadow-xl pointer-events-auto">
          <Sparkles className="w-4 h-4 text-amber-400 ml-1.5 mr-1" />
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => applyScenario(s)}
              className={`px-3 py-1.5 text-xs font-mono rounded-xl transition-all ${
                crankRpm === s.crankRpm
                  ? "bg-amber-600 text-white font-bold shadow-xs"
                  : "text-parchment-200 hover:text-white hover:bg-parchment-800/60"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Live Controls & Telemetry */}
        <div className="flex items-center gap-3 bg-parchment-950/85 backdrop-blur-md px-4 py-2 rounded-2xl border border-parchment-700/60 shadow-xl pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-parchment-300">Crank Speed:</span>
            <input
              type="range"
              min="5"
              max="100"
              step="1"
              value={crankRpm}
              onChange={(e) => updateParam("crankRpm", Number.parseFloat(e.target.value))}
              className="w-24 h-1.5 bg-parchment-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <span className="text-xs font-mono font-bold text-amber-400 w-12 text-right">
              {crankRpm} RPM
            </span>
          </div>

          <div className="h-4 w-px bg-parchment-700" />

          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs font-mono text-parchment-300">Fire Rate:</span>
            <span className="text-xs font-mono font-bold text-orange-400">
              {roundsPerMinute} rds/min
            </span>
          </div>

          <div className="h-4 w-px bg-parchment-700" />

          <button
            type="button"
            onClick={toggleEngine}
            className="p-1.5 rounded-lg text-parchment-300 hover:text-white hover:bg-parchment-800/60 transition-colors"
            title={isAudioMuted ? "Unmute Firing Acoustics" : "Mute Firing Acoustics"}
          >
            {isAudioMuted ? (
              <VolumeX className="w-4 h-4 text-parchment-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
