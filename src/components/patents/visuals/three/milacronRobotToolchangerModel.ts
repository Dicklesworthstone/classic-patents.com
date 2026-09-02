import * as THREE from "three";
import type {
  MilacronToolchangerControls,
  MilacronToolchangerTelemetry,
} from "@/physics/milacronRobotToolchangerKernel";

export interface MilacronToolchanger3DObjects {
  root: THREE.Group;
  adapterGroup: THREE.Group;
  toolBaseGroup: THREE.Group;
  lockingSlideMesh: THREE.Mesh;
  pistonRodMesh: THREE.Mesh;
  cylindricalPinMesh: THREE.Mesh;
  diamondPinMesh: THREE.Mesh;
  tMemberMesh: THREE.Mesh;
  toolHeadMesh: THREE.Mesh;
  update: (
    controls: MilacronToolchangerControls,
    tel: MilacronToolchangerTelemetry,
    simTimeSec: number,
  ) => void;
  dispose: () => void;
}

export function createMilacronRobotToolchangerModel(): MilacronToolchanger3DObjects {
  const root = new THREE.Group();
  root.name = "MilacronRobotToolchangerModel";

  // Materials
  const housingMaterial = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.85,
    roughness: 0.25,
  });

  const slideMaterial = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.75,
    roughness: 0.3,
  });

  const chromePinMaterial = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.95,
    roughness: 0.15,
  });

  const cylinderMaterial = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    metalness: 0.8,
    roughness: 0.2,
  });

  const toolMaterial = new THREE.MeshStandardMaterial({
    color: 0x292524,
    metalness: 0.6,
    roughness: 0.4,
  });

  // 1. Adapter Master Unit Group
  const adapterGroup = new THREE.Group();
  adapterGroup.name = "AdapterMasterUnit";

  // Rear Robot Mounting Plate 27
  const rearPlateGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.15, 32);
  const rearPlateMesh = new THREE.Mesh(rearPlateGeo, housingMaterial);
  rearPlateMesh.rotation.x = Math.PI / 2;
  rearPlateMesh.position.z = -0.8;
  adapterGroup.add(rearPlateMesh);

  // Front Plate 26 (with central clearance opening)
  const frontPlateGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.15, 32);
  const frontPlateMesh = new THREE.Mesh(frontPlateGeo, housingMaterial);
  frontPlateMesh.rotation.x = Math.PI / 2;
  frontPlateMesh.position.z = 0.0;
  adapterGroup.add(frontPlateMesh);

  // Spacer Blocks 28 & 29
  const spacerTop = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.25, 0.7), housingMaterial);
  spacerTop.position.set(0, 0.75, -0.4);
  adapterGroup.add(spacerTop);

  const spacerBottom = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.25, 0.7), housingMaterial);
  spacerBottom.position.set(0, -0.75, -0.4);
  adapterGroup.add(spacerBottom);

  // Internal Pneumatic Cylinder 47
  const cylinderGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.65, 24);
  const cylinderMesh = new THREE.Mesh(cylinderGeo, cylinderMaterial);
  cylinderMesh.rotation.z = Math.PI / 2;
  cylinderMesh.position.set(-0.25, 0, -0.4);
  adapterGroup.add(cylinderMesh);

  // Piston Rod 46 & Yoke
  const rodGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 16);
  const pistonRodMesh = new THREE.Mesh(rodGeo, chromePinMaterial);
  pistonRodMesh.rotation.z = Math.PI / 2;
  pistonRodMesh.position.set(0.15, 0, -0.4);
  adapterGroup.add(pistonRodMesh);

  // Transverse Locking Slide 33
  const slideGeo = new THREE.BoxGeometry(0.35, 1.3, 0.12);
  const lockingSlideMesh = new THREE.Mesh(slideGeo, slideMaterial);
  lockingSlideMesh.position.set(0.15, 0, 0.02);
  adapterGroup.add(lockingSlideMesh);

  // Locating Pins on Front Plate 26
  // Cylindrical Pin 43 (Top)
  const cylPinGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 24);
  const cylindricalPinMesh = new THREE.Mesh(cylPinGeo, chromePinMaterial);
  cylindricalPinMesh.rotation.x = Math.PI / 2;
  cylindricalPinMesh.position.set(0, 0.65, 0.15);
  adapterGroup.add(cylindricalPinMesh);

  // Diamond Pin 44 (Bottom)
  const diamondPinGeo = new THREE.BoxGeometry(0.12, 0.2, 0.3);
  const diamondPinMesh = new THREE.Mesh(diamondPinGeo, chromePinMaterial);
  diamondPinMesh.rotation.z = Math.PI / 4;
  diamondPinMesh.position.set(0, -0.65, 0.15);
  adapterGroup.add(diamondPinMesh);

  root.add(adapterGroup);

  // 2. Tool Base & End Effector Group
  const toolBaseGroup = new THREE.Group();
  toolBaseGroup.name = "ToolBaseAssembly";
  toolBaseGroup.position.z = 0.3; // Default docked gap position

  // Universal Tool Base Plate 18
  const toolBasePlateGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.15, 32);
  const toolBasePlateMesh = new THREE.Mesh(toolBasePlateGeo, housingMaterial);
  toolBasePlateMesh.rotation.x = Math.PI / 2;
  toolBasePlateMesh.position.z = 0.08;
  toolBaseGroup.add(toolBasePlateMesh);

  // T-Shaped Retention Member 35
  const tMemberGroup = new THREE.Group();
  tMemberGroup.name = "TMemberRetentionLug";

  const stemMesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.25, 0.35), chromePinMaterial);
  stemMesh.position.z = -0.1;
  tMemberGroup.add(stemMesh);

  const crossbarMesh = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.65, 0.15), slideMaterial);
  crossbarMesh.position.z = -0.28;
  tMemberGroup.add(crossbarMesh);

  toolBaseGroup.add(tMemberGroup);

  // Tool Head 19 (e.g. Dual-Tip Spot Welding Gun)
  const toolHeadGroup = new THREE.Group();
  toolHeadGroup.name = "IndustrialToolHead";

  const toolBody = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.9, 1.1), toolMaterial);
  toolBody.position.set(0, 0, 0.7);
  toolHeadGroup.add(toolBody);

  // Electrode Arms
  const armTop = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 16), chromePinMaterial);
  armTop.rotation.x = Math.PI / 2;
  armTop.position.set(0, 0.25, 1.4);
  toolHeadGroup.add(armTop);

  const armBottom = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 16), chromePinMaterial);
  armBottom.rotation.x = Math.PI / 2;
  armBottom.position.set(0, -0.25, 1.4);
  toolHeadGroup.add(armBottom);

  toolBaseGroup.add(toolHeadGroup);
  root.add(toolBaseGroup);

  function update(
    controls: MilacronToolchangerControls,
    _tel: MilacronToolchangerTelemetry,
    _simTimeSec: number,
  ) {
    // 1. Tool Base Docking Gap translation
    toolBaseGroup.position.z = 0.15 + (controls.dockingGapMm / 5) * 1.5;

    // 2. Locking slide radial displacement
    const strokeNorm = controls.slideStrokeMm / 25;
    lockingSlideMesh.position.y = -0.3 + strokeNorm * 0.3;
    pistonRodMesh.position.x = 0.05 + strokeNorm * 0.2;
  }

  function dispose() {
    housingMaterial.dispose();
    slideMaterial.dispose();
    chromePinMaterial.dispose();
    cylinderMaterial.dispose();
    toolMaterial.dispose();
  }

  return {
    root,
    adapterGroup,
    toolBaseGroup,
    lockingSlideMesh,
    pistonRodMesh,
    cylindricalPinMesh,
    diamondPinMesh,
    tMemberMesh: crossbarMesh,
    toolHeadMesh: toolBody,
    update,
    dispose,
  };
}
