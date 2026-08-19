import * as THREE from "three";

export interface RenoEscalatorModelNodes {
  root: THREE.Group;
  // Truss & Balustrades
  trussGroup: THREE.Group;
  balustradesGroup: THREE.Group;
  solidPanelMesh: THREE.Mesh;
  cutawayPanelMesh: THREE.Mesh;
  // Cleated Deck & Steps
  cleatDeckGroup: THREE.Group;
  cleats: THREE.Mesh[];
  cleatBaseX: number[];
  // Comb Landing Plates
  topCombPlate: THREE.Group;
  bottomCombPlate: THREE.Group;
  // Synchronized Handrails & Sheaves
  leftHandrail: THREE.Mesh;
  rightHandrail: THREE.Mesh;
  headSheaves: THREE.Mesh[];
  tailSheaves: THREE.Mesh[];
  // Electric Motor Drive
  motorDriveGroup: THREE.Group;
}

export interface RenoEscalatorMaterials {
  structuralSteel: THREE.MeshStandardMaterial;
  oakHardwood: THREE.MeshStandardMaterial;
  brassComb: THREE.MeshStandardMaterial;
  rubberHandrail: THREE.MeshStandardMaterial;
  castIronGears: THREE.MeshStandardMaterial;
  glassBalustrade: THREE.MeshStandardMaterial;
}

export interface RenoEscalatorModelResult {
  root: THREE.Group;
  nodes: RenoEscalatorModelNodes;
  materials: RenoEscalatorMaterials;
  dispose: () => void;
}

const CLEAT_COUNT = 28;
const CLEAT_PITCH = 0.44;

