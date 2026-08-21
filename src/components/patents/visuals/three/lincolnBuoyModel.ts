import * as THREE from "three";
import { lincolnInflationNorm, stepLincolnBuoy } from "@/physics/catalogKernels";
import { fluidFrames, sampleFluidAt } from "@/physics/genericWasm";

export interface LincolnBuoyModel {
  rootGroup: THREE.Group;
  boatGroup: THREE.Group;
  portBellows: THREE.Group;
  stbdBellows: THREE.Group;
  portBellowsBody: THREE.Mesh;
  stbdBellowsBody: THREE.Mesh;
  portLowerFrame: THREE.Mesh;
  stbdLowerFrame: THREE.Mesh;
  paddlewheelGroup: THREE.Group;
  waterMesh: THREE.Mesh;
  sandbarMesh: THREE.Mesh;
  materials: {
    hullWood: THREE.MeshStandardMaterial;
    deckPlanks: THREE.MeshStandardMaterial;
    cabinWhite: THREE.MeshStandardMaterial;
    bellowsRubber: THREE.MeshStandardMaterial;
    ironFittings: THREE.MeshStandardMaterial;
    brassTrim: THREE.MeshStandardMaterial;
    smokestackMat: THREE.MeshStandardMaterial;
    riverWater: THREE.MeshPhysicalMaterial;
    sandbarMat: THREE.MeshStandardMaterial;
  };
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
 * Procedural Steamboat Hull Plank Texture
 */
function createHullTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  ctx.fillStyle = "#5c3a21";
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 80; i++) {
    const y = i * 6.4 + (deterministicUnit(i, 0) - 0.5) * 3;
    const alpha = 0.08 + (i % 4 === 0 ? 0.12 : 0.03);
    ctx.strokeStyle = `rgba(35, 18, 8, ${alpha})`;
    ctx.lineWidth = 1.4 + (i % 3) * 0.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(160, y + 10, 340, y - 10, 512, y + 5);
    ctx.stroke();
  }

  for (let p = 0; p < 200; p++) {
    const px = deterministicUnit(p, 1) * 512;
    const py = deterministicUnit(p, 2) * 512;
    ctx.fillStyle = "rgba(20, 10, 4, 0.28)";
    ctx.fillRect(px, py, 4 + deterministicUnit(p, 3) * 6, 1.8);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildLincolnBuoyModel(): LincolnBuoyModel {
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  const hullTex = createHullTexture();
  if (hullTex) texturesToDispose.push(hullTex);

  // --- 1. AUTHENTIC MATERIALS ---
  const hullWood = new THREE.MeshStandardMaterial({
    map: hullTex || undefined,
    transparent: true,
    opacity: 1.0,
    color: 0x5c3a21,
    roughness: 0.55,
    metalness: 0.08,
  });
  materialsToDispose.push(hullWood);

  const deckPlanks = new THREE.MeshStandardMaterial({
    color: 0xc4a47c,
    roughness: 0.65,
    metalness: 0.05,
  });
  materialsToDispose.push(deckPlanks);

  const cabinWhite = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.35,
    metalness: 0.05,
  });
  materialsToDispose.push(cabinWhite);

  const bellowsRubber = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.65,
    metalness: 0.25,
    transparent: true,
    opacity: 1.0,
  });
  materialsToDispose.push(bellowsRubber);

  const ironFittings = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.45,
    metalness: 0.85,
  });
  materialsToDispose.push(ironFittings);

  const brassTrim = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.25,
    metalness: 0.9,
  });
  materialsToDispose.push(brassTrim);

  const smokestackMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.35,
    metalness: 0.85,
  });
  materialsToDispose.push(smokestackMat);

  const riverWater = new THREE.MeshPhysicalMaterial({
    color: 0x0284c7,
    transmission: 0.75,
    opacity: 0.8,
    transparent: true,
    roughness: 0.1,
    ior: 1.333,
  });
  materialsToDispose.push(riverWater);

  const sandbarMat = new THREE.MeshStandardMaterial({
    color: 0xd4a373,
    roughness: 0.9,
    metalness: 0.02,
  });
  materialsToDispose.push(sandbarMat);

  // --- 2. STEAMBOAT ASSEMBLY ---
  const boatGroup = new THREE.Group();
  rootGroup.add(boatGroup);

  // Main Hull (Flat-bottom Mississippi river packet boat)
  const hullShape = new THREE.Shape();
  hullShape.moveTo(-8.2, 0.9);
  hullShape.lineTo(7.6, 0.9);
  hullShape.lineTo(7.0, -0.9);
  hullShape.lineTo(-7.0, -0.9);
  hullShape.closePath();

  const hullGeo = new THREE.ExtrudeGeometry(hullShape, { depth: 4.8, bevelEnabled: false });
  geometriesToDispose.push(hullGeo);
  hullGeo.center();
  const hull = new THREE.Mesh(hullGeo, hullWood);
  hull.castShadow = true;
  hull.receiveShadow = true;
  boatGroup.add(hull);

  // Main Guard Deck / Overhangs
  const guardDeckGeo = new THREE.BoxGeometry(15.6, 0.15, 7.0);
  geometriesToDispose.push(guardDeckGeo);
  const guardDeck = new THREE.Mesh(guardDeckGeo, deckPlanks);
  guardDeck.position.y = 0.95;
  guardDeck.castShadow = true;
  boatGroup.add(guardDeck);

  // Main Boiler & Cargo Deck Cabin
  const lowerCabinGeo = new THREE.BoxGeometry(10.8, 1.3, 4.0);
  geometriesToDispose.push(lowerCabinGeo);
  const lowerCabin = new THREE.Mesh(lowerCabinGeo, cabinWhite);
  lowerCabin.position.set(-0.8, 1.65, 0);
  lowerCabin.castShadow = true;
  boatGroup.add(lowerCabin);

  // Hurricane / Texas Deck Cabin
  const texasDeckGeo = new THREE.BoxGeometry(7.6, 1.1, 3.0);
  geometriesToDispose.push(texasDeckGeo);
  const texasDeck = new THREE.Mesh(texasDeckGeo, cabinWhite);
  texasDeck.position.set(-0.8, 2.85, 0);
  texasDeck.castShadow = true;
  boatGroup.add(texasDeck);

  // Pilothouse with Octagonal Cupola
  const pilotHouseGeo = new THREE.CylinderGeometry(0.95, 0.95, 1.15, 8);
  geometriesToDispose.push(pilotHouseGeo);
  const pilotHouse = new THREE.Mesh(pilotHouseGeo, cabinWhite);
  pilotHouse.position.set(-3.2, 3.95, 0);
  pilotHouse.castShadow = true;
  boatGroup.add(pilotHouse);

  // Twin Tall Smokestacks with Ornate Crowns
  [-1.0, 1.0].forEach((sz) => {
    const stackGeo = new THREE.CylinderGeometry(0.28, 0.28, 5.0, 16);
    geometriesToDispose.push(stackGeo);
    const stack = new THREE.Mesh(stackGeo, smokestackMat);
    stack.position.set(-2.0, 4.5, sz);
    stack.castShadow = true;
    boatGroup.add(stack);

    const crownGeo = new THREE.CylinderGeometry(0.38, 0.28, 0.4, 16);
    geometriesToDispose.push(crownGeo);
    const crown = new THREE.Mesh(crownGeo, brassTrim);
    crown.position.set(-2.0, 7.0, sz);
    boatGroup.add(crown);
  });

  // Stern Paddlewheel
  const paddlewheelGroup = new THREE.Group();
  paddlewheelGroup.position.set(7.8, 0.3, 0);
  boatGroup.add(paddlewheelGroup);

  [-1.9, 1.9].forEach((pz) => {
    const ringGeo = new THREE.TorusGeometry(1.65, 0.08, 8, 24);
    geometriesToDispose.push(ringGeo);
    const ring = new THREE.Mesh(ringGeo, ironFittings);
    ring.position.z = pz;
    paddlewheelGroup.add(ring);
  });

  for (let b = 0; b < 12; b++) {
    const bAngle = (b * Math.PI * 2) / 12;
    const bladeGeo = new THREE.BoxGeometry(0.1, 0.45, 3.6);
    geometriesToDispose.push(bladeGeo);
    const blade = new THREE.Mesh(bladeGeo, hullWood);
    blade.position.set(Math.cos(bAngle) * 1.55, Math.sin(bAngle) * 1.55, 0);
    blade.rotation.z = bAngle;
    blade.castShadow = true;
    paddlewheelGroup.add(blade);
  }

  // --- 3. LINCOLN'S EXPANDABLE BUOYANT BELLOWS CHAMBERS (US 6,469 CLAIM 1 & 2) ---
  function buildBellowsAssembly(zPos: number) {
    const bGroup = new THREE.Group();
    bGroup.position.set(-0.5, -0.4, zPos);

    // Main Flexible Rubberized Canvas Chamber Body
    const bodyGeo = new THREE.BoxGeometry(11.2, 1.3, 1.05);
    geometriesToDispose.push(bodyGeo);
    const body = new THREE.Mesh(bodyGeo, bellowsRubber);
    body.castShadow = true;
    bGroup.add(body);

    // Concertina Folding Pleat Ribs
    for (let rib = 0; rib < 12; rib++) {
      const ribX = -5.0 + rib * 0.9;
      const ribGeo = new THREE.BoxGeometry(0.08, 1.4, 1.12);
      geometriesToDispose.push(ribGeo);
      const ribMesh = new THREE.Mesh(ribGeo, ironFittings);
      ribMesh.position.set(ribX, 0, 0);
      bGroup.add(ribMesh);
    }

    // Lower Movable Rigid Grid Frame
    const lowerFrameGeo = new THREE.BoxGeometry(11.4, 0.18, 1.2);
    geometriesToDispose.push(lowerFrameGeo);
    const lowerFrame = new THREE.Mesh(lowerFrameGeo, ironFittings);
    lowerFrame.position.set(0, -0.7, 0);
    bGroup.add(lowerFrame);

    // Vertical Guide Spars (Sliding through deck outriggers)
    for (let r = 0; r < 4; r++) {
      const sparX = -4.0 + r * 2.6;
      const sparGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.2, 12);
      geometriesToDispose.push(sparGeo);
      const spar = new THREE.Mesh(sparGeo, ironFittings);
      spar.position.set(sparX, 0.9, 0);
      bGroup.add(spar);
    }

    boatGroup.add(bGroup);
    return { bGroup, body, lowerFrame };
  }

  const portAssy = buildBellowsAssembly(2.9);
  const stbdAssy = buildBellowsAssembly(-2.9);

  // Horizontal Winding Shafts & Ropes (Claim 2 Rack-and-Pinion / Winch Sync)
  for (let s = 0; s < 4; s++) {
    const shaftX = -4.5 + s * 2.6;
    const shaftGeo = new THREE.CylinderGeometry(0.08, 0.08, 6.4, 12);
    geometriesToDispose.push(shaftGeo);
    const shaft = new THREE.Mesh(shaftGeo, ironFittings);
    shaft.rotation.x = Math.PI / 2;
    shaft.position.set(shaftX, 1.15, 0);
    boatGroup.add(shaft);

    // Pinion Gears at Ends
    [-2.9, 2.9].forEach((gearZ) => {
      const pinionGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.2, 16);
      geometriesToDispose.push(pinionGeo);
      const pinion = new THREE.Mesh(pinionGeo, brassTrim);
      pinion.rotation.x = Math.PI / 2;
      pinion.position.set(shaftX, 1.15, gearZ);
      boatGroup.add(pinion);
    });
  }

  // --- 4. RIVER WATER PLANE & SHOAL SANDBAR ---
  const waterGeo = new THREE.PlaneGeometry(38, 26);
  geometriesToDispose.push(waterGeo);
  const waterMesh = new THREE.Mesh(waterGeo, riverWater);
  waterMesh.rotation.x = -Math.PI / 2;
  waterMesh.position.y = 0.2;
  waterMesh.receiveShadow = true;
  rootGroup.add(waterMesh);

  const sandbarGeo = new THREE.BoxGeometry(26, 0.9, 18);
  geometriesToDispose.push(sandbarGeo);
  const sandbarMesh = new THREE.Mesh(sandbarGeo, sandbarMat);
  sandbarMesh.position.set(0, -2.8, 0);
  sandbarMesh.receiveShadow = true;
  rootGroup.add(sandbarMesh);

  const dispose = () => {
    for (const geo of geometriesToDispose) geo.dispose();
    for (const mat of materialsToDispose) mat.dispose();
    for (const tex of texturesToDispose) tex.dispose();
  };

  return {
    rootGroup,
    boatGroup,
    portBellows: portAssy.bGroup,
    stbdBellows: stbdAssy.bGroup,
    portBellowsBody: portAssy.body,
    stbdBellowsBody: stbdAssy.body,
    portLowerFrame: portAssy.lowerFrame,
    stbdLowerFrame: stbdAssy.lowerFrame,
    paddlewheelGroup,
    waterMesh,
    sandbarMesh,
    materials: {
      hullWood,
      deckPlanks,
      cabinWhite,
      bellowsRubber,
      ironFittings,
      brassTrim,
      smokestackMat,
      riverWater,
      sandbarMat,
    },
    dispose,
  };
}

