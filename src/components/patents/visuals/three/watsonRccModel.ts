import * as THREE from "three";
import type { WatsonRccControls, WatsonRccTelemetry } from "@/physics/watsonRccKernel";

export interface WatsonRccModel {
  root: THREE.Group;
  basePlate: THREE.Mesh;
  intermediatePlate: THREE.Group;
  toolPlate: THREE.Group;
  pegMesh: THREE.Mesh;
  bellowsMesh: THREE.Mesh;
  remoteCenterMarker: THREE.Mesh;
  focalRaysGroup: THREE.Group;
  holeBlockGroup: THREE.Group;
  parallelRods: THREE.Mesh[];
  focalRods: THREE.Mesh[];
  dispose: () => void;
}

export function buildWatsonRccModel(): WatsonRccModel {
  const root = new THREE.Group();
  root.name = "watson-rcc-root";

  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const materialsToDispose: THREE.Material[] = [];

  // Materials
  const steelMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.8,
    roughness: 0.25,
  });
  materialsToDispose.push(steelMat);

  const darkPlateMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.85,
    roughness: 0.3,
  });
  materialsToDispose.push(darkPlateMat);

  const brassFlexureMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.75,
    roughness: 0.35,
  });
  materialsToDispose.push(brassFlexureMat);

  const cyanMarkerMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    emissive: 0x0891b2,
    emissiveIntensity: 0.6,
    roughness: 0.2,
  });
  materialsToDispose.push(cyanMarkerMat);

  const blockMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.4,
    roughness: 0.6,
    transparent: true,
    opacity: 0.75,
  });
  materialsToDispose.push(blockMat);

  // 1. Base Mounting Plate (54)
  const baseGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.015, 32);
  geometriesToDispose.push(baseGeom);
  const basePlate = new THREE.Mesh(baseGeom, darkPlateMat);
  basePlate.position.set(0, 0.35, 0);
  root.add(basePlate);

  // 2. Parallel Flexures Group (Stage 1)
  const parallelRods: THREE.Mesh[] = [];
  const parallelRodGeom = new THREE.CylinderGeometry(0.003, 0.003, 0.08, 16);
  geometriesToDispose.push(parallelRodGeom);

  const intermediatePlate = new THREE.Group();
  intermediatePlate.position.set(0, 0.27, 0);
  root.add(intermediatePlate);

  for (let i = 0; i < 3; i++) {
    const angle = (i * 2 * Math.PI) / 3;
    const px = 0.055 * Math.cos(angle);
    const pz = 0.055 * Math.sin(angle);

    const rod = new THREE.Mesh(parallelRodGeom, brassFlexureMat);
    rod.position.set(px, 0.31, pz);
    root.add(rod);
    parallelRods.push(rod);
  }

  // 3. Intermediate Annular Ring (22)
  const intRingGeom = new THREE.CylinderGeometry(0.075, 0.075, 0.012, 32);
  geometriesToDispose.push(intRingGeom);
  const intRingMesh = new THREE.Mesh(intRingGeom, darkPlateMat);
  intermediatePlate.add(intRingMesh);

  // 4. Tool Plate & Focal Flexures (Stage 2)
  const toolPlate = new THREE.Group();
  toolPlate.position.set(0, 0.19, 0);
  root.add(toolPlate);

  const focalRods: THREE.Mesh[] = [];
  const focalRodGeom = new THREE.CylinderGeometry(0.003, 0.003, 0.08, 16);
  geometriesToDispose.push(focalRodGeom);

  for (let i = 0; i < 3; i++) {
    const angle = (i * 2 * Math.PI) / 3 + Math.PI / 6;
    const px = 0.05 * Math.cos(angle);
    const pz = 0.05 * Math.sin(angle);

    const rod = new THREE.Mesh(focalRodGeom, brassFlexureMat);
    rod.position.set(px, 0.23, pz);
    // Angle inward toward focal apex
    rod.rotation.z = -0.15 * Math.cos(angle);
    rod.rotation.x = 0.15 * Math.sin(angle);
    root.add(rod);
    focalRods.push(rod);
  }

  // Lower tool plate mesh
  const toolPlateGeom = new THREE.CylinderGeometry(0.065, 0.065, 0.015, 32);
  geometriesToDispose.push(toolPlateGeom);
  const toolPlateMesh = new THREE.Mesh(toolPlateGeom, darkPlateMat);
  toolPlate.add(toolPlateMesh);

  // 5. Peg / Workpiece Mesh (16)
  const pegGeom = new THREE.CylinderGeometry(0.012, 0.012, 0.15, 32);
  geometriesToDispose.push(pegGeom);
  const pegMesh = new THREE.Mesh(pegGeom, steelMat);
  pegMesh.position.set(0, -0.075, 0);
  toolPlate.add(pegMesh);

  // Chamfered tip
  const tipGeom = new THREE.ConeGeometry(0.012, 0.008, 32);
  geometriesToDispose.push(tipGeom);
  const tipMesh = new THREE.Mesh(tipGeom, steelMat);
  tipMesh.rotation.x = Math.PI;
  tipMesh.position.set(0, -0.154, 0);
  toolPlate.add(tipMesh);

  // 6. Torsional Bellows Mesh
  const bellowsGeom = new THREE.CylinderGeometry(0.025, 0.025, 0.16, 24, 12);
  geometriesToDispose.push(bellowsGeom);
  const bellowsMesh = new THREE.Mesh(
    bellowsGeom,
    new THREE.MeshStandardMaterial({
      color: 0x64748b,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    }),
  );
  bellowsMesh.position.set(0, 0.27, 0);
  root.add(bellowsMesh);

  // 7. Remote Center Marker
  const markerGeom = new THREE.SphereGeometry(0.006, 16, 16);
  geometriesToDispose.push(markerGeom);
  const remoteCenterMarker = new THREE.Mesh(markerGeom, cyanMarkerMat);
  remoteCenterMarker.position.set(0, 0.04, 0);
  root.add(remoteCenterMarker);

  // 8. Focal Ray Lines
  const focalRaysGroup = new THREE.Group();
  root.add(focalRaysGroup);

  // 9. Chamfered Hole Block
  const holeBlockGroup = new THREE.Group();
  holeBlockGroup.position.set(0, -0.02, 0);

  const blockGeom = new THREE.BoxGeometry(0.16, 0.08, 0.16);
  geometriesToDispose.push(blockGeom);
  const blockMesh = new THREE.Mesh(blockGeom, blockMat);
  holeBlockGroup.add(blockMesh);

  root.add(holeBlockGroup);

  return {
    root,
    basePlate,
    intermediatePlate,
    toolPlate,
    pegMesh,
    bellowsMesh,
    remoteCenterMarker,
    focalRaysGroup,
    holeBlockGroup,
    parallelRods,
    focalRods,
    dispose: () => {
      for (const m of materialsToDispose) {
        m.dispose();
      }
      for (const g of geometriesToDispose) {
        g.dispose();
      }
    },
  };
}

