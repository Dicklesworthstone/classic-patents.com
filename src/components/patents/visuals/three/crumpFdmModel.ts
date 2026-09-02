import * as THREE from "three";
import type { CrumpFdmControls, CrumpFdmTelemetry } from "@/physics/crumpFdmKernel";

export interface CrumpFdm3DObjects {
  root: THREE.Group;
  gantryGroup: THREE.Group;
  carriageGroup: THREE.Group;
  bedGroup: THREE.Group;
  partGroup: THREE.Group;
  filamentLine: THREE.Line;
  nozzleMesh: THREE.Mesh;
  heaterBlockMesh: THREE.Mesh;
  driveRollerMesh: THREE.Mesh;
  pinchRollerMesh: THREE.Mesh;
  activeBeadMesh: THREE.Mesh;
  update: (controls: CrumpFdmControls, tel: CrumpFdmTelemetry, simTimeSec: number) => void;
  dispose: () => void;
}

export function createCrumpFdmModel(): CrumpFdm3DObjects {
  const root = new THREE.Group();
  root.name = "CrumpFdmApparatus";

  // Materials
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.85,
    roughness: 0.25,
  });

  const rodMaterial = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.95,
    roughness: 0.15,
  });

  const bedMaterial = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.7,
    roughness: 0.4,
  });

  const brassMaterial = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.8,
    roughness: 0.25,
  });

  const heaterBlockMaterial = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    metalness: 0.6,
    roughness: 0.35,
  });

  const filamentMaterial = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.3,
  });

  const printedPartMaterial = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.35,
    metalness: 0.1,
  });

  const activeBeadMaterial = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
  });

  // 1. Base Frame & Vertical Upright Posts
  const frameGroup = new THREE.Group();
  frameGroup.name = "ChassisFrame";

  const basePlate = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.1, 2.8), frameMaterial);
  basePlate.position.y = -0.05;
  frameGroup.add(basePlate);

  // 4 Vertical corner posts
  const postGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.8, 16);
  const p1 = new THREE.Mesh(postGeo, rodMaterial);
  p1.position.set(-1.4, 1.4, -1.2);
  const p2 = new THREE.Mesh(postGeo, rodMaterial);
  p2.position.set(1.4, 1.4, -1.2);
  const p3 = new THREE.Mesh(postGeo, rodMaterial);
  p3.position.set(-1.4, 1.4, 1.2);
  const p4 = new THREE.Mesh(postGeo, rodMaterial);
  p4.position.set(1.4, 1.4, 1.2);
  frameGroup.add(p1, p2, p3, p4);

  // Top Frame Crown
  const topCrown = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.08, 2.8), frameMaterial);
  topCrown.position.y = 2.8;
  frameGroup.add(topCrown);

  root.add(frameGroup);

  // 2. Heated Build Bed (Z-Axis Movement)
  const bedGroup = new THREE.Group();
  bedGroup.name = "HeatedBuildPlatform";
  bedGroup.position.set(0, 0.5, 0);

  const bedPlate = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.06, 1.8), bedMaterial);
  bedGroup.add(bedPlate);

  // 3. 3D Printed Object (attached to bed)
  const partGroup = new THREE.Group();
  partGroup.name = "Printed3DPart";
  partGroup.position.set(0, 0.03, 0);

  // Build a layered cylindrical / tiered vessel
  const layerCount = 30;
  for (let i = 0; i < layerCount; i++) {
    const layerH = 0.02;
    const r = 0.35 + 0.08 * Math.sin((i / layerCount) * Math.PI * 2);
    const layerMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(r, r, layerH, 32),
      printedPartMaterial,
    );
    layerMesh.position.y = i * layerH + layerH / 2;
    partGroup.add(layerMesh);
  }
  bedGroup.add(partGroup);
  root.add(bedGroup);

  // 4. X-Y Gantry Assembly
  const gantryGroup = new THREE.Group();
  gantryGroup.name = "GantryAssembly";
  gantryGroup.position.set(0, 1.8, 0);

  // Dual Y-Rods
  const yRodGeo = new THREE.CylinderGeometry(0.025, 0.025, 2.6, 16);
  const yRodLeft = new THREE.Mesh(yRodGeo, rodMaterial);
  yRodLeft.rotation.x = Math.PI / 2;
  yRodLeft.position.set(-1.1, 0, 0);
  const yRodRight = new THREE.Mesh(yRodGeo, rodMaterial);
  yRodRight.rotation.x = Math.PI / 2;
  yRodRight.position.set(1.1, 0, 0);
  gantryGroup.add(yRodLeft, yRodRight);

  // Dual X-Rods
  const xRodGeo = new THREE.CylinderGeometry(0.025, 0.025, 2.2, 16);
  const xRodFront = new THREE.Mesh(xRodGeo, rodMaterial);
  xRodFront.rotation.z = Math.PI / 2;
  xRodFront.position.set(0, 0.08, 0.1);
  const xRodBack = new THREE.Mesh(xRodGeo, rodMaterial);
  xRodBack.rotation.z = Math.PI / 2;
  xRodBack.position.set(0, 0.08, -0.1);
  gantryGroup.add(xRodFront, xRodBack);

  // 5. Extruder Toolhead Carriage (X-Axis Movement)
  const carriageGroup = new THREE.Group();
  carriageGroup.name = "ExtruderCarriage";

  // Carriage housing block
  const carriageHousing = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.35), frameMaterial);
  carriageHousing.position.y = 0.15;
  carriageGroup.add(carriageHousing);

  // Stepper Motor body
  const motorMesh = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.25), frameMaterial);
  motorMesh.position.set(0, 0.45, 0);
  carriageGroup.add(motorMesh);

  // Pinch Drive Rollers (FIG. 2)
  const rollerGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 24);
  const driveRollerMesh = new THREE.Mesh(rollerGeo, rodMaterial);
  driveRollerMesh.rotation.x = Math.PI / 2;
  driveRollerMesh.position.set(-0.08, 0.28, 0.12);
  carriageGroup.add(driveRollerMesh);

  const pinchRollerMesh = new THREE.Mesh(rollerGeo, rodMaterial);
  pinchRollerMesh.rotation.x = Math.PI / 2;
  pinchRollerMesh.position.set(0.08, 0.28, 0.12);
  carriageGroup.add(pinchRollerMesh);

  // Cold end Heatsink fins
  const heatsinkMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.2, 16), rodMaterial);
  heatsinkMesh.position.y = -0.05;
  carriageGroup.add(heatsinkMesh);

  // Heated Liquefier Block (FIG. 3)
  const heaterBlockMesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.2), heaterBlockMaterial);
  heaterBlockMesh.position.y = -0.2;
  carriageGroup.add(heaterBlockMesh);

  // Brass Nozzle Tip (FIG. 3)
  const nozzleMesh = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.1, 16), brassMaterial);
  nozzleMesh.rotation.x = Math.PI;
  nozzleMesh.position.y = -0.28;
  carriageGroup.add(nozzleMesh);

  // Active Extrusion Bead
  const activeBeadMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.12, 16),
    activeBeadMaterial,
  );
  activeBeadMesh.position.set(0, -0.34, 0);
  carriageGroup.add(activeBeadMesh);

  // Filament path line
  const filamentPoints = [
    new THREE.Vector3(0, 1.2, 0),
    new THREE.Vector3(0, 0.28, 0.12),
    new THREE.Vector3(0, -0.25, 0),
  ];
  const filamentGeo = new THREE.BufferGeometry().setFromPoints(filamentPoints);
  const filamentLine = new THREE.Line(
    filamentGeo,
    new THREE.LineBasicMaterial({ color: 0x0284c7, linewidth: 2 }),
  );
  carriageGroup.add(filamentLine);

  gantryGroup.add(carriageGroup);
  root.add(gantryGroup);

  // 6. Filament Spool mounted on top frame
  const spoolGroup = new THREE.Group();
  spoolGroup.name = "FilamentSpool";
  spoolGroup.position.set(0, 3.2, 0);

  const spoolFlange1 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.6, 0.04, 32),
    frameMaterial,
  );
  spoolFlange1.rotation.z = Math.PI / 2;
  spoolFlange1.position.x = -0.2;
  const spoolFlange2 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.6, 0.04, 32),
    frameMaterial,
  );
  spoolFlange2.rotation.z = Math.PI / 2;
  spoolFlange2.position.x = 0.2;
  const spoolCore = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 0.36, 32),
    filamentMaterial,
  );
  spoolCore.rotation.z = Math.PI / 2;
  spoolGroup.add(spoolFlange1, spoolFlange2, spoolCore);
  root.add(spoolGroup);

  function update(controls: CrumpFdmControls, tel: CrumpFdmTelemetry, simTimeSec: number) {
    if (!tel.isExtruding) {
      activeBeadMesh.visible = false;
      return;
    }
    activeBeadMesh.visible = true;

    // Toolhead circular/raster motion
    const radius = 0.35;
    const omega = (controls.printSpeedMmS / 45.0) * 1.5;
    const xPos = radius * Math.cos(simTimeSec * omega);
    const zPos = radius * Math.sin(simTimeSec * omega);

    carriageGroup.position.set(xPos, 0, zPos);

    // Rotate pinch rollers
    const rollerSpeed = tel.filamentFeedSpeedMmS * 2.0;
    driveRollerMesh.rotation.z = simTimeSec * rollerSpeed;
    pinchRollerMesh.rotation.z = -simTimeSec * rollerSpeed;

    // Bed Z position follows build height
    const currentZHeight = 0.5 - controls.layerHeightMm * 0.5;
    bedGroup.position.y = currentZHeight;

    // Scale active bead width
    const beadScaleX = controls.roadWidthMm / 0.45;
    activeBeadMesh.scale.set(beadScaleX, 1, beadScaleX);
  }

  function dispose() {
    frameMaterial.dispose();
    rodMaterial.dispose();
    bedMaterial.dispose();
    brassMaterial.dispose();
    heaterBlockMaterial.dispose();
    filamentMaterial.dispose();
    printedPartMaterial.dispose();
    activeBeadMaterial.dispose();
  }

  return {
    root,
    gantryGroup,
    carriageGroup,
    bedGroup,
    partGroup,
    filamentLine,
    nozzleMesh,
    heaterBlockMesh,
    driveRollerMesh,
    pinchRollerMesh,
    activeBeadMesh,
    update,
    dispose,
  };
}
