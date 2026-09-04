/**
 * hopkinsPotashModel.ts
 *
 * Source-bounded procedural 3D reader for Samuel Hopkins's 1790 Pot & Pearl Ash process
 * (US Patent No. 1 [X1] - "Improvement in the Making of Pot Ash and Pearl Ash").
 *
 * The one-sheet grant has no technical drawing or apparatus dimensions. This
 * normalized teaching topology therefore preserves only the five printed
 * operations and makes every handoff physically legible; it is not presented
 * as a reconstruction of an undocumented historic installation.
 */

import * as THREE from "three";
import {
  type HopkinsKinematicPhases,
  type HopkinsPotashControls,
  type HopkinsPotashOutputs,
  stepHopkinsPotash,
} from "@/physics/hopkinsPotashKernel";

export interface HopkinsPotashModelNodes {
  rootGroup: THREE.Group;
  baseplate: THREE.Mesh;
  furnaceGroup: THREE.Group;
  furnaceBody: THREE.Mesh;
  furnaceArch: THREE.Mesh;
  furnaceChimney: THREE.Mesh;
  ashBed: THREE.Mesh;
  flameMesh: THREE.Mesh;
  leachGroup: THREE.Group;
  leachTub: THREE.Mesh;
  leachHoops: THREE.Mesh[];
  waterSpout: THREE.Mesh;
  leyFluid: THREE.Mesh;
  settlingGroup: THREE.Group;
  settlingVat: THREE.Mesh;
  settledLeySurface: THREE.Mesh;
  settledDross: THREE.Mesh;
  potGroup: THREE.Group;
  evapPot: THREE.Mesh;
  boilingLiquor: THREE.Mesh;
  pearlAshCrystals: THREE.Mesh[];
  potHearth: THREE.Mesh;
  fluxGroup: THREE.Group;
  fluxingHearth: THREE.Mesh;
  fluxingPot: THREE.Mesh;
  fusedPotash: THREE.Mesh;
  solidTransferTrough: THREE.Mesh;
  leachToSettlerPipe: THREE.Mesh;
  settlerToEvaporatorPipe: THREE.Mesh;
  pearlAshTransferTray: THREE.Mesh;
}

export interface HopkinsPotashMaterials {
  cobblestone: THREE.MeshStandardMaterial;
  brickMasonry: THREE.MeshStandardMaterial;
  furnaceInterior: THREE.MeshStandardMaterial;
  ashGlow: THREE.MeshStandardMaterial;
  oakWood: THREE.MeshStandardMaterial;
  forgedIron: THREE.MeshStandardMaterial;
  castIron: THREE.MeshStandardMaterial;
  alkalineLey: THREE.MeshPhysicalMaterial | THREE.MeshStandardMaterial;
  pearlAsh: THREE.MeshStandardMaterial;
  potashSolid: THREE.MeshStandardMaterial;
  flameGlow: THREE.MeshBasicMaterial;
}

export interface HopkinsPotashModelResult {
  rootGroup: THREE.Group;
  nodes: HopkinsPotashModelNodes;
  materials: HopkinsPotashMaterials;
  dispose: () => void;
}

/**
 * Deterministic unit noise for procedural grain generation.
 */
