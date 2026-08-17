import * as THREE from "three";

/**
 * 1836 Samuel Colt Paterson Revolver (.36 Caliber No. 5 Texas Model)
 * Authentic Historical Engineering Specifications from US Patent 138 (Feb 25, 1836)
 * Scale: 1 world unit = 2.5 cm (Revolver overall length ≈ 32 cm / 12.8 units)
 */

export interface ColtRevolverModel {
  group: THREE.Group;
  cylinderGroup: THREE.Group;
  hammerGroup: THREE.Group;
  triggerGroup: THREE.Group;
  loadingLeverGroup: THREE.Group;
  rammerPlunger: THREE.Mesh;
  blastGroup: THREE.Group;
  blastMesh: THREE.Mesh;
  smokeMesh: THREE.Points;
  sparkPoints: THREE.Points;
  lockworkCutawayGroup: THREE.Group;
  textures: THREE.Texture[];
}

/**
 * Procedural Color Case-Hardened Steel Texture
 * Recreates the historic charcoal-and-bone quench oxidation swirling patterns.
 */
function createCaseHardenedTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep dark mottled slate-blue base
  ctx.fillStyle = "#1e2430";
  ctx.fillRect(0, 0, 512, 512);

  // Swirling oxidation halos (cyan, violet, straw amber, and charcoal)
  const colors = [
    "rgba(56, 114, 170, 0.45)", // peacock blue
    "rgba(142, 68, 173, 0.35)", // straw purple
    "rgba(212, 143, 56, 0.38)", // amber straw
    "rgba(40, 55, 71, 0.6)", // deep charcoal
    "rgba(93, 109, 126, 0.3)", // mottled nickel
  ];

  for (let i = 0; i < 70; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = 25 + Math.random() * 65;
    const grad = ctx.createRadialGradient(x, y, 2, x, y, r);
    const col = colors[i % colors.length];
    grad.addColorStop(0, col);
    grad.addColorStop(0.6, colors[(i + 1) % colors.length]);
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
    const noise = (Math.random() - 0.5) * 18;
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
function createWalnutGripTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep chocolate walnut base
  ctx.fillStyle = "#3e2312";
  ctx.fillRect(0, 0, 512, 512);

  // Flowing wood grain growth rings
  for (let i = 0; i < 90; i++) {
    const y = i * 5.8 + (Math.random() - 0.5) * 3;
    const alpha = 0.08 + (i % 5 === 0 ? 0.16 : 0.04);
    ctx.strokeStyle = `rgba(28, 14, 6, ${alpha})`;
    ctx.lineWidth = 1.2 + (i % 3) * 0.8;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(150, y + 25, 360, y - 20, 512, y + 10);
    ctx.stroke();
  }

  // Walnut pores and medullary rays
  for (let j = 0; j < 400; j++) {
    const px = Math.random() * 512;
    const py = Math.random() * 512;
    ctx.fillStyle = "rgba(18, 8, 3, 0.22)";
    ctx.fillRect(px, py, 4 + Math.random() * 8, 1.2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Procedural Roll-Engraved Cylinder Scene Texture
 * Recreates the iconic Texas naval battle cylinder engraving on Colt Paterson revolvers.
 */
function createCylinderEngravingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Blued steel background
  ctx.fillStyle = "#222c38";
  ctx.fillRect(0, 0, 1024, 256);

  // Engraved floral scrollwork borders
  ctx.strokeStyle = "rgba(180, 205, 230, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(10, 15, 1004, 226);
  ctx.strokeRect(16, 21, 992, 214);

  // Decorative acanthus scrolls and battle ships
  for (let k = 0; k < 12; k++) {
    const ox = k * 85 + 30;
    ctx.beginPath();
    ctx.arc(ox, 128, 24, 0, Math.PI * 1.5);
    ctx.bezierCurveTo(ox + 30, 160, ox + 60, 90, ox + 70, 128);
    ctx.stroke();

    // Historic text banner
    if (k === 3) {
      ctx.fillStyle = "rgba(200, 225, 255, 0.6)";
      ctx.font = "italic bold 18px serif";
      ctx.fillText("COLT'S PATENT No. 138", ox - 10, 134);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Builds a blueprint-accurate, museum-quality 3D Colt Paterson 1836 Revolver.
 */
export function buildColtRevolverModel(): ColtRevolverModel {
  const rootGroup = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const caseHardenedTex = createCaseHardenedTexture();
  const walnutTex = createWalnutGripTexture();
  const engravingTex = createCylinderEngravingTexture();
  textures.push(caseHardenedTex, walnutTex, engravingTex);

  // --- 1. HISTORICAL PBR MATERIALS ---
  const bluedBarrelMat = new THREE.MeshStandardMaterial({
    color: 0x222d3b,
    metalness: 0.88,
    roughness: 0.28,
  });

  const caseHardenedMat = new THREE.MeshStandardMaterial({
    map: caseHardenedTex,
    color: 0x85929e,
    metalness: 0.82,
    roughness: 0.32,
  });

  const engravedCylinderMat = new THREE.MeshStandardMaterial({
    map: engravingTex,
    color: 0x2c3848,
    metalness: 0.9,
    roughness: 0.25,
  });

  const polishedBrassMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.92,
    roughness: 0.22,
  });

  const walnutGripMat = new THREE.MeshStandardMaterial({
    map: walnutTex,
    color: 0x4a2c17,
    metalness: 0.04,
    roughness: 0.45,
  });

  const boreInteriorMat = new THREE.MeshStandardMaterial({
    color: 0x050810,
    metalness: 0.95,
    roughness: 0.6,
  });

  const percussionCapMat = new THREE.MeshStandardMaterial({
    color: 0xc87d46, // copper percussion cap
    metalness: 0.94,
    roughness: 0.26,
  });

  // --- 2. OCTAGONAL RIFLED BARREL & UNDER-LUG (US 138 Fig. 1) ---
  const barrelGroup = new THREE.Group();
  barrelGroup.position.set(2.6, 0.65, 0);

  // True Octagonal Tapered Barrel (7.5 inches = 6.2 units length)
  const barrelLength = 6.2;
  const barrelGeo = new THREE.CylinderGeometry(0.38, 0.44, barrelLength, 8);
  barrelGeo.rotateZ(Math.PI / 2);
  const barrelMesh = new THREE.Mesh(barrelGeo, bluedBarrelMat);
  barrelMesh.castShadow = true;
  barrelMesh.receiveShadow = true;
  barrelGroup.add(barrelMesh);

  // Top Flat Engraved Address Rib
  const topRibGeo = new THREE.BoxGeometry(barrelLength, 0.04, 0.22);
  const topRibMesh = new THREE.Mesh(topRibGeo, bluedBarrelMat);
  topRibMesh.position.set(0, 0.4, 0);
  barrelGroup.add(topRibMesh);

  // Recessed Muzzle Crown & 7-Groove Rifling Lands
  const crownGeo = new THREE.RingGeometry(0.18, 0.38, 16);
  crownGeo.rotateY(Math.PI / 2);
  const crownMesh = new THREE.Mesh(crownGeo, bluedBarrelMat);
  crownMesh.position.set(barrelLength / 2 + 0.005, 0, 0);
  barrelGroup.add(crownMesh);

  const boreHoleGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.6, 16);
  boreHoleGeo.rotateZ(Math.PI / 2);
  const boreHoleMesh = new THREE.Mesh(boreHoleGeo, boreInteriorMat);
  boreHoleMesh.position.set(barrelLength / 2 - 0.25, 0, 0);
  barrelGroup.add(boreHoleMesh);

  // German Silver / Brass Bead Front Sight Post
  const sightBase = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.08), bluedBarrelMat);
  sightBase.position.set(barrelLength / 2 - 0.4, 0.44, 0);
  barrelGroup.add(sightBase);

  const sightBead = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.16, 8), polishedBrassMat);
  sightBead.position.set(barrelLength / 2 - 0.4, 0.54, 0);
  barrelGroup.add(sightBead);

  // Heavy Forged Barrel Under-Lug (Attaches barrel to cylinder arbor)
  const lugGeo = new THREE.BoxGeometry(1.6, 0.95, 0.76);
  const lugMesh = new THREE.Mesh(lugGeo, caseHardenedMat);
  lugMesh.position.set(-barrelLength / 2 + 0.8, -0.42, 0);
  lugMesh.castShadow = true;
  barrelGroup.add(lugMesh);

  // Transverse Takedown Wedge Key Slot & Retainer Spring
  const wedgeSlot = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.22, 0.82), boreInteriorMat);
  wedgeSlot.position.set(-barrelLength / 2 + 0.95, -0.32, 0);
  barrelGroup.add(wedgeSlot);

  const wedgeKey = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.18, 0.98), bluedBarrelMat);
  wedgeKey.position.set(-barrelLength / 2 + 0.95, -0.32, 0.05);
  barrelGroup.add(wedgeKey);

  rootGroup.add(barrelGroup);

  // --- 3. ARTICULATED CREEPING LOADING LEVER & RAMMER (1839 Paterson Patent Addendum) ---
  const loadingLeverGroup = new THREE.Group();
  loadingLeverGroup.position.set(2.4, 0.05, 0);

  const leverHandleGeo = new THREE.CylinderGeometry(0.065, 0.085, 4.4, 12);
  leverHandleGeo.rotateZ(Math.PI / 2);
  const leverHandle = new THREE.Mesh(leverHandleGeo, caseHardenedMat);
  leverHandle.position.set(0.6, -0.15, 0);
  loadingLeverGroup.add(leverHandle);

  // Hinged Fulcrum Linkage
  const leverFulcrum = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.32, 12),
    polishedBrassMat,
  );
  leverFulcrum.position.set(-1.4, 0.05, 0);
  loadingLeverGroup.add(leverFulcrum);

  // Reciprocating Rammer Plunger (aligned with 6 o'clock cylinder chamber)
  const rammerPlunger = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.16, 1.8, 12),
    bluedBarrelMat,
  );
  rammerPlunger.rotateZ(Math.PI / 2);
  rammerPlunger.position.set(-1.8, 0.45, 0);
  loadingLeverGroup.add(rammerPlunger);

  // Under-barrel Lever Retention Catch Clip
  const leverCatch = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.22, 0.16), bluedBarrelMat);
  leverCatch.position.set(2.5, 0.08, 0);
  loadingLeverGroup.add(leverCatch);

  rootGroup.add(loadingLeverGroup);

  // --- 4. REVOLVING 5-CHAMBER CYLINDER (US 138 Fig. 2 & 3) ---
  const cylinderGroup = new THREE.Group();
  cylinderGroup.position.set(-0.95, 0.65, 0);

  const cylinderLength = 2.4;
  const cylinderRadius = 1.15;

  // Main Fluted & Engraved Cylinder Body
  const cylinderBodyGeo = new THREE.CylinderGeometry(
    cylinderRadius,
    cylinderRadius,
    cylinderLength,
    36,
  );
  cylinderBodyGeo.rotateZ(Math.PI / 2);
  const cylinderBody = new THREE.Mesh(cylinderBodyGeo, engravedCylinderMat);
  cylinderBody.castShadow = true;
  cylinderBody.receiveShadow = true;
  cylinderGroup.add(cylinderBody);

  // Front Chamfer Bevel Ring
  const chamferRingGeo = new THREE.CylinderGeometry(
    cylinderRadius * 0.94,
    cylinderRadius,
    0.15,
    36,
  );
  chamferRingGeo.rotateZ(Math.PI / 2);
  const chamferRing = new THREE.Mesh(chamferRingGeo, bluedBarrelMat);
  chamferRing.position.set(cylinderLength / 2 - 0.07, 0, 0);
  cylinderGroup.add(chamferRing);

  // Rear Ratchet Indexing Star (5-Tooth Steel Cam for Hand Pawl)
  const ratchetGeo = new THREE.CylinderGeometry(0.48, 0.52, 0.28, 10);
  ratchetGeo.rotateZ(Math.PI / 2);
  const ratchetStar = new THREE.Mesh(ratchetGeo, caseHardenedMat);
  ratchetStar.position.set(-cylinderLength / 2 - 0.14, 0, 0);
  cylinderGroup.add(ratchetStar);

  // 5 Chamber Bores, Flutes, Locking Notches, and Percussion Nipples
  const chamberCount = 5;
  const chamberPitchRadius = 0.68;

  for (let c = 0; c < chamberCount; c++) {
    const theta = (c * Math.PI * 2) / chamberCount;
    const cy = Math.cos(theta) * chamberPitchRadius;
    const cz = Math.sin(theta) * chamberPitchRadius;

    // Bored Powder & Ball Chamber (.36 caliber)
    const chamberGeo = new THREE.CylinderGeometry(0.24, 0.24, cylinderLength + 0.02, 16);
    chamberGeo.rotateZ(Math.PI / 2);
    const chamberMesh = new THREE.Mesh(chamberGeo, boreInteriorMat);
    chamberMesh.position.set(0.01, cy, cz);
    cylinderGroup.add(chamberMesh);

    // Rear Recessed Nipple Well
    const nippleWellGeo = new THREE.CylinderGeometry(0.22, 0.16, 0.35, 12);
    nippleWellGeo.rotateZ(Math.PI / 2);
    const nippleWell = new THREE.Mesh(nippleWellGeo, boreInteriorMat);
    nippleWell.position.set(-cylinderLength / 2 + 0.1, cy, cz);
    cylinderGroup.add(nippleWell);

    // Threaded Hardened Steel Percussion Nipple Cone
    const nippleGeo = new THREE.CylinderGeometry(0.065, 0.09, 0.32, 10);
    nippleGeo.rotateZ(Math.PI / 2);
    const nippleCone = new THREE.Mesh(nippleGeo, caseHardenedMat);
    nippleCone.position.set(-cylinderLength / 2 - 0.08, cy, cz);
    cylinderGroup.add(nippleCone);

    // Primed Copper Percussion Cap (seated on nipple)
    const capGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.18, 10);
    capGeo.rotateZ(Math.PI / 2);
    const capMesh = new THREE.Mesh(capGeo, percussionCapMat);
    capMesh.position.set(-cylinderLength / 2 - 0.12, cy, cz);
    cylinderGroup.add(capMesh);

    // Fluted Scallop Grooves Between Chambers
    const fluteTheta = theta + Math.PI / chamberCount;
    const fy = Math.cos(fluteTheta) * (cylinderRadius + 0.02);
    const fz = Math.sin(fluteTheta) * (cylinderRadius + 0.02);
    const fluteGeo = new THREE.CylinderGeometry(0.26, 0.26, cylinderLength * 0.7, 12);
    fluteGeo.rotateZ(Math.PI / 2);
    const fluteMesh = new THREE.Mesh(fluteGeo, bluedBarrelMat);
    fluteMesh.position.set(0, fy, fz);
    cylinderGroup.add(fluteMesh);

    // Cylinder Locking Stop Notches (Rectangular detents for cylinder bolt)
    const notchGeo = new THREE.BoxGeometry(0.22, 0.09, 0.18);
    const notchMesh = new THREE.Mesh(notchGeo, boreInteriorMat);
    notchMesh.position.set(
      cylinderLength * 0.28,
      Math.cos(theta) * (cylinderRadius + 0.01),
      Math.sin(theta) * (cylinderRadius + 0.01),
    );
    cylinderGroup.add(notchMesh);
  }

  rootGroup.add(cylinderGroup);

  // --- 5. CENTER HARDENED ARBOR AXIS PIN & CYLINDER BUSHING ---
  const arborGeo = new THREE.CylinderGeometry(0.22, 0.22, 5.2, 20);
  arborGeo.rotateZ(Math.PI / 2);
  const arborPin = new THREE.Mesh(arborGeo, caseHardenedMat);
  arborPin.position.set(0.2, 0.65, 0);
  rootGroup.add(arborPin);

  // --- 6. CASE-HARDENED OPEN-TOP RECEIVER FRAME (US 138 Fig. 4) ---
  const frameGroup = new THREE.Group();
  frameGroup.position.set(-2.4, 0.35, 0);

  // Lower Frame Bed (houses hand pawl, mainspring, and trigger mortise)
  const lowerBedGeo = new THREE.BoxGeometry(2.4, 1.4, 0.95);
  const lowerBed = new THREE.Mesh(lowerBedGeo, caseHardenedMat);
  lowerBed.position.set(0, -0.3, 0);
  lowerBed.castShadow = true;
  frameGroup.add(lowerBed);

  // Curved Recoil Shield & Cap Loading Cutout Channel
  const shieldGeo = new THREE.SphereGeometry(1.35, 32, 24, 0, Math.PI, 0, Math.PI / 2);
  shieldGeo.rotateY(Math.PI / 2);
  const recoilShield = new THREE.Mesh(shieldGeo, caseHardenedMat);
  recoilShield.position.set(0.15, 0.3, 0);
  recoilShield.castShadow = true;
  frameGroup.add(recoilShield);

  // Percussion Capping Loading Cutout (Right-hand recoil shield notch)
  const capCutout = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.5, 0.45), boreInteriorMat);
  capCutout.position.set(0.25, 0.3, 0.65);
  frameGroup.add(capCutout);

  // Frame Screws & Pivot Pins
  const screwGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.02, 12);
  for (let s = 0; s < 3; s++) {
    const frameScrew = new THREE.Mesh(screwGeo, bluedBarrelMat);
    frameScrew.position.set(-0.7 + s * 0.6, -0.45 + (s % 2) * 0.35, 0);
    frameGroup.add(frameScrew);
  }

  rootGroup.add(frameGroup);

  // --- 7. CONTOURED AMERICAN BLACK WALNUT GRIP & BRASS BACKSTRAP ---
  const gripGroup = new THREE.Group();
  gripGroup.position.set(-3.7, -0.9, 0);

  // Contoured Flared Walnut Grip Handle (Plowhandle profile)
  const gripShape = new THREE.Shape();
  gripShape.moveTo(0, 1.2);
  gripShape.bezierCurveTo(-0.6, 0.6, -1.2, -1.2, -1.1, -2.2); // back curve
  gripShape.bezierCurveTo(-0.8, -2.6, 0.4, -2.7, 0.8, -2.5); // butt curve
  gripShape.bezierCurveTo(0.9, -1.6, 0.5, -0.2, 0.7, 0.8); // front frontstrap curve
  gripShape.closePath();

  const extrudeSettings = {
    depth: 0.95,
    bevelEnabled: true,
    bevelSegments: 6,
    steps: 2,
    bevelSize: 0.18,
    bevelThickness: 0.18,
  };

  const gripGeometry = new THREE.ExtrudeGeometry(gripShape, extrudeSettings);
  gripGeometry.center();
  const gripMesh = new THREE.Mesh(gripGeometry, walnutGripMat);
  gripMesh.castShadow = true;
  gripGroup.add(gripMesh);

  // Solid Brass Backstrap & Butt Plate
  const backstrapGeo = new THREE.BoxGeometry(0.18, 3.8, 1.0);
  const backstrap = new THREE.Mesh(backstrapGeo, polishedBrassMat);
  backstrap.position.set(-0.82, -0.6, 0);
  backstrap.rotation.z = 0.28;
  gripGroup.add(backstrap);

  const buttPlateGeo = new THREE.BoxGeometry(1.6, 0.22, 1.15);
  const buttPlate = new THREE.Mesh(buttPlateGeo, polishedBrassMat);
  buttPlate.position.set(-0.1, -2.0, 0);
  buttPlate.rotation.z = -0.15;
  gripGroup.add(buttPlate);

  rootGroup.add(gripGroup);

  // --- 8. HISTORIC PATERSON FOLDING TRIGGER (US 138 Fig. 5) ---
  // The trigger is hidden inside the frame mortise and drops down only when cocked!
  const triggerGroup = new THREE.Group();
  triggerGroup.position.set(-2.0, -0.4, 0);

  const triggerBody = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.75, 0.14), bluedBarrelMat);
  triggerBody.position.set(0, -0.25, 0);
  triggerGroup.add(triggerBody);

  const triggerCurvedTip = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.14, 12),
    polishedBrassMat,
  );
  triggerCurvedTip.position.set(0.04, -0.6, 0);
  triggerGroup.add(triggerCurvedTip);

  rootGroup.add(triggerGroup);

  // --- 9. SINGLE-ACTION HAMMER & CHECKERED SPUR (US 138 Fig. 6) ---
  const hammerGroup = new THREE.Group();
  hammerGroup.position.set(-3.1, 1.15, 0);

  const hammerBaseGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.32, 16);
  const hammerBase = new THREE.Mesh(hammerBaseGeo, caseHardenedMat);
  hammerGroup.add(hammerBase);

  // Gracefully Curved Hammer Body & Nose Striker
  const hammerSpurShape = new THREE.Shape();
  hammerSpurShape.moveTo(0, 0);
  hammerSpurShape.lineTo(0.3, 0.85); // front striker face
  hammerSpurShape.bezierCurveTo(0.35, 1.3, 0.15, 1.6, -0.35, 1.75); // curved thumb spur
  hammerSpurShape.bezierCurveTo(-0.7, 1.6, -0.5, 1.1, -0.2, 0.5);
  hammerSpurShape.closePath();

  const hammerExtrude = new THREE.ExtrudeGeometry(hammerSpurShape, {
    depth: 0.3,
    bevelEnabled: true,
    bevelSegments: 4,
    bevelSize: 0.06,
    bevelThickness: 0.06,
  });
  hammerExtrude.center();
  const hammerMesh = new THREE.Mesh(hammerExtrude, caseHardenedMat);
  hammerMesh.position.set(0, 0.65, 0);
  hammerMesh.castShadow = true;
  hammerGroup.add(hammerMesh);

  // Striker Nose Channel (strikes copper percussion cap through recoil shield)
  const strikerNose = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.14, 0.45, 8),
    bluedBarrelMat,
  );
  strikerNose.rotateZ(Math.PI / 2);
  strikerNose.position.set(0.42, 0.88, 0);
  hammerGroup.add(strikerNose);

  rootGroup.add(hammerGroup);

  // --- 10. INTERNAL LOCKWORK CUTAWAY MECHANISM (Pawl, Bolt, Mainspring) ---
  const lockworkCutawayGroup = new THREE.Group();
  lockworkCutawayGroup.position.set(-2.4, 0.25, 0);

  // Spring-Loaded Hand Pawl (rises to rotate ratchet star 60° on cocking)
  const handPawl = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.95, 0.08), polishedBrassMat);
  handPawl.position.set(0.45, 0.15, 0.18);
  handPawl.rotation.z = -0.32;
  lockworkCutawayGroup.add(handPawl);

  // Cylinder Locking Bolt Detent
  const boltDetent = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.14, 0.12), bluedBarrelMat);
  boltDetent.position.set(0.4, -0.45, 0);
  lockworkCutawayGroup.add(boltDetent);

  // Flat Laminated Steel Mainspring
  const mainspringGeo = new THREE.TorusGeometry(1.6, 0.07, 8, 20, Math.PI * 0.45);
  mainspringGeo.rotateZ(Math.PI * 0.85);
  const mainspring = new THREE.Mesh(mainspringGeo, bluedBarrelMat);
  mainspring.position.set(-0.8, -0.6, 0);
  lockworkCutawayGroup.add(mainspring);

  lockworkCutawayGroup.visible = false;
  rootGroup.add(lockworkCutawayGroup);

  // --- 11. MUZZLE BLAST FLARE, EXPANDING SMOKE & INCANDESCENT SPARKS ---
  const blastGroup = new THREE.Group();
  blastGroup.position.set(
    barrelGroup.position.x + barrelLength / 2 + 0.1,
    barrelGroup.position.y,
    0,
  );

  // Incandescent Muzzle Flash Cone & Flame Corona
  const blastGeo = new THREE.ConeGeometry(0.9, 3.2, 16);
  blastGeo.rotateZ(-Math.PI / 2);
  const blastMat = new THREE.MeshBasicMaterial({
    color: 0xffaa22,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
  });
  const blastMesh = new THREE.Mesh(blastGeo, blastMat);
  blastMesh.position.set(1.5, 0, 0);
  blastGroup.add(blastMesh);

  // Expanding Black Powder Smoke Puff Cloud
  const smokeCount = 45;
  const smokeGeo = new THREE.BufferGeometry();
  const smokePositions = new Float32Array(smokeCount * 3);
  for (let s = 0; s < smokeCount; s++) {
    smokePositions[s * 3] = 0.5 + Math.random() * 3.5;
    smokePositions[s * 3 + 1] = (Math.random() - 0.5) * 1.8;
    smokePositions[s * 3 + 2] = (Math.random() - 0.5) * 1.8;
  }
  smokeGeo.setAttribute("position", new THREE.BufferAttribute(smokePositions, 3));
  const smokeMat = new THREE.PointsMaterial({
    color: 0xd4d8df,
    size: 0.9,
    transparent: true,
    opacity: 0,
    blending: THREE.NormalBlending,
  });
  const smokeMesh = new THREE.Points(smokeGeo, smokeMat);
  blastGroup.add(smokeMesh);

  // Burning Charcoal & Potassium Nitrate Spark Trails
  const sparkCount = 35;
  const sparkGeo = new THREE.BufferGeometry();
  const sparkPos = new Float32Array(sparkCount * 3);
  for (let k = 0; k < sparkCount; k++) {
    sparkPos[k * 3] = (Math.random() - 0.5) * 4;
    sparkPos[k * 3 + 1] = (Math.random() - 0.5) * 2;
    sparkPos[k * 3 + 2] = (Math.random() - 0.5) * 2;
  }
  sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3));
  const sparkMat = new THREE.PointsMaterial({
    color: 0xffe066,
    size: 0.22,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
  });
  const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
  blastGroup.add(sparkPoints);

  rootGroup.add(blastGroup);

  return {
    group: rootGroup,
    cylinderGroup,
    hammerGroup,
    triggerGroup,
    loadingLeverGroup,
    rammerPlunger,
    blastGroup,
    blastMesh,
    smokeMesh,
    sparkPoints,
    lockworkCutawayGroup,
    textures,
  };
}
