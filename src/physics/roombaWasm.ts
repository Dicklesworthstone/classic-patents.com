import type { RoombaControls, RoombaEnvironmentPart, RoombaState } from "./roombaKernel";

export type RoombaKernelSource = "wasm" | "ts-fallback" | "unloaded";

type RoombaStepFn = (packet: Float64Array) => string;

interface RoombaWasmStep {
  x_m: number;
  y_m: number;
  heading_rad: number;
  mode: RoombaState["mode"];
  time_in_mode_s: number;
  random_seed: number;
  optical_sensor_enabled: boolean;
  surface_overlap_fraction: number;
  surface_present: boolean;
  wall_present: boolean;
  redirect_reason: RoombaState["redirectReason"];
  contact_index: number;
  contact_normal_x: number;
  contact_normal_y: number;
  left_wheel_speed_mps: number;
  right_wheel_speed_mps: number;
  left_wheel_angle_rad: number;
  right_wheel_angle_rad: number;
  side_brush_angle_rad: number;
}

export interface RoombaWasmExpectedStep {
  controls: RoombaControls;
  previous: RoombaState;
  dt: number;
  colliders: readonly RoombaEnvironmentPart[];
}

const BUMPER_RADIUS_M = 0.17;
const TRACK_WIDTH_M = 0.24;
const WHEEL_RADIUS_M = 0.035;
const PACKET_HEADER_WORDS = 18;
const MODE_CODE: Record<RoombaState["mode"], number> = {
  spiral: 0,
  straight: 1,
  turn: 2,
  backup: 3,
};

let roombaStepFn: RoombaStepFn | null = null;
let loadPromise: Promise<RoombaKernelSource> | null = null;
let source: RoombaKernelSource = "unloaded";

export function roombaKernelSource(): RoombaKernelSource {
  return source;
}

export function roombaPoseHudPresentation(
  provenance: "WASM" | "TS_FALLBACK" | "HONEST_PLACEHOLDER",
): { value: string; tone: "ok" | "warn" } {
  if (provenance === "WASM") return { value: "fs-mbd WASM", tone: "ok" };
  if (provenance === "TS_FALLBACK") return { value: "typed TS mirror", tone: "warn" };
  return { value: "awaiting step", tone: "warn" };
}

function finite(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function finiteIn(value: unknown, minimum: number, maximum: number): value is number {
  return finite(value) && value >= minimum && value <= maximum;
}

function closeEnough(actual: number, expected: number, tolerance = 1e-10): boolean {
  return (
    Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(actual), Math.abs(expected))
  );
}

function isMode(value: unknown): value is RoombaState["mode"] {
  return value === "spiral" || value === "straight" || value === "turn" || value === "backup";
}

function isRedirectReason(value: unknown): value is RoombaState["redirectReason"] {
  return value === "none" || value === "surface-absent" || value === "wall-detected";
}

function distanceFromRect(
  x: number,
  y: number,
  collider: Pick<RoombaEnvironmentPart, "x" | "y" | "w" | "h">,
): number {
  const closestX = Math.max(collider.x - collider.w / 2, Math.min(collider.x + collider.w / 2, x));
  const closestY = Math.max(collider.y - collider.h / 2, Math.min(collider.y + collider.h / 2, y));
  return Math.hypot(x - closestX, y - closestY);
}

interface ProjectedPose {
  x: number;
  y: number;
  contactIndex: number;
  contactNormalX: number;
  contactNormalY: number;
}

function projectOutsideRect(
  x: number,
  y: number,
  collider: Pick<RoombaEnvironmentPart, "x" | "y" | "w" | "h">,
): Omit<ProjectedPose, "contactIndex"> & { hit: boolean } {
  const minX = collider.x - collider.w / 2;
  const maxX = collider.x + collider.w / 2;
  const minY = collider.y - collider.h / 2;
  const maxY = collider.y + collider.h / 2;
  const closestX = Math.max(minX, Math.min(maxX, x));
  const closestY = Math.max(minY, Math.min(maxY, y));
  const dx = x - closestX;
  const dy = y - closestY;
  const distance = Math.hypot(dx, dy);
  if (distance >= BUMPER_RADIUS_M - 1e-9) {
    return { x, y, hit: false, contactNormalX: 0, contactNormalY: 0 };
  }
  if (distance > 1e-9) {
    const contactNormalX = dx / distance;
    const contactNormalY = dy / distance;
    return {
      x: closestX + contactNormalX * BUMPER_RADIUS_M,
      y: closestY + contactNormalY * BUMPER_RADIUS_M,
      hit: true,
      contactNormalX,
      contactNormalY,
    };
  }
  const exits = [
    { distance: x - minX, x: minX - BUMPER_RADIUS_M, y, contactNormalX: -1, contactNormalY: 0 },
    { distance: maxX - x, x: maxX + BUMPER_RADIUS_M, y, contactNormalX: 1, contactNormalY: 0 },
    { distance: y - minY, x, y: minY - BUMPER_RADIUS_M, contactNormalX: 0, contactNormalY: -1 },
    { distance: maxY - y, x, y: maxY + BUMPER_RADIUS_M, contactNormalX: 0, contactNormalY: 1 },
  ];
  const exit = exits.reduce((best, candidate) =>
    candidate.distance < best.distance ? candidate : best,
  );
  return { ...exit, hit: true };
}

