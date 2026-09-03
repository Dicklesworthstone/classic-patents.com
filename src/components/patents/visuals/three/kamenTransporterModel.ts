/**
 * kamenTransporterModel.ts
 *
 * Procedural 3D WebGL model of the Dean Kamen Human Transporter (US 5,701,965 iBOT / Segway).
 * Constructs aluminum chassis, passenger seat, standing mast/handlebar, planetary wheel clusters,
 * hub servomotors, and stair terrain using pure Three.js procedural geometry without external assets.
 */

import * as THREE from "three";
import type {
  KamenTransporterControls,
  KamenTransporterTelemetry,
} from "@/physics/kamenTransporterKernel";
import { KAMEN_TRANSPORTER_SCENARIO_WHEEL_RADIUS_M } from "@/physics/kamenTransporterKernel";

export interface KamenTransporterModel {
  root: THREE.Group;
  chassis: THREE.Group;
  seatGroup: THREE.Group;
  standingMast: THREE.Group;
  leftCluster: THREE.Group;
  rightCluster: THREE.Group;
  leftWheel1: THREE.Mesh;
  leftWheel2: THREE.Mesh;
  rightWheel1: THREE.Mesh;
  rightWheel2: THREE.Mesh;
  stairTerrain: THREE.Group;
  cgMarker: THREE.Mesh;
  pitchVectorLine: THREE.Line;
  dispose: () => void;
}

