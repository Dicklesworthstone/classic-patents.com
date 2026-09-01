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
import { createLcg } from "@/utils/lcg";
import { createGlowPointTexture } from "./ThreeStudioScene";

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
  toroidMesh: THREE.Mesh;
  sparkGapBase: THREE.Mesh;
  coronaPoints: THREE.Points;
  streamerLines: THREE.Line[];
  streamerGeos: THREE.BufferGeometry[];
  capacitorGroup?: THREE.Group;
  updateKinematics: (
    delta: number,
    showLightningStreamers: boolean,
    streamerStudioLength: number,
    secondaryVoltageMv: number,
  ) => void;
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

  for (let index = 0; index < 6; index++) {
    const angle = (index * Math.PI * 2) / 6;
    const support = new THREE.Mesh(track(new THREE.BoxGeometry(1.15, 0.18, 0.16)), mahogany);
    support.name = `Primary winding support ${index + 1}`;
    support.position.set(Math.cos(angle) * 1.45, -1.94, Math.sin(angle) * 1.45);
    support.rotation.y = -angle;
    coilGroup.add(support);
  }

  const terminalBoardHeight = 0.3;
  const sparkGapBase = new THREE.Mesh(
    track(new THREE.BoxGeometry(5.25, terminalBoardHeight, 0.8)),
    ebonite,
  );
  sparkGapBase.name = "Primary and earth terminal board";
  sparkGapBase.position.set(0, BASE_TOP_Y + terminalBoardHeight / 2, 2.35);
  sparkGapBase.castShadow = true;
  coilGroup.add(sparkGapBase);

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
  const toroidMesh = new THREE.Mesh(
    track(new THREE.SphereGeometry(HIGH_TERMINAL_RADIUS, 24, 18)),
    brass,
  );
  toroidMesh.name = "Remote high-potential terminal (not a toroid)";
  toroidMesh.position.copy(HIGH_TERMINAL_CENTER);
  toroidMesh.castShadow = true;
  coilGroup.add(toroidMesh);

  const makeConductor = (name: string, points: THREE.Vector3[], radius = 0.035) => {
    const curve = new THREE.CatmullRomCurve3(points);
    const conductor = new THREE.Mesh(
      track(new THREE.TubeGeometry(curve, Math.max(24, points.length * 12), radius, 8, false)),
      heavyCopper,
    );
    conductor.name = name;
    conductor.castShadow = true;
    coilGroup.add(conductor);
    return curve;
  };

  const secondaryLow = secondaryPoints[0].clone();
  const secondaryHigh = secondaryPoints[secondaryPoints.length - 1].clone();
  const primaryLow = primaryPoints[0].clone();
  const primaryInput = primaryPoints[primaryPoints.length - 1].clone();
  const secondaryBondCurve = makeConductor("Secondary low terminal to claimed common node", [
    secondaryLow,
    new THREE.Vector3(1.55, -1.55, 1.35),
    commonNode,
  ]);
  const primaryBondCurve = makeConductor("Primary adjacent terminal to claimed common node", [
    primaryLow,
    new THREE.Vector3(1.72, -1.38, 1.45),
    commonNode,
  ]);
  const primarySourceCurve = makeConductor("Primary source lead", [
    primaryInput,
    new THREE.Vector3(-2.05, -1.48, 1.45),
    inputNode,
  ]);
  const secondaryHighCurve = makeConductor("Secondary high-potential lead", [
    secondaryHigh,
    new THREE.Vector3(0.18, 2.38, 0),
    highTerminalBottom,
  ]);
  const earthCurve = makeConductor(
    "Claimed earth lead",
    [commonNode, new THREE.Vector3(2.75, -2.0, 0), earthPlateTop],
    0.045,
  );

  const streamerLines: THREE.Line[] = [];
  const streamerGeos: THREE.BufferGeometry[] = [];
  const streamerMaterials: THREE.LineBasicMaterial[] = [];
  const lcg = createLcg(593138);
  const streamerCount = 5;
  const streamerSegments = 12;
  for (let index = 0; index < streamerCount; index++) {
    const geometry = track(new THREE.BufferGeometry());
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(streamerSegments * 3), 3),
    );
    const material = track(
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 }),
    );
    const line = new THREE.Line(geometry, material);
    line.name = "Interpretive terminal discharge";
    root.add(line);
    streamerGeos.push(geometry);
    streamerMaterials.push(material);
    streamerLines.push(line);
  }

  const coronaCount = 48;
  const coronaGeometry = track(new THREE.BufferGeometry());
  const coronaPositions = new Float32Array(coronaCount * 3);
  for (let index = 0; index < coronaCount; index++) {
    const theta = lcg() * Math.PI * 2;
    const phi = lcg() * Math.PI;
    const radius = HIGH_TERMINAL_RADIUS + lcg() * 0.12;
    coronaPositions[index * 3] = HIGH_TERMINAL_CENTER.x + Math.cos(theta) * Math.sin(phi) * radius;
    coronaPositions[index * 3 + 1] = HIGH_TERMINAL_CENTER.y + Math.cos(phi) * radius;
    coronaPositions[index * 3 + 2] =
      HIGH_TERMINAL_CENTER.z + Math.sin(theta) * Math.sin(phi) * radius;
  }
  coronaGeometry.setAttribute("position", new THREE.BufferAttribute(coronaPositions, 3));
  const glowTexture = track(createGlowPointTexture());
  const coronaMaterial = track(
    new THREE.PointsMaterial({
      size: 0.2,
      map: glowTexture,
      color: 0x67e8f9,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  const coronaPoints = new THREE.Points(coronaGeometry, coronaMaterial);
  coronaPoints.name = "Interpretive high-terminal corona";
  root.add(coronaPoints);

  const updateKinematics = (
    _delta: number,
    showLightningStreamers: boolean,
    streamerStudioLength: number,
    secondaryVoltageMv: number,
  ) => {
    const intensity = Math.max(0.15, Math.min(1, secondaryVoltageMv / 2));
    coronaPoints.visible = showLightningStreamers;
    coronaMaterial.opacity = showLightningStreamers ? 0.3 + intensity * 0.5 : 0;
    for (let lineIndex = 0; lineIndex < streamerCount; lineIndex++) {
      const line = streamerLines[lineIndex];
      line.visible = showLightningStreamers;
      if (!showLightningStreamers) continue;
      streamerMaterials[lineIndex].opacity = 0.35 + intensity * 0.55;
      const positions = streamerGeos[lineIndex].attributes.position as THREE.BufferAttribute;
      const theta = (lineIndex * Math.PI * 2) / streamerCount + (lcg() - 0.5) * 0.25;
      const length = streamerStudioLength * (0.7 + lcg() * 0.3);
      let x = HIGH_TERMINAL_CENTER.x;
      let y = HIGH_TERMINAL_CENTER.y + HIGH_TERMINAL_RADIUS;
      let z = HIGH_TERMINAL_CENTER.z;
      for (let segment = 0; segment < streamerSegments; segment++) {
        positions.setXYZ(segment, x, y, z);
        x += Math.cos(theta) * (length / streamerSegments) + (lcg() - 0.5) * 0.08;
        y += (0.15 + lcg() * 0.25) * (length / streamerSegments);
        z += Math.sin(theta) * (length / streamerSegments) + (lcg() - 0.5) * 0.08;
      }
      positions.needsUpdate = true;
    }
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
    const boardBottom = sparkGapBase.localToWorld(
      new THREE.Vector3(0, -terminalBoardHeight / 2, 0),
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
        "insulating base -> terminal board",
        new THREE.Vector3(0, BASE_TOP_Y, 2.35),
        boardBottom,
      ),
      distanceGap(
        "secondary low end -> low-terminal lead",
        secondaryLow,
        secondaryBondCurve.getPoint(0),
      ),
      distanceGap(
        "secondary low-terminal lead -> common node",
        secondaryBondCurve.getPoint(1),
        commonNode,
      ),
      distanceGap(
        "primary adjacent end -> common-node lead",
        primaryLow,
        primaryBondCurve.getPoint(0),
      ),
      distanceGap(
        "primary common-node lead -> common node",
        primaryBondCurve.getPoint(1),
        commonNode,
      ),
      distanceGap("common node -> earth lead", commonNode, earthCurve.getPoint(0)),
      distanceGap("earth lead -> earth plate", earthCurve.getPoint(1), earthPlateTop),
      distanceGap(
        "primary source end -> source lead",
        primaryInput,
        primarySourceCurve.getPoint(0),
      ),
      distanceGap("primary source lead -> source post", primarySourceCurve.getPoint(1), inputNode),
      distanceGap(
        "secondary high end -> high-terminal lead",
        secondaryHigh,
        secondaryHighCurve.getPoint(0),
      ),
      distanceGap(
        "high-terminal lead -> remote terminal",
        secondaryHighCurve.getPoint(1),
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
    toroidMesh,
    sparkGapBase,
    coronaPoints,
    streamerLines,
    streamerGeos,
    updateKinematics,
    connectivityReceipt,
    setCutaway,
    dispose: () => {
      for (const disposable of disposables) disposable.dispose();
    },
  };
}
