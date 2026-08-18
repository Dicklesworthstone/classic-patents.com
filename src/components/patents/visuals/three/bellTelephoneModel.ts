import * as THREE from "three";
import { createGlowPointTexture } from "./ThreeStudioScene";

export interface BellTelephoneModel {
  rootGroup: THREE.Group;
  phoneGroup: THREE.Group;
  hornMesh: THREE.Mesh;
  diaphragmMesh: THREE.Mesh;
  rodGroup: THREE.Group;
  platinumRod: THREE.Mesh;
  linkArm: THREE.Mesh;
  glassCup: THREE.Mesh;
  liquidMesh: THREE.Mesh;
  waveRings: THREE.Mesh[];
  electronPoints: THREE.Points;
  electronPositions: Float32Array;
  electronCount: number;
  materials: {
    brass: THREE.MeshStandardMaterial;
    polishedWood: THREE.MeshStandardMaterial;
    diaphragmMat: THREE.MeshStandardMaterial;
    glassCupMat: THREE.MeshPhysicalMaterial;
    liquidMat: THREE.MeshStandardMaterial;
    platinumRodMat: THREE.MeshStandardMaterial;
    batteryJarMat: THREE.MeshStandardMaterial;
    electronMat: THREE.PointsMaterial;
  };
  dispose: () => void;
}

