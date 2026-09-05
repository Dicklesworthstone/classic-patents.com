import { ensureRoombaWasm, tryRoombaWasmStep } from "./roombaWasm";
import { globalTransportBus, type TapeUpdater } from "./useFrankenSimPhysics";
export interface RoombaControls {
  wheelSpeedMps: number;
  turnRateRadSec: number;
  roomWidth: number;
  roomHeight: number;
  /** Height of the downward sensor above the expected floor, in inches. */
  sensorHeightInches?: number;
  /** Wall range used by the lateral sensor, in inches. */
  wallDistanceInches?: number;
  /** Claim 1 optical emitter/detector and redirect circuit are present. */
  opticalSensorEnabled?: boolean;
  /** Transport-level pause control; false preserves the last kernel tape. */
  running?: boolean;
}

export const ROOMBA_ROOM = { width: 4, height: 4 } as const;

export function readRoombaControls(
  params: Record<string, number | boolean | undefined> = {},
): RoombaControls {
  const speed = params.wheelSpeedMps ?? params.speed ?? params.driveSpeed;
  const turnRate = params.turnRateRadSec ?? params.turnRate ?? params.deflectionRate;
  const optical =
    params.opticalSensorEnabled ?? params.opticalSensor ?? params.optical ?? params.claim1Optical;

  return {
    wheelSpeedMps: typeof speed === "number" && Number.isFinite(speed) ? speed : 0.3,
    turnRateRadSec: typeof turnRate === "number" && Number.isFinite(turnRate) ? turnRate : 1.5,
    roomWidth:
      typeof params.roomWidth === "number" && Number.isFinite(params.roomWidth)
        ? params.roomWidth
        : ROOMBA_ROOM.width,
    roomHeight:
      typeof params.roomHeight === "number" && Number.isFinite(params.roomHeight)
        ? params.roomHeight
        : ROOMBA_ROOM.height,
    sensorHeightInches:
      typeof params.sensorHeightInches === "number" && Number.isFinite(params.sensorHeightInches)
        ? params.sensorHeightInches
        : 0.5,
    wallDistanceInches:
      typeof params.wallDistanceInches === "number" && Number.isFinite(params.wallDistanceInches)
        ? params.wallDistanceInches
        : undefined,
    opticalSensorEnabled:
      typeof optical === "boolean" ? optical : typeof optical === "number" ? optical >= 0.5 : true,
    running: typeof params.running === "boolean" ? params.running : true,
  };
}

export interface RoombaFurnitureAssembly {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}

export interface RoombaEnvironmentPart {
  id: string;
  assemblyId: string;
  x: number;
  y: number;
  w: number;
  h: number;
  centerHeight: number;
  height: number;
  kind: "top" | "seat" | "back" | "leg";
  /** True only when the solid reaches the robot's bumper height. */
  collidesWithRobot: boolean;
}

/**
 * One physical room receipt shared by collision, Canvas, and Three.js.
 * Furniture is an assembly of supported solids rather than a hovering AABB.
 */
export const ROOMBA_FURNITURE: readonly RoombaFurnitureAssembly[] = [
  { id: "coffee-table", x: -1.2, y: -0.6, w: 0.9, h: 0.65, label: "Coffee Table" },
  { id: "armchair", x: 1.0, y: 0.5, w: 0.72, h: 0.72, label: "Armchair" },
];

const table = ROOMBA_FURNITURE[0];
const chair = ROOMBA_FURNITURE[1];
const tableLegInsetX = table.w / 2 - 0.09;
const tableLegInsetY = table.h / 2 - 0.09;
const chairLegInset = 0.25;

