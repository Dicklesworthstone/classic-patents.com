"use client";

import {
  Activity,
  Camera,
  Eye,
  EyeOff,
  Flame,
  Layers,
  RotateCcw,
  Target,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FrankenSimEngine } from "@/physics/engine";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildColtRevolverModel } from "./coltRevolverModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "cylinder" | "lockwork" | "sightline" | "top";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  powderGrain: number;
  chamberPressureMpa: number;
  cockingAngleDeg: number;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "colt_1836_paterson",
    name: "1836 Colt Paterson Original .36 Caliber",
    desc: "Samuel Colt's original 5-shot revolving cylinder with hand pawl ratchet indexing and folding trigger (US 138).",
    powderGrain: 25,
    chamberPressureMpa: 75,
    cockingAngleDeg: 45,
  },
  {
    id: "texas_walker_heavy",
    name: "Heavy 45-Grain Cavalry Load",
    desc: "High-power black powder charge generating 110 MPa chamber pressure with 340 m/s muzzle velocity and intense barrel hoop stress.",
    powderGrain: 45,
    chamberPressureMpa: 110,
    cockingAngleDeg: 45,
  },
  {
    id: "light_target_practice",
    name: "18-Grain Light Target Load",
    desc: "Mild 55 MPa target charge ensuring long cylinder life and minimal frame recoil impulse.",
    powderGrain: 18,
    chamberPressureMpa: 55,
    cockingAngleDeg: 45,
  },
  {
    id: "slow_motion_lockwork",
    name: "Slow-Motion Lockwork Inspection",
    desc: "Examine the 3-stage mechanical hand pawl advancing the cylinder ratchet exactly 72° while the bolt locks.",
    powderGrain: 28,
    chamberPressureMpa: 85,
    cockingAngleDeg: 22,
  },
];

