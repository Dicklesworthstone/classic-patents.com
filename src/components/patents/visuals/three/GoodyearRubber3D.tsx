"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { FrankenSimEngine } from "@/physics/engine";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildGoodyearRubberModel, updateGoodyearRubberKinematics } from "./goodyearRubberModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "chains" | "bridges" | "clamps" | "stress_vectors" | "top";

export function GoodyearRubber3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Vulcanization Chemistry & Physics State
  const { params } = usePatentPhysics("us-3633-goodyear-rubber");
  const sulfurWeightPct = params.sulfurPct ?? 8;
  const cureTemperatureCelsius = params.vulcanTemp ?? 145;
  const appliedTensileStretch = params.appliedTensileStretch ?? 1.8;
  const showSulfurCrosslinks = params.showSulfurCrosslinks !== 0;
  const showStressVectors = params.showStressVectors !== 0;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  // Thermodynamic & Polymer Mechanics Calculations
  const rubberPhysics = FrankenSimEngine.stepGoodyearRubber(
    cureTemperatureCelsius,
    sulfurWeightPct,
    30,
    appliedTensileStretch,
    params.specimenTempC ?? 35,
  );

  useFrankenSimPhysics("us-3633-goodyear-rubber", {
    domain: "continuum_polymers",
    timestampMs: Date.now(),
    timeStepDt: 0.016,
    refusal: { isRefused: false },
    continuum: {
      tensileStressMpa: rubberPhysics.tensileStrengthMpa,
      tensileStrainPct: rubberPhysics.elasticReturnPct,
      elasticModulusGpa: 0,
      crossLinkDensityMolesPerCm3: rubberPhysics.crossLinkDensity,
      stitchFrequencyHz: 0,
      feedVelocityMmPs: 0,
      buoyancyLiftForceKiloNewtons: 0,
    },
  });
  const isVulcanized = !rubberPhysics.isStickyOrBrittle;
  const isGlassy = rubberPhysics.isGlassy;

  const live = useLiveSimParams({
    appliedTensileStretch,
    showSulfurCrosslinks,
    showStressVectors,
    isVulcanized,
    isGlassy,
    isCutaway,
    isAudioMuted,
    cureTemperatureCelsius,
    sulfurWeightPct,
    crossLinkDensity: rubberPhysics.crossLinkDensity,
    tensileStrengthPsi: rubberPhysics.tensileStrengthPsi,
    elasticReturnPct: rubberPhysics.elasticReturnPct,
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
        camera.position.set(11, 8, 13);
        controls.target.set(0, 0, 0);
        break;
      case "chains":
        camera.position.set(0, 1.5, 7.5);
        controls.target.set(0, 0, 0);
        break;
      case "bridges":
        camera.position.set(1.8, 0.8, 3.8);
        controls.target.set(1.5, 0, 0);
        break;
      case "clamps":
        camera.position.set(-6, 2.5, 5);
        controls.target.set(-4.5, 0, 0);
        break;
      case "stress_vectors":
        camera.position.set(6, 2.0, 4);
        controls.target.set(4.5, 0, 0);
        break;
      case "top":
        camera.position.set(0, 15, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const toggleSound = () => {
    toggleEngine(() => {
      soundEngine.playElastomerSnap(appliedTensileStretch);
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [11, 8, 13],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    const { rootGroup, nodes, materials, dispose } = buildGoodyearRubberModel();
    scene.add(rootGroup);

    let reqId: number;
    let timeSec = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const dt = 1 / 60;
      timeSec += dt;
      const p = live.current;

      updateGoodyearRubberKinematics(
        nodes,
        materials,
        dt,
        timeSec,
        p.appliedTensileStretch,
        p.tensileStrengthPsi,
        p.cureTemperatureCelsius,
        p.isVulcanized,
        p.isGlassy,
        p.showSulfurCrosslinks,
        p.showStressVectors,
        p.isCutaway,
      );

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      dispose();
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
            Vulcanized Rubber 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 3,633 (1844)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["chains", "Polymer Chains"],
              ["bridges", "Sulfur Bridges"],
              ["clamps", "Tensile Clamps"],
              ["stress_vectors", "Stress Vectors"],
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
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Solid Network" : "Cutaway View"}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-sans rounded-lg transition-colors ${
              isCutaway
                ? "bg-amber-600/30 text-amber-200 border border-amber-500/40"
                : "text-parchment-300 hover:text-white hover:bg-parchment-800/60"
            }`}
          >
            {isCutaway ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isCutaway ? "Cutaway" : "Solid"}</span>
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
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            <Zap className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
        title="Goodyear vulcanized elastomer"
        chips={[
          { label: "Cure Temp", value: `${cureTemperatureCelsius}`, unit: "°C" },
          { label: "Sulfur", value: `${sulfurWeightPct}`, unit: "wt%" },
          {
            label: "Tensile",
            value: String(Math.round(rubberPhysics.tensileStrengthPsi)),
            unit: "psi",
          },
          { label: "Modulus", value: rubberPhysics.tensileStrengthMpa.toFixed(2), unit: "MPa" },
          {
            label: "Crosslink ρ",
            value: rubberPhysics.crossLinkDensity.toExponential(2),
            unit: "mol/cm³",
          },
          {
            label: "Elastic Return",
            value: `${rubberPhysics.elasticReturnPct.toFixed(1)}`,
            unit: "%",
          },
          {
            label: "Glass Tg",
            value: `${rubberPhysics.glassTransitionTempC.toFixed(0)}`,
            unit: "°C",
          },
          { label: "Stretch λ", value: `${appliedTensileStretch.toFixed(2)}`, unit: "x" },
        ]}
      />
    </div>
  );
}
