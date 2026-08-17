"use client";

import { Activity, Camera, Eye, EyeOff, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import {
  createGlowPointTexture,
  createThreeStudioScene,
  type StudioContext,
} from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "grate_saws" | "brush_drum" | "hopper" | "top";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  crankRpm: number;
  sawCount: number;
  feedRateLbsPerHr: number;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "whitney_1794_original",
    name: "1794 Whitney Hand-Crank Gin",
    desc: "Eli Whitney's original hand-cranked gin separating 50 lbs of clean green-seed short-staple cotton fiber per day (US X72).",
    crankRpm: 60,
    sawCount: 40,
    feedRateLbsPerHr: 6.2,
  },
  {
    id: "water_powered_mill",
    name: "Waterwheel Mill Drive (240 RPM)",
    desc: "Continuous mill drive processing over 300 lbs/day with high tooth velocity pulling fibers cleanly through the 3.2mm slotted breastwork.",
    crankRpm: 240,
    sawCount: 60,
    feedRateLbsPerHr: 38.0,
  },
  {
    id: "heavy_staple_choke",
    name: "Heavy Raw Cotton Inflow",
    desc: "Dense boll feeding testing seed exclusion at the breastwork ribs and counter-rotating brush suction.",
    crankRpm: 120,
    sawCount: 50,
    feedRateLbsPerHr: 22.0,
  },
];