function rayDistanceToExpandedRect(
  x: number,
  y: number,
  directionX: number,
  directionY: number,
  collider: Pick<RoombaEnvironmentPart, "x" | "y" | "w" | "h">,
): number {
  const minX = collider.x - collider.w / 2 - BUMPER_RADIUS_M;
  const maxX = collider.x + collider.w / 2 + BUMPER_RADIUS_M;
  const minY = collider.y - collider.h / 2 - BUMPER_RADIUS_M;
  const maxY = collider.y + collider.h / 2 + BUMPER_RADIUS_M;
  let entry = 0;
  let exit = Number.POSITIVE_INFINITY;

  for (const [origin, direction, minimum, maximum] of [
    [x, directionX, minX, maxX],
    [y, directionY, minY, maxY],
  ] as const) {
    if (Math.abs(direction) < 1e-12) {
      if (origin < minimum || origin > maximum) return Number.POSITIVE_INFINITY;
      continue;
    }
    const first = (minimum - origin) / direction;
    const second = (maximum - origin) / direction;
    entry = Math.max(entry, Math.min(first, second));
    exit = Math.min(exit, Math.max(first, second));
    if (exit < entry) return Number.POSITIVE_INFINITY;
  }
  return exit < 0 ? Number.POSITIVE_INFINITY : Math.max(0, entry);
}

function modeledWallDistanceInches(expected: RoombaWasmExpectedStep): number {
  const { controls, previous, colliders } = expected;
  const directionX = Math.cos(previous.heading);
  const directionY = Math.sin(previous.heading);
  const minX = -controls.roomWidth / 2 + BUMPER_RADIUS_M;
  const maxX = controls.roomWidth / 2 - BUMPER_RADIUS_M;
  const minY = -controls.roomHeight / 2 + BUMPER_RADIUS_M;
  const maxY = controls.roomHeight / 2 - BUMPER_RADIUS_M;
  const wallX =
    directionX > 1e-12
      ? (maxX - previous.x) / directionX
      : directionX < -1e-12
        ? (minX - previous.x) / directionX
        : Number.POSITIVE_INFINITY;
  const wallY =
    directionY > 1e-12
      ? (maxY - previous.y) / directionY
      : directionY < -1e-12
        ? (minY - previous.y) / directionY
        : Number.POSITIVE_INFINITY;
  let nearest = Math.min(wallX, wallY);
  for (const collider of colliders) {
    nearest = Math.min(
      nearest,
      rayDistanceToExpandedRect(previous.x, previous.y, directionX, directionY, collider),
    );
  }
  return Math.max(0, nearest) * 39.370_078_740_157_48;
}

function validExpectedStep(expected: RoombaWasmExpectedStep): boolean {
  const { controls, previous, dt, colliders } = expected;
  const sensorHeightInches = controls.sensorHeightInches ?? 0.5;
  return (
    [
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
    ].every(Number.isFinite) &&
    controls.wheelSpeedMps >= 0 &&
    controls.turnRateRadSec >= 0 &&
    controls.roomWidth > 2 * BUMPER_RADIUS_M &&
    controls.roomHeight > 2 * BUMPER_RADIUS_M &&
    sensorHeightInches >= 0 &&
    dt > 0 &&
    dt <= 0.25 &&
    previous.timeInMode >= 0 &&
    isMode(previous.mode) &&
    Number.isInteger(previous.randomSeed) &&
    previous.randomSeed >= 0 &&
    previous.randomSeed <= 0xffff_ffff &&
    (controls.opticalSensorEnabled === undefined ||
      typeof controls.opticalSensorEnabled === "boolean") &&
    (typeof controls.wallDistanceInches !== "number" ||
      (Number.isFinite(controls.wallDistanceInches) && controls.wallDistanceInches >= 0)) &&
    colliders.length <= 64 &&
    colliders.every(
      (collider) =>
        [collider.x, collider.y, collider.w, collider.h].every(Number.isFinite) &&
        collider.w > 0 &&
        collider.h > 0,
    )
  );
}

