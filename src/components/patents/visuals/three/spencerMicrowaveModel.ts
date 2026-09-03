/**
 * spencerMicrowaveModel.ts
 *
 * Source-bounded procedural Three.js model for US 2,495,429.
 * Percy L. Spencer — Method of Treating Foodstuffs (1950).
 *
 * The patent drawing names two magnetron oscillators (10, 11), transformer 18,
 * power lines 19, a common wave guide 23, coaxial lines 24/25, coupling loops
 * 26/27, and a conveyor system 28. Internal magnetron materials, cavity
 * counts, operating frequency, ratings, and a household oven are not asserted
 * here. The geometry below is deliberately an explanatory abstraction of the
 * numbered path, not a reconstruction of an unstated commercial tube.
 */

import * as THREE from "three";
import { heatFrames, sampleHeatAt } from "@/physics/genericWasm";
import { createLcg } from "@/utils/lcg";
import { createGlowPointTexture } from "./ThreeStudioScene";

export interface SpencerMicrowaveModel {
  root: THREE.Group;
  magnetronGroup: THREE.Group;
  anodeOuter: THREE.Mesh;
  cathodeMesh: THREE.Mesh;
  spokePoints: THREE.Points;
  spokePointSets: readonly THREE.Points[];
  spokeGeo: THREE.BufferGeometry;
  spokePos: Float32Array;
  materials: {
    copperAnodeMat: THREE.MeshStandardMaterial;
    cathodeMat: THREE.MeshStandardMaterial;
    sourceMetalMat: THREE.MeshStandardMaterial;
    darkCavityMat: THREE.MeshStandardMaterial;
    boreMat: THREE.MeshStandardMaterial;
    steelMat: THREE.MeshStandardMaterial;
    spokeMat: THREE.PointsMaterial;
    ceramicInsulator?: THREE.MeshStandardMaterial;
    radiatorFin?: THREE.MeshStandardMaterial;
    transparentEnvelope?: THREE.MeshPhysicalMaterial;
  };
  updateKinematics: (
    delta: number,
    isOscillating: boolean,
    microwaveFreqMhz: number,
    dielectricLoss: number,
    showSpokeWheel: boolean,
    isCutaway?: boolean,
  ) => void;
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
 * Procedural OFHC Lathe-Machined Copper Texture
 */
function createMachinedCopperTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  ctx.fillStyle = "#c26228";
  ctx.fillRect(0, 0, 512, 512);

