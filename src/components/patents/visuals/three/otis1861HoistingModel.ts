import * as THREE from "three";
import type { OtisMechanismState } from "@/physics/otisWasm";

const PLATFORM_LOW_Y = -2.5;
const PLATFORM_HIGH_Y = 0.9;
const FRAME_CENTER_X = 2.25;
const DRUM_CENTER = new THREE.Vector3(-3.55, -1.75, 0);
const SHAFT_I_CENTER = new THREE.Vector3(-3.1, -0.1, 0);
const GEAR_J_RADIUS = 0.78;
const GEAR_K_RADIUS = DRUM_CENTER.distanceTo(SHAFT_I_CENTER) - GEAR_J_RADIUS;
const TOP_PULLEY_LEFT = new THREE.Vector3(1.55, 3.6, 0);
const TOP_PULLEY_RIGHT = new THREE.Vector3(2.95, 3.6, 0);
const COUNTER_PULLEY = new THREE.Vector3(4.45, 3.35, 0);

export interface Otis1861ModelNodes {
  frameAandB: THREE.Group;
  driveStand: THREE.Group;
  hookRacksC: THREE.Group;
  platformD: THREE.Group;
  platformStilesA: THREE.Group;
  safetyBarF: THREE.Group;
  leftLeverE: THREE.Group;
  rightLeverE: THREE.Group;
  leftPawlF: THREE.Group;
  rightPawlF: THREE.Group;
  windingDrumH: THREE.Group;
  shaftI: THREE.Group;
  gearJ: THREE.Mesh;
  gearK: THREE.Mesh;
  idlePulleyJ: THREE.Mesh;
  idlePulleyK: THREE.Mesh;
  workingPulleyL: THREE.Mesh;
  powerDrumN: THREE.Group;
  straightBeltO: THREE.LineLoop;
  crossedBeltP: THREE.Line;
  counterpoiseR: THREE.Group;
  shipperS: THREE.Group;
  shipperControlPqr: THREE.Group;
  rackO: THREE.Mesh;
  pinionP: THREE.Mesh;
  drumR: THREE.Mesh;
  handRopeT: THREE.Line;
  stopRopeU: THREE.Line;
  forkV: THREE.Group;
  brakeLinkageWXY: THREE.Group;
  armW: THREE.Mesh;
  barX: THREE.Mesh;
  barY: THREE.Mesh;
  brakeShoeZ: THREE.Mesh;
  lowerStopArm: THREE.Group;
  ropeGIntact: THREE.Line;
  ropeGBrokenPlatform: THREE.Line;
  ropeGBrokenDrum: THREE.Line;
  ropeQ: THREE.Line;
}

export interface Otis1861Model {
  root: THREE.Group;
  nodes: Otis1861ModelNodes;
  materials: {
    timber: THREE.MeshStandardMaterial;
    iron: THREE.MeshStandardMaterial;
    brass: THREE.MeshStandardMaterial;
    rope: THREE.LineBasicMaterial;
    beltWorking: THREE.LineBasicMaterial;
    beltIdle: THREE.LineBasicMaterial;
    safety: THREE.MeshStandardMaterial;
  };
  setCutaway: (enabled: boolean) => void;
  dispose: () => void;
}

function namedGroup(name: string): THREE.Group {
  const group = new THREE.Group();
  group.name = name;
  return group;
}

function box(
  name: string,
  size: [number, number, number],
  material: THREE.Material,
  position: [number, number, number],
): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function wheel(
  name: string,
  radius: number,
  depth: number,
  material: THREE.Material,
  position: [number, number, number],
): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, depth, 28), material);
  mesh.name = name;
  mesh.rotation.x = Math.PI / 2;
  mesh.position.set(...position);
  mesh.castShadow = true;
  return mesh;
}

