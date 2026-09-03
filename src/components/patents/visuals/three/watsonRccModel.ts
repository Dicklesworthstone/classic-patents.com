import * as THREE from "three";
import {
  WATSON_RCC_DEFAULT_CONTROLS,
  type WatsonRccControls,
  type WatsonRccTelemetry,
} from "@/physics/watsonRccKernel";

export interface WatsonRccModel {
  root: THREE.Group;
  basePlate: THREE.Mesh;
  intermediatePlate: THREE.Group;
  remoteCenterPivot: THREE.Group;
  toolPlate: THREE.Group;
  pegMesh: THREE.Mesh;
  pegTipMesh: THREE.Mesh;
  pegTipAnchor: THREE.Object3D;
  bellowsMesh: THREE.Mesh;
  remoteCenterMarker: THREE.Mesh;
  focalRaysGroup: THREE.Group;
  holeBlockGroup: THREE.Group;
  parallelRods: THREE.Mesh[];
  focalRods: THREE.Mesh[];
  dispose: () => void;
}

const TOOL_PLATE_CENTER_Y_M = 0.19;
const TOOL_PLATE_THICKNESS_M = 0.015;
const PEG_TIP_HEIGHT_M = 0.008;

function pointInRoot(
  root: THREE.Object3D,
  owner: THREE.Object3D,
  localPoint: THREE.Vector3,
): THREE.Vector3 {
  return root.worldToLocal(owner.localToWorld(localPoint.clone()));
}

