/**
 * maximMachineGunModel.ts
 *
 * Museum-Grade Procedural 3D Model for Hiram S. Maxim's 1885 Machine-Gun (US Patent 319,596).
 * Features authentic Victorian mounting, fixed barrel B, sliding forward muzzle sleeve l
 * with socket l', reversing rocker levers n, longitudinal connecting rods c',
 * transverse crankshaft e with Scotch-yoke cross-head d, sliding breech-block C,
 * and circular side case for volute return spring k.
 */

import * as THREE from "three";

export interface MaximMachineGunModel {
  rootGroup: THREE.Group;
  gunGroup: THREE.Group;
  fixedBarrelGroup: THREE.Group;
  muzzleSleeveGroup: THREE.Group;
  reversingLeversGroup: THREE.Group;
  operatingRodsGroup: THREE.Group;
  crankshaftGroup: THREE.Group;
  crossHeadBreechGroup: THREE.Group;
  voluteSpringHousing: THREE.Group;
  feedStarwheelsGroup: THREE.Group;
  muzzleFlashMesh: THREE.Mesh;
  materials: {
    gunmetal: THREE.MeshStandardMaterial;
    polishedSteel: THREE.MeshStandardMaterial;
    brass: THREE.MeshStandardMaterial;
    bronze: THREE.MeshStandardMaterial;
    iron: THREE.MeshStandardMaterial;
    flame: THREE.MeshStandardMaterial;
  };
  dispose: () => void;
}

