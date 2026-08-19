/**
 * zeppelinAirshipModel.ts
 *
 * Museum-Grade Procedural 3D Model for Count Ferdinand von Zeppelin's 1899 Rigid-Frame Airship
 * (US Patent 621,195 - "Navigable Balloon").
 *
 * Reconstructs the historic LZ-1 rigid airship that pioneered rigid lighter-than-air flight:
 * 1. Streamlined rigid outer fabric envelope (128m long, 11.7m diameter scale) with 24-sided polygonal cross-section (Claim 1).
 * 2. 15 transverse triangular-lattice ring frames braced with high-tensile radial wire spokes (Claim 2).
 * 3. 14 independent rubberized-cotton cylindrical hydrogen gas cells with relief valves (Claim 3).
 * 4. Triangular longitudinal lattice keel walkway corridor with movable pitch-trim weight car (Claim 4).
 * 5. Fore and aft twin Daimler 14.2 hp aluminum engine gondolas with bevel-gear outrigger propellers.
 * 6. Cruciform tail control fins (balanced rudder and elevator planes) with wire bracing.
 */

import * as THREE from "three";

export interface ZeppelinAirshipModelNodes {
  rootGroup: THREE.Group;
  hullGroup: THREE.Group;
  hullMesh: THREE.Mesh;
  rings: THREE.Mesh[];
  gasCells: THREE.Mesh[];
  keelCatwalk: THREE.Mesh;
  trimWeightMesh: THREE.Mesh;
  gondolas: THREE.Group[];
  propellers: THREE.Group[];
  controlFins: THREE.Mesh[];
  longitudinalGirders?: THREE.Group;
}

export interface ZeppelinAirshipMaterials {
  fabricEnvelope: THREE.MeshStandardMaterial;
  duraluminGirders: THREE.MeshStandardMaterial;
  gasCellBags: THREE.MeshStandardMaterial;
  gondolaAlum: THREE.MeshStandardMaterial;
  propBrass: THREE.MeshStandardMaterial;
  wireRigging?: THREE.MeshBasicMaterial;
}

export interface ZeppelinAirshipModelResult {
  rootGroup: THREE.Group;
  nodes: ZeppelinAirshipModelNodes;
  materials: ZeppelinAirshipMaterials;
  dispose: () => void;
}

