"use client";

import { Activity, Camera, Eye, EyeOff, Sparkles, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "wrist_plate" | "dashpots" | "flywheel" | "top";

export function CorlissSteamEngine3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Thermodynamic Simulation Parameters
  const { params, updateParam } = usePatentPhysics("us-6162-corliss-steam-engine");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const engineRpm = params.engineRpm ?? 60;
  const steamPressurePsi = params.steamPressurePsi ?? 100;
  const cutoffPct = params.cutoffPct ?? 25;
  const [_showCalloutPins, _setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  // Indicated Horsepower Calculation: IHP = (P * L * A * N * 2) / 33000
  const mepPsi =
    steamPressurePsi * (0.85 * ((1 + Math.log(100 / Math.max(cutoffPct, 10))) * (cutoffPct / 100)));
  const indicatedHp = Math.round(((mepPsi * 3.0 * (Math.PI * 9.0) * engineRpm * 2) / 33000) * 18);
  const coalSavingsPct = (35 + (25 - cutoffPct) * 0.4).toFixed(1);

  const live = useLiveSimParams({
    engineRpm,
    steamPressurePsi,
    cutoffPct,
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
        camera.position.set(12.0, 9.0, 13.0);
        controls.target.set(0, 0, 0);
        break;
      case "wrist_plate":
        camera.position.set(-2.0, 1.8, 4.5);
        controls.target.set(-1.8, 0.4, 0);
        break;
      case "dashpots":
        camera.position.set(-2.2, -0.8, 3.8);
        controls.target.set(-2.0, -1.8, 0);
        break;
      case "flywheel":
        camera.position.set(4.5, 2.5, 6.0);
        controls.target.set(3.8, 0.5, 0);
        break;
      case "top":
        camera.position.set(0, 14.0, 0.1);
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: Three.js studio lifecycle
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [12.0, 9.0, 13.0],
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

    const polishedSteelMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.12,
      metalness: 0.95,
    });

    const brassValveMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.22,
      metalness: 0.9,
    });

    const mahoganyLaggingMat = new THREE.MeshStandardMaterial({
      color: 0x5c2c16,
      roughness: 0.4,
      metalness: 0.05,
    });

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Heavy Masonry Foundation Bed & Cast Iron Sole Plate
    const foundation = new THREE.Mesh(
      new THREE.BoxGeometry(13.0, 1.2, 7.5),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 }),
    );
    foundation.position.y = -2.6;
    foundation.receiveShadow = true;
    rootGroup.add(foundation);

    // 2. Steam Cylinder with Wood Stave Lagging Jacket & 4 Valve Boxes (Claim 1)
    const cylinderGroup = new THREE.Group();
    cylinderGroup.position.set(-3.6, 0, 0);
    rootGroup.add(cylinderGroup);

    // Cylinder Body
    const cylOuter = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 1.6, 4.2, 32),
      mahoganyLaggingMat,
    );
    cylOuter.rotation.z = Math.PI / 2;
    cylOuter.castShadow = true;
    cylinderGroup.add(cylOuter);

    // Brass Retention Hoops
    [-1.6, -0.6, 0.6, 1.6].forEach((cx) => {
      const hoop = new THREE.Mesh(new THREE.TorusGeometry(1.62, 0.04, 12, 32), brassValveMat);
      hoop.rotation.y = Math.PI / 2;
      hoop.position.x = cx;
      cylinderGroup.add(hoop);
    });

    // 4 Rotary Oscillating Valve Chests (2 Top Admission, 2 Bottom Exhaust)
    const valveBoxes: THREE.Group[] = [];
    [
      [-1.4, 1.6, 0], // Front Steam
      [1.4, 1.6, 0], // Back Steam
      [-1.4, -1.6, 0], // Front Exhaust
      [1.4, -1.6, 0], // Back Exhaust
    ].forEach(([vx, vy, vz], _idx) => {
      const vGroup = new THREE.Group();
      vGroup.position.set(vx, vy, vz);

      const vHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 1.2, 16), castIronMat);
      vHousing.rotation.x = Math.PI / 2;
      vGroup.add(vHousing);

      const vArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.8, 0.15), polishedSteelMat);
      vArm.position.y = vy > 0 ? 0.5 : -0.5;
      vGroup.add(vArm);

      cylinderGroup.add(vGroup);
      valveBoxes.push(vGroup);
    });

    // 3. Central Oscillating Wrist Plate (Claim 2)
    const wristPlateGroup = new THREE.Group();
    wristPlateGroup.position.set(-3.6, 0, 1.8);
    rootGroup.add(wristPlateGroup);

    const wristPlateDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(1.1, 1.1, 0.22, 32),
      polishedSteelMat,
    );
    wristPlateDisc.rotation.x = Math.PI / 2;
    wristPlateDisc.castShadow = true;
    wristPlateGroup.add(wristPlateDisc);

    // 4 Connecting Reach Rods to Valves
    for (let r = 0; r < 4; r++) {
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 8), polishedSteelMat);
      rod.position.set(r % 2 === 0 ? -0.8 : 0.8, r < 2 ? 0.9 : -0.9, 0);
      rod.rotation.z = r % 2 === 0 ? Math.PI / 5 : -Math.PI / 5;
      wristPlateGroup.add(rod);
    }

    // 4. Vertical Air Dashpots with Leather Packing Cups
    [-4.8, -2.4].forEach((dx) => {
      const dashpot = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.6, 16), castIronMat);
      dashpot.position.set(dx, -1.8, 1.4);
      rootGroup.add(dashpot);

      const plunger = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 1.8, 12),
        polishedSteelMat,
      );
      plunger.position.set(dx, -1.0, 1.4);
      rootGroup.add(plunger);
    });

    // 5. Crosshead Slide, Guide Bars & Connecting Rod
    const crossheadGroup = new THREE.Group();
    crossheadGroup.position.set(-0.6, 0, 0);
    rootGroup.add(crossheadGroup);

    const crossheadBlock = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 0.8), polishedSteelMat);
    crossheadGroup.add(crossheadBlock);

    const pistonRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 3.2, 16),
      polishedSteelMat,
    );
    pistonRod.rotation.z = Math.PI / 2;
    pistonRod.position.x = -1.6;
    crossheadGroup.add(pistonRod);

    // Connecting Rod
    const connRod = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.22, 0.28), polishedSteelMat);
    connRod.position.set(2.0, 0, 0);
    rootGroup.add(connRod);

    // 6. Crankshaft & Massive 14-Foot Spoked Cast-Iron Flywheel
    const flywheelGroup = new THREE.Group();
    flywheelGroup.position.set(4.2, 0, 0);
    rootGroup.add(flywheelGroup);

    const wheelRim = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.32, 16, 48), castIronMat);
    wheelRim.rotation.y = Math.PI / 2;
    wheelRim.castShadow = true;
    flywheelGroup.add(wheelRim);

    // 8 Elliptical Tapered Spokes
    for (let sp = 0; sp < 8; sp++) {
      const spAngle = (sp * Math.PI) / 4;
      const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 7.0, 12), castIronMat);
      spoke.rotation.x = spAngle;
      flywheelGroup.add(spoke);
    }

    // Crank Web & Pin
    const crankWeb = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.4, 0.5), polishedSteelMat);
    crankWeb.position.set(-0.4, 0.5, 0);
    flywheelGroup.add(crankWeb);

    const crankPin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 0.6, 12),
      polishedSteelMat,
    );
    crankPin.rotation.z = Math.PI / 2;
    crankPin.position.set(-0.7, 1.0, 0);
    flywheelGroup.add(crankPin);

    // Centrifugal Flyball Governor
    const govGroup = new THREE.Group();
    govGroup.position.set(1.5, 2.2, 1.6);
    rootGroup.add(govGroup);

    const govSpindle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 2.4, 12),
      brassValveMat,
    );
    govGroup.add(govSpindle);

    [-0.5, 0.5].forEach((gx) => {
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), brassValveMat);
      ball.position.set(gx, 0.6, 0);
      govGroup.add(ball);
    });

    // Animation Loop
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;

      const omegaRadPerSec = (p.engineRpm * 2 * Math.PI) / 60;
      flywheelGroup.rotation.x += omegaRadPerSec * delta;
      govGroup.rotation.y += omegaRadPerSec * 1.5 * delta;

      const crankAngle = flywheelGroup.rotation.x;
      const strokeX = Math.sin(crankAngle) * 1.0;
      crossheadGroup.position.x = -0.6 + strokeX;
      connRod.position.x = 1.8 + strokeX * 0.5;
      connRod.rotation.z = -Math.cos(crankAngle) * 0.22;

      // Wrist-plate oscillation (harmonic)
      wristPlateGroup.rotation.z = Math.sin(crankAngle) * 0.45;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      studio.cleanup();
    };
  }, []);

  return (
    <div className="relative w-full h-[620px] bg-parchment-900 rounded-2xl overflow-hidden border border-parchment-700 shadow-2xl flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-parchment-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            Corliss Steam Engine 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 6,162 (1849)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["wrist_plate", "Wrist Plate"],
              ["dashpots", "Dashpots"],
              ["flywheel", "Flywheel"],
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
    </div>
  );
}
