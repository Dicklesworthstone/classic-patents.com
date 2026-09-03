/**
 * Procedural Three.js teaching model for US 2,708,656.
 *
 * Figures 7–8, rather than the later CP-1 publicity photographs, own the
 * visible apparatus topology here: an enclosed rectangular graphite pile,
 * geometrically spaced natural-uranium rods, side-entry absorber mechanisms,
 * supported guide tables, and an ionization chamber. Dimensions are enlarged
 * display mappings and are not represented as source measurements.
 */

import * as THREE from "three";
import { computeFermiNormalizedDisplayField } from "@/physics/fieldTextures";
import {
  heatFrames,
  laplacianModeShape,
  laplacianModes,
  sampleHeatAt,
} from "@/physics/genericWasm";
import { createLcg } from "@/utils/lcg";
import { createGlowPointTexture } from "./ThreeStudioScene";

export interface FermiReactorModel {
  root: THREE.Group;
  foundation: THREE.Mesh;
  enclosureGroup: THREE.Group;
  supportGroup: THREE.Group;
  pileGroup: THREE.Group;
  fuelGroup: THREE.Group;
  rodGroup: THREE.Group;
  controlRods: THREE.Mesh[];
  controlRodCarriages: THREE.Mesh[];
  ionizationChamber: THREE.Mesh;
  neutronPoints: THREE.Points;
  neutronGeo: THREE.BufferGeometry;
  neutronPos: Float32Array;
  neutronVel: Float32Array;
  neutronColors: Float32Array;
  neutronDisplayField: Float32Array;
  heatFieldFrames: Float64Array;
  laplacianModeField: Float64Array;
  neutronCount: number;
  graphiteBricks: THREE.InstancedMesh;
  uraniumRods: THREE.InstancedMesh;
  graphiteMat: THREE.MeshStandardMaterial;
  uraniumFuelMat: THREE.MeshStandardMaterial;
  enclosureMat: THREE.MeshStandardMaterial;
  updateKinematics: (
    delta: number,
    controlRodWithdrawalPct: number,
    kEff: number,
    moderatorPurityPct: number,
    neutronDisplaySpeed: number,
    showNeutronCascade: boolean,
    rodStudioX?: number,
    fuelGlowIntensity?: number,
    isCutaway?: boolean,
    claim1Active?: boolean,
  ) => void;
  dispose: () => void;
}

