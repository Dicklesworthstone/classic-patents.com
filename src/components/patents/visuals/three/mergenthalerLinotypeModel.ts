/**
 * mergenthalerLinotypeModel.ts
 *
 * Museum-Grade Procedural 3D Model for Ottmar Mergenthaler's 1885 Hot-Metal Linotype Machine
 * (US Patent 313,224).
 *
 * Reconstructs the revolutionary linecasting mechanism:
 * 1. Cast-iron frame with 90-key operator keyboard console.
 * 2. Inclined matrix magazine with brass escapement channels.
 * 3. Assembler front where brass character matrices and steel spaceband wedges form a line of type.
 * 4. Spaceband wedge justification mechanism expanding the line to column measure.
 * 5. Molten type-metal casting pot (eutectic lead-tin-antimony at 260°C) with pump plunger.
 * 6. Revolving four-slot mold disk casting the solid line of type (slug).
 * 7. Long distributor arm and V-notched distributor bar returning matrices to proper magazine channels.
 */

import * as THREE from "three";

export interface MergenthalerLinotypeModelNodes {
  rootGroup: THREE.Group;
  frameGroup: THREE.Group;
  keyboardGroup: THREE.Group;
  magazineGroup: THREE.Group;
  assemblerGroup: THREE.Group;
  matrices: THREE.Mesh[];
  spacebands: THREE.Mesh[];
  potGroup: THREE.Group;
  potBody: THREE.Mesh;
  potPlunger: THREE.Mesh;
  moldDiskGroup: THREE.Group;
  moldDisk: THREE.Mesh;
  slugMesh: THREE.Mesh;
  distributorArmGroup: THREE.Group;
  distributorBar: THREE.Mesh;
}

export interface MergenthalerLinotypeMaterials {
  castIron: THREE.MeshStandardMaterial;
  polishedSteel: THREE.MeshStandardMaterial;
  brassMatrix: THREE.MeshStandardMaterial;
  moltenAlloy: THREE.MeshStandardMaterial;
  solidSlug: THREE.MeshStandardMaterial;
  keyCaps: THREE.MeshStandardMaterial;
}

export interface MergenthalerLinotypeModelResult {
  rootGroup: THREE.Group;
  nodes: MergenthalerLinotypeModelNodes;
  materials: MergenthalerLinotypeMaterials;
  dispose: () => void;
}