export const ROOMBA_ENVIRONMENT_PARTS: readonly RoombaEnvironmentPart[] = [
  {
    id: "coffee-table-top",
    assemblyId: table.id,
    x: table.x,
    y: table.y,
    w: table.w,
    h: table.h,
    centerHeight: 0.39,
    height: 0.08,
    kind: "top",
    collidesWithRobot: false,
  },
  ...([-1, 1] as const).flatMap((sx) =>
    ([-1, 1] as const).map((sy) => ({
      id: `coffee-table-leg-${sx}-${sy}`,
      assemblyId: table.id,
      x: table.x + sx * tableLegInsetX,
      y: table.y + sy * tableLegInsetY,
      w: 0.1,
      h: 0.1,
      centerHeight: 0.175,
      height: 0.35,
      kind: "leg" as const,
      collidesWithRobot: true,
    })),
  ),
  {
    id: "armchair-seat",
    assemblyId: chair.id,
    x: chair.x,
    y: chair.y,
    w: chair.w,
    h: chair.h,
    centerHeight: 0.34,
    height: 0.16,
    kind: "seat",
    collidesWithRobot: false,
  },
  {
    id: "armchair-back",
    assemblyId: chair.id,
    x: chair.x,
    y: chair.y + chair.h / 2 - 0.06,
    w: chair.w,
    h: 0.12,
    centerHeight: 0.72,
    height: 0.76,
    kind: "back",
    collidesWithRobot: false,
  },
  ...([-1, 1] as const).flatMap((sx) =>
    ([-1, 1] as const).map((sy) => ({
      id: `armchair-leg-${sx}-${sy}`,
      assemblyId: chair.id,
      x: chair.x + sx * chairLegInset,
      y: chair.y + sy * chairLegInset,
      w: 0.11,
      h: 0.11,
      centerHeight: 0.13,
      height: 0.26,
      kind: "leg" as const,
      collidesWithRobot: true,
    })),
  ),
];

export const ROOMBA_COLLIDERS = ROOMBA_ENVIRONMENT_PARTS.filter((part) => part.collidesWithRobot);

const ROOMBA_BUMPER_M = 0.17;
const ROOMBA_TRACK_WIDTH_M = 0.24;
const ROOMBA_WHEEL_RADIUS_M = 0.035;
const INCHES_PER_METER = 39.37007874015748;

interface ProjectionResult {
  x: number;
  y: number;
  hit: boolean;
  normalX: number;
  normalY: number;
}

export function projectRoombaOutsidePart(
  x: number,
  y: number,
  obs: Pick<RoombaEnvironmentPart, "x" | "y" | "w" | "h">,
): ProjectionResult {
  const r = ROOMBA_BUMPER_M;
  const minX = obs.x - obs.w / 2;
  const maxX = obs.x + obs.w / 2;
  const minY = obs.y - obs.h / 2;
  const maxY = obs.y + obs.h / 2;
  const closestX = Math.max(minX, Math.min(maxX, x));
  const closestY = Math.max(minY, Math.min(maxY, y));
  const dx = x - closestX;
  const dy = y - closestY;
  const distance = Math.hypot(dx, dy);

  if (distance >= r - 1e-9) return { x, y, hit: false, normalX: 0, normalY: 0 };
  if (distance > 1e-9) {
    const normalX = dx / distance;
    const normalY = dy / distance;
    return {
      x: closestX + normalX * r,
      y: closestY + normalY * r,
      hit: true,
      normalX,
      normalY,
    };
  }

  // The robot center is inside the solid footprint. Exit through the nearest
  // face of the Minkowski-expanded AABB; never invent a diagonal normal.
  const exits = [
    { distance: x - minX, x: minX - r, y, normalX: -1, normalY: 0 },
    { distance: maxX - x, x: maxX + r, y, normalX: 1, normalY: 0 },
    { distance: y - minY, x, y: minY - r, normalX: 0, normalY: -1 },
    { distance: maxY - y, x, y: maxY + r, normalX: 0, normalY: 1 },
  ];
  const exit = exits.reduce((best, candidate) =>
    candidate.distance < best.distance ? candidate : best,
  );
  return { ...exit, hit: true };
}

function furnitureContact(x: number, y: number) {
  for (const part of ROOMBA_COLLIDERS) {
    const projection = projectRoombaOutsidePart(x, y, part);
    if (projection.hit) return { part, projection };
  }
  return null;
}

