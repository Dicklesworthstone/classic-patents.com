"use client";

import {
  Camera,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  Thermometer,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { soundEngine } from "@/utils/soundEngine";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "generator" | "condenser" | "evaporator" | "absorber";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  heatWatts: number;
  pressureAtm: number;
  gasRatio: number;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "einstein_1930_nominal",
    name: "1930 Berlin Prototype (Nominal)",
    desc: "Single-pressure hermetic cycle using butane, ammonia, and water with no moving seals or toxic leak hazards.",
    heatWatts: 220,
    pressureAtm: 10.0,
    gasRatio: 0.8,
  },
  {
    id: "deep_freeze",
    name: "Deep Sub-Zero Freeze Cycle",
    desc: "High auxiliary ammonia partial pressure dropping butane evaporation temperature down to -12°C.",
    heatWatts: 350,
    pressureAtm: 12.0,
    gasRatio: 0.92,
  },
  {
    id: "low_heat_solar",
    name: "Low-Grade Waste Heat / Solar",
    desc: "Gentle 120W input demonstrating passive thermosiphon circulation driven purely by heat buoyancy.",
    heatWatts: 120,
    pressureAtm: 8.0,
    gasRatio: 0.7,
  },
  {
    id: "maximum_cooling",
    name: "High-Capacity Industrial Mode",
    desc: "Heavy 500W thermal generator driving maximum vapor distillation and condensing mass flow rate.",
    heatWatts: 500,
    pressureAtm: 14.0,
    gasRatio: 0.9,
  },
];

