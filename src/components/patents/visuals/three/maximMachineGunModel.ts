/**
 * maximMachineGunModel.ts
 *
 * Museum-Grade Procedural 3D Model for Sir Hiram Maxim's 1885 Automatic Recoil Machine Gun (US Patent 319,596).
 * Features authentic Victorian tripod ordnance mount, water-cooling jacket with brass filler plugs,
 * knee-joint toggle lock mechanism, side fusee recoil spring box, canvas ammunition belt feed,
 * dual spade grip handles with butterfly trigger, and dynamic muzzle blast & steam venting.
 */

import * as THREE from "three";
import { createLcg } from "@/utils/lcg";

const lcg = createLcg(319596);

export interface MaximMachineGunModel {
  rootGroup: THREE.Group;
  gunGroup: THREE.Group;
  recoilingBarrelGroup: THREE.Group;
  toggleJointGroup: THREE.Group;
  crankHandle: THREE.Group;
  boltMesh: THREE.Mesh;
  ammoBeltGroup: THREE.Group;
  ejectionChuteGroup: THREE.Group;
  muzzleFlashMesh: THREE.Mesh;
  steamPoints: THREE.Points;
  spentCasesGroup: THREE.Group;
  materials: {
    gunmetal: THREE.MeshStandardMaterial;
    polishedSteel: THREE.MeshStandardMaterial;
    brass: THREE.MeshStandardMaterial;
    jacketMat: THREE.MeshStandardMaterial;
    woodHandle: THREE.MeshStandardMaterial;
    canvas: THREE.MeshStandardMaterial;
    flame: THREE.MeshStandardMaterial;
  };
  dispose: () => void;
}

