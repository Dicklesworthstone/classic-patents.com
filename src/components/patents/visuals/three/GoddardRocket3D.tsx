"use client";

import {
  Camera,
  Eye,
  EyeOff,
  Flame,
  Rocket,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { HudText } from "@/components/ui/LatexRenderer";
import { FrankenSimEngine } from "@/physics/engine";
import { soundEngine } from "@/utils/soundEngine";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "de_laval_nozzle" | "combustion_chamber" | "gimbal_actuator" | "top";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  chamberPsi: number;
  flowKgs: number;
  stage: 1 | 2;
  gimbalDeg: number;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "goddard_1926_auburn",
    name: "March 16, 1926 Auburn Launch",
    desc: "Robert Goddard launches world's first liquid-propellant rocket (LOX + gasoline) reaching 41 ft altitude in 2.5s.",
    chamberPsi: 250,
    flowKgs: 1.2,
    stage: 1,
    gimbalDeg: 0,
  },
  {
    id: "staged_separation",
    name: "Multi-Stage High Altitude Jettison",
    desc: "Stage 1 booster fuel depletion and pneumatic inter-stage ring separation igniting Stage 2 upper nozzle.",
    chamberPsi: 380,
    flowKgs: 2.2,
    stage: 2,
    gimbalDeg: -4,
  },
  {
    id: "gyro_steering",
    name: "Active Gyro Exhaust Vane Control",
    desc: "Gimbal vanes vectoring supersonic exhaust stream in response to gyroscopic attitude sensor perturbations.",
    chamberPsi: 320,
    flowKgs: 1.8,
    stage: 1,
    gimbalDeg: 12,
  },
  {
    id: "max_q_overpressure",
    name: "Max-Q High Chamber Pressure Thrust",
    desc: "550 psi high-pressure combustion driving Mach 3.4 supersonic exhaust velocity with 12,000 N thrust.",
    chamberPsi: 550,
    flowKgs: 4.5,
    stage: 1,
    gimbalDeg: 8,
  },
];

