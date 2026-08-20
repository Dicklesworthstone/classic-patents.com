"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { stepFessendenWireless } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import {
  articulateFessendenWireless,
  buildFessendenWirelessModel,
  type FessendenWirelessModelNodes,
} from "./fessendenWirelessModel";
import { useLiveSimParams } from "./useLiveSimParams";

type CameraPreset = "isometric" | "alternator" | "cageAntenna" | "liquidBarretter";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  isometric: { pos: [3.5, 3.0, 4.5], target: [0, 1.2, 0] },
  alternator: { pos: [-1.8, 1.2, 2.0], target: [-1.8, 0.4, 0] },
  cageAntenna: { pos: [0.5, 2.2, 2.5], target: [0.5, 1.8, 0] },
  liquidBarretter: { pos: [2.0, 0.8, 1.2], target: [1.9, 0.3, 0] },
};

export function FessendenWireless3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { params, updateParam } = usePatentPhysics("us-706737-fessenden-wireless");
  const carrierFreqKhz = params.carrierFrequencyKhz ?? 75;
  const audioModPct = params.audioModulationPct ?? 65;
  const antennaTuningUh = params.antennaTuningUh ?? 450;
  const distanceKm = params.transmissionDistanceKm ?? 25;
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("isometric");
  const [isRotating, setIsRotating] = useState(false);

  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const nodesRef = useRef<FessendenWirelessModelNodes | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  const sim = stepFessendenWireless({
    carrierFrequencyKhz: carrierFreqKhz,
    audioModulationPct: audioModPct,
    antennaTuningUh: antennaTuningUh,
    transmissionDistanceKm: distanceKm,
  });

  const live = useLiveSimParams({
    carrierFreqKhz,
    audioModPct,
    isRotating,
    radiatedPowerWatts: sim.radiatedPowerWatts,
    isResonant: sim.isResonant,
  });

  const handlePresetChange = (preset: CameraPreset) => {
    setCameraPreset(preset);
    if (!cameraRef.current || !controlsRef.current) return;
    const { pos, target } = CAMERA_PRESETS[preset];
    cameraRef.current.position.set(...pos);
    controlsRef.current.target.set(...target);
    controlsRef.current.update();
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 480;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060913);

    // Fog
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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(...CAMERA_PRESETS[cameraPreset].target);
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5e6, 2.0);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const blueFill = new THREE.DirectionalLight(0x38bdf8, 1.2);
    blueFill.position.set(-5, 4, -4);
    scene.add(blueFill);

    const pointGlow = new THREE.PointLight(0x10b981, 1.5, 8);
    pointGlow.position.set(0.5, 2.0, 0);
    scene.add(pointGlow);

    // Build Model
    const nodes = buildFessendenWirelessModel();
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
        articulateFessendenWireless(nodesRef.current, {
          timeSec: timeRef.current,
          carrierFrequencyKhz: p.carrierFreqKhz,
          radiatedPowerWatts: p.radiatedPowerWatts,
          audioModulationPct: p.audioModPct,
          isResonant: p.isResonant,
        });
      }

      pointGlow.color.setHex(p.isResonant ? 0x10b981 : 0xf59e0b);
      pointGlow.intensity = (p.radiatedPowerWatts / 1000) * 2.0;

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
      {/* HUD Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-wide text-cyan-400">
            Reginald Fessenden Continuous-Wave Radio 3D WebGL Studio
          </h2>
          <p className="text-sm text-slate-400">
            Procedural 3D simulation of US Patent 706,737 • Pure WebGL (No GLTF assets)
          </p>
        </div>

        {/* Camera Presets & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {(["isometric", "alternator", "cageAntenna", "liquidBarretter"] as CameraPreset[]).map(
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
                ? "bg-emerald-700 text-white"
                : "bg-slate-900 text-slate-400 hover:text-slate-200"
            }`}
          >
            {isRotating ? "Auto-Rotate ON" : "Auto-Rotate OFF"}
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/9] min-h-[440px] bg-slate-950 rounded-lg overflow-hidden border border-slate-800 cursor-grab active:cursor-grabbing"
      >
        <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-slate-900/80 backdrop-blur rounded text-xs font-mono text-cyan-400 border border-slate-700">
          Camera: {cameraPreset} | SI Physics Loop
        </div>
      </div>

      {/* Real-time SI Metrics HUD */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="text-xs text-slate-400 uppercase tracking-wider">Antenna Resonance</div>
          <div className="text-lg font-bold text-emerald-400">{sim.antennaResonantFreqKhz} kHz</div>
          <div className="text-xs text-slate-500">{sim.isResonant ? "Locked" : "Detuned"}</div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="text-xs text-slate-400 uppercase tracking-wider">Radiated RF Power</div>
          <div className="text-lg font-bold text-cyan-400">{sim.radiatedPowerWatts} W</div>
          <div className="text-xs text-slate-500">1 kW RF input</div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="text-xs text-slate-400 uppercase tracking-wider">
            Radiation Efficiency
          </div>
          <div className="text-lg font-bold text-emerald-400">{sim.radiationEfficiencyPct} %</div>
          <div className="text-xs text-slate-500">R_loss = {sim.ohmicLossOhms} Ω</div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="text-xs text-slate-400 uppercase tracking-wider">Received Power (Rx)</div>
          <div className="text-lg font-bold text-purple-400">{sim.receivedPowerMicrowatts} µW</div>
          <div className="text-xs text-slate-500">{distanceKm} km range</div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="text-xs text-slate-400 uppercase tracking-wider">Audio SNR</div>
          <div className="text-lg font-bold text-amber-400">{sim.audioSnrDb} dB</div>
          <div className="text-xs text-slate-500">Continuous carrier</div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="text-xs text-slate-400 uppercase tracking-wider">Earpiece Volume</div>
          <div className="text-lg font-bold text-amber-400">{sim.audioSoundLevelDbSpl} dB SPL</div>
          <div className="text-xs text-slate-500">I_sig = {sim.audioSignalCurrentMicroamps} µA</div>
        </div>
      </div>

      {/* Interactive Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-900/60 p-4 rounded-lg border border-slate-800">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-300">RF Carrier Frequency</span>
            <span className="text-cyan-400 font-mono">{carrierFreqKhz} kHz</span>
          </div>
          <input
            type="range"
            min={40}
            max={120}
            step={1}
            value={carrierFreqKhz}
            onChange={(e) => updateParam("carrierFrequencyKhz", Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-300">Audio Modulation Depth</span>
            <span className="text-cyan-400 font-mono">{audioModPct} %</span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={audioModPct}
            onChange={(e) => updateParam("audioModulationPct", Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-300">Loading Inductance (L)</span>
            <span className="text-cyan-400 font-mono">{antennaTuningUh} µH</span>
          </div>
          <input
            type="range"
            min={200}
            max={800}
            step={10}
            value={antennaTuningUh}
            onChange={(e) => updateParam("antennaTuningUh", Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-300">Distance to Receiver</span>
            <span className="text-cyan-400 font-mono">{distanceKm} km</span>
          </div>
          <input
            type="range"
            min={5}
            max={100}
            step={5}
            value={distanceKm}
            onChange={(e) => updateParam("transmissionDistanceKm", Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
