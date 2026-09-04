import * as THREE from "three";
import type { ColtLockworkState } from "@/physics/coltRevolverKernel";
import type { GenericKernelSource } from "@/physics/genericWasm";
import { createLcg } from "@/utils/lcg";

/**
 * Dark historical finishes still need separable planes and grain in the bright
 * museum studio. These are display materials only: geometry and kinematics
 * remain the source-bound Paterson mechanism below.
 */
export const COLT_HISTORICAL_FINISHES = {
  caseHardenedTextureBase: "#34485b",
  walnutTextureBase: "#6a371c",
  engravingTextureBase: "#3e5a74",
  bluedSteel: {
    color: 0x5a748a,
    metalness: 0.66,
    roughness: 0.32,
    emissive: 0x0b1928,
    emissiveIntensity: 0.12,
  },
  caseHardenedSteel: {
    color: 0xc2d2e0,
    metalness: 0.66,
    roughness: 0.36,
    emissive: 0x0b1826,
    emissiveIntensity: 0.1,
  },
  engravedSteel: {
    color: 0x809cb4,
    metalness: 0.66,
    roughness: 0.31,
    emissive: 0x091827,
    emissiveIntensity: 0.1,
  },
  walnut: {
    color: 0x995a30,
    metalness: 0.02,
    roughness: 0.46,
  },
} as const;

/**
 * Samuel Colt's 1836 US X9430 connected lockwork presentation.
 *
 * The model is a non-dimensional reading aid for the drawing's hammer, key,
 * lifter, ratchet, shackle, arbor, cylinder, connecting-rod, and trigger.
 * Its coordinates are display coordinates only; US X9430 supplies no caliber,
 * scale, mass, force, pressure, timing, ballistic, or stress inputs.
 */

export interface ColtRevolverModel {
  group: THREE.Group;
  cylinderGroup: THREE.Group;
  hammerGroup: THREE.Group;
  triggerGroup: THREE.Group;
  underbarrelMemberGroup: THREE.Group;
  underbarrelMember: THREE.Mesh;
  lockworkCutawayGroup: THREE.Group;
  handPawl: THREE.Mesh;
  boltDetent: THREE.Mesh;
  mainspring: THREE.Mesh;
  textures: THREE.Texture[];
  kernelSource?: GenericKernelSource;
  dispose: () => void;
}

/**
 * Procedural Color Case-Hardened Steel Texture
 * Recreates the historic charcoal-and-bone quench oxidation swirling patterns.
 */