function rayDistanceToExpandedPart(
  x: number,
  y: number,
  directionX: number,
  directionY: number,
  part: Pick<RoombaEnvironmentPart, "x" | "y" | "w" | "h">,
): number {
  const minX = part.x - part.w / 2 - ROOMBA_BUMPER_M;
  const maxX = part.x + part.w / 2 + ROOMBA_BUMPER_M;
  const minY = part.y - part.h / 2 - ROOMBA_BUMPER_M;
  const maxY = part.y + part.h / 2 + ROOMBA_BUMPER_M;
  let entry = 0;
  let exit = Number.POSITIVE_INFINITY;

  for (const [origin, direction, min, max] of [
    [x, directionX, minX, maxX],
    [y, directionY, minY, maxY],
  ] as const) {
    if (Math.abs(direction) < 1e-12) {
      if (origin < min || origin > max) return Number.POSITIVE_INFINITY;
      continue;
    }
    const first = (min - origin) / direction;
    const second = (max - origin) / direction;
    entry = Math.max(entry, Math.min(first, second));
    exit = Math.min(exit, Math.max(first, second));
    if (exit < entry) return Number.POSITIVE_INFINITY;
  }
  return exit < 0 ? Number.POSITIVE_INFINITY : Math.max(0, entry);
}

function modeledWallDistanceInches(
  x: number,
  y: number,
  heading: number,
  roomWidth: number,
  roomHeight: number,
): number {
  const directionX = Math.cos(heading);
  const directionY = Math.sin(heading);
  const minX = -roomWidth / 2 + ROOMBA_BUMPER_M;
  const maxX = roomWidth / 2 - ROOMBA_BUMPER_M;
  const minY = -roomHeight / 2 + ROOMBA_BUMPER_M;
  const maxY = roomHeight / 2 - ROOMBA_BUMPER_M;
  const wallX =
    directionX > 1e-12
      ? (maxX - x) / directionX
      : directionX < -1e-12
        ? (minX - x) / directionX
        : Number.POSITIVE_INFINITY;
  const wallY =
    directionY > 1e-12
      ? (maxY - y) / directionY
      : directionY < -1e-12
        ? (minY - y) / directionY
        : Number.POSITIVE_INFINITY;
  let nearest = Math.min(wallX, wallY);
  for (const part of ROOMBA_COLLIDERS) {
    nearest = Math.min(nearest, rayDistanceToExpandedPart(x, y, directionX, directionY, part));
  }
  return Math.max(0, nearest) * INCHES_PER_METER;
}

export interface RoombaState {
  x: number;
  y: number;
  heading: number; // radians
  mode: "spiral" | "straight" | "turn" | "backup";
  timeInMode: number;
  randomSeed: number;
  displayX: number;
  displayY: number;
  /** Source-bounded optical telemetry shared by the 2D and 3D faces. */
  opticalSensorEnabled: boolean;
  surfaceOverlapFraction: number;
  surfacePresent: boolean;
  wallPresent: boolean;
  redirectReason: "none" | "surface-absent" | "wall-detected";
  contactPartId: string | null;
  contactNormalX: number;
  contactNormalY: number;
  leftWheelSpeedMps: number;
  rightWheelSpeedMps: number;
  leftWheelAngleRad: number;
  rightWheelAngleRad: number;
  sideBrushAngleRad: number;
  /** Actual law owner for this accepted step; never inferred from module load. */
  runtimeSource: "wasm" | "ts-fallback";
}

function nextRandom(seed: number) {
  return (Math.imul(seed, 1103515245) + 12345) & 0x7fffffff;
}

function isRoombaMode(value: unknown): value is RoombaState["mode"] {
  return value === "spiral" || value === "straight" || value === "turn" || value === "backup";
}

export function initialRoombaState(): RoombaState {
  return {
    x: 0,
    y: 0,
    heading: 0,
    mode: "spiral",
    timeInMode: 0,
    randomSeed: 42,
    displayX: 0,
    displayY: 0,
    opticalSensorEnabled: true,
    surfaceOverlapFraction: 1,
    surfacePresent: true,
    wallPresent: false,
    redirectReason: "none",
    contactPartId: null,
    contactNormalX: 0,
    contactNormalY: 0,
    leftWheelSpeedMps: 0,
    rightWheelSpeedMps: 0,
    leftWheelAngleRad: 0,
    rightWheelAngleRad: 0,
    sideBrushAngleRad: 0,
    runtimeSource: "ts-fallback",
  };
}

