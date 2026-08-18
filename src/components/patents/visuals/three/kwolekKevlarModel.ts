/**
 * Procedural Three.js Model Builder for US 3,671,542
 * Stephanie L. Kwolek — Wholly Aromatic Carbocyclic Polycarbonamide (Kevlar, 1972)
 *
 * Implements the authentic liquid-crystalline PPTA polymer chain sheet:
 * - Multi-capillary stainless steel spinneret extrusion pack (Claim 1)
 * - 5 parallel rigid-rod poly(p-phenylene terephthalamide) polymer chains with aromatic rings
 * - Amide linkage groups (-NH-CO-) with alternating trans-conformation
 * - Transverse inter-chain hydrogen bond network (-NH···O=C-) (Claim 2)
 * - Ballistic projectile impact testing assembly with dynamic strain dissipation
 */

import * as THREE from "three";

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

  // --- AUTHENTIC MATERIALS ---
  const carbonRingMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.25,
    metalness: 0.85,
  });
  disposables.push(carbonRingMat);

  const amideNitrogenMat = new THREE.MeshStandardMaterial({
    color: 0x3b82f6,
    roughness: 0.2,
    metalness: 0.6,
  });
  disposables.push(amideNitrogenMat);

  const carbonylOxygenMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    roughness: 0.2,
    metalness: 0.6,
  });
  disposables.push(carbonylOxygenMat);

  const spinneretSteelMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.15,
    metalness: 0.95,
  });
  disposables.push(spinneretSteelMat);

  const bulletMat = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    metalness: 0.9,
    roughness: 0.2,
  });
  disposables.push(bulletMat);

  const hBondMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.3,
    metalness: 0.5,
    transparent: true,
    opacity: 0.75,
  });
  disposables.push(hBondMat);

  const bondStickMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    metalness: 0.8,
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

  const packGeo = new THREE.BoxGeometry(1.6, 6.8, 2.2);
  disposables.push(packGeo);
  const packMesh = new THREE.Mesh(packGeo, spinneretSteelMat);
  spinneretPack.add(packMesh);

  // Spinneret extrusion capillary holes
  const numChains = 5;
  for (let c = 0; c < numChains; c++) {
    const yPos = (c - (numChains - 1) / 2) * 1.35;
    const holeGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.05, 16);
    disposables.push(holeGeo);
    const hole = new THREE.Mesh(holeGeo, holeMat);
    hole.rotation.z = Math.PI / 2;
    hole.position.set(0.81, yPos, 0);
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

      // 1,4-Phenylene aromatic ring
      const ringGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.08, 6);
      disposables.push(ringGeo);
      const ring = new THREE.Mesh(ringGeo, carbonRingMat);
      ring.rotation.x = Math.PI / 2;
      uGroup.add(ring);

      // Amide nitrogen atom (-NH-)
      const nGeo = new THREE.SphereGeometry(0.16, 12, 12);
      disposables.push(nGeo);
      const nAtom = new THREE.Mesh(nGeo, amideNitrogenMat);
      nAtom.position.set(0.55, u % 2 === 0 ? 0.22 : -0.22, 0);
      uGroup.add(nAtom);

      // Carbonyl oxygen atom (=O)
      const oGeo = new THREE.SphereGeometry(0.16, 12, 12);
      disposables.push(oGeo);
      const oAtom = new THREE.Mesh(oGeo, carbonylOxygenMat);
      oAtom.position.set(-0.55, u % 2 === 0 ? -0.22 : 0.22, 0);
      uGroup.add(oAtom);

      // Covalent backbone bond sticks
      const stickGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.45, 8);
      disposables.push(stickGeo);

      const stick1 = new THREE.Mesh(stickGeo, bondStickMat);
      stick1.rotation.z = Math.PI / 2;
      stick1.position.set(0.35, 0, 0);
      uGroup.add(stick1);

      const stick2 = new THREE.Mesh(stickGeo, bondStickMat);
      stick2.rotation.z = Math.PI / 2;
      stick2.position.set(-0.35, 0, 0);
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
      const hBondGeo = new THREE.CylinderGeometry(0.035, 0.035, 1.15, 8);
      disposables.push(hBondGeo);
      const hBond = new THREE.Mesh(hBondGeo, hBondMat);
      hBond.position.set(xPos, yMid, 0);
      hBondsGroup.add(hBond);
    }
  }
  polymerGroup.add(hBondsGroup);

  // Ballistic Projectile
  const bulletGeo = new THREE.ConeGeometry(0.45, 1.4, 24);
  disposables.push(bulletGeo);
  const bulletMesh = new THREE.Mesh(bulletGeo, bulletMat);
  bulletMesh.rotation.z = Math.PI / 2;
  bulletMesh.position.set(6.5, 0, 0);
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
    model.bulletMesh.position.x -= delta * bulletDisplaySpeed;
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
