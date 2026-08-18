"use client";

import { Activity, Camera, Eye, EyeOff, Sparkles, Volume2, VolumeX, Waves } from "lucide-react";
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

type CameraPreset = "iso" | "spray_chamber" | "baffle_plates" | "blower_fan" | "top";

export function CarrierAirConditioner3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);

  // Psychrometric Air Treatment Parameters
  const { params } = usePatentPhysics("us-808897-carrier-air-conditioner");
  const airflowCfm = params.airflowCfm ?? 15000;
  const sprayWaterTempC = params.sprayTempC ?? 12.5;
  const [showSprayMist, setShowSprayMist] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    airflowCfm,
    sprayWaterTempC,
    showSprayMist,
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
        camera.position.set(11.5, 7.5, 12.5);
        controls.target.set(0, 0, 0);
        break;
      case "spray_chamber":
        camera.position.set(-1.0, 1.8, 4.0);
        controls.target.set(-0.5, 0.4, 0);
        break;
      case "baffle_plates":
        camera.position.set(1.8, 1.8, 3.5);
        controls.target.set(1.2, 0.4, 0);
        break;
      case "blower_fan":
        camera.position.set(4.2, 1.8, 3.8);
        controls.target.set(3.5, 0.4, 0);
        break;
      case "top":
        camera.position.set(0, 13.5, 0.1);
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
      cameraPos: [11.5, 7.5, 12.5],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Materials
    const sheetMetalMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.4,
      metalness: 0.85,
    });

    const brassPipesMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.22,
      metalness: 0.9,
    });

    const zincBafflesMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.35,
      metalness: 0.8,
    });

    const mistGlowTex = createGlowPointTexture();

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Galvanized Sheet-Metal Conditioning Duct Tunnel (Claim 1)
    const ductTunnel = new THREE.Mesh(new THREE.BoxGeometry(8.5, 3.6, 3.6), sheetMetalMat);
    ductTunnel.position.set(-0.5, 0.2, 0);
    ductTunnel.castShadow = true;
    rootGroup.add(ductTunnel);

    // 2. High-Pressure Cold Water Atomizing Spray Chamber (Claim 1 & Claim 2)
    const sprayChamberGroup = new THREE.Group();
    sprayChamberGroup.position.set(-1.8, 0.2, 0);
    rootGroup.add(sprayChamberGroup);

    // Vertical Spray Header Pipes & Atomizing Nozzles
    for (let r = 0; r < 3; r++) {
      const rx = -0.8 + r * 0.8;
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.2, 12), brassPipesMat);
      pipe.position.set(rx, 0, 0);
      sprayChamberGroup.add(pipe);

      for (let n = 0; n < 4; n++) {
        const nozzle = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.18, 8), brassPipesMat);
        nozzle.rotation.z = Math.PI / 2;
        nozzle.position.set(rx + 0.1, -1.1 + n * 0.75, 0);
        sprayChamberGroup.add(nozzle);
      }
    }

    // 3. Zig-Zag Mist Eliminator Baffle Plates (Claim 3)
    const baffleGroup = new THREE.Group();
    baffleGroup.position.set(1.4, 0.2, 0);
    rootGroup.add(baffleGroup);

    for (let b = 0; b < 10; b++) {
      const bz = -1.4 + b * 0.31;
      const baffle = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3.2, 0.04), zincBafflesMat);
      baffle.rotation.y = Math.PI / 6;
      baffle.position.set(0, 0, bz);
      baffleGroup.add(baffle);
    }

    // 4. Centrifugal Blower Draft Fan Housing (Claim 1)
    const fanGroup = new THREE.Group();
    fanGroup.position.set(4.2, 0.2, 0);
    rootGroup.add(fanGroup);

    const fanScroll = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.9, 2.2, 24), sheetMetalMat);
    fanScroll.rotation.x = Math.PI / 2;
    fanGroup.add(fanScroll);

    // Squirrel-Cage Fan Rotor
    const fanRotor = new THREE.Group();
    fanGroup.add(fanRotor);

    for (let f = 0; f < 16; f++) {
      const fAngle = (f * Math.PI * 2) / 16;
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.4, 1.8), zincBafflesMat);
      blade.position.set(Math.cos(fAngle) * 1.5, Math.sin(fAngle) * 1.5, 0);
      blade.rotation.z = fAngle;
      fanRotor.add(blade);
    }

    // 5. Water Spray Mist Particles
    const mistCount = 120;
    const mistGeo = new THREE.BufferGeometry();
    const mistPositions = new Float32Array(mistCount * 3);

    for (let i = 0; i < mistCount; i++) {
      const idx = i * 3;
      mistPositions[idx] = -2.4 + Math.random() * 2.8;
      mistPositions[idx + 1] = -1.2 + Math.random() * 2.6;
      mistPositions[idx + 2] = -1.4 + Math.random() * 2.8;
    }

    mistGeo.setAttribute("position", new THREE.BufferAttribute(mistPositions, 3));
    const mistMat = new THREE.PointsMaterial({
      size: 0.2,
      map: mistGlowTex,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      color: 0x38bdf8,
    });
    const mistPoints = new THREE.Points(mistGeo, mistMat);
    rootGroup.add(mistPoints);

    // Animation Loop
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;

      const fanSpeed = (p.airflowCfm / 15000) * 12.0;
      fanRotor.rotation.z -= fanSpeed * delta;

      // Animate drifting mist droplets from nozzles toward baffles
      const pos = mistPositions;
      for (let i = 0; i < mistCount; i++) {
        const idx = i * 3;
        pos[idx] += (p.airflowCfm / 15000) * 3.5 * delta;
        if (pos[idx] > 1.2) {
          pos[idx] = -2.4;
        }
      }
      mistGeo.attributes.position.needsUpdate = true;
      mistPoints.visible = p.showSprayMist;

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
            Carrier Air Conditioning System 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 808,897 (1906)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["spray_chamber", "Spray Chamber"],
              ["baffle_plates", "Baffle Eliminators"],
              ["blower_fan", "Draft Blower"],
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
            onClick={() => setShowSprayMist(!showSprayMist)}
            title="Toggle Water Mist Spray"
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showSprayMist
                ? "bg-amber-600/30 text-amber-300 border border-amber-500/40"
                : "text-parchment-400 hover:text-white"
            }`}
          >
            <Waves className="w-4 h-4 text-cyan-400" />
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

      {/* Bottom Telemetry Bar & Controls */}
    </div>
  );
}