function assertAdmittedRoombaStep(
  controls: RoombaControls,
  previous: RoombaState,
  dt: number,
): void {
  const sensorHeightInches = controls.sensorHeightInches ?? 0.5;
  if (
    ![
      controls.wheelSpeedMps,
      controls.turnRateRadSec,
      controls.roomWidth,
      controls.roomHeight,
      sensorHeightInches,
      dt,
      previous.x,
      previous.y,
      previous.heading,
      previous.timeInMode,
      previous.leftWheelAngleRad,
      previous.rightWheelAngleRad,
      previous.sideBrushAngleRad,
    ].every(Number.isFinite) ||
    controls.wheelSpeedMps < 0 ||
    controls.turnRateRadSec < 0 ||
    controls.roomWidth <= 2 * ROOMBA_BUMPER_M ||
    controls.roomHeight <= 2 * ROOMBA_BUMPER_M ||
    sensorHeightInches < 0 ||
    dt <= 0 ||
    dt > 0.25 ||
    previous.timeInMode < 0 ||
    !isRoombaMode(previous.mode) ||
    !Number.isInteger(previous.randomSeed) ||
    previous.randomSeed < 0 ||
    previous.randomSeed > 0xffff_ffff ||
    (controls.opticalSensorEnabled !== undefined &&
      typeof controls.opticalSensorEnabled !== "boolean") ||
    (typeof controls.wallDistanceInches === "number" &&
      (!Number.isFinite(controls.wallDistanceInches) || controls.wallDistanceInches < 0))
  ) {
    throw new RangeError("Roomba controls, state, or fixed step are outside the admitted domain");
  }
}

export function roombaChassisSpeedMps(state: RoombaState): number {
  return (state.leftWheelSpeedMps + state.rightWheelSpeedMps) / 2;
}

