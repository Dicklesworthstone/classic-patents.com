/**
 * Source-bounded procedural model for Robert H. Goddard's US 1,102,653.
 *
 * The facsimile supplies arrangements and element numbers, but no absolute
 * dimensions. Geometry is therefore normalized to the primary chamber
 * diameter. Claim 2's `L >= 3D` is the only patent-stated dimension and is the
 * only ratio presented as source fact. Every load-bearing or kinematic
 * interface below is represented by touching/intersecting geometry.
 */

import * as THREE from "three";
import { createLcg } from "@/utils/lcg";
import { createGlowPointTexture } from "./ThreeStudioScene";

export const GODDARD_1914_SOURCE_GEOMETRY = {
  normalizedPrimaryChamberDiameter: 1.6,
  primaryChamberHeight: 2.8,
  primaryTubeLongestDiameter: 0.9,
  claim2MinimumTubeLengthRatio: 3,
  auxiliaryScale: 0.46,
  sourceBasis:
    "US 1,102,653 Figs. 1–5; absolute dimensions are not printed, so non-claim dimensions are normalized display proportions.",
} as const;

export interface GoddardApparatusVisualState {
  elapsedSeconds: number;
  primaryQuaternion: readonly [number, number, number, number];
  gyroQuaternion: readonly [number, number, number, number];
  tubeLengthRatio: number;
  auxiliaryReleaseFraction: number;
  primaryChargeSubstantiallyConsumed: boolean;
  claim1SequenceSatisfied: boolean;
  claim2Satisfied: boolean;
  gyroEnabled: boolean;
  gyroOperational: boolean;
  claim1Present: boolean;
  claim3Present: boolean;
  claim7Present: boolean;
  showEfflux: boolean;
  showCalloutPins: boolean;
  isCutaway: boolean;
}

export interface GoddardSourceInterface {
  id: string;
  elementNumbers: string;
  a: THREE.Object3D;
  b: THREE.Object3D;
}

export interface Goddard1914ApparatusModel {
  root: THREE.Group;
  launchFrame: THREE.Group;
  primaryRotor: THREE.Group;
  primaryChamber: THREE.Mesh;
  primaryTube: THREE.Mesh;
  firingTube: THREE.Mesh;
  auxiliaryRocket: THREE.Group;
  auxiliaryTube: THREE.Mesh;
  auxiliaryChamber: THREE.Mesh;
  apparatusHead: THREE.Mesh;
  cameraSupport: THREE.Group;
  gyroAssembly: THREE.Group;
  gyroRotor: THREE.Mesh;
  primarySpinPassages: THREE.Group;
  auxiliarySpinPassages: THREE.Group;
  primaryPlume: THREE.Points;
  auxiliaryPlume: THREE.Points;
  calloutPins: readonly THREE.Group[];
  sequenceBand: THREE.Mesh;
  materials: {
    shell: THREE.MeshStandardMaterial;
    tube: THREE.MeshStandardMaterial;
    invalid: THREE.MeshStandardMaterial;
    charge: THREE.MeshStandardMaterial;
  };
  sourceInterfaces: readonly GoddardSourceInterface[];
  lastTubeLengthRatio: number;
  dispose: () => void;
}

