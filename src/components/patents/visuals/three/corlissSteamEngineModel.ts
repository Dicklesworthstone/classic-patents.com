/**
 * corlissSteamEngineModel.ts
 *
 * Museum-Grade Procedural 3D Model for George Corliss' 1849 Variable Cut-Off Steam Engine
 * (US Patent 6,162).
 *
 * Reconstructs the premier 19th-century American mill engine:
 * 1. Heavy ashlar masonry foundation bed with ribbed cast-iron soleplate.
 * 2. Horizontal steam cylinder with mahogany wood-stave lagging, polished brass retention hoops,
 *    and 4 separate rotary oscillating valve chests (2 top steam admission, 2 bottom exhaust - Claim 1).
 * 3. Central oscillating wrist plate (Claim 2) with 4 radial link rods.
 * 4. Automatic drop-cutoff trip gear with twin vertical pneumatic air dashpots that snap steam valves shut.
 * 5. Centrifugal flyball governor regulating cutoff cams via bevel gear drive.
 * 6. Cast-iron Corliss girder frame, crosshead guide, connecting rod, and counterbalanced crank disc.
 * 7. Massive multi-spoke segmental flywheel with rim gear teeth.
 */

import * as THREE from "three";
import { corlissValveCrate } from "@/physics/genericWasm";

