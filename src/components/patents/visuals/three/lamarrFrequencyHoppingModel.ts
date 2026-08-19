/**
 * Procedural Three.js Model Builder for US 2,292,387
 * Hedy Kiesler Markey (Hedy Lamarr) & George Antheil — Secret Communication System (1942)
 *
 * Implements the authentic spread-spectrum frequency-hopping torpedo guidance system:
 * - Cylindrical torpedo instrument bay aluminum frame with brass sideplates
 * - Clockwork-driven slotted 88-key perforated piano roll paper tape web (Claim 1)
 * - Twin flanged brass supply and take-up tape reels with escapement gear train
 * - 88-contact spring finger sensing comb with gold plunger pins (Claim 2)
 * - 88-channel RF spectral frequency waterfall bars showing active carrier hops vs jamming (Claim 3)
 * - RF carrier hopping trajectory particles
 */

import * as THREE from "three";
import { createLcg } from "@/utils/lcg";
import { createGlowPointTexture } from "./ThreeStudioScene";

export interface LamarrFrequencyHoppingModel {
  root: THREE.Group;
  apparatusGroup: THREE.Group;
  drum1: THREE.Mesh;
  drum2: THREE.Mesh;
  paperWeb: THREE.Mesh;
  comb: THREE.Mesh;
  spectrumBarsGroup: THREE.Group;
  barMeshes: THREE.Mesh[];
  hopPoints: THREE.Points;
  materials: {
    brassMat: THREE.MeshStandardMaterial;
    pianoRollPaperMat: THREE.MeshStandardMaterial;
    torpedoBayMat: THREE.MeshStandardMaterial;
    goldCombMat: THREE.MeshStandardMaterial;
    pinMat: THREE.MeshStandardMaterial;
    hopMat: THREE.PointsMaterial;
    aluminumBayMat?: THREE.MeshStandardMaterial;
  };
  updateKinematics: (
    delta: number,
    activeChan: number,
    liveChannels: number,
    isJammingActive: boolean,
    jamCenter: number,
    isCutaway?: boolean,
  ) => void;
  dispose: () => void;
}

/**
 * Deterministic unit noise for procedural grain generation.
 */
function deterministicUnit(index: number, channel: number): number {
  const sample = Math.sin((index + 1) * 12.9898 + (channel + 1) * 78.233) * 43758.5453;
  return sample - Math.floor(sample);
}

/**
 * Procedural Perforated Player Piano Roll Paper Texture
 */
function createPianoRollTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  // Aged Manila player piano roll tone
  ctx.fillStyle = "#fef8e7";
  ctx.fillRect(0, 0, 512, 512);

  // Subtle paper fibers
  for (let f = 0; f < 250; f++) {
    const fx = deterministicUnit(f, 0) * 512;
    const fy = deterministicUnit(f, 1) * 512;
    ctx.strokeStyle = "rgba(190, 160, 110, 0.2)";
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(fx + 6, fy + (deterministicUnit(f, 2) - 0.5) * 4);
    ctx.stroke();
  }

  // Margin alignment guide tracks
  ctx.strokeStyle = "rgba(160, 120, 70, 0.4)";
  ctx.lineWidth = 1.0;
  ctx.strokeRect(16, 0, 480, 512);

  // Perforated 88-key note slot punches
  ctx.fillStyle = "#1e293b";
  for (let row = 0; row < 18; row++) {
    for (let col = 0; col < 12; col++) {
      if (deterministicUnit(row * 12 + col, 3) > 0.45) {
        const px = 32 + col * 38 + (deterministicUnit(row, 4) - 0.5) * 8;
        const py = 20 + row * 27;
        const isLong = deterministicUnit(row * 12 + col, 5) > 0.7;
        ctx.beginPath();
        ctx.roundRect(px, py, isLong ? 26 : 14, 8, 3);
        ctx.fill();
      }
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildLamarrFrequencyHoppingModel(): LamarrFrequencyHoppingModel {
  const root = new THREE.Group();
  const disposables: Array<{ dispose: () => void }> = [];
  const lcg = createLcg(19420811);

  const paperTex = createPianoRollTexture();
  if (paperTex) disposables.push(paperTex);

  // --- AUTHENTIC MATERIALS ---
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.18,
    metalness: 0.92,
  });
  disposables.push(brassMat);

  const pianoRollPaperMat = new THREE.MeshStandardMaterial({
    ...(paperTex ? { map: paperTex } : {}),
    color: 0xfef9e7,
    roughness: 0.8,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });
  disposables.push(pianoRollPaperMat);

  const torpedoBayMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.85,
    roughness: 0.35,
    side: THREE.BackSide,
  });
  disposables.push(torpedoBayMat);

  const goldCombMat = new THREE.MeshStandardMaterial({
    color: 0xca8a04,
    roughness: 0.2,
    metalness: 0.95,
  });
  disposables.push(goldCombMat);

  const pinMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    metalness: 0.95,
  });
  disposables.push(pinMat);

  // ==========================================
  // TORPEDO INSTRUMENT BAY & PIANO ROLL ASSEMBLY (CLAIM 1)
  // ==========================================
  const apparatusGroup = new THREE.Group();
  root.add(apparatusGroup);

  // Torpedo Bay Aluminum Shell with Bulkhead Rings
  const bayGeo = new THREE.CylinderGeometry(4.2, 4.2, 7.8, 36, 1, true);
  disposables.push(bayGeo);
  const torpedoBay = new THREE.Mesh(bayGeo, torpedoBayMat);
  torpedoBay.rotation.z = Math.PI / 2;
  torpedoBay.position.y = 0.5;
  apparatusGroup.add(torpedoBay);

  // Bulkhead Ring Ribs
  [-3.8, 3.8].forEach((rx) => {
    const ringGeo = new THREE.TorusGeometry(4.22, 0.08, 12, 36);
    disposables.push(ringGeo);
    const ring = new THREE.Mesh(ringGeo, brassMat);
    ring.rotation.y = Math.PI / 2;
    ring.position.set(rx, 0.5, 0);
    apparatusGroup.add(ring);
  });

  // Brass Framework Sideplates with Weight-Reduction Cutouts
  [-2.6, 2.6].forEach((zPos) => {
    const plateGeo = new THREE.BoxGeometry(7.2, 2.8, 0.15);
    disposables.push(plateGeo);
    const sidePlate = new THREE.Mesh(plateGeo, brassMat);
    sidePlate.position.set(0, 0.4, zPos);
    sidePlate.castShadow = true;
    apparatusGroup.add(sidePlate);
  });

  // Supply and Take-Up Piano Roll Drums with Flanges
  const drumGeo = new THREE.CylinderGeometry(0.75, 0.75, 5.0, 32);
  disposables.push(drumGeo);

  const drum1 = new THREE.Mesh(drumGeo, brassMat);
  drum1.rotation.x = Math.PI / 2;
  drum1.position.set(-1.8, 0.6, 0);
  drum1.castShadow = true;
  apparatusGroup.add(drum1);

  const drum2 = new THREE.Mesh(drumGeo, brassMat);
  drum2.rotation.x = Math.PI / 2;
  drum2.position.set(1.8, 0.6, 0);
  drum2.castShadow = true;
  apparatusGroup.add(drum2);

  // Drum Brass End Flanges
  [
    [-1.8, -2.5],
    [-1.8, 2.5],
    [1.8, -2.5],
    [1.8, 2.5],
  ].forEach(([dx, dz]) => {
    const flangeGeo = new THREE.CylinderGeometry(1.25, 1.25, 0.06, 24);
    disposables.push(flangeGeo);
    const flange = new THREE.Mesh(flangeGeo, brassMat);
    flange.rotation.x = Math.PI / 2;
    flange.position.set(dx, 0.6, dz);
    apparatusGroup.add(flange);
  });

  // Slotted 88-Key Perforated Paper Web
  const webGeo = new THREE.PlaneGeometry(3.6, 4.8, 24, 16);
  disposables.push(webGeo);
  const paperWeb = new THREE.Mesh(webGeo, pianoRollPaperMat);
  paperWeb.rotation.x = -Math.PI / 2;
  paperWeb.position.set(0, 1.35, 0);
  paperWeb.castShadow = true;
  apparatusGroup.add(paperWeb);

  // ==========================================
  // 88-CONTACT SENSING COMB (CLAIM 2)
  // ==========================================
  const combGeo = new THREE.BoxGeometry(0.35, 0.4, 4.9);
  disposables.push(combGeo);
  const comb = new THREE.Mesh(combGeo, goldCombMat);
  comb.position.set(0, 1.6, 0);
  comb.castShadow = true;
  apparatusGroup.add(comb);

  for (let p = 0; p < 22; p++) {
    const pinGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.35, 8);
    disposables.push(pinGeo);
    const pin = new THREE.Mesh(pinGeo, pinMat);
    pin.position.set(0, 1.4, (p - 10.5) * 0.22);
    apparatusGroup.add(pin);
  }

  // ==========================================
  // 88-CHANNEL RF SPECTRAL WATERFALL (CLAIM 3)
  // ==========================================
  const spectrumBarsGroup = new THREE.Group();
  spectrumBarsGroup.position.set(0, -2.4, 0);
  root.add(spectrumBarsGroup);

  const maxDisplayChannels = 44;
  const barMeshes: THREE.Mesh[] = [];

  for (let c = 0; c < maxDisplayChannels; c++) {
    const barGeo = new THREE.BoxGeometry(0.12, 0.4, 0.12);
    disposables.push(barGeo);

    const barMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.3,
      metalness: 0.8,
    });
    disposables.push(barMat);

    const bar = new THREE.Mesh(barGeo, barMat);
    const xPos = (c - (maxDisplayChannels - 1) / 2) * 0.18;
    bar.position.set(xPos, 0.2, 0);
    spectrumBarsGroup.add(bar);
    barMeshes.push(bar);
  }

  // Carrier Hop Trajectory Particles
  const hopCount = 88;
  const hopGeo = new THREE.BufferGeometry();
  disposables.push(hopGeo);
  const hopPos = new Float32Array(hopCount * 3);

  const glowTex = createGlowPointTexture();
  disposables.push(glowTex);

  for (let i = 0; i < hopCount; i++) {
    const idx = i * 3;
    hopPos[idx] = (lcg() - 0.5) * 7.5;
    hopPos[idx + 1] = -1.2 + (lcg() - 0.5) * 2.2;
    hopPos[idx + 2] = (lcg() - 0.5) * 1.5;
  }

  hopGeo.setAttribute("position", new THREE.BufferAttribute(hopPos, 3));

  const hopMat = new THREE.PointsMaterial({
    size: 0.4,
    map: glowTex,
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  disposables.push(hopMat);

  const hopPoints = new THREE.Points(hopGeo, hopMat);
  root.add(hopPoints);

  const updateKinematics = (
    delta: number,
    activeChan: number,
    liveChannels: number,
    isJammingActive: boolean,
    jamCenter: number,
    isCutaway = false,
  ) => {
    updateLamarrFrequencyHoppingKinematics(
      model,
      delta,
      activeChan,
      liveChannels,
      isJammingActive,
      jamCenter,
      isCutaway,
    );
  };

  const dispose = () => {
    for (const d of disposables) {
      d.dispose();
    }
  };

  const model: LamarrFrequencyHoppingModel = {
    root,
    apparatusGroup,
    drum1,
    drum2,
    paperWeb,
    comb,
    spectrumBarsGroup,
    barMeshes,
    hopPoints,
    materials: {
      brassMat,
      pianoRollPaperMat,
      torpedoBayMat,
      goldCombMat,
      pinMat,
      hopMat,
    },
    updateKinematics,
    dispose,
  };

  return model;
}

/**
 * Updates Hedy Lamarr & George Antheil 88-key piano roll frequency-hopping synchronization, spectrum waterfall bars, and torpedo bay cutaway.
 */
export function updateLamarrFrequencyHoppingKinematics(
  model: LamarrFrequencyHoppingModel,
  delta: number,
  activeChan: number,
  liveChannels: number,
  isJammingActive: boolean,
  jamCenter: number,
  isCutaway = false,
): void {
  model.drum1.rotation.y += delta * 1.5;
  model.drum2.rotation.y += delta * 1.5;

  const maxDisplayChannels = model.barMeshes.length;
  for (let c = 0; c < maxDisplayChannels; c++) {
    const bar = model.barMeshes[c];
    if (c >= liveChannels) {
      bar.visible = false;
      continue;
    }
    bar.visible = true;

    const mat = bar.material as THREE.MeshStandardMaterial;
    const isJamZone = isJammingActive && Math.abs(c - jamCenter) <= 2;
    const isActive = c === activeChan;

    if (isActive) {
      bar.scale.y = 3.5;
      bar.position.y = 0.7;
      mat.color.setHex(0x38bdf8);
      mat.emissive.setHex(0x0284c7);
      mat.emissiveIntensity = 0.8;
    } else if (isJamZone) {
      bar.scale.y = 2.2;
      bar.position.y = 0.44;
      mat.color.setHex(0xef4444);
      mat.emissive.setHex(0x991b1b);
      mat.emissiveIntensity = 0.4;
    } else {
      bar.scale.y = 1.0;
      bar.position.y = 0.2;
      mat.color.setHex(0x334155);
      mat.emissive.setHex(0x000000);
      mat.emissiveIntensity = 0.0;
    }
  }

  // Cutaway mode: make torpedo outer aluminum shell translucent
  model.materials.torpedoBayMat.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.torpedoBayMat.transparent = isCutaway;
}
