"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { createKilbyIntegratedCircuitModel, type KilbyModel } from "./kilbyIntegratedCircuitModel";
import { useLiveSimParams } from "./useLiveSimParams";

interface Kilby3DProps {
  className?: string;
}

type CameraPreset = "overview" | "transistors" | "wireBonds" | "capacitor";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { label: string; pos: [number, number, number]; target: [number, number, number] }
> = {
  overview: {
    label: "Monolithic Die Overview",
    pos: [0, 6.5, 9.0],
    target: [0, 0.4, 0],
  },
  transistors: {
    label: "Mesa Transistors (T1/T2)",
    pos: [-1.8, 2.5, 3.5],
    target: [-1.8, 0.6, 0],
  },
  wireBonds: {
    label: "Gold Flying Wire Bonds",
    pos: [0, 2.0, 4.0],
    target: [0, 0.8, 0.5],
  },
  capacitor: {
    label: "P-N Junction Capacitor",
    pos: [0, 2.8, 3.0],
    target: [0, 0.6, 0.6],
  },
};

export const KilbyIntegratedCircuit3D: React.FC<Kilby3DProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<KilbyModel | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  const { params } = usePatentPhysics("us-3138743-kilby-integrated-circuit");

  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("overview");

  const live = useLiveSimParams({
    supplyVoltageV: params.supplyVoltageV ?? 6.0,
    resistorLengthUm: params.resistorLengthUm ?? 500,
    resistorWidthUm: params.resistorWidthUm ?? 50,
    reverseBiasVoltageV: params.reverseBiasVoltageV ?? 3.0,
    baseDriveCurrentUa: params.baseDriveCurrentUa ?? 40,
  });

  const handlePresetChange = (preset: CameraPreset) => {
    setCameraPreset(preset);
    const targetConfig = CAMERA_PRESETS[preset];
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(...targetConfig.pos);
      controlsRef.current.target.set(...targetConfig.target);
      controlsRef.current.update();
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 480;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050811);
    scene.fog = new THREE.FogExp2(0x050811, 0.08);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(...CAMERA_PRESETS.overview.pos);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(...CAMERA_PRESETS.overview.target);
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(6, 12, 8);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const goldSpot = new THREE.SpotLight(0xf59e0b, 2.5);
    goldSpot.position.set(5, 8, 5);
    goldSpot.angle = Math.PI / 4;
    goldSpot.penumbra = 0.5;
    scene.add(goldSpot);

    const cyanSpot = new THREE.SpotLight(0x38bdf8, 1.8);
    cyanSpot.position.set(-5, 6, -4);
    cyanSpot.angle = Math.PI / 4;
    cyanSpot.penumbra = 0.5;
    scene.add(cyanSpot);

    // Model
    const model = createKilbyIntegratedCircuitModel({
      substrateMaterial: "germanium",
      ...live.current,
    });
    modelRef.current = model;
    scene.add(model.group);

    // Animation Loop
    const animate = () => {
      timeRef.current += 0.016;
      controls.update();

      model.update(timeRef.current, {
        substrateMaterial: "germanium",
        ...live.current,
      });

      renderer.render(scene, camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      controls.dispose();
      model.dispose();
      renderer.forceContextLoss();
      renderer.dispose();
      ambientLight.dispose();
      dirLight.dispose();
      goldSpot.dispose();
      cyanSpot.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [live]);

  return (
    <div
      className={`relative w-full h-[520px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 ${className}`}
    >
      <div ref={containerRef} className="w-full h-full" />

      {/* Preset Camera Selector */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-1.5 bg-slate-900/90 p-1.5 rounded-lg border border-slate-800 backdrop-blur-sm">
        {(Object.keys(CAMERA_PRESETS) as CameraPreset[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => handlePresetChange(key)}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${
              cameraPreset === key
                ? "bg-amber-950/80 text-amber-300 border border-amber-500"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            {CAMERA_PRESETS[key].label}
          </button>
        ))}
      </div>

      {/* Historic Monolithic Microchip Banner */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 px-3 py-2 rounded-lg border border-slate-800 backdrop-blur-sm pointer-events-none">
        <div className="text-xs font-mono font-semibold text-amber-400">
          US 3,138,743 — Jack Kilby Monolithic Solid Circuit
        </div>
        <div className="text-[10px] font-mono text-slate-400">
          Single-Crystal Germanium Bar with Mesa Transistors & Gold Flying Wires
        </div>
      </div>
    </div>
  );
};
