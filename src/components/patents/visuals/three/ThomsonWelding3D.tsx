"use client";

import { Activity, Camera, Eye, EyeOff, Flame, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { stepThomsonWelding } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { StudioKernelChips } from "./StudioKernelChips";
import {
  createGlowPointTexture,
  createThreeStudioScene,
  type StudioContext,
} from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "weld_junction" | "transformer_core" | "copper_clamps" | "top";

export function ThomsonWelding3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);

  // Electrical Resistance Welding Parameters
  const { params } = usePatentPhysics("us-347140-thomson-welding");
  const weldCurrentAmps = params.weldCurrentAmps ?? params.currentAmperes ?? 4500;
  const weld = stepThomsonWelding({
    weldCurrentAmps,
    clampPressureMpa: params.clampPressureMpa ?? 35,
  });
  const weldTempCelsius = weld.interfaceTempC;
  const weldPowerKw = weld.jouleKw.toFixed(1);
  const [showSparks, setShowSparks] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    weldCurrentAmps,
    weldTempCelsius,
    jouleKw: weld.jouleKw,
    isForged: weld.isForged ? 1 : 0,
    showSparks,
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
      case "weld_junction":
        camera.position.set(0, 1.2, 3.2);
        controls.target.set(0, 0.4, 0);
        break;
      case "transformer_core":
        camera.position.set(0, -1.0, 4.0);
        controls.target.set(0, -1.2, 0);
        break;
      case "copper_clamps":
        camera.position.set(2.4, 1.5, 3.0);
        controls.target.set(0.8, 0.4, 0);
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
      cameraPos: [9.5, 7.0, 11.0],
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

    const heavyCopperMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.25,
      metalness: 0.9,
    });

    const steelBarMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.2,
      metalness: 0.9,
    });

    const glowingWeldMat = new THREE.MeshStandardMaterial({
      color: 0xffedd5,
      roughness: 0.1,
      emissive: 0xff5500,
      emissiveIntensity: 1.0,
    });

    const sparkGlowTex = createGlowPointTexture();

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Heavy Workshop Bed & Transformer Laminated Core Base (Claim 1)
    const bed = new THREE.Mesh(new THREE.BoxGeometry(10.0, 0.8, 5.5), castIronMat);
    bed.position.y = -2.2;
    bed.receiveShadow = true;
    rootGroup.add(bed);

    // Laminated Transformer Iron Core Loop
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, -1.2, 0);
    rootGroup.add(coreGroup);

    const coreMesh = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.4, 2.2), castIronMat);
    coreGroup.add(coreMesh);

    // Heavy Secondary Single-Turn Copper Bar
    const secondaryBar = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.4, 0.8), heavyCopperMat);
    secondaryBar.position.y = 0.9;
    coreGroup.add(secondaryBar);

    // 2. Heavy Dual Copper Clamping Jaws (Claim 2)
    const clampGroup = new THREE.Group();
    rootGroup.add(clampGroup);

    // Left Fixed Copper Clamp
    const leftJaw = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.6, 1.4), heavyCopperMat);
    leftJaw.position.set(-1.4, 0.4, 0);
    leftJaw.castShadow = true;
    clampGroup.add(leftJaw);

    // Right Movable Copper Clamp with Axial Compression Screw
    const rightJaw = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.6, 1.4), heavyCopperMat);
    rightJaw.position.set(1.4, 0.4, 0);
    rightJaw.castShadow = true;
    clampGroup.add(rightJaw);

    // Axial Compression Handwheel & Screw
    const screwRod = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.2, 16), steelBarMat);
    screwRod.rotation.z = Math.PI / 2;
    screwRod.position.set(2.8, 0.4, 0);
    clampGroup.add(screwRod);

    // 3. Clamped Steel Bars & Glowing White-Hot Weld Seam
    const leftBar = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 2.6, 24), steelBarMat);
    leftBar.rotation.z = Math.PI / 2;
    leftBar.position.set(-1.2, 0.4, 0);
    clampGroup.add(leftBar);

    const rightBar = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 2.6, 24), steelBarMat);
    rightBar.rotation.z = Math.PI / 2;
    rightBar.position.set(1.2, 0.4, 0);
    clampGroup.add(rightBar);

    // White-Hot Bulging Weld Seam (Plastic Forged State)
    const weldSeam = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 24), glowingWeldMat);
    weldSeam.position.set(0, 0.4, 0);
    clampGroup.add(weldSeam);

    // 4. Flying Welding Sparks Particles
    const sparkCount = 80;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPositions = new Float32Array(sparkCount * 3);
    const sparkVels: number[] = [];

    for (let i = 0; i < sparkCount; i++) {
      const idx = i * 3;
      sparkPositions[idx] = 0;
      sparkPositions[idx + 1] = 0.4;
      sparkPositions[idx + 2] = 0;

      // Random burst velocity vector
      sparkVels.push((Math.random() - 0.5) * 6.0);
      sparkVels.push(Math.random() * 5.0 + 1.0);
      sparkVels.push((Math.random() - 0.5) * 6.0);
    }

    sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));
    const sparkMat = new THREE.PointsMaterial({
      size: 0.2,
      map: sparkGlowTex,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      color: 0xffaa00,
    });
    const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
    clampGroup.add(sparkPoints);

    // Animation Loop
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;

      // Spark explosion animation
      const pos = sparkPositions;
      for (let i = 0; i < sparkCount; i++) {
        const idx = i * 3;
        pos[idx] += sparkVels[idx] * delta;
        pos[idx + 1] += sparkVels[idx + 1] * delta;
        pos[idx + 2] += sparkVels[idx + 2] * delta;
        sparkVels[idx + 1] -= 9.81 * delta; // Gravity fall

        if (pos[idx + 1] < -2.0) {
          pos[idx] = 0;
          pos[idx + 1] = 0.4;
          pos[idx + 2] = 0;
          sparkVels[idx] = (Math.random() - 0.5) * 6.0;
          sparkVels[idx + 1] = Math.random() * 5.0 + 1.0;
          sparkVels[idx + 2] = (Math.random() - 0.5) * 6.0;
        }
      }
      sparkGeo.attributes.position.needsUpdate = true;
      const forged = p.isForged > 0.5;
      sparkPoints.visible = p.showSparks && forged;
      glowingWeldMat.emissiveIntensity = forged ? 2.2 : 0.25;
      glowingWeldMat.emissive.setHex(p.weldTempCelsius >= 1150 ? 0xfff7ed : 0x7c2d12);
      weldSeam.scale.setScalar(forged ? 1.05 : 0.72);

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
            Thomson Electric Welding 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 347,140 (1886)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["weld_junction", "Weld Junction"],
              ["transformer_core", "Step-Down Core"],
              ["copper_clamps", "Copper Clamps"],
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
            onClick={() => setShowSparks(!showSparks)}
            title="Toggle Welding Sparks"
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showSparks
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

      <StudioKernelChips
        visible={showUiOverlay}
        title="Thomson I²R forge"
        chips={[
          { label: "I", value: String(Math.round(weldCurrentAmps)), unit: "A" },
          { label: "P", value: weldPowerKw, unit: "kW" },
          {
            label: "T",
            value: String(weldTempCelsius),
            unit: "°C",
            tone: weld.isForged ? "hot" : "warn",
          },
          {
            label: "Forge",
            value: weld.isForged ? "plastic" : "cold",
            tone: weld.isForged ? "ok" : "warn",
          },
        ]}
      />
    </div>
  );
}
