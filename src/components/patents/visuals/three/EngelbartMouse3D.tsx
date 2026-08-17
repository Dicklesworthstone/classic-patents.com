"use client";

import {
  Camera,
  Eye,
  EyeOff,
  Layers,
  Mouse,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { soundEngine } from "@/utils/soundEngine";
import { createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "wheels" | "xray" | "top" | "crt";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  speed: number;
  trajectory: "figure8" | "circle" | "horizontal" | "vertical";
  cpi: number;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "horizontal",
    name: "Pure X-Axis Tracking",
    desc: "Horizontal motion spins X-wheel 100%; Y-wheel skids laterally on its knife edge without spinning.",
    speed: 140,
    trajectory: "horizontal",
    cpi: 200,
  },
  {
    id: "vertical",
    name: "Pure Y-Axis Tracking",
    desc: "Vertical motion spins Y-wheel 100%; X-wheel skids laterally on its knife edge without spinning.",
    speed: 140,
    trajectory: "vertical",
    cpi: 200,
  },
  {
    id: "figure8",
    name: "1968 'Mother of All Demos'",
    desc: "Complex 2D curve motion simultaneously driving dual independent potentiometers into oN-Line System (NLS).",
    speed: 160,
    trajectory: "figure8",
    cpi: 200,
  },
  {
    id: "highres",
    name: "Precision Coordinate Sampling",
    desc: "High-resolution 400 CPI encoding demonstrating fine microsecond potentiometer voltage gradients.",
    speed: 80,
    trajectory: "circle",
    cpi: 400,
  },
];

