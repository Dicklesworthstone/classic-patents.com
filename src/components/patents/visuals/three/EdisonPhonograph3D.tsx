"use client";

import { Activity, Camera, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildEdisonPhonographModel } from "./edisonPhonographModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "stylus_groove" | "tinfoil_cylinder" | "brass_horn" | "top";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  cylinderRpm: number;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "mary_had_a_little_lamb",
    name: "1877 'Mary Had a Little Lamb' Recording",
    desc: "Thomas Edison's historic recording capturing the human voice into tinfoil grooves via a vibrating stylus (US 200,521).",
    cylinderRpm: 60,
  },
  {
    id: "orchestral_fidelity",
    name: "High-Speed Acoustic Fidelity (90 RPM)",
    desc: "Higher surface velocity yielding improved high-frequency acoustic tracking up to 3,000 Hz.",
    cylinderRpm: 90,
  },
  {
    id: "slow_crank_playback",
    name: "Slow Hand-Cranked Playback (40 RPM)",
    desc: "Slow motion demonstrating stylus hill-and-dale indentation tracking along the lead-screw helix.",
    cylinderRpm: 40,
  },
];

export function EdisonPhonograph3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Acoustic Phonograph Parameters
  const { params, updateParam } = usePatentPhysics("us-200521-edison-phonograph");
  const cylinderRpm = params.cylinderRpm ?? 60;
  const surfaceSpeedCmPerSec = ((cylinderRpm * Math.PI * 7.62) / 60).toFixed(1);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    cylinderRpm,
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
        camera.position.set(9.5, 7.0, 11.0);
        controls.target.set(0, 0, 0);
        break;
      case "stylus_groove":
        camera.position.set(0, 2.2, 3.2);
        controls.target.set(0, 1.2, 0.8);
        break;
      case "tinfoil_cylinder":
        camera.position.set(-1.8, 1.8, 3.8);
        controls.target.set(-0.4, 0.8, 0);
        break;
      case "brass_horn":
        camera.position.set(2.8, 3.0, 4.0);
        controls.target.set(0, 1.8, 1.8);
        break;
      case "top":
        camera.position.set(0, 12.0, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const applyScenario = (s: ScenarioPreset) => {
    updateParam("cylinderRpm", s.cylinderRpm);
    if (!isAudioMuted) {
      soundEngine.playSwitchClick();
    }
  };

  const toggleSound = () => {
    toggleEngine(() => {
      soundEngine.playSwitchClick();
    });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: Three.js animation loop reads live ref
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [9.5, 7.0, 11.0],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Load High-Fidelity Edison Phonograph Model
    const model = buildEdisonPhonographModel();
    scene.add(model.rootGroup);

    // Animation Loop
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;

      const omegaRadPerSec = (p.cylinderRpm * 2 * Math.PI) / 60;
      model.cylinderGroup.rotation.x += omegaRadPerSec * delta;

      // Longitudinal Lead-Screw Traverse (wrapping around bounds)
      const traverseSpeed = (p.cylinderRpm * 0.002) / 60;
      model.cylinderGroup.position.x = ((clock.getElapsedTime() * traverseSpeed) % 1.2) - 0.6;

      // Stylus Acoustic Vibration
      const stylusVibe = Math.sin(clock.getElapsedTime() * 40.0) * 0.03;
      model.stylus.position.y = -0.55 + stylusVibe;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
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
            Edison Phonograph 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 200,521 (1878)
          </span>
        </div>

        {/* Camera Views */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              { id: "iso", label: "Overview" },
              { id: "stylus_groove", label: "Stylus & Diaphragm" },
              { id: "tinfoil_cylinder", label: "Tinfoil Mandrel" },
              { id: "brass_horn", label: "Brass Horn" },
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
                cylinderRpm === s.cylinderRpm
                  ? "bg-amber-600 text-white font-bold shadow-xs"
                  : "text-parchment-200 hover:text-white hover:bg-parchment-800/60"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Live Controls & SI Telemetry */}
        <div className="flex items-center gap-3 bg-parchment-950/85 backdrop-blur-md px-4 py-2 rounded-2xl border border-parchment-700/60 shadow-xl pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-parchment-300">RPM:</span>
            <input
              type="range"
              min="20"
              max="120"
              step="1"
              value={cylinderRpm}
              onChange={(e) => updateParam("cylinderRpm", Number.parseFloat(e.target.value))}
              className="w-20 h-1.5 bg-parchment-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <span className="text-xs font-mono font-bold text-amber-400 w-10 text-right">
              {cylinderRpm}
            </span>
          </div>

          <div className="h-4 w-px bg-parchment-700" />

          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs font-mono text-parchment-300">Speed:</span>
            <span className="text-xs font-mono font-bold text-orange-400">
              {surfaceSpeedCmPerSec} cm/s
            </span>
          </div>

          <div className="h-4 w-px bg-parchment-700" />

          <button
            type="button"
            onClick={toggleSound}
            className="p-1.5 rounded-lg text-parchment-300 hover:text-white hover:bg-parchment-800/60 transition-colors"
            title={isAudioMuted ? "Unmute Acoustic Transducer" : "Mute Acoustic Transducer"}
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
