"use client";

import { Compass, Eye, EyeOff, Play, Wind } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ensureFlyerWasm, flyerKernelSource } from "@/physics/flyerWasm";
import { TickScheduler } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { identityAeroBody, stepWrightAeroBody } from "@/physics/wrightAeroBody";
import {
  coupledRudderDeg,
  readWrightControls,
  stepWrightFlyerSi,
  WRIGHT_PATENT_ID,
} from "@/physics/wrightKernel";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { buildWrightFlyerAirframe, FLYER_DIM } from "./wrightFlyerAirframe";

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

  const airspeedFps = airspeedMph * 1.46667;
  const dynamicPressure = 0.5 * 0.0023769 * airspeedFps ** 2;

  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [showStreamlines, setShowStreamlines] = useState<boolean>(true);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [isAutoFlying, setIsAutoFlying] = useState<boolean>(true);
  const [kernelLabel, setKernelLabel] = useState(flyerKernelSource());
  const baseCl = 0.45 + elevatorPitchDeg * 0.04;

  const live = useLiveSimParams({
    wingWarpDeg,
    rudderYawDeg,
    elevatorPitchDeg,
    airspeedMph,
    showStreamlines,
    showVectors,
    isAutoFlying,
    liftNewtons: si.liftNewtons,
    dragNewtons: si.totalDragNewtons,
    netYawNm: si.netYawNm,
    coupled: isCoupled ? 1 : 0,
    cl: baseCl,
  });

  const applyWarp = (val: number) => {
    updateParam("wingWarp", val);
    if (isCoupled) {
      updateParam("rudder", coupledRudderDeg(val));
    }
  };

  useEffect(() => {
    ensureFlyerWasm().then(() => {
      setKernelLabel(flyerKernelSource());
    });

    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with Museum Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [7.6, 3.2, 8.4],
      targetPos: [0, 0.15, 0],
      fov: 38,
    });

    const { scene, camera, renderer, controls } = studio;
    controls.setRadius(11);

    const airframe = buildWrightFlyerAirframe();
    const flyerGroup = airframe.group;
    scene.add(flyerGroup);

    const {
      upperWing,
      lowerWing,
      canardGroup,
      rudderGroup,
      cradleGroup,
      leftPropBlades,
      rightPropBlades,
      leftBayWireMat,
      rightBayWireMat,
    } = airframe;

    // --- AERODYNAMIC AIRFLOW STREAMLINE PARTICLES ---
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const glowTex = createGlowPointTexture();

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      particlePositions[idx] = (Math.random() - 0.5) * (FLYER_DIM.span + 2);
      particlePositions[idx + 1] = (Math.random() - 0.5) * (FLYER_DIM.gap + 1.4);
      particlePositions[idx + 2] = 8 + Math.random() * 5;

      // Color code by energy: Cyan-Blue (high speed/low pressure) to Amber (stagnation)
      particleColors[idx] = 0.2 + Math.random() * 0.4;
      particleColors[idx + 1] = 0.7 + Math.random() * 0.3;
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
    const clock = new THREE.Clock();
    let aero = identityAeroBody();
    const scheduler = new TickScheduler(1 / 120, 0, 3);

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      const p = live.current;
      const siNow = {
        airspeedMps: p.airspeedMph * 0.44704,
        dynamicPressurePa: 0,
        liftNewtons: p.liftNewtons,
        inducedDragNewtons: 0,
        parasiticDragNewtons: 0,
        totalDragNewtons: p.dragNewtons,
        liftToDrag: 0,
        adverseYawNm: 0,
        rudderYawNm: 0,
        netYawNm: p.netYawNm,
        coordinated: false,
        adverseYawDominant: p.netYawNm < -8,
      };
      const controlsNow = {
        airspeedMph: p.airspeedMph,
        wingWarpDeg: p.wingWarpDeg,
        rudderDeg: p.rudderYawDeg,
        elevatorDeg: p.elevatorPitchDeg,
        coupled: p.coupled >= 0.5,
      };

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
        flyerGroup.position.y = Math.sin(elapsed * 1.4) * 0.04;
      } else {
        aero = identityAeroBody();
        flyerGroup.quaternion.identity();
        flyerGroup.position.y = 0;
      }

      // Propellers Rotation (Counter-Rotating to eliminate gyroscopic torque)
      const propSpeed = (p.airspeedMph / 25) * 45;
      leftPropBlades.rotation.z += propSpeed * delta;
      rightPropBlades.rotation.z -= propSpeed * delta;

      // Animate Wing Warping Deflection on Mesh Tips
      const warpRad = (p.wingWarpDeg * Math.PI) / 180;
      const leftTipUpper = upperWing.getObjectByName("leftTip");
      const rightTipUpper = upperWing.getObjectByName("rightTip");
      const leftTipLower = lowerWing.getObjectByName("leftTip");
      const rightTipLower = lowerWing.getObjectByName("rightTip");

      if (leftTipUpper && rightTipUpper && leftTipLower && rightTipLower) {
        leftTipUpper.rotation.x = warpRad * 0.6;
        leftTipLower.rotation.x = warpRad * 0.6;
        rightTipUpper.rotation.x = -warpRad * 0.6;
        rightTipLower.rotation.x = -warpRad * 0.6;
      }

      // Pilot hip cradle sliding sideways during wing warping
      cradleGroup.position.x = -0.35 + (p.wingWarpDeg / 15) * 0.12;

      // Animate Elevator & Rudder
      canardGroup.rotation.x = (-p.elevatorPitchDeg * Math.PI) / 180;
      rudderGroup.rotation.y = (-p.rudderYawDeg * Math.PI) / 180;

      // Streamline Flow Particle Physics
      const posArr = particlePositions;
      const flowSpeed = (p.airspeedMph / 30) * 18 * delta;

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        posArr[idx + 2] -= flowSpeed;

        // Downwash deflection as airflow passes the wings
        if (posArr[idx + 2] < 1 && posArr[idx + 2] > -4) {
          posArr[idx + 1] -= p.cl * 0.08 * delta;
        }

        // Reset particle when it travels past the tail
        if (posArr[idx + 2] < -8) {
          posArr[idx + 2] = 8 + Math.random() * 3;
          posArr[idx] = (Math.random() - 0.5) * (FLYER_DIM.span + 2);
          posArr[idx + 1] = (Math.random() - 0.5) * (FLYER_DIM.gap + 1.4);
        }
      }
      particleGeo.attributes.position.needsUpdate = true;
      streamlinePoints.visible = p.showStreamlines;
      vectorsGroup.visible = p.showVectors;

      // Update Force Vector Scales
      liftVector.setLength(Math.max(0.5, p.liftNewtons / 1100), 0.4, 0.25);
      dragVector.setLength(Math.max(0.3, p.dragNewtons / 400), 0.3, 0.2);

      // Interplane X-wires: the high-AoA tip carries extra lift, so that bay's
      // piano wire goes amber, then red. Slack bay stays steel-grey.
      const leftTension = Math.max(0, p.liftNewtons / 2200 + p.wingWarpDeg / 15);
      const rightTension = Math.max(0, p.liftNewtons / 2200 - p.wingWarpDeg / 15);
      const paintBay = (mat: THREE.MeshStandardMaterial, tension: number) => {
        if (tension > 1.15) mat.color.setHex(0xef4444);
        else if (tension > 0.55) mat.color.setHex(0xf59e0b);
        else mat.color.setHex(0x94a3b8);
      };
      paintBay(leftBayWireMat, leftTension);
      paintBay(rightBayWireMat, rightTension);

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      for (const tex of airframe.textures) tex.dispose();
      studio.dispose();
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

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
                  {isCoupled ? "Claim 1 Coupled" : "Unlinked Cables"}
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
                  Attitude: aero CG2 + SI wrenches · residual {kernelLabel}
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
        </div>
      </div>

      {/* Parameter Sliders Panel */}
      <div className="p-4 sm:p-5 bg-parchment-100/80 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
        {/* Wing Warping (Roll & Adverse Yaw) */}
        <div className="space-y-1.5 p-3 rounded-xl bg-parchment-50/60 dark:bg-ink-950/60 border border-parchment-200 dark:border-ink-800/80">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Wing Warping (Roll):</span>
            <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
              {wingWarpDeg > 0 ? `+${wingWarpDeg}°` : `${wingWarpDeg}°`}
            </span>
          </div>
          <input
            type="range"
            aria-label="Wing Warping (Roll)"
            min="-15"
            max="15"
            step="1"
            value={wingWarpDeg}
            onChange={(e) => applyWarp(Number(e.target.value))}
            className="w-full accent-amber-600 dark:accent-amber-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Helical torsion along lateral spars
          </span>
        </div>

        {/* Vertical Rudder (Yaw Compensation) */}
        <div className="space-y-1.5 p-3 rounded-xl bg-parchment-50/60 dark:bg-ink-950/60 border border-parchment-200 dark:border-ink-800/80">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Rudder Angle (Yaw):</span>
            <span className="font-mono font-bold text-sky-700 dark:text-sky-400">
              {rudderYawDeg > 0 ? `+${rudderYawDeg}°` : `${rudderYawDeg}°`}
            </span>
          </div>
          <input
            type="range"
            aria-label="Rudder Angle (Yaw)"
            min="-25"
            max="25"
            step="1"
            value={rudderYawDeg}
            disabled={isCoupled}
            onChange={(e) => updateParam("rudder", Number(e.target.value))}
            className={`w-full accent-sky-600 dark:accent-sky-400 ${isCoupled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          />
          <label className="flex items-center gap-1.5 text-[10px] text-ink-600 dark:text-ink-400 font-mono">
            <input
              type="checkbox"
              checked={isCoupled}
              onChange={(e) => {
                updateParam("coupled", e.target.checked ? 1 : 0);
                if (e.target.checked) {
                  updateParam("rudder", coupledRudderDeg(wingWarpDeg));
                }
              }}
              className="rounded accent-emerald-600"
            />
            Claim 1 hip-cradle coupling
          </label>
        </div>

        {/* Forward Canard (Pitch Angle) */}
        <div className="space-y-1.5 p-3 rounded-xl bg-parchment-50/60 dark:bg-ink-950/60 border border-parchment-200 dark:border-ink-800/80">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Canard Pitch (Elevator):</span>
            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
              {elevatorPitchDeg > 0 ? `+${elevatorPitchDeg}°` : `${elevatorPitchDeg}°`}
            </span>
          </div>
          <input
            type="range"
            aria-label="Canard Elevator (Pitch)"
            min="-15"
            max="15"
            step="1"
            value={elevatorPitchDeg}
            onChange={(e) => updateParam("elevator", Number(e.target.value))}
            className="w-full accent-emerald-600 dark:accent-emerald-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Controls angle of attack &amp; stall margin
          </span>
        </div>

        {/* Airspeed (Dynamic Pressure) */}
        <div className="space-y-1.5 p-3 rounded-xl bg-parchment-50/60 dark:bg-ink-950/60 border border-parchment-200 dark:border-ink-800/80">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Relative Airspeed:</span>
            <span className="font-mono font-bold text-amber-800 dark:text-amber-400">
              {airspeedMph} mph ({airspeedFps.toFixed(1)} ft/s)
            </span>
          </div>
          <input
            type="range"
            aria-label="Relative Airspeed"
            min="15"
            max="45"
            step="1"
            value={airspeedMph}
            onChange={(e) => updateParam("airspeed", Number(e.target.value))}
            className="w-full accent-amber-600 dark:accent-amber-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Dynamic pressure q = ½ρV² = {dynamicPressure.toFixed(2)} psf
          </span>
        </div>
      </div>
    </div>
  );
}
