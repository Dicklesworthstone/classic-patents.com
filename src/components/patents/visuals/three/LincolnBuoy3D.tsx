"use client";

import { Anchor } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

export function LincolnBuoy3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Marine Hydrostatic State Controls
  const [bellowsInflationPct, setBellowsInflationPct] = useState<number>(75); // 0 to 100%
  const [steamboatWeightTons, setSteamboatWeightTons] = useState<number>(380); // 200 to 600 tons
  const [riverShoalDepthFt, setRiverShoalDepthFt] = useState<number>(5.5); // 3 to 12 ft
  const [_isSteamWinchOperating, _setIsSteamWinchOperating] = useState<boolean>(true);

  // Hydrostatic Buoyancy Physics (Archimedes' Principle)
  // Base Hull Draft: T_0 = Weight / (Area * rho_water)
  const hullLengthFt = 160;
  const hullBeamFt = 32;
  const waterDensityLbsPerCuFt = 62.4;
  const hullWaterplaneAreaSqFt = hullLengthFt * hullBeamFt * 0.78; // Block coefficient ~0.78
  const baseDraftFt =
    (steamboatWeightTons * 2000) / (hullWaterplaneAreaSqFt * waterDensityLbsPerCuFt);

  // Expandable Bellows Displaced Volume: V_b = 2 * (L * H * W) * Inflation%
  const maxBellowsDisplacedCuFt = 2 * (120 * 4.5 * 3.5); // 3,780 cu ft
  const activeBellowsBuoyancyLbs =
    (bellowsInflationPct / 100) * maxBellowsDisplacedCuFt * waterDensityLbsPerCuFt;
  const netLiftTons = Math.round(activeBellowsBuoyancyLbs / 2000);
  const effectiveDraftFt = Math.max(
    1.8,
    baseDraftFt - activeBellowsBuoyancyLbs / (hullWaterplaneAreaSqFt * waterDensityLbsPerCuFt),
  );
  const underKeelClearanceFt = (riverShoalDepthFt - effectiveDraftFt).toFixed(2);
  const isAground = Number(underKeelClearanceFt) <= 0;

  const live = useLiveSimParams({
    bellowsInflationPct,
    riverShoalDepthFt,
    baseDraftFt,
    effectiveDraftFt,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with High-Luminosity Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [14, 10, 16],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const hullWoodMat = new THREE.MeshStandardMaterial({
      color: 0x78350f, // White oak timber steamboat hull
      roughness: 0.45,
      metalness: 0.1,
    });

    const cabinWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc, // Painted passenger deckhouse cabins
      roughness: 0.35,
      metalness: 0.05,
    });

    const bellowsRubberMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // Rubberized waterproof canvas bellows
      roughness: 0.6,
      metalness: 0.2,
    });

    const riverWaterMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7, // Mississippi river water surface
      transmission: 0.75,
      opacity: 0.8,
      transparent: true,
      roughness: 0.1,
      ior: 1.333,
    });

    // --- 3D STEAMBOAT & LINCOLN BELLOWS ASSEMBLY ---
    const boatGroup = new THREE.Group();
    scene.add(boatGroup);

    // Western River Steamboat Hull with Rake Bow
    const hullShape = new THREE.Shape();
    hullShape.moveTo(-8.0, 0.8);
    hullShape.lineTo(7.5, 0.8);
    hullShape.lineTo(6.8, -0.9);
    hullShape.lineTo(-6.8, -0.9);
    hullShape.closePath();

    const hullGeo = new THREE.ExtrudeGeometry(hullShape, { depth: 4.6, bevelEnabled: false });
    hullGeo.center();
    const hull = new THREE.Mesh(hullGeo, hullWoodMat);
    hull.position.y = 0;
    hull.castShadow = true;
    hull.receiveShadow = true;
    boatGroup.add(hull);

    // Outrigger Guards Extending over Hull Sides
    const guardDeck = new THREE.Mesh(new THREE.BoxGeometry(15.2, 0.15, 6.8), hullWoodMat);
    guardDeck.position.y = 0.85;
    guardDeck.castShadow = true;
    boatGroup.add(guardDeck);

    // Multi-Deck Passenger Cabins & Hurricane Deck
    const lowerCabin = new THREE.Mesh(new THREE.BoxGeometry(10.5, 1.2, 3.8), cabinWhiteMat);
    lowerCabin.position.set(-0.8, 1.5, 0);
    lowerCabin.castShadow = true;
    boatGroup.add(lowerCabin);

    const texasDeck = new THREE.Mesh(new THREE.BoxGeometry(7.5, 1.0, 2.8), cabinWhiteMat);
    texasDeck.position.set(-0.8, 2.6, 0);
    texasDeck.castShadow = true;
    boatGroup.add(texasDeck);

    // Octagonal Pilothouse
    const pilotHouse = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 1.1, 8), cabinWhiteMat);
    pilotHouse.position.set(-3.2, 3.65, 0);
    pilotHouse.castShadow = true;
    boatGroup.add(pilotHouse);

    // Twin Fluted Smoke Stacks with Feathered Tops
    [-1.0, 1.0].forEach((sz) => {
      const stack = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.28, 4.8, 16),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.35, metalness: 0.85 }),
      );
      stack.position.set(-2.0, 4.2, sz);
      stack.castShadow = true;
      boatGroup.add(stack);

      // Feathered Crown Ring
      const crown = new THREE.Mesh(
        new THREE.TorusGeometry(0.36, 0.08, 8, 16),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 }),
      );
      crown.rotation.x = Math.PI / 2;
      crown.position.set(-2.0, 6.6, sz);
      boatGroup.add(crown);
    });

    // Stern Paddle Wheel with Radial Wooden Buckets
    const paddleWheelGroup = new THREE.Group();
    paddleWheelGroup.position.set(8.2, 0.4, 0);

    const pShaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 4.6, 12),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9 }),
    );
    pShaft.rotation.x = Math.PI / 2;
    paddleWheelGroup.add(pShaft);

    for (let p = 0; p < 12; p++) {
      const pAngle = (p * Math.PI * 2) / 12;
      const bucket = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.55, 4.4),
        new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.45 }),
      );
      bucket.position.set(Math.cos(pAngle) * 1.6, Math.sin(pAngle) * 1.6, 0);
      bucket.rotation.z = pAngle;
      paddleWheelGroup.add(bucket);
    }
    boatGroup.add(paddleWheelGroup);

    // --- LINCOLN'S EXPANDABLE PLEATED ACCORDION BELLOWS (PORT & STARBOARD) ---
    // Multi-Pleat Accordion Geometry (Chambers A & B)
    const createPleatedBellows = (isStarboard: boolean) => {
      const bellowsG = new THREE.Group();
      bellowsG.position.set(-0.5, -0.3, isStarboard ? 2.8 : -2.8);

      // Upper fixed attachment board
      const topBoard = new THREE.Mesh(new THREE.BoxGeometry(11.2, 0.12, 1.3), hullWoodMat);
      topBoard.position.y = 0.65;
      bellowsG.add(topBoard);

      // Accordion Pleated Rubber Skin
      const pleatCount = 6;
      for (let p = 0; p < pleatCount; p++) {
        const pleat = new THREE.Mesh(new THREE.BoxGeometry(11.0, 0.22, 1.25), bellowsRubberMat);
        pleat.position.y = 0.5 - p * 0.22;
        pleat.castShadow = true;
        bellowsG.add(pleat);
      }

      // Lower movable sliding board pushed down into water
      const bottomBoard = new THREE.Mesh(new THREE.BoxGeometry(11.2, 0.15, 1.3), hullWoodMat);
      bottomBoard.position.y = -0.9;
      bellowsG.add(bottomBoard);

      // Vertical Guide Rods & Ropes (Lincoln Shaft C, Ropes D, Pulleys E)
      for (let r = 0; r < 4; r++) {
        const guideRod = new THREE.Mesh(
          new THREE.CylinderGeometry(0.04, 0.04, 2.2, 8),
          new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 }),
        );
        guideRod.position.set(-4.5 + r * 3.0, 0, 0);
        bellowsG.add(guideRod);
      }

      return bellowsG;
    };

    const bellowsPort = createPleatedBellows(false);
    const bellowsStarboard = createPleatedBellows(true);
    bellowsPort.name = "bellowsPort";
    bellowsStarboard.name = "bellowsStarboard";
    boatGroup.add(bellowsPort);
    boatGroup.add(bellowsStarboard);

    // Steam Windlass Shaft & Pulleys
    const winchShaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 11.5, 12),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.2, metalness: 0.9 }),
    );
    winchShaft.position.set(-0.5, 0.9, 0);
    winchShaft.rotation.z = Math.PI / 2;
    boatGroup.add(winchShaft);

    // --- RIVER WATER LEVEL SURFACE & SHOAL SANDBAR ---
    const waterPlane = new THREE.Mesh(new THREE.PlaneGeometry(36, 36, 32, 32), riverWaterMat);
    waterPlane.rotation.x = -Math.PI / 2;
    waterPlane.position.y = -0.4;
    scene.add(waterPlane);

    // Underwater Shoal Sandbar (Kill Devil Hills / Sangamon River sand)
    const sandBar = new THREE.Mesh(
      new THREE.BoxGeometry(32, 1.2, 32),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.85 }),
    );
    sandBar.position.y = -2.6;
    sandBar.receiveShadow = true;
    scene.add(sandBar);

    // --- RENDER LOOP & REAL-TIME HYDROSTATIC DYNAMICS ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const p = live.current;

      // Dynamic Shoal Sandbar Depth
      sandBar.position.y = -0.4 - p.riverShoalDepthFt * 0.4;

      // Dynamic Bellows Expansion / Contraction
      const scaleZ = 0.2 + (p.bellowsInflationPct / 100) * 1.4;
      bellowsPort.scale.z = scaleZ;
      bellowsStarboard.scale.z = scaleZ;

      // Hydrostatic Hull Floating Height (Draft Equilibrium)
      const targetY = (p.baseDraftFt - p.effectiveDraftFt) * 0.35 + Math.sin(elapsed * 1.5) * 0.06;
      boatGroup.position.y += (targetY - boatGroup.position.y) * 0.1;
      boatGroup.rotation.z = Math.sin(elapsed * 1.2) * 0.015;

      // Rotate Paddle Wheel
      paddleWheelGroup.rotation.z += delta * 3.0;

      // Water Ripple Oscillation
      waterPlane.position.y = -0.4 + Math.sin(elapsed * 2.0) * 0.04;

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
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
            <div className="text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Anchor className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              Lincoln Marine Buoyancy Telemetry
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs font-sans">
              <div>
                <span className="text-ink-600 dark:text-ink-400">Effective Draft:</span>{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {effectiveDraftFt.toFixed(2)} ft (was {baseDraftFt.toFixed(2)} ft)
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Active Lift:</span>{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  +{netLiftTons} Tons Displaced
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Under-Keel Clearance:</span>{" "}
                <span
                  className={`font-bold ${
                    !isAground
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {underKeelClearanceFt} ft ({!isAground ? "Navigable" : "Grounded on Shoal"})
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Shoal Water Depth:</span>{" "}
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {riverShoalDepthFt.toFixed(1)} ft
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                !isAground ? "bg-emerald-500 animate-pulse" : "bg-red-500"
              }`}
            />
            <span>
              {!isAground
                ? "Abraham Lincoln US 6,281: Bellows Displace Shoal Water to Float Free"
                : "Keel Stranded on Mississippi River Shoal (Increase Inflation)"}
            </span>
          </div>
        </div>

        {/* Inflation Quick-Set */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            type="button"
            onClick={() => setBellowsInflationPct(bellowsInflationPct > 50 ? 0 : 100)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
              bellowsInflationPct > 50
                ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            {bellowsInflationPct > 50 ? "Deflate Bellows" : "Inflate Bellows"}
          </button>
        </div>
      </div>

      {/* Parameter Sliders Panel */}
      <div className="p-4 sm:p-5 bg-parchment-100/80 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
        {/* Bellows Inflation */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Bellows Air Volume:</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">
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
            className="w-full accent-amber-600 dark:accent-amber-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Displaces water to reduce total boat draft
          </span>
        </div>

        {/* Vessel Cargo Displacement */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Vessel Cargo Weight:</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {steamboatWeightTons} Tons
            </span>
          </div>
          <input
            type="range"
            min="200"
            max="600"
            step="20"
            value={steamboatWeightTons}
            onChange={(e) => setSteamboatWeightTons(Number(e.target.value))}
            className="w-full accent-blue-600 dark:accent-blue-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Steamboat gross deadweight tonnage
          </span>
        </div>

        {/* Shoal River Depth */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>{"River Shoal Depth ($h_{sand}$):"}</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {riverShoalDepthFt.toFixed(1)} ft
            </span>
          </div>
          <input
            type="range"
            min="3.0"
            max="10.0"
            step="0.5"
            value={riverShoalDepthFt}
            onChange={(e) => setRiverShoalDepthFt(Number(e.target.value))}
            className="w-full accent-emerald-600 dark:accent-emerald-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Water depth over Sangamon / Mississippi river bars
          </span>
        </div>

        {/* Buoyancy Lift Safety Margin */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Shoal Clearance Margin:</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              {Number(underKeelClearanceFt) > 0 ? `+${underKeelClearanceFt} ft OK` : "GROUNDED"}
            </span>
          </div>
          <div className="w-full bg-parchment-300 dark:bg-ink-800 rounded-full h-3 overflow-hidden mt-2 border border-parchment-400 dark:border-ink-700">
            <div
              className={`h-full transition-all duration-300 ${
                !isAground ? "bg-gradient-to-r from-blue-500 to-emerald-500" : "bg-red-500"
              }`}
              style={{
                width: `${Math.max(10, Math.min(100, (Number(underKeelClearanceFt) + 2) * 25))}%`,
              }}
            />
          </div>
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Only U.S. President to hold a technical patent
          </span>
        </div>
      </div>
    </div>
  );
}
