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
import { stepCorlissEngine } from "@/physics/catalogKernels";
import { cyclicSol, cyclicSymmetry } from "@/physics/genericWasm";

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

export function buildCorlissEngineModel(): CorlissEngineModel {
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const texturesToDispose: THREE.Texture[] = [];

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
    color: 0x451a03,
    roughness: 0.45,
    metalness: 0.05,
  });
  materialsToDispose.push(mahogany);

  const masonry = new THREE.MeshStandardMaterial({
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
    { x: -1.5, y: 1.65, z: 0, isSteam: true }, // Front Steam Valve
    { x: 1.5, y: 1.65, z: 0, isSteam: true }, // Back Steam Valve
    { x: -1.5, y: -1.65, z: 0, isSteam: false }, // Front Exhaust Valve
    { x: 1.5, y: -1.65, z: 0, isSteam: false }, // Back Exhaust Valve
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

    // Dashpot Vertical Drop Rod
    const dRodGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.2, 8);
    geometriesToDispose.push(dRodGeo);
    const dRod = new THREE.Mesh(dRodGeo, polishedSteel);
    dRod.position.set(dx, 1.5, 0);
    dashpotGroup.add(dRod);
    dashpotRods.push(dRod);
  }

  // --- 6. CRANKSHAFT, CRANK DISC & SEGMENTAL FLYWHEEL ---
  const crankGroup = new THREE.Group();
  crankGroup.position.set(3.8, 0, 0);
  rootGroup.add(crankGroup);

  // Main Shaft
  const shaftGeo = new THREE.CylinderGeometry(0.24, 0.24, 4.5, 24);
  geometriesToDispose.push(shaftGeo);
  const shaft = new THREE.Mesh(shaftGeo, polishedSteel);
  shaft.rotation.x = Math.PI / 2;
  crankGroup.add(shaft);

  // Heavy Counterbalanced Crank Disc
  const discGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.32, 32);
  geometriesToDispose.push(discGeo);
  const crankDisc = new THREE.Mesh(discGeo, castIron);
  crankDisc.rotation.x = Math.PI / 2;
  crankDisc.position.z = 0.85;
  crankDisc.castShadow = true;
  crankGroup.add(crankDisc);

  // Crankpin
  const pinGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.45, 16);
  geometriesToDispose.push(pinGeo);
  const crankPin = new THREE.Mesh(pinGeo, polishedSteel);
  crankPin.rotation.x = Math.PI / 2;
  crankPin.position.set(0.65, 0, 1.1);
  crankGroup.add(crankPin);

  // Multi-Spoke Segmental Flywheel with Barring Gear Rim
  const flyRimGeo = new THREE.TorusGeometry(3.6, 0.32, 16, 48);
  geometriesToDispose.push(flyRimGeo);
  const flywheel = new THREE.Mesh(flyRimGeo, castIron);
  flywheel.position.z = -1.4;
  flywheel.castShadow = true;
  crankGroup.add(flywheel);

  // 8 Curved Spokes
  for (let s = 0; s < 8; s++) {
    const sAngle = (s * Math.PI * 2) / 8;
    const spokeGeo = new THREE.BoxGeometry(0.18, 3.4, 0.14);
    geometriesToDispose.push(spokeGeo);
    const spoke = new THREE.Mesh(spokeGeo, castIron);
    spoke.position.set(Math.cos(sAngle) * 1.7, Math.sin(sAngle) * 1.7, -1.4);
    spoke.rotation.z = sAngle;
    crankGroup.add(spoke);
  }

  // --- 7. CROSSHEAD & CONNECTING ROD ---
  const crossheadGroup = new THREE.Group();
  crossheadGroup.position.set(-0.6, 0, 0);
  rootGroup.add(crossheadGroup);

  const xheadGeo = new THREE.BoxGeometry(0.9, 0.75, 0.65);
  geometriesToDispose.push(xheadGeo);
  const xhead = new THREE.Mesh(xheadGeo, castIron);
  xhead.castShadow = true;
  crossheadGroup.add(xhead);

  // Piston Rod
  const pRodGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.8, 12);
  geometriesToDispose.push(pRodGeo);
  const pRod = new THREE.Mesh(pRodGeo, polishedSteel);
  pRod.rotation.z = Math.PI / 2;
  pRod.position.x = -1.9;
  crossheadGroup.add(pRod);

  // Internal Double-Acting Steam Piston Head
  const pistonGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.45, 32);
  geometriesToDispose.push(pistonGeo);
  const pistonHead = new THREE.Mesh(pistonGeo, polishedSteel);
  pistonHead.rotation.z = Math.PI / 2;
  pistonHead.position.x = -3.2;
  pistonHead.castShadow = true;
  crossheadGroup.add(pistonHead);

  // Marine Connecting Rod
  const conRodGroup = new THREE.Group();
  rootGroup.add(conRodGroup);

  const conBeamGeo = new THREE.CylinderGeometry(0.085, 0.085, 4.4, 16);
  geometriesToDispose.push(conBeamGeo);
  const conBeam = new THREE.Mesh(conBeamGeo, polishedSteel);
  conBeam.rotation.z = Math.PI / 2;
  conBeam.position.x = 2.2;
  conBeam.castShadow = true;
  conRodGroup.add(conBeam);

  // --- 8. CENTRIFUGAL FLYBALL GOVERNOR ---
  const governorGroup = new THREE.Group();
  governorGroup.position.set(-1.0, 1.8, 1.2);
  rootGroup.add(governorGroup);

  const govColumnGeo = new THREE.CylinderGeometry(0.06, 0.08, 2.0, 12);
  geometriesToDispose.push(govColumnGeo);
  const govCol = new THREE.Mesh(govColumnGeo, brass);
  governorGroup.add(govCol);

  const governorBalls: THREE.Mesh[] = [];
  for (const sign of [-1, 1]) {
    const ballGeo = new THREE.SphereGeometry(0.18, 16, 16);
    geometriesToDispose.push(ballGeo);
    const ball = new THREE.Mesh(ballGeo, brass);
    ball.position.set(sign * 0.45, 0.6, 0);
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

/**
 * Updates Corliss steam engine kinematics, valve trips, and cutaway state.
 */
export function updateCorlissEngineKinematics(
  model: CorlissEngineModel,
  crankAngle: number,
  govSpread: number,
  wristAmp: number,
  isCutaway = false,
): { strokeX: number; wristAngle: number } {
  const corliss = stepCorlissEngine({});
  const valves = cyclicSymmetry(4, 0.4 + Math.abs(wristAmp));
  const valveFlex = 1 + 0.15 * cyclicSol(valves, 0);
  model.crankGroup.rotation.z = -crankAngle;

  const govAngle = crankAngle * corliss.govOmegaRatio;
  model.governorGroup.rotation.y = govAngle;
  model.governorBalls[0].position.x = -govSpread;
  model.governorBalls[1].position.x = govSpread;

  // Kinematics: crankpin position
  const crankR = corliss.crankR;
  const pinX = corliss.pinHomeX + Math.cos(crankAngle) * crankR;
  const pinY = Math.sin(crankAngle) * crankR;

  // Slider-crank crosshead position
  const rodL = corliss.rodLen;
  const strokeX = pinX - Math.sqrt(Math.max(corliss.rodMin, rodL ** 2 - pinY ** 2));
  model.crossheadGroup.position.x = strokeX;

  // Connecting rod pose
  model.conRodGroup.position.set(strokeX, 0, 0);
  const rodAngle = Math.atan2(pinY, pinX - strokeX);
  model.conRodGroup.rotation.z = rodAngle;

  // Central wrist plate harmonic oscillation (Claim 2)
  const wristAngle = Math.sin(crankAngle + corliss.wristLeadRad) * wristAmp * valveFlex;
  model.wristPlate.rotation.z = wristAngle;

  // 4 Rotary oscillating valve levers (Claim 1)
  model.valveLevers[0].rotation.z = wristAngle * corliss.intakeValveCoupling;
  model.valveLevers[1].rotation.z = -wristAngle * corliss.intakeValveCoupling;
  model.valveLevers[2].rotation.z =
    Math.sin(crankAngle) * wristAmp * corliss.exhaustValveCoupling * valveFlex;
  model.valveLevers[3].rotation.z =
    -Math.sin(crankAngle) * wristAmp * corliss.exhaustValveCoupling * valveFlex;

  // Dashpot rods drop motion
  const drop1 = Math.max(0, -wristAngle * corliss.dashpotDropAmp);
  const drop2 = Math.max(0, wristAngle * corliss.dashpotDropAmp);
  model.dashpotRods[0].position.y = corliss.dashpotHomeY - drop1;
  model.dashpotRods[1].position.y = corliss.dashpotHomeY - drop2;

  // Cutaway mode
  model.materials.mahogany.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.mahogany.transparent = isCutaway;
  model.materials.castIron.opacity = isCutaway ? 0.65 : 1.0;
  model.materials.castIron.transparent = isCutaway;

  return { strokeX, wristAngle };
}
