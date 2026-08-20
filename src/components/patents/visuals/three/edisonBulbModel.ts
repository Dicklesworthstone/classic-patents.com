import * as THREE from "three";
import { blackbodyRgb } from "@/physics/blackbody";
import { stepEdisonBulb } from "@/physics/catalogKernels";
import { heatFrames, sampleHeatAt } from "@/physics/genericWasm";
import { createLcg } from "@/utils/lcg";
import { createGlowPointTexture } from "./ThreeStudioScene";

export interface EdisonBulbModel {
  rootGroup: THREE.Group;
  bulbGroup: THREE.Group;
  glassMesh: THREE.Mesh;
  filamentMesh: THREE.Mesh;
  bulbLight: THREE.PointLight;
  gasPoints: THREE.Points;
  gasPositions: Float32Array;
  gasCount: number;
  materials: {
    glassMat: THREE.MeshPhysicalMaterial;
    brassBase: THREE.MeshStandardMaterial;
    platinumLead: THREE.MeshStandardMaterial;
    filamentMat: THREE.MeshStandardMaterial;
    plasterInsulatorMat: THREE.MeshStandardMaterial;
    woodMountMat: THREE.MeshStandardMaterial;
    gasMat: THREE.PointsMaterial;
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
 * Procedural Turned Mahogany Display Stand Texture
 */
function createMahoganyTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  ctx.fillStyle = "#4a1e0d";
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 85; i++) {
    const x = i * 6.0 + (deterministicUnit(i, 0) - 0.5) * 4;
    const alpha = 0.08 + (i % 4 === 0 ? 0.14 : 0.04);
    ctx.strokeStyle = `rgba(120, 42, 14, ${alpha})`;
    ctx.lineWidth = 1.3 + (i % 3) * 0.5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(x + 14, 160, x - 12, 360, x + 6, 512);
    ctx.stroke();
  }

  for (let p = 0; p < 280; p++) {
    const px = deterministicUnit(p, 1) * 512;
    const py = deterministicUnit(p, 2) * 512;
    ctx.fillStyle = "rgba(25, 8, 3, 0.28)";
    ctx.fillRect(px, py, 1.8, 5 + deterministicUnit(p, 3) * 7);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildEdisonBulbModel(): EdisonBulbModel {
  const lcg = createLcg(1880);
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  const mahoganyTex = createMahoganyTexture();
  if (mahoganyTex) texturesToDispose.push(mahoganyTex);

  // --- 1. PBR MATERIALS ---
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.96,
    opacity: 1,
    transparent: true,
    roughness: 0.03,
    ior: 1.54,
    metalness: 0.02,
    side: THREE.DoubleSide,
  });
  materialsToDispose.push(glassMat);

