"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { stepHewittMercuryLamp } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import {
  articulateHewittMercuryLampModel,
  buildHewittMercuryLampModel,
  type HewittMercuryLampModelNodes,
} from "./hewittMercuryLampModel";
import { useLiveSimParams } from "./useLiveSimParams";

interface HewittMercuryLamp3DProps {
  initialMainsVoltageV?: number;
  initialTubeLengthCm?: number;
  initialTubeDiameterMm?: number;
  initialCondenserCoolingLevel?: number;
  initialBallastResistanceOhms?: number;
}

type CameraPreset = "isometric" | "cathode" | "plasmaColumn" | "condenser";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  isometric: { pos: [0, 2.5, 5.0], target: [0, 1.5, 0] },
  cathode: { pos: [-1.6, 1.6, 1.8], target: [-1.6, 1.4, 0] },
  plasmaColumn: { pos: [0, 1.6, 2.5], target: [0, 1.5, 0] },
  condenser: { pos: [1.6, 1.9, 1.8], target: [1.6, 1.7, 0] },
};

export function HewittMercuryLamp3D({
  initialMainsVoltageV = 110,
  initialTubeLengthCm = 100,
  initialTubeDiameterMm = 25,
  initialCondenserCoolingLevel = 1.0,
  initialBallastResistanceOhms = 12,
}: HewittMercuryLamp3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const nodesRef = useRef<HewittMercuryLampModelNodes | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  const { params, updateParam } = usePatentPhysics("us-682690-hewitt-mercury-lamp");
  const mainsVoltageV = params.mainsVoltageV ?? initialMainsVoltageV;
  const tubeLengthCm = params.tubeLengthCm ?? initialTubeLengthCm;
  const tubeDiameterMm = params.tubeDiameterMm ?? initialTubeDiameterMm;
  const condenserCoolingLevel = params.condenserCoolingLevel ?? initialCondenserCoolingLevel;
  const ballastResistanceOhms = params.ballastResistanceOhms ?? initialBallastResistanceOhms;
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("isometric");
  const [isRotating, setIsRotating] = useState(false);

  const sim = stepHewittMercuryLamp({
    mainsVoltageV,
    tubeLengthCm,
    tubeDiameterMm,
    condenserCoolingLevel,
    ballastResistanceOhms,
  });

  const live = useLiveSimParams({
    isRotating,
    arcCurrentAmperes: sim.arcCurrentAmperes,
    luminousEfficacyLmPerWatt: sim.luminousEfficacyLmPerWatt,
    mercuryVaporPressureMmHg: sim.mercuryVaporPressureMmHg,
    arcOperatingVoltageV: sim.arcOperatingVoltageV,
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.0);
    keyLight.position.set(5, 10, 8);
    keyLight.castShadow = true;
    keyLight.shadow.bias = -0.0002;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    scene.add(keyLight);

    const cyanFill = new THREE.DirectionalLight(0x06b6d4, 1.2);
    cyanFill.position.set(-6, 3, -4);
    scene.add(cyanFill);

    const warmRim = new THREE.DirectionalLight(0xd97706, 1.0);
    warmRim.position.set(0, -3, -5);
    scene.add(warmRim);

    // Build Model
    const nodes = buildHewittMercuryLampModel();
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
        articulateHewittMercuryLampModel(
          nodesRef.current,
          {
            arcCurrentAmperes: p.arcCurrentAmperes,
            luminousEfficacyLmPerWatt: p.luminousEfficacyLmPerWatt,
            mercuryVaporPressureMmHg: p.mercuryVaporPressureMmHg,
            arcOperatingVoltageV: p.arcOperatingVoltageV,
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
            Peter Cooper Hewitt Mercury-Vapor Arc Lamp 3D WebGL Studio
          </h2>
          <p className="text-sm text-slate-400">
            Procedural 3D simulation of US Patent 682,690 • Pure WebGL (No GLTF assets)
          </p>
        </div>

        {/* Camera Presets & Orbit Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {(["isometric", "cathode", "plasmaColumn", "condenser"] as CameraPreset[]).map(
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
            <span className="text-slate-400">Luminous Efficacy:</span>
            <span className="text-emerald-400 font-bold">{sim.luminousEfficacyLmPerWatt} lm/W</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Total Flux:</span>
            <span className="text-cyan-400 font-bold">
              {sim.luminousFluxLumens.toLocaleString()} lm
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Arc Current:</span>
            <span className="text-cyan-300 font-bold">{sim.arcCurrentAmperes} A</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Arc Voltage Drop:</span>
            <span className="text-amber-400 font-bold">{sim.arcOperatingVoltageV} V</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Replaces:</span>
            <span className="text-purple-400 font-bold">
              {sim.equivalentCarbonBulbs} Carbon Bulbs
            </span>
          </div>
        </div>
      </div>

      {/* Parameter Control Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-slate-900/60 rounded-lg border border-slate-800">
        {/* Mains Voltage */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-cyan-400">Mains Voltage</span>
            <span className="font-mono text-cyan-300">{mainsVoltageV} V</span>
          </div>
          <input
            type="range"
            min={80}
            max={240}
            step={5}
            value={mainsVoltageV}
            onChange={(e) => updateParam("mainsVoltageV", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <span className="text-[10px] text-slate-400">Commercial supply mains</span>
        </div>

        {/* Tube Length */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-amber-400">Tube Length</span>
            <span className="font-mono text-amber-300">{tubeLengthCm} cm</span>
          </div>
          <input
            type="range"
            min={30}
            max={150}
            step={5}
            value={tubeLengthCm}
            onChange={(e) => updateParam("tubeLengthCm", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <span className="text-[10px] text-slate-400">Positive column length</span>
        </div>

        {/* Tube Diameter */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-emerald-400">Tube Diameter</span>
            <span className="font-mono text-emerald-300">{tubeDiameterMm} mm</span>
          </div>
          <input
            type="range"
            min={15}
            max={40}
            step={1}
            value={tubeDiameterMm}
            onChange={(e) => updateParam("tubeDiameterMm", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <span className="text-[10px] text-slate-400">Discharge bore width</span>
        </div>

        {/* Condenser Cooling */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-purple-400">Condenser Cooling</span>
            <span className="font-mono text-purple-300">{condenserCoolingLevel.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={2.0}
            step={0.1}
            value={condenserCoolingLevel}
            onChange={(e) => updateParam("condenserCoolingLevel", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <span className="text-[10px] text-slate-400">Vapor pressure regulator</span>
        </div>

        {/* Ballast Resistance */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-rose-400">Ballast Resistance</span>
            <span className="font-mono text-rose-300">{ballastResistanceOhms} Ω</span>
          </div>
          <input
            type="range"
            min={5}
            max={30}
            step={1}
            value={ballastResistanceOhms}
            onChange={(e) => updateParam("ballastResistanceOhms", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
          <span className="text-[10px] text-slate-400">Negative resistance stabilizer</span>
        </div>
      </div>
    </div>
  );
}

export default HewittMercuryLamp3D;
