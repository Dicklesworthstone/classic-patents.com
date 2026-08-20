/**
 * pasteurFermentationModel.ts
 *
 * Museum-Grade Procedural 3D Model for Louis Pasteur's 1873 Pure-Yeast Fermentation & Brewing Apparatus
 * (US Patent 135,245 - "Improvement in the Manufacture of Beer and Yeast").
 *
 * Reconstructs the revolutionary apparatus that eliminated microbial spoilage and established germ theory:
 * 1. Cast-iron tripod base support stand with arched legs and leveling feet.
 * 2. Closed tinned copper cylindrical fermentation vat with riveted seams, brass reinforcing hoops,
 *    and hemispherical dome lid secured by perimeter brass clamping dogs (Claim 1).
 * 3. Iconic swan-neck / gooseneck airlock tube with sterilized calcined cotton microbial filter bulb (Claim 2).
 * 4. Helical cold-water cooling coil jacket around the vat with brass inlet/outlet control valves.
 * 5. Calibrated glass level sight tube in brass cage and rotary sampling cock.
 * 6. Ascending CO2 effervescence bubble particles tracking live yeast metabolism.
 */

import * as THREE from "three";
import { stepPasteurFermentation } from "@/physics/catalogKernels";
import { heatFrames, sampleHeatAt } from "@/physics/genericWasm";
import { createGlowPointTexture } from "./ThreeStudioScene";

export interface PasteurFermentationModelNodes {
  rootGroup: THREE.Group;
  tripod: THREE.Mesh;
  vatGroup: THREE.Group;
  tank: THREE.Mesh;
  domeLid: THREE.Mesh;
  airlockMesh: THREE.Mesh;
  cottonBulb: THREE.Mesh;
  coolingCoils: THREE.Group;
  sightGlass: THREE.Mesh;
  samplingCock: THREE.Mesh;
  bubblePoints: THREE.Points;
  bubblePositions: Float32Array;
  bubbleCount: number;
  thermometerWell?: THREE.Mesh;
}

export interface PasteurFermentationMaterials {
  tinnedCopper: THREE.MeshStandardMaterial;
  brassPipes: THREE.MeshStandardMaterial;
  castIron: THREE.MeshStandardMaterial;
  glass: THREE.MeshStandardMaterial;
  cotton: THREE.MeshStandardMaterial;
  bubbleMat: THREE.PointsMaterial;
  ironHoop: THREE.MeshStandardMaterial;
}

export interface PasteurFermentationModelResult {
  rootGroup: THREE.Group;
  nodes: PasteurFermentationModelNodes;
  materials: PasteurFermentationMaterials;
  dispose: () => void;
}

const BUBBLE_COUNT = 60;

/**
 * Deterministic unit noise for procedural grain generation.
 */
function deterministicUnit(index: number, channel: number): number {
  const sample = Math.sin((index + 1) * 12.9898 + (channel + 1) * 78.233) * 43758.5453;
  return sample - Math.floor(sample);
}

/**
 * Procedural Tinned Copper Vat Texture with Hammered Sheen & Rivet Lines
 */
function createTinnedCopperTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  ctx.fillStyle = "#c88238";
  ctx.fillRect(0, 0, 512, 512);

  // Hammered planishing facets
  for (let i = 0; i < 200; i++) {
    const cx = deterministicUnit(i, 0) * 512;
    const cy = deterministicUnit(i, 1) * 512;
    const rad = 6 + deterministicUnit(i, 2) * 12;
    ctx.fillStyle = `rgba(234, 138, 58, ${0.15 + deterministicUnit(i, 3) * 0.15})`;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // Vertical riveted seam
  ctx.fillStyle = "rgba(70, 30, 10, 0.4)";
  ctx.fillRect(250, 0, 12, 512);
  for (let y = 10; y < 512; y += 24) {
    ctx.fillStyle = "#fef08a";
    ctx.beginPath();
    ctx.arc(256, y, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(40, 15, 5, 0.6)";
    ctx.lineWidth = 1;
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
 * Procedural Cast-Iron Tripod Base Texture
 */
function createCastIronTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  ctx.fillStyle = "#22272e";
  ctx.fillRect(0, 0, 512, 512);

  const imgData = ctx.getImageData(0, 0, 512, 512);
  const d = imgData.data;
  for (let i = 0; i < 512 * 512; i++) {
    const n = (deterministicUnit(i, 0) - 0.5) * 20;
    d[i * 4 + 0] = Math.max(0, Math.min(255, d[i * 4 + 0] + n));
    d[i * 4 + 1] = Math.max(0, Math.min(255, d[i * 4 + 1] + n));
    d[i * 4 + 2] = Math.max(0, Math.min(255, d[i * 4 + 2] + n));
  }
  ctx.putImageData(imgData, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildPasteurFermentationModel(): PasteurFermentationModelResult {
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

  const copperTex = createTinnedCopperTexture();
  if (copperTex) texturesToDispose.push(copperTex);

  const ironTex = createCastIronTexture();
  if (ironTex) texturesToDispose.push(ironTex);

  const bubbleGlowTex = createGlowPointTexture();
  texturesToDispose.push(bubbleGlowTex);

  // --- Museum Materials ---
  const tinnedCopper = trackMat(
    new THREE.MeshStandardMaterial({
      ...(copperTex ? { map: copperTex } : {}),
      color: 0xc88238,
      roughness: 0.28,
      metalness: 0.9,
    }),
  );

  const brassPipes = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.24,
      metalness: 0.88,
    }),
  );

  const castIron = trackMat(
    new THREE.MeshStandardMaterial({
      ...(ironTex ? { map: ironTex } : {}),
      color: 0x22272e,
      roughness: 0.65,
      metalness: 0.85,
    }),
  );

  const ironHoop = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.55,
      metalness: 0.8,
    }),
  );

  const glass = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.08,
      metalness: 0.1,
      transparent: true,
      opacity: 0.45,
    }),
  );

  const cotton = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.95,
      metalness: 0.0,
    }),
  );

  const bubbleMat = trackMat(
    new THREE.PointsMaterial({
      size: 0.24,
      map: bubbleGlowTex,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      color: 0xfef08a,
      depthWrite: false,
    }),
  );

  const materials: PasteurFermentationMaterials = {
    tinnedCopper,
    brassPipes,
    castIron,
    glass,
    cotton,
    bubbleMat,
    ironHoop,
  };

  // --- 1. Cast-Iron Tripod Support Stand ---
  const tripodGroup = new THREE.Group();
  rootGroup.add(tripodGroup);

  const tripodRing = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(2.25, 2.35, 0.4, 28)),
    materials.castIron,
  );
  tripodRing.position.y = -1.6;
  tripodRing.receiveShadow = true;
  tripodRing.castShadow = true;
  tripodGroup.add(tripodRing);

  // 3 Heavy Arched Cast-Iron Legs
  for (let l = 0; l < 3; l++) {
    const angle = (l * Math.PI * 2) / 3;
    const legCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.cos(angle) * 2.2, -1.6, Math.sin(angle) * 2.2),
      new THREE.Vector3(Math.cos(angle) * 2.7, -2.4, Math.sin(angle) * 2.7),
      new THREE.Vector3(Math.cos(angle) * 3.0, -3.2, Math.sin(angle) * 3.0),
    ]);
    const legGeo = trackGeo(new THREE.TubeGeometry(legCurve, 16, 0.16, 12, false));
    const leg = new THREE.Mesh(legGeo, materials.castIron);
    leg.castShadow = true;
    tripodGroup.add(leg);

    // Foot pad
    const pad = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.35, 0.45, 0.15, 16)),
      materials.castIron,
    );
    pad.position.set(Math.cos(angle) * 3.0, -3.25, Math.sin(angle) * 3.0);
    pad.receiveShadow = true;
    tripodGroup.add(pad);
  }

  // --- 2. Closed Tinned Copper Fermentation Vat (Claim 1) ---
  const vatGroup = new THREE.Group();
  rootGroup.add(vatGroup);

  const tank = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(2.1, 2.1, 3.8, 36)),
    materials.tinnedCopper,
  );
  tank.position.y = 0.3;
  tank.castShadow = true;
  vatGroup.add(tank);

  // Reinforcing Brass Hoops around Vat Body
  [-1.0, 0.3, 1.6].forEach((hy) => {
    const hoop = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(2.14, 2.14, 0.1, 36)),
      materials.ironHoop,
    );
    hoop.position.y = hy;
    vatGroup.add(hoop);
  });

  // Hemispherical Dome Lid with Brass Rim Flange
  const domeLid = new THREE.Mesh(
    trackGeo(new THREE.SphereGeometry(2.1, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2)),
    materials.tinnedCopper,
  );
  domeLid.position.y = 2.2;
  domeLid.castShadow = true;
  vatGroup.add(domeLid);

  // 8 Brass Wing-Nut Clamping Dogs securing Lid Flange
  for (let d = 0; d < 8; d++) {
    const angle = (d * Math.PI) / 4;
    const dog = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.15, 0.25, 0.18)),
      materials.brassPipes,
    );
    dog.position.set(Math.cos(angle) * 2.18, 2.2, Math.sin(angle) * 2.18);
    vatGroup.add(dog);
  }

  // Inspection Manhole Hatch with Brass Rim & Wingnuts
  const manholeRim = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.65, 0.65, 0.15, 24)),
    materials.brassPipes,
  );
  manholeRim.position.set(-0.8, 3.1, 0.6);
  manholeRim.rotation.x = -0.3;
  vatGroup.add(manholeRim);

  for (let w = 0; w < 4; w++) {
    const wAngle = (w * Math.PI * 2) / 4;
    const nut = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.12, 0.08, 0.24)),
      materials.brassPipes,
    );
    nut.position.set(-0.8 + Math.cos(wAngle) * 0.55, 3.18, 0.6 + Math.sin(wAngle) * 0.55);
    vatGroup.add(nut);
  }

  // 3. Goose-Neck Airlock Tube with Cotton Filter (Claim 2)
  const airlockCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 3.1, 0),
    new THREE.Vector3(0, 4.0, 0),
    new THREE.Vector3(0.8, 4.6, 0),
    new THREE.Vector3(1.6, 4.0, 0),
    new THREE.Vector3(1.6, 3.4, 0),
    new THREE.Vector3(2.2, 3.2, 0),
  ]);
  const airlockGeo = trackGeo(new THREE.TubeGeometry(airlockCurve, 32, 0.08, 12, false));
  const airlockMesh = new THREE.Mesh(airlockGeo, materials.brassPipes);
  airlockMesh.castShadow = true;
  vatGroup.add(airlockMesh);

  const cottonBulb = new THREE.Mesh(
    trackGeo(new THREE.SphereGeometry(0.35, 16, 16)),
    materials.cotton,
  );
  cottonBulb.position.set(2.2, 3.2, 0);
  cottonBulb.castShadow = true;
  vatGroup.add(cottonBulb);

  // 4. Helical Cooling Coils Jacket
  const coolingCoils = new THREE.Group();
  for (let c = 0; c < 6; c++) {
    const ring = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(2.18, 0.06, 12, 36)),
      materials.brassPipes,
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.2 + c * 0.45;
    ring.castShadow = true;
    coolingCoils.add(ring);
  }
  vatGroup.add(coolingCoils);

  // 5. Sight Glass & Sampling Valve
  const sightGlass = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.08, 0.08, 2.8, 12)),
    materials.glass,
  );
  sightGlass.position.set(2.2, 0.2, 0);
  vatGroup.add(sightGlass);

  // Brass Guard Rods around Sight Glass
  [-0.12, 0.12].forEach((gz) => {
    const rod = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.02, 0.02, 3.0, 8)),
      materials.brassPipes,
    );
    rod.position.set(2.25, 0.2, gz);
    vatGroup.add(rod);
  });

  const samplingCock = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.12, 0.12, 0.6, 12)),
    materials.brassPipes,
  );
  samplingCock.rotation.z = Math.PI / 2;
  samplingCock.position.set(0, -1.2, 2.2);
  samplingCock.castShadow = true;
  vatGroup.add(samplingCock);

  // Turn Cock Handle
  const cockHandle = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8)),
    materials.brassPipes,
  );
  cockHandle.position.set(0, -0.9, 2.35);
  vatGroup.add(cockHandle);

  // Protective Brass Stem Thermometer Well
  const thermometerWell = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.08, 0.08, 1.8, 12)),
    materials.brassPipes,
  );
  thermometerWell.position.set(-1.1, 2.4, 1.1);
  thermometerWell.rotation.z = -Math.PI / 6;
  vatGroup.add(thermometerWell);

  // 6. Fermentation CO2 Gas Bubbles
  const bubbleGeo = trackGeo(new THREE.BufferGeometry());
  const bubblePositions = new Float32Array(BUBBLE_COUNT * 3);
  for (let i = 0; i < BUBBLE_COUNT; i++) {
    const idx = i * 3;
    const r = deterministicUnit(i, 0) * 1.8;
    const a = deterministicUnit(i, 1) * Math.PI * 2;
    bubblePositions[idx] = Math.cos(a) * r;
    bubblePositions[idx + 1] = -1.4 + deterministicUnit(i, 2) * 3.2;
    bubblePositions[idx + 2] = Math.sin(a) * r;
  }
  bubbleGeo.setAttribute("position", new THREE.BufferAttribute(bubblePositions, 3));
  const bubblePoints = new THREE.Points(bubbleGeo, materials.bubbleMat);
  vatGroup.add(bubblePoints);

  const nodes: PasteurFermentationModelNodes = {
    rootGroup,
    tripod: tripodRing,
    vatGroup,
    tank,
    domeLid,
    airlockMesh,
    cottonBulb,
    coolingCoils,
    sightGlass,
    samplingCock,
    bubblePoints,
    bubblePositions,
    bubbleCount: BUBBLE_COUNT,
    thermometerWell,
  };

  const dispose = () => {
    for (const m of materialsToDispose) m.dispose();
    for (const g of geometriesToDispose) g.dispose();
    for (const t of texturesToDispose) t.dispose();
  };

  return { rootGroup, nodes, materials, dispose };
}