function stepRoombaFallback(c: RoombaControls, previous: RoombaState, dt: number): RoombaState {
  const state: RoombaState = { ...previous, runtimeSource: "ts-fallback" };

  const speed = c.wheelSpeedMps;
  const turnSpeed = c.turnRateRadSec;
  const roomWidth = c.roomWidth ?? ROOMBA_ROOM.width;
  const roomHeight = c.roomHeight ?? ROOMBA_ROOM.height;
  const sensorHeightInches = c.sensorHeightInches ?? 0.5;
  const opticalSensorEnabled = c.opticalSensorEnabled ?? true;
  const explicitWallDistance = c.wallDistanceInches;
  const wallDistanceInches =
    typeof explicitWallDistance === "number" &&
    Number.isFinite(explicitWallDistance) &&
    explicitWallDistance >= 0
      ? explicitWallDistance
      : modeledWallDistanceInches(state.x, state.y, state.heading, roomWidth, roomHeight);

  // The patent's measurement is the overlap of emitter field and detector
  // field, not a generic brightness or map estimate. The preferred cliff
  // geometry reports full overlap near nominal height and loses overlap as a
  // stair/drop moves the surface away. The wall embodiment uses a finite
  // intersection around the described 2.6 inch range.
  const surfaceOverlapFraction = Math.max(
    0,
    Math.min(1, 1 - Math.abs(sensorHeightInches - 0.5) / 0.5),
  );
  const surfacePresent = surfaceOverlapFraction > 0.2;
  const wallPresent = opticalSensorEnabled && wallDistanceInches <= 2.95;
  state.opticalSensorEnabled = opticalSensorEnabled;
  state.surfaceOverlapFraction = surfaceOverlapFraction;
  state.surfacePresent = surfacePresent;
  state.wallPresent = wallPresent;
  state.redirectReason = !opticalSensorEnabled
    ? "none"
    : !surfacePresent
      ? "surface-absent"
      : wallPresent
        ? "wall-detected"
        : "none";

  state.timeInMode += dt;

  const isBumping =
    state.x > roomWidth / 2 - ROOMBA_BUMPER_M ||
    state.x < -roomWidth / 2 + ROOMBA_BUMPER_M ||
    state.y > roomHeight / 2 - ROOMBA_BUMPER_M ||
    state.y < -roomHeight / 2 + ROOMBA_BUMPER_M ||
    furnitureContact(state.x, state.y) !== null;

  if (
    ((opticalSensorEnabled && !surfacePresent) || isBumping) &&
    state.mode !== "backup" &&
    state.mode !== "turn"
  ) {
    state.mode = "backup";
    state.timeInMode = 0;
  }
  if (wallPresent && state.mode !== "backup" && state.mode !== "turn") {
    state.mode = "turn";
    state.timeInMode = 0;
  }

  if (state.mode === "backup" && state.timeInMode > 0.4) {
    state.mode = "turn";
    state.timeInMode = 0;
    state.randomSeed = nextRandom(state.randomSeed);
  } else if (state.mode === "turn") {
    const turnDuration = 0.4 + ((state.randomSeed % 100) / 100) * 1.2;
    if (state.timeInMode > turnDuration) {
      state.mode = "straight";
      state.timeInMode = 0;
    }
  }

  let leftWheelSpeedMps = 0;
  let rightWheelSpeedMps = 0;

  if (state.mode === "spiral") {
    const radius = 0.12 + state.timeInMode * 0.045;
    const yawRate = speed / radius;
    leftWheelSpeedMps = speed - (yawRate * ROOMBA_TRACK_WIDTH_M) / 2;
    rightWheelSpeedMps = speed + (yawRate * ROOMBA_TRACK_WIDTH_M) / 2;
  } else if (state.mode === "straight") {
    leftWheelSpeedMps = speed;
    rightWheelSpeedMps = speed;
  } else if (state.mode === "backup") {
    leftWheelSpeedMps = -speed;
    rightWheelSpeedMps = -speed;
  } else if (state.mode === "turn") {
    leftWheelSpeedMps = -(turnSpeed * ROOMBA_TRACK_WIDTH_M) / 2;
    rightWheelSpeedMps = (turnSpeed * ROOMBA_TRACK_WIDTH_M) / 2;
  }

  // Exact constant-twist SE(2) integration mirrors fs-mbd::planar_drive.
  const linearSpeedMps = (leftWheelSpeedMps + rightWheelSpeedMps) / 2;
  const angularSpeedRadSec = (rightWheelSpeedMps - leftWheelSpeedMps) / ROOMBA_TRACK_WIDTH_M;
  const nextHeading = state.heading + angularSpeedRadSec * dt;
  if (Math.abs(angularSpeedRadSec) <= 1e-12) {
    const distanceM = linearSpeedMps * dt;
    state.x += distanceM * Math.cos(state.heading);
    state.y += distanceM * Math.sin(state.heading);
  } else {
    const radiusM = linearSpeedMps / angularSpeedRadSec;
    state.x += radiusM * (Math.sin(nextHeading) - Math.sin(state.heading));
    state.y += -radiusM * (Math.cos(nextHeading) - Math.cos(state.heading));
  }
  state.heading = nextHeading;
  state.leftWheelAngleRad += (leftWheelSpeedMps / ROOMBA_WHEEL_RADIUS_M) * dt;
  state.rightWheelAngleRad += (rightWheelSpeedMps / ROOMBA_WHEEL_RADIUS_M) * dt;

  // --- SOTA Penetration Resolution & Anti-Clipping Boundaries (Zero Geometry Clipping) ---
  const minX = -roomWidth / 2 + ROOMBA_BUMPER_M;
  const maxX = roomWidth / 2 - ROOMBA_BUMPER_M;
  const minY = -roomHeight / 2 + ROOMBA_BUMPER_M;
  const maxY = roomHeight / 2 - ROOMBA_BUMPER_M;

  state.contactPartId = null;
  state.contactNormalX = 0;
  state.contactNormalY = 0;
  // 1. Perimeter wall kinematic non-penetration projection.
  if (state.x < minX) {
    state.x = minX;
    state.contactPartId = "room-wall";
    state.contactNormalX = 1;
  } else if (state.x > maxX) {
    state.x = maxX;
    state.contactPartId = "room-wall";
    state.contactNormalX = -1;
  }
  if (state.y < minY) {
    state.y = minY;
    state.contactPartId = "room-wall";
    state.contactNormalX = 0;
    state.contactNormalY = 1;
  } else if (state.y > maxY) {
    state.y = maxY;
    state.contactPartId = "room-wall";
    state.contactNormalX = 0;
    state.contactNormalY = -1;
  }

  // 2. Low-furniture solid projection uses the same collider receipt as WASM.
  for (const part of ROOMBA_COLLIDERS) {
    const projection = projectRoombaOutsidePart(state.x, state.y, part);
    if (!projection.hit) continue;
    state.x = projection.x;
    state.y = projection.y;
    state.contactPartId = part.id;
    state.contactNormalX = projection.normalX;
    state.contactNormalY = projection.normalY;
    if (state.mode !== "backup" && state.mode !== "turn") {
      state.mode = "backup";
      state.timeInMode = 0;
      leftWheelSpeedMps = -speed;
      rightWheelSpeedMps = -speed;
    }
  }

  if (state.contactPartId && state.mode !== "backup" && state.mode !== "turn") {
    state.mode = "backup";
    state.timeInMode = 0;
    leftWheelSpeedMps = -speed;
    rightWheelSpeedMps = -speed;
  }

  state.leftWheelSpeedMps = leftWheelSpeedMps;
  state.rightWheelSpeedMps = rightWheelSpeedMps;
  const meanAbsWheelSpeed = (Math.abs(leftWheelSpeedMps) + Math.abs(rightWheelSpeedMps)) / 2;
  state.sideBrushAngleRad += 60 * meanAbsWheelSpeed * dt;

  state.displayX = state.x;
  state.displayY = state.y;

  return state;
}