/**
 * Updates Lincoln inflatable buoy steamboat displacement, bellows inflation, sandbar depth, and cutaway.
 */
export function updateLincolnBuoyKinematics(
  model: LincolnBuoyModel,
  dt: number,
  bellowsInflationPct: number,
  riverShoalDepthFt: number,
  baseDraftFt: number,
  effectiveDraftFt: number,
  paddleDisplayOmegaRadPerS: number,
  isCutaway = false,
  weightTons = 380,
): void {
  const lincoln = stepLincolnBuoy({
    inflationPct: bellowsInflationPct,
    weightTons,
    shoalDepth: riverShoalDepthFt,
  });
  const infl = lincolnInflationNorm(bellowsInflationPct, lincoln.inflationNormDivisor);
  const fluid = fluidFrames(16, 8);
  const air = 1 + sampleFluidAt(fluid, 16, 8, 4, 0.25, 0.8);
  const bellowsScaleY = lincoln.bellowsScaleY0 + infl * lincoln.bellowsScaleYAmp * air;
  const bellowsScaleZ = lincoln.bellowsScaleZ0 + infl * lincoln.bellowsScaleZAmp * air;

  model.portBellowsBody.scale.set(1.0, bellowsScaleY, bellowsScaleZ);
  model.stbdBellowsBody.scale.set(1.0, bellowsScaleY, bellowsScaleZ);

  const frameY = lincoln.lowerFrameHomeY - infl * lincoln.lowerFrameDropAmp;
  model.portLowerFrame.position.y = frameY;
  model.stbdLowerFrame.position.y = frameY;

  // Hull waterline displacement based on draft change
  const draftReductionFt = baseDraftFt - effectiveDraftFt;
  const boatY = draftReductionFt * lincoln.boatLiftPerFt;
  model.boatGroup.position.y = boatY;

  // River sandbar shoal height
  const sandbarY = lincoln.sandbarHomeY - riverShoalDepthFt * lincoln.sandbarDepthPerFt;
  model.sandbarMesh.position.y = sandbarY;

  // Paddlewheel rotation
  model.paddlewheelGroup.rotation.z -= paddleDisplayOmegaRadPerS * dt;

  // Cutaway mode
  model.materials.hullWood.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.hullWood.transparent = isCutaway;
  model.materials.bellowsRubber.opacity = isCutaway ? 0.45 : 1.0;
  model.materials.bellowsRubber.transparent = isCutaway;
}
