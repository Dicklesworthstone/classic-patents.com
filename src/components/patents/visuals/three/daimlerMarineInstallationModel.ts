/**
 * Connected source-bounded model of Daimler's US 361,931 marine installation.
 *
 * The facsimile prints topology and named members but no dimensions. Geometry
 * is normalized to the motor casing. The only moving coordinate is the
 * propeller shaft's source-stated longitudinal freedom; the display travel is
 * explicitly normalized and is never presented as metres.
 */

import * as THREE from "three";

export const DAIMLER_MARINE_SOURCE_GEOMETRY = {
  normalizedMotorCasingLength: 1.8,
  normalizedShaftDisplayTravel: 0.22,
  sourceBasis:
    "US 361,931 Figs. 1–6; all display dimensions are normalized because the grant prints no absolute dimensions.",
} as const;

export interface DaimlerMarineVisualState {
  shaftTranslationAlongAxisNormalized: number;
  motorRotationSign: number;
  propellerRotationSign: number;
  aheadCouplingEngaged: boolean;
  asternGearingEngaged: boolean;
  neutral: boolean;
  thrustCanMaintainAheadContact: boolean;
  passiveForeAftCoolingPathPresent: boolean;
  coolingPumpActive: boolean;
  illustrativePhaseRad: number;
}

export interface DaimlerSourceInterface {
  id: string;
  elementNumbers: string;
  a: THREE.Object3D;
  b: THREE.Object3D;
}

export interface DaimlerMarineInstallationModel {
  rootGroup: THREE.Group;
  hullGroup: THREE.Group;
  motorGroup: THREE.Group;
  fixedDriveGroup: THREE.Group;
  propellerShaftGroup: THREE.Group;
  propellerRotor: THREE.Group;
  couplingGroup: THREE.Group;
  reverseGroup: THREE.Group;
  thrustGroup: THREE.Group;
  steeringGroup: THREE.Group;
  coolingGroup: THREE.Group;
  reservoirGroup: THREE.Group;
  movingAheadCoupling: THREE.Mesh;
  fixedAheadCoupling: THREE.Mesh;
  reverseRollers: readonly [THREE.Mesh, THREE.Mesh];
  reverseLevers: readonly [THREE.Mesh, THREE.Mesh];
  pumpImpeller: THREE.Mesh;
  passiveCoolingPipes: readonly [THREE.Mesh, THREE.Mesh];
  sourceInterfaces: readonly DaimlerSourceInterface[];
  materials: {
    engaged: THREE.MeshStandardMaterial;
    open: THREE.MeshStandardMaterial;
    copper: THREE.MeshStandardMaterial;
    waterActive: THREE.MeshStandardMaterial;
    waterPassive: THREE.MeshStandardMaterial;
  };
  dispose: () => void;
}

function namedMesh(
  name: string,
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
): THREE.Mesh {
  const result = new THREE.Mesh(geometry, material);
  result.name = name;
  result.castShadow = true;
  result.receiveShadow = true;
  return result;
}

function placeBeam(beam: THREE.Mesh, start: THREE.Vector3, end: THREE.Vector3): void {
  const direction = end.clone().sub(start);
  beam.position.copy(start).add(end).multiplyScalar(0.5);
  beam.scale.set(1, direction.length(), 1);
  beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
}

function createBeam(
  name: string,
  start: THREE.Vector3,
  end: THREE.Vector3,
  radius: number,
  material: THREE.Material,
): THREE.Mesh {
  const result = namedMesh(name, new THREE.CylinderGeometry(radius, radius, 1, 14), material);
  placeBeam(result, start, end);
  return result;
}

function createPipe(
  name: string,
  points: readonly THREE.Vector3[],
  radius: number,
  material: THREE.Material,
): THREE.Mesh {
  const curve = new THREE.CatmullRomCurve3([...points], false, "centripetal");
  return namedMesh(name, new THREE.TubeGeometry(curve, 48, radius, 12, false), material);
}

function cylinderAlongX(
  name: string,
  radius: number,
  length: number,
  material: THREE.Material,
): THREE.Mesh {
  const result = namedMesh(name, new THREE.CylinderGeometry(radius, radius, length, 32), material);
  result.rotation.z = Math.PI / 2;
  return result;
}

