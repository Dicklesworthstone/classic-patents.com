"use client";

import { Activity, Camera, Volume2, VolumeX, Wind, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { stepParsonsTurbine } from "@/physics/catalogKernels";
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

type CameraPreset = "iso" | "turbine_stages" | "rotor_blades" | "governor" | "top";

export function ParsonsTurbine3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Steam Turbomachinery Parameters
  const { params } = usePatentPhysics("us-328710-parsons-turbine");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const turbineRpm = params.rotorRpm ?? 3000;
  const steamPressureBar = params.steamPressureBar ?? (params.inletPressurePsi ?? 180) / 14.5038;
  const parsons = stepParsonsTurbine({
    rotorRpm: turbineRpm,
    inletPressurePsi: params.inletPressurePsi ?? steamPressureBar * 14.5038,
  });
  const powerKw = parsons.shaftPowerKw;
  const stageCount = 48;
  const [showSteamFlow, setShowSteamFlow] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    turbineRpm,
    steamPressureBar,
    showSteamFlow,
    isAudioMuted,
    shaftPowerKw: powerKw,
    enthalpyKjKg: parsons.enthalpyKjKg,
    inletMpa: parsons.inletMpa,
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
        camera.position.set(12.5, 8.0, 14.0);
        controls.target.set(0, 0, 0);
        break;
      case "turbine_stages":
        camera.position.set(0, 2.0, 5.0);
        controls.target.set(0, 0.5, 0);
        break;
      case "rotor_blades":
        camera.position.set(2.8, 1.8, 3.5);
        controls.target.set(1.5, 0.4, 0);
        break;
      case "governor":
        camera.position.set(-4.5, 2.2, 3.5);
        controls.target.set(-3.5, 1.0, 0);
        break;
      case "top":
        camera.position.set(0, 14.5, 0.1);
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
      cameraPos: [12.5, 8.0, 14.0],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Materials
    const castIronCasingMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.85,
    });

    const steelRotorMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.1,
      metalness: 0.95,
    });

    const bronzeBladesMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.22,
      metalness: 0.9,
    });

    const steamGlowTex = createGlowPointTexture();

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Heavy Foundation Bed & Flanged Bearing Pedestals
    const bedplate = new THREE.Mesh(new THREE.BoxGeometry(13.0, 0.9, 6.5), castIronCasingMat);
    bedplate.position.y = -2.2;
    bedplate.receiveShadow = true;
    rootGroup.add(bedplate);

    // 2. Stepped Reaction Turbine Casing (Lower Half Fixed, Upper Cutaway) (Claim 1)
    const casingGroup = new THREE.Group();
    rootGroup.add(casingGroup);

    // HP, IP, and LP Stepped Cylinder Housings
    [
      [-2.8, 1.4, 3.2], // HP Stage
      [0.2, 1.8, 3.0], // IP Stage
      [3.4, 2.4, 3.4], // LP Stage
    ].forEach(([cx, radius, length]) => {
      const casing = new THREE.Mesh(
        new THREE.CylinderGeometry(radius, radius, length, 32, 1, false, 0, Math.PI * 1.3),
        castIronCasingMat,
      );
      casing.rotation.z = Math.PI / 2;
      casing.position.set(cx, 0, 0);
      casing.castShadow = true;
      casingGroup.add(casing);
    });

    // 3. Stepped Rotor Drum with Bladed Stage Discs (Claim 2)
    const rotorGroup = new THREE.Group();
    rootGroup.add(rotorGroup);

    // Drive Shaft
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 11.5, 24), steelRotorMat);
    shaft.rotation.z = Math.PI / 2;
    rotorGroup.add(shaft);

    // Stepped Rotor Drums
    [
      [-2.8, 0.9, 3.0],
      [0.2, 1.3, 2.8],
      [3.4, 1.8, 3.2],
    ].forEach(([rx, radius, length]) => {
      const drum = new THREE.Mesh(
        new THREE.CylinderGeometry(radius, radius, length, 24),
        steelRotorMat,
      );
      drum.rotation.z = Math.PI / 2;
      drum.position.set(rx, 0, 0);
      rotorGroup.add(drum);
    });

    // Hundreds of Peripheral Curved Reaction Blades in Rows
    const bladeRows: THREE.Group[] = [];
    for (let row = 0; row < 18; row++) {
      const rowX = -4.0 + row * 0.45;
      const stageRadius = row < 6 ? 1.05 : row < 12 ? 1.45 : 1.95;
      const rowGroup = new THREE.Group();
      rowGroup.position.x = rowX;

      const numBladesInRow = 24;
      for (let b = 0; b < numBladesInRow; b++) {
        const bAngle = (b * Math.PI * 2) / numBladesInRow;
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.35, 0.12), bronzeBladesMat);
        blade.position.set(0, Math.cos(bAngle) * stageRadius, Math.sin(bAngle) * stageRadius);
        blade.rotation.x = bAngle;
        blade.rotation.y = Math.PI / 5; // Reaction curved angle
        rowGroup.add(blade);
      }

      rotorGroup.add(rowGroup);
      bladeRows.push(rowGroup);
    }

    // 4. Steam Flow Streamline Particles
    const steamCount = 180;
    const steamGeo = new THREE.BufferGeometry();
    const steamPositions = new Float32Array(steamCount * 3);
    const steamColors = new Float32Array(steamCount * 3);

    for (let i = 0; i < steamCount; i++) {
      const idx = i * 3;
      const x = -4.5 + Math.random() * 9.0;
      const r = 0.6 + ((x + 4.5) / 9.0) * 1.4; // Expanding steam cone
      const a = Math.random() * Math.PI * 2;
      steamPositions[idx] = x;
      steamPositions[idx + 1] = Math.cos(a) * r;
      steamPositions[idx + 2] = Math.sin(a) * r;

      steamColors[idx] = 0.8;
      steamColors[idx + 1] = 0.9;
      steamColors[idx + 2] = 1.0;
    }

    steamGeo.setAttribute("position", new THREE.BufferAttribute(steamPositions, 3));
    steamGeo.setAttribute("color", new THREE.BufferAttribute(steamColors, 3));

    const steamPoints = new THREE.Points(
      steamGeo,
      new THREE.PointsMaterial({
        size: 0.22,
        map: steamGlowTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    rootGroup.add(steamPoints);

    // Animation Loop
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;

      const omegaRadPerSec = (p.turbineRpm * 2 * Math.PI) / 60;
      rotorGroup.rotation.x += omegaRadPerSec * delta * 0.08;

      // Animate axial expansion of steam from HP inlet to LP exhaust
      const pos = steamPositions;
      for (let i = 0; i < steamCount; i++) {
        const idx = i * 3;
        pos[idx] += (p.enthalpyKjKg / 550) * (p.turbineRpm / 3000) * 12 * delta;
        const x = pos[idx];
        const r = 0.6 + ((x + 4.5) / 9.0) * 1.4;
        let a = Math.atan2(pos[idx + 2], pos[idx + 1]);
        a += omegaRadPerSec * delta * 0.04;
        pos[idx + 1] = Math.cos(a) * r;
        pos[idx + 2] = Math.sin(a) * r;

        if (pos[idx] > 5.0) {
          pos[idx] = -4.5;
        }
      }
      steamGeo.attributes.position.needsUpdate = true;
      steamPoints.visible = p.showSteamFlow;
      (steamPoints.material as THREE.PointsMaterial).opacity = Math.min(
        0.95,
        0.25 + (p.shaftPowerKw / 14000) * 0.7,
      );

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
            Parsons Steam Turbine 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 608,969 (1898)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["turbine_stages", "Casing Stages"],
              ["rotor_blades", "Rotor Blades"],
              ["governor", "Governor"],
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
            onClick={() => setShowSteamFlow(!showSteamFlow)}
            title="Toggle Steam Streamlines"
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showSteamFlow
                ? "bg-amber-600/30 text-amber-300 border border-amber-500/40"
                : "text-parchment-400 hover:text-white"
            }`}
          >
            <Wind className="w-4 h-4 text-sky-400" />
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

      <StudioKernelChips
        visible={showUiOverlay}
        title="Parsons reaction stages"
        chips={[
          { label: "Rotor", value: String(Math.round(turbineRpm)), unit: "rpm" },
          { label: "Inlet", value: parsons.inletMpa.toFixed(2), unit: "MPa" },
          { label: "h", value: String(parsons.enthalpyKjKg), unit: "kJ/kg" },
          { label: "Shaft", value: String(powerKw), unit: "kW" },
          { label: "Stages", value: String(stageCount) },
        ]}
      />
    </div>
  );
}
