"use client";

import { Ship } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createThreeStudioScene } from "./ThreeStudioScene";

export function LincolnBuoy3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Buoyancy Parameters
  const [bellowsInflationPct, setBellowsInflationPct] = useState<number>(75); // 0 to 100%
  const [cargoTons, setCargoTons] = useState<number>(120); // 50 to 200 tons
  const [riverDepthFt, setRiverDepthFt] = useState<number>(4.2); // 2 to 8 ft

  // Archimedes Hydrostatic Buoyancy Calculations
  const hullBaseDraftFt = 3.5 + cargoTons / 60;
  const maxDisplacedVolumeCuFt = 6000;
  const bellowsDisplacedCuFt = (bellowsInflationPct / 100) * maxDisplacedVolumeCuFt;
  const buoyantLiftTons = Math.round((bellowsDisplacedCuFt * 62.4) / 2000);
  const effectiveDraftFt = Math.max(1.8, hullBaseDraftFt - buoyantLiftTons / 50);
  const clearanceFt = (riverDepthFt - effectiveDraftFt).toFixed(1);
  const isAground = Number(clearanceFt) < 0;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with Museum Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [16, 12, 18],
      targetPos: [0, 0, 0],
      bgBottomColor: 0x0f172a,
      rimColor: 0x38bdf8,
      ambientIntensity: 1.3,
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const woodHullMat = new THREE.MeshStandardMaterial({
      color: 0x78350f, // White oak timber hull
      roughness: 0.65,
      metalness: 0.1,
    });

    const cabinWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.5,
      metalness: 0.05,
    });

    const bellowsRubberMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // India rubberized waterproof canvas
      roughness: 0.4,
      metalness: 0.2,
    });

    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x0369a1,
      transmission: 0.8,
      opacity: 0.7,
      transparent: true,
      roughness: 0.1,
      ior: 1.33,
    });

    const ironSmokestackMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.4,
      metalness: 0.9,
    });

    // --- 3D STEAMBOAT HULL & BELLOWS ASSEMBLY ---
    const vesselGroup = new THREE.Group();
    scene.add(vesselGroup);

    // Main Flat-bottom Steamboat Hull
    const hull = new THREE.Mesh(new THREE.BoxGeometry(18, 2.0, 7.0), woodHullMat);
    hull.position.y = 0;
    hull.castShadow = true;
    vesselGroup.add(hull);

    // Bow (Front Curved Chime)
    const bow = new THREE.Mesh(new THREE.ConeGeometry(3.5, 4.0, 4), woodHullMat);
    bow.rotation.z = Math.PI / 2;
    bow.position.set(10.5, 0, 0);
    bow.scale.set(0.5, 1.0, 1.0);
    vesselGroup.add(bow);

    // Superstructure Wooden Cabins
    const cabinLower = new THREE.Mesh(new THREE.BoxGeometry(12, 1.8, 5.5), cabinWhiteMat);
    cabinLower.position.set(-1.0, 1.8, 0);
    vesselGroup.add(cabinLower);

    const texasDeck = new THREE.Mesh(new THREE.BoxGeometry(7.0, 1.4, 4.0), cabinWhiteMat);
    texasDeck.position.set(-1.5, 3.2, 0);
    vesselGroup.add(texasDeck);

    const pilotHouse = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.6, 2.5), cabinWhiteMat);
    pilotHouse.position.set(1.5, 4.5, 0);
    vesselGroup.add(pilotHouse);

    // Twin Iron Smokestacks
    const stack1 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 6.0, 16), ironSmokestackMat);
    stack1.position.set(1.0, 4.8, 1.4);
    vesselGroup.add(stack1);

    const stack2 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 6.0, 16), ironSmokestackMat);
    stack2.position.set(1.0, 4.8, -1.4);
    vesselGroup.add(stack2);

    // Side Paddlewheel Boxes
    const wheelBoxL = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 1.0, 24), woodHullMat);
    wheelBoxL.rotation.x = Math.PI / 2;
    wheelBoxL.position.set(-2.0, 0.6, 4.0);
    vesselGroup.add(wheelBoxL);

    const wheelBoxR = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 1.0, 24), woodHullMat);
    wheelBoxR.rotation.x = Math.PI / 2;
    wheelBoxR.position.set(-2.0, 0.6, -4.0);
    vesselGroup.add(wheelBoxR);

    // Expandable Waterproof Buoyancy Air Bellows (Port and Starboard)
    const bellowsPort = new THREE.Mesh(new THREE.BoxGeometry(14, 1.6, 2.2), bellowsRubberMat);
    bellowsPort.position.set(-1.0, -0.6, 4.4);
    bellowsPort.castShadow = true;
    vesselGroup.add(bellowsPort);

    const bellowsStbd = new THREE.Mesh(new THREE.BoxGeometry(14, 1.6, 2.2), bellowsRubberMat);
    bellowsStbd.position.set(-1.0, -0.6, -4.4);
    bellowsStbd.castShadow = true;
    vesselGroup.add(bellowsStbd);

    // River Water Plane
    const riverWater = new THREE.Mesh(new THREE.PlaneGeometry(36, 36), waterMat);
    riverWater.rotation.x = -Math.PI / 2;
    riverWater.position.y = -0.5;
    scene.add(riverWater);

    // Riverbed Sand Shoal
    const shoalBed = new THREE.Mesh(
      new THREE.PlaneGeometry(36, 36),
      new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.9 }),
    );
    shoalBed.rotation.x = -Math.PI / 2;
    shoalBed.position.y = -4.0;
    scene.add(shoalBed);

    // --- ANIMATION & PHYSICS INTEGRATION LOOP ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      controls.update();

      // Expand/contract rubber buoyancy bellows dynamically
      const inflateFrac = Math.max(0.15, bellowsInflationPct / 100);
      bellowsPort.scale.set(1.0, inflateFrac, inflateFrac * 1.4);
      bellowsStbd.scale.set(1.0, inflateFrac, inflateFrac * 1.4);

      // Hydrostatic Buoyant Float Height
      const draftOffset = (effectiveDraftFt - 3.5) * 0.4;
      const waveBob = Math.sin(time * 2.0) * 0.1;
      vesselGroup.position.y = -draftOffset + waveBob;

      // Riverbed height based on depth parameter
      shoalBed.position.y = -0.5 - riverDepthFt * 0.5;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      studio.dispose();
    };
  }, [bellowsInflationPct, riverDepthFt, effectiveDraftFt]);

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Ship className="w-6 h-6 text-blue-500 animate-pulse" />
            <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50">
              3D Real-Time Abraham Lincoln Buoyancy Steamboat Simulator (US 6,281)
            </h3>
          </div>
          <p className="text-sm sm:text-base text-ink-700 dark:text-ink-300 mt-1">
            Studio-illuminated Three.js hydrostatic simulation of{" "}
            <strong>expandable rubberized buoyancy bellows</strong> lifting a Mississippi steamboat
            over shallow sandbars.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-mono font-bold border shadow-2xs ${
              !isAground
                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                : "bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-300 border-red-300 dark:border-red-800"
            }`}
          >
            {!isAground ? `Clearance: +${clearanceFt} ft (AFLOAT)` : `GROUNDED (${clearanceFt} ft)`}
          </div>
        </div>
      </div>

      {/* 3D WebGL Canvas & HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-[#0f172a] border border-parchment-300 dark:border-ink-800 relative min-h-[460px] overflow-hidden shadow-inner">
          {/* Top HUD */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none text-xs sm:text-sm font-mono">
            <div className="px-3.5 py-1.5 bg-ink-900/90 border border-ink-800 text-blue-300 rounded-xl shadow-md">
              Buoyancy Lift: <span className="font-bold">{buoyantLiftTons} tons</span> · Effective
              Draft:{" "}
              <span className="text-emerald-300 font-bold">{effectiveDraftFt.toFixed(1)} ft</span>
            </div>
          </div>

          {/* 3D Canvas */}
          <div ref={containerRef} className="w-full h-[460px] cursor-grab active:cursor-grabbing" />

          {/* Bottom Telemetry */}
          <div className="w-full grid grid-cols-4 gap-3 text-center text-sm font-mono p-4 bg-ink-950/95 border-t border-ink-800 text-ink-300 z-10">
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                BELLOWS INFLATION
              </span>
              <span className="text-blue-400 font-bold text-sm sm:text-base">
                {bellowsInflationPct}%
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                CARGO LOAD
              </span>
              <span className="text-amber-400 font-bold text-sm sm:text-base">
                {cargoTons} tons
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                SHOAL DEPTH
              </span>
              <span className="text-emerald-400 font-bold text-sm sm:text-base">
                {riverDepthFt.toFixed(1)} ft
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
              Buoyancy Shaft Controls
            </span>

            {/* Bellows Inflation Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Buoyancy Bellows Inflation
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {bellowsInflationPct}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={bellowsInflationPct}
                onChange={(e) => setBellowsInflationPct(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Cargo Load Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  {"Steamboat Cargo Weight ($M_{cargo}$)"}
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {cargoTons} tons
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                step="10"
                value={cargoTons}
                onChange={(e) => setCargoTons(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* River Depth Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  {"Shoal Water Depth ($h_{river}$)"}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {riverDepthFt.toFixed(1)} ft
                </span>
              </div>
              <input
                type="range"
                min="2.0"
                max="8.0"
                step="0.2"
                value={riverDepthFt}
                onChange={(e) => setRiverDepthFt(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-ink-950 dark:text-parchment-100 text-xs sm:text-sm font-sans space-y-1.5">
              <span className="font-bold text-blue-900 dark:text-blue-300 block font-mono text-xs uppercase tracking-wider">
                Lincoln&apos;s Presidential Patent:
              </span>
              <p className="leading-relaxed">
                Abraham Lincoln is the only U.S. President to hold a patent. After his riverboat
                stranded on a sandbar at New Salem, Illinois in 1831, he whittled a wooden model of
                expandable waterproof air chambers driven by the main steam engine windlass to float
                grounded vessels over shoals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
