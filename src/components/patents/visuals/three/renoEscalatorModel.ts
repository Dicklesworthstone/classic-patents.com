/**
 * renoEscalatorModel.ts
 *
 * Museum-Grade Procedural 3D Model for Jesse W. Reno's 1892 Endless Inclined Elevator / Escalator
 * (US Patent 470,918 - "Endless Conveyer or Elevator").
 *
 * Reconstructs the authentic historical apparatus demonstrated at the Coney Island Old Iron Pier:
 * 1. Inclined I-beam guides, structural frame, and support struts around the endless belt.
 * 2. Endless moving treadway composed of hinged cast-iron belt sections with longitudinal traction ribs.
 * 3. Fixed cast-steel comb landing plates that register with the belt grooves (Claim 1).
 * 4. Dual synchronized articulated hardwood handrails, their link plates, and cast-iron sprockets.
 * 5. Under-deck roller guide tracks and endless link-chain transmission with drive sprockets.
 * 6. Victorian guard/balustrade stanchions and a transparent presentation cutaway.
 * 7. A top wheel and shaft 13 linkage; the specification also permits bottom power application.
 */

import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export interface RenoEscalatorModelNodes {
  root: THREE.Group;
  /** The rigid, non-moving inclined frame: truss, balustrade, and guides. */
  inclineFrame: THREE.Group;
  trussGroup: THREE.Group;
  balustradesGroup: THREE.Group;
  solidPanelMesh: THREE.Group;
  cutawayPanelMesh: THREE.Group;
  cleatDeckGroup: THREE.Group;
  cleatSlats: THREE.InstancedMesh;
  cleatRollers: THREE.InstancedMesh;
  /** The rounded parts of hinges 12 that seat in sprocket notches 17. */
  cleatHinges: THREE.InstancedMesh;
  cleatCount: number;
  cleatLoopLengthM: number;
  topCombPlate: THREE.Group;
  bottomCombPlate: THREE.Group;
  /** Claim 2's articulated, continuous travelling hand-rail chains. */
  leftHandrail: THREE.InstancedMesh;
  rightHandrail: THREE.InstancedMesh;
  leftHandrailPlates: THREE.InstancedMesh;
  rightHandrailPlates: THREE.InstancedMesh;
  headSheaves: THREE.Mesh[];
  tailSheaves: THREE.Mesh[];
  headHandrailSprockets: THREE.Mesh[];
  tailHandrailSprockets: THREE.Mesh[];
  /** Fixed grooved rail 7 that receives the traveling plates 8. */
  inclinedHandrailChannels: THREE.Mesh[];
  /** Open terminal casings 20 around the rail sprockets 6. */
  headHandrailCasings: THREE.Group[];
  tailHandrailCasings: THREE.Group[];
  /** Wheel 6 linkage on the source-supported shaft 13. */
  topHandrailDriveShaft: THREE.Mesh;
  bottomHandrailSupportShaft: THREE.Mesh;
  topLanding: THREE.Mesh;
  bottomLanding: THREE.Mesh;
  layout: RenoEscalatorLayout;
}

export interface RenoEscalatorMaterials {
  structuralSteel: THREE.MeshStandardMaterial;
  oakHardwood: THREE.MeshStandardMaterial;
  beltIron: THREE.MeshStandardMaterial;
  combSteel: THREE.MeshStandardMaterial;
  castIronGears: THREE.MeshStandardMaterial;
  glassBalustrade: THREE.MeshStandardMaterial;
}

export interface RenoEscalatorModelResult {
  root: THREE.Group;
  nodes: RenoEscalatorModelNodes;
  materials: RenoEscalatorMaterials;
  dispose: () => void;
}

/**
 * The facsimile establishes notched sprockets and hinged sections but does
 * not print a tooth count. This is an explicitly illustrative render
 * tessellation whose pitch is made mechanically exact, not a claimed count.
 */
export const RENO_SPROCKET_SEAT_COUNT = 14;
/** One shared pitch radius for belt sprockets 3 and hand-rail sprockets 6. */
export const RENO_CONVEYOR_SHEAVE_RADIUS_M = 0.45;
export const RENO_CLEAT_PITCH_M =
  (Math.PI * 2 * RENO_CONVEYOR_SHEAVE_RADIUS_M) / RENO_SPROCKET_SEAT_COUNT;
/** The model's centered inclined run; not a source-disclosed dimension. */
export const RENO_CONVEYOR_HALF_SPAN_M = 4.65;
export const RENO_INCLINED_RUN_LENGTH_M = RENO_CONVEYOR_HALF_SPAN_M * 2;
/** Enough horizontal run for each source-faithful stationary comb. */
export const RENO_TERMINAL_RUN_LENGTH_M = 0.81;
export const RENO_CLEAT_COUNT = 126;
export const RENO_CONVEYOR_LOOP_LENGTH_M = RENO_CLEAT_COUNT * RENO_CLEAT_PITCH_M;
const RENO_HANDRAIL_OFFSET_M = 1.45;
const RENO_HANDRAIL_Z_POSITIONS = [-1.4, 1.4] as const;
const RENO_TREAD_RIDGE_COUNT = 7;
const RENO_TREAD_RIDGE_PITCH_M = 0.35;
const RENO_TREAD_RIDGE_FIRST_Z_M = -1.05;
const RENO_COMB_TOOTH_COUNT = RENO_TREAD_RIDGE_COUNT - 1;
const RENO_CONVEYOR_POSE_OBJECT = new THREE.Object3D();
const RENO_HANDRAIL_POSE_OBJECT = new THREE.Object3D();
const RENO_HINGE_POSE_OBJECT = new THREE.Object3D();

export interface RenoConveyorPose {
  x: number;
  y: number;
  tangentAngleRad: number;
  phase:
    | "bottom-landing"
    | "bottom-transition"
    | "ascending"
    | "top-transition"
    | "top-landing"
    | "head-turn"
    | "returning"
    | "tail-turn";
}

