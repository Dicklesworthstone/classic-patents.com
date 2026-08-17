"use client";

import { Sparkles, Thermometer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

export function EinsteinRefrigerator3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Absorption Thermodynamics State Controls
  const [heatInputWatts, setHeatInputWatts] = useState<number>(220); // 80 to 500 Watts
  const [systemPressureAtm, setSystemPressureAtm] = useState<number>(10); // 6 to 16 Atm
  const [auxiliaryGasRatio, setAuxiliaryGasRatio] = useState<number>(0.8); // 0.2 to 0.95 Ammonia/Butane
  const [isHeating, setIsHeating] = useState<boolean>(true);

  // Thermodynamic Physics (Dalton's Law of Partial Pressures)
  // P_butane = P_total * (1 - y_ammonia)
  const butanePartialPressureAtm = (systemPressureAtm * (1 - auxiliaryGasRatio)).toFixed(2);
  const evaporatorTemperatureCelsius = Math.round(-18 + Number(butanePartialPressureAtm) * 6.5);
  const copEfficiency = (0.35 * (1 - Math.abs(evaporatorTemperatureCelsius) / 100)).toFixed(2);
  const coolingPowerWatts = Math.round(heatInputWatts * Number(copEfficiency));

  const live = useLiveSimParams({
    heatInputWatts,
    isHeating,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with High-Luminosity Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [11, 8, 14],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const steelPipeMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8, // Hermetically welded steel refrigeration tubing
      roughness: 0.15,
      metalness: 0.9,
    });

    const hotGeneratorMat = new THREE.MeshStandardMaterial({
      color: 0xef4444, // Heated ammonia-water boiler vessel
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0xd97706,
      emissiveIntensity: 0.5,
    });

    const coldEvaporatorMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8, // Sub-zero butane evaporative cooling chamber
      roughness: 0.1,
      metalness: 0.85,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4,
    });

    const condenserFinsMat = new THREE.MeshStandardMaterial({
      color: 0x64748b, // Air-cooled condensing heat exchanger fins
      roughness: 0.3,
      metalness: 0.85,
    });

    // --- 3D HERMETIC REFRIGERATOR CIRCUIT ASSEMBLY ---
    const fridgeGroup = new THREE.Group();
    scene.add(fridgeGroup);

    // 1. Boiler / Generator Vessel (Lower Right)
    const generator = new THREE.Mesh(
      new THREE.CylinderGeometry(0.7, 0.7, 3.2, 24),
      hotGeneratorMat,
    );
    generator.position.set(3.2, -1.2, 0);
    generator.castShadow = true;
    fridgeGroup.add(generator);

    // Bunsen Flame / Electric Heater under Generator
    const heater = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.45, 0.8, 16),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 }),
    );
    heater.position.set(3.2, -3.2, 0);
    heater.castShadow = true;
    fridgeGroup.add(heater);

    // 2. Condenser Coil Heat Exchanger (Top Right)
    const condenser = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.8, 1.2), condenserFinsMat);
    condenser.position.set(2.4, 2.2, 0);
    condenser.castShadow = true;
    fridgeGroup.add(condenser);

    // 3. Evaporator Freezing Chamber (Top Left - Cold Box)
    const evaporator = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.4, 2.4), coldEvaporatorMat);
    evaporator.position.set(-2.8, 1.8, 0);
    evaporator.castShadow = true;
    fridgeGroup.add(evaporator);

    // 4. Absorber Vessel (Lower Left)
    const absorber = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 3.4, 24), steelPipeMat);
    absorber.position.set(-2.8, -1.4, 0);
    absorber.castShadow = true;
    fridgeGroup.add(absorber);

    // Interconnecting Sealed Steel Conduits (Closed Hermetic Loop)
    const pipe1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.4, 12), steelPipeMat);
    pipe1.position.set(2.8, 0.6, 0);
    fridgeGroup.add(pipe1);

    const pipe2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 5.2, 12), steelPipeMat);
    pipe2.position.set(0, 2.6, 0);
    pipe2.rotation.z = Math.PI / 2;
    fridgeGroup.add(pipe2);

    const pipe3 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.2, 12), steelPipeMat);
    pipe3.position.set(-2.8, 0.2, 0);
    fridgeGroup.add(pipe3);

    const pipe4 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 6.0, 12), steelPipeMat);
    pipe4.position.set(0.2, -2.4, 0);
    pipe4.rotation.z = Math.PI / 2;
    fridgeGroup.add(pipe4);

    // --- GLOWING WORKING FLUID CONVECTION PARTICLES ---
    const fluidCount = 120;
    const fluidGeo = new THREE.BufferGeometry();
    const fluidPos = new Float32Array(fluidCount * 3);
    const fluidColors = new Float32Array(fluidCount * 3);

    const glowTex = createGlowPointTexture();

    for (let i = 0; i < fluidCount; i++) {
      const idx = i * 3;
      fluidPos[idx] = (Math.random() - 0.5) * 6.0;
      fluidPos[idx + 1] = (Math.random() - 0.5) * 4.5;
      fluidPos[idx + 2] = (Math.random() - 0.5) * 0.4;

      // Thermally dynamic particles: Warm red/orange near boiler, ice blue near evaporator
      const progressX = (fluidPos[idx] + 3.0) / 6.0;
      fluidColors[idx] = progressX;
      fluidColors[idx + 1] = 0.5 + (1 - progressX) * 0.4;
      fluidColors[idx + 2] = 1.0 - progressX * 0.8;
    }

    fluidGeo.setAttribute("position", new THREE.BufferAttribute(fluidPos, 3));
    fluidGeo.setAttribute("color", new THREE.BufferAttribute(fluidColors, 3));

    const fluidPoints = new THREE.Points(
      fluidGeo,
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
    fridgeGroup.add(fluidPoints);

    // --- RENDER LOOP & REAL-TIME THERMOSIPHON CIRCULATION ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const _elapsed = clock.getElapsedTime();
      const p = live.current;

      // Fluid Circulation Velocity driven purely by thermal buoyancy (Thermosiphon)
      const fPos = fluidPos;
      const circSpeed = (p.isHeating ? p.heatInputWatts / 220 : 0) * 3.5 * delta;

      for (let i = 0; i < fluidCount; i++) {
        const idx = i * 3;

        // Loop circulating clockwise around the closed hermetic loop
        if (fPos[idx] > 2.0 && fPos[idx + 1] < 2.0) {
          fPos[idx + 1] += circSpeed; // Rising ammonia vapor in generator
        } else if (fPos[idx + 1] >= 2.0 && fPos[idx] > -2.5) {
          fPos[idx] -= circSpeed; // Butane vapor flowing to evaporator
        } else if (fPos[idx] <= -2.5 && fPos[idx + 1] > -2.0) {
          fPos[idx + 1] -= circSpeed; // Cold liquid descending in absorber
        } else {
          fPos[idx] += circSpeed; // Rich ammonia solution returning to generator
        }
      }
      fluidGeo.attributes.position.needsUpdate = true;

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
              <Thermometer className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              Einstein-Szilard Absorption Cycle
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs font-sans">
              <div>
                <span className="text-ink-600 dark:text-ink-400">Evaporator Temp:</span>{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {evaporatorTemperatureCelsius}°C (
                  {Math.round((evaporatorTemperatureCelsius * 9) / 5 + 32)}°F)
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Cooling Capacity:</span>{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {coolingPowerWatts} W (COP = {copEfficiency})
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Butane Partial $P$:</span>{" "}
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {butanePartialPressureAtm} atm (of {systemPressureAtm} atm Total)
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Mechanical Parts:</span>{" "}
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  0 (100% Hermetic / Silent)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 flex items-center gap-2 max-w-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
            <span className="truncate">
              Einstein &amp; Szilard (US 1,781,541) — Dalton Absorption Cycle
            </span>
          </div>
        </div>

        {/* Heat Toggle */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            type="button"
            onClick={() => setIsHeating(!isHeating)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
              isHeating
                ? "bg-amber-600 text-white border-amber-700 shadow-sm"
                : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            {isHeating ? "Heat Source ON" : "Flame Extinguished"}
          </button>
        </div>
      </div>

      {/* Parameter Sliders Panel */}
      <div className="p-4 sm:p-5 bg-parchment-100/80 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
        {/* Heat Input */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Boiler Thermal Input:</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">
              {heatInputWatts} Watts ($th$)
            </span>
          </div>
          <input
            type="range"
            min="80"
            max="500"
            step="20"
            value={heatInputWatts}
            onChange={(e) => setHeatInputWatts(Number(e.target.value))}
            className="w-full accent-amber-600 dark:accent-amber-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Drives thermosiphon bubble pump circulation
          </span>
        </div>

        {/* System Pressure */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Uniform Total Pressure:</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {systemPressureAtm} atm (Constant)
            </span>
          </div>
          <input
            type="range"
            min="6"
            max="16"
            step="1"
            value={systemPressureAtm}
            onChange={(e) => setSystemPressureAtm(Number(e.target.value))}
            className="w-full accent-blue-600 dark:accent-blue-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Equalized pressure eliminates rotary compressor seals
          </span>
        </div>

        {/* Auxiliary Ammonia Gas Fraction */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Ammonia Gas Fraction:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {(auxiliaryGasRatio * 100).toFixed(0)}% NH₃
            </span>
          </div>
          <input
            type="range"
            min="0.2"
            max="0.95"
            step="0.05"
            value={auxiliaryGasRatio}
            onChange={(e) => setAuxiliaryGasRatio(Number(e.target.value))}
            className="w-full accent-emerald-600 dark:accent-emerald-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Dalton's Law forces butane partial pressure reduction
          </span>
        </div>

        {/* Safety & Reliability Score */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Safety &amp; Lifespan:</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              Infinite (Zero Wear)
            </span>
          </div>
          <div className="w-full bg-parchment-300 dark:bg-ink-800 rounded-full h-3 overflow-hidden mt-2 border border-parchment-400 dark:border-ink-700">
            <div
              className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full transition-all duration-300"
              style={{ width: "98%" }}
            />
          </div>
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Purchased by Electrolux in 1930 for $750
          </span>
        </div>
      </div>
    </div>
  );
}
