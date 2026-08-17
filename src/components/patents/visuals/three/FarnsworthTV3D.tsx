"use client";

import { Tv } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createThreeStudioScene } from "./ThreeStudioScene";

export function FarnsworthTV3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Television Electron Dissector Parameters
  const [scanLines, setScanLines] = useState<number>(220); // 60 to 525 lines
  const [anodeVoltageKv, setAnodeVoltageKv] = useState<number>(3.5); // 1.0 to 6.0 kV
  const [deflectionCurrentMa, setDeflectionCurrentMa] = useState<number>(180); // 50 to 300 mA
  const [showElectrons, setShowElectrons] = useState<boolean>(true);
  const [showCoils, setShowCoils] = useState<boolean>(true);

  // Electron Optics Calculations
  const electronSpeedKms = Math.round(
    Math.sqrt((2 * 1.602e-19 * anodeVoltageKv * 1000) / 9.109e-31) / 1000,
  );
  const horizontalScanRateKhz = ((scanLines * 30) / 1000).toFixed(2);
  const electronMultiplierGain = Math.round((anodeVoltageKv * 1.8) ** 3.2);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with Museum Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [16, 9, 14],
      targetPos: [0, 0, 0],
      bgBottomColor: 0x0f172a,
      rimColor: 0x38bdf8,
      ambientIntensity: 1.3,
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const glassEnvelopeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      ior: 1.5,
      side: THREE.DoubleSide,
    });

    const cathodeMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.3,
      emissive: 0x0284c7,
      emissiveIntensity: 0.3,
    });

    const copperCoilMaterial = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.9,
      roughness: 0.25,
    });

    const anodeApertureMaterial = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.95,
      roughness: 0.1,
    });

    // --- 3D FARNSWORTH DISSECTOR TUBE ASSEMBLY ---
    const tubeGroup = new THREE.Group();
    scene.add(tubeGroup);

    // 1. Long Cylindrical Glass Vacuum Envelope
    const glassTube = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 2.4, 16.0, 36, 1, true),
      glassEnvelopeMaterial,
    );
    glassTube.rotation.z = Math.PI / 2;
    tubeGroup.add(glassTube);

    // Front Optical Faceplate Window
    const frontWindow = new THREE.Mesh(new THREE.CircleGeometry(2.4, 36), glassEnvelopeMaterial);
    frontWindow.position.x = -8.0;
    frontWindow.rotation.y = Math.PI / 2;
    tubeGroup.add(frontWindow);

    // Rear Stem Exhaust Pip
    const rearWindow = new THREE.Mesh(new THREE.CircleGeometry(2.4, 36), glassEnvelopeMaterial);
    rearWindow.position.x = 8.0;
    rearWindow.rotation.y = -Math.PI / 2;
    tubeGroup.add(rearWindow);

    // 2. Continuous Photoelectric Cold Cathode Plate (Cesium Oxide on Silver)
    const cathodePlate = new THREE.Mesh(new THREE.CircleGeometry(2.1, 32), cathodeMaterial);
    cathodePlate.position.x = -7.8;
    cathodePlate.rotation.y = Math.PI / 2;
    tubeGroup.add(cathodePlate);

    // 3. Orthogonal Horizontal & Vertical Magnetic Deflection Coils
    const coilGroup = new THREE.Group();
    // Horizontal Deflection Coils (Top and Bottom)
    const coilH1 = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.4, 3.2), copperCoilMaterial);
    coilH1.position.set(0, 2.8, 0);
    const coilH2 = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.4, 3.2), copperCoilMaterial);
    coilH2.position.set(0, -2.8, 0);

    // Vertical Deflection Coils (Front and Back)
    const coilV1 = new THREE.Mesh(new THREE.BoxGeometry(4.0, 3.2, 0.4), copperCoilMaterial);
    coilV1.position.set(0, 0, 2.8);
    const coilV2 = new THREE.Mesh(new THREE.BoxGeometry(4.0, 3.2, 0.4), copperCoilMaterial);
    coilV2.position.set(0, 0, -2.8);

    coilGroup.add(coilH1);
    coilGroup.add(coilH2);
    coilGroup.add(coilV1);
    coilGroup.add(coilV2);
    tubeGroup.add(coilGroup);

    // 4. Target Anode Aperture & Electron Multiplier Box
    const anodeTarget = new THREE.Mesh(
      new THREE.CylinderGeometry(2.1, 2.1, 0.4, 32),
      anodeApertureMaterial,
    );
    anodeTarget.rotation.z = Math.PI / 2;
    anodeTarget.position.x = 7.6;
    tubeGroup.add(anodeTarget);

    // Target Scanning Aperture Pin-Hole
    const pinHole = new THREE.Mesh(
      new THREE.CircleGeometry(0.25, 16),
      new THREE.MeshBasicMaterial({ color: 0xef4444 }),
    );
    pinHole.rotation.y = -Math.PI / 2;
    pinHole.position.x = 7.39;
    tubeGroup.add(pinHole);

    // --- 3D ELECTRON BEAM PARTICLES ---
    const electronCount = 350;
    const electronGeo = new THREE.BufferGeometry();
    const electronPositions = new Float32Array(electronCount * 3);
    const electronColors = new Float32Array(electronCount * 3);

    for (let i = 0; i < electronCount; i++) {
      electronColors[i * 3] = 0.2;
      electronColors[i * 3 + 1] = 0.8;
      electronColors[i * 3 + 2] = 1.0;
    }
    electronGeo.setAttribute("position", new THREE.BufferAttribute(electronPositions, 3));
    electronGeo.setAttribute("color", new THREE.BufferAttribute(electronColors, 3));

    const electronPoints = new THREE.Points(
      electronGeo,
      new THREE.PointsMaterial({
        size: 0.16,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
      }),
    );
    tubeGroup.add(electronPoints);

    // --- ANIMATION & PHYSICS INTEGRATION LOOP ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      controls.update();

      coilGroup.visible = showCoils;
      electronPoints.visible = showElectrons;

      // 2D Sawtooth Raster Scanning
      const hFreq = 8.0;
      const vFreq = 0.6;
      const deflScale = (deflectionCurrentMa / 200) * 1.5;
      const rasterX = (((time * hFreq) % 1.0) - 0.5) * deflScale;
      const rasterY = (((time * vFreq) % 1.0) - 0.5) * deflScale;

      // Electron Stream Advection from Cathode (-7.8) to Anode (+7.6)
      const positions = electronGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < electronCount; i++) {
        const progress = ((i * 3.5 + time * 65.0) % 100) / 100;
        const x = -7.8 + progress * 15.4;
        const initialRadius = ((i % 17) / 17) * 1.8;
        const initialAngle = ((i * 29) % 360) * (Math.PI / 180);

        const deflFactor = Math.max(0, (x + 2.0) / 9.6);
        const y = Math.sin(initialAngle) * initialRadius + rasterY * deflFactor;
        const z = Math.cos(initialAngle) * initialRadius + rasterX * deflFactor;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
      }
      electronGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      studio.dispose();
    };
  }, [deflectionCurrentMa, showElectrons, showCoils]);

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Tv className="w-6 h-6 text-blue-500 animate-pulse" />
            <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50">
              3D Real-Time Farnsworth Image Dissector Tube Simulator (US 1,773,980)
            </h3>
          </div>
          <p className="text-sm sm:text-base text-ink-700 dark:text-ink-300 mt-1">
            Studio-illuminated Three.js electron optics simulating{" "}
            <strong>continuous photo-emission</strong>,{" "}
            <strong>orthogonal magnetic deflection</strong>, and{" "}
            <strong>electronic raster scanning</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-300 text-xs sm:text-sm font-mono font-bold border border-blue-300 dark:border-blue-800 shadow-2xs">
            {scanLines} Scan Lines ({horizontalScanRateKhz} kHz)
          </div>
        </div>
      </div>

      {/* 3D WebGL Canvas & HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-[#0f172a] border border-parchment-300 dark:border-ink-800 relative min-h-[460px] overflow-hidden shadow-inner">
          {/* Top HUD */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none text-xs sm:text-sm font-mono">
            <div className="px-3.5 py-1.5 bg-ink-900/90 border border-ink-800 text-blue-300 rounded-xl shadow-md">
              Electron Velocity:{" "}
              <span className="font-bold">{electronSpeedKms.toLocaleString()} km/s</span> ·
              Multiplier Gain:{" "}
              <span className="text-emerald-300 font-bold">
                {electronMultiplierGain.toLocaleString()}x
              </span>
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={() => setShowCoils(!showCoils)}
                className={`px-3 py-1 rounded-lg border text-xs font-mono transition-colors ${
                  showCoils
                    ? "bg-amber-600 text-white border-amber-500"
                    : "bg-ink-900 text-ink-400 border-ink-800"
                }`}
              >
                Coils: {showCoils ? "ON" : "OFF"}
              </button>
              <button
                type="button"
                onClick={() => setShowElectrons(!showElectrons)}
                className={`px-3 py-1 rounded-lg border text-xs font-mono transition-colors ${
                  showElectrons
                    ? "bg-blue-600 text-white border-blue-500"
                    : "bg-ink-900 text-ink-400 border-ink-800"
                }`}
              >
                Electrons: {showElectrons ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* 3D Canvas */}
          <div ref={containerRef} className="w-full h-[460px] cursor-grab active:cursor-grabbing" />

          {/* Bottom Telemetry */}
          <div className="w-full grid grid-cols-4 gap-3 text-center text-sm font-mono p-4 bg-ink-950/95 border-t border-ink-800 text-ink-300 z-10">
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                ANODE VOLTAGE
              </span>
              <span className="text-amber-400 font-bold text-sm sm:text-base">
                {anodeVoltageKv.toFixed(1)} kV
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                DEFLECTION CURRENT
              </span>
              <span className="text-blue-400 font-bold text-sm sm:text-base">
                {deflectionCurrentMa} mA
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                FRAME RATE
              </span>
              <span className="text-emerald-400 font-bold text-sm sm:text-base">
                30 FPS Progressive
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
              Electron Optics Controls
            </span>

            {/* Anode Voltage Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Anode Accelerating Potential ($V_a$)
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {anodeVoltageKv.toFixed(1)} kV
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="6.0"
                step="0.2"
                value={anodeVoltageKv}
                onChange={(e) => setAnodeVoltageKv(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Deflection Current Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  {"Magnetic Deflection Sweep ($I_{defl}$)"}
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {deflectionCurrentMa} mA
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="300"
                step="10"
                value={deflectionCurrentMa}
                onChange={(e) => setDeflectionCurrentMa(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Scan Resolution Selector */}
            <div className="space-y-1.5">
              <span className="text-xs sm:text-sm font-mono block text-ink-800 dark:text-ink-200 font-semibold mb-1">
                Scan Line Standard
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm font-mono">
                <button
                  type="button"
                  onClick={() => setScanLines(220)}
                  className={`p-2.5 rounded-xl border text-center transition-colors shadow-2xs ${
                    scanLines === 220
                      ? "bg-blue-700 text-white font-bold"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-800 dark:text-ink-200"
                  }`}
                >
                  220 Lines (1930 Historic)
                </button>
                <button
                  type="button"
                  onClick={() => setScanLines(525)}
                  className={`p-2.5 rounded-xl border text-center transition-colors shadow-2xs ${
                    scanLines === 525
                      ? "bg-blue-700 text-white font-bold"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-800 dark:text-ink-200"
                  }`}
                >
                  525 Lines (NTSC Broadcast)
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-ink-950 dark:text-parchment-100 text-xs sm:text-sm font-sans space-y-1.5">
              <span className="font-bold text-blue-900 dark:text-blue-300 block font-mono text-xs uppercase tracking-wider">
                Farnsworth&apos;s &ldquo;All-Electronic&rdquo; Vision:
              </span>
              <p className="leading-relaxed">
                While plowing potato fields in Rigby, Idaho at age 14, Philo Farnsworth saw the
                parallel back-and-forth furrows in the soil and realized an electron beam could scan
                an image line by line with zero spinning mechanical disks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
