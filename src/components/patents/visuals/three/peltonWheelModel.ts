/**
 * peltonWheelModel.ts
 *
 * Museum-Grade Procedural 3D Model for Lester Pelton's 1880 Impulse Water Wheel (US Patent 233,692).
 *
 * Reconstructs the authentic 19th-century California Gold Rush / Nevada City mining turbine:
 * 1. Heavy ribbed cast-iron runner disc with a representative source-drawn split bucket.
 * 2. Source-faithful double-cup bucket geometry: central dividing apex, twin curved bottoms,
 *    inclined discharge sides, and a sloped front for clear jet entry.
 * 3. Generic nozzle and distributing-box arrangement shown in the source drawing.
 * 4. Heavy split-casing cast-iron housing with viewing cutaway, pillow block journal bearings, grease cups,
 *    and lower discharge tailrace pit.
 * 5. Source-described water stream and twin split discharge paths,
 *    and animated tailrace discharge mist.
 */

import * as THREE from "three";
import { fluidFrames, sampleFluidAt } from "@/physics/genericWasm";

export interface PeltonWheelModel {
  rootGroup: THREE.Group;
  runnerGroup: THREE.Group;
  casingGroup: THREE.Group;
  casingCutaway: THREE.Mesh;
  jetPoints: THREE.Points;
  sprayPoints: THREE.Points;
  materials: {
    castIron: THREE.MeshStandardMaterial;
    darkCastIron: THREE.MeshStandardMaterial;
    bronzeBucket: THREE.MeshStandardMaterial;
    polishedSteel: THREE.MeshStandardMaterial;
    brass: THREE.MeshStandardMaterial;
    waterJet: THREE.PointsMaterial;
    waterSpray: THREE.PointsMaterial;
  };
  dispose: () => void;
}

/**
 * Deterministic unit noise for procedural generation.
 */
function deterministicUnit(index: number, channel: number): number {
  const sample = Math.sin((index + 1) * 12.9898 + (channel + 1) * 78.233) * 43758.5453;
  return sample - Math.floor(sample);
}

/**
 * Procedural Cast-Iron Machine Texture
 */
function createCastIronTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  ctx.fillStyle = "#243242";
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 500; i++) {
    const x = deterministicUnit(i, 0) * 512;
    const y = deterministicUnit(i, 1) * 512;
    const r = 0.5 + deterministicUnit(i, 2) * 1.5;
    const alpha = 0.06 + deterministicUnit(i, 3) * 0.1;
    ctx.fillStyle =
      deterministicUnit(i, 4) > 0.5
        ? `rgba(255, 255, 255, ${alpha})`
        : `rgba(0, 0, 0, ${alpha * 1.5})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildPeltonWheelModel(): PeltonWheelModel {
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  const castIronTex = createCastIronTexture();
  if (castIronTex) texturesToDispose.push(castIronTex);

  // --- 1. MATERIALS ---
  const castIron = new THREE.MeshStandardMaterial({
    map: castIronTex || undefined,
    transparent: true,
    opacity: 1.0,
    color: 0x243242,
    roughness: 0.55,
    metalness: 0.8,
  });
  materialsToDispose.push(castIron);

  const darkCastIron = new THREE.MeshStandardMaterial({
    color: 0x182230,
    roughness: 0.7,
    metalness: 0.65,
    transparent: true,
    opacity: 1.0,
  });
  materialsToDispose.push(darkCastIron);

  const bronzeBucket = new THREE.MeshStandardMaterial({
    color: 0xd49b42,
    roughness: 0.28,
    metalness: 0.88,
  });
  materialsToDispose.push(bronzeBucket);

  const polishedSteel = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.15,
    metalness: 0.95,
  });
  materialsToDispose.push(polishedSteel);

  const brass = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.22,
    metalness: 0.9,
  });
  materialsToDispose.push(brass);

  // --- 2. RUNNER ASSEMBLY ---
  const runnerGroup = new THREE.Group();
  rootGroup.add(runnerGroup);

  // Main Shaft (Z-axis)
  const shaftGeo = new THREE.CylinderGeometry(0.18, 0.18, 5.4, 24);
  geometriesToDispose.push(shaftGeo);
  const shaft = new THREE.Mesh(shaftGeo, polishedSteel);
  shaft.rotation.x = Math.PI / 2;
  shaft.castShadow = true;
  runnerGroup.add(shaft);

  // Central Disc Hub with Keyway Collar
  const hubGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.65, 32);
  geometriesToDispose.push(hubGeo);
  const hub = new THREE.Mesh(hubGeo, castIron);
  hub.rotation.x = Math.PI / 2;
  hub.castShadow = true;
  runnerGroup.add(hub);

  // Hub Clamping Flanges & Bolts
  for (const sign of [-1, 1]) {
    const flangeGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.1, 32);
    geometriesToDispose.push(flangeGeo);
    const flange = new THREE.Mesh(flangeGeo, castIron);
    flange.rotation.x = Math.PI / 2;
    flange.position.z = sign * 0.35;
    runnerGroup.add(flange);

    // Flange bolts
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      const boltGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.12, 6);
      geometriesToDispose.push(boltGeo);
      const bolt = new THREE.Mesh(boltGeo, polishedSteel);
      bolt.rotation.x = Math.PI / 2;
      bolt.position.set(Math.cos(angle) * 0.8, Math.sin(angle) * 0.8, sign * 0.41);
      runnerGroup.add(bolt);
    }
  }

  // Runner Web Disc
  const discGeo = new THREE.CylinderGeometry(2.1, 2.1, 0.18, 48);
  geometriesToDispose.push(discGeo);
  const disc = new THREE.Mesh(discGeo, castIron);
  disc.rotation.x = Math.PI / 2;
  disc.castShadow = true;
  runnerGroup.add(disc);

  // Heavy Rim with Machined Bucket Mounting Pads
  const rimGeo = new THREE.TorusGeometry(2.15, 0.16, 16, 48);
  geometriesToDispose.push(rimGeo);
  const rim = new THREE.Mesh(rimGeo, darkCastIron);
  rim.castShadow = true;
  runnerGroup.add(rim);

  // Radial Stiffening Ribs (8 spokes on each face)
  for (let s = 0; s < 8; s++) {
    const sAngle = (s * Math.PI * 2) / 8;
    for (const sign of [-1, 1]) {
      const ribGeo = new THREE.BoxGeometry(1.4, 0.12, 0.08);
      geometriesToDispose.push(ribGeo);
      const rib = new THREE.Mesh(ribGeo, castIron);
      rib.position.set(Math.cos(sAngle) * 1.45, Math.sin(sAngle) * 1.45, sign * 0.12);
      rib.rotation.z = sAngle;
      runnerGroup.add(rib);
    }
  }

  // The grant gives no bucket count; show one representative source bucket.
  const bucketCount = 1;
  for (let b = 0; b < bucketCount; b++) {
    const bAngle = (b * Math.PI * 2) / bucketCount;
    const bucketGroup = new THREE.Group();
    bucketGroup.position.set(Math.cos(bAngle) * 2.25, Math.sin(bAngle) * 2.25, 0);
    bucketGroup.rotation.z = bAngle - Math.PI / 2;

    // 1. Bolted Mounting Lug attached to disc rim
    const lugGeo = new THREE.BoxGeometry(0.3, 0.45, 0.26);
    geometriesToDispose.push(lugGeo);
    const lug = new THREE.Mesh(lugGeo, bronzeBucket);
    lug.position.set(-0.15, 0, 0);
    lug.castShadow = true;
    bucketGroup.add(lug);

    // Hex attachment bolts
    for (const bSign of [-1, 1]) {
      const hexGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.32, 6);
      geometriesToDispose.push(hexGeo);
      const hex = new THREE.Mesh(hexGeo, polishedSteel);
      hex.rotation.x = Math.PI / 2;
      hex.position.set(-0.15, bSign * 0.12, 0);
      bucketGroup.add(hex);
    }

    // 2. Left Hemispherical Deflection Bowl
    const leftBowlGeo = new THREE.SphereGeometry(0.32, 16, 16, 0, Math.PI, 0, Math.PI);
    geometriesToDispose.push(leftBowlGeo);
    const leftBowl = new THREE.Mesh(leftBowlGeo, bronzeBucket);
    leftBowl.position.set(0.12, 0, -0.2);
    leftBowl.rotation.y = -Math.PI / 2;
    leftBowl.rotation.z = -0.15;
    leftBowl.scale.set(0.85, 1.25, 0.85);
    leftBowl.castShadow = true;
    bucketGroup.add(leftBowl);

    // 3. Right Hemispherical Deflection Bowl
    const rightBowlGeo = new THREE.SphereGeometry(0.32, 16, 16, 0, Math.PI, 0, Math.PI);
    geometriesToDispose.push(rightBowlGeo);
    const rightBowl = new THREE.Mesh(rightBowlGeo, bronzeBucket);
    rightBowl.position.set(0.12, 0, 0.2);
    rightBowl.rotation.y = -Math.PI / 2;
    rightBowl.rotation.z = -0.15;
    rightBowl.scale.set(0.85, 1.25, 0.85);
    rightBowl.castShadow = true;
    bucketGroup.add(rightBowl);

    // 4. Central Knife-Edge Splitter Ridge (US Patent 233,692 Claim 2)
    const splitterGeo = new THREE.ConeGeometry(0.045, 0.55, 4);
    geometriesToDispose.push(splitterGeo);
    const splitter = new THREE.Mesh(splitterGeo, bronzeBucket);
    splitter.rotation.z = Math.PI / 2;
    splitter.position.set(0.18, 0, 0);
    splitter.scale.set(0.5, 1.0, 4.2);
    bucketGroup.add(splitter);

    // 5. Front Scallop / Jet Entry Cutout Lip
    const lipGeo = new THREE.TorusGeometry(0.24, 0.035, 8, 16, Math.PI);
    geometriesToDispose.push(lipGeo);
    const lip = new THREE.Mesh(lipGeo, bronzeBucket);
    lip.rotation.y = Math.PI / 2;
    lip.position.set(0.38, 0, 0);
    bucketGroup.add(lip);

    runnerGroup.add(bucketGroup);
  }

  // --- 3. SOURCE NOZZLE ARRANGEMENT ---
  const nozzleGroup = new THREE.Group();
  nozzleGroup.position.set(-3.4, -2.25, 0);
  rootGroup.add(nozzleGroup);

  // Penstock Supply Pipe Flange
  const pipeGeo = new THREE.CylinderGeometry(0.48, 0.48, 2.2, 24);
  geometriesToDispose.push(pipeGeo);
  const pipe = new THREE.Mesh(pipeGeo, castIron);
  pipe.rotation.z = -Math.PI / 3;
  pipe.position.set(-1.1, -0.65, 0);
  pipe.castShadow = true;
  nozzleGroup.add(pipe);

  // Convergent Nozzle Barrel (Claim 1)
  const nozzleGeo = new THREE.CylinderGeometry(0.18, 0.48, 1.6, 24);
  geometriesToDispose.push(nozzleGeo);
  const nozzle = new THREE.Mesh(nozzleGeo, bronzeBucket);
  nozzle.rotation.z = -Math.PI / 3;
  nozzle.position.set(0.3, 0.2, 0);
  nozzle.castShadow = true;
  nozzleGroup.add(nozzle);

  // --- 4. HEAVY CAST-IRON HOUSING & CASING ---
  const casingGroup = new THREE.Group();
  rootGroup.add(casingGroup);

  // Lower Base Bedplate & Tailrace Pit
  const baseBedGeo = new THREE.BoxGeometry(7.2, 1.2, 4.4);
  geometriesToDispose.push(baseBedGeo);
  const baseBed = new THREE.Mesh(baseBedGeo, darkCastIron);
  baseBed.position.set(0, -3.2, 0);
  baseBed.receiveShadow = true;
  casingGroup.add(baseBed);

  // Tailrace discharge trough
  const troughGeo = new THREE.BoxGeometry(4.8, 0.6, 2.8);
  geometriesToDispose.push(troughGeo);
  const trough = new THREE.Mesh(troughGeo, castIron);
  trough.position.set(0, -2.6, 0);
  casingGroup.add(trough);

  // Split-casing wheel hood with a front viewing cutaway.
  const hoodGeo = new THREE.CylinderGeometry(3.1, 3.1, 1.8, 32, 1, true, 0, Math.PI * 1.4);
  geometriesToDispose.push(hoodGeo);
  const casingCutaway = new THREE.Mesh(hoodGeo, castIron);
  casingCutaway.rotation.x = Math.PI / 2;
  casingCutaway.position.set(0, 0, 0);
  casingCutaway.castShadow = true;
  casingGroup.add(casingCutaway);

  // Pillow Block Journal Bearings on Both Sides
  for (const bSign of [-1, 1]) {
    const blockGeo = new THREE.BoxGeometry(0.8, 1.4, 0.6);
    geometriesToDispose.push(blockGeo);
    const block = new THREE.Mesh(blockGeo, castIron);
    block.position.set(0, -0.6, bSign * 2.2);
    casingGroup.add(block);

    // Brass grease lubricator cup
    const cupGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.28, 12);
    geometriesToDispose.push(cupGeo);
    const cup = new THREE.Mesh(cupGeo, brass);
    cup.position.set(0, 0.25, bSign * 2.2);
    casingGroup.add(cup);
  }

  // --- 5. WATER JET & SPRAY PARTICLE SYSTEMS ---
  // High-Speed Concentrated Water Jet (Nozzle -> Bucket Splitter)
  const jetCount = 200;
  const jetGeo = new THREE.BufferGeometry();
  const jetPos = new Float32Array(jetCount * 3);
  for (let i = 0; i < jetCount; i++) {
    const idx = i * 3;
    const t = i / jetCount;
    jetPos[idx] = -3.2 + t * 3.2;
    jetPos[idx + 1] = -2.25 + t * 2.25;
    jetPos[idx + 2] = (deterministicUnit(i, 0) - 0.5) * 0.08;
  }
  jetGeo.setAttribute("position", new THREE.BufferAttribute(jetPos, 3));
  geometriesToDispose.push(jetGeo);

  const waterJet = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.18,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
  });
  materialsToDispose.push(waterJet);
  const jetPoints = new THREE.Points(jetGeo, waterJet);
  rootGroup.add(jetPoints);

  // Split discharge spray particles.
  const sprayCount = 300;
  const sprayGeo = new THREE.BufferGeometry();
  const sprayPos = new Float32Array(sprayCount * 3);
  for (let i = 0; i < sprayCount; i++) {
    const idx = i * 3;
    sprayPos[idx] = (deterministicUnit(i, 0) - 0.5) * 1.5;
    sprayPos[idx + 1] = -1.0 - deterministicUnit(i, 1) * 1.8;
    sprayPos[idx + 2] =
      (deterministicUnit(i, 2) > 0.5 ? 1 : -1) * (0.3 + deterministicUnit(i, 3) * 0.8);
  }
  sprayGeo.setAttribute("position", new THREE.BufferAttribute(sprayPos, 3));
  geometriesToDispose.push(sprayGeo);

  const waterSpray = new THREE.PointsMaterial({
    color: 0xbae6fd,
    size: 0.14,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
  });
  materialsToDispose.push(waterSpray);
  const sprayPoints = new THREE.Points(sprayGeo, waterSpray);
  rootGroup.add(sprayPoints);

  // --- DISPOSE CLEANUP ---
  const dispose = () => {
    for (const g of geometriesToDispose) g.dispose();
    for (const m of materialsToDispose) m.dispose();
    for (const t of texturesToDispose) t.dispose();
  };

  return {
    rootGroup,
    runnerGroup,
    casingGroup,
    casingCutaway,
    jetPoints,
    sprayPoints,
    materials: {
      castIron,
      darkCastIron,
      bronzeBucket,
      polishedSteel,
      brass,
      waterJet,
      waterSpray,
    },
    dispose,
  };
}

/**
 * Updates runner rotation, source-described jet/split discharge, and cutaway state.
 */
export function updatePeltonWheelKinematics(
  model: PeltonWheelModel,
  dt: number,
  runnerOmegaRadPerS: number,
  jetDisplaySpeed: number,
  sprayDisplaySpeed: number,
  showJet: boolean,
  isCutaway = false,
): void {
  // Runner wheel rotation
  model.runnerGroup.rotation.z += runnerOmegaRadPerS * dt;

  if (showJet) {
    model.jetPoints.visible = true;
    model.sprayPoints.visible = true;
    const fluid = fluidFrames(16, 8);
    const frame = Math.abs(Math.floor(model.runnerGroup.rotation.z * 3)) % 8;

    // High-speed jet streamline flow
    const jPos = model.jetPoints.geometry.attributes.position.array as Float32Array;
    const jetSpeed = jetDisplaySpeed * dt;
    const jetResetX = -3.2;
    const jetResetY = -2.25;
    const jetWrapX = 0;
    const jetYOverX = 0.7;
    const spanX = Math.max(0.1, jetWrapX - jetResetX);
    for (let i = 0; i < jPos.length; i += 3) {
      const u = ((jPos[i] ?? 0) - jetResetX) / spanX;
      const v = ((jPos[i + 1] ?? 0) - jetResetY + 3) / 6;
      const dens = sampleFluidAt(fluid, 16, 8, frame, u, v);
      const local = 1 + dens;
      jPos[i] += jetSpeed * local;
      jPos[i + 1] += jetSpeed * jetYOverX * local;
      if (jPos[i] > jetWrapX) {
        jPos[i] = jetResetX;
        jPos[i + 1] = jetResetY;
      }
    }
    model.jetPoints.geometry.attributes.position.needsUpdate = true;

    // Deflected spray mist flow downwards
    const sPos = model.sprayPoints.geometry.attributes.position.array as Float32Array;
    const spraySpeed = sprayDisplaySpeed * dt;
    for (let i = 0; i < sPos.length; i += 3) {
      sPos[i + 1] -= spraySpeed;
      if (sPos[i + 1] < -2.8) {
        sPos[i + 1] = -1;
      }
    }
    model.sprayPoints.geometry.attributes.position.needsUpdate = true;
  } else {
    model.jetPoints.visible = false;
    model.sprayPoints.visible = false;
  }

  // Cutaway transparency
  model.materials.castIron.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.castIron.transparent = isCutaway;
  model.materials.darkCastIron.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.darkCastIron.transparent = isCutaway;
}
