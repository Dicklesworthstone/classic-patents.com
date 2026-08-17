"use client";

import {
  Camera,
  Eye,
  EyeOff,
  RotateCcw,
  Scissors,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FrankenSimEngine } from "@/physics/engine";
import { soundEngine } from "@/utils/soundEngine";
import { createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "needle" | "shuttle" | "flywheel" | "top";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  rpm: number;
  pitch: number;
  tension: number;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "howe_1846_patent",
    name: "1846 Howe Lockstitch Demonstration",
    desc: "Elias Howe Jr.'s original eye-pointed needle and reciprocating shuttle creating interlocking dual-thread stitches (US 4,750).",
    rpm: 240,
    pitch: 3.5,
    tension: 45,
  },
  {
    id: "heavy_canvas_leather",
    name: "Heavy Canvas / Leatherwork",
    desc: "Slow 120 RPM hand-crank drive piercing thick multi-ply textile with high 85g thread tension and wide 5.0mm pitch.",
    rpm: 120,
    pitch: 5.0,
    tension: 85,
  },
  {
    id: "high_speed_production",
    name: "Industrial High-Speed Seaming",
    desc: "420 RPM continuous seamstress drive delivering 35 mm/s feed rate—over 25× faster than manual hand-needle sewing.",
    rpm: 420,
    pitch: 2.8,
    tension: 55,
  },
  {
    id: "fine_silk_delicate",
    name: "Delicate Victorian Silk Stitching",
    desc: "Low-tension 25g fine stitch cycle preventing delicate fabric puckering or needle shearing.",
    rpm: 180,
    pitch: 1.8,
    tension: 25,
  },
  {
    id: "slow_demo",
    name: "Slow-Motion Lockstitch Breakdown",
    desc: "60 RPM demonstration showing needle thread loop dilation and boat shuttle pass-through.",
    rpm: 60,
    pitch: 4.0,
    tension: 50,
  },
];

