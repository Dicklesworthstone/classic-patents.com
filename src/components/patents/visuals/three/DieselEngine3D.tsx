"use client";

import { Camera, Flame, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FrankenSimEngine } from "@/physics/engine";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "injector" | "cylinder" | "flywheel";

export function DieselEngine3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { params, updateParam } = usePatentPhysics("us-542846-diesel-engine");

  const engineRpm = params.engineRpm ?? 160;
  const compressionRatio = params.compRatio ?? params.compressionRatio ?? 18;
  const diesel = FrankenSimEngine.stepDieselEngine({
    compressionRatio,
    blastAirPressureBar: params.blastAirPressure ?? 65,
    cutoffRatio: params.cutoffRatio ?? 1.6,
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const { isMuted, toggleMute } = usePatentAudio();

  const peakPressureBar = diesel.pCompBar;
  const peakTempC = diesel.tCompressionC;

  const live = useLiveSimParams({
    engineRpm,
    compressionRatio,
    isPlaying,
    isAutoIgnition: diesel.isAutoIgnition ? 1 : 0,
    peakTempC,
  });

  const studioRef = useRef<StudioContext | null>(null);
  const animRef = useRef<number | null>(null);
  const flywheelRef = useRef<THREE.Group | null>(null);
  const pistonRef = useRef<THREE.Mesh | null>(null);
  const conRodRef = useRef<THREE.Mesh | null>(null);
  const flameFlashRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [8.5, 4.5, 8.5],
      targetPos: [0, 0.6, 0],
      fov: 38,
      environmentStyle: "sky",
      enableClouds: true,
      enableFloorGrid: true,
      floorColor: 0x0f172a,
    });
    studioRef.current = studio;
    const { scene, renderer } = studio;

    // --- MATERIALS ---
    const heavyCastIron = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.8,
    });
    const polishedSteel = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.2,
      metalness: 0.95,
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.9,
    });
    const flameMat = new THREE.MeshStandardMaterial({
      color: 0xffedd5,
      emissive: 0xf97316,
      emissiveIntensity: 3.5,
      roughness: 0.1,
    });

    // --- 1. HEAVY CAST-IRON BEDPLATE & A-FRAME ---
    const bed = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.5, 3.8), heavyCastIron);
    bed.position.set(0, -1.8, 0);
    bed.castShadow = true;
    bed.receiveShadow = true;
    scene.add(bed);

    // Twin vertical A-frame column supports
    for (const sign of [-1, 1]) {
      const aframe = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3.2, 1.4), heavyCastIron);
      aframe.position.set(sign * 1.1, -0.2, 0);
      aframe.castShadow = true;
      scene.add(aframe);
    }

    // --- 2. HIGH-PRESSURE LONG-STROKE CYLINDER ---
    const cylMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 2.6, 24), heavyCastIron);
    cylMesh.position.set(0, 1.8, 0);
    cylMesh.castShadow = true;
    scene.add(cylMesh);

    // Cylinder Head & High-Pressure Air-Blast Fuel Injector
    const headMesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 1.6), heavyCastIron);
    headMesh.position.set(0, 3.2, 0);
    scene.add(headMesh);

    const injector = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.8, 16), brassMat);
    injector.position.set(0, 3.7, 0);
    scene.add(injector);

    // Autoignition combustion chamber flame flash
    const flameFlash = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 12), flameMat);
    flameFlash.position.set(0, 2.8, 0);
    flameFlash.visible = false;
    flameFlashRef.current = flameFlash;
    scene.add(flameFlash);

    // --- 3. RECIPROCATING PISTON & CROSSHEAD GUIDE ---
    const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 1.1, 20), polishedSteel);
    piston.position.set(0, 1.8, 0);
    pistonRef.current = piston;
    scene.add(piston);

    const conRod = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.4, 12), polishedSteel);
    conRod.position.set(0, 0.2, 0);
    conRodRef.current = conRod;
    scene.add(conRod);

    // --- 4. 10-FOOT HEAVY CAST-IRON FLYWHEEL ---
    const flywheelG = new THREE.Group();
    flywheelG.position.set(1.8, -1.2, 0);
    flywheelRef.current = flywheelG;

    const flywheelRadius = 2.4;
    const rim = new THREE.Mesh(new THREE.TorusGeometry(flywheelRadius, 0.2, 12, 36), heavyCastIron);
    flywheelG.add(rim);

    // 6 Spokes
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI * 2) / 6;
      const spoke = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, flywheelRadius, 8),
        heavyCastIron,
      );
      spoke.position.set((Math.cos(a) * flywheelRadius) / 2, (Math.sin(a) * flywheelRadius) / 2, 0);
      spoke.rotation.z = a + Math.PI / 2;
      flywheelG.add(spoke);
    }
    scene.add(flywheelG);

    // --- 5. ANIMATION LOOP ---
    let crankAngle = 0;
    let lastTime = performance.now();

    const renderLoop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (live.current.isPlaying) {
        const rpm = live.current.engineRpm;
        const speed = (rpm / 60) * Math.PI * 2;
        crankAngle = (crankAngle + speed * dt) % (Math.PI * 2);

        if (flywheelRef.current) {
          flywheelRef.current.rotation.z = crankAngle;
        }

        const crankR = 0.55;
        const pinY = -1.2 + Math.sin(crankAngle) * crankR;
        const pinX = Math.cos(crankAngle) * crankR;

        const rodLen = 2.4;
        const pistonY = pinY + Math.sqrt(Math.max(0.1, rodLen ** 2 - pinX ** 2));

        if (pistonRef.current) {
          pistonRef.current.position.y = pistonY;
        }
        if (conRodRef.current) {
          conRodRef.current.position.set(pinX / 2, (pinY + pistonY) / 2, 0);
          const rodAngle = Math.atan2(pistonY - pinY, -pinX);
          conRodRef.current.rotation.z = rodAngle - Math.PI / 2;
        }

        // Autoignition flash near Top Dead Center (crankAngle ~ PI/2)
        if (flameFlashRef.current) {
          const isTdc = Math.abs(Math.sin(crankAngle) - 1.0) < 0.08;
          flameFlashRef.current.visible = isTdc && live.current.isAutoIgnition > 0;
        }
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
  }, [live]);

  const setCameraView = (view: CameraPreset) => {
    const studio = studioRef.current;
    if (!studio) return;
    if (view === "iso") studio.controls.setView([8.5, 4.5, 8.5], [0, 0.6, 0]);
    if (view === "injector") studio.controls.setView([0.1, 4.2, 2.8], [0, 3.2, 0]);
    if (view === "cylinder") studio.controls.setView([0.1, 2.2, 3.8], [0, 1.8, 0]);
    if (view === "flywheel") studio.controls.setView([4.2, 0.4, 4.2], [1.8, -1.2, 0]);
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
            <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
            <h3 className="font-serif text-sm sm:text-base font-bold text-slate-100">
              Diesel High-Compression Auto-Ignition Engine 3D (US 542,846)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-amber-400 block mt-0.5">
            FrankenSim Diesel Cycle · Adiabatic Compression T₂ = T₁ · r^(γ-1)
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
                1893 Augsburg Prototype
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
                <span>{isPlaying ? "Stop Fuel" : "Inject Heavy Oil"}</span>
              </button>
            </div>

            {/* Compression Ratio Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span>Compression Ratio (r)</span>
                <span className="text-amber-400 font-bold">{compressionRatio}:1</span>
              </div>
              <input
                type="range"
                min="12.0"
                max="20.0"
                step="0.5"
                value={compressionRatio}
                onChange={(e) => updateParam("compRatio", Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Live Readout Badges */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-slate-800/80 rounded-lg p-2 border border-slate-700 text-center">
                <span className="text-[10px] font-mono text-slate-400 block">Peak Pressure</span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {peakPressureBar} bar
                </span>
              </div>
              <div className="bg-slate-800/80 rounded-lg p-2 border border-slate-700 text-center">
                <span className="text-[10px] font-mono text-slate-400 block">
                  Autoignition Temp
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {peakTempC} °C{diesel.isAutoIgnition ? "" : " (no fire)"}
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
              onClick={() => setCameraView("injector")}
              className="px-2.5 py-1 rounded-lg text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Air-Blast Injector
            </button>
            <button
              type="button"
              onClick={() => setCameraView("cylinder")}
              className="px-2.5 py-1 rounded-lg text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cylinder &amp; Flame
            </button>
            <button
              type="button"
              onClick={() => setCameraView("flywheel")}
              className="px-2.5 py-1 rounded-lg text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Flywheel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
