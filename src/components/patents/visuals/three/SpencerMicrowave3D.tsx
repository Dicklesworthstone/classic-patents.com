"use client";

import { Camera, Radio, RotateCcw, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { soundEngine } from "@/utils/soundEngine";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

type CameraPreset = "iso" | "cavity_resonator" | "electron_spokes" | "waveguide_launch" | "top";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  voltageKv: number;
  magGauss: number;
  powerW: number;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "spencer_1945_patent",
    name: "1945 Raytheon Radarange Patent (US 2,495,429)",
    desc: "Percy Spencer's discovery: 2.45 GHz cavity magnetron generating dense microwave radiation to heat food through dielectric loss.",
    voltageKv: 4.2,
    magGauss: 1450,
    powerW: 850,
  },
  {
    id: "popcorn_first_test",
    name: "First Popcorn Kernel Test",
    desc: "Historic Raytheon laboratory test where popcorn kernels burst instantaneously beside the open waveguide horn.",
    voltageKv: 3.8,
    magGauss: 1350,
    powerW: 650,
  },
  {
    id: "hull_cutoff_threshold",
    name: "Hull Cutoff Field Transition",
    desc: "Critical magnetic field $B_c$ trapping electrons into swirling cycloidal space-charge spokes rather than striking anode.",
    voltageKv: 4.2,
    magGauss: 1200,
    powerW: 500,
  },
  {
    id: "high_power_industrial",
    name: "1,200W Commercial Radarange",
    desc: "Full-power 1.2 kW continuous microwave emission with intense water molecule dipole rotation at 2.45 billion cycles/sec.",
    voltageKv: 5.5,
    magGauss: 1750,
    powerW: 1200,
  },
];