export interface RenoEscalatorLayout {
  inclineAngleDeg: number;
  inclineAngleRad: number;
  /** Adjusts within the terminal housings to preserve the fixed hinged-chain length. */
  terminalRunLengthM: number;
  passengerPathLengthM: number;
  loopLengthM: number;
  bottomLandingStart: Readonly<{ x: number; y: number }>;
  topLandingEnd: Readonly<{ x: number; y: number }>;
  headSprocketCenter: Readonly<{ x: number; y: number }>;
  tailSprocketCenter: Readonly<{ x: number; y: number }>;
  bottomCombDistanceM: number;
  topCombDistanceM: number;
  headTurnStartM: number;
  tailTurnStartM: number;
  headSprocketPhaseRad: number;
  tailSprocketPhaseRad: number;
}

function normalizeDistance(distanceM: number, loopLengthM: number): number {
  return ((distanceM % loopLengthM) + loopLengthM) % loopLengthM;
}

function clockwiseArcPose(
  centerX: number,
  centerY: number,
  startAngleRad: number,
  arcDistanceM: number,
): RenoConveyorPose {
  const radialAngle = startAngleRad - arcDistanceM / RENO_CONVEYOR_SHEAVE_RADIUS_M;
  return {
    x: centerX + Math.cos(radialAngle) * RENO_CONVEYOR_SHEAVE_RADIUS_M,
    y: centerY + Math.sin(radialAngle) * RENO_CONVEYOR_SHEAVE_RADIUS_M,
    tangentAngleRad: radialAngle - Math.PI / 2,
    phase: "head-turn",
  };
}

/**
 * Builds the common layout for the moving platform, stationary combs,
 * balustrade, and drive station. The terminal horizontal runs lengthen or
 * shorten inside their housings as the pedagogical incline slider moves, so
 * the same fixed-pitch hinged chain remains a closed loop.
 */
export function createRenoEscalatorLayout(inclineAngleDeg = 25): RenoEscalatorLayout {
  const inclineAngleRad = (inclineAngleDeg * Math.PI) / 180;
  const transitionLengthM = RENO_CONVEYOR_SHEAVE_RADIUS_M * inclineAngleRad;
  const terminalRunLengthM =
    (RENO_CONVEYOR_LOOP_LENGTH_M -
      RENO_INCLINED_RUN_LENGTH_M * 2 -
      transitionLengthM * 4 -
      Math.PI * RENO_CONVEYOR_SHEAVE_RADIUS_M * 2) /
    4;

  if (terminalRunLengthM <= 0) {
    throw new Error("Reno incline layout cannot fit its fixed-pitch terminal chain.");
  }

  const inclineStart = {
    x: -Math.cos(inclineAngleRad) * RENO_CONVEYOR_HALF_SPAN_M,
    y: -Math.sin(inclineAngleRad) * RENO_CONVEYOR_HALF_SPAN_M,
  };
  const bottomArcDx = RENO_CONVEYOR_SHEAVE_RADIUS_M * Math.sin(inclineAngleRad);
  const bottomArcDy = RENO_CONVEYOR_SHEAVE_RADIUS_M * (1 - Math.cos(inclineAngleRad));
  const bottomTransitionStart = {
    x: inclineStart.x - bottomArcDx,
    y: inclineStart.y - bottomArcDy,
  };
  const bottomLandingStart = {
    x: bottomTransitionStart.x - terminalRunLengthM,
    y: bottomTransitionStart.y,
  };
  const inclineEnd = {
    x: Math.cos(inclineAngleRad) * RENO_CONVEYOR_HALF_SPAN_M,
    y: Math.sin(inclineAngleRad) * RENO_CONVEYOR_HALF_SPAN_M,
  };
  const topTransitionEnd = {
    x: inclineEnd.x + bottomArcDx,
    y: inclineEnd.y + bottomArcDy,
  };
  const topLandingEnd = {
    x: topTransitionEnd.x + terminalRunLengthM,
    y: topTransitionEnd.y,
  };
  const passengerPathLengthM =
    terminalRunLengthM * 2 + transitionLengthM * 2 + RENO_INCLINED_RUN_LENGTH_M;
  const headTurnStartM = passengerPathLengthM;
  const tailTurnStartM = passengerPathLengthM * 2 + Math.PI * RENO_CONVEYOR_SHEAVE_RADIUS_M;

  return {
    inclineAngleDeg,
    inclineAngleRad,
    terminalRunLengthM,
    passengerPathLengthM,
    loopLengthM: RENO_CONVEYOR_LOOP_LENGTH_M,
    bottomLandingStart,
    topLandingEnd,
    headSprocketCenter: {
      x: topLandingEnd.x,
      y: topLandingEnd.y - RENO_CONVEYOR_SHEAVE_RADIUS_M,
    },
    tailSprocketCenter: {
      x: bottomLandingStart.x,
      y: bottomLandingStart.y - RENO_CONVEYOR_SHEAVE_RADIUS_M,
    },
    bottomCombDistanceM: terminalRunLengthM * 0.53,
    topCombDistanceM:
      terminalRunLengthM +
      transitionLengthM +
      RENO_INCLINED_RUN_LENGTH_M +
      transitionLengthM +
      terminalRunLengthM * 0.47,
    headTurnStartM,
    tailTurnStartM,
    // At these phases a notch lies under every rounded hinge 12 on wheels 3.
    headSprocketPhaseRad: Math.PI / 2 + passengerPathLengthM / RENO_CONVEYOR_SHEAVE_RADIUS_M,
    tailSprocketPhaseRad: -Math.PI / 2 + tailTurnStartM / RENO_CONVEYOR_SHEAVE_RADIUS_M,
  };
}

/**
 * Position and tangent of the complete platform chain. Unlike the former
 * inclined racetrack, this path includes source-faithful horizontal terminal
 * runs underneath the fixed combs before returning through the two sprockets.
 */