export function EinsteinRefrigerator3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Absorption Thermodynamics State Controls
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [heatInputWatts, setHeatInputWatts] = useState<number>(220); // 80 to 500 Wattsts
  const [systemPressureAtm, setSystemPressureAtm] = useState<number>(10); // 6 to 16 Atm
  const [auxiliaryGasRatio, setAuxiliaryGasRatio] = useState<number>(0.8); // 0.2 to 0.95 Ammonia/Butane
  const [isHeating, setIsHeating] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  // Thermodynamic Physics (Dalton's Law of Partial Pressures)
  // P_butane = P_total * (1 - y_ammonia)
  const butanePartialPressureAtm = (systemPressureAtm * (1 - auxiliaryGasRatio)).toFixed(2);
  const evaporatorTemperatureCelsius = Math.round(-18 + Number(butanePartialPressureAtm) * 6.5);
  const copEfficiency = (0.35 * (1 - Math.abs(evaporatorTemperatureCelsius) / 100)).toFixed(2);
  const coolingPowerWatts = Math.round(heatInputWatts * Number(copEfficiency));

  const live = useLiveSimParams({
    heatInputWatts,
    isHeating,
    isAudioMuted,
  });

  const controlsRef = useRef<any>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (preset) {
      case "iso":
        camera.position.set(11, 8, 14);
        controls.target.set(0, 0, 0);
        break;
      case "generator":
        camera.position.set(3.8, 0.4, 3.8);
        controls.target.set(3.4, -0.8, 0);
        break;
      case "condenser":
        camera.position.set(2.4, 3.6, 3.0);
        controls.target.set(2.2, 2.6, 0);
        break;
      case "evaporator":
        camera.position.set(-2.8, 2.8, 3.8);
        controls.target.set(-2.8, 1.8, 0);
        break;
      case "absorber":
        camera.position.set(-3.2, -0.6, 3.6);
        controls.target.set(-2.8, -1.4, 0);
        break;
    }
    controls.update();
  };

  const applyScenario = (s: ScenarioPreset) => {
    setHeatInputWatts(s.heatWatts);
    setSystemPressureAtm(s.pressureAtm);
    setAuxiliaryGasRatio(s.gasRatio);
    if (!isAudioMuted) {
      soundEngine.playSwitchClick();
    }
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
      cameraPos: [11, 8, 14],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // --- PBR MATERIALS ---
    const steelPipeMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.15,
      metalness: 0.9,
    });

    const hotGeneratorMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0xd97706,
      emissiveIntensity: 0.5,
    });

    const coldEvaporatorMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.85,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4,
    });

    const condenserFinsMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.3,
      metalness: 0.85,
    });

    // --- 3D EINSTEIN-SZILARD REFRIGERATOR ASSEMBLY ---
    const fridgeGroup = new THREE.Group();
    scene.add(fridgeGroup);

    // 1. Hermetic Welded Steel Boiler / Bubble-Pump Generator
    const generator = new THREE.Mesh(
      new THREE.CylinderGeometry(0.9, 0.9, 3.4, 24),
      hotGeneratorMat,
    );
    generator.position.set(3.4, -1.2, 0);
    generator.castShadow = true;
    fridgeGroup.add(generator);

    const bubbleTube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 4.2, 16),
      condenserFinsMat,
    );
    bubbleTube.position.set(3.4, 1.4, 0);
    fridgeGroup.add(bubbleTube);

    const heater = new THREE.Mesh(
      new THREE.CylinderGeometry(1.05, 1.05, 0.8, 24),
      new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, roughness: 0.3 }),
    );
    heater.position.set(3.4, -2.6, 0);
    heater.castShadow = true;
    fridgeGroup.add(heater);

    // 2. Serpentine Condenser Coil Heat Exchanger
    const condenserGroup = new THREE.Group();
    condenserGroup.position.set(2.2, 2.6, 0);

    const condenserPts: THREE.Vector3[] = [];
    for (let c = 0; c < 5; c++) {
      const y = (c - 2) * 0.4;
      const xLeft = -1.2;
      const xRight = 1.2;
      condenserPts.push(new THREE.Vector3(c % 2 === 0 ? xLeft : xRight, y, 0));
      condenserPts.push(new THREE.Vector3(c % 2 === 0 ? xRight : xLeft, y, 0));
    }
    const condenserCurve = new THREE.CatmullRomCurve3(condenserPts);
    const condenserGeo = new THREE.TubeGeometry(condenserCurve, 60, 0.09, 8, false);
    const condenserMesh = new THREE.Mesh(condenserGeo, condenserFinsMat);
    condenserMesh.castShadow = true;
    condenserGroup.add(condenserMesh);

    for (let f = 0; f < 8; f++) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.2, 0.8), condenserFinsMat);
      fin.position.set(-1.0 + f * 0.28, 0, 0);
      condenserGroup.add(fin);
    }
    fridgeGroup.add(condenserGroup);

    // 3. Evaporator Freezing Chamber
    const evaporator = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.6, 2.6), coldEvaporatorMat);
    evaporator.position.set(-2.8, 1.8, 0);
    evaporator.castShadow = true;
    fridgeGroup.add(evaporator);

    for (let s = 0; s < 3; s++) {
      const shelf = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 0.05, 2.2),
        new THREE.MeshStandardMaterial({ color: 0xe0f2fe, roughness: 0.1 }),
      );
      shelf.position.set(-2.8, 0.9 + s * 0.7, 0);
      fridgeGroup.add(shelf);
    }

    // 4. Absorber Vessel with Horizontal Heat Radiating Rings
    const absorber = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 3.4, 24), steelPipeMat);
    absorber.position.set(-2.8, -1.4, 0);
    absorber.castShadow = true;
    fridgeGroup.add(absorber);

    for (let a = 0; a < 6; a++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.05, 8, 24), steelPipeMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(-2.8, -2.6 + a * 0.5, 0);
      fridgeGroup.add(ring);
    }

    // 5. Counter-Flow Concentric Liquid Heat Exchanger Loop
    const economizerCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(3.4, -0.4, 0),
      new THREE.Vector3(1.2, -0.8, 0.4),
      new THREE.Vector3(-1.0, -1.2, 0.4),
      new THREE.Vector3(-2.8, -0.6, 0),
    ]);
    const economizerGeo = new THREE.TubeGeometry(economizerCurve, 32, 0.14, 8, false);
    const economizer = new THREE.Mesh(economizerGeo, steelPipeMat);
    economizer.castShadow = true;
    fridgeGroup.add(economizer);

    // Return Gas Conduit
    const h2PipeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.8, 0.5, 0),
      new THREE.Vector3(0, 0.2, -0.5),
      new THREE.Vector3(2.4, 1.2, -0.5),
      new THREE.Vector3(3.4, 0.8, 0),
    ]);
    const h2PipeGeo = new THREE.TubeGeometry(h2PipeCurve, 32, 0.09, 8, false);
    const h2Pipe = new THREE.Mesh(h2PipeGeo, steelPipeMat);
    fridgeGroup.add(h2Pipe);

    // --- GLOWING WORKING FLUID CONVECTION PARTICLES ---
    const fluidCount = 120;
    const fluidGeo = new THREE.BufferGeometry();
    const fluidPos = new Float32Array(fluidCount * 3);
    const fluidColors = new Float32Array(fluidCount * 3);

    const glowTex = createGlowPointTexture();

    for (let i = 0; i < fluidCount; i++) {
      const idx = i * 3;
      fluidPos[idx] = (Math.random() - 0.5) * 6.0;
      fluidPos[idx + 1] = (Math.random() - 0.5) * 4.5;
      fluidPos[idx + 2] = (Math.random() - 0.5) * 0.4;

      const progressX = (fluidPos[idx] + 3.0) / 6.0;
      fluidColors[idx] = progressX;
      fluidColors[idx + 1] = 0.5 + (1 - progressX) * 0.4;
      fluidColors[idx + 2] = 1.0 - progressX * 0.8;
    }

    fluidGeo.setAttribute("position", new THREE.BufferAttribute(fluidPos, 3));
    fluidGeo.setAttribute("color", new THREE.BufferAttribute(fluidColors, 3));

    const fluidPoints = new THREE.Points(
      fluidGeo,
      new THREE.PointsMaterial({
        size: 0.38,
        map: glowTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    fridgeGroup.add(fluidPoints);

    // --- RENDER LOOP & REAL-TIME THERMOSIPHON CIRCULATION ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;

      const fPos = fluidPos;
      const circSpeed = (p.isHeating ? p.heatInputWatts / 220 : 0) * 3.5 * delta;

      for (let i = 0; i < fluidCount; i++) {
        const idx = i * 3;

        if (fPos[idx] > 2.0 && fPos[idx + 1] < 2.0) {
          fPos[idx + 1] += circSpeed;
        } else if (fPos[idx + 1] >= 2.0 && fPos[idx] > -2.5) {
          fPos[idx] -= circSpeed;
        } else if (fPos[idx] <= -2.5 && fPos[idx + 1] > -2.0) {
          fPos[idx + 1] -= circSpeed;
        } else {
          fPos[idx] += circSpeed;
        }
      }
      fluidGeo.attributes.position.needsUpdate = true;

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
                <Thermometer className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 animate-pulse" />
                Einstein-Szilard Absorption Cycle
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 sm:gap-y-1 mt-1 text-[10px] sm:text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Evaporator Temp:</span>{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {evaporatorTemperatureCelsius}°C (
                    {Math.round((evaporatorTemperatureCelsius * 9) / 5 + 32)}°F)
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Cooling Power:</span>{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {coolingPowerWatts} W (COP {copEfficiency})
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Butane P:</span>{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {butanePartialPressureAtm} atm ({systemPressureAtm} atm Tot)
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Moving Parts:</span>{" "}
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    0 (Hermetic / Silent)
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 items-center gap-2 max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse shrink-0" />
              <span className="truncate">
                Albert Einstein & Leo Szilard (US 1,781,541) — Refrigeration (1930)
              </span>
            </div>
          </div>
        )}

        {/* Top Right Tool Bar (Toggle UI, Audio, Pins, Reset) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-all shadow-sm ${
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
            type="button"
            onClick={toggleSound}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-all shadow-sm"
            title={isAudioMuted ? "Enable Sound Synthesis" : "Mute Sound"}
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowCalloutPins(!showCalloutPins)}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-all shadow-sm ${
              showCalloutPins
                ? "bg-amber-600 text-white border-amber-700 shadow-md"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title="Toggle Historical Patent Numeral Pins"
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-all shadow-sm"
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
                ["generator", "Boiler Generator"],
                ["condenser", "Condenser Fins"],
                ["evaporator", "Cold Evaporator"],
                ["absorber", "Absorber Rings"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => applyCameraPreset(id)}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-sans whitespace-nowrap shrink-0 transition-all ${
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

      {/* Interactive Controls & Scenario Bar */}
      <div className="p-4 sm:p-5 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 space-y-4">
        {/* Scenario Presets */}
        <div className="space-y-1.5">
          <div className="text-xs font-sans font-bold text-ink-700 dark:text-ink-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Absorption Thermodynamics Presets:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => applyScenario(s)}
                className="p-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 bg-white/70 dark:bg-ink-950/70 hover:bg-parchment-50 dark:hover:bg-ink-800 text-left transition-all group"
              >
                <div className="text-xs font-serif font-bold text-ink-900 dark:text-parchment-100 group-hover:text-amber-700 dark:group-hover:text-amber-400">
                  {s.name}
                </div>
                <div className="text-[10px] font-sans text-ink-500 dark:text-ink-400 line-clamp-2 mt-0.5">
                  {s.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Heat Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="font-semibold text-ink-800 dark:text-parchment-200">
                Heat Source Input:
              </span>
              <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">
                {heatInputWatts} Watts
              </span>
            </div>
            <input
              type="range"
              min="80"
              max="500"
              step="10"
              value={heatInputWatts}
              onChange={(e) => setHeatInputWatts(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
              Boiler flame or electric element power
            </span>
          </div>

          {/* System Pressure */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="font-semibold text-ink-800 dark:text-parchment-200">
                Total System Pressure:
              </span>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                {systemPressureAtm.toFixed(1)} atm
              </span>
            </div>
            <input
              type="range"
              min="6.0"
              max="16.0"
              step="0.5"
              value={systemPressureAtm}
              onChange={(e) => setSystemPressureAtm(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
              Constant hermetic equilibrium pressure
            </span>
          </div>

          {/* Heat Drive Toggle */}
          <div className="flex flex-col justify-end space-y-1.5">
            <button
              type="button"
              onClick={() => setIsHeating(!isHeating)}
              className={`w-full py-3 px-4 rounded-xl font-sans font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 ${
                isHeating
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                  : "bg-amber-600 hover:bg-amber-700 text-white shadow-md"
              }`}
            >
              <Thermometer className="w-4 h-4" />
              {isHeating ? "Heat Source ACTIVE (Circulating)" : "Heat OFF (Cooling Halted)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
