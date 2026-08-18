"use client";

import { Eye, EyeOff, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { stepDavenportMotor } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

export function DavenportMotor3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { params, updateParam } = usePatentPhysics("us-132-davenport-electric-motor");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);

  const batteryVoltage = params.batteryVoltage ?? 12;
  const loadTorque = params.loadTorque ?? 0.8;
  const davenport = stepDavenportMotor({ batteryVoltage, loadTorque });
  const motorRpm = davenport.shaftRpm;
  const live = useLiveSimParams({ motorRpm, batteryVoltage, loadTorque });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isDark = document.documentElement.classList.contains("dark");
    const studio = createThreeStudioScene({
      container,
      cameraPos: [1.8, 1.4, 2.0],
      targetPos: [0, 0.4, 0],
      fov: 42,
      isDark,
      environmentStyle: "studio",
    });

    const { scene, camera, renderer, controls } = studio;

    // Materials
    const ironMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.35,
      metalness: 0.9,
    });
    const copperMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.3,
      metalness: 0.85,
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.9,
    });
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.8,
      metalness: 0.05,
    });
    const northMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.4,
      metalness: 0.8,
    });
    const southMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.4,
      metalness: 0.8,
    });

    const motorGroup = new THREE.Group();
    scene.add(motorGroup);

    // Wooden Mounting Base
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 1.1), woodMat);
    base.position.y = 0.04;
    base.castShadow = true;
    motorGroup.add(base);

    // Horseshoe Permanent Magnet Stators
    const statorGroup = new THREE.Group();
    statorGroup.position.set(0, 0.45, 0);
    motorGroup.add(statorGroup);

    // North Pole Arc
    const northPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.55, 0.12, 32, 1, true, Math.PI * 0.75, Math.PI * 0.5),
      northMat,
    );
    statorGroup.add(northPole);

    // South Pole Arc
    const southPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.55, 0.12, 32, 1, true, -Math.PI * 0.25, Math.PI * 0.5),
      southMat,
    );
    statorGroup.add(southPole);

    // Rotating Armature Shaft & 4 Electromagnet Coils
    const rotorGroup = new THREE.Group();
    rotorGroup.position.set(0, 0.45, 0);
    motorGroup.add(rotorGroup);

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.7, 16), ironMat);
    shaft.castShadow = true;
    rotorGroup.add(shaft);

    // 4 Cross-Poles with Copper Wire Windings
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const core = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.38, 12), ironMat);
      core.rotation.z = Math.PI / 2;
      core.rotation.y = angle;
      core.position.set(Math.cos(angle) * 0.2, 0, Math.sin(angle) * 0.2);
      rotorGroup.add(core);

      const coil = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.22, 16), copperMat);
      coil.rotation.z = Math.PI / 2;
      coil.rotation.y = angle;
      coil.position.set(Math.cos(angle) * 0.2, 0, Math.sin(angle) * 0.2);
      coil.castShadow = true;
      rotorGroup.add(coil);
    }

    // Split-Ring Commutator on Shaft
    const commGroup = new THREE.Group();
    commGroup.position.set(0, 0.18, 0);
    rotorGroup.add(commGroup);

    const commSeg1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.06, 16, 1, false, 0, Math.PI * 0.85),
      brassMat,
    );
    const commSeg2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.06, 16, 1, false, Math.PI, Math.PI * 0.85),
      brassMat,
    );
    commGroup.add(commSeg1, commSeg2);

    // Fixed Commutator Brushes
    const brush1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.01, 0.02), copperMat);
    brush1.position.set(0.06, 0.63, 0);
    motorGroup.add(brush1);

    const brush2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.01, 0.02), copperMat);
    brush2.position.set(-0.06, 0.63, 0);
    motorGroup.add(brush2);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const rpm = live.current.motorRpm;
      const omega = (rpm * 2 * Math.PI) / 60;
      rotorGroup.rotation.y += omega * clock.getDelta();

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      studio.dispose();
    };
  }, [live]);

  return (
    <div className="relative w-full aspect-[16/9] min-h-[480px] rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 bg-neutral-950 shadow-2xl">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="bg-neutral-900/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-neutral-700/60 shadow-lg pointer-events-auto">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="font-serif text-sm font-bold text-neutral-100">
              Thomas Davenport&apos;s DC Commutator Motor (US 132)
            </span>
          </div>
          <div className="text-[11px] font-mono text-neutral-400">
            Voltage: {batteryVoltage} V | Load: {loadTorque} N·m | Speed: {motorRpm} RPM |{" "}
            {davenport.shaftPowerW} W
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowUiOverlay(!showUiOverlay)}
          className="p-2 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 border border-neutral-700/60 transition-colors shadow-md pointer-events-auto"
          aria-label="Toggle UI Overlay"
        >
          {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* Bottom Controls */}
      {showUiOverlay && (
        <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-neutral-900/90 backdrop-blur-md border border-neutral-700/60 shadow-xl flex items-center justify-between gap-4">
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-xs font-mono text-neutral-300">
              <span>Battery Galvanic Potential</span>
              <span className="text-cyan-400 font-bold">{batteryVoltage} V</span>
            </div>
            <input
              type="range"
              min="4"
              max="24"
              step="1"
              value={batteryVoltage}
              onChange={(e) => updateParam("batteryVoltage", Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
