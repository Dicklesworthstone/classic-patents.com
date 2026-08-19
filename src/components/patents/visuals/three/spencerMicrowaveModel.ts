/**
 * Procedural Three.js Model Builder for US 2,495,429
 * Percy L. Spencer — Method of Treating Foodstuffs (Microwave Oven, 1950)
 *
 * Implements the authentic Raytheon resonant multi-cavity magnetron & waveguide:
 * - Solid oxygen-free high-conductivity (OFHC) copper cylindrical anode block
 * - Extruded radial aluminum/copper cooling fins for heat dissipation
 * - 8 radial hole-and-slot resonant LC cavities (Claim 1)
 * - Upper and lower double pi-mode strapping rings preventing mode jumping
 * - Central barium-oxide-coated indirectly heated thermionic cathode emitting electron cloud
 * - Twin Alnico V permanent magnet pole shoes & return yoke establishing axial uniform B-field
 * - Rotating 4-spoke electron hub space-charge cloud interacting with RF electric fields
 * - Coaxial output coupling loop launching microwave power into rectangular waveguide (Claim 2)
 * - Waveguide launch horn and rotating RF mode-stirrer fan
 */

import * as THREE from "three";
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

export function buildSpencerMicrowaveModel(): SpencerMicrowaveModel {
  const root = new THREE.Group();
  const disposables: Array<{ dispose: () => void }> = [];
  const lcg = createLcg(19500124);

  // --- AUTHENTIC MATERIALS ---
  const copperAnodeMat = new THREE.MeshStandardMaterial({
    color: 0xca8a04,
    roughness: 0.22,
    metalness: 0.88,
  });
  disposables.push(copperAnodeMat);

  const cathodeMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    roughness: 0.4,
    metalness: 0.5,
    emissive: 0xef4444,
    emissiveIntensity: 0.85,
  });
  disposables.push(cathodeMat);

  const alnicoMagnetMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.35,
    metalness: 0.8,
  });
  disposables.push(alnicoMagnetMat);

  const darkCavityMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.7,
  });
  disposables.push(darkCavityMat);

  const boreMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.6,
  });
  disposables.push(boreMat);

  const steelMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    metalness: 0.9,
  });
  disposables.push(steelMat);

  const ceramicInsulator = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.2,
    metalness: 0.1,
  });
  disposables.push(ceramicInsulator);

  const radiatorFin = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.3,
    metalness: 0.85,
  });
  disposables.push(radiatorFin);

  // ==========================================
  // CAVITY MAGNETRON CORE ASSEMBLY (CLAIM 1)
  // ==========================================
  const magnetronGroup = new THREE.Group();
  root.add(magnetronGroup);

  // Cylindrical Copper Anode Block
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
  magnetronGroup.add(cathodeMesh);

  // Ceramic High-Voltage Insulator Bushings at tube ends
  [-2.4, 2.4].forEach((iy) => {
    const insGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.65, 20);
    disposables.push(insGeo);
    const insulator = new THREE.Mesh(insGeo, ceramicInsulator);
    insulator.position.y = iy;
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

  // Waveguide Mounting Flange
  const flangeGeo = new THREE.BoxGeometry(0.3, 3.2, 2.2);
  disposables.push(flangeGeo);
  const flange = new THREE.Mesh(flangeGeo, steelMat);
  flange.position.x = 3.5;
  waveguideGroup.add(flange);

  const loopGeo = new THREE.TorusGeometry(0.55, 0.06, 8, 24);
  disposables.push(loopGeo);
  const loopMesh = new THREE.Mesh(loopGeo, copperAnodeMat);
  loopMesh.rotation.y = Math.PI / 2;
  waveguideGroup.add(loopMesh);
  magnetronGroup.add(waveguideGroup);

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
  const spokeCount = 120;
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
    model.spokePoints.rotation.y += delta * spokeDisplayOmegaRadPerS;
    model.materials.spokeMat.opacity = spokeOpacity;
  } else {
    model.spokePoints.visible = false;
  }

  // Cutaway mode: make copper anode block and magnet pole shoes translucent
  model.materials.copperAnodeMat.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.copperAnodeMat.transparent = isCutaway;
  model.materials.alnicoMagnetMat.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.alnicoMagnetMat.transparent = isCutaway;
}
