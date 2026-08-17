"use client";

import { Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createThreeStudioScene } from "./ThreeStudioScene";

export function BoyleSmithCcd3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // CCD Imaging Parameters
  const [clockFreqKhz, setClockFreqKhz] = useState<number>(100); // 10 to 500 kHz
  const [lightExposureLux, setLightExposureLux] = useState<number>(850); // 100 to 2000 Lux
  const [_transferEfficiency, _setTransferEfficiency] = useState<number>(0.9999);
  const [showElectrons, setShowElectrons] = useState<boolean>(true);

  // Physics Calculations
  const photoElectronsPerPixel = Math.round((lightExposureLux / 1000) * 45000);
  const darkCurrentElectrons = 120;
  const snrDb = (
    20 *
    Math.log10(photoElectronsPerPixel / Math.sqrt(photoElectronsPerPixel + darkCurrentElectrons))
  ).toFixed(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with Museum Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [14, 11, 16],
      targetPos: [0, 0, 0],
      bgBottomColor: 0x0f172a,
      rimColor: 0x38bdf8,
      ambientIntensity: 1.3,
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const siliconSubstrateMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.6,
      roughness: 0.4,
    });

    const sio2DielectricMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transmission: 0.88,
      opacity: 0.85,
      transparent: true,
      roughness: 0.08,
      ior: 1.45,
    });

    const polyGatePhase1Mat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.9,
      roughness: 0.2,
    });
    const polyGatePhase2Mat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.9,
      roughness: 0.2,
    });
    const polyGatePhase3Mat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      metalness: 0.9,
      roughness: 0.2,
    });

    // --- 3D CCD SHIFT REGISTER WAFER ASSEMBLY ---
    const ccdGroup = new THREE.Group();
    scene.add(ccdGroup);

    // Silicon Substrate Slab
    const substrate = new THREE.Mesh(new THREE.BoxGeometry(16, 2.0, 8), siliconSubstrateMat);
    substrate.position.y = -2.0;
    ccdGroup.add(substrate);

    // SiO2 Insulating Glass Dielectric Layer
    const oxideLayer = new THREE.Mesh(new THREE.BoxGeometry(16, 0.4, 8), sio2DielectricMat);
    oxideLayer.position.y = -0.8;
    ccdGroup.add(oxideLayer);

    // 3-Phase Polysilicon MOS Gate Array (P1, P2, P3 repeating)
    const numGates = 9;
    const gateMeshes: THREE.Mesh[] = [];

    for (let i = 0; i < numGates; i++) {
      const gX = -7.0 + i * 1.75;
      const phase = (i % 3) + 1;
      const mat =
        phase === 1 ? polyGatePhase1Mat : phase === 2 ? polyGatePhase2Mat : polyGatePhase3Mat;
      const gate = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.6, 6.5), mat);
      gate.position.set(gX, -0.3, 0);
      gateMeshes.push(gate);
      ccdGroup.add(gate);
    }

    // --- 3D PHOTOELECTRON CHARGE PACKETS ---
    const packetElectrons = 180;
    const electronGeo = new THREE.BufferGeometry();
    const electronPositions = new Float32Array(packetElectrons * 3);
    const electronColors = new Float32Array(packetElectrons * 3);

    for (let i = 0; i < packetElectrons; i++) {
      electronColors[i * 3] = 0.2;
      electronColors[i * 3 + 1] = 0.8;
      electronColors[i * 3 + 2] = 1.0;
    }
    electronGeo.setAttribute("position", new THREE.BufferAttribute(electronPositions, 3));
    electronGeo.setAttribute("color", new THREE.BufferAttribute(electronColors, 3));

    const electronPoints = new THREE.Points(
      electronGeo,
      new THREE.PointsMaterial({ size: 0.2, vertexColors: true, transparent: true, opacity: 0.9 }),
    );
    ccdGroup.add(electronPoints);

    // --- ANIMATION & PHYSICS INTEGRATION LOOP ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      controls.update();

      // 3-Phase Clock Stepping Wave: Phase shifts potential wells to the right
      const _clockCycle = (time * (clockFreqKhz / 30)) % 3.0;

      // Move Charge Packets along Silicon Surface Well Channel
      electronPoints.visible = showElectrons;
      if (showElectrons) {
        const positions = electronGeo.attributes.position.array as Float32Array;
        const driftProgress = (time * (clockFreqKhz / 30) * 0.5) % 1.0;

        for (let i = 0; i < packetElectrons; i++) {
          const packetIdx = Math.floor(i / 60);
          const intraPacketIdx = i % 60;
          const baseGateX = -6.0 + packetIdx * 5.25 + driftProgress * 5.25;

          const spreadX = ((intraPacketIdx % 8) - 3.5) * 0.15;
          const spreadZ = (Math.floor(intraPacketIdx / 8) - 3.5) * 0.3;
          const x = baseGateX + spreadX;

          positions[i * 3] = x > 7.5 ? x - 15.0 : x;
          positions[i * 3 + 1] = -1.4 - Math.sin(time * 10 + i) * 0.08;
          positions[i * 3 + 2] = spreadZ;
        }
        electronGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      studio.dispose();
    };
  }, [clockFreqKhz, showElectrons]);

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Camera className="w-6 h-6 text-blue-500 animate-pulse" />
            <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50">
              3D Real-Time Boyle-Smith Charge-Coupled Device (CCD) Simulator (US 3,923,554)
            </h3>
          </div>
          <p className="text-sm sm:text-base text-ink-700 dark:text-ink-300 mt-1">
            Studio-illuminated Three.js semiconductor physics simulating{" "}
            <strong>photoelectric potential energy wells</strong> and{" "}
            <strong>3-phase bucket-brigade charge transfer</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-300 text-xs sm:text-sm font-mono font-bold border border-blue-300 dark:border-blue-800 shadow-2xs">
            CTE: 99.99% Transfer Efficiency
          </div>
        </div>
      </div>

      {/* 3D WebGL Canvas & HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-[#0f172a] border border-parchment-300 dark:border-ink-800 relative min-h-[460px] overflow-hidden shadow-inner">
          {/* Top HUD */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none text-xs sm:text-sm font-mono">
            <div className="px-3.5 py-1.5 bg-ink-900/90 border border-ink-800 text-blue-300 rounded-xl shadow-md">
              Full-Well Charge Packet:{" "}
              <span className="font-bold">{photoElectronsPerPixel.toLocaleString()} e⁻</span> (SNR:{" "}
              <span className="text-emerald-300 font-bold">{snrDb} dB</span>)
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={() => setShowElectrons(!showElectrons)}
                className={`px-3 py-1 rounded-lg border text-xs font-mono transition-colors ${
                  showElectrons
                    ? "bg-blue-600 text-white border-blue-500"
                    : "bg-ink-900 text-ink-400 border-ink-800"
                }`}
              >
                Charge Packets: {showElectrons ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* 3D Canvas */}
          <div ref={containerRef} className="w-full h-[460px] cursor-grab active:cursor-grabbing" />

          {/* Bottom Telemetry */}
          <div className="w-full grid grid-cols-4 gap-3 text-center text-sm font-mono p-4 bg-ink-950/95 border-t border-ink-800 text-ink-300 z-10">
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                TRANSFER CLOCK
              </span>
              <span className="text-emerald-400 font-bold text-sm sm:text-base">
                {clockFreqKhz} kHz
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                ILLUMINATION
              </span>
              <span className="text-amber-400 font-bold text-sm sm:text-base">
                {lightExposureLux} Lux
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                CLOCK PHASES
              </span>
              <span className="text-blue-400 font-bold text-sm sm:text-base">
                Φ1, Φ2, Φ3 (3-Phase)
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                3D INTERACTION
              </span>
              <span className="text-purple-400 font-semibold text-xs sm:text-sm">
                Drag Orbit / Zoom
              </span>
            </div>
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/80 dark:bg-ink-900/70 p-6 space-y-5 shadow-sm">
            <span className="font-serif font-bold text-base sm:text-lg text-ink-950 dark:text-parchment-50 block">
              CCD Image Sensor Controls
            </span>

            {/* Clock Frequency Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  {"Readout Clock Rate ($f_{clk}$)"}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {clockFreqKhz} kHz
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="500"
                step="20"
                value={clockFreqKhz}
                onChange={(e) => setClockFreqKhz(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Incident Light Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  {"Optical Light Exposure ($I_{lux}$)"}
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {lightExposureLux} Lux
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="2000"
                step="50"
                value={lightExposureLux}
                onChange={(e) => setLightExposureLux(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-ink-950 dark:text-parchment-100 text-xs sm:text-sm font-sans space-y-1.5">
              <span className="font-bold text-blue-900 dark:text-blue-300 block font-mono text-xs uppercase tracking-wider">
                The &ldquo;Bucket Brigade&rdquo; Invention:
              </span>
              <p className="leading-relaxed">
                Willard Boyle and George Smith created the first digital image sensor at Bell Labs
                in one afternoon. Photons generate electron packets in MOS capacitor wells, which
                are sequentially shifted down the register like buckets of water along a human chain
                without losing a single drop.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
