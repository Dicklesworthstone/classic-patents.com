"use client";

import { Activity, Camera, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { stepRenoEscalator } from "@/physics/machineKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "comb_plates" | "cleated_deck" | "handrail" | "top";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  speedFpm: number;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "coney_island_1896",
    name: "1896 Coney Island Inclined Elevator",
    desc: "Jesse Reno's original moving stairway carrying 75,000 riders along an inclined cleat deck with intermeshing comb-plates (US 470,918).",
    speedFpm: 90,
  },
  {
    id: "london_underground_rush",
    name: "London Subway High-Volume (120 FPM)",
    desc: "Fast 120 ft/min incline belt transporting 7,200 commuters per hour between tube levels.",
    speedFpm: 120,
  },
  {
    id: "accessible_slow_cruise",
    name: "Department Store Gentle Glide",
    desc: "Smooth 60 ft/min gentle speed with synchronized rubber handrails for Victorian department store shoppers.",
    speedFpm: 60,
  },
];

export function RenoEscalator3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Transit Dynamics Parameters
  const { params, updateParam } = usePatentPhysics("us-470918-reno-escalator");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
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

  const applyScenario = (s: ScenarioPreset) => {
    updateParam("beltSpeed", (s.speedFpm * 0.3048) / 60);
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
              <span className="text-[10px] text-parchment-400 uppercase">Belt Speed</span>
              <span className="font-bold text-amber-400">{deckSpeedFpm} ft/min</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Passenger Flow</span>
              <span className="font-bold text-blue-400">
                {passengersPerHour.toLocaleString()} Riders/Hour
              </span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Incline Angle</span>
              <span className="font-bold text-emerald-400">{inclineAngleDeg}°</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Safety Mechanism</span>
              <span className="font-bold text-amber-300">
                Comb {renoIdle.combPlateClearanceMm} mm · {renoIdle.motorTorqueNm} N·m
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
                Speed (FPM):
              </span>
              <input
                type="range"
                min="30"
                max="150"
                step="10"
                value={deckSpeedFpm}
                onChange={(e) => updateParam("beltSpeed", (Number(e.target.value) * 0.3048) / 60)}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-mono text-amber-400 w-12 text-right font-bold">
                {deckSpeedFpm}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
