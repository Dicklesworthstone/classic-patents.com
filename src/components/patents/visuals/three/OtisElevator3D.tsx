"use client";

import {
  Activity,
  Camera,
  RotateCcw,
  Scissors,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "safety_pawls" | "leaf_spring" | "cab" | "top";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  cabWeightLbs: number;
  ropeCut: boolean;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "crystal_palace_1854",
    name: "1854 Crystal Palace Demonstration",
    desc: "Elisha Otis orders the hoisting rope slashed with a saber mid-air; the leaf spring instantly expands and locks the cab within 2 inches (US 31,128).",
    cabWeightLbs: 2500,
    ropeCut: true,
  },
  {
    id: "normal_hoisting",
    name: "Normal Passenger Hoisting",
    desc: "Hoisting cable under full 2.4 kN tension holding leaf spring flexed and safety pawls retracted 15mm clear of the ratchet racks.",
    cabWeightLbs: 2000,
    ropeCut: false,
  },
  {
    id: "overloaded_freight",
    name: "Heavy Industrial Freight Load",
    desc: "4,500 lb load testing structural guide shoe alignment and rack tooth shear margins.",
    cabWeightLbs: 4500,
    ropeCut: false,
  },
];

export function OtisElevator3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mechanical Elevator Simulation Parameters
  const { params } = usePatentPhysics("us-31128-otis-elevator");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isRopeSevered, setIsRopeSevered] = useState<boolean>(false);
  const cabWeightLbs = params.payloadKg ? params.payloadKg * 2.2 : 2500;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const pawlEngagementMs = isRopeSevered ? 78 : 0;
  const stoppingDistanceInches = isRopeSevered ? 1.4 : 0;

  const live = useLiveSimParams({
    isRopeSevered,
    cabWeightLbs,
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
        camera.position.set(10.0, 6.5, 11.5);
        controls.target.set(0, 0, 0);
        break;
      case "safety_pawls":
        camera.position.set(2.8, 2.2, 3.2);
        controls.target.set(1.8, 1.8, 0);
        break;
      case "leaf_spring":
        camera.position.set(0, 4.2, 3.8);
        controls.target.set(0, 2.5, 0);
        break;
      case "cab":
        camera.position.set(0, 0.5, 4.5);
        controls.target.set(0, 0, 0);
        break;
      case "top":
        camera.position.set(0, 13.0, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const cutRope = () => {
    setIsRopeSevered(true);
    if (!isAudioMuted) {
      soundEngine.playImpactThud();
    }
  };

  const resetRope = () => {
    setIsRopeSevered(false);
    if (!isAudioMuted) {
      soundEngine.playSwitchClick();
    }
  };

  const applyScenario = (s: ScenarioPreset) => {
    setIsRopeSevered(s.ropeCut);
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
      cameraPos: [10.0, 6.5, 11.5],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Materials
    const timberWoodMat = new THREE.MeshStandardMaterial({
      color: 0x5c381e,
      roughness: 0.75,
      metalness: 0.05,
    });

    const castIronMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.45,
      metalness: 0.85,
    });

    const springSteelMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.2,
      metalness: 0.92,
    });

    const brassShackleMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.25,
      metalness: 0.9,
    });

    const ropeHempMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.9,
      metalness: 0.0,
    });

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Vertical Hoistway Timber Frame with Notched Ratchet Racks (Claim 1)
    const hoistwayGroup = new THREE.Group();
    rootGroup.add(hoistwayGroup);

    // Twin Vertical Timber Uprights
    [-2.2, 2.2].forEach((ux) => {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.6, 12.0, 0.6), timberWoodMat);
      post.position.set(ux, 0, 0);
      post.castShadow = true;
      hoistwayGroup.add(post);

      // Notched Cast-Iron Ratchet Racks
      const toothCount = 36;
      for (let t = 0; t < toothCount; t++) {
        const ty = -5.5 + t * 0.32;
        const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.26, 3), castIronMat);
        tooth.rotation.z = ux > 0 ? Math.PI / 2 : -Math.PI / 2;
        tooth.position.set(ux > 0 ? ux - 0.35 : ux + 0.35, ty, 0);
        tooth.castShadow = true;
        hoistwayGroup.add(tooth);
      }
    });

    // Top Header Beam & Pulley Sheave
    const topBeam = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.6, 0.8), timberWoodMat);
    topBeam.position.set(0, 5.8, 0);
    hoistwayGroup.add(topBeam);

    const sheave = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.25, 24), castIronMat);
    sheave.rotation.x = Math.PI / 2;
    sheave.position.set(0, 5.8, 0);
    hoistwayGroup.add(sheave);

    // 2. Elevator Cab Assembly
    const cabGroup = new THREE.Group();
    rootGroup.add(cabGroup);

    // Platform Floor
    const cabFloor = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.25, 3.6), timberWoodMat);
    cabFloor.position.y = -1.5;
    cabFloor.castShadow = true;
    cabFloor.receiveShadow = true;
    cabGroup.add(cabFloor);

    // Cab Railings
    const railing = new THREE.Mesh(
      new THREE.BoxGeometry(3.4, 1.4, 3.4),
      new THREE.MeshStandardMaterial({
        color: 0x78350f,
        roughness: 0.6,
        wireframe: true,
      }),
    );
    railing.position.y = -0.7;
    cabGroup.add(railing);

    // Overhead Timber Crossbeam (Draw-Bar)
    const crossbeam = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.4, 0.4), timberWoodMat);
    crossbeam.position.y = 1.8;
    crossbeam.castShadow = true;
    cabGroup.add(crossbeam);

    // 3. Multi-Leaf Wagon Spring atop Crossbeam (Claim 2)
    const leafSpringGroup = new THREE.Group();
    leafSpringGroup.position.set(0, 2.2, 0);
    cabGroup.add(leafSpringGroup);

    // Curved Multi-Leaf Bow Spring Mesh
    const springCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-1.8, 0, 0),
      new THREE.Vector3(0, 0.55, 0),
      new THREE.Vector3(1.8, 0, 0),
    );
    const springGeo = new THREE.TubeGeometry(springCurve, 24, 0.08, 8, false);
    const springMesh = new THREE.Mesh(springGeo, springSteelMat);
    springMesh.castShadow = true;
    leafSpringGroup.add(springMesh);

    // 4. Opposed Safety Dogs / Pawls
    const leftPawl = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.5, 4), castIronMat);
    leftPawl.rotation.z = Math.PI / 2;
    leftPawl.position.set(-1.85, 1.8, 0);
    cabGroup.add(leftPawl);

    const rightPawl = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.5, 4), castIronMat);
    rightPawl.rotation.z = -Math.PI / 2;
    rightPawl.position.set(1.85, 1.8, 0);
    cabGroup.add(rightPawl);

    // 5. Hoisting Rope & Tension Shackle
    const shackleMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.6, 16),
      brassShackleMat,
    );
    shackleMesh.position.set(0, 2.6, 0);
    cabGroup.add(shackleMesh);

    const ropeGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.2, 8);
    const ropeMesh = new THREE.Mesh(ropeGeo, ropeHempMat);
    ropeMesh.position.set(0, 4.3, 0);
    rootGroup.add(ropeMesh);

    // Animation Loop
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const _delta = clock.getDelta();
      const p = live.current;

      if (p.isRopeSevered) {
        ropeMesh.visible = false;
        // Spring snaps open, forcing pawls outward to mesh with rack
        leftPawl.position.x = -1.98;
        rightPawl.position.x = 1.98;
        leafSpringGroup.scale.y = 1.35; // Bowed open
      } else {
        ropeMesh.visible = true;
        // Under rope tension, pawls pulled inward clear of teeth
        leftPawl.position.x = -1.72;
        rightPawl.position.x = 1.72;
        leafSpringGroup.scale.y = 0.7; // Compressed flat by cable tension
      }

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
            Otis Safety Elevator 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 31,128 (1861)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["safety_pawls", "Safety Pawls"],
              ["leaf_spring", "Leaf Spring"],
              ["cab", "Passenger Cab"],
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

        {/* Toggles & Cut Rope Action */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          {isRopeSevered ? (
            <button
              type="button"
              onClick={resetRope}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reconnect Cable
            </button>
          ) : (
            <button
              type="button"
              onClick={cutRope}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-md transition-colors animate-pulse"
            >
              <Scissors className="w-3.5 h-3.5" /> Cut Rope (Demonstration)
            </button>
          )}

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
              <span className="text-[10px] text-parchment-400 uppercase">Hoisting State</span>
              <span className={`font-bold ${isRopeSevered ? "text-red-400" : "text-emerald-400"}`}>
                {isRopeSevered ? "CABLE SEVERED (LOCKED)" : "NORMAL HOISTING"}
              </span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Pawl Engagement Time</span>
              <span className="font-bold text-amber-400">{pawlEngagementMs} ms</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Arrest Drop Distance</span>
              <span className="font-bold text-blue-400">
                {stoppingDistanceInches} Inches (Zero Freefall)
              </span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Cab Payload</span>
              <span className="font-bold text-amber-300">{cabWeightLbs} lbs</span>
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
          </div>
        </div>
      )}
    </div>
  );
}