export function buildFermiReactorModel(): FermiReactorModel {
  const root = new THREE.Group();
  root.name = "US 2708656 Figures 7-8 graphite and natural-uranium reactor";
  const disposables: Array<{ dispose: () => void }> = [];
  const lcg = createLcg(19421202);

  const material = (options: THREE.MeshStandardMaterialParameters) => {
    const result = new THREE.MeshStandardMaterial(options);
    disposables.push(result);
    return result;
  };

  const addBox = (
    name: string,
    size: [number, number, number],
    position: [number, number, number],
    boxMaterial: THREE.Material,
    parent: THREE.Object3D = root,
  ) => {
    const geometry = new THREE.BoxGeometry(...size);
    disposables.push(geometry);
    const mesh = new THREE.Mesh(geometry, boxMaterial);
    mesh.name = name;
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };

  const graphiteMat = material({
    color: 0x252b35,
    roughness: 0.82,
    metalness: 0.08,
  });
  const uraniumFuelMat = material({
    color: 0x9a6b29,
    roughness: 0.32,
    metalness: 0.72,
  });
  const cadmiumRodMat = material({
    color: 0xb45309,
    roughness: 0.3,
    metalness: 0.72,
  });
  const structuralSteelMat = material({
    color: 0x475569,
    roughness: 0.4,
    metalness: 0.72,
  });
  const foundationMat = material({
    color: 0x78716c,
    roughness: 0.92,
    metalness: 0,
  });
  const detectorMat = material({
    color: 0xb6c0ce,
    roughness: 0.28,
    metalness: 0.82,
  });
  const enclosureMat = material({
    color: 0xa8a29e,
    roughness: 0.78,
    metalness: 0.08,
    transparent: true,
    opacity: 0.72,
  });

  // Every major assembly terminates at this concrete exhibit foundation.
  const foundation = addBox(
    "concrete foundation 10 supporting reactor and guide tables",
    [18, 0.32, 9],
    [0.6, -3.56, 0],
    foundationMat,
  );

  const enclosureGroup = new THREE.Group();
  enclosureGroup.name = "rectangular enclosure 11 with top opening 20";
  root.add(enclosureGroup);
  addBox("rear enclosure wall", [6.8, 5.4, 0.18], [0, -0.7, -3.35], enclosureMat, enclosureGroup);
  addBox("left enclosure wall", [0.18, 5.4, 6.8], [-3.35, -0.7, 0], enclosureMat, enclosureGroup);
  addBox("right enclosure wall", [0.18, 5.4, 6.8], [3.35, -0.7, 0], enclosureMat, enclosureGroup);
  addBox("front enclosure wall", [6.8, 5.4, 0.18], [0, -0.7, 3.35], enclosureMat, enclosureGroup);
  // Four top plates leave the source's central access opening visible.
  addBox("top plate front", [6.8, 0.18, 2.25], [0, 2, 2.22], enclosureMat, enclosureGroup);
  addBox("top plate rear", [6.8, 0.18, 2.25], [0, 2, -2.22], enclosureMat, enclosureGroup);
  addBox("top plate left", [2.25, 0.18, 2.25], [-2.22, 2, 0], enclosureMat, enclosureGroup);
  addBox("top plate right", [2.25, 0.18, 2.25], [2.22, 2, 0], enclosureMat, enclosureGroup);

  const pileGroup = new THREE.Group();
  pileGroup.name = "continuous graphite moderator lattice";
  root.add(pileGroup);

  const graphitePositions: Array<readonly [number, number, number]> = [];
  for (let layer = 0; layer < 13; layer++) {
    for (let column = 0; column < 17; column++) {
      for (let row = 0; row < 17; row++) {
        graphitePositions.push([-2.72 + column * 0.34, -3.22 + layer * 0.4, -2.72 + row * 0.34]);
      }
    }
  }

  const graphiteBrickGeo = new THREE.BoxGeometry(0.32, 0.38, 0.32);
  disposables.push(graphiteBrickGeo);
  const graphiteBricks = new THREE.InstancedMesh(
    graphiteBrickGeo,
    graphiteMat,
    graphitePositions.length,
  );
  graphiteBricks.name = "Graphite moderator brick lattice";
  graphiteBricks.castShadow = true;
  graphiteBricks.receiveShadow = true;
  const instanceMatrix = new THREE.Matrix4();
  graphitePositions.forEach(([x, y, z], index) => {
    instanceMatrix.makeTranslation(x, y, z);
    graphiteBricks.setMatrixAt(index, instanceMatrix);
  });
  graphiteBricks.instanceMatrix.needsUpdate = true;
  pileGroup.add(graphiteBricks);

  const fuelGroup = new THREE.Group();
  fuelGroup.name = "Claim 1 geometrically spaced natural-uranium rod lattice";
  root.add(fuelGroup);
  const fuelPositions: Array<readonly [number, number]> = [];
  for (const y of [-2.35, -1.15, 0.05, 1.25]) {
    for (const x of [-2.1, -0.7, 0.7, 2.1]) fuelPositions.push([x, y]);
  }
  const fuelGeo = new THREE.CylinderGeometry(0.13, 0.13, 5.9, 16);
  fuelGeo.rotateX(Math.PI / 2);
  disposables.push(fuelGeo);
  const uraniumRods = new THREE.InstancedMesh(fuelGeo, uraniumFuelMat, fuelPositions.length);
  uraniumRods.name = "Natural uranium rods disposed in a geometric pattern";
  fuelPositions.forEach(([x, y], index) => {
    instanceMatrix.makeTranslation(x, y, 0);
    uraniumRods.setMatrixAt(index, instanceMatrix);
  });
  uraniumRods.instanceMatrix.needsUpdate = true;
  uraniumRods.castShadow = true;
  fuelGroup.add(uraniumRods);

  // Figures 7–8 show side-entry absorber mechanisms carried on guide tables.
  // The rails, legs, bearing carriage, and rod form one continuous load path.
  const supportGroup = new THREE.Group();
  supportGroup.name = "source side-entry control-rod guide tables";
  root.add(supportGroup);
  const rodGroup = new THREE.Group();
  rodGroup.name = "cadmium absorber rods supported by guide carriages";
  root.add(rodGroup);
  const controlRods: THREE.Mesh[] = [];
  const controlRodCarriages: THREE.Mesh[] = [];
  const absorberZs = [-1.6, 0, 1.6];
  const rodGeo = new THREE.CylinderGeometry(0.1, 0.1, 5.8, 16);
  rodGeo.rotateZ(Math.PI / 2);
  disposables.push(rodGeo);
  for (const z of absorberZs) {
    addBox(
      "absorber guide rail",
      [6.7, 0.14, 0.14],
      [5.55, -0.25, z],
      structuralSteelMat,
      supportGroup,
    );
    addBox(
      "absorber guide rail",
      [6.7, 0.14, 0.14],
      [5.55, -0.25, z + 0.34],
      structuralSteelMat,
      supportGroup,
    );
    for (const x of [3, 8.3]) {
      addBox(
        "guide-table leg",
        [0.18, 3.22, 0.18],
        [x, -1.89, z + 0.17],
        structuralSteelMat,
        supportGroup,
      );
      addBox(
        "guide-table foot",
        [0.65, 0.12, 0.65],
        [x, -3.34, z + 0.17],
        structuralSteelMat,
        supportGroup,
      );
    }

    const rod = new THREE.Mesh(rodGeo, cadmiumRodMat);
    rod.name = "side-entry cadmium absorber rod";
    rod.position.set(0, 0.2, z + 0.17);
    rod.castShadow = true;
    rodGroup.add(rod);
    controlRods.push(rod);

    const carriage = addBox(
      "rod-end carriage continuously seated on guide rails",
      [0.36, 0.62, 0.62],
      [2.9, 0.04, z + 0.17],
      structuralSteelMat,
      rodGroup,
    );
    controlRodCarriages.push(carriage);
  }

  // Figure 8 identifies ionization chamber 29a/32. It is seated in a cradle
  // fixed to the left-side foundation; no unsupported detector floats nearby.
  const detectorGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.4, 16);
  detectorGeo.rotateZ(Math.PI / 2);
  disposables.push(detectorGeo);
  const ionizationChamber = new THREE.Mesh(detectorGeo, detectorMat);
  ionizationChamber.name = "ionization chamber 29a and detector head 32";
  ionizationChamber.position.set(-3.95, -0.5, 0.8);
  root.add(ionizationChamber);
  addBox(
    "ionization chamber cradle",
    [1.8, 0.18, 0.7],
    [-4.15, -0.72, 0.8],
    structuralSteelMat,
    supportGroup,
  );
  addBox(
    "ionization chamber stand",
    [0.22, 2.62, 0.22],
    [-4.55, -2.02, 0.8],
    structuralSteelMat,
    supportGroup,
  );
  addBox(
    "ionization chamber stand foot",
    [0.8, 0.12, 0.8],
    [-4.55, -3.34, 0.8],
    structuralSteelMat,
    supportGroup,
  );

  const neutronCount = 300;
  const neutronGeo = new THREE.BufferGeometry();
  disposables.push(neutronGeo);
  const neutronPos = new Float32Array(neutronCount * 3);
  const neutronVel = new Float32Array(neutronCount * 3);
  const neutronColors = new Float32Array(neutronCount * 3);
  const neutronDisplayField = new Float32Array(16 * 16);
  const heatFieldFrames = heatFrames(12, 16, 2);
  const laplacianModeField = laplacianModes(17, 3);
  const glowTex = createGlowPointTexture();
  disposables.push(glowTex);

  for (let i = 0; i < neutronCount; i++) {
    const idx = i * 3;
    neutronPos[idx] = (lcg() - 0.5) * 5.4;
    neutronPos[idx + 1] = -3.0 + lcg() * 4.4;
    neutronPos[idx + 2] = (lcg() - 0.5) * 5.4;

    const theta = lcg() * Math.PI * 2;
    const phi = (lcg() - 0.5) * Math.PI;
    neutronVel[idx] = Math.cos(phi) * Math.cos(theta);
    neutronVel[idx + 1] = Math.sin(phi);
    neutronVel[idx + 2] = Math.cos(phi) * Math.sin(theta);

    neutronColors[idx] = 0.2;
    neutronColors[idx + 1] = 0.8;
    neutronColors[idx + 2] = 1.0;
  }

  neutronGeo.setAttribute("position", new THREE.BufferAttribute(neutronPos, 3));
  neutronGeo.setAttribute("color", new THREE.BufferAttribute(neutronColors, 3));

  const neutronMat = new THREE.PointsMaterial({
    size: 0.45,
    map: glowTex,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  disposables.push(neutronMat);

  const neutronPoints = new THREE.Points(neutronGeo, neutronMat);
  root.add(neutronPoints);

  const updateKinematics = (
    delta: number,
    controlRodWithdrawalPct: number,
    kEff: number,
    moderatorPurityPct: number,
    neutronDisplaySpeed: number,
    showNeutronCascade: boolean,
    rodStudioX?: number,
    fuelGlowIntensity?: number,
    isCutaway = false,
    claim1Active = true,
  ) => {
    const effRodStudioX =
      rodStudioX ?? (Math.min(100, Math.max(0, controlRodWithdrawalPct)) / 100) * 5.8;
    const effFuelGlow = fuelGlowIntensity ?? Math.max(0, (kEff - 0.98) * 8);
    updateFermiReactorKinematics(
      model,
      delta,
      controlRodWithdrawalPct,
      kEff,
      moderatorPurityPct,
      neutronDisplaySpeed,
      effRodStudioX,
      effFuelGlow,
      showNeutronCascade,
      isCutaway,
      claim1Active,
    );
  };

  const dispose = () => {
    for (const d of disposables) {
      d.dispose();
    }
    root.clear();
  };

  const model: FermiReactorModel = {
    root,
    foundation,
    enclosureGroup,
    supportGroup,
    pileGroup,
    fuelGroup,
    rodGroup,
    controlRods,
    controlRodCarriages,
    ionizationChamber,
    neutronPoints,
    neutronGeo,
    neutronPos,
    neutronVel,
    neutronColors,
    neutronDisplayField,
    heatFieldFrames,
    laplacianModeField,
    neutronCount,
    graphiteBricks,
    uraniumRods,
    graphiteMat,
    uraniumFuelMat,
    enclosureMat,
    updateKinematics,
    dispose,
  };

  return model;
}

export function updateFermiReactorKinematics(
  model: FermiReactorModel,
  delta: number,
  controlRodWithdrawalPct: number,
  kEff: number,
  moderatorPurityPct: number,
  neutronDisplaySpeed: number,
  rodStudioX: number,
  fuelGlowIntensity: number,
  showNeutronCascade: boolean,
  isCutaway = false,
  claim1Active = true,
): void {
  const withdrawal = Math.min(
    100,
    Math.max(0, Number.isFinite(controlRodWithdrawalPct) ? controlRodWithdrawalPct : 83.5),
  );
  const targetRodX = Math.min(5.8, Math.max(0, Number.isFinite(rodStudioX) ? rodStudioX : 4.843));
  for (let index = 0; index < model.controlRods.length; index++) {
    const rod = model.controlRods[index];
    const carriage = model.controlRodCarriages[index];
    if (rod) rod.position.x = targetRodX;
    // The carriage overlaps the rod's outboard end and remains seated on both
    // rails across the complete normalized travel range.
    if (carriage) carriage.position.x = targetRodX + 2.9;
  }

  const purity = Math.min(
    1,
    Math.max(0, Number.isFinite(moderatorPurityPct) ? moderatorPurityPct / 100 : 0.995),
  );
  model.graphiteMat.color.setRGB(0.12 * purity, 0.13 * purity, 0.15 * purity);
  model.fuelGroup.visible = claim1Active;
  model.uraniumFuelMat.emissiveIntensity = claim1Active ? Math.max(0, fuelGlowIntensity) : 0;
  model.uraniumFuelMat.emissive.setHex(kEff > 1.002 ? 0xf97316 : 0x22c55e);

  if (showNeutronCascade && claim1Active) {
    const heatFrame = Math.max(0, Math.min(15, Math.floor((kEff - 0.9) * 80)));
    const rodInsertion = 1 - withdrawal / 100;
    const displayField = computeFermiNormalizedDisplayField(
      kEff,
      rodInsertion,
      16,
      model.neutronDisplayField,
    );
    const speed = neutronDisplaySpeed * delta;
    const pos = model.neutronPos;
    const vel = model.neutronVel;
    for (let i = 0; i < model.neutronCount; i++) {
      const idx = i * 3;
      const u = Math.max(0, Math.min(1, 0.5 + (pos[idx] ?? 0) / 5.4));
      const v = Math.max(0, Math.min(1, 0.5 + (pos[idx + 2] ?? 0) / 5.4));
      const gx = Math.floor(u * 15);
      const gy = Math.floor(v * 15);
      const displaySample = displayField[gy * 16 + gx] ?? 0.5;
      const local =
        1 +
        Math.abs(sampleHeatAt(model.heatFieldFrames, 12, 16, heatFrame, u, v)) *
          (0.5 + 0.5 * displaySample);
      const lattice = 1 + 0.35 * laplacianModeShape(model.laplacianModeField, 17, 3, 0, i);
      pos[idx] += (vel[idx] ?? 0) * speed * 2.0 * local;
      pos[idx + 1] += (vel[idx + 1] ?? 0) * speed * 2.0 * lattice;
      pos[idx + 2] += (vel[idx + 2] ?? 0) * speed * 2.0 * local;

      if (
        Math.abs(pos[idx]) > 2.8 ||
        Math.abs(pos[idx + 2]) > 2.8 ||
        pos[idx + 1] > 1.5 ||
        pos[idx + 1] < -3.25
      ) {
        pos[idx] = ((i % 17) / 17 - 0.5) * 1.5;
        pos[idx + 1] = -2.0 + ((i % 13) / 13 - 0.5) * 1.5;
        pos[idx + 2] = ((i % 19) / 19 - 0.5) * 1.5;
      }
    }
    model.neutronGeo.attributes.position.needsUpdate = true;
    model.neutronPoints.visible = true;
  } else {
    model.neutronPoints.visible = false;
  }

  model.graphiteMat.opacity = isCutaway ? 0.35 : 1.0;
  model.graphiteMat.transparent = isCutaway;
  model.graphiteMat.depthWrite = !isCutaway;
  model.enclosureMat.opacity = isCutaway ? 0.16 : 0.72;
  model.enclosureMat.depthWrite = !isCutaway;
}