export function buildDaimlerMarineInstallationModel(): DaimlerMarineInstallationModel {
  const rootGroup = new THREE.Group();
  rootGroup.name = "US-361931-connected-marine-installation";

  const hullGroup = new THREE.Group();
  hullGroup.name = "vessel hull and foundation";
  const motorGroup = new THREE.Group();
  motorGroup.name = "A gas or petroleum motor";
  const fixedDriveGroup = new THREE.Group();
  fixedDriveGroup.name = "fixed one-direction motor shaft and coupling a";
  fixedDriveGroup.position.y = -0.15;
  const propellerShaftGroup = new THREE.Group();
  propellerShaftGroup.name = "b longitudinally movable propeller shaft";
  propellerShaftGroup.position.y = -0.15;
  const propellerRotor = new THREE.Group();
  propellerRotor.name = "d screw propeller rotor";
  propellerRotor.position.x = 4.92;
  propellerShaftGroup.add(propellerRotor);
  const couplingGroup = new THREE.Group();
  couplingGroup.name = "a and a2 ahead friction coupling";
  const reverseGroup = new THREE.Group();
  reverseGroup.name = "c e1 e2 f1 f2 astern train";
  const thrustGroup = new THREE.Group();
  thrustGroup.name = "q r1 r2 r3 thrust bearing and starter";
  const steeringGroup = new THREE.Group();
  steeringGroup.name = "m n o1 o2 o3 steering linkage";
  const coolingGroup = new THREE.Group();
  coolingGroup.name = "s1 s2 u connected outer-water cooling paths";
  const reservoirGroup = new THREE.Group();
  reservoirGroup.name = "w1 w2 x y connected gas storage";
  rootGroup.add(
    hullGroup,
    motorGroup,
    fixedDriveGroup,
    propellerShaftGroup,
    couplingGroup,
    reverseGroup,
    thrustGroup,
    steeringGroup,
    coolingGroup,
    reservoirGroup,
  );

  const castIron = new THREE.MeshStandardMaterial({
    color: 0x344252,
    roughness: 0.62,
    metalness: 0.68,
  });
  const darkSteel = new THREE.MeshStandardMaterial({
    color: 0x202c38,
    roughness: 0.42,
    metalness: 0.83,
  });
  const steel = new THREE.MeshStandardMaterial({
    color: 0xbac5cf,
    roughness: 0.3,
    metalness: 0.9,
  });
  const brass = new THREE.MeshStandardMaterial({
    color: 0xc77c18,
    roughness: 0.34,
    metalness: 0.82,
  });
  const engaged = new THREE.MeshStandardMaterial({
    color: 0x17875d,
    roughness: 0.36,
    metalness: 0.7,
    emissive: 0x063d2b,
    emissiveIntensity: 0.35,
  });
  const open = new THREE.MeshStandardMaterial({
    color: 0x7b8794,
    roughness: 0.48,
    metalness: 0.72,
  });
  const copper = new THREE.MeshStandardMaterial({
    color: 0xa9561d,
    roughness: 0.38,
    metalness: 0.78,
  });
  const wood = new THREE.MeshStandardMaterial({
    color: 0x5b321e,
    roughness: 0.78,
    metalness: 0.03,
  });
  const gas = new THREE.MeshStandardMaterial({
    color: 0x4fc3e8,
    transparent: true,
    opacity: 0.46,
    roughness: 0.2,
  });
  const waterActive = new THREE.MeshStandardMaterial({
    color: 0x22b8cf,
    emissive: 0x075985,
    emissiveIntensity: 0.4,
    roughness: 0.25,
    metalness: 0.25,
  });
  const waterPassive = new THREE.MeshStandardMaterial({
    color: 0x477d96,
    roughness: 0.48,
    metalness: 0.4,
  });
  const waterPlaneMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x63b3d8,
    transparent: true,
    opacity: 0.16,
    roughness: 0.12,
    metalness: 0.05,
    depthWrite: false,
  });

  // The surrounding water is an environment, not an attached machine part.
  const waterPlane = namedMesh(
    "outer water environment",
    new THREE.BoxGeometry(12, 0.05, 5.4),
    waterPlaneMaterial,
  );
  waterPlane.position.y = -1.47;
  waterPlane.userData.connectivityRole = "environment";
  rootGroup.add(waterPlane);

  // A continuous hull load path from keel to cross ribs, stringers, and deck rails.
  const keel = namedMesh("keel", new THREE.BoxGeometry(10.4, 0.34, 0.42), wood);
  keel.position.set(0.7, -1.55, 0);
  hullGroup.add(keel);
  const portStringer = namedMesh(
    "port engine-bed stringer",
    new THREE.BoxGeometry(9.3, 0.25, 0.34),
    wood,
  );
  portStringer.position.set(0.5, -1.18, -1.12);
  const starboardStringer = portStringer.clone();
  starboardStringer.name = "starboard engine-bed stringer";
  starboardStringer.position.z = 1.12;
  hullGroup.add(portStringer, starboardStringer);
  const crossRibs: THREE.Mesh[] = [];
  for (const x of [-3.4, -2.2, -0.8, 0.6, 2, 3.5, 4.9, 5.8]) {
    const rib = namedMesh(`hull cross rib ${x}`, new THREE.BoxGeometry(0.25, 0.24, 3.3), wood);
    rib.position.set(x, -1.3, 0);
    hullGroup.add(rib);
    crossRibs.push(rib);
  }
  for (const side of [-1, 1]) {
    const deckRail = namedMesh(
      `${side < 0 ? "port" : "starboard"} deck rail`,
      new THREE.BoxGeometry(9.5, 0.18, 0.22),
      wood,
    );
    deckRail.position.set(0.45, 0.58, side * 1.68);
    hullGroup.add(deckRail);
    for (const x of [-3.2, -1.6, 0, 1.8, 3.6, 5.3]) {
      hullGroup.add(
        createBeam(
          `hull frame ${x} ${side}`,
          new THREE.Vector3(x, -1.3, side * 1.48),
          new THREE.Vector3(x, 0.58, side * 1.68),
          0.065,
          wood,
        ),
      );
    }
  }

  const bedplate = namedMesh("A motor bedplate", new THREE.BoxGeometry(2.45, 0.4, 1.75), castIron);
  bedplate.position.set(0, -0.98, 0);
  motorGroup.add(bedplate);
  const motorCasing = namedMesh("A motor casing", new THREE.BoxGeometry(1.8, 1.55, 1.4), castIron);
  motorCasing.position.set(0, -0.14, 0);
  motorGroup.add(motorCasing);
  const motorCylinder = namedMesh(
    "A motor cylinder",
    new THREE.CylinderGeometry(0.5, 0.5, 1.2, 36),
    darkSteel,
  );
  motorCylinder.position.set(0, 0.98, 0);
  motorGroup.add(motorCylinder);
  const cylinderHead = namedMesh(
    "A cylinder head",
    new THREE.CylinderGeometry(0.58, 0.58, 0.24, 36),
    brass,
  );
  cylinderHead.position.set(0, 1.67, 0);
  motorGroup.add(cylinderHead);

  const fixedMotorShaft = cylinderAlongX("motor shaft", 0.12, 0.52, steel);
  fixedMotorShaft.position.x = 0.93;
  fixedDriveGroup.add(fixedMotorShaft);
  const fixedAheadCoupling = cylinderAlongX("a fixed motor half-coupling", 0.48, 0.18, brass);
  fixedAheadCoupling.position.x = 1.17;
  fixedDriveGroup.add(fixedAheadCoupling);

  const propellerShaft = cylinderAlongX("b sliding propeller shaft", 0.105, 3.5, steel);
  propellerShaft.position.x = 3.18;
  propellerShaftGroup.add(propellerShaft);
  const movingAheadCoupling = cylinderAlongX("a2 sliding propeller half-coupling", 0.45, 0.2, open);
  movingAheadCoupling.position.x = 1.42;
  propellerShaftGroup.add(movingAheadCoupling);
  const reversingDiskC = cylinderAlongX("c reversing disk fixed on shaft b", 0.43, 0.13, brass);
  reversingDiskC.position.x = 1.79;
  propellerShaftGroup.add(reversingDiskC);
  couplingGroup.add(
    createBeam(
      "i1 spring/collar control path",
      new THREE.Vector3(1.6, -0.78, 0.54),
      new THREE.Vector3(2.15, -0.15, 0.54),
      0.045,
      brass,
    ),
  );

  const propellerHub = cylinderAlongX("d propeller hub", 0.29, 0.38, brass);
  propellerRotor.add(propellerHub);
  const propellerBlades: THREE.Mesh[] = [];
  for (let bladeIndex = 0; bladeIndex < 3; bladeIndex++) {
    const carrier = new THREE.Group();
    carrier.rotation.x = (bladeIndex * Math.PI * 2) / 3;
    const blade = namedMesh(
      `d connected propeller blade ${bladeIndex + 1}`,
      new THREE.BoxGeometry(0.1, 1.15, 0.32),
      brass,
    );
    blade.position.y = 0.48;
    blade.rotation.y = 0.28;
    carrier.add(blade);
    propellerRotor.add(carrier);
    propellerBlades.push(blade);
  }

  const bearings: THREE.Mesh[] = [];
  for (const x of [2.48, 3.95]) {
    const pedestal = namedMesh(
      `b shaft-bearing pedestal ${x}`,
      new THREE.BoxGeometry(0.45, 1.0, 0.68),
      castIron,
    );
    pedestal.position.set(x, -0.73, 0);
    hullGroup.add(pedestal);
    const outerRace = namedMesh(
      `b shaft-bearing outer race ${x}`,
      new THREE.TorusGeometry(0.23, 0.075, 12, 32),
      brass,
    );
    outerRace.rotation.y = Math.PI / 2;
    outerRace.position.set(x, -0.15, 0);
    hullGroup.add(outerRace);
    const innerRace = cylinderAlongX(`b shaft-bearing inner race ${x}`, 0.145, 0.22, brass);
    innerRace.position.set(x, -0.15, 0);
    hullGroup.add(innerRace);
    bearings.push(innerRace);
  }

  const rollerGeometry = new THREE.CylinderGeometry(0.28, 0.28, 0.18, 28);
  rollerGeometry.rotateX(Math.PI / 2);
  const upperReverseRoller = namedMesh("e1 upper intermediate reverse disk", rollerGeometry, open);
  const lowerReverseRoller = namedMesh(
    "e2 lower intermediate reverse disk",
    rollerGeometry.clone(),
    open,
  );
  upperReverseRoller.position.set(1.62, 0.63, 0);
  lowerReverseRoller.position.set(1.62, -0.93, 0);
  reverseGroup.add(upperReverseRoller, lowerReverseRoller);
  const upperPivot = new THREE.Vector3(2.18, 1.03, 0);
  const lowerPivot = new THREE.Vector3(2.18, -1.33, 0);
  const upperReverseLever = createBeam(
    "f1 upper elbow lever",
    upperPivot,
    upperReverseRoller.position,
    0.05,
    brass,
  );
  const lowerReverseLever = createBeam(
    "f2 lower elbow lever",
    lowerPivot,
    lowerReverseRoller.position,
    0.05,
    brass,
  );
  reverseGroup.add(upperReverseLever, lowerReverseLever);
  reverseGroup.add(
    createBeam(
      "g1 upper lever fulcrum support",
      new THREE.Vector3(upperPivot.x, -1.18, 0),
      upperPivot,
      0.07,
      darkSteel,
    ),
    createBeam(
      "g2 lower lever fulcrum support",
      new THREE.Vector3(lowerPivot.x, -1.3, 0),
      lowerPivot,
      0.07,
      darkSteel,
    ),
  );

  const thrustBearing = namedMesh(
    "q thrust bearing",
    new THREE.TorusGeometry(0.34, 0.085, 14, 34),
    steel,
  );
  thrustBearing.rotation.y = Math.PI / 2;
  thrustBearing.position.set(-0.92, -0.15, 0);
  thrustGroup.add(thrustBearing);
  const crankAxle = cylinderAlongX("r2 sliding starting pin", 0.055, 0.36, brass);
  crankAxle.position.set(-1.09, -0.15, 0);
  thrustGroup.add(crankAxle);
  thrustGroup.add(
    createBeam(
      "r1 starter crank arm",
      new THREE.Vector3(-1.26, -0.15, 0),
      new THREE.Vector3(-1.26, 0.55, 0),
      0.055,
      steel,
    ),
    createBeam(
      "r1 starter crank handle",
      new THREE.Vector3(-1.26, 0.55, 0),
      new THREE.Vector3(-1.26, 0.55, 0.42),
      0.06,
      wood,
    ),
  );

  const rudderPost = namedMesh(
    "m rudder stock",
    new THREE.CylinderGeometry(0.07, 0.07, 2.25, 18),
    steel,
  );
  rudderPost.position.set(5.7, -0.38, 0);
  steeringGroup.add(rudderPost);
  const rudder = namedMesh("m connected rudder", new THREE.BoxGeometry(0.7, 1.65, 0.1), wood);
  rudder.position.set(5.92, -0.72, 0);
  rudder.rotation.z = -0.08;
  steeringGroup.add(rudder);
  const steeringPost = namedMesh(
    "o1 steering shaft",
    new THREE.CylinderGeometry(0.065, 0.065, 1.45, 18),
    steel,
  );
  steeringPost.position.set(2.25, 0.02, 1.34);
  steeringGroup.add(steeringPost);
  const steeringWheel = namedMesh(
    "o2 o3 steering levers",
    new THREE.TorusGeometry(0.36, 0.045, 10, 30),
    brass,
  );
  steeringWheel.position.set(2.25, 0.72, 1.34);
  steeringWheel.rotation.x = Math.PI / 2;
  steeringGroup.add(steeringWheel);
  const steeringChain = createPipe(
    "n continuous steering chain",
    [
      new THREE.Vector3(2.25, 0.58, 1.34),
      new THREE.Vector3(3.5, 0.5, 1.54),
      new THREE.Vector3(5.5, 0.48, 1.2),
      new THREE.Vector3(5.7, 0.45, 0),
    ],
    0.025,
    steel,
  );
  steeringGroup.add(steeringChain);

  const waterJacket = namedMesh(
    "motor-cylinder water jacket",
    new THREE.CylinderGeometry(0.66, 0.66, 1.12, 40, 1, true),
    copper,
  );
  waterJacket.position.set(0, 0.98, 0);
  coolingGroup.add(waterJacket);
  for (const y of [0.43, 1.53]) {
    const jacketCollar = namedMesh(
      `water-jacket connected collar ${y}`,
      new THREE.TorusGeometry(0.58, 0.08, 12, 34),
      copper,
    );
    jacketCollar.rotation.x = Math.PI / 2;
    jacketCollar.position.set(0, y, 0);
    coolingGroup.add(jacketCollar);
  }
  const forePipe = createPipe(
    "s1 fore trumpet pipe to jacket",
    [
      new THREE.Vector3(-4.45, -1.36, 1.54),
      new THREE.Vector3(-3.4, -0.82, 1.5),
      new THREE.Vector3(-1.35, 0.35, 0.92),
      new THREE.Vector3(-0.55, 0.82, 0.28),
    ],
    0.075,
    waterActive,
  );
  const aftPipe = createPipe(
    "s2 jacket-to-stern exhaust pipe",
    [
      new THREE.Vector3(0.55, 0.82, 0.28),
      new THREE.Vector3(1.45, 0.35, 0.92),
      new THREE.Vector3(3.7, -0.82, 1.5),
      new THREE.Vector3(4.75, -1.36, 1.54),
    ],
    0.075,
    waterActive,
  );
  coolingGroup.add(forePipe, aftPipe);
  const pumpBranch = createPipe(
    "u outside-water pump branch",
    [
      new THREE.Vector3(1.55, -1.36, -1.5),
      new THREE.Vector3(1.55, -0.66, -1.1),
      new THREE.Vector3(0.45, 0.62, -0.38),
    ],
    0.075,
    waterPassive,
  );
  coolingGroup.add(pumpBranch);
  const pumpCasing = namedMesh(
    "u centrifugal pump casing",
    new THREE.TorusGeometry(0.26, 0.08, 12, 32),
    brass,
  );
  pumpCasing.position.set(1.55, -0.66, -1.1);
  pumpCasing.rotation.x = Math.PI / 2;
  coolingGroup.add(pumpCasing);
  const pumpImpeller = namedMesh(
    "u centrifugal pump impeller",
    new THREE.CylinderGeometry(0.18, 0.18, 0.08, 24),
    waterPassive,
  );
  pumpImpeller.position.copy(pumpCasing.position);
  pumpImpeller.rotation.x = Math.PI / 2;
  coolingGroup.add(pumpImpeller);
  coolingGroup.add(
    createBeam(
      "u pump foundation bracket",
      new THREE.Vector3(1.55, -1.3, -1.1),
      new THREE.Vector3(1.55, -0.66, -1.1),
      0.06,
      darkSteel,
    ),
  );
  const fillFunnel = namedMesh(
    "t fill funnel",
    new THREE.ConeGeometry(0.16, 0.34, 18, 1, true),
    copper,
  );
  fillFunnel.position.set(-0.42, 1.68, 0.34);
  coolingGroup.add(fillFunnel);
  coolingGroup.add(
    createPipe(
      "t funnel connection to jacket",
      [
        new THREE.Vector3(-0.42, 1.53, 0.34),
        new THREE.Vector3(-0.32, 1.35, 0.25),
        new THREE.Vector3(-0.28, 1.25, 0.18),
      ],
      0.04,
      copper,
    ),
  );

  const highPressureHolders: THREE.Mesh[] = [];
  const holderSaddles: THREE.Mesh[] = [];
  for (const x of [-2.35, -0.75]) {
    const holder = cylinderAlongX("w2 high-pressure gas holder", 0.33, 1.2, gas);
    holder.position.set(x, 0.08, -1.25);
    reservoirGroup.add(holder);
    highPressureHolders.push(holder);
    const saddle = namedMesh("w2 holder saddle", new THREE.BoxGeometry(0.72, 1.5, 0.22), darkSteel);
    saddle.position.set(x, -0.67, -1.25);
    reservoirGroup.add(saddle);
    holderSaddles.push(saddle);
  }
  const lowPressureBag = namedMesh(
    "w1 expanding low-pressure gas reservoir",
    new THREE.SphereGeometry(0.62, 32, 20),
    gas,
  );
  lowPressureBag.scale.set(1.8, 0.7, 0.72);
  lowPressureBag.position.set(2.85, 0.08, 1.2);
  reservoirGroup.add(lowPressureBag);
  const bagStrap = namedMesh(
    "y low-pressure bag follower strap",
    new THREE.BoxGeometry(2.2, 0.12, 0.1),
    steel,
  );
  bagStrap.position.set(2.85, 0.54, 1.2);
  reservoirGroup.add(bagStrap);
  const bagStrapSupports = [
    createBeam(
      "y forward follower-strap support",
      new THREE.Vector3(1.78, -1.18, 1.12),
      new THREE.Vector3(1.78, 0.54, 1.2),
      0.045,
      steel,
    ),
    createBeam(
      "y aft follower-strap support",
      new THREE.Vector3(3.92, -1.18, 1.12),
      new THREE.Vector3(3.92, 0.54, 1.2),
      0.045,
      steel,
    ),
  ] as const;
  reservoirGroup.add(...bagStrapSupports);
  const reducingCock = namedMesh("x reducing cock", new THREE.SphereGeometry(0.13, 18, 12), brass);
  reducingCock.position.set(0.65, 0.45, -0.78);
  reservoirGroup.add(reducingCock);
  const highToLowGasPipe = createPipe(
    "w2-x-w1 high-to-low pressure gas path",
    [
      new THREE.Vector3(-1.75, 0.08, -1.25),
      new THREE.Vector3(0.65, 0.45, -0.78),
      new THREE.Vector3(1.8, 0.4, 0.25),
      new THREE.Vector3(2.85, 0.08, 0.78),
    ],
    0.045,
    brass,
  );
  const secondHolderManifold = createPipe(
    "second w2 holder manifold",
    [
      new THREE.Vector3(-0.15, 0.08, -1.25),
      new THREE.Vector3(0.25, 0.3, -1.05),
      new THREE.Vector3(0.65, 0.45, -0.78),
    ],
    0.045,
    brass,
  );
  const bagToMotorPipe = createPipe(
    "w1-to-A motor gas supply",
    [
      new THREE.Vector3(2.25, 0.08, 1.2),
      new THREE.Vector3(1.25, 0.4, 0.85),
      new THREE.Vector3(0.65, 0.55, 0.55),
      new THREE.Vector3(0.45, 0.55, 0.35),
    ],
    0.045,
    brass,
  );
  reservoirGroup.add(highToLowGasPipe, secondHolderManifold, bagToMotorPipe);

  const steeringFoundation = createBeam(
    "o1 steering-column foundation",
    new THREE.Vector3(2.25, -1.18, 1.12),
    new THREE.Vector3(2.25, -0.68, 1.34),
    0.065,
    darkSteel,
  );
  steeringGroup.add(steeringFoundation);

  const sourceInterfaces: DaimlerSourceInterface[] = [
    { id: "keel-to-rib", elementNumbers: "vessel ↔ foundation", a: keel, b: crossRibs[3] },
    { id: "rib-to-bedplate", elementNumbers: "vessel ↔ A", a: crossRibs[2], b: bedplate },
    { id: "bedplate-to-motor", elementNumbers: "bedplate ↔ A", a: bedplate, b: motorCasing },
    { id: "motor-to-fixed-shaft", elementNumbers: "A ↔ a", a: motorCasing, b: fixedMotorShaft },
    {
      id: "fixed-shaft-to-coupling",
      elementNumbers: "motor shaft ↔ a",
      a: fixedMotorShaft,
      b: fixedAheadCoupling,
    },
    {
      id: "moving-coupling-to-shaft",
      elementNumbers: "a² ↔ b",
      a: movingAheadCoupling,
      b: propellerShaft,
    },
    { id: "shaft-to-propeller", elementNumbers: "b ↔ d", a: propellerShaft, b: propellerHub },
    { id: "hub-to-blade", elementNumbers: "d hub ↔ blade", a: propellerHub, b: propellerBlades[0] },
    { id: "shaft-to-bearing-1", elementNumbers: "b ↔ bearing", a: propellerShaft, b: bearings[0] },
    { id: "shaft-to-bearing-2", elementNumbers: "b ↔ bearing", a: propellerShaft, b: bearings[1] },
    { id: "motor-to-water-jacket", elementNumbers: "A ↔ jacket", a: motorCylinder, b: waterJacket },
    { id: "fore-pipe-to-jacket", elementNumbers: "s¹ ↔ jacket", a: forePipe, b: waterJacket },
    { id: "aft-pipe-to-jacket", elementNumbers: "s² ↔ jacket", a: aftPipe, b: waterJacket },
    { id: "pump-to-branch", elementNumbers: "u ↔ pump branch", a: pumpCasing, b: pumpBranch },
    { id: "rudder-to-stock", elementNumbers: "m ↔ rudder stock", a: rudder, b: rudderPost },
    {
      id: "chain-to-rudder-stock",
      elementNumbers: "n ↔ m",
      a: steeringChain,
      b: rudderPost,
    },
    {
      id: "holder-to-saddle",
      elementNumbers: "w² ↔ vessel",
      a: highPressureHolders[0],
      b: holderSaddles[0],
    },
    {
      id: "saddle-to-stringer",
      elementNumbers: "w² saddle ↔ vessel",
      a: holderSaddles[0],
      b: portStringer,
    },
    { id: "bag-to-strap", elementNumbers: "w¹ ↔ y", a: lowPressureBag, b: bagStrap },
    {
      id: "strap-to-support",
      elementNumbers: "y ↔ vessel support",
      a: bagStrap,
      b: bagStrapSupports[0],
    },
    {
      id: "support-to-stringer",
      elementNumbers: "y support ↔ vessel",
      a: bagStrapSupports[0],
      b: starboardStringer,
    },
    {
      id: "steering-column-to-foundation",
      elementNumbers: "o¹ ↔ vessel support",
      a: steeringPost,
      b: steeringFoundation,
    },
    {
      id: "steering-foundation-to-stringer",
      elementNumbers: "o¹ support ↔ vessel",
      a: steeringFoundation,
      b: starboardStringer,
    },
    {
      id: "gas-path-to-bag",
      elementNumbers: "w²/x ↔ w¹",
      a: highToLowGasPipe,
      b: lowPressureBag,
    },
    { id: "gas-path-to-motor", elementNumbers: "w¹ ↔ A", a: bagToMotorPipe, b: motorCasing },
  ];

  return {
    rootGroup,
    hullGroup,
    motorGroup,
    fixedDriveGroup,
    propellerShaftGroup,
    propellerRotor,
    couplingGroup,
    reverseGroup,
    thrustGroup,
    steeringGroup,
    coolingGroup,
    reservoirGroup,
    movingAheadCoupling,
    fixedAheadCoupling,
    reverseRollers: [upperReverseRoller, lowerReverseRoller],
    reverseLevers: [upperReverseLever, lowerReverseLever],
    pumpImpeller,
    passiveCoolingPipes: [forePipe, aftPipe],
    sourceInterfaces,
    materials: { engaged, open, copper, waterActive, waterPassive },
    dispose: () => {
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      rootGroup.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          geometries.add(object.geometry);
          const objectMaterials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          for (const material of objectMaterials) materials.add(material);
        }
      });
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
    },
  };
}