function createCaseHardenedTexture(lcg: () => number): THREE.CanvasTexture {
  if (typeof document === "undefined") {
    return new THREE.CanvasTexture({} as HTMLCanvasElement);
  }
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // A blue-black, mid-value base keeps the period case hardening legible
  // instead of turning into one silhouette under studio lighting.
  ctx.fillStyle = COLT_HISTORICAL_FINISHES.caseHardenedTextureBase;
  ctx.fillRect(0, 0, 512, 512);

  // Swirling oxidation halos (cyan, violet, straw amber, and charcoal)
  const colors = [
    "rgba(74, 143, 202, 0.58)", // peacock blue
    "rgba(159, 88, 190, 0.46)", // straw purple
    "rgba(224, 157, 69, 0.52)", // amber straw
    "rgba(48, 66, 84, 0.62)", // deep charcoal
    "rgba(135, 158, 182, 0.46)", // mottled nickel
  ];

  for (let i = 0; i < 80; i++) {
    const x = lcg() * 512;
    const y = lcg() * 512;
    const r = 20 + lcg() * 70;
    const grad = ctx.createRadialGradient(x, y, 2, x, y, r);
    const col = colors[i % colors.length];
    grad.addColorStop(0, col);
    grad.addColorStop(0.5, colors[(i + 1) % colors.length]);
    grad.addColorStop(1, "rgba(30, 36, 48, 0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Micro-scale carbon quenching grain
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const d = imgData.data;
  for (let p = 0; p < d.length; p += 4) {
    const noise = (lcg() - 0.5) * 16;
    d[p] = Math.max(0, Math.min(255, d[p] + noise));
    d[p + 1] = Math.max(0, Math.min(255, d[p + 1] + noise));
    d[p + 2] = Math.max(0, Math.min(255, d[p + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Procedural American Black Walnut Gunstock Texture
 */
function createWalnutGripTexture(lcg: () => number): THREE.CanvasTexture {
  if (typeof document === "undefined") {
    return new THREE.CanvasTexture({} as HTMLCanvasElement);
  }
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // The Paterson grip remains dark American walnut, but with enough value for
  // its growth rings to be inspectable at the overview camera distance.
  ctx.fillStyle = COLT_HISTORICAL_FINISHES.walnutTextureBase;
  ctx.fillRect(0, 0, 512, 512);

  // Flowing wood grain growth rings
  for (let i = 0; i < 110; i++) {
    const y = i * 4.8 + (lcg() - 0.5) * 3;
    ctx.strokeStyle = i % 4 === 0 ? "rgba(39, 17, 6, 0.62)" : "rgba(182, 101, 48, 0.48)";
    ctx.lineWidth = 1.2 + (lcg() - 0.5) * 0.8;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(
      150,
      y + (lcg() - 0.5) * 18,
      350,
      y + (lcg() - 0.5) * 22,
      512,
      y + (lcg() - 0.5) * 12,
    );
    ctx.stroke();
  }

  // Cross-pore medullary rays
  for (let j = 0; j < 350; j++) {
    const rx = lcg() * 512;
    const ry = lcg() * 512;
    ctx.fillStyle = "rgba(31, 13, 4, 0.4)";
    ctx.fillRect(rx, ry, 1.2, 3.5 + lcg() * 4);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Procedural Roll-Engraved Cylinder Scene Texture
 * Recreates the historic Texas naval battle cylinder engraving on Colt Paterson revolvers.
 */
function createCylinderEngravingTexture(): THREE.CanvasTexture {
  if (typeof document === "undefined") {
    return new THREE.CanvasTexture({} as HTMLCanvasElement);
  }
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Blued steel stays distinctly darker than the case-hardened frame while
  // preserving the roll engraving against the daylight studio background.
  ctx.fillStyle = COLT_HISTORICAL_FINISHES.engravingTextureBase;
  ctx.fillRect(0, 0, 1024, 256);

  // Engraved borders
  ctx.strokeStyle = "rgba(207, 229, 249, 0.65)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(10, 15, 1004, 226);
  ctx.strokeRect(16, 21, 992, 214);

  // Acanthus scrollwork and sailing vessels
  for (let k = 0; k < 12; k++) {
    const ox = k * 85 + 30;
    ctx.beginPath();
    ctx.arc(ox, 128, 26, 0, Math.PI * 1.5);
    ctx.bezierCurveTo(ox + 30, 160, ox + 60, 90, ox + 70, 128);
    ctx.stroke();

    if (k === 3) {
      ctx.fillStyle = "rgba(210, 235, 255, 0.75)";
      ctx.font = "italic bold 18px serif";
      ctx.fillText("COLT'S PATENT — PATERSON N.J.", ox - 35, 134);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Builds a procedural, source-bounded lockwork presentation.
 */
export function buildColtRevolverModel(): ColtRevolverModel {
  const lcg = createLcg(9430);
  const rootGroup = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const caseHardenedTex = createCaseHardenedTexture(lcg);
  const walnutTex = createWalnutGripTexture(lcg);
  const engravingTex = createCylinderEngravingTexture();
  textures.push(caseHardenedTex, walnutTex, engravingTex);

  // --- 1. HISTORICAL PBR MATERIALS ---
  const bluedBarrelMat = new THREE.MeshStandardMaterial({
    ...COLT_HISTORICAL_FINISHES.bluedSteel,
  });

  const caseHardenedMat = new THREE.MeshStandardMaterial({
    map: caseHardenedTex,
    ...COLT_HISTORICAL_FINISHES.caseHardenedSteel,
  });

  const engravedCylinderMat = new THREE.MeshStandardMaterial({
    map: engravingTex,
    ...COLT_HISTORICAL_FINISHES.engravedSteel,
  });

  const polishedBrassMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.94,
    roughness: 0.18,
  });

  const walnutGripMat = new THREE.MeshStandardMaterial({
    map: walnutTex,
    ...COLT_HISTORICAL_FINISHES.walnut,
  });

  const boreInteriorMat = new THREE.MeshStandardMaterial({
    color: 0x05070d,
    metalness: 0.96,
    roughness: 0.6,
  });

  const percussionCapMat = new THREE.MeshStandardMaterial({
    color: 0xc87d46, // Copper percussion cap
    metalness: 0.95,
    roughness: 0.25,
  });

  // --- 2. REVOLVING 5-CHAMBER CYLINDER (US X9430 Fig. 2 & 3) ---
  // Positioned at origin (0, 0, 0)
  const cylinderGroup = new THREE.Group();
  cylinderGroup.position.set(0, 0, 0);

  const cylinderLength = 2.7;
  const cylinderRadius = 1.32;
  const chamberPitchRadius = 0.82;
  const chamberCount = 5;

  // Main Cylinder Drum Body
  const cylinderBodyGeo = new THREE.CylinderGeometry(
    cylinderRadius,
    cylinderRadius,
    cylinderLength,
    40,
  );
  cylinderBodyGeo.rotateZ(Math.PI / 2);
  const cylinderBody = new THREE.Mesh(cylinderBodyGeo, engravedCylinderMat);
  cylinderBody.castShadow = true;
  cylinderBody.receiveShadow = true;
  cylinderGroup.add(cylinderBody);

  // Front Chamfer Bevel Ring
  const chamferRingGeo = new THREE.CylinderGeometry(
    cylinderRadius * 0.95,
    cylinderRadius,
    0.15,
    40,
  );
  chamferRingGeo.rotateZ(Math.PI / 2);
  const chamferRing = new THREE.Mesh(chamferRingGeo, bluedBarrelMat);
  chamferRing.position.set(cylinderLength / 2 - 0.07, 0, 0);
  cylinderGroup.add(chamferRing);

  // Central Center-Hole for Arbor Pin
  const centerHoleGeo = new THREE.CylinderGeometry(0.28, 0.28, cylinderLength + 0.04, 20);
  centerHoleGeo.rotateZ(Math.PI / 2);
  const centerHole = new THREE.Mesh(centerHoleGeo, boreInteriorMat);
  cylinderGroup.add(centerHole);

  // Rear Ratchet Indexing Star (5-Tooth Steel Cam for Hand Pawl)
  const ratchetGeo = new THREE.CylinderGeometry(0.52, 0.56, 0.32, 10);
  ratchetGeo.rotateZ(Math.PI / 2);
  const ratchetStar = new THREE.Mesh(ratchetGeo, caseHardenedMat);
  ratchetStar.position.set(-cylinderLength / 2 - 0.16, 0, 0);
  cylinderGroup.add(ratchetStar);

  // 5 Chamber Bores, Nipple Recesses, Isolating Partition Walls, and Locking Notches
  for (let c = 0; c < chamberCount; c++) {
    const theta = (c * Math.PI * 2) / chamberCount;
    const cy = Math.cos(theta) * chamberPitchRadius;
    const cz = Math.sin(theta) * chamberPitchRadius;

    // Display chamber opening: this is not a caliber or load geometry.
    const chamberGeo = new THREE.CylinderGeometry(0.23, 0.23, cylinderLength + 0.02, 16);
    chamberGeo.rotateZ(Math.PI / 2);
    const chamberMesh = new THREE.Mesh(chamberGeo, boreInteriorMat);
    chamberMesh.position.set(0.01, cy, cz);
    cylinderGroup.add(chamberMesh);

    // Rear Recessed Nipple Well
    const nippleWellGeo = new THREE.CylinderGeometry(0.24, 0.18, 0.4, 14);
    nippleWellGeo.rotateZ(Math.PI / 2);
    const nippleWell = new THREE.Mesh(nippleWellGeo, boreInteriorMat);
    nippleWell.position.set(-cylinderLength / 2 + 0.12, cy, cz);
    cylinderGroup.add(nippleWell);

    // Threaded Hardened Steel Percussion Nipple Cone
    const nippleGeo = new THREE.CylinderGeometry(0.07, 0.095, 0.35, 10);
    nippleGeo.rotateZ(Math.PI / 2);
    const nippleCone = new THREE.Mesh(nippleGeo, caseHardenedMat);
    nippleCone.position.set(-cylinderLength / 2 - 0.08, cy, cz);
    cylinderGroup.add(nippleCone);

    // Primed Copper Percussion Cap (seated on nipple)
    const capGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.2, 10);
    capGeo.rotateZ(Math.PI / 2);
    const capMesh = new THREE.Mesh(capGeo, percussionCapMat);
    capMesh.position.set(-cylinderLength / 2 - 0.14, cy, cz);
    cylinderGroup.add(capMesh);

    // Radial Flash-Barrier Partition Walls (Claim 3) between Nipples
    const partTheta = theta + Math.PI / chamberCount;
    const partPy = Math.cos(partTheta) * 0.72;
    const partPz = Math.sin(partTheta) * 0.72;
    const partGeo = new THREE.BoxGeometry(0.36, 0.08, 0.45);
    partGeo.rotateX(partTheta);
    const partitionWall = new THREE.Mesh(partGeo, bluedBarrelMat);
    partitionWall.position.set(-cylinderLength / 2 - 0.06, partPy, partPz);
    cylinderGroup.add(partitionWall);

    // Fluted Scallop Grooves on Outer Cylinder Body
    const fy = Math.cos(partTheta) * (cylinderRadius + 0.02);
    const fz = Math.sin(partTheta) * (cylinderRadius + 0.02);
    const fluteGeo = new THREE.CylinderGeometry(0.28, 0.28, cylinderLength * 0.65, 14);
    fluteGeo.rotateZ(Math.PI / 2);
    const fluteMesh = new THREE.Mesh(fluteGeo, bluedBarrelMat);
    fluteMesh.position.set(0, fy, fz);
    cylinderGroup.add(fluteMesh);

    // Cylinder Locking Stop Notches (Rectangular detents for cylinder bolt)
    const notchGeo = new THREE.BoxGeometry(0.24, 0.1, 0.18);
    const notchMesh = new THREE.Mesh(notchGeo, boreInteriorMat);
    notchMesh.position.set(
      cylinderLength * 0.28,
      Math.cos(theta) * (cylinderRadius + 0.01),
      Math.sin(theta) * (cylinderRadius + 0.01),
    );
    cylinderGroup.add(notchMesh);
  }

  rootGroup.add(cylinderGroup);

  // --- 3. HARDENED STEEL CENTER ARBOR PIN (Longitudinal Axle) ---
  // Coaxial with cylinder center (Y = 0, Z = 0)
  const arborGeo = new THREE.CylinderGeometry(0.24, 0.24, 5.8, 20);
  arborGeo.rotateZ(Math.PI / 2);
  const arborPin = new THREE.Mesh(arborGeo, caseHardenedMat);
  arborPin.position.set(0.6, 0, 0);
  rootGroup.add(arborPin);

  // --- 4. OCTAGONAL RIFLED BARREL & UNDER-LUG (US X9430 Fig. 1) ---
  // Barrel Axis is PRECISELY at Y = +0.82, Z = 0 (Concentric with Top Chamber)
  const barrelGroup = new THREE.Group();
  barrelGroup.position.set(0, 0, 0);

  const barrelLength = 6.6; // 7.5-inch Paterson barrel
  const barrelStartX = cylinderLength / 2 + 0.05; // 1.40
  const barrelCenterX = barrelStartX + barrelLength / 2; // 4.70

  // True Octagonal Tapered Barrel
  const barrelGeo = new THREE.CylinderGeometry(0.38, 0.45, barrelLength, 8);
  barrelGeo.rotateZ(Math.PI / 2);
  const barrelMesh = new THREE.Mesh(barrelGeo, bluedBarrelMat);
  barrelMesh.position.set(barrelCenterX, 0.82, 0);
  barrelMesh.castShadow = true;
  barrelMesh.receiveShadow = true;
  barrelGroup.add(barrelMesh);

  // Top Flat Engraved Address Rib
  const topRibGeo = new THREE.BoxGeometry(barrelLength, 0.04, 0.24);
  const topRibMesh = new THREE.Mesh(topRibGeo, bluedBarrelMat);
  topRibMesh.position.set(barrelCenterX, 0.82 + 0.42, 0);
  barrelGroup.add(topRibMesh);

  // Recessed Muzzle Crown & 7-Groove Rifling Lands
  const barrelEndX = barrelStartX + barrelLength;
  const crownGeo = new THREE.RingGeometry(0.18, 0.38, 16);
  crownGeo.rotateY(Math.PI / 2);
  const crownMesh = new THREE.Mesh(crownGeo, bluedBarrelMat);
  crownMesh.position.set(barrelEndX + 0.005, 0.82, 0);
  barrelGroup.add(crownMesh);

  const boreHoleGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.8, 16);
  boreHoleGeo.rotateZ(Math.PI / 2);
  const boreHoleMesh = new THREE.Mesh(boreHoleGeo, boreInteriorMat);
  boreHoleMesh.position.set(barrelEndX - 0.35, 0.82, 0);
  barrelGroup.add(boreHoleMesh);

  // German Silver / Brass Bead Front Sight Blade
  const sightBase = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.08, 0.06), bluedBarrelMat);
  sightBase.position.set(barrelEndX - 0.45, 0.82 + 0.45, 0);
  barrelGroup.add(sightBase);

  const sightBead = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.18, 8), polishedBrassMat);
  sightBead.position.set(barrelEndX - 0.45, 0.82 + 0.56, 0);
  barrelGroup.add(sightBead);

  // Heavy Forged Barrel Under-Lug (Anchors barrel to arbor pin)
  // Connects barrel at Y = +0.82 down to arbor pin at Y = 0
  const lugGeo = new THREE.BoxGeometry(1.6, 1.25, 0.82);
  const lugMesh = new THREE.Mesh(lugGeo, caseHardenedMat);
  lugMesh.position.set(barrelStartX + 0.8, 0.35, 0);
  lugMesh.castShadow = true;
  barrelGroup.add(lugMesh);

  // Transverse Takedown Wedge Key Slot & Tapered Steel Wedge
  const wedgeSlot = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.22, 0.88), boreInteriorMat);
  wedgeSlot.position.set(barrelStartX + 0.95, 0.0, 0);
  barrelGroup.add(wedgeSlot);

  const wedgeKey = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.18, 1.05), bluedBarrelMat);
  wedgeKey.position.set(barrelStartX + 0.95, 0.0, 0.05);
  barrelGroup.add(wedgeKey);

  rootGroup.add(barrelGroup);

  // --- 5. STATIC UNDER-BARREL MEMBER (display geometry; not a load simulation) ---
  const underbarrelMemberGroup = new THREE.Group();
  underbarrelMemberGroup.position.set(0, 0, 0);

  const leverHandleGeo = new THREE.CylinderGeometry(0.065, 0.085, 4.4, 12);
  leverHandleGeo.rotateZ(Math.PI / 2);
  const leverHandle = new THREE.Mesh(leverHandleGeo, caseHardenedMat);
  leverHandle.position.set(barrelStartX + 2.5, -0.42, 0);
  underbarrelMemberGroup.add(leverHandle);

  // Hinged Fulcrum Linkage pinned to barrel under-lug
  const leverFulcrum = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.34, 12),
    polishedBrassMat,
  );
  leverFulcrum.position.set(barrelStartX + 0.7, -0.28, 0);
  underbarrelMemberGroup.add(leverFulcrum);

  // Static display member below the barrel; it has no loading-cycle state.
  const underbarrelMember = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 1.8, 14),
    bluedBarrelMat,
  );
  underbarrelMember.rotateZ(Math.PI / 2);
  underbarrelMember.position.set(barrelStartX - 0.2, -0.82, 0);
  underbarrelMemberGroup.add(underbarrelMember);

  // Under-barrel Lever Catch Clip
  const leverCatch = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.24, 0.16), bluedBarrelMat);
  leverCatch.position.set(barrelStartX + 4.2, 0.35, 0);
  underbarrelMemberGroup.add(leverCatch);

  rootGroup.add(underbarrelMemberGroup);

  // --- 6. CASE-HARDENED RECEIVER FRAME AND SHIELD (US X9430 Fig. 4) ---
  const frameGroup = new THREE.Group();
  frameGroup.position.set(0, 0, 0);

  const frameRearX = -cylinderLength / 2 - 0.05; // -1.40

  // Lower frame bed connecting the front lug and rear shield.
  const lowerBedGeo = new THREE.BoxGeometry(3.6, 0.55, 0.92);
  const lowerBed = new THREE.Mesh(lowerBedGeo, caseHardenedMat);
  lowerBed.position.set(-0.6, -1.38, 0);
  lowerBed.castShadow = true;
  frameGroup.add(lowerBed);

  // Curved Recoil Shield & Cap Loading Channel
  const shieldGeo = new THREE.SphereGeometry(1.52, 32, 24, 0, Math.PI, 0, Math.PI / 2);
  shieldGeo.rotateY(Math.PI / 2);
  const rearShield = new THREE.Mesh(shieldGeo, caseHardenedMat);
  rearShield.position.set(frameRearX - 0.4, 0.0, 0);
  rearShield.castShadow = true;
  frameGroup.add(rearShield);

  // Percussion-cap shield cutout.
  const capCutout = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.6, 0.5), boreInteriorMat);
  capCutout.position.set(frameRearX - 0.2, 0.4, 0.85);
  frameGroup.add(capCutout);

  // Receiver Frame Body (Housing lockwork, mainspring mortise, and hammer arbor)
  const receiverBodyGeo = new THREE.BoxGeometry(1.8, 2.2, 0.92);
  const receiverBody = new THREE.Mesh(receiverBodyGeo, caseHardenedMat);
  receiverBody.position.set(frameRearX - 0.9, -0.45, 0);
  receiverBody.castShadow = true;
  frameGroup.add(receiverBody);

  // Frame Screws & Pivot Pins
  const screwGeo = new THREE.CylinderGeometry(0.09, 0.09, 1.0, 12);
  for (let s = 0; s < 3; s++) {
    const frameScrew = new THREE.Mesh(screwGeo, bluedBarrelMat);
    frameScrew.position.set(frameRearX - 0.5 - s * 0.55, -0.6 + (s % 2) * 0.45, 0);
    frameGroup.add(frameScrew);
  }

  rootGroup.add(frameGroup);

  // --- 7. CONTOURED AMERICAN BLACK WALNUT GRIP & SOLID BRASS STRAP ---
  const gripGroup = new THREE.Group();
  gripGroup.position.set(frameRearX - 1.6, -1.2, 0);

  // Contoured Flared Walnut Grip Handle (Plowhandle profile)
  const gripShape = new THREE.Shape();
  gripShape.moveTo(0, 0.9);
  gripShape.bezierCurveTo(-0.5, 0.4, -1.1, -1.0, -1.0, -2.0); // Backstrap curve
  gripShape.bezierCurveTo(-0.7, -2.4, 0.4, -2.5, 0.8, -2.3); // Butt curve
  gripShape.bezierCurveTo(0.9, -1.5, 0.5, -0.2, 0.65, 0.6); // Frontstrap curve
  gripShape.closePath();

  const extrudeSettings = {
    depth: 0.95,
    bevelEnabled: true,
    bevelSegments: 6,
    steps: 2,
    bevelSize: 0.16,
    bevelThickness: 0.16,
  };

  const gripGeometry = new THREE.ExtrudeGeometry(gripShape, extrudeSettings);
  gripGeometry.center();
  const gripMesh = new THREE.Mesh(gripGeometry, walnutGripMat);
  gripMesh.castShadow = true;
  gripGroup.add(gripMesh);

  // Solid Brass Backstrap & Butt Plate
  const backstrapGeo = new THREE.BoxGeometry(0.16, 3.4, 1.0);
  const backstrap = new THREE.Mesh(backstrapGeo, polishedBrassMat);
  backstrap.position.set(-0.75, -0.5, 0);
  backstrap.rotation.z = 0.26;
  gripGroup.add(backstrap);

  const buttPlateGeo = new THREE.BoxGeometry(1.5, 0.2, 1.12);
  const buttPlate = new THREE.Mesh(buttPlateGeo, polishedBrassMat);
  buttPlate.position.set(-0.08, -1.85, 0);
  buttPlate.rotation.z = -0.12;
  gripGroup.add(buttPlate);

  rootGroup.add(gripGroup);

  // --- 8. HISTORIC PATERSON FOLDING TRIGGER (US X9430 Fig. 5) ---
  // Hidden inside frame mortise; drops down and tilts when cocked!
  const triggerGroup = new THREE.Group();
  triggerGroup.position.set(frameRearX - 0.7, -1.42, 0);

  const triggerBody = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.7, 0.12), bluedBarrelMat);
  triggerBody.position.set(0, -0.25, 0);
  triggerGroup.add(triggerBody);

  const triggerCurvedTip = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.07, 0.12, 12),
    polishedBrassMat,
  );
  triggerCurvedTip.position.set(0.04, -0.55, 0);
  triggerGroup.add(triggerCurvedTip);

  rootGroup.add(triggerGroup);

  // --- 9. SINGLE-ACTION HAMMER & CHECKERED SPUR (US X9430 Fig. 6) ---
  // Pivot axis at (frameRearX - 1.1, -0.15)
  const hammerGroup = new THREE.Group();
  const hammerPivotX = frameRearX - 1.1; // -2.50
  const hammerPivotY = -0.15;
  hammerGroup.position.set(hammerPivotX, hammerPivotY, 0);

  const hammerBaseGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.32, 16);
  const hammerBase = new THREE.Mesh(hammerBaseGeo, caseHardenedMat);
  hammerGroup.add(hammerBase);

  // Gracefully Curved Hammer Body & Checkered Thumb Spur
  const hammerSpurShape = new THREE.Shape();
  hammerSpurShape.moveTo(0, 0);
  hammerSpurShape.lineTo(0.9, 0.97); // Striker nose extension reaching Y = +0.82
  hammerSpurShape.bezierCurveTo(0.6, 1.4, 0.2, 1.75, -0.4, 1.85); // Thumb spur
  hammerSpurShape.bezierCurveTo(-0.7, 1.65, -0.5, 1.1, -0.2, 0.5);
  hammerSpurShape.closePath();

  const hammerExtrude = new THREE.ExtrudeGeometry(hammerSpurShape, {
    depth: 0.28,
    bevelEnabled: true,
    bevelSegments: 4,
    bevelSize: 0.05,
    bevelThickness: 0.05,
  });
  hammerExtrude.center();
  const hammerMesh = new THREE.Mesh(hammerExtrude, caseHardenedMat);
  hammerMesh.position.set(0.15, 0.7, 0);
  hammerMesh.castShadow = true;
  hammerGroup.add(hammerMesh);

  // Striker Nose Channel (strikes copper percussion cap squarely at Y = +0.82)
  const strikerNose = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.12, 0.45, 8),
    bluedBarrelMat,
  );
  strikerNose.rotateZ(Math.PI / 2);
  strikerNose.position.set(0.95, 0.97, 0);
  hammerGroup.add(strikerNose);

  rootGroup.add(hammerGroup);

  // --- 10. INTERNAL LOCKWORK CUTAWAY MECHANISM (Pawl, Bolt, Mainspring) ---
  const lockworkCutawayGroup = new THREE.Group();
  lockworkCutawayGroup.position.set(frameRearX - 0.7, -0.5, 0);

  // Spring-Loaded Hand Pawl (rises to rotate ratchet star 72° on cocking)
  const handPawl = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.05, 0.08), polishedBrassMat);
  handPawl.position.set(0.45, 0.45, 0.18);
  handPawl.rotation.z = -0.3;
  lockworkCutawayGroup.add(handPawl);

  // Cylinder Locking Bolt Detent (beneath cylinder)
  const boltDetent = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.14, 0.12), bluedBarrelMat);
  boltDetent.position.set(0.55, -0.75, 0);
  lockworkCutawayGroup.add(boltDetent);

  // Flat Laminated Steel Mainspring
  const mainspringGeo = new THREE.TorusGeometry(1.5, 0.07, 8, 20, Math.PI * 0.45);
  mainspringGeo.rotateZ(Math.PI * 0.85);
  const mainspring = new THREE.Mesh(mainspringGeo, bluedBarrelMat);
  mainspring.position.set(-0.7, -0.5, 0);
  lockworkCutawayGroup.add(mainspring);

  lockworkCutawayGroup.visible = false;
  rootGroup.add(lockworkCutawayGroup);

  const dispose = () => {
    for (const tex of textures) {
      tex.dispose();
    }
    rootGroup.traverse((child) => {
      if (child instanceof THREE.Mesh || child instanceof THREE.Points) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          for (const m of child.material) m.dispose();
        } else if (child.material) {
          child.material.dispose();
        }
      }
    });
  };

  return {
    group: rootGroup,
    cylinderGroup,
    hammerGroup,
    triggerGroup,
    underbarrelMemberGroup,
    underbarrelMember,
    lockworkCutawayGroup,
    handPawl,
    boltDetent,
    mainspring,
    textures,
    dispose,
  };
}