export function buildMaximMachineGunModel(): MaximMachineGunModel {
  const rootGroup = new THREE.Group();
  rootGroup.name = "MaximMachineGunRoot";

  // Authentic Victorian Ordnance Materials
  const gunmetal = new THREE.MeshStandardMaterial({
    color: 0x22262b,
    roughness: 0.45,
    metalness: 0.85,
  });

  const polishedSteel = new THREE.MeshStandardMaterial({
    color: 0xd8dde3,
    roughness: 0.22,
    metalness: 0.95,
  });

  const brass = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.35,
    metalness: 0.8,
  });

  const bronze = new THREE.MeshStandardMaterial({
    color: 0x8c6239,
    roughness: 0.4,
    metalness: 0.75,
  });

  const iron = new THREE.MeshStandardMaterial({
    color: 0x3a3f47,
    roughness: 0.6,
    metalness: 0.7,
  });

  const flame = new THREE.MeshStandardMaterial({
    color: 0xffaa22,
    emissive: 0xff5500,
    emissiveIntensity: 2.5,
    roughness: 0.2,
    transparent: true,
    opacity: 0,
  });

  const gunGroup = new THREE.Group();
  gunGroup.name = "GunAssembly";
  rootGroup.add(gunGroup);

  // 1. Tripod Mount & Swivel Base
  const tripodGroup = new THREE.Group();
  tripodGroup.name = "TripodMount";
  const pillarGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.7, 16);
  const pillarMesh = new THREE.Mesh(pillarGeo, iron);
  pillarMesh.position.y = -0.35;
  tripodGroup.add(pillarMesh);

  for (let i = 0; i < 3; i++) {
    const legAngle = (i * Math.PI * 2) / 3;
    const legGeo = new THREE.CylinderGeometry(0.03, 0.025, 0.85, 12);
    const legMesh = new THREE.Mesh(legGeo, iron);
    legMesh.position.set(Math.sin(legAngle) * 0.25, -0.65, Math.cos(legAngle) * 0.25);
    legMesh.rotation.x = Math.cos(legAngle) * 0.45;
    legMesh.rotation.z = -Math.sin(legAngle) * 0.45;
    tripodGroup.add(legMesh);
  }
  rootGroup.add(tripodGroup);

  // 2. Main Receiver Frame A with Removable Top Cover A'
  const frameGeo = new THREE.BoxGeometry(0.18, 0.22, 0.75);
  const frameMesh = new THREE.Mesh(frameGeo, gunmetal);
  frameMesh.position.set(0, 0.1, -0.05);
  gunGroup.add(frameMesh);

  const lidGeo = new THREE.BoxGeometry(0.19, 0.03, 0.76);
  const lidMesh = new THREE.Mesh(lidGeo, gunmetal);
  lidMesh.position.set(0, 0.22, -0.05);
  gunGroup.add(lidMesh);

  // 3. Fixed Barrel B (Rigidly Mounted in Frame A)
  const fixedBarrelGroup = new THREE.Group();
  fixedBarrelGroup.name = "FixedBarrelB";
  const barrelGeo = new THREE.CylinderGeometry(0.032, 0.038, 0.95, 24);
  barrelGeo.rotateX(Math.PI / 2);
  const barrelMesh = new THREE.Mesh(barrelGeo, polishedSteel);
  barrelMesh.position.set(0, 0.1, 0.45);
  fixedBarrelGroup.add(barrelMesh);

  // Barrel collar / socket guide at frame front
  const collarGeo = new THREE.CylinderGeometry(0.048, 0.048, 0.08, 20);
  collarGeo.rotateX(Math.PI / 2);
  const collarMesh = new THREE.Mesh(collarGeo, brass);
  collarMesh.position.set(0, 0.1, 0.32);
  fixedBarrelGroup.add(collarMesh);
  gunGroup.add(fixedBarrelGroup);

  // 4. Sliding Tubular Muzzle Piece l & Socket l' (Moves Forward)
  const muzzleSleeveGroup = new THREE.Group();
  muzzleSleeveGroup.name = "SlidingMuzzleSleeve_l";
  const sleeveGeo = new THREE.CylinderGeometry(0.046, 0.046, 0.22, 24);
  sleeveGeo.rotateX(Math.PI / 2);
  const sleeveMesh = new THREE.Mesh(sleeveGeo, brass);
  sleeveMesh.position.set(0, 0.1, 0.88);
  muzzleSleeveGroup.add(sleeveMesh);

  // Muzzle expansion cup / front cone
  const nozzleGeo = new THREE.CylinderGeometry(0.024, 0.046, 0.06, 24);
  nozzleGeo.rotateX(Math.PI / 2);
  const nozzleMesh = new THREE.Mesh(nozzleGeo, brass);
  nozzleMesh.position.set(0, 0.1, 1.02);
  muzzleSleeveGroup.add(nozzleMesh);

  // Sleeve side link connection lugs m
  const lugGeo = new THREE.BoxGeometry(0.12, 0.02, 0.04);
  const lugMesh = new THREE.Mesh(lugGeo, bronze);
  lugMesh.position.set(0, 0.05, 0.82);
  muzzleSleeveGroup.add(lugMesh);
  gunGroup.add(muzzleSleeveGroup);

  // 5. Reversing Levers n (Pivoted on Frame Pins n')
  const reversingLeversGroup = new THREE.Group();
  reversingLeversGroup.name = "ReversingLevers_n";
  for (const side of [-1, 1]) {
    const leverGeo = new THREE.BoxGeometry(0.015, 0.14, 0.025);
    const leverMesh = new THREE.Mesh(leverGeo, polishedSteel);
    leverMesh.position.set(side * 0.105, 0.08, 0.65);
    reversingLeversGroup.add(leverMesh);

    // Frame pivot pin
    const pinGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.03, 12);
    pinGeo.rotateZ(Math.PI / 2);
    const pinMesh = new THREE.Mesh(pinGeo, brass);
    pinMesh.position.set(side * 0.105, 0.08, 0.65);
    reversingLeversGroup.add(pinMesh);
  }
  gunGroup.add(reversingLeversGroup);

  // 6. Connecting Operating Rods c' (Slides in Frame Guides d²)
  const operatingRodsGroup = new THREE.Group();
  operatingRodsGroup.name = "ConnectingRods_cprime";
  for (const side of [-1, 1]) {
    const rodGeo = new THREE.CylinderGeometry(0.009, 0.009, 0.62, 12);
    rodGeo.rotateX(Math.PI / 2);
    const rodMesh = new THREE.Mesh(rodGeo, polishedSteel);
    rodMesh.position.set(side * 0.098, 0.04, 0.3);
    operatingRodsGroup.add(rodMesh);
  }
  gunGroup.add(operatingRodsGroup);

  // 7. Transverse Crankshaft e with Crank Arms f and Crankpin e²
  const crankshaftGroup = new THREE.Group();
  crankshaftGroup.name = "Crankshaft_e";
  const shaftGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.28, 16);
  shaftGeo.rotateZ(Math.PI / 2);
  const shaftMesh = new THREE.Mesh(shaftGeo, polishedSteel);
  shaftMesh.position.set(0, 0.1, -0.22);
  crankshaftGroup.add(shaftMesh);

  // Crank arms f
  for (const side of [-1, 1]) {
    const armGeo = new THREE.BoxGeometry(0.015, 0.08, 0.02);
    const armMesh = new THREE.Mesh(armGeo, bronze);
    armMesh.position.set(side * 0.085, 0.13, -0.22);
    crankshaftGroup.add(armMesh);
  }
  gunGroup.add(crankshaftGroup);

  // 8. Scotch-Yoke Cross-Head d & Sliding Breech-Block C (Slides Rearward)
  const crossHeadBreechGroup = new THREE.Group();
  crossHeadBreechGroup.name = "CrossHead_d_Breech_C";
  // Breech block C
  const breechGeo = new THREE.BoxGeometry(0.12, 0.12, 0.18);
  const breechMesh = new THREE.Mesh(breechGeo, polishedSteel);
  breechMesh.position.set(0, 0.1, -0.05);
  crossHeadBreechGroup.add(breechMesh);

  // Cross-head vertical slot d
  const slotGeo = new THREE.BoxGeometry(0.04, 0.15, 0.03);
  const slotMesh = new THREE.Mesh(slotGeo, bronze);
  slotMesh.position.set(0, 0.1, -0.2);
  crossHeadBreechGroup.add(slotMesh);
  gunGroup.add(crossHeadBreechGroup);

  // 9. Volute Return Clock-Spring Housing k (On Side of Frame)
  const voluteSpringHousing = new THREE.Group();
  voluteSpringHousing.name = "VoluteSpringHousing_k";
  const springCaseGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.04, 24);
  springCaseGeo.rotateZ(Math.PI / 2);
  const springCaseMesh = new THREE.Mesh(springCaseGeo, brass);
  springCaseMesh.position.set(0.12, 0.1, -0.22);
  voluteSpringHousing.add(springCaseMesh);
  gunGroup.add(voluteSpringHousing);

  // 10. Cartridge Feed Starwheels Q, Q' & Feed Hopper
  const feedStarwheelsGroup = new THREE.Group();
  feedStarwheelsGroup.name = "FeedWheels_Q";
  for (const zOffset of [0, 0.06]) {
    const starwheelGeo = new THREE.CylinderGeometry(0.038, 0.038, 0.02, 12);
    starwheelGeo.rotateZ(Math.PI / 2);
    const wheelMesh = new THREE.Mesh(starwheelGeo, bronze);
    wheelMesh.position.set(0, 0.25, -0.04 + zOffset);
    feedStarwheelsGroup.add(wheelMesh);
  }
  gunGroup.add(feedStarwheelsGroup);

  // 11. Procedural Muzzle Gas Flash Cone
  const flashGeo = new THREE.ConeGeometry(0.12, 0.35, 16);
  flashGeo.rotateX(-Math.PI / 2);
  const muzzleFlashMesh = new THREE.Mesh(flashGeo, flame);
  muzzleFlashMesh.position.set(0, 0.1, 1.25);
  muzzleFlashMesh.visible = false;
  gunGroup.add(muzzleFlashMesh);

  const dispose = () => {
    pillarGeo.dispose();
    frameGeo.dispose();
    lidGeo.dispose();
    barrelGeo.dispose();
    collarGeo.dispose();
    sleeveGeo.dispose();
    nozzleGeo.dispose();
    lugGeo.dispose();
    shaftGeo.dispose();
    breechGeo.dispose();
    slotGeo.dispose();
    springCaseGeo.dispose();
    flashGeo.dispose();
    gunmetal.dispose();
    polishedSteel.dispose();
    brass.dispose();
    bronze.dispose();
    iron.dispose();
    flame.dispose();
  };

  return {
    rootGroup,
    gunGroup,
    fixedBarrelGroup,
    muzzleSleeveGroup,
    reversingLeversGroup,
    operatingRodsGroup,
    crankshaftGroup,
    crossHeadBreechGroup,
    voluteSpringHousing,
    feedStarwheelsGroup,
    muzzleFlashMesh,
    materials: {
      gunmetal,
      polishedSteel,
      brass,
      bronze,
      iron,
      flame,
    },
    dispose,
  };
}