export function SpencerMicrowave3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Magnetron & Cavity Resonator State
  const [anodeVoltageKv, setAnodeVoltageKv] = useState<number>(4.2); // 2.0 to 6.0 kV
  const [magneticFieldGauss, setMagneticFieldGauss] = useState<number>(1450); // 800 to 2200 Gauss
  const [rfPowerWatts, setRfPowerWatts] = useState<number>(850); // 200 to 1200 Watts
  const [showSpokeWheel, _setShowSpokeWheel] = useState<boolean>(true);
  const [showWaterDipoles, _setShowWaterDipoles] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // RF Cavity Physics Calculations
  const hullCutoffGauss = Math.round(1180 * Math.sqrt(anodeVoltageKv / 4.2));
  const isOscillating = magneticFieldGauss > hullCutoffGauss;
  const waterDielectricLossDensity = isOscillating ? (rfPowerWatts * 1.8).toFixed(0) : "0";

  const live = useLiveSimParams({
    anodeVoltageKv,
    magneticFieldGauss,
    showSpokeWheel,
    showWaterDipoles,
    isOscillating,
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
        camera.position.set(12, 10, 15);
        controls.target.set(0, 0, 0);
        break;
      case "cavity_resonator":
        camera.position.set(0, 3.2, 5.5);
        controls.target.set(0, 0, 0);
        break;
      case "electron_spokes":
        camera.position.set(0, 7.5, 0.1);
        controls.target.set(0, 0, 0);
        break;
      case "waveguide_launch":
        camera.position.set(4.5, 2.5, 3.5);
        controls.target.set(3.0, 0, 0);
        break;
      case "top":
        camera.position.set(0, 13.0, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const applyScenario = (s: ScenarioPreset) => {
    setAnodeVoltageKv(s.voltageKv);
    setMagneticFieldGauss(s.magGauss);
    setRfPowerWatts(s.powerW);
    if (isPlayingAudio) {
      soundEngine.playContinuousTone(120, "sawtooth", 0.04);
    }
  };

  // Audio Magnetron Hum
  useEffect(() => {
    if (isPlayingAudio && isOscillating) {
      soundEngine.playContinuousTone(120, "sawtooth", 0.035);
    } else {
      soundEngine.stopContinuousTone();
    }
    return () => {
      soundEngine.stopContinuousTone();
    };
  }, [isPlayingAudio, isOscillating]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [12, 10, 15],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // --- PBR MATERIALS ---
    const copperAnodeMat = new THREE.MeshStandardMaterial({
      color: 0xca8a04,
      roughness: 0.22,
      metalness: 0.88,
    });

    const cathodeMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.4,
      metalness: 0.5,
      emissive: 0xef4444,
      emissiveIntensity: 0.8,
    });

    const alnicoMagnetMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.35,
      metalness: 0.8,
    });

    // --- 3D CAVITY MAGNETRON & MICROWAVE ASSEMBLY ---
    const magnetronGroup = new THREE.Group();
    scene.add(magnetronGroup);

    // Anode Block Shell
    const anodeOuter = new THREE.Mesh(
      new THREE.CylinderGeometry(4.3, 4.3, 3.4, 48),
      copperAnodeMat,
    );
    anodeOuter.castShadow = true;
    anodeOuter.receiveShadow = true;
    magnetronGroup.add(anodeOuter);

    // Center Interaction Bore
    const centerBore = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 3.42, 36),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 }),
    );
    magnetronGroup.add(centerBore);

    // 8 Radial Resonant Cavities
    const numCavities = 8;
    for (let i = 0; i < numCavities; i++) {
      const angle = (i * 2 * Math.PI) / numCavities;
      const hole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.62, 0.62, 3.42, 24),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 }),
      );
      hole.position.set(Math.cos(angle) * 2.8, 0, Math.sin(angle) * 2.8);
      magnetronGroup.add(hole);

      const slot = new THREE.Mesh(
        new THREE.BoxGeometry(1.3, 3.42, 0.18),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 }),
      );
      slot.position.set(Math.cos(angle) * 2.1, 0, Math.sin(angle) * 2.1);
      slot.rotation.y = -angle;
      magnetronGroup.add(slot);
    }

    // Pi-Mode Strapping Rings
    [-1.6, 1.6].forEach((yPos) => {
      const innerRing = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.05, 8, 36), copperAnodeMat);
      innerRing.rotation.x = Math.PI / 2;
      innerRing.position.y = yPos;
      magnetronGroup.add(innerRing);

      const outerRing = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.05, 8, 36), copperAnodeMat);
      outerRing.rotation.x = Math.PI / 2;
      outerRing.position.y = yPos;
      magnetronGroup.add(outerRing);
    });

    // Central Thermionic Cathode
    const cathode = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 4.2, 24), cathodeMat);
    cathode.castShadow = true;
    magnetronGroup.add(cathode);

    [-2.1, 2.1].forEach((yEnd) => {
      const endHat = new THREE.Mesh(
        new THREE.CylinderGeometry(0.65, 0.65, 0.12, 24),
        new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9 }),
      );
      endHat.position.y = yEnd;
      magnetronGroup.add(endHat);
    });

    // Alnico Permanent Magnet Shoes
    [-3.2, 3.2].forEach((yMag) => {
      const poleShoe = new THREE.Mesh(
        new THREE.CylinderGeometry(3.5, 4.2, 1.8, 36),
        alnicoMagnetMat,
      );
      poleShoe.position.y = yMag;
      magnetronGroup.add(poleShoe);
    });

    // --- ROTATING ELECTRON SPOKE WHEEL PARTICLES ---
    const spokeCount = 120;
    const spokeGeo = new THREE.BufferGeometry();
    const spokePos = new Float32Array(spokeCount * 3);
    const glowTex = createGlowPointTexture();

    for (let i = 0; i < spokeCount; i++) {
      const idx = i * 3;
      const spokeIndex = i % 4;
      const baseAngle = (spokeIndex * Math.PI) / 2;
      const r = 0.5 + Math.random() * 0.9;
      const angle = baseAngle + (Math.random() - 0.5) * 0.3;
      spokePos[idx] = Math.cos(angle) * r;
      spokePos[idx + 1] = (Math.random() - 0.5) * 1.5;
      spokePos[idx + 2] = Math.sin(angle) * r;
    }
    spokeGeo.setAttribute("position", new THREE.BufferAttribute(spokePos, 3));

    const spokePoints = new THREE.Points(
      spokeGeo,
      new THREE.PointsMaterial({
        size: 0.26,
        map: glowTex,
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    magnetronGroup.add(spokePoints);

    // --- RENDER LOOP & REAL-TIME SPOKE WHEEL ROTATION ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;

      if (p.isOscillating) {
        spokePoints.visible = p.showSpokeWheel;
        spokePoints.rotation.y += delta * 4.5;
      } else {
        spokePoints.visible = false;
      }

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
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none max-w-[calc(100%-8rem)] sm:max-w-md">
          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
            <div className="text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              Cavity Magnetron & Microwave Telemetry
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs font-sans">
              <div>
                <span className="text-ink-600 dark:text-ink-400">Microwave Freq:</span>{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  2,450 MHz (λ = 12.2 cm)
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">RF Output:</span>{" "}
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {rfPowerWatts} Watts CW
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Hull Cutoff ($B_c$):</span>{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {hullCutoffGauss} G ({magneticFieldGauss} G Active)
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Heating Power:</span>{" "}
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {waterDielectricLossDensity} W/dm³ Dielectric Loss
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 flex items-center gap-2 max-w-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
            <span className="truncate">
              Percy L. Spencer (US 2,495,429) — Method of Treating Foodstuffs (1945)
            </span>
          </div>
        </div>

        {/* Top Right Tool Bar (Audio, Pins, Reset) */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            type="button"
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className="p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-all shadow-sm"
            title={isPlayingAudio ? "Mute Magnetron Hum" : "Enable 120Hz Magnetron Hum"}
          >
            {isPlayingAudio ? (
              <Volume2 className="w-4 h-4 text-amber-600" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowCalloutPins(!showCalloutPins)}
            className={`p-2.5 rounded-xl backdrop-blur-md border transition-all shadow-sm ${
              showCalloutPins
                ? "bg-amber-600 text-white border-amber-700 shadow-md"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title="Toggle Historical Patent Numeral Pins"
          >
            <Zap className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-all shadow-sm"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Camera Views Bar */}
        <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-xs">
          <span className="px-2 py-1 text-ink-500 font-sans flex items-center gap-1">
            <Camera className="w-3.5 h-3.5" /> View:
          </span>
          {(
            [
              ["iso", "Isometric"],
              ["cavity_resonator", "Cavity"],
              ["electron_spokes", "Spokes"],
              ["waveguide_launch", "Waveguide"],
              ["top", "Interaction Space"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => applyCameraPreset(id)}
              className={`px-2.5 py-1 rounded-lg font-sans transition-all ${
                activeCamera === id
                  ? "bg-amber-700 dark:bg-amber-600 text-white font-semibold shadow-xs"
                  : "text-ink-700 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Controls & Scenario Bar */}
      <div className="p-4 sm:p-5 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 space-y-4">
        {/* Scenario Presets */}
        <div className="space-y-1.5">
          <div className="text-xs font-sans font-bold text-ink-700 dark:text-ink-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Historical Microwave Presets:
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
          {/* Anode Voltage */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="font-semibold text-ink-800 dark:text-parchment-200">
                Anode Potential ($V_a$):
              </span>
              <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">
                {anodeVoltageKv.toFixed(1)} kV
              </span>
            </div>
            <input
              type="range"
              min="2.0"
              max="6.0"
              step="0.2"
              value={anodeVoltageKv}
              onChange={(e) => setAnodeVoltageKv(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
              High voltage DC acceleration potential
            </span>
          </div>

          {/* Magnetic Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="font-semibold text-ink-800 dark:text-parchment-200">
                Axial Magnetic Field ($B$):
              </span>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                {magneticFieldGauss} Gauss
              </span>
            </div>
            <input
              type="range"
              min="800"
              max="2200"
              step="50"
              value={magneticFieldGauss}
              onChange={(e) => setMagneticFieldGauss(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
              Alnico magnet field strength
            </span>
          </div>

          {/* Microwave Power */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="font-semibold text-ink-800 dark:text-parchment-200">
                Continuous RF Output:
              </span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                {rfPowerWatts} Watts
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="1200"
              step="50"
              value={rfPowerWatts}
              onChange={(e) => setRfPowerWatts(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
              Continuous wave cooking radiation power
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