function rodBetween(
  name: string,
  start: THREE.Vector3,
  end: THREE.Vector3,
  radius: number,
  material: THREE.Material,
): THREE.Mesh {
  const direction = end.clone().sub(start);
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, direction.length(), 10),
    material,
  );
  mesh.name = name;
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  return mesh;
}

function setRodEndpoints(
  target: THREE.Mesh,
  start: THREE.Vector3,
  end: THREE.Vector3,
  radius: number,
) {
  const direction = end.clone().sub(start);
  const previous = target.geometry;
  target.geometry = new THREE.CylinderGeometry(radius, radius, direction.length(), 10);
  target.position.copy(start).add(end).multiplyScalar(0.5);
  target.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  previous.dispose();
}

function line(
  name: string,
  material: THREE.LineBasicMaterial,
  points: readonly THREE.Vector3[],
  loop = false,
): THREE.Line | THREE.LineLoop {
  const geometry = new THREE.BufferGeometry().setFromPoints([...points]);
  const result = loop ? new THREE.LineLoop(geometry, material) : new THREE.Line(geometry, material);
  result.name = name;
  result.frustumCulled = false;
  return result;
}

function setLinePoints(target: THREE.Line | THREE.LineLoop, points: readonly THREE.Vector3[]) {
  const previous = target.geometry;
  target.geometry = new THREE.BufferGeometry().setFromPoints([...points]);
  target.geometry.computeBoundingSphere();
  previous.dispose();
}

function pulleyLoop(center: THREE.Vector3, radius: number, samples = 24): THREE.Vector3[] {
  return Array.from({ length: samples }, (_, index) => {
    const angle = (index / samples) * Math.PI * 2;
    return new THREE.Vector3(
      center.x + Math.cos(angle) * radius,
      center.y + Math.sin(angle) * radius,
      center.z,
    );
  });
}

function beltLoop(
  source: THREE.Vector3,
  target: THREE.Vector3,
  sourceRadius: number,
  targetRadius: number,
): THREE.Vector3[] {
  return [
    new THREE.Vector3(source.x, source.y + sourceRadius, source.z),
    new THREE.Vector3(target.x, target.y + targetRadius, target.z),
    new THREE.Vector3(target.x, target.y - targetRadius, target.z),
    new THREE.Vector3(source.x, source.y - sourceRadius, source.z),
  ];
}

function crossedBelt(
  source: THREE.Vector3,
  target: THREE.Vector3,
  sourceRadius: number,
  targetRadius: number,
): THREE.Vector3[] {
  return [
    new THREE.Vector3(source.x, source.y + sourceRadius, source.z),
    new THREE.Vector3(target.x, target.y - targetRadius, target.z),
    new THREE.Vector3(target.x, target.y + targetRadius, target.z),
    new THREE.Vector3(source.x, source.y - sourceRadius, source.z),
    new THREE.Vector3(source.x, source.y + sourceRadius, source.z),
  ];
}

