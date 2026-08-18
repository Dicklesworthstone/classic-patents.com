"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { stepDavenportMotor } from "@/physics/catalogKernels";
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

type CameraPreset = "iso" | "commutator" | "stator_magnets" | "rotor" | "top";

export function DavenportElectricMotor3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Electromechanical Parameters
  const { params } = usePatentPhysics("us-132-davenport-electric-motor");
  const supplyVoltage = params.batteryVoltage ?? 12;
  const loadTorque = params.loadTorque ?? 0.8;
  const davenport = stepDavenportMotor({ batteryVoltage: supplyVoltage, loadTorque });
  const motorRpm = davenport.shaftRpm;
  const [showSparkParticles, setShowSparkParticles] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const motorTorqueNm = loadTorque.toFixed(2);
  const mechanicalWatts = davenport.shaftPowerW.toFixed(1);

  const live = useLiveSimParams({
    motorRpm,
    supplyVoltage,
    showSparkParticles,
    isAudioMuted,
    loadTorque,
    mechanicalWatts: davenport.shaftPowerW,
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
        camera.position.set(9.0, 7.5, 10.5);
        controls.target.set(0, 0, 0);
        break;
      case "commutator":
        camera.position.set(0, 2.5, 3.8);
        controls.target.set(0, 1.2, 0);
        break;
      case "stator_magnets":
        camera.position.set(3.2, 1.5, 3.5);
        controls.target.set(1.5, 0, 0);
        break;
      case "rotor":
        camera.position.set(0, 4.0, 1.5);
        controls.target.set(0, 0, 0);
        break;
      case "top":
        camera.position.set(0, 11.5, 0.1);
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
      cameraPos: [9.0, 7.5, 10.5],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Materials
    const mahoganyMat = new THREE.MeshStandardMaterial({
      color: 0x5c2c16,
      roughness: 0.5,
      metalness: 0.05,
    });

    const ironCoreMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.4,
      metalness: 0.85,
    });

    const copperWireMat = new THREE.MeshStandardMaterial({
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

    const sparkGlowTex = createGlowPointTexture();

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Turned Mahogany Baseboard & Stanchion Pillars
    const baseboard = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.5, 0.6, 36), mahoganyMat);
    baseboard.position.y = -2.0;
    baseboard.receiveShadow = true;
    rootGroup.add(baseboard);

    // 4 Corner Turned Brass Stanchions
    [
      [-2.4, -2.4],
      [2.4, -2.4],
      [-2.4, 2.4],
      [2.4, 2.4],
    ].forEach(([sx, sz]) => {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 3.8, 16), brassMat);
      pillar.position.set(sx, 0, sz);
      rootGroup.add(pillar);
    });

    // 2. Stationary Semicircular Horseshoe Electromagnets (Stator) (Claim 1)
    const statorGroup = new THREE.Group();
    rootGroup.add(statorGroup);

    [-1, 1].forEach((dir) => {
      const magnetGroup = new THREE.Group();
      magnetGroup.position.x = dir * 2.2;

      // Curved Iron Core Arm
      const core = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.35, 16, 24, Math.PI), ironCoreMat);
      core.rotation.z = dir > 0 ? -Math.PI / 2 : Math.PI / 2;
      magnetGroup.add(core);

      // Silk-Insulated Copper Wire Coils
      [-0.8, 0.8].forEach((cy) => {
        const coil = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.2, 20), copperWireMat);
        coil.position.set(0, cy, 0);
        coil.castShadow = true;
        magnetGroup.add(coil);
      });

      statorGroup.add(magnetGroup);
    });

    // 3. Revolving Cross-Shaped Rotor Armature (Claim 2)
    const rotorGroup = new THREE.Group();
    rootGroup.add(rotorGroup);

    // Vertical Steel Drive Shaft
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 5.0, 16), steelShaftMat);
    shaft.castShadow = true;
    rotorGroup.add(shaft);

    // 4 Cross-Poles with Copper Windings
    for (let p = 0; p < 4; p++) {
      const pAngle = (p * Math.PI) / 2;
      const poleGroup = new THREE.Group();
      poleGroup.rotation.y = pAngle;

      const ironPole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.6, 12), ironCoreMat);
      ironPole.rotation.z = Math.PI / 2;
      ironPole.position.x = 0.9;
      poleGroup.add(ironPole);

      const coil = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.1, 16), copperWireMat);
      coil.rotation.z = Math.PI / 2;
      coil.position.x = 0.9;
      coil.castShadow = true;
      poleGroup.add(coil);

      rotorGroup.add(poleGroup);
    }

    // 4. Split-Ring Commutator & Copper Leaf Brushes
    const commutator = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.5, 24), brassMat);
    commutator.position.y = 1.6;
    rotorGroup.add(commutator);

    // Stationary Spring Brushes
    [-0.5, 0.5].forEach((bx) => {
      const brush = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.8, 0.15), copperWireMat);
      brush.position.set(bx, 1.6, 0);
      rootGroup.add(brush);
    });

    // 5. Commutator Sparks Particles
    const sparkCount = 30;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPositions = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount; i++) {
      sparkPositions[i * 3] = (Math.random() > 0.5 ? 0.4 : -0.4) + (Math.random() - 0.5) * 0.15;
      sparkPositions[i * 3 + 1] = 1.6 + (Math.random() - 0.5) * 0.2;
      sparkPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }
    sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));
    const sparkMat = new THREE.PointsMaterial({
      size: 0.25,
      map: sparkGlowTex,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      color: 0x38bdf8,
    });
    const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
    rootGroup.add(sparkPoints);

    // Animation Loop
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;

      const omegaRadPerSec = (p.motorRpm * 2 * Math.PI) / 60;
      rotorGroup.rotation.y += omegaRadPerSec * delta;

      const watts = p.mechanicalWatts;
      sparkPoints.visible =
        p.showSparkParticles && watts > 8 && Math.sin(clock.getElapsedTime() * 40) > 0.1;
      sparkMat.opacity = Math.min(0.95, 0.2 + (watts / 80) * 0.75);
      sparkMat.size = 0.15 + (p.supplyVoltage / 24) * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      studio.cleanup();
    };
  }, [live]);

  return (
    <div className="relative w-full h-[620px] bg-parchment-900 rounded-2xl overflow-hidden border border-parchment-700 shadow-2xl flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-parchment-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            Davenport Motor 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 132 (1837)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["commutator", "Commutator"],
              ["stator_magnets", "Stator"],
              ["rotor", "Rotor"],
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
            onClick={() => setShowSparkParticles(!showSparkParticles)}
            title="Toggle Commutator Sparks"
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showSparkParticles
                ? "bg-amber-600/30 text-amber-300 border border-amber-500/40"
                : "text-parchment-400 hover:text-white"
            }`}
          >
            {showSparkParticles ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <StudioKernelChips
        visible
        title="Davenport commutator"
        chips={[
          { label: "V", value: String(supplyVoltage), unit: "V" },
          { label: "Load", value: motorTorqueNm, unit: "N·m" },
          { label: "ω", value: String(motorRpm), unit: "rpm" },
          { label: "P", value: mechanicalWatts, unit: "W" },
          { label: "I", value: String(davenport.armatureCurrentA), unit: "A" },
          { label: "η", value: String(davenport.efficiencyPct), unit: "%" },
        ]}
      />
    </div>
  );
}
