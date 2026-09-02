/**
 * Source-bounded procedural model of Tesla's US 593,138 transformer.
 *
 * The active geometry follows Fig. 2: a conical graded secondary B, a primary
 * C around its broad adjacent end, the claimed primary/secondary/earth bond,
 * and a remote high-potential terminal. The patent does not print a toroid,
 * rotary gap, Leyden-jar tank, dimensions, or power datum; none is modeled as
 * source apparatus here.
 */

import * as THREE from "three";

export interface TeslaTransformerConnectivityGap {
  interface: string;
  gapMeters: number;
}

export interface TeslaCoilModel {
  root: THREE.Group;
  coilGroup: THREE.Group;
  tableBase: THREE.Mesh;
  secondaryCylinder: THREE.Mesh;
  spiralMesh: THREE.Mesh;
  highTerminalMesh: THREE.Mesh;
  terminalBoard: THREE.Mesh;
  potentialMarkers: THREE.Mesh[];
  updateElectricalProfile: (electricalLengthRad: number) => void;
  setProfileMarkersVisible: (visible: boolean) => void;
  setClaimedCommonNodeConnected: (connected: boolean) => void;
  connectivityReceipt: () => readonly TeslaTransformerConnectivityGap[];
  setCutaway?: (cutaway: boolean) => void;
  dispose: () => void;
}

const BASE_CENTER_Y = -2.35;
const BASE_HEIGHT = 0.6;
const BASE_TOP_Y = BASE_CENTER_Y + BASE_HEIGHT / 2;
const BASE_BOTTOM_Y = BASE_CENTER_Y - BASE_HEIGHT / 2;
const FLOOR_Y = -4.5;
const CONE_BASE_Y = BASE_TOP_Y;
const CONE_TOP_Y = 2.25;
const HIGH_TERMINAL_CENTER = new THREE.Vector3(0, 2.62, 0);
const HIGH_TERMINAL_RADIUS = 0.18;

function distanceGap(interfaceName: string, a: THREE.Vector3, b: THREE.Vector3) {
  return { interface: interfaceName, gapMeters: a.distanceTo(b) };
}