export function buildKamenTransporterModel(): KamenTransporterModel {
  const root = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];

  // Materials
  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7, // Sky Blue
    metalness: 0.6,
    roughness: 0.3,
  });
  materialsToDispose.push(chassisMat);

  const darkAlumMat = new THREE.MeshStandardMaterial({
    color: 0x334155, // Slate
    metalness: 0.8,
    roughness: 0.4,
  });
  materialsToDispose.push(darkAlumMat);

  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b, // Dark charcoal rubber
    roughness: 0.9,
    metalness: 0.1,
  });
  materialsToDispose.push(tireMat);

  const rimMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8, // Light blue spoke rim
    metalness: 0.7,
    roughness: 0.2,
  });
  materialsToDispose.push(rimMat);

  const accentMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b, // Amber Gold
    metalness: 0.5,
    roughness: 0.3,
  });
  materialsToDispose.push(accentMat);

  const cgMat = new THREE.MeshStandardMaterial({
    color: 0x10b981, // Emerald green
    emissive: 0x047857,
    emissiveIntensity: 0.4,
    roughness: 0.2,
  });
  materialsToDispose.push(cgMat);

  const stairMat = new THREE.MeshStandardMaterial({
    color: 0x78716c, // Stone stair
    roughness: 0.8,
  });
  materialsToDispose.push(stairMat);

  // 1. Central Chassis
  const chassis = new THREE.Group();
  root.add(chassis);

  // Main battery / controller baseboard
  const baseGeom = new THREE.BoxGeometry(0.4, 0.14, 0.46);
  geometriesToDispose.push(baseGeom);
  const baseMesh = new THREE.Mesh(baseGeom, darkAlumMat);
  baseMesh.castShadow = true;
  chassis.add(baseMesh);

  // Central cross axle housing
  const axleGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.62, 24);
  axleGeom.rotateX(Math.PI / 2);
  geometriesToDispose.push(axleGeom);
  const axleMesh = new THREE.Mesh(axleGeom, accentMat);
  chassis.add(axleMesh);

  // 2. Passenger Seat Assembly
  const seatGroup = new THREE.Group();
  chassis.add(seatGroup);

  const seatCushionGeom = new THREE.BoxGeometry(0.38, 0.08, 0.38);
  geometriesToDispose.push(seatCushionGeom);
  const seatCushion = new THREE.Mesh(seatCushionGeom, chassisMat);
  seatCushion.position.set(0, 0.25, 0);
  seatGroup.add(seatCushion);

  const seatBackGeom = new THREE.BoxGeometry(0.06, 0.45, 0.38);
  geometriesToDispose.push(seatBackGeom);
  const seatBack = new THREE.Mesh(seatBackGeom, chassisMat);
  seatBack.position.set(-0.16, 0.5, 0);
  seatGroup.add(seatBack);

  // 3. Standing Mast / Handlebar (Segway mode)
  const standingMast = new THREE.Group();
  chassis.add(standingMast);

  const mastGeom = new THREE.CylinderGeometry(0.02, 0.025, 0.95, 16);
  geometriesToDispose.push(mastGeom);
  const mastMesh = new THREE.Mesh(mastGeom, darkAlumMat);
  mastMesh.position.set(0.12, 0.52, 0);
  standingMast.add(mastMesh);

  const handleBarGeom = new THREE.CylinderGeometry(0.018, 0.018, 0.45, 16);
  handleBarGeom.rotateX(Math.PI / 2);
  geometriesToDispose.push(handleBarGeom);
  const handleBarMesh = new THREE.Mesh(handleBarGeom, accentMat);
  handleBarMesh.position.set(0.12, 1.0, 0);
  standingMast.add(handleBarMesh);

  // 4. Center of Gravity Marker
  const cgGeom = new THREE.SphereGeometry(0.04, 16, 16);
  geometriesToDispose.push(cgGeom);
  const cgMarker = new THREE.Mesh(cgGeom, cgMat);
  cgMarker.position.set(0, 0.85, 0);
  chassis.add(cgMarker);

  // 5. Inverted Pendulum Vector Line
  const lineGeom = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0.85, 0),
  ]);
  geometriesToDispose.push(lineGeom);
  const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });
  materialsToDispose.push(lineMat);
  const pitchVectorLine = new THREE.Line(lineGeom, lineMat);
  chassis.add(pitchVectorLine);

  // Helper function to build a planetary wheel cluster
  function createClusterGroup(sideZ: number) {
    const cluster = new THREE.Group();
    cluster.position.set(0, 0, sideZ);
    root.add(cluster);

    // Planetary carrier arm
    const armGeom = new THREE.BoxGeometry(0.36, 0.04, 0.03);
    geometriesToDispose.push(armGeom);
    const armMesh = new THREE.Mesh(armGeom, darkAlumMat);
    cluster.add(armMesh);

    // Central cluster pivot cap
    const capGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.05, 16);
    capGeom.rotateX(Math.PI / 2);
    geometriesToDispose.push(capGeom);
    const capMesh = new THREE.Mesh(capGeom, accentMat);
    cluster.add(capMesh);

    // Wheel 1
    const tireTubeRadius = 0.04;
    const tireGeom = new THREE.TorusGeometry(
      KAMEN_TRANSPORTER_SCENARIO_WHEEL_RADIUS_M - tireTubeRadius,
      tireTubeRadius,
      16,
      24,
    );
    geometriesToDispose.push(tireGeom);
    const wheel1 = new THREE.Mesh(tireGeom, tireMat);
    wheel1.position.set(-0.18, 0, 0);
    wheel1.castShadow = true;
    cluster.add(wheel1);

    const rimGeom = new THREE.CylinderGeometry(0.09, 0.09, 0.04, 16);
    rimGeom.rotateX(Math.PI / 2);
    geometriesToDispose.push(rimGeom);
    const rim1 = new THREE.Mesh(rimGeom, rimMat);
    wheel1.add(rim1);

    // Wheel 2
    const wheel2 = new THREE.Mesh(tireGeom, tireMat);
    wheel2.position.set(0.18, 0, 0);
    wheel2.castShadow = true;
    cluster.add(wheel2);

    const rim2 = new THREE.Mesh(rimGeom, rimMat);
    wheel2.add(rim2);

    return { cluster, wheel1, wheel2 };
  }

  const left = createClusterGroup(0.32);
  const right = createClusterGroup(-0.32);

  // 6. Procedural Stair Terrain
  const stairTerrain = new THREE.Group();
  stairTerrain.position.set(1.2, -0.15, 0);
  root.add(stairTerrain);

  for (let i = 0; i < 4; i++) {
    const stepGeom = new THREE.BoxGeometry(0.35, 0.16 * (i + 1), 1.2);
    geometriesToDispose.push(stepGeom);
    const stepMesh = new THREE.Mesh(stepGeom, stairMat);
    stepMesh.position.set(i * 0.32, (0.16 * (i + 1)) / 2, 0);
    stepMesh.receiveShadow = true;
    stairTerrain.add(stepMesh);
  }

  return {
    root,
    chassis,
    seatGroup,
    standingMast,
    leftCluster: left.cluster,
    rightCluster: right.cluster,
    leftWheel1: left.wheel1,
    leftWheel2: left.wheel2,
    rightWheel1: right.wheel1,
    rightWheel2: right.wheel2,
    stairTerrain,
    cgMarker,
    pitchVectorLine,
    dispose: () => {
      materialsToDispose.forEach((m) => {
        m.dispose();
      });
      geometriesToDispose.forEach((g) => {
        g.dispose();
      });
    },
  };
}