function validContactReceipt(result: RoombaWasmStep, expected: RoombaWasmExpectedStep): boolean {
  if (!Number.isInteger(result.contact_index)) return false;
  if (result.contact_index < -2 || result.contact_index >= expected.colliders.length) return false;

  const normalLength = Math.hypot(result.contact_normal_x, result.contact_normal_y);
  if (result.contact_index === -1) {
    return closeEnough(normalLength, 0);
  }
  if (!closeEnough(normalLength, 1, 1e-9)) return false;

  const halfRoomWidth = expected.controls.roomWidth / 2 - BUMPER_RADIUS_M;
  const halfRoomHeight = expected.controls.roomHeight / 2 - BUMPER_RADIUS_M;
  if (result.contact_index === -2) {
    const onLeft = closeEnough(result.x_m, -halfRoomWidth, 1e-9);
    const onRight = closeEnough(result.x_m, halfRoomWidth, 1e-9);
    const onBottom = closeEnough(result.y_m, -halfRoomHeight, 1e-9);
    const onTop = closeEnough(result.y_m, halfRoomHeight, 1e-9);
    return (
      (onLeft && result.contact_normal_x === 1 && result.contact_normal_y === 0) ||
      (onRight && result.contact_normal_x === -1 && result.contact_normal_y === 0) ||
      (onBottom && result.contact_normal_x === 0 && result.contact_normal_y === 1) ||
      (onTop && result.contact_normal_x === 0 && result.contact_normal_y === -1)
    );
  }

  const collider = expected.colliders[result.contact_index];
  const closestX = Math.max(
    collider.x - collider.w / 2,
    Math.min(collider.x + collider.w / 2, result.x_m),
  );
  const closestY = Math.max(
    collider.y - collider.h / 2,
    Math.min(collider.y + collider.h / 2, result.y_m),
  );
  const dx = result.x_m - closestX;
  const dy = result.y_m - closestY;
  const distance = Math.hypot(dx, dy);
  return (
    closeEnough(distance, BUMPER_RADIUS_M, 1e-8) &&
    distance > 0 &&
    closeEnough(result.contact_normal_x, dx / distance, 1e-8) &&
    closeEnough(result.contact_normal_y, dy / distance, 1e-8)
  );
}

function wheelSpeedsForMode(
  mode: RoombaState["mode"],
  timeInModeS: number,
  controls: RoombaControls,
): readonly [number, number] {
  if (mode === "straight") return [controls.wheelSpeedMps, controls.wheelSpeedMps];
  if (mode === "backup") return [-controls.wheelSpeedMps, -controls.wheelSpeedMps];
  if (mode === "turn") {
    return [
      (-controls.turnRateRadSec * TRACK_WIDTH_M) / 2,
      (controls.turnRateRadSec * TRACK_WIDTH_M) / 2,
    ];
  }
  const radiusM = 0.12 + timeInModeS * 0.045;
  const yawRateRadSec = controls.wheelSpeedMps / radiusM;
  return [
    controls.wheelSpeedMps - (yawRateRadSec * TRACK_WIDTH_M) / 2,
    controls.wheelSpeedMps + (yawRateRadSec * TRACK_WIDTH_M) / 2,
  ];
}

function nextRandomSeed(seed: number): number {
  return (Math.imul(seed, 1_103_515_245) + 12_345) & 0x7fff_ffff;
}

interface ExpectedTransition {
  finalMode: RoombaState["mode"];
  finalTimeInModeS: number;
  randomSeed: number;
  driveLeftMps: number;
  driveRightMps: number;
  headingRad: number;
  leftWheelAngleRad: number;
  rightWheelAngleRad: number;
  projectedPose: ProjectedPose;
}

