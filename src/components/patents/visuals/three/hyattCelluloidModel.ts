/**
 * hyattCelluloidModel.ts
 *
 * Museum-Grade Procedural 3D Model for John Wesley Hyatt's 1870 Camphor-Pyroxyline Celluloid Press
 * (US Patent 105,338 - "Improvement in Treating and Molding Pyroxyline").
 *
 * Reconstructs the apparatus that gave birth to modern plastics:
 * 1. Cast-iron press bedplate and 4 polished steel tie-rod tension columns.
 * 2. Annular steam jacket with brass steam pipes for thermal plasticization (Claim 1).
 * 3. Hydraulic plunger ram with polished chrome piston (Claim 2).
 * 4. Precision brass extrusion nozzle die and translucent extruded amber celluloid rod.
 * 5. Finished molded billiard ball specimens in ivory-white and amber.
 */

import * as THREE from "three";

export interface HyattCelluloidModelNodes {
  rootGroup: THREE.Group;
  bedplate: THREE.Mesh;
  tieRods: THREE.Mesh[];
  barrelGroup: THREE.Group;
  jacket: THREE.Mesh;
  steamPipes: THREE.Mesh[];
  ramGroup: THREE.Group;
  hydCyl: THREE.Mesh;
  ramPiston: THREE.Mesh;
  nozzleGroup: THREE.Group;
  nozzleCone: THREE.Mesh;
  rodMesh: THREE.Mesh;
  billiardBalls: THREE.Mesh[];
}

export interface HyattCelluloidMaterials {
  castIron: THREE.MeshStandardMaterial;
  polishedSteel: THREE.MeshStandardMaterial;
  brassPipes: THREE.MeshStandardMaterial;
  celluloidAmber: THREE.MeshStandardMaterial;
  billiardBallWhite: THREE.MeshStandardMaterial;
  billiardBallAmber: THREE.MeshStandardMaterial;
}

export interface HyattCelluloidModelResult {
  rootGroup: THREE.Group;
  nodes: HyattCelluloidModelNodes;
  materials: HyattCelluloidMaterials;
  dispose: () => void;
}

