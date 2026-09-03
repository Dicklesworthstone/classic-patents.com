/**
 * deForestAudionModel.ts
 *
 * Procedural 3D WebGL Model of Lee de Forest's 1908
 * Audion Triode Vacuum Tube (US Patent 879,532).
 *
 * Conforms strictly to the Classic Patents Three.js visualization doctrine:
 * - Pure procedural Three.js geometry (No GLTF/GLB models)
 * - Deterministic pseudo-random seeding (Deterministic replay in frame loop)
 * - Named articulation nodes with complete deep disposal
 */

import * as THREE from "three";

export interface DeForestAudionModelNodes {
  root: THREE.Group;
  glassBulb: THREE.Mesh;
  glassBulbRim: THREE.Mesh;
  filamentMesh: THREE.Mesh;
  filamentLight: THREE.PointLight;
  gridMesh: THREE.Mesh;
  plateMesh: THREE.Mesh;
  getterMirror: THREE.Mesh;
  pinchSeal: THREE.Mesh;
  potentialRings: THREE.Group;
  externalLeads: THREE.Group;
  electronParticles: THREE.Points;
  materials: THREE.Material[];
  setCutaway?: (cutaway: boolean) => void;
}

export function buildDeForestAudionModel(): DeForestAudionModelNodes {
  const root = new THREE.Group();
  const materials: THREE.Material[] = [];

  // ==========================================
  // MATERIALS
  // ==========================================
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xf8fafc,
    metalness: 0.05,
    roughness: 0.1,
    transmission: 0.9,
    ior: 1.52,
    transparent: true,
    // Depth writing from a transparent shell can hide the very electrodes the
    // cutaway is meant to teach. Keep the envelope present but visually quiet.
    opacity: 0.18,
    depthWrite: false,
  });
  materials.push(glassMat);

  // A cutaway cannot reduce the sealed envelope to invisibility: visitors need
  // to see that the filament, grid, and plate sit inside one evacuated bulb.
  // This is a museum contour for the glass shell, not an additional patent part.
  const glassRimMat = new THREE.MeshBasicMaterial({
    color: 0xdbeafe,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
  });
  materials.push(glassRimMat);

  const getterMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    metalness: 0.95,
    roughness: 0.1,
    transparent: true,
    opacity: 0.36,
    side: THREE.BackSide,
    depthWrite: false,
  });
  materials.push(getterMat);

  const filamentMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xf59e0b,
    emissiveIntensity: 3.0,
    roughness: 0.2,
    metalness: 0.8,
  });
  materials.push(filamentMat);

  const gridMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.9,
    roughness: 0.2,
  });
  materials.push(gridMat);

  const plateMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.8,
    roughness: 0.35,
  });
  materials.push(plateMat);

  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.85,
    roughness: 0.3,
  });
  materials.push(brassMat);

  const copperMat = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    metalness: 0.9,
    roughness: 0.25,
  });
  materials.push(copperMat);

  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.4,
    roughness: 0.8,
  });
  materials.push(baseMat);

  const potentialRingMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.3,
    wireframe: true,
  });
  materials.push(potentialRingMat);

  // ==========================================
  // 1. BASEBOARD & BRASS CANDELABRA BASE
  // ==========================================
  const baseGroup = new THREE.Group();
  root.add(baseGroup);

  // Hardwood mounting block with binding posts
  const blockGeo = new THREE.BoxGeometry(2.0, 0.3, 2.0);
  const blockMesh = new THREE.Mesh(blockGeo, baseMat);
  blockMesh.position.y = -1.65;
  baseGroup.add(blockMesh);

  // Brass Binding Post Terminals (Filament, Grid, Plate)
  for (let b = 0; b < 3; b++) {
    const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.25, 12);
    const postMesh = new THREE.Mesh(postGeo, brassMat);
    postMesh.position.set(-0.6 + b * 0.6, -1.4, 0.8);
    baseGroup.add(postMesh);
  }

  // Threaded brass screw shell
  const socketGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.7, 24);
  const socketMesh = new THREE.Mesh(socketGeo, brassMat);
  socketMesh.position.y = -1.15;
  baseGroup.add(socketMesh);

  // Ceramic Stem Flange
  const stemFlangeGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.4, 20);
  const stemFlange = new THREE.Mesh(stemFlangeGeo, glassMat);
  stemFlange.position.y = -0.65;
  baseGroup.add(stemFlange);

  // Glass Pinch Seal Mount
  const pinchGeo = new THREE.BoxGeometry(0.4, 0.3, 0.15);
  const pinchSeal = new THREE.Mesh(pinchGeo, glassMat);
  pinchSeal.position.y = -0.3;
  baseGroup.add(pinchSeal);

  // ==========================================
  // 2. EVACUATED GLASS BULB ENVELOPE
  // ==========================================
  const bulbGroup = new THREE.Group();
  bulbGroup.position.set(0, 0.2, 0);
  root.add(bulbGroup);

  // Spherical Glass Envelope
  const bulbGeo = new THREE.SphereGeometry(1.2, 32, 24);
  const glassBulb = new THREE.Mesh(bulbGeo, glassMat);
  bulbGroup.add(glassBulb);

  // The front-facing contour is deliberately thin: it preserves a readable
  // sealed-bulb silhouette without drawing across the electrode teaching view.
  const glassBulbRim = new THREE.Mesh(new THREE.TorusGeometry(1.205, 0.018, 8, 64), glassRimMat);
  glassBulbRim.name = "Museum contour of sealed evacuated glass bulb";
  bulbGroup.add(glassBulbRim);

  // Metallic Silver Getter Mirror Deposit on top inner dome
  const getterGeo = new THREE.SphereGeometry(1.18, 24, 16, 0, Math.PI * 2, 0, Math.PI / 4);
  const getterMirror = new THREE.Mesh(getterGeo, getterMat);
  getterMirror.position.y = 0.02;
  bulbGroup.add(getterMirror);

  // Top Exhaust Glass Tip (Fire-sealed vacuum evacuation pip)
  const tipGeo = new THREE.ConeGeometry(0.12, 0.3, 12);
  const tipMesh = new THREE.Mesh(tipGeo, glassMat);
  tipMesh.position.y = 1.32;
  bulbGroup.add(tipMesh);

  // ==========================================
  // 3. HEATED FILAMENT CATHODE (x = -0.35)
  // ==========================================
  const filGroup = new THREE.Group();
  filGroup.position.set(-0.35, 0, 0);
  bulbGroup.add(filGroup);

  // Hairpin Filament Loop (Tantalum/Carbon wire)
  const filGeo = new THREE.TorusGeometry(0.22, 0.025, 12, 24, Math.PI);
  const filamentMesh = new THREE.Mesh(filGeo, filamentMat);
  filamentMesh.rotation.z = Math.PI;
  filamentMesh.position.y = 0.2;
  filGroup.add(filamentMesh);

  // Lead Support Wires
  const lead1Geo = new THREE.CylinderGeometry(0.02, 0.02, 0.7, 8);
  const lead1 = new THREE.Mesh(lead1Geo, gridMat);
  lead1.position.set(-0.22, -0.15, 0);
  filGroup.add(lead1);

  const lead2 = new THREE.Mesh(lead1Geo, gridMat);
  lead2.position.set(0.22, -0.15, 0);
  filGroup.add(lead2);

  // Filament Light
  const filamentLight = new THREE.PointLight(0xf59e0b, 3.0, 5.0);
  filamentLight.position.set(0, 0.2, 0);
  filGroup.add(filamentLight);

  // ==========================================
  // 4. INTERPOSED CONTROL GRID (x = 0.0)
  // ==========================================
  const gridGroup = new THREE.Group();
  gridGroup.position.set(0, 0, 0);
  bulbGroup.add(gridGroup);

  // Zigzag Grid Wire Loop
  const gridWireGeo = new THREE.TorusGeometry(0.35, 0.02, 12, 24, Math.PI);
  const gridMesh = new THREE.Mesh(gridWireGeo, gridMat);
  gridMesh.rotation.z = Math.PI;
  gridMesh.position.y = 0.25;
  gridGroup.add(gridMesh);

  // Grid Cross Bars
  for (let gy = -0.1; gy <= 0.4; gy += 0.12) {
    const barGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.5, 8);
    const bar = new THREE.Mesh(barGeo, gridMat);
    bar.rotation.z = Math.PI / 2;
    bar.position.set(0, gy, 0);
    gridGroup.add(bar);
  }

  // Grid Support Post
  const gridPostGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.8, 8);
  const gridPost = new THREE.Mesh(gridPostGeo, gridMat);
  gridPost.position.set(0, -0.2, -0.1);
  gridGroup.add(gridPost);

  // ==========================================
  // 5. SOLID NICKEL COLLECTOR PLATE ANODE (x = 0.4)
  // ==========================================
  const plateGroup = new THREE.Group();
  plateGroup.position.set(0.4, 0.15, 0);
  bulbGroup.add(plateGroup);

  // Flat Nickel Plate
  const plateGeo = new THREE.BoxGeometry(0.04, 0.75, 0.65);
  const plateMesh = new THREE.Mesh(plateGeo, plateMat);
  plateGroup.add(plateMesh);

  // Plate Support Post
  const platePostGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.7, 8);
  const platePost = new THREE.Mesh(platePostGeo, plateMat);
  platePost.position.set(0, -0.5, 0);
  plateGroup.add(platePost);

  // ==========================================
  // 6. ELECTROSTATIC POTENTIAL FIELD RINGS
  // ==========================================
  const potentialRings = new THREE.Group();
  for (let r = 0; r < 3; r++) {
    const ringGeo = new THREE.TorusGeometry(0.45 + r * 0.15, 0.01, 8, 24);
    ringGeo.rotateY(Math.PI / 2);
    const ringMesh = new THREE.Mesh(ringGeo, potentialRingMat);
    ringMesh.position.set(-0.1 + r * 0.25, 0.15, 0);
    potentialRings.add(ringMesh);
  }
  bulbGroup.add(potentialRings);

  // ==========================================
  // 7. EXTERNAL COPPER LEADS TO BINDING POSTS
  // ==========================================
  const externalLeads = new THREE.Group();
  for (let c = 0; c < 3; c++) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.2 + c * 0.2, -0.4, 0),
      new THREE.Vector3(-0.4 + c * 0.4, -0.9, 0.4),
      new THREE.Vector3(-0.6 + c * 0.6, -1.3, 0.8),
    ]);
    const leadTube = new THREE.TubeGeometry(curve, 16, 0.015, 6, false);
    externalLeads.add(new THREE.Mesh(leadTube, copperMat));
  }
  baseGroup.add(externalLeads);

  // ==========================================
  // 8. ANIMATED THERMIONIC ELECTRON PARTICLES
  // ==========================================
  const particleCount = 80;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const rx = (Math.sin(i * 13.54) * 43758.5453) % 1;
    const ry = (Math.sin(i * 61.12) * 43758.5453) % 1;
    const rz = (Math.sin(i * 37.89) * 43758.5453) % 1;

    particlePositions[i * 3] = -0.35 + Math.abs(rx) * 0.75;
    particlePositions[i * 3 + 1] = 0.15 + (Math.abs(ry) - 0.5) * 0.45;
    particlePositions[i * 3 + 2] = (Math.abs(rz) - 0.5) * 0.35;
  }

  particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.04,
    transparent: true,
    opacity: 0.85,
  });
  materials.push(particleMat);

  const electronParticles = new THREE.Points(particleGeo, particleMat);
  bulbGroup.add(electronParticles);

  const setCutaway = (cutaway: boolean) => {
    glassMat.opacity = cutaway ? 0.1 : 0.18;
    glassMat.needsUpdate = true;
    glassRimMat.opacity = cutaway ? 0.52 : 0.28;
    glassRimMat.needsUpdate = true;
    getterMat.opacity = cutaway ? 0.08 : 0.36;
    getterMat.needsUpdate = true;
  };

  return {
    root,
    glassBulb,
    glassBulbRim,
    filamentMesh,
    filamentLight,
    gridMesh,
    plateMesh,
    getterMirror,
    pinchSeal,
    potentialRings,
    externalLeads,
    electronParticles,
    materials,
    setCutaway,
  };
}

