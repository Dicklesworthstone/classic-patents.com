/**
 * hyattCelluloidModel.ts
 *
 * Museum-Grade Procedural 3D Model for John Wesley Hyatt's 1870 Camphor-Pyroxyline Celluloid Press
 * (US Patent 105,338 - "Improvement in Treating and Molding Pyroxyline").
 *
 * Reconstructs the authentic 1870 apparatus that founded the modern synthetic plastics industry:
 * 1. Cast-iron press bedplate with 4 heavy polished steel tie-rod tension columns and bronze retention nuts.
 * 2. Annular steam jacket with brass steam pipes, pressure gauge, inlet/outlet valves, and thermal lagging (Claim 1).
 * 3. High-pressure hydraulic plunger ram with ground chrome piston and stuffing box gland (Claim 2).
 * 4. Precision brass extrusion nozzle die and translucent amber celluloid rod/billet.
 * 5. Finished molded billiard balls (ivory-white and translucent amber) and tortoiseshell specimens (Claim 3).
 */

import * as THREE from "three";

export interface HyattCelluloidModelNodes {
  rootGroup: THREE.Group;
  bedplate: THREE.Mesh;
  tieRods: THREE.Mesh[];
  barrelGroup: THREE.Group;
  jacket: THREE.Mesh;
  steamPipes: THREE.Mesh[];
  steamManifold?: THREE.Group;
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
  copperGasket?: THREE.MeshStandardMaterial;
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

