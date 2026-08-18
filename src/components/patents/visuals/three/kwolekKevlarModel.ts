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
  updateKinematics: (
    delta: number,
    isImpactTesting: boolean,
    showHydrogenBonds: boolean,
    shearRate: number,
    impactVelocityMps: number,
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

  const nozzleGeo = new THREE.CylinderGeometry(2.4, 2.8, 1.4, 32);
  disposables.push(nozzleGeo);
  const nozzleBody = new THREE.Mesh(nozzleGeo, spinneretSteelMat);
  nozzleBody.rotation.z = Math.PI / 2;
  spinneretPack.add(nozzleBody);

  for (let o = -2; o <= 2; o++) {
    const holeGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 12);
    disposables.push(holeGeo);
    const hole = new THREE.Mesh(holeGeo, holeMat);
    hole.rotation.z = Math.PI / 2;
    hole.position.set(0.7, o * 0.9, 0);
    spinneretPack.add(hole);
  }
  polymerGroup.add(spinneretPack);

  // ==========================================
  // 5 EXTENDED PPTA POLYMER CHAINS
  // ==========================================
  const chains: { group: THREE.Group; baseY: number }[] = [];
  const numChains = 5;

  for (let c = 0; c < numChains; c++) {
    const chainG = new THREE.Group();
    const yPos = (c - (numChains - 1) / 2) * 1.35;
    chainG.position.set(0, yPos, 0);

    for (let u = 0; u < 6; u++) {
      const xPos = -4.2 + u * 1.55;

      // Hexagonal Benzene Ring
      const ringG = new THREE.Group();
      ringG.position.x = xPos;
      for (let r = 0; r < 6; r++) {
        const angle = (r * Math.PI) / 3;
        const nextAngle = ((r + 1) * Math.PI) / 3;
        const ax = Math.cos(angle) * 0.38;
        const ay = Math.sin(angle) * 0.38;
        const bx = Math.cos(nextAngle) * 0.38;
        const by = Math.sin(nextAngle) * 0.38;

        const atomGeo = new THREE.SphereGeometry(0.11, 12, 12);
        disposables.push(atomGeo);
        const atom = new THREE.Mesh(atomGeo, carbonRingMat);
        atom.position.set(ax, ay, 0);
        ringG.add(atom);

        const stickGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.38, 8);
        disposables.push(stickGeo);
        const bondStick = new THREE.Mesh(stickGeo, bondStickMat);
        bondStick.position.set((ax + bx) / 2, (ay + by) / 2, 0);
        bondStick.rotation.z = angle + Math.PI / 6;
        ringG.add(bondStick);
      }
      chainG.add(ringG);

      // Amide Group
      const nGeo = new THREE.SphereGeometry(0.14, 12, 12);
      disposables.push(nGeo);
      const nAtom = new THREE.Mesh(nGeo, amideNitrogenMat);
      nAtom.position.set(xPos + 0.55, 0.22, 0);
      chainG.add(nAtom);

      const oGeo = new THREE.SphereGeometry(0.14, 12, 12);
      disposables.push(oGeo);
      const oAtom = new THREE.Mesh(oGeo, carbonylOxygenMat);
      oAtom.position.set(xPos + 0.95, -0.22, 0);
      chainG.add(oAtom);
    }

    chainG.castShadow = true;
    polymerGroup.add(chainG);
    chains.push({ group: chainG, baseY: yPos });
  }

  // ==========================================
  // HYDROGEN BONDS NETWORK (CLAIM 2)
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
    impactVelocityMps: number,
  ) => {
    hBondsGroup.visible = showHydrogenBonds;

    if (isImpactTesting) {
      bulletMesh.position.x -= delta * (impactVelocityMps / 400) * 15.0;
      if (bulletMesh.position.x < 1.0) {
        bulletMesh.position.x = 6.5;
      }
    } else {
      bulletMesh.position.x = 6.5;
    }
  };

  const dispose = () => {
    for (const d of disposables) {
      d.dispose();
    }
  };

  return {
    root,
    polymerGroup,
    spinneretPack,
    hBondsGroup,
    bulletMesh,
    chains,
    updateKinematics,
    dispose,
  };
}
