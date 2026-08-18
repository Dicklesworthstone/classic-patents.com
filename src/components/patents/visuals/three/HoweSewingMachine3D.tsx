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
import { stepHoweLockstitch } from "@/physics/machineKernels";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "needle" | "shuttle" | "flywheel" | "top";

export function HoweSewingMachine3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mechanical Stitching State Controls
  const { params } = usePatentPhysics("us-4750-howe-sewing-machine");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const stitchingSpeedRpm = params.crankRpm ?? 240;
  const stitchPitchMm = params.stitchPitchMm ?? 3.5;
  const threadTensionGrams = params.threadTensionGrams ?? 45;
  const isCranking = params.isCranking !== 0;
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  // Lockstitch Kinematics Calculations (FrankenSim 4-Bar Mechanism)
  const stitchState = FrankenSimEngine.stepHoweSewingMachine(
    stitchingSpeedRpm,
    threadTensionGrams,
    stitchPitchMm,
  );

  useFrankenSimPhysics("us-4750-howe-sewing-machine", {
    domain: "continuum_elasticity",
    timestampMs: Date.now(),
    timeStepDt: 0.016,
    refusal: { isRefused: false },
    continuum: {
      tensileStressMpa: 0,
      tensileStrainPct: 0,
      elasticModulusGpa: 0,
      crossLinkDensityMolesPerCm3: 0,
      stitchFrequencyHz: stitchState.stitchFrequencyHz,
      feedVelocityMmPs: stitchState.clothFeedMmPerS,
      buoyancyLiftForceKiloNewtons: 0,
    },
  });
  const stitchesPerSecond = stitchState.stitchFrequencyHz.toFixed(1);
  const clothFeedRateMmPerSec = stitchState.clothFeedMmPerS.toFixed(1);

  const live = useLiveSimParams({
    stitchingSpeedRpm,
    isCranking,
    stitchPitchMm,
    clothFeedRateMmPerSec,
    threadTensionGrams,
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

    // 4 Victorian Fluted Table Legs with Turned Ball Feet
    [
      [-4.8, -2.6],
      [4.8, -2.6],
      [-4.8, 2.6],
      [4.8, 2.6],
    ].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.28, 1.8, 24), castIronMat);
      leg.position.set(lx, -3.45, lz);
      machineGroup.add(leg);

      const foot = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), brassMat);
      foot.position.set(lx, -4.35, lz);
      machineGroup.add(foot);
    });

    // Vertical Overhanging Arm Casting (C-frame) with Archival Fillets
    const armColumn = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.2, 4.2, 32), castIronMat);
    armColumn.position.set(-3.2, 0, 0);
    armColumn.castShadow = true;
    machineGroup.add(armColumn);

    const overhangingArm = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.9, 1.4), castIronMat);
    overhangingArm.position.set(0, 2.1, 0);
    overhangingArm.castShadow = true;
    machineGroup.add(overhangingArm);

    // Upper Spool Spindle with Wooden Thread Bobbin
    const spoolSpindle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 1.4, 12),
      polishedSteelMat,
    );
    spoolSpindle.position.set(-1.8, 3.2, 0);
    machineGroup.add(spoolSpindle);

    const threadSpool = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.45, 0.9, 24),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.8 }),
    );
    threadSpool.position.set(-1.8, 3.0, 0);
    machineGroup.add(threadSpool);

    // Rotary Thread Tensioner Discs & Knurled Adjuster Nut
    const tensionGroup = new THREE.Group();
    tensionGroup.position.set(0.6, 2.6, 0.72);

    const disc1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.32, 0.05, 24),
      polishedSteelMat,
    );
    disc1.rotation.x = Math.PI / 2;
    tensionGroup.add(disc1);

    const disc2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.32, 0.05, 24),
      polishedSteelMat,
    );
    disc2.rotation.x = Math.PI / 2;
    disc2.position.z = 0.06;
    tensionGroup.add(disc2);

    const knurledNut = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.15, 16), brassMat);
    knurledNut.rotation.x = Math.PI / 2;
    knurledNut.position.z = 0.15;
    tensionGroup.add(knurledNut);
    machineGroup.add(tensionGroup);

    // Spoked Hand Flywheel with Wooden Turning Handle
    const flywheelGroup = new THREE.Group();
    flywheelGroup.position.set(-3.8, 2.1, 0);

    const wheelRim = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.22, 24, 48), brassMat);
    wheelRim.rotation.y = Math.PI / 2;
    wheelRim.castShadow = true;
    flywheelGroup.add(wheelRim);

    for (let s = 0; s < 6; s++) {
      const sAngle = (s * Math.PI) / 3;
      const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.4, 16), brassMat);
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
      new THREE.CylinderGeometry(0.22, 0.22, 0.9, 24),
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
    const needleGeo = new THREE.TubeGeometry(needleCurve, 32, 0.045, 12, false);
    const needleMesh = new THREE.Mesh(needleGeo, polishedSteelMat);
    needleMesh.castShadow = true;
    needleArmGroup.add(needleMesh);

    const eyeMesh = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.02, 10, 16), polishedSteelMat);
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
    const shuttleGeo = new THREE.LatheGeometry(shuttlePoints, 32);
    const shuttleBody = new THREE.Mesh(shuttleGeo, brassMat);
    shuttleBody.rotation.x = Math.PI / 2;
    shuttleBody.castShadow = true;
    shuttleGroup.add(shuttleBody);

    const bobbin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.8, 24),
      polishedSteelMat,
    );
    bobbin.rotation.z = Math.PI / 2;
    shuttleGroup.add(bobbin);

    machineGroup.add(shuttleGroup);

    // Baster Clamping Plate & Projecting Steel Feed Pins (Claim 3)
    const basterPlate = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.2, 5.0), polishedSteelMat);
    basterPlate.position.set(2.3, -1.2, 0);
    machineGroup.add(basterPlate);

    // 8 Projecting Steel Baster Pins holding fabric
    for (let pin = 0; pin < 8; pin++) {
      const pinZ = -2.0 + pin * 0.55;
      const feedPin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.35, 8),
        polishedSteelMat,
      );
      feedPin.rotation.z = Math.PI / 2;
      feedPin.position.set(2.45, -1.2, pinZ);
      machineGroup.add(feedPin);
    }

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
      const crankDeg = ((crankAngle * 180) / Math.PI) % 360;
      const stitch = stepHoweLockstitch(crankDeg);

      if (p.isCranking) {
        flywheelGroup.rotation.x = crankAngle;
        needleArmGroup.rotation.z = (stitch.needleY / 45) * 0.45;
        needleArmGroup.position.y = 1.2 + stitch.needleY / 90;
        shuttleGroup.position.z = (stitch.shuttleX / 60) * 1.2;
        shuttleGroup.position.x = 2.8 + (stitch.loopOpen ? stitch.loopWidth / 80 : 0);
        threadMesh.visible = stitch.loopOpen;
        threadMesh.scale.z = stitch.loopOpen ? 1 + stitch.loopWidth / 24 : 1;

        cloth.position.x = 0.5 - ((elapsed * Number(p.clothFeedRateMmPerSec) * 0.1) % 2.0);

        // Acoustic clack synthesis on each stitch stroke bottom dead-center
        const currentCycle = Math.floor(crankAngle / (2 * Math.PI));
        if (currentCycle !== prevStitchCycle) {
          prevStitchCycle = currentCycle;
          let seed = currentCycle * 12345 + 6789;
          const lcg = () => {
            seed = (seed * 1664525 + 1013904223) % 4294967296;
            return seed / 4294967296;
          };
          if (!p.isAudioMuted && lcg() < 0.8) {
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
                  <span className="text-ink-600 dark:text-ink-400">Lock shear:</span>{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {stitchState.lockstitchShearStrengthN} N
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
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
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
            aria-label={isAudioMuted ? "Unmute simulation audio" : "Mute simulation audio"}
            type="button"
            onClick={toggleSound}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isAudioMuted ? "Enable Sound Synthesis" : "Mute Sound"}
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            )}
          </button>
          <button
            aria-label={showCalloutPins ? "Hide annotation pins" : "Show annotation pins"}
            type="button"
            onClick={() => setShowCalloutPins(!showCalloutPins)}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showCalloutPins
                ? "bg-amber-600 text-white border-amber-700 shadow-md"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title="Toggle Historical Patent Numeral Pins"
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
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
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-sans whitespace-nowrap shrink-0 transition-colors ${
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
    </div>
  );
}
