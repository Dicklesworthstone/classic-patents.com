/**
 * carlsonElectrophotographyModel.ts
 *
 * Procedural 3D WebGL Model of Chester Carlson's 1942
 * Electrophotography & Xerography Rotary Drum Copier (US Patent 2,297,691).
 *
 * Conforms strictly to the Classic Patents Three.js visualization doctrine:
 * - Pure procedural Three.js geometry (No GLTF/GLB models)
 * - Deterministic pseudo-random seeding (Deterministic replay in frame loop)
 * - Named articulation nodes with complete deep disposal
 */

import * as THREE from "three";

export interface CarlsonElectrophotographyModelNodes {
  root: THREE.Group;
  drumGroup: THREE.Group;
  seleniumDrumMesh: THREE.Mesh;
  aluminumCoreMesh: THREE.Mesh;
  coronaAssembly: THREE.Group;
  coronaWireMesh: THREE.Mesh;
  coronaGlowLight: THREE.PointLight;
  exposureUnit: THREE.Group;
  developerUnit: THREE.Group;
  tonerParticles: THREE.Points;
  paperWebMesh: THREE.Mesh;
  fuserUpperRoll: THREE.Mesh;
  fuserLowerRoll: THREE.Mesh;
  fuserHeatLight: THREE.PointLight;
  materials: THREE.Material[];
}

