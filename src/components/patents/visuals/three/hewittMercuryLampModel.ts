/**
 * hewittMercuryLampModel.ts
 *
 * Procedural 3D WebGL Model of Peter Cooper Hewitt's 1901
 * Mercury-Vapor Electric Discharge Arc Lamp (US Patent 682,690).
 *
 * Conforms to the Classic Patents 3D visualization doctrine:
 * - Pure procedural Three.js geometry (No GLTF/GLB asset loading)
 * - Deterministic pseudo-random seeding (Deterministic replay in frame loop)
 * - Named articulation nodes with complete deep disposal
 */

import * as THREE from "three";

export interface HewittMercuryLampModelNodes {
  root: THREE.Group;
  glassTube: THREE.Mesh;
  plasmaColumn: THREE.Mesh;
  plasmaLight: THREE.PointLight;
  cathodeSpotMesh: THREE.Mesh;
  mercuryPoolMesh: THREE.Mesh;
  condensingGlobe: THREE.Mesh;
  dropletParticles: THREE.Points;
  materials: THREE.Material[];
}

export function buildHewittMercuryLampModel(): HewittMercuryLampModelNodes {
  const root = new THREE.Group();
  const materials: THREE.Material[] = [];

  // ==========================================
  // MATERIALS
  // ==========================================
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xe2e8f0,
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.85,
    ior: 1.52,
    transparent: true,
    opacity: 0.45,
  });
  materials.push(glassMat);

  const plasmaMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    emissive: 0x22d3ee,
    emissiveIntensity: 2.2,
    roughness: 0.2,
    metalness: 0.1,
    transparent: true,
    opacity: 0.85,
  });
  materials.push(plasmaMat);

  const mercuryMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.95,
    roughness: 0.15,
  });
  materials.push(mercuryMat);

  const spotMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });
  materials.push(spotMat);

  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.85,
    roughness: 0.3,
  });
  materials.push(brassMat);

  const ironMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.7,
    roughness: 0.5,
  });
  materials.push(ironMat);

  const wallBracketMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.6,
    roughness: 0.7,
  });
  materials.push(wallBracketMat);

  // ==========================================
  // 1. MOUNTING FRAME & WALL BRACKETS
  // ==========================================
  const bracketGroup = new THREE.Group();
  root.add(bracketGroup);

  // Main mounting spine
  const spineGeo = new THREE.BoxGeometry(0.12, 0.12, 4.4);
  const spineMesh = new THREE.Mesh(spineGeo, wallBracketMat);
  spineMesh.position.set(0, 1.8, -0.4);
  bracketGroup.add(spineMesh);

  // Left & Right Wall Attachment Arms
  const arm1Geo = new THREE.CylinderGeometry(0.04, 0.04, 0.5, 12);
  const arm1 = new THREE.Mesh(arm1Geo, wallBracketMat);
  arm1.rotation.x = Math.PI / 2;
  arm1.position.set(0, 1.8, -0.65);
  bracketGroup.add(arm1);

  // Ceramic Insulators
  const insGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.16, 16);
  const ins1 = new THREE.Mesh(insGeo, brassMat);
  ins1.position.set(0, 1.8, -0.2);
  bracketGroup.add(ins1);

  // Coiled Ballast Choke on spine
  const ballastGeo = new THREE.TorusGeometry(0.2, 0.06, 12, 24);
  const ballastMesh = new THREE.Mesh(ballastGeo, brassMat);
  ballastMesh.position.set(0, 2.3, -0.4);
  bracketGroup.add(ballastMesh);

  // ==========================================
  // 2. DISCHARGE LAMP ASSEMBLY (Tilted at 15°)
  // ==========================================
  const lampGroup = new THREE.Group();
  lampGroup.position.set(0, 1.5, 0);
  lampGroup.rotation.z = -0.22; // ~12.6° tilt for gravity mercury return
  root.add(lampGroup);

  // Heavy Glass Discharge Tube (1.0m scale in WebGL: 3.2 units)
  const tubeLength = 3.2;
  const tubeRadius = 0.16;
  const tubeGeo = new THREE.CylinderGeometry(tubeRadius, tubeRadius, tubeLength, 24, 1, true);
  const glassTube = new THREE.Mesh(tubeGeo, glassMat);
  glassTube.rotation.z = Math.PI / 2;
  lampGroup.add(glassTube);

  // Internal Glowing Plasma Positive Column
  const plasmaGeo = new THREE.CylinderGeometry(
    tubeRadius * 0.75,
    tubeRadius * 0.75,
    tubeLength * 0.94,
    20,
  );
  const plasmaColumn = new THREE.Mesh(plasmaGeo, plasmaMat);
  plasmaColumn.rotation.z = Math.PI / 2;
  lampGroup.add(plasmaColumn);

  // Plasma Light Source
  const plasmaLight = new THREE.PointLight(0x22d3ee, 3.5, 8.0);
  plasmaLight.position.set(0, 0, 0);
  lampGroup.add(plasmaLight);

  // ==========================================
  // 3. LIQUID MERCURY CATHODE POOL (Left End: x = -1.6)
  // ==========================================
  const cathodeGroup = new THREE.Group();
  cathodeGroup.position.set(-1.6, 0, 0);
  lampGroup.add(cathodeGroup);

  // Liquid Mercury Pool Bulb
  const poolGeo = new THREE.SphereGeometry(0.26, 20, 16);
  const mercuryPoolMesh = new THREE.Mesh(poolGeo, mercuryMat);
  cathodeGroup.add(mercuryPoolMesh);

  // Cathode Spot Emitting Hot Pinpoint
  const spotGeo = new THREE.SphereGeometry(0.06, 12, 12);
  const cathodeSpotMesh = new THREE.Mesh(spotGeo, spotMat);
  cathodeSpotMesh.position.set(0.12, 0.1, 0);
  cathodeGroup.add(cathodeSpotMesh);

  // Brass Cathode Cap & Terminal Lug
  const cap1Geo = new THREE.CylinderGeometry(0.18, 0.18, 0.14, 16);
  const cap1 = new THREE.Mesh(cap1Geo, brassMat);
  cap1.rotation.z = Math.PI / 2;
  cap1.position.set(-0.25, 0, 0);
  cathodeGroup.add(cap1);

  // ==========================================
  // 4. IRON ANODE & CONDENSING GLOBE (Right End: x = 1.6)
  // ==========================================
  const anodeGroup = new THREE.Group();
  anodeGroup.position.set(1.6, 0, 0);
  lampGroup.add(anodeGroup);

  // Solid Iron Anode Plate
  const anodePlateGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16);
  const anodePlate = new THREE.Mesh(anodePlateGeo, ironMat);
  anodePlate.rotation.z = Math.PI / 2;
  anodePlate.position.set(-0.1, 0, 0);
  anodeGroup.add(anodePlate);

  // Bulbous Glass Condensing Chamber (8 in Fig. 1)
  const globeGeo = new THREE.SphereGeometry(0.48, 24, 20);
  const condensingGlobe = new THREE.Mesh(globeGeo, glassMat);
  condensingGlobe.position.set(0.35, 0.25, 0);
  anodeGroup.add(condensingGlobe);

  // Brass Anode Cap & Suspension Ring
  const cap2Geo = new THREE.CylinderGeometry(0.18, 0.18, 0.14, 16);
  const cap2 = new THREE.Mesh(cap2Geo, brassMat);
  cap2.rotation.z = Math.PI / 2;
  cap2.position.set(0.82, 0.25, 0);
  anodeGroup.add(cap2);

  // ==========================================
  // 5. CONDENSED MERCURY DROPLETS PARTICLES
  // ==========================================
  const dropCount = 35;
  const dropGeo = new THREE.BufferGeometry();
  const dropPositions = new Float32Array(dropCount * 3);

  for (let i = 0; i < dropCount; i++) {
    const rx = (Math.sin(i * 19.34) * 43758.5453) % 1;
    const ry = (Math.sin(i * 71.12) * 43758.5453) % 1;
    const rz = (Math.sin(i * 43.89) * 43758.5453) % 1;

    dropPositions[i * 3] = -1.4 + Math.abs(rx) * 2.8;
    dropPositions[i * 3 + 1] = -0.1 + (Math.abs(ry) - 0.5) * 0.08;
    dropPositions[i * 3 + 2] = (Math.abs(rz) - 0.5) * 0.12;
  }

  dropGeo.setAttribute("position", new THREE.BufferAttribute(dropPositions, 3));
  const dropMat = new THREE.PointsMaterial({
    color: 0xcbd5e1,
    size: 0.04,
    transparent: true,
    opacity: 0.9,
  });
  materials.push(dropMat);

  const dropletParticles = new THREE.Points(dropGeo, dropMat);
  lampGroup.add(dropletParticles);

  return {
    root,
    glassTube,
    plasmaColumn,
    plasmaLight,
    cathodeSpotMesh,
    mercuryPoolMesh,
    condensingGlobe,
    dropletParticles,
    materials,
  };
}