/**
 * Updates bubble kinetics, temperature coloring, and cutaway mode.
 */
export function updatePasteurFermentationKinematics(
  nodes: PasteurFermentationModelNodes,
  materials: PasteurFermentationMaterials,
  dt: number,
  _timeSec: number,
  fermentationTempC: number,
  yeastActivityPct: number,
  showBubbles: boolean,
  isCutaway: boolean,
) {
  const pasteur = stepPasteurFermentation({});
  const activity = Math.max(0, yeastActivityPct / pasteur.activityNormDivisor);
  const rise = pasteur.bubbleRise0 + activity * pasteur.bubbleRiseAmp;
  const pos = nodes.bubblePositions;
  const heat = heatFrames(12, 16, 2);

  for (let i = 0; i < nodes.bubbleCount; i++) {
    const idx = i * 3;
    const frame = Math.abs(Math.floor(pos[idx + 1] * 4)) % 16;
    const u = (pos[idx] + 3) / 6;
    const v = (pos[idx + 2] + 3) / 6;
    const local = 1 + Math.abs(sampleHeatAt(heat, 12, 16, frame, u, v));
    pos[idx + 1] += rise * dt * local;
    if (pos[idx + 1] > pasteur.bubbleWrapY) {
      pos[idx + 1] = pasteur.bubbleResetY;
    }
  }
  nodes.bubblePoints.geometry.attributes.position.needsUpdate = true;

  nodes.bubblePoints.visible = showBubbles && activity > pasteur.bubbleVisibleThreshold;
  materials.bubbleMat.opacity = pasteur.bubbleOpacity0 + activity * pasteur.bubbleOpacityAmp;
  materials.bubbleMat.color.setHex(
    fermentationTempC > pasteur.bubbleWarmC ? pasteur.bubbleWarmHex : pasteur.bubbleCoolHex,
  );

  // Cutaway Mode
  materials.tinnedCopper.opacity = isCutaway ? 0.35 : 1.0;
  materials.tinnedCopper.transparent = isCutaway;
}
