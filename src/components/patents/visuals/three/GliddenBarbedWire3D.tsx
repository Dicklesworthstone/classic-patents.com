"use client";

import { Activity, Camera, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "barb_lock" | "twisting_helix" | "takeup_drum" | "top";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  machineRpm: number;
  barbSpacingInches: number;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "glidden_1874_winner",
    name: "1874 Glidden 'The Winner' Barbed Wire",
    desc: "Joseph Glidden's iconic design: 2-point wire barbs coiled around one strand and locked in place by a second twisted strand (US 157,124).",
    machineRpm: 120,
    barbSpacingInches: 5.0,
  },
  {
    id: "cattle_ranch_heavy",
    name: "Texas Longhorn Heavy Defense (3-Inch)",
    desc: "Dense 3-inch barb pitch with high tensile galvanization resisting 4.5 kN cattle herd impact.",
    machineRpm: 90,
    barbSpacingInches: 3.0,
  },
  {
    id: "high_speed_spooling",
    name: "Industrial High-Speed Spooling",
    desc: "240 RPM continuous factory flyer twisting over 80 feet of barbed wire per minute.",
    machineRpm: 240,
    barbSpacingInches: 6.0,
  },
];

export function GliddenBarbedWire3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Wire Manufacturing Parameters
  const { params, updateParam } = usePatentPhysics("us-157124-glidden-barbed-wire");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const machineRpm = params.machineRpm ?? 120;
  const barbSpacingInches = params.barbSpacingInches ?? 5.0;
  const feetPerMinute = ((machineRpm * barbSpacingInches) / 12).toFixed(1);
  const tensileStrengthLbs = 950;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    machineRpm,
    barbSpacingInches,
    isAudioMuted,
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
        camera.position.set(9.5, 6.5, 10.5);
        controls.target.set(0, 0, 0);
        break;
      case "barb_lock":
        camera.position.set(0, 1.2, 3.2);
        controls.target.set(0, 0.4, 0);
        break;
      case "twisting_helix":
        camera.position.set(-2.5, 1.8, 3.5);
        controls.target.set(-1.0, 0, 0);
        break;
      case "takeup_drum":
        camera.position.set(3.5, 2.0, 4.0);
        controls.target.set(2.2, 0, 0);
        break;
      case "top":
        camera.position.set(0, 11.5, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const applyScenario = (s: ScenarioPreset) => {
    updateParam("machineRpm", s.machineRpm);
    if (!isAudioMuted) {
      soundEngine.playSwitchClick();
    }
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
      cameraPos: [9.5, 6.5, 10.5],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Materials
    const castIronMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.85,
    });

    const galvanizedSteelMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.2,
      metalness: 0.95,
    });

    const walnutWoodMat = new THREE.MeshStandardMaterial({
      color: 0x5c2c16,
      roughness: 0.6,
      metalness: 0.05,
    });

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Heavy Wooden Workshop Bench & Cast Iron Bed
    const bench = new THREE.Mesh(new THREE.BoxGeometry(11.0, 0.8, 5.5), walnutWoodMat);
    bench.position.y = -2.2;
    bench.receiveShadow = true;
    rootGroup.add(bench);

    // 2. Dual Feed Spools (Raw Wire Inflow)
    [-3.8, -3.8].forEach((sx, idx) => {
      const spool = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.6, 24), castIronMat);
      spool.rotation.z = Math.PI / 2;
      spool.position.set(sx, idx === 0 ? 0.8 : -0.8, -1.2);
      rootGroup.add(spool);
    });

    // 3. Rotating Twister Flyer Arbor (Claim 1)
    const flyerGroup = new THREE.Group();
    flyerGroup.position.set(-1.8, 0, 0);
    rootGroup.add(flyerGroup);

    const flyerRing = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.12, 12, 32), castIronMat);
    flyerRing.rotation.y = Math.PI / 2;
    flyerGroup.add(flyerRing);

    // 4. Barbed Wire Twisting Helical Model (Claim 1 & Claim 2)
    const wireAssemblyGroup = new THREE.Group();
    rootGroup.add(wireAssemblyGroup);

    // Double-Strand Twisted Wire
    const strand1Curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-3.2, 0.1, 0),
      new THREE.Vector3(-1.0, 0.15, 0.1),
      new THREE.Vector3(1.0, 0.1, -0.1),
      new THREE.Vector3(3.2, 0.1, 0),
    ]);
    const strand1Geo = new THREE.TubeGeometry(strand1Curve, 40, 0.04, 8, false);
    const strand1Mesh = new THREE.Mesh(strand1Geo, galvanizedSteelMat);
    wireAssemblyGroup.add(strand1Mesh);

    const strand2Curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-3.2, -0.1, 0),
      new THREE.Vector3(-1.0, -0.15, -0.1),
      new THREE.Vector3(1.0, -0.1, 0.1),
      new THREE.Vector3(3.2, -0.1, 0),
    ]);
    const strand2Geo = new THREE.TubeGeometry(strand2Curve, 40, 0.04, 8, false);
    const strand2Mesh = new THREE.Mesh(strand2Geo, galvanizedSteelMat);
    wireAssemblyGroup.add(strand2Mesh);

    // 5 Discrete 2-Point Diamond Barbs Coiled Around Strand 1 (Claim 2)
    const barbCount = 5;
    for (let b = 0; b < barbCount; b++) {
      const bx = -2.2 + b * 1.1;
      const barbGroup = new THREE.Group();
      barbGroup.position.set(bx, 0, 0);

      // Coiled Wire Loop
      const coil = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.035, 8, 16), galvanizedSteelMat);
      barbGroup.add(coil);

      // Sharp Diamond Spurs (2 Points)
      [-1, 1].forEach((dir) => {
        const spur = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.35, 4), galvanizedSteelMat);
        spur.position.set(0, dir * 0.22, dir * 0.15);
        spur.rotation.x = (dir * Math.PI) / 4;
        barbGroup.add(spur);
      });

      wireAssemblyGroup.add(barbGroup);
    }

    // 5. Take-Up Reel Drum (Winding Finished Wire)
    const reelGroup = new THREE.Group();
    reelGroup.position.set(3.5, 0, 0);
    rootGroup.add(reelGroup);

    const reelHub = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.4, 24), walnutWoodMat);
    reelHub.rotation.z = Math.PI / 2;
    reelGroup.add(reelHub);

    [-0.7, 0.7].forEach((rx) => {
      const flange = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.12, 24), castIronMat);
      flange.rotation.z = Math.PI / 2;
      flange.position.x = rx;
      reelGroup.add(flange);
    });

    // Animation Loop
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;

      const omegaRadPerSec = (p.machineRpm * 2 * Math.PI) / 60;
      flyerGroup.rotation.x += omegaRadPerSec * delta;
      reelGroup.rotation.x += omegaRadPerSec * 0.2 * delta;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      studio.cleanup();
    };
  }, [live.current]);

  return (
    <div className="relative w-full h-[620px] bg-parchment-900 rounded-2xl overflow-hidden border border-parchment-700 shadow-2xl flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-parchment-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            Glidden Barbed Wire Machine 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 157,124 (1874)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["barb_lock", "Barb Locking"],
              ["twisting_helix", "Flyer Helix"],
              ["takeup_drum", "Takeup Drum"],
              ["top", "Top"],
            ] as [CameraPreset, string][]
          ).map(([preset, label]) => (
            <button
              key={preset}
              type="button"
              onClick={() => applyCameraPreset(preset)}
              className={`px-2.5 py-1 text-xs font-sans rounded-lg transition-colors ${
                activeCamera === preset
                  ? "bg-amber-600 text-white font-semibold shadow-sm"
                  : "text-parchment-300 hover:text-white hover:bg-parchment-800/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            <Zap className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Bottom Telemetry Bar & Controls */}
      {showUiOverlay && (
        <div className="absolute bottom-4 left-4 right-4 bg-parchment-950/90 backdrop-blur-md rounded-2xl border border-parchment-700/70 p-4 shadow-2xl z-10 flex flex-col gap-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pb-2 border-b border-parchment-800/80 text-xs font-mono">
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Flyer Speed</span>
              <span className="font-bold text-amber-400">{machineRpm} RPM</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Spool Output Rate</span>
              <span className="font-bold text-blue-400">{feetPerMinute} ft/min</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Barb Pitch</span>
              <span className="font-bold text-emerald-400">{barbSpacingInches} Inches</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Tensile Strength</span>
              <span className="font-bold text-amber-300">{tensileStrengthLbs} lbs (4.2 kN)</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-mono text-parchment-400 flex items-center gap-1 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Presets:
              </span>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {SCENARIOS.map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => applyScenario(sc)}
                    className="px-2.5 py-1 text-xs font-sans rounded-lg bg-parchment-800/80 hover:bg-parchment-700 text-parchment-200 hover:text-white border border-parchment-600/50 transition-colors whitespace-nowrap"
                  >
                    {sc.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-72 shrink-0">
              <span className="text-xs font-sans text-parchment-300 shrink-0 font-medium">
                Flyer RPM:
              </span>
              <input
                type="range"
                min="60"
                max="300"
                step="10"
                value={machineRpm}
                onChange={(e) => updateParam("machineRpm", Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-mono text-amber-400 w-12 text-right font-bold">
                {machineRpm}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
