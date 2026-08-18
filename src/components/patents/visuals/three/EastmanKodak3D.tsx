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

type CameraPreset = "iso" | "roll_film" | "barrel_shutter" | "lens_aperture" | "top";

export function EastmanKodak3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);

  // Photographic Optics Parameters
  const { params } = usePatentPhysics("us-388850-eastman-kodak");
  const shutterSpeedSec = (() => {
    const raw = params.shutterSpeed ?? 0.05;
    return raw > 1 ? 1 / raw : raw;
  })();
  const shutterFractionSec = Math.round(1 / shutterSpeedSec);
  const kodak = FrankenSimEngine.stepEastmanKodak({
    shutterSpeedSec,
    apertureFNumber: params.apertureStop ?? 9,
    subjectDistanceM: params.subjectDist ?? 3,
  });
  const exposureCount = 100;
  const filmFormatInches = 2.5; // Circular image
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    shutterFractionSec,
    isAudioMuted,
    exposureValueEv: kodak.exposureValueEv,
    hyperfocalM: kodak.hyperfocalM,
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
        camera.position.set(8.5, 6.5, 9.5);
        controls.target.set(0, 0, 0);
        break;
      case "roll_film":
        camera.position.set(0, 2.0, 3.2);
        controls.target.set(0, 0.4, 0);
        break;
      case "barrel_shutter":
        camera.position.set(2.8, 1.2, 3.0);
        controls.target.set(1.4, 0, 0);
        break;
      case "lens_aperture":
        camera.position.set(3.5, 0.5, 2.0);
        controls.target.set(2.2, 0, 0);
        break;
      case "top":
        camera.position.set(0, 11.0, 0.1);
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
      cameraPos: [8.5, 6.5, 9.5],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Materials
    const moroccoLeatherMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.75,
      metalness: 0.1,
    });

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.22,
      metalness: 0.9,
    });

    const rollFilmMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.35,
      metalness: 0.1,
    });

    const glassLensMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.05,
      metalness: 0.1,
      transparent: true,
      opacity: 0.7,
    });

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Black Morocco Leather Covered Box Camera Body (Claim 1)
    const boxBody = new THREE.Mesh(new THREE.BoxGeometry(4.8, 3.8, 3.8), moroccoLeatherMat);
    boxBody.castShadow = true;
    rootGroup.add(boxBody);

    // 2. Continuous Flexible Roll-Film Spool Mechanism (Claim 1 & Claim 2)
    const filmGroup = new THREE.Group();
    rootGroup.add(filmGroup);

    // Supply & Take-Up Spools
    [-1.6, 1.6].forEach((sx) => {
      const spool = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 3.2, 16), rollFilmMat);
      spool.position.set(sx, 0, -1.2);
      filmGroup.add(spool);
    });

    // Film Plane Backplate
    const filmBack = new THREE.Mesh(new THREE.BoxGeometry(3.2, 3.0, 0.05), rollFilmMat);
    filmBack.position.set(0, 0, -1.2);
    filmGroup.add(filmBack);

    // 3. Rotating Cylindrical Barrel Shutter (Claim 1)
    const shutterGroup = new THREE.Group();
    shutterGroup.position.set(2.4, 0, 0);
    rootGroup.add(shutterGroup);

    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.8, 24), brassMat);
    barrel.rotation.z = Math.PI / 2;
    shutterGroup.add(barrel);

    // Glass Doublet Meniscus Lens
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.1, 24), glassLensMat);
    lens.rotation.z = Math.PI / 2;
    lens.position.x = 0.45;
    shutterGroup.add(lens);

    // Winding Key on Top Deck
    const key = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 8, 16), brassMat);
    key.rotation.x = Math.PI / 2;
    key.position.set(-1.6, 2.1, -1.2);
    rootGroup.add(key);

    // Animation Loop
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;
      // Rotary barrel period ≈ shutter open time (US 388,850)
      const omega = (2 * Math.PI) / Math.max(0.01, 1 / p.shutterFractionSec);
      barrel.rotation.x += omega * delta;

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
            Eastman Kodak Camera 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 388,850 (1888)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["roll_film", "Roll Film Spool"],
              ["barrel_shutter", "Barrel Shutter"],
              ["lens_aperture", "Lens Aperture"],
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
        title="Eastman roll-holder"
        chips={[
          { label: "Shutter", value: `1/${shutterFractionSec}`, unit: "s" },
          { label: "EV", value: kodak.exposureValueEv.toFixed(1) },
          { label: "Hyperfocal", value: kodak.hyperfocalM.toFixed(1), unit: "m" },
          { label: "Film", value: `${filmFormatInches} in · ${exposureCount} exp` },
        ]}
      />
    </div>
  );
}
