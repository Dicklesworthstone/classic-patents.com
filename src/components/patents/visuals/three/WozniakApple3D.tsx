"use client";

import { Cpu, Monitor } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

export function WozniakApple3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Microcomputer Architecture State Controls
  const [clockFrequencyMhz, setClockFrequencyMhz] = useState<number>(1.02); // 0.5 to 2.0 MHz
  const [videoMode, setVideoMode] = useState<"hires_color" | "lores_color" | "text_40col">(
    "hires_color",
  );
  const [ramCapacityKb, setRamCapacityKb] = useState<number>(48); // 4, 16, 48 KB
  const [_isCpuActive, _setIsCpuActive] = useState<boolean>(true);

  // System Architecture Calculations
  const cycleTimeNs = Math.round(1000 / clockFrequencyMhz);
  const phi1VideoAccessWindowNs = Math.round(cycleTimeNs / 2);
  const _phi2CpuAccessWindowNs = Math.round(cycleTimeNs / 2);
  const effectiveCpuThroughputPct = 100; // Zero wait states
  const colorSubcarrierMhz = (3.579545).toFixed(4);

  const live = useLiveSimParams({
    clockFrequencyMhz,
    videoMode,
    ramCapacityKb,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with High-Luminosity Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [12, 10, 15],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const caseBeigeMat = new THREE.MeshStandardMaterial({
      color: 0xe2d9c8, // Classic Apple II beige molded structural foam plastic
      roughness: 0.45,
      metalness: 0.05,
    });

    const pcbGreenMat = new THREE.MeshStandardMaterial({
      color: 0x14532d, // Green FR-4 epoxy fiberglass printed circuit board
      roughness: 0.35,
      metalness: 0.2,
    });

    const icChipMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Black ceramic / plastic dual in-line package (DIP) ICs
      roughness: 0.25,
      metalness: 0.8,
    });

    const goldSlotMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // 50-pin gold-plated peripheral expansion bus slots
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

    // MOS Technology 6502 8-Bit CPU (40-Pin Ceramic/Plastic DIP with Silver Lead Frames)
    const cpuGroup = new THREE.Group();
    cpuGroup.position.set(-3.2, -0.42, 0.4);

    const cpuBody = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.22, 3.4), icChipMat);
    cpuBody.castShadow = true;
    cpuGroup.add(cpuBody);

    // CPU Pin 1 Orientation Notch
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

    // 8 Peripheral Expansion Slots (50-Pin Gold-Plated Edge Connectors - Slots 0 to 7)
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

    // Rear Panel I/O Connectors: RCA Composite Video Out & Cassette In/Out Jacks
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

      // Phi 1 = Cyan Video Raster Stream; Phi 2 = Amber CPU Instruction Stream
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
      const _elapsed = clock.getElapsedTime();
      const p = live.current;

      // Animate shared memory bus data packets flowing along PCB traces
      const bPos = busPos;
      const speed = p.clockFrequencyMhz * 4.0 * delta;

      for (let i = 0; i < busPacketCount; i++) {
        const idx = i * 3;
        bPos[idx] += speed * (i % 2 === 0 ? 1 : -1);

        if (bPos[idx] > 3.5) bPos[idx] = -3.0;
        if (bPos[idx] < -3.5) bPos[idx] = 3.0;
      }
      busGeo.attributes.position.needsUpdate = true;

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
              <Cpu className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              Apple II Shared-Bus Architecture Telemetry
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs font-sans">
              <div>
                <span className="text-ink-600 dark:text-ink-400">CPU Throughput:</span>{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {effectiveCpuThroughputPct}% (Zero DMA Halts)
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Memory Cycle Window:</span>{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {phi1VideoAccessWindowNs} ns ($\Phi_1$ Video / $\Phi_2$ CPU)
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">NTSC Color Burst:</span>{" "}
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {colorSubcarrierMhz} MHz (14.318 MHz ÷ 4)
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Installed RAM Bank:</span>{" "}
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {ramCapacityKb} KB (Auto-Refreshed by Video Scan)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 flex items-center gap-2 max-w-full">
            <Monitor className="w-3.5 h-3.5 text-emerald-500 animate-pulse shrink-0" />
            <span className="truncate">Steve Wozniak (US 4,136,359) — Shared Dynamic RAM</span>
          </div>
        </div>

        {/* Video Mode Selector */}
        <div className="absolute top-4 right-4 z-10 flex gap-1.5">
          {(["hires_color", "lores_color", "text_40col"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setVideoMode(mode)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-sans font-semibold capitalize border transition-all ${
                videoMode === mode
                  ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                  : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
              }`}
            >
              {mode.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Parameter Sliders Panel */}
      <div className="p-4 sm:p-5 bg-parchment-100/80 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
        {/* Clock Frequency */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>MOS 6502 CPU Clock:</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">
              {clockFrequencyMhz.toFixed(2)} MHz
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.05"
            value={clockFrequencyMhz}
            onChange={(e) => setClockFrequencyMhz(Number(e.target.value))}
            className="w-full accent-amber-600 dark:accent-amber-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Two-phase clock ($\Phi_1$ Video, $\Phi_2$ CPU)
          </span>
        </div>

        {/* Dynamic RAM Capacity */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Dynamic RAM Capacity:</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {ramCapacityKb} KB RAM
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 pt-0.5">
            {[4, 16, 48].map((kb) => (
              <button
                key={kb}
                type="button"
                onClick={() => setRamCapacityKb(kb)}
                className={`py-1 rounded text-xs font-semibold border ${
                  ramCapacityKb === kb
                    ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                    : "bg-white/80 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
                }`}
              >
                {kb}K
              </button>
            ))}
          </div>
        </div>

        {/* Graphics Hardware Cost Savings */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Silicon Cost Reduction:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              -75% IC Chip Count
            </span>
          </div>
          <div className="w-full bg-parchment-300 dark:bg-ink-800 rounded-full h-3 overflow-hidden mt-2 border border-parchment-400 dark:border-ink-700">
            <div
              className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full transition-all duration-300"
              style={{ width: "92%" }}
            />
          </div>
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Wozniak's single-board architecture eliminated ~40 TTL chips
          </span>
        </div>

        {/* Commercial Heritage */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Modern Lineage:</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              Unified Memory Architecture
            </span>
          </div>
          <span className="text-[11px] text-ink-700 dark:text-parchment-200 block pt-1 leading-relaxed">
            Direct ancestor of unified CPU/GPU memory in modern Apple Silicon M-series chips.
          </span>
        </div>
      </div>
    </div>
  );
}
