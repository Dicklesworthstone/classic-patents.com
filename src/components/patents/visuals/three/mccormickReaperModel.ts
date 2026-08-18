import * as THREE from "three";

function deterministicUnit(index: number, channel: number): number {
  let state = Math.imul(index + 1, 0x9e3779b1) ^ Math.imul(channel + 1, 0x85ebca6b);
  state ^= state >>> 16;
  state = Math.imul(state, 0x7feb352d);
  state ^= state >>> 15;
  state = Math.imul(state, 0x846ca68b);
  state ^= state >>> 16;
  return (state >>> 0) / 0x1_0000_0000;
}

export interface McCormickReaperModel {
  rootGroup: THREE.Group;
  platformGroup: THREE.Group;
  driveWheelGroup: THREE.Group;
  cutterAssembly: THREE.Group;
  sickleBarGroup: THREE.Group;
  reelGroup: THREE.Group;
  stalksInstanced: THREE.InstancedMesh;
  stalkCount: number;
  materials: {
    weatheredWood: THREE.MeshStandardMaterial;
    ashWood: THREE.MeshStandardMaterial;
    castIron: THREE.MeshStandardMaterial;
    sickleSteel: THREE.MeshStandardMaterial;
    brassGears: THREE.MeshStandardMaterial;
    strawMat: THREE.MeshStandardMaterial;
  };
  dispose: () => void;
}

