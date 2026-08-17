"use client";

import { Compass, Play, Wind } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { buildWrightFlyerAirframe, FLYER_DIM } from "./wrightFlyerAirframe";

export function WrightFlyer3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Aerodynamic State Controls
  const [wingWarpDeg, setWingWarpDeg] = useState<number>(8); // -15 to +15 deg
  const [rudderYawDeg, setRudderYawDeg] = useState<number>(4); // -25 to +25 deg
  const [elevatorPitchDeg, setElevatorPitchDeg] = useState<number>(5); // -15 to +15 deg
  const [airspeedMph, setAirspeedMph] = useState<number>(28); // 15 to 45 mph
  const [showStreamlines, setShowStreamlines] = useState<boolean>(true);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [isAutoFlying, setIsAutoFlying] = useState<boolean>(true);
  const [isCoupled, setIsCoupled] = useState<boolean>(true);
  const [showMuseumScan, setShowMuseumScan] = useState<boolean>(false);

  // Aerodynamic Physics Calculations
  const airspeedFps = (airspeedMph * 5280) / 3600;
  const dynamicPressure = 0.5 * 0.002377 * airspeedFps * airspeedFps; // q = 1/2 rho V^2 (slugs/ft^3)
  const wingAreaSqFt = 510; // 1903 Flyer wing area
  const baseCl = 0.45 + elevatorPitchDeg * 0.04;
  const totalLiftLbs = Math.round(dynamicPressure * wingAreaSqFt * Math.max(0.1, baseCl));

  // Induced Drag: C_Di = C_L^2 / (pi * AR * e)
  const aspectratio = 6.2;
  const oswaldEfficiency = 0.75;
  const cdInduced = (baseCl * baseCl) / (Math.PI * aspectratio * oswaldEfficiency);
  const cdParasite = 0.045;
  const totalDragLbs = Math.round(dynamicPressure * wingAreaSqFt * (cdParasite + cdInduced));

  // Positive warp = more right-wing AoA. Extra right induced drag yaws the nose left (negative).
  // Positive rudder = starboard, producing positive (right) yaw that cancels adverse yaw.
  const speedRatio = airspeedMph / 30;
  const adverseYawMomentFtLbs = Math.round(-wingWarpDeg * 12.5 * speedRatio);
  const rudderCorrectiveMomentFtLbs = Math.round(rudderYawDeg * 28.0 * speedRatio);
  const netYawMoment = adverseYawMomentFtLbs + rudderCorrectiveMomentFtLbs;

  const live = useLiveSimParams({
    wingWarpDeg,
    rudderYawDeg,
    elevatorPitchDeg,
    airspeedMph,
    showStreamlines,
    showVectors,
    isAutoFlying,
    baseCl,
    totalLiftLbs,
    totalDragLbs,
    showMuseumScan,
  });

  const applyWarp = (val: number) => {
    setWingWarpDeg(val);
    if (isCoupled) {
      setRudderYawDeg(Math.round(val * 0.45));
    }
  };

  useEffect(() => {
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

    const { upperWing, lowerWing, canardGroup, rudderGroup, leftPropBlades, rightPropBlades } =
      airframe;

    const scanGroup = new THREE.Group();
    scanGroup.visible = false;
    scene.add(scanGroup);
    void import("three/examples/jsm/loaders/STLLoader.js").then(({ STLLoader }) => {
      const loader = new STLLoader();
      loader.load("/models/wright-flyer/smithsonian-nasm-1903-flyer.cc0.stl", (geo) => {
        geo.computeVertexNormals();
        geo.center();
        geo.computeBoundingBox();
        const box = geo.boundingBox;
        if (box) {
          const size = new THREE.Vector3();
          box.getSize(size);
          const longest = Math.max(size.x, size.y, size.z);
          if (longest > 0) {
            geo.scale(FLYER_DIM.span / longest, FLYER_DIM.span / longest, FLYER_DIM.span / longest);
          }
        }
        const mesh = new THREE.Mesh(
          geo,
          new THREE.MeshStandardMaterial({
            color: 0xe7d8b8,
            roughness: 0.72,
            metalness: 0.04,
          }),
        );
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scanGroup.add(mesh);
      });
    });

    // --- AERODYNAMIC AIRFLOW STREAMLINE PARTICLES ---
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const glowTex = createGlowPointTexture();

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      particlePositions[idx] = (Math.random() - 0.5) * (FLYER_DIM.span + 2);
      particlePositions[idx + 1] = (Math.random() - 0.5) * (FLYER_DIM.gap + 1.4);
      particlePositions[idx + 2] = 8 + Math.random() * 5;

      particleVelocities[idx] = 0;
      particleVelocities[idx + 1] = 0;
      particleVelocities[idx + 2] = -(0.3 + Math.random() * 0.25);

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

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      const p = live.current;
      flyerGroup.visible = !p.showMuseumScan;
      scanGroup.visible = p.showMuseumScan;

      // Auto-flight subtle atmospheric turbulence
      if (p.isAutoFlying && !p.showMuseumScan) {
        flyerGroup.position.y = Math.sin(elapsed * 1.5) * 0.15;
        flyerGroup.rotation.z =
          Math.sin(elapsed * 0.9) * 0.03 + ((p.wingWarpDeg * Math.PI) / 180) * 0.4;
        flyerGroup.rotation.y =
          ((-p.rudderYawDeg * Math.PI) / 180) * 0.6 + Math.cos(elapsed * 0.7) * 0.02;
        flyerGroup.rotation.x = ((-p.elevatorPitchDeg * Math.PI) / 180) * 0.4;
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
          posArr[idx + 1] -= p.baseCl * 0.08 * delta;
        }

        // Reset particle when it travels past the tail
        if (posArr[idx + 2] < -8) {
          posArr[idx + 2] = 8 + Math.random() * 3;
          posArr[idx] = (Math.random() - 0.5) * (FLYER_DIM.span + 2);
          posArr[idx + 1] = (Math.random() - 0.5) * (FLYER_DIM.gap + 1.4);
        }
      }
      particleGeo.attributes.position.needsUpdate = true;
      streamlinePoints.visible = p.showStreamlines && !p.showMuseumScan;
      vectorsGroup.visible = p.showVectors && !p.showMuseumScan;

      // Update Force Vector Scales
      liftVector.setLength(Math.max(0.5, p.totalLiftLbs / 250), 0.4, 0.25);
      dragVector.setLength(Math.max(0.3, p.totalDragLbs / 90), 0.3, 0.2);

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

        {/* Live HUD Telemetry Overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
            <div className="text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              Aerodynamic Equilibrium
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs font-sans">
              <div>
                <span className="text-ink-600 dark:text-ink-400">Total Lift:</span>{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {totalLiftLbs} lbs
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Total Drag:</span>{" "}
                <span className="font-bold text-red-600 dark:text-red-400">{totalDragLbs} lbs</span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Lift/Drag (L/D):</span>{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {(totalLiftLbs / Math.max(1, totalDragLbs)).toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Net Yaw Torque:</span>{" "}
                <span
                  className={`font-bold ${
                    Math.abs(netYawMoment) < 30
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {netYawMoment > 0 ? `+${netYawMoment}` : netYawMoment} ft-lb
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${isCoupled ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}
            />
            <span>
              {showMuseumScan
                ? "Smithsonian NASM scan · CC0 · restored artifact (static)"
                : isCoupled
                  ? "Claim 1 cable coupling: warp drives starboard rudder"
                  : "Unlinked controls — adverse yaw is unopposed"}
            </span>
          </div>
        </div>

        {/* Camera & Toggle Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-wrap justify-end gap-2 max-w-[55%]">
          <button
            type="button"
            onClick={() => setShowStreamlines(!showStreamlines)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
              showStreamlines
                ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            <Wind className="w-3.5 h-3.5 inline mr-1" />
            Streamlines
          </button>
          <button
            type="button"
            onClick={() => setShowVectors(!showVectors)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
              showVectors
                ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            Force Vectors
          </button>
          <button
            type="button"
            onClick={() => setShowMuseumScan(!showMuseumScan)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
              showMuseumScan
                ? "bg-ink-800 text-parchment-100 border-ink-900 shadow-sm"
                : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            {showMuseumScan ? "NASM Scan (CC0)" : "Interactive Airframe"}
          </button>
          <button
            type="button"
            onClick={() => setIsAutoFlying(!isAutoFlying)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
              isAutoFlying
                ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            <Play className="w-3.5 h-3.5 inline mr-1" />
            {isAutoFlying ? "Live Flight" : "Freeze"}
          </button>
        </div>
      </div>

      {/* Parameter Sliders Panel */}
      <div className="p-4 sm:p-5 bg-parchment-100/80 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
        {/* Wing Warping (Roll & Adverse Yaw) */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Wing Warping (Roll):</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">
              {wingWarpDeg > 0 ? `+${wingWarpDeg}°` : `${wingWarpDeg}°`}
            </span>
          </div>
          <input
            type="range"
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
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Rudder Angle (Yaw):</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {rudderYawDeg > 0 ? `+${rudderYawDeg}°` : `${rudderYawDeg}°`}
            </span>
          </div>
          <input
            type="range"
            min="-25"
            max="25"
            step="1"
            value={rudderYawDeg}
            disabled={isCoupled}
            onChange={(e) => setRudderYawDeg(Number(e.target.value))}
            className={`w-full accent-blue-600 dark:accent-blue-400 ${isCoupled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          />
          <label className="flex items-center gap-1.5 text-[10px] text-ink-500 dark:text-ink-400">
            <input
              type="checkbox"
              checked={isCoupled}
              onChange={(e) => {
                setIsCoupled(e.target.checked);
                if (e.target.checked) {
                  setRudderYawDeg(Math.round(wingWarpDeg * 0.45));
                }
              }}
              className="rounded accent-emerald-600"
            />
            Claim 1 hip-cradle coupling
          </label>
        </div>

        {/* Forward Canard (Pitch Angle) */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Canard Elevator (Pitch):</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {elevatorPitchDeg > 0 ? `+${elevatorPitchDeg}°` : `${elevatorPitchDeg}°`}
            </span>
          </div>
          <input
            type="range"
            min="-15"
            max="15"
            step="1"
            value={elevatorPitchDeg}
            onChange={(e) => setElevatorPitchDeg(Number(e.target.value))}
            className="w-full accent-emerald-600 dark:accent-emerald-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Controls angle of attack &amp; stall margin
          </span>
        </div>

        {/* Airspeed (Dynamic Pressure) */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Relative Airspeed:</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              {airspeedMph} mph ({airspeedFps.toFixed(1)} ft/s)
            </span>
          </div>
          <input
            type="range"
            min="15"
            max="45"
            step="1"
            value={airspeedMph}
            onChange={(e) => setAirspeedMph(Number(e.target.value))}
            className="w-full accent-purple-600 dark:accent-purple-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Dynamic pressure q = ½ρV² = {dynamicPressure.toFixed(2)} psf
          </span>
        </div>
      </div>
    </div>
  );
}