  // Concentric lathe tool machining bands
  for (let i = 0; i < 90; i++) {
    const y = i * 5.7 + (deterministicUnit(i, 0) - 0.5) * 2;
    const alpha = 0.06 + (i % 3 === 0 ? 0.12 : 0.03);
    ctx.strokeStyle = `rgba(135, 48, 12, ${alpha})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Neutral source-apparatus metal texture; no unstated material grade is implied.
 */
function createSourceMetalTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  ctx.fillStyle = "#2d3748";
  ctx.fillRect(0, 0, 512, 512);

  // Mottled crystalline grain
  for (let i = 0; i < 600; i++) {
    const px = deterministicUnit(i, 1) * 512;
    const py = deterministicUnit(i, 2) * 512;
    const r = 1.2 + deterministicUnit(i, 3) * 2.5;
    ctx.fillStyle = "rgba(74, 85, 104, 0.4)";
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildSpencerMicrowaveModel(): SpencerMicrowaveModel {
  const root = new THREE.Group();
  const disposables: Array<{ dispose: () => void }> = [];
  const lcg = createLcg(19500124);

  const copperTex = createMachinedCopperTexture();
  if (copperTex) disposables.push(copperTex);

  const sourceMetalTex = createSourceMetalTexture();
  if (sourceMetalTex) disposables.push(sourceMetalTex);

  // --- AUTHENTIC MATERIALS ---
  const copperAnodeMat = new THREE.MeshStandardMaterial({
    ...(copperTex ? { map: copperTex } : {}),
    transparent: true,
    opacity: 1.0,
    color: 0xd97706,
    roughness: 0.22,
    metalness: 0.9,
  });
  disposables.push(copperAnodeMat);

  const cathodeMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    roughness: 0.35,
    metalness: 0.4,
    emissive: 0xef4444,
    emissiveIntensity: 0.9,
  });
  disposables.push(cathodeMat);

  const sourceMetalMat = new THREE.MeshStandardMaterial({
    ...(sourceMetalTex ? { map: sourceMetalTex } : {}),
    transparent: true,
    opacity: 1.0,
    color: 0x334155,
    roughness: 0.38,
    metalness: 0.85,
  });
  disposables.push(sourceMetalMat);

  const darkCavityMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.75,
  });
  disposables.push(darkCavityMat);

  const boreMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.6,
  });
  disposables.push(boreMat);

  const steelMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.25,
    metalness: 0.92,
  });
  disposables.push(steelMat);

  const ceramicInsulator = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.15,
    metalness: 0.05,
  });
  disposables.push(ceramicInsulator);

  const radiatorFin = new THREE.MeshStandardMaterial({
    color: 0xa1a1aa,
    roughness: 0.28,
    metalness: 0.88,
  });
  disposables.push(radiatorFin);

  const transparentEnvelopeMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.92,
    roughness: 0.05,
    ior: 1.47,
    transparent: true,
    opacity: 0.85,
  });
  disposables.push(transparentEnvelopeMat);

  // ==========================================
  // SOURCE-NUMBERED OSCILLATOR ABSTRACTION (10 / 11)
  // ==========================================
  const magnetronGroup = new THREE.Group();
  magnetronGroup.name = "Oscillator source 10";
  root.add(magnetronGroup);

  // Cylindrical OFHC Copper Anode Block
  const anodeGeo = new THREE.CylinderGeometry(4.3, 4.3, 3.4, 48);
  disposables.push(anodeGeo);
  const anodeOuter = new THREE.Mesh(anodeGeo, copperAnodeMat);
  anodeOuter.castShadow = true;
  anodeOuter.receiveShadow = true;
  magnetronGroup.add(anodeOuter);

  // Neutral outer geometry; internal construction is not specified by the source.
  const finCount = 24;
  const finGeo = new THREE.BoxGeometry(1.4, 3.2, 0.08);
  disposables.push(finGeo);
  for (let f = 0; f < finCount; f++) {
    const fAngle = (f * Math.PI * 2) / finCount;
    const fin = new THREE.Mesh(finGeo, radiatorFin);
    fin.position.set(Math.cos(fAngle) * 4.9, 0, Math.sin(fAngle) * 4.9);
    fin.rotation.y = -fAngle;
    fin.castShadow = true;
    magnetronGroup.add(fin);
  }

  // Outer envelope for the named oscillator.
  const shroudGeo = new THREE.CylinderGeometry(5.75, 5.75, 3.2, 36, 1, true);
  disposables.push(shroudGeo);
  const shroud = new THREE.Mesh(shroudGeo, steelMat);
  shroud.castShadow = true;
  magnetronGroup.add(shroud);

  // Central Cylindrical Interaction Bore
  const boreGeo = new THREE.CylinderGeometry(1.5, 1.5, 3.42, 36);
  disposables.push(boreGeo);
  const boreMesh = new THREE.Mesh(boreGeo, boreMat);
  magnetronGroup.add(boreMesh);

  // Two visual slots mark the two source paths; this is not a cavity count.
  const numCavities = 2;
  for (let c = 0; c < numCavities; c++) {
    const angle = (c / numCavities) * Math.PI * 2;
    const rCavity = 2.75;
    const x = Math.cos(angle) * rCavity;
    const z = Math.sin(angle) * rCavity;

    // Resonant Inductive Cylinder Hole
    const cavGeo = new THREE.CylinderGeometry(0.72, 0.72, 3.44, 24);
    disposables.push(cavGeo);
    const cavMesh = new THREE.Mesh(cavGeo, darkCavityMat);
    cavMesh.position.set(x, 0, z);
    magnetronGroup.add(cavMesh);

    // Capacitive Coupling Slot Neck to Center Bore
    const slotGeo = new THREE.BoxGeometry(0.24, 3.44, 1.35);
    disposables.push(slotGeo);
    const slotMesh = new THREE.Mesh(slotGeo, darkCavityMat);
    slotMesh.position.set(Math.cos(angle) * 2.05, 0, Math.sin(angle) * 2.05);
    slotMesh.rotation.y = -angle;
    magnetronGroup.add(slotMesh);
  }

  // Neutral coupling bands; no mode-strapping claim is made.
  [-1.75, 1.75].forEach((yRing) => {
    const strapGeo = new THREE.TorusGeometry(2.35, 0.08, 12, 48);
    disposables.push(strapGeo);
    const strapMesh = new THREE.Mesh(strapGeo, copperAnodeMat);
    strapMesh.rotation.x = Math.PI / 2;
    strapMesh.position.y = yRing;
    magnetronGroup.add(strapMesh);
  });

  // Central interaction marker; the source does not specify emitter construction.
  const cathodeGeo = new THREE.CylinderGeometry(0.42, 0.42, 4.4, 24);
  disposables.push(cathodeGeo);
  const cathodeMesh = new THREE.Mesh(cathodeGeo, cathodeMat);
  cathodeMesh.castShadow = true;
  magnetronGroup.add(cathodeMesh);

  // End markers for the oscillator abstraction.
  [-2.4, 2.4].forEach((iy) => {
    const insGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.65, 20);
    disposables.push(insGeo);
    const insulator = new THREE.Mesh(insGeo, ceramicInsulator);
    insulator.position.y = iy;
    insulator.castShadow = true;
    magnetronGroup.add(insulator);
  });

  // Coupling loop and common wave-guide path (26/27 -> 23).
  const waveguideGroup = new THREE.Group();
  waveguideGroup.name = "Oscillator coupling guide 26";
  waveguideGroup.position.set(3.8, 0, 0);

  const guideGeo = new THREE.BoxGeometry(3.5, 2.2, 1.4);
  disposables.push(guideGeo);
  const guideMesh = new THREE.Mesh(guideGeo, steelMat);
  guideMesh.position.x = 1.75;
  guideMesh.castShadow = true;
  waveguideGroup.add(guideMesh);

  // Waveguide Mounting Flange with Bolting Holes
  const flangeGeo = new THREE.BoxGeometry(0.3, 3.2, 2.2);
  disposables.push(flangeGeo);
  const flange = new THREE.Mesh(flangeGeo, steelMat);
  flange.position.x = 3.5;
  flange.castShadow = true;
  waveguideGroup.add(flange);

  const loopGeo = new THREE.TorusGeometry(0.55, 0.06, 8, 24);
  disposables.push(loopGeo);
  const loopMesh = new THREE.Mesh(loopGeo, copperAnodeMat);
  loopMesh.rotation.y = Math.PI / 2;
  waveguideGroup.add(loopMesh);
  magnetronGroup.add(waveguideGroup);

  // Equipment Foundation Plinth & Conveyor Stand Legs
  const benchGroup = new THREE.Group();
  root.add(benchGroup);

  const floorPlinthGeo = new THREE.BoxGeometry(14.0, 0.35, 8.0);
  disposables.push(floorPlinthGeo);
  const floorPlinth = new THREE.Mesh(floorPlinthGeo, sourceMetalMat);
  floorPlinth.position.set(0, -3.8, 0);
  floorPlinth.receiveShadow = true;
  benchGroup.add(floorPlinth);

  // Transformer floor foundation pedestal
  const transPlinthGeo = new THREE.BoxGeometry(3.2, 2.4, 2.8);
  disposables.push(transPlinthGeo);
  const transPlinth = new THREE.Mesh(transPlinthGeo, sourceMetalMat);
  transPlinth.position.set(0, -2.4, -2.6);
  transPlinth.castShadow = true;
  benchGroup.add(transPlinth);

  const transformerGeo = new THREE.BoxGeometry(2.6, 2.4, 2.2);
  disposables.push(transformerGeo);
  const transformer = new THREE.Mesh(transformerGeo, steelMat);
  transformer.position.set(0, 0, -2.6);
  root.add(transformer);

  const commonGuideGeo = new THREE.BoxGeometry(7.2, 1.4, 1.4);
  disposables.push(commonGuideGeo);
  const commonGuide = new THREE.Mesh(commonGuideGeo, steelMat);
  commonGuide.position.set(0, 0, 1.3);
  root.add(commonGuide);

  // 4 Chamber Support Upright Columns holding treatment applicator
  for (const cx of [-3.4, 3.4]) {
    for (const cz of [0.5, 2.1]) {
      const colGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.4, 16);
      disposables.push(colGeo);
      const col = new THREE.Mesh(colGeo, steelMat);
      col.position.set(cx, -1.2, cz);
      col.castShadow = true;
      benchGroup.add(col);
    }
  }

  const conveyorGeo = new THREE.BoxGeometry(11.5, 0.16, 3.2);
  disposables.push(conveyorGeo);
  const conveyor = new THREE.Mesh(conveyorGeo, steelMat);
  conveyor.position.set(0, -2.4, 1.3);
  root.add(conveyor);

  // Conveyor Bed Stanchion Legs down to Floor Plinth
  for (const lx of [-5.2, -1.8, 1.8, 5.2]) {
    for (const lz of [-0.1, 2.7]) {
      const cLegGeo = new THREE.BoxGeometry(0.16, 1.35, 0.16);
      disposables.push(cLegGeo);
      const cLeg = new THREE.Mesh(cLegGeo, steelMat);
      cLeg.position.set(lx, -3.1, lz);
      cLeg.castShadow = true;
      benchGroup.add(cLeg);
    }
  }

  // The source names a conveyor (28), not a turntable or mode-stirrer.

  // Permanent Magnet Pole Shoes & Outer Magnetic Return Yoke
  [-2.8, 2.8].forEach((yMag) => {
    const poleGeo = new THREE.CylinderGeometry(4.6, 4.6, 1.2, 36);
    disposables.push(poleGeo);
    const poleShoe = new THREE.Mesh(poleGeo, sourceMetalMat);
    poleShoe.position.y = yMag;
    poleShoe.castShadow = true;
    magnetronGroup.add(poleShoe);
  });

  // Heavy steel C-clamp magnetic return yoke bridge
  const yokeGeo = new THREE.BoxGeometry(1.2, 6.8, 2.2);
  disposables.push(yokeGeo);
  const yoke = new THREE.Mesh(yokeGeo, sourceMetalMat);
  yoke.position.set(-4.8, 0, 0);
  yoke.castShadow = true;
  magnetronGroup.add(yoke);

  // ==========================================
  // ROTATING ELECTRON SPOKE WHEEL PARTICLES
  // ==========================================
  const spokeCount = 140;
  const spokeGeo = new THREE.BufferGeometry();
  disposables.push(spokeGeo);
  const spokePos = new Float32Array(spokeCount * 3);
  const glowTex = createGlowPointTexture();
  disposables.push(glowTex);

  for (let i = 0; i < spokeCount; i++) {
    const idx = i * 3;
    const spokeIndex = i % 4;
    const baseAngle = (spokeIndex * Math.PI) / 2;
    const r = 0.5 + lcg() * 0.9;
    const angle = baseAngle + (lcg() - 0.5) * 0.3;
    spokePos[idx] = Math.cos(angle) * r;
    spokePos[idx + 1] = (lcg() - 0.5) * 1.5;
    spokePos[idx + 2] = Math.sin(angle) * r;
  }
  spokeGeo.setAttribute("position", new THREE.BufferAttribute(spokePos, 3));

  const spokeMat = new THREE.PointsMaterial({
    size: 0.26,
    map: glowTex,
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  disposables.push(spokeMat);

  const spokePoints = new THREE.Points(spokeGeo, spokeMat);
  spokePoints.name = "Oscillator 10 illustrative electron spokes";
  magnetronGroup.add(spokePoints);

  // The drawing shows two oscillator sources joined to one transformer and
  // one treatment path. Clone only after every oscillator-local organ has
  // been added, so source 11 cannot silently lose its pole shoes, return yoke,
  // or illustrative electron-spoke layer.
  magnetronGroup.position.x = -5.4;
  const secondOscillator = magnetronGroup.clone(true);
  secondOscillator.name = "Oscillator source 11";
  secondOscillator.position.x = 5.4;
  const secondGuide = secondOscillator.getObjectByName("Oscillator coupling guide 26");
  if (!secondGuide) throw new Error("Oscillator 11 is missing its coupling guide 27.");
  // Mirror the second branch inward so oscillator 11 actually meets common
  // guide 23 instead of projecting an isolated guide farther outboard.
  secondGuide.name = "Oscillator coupling guide 27";
  secondGuide.position.x = -3.8;
  secondGuide.rotation.y = Math.PI;
  const secondSpokePoints = secondOscillator.getObjectByName(
    "Oscillator 10 illustrative electron spokes",
  );
  if (!(secondSpokePoints instanceof THREE.Points)) {
    throw new Error("Oscillator 11 is missing its illustrative electron-spoke layer.");
  }
  secondSpokePoints.name = "Oscillator 11 illustrative electron spokes";
  root.add(secondOscillator);
  const spokePointSets = [spokePoints, secondSpokePoints] as const;

  const updateKinematics = (
    delta: number,
    isOscillating: boolean,
    spokeDisplayOmegaRadPerS: number,
    spokeOpacity: number,
    showSpokeWheel: boolean,
    isCutaway = false,
  ) => {
    updateSpencerMicrowaveKinematics(
      model,
      delta,
      isOscillating,
      spokeDisplayOmegaRadPerS,
      spokeOpacity,
      showSpokeWheel,
      isCutaway,
    );
  };

  const dispose = () => {
    for (const d of disposables) {
      d.dispose();
    }
  };

  const model: SpencerMicrowaveModel = {
    root,
    magnetronGroup,
    anodeOuter,
    cathodeMesh,
    spokePoints,
    spokePointSets,
    spokeGeo,
    spokePos,
    materials: {
      copperAnodeMat,
      cathodeMat,
      sourceMetalMat,
      darkCavityMat,
      boreMat,
      steelMat,
      spokeMat,
      ceramicInsulator,
      radiatorFin,
      transparentEnvelope: transparentEnvelopeMat,
    },
    updateKinematics,
    dispose,
  };

  return model;
}

/**
 * Updates Percy Spencer cavity magnetron electron spoke wheel rotation, RF dielectric loss glow, and anode block cutaway.
 */
export function updateSpencerMicrowaveKinematics(
  model: SpencerMicrowaveModel,
  delta: number,
  isOscillating: boolean,
  spokeDisplayOmegaRadPerS: number,
  spokeOpacity: number,
  showSpokeWheel: boolean,
  isCutaway = false,
): void {
  if (isOscillating) {
    const heat = heatFrames(12, 16, 2);
    const local = 1 + Math.abs(sampleHeatAt(heat, 12, 16, 8, 0.3, 0.3));
    for (const spokeLayer of model.spokePointSets) {
      spokeLayer.visible = showSpokeWheel;
      spokeLayer.rotation.y += delta * spokeDisplayOmegaRadPerS * local;
    }
    model.materials.spokeMat.opacity = Math.min(1, spokeOpacity * local);
  } else {
    for (const spokeLayer of model.spokePointSets) spokeLayer.visible = false;
  }

  // Cutaway mode: make copper anode block and magnet pole shoes translucent
  model.materials.copperAnodeMat.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.copperAnodeMat.transparent = isCutaway;
  model.materials.sourceMetalMat.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.sourceMetalMat.transparent = isCutaway;
}
