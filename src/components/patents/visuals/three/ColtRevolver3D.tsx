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
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildColtRevolverModel } from "./coltRevolverModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "cylinder" | "lockwork" | "sightline" | "top";

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

  useFrankenSimPhysics("us-138-colt-revolver", {
    domain: "solid_mechanics",
    timestampMs: Date.now(),
    timeStepDt: 0.016,
    refusal: { isRefused: false },
    continuum: {
      tensileStressMpa: coltMech.hoopStressMpa,
      tensileStrainPct: 0,
      elasticModulusGpa: 200,
      crossLinkDensityMolesPerCm3: 0,
      stitchFrequencyHz: 0,
      feedVelocityMmPs: 0,
      buoyancyLiftForceKiloNewtons: 0,
    },
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
    muzzleVelocityMps,
    hoopStressMpa,
    isLocked: coltMech.isLocked ? 1 : 0,
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

    let gltfBaraban: THREE.Object3D | null = null;
    let gltfKurok: THREE.Object3D | null = null;
    let gltfVzvod: THREE.Object3D | null = null;

    // Load High-Quality GLB Model to replace primitive shapes
    import("three/examples/jsm/loaders/GLTFLoader.js").then(({ GLTFLoader }) => {
      const loader = new GLTFLoader();
      loader.load("/models/colt-paterson.glb", (gltf) => {
        // Hide the programmer-art primitive meshes but keep groups visible for physics math
        const hideMeshes = (group: THREE.Group) => {
          group.children.forEach((c) => {
            if (c.type === "Mesh") c.visible = false;
            if (c.type === "Group") hideMeshes(c as THREE.Group);
          });
        };
        hideMeshes(model.cylinderGroup);
        hideMeshes(model.hammerGroup);
        hideMeshes(model.triggerGroup);
        hideMeshes(model.loadingLeverGroup);

        model.group.children.forEach((c) => {
          if (
            c.type === "Group" &&
            c !== model.blastGroup &&
            c !== model.cylinderGroup &&
            c !== model.hammerGroup &&
            c !== model.triggerGroup &&
            c !== model.loadingLeverGroup &&
            c !== model.lockworkCutawayGroup
          ) {
            c.visible = false;
          }
          if (c.type === "Mesh") c.visible = false;
        });

        const gltfScene = gltf.scene;
        // Center and scale the GLTF model to fit the existing camera preset
        gltfScene.scale.set(12, 12, 12);
        // The GLB is modeled pointing diagonally downwards.
        // We calculate the barrel angle to be -49.63 degrees. So we rotate +49.63 deg on Z.
        gltfScene.rotation.z = 49.63 * (Math.PI / 180);
        gltfScene.position.set(2.0, -1.5, 0.4); // Tweak position after rotation so it centers with the camera

        gltfBaraban = gltfScene.getObjectByName("baraban") || null;
        gltfKurok = gltfScene.getObjectByName("kurok") || null;
        gltfVzvod = gltfScene.getObjectByName("vzvod") || null;

        scene.add(gltfScene);
      });
    });

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
      if (gltfKurok) gltfKurok.rotation.z = model.hammerGroup.rotation.z;

      // 2. Animate Paterson Folding Trigger
      // Trigger drops out of the frame mortise automatically as the hammer is cocked!
      const triggerDeployFraction = Math.min(1.0, p.cockingAngleDeg / 40);
      model.triggerGroup.rotation.z = -triggerDeployFraction * 0.45;
      model.triggerGroup.position.y = -1.42 - triggerDeployFraction * 0.32;
      if (gltfVzvod) gltfVzvod.rotation.z = model.triggerGroup.rotation.z;

      // 3. Animate 5-Chamber Cylinder Indexing
      // Each shot steps 360° / 5 = 72° (2 * PI / 5)
      const chamberStepRad = (2 * Math.PI) / 5;
      targetCylinderAngle =
        (p.currentChamberIndex - 1) * chamberStepRad + (p.cockingAngleDeg / 45) * chamberStepRad;
      currentCylinderAngle += (targetCylinderAngle - currentCylinderAngle) * 0.16;
      model.cylinderGroup.rotation.x = currentCylinderAngle;
      if (gltfBaraban) gltfBaraban.rotation.x = currentCylinderAngle;

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

        const kick = 0.04 + (p.muzzleVelocityMps / 400) * 0.1;
        model.group.rotation.z = Math.min(0.22, model.group.rotation.z + kick);
        model.group.position.x = Math.max(-0.35, model.group.position.x - kick * 0.8);
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

        {/* Action Buttons Overlay */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleCockHammer}
            className="flex items-center gap-2 px-3 py-2 bg-amber-600/90 hover:bg-amber-700 active:scale-95 text-white font-mono text-xs font-bold rounded-xl shadow-sm backdrop-blur-md transition-all cursor-pointer"
          >
            <Activity className="w-4 h-4" />
            Cock Hammer (72° Index)
          </button>
          <button
            type="button"
            onClick={handlePullTrigger}
            disabled={!isFullCock || isFiring}
            className={`flex items-center gap-2 px-3 py-2 font-mono text-xs font-bold rounded-xl shadow-sm backdrop-blur-md transition-all cursor-pointer ${
              isFullCock && !isFiring
                ? "bg-red-600/90 hover:bg-red-700 active:scale-95 text-white animate-pulse"
                : "bg-ink-900/60 text-ink-400 cursor-not-allowed border border-ink-800"
            }`}
          >
            <Flame className="w-4 h-4" />
            {isFiring ? "Discharging..." : "Pull Trigger (Fire)"}
          </button>
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
    </div>
  );
}
