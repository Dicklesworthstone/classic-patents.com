"use client";

import { Compass, Play, Wind } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";

export function WrightFlyer3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Aerodynamic State Controls
  const [wingWarpDeg, setWingWarpDeg] = useState<number>(8); // -15 to +15 deg
  const [rudderYawDeg, setRudderYawDeg] = useState<number>(-4); // -25 to +25 deg
  const [elevatorPitchDeg, setElevatorPitchDeg] = useState<number>(5); // -15 to +15 deg
  const [airspeedMph, setAirspeedMph] = useState<number>(28); // 15 to 45 mph
  const [showStreamlines, setShowStreamlines] = useState<boolean>(true);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [isAutoFlying, setIsAutoFlying] = useState<boolean>(true);

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

  // Adverse Yaw Moment
  const adverseYawMomentFtLbs = Math.round(wingWarpDeg * 12.5 * (airspeedMph / 30));
  const rudderCorrectiveMomentFtLbs = Math.round(-rudderYawDeg * 28.0 * (airspeedMph / 30));
  const netYawMoment = adverseYawMomentFtLbs + rudderCorrectiveMomentFtLbs;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with Museum Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [14, 9, 15],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS (Luminous & Museum Grade) ---
    const wingFabricMat = new THREE.MeshStandardMaterial({
      color: 0xfef9e7, // Pride of the West unbleached muslin cloth
      roughness: 0.65,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    const spruceWoodMat = new THREE.MeshStandardMaterial({
      color: 0x9a3412, // Ash and West Virginia spruce spars
      roughness: 0.4,
      metalness: 0.15,
    });

    const _steelWireMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8, // Piano brace wires
      roughness: 0.2,
      metalness: 0.9,
    });

    const propellerWoodMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.3,
      metalness: 0.2,
    });

    // --- 3D BIPLANE AIRFRAME ASSEMBLY ---
    const flyerGroup = new THREE.Group();
    scene.add(flyerGroup);

    // Biplane Wing Geometry (Span: 40ft = 14 units; Chord: 6.5ft = 2.6 units; Gap: 6ft = 2.3 units)
    const spanUnits = 14;
    const chordUnits = 2.6;
    const gapUnits = 2.3;

    // Upper and Lower Wings with Articulated Wing Warping Tips
    const createWingSurface = (isUpper: boolean) => {
      const wingG = new THREE.Group();
      wingG.position.y = isUpper ? gapUnits / 2 : -gapUnits / 2;

      // Center Wing Section (Rigid)
      const centerGeo = new THREE.BoxGeometry(spanUnits * 0.4, 0.12, chordUnits);
      const centerMesh = new THREE.Mesh(centerGeo, wingFabricMat);
      centerMesh.castShadow = true;
      centerMesh.receiveShadow = true;
      wingG.add(centerMesh);

      // Left Wing Tip (Warpable)
      const leftTipGeo = new THREE.BoxGeometry(spanUnits * 0.3, 0.1, chordUnits);
      const leftTipMesh = new THREE.Mesh(leftTipGeo, wingFabricMat);
      leftTipMesh.position.x = -spanUnits * 0.35;
      leftTipMesh.name = "leftTip";
      leftTipMesh.castShadow = true;
      leftTipMesh.receiveShadow = true;
      wingG.add(leftTipMesh);

      // Right Wing Tip (Warpable)
      const rightTipGeo = new THREE.BoxGeometry(spanUnits * 0.3, 0.1, chordUnits);
      const rightTipMesh = new THREE.Mesh(rightTipGeo, wingFabricMat);
      rightTipMesh.position.x = spanUnits * 0.35;
      rightTipMesh.name = "rightTip";
      rightTipMesh.castShadow = true;
      rightTipMesh.receiveShadow = true;
      wingG.add(rightTipMesh);

      return wingG;
    };

    const upperWing = createWingSurface(true);
    const lowerWing = createWingSurface(false);
    flyerGroup.add(upperWing);
    flyerGroup.add(lowerWing);

    // Vertical Ash Struts & Diagonal Truss Wires
    const numBays = 4;
    for (let i = 0; i <= numBays; i++) {
      const bayX = -spanUnits / 2 + (i * spanUnits) / numBays;
      // Front Strut
      const fStrut = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, gapUnits, 8),
        spruceWoodMat,
      );
      fStrut.position.set(bayX, 0, chordUnits / 2 - 0.2);
      fStrut.castShadow = true;
      flyerGroup.add(fStrut);
      // Rear Strut
      const rStrut = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, gapUnits, 8),
        spruceWoodMat,
      );
      rStrut.position.set(bayX, 0, -chordUnits / 2 + 0.2);
      rStrut.castShadow = true;
      flyerGroup.add(rStrut);
    }

    // Forward Canard Elevator (Pitch Control)
    const canardGroup = new THREE.Group();
    canardGroup.position.set(0, 0, chordUnits + 3.2);

    const canardUpper = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.08, 1.2), wingFabricMat);
    canardUpper.position.y = 0.5;
    canardUpper.castShadow = true;
    const canardLower = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.08, 1.2), wingFabricMat);
    canardLower.position.y = -0.5;
    canardLower.castShadow = true;
    canardGroup.add(canardUpper);
    canardGroup.add(canardLower);

    // Outrigger Struts to Canard
    const outriggerL = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 3.8, 6),
      spruceWoodMat,
    );
    outriggerL.rotation.x = Math.PI / 2;
    outriggerL.position.set(-1.8, 0, chordUnits / 2 + 1.6);
    const outriggerR = outriggerL.clone();
    outriggerR.position.x = 1.8;
    flyerGroup.add(outriggerL);
    flyerGroup.add(outriggerR);
    flyerGroup.add(canardGroup);

    // Rear Twin Vertical Rudder (Yaw Control)
    const rudderGroup = new THREE.Group();
    rudderGroup.position.set(0, 0, -chordUnits - 3.2);

    const rudderV1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.6, 1.2), wingFabricMat);
    rudderV1.position.x = -0.9;
    rudderV1.castShadow = true;
    const rudderV2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.6, 1.2), wingFabricMat);
    rudderV2.position.x = 0.9;
    rudderV2.castShadow = true;
    rudderGroup.add(rudderV1);
    rudderGroup.add(rudderV2);

    const rearOutriggerL = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 3.8, 6),
      spruceWoodMat,
    );
    rearOutriggerL.rotation.x = Math.PI / 2;
    rearOutriggerL.position.set(-0.9, 0, -chordUnits / 2 - 1.6);
    const rearOutriggerR = rearOutriggerL.clone();
    rearOutriggerR.position.x = 0.9;
    flyerGroup.add(rearOutriggerL);
    flyerGroup.add(rearOutriggerR);
    flyerGroup.add(rudderGroup);

    // 12hp 4-Cylinder Engine Crankcase (Positioned right of centerline)
    const engineBlock = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.7, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 }),
    );
    engineBlock.position.set(0.9, -gapUnits / 2 + 0.45, 0);
    engineBlock.castShadow = true;
    flyerGroup.add(engineBlock);

    // Pilot Prone Hip Cradle (Positioned left of centerline to balance engine weight)
    const pilotCradle = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.2, 1.6),
      new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.6 }),
    );
    pilotCradle.position.set(-0.9, -gapUnits / 2 + 0.2, 0);
    flyerGroup.add(pilotCradle);

    // Dual Counter-Rotating Pusher Propellers (8.5ft diameter)
    const createPropeller = (xPos: number) => {
      const pGroup = new THREE.Group();
      pGroup.position.set(xPos, 0, -chordUnits / 2 - 0.3);

      const hub = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 0.3, 12),
        new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85 }),
      );
      hub.rotation.x = Math.PI / 2;
      pGroup.add(hub);

      const blade1 = new THREE.Mesh(new THREE.BoxGeometry(0.22, 3.2, 0.06), propellerWoodMat);
      blade1.rotation.z = 0.2;
      blade1.castShadow = true;
      const blade2 = blade1.clone();
      blade2.rotation.z = 0.2 + Math.PI;
      blade2.castShadow = true;
      pGroup.add(blade1);
      pGroup.add(blade2);

      // Semi-transparent motion blur disk
      const blurDisk = new THREE.Mesh(
        new THREE.CircleGeometry(1.6, 24),
        new THREE.MeshBasicMaterial({
          color: 0xfef08a,
          transparent: true,
          opacity: 0.18,
          side: THREE.DoubleSide,
        }),
      );
      pGroup.add(blurDisk);

      return pGroup;
    };

    const leftProp = createPropeller(-2.4);
    const rightProp = createPropeller(2.4);
    flyerGroup.add(leftProp);
    flyerGroup.add(rightProp);

    // --- AERODYNAMIC AIRFLOW STREAMLINE PARTICLES ---
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const glowTex = createGlowPointTexture();

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      particlePositions[idx] = (Math.random() - 0.5) * (spanUnits + 4);
      particlePositions[idx + 1] = (Math.random() - 0.5) * (gapUnits + 2.5);
      particlePositions[idx + 2] = 12 + Math.random() * 8; // Flow incoming from front

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

      // Auto-flight subtle atmospheric turbulence
      if (isAutoFlying) {
        flyerGroup.position.y = Math.sin(elapsed * 1.5) * 0.15;
        flyerGroup.rotation.z =
          Math.sin(elapsed * 0.9) * 0.03 + ((wingWarpDeg * Math.PI) / 180) * 0.4;
        flyerGroup.rotation.y =
          ((-rudderYawDeg * Math.PI) / 180) * 0.6 + Math.cos(elapsed * 0.7) * 0.02;
        flyerGroup.rotation.x = ((-elevatorPitchDeg * Math.PI) / 180) * 0.4;
      }

      // Propellers Rotation (Counter-Rotating to eliminate gyroscopic torque)
      const propSpeed = (airspeedMph / 25) * 45;
      leftProp.rotation.z += propSpeed * delta;
      rightProp.rotation.z -= propSpeed * delta;

      // Animate Wing Warping Deflection on Mesh Tips
      const warpRad = (wingWarpDeg * Math.PI) / 180;
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
      canardGroup.rotation.x = (-elevatorPitchDeg * Math.PI) / 180;
      rudderGroup.rotation.y = (-rudderYawDeg * Math.PI) / 180;

      // Streamline Flow Particle Physics
      const posArr = particlePositions;
      const flowSpeed = (airspeedMph / 30) * 18 * delta;

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        posArr[idx + 2] -= flowSpeed;

        // Downwash deflection as airflow passes the wings
        if (posArr[idx + 2] < 1 && posArr[idx + 2] > -4) {
          posArr[idx + 1] -= baseCl * 0.08 * delta;
        }

        // Reset particle when it travels past the tail
        if (posArr[idx + 2] < -12) {
          posArr[idx + 2] = 12 + Math.random() * 4;
          posArr[idx] = (Math.random() - 0.5) * (spanUnits + 4);
          posArr[idx + 1] = (Math.random() - 0.5) * (gapUnits + 2.5);
        }
      }
      particleGeo.attributes.position.needsUpdate = true;
      streamlinePoints.visible = showStreamlines;
      vectorsGroup.visible = showVectors;

      // Update Force Vector Scales
      liftVector.setLength(Math.max(0.5, totalLiftLbs / 250), 0.4, 0.25);
      dragVector.setLength(Math.max(0.3, totalDragLbs / 90), 0.3, 0.2);

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      studio.dispose();
    };
  }, [
    wingWarpDeg,
    rudderYawDeg,
    elevatorPitchDeg,
    airspeedMph,
    showStreamlines,
    showVectors,
    isAutoFlying,
    totalLiftLbs,
    totalDragLbs,
    baseCl,
  ]);

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
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>3-Axis Coupled Roll-Yaw Flight Control Active</span>
          </div>
        </div>

        {/* Camera & Toggle Controls */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
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
            onChange={(e) => setWingWarpDeg(Number(e.target.value))}
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
            onChange={(e) => setRudderYawDeg(Number(e.target.value))}
            className="w-full accent-blue-600 dark:accent-blue-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Counteracts adverse yaw induced by warping
          </span>
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
            Dynamic pressure $q = \frac{1}
            {2}\rho V^2$ = {dynamicPressure.toFixed(2)} psf
          </span>
        </div>
      </div>
    </div>
  );
}
