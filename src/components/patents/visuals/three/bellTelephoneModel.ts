import * as THREE from "three";
import { bellWaveProgress, stepBellTelephone } from "@/physics/catalogKernels";
import { wave2dFrames, waveFrameRms } from "@/physics/genericWasm";
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
    copperMat?: THREE.MeshStandardMaterial;
    zincMat?: THREE.MeshStandardMaterial;
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
 * Procedural Polished American Walnut Texture
 */
function createWalnutTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  // Deep warm walnut brown base
  ctx.fillStyle = "#4a2113";
  ctx.fillRect(0, 0, 512, 512);

  // Walnut growth rings & natural swirl
  for (let i = 0; i < 85; i++) {
    const x = i * 6.2 + (deterministicUnit(i, 0) - 0.5) * 5;
    const alpha = 0.08 + (i % 4 === 0 ? 0.14 : 0.04);
    ctx.strokeStyle = `rgba(35, 12, 6, ${alpha})`;
    ctx.lineWidth = 1.4 + (i % 3) * 0.5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(x + 18, 140, x - 14, 380, x + 8, 512);
    ctx.stroke();
  }

  // Walnut wood pores
  for (let p = 0; p < 300; p++) {
    const px = deterministicUnit(p, 1) * 512;
    const py = deterministicUnit(p, 2) * 512;
    ctx.fillStyle = "rgba(20, 6, 3, 0.3)";
    ctx.fillRect(px, py, 1.8, 6 + deterministicUnit(p, 3) * 8);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Procedural Parchment Drum Membrane Texture
 */
function createParchmentTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  // Creamy parchment tone
  ctx.fillStyle = "#fbf3db";
  ctx.fillRect(0, 0, 256, 256);

  // Mottled organic parchment collagen variation
  for (let i = 0; i < 40; i++) {
    const cx = deterministicUnit(i, 7) * 256;
    const cy = deterministicUnit(i, 8) * 256;
    const r = 20 + deterministicUnit(i, 9) * 35;
    const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r);
    grad.addColorStop(0, "rgba(215, 185, 135, 0.25)");
    grad.addColorStop(1, "rgba(251, 243, 219, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildBellTelephoneModel(): BellTelephoneModel {
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

  const walnutTex = createWalnutTexture();
  if (walnutTex) texturesToDispose.push(walnutTex);

  const parchmentTex = createParchmentTexture();
  if (parchmentTex) texturesToDispose.push(parchmentTex);

  const glowTex = createGlowPointTexture();
  texturesToDispose.push(glowTex);

  // --- 1. PBR MATERIALS PALETTE ---
  const brass = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.22,
      metalness: 0.9,
    }),
  );

  const polishedWood = trackMat(
    new THREE.MeshStandardMaterial({
      ...(walnutTex ? { map: walnutTex } : {}),
      color: 0x5c2c16,
      roughness: 0.38,
      metalness: 0.08,
    }),
  );

  const diaphragmMat = trackMat(
    new THREE.MeshStandardMaterial({
      ...(parchmentTex ? { map: parchmentTex } : {}),
      color: 0xfef3c7,
      roughness: 0.55,
      metalness: 0.1,
      side: THREE.DoubleSide,
    }),
  );

  const glassCupMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      ior: 1.45,
    }),
  );

  const liquidMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.75,
    }),
  );

  const platinumRodMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.08,
      metalness: 0.98,
    }),
  );

  const batteryJarMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.32,
      metalness: 0.75,
    }),
  );

  const copperMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xc25e1a,
      roughness: 0.25,
      metalness: 0.92,
    }),
  );

  const zincMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.45,
      metalness: 0.8,
    }),
  );

  // --- 2. 3D TELEPHONE TRANSMITTER APPARATUS ---
  const phoneGroup = new THREE.Group();
  rootGroup.add(phoneGroup);

  // Beveled Walnut Instrument Base Board with Chamfered Edge
  const baseGeo = trackGeo(new THREE.BoxGeometry(11.2, 0.65, 6.6));
  const baseBoard = new THREE.Mesh(baseGeo, polishedWood);
  baseBoard.position.y = -3.2;
  baseBoard.castShadow = true;
  baseBoard.receiveShadow = true;
  phoneGroup.add(baseBoard);

  // 4 Turned Brass Bun Feet Under Walnut Base
  [
    [-4.8, -2.6],
    [4.8, -2.6],
    [-4.8, 2.6],
    [4.8, 2.6],
  ].forEach(([fx, fz]) => {
    const foot = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.32, 0.24, 0.25, 16)), brass);
    foot.position.set(fx, -3.65, fz);
    phoneGroup.add(foot);
  });

  // Flared Acoustic Speaking Horn Cone (Spun Brass)
  const hornPoints: THREE.Vector2[] = [
    new THREE.Vector2(0.42, 0),
    new THREE.Vector2(0.45, 0.6),
    new THREE.Vector2(0.55, 1.4),
    new THREE.Vector2(0.85, 2.4),
    new THREE.Vector2(1.35, 3.2),
    new THREE.Vector2(1.85, 3.7),
    new THREE.Vector2(1.88, 3.8),
  ];
  const hornGeo = trackGeo(new THREE.LatheGeometry(hornPoints, 48));
  const hornMesh = new THREE.Mesh(hornGeo, brass);
  hornMesh.rotation.z = -Math.PI / 2;
  hornMesh.position.set(-1.4, 0.5, 0);
  hornMesh.castShadow = true;
  phoneGroup.add(hornMesh);

  // Spun brass horn mouth rim bead
  const hornBeadGeo = trackGeo(new THREE.TorusGeometry(1.86, 0.06, 12, 48));
  const hornBead = new THREE.Mesh(hornBeadGeo, brass);
  hornBead.rotation.y = Math.PI / 2;
  hornBead.position.set(-5.2, 0.5, 0);
  phoneGroup.add(hornBead);

  // Diaphragm Retaining Collar Ring with Clamping Flange
  const collarGeo = trackGeo(new THREE.TorusGeometry(0.52, 0.08, 12, 32));
  const collarMesh = new THREE.Mesh(collarGeo, brass);
  collarMesh.rotation.y = Math.PI / 2;
  collarMesh.position.set(-1.4, 0.5, 0);
  phoneGroup.add(collarMesh);

  // 6 Peripheral Knurled Clamping Screws
  const screwGeo = trackGeo(new THREE.CylinderGeometry(0.04, 0.04, 0.15, 8));
  for (let s = 0; s < 6; s++) {
    const sAngle = (s * Math.PI * 2) / 6;
    const screw = new THREE.Mesh(screwGeo, brass);
    screw.rotation.z = Math.PI / 2;
    screw.position.set(-1.4, 0.5 + Math.sin(sAngle) * 0.52, Math.cos(sAngle) * 0.52);
    phoneGroup.add(screw);
  }

  // Flexible Drum Membrane Diaphragm Disc (Taut Goldbeater's Skin / Parchment)
  const diaphragmGeo = trackGeo(new THREE.CircleGeometry(0.48, 36));
  const diaphragmMesh = new THREE.Mesh(diaphragmGeo, diaphragmMat);
  diaphragmMesh.rotation.y = Math.PI / 2;
  diaphragmMesh.position.set(-1.38, 0.5, 0);
  diaphragmMesh.castShadow = true;
  phoneGroup.add(diaphragmMesh);

  // Central Cork Float Disk cemented to membrane
  const corkGeo = trackGeo(new THREE.CylinderGeometry(0.12, 0.12, 0.06, 16));
  const corkDisk = new THREE.Mesh(corkGeo, polishedWood);
  corkDisk.rotation.z = Math.PI / 2;
  corkDisk.position.set(-1.34, 0.5, 0);
  phoneGroup.add(corkDisk);

  // Glass Beaker Reservoir Cup (US 174,465 Fig. 7 Liquid Cell)
  const beakerPoints: THREE.Vector2[] = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(1.0, 0),
    new THREE.Vector2(1.05, 0.1),
    new THREE.Vector2(1.1, 1.8),
    new THREE.Vector2(1.22, 2.2),
  ];
  const beakerGeo = trackGeo(new THREE.LatheGeometry(beakerPoints, 36));
  const glassCup = new THREE.Mesh(beakerGeo, glassCupMat);
  glassCup.position.set(2.0, -2.4, 0);
  glassCup.castShadow = true;
  phoneGroup.add(glassCup);

  // Brass Beaker Stand Pedestal Ring
  const beakerStandGeo = trackGeo(new THREE.CylinderGeometry(1.25, 1.35, 0.2, 24));
  const beakerStand = new THREE.Mesh(beakerStandGeo, brass);
  beakerStand.position.set(2.0, -2.75, 0);
  phoneGroup.add(beakerStand);

  // Acidulated Electrolyte Liquid (Dilute Sulfuric Acid Solution)
  const liquidGeo = trackGeo(new THREE.CylinderGeometry(1.04, 0.98, 1.6, 36));
  const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
  liquidMesh.position.set(2.0, -1.5, 0);
  phoneGroup.add(liquidMesh);

  // Platinum Base Bottom Fixed Electrode Plate
  const baseElectrodeGeo = trackGeo(new THREE.CylinderGeometry(0.45, 0.45, 0.12, 16));
  const baseElectrode = new THREE.Mesh(baseElectrodeGeo, platinumRodMat);
  baseElectrode.position.set(2.0, -2.3, 0);
  phoneGroup.add(baseElectrode);

  // Movable Dipping Platinum Needle Rod (US 174,465 Variable Resistance Organ)
  const rodGroup = new THREE.Group();
  rodGroup.position.set(2.0, 0.6, 0);
  phoneGroup.add(rodGroup);

  const platinumRodGeo = trackGeo(new THREE.CylinderGeometry(0.045, 0.02, 2.4, 16));
  const platinumRod = new THREE.Mesh(platinumRodGeo, platinumRodMat);
  platinumRod.castShadow = true;
  rodGroup.add(platinumRod);

  // Brass Needle Chuck Collar with Knurled Clamping Nut
  const needleChuckGeo = trackGeo(new THREE.CylinderGeometry(0.12, 0.12, 0.35, 16));
  const needleChuck = new THREE.Mesh(needleChuckGeo, brass);
  needleChuck.position.y = 1.0;
  rodGroup.add(needleChuck);

  // Central Turned Brass Fulcrum Post & Pivoting Lever Link Arm
  const fulcrumGeo = trackGeo(new THREE.CylinderGeometry(0.14, 0.18, 2.2, 16));
  const fulcrumPost = new THREE.Mesh(fulcrumGeo, brass);
  fulcrumPost.position.set(0.35, -0.6, 0);
  fulcrumPost.castShadow = true;
  phoneGroup.add(fulcrumPost);

  // Knurled Fulcrum Height Adjusting Nut
  const fulcrumNutGeo = trackGeo(new THREE.CylinderGeometry(0.26, 0.26, 0.16, 16));
  const fulcrumNut = new THREE.Mesh(fulcrumNutGeo, brass);
  fulcrumNut.position.set(0.35, 0.3, 0);
  phoneGroup.add(fulcrumNut);

  // Pivoting Lever Link Arm Connecting Membrane to Dipping Rod
  const linkArmGeo = trackGeo(new THREE.BoxGeometry(3.5, 0.08, 0.08));
  const linkArm = new THREE.Mesh(linkArmGeo, brass);
  linkArm.position.set(0.35, 0.5, 0);
  linkArm.castShadow = true;
  phoneGroup.add(linkArm);

  // Counterweight Balance Bob with Threaded Shaft
  const counterweightGeo = trackGeo(new THREE.CylinderGeometry(0.24, 0.24, 0.35, 16));
  const counterweight = new THREE.Mesh(counterweightGeo, brass);
  counterweight.rotation.z = Math.PI / 2;
  counterweight.position.set(-1.0, 0.5, 0);
  phoneGroup.add(counterweight);

  // Daniell Gravity Wet-Cell Battery Jars (2 Glass/Copper Cells)
  const batteryGeo = trackGeo(new THREE.CylinderGeometry(0.75, 0.75, 1.7, 24));
  for (let b = 0; b < 2; b++) {
    const batteryGroup = new THREE.Group();
    batteryGroup.position.set(-3.4 + b * 1.9, -2.0, 2.0);

    const batteryJar = new THREE.Mesh(batteryGeo, batteryJarMat);
    batteryJar.castShadow = true;
    batteryGroup.add(batteryJar);

    // Copper outer electrode lining
    const cuLining = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.72, 0.72, 1.4, 20)),
      copperMat,
    );
    cuLining.position.y = -0.1;
    batteryGroup.add(cuLining);

    // Zinc crowfoot suspended electrode
    const znElectrode = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.35, 0.35, 0.15, 16)),
      zincMat,
    );
    znElectrode.position.y = 0.6;
    batteryGroup.add(znElectrode);

    // Terminal Binding Post on battery
    const bPost = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.08, 0.08, 0.28, 12)), brass);
    bPost.position.set(0, 0.9, 0);
    batteryGroup.add(bPost);

    phoneGroup.add(batteryGroup);
  }

  // --- 3. ACOUSTIC SOUND PRESSURE WAVES ---
  const waveCount = 5;
  const waveRings: THREE.Mesh[] = [];
  for (let i = 0; i < waveCount; i++) {
    const ringGeo = trackGeo(new THREE.TorusGeometry(0.6 + i * 0.45, 0.03, 12, 36));
    const ringMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.7 - i * 0.12,
      }),
    );
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.y = Math.PI / 2;
    ring.position.set(-5.5 - i * 0.6, 0.5, 0);
    phoneGroup.add(ring);
    waveRings.push(ring);
  }

  // --- 4. GLOWING ELECTRICAL CURRENT PARTICLES ---
  const electronCount = 80;
  const electronGeo = trackGeo(new THREE.BufferGeometry());
  const electronPositions = new Float32Array(electronCount * 3);

  for (let i = 0; i < electronCount; i++) {
    const idx = i * 3;
    const t = i / electronCount;
    electronPositions[idx] = -3.2 + t * 5.2;
    electronPositions[idx + 1] = -2.1 + (t < 0.5 ? 0 : 2.6 * (t - 0.5) * 2);
    electronPositions[idx + 2] = 1.8 * (1 - t);
  }

  electronGeo.setAttribute("position", new THREE.BufferAttribute(electronPositions, 3));

  const electronMat = trackMat(
    new THREE.PointsMaterial({
      size: 0.26,
      map: glowTex,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );

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
      copperMat,
      zincMat,
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
  diaphragmStudioScale: number,
  electronStudioSpeed: number,
  showAcousticWaves: boolean,
  isCutaway: boolean,
) {
  const bell = stepBellTelephone({});
  const acousticVibe = Math.sin(timeSec * acousticDisplayOmegaRadPerS);
  const displScale = diaphragmStudioScale;

  // Diaphragm vibration
  model.diaphragmMesh.position.x = -1.35 + acousticVibe * displScale;

  // Platinum Rod in Liquid Transmitter
  model.rodGroup.position.y = acousticVibe * displScale * bell.rodStudioCoupling;

  // Acoustic Wave Rings Propagation
  const field = wave2dFrames(16, 24, 2);
  const rms = waveFrameRms(field, 16, 24, Math.abs(Math.floor(timeSec * 8)) % 24);
  for (let i = 0; i < model.waveRings.length; i++) {
    const ring = model.waveRings[i];
    if (showAcousticWaves) {
      ring.visible = true;
      const progress = bellWaveProgress(
        timeSec,
        i,
        bell.waveProgressOmega,
        bell.waveProgressPitch,
        bell.waveProgressWrap,
      );
      ring.position.x = bell.waveOriginX + progress * bell.waveTravelX;
      const scale = (bell.waveScale0 + progress * bell.waveScaleAmp) * (1 + rms);
      ring.scale.set(scale, scale, scale);
      const ringMat = ring.material as THREE.MeshBasicMaterial;
      ringMat.opacity = (1 - progress) * bell.waveOpacity0 * (0.55 + rms);
    } else {
      ring.visible = false;
    }
  }

  // Flowing Electron Drift Current
  const ePos = model.electronPositions;
  const drift = electronStudioSpeed * dt;
  for (let i = 0; i < model.electronCount; i++) {
    const idx = i * 3;
    ePos[idx] += drift;
    if (ePos[idx] > bell.electronWrapX) {
      ePos[idx] = bell.electronResetX;
    }
  }
  model.electronPoints.geometry.attributes.position.needsUpdate = true;

  // Cutaway Mode
  model.materials.brass.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.brass.transparent = isCutaway;
  model.materials.glassCupMat.opacity = isCutaway ? 0.25 : 1.0;
}
