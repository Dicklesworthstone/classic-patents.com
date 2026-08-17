"use client";

import { Activity, Camera, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "pin_press" | "dials_board" | "sorting_box" | "top";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  cardsPerMin: number;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "census_1890_tally",
    name: "1890 US Census Tabulation",
    desc: "Herman Hollerith's electromechanical tabulating system processing 62.9 million citizens in months rather than years (US 395,781).",
    cardsPerMin: 60,
  },
  {
    id: "fast_operator_sorting",
    name: "High-Speed Sorter (80 Cards/Min)",
    desc: "Rapid pin press actuation triggering 24-compartment electromagnetic sorting box gates.",
    cardsPerMin: 80,
  },
  {
    id: "slow_mercury_contact",
    name: "Slow Pin-and-Cup Contact Breakdown",
    desc: "25 Cards/Min slow motion showing copper sensing pins plunging through punched holes into mercury cups.",
    cardsPerMin: 25,
  },
];

export function HollerithTabulating3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Electromechanical Computation Parameters
  const { params, updateParam } = usePatentPhysics("us-395781-hollerith-tabulating");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const cardsPerMin = params.cardsPerMin ?? 60;
  const cardsPerDay = Math.round(cardsPerMin * 60 * 7); // 7-hour clerk shift
  const clockDialCount = 40;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    cardsPerMin,
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
        camera.position.set(10.5, 8.0, 12.0);
        controls.target.set(0, 0, 0);
        break;
      case "pin_press":
        camera.position.set(-1.8, 1.2, 3.5);
        controls.target.set(-1.2, 0.2, 0.4);
        break;
      case "dials_board":
        camera.position.set(0, 3.2, 3.8);
        controls.target.set(0, 2.0, -0.6);
        break;
      case "sorting_box":
        camera.position.set(3.2, 1.5, 3.5);
        controls.target.set(2.2, 0, 0);
        break;
      case "top":
        camera.position.set(0, 13.5, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const applyScenario = (s: ScenarioPreset) => {
    updateParam("cardsPerMin", s.cardsPerMin);
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
      cameraPos: [10.5, 8.0, 12.0],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Materials
    const oakWoodMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.55,
      metalness: 0.05,
    });

    const dialWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.2,
      metalness: 0.1,
    });

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.22,
      metalness: 0.9,
    });

    const castIronMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.85,
    });

    const manilaCardMat = new THREE.MeshStandardMaterial({
      color: 0xfde047,
      roughness: 0.8,
      metalness: 0.05,
    });

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Hardwood Table Console Desk
    const desk = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.8, 5.5), oakWoodMat);
    desk.position.y = -1.2;
    desk.receiveShadow = true;
    rootGroup.add(desk);

    // 4 Oak Table Legs
    [
      [-4.5, -2.0],
      [4.5, -2.0],
      [-4.5, 2.0],
      [4.5, 2.0],
    ].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 2.4, 12), oakWoodMat);
      leg.position.set(lx, -2.4, lz);
      rootGroup.add(leg);
    });

    // 2. Vertical Clock Register Dial Bank (40 Dials) (Claim 1)
    const dialBackboard = new THREE.Mesh(new THREE.BoxGeometry(6.5, 3.8, 0.35), oakWoodMat);
    dialBackboard.position.set(0, 1.8, -1.8);
    dialBackboard.castShadow = true;
    rootGroup.add(dialBackboard);

    // 4 Rows of 10 Dials
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 10; c++) {
        const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.08, 16), dialWhiteMat);
        dial.rotation.x = Math.PI / 2;
        dial.position.set(-2.7 + c * 0.6, 3.0 - r * 0.75, -1.6);
        rootGroup.add(dial);
      }
    }

    // 3. Punched Card Pin Press Mechanism (Claim 2)
    const pressGroup = new THREE.Group();
    pressGroup.position.set(-2.4, 0.2, 0.8);
    rootGroup.add(pressGroup);

    // Lower Mercury Contact Well Cup Bed
    const mercuryBed = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.35, 1.6), castIronMat);
    pressGroup.add(mercuryBed);

    // Upper Spring-Loaded Pin Plate
    const pinPlateGroup = new THREE.Group();
    pinPlateGroup.position.y = 0.8;
    pressGroup.add(pinPlateGroup);

    const pinPlate = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.2, 1.6), brassMat);
    pinPlateGroup.add(pinPlate);

    // Punched Manila Census Card
    const punchCard = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.02, 1.2), manilaCardMat);
    punchCard.position.y = 0.2;
    pressGroup.add(punchCard);

    // Press Lever Handle
    const lever = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.2, 12), brassMat);
    lever.rotation.z = Math.PI / 3;
    lever.position.set(1.2, 0.8, 0);
    pressGroup.add(lever);

    // 4. Electromagnetic Sorting Box (24 Compartments)
    const sortBox = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.4, 2.8), oakWoodMat);
    sortBox.position.set(2.8, -0.2, 0.8);
    sortBox.castShadow = true;
    rootGroup.add(sortBox);

    // Animation Loop
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const _delta = clock.getDelta();
      const p = live.current;

      // Pin press plunging down into card
      const pressFreq = (p.cardsPerMin / 60) * 2 * Math.PI;
      const pressPhase = Math.sin(clock.getElapsedTime() * pressFreq);
      pinPlateGroup.position.y = 0.8 + (pressPhase > 0 ? -pressPhase * 0.45 : 0);

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
            Hollerith Tabulating System 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 395,781 (1889)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["pin_press", "Pin Press"],
              ["dials_board", "Register Dials"],
              ["sorting_box", "Sorting Box"],
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
              <span className="text-[10px] text-parchment-400 uppercase">Processing Rate</span>
              <span className="font-bold text-amber-400">{cardsPerMin} Cards/Min</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Shift Capacity</span>
              <span className="font-bold text-blue-400">
                {cardsPerDay.toLocaleString()} Cards/Day
              </span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Clock Dials</span>
              <span className="font-bold text-emerald-400">{clockDialCount} Counters</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Sensing Method</span>
              <span className="font-bold text-amber-300">Mercury Cup Contacts</span>
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
                Speed (Cards/Min):
              </span>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={cardsPerMin}
                onChange={(e) => updateParam("cardsPerMin", Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-mono text-amber-400 w-12 text-right font-bold">
                {cardsPerMin}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
