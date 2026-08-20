"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { createLandPolaroidModel, type LandPolaroidModelNodes } from "./landPolaroidModel";
import { useLiveSimParams } from "./useLiveSimParams";

interface LandPolaroid3DProps {
  className?: string;
}

type CameraPreset = "overview" | "rollers" | "pod" | "print";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { label: string; pos: [number, number, number]; target: [number, number, number] }
> = {
  overview: {
    label: "Instant Camera & Film Overview",
    pos: [3.5, 5.0, 7.5],
    target: [0.5, 0, 1.2],
  },
  rollers: {
    label: "Nip Pressure Rollers",
    pos: [1.8, 2.2, 2.5],
    target: [0.6, 0, 0],
  },
  pod: {
    label: "Rupturable Reagent Pod",
    pos: [0.6, 2.5, 1.5],
    target: [0.6, 0, -0.6],
  },
  print: {
    label: "Developing Positive Print",
    pos: [3.5, 2.8, 4.5],
    target: [2.4, 0, 2.8],
  },
};

export const LandPolaroid3D: React.FC<LandPolaroid3DProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<LandPolaroidModelNodes | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  const { params } = usePatentPhysics("us-2543181-land-polaroid");
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("overview");

  const live = useLiveSimParams({
    developmentTimeSec: params.developmentTimeSec ?? 30,
    exposureFraction: params.exposureFraction ?? 0.6,
    reagentViscosityCp: params.reagentViscosityCp ?? 25000,
    rollerGapUm: params.rollerGapUm ?? 25,
    alkaliPh: params.alkaliPh ?? 12.6,
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

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050811);
    scene.fog = new THREE.FogExp2(0x050811, 0.06);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(...CAMERA_PRESETS.overview.pos);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(...CAMERA_PRESETS.overview.target);
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.6);
    dirLight.position.set(6, 10, 8);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const emeraldSpot = new THREE.SpotLight(0x10b981, 2.2);
    emeraldSpot.position.set(-4, 6, 4);
    emeraldSpot.angle = Math.PI / 4;
    emeraldSpot.penumbra = 0.5;
    scene.add(emeraldSpot);

    const amberSpot = new THREE.SpotLight(0xf59e0b, 1.8);
    amberSpot.position.set(5, 6, -3);
    amberSpot.angle = Math.PI / 4;
    amberSpot.penumbra = 0.5;
    scene.add(amberSpot);

    const model = createLandPolaroidModel(live.current);
    modelRef.current = model;
    scene.add(model.group);

    const animate = () => {
      timeRef.current += 0.016;
      controls.update();

      model.update(timeRef.current, live.current);

      renderer.render(scene, camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

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
      renderer.forceContextLoss();
      renderer.dispose();
      model.dispose();
      ambientLight.dispose();
      dirLight.dispose();
      emeraldSpot.dispose();
      amberSpot.dispose();
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
                ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            {CAMERA_PRESETS[key].label}
          </button>
        ))}
      </div>

      {/* Historic Model 95 Banner */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 px-3 py-2 rounded-lg border border-slate-800 backdrop-blur-sm pointer-events-none">
        <div className="text-xs font-mono font-semibold text-emerald-400">
          US 2,543,181 — Edwin Land Polaroid Instant Film & Camera
        </div>
        <div className="text-[10px] font-mono text-slate-400">
          Diffusion Transfer Reversal with Rupturable Foil Pod & Squeegee Rollers
        </div>
      </div>
    </div>
  );
};
