/**
 * sholesTypewriterModel.ts
 *
 * Museum-Grade Procedural 3D Model for Christopher Latham Sholes's 1868 Type-Writer
 * (US Patent 79,265 - "Improvement in Type-Writing Machines").
 *
 * Reconstructs the first practical commercial typewriter mechanism:
 * 1. Wooden table frame with turned legs, rear upright column, and top deck plate.
 * 2. Circular type basket with radial upward-striking type-bars actuated by key levers (Claim 1).
 * 3. Moving platen carriage with cylindrical platen and paper roll (Claim 2).
 * 4. Escapement ratchet wheel and pawl mechanism advancing the carriage step-by-step (Claim 3).
 * 5. Keyboard bank of ivory/brass key buttons with linkage fingers w.
 */

import * as THREE from "three";

export interface SholesTypewriterModelNodes {
  rootGroup: THREE.Group;
  table: THREE.Mesh;
  legs: THREE.Mesh[];
  rearColumn: THREE.Mesh;
  topDeck: THREE.Mesh;
  basketGroup: THREE.Group;
  basketRing: THREE.Mesh;
  typeBars: THREE.Mesh[];
  activeHammer: THREE.Mesh;
  carriageGroup: THREE.Group;
  platen: THREE.Mesh;
  paper: THREE.Mesh;
  escapement: THREE.Mesh;
  keyboardGroup: THREE.Group;
  keys: THREE.Mesh[];
  restBarRot: Array<{ x: number; z: number }>;
}

export interface SholesTypewriterMaterials {
  caseMat: THREE.MeshStandardMaterial;
  polishedSteel: THREE.MeshStandardMaterial;
  brass: THREE.MeshStandardMaterial;
  hardSmoothPlaten: THREE.MeshStandardMaterial;
  paperMat: THREE.MeshStandardMaterial;
}

export interface SholesTypewriterModelResult {
  rootGroup: THREE.Group;
  nodes: SholesTypewriterModelNodes;
  materials: SholesTypewriterMaterials;
  dispose: () => void;
}