export function renoConveyorPose(
  distanceM: number,
  layout = createRenoEscalatorLayout(),
): RenoConveyorPose {
  let s = normalizeDistance(distanceM, layout.loopLengthM);
  const transitionLengthM = RENO_CONVEYOR_SHEAVE_RADIUS_M * layout.inclineAngleRad;

  if (s < layout.terminalRunLengthM) {
    return {
      x: layout.bottomLandingStart.x + s,
      y: layout.bottomLandingStart.y,
      tangentAngleRad: 0,
      phase: "bottom-landing",
    };
  }
  s -= layout.terminalRunLengthM;

  if (s < transitionLengthM) {
    const radialAngle = -Math.PI / 2 + s / RENO_CONVEYOR_SHEAVE_RADIUS_M;
    const centerX = layout.bottomLandingStart.x + layout.terminalRunLengthM;
    const centerY = layout.bottomLandingStart.y + RENO_CONVEYOR_SHEAVE_RADIUS_M;
    return {
      x: centerX + Math.cos(radialAngle) * RENO_CONVEYOR_SHEAVE_RADIUS_M,
      y: centerY + Math.sin(radialAngle) * RENO_CONVEYOR_SHEAVE_RADIUS_M,
      tangentAngleRad: radialAngle + Math.PI / 2,
      phase: "bottom-transition",
    };
  }
  s -= transitionLengthM;

  if (s < RENO_INCLINED_RUN_LENGTH_M) {
    const inclineStartX = -Math.cos(layout.inclineAngleRad) * RENO_CONVEYOR_HALF_SPAN_M;
    const inclineStartY = -Math.sin(layout.inclineAngleRad) * RENO_CONVEYOR_HALF_SPAN_M;
    return {
      x: inclineStartX + Math.cos(layout.inclineAngleRad) * s,
      y: inclineStartY + Math.sin(layout.inclineAngleRad) * s,
      tangentAngleRad: layout.inclineAngleRad,
      phase: "ascending",
    };
  }
  s -= RENO_INCLINED_RUN_LENGTH_M;

  if (s < transitionLengthM) {
    const inclineEndX = Math.cos(layout.inclineAngleRad) * RENO_CONVEYOR_HALF_SPAN_M;
    const inclineEndY = Math.sin(layout.inclineAngleRad) * RENO_CONVEYOR_HALF_SPAN_M;
    const radialAngle = layout.inclineAngleRad + Math.PI / 2 - s / RENO_CONVEYOR_SHEAVE_RADIUS_M;
    const centerX = inclineEndX + Math.sin(layout.inclineAngleRad) * RENO_CONVEYOR_SHEAVE_RADIUS_M;
    const centerY = inclineEndY - Math.cos(layout.inclineAngleRad) * RENO_CONVEYOR_SHEAVE_RADIUS_M;
    return {
      x: centerX + Math.cos(radialAngle) * RENO_CONVEYOR_SHEAVE_RADIUS_M,
      y: centerY + Math.sin(radialAngle) * RENO_CONVEYOR_SHEAVE_RADIUS_M,
      tangentAngleRad: radialAngle - Math.PI / 2,
      phase: "top-transition",
    };
  }
  s -= transitionLengthM;

  if (s < layout.terminalRunLengthM) {
    return {
      x: layout.topLandingEnd.x - layout.terminalRunLengthM + s,
      y: layout.topLandingEnd.y,
      tangentAngleRad: 0,
      phase: "top-landing",
    };
  }
  s -= layout.terminalRunLengthM;

  if (s < Math.PI * RENO_CONVEYOR_SHEAVE_RADIUS_M) {
    return clockwiseArcPose(
      layout.headSprocketCenter.x,
      layout.headSprocketCenter.y,
      Math.PI / 2,
      s,
    );
  }
  s -= Math.PI * RENO_CONVEYOR_SHEAVE_RADIUS_M;

  if (s < layout.passengerPathLengthM) {
    const forward = renoConveyorPose(layout.passengerPathLengthM - s, layout);
    return {
      x: forward.x,
      y: forward.y - RENO_CONVEYOR_SHEAVE_RADIUS_M * 2,
      tangentAngleRad: forward.tangentAngleRad + Math.PI,
      phase: "returning",
    };
  }
  s -= layout.passengerPathLengthM;

  const tail = clockwiseArcPose(
    layout.tailSprocketCenter.x,
    layout.tailSprocketCenter.y,
    -Math.PI / 2,
    s,
  );
  return { ...tail, phase: "tail-turn" };
}

/** Claim 2 rail 10 uses the same arc-length speed as the passenger platform. */
export function renoHandrailPose(
  distanceM: number,
  layout = createRenoEscalatorLayout(),
): RenoConveyorPose {
  const pose = renoConveyorPose(distanceM, layout);
  return {
    ...pose,
    x: pose.x - Math.sin(layout.inclineAngleRad) * RENO_HANDRAIL_OFFSET_M,
    y: pose.y + Math.cos(layout.inclineAngleRad) * RENO_HANDRAIL_OFFSET_M,
  };
}

function mergeGeometryParts(parts: THREE.BufferGeometry[], label: string): THREE.BufferGeometry {
  const merged = mergeGeometries(parts, false);
  for (const part of parts) part.dispose();
  if (!merged) throw new Error(`Failed to merge Reno ${label} geometry.`);
  return merged;
}

function createTrussBraceGeometry(
  start: THREE.Vector3,
  end: THREE.Vector3,
): THREE.CylinderGeometry {
  const direction = end.clone().sub(start);
  const geometry = new THREE.CylinderGeometry(0.045, 0.045, direction.length(), 8);
  geometry.applyQuaternion(
    new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize()),
  );
  geometry.translate((start.x + end.x) / 2, (start.y + end.y) / 2, (start.z + end.z) / 2);
  return geometry;
}

/**
 * Deterministic unit noise for procedural grain generation.
 */
function deterministicUnit(index: number, channel: number): number {
  const sample = Math.sin((index + 1) * 12.9898 + (channel + 1) * 78.233) * 43758.5453;
  return sample - Math.floor(sample);
}

