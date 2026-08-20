"use client";

import {
  Activity,
  Camera,
  Cog,
  Eye,
  EyeOff,
  Flame,
  Gauge,
  Layers,
  RotateCw,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { stepWattRotaryEngine } from "@/physics/wattRotaryKernel";
import { buildWattRotaryEngineModel, type WattRotaryModelNodes } from "./wattRotaryEngineModel";

type CameraPreset = "overview" | "gear-mesh" | "beam" | "cylinder";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  overview: { pos: [4.8, 4.2, 5.8], target: [0.5, 1.8, 0] },
  "gear-mesh": { pos: [3.8, 1.8, 3.2], target: [2.2, 0.9, 0] },
  beam: { pos: [0.2, 4.5, 4.0], target: [0, 3.2, 0] },
  cylinder: { pos: [-3.8, 2.5, 3.2], target: [-2.2, 1.5, 0] },
};

export function WattRotaryEngine3D() {
  const { params, setParam } = usePatentPhysics("gb-1306-watt-rotary-engine");

  const strokeRateSpm = params.strokeRateSpm ?? 20;
  const boilerPressureKpa = params.boilerPressureKpa ?? 70;
  const gearRatioNpOverNs = params.gearRatioNpOverNs ?? 1.0;
  const flywheelMassKg = params.flywheelMassKg ?? 3500;

  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef = useRef<WattRotaryModelNodes | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [cutaway, setCutaway] = useState(false);
  const [showCallouts, setShowCallouts] = useState(true);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("overview");

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const cutawayRef = useRef(cutaway);
  cutawayRef.current = cutaway;

  const showCalloutsRef = useRef(showCallouts);
  showCalloutsRef.current = showCallouts;

  const strokeRateSpmRef = useRef(strokeRateSpm);
  strokeRateSpmRef.current = strokeRateSpm;

  const boilerPressureKpaRef = useRef(boilerPressureKpa);
  boilerPressureKpaRef.current = boilerPressureKpa;

  const gearRatioNpOverNsRef = useRef(gearRatioNpOverNs);
  gearRatioNpOverNsRef.current = gearRatioNpOverNs;

  const flywheelMassKgRef = useRef(flywheelMassKg);
  flywheelMassKgRef.current = flywheelMassKg;

  const handleCameraPreset = (preset: CameraPreset) => {
    setCameraPreset(preset);
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;
    const cfg = CAMERA_PRESETS[preset];
    cam.position.set(...cfg.pos);
    ctrl.target.set(...cfg.target);
    ctrl.update();
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0c10);
    scene.fog = new THREE.FogExp2(0x0a0c10, 0.04);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / (container.clientHeight || 480),
      0.1,
      100,
    );
    const initialPreset = CAMERA_PRESETS.overview;
    camera.position.set(...initialPreset.pos);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight || 480, false);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.replaceChildren(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(...initialPreset.target);
    controls.maxDistance = 20;
    controls.minDistance = 1.5;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff6ea, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffedd5, 2.4);
    keyLight.position.set(6, 9, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
    fillLight.position.set(-8, 5, -5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xf59e0b, 1.2);
    rimLight.position.set(0, 8, -6);
    scene.add(rimLight);

    // Grid Ground
    const gridHelper = new THREE.GridHelper(16, 16, 0x78350f, 0x1f2937);
    gridHelper.position.y = -0.4;
    scene.add(gridHelper);

    // Build Procedural 3D Model
    const model = buildWattRotaryEngineModel();
    scene.add(model.root);
    modelRef.current = model;

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

    // Deterministic Animation Loop
    let virtualTimeSec = 0;
    const dt = 1 / 60;

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      if (isPlayingRef.current) {
        virtualTimeSec += dt;
      }

      if (modelRef.current) {
        if (isPlayingRef.current) {
          modelRef.current.updateAnimation(
            virtualTimeSec,
            strokeRateSpmRef.current,
            gearRatioNpOverNsRef.current,
          );
        }
        modelRef.current.setCutaway(cutawayRef.current);
        modelRef.current.setShowCallouts(showCalloutsRef.current);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.forceContextLoss();
      renderer.dispose();
      model.dispose();
      container.replaceChildren();
    };
  }, []);

  const telemetry = stepWattRotaryEngine(
    {
      strokeRateSpm,
      boilerPressureKpa,
      gearRatioNpOverNs,
      flywheelMassKg,
    },
    0,
  );

  return (
    <div className="w-full bg-[#0a0d14] border border-amber-950/40 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6 text-stone-200">
      {/* Header & Controls Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-900/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Three.js WebGL 3D Studio
            </span>
            <h3 className="text-lg font-bold text-amber-100 font-serif">
              James Watt Sun &amp; Planet Epicyclic Engine
            </h3>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Pure procedural 3D kinematics with 2:1 epicyclic gear acceleration and interactive
            camera presets
          </p>
        </div>

        {/* View & Feature Toggles */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Camera Presets */}
          <div className="flex items-center gap-1 bg-stone-900/80 p-1 rounded-lg border border-stone-800 text-xs">
            <Camera className="w-3.5 h-3.5 text-stone-400 ml-1.5 mr-0.5" />
            <button
              type="button"
              onClick={() => handleCameraPreset("overview")}
              className={`px-2 py-1 rounded transition-colors ${
                cameraPreset === "overview"
                  ? "bg-amber-500/20 text-amber-300 font-semibold"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => handleCameraPreset("gear-mesh")}
              className={`px-2 py-1 rounded transition-colors ${
                cameraPreset === "gear-mesh"
                  ? "bg-amber-500/20 text-amber-300 font-semibold"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              Gear Mesh
            </button>
            <button
              type="button"
              onClick={() => handleCameraPreset("beam")}
              className={`px-2 py-1 rounded transition-colors ${
                cameraPreset === "beam"
                  ? "bg-amber-500/20 text-amber-300 font-semibold"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              Beam
            </button>
            <button
              type="button"
              onClick={() => handleCameraPreset("cylinder")}
              className={`px-2 py-1 rounded transition-colors ${
                cameraPreset === "cylinder"
                  ? "bg-amber-500/20 text-amber-300 font-semibold"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              Cylinder
            </button>
          </div>

          {/* Cutaway Toggle */}
          <button
            type="button"
            onClick={() => setCutaway(!cutaway)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              cutaway
                ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                : "bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{cutaway ? "Solid Shell" : "Cutaway Cylinder"}</span>
          </button>

          {/* Callouts Toggle */}
          <button
            type="button"
            onClick={() => setShowCallouts(!showCallouts)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              showCallouts
                ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                : "bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200"
            }`}
          >
            {showCallouts ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showCallouts ? "Hide Pins" : "Show Pins"}</span>
          </button>

          {/* Play/Pause */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isPlaying
                ? "bg-amber-600/20 border-amber-500/40 text-amber-200"
                : "bg-emerald-600/20 border-emerald-500/40 text-emerald-200"
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isPlaying ? "Pause" : "Play"}</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div className="relative w-full aspect-[16/10] bg-[#05070b] rounded-xl border border-stone-800 overflow-hidden shadow-inner">
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Live HUD Overlay */}
        <div className="absolute top-4 right-4 bg-slate-900/85 backdrop-blur-md border border-amber-500/30 p-3.5 rounded-xl shadow-xl space-y-1.5 pointer-events-none text-xs font-sans max-w-[240px]">
          <div className="flex items-center justify-between text-amber-400 font-mono font-bold border-b border-stone-800 pb-1 text-[11px]">
            <span>SHAFT MULTIPLIER</span>
            <span className="text-emerald-400">
              {telemetry.speedMultiplier.toFixed(1)}× (2:1 Ratio)
            </span>
          </div>
          <div className="flex justify-between text-stone-300 text-[11px]">
            <span>Driveshaft Speed:</span>
            <span className="font-mono text-amber-300">{telemetry.shaftRpm.toFixed(1)} RPM</span>
          </div>
          <div className="flex justify-between text-stone-300 text-[11px]">
            <span>Indicated Power:</span>
            <span className="font-mono text-emerald-400">
              {telemetry.meanPowerKw.toFixed(1)} kW
            </span>
          </div>
          <div className="flex justify-between text-stone-300 text-[11px]">
            <span>Imperial Horsepower:</span>
            <span className="font-mono text-purple-300">
              {telemetry.brakeHorsepower.toFixed(1)} hp
            </span>
          </div>
          <div className="flex justify-between text-stone-300 text-[11px]">
            <span>Piston Driving Force:</span>
            <span className="font-mono text-rose-400">
              {(telemetry.pistonForceN / 1e3).toFixed(1)} kN
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Controls Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-stone-900/40 p-4 rounded-xl border border-stone-800">
        {/* Stroke Rate */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-stone-400 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-amber-400" /> Beam Stroke Rate
            </span>
            <span className="font-mono text-amber-300">{strokeRateSpm} SPM</span>
          </div>
          <input
            type="range"
            min="10"
            max="30"
            step="2"
            value={strokeRateSpm}
            onChange={(e) => setParam("strokeRateSpm", Number(e.target.value))}
            className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        {/* Boiler Pressure */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-stone-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-400" /> Boiler Pressure
            </span>
            <span className="font-mono text-rose-300">{boilerPressureKpa} kPa</span>
          </div>
          <input
            type="range"
            min="40"
            max="120"
            step="5"
            value={boilerPressureKpa}
            onChange={(e) => setParam("boilerPressureKpa", Number(e.target.value))}
            className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
        </div>

        {/* Gear Ratio */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-stone-400 flex items-center gap-1">
              <Cog className="w-3.5 h-3.5 text-cyan-400" /> Gear Tooth Ratio
            </span>
            <span className="font-mono text-cyan-300">{gearRatioNpOverNs.toFixed(2)} : 1</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.25"
            value={gearRatioNpOverNs}
            onChange={(e) => setParam("gearRatioNpOverNs", Number(e.target.value))}
            className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>

        {/* Flywheel Mass */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-stone-400 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-purple-400" /> Flywheel Mass
            </span>
            <span className="font-mono text-purple-300">{flywheelMassKg} kg</span>
          </div>
          <input
            type="range"
            min="1000"
            max="6000"
            step="250"
            value={flywheelMassKg}
            onChange={(e) => setParam("flywheelMassKg", Number(e.target.value))}
            className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>
      </div>
    </div>
  );
}
