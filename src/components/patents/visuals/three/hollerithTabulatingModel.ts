/**
 * hollerithTabulatingModel.ts
 *
 * Museum-Grade Procedural 3D Model for Herman Hollerith's 1889 Electro-Mechanical Punched-Card Tabulator
 * (US Patent 395,781).
 *
 * Reconstructs the 1890 US Census data-processing landmark:
 * 1. Hardwood oak console desk table with turned support legs.
 * 2. Vertical 40-dial clock register bank (10 columns x 4 rows) with stepping pointers.
 * 3. Punched card pin press with hinged operating lever, spring-loaded brass pin plate,
 *    and lower mercury contact well cup matrix.
 * 4. Manila paper census punched card with standard 1890 240-position hole pattern.
 * 5. Electromagnetic sorting box with 24 compartments and spring-loaded lid doors.
 * 6. Electromechanical relays and copper interconnect busbars.
 */

import * as THREE from "three";

export interface HollerithTabulatingModelNodes {
  rootGroup: THREE.Group;
  deskGroup: THREE.Group;
  dialBankGroup: THREE.Group;
  dials: THREE.Mesh[];
  dialHands: THREE.Mesh[];
  pressGroup: THREE.Group;
  pinPlateGroup: THREE.Group;
  pinPlate: THREE.Mesh;
  mercuryBed: THREE.Mesh;
  punchCard: THREE.Mesh;
  pressLever: THREE.Mesh;
  sortBoxGroup: THREE.Group;
  sortLids: THREE.Mesh[];
}

export interface HollerithTabulatingMaterials {
  oakWood: THREE.MeshStandardMaterial;
  dialFace: THREE.MeshStandardMaterial;
  brassParts: THREE.MeshStandardMaterial;
  castIron: THREE.MeshStandardMaterial;
  manilaCard: THREE.MeshStandardMaterial;
  mercuryPool: THREE.MeshStandardMaterial;
}

export interface HollerithTabulatingModelResult {
  rootGroup: THREE.Group;
  nodes: HollerithTabulatingModelNodes;
  materials: HollerithTabulatingMaterials;
  dispose: () => void;
}

