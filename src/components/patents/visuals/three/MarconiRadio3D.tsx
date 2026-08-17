"use client";

import { Radio } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createThreeStudioScene } from "./ThreeStudioScene";

export function MarconiRadio3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Radio Parameters
  const [carrierKhz, _setCarrierKhz] = useState<number>(350); // 100 to 1000 kHz
  const [sparkGapMm, setSparkGapMm] = useState<number>(12); // 4 to 25 mm
  const [aerialHeightMeters, setAerialHeightMeters] = useState<number>(30); // 10 to 60 m
  const [showWavefronts, setShowWavefronts] = useState<boolean>(true);
  const [_isPlayingAudio, _setIsPlayingAudio] = useState<boolean>(false);

  // Physics Calculations
  const breakdownVoltageKv = Math.round(sparkGapMm * 3.0); // Paschen's law ~3 kV/mm
  const wavelengthMeters = Math.round(300000 / carrierKhz);
  const radiationResistanceOhms = Math.round(
    40 * (Math.PI * (aerialHeightMeters / wavelengthMeters)) ** 2,
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with Museum Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [15, 12, 17],
      targetPos: [0, 0, 0],
      bgBottomColor: 0x0f172a,
      rimColor: 0x38bdf8,
      ambientIntensity: 1.3,
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const brassSpheresMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.95,
      roughness: 0.1,
    });

    const mastWoodMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.7,
      metalness: 0.1,
    });

    const aerialWireMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.95,
      roughness: 0.1,
    });

    const sparkPlasmaMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    // --- 3D MARCONI TRANSMITTER & RIGHI SPARK GAP ---
    const radioGroup = new THREE.Group();
    scene.add(radioGroup);

    // 1. Righi 4-Sphere Spark Gap Tank
    const sparkGroup = new THREE.Group();
    sparkGroup.position.set(-4, -2.5, 0);

    const sphere1 = new THREE.Mesh(new THREE.SphereGeometry(0.9, 24, 24), brassSpheresMat);
    sphere1.position.x = -1.2;
    const sphere2 = new THREE.Mesh(new THREE.SphereGeometry(0.9, 24, 24), brassSpheresMat);
    sphere2.position.x = 1.2;
    sparkGroup.add(sphere1);
    sparkGroup.add(sphere2);

    // Dynamic Electric Spark Plasma Flash
    const sparkFlash = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 2.0, 16),
      sparkPlasmaMat,
    );
    sparkFlash.rotation.z = Math.PI / 2;
    sparkGroup.add(sparkFlash);
    radioGroup.add(sparkGroup);

    // 2. Elevated Monopole Aerial Mast & Guy Wires
    const mastGroup = new THREE.Group();
    mastGroup.position.set(4, -3.0, 0);

    const woodMast = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 12, 16), mastWoodMat);
    woodMast.position.y = 6.0;
    mastGroup.add(woodMast);

    // Aerial Wire running up the mast
    const aerialLead = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 12, 8), aerialWireMat);
    aerialLead.position.set(0.4, 6.0, 0);
    mastGroup.add(aerialLead);

    // Earth Ground Copper Plate (Buried in soil)
    const groundPlate = new THREE.Mesh(
      new THREE.BoxGeometry(4.0, 0.2, 4.0),
      new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.8 }),
    );
    groundPlate.position.y = -0.1;
    mastGroup.add(groundPlate);

    radioGroup.add(mastGroup);

    // --- 3D RADIATING ELECTROMAGNETIC TOROIDAL WAVE SHELLS ---
    const shellCount = 6;
    const waveShells: THREE.Mesh[] = [];
    for (let i = 0; i < shellCount; i++) {
      const shell = new THREE.Mesh(
        new THREE.TorusGeometry(2.0, 0.15, 16, 48),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 }),
      );
      shell.position.set(4, 3.0, 0);
      shell.rotation.x = Math.PI / 2;
      waveShells.push(shell);
      scene.add(shell);
    }

    // --- ANIMATION & PHYSICS INTEGRATION LOOP ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      controls.update();

      // Spark Gap Flash Pulsing
      const sparkOn = Math.sin(time * 30.0) > 0.3;
      sparkFlash.visible = sparkOn;
      sparkFlash.scale.set(sparkOn ? 1.0 + Math.random() * 0.4 : 0.1, 1.0, 1.0);

      // Radiating Wave Propagation
      waveShells.forEach((shell, idx) => {
        shell.visible = showWavefronts;
        if (showWavefronts) {
          const progress = (time * 1.5 + idx / shellCount) % 1.0;
          const r = 0.5 + progress * 16.0;
          shell.scale.set(r, r, r);
          (shell.material as THREE.MeshBasicMaterial).opacity = (1.0 - progress) * 0.7;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      studio.dispose();
    };
  }, [showWavefronts]);

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Radio className="w-6 h-6 text-blue-500 animate-pulse" />
            <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50">
              3D Real-Time Marconi Wireless Telegraph &amp; Grounded Aerial Simulator (US 586,193)
            </h3>
          </div>
          <p className="text-sm sm:text-base text-ink-700 dark:text-ink-300 mt-1">
            Studio-illuminated Three.js electrodynamic simulation of{" "}
            <strong>elevated monopole antenna radiation</strong>, <strong>earth grounding</strong>,
            and <strong>spark-gap Hertzian waves</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-300 text-xs sm:text-sm font-mono font-bold border border-blue-300 dark:border-blue-800 shadow-2xs">
            {carrierKhz} kHz (λ: {wavelengthMeters} m)
          </div>
        </div>
      </div>

      {/* 3D WebGL Canvas & HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-[#0f172a] border border-parchment-300 dark:border-ink-800 relative min-h-[460px] overflow-hidden shadow-inner">
          {/* Top HUD */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none text-xs sm:text-sm font-mono">
            <div className="px-3.5 py-1.5 bg-ink-900/90 border border-ink-800 text-blue-300 rounded-xl shadow-md">
              Breakdown Potential: <span className="font-bold">{breakdownVoltageKv} kV</span> ·
              Radiation Resistance:{" "}
              <span className="text-emerald-300 font-bold">{radiationResistanceOhms} Ω</span>
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={() => setShowWavefronts(!showWavefronts)}
                className={`px-3 py-1 rounded-lg border text-xs font-mono transition-colors ${
                  showWavefronts
                    ? "bg-blue-600 text-white border-blue-500"
                    : "bg-ink-900 text-ink-400 border-ink-800"
                }`}
              >
                Wave Shells: {showWavefronts ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* 3D Canvas */}
          <div ref={containerRef} className="w-full h-[460px] cursor-grab active:cursor-grabbing" />

          {/* Bottom Telemetry */}
          <div className="w-full grid grid-cols-4 gap-3 text-center text-sm font-mono p-4 bg-ink-950/95 border-t border-ink-800 text-ink-300 z-10">
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                AERIAL HEIGHT
              </span>
              <span className="text-blue-400 font-bold text-sm sm:text-base">
                {aerialHeightMeters} m (Monopole)
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                SPARK GAP
              </span>
              <span className="text-amber-400 font-bold text-sm sm:text-base">{sparkGapMm} mm</span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                EARTH GROUND
              </span>
              <span className="text-emerald-400 font-bold text-sm sm:text-base">
                Buried Plate (Active)
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
              Wireless Aerial Parameters
            </span>

            {/* Spark Gap Distance Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  {"Spark Gap Separation ($d_{gap}$)"}
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {sparkGapMm} mm
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="25"
                step="1"
                value={sparkGapMm}
                onChange={(e) => setSparkGapMm(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Aerial Mast Height Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Aerial Monopole Height ($h$)
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {aerialHeightMeters} m
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={aerialHeightMeters}
                onChange={(e) => setAerialHeightMeters(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-ink-950 dark:text-parchment-100 text-xs sm:text-sm font-sans space-y-1.5">
              <span className="font-bold text-blue-900 dark:text-blue-300 block font-mono text-xs uppercase tracking-wider">
                Marconi&apos;s Grounding Breakthrough:
              </span>
              <p className="leading-relaxed">
                Prior physicists (Hertz, Branly) tested small dipole antennas over tabletop
                distances. Guglielmo Marconi discovered that grounding one terminal in the Earth and
                elevating the other high into the sky dramatically increased radiated power and
                transmission distance from yards to miles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