export function articulateDeForestAudionModel(
  nodes: DeForestAudionModelNodes,
  telemetry: {
    filamentTemperatureK: number;
    plateCurrentMa: number;
    voltageGain: number;
    isConducting: boolean;
    electronStreamAdvancePerFrame: number;
  },
  _timeSec: number,
) {
  // 1. Filament Heat Glow
  const fMat = nodes.filamentMesh.material as THREE.MeshStandardMaterial;
  const tempRatio = Math.max(0.4, Math.min(1.8, telemetry.filamentTemperatureK / 2200));

  if (fMat) {
    fMat.emissiveIntensity = 2.5 * tempRatio;
  }
  nodes.filamentLight.intensity = 2.8 * tempRatio;

  // 2. Electron Particle Stream Flow & Density
  const posAttr = nodes.electronParticles.geometry.getAttribute(
    "position",
  ) as THREE.BufferAttribute;
  const posArr = posAttr.array as Float32Array;
  const count = posArr.length / 3;

  const speed = telemetry.electronStreamAdvancePerFrame;

  for (let i = 0; i < count; i++) {
    posArr[i * 3] += speed;
    if (posArr[i * 3] > 0.4) {
      posArr[i * 3] = -0.35;
    }
  }
  posAttr.needsUpdate = true;

  const currentScale = Math.min(1.0, Math.max(0.0, telemetry.plateCurrentMa / 10.0));
  const pMat = nodes.electronParticles.material as THREE.PointsMaterial;
  if (pMat) {
    pMat.opacity = telemetry.isConducting ? Math.min(0.9, 0.2 + currentScale * 0.7) : 0.05;
  }
}
