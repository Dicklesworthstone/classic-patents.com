"use client";

import { ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function KwolekKevlar3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Polymer Chain Parameters
  const [shearFlowRate, setShearFlowRate] = useState<number>(0.8); // 0.0 (random coil) to 1.0 (nematic aligned liquid crystal)
  const [tensileStressGpa, setTensileStressGpa] = useState<number>(3.6); // 0.5 to 5.0 GPa
  const [showHydrogenBonds, setShowHydrogenBonds] = useState<boolean>(true);
  const [_showAromaticRings, _setShowAromaticRings] = useState<boolean>(true);

  // Physical Calculations
  // Kevlar Tensile Modulus: E = 130 GPa
  const elasticModulusGpa = 130;
  const strainPercent = (tensileStressGpa / elasticModulusGpa) * 100;
  const hBondStrengthMpi = Math.round(tensileStressGpa * 280);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 460;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(16, 12, 22);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.replaceChildren(renderer.domElement);

    // --- LIGHTING ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const pointLight = new THREE.PointLight(0x10b981, 3, 30);
    pointLight.position.set(10, 15, 10);
    scene.add(pointLight);

    const amberLight = new THREE.PointLight(0xf59e0b, 2, 25);
    amberLight.position.set(-10, -10, 10);
    scene.add(amberLight);

    // --- GRID ---
    const grid = new THREE.GridHelper(30, 20, 0x10b981, 0x1e293b);
    grid.position.y = -6;
    scene.add(grid);

    // --- MATERIALS ---
    const carbonRingMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.6,
      roughness: 0.3,
    });

    const nitrogenMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.5,
      roughness: 0.3,
    });

    const oxygenMaterial = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      metalness: 0.5,
      roughness: 0.3,
    });

    const hBondMaterial = new THREE.LineDashedMaterial({
      color: 0x10b981,
      dashSize: 0.3,
      gapSize: 0.2,
      linewidth: 2,
    });

    // --- 3D PPTA POLYMER CHAINS GROUP ---
    const polymerGroup = new THREE.Group();
    scene.add(polymerGroup);

    const chainCount = 5;
    const monomersPerChain = 6;
    const chainGroups: THREE.Group[] = [];
    const hBondLines: THREE.Line[] = [];

    for (let c = 0; c < chainCount; c++) {
      const chain = new THREE.Group();
      chain.position.y = (c - (chainCount - 1) / 2) * 2.8;

      for (let m = 0; m < monomersPerChain; m++) {
        const monomerGroup = new THREE.Group();
        const mX = (m - (monomersPerChain - 1) / 2) * 4.2;
        monomerGroup.position.x = mX;

        // P-Phenylene Aromatic Benzene Ring (Hexagon)
        const ringGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.2, 6);
        const ringMesh = new THREE.Mesh(ringGeo, carbonRingMaterial);
        ringMesh.rotation.x = Math.PI / 2;
        monomerGroup.add(ringMesh);

        // Amide Group: C=O Carbonyl
        const oxygen = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), oxygenMaterial);
        oxygen.position.set(1.4, 0.7, 0);
        monomerGroup.add(oxygen);

        // Amide Group: N-H Nitrogen
        const nitrogen = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), nitrogenMaterial);
        nitrogen.position.set(-1.4, -0.7, 0);
        monomerGroup.add(nitrogen);

        chain.add(monomerGroup);
      }

      chainGroups.push(chain);
      polymerGroup.add(chain);
    }

    // Hydrogen Bonds Between Adjacent Chains (N-H ... O=C)
    for (let c = 0; c < chainCount - 1; c++) {
      for (let m = 0; m < monomersPerChain; m++) {
        const points = [
          new THREE.Vector3(
            (m - (monomersPerChain - 1) / 2) * 4.2 - 1.4,
            (c - (chainCount - 1) / 2) * 2.8 - 0.7,
            0,
          ),
          new THREE.Vector3(
            (m - (monomersPerChain - 1) / 2) * 4.2 + 1.4,
            (c + 1 - (chainCount - 1) / 2) * 2.8 + 0.7,
            0,
          ),
        ];
        const hGeo = new THREE.BufferGeometry().setFromPoints(points);
        const hLine = new THREE.Line(hGeo, hBondMaterial);
        hLine.computeLineDistances();
        hBondLines.push(hLine);
        polymerGroup.add(hLine);
      }
    }

    // --- MOUSE ORBIT CONTROLS ---
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let sphericalTheta = 0.75;
    let sphericalPhi = 0.5;
    let sphericalRadius = 26;

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
      sphericalRadius = Math.max(10, Math.min(50, sphericalRadius + e.deltaY * 0.02));
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

      // Liquid Crystal Nematic Orientation vs Random Thermal Wiggle
      const alignment = shearFlowRate; // 1.0 = perfectly rigid parallel rod; 0.0 = random isotropic coil
      chainGroups.forEach((chain, cIdx) => {
        chain.children.forEach((monomer, mIdx) => {
          const thermalWiggle = (1 - alignment) * Math.sin(time * 3.0 + mIdx + cIdx) * 0.4;
          monomer.rotation.z = thermalWiggle;
          monomer.position.z = (1 - alignment) * Math.cos(time * 2.5 + mIdx) * 1.5;
        });
      });

      // Hydrogen Bond Visibility and Vibration
      hBondLines.forEach((line) => {
        line.visible = showHydrogenBonds;
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
  }, [shearFlowRate, showHydrogenBonds]);

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-emerald-500 animate-pulse" />
            <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50">
              3D Real-Time Kwolek Kevlar Aramid Liquid-Crystal Simulator (US 3,671,542)
            </h3>
          </div>
          <p className="text-sm sm:text-base text-ink-700 dark:text-ink-300 mt-1">
            Real-time Three.js molecular physics illustrating{" "}
            <strong>nematic liquid-crystalline chain alignment</strong> and{" "}
            <strong>inter-chain hydrogen bonding nets</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 text-xs sm:text-sm font-mono font-bold border border-emerald-300 dark:border-emerald-800 shadow-2xs">
            5x Stronger Than Steel (Weight Basis)
          </div>
        </div>
      </div>

      {/* 3D WebGL Canvas & HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-[#0a0f1d] border border-parchment-300 dark:border-ink-800 relative min-h-[460px] overflow-hidden">
          {/* Top HUD */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none text-xs sm:text-sm font-mono">
            <div className="px-3.5 py-1.5 bg-ink-900/90 border border-ink-800 text-emerald-300 rounded-xl shadow">
              Polymer State:{" "}
              <span className="font-bold">
                {shearFlowRate > 0.6 ? "Nematic Liquid Crystal" : "Isotropic Random Solution"}
              </span>
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={() => setShowHydrogenBonds(!showHydrogenBonds)}
                className={`px-3 py-1 rounded-lg border text-xs font-mono transition-colors ${
                  showHydrogenBonds
                    ? "bg-emerald-600 text-white border-emerald-500"
                    : "bg-ink-900 text-ink-400 border-ink-800"
                }`}
              >
                H-Bonds (N-H···O): {showHydrogenBonds ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* 3D Canvas */}
          <div ref={containerRef} className="w-full h-[460px] cursor-grab active:cursor-grabbing" />

          {/* Bottom Telemetry */}
          <div className="w-full grid grid-cols-4 gap-3 text-center text-sm font-mono p-4 bg-ink-950/95 border-t border-ink-800 text-ink-300 z-10">
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                TENSILE STRESS
              </span>
              <span className="text-emerald-400 font-bold text-sm sm:text-base">
                {tensileStressGpa} GPa
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                STRAIN ($\varepsilon$)
              </span>
              <span className="text-amber-400 font-bold text-sm sm:text-base">
                {strainPercent.toFixed(2)}%
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                H-BOND NET
              </span>
              <span className="text-blue-400 font-bold text-sm sm:text-base">
                {hBondStrengthMpi} MPa
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
              Polymer Rheology &amp; Shear Alignment
            </span>

            {/* Shear Flow Spinneret Alignment Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Spinneret Shear Alignment ($\dot&#123;\gamma&#125;$)
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {(shearFlowRate * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={shearFlowRate}
                onChange={(e) => setShearFlowRate(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Tensile Stress Load Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Applied Tensile Stress ($\sigma$)
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {tensileStressGpa} GPa
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.1"
                value={tensileStressGpa}
                onChange={(e) => setTensileStressGpa(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-ink-950 dark:text-parchment-100 text-xs sm:text-sm font-sans space-y-1.5">
              <span className="font-bold text-emerald-900 dark:text-emerald-300 block font-mono text-xs uppercase tracking-wider">
                Kwolek&apos;s Lyotropic Liquid Crystals:
              </span>
              <p className="leading-relaxed">
                Most polymer solutions become thick like molasses, but Kwolek discovered that
                poly-p-phenylene terephthalamide at high concentrations abruptly turns into a
                cloudy, water-thin liquid. The rigid rod molecules self-assemble into parallel
                nematic liquid crystals that spin into ultra-high-tenacity Kevlar fibers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
