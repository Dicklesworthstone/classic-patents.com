"use client";

import { Activity, Camera, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "triple_valve" | "brake_cylinder" | "wheel_shoes" | "top";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  trainlinePsi: number;
  brakeApplied: boolean;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "running_release",
    name: "Running Position (70 PSI Charged)",
    desc: "Trainline pipe charged to 70 PSI holding triple valve open, charging auxiliary reservoir, and venting brake cylinder to release shoes (US 124,404).",
    trainlinePsi: 70,
    brakeApplied: false,
  },
  {
    id: "service_application",
    name: "Service Brake (50 PSI Reduction)",
    desc: "Engineer reduces trainline pressure by 20 PSI; triple valve shifts, admitting 50 PSI auxiliary air to brake cylinders for smooth deceleration.",
    trainlinePsi: 50,
    brakeApplied: true,
  },
  {
    id: "emergency_parted_train",
    name: "Emergency Parted Train (0 PSI Vent)",
    desc: "Trainline hose rupture vents pressure instantly to 0 PSI; fail-safe triple valves fire full reservoir pressure to clamp brake shoes in under 0.8s.",
    trainlinePsi: 0,
    brakeApplied: true,
  },
];

export function WestinghouseAirBrake3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Pneumatic Simulation Parameters
  const { params, updateParam } = usePatentPhysics("us-124404-westinghouse-air-brake");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const trainlinePressurePsi = params.brakePressurePsi ?? 70;
  const isBrakeClamped = trainlinePressurePsi < 65;
  const clampingForceKn = isBrakeClamped ? (70 - trainlinePressurePsi) * 0.45 : 0;
  const stoppingDistanceFt = isBrakeClamped
    ? Math.max(120, Math.round(900 - (70 - trainlinePressurePsi) * 12))
    : 0;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    trainlinePressurePsi,
    isBrakeClamped,
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
        camera.position.set(10.5, 7.0, 11.5);
        controls.target.set(0, 0, 0);
        break;
      case "triple_valve":
        camera.position.set(-1.0, 2.0, 3.8);
        controls.target.set(-0.5, 0.8, 0);
        break;
      case "brake_cylinder":
        camera.position.set(2.5, 1.5, 3.8);
        controls.target.set(1.5, 0.4, 0);
        break;
      case "wheel_shoes":
        camera.position.set(4.0, -0.5, 4.0);
        controls.target.set(3.2, -0.8, 0);
        break;
      case "top":
        camera.position.set(0, 12.5, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const applyScenario = (s: ScenarioPreset) => {
    updateParam("brakePressurePsi", s.trainlinePsi);
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
      cameraPos: [10.5, 7.0, 11.5],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Materials
    const castIronMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.45,
      metalness: 0.85,
    });

    const steelAirTankMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.35,
      metalness: 0.88,
    });

    const polishedSteelMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.1,
      metalness: 0.95,
    });

    const brassTripleValveMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.22,
      metalness: 0.9,
    });

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Railroad Car Truck Frame & Heavy Flanged Steel Wheels
    const truckGroup = new THREE.Group();
    rootGroup.add(truckGroup);

    // Track Rails
    [-1.2, 1.2].forEach((rz) => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(12.0, 0.35, 0.18), polishedSteelMat);
      rail.position.set(0, -2.4, rz);
      rail.receiveShadow = true;
      truckGroup.add(rail);
    });

    // 2 Railroad Wheel Sets (Axles + Wheels)
    const wheels: THREE.Group[] = [];
    [-3.2, 3.2].forEach((wx) => {
      const wheelSet = new THREE.Group();
      wheelSet.position.set(wx, -1.2, 0);

      const axle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 3.2, 16),
        polishedSteelMat,
      );
      axle.rotation.x = Math.PI / 2;
      wheelSet.add(axle);

      [-1.2, 1.2].forEach((wz) => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.22, 32), castIronMat);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.z = wz;
        wheel.castShadow = true;
        wheelSet.add(wheel);
      });

      truckGroup.add(wheelSet);
      wheels.push(wheelSet);
    });

    // 2. Auxiliary Air Reservoir Tank (Claim 1)
    const tankGroup = new THREE.Group();
    tankGroup.position.set(-2.2, 0.8, 0);
    rootGroup.add(tankGroup);

    const reservoir = new THREE.Mesh(
      new THREE.CylinderGeometry(0.9, 0.9, 3.2, 24),
      steelAirTankMat,
    );
    reservoir.rotation.z = Math.PI / 2;
    reservoir.castShadow = true;
    tankGroup.add(reservoir);

    // 3. Westinghouse Automatic Triple-Valve Body (Claim 1)
    const valveGroup = new THREE.Group();
    valveGroup.position.set(-0.2, 0.8, 0);
    rootGroup.add(valveGroup);

    const valveBody = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.7), brassTripleValveMat);
    valveBody.castShadow = true;
    valveGroup.add(valveBody);

    // 4. Brake Cylinder & Piston Rod Linkage (Claim 2)
    const brakeCylGroup = new THREE.Group();
    brakeCylGroup.position.set(1.8, 0.8, 0);
    rootGroup.add(brakeCylGroup);

    const brakeCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 2.2, 24), castIronMat);
    brakeCyl.rotation.z = Math.PI / 2;
    brakeCyl.castShadow = true;
    brakeCylGroup.add(brakeCyl);

    const pistonRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 2.4, 16),
      polishedSteelMat,
    );
    pistonRod.rotation.z = Math.PI / 2;
    pistonRod.position.x = 1.0;
    brakeCylGroup.add(pistonRod);

    // 5. Brake Shoe Rigging Beams Clamping Wheel Treads
    const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.6, 0.35), castIronMat);
    leftShoe.position.set(-2.0, -1.2, 1.2);
    truckGroup.add(leftShoe);

    const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.6, 0.35), castIronMat);
    rightShoe.position.set(2.0, -1.2, 1.2);
    truckGroup.add(rightShoe);

    // Continuous Trainline Pipe (Along Frame)
    const trainlinePipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 11.5, 12),
      polishedSteelMat,
    );
    trainlinePipe.rotation.z = Math.PI / 2;
    trainlinePipe.position.set(0, -0.2, 0.8);
    rootGroup.add(trainlinePipe);

    // Animation Loop
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;

      // Wheel rotation when brake released
      if (!p.isBrakeClamped) {
        wheels.forEach((w) => {
          w.rotation.z += 4.5 * delta;
        });
        leftShoe.position.x = -1.88; // Retracted
        rightShoe.position.x = 1.88;
        pistonRod.position.x = 0.8;
      } else {
        // Clamped against wheel treads
        leftShoe.position.x = -2.0;
        rightShoe.position.x = 2.0;
        pistonRod.position.x = 1.2;
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
            Westinghouse Air Brake 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 124,404 (1872)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["triple_valve", "Triple Valve"],
              ["brake_cylinder", "Brake Cylinder"],
              ["wheel_shoes", "Wheel Shoes"],
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
              <span className="text-[10px] text-parchment-400 uppercase">Trainline Pressure</span>
              <span
                className={`font-bold ${trainlinePressurePsi < 50 ? "text-red-400" : "text-amber-400"}`}
              >
                {trainlinePressurePsi} PSI
              </span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Brake Rigging State</span>
              <span className={`font-bold ${isBrakeClamped ? "text-red-400" : "text-emerald-400"}`}>
                {isBrakeClamped ? "CLAMPED (STOPPING)" : "RELEASED (ROLLING)"}
              </span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Clamping Force</span>
              <span className="font-bold text-blue-400">{clampingForceKn.toFixed(1)} kN</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Stopping Distance</span>
              <span className="font-bold text-amber-300">
                {stoppingDistanceFt} ft (from 30 MPH)
              </span>
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
                Trainline PSI:
              </span>
              <input
                type="range"
                min="0"
                max="70"
                step="5"
                value={trainlinePressurePsi}
                onChange={(e) => updateParam("brakePressurePsi", Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-mono text-amber-400 w-12 text-right font-bold">
                {trainlinePressurePsi}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