export function buildHyattCelluloidModel(): HyattCelluloidModelResult {
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
  const materials: HyattCelluloidMaterials = {
    castIron: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.5,
        metalness: 0.85,
      }),
    ),
    polishedSteel: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.12,
        metalness: 0.95,
      }),
    ),
    brassPipes: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.22,
        metalness: 0.9,
      }),
    ),
    celluloidAmber: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: 0.88,
      }),
    ),
    billiardBallWhite: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xfffbeb,
        roughness: 0.15,
        metalness: 0.05,
      }),
    ),
    billiardBallAmber: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.15,
        metalness: 0.05,
      }),
    ),
  };

  // 1. Heavy Cast-Iron Press Bed & Tie-Rod Columns
  const bedplate = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(11.5, 0.9, 5.5)),
    materials.castIron,
  );
  bedplate.position.y = -2.2;
  bedplate.receiveShadow = true;
  bedplate.castShadow = true;
  rootGroup.add(bedplate);

  const tieRods: THREE.Mesh[] = [];
  [
    [-1.4, -1.8],
    [1.4, -1.8],
    [-1.4, 1.8],
    [1.4, 1.8],
  ].forEach(([ty, tz]) => {
    const rod = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.16, 0.16, 9.5, 16)),
      materials.polishedSteel,
    );
    rod.rotation.z = Math.PI / 2;
    rod.position.set(0, ty, tz);
    rod.castShadow = true;
    rootGroup.add(rod);
    tieRods.push(rod);
  });

  // 2. Steam-Jacketed Heated Barrel (Claim 1)
  const barrelGroup = new THREE.Group();
  rootGroup.add(barrelGroup);

  const jacket = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(1.6, 1.6, 4.5, 32)),
    materials.castIron,
  );
  jacket.rotation.z = Math.PI / 2;
  jacket.castShadow = true;
  barrelGroup.add(jacket);

  const steamPipes: THREE.Mesh[] = [];
  [-1.2, 1.2].forEach((sx) => {
    const pipe = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.15, 0.15, 1.2, 12)),
      materials.brassPipes,
    );
    pipe.position.set(sx, 1.8, 0);
    pipe.castShadow = true;
    barrelGroup.add(pipe);
    steamPipes.push(pipe);
  });

  // 3. Hydraulic Plunger Ram (Claim 2)
  const ramGroup = new THREE.Group();
  ramGroup.position.set(-3.8, 0, 0);
  rootGroup.add(ramGroup);

  const hydCyl = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(1.4, 1.4, 3.2, 24)),
    materials.castIron,
  );
  hydCyl.rotation.z = Math.PI / 2;
  hydCyl.castShadow = true;
  ramGroup.add(hydCyl);

  const ramPiston = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.7, 0.7, 4.2, 24)),
    materials.polishedSteel,
  );
  ramPiston.rotation.z = Math.PI / 2;
  ramPiston.position.x = 1.8;
  ramPiston.castShadow = true;
  ramGroup.add(ramPiston);

  // 4. Precision Extrusion Nozzle Die & Extruded Celluloid Rod
  const nozzleGroup = new THREE.Group();
  nozzleGroup.position.set(2.4, 0, 0);
  rootGroup.add(nozzleGroup);

  const nozzleCone = new THREE.Mesh(
    trackGeo(new THREE.ConeGeometry(1.2, 1.2, 24)),
    materials.brassPipes,
  );
  nozzleCone.rotation.z = -Math.PI / 2;
  nozzleCone.castShadow = true;
  nozzleGroup.add(nozzleCone);

  const rodMesh = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.35, 0.35, 3.8, 24)),
    materials.celluloidAmber,
  );
  rodMesh.rotation.z = Math.PI / 2;
  rodMesh.position.x = 2.4;
  rodMesh.castShadow = true;
  nozzleGroup.add(rodMesh);

  // 5. Molded Billiard Ball Samples
  const billiardBalls: THREE.Mesh[] = [];
  [-0.8, 0.8].forEach((bz, idx) => {
    const ball = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.45, 24, 24)),
      idx === 0 ? materials.billiardBallWhite : materials.billiardBallAmber,
    );
    ball.position.set(4.2, -1.6, bz);
    ball.castShadow = true;
    rootGroup.add(ball);
    billiardBalls.push(ball);
  });

  const nodes: HyattCelluloidModelNodes = {
    rootGroup,
    bedplate,
    tieRods,
    barrelGroup,
    jacket,
    steamPipes,
    ramGroup,
    hydCyl,
    ramPiston,
    nozzleGroup,
    nozzleCone,
    rodMesh,
    billiardBalls,
  };

  const dispose = () => {
    for (const m of materialsToDispose) m.dispose();
    for (const g of geometriesToDispose) g.dispose();
  };

  return { rootGroup, nodes, materials, dispose };
}

/**
 * Updates hydraulic ram stroke, polymer melt flow, and cutaway mode.
 */
export function updateHyattCelluloidKinematics(
  nodes: HyattCelluloidModelNodes,
  materials: HyattCelluloidMaterials,
  _dt: number,
  timeSec: number,
  processTempC: number,
  viscosityPaS: number,
  isMelted: boolean,
  ramHz: number,
  ramStroke: number,
  isCutaway: boolean,
) {
  nodes.ramPiston.position.x = 1.8 + Math.sin(timeSec * ramHz * Math.PI * 2) * ramStroke;

  const flow = isMelted ? Math.min(1.4, 1800 / Math.max(80, viscosityPaS)) : 0.08;
  nodes.rodMesh.visible = isMelted;
  nodes.rodMesh.scale.x = flow;
  materials.celluloidAmber.opacity = isMelted ? 0.88 : 0.22;
  materials.celluloidAmber.color.setHex(processTempC >= 90 ? 0xf59e0b : 0xb45309);

  // Cutaway Mode
  materials.castIron.opacity = isCutaway ? 0.35 : 1.0;
  materials.castIron.transparent = isCutaway;
}
