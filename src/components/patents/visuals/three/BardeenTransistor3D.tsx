"use client";

import { Cpu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createThreeStudioScene } from "./ThreeStudioScene";

export function BardeenTransistor3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Point-Contact Parameters
  const [emitterCurrentMa, setEmitterCurrentMa] = useState<number>(2.5); // 0 to 5 mA
  const [collectorBiasVolts, _setCollectorBiasVolts] = useState<number>(-22); // -5 to -40 V
  const [contactGapMicrons, setContactGapMicrons] = useState<number>(50); // 10 to 150 um
  const [showHoleInjection, setShowHoleInjection] = useState<boolean>(true);

  // Physics Calculations
  const alphaCurrentGain = Math.min(3.2, 0.8 + (100 / contactGapMicrons) * 0.9);
  const collectorCurrentMa = (emitterCurrentMa * alphaCurrentGain).toFixed(2);
  const powerGainDb = Math.round(
    10 * Math.log10((alphaCurrentGain * alphaCurrentGain * 10000) / 300),
  );

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
    const germaniumCrystalMat = new THREE.MeshStandardMaterial({
      color: 0x475569, // High-purity n-type Germanium slab
      metalness: 0.7,
      roughness: 0.35,
    });

    const goldFoilMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Gold foil point-contact ribbons
      metalness: 0.95,
      roughness: 0.15,
    });

    const polystyreneWedgeMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, // Polystyrene plastic wedge
      transmission: 0.85,
      opacity: 0.9,
      transparent: true,
      roughness: 0.1,
      ior: 1.55,
    });

    const brassMountMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.9,
      roughness: 0.25,
    });

    // --- 3D POINT-CONTACT TRANSISTOR ASSEMBLY ---
    const transistorGroup = new THREE.Group();
    scene.add(transistorGroup);

    // Heavy Brass Base Plate (Base Electrode)
    const basePlate = new THREE.Mesh(new THREE.BoxGeometry(10, 1.0, 8), brassMountMat);
    basePlate.position.y = -3.0;
    transistorGroup.add(basePlate);

    // N-type Germanium Crystal Block
    const germaniumBlock = new THREE.Mesh(
      new THREE.BoxGeometry(6.5, 2.0, 5.0),
      germaniumCrystalMat,
    );
    germaniumBlock.position.y = -1.5;
    transistorGroup.add(germaniumBlock);

    // Inverted Polystyrene Plastic Triangle Wedge
    const wedgeGeo = new THREE.ConeGeometry(2.2, 3.5, 3);
    const plasticWedge = new THREE.Mesh(wedgeGeo, polystyreneWedgeMat);
    plasticWedge.rotation.x = Math.PI;
    plasticWedge.position.set(0, 1.6, 0);
    transistorGroup.add(plasticWedge);

    // Gold Foil Whiskers (Emitter on Left, Collector on Right with microscopic gap)
    const gapOffset = (contactGapMicrons / 100) * 0.4;

    // Emitter Gold Ribbon
    const emitterFoil = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.2, 0.6), goldFoilMat);
    emitterFoil.position.set(-0.6 - gapOffset, 1.2, 0);
    emitterFoil.rotation.z = -0.3;
    transistorGroup.add(emitterFoil);

    // Collector Gold Ribbon
    const collectorFoil = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.2, 0.6), goldFoilMat);
    collectorFoil.position.set(0.6 + gapOffset, 1.2, 0);
    collectorFoil.rotation.z = 0.3;
    transistorGroup.add(collectorFoil);

    // --- 3D INJECTED POSITIVE HOLE CLOUDS ---
    const holeCount = 180;
    const holeGeo = new THREE.BufferGeometry();
    const holePos = new Float32Array(holeCount * 3);
    const holeCol = new Float32Array(holeCount * 3);

    for (let i = 0; i < holeCount; i++) {
      holeCol[i * 3] = 1.0;
      holeCol[i * 3 + 1] = 0.3;
      holeCol[i * 3 + 2] = 0.3;
    }
    holeGeo.setAttribute("position", new THREE.BufferAttribute(holePos, 3));
    holeGeo.setAttribute("color", new THREE.BufferAttribute(holeCol, 3));

    const holePoints = new THREE.Points(
      holeGeo,
      new THREE.PointsMaterial({
        size: 0.18,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
      }),
    );
    transistorGroup.add(holePoints);

    // --- ANIMATION & PHYSICS INTEGRATION LOOP ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      controls.update();

      // Hole Injection Advection: Holes flow from Emitter (-0.6) through surface inversion layer into Collector (+0.6)
      holePoints.visible = showHoleInjection && emitterCurrentMa > 0;
      if (holePoints.visible) {
        const positions = holeGeo.attributes.position.array as Float32Array;
        const driftSpeed = emitterCurrentMa * 0.05 + 0.02;

        for (let i = 0; i < holeCount; i++) {
          const progress = ((i * 4.5 + time * 35.0 * driftSpeed) % 100) / 100;
          const startX = -0.6 - gapOffset;
          const endX = 0.6 + gapOffset;
          const x = startX + progress * (endX - startX);
          const y = -0.5 - Math.sin(progress * Math.PI) * 0.6 - (i % 5) * 0.1;
          const z = ((i % 9) - 4) * 0.2;

          positions[i * 3] = x;
          positions[i * 3 + 1] = y;
          positions[i * 3 + 2] = z;
        }
        holeGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      studio.dispose();
    };
  }, [emitterCurrentMa, contactGapMicrons, showHoleInjection]);

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-amber-500 animate-pulse" />
            <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50">
              3D Real-Time Bardeen-Brattain Point-Contact Transistor Simulator (US 2,569,347)
            </h3>
          </div>
          <p className="text-sm sm:text-base text-ink-700 dark:text-ink-300 mt-1">
            Studio-illuminated Three.js semiconductor physics illustrating{" "}
            <strong>minority carrier hole injection</strong> and{" "}
            <strong>point-contact current amplification ($\alpha &gt; 1$)</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-xs sm:text-sm font-mono font-bold border border-amber-300 dark:border-amber-800 shadow-2xs">
            Gain: {alphaCurrentGain.toFixed(2)}x (+{powerGainDb} dB)
          </div>
        </div>
      </div>

      {/* 3D WebGL Canvas & HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-[#0f172a] border border-parchment-300 dark:border-ink-800 relative min-h-[460px] overflow-hidden shadow-inner">
          {/* Top HUD */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none text-xs sm:text-sm font-mono">
            <div className="px-3.5 py-1.5 bg-ink-900/90 border border-ink-800 text-amber-300 rounded-xl shadow-md">
              Collector Output Current: <span className="font-bold">{collectorCurrentMa} mA</span>{" "}
              (Emitter: {emitterCurrentMa} mA)
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={() => setShowHoleInjection(!showHoleInjection)}
                className={`px-3 py-1 rounded-lg border text-xs font-mono transition-colors ${
                  showHoleInjection
                    ? "bg-amber-600 text-white border-amber-500"
                    : "bg-ink-900 text-ink-400 border-ink-800"
                }`}
              >
                Hole Injection (h⁺): {showHoleInjection ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* 3D Canvas */}
          <div ref={containerRef} className="w-full h-[460px] cursor-grab active:cursor-grabbing" />

          {/* Bottom Telemetry */}
          <div className="w-full grid grid-cols-4 gap-3 text-center text-sm font-mono p-4 bg-ink-950/95 border-t border-ink-800 text-ink-300 z-10">
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                CONTACT GAP
              </span>
              <span className="text-emerald-400 font-bold text-sm sm:text-base">
                {contactGapMicrons} µm
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                CURRENT GAIN (α)
              </span>
              <span className="text-amber-400 font-bold text-sm sm:text-base">
                {alphaCurrentGain.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                COLLECTOR BIAS
              </span>
              <span className="text-blue-400 font-bold text-sm sm:text-base">
                {collectorBiasVolts} V
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
              Point-Contact Bias Controls
            </span>

            {/* Emitter Current Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Emitter Forward Current ($I_e$)
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {emitterCurrentMa.toFixed(1)} mA
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="5.0"
                step="0.2"
                value={emitterCurrentMa}
                onChange={(e) => setEmitterCurrentMa(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Contact Spacing Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Point-Contact Gap Distance ($d$)
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {contactGapMicrons} µm
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                step="5"
                value={contactGapMicrons}
                onChange={(e) => setContactGapMicrons(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-ink-950 dark:text-parchment-100 text-xs sm:text-sm font-sans space-y-1.5">
              <span className="font-bold text-amber-900 dark:text-amber-300 block font-mono text-xs uppercase tracking-wider">
                Discovery of Hole Injection:
              </span>
              <p className="leading-relaxed">
                Walter Brattain cut a strip of gold foil glued to a plastic wedge with a razor
                blade, creating two contacts separated by 50 µm. Forward-biasing the emitter
                injected positive &ldquo;holes&rdquo; into the n-type crystal surface, modulating
                the reverse-biased collector current and birthing the semiconductor age.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
