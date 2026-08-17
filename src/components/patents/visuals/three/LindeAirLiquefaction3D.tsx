"use client";

import { Activity, Camera, Sparkles, Volume2, VolumeX, Wind, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import {
  createGlowPointTexture,
  createThreeStudioScene,
  type StudioContext,
} from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "jt_valve" | "counter_heat_exchanger" | "liquid_dewar" | "top";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  inletBar: number;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "linde_1895_regenerative",
    name: "1895 Linde Regenerative Liquefaction",
    desc: "Carl von Linde's counter-current heat exchanger combining Joule-Thomson isenthalpic expansion to liquefy atmospheric air continuously at 80 K (US 727,650).",
    inletBar: 200,
  },
  {
    id: "industrial_tonnage_oxygen",
    name: "High-Capacity Tonnage Air Separation (240 bar)",
    desc: "Continuous fractional distillation feedstock condensing 45 liters of liquid air per hour.",
    inletBar: 240,
  },
  {
    id: "cooldown_phase",
    name: "Initial Regenerative Cooldown (150 bar)",
    desc: "Demonstrating cumulative counter-current temperature step-down before first liquid droplet condensation.",
    inletBar: 150,
  },
];

export function LindeAirLiquefaction3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Cryogenic Thermodynamics Parameters
  const { params, updateParam } = usePatentPhysics("us-727650-linde-air-liquefaction");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const inletPressureBar = params.inletBar ?? 200;
  const liquidTempKelvin = 80;
  const liquidTempCelsius = -193.15;
  const liquefactionRateLph = ((inletPressureBar / 200) * 32).toFixed(1);
  const [showMist, setShowMist] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    inletPressureBar,
    showMist,
    isAudioMuted,
  });

  const controlsRef = useRef<StudioContext["controls"] | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (preset) {
      case "iso":
        camera.position.set(10.0, 7.5, 11.5);
        controls.target.set(0, 0, 0);
        break;
      case "jt_valve":
        camera.position.set(0, 0.5, 3.2);
        controls.target.set(0, -0.4, 0);
        break;
      case "counter_heat_exchanger":
        camera.position.set(2.8, 2.0, 3.5);
        controls.target.set(0, 1.2, 0);
        break;
      case "liquid_dewar":
        camera.position.set(0, -1.8, 3.8);
        controls.target.set(0, -1.8, 0);
        break;
      case "top":
        camera.position.set(0, 12.5, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const applyScenario = (s: ScenarioPreset) => {
    updateParam("inletBar", s.inletBar);
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
      cameraPos: [10.0, 7.5, 11.5],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Materials
    const insulatedOuterShellMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.45,
      metalness: 0.85,
    });

    const copperCoilMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.22,
      metalness: 0.9,
    });

    const brassJtValveMat = new THREE.MeshStandardMaterial({
      color: 0xc8963e,
      roughness: 0.2,
      metalness: 0.92,
    });

    const liquidAirPaleBlueMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85,
    });

    const mistGlowTex = createGlowPointTexture();

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Vacuum-Insulated Outer Cryogenic Vessel (Claim 1)
    const cryoColumn = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 1.6, 5.8, 32, 1, false, 0, Math.PI * 1.4),
      insulatedOuterShellMat,
    );
    cryoColumn.position.y = 0.2;
    cryoColumn.castShadow = true;
    rootGroup.add(cryoColumn);

    // 2. Counter-Current Triple Concentric Copper Heat Exchanger Coils (Claim 2)
    const coilGroup = new THREE.Group();
    rootGroup.add(coilGroup);

    for (let c = 0; c < 14; c++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.08, 12, 32), copperCoilMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 2.4 - c * 0.28;
      coilGroup.add(ring);
    }

    // 3. Joule-Thomson Needle Throttling Expansion Valve (Claim 1)
    const jtValveGroup = new THREE.Group();
    jtValveGroup.position.set(0, -1.2, 0);
    rootGroup.add(jtValveGroup);

    const jtBody = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.8, 16), brassJtValveMat);
    jtValveGroup.add(jtBody);

    const jtNeedleWheel = new THREE.Mesh(
      new THREE.TorusGeometry(0.35, 0.05, 8, 24),
      brassJtValveMat,
    );
    jtNeedleWheel.rotation.x = Math.PI / 2;
    jtNeedleWheel.position.y = 0.5;
    jtValveGroup.add(jtNeedleWheel);

    // 4. Liquid Air Cryogenic Collection Basin
    const liquidBasin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.95, 0.95, 0.8, 24),
      liquidAirPaleBlueMat,
    );
    liquidBasin.position.set(0, -2.0, 0);
    rootGroup.add(liquidBasin);

    // 5. Cryogenic Mist & Condensed Droplets Particles
    const mistCount = 100;
    const mistGeo = new THREE.BufferGeometry();
    const mistPositions = new Float32Array(mistCount * 3);

    for (let i = 0; i < mistCount; i++) {
      const idx = i * 3;
      const r = Math.random() * 0.7;
      const a = Math.random() * Math.PI * 2;
      mistPositions[idx] = Math.cos(a) * r;
      mistPositions[idx + 1] = -1.2 - Math.random() * 0.9;
      mistPositions[idx + 2] = Math.sin(a) * r;
    }

    mistGeo.setAttribute("position", new THREE.BufferAttribute(mistPositions, 3));
    const mistMat = new THREE.PointsMaterial({
      size: 0.25,
      map: mistGlowTex,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      color: 0x7dd3fc,
    });
    const mistPoints = new THREE.Points(mistGeo, mistMat);
    rootGroup.add(mistPoints);

    // Animation Loop
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;

      // Animate downward falling condensed droplets
      const pos = mistPositions;
      for (let i = 0; i < mistCount; i++) {
        const idx = i * 3;
        pos[idx + 1] -= 0.8 * delta;
        if (pos[idx + 1] < -2.1) {
          pos[idx + 1] = -1.2;
        }
      }
      mistGeo.attributes.position.needsUpdate = true;
      mistPoints.visible = p.showMist;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      studio.cleanup();
    };
  }, [live.current]);

  return (
    <div className="relative w-full h-[620px] bg-parchment-900 rounded-2xl overflow-hidden border border-parchment-700 shadow-2xl flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-parchment-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            Linde Air Liquefaction 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 727,650 (1903)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["jt_valve", "J-T Valve"],
              ["counter_heat_exchanger", "Heat Exchanger"],
              ["liquid_dewar", "Liquid Basin"],
              ["top", "Top"],
            ] as [CameraPreset, string][]
          ).map(([preset, label]) => (
            <button
              key={preset}
              type="button"
              onClick={() => applyCameraPreset(preset)}
              className={`px-2.5 py-1 text-xs font-sans rounded-lg transition-colors ${
                activeCamera === preset
                  ? "bg-amber-600 text-white font-semibold shadow-sm"
                  : "text-parchment-300 hover:text-white hover:bg-parchment-800/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={() => setShowMist(!showMist)}
            title="Toggle Cryogenic Mist"
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showMist
                ? "bg-amber-600/30 text-amber-300 border border-amber-500/40"
                : "text-parchment-400 hover:text-white"
            }`}
          >
            <Wind className="w-4 h-4 text-sky-400" />
          </button>
          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            <Zap className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Bottom Telemetry Bar & Controls */}
      {showUiOverlay && (
        <div className="absolute bottom-4 left-4 right-4 bg-parchment-950/90 backdrop-blur-md rounded-2xl border border-parchment-700/70 p-4 shadow-2xl z-10 flex flex-col gap-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pb-2 border-b border-parchment-800/80 text-xs font-mono">
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Inlet Compression</span>
              <span className="font-bold text-amber-400">{inletPressureBar} bar</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Cryogenic Temp</span>
              <span className="font-bold text-blue-400">
                {liquidTempCelsius}°C ({liquidTempKelvin} K)
              </span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Condensation Rate</span>
              <span className="font-bold text-emerald-400">{liquefactionRateLph} L/hr</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Thermodynamic Law</span>
              <span className="font-bold text-amber-300">Joule-Thomson Isenthalpic</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-mono text-parchment-400 flex items-center gap-1 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Presets:
              </span>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {SCENARIOS.map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => applyScenario(sc)}
                    className="px-2.5 py-1 text-xs font-sans rounded-lg bg-parchment-800/80 hover:bg-parchment-700 text-parchment-200 hover:text-white border border-parchment-600/50 transition-colors whitespace-nowrap"
                  >
                    {sc.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-72 shrink-0">
              <span className="text-xs font-sans text-parchment-300 shrink-0 font-medium">
                Inlet Bar:
              </span>
              <input
                type="range"
                min="100"
                max="300"
                step="10"
                value={inletPressureBar}
                onChange={(e) => updateParam("inletBar", Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-mono text-amber-400 w-16 text-right font-bold">
                {inletPressureBar} bar
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
