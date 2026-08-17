"use client";

import { Camera, Eye, EyeOff, RotateCcw, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FrankenSimEngine } from "@/physics/engine";
import { soundEngine } from "@/utils/soundEngine";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "potential_well" | "sensing_node" | "gate_electrodes" | "top";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  phaseFreqHz: number;
  lux: number;
  voltageV: number;
  ctePct: number;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "bell_1969_first_device",
    name: "1969 Bell Labs 8-Bit Line Shift Register",
    desc: "Boyle and Smith's original 3-phase charge transfer channel on n-type silicon with gate oxide potential wells.",
    phaseFreqHz: 2,
    lux: 450,
    voltageV: 10.0,
    ctePct: 99.99,
  },
  {
    id: "hubble_wfpc2",
    name: "Hubble WFPC2 Scientific Imaging",
    desc: "Cryogenically cooled CCD array operating with ultra-high 99.999% CTE for photon-counting astronomical exposures.",
    phaseFreqHz: 1,
    lux: 80,
    voltageV: 14.0,
    ctePct: 99.999,
  },
  {
    id: "low_light_astronomy",
    name: "Low-Light Deep-Sky Readout",
    desc: "Ultra-clean slow-scan readout clocking isolated packets of under 500 photoelectrons across 1,024 transfer gates.",
    phaseFreqHz: 1,
    lux: 15,
    voltageV: 12.0,
    ctePct: 99.995,
  },
  {
    id: "saturation",
    name: "Full-Well Blooming Overexposure",
    desc: "Extreme 1200 Lux illumination exceeding 160,000 electron capacity and spilling over channel barriers.",
    phaseFreqHz: 3,
    lux: 1200,
    voltageV: 8.0,
    ctePct: 99.85,
  },
];