export function buildOtis1861HoistingModel(): Otis1861Model {
  const root = namedGroup("US 31,128 complete hoisting apparatus");
  const materials = {
    timber: new THREE.MeshStandardMaterial({ color: 0x6f4b2e, roughness: 0.82 }),
    iron: new THREE.MeshStandardMaterial({ color: 0x34383d, roughness: 0.38, metalness: 0.82 }),
    brass: new THREE.MeshStandardMaterial({ color: 0xc28a32, roughness: 0.28, metalness: 0.72 }),
    rope: new THREE.LineBasicMaterial({ color: 0xb86f2b }),
    beltWorking: new THREE.LineBasicMaterial({ color: 0x22c55e }),
    beltIdle: new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.42 }),
    safety: new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.32, metalness: 0.76 }),
  };

  const frameAandB = namedGroup("A base and B fixed uprights");
  frameAandB.add(box("A base", [5.1, 0.45, 2.8], materials.timber, [FRAME_CENTER_X, -3.25, 0]));
  for (const x of [0.65, 3.85]) {
    frameAandB.add(box("B upright", [0.42, 7.2, 0.52], materials.timber, [x, 0.15, 0]));
  }
  frameAandB.add(box("B crown", [4.1, 0.42, 0.62], materials.timber, [FRAME_CENTER_X, 3.65, 0]));
  root.add(frameAandB);

  // Fixed timber/iron bed and bearing posts make the powered machinery part
  // of the same grounded apparatus rather than a cluster floating beside B.
  const driveStand = namedGroup("fixed drive bed and shaft bearings");
  driveStand.add(box("drive foundation", [4.5, 0.42, 4.25], materials.timber, [-3.1, -3.25, 0]));
  driveStand.add(
    box("foundation bridge to A", [2.0, 0.28, 1.0], materials.timber, [-0.55, -3.17, 0]),
  );
  for (const z of [-1.78, 1.78]) {
    driveStand.add(box("N/I bearing post", [0.3, 5.8, 0.3], materials.timber, [-3.1, -0.32, z]));
    driveStand.add(
      wheel("N bearing", 0.18, 0.16, materials.brass, [-3.1, 2.25, z > 0 ? 1.62 : -1.62]),
    );
    driveStand.add(
      wheel("I bearing", 0.15, 0.16, materials.brass, [-3.1, -0.1, z > 0 ? 1.62 : -1.62]),
    );
  }
  driveStand.add(box("drive crown brace", [0.32, 0.32, 3.9], materials.timber, [-3.1, 2.92, 0]));
  driveStand.add(box("shipper S guide", [2.75, 0.12, 0.12], materials.iron, [-3.1, 1.0, 0.55]));
  driveStand.add(box("H left pedestal", [0.28, 1.6, 0.28], materials.iron, [-3.55, -2.45, -0.48]));
  driveStand.add(box("H right pedestal", [0.28, 1.6, 0.28], materials.iron, [-3.55, -2.45, 0.48]));
  root.add(driveStand);

  const hookRacksC = namedGroup("C fixed hook racks");
  for (const x of [0.91, 3.59]) {
    for (let index = 0; index < 17; index += 1) {
      const y = -2.8 + index * 0.35;
      const tooth = box("C hook", [0.24, 0.1, 0.38], materials.iron, [x, y, 0]);
      tooth.rotation.z = x < FRAME_CENTER_X ? -0.28 : 0.28;
      hookRacksC.add(tooth);
    }
  }
  root.add(hookRacksC);

  const platformD = namedGroup("D platform carriage");
  platformD.add(box("D platform", [2.25, 0.28, 1.85], materials.timber, [FRAME_CENTER_X, 0, 0]));
  const platformStilesA = namedGroup("a grooved platform uprights");
  platformStilesA.add(
    box("left grooved upright a", [0.26, 2.25, 0.34], materials.iron, [1.15, 1, 0]),
  );
  platformStilesA.add(
    box("right grooved upright a", [0.26, 2.25, 0.34], materials.iron, [3.35, 1, 0]),
  );
  platformStilesA.add(
    box("top bar d", [2.48, 0.2, 0.38], materials.iron, [FRAME_CENTER_X, 2.08, 0]),
  );
  platformD.add(platformStilesA);

  const safetyBarF = namedGroup("F vertical safety bar and spring e");
  safetyBarF.position.set(FRAME_CENTER_X, 1.7, 0);
  safetyBarF.add(box("F vertical bar", [0.13, 1.15, 0.13], materials.brass, [0, 0, 0]));
  safetyBarF.add(wheel("eye c", 0.14, 0.12, materials.brass, [0, -0.58, 0]));
  safetyBarF.add(box("spring e", [0.33, 0.18, 0.2], materials.safety, [0, 0.57, 0]));
  platformD.add(safetyBarF);

  const leftLeverE = namedGroup("left bent lever E on b");
  leftLeverE.position.set(1.16, 1.16, 0);
  leftLeverE.add(
    rodBetween(
      "left E outer arm",
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.58, 0.44, 0),
      0.055,
      materials.iron,
    ),
  );
  leftLeverE.add(
    rodBetween(
      "left E inner arm to eye c",
      new THREE.Vector3(0.58, 0.44, 0),
      new THREE.Vector3(1.09, -0.04, 0),
      0.055,
      materials.iron,
    ),
  );
  const rightLeverE = namedGroup("right bent lever E on b");
  rightLeverE.position.set(3.34, 1.16, 0);
  rightLeverE.add(
    rodBetween(
      "right E outer arm",
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-0.58, 0.44, 0),
      0.055,
      materials.iron,
    ),
  );
  rightLeverE.add(
    rodBetween(
      "right E inner arm to eye c",
      new THREE.Vector3(-0.58, 0.44, 0),
      new THREE.Vector3(-1.09, -0.04, 0),
      0.055,
      materials.iron,
    ),
  );
  platformD.add(leftLeverE, rightLeverE);

  const leftPawlF = namedGroup("left hook pawl f in mortise h");
  leftPawlF.position.set(1.15, 1.16, 0);
  leftPawlF.add(box("left hook f", [0.64, 0.13, 0.24], materials.safety, [-0.25, 0, 0]));
  const rightPawlF = namedGroup("right hook pawl f in mortise h");
  rightPawlF.position.set(3.35, 1.16, 0);
  rightPawlF.add(box("right hook f", [0.64, 0.13, 0.24], materials.safety, [0.25, 0, 0]));
  platformD.add(leftPawlF, rightPawlF);
  root.add(platformD);

  const pulleyMaterial = materials.iron;
  frameAandB.add(
    wheel(
      "left pulley i",
      0.34,
      0.18,
      pulleyMaterial,
      TOP_PULLEY_LEFT.toArray() as [number, number, number],
    ),
  );
  frameAandB.add(
    wheel(
      "right pulley i",
      0.34,
      0.18,
      pulleyMaterial,
      TOP_PULLEY_RIGHT.toArray() as [number, number, number],
    ),
  );
  frameAandB.add(
    wheel(
      "counterpoise pulley l",
      0.28,
      0.16,
      pulleyMaterial,
      COUNTER_PULLEY.toArray() as [number, number, number],
    ),
  );

  const drive = namedGroup("H through Z connected drive and brake");
  const windingDrumH = namedGroup("H winding drum");
  windingDrumH.position.copy(DRUM_CENTER);
  windingDrumH.add(wheel("H barrel", 0.66, 0.72, materials.iron, [0, 0, 0]));
  const gearJ = wheel("j gear on H", GEAR_J_RADIUS, 0.14, materials.brass, [0, 0, 0.48]);
  windingDrumH.add(gearJ);
  drive.add(windingDrumH);
  const shaftI = namedGroup("I transverse shaft with J K L");
  shaftI.position.copy(SHAFT_I_CENTER);
  shaftI.add(box("I shaft", [0.11, 0.11, 3.5], materials.iron, [0, 0, 0]));
  const idlePulleyJ = wheel("J idle pulley", 0.48, 0.18, materials.iron, [0, 0, -1.25]);
  const workingPulleyL = wheel("L working pulley", 0.54, 0.22, materials.brass, [0, 0, 0]);
  const idlePulleyK = wheel("K idle pulley", 0.48, 0.18, materials.iron, [0, 0, 1.25]);
  const gearK = wheel("k gear on I", GEAR_K_RADIUS, 0.14, materials.brass, [0, 0, 0.48]);
  shaftI.add(idlePulleyJ, workingPulleyL, idlePulleyK, gearK);
  drive.add(shaftI);
  const powerDrumN = namedGroup("N power drum");
  powerDrumN.position.set(-3.1, 2.25, 0);
  powerDrumN.add(wheel("N power pulley", 0.72, 3.1, materials.iron, [0, 0, 0]));
  drive.add(powerDrumN);
  root.add(drive);

  const straightBeltO = line(
    "O straight raising belt",
    materials.beltWorking,
    beltLoop(new THREE.Vector3(-3.1, 2.25, 0.2), new THREE.Vector3(-3.1, -0.1, 0.2), 0.72, 0.54),
    true,
  ) as THREE.LineLoop;
  const crossedBeltP = line(
    "P crossed lowering belt",
    materials.beltIdle,
    crossedBelt(
      new THREE.Vector3(-3.1, 2.25, -0.2),
      new THREE.Vector3(-3.1, -0.1, -0.2),
      0.72,
      0.54,
    ),
  );
  root.add(straightBeltO, crossedBeltP);

  const shipperS = namedGroup("S belt shipper with eyes m and rack o");
  shipperS.position.set(-3.1, 1.0, 0.55);
  shipperS.add(box("S slide", [2.15, 0.13, 0.13], materials.brass, [0, 0, 0]));
  shipperS.add(wheel("left eye m", 0.13, 0.07, materials.brass, [-0.72, 0, 0]));
  shipperS.add(wheel("right eye m", 0.13, 0.07, materials.brass, [0.72, 0, 0]));
  const rackO = box("rack o", [1.7, 0.12, 0.15], materials.iron, [0, -0.2, 0]);
  shipperS.add(rackO);
  root.add(shipperS);

  const shipperControlPqr = namedGroup("p pinion q shaft and r hand-rope drum");
  shipperControlPqr.position.set(-2.6, 0.72, 0.55);
  const pinionP = wheel("p pinion meshing with rack o", 0.22, 0.12, materials.brass, [0, 0, 0]);
  const drumR = wheel("r drum on shaft q", 0.3, 0.24, materials.iron, [0, 0, 0.42]);
  shipperControlPqr.add(pinionP, drumR);
  shipperControlPqr.add(box("q shaft", [0.1, 0.1, 0.55], materials.iron, [0, 0, 0.2]));
  root.add(shipperControlPqr);

  const handRopeT = line("T hand rope secured to drum r", materials.rope, [
    new THREE.Vector3(-2.6, 1.02, 0.97),
    new THREE.Vector3(-2.6, -2.9, 0.97),
  ]);
  const stopRopeU = line("U stop rope with branched V", materials.rope, [
    new THREE.Vector3(4.1, 2.9, 0.62),
    new THREE.Vector3(4.1, -2.9, 0.62),
    new THREE.Vector3(-2.6, -2.25, 0.97),
  ]);
  const forkV = namedGroup("V branch acting on T");
  forkV.position.set(-2.6, -2.25, 0.97);
  forkV.add(
    rodBetween(
      "V left branch",
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-0.25, 0.35, 0),
      0.035,
      materials.brass,
    ),
  );
  forkV.add(
    rodBetween(
      "V right branch",
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.25, 0.35, 0),
      0.035,
      materials.brass,
    ),
  );
  root.add(handRopeT, stopRopeU, forkV);

  const brakeLinkageWXY = namedGroup("W arm X bar Y lever to brake Z");
  brakeLinkageWXY.position.set(-1.85, -0.1, 0.4);
  const armW = rodBetween(
    "W arm attached to slide S",
    new THREE.Vector3(-1.25, 1.1, 0.15),
    new THREE.Vector3(-0.75, 0.3, 0),
    0.055,
    materials.iron,
  );
  const barX = rodBetween(
    "X bar on fixed pivot v",
    new THREE.Vector3(-0.75, 0.3, 0),
    new THREE.Vector3(0, 0, 0),
    0.055,
    materials.iron,
  );
  const barY = rodBetween(
    "Y lever carrying shoe Z",
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-1.24, -0.7, 0),
    0.055,
    materials.iron,
  );
  const brakeShoeZ = box("Z brake shoe", [0.42, 0.18, 0.32], materials.safety, [-1.24, -0.56, 0]);
  brakeLinkageWXY.add(armW, barX, barY, brakeShoeZ);
  root.add(brakeLinkageWXY);

  const lowerStopArm = namedGroup("aˣ lower-stop arm riding with platform D");
  lowerStopArm.position.set(1.15, 0, 0.97);
  lowerStopArm.add(
    rodBetween(
      "aˣ arm from moving upright a to rope T",
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-3.75, -0.4, 0),
      0.055,
      materials.safety,
    ),
  );
  const lowerStopEye = new THREE.Mesh(
    new THREE.TorusGeometry(0.13, 0.035, 8, 18),
    materials.safety,
  );
  lowerStopEye.name = "aˣ eye around rope T";
  lowerStopEye.position.set(-3.75, -0.4, 0);
  lowerStopArm.add(lowerStopEye);
  platformD.add(lowerStopArm);

  const counterpoiseR = namedGroup("R counterpoise");
  counterpoiseR.add(box("R weight", [0.62, 1.0, 0.62], materials.iron, [4.45, 0, 0]));
  root.add(counterpoiseR);

  const ropeGIntact = line("G platform hoisting rope", materials.rope, []);
  const ropeGBrokenPlatform = line("G broken platform-tethered segment", materials.rope, []);
  const ropeGBrokenDrum = line("G broken drum-tethered segment", materials.rope, []);
  const ropeQ = line("Q opposite-wound counterpoise rope", materials.rope, []);
  root.add(ropeGIntact, ropeGBrokenPlatform, ropeGBrokenDrum, ropeQ);

  const nodes: Otis1861ModelNodes = {
    frameAandB,
    driveStand,
    hookRacksC,
    platformD,
    platformStilesA,
    safetyBarF,
    leftLeverE,
    rightLeverE,
    leftPawlF,
    rightPawlF,
    windingDrumH,
    shaftI,
    gearJ,
    gearK,
    idlePulleyJ,
    idlePulleyK,
    workingPulleyL,
    powerDrumN,
    straightBeltO,
    crossedBeltP,
    counterpoiseR,
    shipperS,
    shipperControlPqr,
    rackO,
    pinionP,
    drumR,
    handRopeT,
    stopRopeU,
    forkV,
    brakeLinkageWXY,
    armW,
    barX,
    barY,
    brakeShoeZ,
    lowerStopArm,
    ropeGIntact,
    ropeGBrokenPlatform,
    ropeGBrokenDrum,
    ropeQ,
  };

  const setCutaway = (enabled: boolean) => {
    materials.timber.transparent = enabled;
    materials.timber.opacity = enabled ? 0.38 : 1;
    materials.timber.depthWrite = !enabled;
  };
  const dispose = () => {
    const geometries = new Set<THREE.BufferGeometry>();
    root.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Line)
        geometries.add(object.geometry);
    });
    for (const geometry of geometries) geometry.dispose();
    for (const material of Object.values(materials)) material.dispose();
  };

  return { root, nodes, materials, setCutaway, dispose };
}

