"use client";

import { Scissors, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

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

  const live = useLiveSimParams({
    stitchingSpeedRpm,
    isCranking,
    stitchPitchMm,
    clothFeedRateMmPerSec,
  });

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

    // --- 3D HOWE LOCKSTITCH MACHINE ASSEMBLY ---
    const machineGroup = new THREE.Group();
    scene.add(machineGroup);

    // Cast-Iron Base Plate & Cloth Bed with Arch Stanchions
    const bedPlate = new THREE.Mesh(new THREE.BoxGeometry(11.0, 0.7, 6.5), castIronMat);
    bedPlate.position.y = -2.2;
    bedPlate.castShadow = true;
    bedPlate.receiveShadow = true;
    machineGroup.add(bedPlate);

    // 4 Victorian Fluted Table Legs
    [
      [-4.8, -2.6],
      [4.8, -2.6],
      [-4.8, 2.6],
      [4.8, 2.6],
    ].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.28, 1.8, 16), castIronMat);
      leg.position.set(lx, -3.45, lz);
      machineGroup.add(leg);
    });

    // Vertical Overhanging Arm Casting (C-frame casting)
    const armColumn = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.2, 4.2, 24), castIronMat);
    armColumn.position.set(-3.2, 0, 0);
    armColumn.castShadow = true;
    machineGroup.add(armColumn);

    const overhangingArm = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.9, 1.4), castIronMat);
    overhangingArm.position.set(0, 2.1, 0);
    overhangingArm.castShadow = true;
    machineGroup.add(overhangingArm);

    // Spoked Hand Flywheel with Wooden Turning Handle
    const flywheelGroup = new THREE.Group();
    flywheelGroup.position.set(-3.8, 2.1, 0);

    const wheelRim = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.22, 16, 36), brassMat);
    wheelRim.rotation.y = Math.PI / 2;
    wheelRim.castShadow = true;
    flywheelGroup.add(wheelRim);

    // 6 Turned Wheel Spokes
    for (let s = 0; s < 6; s++) {
      const sAngle = (s * Math.PI) / 3;
      const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.4, 12), brassMat);
      spoke.position.set(0, Math.cos(sAngle) * 0, Math.sin(sAngle) * 0);
      spoke.rotation.x = sAngle;
      flywheelGroup.add(spoke);
    }

    // Wooden Crank Handle
    const crankPin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 1.2, 12),
      polishedSteelMat,
    );
    crankPin.rotation.z = Math.PI / 2;
    crankPin.position.set(-0.6, 1.7, 0);
    flywheelGroup.add(crankPin);

    const handleGrip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.9, 16),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.35 }),
    );
    handleGrip.rotation.z = Math.PI / 2;
    handleGrip.position.set(-0.8, 1.7, 0);
    flywheelGroup.add(handleGrip);

    machineGroup.add(flywheelGroup);

    // Elias Howe's Signature Curved Oscillating Needle Arm (Claim 1)
    const needleArmGroup = new THREE.Group();
    needleArmGroup.position.set(2.8, 1.2, 0);

    const needleArmBeam = new THREE.Mesh(new THREE.BoxGeometry(0.22, 2.6, 0.35), polishedSteelMat);
    needleArmBeam.castShadow = true;
    needleArmGroup.add(needleArmBeam);

    // Curved Eye-Pointed Steel Needle (Arc Radius matching arm stroke)
    const needleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -1.2, 0),
      new THREE.Vector3(0.08, -1.8, 0.05),
      new THREE.Vector3(0, -2.4, 0),
    ]);
    const needleGeo = new THREE.TubeGeometry(needleCurve, 20, 0.045, 8, false);
    const needleMesh = new THREE.Mesh(needleGeo, polishedSteelMat);
    needleMesh.castShadow = true;
    needleArmGroup.add(needleMesh);

    // Eye at the point
    const eyeMesh = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.02, 8, 12), polishedSteelMat);
    eyeMesh.position.set(0, -2.35, 0);
    needleArmGroup.add(eyeMesh);

    machineGroup.add(needleArmGroup);

    // Oscillating Boat Shuttle Carriage in Circular Race (Claim 2)
    const shuttleGroup = new THREE.Group();
    shuttleGroup.position.set(2.8, -1.5, 0);

    // Double-Pointed Boat Shuttle Body (Brass)
    const shuttlePoints: THREE.Vector2[] = [];
    shuttlePoints.push(new THREE.Vector2(0.01, 1.2)); // Bow point
    shuttlePoints.push(new THREE.Vector2(0.28, 0.6));
    shuttlePoints.push(new THREE.Vector2(0.32, 0)); // Center waist
    shuttlePoints.push(new THREE.Vector2(0.28, -0.6));
    shuttlePoints.push(new THREE.Vector2(0.01, -1.2)); // Stern point
    const shuttleGeo = new THREE.LatheGeometry(shuttlePoints, 24);
    const shuttleBody = new THREE.Mesh(shuttleGeo, brassMat);
    shuttleBody.rotation.x = Math.PI / 2;
    shuttleBody.castShadow = true;
    shuttleGroup.add(shuttleBody);

    // Internal Bobbin Spool inside Shuttle
    const bobbin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.8, 16),
      polishedSteelMat,
    );
    bobbin.rotation.z = Math.PI / 2;
    shuttleGroup.add(bobbin);

    machineGroup.add(shuttleGroup);

    // Baster Clamping Plate & Cloth Feed Workpiece (Claim 3)
    const basterPlate = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.2, 5.0), polishedSteelMat);
    basterPlate.position.set(2.3, -1.2, 0);
    machineGroup.add(basterPlate);

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
      const p = live.current;

      // Crank Kinematics: Needle vertical stroke harmonic oscillation
      const omega = (p.stitchingSpeedRpm / 60) * 2 * Math.PI;
      const crankAngle = elapsed * omega;

      if (p.isCranking) {
        flywheelGroup.rotation.x = crankAngle;
        // Curved needle arm oscillates through cloth
        const needleAngle = Math.cos(crankAngle) * 0.45;
        needleArmGroup.rotation.z = needleAngle;

        // Shuttle oscillates in phase-locked quadrature through needle thread loop
        const shuttleZ = Math.sin(crankAngle) * 1.2;
        shuttleGroup.position.z = shuttleZ;

        // Animate cloth feeding step
        cloth.position.x = 0.5 - ((elapsed * Number(p.clothFeedRateMmPerSec) * 0.1) % 2.0);
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
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