export function updateKamenTransporterKinematics(
  model: KamenTransporterModel,
  controls: KamenTransporterControls,
  tel: KamenTransporterTelemetry,
  wheelRollAngleRad: number,
) {
  // 1. Chassis Pitch Orientation (Inverted Pendulum Tilt)
  const pitchRad = tel.pitchAngleRad;
  model.chassis.rotation.z = -pitchRad;

  // 2. Mode-dependent chassis elevation and seat visibility
  const isBalanceMode = controls.operatingMode === "balance_2wheel";
  const isStairMode = controls.operatingMode === "stair_climb";

  let elevationY = 0.0;
  if (isBalanceMode) {
    elevationY = 0.28;
    model.seatGroup.visible = true;
    model.standingMast.visible = true;
    model.stairTerrain.visible = false;
  } else if (isStairMode) {
    elevationY = 0.22;
    model.seatGroup.visible = true;
    model.standingMast.visible = false;
    model.stairTerrain.visible = true;
  } else {
    // 4-wheel standard mode
    elevationY = 0.0;
    model.seatGroup.visible = true;
    model.standingMast.visible = false;
    model.stairTerrain.visible = false;
  }

  model.chassis.position.y = elevationY;
  model.leftCluster.position.y = elevationY;
  model.rightCluster.position.y = elevationY;

  // 3. Cluster Rotation Kinematics
  const clusterRad = (tel.clusterAngleDeg * Math.PI) / 180;
  model.leftCluster.rotation.z = clusterRad;
  model.rightCluster.rotation.z = clusterRad;

  // 4. The fixed-step physics kernel owns the integrated rolling phase. The
  // model is a projection and must not multiply by speed or time a second time.
  model.leftWheel1.rotation.z = -wheelRollAngleRad;
  model.leftWheel2.rotation.z = -wheelRollAngleRad;
  model.rightWheel1.rotation.z = -wheelRollAngleRad;
  model.rightWheel2.rotation.z = -wheelRollAngleRad;

  // 5. Center of Gravity Marker Color Feedback
  const cgMat = model.cgMarker.material as THREE.MeshStandardMaterial;
  if (tel.pitchRefusal) {
    cgMat.color.setHex(0xef4444); // Red on refusal / fall
    cgMat.emissive.setHex(0xb91c1c);
  } else if (tel.isBalancing) {
    cgMat.color.setHex(0x10b981); // Emerald on active balance
    cgMat.emissive.setHex(0x047857);
  } else {
    cgMat.color.setHex(0x0284c7); // Blue in 4-wheel standard
    cgMat.emissive.setHex(0x0369a1);
  }
}