function setBetween(mesh: THREE.Mesh, start: THREE.Vector3, end: THREE.Vector3) {
  const direction = end.clone().sub(start);
  const length = direction.length();
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.scale.set(1, length, 1);
  if (length > 1e-9) {
    mesh.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.multiplyScalar(1 / length),
    );
  }
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
  const parallelRodGeom = new THREE.CylinderGeometry(0.003, 0.003, 1, 16);
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
    rod.scale.y = 0.08;
    rod.userData.baseAnchor = new THREE.Vector3(px, -0.0075, pz);
    rod.userData.intermediateAnchor = new THREE.Vector3(px, 0.006, pz);
    root.add(rod);
    parallelRods.push(rod);
  }

  // 3. Intermediate Annular Ring (22)
  const intRingGeom = new THREE.CylinderGeometry(0.075, 0.075, 0.012, 32);
  geometriesToDispose.push(intRingGeom);
  const intRingMesh = new THREE.Mesh(intRingGeom, darkPlateMat);
  intermediatePlate.add(intRingMesh);

  // 4. Tool Plate & Focal Flexures (Stage 2)
  // The moving tool assembly is parented to its effective compliance center.
  // updateWatsonRccKinematics moves this pivot to the kernel-derived remote
  // center, then offsets the plate by L_rcc before applying angular compliance.
  // That hierarchy makes rotation about the cyan marker a real transform,
  // rather than a label drawn near an independently rotating plate.
  const remoteCenterPivot = new THREE.Group();
  remoteCenterPivot.name = "Kernel-derived remote-center pivot";
  remoteCenterPivot.position.set(0, 0.04, 0);
  root.add(remoteCenterPivot);

  const toolPlate = new THREE.Group();
  toolPlate.name = "Tool plate rotating about remote center";
  toolPlate.position.set(0, 0.15, 0);
  remoteCenterPivot.add(toolPlate);

  const focalRods: THREE.Mesh[] = [];
  const focalRodGeom = new THREE.CylinderGeometry(0.003, 0.003, 1, 16);
  geometriesToDispose.push(focalRodGeom);

  for (let i = 0; i < 3; i++) {
    const angle = (i * 2 * Math.PI) / 3 + Math.PI / 6;
    const px = 0.05 * Math.cos(angle);
    const pz = 0.05 * Math.sin(angle);

    const rod = new THREE.Mesh(focalRodGeom, brassFlexureMat);
    rod.position.set(px, 0.23, pz);
    rod.scale.y = 0.08;
    // Angle inward toward focal apex
    rod.rotation.z = -0.15 * Math.cos(angle);
    rod.rotation.x = 0.15 * Math.sin(angle);
    rod.userData.intermediateAnchor = new THREE.Vector3(px, -0.006, pz);
    rod.userData.toolAnchor = new THREE.Vector3(px * 0.75, 0.0075, pz * 0.75);
    root.add(rod);
    focalRods.push(rod);
  }

  // Lower tool plate mesh
  const toolPlateGeom = new THREE.CylinderGeometry(0.065, 0.065, 0.015, 32);
  geometriesToDispose.push(toolPlateGeom);
  const toolPlateMesh = new THREE.Mesh(toolPlateGeom, darkPlateMat);
  toolPlate.add(toolPlateMesh);

  // 5. Peg / Workpiece Mesh (16)
  const pegGeom = new THREE.CylinderGeometry(0.012, 0.012, 1, 32);
  geometriesToDispose.push(pegGeom);
  const pegMesh = new THREE.Mesh(pegGeom, steelMat);
  pegMesh.name = "Variable-length insertion peg shaft";
  const initialShaftLengthM =
    WATSON_RCC_DEFAULT_CONTROLS.pegLengthM - TOOL_PLATE_THICKNESS_M / 2 - PEG_TIP_HEIGHT_M;
  pegMesh.scale.y = initialShaftLengthM;
  pegMesh.position.y = -(TOOL_PLATE_THICKNESS_M / 2 + initialShaftLengthM / 2);
  toolPlate.add(pegMesh);

  // Chamfered tip
  const tipGeom = new THREE.ConeGeometry(0.012, 0.008, 32);
  geometriesToDispose.push(tipGeom);
  const pegTipMesh = new THREE.Mesh(tipGeom, steelMat);
  pegTipMesh.name = "Insertion peg chamfered tip";
  pegTipMesh.rotation.x = Math.PI;
  pegTipMesh.position.y = -WATSON_RCC_DEFAULT_CONTROLS.pegLengthM + PEG_TIP_HEIGHT_M / 2;
  toolPlate.add(pegTipMesh);

  const pegTipAnchor = new THREE.Object3D();
  pegTipAnchor.name = "Insertion peg physical tip anchor";
  pegTipAnchor.position.y = -WATSON_RCC_DEFAULT_CONTROLS.pegLengthM;
  toolPlate.add(pegTipAnchor);

  // 6. Torsional Bellows Mesh
  const bellowsGeom = new THREE.CylinderGeometry(0.025, 0.025, 1, 24, 12);
  geometriesToDispose.push(bellowsGeom);
  const bellowsMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    wireframe: true,
    transparent: true,
    opacity: 0.4,
  });
  materialsToDispose.push(bellowsMat);
  const bellowsMesh = new THREE.Mesh(bellowsGeom, bellowsMat);
  bellowsMesh.position.set(0, 0.27, 0);
  bellowsMesh.scale.y = 0.16;
  bellowsMesh.userData.baseAnchor = new THREE.Vector3(0, -0.0075, 0);
  bellowsMesh.userData.toolAnchor = new THREE.Vector3(0, 0.0075, 0);
  root.add(bellowsMesh);

  // 7. Remote Center Marker
  const markerGeom = new THREE.SphereGeometry(0.006, 16, 16);
  geometriesToDispose.push(markerGeom);
  const remoteCenterMarker = new THREE.Mesh(markerGeom, cyanMarkerMat);
  remoteCenterMarker.name = "Remote-center pivot marker";
  remoteCenterPivot.add(remoteCenterMarker);

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
    remoteCenterPivot,
    toolPlate,
    pegMesh,
    pegTipMesh,
    pegTipAnchor,
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
  // Kernel telemetry is already SI-derived. Keep its physical displacement
  // one-to-one in the exhibit rather than applying a hidden display gain.
  const tipLateralDisplacementM = tel.tipLateralDisplacementMm / 1000;
  const tiltRad = (tel.pegTiltAngleDeg * Math.PI) / 180;
  const remoteCenterDistanceM = tel.remoteCenterDistanceM;

  // Resize the physical peg to the selected mounting-plate-to-tip length.
  // The cylinder starts at the underside of the plate and terminates at the
  // cone base; the cone apex and explicit tip anchor coincide at pegLengthM.
  const plateHalfHeightM = TOOL_PLATE_THICKNESS_M / 2;
  const shaftLengthM = Math.max(0.001, controls.pegLengthM - plateHalfHeightM - PEG_TIP_HEIGHT_M);
  model.pegMesh.scale.y = shaftLengthM;
  model.pegMesh.position.y = -(plateHalfHeightM + shaftLengthM / 2);
  model.pegTipMesh.position.y = -controls.pegLengthM + PEG_TIP_HEIGHT_M / 2;
  model.pegTipAnchor.position.set(0, -controls.pegLengthM, 0);

  // 1. Intermediate plate translates laterally with parallel flexure bending
  model.intermediatePlate.position.x = tipLateralDisplacementM;

  // 2. Place the effective remote center, offset the tool plate by L_rcc,
  // and rotate the whole assembly around that center. When L_rcc differs from
  // the peg length (uncompensated/tension comparisons), solve pivot X so the
  // rendered peg tip still equals the kernel's reported tip displacement.
  const tipOffsetFromPivotY = remoteCenterDistanceM - controls.pegLengthM;
  const rotatedTipOffsetX = Math.sin(tiltRad) * tipOffsetFromPivotY;
  model.remoteCenterPivot.position.set(
    tipLateralDisplacementM - rotatedTipOffsetX,
    TOOL_PLATE_CENTER_Y_M - remoteCenterDistanceM,
    0,
  );
  model.remoteCenterPivot.rotation.z = -tiltRad;
  model.toolPlate.position.set(0, remoteCenterDistanceM, 0);
  model.toolPlate.rotation.set(0, 0, 0);

  model.root.updateMatrixWorld(true);

  for (const rod of model.parallelRods) {
    const baseAnchor = pointInRoot(
      model.root,
      model.basePlate,
      rod.userData.baseAnchor as THREE.Vector3,
    );
    const intermediateAnchor = pointInRoot(
      model.root,
      model.intermediatePlate,
      rod.userData.intermediateAnchor as THREE.Vector3,
    );
    setBetween(rod, baseAnchor, intermediateAnchor);
  }

  for (const rod of model.focalRods) {
    const intermediateAnchor = pointInRoot(
      model.root,
      model.intermediatePlate,
      rod.userData.intermediateAnchor as THREE.Vector3,
    );
    const toolAnchor = pointInRoot(
      model.root,
      model.toolPlate,
      rod.userData.toolAnchor as THREE.Vector3,
    );
    setBetween(rod, intermediateAnchor, toolAnchor);
  }

  // 3. Bellows visibility
  model.bellowsMesh.visible = controls.bellowsEngaged;
  const bellowsBase = pointInRoot(
    model.root,
    model.basePlate,
    model.bellowsMesh.userData.baseAnchor as THREE.Vector3,
  );
  const bellowsTool = pointInRoot(
    model.root,
    model.toolPlate,
    model.bellowsMesh.userData.toolAnchor as THREE.Vector3,
  );
  setBetween(model.bellowsMesh, bellowsBase, bellowsTool);

  // 4. Marker color reflects jamming index
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