export function buildRenoEscalatorModel(inclineAngleDeg = 25): RenoEscalatorModelResult {
  const root = new THREE.Group();
  const disposableGeometries: THREE.BufferGeometry[] = [];
  const disposableMaterials: THREE.Material[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    disposableGeometries.push(geo);
    return geo;
  };
  const trackMat = <T extends THREE.Material>(mat: T): T => {
    disposableMaterials.push(mat);
    return mat;
  };

  const inclineRad = (inclineAngleDeg * Math.PI) / 180;

  // Authentic 1890s Jesse Reno Materials
  const materials: RenoEscalatorMaterials = {
    structuralSteel: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.5,
        metalness: 0.8,
      }),
    ),
    oakHardwood: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xa16207,
        roughness: 0.6,
        metalness: 0.08,
      }),
    ),
    brassComb: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.2,
        metalness: 0.92,
      }),
    ),
    rubberHandrail: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x18181b,
        roughness: 0.75,
        metalness: 0.05,
      }),
    ),
    castIronGears: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.45,
        metalness: 0.85,
      }),
    ),
    glassBalustrade: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        transparent: true,
        opacity: 0.45,
        roughness: 0.1,
        metalness: 0.1,
      }),
    ),
  };

  // -------------------------------------------------------------
  // 1. Inclined Structural Steel Truss Framework
  // -------------------------------------------------------------
  const trussGroup = new THREE.Group();
  root.add(trussGroup);

  // Twin Inclined Box-Beam Stringers
  [-1.4, 1.4].forEach((sz) => {
    const stringer = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(11.2, 0.45, 0.22)),
      materials.structuralSteel,
    );
    stringer.position.set(0, 0, sz);
    stringer.rotation.z = inclineRad;
    stringer.castShadow = true;
    trussGroup.add(stringer);

    // Cross-truss diagonal bracing struts
    for (let b = -4; b <= 4; b += 2) {
      const strut = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.04, 0.04, 2.7, 8)),
        materials.structuralSteel,
      );
      const bx = b * Math.cos(inclineRad);
      const by = b * Math.sin(inclineRad) - 0.25;
      strut.position.set(bx, by, 0);
      strut.rotation.x = Math.PI / 2;
      trussGroup.add(strut);
    }
  });

  // Top and Bottom Floor Landing Pedestals
  const bottomLanding = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.4, 0.6, 3.4)),
    materials.structuralSteel,
  );
  bottomLanding.position.set(-5.0, -2.4, 0);
  bottomLanding.receiveShadow = true;
  trussGroup.add(bottomLanding);

  const topLanding = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.4, 0.6, 3.4)),
    materials.structuralSteel,
  );
  topLanding.position.set(5.0, 2.4, 0);
  topLanding.receiveShadow = true;
  trussGroup.add(topLanding);

  // -------------------------------------------------------------
  // 2. Balustrades (Solid Wooden Panels vs Transparent Glass)
  // -------------------------------------------------------------
  const balustradesGroup = new THREE.Group();
  balustradesGroup.rotation.z = inclineRad;
  root.add(balustradesGroup);

  // Solid Decorative Wood Side Panels
  const solidPanelMesh = new THREE.Group() as unknown as THREE.Mesh;
  [-1.4, 1.4].forEach((bz) => {
    const panel = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(10.8, 1.2, 0.06)),
      materials.oakHardwood,
    );
    panel.position.set(0, 0.8, bz);
    panel.castShadow = true;
    solidPanelMesh.add(panel);
  });
  solidPanelMesh.visible = false;
  balustradesGroup.add(solidPanelMesh);

  // Transparent / Cutaway Balustrade Panels
  const cutawayPanelMesh = new THREE.Group() as unknown as THREE.Mesh;
  [-1.4, 1.4].forEach((bz) => {
    const glass = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(10.8, 1.2, 0.04)),
      materials.glassBalustrade,
    );
    glass.position.set(0, 0.8, bz);
    cutawayPanelMesh.add(glass);
  });
  balustradesGroup.add(cutawayPanelMesh);

  // -------------------------------------------------------------
  // 3. Endless Conveyor of Longitudinal Hardwood Cleated Slats (US 470,918 / 596,257)
  // -------------------------------------------------------------
  const cleatDeckGroup = new THREE.Group();
  cleatDeckGroup.rotation.z = inclineRad;
  root.add(cleatDeckGroup);

  const cleats: THREE.Mesh[] = [];
  const cleatBaseX: number[] = [];

  for (let c = 0; c < CLEAT_COUNT; c++) {
    const cx = -6.0 + c * CLEAT_PITCH;
    const cleatGroup = new THREE.Group() as unknown as THREE.Mesh;
    cleatGroup.position.set(cx, 0.24, 0);

    // Main Oak Step Slat
    const slat = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.38, 0.12, 2.4)),
      materials.oakHardwood,
    );
    slat.castShadow = true;
    cleatGroup.add(slat);

    // Longitudinal Ridges / Grooves (Claim 1)
    for (let g = 0; g < 6; g++) {
      const gz = -1.0 + g * 0.4;
      const ridge = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.38, 0.04, 0.08)),
        materials.oakHardwood,
      );
      ridge.position.set(0, 0.07, gz);
      cleatGroup.add(ridge);
    }

    cleatDeckGroup.add(cleatGroup);
    cleats.push(cleatGroup);
    cleatBaseX.push(cx);
  }

  // -------------------------------------------------------------
  // 4. Intermeshing Bronze Comb Landing Plates (Claim 2)
  // -------------------------------------------------------------
  const buildCombPlate = (x: number, y: number, isTop: boolean): THREE.Group => {
    const combGroup = new THREE.Group();
    combGroup.position.set(x, y, 0);

    const basePlate = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.65, 0.08, 2.6)),
      materials.brassComb,
    );
    basePlate.castShadow = true;
    combGroup.add(basePlate);

    // 12 Pointed Triangular Comb Teeth extending between moving cleat ridges
    for (let t = 0; t < 12; t++) {
      const tz = -1.1 + t * 0.2;
      const tooth = new THREE.Mesh(
        trackGeo(new THREE.ConeGeometry(0.04, 0.35, 4)),
        materials.brassComb,
      );
      tooth.rotation.z = isTop ? -Math.PI / 2 : Math.PI / 2;
      tooth.position.set(isTop ? -0.4 : 0.4, 0.02, tz);
      combGroup.add(tooth);
    }

    return combGroup;
  };

  const topCombPlate = buildCombPlate(4.2, 2.1, true);
  root.add(topCombPlate);

  const bottomCombPlate = buildCombPlate(-4.2, -2.1, false);
  root.add(bottomCombPlate);

  // -------------------------------------------------------------
  // 5. Synchronized Moving Rubber Handrails & End Sheaves
  // -------------------------------------------------------------
  const leftHandrail = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(11.2, 0.14, 0.16)),
    materials.rubberHandrail,
  );
  leftHandrail.position.set(0, 1.45, 1.4);
  leftHandrail.rotation.z = inclineRad;
  root.add(leftHandrail);

  const rightHandrail = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(11.2, 0.14, 0.16)),
    materials.rubberHandrail,
  );
  rightHandrail.position.set(0, 1.45, -1.4);
  rightHandrail.rotation.z = inclineRad;
  root.add(rightHandrail);

  // Curved End Sheaves (Handrail Return Wheels)
  const headSheaves: THREE.Mesh[] = [];
  const tailSheaves: THREE.Mesh[] = [];

  [-1.4, 1.4].forEach((sz) => {
    const headSheave = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.45, 0.45, 0.15, 20)),
      materials.castIronGears,
    );
    headSheave.rotation.x = Math.PI / 2;
    headSheave.position.set(4.8, 2.2, sz);
    root.add(headSheave);
    headSheaves.push(headSheave);

    const tailSheave = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.45, 0.45, 0.15, 20)),
      materials.castIronGears,
    );
    tailSheave.rotation.x = Math.PI / 2;
    tailSheave.position.set(-4.8, -2.2, sz);
    root.add(tailSheave);
    tailSheaves.push(tailSheave);
  });

  // -------------------------------------------------------------
  // 6. Electric Drive Motor & Head Sprocket Machinery
  // -------------------------------------------------------------
  const motorDriveGroup = new THREE.Group();
  motorDriveGroup.position.set(5.2, 1.5, 0);
  root.add(motorDriveGroup);

  const motorCasing = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.42, 0.42, 0.9, 16)),
    materials.castIronGears,
  );
  motorCasing.rotation.z = Math.PI / 2;
  motorDriveGroup.add(motorCasing);

  const driveSprocket = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.55, 0.55, 0.25, 24)),
    materials.castIronGears,
  );
  driveSprocket.rotation.x = Math.PI / 2;
  driveSprocket.position.set(0, -0.4, 0);
  motorDriveGroup.add(driveSprocket);

  const nodes: RenoEscalatorModelNodes = {
    root,
    trussGroup,
    balustradesGroup,
    solidPanelMesh,
    cutawayPanelMesh,
    cleatDeckGroup,
    cleats,
    cleatBaseX,
    topCombPlate,
    bottomCombPlate,
    leftHandrail,
    rightHandrail,
    headSheaves,
    tailSheaves,
    motorDriveGroup,
  };

  const dispose = () => {
    for (const g of disposableGeometries) {
      g.dispose();
    }
    for (const m of disposableMaterials) {
      m.dispose();
    }
  };

  return { root, nodes, materials, dispose };
}

