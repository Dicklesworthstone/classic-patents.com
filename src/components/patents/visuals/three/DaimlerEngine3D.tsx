"use client";

import { Camera, Flame, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FrankenSimEngine } from "@/physics/engine";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "cylinder" | "crankcase" | "hottube";

export function DaimlerEngine3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { params, updateParam } = usePatentPhysics("us-361931-daimler-engine");

  const engineRpm = params.engineRpm ?? 750;
  const hotTubeTempC = params.hotTubeTemp ?? 850;
  const daimler = FrankenSimEngine.stepDaimlerEngine({
    engineRpm,
    hotTubeTempC,
    differentialSlipAngleDeg: params.turnAngle ?? 15,
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const { isMuted, toggleMute } = usePatentAudio();

  const brakeHorsepower = daimler.brakeHorsepower;

  const live = useLiveSimParams({
    engineRpm,
    hotTubeTempC,
    isPlaying,
    bmepBar: daimler.bmepBar,
    brakeHorsepower: daimler.brakeHorsepower,
    outerWheelRpm: daimler.outerWheelRpm,
    innerWheelRpm: daimler.innerWheelRpm,
  });

  const studioRef = useRef<StudioContext | null>(null);
  const animRef = useRef<number | null>(null);
  const flywheelRef = useRef<THREE.Group | null>(null);
  const pistonRef = useRef<THREE.Mesh | null>(null);
  const conRodRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [6.5, 3.8, 6.5],
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
    const castIron = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.45,
      metalness: 0.85,
    });
    const _brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.9,
    });
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.2,
      metalness: 0.95,
    });
    const hotTubeMat = new THREE.MeshStandardMaterial({
      color: 0xffedd5,
      emissive: 0xf97316,
      emissiveIntensity: 2.2,
      roughness: 0.2,
    });

    // --- 1. ENCLOSED CRANKCASE HOUSING ---
    const caseMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 1.4, 24), castIron);
    caseMesh.rotation.z = Math.PI / 2;
    caseMesh.position.set(0, -0.6, 0);
    caseMesh.castShadow = true;
    scene.add(caseMesh);

    // --- 2. VERTICAL CYLINDER & WATER JACKET ---
    const cylMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 2.2, 24), castIron);
    cylMesh.position.set(0, 1.1, 0);
    cylMesh.castShadow = true;
    scene.add(cylMesh);

    // Cylinder Head & Valves
    const headMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 1.2), castIron);
    headMesh.position.set(0, 2.3, 0);
    scene.add(headMesh);

    // Glowing Platinum Hot-Tube Ignition Holder
    const hotTube = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.45, 12), hotTubeMat);
    hotTube.rotation.z = Math.PI / 2;
    hotTube.position.set(0.65, 2.3, 0);
    scene.add(hotTube);

    // --- 3. TWIN INTERNAL ENCLOSED FLYWHEELS & CRANKSHAFT ---
    const flywheelG = new THREE.Group();
    flywheelG.position.set(0, -0.6, 0);
    flywheelRef.current = flywheelG;

    for (const sign of [-1, 1]) {
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.18, 24), castIron);
      disc.rotation.x = Math.PI / 2;
      disc.position.z = sign * 0.45;
      flywheelG.add(disc);
    }
    // Crankpin between flywheels
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.9, 12), steelMat);
    pin.rotation.x = Math.PI / 2;
    pin.position.set(0.4, 0, 0);
    flywheelG.add(pin);

    scene.add(flywheelG);

    // --- 4. RECIPROCATING PISTON & CONNECTING ROD ---
    const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.7, 20), steelMat);
    piston.position.set(0, 1.0, 0);
    pistonRef.current = piston;
    scene.add(piston);

    const conRod = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.6, 12), steelMat);
    conRod.position.set(0, 0.2, 0);
    conRodRef.current = conRod;
    scene.add(conRod);

    // --- 5. ANIMATION LOOP ---
    let crankAngle = 0;
    let _renderedSteps = 0;

    const renderLoop = () => {
      _renderedSteps += 1;
      const dt = 1 / 60;

      const tube = live.current.hotTubeTempC;
      hotTubeMat.emissiveIntensity = tube >= 800 ? 2.4 : Math.max(0.15, (tube / 800) * 2.2);
      hotTubeMat.emissive.setHex(tube >= 800 ? 0xf97316 : tube >= 600 ? 0xb45309 : 0x334155);

      if (live.current.isPlaying && tube >= 600) {
        const rpm = live.current.engineRpm * (live.current.bmepBar / 4.5);
        const speed = (rpm / 60) * Math.PI * 2;
        crankAngle = (crankAngle + speed * dt) % (Math.PI * 2);

        if (flywheelRef.current) {
          flywheelRef.current.rotation.z = crankAngle;
        }

        const crankR = 0.4;
        const pinY = -0.6 + Math.sin(crankAngle) * crankR;
        const pinX = Math.cos(crankAngle) * crankR;

        const rodLen = 1.6;
        const pistonY = pinY + Math.sqrt(Math.max(0.1, rodLen ** 2 - pinX ** 2));

        if (pistonRef.current) {
          pistonRef.current.position.y = pistonY;
        }
        if (conRodRef.current) {
          conRodRef.current.position.set(pinX / 2, (pinY + pistonY) / 2, 0);
          const rodAngle = Math.atan2(pistonY - pinY, -pinX);
          conRodRef.current.rotation.z = rodAngle - Math.PI / 2;
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
    // live is a stable ref; reading live.current inside rAF. Remounting on sliders
    // tore down the WebGL context.
  }, [live]);

  const setCameraView = (view: CameraPreset) => {
    const studio = studioRef.current;
    if (!studio) return;
    if (view === "iso") studio.controls.setView([6.5, 3.8, 6.5], [0, 0.4, 0]);
    if (view === "cylinder") studio.controls.setView([0.1, 1.8, 3.8], [0, 1.1, 0]);
    if (view === "crankcase") studio.controls.setView([2.4, -0.4, 2.8], [0, -0.6, 0]);
    if (view === "hottube") studio.controls.setView([1.8, 2.5, 1.8], [0.65, 2.3, 0]);
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
              Daimler High-Speed Petrol Engine 3D (US 361,931)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-amber-400 block mt-0.5">
            1885 &quot;Grandfather Clock&quot; Engine · Enclosed Crankcase &amp; Hot-Tube Ignition
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
                Engine Throttle
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
                <span>{isPlaying ? "Stop Engine" : "Ignite Petrol"}</span>
              </button>
            </div>

            {/* Engine RPM Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span>Crankshaft Speed</span>
                <span className="text-amber-400 font-bold">{engineRpm} RPM</span>
              </div>
              <input
                type="range"
                min="400"
                max="950"
                step="25"
                value={engineRpm}
                onChange={(e) => updateParam("engineRpm", Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span>Platinum hot-tube</span>
                <span className="text-amber-400 font-bold">{hotTubeTempC} °C</span>
              </div>
              <input
                type="range"
                min="650"
                max="950"
                step="10"
                value={hotTubeTempC}
                onChange={(e) => updateParam("hotTubeTemp", Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Live Readout Badges */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-slate-800/80 rounded-lg p-2 border border-slate-700 text-center">
                <span className="text-[10px] font-mono text-slate-400 block">Brake Power</span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {brakeHorsepower} HP
                </span>
              </div>
              <div className="bg-slate-800/80 rounded-lg p-2 border border-slate-700 text-center">
                <span className="text-[10px] font-mono text-slate-400 block">BMEP / tube</span>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {daimler.bmepBar} bar · {hotTubeTempC} °C
                </span>
              </div>
              <div className="bg-slate-800/80 rounded-lg p-2 border border-slate-700 text-center">
                <span className="text-[10px] font-mono text-slate-400 block">Diff wheels</span>
                <span className="text-xs font-mono font-bold text-sky-300">
                  {daimler.innerWheelRpm}/{daimler.outerWheelRpm} rpm
                </span>
              </div>
              <div className="bg-slate-800/80 rounded-lg p-2 border border-slate-700 text-center">
                <span className="text-[10px] font-mono text-slate-400 block">P/m</span>
                <span className="text-xs font-mono font-bold text-slate-200">
                  {daimler.specificPowerHpPerKg} hp/kg
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
              onClick={() => setCameraView("cylinder")}
              className="px-2.5 py-1 rounded-lg text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cylinder
            </button>
            <button
              type="button"
              onClick={() => setCameraView("crankcase")}
              className="px-2.5 py-1 rounded-lg text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Flywheels
            </button>
            <button
              type="button"
              onClick={() => setCameraView("hottube")}
              className="px-2.5 py-1 rounded-lg text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Hot Tube
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