export function buildBellTelephoneModel(): BellTelephoneModel {
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  // --- 1. PBR MATERIALS ---
  const brass = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.22,
    metalness: 0.9,
  });
  materialsToDispose.push(brass);

  const polishedWood = new THREE.MeshStandardMaterial({
    color: 0x5c2c16,
    roughness: 0.38,
    metalness: 0.08,
  });
  materialsToDispose.push(polishedWood);

  const diaphragmMat = new THREE.MeshStandardMaterial({
    color: 0xfef3c7,
    roughness: 0.55,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });
  materialsToDispose.push(diaphragmMat);

  const glassCupMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.92,
    opacity: 1,
    transparent: true,
    roughness: 0.05,
    ior: 1.45,
  });
  materialsToDispose.push(glassCupMat);

  const liquidMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.1,
    metalness: 0.1,
    transparent: true,
    opacity: 0.75,
  });
  materialsToDispose.push(liquidMat);

  const platinumRodMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.08,
    metalness: 0.98,
  });
  materialsToDispose.push(platinumRodMat);

  const batteryJarMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.32,
    metalness: 0.75,
  });
  materialsToDispose.push(batteryJarMat);

  // --- 2. 3D TELEPHONE TRANSMITTER APPARATUS ---
  const phoneGroup = new THREE.Group();
  rootGroup.add(phoneGroup);

  // Beveled Walnut Instrument Base Board
  const baseGeo = new THREE.BoxGeometry(10.5, 0.6, 6.2);
  geometriesToDispose.push(baseGeo);
  const baseBoard = new THREE.Mesh(baseGeo, polishedWood);
  baseBoard.position.y = -3.2;
  baseBoard.receiveShadow = true;
  phoneGroup.add(baseBoard);

  // Flared Acoustic Speaking Horn Cone
  const hornPoints: THREE.Vector2[] = [
    new THREE.Vector2(0.42, 0),
    new THREE.Vector2(0.45, 0.6),
    new THREE.Vector2(0.55, 1.4),
    new THREE.Vector2(0.85, 2.4),
    new THREE.Vector2(1.35, 3.2),
    new THREE.Vector2(1.85, 3.7),
    new THREE.Vector2(1.88, 3.8),
  ];
  const hornGeo = new THREE.LatheGeometry(hornPoints, 48);
  geometriesToDispose.push(hornGeo);
  const hornMesh = new THREE.Mesh(hornGeo, brass);
  hornMesh.rotation.z = -Math.PI / 2;
  hornMesh.position.set(-1.4, 0.5, 0);
  hornMesh.castShadow = true;
  phoneGroup.add(hornMesh);

  // Diaphragm Retaining Collar Ring
  const collarGeo = new THREE.TorusGeometry(0.52, 0.08, 12, 32);
  geometriesToDispose.push(collarGeo);
  const collarMesh = new THREE.Mesh(collarGeo, brass);
  collarMesh.rotation.y = Math.PI / 2;
  collarMesh.position.set(-1.4, 0.5, 0);
  phoneGroup.add(collarMesh);

  // Peripheral Clamping Screws
  const screwGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.15, 8);
  geometriesToDispose.push(screwGeo);
  for (let s = 0; s < 6; s++) {
    const sAngle = (s * Math.PI * 2) / 6;
    const screw = new THREE.Mesh(screwGeo, brass);
    screw.rotation.z = Math.PI / 2;
    screw.position.set(-1.4, 0.5 + Math.sin(sAngle) * 0.52, Math.cos(sAngle) * 0.52);
    phoneGroup.add(screw);
  }

  // Flexible Drum Membrane Diaphragm Disc
  const diaphragmGeo = new THREE.CircleGeometry(0.48, 36);
  geometriesToDispose.push(diaphragmGeo);
  const diaphragmMesh = new THREE.Mesh(diaphragmGeo, diaphragmMat);
  diaphragmMesh.rotation.y = Math.PI / 2;
  diaphragmMesh.position.set(-1.38, 0.5, 0);
  diaphragmMesh.castShadow = true;
  phoneGroup.add(diaphragmMesh);

  // Glass Beaker Reservoir Cup
  const beakerPoints: THREE.Vector2[] = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(1.0, 0),
    new THREE.Vector2(1.05, 0.1),
    new THREE.Vector2(1.1, 1.8),
    new THREE.Vector2(1.22, 2.2),
  ];
  const beakerGeo = new THREE.LatheGeometry(beakerPoints, 36);
  geometriesToDispose.push(beakerGeo);
  const glassCup = new THREE.Mesh(beakerGeo, glassCupMat);
  glassCup.position.set(2.0, -2.4, 0);
  phoneGroup.add(glassCup);

  // Acidulated Electrolyte Liquid
  const liquidGeo = new THREE.CylinderGeometry(1.04, 0.98, 1.6, 36);
  geometriesToDispose.push(liquidGeo);
  const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
  liquidMesh.position.set(2.0, -1.5, 0);
  phoneGroup.add(liquidMesh);

  // Platinum Base Bottom Electrode Plate
  const baseElectrodeGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.12, 16);
  geometriesToDispose.push(baseElectrodeGeo);
  const baseElectrode = new THREE.Mesh(baseElectrodeGeo, platinumRodMat);
  baseElectrode.position.set(2.0, -2.3, 0);
  phoneGroup.add(baseElectrode);

  // Movable Dipping Platinum Needle Rod
  const rodGroup = new THREE.Group();
  rodGroup.position.set(2.0, 0.6, 0);
  phoneGroup.add(rodGroup);

  const platinumRodGeo = new THREE.CylinderGeometry(0.045, 0.02, 2.4, 16);
  geometriesToDispose.push(platinumRodGeo);
  const platinumRod = new THREE.Mesh(platinumRodGeo, platinumRodMat);
  platinumRod.castShadow = true;
  rodGroup.add(platinumRod);

  // Central Brass Fulcrum Post & Pivoting Lever Link Arm
  const fulcrumGeo = new THREE.CylinderGeometry(0.12, 0.15, 2.2, 16);
  geometriesToDispose.push(fulcrumGeo);
  const fulcrumPost = new THREE.Mesh(fulcrumGeo, brass);
  fulcrumPost.position.set(0.35, -0.6, 0);
  fulcrumPost.castShadow = true;
  phoneGroup.add(fulcrumPost);

  const linkArmGeo = new THREE.BoxGeometry(3.5, 0.08, 0.08);
  geometriesToDispose.push(linkArmGeo);
  const linkArm = new THREE.Mesh(linkArmGeo, brass);
  linkArm.position.set(0.35, 0.5, 0);
  linkArm.castShadow = true;
  phoneGroup.add(linkArm);

  // Battery Chemical Jar Cells
  const batteryGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.6, 24);
  geometriesToDispose.push(batteryGeo);
  for (let b = 0; b < 2; b++) {
    const battery = new THREE.Mesh(batteryGeo, batteryJarMat);
    battery.position.set(-3.2 + b * 1.8, -2.1, 1.8);
    battery.castShadow = true;
    phoneGroup.add(battery);
  }

  // --- 3. ACOUSTIC SOUND PRESSURE WAVES ---
  const waveCount = 5;
  const waveRings: THREE.Mesh[] = [];
  for (let i = 0; i < waveCount; i++) {
    const ringGeo = new THREE.TorusGeometry(0.6 + i * 0.45, 0.03, 12, 36);
    geometriesToDispose.push(ringGeo);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.7 - i * 0.12,
    });
    materialsToDispose.push(ringMat);
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.y = Math.PI / 2;
    ring.position.set(-5.5 - i * 0.6, 0.5, 0);
    phoneGroup.add(ring);
    waveRings.push(ring);
  }

  // --- 4. GLOWING ELECTRICAL CURRENT PARTICLES ---
  const electronCount = 80;
  const electronGeo = new THREE.BufferGeometry();
  geometriesToDispose.push(electronGeo);
  const electronPositions = new Float32Array(electronCount * 3);
  const glowTex = createGlowPointTexture();
  texturesToDispose.push(glowTex);

  for (let i = 0; i < electronCount; i++) {
    const idx = i * 3;
    const t = i / electronCount;
    electronPositions[idx] = -3.2 + t * 5.2;
    electronPositions[idx + 1] = -2.1 + (t < 0.5 ? 0 : 2.6 * (t - 0.5) * 2);
    electronPositions[idx + 2] = 1.8 * (1 - t);
  }

  electronGeo.setAttribute("position", new THREE.BufferAttribute(electronPositions, 3));

  const electronMat = new THREE.PointsMaterial({
    size: 0.26,
    map: glowTex,
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  materialsToDispose.push(electronMat);

  const electronPoints = new THREE.Points(electronGeo, electronMat);
  phoneGroup.add(electronPoints);

  const dispose = () => {
    for (const geo of geometriesToDispose) geo.dispose();
    for (const mat of materialsToDispose) mat.dispose();
    for (const tex of texturesToDispose) tex.dispose();
  };

  return {
    rootGroup,
    phoneGroup,
    hornMesh,
    diaphragmMesh,
    rodGroup,
    platinumRod,
    linkArm,
    glassCup,
    liquidMesh,
    waveRings,
    electronPoints,
    electronPositions,
    electronCount,
    materials: {
      brass,
      polishedWood,
      diaphragmMat,
      glassCupMat,
      liquidMat,
      platinumRodMat,
      batteryJarMat,
      electronMat,
    },
    dispose,
  };
}

/**
 * Updates diaphragm acoustics, liquid variable resistance rod, wave rings, and electrons.
 */
export function updateBellTelephoneKinematics(
  model: BellTelephoneModel,
  dt: number,
  timeSec: number,
  acousticDisplayOmegaRadPerS: number,
  diaphragmUm: number,
  electronDisplaySpeed: number,
  showAcousticWaves: boolean,
  isCutaway: boolean,
) {
  const acousticVibe = Math.sin(timeSec * acousticDisplayOmegaRadPerS);
  const displScale = (diaphragmUm / 10) * 0.08;

  // Diaphragm vibration
  model.diaphragmMesh.position.x = -1.35 + acousticVibe * displScale;

  // Platinum Rod in Liquid Transmitter
  model.rodGroup.position.y = acousticVibe * displScale * 0.6;

  // Acoustic Wave Rings Propagation
  for (let i = 0; i < model.waveRings.length; i++) {
    const ring = model.waveRings[i];
    if (showAcousticWaves) {
      ring.visible = true;
      const progress = (timeSec * 3 + i * 0.33) % 1.0;
      ring.position.x = -5.0 + progress * 3.4;
      const scale = 0.5 + progress * 0.8;
      ring.scale.set(scale, scale, scale);
      const ringMat = ring.material as THREE.MeshBasicMaterial;
      ringMat.opacity = (1 - progress) * 0.65;
    } else {
      ring.visible = false;
    }
  }

  // Flowing Electron Drift Current
  const ePos = model.electronPositions;
  const drift = electronDisplaySpeed * dt * 0.5;
  for (let i = 0; i < model.electronCount; i++) {
    const idx = i * 3;
    ePos[idx] += drift;
    if (ePos[idx] > 2.0) {
      ePos[idx] = -1.5;
    }
  }
  model.electronPoints.geometry.attributes.position.needsUpdate = true;

  // Cutaway Mode
  model.materials.brass.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.brass.transparent = isCutaway;
  model.materials.glassCupMat.opacity = isCutaway ? 0.25 : 1.0;
}