export function updateMaximMachineGunKinematics(
  model: MaximMachineGunModel,
  _dt: number,
  cyclePhase: number,
  _fireOmegaRadPerS: number,
  _gasImpulsePct: number = 75,
  isFiring: boolean = true,
  isCutaway: boolean = false,
): { isMuzzleFlash: boolean } {
  const normPhase = ((cyclePhase % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const strokeFactor = Math.sin(normPhase / 2) ** 2; // 0 to 1 smooth cycle

  // 1. Sliding Muzzle Sleeve l moves forward along fixed barrel B
  const sleeveForwardM = 0.03 * strokeFactor;
  model.muzzleSleeveGroup.position.z = sleeveForwardM;

  // 2. Reversing Levers n rock on frame pivots
  const leverAngle = 0.3 * strokeFactor;
  model.reversingLeversGroup.rotation.x = -leverAngle;

  // 3. Operating Rods c' pull rearward
  const rodRearM = -0.03 * strokeFactor;
  model.operatingRodsGroup.position.z = rodRearM;

  // 4. Transverse Crankshaft e rotates
  const crankAngle = Math.PI * strokeFactor;
  model.crankshaftGroup.rotation.x = crankAngle;

  // 5. Cross-head d & Breech-block C travel rearward
  const breechRearM = -0.06 * strokeFactor;
  model.crossHeadBreechGroup.position.z = breechRearM;

  // 6. Muzzle gas blast pulse
  const isMuzzleFlash = isFiring && normPhase < 0.45;
  model.muzzleFlashMesh.visible = isMuzzleFlash;
  if (isMuzzleFlash) {
    model.materials.flame.opacity = 0.85 + Math.sin(normPhase * 10) * 0.15;
    model.muzzleFlashMesh.scale.setScalar(0.9 + strokeFactor * 0.4);
  } else {
    model.materials.flame.opacity = 0;
  }

  // Cutaway transparency for viewing internal mechanism
  if (isCutaway) {
    model.materials.gunmetal.transparent = true;
    model.materials.gunmetal.opacity = 0.35;
  } else {
    model.materials.gunmetal.transparent = false;
    model.materials.gunmetal.opacity = 1.0;
  }

  return { isMuzzleFlash };
}
