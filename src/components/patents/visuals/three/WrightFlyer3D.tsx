"use client";

import { Compass, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createThreeStudioScene } from "./ThreeStudioScene";

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
      bgBottomColor: 0x0f172a,
      rimColor: 0x38bdf8,
      ambientIntensity: 1.3,
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const wingFabricMat = new THREE.MeshStandardMaterial({
      color: 0xfef3c7, // Pride of the West unbleached muslin cloth
      roughness: 0.75,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    const spruceWoodMat = new THREE.MeshStandardMaterial({
      color: 0xb45309, // Ash and West Virginia spruce spars
      roughness: 0.55,
      metalness: 0.1,
    });

    const _steelWireMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0, // Piano brace wires
      roughness: 0.2,
      metalness: 0.95,
    });

    const propellerWoodMat = new THREE.MeshStandardMaterial({
      color: 0x92400e,
      roughness: 0.35,
      metalness: 0.15,
    });

    // --- 3D BIPLANE AIRFRAME ASSEMBLY ---
    const flyerGroup = new THREE.Group();
    scene.add(flyerGroup);

    // Biplane Wing Geometry (Span: 40ft = 16 units; Chord: 6.5ft = 2.8 units; Gap: 6ft = 2.4 units)
    const spanUnits = 14;
    const chordUnits = 2.6;
    const gapUnits = 2.3;

    // Upper and Lower Wings with Articulated Wing Warping Tips
    const createWingSurface = (isUpper: boolean) => {
      const wingG = new THREE.Group();
      wingG.position.y = isUpper ? gapUnits / 2 : -gapUnits / 2;

      // Center Wing Section (Rigid)
      const centerGeo = new THREE.BoxGeometry(spanUnits * 0.4, 0.1, chordUnits);
      const centerMesh = new THREE.Mesh(centerGeo, wingFabricMat);
      centerMesh.castShadow = true;
      wingG.add(centerMesh);

      // Left Wing Tip (Warpable)
      const leftTipGeo = new THREE.BoxGeometry(spanUnits * 0.3, 0.08, chordUnits);
      const leftTipMesh = new THREE.Mesh(leftTipGeo, wingFabricMat);
      leftTipMesh.position.x = -spanUnits * 0.35;
      leftTipMesh.name = "leftTip";
      leftTipMesh.castShadow = true;
      wingG.add(leftTipMesh);

      // Right Wing Tip (Warpable)
      const rightTipGeo = new THREE.BoxGeometry(spanUnits * 0.3, 0.08, chordUnits);
      const rightTipMesh = new THREE.Mesh(rightTipGeo, wingFabricMat);
      rightTipMesh.position.x = spanUnits * 0.35;
      rightTipMesh.name = "rightTip";
      rightTipMesh.castShadow = true;
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
      flyerGroup.add(fStrut);
      // Rear Strut
      const rStrut = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, gapUnits, 8),
        spruceWoodMat,
      );
      rStrut.position.set(bayX, 0, -chordUnits / 2 + 0.2);
      flyerGroup.add(rStrut);
    }

    // Forward Canard Elevator (Pitch Control)
    const canardGroup = new THREE.Group();
    canardGroup.position.set(0, 0, chordUnits + 3.2);

    const canardUpper = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.06, 1.2), wingFabricMat);
    canardUpper.position.y = 0.5;
    const canardLower = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.06, 1.2), wingFabricMat);
    canardLower.position.y = -0.5;
    canardGroup.add(canardUpper);
    canardGroup.add(canardLower);

    // Outrigger Struts to Canard
    const outrigger1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 3.6, 8),
      spruceWoodMat,
    );
    outrigger1.position.set(-1.8, 0, chordUnits / 2 + 1.6);
    outrigger1.rotation.x = Math.PI / 2;
    const outrigger2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 3.6, 8),
      spruceWoodMat,
    );
    outrigger2.position.set(1.8, 0, chordUnits / 2 + 1.6);
    outrigger2.rotation.x = Math.PI / 2;
    flyerGroup.add(outrigger1);
    flyerGroup.add(outrigger2);
    flyerGroup.add(canardGroup);

    // Rear Vertical Rudder (Yaw Control)
    const rudderGroup = new THREE.Group();
    rudderGroup.position.set(0, 0, -chordUnits - 3.2);

    const rudderVane1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, gapUnits * 0.9, 1.2),
      wingFabricMat,
    );
    rudderVane1.position.x = -0.6;
    const rudderVane2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, gapUnits * 0.9, 1.2),
      wingFabricMat,
    );
    rudderVane2.position.x = 0.6;
    rudderGroup.add(rudderVane1);
    rudderGroup.add(rudderVane2);
    flyerGroup.add(rudderGroup);

    // Counter-Rotating Twin Pusher Propellers
    const propLeft = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.22, 0.06), propellerWoodMat);
    propLeft.position.set(-2.6, 0, -chordUnits / 2 - 0.4);
    const propRight = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.22, 0.06), propellerWoodMat);
    propRight.position.set(2.6, 0, -chordUnits / 2 - 0.4);
    flyerGroup.add(propLeft);
    flyerGroup.add(propRight);

    // Prone Pilot Figure (Orville lying on lower wing)
    const pilotMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.4, 2.2),
      new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.7 }),
    );
    pilotMesh.position.set(-0.8, -gapUnits / 2 + 0.3, 0);
    flyerGroup.add(pilotMesh);

    // --- 3D AERODYNAMIC VECTORS ---
    const vectorGroup = new THREE.Group();
    scene.add(vectorGroup);

    // Total Lift Arrow (Green, Upward)
    const liftArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 1.5, 0),
      3.5,
      0x10b981,
      0.6,
      0.35,
    );
    vectorGroup.add(liftArrow);

    // Drag Vector Arrow (Red, Backward)
    const dragArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(0, 0, 0),
      2.2,
      0xef4444,
      0.5,
      0.3,
    );
    vectorGroup.add(dragArrow);

    // --- 3D AIRFLOW STREAMLINE PARTICLES ---
    const streamlineCount = 180;
    const streamlineGeo = new THREE.BufferGeometry();
    const streamlinePos = new Float32Array(streamlineCount * 3);
    for (let i = 0; i < streamlineCount; i++) {
      streamlinePos[i * 3] = (Math.random() - 0.5) * (spanUnits * 1.2);
      streamlinePos[i * 3 + 1] = (Math.random() - 0.5) * gapUnits * 2;
      streamlinePos[i * 3 + 2] = 12 - Math.random() * 24;
    }
    streamlineGeo.setAttribute("position", new THREE.BufferAttribute(streamlinePos, 3));
    const streamlinePoints = new THREE.Points(
      streamlineGeo,
      new THREE.PointsMaterial({ color: 0x38bdf8, size: 0.16, transparent: true, opacity: 0.75 }),
    );
    scene.add(streamlinePoints);

    // --- ANIMATION & PHYSICS INTEGRATION LOOP ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      controls.update();

      // Wing Warping Kinematics: Twist Tips in Opposite Directions
      const warpRad = (wingWarpDeg * Math.PI) / 180;
      [upperWing, lowerWing].forEach((w) => {
        const leftTip = w.getObjectByName("leftTip");
        const rightTip = w.getObjectByName("rightTip");
        if (leftTip) leftTip.rotation.x = warpRad * 0.8;
        if (rightTip) rightTip.rotation.x = -warpRad * 0.8;
      });

      // Canard Elevator Pitch Rotation
      canardGroup.rotation.x = (elevatorPitchDeg * Math.PI) / 180;

      // Vertical Rudder Yaw Rotation
      rudderGroup.rotation.y = (rudderYawDeg * Math.PI) / 180;

      // Counter-Rotating Propeller Motion (Chain drives spin props in opposite directions to cancel torque)
      const propSpeed = (airspeedMph / 30) * 18.0;
      propLeft.rotation.z = time * propSpeed;
      propRight.rotation.z = -time * propSpeed;

      // Auto Flight Pitch & Roll Attitude Dynamics
      if (isAutoFlying) {
        flyerGroup.rotation.z = Math.sin(time * 1.5) * (wingWarpDeg * 0.04);
        flyerGroup.rotation.x = Math.sin(time * 2.0) * 0.03 + elevatorPitchDeg * 0.02;
        flyerGroup.position.y = Math.sin(time * 2.2) * 0.35;
      }

      // Dynamic Lift & Drag Vector Rescaling
      vectorGroup.visible = showVectors;
      if (showVectors) {
        const liftScale = Math.max(1.0, (totalLiftLbs / 700) * 4.0);
        liftArrow.setLength(liftScale, 0.6, 0.35);
        const dragScale = Math.max(0.8, (totalDragLbs / 120) * 2.5);
        dragArrow.setLength(dragScale, 0.5, 0.3);
      }

      // Streamline Velocity Field Advection
      streamlinePoints.visible = showStreamlines;
      if (showStreamlines) {
        const pos = streamlineGeo.attributes.position.array as Float32Array;
        const flowVelocity = (airspeedMph / 30) * 0.45;
        for (let i = 0; i < streamlineCount; i++) {
          pos[i * 3 + 2] -= flowVelocity;
          if (pos[i * 3 + 2] < -12) {
            pos[i * 3 + 2] = 12;
            pos[i * 3] = (Math.random() - 0.5) * (spanUnits * 1.2);
            pos[i * 3 + 1] = (Math.random() - 0.5) * gapUnits * 2;
          }
        }
        streamlineGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
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
  ]);

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-amber-500 animate-pulse" />
            <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50">
              3D Real-Time Wright Flyer Aerodynamic Flight Simulator (US 821,393)
            </h3>
          </div>
          <p className="text-sm sm:text-base text-ink-700 dark:text-ink-300 mt-1">
            Studio-illuminated Three.js aerodynamic physics simulating{" "}
            <strong>coordinated 3-axis wing warping</strong>,{" "}
            <strong>counter-rotating propellers</strong>, and{" "}
            <strong>adverse yaw neutralization</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAutoFlying(!isAutoFlying)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all border shadow-2xs ${
              isAutoFlying
                ? "bg-amber-600 text-white border-amber-700 shadow-sm"
                : "bg-parchment-200 dark:bg-ink-800 text-ink-800 dark:text-parchment-200 border-parchment-300 dark:border-ink-700"
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Flight Dynamics: {isAutoFlying ? "LIVE" : "STATIC"}</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas & HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-[#0f172a] border border-parchment-300 dark:border-ink-800 relative min-h-[460px] overflow-hidden shadow-inner">
          {/* Top HUD */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none text-xs sm:text-sm font-mono">
            <div className="px-3.5 py-1.5 bg-ink-900/90 border border-ink-800 text-amber-300 rounded-xl shadow-md">
              Total Lift: <span className="font-bold">{totalLiftLbs} lbs</span> · Drag:{" "}
              <span className="text-red-400 font-bold">{totalDragLbs} lbs</span> (L/D:{" "}
              {(totalLiftLbs / Math.max(1, totalDragLbs)).toFixed(1)})
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={() => setShowVectors(!showVectors)}
                className={`px-3 py-1 rounded-lg border text-xs font-mono transition-colors ${
                  showVectors
                    ? "bg-emerald-600 text-white border-emerald-500"
                    : "bg-ink-900 text-ink-400 border-ink-800"
                }`}
              >
                Vectors: {showVectors ? "ON" : "OFF"}
              </button>
              <button
                type="button"
                onClick={() => setShowStreamlines(!showStreamlines)}
                className={`px-3 py-1 rounded-lg border text-xs font-mono transition-colors ${
                  showStreamlines
                    ? "bg-blue-600 text-white border-blue-500"
                    : "bg-ink-900 text-ink-400 border-ink-800"
                }`}
              >
                Airflow: {showStreamlines ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* 3D Canvas */}
          <div ref={containerRef} className="w-full h-[460px] cursor-grab active:cursor-grabbing" />

          {/* Bottom Telemetry */}
          <div className="w-full grid grid-cols-4 gap-3 text-center text-sm font-mono p-4 bg-ink-950/95 border-t border-ink-800 text-ink-300 z-10">
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                AIRSPEED
              </span>
              <span className="text-emerald-400 font-bold text-sm sm:text-base">
                {airspeedMph} mph
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                WING WARP (ROLL)
              </span>
              <span className="text-amber-400 font-bold text-sm sm:text-base">
                {wingWarpDeg > 0 ? `+${wingWarpDeg}° (Right Bank)` : `${wingWarpDeg}°`}
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                NET YAW MOMENT
              </span>
              <span
                className={`font-bold text-sm sm:text-base ${Math.abs(netYawMoment) < 20 ? "text-emerald-400" : "text-red-400"}`}
              >
                {netYawMoment} ft·lbs ({Math.abs(netYawMoment) < 20 ? "TRIMMED" : "ADVERSE YAW"})
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                3D INTERACTION
              </span>
              <span className="text-purple-400 font-semibold text-xs sm:text-sm">
                Drag Orbit / Zoom
              </span>
            </div>
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/80 dark:bg-ink-900/70 p-6 space-y-5 shadow-sm">
            <span className="font-serif font-bold text-base sm:text-lg text-ink-950 dark:text-parchment-50 block">
              3-Axis Flight Controls
            </span>

            {/* Wing Warping Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  {"Wing Warping ($\\Delta \\alpha_{roll}$)"}
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">{wingWarpDeg}°</span>
              </div>
              <input
                type="range"
                min="-15"
                max="15"
                step="1"
                value={wingWarpDeg}
                onChange={(e) => setWingWarpDeg(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Rudder Yaw Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  {"Rear Rudder ($\\delta_{rudder}$)"}
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">{rudderYawDeg}°</span>
              </div>
              <input
                type="range"
                min="-25"
                max="25"
                step="1"
                value={rudderYawDeg}
                onChange={(e) => setRudderYawDeg(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Canard Pitch Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  {"Forward Canard Elevator ($\\delta_{elev}$)"}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {elevatorPitchDeg}°
                </span>
              </div>
              <input
                type="range"
                min="-12"
                max="15"
                step="1"
                value={elevatorPitchDeg}
                onChange={(e) => setElevatorPitchDeg(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Airspeed Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  {"Relative Airspeed ($V_\\infty$)"}
                </span>
                <span className="text-purple-600 dark:text-purple-400 font-bold">
                  {airspeedMph} MPH
                </span>
              </div>
              <input
                type="range"
                min="18"
                max="45"
                step="1"
                value={airspeedMph}
                onChange={(e) => setAirspeedMph(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-ink-950 dark:text-parchment-100 text-xs sm:text-sm font-sans space-y-1.5">
              <span className="font-bold text-amber-900 dark:text-amber-300 block font-mono text-xs uppercase tracking-wider">
                The Wright Brothers&apos; Breakthrough:
              </span>
              <p className="leading-relaxed">
                {
                  "Increasing lift on the right wing tip increases induced drag ($C_{Di} = C_L^2 / \\pi AR$). Without the synchronized vertical rudder, this adverse drag yaws the nose in the opposite direction of the roll. The Wrights solved this by coordinating roll and yaw control."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
