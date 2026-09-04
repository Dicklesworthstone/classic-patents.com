import * as THREE from "three";
import type { McCormickKinematicPhases } from "@/physics/mccormickReaperKernel";
import { mccormickReelCrate } from "@/physics/genericWasm";

function deterministicUnit(index: number, channel: number): number {
  let state = Math.imul(index + 1, 0x9e3779b1) ^ Math.imul(channel + 1, 0x85ebca6b);
  state ^= state >>> 16;
  state = Math.imul(state, 0x7feb352d);
  state ^= state >>> 15;
  state = Math.imul(state, 0x846ca68b);
  state ^= state >>> 16;
  return (state >>> 0) / 0x1_0000_0000;
}

/**
 * Procedural Weathered 1830s Farm Oak & Ash Timber Plank Texture
 */
function createWeatheredWoodTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  // Rustic weathered oak brown
  ctx.fillStyle = "#59361e";
  ctx.fillRect(0, 0, 512, 512);

  // Longitudinal wood grain & saw kerf striations
  for (let i = 0; i < 90; i++) {
    const x = i * 5.7 + (deterministicUnit(i, 0) - 0.5) * 3;
    const alpha = 0.08 + (i % 5 === 0 ? 0.14 : 0.04);
    ctx.strokeStyle = `rgba(30, 15, 6, ${alpha})`;
    ctx.lineWidth = 1.3 + (i % 3) * 0.5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(x + 12, 170, x - 10, 340, x + 6, 512);
    ctx.stroke();
  }

  // Weathering checks & wood pores
  for (let p = 0; p < 240; p++) {
    const px = deterministicUnit(p, 1) * 512;
    const py = deterministicUnit(p, 2) * 512;
    ctx.fillStyle = "rgba(20, 8, 3, 0.3)";
    ctx.fillRect(px, py, 2.2, 5 + deterministicUnit(p, 3) * 7);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export interface McCormickReaperModel {
  rootGroup: THREE.Group;
  platformGroup: THREE.Group;
  driveWheelGroup: THREE.Group;
  countershaftGroup: THREE.Group;
  cutterCrankGroup: THREE.Group;
  cutterAssembly: THREE.Group;
  sickleBarGroup: THREE.Group;
  upperCutterGroup: THREE.Group;
  lowerPitman: THREE.Mesh;
  upperPitman: THREE.Mesh;
  reelGroup: THREE.Group;
  reelBeltSegments: readonly THREE.Mesh[];
  stalksInstanced: THREE.InstancedMesh;
  stalkCount: number;
  materials: {
    weatheredWood: THREE.MeshStandardMaterial;
    ashWood: THREE.MeshStandardMaterial;
    castIron: THREE.MeshStandardMaterial;
    sickleSteel: THREE.MeshStandardMaterial;
    brassGears: THREE.MeshStandardMaterial;
    strawMat: THREE.MeshStandardMaterial;
    wroughtIron?: THREE.MeshStandardMaterial;
    varnishedTimber?: THREE.MeshStandardMaterial;
  };
  dispose: () => void;
}

function setBeamBetween(mesh: THREE.Mesh, start: THREE.Vector3, end: THREE.Vector3): void {
  const direction = end.clone().sub(start);
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.scale.set(1, direction.length(), 1);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
}

export function buildMcCormickReaperModel(): McCormickReaperModel {
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  const woodTex = createWeatheredWoodTexture();
  if (woodTex) texturesToDispose.push(woodTex);

  // --- 1. PBR MATERIALS ---
  const weatheredWood = new THREE.MeshStandardMaterial({
    ...(woodTex ? { map: woodTex } : {}),
    transparent: true,
    opacity: 1.0,
    color: 0x6b4226,
    roughness: 0.8,
    metalness: 0.05,
  });
  materialsToDispose.push(weatheredWood);

  const ashWood = new THREE.MeshStandardMaterial({
    color: 0xa16207,
    roughness: 0.6,
    metalness: 0.05,
    transparent: true,
    opacity: 1.0,
  });
  materialsToDispose.push(ashWood);

  const castIron = new THREE.MeshStandardMaterial({
    color: 0x27272a,
    roughness: 0.45,
    metalness: 0.85,
  });
  materialsToDispose.push(castIron);

  const wroughtIron = new THREE.MeshStandardMaterial({
    color: 0x3f3f46,
    roughness: 0.35,
    metalness: 0.9,
  });
  materialsToDispose.push(wroughtIron);

  const sickleSteel = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.12,
    metalness: 0.96,
  });
  materialsToDispose.push(sickleSteel);

  const brassGears = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.22,
    metalness: 0.9,
  });
  materialsToDispose.push(brassGears);

  const strawMat = new THREE.MeshStandardMaterial({
    color: 0xfde047,
    roughness: 0.9,
    metalness: 0.0,
  });
  materialsToDispose.push(strawMat);

  const beltLeather = new THREE.MeshStandardMaterial({
    color: 0x713f12,
    roughness: 0.82,
    metalness: 0.02,
  });
  materialsToDispose.push(beltLeather);

  function buildSpurGear(
    name: string,
    teeth: number,
    pitchRadius: number,
    thickness: number,
  ): THREE.Group {
    const gear = new THREE.Group();
    gear.name = name;
    const coreGeometry = new THREE.CylinderGeometry(
      Math.max(0.08, pitchRadius - 0.07),
      Math.max(0.08, pitchRadius - 0.07),
      thickness,
      Math.max(16, teeth * 2),
    );
    geometriesToDispose.push(coreGeometry);
    const core = new THREE.Mesh(coreGeometry, brassGears);
    core.rotation.z = Math.PI / 2;
    gear.add(core);

    const toothGeometry = new THREE.BoxGeometry(thickness, 0.14, 0.09);
    geometriesToDispose.push(toothGeometry);
    const toothInstances = new THREE.InstancedMesh(toothGeometry, brassGears, teeth);
    toothInstances.name = `${name}-${teeth}-teeth`;
    const tooth = new THREE.Object3D();
    for (let index = 0; index < teeth; index += 1) {
      const angle = (index * Math.PI * 2) / teeth;
      tooth.position.set(0, Math.cos(angle) * pitchRadius, Math.sin(angle) * pitchRadius);
      tooth.rotation.set(angle, 0, 0);
      tooth.updateMatrix();
      toothInstances.setMatrixAt(index, tooth.matrix);
    }
    toothInstances.instanceMatrix.needsUpdate = true;
    gear.add(toothInstances);
    return gear;
  }

  // --- 2. HEAVY TIMBER CHASSIS & GRAIN PLATFORM ---
  const platformGroup = new THREE.Group();
  rootGroup.add(platformGroup);

  // Wooden Grain Platform Deck with longitudinal planks
  const deckGeo = new THREE.BoxGeometry(6.6, 0.18, 4.6);
  geometriesToDispose.push(deckGeo);
  const platformDeck = new THREE.Mesh(deckGeo, weatheredWood);
  platformDeck.position.set(0.5, -0.6, -0.5);
  platformDeck.castShadow = true;
  platformDeck.receiveShadow = true;
  platformGroup.add(platformDeck);

  // Timber framing cross-sills
  [-2.6, 0, 2.6].forEach((cx) => {
    const sillGeo = new THREE.BoxGeometry(0.22, 0.28, 4.8);
    geometriesToDispose.push(sillGeo);
    const sill = new THREE.Mesh(sillGeo, ashWood);
    sill.position.set(cx + 0.5, -0.8, -0.5);
    sill.castShadow = true;
    platformGroup.add(sill);
  });

  // Draft Tongue extending forward for horse team
  const tongueGeo = new THREE.BoxGeometry(0.32, 0.38, 7.8);
  geometriesToDispose.push(tongueGeo);
  const draftTongue = new THREE.Mesh(tongueGeo, ashWood);
  draftTongue.position.set(3.3, -0.5, 4.3);
  draftTongue.castShadow = true;
  platformGroup.add(draftTongue);

  // Singletrees / Evener bar on draft tongue
  const evenerGeo = new THREE.BoxGeometry(2.4, 0.14, 0.16);
  geometriesToDispose.push(evenerGeo);
  const evener = new THREE.Mesh(evenerGeo, ashWood);
  evener.position.set(3.3, -0.32, 7.5);
  platformGroup.add(evener);

  // Grain-divider bow and shoe claimed as part of the source's second claim.
  const dividerGeo = new THREE.ConeGeometry(0.65, 3.2, 4);
  geometriesToDispose.push(dividerGeo);
  const dividerShoe = new THREE.Mesh(dividerGeo, weatheredWood);
  dividerShoe.rotation.x = Math.PI / 2;
  dividerShoe.rotation.z = Math.PI / 4;
  dividerShoe.position.set(-2.9, -0.5, 2.2);
  dividerShoe.castShadow = true;
  platformGroup.add(dividerShoe);

  // Curved iron grain separator rod on divider
  const rodGeo = new THREE.TorusGeometry(1.2, 0.04, 8, 16, Math.PI * 0.7);
  geometriesToDispose.push(rodGeo);
  const separatorRod = new THREE.Mesh(rodGeo, wroughtIron);
  separatorRod.rotation.y = Math.PI / 2;
  separatorRod.position.set(-2.9, 0.2, 1.8);
  platformGroup.add(separatorRod);

  // Outer grain wheel (small wheel on non-drive side)
  const grainWheelGeo = new THREE.TorusGeometry(0.9, 0.08, 12, 24);
  geometriesToDispose.push(grainWheelGeo);
  const grainWheel = new THREE.Mesh(grainWheelGeo, castIron);
  grainWheel.rotation.y = Math.PI / 2;
  grainWheel.position.set(-2.9, -0.7, -0.5);
  grainWheel.castShadow = true;
  platformGroup.add(grainWheel);

  // --- 3. LARGE SPOKED GROUND DRIVE WHEEL & MASTER BULL GEAR ---
  const driveWheelGroup = new THREE.Group();
  driveWheelGroup.position.set(3.4, -0.2, 0);
  rootGroup.add(driveWheelGroup);

  const wheelRimGeo = new THREE.TorusGeometry(1.95, 0.14, 16, 36);
  geometriesToDispose.push(wheelRimGeo);
  const wheelRim = new THREE.Mesh(wheelRimGeo, castIron);
  wheelRim.rotation.y = Math.PI / 2;
  wheelRim.castShadow = true;
  driveWheelGroup.add(wheelRim);

  // 12 Diagonal Traction Cleats on wheel tire
  const cleatGeo = new THREE.BoxGeometry(0.12, 0.32, 0.45);
  geometriesToDispose.push(cleatGeo);
  for (let cl = 0; cl < 12; cl++) {
    const clAngle = (cl * Math.PI * 2) / 12;
    const cleat = new THREE.Mesh(cleatGeo, castIron);
    cleat.position.set(0, Math.cos(clAngle) * 2.05, Math.sin(clAngle) * 2.05);
    cleat.rotation.x = clAngle + 0.35;
    driveWheelGroup.add(cleat);
  }

  // 8 Heavy cast-iron wheel spokes
  const spokeGeo = new THREE.CylinderGeometry(0.065, 0.075, 3.8, 12);
  geometriesToDispose.push(spokeGeo);
  for (let sp = 0; sp < 8; sp++) {
    const spAngle = (sp * Math.PI) / 4;
    const spoke = new THREE.Mesh(spokeGeo, castIron);
    spoke.rotation.x = spAngle;
    driveWheelGroup.add(spoke);
  }

  // The source prints both tooth counts. Preserve the complete 30:9 × 27:9
  // train instead of substituting smooth decorative discs.
  const groundGear = buildSpurGear("source-ground-gear", 30, 0.75, 0.2);
  groundGear.position.x = -0.35;
  driveWheelGroup.add(groundGear);

  const countershaftGroup = new THREE.Group();
  countershaftGroup.name = "source-nine-and-twenty-seven-tooth-countershaft";
  countershaftGroup.position.set(3.05, -0.2, 0.975);
  rootGroup.add(countershaftGroup);
  const firstPinion = buildSpurGear("source-first-pinion", 9, 0.225, 0.2);
  countershaftGroup.add(firstPinion);
  const countershaftGear = buildSpurGear("source-countershaft-gear", 27, 0.675, 0.2);
  countershaftGear.position.x = -0.5;
  countershaftGroup.add(countershaftGear);
  const countershaftAxleGeometry = new THREE.CylinderGeometry(0.07, 0.07, 1.05, 12);
  geometriesToDispose.push(countershaftAxleGeometry);
  const countershaftAxle = new THREE.Mesh(countershaftAxleGeometry, wroughtIron);
  countershaftAxle.rotation.z = Math.PI / 2;
  countershaftAxle.position.x = -0.25;
  countershaftGroup.add(countershaftAxle);

  const cutterCrankGroup = new THREE.Group();
  cutterCrankGroup.name = "source-nine-tooth-upright-double-crank";
  cutterCrankGroup.position.set(2.55, -0.2, 1.875);
  rootGroup.add(cutterCrankGroup);
  const crankPinion = buildSpurGear("source-crank-pinion", 9, 0.225, 0.22);
  cutterCrankGroup.add(crankPinion);
  const crankAxleGeometry = new THREE.CylinderGeometry(0.075, 0.075, 0.72, 12);
  geometriesToDispose.push(crankAxleGeometry);
  const crankAxle = new THREE.Mesh(crankAxleGeometry, wroughtIron);
  crankAxle.rotation.z = Math.PI / 2;
  cutterCrankGroup.add(crankAxle);
  const crankPinGeometry = new THREE.SphereGeometry(0.09, 12, 8);
  geometriesToDispose.push(crankPinGeometry);
  for (const [x, y] of [
    [-0.22, 0.24],
    [0.22, -0.24],
  ] as const) {
    const pin = new THREE.Mesh(crankPinGeometry, sickleSteel);
    pin.position.set(x, y, 0);
    cutterCrankGroup.add(pin);
  }

  // --- 4. DOUBLE-CRANK CONTRARY CUTTERS AND SUPPORT FINGERS (CLAIM 1) ---
  const cutterAssembly = new THREE.Group();
  cutterAssembly.position.set(0.5, -0.6, 1.85);
  rootGroup.add(cutterAssembly);

  const fingerCount = 18;
  const fingerGeo = new THREE.ConeGeometry(0.12, 0.8, 4);
  geometriesToDispose.push(fingerGeo);

  for (let f = 0; f < fingerCount; f++) {
    const fx = -2.8 + f * (5.6 / (fingerCount - 1));
    const finger = new THREE.Mesh(fingerGeo, castIron);
    finger.rotation.x = Math.PI / 2;
    finger.position.set(fx, 0, 0.38);
    finger.castShadow = true;
    cutterAssembly.add(finger);
  }

  // Reciprocating Serrated Sickle Bar with triangular knife sections
  const sickleBarGroup = new THREE.Group();
  cutterAssembly.add(sickleBarGroup);

  const sickleBackingGeo = new THREE.BoxGeometry(5.8, 0.08, 0.12);
  geometriesToDispose.push(sickleBackingGeo);
  const sickleSteelBacking = new THREE.Mesh(sickleBackingGeo, sickleSteel);
  sickleBarGroup.add(sickleSteelBacking);

  const toothGeo = new THREE.ConeGeometry(0.14, 0.48, 3);
  geometriesToDispose.push(toothGeo);
  for (let t = 0; t < fingerCount; t++) {
    const tx = -2.8 + t * (5.6 / (fingerCount - 1));
    const tooth = new THREE.Mesh(toothGeo, sickleSteel);
    tooth.rotation.x = Math.PI / 2;
    tooth.position.set(tx, 0.04, 0.22);
    sickleBarGroup.add(tooth);
  }

  // The disclosed double-crank option gives the upper gathering teeth equal
  // and contrary motion, supporting stalks against the lower cutting edge.
  const upperCutterGroup = new THREE.Group();
  upperCutterGroup.name = "source-contrary-upper-gathering-blade";
  cutterAssembly.add(upperCutterGroup);
  const upperBacking = new THREE.Mesh(sickleBackingGeo, wroughtIron);
  upperBacking.position.y = 0.16;
  upperCutterGroup.add(upperBacking);
  const upperToothGeometry = new THREE.ConeGeometry(0.13, 0.56, 3);
  geometriesToDispose.push(upperToothGeometry);
  for (let toothIndex = 0; toothIndex < fingerCount; toothIndex += 1) {
    const tooth = new THREE.Mesh(upperToothGeometry, wroughtIron);
    tooth.rotation.x = -Math.PI / 2;
    tooth.rotation.z = 0.12;
    tooth.position.set(-2.8 + toothIndex * (5.6 / (fingerCount - 1)), 0.16, 0.2);
    upperCutterGroup.add(tooth);
  }

  const pitmanGeometry = new THREE.CylinderGeometry(0.055, 0.065, 1, 10);
  geometriesToDispose.push(pitmanGeometry);
  const lowerPitman = new THREE.Mesh(pitmanGeometry, ashWood);
  lowerPitman.name = "source-lower-pitman";
  rootGroup.add(lowerPitman);
  const upperPitman = new THREE.Mesh(pitmanGeometry, ashWood);
  upperPitman.name = "source-upper-pitman";
  rootGroup.add(upperPitman);

  // --- 5. REVOLVING 4-VANE GRAIN REEL & UPRIGHT TIMBER POSTS (CLAIM 2) ---
  // Heavy Ash Timber Reel Uprights & Diagonal Struts mounted to Chassis Sills
  [-2.2, 3.2].forEach((ux) => {
    const postGeo = new THREE.BoxGeometry(0.24, 2.4, 0.24);
    geometriesToDispose.push(postGeo);
    const uprightPost = new THREE.Mesh(postGeo, ashWood);
    uprightPost.position.set(ux, 0.4, 0.85);
    uprightPost.castShadow = true;
    platformGroup.add(uprightPost);

    // Diagonal support strut
    const strutGeo = new THREE.BoxGeometry(0.18, 2.2, 0.18);
    geometriesToDispose.push(strutGeo);
    const strut = new THREE.Mesh(strutGeo, ashWood);
    strut.position.set(ux, 0.3, -0.2);
    strut.rotation.x = -0.55;
    platformGroup.add(strut);

    // Bearing box atop upright post
    const boxGeo = new THREE.BoxGeometry(0.32, 0.32, 0.38);
    geometriesToDispose.push(boxGeo);
    const bearingBox = new THREE.Mesh(boxGeo, castIron);
    bearingBox.position.set(ux, 1.45, 0.85);
    platformGroup.add(bearingBox);
  });

  // Reel Drive Pulley & Crossed Leather Belt from Main Wheel Axle
  const reelPulleyGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.12, 16);
  geometriesToDispose.push(reelPulleyGeo);
  const reelPulley = new THREE.Mesh(reelPulleyGeo, castIron);
  reelPulley.rotation.z = Math.PI / 2;
  reelPulley.position.set(3.4, 1.45, 0.85);
  platformGroup.add(reelPulley);

  const beltGeo = new THREE.BoxGeometry(0.06, 1.8, 0.1);
  geometriesToDispose.push(beltGeo);
  const driveBelt = new THREE.Mesh(beltGeo, weatheredWood);
  driveBelt.position.set(3.4, 0.6, 0.4);
  driveBelt.rotation.x = 0.45;
  platformGroup.add(driveBelt);

  const reelGroup = new THREE.Group();
  reelGroup.position.set(0.5, 1.45, 0.85);
  rootGroup.add(reelGroup);

  const reelAxleGeo = new THREE.CylinderGeometry(0.12, 0.12, 6.4, 16);
  geometriesToDispose.push(reelAxleGeo);
  const reelAxle = new THREE.Mesh(reelAxleGeo, ashWood);
  reelAxle.rotation.z = Math.PI / 2;
  reelGroup.add(reelAxle);

  // 4 Spider hubs on axle
  [-2.5, 2.5].forEach((hx) => {
    const hubGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.18, 16);
    geometriesToDispose.push(hubGeo);
    const hub = new THREE.Mesh(hubGeo, castIron);
    hub.rotation.z = Math.PI / 2;
    hub.position.x = hx;
    reelGroup.add(hub);
  });

  const armGeo = new THREE.BoxGeometry(0.08, 1.85, 0.08);
  geometriesToDispose.push(armGeo);
  const slatGeo = new THREE.BoxGeometry(6.2, 0.26, 0.04);
  geometriesToDispose.push(slatGeo);

  for (let v = 0; v < 4; v++) {
    const vAngle = (v * Math.PI) / 2;
    const vaneGroup = new THREE.Group();
    vaneGroup.rotation.x = vAngle;

    [-2.4, 2.4].forEach((axPos) => {
      const arm = new THREE.Mesh(armGeo, ashWood);
      arm.position.set(axPos, 0.95, 0);
      vaneGroup.add(arm);
    });

    const slat = new THREE.Mesh(slatGeo, ashWood);
    slat.position.set(0, 1.85, 0);
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

  // Cut Grain Sheaf Bundle on platform deck
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
      wroughtIron,
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
  const flex = mccormickReelCrate(reelRadPerSec).reelFlex;
  model.driveWheelGroup.rotation.x = elapsedSeconds * wheelRadPerSec;
  model.reelGroup.rotation.x = elapsedSeconds * reelRadPerSec;
  model.sickleBarGroup.position.x = Math.sin(elapsedSeconds * cutterRadPerSec) * 0.22 * flex;
  model.stalksInstanced.visible = showStalks;

  // Cutaway mode: make wooden platform deck and divider boards translucent
  model.materials.weatheredWood.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.weatheredWood.transparent = isCutaway;
  model.materials.ashWood.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.ashWood.transparent = isCutaway;
}
