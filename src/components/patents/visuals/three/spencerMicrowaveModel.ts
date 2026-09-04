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
import { SPENCER_NORMALIZED_CONVEYOR_SPEED } from "@/physics/spencerMicrowaveKernel";
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
  transformerAssembly: THREE.Group;
  commonWaveguide: THREE.Group;
  conveyorAssembly: THREE.Group;
  foodLoad: THREE.Mesh;
  coaxialLines: readonly [THREE.Mesh, THREE.Mesh];
  electricalConductors: readonly THREE.Mesh[];
  materials: {
    copperAnodeMat: THREE.MeshStandardMaterial;
    cathodeMat: THREE.MeshStandardMaterial;
    sourceMetalMat: THREE.MeshStandardMaterial;
    darkCavityMat: THREE.MeshStandardMaterial;
    boreMat: THREE.MeshStandardMaterial;
    steelMat: THREE.MeshStandardMaterial;
    spokeMat: THREE.PointsMaterial;
  };
  updateKinematics: (
    delta: number,
    pathActive: boolean,
    displayPhaseRateRadPerS: number,
    displayOpacity: number,
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
 * Procedural copper-colored machined texture.
 *
 * The source suggests highly conductive material "such as copper"; it does
 * not identify an alloy or purity grade.
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

  // --- SOURCE-BOUNDED MATERIAL PALETTE ---
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

  const conductorMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0x92400e,
    emissiveIntensity: 0.18,
    roughness: 0.32,
    metalness: 0.72,
  });
  disposables.push(conductorMat);

  const beltMat = new THREE.MeshStandardMaterial({
    color: 0x262626,
    roughness: 0.9,
    metalness: 0.08,
  });
  disposables.push(beltMat);

  const foodMat = new THREE.MeshStandardMaterial({
    color: 0xf5deb3,
    roughness: 0.86,
  });
  disposables.push(foodMat);

  const tubeBetween = (
    name: string,
    points: readonly THREE.Vector3[],
    radius: number,
    material: THREE.Material,
  ) => {
    const curve = new THREE.CatmullRomCurve3(points.map((point) => point.clone()));
    const geometry = new THREE.TubeGeometry(curve, 32, radius, 8, false);
    disposables.push(geometry);
    const tube = new THREE.Mesh(geometry, material);
    tube.name = name;
    tube.castShadow = true;
    root.add(tube);
    return tube;
  };

  // ==========================================
  // SOURCE-NUMBERED OSCILLATOR ABSTRACTION (10 / 11)
  // ==========================================
  const magnetronGroup = new THREE.Group();
  magnetronGroup.name = "Oscillator source 10";
  root.add(magnetronGroup);

  // Conductive evacuated envelope 12. Cutaway transparency reveals the
  // source-described central cathode and inward radial anode vanes.
  const anodeGeo = new THREE.CylinderGeometry(4.3, 4.3, 3.4, 48, 1, true);
  disposables.push(anodeGeo);
  const anodeOuter = new THREE.Mesh(anodeGeo, copperAnodeMat);
  anodeOuter.castShadow = true;
  anodeOuter.receiveShadow = true;
  magnetronGroup.add(anodeOuter);

  // Central Cylindrical Interaction Bore
  const boreGeo = new THREE.CylinderGeometry(1.5, 1.5, 3.42, 36);
  disposables.push(boreGeo);
  const boreMesh = new THREE.Mesh(boreGeo, boreMat);
  magnetronGroup.add(boreMesh);

  // A diagrammatic plurality of inward radial vanes 13. The grant requires a
  // plurality but gives no exact count, so the display does not label this
  // illustrative count as a measured tube construction.
  const illustrativeVaneCount = 8;
  for (let index = 0; index < illustrativeVaneCount; index += 1) {
    const angle = (index * Math.PI * 2) / illustrativeVaneCount;
    const vaneGeo = new THREE.BoxGeometry(2.45, 3.25, 0.16);
    disposables.push(vaneGeo);
    const vane = new THREE.Mesh(vaneGeo, copperAnodeMat);
    vane.name = `Illustrative radial anode vane 13 (${index + 1})`;
    vane.position.set(Math.cos(angle) * 2.72, 0, Math.sin(angle) * 2.72);
    vane.rotation.y = -angle;
    magnetronGroup.add(vane);
  }

  // Central interaction marker; the source does not specify emitter construction.
  const cathodeGeo = new THREE.CylinderGeometry(0.42, 0.42, 4.4, 24);
  disposables.push(cathodeGeo);
  const cathodeMesh = new THREE.Mesh(cathodeGeo, cathodeMat);
  cathodeMesh.castShadow = true;
  magnetronGroup.add(cathodeMesh);

  // Source-numbered coupling loop 26. External coaxial line 24 is added after
  // both oscillators are placed in the apparatus layout.
  const waveguideGroup = new THREE.Group();
  waveguideGroup.name = "Oscillator coupling guide 26";
  waveguideGroup.position.set(4.15, 0, 0);

  const loopGeo = new THREE.TorusGeometry(0.55, 0.06, 8, 24);
  disposables.push(loopGeo);
  const loopMesh = new THREE.Mesh(loopGeo, copperAnodeMat);
  loopMesh.rotation.y = Math.PI / 2;
  waveguideGroup.add(loopMesh);
  magnetronGroup.add(waveguideGroup);

  // Equipment foundation: every apparatus organ is supported by this plinth.
  const benchGroup = new THREE.Group();
  root.add(benchGroup);

  const floorPlinthGeo = new THREE.BoxGeometry(13.5, 0.3, 8.4);
  disposables.push(floorPlinthGeo);
  const floorPlinth = new THREE.Mesh(floorPlinthGeo, sourceMetalMat);
  floorPlinth.name = "Spencer apparatus foundation";
  floorPlinth.position.set(-0.8, -2.05, 0);
  floorPlinth.receiveShadow = true;
  benchGroup.add(floorPlinth);

  // Transformer 18: two supported windings on one closed ferromagnetic core.
  const transformerAssembly = new THREE.Group();
  transformerAssembly.name = "Transformer 18";
  transformerAssembly.position.set(-6, -0.84, 0);
  root.add(transformerAssembly);
  for (const x of [-0.62, 0.62]) {
    const coilGeo = new THREE.TorusGeometry(0.48, 0.13, 10, 32);
    disposables.push(coilGeo);
    for (const y of [-0.55, -0.28, 0, 0.28, 0.55]) {
      const coil = new THREE.Mesh(coilGeo, conductorMat);
      coil.position.set(x, y, 0);
      coil.rotation.x = Math.PI / 2;
      transformerAssembly.add(coil);
    }
  }
  for (const [size, position] of [
    [
      [2.25, 0.22, 1.05],
      [0, 0.95, 0],
    ],
    [
      [2.25, 0.22, 1.05],
      [0, -0.95, 0],
    ],
    [
      [0.22, 1.9, 1.05],
      [-1.02, 0, 0],
    ],
    [
      [0.22, 1.9, 1.05],
      [1.02, 0, 0],
    ],
  ] as const) {
    const coreGeo = new THREE.BoxGeometry(...size);
    disposables.push(coreGeo);
    const coreMember = new THREE.Mesh(coreGeo, sourceMetalMat);
    coreMember.position.set(position[0], position[1], position[2]);
    transformerAssembly.add(coreMember);
  }

  // Common hollow wave guide 23 ends directly over the transverse conveyor.
  const commonWaveguide = new THREE.Group();
  commonWaveguide.name = "Common hollow wave guide 23";
  commonWaveguide.position.set(0.95, -0.05, 0);
  for (const [name, size, position] of [
    ["top wall", [4.25, 0.09, 1.45], [0, 0.58, 0]],
    ["bottom wall", [4.25, 0.09, 1.45], [0, -0.58, 0]],
    ["front wall", [4.25, 1.07, 0.09], [0, 0, 0.68]],
    ["back wall", [4.25, 1.07, 0.09], [0, 0, -0.68]],
  ] as const) {
    const panelGeo = new THREE.BoxGeometry(...size);
    disposables.push(panelGeo);
    const panel = new THREE.Mesh(panelGeo, steelMat);
    panel.name = `Wave guide 23 ${name}`;
    panel.position.set(position[0], position[1], position[2]);
    panel.castShadow = true;
    commonWaveguide.add(panel);
  }
  root.add(commonWaveguide);

  // Conveyor 28 crosses the guide outlet at right angles, making exposure
  // time legible as belt travel through a bounded treatment region.
  const conveyorAssembly = new THREE.Group();
  conveyorAssembly.name = "Transversely-moving conveyor system 28";
  conveyorAssembly.position.set(3.35, -1.05, 0);
  root.add(conveyorAssembly);
  const conveyorGeo = new THREE.BoxGeometry(1.8, 0.16, 6.1);
  disposables.push(conveyorGeo);
  const conveyorBelt = new THREE.Mesh(conveyorGeo, beltMat);
  conveyorBelt.name = "Conveyor belt 28";
  conveyorAssembly.add(conveyorBelt);
  const rollerGeo = new THREE.CylinderGeometry(0.24, 0.24, 1.82, 20);
  rollerGeo.rotateZ(Math.PI / 2);
  disposables.push(rollerGeo);
  for (const z of [-2.82, 2.82]) {
    const roller = new THREE.Mesh(rollerGeo, steelMat);
    roller.position.set(0, 0, z);
    conveyorAssembly.add(roller);
  }
  const foodGeo = new THREE.SphereGeometry(0.38, 24, 16);
  disposables.push(foodGeo);
  const foodLoad = new THREE.Mesh(foodGeo, foodMat);
  foodLoad.name = "Food load in treatment region";
  foodLoad.scale.set(1.15, 0.82, 0.9);
  // The scaled sphere's underside meets the belt top at y ~= 0.08. Keeping
  // this contact explicit prevents the food load from hovering over conveyor 28.
  foodLoad.position.set(0, 0.392, 0);
  foodLoad.userData.normalizedDisplayTravel = 2.5;
  conveyorAssembly.add(foodLoad);
  for (const z of [-2.35, 2.35]) {
    for (const x of [-0.68, 0.68]) {
      const legGeo = new THREE.BoxGeometry(0.14, 0.9, 0.14);
      disposables.push(legGeo);
      const leg = new THREE.Mesh(legGeo, sourceMetalMat);
      leg.position.set(x, -0.52, z);
      conveyorAssembly.add(leg);
    }
  }

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
  // one treatment path. Scale and place the diagrammatic source bodies so
  // they remain distinct and the connected system—not an invented tube
  // housing—owns the overview.
  magnetronGroup.scale.setScalar(0.38);
  magnetronGroup.position.set(-3.2, -0.1, -2);
  const secondOscillator = magnetronGroup.clone(true);
  secondOscillator.name = "Oscillator source 11";
  secondOscillator.position.set(-3.2, -0.1, 2);
  const secondGuide = secondOscillator.getObjectByName("Oscillator coupling guide 26");
  if (!secondGuide) throw new Error("Oscillator 11 is missing its coupling guide 27.");
  secondGuide.name = "Oscillator coupling guide 27";
  const secondSpokePoints = secondOscillator.getObjectByName(
    "Oscillator 10 illustrative electron spokes",
  );
  if (!(secondSpokePoints instanceof THREE.Points)) {
    throw new Error("Oscillator 11 is missing its illustrative electron-spoke layer.");
  }
  secondSpokePoints.name = "Oscillator 11 illustrative electron spokes";
  root.add(secondOscillator);
  const spokePointSets = [spokePoints, secondSpokePoints] as const;

  // Supported apparatus: oscillator pedestals and guide columns meet the
  // common foundation rather than leaving source organs suspended in space.
  for (const [name, x, y, z, width, height, depth] of [
    ["Oscillator 10 support", -3.2, -1.42, -2, 1.2, 0.96, 1.2],
    ["Oscillator 11 support", -3.2, -1.42, 2, 1.2, 0.96, 1.2],
    ["Wave guide 23 support A", -0.5, -1.2875, -0.55, 0.16, 1.225, 0.16],
    ["Wave guide 23 support B", -0.5, -1.2875, 0.55, 0.16, 1.225, 0.16],
    ["Wave guide 23 support C", 2.2, -1.2875, -0.55, 0.16, 1.225, 0.16],
    ["Wave guide 23 support D", 2.2, -1.2875, 0.55, 0.16, 1.225, 0.16],
  ] as const) {
    const supportGeo = new THREE.BoxGeometry(width, height, depth);
    disposables.push(supportGeo);
    const support = new THREE.Mesh(supportGeo, sourceMetalMat);
    support.name = name;
    support.position.set(x, y, z);
    root.add(support);
  }

  // Coaxial transmission lines 24 and 25 physically bridge both coupling
  // loops to the open inlet of common guide 23. The endpoints deliberately
  // overlap their mating organs so no line floats between assemblies.
  const coaxialLines = [
    tubeBetween(
      "Coaxial transmission line 24",
      [
        new THREE.Vector3(-1.623, -0.1, -2),
        new THREE.Vector3(-1.35, 0.5, -1.35),
        new THREE.Vector3(-1.175, 0.25, -0.38),
      ],
      0.085,
      copperAnodeMat,
    ),
    tubeBetween(
      "Coaxial transmission line 25",
      [
        new THREE.Vector3(-1.623, -0.1, 2),
        new THREE.Vector3(-1.35, 0.5, 1.35),
        new THREE.Vector3(-1.175, 0.25, 0.38),
      ],
      0.085,
      copperAnodeMat,
    ),
  ] as const;

  // Conductors 15/16 energize the two envelopes; 20/21 join the cathodes;
  // 22 returns that junction to the transformer center tap. Lines 19 terminate
  // at supported external-input posts on the plinth boundary.
  const electricalConductors = [
    tubeBetween(
      "Transformer conductor 15",
      [
        new THREE.Vector3(-4.98, -0.35, -0.28),
        new THREE.Vector3(-4.65, -0.1, -1.25),
        new THREE.Vector3(-4.83, -0.1, -2),
      ],
      0.045,
      conductorMat,
    ),
    tubeBetween(
      "Transformer conductor 16",
      [
        new THREE.Vector3(-4.98, -0.35, 0.28),
        new THREE.Vector3(-4.65, -0.1, 1.25),
        new THREE.Vector3(-4.83, -0.1, 2),
      ],
      0.045,
      conductorMat,
    ),
    tubeBetween(
      "Cathode conductor 20",
      [new THREE.Vector3(-3.2, -0.1, -2), new THREE.Vector3(-4.35, 0.55, -1.05)],
      0.038,
      conductorMat,
    ),
    tubeBetween(
      "Cathode conductor 21",
      [new THREE.Vector3(-3.2, -0.1, 2), new THREE.Vector3(-4.35, 0.55, 1.05)],
      0.038,
      conductorMat,
    ),
    tubeBetween(
      "Center-tap conductor 22",
      [
        new THREE.Vector3(-4.35, 0.55, -1.05),
        new THREE.Vector3(-4.35, 0.55, 1.05),
        new THREE.Vector3(-4.98, -0.72, 0),
      ],
      0.038,
      conductorMat,
    ),
    tubeBetween(
      "Power line 19 upper external boundary",
      [new THREE.Vector3(-7.02, -0.2, -0.3), new THREE.Vector3(-7.55, -0.2, -0.3)],
      0.05,
      conductorMat,
    ),
    tubeBetween(
      "Power line 19 lower external boundary",
      [new THREE.Vector3(-7.02, -1.2, 0.3), new THREE.Vector3(-7.55, -1.2, 0.3)],
      0.05,
      conductorMat,
    ),
  ] as const;

  const updateKinematics = (
    delta: number,
    pathActive: boolean,
    displayPhaseRateRadPerS: number,
    displayOpacity: number,
    showSpokeWheel: boolean,
    isCutaway = false,
  ) => {
    updateSpencerMicrowaveKinematics(
      model,
      delta,
      pathActive,
      displayPhaseRateRadPerS,
      displayOpacity,
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
    transformerAssembly,
    commonWaveguide,
    conveyorAssembly,
    foodLoad,
    coaxialLines,
    electricalConductors,
    materials: {
      copperAnodeMat,
      cathodeMat,
      sourceMetalMat,
      darkCavityMat,
      boreMat,
      steelMat,
      spokeMat,
    },
    updateKinematics,
    dispose,
  };

  return model;
}