export function updateOtis1861Kinematics(model: Otis1861Model, state: OtisMechanismState) {
  const { nodes, materials } = model;
  const platformY = THREE.MathUtils.lerp(
    PLATFORM_LOW_Y,
    PLATFORM_HIGH_Y,
    state.platformPositionNormalized,
  );
  const counterY = THREE.MathUtils.lerp(
    PLATFORM_LOW_Y,
    PLATFORM_HIGH_Y,
    state.counterpoisePositionNormalized,
  );
  nodes.platformD.position.y = platformY;
  nodes.counterpoiseR.position.y = counterY;

  nodes.safetyBarF.position.y = 1.7 - state.safetyBarReleaseNormalized * 0.24;
  nodes.leftLeverE.rotation.z = state.safetyLeverRotationNormalized * 0.32;
  nodes.rightLeverE.rotation.z = -state.safetyLeverRotationNormalized * 0.32;
  nodes.leftPawlF.rotation.z = state.pawlsFEngaged ? -0.38 : 0.16;
  nodes.rightPawlF.rotation.z = state.pawlsFEngaged ? 0.38 : -0.16;

  nodes.windingDrumH.rotation.z = -state.drivePhaseRad;
  nodes.shaftI.rotation.z = state.drivePhaseRad;
  nodes.powerDrumN.rotation.z = state.drivePhaseRad;
  nodes.shipperS.position.x = -3.1 + state.shipperPositionNormalized * 0.46;
  nodes.pinionP.rotation.z = -state.shipperPositionNormalized * 0.72;
  nodes.drumR.rotation.z = -state.shipperPositionNormalized * 0.72;
  nodes.brakeShoeZ.position.y = state.brakeZEngaged ? -0.43 : -0.7;
  setRodEndpoints(
    nodes.armW,
    new THREE.Vector3(nodes.shipperS.position.x + 1.85, 1.1, 0.15),
    new THREE.Vector3(-0.75, 0.3, 0),
    0.055,
  );
  setRodEndpoints(
    nodes.barY,
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-1.24, nodes.brakeShoeZ.position.y, 0),
    0.055,
  );

  nodes.straightBeltO.material = state.straightBeltOWorking
    ? materials.beltWorking
    : materials.beltIdle;
  nodes.crossedBeltP.material = state.crossBeltPWorking
    ? materials.beltWorking
    : materials.beltIdle;
  const beltOSource = new THREE.Vector3(-3.1, 2.25, state.straightBeltOWorking ? 0 : -1.25);
  const beltOTarget = new THREE.Vector3(-3.1, -0.1, state.straightBeltOWorking ? 0 : -1.25);
  const beltPSource = new THREE.Vector3(-3.1, 2.25, state.crossBeltPWorking ? 0 : 1.25);
  const beltPTarget = new THREE.Vector3(-3.1, -0.1, state.crossBeltPWorking ? 0 : 1.25);
  setLinePoints(nodes.straightBeltO, beltLoop(beltOSource, beltOTarget, 0.72, 0.54));
  setLinePoints(nodes.crossedBeltP, crossedBelt(beltPSource, beltPTarget, 0.72, 0.54));

  setLinePoints(nodes.handRopeT, [
    new THREE.Vector3(-2.6, 1.02, 0.97),
    new THREE.Vector3(-2.6, -2.9, 0.97),
  ]);

  const platformRopePoint = new THREE.Vector3(
    FRAME_CENTER_X,
    platformY + nodes.safetyBarF.position.y + 0.57,
    0,
  );
  const windingDrumGPoint = DRUM_CENTER.clone().add(new THREE.Vector3(0, 0, -0.34));
  const breakPoint = new THREE.Vector3(0.15, 3.05, 0);
  const intactPath = [
    platformRopePoint,
    TOP_PULLEY_RIGHT,
    ...pulleyLoop(TOP_PULLEY_LEFT, 0.34, 10).slice(6, 12),
    windingDrumGPoint,
  ];
  setLinePoints(nodes.ropeGIntact, intactPath);
  setLinePoints(nodes.ropeGBrokenPlatform, [platformRopePoint, TOP_PULLEY_RIGHT, breakPoint]);
  setLinePoints(nodes.ropeGBrokenDrum, [
    windingDrumGPoint,
    TOP_PULLEY_LEFT,
    breakPoint.clone().add(new THREE.Vector3(-0.28, -0.18, 0)),
  ]);
  nodes.ropeGIntact.visible = state.ropeGTaut;
  nodes.ropeGBrokenPlatform.visible = !state.ropeGTaut;
  nodes.ropeGBrokenDrum.visible = !state.ropeGTaut;
  setLinePoints(nodes.ropeQ, [
    DRUM_CENTER.clone().add(
      new THREE.Vector3(0, 0, state.claim4CounterpoiseTopologySatisfied ? 0.34 : -0.34),
    ),
    COUNTER_PULLEY,
    new THREE.Vector3(4.45, counterY + 0.5, 0),
  ]);
}

