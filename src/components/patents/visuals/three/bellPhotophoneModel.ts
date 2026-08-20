import * as THREE from "three";
import type { BellPhotophoneState } from "@/physics/bellPhotophoneKernel";

export interface BellPhotophoneModelNodes {
  group: THREE.Group;
  transmitterGroup: THREE.Group;
  receiverGroup: THREE.Group;
  beamMesh: THREE.Mesh;
  diaphragmMesh: THREE.Mesh;
  seleniumCellGroup: THREE.Group;
  telephoneGroup: THREE.Group;
  materials: THREE.Material[];
  geometries: THREE.BufferGeometry[];
  update: (state: BellPhotophoneState, timeSec: number) => void;
  dispose: () => void;
}

export function createBellPhotophoneModel(): BellPhotophoneModelNodes {
  const group = new THREE.Group();
  const materials: THREE.Material[] = [];
  const geometries: THREE.BufferGeometry[] = [];

  // PBR Materials
  const polishedBrassMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.85,
    roughness: 0.2,
  });
  materials.push(polishedBrassMat);

  const silverMirrorMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    metalness: 0.95,
    roughness: 0.05,
  });
  materials.push(silverMirrorMat);

  const glassLensMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    transmission: 0.85,
    opacity: 0.6,
    transparent: true,
    roughness: 0.1,
    ior: 1.52,
  });
  materials.push(glassLensMat);

  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
    transparent: true,
    opacity: 0.55,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  materials.push(beamMat);

  const seleniumGreenMat = new THREE.MeshStandardMaterial({
    color: 0x059669,
    metalness: 0.4,
    roughness: 0.4,
  });
  materials.push(seleniumGreenMat);

  const mahoganyWoodMat = new THREE.MeshStandardMaterial({
    color: 0x581c87, // Dark velvet / mahogany base
    metalness: 0.1,
    roughness: 0.6,
  });
  materials.push(mahoganyWoodMat);

  // 1. TRANSMITTER STATION GROUP (Mounted at X = -5.0)
  const transmitterGroup = new THREE.Group();
  transmitterGroup.position.set(-5.0, 0, 0);

  // Stand base
  const baseGeo = new THREE.CylinderGeometry(0.8, 0.9, 0.2, 32);
  geometries.push(baseGeo);
  const baseMesh = new THREE.Mesh(baseGeo, mahoganyWoodMat);
  baseMesh.position.y = -2.0;
  transmitterGroup.add(baseMesh);

  // Vertical brass support pillar
  const pillarGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.8, 16);
  geometries.push(pillarGeo);
  const pillarMesh = new THREE.Mesh(pillarGeo, polishedBrassMat);
  pillarMesh.position.y = 0;
  transmitterGroup.add(pillarMesh);

  // Heliostat mirror
  const helioGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.06, 32);
  helioGeo.rotateX(Math.PI / 4);
  geometries.push(helioGeo);
  const helioMesh = new THREE.Mesh(helioGeo, silverMirrorMat);
  helioMesh.position.set(-0.8, 1.2, 0);
  transmitterGroup.add(helioMesh);

  // Primary Condenser Lens (b)
  const lensGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.08, 24);
  lensGeo.rotateZ(Math.PI / 2);
  geometries.push(lensGeo);
  const lensMesh = new THREE.Mesh(lensGeo, glassLensMat);
  lensMesh.position.set(-0.2, 1.2, 0);
  transmitterGroup.add(lensMesh);

  // Speaking tube and voice diaphragm (c)
  const mouthGeo = new THREE.ConeGeometry(0.4, 0.8, 24, 1, true);
  mouthGeo.rotateZ(-Math.PI / 2);
  geometries.push(mouthGeo);
  const mouthMesh = new THREE.Mesh(mouthGeo, polishedBrassMat);
  mouthMesh.position.set(0.6, 1.2, 0);
  transmitterGroup.add(mouthMesh);

  // Flexible mirror diaphragm disc
  const diaGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.02, 32);
  diaGeo.rotateZ(Math.PI / 2);
  geometries.push(diaGeo);
  const diaphragmMesh = new THREE.Mesh(diaGeo, silverMirrorMat);
  diaphragmMesh.position.set(0.6, 1.2, 0);
  transmitterGroup.add(diaphragmMesh);

  // Collimating Projection Lens (d)
  const projGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.08, 24);
  projGeo.rotateZ(Math.PI / 2);
  geometries.push(projGeo);
  const projMesh = new THREE.Mesh(projGeo, glassLensMat);
  projMesh.position.set(1.2, 1.2, 0);
  transmitterGroup.add(projMesh);

  group.add(transmitterGroup);

  // 2. RECEIVING STATION GROUP (Mounted at X = 5.0)
  const receiverGroup = new THREE.Group();
  receiverGroup.position.set(5.0, 0, 0);

  // Receiver stand
  const recvBaseGeo = new THREE.CylinderGeometry(0.9, 1.0, 0.2, 32);
  geometries.push(recvBaseGeo);
  const recvBaseMesh = new THREE.Mesh(recvBaseGeo, mahoganyWoodMat);
  recvBaseMesh.position.y = -2.0;
  receiverGroup.add(recvBaseMesh);

  const recvPillarGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.8, 16);
  geometries.push(recvPillarGeo);
  const recvPillarMesh = new THREE.Mesh(recvPillarGeo, polishedBrassMat);
  recvPillarMesh.position.y = 0;
  receiverGroup.add(recvPillarMesh);

  // Large Parabolic Reflector Collector Dish (C)
  // Approximated by an open hemisphere / revolved paraboloid
  const dishGeo = new THREE.SphereGeometry(1.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.2);
  dishGeo.rotateZ(Math.PI / 2);
  geometries.push(dishGeo);
  const dishMesh = new THREE.Mesh(dishGeo, silverMirrorMat);
  dishMesh.position.set(0.5, 1.2, 0);
  receiverGroup.add(dishMesh);

  // Tripod supports holding axial selenium cell
  const legGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.4, 8);
  geometries.push(legGeo);
  for (let i = 0; i < 3; i++) {
    const angle = (i * 2 * Math.PI) / 3;
    const legMesh = new THREE.Mesh(legGeo, polishedBrassMat);
    legMesh.position.set(-0.2, 1.2 + 0.4 * Math.sin(angle), 0.4 * Math.cos(angle));
    legMesh.rotateZ(-Math.PI / 5);
    receiverGroup.add(legMesh);
  }

  // Cylindrical Multi-Disc Selenium Photocell (S)
  const seleniumCellGroup = new THREE.Group();
  seleniumCellGroup.position.set(-0.7, 1.2, 0);

  // Stack of brass disks and selenium seams
  const numDisks = 14;
  for (let d = 0; d < numDisks; d++) {
    const dx = -0.3 + (d * 0.6) / numDisks;
    const diskGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.02, 24);
    diskGeo.rotateZ(Math.PI / 2);
    geometries.push(diskGeo);
    const diskMesh = new THREE.Mesh(diskGeo, polishedBrassMat);
    diskMesh.position.x = dx;
    seleniumCellGroup.add(diskMesh);

    // Selenium seam
    const seamGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.02, 24);
    seamGeo.rotateZ(Math.PI / 2);
    geometries.push(seamGeo);
    const seamMesh = new THREE.Mesh(seamGeo, seleniumGreenMat);
    seamMesh.position.x = dx + 0.02;
    seleniumCellGroup.add(seamMesh);
  }
  receiverGroup.add(seleniumCellGroup);

  // Telephone Receiver Earpiece
  const telephoneGroup = new THREE.Group();
  telephoneGroup.position.set(0.8, 0.2, 0);
  const phoneHandleGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.8, 16);
  geometries.push(phoneHandleGeo);
  const phoneHandleMesh = new THREE.Mesh(phoneHandleGeo, mahoganyWoodMat);
  telephoneGroup.add(phoneHandleMesh);

  const phoneEarGeo = new THREE.CylinderGeometry(0.22, 0.1, 0.25, 24);
  geometries.push(phoneEarGeo);
  const phoneEarMesh = new THREE.Mesh(phoneEarGeo, polishedBrassMat);
  phoneEarMesh.position.y = 0.45;
  telephoneGroup.add(phoneEarMesh);

  receiverGroup.add(telephoneGroup);

  group.add(receiverGroup);

  // 3. GOLDEN MODULATED LIGHT BEAM (Connecting X = -3.8 to X = 4.3)
  const beamGeo = new THREE.CylinderGeometry(1.4, 0.5, 8.1, 32, 1, true);
  beamGeo.rotateZ(Math.PI / 2);
  geometries.push(beamGeo);
  const beamMesh = new THREE.Mesh(beamGeo, beamMat);
  beamMesh.position.set(0.25, 1.2, 0);
  group.add(beamMesh);

  // Update loop
  const update = (state: BellPhotophoneState, timeSec: number) => {
    // Dynamic beam divergence and pulsation
    const audioFreq = 12.0; // Visual oscillation speed
    const pulsation = 1 + Math.sin(timeSec * audioFreq) * state.modulationDepth * 0.35;
    beamMesh.scale.set(1.0, pulsation, pulsation);
    beamMat.opacity = 0.4 + state.modulationDepth * 0.3 * Math.abs(Math.sin(timeSec * audioFreq));

    // Diaphragm flexure
    const flexAmount =
      (state.diaphragmDisplacementUm / 25.0) * 0.08 * Math.sin(timeSec * audioFreq);
    diaphragmMesh.scale.set(1.0 + flexAmount * 2, 1.0, 1.0);

    // Selenium glowing response to concentrated flux
    const glowLevel = Math.min(1.0, state.concentratedPowerMw / 30.0);
    seleniumGreenMat.emissive = new THREE.Color(0x10b981).multiplyScalar(glowLevel * 0.5);
  };

  const dispose = () => {
    for (const g of geometries) {
      g.dispose();
    }
    for (const m of materials) {
      m.dispose();
    }
  };

  return {
    group,
    transmitterGroup,
    receiverGroup,
    beamMesh,
    diaphragmMesh,
    seleniumCellGroup,
    telephoneGroup,
    materials,
    geometries,
    update,
    dispose,
  };
}