export function articulateHewittMercuryLampModel(
  nodes: HewittMercuryLampModelNodes,
  telemetry: {
    arcCurrentAmperes: number;
    luminousEfficacyLmPerWatt: number;
    mercuryVaporPressureMmHg: number;
    arcOperatingVoltageV: number;
  },
  timeSec: number,
) {
  // 1. Plasma Column Emissive Glow & Pulse
  const pMat = nodes.plasmaColumn.material as THREE.MeshStandardMaterial;
  const currentRatio = Math.max(0.2, Math.min(2.0, telemetry.arcCurrentAmperes / 3.5));
  const flicker = 1.0 + Math.sin(timeSec * 30) * 0.04;

  if (pMat) {
    pMat.emissiveIntensity = 1.8 * currentRatio * flicker;
  }
  nodes.plasmaLight.intensity = 3.5 * currentRatio * flicker;

  // 2. Mobile Cathode Spot Motion
  const spotX = 0.12 + Math.sin(timeSec * 8) * 0.06;
  const spotY = 0.1 + Math.cos(timeSec * 11) * 0.04;
  nodes.cathodeSpotMesh.position.set(spotX, spotY, 0);

  // 3. Trickling Mercury Droplets along bottom wall toward cathode
  const posAttr = nodes.dropletParticles.geometry.getAttribute("position") as THREE.BufferAttribute;
  const posArr = posAttr.array as Float32Array;
  const count = posArr.length / 3;

  for (let i = 0; i < count; i++) {
    // Flow leftward toward cathode (-1.5)
    posArr[i * 3] -= 0.015;
    if (posArr[i * 3] < -1.5) {
      posArr[i * 3] = 1.5;
    }
  }
  posAttr.needsUpdate = true;
}
