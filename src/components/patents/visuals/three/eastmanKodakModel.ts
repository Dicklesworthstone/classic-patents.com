/**
 * eastmanKodakModel.ts
 *
 * Museum-Grade Procedural 3D Model for George Eastman's 1888 Roll-Film Box Camera
 * (US Patent 388,850).
 *
 * Reconstructs the iconic "You press the button, we do the rest" Kodak No. 1:
 * 1. Rectangular wooden box covered in fine pebbled black morocco leather with top carrying strap.
 * 2. Rapid Rectilinear glass doublet lens mounted in a cylindrical burnished brass barrel.
 * 3. Rotatable cylindrical barrel shutter with slotted aperture, cocking string, and release trip.
 * 4. Waist-level optical reflex viewfinder with mirror and ground-glass screen.
 * 5. Internal mahogany wood roll-holder chassis with conical dark chamber / light baffle cone.
 * 6. Roll-film holder carrying 100-exposure continuous paper-backed stripping film with
 *    polished brass guide rollers, supply brake friction spring, and take-up ratchet.
 * 7. Top brass winding key, cord pull cocking trigger, and exposure counter ratchet.
 */

import * as THREE from "three";
import { cyclicSol, cyclicSymmetry } from "@/physics/genericWasm";

export interface EastmanKodakModelNodes {
  rootGroup: THREE.Group;
  boxBody: THREE.Mesh;
  internalChassis: THREE.Group;
  lightCone: THREE.Mesh;
  filmGroup: THREE.Group;
  supplySpool: THREE.Mesh;
  takeupSpool: THREE.Mesh;
  filmPlane: THREE.Mesh;
  shutterGroup: THREE.Group;
  barrel: THREE.Mesh;
  lensElement: THREE.Mesh;
  windingKey: THREE.Group;
  shutterButton: THREE.Mesh;
  // Enhanced museum sub-assemblies
  carryingStrap?: THREE.Mesh;
  viewfinder?: THREE.Group;
  guideRollers?: THREE.Mesh[];
  shutterCord?: THREE.Mesh;
  exposureDial?: THREE.Mesh;
}

export interface EastmanKodakMaterials {
  moroccoLeather: THREE.MeshStandardMaterial;
  mahoganyWood: THREE.MeshStandardMaterial;
  burnishedBrass: THREE.MeshStandardMaterial;
  rollFilm: THREE.MeshStandardMaterial;
  opticalGlass: THREE.MeshStandardMaterial;
  darkInterior: THREE.MeshStandardMaterial;
  strapLeather?: THREE.MeshStandardMaterial;
}

export interface EastmanKodakModelResult {
  rootGroup: THREE.Group;
  nodes: EastmanKodakModelNodes;
  materials: EastmanKodakMaterials;
  dispose: () => void;
}

/**
 * Deterministic unit noise for procedural grain generation.
 */
function deterministicUnit(index: number, channel: number): number {
  const sample = Math.sin((index + 1) * 12.9898 + (channel + 1) * 78.233) * 43758.5453;
  return sample - Math.floor(sample);
}

/**
 * Procedural Pebbled Morocco Leather Texture
 */
function createLeatherTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  // Charcoal-black morocco base
  ctx.fillStyle = "#18181b";
  ctx.fillRect(0, 0, 512, 512);

  // Pebbled organic grain cells
  for (let i = 0; i < 600; i++) {
    const px = deterministicUnit(i, 0) * 512;
    const py = deterministicUnit(i, 1) * 512;
    const r = 2.5 + deterministicUnit(i, 2) * 3.5;
    ctx.fillStyle = "rgba(40, 40, 45, 0.4)";
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(10, 10, 12, 0.6)";
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Procedural Internal Mahogany Chassis Texture
 */
function createMahoganyTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  ctx.fillStyle = "#451a03";
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 70; i++) {
    const x = i * 7.5 + (deterministicUnit(i, 3) - 0.5) * 4;
    const alpha = 0.08 + (i % 4 === 0 ? 0.12 : 0.03);
    ctx.strokeStyle = `rgba(110, 35, 10, ${alpha})`;
    ctx.lineWidth = 1.2 + (i % 3) * 0.5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(x + 12, 140, x - 10, 360, x + 6, 512);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildEastmanKodakModel(): EastmanKodakModelResult {
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    geometriesToDispose.push(geo);
    return geo;
  };
  const trackMat = <T extends THREE.Material>(mat: T): T => {
    materialsToDispose.push(mat);
    return mat;
  };

  const leatherTex = createLeatherTexture();
  if (leatherTex) texturesToDispose.push(leatherTex);

  const mahoganyTex = createMahoganyTexture();
  if (mahoganyTex) texturesToDispose.push(mahoganyTex);

  // ── Authentic Materials Palette ──────────────────────────────────────────
  const materials: EastmanKodakMaterials = {
    moroccoLeather: trackMat(
      new THREE.MeshStandardMaterial({
        ...(leatherTex ? { map: leatherTex } : {}),
        color: 0x18181b,
        roughness: 0.72,
        metalness: 0.12,
      }),
    ),
    mahoganyWood: trackMat(
      new THREE.MeshStandardMaterial({
        ...(mahoganyTex ? { map: mahoganyTex } : {}),
        color: 0x451a03,
        roughness: 0.52,
        metalness: 0.1,
      }),
    ),
    burnishedBrass: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.22,
        metalness: 0.88,
      }),
    ),
    rollFilm: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        roughness: 0.35,
        metalness: 0.1,
      }),
    ),
    opticalGlass: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.05,
        metalness: 0.1,
        transparent: true,
        opacity: 0.75,
      }),
    ),
    darkInterior: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x09090b,
        roughness: 0.92,
        metalness: 0.05,
      }),
    ),
    strapLeather: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x3f2212,
        roughness: 0.65,
        metalness: 0.1,
      }),
    ),
  };

  // ── 1. Black Morocco Leather Covered Box Body (Claim 1) ──────────────────
  const boxBody = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(4.8, 3.8, 3.8)),
    materials.moroccoLeather,
  );
  boxBody.castShadow = true;
  boxBody.receiveShadow = true;
  rootGroup.add(boxBody);

  // Top leather carrying handle
  const carryingStrap = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.4, 0.08, 0.45)),
    materials.strapLeather || materials.moroccoLeather,
  );
  carryingStrap.position.set(0, 1.95, 0);
  carryingStrap.castShadow = true;
  rootGroup.add(carryingStrap);

  // Brass strap buckles
  [-1.2, 1.2].forEach((bx) => {
    const buckle = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.12, 0.16, 0.52)),
      materials.burnishedBrass,
    );
    buckle.position.set(bx, 1.92, 0);
    rootGroup.add(buckle);
  });

  // Brass Corner Guards on Box Body
  [
    [-2.35, 1.85, 1.85],
    [2.35, 1.85, 1.85],
    [-2.35, -1.85, 1.85],
    [2.35, -1.85, 1.85],
    [-2.35, 1.85, -1.85],
    [2.35, 1.85, -1.85],
    [-2.35, -1.85, -1.85],
    [2.35, -1.85, -1.85],
  ].forEach(([cx, cy, cz]) => {
    const corner = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.35, 0.35, 0.35)),
      materials.burnishedBrass,
    );
    corner.position.set(cx, cy, cz);
    rootGroup.add(corner);
  });

  // ── 2. Internal Mahogany Chassis & Light Baffle Cone ─────────────────────
  const internalChassis = new THREE.Group();
  rootGroup.add(internalChassis);

  // Mahogany roll-holder frame
  const chassisFrame = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(4.4, 3.4, 3.4)),
    materials.mahoganyWood,
  );
  internalChassis.add(chassisFrame);

  // Conical light baffle dark chamber
  const lightCone = new THREE.Mesh(
    trackGeo(new THREE.ConeGeometry(1.6, 3.0, 24, 1, true)),
    materials.darkInterior,
  );
  lightCone.rotation.z = -Math.PI / 2;
  lightCone.position.set(0.4, 0, 0);
  internalChassis.add(lightCone);

  // ── 3. Roll-Film Spool Mechanism (Claim 1 & Claim 2) ─────────────────────
  const filmGroup = new THREE.Group();
  rootGroup.add(filmGroup);

  // Supply spool (unexposed 100-exposure continuous stripping film)
  const supplySpool = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.35, 0.35, 3.2, 20)),
    materials.rollFilm,
  );
  supplySpool.position.set(-1.6, 0, -1.2);
  supplySpool.castShadow = true;
  filmGroup.add(supplySpool);

  // Spool brass flanges
  [-1.6, 1.6].forEach((fy) => {
    const flange = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.45, 0.45, 0.04, 20)),
      materials.burnishedBrass,
    );
    flange.position.set(-1.6, fy * 0.95, -1.2);
    filmGroup.add(flange);
  });

  // Take-up spool with key-wind slot
  const takeupSpool = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.35, 0.35, 3.2, 20)),
    materials.rollFilm,
  );
  takeupSpool.position.set(1.6, 0, -1.2);
  takeupSpool.castShadow = true;
  filmGroup.add(takeupSpool);

  // Film exposure focal plane (2.5-inch circular image aperture frame)
  const filmPlane = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(3.2, 3.0, 0.05)),
    materials.rollFilm,
  );
  filmPlane.position.set(0, 0, -1.2);
  filmGroup.add(filmPlane);

  // Polished brass film guide rollers
  const guideRollers: THREE.Mesh[] = [];
  [-1.3, 1.3].forEach((rx) => {
    const roller = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.08, 0.08, 3.1, 16)),
      materials.burnishedBrass,
    );
    roller.position.set(rx, 0, -1.1);
    filmGroup.add(roller);
    guideRollers.push(roller);
  });

  // ── 4. Rotating Cylindrical Barrel Shutter & Optical Lens ─────────────────
  const shutterGroup = new THREE.Group();
  shutterGroup.position.set(2.4, 0, 0);
  rootGroup.add(shutterGroup);

  // Brass outer lens barrel bezel
  const outerBarrelBezel = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.72, 0.08, 12, 24)),
    materials.burnishedBrass,
  );
  outerBarrelBezel.rotation.y = Math.PI / 2;
  outerBarrelBezel.position.x = 0.02;
  shutterGroup.add(outerBarrelBezel);

  // Internal rotating cylindrical sector barrel
  const barrel = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.65, 0.65, 0.8, 24)),
    materials.burnishedBrass,
  );
  barrel.rotation.z = Math.PI / 2;
  barrel.castShadow = true;
  shutterGroup.add(barrel);

  // Rapid Rectilinear glass doublet lens
  const lensElement = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.42, 0.42, 0.12, 24)),
    materials.opticalGlass,
  );
  lensElement.rotation.z = Math.PI / 2;
  lensElement.position.x = 0.45;
  shutterGroup.add(lensElement);

  // ── 5. Waist-Level Viewfinder & Shutter Release Controls ──────────────────
  const viewfinder = new THREE.Group();
  viewfinder.position.set(1.5, 1.9, 1.2);
  rootGroup.add(viewfinder);

  // Top ground-glass viewing screen
  const groundGlass = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.6, 0.04, 0.6)),
    materials.opticalGlass,
  );
  groundGlass.position.y = 0.02;
  viewfinder.add(groundGlass);

  const finderBezel = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.7, 0.06, 0.7)),
    materials.burnishedBrass,
  );
  viewfinder.add(finderBezel);

  // Top brass winding key
  const windingKey = new THREE.Group();
  windingKey.position.set(-1.6, 2.1, -1.2);
  rootGroup.add(windingKey);

  const keyRing = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.32, 0.05, 8, 16)),
    materials.burnishedBrass,
  );
  keyRing.rotation.x = Math.PI / 2;
  windingKey.add(keyRing);

  const keyStem = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.06, 0.06, 0.35, 12)),
    materials.burnishedBrass,
  );
  keyStem.position.y = -0.15;
  windingKey.add(keyStem);

  // Exposure Counter Ratchet Dial beside winding key
  const exposureDial = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.25, 0.25, 0.06, 20)),
    materials.burnishedBrass,
  );
  exposureDial.position.set(-0.8, 1.95, -1.2);
  rootGroup.add(exposureDial);

  // Shutter release button on side/top
  const shutterButton = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.13, 0.13, 0.22, 16)),
    materials.burnishedBrass,
  );
  shutterButton.position.set(1.8, 2.0, 0);
  shutterButton.castShadow = true;
  rootGroup.add(shutterButton);

  // Shutter cocking cord pull eyelet with brass ring
  const cordEyelet = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.08, 0.02, 6, 12)),
    materials.burnishedBrass,
  );
  cordEyelet.position.set(1.9, 0.8, 1.92);
  rootGroup.add(cordEyelet);

  const nodes: EastmanKodakModelNodes = {
    rootGroup,
    boxBody,
    internalChassis,
    lightCone,
    filmGroup,
    supplySpool,
    takeupSpool,
    filmPlane,
    shutterGroup,
    barrel,
    lensElement,
    windingKey,
    shutterButton,
    carryingStrap,
    viewfinder,
    guideRollers,
    exposureDial,
  };

  const dispose = () => {
    for (const m of materialsToDispose) {
      m.dispose();
    }
    for (const g of geometriesToDispose) {
      g.dispose();
    }
    for (const t of texturesToDispose) {
      t.dispose();
    }
  };

  return { rootGroup, nodes, materials, dispose };
}

