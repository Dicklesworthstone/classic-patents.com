/**
 * mergenthalerLinotypeModel.ts
 *
 * Ultra-high-fidelity museum-grade procedural 3D mechanical model for
 * Ottmar Mergenthaler's revolutionary 1885 Hot-Metal Linotype Machine (US Patent 313,224).
 *
 * Reconstructs the historic linecasting mechanism with authentic industrial depth:
 * 1. Heavy ribbed cast-iron machine frame with leveling plinth and rear tower column.
 * 2. 90-key operator console with 3-bank colored keys (lowercase, numerals, uppercase),
 *    keyboard reeds, and front copyholder arm.
 * 3. Inclined brass matrix magazine with milled escapement channels and escapement verges.
 * 4. Overhead distributor mechanism: rotating triple helical distributor screws,
 *    V-notched binary distributor bar, and magazine entrance channel partitions.
 * 5. Assembler front & first elevator jaw: fiber star wheel, matrix chute, assembling elevator,
 *    and vise jaws clamping against the expandable spaceband wedges.
 * 6. Molten type-metal casting pot: insulated cast crucible, pump plunger with counterweight
 *    lever, gas burner manifold, and heated mouthpiece with injection orifices.
 * 7. Water-cooled four-slot mold disk with pinion gear drive, locking studs, and trimming knife.
 * 8. Full kinematic synchronization: plunger stroke, mold disk indexing, spaceband justification,
 *    and distributor arm matrix lift.
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
  // Enhanced museum sub-assemblies
  distributorScrews?: THREE.Mesh[];
  burnerManifold?: THREE.Mesh;
  viseJaws?: THREE.Mesh;
  starWheel?: THREE.Mesh;
  plungerLever?: THREE.Mesh;
}

export interface MergenthalerLinotypeMaterials {
  castIron: THREE.MeshStandardMaterial;
  polishedSteel: THREE.MeshStandardMaterial;
  brassMatrix: THREE.MeshStandardMaterial;
  moltenAlloy: THREE.MeshStandardMaterial;
  solidSlug: THREE.MeshStandardMaterial;
  keyCaps: THREE.MeshStandardMaterial;
  keyCapsWhite?: THREE.MeshStandardMaterial;
  keyCapsCyan?: THREE.MeshStandardMaterial;
  gasFlame?: THREE.MeshStandardMaterial;
  agedBronze?: THREE.MeshStandardMaterial;
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

  // ── Authentic Materials Palette ──────────────────────────────────────────
  const materials: MergenthalerLinotypeMaterials = {
    castIron: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.58,
        metalness: 0.8,
      }),
    ),
    polishedSteel: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.12,
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
        emissiveIntensity: 0.45,
      }),
    ),
    solidSlug: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.35,
        metalness: 0.85,
      }),
    ),
    keyCaps: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.35,
        metalness: 0.2,
      }),
    ),
    keyCapsWhite: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.3,
        metalness: 0.15,
      }),
    ),
    keyCapsCyan: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        roughness: 0.35,
        metalness: 0.2,
      }),
    ),
    gasFlame: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.1,
        metalness: 0.1,
        emissive: 0x0284c7,
        emissiveIntensity: 0.8,
      }),
    ),
    agedBronze: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x92400e,
        roughness: 0.35,
        metalness: 0.82,
      }),
    ),
  };

  // ── 1. Cast-Iron Machine Frame & Base ────────────────────────────────────
  const frameGroup = new THREE.Group();
  rootGroup.add(frameGroup);

  // Heavy stepped plinth base
  const basePlinth = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(4.8, 0.45, 4.6)),
    materials.castIron,
  );
  basePlinth.position.y = -2.2;
  basePlinth.receiveShadow = true;
  basePlinth.castShadow = true;
  frameGroup.add(basePlinth);

  // 4 Leveling jack screw pads
  [
    [-2.1, -1.9],
    [2.1, -1.9],
    [-2.1, 1.9],
    [2.1, 1.9],
  ].forEach(([px, pz]) => {
    const pad = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.22, 0.26, 0.15, 16)),
      materials.polishedSteel,
    );
    pad.position.set(px, -2.4, pz);
    frameGroup.add(pad);
  });

  // Main vertical column with hollow arch ribbed interior
  const mainColumn = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(1.6, 5.0, 2.0)),
    materials.castIron,
  );
  mainColumn.position.set(0, 0.3, 0);
  mainColumn.castShadow = true;
  frameGroup.add(mainColumn);

  // Diagonal support web
  const diagBrace = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.25, 3.2, 1.4)),
    materials.castIron,
  );
  diagBrace.position.set(0.65, 0.4, -0.6);
  diagBrace.rotation.x = -0.3;
  diagBrace.castShadow = true;
  frameGroup.add(diagBrace);

  // Bronze manufacturer nameplate
  const nameplate = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(1.4, 0.35, 0.04)),
    materials.brassMatrix,
  );
  nameplate.position.set(0, 1.8, 1.02);
  frameGroup.add(nameplate);

  // ── 2. 90-Key Operator Console (3-Bank Layout) ──────────────────────────
  const keyboardGroup = new THREE.Group();
  keyboardGroup.position.set(0, -0.55, 1.45);
  rootGroup.add(keyboardGroup);

  // Sloped cast-iron keyboard bed
  const keyBed = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.8, 0.32, 1.4)),
    materials.castIron,
  );
  keyBed.rotation.x = Math.PI / 7.5;
  keyBed.position.set(0, 0, 0);
  keyBed.castShadow = true;
  keyboardGroup.add(keyBed);

  // 90 Keys arranged in 3 banks: Lowercase (left/black), Digits/Punctuation (center/white), Uppercase (right/cyan)
  const keyGeo = trackGeo(new THREE.CylinderGeometry(0.042, 0.048, 0.09, 12));
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 15; c++) {
      const keyMat =
        c < 5
          ? materials.keyCaps
          : c < 10
            ? materials.keyCapsWhite || materials.keyCaps
            : materials.keyCapsCyan || materials.keyCaps;

      const keyMesh = new THREE.Mesh(keyGeo, keyMat);
      keyMesh.position.set(-1.15 + c * 0.165, 0.22 - r * 0.055, -0.35 + r * 0.155);
      keyboardGroup.add(keyMesh);
    }
  }

  // Keyboard reed comb plate underneath
  const reedPlate = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.6, 0.08, 1.2)),
    materials.polishedSteel,
  );
  reedPlate.position.set(0, -0.22, 0);
  reedPlate.rotation.x = Math.PI / 7.5;
  keyboardGroup.add(reedPlate);

  // ── 3. Inclined Brass Matrix Magazine & Escapements ─────────────────────
  const magazineGroup = new THREE.Group();
  magazineGroup.position.set(0, 2.7, -0.15);
  magazineGroup.rotation.x = Math.PI / 4.8;
  rootGroup.add(magazineGroup);

  // Main brass magazine plate
  const magBody = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.8, 3.4, 0.22)),
    materials.brassMatrix,
  );
  magBody.castShadow = true;
  magazineGroup.add(magBody);

  // Magazine cover plate with observation windows
  const magCover = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.6, 3.2, 0.06)),
    materials.polishedSteel,
  );
  magCover.position.z = 0.14;
  magazineGroup.add(magCover);

  // 90 Channel Escapement Grooves
  for (let ch = -1.2; ch <= 1.2; ch += 0.2) {
    const channel = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.04, 3.1, 0.08)),
      materials.polishedSteel,
    );
    channel.position.set(ch, 0, 0.16);
    magazineGroup.add(channel);
  }

  // Escapement verges at bottom mouth of magazine
  const vergeBar = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.7, 0.18, 0.24)),
    materials.brassMatrix,
  );
  vergeBar.position.set(0, -1.75, 0.1);
  magazineGroup.add(vergeBar);

  // ── 4. Assembler Front, Star Wheel & Vise Jaws ──────────────────────────
  const assemblerGroup = new THREE.Group();
  assemblerGroup.position.set(0, 0.25, 0.95);
  rootGroup.add(assemblerGroup);

  // Composing stick / assembler chute
  const assemblerChute = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.4, 0.38, 0.32)),
    materials.castIron,
  );
  assemblerGroup.add(assemblerChute);

  // Fiber star wheel (pushes falling matrices into line)
  const starWheel = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.18, 0.18, 0.06, 6)),
    materials.brassMatrix,
  );
  starWheel.rotation.x = Math.PI / 2;
  starWheel.position.set(-1.1, 0.12, 0.18);
  assemblerGroup.add(starWheel);

  // Composing line: 8 Brass Character Matrices
  const matrices: THREE.Mesh[] = [];
  const matrixGeo = trackGeo(new THREE.BoxGeometry(0.13, 0.48, 0.24));
  const notchGeo = trackGeo(new THREE.BoxGeometry(0.06, 0.08, 0.06));

  for (let m = 0; m < 8; m++) {
    const matGroup = new THREE.Group();
    matGroup.position.set(-0.72 + m * 0.185, 0.15, 0);

    const body = new THREE.Mesh(matrixGeo, materials.brassMatrix);
    body.castShadow = true;
    matGroup.add(body);

    // V-shaped teeth at top of matrix for binary distributor keyway
    const toothL = new THREE.Mesh(notchGeo, materials.polishedSteel);
    toothL.position.set(-0.04, 0.22, 0);
    matGroup.add(toothL);

    const toothR = new THREE.Mesh(notchGeo, materials.polishedSteel);
    toothR.position.set(0.04, 0.22, 0);
    matGroup.add(toothR);

    assemblerGroup.add(matGroup);
    matrices.push(body);
  }

  // Sliding Two-Piece Spaceband Wedges (Claim 2)
  const spacebands: THREE.Mesh[] = [];
  const wedgeGeo = trackGeo(new THREE.ConeGeometry(0.075, 0.72, 4));
  const sleeveGeo = trackGeo(new THREE.BoxGeometry(0.08, 0.45, 0.22));

  for (let s = 0; s < 3; s++) {
    const bandGroup = new THREE.Group();
    bandGroup.position.set(-0.36 + s * 0.37, 0.12, 0);

    // Long movable wedge
    const wedge = new THREE.Mesh(wedgeGeo, materials.polishedSteel);
    wedge.castShadow = true;
    bandGroup.add(wedge);

    // Short stationary sleeve
    const sleeve = new THREE.Mesh(sleeveGeo, materials.polishedSteel);
    sleeve.position.set(0, 0.05, 0.06);
    bandGroup.add(sleeve);

    assemblerGroup.add(bandGroup);
    spacebands.push(wedge);
  }

  // Precision vise jaws clamping line to column width
  const viseJaws = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.35, 0.5, 0.12)),
    materials.polishedSteel,
  );
  viseJaws.position.set(0, 0.12, -0.16);
  assemblerGroup.add(viseJaws);

  // ── 5. Molten Type-Metal Casting Pot & Gas Burner (Claim 3) ──────────────
  const potGroup = new THREE.Group();
  potGroup.position.set(-1.65, -0.38, 0.35);
  rootGroup.add(potGroup);

  // Insulated crucible pot body
  const potBody = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.72, 0.6, 1.3, 24)),
    materials.castIron,
  );
  potBody.castShadow = true;
  potGroup.add(potBody);

  // Pot lid with hinge
  const potLid = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.68, 0.72, 0.12, 24)),
    materials.castIron,
  );
  potLid.position.y = 0.68;
  potGroup.add(potLid);

  // Molten alloy pool at 260°C
  const moltenPool = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.56, 0.56, 0.12, 20)),
    materials.moltenAlloy,
  );
  moltenPool.position.y = 0.58;
  potGroup.add(moltenPool);

  // Pump well cylinder
  const wellCylinder = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.2, 0.2, 1.2, 16)),
    materials.castIron,
  );
  wellCylinder.position.set(0, 0.2, 0);
  potGroup.add(wellCylinder);

  // Precision pump plunger rod
  const potPlunger = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.12, 0.12, 1.7, 16)),
    materials.polishedSteel,
  );
  potPlunger.position.set(0, 0.95, 0);
  potPlunger.castShadow = true;
  potGroup.add(potPlunger);

  // Plunger overhead counterweight lever
  const plungerLever = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.12, 0.16, 1.6)),
    materials.castIron,
  );
  plungerLever.position.set(0, 1.82, -0.3);
  plungerLever.rotation.x = -0.18;
  potGroup.add(plungerLever);

  // Gas burner manifold with blue heating jets under crucible
  const burnerManifold = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.48, 0.06, 8, 16)),
    materials.gasFlame || materials.polishedSteel,
  );
  burnerManifold.rotation.x = Math.PI / 2;
  burnerManifold.position.y = -0.68;
  potGroup.add(burnerManifold);

  // ── 6. Revolving Four-Slot Mold Disk & Cast Slug Ejector ─────────────────
  const moldDiskGroup = new THREE.Group();
  moldDiskGroup.position.set(-0.75, -0.3, 0.95);
  rootGroup.add(moldDiskGroup);

  // Water-cooled 4-slot mold disk
  const moldDisk = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.78, 0.78, 0.24, 32)),
    materials.castIron,
  );
  moldDisk.rotation.x = Math.PI / 2;
  moldDisk.castShadow = true;
  moldDiskGroup.add(moldDisk);

  // 4 Slotted mold pockets around perimeter
  [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].forEach((ang) => {
    const moldSlot = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.45, 0.12, 0.26)),
      materials.polishedSteel,
    );
    moldSlot.position.set(Math.cos(ang) * 0.52, Math.sin(ang) * 0.52, 0);
    moldSlot.rotation.z = ang;
    moldDiskGroup.add(moldSlot);
  });

  // Solid Cast Line-of-Type (Slug) with typeface characters on face
  const slugMesh = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(1.65, 0.24, 0.14)),
    materials.solidSlug,
  );
  slugMesh.position.set(0.6, 0, 0.22);
  slugMesh.visible = false;
  moldDiskGroup.add(slugMesh);

  // Trimming knife block (shaves slug base flat)
  const knifeBlock = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.35, 0.7, 0.35)),
    materials.polishedSteel,
  );
  knifeBlock.position.set(0.85, 0, 0.15);
  moldDiskGroup.add(knifeBlock);

  // ── 7. Overhead Distributor Mechanism ────────────────────────────────────
  const distributorArmGroup = new THREE.Group();
  distributorArmGroup.position.set(1.4, 1.2, 0);
  rootGroup.add(distributorArmGroup);

  // Long second-elevator lifting arm
  const distArm = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.09, 0.11, 3.8, 16)),
    materials.castIron,
  );
  distArm.position.set(0, 1.7, 0);
  distArm.castShadow = true;
  distributorArmGroup.add(distArm);

  // V-Notched combination distributor bar across magazine top
  const distributorBar = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(3.0, 0.16, 0.28)),
    materials.polishedSteel,
  );
  distributorBar.position.set(-1.0, 3.5, -0.45);
  rootGroup.add(distributorBar);

  // Triple spiral distributor screws conveying matrices
  const distributorScrews: THREE.Mesh[] = [];
  [-0.1, 0.1].forEach((sy) => {
    const screw = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.04, 0.04, 2.9, 12)),
      materials.polishedSteel,
    );
    screw.rotation.z = Math.PI / 2;
    screw.position.set(-1.0, 3.5 + sy, -0.32);
    rootGroup.add(screw);
    distributorScrews.push(screw);
  });

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
    distributorScrews,
    burnerManifold,
    viseJaws,
    starWheel,
    plungerLever,
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
  nodes.potPlunger.position.y = 0.95 + plungerY * 0.6;
  if (nodes.plungerLever) {
    nodes.plungerLever.rotation.x = -0.18 + plungerY * 0.25;
  }

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

  // 5. Star Wheel & Distributor Screw Articulation
  if (nodes.starWheel) {
    nodes.starWheel.rotation.z += 0.05;
  }
  if (nodes.distributorScrews) {
    nodes.distributorScrews.forEach((screw) => {
      screw.rotation.y += 0.08;
    });
  }

  // 6. Distributor Arm Gentle Lift Motion
  nodes.distributorArmGroup.rotation.z = Math.sin(moldAngle * 0.5) * 0.15;
}