function expectedTransition(expected: RoombaWasmExpectedStep): ExpectedTransition {
  const { controls, previous, dt, colliders } = expected;
  let mode = previous.mode;
  let timeInModeS = previous.timeInMode + dt;
  let randomSeed = previous.randomSeed;
  const opticalSensorEnabled = controls.opticalSensorEnabled ?? true;
  const surfaceOverlapFraction = Math.max(
    0,
    Math.min(1, 1 - Math.abs((controls.sensorHeightInches ?? 0.5) - 0.5) / 0.5),
  );
  const surfacePresent = surfaceOverlapFraction > 0.2;
  const wallDistanceInches =
    typeof controls.wallDistanceInches === "number"
      ? controls.wallDistanceInches
      : modeledWallDistanceInches(expected);
  const wallPresent = opticalSensorEnabled && wallDistanceInches <= 2.95;
  const maxX = controls.roomWidth / 2 - BUMPER_RADIUS_M;
  const maxY = controls.roomHeight / 2 - BUMPER_RADIUS_M;
  const outsideRoom =
    previous.x > maxX || previous.x < -maxX || previous.y > maxY || previous.y < -maxY;
  const embeddedInCollider = colliders.some(
    (collider) => distanceFromRect(previous.x, previous.y, collider) < BUMPER_RADIUS_M - 1e-9,
  );

  if (
    ((opticalSensorEnabled && !surfacePresent) || outsideRoom || embeddedInCollider) &&
    mode !== "backup" &&
    mode !== "turn"
  ) {
    mode = "backup";
    timeInModeS = 0;
  }
  if (wallPresent && mode !== "backup" && mode !== "turn") {
    mode = "turn";
    timeInModeS = 0;
  }
  if (mode === "backup" && timeInModeS > 0.4) {
    mode = "turn";
    timeInModeS = 0;
    randomSeed = nextRandomSeed(randomSeed);
  } else if (mode === "turn") {
    const turnDurationS = 0.4 + ((randomSeed % 100) / 100) * 1.2;
    if (timeInModeS > turnDurationS) {
      mode = "straight";
      timeInModeS = 0;
    }
  }

  const [driveLeftMps, driveRightMps] = wheelSpeedsForMode(mode, timeInModeS, controls);
  const angularSpeedRadSec = (driveRightMps - driveLeftMps) / TRACK_WIDTH_M;
  const headingRad = previous.heading + angularSpeedRadSec * dt;
  const linearSpeedMps = (driveLeftMps + driveRightMps) / 2;
  let x = previous.x;
  let y = previous.y;
  if (Math.abs(angularSpeedRadSec) <= 1e-12) {
    const distanceM = linearSpeedMps * dt;
    x += distanceM * Math.cos(previous.heading);
    y += distanceM * Math.sin(previous.heading);
  } else {
    const radiusM = linearSpeedMps / angularSpeedRadSec;
    x += radiusM * (Math.sin(headingRad) - Math.sin(previous.heading));
    y += -radiusM * (Math.cos(headingRad) - Math.cos(previous.heading));
  }

  const minX = -maxX;
  const minY = -maxY;
  let contactIndex = -1;
  let contactNormalX = 0;
  let contactNormalY = 0;
  if (x < minX) {
    x = minX;
    contactIndex = -2;
    contactNormalX = 1;
  } else if (x > maxX) {
    x = maxX;
    contactIndex = -2;
    contactNormalX = -1;
  }
  if (y < minY) {
    y = minY;
    contactIndex = -2;
    contactNormalX = 0;
    contactNormalY = 1;
  } else if (y > maxY) {
    y = maxY;
    contactIndex = -2;
    contactNormalX = 0;
    contactNormalY = -1;
  }
  colliders.forEach((collider, index) => {
    const projection = projectOutsideRect(x, y, collider);
    if (!projection.hit) return;
    x = projection.x;
    y = projection.y;
    contactIndex = index;
    contactNormalX = projection.contactNormalX;
    contactNormalY = projection.contactNormalY;
  });

  if (contactIndex !== -1 && mode !== "backup" && mode !== "turn") {
    mode = "backup";
    timeInModeS = 0;
  }
  return {
    finalMode: mode,
    finalTimeInModeS: timeInModeS,
    randomSeed,
    driveLeftMps,
    driveRightMps,
    headingRad,
    leftWheelAngleRad: previous.leftWheelAngleRad + (driveLeftMps / WHEEL_RADIUS_M) * dt,
    rightWheelAngleRad: previous.rightWheelAngleRad + (driveRightMps / WHEEL_RADIUS_M) * dt,
    projectedPose: { x, y, contactIndex, contactNormalX, contactNormalY },
  };
}