  const brassBase = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.92,
    roughness: 0.18,
  });
  materialsToDispose.push(brassBase);

  const platinumLead = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    metalness: 0.95,
    roughness: 0.1,
  });
  materialsToDispose.push(platinumLead);

  const filamentMat = new THREE.MeshStandardMaterial({
    color: 0x1c1917,
    roughness: 0.7,
    metalness: 0.3,
    emissive: new THREE.Color(0xff6600),
    emissiveIntensity: 0.0,
  });
  materialsToDispose.push(filamentMat);

  const plasterInsulatorMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.9,
  });
  materialsToDispose.push(plasterInsulatorMat);

  const woodMountMat = new THREE.MeshStandardMaterial({
    ...(mahoganyTex ? { map: mahoganyTex } : {}),
    color: 0x5c2b0c,
    roughness: 0.35,
    metalness: 0.05,
  });
  materialsToDispose.push(woodMountMat);

  // Dynamic Bulb Point Light
  const bulbLight = new THREE.PointLight(0xffaa33, 0, 30);
  bulbLight.position.set(0, 1.0, 0);
  bulbLight.castShadow = true;
  rootGroup.add(bulbLight);

  // --- 2. BULB ASSEMBLY ---
  const bulbGroup = new THREE.Group();
  rootGroup.add(bulbGroup);

  // Blown Glass Pear-Shaped Envelope with Exhaust Seal Pip
  const lathePoints: THREE.Vector2[] = [
    new THREE.Vector2(0.001, 4.35),
    new THREE.Vector2(0.08, 4.18),
    new THREE.Vector2(0.18, 3.92),
    new THREE.Vector2(0.65, 3.55),
    new THREE.Vector2(1.55, 3.05),
    new THREE.Vector2(2.45, 2.2),
    new THREE.Vector2(2.85, 1.15),
    new THREE.Vector2(2.72, 0.15),
    new THREE.Vector2(2.2, -0.75),
    new THREE.Vector2(1.6, -1.45),
    new THREE.Vector2(1.25, -2.05),
    new THREE.Vector2(1.22, -2.4),
  ];
  const glassGeo = new THREE.LatheGeometry(lathePoints, 64);
  geometriesToDispose.push(glassGeo);
  const glassMesh = new THREE.Mesh(glassGeo, glassMat);
  glassMesh.castShadow = true;
  bulbGroup.add(glassMesh);

  // Top Exhaust Seal Tip Pip (Sprengel mercury pump seal)
  const pipGeo = new THREE.CylinderGeometry(0.02, 0.08, 0.35, 16);
  geometriesToDispose.push(pipGeo);
  const exhaustPip = new THREE.Mesh(pipGeo, glassMat);
  exhaustPip.position.y = 4.25;
  bulbGroup.add(exhaustPip);

  // Rolled Brass Screw Base
  const baseCylinderGeo = new THREE.CylinderGeometry(1.22, 1.22, 1.4, 48);
  geometriesToDispose.push(baseCylinderGeo);
  const baseCylinder = new THREE.Mesh(baseCylinderGeo, brassBase);
  baseCylinder.position.y = -2.9;
  baseCylinder.castShadow = true;
  bulbGroup.add(baseCylinder);

  // Screw Thread Ridges
  const threadGeo = new THREE.TorusGeometry(1.24, 0.09, 16, 48);
  geometriesToDispose.push(threadGeo);
  for (let t = 0; t < 5; t++) {
    const threadRing = new THREE.Mesh(threadGeo, brassBase);
    threadRing.rotation.x = Math.PI / 2 + 0.08;
    threadRing.position.y = -2.3 - t * 0.28;
    bulbGroup.add(threadRing);
  }

  // Plaster Insulator Ring
  const plasterGeo = new THREE.CylinderGeometry(1.15, 1.15, 0.2, 32);
  geometriesToDispose.push(plasterGeo);
  const plasterInsulator = new THREE.Mesh(plasterGeo, plasterInsulatorMat);
  plasterInsulator.position.y = -3.55;
  bulbGroup.add(plasterInsulator);

  // Center Contact Plate Button
  const centerContactGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.15, 24);
  geometriesToDispose.push(centerContactGeo);
  const centerContactPlate = new THREE.Mesh(centerContactGeo, brassBase);
  centerContactPlate.position.y = -3.72;
  bulbGroup.add(centerContactPlate);

  // Turned Mahogany/Walnut Display Base Stand
  const woodMountGeo = new THREE.CylinderGeometry(2.4, 2.8, 0.8, 48);
  geometriesToDispose.push(woodMountGeo);
  const woodMount = new THREE.Mesh(woodMountGeo, woodMountMat);
  woodMount.position.y = -4.2;
  woodMount.receiveShadow = true;
  bulbGroup.add(woodMount);

  // Central Flanged Lead-Glass Stem Tube
  const stemPoints: THREE.Vector2[] = [
    new THREE.Vector2(0.95, -2.4),
    new THREE.Vector2(0.38, -1.8),
    new THREE.Vector2(0.32, 0.2),
    new THREE.Vector2(0.38, 0.45),
  ];
  const stemGeo = new THREE.LatheGeometry(stemPoints, 32);
  geometriesToDispose.push(stemGeo);
  const glassStem = new THREE.Mesh(stemGeo, glassMat);
  bulbGroup.add(glassStem);

  // Platinum Lead-in Wires with Glass Seal Beads & Clamp Sleeves
  const leadWireGeo = new THREE.CylinderGeometry(0.032, 0.032, 2.3, 16);
  geometriesToDispose.push(leadWireGeo);
  const pinchBeadGeo = new THREE.SphereGeometry(0.12, 16, 16);
  geometriesToDispose.push(pinchBeadGeo);
  const clampNutGeo = new THREE.CylinderGeometry(0.075, 0.075, 0.16, 16);
  geometriesToDispose.push(clampNutGeo);

  [-0.34, 0.34].forEach((xPos) => {
    const leadWire = new THREE.Mesh(leadWireGeo, platinumLead);
    leadWire.position.set(xPos, -0.6, 0);
    leadWire.castShadow = true;
    bulbGroup.add(leadWire);

    const glassPinchBead = new THREE.Mesh(pinchBeadGeo, glassMat);
    glassPinchBead.position.set(xPos, -1.1, 0);
    bulbGroup.add(glassPinchBead);

    const clampNut = new THREE.Mesh(clampNutGeo, platinumLead);
    clampNut.position.set(xPos, 0.48, 0);
    bulbGroup.add(clampNut);
  });

  // Carbonized Bamboo Horseshoe Filament Loop (US 223,898 Claim 1)
  const curvePoints: THREE.Vector3[] = [];
  const filamentSegments = 48;
  for (let i = 0; i <= filamentSegments; i++) {
    const theta = (i / filamentSegments) * Math.PI;
    const x = Math.cos(theta) * 0.58;
    const y = 0.55 + Math.sin(theta) * 1.75;
    const z = Math.sin(theta * 2) * 0.04;
    curvePoints.push(new THREE.Vector3(x, y, z));
  }
  const filamentCurve = new THREE.CatmullRomCurve3(curvePoints);
  const filamentGeo = new THREE.TubeGeometry(filamentCurve, 56, 0.035, 12, false);
  geometriesToDispose.push(filamentGeo);
  const filamentMesh = new THREE.Mesh(filamentGeo, filamentMat);
  filamentMesh.castShadow = true;
  bulbGroup.add(filamentMesh);

  // Residual Air Gas Molecules Cloud
  const gasCount = 80;
  const gasGeo = new THREE.BufferGeometry();
  geometriesToDispose.push(gasGeo);
  const gasPositions = new Float32Array(gasCount * 3);
  const glowTex = createGlowPointTexture();
  texturesToDispose.push(glowTex);

  for (let i = 0; i < gasCount; i++) {
    const idx = i * 3;
    const r = lcg() * 2.2;
    const theta = lcg() * Math.PI * 2;
    const phi = (lcg() - 0.5) * Math.PI;
    gasPositions[idx] = r * Math.cos(phi) * Math.cos(theta);
    gasPositions[idx + 1] = 1.0 + r * Math.sin(phi);
    gasPositions[idx + 2] = r * Math.cos(phi) * Math.sin(theta);
  }

  gasGeo.setAttribute("position", new THREE.BufferAttribute(gasPositions, 3));

  const gasMat = new THREE.PointsMaterial({
    size: 0.22,
    map: glowTex,
    color: 0x94a3b8,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
  });
  materialsToDispose.push(gasMat);

  const gasPoints = new THREE.Points(gasGeo, gasMat);
  bulbGroup.add(gasPoints);

  const dispose = () => {
    for (const geo of geometriesToDispose) geo.dispose();
    for (const mat of materialsToDispose) mat.dispose();
    for (const tex of texturesToDispose) tex.dispose();
  };

  return {
    rootGroup,
    bulbGroup,
    glassMesh,
    filamentMesh,
    bulbLight,
    gasPoints,
    gasPositions,
    gasCount,
    materials: {
      glassMat,
      brassBase,
      platinumLead,
      filamentMat,
      plasterInsulatorMat,
      woodMountMat,
      gasMat,
    },
    dispose,
  };
}

