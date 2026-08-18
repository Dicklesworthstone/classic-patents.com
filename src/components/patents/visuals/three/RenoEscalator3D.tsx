"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { stepRenoEscalator } from "@/physics/machineKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "comb_plates" | "cleated_deck" | "handrail" | "top";

export function RenoEscalator3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);

  // Transit Dynamics Parameters
  const { params } = usePatentPhysics("us-470918-reno-escalator");
  const beltSpeedMps = params.beltSpeed ?? 0.45;
  const passengerCount = params.passengerCount ?? 30;
  const inclineAngleDeg = params.inclineAngle ?? 25;
  const renoIdle = stepRenoEscalator({
    passengerCount,
    inclineAngleDeg,
    velocityMps: beltSpeedMps,
  });
  const deckSpeedFpm = renoIdle.speedFpm;
  const passengersPerHour = renoIdle.throughputPerHour;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    beltSpeedMps,
    passengerCount,
    inclineAngleDeg,
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
        camera.position.set(11.0, 7.5, 12.0);
        controls.target.set(0, 0, 0);
        break;
      case "comb_plates":
        camera.position.set(3.5, 2.5, 3.2);
        controls.target.set(2.8, 1.4, 0);
        break;
      case "cleated_deck":
        camera.position.set(0, 2.0, 4.0);
        controls.target.set(0, 0, 0);
        break;
      case "handrail":
        camera.position.set(-2.5, 2.5, 3.2);
        controls.target.set(-1.0, 1.2, 0);
        break;
      case "top":
        camera.position.set(0, 13.5, 0.1);
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
      cameraPos: [11.0, 7.5, 12.0],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Materials
    const structuralSteelMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.45,
      metalness: 0.85,
    });

    const hardwoodCleatMat = new THREE.MeshStandardMaterial({
      color: 0xa16207,
      roughness: 0.6,
      metalness: 0.05,
    });

    const brassCombMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.2,
      metalness: 0.92,
    });

    const rubberHandrailMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.8,
      metalness: 0.0,
    });

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Inclined Truss Framework Structure (25° Slope)
    const trussGroup = new THREE.Group();
    rootGroup.add(trussGroup);

    const inclineAngleRad = (inclineAngleDeg * Math.PI) / 180;

    // Inclined Stringer Beams
    [-1.6, 1.6].forEach((sz) => {
      const stringer = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.4, 0.25), structuralSteelMat);
      stringer.position.set(0, 0, sz);
      stringer.rotation.z = inclineAngleRad;
      stringer.castShadow = true;
      trussGroup.add(stringer);
    });

    // 2. Continuous Hardwood Cleated Step Deck (Claim 1)
    const cleatDeckGroup = new THREE.Group();
    cleatDeckGroup.rotation.z = inclineAngleRad;
    rootGroup.add(cleatDeckGroup);

    const cleatCount = 24;
    const cleats: THREE.Mesh[] = [];
    for (let c = 0; c < cleatCount; c++) {
      const cx = -4.8 + c * 0.42;
      const cleat = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 2.8), hardwoodCleatMat);
      cleat.position.set(cx, 0.25, 0);
      cleat.castShadow = true;
      cleatDeckGroup.add(cleat);
      cleats.push(cleat);
    }

    // 3. Intermeshing bronze comb teeth at both landings (Claim 2, 1.2 mm clearance)
    const addComb = (x: number, y: number) => {
      const plate = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 2.8), brassCombMat);
      plate.position.set(x, y, 0);
      rootGroup.add(plate);
      for (let t = 0; t < 14; t++) {
        const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.04, 0.08), brassCombMat);
        tooth.position.set(x + (x > 0 ? -0.38 : 0.38), y, -1.3 + t * 0.2);
        rootGroup.add(tooth);
      }
    };
    addComb(3.8, 1.9);
    addComb(-3.8, -1.9);

    // 4. Moving Rubber Handrail Balustrade
    [-1.6, 1.6].forEach((hz) => {
      const handrail = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 10.5, 16),
        rubberHandrailMat,
      );
      handrail.rotation.z = inclineAngleRad + Math.PI / 2;
      handrail.position.set(0, 1.4, hz);
      rootGroup.add(handrail);
    });

    // Animation Loop
    let reqId: number;
    const clock = new THREE.Clock();

    const cleatHome = cleats.map((c) => c.position.x);

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const p = live.current;
      const step = stepRenoEscalator({
        passengerCount: p.passengerCount,
        inclineAngleDeg: p.inclineAngleDeg,
        velocityMps: p.beltSpeedMps,
        elapsedS: clock.getElapsedTime(),
      });

      cleats.forEach((c, i) => {
        let x = cleatHome[i] + step.cleatOffset;
        if (x > 5.0) x -= step.cleatPitch * cleatCount;
        c.position.x = x;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      studio.cleanup();
    };
  }, [live, inclineAngleDeg]);

  return (
    <div className="relative w-full h-[620px] bg-parchment-900 rounded-2xl overflow-hidden border border-parchment-700 shadow-2xl flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-parchment-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            Reno Cleated Escalator 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 470,918 (1892)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["comb_plates", "Comb Plates"],
              ["cleated_deck", "Cleated Deck"],
              ["handrail", "Handrail"],
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
          </button>{" "}
        </div>
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
        title="Reno cleated deck"
        chips={[
          { label: "Belt", value: beltSpeedMps.toFixed(2), unit: "m/s" },
          { label: "Incline", value: String(inclineAngleDeg), unit: "°" },
          { label: "Deck", value: String(deckSpeedFpm), unit: "fpm" },
          { label: "Throughput", value: passengersPerHour.toLocaleString(), unit: "/h" },
          { label: "Torque", value: String(renoIdle.motorTorqueNm), unit: "N·m" },
        ]}
      />
    </div>
  );
}
