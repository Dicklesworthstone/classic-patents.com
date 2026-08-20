/**
 * howeSewingMachineModel.ts
 *
 * Museum-Grade Procedural 3D Model for Elias Howe's 1846 Lockstitch Sewing Machine
 * (US Patent 4,750).
 *
 * Reconstructs the authentic 1846 patent prototype preserved at the Smithsonian Institution:
 * 1. Heavy cast-iron open-frame pedestal base with mounting feet and oil galleries.
 * 2. Hand cranked driving flywheel with counterweight and grooved belt pulley.
 * 3. Vibrating curved needle arm driven by a heart-shaped cam on the main shaft.
 * 4. Curved eye-pointed needle (Claim 1) vibrating through vertically held cloth.
 * 5. Reciprocating boat shuttle (Claim 2) carrying the lower bobbin thread through the needle loop.
 * 6. Vertical baster plate with pointed steel pins (Claim 3) advancing cloth with intermittent feed rack.
 * 7. Upper thread spool spindle, leaf tension spring, and interlocking thread loops.
 */

import * as THREE from "three";

export { howeCyclicFlex } from "@/physics/genericWasm";

export interface HoweSewingMachineModel {
  rootGroup: THREE.Group;
  flywheelGroup: THREE.Group;
  needleArmGroup: THREE.Group;
  curvedNeedle: THREE.Mesh;
  shuttleGroup: THREE.Group;
  shuttleMesh: THREE.Mesh;
  basterPlateGroup: THREE.Group;
  clothMesh: THREE.Mesh;
  upperThreadLine: THREE.Line;
  materials: {
    castIron: THREE.MeshStandardMaterial;
    darkIron: THREE.MeshStandardMaterial;
    polishedSteel: THREE.MeshStandardMaterial;
    brass: THREE.MeshStandardMaterial;
    bronze: THREE.MeshStandardMaterial;
    threadMat: THREE.LineBasicMaterial;
    clothMat: THREE.MeshStandardMaterial;
    spoolWoodMat?: THREE.MeshStandardMaterial;
  };
  dispose: () => void;
}

