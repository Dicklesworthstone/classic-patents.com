"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX, Waves } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { stepEricssonPropeller } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildEricssonPropellerModel } from "./ericssonPropellerModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "propeller_drum" | "helical_blades" | "sternpost" | "top";

export function EricssonPropeller3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Marine Hydrodynamics Parameters
  const { params } = usePatentPhysics("us-588-ericsson-propeller");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const shaftRpm = params.shaftRpm ?? 120;
  const ericson = stepEricssonPropeller({
    shaftRpm,
    bladePitchAngleDeg: params.bladePitchAngleDeg ?? 35,
  });
  const shipSpeedKnots = ericson.shipSpeedKnots;
  const [showWake, setShowWake] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const thrustKn = ericson.thrustKn.toFixed(1);
  const propulsiveEfficiencyPct = ((1 - ericson.slipFraction) * 100).toFixed(1);

  const live = useLiveSimParams({
    shaftRpm,
    shipSpeedKnots,
    showWake,
    isAudioMuted,
    thrustKn: ericson.thrustKn,
    bladePitchAngleDeg: params.bladePitchAngleDeg ?? 35,
    propulsiveEfficiencyPct: Number(propulsiveEfficiencyPct),
    shaftOmegaRadPerS: ericson.shaftOmegaRadPerS,
    wakeSwirlScale: ericson.wakeSwirlScale,
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
        camera.position.set(9.0, 6.0, 10.5);
        controls.target.set(0, 0, 0);
        break;
      case "propeller_drum":
        camera.position.set(0, 0.5, 4.2);
        controls.target.set(0, 0, 0);
        break;
      case "helical_blades":
        camera.position.set(2.5, 1.8, 3.0);
        controls.target.set(0.5, 0, 0);
        break;
      case "sternpost":
        camera.position.set(-3.2, 1.2, 3.5);
        controls.target.set(-1.5, 0, 0);
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
      cameraPos: [9.0, 6.0, 10.5],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Build authentic procedural model
    const model = buildEricssonPropellerModel();
    scene.add(model.rootGroup);

    // Animation Loop
    let reqId: number;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = 1 / 60;
      const p = live.current;

      const omegaRadPerSec = p.shaftOmegaRadPerS ?? (p.shaftRpm * 2 * Math.PI) / 60;

      // Forward drum rotates clockwise
      model.forwardDrumGroup.rotation.x += omegaRadPerSec * delta;
      model.outerShaftMesh.rotation.x += omegaRadPerSec * delta;

      // Aft drum counter-rotates counter-clockwise (US 588 Tandem Counter-Rotation)
      model.aftDrumGroup.rotation.x -= omegaRadPerSec * delta;
      model.innerShaftMesh.rotation.x -= omegaRadPerSec * delta;

      // Animate wake spiral streamlines
      const pos = model.wakePositions;
      for (let i = 0; i < model.wakeCount; i++) {
        const idx = i * 3;
        pos[idx] += (p.shipSpeedKnots / 8.5) * 6.5 * delta;
        const y = pos[idx + 1];
        const z = pos[idx + 2];
        let curAngle = Math.atan2(z, y);
        curAngle += omegaRadPerSec * delta * (p.wakeSwirlScale ?? 0.4);
        const r = Math.sqrt(y * y + z * z);
        pos[idx + 1] = Math.cos(curAngle) * r;
        pos[idx + 2] = Math.sin(curAngle) * r;

        if (pos[idx] > 8.5) {
          pos[idx] = 1.8;
        }
      }
      model.wakePoints.geometry.attributes.position.needsUpdate = true;
      model.wakePoints.visible = p.showWake;
      const wakeMat = model.materials.wakeMat;
      wakeMat.opacity = Math.min(0.95, 0.3 + (p.thrustKn / 30) * 0.65);
      wakeMat.color.setHex(p.thrustKn > 12 ? 0x38bdf8 : 0x64748b);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
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
            Ericsson Screw Propeller 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 588 (1838)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["propeller_drum", "Propeller Drum"],
              ["helical_blades", "Helical Blades"],
              ["sternpost", "Sternpost"],
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
            onClick={() => setShowWake(!showWake)}
            title={showWake ? "Hide Wake Streamlines" : "Show Wake Streamlines"}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showWake
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "text-parchment-400 hover:text-white hover:bg-parchment-800"
            }`}
          >
            <Waves className="w-4 h-4" />
          </button>
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
        title="Ericsson marine propulsion"
        chips={[
          { label: "Shaft", value: String(Math.round(shaftRpm)), unit: "rpm" },
          {
            label: "Speed",
            value: shipSpeedKnots.toFixed(1),
            unit: "knots",
            tone: shipSpeedKnots > 8 ? "ok" : "warn",
          },
          { label: "Thrust", value: thrustKn, unit: "kN" },
          { label: "Efficiency", value: propulsiveEfficiencyPct, unit: "%" },
          { label: "Pitch", value: String(ericson.pitchMeters.toFixed(2)), unit: "m/rev" },
          { label: "Slip", value: String((ericson.slipFraction * 100).toFixed(1)), unit: "%" },
        ]}
      />
    </div>
  );
}