export function WhitneyCottonGin3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mechanical Simulation Parameters
  const { params, updateParam } = usePatentPhysics("us-x72-whitney-cotton-gin");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const crankRpm = params.crankRpm ?? 60;
  const sawSpeedRpm = crankRpm * 2.5;
  const brushSpeedRpm = sawSpeedRpm * 3.2; // Counter-rotates at ~3.2x speed to create centrifugal air draft
  const [_showCalloutPins, _setShowCalloutPins] = useState<boolean>(false);
  const [showFibers, setShowFibers] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const dailyOutputLbs = (crankRpm * 0.85).toFixed(1);
  const laborMultiplier = ((crankRpm * 0.85) / 1.0).toFixed(0); // 1 lb/day was manual standard

  const live = useLiveSimParams({
    crankRpm,
    sawSpeedRpm,
    brushSpeedRpm,
    showFibers,
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
        camera.position.set(9.5, 7.5, 11.5);
        controls.target.set(0, 0, 0);
        break;
      case "grate_saws":
        camera.position.set(0, 1.2, 4.8);
        controls.target.set(0, 0.4, 0);
        break;
      case "brush_drum":
        camera.position.set(-3.2, 1.8, 3.8);
        controls.target.set(-1.0, 0, 0);
        break;
      case "hopper":
        camera.position.set(0, 6.2, 2.5);
        controls.target.set(0, 1.5, 0);
        break;
      case "top":
        camera.position.set(0, 12.0, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const applyScenario = (s: ScenarioPreset) => {
    updateParam("crankRpm", s.crankRpm);
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
      cameraPos: [9.5, 7.5, 11.5],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Materials
    const walnutWoodMat = new THREE.MeshStandardMaterial({
      color: 0x5c3218,
      roughness: 0.7,
      metalness: 0.05,
    });

    const ironSawMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.3,
      metalness: 0.9,
    });

    const brassGrateMat = new THREE.MeshStandardMaterial({
      color: 0xc8963e,
      roughness: 0.25,
      metalness: 0.88,
    });

    const brushBristleMat = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.9,
      metalness: 0.1,
    });

    const shaftSteelMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.15,
      metalness: 0.95,
    });

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Heavy Timber Wood Frame & Hopper
    const frameGroup = new THREE.Group();
    rootGroup.add(frameGroup);

    // Base Bed
    const baseBed = new THREE.Mesh(new THREE.BoxGeometry(8.0, 0.6, 6.0), walnutWoodMat);
    baseBed.position.y = -2.5;
    baseBed.castShadow = true;
    baseBed.receiveShadow = true;
    frameGroup.add(baseBed);

    // Side Frame Plates
    [-3.8, 3.8].forEach((xPos) => {
      const sidePlank = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4.6, 5.8), walnutWoodMat);
      sidePlank.position.set(xPos, -0.2, 0);
      sidePlank.castShadow = true;
      frameGroup.add(sidePlank);

      // Brass Shaft Bearing Pillow Blocks
      [-0.8, 1.2].forEach((zPos) => {
        const bearing = new THREE.Mesh(
          new THREE.CylinderGeometry(0.35, 0.4, 0.4, 16),
          brassGrateMat,
        );
        bearing.rotation.z = Math.PI / 2;
        bearing.position.set(xPos > 0 ? xPos + 0.25 : xPos - 0.25, 0.2, zPos);
        frameGroup.add(bearing);
      });
    });

    // Incline Hopper Chute (Raw Cotton Inflow)
    const hopperBack = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.3, 3.2), walnutWoodMat);
    hopperBack.position.set(0, 2.1, 1.6);
    hopperBack.rotation.x = -Math.PI / 4;
    frameGroup.add(hopperBack);

    // 2. Slotted Breastwork Iron Grate Grid (Claim 1)
    const grateGroup = new THREE.Group();
    grateGroup.position.set(0, 0.3, 0.3);
    const grateRibCount = 28;
    for (let r = 0; r < grateRibCount; r++) {
      const rx = -3.2 + r * (6.4 / (grateRibCount - 1));
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.4, 0.4), brassGrateMat);
      rib.position.set(rx, 0, 0);
      rib.rotation.x = Math.PI / 6;
      rib.castShadow = true;
      grateGroup.add(rib);
    }
    rootGroup.add(grateGroup);

    // 3. Revolving Saw Cylinder (Wire Teeth Saws)
    const sawCylinderGroup = new THREE.Group();
    sawCylinderGroup.position.set(0, 0.2, -0.8);
    rootGroup.add(sawCylinderGroup);

    // Central Wooden Cylinder Core
    const woodCore = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 7.2, 24), walnutWoodMat);
    woodCore.rotation.z = Math.PI / 2;
    sawCylinderGroup.add(woodCore);

    // Iron Saw Discs
    const sawCount = 27;
    for (let s = 0; s < sawCount; s++) {
      const sx = -3.1 + s * (6.2 / (sawCount - 1));
      const sawDisc = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.45, 0.04, 32), ironSawMat);
      sawDisc.rotation.z = Math.PI / 2;
      sawDisc.position.set(sx, 0, 0);
      sawDisc.castShadow = true;
      sawCylinderGroup.add(sawDisc);
    }

    // Steel Axle Shaft
    const sawShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 9.2, 16), shaftSteelMat);
    sawShaft.rotation.z = Math.PI / 2;
    sawCylinderGroup.add(sawShaft);

    // 4. Counter-Rotating Clearing Brush Cylinder (Hog Bristles)
    const brushCylinderGroup = new THREE.Group();
    brushCylinderGroup.position.set(0, 0.2, 1.2);
    rootGroup.add(brushCylinderGroup);

    const brushCore = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 7.2, 24), walnutWoodMat);
    brushCore.rotation.z = Math.PI / 2;
    brushCylinderGroup.add(brushCore);

    // 4 Longitudinal Rows of Stiff Bristles
    for (let row = 0; row < 4; row++) {
      const rowAngle = (row * Math.PI) / 2;
      const bristleRow = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.7, 0.15), brushBristleMat);
      bristleRow.position.set(0, Math.cos(rowAngle) * 0.75, Math.sin(rowAngle) * 0.75);
      bristleRow.rotation.x = rowAngle;
      brushCylinderGroup.add(bristleRow);
    }

    const brushShaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 9.2, 16),
      shaftSteelMat,
    );
    brushShaft.rotation.z = Math.PI / 2;
    brushCylinderGroup.add(brushShaft);

    // 5. Hand Crank & Step-Up Gear Train
    const crankGroup = new THREE.Group();
    crankGroup.position.set(4.3, 0.2, -0.8);
    rootGroup.add(crankGroup);

    const crankArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.8, 0.15), ironSawMat);
    crankArm.position.y = 0.8;
    crankGroup.add(crankArm);

    const crankHandle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 1.0, 16),
      walnutWoodMat,
    );
    crankHandle.rotation.z = Math.PI / 2;
    crankHandle.position.set(0.6, 1.6, 0);
    crankGroup.add(crankHandle);

    // Step-up Drive Pulley / Belt
    const drivePulley = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.25, 24), ironSawMat);
    drivePulley.rotation.z = Math.PI / 2;
    drivePulley.position.set(-4.5, 0.2, -0.8);
    rootGroup.add(drivePulley);

    // 6. Flying Cotton Fiber Stream & Separated Seeds Particles
    const fiberCount = 120;
    const fiberGeo = new THREE.BufferGeometry();
    const fiberPositions = new Float32Array(fiberCount * 3);
    const fiberColors = new Float32Array(fiberCount * 3);
    const glowTex = createGlowPointTexture();

    for (let i = 0; i < fiberCount; i++) {
      const idx = i * 3;
      fiberPositions[idx] = (Math.random() - 0.5) * 6.0;
      fiberPositions[idx + 1] = 0.2 + (Math.random() - 0.5) * 1.5;
      fiberPositions[idx + 2] = -0.5 + Math.random() * 2.8;

      fiberColors[idx] = 0.98;
      fiberColors[idx + 1] = 0.98;
      fiberColors[idx + 2] = 0.95;
    }

    fiberGeo.setAttribute("position", new THREE.BufferAttribute(fiberPositions, 3));
    fiberGeo.setAttribute("color", new THREE.BufferAttribute(fiberColors, 3));

    const fiberPoints = new THREE.Points(
      fiberGeo,
      new THREE.PointsMaterial({
        size: 0.28,
        map: glowTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      }),
    );
    rootGroup.add(fiberPoints);

    // Seed Heap (Blocked at Grate)
    const seedGeo = new THREE.DodecahedronGeometry(0.12);
    const seedMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.8,
    });
    const seedInstanced = new THREE.InstancedMesh(seedGeo, seedMat, 30);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 30; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * 5.8,
        -0.8 + Math.random() * 0.4,
        0.5 + Math.random() * 0.8,
      );
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      dummy.updateMatrix();
      seedInstanced.setMatrixAt(i, dummy.matrix);
    }
    seedInstanced.instanceMatrix.needsUpdate = true;
    rootGroup.add(seedInstanced);

    // Animation Loop
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;

      const sawRadPerSec = (p.sawSpeedRpm * 2 * Math.PI) / 60;
      const brushRadPerSec = (p.brushSpeedRpm * 2 * Math.PI) / 60;
      const crankRadPerSec = (p.crankRpm * 2 * Math.PI) / 60;

      sawCylinderGroup.rotation.x += sawRadPerSec * delta;
      brushCylinderGroup.rotation.x -= brushRadPerSec * delta; // Counter-rotating
      crankGroup.rotation.x += crankRadPerSec * delta;

      // Animate fibers moving from saw teeth through brush ejection
      const pos = fiberPositions;
      for (let i = 0; i < fiberCount; i++) {
        const idx = i * 3;
        pos[idx + 2] += (p.sawSpeedRpm / 60) * 4.2 * delta;
        pos[idx + 1] += Math.sin(pos[idx + 2] * 3) * 0.02;
        if (pos[idx + 2] > 3.0) {
          pos[idx + 2] = -1.2;
          pos[idx + 1] = 0.2 + (Math.random() - 0.5) * 0.8;
          pos[idx] = (Math.random() - 0.5) * 6.0;
        }
      }
      fiberGeo.attributes.position.needsUpdate = true;
      fiberPoints.visible = p.showFibers;

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
      {/* 3D WebGL Canvas Viewport */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls & Camera Presets */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-parchment-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            Whitney Cotton Gin 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent X72 (1794)
          </span>
        </div>

        {/* Camera Preset Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["grate_saws", "Grate & Saws"],
              ["brush_drum", "Brush Drum"],
              ["hopper", "Hopper Chute"],
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

        {/* Quick Toggles */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={() => setShowFibers(!showFibers)}
            title="Toggle Fiber Stream Particles"
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showFibers
                ? "bg-amber-600/30 text-amber-300 border border-amber-500/40"
                : "text-parchment-400 hover:text-white"
            }`}
          >
            {showFibers ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
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

      {/* Bottom Interactive Physics & Control Panel */}
      {showUiOverlay && (
        <div className="absolute bottom-4 left-4 right-4 bg-parchment-950/90 backdrop-blur-md rounded-2xl border border-parchment-700/70 p-4 shadow-2xl z-10 flex flex-col gap-3">
          {/* Real-Time Mechanical Telemetry Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pb-2 border-b border-parchment-800/80 text-xs font-mono">
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Hand Crank Speed</span>
              <span className="font-bold text-amber-400">{crankRpm} RPM</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Saw Tooth Tip Speed</span>
              <span className="font-bold text-blue-400">{sawSpeedRpm.toFixed(0)} RPM (2.5×)</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Brush Ejection Speed</span>
              <span className="font-bold text-emerald-400">
                {brushSpeedRpm.toFixed(0)} RPM (8.0×)
              </span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Daily Clean Output</span>
              <span className="font-bold text-amber-300">
                {dailyOutputLbs} lbs/day ({laborMultiplier}× manual)
              </span>
            </div>
          </div>

          {/* Scenario Presets & Live Slider Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Presets */}
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

            {/* Slider */}
            <div className="flex items-center gap-3 w-full sm:w-72 shrink-0">
              <span className="text-xs font-sans text-parchment-300 shrink-0 font-medium">
                Crank RPM:
              </span>
              <input
                type="range"
                min="20"
                max="240"
                step="5"
                value={crankRpm}
                onChange={(e) => updateParam("crankRpm", Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-mono text-amber-400 w-12 text-right font-bold">
                {crankRpm}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
