"use client";

import { Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createThreeStudioScene } from "./ThreeStudioScene";

export function NoycePlanarIC3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Semiconductor Parameter State
  const [layerExplodeDistance, setLayerExplodeDistance] = useState<number>(2.5); // 0 to 5
  const [activeStep, setActiveStep] = useState<number>(4); // 1: Substrate, 2: Oxidation, 3: Etch/Diff, 4: Aluminum Leads
  const [showElectronHoles, setShowElectronHoles] = useState<boolean>(true);
  const [biasVoltage, setBiasVoltage] = useState<number>(1.2); // 0 to 5 V

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with Museum Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [16, 14, 18],
      targetPos: [0, 0, 0],
      bgBottomColor: 0x0f172a,
      rimColor: 0x38bdf8,
      ambientIntensity: 1.3,
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const pSubstrateMaterial = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.4,
      roughness: 0.5,
    });

    const nWellMaterial = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.5,
      roughness: 0.4,
    });

    const pPlusMaterial = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      metalness: 0.5,
      roughness: 0.4,
    });

    const sio2Material = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transmission: 0.88,
      opacity: 0.85,
      transparent: true,
      roughness: 0.08,
      ior: 1.45,
    });

    const aluminumLeadsMaterial = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.95,
      roughness: 0.1,
    });

    // --- 3D MONOLITHIC PLANAR IC WAFER STACK ---
    const waferGroup = new THREE.Group();
    scene.add(waferGroup);

    // Layer 1: P-type Silicon Monolithic Substrate
    const substrateMesh = new THREE.Mesh(
      new THREE.BoxGeometry(14.0, 1.2, 10.0),
      pSubstrateMaterial,
    );
    substrateMesh.position.y = -2.0;
    substrateMesh.castShadow = true;
    substrateMesh.receiveShadow = true;
    waferGroup.add(substrateMesh);

    // Layer 2: N-type Wells (Diffused collectors)
    const nWellGroup = new THREE.Group();
    const nWell1 = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.8, 4.0), nWellMaterial);
    nWell1.position.set(-3.0, 0, 0);
    const nWell2 = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.8, 4.0), nWellMaterial);
    nWell2.position.set(3.5, 0, 0);
    nWellGroup.add(nWell1);
    nWellGroup.add(nWell2);
    waferGroup.add(nWellGroup);

    // Layer 3: P+ Base and N+ Emitter Diffusion Pockets
    const pPlusGroup = new THREE.Group();
    const pBase1 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.5, 2.5), pPlusMaterial);
    pBase1.position.set(-3.0, 0, 0);
    const pBase2 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.5, 2.5), pPlusMaterial);
    pBase2.position.set(3.5, 0, 0);
    pPlusGroup.add(pBase1);
    pPlusGroup.add(pBase2);
    waferGroup.add(pPlusGroup);

    // Layer 4: Thermally Grown Silicon Dioxide (SiO2) Passivation Layer
    const oxideMesh = new THREE.Mesh(new THREE.BoxGeometry(14.0, 0.4, 10.0), sio2Material);
    waferGroup.add(oxideMesh);

    // Layer 5: Vapor-Deposited Aluminum Interconnect Metallization Leads
    const leadsGroup = new THREE.Group();
    const lead1 = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.3, 0.8), aluminumLeadsMaterial);
    lead1.position.set(0, 0, -2.0);
    const lead2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 5.0), aluminumLeadsMaterial);
    lead2.position.set(-3.0, 0, 0);
    const lead3 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 5.0), aluminumLeadsMaterial);
    lead3.position.set(3.5, 0, 0);

    leadsGroup.add(lead1);
    leadsGroup.add(lead2);
    leadsGroup.add(lead3);
    waferGroup.add(leadsGroup);

    // --- 3D ELECTRON & HOLE PARTICLES ---
    const carrierCount = 140;
    const carrierGeo = new THREE.BufferGeometry();
    const carrierPos = new Float32Array(carrierCount * 3);
    const carrierCol = new Float32Array(carrierCount * 3);

    for (let i = 0; i < carrierCount; i++) {
      carrierPos[i * 3] = (Math.random() - 0.5) * 12;
      carrierPos[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
      carrierPos[i * 3 + 2] = (Math.random() - 0.5) * 8;

      if (i % 2 === 0) {
        carrierCol[i * 3] = 0.2;
        carrierCol[i * 3 + 1] = 0.7;
        carrierCol[i * 3 + 2] = 1.0;
      } else {
        carrierCol[i * 3] = 1.0;
        carrierCol[i * 3 + 1] = 0.4;
        carrierCol[i * 3 + 2] = 0.2;
      }
    }
    carrierGeo.setAttribute("position", new THREE.BufferAttribute(carrierPos, 3));
    carrierGeo.setAttribute("color", new THREE.BufferAttribute(carrierCol, 3));

    const carrierPoints = new THREE.Points(
      carrierGeo,
      new THREE.PointsMaterial({
        size: 0.18,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
      }),
    );
    waferGroup.add(carrierPoints);

    // --- ANIMATION & PHYSICS INTEGRATION LOOP ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      clock.getElapsedTime();

      controls.update();

      // Layer Explosion Vertical Offsets
      const d = layerExplodeDistance;
      substrateMesh.position.y = -2.0 - d * 0.8;
      nWellGroup.position.y = -0.5 - d * 0.4;
      pPlusGroup.position.y = 0.5 + d * 0.2;
      oxideMesh.position.y = 1.5 + d * 0.8;
      leadsGroup.position.y = 2.5 + d * 1.4;

      // Visibility based on Active Step
      nWellGroup.visible = activeStep >= 2;
      pPlusGroup.visible = activeStep >= 3;
      oxideMesh.visible = activeStep >= 2;
      leadsGroup.visible = activeStep >= 4;
      carrierPoints.visible = showElectronHoles;

      // Carrier drift velocity under bias
      if (showElectronHoles) {
        const positions = carrierGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < carrierCount; i++) {
          const speed = biasVoltage * 0.05 + 0.02;
          positions[i * 3] += (i % 2 === 0 ? 1 : -1) * speed;
          if (positions[i * 3] > 6) positions[i * 3] = -6;
          if (positions[i * 3] < -6) positions[i * 3] = 6;
        }
        carrierGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      studio.dispose();
    };
  }, [layerExplodeDistance, activeStep, showElectronHoles, biasVoltage]);

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Zap className="w-6 h-6 text-blue-500 animate-pulse" />
            <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50">
              3D Real-Time Noyce Monolithic Silicon Planar IC Simulator (US 2,981,877)
            </h3>
          </div>
          <p className="text-sm sm:text-base text-ink-700 dark:text-ink-300 mt-1">
            Studio-illuminated Three.js semiconductor wafer physics illustrating{" "}
            <strong>monolithic planar fabrication</strong> and{" "}
            <strong>vapor-deposited aluminum leads</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-300 text-xs sm:text-sm font-mono font-bold border border-blue-300 dark:border-blue-800 shadow-2xs">
            Planar Process (Fairchild 1959)
          </div>
        </div>
      </div>

      {/* 3D WebGL Canvas & HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-[#0f172a] border border-parchment-300 dark:border-ink-800 relative min-h-[460px] overflow-hidden shadow-inner">
          {/* Top HUD */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none text-xs sm:text-sm font-mono">
            <div className="px-3.5 py-1.5 bg-ink-900/90 border border-ink-800 text-blue-300 rounded-xl shadow-md">
              Active Layer Step: <span className="font-bold">Step {activeStep} of 4</span> (Vapor
              Metallization)
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={() => setShowElectronHoles(!showElectronHoles)}
                className={`px-3 py-1 rounded-lg border text-xs font-mono transition-colors ${
                  showElectronHoles
                    ? "bg-blue-600 text-white border-blue-500"
                    : "bg-ink-900 text-ink-400 border-ink-800"
                }`}
              >
                Carriers (e⁻/h⁺): {showElectronHoles ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* 3D Canvas */}
          <div ref={containerRef} className="w-full h-[460px] cursor-grab active:cursor-grabbing" />

          {/* Bottom Telemetry */}
          <div className="w-full grid grid-cols-4 gap-3 text-center text-sm font-mono p-4 bg-ink-950/95 border-t border-ink-800 text-ink-300 z-10">
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                SUBSTRATE
              </span>
              <span className="text-blue-400 font-bold text-sm sm:text-base">p-Type Silicon</span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                DIELECTRIC
              </span>
              <span className="text-emerald-400 font-bold text-sm sm:text-base">SiO₂ Glass</span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                INTERCONNECT
              </span>
              <span className="text-amber-400 font-bold text-sm sm:text-base">Vapor Aluminum</span>
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
              Wafer Planar Layer Controls
            </span>

            {/* Explode Distance Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Exploded Layer Separation
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {layerExplodeDistance.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="5.0"
                step="0.1"
                value={layerExplodeDistance}
                onChange={(e) => setLayerExplodeDistance(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Bias Voltage Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Forward PN Bias Voltage ($V_f$)
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {biasVoltage} V
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="5.0"
                step="0.2"
                value={biasVoltage}
                onChange={(e) => setBiasVoltage(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Process Fabrication Stepper */}
            <div className="space-y-1.5">
              <span className="text-xs sm:text-sm font-mono block text-ink-800 dark:text-ink-200 font-semibold mb-1">
                Fabrication Process Step
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm font-mono">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className={`p-2.5 rounded-xl border text-center transition-colors shadow-2xs ${
                    activeStep === 1
                      ? "bg-blue-700 text-white font-bold"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-800 dark:text-ink-200"
                  }`}
                >
                  1. Substrate
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className={`p-2.5 rounded-xl border text-center transition-colors shadow-2xs ${
                    activeStep === 2
                      ? "bg-blue-700 text-white font-bold"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-800 dark:text-ink-200"
                  }`}
                >
                  2. Oxidation
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className={`p-2.5 rounded-xl border text-center transition-colors shadow-2xs ${
                    activeStep === 3
                      ? "bg-blue-700 text-white font-bold"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-800 dark:text-ink-200"
                  }`}
                >
                  3. Diffusion
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className={`p-2.5 rounded-xl border text-center transition-colors shadow-2xs ${
                    activeStep === 4
                      ? "bg-blue-700 text-white font-bold"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-800 dark:text-ink-200"
                  }`}
                >
                  4. Aluminum Leads
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-ink-950 dark:text-parchment-100 text-xs sm:text-sm font-sans space-y-1.5">
              <span className="font-bold text-blue-900 dark:text-blue-300 block font-mono text-xs uppercase tracking-wider">
                Noyce&apos;s &ldquo;Monolithic Idea&rdquo;:
              </span>
              <p className="leading-relaxed">
                Rather than hand-soldering fragile gold fly-wires between discrete components (Jack
                Kilby&apos;s approach), Noyce evaporated aluminum lines directly over thermally
                grown silicon dioxide insulation, creating all transistors and wiring in a single
                monolithic crystal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