export function buildCarlsonElectrophotographyModel(): CarlsonElectrophotographyModelNodes {
  const root = new THREE.Group();
  const materials: THREE.Material[] = [];

  // ==========================================
  // MATERIALS
  // ==========================================
  const seleniumMat = new THREE.MeshPhysicalMaterial({
    color: 0x4338ca,
    emissive: 0x312e81,
    emissiveIntensity: 0.3,
    roughness: 0.15,
    metalness: 0.85,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
  });
  materials.push(seleniumMat);

  const aluminumMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.9,
    roughness: 0.3,
  });
  materials.push(aluminumMat);

  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.5,
    roughness: 0.7,
  });
  materials.push(chassisMat);

  const coronaMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xf59e0b,
    emissiveIntensity: 1.5,
    metalness: 0.9,
    roughness: 0.2,
  });
  materials.push(coronaMat);

  const opticMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    emissive: 0x0369a1,
    emissiveIntensity: 0.8,
    metalness: 0.6,
    roughness: 0.3,
  });
  materials.push(opticMat);

  const developerMat = new THREE.MeshStandardMaterial({
    color: 0x1e1b4b,
    metalness: 0.4,
    roughness: 0.6,
  });
  materials.push(developerMat);

  const paperMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.9,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });
  materials.push(paperMat);

  const fuserHotMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xdc2626,
    emissiveIntensity: 1.2,
    roughness: 0.3,
    metalness: 0.7,
  });
  materials.push(fuserHotMat);

  const fuserPressMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.5,
    metalness: 0.8,
  });
  materials.push(fuserPressMat);

  // ==========================================
  // 1. BASE CHASSIS & MOUNTING FRAME
  // ==========================================
  const frameGeo = new THREE.BoxGeometry(4.2, 0.25, 2.6);
  const frameMesh = new THREE.Mesh(frameGeo, chassisMat);
  frameMesh.position.y = -1.35;
  root.add(frameMesh);

  // Side bearing uprights
  const uprightGeo = new THREE.BoxGeometry(0.2, 2.2, 0.4);
  const uprightLeft = new THREE.Mesh(uprightGeo, chassisMat);
  uprightLeft.position.set(-0.2, 0, 1.1);
  root.add(uprightLeft);

  const uprightRight = new THREE.Mesh(uprightGeo, chassisMat);
  uprightRight.position.set(-0.2, 0, -1.1);
  root.add(uprightRight);

  // ==========================================
  // 2. ROTARY AMORPHOUS SELENIUM PHOTORECEPTOR DRUM
  // ==========================================
  const drumGroup = new THREE.Group();
  drumGroup.position.set(-0.2, 0.1, 0);
  root.add(drumGroup);

  // Selenium Outer Cylinder Layer
  const drumGeo = new THREE.CylinderGeometry(0.9, 0.9, 2.0, 36, 1, true);
  const seleniumDrumMesh = new THREE.Mesh(drumGeo, seleniumMat);
  seleniumDrumMesh.rotation.x = Math.PI / 2;
  drumGroup.add(seleniumDrumMesh);

  // Aluminum Inner Core & End Flanges
  const coreGeo = new THREE.CylinderGeometry(0.75, 0.75, 2.04, 32);
  const aluminumCoreMesh = new THREE.Mesh(coreGeo, aluminumMat);
  aluminumCoreMesh.rotation.x = Math.PI / 2;
  drumGroup.add(aluminumCoreMesh);

  // Central Shaft
  const shaftGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.5, 16);
  const shaftMesh = new THREE.Mesh(shaftGeo, aluminumMat);
  shaftMesh.rotation.x = Math.PI / 2;
  drumGroup.add(shaftMesh);

  // ==========================================
  // 3. CORONA CHARGING ASSEMBLY (Station 1: Top-Left)
  // ==========================================
  const coronaAssembly = new THREE.Group();
  coronaAssembly.position.set(-0.95, 0.85, 0);
  root.add(coronaAssembly);

  const shieldGeo = new THREE.BoxGeometry(0.3, 0.2, 1.9);
  const shieldMesh = new THREE.Mesh(shieldGeo, aluminumMat);
  coronaAssembly.add(shieldMesh);

  const wireGeo = new THREE.CylinderGeometry(0.012, 0.012, 1.85, 8);
  const coronaWireMesh = new THREE.Mesh(wireGeo, coronaMat);
  coronaWireMesh.rotation.x = Math.PI / 2;
  coronaWireMesh.position.x = 0.08;
  coronaAssembly.add(coronaWireMesh);

  const coronaGlowLight = new THREE.PointLight(0xf59e0b, 1.8, 3.0);
  coronaGlowLight.position.set(0.1, 0, 0);
  coronaAssembly.add(coronaGlowLight);

  // ==========================================
  // 4. OPTICAL SLIT EXPOSURE UNIT (Station 2: Top)
  // ==========================================
  const exposureUnit = new THREE.Group();
  exposureUnit.position.set(-0.2, 1.25, 0);
  root.add(exposureUnit);

  const opticBoxGeo = new THREE.BoxGeometry(0.6, 0.35, 1.9);
  const opticBox = new THREE.Mesh(opticBoxGeo, opticMat);
  exposureUnit.add(opticBox);

  // Slit lens aperture
  const lensGeo = new THREE.BoxGeometry(0.1, 0.05, 1.7);
  const lensMesh = new THREE.Mesh(lensGeo, coronaMat);
  lensMesh.position.y = -0.18;
  exposureUnit.add(lensMesh);

  // ==========================================
  // 5. TRIBOELECTRIC TONER DEVELOPER UNIT (Station 3: Right)
  // ==========================================
  const developerUnit = new THREE.Group();
  developerUnit.position.set(0.95, 0.3, 0);
  root.add(developerUnit);

  const devHousGeo = new THREE.BoxGeometry(0.7, 0.8, 1.9);
  const devHousing = new THREE.Mesh(devHousGeo, developerMat);
  developerUnit.add(devHousing);

  // Magnetic developer roller
  const devRollGeo = new THREE.CylinderGeometry(0.25, 0.25, 1.8, 24);
  const devRoll = new THREE.Mesh(devRollGeo, aluminumMat);
  devRoll.rotation.x = Math.PI / 2;
  devRoll.position.x = -0.3;
  developerUnit.add(devRoll);

  // Toner Powder Cloud Particles
  const particleCount = 80;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const rx = (Math.sin(i * 12.34) * 43758.5453) % 1;
    const ry = (Math.sin(i * 56.78) * 43758.5453) % 1;
    const rz = (Math.sin(i * 90.12) * 43758.5453) % 1;

    particlePositions[i * 3] = 0.55 + Math.abs(rx) * 0.3;
    particlePositions[i * 3 + 1] = 0.1 + (Math.abs(ry) - 0.5) * 0.4;
    particlePositions[i * 3 + 2] = (Math.abs(rz) - 0.5) * 1.6;
  }

  particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  const tonerParticleMat = new THREE.PointsMaterial({
    color: 0xc084fc,
    size: 0.04,
    transparent: true,
    opacity: 0.85,
  });
  materials.push(tonerParticleMat);

  const tonerParticles = new THREE.Points(particleGeo, tonerParticleMat);
  root.add(tonerParticles);

  // ==========================================
  // 6. CLEANING BLADE & RESIDUAL TONER COLLECTOR SUMP (Station 6: Left-Bottom)
  // ==========================================
  const cleanerGroup = new THREE.Group();
  cleanerGroup.position.set(-1.0, -0.4, 0);

  const sumpGeo = new THREE.BoxGeometry(0.5, 0.4, 1.9);
  const sumpMesh = new THREE.Mesh(sumpGeo, chassisMat);
  cleanerGroup.add(sumpMesh);

  // Polyurethane wiper blade
  const bladeGeo = new THREE.BoxGeometry(0.18, 0.04, 1.85);
  const bladeMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.4,
    metalness: 0.2,
  });
  materials.push(bladeMat);
  const bladeMesh = new THREE.Mesh(bladeGeo, bladeMat);
  bladeMesh.rotation.z = -Math.PI / 4;
  bladeMesh.position.set(0.2, 0.15, 0);
  cleanerGroup.add(bladeMesh);

  root.add(cleanerGroup);

  // ==========================================
  // 7. GLASS DOCUMENT PLATEN & SCANNER CARRIAGE
  // ==========================================
  const platenGroup = new THREE.Group();
  platenGroup.position.set(-0.2, 1.6, 0);

  const platenGlassGeo = new THREE.BoxGeometry(2.4, 0.05, 1.8);
  const platenGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0xe2e8f0,
    transmission: 0.9,
    roughness: 0.05,
    transparent: true,
    opacity: 0.7,
  });
  materials.push(platenGlassMat);
  const platenMesh = new THREE.Mesh(platenGlassGeo, platenGlassMat);
  platenGroup.add(platenMesh);

  // Document paper sheet on platen
  const docGeo = new THREE.PlaneGeometry(1.8, 1.3);
  const docMesh = new THREE.Mesh(docGeo, paperMat);
  docMesh.rotation.x = -Math.PI / 2;
  docMesh.position.set(0, 0.03, 0);
  platenGroup.add(docMesh);

  root.add(platenGroup);

  // ==========================================
  // 8. PAPER TRANSFER & THERMAL FUSER ROLLERS (Station 4 & 5)
  // ==========================================
  // Continuous Paper Web
  const paperGeo = new THREE.PlaneGeometry(3.6, 1.6);
  const paperWebMesh = new THREE.Mesh(paperGeo, paperMat);
  paperWebMesh.rotation.x = -Math.PI / 2;
  paperWebMesh.position.set(0.6, -0.85, 0);
  root.add(paperWebMesh);

  // Transfer roller under drum
  const transRollGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.8, 20);
  const transRoll = new THREE.Mesh(transRollGeo, aluminumMat);
  transRoll.rotation.x = Math.PI / 2;
  transRoll.position.set(-0.2, -1.05, 0);
  root.add(transRoll);

  // Upper Hot Fuser Roll
  const fuserGeo = new THREE.CylinderGeometry(0.22, 0.22, 1.8, 24);
  const fuserUpperRoll = new THREE.Mesh(fuserGeo, fuserHotMat);
  fuserUpperRoll.rotation.x = Math.PI / 2;
  fuserUpperRoll.position.set(1.7, -0.63, 0);
  root.add(fuserUpperRoll);

  // Lower Pressure Roll
  const fuserLowerRoll = new THREE.Mesh(fuserGeo, fuserPressMat);
  fuserLowerRoll.rotation.x = Math.PI / 2;
  fuserLowerRoll.position.set(1.7, -1.07, 0);
  root.add(fuserLowerRoll);

  const fuserHeatLight = new THREE.PointLight(0xef4444, 2.0, 3.5);
  fuserHeatLight.position.set(1.7, -0.63, 0);
  root.add(fuserHeatLight);

  return {
    root,
    drumGroup,
    seleniumDrumMesh,
    aluminumCoreMesh,
    coronaAssembly,
    coronaWireMesh,
    coronaGlowLight,
    exposureUnit,
    developerUnit,
    tonerParticles,
    paperWebMesh,
    fuserUpperRoll,
    fuserLowerRoll,
    fuserHeatLight,
    materials,
  };
}