/**
 * Procedural Quartersawn American White Oak Texture
 */
function createOakTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  ctx.fillStyle = "#8c531b";
  ctx.fillRect(0, 0, 512, 512);

  // Longitudinal grain striations
  for (let i = 0; i < 95; i++) {
    const y = i * 5.4 + (deterministicUnit(i, 0) - 0.5) * 3;
    const alpha = 0.08 + (i % 4 === 0 ? 0.14 : 0.03);
    ctx.strokeStyle = `rgba(62, 34, 10, ${alpha})`;
    ctx.lineWidth = 1.3 + (i % 3) * 0.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(170, y + 8, 340, y - 8, 512, y + 4);
    ctx.stroke();
  }

  // Quartersawn medullary ray flecks
  for (let p = 0; p < 180; p++) {
    const px = deterministicUnit(p, 1) * 512;
    const py = deterministicUnit(p, 2) * 512;
    ctx.fillStyle = "rgba(180, 120, 50, 0.22)";
    ctx.fillRect(px, py, 6 + deterministicUnit(p, 3) * 12, 2.2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Procedural Riveted Structural Steel Texture
 */
function createSteelTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  ctx.fillStyle = "#1e2430";
  ctx.fillRect(0, 0, 512, 512);

  // Mill scale and oxide mottling
  for (let i = 0; i < 500; i++) {
    const px = deterministicUnit(i, 0) * 512;
    const py = deterministicUnit(i, 1) * 512;
    const r = 1.5 + deterministicUnit(i, 2) * 3.5;
    ctx.fillStyle = "rgba(45, 55, 72, 0.45)";
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createNotchedSprocketGeometry(
  pitchRadiusM: number,
  seatCount: number,
  thicknessM: number,
): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const step = (Math.PI * 2) / seatCount;
  const toothRadius = pitchRadiusM + 0.055;
  const seatRadius = pitchRadiusM - 0.045;
  const points: THREE.Vector2[] = [];

  for (let i = 0; i < seatCount; i++) {
    const center = i * step;
    for (const [radius, offset] of [
      [toothRadius, -0.5],
      [seatRadius, -0.24],
      [seatRadius, 0.24],
      [toothRadius, 0.5],
    ] as const) {
      const angle = center + offset * step;
      points.push(new THREE.Vector2(Math.cos(angle) * radius, Math.sin(angle) * radius));
    }
  }
  shape.moveTo(points[0].x, points[0].y);
  for (const point of points.slice(1)) shape.lineTo(point.x, point.y);
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: thicknessM,
    bevelEnabled: false,
    curveSegments: 1,
  });
  geometry.translate(0, 0, -thicknessM / 2);
  geometry.computeVertexNormals();
  return geometry;
}

