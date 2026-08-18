/**
 * pasteurFermentationModel.ts
 *
 * Museum-Grade Procedural 3D Model for Louis Pasteur's 1873 Pure-Yeast Fermentation & Brewing Apparatus
 * (US Patent 135,245 - "Improvement in the Manufacture of Beer and Yeast").
 *
 * Reconstructs the apparatus that eliminated spoilage microbes and established germ theory in industrial brewing:
 * 1. Cast-iron tripod base support stand.
 * 2. Closed tinned copper cylindrical fermentation vat with hemispherical dome lid (Claim 1).
 * 3. Brass goose-neck airlock tube with sterile cotton microbial filter bulb (Claim 2).
 * 4. Helical cold-water cooling coil jacket around the vat.
 * 5. Glass level sight tube and brass sampling cock.
 * 6. Ascending CO2 effervescence bubble particles tracking yeast kinetics.
 */

import * as THREE from "three";
import { createLcg } from "@/utils/lcg";
import { createGlowPointTexture } from "./ThreeStudioScene";

const lcg = createLcg(2000);

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
}

export interface PasteurFermentationMaterials {
  tinnedCopper: THREE.MeshStandardMaterial;
  brassPipes: THREE.MeshStandardMaterial;
  castIron: THREE.MeshStandardMaterial;
  glass: THREE.MeshStandardMaterial;
  cotton: THREE.MeshStandardMaterial;
  bubbleMat: THREE.PointsMaterial;
}

export interface PasteurFermentationModelResult {
  rootGroup: THREE.Group;
  nodes: PasteurFermentationModelNodes;
  materials: PasteurFermentationMaterials;
  dispose: () => void;
}

const BUBBLE_COUNT = 60;

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

  const bubbleGlowTex = createGlowPointTexture();
  texturesToDispose.push(bubbleGlowTex);

  // Materials
  const materials: PasteurFermentationMaterials = {
    tinnedCopper: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xc8963e,
        roughness: 0.22,
        metalness: 0.92,
      }),
    ),
    brassPipes: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.2,
        metalness: 0.9,
      }),
    ),
    castIron: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.5,
        metalness: 0.85,
      }),
    ),
    glass: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.45,
      }),
    ),
    cotton: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.9,
      }),
    ),
    bubbleMat: trackMat(
      new THREE.PointsMaterial({
        size: 0.22,
        map: bubbleGlowTex,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        color: 0xfef08a,
        depthWrite: false,
      }),
    ),
  };

  // 1. Cast-Iron Tripod Support Stand
  const tripod = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(2.2, 2.6, 1.2, 16)),
    materials.castIron,
  );
  tripod.position.y = -2.2;
  tripod.receiveShadow = true;
  tripod.castShadow = true;
  rootGroup.add(tripod);

  // 2. Closed Tinned Copper Fermentation Vat (Claim 1)
  const vatGroup = new THREE.Group();
  rootGroup.add(vatGroup);

  const tank = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(2.1, 2.1, 3.8, 36)),
    materials.tinnedCopper,
  );
  tank.position.y = 0.2;
  tank.castShadow = true;
  vatGroup.add(tank);

  const domeLid = new THREE.Mesh(
    trackGeo(new THREE.SphereGeometry(2.1, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2)),
    materials.tinnedCopper,
  );
  domeLid.position.y = 2.1;
  domeLid.castShadow = true;
  vatGroup.add(domeLid);

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

  const samplingCock = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.12, 0.12, 0.6, 12)),
    materials.brassPipes,
  );
  samplingCock.rotation.z = Math.PI / 2;
  samplingCock.position.set(0, -1.2, 2.2);
  samplingCock.castShadow = true;
  vatGroup.add(samplingCock);

  // 6. Fermentation CO2 Gas Bubbles
  const bubbleGeo = trackGeo(new THREE.BufferGeometry());
  const bubblePositions = new Float32Array(BUBBLE_COUNT * 3);
  for (let i = 0; i < BUBBLE_COUNT; i++) {
    const idx = i * 3;
    const r = lcg() * 1.8;
    const a = lcg() * Math.PI * 2;
    bubblePositions[idx] = Math.cos(a) * r;
    bubblePositions[idx + 1] = -1.4 + lcg() * 3.2;
    bubblePositions[idx + 2] = Math.sin(a) * r;
  }
  bubbleGeo.setAttribute("position", new THREE.BufferAttribute(bubblePositions, 3));
  const bubblePoints = new THREE.Points(bubbleGeo, materials.bubbleMat);
  vatGroup.add(bubblePoints);

  const nodes: PasteurFermentationModelNodes = {
    rootGroup,
    tripod,
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
  const activity = Math.max(0, yeastActivityPct / 100);
  const rise = 0.15 + activity * 1.4;
  const pos = nodes.bubblePositions;

  for (let i = 0; i < nodes.bubbleCount; i++) {
    const idx = i * 3;
    pos[idx + 1] += rise * dt;
    if (pos[idx + 1] > 2.0) {
      pos[idx + 1] = -1.4;
    }
  }
  nodes.bubblePoints.geometry.attributes.position.needsUpdate = true;

  nodes.bubblePoints.visible = showBubbles && activity > 0.12;
  materials.bubbleMat.opacity = 0.2 + activity * 0.75;
  materials.bubbleMat.color.setHex(fermentationTempC > 28 ? 0xf87171 : 0xfef08a);

  // Cutaway Mode
  materials.tinnedCopper.opacity = isCutaway ? 0.35 : 1.0;
  materials.tinnedCopper.transparent = isCutaway;
}
