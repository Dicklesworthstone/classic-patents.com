import * as THREE from "three";
import type {
  HullStereolithographyControls,
  HullStereolithographyTelemetry,
} from "@/physics/hullStereolithographyKernel";

export interface HullStereolithography3DObjects {
  root: THREE.Group;
  vatMesh: THREE.Mesh;
  resinMesh: THREE.Mesh;
  platformGroup: THREE.Group;
  partGroup: THREE.Group;
  platformCarriageNut: THREE.Mesh;
  scannerGroup: THREE.Group;
  scannerSupportGroup: THREE.Group;
  laserBeamLine: THREE.Line;
  laserSpotMesh: THREE.Mesh;
  galvoMirrorMesh: THREE.Mesh;
  update: (
    controls: HullStereolithographyControls,
    _tel: HullStereolithographyTelemetry,
    simTimeSec: number,
  ) => void;
  dispose: () => void;
}

export function createHullStereolithographyModel(): HullStereolithography3DObjects {
  const root = new THREE.Group();
  root.name = "HullStereolithographyModel";

  // Materials
  const vatMaterial = new THREE.MeshStandardMaterial({
    color: 0x292524,
    metalness: 0.8,
    roughness: 0.3,
  });

  const vatGlassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.85,
    thickness: 0.05,
    transparent: true,
    opacity: 0.5,
  });

  const resinMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0284c7,
    metalness: 0.1,
    roughness: 0.2,
    transmission: 0.7,
    transparent: true,
    opacity: 0.65,
  });

  const platformMaterial = new THREE.MeshStandardMaterial({
    color: 0xa8a29e,
    metalness: 0.85,
    roughness: 0.25,
  });

  const curedPartMaterial = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.3,
    roughness: 0.4,
  });

  const laserSpotMaterial = new THREE.MeshBasicMaterial({
    color: 0xc084fc,
  });

  // 1. Vat Tank Structure
  const vatGroup = new THREE.Group();
  vatGroup.name = "VatTank";

  const vatBase = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 2.0), vatMaterial);
  vatBase.position.y = -0.05;
  vatGroup.add(vatBase);

  // Vat Glass Window (Front)
  const vatFront = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.4, 0.05), vatGlassMaterial);
  vatFront.position.set(0, 0.7, 0.95);
  vatGroup.add(vatFront);

  // Vat Sides & Back
  const vatBack = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.4, 0.05), vatMaterial);
  vatBack.position.set(0, 0.7, -0.95);
  vatGroup.add(vatBack);

  const vatLeft = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.4, 1.9), vatMaterial);
  vatLeft.position.set(-1.1, 0.7, 0);
  vatGroup.add(vatLeft);

  const vatRight = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.4, 1.9), vatMaterial);
  vatRight.position.set(1.1, 0.7, 0);
  vatGroup.add(vatRight);

  // 2. Liquid Resin Volume
  const resinGeo = new THREE.BoxGeometry(2.1, 1.2, 1.8);
  const resinMesh = new THREE.Mesh(resinGeo, resinMaterial);
  resinMesh.position.set(0, 0.6, 0);
  vatGroup.add(resinMesh);

  root.add(vatGroup);

  // 3. Elevator Mechanism & Build Platform
  const elevatorGroup = new THREE.Group();
  elevatorGroup.name = "ElevatorMechanism";

  // Lead Screw (Vertical)
  const leadScrewGeo = new THREE.CylinderGeometry(0.03, 0.03, 2.2, 16);
  const leadScrewMesh = new THREE.Mesh(leadScrewGeo, platformMaterial);
  leadScrewMesh.position.set(0, 1.1, -0.85);
  elevatorGroup.add(leadScrewMesh);

  // Moveable Platform Group
  const platformGroup = new THREE.Group();
  platformGroup.name = "PlatformGroup";

  const platformMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.06, 1.2), platformMaterial);
  platformMesh.position.set(0, 0, 0);
  platformGroup.add(platformMesh);

  // The platform cannot hover independently of its lead screw. A carriage
  // nut rides around the screw and a short rear bracket joins that nut to the
  // platform edge, so every elevator pose remains one connected mechanism.
  const platformCarriageNut = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 0.16, 20),
    platformMaterial,
  );
  platformCarriageNut.name = "Lead-screw carriage nut attached to build platform";
  platformCarriageNut.position.set(0, 0, -0.85);
  const platformRearBracket = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.08, 0.31),
    platformMaterial,
  );
  platformRearBracket.name = "Build-platform-to-carriage support bracket";
  platformRearBracket.position.set(0, 0, -0.725);
  platformGroup.add(platformCarriageNut, platformRearBracket);

  // 4. Cured 3D Object Group (anchored to platform)
  const partGroup = new THREE.Group();
  partGroup.name = "CuredObjectPart";
  platformGroup.add(partGroup);

  // Build a multi-layered procedural specimen
  const partMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.45, 0.5, 32),
    curedPartMaterial,
  );
  partMesh.position.set(0, 0.28, 0);
  partGroup.add(partMesh);

  elevatorGroup.add(platformGroup);
  root.add(elevatorGroup);

  // 5. Optical UV Laser Scanner Head
  const scannerGroup = new THREE.Group();
  scannerGroup.name = "LaserScannerAssembly";
  scannerGroup.position.set(0, 2.4, 0);

  const laserHousing = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.25, 0.35), vatMaterial);
  scannerGroup.add(laserHousing);

  const galvoMirrorGeo = new THREE.BoxGeometry(0.12, 0.02, 0.12);
  const galvoMirrorMesh = new THREE.Mesh(galvoMirrorGeo, platformMaterial);
  galvoMirrorMesh.position.set(0, -0.15, 0);
  scannerGroup.add(galvoMirrorMesh);

  root.add(scannerGroup);

  // Rear optical gantry: two uprights terminate on the vat's back wall, a
  // crossbeam joins them, and a forward boom overlaps the scanner housing.
  // The previous housing was literally suspended at y=2.4 with no parent
  // structure, which contradicted the otherwise physical apparatus.
  const scannerSupportGroup = new THREE.Group();
  scannerSupportGroup.name = "Vat-anchored optical scanner gantry";
  for (const x of [-0.95, 0.95]) {
    const upright = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.1, 0.08), platformMaterial);
    upright.name = `Optical gantry upright ${x < 0 ? "left" : "right"}`;
    upright.position.set(x, 1.93, -0.9);
    scannerSupportGroup.add(upright);
  }
  const scannerCrossbeam = new THREE.Mesh(new THREE.BoxGeometry(1.98, 0.1, 0.1), platformMaterial);
  scannerCrossbeam.name = "Optical gantry crossbeam";
  scannerCrossbeam.position.set(0, 2.43, -0.9);
  const scannerBoom = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.9), platformMaterial);
  scannerBoom.name = "Scanner-housing support boom";
  scannerBoom.position.set(0, 2.43, -0.48);
  scannerSupportGroup.add(scannerCrossbeam, scannerBoom);
  root.add(scannerSupportGroup);

  // 6. Active Laser Beam and Curing Spot on resin surface (Z = 1.2 in world)
  const laserBeamGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 2.25, 0),
    new THREE.Vector3(0, 1.2, 0),
  ]);
  const laserBeamMat = new THREE.LineBasicMaterial({ color: 0xc084fc, linewidth: 1 });
  const laserBeamLine = new THREE.Line(laserBeamGeo, laserBeamMat);
  root.add(laserBeamLine);

  const laserSpotGeo = new THREE.SphereGeometry(0.04, 16, 16);
  const laserSpotMesh = new THREE.Mesh(laserSpotGeo, laserSpotMaterial);
  laserSpotMesh.position.set(0, 1.2, 0);
  root.add(laserSpotMesh);

  // Dynamic Update Function
  function update(
    _controls: HullStereolithographyControls,
    _tel: HullStereolithographyTelemetry,
    simTimeSec: number,
  ) {
    // 1. Elevator vertical position (moving downward as build progresses)
    const elevatorCycle = 0.5 + 0.3 * Math.sin(simTimeSec * 0.4);
    platformGroup.position.y = 1.15 - elevatorCycle * 0.7;

    // 2. Galvanometer raster scanning path (Lissajous figure on surface)
    const scanX = 0.35 * Math.sin(simTimeSec * 4.5);
    const scanZ = 0.35 * Math.cos(simTimeSec * 3.2);

    laserSpotMesh.position.set(scanX, 1.2, scanZ);

    // Update laser line end coordinates
    const positions = laserBeamLine.geometry.attributes.position as THREE.BufferAttribute;
    positions.setXYZ(0, 0, 2.25, 0);
    positions.setXYZ(1, scanX, 1.2, scanZ);
    positions.needsUpdate = true;

    // Galvo mirror rotation tracking scan spot
    galvoMirrorMesh.rotation.x = Math.atan2(scanZ, 1.05);
    galvoMirrorMesh.rotation.y = Math.atan2(scanX, 1.05);
  }

  function dispose() {
    vatMaterial.dispose();
    vatGlassMaterial.dispose();
    resinMaterial.dispose();
    platformMaterial.dispose();
    curedPartMaterial.dispose();
    laserSpotMaterial.dispose();
    laserBeamMat.dispose();
    const disposedGeometries = new Set<THREE.BufferGeometry>();
    root.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
        if (!disposedGeometries.has(object.geometry)) {
          disposedGeometries.add(object.geometry);
          object.geometry.dispose();
        }
      }
    });
  }

  return {
    root,
    vatMesh: vatBase,
    resinMesh,
    platformGroup,
    partGroup,
    platformCarriageNut,
    scannerGroup,
    scannerSupportGroup,
    laserBeamLine,
    laserSpotMesh,
    galvoMirrorMesh,
    update,
    dispose,
  };
}