export function buildRenoEscalatorModel(inclineAngleDeg = 25): RenoEscalatorModelResult {
  const root = new THREE.Group();
  const disposableGeometries: THREE.BufferGeometry[] = [];
  const disposableMaterials: THREE.Material[] = [];
  const disposableTextures: THREE.Texture[] = [];
  const initialLayout = createRenoEscalatorLayout(inclineAngleDeg);

  const trackGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    disposableGeometries.push(geo);
    return geo;
  };
  const trackMat = <T extends THREE.Material>(mat: T): T => {
    disposableMaterials.push(mat);
    return mat;
  };

  const oakTex = createOakTexture();
  if (oakTex) disposableTextures.push(oakTex);
  const steelTex = createSteelTexture();
  if (steelTex) disposableTextures.push(steelTex);

  const materials: RenoEscalatorMaterials = {
    structuralSteel: trackMat(
      new THREE.MeshStandardMaterial({
        ...(steelTex ? { map: steelTex } : {}),
        color: 0x242c38,
        roughness: 0.55,
        metalness: 0.85,
      }),
    ),
    oakHardwood: trackMat(
      new THREE.MeshStandardMaterial({
        ...(oakTex ? { map: oakTex } : {}),
        color: 0x9a5b18,
        roughness: 0.58,
        metalness: 0.06,
      }),
    ),
    beltIron: trackMat(
      new THREE.MeshStandardMaterial({ color: 0x59616a, roughness: 0.48, metalness: 0.82 }),
    ),
    combSteel: trackMat(
      new THREE.MeshStandardMaterial({ color: 0x718096, roughness: 0.38, metalness: 0.9 }),
    ),
    castIronGears: trackMat(
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.45, metalness: 0.85 }),
    ),
    glassBalustrade: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        transparent: true,
        opacity: 0.45,
        roughness: 0.1,
        metalness: 0.1,
      }),
    ),
  };

  // The inclined structural frame is separate from the dynamic link chains.
  // Moving the slider changes this group in place rather than recreating WebGL.
  const inclineFrame = new THREE.Group();
  root.add(inclineFrame);
  const trussGroup = new THREE.Group();
  inclineFrame.add(trussGroup);

  for (const z of [-1.4, 1.4]) {
    const upperY = -0.2;
    const lowerY = -0.9;
    const bayWidthM = 1.6;
    const firstNodeX = -4.8;
    const bayCount = 6;
    const trussParts: THREE.BufferGeometry[] = [
      new THREE.BoxGeometry(RENO_INCLINED_RUN_LENGTH_M + 1.6, 0.16, 0.24).translate(0, upperY, z),
      new THREE.BoxGeometry(RENO_INCLINED_RUN_LENGTH_M + 1.2, 0.14, 0.18).translate(0, lowerY, z),
    ];

    for (let bay = 0; bay < bayCount; bay++) {
      const startX = firstNodeX + bay * bayWidthM;
      const endX = startX + bayWidthM;
      const startY = bay % 2 === 0 ? lowerY : upperY;
      const endY = bay % 2 === 0 ? upperY : lowerY;
      trussParts.push(
        createTrussBraceGeometry(
          new THREE.Vector3(startX, startY, z),
          new THREE.Vector3(endX, endY, z),
        ),
      );
    }
    trussParts.push(
      createTrussBraceGeometry(
        new THREE.Vector3(firstNodeX, lowerY, z),
        new THREE.Vector3(firstNodeX, upperY, z),
      ),
      createTrussBraceGeometry(
        new THREE.Vector3(firstNodeX + bayCount * bayWidthM, lowerY, z),
        new THREE.Vector3(firstNodeX + bayCount * bayWidthM, upperY, z),
      ),
    );

    const sideTruss = new THREE.Mesh(
      trackGeo(mergeGeometryParts(trussParts, "side truss")),
      materials.structuralSteel,
    );
    sideTruss.castShadow = true;
    trussGroup.add(sideTruss);
  }

  const bottomLanding = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.6, 0.65, 3.6)),
    materials.structuralSteel,
  );
  bottomLanding.receiveShadow = true;
  bottomLanding.castShadow = true;
  root.add(bottomLanding);
  const topLanding = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.6, 0.65, 3.6)),
    materials.structuralSteel,
  );
  topLanding.receiveShadow = true;
  topLanding.castShadow = true;
  root.add(topLanding);

  const balustradesGroup = new THREE.Group();
  inclineFrame.add(balustradesGroup);
  const solidPanelMesh = new THREE.Group();
  const cutawayPanelMesh = new THREE.Group();
  for (const z of RENO_HANDRAIL_Z_POSITIONS) {
    const panel = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(RENO_INCLINED_RUN_LENGTH_M + 1.2, 1.25, 0.08)),
      materials.oakHardwood,
    );
    panel.position.set(0, 0.8, z);
    panel.castShadow = true;
    solidPanelMesh.add(panel);
    const glass = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(RENO_INCLINED_RUN_LENGTH_M + 1.2, 1.25, 0.04)),
      materials.glassBalustrade,
    );
    glass.position.set(0, 0.8, z);
    cutawayPanelMesh.add(glass);
    for (let x = -5; x <= 5; x += 2) {
      const stanchion = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.04, 0.05, 1.4, 12)),
        materials.castIronGears,
      );
      stanchion.position.set(x, 0.7, z);
      balustradesGroup.add(stanchion);
    }
  }
  solidPanelMesh.visible = false;
  balustradesGroup.add(solidPanelMesh, cutawayPanelMesh);

  const cleatDeckGroup = new THREE.Group();
  root.add(cleatDeckGroup);
  const cleatIronParts: THREE.BufferGeometry[] = [
    new THREE.BoxGeometry(RENO_CLEAT_PITCH_M * 0.94, 0.12, 2.4),
  ];
  for (let ridge = 0; ridge < RENO_TREAD_RIDGE_COUNT; ridge++) {
    const geometry = new THREE.BoxGeometry(RENO_CLEAT_PITCH_M * 0.94, 0.045, 0.09);
    geometry.translate(0, 0.075, RENO_TREAD_RIDGE_FIRST_Z_M + ridge * RENO_TREAD_RIDGE_PITCH_M);
    cleatIronParts.push(geometry);
  }
  const cleatIronGeo = trackGeo(mergeGeometryParts(cleatIronParts, "hinged belt section"));
  const cleatRollerParts = [-0.98, 0.98].map((z) => {
    const roller = new THREE.CylinderGeometry(0.055, 0.055, 0.07, 12);
    roller.rotateX(Math.PI / 2);
    roller.translate(0, -0.1, z);
    return roller;
  });
  const cleatRollerGeo = trackGeo(mergeGeometryParts(cleatRollerParts, "under-deck roller"));
  const hingeGeo = trackGeo(new THREE.CylinderGeometry(0.06, 0.06, 2.15, 12).rotateX(Math.PI / 2));
  const cleatSlats = new THREE.InstancedMesh(cleatIronGeo, materials.beltIron, RENO_CLEAT_COUNT);
  cleatSlats.name = "hinged-cast-iron-belt-sections";
  cleatSlats.castShadow = true;
  cleatSlats.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const cleatRollers = new THREE.InstancedMesh(
    cleatRollerGeo,
    materials.castIronGears,
    RENO_CLEAT_COUNT,
  );
  cleatRollers.name = "belt-section-guide-rollers";
  cleatRollers.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const cleatHinges = new THREE.InstancedMesh(hingeGeo, materials.castIronGears, RENO_CLEAT_COUNT);
  cleatHinges.name = "rounded-hinges-seated-in-sprocket-notches";
  cleatHinges.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  cleatDeckGroup.add(cleatSlats, cleatRollers, cleatHinges);

  // The visible I-beam guide tracks share the non-moving inclined frame.
  for (const z of [-0.98, 0.98]) {
    const guideRail = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(RENO_INCLINED_RUN_LENGTH_M, 0.08, 0.12)),
      materials.structuralSteel,
    );
    guideRail.position.set(0, -0.18, z);
    guideRail.castShadow = true;
    inclineFrame.add(guideRail);
  }

  // Figure 4's fixed rail 7 is a continuous grooved channel. The moving
  // steel plates 8 sit in this channel along the inclined run; this is a
  // stationary support, not a second decorative handrail.
  const inclinedHandrailChannels: THREE.Mesh[] = [];
  for (const z of RENO_HANDRAIL_Z_POSITIONS) {
    const channelBaseY = RENO_HANDRAIL_OFFSET_M - 0.28;
    const channelParts: THREE.BufferGeometry[] = [
      new THREE.BoxGeometry(RENO_INCLINED_RUN_LENGTH_M + 0.32, 0.07, 0.34).translate(
        0,
        channelBaseY,
        z,
      ),
      new THREE.BoxGeometry(RENO_INCLINED_RUN_LENGTH_M + 0.32, 0.2, 0.05).translate(
        0,
        channelBaseY + 0.115,
        z - 0.145,
      ),
      new THREE.BoxGeometry(RENO_INCLINED_RUN_LENGTH_M + 0.32, 0.2, 0.05).translate(
        0,
        channelBaseY + 0.115,
        z + 0.145,
      ),
    ];
    const channel = new THREE.Mesh(
      trackGeo(mergeGeometryParts(channelParts, "rail 7 grooved channel")),
      materials.structuralSteel,
    );
    channel.name = "fixed-grooved-rail-7";
    channel.castShadow = true;
    inclineFrame.add(channel);
    inclinedHandrailChannels.push(channel);
  }

  const buildCombPlate = (isTop: boolean): THREE.Group => {
    const combGroup = new THREE.Group();
    const combParts: THREE.BufferGeometry[] = [new THREE.BoxGeometry(0.7, 0.09, 2.6)];
    // Teeth occupy the same z centers as the gaps between the seven source-style
    // tread ridges; this is the physical registration Claim 1 requires.
    for (let toothIndex = 0; toothIndex < RENO_COMB_TOOTH_COUNT; toothIndex++) {
      const tooth = new THREE.ConeGeometry(0.04, 0.38, 4);
      tooth.rotateZ(isTop ? -Math.PI / 2 : Math.PI / 2);
      tooth.translate(
        isTop ? -0.42 : 0.42,
        0.02,
        RENO_TREAD_RIDGE_FIRST_Z_M + (toothIndex + 0.5) * RENO_TREAD_RIDGE_PITCH_M,
      );
      combParts.push(tooth);
    }
    const combBody = new THREE.Mesh(
      trackGeo(mergeGeometryParts(combParts, "registered comb plate")),
      materials.combSteel,
    );
    combBody.name = "cast-steel-comb-body";
    combBody.castShadow = true;
    combGroup.add(combBody);
    return combGroup;
  };
  const topCombPlate = buildCombPlate(true);
  const bottomCombPlate = buildCombPlate(false);
  root.add(topCombPlate, bottomCombPlate);

  // Claim 2: individually articulated hardwood rail links and their steel
  // plates travel on the same arc-length tape as the platform, never as a
  // static bar or a decorative CSS animation.
  const handrailLinkGeo = trackGeo(
    new THREE.CylinderGeometry(0.09, 0.09, RENO_CLEAT_PITCH_M * 0.93, 12).rotateZ(Math.PI / 2),
  );
  // The two downward plate feet leave an open notch 18. Its walls visibly
  // receive a tooth 19 when a rail link turns around sprocket 6.
  const handrailPlateGeo = trackGeo(
    mergeGeometryParts(
      [
        new THREE.BoxGeometry(RENO_CLEAT_PITCH_M * 0.64, 0.05, 0.1).translate(0, -0.075, 0),
        new THREE.BoxGeometry(RENO_CLEAT_PITCH_M * 0.14, 0.12, 0.1).translate(
          -RENO_CLEAT_PITCH_M * 0.25,
          -0.15,
          0,
        ),
        new THREE.BoxGeometry(RENO_CLEAT_PITCH_M * 0.14, 0.12, 0.1).translate(
          RENO_CLEAT_PITCH_M * 0.25,
          -0.15,
          0,
        ),
      ],
      "notched handrail plate",
    ),
  );
  const leftHandrail = new THREE.InstancedMesh(
    handrailLinkGeo,
    materials.oakHardwood,
    RENO_CLEAT_COUNT,
  );
  leftHandrail.name = "left-articulated-travelling-handrail";
  leftHandrail.castShadow = true;
  leftHandrail.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const rightHandrail = new THREE.InstancedMesh(
    handrailLinkGeo,
    materials.oakHardwood,
    RENO_CLEAT_COUNT,
  );
  rightHandrail.name = "right-articulated-travelling-handrail";
  rightHandrail.castShadow = true;
  rightHandrail.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const leftHandrailPlates = new THREE.InstancedMesh(
    handrailPlateGeo,
    materials.structuralSteel,
    RENO_CLEAT_COUNT,
  );
  leftHandrailPlates.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const rightHandrailPlates = new THREE.InstancedMesh(
    handrailPlateGeo,
    materials.structuralSteel,
    RENO_CLEAT_COUNT,
  );
  rightHandrailPlates.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const lightRailPiece = new THREE.Color(0xf4cd8a);
  const darkRailPiece = new THREE.Color(0x633514);
  for (let index = 0; index < RENO_CLEAT_COUNT; index++) {
    const railPieceColor = index % 2 === 0 ? lightRailPiece : darkRailPiece;
    leftHandrail.setColorAt(index, railPieceColor);
    rightHandrail.setColorAt(index, railPieceColor);
  }
  if (leftHandrail.instanceColor) leftHandrail.instanceColor.needsUpdate = true;
  if (rightHandrail.instanceColor) rightHandrail.instanceColor.needsUpdate = true;
  root.add(leftHandrail, rightHandrail, leftHandrailPlates, rightHandrailPlates);

  // The source calls the belt wheels 3 and rail wheels 6 sprockets. A single
  // notched pitch radius is used by all of them, so link seat speed is v = ωR.
  const beltSprocketGeo = trackGeo(
    createNotchedSprocketGeometry(RENO_CONVEYOR_SHEAVE_RADIUS_M, RENO_SPROCKET_SEAT_COUNT, 0.16),
  );
  const handrailSprocketGeo = trackGeo(
    createNotchedSprocketGeometry(RENO_CONVEYOR_SHEAVE_RADIUS_M, RENO_SPROCKET_SEAT_COUNT, 0.12),
  );
  const headSheaves: THREE.Mesh[] = [];
  const tailSheaves: THREE.Mesh[] = [];
  const headHandrailSprockets: THREE.Mesh[] = [];
  const tailHandrailSprockets: THREE.Mesh[] = [];
  for (const z of [-0.98, 0.98]) {
    const head = new THREE.Mesh(beltSprocketGeo, materials.castIronGears);
    head.castShadow = true;
    const tail = new THREE.Mesh(beltSprocketGeo, materials.castIronGears);
    tail.castShadow = true;
    head.position.z = z;
    tail.position.z = z;
    root.add(head, tail);
    headSheaves.push(head);
    tailSheaves.push(tail);
  }
  for (const z of RENO_HANDRAIL_Z_POSITIONS) {
    const head = new THREE.Mesh(handrailSprocketGeo, materials.castIronGears);
    head.castShadow = true;
    const tail = new THREE.Mesh(handrailSprocketGeo, materials.castIronGears);
    tail.castShadow = true;
    head.position.z = z;
    tail.position.z = z;
    root.add(head, tail);
    headHandrailSprockets.push(head);
    tailHandrailSprockets.push(tail);
  }

  // Reno shows rail wheel 6 secured on shaft 13. These visible shafts pass
  // through both side wheels, making their shared no-slip angular state a
  // physical linkage rather than two numerically synchronized decorations.
  const handrailShaftGeometry = trackGeo(
    new THREE.CylinderGeometry(0.065, 0.065, 2.96, 12).rotateX(Math.PI / 2),
  );
  const topHandrailDriveShaft = new THREE.Mesh(handrailShaftGeometry, materials.structuralSteel);
  topHandrailDriveShaft.name = "shaft-13-top-handrail-linkage";
  topHandrailDriveShaft.castShadow = true;
  const bottomHandrailSupportShaft = new THREE.Mesh(
    handrailShaftGeometry.clone(),
    materials.structuralSteel,
  );
  disposableGeometries.push(bottomHandrailSupportShaft.geometry);
  bottomHandrailSupportShaft.name = "shaft-13-bottom-handrail-linkage";
  bottomHandrailSupportShaft.castShadow = true;
  root.add(topHandrailDriveShaft, bottomHandrailSupportShaft);

  // Casings 20 enclose the rail sprockets at both landings while leaving the
  // moving plates and teeth visible. Their long roof covers adjacent rail
  // segments, as the source drawing describes.
  const buildHandrailSprocketCasing = (): THREE.Group => {
    const casing = new THREE.Group();
    casing.name = "terminal-casing-20-handrail-sprocket";
    const roof = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(1.42, 0.1, 0.38)),
      materials.structuralSteel,
    );
    roof.position.set(0, 0.57, 0);
    const leftWall = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.1, 0.58, 0.38)),
      materials.structuralSteel,
    );
    leftWall.position.set(-0.61, 0.29, 0);
    const rightWall = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.1, 0.58, 0.38)),
      materials.structuralSteel,
    );
    rightWall.position.set(0.61, 0.29, 0);
    casing.add(roof, leftWall, rightWall);
    return casing;
  };
  const headHandrailCasings = RENO_HANDRAIL_Z_POSITIONS.map(() => {
    const casing = buildHandrailSprocketCasing();
    root.add(casing);
    return casing;
  });
  const tailHandrailCasings = RENO_HANDRAIL_Z_POSITIONS.map(() => {
    const casing = buildHandrailSprocketCasing();
    root.add(casing);
    return casing;
  });

  const nodes: RenoEscalatorModelNodes = {
    root,
    inclineFrame,
    trussGroup,
    balustradesGroup,
    solidPanelMesh,
    cutawayPanelMesh,
    cleatDeckGroup,
    cleatSlats,
    cleatRollers,
    cleatHinges,
    cleatCount: RENO_CLEAT_COUNT,
    cleatLoopLengthM: RENO_CONVEYOR_LOOP_LENGTH_M,
    topCombPlate,
    bottomCombPlate,
    leftHandrail,
    rightHandrail,
    leftHandrailPlates,
    rightHandrailPlates,
    headSheaves,
    tailSheaves,
    headHandrailSprockets,
    tailHandrailSprockets,
    inclinedHandrailChannels,
    headHandrailCasings,
    tailHandrailCasings,
    topHandrailDriveShaft,
    bottomHandrailSupportShaft,
    topLanding,
    bottomLanding,
    layout: initialLayout,
  };

  updateRenoEscalatorIncline(nodes, inclineAngleDeg);
  updateRenoEscalatorKinematics(nodes, materials, 0, true);

  const dispose = () => {
    for (const geometry of disposableGeometries) geometry.dispose();
    for (const material of disposableMaterials) material.dispose();
    for (const texture of disposableTextures) texture.dispose();
  };

  return { root, nodes, materials, dispose };
}