/**
 * Updates Kodak barrel shutter rotation, film advance, and cutaway shell transparency.
 */
export function updateEastmanKodakKinematics(
  nodes: EastmanKodakModelNodes,
  materials: EastmanKodakMaterials,
  dt: number,
  _timeSec: number,
  barrelOmegaRadPerS: number,
  isCutaway: boolean,
  filmAdvanceSpeedRadPerS: number,
  supplySpoolOmegaRadPerS: number,
) {
  const sprocket = cyclicSymmetry(8, 0.4 + Math.abs(filmAdvanceSpeedRadPerS) * 0.05);
  const flex = 1 + 0.12 * cyclicSol(sprocket, 0);

  // 1. Shutter Rotation
  nodes.barrel.rotation.x += barrelOmegaRadPerS * dt;

  // 2. Film Spool & Winding Key Motion during advance
  nodes.windingKey.rotation.y += filmAdvanceSpeedRadPerS * dt * flex;
  nodes.takeupSpool.rotation.y += filmAdvanceSpeedRadPerS * dt * flex;
  nodes.supplySpool.rotation.y += supplySpoolOmegaRadPerS * dt * flex;

  if (nodes.exposureDial) {
    nodes.exposureDial.rotation.y += filmAdvanceSpeedRadPerS * dt * 0.25;
  }

  // 3. Guide Rollers Rotation
  if (nodes.guideRollers) {
    nodes.guideRollers.forEach((roller) => {
      roller.rotation.y += filmAdvanceSpeedRadPerS * dt;
    });
  }

  // 4. Cutaway Body Mode
  materials.moroccoLeather.opacity = isCutaway ? 0.28 : 1.0;
  materials.moroccoLeather.transparent = isCutaway;
}
