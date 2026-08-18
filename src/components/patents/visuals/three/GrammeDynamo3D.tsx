"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { stepGrammeDynamo } from "@/physics/catalogKernels";
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

type CameraPreset = "iso" | "ring_armature" | "commutator" | "pole_pieces" | "top";

export function GrammeDynamo3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);

  // Electrical Dynamo Parameters
  const { params } = usePatentPhysics("us-120057-gramme-dynamo");
  const dynamoRpm = params.shaftRpm ?? params.rotorRpm ?? 950;
  const gramme = stepGrammeDynamo({
    shaftRpm: dynamoRpm,
    coilSegments: params.coilSegments ?? 32,
  });
  const outputVoltageVolts = gramme.emfVolts;
  const currentAmps = (outputVoltageVolts / 4.5).toFixed(1);
  const powerWatts = gramme.powerWatts.toFixed(0);
  const [showMagneticFlux, setShowMagneticFlux] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    dynamoRpm,
    outputVoltageVolts,
    showMagneticFlux,
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
        camera.position.set(10.0, 7.5, 11.5);
        controls.target.set(0, 0, 0);
        break;
      case "ring_armature":
        camera.position.set(0, 0.8, 4.2);
        controls.target.set(0, 0, 0);
        break;
      case "commutator":
        camera.position.set(-2.8, 1.2, 3.2);
        controls.target.set(-1.4, 0, 0);
        break;
      case "pole_pieces":
        camera.position.set(2.8, 2.5, 3.8);
        controls.target.set(1.2, 0, 0);
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
      cameraPos: [10.0, 7.5, 11.5],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Materials
    const castIronMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.8,
    });

    const copperCoilMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.25,
      metalness: 0.9,
    });

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xc8963e,
      roughness: 0.2,
      metalness: 0.92,
    });

    const steelShaftMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.1,
      metalness: 0.95,
    });

    const fluxGlowTex = createGlowPointTexture();

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Heavy Cast-Iron Bedplate & Upright Bearing Brackets
    const bedplate = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.8, 6.5), castIronMat);
    bedplate.position.y = -2.2;
    bedplate.receiveShadow = true;
    rootGroup.add(bedplate);

    [-3.8, 3.8].forEach((bx) => {
      const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.6, 3.2, 16), castIronMat);
      pedestal.position.set(bx, -0.6, 0);
      rootGroup.add(pedestal);
    });

    // 2. Stationary Field Magnet Iron Core Pole Shoes
    const statorGroup = new THREE.Group();
    rootGroup.add(statorGroup);

    [-1, 1].forEach((dir) => {
      const poleShoe = new THREE.Mesh(
        new THREE.CylinderGeometry(2.6, 2.6, 2.8, 24, 1, true, 0, Math.PI * 0.6),
        castIronMat,
      );
      poleShoe.rotation.z = Math.PI / 2;
      poleShoe.rotation.x = dir > 0 ? Math.PI * 0.2 : Math.PI * 1.2;
      poleShoe.position.set(0, 0, 0);
      poleShoe.castShadow = true;
      statorGroup.add(poleShoe);

      // Heavy Field Magnet Coils
      const fCoil = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.4, 2.4), copperCoilMat);
      fCoil.position.set(0, dir * 2.2, 0);
      fCoil.castShadow = true;
      statorGroup.add(fCoil);
    });

    // 3. Revolving Gramme Ring Armature (Claim 1: Soft Iron Ring + Toroidal Windings)
    const armatureGroup = new THREE.Group();
    rootGroup.add(armatureGroup);

    // Drive Shaft
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 9.0, 16), steelShaftMat);
    shaft.rotation.z = Math.PI / 2;
    shaft.castShadow = true;
    armatureGroup.add(shaft);

    // Soft Iron Toroidal Ring Core
    const ironRing = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.45, 16, 36), castIronMat);
    ironRing.rotation.y = Math.PI / 2;
    armatureGroup.add(ironRing);

    // 16 Discrete Toroidal Copper Coil Sectors
    const sectorCount = 16;
    for (let s = 0; s < sectorCount; s++) {
      const sAngle = (s * Math.PI * 2) / sectorCount;
      const coilSector = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.14, 12, 16), copperCoilMat);
      coilSector.position.set(0, Math.cos(sAngle) * 1.8, Math.sin(sAngle) * 1.8);
      coilSector.rotation.y = Math.PI / 2;
      coilSector.rotation.x = sAngle;
      coilSector.castShadow = true;
      armatureGroup.add(coilSector);
    }

    // 4. Multi-Segment Radial Commutator Drum & Copper Brushes
    const commutator = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 1.2, 32), brassMat);
    commutator.rotation.z = Math.PI / 2;
    commutator.position.x = -2.2;
    armatureGroup.add(commutator);

    // Stationary Brush Holders
    [-1, 1].forEach((dir) => {
      const brush = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.6, 0.25), copperCoilMat);
      brush.position.set(-2.2, dir * 0.8, 0);
      rootGroup.add(brush);
    });

    // 5. Magnetic Flux Vector Field Particles
    const fluxCount = 120;
    const fluxGeo = new THREE.BufferGeometry();
    const fluxPositions = new Float32Array(fluxCount * 3);
    const fluxColors = new Float32Array(fluxCount * 3);

    for (let i = 0; i < fluxCount; i++) {
      const idx = i * 3;
      const a = Math.random() * Math.PI * 2;
      const r = 1.4 + Math.random() * 0.9;
      fluxPositions[idx] = (Math.random() - 0.5) * 2.2;
      fluxPositions[idx + 1] = Math.cos(a) * r;
      fluxPositions[idx + 2] = Math.sin(a) * r;

      fluxColors[idx] = 0.2;
      fluxColors[idx + 1] = 0.85;
      fluxColors[idx + 2] = 1.0;
    }

    fluxGeo.setAttribute("position", new THREE.BufferAttribute(fluxPositions, 3));
    fluxGeo.setAttribute("color", new THREE.BufferAttribute(fluxColors, 3));

    const fluxPoints = new THREE.Points(
      fluxGeo,
      new THREE.PointsMaterial({
        size: 0.25,
        map: fluxGlowTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    rootGroup.add(fluxPoints);

    // Animation Loop
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;

      const omegaRadPerSec = (p.dynamoRpm * 2 * Math.PI) / 60;
      armatureGroup.rotation.x += omegaRadPerSec * delta;

      // Animate flux vectors circulating in ring
      const pos = fluxPositions;
      for (let i = 0; i < fluxCount; i++) {
        const idx = i * 3;
        const y = pos[idx + 1];
        const z = pos[idx + 2];
        let a = Math.atan2(z, y);
        a += omegaRadPerSec * delta * 0.3;
        const r = Math.sqrt(y * y + z * z);
        pos[idx + 1] = Math.cos(a) * r;
        pos[idx + 2] = Math.sin(a) * r;
      }
      fluxGeo.attributes.position.needsUpdate = true;
      fluxPoints.visible = p.showMagneticFlux;
      (fluxPoints.material as THREE.PointsMaterial).opacity = Math.min(
        0.95,
        0.25 + (p.outputVoltageVolts / 200) * 0.7,
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
            Gramme Ring Dynamo 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 120,057 (1871)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["ring_armature", "Ring Armature"],
              ["commutator", "Commutator"],
              ["pole_pieces", "Field Poles"],
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
            onClick={() => setShowMagneticFlux(!showMagneticFlux)}
            title="Toggle Magnetic Flux"
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showMagneticFlux
                ? "bg-amber-600/30 text-amber-300 border border-amber-500/40"
                : "text-parchment-400 hover:text-white"
            }`}
          >
            <Eye className="w-4 h-4" />
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
        title="Gramme ring"
        chips={[
          { label: "Shaft", value: String(Math.round(dynamoRpm)), unit: "rpm" },
          { label: "E", value: String(outputVoltageVolts), unit: "V" },
          { label: "I", value: currentAmps, unit: "A" },
          { label: "P", value: powerWatts, unit: "W" },
        ]}
      />
    </div>
  );
}