export function EngelbartMouse3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse Kinematics & Rendering State
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [displacementSpeedMmSec, setDisplacementSpeedMmSec] = useState<number>(140);
  const [mouseTrajectory, setMouseTrajectory] = useState<
    "figure8" | "circle" | "horizontal" | "vertical"
  >("figure8");
  const [cpiResolution, setCpiResolution] = useState<number>(200);
  const [isClicking, setIsClicking] = useState<boolean>(false);
  const [isXRayMode, setIsXRayMode] = useState<boolean>(false);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  // Live Position & Pulse Telemetry
  const [currentCoords, setCurrentCoords] = useState<{ x: number; y: number }>({
    x: 512,
    y: 384,
  });

  const pulseRateHz = Math.round((displacementSpeedMmSec / 25.4) * cpiResolution);

  const live = useLiveSimParams({
    displacementSpeedMmSec,
    mouseTrajectory,
    isClicking,
    isXRayMode,
    cpiResolution,
  });

  const controlsRef = useRef<any>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Camera presets dispatcher
  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (preset) {
      case "iso":
        camera.position.set(11, 9, 13);
        controls.target.set(0, 0, 0);
        break;
      case "wheels":
        camera.position.set(0, -6, 9);
        controls.target.set(0, 0, 0);
        break;
      case "xray":
        setIsXRayMode(true);
        camera.position.set(4, 7, 9);
        controls.target.set(0, 1.2, 0);
        break;
      case "top":
        camera.position.set(0, 16, 0.1);
        controls.target.set(0, 0, 0);
        break;
      case "crt":
        camera.position.set(-5, 4, 6);
        controls.target.set(-1.5, 1.5, -1);
        break;
    }
    controls.update();
  };

  const applyScenario = (s: ScenarioPreset) => {
    setDisplacementSpeedMmSec(s.speed);
    setMouseTrajectory(s.trajectory);
    setCpiResolution(s.cpi);
    if (!isAudioMuted) {
      soundEngine.playMicroswitchClick();
    }
  };

  const handleManualClick = () => {
    setIsClicking(true);
    if (!isAudioMuted) {
      soundEngine.playMicroswitchClick();
    }
    setTimeout(() => setIsClicking(false), 160);
  };

  const toggleSound = () => {
    toggleEngine(() => {
      soundEngine.playMicroswitchClick();
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [11, 9, 13],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // --- PBR MATERIALS ---
    const woodHousingMat = new THREE.MeshStandardMaterial({
      color: 0x9a3412,
      roughness: 0.35,
      metalness: 0.05,
    });

    const woodHousingXRayMat = new THREE.MeshPhysicalMaterial({
      color: 0x9a3412,
      transmission: 0.82,
      opacity: 0.35,
      transparent: true,
      roughness: 0.15,
      ior: 1.4,
    });

    const brassWheelMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.18,
      metalness: 0.92,
    });

    const redButtonMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.25,
      metalness: 0.1,
    });

    const potentiometerMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.3,
      metalness: 0.85,
    });

    const wiperCopperMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.15,
      metalness: 0.95,
    });

    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.6,
      metalness: 0.1,
    });

    // Formica Desk Surface
    const desk = new THREE.Mesh(new THREE.BoxGeometry(26, 0.4, 20), deskMat);
    desk.position.y = -0.22;
    desk.receiveShadow = true;
    scene.add(desk);

    // --- 3D ENGELBART MOUSE ASSEMBLY ---
    const mouseGroup = new THREE.Group();
    scene.add(mouseGroup);

    // Carved Walnut Wooden Block Casing
    const bodyGeo = new THREE.BoxGeometry(4.4, 2.3, 6.0);
    const body = new THREE.Mesh(bodyGeo, woodHousingMat);
    body.position.y = 1.25;
    body.castShadow = true;
    body.receiveShadow = true;
    mouseGroup.add(body);

    const basePlate = new THREE.Mesh(
      new THREE.BoxGeometry(4.38, 0.12, 5.98),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.3 }),
    );
    basePlate.position.y = 0.12;
    basePlate.receiveShadow = true;
    mouseGroup.add(basePlate);

    const buttonBezel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.48, 0.52, 0.15, 24),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7 }),
    );
    buttonBezel.position.set(1.3, 2.42, -2.0);
    mouseGroup.add(buttonBezel);

    const redButton = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.38, 0.45, 24),
      redButtonMat,
    );
    redButton.position.set(1.3, 2.6, -2.0);
    redButton.castShadow = true;
    mouseGroup.add(redButton);

    // Internal Microswitch Leaf Spring & Electrical Contacts
    const microswitchGroup = new THREE.Group();
    microswitchGroup.position.set(1.3, 1.8, -2.0);
    const switchBox = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.9), potentiometerMat);
    microswitchGroup.add(switchBox);

    const switchLeaf = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.04, 0.7), wiperCopperMat);
    switchLeaf.position.set(0, 0.28, 0);
    microswitchGroup.add(switchLeaf);
    mouseGroup.add(microswitchGroup);

    // Molded Rubber Strain Relief Boot at Rear
    const bootGeo = new THREE.ConeGeometry(0.32, 0.8, 16);
    const boot = new THREE.Mesh(
      bootGeo,
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 }),
    );
    boot.rotation.x = -Math.PI / 2;
    boot.position.set(0, 0.6, 3.2);
    mouseGroup.add(boot);

    const cordCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.6, 3.6),
      new THREE.Vector3(0.6, 0.3, 5.0),
      new THREE.Vector3(2.0, 0.1, 6.8),
      new THREE.Vector3(3.8, 0.1, 8.5),
    ]);
    const cordGeo = new THREE.TubeGeometry(cordCurve, 32, 0.12, 10, false);
    const cord = new THREE.Mesh(
      cordGeo,
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 }),
    );
    cord.castShadow = true;
    mouseGroup.add(cord);

    // --- ORTHOGONAL KNIFE-EDGE ENCODER WHEELS & POTENTIOMETERS ---
    // Wheel 1: X-Displacement Wheel (Rolls for X-motion, skids for Y-motion)
    const xWheelGroup = new THREE.Group();
    xWheelGroup.position.set(-1.1, 0.25, -0.6);

    const xWheelRim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.85, 0.85, 0.15, 32),
      brassWheelMat,
    );
    xWheelRim.rotation.z = Math.PI / 2;
    xWheelRim.castShadow = true;
    xWheelGroup.add(xWheelRim);

    const xAxle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 1.8, 16),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9 }),
    );
    xAxle.rotation.z = Math.PI / 2;
    xWheelGroup.add(xAxle);

    // X-Potentiometer Internal Wiper & Carbon Resistive Track
    const xPotBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.6, 0.5, 24),
      potentiometerMat,
    );
    xPotBody.rotation.z = Math.PI / 2;
    xPotBody.position.x = 0.8;
    xWheelGroup.add(xPotBody);

    const xPotWiper = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.12), wiperCopperMat);
    xPotWiper.position.set(0.6, 0.2, 0);
    xWheelGroup.add(xPotWiper);

    mouseGroup.add(xWheelGroup);

    // Wheel 2: Y-Displacement Wheel (Rolls for Y-motion, skids for X-motion)
    const yWheelGroup = new THREE.Group();
    yWheelGroup.position.set(0.7, 0.25, 1.2);

    const yWheelRim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.85, 0.85, 0.15, 32),
      brassWheelMat,
    );
    yWheelRim.rotation.x = Math.PI / 2;
    yWheelRim.castShadow = true;
    yWheelGroup.add(yWheelRim);

    const yAxle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 1.8, 16),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9 }),
    );
    yAxle.rotation.x = Math.PI / 2;
    yWheelGroup.add(yAxle);

    // Y-Potentiometer Internal Wiper & Carbon Resistive Track
    const yPotBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.6, 0.5, 24),
      potentiometerMat,
    );
    yPotBody.rotation.x = Math.PI / 2;
    yPotBody.position.z = -0.8;
    yWheelGroup.add(yPotBody);

    const yPotWiper = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.45, 0.08), wiperCopperMat);
    yPotWiper.position.set(0, 0.2, -0.6);
    yWheelGroup.add(yPotWiper);

    mouseGroup.add(yWheelGroup);

    // --- RENDER LOOP & REAL-TIME KINEMATICS ---
    let reqId: number;
    const clock = new THREE.Clock();
    let prevX = 0;
    let hudAcc = 0;
    let lastHudX = Number.NaN;
    let lastHudY = Number.NaN;
    let prevZ = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const p = live.current;

      // X-Ray Material Toggle
      body.material = p.isXRayMode ? woodHousingXRayMat : woodHousingMat;

      // Trajectory Computation
      const speed = p.displacementSpeedMmSec * 0.018;
      let posX = 0;
      let posZ = 0;

      if (p.mouseTrajectory === "horizontal") {
        posX = Math.sin(elapsed * speed) * 3.5;
        posZ = 0;
      } else if (p.mouseTrajectory === "vertical") {
        posX = 0;
        posZ = Math.sin(elapsed * speed) * 3.5;
      } else if (p.mouseTrajectory === "circle") {
        posX = Math.cos(elapsed * speed) * 3.0;
        posZ = Math.sin(elapsed * speed) * 3.0;
      } else {
        // Figure 8
        posX = Math.sin(elapsed * speed) * 3.2;
        posZ = Math.sin(elapsed * speed * 2.0) * 1.8;
      }

      mouseGroup.position.set(posX, 0, posZ);

      // Independent Orthogonal Wheel & Potentiometer Rotations
      const dX = posX - prevX;
      const dZ = posZ - prevZ;
      prevX = posX;
      prevZ = posZ;

      const wheelRadius = 0.85;
      if (delta > 0) {
        // X-wheel rotates on X-displacement
        xWheelRim.rotation.x -= dX / wheelRadius;
        xPotWiper.rotation.x -= dX / wheelRadius;

        // Y-wheel rotates on Z-displacement
        yWheelRim.rotation.z += dZ / wheelRadius;
        yPotWiper.rotation.z += dZ / wheelRadius;
      }

      // Microswitch Button Depress Animation
      redButton.position.y = p.isClicking ? 2.44 : 2.6;
      switchLeaf.rotation.x = p.isClicking ? 0.08 : 0;

      // Live 2D Screen Coordinate Simulation — throttle HUD writes; rAF setState every frame
      // would re-render the whole React tree at 60 Hz.
      const screenX = Math.round(512 + posX * 120);
      const screenY = Math.round(384 + posZ * 120);
      hudAcc += delta;
      if (hudAcc >= 0.08 && (screenX !== lastHudX || screenY !== lastHudY)) {
        hudAcc = 0;
        lastHudX = screenX;
        lastHudY = screenY;
        setCurrentCoords({ x: screenX, y: screenY });
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
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none max-w-[calc(100%-8rem)] sm:max-w-md">
            <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
              <div className="text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Mouse className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                SRI NLS Coordinate &amp; Kinematic Telemetry
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">CRT Position (X, Y):</span>{" "}
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    [{currentCoords.x}, {currentCoords.y}]
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Sampling Rate:</span>{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {pulseRateHz} pulses/sec
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Encoder Resolution:</span>{" "}
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {cpiResolution} CPI ({Math.round(cpiResolution / 25.4)} counts/mm)
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Orthogonal Geometry:</span>{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    90° Dual Potentiometer Wheels
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 flex items-center gap-2 max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
              <span className="truncate">
                Douglas Engelbart (US 3,541,541) — X-Y Position Indicator
              </span>
            </div>
          </div>
        )}

        {/* Top Right Tool Bar (Toggle UI, X-Ray, Audio, Callouts & Reset) */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
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
            title={isAudioMuted ? "Enable Sound Synthesis" : "Mute Sound"}
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            )}
          </button>
          <button
            aria-label="Toggle Transparent X-Ray Internal Potentiometers"
            type="button"
            onClick={() => setIsXRayMode(!isXRayMode)}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              isXRayMode
                ? "bg-blue-600 text-white border-blue-700 shadow-md"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title="Toggle Transparent X-Ray Internal Potentiometers"
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
                ["iso", "Isometric Desk"],
                ["wheels", "Knife-Edge Wheels"],
                ["xray", "Internal X-Ray"],
                ["top", "Top Kinematics"],
                ["crt", "Vector CRT"],
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
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Historical Kinematic Scenarios:
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
                  {s.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sliders Grid & Click Button */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 items-center">
          {/* Tracking Trajectory */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="font-semibold text-ink-800 dark:text-parchment-200">
                Movement Pattern:
              </span>
              <span className="font-mono text-amber-700 dark:text-amber-400 font-bold uppercase">
                {mouseTrajectory}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {(["figure8", "circle", "horizontal", "vertical"] as const).map((traj) => (
                <button
                  key={traj}
                  type="button"
                  onClick={() => setMouseTrajectory(traj)}
                  className={`py-1.5 text-xs rounded-lg font-sans capitalize transition-colors ${
                    mouseTrajectory === traj
                      ? "bg-amber-600 text-white font-bold"
                      : "bg-white/70 dark:bg-ink-950/70 text-ink-700 dark:text-parchment-300 border border-parchment-300 dark:border-ink-700"
                  }`}
                >
                  {traj === "figure8" ? "Fig-8" : traj}
                </button>
              ))}
            </div>
          </div>

          {/* Displacement Velocity */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="font-semibold text-ink-800 dark:text-parchment-200">
                Tracking Velocity:
              </span>
              <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">
                {displacementSpeedMmSec} mm/s
              </span>
            </div>
            <input
              type="range"
              aria-label="Tracking Velocity"
              min="30"
              max="300"
              step="10"
              value={displacementSpeedMmSec}
              onChange={(e) => setDisplacementSpeedMmSec(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>

          {/* Microswitch Click Button */}
          <div className="flex flex-col justify-end space-y-1.5">
            <button
              type="button"
              onClick={handleManualClick}
              className={`w-full py-3 px-4 rounded-xl font-sans font-bold text-sm transition-colors shadow-sm flex items-center justify-center gap-2 ${
                isClicking
                  ? "bg-red-700 text-white scale-95 shadow-inner ring-2 ring-red-400"
                  : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-md"
              }`}
            >
              <Mouse className="w-4 h-4" /> Click Red Microswitch Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