/**
 * Applies the source geometry in place. This is deliberately separate from
 * model construction: the incline slider must retain the canvas, camera,
 * WebGL context, and chain phase.
 */
export function updateRenoEscalatorIncline(
  nodes: RenoEscalatorModelNodes,
  inclineAngleDeg: number,
) {
  const layout = createRenoEscalatorLayout(inclineAngleDeg);
  nodes.layout = layout;
  nodes.inclineFrame.rotation.z = layout.inclineAngleRad;

  const bottomCombPose = renoConveyorPose(layout.bottomCombDistanceM, layout);
  const topCombPose = renoConveyorPose(layout.topCombDistanceM, layout);
  nodes.bottomCombPlate.position.set(bottomCombPose.x - 0.2, bottomCombPose.y + 0.11, 0);
  nodes.bottomCombPlate.rotation.z = 0;
  nodes.topCombPlate.position.set(topCombPose.x + 0.2, topCombPose.y + 0.11, 0);
  nodes.topCombPlate.rotation.z = 0;

  nodes.bottomLanding.position.set(
    nodes.bottomCombPlate.position.x - 0.55,
    nodes.bottomCombPlate.position.y - 0.39,
    0,
  );
  nodes.topLanding.position.set(
    nodes.topCombPlate.position.x + 0.55,
    nodes.topCombPlate.position.y - 0.39,
    0,
  );

  for (const sheave of nodes.headSheaves) {
    sheave.position.set(
      layout.headSprocketCenter.x,
      layout.headSprocketCenter.y,
      sheave.position.z,
    );
  }
  for (const sheave of nodes.tailSheaves) {
    sheave.position.set(
      layout.tailSprocketCenter.x,
      layout.tailSprocketCenter.y,
      sheave.position.z,
    );
  }
  const normalX = -Math.sin(layout.inclineAngleRad) * RENO_HANDRAIL_OFFSET_M;
  const normalY = Math.cos(layout.inclineAngleRad) * RENO_HANDRAIL_OFFSET_M;
  for (const sprocket of nodes.headHandrailSprockets) {
    sprocket.position.set(
      layout.headSprocketCenter.x + normalX,
      layout.headSprocketCenter.y + normalY,
      sprocket.position.z,
    );
  }
  for (const sprocket of nodes.tailHandrailSprockets) {
    sprocket.position.set(
      layout.tailSprocketCenter.x + normalX,
      layout.tailSprocketCenter.y + normalY,
      sprocket.position.z,
    );
  }
  const headHandrailCenterX = layout.headSprocketCenter.x + normalX;
  const headHandrailCenterY = layout.headSprocketCenter.y + normalY;
  const tailHandrailCenterX = layout.tailSprocketCenter.x + normalX;
  const tailHandrailCenterY = layout.tailSprocketCenter.y + normalY;
  nodes.topHandrailDriveShaft.position.set(headHandrailCenterX, headHandrailCenterY, 0);
  nodes.bottomHandrailSupportShaft.position.set(tailHandrailCenterX, tailHandrailCenterY, 0);
  for (const [index, casing] of nodes.headHandrailCasings.entries()) {
    casing.position.set(headHandrailCenterX, headHandrailCenterY, RENO_HANDRAIL_Z_POSITIONS[index]);
  }
  for (const [index, casing] of nodes.tailHandrailCasings.entries()) {
    casing.position.set(tailHandrailCenterX, tailHandrailCenterY, RENO_HANDRAIL_Z_POSITIONS[index]);
  }
}