export function buildSholesTypewriterModel(): SholesTypewriterModelResult {
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    geometriesToDispose.push(geo);
    return geo;
  };
  const trackMat = <T extends THREE.Material>(mat: T): T => {
    materialsToDispose.push(mat);
    return mat;
  };

  // Materials
  const materials: SholesTypewriterMaterials = {
    caseMat: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x4a3728,
        roughness: 0.58,
        metalness: 0.3,
      }),
    ),
    polishedSteel: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.1,
        metalness: 0.95,
      }),
    ),
    brass: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.22,
        metalness: 0.9,
      }),
    ),
    hardSmoothPlaten: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x475569,
        roughness: 0.42,
        metalness: 0.6,
      }),
    ),
    paperMat: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.9,
      }),
    ),
  };

  // 1. Table, turned legs, rear upright column, and top deck plate
  const table = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(7.6, 0.28, 5.4)), materials.caseMat);
  table.position.y = -1.55;
  table.castShadow = true;
  table.receiveShadow = true;
  rootGroup.add(table);

  const legs: THREE.Mesh[] = [];
  [
    [-3.2, -2.2],
    [3.2, -2.2],
    [-3.2, 2.0],
    [3.2, 2.0],
  ].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.16, 0.22, 2.4, 12)),
      materials.caseMat,
    );
    leg.position.set(lx, -2.9, lz);
    leg.castShadow = true;
    rootGroup.add(leg);
    legs.push(leg);
  });

  const rearColumn = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(1.4, 2.6, 1.1)),
    materials.caseMat,
  );
  rearColumn.position.set(0, -0.15, -2.1);
  rearColumn.castShadow = true;
  rootGroup.add(rearColumn);

  const topDeck = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(5.4, 0.18, 1.6)),
    materials.caseMat,
  );
  topDeck.position.set(0, 1.15, -1.4);
  topDeck.castShadow = true;
  rootGroup.add(topDeck);

  // 2. Type basket (Claim 1)
  const basketGroup = new THREE.Group();
  basketGroup.position.set(0, 0.4, 0);
  rootGroup.add(basketGroup);

  const basketRing = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(1.6, 0.12, 12, 32)),
    materials.brass,
  );
  basketRing.rotation.x = Math.PI / 2;
  basketRing.castShadow = true;
  basketGroup.add(basketRing);

  const typeBars: THREE.Mesh[] = [];
  const barGeo = trackGeo(new THREE.CylinderGeometry(0.025, 0.025, 1.4, 8));
  for (let t = 0; t < 12; t++) {
    const tAngle = (t * Math.PI * 2) / 12;
    const bar = new THREE.Mesh(barGeo, materials.polishedSteel);
    bar.position.set(Math.cos(tAngle) * 0.8, -0.4, Math.sin(tAngle) * 0.8);
    bar.rotation.z = Math.sin(tAngle) * 0.45;
    bar.rotation.x = Math.cos(tAngle) * 0.45;
    bar.castShadow = true;
    basketGroup.add(bar);
    typeBars.push(bar);
  }

  const activeHammer = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.04, 0.04, 1.6, 8)),
    materials.polishedSteel,
  );
  activeHammer.position.set(0, -0.2, 0.6);
  activeHammer.castShadow = true;
  basketGroup.add(activeHammer);

  // 3. Platen carriage & ratchet escapement (Claims 2 and 3)
  const carriageGroup = new THREE.Group();
  carriageGroup.position.set(0, 1.8, -0.2);
  rootGroup.add(carriageGroup);

  const platen = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.5, 0.5, 5.2, 24)),
    materials.hardSmoothPlaten,
  );
  platen.rotation.z = Math.PI / 2;
  platen.castShadow = true;
  carriageGroup.add(platen);

  const paper = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.52, 0.52, 4.4, 24, 1, true, 0, Math.PI * 1.5)),
    materials.paperMat,
  );
  paper.rotation.z = Math.PI / 2;
  paper.castShadow = true;
  carriageGroup.add(paper);

  const escapement = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.6, 0.6, 0.1, 16)),
    materials.brass,
  );
  escapement.rotation.z = Math.PI / 2;
  escapement.position.x = 2.8;
  escapement.castShadow = true;
  carriageGroup.add(escapement);

  // 4. Keyboard
  const keyboardGroup = new THREE.Group();
  keyboardGroup.position.set(0, -0.4, 2.2);
  rootGroup.add(keyboardGroup);

  const keys: THREE.Mesh[] = [];
  const keyGeo = trackGeo(new THREE.CylinderGeometry(0.12, 0.12, 0.18, 16));
  for (let keyIndex = 0; keyIndex < 12; keyIndex++) {
    const key = new THREE.Mesh(keyGeo, materials.brass);
    key.position.set(-2.2 + keyIndex * 0.4, 0, 0);
    key.castShadow = true;
    keyboardGroup.add(key);
    keys.push(key);
  }

  const restBarRot: Array<{ x: number; z: number }> = typeBars.map((b) => ({
    x: b.rotation.x,
    z: b.rotation.z,
  }));

  const nodes: SholesTypewriterModelNodes = {
    rootGroup,
    table,
    legs,
    rearColumn,
    topDeck,
    basketGroup,
    basketRing,
    typeBars,
    activeHammer,
    carriageGroup,
    platen,
    paper,
    escapement,
    keyboardGroup,
    keys,
    restBarRot,
  };

  const dispose = () => {
    for (const m of materialsToDispose) m.dispose();
    for (const g of geometriesToDispose) g.dispose();
  };

  return { rootGroup, nodes, materials, dispose };
}

/**
 * Updates typewriter key strike, typebar articulation, carriage escapement, and cutaway mode.
 */
export function updateSholesTypewriterKinematics(
  nodes: SholesTypewriterModelNodes,
  materials: SholesTypewriterMaterials,
  ratchetReleasePct: number,
  displayTypebarIndex: number,
  isCutaway: boolean,
) {
  nodes.activeHammer.rotation.x = -ratchetReleasePct * 0.5;

  nodes.typeBars.forEach((bar, i) => {
    const rest = nodes.restBarRot[i];
    const striking = i === displayTypebarIndex && ratchetReleasePct > 0;
    bar.rotation.x = rest.x + (striking ? -ratchetReleasePct * 0.28 : 0);
    bar.rotation.z = rest.z + (striking ? (i % 2 === 0 ? 0.08 : -0.08) * ratchetReleasePct : 0);
  });

  nodes.keys.forEach((key, kIndex) => {
    const keyActive = kIndex === displayTypebarIndex && ratchetReleasePct > 0;
    key.position.y = keyActive ? -0.14 : 0;
  });

  nodes.escapement.rotation.x += ratchetReleasePct * 0.04;
  nodes.carriageGroup.position.x = -((displayTypebarIndex % 8) * 0.12);

  // Cutaway Mode
  materials.caseMat.opacity = isCutaway ? 0.35 : 1.0;
  materials.caseMat.transparent = isCutaway;
}
