/**
 * renoEscalatorModel.ts
 *
 * Museum-Grade Procedural 3D Model for Jesse W. Reno's 1892 Endless Inclined Elevator / Escalator
 * (US Patent 470,918 - "Endless Conveyer or Elevator").
 *
 * Reconstructs the authentic historical apparatus demonstrated at the Coney Island Old Iron Pier:
 * 1. Inclined structural riveted steel Warren truss framework with lattice cross-bracing (Claim 1).
 * 2. Endless moving treadway composed of hardwood (quartersawn white oak) slats with longitudinal traction cleats.
 * 3. Intermeshing cast-bronze comb landing plates at head and tail landings with self-clearing triangular teeth (Claim 2).
 * 4. Dual synchronized moving flexible rubber/canvas handrails driven by cast-iron return sheaves.
 * 5. Under-deck roller guide tracks and endless link-chain transmission with drive sprockets.
 * 6. Victorian cast-iron balustrade stanchions, polished hardwood cap rails, and transparent cutaway panels.
 * 7. Electric motor drive gearhead assembly with heavy cast-iron flywheel and reduction gearing.
 */

import * as THREE from "three";
import { renoSheaveCrate } from "@/physics/genericWasm";

export interface RenoEscalatorModelNodes {
  root: THREE.Group;
  trussGroup: THREE.Group;
  balustradesGroup: THREE.Group;
  solidPanelMesh: THREE.Mesh;
  cutawayPanelMesh: THREE.Mesh;
  cleatDeckGroup: THREE.Group;
  cleats: THREE.Mesh[];
  cleatBaseX: number[];
  topCombPlate: THREE.Group;
  bottomCombPlate: THREE.Group;
  leftHandrail: THREE.Mesh;
  rightHandrail: THREE.Mesh;
  headSheaves: THREE.Mesh[];
  tailSheaves: THREE.Mesh[];
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

/**
 * Deterministic unit noise for procedural grain generation.
 */
function deterministicUnit(index: number, channel: number): number {
  const sample = Math.sin((index + 1) * 12.9898 + (channel + 1) * 78.233) * 43758.5453;
  return sample - Math.floor(sample);
}

/**
 * Procedural Quartersawn American White Oak Texture
 */
function createOakTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  ctx.fillStyle = "#8c531b";
  ctx.fillRect(0, 0, 512, 512);

  // Longitudinal grain striations
  for (let i = 0; i < 95; i++) {
    const y = i * 5.4 + (deterministicUnit(i, 0) - 0.5) * 3;
    const alpha = 0.08 + (i % 4 === 0 ? 0.14 : 0.03);
    ctx.strokeStyle = `rgba(62, 34, 10, ${alpha})`;
    ctx.lineWidth = 1.3 + (i % 3) * 0.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(170, y + 8, 340, y - 8, 512, y + 4);
    ctx.stroke();
  }