export interface CorlissEngineModel {
  rootGroup: THREE.Group;
  wristPlate: THREE.Group;
  valveLevers: THREE.Group[];
  dashpotRods: THREE.Mesh[];
  crankGroup: THREE.Group;
  flywheel: THREE.Mesh;
  crossheadGroup: THREE.Group;
  conRodGroup: THREE.Group;
  governorGroup: THREE.Group;
  governorBalls: THREE.Mesh[];
  materials: {
    castIron: THREE.MeshStandardMaterial;
    darkIron: THREE.MeshStandardMaterial;
    polishedSteel: THREE.MeshStandardMaterial;
    brass: THREE.MeshStandardMaterial;
    bronze: THREE.MeshStandardMaterial;
    mahogany: THREE.MeshStandardMaterial;
    masonry: THREE.MeshStandardMaterial;
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
 * Procedural Cuban Mahogany Wood-Stave Lagging Texture
 */
function createMahoganyTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  // Dark rich varnished mahogany
  ctx.fillStyle = "#451a03";
  ctx.fillRect(0, 0, 512, 512);

  // Vertical stave joint lines
  for (let x = 0; x < 512; x += 32) {
    ctx.fillStyle = "rgba(20, 8, 2, 0.5)";
    ctx.fillRect(x, 0, 2, 512);
  }

  // Flowing wood grain
  for (let i = 0; i < 70; i++) {
    const x = i * 7.4 + (deterministicUnit(i, 0) - 0.5) * 4;
    ctx.strokeStyle = `rgba(120, 40, 10, ${0.15 + deterministicUnit(i, 1) * 0.15})`;
    ctx.lineWidth = 1.2 + deterministicUnit(i, 2) * 1.2;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(x + 10, 150, x - 8, 350, x + 6, 512);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 1);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Procedural Ashlar Granite Masonry Foundation Texture
 */
function createMasonryTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  ctx.fillStyle = "#475569";
  ctx.fillRect(0, 0, 512, 512);

  // Ashlar stone block grid & mortar lines
  ctx.strokeStyle = "rgba(30, 41, 59, 0.8)";
  ctx.lineWidth = 3;
  for (let y = 0; y < 512; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();

    const rowOffset = (y / 64) % 2 === 0 ? 0 : 64;
    for (let x = rowOffset; x < 512; x += 128) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 64);
      ctx.stroke();
    }
  }

  // Stone chisel texture
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const d = imgData.data;
  for (let i = 0; i < 512 * 512; i++) {
    const n = (deterministicUnit(i, 0) - 0.5) * 16;
    d[i * 4 + 0] = Math.max(0, Math.min(255, d[i * 4 + 0] + n));
    d[i * 4 + 1] = Math.max(0, Math.min(255, d[i * 4 + 1] + n));
    d[i * 4 + 2] = Math.max(0, Math.min(255, d[i * 4 + 2] + n));
  }
  ctx.putImageData(imgData, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildCorlissEngineModel(): CorlissEngineModel {
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  const mahoganyTex = createMahoganyTexture();
  if (mahoganyTex) texturesToDispose.push(mahoganyTex);

  const masonryTex = createMasonryTexture();
  if (masonryTex) texturesToDispose.push(masonryTex);

  // --- 1. MATERIALS ---
  const castIron = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.55,
    metalness: 0.8,
  });
  materialsToDispose.push(castIron);

  const darkIron = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.7,
    metalness: 0.7,
  });
  materialsToDispose.push(darkIron);

  const polishedSteel = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.12,
    metalness: 0.95,
  });
  materialsToDispose.push(polishedSteel);

  const brass = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.22,
    metalness: 0.9,
  });
  materialsToDispose.push(brass);

  const bronze = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    roughness: 0.28,
    metalness: 0.85,
  });
  materialsToDispose.push(bronze);

  const mahogany = new THREE.MeshStandardMaterial({
    ...(mahoganyTex ? { map: mahoganyTex } : {}),
    transparent: true,
    opacity: 1.0,
    color: 0x451a03,
    roughness: 0.45,
    metalness: 0.05,
  });
  materialsToDispose.push(mahogany);

  const masonry = new THREE.MeshStandardMaterial({
    ...(masonryTex ? { map: masonryTex } : {}),
    color: 0x475569,
    roughness: 0.9,
    metalness: 0.1,
  });
  materialsToDispose.push(masonry);

  // --- 2. FOUNDATION BED & GIRDER FRAME ---
  const baseGroup = new THREE.Group();
  rootGroup.add(baseGroup);

  // Ashlar Stone Masonry Foundation Bed
  const bedGeo = new THREE.BoxGeometry(13.5, 1.2, 7.8);
  geometriesToDispose.push(bedGeo);
  const bed = new THREE.Mesh(bedGeo, masonry);
  bed.position.y = -2.6;
  bed.receiveShadow = true;
  baseGroup.add(bed);

  // Heavy Cast-Iron Soleplate
  const soleGeo = new THREE.BoxGeometry(12.8, 0.3, 7.2);
  geometriesToDispose.push(soleGeo);
  const sole = new THREE.Mesh(soleGeo, darkIron);
  sole.position.y = -1.85;
  sole.receiveShadow = true;
  baseGroup.add(sole);

  // Corliss Girder Frame with Curved Trunk Crosshead Guide
  const girderGroup = new THREE.Group();
  girderGroup.position.set(0, 0, 0);
  rootGroup.add(girderGroup);

  const guideGeo = new THREE.CylinderGeometry(0.9, 0.9, 3.8, 24, 1, true, 0, Math.PI);
  geometriesToDispose.push(guideGeo);
  const guide = new THREE.Mesh(guideGeo, castIron);
  guide.rotation.z = Math.PI / 2;
  guide.rotation.x = Math.PI / 2;
  guide.position.set(-0.6, 0, 0);
  girderGroup.add(guide);

  // Main Crankshaft Pillow Block Bearing Pedestal
  const mainPillowGeo = new THREE.BoxGeometry(1.6, 2.4, 2.2);
  geometriesToDispose.push(mainPillowGeo);
  const mainPillow = new THREE.Mesh(mainPillowGeo, castIron);
  mainPillow.position.set(3.8, -0.7, 0);
  mainPillow.castShadow = true;
  girderGroup.add(mainPillow);

  const capGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.6, 16, 1, false, 0, Math.PI);
  geometriesToDispose.push(capGeo);
  const cap = new THREE.Mesh(capGeo, brass);
  cap.rotation.z = Math.PI / 2;
  cap.position.set(3.8, 0.45, 0);
  girderGroup.add(cap);

  // --- 3. STEAM CYLINDER & 4 ROTARY OSCILLATING VALVE CHESTS (Claim 1) ---
  const cylinderGroup = new THREE.Group();
  cylinderGroup.position.set(-3.8, 0, 0);
  rootGroup.add(cylinderGroup);

  // Lagged Cylinder Body
  const cylGeo = new THREE.CylinderGeometry(1.65, 1.65, 4.4, 32);
  geometriesToDispose.push(cylGeo);
  const cylOuter = new THREE.Mesh(cylGeo, mahogany);
  cylOuter.rotation.z = Math.PI / 2;
  cylOuter.castShadow = true;
  cylinderGroup.add(cylOuter);

  // Polished Brass Retaining Hoops
  for (const cx of [-1.8, -0.6, 0.6, 1.8]) {
    const hoopGeo = new THREE.TorusGeometry(1.67, 0.045, 8, 32);
    geometriesToDispose.push(hoopGeo);
    const hoop = new THREE.Mesh(hoopGeo, brass);
    hoop.rotation.y = Math.PI / 2;
    hoop.position.x = cx;
    cylinderGroup.add(hoop);
  }

  // Cast-Iron Cylinder Flanged End Covers
  for (const cx of [-2.25, 2.25]) {
    const coverGeo = new THREE.CylinderGeometry(1.85, 1.85, 0.22, 32);
    geometriesToDispose.push(coverGeo);
    const cover = new THREE.Mesh(coverGeo, darkIron);
    cover.rotation.z = Math.PI / 2;
    cover.position.x = cx;
    cylinderGroup.add(cover);
  }

  // 4 Rotary Oscillating Valve Chests (2 Top Admission, 2 Bottom Exhaust - US Patent 6,162)
  const valveLevers: THREE.Group[] = [];
  const valveLocs = [
    { x: -1.5, y: 1.65, z: 0, isSteam: true },
    { x: 1.5, y: 1.65, z: 0, isSteam: true },
    { x: -1.5, y: -1.65, z: 0, isSteam: false },
    { x: 1.5, y: -1.65, z: 0, isSteam: false },
  ];

  valveLocs.forEach(({ x, y, z, isSteam }) => {
    const chestGeo = new THREE.CylinderGeometry(0.42, 0.42, 1.4, 16);
    geometriesToDispose.push(chestGeo);
    const chest = new THREE.Mesh(chestGeo, castIron);
    chest.rotation.x = Math.PI / 2;
    chest.position.set(x, y, z);
    cylinderGroup.add(chest);

    // Oscillating Valve Stem Lever
    const leverGroup = new THREE.Group();
    leverGroup.position.set(x, y, 0.85);
    cylinderGroup.add(leverGroup);
    valveLevers.push(leverGroup);

    const armGeo = new THREE.BoxGeometry(0.12, 0.9, 0.08);
    geometriesToDispose.push(armGeo);
    const arm = new THREE.Mesh(armGeo, polishedSteel);
    arm.position.y = isSteam ? 0.4 : -0.4;
    leverGroup.add(arm);

    const pinGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.25, 12);
    geometriesToDispose.push(pinGeo);
    const pin = new THREE.Mesh(pinGeo, brass);
    pin.rotation.x = Math.PI / 2;
    pin.position.y = isSteam ? 0.8 : -0.8;
    leverGroup.add(pin);
  });

  // --- 4. CENTRAL WRIST PLATE & LINK RODS (Claim 2) ---
  const wristPlate = new THREE.Group();
  wristPlate.position.set(-3.8, 0, 1.1);
  rootGroup.add(wristPlate);

  const plateGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.15, 24);
  geometriesToDispose.push(plateGeo);
  const plateMesh = new THREE.Mesh(plateGeo, castIron);
  plateMesh.rotation.x = Math.PI / 2;
  wristPlate.add(plateMesh);

  // Wrist plate pivot hub
  const hubGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.35, 16);
  geometriesToDispose.push(hubGeo);
  const hub = new THREE.Mesh(hubGeo, brass);
  hub.rotation.x = Math.PI / 2;
  wristPlate.add(hub);

  // --- 5. PNEUMATIC AIR DASHPOTS (Corliss Drop-Cutoff) ---
  const dashpotGroup = new THREE.Group();
  dashpotGroup.position.set(-3.8, -1.8, 0.85);
  rootGroup.add(dashpotGroup);

  const dashpotRods: THREE.Mesh[] = [];
  for (const dx of [-1.5, 1.5]) {
    // Dashpot Cylinder Pot
    const potGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.85, 16);
    geometriesToDispose.push(potGeo);
    const pot = new THREE.Mesh(potGeo, darkIron);
    pot.position.set(dx, 0.42, 0);
    dashpotGroup.add(pot);

    // Dashpot Plunger Rod
    const rodGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.8, 10);
    geometriesToDispose.push(rodGeo);
    const rod = new THREE.Mesh(rodGeo, polishedSteel);
    rod.position.set(dx, 1.3, 0);
    dashpotGroup.add(rod);
    dashpotRods.push(rod);
  }

  // --- 6. RECIPROCATING CROSSHEAD, CONNECTING ROD & CRANK DISC ---
  const crossheadGroup = new THREE.Group();
  crossheadGroup.position.set(-0.6, 0, 0);
  rootGroup.add(crossheadGroup);

  const xheadGeo = new THREE.BoxGeometry(0.85, 0.85, 0.95);
  geometriesToDispose.push(xheadGeo);
  const xhead = new THREE.Mesh(xheadGeo, bronze);
  xhead.castShadow = true;
  crossheadGroup.add(xhead);

  // Piston Rod from cylinder into crosshead
  const pRodGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.4, 16);
  geometriesToDispose.push(pRodGeo);
  const pRod = new THREE.Mesh(pRodGeo, polishedSteel);
  pRod.rotation.z = Math.PI / 2;
  pRod.position.x = -1.2;
  crossheadGroup.add(pRod);

  // Connecting Rod (Crosshead to Crankpin)
  const conRodGroup = new THREE.Group();
  conRodGroup.position.set(-0.6, 0, 0);
  rootGroup.add(conRodGroup);

  const cRodBeamGeo = new THREE.CylinderGeometry(0.11, 0.11, 4.4, 16);
  geometriesToDispose.push(cRodBeamGeo);
  const cRodBeam = new THREE.Mesh(cRodBeamGeo, castIron);
  cRodBeam.rotation.z = Math.PI / 2;
  cRodBeam.position.x = 2.2;
  cRodBeam.castShadow = true;
  conRodGroup.add(cRodBeam);

  // Crank Disc & Counterbalance
  const crankGroup = new THREE.Group();
  crankGroup.position.set(3.8, 0, 0);
  rootGroup.add(crankGroup);

  const discGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.28, 32);
  geometriesToDispose.push(discGeo);
  const disc = new THREE.Mesh(discGeo, darkIron);
  disc.rotation.x = Math.PI / 2;
  disc.position.z = 0.55;
  disc.castShadow = true;
  crankGroup.add(disc);

  // Crankpin
  const cPinGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.65, 16);
  geometriesToDispose.push(cPinGeo);
  const cPin = new THREE.Mesh(cPinGeo, polishedSteel);
  cPin.rotation.x = Math.PI / 2;
  cPin.position.set(0.9, 0, 0.35);
  crankGroup.add(cPin);

  // --- 7. MULTI-SPOKE FLYWHEEL WITH RIM GEAR TEETH ---
  const flywheelGeo = new THREE.TorusGeometry(3.6, 0.35, 16, 48);
  geometriesToDispose.push(flywheelGeo);
  const flywheel = new THREE.Mesh(flywheelGeo, castIron);
  flywheel.position.set(3.8, 0, -1.8);
  flywheel.castShadow = true;
  rootGroup.add(flywheel);

  // 8 Heavy Tapered Flywheel Spokes
  for (let s = 0; s < 8; s++) {
    const sAngle = (s * Math.PI * 2) / 8;
    const spokeGeo = new THREE.CylinderGeometry(0.08, 0.18, 3.4, 12);
    geometriesToDispose.push(spokeGeo);
    const spoke = new THREE.Mesh(spokeGeo, castIron);
    spoke.position.set(Math.cos(sAngle) * 1.7, Math.sin(sAngle) * 1.7, 0);
    spoke.rotation.z = sAngle + Math.PI / 2;
    flywheel.add(spoke);
  }

  // --- 8. CENTRIFUGAL FLYBALL GOVERNOR ---
  const governorGroup = new THREE.Group();
  governorGroup.position.set(-1.2, 1.8, 0.85);
  rootGroup.add(governorGroup);

  // Vertical Spindle Pillar
  const govSpindleGeo = new THREE.CylinderGeometry(0.06, 0.08, 2.2, 12);
  geometriesToDispose.push(govSpindleGeo);
  const govSpindle = new THREE.Mesh(govSpindleGeo, polishedSteel);
  governorGroup.add(govSpindle);

  // Spinning Flyball Arms & Brass Spheres
  const governorBalls: THREE.Mesh[] = [];
  for (const sign of [-1, 1]) {
    const armGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.9, 8);
    geometriesToDispose.push(armGeo);
    const arm = new THREE.Mesh(armGeo, brass);
    arm.rotation.z = sign * 0.55;
    arm.position.set(sign * 0.22, 0.6, 0);
    governorGroup.add(arm);

    const ballGeo = new THREE.SphereGeometry(0.18, 16, 16);
    geometriesToDispose.push(ballGeo);
    const ball = new THREE.Mesh(ballGeo, brass);
    ball.position.set(sign * 0.45, 0.35, 0);
    ball.castShadow = true;
    governorGroup.add(ball);
    governorBalls.push(ball);
  }

  // --- DISPOSE CLEANUP ---
  const dispose = () => {
    for (const g of geometriesToDispose) g.dispose();
    for (const m of materialsToDispose) m.dispose();
    for (const t of texturesToDispose) t.dispose();
  };

  return {
    rootGroup,
    wristPlate,
    valveLevers,
    dashpotRods,
    crankGroup,
    flywheel,
    crossheadGroup,
    conRodGroup,
    governorGroup,
    governorBalls,
    materials: {
      castIron,
      darkIron,
      polishedSteel,
      brass,
      bronze,
      mahogany,
      masonry,
    },
    dispose,
  };
}