function deterministicUnit(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Procedural red-brick masonry texture with mortar joints.
 */
function createBrickTexture(width = 512, height = 512): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#8a3324";
  ctx.fillRect(0, 0, width, height);

  const rowHeight = 32;
  const brickWidth = 64;
  ctx.strokeStyle = "#c4b5a5";
  ctx.lineWidth = 3;

  for (let y = 0; y < height; y += rowHeight) {
    const row = Math.floor(y / rowHeight);
    const offsetX = (row % 2) * (brickWidth / 2);

    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();

    for (let x = -brickWidth; x < width + brickWidth; x += brickWidth) {
      const bx = x + offsetX;
      ctx.beginPath();
      ctx.moveTo(bx, y);
      ctx.lineTo(bx, y + rowHeight);
      ctx.stroke();

      // Brick surface variations
      const shade = deterministicUnit(row * 100 + x) * 40 - 20;
      ctx.fillStyle = `rgba(${138 + shade}, ${51 + shade / 2}, ${36 + shade / 3}, 0.3)`;
      ctx.fillRect(bx + 2, y + 2, brickWidth - 4, rowHeight - 4);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

/**
 * Procedural oak stave wood texture.
 */
function createOakTexture(width = 512, height = 512): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#6b4423";
  ctx.fillRect(0, 0, width, height);

  // Wood grain lines
  ctx.strokeStyle = "#4a2e16";
  for (let i = 0; i < 60; i++) {
    const y = deterministicUnit(i) * height;
    ctx.lineWidth = 1 + deterministicUnit(i + 5) * 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(
      width * 0.33,
      y + (deterministicUnit(i + 10) * 20 - 10),
      width * 0.66,
      y + (deterministicUnit(i + 20) * 20 - 10),
      width,
      y + (deterministicUnit(i + 30) * 10 - 5),
    );
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Build a normalized, source-bounded process topology for the printed grant.
 */
export function buildHopkinsPotashModel(): HopkinsPotashModelResult {
  const rootGroup = new THREE.Group();
  rootGroup.name = "source-bounded-hopkins-potash-process-reader";

  const brickTex = createBrickTexture();
  const oakTex = createOakTexture();

  // Materials
  const cobblestone = new THREE.MeshStandardMaterial({
    color: 0x4a4a48,
    roughness: 0.92,
    metalness: 0.05,
  });

  const brickMasonry = new THREE.MeshStandardMaterial({
    ...(brickTex ? { map: brickTex } : {}),
    color: 0xa8432e,
    roughness: 0.85,
    metalness: 0.08,
  });

  const furnaceInterior = new THREE.MeshStandardMaterial({
    color: 0x241410,
    roughness: 0.95,
    metalness: 0.02,
  });

  const ashGlow = new THREE.MeshStandardMaterial({
    color: 0xff6622,
    emissive: 0xcc3300,
    emissiveIntensity: 0.8,
    roughness: 0.9,
  });

  const oakWood = new THREE.MeshStandardMaterial({
    ...(oakTex ? { map: oakTex } : {}),
    color: 0x85522e,
    roughness: 0.75,
    metalness: 0.05,
  });

  const forgedIron = new THREE.MeshStandardMaterial({
    color: 0x2b2b2b,
    roughness: 0.6,
    metalness: 0.75,
  });

  const castIron = new THREE.MeshStandardMaterial({
    color: 0x383838,
    roughness: 0.7,
    metalness: 0.65,
  });

  const alkalineLey = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.2,
    metalness: 0.1,
    transparent: true,
    opacity: 0.85,
  });

  const pearlAsh = new THREE.MeshStandardMaterial({
    color: 0xf3f4f6,
    roughness: 0.4,
    metalness: 0.15,
  });

  const potashSolid = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    roughness: 0.35,
    metalness: 0.2,
  });

  const flameGlow = new THREE.MeshBasicMaterial({
    color: 0xff8811,
    wireframe: false,
  });

  // 1. Foundation Baseplate
  const baseGeom = new THREE.BoxGeometry(5.6, 0.2, 3.2);
  const baseplate = new THREE.Mesh(baseGeom, cobblestone);
  baseplate.name = "shared-supported-process-foundation";
  baseplate.position.set(0.1, -0.1, 0);
  baseplate.receiveShadow = true;
  rootGroup.add(baseplate);

  // ════════ 2. BURN RAW ASHES IN A FURNACE (printed operation 1) ════════
  const furnaceGroup = new THREE.Group();
  furnaceGroup.name = "operation-1-burn-raw-ashes";
  furnaceGroup.position.set(-1.8, 0, 0);

  // An open-front teaching section keeps the supported hearth visible instead
  // of burying it inside the former opaque decorative cuboid.
  const fBodyGeom = new THREE.BoxGeometry(1.2, 1.2, 0.16);
  const furnaceBody = new THREE.Mesh(fBodyGeom, brickMasonry);
  furnaceBody.name = "supported-furnace-back-wall";
  furnaceBody.position.set(0, 0.6, -0.62);
  furnaceBody.castShadow = true;
  furnaceGroup.add(furnaceBody);
  const furnaceSideGeometry = new THREE.BoxGeometry(0.16, 1.2, 1.4);
  for (const x of [-0.52, 0.52]) {
    const sideWall = new THREE.Mesh(furnaceSideGeometry, brickMasonry);
    sideWall.name = "supported-furnace-side-wall";
    sideWall.position.set(x, 0.6, 0);
    furnaceGroup.add(sideWall);
  }
  const furnaceFloor = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.18, 1.4), brickMasonry);
  furnaceFloor.name = "supported-furnace-hearth-floor";
  furnaceFloor.position.set(0, 0.09, 0);
  furnaceGroup.add(furnaceFloor);

  // Arched Reverberatory Roof
  const fArchGeom = new THREE.CylinderGeometry(0.7, 0.7, 1.4, 16, 1, false, 0, Math.PI);
  fArchGeom.rotateZ(Math.PI / 2);
  fArchGeom.rotateY(Math.PI / 2);
  const furnaceArch = new THREE.Mesh(fArchGeom, brickMasonry);
  furnaceArch.name = "removable-teaching-roof";
  furnaceArch.position.set(0, 1.2, 0);
  furnaceGroup.add(furnaceArch);

  // Chimney
  const chimGeom = new THREE.BoxGeometry(0.35, 1.4, 0.35);
  const furnaceChimney = new THREE.Mesh(chimGeom, brickMasonry);
  furnaceChimney.position.set(-0.35, 1.8, 0);
  furnaceChimney.castShadow = true;
  furnaceGroup.add(furnaceChimney);

  // Furnace Hearth & Glowing Ash Bed
  const ashGeom = new THREE.BoxGeometry(0.8, 0.15, 0.9);
  const ashBed = new THREE.Mesh(ashGeom, ashGlow);
  ashBed.name = "supported-raw-ash-bed";
  ashBed.position.set(0.15, 0.3, 0.18);
  furnaceGroup.add(ashBed);

  // Procedural Flame Cone
  const flameGeom = new THREE.ConeGeometry(0.2, 0.45, 8);
  const flameMesh = new THREE.Mesh(flameGeom, flameGlow);
  flameMesh.name = "supported-furnace-flame-reader";
  flameMesh.position.set(-0.25, 0.35, 0.18);
  furnaceGroup.add(flameMesh);

  rootGroup.add(furnaceGroup);

  // ════════ 3. DISSOLVE AND BOIL BURNT ASHES IN WATER (printed operation 2) ════════
  const leachGroup = new THREE.Group();
  leachGroup.name = "operation-2-dissolve-and-boil-burnt-ashes";
  leachGroup.position.set(-0.65, 0, 0);

  // Wooden Staved Tub
  const tubGeom = new THREE.CylinderGeometry(0.48, 0.42, 0.95, 20);
  const leachTub = new THREE.Mesh(tubGeom, oakWood);
  leachTub.name = "supported-leaching-vat";
  leachTub.position.set(0, 0.475, 0);
  leachTub.castShadow = true;
  leachGroup.add(leachTub);

  // Forged Iron Retaining Hoops
  const leachHoops: THREE.Mesh[] = [];
  const hoopGeom = new THREE.TorusGeometry(0.46, 0.015, 8, 24);
  hoopGeom.rotateX(Math.PI / 2);

  [-0.3, 0, 0.3].forEach((yOff) => {
    const hoop = new THREE.Mesh(hoopGeom, forgedIron);
    hoop.position.set(0, 0.475 + yOff, 0);
    leachGroup.add(hoop);
    leachHoops.push(hoop);
  });

  // Hot Water Feeder Spout
  const spoutGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.6, 12);
  const waterSpout = new THREE.Mesh(spoutGeom, forgedIron);
  waterSpout.name = "supported-water-downcomer";
  waterSpout.position.set(0, 1.22, 0);
  leachGroup.add(waterSpout);
  const supplyArmGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.65, 12);
  supplyArmGeometry.rotateZ(Math.PI / 2);
  const supplyArm = new THREE.Mesh(supplyArmGeometry, forgedIron);
  supplyArm.name = "attached-water-supply-arm";
  supplyArm.position.set(-0.28, 1.5, 0);
  leachGroup.add(supplyArm);
  const supplyStand = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5, 12), forgedIron);
  supplyStand.name = "supported-water-supply-stand";
  supplyStand.position.set(-0.6, 0.75, 0);
  leachGroup.add(supplyStand);

  // Alkaline Ley Fluid
  const leyGeom = new THREE.CylinderGeometry(0.43, 0.43, 0.1, 16);
  const leyFluid = new THREE.Mesh(leyGeom, alkalineLey);
  leyFluid.name = "visible-leaching-ley-surface";
  leyFluid.position.set(0, 0.96, 0);
  leachGroup.add(leyFluid);

  rootGroup.add(leachGroup);

  // ════════ 4. DRAW-OFF & SETTLING VAT (printed operation 3) ════════
  const settlingGroup = new THREE.Group();
  settlingGroup.name = "operation-3-draw-off-and-settle-ley";
  settlingGroup.position.set(0.32, 0, 0);
  const settlingVat = new THREE.Mesh(new THREE.CylinderGeometry(0.37, 0.34, 0.72, 20), oakWood);
  settlingVat.name = "supported-settling-vat";
  settlingVat.position.y = 0.36;
  settlingGroup.add(settlingVat);
  for (const y of [0.14, 0.57]) {
    const hoop = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.012, 8, 24), forgedIron);
    hoop.rotation.x = Math.PI / 2;
    hoop.position.y = y;
    settlingGroup.add(hoop);
  }
  const settledDross = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.32, 0.06, 20),
    furnaceInterior,
  );
  settledDross.name = "supported-settled-dross-layer";
  settledDross.position.y = 0.12;
  settlingGroup.add(settledDross);
  const settledLeySurface = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34, 0.34, 0.05, 20),
    alkalineLey,
  );
  settledLeySurface.name = "visible-settled-ley-surface";
  settledLeySurface.position.y = 0.73;
  settlingGroup.add(settledLeySurface);
  rootGroup.add(settlingGroup);

  // ════════ 5. BOIL SETTLED LEY INTO PEARL ASH (printed operation 4) ════════
  const potGroup = new THREE.Group();
  potGroup.name = "operation-4-boil-ley-into-pearl-ash";
  potGroup.position.set(1.25, 0, 0);

  // Stone Fire Hearth Arch
  const hearthGeom = new THREE.CylinderGeometry(0.55, 0.6, 0.5, 16, 1, true);
  const potHearth = new THREE.Mesh(hearthGeom, brickMasonry);
  potHearth.position.set(0, 0.25, 0);
  potGroup.add(potHearth);

  // Hemispherical Cast-Iron Pot
  const potGeom = new THREE.SphereGeometry(0.45, 20, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
  const evapPot = new THREE.Mesh(potGeom, castIron);
  evapPot.position.set(0, 0.5, 0);
  evapPot.castShadow = true;
  potGroup.add(evapPot);

  // Boiling Liquor Liquid Surface
  const boilGeom = new THREE.CircleGeometry(0.42, 16);
  boilGeom.rotateX(-Math.PI / 2);
  const boilingLiquor = new THREE.Mesh(boilGeom, alkalineLey);
  boilingLiquor.position.set(0, 0.48, 0);
  potGroup.add(boilingLiquor);

  // Pearl Ash Crystals
  const pearlAshCrystals: THREE.Mesh[] = [];
  const crystalGeom = new THREE.DodecahedronGeometry(0.04);

  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const r = 0.15 + deterministicUnit(i) * 0.2;
    const crystal = new THREE.Mesh(crystalGeom, pearlAsh);
    crystal.position.set(Math.cos(angle) * r, 0.49, Math.sin(angle) * r);
    crystal.rotation.set(
      deterministicUnit(i + 1),
      deterministicUnit(i + 2),
      deterministicUnit(i + 3),
    );
    potGroup.add(crystal);
    pearlAshCrystals.push(crystal);
  }

  rootGroup.add(potGroup);

  // ════════ 6. OPTIONAL FLUXING INTO POT ASH ════════
  const fluxGroup = new THREE.Group();
  fluxGroup.name = "optional-operation-5-flux-pearl-ash-into-pot-ash";
  fluxGroup.position.set(2.18, 0, 0);

  // The grant says only “fluxing”; it does not support the former cast-ingot
  // mold. Show a supported heated pot and fused phase without inventing an
  // undocumented product shape.
  const fluxingHearth = new THREE.Mesh(
    new THREE.CylinderGeometry(0.45, 0.5, 0.42, 20, 1, true),
    brickMasonry,
  );
  fluxingHearth.name = "supported-fluxing-hearth";
  fluxingHearth.position.y = 0.21;
  fluxGroup.add(fluxingHearth);
  const fluxingPot = new THREE.Mesh(
    new THREE.SphereGeometry(0.36, 20, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
    castIron,
  );
  fluxingPot.name = "supported-fluxing-pot";
  fluxingPot.position.y = 0.62;
  fluxGroup.add(fluxingPot);
  const fusedPotashGeometry = new THREE.CircleGeometry(0.33, 20);
  fusedPotashGeometry.rotateX(-Math.PI / 2);
  const fusedPotash = new THREE.Mesh(fusedPotashGeometry, potashSolid);
  fusedPotash.name = "visible-fused-pot-ash-surface";
  fusedPotash.position.y = 0.61;
  fluxGroup.add(fusedPotash);

  rootGroup.add(fluxGroup);

  // Every operation is supported by the shared foundation. The following
  // normalized handoff paths connect material stages without pretending that
  // the grant specified continuous piping or automatic transfer machinery.
  const solidTransferTrough = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.08, 0.28), forgedIron);
  solidTransferTrough.name = "normalized-manual-ash-transfer-trough";
  solidTransferTrough.position.set(-1.21, 0.98, 0.18);
  rootGroup.add(solidTransferTrough);

  function pipeBetween(start: THREE.Vector3, end: THREE.Vector3, name: string): THREE.Mesh {
    const midpoint = start.clone().add(end).multiplyScalar(0.5);
    const direction = end.clone().sub(start);
    const pipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, direction.length(), 12),
      forgedIron,
    );
    pipe.name = name;
    pipe.position.copy(midpoint);
    pipe.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    return pipe;
  }

  const leachToSettlerPipe = pipeBetween(
    new THREE.Vector3(-0.29, 0.72, 0.28),
    new THREE.Vector3(0.09, 0.66, 0.28),
    "normalized-leach-to-settler-draw-off-pipe",
  );
  rootGroup.add(leachToSettlerPipe);
  const settlerToEvaporatorPipe = pipeBetween(
    new THREE.Vector3(0.55, 0.64, 0.28),
    new THREE.Vector3(0.89, 0.49, 0.28),
    "normalized-settler-to-evaporator-pipe",
  );
  rootGroup.add(settlerToEvaporatorPipe);
  const pearlAshTransferTray = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.07, 0.24), forgedIron);
  pearlAshTransferTray.name = "normalized-manual-pearl-ash-transfer-tray";
  pearlAshTransferTray.position.set(1.72, 0.49, 0.1);
  pearlAshTransferTray.rotation.z = -Math.atan2(0.12, 0.93);
  rootGroup.add(pearlAshTransferTray);

  const nodes: HopkinsPotashModelNodes = {
    rootGroup,
    baseplate,
    furnaceGroup,
    furnaceBody,
    furnaceArch,
    furnaceChimney,
    ashBed,
    flameMesh,
    leachGroup,
    leachTub,
    leachHoops,
    waterSpout,
    leyFluid,
    settlingGroup,
    settlingVat,
    settledLeySurface,
    settledDross,
    potGroup,
    evapPot,
    boilingLiquor,
    pearlAshCrystals,
    potHearth,
    fluxGroup,
    fluxingHearth,
    fluxingPot,
    fusedPotash,
    solidTransferTrough,
    leachToSettlerPipe,
    settlerToEvaporatorPipe,
    pearlAshTransferTray,
  };

  const materials: HopkinsPotashMaterials = {
    cobblestone,
    brickMasonry,
    furnaceInterior,
    ashGlow,
    oakWood,
    forgedIron,
    castIron,
    alkalineLey,
    pearlAsh,
    potashSolid,
    flameGlow,
  };

  return {
    rootGroup,
    nodes,
    materials,
    dispose: () => {
      brickTex?.dispose();
      oakTex?.dispose();
      rootGroup.traverse((object) => {
        if (object instanceof THREE.Mesh) object.geometry.dispose();
      });
      Object.values(materials).forEach((m) => {
        m.dispose();
      });
    },
  };
}

