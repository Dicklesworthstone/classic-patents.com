"use client";

import {
  Camera,
  Compass,
  Eye,
  EyeOff,
  Layers,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Wind,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { evaluateWrightAirflowVelocityVector } from "@/physics/fieldTextures";
import { ensureFlyerWasm, flyerAeroSource, flyerKernelSource } from "@/physics/flyerWasm";
import { createStudioClock, TickScheduler } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { identityAeroBody, stepWrightAeroBody } from "@/physics/wrightAeroBody";
import {
  readWrightControls,
  stepWrightFlyerSi,
  WRIGHT_PATENT_ID,
  wrightHoverY,
} from "@/physics/wrightKernel";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import {
  createGlowPointTexture,
  createThreeStudioScene,
  type StudioContext,
} from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";
import {
  buildWrightFlyerAirframe,
  FLYER_DIM,
  updateWrightFlyerKinematics,
} from "./wrightFlyerAirframe";
import {
  type WrightFlyerCameraPreset as CameraPreset,
  wrightFlyerViewForViewport,
} from "./wrightFlyerCamera";

function deterministicUnit(index: number, channel: number, generation = 0): number {
  const sample =
    Math.sin((index + 1) * 12.9898 + (channel + 1) * 78.233 + (generation + 1) * 37.719) *
    43758.5453;
  return sample - Math.floor(sample);
}

function resetStreamlineParticle(
  positions: Float32Array,
  particleIndex: number,
  generation: number,
) {
  const offset = particleIndex * 3;
  positions[offset] =
    (deterministicUnit(particleIndex, 0, generation) - 0.5) * (FLYER_DIM.span + 2);
  positions[offset + 1] =
    (deterministicUnit(particleIndex, 1, generation) - 0.5) * (FLYER_DIM.gap + 1.4);
  positions[offset + 2] = 8 + deterministicUnit(particleIndex, 2, generation) * 5;
}

export function WrightFlyer3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { params, updateParam } = usePatentPhysics(WRIGHT_PATENT_ID);
  const controls = readWrightControls(params);
  const si = stepWrightFlyerSi(controls);
  const {
    wingWarpDeg,
    rudderDeg: rudderYawDeg,
    elevatorDeg: elevatorPitchDeg,
    airspeedMph,
    coupled: isCoupled,
  } = controls;

  useFrankenSimPhysics(WRIGHT_PATENT_ID, {
    domain: "aerodynamics_mbd",
    timestampMs: 0,
    timeStepDt: 1 / 60,
    refusal: {
      isRefused: si.trussRefused,
      ...(si.trussRefused ? { reason: "Stay-wire truss solve refused this load state." } : {}),
    },
    aero: {
      airspeedMps: si.airspeedMps,
      altitudeMeters: 0,
      angleOfAttackRad: 0,
      sideslipRad: 0,
      pitchRateRps: 0,
      rollRateRps: 0,
      yawRateRps: 0,
      liftNewtons: si.liftNewtons,
      inducedDragNewtons: si.inducedDragNewtons,
      parasiticDragNewtons: si.parasiticDragNewtons,
      thrustNewtons: 0,
      elevatorDeflectionDeg: elevatorPitchDeg,
      rudderDeflectionDeg: rudderYawDeg,
      wingWarpDeflectionDeg: wingWarpDeg,
    },
  });

  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [showStreamlines, setShowStreamlines] = useState<boolean>(true);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [isAutoFlying, setIsAutoFlying] = useState<boolean>(true);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: isCoupled });
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const [kernelLabel, setKernelLabel] = useState(flyerKernelSource);
  const [aeroLabel, setAeroLabel] = useState(flyerAeroSource);
  const live = useLiveSimParams({
    wingWarpDeg,
    rudderYawDeg,
    elevatorPitchDeg,
    airspeedMph,
    showStreamlines,
    showVectors,
    isAutoFlying,
    isCutaway,
    liftVectorLength: si.liftVectorLength,
    dragVectorLength: si.dragVectorLength,
    netYawNm: si.netYawNm,
    coupled: isCoupled ? 1 : 0,
    cl: si.cl,
    propDisplayOmegaRadPerS: si.propDisplayOmegaRadPerS,
    streamFlowSpeed: si.streamFlowSpeed,
    downwashSpeed: si.downwashSpeed,
    cradleStudioX: si.cradleStudioX,
    leftBayTension: si.leftBayTension,
    rightBayTension: si.rightBayTension,
  });

  const studioRef = useRef<StudioContext | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = wrightFlyerViewForViewport(preset, containerRef.current?.clientWidth ?? 1000);
    studioRef.current?.controls.setView(camera.pos, camera.target);
  };

  useEffect(() => {
    ensureFlyerWasm().then(() => {
      setKernelLabel(flyerKernelSource());
      setAeroLabel(flyerAeroSource());
    });

    const container = containerRef.current;
    if (!container) return;

    const initialCamera = wrightFlyerViewForViewport("iso", container.clientWidth);
    const studio = createThreeStudioScene({
      container,
      cameraPos: initialCamera.pos,
      targetPos: initialCamera.target,
      fov: 38,
    });
    studioRef.current = studio;

    const { scene, camera, renderer, controls } = studio;

    const airframe = buildWrightFlyerAirframe();
    const flyerGroup = airframe.group;
    scene.add(flyerGroup);

    // --- AERODYNAMIC AIRFLOW STREAMLINE PARTICLES ---
    // A sparse, translucent field communicates flow without burying the
    // claimed wing-warp / rudder geometry at high-control settings.
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleGenerations = new Uint32Array(particleCount);

    const glowTex = createGlowPointTexture();

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      resetStreamlineParticle(particlePositions, i, particleGenerations[i]);

      // Color code by energy: Cyan-Blue (high speed/low pressure) to Amber (stagnation)
      particleColors[idx] = 0.2 + deterministicUnit(i, 3) * 0.4;
      particleColors[idx + 1] = 0.7 + deterministicUnit(i, 4) * 0.3;
      particleColors[idx + 2] = 1.0;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.34,
      map: glowTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const streamlinePoints = new THREE.Points(particleGeo, particleMat);
    scene.add(streamlinePoints);

    // --- 3D AERODYNAMIC FORCE VECTORS ---
    const vectorsGroup = new THREE.Group();
    scene.add(vectorsGroup);

    const createVectorArrow = (color: number, dir: THREE.Vector3, length: number) => {
      const arrow = new THREE.ArrowHelper(
        dir.clone().normalize(),
        new THREE.Vector3(0, 0, 0),
        length,
        color,
        0.4,
        0.25,
      );
      return arrow;
    };

    const liftVector = createVectorArrow(0x10b981, new THREE.Vector3(0, 1, 0), 2.5);
    const dragVector = createVectorArrow(0xef4444, new THREE.Vector3(0, 0, -1), 1.2);
    const thrustVector = createVectorArrow(0x3b82f6, new THREE.Vector3(0, 0, 1), 1.8);
    const weightVector = createVectorArrow(0xf59e0b, new THREE.Vector3(0, -1, 0), 2.2);

    vectorsGroup.add(liftVector);
    vectorsGroup.add(dragVector);
    vectorsGroup.add(thrustVector);
    vectorsGroup.add(weightVector);

    // --- RENDER LOOP & REAL-TIME PHYSICS SIMULATION ---
    // Host-fed time: dt comes from the rAF timestamp via createStudioClock
    // (bounded catch-up), so simulation speed no longer scales with the
    // display's refresh rate, and the loop freezes while the canvas is
    // scrolled offscreen.
    let reqId: number;
    let aero = identityAeroBody();
    const scheduler = new TickScheduler(1 / 120, 0, 3);
    const studioClock = createStudioClock();

    const animate = (frameTimeMs: number) => {
      reqId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const { dt: delta, simTimeSec: elapsed } = studioClock.pump(frameTimeMs);

      const p = live.current;
      const controlsNow = {
        airspeedMph: p.airspeedMph,
        wingWarpDeg: p.wingWarpDeg,
        rudderDeg: p.rudderYawDeg,
        elevatorDeg: p.elevatorPitchDeg,
        coupled: p.coupled >= 0.5,
      };
      const siNow = stepWrightFlyerSi(controlsNow);

      if (p.isAutoFlying) {
        scheduler.pump(elapsed, () => {
          aero = stepWrightAeroBody(aero, siNow, controlsNow, 1 / 120);
        });
        flyerGroup.quaternion.set(
          aero.quaternion[1],
          aero.quaternion[2],
          aero.quaternion[3],
          aero.quaternion[0],
        );
        flyerGroup.position.y = wrightHoverY(elapsed, siNow.hoverOmegaRadPerS, siNow.hoverAmpM);
      } else {
        aero = identityAeroBody();
        flyerGroup.quaternion.identity();
        flyerGroup.position.y = 0;
      }

      // Interplane airframe kinematics & fabric cutaway
      updateWrightFlyerKinematics(
        airframe,
        delta,
        p.wingWarpDeg,
        p.rudderYawDeg,
        p.elevatorPitchDeg,
        p.propDisplayOmegaRadPerS,
        p.cradleStudioX,
        p.leftBayTension,
        p.rightBayTension,
        p.isCutaway,
      );

      // Streamline Flow Particle Physics driven by admitted biplane airflow velocity field
      const posArr = particlePositions;
      const speedScale = (siNow.airspeedMps / 12.5) * 0.35;

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const px = posArr[idx];
        const py = posArr[idx + 1];
        const pz = posArr[idx + 2];

        // Evaluate genuine 3D velocity vector [vx, vy, vz]
        const [vx, vy, vz] = evaluateWrightAirflowVelocityVector(pz, py, px, {
          airspeedMps: siNow.airspeedMps,
          angleOfAttackRad: (5 * Math.PI) / 180,
          wingWarpDeg: p.wingWarpDeg,
          elevatorPitchDeg: p.elevatorPitchDeg,
          rudderYawDeg: p.rudderYawDeg,
          coupled: p.coupled >= 0.5,
        });

        posArr[idx] += vz * delta * speedScale;
        posArr[idx + 1] += vy * delta * speedScale;
        posArr[idx + 2] -= Math.max(3, vx) * delta * speedScale;

        // Reset particle when it travels past the tail
        if (posArr[idx + 2] < -8) {
          particleGenerations[i] += 1;
          resetStreamlineParticle(posArr, i, particleGenerations[i]);
        }
      }
      particleGeo.attributes.position.needsUpdate = true;
      streamlinePoints.visible = p.showStreamlines;
      vectorsGroup.visible = p.showVectors;

      // Update Force Vector Scales
      liftVector.setLength(p.liftVectorLength, 0.4, 0.25);
      dragVector.setLength(p.dragVectorLength, 0.3, 0.2);

      controls.update();
      renderer.render(scene, camera);
    };

    // Start via rAF so the first pump() receives a real frame timestamp.
    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      for (const tex of airframe.textures) tex.dispose();
      studio.dispose();
      studioRef.current = null;
    };
  }, [live]);

  useEffect(() => {
    const restoreResponsiveView = () => {
      const container = containerRef.current;
      if (!container) return;
      const camera = wrightFlyerViewForViewport(activeCamera, container.clientWidth);
      studioRef.current?.controls.setView(camera.pos, camera.target);
    };

    window.addEventListener("resize", restoreResponsiveView);
    return () => window.removeEventListener("resize", restoreResponsiveView);
  }, [activeCamera]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Wright Brothers Flying-Machine 3D</div>
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Camera Views Bar (Top-Left) */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-9.5rem)] sm:max-w-[calc(100%-28rem)] gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["wing_warp", "Wing Warp"],
                ["canard", "Pitch Canard"],
                ["rudder", "Coupled Rudder"],
                ["engine_props", "Engine & Props"],
                ["top", "Plan View"],
              ] as const
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyCameraPreset(preset)}
                className={`px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                  activeCamera === preset
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Live HUD Telemetry Overlay (Docked Bottom-Left to prevent overlap with top-right controls) */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex flex-col gap-1.5 sm:gap-2 pointer-events-none max-w-[calc(100%-1.5rem)] sm:max-w-sm transition-opacity duration-200">
            <div className="bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md p-2.5 sm:px-3.5 sm:py-2.5 rounded-xl border border-parchment-300 dark:border-ink-800 shadow-md">
              <div className="text-[10px] sm:text-[11px] font-sans text-amber-800 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center justify-between gap-1.5 border-b border-parchment-200 dark:border-ink-800/80 pb-1.5 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Aerodynamic State Vector
                </span>
                <span
                  className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md ${
                    isCoupled
                      ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30"
                      : "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-500/30"
                  }`}
                >
                  {isCoupled ? "Claim 18 Coupled" : "Unlinked Cables"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] font-sans">
                <div className="flex justify-between">
                  <span className="text-ink-600 dark:text-ink-400">Total Lift:</span>
                  <span className="font-mono font-bold text-emerald-800 dark:text-emerald-400">
                    {Math.round(si.liftNewtons)} N
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-600 dark:text-ink-400">Total Drag:</span>
                  <span className="font-mono font-bold text-rose-800 dark:text-rose-400">
                    {Math.round(si.totalDragNewtons)} N
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-600 dark:text-ink-400">Lift/Drag (L/D):</span>
                  <span className="font-mono font-bold text-amber-800 dark:text-amber-400">
                    {si.liftToDrag.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-600 dark:text-ink-400">Net Yaw:</span>
                  <span
                    className={`font-mono font-bold ${
                      si.adverseYawDominant
                        ? "text-rose-700 dark:text-rose-400"
                        : "text-emerald-700 dark:text-emerald-400"
                    }`}
                  >
                    {si.netYawNm > 0 ? `+${si.netYawNm.toFixed(1)}` : si.netYawNm.toFixed(1)} N·m
                  </span>
                </div>
                <div className="col-span-2 text-[9px] font-mono text-ink-500 dark:text-ink-400 pt-1 border-t border-parchment-200 dark:border-ink-800/60">
                  Attitude: host-integrated aerodynamic body ({aeroLabel}) · kernel {kernelLabel}
                </div>
                <div className="col-span-2 text-[9px] font-mono text-ink-500 dark:text-ink-400">
                  Guy wires: steel slack · amber working · red peak (high-AoA bay)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top-Right Action Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap justify-end items-center gap-1.5 sm:gap-2 max-w-[min(90%,26rem)] sm:max-w-[26rem]">
          <ClaimConstraintToggle
            patentId="us-821393-wright-flyer"
            claimStates={claimStates}
            onToggleClaim={(c, active) => {
              setClaimStates((prev) => ({ ...prev, [c]: active }));
              updateParam("coupled", active ? 1 : 0);
            }}
          />
          <button
            type="button"
            onClick={() => {
              setIsCutaway(!isCutaway);
              soundEngine.playSwitchClick();
            }}
            title={isCutaway ? "Switch to Solid Fabric" : "Switch to Wing Truss Cutaway"}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs flex items-center gap-1 ${
              isCutaway
                ? "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-700"
                : "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5 inline sm:mr-1" />
            <span className="hidden md:inline">{isCutaway ? "Cutaway" : "Solid"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            aria-label={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              showUiOverlay
                ? "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
                : "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-700"
            }`}
            title={showUiOverlay ? "Hide Overlay Telemetry" : "Show Overlay Telemetry"}
            aria-label={showUiOverlay ? "Hide Overlay Telemetry" : "Show Overlay Telemetry"}
          >
            {showUiOverlay ? (
              <EyeOff className="w-3.5 h-3.5 inline sm:mr-1" />
            ) : (
              <Eye className="w-3.5 h-3.5 inline sm:mr-1" />
            )}
            <span className="hidden md:inline">{showUiOverlay ? "Hide HUD" : "Show HUD"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowStreamlines(!showStreamlines);
              soundEngine.playSwitchClick();
            }}
            className={`p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs flex items-center gap-1 ${
              showStreamlines
                ? "bg-amber-700 text-white border-amber-800 dark:bg-amber-700"
                : "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700"
            }`}
          >
            <Wind className="w-3.5 h-3.5 inline sm:mr-1" />
            <span className="hidden sm:inline">Streamlines</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowVectors(!showVectors);
              soundEngine.playSwitchClick();
            }}
            className={`p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs flex items-center gap-1 ${
              showVectors
                ? "bg-sky-700 text-white border-sky-800 dark:bg-sky-600"
                : "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700"
            }`}
          >
            <Compass className="w-3.5 h-3.5 inline sm:mr-1" />
            <span className="hidden sm:inline">Vectors</span>
          </button>
          <button
            aria-label={isAutoFlying ? "Freeze flight" : "Resume live flight"}
            type="button"
            onClick={() => {
              setIsAutoFlying(!isAutoFlying);
              soundEngine.playSwitchClick();
            }}
            className={`p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs flex items-center gap-1 ${
              isAutoFlying
                ? "bg-emerald-700 text-white border-emerald-800 dark:bg-emerald-600"
                : "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700"
            }`}
          >
            <Play className="w-3.5 h-3.5 inline sm:mr-1" />
            <span className="hidden sm:inline">{isAutoFlying ? "Live Flight" : "Freeze"}</span>
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
        {/* Bottom-Right SI Telemetry Chip Strip (inside canvas viewport so the
          absolute anchoring resolves against the sim, not the page) */}
        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="WRIGHT 1903 3-AXIS AERODYNAMICS"
          chips={[
            {
              label: "Lift Force",
              value: `${si.liftNewtons.toFixed(0)}`,
              unit: "N",
              tone: "hot",
            },
            { label: "Drag Force", value: `${si.totalDragNewtons.toFixed(0)}`, unit: "N" },
            {
              label: "L/D Ratio",
              value: `${si.liftToDrag.toFixed(2)}`,
            },
            { label: "Lift Coeff (C_L)", value: `${si.cl.toFixed(3)}` },
            { label: "Airspeed", value: `${airspeedMph}`, unit: "mph" },
            { label: "Net Yaw", value: `${si.netYawNm.toFixed(1)}`, unit: "N·m" },
            {
              label: "Coupling",
              value: isCoupled ? "Warp + Rudder Interlock" : "Independent",
            },
            { label: "Flight Kernel", value: `${kernelLabel} / ${aeroLabel}` },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <SensitivitySlider
            id="airspeed"
            patentId={WRIGHT_PATENT_ID}
            paramKey="airspeed"
            label="Airspeed"
            value={airspeedMph}
            min={15}
            max={45}
            step={1}
            unit="mph"
            onChange={(val) => updateParam("airspeed", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="wingWarp"
            patentId={WRIGHT_PATENT_ID}
            paramKey="wingWarp"
            label="Wing Warp Angle"
            value={wingWarpDeg}
            min={-12}
            max={12}
            step={0.5}
            unit="°"
            thumb="cyan"
            onChange={(val) => updateParam("warp", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="elevator"
            patentId={WRIGHT_PATENT_ID}
            paramKey="elevator"
            label="Pitch Canard"
            value={elevatorPitchDeg}
            min={-15}
            max={15}
            step={0.5}
            unit="°"
            onChange={(val) => updateParam("elevator", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="rudder"
            patentId={WRIGHT_PATENT_ID}
            paramKey="rudder"
            label={isCoupled ? "Coupled Rudder (Slaved)" : "Independent Rudder"}
            value={rudderYawDeg}
            min={-20}
            max={20}
            step={0.5}
            unit="°"
            onChange={(val) => updateParam("rudder", val)}
            allParams={params}
          />
        </div>

        <PortHamiltonianEnergyStrip patentId={WRIGHT_PATENT_ID} params={params} className="mt-3" />
      </div>
    </div>
  );
}
