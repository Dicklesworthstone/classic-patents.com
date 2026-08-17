"use client";

import { Scissors, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createThreeStudioScene } from "./ThreeStudioScene";

export function HoweSewingMachine3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mechanical Stitching State Controls
  const [stitchingSpeedRpm, setStitchingSpeedRpm] = useState<number>(240); // 60 to 600 RPM
  const [stitchPitchMm, setStitchPitchMm] = useState<number>(3.5); // 1.5 to 6.0 mm
  const [threadTensionGrams, setThreadTensionGrams] = useState<number>(45); // 10 to 100 g
  const [_showThreadLoop, _setShowThreadLoop] = useState<boolean>(true);
  const [isCranking, setIsCranking] = useState<boolean>(true);

  // Lockstitch Kinematics Calculations
  const stitchesPerSecond = (stitchingSpeedRpm / 60).toFixed(1);
  const clothFeedRateMmPerSec = ((stitchingSpeedRpm / 60) * stitchPitchMm).toFixed(1);
  const handSewingSpeedRatio = (Number(clothFeedRateMmPerSec) / 1.2).toFixed(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with High-Luminosity Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [11, 8, 13],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const castIronMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // Enamelled black cast-iron frame
      roughness: 0.35,
      metalness: 0.85,
    });

    const polishedSteelMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9, // Hardened steel needle bar & cams
      roughness: 0.08,
      metalness: 0.95,
    });

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Brass balance wheel & shuttle
      roughness: 0.18,
      metalness: 0.9,
    });

    const needleThreadMat = new THREE.MeshBasicMaterial({
      color: 0xef4444, // Upper needle thread (Red)
    });

    const _bobbinThreadMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6, // Lower bobbin shuttle thread (Blue)
    });

    const clothFabricMat = new THREE.MeshStandardMaterial({
      color: 0xfef3c7, // Muslin fabric work piece
      roughness: 0.75,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    // --- 3D HOWE SEWING MACHINE ASSEMBLY ---
    const machineGroup = new THREE.Group();
    scene.add(machineGroup);

    // Cast-Iron Base Plate & Cloth Bed
    const bedPlate = new THREE.Mesh(new THREE.BoxGeometry(10.0, 0.8, 6.0), castIronMat);
    bedPlate.position.y = -2.2;
    bedPlate.castShadow = true;
    bedPlate.receiveShadow = true;
    machineGroup.add(bedPlate);

    // Vertical Overhanging Arm Casting
    const armColumn = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.1, 4.2, 24), castIronMat);
    armColumn.position.set(-3.2, 0, 0);
    armColumn.castShadow = true;
    machineGroup.add(armColumn);

    const overhangingArm = new THREE.Mesh(new THREE.BoxGeometry(6.5, 1.0, 1.6), castIronMat);
    overhangingArm.position.set(0, 2.1, 0);
    overhangingArm.castShadow = true;
    machineGroup.add(overhangingArm);

    // Brass Flywheel / Hand Crank
    const flywheel = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 0.4, 32), brassMat);
    flywheel.rotation.z = Math.PI / 2;
    flywheel.position.set(-3.6, 2.1, 0);
    flywheel.castShadow = true;
    machineGroup.add(flywheel);

    // Needle Head Bar with Curved Eye-Pointed Needle
    const needleBarGroup = new THREE.Group();
    needleBarGroup.position.set(2.8, 1.2, 0);

    const needleShaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 3.2, 16),
      polishedSteelMat,
    );
    needleShaft.castShadow = true;
    needleBarGroup.add(needleShaft);

    // Curved Needle Tip with Eye at Point (Howe Claim 1)
    const needleTip = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.6, 16), polishedSteelMat);
    needleTip.position.y = -1.8;
    needleTip.rotation.x = Math.PI;
    needleTip.castShadow = true;
    needleBarGroup.add(needleTip);
    machineGroup.add(needleBarGroup);

    // Oscillating Boat Shuttle Carriage under Bed Plate
    const shuttleGroup = new THREE.Group();
    shuttleGroup.position.set(2.8, -1.6, 0);

    const shuttleBody = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.8, 16), brassMat);
    shuttleBody.rotation.z = -Math.PI / 2;
    shuttleBody.castShadow = true;
    shuttleGroup.add(shuttleBody);
    machineGroup.add(shuttleGroup);

    // Cloth Workpiece on Bed
    const cloth = new THREE.Mesh(new THREE.BoxGeometry(8.0, 0.1, 4.0), clothFabricMat);
    cloth.position.set(0.5, -1.75, 0);
    cloth.castShadow = true;
    cloth.receiveShadow = true;
    machineGroup.add(cloth);

    // --- 3D INTERLOCKING LOCKSTITCH THREAD PATHS ---
    const threadCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(2.8, 3.2, 0),
      new THREE.Vector3(2.8, 1.2, 0),
      new THREE.Vector3(2.8, -1.8, 0),
      new THREE.Vector3(1.5, -1.75, 0),
    ]);
    const threadGeo = new THREE.TubeGeometry(threadCurve, 30, 0.03, 6, false);
    const threadMesh = new THREE.Mesh(threadGeo, needleThreadMat);
    machineGroup.add(threadMesh);

    // --- RENDER LOOP & REAL-TIME LOCKSTITCH KINEMATICS ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const _delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Crank Kinematics: Needle vertical stroke harmonic oscillation
      const omega = (stitchingSpeedRpm / 60) * 2 * Math.PI;
      const crankAngle = elapsed * omega;

      if (isCranking) {
        flywheel.rotation.x = crankAngle;
        // Needle plunges through cloth
        const needleY = 1.2 + Math.cos(crankAngle) * 0.9;
        needleBarGroup.position.y = needleY;

        // Shuttle oscillates in phase-locked quadrature through needle thread loop
        const shuttleZ = Math.sin(crankAngle) * 1.2;
        shuttleGroup.position.z = shuttleZ;

        // Animate cloth feeding step
        cloth.position.x = 0.5 - ((elapsed * Number(clothFeedRateMmPerSec) * 0.1) % 2.0);
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      studio.dispose();
    };
  }, [stitchingSpeedRpm, isCranking, clothFeedRateMmPerSec]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Live HUD Telemetry Overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
            <div className="text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              Lockstitch Mechanism Telemetry
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs font-sans">
              <div>
                <span className="text-ink-600 dark:text-ink-400">Stitch Velocity:</span>{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {stitchingSpeedRpm} Stitches/Min ({stitchesPerSecond}/sec)
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Feed Advance Rate:</span>{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {clothFeedRateMmPerSec} mm/sec
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Productivity vs Hand:</span>{" "}
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {handSewingSpeedRatio}× Faster than Hand Sewing
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Thread Tension:</span>{" "}
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {threadTensionGrams} grams
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Eye-Pointed Needle + Interlocking Bobbin Shuttle (Elias Howe US 4,750)</span>
          </div>
        </div>

        {/* Crank Toggle */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            type="button"
            onClick={() => setIsCranking(!isCranking)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
              isCranking
                ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            {isCranking ? "Crank Active" : "Halt Crank"}
          </button>
        </div>
      </div>

      {/* Parameter Sliders Panel */}
      <div className="p-4 sm:p-5 bg-parchment-100/80 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
        {/* Stitching Speed */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Treadle Crank Speed:</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">
              {stitchingSpeedRpm} RPM
            </span>
          </div>
          <input
            type="range"
            min="60"
            max="600"
            step="20"
            value={stitchingSpeedRpm}
            onChange={(e) => setStitchingSpeedRpm(Number(e.target.value))}
            className="w-full accent-amber-600 dark:accent-amber-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Harmonic crank shaft oscillation frequency
          </span>
        </div>

        {/* Stitch Pitch Length */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Stitch Length (Pitch):</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {stitchPitchMm.toFixed(1)} mm
            </span>
          </div>
          <input
            type="range"
            min="1.5"
            max="6.0"
            step="0.5"
            value={stitchPitchMm}
            onChange={(e) => setStitchPitchMm(Number(e.target.value))}
            className="w-full accent-blue-600 dark:accent-blue-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Baster plate feed dog advance per stroke
          </span>
        </div>

        {/* Thread Tension */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Upper Tension Spring:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {threadTensionGrams} g
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={threadTensionGrams}
            onChange={(e) => setThreadTensionGrams(Number(e.target.value))}
            className="w-full accent-emerald-600 dark:accent-emerald-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Draws lockstitch knot into center of fabric
          </span>
        </div>

        {/* Garment Assembly Velocity */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Sewing Efficiency vs Hand:</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              {handSewingSpeedRatio}× Multiplier
            </span>
          </div>
          <div className="w-full bg-parchment-300 dark:bg-ink-800 rounded-full h-3 overflow-hidden mt-2 border border-parchment-400 dark:border-ink-700">
            <div
              className="bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, (stitchingSpeedRpm / 600) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Catalyzed the Sewing Machine Combination Patent Pool (1856)
          </span>
        </div>
      </div>
    </div>
  );
}