export function GoddardRocket3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Propulsion & Staging State Controls
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [chamberPressurePsi, setChamberPressurePsi] = useState<number>(300); // 100 to 600 psi
  const [fuelFlowRateKgs, setFuelFlowRateKgs] = useState<number>(1.8); // 0.5 to 5.0 kg/s
  const [activeStage, setActiveStage] = useState<1 | 2>(1);
  const [gyroGimbalAngleDeg, setGyroGimbalAngleDeg] = useState<number>(3); // -15 to +15 deg
  const [showExhaustPlume, _setShowExhaustPlume] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  // Rocket Propulsion Physics (FrankenSim de Laval Isentropic Expansion)
  const rocketPhysics = FrankenSimEngine.stepGoddardRocket(chamberPressurePsi, fuelFlowRateKgs);
  const specificImpulseSec = rocketPhysics.specificImpulseSec;
  const exhaustVelocityMps = rocketPhysics.exhaustVelocityMps;
  const thrustNewtons = rocketPhysics.thrustNewtons;
  const thrustLbf = Math.round(thrustNewtons * 0.2248);

  const live = useLiveSimParams({
    activeStage,
    gyroGimbalAngleDeg,
    showExhaustPlume,
    exhaustVelocityMps,
    isAudioMuted,
  });

  const controlsRef = useRef<any>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (preset) {
      case "iso":
        camera.position.set(13, 10, 16);
        controls.target.set(0, 0, 0);
        break;
      case "de_laval_nozzle":
        camera.position.set(0, -3.2, 5.0);
        controls.target.set(0, -3.0, 0);
        break;
      case "combustion_chamber":
        camera.position.set(0, -0.5, 4.5);
        controls.target.set(0, -1.0, 0);
        break;
      case "gimbal_actuator":
        camera.position.set(2.8, -2.4, 3.5);
        controls.target.set(0, -2.5, 0);
        break;
      case "top":
        camera.position.set(0, 11.5, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const applyScenario = (s: ScenarioPreset) => {
    setChamberPressurePsi(s.chamberPsi);
    setFuelFlowRateKgs(s.flowKgs);
    setActiveStage(s.stage);
    setGyroGimbalAngleDeg(s.gimbalDeg);
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
      cameraPos: [13, 10, 16],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // --- PBR MATERIALS ---
    const aluminumHullMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.2,
      metalness: 0.9,
    });

    const copperNozzleMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.3,
      metalness: 0.85,
    });

    // --- 3D MULTI-STAGE ROCKET ASSEMBLY ---
    const rocketGroup = new THREE.Group();
    scene.add(rocketGroup);

    // Stage 1 (Booster Stage)
    const stage1Group = new THREE.Group();
    const stage1Body = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.2, 5.5, 48),
      aluminumHullMat,
    );
    stage1Body.castShadow = true;
    stage1Body.receiveShadow = true;
    stage1Group.add(stage1Body);

    for (let r = 0; r < 4; r++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.21, 0.03, 8, 36),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 }),
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -2.2 + r * 1.4;
      stage1Group.add(ring);
    }

    // 4 Swept Aerodynamic Stabilizing Fins
    for (let f = 0; f < 4; f++) {
      const fAngle = (f * Math.PI) / 2;
      const finShape = new THREE.Shape();
      finShape.moveTo(0, 0);
      finShape.lineTo(1.4, -0.6);
      finShape.lineTo(1.4, -1.8);
      finShape.lineTo(0, -1.5);
      finShape.closePath();

      const finGeo = new THREE.ExtrudeGeometry(finShape, { depth: 0.08, bevelEnabled: false });
      finGeo.center();
      const fin = new THREE.Mesh(finGeo, aluminumHullMat);
      fin.position.set(Math.cos(fAngle) * 1.8, -2.0, Math.sin(fAngle) * 1.8);
      fin.rotation.y = -fAngle + Math.PI / 2;
      fin.castShadow = true;
      stage1Group.add(fin);
    }

    // De Laval Supersonic Converging-Diverging Nozzle
    const nozzleGroup = new THREE.Group();
    nozzleGroup.position.y = -2.75;

    const gimbalRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.95, 0.06, 12, 32),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.85, roughness: 0.3 }),
    );
    gimbalRing.rotation.x = Math.PI / 2;
    gimbalRing.position.y = 0.2;
    nozzleGroup.add(gimbalRing);

    const nozzlePoints: THREE.Vector2[] = [];
    nozzlePoints.push(new THREE.Vector2(0.85, 0.3));
    nozzlePoints.push(new THREE.Vector2(0.82, 0.1));
    nozzlePoints.push(new THREE.Vector2(0.42, -0.2));
    nozzlePoints.push(new THREE.Vector2(0.32, -0.35));
    nozzlePoints.push(new THREE.Vector2(0.45, -0.65));
    nozzlePoints.push(new THREE.Vector2(0.68, -1.05));
    nozzlePoints.push(new THREE.Vector2(0.92, -1.45));

    const deLavalGeo = new THREE.LatheGeometry(nozzlePoints, 36);
    const deLavalMesh = new THREE.Mesh(deLavalGeo, copperNozzleMat);
    deLavalMesh.castShadow = true;
    nozzleGroup.add(deLavalMesh);

    const manifoldRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.93, 0.05, 8, 36),
      new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.9 }),
    );
    manifoldRing.rotation.x = Math.PI / 2;
    manifoldRing.position.y = -1.45;
    nozzleGroup.add(manifoldRing);

    stage1Group.add(nozzleGroup);
    rocketGroup.add(stage1Group);

    // Stage 2 (Upper Payload Stage & Interstage Adapter)
    const stage2Group = new THREE.Group();
    stage2Group.position.y = 4.2;

    const interstage = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 1.2, 1.2, 36),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.8 }),
    );
    interstage.position.y = -1.0;
    stage2Group.add(interstage);

    const stage2Body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 2.6, 36),
      aluminumHullMat,
    );
    stage2Body.position.y = 0.8;
    stage2Body.castShadow = true;
    stage2Group.add(stage2Body);

    // Aerodynamic Parabolic Nose Cone Fairing
    const nosePoints: THREE.Vector2[] = [];
    nosePoints.push(new THREE.Vector2(0.01, 2.2));
    nosePoints.push(new THREE.Vector2(0.2, 1.8));
    nosePoints.push(new THREE.Vector2(0.5, 1.0));
    nosePoints.push(new THREE.Vector2(0.8, 0));
    const noseGeo = new THREE.LatheGeometry(nosePoints, 36);
    const noseCone = new THREE.Mesh(noseGeo, aluminumHullMat);
    noseCone.position.y = 2.1;
    noseCone.castShadow = true;
    stage2Group.add(noseCone);

    rocketGroup.add(stage2Group);

    // --- GLOWING SUPERSONIC EXHAUST PLUME PARTICLES ---
    const plumeCount = 180;
    const plumeGeo = new THREE.BufferGeometry();
    const plumePos = new Float32Array(plumeCount * 3);
    const plumeColors = new Float32Array(plumeCount * 3);

    const glowTex = createGlowPointTexture();

    for (let i = 0; i < plumeCount; i++) {
      const idx = i * 3;
      plumePos[idx] = (Math.random() - 0.5) * 0.4;
      plumePos[idx + 1] = -4.2 - Math.random() * 4.5;
      plumePos[idx + 2] = (Math.random() - 0.5) * 0.4;

      const progress = (-plumePos[idx + 1] - 4.2) / 4.5;
      plumeColors[idx] = 1.0;
      plumeColors[idx + 1] = Math.max(0, 0.8 - progress * 0.7);
      plumeColors[idx + 2] = Math.max(0, 0.3 - progress * 0.3);
    }

    plumeGeo.setAttribute("position", new THREE.BufferAttribute(plumePos, 3));
    plumeGeo.setAttribute("color", new THREE.BufferAttribute(plumeColors, 3));

    const plumePoints = new THREE.Points(
      plumeGeo,
      new THREE.PointsMaterial({
        size: 0.42,
        map: glowTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    scene.add(plumePoints);

    // --- RENDER LOOP & REAL-TIME SUPERSONIC PLUME DYNAMICS ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;

      const gimbalRad = (p.gyroGimbalAngleDeg * Math.PI) / 180;
      nozzleGroup.rotation.z = gimbalRad;

      if (p.activeStage === 2) {
        stage2Group.position.y += (7.5 - stage2Group.position.y) * 0.05;
        stage1Group.position.y += (-6.0 - stage1Group.position.y) * 0.05;
      } else {
        stage2Group.position.y += (4.2 - stage2Group.position.y) * 0.1;
        stage1Group.position.y += (0 - stage1Group.position.y) * 0.1;
      }

      if (p.showExhaustPlume) {
        const pPos = plumePos;
        const velocitySpeed = (p.exhaustVelocityMps / 2000) * 35.0 * delta;

        for (let i = 0; i < plumeCount; i++) {
          const idx = i * 3;
          pPos[idx + 1] -= velocitySpeed;
          pPos[idx] += Math.sin(gimbalRad) * velocitySpeed * 0.4;

          if (pPos[idx + 1] < -8.5) {
            pPos[idx] = (Math.random() - 0.5) * 0.35;
            pPos[idx + 1] = -4.2;
            pPos[idx + 2] = (Math.random() - 0.5) * 0.35;
          }
        }
        plumeGeo.attributes.position.needsUpdate = true;
        plumePoints.visible = true;
      } else {
        plumePoints.visible = false;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      studio.dispose();
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Live HUD Telemetry Overlay */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-col gap-1.5 sm:gap-2 pointer-events-none max-w-[calc(100%-8rem)] sm:max-w-md transition-opacity duration-200">
            <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md p-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
              <div className="text-[10px] sm:text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Rocket className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 animate-pulse" />
                Supersonic Rocket Propulsion Telemetry
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 sm:gap-y-1 mt-1 text-[10px] sm:text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Thrust:</span>{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {thrustNewtons.toLocaleString()} N ({thrustLbf.toLocaleString()} lbf)
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">{"I_sp:"}</span>{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {specificImpulseSec} s
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Exhaust V:</span>{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {exhaustVelocityMps.toLocaleString()} m/s (M
                    {(exhaustVelocityMps / 343).toFixed(1)})
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Chamber P:</span>{" "}
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {chamberPressurePsi} psi ({(chamberPressurePsi / 14.696).toFixed(1)} atm)
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 items-center gap-2 max-w-full">
              <Flame className="w-3.5 h-3.5 text-amber-600 animate-pulse shrink-0" />
              <span className="truncate">
                Robert H. Goddard (US 1,155,986) — Rocket Apparatus (1914)
              </span>
            </div>
          </div>
        )}

        {/* Top Right Tool Bar (Toggle UI, Audio, Pins, Reset) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showUiOverlay
                ? "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
                : "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
            }`}
            title={showUiOverlay ? "Hide Overlay UI (Clean 3D View)" : "Show Overlay UI"}
            aria-label={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
          >
            {showUiOverlay ? (
              <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
          <button
            aria-label={isAudioMuted ? "Unmute simulation audio" : "Mute simulation audio"}
            type="button"
            onClick={toggleSound}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isAudioMuted ? "Enable Sound" : "Mute Sound"}
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            )}
          </button>
          <button
            aria-label={showCalloutPins ? "Hide annotation pins" : "Show annotation pins"}
            type="button"
            onClick={() => setShowCalloutPins(!showCalloutPins)}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showCalloutPins
                ? "bg-amber-600 text-white border-amber-700 shadow-md"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title="Toggle Historical Patent Numeral Pins"
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Camera Views Bar */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-1.5rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["de_laval_nozzle", "De Laval Nozzle"],
                ["combustion_chamber", "Chamber"],
                ["gimbal_actuator", "Gimbal Vanes"],
                ["top", "Aero Profile"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => applyCameraPreset(id)}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-sans whitespace-nowrap shrink-0 transition-colors ${
                  activeCamera === id
                    ? "bg-amber-700 dark:bg-amber-600 text-white font-semibold shadow-xs"
                    : "text-ink-700 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Controls & Scenario Bar */}
      <div className="p-4 sm:p-5 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 space-y-4">
        {/* Scenario Presets */}
        <div className="space-y-1.5">
          <div className="text-xs font-sans font-bold text-ink-700 dark:text-ink-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Historical Rocket Propulsion
            Presets:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => applyScenario(s)}
                className="p-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 bg-white/70 dark:bg-ink-950/70 hover:bg-parchment-50 dark:hover:bg-ink-800 text-left transition-colors group"
              >
                <div className="text-xs font-serif font-bold text-ink-900 dark:text-parchment-100 group-hover:text-amber-700 dark:group-hover:text-amber-400">
                  {s.name}
                </div>
                <div className="text-[10px] font-sans text-ink-500 dark:text-ink-400 line-clamp-2 mt-0.5">
                  <HudText text={s.desc} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Chamber Pressure */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="font-semibold text-ink-800 dark:text-parchment-200">
                <HudText text="Combustion Pressure ($P_c$):" />
              </span>
              <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">
                {chamberPressurePsi} psi
              </span>
            </div>
            <input
              type="range"
              aria-label="Combustion Pressure (P_c)"
              min="100"
              max="600"
              step="20"
              value={chamberPressurePsi}
              onChange={(e) => setChamberPressurePsi(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
              {"Governs isentropic expansion ratio and I_sp"}
            </span>
          </div>

          {/* Propellant Mass Flow Rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="font-semibold text-ink-800 dark:text-parchment-200">
                {"Propellant Mass Flow (ṁ):"}
              </span>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                {fuelFlowRateKgs.toFixed(1)} kg/s
              </span>
            </div>
            <input
              type="range"
              aria-label="Simulation parameter"
              min="0.5"
              max="5.0"
              step="0.1"
              value={fuelFlowRateKgs}
              onChange={(e) => setFuelFlowRateKgs(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
              LOX & gasoline turbopump delivery rate
            </span>
          </div>

          {/* Staging Toggle */}
          <div className="flex flex-col justify-end space-y-1.5">
            <button
              type="button"
              onClick={() => setActiveStage(activeStage === 1 ? 2 : 1)}
              className={`w-full py-3 px-4 rounded-xl font-sans font-bold text-sm transition-colors shadow-sm flex items-center justify-center gap-2 ${
                activeStage === 1
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                  : "bg-purple-600 hover:bg-purple-700 text-white shadow-md"
              }`}
            >
              <Rocket className="w-4 h-4" />
              {activeStage === 1 ? "Stage 1 (Booster Firing)" : "Stage 2 (Upper Core Staged)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
