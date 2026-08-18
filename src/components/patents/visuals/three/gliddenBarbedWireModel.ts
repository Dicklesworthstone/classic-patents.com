/**
 * gliddenBarbedWireModel.ts
 *
 * Museum-Grade Procedural 3D Model for Joseph F. Glidden's 1874 Twisted Wire Barbed Fence
 * (US Patent 157,124 - "Improvement in Wire-Fences").
 *
 * Reconstructs the apparatus and claimed mechanism:
 * 1. Double-strand twisted galvanized wire core (Claim 1).
 * 2. Transverse diamond-point spur barbs coiled onto one strand and locked firmly by the second strand (Claim 2).
 * 3. Dual feed spools delivering smooth wire.
 * 4. Rotating twister flyer arbor mechanism.
 * 5. Take-up reel drum collecting completed fencing.
 */

import * as THREE from "three";

export interface GliddenBarbedWireModelNodes {
  rootGroup: THREE.Group;
  bench: THREE.Mesh;
  feedSpools: THREE.Mesh[];
  flyerGroup: THREE.Group;
  wireAssemblyGroup: THREE.Group;
  strand1Mesh: THREE.Mesh;
  strand2Mesh: THREE.Mesh;
  barbGroups: THREE.Group[];
  reelGroup: THREE.Group;
}

export interface GliddenBarbedWireMaterials {
  castIron: THREE.MeshStandardMaterial;
  galvanizedSteel: THREE.MeshStandardMaterial;
  walnutWood: THREE.MeshStandardMaterial;
}

export interface GliddenBarbedWireModelResult {
  rootGroup: THREE.Group;
  nodes: GliddenBarbedWireModelNodes;
  materials: GliddenBarbedWireMaterials;
  dispose: () => void;
}

