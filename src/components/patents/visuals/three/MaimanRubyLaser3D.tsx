"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { stepMaimanRubyLaser } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { createMaimanRubyLaserModel } from "./maimanRubyLaserModel";

export function MaimanRubyLaser3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { params, updateParam } = usePatentPhysics("us-3353115-maiman-ruby-laser");
  const [isFiring, setIsFiring] = useState(false);
  const isFiringRef = useRef(false);

  const pumpEnergy = params.pumpEnergyJoules ?? 150;
  const flashDuration = params.flashDurationMs ?? 1.0;
  const rodLength = params.rodLengthCm ?? 5.0;
  const outputReflectivity = params.outputMirrorReflectivity ?? 0.92;
  const temperature = params.crystalTemperatureKelvin ?? 300;

  const metrics = stepMaimanRubyLaser({
    pumpEnergyJoules: pumpEnergy,
    flashDurationMs: flashDuration,
    rodLengthCm: rodLength,
    outputMirrorReflectivity: outputReflectivity,
    crystalTemperatureKelvin: temperature,
  });

  const handleTriggerFlash = () => {
    setIsFiring(true);
    isFiringRef.current = true;
    setTimeout(() => {
      setIsFiring(false);
      isFiringRef.current = false;
    }, 700);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070b14);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(10, 8, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.05;
    orbitControls.target.set(3, 0.4, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight1.position.set(12, 18, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.6);
    dirLight2.position.set(-10, -5, -10);
    scene.add(dirLight2);

    // Grid Floor
    const grid = new THREE.GridHelper(30, 30, 0x334155, 0x1e293b);
    grid.position.y = -1.8;
    scene.add(grid);

    // 3D Laser Model
    const laserModel = createMaimanRubyLaserModel();
    scene.add(laserModel.nodes.group);

    let animId: number;
    let frame = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      frame += 1;
      const time = frame / 60;

      laserModel.update(
        {
          pumpEnergyJoules: pumpEnergy,
          flashDurationMs: flashDuration,
          rodLengthCm: rodLength,
          outputMirrorReflectivity: outputReflectivity,
          crystalTemperatureKelvin: temperature,
        },
        time,
        isFiringRef.current,
      );

      orbitControls.update();
      renderer.render(scene, camera);
    };

    animate();

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
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      laserModel.dispose();
      orbitControls.dispose();
      renderer.forceContextLoss();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [pumpEnergy, flashDuration, rodLength, outputReflectivity, temperature]);

  return (
    <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-950 p-4 shadow-2xl">
      <div
        className="relative h-[480px] w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-950"
        ref={containerRef}
      >
        <div className="absolute top-4 left-4 z-10 rounded-md border border-slate-800/80 bg-slate-900/80 px-3 py-2 backdrop-blur-md">
          <div className="font-mono text-xs font-bold text-slate-200">
            MAIMAN RUBY LASER 3D STUDIO (US 3,353,115)
          </div>
          <div className="text-[11px] text-slate-400">
            Interactive WebGL 3D Model • Synthetic Ruby Cylinder • Coiled Helical Flashlamp
          </div>
        </div>

        {isFiring && metrics.isLasing && (
          <div className="absolute bottom-4 left-4 z-10 animate-pulse rounded-md border border-rose-500/60 bg-rose-950/80 px-3 py-1.5 font-mono text-xs font-bold text-rose-300 backdrop-blur-md">
            ⚡ STIMULATED EMISSION PULSE ACTIVE (694.3 nm)
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-800/80 bg-slate-900/50 p-4">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-col gap-1">
            <label htmlFor="pumpEnergy3d" className="text-xs font-mono text-slate-400">
              Pump Energy: {pumpEnergy} J
            </label>
            <input
              id="pumpEnergy3d"
              type="range"
              min="50"
              max="500"
              step="10"
              value={pumpEnergy}
              onChange={(e) => updateParam("pumpEnergyJoules", Number(e.target.value))}
              className="h-1.5 w-36 accent-rose-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="outputMirror3d" className="text-xs font-mono text-slate-400">
              Output Coupler R2: {(outputReflectivity * 100).toFixed(0)}%
            </label>
            <input
              id="outputMirror3d"
              type="range"
              min="0.70"
              max="0.98"
              step="0.01"
              value={outputReflectivity}
              onChange={(e) => updateParam("outputMirrorReflectivity", Number(e.target.value))}
              className="h-1.5 w-32 accent-rose-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="temp3d" className="text-xs font-mono text-slate-400">
              Temperature: {temperature} K
            </label>
            <input
              id="temp3d"
              type="range"
              min="100"
              max="350"
              step="10"
              value={temperature}
              onChange={(e) => updateParam("crystalTemperatureKelvin", Number(e.target.value))}
              className="h-1.5 w-28 accent-rose-500"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleTriggerFlash}
          disabled={isFiring}
          className={`flex items-center gap-2 rounded-md px-6 py-2.5 font-mono text-xs font-bold transition ${
            isFiring
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/50"
              : "bg-rose-600 text-white hover:bg-rose-500 active:scale-95 shadow-lg shadow-rose-600/30"
          }`}
        >
          {isFiring ? "⚡ FLASH DISCHARGE ACTIVE" : "⚡ TRIGGER FLASH DISCHARGE"}
        </button>
      </div>
    </div>
  );
}