/**
 * Updates filament blackbody incandescence, thermal gas kinetics, and cutaway.
 */
export function updateEdisonBulbKinematics(
  model: EdisonBulbModel,
  dt: number,
  timeSec: number,
  incandescenceIntensity: number,
  filamentTempKelvin: number,
  thermalJitterPerS: number,
  filamentEmissiveScale: number,
  bulbLightScale: number,
  vacuumTorr: number,
  showGasMolecules: boolean,
  isCutaway: boolean,
  voltage = 110,
  filamentLength?: number,
): { incandescenceIntensity: number; glowColor: THREE.Color } {
  const edison = stepEdisonBulb({ voltage, filamentLength });
  const isGlowing = incandescenceIntensity > edison.glowThreshold;
  const glowColor = new THREE.Color(blackbodyRgb(filamentTempKelvin));

  if (isGlowing) {
    model.materials.filamentMat.emissive = glowColor;
    model.materials.filamentMat.color.copy(glowColor);
    model.materials.filamentMat.emissiveIntensity = incandescenceIntensity * filamentEmissiveScale;
    model.bulbLight.color = glowColor;
    model.bulbLight.intensity = incandescenceIntensity * bulbLightScale;
  } else {
    model.materials.filamentMat.emissiveIntensity = 0;
    model.bulbLight.intensity = 0;
  }

  // Gas molecule kinetic thermal jitter
  if (showGasMolecules && vacuumTorr > 1e-4) {
    model.gasPoints.visible = true;
    const gPos = model.gasPositions;
    const thermalJitter = thermalJitterPerS * dt;
    const heat = heatFrames(12, 24, 2);
    const heatFrame = Math.floor(timeSec * 8) % 24;
    for (let i = 0; i < model.gasCount; i++) {
      const idx = i * 3;
      const phase = timeSec * edison.gasPhaseOmega + i;
      const u = 0.5 + ((gPos[idx] ?? 0) + 0.6) / 2.4;
      const v = 0.5 + ((gPos[idx + 2] ?? 0) + 0.6) / 2.4;
      const local = 1 + Math.abs(sampleHeatAt(heat, 12, 24, heatFrame, u, v));
      gPos[idx] += Math.sin(phase) * thermalJitter * local;
      gPos[idx + 1] += Math.cos(phase * edison.gasYOmega) * thermalJitter * local;
      gPos[idx + 2] += Math.sin(phase * edison.gasZOmega) * thermalJitter * local;
    }
    model.gasPoints.geometry.attributes.position.needsUpdate = true;
  } else {
    model.gasPoints.visible = false;
  }

  // Cutaway Mode
  model.materials.glassMat.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.brassBase.opacity = isCutaway ? 0.45 : 1.0;
  model.materials.brassBase.transparent = isCutaway;

  return { incandescenceIntensity, glowColor };
}
