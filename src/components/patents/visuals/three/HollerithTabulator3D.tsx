"use client";

import { Camera, Play, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FrankenSimEngine } from "@/physics/engine";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "press" | "dials" | "sorter";

export function HollerithTabulator3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { params, updateParam } = usePatentPhysics("us-395781-hollerith-tabulating");

  const cardsProcessed = params.cardsProcessed ?? 1890;
  const tabulatingSpeedCpm = params.cardsPerMin ?? params.tabulatingSpeed ?? 60;
  const hollerith = FrankenSimEngine.stepHollerithTabulating({
    cardsPerMin: tabulatingSpeedCpm,
    supplyVoltageV: params.batteryVolts ?? 12,
    activeRelays: params.activeRelays ?? 8,
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const { isMuted, toggleMute } = usePatentAudio();

  const live = useLiveSimParams({
    cardsProcessed,
    tabulatingSpeedCpm,
    isPlaying,
    cycleTimeMs: hollerith.cycleTimeMs,
    solenoidForceN: hollerith.solenoidForceN,
    activeRelays: params.activeRelays ?? 8,
  });

  const studioRef = useRef<StudioContext | null>(null);
  const animRef = useRef<number | null>(null);
  const pressHandleRef = useRef<THREE.Mesh | null>(null);
  const dialsRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [7.5, 4.2, 7.5],
      targetPos: [0, 0.4, 0],
      fov: 38,
      environmentStyle: "sky",
      enableClouds: true,
      enableFloorGrid: true,
      floorColor: 0x0f172a,
    });
    studioRef.current = studio;
    const { scene, renderer } = studio;

    // --- MATERIALS ---
    const mahoganyWood = new THREE.MeshStandardMaterial({
      color: 0x5c2c16,
      roughness: 0.45,
      metalness: 0.05,
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.9,
    });
    const clockEnamel = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.3,
      metalness: 0.1,
    });
    const cardManila = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.6,
      metalness: 0.0,
    });
    const castIronMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.8,
    });

    // --- 1. MAHOGANY DESK & FOUNDATION ---
    const desk = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.4, 4.2), mahoganyWood);
    desk.position.set(0, -1.2, 0);
    desk.castShadow = true;
    desk.receiveShadow = true;
    scene.add(desk);

    // 4 Turned Desk Legs
    for (const [lx, lz] of [
      [-2.8, -1.8],
      [2.8, -1.8],
      [-2.8, 1.8],
      [2.8, 1.8],
    ]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 2.2, 12), mahoganyWood);
      leg.position.set(lx, -2.3, lz);
      scene.add(leg);
    }

    // --- 2. PIN PRESS READER WITH MERCURY CUPS ---
    const pressG = new THREE.Group();
    pressG.position.set(-1.6, -0.6, 0.6);

    // Press Base Plate with 288 Mercury Wells
    const pressBase = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.2, 2.2), castIronMat);
    pressBase.castShadow = true;
    pressG.add(pressBase);

    // Punched Card lying on reader bed
    const cardMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.02, 1.8), cardManila);
    cardMesh.position.set(0, 0.12, 0);
    pressG.add(cardMesh);

    // Upper hinged Pin-Press Arm (with spring-loaded brass contact pins)
    const pinPlate = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.15, 2.0), brassMat);
    pinPlate.position.set(0, 0.5, 0);
    pressG.add(pinPlate);

    const pressHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 12), brassMat);
    pressHandle.rotation.z = Math.PI / 4;
    pressHandle.position.set(0.6, 0.8, 0);
    pressHandleRef.current = pressHandle;
    pressG.add(pressHandle);

    scene.add(pressG);

    // --- 3. UPRIGHT CLOCK-DIAL COUNTER CABINET ---
    const cabinetG = new THREE.Group();
    cabinetG.position.set(0, 1.2, -1.2);

    // Cabinet Enclosure
    const cabinet = new THREE.Mesh(new THREE.BoxGeometry(5.2, 3.4, 0.6), mahoganyWood);
    cabinet.castShadow = true;
    cabinetG.add(cabinet);

    // 24 Circular Electromechanical Clock Dials in a 6x4 Grid
    const dialMeshes: THREE.Mesh[] = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 6; col++) {
        const dx = -2.0 + col * 0.8;
        const dy = 1.0 - row * 0.7;

        // Brass bezel
        const bezel = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.06, 20), brassMat);
        bezel.rotation.x = Math.PI / 2;
        bezel.position.set(dx, dy, 0.32);
        cabinetG.add(bezel);

        // White enamel dial face
        const face = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.07, 20), clockEnamel);
        face.rotation.x = Math.PI / 2;
        face.position.set(dx, dy, 0.33);
        cabinetG.add(face);

        // Black pointer hand
        const hand = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.22, 0.02), castIronMat);
        hand.position.set(dx, dy + 0.08, 0.38);
        cabinetG.add(hand);
        dialMeshes.push(hand);
      }
    }
    dialsRef.current = dialMeshes;
    scene.add(cabinetG);

    // --- 4. SORTING BOX WITH 24 RELAY-TRIPPED COMPARTMENTS ---
    const sorterG = new THREE.Group();
    sorterG.position.set(1.8, -0.6, 0.6);

    const sorterBox = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.6, 2.2), mahoganyWood);
    sorterBox.castShadow = true;
    sorterG.add(sorterBox);

    // Grid partitions
    for (let i = -1; i <= 1; i++) {
      const pz = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.5, 0.04), mahoganyWood);
      pz.position.set(0, 0.1, i * 0.6);
      sorterG.add(pz);

      const px = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.5, 2.0), mahoganyWood);
      px.position.set(i * 0.6, 0.1, 0);
      sorterG.add(px);
    }
    scene.add(sorterG);

    // --- 5. ANIMATION LOOP ---
    let lastTime = performance.now();
    let cardStep = 0;

    const renderLoop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (live.current.isPlaying) {
        cardStep += dt * (live.current.tabulatingSpeedCpm / 60);

        if (pressHandleRef.current) {
          const cycleS = Math.max(0.05, live.current.cycleTimeMs / 1000);
          const pressPhase = Math.sin((time / 1000 / cycleS) * Math.PI * 2);
          const amp = 0.12 + (live.current.solenoidForceN / 40) * 0.18;
          pressHandleRef.current.rotation.z = Math.PI / 4 + pressPhase * amp;
        }

        // Stepping dial hands
        dialsRef.current.forEach((hand, idx) => {
          const handAngle = (cardStep * (idx + 1) * 0.1) % (Math.PI * 2);
          hand.rotation.z = handAngle;
        });
      }

      studio.controls.update();
      renderer.render(scene, studio.camera);
      animRef.current = requestAnimationFrame(renderLoop);
    };

    animRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      studio.dispose();
    };
    // live is a stable ref; the loop reads live.current. Remounting on every cadence tick
    // tore down the WebGL context.
  }, [live]);

  const setCameraView = (view: CameraPreset) => {
    const studio = studioRef.current;
    if (!studio) return;
    if (view === "iso") studio.controls.setView([7.5, 4.2, 7.5], [0, 0.4, 0]);
    if (view === "press") studio.controls.setView([-1.6, 1.8, 3.2], [-1.6, -0.6, 0.6]);
    if (view === "dials") studio.controls.setView([0.1, 1.6, 2.8], [0, 1.2, -1.2]);
    if (view === "sorter") studio.controls.setView([2.8, 1.8, 2.8], [1.8, -0.6, 0.6]);
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-amber-900/20 dark:border-ink-800 bg-slate-950 shadow-2xl">
      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        className="w-full h-[520px] sm:h-[620px] cursor-grab active:cursor-grabbing"
      />

      {/* Top Floating Header HUD */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-4 py-2.5 shadow-lg pointer-events-auto">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
            <h3 className="font-serif text-sm sm:text-base font-bold text-slate-100">
              Hollerith Electro-Mechanical Tabulator 3D (US 395,781)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-amber-400 block mt-0.5">
            1890 US Census Punch Card System · Relational Circuit Logic
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={toggleMute}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-200 hover:text-white transition-colors"
            title={isMuted ? "Unmute sound" : "Mute sound"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className="px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-200 hover:text-white text-xs font-mono font-bold transition-colors"
          >
            {showUiOverlay ? "Hide HUD" : "Show HUD"}
          </button>
        </div>
      </div>

      {/* Interactive Controls Overlay HUD */}
      {showUiOverlay && (
        <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-end justify-between gap-4 pointer-events-none">
          {/* Main Controls Card */}
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 shadow-xl pointer-events-auto max-w-sm w-full space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                1890 US Census Feed
              </span>
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold shadow-md transition-all ${
                  isPlaying
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
              >
                <Play className={`w-3.5 h-3.5 ${isPlaying ? "animate-spin" : ""}`} />
                <span>{isPlaying ? "Pause Feed" : "Feed Cards"}</span>
              </button>
            </div>

            {/* Tabulating Speed Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span>Tabulation Cadence</span>
                <span className="text-amber-400 font-bold">{tabulatingSpeedCpm} cards/min</span>
              </div>
              <input
                type="range"
                min="20"
                max="120"
                step="5"
                value={tabulatingSpeedCpm}
                onChange={(e) => updateParam("cardsPerMin", Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Readout Badges */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-slate-800/80 rounded-lg p-2 border border-slate-700 text-center">
                <span className="text-[10px] font-mono text-slate-400 block">Cycle</span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {hollerith.cycleTimeMs} ms
                </span>
              </div>
              <div className="bg-slate-800/80 rounded-lg p-2 border border-slate-700 text-center">
                <span className="text-[10px] font-mono text-slate-400 block">Solenoid</span>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {hollerith.solenoidForceN} N · {params.activeRelays ?? 8} relays
                </span>
              </div>
            </div>
          </div>

          {/* Camera View Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-1.5 shadow-xl pointer-events-auto">
            <Camera className="w-4 h-4 text-slate-400 ml-1.5 mr-0.5" />
            <button
              type="button"
              onClick={() => setCameraView("iso")}
              className="px-2.5 py-1 rounded-lg text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Isometric
            </button>
            <button
              type="button"
              onClick={() => setCameraView("press")}
              className="px-2.5 py-1 rounded-lg text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Pin Press
            </button>
            <button
              type="button"
              onClick={() => setCameraView("dials")}
              className="px-2.5 py-1 rounded-lg text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Counter Dials
            </button>
            <button
              type="button"
              onClick={() => setCameraView("sorter")}
              className="px-2.5 py-1 rounded-lg text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Sorting Box
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