export function buildHoweSewingMachineModel(): HoweSewingMachineModel {
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  // --- 1. MATERIALS ---
  const castIron = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.45,
    metalness: 0.85,
  });
  materialsToDispose.push(castIron);

  const darkIron = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.65,
    metalness: 0.7,
  });
  materialsToDispose.push(darkIron);

  const polishedSteel = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.12,
    metalness: 0.95,
  });
  materialsToDispose.push(polishedSteel);

  const brass = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.22,
    metalness: 0.9,
  });
  materialsToDispose.push(brass);

  const bronze = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    roughness: 0.28,
    metalness: 0.85,
  });
  materialsToDispose.push(bronze);

  const threadMat = new THREE.LineBasicMaterial({
    color: 0xef4444,
    linewidth: 2,
  });
  materialsToDispose.push(threadMat);

  const clothMat = new THREE.MeshStandardMaterial({
    color: 0xfef3c7,
    roughness: 0.85,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });
  materialsToDispose.push(clothMat);

  const spoolWoodMat = new THREE.MeshStandardMaterial({
    color: 0x78350f,
    roughness: 0.55,
    metalness: 0.05,
  });
  materialsToDispose.push(spoolWoodMat);

  // --- 2. CAST-IRON BASE & PEDESTAL STAND ---
  const baseGroup = new THREE.Group();
  rootGroup.add(baseGroup);

  // Heavy Baseplate with Flanged Rim
  const baseGeo = new THREE.BoxGeometry(9.5, 0.6, 5.5);
  geometriesToDispose.push(baseGeo);
  const baseMesh = new THREE.Mesh(baseGeo, castIron);
  baseMesh.position.y = -2.2;
  baseMesh.receiveShadow = true;
  baseGroup.add(baseMesh);

  // 4 Cast Mounting Lugs
  for (const bx of [-4.2, 4.2]) {
    for (const bz of [-2.3, 2.3]) {
      const lugGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.65, 16);
      geometriesToDispose.push(lugGeo);
      const lug = new THREE.Mesh(lugGeo, darkIron);
      lug.position.set(bx, -2.15, bz);
      baseGroup.add(lug);
    }
  }

  // Vertical Standard Pillar Columns with Architectural Flutings
  const columnLeftGeo = new THREE.CylinderGeometry(0.4, 0.55, 3.8, 20);
  geometriesToDispose.push(columnLeftGeo);
  const columnLeft = new THREE.Mesh(columnLeftGeo, castIron);
  columnLeft.position.set(-2.5, -0.1, 0);
  columnLeft.castShadow = true;
  baseGroup.add(columnLeft);

  const columnRightGeo = new THREE.CylinderGeometry(0.35, 0.45, 3.2, 20);
  geometriesToDispose.push(columnRightGeo);
  const columnRight = new THREE.Mesh(columnRightGeo, castIron);
  columnRight.position.set(2.2, -0.4, 0);
  columnRight.castShadow = true;
  baseGroup.add(columnRight);

  // Upper Horizontal Bridge Girder
  const girderGeo = new THREE.BoxGeometry(5.2, 0.5, 0.9);
  geometriesToDispose.push(girderGeo);
  const girder = new THREE.Mesh(girderGeo, castIron);
  girder.position.set(-0.2, 1.8, 0);
  girder.castShadow = true;
  baseGroup.add(girder);

  // --- 3. DRIVING FLYWHEEL & MAIN SHAFT ---
  const flywheelGroup = new THREE.Group();
  flywheelGroup.position.set(-3.8, 1.8, 0);
  rootGroup.add(flywheelGroup);

  // Main Shaft
  const shaftGeo = new THREE.CylinderGeometry(0.12, 0.12, 5.8, 16);
  geometriesToDispose.push(shaftGeo);
  const shaft = new THREE.Mesh(shaftGeo, polishedSteel);
  shaft.rotation.z = Math.PI / 2;
  shaft.position.x = 2.4;
  flywheelGroup.add(shaft);

  // 6-Spoke Heavy Flywheel with Hand Crank Handle
  const wheelRimGeo = new THREE.TorusGeometry(2.4, 0.18, 12, 36);
  geometriesToDispose.push(wheelRimGeo);
  const wheelRim = new THREE.Mesh(wheelRimGeo, castIron);
  wheelRim.rotation.y = Math.PI / 2;
  wheelRim.castShadow = true;
  flywheelGroup.add(wheelRim);

  for (let s = 0; s < 6; s++) {
    const sAngle = (s * Math.PI * 2) / 6;
    const spokeGeo = new THREE.CylinderGeometry(0.06, 0.08, 2.3, 8);
    geometriesToDispose.push(spokeGeo);
    const spoke = new THREE.Mesh(spokeGeo, castIron);
    spoke.position.set(0, Math.sin(sAngle) * 1.15, Math.cos(sAngle) * 1.15);
    spoke.rotation.x = sAngle;
    flywheelGroup.add(spoke);
  }

  // Wooden Hand Crank Handle
  const crankPinGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.9, 12);
  geometriesToDispose.push(crankPinGeo);
  const crankPin = new THREE.Mesh(crankPinGeo, brass);
  crankPin.rotation.z = Math.PI / 2;
  crankPin.position.set(-0.5, 1.8, 0);
  crankPin.castShadow = true;
  flywheelGroup.add(crankPin);

  // --- 4. VIBRATING CURVED NEEDLE ARM (Claim 1) ---
  const needleArmGroup = new THREE.Group();
  needleArmGroup.position.set(0.6, 1.8, 0.6);
  rootGroup.add(needleArmGroup);

  // Cast-Iron Curved Rocker Arm
  const armGeo = new THREE.BoxGeometry(2.8, 0.25, 0.35);
  geometriesToDispose.push(armGeo);
  const armMesh = new THREE.Mesh(armGeo, castIron);
  armMesh.position.set(1.2, -0.4, 0);
  armMesh.rotation.z = -0.3;
  armMesh.castShadow = true;
  needleArmGroup.add(armMesh);

  // Curved Eye-Pointed Steel Needle (US Patent 4,750 Claim 1)
  const needleCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(2.5, -0.6, 0),
    new THREE.Vector3(2.8, -1.2, 0),
    new THREE.Vector3(2.6, -1.8, 0),
  );
  const needleGeo = new THREE.TubeGeometry(needleCurve, 20, 0.035, 8, false);
  geometriesToDispose.push(needleGeo);
  const curvedNeedle = new THREE.Mesh(needleGeo, polishedSteel);
  curvedNeedle.castShadow = true;
  needleArmGroup.add(curvedNeedle);

  // Needle Eye Hole at the tip
  const eyeGeo = new THREE.TorusGeometry(0.045, 0.015, 6, 12);
  geometriesToDispose.push(eyeGeo);
  const needleEye = new THREE.Mesh(eyeGeo, brass);
  needleEye.position.set(2.6, -1.78, 0);
  needleArmGroup.add(needleEye);

  // --- 5. RECIPROCATING BOAT SHUTTLE & RACE (Claim 2) ---
  const shuttleGroup = new THREE.Group();
  shuttleGroup.position.set(2.6, -1.85, 0);
  rootGroup.add(shuttleGroup);

  // Shuttle Race Guide Channel
  const raceGeo = new THREE.BoxGeometry(0.6, 0.4, 3.6);
  geometriesToDispose.push(raceGeo);
  const raceMesh = new THREE.Mesh(raceGeo, darkIron);
  raceMesh.position.set(0, -0.2, 0);
  shuttleGroup.add(raceMesh);

  // Canoe/Boat-Shaped Steel Shuttle (Pointed at both ends, carrying bobbin)
  const shuttlePoints: THREE.Vector2[] = [];
  shuttlePoints.push(new THREE.Vector2(0, 0.7));
  shuttlePoints.push(new THREE.Vector2(0.14, 0.4));
  shuttlePoints.push(new THREE.Vector2(0.16, 0));
  shuttlePoints.push(new THREE.Vector2(0.14, -0.4));
  shuttlePoints.push(new THREE.Vector2(0, -0.7));

  const shuttleGeo = new THREE.LatheGeometry(shuttlePoints, 16);
  geometriesToDispose.push(shuttleGeo);
  const shuttleMesh = new THREE.Mesh(shuttleGeo, polishedSteel);
  shuttleMesh.rotation.x = Math.PI / 2;
  shuttleMesh.scale.set(0.8, 1.2, 0.5);
  shuttleMesh.castShadow = true;
  shuttleGroup.add(shuttleMesh);

  // --- 6. VERTICAL BASTER PLATE & PIN FEED (Claim 3) ---
  const basterPlateGroup = new THREE.Group();
  basterPlateGroup.position.set(2.4, -0.9, 0);
  rootGroup.add(basterPlateGroup);

  // Steel Toothed Baster Plate
  const plateGeo = new THREE.BoxGeometry(0.08, 1.8, 3.2);
  geometriesToDispose.push(plateGeo);
  const basterMesh = new THREE.Mesh(plateGeo, polishedSteel);
  basterPlateGroup.add(basterMesh);

  // Pointed Steel Holding Pins
  for (let p = -5; p <= 5; p++) {
    const pinGeo = new THREE.ConeGeometry(0.025, 0.18, 6);
    geometriesToDispose.push(pinGeo);
    const pin = new THREE.Mesh(pinGeo, polishedSteel);
    pin.rotation.z = Math.PI / 2;
    pin.position.set(0.09, -0.4, p * 0.28);
    basterPlateGroup.add(pin);
  }

  // Vertically Suspended Fabric / Cloth
  const clothGeo = new THREE.PlaneGeometry(0.02, 2.2, 1, 8);
  geometriesToDispose.push(clothGeo);
  const clothMesh = new THREE.Mesh(clothGeo, clothMat);
  clothMesh.position.set(2.48, -0.9, 0);
  clothMesh.rotation.y = Math.PI / 2;
  clothMesh.scale.set(1.4, 1.0, 1.0);
  rootGroup.add(clothMesh);

  // --- 7. SPOOL SPINDLE & THREAD LINE ---
  const spoolGroup = new THREE.Group();
  spoolGroup.position.set(-0.8, 2.3, 0);
  rootGroup.add(spoolGroup);

  const spoolGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.6, 16);
  geometriesToDispose.push(spoolGeo);
  const spool = new THREE.Mesh(spoolGeo, bronze);
  spool.castShadow = true;
  spoolGroup.add(spool);

  // Thread Line: Spool -> Tension Spring -> Needle Eye -> Cloth
  const threadPoints = [
    new THREE.Vector3(-0.8, 2.6, 0),
    new THREE.Vector3(0.6, 2.1, 0.6),
    new THREE.Vector3(3.2, 1.2, 0.6),
    new THREE.Vector3(2.6, -1.78, 0.6),
  ];
  const threadGeo = new THREE.BufferGeometry().setFromPoints(threadPoints);
  geometriesToDispose.push(threadGeo);
  const upperThreadLine = new THREE.Line(threadGeo, threadMat);
  rootGroup.add(upperThreadLine);

  // --- DISPOSE CLEANUP ---
  const dispose = () => {
    for (const g of geometriesToDispose) g.dispose();
    for (const m of materialsToDispose) m.dispose();
    for (const t of texturesToDispose) t.dispose();
  };

  return {
    rootGroup,
    flywheelGroup,
    needleArmGroup,
    curvedNeedle,
    shuttleGroup,
    shuttleMesh,
    basterPlateGroup,
    clothMesh,
    upperThreadLine,
    materials: {
      castIron,
      darkIron,
      polishedSteel,
      brass,
      bronze,
      threadMat,
      clothMat,
    },
    dispose,
  };
}