export function buildMergenthalerLinotypeModel(): MergenthalerLinotypeModelResult {
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
  const materials: MergenthalerLinotypeMaterials = {
    castIron: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.5,
        metalness: 0.85,
      }),
    ),
    polishedSteel: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.15,
        metalness: 0.95,
      }),
    ),
    brassMatrix: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.25,
        metalness: 0.9,
      }),
    ),
    moltenAlloy: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.2,
        metalness: 0.95,
        emissive: 0xd97706,
        emissiveIntensity: 0.35,
      }),
    ),
    solidSlug: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.35,
        metalness: 0.8,
      }),
    ),
    keyCaps: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.4,
        metalness: 0.2,
      }),
    ),
  };

  // 1. Cast-Iron Machine Frame & Base
  const frameGroup = new THREE.Group();
  rootGroup.add(frameGroup);

  const basePlinth = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(4.2, 0.4, 4.2)),
    materials.castIron,
  );
  basePlinth.position.y = -2.2;
  basePlinth.receiveShadow = true;
  frameGroup.add(basePlinth);

  const mainColumn = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(1.4, 4.8, 1.8)),
    materials.castIron,
  );
  mainColumn.position.set(0, 0.2, 0);
  mainColumn.castShadow = true;
  frameGroup.add(mainColumn);

  // 2. Keyboard Console (90 Keys)
  const keyboardGroup = new THREE.Group();
  keyboardGroup.position.set(0, -0.6, 1.4);
  rootGroup.add(keyboardGroup);

  const keyBed = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.4, 0.3, 1.2)), materials.castIron);
  keyBed.rotation.x = Math.PI / 8;
  keyBed.castShadow = true;
  keyboardGroup.add(keyBed);

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 12; c++) {
      const keyMesh = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.045, 0.05, 0.08, 10)),
        materials.keyCaps,
      );
      keyMesh.position.set(-0.9 + c * 0.16, 0.15 - r * 0.06, -0.2 + r * 0.16);
      keyboardGroup.add(keyMesh);
    }
  }

  // 3. Inclined Brass Matrix Magazine
  const magazineGroup = new THREE.Group();
  magazineGroup.position.set(0, 2.6, -0.2);
  magazineGroup.rotation.x = Math.PI / 5;
  rootGroup.add(magazineGroup);

  const magBody = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.6, 3.2, 0.35)),
    materials.brassMatrix,
  );
  magBody.castShadow = true;
  magazineGroup.add(magBody);

  // Channel Escapement Grooves
  for (let ch = -1.1; ch <= 1.1; ch += 0.22) {
    const channel = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.06, 3.0, 0.08)),
      materials.polishedSteel,
    );
    channel.position.set(ch, 0, 0.18);
    magazineGroup.add(channel);
  }

  // 4. Assembler Front & Composing Line (Matrices + Spacebands)
  const assemblerGroup = new THREE.Group();
  assemblerGroup.position.set(0, 0.2, 0.95);
  rootGroup.add(assemblerGroup);

  const assemblerChute = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.2, 0.35, 0.3)),
    materials.castIron,
  );
  assemblerGroup.add(assemblerChute);

  // Brass Character Matrices
  const matrices: THREE.Mesh[] = [];
  for (let m = 0; m < 8; m++) {
    const matrix = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.12, 0.45, 0.22)),
      materials.brassMatrix,
    );
    matrix.position.set(-0.7 + m * 0.18, 0.15, 0);
    matrix.castShadow = true;
    assemblerGroup.add(matrix);
    matrices.push(matrix);
  }

  // Sliding Spaceband Wedges (Claim 2)
  const spacebands: THREE.Mesh[] = [];
  for (let s = 0; s < 3; s++) {
    const band = new THREE.Mesh(
      trackGeo(new THREE.ConeGeometry(0.08, 0.65, 3)),
      materials.polishedSteel,
    );
    band.position.set(-0.35 + s * 0.36, 0.12, 0);
    band.castShadow = true;
    assemblerGroup.add(band);
    spacebands.push(band);
  }

  // 5. Molten Type-Metal Casting Pot & Pump Plunger (Claim 3)
  const potGroup = new THREE.Group();
  potGroup.position.set(-1.6, -0.4, 0.3);
  rootGroup.add(potGroup);

  const potBody = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.65, 0.55, 1.2, 20)),
    materials.castIron,
  );
  potBody.castShadow = true;
  potGroup.add(potBody);

  const moltenPool = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.52, 0.52, 0.1, 16)),
    materials.moltenAlloy,
  );
  moltenPool.position.y = 0.52;
  potGroup.add(moltenPool);

  const potPlunger = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.12, 0.12, 1.6, 12)),
    materials.polishedSteel,
  );
  potPlunger.position.set(0, 0.9, 0);
  potGroup.add(potPlunger);

  // 6. Revolving Four-Slot Mold Disk & Cast Slug Ejector
  const moldDiskGroup = new THREE.Group();
  moldDiskGroup.position.set(-0.75, -0.3, 0.95);
  rootGroup.add(moldDiskGroup);

  const moldDisk = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.72, 0.72, 0.22, 28)),
    materials.castIron,
  );
  moldDisk.rotation.x = Math.PI / 2;
  moldDisk.castShadow = true;
  moldDiskGroup.add(moldDisk);

  // Solid Cast Line-of-Type (Slug)
  const slugMesh = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(1.6, 0.22, 0.12)),
    materials.solidSlug,
  );
  slugMesh.position.set(0.6, 0, 0.2);
  slugMesh.visible = false;
  moldDiskGroup.add(slugMesh);

  // 7. Overhead Distributor Arm & V-Notched Distributor Bar
  const distributorArmGroup = new THREE.Group();
  distributorArmGroup.position.set(1.4, 1.2, 0);
  rootGroup.add(distributorArmGroup);

  const distArm = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.08, 0.08, 3.6, 12)),
    materials.castIron,
  );
  distArm.position.set(0, 1.6, 0);
  distributorArmGroup.add(distArm);

  const distributorBar = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.8, 0.15, 0.25)),
    materials.polishedSteel,
  );
  distributorBar.position.set(-1.0, 3.4, -0.4);
  rootGroup.add(distributorBar);

  const nodes: MergenthalerLinotypeModelNodes = {
    rootGroup,
    frameGroup,
    keyboardGroup,
    magazineGroup,
    assemblerGroup,
    matrices,
    spacebands,
    potGroup,
    potBody,
    potPlunger,
    moldDiskGroup,
    moldDisk,
    slugMesh,
    distributorArmGroup,
    distributorBar,
  };

  const dispose = () => {
    for (const m of materialsToDispose) {
      m.dispose();
    }
    for (const g of geometriesToDispose) {
      g.dispose();
    }
  };

  return { rootGroup, nodes, materials, dispose };
}

/**
 * Updates Linotype spaceband expansion, plunger cycle, mold disk rotation, and slug ejection.
 */
export function updateMergenthalerLinotypeKinematics(
  nodes: MergenthalerLinotypeModelNodes,
  _materials: MergenthalerLinotypeMaterials,
  _dt: number,
  _timeSec: number,
  plungerY: number,
  moldAngle: number,
  slugOut: boolean,
  wedgeLift: number,
) {
  // 1. Plunger Stroke
  nodes.potPlunger.position.y = 0.9 + plungerY * 0.6;

  // 2. Mold Disk Rotation
  nodes.moldDiskGroup.rotation.z = moldAngle;

  // 3. Slug Ejection
  nodes.slugMesh.visible = slugOut;
  if (slugOut) {
    nodes.slugMesh.position.x = 0.6 + Math.sin(moldAngle) * 0.4;
  }

  // 4. Spaceband Justification Expansion

  for (const band of nodes.spacebands) {
    band.position.y = 0.12 + wedgeLift;
  }

  // 5. Distributor Arm Gentle Motion
  nodes.distributorArmGroup.rotation.z = Math.sin(moldAngle * 0.5) * 0.15;
}
