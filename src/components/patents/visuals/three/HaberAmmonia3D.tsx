"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { stepHaberAmmonia } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import {
  articulateHaberAmmoniaModel,
  buildHaberAmmoniaModel,
  type HaberAmmoniaModelNodes,
} from "./haberAmmoniaModel";
import { useLiveSimParams } from "./useLiveSimParams";

interface HaberAmmonia3DProps {
  initialPressureAtm?: number;
  initialTemperatureCelsius?: number;
  initialFeedFlowRateMolesPerSec?: number;
  initialCatalystActivity?: number;
}

type CameraPreset = "isometric" | "reactor" | "heatExchanger" | "condenser";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  isometric: { pos: [0, 4.0, 7.5], target: [0, 1.4, 0] },
  reactor: { pos: [0.7, 2.2, 4.2], target: [0.7, 1.5, 0] },
  heatExchanger: { pos: [-0.7, 2.0, 3.8], target: [-0.7, 1.2, 0] },
  condenser: { pos: [2.1, 1.8, 3.8], target: [2.1, 1.1, 0] },
};

export default function HaberAmmonia3D({
  initialPressureAtm = 175,
  initialTemperatureCelsius = 530,
  initialFeedFlowRateMolesPerSec = 50,
  initialCatalystActivity = 1.0,
}: HaberAmmonia3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const nodesRef = useRef<HaberAmmoniaModelNodes | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  const { params, updateParam } = usePatentPhysics("us-971501-haber-ammonia");
  const pressureAtm = params.pressureAtm ?? initialPressureAtm;
  const temperatureCelsius = params.temperatureCelsius ?? initialTemperatureCelsius;
  const feedFlowRateMolesPerSec = params.feedFlowRateMolesPerSec ?? initialFeedFlowRateMolesPerSec;
  const catalystActivity = params.catalystActivity ?? initialCatalystActivity;
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("isometric");
  const [isRotating, setIsRotating] = useState(false);

  const sim = stepHaberAmmonia({
    pressureAtm,
    temperatureCelsius,
    feedFlowRateMolesPerSec,
    catalystActivity,
  });

  const live = useLiveSimParams({
    isRotating,
    pressureAtm,
    temperatureCelsius,
    ammoniaYieldPct: sim.ammoniaYieldPct,
    ammoniaProductionKgPerHour: sim.ammoniaProductionKgPerHour,
  });

  const handlePresetChange = (preset: CameraPreset) => {
    setCameraPreset(preset);
    const targetConfig = CAMERA_PRESETS[preset];
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(...targetConfig.pos);
      controlsRef.current.target.set(...targetConfig.target);
      controlsRef.current.update();
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 480;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060913);
    scene.fog = new THREE.FogExp2(0x060913, 0.08);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(...CAMERA_PRESETS[cameraPreset].pos);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(...CAMERA_PRESETS[cameraPreset].target);
    controlsRef.current = controls;

    // Lighting (5-Light Rig)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.2);
    keyLight.position.set(5, 12, 8);
    keyLight.castShadow = true;
    keyLight.shadow.bias = -0.0002;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    scene.add(keyLight);

    const blueFill = new THREE.DirectionalLight(0x38bdf8, 1.2);
    blueFill.position.set(-6, 4, -5);
    scene.add(blueFill);

    const warmRim = new THREE.DirectionalLight(0xf59e0b, 1.0);
    warmRim.position.set(0, -3, -6);
    scene.add(warmRim);

    // Build Model
    const nodes = buildHaberAmmoniaModel();
    nodesRef.current = nodes;
    scene.add(nodes.root);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let lastTime: number | null = null;
    const animate = (now: number) => {
      const dt = lastTime === null ? 0.016 : Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;
      timeRef.current += dt;

      const p = live.current;
      if (p.isRotating && controlsRef.current) {
        controlsRef.current.autoRotate = true;
        controlsRef.current.autoRotateSpeed = 1.0;
      } else if (controlsRef.current) {
        controlsRef.current.autoRotate = false;
      }

      controlsRef.current?.update();

      if (nodesRef.current) {
        articulateHaberAmmoniaModel(
          nodesRef.current,
          {
            pressureAtm: p.pressureAtm,
            temperatureCelsius: p.temperatureCelsius,
            ammoniaYieldPct: p.ammoniaYieldPct,
            ammoniaProductionKgPerHour: p.ammoniaProductionKgPerHour,
          },
          timeRef.current,
        );
      }

      renderer.render(scene, camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", handleResize);
      renderer.forceContextLoss();
      renderer.dispose();
      nodes.materials.forEach((m) => {
        m.dispose();
      });
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [live, cameraPreset]);

  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-wide text-cyan-400">
            Haber-Bosch Catalytic Ammonia Synthesis 3D WebGL Studio
          </h2>
          <p className="text-sm text-slate-400">
            Procedural 3D simulation of US Patent 971,501 • Pure WebGL (No GLTF assets)
          </p>
        </div>

        {/* Camera Presets & Orbit Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {(["isometric", "reactor", "heatExchanger", "condenser"] as CameraPreset[]).map(
            (preset) => (
              <button
                type="button"
                key={preset}
                onClick={() => handlePresetChange(preset)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition ${
                  cameraPreset === preset
                    ? "bg-cyan-700 text-white"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200"
                }`}
              >
                {preset.replace(/([A-Z])/g, " $1")}
              </button>
            ),
          )}
          <button
            type="button"
            onClick={() => setIsRotating(!isRotating)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
              isRotating
                ? "bg-amber-600 text-white"
                : "bg-slate-900 text-slate-400 hover:text-slate-200"
            }`}
          >
            {isRotating ? "Stop Orbit" : "Auto Orbit"}
          </button>
        </div>
      </div>

      {/* 3D WebGL Viewport */}
      <div className="relative w-full aspect-[16/9] max-h-[560px] rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
        <div ref={containerRef} className="w-full h-full" />

        {/* Bottom-Left Pointer-Events-None Telemetry HUD */}
        <div className="absolute bottom-4 left-4 p-3 bg-slate-900/80 backdrop-blur-md rounded-lg border border-slate-700 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">System Pressure:</span>
            <span className="text-cyan-400 font-bold">
              {sim.pressureAtm} atm ({sim.pressureMpa} MPa)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Catalyst Temp:</span>
            <span className="text-amber-400 font-bold">{sim.catalystTemperatureCelsius} °C</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Ammonia Single-Pass:</span>
            <span className="text-emerald-400 font-bold">{sim.ammoniaYieldPct}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Production Rate:</span>
            <span className="text-cyan-300 font-bold">{sim.ammoniaProductionKgPerHour} kg/hr</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Reaction Heat:</span>
            <span className="text-purple-400 font-bold">{sim.reactionHeatGeneratedKw} kW</span>
          </div>
        </div>
      </div>

      {/* Parameter Control Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-900/60 rounded-lg border border-slate-800">
        {/* Reactor Pressure */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-cyan-400">Reactor Pressure</span>
            <span className="font-mono text-cyan-300">{pressureAtm} atm</span>
          </div>
          <input
            type="range"
            min={50}
            max={300}
            step={5}
            value={pressureAtm}
            onChange={(e) => updateParam("pressureAtm", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <span className="text-[10px] text-slate-400">Super-atmospheric compression</span>
        </div>

        {/* Catalyst Bed Temperature */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-amber-400">Catalyst Temp</span>
            <span className="font-mono text-amber-300">{temperatureCelsius} °C</span>
          </div>
          <input
            type="range"
            min={350}
            max={650}
            step={5}
            value={temperatureCelsius}
            onChange={(e) => updateParam("temperatureCelsius", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <span className="text-[10px] text-slate-400">Kinetic rate vs equilibrium yield</span>
        </div>

        {/* Feed Gas Flow */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-emerald-400">Feed Gas Flow</span>
            <span className="font-mono text-emerald-300">{feedFlowRateMolesPerSec} mol/s</span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            step={2}
            value={feedFlowRateMolesPerSec}
            onChange={(e) => updateParam("feedFlowRateMolesPerSec", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <span className="text-[10px] text-slate-400">1 N₂ : 3 H₂ stoichiometric feed</span>
        </div>

        {/* Catalyst Activity */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-purple-400">Catalyst Activity</span>
            <span className="font-mono text-purple-300">{catalystActivity.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min={0.2}
            max={2.0}
            step={0.1}
            value={catalystActivity}
            onChange={(e) => updateParam("catalystActivity", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <span className="text-[10px] text-slate-400">Osmium / Promoted Fe contact mass</span>
        </div>
      </div>
    </div>
  );
}
