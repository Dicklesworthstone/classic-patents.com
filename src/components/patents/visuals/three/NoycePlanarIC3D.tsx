"use client";

import { Cpu, Layers } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";

export function NoycePlanarIC3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Microelectronics State Controls
  const [clockFrequencyMhz, setClockFrequencyMhz] = useState<number>(10); // 1 to 50 MHz
  const [oxideLayerThicknessNm, setOxideLayerThicknessNm] = useState<number>(500); // 100 to 1000 nm
  const [activeLayer, setActiveLayer] = useState<"all" | "silicon" | "oxide" | "metal">("all");
  const [showLogicSignals, setShowLogicSignals] = useState<boolean>(true);

  // Semiconductor Physics Calculations
  const gateCapacitancePf = ((11.7 * 8.854e-12 * 1e-8) / (oxideLayerThicknessNm * 1e-9)) * 1e12;
  const gatePropagationDelayPs = Math.round(gateCapacitancePf * 45 * 10);
  const maxClockGhz = (1000 / (gatePropagationDelayPs * 4)).toFixed(2);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with High-Luminosity Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [10, 8, 12],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const siliconSubstrateMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // Monocrystalline p-type silicon wafer
      roughness: 0.25,
      metalness: 0.85,
    });

    const nDiffusedMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // n-type diffused phosphorus well
      roughness: 0.3,
      metalness: 0.75,
    });

    const siliconDioxideMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8, // Thermally grown SiO2 insulating glass
      transmission: 0.82,
      opacity: 0.85,
      transparent: true,
      roughness: 0.05,
      ior: 1.46,
    });

    const aluminumMetalMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc, // Vapor-deposited aluminum film interconnect
      roughness: 0.08,
      metalness: 0.98,
    });

    const goldBondWireMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Thermosonic ball bond gold wire
      roughness: 0.15,
      metalness: 0.95,
    });

    // --- 3D MONOLITHIC PLANAR IC CHIP ASSEMBLY ---
    const chipGroup = new THREE.Group();
    scene.add(chipGroup);

    // 1. P-Type Monocrystalline Silicon Substrate
    const substrateGeo = new THREE.BoxGeometry(8.0, 0.8, 8.0);
    const substrateMesh = new THREE.Mesh(substrateGeo, siliconSubstrateMat);
    substrateMesh.position.y = -0.4;
    substrateMesh.castShadow = true;
    substrateMesh.receiveShadow = true;
    chipGroup.add(substrateMesh);

    // 2. N-Type Diffused Wells (Transistor Collector & Emitter regions)
    const nWellsGroup = new THREE.Group();
    for (let x = -2.2; x <= 2.2; x += 2.2) {
      for (let z = -2.2; z <= 2.2; z += 2.2) {
        const well = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.2, 1.4), nDiffusedMat);
        well.position.set(x, 0.02, z);
        nWellsGroup.add(well);
      }
    }
    chipGroup.add(nWellsGroup);

    // 3. Thermally Grown SiO2 Dielectric Oxide Layer with Etched Contact Vias
    const oxideLayer = new THREE.Mesh(new THREE.BoxGeometry(7.8, 0.35, 7.8), siliconDioxideMat);
    oxideLayer.position.y = 0.25;
    chipGroup.add(oxideLayer);

    // 4. Vapor-Deposited Aluminum Interconnect Traces (Planar Metallization)
    const metalGroup = new THREE.Group();

    // Cross-chip bus lines & interconnect bridges
    const trace1 = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.12, 0.35), aluminumMetalMat);
    trace1.position.set(0, 0.48, -1.8);
    trace1.castShadow = true;
    const trace2 = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.12, 0.35), aluminumMetalMat);
    trace2.position.set(0, 0.48, 1.8);
    trace2.castShadow = true;
    const trace3 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 5.0), aluminumMetalMat);
    trace3.position.set(-1.8, 0.48, 0);
    trace3.castShadow = true;
    const trace4 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 5.0), aluminumMetalMat);
    trace4.position.set(1.8, 0.48, 0);
    trace4.castShadow = true;

    metalGroup.add(trace1);
    metalGroup.add(trace2);
    metalGroup.add(trace3);
    metalGroup.add(trace4);

    // Contact Via Plugs connecting Metal Traces through SiO2 to Silicon
    for (let x = -1.8; x <= 1.8; x += 1.8) {
      for (let z = -1.8; z <= 1.8; z += 1.8) {
        const via = new THREE.Mesh(
          new THREE.CylinderGeometry(0.18, 0.18, 0.5, 12),
          aluminumMetalMat,
        );
        via.position.set(x, 0.25, z);
        metalGroup.add(via);
      }
    }
    chipGroup.add(metalGroup);

    // 5. Gold Bond Wires to External Leadframe
    const bondWiresGroup = new THREE.Group();
    const bondPoints = [
      new THREE.Vector3(-3.5, 0.5, -1.8),
      new THREE.Vector3(3.5, 0.5, -1.8),
      new THREE.Vector3(-3.5, 0.5, 1.8),
      new THREE.Vector3(3.5, 0.5, 1.8),
    ];
    for (const pt of bondPoints) {
      const curve = new THREE.CatmullRomCurve3([
        pt,
        new THREE.Vector3(pt.x * 1.3, 1.5, pt.z * 1.3),
        new THREE.Vector3(pt.x * 1.8, -0.4, pt.z * 1.8),
      ]);
      const wire = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 20, 0.05, 8, false),
        goldBondWireMat,
      );
      wire.castShadow = true;
      bondWiresGroup.add(wire);
    }
    chipGroup.add(bondWiresGroup);

    // --- GLOWING LOGIC SIGNAL PULSE PARTICLES ---
    const signalCount = 120;
    const signalGeo = new THREE.BufferGeometry();
    const signalPos = new Float32Array(signalCount * 3);
    const signalColors = new Float32Array(signalCount * 3);

    const glowTex = createGlowPointTexture();

    for (let i = 0; i < signalCount; i++) {
      const idx = i * 3;
      signalPos[idx] = (Math.random() - 0.5) * 6.5;
      signalPos[idx + 1] = 0.56;
      signalPos[idx + 2] = Math.random() > 0.5 ? -1.8 : 1.8;

      signalColors[idx] = 0.2;
      signalColors[idx + 1] = 1.0;
      signalColors[idx + 2] = 0.4;
    }

    signalGeo.setAttribute("position", new THREE.BufferAttribute(signalPos, 3));
    signalGeo.setAttribute("color", new THREE.BufferAttribute(signalColors, 3));

    const signalPoints = new THREE.Points(
      signalGeo,
      new THREE.PointsMaterial({
        size: 0.35,
        map: glowTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    scene.add(signalPoints);

    // --- RENDER LOOP & REAL-TIME LOGIC PROPAGATION ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Layer Visibility Controls
      substrateMesh.visible = activeLayer === "all" || activeLayer === "silicon";
      nWellsGroup.visible = activeLayer === "all" || activeLayer === "silicon";
      oxideLayer.visible = activeLayer === "all" || activeLayer === "oxide";
      metalGroup.visible = activeLayer === "all" || activeLayer === "metal";

      // Animate Logic Current Packets flowing along Aluminum Traces
      const sPos = signalPos;
      const speed = (clockFrequencyMhz / 10) * 8.0 * delta;

      for (let i = 0; i < signalCount; i++) {
        const idx = i * 3;
        sPos[idx] += speed;
        if (sPos[idx] > 3.4) {
          sPos[idx] = -3.4;
        }
      }
      signalGeo.attributes.position.needsUpdate = true;
      signalPoints.visible = showLogicSignals && (activeLayer === "all" || activeLayer === "metal");

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      studio.dispose();
    };
  }, [clockFrequencyMhz, activeLayer, showLogicSignals]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Live HUD Telemetry Overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
            <div className="text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              Planar Microchip Telemetry
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs font-sans">
              <div>
                <span className="text-ink-600 dark:text-ink-400">Clock Frequency:</span>{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {clockFrequencyMhz} MHz
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Gate Propagation:</span>{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {gatePropagationDelayPs} ps
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">SiO₂ Dielectric:</span>{" "}
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {oxideLayerThicknessNm} nm (k = 3.9)
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">f_max Limit:</span>{" "}
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {maxClockGhz} GHz
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Monolithic Planar Structure (Eliminated Hand-Wired Flying Leads)</span>
          </div>
        </div>

        {/* Layer View Toggles */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            type="button"
            onClick={() => setShowLogicSignals(!showLogicSignals)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
              showLogicSignals
                ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            Logic Signals
          </button>
        </div>
      </div>

      {/* Parameter Sliders Panel */}
      <div className="p-4 sm:p-5 bg-parchment-100/80 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
        {/* Layer Filter Buttons */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Exploded Layer View:</span>
            <span className="font-bold text-amber-700 dark:text-amber-400 uppercase">
              {activeLayer}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => setActiveLayer("all")}
              className={`py-1 px-2 rounded-md text-[11px] font-semibold border ${
                activeLayer === "all"
                  ? "bg-amber-600 text-white border-amber-700 shadow-sm"
                  : "bg-white/80 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
              }`}
            >
              All Layers
            </button>
            <button
              type="button"
              onClick={() => setActiveLayer("silicon")}
              className={`py-1 px-2 rounded-md text-[11px] font-semibold border ${
                activeLayer === "silicon"
                  ? "bg-amber-600 text-white border-amber-700 shadow-sm"
                  : "bg-white/80 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
              }`}
            >
              Silicon Base
            </button>
            <button
              type="button"
              onClick={() => setActiveLayer("oxide")}
              className={`py-1 px-2 rounded-md text-[11px] font-semibold border ${
                activeLayer === "oxide"
                  ? "bg-amber-600 text-white border-amber-700 shadow-sm"
                  : "bg-white/80 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
              }`}
            >
              SiO₂ Oxide
            </button>
            <button
              type="button"
              onClick={() => setActiveLayer("metal")}
              className={`py-1 px-2 rounded-md text-[11px] font-semibold border ${
                activeLayer === "metal"
                  ? "bg-amber-600 text-white border-amber-700 shadow-sm"
                  : "bg-white/80 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
              }`}
            >
              Al Interconnect
            </button>
          </div>
        </div>

        {/* Clock Frequency */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>{"Master Clock ($f_{clk}$):"}</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {clockFrequencyMhz} MHz
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            step="1"
            value={clockFrequencyMhz}
            onChange={(e) => setClockFrequencyMhz(Number(e.target.value))}
            className="w-full accent-blue-600 dark:accent-blue-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Planar metal tracks eliminate parasitic inductance
          </span>
        </div>

        {/* Oxide Thickness */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>{"Oxide Thickness ($t_{ox}$):"}</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {oxideLayerThicknessNm} nm
            </span>
          </div>
          <input
            type="range"
            min="100"
            max="1000"
            step="50"
            value={oxideLayerThicknessNm}
            onChange={(e) => setOxideLayerThicknessNm(Number(e.target.value))}
            className="w-full accent-emerald-600 dark:accent-emerald-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Thermal oxidation passivation barrier
          </span>
        </div>

        {/* Moore's Law Scaling */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Transistor Integration Density:</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              {(1 / (oxideLayerThicknessNm / 500) ** 2).toFixed(1)}× Base
            </span>
          </div>
          <div className="w-full bg-parchment-300 dark:bg-ink-800 rounded-full h-3 overflow-hidden mt-2 border border-parchment-400 dark:border-ink-700">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, (1 / (oxideLayerThicknessNm / 500) ** 2) * 45)}%` }}
            />
          </div>
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Noyce monolithic architecture enabled modern VLSI
          </span>
        </div>
      </div>
    </div>
  );
}