/**
 * Animate the 3D apparatus deterministically based on live SI telemetry and simulation time.
 */
export function animateHopkinsPotashModel(
  model: HopkinsPotashModelResult,
  outputsOrControls:
    | HopkinsPotashOutputs
    | (Partial<HopkinsPotashControls> & { isCutaway?: boolean }),
  phasesOrTimeS: HopkinsKinematicPhases | number,
  isCutawayFlag?: boolean,
) {
  const outputs: HopkinsPotashOutputs =
    "roastTempKelvin" in outputsOrControls
      ? outputsOrControls
      : stepHopkinsPotash(outputsOrControls);

  const isCutaway = Boolean(
    "isCutaway" in outputsOrControls ? outputsOrControls.isCutaway : isCutawayFlag,
  );

  const flamePhaseRad =
    typeof phasesOrTimeS === "number"
      ? phasesOrTimeS * outputs.flameDisplayOmegaRadPerS
      : phasesOrTimeS.flamePhaseRad;

  const flameHarmonicPhaseRad =
    typeof phasesOrTimeS === "number"
      ? phasesOrTimeS * outputs.flameHarmonicOmegaRadPerS
      : phasesOrTimeS.flameHarmonicPhaseRad;

  const boilPhaseRad =
    typeof phasesOrTimeS === "number"
      ? phasesOrTimeS * outputs.boilDisplayOmegaRadPerS
      : phasesOrTimeS.boilPhaseRad;

  // 1. Ash bed glow intensity scales with furnace temperature
  const tempFraction = Math.max(0, Math.min(1, (outputs.roastTempKelvin - 773.15) / 450));
  model.materials.ashGlow.emissiveIntensity = 0.4 + tempFraction * 0.8;

  // 2. Flame flicker drains the shared fixed-step phases.
  const flameScaleY = 0.8 + Math.sin(flamePhaseRad) * 0.15 + Math.cos(flameHarmonicPhaseRad) * 0.08;
  model.nodes.flameMesh.scale.set(1, flameScaleY, 1);

  // 3. The cutaway removes the furnace roof and makes the shared wooden walls
  // translucent. Retaining hoops remain visibly wrapped around a vessel wall
  // rather than floating around a hidden mesh.
  model.nodes.furnaceArch.visible = !isCutaway;
  model.nodes.leachTub.visible = true;
  model.nodes.settlingVat.visible = true;
  if (model.materials.oakWood.transparent !== isCutaway) {
    model.materials.oakWood.transparent = isCutaway;
    model.materials.oakWood.depthWrite = !isCutaway;
    model.materials.oakWood.needsUpdate = true;
  }
  model.materials.oakWood.opacity = isCutaway ? 0.42 : 1;

  // 4. Boiling liquor agitation is also replay-pure on the shared phase.
  const boilDisplacement = Math.sin(boilPhaseRad) * 0.005;
  model.nodes.boilingLiquor.position.y = 0.48 + boilDisplacement;

  // 5. Scenario yield controls only the count of visible reader-aid crystals.
  const activeCrystalCount = Math.min(
    12,
    Math.max(2, Math.round((outputs.pearlAshYieldKg / 25) * 12)),
  );
  model.nodes.pearlAshCrystals.forEach((crystal, idx) => {
    crystal.visible = idx < activeCrystalCount;
  });

  // 6. The optional fused phase stays inside its supported pot; there is no
  // invented ingot, mold, or automatic casting motion.
  const fusedScale = Math.min(1, Math.max(0.35, outputs.potashFusedVolumeLiters / 8.5));
  model.nodes.fusedPotash.scale.setScalar(fusedScale);
}
