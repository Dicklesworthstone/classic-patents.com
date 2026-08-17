"use client";

import { Scissors } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createThreeStudioScene } from "./ThreeStudioScene";

export function HoweSewingMachine3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Sewing Machine Parameters
  const [sewingRpm, setSewingRpm] = useState<number>(240); // 60 to 450 RPM
  const [threadTensionGrams, setThreadTensionGrams] = useState<number>(120); // 30 to 250 g
  const [showThreadLoops, setShowThreadLoops] = useState<boolean>(true);

  // Mechanical Calculations
  const stitchesPerMinute = sewingRpm;
  const needleVelocityFps = ((sewingRpm * 2 * Math.PI * 0.08) / 60).toFixed(2);
  const lockstitchStrengthLbs = Math.round((threadTensionGrams / 50) * 12);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with Museum Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [15, 11, 17],
      targetPos: [0, 0, 0],
      bgBottomColor: 0x0f172a,
      rimColor: 0xf59e0b,
      ambientIntensity: 1.3,
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const castIronMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // Black japanned cast iron frame
      roughness: 0.35,
      metalness: 0.85,
    });

    const polishedSteelMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9, // Hardened steel needles and gears
      metalness: 0.95,
      roughness: 0.1,
    });

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Brass flywheel and spool
      metalness: 0.9,
      roughness: 0.2,
    });

    const upperThreadMat = new THREE.LineBasicMaterial({ color: 0xef4444, linewidth: 2 });
    const lowerThreadMat = new THREE.LineBasicMaterial({ color: 0x3b82f6, linewidth: 2 });

    // --- 3D HOWE SEWING MACHINE ASSEMBLY ---
    const machineGroup = new THREE.Group();
    scene.add(machineGroup);

    // Heavy Cast Iron Bed Plate
    const bedPlate = new THREE.Mesh(new THREE.BoxGeometry(16, 1.0, 9.0), castIronMat);
    bedPlate.position.y = -3.0;
    machineGroup.add(bedPlate);

    // Overhanging C-Arm Casting
    const verticalPillar = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.4, 6.0, 24),
      castIronMat,
    );
    verticalPillar.position.set(-5.5, 0, 0);
    machineGroup.add(verticalPillar);

    const horizontalArm = new THREE.Mesh(new THREE.BoxGeometry(9.0, 1.6, 1.8), castIronMat);
    horizontalArm.position.set(-1.5, 3.0, 0);
    machineGroup.add(horizontalArm);

    const headNose = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.4, 2.0), castIronMat);
    headNose.position.set(3.0, 2.6, 0);
    machineGroup.add(headNose);

    // Brass Hand Wheel / Belt Pulley
    const flywheel = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.4, 16, 48), brassMat);
    flywheel.position.set(-6.5, 3.0, 0);
    flywheel.rotation.y = Math.PI / 2;
    machineGroup.add(flywheel);

    // Vibrating Curved Eye-Pointed Needle Bar
    const needleBar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 4.2, 16),
      polishedSteelMat,
    );
    needleBar.position.set(3.0, 1.0, 0);
    machineGroup.add(needleBar);

    // Curved Needle with Eye near the sharp tip
    const needleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(3.0, -1.0, 0),
      new THREE.Vector3(3.0, -2.0, 0.3),
      new THREE.Vector3(3.0, -2.8, 0.1),
    ]);
    const curvedNeedleMesh = new THREE.Mesh(
      new THREE.TubeGeometry(needleCurve, 24, 0.08, 8, false),
      polishedSteelMat,
    );
    machineGroup.add(curvedNeedleMesh);

    // Reciprocating Shuttle Carrier & Boat Shuttle (Under the Bed)
    const shuttleMesh = new THREE.Mesh(new THREE.ConeGeometry(0.6, 2.4, 16), polishedSteelMat);
    shuttleMesh.rotation.z = Math.PI / 2;
    shuttleMesh.position.set(3.0, -2.5, 0);
    machineGroup.add(shuttleMesh);

    // --- 3D INTERLOOPING THREAD PATHS ---
    const threadGroup = new THREE.Group();
    scene.add(threadGroup);

    // Upper Needle Thread (Red)
    const upperPts = [
      new THREE.Vector3(0, 4.5, 0),
      new THREE.Vector3(3.0, 3.8, 0),
      new THREE.Vector3(3.0, 1.0, 0),
      new THREE.Vector3(3.0, -2.8, 0.1),
    ];
    const upperGeo = new THREE.BufferGeometry().setFromPoints(upperPts);
    const upperLine = new THREE.Line(upperGeo, upperThreadMat);
    threadGroup.add(upperLine);

    // Lower Bobbin Thread (Blue)
    const lowerPts = [
      new THREE.Vector3(3.0, -2.5, -2.0),
      new THREE.Vector3(3.0, -2.5, 0),
      new THREE.Vector3(3.0, -2.0, 0),
    ];
    const lowerGeo = new THREE.BufferGeometry().setFromPoints(lowerPts);
    const lowerLine = new THREE.Line(lowerGeo, lowerThreadMat);
    threadGroup.add(lowerLine);

    // --- ANIMATION & PHYSICS INTEGRATION LOOP ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      controls.update();

      const rotSpeed = (sewingRpm / 60) * 2 * Math.PI;
      flywheel.rotation.z = time * rotSpeed;

      // Needle Harmonic Reciprocation: y(t) = Y_0 + A * cos(omega * t)
      const needleStroke = Math.cos(time * rotSpeed) * 0.9;
      needleBar.position.y = 1.0 + needleStroke;
      curvedNeedleMesh.position.y = needleStroke;

      // Shuttle Kinematics: Shifts across the needle loop when needle reaches bottom dead center
      const shuttleStroke = Math.sin(time * rotSpeed) * 1.4;
      shuttleMesh.position.z = shuttleStroke;

      // Update Thread Geometries
      threadGroup.visible = showThreadLoops;
      if (showThreadLoops) {
        const uPos = upperGeo.attributes.position.array as Float32Array;
        uPos[9] = 3.0;
        uPos[10] = -2.8 + needleStroke;
        uPos[11] = 0.1;
        upperGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      studio.dispose();
    };
  }, [sewingRpm, showThreadLoops]);

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Scissors className="w-6 h-6 text-amber-500 animate-pulse" />
            <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50">
              3D Real-Time Elias Howe Lockstitch Sewing Machine Simulator (US 4,750)
            </h3>
          </div>
          <p className="text-sm sm:text-base text-ink-700 dark:text-ink-300 mt-1">
            Studio-illuminated Three.js mechanical kinematics simulating the{" "}
            <strong>curved eye-pointed needle</strong> and{" "}
            <strong>reciprocating shuttle lockstitch</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-xs sm:text-sm font-mono font-bold border border-amber-300 dark:border-amber-800 shadow-2xs">
            {stitchesPerMinute} Stitches / Min
          </div>
        </div>
      </div>

      {/* 3D WebGL Canvas & HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-[#0f172a] border border-parchment-300 dark:border-ink-800 relative min-h-[460px] overflow-hidden shadow-inner">
          {/* Top HUD */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none text-xs sm:text-sm font-mono">
            <div className="px-3.5 py-1.5 bg-ink-900/90 border border-ink-800 text-amber-300 rounded-xl shadow-md">
              Needle Speed: <span className="font-bold">{needleVelocityFps} ft/s</span> · Lockstitch
              Strength:{" "}
              <span className="text-emerald-300 font-bold">{lockstitchStrengthLbs} lbs</span>
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={() => setShowThreadLoops(!showThreadLoops)}
                className={`px-3 py-1 rounded-lg border text-xs font-mono transition-colors ${
                  showThreadLoops
                    ? "bg-amber-600 text-white border-amber-500"
                    : "bg-ink-900 text-ink-400 border-ink-800"
                }`}
              >
                Thread Paths: {showThreadLoops ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* 3D Canvas */}
          <div ref={containerRef} className="w-full h-[460px] cursor-grab active:cursor-grabbing" />

          {/* Bottom Telemetry */}
          <div className="w-full grid grid-cols-4 gap-3 text-center text-sm font-mono p-4 bg-ink-950/95 border-t border-ink-800 text-ink-300 z-10">
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                MACHINE SPEED
              </span>
              <span className="text-amber-400 font-bold text-sm sm:text-base">{sewingRpm} RPM</span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                THREAD TENSION
              </span>
              <span className="text-emerald-400 font-bold text-sm sm:text-base">
                {threadTensionGrams} g
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                STITCH TYPE
              </span>
              <span className="text-blue-400 font-bold text-sm sm:text-base">
                2-Thread Lockstitch
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
              Mechanical Kinematic Controls
            </span>

            {/* Sewing Speed Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  {"Machine Flywheel Speed ($f_{sew}$)"}
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {sewingRpm} RPM
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="450"
                step="30"
                value={sewingRpm}
                onChange={(e) => setSewingRpm(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Thread Tension Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Thread Take-up Tension ($T$)
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {threadTensionGrams} g
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="250"
                step="10"
                value={threadTensionGrams}
                onChange={(e) => setThreadTensionGrams(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-ink-950 dark:text-parchment-100 text-xs sm:text-sm font-sans space-y-1.5">
              <span className="font-bold text-amber-900 dark:text-amber-300 block font-mono text-xs uppercase tracking-wider">
                Howe&apos;s Essential Mechanical Inventions:
              </span>
              <p className="leading-relaxed">
                Prior inventors failed by trying to mimic hand-sewing. Elias Howe Jr. invented the
                eye-pointed needle (eye at the sharp point rather than the blunt end) and paired it
                with a reciprocating shuttle carrying a second bobbin thread to interlock the stitch
                inside the fabric.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