export function updateDaimlerMarineInstallationKinematics(
  model: DaimlerMarineInstallationModel,
  state: DaimlerMarineVisualState,
): void {
  const normalizedTranslation = Math.max(
    -1,
    Math.min(1, state.shaftTranslationAlongAxisNormalized),
  );
  model.propellerShaftGroup.position.x =
    normalizedTranslation * DAIMLER_MARINE_SOURCE_GEOMETRY.normalizedShaftDisplayTravel;
  model.fixedDriveGroup.rotation.x = state.illustrativePhaseRad * state.motorRotationSign;
  model.propellerRotor.rotation.x = state.illustrativePhaseRad * state.propellerRotationSign;

  model.fixedAheadCoupling.material = state.aheadCouplingEngaged
    ? model.materials.engaged
    : model.materials.copper;
  model.movingAheadCoupling.material = state.aheadCouplingEngaged
    ? model.materials.engaged
    : model.materials.open;

  const rollerOffset = state.asternGearingEngaged ? 0.62 : 0.78;
  const shaftY = -0.15;
  model.reverseRollers[0].position.y = shaftY + rollerOffset;
  model.reverseRollers[1].position.y = shaftY - rollerOffset;
  for (const roller of model.reverseRollers) {
    roller.material = state.asternGearingEngaged ? model.materials.engaged : model.materials.open;
    roller.rotation.z = state.asternGearingEngaged
      ? -state.illustrativePhaseRad * state.motorRotationSign
      : 0;
  }
  placeBeam(
    model.reverseLevers[0],
    new THREE.Vector3(2.18, 1.03, 0),
    model.reverseRollers[0].position,
  );
  placeBeam(
    model.reverseLevers[1],
    new THREE.Vector3(2.18, -1.33, 0),
    model.reverseRollers[1].position,
  );

  for (const pipe of model.passiveCoolingPipes) {
    pipe.visible = state.passiveForeAftCoolingPathPresent;
    pipe.material = state.passiveForeAftCoolingPathPresent
      ? model.materials.waterActive
      : model.materials.waterPassive;
  }
  model.pumpImpeller.material = state.coolingPumpActive
    ? model.materials.waterActive
    : model.materials.waterPassive;
  model.pumpImpeller.rotation.z = state.coolingPumpActive ? state.illustrativePhaseRad * 2 : 0;
}