/**
 * Updates the normalized push-pull teaching display, conveyor motion, and cutaway.
 * No angular rate or conveyor distance returned by this function is an SI result.
 */
export function updateSpencerMicrowaveKinematics(
  model: SpencerMicrowaveModel,
  delta: number,
  pathActive: boolean,
  displayPhaseRateRadPerS: number,
  displayOpacity: number,
  showSpokeWheel: boolean,
  isCutaway = false,
): void {
  const finiteDelta = Number.isFinite(delta) ? Math.max(0, delta) : 0;
  const displayRate = Number.isFinite(displayPhaseRateRadPerS)
    ? Math.max(0, displayPhaseRateRadPerS)
    : 0;
  if (pathActive) {
    const priorPhase = Number.isFinite(model.root.userData.pushPullDisplayPhaseRad)
      ? (model.root.userData.pushPullDisplayPhaseRad as number)
      : 0;
    const nextPhase = (priorPhase + finiteDelta * displayRate) % (Math.PI * 2);
    const activeOscillatorIndex = nextPhase < Math.PI ? 0 : 1;
    model.root.userData.pushPullDisplayPhaseRad = nextPhase;
    model.root.userData.activeOscillatorNumeral = activeOscillatorIndex === 0 ? 10 : 11;
    for (const [index, spokeLayer] of model.spokePointSets.entries()) {
      spokeLayer.visible = showSpokeWheel && index === activeOscillatorIndex;
      spokeLayer.rotation.y = nextPhase;
    }
    model.materials.spokeMat.opacity = Math.max(0, Math.min(1, displayOpacity));
  } else {
    for (const spokeLayer of model.spokePointSets) spokeLayer.visible = false;
    model.root.userData.activeOscillatorNumeral = null;
  }

  const priorTravel = Number.isFinite(model.foodLoad.userData.normalizedDisplayTravel)
    ? (model.foodLoad.userData.normalizedDisplayTravel as number)
    : 0;
  const nextTravel = (priorTravel + finiteDelta * SPENCER_NORMALIZED_CONVEYOR_SPEED) % 5;
  model.foodLoad.userData.normalizedDisplayTravel = nextTravel;
  model.foodLoad.position.z = -2.5 + nextTravel;

  // Cutaway mode affects only the source-described conductive envelopes and
  // vanes—not the transformer, foundation, guide, or conveyor.
  model.materials.copperAnodeMat.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.copperAnodeMat.transparent = isCutaway;
}