export function updateWatsonRccKinematics(
  model: WatsonRccModel,
  controls: WatsonRccControls,
  tel: WatsonRccTelemetry,
) {
  // Lateral displacement (in meters for 3D studio)
  const latShiftM = (tel.tipLateralDisplacementMm / 1000) * 1.5;
  const tiltRad = (tel.pegTiltAngleDeg * Math.PI) / 180;

  // 1. Intermediate plate translates laterally with parallel flexure bending
  model.intermediatePlate.position.x = latShiftM;

  // 2. Tool plate translates laterally AND tilts about remote center
  model.toolPlate.position.x = latShiftM;
  model.toolPlate.rotation.z = -tiltRad;

  // 3. Remote center marker position
  model.remoteCenterMarker.position.x = latShiftM;
  model.remoteCenterMarker.position.y = 0.19 - controls.pegLengthM;

  // 4. Bellows visibility
  model.bellowsMesh.visible = controls.bellowsEngaged;
  model.bellowsMesh.position.x = latShiftM * 0.5;

  // 5. Marker color reflects jamming index
  const markerMat = model.remoteCenterMarker.material as THREE.MeshStandardMaterial;
  if (tel.refusal.refused || tel.jammingIndex >= 1.0) {
    markerMat.color.setHex(0xef4444); // Red
    markerMat.emissive.setHex(0xb91c1c);
  } else if (tel.insertionState === "compliant_correction") {
    markerMat.color.setHex(0x06b6d4); // Cyan
    markerMat.emissive.setHex(0x0891b2);
  } else {
    markerMat.color.setHex(0x10b981); // Emerald
    markerMat.emissive.setHex(0x047857);
  }
}
