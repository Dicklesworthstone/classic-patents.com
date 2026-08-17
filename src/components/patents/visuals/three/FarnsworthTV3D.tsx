"use client";

import { Tv } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function FarnsworthTV3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Television Electronic Scan Control Parameters
  const [scanLines, setScanLines] = useState<number>(60); // 15 to 240 scan lines
  const [frameRateFps, setFrameRateFps] = useState<number>(24); // 10 to 60 fps
  const [isNipkowMechMode, setIsNipkowMechMode] = useState<boolean>(false); // Comparative prior art
  const [showMagneticCoils, setShowMagneticCoils] = useState<boolean>(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 440;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(12, 8, 16);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.replaceChildren(renderer.domElement);

    // --- LIGHTS ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const pointLight = new THREE.PointLight(0x38bdf8, 3, 25);
    pointLight.position.set(0, 4, 6);
    scene.add(pointLight);

    const greenPhosphorGlow = new THREE.PointLight(0x10b981, 2, 15);
    greenPhosphorGlow.position.set(6, 0, 0);
    scene.add(greenPhosphorGlow);

    // --- GRID ---
    const grid = new THREE.GridHelper(30, 20, 0x0284c7, 0x1e293b);
    grid.position.y = -4;
    scene.add(grid);

    // --- MATERIALS ---
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      opacity: 1,
      transparent: true,
      roughness: 0.1,
      ior: 1.5,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });

    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.9,
      roughness: 0.2,
    });

    const copperCoilMaterial = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.7,
      roughness: 0.3,
    });

    const phosphorScreenMaterial = new THREE.MeshBasicMaterial({
      color: 0x10b981,
    });

    // --- 3D TUBE ENVELOPE GROUP ---
    const tubeGroup = new THREE.Group();
    scene.add(tubeGroup);

    // Glass Image Dissector Vacuum Tube
    const tubeCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 2.4, 10.0, 32, 1, true),
      glassMaterial,
    );
    tubeCylinder.rotation.z = Math.PI / 2;
    tubeGroup.add(tubeCylinder);

    const frontHemisphere = new THREE.Mesh(
      new THREE.SphereGeometry(2.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      glassMaterial,
    );
    frontHemisphere.rotation.z = -Math.PI / 2;
    frontHemisphere.position.x = 5.0;
    tubeGroup.add(frontHemisphere);

    const backHemisphere = new THREE.Mesh(
      new THREE.SphereGeometry(2.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      glassMaterial,
    );
    backHemisphere.rotation.z = Math.PI / 2;
    backHemisphere.position.x = -5.0;
    tubeGroup.add(backHemisphere);

    // Photoelectric Cathode Plate (Left End)
    const cathodePlate = new THREE.Mesh(
      new THREE.CircleGeometry(2.0, 32),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.2 }),
    );
    cathodePlate.rotation.y = Math.PI / 2;
    cathodePlate.position.x = -4.5;
    tubeGroup.add(cathodePlate);

    // Anode Collector Target with Pinhole Aperture (Right End)
    const anodePlate = new THREE.Mesh(new THREE.RingGeometry(0.3, 2.0, 32), metalMaterial);
    anodePlate.rotation.y = -Math.PI / 2;
    anodePlate.position.x = 4.5;
    tubeGroup.add(anodePlate);

    const phosphorTarget = new THREE.Mesh(
      new THREE.CircleGeometry(0.25, 16),
      phosphorScreenMaterial,
    );
    phosphorTarget.rotation.y = -Math.PI / 2;
    phosphorTarget.position.x = 4.51;
    tubeGroup.add(phosphorTarget);

    // External Magnetic Deflection Yoke Coils (X and Y Deflection)
    const yokeGroup = new THREE.Group();
    const xCoilTop = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.4, 5.4), copperCoilMaterial);
    xCoilTop.position.set(0, 2.8, 0);
    const xCoilBottom = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.4, 5.4), copperCoilMaterial);
    xCoilBottom.position.set(0, -2.8, 0);

    const yCoilFront = new THREE.Mesh(new THREE.BoxGeometry(2.5, 5.4, 0.4), copperCoilMaterial);
    yCoilFront.position.set(0, 0, 2.8);
    const yCoilBack = new THREE.Mesh(new THREE.BoxGeometry(2.5, 5.4, 0.4), copperCoilMaterial);
    yCoilBack.position.set(0, 0, -2.8);

    yokeGroup.add(xCoilTop);
    yokeGroup.add(xCoilBottom);
    yokeGroup.add(yCoilFront);
    yokeGroup.add(yCoilBack);
    tubeGroup.add(yokeGroup);

    // --- DYNAMIC ELECTRON BEAM RASTER PARTICLES ---
    const electronCount = 80;
    const electronGeo = new THREE.BufferGeometry();
    const electronPositions = new Float32Array(electronCount * 3);
    electronGeo.setAttribute("position", new THREE.BufferAttribute(electronPositions, 3));

    const electronMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.15,
      transparent: true,
      opacity: 0.9,
    });
    const electronStream = new THREE.Points(electronGeo, electronMat);
    tubeGroup.add(electronStream);

    // --- MOUSE ORBIT CONTROLS ---
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let sphericalTheta = 0.7;
    let sphericalPhi = 0.4;
    let sphericalRadius = 18;

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
      sphericalRadius = Math.max(8, Math.min(35, sphericalRadius + e.deltaY * 0.02));
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    dom.addEventListener("wheel", onWheel, { passive: false });

    // --- ANIMATION LOOP ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Camera Orbit
      camera.position.x = sphericalRadius * Math.sin(sphericalTheta) * Math.cos(sphericalPhi);
      camera.position.y = sphericalRadius * Math.sin(sphericalPhi);
      camera.position.z = sphericalRadius * Math.cos(sphericalTheta) * Math.cos(sphericalPhi);
      camera.lookAt(0, 0, 0);

      yokeGroup.visible = showMagneticCoils;

      // Raster Sawtooth Deflection Math
      const lineFreq = scanLines * frameRateFps;
      const horizontalPhase = (time * lineFreq) % 1.0;
      const verticalPhase = (time * frameRateFps) % 1.0;

      const targetX = 4.5;
      const deflY = isNipkowMechMode ? 0 : (verticalPhase - 0.5) * 2.8;
      const deflZ = isNipkowMechMode ? 0 : (horizontalPhase - 0.5) * 2.8;

      phosphorTarget.position.set(targetX + 0.01, deflY * 0.4, deflZ * 0.4);

      // Interpolate Electron Stream Curve
      const positions = electronGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < electronCount; i++) {
        const progress = i / electronCount;
        const startX = -4.5;
        const currX = startX + progress * (targetX - startX);
        const currY = Math.sin((progress * Math.PI) / 2) * deflY;
        const currZ = Math.sin((progress * Math.PI) / 2) * deflZ;

        positions[i * 3] = currX;
        positions[i * 3 + 1] = currY;
        positions[i * 3 + 2] = currZ;
      }
      electronGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

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
  }, [scanLines, frameRateFps, isNipkowMechMode, showMagneticCoils]);

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Tv className="w-5 h-5 text-emerald-500 animate-pulse" />
            <h3 className="font-serif text-xl font-bold text-ink-900 dark:text-parchment-100">
              3D Real-Time Farnsworth Electronic Television Dissector Simulator (US 1,773,980)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-1">
            Real-time Three.js electron-optical simulation of{" "}
            <strong>photoelectric cathode emission</strong> and{" "}
            <strong>magnetic raster scanning</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsNipkowMechMode(!isNipkowMechMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors border shadow-sm ${
              isNipkowMechMode
                ? "bg-red-600 text-white border-red-700"
                : "bg-emerald-600 text-white border-emerald-700"
            }`}
          >
            {isNipkowMechMode
              ? "Prior Art: Mechanical Nipkow (30 Lines)"
              : "✓ Farnsworth All-Electronic Raster"}
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas & HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-[#0a0f1d] border border-parchment-300 dark:border-ink-800 relative min-h-[440px] overflow-hidden">
          {/* Top HUD */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none text-xs font-mono">
            <div className="px-3 py-1 bg-ink-900/90 border border-ink-800 text-emerald-300 rounded-lg shadow">
              Beam Velocity: <span className="font-bold">{scanLines * frameRateFps} lines/sec</span>{" "}
              ({scanLines} lines @ {frameRateFps} fps)
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={() => setShowMagneticCoils(!showMagneticCoils)}
                className={`px-2.5 py-1 rounded border text-[11px] font-mono transition-colors ${
                  showMagneticCoils
                    ? "bg-amber-600 text-white border-amber-500"
                    : "bg-ink-900 text-ink-400 border-ink-800"
                }`}
              >
                Deflection Coils: {showMagneticCoils ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* 3D Canvas */}
          <div ref={containerRef} className="w-full h-[440px] cursor-grab active:cursor-grabbing" />

          {/* Bottom Telemetry */}
          <div className="w-full grid grid-cols-4 gap-2 text-center text-xs font-mono p-3 bg-ink-950/90 border-t border-ink-800 text-ink-300 z-10">
            <div>
              <span className="text-ink-500 block text-[10px]">SCAN RESOLUTION</span>
              <span className="text-emerald-400 font-bold">{scanLines} Scan Lines</span>
            </div>
            <div>
              <span className="text-ink-500 block text-[10px]">FRAME RATE</span>
              <span className="text-blue-400 font-bold">{frameRateFps} FPS</span>
            </div>
            <div>
              <span className="text-ink-500 block text-[10px]">DEFLECTION MODE</span>
              <span className="text-amber-400 font-bold">
                {isNipkowMechMode ? "Mechanical Wheel" : "Electromagnetic"}
              </span>
            </div>
            <div>
              <span className="text-ink-500 block text-[10px]">INTERACTION</span>
              <span className="text-purple-400">Drag to Orbit / Scroll Zoom</span>
            </div>
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/70 dark:bg-ink-900/60 p-5 space-y-4">
            <span className="font-serif font-bold text-sm text-ink-900 dark:text-parchment-100 block">
              Electron Optics &amp; Deflection Controls
            </span>

            {/* Scan Lines Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Vertical Line Resolution
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {scanLines} Lines
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="180"
                step="10"
                value={scanLines}
                onChange={(e) => setScanLines(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Frame Rate Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Frame Scan Rate
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {frameRateFps} FPS
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="2"
                value={frameRateFps}
                onChange={(e) => setFrameRateFps(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-ink-900 dark:text-parchment-100 text-xs font-sans space-y-1">
              <span className="font-bold text-emerald-900 dark:text-emerald-300 block font-mono text-[11px]">
                Farnsworth&apos;s Central Innovation:
              </span>
              <p className="leading-relaxed">
                Rather than moving heavy glass lenses or spinning perforated metal disks, Farnsworth
                deflected a weightless beam of electrons using high-frequency magnetic coils.
                Electrons have essentially zero inertia, allowing thousands of scan lines per
                second.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