function namedMesh(
  name: string,
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
): THREE.Mesh {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function beamBetween(
  name: string,
  start: THREE.Vector3,
  end: THREE.Vector3,
  radius: number,
  material: THREE.Material,
): THREE.Mesh {
  const direction = end.clone().sub(start);
  const beam = namedMesh(
    name,
    new THREE.CylinderGeometry(radius, radius, direction.length(), 12),
    material,
  );
  beam.position.copy(start).add(end).multiplyScalar(0.5);
  beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  return beam;
}

function curvedSpinPassage(
  name: string,
  angle: number,
  radius: number,
  y: number,
  material: THREE.Material,
): THREE.Mesh {
  const radial = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
  const tangent = new THREE.Vector3(-Math.sin(angle), 0, Math.cos(angle));
  const curve = new THREE.CatmullRomCurve3([
    radial
      .clone()
      .multiplyScalar(radius * 0.68)
      .setY(y),
    radial
      .clone()
      .multiplyScalar(radius * 0.88)
      .add(tangent.clone().multiplyScalar(0.08))
      .setY(y),
    radial.clone().multiplyScalar(radius).add(tangent.multiplyScalar(0.24)).setY(y),
  ]);
  return namedMesh(name, new THREE.TubeGeometry(curve, 18, 0.075, 10, false), material);
}

function createEfflux(
  name: string,
  count: number,
  seed: number,
  material: THREE.PointsMaterial,
): THREE.Points {
  const random = createLcg(seed);
  const positions = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  for (let index = 0; index < count; index++) {
    const offset = index * 3;
    positions[offset] = (random() - 0.5) * 0.2;
    positions[offset + 1] = -random() * 2;
    positions[offset + 2] = (random() - 0.5) * 0.2;
    phases[index] = random();
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("phase", new THREE.BufferAttribute(phases, 1));
  const points = new THREE.Points(geometry, material);
  points.name = name;
  points.userData.connectivityRole = "free-efflux";
  return points;
}

function updateEfflux(points: THREE.Points, elapsedSeconds: number, length: number): void {
  const position = points.geometry.getAttribute("position") as THREE.BufferAttribute;
  const phase = points.geometry.getAttribute("phase") as THREE.BufferAttribute;
  for (let index = 0; index < position.count; index++) {
    const progress = (phase.getX(index) + elapsedSeconds * 0.65) % 1;
    const spread = 0.08 + progress * 0.34;
    const azimuth = index * 2.399963229728653;
    position.setXYZ(
      index,
      Math.cos(azimuth) * spread,
      -progress * length,
      Math.sin(azimuth) * spread,
    );
  }
  position.needsUpdate = true;
}

function setQuaternionFromWxyz(
  target: THREE.Quaternion,
  [w, x, y, z]: readonly [number, number, number, number],
): void {
  target.set(x, y, z, w).normalize();
}

export function buildGoddard1914ApparatusModel(): Goddard1914ApparatusModel {
  const root = new THREE.Group();
  root.name = "US-1102653-connected-apparatus";

  const shellMaterial = new THREE.MeshStandardMaterial({
    color: 0xb9a77a,
    roughness: 0.48,
    metalness: 0.55,
    transparent: true,
  });
  const darkSteelMaterial = new THREE.MeshStandardMaterial({
    color: 0x303b46,
    roughness: 0.38,
    metalness: 0.82,
  });
  const tubeMaterial = new THREE.MeshStandardMaterial({
    color: 0x9a6c3b,
    roughness: 0.4,
    metalness: 0.72,
  });
  const invalidMaterial = new THREE.MeshStandardMaterial({
    color: 0xb91c1c,
    roughness: 0.42,
    metalness: 0.35,
  });
  const chargeMaterial = new THREE.MeshStandardMaterial({
    color: 0x6b2d24,
    roughness: 0.86,
    metalness: 0,
    transparent: true,
  });
  const copperMaterial = new THREE.MeshStandardMaterial({
    color: 0xb87333,
    roughness: 0.3,
    metalness: 0.86,
  });
  const cameraMaterial = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.35,
    metalness: 0.65,
  });
  const pinMaterial = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
  const glowTexture = createGlowPointTexture();
  const effluxMaterial = new THREE.PointsMaterial({
    size: 0.2,
    map: glowTexture,
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.78,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  // Fig. 5: the frame is a real support path from floor rails to bearings 22/23.
  const launchFrame = new THREE.Group();
  launchFrame.name = "21 vertical framework";
  root.add(launchFrame);
  const floorY = -7.45;
  const floorRail = namedMesh(
    "21 floor rail",
    new THREE.BoxGeometry(5.2, 0.24, 1.2),
    darkSteelMaterial,
  );
  floorRail.position.y = floorY;
  launchFrame.add(floorRail);
  for (const side of [-1, 1]) {
    launchFrame.add(
      beamBetween(
        `21 frame upright ${side}`,
        new THREE.Vector3(side * 2.25, floorY + 0.08, 0),
        new THREE.Vector3(side * 1.15, 1.38, 0),
        0.1,
        darkSteelMaterial,
      ),
    );
  }

  const lowerBearing = namedMesh(
    "22 lower ball-bearing race",
    new THREE.TorusGeometry(0.84, 0.085, 12, 42),
    copperMaterial,
  );
  lowerBearing.rotation.x = Math.PI / 2;
  lowerBearing.position.y = -1.52;
  launchFrame.add(lowerBearing);
  const upperBearing = namedMesh(
    "23 upper ball-bearing race",
    new THREE.TorusGeometry(0.84, 0.085, 12, 42),
    copperMaterial,
  );
  upperBearing.rotation.x = Math.PI / 2;
  upperBearing.position.y = 0.82;
  launchFrame.add(upperBearing);
  for (const side of [-1, 1]) {
    launchFrame.add(
      beamBetween(
        `21-to-22 brace ${side}`,
        new THREE.Vector3(side * 1.82, -1.52, 0),
        new THREE.Vector3(side * 0.88, -1.52, 0),
        0.085,
        darkSteelMaterial,
      ),
      beamBetween(
        `21-to-23 brace ${side}`,
        new THREE.Vector3(side * 1.25, 0.82, 0),
        new THREE.Vector3(side * 0.88, 0.82, 0),
        0.085,
        darkSteelMaterial,
      ),
    );
  }

  const primaryRotor = new THREE.Group();
  primaryRotor.name = "primary rocket rotating in bearings 22/23";
  root.add(primaryRotor);

  const primaryChamber = namedMesh(
    "10 primary combustion chamber",
    new THREE.CylinderGeometry(0.8, 0.8, GODDARD_1914_SOURCE_GEOMETRY.primaryChamberHeight, 48),
    shellMaterial,
  );
  primaryChamber.position.y = -0.55;
  primaryRotor.add(primaryChamber);

  const upperCasting = namedMesh(
    "13 upper casting",
    new THREE.CylinderGeometry(0.88, 0.84, 0.34, 48),
    tubeMaterial,
  );
  upperCasting.position.y = 1.02;
  primaryRotor.add(upperCasting);
  const lowerCasting = namedMesh(
    "13 lower casting",
    new THREE.CylinderGeometry(0.84, 0.78, 0.28, 48),
    tubeMaterial,
  );
  lowerCasting.position.y = -2.08;
  primaryRotor.add(lowerCasting);

  const primaryTube = namedMesh(
    "11 elongated tapered tube",
    new THREE.CylinderGeometry(0.36, 0.45, 4.05, 48, 1, true),
    tubeMaterial,
  );
  primaryTube.position.y = -4.245;
  primaryRotor.add(primaryTube);

  const primaryDisks = new THREE.Group();
  primaryDisks.name = "12 progressive explosive disks";
  for (let disk = 0; disk < 6; disk++) {
    const charge = namedMesh(
      `12 primary charge disk ${disk + 1}`,
      new THREE.CylinderGeometry(0.67, 0.67, 0.34, 32),
      chargeMaterial,
    );
    charge.position.y = -1.54 + disk * 0.4;
    primaryDisks.add(charge);
  }
  primaryRotor.add(primaryDisks);

  const primarySpinPassages = new THREE.Group();
  primarySpinPassages.name = "15/16/17 primary transverse spin-charge system";
  for (let passage = 0; passage < 4; passage++) {
    primarySpinPassages.add(
      curvedSpinPassage(
        `15 curved primary spin tube ${passage + 1}`,
        (passage * Math.PI) / 2,
        1.06,
        1.03,
        copperMaterial,
      ),
    );
  }
  primaryRotor.add(primarySpinPassages);

  const firingTube = namedMesh(
    "24 auxiliary firing tube",
    new THREE.CylinderGeometry(0.46, 0.46, 2.3, 40, 1, true),
    tubeMaterial,
  );
  firingTube.position.y = 2.33;
  primaryRotor.add(firingTube);

  const auxiliaryRocket = new THREE.Group();
  auxiliaryRocket.name = "25-45 nested auxiliary rocket and instrument head";
  auxiliaryRocket.position.y = 2.62;
  primaryRotor.add(auxiliaryRocket);

  const auxiliaryTube = namedMesh(
    "26 auxiliary tapered tube",
    new THREE.CylinderGeometry(0.13, 0.2, 1.22, 32, 1, true),
    copperMaterial,
  );
  auxiliaryTube.position.y = -0.94;
  auxiliaryRocket.add(auxiliaryTube);
  const auxiliaryChamber = namedMesh(
    "25 auxiliary combustion chamber",
    new THREE.CylinderGeometry(0.36, 0.36, 1.08, 36),
    shellMaterial,
  );
  auxiliaryChamber.position.y = 0.19;
  auxiliaryRocket.add(auxiliaryChamber);
  for (let disk = 0; disk < 3; disk++) {
    const charge = namedMesh(
      `27 auxiliary charge disk ${disk + 1}`,
      new THREE.CylinderGeometry(0.29, 0.29, 0.23, 24),
      chargeMaterial,
    );
    charge.position.y = -0.08 + disk * 0.27;
    auxiliaryRocket.add(charge);
  }

  const apparatusHead = namedMesh(
    "29 apparatus head",
    new THREE.CylinderGeometry(0.56, 0.43, 0.92, 40, 1, true),
    shellMaterial,
  );
  apparatusHead.position.y = 1.19;
  auxiliaryRocket.add(apparatusHead);
  const headCap = namedMesh(
    "29 head cap",
    new THREE.SphereGeometry(0.56, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    shellMaterial,
  );
  headCap.position.y = 1.65;
  auxiliaryRocket.add(headCap);

  const auxiliarySpinPassages = new THREE.Group();
  auxiliarySpinPassages.name = "30/31/32 auxiliary spin-restoration system";
  for (let passage = 0; passage < 4; passage++) {
    auxiliarySpinPassages.add(
      curvedSpinPassage(
        `30 curved auxiliary spin tube ${passage + 1}`,
        (passage * Math.PI) / 2,
        0.62,
        0.72,
        copperMaterial,
      ),
    );
  }
  auxiliaryRocket.add(auxiliarySpinPassages);

  const sequenceBand = namedMesh(
    "28 source-sequence fuse band",
    new THREE.TorusGeometry(0.4, 0.035, 8, 30),
    copperMaterial,
  );
  sequenceBand.rotation.x = Math.PI / 2;
  sequenceBand.position.y = -0.32;
  auxiliaryRocket.add(sequenceBand);

  // Fig. 2: the camera support pivots on a real axle; the gyro is carried by it.
  const cameraSupport = new THREE.Group();
  cameraSupport.name = "33 pivoted camera support";
  cameraSupport.position.y = 1.25;
  auxiliaryRocket.add(cameraSupport);
  const supportCrossbar = namedMesh(
    "33 camera support crossbar",
    new THREE.BoxGeometry(0.72, 0.08, 0.16),
    darkSteelMaterial,
  );
  cameraSupport.add(supportCrossbar);
  const pivotAxle = namedMesh(
    "33/38 support pivot axle",
    new THREE.CylinderGeometry(0.055, 0.055, 1.08, 18),
    darkSteelMaterial,
  );
  pivotAxle.rotation.x = Math.PI / 2;
  cameraSupport.add(pivotAxle);
  const camera = namedMesh(
    "34 recording camera",
    new THREE.BoxGeometry(0.3, 0.28, 0.34),
    cameraMaterial,
  );
  camera.position.set(0.18, 0.18, 0);
  cameraSupport.add(camera);

  const gyroAssembly = new THREE.Group();
  gyroAssembly.name = "37-40 gyroscope and induction-motor assembly";
  cameraSupport.add(gyroAssembly);
  const gyroAxle = namedMesh(
    "38 gyroscope bearings and axle",
    new THREE.CylinderGeometry(0.045, 0.045, 0.64, 18),
    darkSteelMaterial,
  );
  gyroAxle.rotation.z = Math.PI / 2;
  gyroAxle.position.set(-0.12, -0.18, 0);
  gyroAssembly.add(gyroAxle);
  const gyroRotor = namedMesh(
    "37 gyroscope rotor",
    new THREE.CylinderGeometry(0.23, 0.23, 0.12, 36),
    copperMaterial,
  );
  gyroRotor.geometry.rotateZ(Math.PI / 2);
  gyroRotor.position.copy(gyroAxle.position);
  gyroAssembly.add(gyroRotor);
  for (const x of [-0.32, 0.08]) {
    const coil = namedMesh(
      `39 induction field coil ${x}`,
      new THREE.TorusGeometry(0.28, 0.035, 10, 28),
      copperMaterial,
    );
    coil.rotation.y = Math.PI / 2;
    coil.position.set(x, -0.18, 0);
    gyroAssembly.add(coil);
  }

  const primaryPlume = createEfflux("11 combustion-product efflux", 90, 1102653, effluxMaterial);
  primaryPlume.position.y = -6.28;
  primaryRotor.add(primaryPlume);
  const auxiliaryPlume = createEfflux(
    "26 auxiliary combustion-product efflux",
    48,
    1102654,
    effluxMaterial,
  );
  auxiliaryPlume.position.y = -1.55;
  auxiliaryRocket.add(auxiliaryPlume);

  const calloutPins: THREE.Group[] = [];
  const addCalloutPin = (
    name: string,
    anchor: THREE.Vector3,
    end: THREE.Vector3,
    parent: THREE.Object3D,
  ) => {
    const callout = new THREE.Group();
    callout.name = name;
    callout.userData.connectivityRole = "tethered-annotation";
    const leader = beamBetween(`${name} leader`, anchor, end, 0.018, pinMaterial);
    leader.castShadow = false;
    leader.receiveShadow = false;
    const pin = namedMesh(`${name} marker`, new THREE.SphereGeometry(0.08, 14, 10), pinMaterial);
    pin.castShadow = false;
    pin.receiveShadow = false;
    pin.position.copy(end);
    callout.add(leader, pin);
    parent.add(callout);
    calloutPins.push(callout);
  };
  addCalloutPin(
    "pin 10",
    new THREE.Vector3(0.78, -0.55, 0),
    new THREE.Vector3(1.08, -0.55, 0.12),
    primaryRotor,
  );
  addCalloutPin(
    "pin 11",
    new THREE.Vector3(0.43, -3.5, 0),
    new THREE.Vector3(0.78, -3.5, 0.12),
    primaryRotor,
  );
  addCalloutPin(
    "pin 21",
    new THREE.Vector3(1.7, -3, 0),
    new THREE.Vector3(2.08, -3, 0.12),
    launchFrame,
  );
  addCalloutPin(
    "pin 24",
    new THREE.Vector3(0.44, 2.35, 0),
    new THREE.Vector3(0.78, 2.35, 0.12),
    primaryRotor,
  );
  addCalloutPin(
    "pin 29",
    new THREE.Vector3(0.52, 1.19, 0),
    new THREE.Vector3(0.84, 1.19, 0.12),
    auxiliaryRocket,
  );
  addCalloutPin(
    "pin 37",
    new THREE.Vector3(-0.12, -0.18, 0.22),
    new THREE.Vector3(-0.12, -0.18, 0.56),
    cameraSupport,
  );

  const sourceInterfaces: GoddardSourceInterface[] = [
    {
      id: "primary-chamber-to-casting",
      elementNumbers: "10 ↔ 13",
      a: primaryChamber,
      b: lowerCasting,
    },
    { id: "casting-to-tapered-tube", elementNumbers: "13 ↔ 11", a: lowerCasting, b: primaryTube },
    { id: "primary-to-firing-tube", elementNumbers: "13 ↔ 24", a: upperCasting, b: firingTube },
    {
      id: "nested-auxiliary-in-firing-tube",
      elementNumbers: "24 ↔ 26",
      a: firingTube,
      b: auxiliaryTube,
    },
    {
      id: "auxiliary-tube-to-chamber",
      elementNumbers: "26 ↔ 25",
      a: auxiliaryTube,
      b: auxiliaryChamber,
    },
    {
      id: "auxiliary-chamber-to-head",
      elementNumbers: "25 ↔ 29",
      a: auxiliaryChamber,
      b: apparatusHead,
    },
    { id: "head-to-pivoted-support", elementNumbers: "29 ↔ 33/38", a: apparatusHead, b: pivotAxle },
    { id: "support-to-gyro", elementNumbers: "33/38 ↔ 37", a: gyroAxle, b: gyroRotor },
    {
      id: "lower-bearing-to-primary",
      elementNumbers: "22 ↔ 10",
      a: lowerBearing,
      b: primaryChamber,
    },
    { id: "upper-bearing-to-primary", elementNumbers: "23 ↔ 13", a: upperBearing, b: upperCasting },
    {
      id: "primary-spin-passages-to-casting",
      elementNumbers: "15 ↔ 13",
      a: primarySpinPassages,
      b: upperCasting,
    },
    {
      id: "aux-spin-passages-to-head",
      elementNumbers: "30 ↔ 29",
      a: auxiliarySpinPassages,
      b: apparatusHead,
    },
  ];

  const model: Goddard1914ApparatusModel = {
    root,
    launchFrame,
    primaryRotor,
    primaryChamber,
    primaryTube,
    firingTube,
    auxiliaryRocket,
    auxiliaryTube,
    auxiliaryChamber,
    apparatusHead,
    cameraSupport,
    gyroAssembly,
    gyroRotor,
    primarySpinPassages,
    auxiliarySpinPassages,
    primaryPlume,
    auxiliaryPlume,
    calloutPins,
    sequenceBand,
    materials: {
      shell: shellMaterial,
      tube: tubeMaterial,
      invalid: invalidMaterial,
      charge: chargeMaterial,
    },
    sourceInterfaces,
    lastTubeLengthRatio: 4.5,
    dispose: () => {
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      root.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          geometries.add(object.geometry);
          const objectMaterials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          for (const material of objectMaterials) materials.add(material);
        }
      });
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
      glowTexture.dispose();
    },
  };

  return model;
}