export function HoweSewingMachine3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mechanical Stitching State Controls
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [stitchingSpeedRpm, setStitchingSpeedRpm] = useState<number>(240);
  const [stitchPitchMm, setStitchPitchMm] = useState<number>(3.5);
  const [threadTensionGrams, setThreadTensionGrams] = useState<number>(45);
  const [isCranking, setIsCranking] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  // Lockstitch Kinematics Calculations (FrankenSim 4-Bar Mechanism)
  const stitchState = FrankenSimEngine.stepHoweSewingMachine(stitchingSpeedRpm, threadTensionGrams);
  const stitchesPerSecond = stitchState.stitchFrequencyHz.toFixed(1);
  const clothFeedRateMmPerSec = (stitchState.stitchFrequencyHz * stitchPitchMm).toFixed(1);
  const handSewingSpeedRatio = (Number(clothFeedRateMmPerSec) / 1.2).toFixed(1);

  const live = useLiveSimParams({
    stitchingSpeedRpm,
    isCranking,
    stitchPitchMm,
    clothFeedRateMmPerSec,
    threadTensionGrams,
    isAudioMuted,
  });

  const controlsRef = useRef<any>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (preset) {
      case "iso":
        camera.position.set(11, 8, 13);
        controls.target.set(0, 0, 0);
        break;
      case "needle":
        camera.position.set(3.2, 0.4, 3.0);
        controls.target.set(2.8, -1.0, 0);
        break;
      case "shuttle":
        camera.position.set(2.8, -1.2, 2.5);
        controls.target.set(2.8, -1.5, 0);
        break;
      case "flywheel":
        camera.position.set(-4.5, 2.2, 3.5);
        controls.target.set(-3.8, 2.1, 0);
        break;
      case "top":
        camera.position.set(1.0, 7.0, 0.1);
        controls.target.set(1.0, 0, 0);
        break;
    }
    controls.update();
  };

  const applyScenario = (s: ScenarioPreset) => {
    setStitchingSpeedRpm(s.rpm);
    setStitchPitchMm(s.pitch);
    setThreadTensionGrams(s.tension);
    if (!isAudioMuted) {
      soundEngine.playLockstitchClack();
    }
  };

  const toggleSound = () => {
    toggleEngine(() => {
      soundEngine.playLockstitchClack();
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [11, 8, 13],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // --- PBR MATERIALS ---
    const castIronMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.35,
      metalness: 0.85,
    });

    const polishedSteelMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.08,
      metalness: 0.95,
    });

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.18,
      metalness: 0.9,
    });

    const needleThreadMat = new THREE.MeshBasicMaterial({
      color: 0xef4444, // Upper needle thread (Red)
    });

    const clothFabricMat = new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      roughness: 0.75,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    // --- 3D HOWE LOCKSTITCH MACHINE ASSEMBLY ---
    const machineGroup = new THREE.Group();
    scene.add(machineGroup);

    // Cast-Iron Base Plate & Cloth Bed with Arch Stanchions
    const bedPlate = new THREE.Mesh(new THREE.BoxGeometry(11.0, 0.7, 6.5), castIronMat);
    bedPlate.position.y = -2.2;
    bedPlate.castShadow = true;
    bedPlate.receiveShadow = true;
    machineGroup.add(bedPlate);

    // 4 Victorian Fluted Table Legs
    [
      [-4.8, -2.6],
      [4.8, -2.6],
      [-4.8, 2.6],
      [4.8, 2.6],
    ].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.28, 1.8, 16), castIronMat);
      leg.position.set(lx, -3.45, lz);
      machineGroup.add(leg);
    });

    // Vertical Overhanging Arm Casting (C-frame)
    const armColumn = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.2, 4.2, 24), castIronMat);
    armColumn.position.set(-3.2, 0, 0);
    armColumn.castShadow = true;
    machineGroup.add(armColumn);

    const overhangingArm = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.9, 1.4), castIronMat);
    overhangingArm.position.set(0, 2.1, 0);
    overhangingArm.castShadow = true;
    machineGroup.add(overhangingArm);

    // Spoked Hand Flywheel with Wooden Turning Handle
    const flywheelGroup = new THREE.Group();
    flywheelGroup.position.set(-3.8, 2.1, 0);

    const wheelRim = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.22, 16, 36), brassMat);
    wheelRim.rotation.y = Math.PI / 2;
    wheelRim.castShadow = true;
    flywheelGroup.add(wheelRim);

    for (let s = 0; s < 6; s++) {
      const sAngle = (s * Math.PI) / 3;
      const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.4, 12), brassMat);
      spoke.rotation.x = sAngle;
      flywheelGroup.add(spoke);
    }

    const crankPin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 1.2, 12),
      polishedSteelMat,
    );
    crankPin.rotation.z = Math.PI / 2;
    crankPin.position.set(-0.6, 1.7, 0);
    flywheelGroup.add(crankPin);

    const handleGrip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.9, 16),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.35 }),
    );
    handleGrip.rotation.z = Math.PI / 2;
    handleGrip.position.set(-0.8, 1.7, 0);
    flywheelGroup.add(handleGrip);

    machineGroup.add(flywheelGroup);

    // Elias Howe's Signature Curved Oscillating Needle Arm (Claim 1)
    const needleArmGroup = new THREE.Group();
    needleArmGroup.position.set(2.8, 1.2, 0);

    const needleArmBeam = new THREE.Mesh(new THREE.BoxGeometry(0.22, 2.6, 0.35), polishedSteelMat);
    needleArmBeam.castShadow = true;
    needleArmGroup.add(needleArmBeam);

    // Curved Eye-Pointed Steel Needle (Arc Radius matching arm stroke)
    const needleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -1.2, 0),
      new THREE.Vector3(0.08, -1.8, 0.05),
      new THREE.Vector3(0, -2.4, 0),
    ]);
    const needleGeo = new THREE.TubeGeometry(needleCurve, 20, 0.045, 8, false);
    const needleMesh = new THREE.Mesh(needleGeo, polishedSteelMat);
    needleMesh.castShadow = true;
    needleArmGroup.add(needleMesh);

    const eyeMesh = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.02, 8, 12), polishedSteelMat);
    eyeMesh.position.set(0, -2.35, 0);
    needleArmGroup.add(eyeMesh);

    machineGroup.add(needleArmGroup);

    // Oscillating Boat Shuttle Carriage in Circular Race (Claim 2)
    const shuttleGroup = new THREE.Group();
    shuttleGroup.position.set(2.8, -1.5, 0);

    const shuttlePoints: THREE.Vector2[] = [];
    shuttlePoints.push(new THREE.Vector2(0.01, 1.2));
    shuttlePoints.push(new THREE.Vector2(0.28, 0.6));
    shuttlePoints.push(new THREE.Vector2(0.32, 0));
    shuttlePoints.push(new THREE.Vector2(0.28, -0.6));
    shuttlePoints.push(new THREE.Vector2(0.01, -1.2));
    const shuttleGeo = new THREE.LatheGeometry(shuttlePoints, 24);
    const shuttleBody = new THREE.Mesh(shuttleGeo, brassMat);
    shuttleBody.rotation.x = Math.PI / 2;
    shuttleBody.castShadow = true;
    shuttleGroup.add(shuttleBody);

    const bobbin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.8, 16),
      polishedSteelMat,
    );
    bobbin.rotation.z = Math.PI / 2;
    shuttleGroup.add(bobbin);

    machineGroup.add(shuttleGroup);

    // Baster Clamping Plate & Cloth Feed Workpiece (Claim 3)
    const basterPlate = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.2, 5.0), polishedSteelMat);
    basterPlate.position.set(2.3, -1.2, 0);
    machineGroup.add(basterPlate);

    const cloth = new THREE.Mesh(new THREE.BoxGeometry(8.0, 0.1, 4.0), clothFabricMat);
    cloth.position.set(0.5, -1.75, 0);
    cloth.castShadow = true;
    cloth.receiveShadow = true;
    machineGroup.add(cloth);

    // --- 3D INTERLOCKING LOCKSTITCH THREAD PATHS ---
    const threadCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(2.8, 3.2, 0),
      new THREE.Vector3(2.8, 1.2, 0),
      new THREE.Vector3(2.8, -1.8, 0),
      new THREE.Vector3(1.5, -1.75, 0),
    ]);
    const threadGeo = new THREE.TubeGeometry(threadCurve, 30, 0.03, 6, false);
    const threadMesh = new THREE.Mesh(threadGeo, needleThreadMat);
    machineGroup.add(threadMesh);

    // --- RENDER LOOP & REAL-TIME LOCKSTITCH KINEMATICS ---
    let reqId: number;
    const clock = new THREE.Clock();
    let prevStitchCycle = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const _delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const p = live.current;

      const omega = (p.stitchingSpeedRpm / 60) * 2 * Math.PI;
      const crankAngle = elapsed * omega;

      if (p.isCranking) {
        flywheelGroup.rotation.x = crankAngle;
        const needleAngle = Math.cos(crankAngle) * 0.45;
        needleArmGroup.rotation.z = needleAngle;

        const shuttleZ = Math.sin(crankAngle) * 1.2;
        shuttleGroup.position.z = shuttleZ;

        cloth.position.x = 0.5 - ((elapsed * Number(p.clothFeedRateMmPerSec) * 0.1) % 2.0);

        // Acoustic clack synthesis on each stitch stroke bottom dead-center
        const currentCycle = Math.floor(crankAngle / (2 * Math.PI));
        if (currentCycle !== prevStitchCycle) {
          prevStitchCycle = currentCycle;
          if (!p.isAudioMuted && Math.random() < 0.8) {
            soundEngine.playLockstitchClack();
          }
        }
      }

      // Tension tautens the needle thread; slack (<20 g) sags, over-tight (>80 g) goes wire-thin.
      const tension = p.threadTensionGrams;
      const taut = Math.min(1.8, Math.max(0.35, tension / 45));
      threadMesh.scale.set(1, taut, taut);
      threadMesh.position.y = tension < 22 ? -0.18 : 0;
      needleThreadMat.color.setHex(tension > 80 ? 0xf97316 : 0xef4444);

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      studio.dispose();
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Live HUD Telemetry Overlay */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-col gap-1.5 sm:gap-2 pointer-events-none max-w-[calc(100%-8rem)] sm:max-w-md transition-opacity duration-200">
            <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md p-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
              <div className="text-[10px] sm:text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Scissors className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 animate-pulse" />
                Lockstitch Kinematics Telemetry
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 sm:gap-y-1 mt-1 text-[10px] sm:text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Velocity:</span>{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {stitchingSpeedRpm} RPM ({stitchesPerSecond} Hz)
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Feed:</span>{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {clothFeedRateMmPerSec} mm/s
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Productivity:</span>{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {handSewingSpeedRatio}× vs Hand
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Tension:</span>{" "}
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {threadTensionGrams} g
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 items-center gap-2 max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse shrink-0" />
              <span className="truncate">Elias Howe Jr. (US 4,750) — Sewing Machine (1846)</span>
            </div>
          </div>
        )}

        {/* Top Right Tool Bar (Toggle UI, Audio, Pins, Reset) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-all shadow-sm ${
              showUiOverlay
                ? "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
                : "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
            }`}
            title={showUiOverlay ? "Hide Overlay UI (Clean 3D View)" : "Show Overlay UI"}
            aria-label={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
          >
            {showUiOverlay ? (
              <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={toggleSound}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-all shadow-sm"
            title={isAudioMuted ? "Enable Sound Synthesis" : "Mute Sound"}
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowCalloutPins(!showCalloutPins)}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-all shadow-sm ${
              showCalloutPins
                ? "bg-amber-600 text-white border-amber-700 shadow-md"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title="Toggle Historical Patent Numeral Pins"
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-all shadow-sm"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Camera Views Bar */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-1.5rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["needle", "Needle Point"],
                ["shuttle", "Boat Shuttle"],
                ["flywheel", "Flywheel Crank"],
                ["top", "Cloth Feed"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => applyCameraPreset(id)}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-sans whitespace-nowrap shrink-0 transition-all ${
                  activeCamera === id
                    ? "bg-amber-700 dark:bg-amber-600 text-white font-semibold shadow-xs"
                    : "text-ink-700 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Controls & Scenario Bar */}
      <div className="p-4 sm:p-5 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 space-y-4">
        {/* Scenario Presets */}
        <div className="space-y-1.5">
          <div className="text-xs font-sans font-bold text-ink-700 dark:text-ink-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Historical Stitching Presets:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => applyScenario(s)}
                className="p-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 bg-white/70 dark:bg-ink-950/70 hover:bg-parchment-50 dark:hover:bg-ink-800 text-left transition-all group"
              >
                <div className="text-xs font-serif font-bold text-ink-900 dark:text-parchment-100 group-hover:text-amber-700 dark:group-hover:text-amber-400">
                  {s.name}
                </div>
                <div className="text-[10px] font-sans text-ink-500 dark:text-ink-400 line-clamp-2 mt-0.5">
                  {s.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Stitching Speed */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="font-semibold text-ink-800 dark:text-parchment-200">
                Treadle Crank Speed:
              </span>
              <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">
                {stitchingSpeedRpm} RPM
              </span>
            </div>
            <input
              type="range"
              min="60"
              max="600"
              step="20"
              value={stitchingSpeedRpm}
              onChange={(e) => setStitchingSpeedRpm(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
              Harmonic crank shaft oscillation frequency
            </span>
          </div>

          {/* Stitch Pitch Length */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="font-semibold text-ink-800 dark:text-parchment-200">
                Stitch Length (Pitch):
              </span>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                {stitchPitchMm.toFixed(1)} mm
              </span>
            </div>
            <input
              type="range"
              min="1.5"
              max="6.0"
              step="0.5"
              value={stitchPitchMm}
              onChange={(e) => setStitchPitchMm(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
              Baster plate feed advance per stroke
            </span>
          </div>

          {/* Needle-thread tension */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="font-semibold text-ink-800 dark:text-parchment-200">
                Needle-Thread Tension:
              </span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                {threadTensionGrams} g
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="90"
              step="5"
              value={threadTensionGrams}
              onChange={(e) => setThreadTensionGrams(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
              Slack below 20 g · pucker above 80 g
            </span>
          </div>

          {/* Crank Pause Toggle */}
          <div className="flex flex-col justify-end space-y-1.5">
            <button
              type="button"
              onClick={() => setIsCranking(!isCranking)}
              className={`w-full py-3 px-4 rounded-xl font-sans font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 ${
                isCranking
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                  : "bg-amber-600 hover:bg-amber-700 text-white shadow-md"
              }`}
            >
              <Scissors className="w-4 h-4" />
              {isCranking ? "Crank Drive RUNNING" : "Crank PAUSED (Inspect Mechanism)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
