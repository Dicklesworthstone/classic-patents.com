"use client";

import { Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createThreeStudioScene } from "./ThreeStudioScene";

export function TeslaCoil3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Electrical Parameters
  const [sparkRateHz, setSparkRateHz] = useState<number>(120);
  const [primaryCapacitanceNf, setPrimaryCapacitanceNf] = useState<number>(20);
  const [secondaryTurns, setSecondaryTurns] = useState<number>(850);
  const [showLightning, setShowLightning] = useState<boolean>(true);

  // Resonant Calculations
  const resonantFreqKhz = 1 / (2 * Math.PI * Math.sqrt(15e-6 * primaryCapacitanceNf * 1e-9)) / 1000;
  const secondaryVoltageKv = Math.round(
    15 * Math.sqrt(secondaryTurns / 10) * (primaryCapacitanceNf / 20),
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with Museum Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [14, 10, 16],
      targetPos: [0, 0, 0],
      bgBottomColor: 0x0f172a,
      rimColor: 0xc084fc,
      ambientIntensity: 1.3,
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const primaryCopperMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.15,
    });

    const secondaryWireMat = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      metalness: 0.8,
      roughness: 0.3,
    });

    const toploadToroidMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.98,
      roughness: 0.05,
    });

    const mahoganyBaseMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.6,
      metalness: 0.1,
    });

    // --- 3D TESLA RESONANT TRANSFORMER ASSEMBLY ---
    const coilGroup = new THREE.Group();
    scene.add(coilGroup);

    // Polished Mahogany Heavy Insulator Base Table
    const baseTable = new THREE.Mesh(new THREE.BoxGeometry(12, 0.8, 12), mahoganyBaseMat);
    baseTable.position.y = -4.0;
    baseTable.receiveShadow = true;
    coilGroup.add(baseTable);

    // Outer Heavy Copper Flat Spiral / Inverted Conical Primary Coil
    const numPrimaryTurns = 6;
    for (let i = 0; i < numPrimaryTurns; i++) {
      const r = 3.2 + i * 0.45;
      const turn = new THREE.Mesh(new THREE.TorusGeometry(r, 0.12, 16, 48), primaryCopperMat);
      turn.rotation.x = Math.PI / 2;
      turn.position.y = -3.2 + i * 0.15;
      turn.castShadow = true;
      coilGroup.add(turn);
    }

    // Central Conical / Helical Secondary Resonator Spool
    const secondarySpool = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.8, 6.5, 32),
      secondaryWireMat,
    );
    secondarySpool.position.y = 0.2;
    secondarySpool.castShadow = true;
    coilGroup.add(secondarySpool);

    // Topload Aluminum Spun Toroid Terminal
    const topload = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.9, 24, 48), toploadToroidMat);
    topload.rotation.x = Math.PI / 2;
    topload.position.y = 3.8;
    topload.castShadow = true;
    coilGroup.add(topload);

    // Top Breakout Pin
    const breakoutPin = new THREE.Mesh(new THREE.ConeGeometry(0.12, 1.2, 16), toploadToroidMat);
    breakoutPin.position.set(0, 5.0, 0);
    coilGroup.add(breakoutPin);

    // --- 3D DYNAMIC PLASMA LIGHTNING ARCS ---
    const lightningGroup = new THREE.Group();
    scene.add(lightningGroup);

    const arcCount = 8;
    const arcLines: THREE.Line[] = [];
    const plasmaMat = new THREE.LineBasicMaterial({ color: 0xc084fc, linewidth: 2.5 });

    for (let a = 0; a < arcCount; a++) {
      const segments = 12;
      const pts = [];
      for (let s = 0; s <= segments; s++) {
        pts.push(new THREE.Vector3(0, 5.0, 0));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geo, plasmaMat);
      arcLines.push(line);
      lightningGroup.add(line);
    }

    // --- ANIMATION & PHYSICS INTEGRATION LOOP ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      controls.update();

      // Dynamic 3D Lightning Discharge Fractal Branching
      lightningGroup.visible = showLightning;
      if (showLightning) {
        arcLines.forEach((line, aIdx) => {
          const theta = (aIdx * 2 * Math.PI) / arcCount + Math.sin(time * 8.0 + aIdx) * 0.4;
          const arcLength = 4.5 + Math.sin(time * 15.0 + aIdx * 2) * 1.5;
          const targetX = Math.cos(theta) * arcLength;
          const targetY = 5.0 + (Math.random() - 0.3) * 3.0;
          const targetZ = Math.sin(theta) * arcLength;

          const pos = line.geometry.attributes.position.array as Float32Array;
          const segCount = 12;
          for (let s = 0; s <= segCount; s++) {
            const frac = s / segCount;
            const jitterX = s > 0 && s < segCount ? (Math.random() - 0.5) * 0.6 : 0;
            const jitterY = s > 0 && s < segCount ? (Math.random() - 0.5) * 0.6 : 0;
            const jitterZ = s > 0 && s < segCount ? (Math.random() - 0.5) * 0.6 : 0;

            pos[s * 3] = frac * targetX + jitterX;
            pos[s * 3 + 1] = 5.0 + frac * (targetY - 5.0) + jitterY;
            pos[s * 3 + 2] = frac * targetZ + jitterZ;
          }
          line.geometry.attributes.position.needsUpdate = true;
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      studio.dispose();
    };
  }, [showLightning]);

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Zap className="w-6 h-6 text-purple-500 animate-pulse" />
            <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50">
              3D Real-Time Tesla Resonant Transformer &amp; Plasma Discharge Simulator (US 533,367)
            </h3>
          </div>
          <p className="text-sm sm:text-base text-ink-700 dark:text-ink-300 mt-1">
            Studio-illuminated Three.js high-frequency electromagnetic simulation of{" "}
            <strong>air-core dual LC resonance</strong> and{" "}
            <strong>million-volt plasma streamers</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300 text-xs sm:text-sm font-mono font-bold border border-purple-300 dark:border-purple-800 shadow-2xs">
            {secondaryVoltageKv} kV Peak Potential
          </div>
        </div>
      </div>

      {/* 3D WebGL Canvas & HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-[#0f172a] border border-parchment-300 dark:border-ink-800 relative min-h-[460px] overflow-hidden shadow-inner">
          {/* Top HUD */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none text-xs sm:text-sm font-mono">
            <div className="px-3.5 py-1.5 bg-ink-900/90 border border-ink-800 text-purple-300 rounded-xl shadow-md">
              Resonant Frequency:{" "}
              <span className="font-bold">{resonantFreqKhz.toFixed(1)} kHz</span> · Topload Peak:{" "}
              <span className="text-amber-300 font-bold">{secondaryVoltageKv} kV</span>
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={() => setShowLightning(!showLightning)}
                className={`px-3 py-1 rounded-lg border text-xs font-mono transition-colors ${
                  showLightning
                    ? "bg-purple-600 text-white border-purple-500"
                    : "bg-ink-900 text-ink-400 border-ink-800"
                }`}
              >
                Plasma Streamers: {showLightning ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* 3D Canvas */}
          <div ref={containerRef} className="w-full h-[460px] cursor-grab active:cursor-grabbing" />

          {/* Bottom Telemetry */}
          <div className="w-full grid grid-cols-4 gap-3 text-center text-sm font-mono p-4 bg-ink-950/95 border-t border-ink-800 text-ink-300 z-10">
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                RESONANCE
              </span>
              <span className="text-purple-400 font-bold text-sm sm:text-base">
                {resonantFreqKhz.toFixed(1)} kHz
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                PRIMARY CAP
              </span>
              <span className="text-emerald-400 font-bold text-sm sm:text-base">
                {primaryCapacitanceNf} nF
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                SPARK REPETITION
              </span>
              <span className="text-amber-400 font-bold text-sm sm:text-base">
                {sparkRateHz} PPS
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
              Resonant LC Parameters
            </span>

            {/* Primary Tank Capacitance Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Primary Tank Cap ($C_p$)
                </span>
                <span className="text-purple-600 dark:text-purple-400 font-bold">
                  {primaryCapacitanceNf} nF
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="2"
                value={primaryCapacitanceNf}
                onChange={(e) => setPrimaryCapacitanceNf(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Secondary Turns Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Secondary Turns ($N_s$)
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {secondaryTurns} turns
                </span>
              </div>
              <input
                type="range"
                min="400"
                max="1400"
                step="50"
                value={secondaryTurns}
                onChange={(e) => setSecondaryTurns(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Spark Gap Rate Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Rotary Spark Gap Rate
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {sparkRateHz} Hz
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="400"
                step="10"
                value={sparkRateHz}
                onChange={(e) => setSparkRateHz(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-ink-950 dark:text-parchment-100 text-xs sm:text-sm font-sans space-y-1.5">
              <span className="font-bold text-purple-900 dark:text-purple-300 block font-mono text-xs uppercase tracking-wider">
                Quarter-Wave Resonance:
              </span>
              <p className="leading-relaxed">
                By tuning the primary capacitor tank circuit to match the secondary coil&apos;s
                natural resonant frequency ({resonantFreqKhz.toFixed(1)} kHz), standing
                electromagnetic waves build up massive electrical potential at the ungrounded toroid
                terminal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
