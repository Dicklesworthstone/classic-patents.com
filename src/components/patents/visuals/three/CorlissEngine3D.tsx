"use client";

import { Camera, Gauge, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "wristplate" | "flywheel" | "valves";

export function CorlissEngine3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { params, updateParam } = usePatentPhysics("us-6162-corliss-steam-engine");

  const cutoffPct = params.cutoffPercentage ?? 25;
  const steamPressurePsi = params.boilerPressure ?? 125;
  const engineRpm = params.engineRpm ?? 60;

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const { isMuted, toggleMute } = usePatentAudio();

  const indicatedHorsepower = Math.round(
    ((steamPressurePsi * 0.75 * 0.9 * 350 * engineRpm) / 33000) * 1.8,
  );
  const thermalEfficiencyPct = Math.round(18 + (steamPressurePsi / 125) * 6 - (cutoffPct / 50) * 4);

  const live = useLiveSimParams({
    cutoffPct,
    steamPressurePsi,
    engineRpm,
    isPlaying,
  });

  const studioRef = useRef<StudioContext | null>(null);
  const animRef = useRef<number | null>(null);
  const flywheelRef = useRef<THREE.Group | null>(null);
  const wristPlateRef = useRef<THREE.Mesh | null>(null);
  const crossheadRef = useRef<THREE.Mesh | null>(null);
  const connectingRodRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [9.5, 4.5, 9.5],
      targetPos: [0, 0.8, 0],
      fov: 38,
      environmentStyle: "sky",
      enableClouds: true,
      enableFloorGrid: true,
      floorColor: 0x1e293b,
    });
    studioRef.current = studio;
    const { scene, renderer } = studio;

    // --- MATERIALS ---
    const castIron = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.45,
      metalness: 0.85,
    });
    const polishedSteel = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.2,
      metalness: 0.95,
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.3,
      metalness: 0.88,
    });
    const _brickMat = new THREE.MeshStandardMaterial({
      color: 0x7f1d1d,
      roughness: 0.85,
      metalness: 0.05,
    });

    // --- 1. ENGINE BEDPLATE & FOUNDATION ---
    const bed = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.6, 3.8), castIron);
    bed.position.set(0, -1.8, 0);
    bed.castShadow = true;
    bed.receiveShadow = true;
    scene.add(bed);

    // --- 2. STEAM CYLINDER & 4 CORLISS ROTARY VALVES ---
    const cylinderG = new THREE.Group();
    cylinderG.position.set(-3.2, 0.4, 0);

    // Cylinder Casting Body
    const cylBody = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.8, 1.6), castIron);
    cylBody.castShadow = true;
    cylinderG.add(cylBody);

    // 4 Rotary Valve Bonnets (2 Top Admission, 2 Bottom Exhaust)
    for (const [vx, vy] of [
      [-0.8, 0.7],
      [0.8, 0.7],
      [-0.8, -0.7],
      [0.8, -0.7],
    ]) {
      const bonnet = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.3, 16), brassMat);
      bonnet.rotation.x = Math.PI / 2;
      bonnet.position.set(vx, vy, 0.9);
      cylinderG.add(bonnet);

      // Dashpot cylinder underneath each top valve
      if (vy > 0) {
        const dashpot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.6, 12), castIron);
        dashpot.position.set(vx, -1.2, 0.9);
        cylinderG.add(dashpot);
      }
    }
    scene.add(cylinderG);

    // --- 3. OSCILLATING WRIST PLATE (CORLISS HEART) ---
    const wristPlateMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.55, 0.14, 24),
      brassMat,
    );
    wristPlateMesh.rotation.x = Math.PI / 2;
    wristPlateMesh.position.set(-3.2, 0.4, 1.05);
    wristPlateMesh.castShadow = true;
    wristPlateRef.current = wristPlateMesh;
    scene.add(wristPlateMesh);

    // --- 4. CROSSHEAD GUIDE & SLIDING CROSSHEAD ---
    const crossheadG = new THREE.Group();
    crossheadG.position.set(-0.8, 0.4, 0);

    const crossheadMesh = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.5), polishedSteel);
    crossheadMesh.castShadow = true;
    crossheadRef.current = crossheadMesh;
    crossheadG.add(crossheadMesh);

    // Upper and lower guide bars
    for (const gy of [-0.35, 0.35]) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.12, 0.2), castIron);
      bar.position.set(0, gy, 0);
      crossheadG.add(bar);
    }
    scene.add(crossheadG);

    // --- 5. CONNECTING ROD ---
    const rodGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.2, 16);
    const rodMesh = new THREE.Mesh(rodGeo, polishedSteel);
    rodMesh.rotation.z = Math.PI / 2;
    rodMesh.castShadow = true;
    connectingRodRef.current = rodMesh;
    scene.add(rodMesh);

    // --- 6. 20-FOOT CAST-IRON FLYWHEEL & CRANKSHAFT ---
    const flywheelG = new THREE.Group();
    flywheelG.position.set(2.8, 0.4, 0);
    flywheelRef.current = flywheelG;

    const flywheelRadius = 2.6;
    // Heavy Rim
    const rim = new THREE.Mesh(new THREE.TorusGeometry(flywheelRadius, 0.22, 14, 48), castIron);
    flywheelG.add(rim);

    // Center Hub & Main Crankshaft
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.8, 24), castIron);
    hub.rotation.x = Math.PI / 2;
    flywheelG.add(hub);

    // 8 Tapered Elliptical Spokes
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.18, flywheelRadius, 0.12), castIron);
      spoke.position.set(
        (Math.cos(angle) * flywheelRadius) / 2,
        (Math.sin(angle) * flywheelRadius) / 2,
        0,
      );
      spoke.rotation.z = angle + Math.PI / 2;
      flywheelG.add(spoke);
    }

    // Crank Disc & Crankpin
    const crankDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.15, 24), castIron);
    crankDisc.rotation.x = Math.PI / 2;
    crankDisc.position.z = 0.45;
    flywheelG.add(crankDisc);

    const crankPin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 0.25, 12),
      polishedSteel,
    );
    crankPin.rotation.x = Math.PI / 2;
    crankPin.position.set(0.6, 0, 0.55);
    flywheelG.add(crankPin);

    scene.add(flywheelG);

    // --- 7. ANIMATION LOOP ---
    let crankAngle = 0;
    let lastTime = performance.now();

    const renderLoop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (live.current.isPlaying) {
        const rpm = live.current.engineRpm;
        const crankSpeed = (rpm / 60) * Math.PI * 2;
        crankAngle = (crankAngle + crankSpeed * dt) % (Math.PI * 2);

        if (flywheelRef.current) {
          flywheelRef.current.rotation.z = crankAngle;
        }

        // Crankpin position
        const crankRadius = 0.6;
        const pinX = 2.8 + Math.cos(crankAngle) * crankRadius;
        const pinY = 0.4 + Math.sin(crankAngle) * crankRadius;

        // Crosshead piston position
        const rodLen = 3.2;
        const crossheadX = pinX - Math.sqrt(Math.max(0.1, rodLen ** 2 - (pinY - 0.4) ** 2));
        if (crossheadRef.current) {
          crossheadRef.current.position.x = crossheadX + 0.8;
        }

        // Connecting Rod alignment
        if (connectingRodRef.current) {
          connectingRodRef.current.position.set((pinX + crossheadX) / 2, (pinY + 0.4) / 2, 0.55);
          const rodAngle = Math.atan2(pinY - 0.4, pinX - crossheadX);
          connectingRodRef.current.rotation.z = rodAngle - Math.PI / 2;
        }

        // Wrist Plate harmonic oscillation
        if (wristPlateRef.current) {
          const wristOsc = Math.sin(crankAngle) * 0.45;
          wristPlateRef.current.rotation.z = wristOsc;
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
  }, [live.current.isPlaying, live.current.engineRpm]);

  const setCameraView = (view: CameraPreset) => {
    const studio = studioRef.current;
    if (!studio) return;
    if (view === "iso") studio.controls.setView([9.5, 4.5, 9.5], [0, 0.8, 0]);
    if (view === "wristplate") studio.controls.setView([-3.0, 1.2, 4.2], [-3.2, 0.4, 1.0]);
    if (view === "flywheel") studio.controls.setView([5.2, 1.8, 5.2], [2.8, 0.4, 0]);
    if (view === "valves") studio.controls.setView([-4.8, 1.8, 2.8], [-3.2, 0.4, 0]);
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
            <Gauge className="w-5 h-5 text-amber-400 animate-pulse" />
            <h3 className="font-serif text-sm sm:text-base font-bold text-slate-100">
              Corliss Variable Cut-Off Steam Engine 3D (US 6,162)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-amber-400 block mt-0.5">
            FrankenSim fs-conduction &amp; fs-mbd · Rankine Expansive Thermodynamics
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
                Valve Gear Controls
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
                <span>{isPlaying ? "Pause Engine" : "Start Steam"}</span>
              </button>
            </div>

            {/* Cut-off Percentage Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span>Steam Cut-off Point</span>
                <span className="text-amber-400 font-bold">{cutoffPct}% stroke</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={cutoffPct}
                onChange={(e) => updateParam("cutoffPercentage", Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Live Readout Badges */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-slate-800/80 rounded-lg p-2 border border-slate-700 text-center">
                <span className="text-[10px] font-mono text-slate-400 block">Indicated Power</span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {indicatedHorsepower} HP
                </span>
              </div>
              <div className="bg-slate-800/80 rounded-lg p-2 border border-slate-700 text-center">
                <span className="text-[10px] font-mono text-slate-400 block">
                  Thermal Efficiency
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {thermalEfficiencyPct}%
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
              onClick={() => setCameraView("wristplate")}
              className="px-2.5 py-1 rounded-lg text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Wrist Plate
            </button>
            <button
              type="button"
              onClick={() => setCameraView("flywheel")}
              className="px-2.5 py-1 rounded-lg text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Flywheel
            </button>
            <button
              type="button"
              onClick={() => setCameraView("valves")}
              className="px-2.5 py-1 rounded-lg text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Rotary Valves
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
