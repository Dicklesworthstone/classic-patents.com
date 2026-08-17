"use client";

import { Rocket } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createThreeStudioScene } from "./ThreeStudioScene";

export function GoddardRocket3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Rocket Propulsion State
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(1);
  const [chamberPressurePsi, setChamberPressurePsi] = useState<number>(300);
  const [payloadMassKg, _setPayloadMassKg] = useState<number>(15);
  const [isFiringEngine, setIsFiringEngine] = useState<boolean>(true);

  // Tsiolkovsky Rocket Equation & Supersonic Expansion Physics
  const massRatio = currentStage === 1 ? 5.2 : currentStage === 2 ? 3.8 : 2.5;
  const exhaustVelocityMs = Math.round(Math.sqrt((2 * 1.25 * 8.314 * 2800) / (0.022 * 0.25))); // ~2,400 m/s
  const deltaVMs = Math.round(exhaustVelocityMs * Math.log(massRatio));
  const thrustNewtons = Math.round(chamberPressurePsi * 6894.76 * 0.0035);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with Museum Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [15, 12, 18],
      targetPos: [0, 0, 0],
      bgBottomColor: 0x0f172a,
      rimColor: 0x38bdf8,
      ambientIntensity: 1.3,
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const rocketHullMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.85,
      roughness: 0.2,
    });

    const stage2HullMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.85,
      roughness: 0.25,
    });

    const payloadMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.9,
      roughness: 0.15,
    });

    const nozzleInconelMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.95,
      roughness: 0.3,
    });

    // --- 3D GODDARD MULTI-STAGE ROCKET ASSEMBLY ---
    const rocketGroup = new THREE.Group();
    scene.add(rocketGroup);

    // Stage 1 (Booster Stage)
    const stage1Group = new THREE.Group();
    const s1Body = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 6.0, 32), rocketHullMat);
    s1Body.position.y = -3.0;
    stage1Group.add(s1Body);

    // Stage 1 de Laval Supersonic Nozzle
    const s1Nozzle = new THREE.Mesh(
      new THREE.ConeGeometry(1.4, 2.0, 32, 1, true),
      nozzleInconelMat,
    );
    s1Nozzle.position.y = -6.8;
    stage1Group.add(s1Nozzle);

    // Aerodynamic Stabilizer Fins
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.2, 1.6), rocketHullMat);
      fin.position.set(Math.cos(angle) * 2.0, -5.0, Math.sin(angle) * 2.0);
      fin.rotation.y = -angle;
      stage1Group.add(fin);
    }
    rocketGroup.add(stage1Group);

    // Stage 2 (Sustainer Stage)
    const stage2Group = new THREE.Group();
    const s2Body = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 4.5, 32), stage2HullMat);
    s2Body.position.y = 2.25;
    stage2Group.add(s2Body);

    const s2Nozzle = new THREE.Mesh(
      new THREE.ConeGeometry(0.9, 1.5, 32, 1, true),
      nozzleInconelMat,
    );
    s2Nozzle.position.y = -0.6;
    stage2Group.add(s2Nozzle);
    rocketGroup.add(stage2Group);

    // Stage 3 / Payload Fairing (Nosecone)
    const payloadGroup = new THREE.Group();
    const nosecone = new THREE.Mesh(new THREE.ConeGeometry(1.2, 3.2, 32), payloadMat);
    nosecone.position.y = 6.1;
    payloadGroup.add(nosecone);
    rocketGroup.add(payloadGroup);

    // --- 3D SUPERSONIC EXHAUST PLUME WITH SHOCK DIAMONDS ---
    const exhaustGroup = new THREE.Group();
    scene.add(exhaustGroup);

    const flameCone = new THREE.Mesh(
      new THREE.ConeGeometry(1.2, 5.5, 24, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.85 }),
    );
    flameCone.rotation.x = Math.PI;
    exhaustGroup.add(flameCone);

    // Supersonic Shock Diamond Beads
    const diamondMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const diamonds: THREE.Mesh[] = [];
    for (let d = 0; d < 4; d++) {
      const diamond = new THREE.Mesh(new THREE.OctahedronGeometry(0.35), diamondMat);
      diamond.position.y = -1.2 - d * 1.1;
      diamonds.push(diamond);
      exhaustGroup.add(diamond);
    }

    // --- ANIMATION & PHYSICS INTEGRATION LOOP ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      controls.update();

      // Multi-stage Separation Offsets
      if (currentStage === 1) {
        stage1Group.position.set(0, 0, 0);
        stage2Group.position.set(0, 0, 0);
        payloadGroup.position.set(0, 0, 0);
        exhaustGroup.position.set(0, -6.8, 0);
      } else if (currentStage === 2) {
        stage1Group.position.y = -6.0 - Math.min(15, (time * 4) % 30);
        stage2Group.position.set(0, 0, 0);
        payloadGroup.position.set(0, 0, 0);
        exhaustGroup.position.set(0, -0.6, 0);
      } else {
        stage1Group.position.y = -20;
        stage2Group.position.y = -6.0 - Math.min(15, (time * 4) % 30);
        payloadGroup.position.set(0, 0, 0);
        exhaustGroup.position.set(0, 4.5, 0);
      }

      // Exhaust Plume Shock Diamond Vibration
      exhaustGroup.visible = isFiringEngine;
      if (isFiringEngine) {
        const flameJitter = 1.0 + Math.sin(time * 45) * 0.15;
        flameCone.scale.set(flameJitter, 1.0 + Math.sin(time * 30) * 0.1, flameJitter);
        diamonds.forEach((d, idx) => {
          d.scale.setScalar(0.8 + Math.sin(time * 50 + idx) * 0.3);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      studio.dispose();
    };
  }, [currentStage, isFiringEngine]);

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Rocket className="w-6 h-6 text-amber-500 animate-pulse" />
            <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50">
              3D Real-Time Goddard Multi-Stage Rocket &amp; Supersonic Nozzle Simulator (US
              1,155,986)
            </h3>
          </div>
          <p className="text-sm sm:text-base text-ink-700 dark:text-ink-300 mt-1">
            Studio-illuminated Three.js aerospace simulation of{" "}
            <strong>sequential stage separation</strong> and{" "}
            <strong>supersonic de Laval expansion</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-xs sm:text-sm font-mono font-bold border border-amber-300 dark:border-amber-800 shadow-2xs">
            Stage {currentStage} Active (Δv: {deltaVMs.toLocaleString()} m/s)
          </div>
        </div>
      </div>

      {/* 3D WebGL Canvas & HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-[#0f172a] border border-parchment-300 dark:border-ink-800 relative min-h-[460px] overflow-hidden shadow-inner">
          {/* Top HUD */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none text-xs sm:text-sm font-mono">
            <div className="px-3.5 py-1.5 bg-ink-900/90 border border-ink-800 text-amber-300 rounded-xl shadow-md">
              Exhaust Velocity:{" "}
              <span className="font-bold">{exhaustVelocityMs.toLocaleString()} m/s</span> · Thrust:{" "}
              <span className="text-emerald-300 font-bold">{thrustNewtons.toLocaleString()} N</span>
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={() => setIsFiringEngine(!isFiringEngine)}
                className={`px-3 py-1 rounded-lg border text-xs font-mono transition-colors ${
                  isFiringEngine
                    ? "bg-amber-600 text-white border-amber-500"
                    : "bg-ink-900 text-ink-400 border-ink-800"
                }`}
              >
                Ignition: {isFiringEngine ? "FIRING" : "CUTOFF"}
              </button>
            </div>
          </div>

          {/* 3D Canvas */}
          <div ref={containerRef} className="w-full h-[460px] cursor-grab active:cursor-grabbing" />

          {/* Bottom Telemetry */}
          <div className="w-full grid grid-cols-4 gap-3 text-center text-sm font-mono p-4 bg-ink-950/95 border-t border-ink-800 text-ink-300 z-10">
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                CHAMBER PRESSURE
              </span>
              <span className="text-amber-400 font-bold text-sm sm:text-base">
                {chamberPressurePsi} PSI
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                MASS RATIO (R)
              </span>
              <span className="text-emerald-400 font-bold text-sm sm:text-base">
                {massRatio.toFixed(1)} : 1
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                PAYLOAD MASS
              </span>
              <span className="text-blue-400 font-bold text-sm sm:text-base">
                {payloadMassKg} kg
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
              Multi-Stage Staging Controls
            </span>

            {/* Stage Selector */}
            <div className="space-y-1.5">
              <span className="text-xs sm:text-sm font-mono block text-ink-800 dark:text-ink-200 font-semibold mb-1">
                Active Flight Stage
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs sm:text-sm font-mono">
                <button
                  type="button"
                  onClick={() => setCurrentStage(1)}
                  className={`p-2 rounded-xl border text-center transition-colors shadow-2xs ${
                    currentStage === 1
                      ? "bg-amber-700 text-white font-bold"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-800 dark:text-ink-200"
                  }`}
                >
                  Stage 1 Booster
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStage(2)}
                  className={`p-2 rounded-xl border text-center transition-colors shadow-2xs ${
                    currentStage === 2
                      ? "bg-amber-700 text-white font-bold"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-800 dark:text-ink-200"
                  }`}
                >
                  Stage 2 Sustainer
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStage(3)}
                  className={`p-2 rounded-xl border text-center transition-colors shadow-2xs ${
                    currentStage === 3
                      ? "bg-amber-700 text-white font-bold"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-800 dark:text-ink-200"
                  }`}
                >
                  Stage 3 Payload
                </button>
              </div>
            </div>

            {/* Chamber Pressure Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Combustion Chamber ($P_c$)
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {chamberPressurePsi} PSI
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="600"
                step="25"
                value={chamberPressurePsi}
                onChange={(e) => setChamberPressurePsi(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-ink-950 dark:text-parchment-100 text-xs sm:text-sm font-sans space-y-1.5">
              <span className="font-bold text-amber-900 dark:text-amber-300 block font-mono text-xs uppercase tracking-wider">
                Goddard&apos;s Staging Equation:
              </span>
              <p className="leading-relaxed">
                {
                  "Single-stage rockets are limited by structural deadweight ($m_{structure}$). By discarding empty tanks in successive stages, the total velocity is the sum of all stages ($\\Delta v_{total} = \\sum v_e \\ln(m_0 / m_f)$), enabling escape velocity into outer space."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
