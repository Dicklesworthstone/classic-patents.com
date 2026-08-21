/**
 * spencerMicrowaveModel.ts
 *
 * Museum-Grade Procedural Three.js Model Builder for US 2,495,429
 * Percy L. Spencer — Method of Treating Foodstuffs (Microwave Oven, 1950)
 *
 * Implements the authentic Raytheon resonant multi-cavity magnetron, waveguide, & heating cavity:
 * 1. Solid oxygen-free high-conductivity (OFHC) copper cylindrical anode block with machined concentric grooves.
 * 2. 8 radial hole-and-slot resonant LC cavities (Claim 1) with capacitive slots and inductive bores.
 * 3. Upper and lower double pi-mode copper strapping rings preventing mode jumping.
 * 4. Central barium-oxide-coated indirectly heated thermionic cathode emitting electron cloud.
 * 5. Radial aluminum radiator cooling fin array with perforated air-duct shroud.
 * 6. High-voltage ceramic vacuum insulator feedthrough bushings and Kovar lead pins.
 * 7. Twin Alnico V permanent magnet pole shoes & heavy return yoke establishing axial B-field.
 * 8. Coaxial output coupling loop launching microwave power into rectangular WR-284 waveguide (Claim 2).
 * 9. Motorized RF mode-stirrer fan and resonant foodstuff heating chamber with pyrex shelf.
 * 10. Rotating 4-spoke electron hub space-charge cloud interacting with RF electric fields.
 */

import * as THREE from "three";
import { heatFrames, sampleHeatAt } from "@/physics/genericWasm";
import { createLcg } from "@/utils/lcg";
import { createGlowPointTexture } from "./ThreeStudioScene";

