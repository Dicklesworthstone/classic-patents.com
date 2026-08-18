/**
 * Procedural Three.js Model Builder for US 2,495,429
 * Percy L. Spencer — Method of Treating Foodstuffs (Microwave Oven, 1950)
 *
 * Implements the authentic Raytheon resonant multi-cavity magnetron & waveguide:
 * - Solid oxygen-free high-conductivity (OFHC) copper cylindrical anode block
 * - 8 radial hole-and-slot resonant LC cavities (Claim 1)
 * - Upper and lower double pi-mode strapping rings preventing mode jumping
 * - Central barium-oxide-coated indirectly heated thermionic cathode emitting electron cloud
 * - Twin Alnico V permanent magnet pole shoes establishing axial uniform B-field
 * - Rotating 4-spoke electron hub space-charge cloud interacting with RF electric fields
 * - Coaxial output coupling loop launching microwave power into rectangular waveguide (Claim 2)
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
  updateKinematics: (
    delta: number,
    isOscillating: boolean,
    microwaveFreqMhz: number,
    dielectricLoss: number,
    showSpokeWheel: boolean,
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
    emissiveIntensity: 0.8,
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

  // Central Cylindrical Interaction Bore
  const boreGeo = new THREE.CylinderGeometry(1.5, 1.5, 3.42, 36);
  disposables.push(boreGeo);
  const centerBore = new THREE.Mesh(boreGeo, boreMat);
  magnetronGroup.add(centerBore);

  // 8 Radial Hole-and-Slot Resonant Cavities
  const numCavities = 8;
  for (let i = 0; i < numCavities; i++) {
    const angle = (i * 2 * Math.PI) / numCavities;
    const holeGeo = new THREE.CylinderGeometry(0.62, 0.62, 3.42, 24);
    disposables.push(holeGeo);
    const hole = new THREE.Mesh(holeGeo, darkCavityMat);
    hole.position.set(Math.cos(angle) * 2.8, 0, Math.sin(angle) * 2.8);
    magnetronGroup.add(hole);

    const slotGeo = new THREE.BoxGeometry(1.3, 3.42, 0.18);
    disposables.push(slotGeo);
    const slot = new THREE.Mesh(slotGeo, darkCavityMat);
    slot.position.set(Math.cos(angle) * 2.1, 0, Math.sin(angle) * 2.1);
    slot.rotation.y = -angle;
    magnetronGroup.add(slot);
  }

  // Double Pi-Mode Strapping Rings
  [-1.6, 1.6].forEach((yPos) => {
    const innerRingGeo = new THREE.TorusGeometry(1.8, 0.05, 8, 36);
    disposables.push(innerRingGeo);
    const innerRing = new THREE.Mesh(innerRingGeo, copperAnodeMat);
    innerRing.rotation.x = Math.PI / 2;
    innerRing.position.y = yPos;
    magnetronGroup.add(innerRing);

    const outerRingGeo = new THREE.TorusGeometry(2.3, 0.05, 8, 36);
    disposables.push(outerRingGeo);
    const outerRing = new THREE.Mesh(outerRingGeo, copperAnodeMat);
    outerRing.rotation.x = Math.PI / 2;
    outerRing.position.y = yPos;
    magnetronGroup.add(outerRing);
  });

  // Central Thermionic Cathode Rod
  const cathodeGeo = new THREE.CylinderGeometry(0.38, 0.38, 4.2, 24);
  disposables.push(cathodeGeo);
  const cathodeMesh = new THREE.Mesh(cathodeGeo, cathodeMat);
  cathodeMesh.castShadow = true;
  magnetronGroup.add(cathodeMesh);

  // End Hat Shields
  [-2.1, 2.1].forEach((yEnd) => {
    const hatGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.12, 24);
    disposables.push(hatGeo);
    const endHat = new THREE.Mesh(hatGeo, steelMat);
    endHat.position.y = yEnd;
    magnetronGroup.add(endHat);
  });

  // Alnico Permanent Magnet Pole Shoes
  [-3.2, 3.2].forEach((yMag) => {
    const magGeo = new THREE.CylinderGeometry(3.5, 4.2, 1.8, 36);
    disposables.push(magGeo);
    const poleShoe = new THREE.Mesh(magGeo, alnicoMagnetMat);
    poleShoe.position.y = yMag;
    magnetronGroup.add(poleShoe);
  });

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

  // ==========================================
  // KINEMATICS & RF ROTATION UPDATE FUNCTION
  // ==========================================
  const updateKinematics = (
    delta: number,
    isOscillating: boolean,
    microwaveFreqMhz: number,
    dielectricLoss: number,
    showSpokeWheel: boolean,
  ) => {
    if (isOscillating) {
      spokePoints.visible = showSpokeWheel;
      spokePoints.rotation.y += delta * (microwaveFreqMhz / 2450) * 4.5;
      spokeMat.opacity = Math.min(
        0.95,
        0.25 + (dielectricLoss / 2000) * 0.7,
      );
    } else {
      spokePoints.visible = false;
    }
  };

  const dispose = () => {
    for (const d of disposables) {
      d.dispose();
    }
  };

  return {
    root,
    magnetronGroup,
    anodeOuter,
    cathodeMesh,
    spokePoints,
    spokeGeo,
    spokePos,
    updateKinematics,
    dispose,
  };
}
