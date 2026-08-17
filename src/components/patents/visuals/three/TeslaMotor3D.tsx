"use client";

import { Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { soundEngine } from "@/utils/soundEngine";

export function TeslaMotor3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Electrical & Mechanical Simulation State
  const [phaseCount, setPhaseCount] = useState<2 | 3>(2);
  const [acFrequencyHz, setAcFrequencyHz] = useState<number>(60);
  const [shaftLoadPercent, setShaftLoadPercent] = useState<number>(20);
  const [showFluxLines, setShowFluxLines] = useState<boolean>(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Calculated Physics
  const syncRpm = (120 * acFrequencyHz) / 4; // 4 poles
  const slip = Math.min(0.25, (shaftLoadPercent / 100) * 0.2 + 0.02);
  const rotorRpm = Math.round(syncRpm * (1 - slip));

  // Audio AC Hum
  useEffect(() => {
    if (isPlayingAudio) {
      soundEngine.playTeslaMotorHum(acFrequencyHz, rotorRpm);
    } else {
      soundEngine.stopContinuousTone();
    }
    return () => {
      soundEngine.stopContinuousTone();
    };
  }, [isPlayingAudio, acFrequencyHz, rotorRpm]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 440;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(14, 12, 16);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    container.replaceChildren(renderer.domElement);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.8);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.6);
    mainLight.position.set(20, 30, 20);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const blueAccent = new THREE.PointLight(0x38bdf8, 3, 30);
    blueAccent.position.set(-10, 5, -10);
    scene.add(blueAccent);

    // --- BLUEPRINT GRID ---
    const gridHelper = new THREE.GridHelper(40, 30, 0xd97706, 0x1e293b);
    gridHelper.position.y = -5;
    scene.add(gridHelper);

    // --- MATERIALS ---
    const statorIronMaterial = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.8,
      roughness: 0.4,
    });

    const copperCoilActiveMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.7,
      roughness: 0.2,
      emissive: 0xd97706,
      emissiveIntensity: 0.4,
    });

    const copperCoilAltMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.7,
      roughness: 0.2,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4,
    });

    const rotorCoreMaterial = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.9,
      roughness: 0.3,
    });

    const copperBarMaterial = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      metalness: 0.9,
      roughness: 0.1,
    });

    // --- 3D STATOR ASSEMBLY ---
    const statorGroup = new THREE.Group();
    scene.add(statorGroup);

    // Laminated Outer Ring (Ring Geometry Extruded)
    const statorShape = new THREE.Shape();
    statorShape.absarc(0, 0, 6.0, 0, Math.PI * 2, false);
    const statorHole = new THREE.Path();
    statorHole.absarc(0, 0, 4.4, 0, Math.PI * 2, true);
    statorShape.holes.push(statorHole);

    const extrudeSettings = {
      depth: 4.0,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.1,
      bevelThickness: 0.1,
    };
    const statorGeo = new THREE.ExtrudeGeometry(statorShape, extrudeSettings);
    const statorMesh = new THREE.Mesh(statorGeo, statorIronMaterial);
    statorMesh.position.z = -2.0;
    statorGroup.add(statorMesh);

    // 4 Stator Inward Salient Pole Shoes with Copper Windings
    const poleCoils: THREE.Mesh[] = [];
    const poleCount = phaseCount === 2 ? 4 : 6;

    for (let i = 0; i < poleCount; i++) {
      const poleAngle = (i * 2 * Math.PI) / poleCount;
      const poleGroup = new THREE.Group();
      poleGroup.rotation.z = poleAngle;

      // Iron pole shoe
      const poleShoe = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.2, 3.8), statorIronMaterial);
      poleShoe.position.set(0, 4.0, 0);
      poleGroup.add(poleShoe);

      // Copper Coil Toroid Winding
      const coilMat = i % 2 === 0 ? copperCoilActiveMaterial : copperCoilAltMaterial;
      const coilMesh = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.4, 12, 24), coilMat);
      coilMesh.position.set(0, 4.0, 0);
      coilMesh.rotation.x = Math.PI / 2;
      poleGroup.add(coilMesh);
      poleCoils.push(coilMesh);

      statorGroup.add(poleGroup);
    }

    // --- 3D ROTATING ROTOR (SQUIRREL CAGE) ---
    const rotorGroup = new THREE.Group();
    scene.add(rotorGroup);

    // Laminated Cylindrical Rotor Core
    const rotorCore = new THREE.Mesh(
      new THREE.CylinderGeometry(3.6, 3.6, 3.8, 32),
      rotorCoreMaterial,
    );
    rotorCore.rotation.x = Math.PI / 2;
    rotorGroup.add(rotorCore);

    // Central Steel Output Shaft
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 9.0, 24),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.1 }),
    );
    shaft.rotation.x = Math.PI / 2;
    rotorGroup.add(shaft);

    // Embedded Squirrel-Cage Copper Bars
    const barCount = 16;
    for (let i = 0; i < barCount; i++) {
      const bAngle = (i * 2 * Math.PI) / barCount;
      const barMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 3.8, 8),
        copperBarMaterial,
      );
      barMesh.position.set(Math.cos(bAngle) * 3.4, Math.sin(bAngle) * 3.4, 0);
      barMesh.rotation.x = Math.PI / 2;
      rotorGroup.add(barMesh);
    }

    // End Rings Short-Circuiting the Squirrel Cage
    const endRingGeo = new THREE.TorusGeometry(3.4, 0.2, 8, 32);
    const endRingFront = new THREE.Mesh(endRingGeo, copperBarMaterial);
    endRingFront.position.z = 1.9;
    rotorGroup.add(endRingFront);

    const endRingBack = new THREE.Mesh(endRingGeo, copperBarMaterial);
    endRingBack.position.z = -1.9;
    rotorGroup.add(endRingBack);

    // --- 3D ROTATING MAGNETIC FLUX FIELD STREAMLINES ---
    const fluxLineCount = 18;
    const fluxLines: THREE.Line[] = [];
    const fluxMaterial = new THREE.LineBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.8,
      linewidth: 2,
    });

    for (let i = 0; i < fluxLineCount; i++) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-4.0, (i - 9) * 0.4, 0),
        new THREE.Vector3(0, (i - 9) * 0.25, i % 2 === 0 ? 0.8 : -0.8),
        new THREE.Vector3(4.0, (i - 9) * 0.4, 0),
      ]);
      const points = curve.getPoints(24);
      const fluxGeo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(fluxGeo, fluxMaterial);
      fluxLines.push(line);
      scene.add(line);
    }

    // --- MOUSE ORBIT CONTROLS ---
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let sphericalTheta = 0.8;
    let sphericalPhi = 0.6;
    let sphericalRadius = 22;

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
      sphericalRadius = Math.max(10, Math.min(40, sphericalRadius + e.deltaY * 0.02));
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
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Camera Orbit Spherical Positioning
      camera.position.x = sphericalRadius * Math.sin(sphericalTheta) * Math.cos(sphericalPhi);
      camera.position.y = sphericalRadius * Math.sin(sphericalPhi);
      camera.position.z = sphericalRadius * Math.cos(sphericalTheta) * Math.cos(sphericalPhi);
      camera.lookAt(0, 0, 0);

      // Stator Rotating B-Field Angle
      const statorAngularFreq = 2 * Math.PI * (acFrequencyHz / 60) * 2.0;
      const statorFieldAngle = time * statorAngularFreq;

      // Rotor Rotation with Physical Induction Slip
      const rotorAngularVel = statorAngularFreq * (1 - slip);
      rotorGroup.rotation.z += delta * rotorAngularVel;

      // Coil Emissive Glow Pulsing with Phase Current
      poleCoils.forEach((coil, idx) => {
        const polePhaseOffset = (idx * Math.PI) / 2;
        const currentMag = Math.abs(Math.sin(statorFieldAngle + polePhaseOffset));
        (coil.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.2 + currentMag * 0.8;
      });

      // Rotating 3D Magnetic Flux Lines
      fluxLines.forEach((line) => {
        line.visible = showFluxLines;
        line.rotation.z = statorFieldAngle;
      });

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
  }, [acFrequencyHz, phaseCount, showFluxLines, slip]);

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
            <h3 className="font-serif text-xl font-bold text-ink-900 dark:text-parchment-100">
              3D Real-Time Tesla Polyphase AC Induction Motor Simulator (US 381,968)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-1">
            Real-time Three.js electrodynamic simulation of{" "}
            <strong>rotating stator magnetic flux</strong> and{" "}
            <strong>brushless squirrel-cage rotor torque</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors border shadow-sm ${
              isPlayingAudio
                ? "bg-amber-600 text-white border-amber-700 animate-pulse"
                : "bg-parchment-200 dark:bg-ink-800 text-ink-800 dark:text-parchment-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-300"
            }`}
          >
            {isPlayingAudio ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span>{isPlayingAudio ? "60Hz Hum (Live)" : "Play AC Hum"}</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas & HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-[#0a0f1d] border border-parchment-300 dark:border-ink-800 relative min-h-[440px] overflow-hidden">
          {/* Top HUD Switchers */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none text-xs font-mono">
            <div className="px-3 py-1 bg-ink-900/90 border border-ink-800 text-amber-300 rounded-lg shadow">
              Stator Field: <span className="font-bold">{syncRpm} RPM</span> (Synchronous Speed)
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={() => setShowFluxLines(!showFluxLines)}
                className={`px-2.5 py-1 rounded border text-[11px] font-mono transition-colors ${
                  showFluxLines
                    ? "bg-amber-600 text-white border-amber-500"
                    : "bg-ink-900 text-ink-400 border-ink-800"
                }`}
              >
                Flux Lines: {showFluxLines ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* 3D WebGL Canvas */}
          <div ref={containerRef} className="w-full h-[440px] cursor-grab active:cursor-grabbing" />

          {/* Bottom Telemetry Strip */}
          <div className="w-full grid grid-cols-4 gap-2 text-center text-xs font-mono p-3 bg-ink-950/90 border-t border-ink-800 text-ink-300 z-10">
            <div>
              <span className="text-ink-500 block text-[10px]">SYNC SPEED</span>
              <span className="text-amber-400 font-bold">{syncRpm} RPM</span>
            </div>
            <div>
              <span className="text-ink-500 block text-[10px]">ROTOR SPEED</span>
              <span className="text-emerald-400 font-bold">{rotorRpm} RPM</span>
            </div>
            <div>
              <span className="text-ink-500 block text-[10px]">INDUCTION SLIP</span>
              <span className="text-blue-400 font-bold">{(slip * 100).toFixed(1)}%</span>
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
              AC Generator &amp; Stator Tuning
            </span>

            {/* Phase Mode Selection */}
            <div>
              <span className="text-xs font-mono block text-ink-700 dark:text-ink-300 font-semibold mb-1">
                AC Phase Configuration
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setPhaseCount(2)}
                  className={`p-2 rounded-lg border text-center transition-colors ${
                    phaseCount === 2
                      ? "bg-amber-700 text-white border-amber-800 font-bold"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300"
                  }`}
                >
                  2-Phase (90° Quad)
                </button>
                <button
                  type="button"
                  onClick={() => setPhaseCount(3)}
                  className={`p-2 rounded-lg border text-center transition-colors ${
                    phaseCount === 3
                      ? "bg-amber-700 text-white border-amber-800 font-bold"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300"
                  }`}
                >
                  3-Phase (120° Poly)
                </button>
              </div>
            </div>

            {/* AC Frequency Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Stator AC Frequency
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {acFrequencyHz} Hz
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                value={acFrequencyHz}
                onChange={(e) => setAcFrequencyHz(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Shaft Load Torque */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Shaft Mechanical Load
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {shaftLoadPercent}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="95"
                value={shaftLoadPercent}
                onChange={(e) => setShaftLoadPercent(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-ink-900 dark:text-parchment-100 text-xs font-sans space-y-1">
              <span className="font-bold text-amber-900 dark:text-amber-300 block font-mono text-[11px]">
                Why Tesla&apos;s Motor Required No Brushes:
              </span>
              <p className="leading-relaxed">
                By feeding 90°-shifted sinusoidal AC into orthogonal stator coils, the magnetic
                field naturally rotates at $\omega = 2\pi f$. This continuously sweeps across the
                rotor bars, inducing Faraday currents that drag the rotor forward without sparking
                commutators.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
