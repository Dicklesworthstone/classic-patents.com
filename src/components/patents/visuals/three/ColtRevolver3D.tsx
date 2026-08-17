"use client";

import {
  Activity,
  Camera,
  Eye,
  EyeOff,
  Sparkles,
  Target,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FrankenSimEngine } from "@/physics/engine";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "cylinder" | "lockwork" | "sightline" | "top";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  powderGrain: number;
  chamberPressureMpa: number;
  cockingAngleDeg: number;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "colt_1836_paterson",
    name: "1836 Colt Paterson Original .36 Caliber",
    desc: "Samuel Colt's original 5-shot revolving cylinder with hand pawl ratchet indexing and folding trigger (US 138).",
    powderGrain: 25,
    chamberPressureMpa: 75,
    cockingAngleDeg: 45,
  },
  {
    id: "texas_walker_heavy",
    name: "Heavy 45-Grain Cavalry Load",
    desc: "High-power black powder charge generating 110 MPa chamber pressure with 340 m/s muzzle velocity and intense barrel hoop stress.",
    powderGrain: 45,
    chamberPressureMpa: 110,
    cockingAngleDeg: 45,
  },
  {
    id: "light_target_practice",
    name: "18-Grain Light Target Load",
    desc: "Mild 55 MPa target charge ensuring long cylinder life and minimal frame recoil impulse.",
    powderGrain: 18,
    chamberPressureMpa: 55,
    cockingAngleDeg: 45,
  },
  {
    id: "slow_motion_lockwork",
    name: "Slow-Motion Lockwork Inspection",
    desc: "Examine the 3-stage mechanical hand pawl advancing the cylinder ratchet exactly 60° while the bolt locks.",
    powderGrain: 28,
    chamberPressureMpa: 85,
    cockingAngleDeg: 22,
  },
];

