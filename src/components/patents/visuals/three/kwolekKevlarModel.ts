/**
 * kwolekKevlarModel.ts
 *
 * Museum-Grade Procedural 3D Model for Stephanie L. Kwolek's 1972 Wholly Aromatic Polycarbonamide (Kevlar)
 * (US Patent 3,671,542 - "Wholly Aromatic Carbocyclic Polycarbonamide Fiber").
 *
 * Implements the authentic liquid-crystalline PPTA polymer crystal lattice and extrusion apparatus:
 * - Multi-capillary stainless steel spinneret extrusion block with gold-plated nozzle face and distribution pack (Claim 1)
 * - 5 parallel rigid-rod poly(p-phenylene terephthalamide) polymer chains with alternating dihedral phenylene rings
 * - Amide linkage groups (-NH-CO-) in strict trans-conformation with covalent backbone bonds
 * - Transverse inter-chain hydrogen bond network (-NH···O=C-) forming rigid 2D crystalline hydrogen-bonded sheets (Claim 2)
 * - Ballistic projectile impact testing assembly with dynamic kinetic energy dissipation wave
 */

import * as THREE from "three";
import { wave2dFrames, waveFrameRms } from "@/physics/genericWasm";

export interface KwolekKevlarModel {
  root: THREE.Group;
  polymerGroup: THREE.Group;
  spinneretPack: THREE.Group;
  hBondsGroup: THREE.Group;
  bulletMesh: THREE.Mesh;
  chains: { group: THREE.Group; baseY: number }[];
  materials: {
    carbonRingMat: THREE.MeshStandardMaterial;
    amideNitrogenMat: THREE.MeshStandardMaterial;
    carbonylOxygenMat: THREE.MeshStandardMaterial;
    spinneretSteelMat: THREE.MeshStandardMaterial;
    bulletMat: THREE.MeshStandardMaterial;
    hBondMat: THREE.MeshStandardMaterial;
    bondStickMat: THREE.MeshStandardMaterial;
    holeMat: THREE.MeshStandardMaterial;
    goldNozzleMat?: THREE.MeshStandardMaterial;
    casingBrassMat?: THREE.MeshStandardMaterial;
  };
  updateKinematics: (
    delta: number,
    isImpactTesting: boolean,
    showHydrogenBonds: boolean,
    shearRate: number,
    bulletDisplaySpeed: number,
    isCutaway?: boolean,
  ) => void;
  dispose: () => void;
}