export function buildMaximMachineGunModel(): MaximMachineGunModel {
  const rootGroup = new THREE.Group();
  const texturesToDispose: THREE.Texture[] = [];
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];

  // =========================================================================
  // MATERIALS
  // =========================================================================
  const gunmetal = new THREE.MeshStandardMaterial({
    color: 0x1e293b, // Deep blued ordnance steel
    roughness: 0.38,
    metalness: 0.88,
  });
  materialsToDispose.push(gunmetal);

  const jacketMat = new THREE.MeshStandardMaterial({
    color: 0x273549, // Corrugated water jacket dark blued steel
    roughness: 0.45,
    metalness: 0.82,
  });
  materialsToDispose.push(jacketMat);

  const polishedSteel = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0, // Mirror-finished hardened tool steel for bolt & toggle
    roughness: 0.15,
    metalness: 0.96,
  });
  materialsToDispose.push(polishedSteel);

  const brass = new THREE.MeshStandardMaterial({
    color: 0xd97706, // Polished yellow ordnance brass for sights, plugs, petcocks, cartridges
    roughness: 0.22,
    metalness: 0.92,
  });
  materialsToDispose.push(brass);

  const woodHandle = new THREE.MeshStandardMaterial({
    color: 0x5c2c16, // Turned English walnut spade grips
    roughness: 0.65,
    metalness: 0.1,
  });
  materialsToDispose.push(woodHandle);

  const canvas = new THREE.MeshStandardMaterial({
    color: 0x92704f, // Khaki woven canvas ammunition belt
    roughness: 0.85,
    metalness: 0.05,
  });
  materialsToDispose.push(canvas);

  const flame = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xf97316,
    emissiveIntensity: 4.5,
    roughness: 0.05,
    transparent: true,
    opacity: 0.92,
  });
  materialsToDispose.push(flame);

  // =========================================================================
  // 1. VICTORIAN ORDNANCE TRIPOD MOUNT & TRAVERSING GEAR
  // =========================================================================
  const mountGroup = new THREE.Group();
  mountGroup.position.set(0, -0.6, 0);

  // Central swivel socket and traversing dial
  const socketGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.65, 20);
  const socket = new THREE.Mesh(socketGeo, gunmetal);
  socket.castShadow = true;
  geometriesToDispose.push(socketGeo);
  mountGroup.add(socket);

  const dialGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.08, 24);
  const dial = new THREE.Mesh(dialGeo, brass);
  dial.position.set(0, 0.2, 0);
  geometriesToDispose.push(dialGeo);
  mountGroup.add(dial);

  // Elevation screw mechanism underneath cradle
  const elevScrewGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.8, 12);
  const elevScrew = new THREE.Mesh(elevScrewGeo, polishedSteel);
  elevScrew.position.set(-0.8, 0.35, 0);
  const handwheelGeo = new THREE.TorusGeometry(0.16, 0.035, 8, 16);
  const handwheel = new THREE.Mesh(handwheelGeo, brass);
  handwheel.position.set(-0.8, 0.1, 0);
  handwheel.rotation.x = Math.PI / 2;
  geometriesToDispose.push(elevScrewGeo, handwheelGeo);
  mountGroup.add(elevScrew, handwheel);

  // 3 Tubular Steel Legs with Spade Feet
  // Front leg
  const frontLegGeo = new THREE.CylinderGeometry(0.08, 0.06, 2.6, 12);
  const frontLeg = new THREE.Mesh(frontLegGeo, gunmetal);
  frontLeg.position.set(1.1, -1.05, 0);
  frontLeg.rotation.z = -0.55;
  frontLeg.castShadow = true;
  geometriesToDispose.push(frontLegGeo);
  mountGroup.add(frontLeg);

  // Rear left and right legs
  for (const zSign of [-1, 1]) {
    const rearLegGeo = new THREE.CylinderGeometry(0.08, 0.06, 2.6, 12);
    const rearLeg = new THREE.Mesh(rearLegGeo, gunmetal);
    rearLeg.position.set(-1.05, -1.05, zSign * 0.95);
    rearLeg.rotation.set(zSign * 0.38, 0, 0.52);
    rearLeg.castShadow = true;
    geometriesToDispose.push(rearLegGeo);
    mountGroup.add(rearLeg);
  }

  // Ammo Can Shelf on right leg
  const shelfGeo = new THREE.BoxGeometry(0.65, 0.05, 0.45);
  const shelf = new THREE.Mesh(shelfGeo, gunmetal);
  shelf.position.set(-0.2, -0.4, 0.75);
  const ammoCanGeo = new THREE.BoxGeometry(0.55, 0.45, 0.32);
  const ammoCan = new THREE.Mesh(ammoCanGeo, gunmetal);
  ammoCan.position.set(-0.2, -0.15, 0.75);
  geometriesToDispose.push(shelfGeo, ammoCanGeo);
  mountGroup.add(shelf, ammoCan);

  rootGroup.add(mountGroup);

  // =========================================================================
  // 2. MAIN GUN BODY (RECOILING SYSTEM & RECEIVER)
  // =========================================================================
  const gunGroup = new THREE.Group();
  gunGroup.position.set(0, 0.45, 0);

  // --- RECTANGULAR MILLED STEEL RECEIVER BOX ---
  const receiverGeo = new THREE.BoxGeometry(2.8, 0.95, 0.65);
  const receiver = new THREE.Mesh(receiverGeo, gunmetal);
  receiver.position.set(-0.8, 0, 0);
  receiver.castShadow = true;
  geometriesToDispose.push(receiverGeo);
  gunGroup.add(receiver);

  // Bronze Receiver Top Cover (hinged with latch)
  const topCoverGeo = new THREE.BoxGeometry(2.2, 0.12, 0.66);
  const topCover = new THREE.Mesh(topCoverGeo, brass);
  topCover.position.set(-0.7, 0.52, 0);
  geometriesToDispose.push(topCoverGeo);
  gunGroup.add(topCover);

  // Side Fusee Recoil Spring Box (Left side, Z = -0.38)
  const fuseeBoxGeo = new THREE.BoxGeometry(1.2, 0.45, 0.18);
  const fuseeBox = new THREE.Mesh(fuseeBoxGeo, gunmetal);
  fuseeBox.position.set(-0.6, 0.05, -0.41);
  const fuseeCapGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.22, 16);
  const fuseeCap = new THREE.Mesh(fuseeCapGeo, brass);
  fuseeCap.rotation.x = Math.PI / 2;
  fuseeCap.position.set(-1.05, 0.05, -0.42);
  geometriesToDispose.push(fuseeBoxGeo, fuseeCapGeo);
  gunGroup.add(fuseeBox, fuseeCap);

  // --- WATER-COOLED BARREL JACKET (Claim 1) ---
  const jacketGroup = new THREE.Group();
  jacketGroup.position.set(1.75, 0, 0);

  // Main cylindrical water jacket (holds 4.0 L of water)
  const jacketCylGeo = new THREE.CylinderGeometry(0.48, 0.48, 4.4, 28);
  const jacketCyl = new THREE.Mesh(jacketCylGeo, jacketMat);
  jacketCyl.rotation.z = Math.PI / 2;
  jacketCyl.castShadow = true;
  geometriesToDispose.push(jacketCylGeo);
  jacketGroup.add(jacketCyl);

  // Fluted cooling rings on jacket surface
  for (let i = -4; i <= 4; i++) {
    const ringGeo = new THREE.TorusGeometry(0.485, 0.015, 8, 28);
    const ring = new THREE.Mesh(ringGeo, gunmetal);
    ring.rotation.y = Math.PI / 2;
    ring.position.set(i * 0.45, 0, 0);
    geometriesToDispose.push(ringGeo);
    jacketGroup.add(ring);
  }

  // Brass water filler plug with chain near breech
  const fillerGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.18, 16);
  const filler = new THREE.Mesh(fillerGeo, brass);
  filler.position.set(-1.6, 0.52, 0);
  geometriesToDispose.push(fillerGeo);
  jacketGroup.add(filler);

  // Bottom brass drain petcock
  const drainGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.16, 12);
  const drain = new THREE.Mesh(drainGeo, brass);
  drain.position.set(-1.6, -0.52, 0);
  geometriesToDispose.push(drainGeo);
  jacketGroup.add(drain);

  // Forward Steam Vent Outlet Port & Condenser Hose Fitting
  const steamFittingGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.25, 12);
  const steamFitting = new THREE.Mesh(steamFittingGeo, brass);
  steamFitting.position.set(1.8, 0.5, 0);
  geometriesToDispose.push(steamFittingGeo);
  jacketGroup.add(steamFitting);

  gunGroup.add(jacketGroup);

  // --- RECOILING RIFLED BARREL & MUZZLE RECOIL BOOSTER ---
  const recoilingBarrelGroup = new THREE.Group();

  // Rifled steel barrel protruding through the front stuffing box
  const barrelGeo = new THREE.CylinderGeometry(0.14, 0.14, 5.6, 16);
  const barrel = new THREE.Mesh(barrelGeo, polishedSteel);
  barrel.rotation.z = Math.PI / 2;
  barrel.position.set(1.9, 0, 0);
  geometriesToDispose.push(barrelGeo);
  recoilingBarrelGroup.add(barrel);

  // Maxim Muzzle Gas Recoil Booster Cup (Claim 1)
  const boosterGroup = new THREE.Group();
  boosterGroup.position.set(4.0, 0, 0);
  const boosterBodyGeo = new THREE.CylinderGeometry(0.24, 0.22, 0.55, 16);
  const boosterBody = new THREE.Mesh(boosterBodyGeo, gunmetal);
  boosterBody.rotation.z = Math.PI / 2;
  const boosterConeGeo = new THREE.ConeGeometry(0.22, 0.35, 16);
  const boosterCone = new THREE.Mesh(boosterConeGeo, gunmetal);
  boosterCone.rotation.z = -Math.PI / 2;
  boosterCone.position.set(0.35, 0, 0);
  geometriesToDispose.push(boosterBodyGeo, boosterConeGeo);
  boosterGroup.add(boosterBody, boosterCone);
  recoilingBarrelGroup.add(boosterGroup);

  gunGroup.add(recoilingBarrelGroup);

  // --- KNEE-JOINT TOGGLE LOCK & BREECH BOLT ASSEMBLY (Claim 1) ---
  const toggleJointGroup = new THREE.Group();
  toggleJointGroup.position.set(-0.8, 0.12, 0);

  // Breech bolt slider block
  const boltGeo = new THREE.BoxGeometry(0.85, 0.42, 0.35);
  const boltMesh = new THREE.Mesh(boltGeo, polishedSteel);
  boltMesh.position.set(0.2, 0, 0);
  geometriesToDispose.push(boltGeo);
  toggleJointGroup.add(boltMesh);

  // Forward connecting link
  const fLinkGeo = new THREE.BoxGeometry(0.65, 0.14, 0.16);
  const fLink = new THREE.Mesh(fLinkGeo, polishedSteel);
  fLink.position.set(-0.35, 0.08, 0);
  geometriesToDispose.push(fLinkGeo);
  toggleJointGroup.add(fLink);

  // Rear toggle crank link
  const rLinkGeo = new THREE.BoxGeometry(0.65, 0.14, 0.16);
  const rLink = new THREE.Mesh(rLinkGeo, polishedSteel);
  rLink.position.set(-0.85, 0.08, 0);
  geometriesToDispose.push(rLinkGeo);
  toggleJointGroup.add(rLink);

  // External Crank Handle with Roller (Right side, Z = 0.38)
  const crankHandle = new THREE.Group();
  crankHandle.position.set(-1.15, 0, 0.38);
  const crankArmGeo = new THREE.BoxGeometry(0.65, 0.12, 0.08);
  const crankArm = new THREE.Mesh(crankArmGeo, gunmetal);
  crankArm.position.set(0.25, 0.1, 0);
  const crankKnobGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.22, 12);
  const crankKnob = new THREE.Mesh(crankKnobGeo, polishedSteel);
  crankKnob.rotation.x = Math.PI / 2;
  crankKnob.position.set(0.5, 0.15, 0.1);
  geometriesToDispose.push(crankArmGeo, crankKnobGeo);
  crankHandle.add(crankArm, crankKnob);
  gunGroup.add(crankHandle);

  gunGroup.add(toggleJointGroup);

  // --- DUAL SPADE GRIP REAR HANDLES & BUTTERFLY TRIGGER ---
  const rearGripGroup = new THREE.Group();
  rearGripGroup.position.set(-2.25, 0, 0);

  const crossbarGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.95, 12);
  const crossbar = new THREE.Mesh(crossbarGeo, gunmetal);
  crossbar.rotation.x = Math.PI / 2;
  geometriesToDispose.push(crossbarGeo);
  rearGripGroup.add(crossbar);

  // Two turned walnut wood handles
  for (const zSign of [-1, 1]) {
    const handleGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.75, 16);
    const handle = new THREE.Mesh(handleGeo, woodHandle);
    handle.position.set(-0.15, 0, zSign * 0.42);
    geometriesToDispose.push(handleGeo);
    rearGripGroup.add(handle);
  }

  // Central brass butterfly thumb trigger
  const triggerGeo = new THREE.BoxGeometry(0.18, 0.24, 0.15);
  const trigger = new THREE.Mesh(triggerGeo, brass);
  trigger.position.set(-0.05, 0.05, 0);
  geometriesToDispose.push(triggerGeo);
  rearGripGroup.add(trigger);

  gunGroup.add(rearGripGroup);

  // --- FOLDING TANGENT REAR SIGHT & FRONT BLADE SIGHT ---
  const rearSightGeo = new THREE.BoxGeometry(0.08, 0.45, 0.18);
  const rearSight = new THREE.Mesh(rearSightGeo, brass);
  rearSight.position.set(-1.8, 0.65, 0);
  const frontSightGeo = new THREE.ConeGeometry(0.04, 0.15, 8);
  const frontSight = new THREE.Mesh(frontSightGeo, brass);
  frontSight.position.set(3.8, 0.55, 0);
  geometriesToDispose.push(rearSightGeo, frontSightGeo);
  gunGroup.add(rearSight, frontSight);

  // --- CANVAS AMMUNITION BELT FEED MECHANISM ---
  const ammoBeltGroup = new THREE.Group();
  ammoBeltGroup.position.set(-0.4, 0.2, 0.35);

  // Canvas belt strip with brass cartridges
  for (let c = 0; c < 8; c++) {
    const roundG = new THREE.Group();
    roundG.position.set(0, -c * 0.18, c * 0.08);

    const caseGeo = new THREE.CylinderGeometry(0.045, 0.05, 0.38, 12);
    const cartridge = new THREE.Mesh(caseGeo, brass);
    cartridge.rotation.z = Math.PI / 2;
    cartridge.position.set(0, 0, 0);

    const bulletGeo = new THREE.ConeGeometry(0.044, 0.16, 12);
    const bullet = new THREE.Mesh(bulletGeo, polishedSteel);
    bullet.rotation.z = -Math.PI / 2;
    bullet.position.set(0.24, 0, 0);

    const pocketGeo = new THREE.BoxGeometry(0.12, 0.14, 0.14);
    const pocket = new THREE.Mesh(pocketGeo, canvas);

    geometriesToDispose.push(caseGeo, bulletGeo, pocketGeo);
    roundG.add(cartridge, bullet, pocket);
    ammoBeltGroup.add(roundG);
  }
  gunGroup.add(ammoBeltGroup);

  // --- LOWER FORWARD SPENT CASING EJECTION CHUTE ---
  const ejectionChuteGroup = new THREE.Group();
  ejectionChuteGroup.position.set(0.15, -0.42, 0);
  const chuteGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.55, 16);
  const chute = new THREE.Mesh(chuteGeo, gunmetal);
  chute.rotation.z = -0.35;
  geometriesToDispose.push(chuteGeo);
  ejectionChuteGroup.add(chute);
  gunGroup.add(ejectionChuteGroup);

  rootGroup.add(gunGroup);

  // =========================================================================
  // 3. DYNAMIC MUZZLE BLAST & STEAM VENTING PARTICLES
  // =========================================================================
  // High-temperature muzzle flash burst
  const flashGeo = new THREE.SphereGeometry(0.55, 16, 12);
  const muzzleFlashMesh = new THREE.Mesh(flashGeo, flame);
  muzzleFlashMesh.position.set(4.65, 0.45, 0);
  muzzleFlashMesh.visible = false;
  geometriesToDispose.push(flashGeo);
  rootGroup.add(muzzleFlashMesh);

  // Condenser steam particles emitting from front water jacket vent
  const steamCount = 50;
  const steamGeo = new THREE.BufferGeometry();
  const steamPositions = new Float32Array(steamCount * 3);
  for (let i = 0; i < steamCount; i++) {
    steamPositions[i * 3] = 3.55 + (lcg() - 0.5) * 0.3;
    steamPositions[i * 3 + 1] = 0.95 + lcg() * 0.8;
    steamPositions[i * 3 + 2] = (lcg() - 0.5) * 0.3;
  }
  steamGeo.setAttribute("position", new THREE.BufferAttribute(steamPositions, 3));
  const steamMat = new THREE.PointsMaterial({
    color: 0xe2e8f0,
    size: 0.12,
    transparent: true,
    opacity: 0,
  });
  materialsToDispose.push(steamMat);
  geometriesToDispose.push(steamGeo);
  const steamPoints = new THREE.Points(steamGeo, steamMat);
  rootGroup.add(steamPoints);

  // Spent Cartridge Cases Group
  const spentCasesGroup = new THREE.Group();
  for (let k = 0; k < 6; k++) {
    const sCaseGeo = new THREE.CylinderGeometry(0.045, 0.05, 0.35, 8);
    const sCase = new THREE.Mesh(sCaseGeo, brass);
    sCase.position.set(0.15 + (k % 3) * 0.15, -0.65 - Math.floor(k / 3) * 0.4, (k - 3) * 0.12);
    sCase.rotation.set(lcg() * Math.PI, lcg() * Math.PI, lcg() * Math.PI);
    geometriesToDispose.push(sCaseGeo);
    spentCasesGroup.add(sCase);
  }
  rootGroup.add(spentCasesGroup);

  return {
    rootGroup,
    gunGroup,
    recoilingBarrelGroup,
    toggleJointGroup,
    crankHandle,
    boltMesh,
    ammoBeltGroup,
    ejectionChuteGroup,
    muzzleFlashMesh,
    steamPoints,
    spentCasesGroup,
    materials: {
      gunmetal,
      polishedSteel,
      brass,
      jacketMat,
      woodHandle,
      canvas,
      flame,
    },
    dispose: () => {
      for (const t of texturesToDispose) {
        t.dispose();
      }
      for (const g of geometriesToDispose) {
        g.dispose();
      }
      for (const m of materialsToDispose) {
        m.dispose();
      }
    },
  };
}
