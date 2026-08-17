"use client";

import { Wind } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function WrightFlyer3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Flight Physics & Control Parameters
  const [wingWarpDeg, setWingWarpDeg] = useState<number>(15); // -30 to +30 deg
  const [rudderDeg, setRudderDeg] = useState<number>(-12); // -30 to +30 deg
  const [canardDeg, setCanardDeg] = useState<number>(6); // -20 to +20 deg
  const [airspeedMps, setAirspeedMps] = useState<number>(14); // 8 to 22 m/s (~31 mph)
  const [isCoupled, setIsCoupled] = useState<boolean>(true); // Wright Claim 1
  const [showStreamlines, setShowStreamlines] = useState<boolean>(true);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [activePreset, setActivePreset] = useState<
    "equilibrium" | "adverse-yaw" | "coordinated-turn"
  >("coordinated-turn");

  // Telemetry outputs
  const wingArea = 47.4; // m² (510 sq ft)
  const airDensity = 1.225; // kg/m³
  const dynamicPressure = 0.5 * airDensity * airspeedMps * airspeedMps;

  const leftLift = dynamicPressure * wingArea * 0.5 * (0.6 + wingWarpDeg * 0.015);
  const rightLift = dynamicPressure * wingArea * 0.5 * (0.6 - wingWarpDeg * 0.015);
  const totalLift = leftLift + rightLift;

  const leftDrag = dynamicPressure * wingArea * 0.5 * (0.08 + Math.max(0, wingWarpDeg * 0.02) ** 2);
  const rightDrag =
    dynamicPressure * wingArea * 0.5 * (0.08 + Math.max(0, -wingWarpDeg * 0.02) ** 2);
  const netYawTorque = (leftDrag - rightDrag) * 6.0 + rudderDeg * -12.5;

  const isAdverseYaw = !isCoupled && Math.abs(wingWarpDeg) > 12 && rudderDeg === 0;
  const isCoordinated = Math.abs(netYawTorque) < 15 && Math.abs(wingWarpDeg) > 8;

  // Presets
  const applyPreset = (preset: "equilibrium" | "adverse-yaw" | "coordinated-turn") => {
    setActivePreset(preset);
    if (preset === "equilibrium") {
      setWingWarpDeg(0);
      setRudderDeg(0);
      setCanardDeg(4);
      setIsCoupled(true);
    } else if (preset === "adverse-yaw") {
      setWingWarpDeg(20);
      setRudderDeg(0);
      setCanardDeg(5);
      setIsCoupled(false);
    } else if (preset === "coordinated-turn") {
      setWingWarpDeg(18);
      setRudderDeg(-14);
      setCanardDeg(6);
      setIsCoupled(true);
    }
  };

  const handleWarpChange = (val: number) => {
    setWingWarpDeg(val);
    if (isCoupled) {
      setRudderDeg(-Math.round(val * 0.78));
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.015);

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(16, 10, 22);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.replaceChildren(renderer.domElement);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffeedd, 1.4);
    sunLight.position.set(25, 40, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const cyanRimLight = new THREE.PointLight(0x38bdf8, 2, 40);
    cyanRimLight.position.set(-15, -5, -15);
    scene.add(cyanRimLight);

    // --- GROUND & BLUEPRINT GRID ---
    const gridHelper = new THREE.GridHelper(80, 40, 0xd97706, 0x1e293b);
    gridHelper.position.y = -4;
    scene.add(gridHelper);

    // --- MATERIALS ---
    const muslinMaterial = new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      roughness: 0.85,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    const spruceWoodMaterial = new THREE.MeshStandardMaterial({
      color: 0x92400e,
      roughness: 0.7,
      metalness: 0.1,
    });

    const _steelWireMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.3,
      metalness: 0.8,
    });

    const engineMetalMaterial = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.4,
      metalness: 0.8,
    });

    const _vectorLiftMaterial = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const _vectorDragMaterial = new THREE.MeshBasicMaterial({ color: 0xef4444 });

    // --- 3D AIRCRAFT ROOT GROUP ---
    const flyerGroup = new THREE.Group();
    scene.add(flyerGroup);

    // Biplane Wing Geometry (Span: 12.3m, Chord: 2.0m)
    const wingSpan = 12.0;
    const wingChord = 2.0;
    const wingGap = 1.8;

    // Top Wing
    const topWingGeo = new THREE.BoxGeometry(wingSpan, 0.06, wingChord, 16, 1, 4);
    const topWingMesh = new THREE.Mesh(topWingGeo, muslinMaterial);
    topWingMesh.position.y = wingGap / 2;
    topWingMesh.castShadow = true;
    topWingMesh.receiveShadow = true;
    flyerGroup.add(topWingMesh);

    // Bottom Wing
    const bottomWingGeo = new THREE.BoxGeometry(wingSpan, 0.06, wingChord, 16, 1, 4);
    const bottomWingMesh = new THREE.Mesh(bottomWingGeo, muslinMaterial);
    bottomWingMesh.position.y = -wingGap / 2;
    bottomWingMesh.castShadow = true;
    bottomWingMesh.receiveShadow = true;
    flyerGroup.add(bottomWingMesh);

    // Interplane Struts (Spruce Uprights)
    const strutGeo = new THREE.CylinderGeometry(0.03, 0.03, wingGap, 8);
    const strutPositions = [-5.5, -3.5, -1.8, 0, 1.8, 3.5, 5.5];

    strutPositions.forEach((x) => {
      // Front strut
      const strutFront = new THREE.Mesh(strutGeo, spruceWoodMaterial);
      strutFront.position.set(x, 0, wingChord * 0.35);
      flyerGroup.add(strutFront);

      // Rear strut
      const strutRear = new THREE.Mesh(strutGeo, spruceWoodMaterial);
      strutRear.position.set(x, 0, -wingChord * 0.35);
      flyerGroup.add(strutRear);
    });

    // Forward Canard Elevator (Pitch Control)
    const canardGroup = new THREE.Group();
    canardGroup.position.set(0, 0, wingChord + 3.2);

    const canardWingGeo = new THREE.BoxGeometry(4.0, 0.04, 0.9);
    const canardTop = new THREE.Mesh(canardWingGeo, muslinMaterial);
    canardTop.position.y = 0.4;
    const canardBottom = new THREE.Mesh(canardWingGeo, muslinMaterial);
    canardBottom.position.y = -0.4;
    canardGroup.add(canardTop);
    canardGroup.add(canardBottom);
    flyerGroup.add(canardGroup);

    // Canard Forward Outrigger Booms
    const boomGeo = new THREE.CylinderGeometry(0.025, 0.025, 3.8, 6);
    const leftCanardBoom = new THREE.Mesh(boomGeo, spruceWoodMaterial);
    leftCanardBoom.position.set(-1.2, 0, wingChord * 0.5 + 1.6);
    leftCanardBoom.rotation.x = Math.PI / 2;
    flyerGroup.add(leftCanardBoom);

    const rightCanardBoom = new THREE.Mesh(boomGeo, spruceWoodMaterial);
    rightCanardBoom.position.set(1.2, 0, wingChord * 0.5 + 1.6);
    rightCanardBoom.rotation.x = Math.PI / 2;
    flyerGroup.add(rightCanardBoom);

    // Rear Vertical Twin Rudder (Yaw Control)
    const rudderGroup = new THREE.Group();
    rudderGroup.position.set(0, 0, -(wingChord + 2.8));

    const rudderBladeGeo = new THREE.BoxGeometry(0.04, 1.6, 0.7);
    const leftRudderBlade = new THREE.Mesh(rudderBladeGeo, spruceWoodMaterial);
    leftRudderBlade.position.x = -0.5;
    const rightRudderBlade = new THREE.Mesh(rudderBladeGeo, spruceWoodMaterial);
    rightRudderBlade.position.x = 0.5;
    rudderGroup.add(leftRudderBlade);
    rudderGroup.add(rightRudderBlade);
    flyerGroup.add(rudderGroup);

    // Rear Outrigger Booms
    const rearBoomLeft = new THREE.Mesh(boomGeo, spruceWoodMaterial);
    rearBoomLeft.position.set(-0.8, 0, -(wingChord * 0.5 + 1.4));
    rearBoomLeft.rotation.x = Math.PI / 2;
    flyerGroup.add(rearBoomLeft);

    const rearBoomRight = new THREE.Mesh(boomGeo, spruceWoodMaterial);
    rearBoomRight.position.set(0.8, 0, -(wingChord * 0.5 + 1.4));
    rearBoomRight.rotation.x = Math.PI / 2;
    flyerGroup.add(rearBoomRight);

    // Charlie Taylor 12-HP 4-Cylinder Engine & Pilot Prone Cradle
    const engineMesh = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.7), engineMetalMaterial);
    engineMesh.position.set(0.6, -wingGap / 2 + 0.25, 0);
    flyerGroup.add(engineMesh);

    const pilotCradle = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.15, 1.1), spruceWoodMaterial);
    pilotCradle.position.set(-0.4, -wingGap / 2 + 0.1, 0);
    flyerGroup.add(pilotCradle);

    // Pusher Propellers (Counter-Rotating Twin Props)
    const propGeo = new THREE.BoxGeometry(2.4, 0.08, 0.02);
    const leftProp = new THREE.Mesh(propGeo, spruceWoodMaterial);
    leftProp.position.set(-1.8, 0, -wingChord * 0.6);
    flyerGroup.add(leftProp);

    const rightProp = new THREE.Mesh(propGeo, spruceWoodMaterial);
    rightProp.position.set(1.8, 0, -wingChord * 0.6);
    flyerGroup.add(rightProp);

    // Dynamic 3D Force Vectors (Lift & Drag Arrows)
    const liftArrowLeft = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(-4.5, 1, 0),
      2.5,
      0x10b981,
    );
    const liftArrowRight = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(4.5, 1, 0),
      2.5,
      0x10b981,
    );
    const dragArrowLeft = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(-4.5, 1, 0),
      1.2,
      0xef4444,
    );
    const dragArrowRight = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(4.5, 1, 0),
      1.2,
      0xef4444,
    );

    flyerGroup.add(liftArrowLeft);
    flyerGroup.add(liftArrowRight);
    flyerGroup.add(dragArrowLeft);
    flyerGroup.add(dragArrowRight);

    // --- PARTICLE VORTEX STREAMLINES ---
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 14;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      particlePositions[i * 3 + 2] = Math.random() * 20 - 5;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.12,
      transparent: true,
      opacity: 0.7,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // --- MOUSE ORBIT CONTROLS ---
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let sphericalTheta = 0.9;
    let sphericalPhi = 0.5;
    let sphericalRadius = 24;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      sphericalTheta -= deltaX * 0.006;
      sphericalPhi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, sphericalPhi + deltaY * 0.006));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      sphericalRadius = Math.max(8, Math.min(50, sphericalRadius + e.deltaY * 0.02));
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    dom.addEventListener("wheel", onWheel, { passive: false });

    // --- ANIMATION & PHYSICS INTEGRATOR LOOP ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Camera Orbit Spherical Positioning
      camera.position.x = sphericalRadius * Math.sin(sphericalTheta) * Math.cos(sphericalPhi);
      camera.position.y = sphericalRadius * Math.sin(sphericalPhi);
      camera.position.z = sphericalRadius * Math.cos(sphericalTheta) * Math.cos(sphericalPhi);
      camera.lookAt(0, 0.5, 0);

      // Rotate Pusher Propellers (Counter-Rotating)
      leftProp.rotation.z += delta * 25;
      rightProp.rotation.z -= delta * 25;

      // Update 3D Aerodynamic Wing Warping Morphing
      const warpRad = (wingWarpDeg * Math.PI) / 180;
      topWingMesh.rotation.z = -warpRad * 0.25;
      bottomWingMesh.rotation.z = -warpRad * 0.25;

      // Update Forward Canard Pitch
      canardGroup.rotation.x = -(canardDeg * Math.PI) / 180;

      // Update Rear Rudder Yaw
      rudderGroup.rotation.y = (rudderDeg * Math.PI) / 180;

      // Calculate 6-DoF Roll & Adverse Yaw Dynamic Pitch
      const rollAngle = -warpRad * 0.8;
      const pitchAngle = (canardDeg * 0.4 * Math.PI) / 180;
      const yawAngle = netYawTorque * 0.008;

      flyerGroup.rotation.z = THREE.MathUtils.lerp(flyerGroup.rotation.z, rollAngle, 0.1);
      flyerGroup.rotation.x = THREE.MathUtils.lerp(flyerGroup.rotation.x, pitchAngle, 0.1);
      flyerGroup.rotation.y = THREE.MathUtils.lerp(flyerGroup.rotation.y, yawAngle, 0.1);
      flyerGroup.position.y = Math.sin(time * 2.0) * 0.15; // Natural atmospheric phugoid oscillation

      // Update Lift/Drag Vector Scale & Visibility
      liftArrowLeft.visible = showVectors;
      liftArrowRight.visible = showVectors;
      dragArrowLeft.visible = showVectors;
      dragArrowRight.visible = showVectors;

      if (showVectors) {
        liftArrowLeft.setLength(Math.max(0.5, leftLift / 500));
        liftArrowRight.setLength(Math.max(0.5, rightLift / 500));
        dragArrowLeft.setLength(Math.max(0.3, leftDrag / 150));
        dragArrowRight.setLength(Math.max(0.3, rightDrag / 150));
      }

      // Streamline Flow Integration
      particleSystem.visible = showStreamlines;
      if (showStreamlines) {
        const positions = particleGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3 + 2] -= airspeedMps * delta * 1.5;
          if (positions[i * 3 + 2] < -10) {
            positions[i * 3 + 2] = 15;
            positions[i * 3] = (Math.random() - 0.5) * 14;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
          }
        }
        particleGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      dom.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      dom.removeEventListener("wheel", onWheel);
      renderer.dispose();
    };
  }, [
    wingWarpDeg,
    rudderDeg,
    canardDeg,
    airspeedMps,
    showStreamlines,
    showVectors,
    leftLift,
    rightLift,
    leftDrag,
    rightDrag,
    netYawTorque,
  ]);

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 shadow-patent space-y-6">
      {/* Simulation Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-amber-500 animate-pulse" />
            <h3 className="font-serif text-xl font-bold text-ink-900 dark:text-parchment-100">
              3D Real-Time Wright Flyer Aerodynamic Flight Simulator (US 821,393)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-1">
            Real-time Three.js 6-DoF physics simulation illustrating{" "}
            <strong>wing-warping adverse yaw</strong> and{" "}
            <strong>coordinated rudder counter-torque</strong>.
          </p>
        </div>

        {/* Preset Steppers */}
        <div className="flex items-center gap-1.5 bg-parchment-200 dark:bg-ink-900 p-1 rounded-xl border border-parchment-300 dark:border-ink-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => applyPreset("adverse-yaw")}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              activePreset === "adverse-yaw"
                ? "bg-red-600 text-white font-bold"
                : "text-ink-700 dark:text-ink-400 hover:text-ink-900"
            }`}
          >
            1. Adverse Yaw Trap
          </button>
          <button
            type="button"
            onClick={() => applyPreset("coordinated-turn")}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              activePreset === "coordinated-turn"
                ? "bg-emerald-600 text-white font-bold"
                : "text-ink-700 dark:text-ink-400 hover:text-ink-900"
            }`}
          >
            2. Coordinated Turn (Claim 1)
          </button>
          <button
            type="button"
            onClick={() => applyPreset("equilibrium")}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              activePreset === "equilibrium"
                ? "bg-amber-600 text-white font-bold"
                : "text-ink-700 dark:text-ink-400 hover:text-ink-900"
            }`}
          >
            3. Level Cruise
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas & HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-[#0a0f1d] border border-parchment-300 dark:border-ink-800 relative min-h-[440px] overflow-hidden">
          {/* Top HUD Alert Banner */}
          <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none text-xs font-mono">
            {isAdverseYaw && (
              <div className="px-3 py-1 bg-red-950/90 border border-red-700 text-red-300 rounded-lg flex items-center gap-1.5 animate-pulse shadow-lg">
                <span>
                  ⚠ ADVERSE YAW: Left induced drag ({leftDrag.toFixed(0)}N) spins aircraft wrong
                  way!
                </span>
              </div>
            )}
            {isCoordinated && (
              <div className="px-3 py-1 bg-emerald-950/90 border border-emerald-700 text-emerald-300 rounded-lg flex items-center gap-1.5 shadow-lg">
                <span>✓ WRIGHT CLAIM 1 ACTIVE: Coordinated rudder counteracts induced yaw.</span>
              </div>
            )}
            {!isAdverseYaw && !isCoordinated && (
              <div className="px-3 py-1 bg-ink-900/90 border border-ink-800 text-ink-300 rounded-lg">
                Symmetric Cruise Equilibrium
              </div>
            )}

            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={() => setShowStreamlines(!showStreamlines)}
                className={`px-2 py-1 rounded border text-[11px] font-mono transition-colors ${
                  showStreamlines
                    ? "bg-blue-600 text-white border-blue-500"
                    : "bg-ink-900 text-ink-400 border-ink-800"
                }`}
              >
                Vortices: {showStreamlines ? "ON" : "OFF"}
              </button>
              <button
                type="button"
                onClick={() => setShowVectors(!showVectors)}
                className={`px-2 py-1 rounded border text-[11px] font-mono transition-colors ${
                  showVectors
                    ? "bg-emerald-600 text-white border-emerald-500"
                    : "bg-ink-900 text-ink-400 border-ink-800"
                }`}
              >
                Vectors: {showVectors ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* 3D WebGL Mounting Container */}
          <div ref={containerRef} className="w-full h-[440px] cursor-grab active:cursor-grabbing" />

          {/* Bottom HUD Telemetry Strip */}
          <div className="w-full grid grid-cols-4 gap-2 text-center text-xs font-mono p-3 bg-ink-950/90 border-t border-ink-800 text-ink-300 z-10">
            <div>
              <span className="text-ink-500 block text-[10px]">TOTAL LIFT</span>
              <span className="text-emerald-400 font-bold">{totalLift.toFixed(0)} N</span>
            </div>
            <div>
              <span className="text-ink-500 block text-[10px]">AIRSPEED</span>
              <span className="text-amber-400 font-bold">
                {airspeedMps} m/s ({(airspeedMps * 2.237).toFixed(0)} mph)
              </span>
            </div>
            <div>
              <span className="text-ink-500 block text-[10px]">NET YAW MOMENT</span>
              <span
                className={
                  Math.abs(netYawTorque) < 15
                    ? "text-emerald-400 font-bold"
                    : "text-red-400 font-bold"
                }
              >
                {netYawTorque.toFixed(1)} N·m
              </span>
            </div>
            <div>
              <span className="text-ink-500 block text-[10px]">3D CAMERA</span>
              <span className="text-blue-400">Drag to Orbit / Scroll Zoom</span>
            </div>
          </div>
        </div>

        {/* Flight Controls Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/70 dark:bg-ink-900/60 p-5 space-y-4">
            <span className="font-serif font-bold text-sm text-ink-900 dark:text-parchment-100 block">
              Pilot 3-Axis Control Deck
            </span>

            {/* Wing Warping Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Wing Warping (Roll)
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">{wingWarpDeg}°</span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                value={wingWarpDeg}
                onChange={(e) => handleWarpChange(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Rudder Control Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Vertical Rear Rudder (Yaw)
                </span>
                <span className="text-red-600 dark:text-red-400 font-bold">{rudderDeg}°</span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                value={rudderDeg}
                disabled={isCoupled}
                onChange={(e) => setRudderDeg(Number(e.target.value))}
                className={`w-full accent-red-600 h-2 rounded-lg ${
                  isCoupled
                    ? "opacity-50 cursor-not-allowed bg-ink-800"
                    : "cursor-pointer bg-parchment-300 dark:bg-ink-700"
                }`}
              />
            </div>

            {/* Forward Canard Pitch Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Forward Canard (Pitch)
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">{canardDeg}°</span>
              </div>
              <input
                type="range"
                min="-15"
                max="20"
                value={canardDeg}
                onChange={(e) => setCanardDeg(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Airspeed Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Airspeed / Headwind
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {airspeedMps} m/s
                </span>
              </div>
              <input
                type="range"
                min="8"
                max="22"
                value={airspeedMps}
                onChange={(e) => setAirspeedMps(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Coupling Toggle */}
            <div className="pt-2 border-t border-parchment-300 dark:border-ink-800">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono">
                <input
                  type="checkbox"
                  checked={isCoupled}
                  onChange={(e) => {
                    setIsCoupled(e.target.checked);
                    if (e.target.checked) {
                      setRudderDeg(-Math.round(wingWarpDeg * 0.78));
                    }
                  }}
                  className="rounded accent-emerald-600 w-4 h-4"
                />
                <span className="font-bold text-ink-900 dark:text-parchment-100">
                  Wright Claim 1 Cable Coupling
                </span>
              </label>
              <p className="text-[11px] text-ink-600 dark:text-ink-400 font-sans mt-1">
                Synchronizes the rear rudder to counteract induced adverse yaw generated by wing
                warping.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
