"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { stepDeForestAudion } from "@/physics/catalogKernels";
import {
  articulateDeForestAudionModel,
  buildDeForestAudionModel,
  type DeForestAudionModelNodes,
} from "./deForestAudionModel";

interface DeForestAudion3DProps {
  initialPlateVoltageV?: number;
  initialGridBiasVoltageV?: number;
  initialFilamentCurrentA?: number;
  initialGridSignalAmplitudeMv?: number;
  initialLoadResistanceKOhms?: number;
}

type CameraPreset = "isometric" | "gridControl" | "filament" | "plateAnode";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  isometric: { pos: [0, 1.5, 4.0], target: [0, 0.2, 0] },
  gridControl: { pos: [0, 0.4, 2.0], target: [0, 0.2, 0] },
  filament: { pos: [-1.2, 0.4, 1.8], target: [-0.35, 0.2, 0] },
  plateAnode: { pos: [1.2, 0.4, 1.8], target: [0.4, 0.2, 0] },
};

export function DeForestAudion3D({
  initialPlateVoltageV = 45,
  initialGridBiasVoltageV = -1.5,
  initialFilamentCurrentA = 1.0,
  initialGridSignalAmplitudeMv = 50,
  initialLoadResistanceKOhms = 20,
}: DeForestAudion3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const nodesRef = useRef<DeForestAudionModelNodes | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  const [plateVoltageV, setPlateVoltageV] = useState(initialPlateVoltageV);
  const [gridBiasVoltageV, setGridBiasVoltageV] = useState(initialGridBiasVoltageV);
  const [filamentCurrentA, setFilamentCurrentA] = useState(initialFilamentCurrentA);
  const [gridSignalAmplitudeMv, setGridSignalAmplitudeMv] = useState(initialGridSignalAmplitudeMv);
  const [loadResistanceKOhms, setLoadResistanceKOhms] = useState(initialLoadResistanceKOhms);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("isometric");
  const [isRotating, setIsRotating] = useState(false);

  const sim = stepDeForestAudion({
    plateVoltageV,
    gridBiasVoltageV,
    filamentCurrentA,
    gridSignalAmplitudeMv,
    loadResistanceKOhms,
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
    scene.background = new THREE.Color(0x070b14);
    scene.fog = new THREE.FogExp2(0x070b14, 0.1);

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

    const keyLight = new THREE.DirectionalLight(0xffedd5, 2.2);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.bias = -0.0002;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    scene.add(keyLight);

    const cyanFill = new THREE.DirectionalLight(0x06b6d4, 1.0);
    cyanFill.position.set(-6, 3, -4);
    scene.add(cyanFill);

    const warmRim = new THREE.DirectionalLight(0xf59e0b, 1.2);
    warmRim.position.set(0, -3, -5);
    scene.add(warmRim);

    // Build Model
    const nodes = buildDeForestAudionModel();
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

      if (isRotating && controlsRef.current) {
        controlsRef.current.autoRotate = true;
        controlsRef.current.autoRotateSpeed = 1.0;
      } else if (controlsRef.current) {
        controlsRef.current.autoRotate = false;
      }

      controlsRef.current?.update();

      if (nodesRef.current) {
        articulateDeForestAudionModel(
          nodesRef.current,
          {
            filamentTemperatureK: sim.filamentTemperatureK,
            plateCurrentMa: sim.plateCurrentMa,
            voltageGain: sim.voltageGain,
            isConducting: sim.isConducting,
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
  }, [
    isRotating,
    cameraPreset,
    sim.filamentTemperatureK,
    sim.plateCurrentMa,
    sim.voltageGain,
    sim.isConducting,
  ]);

  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-wide text-cyan-400">
            Lee de Forest Audion Triode Vacuum Tube 3D WebGL Studio
          </h2>
          <p className="text-sm text-slate-400">
            Procedural 3D simulation of US Patent 879,532 • Pure WebGL (No GLTF assets)
          </p>
        </div>

        {/* Camera Presets & Orbit Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {(["isometric", "gridControl", "filament", "plateAnode"] as CameraPreset[]).map(
            (preset) => (
              <button
                key={preset}
                type="button"
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
            <span className="text-slate-400">Voltage Gain:</span>
            <span className="text-emerald-400 font-bold">{sim.voltageGain}x</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Plate Current:</span>
            <span className="text-cyan-400 font-bold">{sim.plateCurrentMa} mA</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Transconductance:</span>
            <span className="text-amber-400 font-bold">
              {sim.dynamicTransconductanceMicromhos} µmhos
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Cutoff Bias:</span>
            <span className="text-rose-400 font-bold">{sim.gridCutoffVoltageV} V</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Power Gain:</span>
            <span className="text-purple-400 font-bold">{sim.powerGainDb} dB</span>
          </div>
        </div>
      </div>

      {/* Parameter Control Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-slate-900/60 rounded-lg border border-slate-800">
        {/* Plate Voltage */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-amber-400">B-Battery Plate</span>
            <span className="font-mono text-amber-300">{plateVoltageV} V</span>
          </div>
          <input
            type="range"
            min={10}
            max={120}
            step={5}
            value={plateVoltageV}
            onChange={(e) => setPlateVoltageV(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <span className="text-[10px] text-slate-400">High-voltage DC supply</span>
        </div>

        {/* Grid Bias Voltage */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-cyan-400">Grid Bias Voltage</span>
            <span className="font-mono text-cyan-300">{gridBiasVoltageV.toFixed(1)} V</span>
          </div>
          <input
            type="range"
            min={-6.0}
            max={2.0}
            step={0.25}
            value={gridBiasVoltageV}
            onChange={(e) => setGridBiasVoltageV(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <span className="text-[10px] text-slate-400">Electrostatic control bias</span>
        </div>

        {/* Filament Current */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-yellow-400">Filament Current</span>
            <span className="font-mono text-yellow-300">{filamentCurrentA.toFixed(1)} A</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={1.5}
            step={0.1}
            value={filamentCurrentA}
            onChange={(e) => setFilamentCurrentA(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
          <span className="text-[10px] text-slate-400">Cathode heating power</span>
        </div>

        {/* Input Signal Amplitude */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-emerald-400">Input RF Signal</span>
            <span className="font-mono text-emerald-300">{gridSignalAmplitudeMv} mV</span>
          </div>
          <input
            type="range"
            min={10}
            max={200}
            step={5}
            value={gridSignalAmplitudeMv}
            onChange={(e) => setGridSignalAmplitudeMv(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <span className="text-[10px] text-slate-400">Antenna carrier swing</span>
        </div>

        {/* Plate Load Resistance */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-purple-400">Load Resistance</span>
            <span className="font-mono text-purple-300">{loadResistanceKOhms} kΩ</span>
          </div>
          <input
            type="range"
            min={5}
            max={50}
            step={5}
            value={loadResistanceKOhms}
            onChange={(e) => setLoadResistanceKOhms(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <span className="text-[10px] text-slate-400">Headset coil impedance</span>
        </div>
      </div>
    </div>
  );
}

export default DeForestAudion3D;
