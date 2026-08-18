"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FrankenSimEngine } from "@/physics/engine";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "triple_valve" | "brake_cylinder" | "wheel_shoes" | "top";

export function WestinghouseAirBrake3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);

  // Pneumatic Simulation Parameters
  const { params } = usePatentPhysics("us-124404-westinghouse-air-brake");
  const trainlinePressurePsi = params.trainPipePressure ?? params.brakePressurePsi ?? 70;
  const westinghouse = FrankenSimEngine.stepWestinghouseAirBrake({
    trainPipePressurePsi: trainlinePressurePsi,
    carMassTonnes: params.carMass ?? 35,
  });
  const isBrakeClamped = westinghouse.valveState !== "RELEASE";
  const clampingForceKn = westinghouse.shoeClampingForceKn;
  const stoppingDistanceFt = westinghouse.stoppingDistanceFt;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    trainlinePressurePsi,
    isBrakeClamped,
    isAudioMuted,
    clampingForceKn,
    stoppingDistanceFt,
    pistonStrokeRatio: westinghouse.pistonStrokeRatio,
    approachSpeedMph: westinghouse.approachSpeedMph,
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
    let _renderedSteps = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      _renderedSteps += 1;
      const delta = 1 / 60;
      const p = live.current;

      const clamp = Math.min(1, p.pistonStrokeRatio ?? 0);
      const roll = ((p.approachSpeedMph ?? 45) / 45) * 4.5 * (1 - clamp);
      wheels.forEach((w) => {
        w.rotation.z += roll * delta;
      });
      leftShoe.position.x = -1.88 - clamp * 0.14;
      rightShoe.position.x = 1.88 + clamp * 0.14;
      pistonRod.position.x = 0.8 + clamp * 0.4;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      studio.cleanup();
    };
  }, [live]);

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
            title={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            {showUiOverlay ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4 text-amber-400" />
            )}
          </button>
        </div>
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
        title="Westinghouse triple valve"
        chips={[
          { label: "Pipe", value: String(trainlinePressurePsi), unit: "psi" },
          { label: "Valve", value: westinghouse.valveState, tone: isBrakeClamped ? "hot" : "ok" },
          { label: "Shoe", value: String(clampingForceKn), unit: "kN" },
          { label: "Stop", value: String(stoppingDistanceFt), unit: "ft" },
          { label: "t_stop", value: String(westinghouse.stoppingTimeS), unit: "s" },
        ]}
      />
    </div>
  );
}