export function stepRoomba(c: RoombaControls, s?: RoombaState, dt: number = 1 / 120): RoombaState {
  const previous = s ? { ...s } : initialRoombaState();
  const controls: RoombaControls = {
    ...c,
    roomWidth: c.roomWidth ?? ROOMBA_ROOM.width,
    roomHeight: c.roomHeight ?? ROOMBA_ROOM.height,
  };
  assertAdmittedRoombaStep(controls, previous, dt);
  const wasm = tryRoombaWasmStep({
    controls,
    previous,
    dt,
    colliders: ROOMBA_COLLIDERS,
  });
  return wasm ?? stepRoombaFallback(controls, previous, dt);
}

/**
 * Single shared tape for every Roomba face: one stepper, one state, no
 * per-face divergence. The transport bus owns the clock; faces only draw.
 */
let tapeState: RoombaState | undefined;

export function getRoombaTapeState(): RoombaState | undefined {
  return tapeState;
}

export function resetRoombaTapeState(): void {
  tapeState = undefined;
}

export function createRoombaTransportUpdater(getControls: () => RoombaControls): TapeUpdater {
  void ensureRoombaWasm();
  return (_prev, dt) => {
    const controls = getControls();
    if (controls.running === false) return null;
    const next = stepRoomba(controls, tapeState, dt);
    tapeState = next;
    globalTransportBus.setUpdaterProvenance(
      "us-6594844-roomba",
      next.runtimeSource === "wasm" ? "WASM" : "TS_FALLBACK",
    );
    return {
      refusal: next.opticalSensorEnabled
        ? { isRefused: false }
        : {
            isRefused: true,
            reason:
              "Claim 1 optical emitter/detector and surface-absence redirect circuit are disabled.",
          },
      machine: {
        poseXMeters: next.displayX,
        poseYMeters: next.displayY,
        headingRad: next.heading,
        modeLabel: next.mode,
        wheelSpeedMps: roombaChassisSpeedMps(next),
      },
    };
  };
}
