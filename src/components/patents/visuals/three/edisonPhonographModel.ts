/**
 * edisonPhonographModel.ts
 *
 * Museum-Grade Procedural 3D Model for Thomas Alva Edison's 1878 Tinfoil Phonograph (US Patent 200,521).
 * Features authentic Victorian mahogany baseboard, twin cast-iron arch stanchions, precision lead-screw,
 * heavy spoked flywheel, tinfoil-wrapped grooved brass cylinder mandrel, pivoting reproducer soundbox,
 * and flared acoustic brass horn.
 */

import * as THREE from "three";

export interface EdisonPhonographModel {
  rootGroup: THREE.Group;
  cylinderGroup: THREE.Group;
  soundBoxGroup: THREE.Group;
  stylus: THREE.Mesh;
  flywheel: THREE.Mesh;
  dispose: () => void;
}

export function buildEdisonPhonographModel(): EdisonPhonographModel {
  const rootGroup = new THREE.Group();
  const texturesToDispose: THREE.Texture[] = [];
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];

  // Procedural Mahogany Texture
  const woodCanvas = document.createElement("canvas");
  woodCanvas.width = 512;
  woodCanvas.height = 512;
  const wctx = woodCanvas.getContext("2d");
  if (wctx) {
    wctx.fillStyle = "#3b1708";
    wctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 240; i++) {
      wctx.fillStyle = i % 2 === 0 ? "rgba(80, 30, 10, 0.45)" : "rgba(25, 10, 5, 0.5)";
      wctx.fillRect(0, Math.random() * 512, 512, Math.random() * 3 + 1);
    }
  }
  const woodTexture = new THREE.CanvasTexture(woodCanvas);
  woodTexture.colorSpace = THREE.SRGBColorSpace;
  woodTexture.wrapS = THREE.RepeatWrapping;
  woodTexture.wrapT = THREE.RepeatWrapping;
  woodTexture.repeat.set(2, 4);
  texturesToDispose.push(woodTexture);

  // Materials
  const mahoganyMat = new THREE.MeshStandardMaterial({
    map: woodTexture,
    color: 0x4a1d0a,
    roughness: 0.45,
    metalness: 0.08,
  });
  materialsToDispose.push(mahoganyMat);

  const castIronMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.48,
    metalness: 0.85,
  });
  materialsToDispose.push(castIronMat);

  const polishedBrassMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.18,
    metalness: 0.92,
  });
  materialsToDispose.push(polishedBrassMat);

  const tinfoilMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.22,
    metalness: 0.94,
  });
  materialsToDispose.push(tinfoilMat);

  const steelMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.12,
    metalness: 0.96,
  });
  materialsToDispose.push(steelMat);

  // ==========================================
  // 1. Victorian Mahogany Baseboard Plinth
  // ==========================================
  const baseGroup = new THREE.Group();
  rootGroup.add(baseGroup);

  const basePlinth = new THREE.Mesh(new THREE.BoxGeometry(11.0, 0.7, 5.8), mahoganyMat);
  basePlinth.position.y = -1.8;
  basePlinth.receiveShadow = true;
  basePlinth.castShadow = true;
  baseGroup.add(basePlinth);

  // 4 Brass Leveling Feet
  [
    [-4.8, -2.2],
    [4.8, -2.2],
    [-4.8, 2.2],
    [4.8, 2.2],
  ].forEach(([fx, fz]) => {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 0.3, 16), polishedBrassMat);
    foot.position.set(fx, -2.2, fz);
    baseGroup.add(foot);
  });

  // Twin Cast-Iron Arch Bearing Stanchions
  [-3.6, 3.6].forEach((bx) => {
    const stanchion = new THREE.Mesh(new THREE.BoxGeometry(0.7, 2.4, 1.4), castIronMat);
    stanchion.position.set(bx, -0.4, 0);
    stanchion.castShadow = true;
    baseGroup.add(stanchion);

    // Bronze Bearing Cap with Oil Cup
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.4, 16), polishedBrassMat);
    cap.rotation.z = Math.PI / 2;
    cap.position.set(bx, 0.8, 0);
    baseGroup.add(cap);

    const oilCup = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.22, 12), polishedBrassMat);
    oilCup.position.set(bx, 1.1, 0);
    baseGroup.add(oilCup);
  });

  // ==========================================
  // 2. Grooved Brass Cylinder Mandrel & Lead-Screw (Claim 1 & 2)
  // ==========================================
  const cylinderGroup = new THREE.Group();
  cylinderGroup.position.set(0, 0.8, 0);
  rootGroup.add(cylinderGroup);

  // Continuous Steel Lead-Screw Shaft
  const leadScrew = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 10.2, 24), steelMat);
  leadScrew.rotation.z = Math.PI / 2;
  leadScrew.castShadow = true;
  cylinderGroup.add(leadScrew);

  // Heavy Brass Mandrel Wrapped in Tinfoil
  const mandrel = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.45, 4.8, 36), tinfoilMat);
  mandrel.rotation.z = Math.PI / 2;
  mandrel.position.x = -0.4;
  mandrel.castShadow = true;
  cylinderGroup.add(mandrel);

  // Spiral Helical Groove Scoring on Mandrel (Decorative Visual Indentations)
  for (let g = 0; g < 8; g++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.46, 0.015, 8, 36), polishedBrassMat);
    ring.rotation.y = Math.PI / 2;
    ring.position.x = -2.4 + g * 0.6;
    cylinderGroup.add(ring);
  }

  // Heavy Cast-Iron Flywheel (Left Side)
  const flywheel = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.18, 16, 36), castIronMat);
  flywheel.position.x = -4.5;
  flywheel.rotation.y = Math.PI / 2;
  flywheel.castShadow = true;
  cylinderGroup.add(flywheel);

  // 6 Flywheel Curved Spokes
  for (let s = 0; s < 6; s++) {
    const angle = (s * Math.PI) / 3;
    const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.07, 1.6, 8), castIronMat);
    spoke.position.set(-4.5, Math.cos(angle) * 0.85, Math.sin(angle) * 0.85);
    spoke.rotation.x = angle;
    cylinderGroup.add(spoke);
  }

  // Hand Crank (Right Side)
  const crankArm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.6, 0.35), castIronMat);
  crankArm.position.set(4.9, 0.6, 0);
  cylinderGroup.add(crankArm);

  const crankHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.6, 12), mahoganyMat);
  crankHandle.rotation.x = Math.PI / 2;
  crankHandle.position.set(4.9, 1.3, 0.4);
  cylinderGroup.add(crankHandle);

  // ==========================================
  // 3. Acoustic Sound-Box Diaphragm & Needle Stylus (Claim 3)
  // ==========================================
  const soundBoxGroup = new THREE.Group();
  soundBoxGroup.position.set(0, 1.6, 1.8);
  rootGroup.add(soundBoxGroup);

  // Pivot Arm Carriage
  const pivotArm = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 1.8), polishedBrassMat);
  pivotArm.position.set(0, -0.4, -0.8);
  soundBoxGroup.add(pivotArm);

  // Brass Circular Sound-Box Chamber
  const soundBox = new THREE.Mesh(
    new THREE.CylinderGeometry(0.75, 0.75, 0.4, 24),
    polishedBrassMat,
  );
  soundBox.rotation.x = Math.PI / 2;
  soundBox.castShadow = true;
  soundBoxGroup.add(soundBox);

  // Flexible Parchment/Mica Diaphragm Membrane
  const diaphragm = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.05, 24), steelMat);
  diaphragm.rotation.x = Math.PI / 2;
  soundBoxGroup.add(diaphragm);

  // Precision Indenting Needle Stylus
  const stylus = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.55, 12), steelMat);
  stylus.rotation.x = -Math.PI / 2;
  stylus.position.set(0, -0.55, -0.2);
  soundBoxGroup.add(stylus);

  // Flared Victorian Brass Acoustic Horn
  const horn = new THREE.Mesh(new THREE.ConeGeometry(1.8, 3.6, 24, 1, true), polishedBrassMat);
  horn.rotation.x = -Math.PI / 3.2;
  horn.position.set(0, 1.8, 2.0);
  horn.castShadow = true;
  soundBoxGroup.add(horn);

  const dispose = () => {
    for (const t of texturesToDispose) t.dispose();
    for (const m of materialsToDispose) m.dispose();
    for (const g of geometriesToDispose) g.dispose();
  };

  return {
    rootGroup,
    cylinderGroup,
    soundBoxGroup,
    stylus,
    flywheel,
    dispose,
  };
}
