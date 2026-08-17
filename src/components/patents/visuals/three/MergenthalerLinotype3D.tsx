"use client";

import { Activity, Camera, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "matrix_magazine" | "casting_pot" | "spaceband_justifier" | "top";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  castingLpm: number;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "linotype_1886_ny_tribune",
    name: "1886 New York Tribune Linotype",
    desc: "Ottmar Mergenthaler's line-casting composing machine setting molten lead slugs 6× faster than hand composition (US 313,224).",
    castingLpm: 6.0,
  },
  {
    id: "newspaper_deadline_rush",
    name: "Newspaper Deadline Rush (8 LPM)",
    desc: "High-speed continuous line assembly with automated spaceband justification and matrix distribution.",
    castingLpm: 8.0,
  },
  {
    id: "slow_matrix_circulation",
    name: "Matrix Circulation Cycle Breakdown",
    desc: "Slow motion demonstrating gravity matrix descent, metal pot injection, and V-notch binary distributor sorting.",
    castingLpm: 3.0,
  },
];

export function MergenthalerLinotype3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Linotype Mechanical Composing Parameters
  const { params, updateParam } = usePatentPhysics("us-313224-mergenthaler-linotype");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const castingLpm = params.castingLpm ?? 6.0;
  const potTempC = 280; // Lead-tin-antimony alloy
  const charsPerLine = 42;
  const charsPerHour = Math.round(castingLpm * charsPerLine * 60);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    castingLpm,
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
        camera.position.set(11.0, 8.5, 12.5);
        controls.target.set(0, 0, 0);
        break;
      case "matrix_magazine":
        camera.position.set(0, 3.5, 3.8);
        controls.target.set(0, 2.2, 0);
        break;
      case "casting_pot":
        camera.position.set(-2.8, 0.5, 3.5);
        controls.target.set(-1.5, -0.4, 0);
        break;
      case "spaceband_justifier":
        camera.position.set(0, 0.8, 3.2);
        controls.target.set(0, 0.2, 0);
        break;
      case "top":
        camera.position.set(0, 14.0, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const applyScenario = (s: ScenarioPreset) => {
    updateParam("castingLpm", s.castingLpm);
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
      cameraPos: [11.0, 8.5, 12.5],
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

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.22,
      metalness: 0.9,
    });

    const leadMetalMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.35,
      metalness: 0.88,
    });

    const polishedSteelMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.1,
      metalness: 0.95,
    });

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Heavy Cast-Iron C-Frame Column & Base
    const base = new THREE.Mesh(new THREE.BoxGeometry(6.5, 1.2, 5.5), castIronMat);
    base.position.y = -2.4;
    base.receiveShadow = true;
    rootGroup.add(base);

    const column = new THREE.Mesh(new THREE.BoxGeometry(2.2, 6.5, 2.2), castIronMat);
    column.position.set(0, 0.8, -1.0);
    column.castShadow = true;
    rootGroup.add(column);

    // 2. Slanted Brass Matrix Magazine (Claim 1)
    const magGroup = new THREE.Group();
    magGroup.position.set(0, 2.8, 0);
    magGroup.rotation.x = Math.PI / 6; // 30° Slant
    rootGroup.add(magGroup);

    const magazine = new THREE.Mesh(new THREE.BoxGeometry(3.6, 4.2, 0.35), brassMat);
    magazine.castShadow = true;
    magGroup.add(magazine);

    // 3. Molten Type-Metal Melting Pot & Pump Plunger (Claim 2)
    const potGroup = new THREE.Group();
    potGroup.position.set(-1.8, -0.4, 0.4);
    rootGroup.add(potGroup);

    const metalPot = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.7, 1.4, 24), castIronMat);
    metalPot.castShadow = true;
    potGroup.add(metalPot);

    // Molten Lead Surface
    const leadSurface = new THREE.Mesh(
      new THREE.CylinderGeometry(0.78, 0.78, 0.1, 24),
      leadMetalMat,
    );
    leadSurface.position.y = 0.6;
    potGroup.add(leadSurface);

    // Pump Plunger Rod
    const plungerRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 2.2, 12),
      polishedSteelMat,
    );
    plungerRod.position.set(0, 1.2, 0);
    potGroup.add(plungerRod);

    // 4. Casting Mold Disk & Cast Lead Slug Output
    const moldDisk = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.2, 0.25, 32),
      polishedSteelMat,
    );
    moldDisk.rotation.z = Math.PI / 2;
    moldDisk.position.set(0, -0.4, 0.8);
    rootGroup.add(moldDisk);

    // Cast Lead Slug (Linotype Line of Type)
    const leadSlug = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.28, 2.4), leadMetalMat);
    leadSlug.position.set(0.6, -0.6, 1.2);
    rootGroup.add(leadSlug);

    // 5. 90-Key Composing Keyboard Deck
    const keyDeck = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.35, 1.8), castIronMat);
    keyDeck.position.set(0, -1.2, 2.0);
    keyDeck.rotation.x = Math.PI / 8;
    rootGroup.add(keyDeck);

    // Animation Loop
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const _delta = clock.getDelta();
      const p = live.current;

      // Pump plunger stroke cycle
      const pumpFreq = (p.castingLpm / 60) * 2 * Math.PI;
      plungerRod.position.y = 1.2 + Math.sin(clock.getElapsedTime() * pumpFreq) * 0.25;

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
            Mergenthaler Linotype 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 313,224 (1885)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["matrix_magazine", "Matrix Magazine"],
              ["casting_pot", "Melting Pot"],
              ["spaceband_justifier", "Mold Disk"],
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
              <span className="text-[10px] text-parchment-400 uppercase">Casting Rate</span>
              <span className="font-bold text-amber-400">{castingLpm.toFixed(1)} Lines/Min</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Typesetting Output</span>
              <span className="font-bold text-blue-400">
                {charsPerHour.toLocaleString()} Chars/Hour (6× Hand)
              </span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Melting Pot Temp</span>
              <span className="font-bold text-red-400">{potTempC}°C (Molten Alloy)</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Justification Method</span>
              <span className="font-bold text-amber-300">Wedge Spacebands</span>
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
                Casting Speed (LPM):
              </span>
              <input
                type="range"
                min="2"
                max="10"
                step="0.5"
                value={castingLpm}
                onChange={(e) => updateParam("castingLpm", Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-mono text-amber-400 w-12 text-right font-bold">
                {castingLpm.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
