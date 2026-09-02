/**
 * hopkinsPotashModel.ts
 *
 * Museum-Grade Procedural 3D Model for Samuel Hopkins's 1790 Pot & Pearl Ash Apparatus
 * (US Patent No. 1 [X1] - "Improvement in the Making of Pot Ash and Pearl Ash").
 *
 * Reconstructs the historic 1790 industrial chemical facility:
 * 1. Timber beam foundation with cobblestone floor.
 * 2. Arched brick reverberatory roasting kiln with glowing ash hearth (Stage 1).
 * 3. Coopered wooden lixiviation leaching tub with iron hoops and filter bed (Stage 2).
 * 4. Cast-iron hemispherical evaporating pot with boiling liquor and pearl ash crystals (Stage 3).
 * 5. Smelting forge and iron ingot mold with cast solid potash loaf (Stage 4).
 * 6. Procedural brick, oak wood, cast iron, and crystalline pearl ash textures.
 */

import * as THREE from "three";
import { stepHopkinsPotash } from "@/physics/hopkinsPotashKernel";

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
  potGroup: THREE.Group;
  evapPot: THREE.Mesh;
  boilingLiquor: THREE.Mesh;
  pearlAshCrystals: THREE.Mesh[];
  potHearth: THREE.Mesh;
  fluxGroup: THREE.Group;
  ingotMold: THREE.Mesh;
  potashIngot: THREE.Mesh;
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
 * Build the procedural 3D model of Samuel Hopkins's 1790 Pot & Pearl Ash Facility.
 */