export function buildMcCormickReaperModel(): McCormickReaperModel {
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  // --- 1. PBR MATERIALS ---
  const weatheredWood = new THREE.MeshStandardMaterial({
    color: 0x6b4226,
    roughness: 0.8,
    metalness: 0.05,
  });
  materialsToDispose.push(weatheredWood);

  const ashWood = new THREE.MeshStandardMaterial({
    color: 0xa16207,
    roughness: 0.6,
    metalness: 0.05,
  });
  materialsToDispose.push(ashWood);

  const castIron = new THREE.MeshStandardMaterial({
    color: 0x27272a,
    roughness: 0.4,
    metalness: 0.85,
  });
  materialsToDispose.push(castIron);

  const sickleSteel = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.15,
    metalness: 0.95,
  });
  materialsToDispose.push(sickleSteel);

  const brassGears = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.25,
    metalness: 0.9,
  });
  materialsToDispose.push(brassGears);

  const strawMat = new THREE.MeshStandardMaterial({
    color: 0xfde047,
    roughness: 0.9,
    metalness: 0.0,
  });
  materialsToDispose.push(strawMat);

  // --- 2. HEAVY TIMBER CHASSIS & GRAIN PLATFORM ---
  const platformGroup = new THREE.Group();
  rootGroup.add(platformGroup);

  // Wooden Grain Platform Deck
  const deckGeo = new THREE.BoxGeometry(6.5, 0.18, 4.5);
  geometriesToDispose.push(deckGeo);
  const platformDeck = new THREE.Mesh(deckGeo, weatheredWood);
  platformDeck.position.set(0.5, -0.6, -0.5);
  platformDeck.castShadow = true;
  platformDeck.receiveShadow = true;
  platformGroup.add(platformDeck);

  // Draft Tongue (Extending Forward to Team of Horses)
  const tongueGeo = new THREE.BoxGeometry(0.3, 0.35, 7.5);
  geometriesToDispose.push(tongueGeo);
  const draftTongue = new THREE.Mesh(tongueGeo, ashWood);
  draftTongue.position.set(3.2, -0.5, 4.2);
  draftTongue.castShadow = true;
  platformGroup.add(draftTongue);

  // Grain Divider Wedge Shoe (Claim 3)
  const dividerGeo = new THREE.ConeGeometry(0.6, 2.8, 4);
  geometriesToDispose.push(dividerGeo);
  const dividerShoe = new THREE.Mesh(dividerGeo, weatheredWood);
  dividerShoe.rotation.x = Math.PI / 2;
  dividerShoe.rotation.z = Math.PI / 4;
  dividerShoe.position.set(-2.8, -0.5, 2.0);
  dividerShoe.castShadow = true;
  platformGroup.add(dividerShoe);

  // --- 3. LARGE SPOKED GROUND DRIVE WHEEL & MASTER BULL GEAR ---
  const driveWheelGroup = new THREE.Group();
  driveWheelGroup.position.set(3.4, -0.2, 0);
  rootGroup.add(driveWheelGroup);

  const wheelRimGeo = new THREE.TorusGeometry(1.9, 0.14, 16, 36);
  geometriesToDispose.push(wheelRimGeo);
  const wheelRim = new THREE.Mesh(wheelRimGeo, castIron);
  wheelRim.rotation.y = Math.PI / 2;
  wheelRim.castShadow = true;
  driveWheelGroup.add(wheelRim);

  const spokeGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.7, 12);
  geometriesToDispose.push(spokeGeo);
  for (let sp = 0; sp < 8; sp++) {
    const spAngle = (sp * Math.PI) / 4;
    const spoke = new THREE.Mesh(spokeGeo, castIron);
    spoke.rotation.x = spAngle;
    driveWheelGroup.add(spoke);
  }

  const bullGearGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.22, 24);
  geometriesToDispose.push(bullGearGeo);
  const bullGear = new THREE.Mesh(bullGearGeo, brassGears);
  bullGear.rotation.z = Math.PI / 2;
  driveWheelGroup.add(bullGear);

  // --- 4. POINTED GUARD FINGERS & SERRATED SICKLE BAR (CLAIM 1) ---
  const cutterAssembly = new THREE.Group();
  cutterAssembly.position.set(0.5, -0.6, 1.8);
  rootGroup.add(cutterAssembly);

  const fingerCount = 18;
  const fingerGeo = new THREE.ConeGeometry(0.12, 0.75, 4);
  geometriesToDispose.push(fingerGeo);

  for (let f = 0; f < fingerCount; f++) {
    const fx = -2.8 + f * (5.6 / (fingerCount - 1));
    const finger = new THREE.Mesh(fingerGeo, castIron);
    finger.rotation.x = Math.PI / 2;
    finger.position.set(fx, 0, 0.35);
    finger.castShadow = true;
    cutterAssembly.add(finger);
  }

  // Reciprocating Serrated Sickle Bar
  const sickleBarGroup = new THREE.Group();
  cutterAssembly.add(sickleBarGroup);

  const sickleBackingGeo = new THREE.BoxGeometry(5.8, 0.08, 0.12);
  geometriesToDispose.push(sickleBackingGeo);
  const sickleSteelBacking = new THREE.Mesh(sickleBackingGeo, sickleSteel);
  sickleBarGroup.add(sickleSteelBacking);

  const toothGeo = new THREE.ConeGeometry(0.14, 0.45, 3);
  geometriesToDispose.push(toothGeo);
  for (let t = 0; t < fingerCount; t++) {
    const tx = -2.8 + t * (5.6 / (fingerCount - 1));
    const tooth = new THREE.Mesh(toothGeo, sickleSteel);
    tooth.rotation.x = Math.PI / 2;
    tooth.position.set(tx, 0.04, 0.2);
    sickleBarGroup.add(tooth);
  }

  const pitmanArmGeo = new THREE.BoxGeometry(0.12, 0.12, 1.8);
  geometriesToDispose.push(pitmanArmGeo);
  const pitmanArm = new THREE.Mesh(pitmanArmGeo, castIron);
  pitmanArm.position.set(3.0, 0, 0.8);
  pitmanArm.rotation.y = -Math.PI / 8;
  cutterAssembly.add(pitmanArm);

  // --- 5. REVOLVING 4-VANE GRAIN REEL (CLAIM 2) ---
  const reelGroup = new THREE.Group();
  reelGroup.position.set(0.5, 1.4, 0.8);
  rootGroup.add(reelGroup);

  const reelAxleGeo = new THREE.CylinderGeometry(0.12, 0.12, 6.2, 16);
  geometriesToDispose.push(reelAxleGeo);
  const reelAxle = new THREE.Mesh(reelAxleGeo, ashWood);
  reelAxle.rotation.z = Math.PI / 2;
  reelGroup.add(reelAxle);

  const armGeo = new THREE.BoxGeometry(0.08, 1.8, 0.08);
  geometriesToDispose.push(armGeo);
  const slatGeo = new THREE.BoxGeometry(6.0, 0.25, 0.04);
  geometriesToDispose.push(slatGeo);

  for (let v = 0; v < 4; v++) {
    const vAngle = (v * Math.PI) / 2;
    const vaneGroup = new THREE.Group();
    vaneGroup.rotation.x = vAngle;

    [-2.4, 2.4].forEach((axPos) => {
      const arm = new THREE.Mesh(armGeo, ashWood);
      arm.position.set(axPos, 0.9, 0);
      vaneGroup.add(arm);
    });

    const slat = new THREE.Mesh(slatGeo, ashWood);
    slat.position.set(0, 1.8, 0);
    slat.castShadow = true;
    vaneGroup.add(slat);

    reelGroup.add(vaneGroup);
  }

  // --- 6. STANDING WHEAT STALKS FIELD & CUT SHEAF ---
  const stalkCount = 45;
  const stalkGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.6, 6);
  geometriesToDispose.push(stalkGeo);

  const stalksInstanced = new THREE.InstancedMesh(stalkGeo, strawMat, stalkCount);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < stalkCount; i++) {
    dummy.position.set(
      -2.5 + deterministicUnit(i, 0) * 5.0,
      0.2,
      2.2 + deterministicUnit(i, 1) * 2.5,
    );
    dummy.rotation.set(
      (deterministicUnit(i, 2) - 0.5) * 0.2,
      0,
      (deterministicUnit(i, 3) - 0.5) * 0.2,
    );
    dummy.updateMatrix();
    stalksInstanced.setMatrixAt(i, dummy.matrix);
  }
  stalksInstanced.instanceMatrix.needsUpdate = true;
  rootGroup.add(stalksInstanced);

  // Cut Grain Sheaf Bundle
  const sheafGeo = new THREE.CylinderGeometry(0.35, 0.5, 2.2, 8);
  geometriesToDispose.push(sheafGeo);
  sheafGeo.rotateZ(Math.PI / 2);
  const sheafMesh = new THREE.Mesh(sheafGeo, strawMat);
  sheafMesh.position.set(0.6, -0.4, -0.6);
  sheafMesh.castShadow = true;
  platformGroup.add(sheafMesh);

  const dispose = () => {
    for (const geo of geometriesToDispose) geo.dispose();
    for (const mat of materialsToDispose) mat.dispose();
    for (const tex of texturesToDispose) tex.dispose();
  };

  return {
    rootGroup,
    platformGroup,
    driveWheelGroup,
    cutterAssembly,
    sickleBarGroup,
    reelGroup,
    stalksInstanced,
    stalkCount,
    materials: {
      weatheredWood,
      ashWood,
      castIron,
      sickleSteel,
      brassGears,
      strawMat,
    },
    dispose,
  };
}

/**
 * Updates Cyrus McCormick grain reaper master bull-wheel rotation, reel vanes, sickle bar reciprocating stroke, and platform cutaway.
 */
export function updateMcCormickReaperKinematics(
  model: McCormickReaperModel,
  wheelRadPerSec: number,
  reelRadPerSec: number,
  cutterRadPerSec: number,
  elapsedSeconds: number,
  showStalks: boolean,
  isCutaway = false,
): void {
  model.driveWheelGroup.rotation.x = elapsedSeconds * wheelRadPerSec;
  model.reelGroup.rotation.x = elapsedSeconds * reelRadPerSec;
  model.sickleBarGroup.position.x = Math.sin(elapsedSeconds * cutterRadPerSec) * 0.22;
  model.stalksInstanced.visible = showStalks;

  // Cutaway mode: make wooden platform deck and divider boards translucent
  model.materials.weatheredWood.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.weatheredWood.transparent = isCutaway;
  model.materials.ashWood.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.ashWood.transparent = isCutaway;
}