export function ColtRevolver3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { params, updateParam } = usePatentPhysics("us-138-colt-revolver");

  // Mechanical State
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [chamberPressureMpa, setChamberPressureMpa] = useState<number>(
    params.chamberPressure ?? 85,
  );
  const [powderGrains, setPowderGrains] = useState<number>(28);
  const [cockingAngleDeg, setCockingAngleDeg] = useState<number>(45); // 0 (hammer down) to 45 (full cock)
  const [currentChamberIndex, setCurrentChamberIndex] = useState<number>(1);
  const [isFiring, setIsFiring] = useState<boolean>(false);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  // Hoop Stress & Ballistics Mechanics (FrankenSim Engine)
  const coltMech = FrankenSimEngine.stepColtRevolver({
    chamberPressureMpa,
    cockingAngleDeg,
  });

  const hoopStressMpa = coltMech.hoopStressMpa;
  const muzzleVelocityMps = coltMech.muzzleVelocityMps;
  const isFullCock = cockingAngleDeg >= 44;

  const live = useLiveSimParams({
    chamberPressureMpa,
    powderGrains,
    cockingAngleDeg,
    currentChamberIndex,
    isFiring,
    isAudioMuted,
  });

  const controlsRef = useRef<any>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const fireTimerRef = useRef<number | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (preset) {
      case "iso":
        camera.position.set(9, 5, 11);
        controls.target.set(0, 0, 0);
        break;
      case "cylinder":
        camera.position.set(0.5, 2.5, 5.5);
        controls.target.set(-0.2, 0.3, 0);
        break;
      case "lockwork":
        camera.position.set(-2.8, 1.2, 4.2);
        controls.target.set(-1.8, -0.2, 0);
        break;
      case "sightline":
        camera.position.set(-6.5, 1.8, 0);
        controls.target.set(4.0, 0.8, 0);
        break;
      case "top":
        camera.position.set(0, 12, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
  };

  const handleCockHammer = () => {
    setCockingAngleDeg(45);
    updateParam("cockingAngle", 45);
    soundEngine.playMicroswitchClick();
  };

  const handlePullTrigger = () => {
    if (!isFullCock || isFiring) return;
    setIsFiring(true);
    setCockingAngleDeg(0);
    updateParam("cockingAngle", 0);

    // Blast sound & smoke
    soundEngine.playLockstitchClack();

    if (fireTimerRef.current !== null) {
      window.clearTimeout(fireTimerRef.current);
    }
    fireTimerRef.current = window.setTimeout(() => {
      setIsFiring(false);
      setCurrentChamberIndex((prev) => (prev % 6) + 1);
    }, 900);
  };

  const applyScenario = (sc: ScenarioPreset) => {
    setPowderGrains(sc.powderGrain);
    setChamberPressureMpa(sc.chamberPressureMpa);
    setCockingAngleDeg(sc.cockingAngleDeg);
    updateParam("chamberPressure", sc.chamberPressureMpa);
    updateParam("cockingAngle", sc.cockingAngleDeg);
  };

  useEffect(() => {
    return () => {
      if (fireTimerRef.current !== null) {
        window.clearTimeout(fireTimerRef.current);
      }
    };
  }, []);

  // 3D Scene Initialization
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [9, 5, 11],
      targetPos: [0, 0, 0],
      fov: 38,
      isDark: true,
      environmentStyle: "studio",
      enableFloorGrid: true,
      floorColor: 0x0f172a,
      gridColor: 0x334155,
      ambientIntensity: 1.4,
      sunIntensity: 2.2,
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Materials
    const bluedSteelMat = new THREE.MeshStandardMaterial({
      color: 0x243242,
      metalness: 0.88,
      roughness: 0.22,
    });

    const brassFrameMat = new THREE.MeshStandardMaterial({
      color: 0xc8963e,
      metalness: 0.92,
      roughness: 0.28,
    });

    const cylinderSteelMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.85,
      roughness: 0.25,
    });

    const walnutGripMat = new THREE.MeshStandardMaterial({
      color: 0x5c3218,
      metalness: 0.05,
      roughness: 0.65,
    });

    const blastFireMat = new THREE.MeshBasicMaterial({
      color: 0xffaa22,
      transparent: true,
      opacity: 0,
    });

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Octagonal Barrel (Forward)
    const barrelGeo = new THREE.CylinderGeometry(0.38, 0.42, 5.5, 8);
    barrelGeo.rotateZ(Math.PI / 2);
    const barrelMesh = new THREE.Mesh(barrelGeo, bluedSteelMat);
    barrelMesh.position.set(2.4, 0.55, 0);
    barrelMesh.castShadow = true;
    barrelMesh.receiveShadow = true;
    rootGroup.add(barrelMesh);

    // Front Sight Post
    const sightGeo = new THREE.BoxGeometry(0.08, 0.22, 0.08);
    const sightMesh = new THREE.Mesh(sightGeo, bluedSteelMat);
    sightMesh.position.set(4.9, 0.95, 0);
    rootGroup.add(sightMesh);

    // 2. Revolving 6-Chamber Cylinder
    const cylinderGroup = new THREE.Group();
    cylinderGroup.position.set(-0.65, 0.55, 0);

    const cylinderBodyGeo = new THREE.CylinderGeometry(1.05, 1.05, 2.1, 24);
    cylinderBodyGeo.rotateZ(Math.PI / 2);
    const cylinderBodyMesh = new THREE.Mesh(cylinderBodyGeo, cylinderSteelMat);
    cylinderBodyMesh.castShadow = true;
    cylinderGroup.add(cylinderBodyMesh);

    // 6 Chamber Bores & Flutes
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const boreY = Math.cos(angle) * 0.58;
      const boreZ = Math.sin(angle) * 0.58;

      const boreGeo = new THREE.CylinderGeometry(0.24, 0.24, 2.15, 12);
      boreGeo.rotateZ(Math.PI / 2);
      const boreMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.95,
        roughness: 0.4,
      });
      const boreMesh = new THREE.Mesh(boreGeo, boreMat);
      boreMesh.position.set(0, boreY, boreZ);
      cylinderGroup.add(boreMesh);

      // Exterior Flutes
      const fluteAngle = angle + Math.PI / 6;
      const fluteY = Math.cos(fluteAngle) * 1.02;
      const fluteZ = Math.sin(fluteAngle) * 1.02;
      const fluteGeo = new THREE.CylinderGeometry(0.22, 0.22, 1.4, 8);
      fluteGeo.rotateZ(Math.PI / 2);
      const fluteMesh = new THREE.Mesh(
        fluteGeo,
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 }),
      );
      fluteMesh.position.set(0, fluteY, fluteZ);
      cylinderGroup.add(fluteMesh);
    }
    rootGroup.add(cylinderGroup);

    // 3. Center Arbor Axis Pin
    const arborGeo = new THREE.CylinderGeometry(0.18, 0.18, 4.8, 12);
    arborGeo.rotateZ(Math.PI / 2);
    const arborMesh = new THREE.Mesh(arborGeo, bluedSteelMat);
    arborMesh.position.set(0.2, 0.55, 0);
    rootGroup.add(arborMesh);

    // 4. Brass Receiver & Recoil Shield
    const receiverGeo = new THREE.BoxGeometry(2.4, 2.2, 1.4);
    const receiverMesh = new THREE.Mesh(receiverGeo, brassFrameMat);
    receiverMesh.position.set(-1.9, 0.2, 0);
    receiverMesh.castShadow = true;
    rootGroup.add(receiverMesh);

    // Recoil Shield Curved Cap
    const shieldGeo = new THREE.SphereGeometry(1.2, 16, 16, 0, Math.PI, 0, Math.PI / 2);
    shieldGeo.rotateY(Math.PI / 2);
    const shieldMesh = new THREE.Mesh(shieldGeo, brassFrameMat);
    shieldMesh.position.set(-1.75, 0.55, 0);
    rootGroup.add(shieldMesh);

    // 5. Walnut Grip Handle
    const gripGeo = new THREE.CylinderGeometry(0.65, 0.95, 2.8, 12);
    gripGeo.rotateZ(Math.PI / 7);
    const gripMesh = new THREE.Mesh(gripGeo, walnutGripMat);
    gripMesh.position.set(-3.2, -1.2, 0);
    gripMesh.castShadow = true;
    rootGroup.add(gripMesh);

    // Brass Grip Strap
    const strapGeo = new THREE.TorusGeometry(1.4, 0.14, 8, 16, Math.PI * 0.8);
    strapGeo.rotateZ(-Math.PI / 4);
    const strapMesh = new THREE.Mesh(strapGeo, brassFrameMat);
    strapMesh.position.set(-2.8, -1.0, 0);
    rootGroup.add(strapMesh);

    // 6. Trigger & Guard
    const guardGeo = new THREE.TorusGeometry(0.75, 0.08, 8, 16, Math.PI * 0.9);
    guardGeo.rotateZ(Math.PI / 2);
    const guardMesh = new THREE.Mesh(guardGeo, brassFrameMat);
    guardMesh.position.set(-1.6, -0.9, 0);
    rootGroup.add(guardMesh);

    const triggerGeo = new THREE.BoxGeometry(0.12, 0.55, 0.15);
    triggerGeo.rotateZ(Math.PI / 8);
    const triggerMesh = new THREE.Mesh(triggerGeo, bluedSteelMat);
    triggerMesh.position.set(-1.5, -0.7, 0);
    rootGroup.add(triggerMesh);

    // 7. Revolver Hammer (Pivots on cocking)
    const hammerGroup = new THREE.Group();
    hammerGroup.position.set(-2.6, 1.1, 0);

    const hammerBodyGeo = new THREE.BoxGeometry(0.4, 1.2, 0.3);
    const hammerBodyMesh = new THREE.Mesh(hammerBodyGeo, bluedSteelMat);
    hammerBodyMesh.position.set(0, 0.4, 0);
    hammerGroup.add(hammerBodyMesh);

    const spurGeo = new THREE.BoxGeometry(0.35, 0.35, 0.25);
    spurGeo.rotateZ(Math.PI / 5);
    const spurMesh = new THREE.Mesh(spurGeo, bluedSteelMat);
    spurMesh.position.set(-0.25, 0.95, 0);
    hammerGroup.add(spurMesh);

    rootGroup.add(hammerGroup);

    // 8. Muzzle Blast Spark Particles & Flash Flare
    const blastGeo = new THREE.ConeGeometry(0.8, 2.5, 12);
    blastGeo.rotateZ(-Math.PI / 2);
    const blastMesh = new THREE.Mesh(blastGeo, blastFireMat);
    blastMesh.position.set(6.2, 0.55, 0);
    rootGroup.add(blastMesh);

    // Callout Pins
    const pinGroup = new THREE.Group();
    pinGroup.visible = showCalloutPins;

    const callouts = [
      { pos: [2.5, 1.2, 0], text: "1. Octagonal Rifled Barrel" },
      { pos: [-0.65, 1.9, 0], text: "2. 6-Chamber Revolving Cylinder" },
      { pos: [-2.6, 2.4, 0], text: "3. Single-Action Spur Hammer" },
      { pos: [-1.6, -1.7, 0], text: "4. Trigger & Hand Pawl Linkage" },
      { pos: [-3.2, -2.6, 0], text: "5. Walnut Bird's-Head Grip" },
    ];

    for (const c of callouts) {
      const pinAnchor = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xf59e0b }),
      );
      pinAnchor.position.set(c.pos[0], c.pos[1], c.pos[2]);
      pinGroup.add(pinAnchor);
    }
    rootGroup.add(pinGroup);

    // Animation Loop
    let reqId = 0;
    let targetCylinderAngle = 0;
    let currentCylinderAngle = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);

      // Animate Hammer Pivot Angle
      const targetHammerRot = (live.current.cockingAngleDeg / 45) * 0.65;
      hammerGroup.rotation.z += (targetHammerRot - hammerGroup.rotation.z) * 0.15;

      // Animate Cylinder Rotation Index
      targetCylinderAngle =
        ((live.current.currentChamberIndex - 1) * Math.PI) / 3 +
        ((live.current.cockingAngleDeg / 45) * Math.PI) / 3;
      currentCylinderAngle += (targetCylinderAngle - currentCylinderAngle) * 0.12;
      cylinderGroup.rotation.x = currentCylinderAngle;

      // Firing Recoil & Muzzle Blast Flash
      if (live.current.isFiring) {
        blastFireMat.opacity = Math.max(
          0,
          blastFireMat.opacity + (0.95 - blastFireMat.opacity) * 0.4,
        );
        rootGroup.rotation.z = Math.min(0.25, rootGroup.rotation.z + 0.08);
        rootGroup.position.x = Math.max(-0.4, rootGroup.position.x - 0.08);
      } else {
        blastFireMat.opacity *= 0.75;
        rootGroup.rotation.z *= 0.85;
        rootGroup.position.x *= 0.85;
      }

      pinGroup.visible = showCalloutPins;

      controls.update();
      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      studio.dispose();
    };
  }, [showCalloutPins, live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Live Telemetry Overlay */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex flex-col gap-2 pointer-events-none max-w-xs sm:max-w-sm">
            <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  Chamber Ballistics
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px]">
                  Chamber #{currentChamberIndex} / 6
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Hoop Stress:</span>{" "}
                  <span className="font-mono font-bold text-red-600 dark:text-red-400">
                    {hoopStressMpa} MPa
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Muzzle Vel:</span>{" "}
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {muzzleVelocityMps} m/s
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Bolt Lock:</span>{" "}
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    {isFullCock || cockingAngleDeg === 0 ? "Engaged ✓" : "Retracted ⚙"}
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Action:</span>{" "}
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                    {isFullCock ? "Full Cock" : isFiring ? "Striking" : "Resting"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Camera and Mode Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap justify-end gap-1.5 sm:gap-2 max-w-[90%]">
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              showUiOverlay
                ? "bg-white/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700"
                : "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30"
            }`}
            title="Toggle HUD Telemetry"
          >
            {showUiOverlay ? (
              <EyeOff className="w-3.5 h-3.5 inline sm:mr-1" />
            ) : (
              <Eye className="w-3.5 h-3.5 inline sm:mr-1" />
            )}
            <span className="hidden md:inline">{showUiOverlay ? "Hide HUD" : "Show HUD"}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowCalloutPins(!showCalloutPins)}
            className={`p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              showCalloutPins
                ? "bg-amber-700 text-white border-amber-800 dark:bg-amber-600"
                : "bg-white/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 inline sm:mr-1" />
            <span className="hidden sm:inline">Callout Pins</span>
          </button>
          <button
            type="button"
            onClick={() => toggleEngine()}
            className={`p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              !isAudioMuted
                ? "bg-emerald-700 text-white border-emerald-800 dark:bg-emerald-600"
                : "bg-white/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700"
            }`}
          >
            {!isAudioMuted ? (
              <Volume2 className="w-3.5 h-3.5 inline sm:mr-1" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 inline sm:mr-1" />
            )}
            <span className="hidden sm:inline">{!isAudioMuted ? "Sound On" : "Muted"}</span>
          </button>
        </div>
      </div>

      {/* Preset Scenarios */}
      <div className="p-3 sm:px-5 sm:py-3 bg-parchment-200/80 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 flex flex-wrap items-center gap-2 text-xs font-sans">
        <span className="text-amber-900 dark:text-amber-300 font-serif font-bold flex items-center gap-1 mr-1">
          <Activity className="w-3.5 h-3.5 text-amber-600" /> Historic Loads:
        </span>
        {SCENARIOS.map((sc) => (
          <button
            key={sc.id}
            type="button"
            onClick={() => applyScenario(sc)}
            className="px-2.5 py-1 rounded-lg border border-parchment-300 dark:border-ink-700 bg-white/80 dark:bg-ink-800/80 hover:bg-amber-600 hover:text-white dark:hover:bg-amber-600 transition-colors font-medium text-[11px]"
          >
            {sc.name}
          </button>
        ))}
      </div>

      {/* Camera Perspectives & Action Buttons */}
      <div className="p-3 sm:px-5 sm:py-3 bg-parchment-100 dark:bg-ink-950 border-t border-parchment-200 dark:border-ink-800/70 flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
        <div className="flex flex-wrap items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 mr-1" />
          {(
            [
              ["iso", "Isometric 3D"],
              ["cylinder", "Cylinder Bores"],
              ["lockwork", "Pawl Ratchet"],
              ["sightline", "Sightline"],
              ["top", "Top Profile"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => applyCameraPreset(key)}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors border ${
                activeCamera === key
                  ? "bg-amber-700 text-white border-amber-800 font-bold"
                  : "bg-parchment-200/80 dark:bg-ink-900 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-800 hover:bg-parchment-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCockHammer}
            disabled={isFullCock || isFiring}
            className="px-3.5 py-1.5 rounded-lg border border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold text-xs hover:bg-amber-100 disabled:opacity-40 transition-colors"
          >
            1. Cock Hammer
          </button>
          <button
            type="button"
            onClick={handlePullTrigger}
            disabled={!isFullCock || isFiring}
            className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs disabled:opacity-40 transition-colors shadow-sm"
          >
            <Zap className="w-3.5 h-3.5" />
            2. Pull Trigger
          </button>
        </div>
      </div>

      {/* Parameter Sliders Panel */}
      <div className="p-4 sm:p-5 bg-parchment-100/80 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
        <div className="space-y-1.5">
          <div className="flex justify-between font-mono">
            <span className="font-semibold text-ink-800 dark:text-parchment-200">
              Chamber Pressure:
            </span>
            <span className="text-red-700 dark:text-red-400 font-bold">
              {chamberPressureMpa} MPa
            </span>
          </div>
          <input
            type="range"
            aria-label="Chamber Combustion Pressure"
            min="40"
            max="130"
            value={chamberPressureMpa}
            onChange={(e) => {
              const val = Number(e.target.value);
              setChamberPressureMpa(val);
              updateParam("chamberPressure", val);
            }}
            className="w-full accent-red-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between font-mono">
            <span className="font-semibold text-ink-800 dark:text-parchment-200">
              Hammer Cocking:
            </span>
            <span className="text-amber-700 dark:text-amber-400 font-bold">{cockingAngleDeg}°</span>
          </div>
          <input
            type="range"
            aria-label="Hammer Cocking Angle"
            min="0"
            max="45"
            value={cockingAngleDeg}
            onChange={(e) => {
              const val = Number(e.target.value);
              setCockingAngleDeg(val);
              updateParam("cockingAngle", val);
            }}
            className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between font-mono">
            <span className="font-semibold text-ink-800 dark:text-parchment-200">
              Black Powder Charge:
            </span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">
              {powderGrains} Grains
            </span>
          </div>
          <input
            type="range"
            aria-label="Black Powder Charge"
            min="15"
            max="50"
            value={powderGrains}
            onChange={(e) => setPowderGrains(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