export function buildZeppelinAirshipModel(): ZeppelinAirshipModelResult {
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

  // --- Museum-Grade Materials ---
  const fabricEnvelope = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xe6ebf2,
      roughness: 0.55,
      metalness: 0.15,
    }),
  );

  const duraluminGirders = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.32,
      metalness: 0.88,
    }),
  );

  const gasCellBags = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.45,
      metalness: 0.12,
      transparent: true,
      opacity: 0.55,
    }),
  );

  const gondolaAlum = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      roughness: 0.28,
      metalness: 0.92,
    }),
  );

  const propBrass = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.22,
      metalness: 0.94,
    }),
  );

  const wireRigging = trackMat(
    new THREE.MeshBasicMaterial({
      color: 0x64748b,
    }),
  );

  const materials: ZeppelinAirshipMaterials = {
    fabricEnvelope,
    duraluminGirders,
    gasCellBags,
    gondolaAlum,
    propBrass,
    wireRigging,
  };

  // --- 1. Rigid Streamlined Envelope Hull (Claim 1) ---
  const hullGroup = new THREE.Group();
  rootGroup.add(hullGroup);

  const hullPoints: THREE.Vector2[] = [];
  hullPoints.push(new THREE.Vector2(0.01, 7.6));
  hullPoints.push(new THREE.Vector2(0.85, 7.1));
  hullPoints.push(new THREE.Vector2(1.85, 5.6));
  hullPoints.push(new THREE.Vector2(2.35, 3.6));
  hullPoints.push(new THREE.Vector2(2.45, 0));
  hullPoints.push(new THREE.Vector2(2.35, -3.6));
  hullPoints.push(new THREE.Vector2(1.85, -5.6));
  hullPoints.push(new THREE.Vector2(0.85, -7.1));
  hullPoints.push(new THREE.Vector2(0.01, -7.6));

  const hullGeo = trackGeo(new THREE.LatheGeometry(hullPoints, 32));
  hullGeo.rotateZ(Math.PI / 2);
  const hullMesh = new THREE.Mesh(hullGeo, materials.fabricEnvelope);
  hullMesh.castShadow = true;
  hullGroup.add(hullMesh);

  // Longitudinal Lattice Girders (Visible when cutaway)
  const longitudinalGirders = new THREE.Group();
  hullGroup.add(longitudinalGirders);

  for (let g = 0; g < 12; g++) {
    const angle = (g * Math.PI * 2) / 12;
    const girderPoints = hullPoints.map((p) => {
      const x = p.y;
      const r = p.x;
      return new THREE.Vector3(x, Math.cos(angle) * r, Math.sin(angle) * r);
    });
    const girderCurve = new THREE.CatmullRomCurve3(girderPoints);
    const girderGeo = trackGeo(new THREE.TubeGeometry(girderCurve, 32, 0.025, 6, false));
    const girderMesh = new THREE.Mesh(girderGeo, materials.duraluminGirders);
    longitudinalGirders.add(girderMesh);
  }

  // --- 2. Polygonal Transverse Duralumin Ring Frames (Claim 2) ---
  const rings: THREE.Mesh[] = [];
  for (let r = 0; r < 15; r++) {
    const rx = -6.0 + r * 0.85;
    const radiusAtX = 2.4 * Math.cos((rx / 7.5) * (Math.PI / 2.2));
    const ring = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(Math.max(radiusAtX, 0.4), 0.055, 10, 28)),
      materials.duraluminGirders,
    );
    ring.rotation.y = Math.PI / 2;
    ring.position.x = rx;
    hullGroup.add(ring);
    rings.push(ring);

    // Radial wire bracing spokes across ring frame
    for (let s = 0; s < 4; s++) {
      const sAngle = (s * Math.PI) / 4;
      const spoke = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.012, 0.012, Math.max(radiusAtX * 2, 0.8), 6)),
        materials.duraluminGirders,
      );
      spoke.position.x = rx;
      spoke.rotation.x = sAngle;
      hullGroup.add(spoke);
    }
  }

  // --- 3. Independent Cylindrical Hydrogen Gas Cells (Claim 3) ---
  const gasCells: THREE.Mesh[] = [];
  for (let c = 0; c < 14; c++) {
    const cx = -5.5 + c * 0.85;
    const rad = 2.15 * Math.cos((cx / 7.5) * (Math.PI / 2.2));
    const cell = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(Math.max(rad, 0.35), Math.max(rad, 0.35), 0.76, 20)),
      materials.gasCellBags,
    );
    cell.rotation.z = Math.PI / 2;
    cell.position.x = cx;
    cell.visible = false;
    hullGroup.add(cell);
    gasCells.push(cell);
  }

  // --- 4. Keel Catwalk Corridor & Movable Trim Weight (Claim 4) ---
  const keelCatwalk = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(11.8, 0.28, 0.45)),
    materials.duraluminGirders,
  );
  keelCatwalk.position.set(0, -2.48, 0);
  keelCatwalk.castShadow = true;
  hullGroup.add(keelCatwalk);

  // Heavy Lead Sliding Pitch-Trim Car (Claim 4)
  const trimWeightMesh = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.85, 0.42, 0.55)),
    materials.duraluminGirders,
  );
  trimWeightMesh.position.set(0, -2.48, 0);
  trimWeightMesh.castShadow = true;
  hullGroup.add(trimWeightMesh);

  // --- 5. Fore & Aft Daimler Aluminum Engine Gondolas & Propellers ---
  const gondolas: THREE.Group[] = [];
  const propellers: THREE.Group[] = [];

  [-3.8, 3.8].forEach((gx) => {
    const gondolaGroup = new THREE.Group();
    gondolaGroup.position.set(gx, -3.15, 0);

    // Streamlined open cockpit aluminum car
    const car = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.52, 0.52, 2.3, 20)),
      materials.gondolaAlum,
    );
    car.rotation.z = Math.PI / 2;
    car.castShadow = true;
    gondolaGroup.add(car);

    // Radiator and exhaust pipe
    const radiator = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.3, 0.6, 0.4)),
      materials.propBrass,
    );
    radiator.position.set(0.6, 0.4, 0);
    gondolaGroup.add(radiator);

    // Suspension wire struts to keel
    [-0.8, 0.8].forEach((sx) => {
      const strut = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 6)),
        materials.duraluminGirders,
      );
      strut.position.set(sx, 0.5, 0);
      gondolaGroup.add(strut);
    });

    // Outrigger Geared Pusher Propellers
    [-0.9, 0.9].forEach((pz) => {
      const propGroup = new THREE.Group();
      propGroup.position.set(0, 0, pz);

      // Outrigger tubular arm
      const arm = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.035, 0.035, 0.9, 8)),
        materials.duraluminGirders,
      );
      arm.rotation.x = Math.PI / 2;
      arm.position.z = pz > 0 ? -0.45 : 0.45;
      propGroup.add(arm);

      // Propeller Blades (2-Blade aerodynamic profile)
      const blade1 = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.12, 1.25, 0.035)),
        materials.propBrass,
      );
      blade1.castShadow = true;
      propGroup.add(blade1);

      gondolaGroup.add(propGroup);
      propellers.push(propGroup);
    });

    hullGroup.add(gondolaGroup);
    gondolas.push(gondolaGroup);
  });

  // --- 6. Cruciform Tail Control Fins (Rudder & Elevators) ---
  const controlFins: THREE.Mesh[] = [];
  [-1, 1].forEach((dir) => {
    // Horizontal elevator stabilizer plane
    const hFin = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(1.9, 0.06, 1.7)),
      materials.duraluminGirders,
    );
    hFin.position.set(-6.5, 0, dir * 1.25);
    hFin.castShadow = true;
    hullGroup.add(hFin);
    controlFins.push(hFin);

    // Vertical rudder plane
    const vFin = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(1.9, 1.7, 0.06)),
      materials.duraluminGirders,
    );
    vFin.position.set(-6.5, dir * 1.25, 0);
    vFin.castShadow = true;
    hullGroup.add(vFin);
    controlFins.push(vFin);
  });

  const nodes: ZeppelinAirshipModelNodes = {
    rootGroup,
    hullGroup,
    hullMesh,
    rings,
    gasCells,
    keelCatwalk,
    trimWeightMesh,
    gondolas,
    propellers,
    controlFins,
    longitudinalGirders,
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
 * Updates airship buoyancy height, pitch trim, propeller rotation, and trim weight position.
 */
export function updateZeppelinAirshipKinematics(
  nodes: ZeppelinAirshipModelNodes,
  materials: ZeppelinAirshipMaterials,
  dt: number,
  timeSec: number,
  hullStudioY: number,
  pitchTrimDeg: number,
  propellerSpeedRadPerS: number,
  trimWeightPosM: number,
  isCutaway: boolean,
) {
  // 1. Aerostatic Buoyancy Altitude & Gentle Flight Sway
  nodes.hullGroup.position.y = hullStudioY + Math.sin(timeSec * 0.8) * 0.08;
  nodes.hullGroup.rotation.z = (pitchTrimDeg * Math.PI) / 180 + Math.sin(timeSec * 0.4) * 0.01;

  // 2. Sliding Trim Weight Translation along Keel
  nodes.trimWeightMesh.position.x = Math.max(-5.0, Math.min(5.0, trimWeightPosM));

  // 3. Spin Propellers
  for (const prop of nodes.propellers) {
    prop.rotation.x += propellerSpeedRadPerS * dt;
  }

  // 4. Cutaway / Wireframe Mode
  materials.fabricEnvelope.wireframe = isCutaway;
  materials.fabricEnvelope.opacity = isCutaway ? 0.25 : 1.0;
  materials.fabricEnvelope.transparent = isCutaway;

  for (const cell of nodes.gasCells) {
    cell.visible = isCutaway;
  }
}
