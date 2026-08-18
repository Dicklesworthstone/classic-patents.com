"use client";

import { Camera, Cpu, Eye, EyeOff, Monitor, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { stepWozniakApple } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "cpu" | "ram_matrix" | "slots" | "top";

export function WozniakApple3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Microcomputer Architecture State Controls
  const { params } = usePatentPhysics("us-4136359-wozniak-apple");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const clockFrequencyMhz = (params.crystalFreq ?? 14.318) / 14;
  const [videoMode, _setVideoMode] = useState<"hires_color" | "lores_color" | "text_40col">(
    "hires_color",
  );
  const ramCapacityKb = params.ramCapacityKb ?? 48;
  const [isCpuActive, _setIsCpuActive] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const apple = stepWozniakApple({
    crystalFreq: params.crystalFreq ?? 14.318,
    ramCapacityKb,
  });
  const cycleTimeNs = Math.round(1000 / apple.cpuClockMhz);
  const phi1VideoAccessWindowNs = apple.dramWindowNs;
  const effectiveCpuThroughputPct = 100;
  const colorSubcarrierMhz = apple.colorSubcarrierMhz.toFixed(4);

  const live = useLiveSimParams({
    clockFrequencyMhz,
    videoMode,
    ramCapacityKb,
    isCpuActive,
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
        camera.position.set(12, 10, 15);
        controls.target.set(0, 0, 0);
        break;
      case "cpu":
        camera.position.set(-3.2, 1.6, 2.2);
        controls.target.set(-3.2, -0.4, 0.4);
        break;
      case "ram_matrix":
        camera.position.set(1.2, 1.8, -1.0);
        controls.target.set(1.0, -0.4, -1.2);
        break;
      case "slots":
        camera.position.set(0, 2.8, 4.0);
        controls.target.set(0, -0.3, 2.6);
        break;
      case "top":
        camera.position.set(0, 9.5, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const toggleSound = () => {
    toggleEngine(() => {
      soundEngine.playMicroswitchClick();
    });
  };

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
    const caseBeigeMat = new THREE.MeshStandardMaterial({
      color: 0xe2d9c8,
      roughness: 0.45,
      metalness: 0.05,
    });

    const pcbGreenMat = new THREE.MeshStandardMaterial({
      color: 0x14532d,
      roughness: 0.35,
      metalness: 0.2,
    });

    const icChipMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.25,
      metalness: 0.8,
    });

    const goldSlotMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.15,
      metalness: 0.95,
    });

    // --- 3D APPLE II MICROCOMPUTER ASSEMBLY ---
    const computerGroup = new THREE.Group();
    scene.add(computerGroup);

    // Molded Beige Structural Foam Chassis with Sloped Front Deck
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(11.4, 1.8, 10.4), caseBeigeMat);
    chassis.position.y = -1.5;
    chassis.receiveShadow = true;
    computerGroup.add(chassis);

    // Sloped Front Keyboard Deck
    const deck = new THREE.Mesh(new THREE.BoxGeometry(10.8, 0.4, 3.2), caseBeigeMat);
    deck.position.set(0, -0.6, 4.2);
    deck.rotation.x = 0.25;
    deck.receiveShadow = true;
    computerGroup.add(deck);

    // Green FR-4 Double-Sided Motherboard PCB
    const motherboard = new THREE.Mesh(new THREE.BoxGeometry(10.6, 0.12, 9.2), pcbGreenMat);
    motherboard.position.y = -0.55;
    motherboard.receiveShadow = true;
    computerGroup.add(motherboard);

    // Gold Ground Traces along PCB Perimeter
    const traceRing = new THREE.Mesh(new THREE.BoxGeometry(10.4, 0.14, 9.0), goldSlotMat);
    traceRing.position.y = -0.54;
    computerGroup.add(traceRing);

    // MOS Technology 6502 8-Bit CPU (40-Pin DIP)
    const cpuGroup = new THREE.Group();
    cpuGroup.position.set(-3.2, -0.42, 0.4);

    const cpuBody = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.22, 3.4), icChipMat);
    cpuBody.castShadow = true;
    cpuGroup.add(cpuBody);

    const notch = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.1, 16, 1, false, 0, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 }),
    );
    notch.position.set(0, 0.12, -1.6);
    cpuGroup.add(notch);

    // 40 Silver DIP Lead Pins
    for (let p = 0; p < 20; p++) {
      const pinZ = -1.5 + p * 0.16;
      [-0.7, 0.7].forEach((pinX) => {
        const pin = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 0.15, 0.06),
          new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95 }),
        );
        pin.position.set(pinX, -0.1, pinZ);
        cpuGroup.add(pin);
      });
    }
    computerGroup.add(cpuGroup);

    // 4116 16K Dynamic RAM Bank (3 Rows of 8 Chips = 48K RAM Matrix)
    const ramGroup = new THREE.Group();
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 8; col++) {
        const ramChip = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.18, 0.95), icChipMat);
        ramChip.position.set(-0.8 + col * 0.62, -0.44, -2.4 + row * 1.25);
        ramChip.castShadow = true;
        ramGroup.add(ramChip);
      }
    }
    computerGroup.add(ramGroup);

    // Apple Integer BASIC & Monitor ROM Bank (6 24-Pin DIP Chips)
    const romGroup = new THREE.Group();
    for (let r = 0; r < 6; r++) {
      const romChip = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.2, 1.8), icChipMat);
      romChip.position.set(3.6, -0.43, -2.4 + r * 0.9);
      romChip.castShadow = true;
      romGroup.add(romChip);
    }
    computerGroup.add(romGroup);

    // 8 Peripheral Expansion Slots (50-Pin Gold-Plated Edge Connectors)
    const slotsGroup = new THREE.Group();
    for (let s = 0; s < 8; s++) {
      const slotBody = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.45, 3.4), goldSlotMat);
      slotBody.position.set(-3.4 + s * 0.95, -0.32, 2.6);
      slotBody.castShadow = true;
      slotsGroup.add(slotBody);
    }
    computerGroup.add(slotsGroup);

    // 14.31818 MHz Master NTSC Color Clock Crystal Oscillator Can
    const crystal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.65, 16),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.1, metalness: 0.95 }),
    );
    crystal.position.set(-4.4, -0.28, -2.2);
    crystal.castShadow = true;
    computerGroup.add(crystal);

    // Rear Panel RCA Composite Video Out Jack
    const rcaJack = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, 0.5, 16),
      new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 }),
    );
    rcaJack.rotation.x = Math.PI / 2;
    rcaJack.position.set(4.2, -0.35, -4.6);
    computerGroup.add(rcaJack);

    // --- GLOWING INTERLEAVED BUS DATA PARTICLES (Phi 1 Video vs Phi 2 CPU) ---
    const busPacketCount = 140;
    const busGeo = new THREE.BufferGeometry();
    const busPos = new Float32Array(busPacketCount * 3);
    const busColors = new Float32Array(busPacketCount * 3);

    const glowTex = createGlowPointTexture();

    for (let i = 0; i < busPacketCount; i++) {
      const idx = i * 3;
      const isPhi1Video = i % 2 === 0;

      busPos[idx] = -2.8 + Math.random() * 5.5;
      busPos[idx + 1] = -0.85 + Math.random() * 0.2;
      busPos[idx + 2] = -2.0 + Math.random() * 4.0;

      if (isPhi1Video) {
        busColors[idx] = 0.1;
        busColors[idx + 1] = 0.9;
        busColors[idx + 2] = 1.0;
      } else {
        busColors[idx] = 1.0;
        busColors[idx + 1] = 0.7;
        busColors[idx + 2] = 0.2;
      }
    }

    busGeo.setAttribute("position", new THREE.BufferAttribute(busPos, 3));
    busGeo.setAttribute("color", new THREE.BufferAttribute(busColors, 3));

    const busPoints = new THREE.Points(
      busGeo,
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
    computerGroup.add(busPoints);

    // --- RENDER LOOP & REAL-TIME BUS INTERLEAVING ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;

      const bPos = busPos;
      const speed = p.clockFrequencyMhz * 4.0 * delta;

      if (p.isCpuActive) {
        for (let i = 0; i < busPacketCount; i++) {
          const idx = i * 3;
          bPos[idx] += speed * (i % 2 === 0 ? 1 : -1);

          if (bPos[idx] > 3.5) bPos[idx] = -3.0;
          if (bPos[idx] < -3.5) bPos[idx] = 3.0;
        }
        busGeo.attributes.position.needsUpdate = true;
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
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-col gap-1.5 sm:gap-2 pointer-events-none max-w-[calc(100%-8rem)] sm:max-w-md transition-opacity duration-200">
            <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md p-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
              <div className="text-[10px] sm:text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 animate-pulse" />
                Apple II Bus Telemetry
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 sm:gap-y-1 mt-1 text-[10px] sm:text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Throughput:</span>{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {effectiveCpuThroughputPct}% (0 DMA Halts)
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Memory Slot:</span>{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {phi1VideoAccessWindowNs} ns (Φ₁ / Φ₂)
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">NTSC Burst:</span>{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {colorSubcarrierMhz} MHz
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">RAM Bank:</span>{" "}
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {ramCapacityKb} KB (Auto-Refreshed)
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 items-center gap-2 max-w-full">
              <Monitor className="w-3.5 h-3.5 text-emerald-500 animate-pulse shrink-0" />
              <span className="truncate">Steve Wozniak (US 4,136,359) — Dynamic RAM (1977)</span>
            </div>
          </div>
        )}

        {/* Top Right Tool Bar (Toggle UI, Audio, Pins, Reset) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex gap-1.5 sm:gap-2">
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
                ["cpu", "6502 CPU"],
                ["ram_matrix", "4116 RAM Bank"],
                ["slots", "Bus Slots"],
                ["top", "Motherboard"],
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