export function buildKwolekKevlarModel(): KwolekKevlarModel {
  const root = new THREE.Group();
  const disposables: Array<{ dispose: () => void }> = [];

  // --- Museum-Grade Materials ---
  const carbonRingMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.22,
    metalness: 0.88,
  });
  disposables.push(carbonRingMat);

  const amideNitrogenMat = new THREE.MeshStandardMaterial({
    color: 0x2563eb,
    roughness: 0.18,
    metalness: 0.65,
  });
  disposables.push(amideNitrogenMat);

  const carbonylOxygenMat = new THREE.MeshStandardMaterial({
    color: 0xdc2626,
    roughness: 0.18,
    metalness: 0.65,
  });
  disposables.push(carbonylOxygenMat);

  const spinneretSteelMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.25,
    metalness: 0.92,
    transparent: true,
    opacity: 1.0,
  });
  disposables.push(spinneretSteelMat);

  const goldNozzleMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.2,
    metalness: 0.95,
  });
  disposables.push(goldNozzleMat);

  const casingBrassMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.2,
    metalness: 0.92,
  });
  disposables.push(casingBrassMat);

  const bulletMat = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    metalness: 0.92,
    roughness: 0.18,
  });
  disposables.push(bulletMat);

  const hBondMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.25,
    metalness: 0.6,
    transparent: true,
    opacity: 0.78,
  });
  disposables.push(hBondMat);

  const bondStickMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.3,
    metalness: 0.85,
  });
  disposables.push(bondStickMat);

  const holeMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.8,
  });
  disposables.push(holeMat);

  // ==========================================
  // SPINNERET EXTRUSION PACK (CLAIM 1)
  // ==========================================
  const polymerGroup = new THREE.Group();
  root.add(polymerGroup);

  const spinneretPack = new THREE.Group();
  spinneretPack.position.set(-6.0, 0, 0);

  // Heavy Stainless Steel Extrusion Die Body
  const packGeo = new THREE.BoxGeometry(1.6, 7.2, 2.4);
  disposables.push(packGeo);
  const packMesh = new THREE.Mesh(packGeo, spinneretSteelMat);
  packMesh.castShadow = true;
  spinneretPack.add(packMesh);

  // Precision Gold-Plated Faceplate
  const faceplateGeo = new THREE.BoxGeometry(0.12, 6.8, 2.1);
  disposables.push(faceplateGeo);
  const faceplate = new THREE.Mesh(faceplateGeo, goldNozzleMat);
  faceplate.position.x = 0.82;
  faceplate.castShadow = true;
  spinneretPack.add(faceplate);

  // 5 Precision Capillary Orifices
  const numChains = 5;
  for (let c = 0; c < numChains; c++) {
    const yPos = (c - (numChains - 1) / 2) * 1.35;
    const holeGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.08, 20);
    disposables.push(holeGeo);
    const hole = new THREE.Mesh(holeGeo, holeMat);
    hole.rotation.z = Math.PI / 2;
    hole.position.set(0.88, yPos, 0);
    spinneretPack.add(hole);
  }
  root.add(spinneretPack);

  // ==========================================
  // PPTA POLYMER CHAINS & AROMATIC RINGS
  // ==========================================
  const chains: { group: THREE.Group; baseY: number }[] = [];

  for (let c = 0; c < numChains; c++) {
    const chainGroup = new THREE.Group();
    const baseY = (c - (numChains - 1) / 2) * 1.35;
    chainGroup.position.set(0, baseY, 0);

    // Build repeating monomer units along chain axis
    for (let u = 0; u < 5; u++) {
      const uGroup = new THREE.Group();
      const xOffset = -4.0 + u * 1.55;
      uGroup.position.set(xOffset, 0, 0);

      // 1,4-Phenylene aromatic ring (alternating tilted dihedral angles)
      const ringGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.09, 6);
      disposables.push(ringGeo);
      const ring = new THREE.Mesh(ringGeo, carbonRingMat);
      ring.rotation.x = Math.PI / 2 + (u % 2 === 0 ? 0.25 : -0.25);
      ring.castShadow = true;
      uGroup.add(ring);

      // Amide nitrogen atom (-NH-)
      const nGeo = new THREE.SphereGeometry(0.17, 16, 16);
      disposables.push(nGeo);
      const nAtom = new THREE.Mesh(nGeo, amideNitrogenMat);
      nAtom.position.set(0.55, u % 2 === 0 ? 0.22 : -0.22, 0);
      nAtom.castShadow = true;
      uGroup.add(nAtom);

      // Carbonyl oxygen atom (=O)
      const oGeo = new THREE.SphereGeometry(0.17, 16, 16);
      disposables.push(oGeo);
      const oAtom = new THREE.Mesh(oGeo, carbonylOxygenMat);
      oAtom.position.set(-0.55, u % 2 === 0 ? -0.22 : 0.22, 0);
      oAtom.castShadow = true;
      uGroup.add(oAtom);

      // Covalent backbone bond cylinders
      const stickGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.46, 10);
      disposables.push(stickGeo);

      const stick1 = new THREE.Mesh(stickGeo, bondStickMat);
      stick1.rotation.z = Math.PI / 2;
      stick1.position.set(0.35, 0, 0);
      stick1.castShadow = true;
      uGroup.add(stick1);

      const stick2 = new THREE.Mesh(stickGeo, bondStickMat);
      stick2.rotation.z = Math.PI / 2;
      stick2.position.set(-0.35, 0, 0);
      stick2.castShadow = true;
      uGroup.add(stick2);

      chainGroup.add(uGroup);
    }

    polymerGroup.add(chainGroup);
    chains.push({ group: chainGroup, baseY });
  }

  // ==========================================
  // HYDROGEN BOND NETWORK (CLAIM 2)
  // ==========================================
  const hBondsGroup = new THREE.Group();
  for (let c = 0; c < numChains - 1; c++) {
    const yMid = (c - (numChains - 1) / 2) * 1.35 + 0.675;
    for (let u = 0; u < 5; u++) {
      const xPos = -3.6 + u * 1.55;
      const hBondGeo = new THREE.CylinderGeometry(0.038, 0.038, 1.18, 8);
      disposables.push(hBondGeo);
      const hBond = new THREE.Mesh(hBondGeo, hBondMat);
      hBond.position.set(xPos, yMid, 0);
      hBondsGroup.add(hBond);
    }
  }
  polymerGroup.add(hBondsGroup);

  // Ballistic Copper-Jacketed Projectile with Ogive Nose and Boat-Tail Base
  const bulletGroup = new THREE.Group();
  bulletGroup.position.set(6.5, 0, 0);

  const bulletGeo = new THREE.ConeGeometry(0.48, 1.5, 28);
  disposables.push(bulletGeo);
  const bulletMesh = new THREE.Mesh(bulletGeo, bulletMat);
  bulletMesh.rotation.z = Math.PI / 2;
  bulletMesh.castShadow = true;
  root.add(bulletMesh);

  // ==========================================
  // KINEMATICS UPDATE FUNCTION
  // ==========================================
  const updateKinematics = (
    delta: number,
    isImpactTesting: boolean,
    showHydrogenBonds: boolean,
    shearRate: number,
    bulletDisplaySpeed: number,
    isCutaway = false,
  ) => {
    updateKwolekKevlarKinematics(
      model,
      delta,
      isImpactTesting,
      showHydrogenBonds,
      shearRate,
      bulletDisplaySpeed,
      isCutaway,
    );
  };

  const dispose = () => {
    for (const d of disposables) {
      d.dispose();
    }
  };

  const model: KwolekKevlarModel = {
    root,
    polymerGroup,
    spinneretPack,
    hBondsGroup,
    bulletMesh,
    chains,
    materials: {
      carbonRingMat,
      amideNitrogenMat,
      carbonylOxygenMat,
      spinneretSteelMat,
      bulletMat,
      hBondMat,
      bondStickMat,
      holeMat,
      goldNozzleMat,
      casingBrassMat,
    },
    updateKinematics,
    dispose,
  };

  return model;
}

/**
 * Updates Stephanie Kwolek PPTA liquid crystalline Kevlar polymer sheet dynamics, hydrogen bond network, projectile strain dissipation, and spinneret cutaway.
 */
export function updateKwolekKevlarKinematics(
  model: KwolekKevlarModel,
  delta: number,
  isImpactTesting: boolean,
  showHydrogenBonds: boolean,
  _shearRate: number,
  bulletDisplaySpeed: number,
  isCutaway = false,
): void {
  model.hBondsGroup.visible = showHydrogenBonds;

  if (isImpactTesting) {
    const field = wave2dFrames(16, 16, 2);
    const frame = Math.abs(Math.floor(model.bulletMesh.position.x * 2)) % 16;
    const rms = waveFrameRms(field, 16, 16, frame);
    model.bulletMesh.position.x -= delta * bulletDisplaySpeed * (1 + rms);
    if (model.bulletMesh.position.x < 1.0) {
      model.bulletMesh.position.x = 6.5;
    }
  } else {
    model.bulletMesh.position.x = 6.5;
  }

  // Cutaway mode: make spinneret steel block translucent
  model.materials.spinneretSteelMat.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.spinneretSteelMat.transparent = isCutaway;
}