/**
 * Updates cleat loop progression, sheave rotation, and balustrade cutaway visibility.
 */
export function updateRenoEscalatorKinematics(
  nodes: RenoEscalatorModelNodes,
  _materials: RenoEscalatorMaterials,
  dt: number,
  cleatDisplacementM: number,
  sheaveOmegaRadPerS: number,
  cutawayMode: boolean,
) {
  // 1. Endless Cleat Conveyor Loop
  const spanLength = CLEAT_COUNT * CLEAT_PITCH;
  const minX = -6.0;
  const maxX = minX + spanLength;

  nodes.cleats.forEach((cleat, i) => {
    let x = nodes.cleatBaseX[i] + cleatDisplacementM;
    while (x > maxX) x -= spanLength;
    while (x < minX) x += spanLength;
    cleat.position.x = x;
  });

  // 2. Head & Tail Sheaves Rotation
  nodes.headSheaves.forEach((s) => {
    s.rotation.y -= sheaveOmegaRadPerS * dt;
  });
  nodes.tailSheaves.forEach((s) => {
    s.rotation.y -= sheaveOmegaRadPerS * dt;
  });

  // 3. Cutaway Balustrades Visibility
  nodes.solidPanelMesh.visible = !cutawayMode;
  nodes.cutawayPanelMesh.visible = cutawayMode;
}
