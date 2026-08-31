import type { TapeUpdater } from "./useFrankenSimPhysics";
export interface RoombaControls {
  wheelSpeedMps: number;
  turnRateRadSec: number;
  roomWidth: number;
  roomHeight: number;
  /** Height of the downward sensor above the expected floor, in inches. */
  sensorHeightInches?: number;
  /** Wall range used by the lateral sensor, in inches. */
  wallDistanceInches?: number;
}

/** Shared arena. 2D and 3D must step the same box (not 5×3.2 vs 4×4). */
export const ROOMBA_ROOM = { width: 4, height: 4 } as const;

/** Named furniture AABBs in room metres. Kernel owns the bump; faces only draw. */
export const ROOMBA_FURNITURE: readonly {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}[] = [
  { x: -1.2, y: -0.6, w: 0.8, h: 0.6, label: "Coffee Table" },
  { x: 1.0, y: 0.5, w: 0.6, h: 0.6, label: "Armchair" },
];

const ROOMBA_BUMPER_M = 0.17;

function hitsFurniture(x: number, y: number): boolean {
  const r = ROOMBA_BUMPER_M;
  for (const obs of ROOMBA_FURNITURE) {
    if (
      x > obs.x - obs.w / 2 - r &&
      x < obs.x + obs.w / 2 + r &&
      y > obs.y - obs.h / 2 - r &&
      y < obs.y + obs.h / 2 + r
    ) {
      return true;
    }
  }
  return false;
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
  surfaceOverlapFraction: number;
  surfacePresent: boolean;
  wallPresent: boolean;
  redirectReason: "none" | "surface-absent" | "wall-detected";
}

function nextRandom(seed: number) {
  return (seed * 1103515245 + 12345) & 0x7fffffff;
}

export function stepRoomba(c: RoombaControls, s?: RoombaState, dt: number = 1 / 120): RoombaState {
  const state: RoombaState = s
    ? { ...s }
    : {
        x: 0,
        y: 0,
        heading: 0,
        mode: "spiral",
        timeInMode: 0,
        randomSeed: 42,
        displayX: 0,
        displayY: 0,
        surfaceOverlapFraction: 1,
        surfacePresent: true,
        wallPresent: false,
        redirectReason: "none",
      };

  const speed = c.wheelSpeedMps;
  const turnSpeed = c.turnRateRadSec;
  const roomWidth = c.roomWidth ?? ROOMBA_ROOM.width;
  const roomHeight = c.roomHeight ?? ROOMBA_ROOM.height;
  const sensorHeightInches = c.sensorHeightInches ?? 0.5;
  const wallDistanceInches = c.wallDistanceInches ?? 2.6;

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
  const wallPresent = Math.abs(wallDistanceInches - 2.6) < 0.35;
  state.surfaceOverlapFraction = surfaceOverlapFraction;
  state.surfacePresent = surfacePresent;
  state.wallPresent = wallPresent;
  state.redirectReason = !surfacePresent
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
    hitsFurniture(state.x, state.y);

  if ((!surfacePresent || isBumping) && state.mode !== "backup" && state.mode !== "turn") {
    state.mode = "backup";
    state.timeInMode = 0;
  }
  if (wallPresent && state.mode === "straight") {
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

  let dx = 0;
  let dy = 0;
  let dtheta = 0;

  if (state.mode === "spiral") {
    const radius = 0.12 + state.timeInMode * 0.045;
    dtheta = speed / radius;
    dx = speed * Math.cos(state.heading);
    dy = speed * Math.sin(state.heading);
  } else if (state.mode === "straight") {
    dx = speed * Math.cos(state.heading);
    dy = speed * Math.sin(state.heading);
  } else if (state.mode === "backup") {
    dx = -speed * Math.cos(state.heading);
    dy = -speed * Math.sin(state.heading);
  } else if (state.mode === "turn") {
    dtheta = turnSpeed;
  }

  state.x += dx * dt;
  state.y += dy * dt;
  state.heading += dtheta * dt;

  // --- SOTA Penetration Resolution & Anti-Clipping Boundaries (Zero Geometry Clipping) ---
  const minX = -roomWidth / 2 + ROOMBA_BUMPER_M;
  const maxX = roomWidth / 2 - ROOMBA_BUMPER_M;
  const minY = -roomHeight / 2 + ROOMBA_BUMPER_M;
  const maxY = roomHeight / 2 - ROOMBA_BUMPER_M;

  // 1. Perimeter Wall Anti-Clipping Projection
  if (state.x < minX) state.x = minX;
  if (state.x > maxX) state.x = maxX;
  if (state.y < minY) state.y = minY;
  if (state.y > maxY) state.y = maxY;

  // 2. Obstacle Furniture SDF Anti-Clipping Projection
  for (const obs of ROOMBA_FURNITURE) {
    const halfW = obs.w / 2;
    const halfH = obs.h / 2;
    const clampedX = Math.max(obs.x - halfW, Math.min(obs.x + halfW, state.x));
    const clampedY = Math.max(obs.y - halfH, Math.min(obs.y + halfH, state.y));

    const deltaX = state.x - clampedX;
    const deltaY = state.y - clampedY;
    const distToSurface = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distToSurface < ROOMBA_BUMPER_M) {
      // Roomba penetrated furniture: project strictly onto bumper perimeter
      const normX = distToSurface > 1e-4 ? deltaX / distToSurface : state.x >= obs.x ? 1 : -1;
      const normY = distToSurface > 1e-4 ? deltaY / distToSurface : state.y >= obs.y ? 1 : -1;

      state.x = clampedX + normX * ROOMBA_BUMPER_M;
      state.y = clampedY + normY * ROOMBA_BUMPER_M;
    }
  }

  state.displayX = state.x;
  state.displayY = state.y;

  return state;
}

/**
 * Single shared tape for every Roomba face: one stepper, one state, no
 * per-face divergence. The transport bus owns the clock; faces only draw.
 */
let tapeState: RoombaState | undefined;

export function getRoombaTapeState(): RoombaState | undefined {
  return tapeState;
}

export function createRoombaTransportUpdater(getControls: () => RoombaControls): TapeUpdater {
  return (_prev, dt) => {
    const next = stepRoomba(getControls(), tapeState, dt);
    tapeState = next;
    return {
      machine: {
        poseXMeters: next.displayX,
        poseYMeters: next.displayY,
        headingRad: next.heading,
        modeLabel: next.mode,
        wheelSpeedMps: getControls().wheelSpeedMps,
      },
    };
  };
}