export function ColtRevolver3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { params, updateParam, resetParams } = usePatentPhysics("us-138-colt-revolver");

  // Reactive Physics & Mechanical State
  const chamberPressureMpa = params.chamberPressure ?? 85;
  const cockingAngleDeg = params.cockingAngle ?? 45; // 0 (down) to 45 (full cock)
  const powderGrains = Math.round((chamberPressureMpa - 40) / 1.5);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [currentChamberIndex, setCurrentChamberIndex] = useState<number>(1);
  const [isFiring, setIsFiring] = useState<boolean>(false);
  const [showLockworkCutaway, setShowLockworkCutaway] = useState<boolean>(false);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  // Hoop Stress & Ballistics Mechanics (FrankenSim Engine)
  const coltMech = FrankenSimEngine.stepColtRevolver({
    chamberPressureMpa,
    cockingAngleDeg,
  });

  const hoopStressMpa = coltMech.hoopStressMpa;
  const muzzleVelocityMps = coltMech.muzzleVelocityMps;
  const isFullCock = cockingAngleDeg >= 44;

  const live = useLiveSimParams({
    chamberPressureMpa,
    powderGrains,
    cockingAngleDeg,
    currentChamberIndex,
    isFiring,
    showLockworkCutaway,
    isAudioMuted,
  });

  const controlsRef = useRef<StudioContext["controls"] | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const fireTimerRef = useRef<number | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (preset) {
      case "iso":
        camera.position.set(3.5, 2.8, 10.5);
        controls.target.set(1.5, 0.4, 0);
        break;
      case "cylinder":
        camera.position.set(0.2, 1.8, 4.2);
        controls.target.set(0.0, 0.4, 0);
        break;
      case "lockwork":
        camera.position.set(-2.2, 0.8, 3.6);
        controls.target.set(-1.8, 0.0, 0);
        break;
      case "sightline":
        camera.position.set(-5.5, 1.35, 0);
        controls.target.set(5.5, 1.15, 0);
        break;
      case "top":
        camera.position.set(1.5, 9.5, 0.05);
        controls.target.set(1.5, 0.4, 0);
        break;
    }
  };

  const handleCockHammer = () => {
    updateParam("cockingAngle", 45);
    soundEngine.playMicroswitchClick();
  };

  const handlePullTrigger = () => {
    if (!isFullCock || isFiring) return;
    setIsFiring(true);
    updateParam("cockingAngle", 0);

    // Gunshot percussion blast & lockwork clack
    soundEngine.playLockstitchClack();

    if (fireTimerRef.current !== null) {
      window.clearTimeout(fireTimerRef.current);
    }
    fireTimerRef.current = window.setTimeout(() => {
      setIsFiring(false);
      setCurrentChamberIndex((prev) => (prev % 5) + 1);
    }, 850);
  };

  const applyScenario = (sc: ScenarioPreset) => {
    updateParam("chamberPressure", sc.chamberPressureMpa);
    updateParam("cockingAngle", sc.cockingAngleDeg);
  };

  useEffect(() => {
    return () => {
      if (fireTimerRef.current !== null) {
        window.clearTimeout(fireTimerRef.current);
      }
    };
  }, []);

  // 3D Scene Initialization
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [3.5, 2.8, 10.5],
      targetPos: [1.5, 0.4, 0],
      fov: 38,
      isDark: true,
      environmentStyle: "sky",
      enableFloorGrid: true,
      enableClouds: true,
      floorColor: 0x0f172a,
      gridColor: 0x334155,
      ambientIntensity: 1.4,
      sunIntensity: 2.4,
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Build Museum-Quality Blueprint Colt Model
    const model = buildColtRevolverModel();
    scene.add(model.group);

    // Callout Pins
    const pinGroup = new THREE.Group();
    pinGroup.visible = showCalloutPins;

    const callouts = [
      { pos: [4.8, 0.82, 0], text: "1. Octagonal Rifled Barrel (.36 Caliber)" },
      { pos: [0.0, 0.82, 0], text: "2. 5-Chamber Roll-Engraved Cylinder" },
      { pos: [-2.8, 1.6, 0], text: "3. Single-Action Spur Hammer" },
      { pos: [-2.1, -1.8, 0], text: "4. Paterson Folding Trigger" },
      { pos: [-3.4, -1.8, 0], text: "5. Black Walnut Plowhandle Grip" },
      { pos: [3.8, -0.4, 0], text: "6. Creeping Loading Lever & Rammer" },
    ];

    for (const c of callouts) {
      const pinAnchor = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xf59e0b }),
      );
      pinAnchor.position.set(c.pos[0], c.pos[1], c.pos[2]);
      pinGroup.add(pinAnchor);
    }
    model.group.add(pinGroup);

    // Animation Loop
    let reqId = 0;
    let targetCylinderAngle = 0;
    let currentCylinderAngle = 0;
    let smokePuffScale = 1.0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const p = live.current;

      // 1. Animate Hammer Cocking Rotation
      // 0 deg = hammer resting against percussion nipple; 45 deg = full cock
      const hammerTargetAngle = (p.cockingAngleDeg / 45) * 0.72;
      model.hammerGroup.rotation.z += (hammerTargetAngle - model.hammerGroup.rotation.z) * 0.18;

      // 2. Animate Paterson Folding Trigger
      // Trigger drops out of the frame mortise automatically as the hammer is cocked!
      const triggerDeployFraction = Math.min(1.0, p.cockingAngleDeg / 40);
      model.triggerGroup.rotation.z = -triggerDeployFraction * 0.45;
      model.triggerGroup.position.y = -1.42 - triggerDeployFraction * 0.32;

      // 3. Animate 5-Chamber Cylinder Indexing
      // Each shot steps 360° / 5 = 72° (2 * PI / 5)
      const chamberStepRad = (2 * Math.PI) / 5;
      targetCylinderAngle =
        (p.currentChamberIndex - 1) * chamberStepRad + (p.cockingAngleDeg / 45) * chamberStepRad;
      currentCylinderAngle += (targetCylinderAngle - currentCylinderAngle) * 0.16;
      model.cylinderGroup.rotation.x = currentCylinderAngle;

      // 4. Lockwork Cutaway Visibility
      model.lockworkCutawayGroup.visible = p.showLockworkCutaway;

      // 5. Muzzle Blast, Flash Flare, Smoke Cloud & Recoil Kick
      const blastMat = model.blastMesh.material as THREE.MeshBasicMaterial;
      const smokeMat = model.smokeMesh.material as THREE.PointsMaterial;
      const sparkMat = model.sparkPoints.material as THREE.PointsMaterial;

      if (p.isFiring) {
        // Flash flare
        blastMat.opacity = Math.max(0, blastMat.opacity + (0.95 - blastMat.opacity) * 0.5);
        smokeMat.opacity = Math.min(0.8, smokeMat.opacity + 0.25);
        sparkMat.opacity = 0.95;

        // Expanding smoke puff
        smokePuffScale += 0.09;
        model.smokeMesh.scale.set(smokePuffScale, smokePuffScale, smokePuffScale);

        // Recoil muzzle rise & backwards frame push
        model.group.rotation.z = Math.min(0.22, model.group.rotation.z + 0.09);
        model.group.position.x = Math.max(-0.35, model.group.position.x - 0.07);
      } else {
        blastMat.opacity *= 0.72;
        smokeMat.opacity *= 0.88;
        sparkMat.opacity *= 0.82;
        smokePuffScale = 1.0;
        model.smokeMesh.scale.set(1, 1, 1);

        // Return to rest position
        model.group.rotation.z *= 0.84;
        model.group.position.x *= 0.84;
      }

      pinGroup.visible = showCalloutPins;

      controls.update();
      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      for (const tex of model.textures) {
        tex.dispose();
      }
      studio.dispose();
    };
  }, [showCalloutPins, live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Live Telemetry Overlay */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex flex-col gap-2 pointer-events-none max-w-xs sm:max-w-sm">
            <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  Chamber Ballistics
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px]">
                  Chamber #{currentChamberIndex} / 5
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Hoop Stress:</span>{" "}
                  <span className="font-mono font-bold text-red-600 dark:text-red-400">
                    {hoopStressMpa} MPa
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Muzzle Velocity:</span>{" "}
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    {muzzleVelocityMps} m/s
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Powder Load:</span>{" "}
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-300">
                    {powderGrains} Grains
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Lock State:</span>{" "}
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {isFullCock ? "Full Cock" : cockingAngleDeg > 0 ? "Half Cock" : "Hammer Down"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Camera Preset Toolbar */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-wrap gap-1.5 max-w-[calc(100%-6rem)]">
          {(
            [
              ["iso", "Perspective"],
              ["cylinder", "Cylinder"],
              ["lockwork", "Lockwork"],
              ["sightline", "Sightline"],
              ["top", "Top"],
            ] as [CameraPreset, string][]
          ).map(([preset, label]) => (
            <button
              key={preset}
              type="button"
              onClick={() => applyCameraPreset(preset)}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all border ${
                activeCamera === preset
                  ? "bg-amber-600 text-white border-amber-500 shadow-sm"
                  : "bg-white/80 dark:bg-ink-900/80 backdrop-blur-md text-ink-700 dark:text-parchment-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 dark:hover:bg-ink-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Floating View Actions */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowLockworkCutaway(!showLockworkCutaway)}
            className={`p-2 rounded-xl backdrop-blur-md border transition-all ${
              showLockworkCutaway
                ? "bg-amber-600 text-white border-amber-500 shadow-sm"
                : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-parchment-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 dark:hover:bg-ink-800"
            }`}
            title="Toggle Internal Lockwork Cutaway"
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowCalloutPins(!showCalloutPins)}
            className="p-2 rounded-xl bg-white/80 dark:bg-ink-900/80 backdrop-blur-md text-ink-700 dark:text-parchment-200 border border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={showCalloutPins ? "Hide Part Labels" : "Show Part Labels"}
          >
            <Camera className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className="p-2 rounded-xl bg-white/80 dark:bg-ink-900/80 backdrop-blur-md text-ink-700 dark:text-parchment-200 border border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={showUiOverlay ? "Hide Overlay" : "Show Overlay"}
          >
            {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={resetParams}
            className="p-2 rounded-xl bg-white/80 dark:bg-ink-900/80 backdrop-blur-md text-ink-700 dark:text-parchment-200 border border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={toggleEngine}
            className="p-2 rounded-xl bg-white/80 dark:bg-ink-900/80 backdrop-blur-md text-ink-700 dark:text-parchment-200 border border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isAudioMuted ? "Enable Audio" : "Mute Audio"}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Interactive Controls & Historical Scenarios Panel */}
      <div className="p-4 sm:p-5 bg-parchment-100/70 dark:bg-ink-900/70 border-t border-parchment-300 dark:border-ink-800 space-y-4">
        {/* Scenario Presets */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-ink-500 dark:text-ink-400 font-semibold block">
            Historical Scenarios & Mechanical Modes
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => applyScenario(sc)}
                className="p-2 text-left rounded-lg bg-white/80 dark:bg-ink-950/60 border border-parchment-300/80 dark:border-ink-800 hover:border-amber-500 dark:hover:border-amber-500 transition-all text-xs group cursor-pointer"
              >
                <div className="font-semibold text-ink-900 dark:text-parchment-100 group-hover:text-amber-700 dark:group-hover:text-amber-400">
                  {sc.name}
                </div>
                <div className="text-[11px] text-ink-500 dark:text-ink-400 line-clamp-2 mt-0.5">
                  {sc.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Firing Mechanism Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-parchment-200 dark:border-ink-800">
          <button
            type="button"
            onClick={handleCockHammer}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-mono text-xs font-bold rounded-xl shadow transition-all cursor-pointer"
          >
            <Activity className="w-4 h-4" />
            1. Cock Hammer (72° Index)
          </button>
          <button
            type="button"
            onClick={handlePullTrigger}
            disabled={!isFullCock || isFiring}
            className={`flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold rounded-xl shadow transition-all cursor-pointer ${
              isFullCock && !isFiring
                ? "bg-red-600 hover:bg-red-700 active:scale-95 text-white animate-pulse"
                : "bg-ink-200 dark:bg-ink-800 text-ink-400 dark:text-ink-600 cursor-not-allowed opacity-60"
            }`}
          >
            <Flame className="w-4 h-4" />
            {isFiring ? "Discharging..." : "2. Pull Trigger (Fire)"}
          </button>
          <button
            type="button"
            onClick={() => setShowLockworkCutaway(!showLockworkCutaway)}
            className={`flex items-center gap-2 px-3.5 py-2 font-mono text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              showLockworkCutaway
                ? "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-400"
                : "bg-white dark:bg-ink-950 text-ink-700 dark:text-parchment-200 border-parchment-300 dark:border-ink-700"
            }`}
          >
            <Layers className="w-4 h-4" />
            {showLockworkCutaway ? "Hide Lockwork" : "Inspect Hand Pawl Lockwork"}
          </button>
        </div>

        {/* Parameter Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 text-xs">
          <div className="space-y-1.5">
            <div className="flex justify-between font-sans font-semibold text-ink-800 dark:text-parchment-200">
              <span>Black Powder Combustion Pressure:</span>
              <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">
                {chamberPressureMpa} MPa ({powderGrains} Grains)
              </span>
            </div>
            <input
              type="range"
              aria-label="Black Powder Charge"
              min="50"
              max="120"
              step="5"
              value={chamberPressureMpa}
              onChange={(e) => {
                const pMpa = Number(e.target.value);
                updateParam("chamberPressure", pMpa);
              }}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between font-sans font-semibold text-ink-800 dark:text-parchment-200">
              <span>Hammer Cocking Angle:</span>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                {cockingAngleDeg}° ({isFullCock ? "Full Cock" : "Half Cock"})
              </span>
            </div>
            <input
              type="range"
              aria-label="Hammer Cocking Angle"
              min="0"
              max="45"
              step="1"
              value={cockingAngleDeg}
              onChange={(e) => {
                const angle = Number(e.target.value);
                updateParam("cockingAngle", angle);
              }}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
