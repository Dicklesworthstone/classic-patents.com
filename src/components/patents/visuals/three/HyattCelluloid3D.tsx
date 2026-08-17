"use client";

import { Activity, Camera, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "hydraulic_ram" | "steam_jacket" | "nozzle_die" | "top";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  tempCelsius: number;
  pressureMpa: number;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "hyatt_1870_billiard",
    name: "1870 Billiard Ball Extrusion Press",
    desc: "John Wesley Hyatt's steam-heated hydraulic press converting camphor and pyroxylin into the world's first synthetic thermoplastic (US 105,338).",
    tempCelsius: 125,
    pressureMpa: 22,
  },
  {
    id: "high_viscosity_sheet",
    name: "Optical Sheet Extrusion (140°C)",
    desc: "High-temperature plasticization yielding flawless transparent celluloid sheets for photographic film bases.",
    tempCelsius: 140,
    pressureMpa: 28,
  },
  {
    id: "low_temp_dough",
    name: "Low-Temperature Camphor Mastication",
    desc: "100°C preliminary kneading phase dissolving solid camphor crystals into fibrous nitrocellulose.",
    tempCelsius: 100,
    pressureMpa: 15,
  },
];

export function HyattCelluloid3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Polymer Processing Parameters
  const { params, updateParam } = usePatentPhysics("us-105338-hyatt-celluloid");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const processTempC = params.tempCelsius ?? 125;
  const hydraulicPressureMpa = (processTempC / 125) * 22;
  const extrusionRateCmPerMin = (processTempC * 0.15).toFixed(1);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    processTempC,
    hydraulicPressureMpa,
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
        camera.position.set(10.5, 7.5, 12.0);
        controls.target.set(0, 0, 0);
        break;
      case "hydraulic_ram":
        camera.position.set(-3.5, 2.0, 4.5);
        controls.target.set(-2.0, 0, 0);
        break;
      case "steam_jacket":
        camera.position.set(0, 1.2, 4.2);
        controls.target.set(0, 0, 0);
        break;
      case "nozzle_die":
        camera.position.set(3.8, 1.5, 3.5);
        controls.target.set(2.5, -0.4, 0);
        break;
      case "top":
        camera.position.set(0, 12.5, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const applyScenario = (s: ScenarioPreset) => {
    updateParam("tempCelsius", s.tempCelsius);
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
      cameraPos: [10.5, 7.5, 12.0],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Materials
    const castIronMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.85,
    });

    const polishedSteelMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.12,
      metalness: 0.95,
    });

    const brassPipesMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.22,
      metalness: 0.9,
    });

    const celluloidAmberMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.88,
    });

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Heavy Cast-Iron Press Bed & Tie-Rod Columns
    const bedplate = new THREE.Mesh(new THREE.BoxGeometry(11.5, 0.9, 5.5), castIronMat);
    bedplate.position.y = -2.2;
    bedplate.receiveShadow = true;
    rootGroup.add(bedplate);

    // 4 Heavy Forged Steel Tie Rods
    [
      [-1.4, -1.8],
      [1.4, -1.8],
      [-1.4, 1.8],
      [1.4, 1.8],
    ].forEach(([ty, tz]) => {
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 9.5, 16), polishedSteelMat);
      rod.rotation.z = Math.PI / 2;
      rod.position.set(0, ty, tz);
      rootGroup.add(rod);
    });

    // 2. Steam-Jacketed Heated Barrel (Claim 1)
    const barrelGroup = new THREE.Group();
    rootGroup.add(barrelGroup);

    // Outer Annular Steam Jacket
    const jacket = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 4.5, 32), castIronMat);
    jacket.rotation.z = Math.PI / 2;
    jacket.castShadow = true;
    barrelGroup.add(jacket);

    // Steam Inlet & Outlet Brass Flanges
    [-1.2, 1.2].forEach((sx) => {
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1.2, 12), brassPipesMat);
      pipe.position.set(sx, 1.8, 0);
      barrelGroup.add(pipe);
    });

    // 3. Hydraulic Plunger Ram (Claim 2)
    const ramGroup = new THREE.Group();
    ramGroup.position.set(-3.8, 0, 0);
    rootGroup.add(ramGroup);

    // Hydraulic Cylinder Housing
    const hydCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 3.2, 24), castIronMat);
    hydCyl.rotation.z = Math.PI / 2;
    ramGroup.add(hydCyl);

    // Polished Chrome Plunger Ram
    const ramPiston = new THREE.Mesh(
      new THREE.CylinderGeometry(0.7, 0.7, 4.2, 24),
      polishedSteelMat,
    );
    ramPiston.rotation.z = Math.PI / 2;
    ramPiston.position.x = 1.8;
    ramGroup.add(ramPiston);

    // 4. Precision Extrusion Nozzle Die & Extruded Celluloid Rod
    const nozzleGroup = new THREE.Group();
    nozzleGroup.position.set(2.4, 0, 0);
    rootGroup.add(nozzleGroup);

    const nozzleCone = new THREE.Mesh(new THREE.ConeGeometry(1.2, 1.2, 24), brassPipesMat);
    nozzleCone.rotation.z = -Math.PI / 2;
    nozzleGroup.add(nozzleCone);

    // Continuous Extruded Translucent Celluloid Rod
    const rodMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.35, 3.8, 24),
      celluloidAmberMat,
    );
    rodMesh.rotation.z = Math.PI / 2;
    rodMesh.position.x = 2.4;
    rodMesh.castShadow = true;
    nozzleGroup.add(rodMesh);

    // Molded Billiard Ball Samples
    [-0.8, 0.8].forEach((bz, idx) => {
      const ball = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 24, 24),
        new THREE.MeshStandardMaterial({
          color: idx === 0 ? 0xfffbeb : 0xd97706,
          roughness: 0.15,
          metalness: 0.05,
        }),
      );
      ball.position.set(4.2, -1.6, bz);
      ball.castShadow = true;
      rootGroup.add(ball);
    });

    // Animation Loop
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const _delta = clock.getDelta();
      const _p = live.current;

      // Subtle ram pulsation
      ramPiston.position.x = 1.8 + Math.sin(clock.getElapsedTime() * 1.5) * 0.15;

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
            Hyatt Celluloid Press 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 105,338 (1870)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["hydraulic_ram", "Hydraulic Ram"],
              ["steam_jacket", "Steam Jacket"],
              ["nozzle_die", "Extrusion Die"],
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
              <span className="text-[10px] text-parchment-400 uppercase">Process Temp</span>
              <span className="font-bold text-amber-400">{processTempC}°C</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Hydraulic Pressure</span>
              <span className="font-bold text-blue-400">{hydraulicPressureMpa.toFixed(1)} MPa</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Extrusion Velocity</span>
              <span className="font-bold text-emerald-400">{extrusionRateCmPerMin} cm/min</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Polymer Matrix</span>
              <span className="font-bold text-amber-300">Camphor-Plasticized Pyroxylin</span>
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
                Jacket Temp:
              </span>
              <input
                type="range"
                min="90"
                max="160"
                step="5"
                value={processTempC}
                onChange={(e) => updateParam("tempCelsius", Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-mono text-amber-400 w-16 text-right font-bold">
                {processTempC}°C
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
