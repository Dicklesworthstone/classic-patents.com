import * as THREE from "three";
import { createLcg } from "@/utils/lcg";
import { createGlowPointTexture } from "./ThreeStudioScene";

export interface EinsteinRefrigeratorModel {
  rootGroup: THREE.Group;
  fridgeGroup: THREE.Group;
  generatorMesh: THREE.Mesh;
  heaterMesh: THREE.Mesh;
  condenserGroup: THREE.Group;
  evaporatorMesh: THREE.Mesh;
  absorberMesh: THREE.Mesh;
  economizerMesh: THREE.Mesh;
  fluidPoints: THREE.Points;
  fluidPositions: Float32Array;
  fluidCount: number;
  materials: {
    weldedSteel: THREE.MeshStandardMaterial;
    hotGenerator: THREE.MeshStandardMaterial;
    heaterGlow: THREE.MeshStandardMaterial;
    coldEvaporator: THREE.MeshStandardMaterial;
    condenserFins: THREE.MeshStandardMaterial;
    absorberMat: THREE.MeshStandardMaterial;
    fluidMat: THREE.PointsMaterial;
  };
  dispose: () => void;
}

export function buildEinsteinRefrigeratorModel(): EinsteinRefrigeratorModel {
  const lcg = createLcg(1930);
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  // --- 1. AUTHENTIC PBR MATERIALS ---
  const weldedSteel = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.2,
    metalness: 0.9,
  });
  materialsToDispose.push(weldedSteel);

  const hotGenerator = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    roughness: 0.25,
    metalness: 0.8,
    emissive: 0xd97706,
    emissiveIntensity: 0.6,
  });
  materialsToDispose.push(hotGenerator);

  const heaterGlow = new THREE.MeshStandardMaterial({
    color: 0xff3b30,
    emissive: 0xff5500,
    emissiveIntensity: 0.9,
    roughness: 0.3,
  });
  materialsToDispose.push(heaterGlow);

  const coldEvaporator = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.12,
    metalness: 0.85,
    emissive: 0x0284c7,
    emissiveIntensity: 0.45,
  });
  materialsToDispose.push(coldEvaporator);

  const condenserFins = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.32,
    metalness: 0.85,
  });
  materialsToDispose.push(condenserFins);

  const absorberMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.3,
    metalness: 0.88,
  });
  materialsToDispose.push(absorberMat);

  // --- 2. HERMETIC VESSEL HIERARCHY ---
  const fridgeGroup = new THREE.Group();
  rootGroup.add(fridgeGroup);

  // A. Boiler Generator (Bottom Right: drives ammonia vapor out of water)
  const genGeo = new THREE.CylinderGeometry(0.95, 0.95, 3.6, 24);
  geometriesToDispose.push(genGeo);
  const generatorMesh = new THREE.Mesh(genGeo, hotGenerator);
  generatorMesh.position.set(3.4, -1.2, 0);
  generatorMesh.castShadow = true;
  fridgeGroup.add(generatorMesh);

  // Gas Burner / Electrical Heating Well
  const heaterGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.85, 24);
  geometriesToDispose.push(heaterGeo);
  const heaterMesh = new THREE.Mesh(heaterGeo, heaterGlow);
  heaterMesh.position.set(3.4, -2.7, 0);
  heaterMesh.castShadow = true;
  fridgeGroup.add(heaterMesh);

  // Bubble-Pump Percolator Lift Riser
  const riserGeo = new THREE.CylinderGeometry(0.14, 0.14, 4.4, 16);
  geometriesToDispose.push(riserGeo);
  const riser = new THREE.Mesh(riserGeo, condenserFins);
  riser.position.set(3.4, 1.5, 0);
  fridgeGroup.add(riser);

  // B. Air-Cooled Serpentine Condenser Coil (Top Right)
  const condenserGroup = new THREE.Group();
  condenserGroup.position.set(2.2, 2.8, 0);
  fridgeGroup.add(condenserGroup);

  const condenserPts: THREE.Vector3[] = [];
  for (let c = 0; c < 5; c++) {
    const y = (c - 2) * 0.42;
    const xLeft = -1.2;
    const xRight = 1.2;
    condenserPts.push(new THREE.Vector3(c % 2 === 0 ? xLeft : xRight, y, 0));
    condenserPts.push(new THREE.Vector3(c % 2 === 0 ? xRight : xLeft, y, 0));
  }
  const condenserCurve = new THREE.CatmullRomCurve3(condenserPts);
  const condenserGeo = new THREE.TubeGeometry(condenserCurve, 64, 0.1, 8, false);
  geometriesToDispose.push(condenserGeo);
  const condenserMesh = new THREE.Mesh(condenserGeo, condenserFins);
  condenserMesh.castShadow = true;
  condenserGroup.add(condenserMesh);

  // Radial / Vertical Cooling Fins
  for (let f = 0; f < 8; f++) {
    const finGeo = new THREE.BoxGeometry(0.04, 2.3, 0.85);
    geometriesToDispose.push(finGeo);
    const fin = new THREE.Mesh(finGeo, condenserFins);
    fin.position.set(-1.0 + f * 0.28, 0, 0);
    condenserGroup.add(fin);
  }

  // C. Evaporator Freezing Chamber (Top Left)
  const evapGeo = new THREE.BoxGeometry(3.8, 2.8, 2.8);
  geometriesToDispose.push(evapGeo);
  const evaporatorMesh = new THREE.Mesh(evapGeo, coldEvaporator);
  evaporatorMesh.position.set(-2.8, 1.8, 0);
  evaporatorMesh.castShadow = true;
  fridgeGroup.add(evaporatorMesh);

  // Internal Cooling Shelves
  for (let s = 0; s < 3; s++) {
    const shelfGeo = new THREE.BoxGeometry(3.4, 0.05, 2.4);
    geometriesToDispose.push(shelfGeo);
    const shelf = new THREE.Mesh(shelfGeo, weldedSteel);
    shelf.position.set(-2.8, 0.8 + s * 0.75, 0);
    fridgeGroup.add(shelf);
  }

  // D. Absorber Column with Heat Radiating Rings (Bottom Left)
  const absGeo = new THREE.CylinderGeometry(0.9, 0.9, 3.6, 24);
  geometriesToDispose.push(absGeo);
  const absorberMesh = new THREE.Mesh(absGeo, absorberMat);
  absorberMesh.position.set(-2.8, -1.4, 0);
  absorberMesh.castShadow = true;
  fridgeGroup.add(absorberMesh);

  // Absorber External Cooling Fins / Rings
  for (let a = 0; a < 6; a++) {
    const ringGeo = new THREE.TorusGeometry(0.96, 0.05, 8, 24);
    geometriesToDispose.push(ringGeo);
    const ring = new THREE.Mesh(ringGeo, weldedSteel);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(-2.8, -2.7 + a * 0.52, 0);
    fridgeGroup.add(ring);
  }

  // E. Jacketed Liquid Economizer (Heat Exchanger Loop)
  const econCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(3.4, -0.4, 0),
    new THREE.Vector3(1.2, -0.8, 0.4),
    new THREE.Vector3(-1.0, -1.2, 0.4),
    new THREE.Vector3(-2.8, -0.6, 0),
  ]);
  const econGeo = new THREE.TubeGeometry(econCurve, 36, 0.15, 8, false);
  geometriesToDispose.push(econGeo);
  const economizerMesh = new THREE.Mesh(econGeo, weldedSteel);
  economizerMesh.castShadow = true;
  fridgeGroup.add(economizerMesh);

  // Return Gas Conduit
  const gasReturnCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.8, 0.4, 0),
    new THREE.Vector3(0, 0.2, -0.5),
    new THREE.Vector3(2.4, 1.2, -0.5),
    new THREE.Vector3(3.4, 0.8, 0),
  ]);
  const gasReturnGeo = new THREE.TubeGeometry(gasReturnCurve, 36, 0.1, 8, false);
  geometriesToDispose.push(gasReturnGeo);
  const gasReturn = new THREE.Mesh(gasReturnGeo, weldedSteel);
  fridgeGroup.add(gasReturn);

  // --- 3. CONVECTION THERMOSIPHON PARTICLES ---
  const fluidCount = 140;
  const fluidGeo = new THREE.BufferGeometry();
  geometriesToDispose.push(fluidGeo);
  const fluidPositions = new Float32Array(fluidCount * 3);
  const fluidColors = new Float32Array(fluidCount * 3);

  const glowTex = createGlowPointTexture();
  texturesToDispose.push(glowTex);

  for (let i = 0; i < fluidCount; i++) {
    const idx = i * 3;
    fluidPositions[idx] = (lcg() - 0.5) * 6.2;
    fluidPositions[idx + 1] = (lcg() - 0.5) * 4.6;
    fluidPositions[idx + 2] = (lcg() - 0.5) * 0.5;

    const progressX = (fluidPositions[idx] + 3.1) / 6.2;
    fluidColors[idx] = progressX;
    fluidColors[idx + 1] = 0.5 + (1 - progressX) * 0.4;
    fluidColors[idx + 2] = 1.0 - progressX * 0.8;
  }

  fluidGeo.setAttribute("position", new THREE.BufferAttribute(fluidPositions, 3));
  fluidGeo.setAttribute("color", new THREE.BufferAttribute(fluidColors, 3));

  const fluidMat = new THREE.PointsMaterial({
    size: 0.38,
    map: glowTex,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  materialsToDispose.push(fluidMat);

  const fluidPoints = new THREE.Points(fluidGeo, fluidMat);
  fridgeGroup.add(fluidPoints);

  const dispose = () => {
    for (const geo of geometriesToDispose) geo.dispose();
    for (const mat of materialsToDispose) mat.dispose();
    for (const tex of texturesToDispose) tex.dispose();
  };

  return {
    rootGroup,
    fridgeGroup,
    generatorMesh,
    heaterMesh,
    condenserGroup,
    evaporatorMesh,
    absorberMesh,
    economizerMesh,
    fluidPoints,
    fluidPositions,
    fluidCount,
    materials: {
      weldedSteel,
      hotGenerator,
      heaterGlow,
      coldEvaporator,
      condenserFins,
      absorberMat,
      fluidMat,
    },
    dispose,
  };
}

/**
 * Updates Einstein-Szilard single-pressure absorption refrigerator convection circulation, heating glow, and cutaway.
 */
export function updateEinsteinRefrigeratorKinematics(
  model: EinsteinRefrigeratorModel,
  delta: number,
  fluidDisplaySpeed: number,
  heaterGlowIntensity: number,
  generatorGlowIntensity: number,
  isHeating: boolean,
  isCutaway = false,
): void {
  // Convection thermosiphon circulation
  const pos = model.fluidPositions;
  const speed = fluidDisplaySpeed * delta;
  for (let i = 0; i < model.fluidCount; i++) {
    const idx = i * 3;
    pos[idx + 1] += (i % 2 === 0 ? 1 : -1) * speed;
    if (pos[idx + 1] > 2.8) pos[idx + 1] = -2.8;
    if (pos[idx + 1] < -2.8) pos[idx + 1] = 2.8;
  }
  model.fluidPoints.geometry.attributes.position.needsUpdate = true;

  // Heater & Generator Glow
  model.materials.heaterGlow.emissiveIntensity = isHeating ? heaterGlowIntensity : 0.1;
  model.materials.hotGenerator.emissiveIntensity = isHeating ? generatorGlowIntensity : 0.1;

  // Cutaway transparency
  model.materials.weldedSteel.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.weldedSteel.transparent = isCutaway;
  model.materials.absorberMat.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.absorberMat.transparent = isCutaway;
}