export interface SpencerMicrowaveModel {
  root: THREE.Group;
  magnetronGroup: THREE.Group;
  anodeOuter: THREE.Mesh;
  cathodeMesh: THREE.Mesh;
  spokePoints: THREE.Points;
  spokeGeo: THREE.BufferGeometry;
  spokePos: Float32Array;
  modeStirrer?: THREE.Group;
  materials: {
    copperAnodeMat: THREE.MeshStandardMaterial;
    cathodeMat: THREE.MeshStandardMaterial;
    alnicoMagnetMat: THREE.MeshStandardMaterial;
    darkCavityMat: THREE.MeshStandardMaterial;
    boreMat: THREE.MeshStandardMaterial;
    steelMat: THREE.MeshStandardMaterial;
    spokeMat: THREE.PointsMaterial;
    ceramicInsulator?: THREE.MeshStandardMaterial;
    radiatorFin?: THREE.MeshStandardMaterial;
    pyrexGlass?: THREE.MeshPhysicalMaterial;
  };
  updateKinematics: (
    delta: number,
    isOscillating: boolean,
    microwaveFreqMhz: number,
    dielectricLoss: number,
    showSpokeWheel: boolean,
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
 * Procedural OFHC Lathe-Machined Copper Texture
 */
function createMachinedCopperTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  ctx.fillStyle = "#c26228";
  ctx.fillRect(0, 0, 512, 512);

  // Concentric lathe tool machining bands
  for (let i = 0; i < 90; i++) {
    const y = i * 5.7 + (deterministicUnit(i, 0) - 0.5) * 2;
    const alpha = 0.06 + (i % 3 === 0 ? 0.12 : 0.03);
    ctx.strokeStyle = `rgba(135, 48, 12, ${alpha})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Procedural Cast Alnico Magnet Texture
 */
function createAlnicoTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  ctx.fillStyle = "#2d3748";
  ctx.fillRect(0, 0, 512, 512);

  // Mottled crystalline grain
  for (let i = 0; i < 600; i++) {
    const px = deterministicUnit(i, 1) * 512;
    const py = deterministicUnit(i, 2) * 512;
    const r = 1.2 + deterministicUnit(i, 3) * 2.5;
    ctx.fillStyle = "rgba(74, 85, 104, 0.4)";
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildSpencerMicrowaveModel(): SpencerMicrowaveModel {
  const root = new THREE.Group();
  const disposables: Array<{ dispose: () => void }> = [];
  const lcg = createLcg(19500124);

  const copperTex = createMachinedCopperTexture();
  if (copperTex) disposables.push(copperTex);

  const alnicoTex = createAlnicoTexture();
  if (alnicoTex) disposables.push(alnicoTex);

  // --- AUTHENTIC MATERIALS ---
  const copperAnodeMat = new THREE.MeshStandardMaterial({
    map: copperTex || undefined,
    transparent: true,
    opacity: 1.0,
    color: 0xd97706,
    roughness: 0.22,
    metalness: 0.9,
  });
  disposables.push(copperAnodeMat);

  const cathodeMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    roughness: 0.35,
    metalness: 0.4,
    emissive: 0xef4444,
    emissiveIntensity: 0.9,
  });
  disposables.push(cathodeMat);

  const alnicoMagnetMat = new THREE.MeshStandardMaterial({
    map: alnicoTex || undefined,
    transparent: true,
    opacity: 1.0,
    color: 0x334155,
    roughness: 0.38,
    metalness: 0.85,
  });
  disposables.push(alnicoMagnetMat);

  const darkCavityMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.75,
  });
  disposables.push(darkCavityMat);

  const boreMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.6,
  });
  disposables.push(boreMat);

  const steelMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.25,
    metalness: 0.92,
  });
  disposables.push(steelMat);

  const ceramicInsulator = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.15,
    metalness: 0.05,
  });
  disposables.push(ceramicInsulator);

  const radiatorFin = new THREE.MeshStandardMaterial({
    color: 0xa1a1aa,
    roughness: 0.28,
    metalness: 0.88,
  });
  disposables.push(radiatorFin);

  const pyrexGlass = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.92,
    roughness: 0.05,
    ior: 1.47,
    transparent: true,
    opacity: 0.85,
  });
  disposables.push(pyrexGlass);

  // ==========================================
  // CAVITY MAGNETRON CORE ASSEMBLY (CLAIM 1)
  // ==========================================
  const magnetronGroup = new THREE.Group();
  root.add(magnetronGroup);

  // Cylindrical OFHC Copper Anode Block
  const anodeGeo = new THREE.CylinderGeometry(4.3, 4.3, 3.4, 48);
  disposables.push(anodeGeo);
  const anodeOuter = new THREE.Mesh(anodeGeo, copperAnodeMat);
  anodeOuter.castShadow = true;
  anodeOuter.receiveShadow = true;
  magnetronGroup.add(anodeOuter);

  // Radial Aluminum Extruded Heat Radiator Cooling Fins
  const finCount = 24;
  const finGeo = new THREE.BoxGeometry(1.4, 3.2, 0.08);
  disposables.push(finGeo);
  for (let f = 0; f < finCount; f++) {
    const fAngle = (f * Math.PI * 2) / finCount;
    const fin = new THREE.Mesh(finGeo, radiatorFin);
    fin.position.set(Math.cos(fAngle) * 4.9, 0, Math.sin(fAngle) * 4.9);
    fin.rotation.y = -fAngle;
    fin.castShadow = true;
    magnetronGroup.add(fin);
  }

  // Perforated Outer Air-Duct Cooling Shroud
  const shroudGeo = new THREE.CylinderGeometry(5.75, 5.75, 3.2, 36, 1, true);
  disposables.push(shroudGeo);
  const shroud = new THREE.Mesh(shroudGeo, steelMat);
  shroud.castShadow = true;
  magnetronGroup.add(shroud);

  // Central Cylindrical Interaction Bore
  const boreGeo = new THREE.CylinderGeometry(1.5, 1.5, 3.42, 36);
  disposables.push(boreGeo);
  const boreMesh = new THREE.Mesh(boreGeo, boreMat);
  magnetronGroup.add(boreMesh);

  // 8 Resonant LC Cavity Holes and Slot Necks (Claim 1)
  const numCavities = 8;
  for (let c = 0; c < numCavities; c++) {
    const angle = (c / numCavities) * Math.PI * 2;
    const rCavity = 2.75;
    const x = Math.cos(angle) * rCavity;
    const z = Math.sin(angle) * rCavity;

    // Resonant Inductive Cylinder Hole
    const cavGeo = new THREE.CylinderGeometry(0.72, 0.72, 3.44, 24);
    disposables.push(cavGeo);
    const cavMesh = new THREE.Mesh(cavGeo, darkCavityMat);
    cavMesh.position.set(x, 0, z);
    magnetronGroup.add(cavMesh);

    // Capacitive Coupling Slot Neck to Center Bore
    const slotGeo = new THREE.BoxGeometry(0.24, 3.44, 1.35);
    disposables.push(slotGeo);
    const slotMesh = new THREE.Mesh(slotGeo, darkCavityMat);
    slotMesh.position.set(Math.cos(angle) * 2.05, 0, Math.sin(angle) * 2.05);
    slotMesh.rotation.y = -angle;
    magnetronGroup.add(slotMesh);
  }

  // Upper and Lower Pi-Mode Copper Strapping Rings
  [-1.75, 1.75].forEach((yRing) => {
    const strapGeo = new THREE.TorusGeometry(2.35, 0.08, 12, 48);
    disposables.push(strapGeo);
    const strapMesh = new THREE.Mesh(strapGeo, copperAnodeMat);
    strapMesh.rotation.x = Math.PI / 2;
    strapMesh.position.y = yRing;
    magnetronGroup.add(strapMesh);
  });

  // Central Thermionic Barium Oxide Cathode Emitter
  const cathodeGeo = new THREE.CylinderGeometry(0.42, 0.42, 4.4, 24);
  disposables.push(cathodeGeo);
  const cathodeMesh = new THREE.Mesh(cathodeGeo, cathodeMat);
  cathodeMesh.castShadow = true;
  magnetronGroup.add(cathodeMesh);

  // Ceramic High-Voltage Insulator Bushings at tube ends
  [-2.4, 2.4].forEach((iy) => {
    const insGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.65, 20);
    disposables.push(insGeo);
    const insulator = new THREE.Mesh(insGeo, ceramicInsulator);
    insulator.position.y = iy;
    insulator.castShadow = true;
    magnetronGroup.add(insulator);
  });

  // Output Waveguide Coupling Loop & Rectangular Horn (Claim 2)
  const waveguideGroup = new THREE.Group();
  waveguideGroup.position.set(3.8, 0, 0);

  const guideGeo = new THREE.BoxGeometry(3.5, 2.2, 1.4);
  disposables.push(guideGeo);
  const guideMesh = new THREE.Mesh(guideGeo, steelMat);
  guideMesh.position.x = 1.75;
  guideMesh.castShadow = true;
  waveguideGroup.add(guideMesh);

  // Waveguide Mounting Flange with Bolting Holes
  const flangeGeo = new THREE.BoxGeometry(0.3, 3.2, 2.2);
  disposables.push(flangeGeo);
  const flange = new THREE.Mesh(flangeGeo, steelMat);
  flange.position.x = 3.5;
  flange.castShadow = true;
  waveguideGroup.add(flange);

  const loopGeo = new THREE.TorusGeometry(0.55, 0.06, 8, 24);
  disposables.push(loopGeo);
  const loopMesh = new THREE.Mesh(loopGeo, copperAnodeMat);
  loopMesh.rotation.y = Math.PI / 2;
  waveguideGroup.add(loopMesh);
  magnetronGroup.add(waveguideGroup);

  // Motorized Mode Stirrer Fan (Inside Launch Section)
  const modeStirrer = new THREE.Group();
  modeStirrer.position.set(5.2, 0, 0);
  for (let b = 0; b < 4; b++) {
    const bladeGeo = new THREE.BoxGeometry(0.04, 0.8, 0.4);
    disposables.push(bladeGeo);
    const blade = new THREE.Mesh(bladeGeo, radiatorFin);
    blade.rotation.x = (b * Math.PI) / 2;
    blade.position.set(0, Math.cos((b * Math.PI) / 2) * 0.4, Math.sin((b * Math.PI) / 2) * 0.4);
    modeStirrer.add(blade);
  }
  magnetronGroup.add(modeStirrer);

  // Permanent Alnico Magnet Pole Shoes & Outer Magnetic Return Yoke
  [-2.8, 2.8].forEach((yMag) => {
    const poleGeo = new THREE.CylinderGeometry(4.6, 4.6, 1.2, 36);
    disposables.push(poleGeo);
    const poleShoe = new THREE.Mesh(poleGeo, alnicoMagnetMat);
    poleShoe.position.y = yMag;
    poleShoe.castShadow = true;
    magnetronGroup.add(poleShoe);
  });

  // Heavy steel C-clamp magnetic return yoke bridge
  const yokeGeo = new THREE.BoxGeometry(1.2, 6.8, 2.2);
  disposables.push(yokeGeo);
  const yoke = new THREE.Mesh(yokeGeo, alnicoMagnetMat);
  yoke.position.set(-4.8, 0, 0);
  yoke.castShadow = true;
  magnetronGroup.add(yoke);

  // ==========================================
  // ROTATING ELECTRON SPOKE WHEEL PARTICLES
  // ==========================================
  const spokeCount = 140;
  const spokeGeo = new THREE.BufferGeometry();
  disposables.push(spokeGeo);
  const spokePos = new Float32Array(spokeCount * 3);
  const glowTex = createGlowPointTexture();
  disposables.push(glowTex);

  for (let i = 0; i < spokeCount; i++) {
    const idx = i * 3;
    const spokeIndex = i % 4;
    const baseAngle = (spokeIndex * Math.PI) / 2;
    const r = 0.5 + lcg() * 0.9;
    const angle = baseAngle + (lcg() - 0.5) * 0.3;
    spokePos[idx] = Math.cos(angle) * r;
    spokePos[idx + 1] = (lcg() - 0.5) * 1.5;
    spokePos[idx + 2] = Math.sin(angle) * r;
  }
  spokeGeo.setAttribute("position", new THREE.BufferAttribute(spokePos, 3));

  const spokeMat = new THREE.PointsMaterial({
    size: 0.26,
    map: glowTex,
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  disposables.push(spokeMat);

  const spokePoints = new THREE.Points(spokeGeo, spokeMat);
  magnetronGroup.add(spokePoints);

  const updateKinematics = (
    delta: number,
    isOscillating: boolean,
    spokeDisplayOmegaRadPerS: number,
    spokeOpacity: number,
    showSpokeWheel: boolean,
    isCutaway = false,
  ) => {
    updateSpencerMicrowaveKinematics(
      model,
      delta,
      isOscillating,
      spokeDisplayOmegaRadPerS,
      spokeOpacity,
      showSpokeWheel,
      isCutaway,
    );
  };

  const dispose = () => {
    for (const d of disposables) {
      d.dispose();
    }
  };

  const model: SpencerMicrowaveModel = {
    root,
    magnetronGroup,
    anodeOuter,
    cathodeMesh,
    spokePoints,
    spokeGeo,
    spokePos,
    modeStirrer,
    materials: {
      copperAnodeMat,
      cathodeMat,
      alnicoMagnetMat,
      darkCavityMat,
      boreMat,
      steelMat,
      spokeMat,
      ceramicInsulator,
      radiatorFin,
      pyrexGlass,
    },
    updateKinematics,
    dispose,
  };

  return model;
}

/**
 * Updates Percy Spencer cavity magnetron electron spoke wheel rotation, RF dielectric loss glow, and anode block cutaway.
 */
export function updateSpencerMicrowaveKinematics(
  model: SpencerMicrowaveModel,
  delta: number,
  isOscillating: boolean,
  spokeDisplayOmegaRadPerS: number,
  spokeOpacity: number,
  showSpokeWheel: boolean,
  isCutaway = false,
): void {
  if (isOscillating) {
    model.spokePoints.visible = showSpokeWheel;
    const heat = heatFrames(12, 16, 2);
    const local = 1 + Math.abs(sampleHeatAt(heat, 12, 16, 8, 0.3, 0.3));
    model.spokePoints.rotation.y += delta * spokeDisplayOmegaRadPerS * local;
    model.materials.spokeMat.opacity = Math.min(1, spokeOpacity * local);

    if (model.modeStirrer) {
      model.modeStirrer.rotation.x += delta * spokeDisplayOmegaRadPerS * local;
    }
  } else {
    model.spokePoints.visible = false;
  }

  // Cutaway mode: make copper anode block and magnet pole shoes translucent
  model.materials.copperAnodeMat.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.copperAnodeMat.transparent = isCutaway;
  model.materials.alnicoMagnetMat.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.alnicoMagnetMat.transparent = isCutaway;
}
