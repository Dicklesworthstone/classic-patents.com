"use client";

import { Activity, Camera, Eye, EyeOff, Sparkles, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { stepDeLavalSeparator } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "centrifuge_bowl" | "conical_discs" | "outlet_spouts" | "top";

export function DeLavalSeparator3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);

  // Centrifugal Separation Parameters
  const { params, updateParam } = usePatentPhysics("us-247804-delaval-separator");
  const bowlRpm = params.bowlRpm ?? params.rotorRpm ?? 6500;
  const sep = stepDeLavalSeparator({
    bowlRpm,
    rawMilkFlowLph: params.rawMilkFlowLph ?? 300,
  });
  const centrifugalGs = sep.gForce;
  const throughputLitersPerHr = sep.creamFlowLph;
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
            title={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            {showUiOverlay ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4 text-amber-400" />
            )}
          </button>
        </div>
      </div>

      {/* Bottom Telemetry Bar & Controls */}
    </div>
  );
}