/**
 * Updates one shared fixed-pitch chain state. The pitch circle is never
 * elastically scaled: v = ωR is exact for belt, handrails, and linked wheel 6.
 */
export function updateRenoEscalatorKinematics(
  nodes: RenoEscalatorModelNodes,
  _materials: RenoEscalatorMaterials,
  beltTravelM: number,
  cutawayMode: boolean,
) {
  const instancePitchM = nodes.cleatLoopLengthM / nodes.cleatCount;
  for (let i = 0; i < nodes.cleatCount; i++) {
    const hingeDistanceM = i * instancePitchM + beltTravelM;
    const slatPose = renoConveyorPose(hingeDistanceM + instancePitchM / 2, nodes.layout);
    RENO_CONVEYOR_POSE_OBJECT.position.set(slatPose.x, slatPose.y, 0);
    RENO_CONVEYOR_POSE_OBJECT.rotation.set(0, 0, slatPose.tangentAngleRad);
    RENO_CONVEYOR_POSE_OBJECT.updateMatrix();
    nodes.cleatSlats.setMatrixAt(i, RENO_CONVEYOR_POSE_OBJECT.matrix);
    nodes.cleatRollers.setMatrixAt(i, RENO_CONVEYOR_POSE_OBJECT.matrix);

    const hingePose = renoConveyorPose(hingeDistanceM, nodes.layout);
    RENO_HINGE_POSE_OBJECT.position.set(hingePose.x, hingePose.y, 0);
    RENO_HINGE_POSE_OBJECT.rotation.set(0, 0, hingePose.tangentAngleRad);
    RENO_HINGE_POSE_OBJECT.updateMatrix();
    nodes.cleatHinges.setMatrixAt(i, RENO_HINGE_POSE_OBJECT.matrix);

    const railPose = renoHandrailPose(hingeDistanceM + instancePitchM / 2, nodes.layout);
    for (const [rail, plates, z] of [
      [nodes.leftHandrail, nodes.leftHandrailPlates, RENO_HANDRAIL_Z_POSITIONS[0]],
      [nodes.rightHandrail, nodes.rightHandrailPlates, RENO_HANDRAIL_Z_POSITIONS[1]],
    ] as const) {
      RENO_HANDRAIL_POSE_OBJECT.position.set(railPose.x, railPose.y, z);
      RENO_HANDRAIL_POSE_OBJECT.rotation.set(0, 0, railPose.tangentAngleRad);
      RENO_HANDRAIL_POSE_OBJECT.updateMatrix();
      rail.setMatrixAt(i, RENO_HANDRAIL_POSE_OBJECT.matrix);
      plates.setMatrixAt(i, RENO_HANDRAIL_POSE_OBJECT.matrix);
    }
  }
  nodes.cleatSlats.instanceMatrix.needsUpdate = true;
  nodes.cleatRollers.instanceMatrix.needsUpdate = true;
  nodes.cleatHinges.instanceMatrix.needsUpdate = true;
  nodes.leftHandrail.instanceMatrix.needsUpdate = true;
  nodes.rightHandrail.instanceMatrix.needsUpdate = true;
  nodes.leftHandrailPlates.instanceMatrix.needsUpdate = true;
  nodes.rightHandrailPlates.instanceMatrix.needsUpdate = true;

  const pitchAngleRad = beltTravelM / RENO_CONVEYOR_SHEAVE_RADIUS_M;
  const headAngleRad = nodes.layout.headSprocketPhaseRad - pitchAngleRad;
  const tailAngleRad = nodes.layout.tailSprocketPhaseRad - pitchAngleRad;
  for (const sprocket of nodes.headSheaves) sprocket.rotation.z = headAngleRad;
  for (const sprocket of nodes.tailSheaves) sprocket.rotation.z = tailAngleRad;
  for (const sprocket of nodes.headHandrailSprockets) sprocket.rotation.z = headAngleRad;
  for (const sprocket of nodes.tailHandrailSprockets) sprocket.rotation.z = tailAngleRad;
  nodes.topHandrailDriveShaft.rotation.z = headAngleRad;
  nodes.bottomHandrailSupportShaft.rotation.z = tailAngleRad;

  nodes.solidPanelMesh.visible = !cutawayMode;
  nodes.cutawayPanelMesh.visible = cutawayMode;
}