/**
 * Updates the common source-order pose. Display angles are normalized
 * presentation coordinates emitted by the kernel, not historical measurements.
 */
export function updateColtRevolverKinematics(
  model: ColtRevolverModel,
  state: ColtLockworkState,
  showLockworkCutaway: boolean,
): void {
  const cockProgress = state.cockingProgress01;

  model.hammerGroup.rotation.z = -(state.displayHammerAngleDeg * Math.PI) / 180;

  // Folding Trigger drop: emerges from frame slot as hammer is cocked
  const triggerDeployY = -0.3 - cockProgress * 0.38;
  model.triggerGroup.position.y = triggerDeployY;
  model.triggerGroup.rotation.z = state.safeToReleaseHammer ? 0 : -cockProgress * 0.25;

  model.cylinderGroup.rotation.x = state.cylinderIndexAngleRad;

  // Articulated Lockwork Cutaway parts
  if (model.handPawl) {
    model.handPawl.position.y = 0.45 + cockProgress * 0.28;
    model.handPawl.position.x = 0.45 - cockProgress * 0.1;
    model.handPawl.rotation.z = -0.3 + cockProgress * 0.22;
  }
  if (model.boltDetent) {
    const boltDrop = state.keySeated ? 0 : -0.16;
    model.boltDetent.position.y = -0.75 + boltDrop;
  }
  if (model.mainspring) {
    const springFlex = 1.0 - cockProgress * 0.08;
    model.mainspring.scale.set(springFlex, 1.0 + cockProgress * 0.08, 1.0);
  }

  // Lockwork Cutaway view
  model.lockworkCutawayGroup.visible = showLockworkCutaway;
}