export function buildGliddenBarbedWireModel(): GliddenBarbedWireModelResult {
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
  const materials: GliddenBarbedWireMaterials = {
    castIron: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.5,
        metalness: 0.85,
      }),
    ),
    galvanizedSteel: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.2,
        metalness: 0.95,
      }),
    ),
    walnutWood: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x5c2c16,
        roughness: 0.6,
        metalness: 0.05,
      }),
    ),
  };

  // 1. Heavy Wooden Workshop Bench & Cast Iron Bed
  const bench = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(11.0, 0.8, 5.5)),
    materials.walnutWood,
  );
  bench.position.y = -2.2;
  bench.receiveShadow = true;
  bench.castShadow = true;
  rootGroup.add(bench);

  // 2. Dual Feed Spools (Raw Wire Inflow)
  const feedSpools: THREE.Mesh[] = [];
  [-3.8, -3.8].forEach((sx, idx) => {
    const spool = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.9, 0.9, 0.6, 24)),
      materials.castIron,
    );
    spool.rotation.z = Math.PI / 2;
    spool.position.set(sx, idx === 0 ? 0.8 : -0.8, -1.2);
    spool.castShadow = true;
    rootGroup.add(spool);
    feedSpools.push(spool);
  });

  // 3. Rotating Twister Flyer Arbor (Claim 1)
  const flyerGroup = new THREE.Group();
  flyerGroup.position.set(-1.8, 0, 0);
  rootGroup.add(flyerGroup);

  const flyerRing = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(1.4, 0.12, 12, 32)),
    materials.castIron,
  );
  flyerRing.rotation.y = Math.PI / 2;
  flyerRing.castShadow = true;
  flyerGroup.add(flyerRing);

  // 4. Barbed Wire Twisting Helical Model (Claim 1 & Claim 2)
  const wireAssemblyGroup = new THREE.Group();
  rootGroup.add(wireAssemblyGroup);

  const strand1Curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.2, 0.1, 0),
    new THREE.Vector3(-1.0, 0.15, 0.1),
    new THREE.Vector3(1.0, 0.1, -0.1),
    new THREE.Vector3(3.2, 0.1, 0),
  ]);
  const strand1Geo = trackGeo(new THREE.TubeGeometry(strand1Curve, 40, 0.04, 8, false));
  const strand1Mesh = new THREE.Mesh(strand1Geo, materials.galvanizedSteel);
  strand1Mesh.castShadow = true;
  wireAssemblyGroup.add(strand1Mesh);

  const strand2Curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.2, -0.1, 0),
    new THREE.Vector3(-1.0, -0.15, -0.1),
    new THREE.Vector3(1.0, -0.1, 0.1),
    new THREE.Vector3(3.2, -0.1, 0),
  ]);
  const strand2Geo = trackGeo(new THREE.TubeGeometry(strand2Curve, 40, 0.04, 8, false));
  const strand2Mesh = new THREE.Mesh(strand2Geo, materials.galvanizedSteel);
  strand2Mesh.castShadow = true;
  wireAssemblyGroup.add(strand2Mesh);

  // 5 Discrete 2-Point Diamond Barbs Coiled Around Strand 1 (Claim 2)
  const barbCount = 5;
  const barbGroups: THREE.Group[] = [];
  for (let b = 0; b < barbCount; b++) {
    const bx = -2.2 + b * 1.1;
    const barbGroup = new THREE.Group();
    barbGroup.position.set(bx, 0, 0);

    const coil = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.12, 0.035, 8, 16)),
      materials.galvanizedSteel,
    );
    barbGroup.add(coil);

    [-1, 1].forEach((dir) => {
      const spur = new THREE.Mesh(
        trackGeo(new THREE.ConeGeometry(0.05, 0.35, 4)),
        materials.galvanizedSteel,
      );
      spur.position.set(0, dir * 0.22, dir * 0.15);
      spur.rotation.x = (dir * Math.PI) / 4;
      spur.castShadow = true;
      barbGroup.add(spur);
    });

    wireAssemblyGroup.add(barbGroup);
    barbGroups.push(barbGroup);
  }

  // 5. Take-Up Reel Drum (Winding Finished Wire)
  const reelGroup = new THREE.Group();
  reelGroup.position.set(3.5, 0, 0);
  rootGroup.add(reelGroup);

  const reelHub = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.6, 0.6, 1.4, 24)),
    materials.walnutWood,
  );
  reelHub.rotation.z = Math.PI / 2;
  reelHub.castShadow = true;
  reelGroup.add(reelHub);

  [-0.7, 0.7].forEach((rx) => {
    const flange = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(1.6, 1.6, 0.12, 24)),
      materials.castIron,
    );
    flange.rotation.z = Math.PI / 2;
    flange.position.x = rx;
    flange.castShadow = true;
    reelGroup.add(flange);
  });

  const nodes: GliddenBarbedWireModelNodes = {
    rootGroup,
    bench,
    feedSpools,
    flyerGroup,
    wireAssemblyGroup,
    strand1Mesh,
    strand2Mesh,
    barbGroups,
    reelGroup,
  };

  const dispose = () => {
    for (const m of materialsToDispose) m.dispose();
    for (const g of geometriesToDispose) g.dispose();
  };

  return { rootGroup, nodes, materials, dispose };
}

/**
 * Updates twister flyer rotation, strand helix motion, and cutaway mode.
 */
export function updateGliddenBarbedWireKinematics(
  nodes: GliddenBarbedWireModelNodes,
  materials: GliddenBarbedWireMaterials,
  dt: number,
  _timeSec: number,
  flyerOmegaRadPerS: number,
  reelOmegaRadPerS: number,
  isLocked: boolean,
  isCutaway: boolean,
) {
  nodes.flyerGroup.rotation.x += flyerOmegaRadPerS * dt;
  nodes.reelGroup.rotation.x += reelOmegaRadPerS * dt;

  materials.galvanizedSteel.color.setHex(isLocked ? 0xe2e8f0 : 0xf87171);

  // Cutaway Mode
  materials.castIron.opacity = isCutaway ? 0.35 : 1.0;
  materials.castIron.transparent = isCutaway;
  materials.walnutWood.opacity = isCutaway ? 0.45 : 1.0;
  materials.walnutWood.transparent = isCutaway;
}
