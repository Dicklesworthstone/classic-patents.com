"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { stepRillieuxEvaporator } from "@/physics/rillieuxEvaporatorKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import {
  createRillieuxEvaporatorModel,
  type RillieuxEvaporatorModelNodes,
} from "./rillieuxEvaporatorModel";
import { useLiveSimParams } from "./useLiveSimParams";

interface Rillieux3DProps {
  className?: string;
}

type CameraPreset = "overview" | "pan1" | "pan2" | "pan3" | "condenser";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { label: string; pos: [number, number, number]; target: [number, number, number] }
> = {
  overview: {
    label: "3-Effect Cascade Overview",
    pos: [0, 8.0, 14.0],
    target: [0, 2.0, 0],
  },
  pan1: {
    label: "Effect 1 (Atmospheric)",
    pos: [-4.5, 4.0, 6.0],
    target: [-4.5, 2.0, 0],
  },
  pan2: {
    label: "Effect 2 (Mid Vacuum)",
    pos: [0, 4.0, 6.0],
    target: [0, 2.0, 0],
  },
  pan3: {
    label: "Effect 3 (High Vacuum)",
    pos: [4.5, 4.0, 6.0],
    target: [4.5, 2.0, 0],
  },
  condenser: {
    label: "Barometric Condenser",
    pos: [7.0, 5.0, 5.0],
    target: [6.5, 3.0, 0],
  },
};

export const RillieuxEvaporator3D: React.FC<Rillieux3DProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<RillieuxEvaporatorModelNodes | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  const { params } = usePatentPhysics("us-3237-rillieux-evaporator");
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("overview");

  const live = useLiveSimParams({
    juiceFeedRateKgPerH: params.juiceFeedRateKgPerH ?? 10000,
    initialBrixDeg: params.initialBrixDeg ?? 14,
    targetBrixDeg: params.targetBrixDeg ?? 65,
    numberOfEffects: params.numberOfEffects ?? 3,
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
    scene.fog = new THREE.FogExp2(0x050811, 0.05);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(...CAMERA_PRESETS.overview.pos);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(...CAMERA_PRESETS.overview.target);
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(6, 12, 8);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const model = createRillieuxEvaporatorModel();
    modelRef.current = model;
    scene.add(model.group);

    const animate = () => {
      timeRef.current += 0.016;
      controls.update();

      const p = live.current;
      const state = stepRillieuxEvaporator({
        juiceFeedRateKgPerH: p.juiceFeedRateKgPerH,
        initialBrixDeg: p.initialBrixDeg,
        targetBrixDeg: p.targetBrixDeg,
        numberOfEffects: p.numberOfEffects,
      });

      model.update(state, timeRef.current);

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
      model.dispose();
      renderer.forceContextLoss();
      renderer.dispose();
      ambientLight.dispose();
      dirLight.dispose();
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

      <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 px-3 py-2 rounded-lg border border-slate-800 backdrop-blur-sm pointer-events-none">
        <div className="text-xs font-mono font-semibold text-amber-400">
          US 3,237 — Norbert Rillieux Multiple-Effect Evaporator
        </div>
        <div className="text-[10px] font-mono text-slate-400">
          Triple-Effect Latent Heat Recovery Calandria Cascade
        </div>
      </div>
    </div>
  );
};
