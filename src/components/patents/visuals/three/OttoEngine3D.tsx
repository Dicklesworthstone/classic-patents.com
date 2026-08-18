"use client";

import { Activity, Camera, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { stepOttoEngine } from "@/physics/catalogKernels";
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

type CameraPreset = "iso" | "slide_valve" | "cylinder_piston" | "flywheels" | "top";

export function OttoEngine3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Four-Stroke Thermodynamic Parameters
  const { params } = usePatentPhysics("us-194047-otto-engine");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const engineRpm = params.engineRpm ?? 180;
  const otto = stepOttoEngine({
    engineRpm,
    compressionRatio: params.compressionRatio ?? 4.5,
  });
  const powerBhp = otto.brakeHorsepower.toFixed(1);
  const thermalEfficiencyPct = otto.thermalEfficiencyPct;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    engineRpm,
    compressionRatio: params.compressionRatio ?? 4.5,
    isAudioMuted,
    thermalEfficiencyPct,
    brakeHorsepower: otto.brakeHorsepower,
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
        camera.position.set(11.0, 8.0, 12.5);
        controls.target.set(0, 0, 0);
        break;
      case "slide_valve":
        camera.position.set(-3.2, 1.8, 3.5);
        controls.target.set(-2.2, 0.4, 0);
        break;
      case "cylinder_piston":
        camera.position.set(0, 2.5, 4.2);
        controls.target.set(-0.8, 0, 0);
        break;
      case "flywheels":
        camera.position.set(3.8, 2.5, 5.0);
        controls.target.set(2.8, 0, 0);
        break;
      case "top":
        camera.position.set(0, 13.0, 0.1);
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
      cameraPos: [11.0, 8.0, 12.5],
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
      roughness: 0.1,
      metalness: 0.95,
    });

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.22,
      metalness: 0.9,
    });

    const flameGlowTex = createGlowPointTexture();

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Heavy Cast-Iron Engine Bedplate
    const bedplate = new THREE.Mesh(new THREE.BoxGeometry(11.5, 0.9, 6.0), castIronMat);
    bedplate.position.y = -2.2;
    bedplate.receiveShadow = true;
    rootGroup.add(bedplate);

    // 2. Horizontal Water-Cooled Cylinder & Piston (Claim 1)
    const cylGroup = new THREE.Group();
    cylGroup.position.set(-2.8, 0, 0);
    rootGroup.add(cylGroup);

    // Cylinder Casting
    const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 4.2, 32), castIronMat);
    cylinder.rotation.z = Math.PI / 2;
    cylinder.castShadow = true;
    cylGroup.add(cylinder);

    // Trunk Piston & Connecting Rod
    const pistonGroup = new THREE.Group();
    cylGroup.add(pistonGroup);

    const piston = new THREE.Mesh(
      new THREE.CylinderGeometry(1.15, 1.15, 1.6, 24),
      polishedSteelMat,
    );
    piston.rotation.z = Math.PI / 2;
    pistonGroup.add(piston);

    // Connecting Rod
    const connRod = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.22, 0.25), polishedSteelMat);
    connRod.position.set(2.0, 0, 0);
    rootGroup.add(connRod);

    // 3. Slide-Valve Ignition Housing & Gas Flame Pocket (Claim 2)
    const slideValveGroup = new THREE.Group();
    slideValveGroup.position.set(-4.8, 0.4, 0);
    rootGroup.add(slideValveGroup);

    const valveChest = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.4, 1.2), brassMat);
    slideValveGroup.add(valveChest);

    // 4. Crankshaft & Twin Massive Spoked Flywheels
    const crankGroup = new THREE.Group();
    crankGroup.position.set(3.2, 0, 0);
    rootGroup.add(crankGroup);

    // Crankshaft
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 5.2, 16), polishedSteelMat);
    shaft.rotation.x = Math.PI / 2;
    crankGroup.add(shaft);

    // Crank Web
    const web = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.4, 0.5), polishedSteelMat);
    web.position.set(0, 0.5, 0);
    crankGroup.add(web);

    // Twin Spoked Flywheels
    [-2.2, 2.2].forEach((fz) => {
      const flywheel = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.28, 16, 48), castIronMat);
      flywheel.position.z = fz;
      flywheel.castShadow = true;
      crankGroup.add(flywheel);

      // 6 Spokes
      for (let s = 0; s < 6; s++) {
        const sAngle = (s * Math.PI) / 3;
        const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 6.2, 12), castIronMat);
        spoke.position.z = fz;
        spoke.rotation.x = sAngle;
        crankGroup.add(spoke);
      }
    });

    // 5. Ignition Flame Particle Spark
    const flameMat = new THREE.PointsMaterial({
      size: 0.8,
      map: flameGlowTex,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      color: 0xff6600,
    });
    const flameGeo = new THREE.BufferGeometry();
    flameGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([-4.2, 0.4, 0]), 3),
    );
    const flamePoint = new THREE.Points(flameGeo, flameMat);
    rootGroup.add(flamePoint);

    // Animation Loop
    let reqId: number;
    let renderedSteps = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      renderedSteps += 1;
      const delta = 1 / 60;
      const p = live.current;

      const omegaRadPerSec = (p.engineRpm * 2 * Math.PI) / 60;
      crankGroup.rotation.z -= omegaRadPerSec * delta;

      const crankAngle = -crankGroup.rotation.z;
      const strokeX = Math.cos(crankAngle) * 0.9;
      pistonGroup.position.x = strokeX;
      connRod.position.x = 1.2 + strokeX * 0.5;
      connRod.rotation.z = Math.sin(crankAngle) * 0.22;

      // 4-stroke cycle flash during power stroke
      const cyclePhase = (crankAngle / (4 * Math.PI)) % 1;
      const firing = cyclePhase > 0.5 && cyclePhase < 0.65 && p.thermalEfficiencyPct > 25;
      flameMat.opacity = firing ? 0.95 : 0;
      flameMat.size = 0.55 + (p.compressionRatio / 8) * 0.7;

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
            Otto Four-Stroke Engine 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 194,047 (1877)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["slide_valve", "Slide Valve"],
              ["cylinder_piston", "Cylinder"],
              ["flywheels", "Flywheels"],
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

      <StudioKernelChips
        visible={showUiOverlay}
        title="Otto air-standard"
        chips={[
          { label: "rpm", value: String(engineRpm) },
          { label: "r", value: `${params.compressionRatio ?? 4.5}:1` },
          {
            label: "η",
            value: String(thermalEfficiencyPct),
            unit: "%",
            tone: thermalEfficiencyPct > 25 ? "ok" : "warn",
          },
          { label: "BHP", value: powerBhp },
          { label: "P2", value: String(otto.peakCompressionBar), unit: "bar" },
          { label: "P3", value: String(otto.peakFiringBar), unit: "bar" },
        ]}
      />
    </div>
  );
}