  // Quartersawn medullary ray flecks
  for (let p = 0; p < 180; p++) {
    const px = deterministicUnit(p, 1) * 512;
    const py = deterministicUnit(p, 2) * 512;
    ctx.fillStyle = "rgba(180, 120, 50, 0.22)";
    ctx.fillRect(px, py, 6 + deterministicUnit(p, 3) * 12, 2.2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Procedural Riveted Structural Steel Texture
 */
function createSteelTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  ctx.fillStyle = "#1e2430";
  ctx.fillRect(0, 0, 512, 512);

  // Mill scale and oxide mottling
  for (let i = 0; i < 500; i++) {
    const px = deterministicUnit(i, 0) * 512;
    const py = deterministicUnit(i, 1) * 512;
    const r = 1.5 + deterministicUnit(i, 2) * 3.5;
    ctx.fillStyle = "rgba(45, 55, 72, 0.45)";
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildRenoEscalatorModel(inclineAngleDeg = 25): RenoEscalatorModelResult {
  const root = new THREE.Group();
  const disposableGeometries: THREE.BufferGeometry[] = [];
  const disposableMaterials: THREE.Material[] = [];
  const disposableTextures: THREE.Texture[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    disposableGeometries.push(geo);
    return geo;
  };
  const trackMat = <T extends THREE.Material>(mat: T): T => {
    disposableMaterials.push(mat);
    return mat;
  };

  const oakTex = createOakTexture();
  if (oakTex) disposableTextures.push(oakTex);

  const steelTex = createSteelTexture();
  if (steelTex) disposableTextures.push(steelTex);

  const inclineRad = (inclineAngleDeg * Math.PI) / 180;

  // Authentic 1890s Jesse Reno Materials
  const materials: RenoEscalatorMaterials = {
    structuralSteel: trackMat(
      new THREE.MeshStandardMaterial({
        ...(steelTex ? { map: steelTex } : {}),
        color: 0x242c38,
        roughness: 0.55,
        metalness: 0.85,
      }),
    ),
    oakHardwood: trackMat(
      new THREE.MeshStandardMaterial({
        ...(oakTex ? { map: oakTex } : {}),
        color: 0x9a5b18,
        roughness: 0.58,
        metalness: 0.06,
      }),
    ),
    brassComb: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.22,
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
  // 1. Inclined Structural Steel Warren Truss Framework
  // -------------------------------------------------------------
  const trussGroup = new THREE.Group();
  root.add(trussGroup);

  // Twin Inclined Box-Beam Stringers with Gusset Plates
  [-1.4, 1.4].forEach((sz) => {
    const stringer = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(11.4, 0.48, 0.24)),
      materials.structuralSteel,
    );
    stringer.position.set(0, 0, sz);
    stringer.rotation.z = inclineRad;
    stringer.castShadow = true;
    trussGroup.add(stringer);

    // Warren diagonal lattice bracing struts
    for (let b = -4.5; b <= 4.5; b += 1.5) {
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

  // Top and Bottom Floor Landing Pedestals with Safety Thresholds
  const bottomLanding = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.6, 0.65, 3.6)),
    materials.structuralSteel,
  );
  bottomLanding.position.set(-5.1, -2.4, 0);
  bottomLanding.receiveShadow = true;
  bottomLanding.castShadow = true;
  trussGroup.add(bottomLanding);

  const topLanding = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.6, 0.65, 3.6)),
    materials.structuralSteel,
  );
  topLanding.position.set(5.1, 2.4, 0);
  topLanding.receiveShadow = true;
  topLanding.castShadow = true;
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
      trackGeo(new THREE.BoxGeometry(11.0, 1.25, 0.08)),
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
      trackGeo(new THREE.BoxGeometry(11.0, 1.25, 0.04)),
      materials.glassBalustrade,
    );
    glass.position.set(0, 0.8, bz);
    cutawayPanelMesh.add(glass);
  });
  balustradesGroup.add(cutawayPanelMesh);

  // Victorian Cast-Iron Stanchion Uprights supporting Handrails
  [-1.4, 1.4].forEach((sz) => {
    for (let p = -5; p <= 5; p += 2) {
      const stanchion = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.04, 0.05, 1.4, 12)),
        materials.castIronGears,
      );
      stanchion.position.set(p, 0.7, sz);
      balustradesGroup.add(stanchion);
    }
  });

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

    // Longitudinal Traction Cleat Ridges (Claim 1)
    for (let g = 0; g < 7; g++) {
      const gz = -1.05 + g * 0.35;
      const ridge = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.38, 0.045, 0.09)),
        materials.oakHardwood,
      );
      ridge.position.set(0, 0.075, gz);
      cleatGroup.add(ridge);
    }

    // Under-deck track rollers
    [-1.0, 1.0].forEach((rz) => {
      const roller = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.05, 0.05, 0.06, 12)),
        materials.castIronGears,
      );
      roller.rotation.x = Math.PI / 2;
      roller.position.set(0, -0.1, rz);
      cleatGroup.add(roller);
    });

    cleatDeckGroup.add(cleatGroup);
    cleats.push(cleatGroup);
    cleatBaseX.push(cx);
  }

  // -------------------------------------------------------------
  // 4. Intermeshing Cast-Bronze Comb Landing Plates (Claim 2)
  // -------------------------------------------------------------
  const buildCombPlate = (x: number, y: number, isTop: boolean): THREE.Group => {
    const combGroup = new THREE.Group();
    combGroup.position.set(x, y, 0);

    const basePlate = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.7, 0.09, 2.6)),
      materials.brassComb,
    );
    basePlate.castShadow = true;
    combGroup.add(basePlate);

    // 14 Pointed Triangular Comb Teeth extending between moving cleat ridges
    for (let t = 0; t < 14; t++) {
      const tz = -1.15 + t * 0.18;
      const tooth = new THREE.Mesh(
        trackGeo(new THREE.ConeGeometry(0.04, 0.38, 4)),
        materials.brassComb,
      );
      tooth.rotation.z = isTop ? -Math.PI / 2 : Math.PI / 2;
      tooth.position.set(isTop ? -0.42 : 0.42, 0.02, tz);
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
    trackGeo(new THREE.BoxGeometry(11.4, 0.15, 0.18)),
    materials.rubberHandrail,
  );
  leftHandrail.position.set(0, 1.45, 1.4);
  leftHandrail.rotation.z = inclineRad;
  root.add(leftHandrail);

  const rightHandrail = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(11.4, 0.15, 0.18)),
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
      trackGeo(new THREE.CylinderGeometry(0.48, 0.48, 0.16, 24)),
      materials.castIronGears,
    );
    headSheave.rotation.x = Math.PI / 2;
    headSheave.position.set(4.8, 2.2, sz);
    root.add(headSheave);
    headSheaves.push(headSheave);

    const tailSheave = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.48, 0.48, 0.16, 24)),
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
    trackGeo(new THREE.CylinderGeometry(0.46, 0.46, 1.0, 20)),
    materials.castIronGears,
  );
  motorCasing.rotation.z = Math.PI / 2;
  motorDriveGroup.add(motorCasing);

  const driveSprocket = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.58, 0.58, 0.28, 24)),
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
    for (const g of disposableGeometries) g.dispose();
    for (const m of disposableMaterials) m.dispose();
    for (const t of disposableTextures) t.dispose();
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
  const flex = renoSheaveCrate(sheaveOmegaRadPerS).sheaveFlex;
  nodes.headSheaves.forEach((s) => {
    s.rotation.y -= sheaveOmegaRadPerS * dt * flex;
  });
  nodes.tailSheaves.forEach((s) => {
    s.rotation.y -= sheaveOmegaRadPerS * dt * flex;
  });

  // 3. Cutaway Balustrades Visibility
  nodes.solidPanelMesh.visible = !cutawayMode;
  nodes.cutawayPanelMesh.visible = cutawayMode;
}