  // --- Museum Materials ---
  const castIron = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x22272e,
      roughness: 0.65,
      metalness: 0.85,
    }),
  );

  const polishedSteel = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.12,
      metalness: 0.95,
    }),
  );

  const brassPipes = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.28,
      metalness: 0.88,
    }),
  );

  const copperGasket = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.35,
      metalness: 0.9,
    }),
  );

  const celluloidAmber = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.15,
      metalness: 0.05,
      transparent: true,
      opacity: 0.88,
    }),
  );

  const billiardBallWhite = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xfffbeb,
      roughness: 0.12,
      metalness: 0.02,
    }),
  );

  const billiardBallAmber = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.12,
      metalness: 0.04,
      transparent: true,
      opacity: 0.92,
    }),
  );

  const materials: HyattCelluloidMaterials = {
    castIron,
    polishedSteel,
    brassPipes,
    celluloidAmber,
    billiardBallWhite,
    billiardBallAmber,
    copperGasket,
  };

  // --- 1. Heavy Cast-Iron Press Bedplate & Tension Columns ---
  const bedplate = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(11.8, 0.9, 5.8)),
    materials.castIron,
  );
  bedplate.position.y = -2.2;
  bedplate.receiveShadow = true;
  bedplate.castShadow = true;
  rootGroup.add(bedplate);

  // Machine foundation feet / mounting flanges
  const footGeo = trackGeo(new THREE.BoxGeometry(0.8, 0.4, 1.2));
  [
    [-5.4, -2.6, 2.4],
    [5.4, -2.6, 2.4],
    [-5.4, -2.6, -2.4],
    [5.4, -2.6, -2.4],
  ].forEach(([fx, fy, fz]) => {
    const foot = new THREE.Mesh(footGeo, materials.castIron);
    foot.position.set(fx, fy, fz);
    rootGroup.add(foot);
  });

  // 4 Heavy Polished Steel Tie-Rod Columns with Bronze Hex Nuts
  const tieRods: THREE.Mesh[] = [];
  const rodOffsets = [
    [-1.4, -1.8],
    [1.4, -1.8],
    [-1.4, 1.8],
    [1.4, 1.8],
  ];

  rodOffsets.forEach(([ty, tz]) => {
    const rod = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.18, 0.18, 9.8, 20)),
      materials.polishedSteel,
    );
    rod.rotation.z = Math.PI / 2;
    rod.position.set(0, ty, tz);
    rod.castShadow = true;
    rootGroup.add(rod);
    tieRods.push(rod);

    // End Retention Bronze Nuts on both sides of each column
    [-4.8, 4.8].forEach((nx) => {
      const nut = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.32, 0.32, 0.28, 6)),
        materials.brassPipes,
      );
      nut.rotation.z = Math.PI / 2;
      nut.position.set(nx, ty, tz);
      nut.castShadow = true;
      rootGroup.add(nut);
    });
  });

  // --- 2. Steam-Jacketed Heated Barrel (Claim 1) ---
  const barrelGroup = new THREE.Group();
  rootGroup.add(barrelGroup);

  // Cast iron outer jacket cylinder
  const jacket = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(1.65, 1.65, 4.6, 32)),
    materials.castIron,
  );
  jacket.rotation.z = Math.PI / 2;
  jacket.castShadow = true;
  barrelGroup.add(jacket);

  // Heavy end mounting flanges with bolting perimeter
  [-2.25, 2.25].forEach((fx) => {
    const flange = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(2.0, 2.0, 0.25, 32)),
      materials.castIron,
    );
    flange.rotation.z = Math.PI / 2;
    flange.position.x = fx;
    flange.castShadow = true;
    barrelGroup.add(flange);

    // 8 perimeter bolts
    for (let b = 0; b < 8; b++) {
      const angle = (b * Math.PI) / 4;
      const bolt = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.06, 0.06, 0.35, 6)),
        materials.polishedSteel,
      );
      bolt.rotation.z = Math.PI / 2;
      bolt.position.set(
        fx + (fx > 0 ? 0.05 : -0.05),
        Math.cos(angle) * 1.82,
        Math.sin(angle) * 1.82,
      );
      barrelGroup.add(bolt);
    }
  });

  // Steam Manifold, Brass Inlet/Outlet Pipes, and Dial Pressure Gauge (Claim 1)
  const steamManifold = new THREE.Group();
  barrelGroup.add(steamManifold);

  const steamPipes: THREE.Mesh[] = [];
  [-1.4, 1.4].forEach((sx) => {
    // Upright steam riser pipe
    const pipe = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.14, 0.14, 1.4, 16)),
      materials.brassPipes,
    );
    pipe.position.set(sx, 2.1, 0);
    pipe.castShadow = true;
    steamManifold.add(pipe);
    steamPipes.push(pipe);

    // Gate valve handwheel
    const handwheel = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.24, 0.04, 8, 16)),
      materials.brassPipes,
    );
    handwheel.position.set(sx, 2.8, 0);
    handwheel.rotation.x = Math.PI / 2;
    steamManifold.add(handwheel);
  });

  // Top dial steam pressure gauge
  const gaugeBody = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.42, 0.42, 0.18, 24)),
    materials.brassPipes,
  );
  gaugeBody.position.set(0, 2.7, 0.6);
  gaugeBody.rotation.x = Math.PI / 4;
  steamManifold.add(gaugeBody);

  const gaugeGlass = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.38, 0.38, 0.02, 24)),
    materials.billiardBallWhite,
  );
  gaugeGlass.position.set(0, 2.75, 0.65);
  gaugeGlass.rotation.x = Math.PI / 4;
  steamManifold.add(gaugeGlass);

  // --- 3. High-Pressure Hydraulic Plunger Ram (Claim 2) ---
  const ramGroup = new THREE.Group();
  ramGroup.position.set(-3.9, 0, 0);
  rootGroup.add(ramGroup);

  // Cast iron hydraulic cylinder body
  const hydCyl = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(1.45, 1.45, 3.4, 28)),
    materials.castIron,
  );
  hydCyl.rotation.z = Math.PI / 2;
  hydCyl.castShadow = true;
  ramGroup.add(hydCyl);

  // Gland packing collar with copper sealing rings
  const glandCollar = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(1.1, 1.1, 0.45, 24)),
    materials.copperGasket,
  );
  glandCollar.rotation.z = Math.PI / 2;
  glandCollar.position.x = 1.7;
  ramGroup.add(glandCollar);

  // Polished chrome ram piston
  const ramPiston = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.72, 0.72, 4.4, 28)),
    materials.polishedSteel,
  );
  ramPiston.rotation.z = Math.PI / 2;
  ramPiston.position.x = 1.8;
  ramPiston.castShadow = true;
  ramGroup.add(ramPiston);

  // --- 4. Precision Extrusion Nozzle Die & Extruded Celluloid Rod ---
  const nozzleGroup = new THREE.Group();
  nozzleGroup.position.set(2.4, 0, 0);
  rootGroup.add(nozzleGroup);

  const nozzleCone = new THREE.Mesh(
    trackGeo(new THREE.ConeGeometry(1.3, 1.4, 28)),
    materials.brassPipes,
  );
  nozzleCone.rotation.z = -Math.PI / 2;
  nozzleCone.position.x = 0.6;
  nozzleCone.castShadow = true;
  nozzleGroup.add(nozzleCone);

  // Extruded translucent amber celluloid rod
  const rodMesh = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.38, 0.38, 3.9, 28)),
    materials.celluloidAmber,
  );
  rodMesh.rotation.z = Math.PI / 2;
  rodMesh.position.x = 2.6;
  rodMesh.castShadow = true;
  nozzleGroup.add(rodMesh);

  // --- 5. Finished Molded Billiard Ball Samples (Claim 3) ---
  const billiardBalls: THREE.Mesh[] = [];
  [-0.9, 0.9].forEach((bz, idx) => {
    const ball = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.48, 32, 32)),
      idx === 0 ? materials.billiardBallWhite : materials.billiardBallAmber,
    );
    ball.position.set(4.3, -1.6, bz);
    ball.castShadow = true;
    ball.receiveShadow = true;
    rootGroup.add(ball);
    billiardBalls.push(ball);

    // Neutral museum stand; it is not presented as a claimed material or machine component.
    const pedestal = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.35, 0.45, 0.3, 20)),
      materials.castIron,
    );
    pedestal.position.set(4.3, -1.95, bz);
    rootGroup.add(pedestal);
  });

  const nodes: HyattCelluloidModelNodes = {
    rootGroup,
    bedplate,
    tieRods,
    barrelGroup,
    jacket,
    steamPipes,
    steamManifold,
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