/** Decode and independently audit the authoritative owner-crate envelope. */
export function decodeRoombaWasmStep(
  raw: string,
  expected: RoombaWasmExpectedStep,
): RoombaState | null {
  try {
    if (!validExpectedStep(expected)) return null;
    const parsed = JSON.parse(raw) as {
      ok?: Partial<RoombaWasmStep>;
      refusal?: unknown;
    };
    const result = parsed.ok;
    if (
      !result ||
      parsed.refusal !== undefined ||
      !isMode(result.mode) ||
      !isRedirectReason(result.redirect_reason)
    ) {
      return null;
    }
    const finiteScalars = [
      result.x_m,
      result.y_m,
      result.heading_rad,
      result.time_in_mode_s,
      result.surface_overlap_fraction,
      result.contact_index,
      result.contact_normal_x,
      result.contact_normal_y,
      result.left_wheel_speed_mps,
      result.right_wheel_speed_mps,
      result.left_wheel_angle_rad,
      result.right_wheel_angle_rad,
      result.side_brush_angle_rad,
    ];
    if (!finiteScalars.every(finite)) return null;
    if (
      !Number.isInteger(result.random_seed) ||
      !finiteIn(result.random_seed, 0, 0xffff_ffff) ||
      !finiteIn(result.surface_overlap_fraction, 0, 1) ||
      (result.time_in_mode_s ?? -1) < 0
    ) {
      return null;
    }
    if (
      typeof result.optical_sensor_enabled !== "boolean" ||
      typeof result.surface_present !== "boolean" ||
      typeof result.wall_present !== "boolean"
    ) {
      return null;
    }

    const controls = expected.controls;
    if (
      result.optical_sensor_enabled !== (controls.opticalSensorEnabled ?? true) ||
      result.surface_present !== result.surface_overlap_fraction > 0.2
    ) {
      return null;
    }
    const expectedOverlap = Math.max(
      0,
      Math.min(1, 1 - Math.abs((controls.sensorHeightInches ?? 0.5) - 0.5) / 0.5),
    );
    if (!closeEnough(result.surface_overlap_fraction, expectedOverlap)) return null;

    const expectedReason = !result.optical_sensor_enabled
      ? "none"
      : !result.surface_present
        ? "surface-absent"
        : result.wall_present
          ? "wall-detected"
          : "none";
    if (
      result.redirect_reason !== expectedReason ||
      (!result.optical_sensor_enabled && result.wall_present)
    ) {
      return null;
    }
    const wallDistanceInches =
      typeof controls.wallDistanceInches === "number"
        ? controls.wallDistanceInches
        : modeledWallDistanceInches(expected);
    if (result.wall_present !== (result.optical_sensor_enabled && wallDistanceInches <= 2.95)) {
      return null;
    }

    const maxX = controls.roomWidth / 2 - BUMPER_RADIUS_M;
    const maxY = controls.roomHeight / 2 - BUMPER_RADIUS_M;
    if (
      Math.abs(result.x_m as number) > maxX + 1e-9 ||
      Math.abs(result.y_m as number) > maxY + 1e-9 ||
      !validContactReceipt(result as RoombaWasmStep, expected)
    ) {
      return null;
    }
    for (const collider of expected.colliders) {
      if (
        distanceFromRect(result.x_m as number, result.y_m as number, collider) <
        BUMPER_RADIUS_M - 1e-8
      ) {
        return null;
      }
    }

    const transition = expectedTransition(expected);
    if (
      result.mode !== transition.finalMode ||
      !closeEnough(result.time_in_mode_s as number, transition.finalTimeInModeS) ||
      result.random_seed !== transition.randomSeed ||
      result.contact_index !== transition.projectedPose.contactIndex ||
      !closeEnough(result.x_m as number, transition.projectedPose.x) ||
      !closeEnough(result.y_m as number, transition.projectedPose.y) ||
      !closeEnough(result.contact_normal_x as number, transition.projectedPose.contactNormalX) ||
      !closeEnough(result.contact_normal_y as number, transition.projectedPose.contactNormalY)
    ) {
      return null;
    }
    const [expectedLeft, expectedRight] = wheelSpeedsForMode(
      transition.finalMode,
      transition.finalTimeInModeS,
      controls,
    );
    if (
      !closeEnough(result.left_wheel_speed_mps as number, expectedLeft) ||
      !closeEnough(result.right_wheel_speed_mps as number, expectedRight)
    ) {
      return null;
    }
    if (
      !closeEnough(result.heading_rad as number, transition.headingRad) ||
      !closeEnough(result.left_wheel_angle_rad as number, transition.leftWheelAngleRad) ||
      !closeEnough(result.right_wheel_angle_rad as number, transition.rightWheelAngleRad)
    ) {
      return null;
    }
    const expectedBrushAngle =
      expected.previous.sideBrushAngleRad +
      60 * ((Math.abs(expectedLeft) + Math.abs(expectedRight)) / 2) * expected.dt;
    if (!closeEnough(result.side_brush_angle_rad as number, expectedBrushAngle)) return null;

    const decoded = result as RoombaWasmStep;
    return {
      x: decoded.x_m,
      y: decoded.y_m,
      heading: decoded.heading_rad,
      mode: decoded.mode,
      timeInMode: decoded.time_in_mode_s,
      randomSeed: decoded.random_seed,
      displayX: decoded.x_m,
      displayY: decoded.y_m,
      opticalSensorEnabled: decoded.optical_sensor_enabled,
      surfaceOverlapFraction: decoded.surface_overlap_fraction,
      surfacePresent: decoded.surface_present,
      wallPresent: decoded.wall_present,
      redirectReason: decoded.redirect_reason,
      contactPartId:
        decoded.contact_index === -1
          ? null
          : decoded.contact_index === -2
            ? "room-wall"
            : (expected.colliders[decoded.contact_index]?.id ?? null),
      contactNormalX: decoded.contact_normal_x,
      contactNormalY: decoded.contact_normal_y,
      leftWheelSpeedMps: decoded.left_wheel_speed_mps,
      rightWheelSpeedMps: decoded.right_wheel_speed_mps,
      leftWheelAngleRad: decoded.left_wheel_angle_rad,
      rightWheelAngleRad: decoded.right_wheel_angle_rad,
      sideBrushAngleRad: decoded.side_brush_angle_rad,
      runtimeSource: "wasm",
    };
  } catch {
    return null;
  }
}

