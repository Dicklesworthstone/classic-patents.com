"use client";

import { Anchor, Camera, Eye, EyeOff, RotateCcw, Volume2, VolumeX, Waves, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { stepLincolnBuoy } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "bellows_chambers" | "pilothouse" | "paddlewheel" | "top";

export function LincolnBuoy3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Marine Hydrostatic State Controls
  const { params } = usePatentPhysics("us-6469-lincoln-buoy");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const bellowsInflationPct = params.inflationPct ?? 75;
  const steamboatWeightTons = params.weightTons ?? 380;
  const riverShoalDepthFt = params.shoalDepth ?? 3.5;
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const lincoln = stepLincolnBuoy({
    inflationPct: bellowsInflationPct,
    weightTons: steamboatWeightTons,
    shoalDepth: riverShoalDepthFt,
  });
  const hullLengthFt = 160;
  const hullBeamFt = 32;
  const waterDensityLbsPerCuFt = 62.4;
  const hullWaterplaneAreaSqFt = hullLengthFt * hullBeamFt * 0.78;
  const baseDraftFt = 5.0;

  const netLiftTons = Number((lincoln.liftKn / 9.81).toFixed(1));
  const effectiveDraftFt = Math.max(1.8, 5.0 - lincoln.draftReductionFt);
  const underKeelClearanceFt = lincoln.shoalClearanceFt.toFixed(2);
  const isAground = lincoln.shoalClearanceFt <= 0;

  const live = useLiveSimParams({
    bellowsInflationPct,
    riverShoalDepthFt,
    baseDraftFt,
    effectiveDraftFt,
    isAudioMuted,
    liftKn: lincoln.liftKn,
    shoalClearanceFt: lincoln.shoalClearanceFt,
  });

  const controlsRef = useRef<StudioContext["controls"] | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (preset) {
      case "iso":
        camera.position.set(14, 10, 16);
        controls.target.set(0, 0, 0);
        break;
      case "bellows_chambers":
        camera.position.set(0, -0.8, 6.5);
        controls.target.set(0, -0.5, 0);
        break;
      case "pilothouse":
        camera.position.set(-5.5, 5.0, 5.0);
        controls.target.set(-3.2, 3.5, 0);
        break;
      case "paddlewheel":
        camera.position.set(8.5, 1.2, 3.5);
        controls.target.set(6.8, 0, 0);
        break;
      case "top":
        camera.position.set(0, 13.0, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const toggleSound = () => {
    toggleEngine(() => {
      soundEngine.playSwitchClick();
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [14, 10, 16],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // --- PBR MATERIALS ---
    const hullWoodMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.45,
      metalness: 0.1,
    });

    const cabinWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.35,
      metalness: 0.05,
    });

    const bellowsRubberMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.6,
      metalness: 0.2,
    });

    const riverWaterMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      transmission: 0.75,
      opacity: 0.8,
      transparent: true,
      roughness: 0.1,
      ior: 1.333,
    });

    // --- 3D STEAMBOAT & LINCOLN BELLOWS ASSEMBLY ---
    const boatGroup = new THREE.Group();
    scene.add(boatGroup);

    // Hull
    const hullShape = new THREE.Shape();
    hullShape.moveTo(-8.0, 0.8);
    hullShape.lineTo(7.5, 0.8);
    hullShape.lineTo(6.8, -0.9);
    hullShape.lineTo(-6.8, -0.9);
    hullShape.closePath();

    const hullGeo = new THREE.ExtrudeGeometry(hullShape, { depth: 4.6, bevelEnabled: false });
    hullGeo.center();
    const hullPaint = hullWoodMat.clone();
    const hull = new THREE.Mesh(hullGeo, hullPaint);
    hull.position.y = 0;
    hull.castShadow = true;
    hull.receiveShadow = true;
    boatGroup.add(hull);

    // Outrigger Guards
    const guardDeck = new THREE.Mesh(new THREE.BoxGeometry(15.2, 0.15, 6.8), hullWoodMat);
    guardDeck.position.y = 0.85;
    guardDeck.castShadow = true;
    boatGroup.add(guardDeck);

    // Passenger Cabins
    const lowerCabin = new THREE.Mesh(new THREE.BoxGeometry(10.5, 1.2, 3.8), cabinWhiteMat);
    lowerCabin.position.set(-0.8, 1.5, 0);
    lowerCabin.castShadow = true;
    boatGroup.add(lowerCabin);

    const texasDeck = new THREE.Mesh(new THREE.BoxGeometry(7.5, 1.0, 2.8), cabinWhiteMat);
    texasDeck.position.set(-0.8, 2.6, 0);
    texasDeck.castShadow = true;
    boatGroup.add(texasDeck);

    // Pilothouse
    const pilotHouse = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 1.1, 8), cabinWhiteMat);
    pilotHouse.position.set(-3.2, 3.65, 0);
    pilotHouse.castShadow = true;
    boatGroup.add(pilotHouse);

    // Smoke Stacks
    [-1.0, 1.0].forEach((sz) => {
      const stack = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.28, 4.8, 16),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.35, metalness: 0.85 }),
      );
      stack.position.set(-2.0, 4.2, sz);
      stack.castShadow = true;
      boatGroup.add(stack);
    });

    // Stern Paddlewheel
    const paddleGroup = new THREE.Group();
    paddleGroup.position.set(7.5, 0.2, 0);

    [-1.8, 1.8].forEach((pz) => {
      const wheelRing = new THREE.Mesh(
        new THREE.TorusGeometry(1.6, 0.08, 8, 24),
        new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85 }),
      );
      wheelRing.position.z = pz;
      paddleGroup.add(wheelRing);
    });

    for (let b = 0; b < 12; b++) {
      const bAngle = (b * Math.PI * 2) / 12;
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.45, 3.4), hullWoodMat);
      blade.position.set(Math.cos(bAngle) * 1.5, Math.sin(bAngle) * 1.5, 0);
      blade.rotation.z = bAngle;
      paddleGroup.add(blade);
    }
    boatGroup.add(paddleGroup);

    // Abraham Lincoln's Expandable Air Bellows Chambers (Port & Starboard with Concertina Ribs)
    const makeBellowsAssembly = (zPos: number) => {
      const bGroup = new THREE.Group();
      bGroup.position.set(-0.5, -0.4, zPos);

      // Main Flexible Rubberized Canvas Chamber Body
      const bellowsBody = new THREE.Mesh(new THREE.BoxGeometry(11.0, 1.2, 1.0), bellowsRubberMat);
      bellowsBody.castShadow = true;
      bGroup.add(bellowsBody);

      // Concertina Folding Pleat Ribs (Elastic structural frames)
      for (let rib = 0; rib < 12; rib++) {
        const ribX = -5.0 + rib * 0.9;
        const ribMesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, 1.3, 1.08),
          new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 }),
        );
        ribMesh.position.set(ribX, 0, 0);
        bGroup.add(ribMesh);
      }

      // Vertical Rack Guide Rods (sliding through hull outriggers)
      for (let r = 0; r < 4; r++) {
        const rackX = -4.0 + r * 2.6;
        const rack = new THREE.Mesh(
          new THREE.CylinderGeometry(0.06, 0.06, 2.8, 12),
          new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 }),
        );
        rack.position.set(rackX, 0.8, 0);
        bGroup.add(rack);
      }

      boatGroup.add(bGroup);
      return bGroup;
    };

    const portBellows = makeBellowsAssembly(2.8);
    const stbdBellows = makeBellowsAssembly(-2.8);

    // Horizontal Synchronizing Gear Shafts across Deck (Claim 1 Rack-and-Pinion Drive)
    for (let s = 0; s < 4; s++) {
      const shaftX = -4.5 + s * 2.6;
      const crossShaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 6.2, 12),
        new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.85 }),
      );
      crossShaft.rotation.x = Math.PI / 2;
      crossShaft.position.set(shaftX, 1.1, 0);
      boatGroup.add(crossShaft);

      // Pinion Gears at Ends
      [-2.8, 2.8].forEach((gearZ) => {
        const pinion = new THREE.Mesh(
          new THREE.CylinderGeometry(0.24, 0.24, 0.2, 16),
          new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 }),
        );
        pinion.rotation.x = Math.PI / 2;
        pinion.position.set(shaftX, 1.1, gearZ);
        boatGroup.add(pinion);
      });
    }

    // River Water Plane & Sandbar Bed
    const waterMesh = new THREE.Mesh(new THREE.PlaneGeometry(36, 24), riverWaterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.y = 0.2;
    waterMesh.receiveShadow = true;
    scene.add(waterMesh);

    const sandbarMesh = new THREE.Mesh(
      new THREE.BoxGeometry(24, 0.8, 16),
      new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.9 }),
    );
    sandbarMesh.position.set(0, -2.8, 0);
    sandbarMesh.receiveShadow = true;
    scene.add(sandbarMesh);

    // --- RENDER LOOP & REAL-TIME HYDROSTATIC DYNAMICS ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;

      paddleGroup.rotation.z -= delta * (p.shoalClearanceFt > 0 ? 1.8 : 0.35);
      hullPaint.color.setHex(p.shoalClearanceFt > 0 ? 0x78350f : 0xf87171);

      const inflationScale = 0.3 + (p.bellowsInflationPct / 100) * 0.9;
      portBellows.scale.set(1.0, inflationScale, inflationScale);
      stbdBellows.scale.set(1.0, inflationScale, inflationScale);

      const targetBoatY = (6.0 - p.effectiveDraftFt) * 0.35 - 0.5;
      boatGroup.position.y += (targetBoatY - boatGroup.position.y) * 0.1;

      sandbarMesh.position.y = -p.riverShoalDepthFt * 0.35;

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
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-col gap-1.5 sm:gap-2 pointer-events-none max-w-[calc(100%-8rem)] sm:max-w-md transition-opacity duration-200">
            <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md p-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
              <div className="text-[10px] sm:text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Anchor className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 animate-pulse" />
                Hydrostatic Buoyancy Telemetry
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 sm:gap-y-1 mt-1 text-[10px] sm:text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Draft:</span>{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {effectiveDraftFt.toFixed(1)} ft · {hullWaterplaneAreaSqFt.toFixed(0)} ft² ·{" "}
                    {waterDensityLbsPerCuFt} lb/ft³
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Lift:</span>{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    +{netLiftTons} T Lift
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Depth:</span>{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {riverShoalDepthFt.toFixed(1)} ft
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Clearance:</span>{" "}
                  <span
                    className={`font-bold ${
                      isAground
                        ? "text-red-600 dark:text-red-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {underKeelClearanceFt} ft ({isAground ? "Aground" : "Clear"})
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 items-center gap-2 max-w-full">
              <Waves className="w-3.5 h-3.5 text-blue-500 animate-pulse shrink-0" />
              <span className="truncate">Abraham Lincoln (US 6,469) — Buoying Vessels (1849)</span>
            </div>
          </div>
        )}

        {/* Top Right Tool Bar (Toggle UI, Audio, Pins, Reset) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showUiOverlay
                ? "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
                : "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
            }`}
            title={showUiOverlay ? "Hide Overlay UI (Clean 3D View)" : "Show Overlay UI"}
            aria-label={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
          >
            {showUiOverlay ? (
              <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
          <button
            aria-label={isAudioMuted ? "Unmute simulation audio" : "Mute simulation audio"}
            type="button"
            onClick={toggleSound}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isAudioMuted ? "Enable Sound" : "Mute Sound"}
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            )}
          </button>
          <button
            aria-label={showCalloutPins ? "Hide annotation pins" : "Show annotation pins"}
            type="button"
            onClick={() => setShowCalloutPins(!showCalloutPins)}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showCalloutPins
                ? "bg-amber-600 text-white border-amber-700 shadow-md"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title="Toggle Historical Patent Numeral Pins"
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Camera Views Bar */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-1.5rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["bellows_chambers", "Air Bellows"],
                ["pilothouse", "Pilothouse"],
                ["paddlewheel", "Paddlewheel"],
                ["top", "Plan View"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => applyCameraPreset(id)}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-sans whitespace-nowrap shrink-0 transition-colors ${
                  activeCamera === id
                    ? "bg-amber-700 dark:bg-amber-600 text-white font-semibold shadow-xs"
                    : "text-ink-700 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