export interface CorlissKinematicState {
  crankAngleRad: number;
  governorOmegaRadPerS: number;
  cutoffFraction: number;
  isCutaway: boolean;
  dt?: number;
  govSpread: number;
  wristAmp: number;
  wristLeadRad?: number;
}

/**
 * Updates Corliss engine 4-valve kinematics, wrist-plate oscillation, dashpot trips, and flyball governor.
 * Governor ω, ball spread, and wrist amplitude come from `stepCorlissEngine` — not leftover rpm/60.
 */
export function updateCorlissEngineKinematics(
  model: CorlissEngineModel,
  state: CorlissKinematicState,
) {
  const { crankAngleRad, governorOmegaRadPerS, cutoffFraction, isCutaway, govSpread, wristAmp } =
    state;
  const dt = state.dt ?? 1 / 60;
  const wristLeadRad = state.wristLeadRad ?? Math.PI * 0.25;
  const crankRadius = 0.9;
  const conRodLength = 4.4;

  // 1. Crankshaft & Flywheel Rotation
  model.crankGroup.rotation.z = -crankAngleRad;
  model.flywheel.rotation.z = -crankAngleRad;

  // 2. Crosshead Reciprocating Kinematics
  const pinX = 3.8 - Math.cos(crankAngleRad) * crankRadius;
  const pinY = Math.sin(crankAngleRad) * crankRadius;
  const crossheadX = pinX - Math.sqrt(conRodLength ** 2 - pinY ** 2);
  model.crossheadGroup.position.x = crossheadX;

  // 3. Connecting Rod Articulation
  model.conRodGroup.position.set(crossheadX, 0, 0);
  const conRodAngle = Math.asin(pinY / conRodLength);
  model.conRodGroup.rotation.z = conRodAngle;

  // 4. Corliss Wrist Plate Harmonic Oscillation (Claim 2)
  const wristAngle = Math.sin(crankAngleRad + wristLeadRad) * wristAmp;
  model.wristPlate.rotation.z = wristAngle;

  // 5. Four Rotary Valve Levers & Pneumatic Dashpot Drop-Cutoff (Claim 1)
  const harmonic = corlissValveCrate(crankAngleRad).exhaustHarmonic;
  const steamCutoffAngle = cutoffFraction * Math.PI;

  model.valveLevers.forEach((lever, idx) => {
    if (idx === 0) {
      // Front Steam Admission: open until cutoff, then drop shut
      const open =
        ((crankAngleRad % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) < steamCutoffAngle;
      lever.rotation.z = open ? wristAngle * 0.8 : -0.2;
    } else if (idx === 1) {
      // Back Steam Admission
      const open =
        (((crankAngleRad + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) <
        steamCutoffAngle;
      lever.rotation.z = open ? -wristAngle * 0.8 : 0.2;
    } else if (idx === 2) {
      // Front Exhaust
      lever.rotation.z = wristAngle * 0.6 + harmonic;
    } else {
      // Back Exhaust
      lever.rotation.z = -wristAngle * 0.6 - harmonic;
    }
  });

  // 6. Dashpot Rod Plungers
  model.dashpotRods.forEach((rod, idx) => {
    const open =
      idx === 0 ? (model.valveLevers[0]?.rotation.z ?? 0) : (model.valveLevers[1]?.rotation.z ?? 0);
    rod.position.y = 1.3 + Math.max(0, open) * 0.4;
  });

  // 7. Centrifugal Flyball Governor Rotation & Ball Lift
  model.governorGroup.rotation.y += governorOmegaRadPerS * dt;
  if (model.governorBalls[0]) model.governorBalls[0].position.x = -govSpread;
  if (model.governorBalls[1]) model.governorBalls[1].position.x = govSpread;

  // 8. Cutaway Mode
  model.materials.mahogany.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.mahogany.transparent = isCutaway;

  return { strokeX: crossheadX, wristAngle };
}