export function ensureRoombaWasm(): Promise<RoombaKernelSource> {
  loadPromise ??= initializeRoombaWasm();
  return loadPromise;
}

async function initializeRoombaWasm(): Promise<RoombaKernelSource> {
  if (typeof window === "undefined") {
    source = "ts-fallback";
    return source;
  }
  try {
    const jsUrl = "/wasm/fs-roomba/fs_roomba_wasm.js";
    const wasmUrl = "/wasm/fs-roomba/fs_roomba_wasm_bg.wasm";
    const jsText = await fetch(jsUrl, { signal: AbortSignal.timeout(10_000) }).then((response) => {
      if (!response.ok) throw new Error(`Roomba browser glue ${response.status}`);
      return response.text();
    });
    const blobUrl = URL.createObjectURL(new Blob([jsText], { type: "text/javascript" }));
    try {
      const module = (await import(/* webpackIgnore: true */ blobUrl)) as {
        default: (moduleOrPath?: unknown) => Promise<unknown>;
        roomba_step: RoombaStepFn;
      };
      await module.default({ module_or_path: wasmUrl });
      if (typeof module.roomba_step !== "function") {
        throw new Error("roomba_step missing from browser module");
      }
      roombaStepFn = module.roomba_step;
      source = "wasm";
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  } catch (error) {
    console.warn("Failed to load fs-roomba-wasm; using typed differential-drive fallback", error);
    roombaStepFn = null;
    source = "ts-fallback";
  }
  return source;
}

function buildPacket(expected: RoombaWasmExpectedStep): Float64Array {
  const { controls, previous, dt, colliders } = expected;
  const packet = new Float64Array(PACKET_HEADER_WORDS + colliders.length * 4);
  packet.set([
    1,
    dt,
    controls.wheelSpeedMps,
    controls.turnRateRadSec,
    controls.roomWidth,
    controls.roomHeight,
    controls.sensorHeightInches ?? 0.5,
    typeof controls.wallDistanceInches === "number" ? controls.wallDistanceInches : -1,
    (controls.opticalSensorEnabled ?? true) ? 1 : 0,
    previous.x,
    previous.y,
    previous.heading,
    MODE_CODE[previous.mode],
    previous.timeInMode,
    previous.randomSeed,
    previous.leftWheelAngleRad,
    previous.rightWheelAngleRad,
    previous.sideBrushAngleRad,
  ]);
  colliders.forEach((collider, index) => {
    packet.set([collider.x, collider.y, collider.w, collider.h], PACKET_HEADER_WORDS + index * 4);
  });
  return packet;
}

export function tryRoombaWasmStep(expected: RoombaWasmExpectedStep): RoombaState | null {
  if (!roombaStepFn) return null;
  try {
    return decodeRoombaWasmStep(roombaStepFn(buildPacket(expected)), expected);
  } catch {
    return null;
  }
}