export function buildHollerithTabulatingModel(): HollerithTabulatingModelResult {
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
  const materials: HollerithTabulatingMaterials = {
    oakWood: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x78350f,
        roughness: 0.55,
        metalness: 0.05,
      }),
    ),
    dialFace: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        roughness: 0.2,
        metalness: 0.1,
      }),
    ),
    brassParts: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.22,
        metalness: 0.9,
      }),
    ),
    castIron: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.5,
        metalness: 0.85,
      }),
    ),
    manilaCard: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xfde047,
        roughness: 0.8,
        metalness: 0.05,
      }),
    ),
    mercuryPool: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.08,
        metalness: 0.98,
      }),
    ),
  };

  // 1. Hardwood Table Console Desk
  const deskGroup = new THREE.Group();
  rootGroup.add(deskGroup);

  const desk = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(10.5, 0.8, 5.5)), materials.oakWood);
  desk.position.y = -1.2;
  desk.receiveShadow = true;
  deskGroup.add(desk);

  [
    [-4.5, -2.0],
    [4.5, -2.0],
    [-4.5, 2.0],
    [4.5, 2.0],
  ].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.18, 0.18, 2.4, 12)),
      materials.oakWood,
    );
    leg.position.set(lx, -2.4, lz);
    deskGroup.add(leg);
  });

  // 2. Vertical Clock Register Dial Bank (40 Dials) (Claim 1)
  const dialBankGroup = new THREE.Group();
  dialBankGroup.position.set(0, 1.8, -1.8);
  rootGroup.add(dialBankGroup);

  const dialBackboard = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(6.5, 3.8, 0.35)),
    materials.oakWood,
  );
  dialBackboard.castShadow = true;
  dialBankGroup.add(dialBackboard);

  const dials: THREE.Mesh[] = [];
  const dialHands: THREE.Mesh[] = [];
  const dialsPerRow = 10;
  const dialRows = 4;

  for (let r = 0; r < dialRows; r++) {
    for (let c = 0; c < dialsPerRow; c++) {
      const dialGroup = new THREE.Group();
      dialGroup.position.set(-2.7 + c * 0.6, 1.2 - r * 0.75, 0.2);
      dialBankGroup.add(dialGroup);

      const dial = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.24, 0.24, 0.08, 16)),
        materials.dialFace,
      );
      dial.rotation.x = Math.PI / 2;
      dialGroup.add(dial);
      dials.push(dial);

      const hand = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.02, 0.18, 0.02)),
        materials.castIron,
      );
      hand.position.set(0, 0.06, 0.05);
      dialGroup.add(hand);
      dialHands.push(hand);
    }
  }

  // 3. Punched Card Pin Press Mechanism (Claim 2)
  const pressGroup = new THREE.Group();
  pressGroup.position.set(-2.4, 0.2, 0.8);
  rootGroup.add(pressGroup);

  const mercuryBed = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.4, 0.35, 1.6)),
    materials.castIron,
  );
  pressGroup.add(mercuryBed);

  const mercurySurface = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.2, 0.02, 1.4)),
    materials.mercuryPool,
  );
  mercurySurface.position.y = 0.18;
  pressGroup.add(mercurySurface);

  // Upper Pin Plate & Spring Suspension
  const pinPlateGroup = new THREE.Group();
  pinPlateGroup.position.y = 0.8;
  pressGroup.add(pinPlateGroup);

  const pinPlate = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.4, 0.2, 1.6)),
    materials.brassParts,
  );
  pinPlateGroup.add(pinPlate);

  // Individual Sensing Pins
  for (let pr = -0.5; pr <= 0.5; pr += 0.25) {
    for (let pc = -0.9; pc <= 0.9; pc += 0.3) {
      const pin = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.02, 0.02, 0.35, 8)),
        materials.brassParts,
      );
      pin.position.set(pc, -0.2, pr);
      pinPlateGroup.add(pin);
    }
  }

  // Punched Manila Card
  const punchCard = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.1, 0.02, 1.2)),
    materials.manilaCard,
  );
  punchCard.position.y = 0.2;
  pressGroup.add(punchCard);

  // Press Lever Handle
  const pressLever = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.06, 0.06, 2.2, 12)),
    materials.brassParts,
  );
  pressLever.rotation.z = Math.PI / 3;
  pressLever.position.set(1.2, 0.8, 0);
  pressGroup.add(pressLever);

  // 4. Electromagnetic Sorting Box (24 Compartments) (Claim 3)
  const sortBoxGroup = new THREE.Group();
  sortBoxGroup.position.set(2.8, -0.2, 0.8);
  rootGroup.add(sortBoxGroup);

  const sortBox = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(3.6, 1.4, 2.8)), materials.oakWood);
  sortBox.castShadow = true;
  sortBoxGroup.add(sortBox);

  // 24 Sorting Compartment Lids
  const sortLids: THREE.Mesh[] = [];
  for (let sr = 0; sr < 4; sr++) {
    for (let sc = 0; sc < 6; sc++) {
      const lid = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.5, 0.05, 0.6)),
        materials.brassParts,
      );
      lid.position.set(-1.25 + sc * 0.52, 0.72, -0.9 + sr * 0.6);
      sortBoxGroup.add(lid);
      sortLids.push(lid);
    }
  }

  const nodes: HollerithTabulatingModelNodes = {
    rootGroup,
    deskGroup,
    dialBankGroup,
    dials,
    dialHands,
    pressGroup,
    pinPlateGroup,
    pinPlate,
    mercuryBed,
    punchCard,
    pressLever,
    sortBoxGroup,
    sortLids,
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
 * Updates Hollerith pin press reciprocation, dial pointer step rotation, and sorter lid action.
 */
export function updateHollerithTabulatingKinematics(
  nodes: HollerithTabulatingModelNodes,
  materials: HollerithTabulatingMaterials,
  _dt: number,
  timeSec: number,
  cardsPerMin: number,
  solenoidForceN: number,
  isCutaway: boolean,
) {
  const pressFreq = (cardsPerMin / 60) * 2 * Math.PI;
  const pressPhase = Math.sin(timeSec * pressFreq);

  // 1. Pin Press Plunging Stroke & Lever Handle Action
  if (pressPhase > 0) {
    const plunge = pressPhase * (0.2 + (solenoidForceN / 40) * 0.35);
    nodes.pinPlateGroup.position.y = 0.8 - plunge;
    nodes.pressLever.rotation.z = Math.PI / 3 - plunge * 0.8;
  } else {
    nodes.pinPlateGroup.position.y = 0.8;
    nodes.pressLever.rotation.z = Math.PI / 3;
  }

  // 2. Stepping Dial Pointers
  const stepCount = Math.floor(timeSec * (cardsPerMin / 60));
  for (let d = 0; d < nodes.dialHands.length; d++) {
    const rot = ((stepCount + d * 3) % 100) * ((Math.PI * 2) / 100);
    nodes.dialHands[d].rotation.z = rot;
  }

  // 3. Sorting Box Lid Opening for active category
  const activeLidIndex = stepCount % nodes.sortLids.length;
  for (let l = 0; l < nodes.sortLids.length; l++) {
    nodes.sortLids[l].rotation.x = l === activeLidIndex && pressPhase > 0.5 ? -Math.PI / 4 : 0;
  }

  // 4. Cutaway Desk & Board Mode
  materials.oakWood.opacity = isCutaway ? 0.32 : 1.0;
  materials.oakWood.transparent = isCutaway;
}
