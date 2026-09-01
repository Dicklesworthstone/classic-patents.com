import * as THREE from "three";
import type {
  StackhouseManipulatorControls,
  StackhouseManipulatorTelemetry,
} from "@/physics/stackhouseManipulatorKernel";

export interface StackhouseManipulator3DModel {
  readonly root: THREE.Group;
  readonly forearmGroup: THREE.Group;
  readonly intermediateGroup: THREE.Group;
  readonly toolGroup: THREE.Group;
  readonly toolFlangeMesh: THREE.Mesh;
  readonly toolTipMesh: THREE.Mesh;
  readonly centerMarkerMesh: THREE.Mesh;
  readonly update: (
    telemetry: StackhouseManipulatorTelemetry,
    controls: StackhouseManipulatorControls,
  ) => void;
  readonly dispose: () => void;
}

export function buildStackhouseManipulatorModel(): StackhouseManipulator3DModel {
  const root = new THREE.Group();
  root.name = "Stackhouse3RollManipulatorRoot";

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };

  // Materials
  const forearmMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.35,
      metalness: 0.85,
    }),
  );
  const shaftOuterMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.25,
      metalness: 0.9,
    }),
  );
  const shaftInnerMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.2,
      metalness: 0.95,
    }),
  );
  const gearMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.3,
      metalness: 0.9,
    }),
  );
  const linkMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      roughness: 0.4,
      metalness: 0.7,
    }),
  );
  const toolFlangeMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x9333ea,
      roughness: 0.3,
      metalness: 0.8,
    }),
  );
  const nozzleMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xec4899,
      roughness: 0.2,
      metalness: 0.9,
    }),
  );
  const centerMarkerMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 0.6,
      roughness: 0.1,
    }),
  );

  // 1. Forearm base housing (fixed along Z-axis)
  const forearmGroup = new THREE.Group();
  forearmGroup.name = "ForearmBaseGroup";
  root.add(forearmGroup);

  const forearmGeo = trackGeo(new THREE.CylinderGeometry(0.08, 0.08, 0.35, 32));
  const forearmMesh = new THREE.Mesh(forearmGeo, forearmMat);
  forearmMesh.rotation.x = Math.PI / 2;
  forearmMesh.position.z = -0.22;
  forearmGroup.add(forearmMesh);

  // Concentric outer & inner drive shafts
  const outerShaftGeo = trackGeo(new THREE.CylinderGeometry(0.045, 0.045, 0.25, 24));
  const outerShaftMesh = new THREE.Mesh(outerShaftGeo, shaftOuterMat);
  outerShaftMesh.rotation.x = Math.PI / 2;
  outerShaftMesh.position.z = -0.12;
  forearmGroup.add(outerShaftMesh);

  const innerShaftGeo = trackGeo(new THREE.CylinderGeometry(0.02, 0.02, 0.3, 16));
  const innerShaftMesh = new THREE.Mesh(innerShaftGeo, shaftInnerMat);
  innerShaftMesh.rotation.x = Math.PI / 2;
  innerShaftMesh.position.z = -0.1;
  forearmGroup.add(innerShaftMesh);

  // 2. Oblique intermediate joint group 28 (rotates about Forearm Z by theta1, tilted at 45°)
  const intermediateGroup = new THREE.Group();
  intermediateGroup.name = "IntermediateObliqueGroup";
  root.add(intermediateGroup);

  // First bevel gear pair 38/40
  const gear1Geo = trackGeo(new THREE.ConeGeometry(0.04, 0.03, 20));
  const gear1Mesh = new THREE.Mesh(gear1Geo, gearMat);
  gear1Mesh.rotation.x = -Math.PI / 2;
  gear1Mesh.position.z = -0.02;
  intermediateGroup.add(gear1Mesh);

  // 45° canted intermediate link body
  const linkGeo = trackGeo(new THREE.CylinderGeometry(0.05, 0.055, 0.14, 24));
  const linkMesh = new THREE.Mesh(linkGeo, linkMat);
  linkMesh.rotation.x = Math.PI / 4; // 45° oblique tilt
  linkMesh.position.set(0, 0.05, 0.05);
  intermediateGroup.add(linkMesh);

  // 3. Terminal tool flange group 42 (rotates about Intermediate oblique axis by theta2)
  const toolGroup = new THREE.Group();
  toolGroup.name = "TerminalToolGroup";
  intermediateGroup.add(toolGroup);
  toolGroup.position.set(0, 0.1, 0.1);

  // Second bevel gear set 54/56
  const gear2Geo = trackGeo(new THREE.ConeGeometry(0.035, 0.025, 20));
  const gear2Mesh = new THREE.Mesh(gear2Geo, gearMat);
  gear2Mesh.rotation.x = Math.PI / 4;
  toolGroup.add(gear2Mesh);

  // Terminal tool flange 46
  const toolFlangeGeo = trackGeo(new THREE.CylinderGeometry(0.05, 0.05, 0.02, 32));
  const toolFlangeMesh = new THREE.Mesh(toolFlangeGeo, toolFlangeMat);
  toolFlangeMesh.rotation.x = Math.PI / 2;
  toolGroup.add(toolFlangeMesh);

  // Tool applicator / welding nozzle
  const nozzleGeo = trackGeo(new THREE.ConeGeometry(0.015, 0.12, 16));
  const toolTipMesh = new THREE.Mesh(nozzleGeo, nozzleMat);
  toolTipMesh.rotation.x = -Math.PI / 2;
  toolTipMesh.position.z = 0.08;
  toolGroup.add(toolTipMesh);

  // Common intersection center point 36 marker
  const centerMarkerGeo = trackGeo(new THREE.SphereGeometry(0.012, 16, 16));
  const centerMarkerMesh = new THREE.Mesh(centerMarkerGeo, centerMarkerMat);
  centerMarkerMesh.position.set(0, 0, 0);
  root.add(centerMarkerMesh);

  const update = (
    telemetry: StackhouseManipulatorTelemetry,
    controls: StackhouseManipulatorControls,
  ) => {
    // Forearm roll (theta1)
    intermediateGroup.rotation.z = telemetry.theta1Rad;

    // Intermediate oblique bend (theta2)
    toolGroup.rotation.y = telemetry.theta2Rad;

    // Terminal tool roll / spin (theta3)
    toolFlangeMesh.rotation.z = telemetry.theta3Rad;
    toolTipMesh.rotation.z = telemetry.theta3Rad;

    // Dynamic tool standoff scaling
    const scaleFactor = controls.toolLengthM / 0.2;
    toolTipMesh.scale.set(1, scaleFactor, 1);
    toolTipMesh.position.z = 0.04 + controls.toolLengthM * 0.4;
  };

  const dispose = () => {
    for (const item of geometries) {
      item.dispose();
    }
    for (const item of materials) {
      item.dispose();
    }
  };

  return {
    root,
    forearmGroup,
    intermediateGroup,
    toolGroup,
    toolFlangeMesh,
    toolTipMesh,
    centerMarkerMesh,
    update,
    dispose,
  };
}