export function BoyleSmithCcd3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // CCD Physics & Clocking State Controls
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [clockPhase, setClockPhase] = useState<1 | 2 | 3>(1);
  const [incidentLux, setIncidentLux] = useState<number>(450); // 50 to 1200 Lux
  const [gateVoltageV, setGateVoltageV] = useState<number>(10); // 2 to 15 V
  const [transferEfficiencyPct, setTransferEfficiencyPct] = useState<number>(99.99); // 99.0 to 99.999%
  const [isAutoClocking, setIsAutoClocking] = useState<boolean>(true);
  const [clockSpeedFactor, setClockSpeedFactor] = useState<number>(2); // 1 to 10 Hz
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  // Charge-Coupled Physics Calculations (FrankenSim 3-Phase MOS Well Transfer)
  const _ccdState = FrankenSimEngine.stepBoyleSmithCcd(clockPhase, gateVoltageV, 65000);
  const fullWellElectrons = Math.round((gateVoltageV - 1.2) * 12500);
  const collectedChargeElectrons = Math.round(fullWellElectrons * Math.min(1.0, incidentLux / 800));
  const chargeTransferInefficiencyEpsilon = ((100 - transferEfficiencyPct) / 100).toExponential(2);

  const live = useLiveSimParams({
    clockPhase,
    isAutoClocking,
    gateVoltageV,
    clockSpeedFactor,
    incidentLux,
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
        camera.position.set(11, 9, 14);
        controls.target.set(0, 0, 0);
        break;
      case "potential_well":
        camera.position.set(0, 1.4, 4.5);
        controls.target.set(0, 0, 0);
        break;
      case "sensing_node":
        camera.position.set(4.8, 1.8, 2.5);
        controls.target.set(4.0, 0.2, 0);
        break;
      case "gate_electrodes":
        camera.position.set(-1.5, 4.5, 3.0);
        controls.target.set(0, 0.4, 0);
        break;
      case "top":
        camera.position.set(0, 8.5, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const applyScenario = (s: ScenarioPreset) => {
    setClockSpeedFactor(s.phaseFreqHz);
    setIncidentLux(s.lux);
    setGateVoltageV(s.voltageV);
    setTransferEfficiencyPct(s.ctePct);
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
      cameraPos: [11, 9, 14],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // --- PBR MATERIALS ---
    const pSiliconSubstrateMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.25,
      metalness: 0.85,
    });

    const gatePolySiliconMat = new THREE.MeshStandardMaterial({
      color: 0xca8a04,
      roughness: 0.2,
      metalness: 0.9,
    });

    const gateActiveMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      roughness: 0.15,
      metalness: 0.8,
      emissive: 0x2563eb,
      emissiveIntensity: 0.85,
    });

    const oxideMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transmission: 0.85,
      opacity: 0.9,
      transparent: true,
      roughness: 0.05,
      ior: 1.46,
    });

    // --- 3D CHARGE-COUPLED DEVICE (CCD) ASSEMBLY ---
    const ccdGroup = new THREE.Group();
    scene.add(ccdGroup);

    // P-Type Silicon Substrate Ingot
    const substrate = new THREE.Mesh(new THREE.BoxGeometry(9.6, 1.0, 5.4), pSiliconSubstrateMat);
    substrate.position.y = -0.5;
    substrate.castShadow = true;
    substrate.receiveShadow = true;
    ccdGroup.add(substrate);

    // Channel Stop Boron Isolation Barriers
    [-2.4, 2.4].forEach((sz) => {
      const channelStop = new THREE.Mesh(
        new THREE.BoxGeometry(9.4, 0.2, 0.4),
        new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.8 }),
      );
      channelStop.position.set(0, 0.05, sz);
      ccdGroup.add(channelStop);
    });

    // SiO2 Gate Dielectric Oxide Layer
    const oxide = new THREE.Mesh(new THREE.BoxGeometry(9.4, 0.25, 4.4), oxideMat);
    oxide.position.y = 0.12;
    ccdGroup.add(oxide);

    // 3-Phase Clock Bus Lines
    const busColors = [0x0284c7, 0xd97706, 0x9333ea];
    for (let b = 0; b < 3; b++) {
      const busLine = new THREE.Mesh(
        new THREE.BoxGeometry(9.0, 0.12, 0.22),
        new THREE.MeshStandardMaterial({ color: busColors[b], metalness: 0.9, roughness: 0.2 }),
      );
      busLine.position.set(0, 0.38, 2.0 - b * 0.35);
      ccdGroup.add(busLine);
    }

    // 9 Transparent Polysilicon Gate Electrodes
    const gates: { mesh: THREE.Mesh; phase: number; x: number }[] = [];
    const numGates = 9;

    for (let g = 0; g < numGates; g++) {
      const gX = -3.6 + g * 0.85;
      const phaseNum = (g % 3) + 1;

      const gateMesh = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.24, 3.2), gatePolySiliconMat);
      gateMesh.position.set(gX, 0.36, -0.4);
      gateMesh.castShadow = true;
      ccdGroup.add(gateMesh);

      // Contact Via connecting to corresponding clock bus line
      const busZ = 2.0 - (phaseNum - 1) * 0.35;
      const via = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.14, Math.abs(busZ - -0.4)),
        new THREE.MeshStandardMaterial({ color: busColors[phaseNum - 1], metalness: 0.85 }),
      );
      via.position.set(gX, 0.36, (-0.4 + busZ) / 2);
      ccdGroup.add(via);

      gates.push({ mesh: gateMesh, phase: phaseNum, x: gX });
    }

    // Output Floating Diffusion Sensing Node & Reset Gate
    const outputNode = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.3, 3.2),
      new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3, metalness: 0.8 }),
    );
    outputNode.position.set(4.3, 0.38, -0.4);
    ccdGroup.add(outputNode);

    // --- GLOWING ELECTRON CHARGE PACKETS ---
    const packetCount = 240;
    const packetGeo = new THREE.BufferGeometry();
    const packetPos = new Float32Array(packetCount * 3);
    const packetColors = new Float32Array(packetCount * 3);

    const glowTex = createGlowPointTexture();

    for (let i = 0; i < packetCount; i++) {
      const idx = i * 3;
      const pixelIdx = Math.floor(i / (packetCount / 3));
      const baseGateX = -3.6 + pixelIdx * 3 * 0.85;

      packetPos[idx] = baseGateX + (Math.random() - 0.5) * 0.5;
      packetPos[idx + 1] = -0.2 - Math.random() * 0.25;
      packetPos[idx + 2] = (Math.random() - 0.5) * 2.8;

      packetColors[idx] = 0.1;
      packetColors[idx + 1] = 0.9;
      packetColors[idx + 2] = 1.0;
    }

    packetGeo.setAttribute("position", new THREE.BufferAttribute(packetPos, 3));
    packetGeo.setAttribute("color", new THREE.BufferAttribute(packetColors, 3));

    const packetPoints = new THREE.Points(
      packetGeo,
      new THREE.PointsMaterial({
        size: 0.4,
        map: glowTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    ccdGroup.add(packetPoints);

    // --- RENDER LOOP & REAL-TIME CHARGE TRANSFER DYNAMICS ---
    let reqId: number;
    const clock = new THREE.Clock();
    let phaseTimer = 0;
    let currentActivePhase: 1 | 2 | 3 = 1;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;

      if (p.isAutoClocking) {
        phaseTimer += delta * p.clockSpeedFactor;
        if (phaseTimer > 0.8) {
          phaseTimer = 0;
          currentActivePhase = ((currentActivePhase % 3) + 1) as 1 | 2 | 3;
          if (!p.isAudioMuted && Math.random() < 0.3) {
            soundEngine.playSwitchClick();
          }
        }
      } else {
        currentActivePhase = p.clockPhase;
      }

      // Update Gate Colors & Potential Wells
      for (const g of gates) {
        if (g.phase === currentActivePhase) {
          g.mesh.material = gateActiveMat;
          g.mesh.position.y = 0.38;
        } else {
          g.mesh.material = gatePolySiliconMat;
          g.mesh.position.y = 0.42;
        }
      }

      // Animate Electron Charge Packets shifting to active potential well
      const pPos = packetPos;
      for (let i = 0; i < packetCount; i++) {
        const idx = i * 3;
        const pixelIdx = Math.floor(i / (packetCount / 3));
        const targetGateX = -3.6 + (pixelIdx * 3 + (currentActivePhase - 1)) * 0.85;

        pPos[idx] += (targetGateX + (Math.random() - 0.5) * 0.4 - pPos[idx]) * 0.15;
      }
      packetGeo.attributes.position.needsUpdate = true;

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
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none max-w-[calc(100%-8rem)] sm:max-w-md">
            <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
              <div className="text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                3-Phase CCD Potential Well Telemetry
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Full Well Depth:</span>{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {fullWellElectrons.toLocaleString()} e⁻ / pixel
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Collected Photoelectrons:</span>{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {collectedChargeElectrons.toLocaleString()} e⁻
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Transfer Efficiency (CTE):</span>{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {transferEfficiencyPct}%
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Transfer Inefficiency (ε):</span>{" "}
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {chargeTransferInefficiencyEpsilon}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 flex items-center gap-2 max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse shrink-0" />
              <span className="truncate">
                W. S. Boyle &amp; G. E. Smith (US 3,792,322) — Charge Coupled Semiconductor Devices
                (1969)
              </span>
            </div>
          </div>
        )}

        {/* Top Right Tool Bar (Toggle UI, Audio, Pins, Reset) */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
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
                ["potential_well", "Potential Well"],
                ["sensing_node", "Sensing Amp"],
                ["gate_electrodes", "3Φ Clock Bus"],
                ["top", "Pixel Array"],
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
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Charge-Coupled Physics Presets:
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
          {/* Incident Lux */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="font-semibold text-ink-800 dark:text-parchment-200">
                Photon Flux (Lux):
              </span>
              <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">
                {incidentLux} Lux
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="1200"
              step="50"
              value={incidentLux}
              onChange={(e) => setIncidentLux(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
              Photoelectric electron-hole pair generation
            </span>
          </div>

          {/* Gate Voltage */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="font-semibold text-ink-800 dark:text-parchment-200">
                Gate Bias Voltage (Vg):
              </span>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                {gateVoltageV.toFixed(1)} V
              </span>
            </div>
            <input
              type="range"
              min="2.0"
              max="15.0"
              step="0.5"
              value={gateVoltageV}
              onChange={(e) => setGateVoltageV(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
              Depletion region potential well depth
            </span>
          </div>

          {/* Clocking Drive Toggle */}
          <div className="flex flex-col justify-end space-y-1.5">
            <button
              type="button"
              onClick={() => setIsAutoClocking(!isAutoClocking)}
              className={`w-full py-3 px-4 rounded-xl font-sans font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 ${
                isAutoClocking
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                  : "bg-amber-600 hover:bg-amber-700 text-white shadow-md"
              }`}
            >
              <Zap className="w-4 h-4" />
              {isAutoClocking ? "3Φ Clock Active (Transferring)" : "Clock Paused (Inspect Charge)"}
            </button>
          </div>
        </div>

        {/* Phase Selectors & Well Level Indicator */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 border-t border-parchment-200 dark:border-ink-800 text-xs font-sans">
          <div className="flex items-center gap-2">
            <span className="text-ink-600 dark:text-ink-400">Manual Phase Override:</span>
            {([1, 2, 3] as const).map((pNum) => (
              <button
                key={pNum}
                type="button"
                onClick={() => {
                  setIsAutoClocking(false);
                  setClockPhase(pNum);
                }}
                className={`px-3 py-1 rounded-lg font-mono font-bold transition-all ${
                  clockPhase === pNum && !isAutoClocking
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white/70 dark:bg-ink-800 text-ink-700 dark:text-parchment-200 hover:bg-parchment-200"
                }`}
              >
                Φ{pNum}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-ink-600 dark:text-ink-400 text-xs">Pixel Charge Capacity:</span>
            <div className="w-28 sm:w-36 bg-parchment-300 dark:bg-ink-800 rounded-full h-2.5 overflow-hidden border border-parchment-400 dark:border-ink-700">
              <div
                className="bg-gradient-to-r from-blue-500 via-cyan-400 to-amber-500 h-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (collectedChargeElectrons / fullWellElectrons) * 100)}%`,
                }}
              />
            </div>
            <span className="font-bold text-xs text-ink-800 dark:text-parchment-200 font-mono">
              {Math.round((collectedChargeElectrons / fullWellElectrons) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