export function buildHopkinsPotashModel(): HopkinsPotashModelResult {
  const rootGroup = new THREE.Group();
  rootGroup.name = "HopkinsPotashApparatus_US1";

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
  const baseGeom = new THREE.BoxGeometry(4.8, 0.2, 3.2);
  const baseplate = new THREE.Mesh(baseGeom, cobblestone);
  baseplate.position.set(0, -0.1, 0);
  baseplate.receiveShadow = true;
  rootGroup.add(baseplate);

  // ════════ 2. REVERBERATORY CALCINING KILN (Stage 1) ════════
  const furnaceGroup = new THREE.Group();
  furnaceGroup.name = "CalciningFurnace_Stage1";
  furnaceGroup.position.set(-1.6, 0, 0);

  // Main furnace rectangular body
  const fBodyGeom = new THREE.BoxGeometry(1.2, 1.2, 1.4);
  const furnaceBody = new THREE.Mesh(fBodyGeom, brickMasonry);
  furnaceBody.position.set(0, 0.6, 0);
  furnaceBody.castShadow = true;
  furnaceGroup.add(furnaceBody);

  // Arched Reverberatory Roof
  const fArchGeom = new THREE.CylinderGeometry(0.7, 0.7, 1.4, 16, 1, false, 0, Math.PI);
  fArchGeom.rotateZ(Math.PI / 2);
  fArchGeom.rotateY(Math.PI / 2);
  const furnaceArch = new THREE.Mesh(fArchGeom, brickMasonry);
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
  ashBed.position.set(0.15, 0.3, 0);
  furnaceGroup.add(ashBed);

  // Procedural Flame Cone
  const flameGeom = new THREE.ConeGeometry(0.2, 0.45, 8);
  const flameMesh = new THREE.Mesh(flameGeom, flameGlow);
  flameMesh.position.set(-0.25, 0.35, 0);
  furnaceGroup.add(flameMesh);

  rootGroup.add(furnaceGroup);

  // ════════ 3. LIXIVIATION LEACHING TUB (Stage 2) ════════
  const leachGroup = new THREE.Group();
  leachGroup.name = "LeachingTub_Stage2";
  leachGroup.position.set(-0.4, 0, 0);

  // Wooden Staved Tub
  const tubGeom = new THREE.CylinderGeometry(0.48, 0.42, 0.95, 20);
  const leachTub = new THREE.Mesh(tubGeom, oakWood);
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
  waterSpout.position.set(0, 1.1, 0);
  leachGroup.add(waterSpout);

  // Alkaline Ley Fluid
  const leyGeom = new THREE.CylinderGeometry(0.43, 0.43, 0.1, 16);
  const leyFluid = new THREE.Mesh(leyGeom, alkalineLey);
  leyFluid.position.set(0, 0.85, 0);
  leachGroup.add(leyFluid);

  rootGroup.add(leachGroup);

  // ════════ 4. EVAPORATING CRYSTALLIZER POT (Stage 3) ════════
  const potGroup = new THREE.Group();
  potGroup.name = "EvaporatingPot_Stage3";
  potGroup.position.set(0.8, 0, 0);

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

  // ════════ 5. FLUXING SMELTER & INGOT MOLD (Stage 4) ════════
  const fluxGroup = new THREE.Group();
  fluxGroup.name = "FluxingIngot_Stage4";
  fluxGroup.position.set(1.8, 0, 0);

  // Iron Ingot Mold
  const moldGeom = new THREE.BoxGeometry(0.5, 0.35, 0.4);
  const ingotMold = new THREE.Mesh(moldGeom, castIron);
  ingotMold.position.set(0, 0.175, 0);
  ingotMold.castShadow = true;
  fluxGroup.add(ingotMold);

  // Solid Cast Potash Loaf
  const ingotGeom = new THREE.BoxGeometry(0.42, 0.28, 0.32);
  const potashIngot = new THREE.Mesh(ingotGeom, potashSolid);
  potashIngot.position.set(0, 0.22, 0);
  fluxGroup.add(potashIngot);

  rootGroup.add(fluxGroup);

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
    potGroup,
    evapPot,
    boilingLiquor,
    pearlAshCrystals,
    potHearth,
    fluxGroup,
    ingotMold,
    potashIngot,
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
  params: {
    roastTempC?: number;
    roastTimeHours?: number;
    ashBatchKg?: number;
    waterTempC?: number;
    isCutaway?: boolean;
  },
  timeS: number,
) {
  const pot = stepHopkinsPotash({
    roastTempC: params.roastTempC,
    roastTimeHours: params.roastTimeHours,
    ashBatchKg: params.ashBatchKg,
    waterTempC: params.waterTempC,
  });

  const roastTemp = params.roastTempC ?? 750;

  // 1. Ash bed glow intensity scales with furnace temperature
  const tempFraction = Math.max(0, Math.min(1, (roastTemp - 500) / 450));
  model.materials.ashGlow.emissiveIntensity = 0.4 + tempFraction * 0.8;

  // 2. Flame flicker driven deterministically by time
  const flameScaleY =
    0.8 +
    Math.sin(timeS * pot.flameDisplayOmegaRadPerS) * 0.15 +
    Math.cos(timeS * pot.flameHarmonicOmegaRadPerS) * 0.08;
  model.nodes.flameMesh.scale.set(1, flameScaleY, 1);

  // 3. Boiling liquor agitation
  const boilDisplacement = Math.sin(timeS * pot.boilDisplayOmegaRadPerS) * 0.005;
  model.nodes.boilingLiquor.position.y = 0.48 + boilDisplacement;

  // 4. Pearl ash crystals visibility scales with yield
  const activeCrystalCount = Math.min(12, Math.max(2, Math.round((pot.pearlAshYieldKg / 25) * 12)));
  model.nodes.pearlAshCrystals.forEach((crystal, idx) => {
    crystal.visible = idx < activeCrystalCount;
  });

  // 5. Cast potash ingot size scales with cast volume
  const ingotScale = Math.min(1.2, Math.max(0.4, pot.potashFusedVolumeLiters / 8.5));
  model.nodes.potashIngot.scale.set(ingotScale, ingotScale, ingotScale);
}