export function articulateCarlsonElectrophotographyModel(
  nodes: CarlsonElectrophotographyModelNodes,
  telemetry: {
    coronaVoltageKv: number;
    contrastPotentialV: number;
    opticalDensity: number;
    fuserTemperatureC: number;
    drumDisplayOmegaRadPerS: number;
    fuserDisplayOmegaRadPerS: number;
  },
  timeSec: number,
) {
  // 1. Drum / fuser rotation from kernel ω (selenium 45 cpm → 0.8 / 1.6 rad/s)
  nodes.drumGroup.rotation.z = timeSec * telemetry.drumDisplayOmegaRadPerS;
  nodes.fuserUpperRoll.rotation.z = -timeSec * telemetry.fuserDisplayOmegaRadPerS;
  nodes.fuserLowerRoll.rotation.z = timeSec * telemetry.fuserDisplayOmegaRadPerS;

  // 2. Corona ionization intensity
  const cMat = nodes.coronaWireMesh.material as THREE.MeshStandardMaterial;
  const coronaRatio = Math.max(0.2, Math.min(1.8, telemetry.coronaVoltageKv / 6.5));
  if (cMat) {
    cMat.emissiveIntensity = 1.2 * coronaRatio;
  }
  nodes.coronaGlowLight.intensity = 1.8 * coronaRatio;

  // 3. Fuser temperature glow
  const fMat = nodes.fuserUpperRoll.material as THREE.MeshStandardMaterial;
  const fuserRatio = Math.max(0.2, Math.min(1.8, (telemetry.fuserTemperatureC - 100) / 85));
  if (fMat) {
    fMat.emissiveIntensity = 1.0 * fuserRatio;
  }
  nodes.fuserHeatLight.intensity = 2.0 * fuserRatio;

  // 4. Toner particle stream agitation
  const posAttr = nodes.tonerParticles.geometry.getAttribute("position") as THREE.BufferAttribute;
  const posArr = posAttr.array as Float32Array;
  const count = posArr.length / 3;

  for (let i = 0; i < count; i++) {
    posArr[i * 3 + 1] -= 0.008;
    if (posArr[i * 3 + 1] < -0.2) {
      posArr[i * 3 + 1] = 0.4;
    }
  }
  posAttr.needsUpdate = true;
}
