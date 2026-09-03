import * as THREE from "three";
import type { CrumpFdmControls, CrumpFdmTelemetry } from "@/physics/crumpFdmKernel";

export interface CrumpFdm3DObjects {
  root: THREE.Group;
  gantryGroup: THREE.Group;
  xBridgeGroup: THREE.Group;
  carriageGroup: THREE.Group;
  bedGroup: THREE.Group;
  zLiftSupportGroup: THREE.Group;
  partGroup: THREE.Group;
  filamentLine: THREE.Line;
  filamentSegmentMeshes: readonly [THREE.Mesh, THREE.Mesh, THREE.Mesh];
  nozzleMesh: THREE.Mesh;
  planarNozzleLandMesh: THREE.Mesh;
  roundedOutletMesh: THREE.Mesh;
  heaterBlockMesh: THREE.Mesh;
  heaterCoilGroup: THREE.Group;
  driveRollerMesh: THREE.Mesh;
  pinchRollerMesh: THREE.Mesh;
  activeBeadMesh: THREE.Mesh;
  flattenedRoadMesh: THREE.Mesh;
  unshearedBeadMesh: THREE.Mesh;
  filamentGuideMesh: THREE.Mesh;
  spoolGroup: THREE.Group;
  spoolSupportGroup: THREE.Group;
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
  const heaterCoilMaterial = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0x7f1d1d,
    emissiveIntensity: 0.9,
    metalness: 0.45,
    roughness: 0.3,
  });

  const filamentMaterial = new THREE.MeshStandardMaterial({
    color: 0x22d3ee,
    emissive: 0x083344,
    emissiveIntensity: 0.7,
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

  const filamentLineMaterial = new THREE.LineBasicMaterial({
    color: 0x22d3ee,
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
  p1.name = "Chassis post rear left";
  p1.position.set(-1.4, 1.4, -1.2);
  const p2 = new THREE.Mesh(postGeo, rodMaterial);
  p2.name = "Chassis post rear right";
  p2.position.set(1.4, 1.4, -1.2);
  const p3 = new THREE.Mesh(postGeo, rodMaterial);
  p3.name = "Chassis post front left";
  p3.position.set(-1.4, 1.4, 1.2);
  const p4 = new THREE.Mesh(postGeo, rodMaterial);
  p4.name = "Chassis post front right";
  p4.position.set(1.4, 1.4, 1.2);
  frameGroup.add(p1, p2, p3, p4);

  // Top Frame Crown
  const topCrown = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.08, 2.8), frameMaterial);
  topCrown.name = "Chassis top crown";
  topCrown.position.y = 2.8;
  frameGroup.add(topCrown);

  root.add(frameGroup);

  // 2. Article-receiving base plate (normalized modern relative-motion
  // arrangement allowed by the specification, not a literal Fig. 1 layout).
  const bedGroup = new THREE.Group();
  bedGroup.name = "ArticleReceivingBasePlate10";
  bedGroup.position.set(0, 0.82, 0);

  const bedPlate = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.06, 1.8), bedMaterial);
  bedPlate.name = "Article-receiving base plate 10";
  bedGroup.add(bedPlate);

  // Two fixed lead screws rise from pillow blocks on the chassis base. Nuts
  // carried by the bed overlap both the plate and each screw, making its Z
  // translation an explicit constrained carriage rather than levitation.
  const zLiftSupportGroup = new THREE.Group();
  zLiftSupportGroup.name = "Base-anchored build-platform Z lift";
  for (const x of [-0.78, 0.78]) {
    const side = x < 0 ? "left" : "right";
    const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.55, 14), rodMaterial);
    screw.name = `Build-platform Z lead screw ${side}`;
    screw.position.set(x, 0.775, -0.78);
    const pillowBlock = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.18), frameMaterial);
    pillowBlock.name = `Z lead-screw base bearing ${side}`;
    pillowBlock.position.set(x, 0.06, -0.78);
    zLiftSupportGroup.add(screw, pillowBlock);

    const carriageNut = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.075, 0.15, 18),
      brassMaterial,
    );
    carriageNut.name = `Build-platform Z carriage nut ${side}`;
    carriageNut.position.set(x, 0, -0.78);
    bedGroup.add(carriageNut);
  }
  root.add(zLiftSupportGroup);

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
  yRodLeft.name = "Fixed Y rail left";
  yRodLeft.rotation.x = Math.PI / 2;
  yRodLeft.position.set(-1.1, 0, 0);
  const yRodRight = new THREE.Mesh(yRodGeo, rodMaterial);
  yRodRight.name = "Fixed Y rail right";
  yRodRight.rotation.x = Math.PI / 2;
  yRodRight.position.set(1.1, 0, 0);
  gantryGroup.add(yRodLeft, yRodRight);

  // Fixed front/rear cross-members clamp both Y rails into the upright frame.
  // Their ends overlap the vertical posts, eliminating another visually subtle
  // free-floating subassembly.
  for (const z of [-1.22, 1.22]) {
    const support = new THREE.Mesh(new THREE.BoxGeometry(2.92, 0.08, 0.08), frameMaterial);
    support.name = `Frame-connected Y-rail support ${z < 0 ? "rear" : "front"}`;
    support.position.set(0, 0, z);
    gantryGroup.add(support);
  }

  // The X rods and toolhead form one bridge that translates along the fixed
  // Y rails. Previously the rods stayed at z=0 while the toolhead traced an
  // independent circle through empty space.
  const xBridgeGroup = new THREE.Group();
  xBridgeGroup.name = "X-axis bridge riding on Y rails";

  // Dual X-Rods
  const xRodGeo = new THREE.CylinderGeometry(0.025, 0.025, 2.2, 16);
  const xRodFront = new THREE.Mesh(xRodGeo, rodMaterial);
  xRodFront.name = "Moving X rail front";
  xRodFront.rotation.z = Math.PI / 2;
  xRodFront.position.set(0, 0.08, 0.1);
  const xRodBack = new THREE.Mesh(xRodGeo, rodMaterial);
  xRodBack.name = "Moving X rail rear";
  xRodBack.rotation.z = Math.PI / 2;
  xRodBack.position.set(0, 0.08, -0.1);
  xBridgeGroup.add(xRodFront, xRodBack);

  for (const x of [-1.1, 1.1]) {
    const bearing = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.18, 0.32), frameMaterial);
    bearing.name = `X-bridge Y-rail bearing ${x < 0 ? "left" : "right"}`;
    bearing.position.set(x, 0.08, 0);
    xBridgeGroup.add(bearing);
  }
  gantryGroup.add(xBridgeGroup);

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

  // Flexible-strand drive roller 134 and idler roller 136 (FIG. 5).
  const rollerGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 24);
  const driveRollerMesh = new THREE.Mesh(rollerGeo, rodMaterial);
  driveRollerMesh.name = "Drive roller 134";
  driveRollerMesh.rotation.x = Math.PI / 2;
  driveRollerMesh.position.set(-0.08, 0.28, 0.12);
  carriageGroup.add(driveRollerMesh);

  const pinchRollerMesh = new THREE.Mesh(rollerGeo, rodMaterial);
  pinchRollerMesh.name = "Idler roller 136";
  pinchRollerMesh.rotation.x = Math.PI / 2;
  pinchRollerMesh.position.set(0.08, 0.28, 0.12);
  carriageGroup.add(pinchRollerMesh);
  const rollerBaseQuaternion = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(1, 0, 0),
    Math.PI / 2,
  );
  const rollerSpinAxis = new THREE.Vector3(0, 1, 0);
  const rollerSpinQuaternion = new THREE.Quaternion();

  // Cold end Heatsink fins
  const heatsinkMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.2, 16), rodMaterial);
  heatsinkMesh.position.y = -0.05;
  carriageGroup.add(heatsinkMesh);

  // Heating means around the flow passage/outlet (Claim 2; FIG. 5 coil 130).
  const heaterBlockMesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.2), heaterBlockMaterial);
  heaterBlockMesh.name = "Claim 2 heating means near flow passage";
  heaterBlockMesh.position.y = -0.2;
  carriageGroup.add(heaterBlockMesh);

  const heaterCoilGroup = new THREE.Group();
  heaterCoilGroup.name = "Figure 5 electric resistance heater coil 130";
  for (const y of [-0.17, -0.2, -0.23]) {
    const turn = new THREE.Mesh(new THREE.TorusGeometry(0.112, 0.012, 8, 28), heaterCoilMaterial);
    turn.name = "Heater coil 130 turn";
    turn.rotation.x = Math.PI / 2;
    turn.position.y = y;
    heaterCoilGroup.add(turn);
  }
  carriageGroup.add(heaterCoilGroup);

  // Outlet nozzle 122 has a capped, substantially planar bottom rather than
  // the former impossible point tip. Claim 39's larger planar land is a
  // separately observable geometry probe.
  const nozzleMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.035, 0.1, 24),
    brassMaterial,
  );
  nozzleMesh.name = "Flow-passage outlet nozzle 122";
  nozzleMesh.position.y = -0.28;
  carriageGroup.add(nozzleMesh);

  const planarNozzleLandMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.07, 0.012, 24),
    brassMaterial,
  );
  planarNozzleLandMesh.name = "Claim 39 substantially planar nozzle bottom";
  planarNozzleLandMesh.position.y = -0.336;
  carriageGroup.add(planarNozzleLandMesh);

  const roundedOutletMesh = new THREE.Mesh(new THREE.SphereGeometry(0.043, 20, 12), brassMaterial);
  roundedOutletMesh.name = "Claim 39-withheld rounded outlet comparison";
  roundedOutletMesh.position.y = -0.333;
  roundedOutletMesh.visible = false;
  carriageGroup.add(roundedOutletMesh);

  // Active Extrusion Bead
  const activeBeadMesh = new THREE.Mesh(
    // Unit height: update() scales and centers this bridge so it exactly
    // spans the live nozzle-to-part gap as the build platform moves.
    new THREE.CylinderGeometry(0.02, 0.02, 1, 16),
    activeBeadMaterial,
  );
  activeBeadMesh.name = "Connected outlet-to-layer material bridge";
  carriageGroup.add(activeBeadMesh);

  const flattenedRoadMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.018, 0.09),
    activeBeadMaterial,
  );
  flattenedRoadMesh.name = "Claim 39 flattened road at maintained gap";
  bedGroup.add(flattenedRoadMesh);

  const unshearedBeadMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.038, 0.038, 0.24, 18),
    activeBeadMaterial,
  );
  unshearedBeadMesh.name = "Claim 39-withheld unsheared round bead comparison";
  unshearedBeadMesh.rotation.z = Math.PI / 2;
  unshearedBeadMesh.visible = false;
  bedGroup.add(unshearedBeadMesh);

  xBridgeGroup.add(carriageGroup);
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

  const spoolSupportGroup = new THREE.Group();
  spoolSupportGroup.name = "Top-frame spool axle and yoke support";
  const spoolAxle = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.82, 16), rodMaterial);
  spoolAxle.name = "Filament spool axle";
  spoolAxle.rotation.z = Math.PI / 2;
  spoolAxle.position.set(0, 3.2, 0);
  spoolSupportGroup.add(spoolAxle);
  for (const x of [-0.36, 0.36]) {
    const yoke = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.42, 0.1), frameMaterial);
    yoke.name = `Spool axle yoke ${x < 0 ? "left" : "right"}`;
    yoke.position.set(x, 3.01, 0);
    spoolSupportGroup.add(yoke);
  }
  root.add(spoolSupportGroup);

  // A frame-mounted guide prevents the feed path from bending around an
  // imaginary point in space. The line itself lives in root coordinates:
  // its spool endpoint stays fixed while its toolhead endpoint follows the
  // X/Y carriage, just as a flexible filament path must.
  const filamentGuideMesh = new THREE.Mesh(
    new THREE.TorusGeometry(0.075, 0.018, 10, 24),
    brassMaterial,
  );
  filamentGuideMesh.name = "Frame-mounted filament guide eyelet";
  filamentGuideMesh.position.set(0.45, 2.74, 0.43);
  filamentGuideMesh.rotation.x = Math.PI / 2;
  root.add(filamentGuideMesh);

  const filamentPoints = [
    new THREE.Vector3(0, 2.84, 0.36),
    filamentGuideMesh.position.clone(),
    new THREE.Vector3(0, 2.08, 0.12),
    new THREE.Vector3(0, 1.55, 0),
  ];
  const filamentGeo = new THREE.BufferGeometry().setFromPoints(filamentPoints);
  const filamentLine = new THREE.Line(filamentGeo, filamentLineMaterial);
  filamentLine.name = "Continuous spool-to-liquefier filament path";
  root.add(filamentLine);

  // WebGL ignores LineBasicMaterial.linewidth on most platforms. Give the
  // feedstock real cylindrical volume as well as a mathematical centreline,
  // so the continuous spool -> guide -> pinch rollers -> liquefier path stays
  // legible and physically accountable from every camera.
  const filamentSegmentGeometry = new THREE.CylinderGeometry(0.022, 0.022, 1, 10);
  function createFilamentSegment(index: number) {
    const segment = new THREE.Mesh(filamentSegmentGeometry, filamentMaterial);
    segment.name = `Filament feed segment ${index + 1}`;
    root.add(segment);
    return segment;
  }
  const filamentSegmentMeshes: [THREE.Mesh, THREE.Mesh, THREE.Mesh] = [
    createFilamentSegment(0),
    createFilamentSegment(1),
    createFilamentSegment(2),
  ];
  const segmentMidpoint = new THREE.Vector3();
  const segmentDirection = new THREE.Vector3();
  const segmentUp = new THREE.Vector3(0, 1, 0);

  function setSegmentBetween(mesh: THREE.Mesh, start: THREE.Vector3, end: THREE.Vector3) {
    segmentDirection.subVectors(end, start);
    const length = segmentDirection.length();
    segmentMidpoint.copy(start).add(end).multiplyScalar(0.5);
    mesh.position.copy(segmentMidpoint);
    mesh.scale.set(1, length, 1);
    mesh.quaternion.setFromUnitVectors(segmentUp, segmentDirection.normalize());
  }

  filamentSegmentMeshes.forEach((segment, index) => {
    setSegmentBetween(segment, filamentPoints[index], filamentPoints[index + 1]);
  });

  function update(controls: CrumpFdmControls, tel: CrumpFdmTelemetry, simTimeSec: number) {
    const apparatusVisible = tel.claim1ApparatusPresent;
    gantryGroup.visible = apparatusVisible;
    bedGroup.visible = apparatusVisible;
    zLiftSupportGroup.visible = apparatusVisible;
    spoolGroup.visible = apparatusVisible;
    spoolSupportGroup.visible = apparatusVisible;
    filamentGuideMesh.visible = apparatusVisible;
    filamentLine.visible = apparatusVisible;
    filamentSegmentMeshes.forEach((segment) => {
      segment.visible = apparatusVisible;
    });
    heaterBlockMesh.visible = apparatusVisible && tel.claim2HeatingMeansPresent;
    heaterCoilGroup.visible = apparatusVisible && tel.claim2HeatingMeansPresent;
    planarNozzleLandMesh.visible = apparatusVisible && tel.claim39PlanarGapPresent;
    roundedOutletMesh.visible = apparatusVisible && !tel.claim39PlanarGapPresent;

    // Toolhead circular/raster motion
    // Stay inside the top layer's 0.333-unit radius so the live bead always
    // lands on material instead of orbiting just outside the vessel wall.
    const radius = 0.31;
    const omega = (controls.printSpeedMmS / 45.0) * 1.5;
    const xPos = radius * Math.cos(simTimeSec * omega);
    const zPos = radius * Math.sin(simTimeSec * omega);

    xBridgeGroup.position.z = zPos;
    carriageGroup.position.set(xPos, 0, 0);

    const filamentPositions = filamentLine.geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;
    filamentPositions.setXYZ(0, 0, 2.84, 0.36);
    filamentPositions.setXYZ(
      1,
      filamentGuideMesh.position.x,
      filamentGuideMesh.position.y,
      filamentGuideMesh.position.z,
    );
    filamentPositions.setXYZ(2, xPos, 2.08, zPos + 0.12);
    filamentPositions.setXYZ(3, xPos, 1.55, zPos);
    filamentPositions.needsUpdate = true;
    for (let index = 0; index < filamentSegmentMeshes.length; index += 1) {
      filamentPoints[index].fromBufferAttribute(filamentPositions, index);
      filamentPoints[index + 1].fromBufferAttribute(filamentPositions, index + 1);
      setSegmentBetween(
        filamentSegmentMeshes[index],
        filamentPoints[index],
        filamentPoints[index + 1],
      );
    }

    activeBeadMesh.visible = tel.isExtruding;

    // Rotate pinch rollers
    const rollerSpeed = tel.filamentFeedSpeedMmS * 2.0;
    if (tel.isExtruding) {
      rollerSpinQuaternion.setFromAxisAngle(rollerSpinAxis, simTimeSec * rollerSpeed);
      driveRollerMesh.quaternion.copy(rollerBaseQuaternion).multiply(rollerSpinQuaternion);
      rollerSpinQuaternion.setFromAxisAngle(rollerSpinAxis, -simTimeSec * rollerSpeed);
      pinchRollerMesh.quaternion.copy(rollerBaseQuaternion).multiply(rollerSpinQuaternion);
    }

    // Solve the plate position from the actual layer top and declared working
    // gap. One display unit represents 10 mm here, so 0.20 mm -> 0.020 units.
    // This removes the old 4.4 mm free-falling filament pillar.
    const outletBottomLocalY = tel.claim39PlanarGapPresent
      ? planarNozzleLandMesh.position.y - 0.006
      : roundedOutletMesh.position.y - 0.043;
    const nozzleTipWorldY = gantryGroup.position.y + carriageGroup.position.y + outletBottomLocalY;
    const visualGap = controls.layerHeightMm * 0.1;
    const partTopRelativeToBed = partGroup.position.y + layerCount * 0.02;
    bedGroup.position.y = nozzleTipWorldY - partTopRelativeToBed - visualGap;
    const partTopWorldY = bedGroup.position.y + partTopRelativeToBed;
    const beadLength = nozzleTipWorldY - partTopWorldY;
    const beadScaleX = controls.roadWidthMm / 0.45;
    activeBeadMesh.position.y =
      (nozzleTipWorldY + partTopWorldY) / 2 - gantryGroup.position.y - carriageGroup.position.y;
    activeBeadMesh.scale.set(beadScaleX, beadLength, beadScaleX);

    flattenedRoadMesh.visible = tel.isExtruding && tel.claim39PlanarGapPresent;
    unshearedBeadMesh.visible = tel.isExtruding && !tel.claim39PlanarGapPresent;
    flattenedRoadMesh.position.set(xPos, partTopRelativeToBed + 0.009, zPos);
    const unshearedRadialScale = visualGap / (2 * 0.038);
    unshearedBeadMesh.scale.set(unshearedRadialScale, 1, unshearedRadialScale);
    unshearedBeadMesh.position.set(xPos, partTopRelativeToBed + visualGap / 2, zPos);
  }

  function dispose() {
    frameMaterial.dispose();
    rodMaterial.dispose();
    bedMaterial.dispose();
    brassMaterial.dispose();
    heaterBlockMaterial.dispose();
    heaterCoilMaterial.dispose();
    filamentMaterial.dispose();
    printedPartMaterial.dispose();
    activeBeadMaterial.dispose();
    filamentLineMaterial.dispose();
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
    gantryGroup,
    xBridgeGroup,
    carriageGroup,
    bedGroup,
    zLiftSupportGroup,
    partGroup,
    filamentLine,
    filamentSegmentMeshes,
    nozzleMesh,
    planarNozzleLandMesh,
    roundedOutletMesh,
    heaterBlockMesh,
    heaterCoilGroup,
    driveRollerMesh,
    pinchRollerMesh,
    activeBeadMesh,
    flattenedRoadMesh,
    unshearedBeadMesh,
    filamentGuideMesh,
    spoolGroup,
    spoolSupportGroup,
    update,
    dispose,
  };
}
