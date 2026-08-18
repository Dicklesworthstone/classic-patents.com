"use client";

import { Camera, Eye, EyeOff, RotateCcw, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FrankenSimEngine } from "@/physics/engine";
import { stepCcdWells } from "@/physics/machineKernels";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "potential_well" | "sensing_node" | "gate_electrodes" | "top";

export function BoyleSmithCcd3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // CCD Physics & Clocking State Controls
  const { params } = usePatentPhysics("us-3858232-boyle-smith-ccd");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [clockPhase, _setClockPhase] = useState<1 | 2 | 3>(1);
  const incidentLux = params.incidentLux ?? 850;
  const gateVoltageV = params.gateVoltage ?? 8;
  const [isAutoClocking, _setIsAutoClocking] = useState<boolean>(true);
  const clockFreq = params.clockFreq ?? params.clockSpeedFactor ?? 2.5;
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const ccdWells = stepCcdWells(clockPhase, incidentLux, clockFreq, gateVoltageV);
  const ccdState = FrankenSimEngine.stepBoyleSmithCcd(
    clockPhase,
    gateVoltageV,
    incidentLux,
    clockFreq,
  );

  useFrankenSimPhysics("us-3858232-boyle-smith-ccd", {
    domain: "semiconductor_carrier",
    timestampMs: Date.now(),
    timeStepDt: 0.016,
    refusal: { isRefused: false },
    semi: ccdState,
  });
  const fullWellElectrons = ccdWells.fullWellElectrons;
  const collectedChargeElectrons = Math.round(ccdWells.wells[clockPhase - 1] ?? 0);
  const transferEfficiencyPct = (ccdWells.cte * 100).toFixed(4);
  const chargeTransferInefficiencyEpsilon = (1 - ccdWells.cte).toExponential(2);

  const live = useLiveSimParams({
    clockPhase,
    isAutoClocking,
    gateVoltageV,
    clockFreq,
    incidentLux,
    isAudioMuted,
    photoElectrons: ccdWells.photoElectrons,
    fullWellElectrons: ccdWells.fullWellElectrons,
    cte: ccdWells.cte,
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
        // Clock is MHz; use it as a visual rate, not a real-time 10⁶ tick.
        phaseTimer += delta * (p.clockFreq ?? 2.5);
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

      const wells = stepCcdWells(
        currentActivePhase,
        p.incidentLux ?? 850,
        p.clockFreq ?? 2.5,
        p.gateVoltageV ?? 8,
      );

      // Update Gate Colors & Potential Wells
      for (const g of gates) {
        const wellE = wells.wells[g.phase - 1] ?? 0;
        const fill = Math.min(1, wellE / Math.max(1, wells.fullWellElectrons));
        if (g.phase === currentActivePhase) {
          g.mesh.material = gateActiveMat;
          g.mesh.position.y = 0.38;
          g.mesh.scale.y = 1 + fill * 0.8;
        } else {
          g.mesh.material = gatePolySiliconMat;
          g.mesh.position.y = 0.42;
          g.mesh.scale.y = 1 + fill * 0.25;
        }
      }
      (packetPoints.material as THREE.PointsMaterial).opacity = 0.35 + wells.cte * 0.55;

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
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
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
            aria-label={isAudioMuted ? "Unmute simulation audio" : "Mute simulation audio"}
            type="button"
            onClick={toggleSound}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isAudioMuted ? "Enable Sound Synthesis" : "Mute Sound"}
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            )}
          </button>
          <button
            aria-label={showCalloutPins ? "Hide annotation pins" : "Show annotation pins"}
            type="button"
            onClick={() => setShowCalloutPins(!showCalloutPins)}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showCalloutPins
                ? "bg-amber-600 text-white border-amber-700 shadow-md"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title="Toggle Historical Patent Numeral Pins"
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
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
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-sans whitespace-nowrap shrink-0 transition-colors ${
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
    </div>
  );
}
