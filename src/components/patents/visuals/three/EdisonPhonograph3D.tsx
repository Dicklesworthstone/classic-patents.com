"use client";

import { Activity, Camera, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
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
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const cylinderRpm = params.cylinderRpm ?? 60;
  const surfaceSpeedCmPerSec = ((cylinderRpm * Math.PI * 7.62) / 60).toFixed(1);
  const groovePitchTpi = 10; // Threads per inch
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
        camera.position.set(0, 1.8, 3.2);
        controls.target.set(0, 0.6, 0);
        break;
      case "tinfoil_cylinder":
        camera.position.set(-1.8, 1.5, 3.8);
        controls.target.set(-0.8, 0, 0);
        break;
      case "brass_horn":
        camera.position.set(2.8, 2.5, 4.0);
        controls.target.set(1.5, 1.2, 0);
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

    // Materials
    const mahoganyWoodMat = new THREE.MeshStandardMaterial({
      color: 0x451a03,
      roughness: 0.55,
      metalness: 0.05,
    });

    const castIronMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.85,
    });

    const brassHornMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.2,
      metalness: 0.92,
    });

    const tinfoilCylinderMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.15,
      metalness: 0.9,
    });

    const polishedSteelMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.1,
      metalness: 0.95,
    });

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Polished Mahogany Baseboard Bed
    const baseboard = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.8, 5.5), mahoganyWoodMat);
    baseboard.position.y = -2.2;
    baseboard.receiveShadow = true;
    rootGroup.add(baseboard);

    // Twin Cast-Iron Bearing Stanchions
    [-3.2, 3.2].forEach((bx) => {
      const stanchion = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.8, 1.2), castIronMat);
      stanchion.position.set(bx, -0.8, 0);
      stanchion.castShadow = true;
      rootGroup.add(stanchion);
    });

    // 2. Grooved Brass Cylinder Wrapped in Tinfoil (Claim 1)
    const cylGroup = new THREE.Group();
    rootGroup.add(cylGroup);

    // Lead-Screw Shaft
    const leadScrew = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 9.5, 24),
      polishedSteelMat,
    );
    leadScrew.rotation.z = Math.PI / 2;
    cylGroup.add(leadScrew);

    // Hand Crank & Wooden Handle
    const crankArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.4, 0.4), castIronMat);
    crankArm.position.set(4.8, 0.6, 0);
    cylGroup.add(crankArm);

    // Tinfoil-Wrapped Mandrel Cylinder
    const cylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.4, 4.5, 36),
      tinfoilCylinderMat,
    );
    cylinder.rotation.z = Math.PI / 2;
    cylinder.position.x = -0.5;
    cylinder.castShadow = true;
    cylGroup.add(cylinder);

    // 3. Acoustic Sound-Box Diaphragm & Stylus (Claim 2)
    const soundBoxGroup = new THREE.Group();
    soundBoxGroup.position.set(0, 0.8, 1.6);
    rootGroup.add(soundBoxGroup);

    const soundBox = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.4, 24), brassHornMat);
    soundBox.rotation.x = Math.PI / 2;
    soundBoxGroup.add(soundBox);

    // Steel Needle Stylus
    const stylus = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.45, 8), polishedSteelMat);
    stylus.rotation.x = -Math.PI / 2;
    stylus.position.set(0, -0.4, -0.1);
    soundBoxGroup.add(stylus);

    // 4. Conical Brass Acoustic Horn
    const horn = new THREE.Mesh(new THREE.ConeGeometry(1.6, 3.2, 24, 1, true), brassHornMat);
    horn.rotation.x = -Math.PI / 3;
    horn.position.set(0, 1.6, 1.8);
    soundBoxGroup.add(horn);

    // Animation Loop
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;

      const omegaRadPerSec = (p.cylinderRpm * 2 * Math.PI) / 60;
      cylGroup.rotation.x += omegaRadPerSec * delta;

      // Stylus axial traverse along helical pitch
      const traverseX = ((clock.getElapsedTime() * (p.cylinderRpm / 60) * 0.15) % 3.0) - 1.5;
      soundBoxGroup.position.x = traverseX;

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
            Edison Tinfoil Phonograph 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 200,521 (1878)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["stylus_groove", "Stylus & Diaphragm"],
              ["tinfoil_cylinder", "Tinfoil Cylinder"],
              ["brass_horn", "Brass Horn"],
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
              <span className="text-[10px] text-parchment-400 uppercase">Cylinder Speed</span>
              <span className="font-bold text-amber-400">{cylinderRpm} RPM</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Surface Velocity</span>
              <span className="font-bold text-blue-400">{surfaceSpeedCmPerSec} cm/s</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Groove Threading</span>
              <span className="font-bold text-emerald-400">{groovePitchTpi} TPI (Lead Screw)</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Acoustic Transducer</span>
              <span className="font-bold text-amber-300">Hill-and-Dale Indentation</span>
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
                min="20"
                max="120"
                step="5"
                value={cylinderRpm}
                onChange={(e) => updateParam("cylinderRpm", Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-mono text-amber-400 w-12 text-right font-bold">
                {cylinderRpm}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
