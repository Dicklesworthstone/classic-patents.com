"use client";

import { Activity, Camera, Eye, EyeOff, Sparkles, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { stepSholesTypewriter } from "@/physics/machineKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "type_basket" | "platen_carriage" | "keyboard" | "top";

export function SholesTypewriter3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);

  // Typewriter Kinematics Parameters
  const { params, updateParam } = usePatentPhysics("us-79265-sholes-typewriter");
  const typingWpm = params.typingSpeedWpm ?? 45;
  const sholesIdle = stepSholesTypewriter(typingWpm, 0);
  const charsPerSecond = sholesIdle.cps.toFixed(1);
  const escapementStepMm = sholesIdle.pitchMm;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    typingWpm,
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
        camera.position.set(9.0, 7.5, 10.5);
        controls.target.set(0, 0, 0);
        break;
      case "type_basket":
        camera.position.set(0, 2.2, 3.5);
        controls.target.set(0, 0.4, 0);
        break;
      case "platen_carriage":
        camera.position.set(0, 3.2, 2.8);
        controls.target.set(0, 1.8, -0.4);
        break;
      case "keyboard":
        camera.position.set(0, 1.5, 4.2);
        controls.target.set(0, -0.8, 1.4);
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
    const japannedCastIronMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.25,
      metalness: 0.8,
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

    const ivoryKeyMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.35,
      metalness: 0.05,
    });

    const rubberPlatenMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.7,
      metalness: 0.05,
    });

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Japanned sewing-machine table + C-frame (not a solid crate)
    const table = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.28, 5.4), japannedCastIronMat);
    table.position.y = -1.55;
    table.castShadow = true;
    table.receiveShadow = true;
    rootGroup.add(table);
    [
      [-3.2, -2.2],
      [3.2, -2.2],
      [-3.2, 2.0],
      [3.2, 2.0],
    ].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.22, 2.4, 12),
        japannedCastIronMat,
      );
      leg.position.set(lx, -2.9, lz);
      rootGroup.add(leg);
    });
    const rearColumn = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.6, 1.1), japannedCastIronMat);
    rearColumn.position.set(0, -0.15, -2.1);
    rearColumn.castShadow = true;
    rootGroup.add(rearColumn);
    const topDeck = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.18, 1.6), japannedCastIronMat);
    topDeck.position.set(0, 1.15, -1.4);
    rootGroup.add(topDeck);

    // 2. Up-Striking Type-Basket with Radial Bars (Claim 1)
    const basketGroup = new THREE.Group();
    basketGroup.position.set(0, 0.4, 0);
    rootGroup.add(basketGroup);

    const basketRing = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.12, 12, 32), brassMat);
    basketRing.rotation.x = Math.PI / 2;
    basketGroup.add(basketRing);

    // Radial Type-Bars Converging Under Platen
    const typeBars: THREE.Mesh[] = [];
    for (let t = 0; t < 24; t++) {
      const tAngle = (t * Math.PI * 2) / 24;
      const bar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 1.4, 8),
        polishedSteelMat,
      );
      bar.position.set(Math.cos(tAngle) * 0.8, -0.4, Math.sin(tAngle) * 0.8);
      bar.rotation.z = Math.sin(tAngle) * 0.45;
      bar.rotation.x = Math.cos(tAngle) * 0.45;
      basketGroup.add(bar);
      typeBars.push(bar);
    }

    // Active Striking Type Hammer
    const activeHammer = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 1.6, 8),
      polishedSteelMat,
    );
    activeHammer.position.set(0, -0.2, 0.6);
    basketGroup.add(activeHammer);

    // 3. Platen Carriage & Escapement Wheel (Claim 2)
    const carriageGroup = new THREE.Group();
    carriageGroup.position.set(0, 1.8, -0.2);
    rootGroup.add(carriageGroup);

    const platen = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 5.2, 24), rubberPlatenMat);
    platen.rotation.z = Math.PI / 2;
    platen.castShadow = true;
    carriageGroup.add(platen);

    // Paper Sheet Wrapped on Platen
    const paper = new THREE.Mesh(
      new THREE.CylinderGeometry(0.52, 0.52, 4.4, 24, 1, true, 0, Math.PI * 1.5),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }),
    );
    paper.rotation.z = Math.PI / 2;
    carriageGroup.add(paper);

    // Escapement Ratchet Wheel
    const escapement = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.1, 16), brassMat);
    escapement.rotation.z = Math.PI / 2;
    escapement.position.x = 2.8;
    carriageGroup.add(escapement);

    // 4. Keyboard Array (4 Rows of Ivory Keys)
    const keyboardGroup = new THREE.Group();
    keyboardGroup.position.set(0, -0.4, 2.2);
    rootGroup.add(keyboardGroup);

    for (let r = 0; r < 3; r++) {
      for (let k = 0; k < 10; k++) {
        const key = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.18, 16), ivoryKeyMat);
        key.position.set(-1.8 + k * 0.4, -r * 0.25, -r * 0.35);
        keyboardGroup.add(key);
      }
    }

    let reqId: number;
    const clock = new THREE.Clock();
    const restBarRot: Array<{ x: number; z: number }> = typeBars.map((b) => ({
      x: b.rotation.x,
      z: b.rotation.z,
    }));

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const p = live.current;
      const step = stepSholesTypewriter(p.typingWpm, clock.getElapsedTime());

      activeHammer.rotation.x = step.hammerAngleRad;
      typeBars.forEach((bar, i) => {
        const rest = restBarRot[i];
        const striking = i === step.barIndex && step.strikePhase < 0.28;
        bar.rotation.x = rest.x + (striking ? step.hammerAngleRad * 0.55 : 0);
        bar.rotation.z = rest.z;
      });
      // 10-pitch carriage: 2.54 mm/char → scene units (~0.012 per mm)
      carriageGroup.position.x = 1.2 - step.carriageXMm * 0.012;

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
            Sholes Type-Writer 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 79,265 (1868)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["type_basket", "Type Basket"],
              ["platen_carriage", "Platen Carriage"],
              ["keyboard", "Keyboard"],
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
    </div>
  );
}