export function inspectOtis1861Connectivity(model: Otis1861Model): string[] {
  const { nodes } = model;
  const errors: string[] = [];
  const requireParent = (name: string, child: THREE.Object3D, parent: THREE.Object3D) => {
    if (child.parent !== parent) errors.push(`${name} is not attached to ${parent.name}.`);
  };
  requireParent("platform stiles a", nodes.platformStilesA, nodes.platformD);
  requireParent("safety bar F", nodes.safetyBarF, nodes.platformD);
  requireParent("left lever E", nodes.leftLeverE, nodes.platformD);
  requireParent("right lever E", nodes.rightLeverE, nodes.platformD);
  requireParent("left pawl f", nodes.leftPawlF, nodes.platformD);
  requireParent("right pawl f", nodes.rightPawlF, nodes.platformD);
  requireParent("lower-stop arm aˣ", nodes.lowerStopArm, nodes.platformD);
  requireParent("brake shoe Z", nodes.brakeShoeZ, nodes.brakeLinkageWXY);
  requireParent("arm W", nodes.armW, nodes.brakeLinkageWXY);
  requireParent("bar X", nodes.barX, nodes.brakeLinkageWXY);
  requireParent("bar Y", nodes.barY, nodes.brakeLinkageWXY);
  requireParent("fixed drive stand", nodes.driveStand, model.root);
  requireParent("pinion p", nodes.pinionP, nodes.shipperControlPqr);
  requireParent("drum r", nodes.drumR, nodes.shipperControlPqr);
  requireParent("gear j", nodes.gearJ, nodes.windingDrumH);
  requireParent("gear k", nodes.gearK, nodes.shaftI);
  const gearCentersDistance = nodes.windingDrumH.position.distanceTo(nodes.shaftI.position);
  if (Math.abs(gearCentersDistance - (GEAR_J_RADIUS + GEAR_K_RADIUS)) > 1e-9) {
    errors.push("Gears j and k do not meet at the H-to-I pitch point.");
  }
  const rackWorld = nodes.rackO.getWorldPosition(new THREE.Vector3());
  const pinionWorld = nodes.pinionP.getWorldPosition(new THREE.Vector3());
  if (
    Math.abs(rackWorld.x - pinionWorld.x) > 0.85 + 0.22 ||
    Math.abs(rackWorld.y - pinionWorld.y) > 0.06 + 0.22
  ) {
    errors.push("Rack o has left pinion p during shipper travel.");
  }
  if (!nodes.windingDrumH.parent || !model.root.children.includes(nodes.windingDrumH.parent)) {
    errors.push("Winding drum H is outside the connected drive mounted on the apparatus root.");
  }
  if (!model.root.children.includes(nodes.straightBeltO))
    errors.push("Belt O is outside the apparatus root.");
  if (!model.root.children.includes(nodes.crossedBeltP))
    errors.push("Belt P is outside the apparatus root.");
  for (const [name, rope] of [
    ["G intact", nodes.ropeGIntact],
    ["G platform segment", nodes.ropeGBrokenPlatform],
    ["G drum segment", nodes.ropeGBrokenDrum],
    ["Q", nodes.ropeQ],
    ["O", nodes.straightBeltO],
    ["P", nodes.crossedBeltP],
    ["T", nodes.handRopeT],
    ["U", nodes.stopRopeU],
  ] as const) {
    const attribute = rope.geometry.getAttribute("position");
    if (!attribute || attribute.count < 2) errors.push(`${name} rope has no connected path.`);
  }
  return errors;
}
