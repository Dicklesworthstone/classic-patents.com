"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { stepMergenthalerLinotype } from "@/physics/machineKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "matrix_magazine" | "casting_pot" | "spaceband_justifier" | "top";

export function MergenthalerLinotype3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);

  // Linotype Mechanical Composing Parameters
  const { params } = usePatentPhysics("us-313224-mergenthaler-linotype");
  const matrixRate = params.matrixRate ?? 60;
  const spacebandWedge = params.spacebandWedge ?? 6.5;
  const potTempC = params.potTemp ?? 260;
  const linotypeIdle = stepMergenthalerLinotype({
    matrixRatePerMin: matrixRate,
    spacebandWedgeMm: spacebandWedge,
    potTempC,
  });
  const castingLpm = linotypeIdle.linesPerMin;
  const charsPerHour = linotypeIdle.charsPerHour;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    matrixRate,
    spacebandWedge,
    potTempC,
    isAudioMuted,
  });

  const controlsRef = useRef<StudioContext["controls"] | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (preset) {
      case "iso":
        camera.position.set(11.0, 8.5, 12.5);
        controls.target.set(0, 0, 0);
        break;
      case "matrix_magazine":
        camera.position.set(0, 3.5, 3.8);
        controls.target.set(0, 2.2, 0);
        break;
      case "casting_pot":
        camera.position.set(-2.8, 0.5, 3.5);
        controls.target.set(-1.5, -0.4, 0);
        break;
      case "spaceband_justifier":
        camera.position.set(0, 0.8, 3.2);
        controls.target.set(0, 0.2, 0);
        break;
      case "top":
        camera.position.set(0, 14.0, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const toggleSound = () => {
    toggleEngine(() => {
      soundEngine.playSwitchClick();
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [11.0, 8.5, 12.5],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Materials
    const castIronMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.85,
    });

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.22,
      metalness: 0.9,
    });

    const leadMetalMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.35,
      metalness: 0.88,
    });

    const polishedSteelMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.1,
      metalness: 0.95,
    });

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Heavy Cast-Iron C-Frame Column & Base
    const base = new THREE.Mesh(new THREE.BoxGeometry(6.5, 1.2, 5.5), castIronMat);
    base.position.y = -2.4;
    base.receiveShadow = true;
    rootGroup.add(base);

    const column = new THREE.Mesh(new THREE.BoxGeometry(2.2, 6.5, 2.2), castIronMat);
    column.position.set(0, 0.8, -1.0);
    column.castShadow = true;
    rootGroup.add(column);

    // 2. Slanted Brass Matrix Magazine (Claim 1)
    const magGroup = new THREE.Group();
    magGroup.position.set(0, 2.8, 0);
    magGroup.rotation.x = Math.PI / 6; // 30° Slant
    rootGroup.add(magGroup);

    const magazine = new THREE.Mesh(new THREE.BoxGeometry(3.6, 4.2, 0.35), brassMat);
    magazine.castShadow = true;
    magGroup.add(magazine);

    // Vertical magazine channels — brass matrices drop one channel at a time
    const channelMats: THREE.Mesh[] = [];
    for (let c = 0; c < 12; c++) {
      const channel = new THREE.Mesh(new THREE.BoxGeometry(0.16, 3.6, 0.05), polishedSteelMat);
      channel.position.set(-1.65 + c * 0.3, 0.05, 0.22);
      magGroup.add(channel);
      const stacked = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.22, 0.06), brassMat);
      stacked.position.set(-1.65 + c * 0.3, 1.4, 0.28);
      magGroup.add(stacked);
      channelMats.push(stacked);
    }

    // 3. Molten Type-Metal Melting Pot & Pump Plunger (Claim 2)
    const potGroup = new THREE.Group();
    potGroup.position.set(-1.8, -0.4, 0.4);
    rootGroup.add(potGroup);

    const metalPot = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.7, 1.4, 24), castIronMat);
    metalPot.castShadow = true;
    potGroup.add(metalPot);

    // Molten Lead Surface
    const leadSurface = new THREE.Mesh(
      new THREE.CylinderGeometry(0.78, 0.78, 0.1, 24),
      leadMetalMat,
    );
    leadSurface.position.y = 0.6;
    potGroup.add(leadSurface);

    // Pump Plunger Rod
    const plungerRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 2.2, 12),
      polishedSteelMat,
    );
    plungerRod.position.set(0, 1.2, 0);
    potGroup.add(plungerRod);

    // 4. Casting Mold Disk & Cast Lead Slug Output
    const moldDisk = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.2, 0.25, 32),
      polishedSteelMat,
    );
    moldDisk.rotation.z = Math.PI / 2;
    moldDisk.position.set(0, -0.4, 0.8);
    rootGroup.add(moldDisk);

    // Cast Lead Slug (Linotype Line of Type)
    const leadSlug = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.28, 2.4), leadMetalMat);
    leadSlug.position.set(0.6, -0.6, 1.2);
    rootGroup.add(leadSlug);

    // 5. 90-Key Composing Keyboard Deck
    const keyDeck = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.35, 1.8), castIronMat);
    keyDeck.position.set(0, -1.2, 2.0);
    keyDeck.rotation.x = Math.PI / 8;
    rootGroup.add(keyDeck);

    const fallingMatrix = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.32, 0.08), brassMat);
    fallingMatrix.position.set(0, 2.4, 0.4);
    rootGroup.add(fallingMatrix);

    let reqId: number;
    let renderedSteps = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const p = live.current;
      const step = stepMergenthalerLinotype({
        matrixRatePerMin: p.matrixRate,
        spacebandWedgeMm: p.spacebandWedge,
        potTempC: p.potTempC,
        elapsedS: renderedSteps * (1 / 60),
      });

      plungerRod.position.y = 1.2 + step.plungerY;
      moldDisk.rotation.y = step.moldAngle;
      leadSlug.visible = step.slugOut;
      leadSlug.position.x = 0.6 + (step.slugOut ? (step.phase - 0.72) * 4 : 0);
      fallingMatrix.position.y = 2.6 - step.phase * 2.4;
      fallingMatrix.visible = step.phase < 0.55;
      fallingMatrix.position.x = -1.65 + (Math.floor(step.phase * 12) % 12) * 0.3;
      leadMetalMat.color.setHex(step.isEutecticTemp ? 0x94a3b8 : 0x475569);
      channelMats.forEach((mat, i) => {
        mat.position.y =
          1.4 - (i === Math.floor(step.phase * 12) % 12 && step.phase < 0.5 ? 0.35 : 0);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      studio.cleanup();
    };
  }, [live]);

  return (
    <div className="relative w-full h-[620px] bg-parchment-900 rounded-2xl overflow-hidden border border-parchment-700 shadow-2xl flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-parchment-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            Mergenthaler Linotype 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 313,224 (1885)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["matrix_magazine", "Matrix Magazine"],
              ["casting_pot", "Melting Pot"],
              ["spaceband_justifier", "Mold Disk"],
              ["top", "Top"],
            ] as [CameraPreset, string][]
          ).map(([preset, label]) => (
            <button
              key={preset}
              type="button"
              onClick={() => applyCameraPreset(preset)}
              className={`px-2.5 py-1 text-xs font-sans rounded-lg transition-colors ${
                activeCamera === preset
                  ? "bg-amber-600 text-white font-semibold shadow-sm"
                  : "text-parchment-300 hover:text-white hover:bg-parchment-800/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            title={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            {showUiOverlay ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4 text-amber-400" />
            )}
          </button>{" "}
        </div>
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
        title="Mergenthaler slug cycle"
        chips={[
          { label: "Matrices", value: String(matrixRate), unit: "/min" },
          { label: "Chars", value: charsPerHour.toLocaleString(), unit: "/h" },
          { label: "Lines", value: castingLpm.toFixed(2), unit: "/min" },
          {
            label: "Pot",
            value: String(potTempC),
            unit: "°C",
            tone: linotypeIdle.isEutecticTemp ? "ok" : "warn",
          },
          { label: "Justified", value: String(linotypeIdle.justificationWidthMm), unit: "mm" },
          {
            label: "Slug",
            value: linotypeIdle.slugOut ? "eject" : "cast",
            tone: linotypeIdle.slugOut ? "hot" : "ok",
          },
        ]}
      />
    </div>
  );
}