export function buildTeslaCoilModel(): TeslaCoilModel {
  const root = new THREE.Group();
  root.name = "US 593,138 Fig. 2 grounded conical transformer";
  const coilGroup = new THREE.Group();
  root.add(coilGroup);

  const disposables: Array<{ dispose: () => void }> = [];
  const track = <T extends { dispose: () => void }>(resource: T): T => {
    disposables.push(resource);
    return resource;
  };

  const copper = track(
    new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.9, roughness: 0.24 }),
  );
  const heavyCopper = track(
    new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.94, roughness: 0.18 }),
  );
  const brass = track(
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.92, roughness: 0.16 }),
  );
  const ebonite = track(
    new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.08, roughness: 0.68 }),
  );
  const mahogany = track(
    new THREE.MeshStandardMaterial({ color: 0x5c2c16, metalness: 0.04, roughness: 0.5 }),
  );
  const insulator = track(
    new THREE.MeshStandardMaterial({
      color: 0xf1e4c7,
      metalness: 0.02,
      roughness: 0.65,
      transparent: true,
      opacity: 0.78,
    }),
  );

  const tableBase = new THREE.Mesh(
    track(new THREE.CylinderGeometry(3.25, 3.35, BASE_HEIGHT, 48)),
    mahogany,
  );
  tableBase.name = "Insulating transformer table";
  tableBase.position.y = BASE_CENTER_Y;
  tableBase.castShadow = true;
  tableBase.receiveShadow = true;
  coilGroup.add(tableBase);

  const legHeight = BASE_BOTTOM_Y - FLOOR_Y;
  const legs: THREE.Mesh[] = [];
  for (let index = 0; index < 4; index++) {
    const angle = Math.PI / 4 + (index * Math.PI) / 2;
    const leg = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.24, 0.3, legHeight, 20)),
      mahogany,
    );
    leg.name = `Transformer table leg ${index + 1}`;
    leg.position.set(Math.cos(angle) * 2.45, FLOOR_Y + legHeight / 2, Math.sin(angle) * 2.45);
    leg.castShadow = true;
    coilGroup.add(leg);
    legs.push(leg);
  }

  const coneHeight = CONE_TOP_Y - CONE_BASE_Y;
  const secondaryCylinder = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.28, 1.04, coneHeight, 64, 1, true)),
    insulator,
  );
  secondaryCylinder.name = "Fig. 2 conical insulating secondary support";
  secondaryCylinder.position.y = CONE_BASE_Y + coneHeight / 2;
  secondaryCylinder.castShadow = true;
  coilGroup.add(secondaryCylinder);

  const secondaryPoints: THREE.Vector3[] = [];
  const secondaryTurns = 64.25;
  const secondarySegments = 900;
  for (let index = 0; index <= secondarySegments; index++) {
    const fraction = index / secondarySegments;
    const angle = fraction * secondaryTurns * Math.PI * 2;
    const radius = 1.02 + (0.3 - 1.02) * fraction;
    secondaryPoints.push(
      new THREE.Vector3(
        Math.cos(angle) * radius,
        CONE_BASE_Y + 0.25 + fraction * (coneHeight - 0.5),
        Math.sin(angle) * radius,
      ),
    );
  }
  const secondaryCurve = new THREE.CatmullRomCurve3(secondaryPoints);
  const secondaryWinding = new THREE.Mesh(
    track(new THREE.TubeGeometry(secondaryCurve, 900, 0.022, 6, false)),
    copper,
  );
  secondaryWinding.name = "Secondary B graded conical winding";
  secondaryWinding.castShadow = true;
  coilGroup.add(secondaryWinding);

  const primaryPoints: THREE.Vector3[] = [];
  const primaryTurns = 4.5;
  const primarySegments = 220;
  for (let index = 0; index <= primarySegments; index++) {
    const fraction = index / primarySegments;
    const angle = fraction * primaryTurns * Math.PI * 2;
    const radius = 1.18 + fraction * 0.78;
    primaryPoints.push(
      new THREE.Vector3(
        Math.cos(angle) * radius,
        -1.83 + fraction * 0.05,
        Math.sin(angle) * radius,
      ),
    );
  }
  const primaryCurve = new THREE.CatmullRomCurve3(primaryPoints);
  const spiralMesh = new THREE.Mesh(
    track(new THREE.TubeGeometry(primaryCurve, 260, 0.07, 10, false)),
    heavyCopper,
  );
  spiralMesh.name = "Primary C surrounding the adjacent secondary end";
  spiralMesh.castShadow = true;
  coilGroup.add(spiralMesh);

  const primarySupportHeight = 0.18;
  const primarySupports: THREE.Mesh[] = [];
  for (let index = 0; index < 6; index++) {
    const angle = (index * Math.PI * 2) / 6;
    const support = new THREE.Mesh(
      track(new THREE.BoxGeometry(1.15, primarySupportHeight, 0.16)),
      mahogany,
    );
    support.name = `Primary winding support ${index + 1}`;
    support.position.set(
      Math.cos(angle) * 1.45,
      BASE_TOP_Y + primarySupportHeight / 2,
      Math.sin(angle) * 1.45,
    );
    support.rotation.y = -angle;
    coilGroup.add(support);
    primarySupports.push(support);
  }

  const terminalBoardHeight = 0.3;
  const terminalBoard = new THREE.Mesh(
    track(new THREE.BoxGeometry(5.25, terminalBoardHeight, 0.8)),
    ebonite,
  );
  terminalBoard.name = "Primary and earth terminal board";
  terminalBoard.position.set(0, BASE_TOP_Y + terminalBoardHeight / 2, 2.35);
  terminalBoard.castShadow = true;
  coilGroup.add(terminalBoard);

  const commonNode = new THREE.Vector3(2.35, -1.25, 2.35);
  const inputNode = new THREE.Vector3(-2.35, -1.25, 2.35);
  const makePost = (name: string, point: THREE.Vector3) => {
    const post = new THREE.Mesh(track(new THREE.CylinderGeometry(0.11, 0.11, 0.8, 20)), brass);
    post.name = name;
    post.position.set(point.x, -1.65, point.z);
    post.castShadow = true;
    coilGroup.add(post);
    return post;
  };
  makePost("Claimed primary-secondary-earth common terminal", commonNode);
  makePost("Primary source terminal", inputNode);

  const earthPlateTop = new THREE.Vector3(2.35, FLOOR_Y + 0.1, 2.35);
  const earthPlate = new THREE.Mesh(track(new THREE.CylinderGeometry(0.42, 0.5, 0.2, 24)), brass);
  earthPlate.name = "Earth terminal plate";
  earthPlate.position.set(earthPlateTop.x, FLOOR_Y, earthPlateTop.z);
  coilGroup.add(earthPlate);

  const highTerminalBottom = new THREE.Vector3(
    HIGH_TERMINAL_CENTER.x,
    HIGH_TERMINAL_CENTER.y - HIGH_TERMINAL_RADIUS,
    HIGH_TERMINAL_CENTER.z,
  );
  const highTerminalMesh = new THREE.Mesh(
    track(new THREE.SphereGeometry(HIGH_TERMINAL_RADIUS, 24, 18)),
    brass,
  );
  highTerminalMesh.name = "Remote high-potential terminal";
  highTerminalMesh.position.copy(HIGH_TERMINAL_CENTER);
  highTerminalMesh.castShadow = true;
  coilGroup.add(highTerminalMesh);

  const makeConductor = (name: string, points: THREE.Vector3[], radius = 0.035) => {
    const curve = new THREE.CatmullRomCurve3(points);
    const conductor = new THREE.Mesh(
      track(new THREE.TubeGeometry(curve, Math.max(24, points.length * 12), radius, 8, false)),
      heavyCopper,
    );
    conductor.name = name;
    conductor.castShadow = true;
    coilGroup.add(conductor);
    return { curve, conductor };
  };

  const secondaryLow = secondaryPoints[0].clone();
  const secondaryHigh = secondaryPoints[secondaryPoints.length - 1].clone();
  const primaryLow = primaryPoints[0].clone();
  const primaryInput = primaryPoints[primaryPoints.length - 1].clone();
  const secondaryGapA = new THREE.Vector3(1.67, -1.49, 1.51);
  const secondaryGapB = new THREE.Vector3(1.9, -1.43, 1.78);
  const secondaryBondLowStub = makeConductor("Secondary low-terminal tethered lead stub", [
    secondaryLow,
    new THREE.Vector3(1.55, -1.55, 1.35),
    secondaryGapA,
  ]);
  const secondaryBond = makeConductor("Secondary low terminal to claimed common node", [
    secondaryGapA,
    secondaryGapA.clone().lerp(secondaryGapB, 0.5),
    secondaryGapB,
  ]);
  const secondaryBondNodeStub = makeConductor("Common-node tethered secondary lead stub", [
    secondaryGapB,
    secondaryGapB.clone().lerp(commonNode, 0.5),
    commonNode,
  ]);
  const primaryBond = makeConductor("Primary adjacent terminal to claimed common node", [
    primaryLow,
    new THREE.Vector3(1.72, -1.38, 1.45),
    commonNode,
  ]);
  const primarySource = makeConductor("Primary source lead", [
    primaryInput,
    new THREE.Vector3(-2.05, -1.48, 1.45),
    inputNode,
  ]);
  const secondaryHighLead = makeConductor("Secondary high-potential lead", [
    secondaryHigh,
    new THREE.Vector3(0.18, 2.38, 0),
    highTerminalBottom,
  ]);
  const earthLead = makeConductor(
    "Claimed earth lead",
    [
      commonNode,
      new THREE.Vector3(3.55, -2.55, 2.35),
      new THREE.Vector3(3.55, FLOOR_Y + 0.1, 2.35),
      earthPlateTop,
    ],
    0.045,
  );

  const commonNodeBreakMarker = new THREE.Group();
  const openTerminalGeometry = track(new THREE.SphereGeometry(0.1, 16, 12));
  const openTerminalMaterial = track(
    new THREE.MeshStandardMaterial({
      color: 0xbe123c,
      emissive: new THREE.Color(0x881337),
      emissiveIntensity: 0.8,
      roughness: 0.35,
    }),
  );
  for (const endpoint of [secondaryGapA, secondaryGapB]) {
    const terminal = new THREE.Mesh(openTerminalGeometry, openTerminalMaterial);
    terminal.position.copy(endpoint);
    commonNodeBreakMarker.add(terminal);
  }
  commonNodeBreakMarker.name = "Claim 1 open secondary-bond marker";
  commonNodeBreakMarker.visible = false;
  coilGroup.add(commonNodeBreakMarker);

  // Anchored sampling beads expose the normalized distributed-wave profile.
  // They sit on winding B and never imply an untethered discharge path.
  const potentialMarkers: THREE.Mesh[] = [];
  const potentialMarkerMaterials: THREE.MeshStandardMaterial[] = [];
  for (let index = 0; index <= 8; index++) {
    const fraction = index / 8;
    const point = secondaryPoints[Math.round(fraction * secondarySegments)];
    const material = track(
      new THREE.MeshStandardMaterial({
        color: 0x2563eb,
        emissive: new THREE.Color(0x1d4ed8),
        emissiveIntensity: 0,
        metalness: 0.25,
        roughness: 0.35,
      }),
    );
    const marker = new THREE.Mesh(track(new THREE.SphereGeometry(0.06, 14, 10)), material);
    marker.name = `Secondary normalized-potential sample ${index}`;
    marker.position.copy(point);
    coilGroup.add(marker);
    potentialMarkers.push(marker);
    potentialMarkerMaterials.push(material);
  }

  const updateElectricalProfile = (electricalLengthRad: number) => {
    for (let index = 0; index < potentialMarkers.length; index++) {
      const fraction = index / (potentialMarkers.length - 1);
      const profile = Math.abs(Math.sin(electricalLengthRad * fraction));
      const material = potentialMarkerMaterials[index];
      material.color.setRGB(0.12 + profile * 0.82, 0.32 + profile * 0.32, 0.82);
      material.emissive.setRGB(profile * 0.75, profile * 0.22, profile * 0.85);
      material.emissiveIntensity = profile * 0.9;
      potentialMarkers[index].scale.setScalar(0.7 + profile * 0.65);
    }
  };

  const setProfileMarkersVisible = (visible: boolean) => {
    for (const marker of potentialMarkers) marker.visible = visible;
  };
  setProfileMarkersVisible(false);

  const setClaimedCommonNodeConnected = (connected: boolean) => {
    secondaryBond.conductor.visible = connected;
    commonNodeBreakMarker.visible = !connected;
  };

  const connectivityReceipt = (): readonly TeslaTransformerConnectivityGap[] => {
    const legTop = legs[0].localToWorld(new THREE.Vector3(0, legHeight / 2, 0));
    const baseBottomAtLeg = new THREE.Vector3(
      legs[0].position.x,
      BASE_BOTTOM_Y,
      legs[0].position.z,
    );
    const baseTop = tableBase.localToWorld(new THREE.Vector3(0, BASE_HEIGHT / 2, 0));
    const coneBase = secondaryCylinder.localToWorld(new THREE.Vector3(0, -coneHeight / 2, 0));
    const boardBottom = terminalBoard.localToWorld(
      new THREE.Vector3(0, -terminalBoardHeight / 2, 0),
    );
    const firstSupportBottom = primarySupports[0].localToWorld(
      new THREE.Vector3(0, -primarySupportHeight / 2, 0),
    );
    return [
      distanceGap(
        "floor -> table leg",
        new THREE.Vector3(legs[0].position.x, FLOOR_Y, legs[0].position.z),
        legs[0].localToWorld(new THREE.Vector3(0, -legHeight / 2, 0)),
      ),
      distanceGap("table leg -> insulating base", legTop, baseBottomAtLeg),
      distanceGap("insulating base -> conical support", baseTop, coneBase),
      distanceGap(
        "insulating base -> primary winding support",
        new THREE.Vector3(primarySupports[0].position.x, BASE_TOP_Y, primarySupports[0].position.z),
        firstSupportBottom,
      ),
      distanceGap(
        "insulating base -> terminal board",
        new THREE.Vector3(0, BASE_TOP_Y, 2.35),
        boardBottom,
      ),
      distanceGap(
        "secondary low end -> low-terminal lead",
        secondaryLow,
        secondaryBondLowStub.curve.getPoint(0),
      ),
      distanceGap(
        "secondary low-terminal stub -> removable bridge",
        secondaryBondLowStub.curve.getPoint(1),
        secondaryBond.curve.getPoint(0),
      ),
      distanceGap(
        "removable bridge -> common-node stub",
        secondaryBond.curve.getPoint(1),
        secondaryBondNodeStub.curve.getPoint(0),
      ),
      distanceGap(
        "secondary common-node stub -> common node",
        secondaryBondNodeStub.curve.getPoint(1),
        commonNode,
      ),
      distanceGap(
        "primary adjacent end -> common-node lead",
        primaryLow,
        primaryBond.curve.getPoint(0),
      ),
      distanceGap(
        "primary common-node lead -> common node",
        primaryBond.curve.getPoint(1),
        commonNode,
      ),
      distanceGap("common node -> earth lead", commonNode, earthLead.curve.getPoint(0)),
      distanceGap("earth lead -> earth plate", earthLead.curve.getPoint(1), earthPlateTop),
      distanceGap(
        "primary source end -> source lead",
        primaryInput,
        primarySource.curve.getPoint(0),
      ),
      distanceGap("primary source lead -> source post", primarySource.curve.getPoint(1), inputNode),
      distanceGap(
        "secondary high end -> high-terminal lead",
        secondaryHigh,
        secondaryHighLead.curve.getPoint(0),
      ),
      distanceGap(
        "high-terminal lead -> remote terminal",
        secondaryHighLead.curve.getPoint(1),
        highTerminalBottom,
      ),
    ];
  };

  const setCutaway = (cutaway: boolean) => {
    insulator.opacity = cutaway ? 0.18 : 0.78;
    insulator.needsUpdate = true;
    secondaryWinding.material = copper;
    copper.wireframe = cutaway;
    copper.needsUpdate = true;
  };

  return {
    root,
    coilGroup,
    tableBase,
    secondaryCylinder,
    spiralMesh,
    highTerminalMesh,
    terminalBoard,
    potentialMarkers,
    updateElectricalProfile,
    setProfileMarkersVisible,
    setClaimedCommonNodeConnected,
    connectivityReceipt,
    setCutaway,
    dispose: () => {
      for (const disposable of disposables) disposable.dispose();
    },
  };
}
