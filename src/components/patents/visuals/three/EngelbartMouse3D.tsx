"use client";

import { Mouse, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createThreeStudioScene } from "./ThreeStudioScene";

export function EngelbartMouse3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse Kinematics State Controls
  const [displacementSpeedMmSec, setDisplacementSpeedMmSec] = useState<number>(120); // 20 to 300 mm/s
  const [mouseTrajectory, setMouseTrajectory] = useState<"diagonal" | "circle" | "figure8">(
    "figure8",
  );
  const [cpiResolution, setCpiResolution] = useState<number>(200); // 50 to 800 CPI
  const [isClicking, setIsClicking] = useState<boolean>(false);
  const [_isHovering, _setIsHovering] = useState<boolean>(true);

  // Kinematics & Coordinate Calculations
  const cursorCoordinates = {
    x: Math.round(1024 / 2 + Math.sin(Date.now() * 0.002) * 240),
    y: Math.round(768 / 2 + Math.cos(Date.now() * 0.003) * 180),
  };
  const pulseRateHz = Math.round((displacementSpeedMmSec / 25.4) * cpiResolution);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with High-Luminosity Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [11, 9, 13],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const woodHousingMat = new THREE.MeshStandardMaterial({
      color: 0x9a3412, // Carved walnut wood mouse housing
      roughness: 0.35,
      metalness: 0.05,
    });

    const brassWheelMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Polished brass encoder wheels
      roughness: 0.18,
      metalness: 0.92,
    });

    const redButtonMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626, // Red microswitch click button
      roughness: 0.25,
      metalness: 0.1,
    });

    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x475569, // Formica computer desk tabletop
      roughness: 0.4,
      metalness: 0.2,
    });

    // --- 3D ENGELBART MOUSE ASSEMBLY ---
    const mouseGroup = new THREE.Group();
    scene.add(mouseGroup);

    // Carved Wood Block Chassis (Blocky 1964 prototype)
    const blockGeo = new THREE.BoxGeometry(4.2, 2.2, 5.8);
    const body = new THREE.Mesh(blockGeo, woodHousingMat);
    body.position.y = 1.1;
    body.castShadow = true;
    body.receiveShadow = true;
    mouseGroup.add(body);

    // Red Click Microswitch on Top Front Corner
    const buttonGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.4, 16);
    const redButton = new THREE.Mesh(buttonGeo, redButtonMat);
    redButton.position.set(1.2, 2.3, -1.8);
    redButton.castShadow = true;
    mouseGroup.add(redButton);

    // Trailing Multi-Conductor Cord (Resembling a "Mouse" tail)
    const cordCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.4, 2.9),
      new THREE.Vector3(0.5, 0.2, 4.2),
      new THREE.Vector3(1.8, 0.1, 5.5),
      new THREE.Vector3(3.2, 0.1, 7.0),
    ]);
    const cordGeo = new THREE.TubeGeometry(cordCurve, 24, 0.1, 8, false);
    const cord = new THREE.Mesh(
      cordGeo,
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 }),
    );
    cord.castShadow = true;
    mouseGroup.add(cord);

    // --- ORTHOGONAL ENCODER WHEELS (90 DEGREES PERPENDICULAR) ---
    // Wheel 1: X-Displacement Wheel (Rolls for horizontal motion, skids for vertical)
    const xWheelGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.18, 24);
    const xWheel = new THREE.Mesh(xWheelGeo, brassWheelMat);
    xWheel.rotation.z = Math.PI / 2;
    xWheel.position.set(-1.2, 0.1, -0.6);
    xWheel.castShadow = true;
    mouseGroup.add(xWheel);

    // Wheel 2: Y-Displacement Wheel (Perpendicular, rolls for vertical motion)
    const yWheel = new THREE.Mesh(xWheelGeo, brassWheelMat);
    yWheel.rotation.x = Math.PI / 2;
    yWheel.position.set(1.2, 0.1, 1.2);
    yWheel.castShadow = true;
    mouseGroup.add(yWheel);

    // Tabletop Base Surface
    const desk = new THREE.Mesh(new THREE.BoxGeometry(22, 0.4, 22), deskMat);
    desk.position.y = -0.2;
    desk.receiveShadow = true;
    scene.add(desk);

    // --- RENDER LOOP & 2D TRAJECTORY DYNAMICS ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const _delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Trajectory paths
      let targetX = 0;
      let targetZ = 0;
      const speed = displacementSpeedMmSec * 0.015;

      if (mouseTrajectory === "circle") {
        targetX = Math.cos(elapsed * speed) * 3.5;
        targetZ = Math.sin(elapsed * speed) * 3.5;
      } else if (mouseTrajectory === "diagonal") {
        targetX = Math.sin(elapsed * speed) * 4.0;
        targetZ = Math.sin(elapsed * speed) * 4.0;
      } else {
        // Figure 8 Lissajous curve
        targetX = Math.sin(elapsed * speed) * 4.0;
        targetZ = Math.sin(elapsed * speed * 2.0) * 2.2;
      }

      // Wheel angular velocity decomposition
      const dX = targetX - mouseGroup.position.x;
      const dZ = targetZ - mouseGroup.position.z;

      mouseGroup.position.x = targetX;
      mouseGroup.position.z = targetZ;

      // X-Wheel rotates with dX, Y-Wheel rotates with dZ
      xWheel.rotation.x += dX * 4.0;
      yWheel.rotation.z += dZ * 4.0;

      // Click animation
      if (isClicking) {
        redButton.position.y = 2.15;
      } else {
        redButton.position.y = 2.3 + Math.sin(elapsed * 4.0) * 0.03;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      studio.dispose();
    };
  }, [displacementSpeedMmSec, mouseTrajectory, isClicking]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Live HUD Telemetry Overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
            <div className="text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Mouse className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              X-Y Position Indicator Telemetry
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs font-sans">
              <div>
                <span className="text-ink-600 dark:text-ink-400">CRT Coordinates:</span>{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  ({cursorCoordinates.x}, {cursorCoordinates.y}) px
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Pulse Train Rate:</span>{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {pulseRateHz} Hz Quadrature
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Linear Velocity:</span>{" "}
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {displacementSpeedMmSec} mm/s ({(displacementSpeedMmSec / 25.4).toFixed(1)} in/s)
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Encoder Resolution:</span>{" "}
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {cpiResolution} Counts/Inch
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Douglas Engelbart (US 3,541,541) — The Mother of All Demos (1968)</span>
          </div>
        </div>

        {/* Click Simulation Button */}
        <div className="absolute bottom-4 left-4 z-10 flex gap-2">
          <button
            type="button"
            onMouseDown={() => setIsClicking(true)}
            onMouseUp={() => setIsClicking(false)}
            onTouchStart={() => setIsClicking(true)}
            onTouchEnd={() => setIsClicking(false)}
            className={`px-5 py-2.5 rounded-xl font-sans font-bold text-sm shadow-lg transition-all active:scale-95 ${
              isClicking
                ? "bg-red-600 text-white ring-4 ring-red-400/40"
                : "bg-white dark:bg-ink-800 text-ink-900 dark:text-parchment-100 border border-parchment-300 dark:border-ink-700"
            }`}
          >
            {isClicking ? "CLICK ACTIVE" : "PRESS MOUSE BUTTON"}
          </button>
        </div>

        {/* Trajectory Pattern Selector */}
        <div className="absolute top-4 right-4 z-10 flex gap-1.5">
          {(["figure8", "circle", "diagonal"] as const).map((pattern) => (
            <button
              key={pattern}
              type="button"
              onClick={() => setMouseTrajectory(pattern)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-sans font-semibold capitalize border transition-all ${
                mouseTrajectory === pattern
                  ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                  : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
              }`}
            >
              {pattern}
            </button>
          ))}
        </div>
      </div>

      {/* Parameter Sliders Panel */}
      <div className="p-4 sm:p-5 bg-parchment-100/80 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
        {/* Speed Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Hand Motion Velocity:</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">
              {displacementSpeedMmSec} mm/s
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="300"
            step="10"
            value={displacementSpeedMmSec}
            onChange={(e) => setDisplacementSpeedMmSec(Number(e.target.value))}
            className="w-full accent-amber-600 dark:accent-amber-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Decomposes into orthogonal X and Y wheel rolls
          </span>
        </div>

        {/* Resolution Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Potentiometer Sensitivity:</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{cpiResolution} CPI</span>
          </div>
          <input
            type="range"
            min="50"
            max="800"
            step="50"
            value={cpiResolution}
            onChange={(e) => setCpiResolution(Number(e.target.value))}
            className="w-full accent-blue-600 dark:accent-blue-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Commutator pulse count per linear inch of table travel
          </span>
        </div>

        {/* Ergonomic Efficiency */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Speed vs Light Pen:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              +45% Faster Targeting
            </span>
          </div>
          <div className="w-full bg-parchment-300 dark:bg-ink-800 rounded-full h-3 overflow-hidden mt-2 border border-parchment-400 dark:border-ink-700">
            <div
              className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full transition-all duration-300"
              style={{ width: "88%" }}
            />
          </div>
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Table-supported wrist eliminates operator arm fatigue
          </span>
        </div>

        {/* Historical Impact */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Historical Impact:</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              Xerox Alto &amp; Apple Mac
            </span>
          </div>
          <span className="text-[11px] text-ink-700 dark:text-parchment-200 block pt-1 leading-relaxed">
            Licensed to Apple Computer for $40,000, launching GUI computing.
          </span>
        </div>
      </div>
    </div>
  );
}
