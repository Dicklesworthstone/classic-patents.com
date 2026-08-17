"use client";

import { Activity, Camera, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "centrifuge_bowl" | "conical_discs" | "outlet_spouts" | "top";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  bowlRpm: number;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "delaval_1881_continuous",
    name: "1881 De Laval Continuous Separator",
    desc: "Gustaf de Laval's 7,000 RPM high-speed centrifuge generating 4,000× g centrifugal field to continuously separate cream from skim milk (US 247,804).",
    bowlRpm: 7000,
  },
  {
    id: "high_capacity_dairy",
    name: "Industrial Creamery (8,500 RPM)",
    desc: "High-throughput processing of 1,200 liters of whole milk per hour with 99.9% butterfat extraction.",
    bowlRpm: 8500,
  },
  {
    id: "slow_spin_demonstration",
    name: "Low-Speed Stratification Breakdown",
    desc: "3,000 RPM demonstration illustrating density boundary separation along the conical disc surfaces.",
    bowlRpm: 3000,
  },
];

export function DeLavalSeparator3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Centrifugal Separation Parameters
  const { params, updateParam } = usePatentPhysics("us-247804-delaval-separator");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const bowlRpm = params.rotorRpm ?? 7000;
  const centrifugalGs = Math.round((((bowlRpm * 2 * Math.PI) / 60) ** 2 * 0.12) / 9.81);
  const throughputLitersPerHr = Math.round((bowlRpm / 7000) * 800);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    bowlRpm,
    centrifugalGs,
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
        camera.position.set(9.5, 7.5, 11.0);
        controls.target.set(0, 0, 0);
        break;
      case "centrifuge_bowl":
        camera.position.set(0, 1.8, 3.8);
        controls.target.set(0, 0.8, 0);
        break;
      case "conical_discs":
        camera.position.set(2.2, 2.2, 2.8);
        controls.target.set(0, 0.8, 0);
        break;
      case "outlet_spouts":
        camera.position.set(-2.5, 3.2, 3.0);
        controls.target.set(0, 2.2, 0);
        break;
      case "top":
        camera.position.set(0, 12.0, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const applyScenario = (s: ScenarioPreset) => {
    updateParam("rotorRpm", s.bowlRpm);
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
      cameraPos: [9.5, 7.5, 11.0],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Materials
    const castIronPedestalMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.85,
    });

    const polishedSteelBowlMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.1,
      metalness: 0.95,
    });

    const tinnedBrassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.22,
      metalness: 0.9,
    });

    const _creamMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.3,
      metalness: 0.05,
    });

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Heavy Cast-Iron Flanged Pedestal Stand
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 2.2, 4.2, 24),
      castIronPedestalMat,
    );
    pedestal.position.y = -1.8;
    pedestal.receiveShadow = true;
    rootGroup.add(pedestal);

    // 2. High-Speed Centrifuge Bowl Assembly (Claim 1)
    const bowlGroup = new THREE.Group();
    bowlGroup.position.set(0, 0.8, 0);
    rootGroup.add(bowlGroup);

    // Flexible Vertical Spindle
    const spindle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 3.8, 16),
      polishedSteelBowlMat,
    );
    spindle.position.y = -0.5;
    bowlGroup.add(spindle);

    // Solid Forged Steel Conical Bowl Shell
    const bowlPoints: THREE.Vector2[] = [];
    bowlPoints.push(new THREE.Vector2(0.01, 1.8));
    bowlPoints.push(new THREE.Vector2(0.8, 1.6));
    bowlPoints.push(new THREE.Vector2(1.8, 0.4));
    bowlPoints.push(new THREE.Vector2(1.8, -0.6));
    bowlPoints.push(new THREE.Vector2(0.4, -1.2));
    bowlPoints.push(new THREE.Vector2(0.01, -1.2));

    const bowlGeo = new THREE.LatheGeometry(bowlPoints, 32);
    const bowlMesh = new THREE.Mesh(bowlGeo, polishedSteelBowlMat);
    bowlMesh.castShadow = true;
    bowlGroup.add(bowlMesh);

    // 3. Stack of Nested Conical Separator Discs (Claim 2)
    for (let d = 0; d < 8; d++) {
      const disc = new THREE.Mesh(
        new THREE.ConeGeometry(1.6 - d * 0.08, 0.35, 24, 1, true),
        polishedSteelBowlMat,
      );
      disc.position.y = -0.4 + d * 0.18;
      bowlGroup.add(disc);
    }

    // 4. Concentric Cream & Skim Milk Collecting Receiver Spouts
    const receiverGroup = new THREE.Group();
    receiverGroup.position.set(0, 2.2, 0);
    rootGroup.add(receiverGroup);

    // Top Inflow Funnel Cup
    const funnel = new THREE.Mesh(new THREE.ConeGeometry(1.4, 1.2, 24, 1, true), tinnedBrassMat);
    funnel.position.y = 1.2;
    receiverGroup.add(funnel);

    // Upper Cream Outlet Spout
    const creamSpout = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 1.8, 12),
      tinnedBrassMat,
    );
    creamSpout.rotation.z = Math.PI / 3;
    creamSpout.position.set(1.4, 0.4, 0);
    receiverGroup.add(creamSpout);

    // Lower Skim Milk Outlet Spout
    const milkSpout = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 2.2, 12),
      tinnedBrassMat,
    );
    milkSpout.rotation.z = -Math.PI / 3;
    milkSpout.position.set(-1.6, -0.2, 0);
    receiverGroup.add(milkSpout);

    // Animation Loop
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;

      const omegaRadPerSec = (p.bowlRpm * 2 * Math.PI) / 60;
      bowlGroup.rotation.y += omegaRadPerSec * delta * 0.15;

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
            De Laval Separator 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 247,804 (1881)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["centrifuge_bowl", "Centrifuge Bowl"],
              ["conical_discs", "Conical Discs"],
              ["outlet_spouts", "Outlet Spouts"],
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
              <span className="text-[10px] text-parchment-400 uppercase">Bowl Speed</span>
              <span className="font-bold text-amber-400">{bowlRpm.toLocaleString()} RPM</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Centrifugal Field</span>
              <span className="font-bold text-blue-400">{centrifugalGs.toLocaleString()}× g</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Milk Throughput</span>
              <span className="font-bold text-emerald-400">{throughputLitersPerHr} L/hr</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Fat Extraction</span>
              <span className="font-bold text-amber-300">99.8% Butterfat Clean</span>
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
                Bowl RPM:
              </span>
              <input
                type="range"
                min="2000"
                max="10000"
                step="250"
                value={bowlRpm}
                onChange={(e) => updateParam("rotorRpm", Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-mono text-amber-400 w-16 text-right font-bold">
                {bowlRpm}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