export function updateGoddard1914ApparatusKinematics(
  model: Goddard1914ApparatusModel,
  state: GoddardApparatusVisualState,
): void {
  setQuaternionFromWxyz(model.primaryRotor.quaternion, state.primaryQuaternion);

  if (Math.abs(state.tubeLengthRatio - model.lastTubeLengthRatio) > 1e-6) {
    model.lastTubeLengthRatio = state.tubeLengthRatio;
    const length = GODDARD_1914_SOURCE_GEOMETRY.primaryTubeLongestDiameter * state.tubeLengthRatio;
    model.primaryTube.geometry.dispose();
    model.primaryTube.geometry = new THREE.CylinderGeometry(0.36, 0.45, length, 48, 1, true);
    model.primaryTube.position.y = -2.22 - length / 2;
    model.primaryPlume.position.y = -2.22 - length;
  }

  model.primaryTube.material = state.claim2Satisfied
    ? model.materials.tube
    : model.materials.invalid;
  model.sequenceBand.material = state.claim1SequenceSatisfied
    ? model.materials.tube
    : model.materials.invalid;

  // The auxiliary remains nested until the source sequence legitimately fires it.
  model.auxiliaryRocket.visible = state.claim1Present;
  model.auxiliaryRocket.position.y = 2.62 + state.auxiliaryReleaseFraction * 5.4;
  model.primarySpinPassages.visible = state.claim3Present;
  model.auxiliarySpinPassages.visible = state.claim3Present;

  if (state.gyroOperational && state.claim7Present) {
    model.cameraSupport.quaternion.copy(model.primaryRotor.quaternion).invert();
  } else {
    model.cameraSupport.quaternion.identity();
  }
  setQuaternionFromWxyz(model.gyroRotor.quaternion, state.gyroQuaternion);
  model.gyroAssembly.visible = state.gyroEnabled && state.claim7Present;

  model.materials.shell.opacity = state.isCutaway ? 0.22 : 1;
  model.materials.shell.depthWrite = !state.isCutaway;
  model.materials.charge.opacity = state.primaryChargeSubstantiallyConsumed ? 0.24 : 1;
  const charges = model.root.getObjectByName("12 progressive explosive disks");
  if (charges) charges.visible = state.isCutaway;

  model.primaryPlume.visible =
    state.showEfflux && !state.primaryChargeSubstantiallyConsumed && state.claim2Satisfied;
  model.auxiliaryPlume.visible =
    state.showEfflux && state.auxiliaryReleaseFraction > 0 && state.claim1SequenceSatisfied;
  updateEfflux(model.primaryPlume, state.elapsedSeconds, 2.4);
  updateEfflux(model.auxiliaryPlume, state.elapsedSeconds * 1.2, 1.5);
  for (const callout of model.calloutPins) callout.visible = state.showCalloutPins;
}
