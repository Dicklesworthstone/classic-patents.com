"use client";

import { Camera, Compass, Eye, EyeOff, Layers, Play, RotateCcw, Wind } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ensureFlyerWasm, flyerAeroSource, flyerKernelSource } from "@/physics/flyerWasm";
import { TickScheduler } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { identityAeroBody, stepWrightAeroBody } from "@/physics/wrightAeroBody";
import {
  readWrightControls,
  stepWrightFlyerSi,
  WRIGHT_PATENT_ID,
  wrightHoverY,
} from "@/physics/wrightKernel";
import {
  createGlowPointTexture,
  createThreeStudioScene,
  type StudioContext,
} from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import {
  buildWrightFlyerAirframe,
  FLYER_DIM,
  updateWrightFlyerKinematics,
} from "./wrightFlyerAirframe";

const FIXED_RENDER_STEP_S = 1 / 60;

type CameraPreset = "iso" | "wing_warp" | "canard" | "rudder" | "engine_props" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [7.6, 3.2, 8.4], target: [0, 0.15, 0] },
  wing_warp: { pos: [-6.5, 1.8, 4.2], target: [-4.5, 0.2, 0] },
  canard: { pos: [0, 1.2, 5.5], target: [0, 0.4, 2.5] },
  rudder: { pos: [0, 1.4, -6.0], target: [0, 0.4, -2.5] },
  engine_props: { pos: [2.8, 1.2, -1.8], target: [0, 0.2, -0.5] },
  top: { pos: [0, 13.5, 0.1], target: [0, 0, 0] },
};

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

  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [showStreamlines, setShowStreamlines] = useState<boolean>(true);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [isAutoFlying, setIsAutoFlying] = useState<boolean>(true);
  const [kernelLabel, setKernelLabel] = useState(flyerKernelSource());
  const [aeroLabel, setAeroLabel] = useState(flyerAeroSource());
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
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  useEffect(() => {
    ensureFlyerWasm().then(() => {
      setKernelLabel(flyerKernelSource());
      setAeroLabel(flyerAeroSource());
    });

    const container = containerRef.current;
    if (!container) return;

    const iso = CAMERA_PRESETS.iso;
    const studio = createThreeStudioScene({
      container,
      cameraPos: iso.pos,
      targetPos: iso.target,
      fov: 38,
    });
    studioRef.current = studio;

    const { scene, camera, renderer, controls } = studio;
    controls.setRadius(11);

    const airframe = buildWrightFlyerAirframe();
    const flyerGroup = airframe.group;
    scene.add(flyerGroup);

    // --- AERODYNAMIC AIRFLOW STREAMLINE PARTICLES ---
    const particleCount = 280;
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
      size: 0.5,
      map: glowTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
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
    let reqId: number;
    let renderedSteps = 0;
    let aero = identityAeroBody();
    const scheduler = new TickScheduler(1 / 120, 0, 3);

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      renderedSteps += 1;
      const delta = FIXED_RENDER_STEP_S;
      const elapsed = renderedSteps * FIXED_RENDER_STEP_S;

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

      // Streamline Flow Particle Physics
      const posArr = particlePositions;
      const flowSpeed = p.streamFlowSpeed * delta;

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        posArr[idx + 2] -= flowSpeed;

        // Downwash deflection as airflow passes the wings
        if (posArr[idx + 2] < 1 && posArr[idx + 2] > -4) {
          posArr[idx + 1] -= p.downwashSpeed * delta;
        }

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

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      for (const tex of airframe.textures) tex.dispose();
      studio.dispose();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Camera Views Bar (Top-Left) */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-12rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
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

        {/* Camera & Toggle Controls (Top-Right) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap justify-end gap-1.5 sm:gap-2 max-w-[90%]">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Switch to Solid Fabric" : "Switch to Wing Truss Cutaway"}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              isCutaway
                ? "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-600"
                : "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5 inline sm:mr-1" />
            <span className="hidden md:inline">Cutaway</span>
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              showUiOverlay
                ? "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
                : "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-600"
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
            onClick={() => setShowStreamlines(!showStreamlines)}
            className={`p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              showStreamlines
                ? "bg-amber-700 text-white border-amber-800 dark:bg-amber-600"
                : "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700"
            }`}
          >
            <Wind className="w-3.5 h-3.5 inline sm:mr-1" />
            <span className="hidden sm:inline">Streamlines</span>
          </button>
          <button
            type="button"
            onClick={() => setShowVectors(!showVectors)}
            className={`p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              showVectors
                ? "bg-sky-700 text-white border-sky-800 dark:bg-sky-600"
                : "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700"
            }`}
          >
            <span className="hidden sm:inline">Force </span>Vectors
          </button>
          <button
            aria-label={isAutoFlying ? "Freeze flight" : "Resume live flight"}
            type="button"
            onClick={() => setIsAutoFlying(!isAutoFlying)}
            className={`p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
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
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-parchment-50/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-800 dark:text-ink-200 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-xs"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Airspeed</span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">{airspeedMph} mph</span>
            </div>
            <input
              type="range"
              min="15"
              max="45"
              step="1"
              value={airspeedMph}
              onChange={(e) => updateParam("speed", Number.parseInt(e.target.value, 10))}
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Wing Warp Angle</span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">{wingWarpDeg}°</span>
            </div>
            <input
              type="range"
              min="-12"
              max="12"
              step="0.5"
              value={wingWarpDeg}
              onChange={(e) => updateParam("warp", Number.parseFloat(e.target.value))}
              className="w-full accent-cyan-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Pitch Canard</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">{elevatorPitchDeg}°</span>
            </div>
            <input
              type="range"
              min="-15"
              max="15"
              step="0.5"
              value={elevatorPitchDeg}
              onChange={(e) => updateParam("elevator", Number.parseFloat(e.target.value))}
              className="w-full accent-emerald-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Coupled Rudder</span>
              <span className="text-purple-700 dark:text-purple-400 font-mono font-bold">{rudderYawDeg}°</span>
            </div>
            <input
              type="range"
              min="-20"
              max="20"
              step="0.5"
              value={rudderYawDeg}
              onChange={(e) => updateParam("rudder", Number.parseFloat(e.target.value))}
              className="w-full accent-purple-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
